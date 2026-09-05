-- ============================================================================
-- Migration : valeur dediee `assistant_ia` dans prospects_source_check
--             + colonne `src_assistant_ia` dans reporting.v_candidatures_mois
-- Date       : 2026-09-05 (Lot S3 du brief « Socle entite », plan valide par Jerome le 04/09/2026)
-- GO Jerome  : A APPLIQUER PAR JEROME (MCP apply_migration ou SQL Editor) AVANT le
--              deploiement de l'Edge send-candidature-email v18 et avant le merge du front.
--
-- CONTEXTE
-- Baseline IA du 03/09/2026 : les assistants (ChatGPT, Perplexity, Gemini, Claude,
-- Google AI Mode) recommandent La Villa dans 50 % des reponses. Pour mesurer l'effet
-- des lots « presence IA », le select « Comment as-tu entendu parler de nous ? » du
-- formulaire /candidature gagne un choix « Assistant IA (ChatGPT, Perplexity,
-- Gemini...) » (valeur front `ai-assistant`). L'Edge v18 le mappe vers `assistant_ia`.
-- Sans cette migration, la contrainte refuserait la valeur (23514) et le filet de
-- l'Edge ecrirait `site_web` avec « Canal declare : Assistant IA » en notes (bug
-- silencieux du 26/07/2026, cf. migration-prospects-source-google-article-blog.sql).
--
-- Checklist Schema_Supabase_LaVilla.md §12 :
--   1. Vues : aucune vue ne depend de prospects. reporting.v_candidatures_mois
--      depend de form_submissions (pas de prospects) et bucketise la valeur BRUTE
--      du select (`form_submissions.source`, sans contrainte) : on lui ajoute une
--      colonne `src_assistant_ia` EN FIN de liste (CREATE OR REPLACE autorise l'ajout
--      de colonnes en queue ; aucune colonne existante n'est renommee ni deplacee).
--      v_form_submissions_clean et bulletin_seo_metrics : pas de liste fermee -> RAS.
--   2. RLS : prospects non exposee au site public -> RAS.
--   2bis. ALIGNEMENT OBLIGATOIRE DES 3 POINTS, dans cet ordre :
--         a) cette contrainte (16 valeurs) ;
--         b) Edge send-candidature-email v18 : CHANNEL_LABELS["ai-assistant"] = "Assistant IA",
--            PROSPECT_SOURCE_MAP["ai-assistant"] = "assistant_ia", deployee DEPUIS main ;
--         c) src/lib/entities.ts PROSPECT_SOURCE_OPTIONS : ['assistant_ia', 'Assistant IA']
--            (dropdown du dashboard Prospects) + option du formulaire JoinPageV4.
--         Sans (a) avant (b) : rejet 23514 puis ecrasement en site_web.
--   3. entities.ts : cf. 2bis-c.
--   4. Trace : ce fichier.
--   6. Mettre a jour Schema_Supabase_LaVilla.md (tableau `source`, 16 valeurs ; MaJ vue).
-- ============================================================================

BEGIN;

-- 1) Contrainte : 15 -> 16 valeurs (ordre = pg_get_constraintdef du 04/09/2026)
ALTER TABLE public.prospects
  DROP CONSTRAINT IF EXISTS prospects_source_check;

ALTER TABLE public.prospects
  ADD CONSTRAINT prospects_source_check
  CHECK (source = ANY (ARRAY[
    'whatsapp'::text,
    'messenger'::text,
    'instagram'::text,
    'email'::text,
    'roomlala'::text,
    'leboncoin'::text,
    'facebook'::text,
    'appartager'::text,
    'site_web'::text,
    'bouche_a_oreille'::text,
    'autre'::text,
    'article_blog'::text,
    'google'::text,
    'parrainage'::text,
    'google_maps'::text,
    'assistant_ia'::text        -- <- ajout (canal declare « Assistant IA »)
  ]));

-- 2) Rebascule des prospects eventuellement entres via le choix « Assistant IA »
--    avant la migration (filet Edge : enregistres en `site_web`, canal exact en notes).
UPDATE public.prospects
SET    source = 'assistant_ia',
       updated_at = now()
WHERE  source = 'site_web'
  AND  notes ~ 'Canal d[eé]clar[eé] : Assistant IA';

-- 3) Vue mensuelle du tableau de bord : bucket dedie, ajoute EN FIN de colonnes.
--    Definition = pg_get_viewdef('reporting.v_candidatures_mois') du 04/09/2026
--    (migration reporting_candidatures_utm_virtuels_2026_09_03), inchangee sauf la
--    derniere colonne. Regle inchangee : « payant » = gclid non nul OU utm_medium = cpc.
CREATE OR REPLACE VIEW reporting.v_candidatures_mois AS
 SELECT to_char(date_trunc('month'::text, (created_at AT TIME ZONE 'Europe/Paris'::text)), 'YYYY-MM'::text) AS mois,
    count(*) AS candidatures,
    count(*) FILTER (WHERE NOT (gclid IS NOT NULL OR COALESCE(utm_medium, ''::text) = 'cpc'::text)) AS org_direct,
    count(*) FILTER (WHERE gclid IS NOT NULL OR COALESCE(utm_medium, ''::text) = 'cpc'::text) AS ads,
    count(*) FILTER (WHERE NOT (gclid IS NOT NULL OR COALESCE(utm_medium, ''::text) = 'cpc'::text) AND (COALESCE(source, ''::text) <> ALL (ARRAY['leboncoin'::text, 'roomlala'::text]))) AS organique_hors_portails,
    count(*) FILTER (WHERE language = 'fr'::text) AS fr,
    count(*) FILTER (WHERE language = 'en'::text) AS en,
    count(*) FILTER (WHERE source = 'google'::text) AS src_google,
    count(*) FILTER (WHERE source = 'other'::text) AS src_autre,
    count(*) FILTER (WHERE source = ANY (ARRAY['word-of-mouth'::text, 'resident-referral'::text, 'resident'::text])) AS src_bouche_a_oreille,
    count(*) FILTER (WHERE source = ANY (ARRAY['facebook'::text, 'instagram'::text, 'whatsapp'::text])) AS src_social_messagerie,
    count(*) FILTER (WHERE source = ANY (ARRAY['google-maps'::text, 'maps'::text])) AS src_maps,
    count(*) FILTER (WHERE source = ANY (ARRAY['leboncoin'::text, 'roomlala'::text])) AS src_portails,
    count(*) FILTER (WHERE source IS NULL) AS src_non_renseigne,
    round(100.0 * count(*) FILTER (WHERE source = 'other'::text)::numeric / NULLIF(count(*), 0)::numeric, 1) AS part_autre_pct,
    count(*) FILTER (WHERE (gclid IS NOT NULL OR COALESCE(utm_medium, ''::text) = 'cpc'::text) AND utm_term IS NOT NULL) AS ads_avec_utm_term,
    round(100.0 * count(*) FILTER (WHERE (gclid IS NOT NULL OR COALESCE(utm_medium, ''::text) = 'cpc'::text) AND utm_term IS NOT NULL)::numeric / NULLIF(count(*) FILTER (WHERE gclid IS NOT NULL OR COALESCE(utm_medium, ''::text) = 'cpc'::text), 0)::numeric, 1) AS ads_utm_term_pct,
    count(*) FILTER (WHERE source = 'ai-assistant'::text) AS src_assistant_ia   -- <- ajout (Lot S3)
   FROM form_submissions
  WHERE COALESCE(is_test, false) = false
  GROUP BY (to_char(date_trunc('month'::text, (created_at AT TIME ZONE 'Europe/Paris'::text)), 'YYYY-MM'::text));

COMMIT;

-- Verification :
--   SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conname = 'prospects_source_check';  -- 16 valeurs
--   SELECT source, count(*) FROM prospects GROUP BY source ORDER BY 2 DESC;
--   SELECT mois, candidatures, src_assistant_ia FROM reporting.v_candidatures_mois ORDER BY mois DESC LIMIT 3;
--
-- Test de bout en bout (apres deploiement Edge v18 + merge du front) :
--   /candidature?test=1 (FR puis /en/candidature?test=1), source « Assistant IA », envoyer ;
--   SELECT source, language, is_test FROM form_submissions ORDER BY created_at DESC LIMIT 2;  -- 'ai-assistant'
--   SELECT source, notes FROM prospects ORDER BY created_at DESC LIMIT 2;  -- 'assistant_ia' + « Canal declare : Assistant IA »
--
-- ---------------------------------------------------------------------------
-- RETOUR ARRIERE
-- BEGIN;
--   UPDATE public.prospects SET source = 'site_web' WHERE source = 'assistant_ia';
--   ALTER TABLE public.prospects DROP CONSTRAINT prospects_source_check;
--   ALTER TABLE public.prospects
--     ADD CONSTRAINT prospects_source_check
--     CHECK (source = ANY (ARRAY['whatsapp'::text,'messenger'::text,
--       'instagram'::text,'email'::text,'roomlala'::text,'leboncoin'::text,
--       'facebook'::text,'appartager'::text,'site_web'::text,
--       'bouche_a_oreille'::text,'autre'::text,'article_blog'::text,
--       'google'::text,'parrainage'::text,'google_maps'::text]));
--   -- Vue : une colonne ne se retire pas par CREATE OR REPLACE -> DROP VIEW puis recreer
--   -- avec la definition du 03/09 (scripts/attribution-landing-2026-09-03.sql, partie 5).
-- COMMIT;
-- ---------------------------------------------------------------------------
