-- scripts/resident-history-2026-10-09.sql — Lot L3 « Note Google et preuves » (sous-lot L0.4-bis), brief « Ingénierie des
-- créneaux » v3.1, décision D3 de Jérôme du 09/10/2026 : « 100+ résidents depuis 2021 » est conservé à condition d'être
-- soutenu par une requête ; « 99 % d'occupation sur 5 ans » est retiré du site.
-- Relecture adverse du 10/10/2026 (idempotence, CHECK, sécurité, performance, retour arrière) : corrections marquées « (10/10) ».
--
-- Source : Historique_Occupants_LaVilla_Coliving.xlsx (reconstitué le 26/06/2026 par Jérôme à partir des dossiers occupants,
-- EDL de sortie, restitutions de caution et suivis de loyers), feuille « Tous les séjours » : 96 séjours, 95 personnes,
-- no-shows et doublons exclus (feuille « À vérifier »). ∪ table tenants (dashboard = source opérationnelle depuis 02/2026),
-- filtres du brief : lease_status <> 'cancelled', hors Mont-Blanc, hors Jérôme Austin, hors chambres techniques 0/99 (10/10),
-- entrée déjà passée (10/10). Dédoublonnage sur le nom normalisé (minuscules, sans accent, lettres seules) — un même résident
-- présent dans l'historique ET dans le dashboard compte une fois.
--
-- Le bloc INSERT entre les marqueurs « >>> INSERTS » / « <<< INSERTS » est GÉNÉRÉ par scripts/import-resident-history.py
-- (lit le xlsx, ne touche jamais la base) et N'EST PAS COMMITTÉ (dépôt public, noms de personnes — relecture du 10/10/2026) :
-- `python3 -I scripts/import-resident-history.py --assemble` écrit le fichier complet dans tools/out/ (gitignoré), à coller tel quel ;
-- `--check` (défaut) valide le classeur et refuse tout nom dans le fichier du dépôt. Ne jamais éditer le bloc à la main.
--
-- Checklist §12 (lavilla-docs/Schema_Supabase_LaVilla.md) :
--  1. Vues : aucune vue existante ne dépend de resident_history (table nouvelle) ; v_social_proof est créée ici (DROP + CREATE,
--     donc rejouable même si ses colonnes changent — CREATE OR REPLACE VIEW refuse un changement de colonnes).
--  2. RLS : activée sur resident_history, AUCUNE policy → lisible par service_role seulement (noms de personnes) ; privilèges
--     retirés à anon / authenticated sur la table ET sa séquence ; seule la vue agrégée v_social_proof (aucun nom) est accordée
--     à anon / authenticated, lue par la garde CI (check-entity-facts). Vue en owner-rights volontaire (comme v_public_rooms) :
--     le linter Supabase signalera `security_definer_view` — finding accepté, ne pas « corriger » (la vue deviendrait vide).
--  2bis. Aucune contrainte CHECK existante touchée.  3. entities.ts / logAudit : rien (aucune écriture applicative).
--  4. Ce fichier est la trace de migration (pas de système formel).  5. Backup VPS : ajouter resident_history à la liste
--     TABLES de /opt/scripts/backup-supabase.sh (id bigserial triable, export paginé par order=id) — action Jérôme/VPS, hors repo.
--  6. Documentée dans Schema_Supabase_LaVilla.md § 8.4 et Infrastructure_LaVilla.md § 7 (lavilla-docs).
--
-- APPLIQUÉE le 10/10/2026 à 08:38 UTC via MCP apply_migration (version 20261010083834), GO « pour tout » de Jérôme du 10/10.
-- Appliqué par Jérôme dans le SQL Editor (règle : les migrations ne sont jamais appliquées par le site ni par Claude Code
-- sans demande explicite — GO de Jérôme du 10/10/2026 pour ce lot). Coller le fichier ASSEMBLÉ entier en UTF-8 (noms accentués).
-- Idempotent : IF NOT EXISTS, DELETE des lignes importées + INSERT (resynchronisation), CREATE OR REPLACE FUNCTION, DROP VIEW IF
-- EXISTS + CREATE VIEW, GRANT/REVOKE rejouables.
-- Via MCP apply_migration (transaction implicite) : les BEGIN/COMMIT ci-dessous provoquent un simple avertissement.

BEGIN;

CREATE TABLE IF NOT EXISTS public.resident_history (
  id            bigserial PRIMARY KEY,
  house_slug    text NOT NULL CHECK (house_slug IN ('lavilla', 'leloft', 'lelodge')),
  room_label    text,                                   -- « 5→6 » = changement de chambre pendant le séjour
  full_name     text NOT NULL,
  name_norm     text NOT NULL,                          -- minuscules, sans accent, lettres seules (clé de dédoublonnage)
  move_in       date NOT NULL,
  move_out      date,                                   -- NULL = séjour en cours au 26/06/2026, ou sortie non documentée (status = ended)
  status        text NOT NULL CHECK (status IN ('ended', 'current')),
  confidence    text NOT NULL CHECK (confidence IN ('high', 'medium', 'low')),
  source        text,                                   -- pièce qui date le séjour (EDL, caution, loyers)
  imported_from text NOT NULL DEFAULT 'Historique_Occupants_LaVilla_Coliving.xlsx (26/06/2026)',
  created_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT resident_history_move_out_after_in CHECK (move_out IS NULL OR move_out >= move_in),
  CONSTRAINT resident_history_status_dates CHECK (status <> 'current' OR move_out IS NULL),  -- un séjour terminé peut avoir une sortie inconnue (3 cas, NULL)
  CONSTRAINT resident_history_unique_stay UNIQUE (house_slug, name_norm, move_in)
);
COMMENT ON TABLE public.resident_history IS 'Historique des occupants des 3 maisons avant le dashboard (xlsx du 26/06/2026). Lecture seule ; alimente v_social_proof (preuve « 100+ résidents depuis 2021 », Lot L3 du 09/10/2026). Bloc INSERT régénéré par scripts/import-resident-history.py.';
COMMENT ON COLUMN public.resident_history.name_norm IS 'public.name_norm(full_name) : clé de dédoublonnage avec tenants (first_name || last_name).';
COMMENT ON COLUMN public.resident_history.move_out IS 'NULL si séjour en cours au 26/06/2026 (status = current) ou sortie non documentée (status = ended, confidence = low).';
COMMENT ON COLUMN public.resident_history.status IS 'État au 26/06/2026 (date du classeur), pas à ce jour : les départs postérieurs vivent dans tenants.';
ALTER TABLE public.resident_history ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.resident_history FROM anon, authenticated;
REVOKE ALL ON SEQUENCE public.resident_history_id_seq FROM anon, authenticated;  -- (10/10) surface minimale : la séquence aussi

-- Normalisation d'un nom : minuscules, accents courants retirés, lettres a-z seules (même table que scripts/import-resident-history.py,
-- qui vérifie à chaque régénération qu'aucun caractère des noms n'échappe à cette table).
CREATE OR REPLACE FUNCTION public.name_norm(txt text) RETURNS text
LANGUAGE sql IMMUTABLE PARALLEL SAFE AS $fn$
  SELECT regexp_replace(
    lower(translate(coalesce(txt, ''),
      'ÀÁÂÄÃÅàáâäãåÇçÈÉÊËèéêëÌÍÎÏìíîïÑñÒÓÔÖÕØòóôöõøÙÚÛÜùúûüÝýÿŒœÆæŠšŽž',
      'AAAAAAaaaaaaCcEEEEeeeeIIIIiiiiNnOOOOOOooooooUUUUuuuuYyyOoAaSsZz')),
    '[^a-z]', '', 'g')
$fn$;
COMMENT ON FUNCTION public.name_norm(text) IS 'Clé de dédoublonnage des résidents (Lot L3, 09/10/2026) : minuscules, sans accent, lettres a-z seules. Pure, sans accès table.';
-- (10/10) EXECUTE explicite : le contrôle EXECUTE d'une fonction appelée dans une vue se fait au nom de l'appelant (anon), pas du
-- propriétaire de la vue — sans ce GRANT, la lecture anon de v_social_proof échouerait si les privilèges par défaut changeaient.
-- Fonction pure, sans donnée : exposer /rest/v1/rpc/name_norm à anon est sans conséquence.
GRANT EXECUTE ON FUNCTION public.name_norm(text) TO anon, authenticated;

-- >>> INSERTS resident_history — généré par scripts/import-resident-history.py (ne pas éditer à la main)
-- (Volontairement VIDE dans le dépôt — relecture adverse du 10/10/2026 : ce dépôt GitHub est PUBLIC et le bloc contient les noms
--  de 96 résidents réels. Le bloc est assemblé LOCALEMENT au moment d'appliquer la migration :
--    python3 -I scripts/import-resident-history.py --assemble
--  → tools/out/resident-history-2026-10-09.local.sql (dossier gitignoré) = ce fichier avec le bloc « DELETE des lignes importées +
--  INSERT » inséré ici ; c'est CE fichier assemblé qui est collé dans le SQL Editor. `--check` (défaut, CI locale) refuse tout nom
--  dans le fichier du dépôt. Le bloc généré commence par DELETE … WHERE imported_from = '<classeur>' pour une vraie resynchronisation
--  (un rejeu après correction du classeur met à jour sorties, statuts, confiance — ON CONFLICT DO NOTHING seul ne le ferait pas).)
-- <<< INSERTS resident_history

-- Vue agrégée (aucun nom) : résidents distincts depuis l'ouverture = historique ∪ tenants dédoublonnés ; occupation par maison en
-- jours-chambre plafonnés à room_count (information : l'indicateur « 99 % » n'est plus publié ; /investisseurs publie l'arrondi
-- de occupancy_pct_all avec sa base). Recalculée à chaque lecture (~3 400 jours × ~160 séjours, < 1 s ; lue par la CI à chaque build).
-- Limites assumées (10/10) : (a) le dédoublonnage repose sur l'orthographe des noms — une graphie différente entre le classeur et
-- le dashboard compte deux personnes ; (b) un séjour « current » du classeur occupe jusqu'à aujourd'hui même si tenants enregistre
-- un départ postérieur au 26/06/2026 (surcompte borné par le plafond room_count ; corriger en bornant occ_until à la date du
-- classeur si tenants est jugé complet) ; (c) les 3 séjours terminés sans sortie documentée comptent comme résidents (1 jour d'occupation).
-- (d) tenants : lease_status <> 'cancelled' (filtre du brief) laisse passer les baux « draft » dont l'entrée est passée (4 au 10/10) —
-- comptés résidents et occupants ; current_residents applique IN ('active','signed') ; (e) une même personne dans deux maisons sur des
-- jours qui se chevauchent occupe deux chambres dans le calcul par maison (borné par room_count). À documenter dans Schema § 8.4.
DROP VIEW IF EXISTS public.v_social_proof;  -- (10/10) rejouable même si les colonnes changent
CREATE VIEW public.v_social_proof AS
WITH src AS (
  SELECT house_slug, name_norm, move_in, move_out, status FROM public.resident_history
  UNION ALL
  SELECT p.slug, public.name_norm(t.first_name || t.last_name), t.move_in_date, t.move_out_date,
         CASE WHEN t.move_out_date IS NULL THEN 'current' ELSE 'ended' END
  FROM public.tenants t JOIN public.properties p ON p.id = t.property_id
  WHERE p.slug IN ('lavilla', 'leloft', 'lelodge')                   -- (10/10) slugs (§2.2) plutôt que p.name <> 'Mont-Blanc'
    AND t.lease_status <> 'cancelled'
    AND t.room_number NOT IN (0, 99)                                 -- (10/10) chambres techniques : placeholder et comptes bot (MàJ 11/08)
    AND t.move_in_date IS NOT NULL AND t.move_in_date <= current_date  -- (10/10) un repreneur à entrée future n'est pas encore résident
    AND public.name_norm(t.first_name || t.last_name) <> 'jeromeaustin'
),
scope AS (
  -- occ_until : fin d'occupation retenue — aujourd'hui pour un séjour en cours, la sortie documentée sinon, le jour
  -- d'entrée quand la sortie d'un séjour terminé est inconnue (3 cas de l'historique : comptés comme résidents, pas comme occupation).
  SELECT house_slug, name_norm, move_in, move_out, status,
         CASE WHEN status = 'current' THEN current_date WHEN move_out IS NULL THEN move_in ELSE move_out END AS occ_until
  FROM src
),
houses AS (
  SELECT p.slug, p.room_count, (SELECT min(s.move_in) FROM scope s WHERE s.house_slug = p.slug) AS opened_on
  FROM public.properties p WHERE p.slug IN ('lavilla', 'leloft', 'lelodge')
),
days AS (
  SELECT h.slug, h.room_count, d::date AS day
  FROM houses h CROSS JOIN LATERAL generate_series(h.opened_on, current_date, interval '1 day') AS d
),
occ AS (
  SELECT d.slug, d.room_count,
         least(d.room_count, (SELECT count(DISTINCT s.name_norm) FROM scope s
                              WHERE s.house_slug = d.slug AND s.move_in <= d.day AND s.occ_until >= d.day)) AS occupied
  FROM days d
),
by_house AS (
  SELECT slug, round(100.0 * sum(occupied) / nullif(sum(room_count), 0), 1) AS occupancy_pct, count(*) AS days_measured
  FROM occ GROUP BY slug
)
SELECT
  (SELECT count(DISTINCT name_norm) FROM scope)                          AS distinct_residents_since_opening,
  (SELECT min(move_in) FROM scope)                                       AS first_move_in,
  -- (10/10) occupants courants = critère composite qui fait foi (Schema MàJ 11/08 : jamais is_active), mêmes exclusions que src.
  (SELECT count(DISTINCT public.name_norm(t.first_name || t.last_name))
     FROM public.tenants t JOIN public.properties p ON p.id = t.property_id
    WHERE p.slug IN ('lavilla', 'leloft', 'lelodge')
      AND t.lease_status IN ('active', 'signed')
      AND t.room_number NOT IN (0, 99)
      AND t.move_in_date IS NOT NULL AND t.move_in_date <= current_date
      AND (t.move_out_date IS NULL OR t.move_out_date >= current_date)
      AND public.name_norm(t.first_name || t.last_name) <> 'jeromeaustin')  AS current_residents,
  (SELECT json_object_agg(slug, json_build_object('occupancy_pct', occupancy_pct, 'days', days_measured)) FROM by_house) AS by_house,
  round(100.0 * (SELECT sum(occupied) FROM occ) / nullif((SELECT sum(room_count) FROM occ), 0), 1) AS occupancy_pct_all,
  current_date                                                           AS computed_on;
COMMENT ON VIEW public.v_social_proof IS 'Preuve sociale agrégée (Lot L3, 09/10/2026, relue le 10/10) : résidents distincts depuis l''ouverture (resident_history ∪ tenants hors cancelled / Mont-Blanc / chambres 0-99 / Jérôme Austin / entrées futures), occupants courants (critère composite), occupation en jours-chambre plafonnés. Aucune donnée nominative. Lue par scripts/check-entity-facts.mjs (STATS.totalResidents ≤ distinct_residents_since_opening).';
REVOKE ALL ON public.v_social_proof FROM anon, authenticated;  -- (10/10, après application) les privilèges par défaut du projet
                                                               -- donnaient aussi INSERT/UPDATE/DELETE sur la vue : SELECT seul.
GRANT SELECT ON public.v_social_proof TO anon, authenticated;

COMMIT;

-- ── Vérification (lecture seule, SQL Editor) ────────────────────────────────────────────────────────────────────────────
-- SELECT count(*) AS stays, count(DISTINCT name_norm) AS people, min(move_in), max(move_in) FROM public.resident_history;
--   → 96 · 95 · 2021-09-17 · 2026-06-22
-- SELECT house_slug, count(*) FROM public.resident_history GROUP BY 1 ORDER BY 1;  -- lavilla 47 · leloft 35 · lelodge 14
-- SELECT * FROM public.v_social_proof;
--   → mesuré le 10/10/2026 après application (MCP apply_migration, version 20261010083834) : distinct_residents_since_opening = 119
--     (≥ 100 ; 95 du classeur + 55 du dashboard − 31 présents dans les deux) ; first_move_in = 2021-09-17 ; current_residents = 28 ;
--     by_house = lavilla 99,5 (1 850 j) · leloft 94,4 (1 286 j) · lelodge 97,0 (282 j) ; occupancy_pct_all = 97,7 → OCCUPANCY.pct 98.
-- SELECT polname FROM pg_policy WHERE polrelid = 'public.resident_history'::regclass;  -- 0 ligne (RLS sans policy = service_role seul)
-- Depuis un terminal, clé anon (celle de src/lib/supabase.ts) :
--   curl -s "$SUPABASE_URL/rest/v1/v_social_proof?select=*" -H "apikey: $ANON"            → 1 ligne JSON, aucun nom
--   curl -s "$SUPABASE_URL/rest/v1/resident_history?select=id&limit=1" -H "apikey: $ANON" → 42501 permission denied
-- Puis : ajouter resident_history à TABLES dans /opt/scripts/backup-supabase.sh (VPS), vérifier le compteur ntfy du lendemain.

-- ── Retour arrière ──────────────────────────────────────────────────────────────────────────────────────────────────────
-- Perd les 96 lignes importées (régénérables depuis le classeur : scripts/import-resident-history.py --stdout) ; la garde CI
-- repasse en avertissement « v_social_proof absente » sans bloquer le build.
-- BEGIN; DROP VIEW IF EXISTS public.v_social_proof; DROP FUNCTION IF EXISTS public.name_norm(text); DROP TABLE IF EXISTS public.resident_history; COMMIT;
