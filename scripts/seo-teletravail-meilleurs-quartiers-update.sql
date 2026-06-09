-- SEO update : 2 articles striking-distance (28-day analysis 2026-06-08)
-- Date : 2026-06-09
-- Objectifs : améliorer le CTR sur 2 pages top 10 mais CTR catastrophique
-- Pattern : title compact + accroche question + année + bénéfice clair

-- ─────────────────────────────────────────────────────────────────────
-- Article 1 : télétravail frontalier — JACKPOT NOUVEAU (pos 9.07, 206 imp, CTR 0.97%)
-- ─────────────────────────────────────────────────────────────────────
-- Avant : "Télétravail frontalier Genève : règles et limites 2026" (53c → 74c avec suffix)
-- Après : "Télétravail frontalier 2026 : règle des 40 %" (44c → 65c) — accroche chiffre
UPDATE blog_posts
SET
  title_fr   = 'Télétravail frontalier 2026 : règle des 40 %',
  excerpt_fr = 'Combien de jours de télétravail un frontalier Genève peut-il faire en 2026 ? Règle des 40 %, accord France-Suisse, impacts fiscaux. Le guide actualisé.',
  updated_at = NOW()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026';

-- ─────────────────────────────────────────────────────────────────────
-- Article 2 : meilleurs quartiers EN — TOP IMP DU SITE (pos 7.06, 1449 imp/28j, CTR 0.69%)
-- ─────────────────────────────────────────────────────────────────────
-- Avant : "Where to Live Near Geneva? Top 5 Areas (2026)" (49c → 70c)
-- Après : "Best French towns near Geneva 2026" (34c → 55c) — keyword exact, accroche claim
UPDATE blog_posts
SET
  title_en   = 'Best French towns near Geneva 2026',
  excerpt_en = 'Top 5 French border towns to live near Geneva in 2026. Annemasse, Ferney, Saint-Julien, Gaillard, Thonon. Rents, transport, taxes — what to know.',
  updated_at = NOW()
WHERE slug = 'meilleurs-quartiers-frontaliers-geneve';

-- ─────────────────────────────────────────────────────────────────────
-- Vérification
-- ─────────────────────────────────────────────────────────────────────
SELECT
  slug,
  title_fr, LENGTH(title_fr) AS fr_len,
  title_en, LENGTH(title_en) AS en_len,
  LENGTH(excerpt_fr) AS excerpt_fr_len,
  LENGTH(excerpt_en) AS excerpt_en_len,
  updated_at
FROM blog_posts
WHERE slug IN ('teletravail-frontalier-geneve-regles-2026', 'meilleurs-quartiers-frontaliers-geneve')
ORDER BY slug;
