-- =============================================================
-- Dédoublonnage des images du blog (table blog_posts dans Supabase)
-- 5 doublons identifiés sur le live → 9 articles à réaffecter
-- (le 1er article de chaque groupe garde son image actuelle)
-- =============================================================
-- À lancer dans Supabase → SQL Editor.
-- Vérifier d'abord avec le SELECT en bas du fichier.

BEGIN;

-- ─── Groupe 1 : /images/espace-commun.jpg (2 posts) ──────────
-- Garde : "Coliving à Annemasse : la solution premium pour les frontaliers genevois"
UPDATE blog_posts
SET image_url = '/images/le lodge/common areas/la villa coliving le lodge-18.webp'
WHERE slug = 'coliving-geneve-frontalier-guide-complet';
-- raison : grand salon cuir convivial → cohérent avec un "guide complet"

-- ─── Groupe 2 : /images/la villa yoga.webp (3 posts) ─────────
-- Garde : "Vie quotidienne frontalier Genève : courses, sport, sorties"
UPDATE blog_posts
SET image_url = '/images/le lodge/common areas/la villa coliving le lodge-35.webp'
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie';
-- raison : salon cosy multi-canapés → "redéfinir sa vie" / sentiment de chez-soi

UPDATE blog_posts
SET image_url = '/images/le loft/exterior/la villa coliving le loft-9.webp'
WHERE slug = '5-erreurs-eviter-recherche-logement-frontalier';
-- raison : façade extérieure → recherche de logement / visite

-- ─── Groupe 3 : /images/la villa jardin.webp (4 posts) ───────
-- Garde : "Coliving à Annemasse : L'Alternative Premium pour Vivre à Deux Pas de Genève"
UPDATE blog_posts
SET image_url = '/images/la villa/common areas/La Villa-41.webp'
WHERE slug = 'coliving-tendance-habitat-jeunes-professionnels-2024';
-- raison : salle de jeux avec babyfoots → jeunes professionnels

UPDATE blog_posts
SET image_url = '/images/la villa/amenities/La Villa-26.webp'
WHERE slug = 'vie-communautaire-coliving-temoignages';
-- raison : étagère jeux de société + piano → vie communautaire

UPDATE blog_posts
SET image_url = '/images/le loft/common areas/la villa coliving le loft-62.webp'
WHERE slug = 'coliving-vs-colocation-differences';
-- raison : salon moderne lumineux → look coliving haut de gamme

-- ─── Groupe 4 : /images/Le loft salon.webp (3 posts) ─────────
-- Garde : "5 erreurs à éviter quand on cherche un logement en tant que frontalier"
UPDATE blog_posts
SET image_url = '/images/la villa/exterior/La Villa-69.webp'
WHERE slug = 'transport-annemasse-geneve-leman-express';
-- raison : extérieur ensoleillé avec rue en arrière-plan → mobilité / accès

UPDATE blog_posts
SET image_url = '/images/la villa/common areas/La Villa-168.webp'
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly';
-- raison : véranda/terrasse résidentielle → quartier pavillonnaire d'Annemasse

-- ─── Groupe 5 : /images/what-is-coliving-and-why-is-it-so-popular-2.webp (2 posts) ──
-- Garde : "Qu'est-ce que le coliving et pourquoi c'est important en 2025"
UPDATE blog_posts
SET image_url = '/images/le lodge/common areas/la villa coliving le lodge-46.webp'
WHERE slug = 'coliving-geneve-frontaliers-guide-complet';
-- raison : salon murs bleus moderne → guide complet (visuel distinct du Groupe 1)

COMMIT;

-- =============================================================
-- VÉRIFICATION : à exécuter après le COMMIT pour confirmer
-- qu'aucune image n'est utilisée plus d'une fois.
-- =============================================================
-- SELECT image_url, COUNT(*) AS uses, array_agg(slug) AS posts
-- FROM blog_posts
-- WHERE is_published = true
-- GROUP BY image_url
-- HAVING COUNT(*) > 1
-- ORDER BY uses DESC;
-- (résultat attendu : 0 ligne)
