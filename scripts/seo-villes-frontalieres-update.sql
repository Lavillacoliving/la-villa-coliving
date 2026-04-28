-- SEO update : article ou-habiter-frontalier-suisse-villes-france-pas-cher
-- Date : 2026-04-28
-- Objectifs :
--   1. Capter keyword "villes frontalières suisses" (1 900/mois GKP) — Decision #2
--   2. Réécrire excerpt < 160c (l'actuel = 268c, tronqué en SERP)
--   3. Fix bug critique 2 H1 dans le DOM (audit P0-1) — retirer la première ligne `# H1` du content_fr
--      Le composant BlogPostPage rend déjà <h1>{title}</h1>, le `# H1` au début du content_fr
--      crée un second <h1> via ReactMarkdown → violation Google guidelines.
--
-- Avant :
--   title_fr   = "Où habiter frontalier Suisse ? 7 villes côté France" (50c → 71c avec suffix)
--   excerpt_fr = 268c (au-dessus de 160c)
--   content_fr commence par `# Où habiter quand on est frontalier suisse ? Le guide des 7 villes côté France`
-- Après :
--   title_fr   = "Top 7 villes frontalières suisses 2026" (39c → 60c avec suffix " | La Villa Coliving")
--   excerpt_fr = 147c
--   content_fr commence directement par l'intro (le H1 redondant supprimé)

UPDATE blog_posts
SET
  title_fr   = 'Top 7 villes frontalières suisses 2026',
  excerpt_fr = 'Top 7 villes frontalières suisses où habiter côté France en 2026. Annemasse, Gaillard, Saint-Julien... Loyers 600-1100€, trajet Genève en 15 min.',
  -- Retire la 1re ligne `# Où habiter quand on est frontalier suisse ? Le guide des 7 villes côté France`
  -- + lignes vides immédiatement suivantes. Marche aussi si l'article a déjà été retravaillé manuellement.
  content_fr = regexp_replace(
    content_fr,
    '^#\s+Où habiter quand on est frontalier suisse[^\n]*\n+',
    ''
  ),
  updated_at = NOW()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher';

-- Vérification
SELECT
  slug,
  title_fr,
  LENGTH(title_fr) AS title_len,
  LENGTH(title_fr) + LENGTH(' | La Villa Coliving') AS title_total_len,
  excerpt_fr,
  LENGTH(excerpt_fr) AS excerpt_len,
  -- Premiers 80c du content : doit commencer par 'Vous avez décroché' ou similaire (PAS par '#')
  LEFT(content_fr, 80) AS content_first_chars,
  CASE
    WHEN content_fr LIKE '#%' THEN '❌ encore un H1 en début de content'
    ELSE '✅ content commence sans H1'
  END AS h1_check,
  updated_at
FROM blog_posts
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher';
