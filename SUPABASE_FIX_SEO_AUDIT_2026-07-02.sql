-- ============================================================
-- FIX SEO AUDIT AHREFS -- 2026-07-02
-- 12 meta descriptions raccourcies (<= 155 caracteres),
-- 2 titles raccourcis (article guide-ressources, 91c -> 58c),
-- 1 lien interne corrige (article salaire -> guide budget).
-- Fichier 100% ASCII : accents encodes \XXXX via U&'...'
-- A COLLER TEL QUEL dans Supabase > SQL Editor > Run.
-- ============================================================

BEGIN;

-- --- Titles trop longs (91c) : article guide-ressources ---
UPDATE blog_posts SET
  title_fr = U&'Frontalier Gen\00E8ve : le guide des ressources indispensables',
  title_en = 'Geneva cross-border workers: the essential resources guide',
  updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve';

-- --- Meta descriptions > 160 caracteres (12) ---
UPDATE blog_posts SET
  meta_description_fr = U&'Le dossier de r\00E9f\00E9rence du frontalier \00E0 Gen\00E8ve : permis G, LAMal/CMU, imp\00F4ts, t\00E9l\00E9travail, transports, ch\00F4mage, logement.',
  updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve';

UPDATE blog_posts SET
  meta_description_en = 'Working in Geneva and looking for housing on the French side? 2026 comparison of the 7 cheapest border towns: rents, transport, taxes.',
  updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher';

UPDATE blog_posts SET
  meta_description_fr = U&'Combien co\00FBte vraiment un logement frontalier \00E0 Gen\00E8ve en 2026 ? Prix r\00E9els par ville, studio vs colocation vs coliving, charges cach\00E9es et \00E9conomies.',
  meta_description_en = 'What does cross-border housing near Geneva really cost in 2026? Real prices by town, studio vs flatshare vs coliving, hidden costs and savings.',
  updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet';

UPDATE blog_posts SET
  meta_description_fr = U&'Frais de dossier et honoraires d''agence en colocation : ce que la loi autorise (200\2013700 \20AC) et comment emm\00E9nager sans frais d''entr\00E9e pr\00E8s de Gen\00E8ve.',
  meta_description_en = U&'Application and agency fees in a flat-share: what the law allows, the real cost (\20AC200\2013700) and how to move in with zero entry fees near Geneva.',
  updated_at = now()
WHERE slug = 'coliving-frais-dossier-geneve-annemasse';

UPDATE blog_posts SET
  meta_description_en = 'The two 2026 thresholds (40% tax, 49.9% social security) and their real impact: everything a Geneva cross-border worker needs to know about remote work.',
  updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026';

UPDATE blog_posts SET
  meta_description_fr = U&'Annemasse \00E0 20 min de Cornavin : pourquoi des frontaliers choisissent le coliving plut\00F4t qu''un studio \00E0 Gen\00E8ve. Loyers, communaut\00E9, tout inclus.',
  updated_at = now()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages';

UPDATE blog_posts SET
  meta_description_fr = U&'Vie quotidienne en zone frontali\00E8re Annemasse-Gen\00E8ve : courses, sport, restaurants, sorties \2014 les meilleures adresses test\00E9es par des frontaliers.',
  meta_description_en = U&'Daily life in the Annemasse-Geneva border area: shopping, sports, restaurants and going out \2014 the best spots tested by cross-border workers.',
  updated_at = now()
WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties';

UPDATE blog_posts SET
  meta_description_fr = U&'Avenant fiscal franco-suisse : le t\00E9l\00E9travail frontalier \00E0 40 % est p\00E9renne. Seuils, d\00E9claration, cr\00E9dit d''imp\00F4t \2014 ce qui change pour vos imp\00F4ts.',
  updated_at = now()
WHERE slug = 'avenant-fiscal-40-frontalier-geneve';

UPDATE blog_posts SET
  meta_description_fr = U&'Permis G frontalier Gen\00E8ve : conditions, d\00E9marche OCPM, validit\00E9, renouvellement (~65 CHF). Vivre en France, travailler en Suisse en 2026.',
  updated_at = now()
WHERE slug = 'permis-g-frontalier-geneve';

-- --- Lien interne vers redirection (article salaire) ---
-- ancre << Loyer frontalier Geneve : prix reels 2026 >> -> cible directe guide budget
UPDATE blog_posts SET
  content_fr = REPLACE(content_fr,
    '](/blog/loyer-frontalier-geneve-combien-payer)',
    '](/blog/budget-colocation-geneve-guide-complet)'),
  updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026';

COMMIT;

-- ============================================================
-- VERIFICATION (executer apres le COMMIT) :
-- toutes les longueurs doivent etre <= 155, lien restant = 0
-- ============================================================
SELECT slug,
       char_length(coalesce(meta_description_fr,'')) AS len_fr,
       char_length(coalesce(meta_description_en,'')) AS len_en
FROM blog_posts WHERE slug IN ('guide-ressources-frontalier-geneve', 'ou-habiter-frontalier-suisse-villes-france-pas-cher', 'budget-colocation-geneve-guide-complet', 'coliving-frais-dossier-geneve-annemasse', 'teletravail-frontalier-geneve-regles-2026', 'coliving-annemasse-geneve-frontaliers-avantages', 'vie-quotidienne-frontalier-courses-sport-sorties', 'avenant-fiscal-40-frontalier-geneve', 'permis-g-frontalier-geneve') ORDER BY slug;

SELECT slug, char_length(title_fr) AS title_fr_len, char_length(title_en) AS title_en_len
FROM blog_posts WHERE slug = 'guide-ressources-frontalier-geneve';

SELECT count(*) AS liens_restants FROM blog_posts
WHERE content_fr LIKE '%loyer-frontalier-geneve-combien-payer%'
   OR content_en LIKE '%loyer-frontalier-geneve-combien-payer%';
