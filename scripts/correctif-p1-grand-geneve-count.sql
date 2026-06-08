-- ════════════════════════════════════════════════════════════════════════
-- CORRECTIF P1 — Nombre de frontaliers → 116 200 (OCSTAT fin 2025)
-- Date : 2026-06-08
-- Slugs : grand-geneve-2026-nouveautes-frontaliers  +  what-is-coliving-and-why-it-matters
-- ────────────────────────────────────────────────────────────────────────
-- POURQUOI :
--  • grand-geneve : affirme « les 100 000 frontaliers » → actualiser à 116 200.
--  • what-is-coliving : « 100 000 gens arrivent et partent chaque année » =
--    claim de flux invérifiable (confond stock et turnover) → on adoucit.
-- (La page /colocation-geneve, en code source .tsx, est corrigée séparément.)
-- ════════════════════════════════════════════════════════════════════════

-- ─── grand-geneve : 100 000 → 116 200 ───
UPDATE blog_posts SET
  content_fr = REPLACE(content_fr,
    $o$2026 marque un tournant pour les 100 000 frontaliers qui traversent quotidiennement la frontière franco-suisse.$o$,
    $n$2026 marque un tournant pour les quelque 116 200 frontaliers qui traversent quotidiennement la frontière franco-suisse vers le canton de Genève (chiffre OCSTAT, fin 2025).$n$),
  content_en = REPLACE(content_en,
    $oe$2026 marks a turning point for the 100,000 cross-border workers who cross the Franco-Swiss border daily.$oe$,
    $ne$2026 marks a turning point for the roughly 116,200 cross-border workers who cross the Franco-Swiss border daily into the canton of Geneva (OCSTAT figure, end of 2025).$ne$),
  updated_at = NOW()
WHERE slug = 'grand-geneve-2026-nouveautes-frontaliers';

-- ─── what-is-coliving : adoucir le « 100 000 / an » ───
UPDATE blog_posts SET
  content_fr = REPLACE(content_fr,
    $o$100 000 gens arrivent et partent chaque année. Ils ne savent pas s'ils vont rester. Ils ont besoin de flexibilité.$o$,
    $n$Des milliers de personnes arrivent et repartent chaque année dans le bassin genevois. Beaucoup ne savent pas encore si elles vont rester. Elles ont besoin de flexibilité.$n$),
  content_en = REPLACE(content_en,
    $oe$100,000 people arrive and leave yearly. They're unsure about staying. They need flexibility.$oe$,
    $ne$Thousands of people arrive and leave the Geneva area every year. Many aren't sure yet whether they'll stay. They need flexibility.$ne$),
  updated_at = NOW()
WHERE slug = 'what-is-coliving-and-why-it-matters';

-- ─── Vérification ───
SELECT slug,
  (content_fr LIKE '%116 200%') AS fr_116200,
  (content_fr LIKE '%100 000%') AS fr_contient_encore_100000
FROM blog_posts
WHERE slug IN ('grand-geneve-2026-nouveautes-frontaliers','what-is-coliving-and-why-it-matters')
ORDER BY slug;
