-- ============================================================
-- MAILLAGE A1 -- 2026-07-04
-- Objectif : pousser /blog/trouver-colocation-geneve-frontalier
-- (position 10 sur << colocation geneve >>) vers la page 1.
-- 2 articles modifies : budget (remplace une ligne de liste morte)
-- et ou-habiter (ajoute un lien apres la ligne budget).
-- 100% ASCII (accents en \XXXX via U&'...') -- coller tel quel.
-- ============================================================

BEGIN;

-- 1) Article budget : la ligne morte devient le lien
UPDATE blog_posts SET
  content_fr = REPLACE(content_fr, U&'- Quel loyer quand on est frontalier \00E0 Gen\00E8ve ?', U&'- [Trouver une colocation \00E0 Gen\00E8ve : le guide du frontalier](/blog/trouver-colocation-geneve-frontalier)'),
  content_en = REPLACE(content_en, '- What rent as a cross-border worker in Geneva?', '- [Finding a flatshare in Geneva: the cross-border guide](/en/blog/trouver-colocation-geneve-frontalier)'),
  updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet';

-- 2) Article ou-habiter : lien ajoute apres la ligne budget
UPDATE blog_posts SET
  content_fr = REPLACE(content_fr, U&'- [Quel loyer quand on est frontalier \00E0 Gen\00E8ve ?](/blog/budget-colocation-geneve-guide-complet)', U&'- [Quel loyer quand on est frontalier \00E0 Gen\00E8ve ?](/blog/budget-colocation-geneve-guide-complet)' || chr(10) || U&'- [Trouver une colocation \00E0 Gen\00E8ve : le guide du frontalier](/blog/trouver-colocation-geneve-frontalier)'),
  content_en = REPLACE(content_en, '- [How much rent as a Geneva cross-border worker?](/en/blog/budget-colocation-geneve-guide-complet)', '- [How much rent as a Geneva cross-border worker?](/en/blog/budget-colocation-geneve-guide-complet)' || chr(10) || '- [Finding a flatshare in Geneva: the cross-border guide](/en/blog/trouver-colocation-geneve-frontalier)'),
  updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher';

COMMIT;

-- ============ VERIFICATION (apres COMMIT) ============
-- attendu : 4 lignes, chacune avec nb_liens = 1
SELECT slug, 'fr' AS lang,
  (char_length(content_fr) - char_length(REPLACE(content_fr, 'trouver-colocation-geneve-frontalier', ''))) / char_length('trouver-colocation-geneve-frontalier') AS nb_liens
FROM blog_posts WHERE slug IN ('budget-colocation-geneve-guide-complet','ou-habiter-frontalier-suisse-villes-france-pas-cher')
UNION ALL
SELECT slug, 'en',
  (char_length(content_en) - char_length(REPLACE(content_en, 'trouver-colocation-geneve-frontalier', ''))) / char_length('trouver-colocation-geneve-frontalier')
FROM blog_posts WHERE slug IN ('budget-colocation-geneve-guide-complet','ou-habiter-frontalier-suisse-villes-france-pas-cher')
ORDER BY slug, lang;
