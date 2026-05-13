-- =====================================================================
-- SEO update : 3 articles blog en striking-distance (pos top 10, CTR < 0.5 %)
-- Date : 2026-05-18 (J+21 du sprint v1.2)
--
-- Objectif : passer du CTR microscopique (0.12-0.26 %) à 3-4 % qui correspond
-- à leur position réelle (top 10). Upside estimé : +280-450 clics / 3 mois.
--
-- Diagnostic (Pages.csv export GSC 3 mois) :
--   1. /blog/fiscalite-frontalier-geneve-impots-2026 — 2 418 imp, 4 clics, 0.17 %, pos 6.21
--   2. /blog/budget-colocation-geneve-guide-complet  — 2 298 imp, 6 clics, 0.26 %, pos 6.23
--   3. /blog/loyer-frontalier-geneve-combien-payer   — 1 648 imp, 2 clics, 0.12 %, pos 4.67
--
-- Cause racine : titles tous > 60c (tronqués SERP), metas peu accrocheuses,
-- ou trop longues (>160c). Pattern de refonte : court + chiffre + 2026 +
-- bénéfice clair, comme appliqué le 27/04 sur meilleurs-quartiers (succès partiel).
-- =====================================================================

-- ─────────────────────────────────────────────────────────────────────
-- Article 1 : fiscalité frontalier impôts
-- ─────────────────────────────────────────────────────────────────────
UPDATE blog_posts
SET
  title_fr   = 'Impôt frontalier Genève 2026 : calcul net',
  excerpt_fr = 'Quel net pour un frontalier Genève en 2026 ? Impôt à la source, déclaration France, quasi-résident, 3e pilier. Calcul concret salaire brut → net.',
  updated_at = NOW()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026';

-- ─────────────────────────────────────────────────────────────────────
-- Article 2 : budget colocation guide complet
-- ─────────────────────────────────────────────────────────────────────
UPDATE blog_posts
SET
  title_fr   = 'Budget colocation Genève 2026 : guide complet',
  excerpt_fr = 'Combien coûte une colocation Genève en 2026 ? Studio vs coliving, charges cachées, astuces pour économiser 30-50 % sur votre logement frontalier.',
  updated_at = NOW()
WHERE slug = 'budget-colocation-geneve-guide-complet';

-- ─────────────────────────────────────────────────────────────────────
-- Article 3 : loyer frontalier combien payer (le plus juteux — pos 4.67)
-- ─────────────────────────────────────────────────────────────────────
UPDATE blog_posts
SET
  title_fr   = 'Loyer frontalier Genève 2026 : prix réels',
  excerpt_fr = 'Loyer frontalier Genève en 2026 : combien payer vraiment ? Prix réels par ville (Annemasse, Ferney, Ville-la-Grand), studio vs coloc, 600-1 800 €/mois.',
  updated_at = NOW()
WHERE slug = 'loyer-frontalier-geneve-combien-payer';

-- ─────────────────────────────────────────────────────────────────────
-- Vérification post-update — doit montrer 3 lignes avec ✅ partout
-- ─────────────────────────────────────────────────────────────────────
SELECT
  slug,
  title_fr,
  LENGTH(title_fr) AS title_len,
  LENGTH(title_fr) + LENGTH(' | La Villa Coliving') AS title_total_len,
  CASE WHEN LENGTH(title_fr) + LENGTH(' | La Villa Coliving') <= 70 THEN '✅' ELSE '⚠️ trop long' END AS title_check,
  excerpt_fr,
  LENGTH(excerpt_fr) AS excerpt_len,
  CASE WHEN LENGTH(excerpt_fr) <= 160 THEN '✅' ELSE '⚠️ trop long' END AS excerpt_check,
  updated_at
FROM blog_posts
WHERE slug IN (
  'fiscalite-frontalier-geneve-impots-2026',
  'budget-colocation-geneve-guide-complet',
  'loyer-frontalier-geneve-combien-payer'
)
ORDER BY slug;
