-- scripts/reporting-candidatures-par-atterrissage-2026-11-03.sql — vue reporting.v_candidatures_par_atterrissage
-- (brief « Genève profils » v2 du 30/10/2026, §6, lot D ; D-D1 = oui, Jérôme 03/11/2026). Candidatures par mois, page
-- d'atterrissage (form_submissions.landing_page, capturée depuis le 03/09/2026), famille (blog / site / inconnue) et langue.
-- Lecture seule : vue agrégée (non modifiable), droits réservés à postgres comme les autres vues du schéma reporting.
-- Appliquée le 03/11/2026 par MCP apply_migration « reporting_candidatures_par_atterrissage_2026_11_03 » (version 20261103120441) :
-- corps = le bloc BEGIN … COMMIT ci-dessous, sans BEGIN ni COMMIT. Contrôles passés ; 24 lignes au 03/11 (inconnue 75, site 33, blog 7).
--
-- Écarts assumés avec la requête du brief (même résultat sur les données du 03/11, voir la revue du lot D) :
--   1. mois en heure de Paris (created_at AT TIME ZONE 'Europe/Paris'), comme reporting.v_candidatures_mois : les deux vues
--      donnent le même total chaque mois, y compris pour une candidature envoyée le dernier jour du mois après 23 h ;
--   2. famille « inconnue » quand landing_page est NULL (toutes les candidatures avant le 03/09/2026, et les envois sans
--      sessionStorage) — sinon ces 75 lignes seraient comptées « site » ;
--   3. security_invoker = true et REVOKE, comme reporting.v_prospects_mois et reporting.v_tableau_de_bord.
--
-- Checklist §12 (lavilla-docs/Schema_Supabase_LaVilla.md) :
--   1. vues : aucune vue existante modifiée ; form_submissions a désormais CINQ vues dépendantes (v_form_submissions_clean,
--      reporting.v_candidatures_jour / _semaine / _mois, et celle-ci) : tout DROP ou changement de type de created_at,
--      landing_page, language ou is_test devra la recréer ;
--   2. RLS : non concernée — le schéma reporting n'est pas accessible à anon / authenticated (USAGE : postgres, service_role)
--      et la vue n'a de droits que pour postgres ; 2bis. aucune contrainte CHECK ; 2ter. aucune fonction ;
--   3. entities.ts / AuditAction : non concernés (aucune écriture applicative) ;
--   4. trace : ce fichier ;
--   5. backup VPS : non concerné (une vue ne contient pas de données) ;
--   6. documentation : lavilla-docs/Schema_Supabase_LaVilla.md (§6 form_submissions : cinq vues dépendantes, et MàJ du 03/11).
BEGIN;
CREATE OR REPLACE VIEW reporting.v_candidatures_par_atterrissage
WITH (security_invoker = true) AS
SELECT
  date_trunc('month', created_at AT TIME ZONE 'Europe/Paris')::date AS mois,
  regexp_replace(regexp_replace(coalesce(landing_page, ''), '^https?://[^/]+', ''), '\?.*$', '') AS page_atterrissage,
  CASE
    WHEN landing_page IS NULL THEN 'inconnue'
    WHEN landing_page ILIKE '%/blog/%' THEN 'blog'
    ELSE 'site'
  END AS famille,
  language,
  count(*) AS candidatures
FROM public.form_submissions
WHERE is_test IS NOT TRUE
GROUP BY 1, 2, 3, 4;
COMMENT ON VIEW reporting.v_candidatures_par_atterrissage IS 'Candidatures (form_submissions hors tests) par mois (heure de Paris), page d''atterrissage, famille (blog si /blog/ dans la page, site sinon, inconnue si landing_page NULL : avant le 03/09/2026) et langue. Lot D du brief « Genève profils » du 30/10/2026, créée le 03/11/2026. Totaux mensuels = reporting.v_candidatures_mois.candidatures.';
REVOKE ALL ON reporting.v_candidatures_par_atterrissage FROM PUBLIC, anon, authenticated, service_role;
DO $c$
DECLARE bad text;
BEGIN
  SELECT string_agg(m.mois, ', ') INTO bad
  FROM (SELECT to_char(mois, 'YYYY-MM') AS mois, sum(candidatures) AS n FROM reporting.v_candidatures_par_atterrissage GROUP BY 1) m
  FULL JOIN reporting.v_candidatures_mois c ON c.mois = m.mois
  WHERE m.n IS DISTINCT FROM c.candidatures;
  IF bad IS NOT NULL THEN RAISE EXCEPTION 'totaux mensuels differents de v_candidatures_mois : %', bad; END IF;
  IF (SELECT sum(candidatures) FROM reporting.v_candidatures_par_atterrissage WHERE famille = 'blog' AND mois IN ('2026-09-01', '2026-10-01')) <> 7 THEN
    RAISE EXCEPTION 'candidatures blog de septembre et octobre <> 7';
  END IF;
  IF has_table_privilege('anon', 'reporting.v_candidatures_par_atterrissage', 'SELECT')
     OR has_table_privilege('authenticated', 'reporting.v_candidatures_par_atterrissage', 'SELECT') THEN
    RAISE EXCEPTION 'vue lisible par anon ou authenticated';
  END IF;
END $c$;
COMMIT;
-- Vérification (test du brief §10) :
--   SELECT * FROM reporting.v_candidatures_par_atterrissage WHERE mois >= '2026-09-01' ORDER BY mois DESC, candidatures DESC;
--   → famille « blog » : 09/2026 villes 4 + Lodge 1, 10/2026 vivre à Annemasse 2 (7 en tout) ; 24 lignes au 03/11/2026.
--   (Le « limit 20 » du brief coupe septembre depuis l'arrivée des lignes de novembre : filtrer par mois plutôt.)
-- Retour arrière : DROP VIEW IF EXISTS reporting.v_candidatures_par_atterrissage;  — rien d'autre ne dépend de cette vue.
