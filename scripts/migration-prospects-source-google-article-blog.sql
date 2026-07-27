-- ============================================================================
-- Migration : reparation de prospects_source_check (google + article_blog)
-- Date       : 2026-07-26
-- GO Jerome  : oui (contrainte + rebascule des 12 prospects « Google »)
--
-- CONTEXTE — bug silencieux decouvert le 26/07/2026
-- La migration du 07/07/2026 (attribution blog -> prospects.source) n'a JAMAIS
-- ete appliquee a la production : la contrainte n'autorisait toujours que 11
-- valeurs, sans `google` ni `article_blog`.
-- Or l'Edge Function send-candidature-email ecrit bien ces deux valeurs
-- (index.ts l.348/351 pour le canal declare, l.397 pour ?src=bloc_offre), et
-- possede un filet : si l'INSERT est rejete, elle rejoue avec `site_web`
-- (l.433-437). Resultat : rejet 23514 silencieux puis ecrasement en site_web.
--
-- Impact mesure avant correction :
--   * 12 prospects avec « Canal declare : Google » dans notes -> source=site_web
--   * 0 prospect en article_blog possible -> l'attribution des blocs offre du
--     blog n'a jamais rien enregistre (le controle a 30 jours prevu vers le
--     07/08 aurait renvoye zero et se serait lu comme « le blog ne convertit
--     pas », alors que la valeur etait ecrasee).
--
-- Checklist Schema_Supabase_LaVilla.md §12 :
--   1. Vues : aucune vue ne depend de prospects (verifie via pg_depend) -> RAS.
--   2. RLS : prospects non exposee au portail/site public -> RAS.
--   2bis. Alignement des 3 points APRES cette migration :
--         - contrainte : 13 valeurs (ci-dessous)
--         - Edge Function send-candidature-email : ecrit deja google /
--           article_blog -> AUCUN changement ni redeploy necessaire
--         - dashboard SOURCE_OPTIONS (DashboardProspectsPage.tsx) : liste deja
--           les 13 valeurs -> AUCUN changement necessaire
--         C'est bien la contrainte qui etait en retard sur les deux autres.
--   4. Trace : ce fichier.
-- ============================================================================

BEGIN;

-- 1) Contrainte : 11 -> 13 valeurs
ALTER TABLE public.prospects
  DROP CONSTRAINT IF EXISTS prospects_source_check;

ALTER TABLE public.prospects
  ADD CONSTRAINT prospects_source_check
  CHECK (source = ANY (ARRAY[
    'site_web'::text,
    'article_blog'::text,      -- <- ajout (attribution blog, ?src=bloc_offre)
    'google'::text,            -- <- ajout (canal declare)
    'facebook'::text,
    'instagram'::text,
    'whatsapp'::text,
    'messenger'::text,
    'leboncoin'::text,
    'appartager'::text,
    'roomlala'::text,
    'bouche_a_oreille'::text,
    'email'::text,
    'autre'::text
  ]));

-- 2) Rebascule des prospects dont les notes declarent Google mais qui ont ete
--    ecrases en site_web par le filet. On ne touche QUE ce cas precis.
UPDATE public.prospects
SET    source = 'google',
       updated_at = now()
WHERE  source = 'site_web'
  AND  notes ~ 'Canal d[eé]clar[eé] : Google';

COMMIT;

-- Verification :
--   SELECT source, count(*) FROM prospects GROUP BY source ORDER BY 2 DESC;
--   -> google doit apparaitre avec 12
--
-- NON TRAITE volontairement (hors perimetre du GO) : 5 prospects anterieurs au
-- mapping declarent « Bouche a oreille » (3), « Instagram » (1), « Leboncoin »
-- (1) dans leurs notes tout en etant enregistres en site_web. A arbitrer
-- separement si l'historique de ces canaux compte.
--
-- ---------------------------------------------------------------------------
-- RETOUR ARRIERE
-- BEGIN;
--   UPDATE public.prospects SET source = 'site_web'
--   WHERE source IN ('google','article_blog');
--   ALTER TABLE public.prospects DROP CONSTRAINT prospects_source_check;
--   ALTER TABLE public.prospects
--     ADD CONSTRAINT prospects_source_check
--     CHECK (source = ANY (ARRAY['whatsapp'::text,'messenger'::text,
--       'instagram'::text,'email'::text,'roomlala'::text,'leboncoin'::text,
--       'facebook'::text,'appartager'::text,'site_web'::text,
--       'bouche_a_oreille'::text,'autre'::text]));
-- COMMIT;
-- ---------------------------------------------------------------------------
