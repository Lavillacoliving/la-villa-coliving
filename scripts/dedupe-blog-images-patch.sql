-- =============================================================
-- PATCH visuel : 3 paires d'images visuellement quasi-identiques
-- (URLs distinctes mais même pièce/même image en deux formats)
-- À lancer dans Supabase → SQL Editor APRÈS le 1er script.
-- =============================================================

BEGIN;

-- ─── Paire 1 : lodge-18 + lodge-35 sont la même pièce (introduit par le 1er patch)
-- Garde lodge-18 sur "guide complet" — change lodge-35 pour un cadrage très différent
UPDATE blog_posts
SET image_url = '/images/le lodge/common areas/la villa coliving le lodge-22.webp'
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie';
-- raison : coin lecture lampe chaude → "redéfinir sa vie" / cocon perso

-- ─── Paire 2 : espace-commun.jpg + espace-commun.webp = MÊME image, deux formats (pré-existant)
UPDATE blog_posts
SET image_url = '/images/le loft/common areas/la villa coliving le loft-87.webp'
WHERE slug = 'colocation-expats-geneve-guide';
-- raison : table à manger conviviale → soirée entre expats / partage

-- ─── Paire 3 : La Villa-9 + La Villa-85 = même salon canapé jaune (pré-existant)
UPDATE blog_posts
SET image_url = '/images/le lodge/interior/la villa coliving le lodge-101.webp'
WHERE slug = 'banque-telephone-internet-frontalier-bons-plans';
-- raison : table bois + mug + carnet → installation admin / paperasse frontalier

COMMIT;

-- =============================================================
-- VÉRIF FINALE — doit retourner 0 ligne
-- =============================================================
-- SELECT image_url, COUNT(*) AS uses, array_agg(slug) AS posts
-- FROM blog_posts WHERE is_published = true
-- GROUP BY image_url HAVING COUNT(*) > 1;
--
-- + check base-name (jpg/webp variants du même fichier) :
-- SELECT regexp_replace(image_url, '\.(jpe?g|webp|png)$', '') AS base,
--        COUNT(*), array_agg(slug)
-- FROM blog_posts WHERE is_published = true
-- GROUP BY base HAVING COUNT(*) > 1;
