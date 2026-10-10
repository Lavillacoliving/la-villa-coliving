#!/usr/bin/env python3
"""Régénère le bloc INSERT de scripts/resident-history-2026-10-09.sql depuis le xlsx de Jérôme (Lot L3, 10/10/2026).

Source : « Historique_Occupants_LaVilla_Coliving.xlsx », feuille « Tous les séjours » (reconstitué le 26/06/2026), qui vit
HORS du repo. Ce script lit le classeur, vérifie chaque ligne, et produit le SQL des INSERT — rien d'autre :
  - il n'ouvre AUCUNE connexion réseau et n'écrit JAMAIS en base (la migration est appliquée par Jérôme, SQL Editor) ;
  - les noms de personnes ne sortent JAMAIS dans le dépôt (public) : ni dans le fichier SQL committé, ni dans la sortie de --check.
    Le bloc INSERT est assemblé localement (--assemble → tools/out/, gitignoré) au moment d'appliquer la migration (relecture 10/10).

Usage (depuis la racine du repo) :
  python3 -I scripts/import-resident-history.py             # --check (défaut) : valide le classeur, vérifie que le SQL du dépôt
                                                            #   porte les marqueurs et AUCUN nom (garde anti-fuite, exit 1 sinon)
  python3 -I scripts/import-resident-history.py --assemble  # écrit la migration complète (bloc DELETE+INSERT inséré) dans
                                                            #   tools/out/resident-history-2026-10-09.local.sql (--out pour un autre chemin)
  python3 -I scripts/import-resident-history.py --stdout    # imprime le bloc DELETE+INSERT (contient les noms)
  options : --xlsx <chemin du classeur>   --sql <chemin du fichier de migration>   --out <fichier assemblé>

Code de sortie : 0 = OK ; 1 = noms présents dans le SQL du dépôt (--check) ou anomalie dans le classeur (rien n'est écrit).
Dépendance : openpyxl (python3 -m pip install openpyxl).

Règles appliquées (identiques à celles de la table et de la fonction SQL public.name_norm) :
  - maison « La Villa » / « Le Loft » / « Le Lodge » → slugs SANS tiret lavilla / leloft / lelodge (entities.ts) ;
  - statut « Terminé » / « En cours » → ended / current ; confiance « Élevée » / « Moyenne » / « Faible » → high / medium / low ;
  - date de sortie : cellule date → date ; vide → NULL (séjour en cours) ; texte « n.d. » → NULL, admis seulement pour un séjour
    « Terminé » de confiance « Faible » (sortie non documentée — 3 cas au 26/06/2026) ;
  - name_norm = minuscules, accents de la table translate retirés, lettres a-z seules — même table que la fonction SQL ; le script
    avertit si une normalisation Unicode (NFKD) donnerait un résultat différent (caractère hors table → à ajouter des deux côtés) ;
  - clé unique (house_slug, name_norm, move_in), move_out ≥ move_in, « En cours » ⇔ sortie vide.
"""
from __future__ import annotations

import argparse
import datetime as dt
import re
import sys
import unicodedata
from pathlib import Path

HERE = Path(__file__).resolve().parent
DEFAULT_SQL = HERE / "resident-history-2026-10-09.sql"
DEFAULT_XLSX = (
    Path.home() / "Documents" / "La Villa Group" / "2 - GESTION DES OCCUPANTS" / "Historique_Occupants_LaVilla_Coliving.xlsx"
)
SHEET = "Tous les séjours"
MARK_BEGIN = "-- >>> INSERTS resident_history — généré par scripts/import-resident-history.py (ne pas éditer à la main)"
MARK_END = "-- <<< INSERTS resident_history"

HOUSE = {"La Villa": "lavilla", "Le Loft": "leloft", "Le Lodge": "lelodge"}
STATUS = {"Terminé": "ended", "En cours": "current"}
CONFIDENCE = {"Élevée": "high", "Moyenne": "medium", "Faible": "low"}
EXIT_UNKNOWN = {"n.d.", "n.d", "nd", "?", "—", "-"}  # textes admis dans « Date de sortie » = sortie non documentée

# Même table que public.name_norm(text) dans le SQL — les deux doivent rester identiques.
SQL_FROM = "ÀÁÂÄÃÅàáâäãåÇçÈÉÊËèéêëÌÍÎÏìíîïÑñÒÓÔÖÕØòóôöõøÙÚÛÜùúûüÝýÿŒœÆæŠšŽž"
SQL_TO = "AAAAAAaaaaaaCcEEEEeeeeIIIIiiiiNnOOOOOOooooooUUUUuuuuYyyOoAaSsZz"
assert len(SQL_FROM) == len(SQL_TO), "table translate incohérente"
_TRANSLATE = str.maketrans(SQL_FROM, SQL_TO)


def name_norm(txt: str) -> str:
    """Équivalent exact de public.name_norm(text) : lower(translate(...)) puis suppression de tout sauf a-z."""
    return re.sub(r"[^a-z]", "", (txt or "").translate(_TRANSLATE).lower())


def name_norm_nfkd(txt: str) -> str:
    """Normalisation de contrôle (Unicode NFKD) : si elle diverge de name_norm, un caractère manque à la table."""
    s = unicodedata.normalize("NFKD", txt or "")
    s = "".join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"[^a-z]", "", s.lower())


def q(v) -> str:
    if v is None:
        return "NULL"
    if isinstance(v, (dt.date, dt.datetime)):
        return "'" + v.strftime("%Y-%m-%d") + "'"
    return "'" + str(v).replace("'", "''") + "'"


def to_date(v, what: str, line: int, errors: list[str]):
    if isinstance(v, dt.datetime):
        if v.hour or v.minute or v.second:
            errors.append(f"ligne {line} : {what} porte une heure ({v.time()}) — attendu une date pure")
        return v.date()
    if isinstance(v, dt.date):
        return v
    errors.append(f"ligne {line} : {what} n'est pas une date ({type(v).__name__} {v!r:.20})")
    return None


def read_rows(xlsx: Path):
    try:
        import openpyxl  # noqa: WPS433 — dépendance optionnelle, importée tard pour un message clair
    except ImportError:
        sys.exit("openpyxl manquant : python3 -m pip install openpyxl")
    if not xlsx.is_file():
        sys.exit(f"classeur introuvable : {xlsx}")
    wb = openpyxl.load_workbook(xlsx, read_only=True, data_only=True)
    if SHEET not in wb.sheetnames:
        sys.exit(f"feuille « {SHEET} » absente du classeur (feuilles : {len(wb.sheetnames)})")
    rows = list(wb[SHEET].iter_rows(values_only=True))
    header_idx = next(
        (i for i, r in enumerate(rows) if len(r) > 2 and r[0] == "Maison" and r[2] == "Locataire"), None
    )
    if header_idx is None:
        sys.exit("en-tête « Maison | Chambre | Locataire | … » introuvable")
    expected = ["Maison", "Chambre", "Locataire", "Date d'entrée", "Date de sortie", "Durée (mois)", "Statut", "Confiance", "Source / Notes"]
    got = [c for c in rows[header_idx][: len(expected)]]
    if got != expected:
        sys.exit(f"colonnes inattendues : {got}")
    return [(header_idx + 1 + k, r) for k, r in enumerate(rows[header_idx + 1 :])]  # (n° de ligne 1-based, valeurs)


def build(xlsx: Path):
    """Retourne (lignes SQL VALUES, résumé, erreurs, avertissements) — jamais de nom dans résumé/erreurs/avertissements."""
    errors: list[str] = []
    warnings: list[str] = []
    values: list[str] = []
    seen: set[tuple[str, str, dt.date]] = set()
    people: set[str] = set()
    stats = {"stays": 0, "by_house": {}, "ended": 0, "current": 0, "exit_null_ended": 0, "conf": {}, "min_in": None, "max_in": None}

    for line, r in read_rows(xlsx):
        r = tuple(r) + (None,) * (9 - len(r))
        house, room, name, d_in, d_out, _dur, status, conf, source = r[:9]
        if not (name and str(name).strip()):
            continue  # ligne vide / séparateur
        name = str(name).strip()
        if house not in HOUSE:
            errors.append(f"ligne {line} : maison inconnue {house!r}")
            continue
        if status not in STATUS:
            errors.append(f"ligne {line} : statut inconnu {status!r}")
            continue
        if conf not in CONFIDENCE:
            errors.append(f"ligne {line} : confiance inconnue {conf!r}")
            continue
        move_in = to_date(d_in, "la date d'entrée", line, errors)
        if move_in is None:
            continue
        if d_out is None or (isinstance(d_out, str) and not d_out.strip()):
            move_out = None
        elif isinstance(d_out, str):
            if d_out.strip().lower() not in EXIT_UNKNOWN:
                errors.append(f"ligne {line} : date de sortie texte non reconnue ({d_out.strip()!r:.20})")
                continue
            if STATUS[status] != "ended" or CONFIDENCE[conf] != "low":
                errors.append(f"ligne {line} : sortie « n.d. » admise seulement pour un séjour Terminé de confiance Faible")
                continue
            move_out = None
        else:
            move_out = to_date(d_out, "la date de sortie", line, errors)
            if move_out is None:
                continue
        st = STATUS[status]
        if st == "current" and move_out is not None:
            errors.append(f"ligne {line} : « En cours » avec une date de sortie")
            continue
        if move_out is not None and move_out < move_in:
            errors.append(f"ligne {line} : sortie avant entrée")
            continue
        norm = name_norm(name)
        if not norm:
            errors.append(f"ligne {line} : nom vide après normalisation")
            continue
        if norm != name_norm_nfkd(name):
            warnings.append(f"ligne {line} : un caractère du nom n'est pas dans la table translate (name_norm ≠ NFKD) — à ajouter dans le SQL ET ici")
        key = (HOUSE[house], norm, move_in)
        if key in seen:
            errors.append(f"ligne {line} : doublon de clé (maison, nom normalisé, entrée)")
            continue
        seen.add(key)
        people.add(norm)
        room_label = str(room).strip() if room not in (None, "") else None
        src = str(source).strip() if source not in (None, "") else None
        values.append(
            "  (" + ", ".join([q(HOUSE[house]), q(room_label), q(name), q(norm), q(move_in), q(move_out), q(st), q(CONFIDENCE[conf]), q(src)]) + ")"
        )
        stats["stays"] += 1
        stats["by_house"][HOUSE[house]] = stats["by_house"].get(HOUSE[house], 0) + 1
        stats[st] += 1
        stats["conf"][CONFIDENCE[conf]] = stats["conf"].get(CONFIDENCE[conf], 0) + 1
        if st == "ended" and move_out is None:
            stats["exit_null_ended"] += 1
        stats["min_in"] = move_in if stats["min_in"] is None else min(stats["min_in"], move_in)
        stats["max_in"] = move_in if stats["max_in"] is None else max(stats["max_in"], move_in)
    stats["people"] = len(people)
    return values, stats, errors, warnings


IMPORTED_FROM = "Historique_Occupants_LaVilla_Coliving.xlsx (26/06/2026)"  # = DEFAULT de la colonne imported_from (SQL)
DEFAULT_OUT = HERE.parent / "tools" / "out" / "resident-history-2026-10-09.local.sql"  # tools/out est gitignoré
INSERT_HEAD = "INSERT INTO public.resident_history (house_slug, room_label, full_name, name_norm, move_in, move_out, status, confidence, source) VALUES"


def render(values: list[str]) -> str:
    """Bloc à insérer entre les marqueurs : resynchronisation (DELETE des lignes du classeur) puis INSERT — même transaction."""
    delete = f"DELETE FROM public.resident_history WHERE imported_from = '{IMPORTED_FROM}';  -- resynchronisation du classeur\n"
    return delete + INSERT_HEAD + "\n" + ",\n".join(values) + "\nON CONFLICT ON CONSTRAINT resident_history_unique_stay DO NOTHING;\n"


def names_in_repo_sql(block: str) -> bool:
    """Vrai si le bloc du fichier committé contient des lignes de données (noms) — ne doit jamais arriver."""
    return "INSERT INTO" in block or re.search(r"^\s*\('(?:lavilla|leloft|lelodge)',", block, re.M) is not None


def split_sql(sql_text: str):
    """Retourne (avant, bloc courant, après) autour des marqueurs ; sys.exit si les marqueurs manquent."""
    b = sql_text.find(MARK_BEGIN)
    e = sql_text.find(MARK_END)
    if b < 0 or e < 0 or e < b:
        sys.exit(f"marqueurs absents ou inversés dans le fichier SQL ({MARK_BEGIN[:24]}… / {MARK_END})")
    b_end = sql_text.index("\n", b) + 1
    return sql_text[:b_end], sql_text[b_end:e], sql_text[e:]


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--xlsx", type=Path, default=DEFAULT_XLSX)
    ap.add_argument("--sql", type=Path, default=DEFAULT_SQL)
    ap.add_argument("--out", type=Path, default=DEFAULT_OUT, help="fichier assemblé (--assemble) ; défaut tools/out/…local.sql")
    mode = ap.add_mutually_exclusive_group()
    mode.add_argument("--check", action="store_true", help="valide le classeur + garde anti-fuite sur le SQL du dépôt (défaut)")
    mode.add_argument("--assemble", action="store_true", help="écrit la migration complète (bloc inséré) dans --out, hors dépôt")
    mode.add_argument("--stdout", action="store_true", help="imprime le bloc DELETE+INSERT (noms inclus)")
    a = ap.parse_args()

    values, s, errors, warnings = build(a.xlsx)
    for w in warnings:
        print("⚠️ ", w, file=sys.stderr)
    if errors:
        for e in errors:
            print("❌ ", e, file=sys.stderr)
        print(f"{len(errors)} anomalie(s) dans le classeur — rien n'est écrit.", file=sys.stderr)
        return 1
    block = render(values)
    by_house = " · ".join(f"{k} {v}" for k, v in sorted(s["by_house"].items()))
    summary = (
        f"{s['stays']} séjours ({by_house}), {s['people']} personnes distinctes (name_norm), "
        f"{s['ended']} terminés dont {s['exit_null_ended']} sans sortie documentée, {s['current']} en cours ; "
        f"confiance {s['conf']} ; entrées du {s['min_in']} au {s['max_in']} ; "
        f"{sum(1 for ch in block if ord(ch) > 127)} caractère(s) non ASCII dans le SQL (UTF-8 attendu au collage)."
    )

    if a.stdout:
        sys.stdout.write(block)
        print(summary, file=sys.stderr)
        return 0

    sql_text = a.sql.read_text(encoding="utf-8")
    before, current, after = split_sql(sql_text)
    if names_in_repo_sql(current):
        print(f"❌ {a.sql.name} : le bloc entre les marqueurs contient des données nominatives — le dépôt est PUBLIC. "
              f"Retirer le bloc (le placeholder commenté suffit) et ne JAMAIS le committer.", file=sys.stderr)
        return 1
    if a.assemble:
        a.out.parent.mkdir(parents=True, exist_ok=True)
        a.out.write_text(before + block + after, encoding="utf-8")
        print(f"✍️  migration assemblée → {a.out} ({len(block.splitlines())} lignes insérées entre les marqueurs ; hors dépôt) — {summary}")
        return 0
    # --check (défaut)
    print(f"✅ {a.sql.name} : marqueurs présents, aucun nom dans le dépôt ; classeur valide — {summary}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
