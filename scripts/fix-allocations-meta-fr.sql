-- Fix : meta_description_fr article #5 trop longue (168c → ~148c)
UPDATE blog_posts SET meta_description_fr =
  'Allocations familiales frontalier Genève 2026 : montants suisses (311 CHF/enfant), règle de priorité France/Suisse, congé maternité, démarches.'
WHERE slug = 'allocations-familiales-frontalier-geneve-2026';

SELECT slug, LENGTH(meta_description_fr) AS meta_fr_len
FROM blog_posts WHERE slug = 'allocations-familiales-frontalier-geneve-2026';
