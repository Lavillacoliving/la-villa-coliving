-- SEO update : article living-in-france-working-in-geneva
-- Date : 2026-04-28
-- Objectif : title 88c → 38c (<60c avec suffix), meta 269c → 148c (<160c)
-- Contexte : audit P0-1 (audit_pages_20260428.md, score 76/100)
--
-- Avant :
--   title_fr   = "Vivre en France, travailler à Genève : le guide complet du frontalier" (88c → 109c avec suffix " | La Villa Coliving")
--   excerpt_fr = 269c (tronqué brutalement en SERP, perte CTR)
-- Après :
--   title_fr   = "Frontalier Genève : guide complet 2026" (38c → 58c avec suffix)
--   excerpt_fr = 148c (capture "frontalier" 320/mois + chiffres + ICP)

UPDATE blog_posts
SET
  title_fr   = 'Frontalier Genève : guide complet 2026',
  excerpt_fr = 'Frontalier Genève en 2026 : 100 000+ pratiquants, fiscalité, transport, logement, coliving. Tout ce qu''il faut savoir avant de franchir le pas.',
  updated_at = NOW()
WHERE slug = 'living-in-france-working-in-geneva';

-- Vérification
SELECT
  slug,
  title_fr,
  LENGTH(title_fr) AS title_len,
  LENGTH(title_fr) + LENGTH(' | La Villa Coliving') AS title_total_len,
  excerpt_fr,
  LENGTH(excerpt_fr) AS excerpt_len,
  CASE
    WHEN LENGTH(title_fr) + LENGTH(' | La Villa Coliving') > 60 THEN '⚠️ title total > 60c'
    ELSE '✅ title total ≤ 60c'
  END AS title_check,
  CASE
    WHEN LENGTH(excerpt_fr) > 160 THEN '⚠️ excerpt > 160c'
    ELSE '✅ excerpt ≤ 160c'
  END AS excerpt_check,
  updated_at
FROM blog_posts
WHERE slug = 'living-in-france-working-in-geneva';
