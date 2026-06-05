-- ============================================================
-- B1 — Titres orientés CTR des 2 articles à fortes impressions
-- Projet : tefpynkdxxfiefpkgitz  (⚠️ vérifie le bon projet en haut à gauche)
-- Les excerpts (meta description) sont déjà bons → on ne touche QUE les titres.
-- Après le RUN : préviens-moi → je relance le build (re-prérendu des 2 articles).
-- Lancer : Supabase → SQL Editor → New query → coller → Run.
-- ============================================================

UPDATE blog_posts SET
  title_fr = 'Où habiter près de Genève ? Top 5 quartiers (2026)',
  title_en = 'Where to Live Near Geneva? Top 5 Areas (2026)'
WHERE slug = 'meilleurs-quartiers-frontaliers-geneve';

UPDATE blog_posts SET
  title_fr = 'Budget colocation Genève 2026 : combien ça coûte vraiment ?',
  title_en = 'Shared Housing Budget near Geneva: The Real Cost (2026)'
WHERE slug = 'budget-colocation-geneve-guide-complet';

-- contrôle
SELECT slug, title_fr, title_en
FROM blog_posts
WHERE slug IN ('meilleurs-quartiers-frontaliers-geneve', 'budget-colocation-geneve-guide-complet');
