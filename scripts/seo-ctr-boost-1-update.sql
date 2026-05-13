-- =============================================================
-- Action #1 — UPDATE titre/meta de "meilleurs-quartiers"
-- Petit statement, doit passer instantanément.
-- =============================================================

UPDATE blog_posts
SET
  title_fr   = 'Top 5 quartiers frontaliers Genève 2026',
  title_en   = 'Top 5 districts near Geneva (2026)',
  excerpt_fr = 'Ville-la-Grand, Ambilly, Annemasse, Gaillard, Saint-Julien : loyers, transports & qualité de vie. Guide 2026 des meilleurs quartiers près de Genève.',
  excerpt_en = 'Ville-la-Grand, Ambilly, Annemasse, Gaillard, Saint-Julien: rents, commute, quality of life. The 2026 guide to the best cross-border districts near Geneva.'
WHERE slug = 'meilleurs-quartiers-frontaliers-geneve';

-- Vérif
SELECT slug, title_fr, length(excerpt_fr) AS len
FROM blog_posts
WHERE slug = 'meilleurs-quartiers-frontaliers-geneve';
