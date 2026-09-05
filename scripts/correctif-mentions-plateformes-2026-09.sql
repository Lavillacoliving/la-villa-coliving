-- ============================================================================
-- Correctif : dernieres mentions d'une plateforme concurrente (Roomlala) dans les articles
-- Date       : 2026-09-05 (Lot C0.4 du brief « Conquete IA », plan valide par Jerome le 04/09/2026)
-- GO Jerome  : A APPLIQUER PAR JEROME (SQL Editor / MCP) avant le merge de la branche
--              feat/content-infra : la garde CI scripts/check-no-competitor.mjs scanne
--              TOUT le HTML prerendu (le lot « coherence editoriale » C4 du 03/09 a deja
--              retire les autres occurrences ; il en reste une par langue, relevees en base
--              le 05/09 par ILIKE '%roomlala%').
--
-- Regle : CLAUDE.md §1 « jamais un concurrent nommé » et §4 « plateformes qui facturent le
-- locataire (Studapart, Roomlala…) ». Ancrages 100 % ASCII (technique consolidation-pilier-
-- vers-article.sql), updated_at = now() (pas de trigger), verification finale = 0 ligne.
-- ============================================================================

BEGIN;

-- 1) FR — coliving-vs-colocation-differences : liste des canaux pour trouver une colocation.
UPDATE public.blog_posts
SET    content_fr = replace(content_fr, 'oreille, Roomlala', 'oreille, plateformes de colocation'),
       updated_at = now()
WHERE  slug = 'coliving-vs-colocation-differences'
  AND  content_fr LIKE '%oreille, Roomlala%';

-- 2) EN — colocation-annemasse-ville-la-grand-ambilly : puce de la liste des sites (le FR a deja ete corrige).
UPDATE public.blog_posts
SET    content_en = replace(content_en,
         '**Roomlala**: Specialized colocation. Less pollution than Leboncoin. Bonus: see landlord and roommate ratings.',
         '**Flatshare platforms**: specialised in shared housing. Less noise than Leboncoin. Bonus: landlord and roommate ratings.'),
       updated_at = now()
WHERE  slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND  content_en LIKE '%**Roomlala**: Specialized colocation.%';

COMMIT;

-- Verification (attendu : 0 ligne) :
--   SELECT slug FROM blog_posts WHERE is_published
--     AND (content_fr ILIKE '%roomlala%' OR content_en ILIKE '%roomlala%');
-- Puis relancer le prerendu (workflow « Pre-render & Deploy ») pour regenerer les 4 fichiers HTML.
--
-- RETOUR ARRIERE : replace() inverses sur les deux memes slugs.
