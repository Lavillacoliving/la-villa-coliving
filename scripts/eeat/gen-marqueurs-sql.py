#!/usr/bin/env python3
"""Génère le SQL des marqueurs d'expérience E-E-A-T (brief 2026-07-06).

Lit marqueurs.json ({articles:[{slug, replacements:[{field, find, replace}]}]}),
vérifie contre la base (API REST anon) que chaque ancre apparaît EXACTEMENT UNE FOIS
dans le champ visé, puis émet un SQL 100 % ASCII (E'\\uXXXX') — pattern anti-mojibake
validé lors de la révision éditoriale de juin 2026.

Usage : python3 gen-marqueurs-sql.py marqueurs.json > SQL_A_COLLER_MARQUEURS.sql
Le script échoue (exit 1) si une ancre est absente ou multiple → rien n'est émis.
"""
import json
import subprocess
import sys
import urllib.parse

SUPABASE_URL = "https://tefpynkdxxfiefpkgitz.supabase.co"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZnB5bmtkeHhmaWVmcGtnaXR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4OTg5NDksImV4cCI6MjA4NjQ3NDk0OX0.X_Z85w6L4i1IkVevMK73hpFRClCpgh0Gh0WMY9pdDtw"

AUTHOR_SLUGS = [
    "fiscalite-frontalier-geneve-impots-2026",
    "declaration-impots-frontalier-2026",
    "salaire-suisse-net-frontalier-2026",
    "avenant-fiscal-40-frontalier-geneve",
    "teletravail-frontalier-geneve-regles-2026",
    "permis-g-frontalier-geneve",
    "allocations-familiales-frontalier-geneve-2026",
    "3e-pilier-frontalier-geneve",
    "assurance-sante-frontalier-lamal-cmu-budget",
    "guide-ressources-frontalier-geneve",
    "cout-de-la-vie-suisse-france-frontalier-2026",
    "cout-transport-frontalier-geneve-2026",
    "budget-colocation-geneve-guide-complet",
    "dossier-location-frontalier-suisse-france",
    "banque-telephone-internet-frontalier-bons-plans",
    "arnaques-logement-frontalier-geneve-eviter",
]


def fetch(slug):
    # curl plutôt qu'urllib : le Python framework macOS n'a pas les certificats racine.
    q = urllib.parse.urlencode({"select": "slug,content_fr,content_en", "slug": f"eq.{slug}"})
    out = subprocess.run(
        ["curl", "-sf", f"{SUPABASE_URL}/rest/v1/blog_posts?{q}", "-H", f"apikey: {ANON_KEY}"],
        capture_output=True, check=True, text=True,
    ).stdout
    rows = json.loads(out)
    if len(rows) != 1:
        raise SystemExit(f"ERREUR: slug introuvable en base: {slug}")
    return rows[0]


def enc(s):
    """Chaîne → littéral Postgres E'...' 100 % ASCII."""
    out = []
    for ch in s:
        o = ord(ch)
        if ch == "'":
            out.append("''")
        elif ch == "\\":
            out.append("\\\\")
        elif ch == "\n":
            out.append("\\n")
        elif ch == "\r":
            continue
        elif o < 128:
            out.append(ch)
        elif o <= 0xFFFF:
            out.append(f"\\u{o:04x}")
        else:
            out.append(f"\\U{o:08x}")
    return "E'" + "".join(out) + "'"


def main(path):
    data = json.load(open(path, encoding="utf-8"))
    errors = []
    stmts = []
    n_marq = 0
    for art in data["articles"]:
        slug = art["slug"]
        row = fetch(slug)
        for rep in art.get("replacements", []):
            field, find, repl = rep["field"], rep["find"], rep["replace"]
            content = row.get(field) or ""
            count = content.count(find)
            if count != 1:
                errors.append(f"{slug} / {field}: ancre trouvée {count} fois (attendu 1): {find[:80]!r}")
                continue
            if find == repl:
                errors.append(f"{slug} / {field}: find == replace")
                continue
            stmts.append(
                f"-- {slug} ({field})\n"
                f"UPDATE blog_posts SET {field} = REPLACE({field}, {enc(find)}, {enc(repl)}), "
                f"updated_at = NOW() WHERE slug = '{slug}';"
            )
            n_marq += 1
    if errors:
        for e in errors:
            print(f"ERREUR ANCRAGE: {e}", file=sys.stderr)
        raise SystemExit(1)

    print("-- ============================================================")
    print("-- E-E-A-T 2026-07-06 — 16 articles YMYL")
    print("-- 1) Auteur nommé (Jerome Austin) ; 2) marqueurs d'experience.")
    print(f"-- {n_marq} marqueurs, ancres verifiees uniques contre la base.")
    print("-- SQL 100% ASCII (E'\\uXXXX') — coller tel quel dans Supabase.")
    print("-- ============================================================")
    print()
    print("-- 1) Signature auteur nommee sur les 16 articles YMYL")
    slugs = ",\n  ".join(f"'{s}'" for s in AUTHOR_SLUGS)
    print(f"UPDATE blog_posts SET author = 'Jerome Austin' WHERE slug IN (\n  {slugs}\n);")
    print()
    print("-- 2) Marqueurs d'experience (retour de terrain, zero changement factuel)")
    for s in stmts:
        print(s)
        print()


if __name__ == "__main__":
    main(sys.argv[1])
