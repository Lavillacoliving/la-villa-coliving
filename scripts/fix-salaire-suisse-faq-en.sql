-- ════════════════════════════════════════════════════════════════════════
-- Fix résiduel : FAQ EN "100,000 CHF net" — ancrage long avait raté
-- Approche : 2 REPLACE courts sur les seuls chiffres à corriger
-- ════════════════════════════════════════════════════════════════════════

-- 1) Corriger le net mensuel
UPDATE blog_posts SET content_en = REPLACE(
  content_en,
  'About **6,800 CHF/month net** after mandatory deductions and source tax',
  'About **5,985 CHF/month net** after mandatory deductions (~10 %) and Geneva source tax (~18 %)'
) WHERE slug = 'salaire-suisse-net-frontalier-2026';

-- 2) Corriger l'équivalent EUR + ajouter la mention famille
UPDATE blog_posts SET content_en = REPLACE(
  content_en,
  'Roughly 7,250 EUR/month',
  'Roughly 6,400 EUR/month at 1.07 rate'
) WHERE slug = 'salaire-suisse-net-frontalier-2026';

-- 3) Ajouter la mention "With spouse..." à la fin de la réponse FAQ
UPDATE blog_posts SET content_en = REPLACE(
  content_en,
  'Roughly 6,400 EUR/month at 1.07 rate — before LAMal/CMU premium.',
  'Roughly 6,400 EUR/month at 1.07 rate — before LAMal/CMU premium. With spouse and children (cat. C/H), add 400 to 700 CHF/month.'
) WHERE slug = 'salaire-suisse-net-frontalier-2026';

UPDATE blog_posts SET updated_at = NOW() WHERE slug = 'salaire-suisse-net-frontalier-2026';

-- Vérification
SELECT
  (content_en LIKE '%5,985 CHF/month net%') AS net_ok,
  (content_en LIKE '%6,400 EUR/month at 1.07%') AS eur_ok,
  (content_en LIKE '%With spouse and children (cat. C/H)%') AS family_note_ok,
  (content_en LIKE '%6,800 CHF/month net%') AS old_value_still_present_should_be_false
FROM blog_posts WHERE slug = 'salaire-suisse-net-frontalier-2026';
