-- ╔══════════════════════════════════════════════════════════════════╗
-- ║  RUN-3 — finition : corrige 3 liens croisés-langue + VÉRIF finale  ║
-- ║  (la dépublication est déjà faite — rien d'autre à lancer)         ║
-- ╚══════════════════════════════════════════════════════════════════╝

-- ════════ 08b-maillage-crosslang.sql ════════
-- ════════════════════════════════════════════════════════════════════════
-- 08b — MAILLAGE : liens CROISÉS langue (FR-path dans contenu EN, et inverse)
-- Complète 08 (qui ne traitait que FR-dans-FR et EN-dans-EN).
-- Cas réel détecté : guide-ressources-frontalier-geneve (contenu EN liait /blog/… au lieu de /en/blog/…).
-- À lancer dans RUN-2 AVANT la dépublication. Idempotent (no-op si absent).
-- ════════════════════════════════════════════════════════════════════════

-- ─── sources fusionnées ───
UPDATE blog_posts SET
  content_en = replace(content_en, '](/blog/loyer-frontalier-geneve-combien-payer)', '](/en/blog/budget-colocation-geneve-guide-complet)'),
  content_fr = replace(content_fr, '](/en/blog/loyer-frontalier-geneve-combien-payer)', '](/blog/budget-colocation-geneve-guide-complet)'),
  updated_at = now()
WHERE content_en LIKE '%](/blog/loyer-frontalier-geneve-combien-payer)%' OR content_fr LIKE '%](/en/blog/loyer-frontalier-geneve-combien-payer)%';

UPDATE blog_posts SET
  content_en = replace(content_en, '](/blog/studio-geneve-vs-colocation-france-budget)', '](/en/blog/budget-colocation-geneve-guide-complet)'),
  content_fr = replace(content_fr, '](/en/blog/studio-geneve-vs-colocation-france-budget)', '](/blog/budget-colocation-geneve-guide-complet)'),
  updated_at = now()
WHERE content_en LIKE '%](/blog/studio-geneve-vs-colocation-france-budget)%' OR content_fr LIKE '%](/en/blog/studio-geneve-vs-colocation-france-budget)%';

UPDATE blog_posts SET
  content_en = replace(content_en, '](/blog/economies-coliving-tout-inclus-geneve)', '](/en/blog/budget-colocation-geneve-guide-complet)'),
  content_fr = replace(content_fr, '](/en/blog/economies-coliving-tout-inclus-geneve)', '](/blog/budget-colocation-geneve-guide-complet)'),
  updated_at = now()
WHERE content_en LIKE '%](/blog/economies-coliving-tout-inclus-geneve)%' OR content_fr LIKE '%](/en/blog/economies-coliving-tout-inclus-geneve)%';

UPDATE blog_posts SET
  content_en = replace(content_en, '](/blog/meilleurs-quartiers-frontaliers-geneve)', '](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)'),
  content_fr = replace(content_fr, '](/en/blog/meilleurs-quartiers-frontaliers-geneve)', '](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)'),
  updated_at = now()
WHERE content_en LIKE '%](/blog/meilleurs-quartiers-frontaliers-geneve)%' OR content_fr LIKE '%](/en/blog/meilleurs-quartiers-frontaliers-geneve)%';

UPDATE blog_posts SET
  content_en = replace(content_en, '](/blog/chambre-meublee-annemasse-geneve)', '](/en/blog/colocation-annemasse-ville-la-grand-ambilly)'),
  content_fr = replace(content_fr, '](/en/blog/chambre-meublee-annemasse-geneve)', '](/blog/colocation-annemasse-ville-la-grand-ambilly)'),
  updated_at = now()
WHERE content_en LIKE '%](/blog/chambre-meublee-annemasse-geneve)%' OR content_fr LIKE '%](/en/blog/chambre-meublee-annemasse-geneve)%';

UPDATE blog_posts SET
  content_en = replace(content_en, '](/blog/temps-trajet-annemasse-geneve-par-quartier)', '](/en/blog/transport-annemasse-geneve-leman-express)'),
  content_fr = replace(content_fr, '](/en/blog/temps-trajet-annemasse-geneve-par-quartier)', '](/blog/transport-annemasse-geneve-leman-express)'),
  updated_at = now()
WHERE content_en LIKE '%](/blog/temps-trajet-annemasse-geneve-par-quartier)%' OR content_fr LIKE '%](/en/blog/temps-trajet-annemasse-geneve-par-quartier)%';

UPDATE blog_posts SET
  content_en = replace(content_en, '](/blog/geneve-sans-voiture-mobilite-douce-frontaliers)', '](/en/blog/transport-annemasse-geneve-leman-express)'),
  content_fr = replace(content_fr, '](/en/blog/geneve-sans-voiture-mobilite-douce-frontaliers)', '](/blog/transport-annemasse-geneve-leman-express)'),
  updated_at = now()
WHERE content_en LIKE '%](/blog/geneve-sans-voiture-mobilite-douce-frontaliers)%' OR content_fr LIKE '%](/en/blog/geneve-sans-voiture-mobilite-douce-frontaliers)%';

UPDATE blog_posts SET
  content_en = replace(content_en, '](/blog/arriver-seul-geneve-guide-30-jours)', '](/en/blog/demenager-geneve-frontalier-checklist)'),
  content_fr = replace(content_fr, '](/en/blog/arriver-seul-geneve-guide-30-jours)', '](/blog/demenager-geneve-frontalier-checklist)'),
  updated_at = now()
WHERE content_en LIKE '%](/blog/arriver-seul-geneve-guide-30-jours)%' OR content_fr LIKE '%](/en/blog/arriver-seul-geneve-guide-30-jours)%';

UPDATE blog_posts SET
  content_en = replace(content_en, '](/blog/5-erreurs-logement-frontalier-geneve)', '](/en/blog/arnaques-logement-frontalier-geneve-eviter)'),
  content_fr = replace(content_fr, '](/en/blog/5-erreurs-logement-frontalier-geneve)', '](/blog/arnaques-logement-frontalier-geneve-eviter)'),
  updated_at = now()
WHERE content_en LIKE '%](/blog/5-erreurs-logement-frontalier-geneve)%' OR content_fr LIKE '%](/en/blog/5-erreurs-logement-frontalier-geneve)%';

-- ─── pages déjà redirigées (dette) ───
UPDATE blog_posts SET
  content_en = replace(content_en, '](/blog/what-is-coliving-and-why-it-matters)', '](/en/le-coliving)'),
  content_fr = replace(content_fr, '](/en/blog/what-is-coliving-and-why-it-matters)', '](/le-coliving)'),
  updated_at = now()
WHERE content_en LIKE '%](/blog/what-is-coliving-and-why-it-matters)%' OR content_fr LIKE '%](/en/blog/what-is-coliving-and-why-it-matters)%';

UPDATE blog_posts SET
  content_en = replace(content_en, '](/blog/coliving-tendance-habitat-jeunes-professionnels-2024)', '](/en/le-coliving)'),
  content_fr = replace(content_fr, '](/en/blog/coliving-tendance-habitat-jeunes-professionnels-2024)', '](/le-coliving)'),
  updated_at = now()
WHERE content_en LIKE '%](/blog/coliving-tendance-habitat-jeunes-professionnels-2024)%' OR content_fr LIKE '%](/en/blog/coliving-tendance-habitat-jeunes-professionnels-2024)%';

UPDATE blog_posts SET
  content_en = replace(content_en, '](/blog/coliving-pour-qui-profil-ideal)', '](/en/le-coliving)'),
  content_fr = replace(content_fr, '](/en/blog/coliving-pour-qui-profil-ideal)', '](/le-coliving)'),
  updated_at = now()
WHERE content_en LIKE '%](/blog/coliving-pour-qui-profil-ideal)%' OR content_fr LIKE '%](/en/blog/coliving-pour-qui-profil-ideal)%';

UPDATE blog_posts SET
  content_en = replace(content_en, '](/blog/avantages-coliving-jeunes-professionnels)', '](/en/le-coliving)'),
  content_fr = replace(content_fr, '](/en/blog/avantages-coliving-jeunes-professionnels)', '](/le-coliving)'),
  updated_at = now()
WHERE content_en LIKE '%](/blog/avantages-coliving-jeunes-professionnels)%' OR content_fr LIKE '%](/en/blog/avantages-coliving-jeunes-professionnels)%';

UPDATE blog_posts SET
  content_en = replace(content_en, '](/blog/vie-communautaire-coliving-temoignages)', '](/en/le-coliving)'),
  content_fr = replace(content_fr, '](/en/blog/vie-communautaire-coliving-temoignages)', '](/le-coliving)'),
  updated_at = now()
WHERE content_en LIKE '%](/blog/vie-communautaire-coliving-temoignages)%' OR content_fr LIKE '%](/en/blog/vie-communautaire-coliving-temoignages)%';

UPDATE blog_posts SET
  content_en = replace(content_en, '](/blog/coliving-communaute-reels-amis-geneve-annemasse)', '](/en/le-coliving)'),
  content_fr = replace(content_fr, '](/en/blog/coliving-communaute-reels-amis-geneve-annemasse)', '](/le-coliving)'),
  updated_at = now()
WHERE content_en LIKE '%](/blog/coliving-communaute-reels-amis-geneve-annemasse)%' OR content_fr LIKE '%](/en/blog/coliving-communaute-reels-amis-geneve-annemasse)%';

UPDATE blog_posts SET
  content_en = replace(content_en, '](/blog/coliving-geneve-frontaliers-guide-2024)', '](/en/blog/coliving-geneve-frontaliers-guide-complet)'),
  content_fr = replace(content_fr, '](/en/blog/coliving-geneve-frontaliers-guide-2024)', '](/blog/coliving-geneve-frontaliers-guide-complet)'),
  updated_at = now()
WHERE content_en LIKE '%](/blog/coliving-geneve-frontaliers-guide-2024)%' OR content_fr LIKE '%](/en/blog/coliving-geneve-frontaliers-guide-2024)%';

UPDATE blog_posts SET
  content_en = replace(content_en, '](/blog/coliving-geneve-frontalier-guide-complet)', '](/en/blog/coliving-geneve-frontaliers-guide-complet)'),
  content_fr = replace(content_fr, '](/en/blog/coliving-geneve-frontalier-guide-complet)', '](/blog/coliving-geneve-frontaliers-guide-complet)'),
  updated_at = now()
WHERE content_en LIKE '%](/blog/coliving-geneve-frontalier-guide-complet)%' OR content_fr LIKE '%](/en/blog/coliving-geneve-frontalier-guide-complet)%';

UPDATE blog_posts SET
  content_en = replace(content_en, '](/blog/coliving-vs-colocation-choisir-mode-vie-geneve-frontalier)', '](/en/blog/coliving-vs-colocation-differences)'),
  content_fr = replace(content_fr, '](/en/blog/coliving-vs-colocation-choisir-mode-vie-geneve-frontalier)', '](/blog/coliving-vs-colocation-differences)'),
  updated_at = now()
WHERE content_en LIKE '%](/blog/coliving-vs-colocation-choisir-mode-vie-geneve-frontalier)%' OR content_fr LIKE '%](/en/blog/coliving-vs-colocation-choisir-mode-vie-geneve-frontalier)%';

UPDATE blog_posts SET
  content_en = replace(content_en, '](/blog/annemasse-coliving-geneve-frontaliers-guide-complet)', '](/en/blog/coliving-annemasse-geneve-frontaliers-avantages)'),
  content_fr = replace(content_fr, '](/en/blog/annemasse-coliving-geneve-frontaliers-guide-complet)', '](/blog/coliving-annemasse-geneve-frontaliers-avantages)'),
  updated_at = now()
WHERE content_en LIKE '%](/blog/annemasse-coliving-geneve-frontaliers-guide-complet)%' OR content_fr LIKE '%](/en/blog/annemasse-coliving-geneve-frontaliers-guide-complet)%';

UPDATE blog_posts SET
  content_en = replace(content_en, '](/blog/coliving-annemasse-geneve-alternative-premium)', '](/en/blog/coliving-annemasse-geneve-frontaliers-avantages)'),
  content_fr = replace(content_fr, '](/en/blog/coliving-annemasse-geneve-alternative-premium)', '](/blog/coliving-annemasse-geneve-frontaliers-avantages)'),
  updated_at = now()
WHERE content_en LIKE '%](/blog/coliving-annemasse-geneve-alternative-premium)%' OR content_fr LIKE '%](/en/blog/coliving-annemasse-geneve-alternative-premium)%';

-- ════════ 10-verification.sql ════════
-- ════════════════════════════════════════════════════════════════════════
-- 10 — VÉRIFICATION FINALE (lecture seule — à lancer après 01→09)
-- Projet Supabase : tefpynkdxxfiefpkgitz
-- ════════════════════════════════════════════════════════════════════════

-- 1) Les 9 sources sont bien dépubliées, les 6 piliers cibles bien publiés
SELECT slug, is_published,
       CASE slug
         WHEN 'budget-colocation-geneve-guide-complet' THEN 'PILIER (budget)'
         WHEN 'ou-habiter-frontalier-suisse-villes-france-pas-cher' THEN 'PILIER (où habiter)'
         WHEN 'colocation-annemasse-ville-la-grand-ambilly' THEN 'PILIER (annemasse local)'
         WHEN 'transport-annemasse-geneve-leman-express' THEN 'PILIER (transport)'
         WHEN 'demenager-geneve-frontalier-checklist' THEN 'PILIER (newcomer)'
         WHEN 'arnaques-logement-frontalier-geneve-eviter' THEN 'PILIER (pièges)'
         WHEN 'coliving-annemasse-geneve-frontaliers-avantages' THEN 'PILIER (coliving annemasse)'
         ELSE 'SOURCE (doit être false)'
       END AS role
FROM blog_posts
WHERE slug IN (
  'budget-colocation-geneve-guide-complet','ou-habiter-frontalier-suisse-villes-france-pas-cher',
  'colocation-annemasse-ville-la-grand-ambilly','transport-annemasse-geneve-leman-express',
  'demenager-geneve-frontalier-checklist','arnaques-logement-frontalier-geneve-eviter',
  'coliving-annemasse-geneve-frontaliers-avantages',
  'loyer-frontalier-geneve-combien-payer','studio-geneve-vs-colocation-france-budget',
  'economies-coliving-tout-inclus-geneve','meilleurs-quartiers-frontaliers-geneve',
  'chambre-meublee-annemasse-geneve','temps-trajet-annemasse-geneve-par-quartier',
  'geneve-sans-voiture-mobilite-douce-frontaliers','arriver-seul-geneve-guide-30-jours',
  '5-erreurs-logement-frontalier-geneve'
) ORDER BY role, slug;

-- 2) Le contenu salvage a bien été inséré dans chaque pilier (phrases-repères)
SELECT 'budget'      AS pilier, position('Prix réels par commune frontalière' IN content_fr) > 0 AS ok FROM blog_posts WHERE slug='budget-colocation-geneve-guide-complet'
UNION ALL SELECT 'ou-habiter',  position('Ambilly — Le charme urbain'         IN content_fr) > 0 FROM blog_posts WHERE slug='ou-habiter-frontalier-suisse-villes-france-pas-cher'
UNION ALL SELECT 'annemasse',   position('Le vrai prix d''une chambre meublée' IN content_fr) > 0 FROM blog_posts WHERE slug='colocation-annemasse-ville-la-grand-ambilly'
UNION ALL SELECT 'transport',   position('Temps de trajet réels par quartier'  IN content_fr) > 0 FROM blog_posts WHERE slug='transport-annemasse-geneve-leman-express'
UNION ALL SELECT 'newcomer',    position('Vos 30 premiers jours'               IN content_fr) > 0 FROM blog_posts WHERE slug='demenager-geneve-frontalier-checklist'
UNION ALL SELECT 'pieges',      position('Au-delà des arnaques'                IN content_fr) > 0 FROM blog_posts WHERE slug='arnaques-logement-frontalier-geneve-eviter'
UNION ALL SELECT 'coliving-an', position('Vie culturelle, sport et gastronomie' IN content_fr) > 0 FROM blog_posts WHERE slug='coliving-annemasse-geneve-frontaliers-avantages';

-- 3) Plus AUCUN lien interne (dans les articles publiés) vers une page redirigée
SELECT slug FROM blog_posts WHERE is_published = true AND (
  content_fr LIKE '%](/blog/loyer-frontalier-geneve-combien-payer)%' OR content_en LIKE '%](/en/blog/loyer-frontalier-geneve-combien-payer)%' OR
  content_fr LIKE '%](/blog/studio-geneve-vs-colocation-france-budget)%' OR content_en LIKE '%](/en/blog/studio-geneve-vs-colocation-france-budget)%' OR
  content_fr LIKE '%](/blog/economies-coliving-tout-inclus-geneve)%' OR content_en LIKE '%](/en/blog/economies-coliving-tout-inclus-geneve)%' OR
  content_fr LIKE '%](/blog/meilleurs-quartiers-frontaliers-geneve)%' OR content_en LIKE '%](/en/blog/meilleurs-quartiers-frontaliers-geneve)%' OR
  content_fr LIKE '%](/blog/chambre-meublee-annemasse-geneve)%' OR content_en LIKE '%](/en/blog/chambre-meublee-annemasse-geneve)%' OR
  content_fr LIKE '%](/blog/temps-trajet-annemasse-geneve-par-quartier)%' OR content_en LIKE '%](/en/blog/temps-trajet-annemasse-geneve-par-quartier)%' OR
  content_fr LIKE '%](/blog/geneve-sans-voiture-mobilite-douce-frontaliers)%' OR content_en LIKE '%](/en/blog/geneve-sans-voiture-mobilite-douce-frontaliers)%' OR
  content_fr LIKE '%](/blog/arriver-seul-geneve-guide-30-jours)%' OR content_en LIKE '%](/en/blog/arriver-seul-geneve-guide-30-jours)%' OR
  content_fr LIKE '%](/blog/5-erreurs-logement-frontalier-geneve)%' OR content_en LIKE '%](/en/blog/5-erreurs-logement-frontalier-geneve)%'
);  -- attendu : 0 ligne

-- 4) Aucun auto-lien résiduel dans les 5 piliers concernés (doit renvoyer 0)
SELECT slug FROM blog_posts WHERE
  (slug='budget-colocation-geneve-guide-complet'            AND content_fr LIKE '%](/blog/budget-colocation-geneve-guide-complet)%') OR
  (slug='ou-habiter-frontalier-suisse-villes-france-pas-cher' AND content_fr LIKE '%](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)%') OR
  (slug='colocation-annemasse-ville-la-grand-ambilly'       AND content_fr LIKE '%](/blog/colocation-annemasse-ville-la-grand-ambilly)%') OR
  (slug='transport-annemasse-geneve-leman-express'          AND content_fr LIKE '%](/blog/transport-annemasse-geneve-leman-express)%') OR
  (slug='arnaques-logement-frontalier-geneve-eviter'        AND content_fr LIKE '%](/blog/arnaques-logement-frontalier-geneve-eviter)%');

-- 5) Inventaire final des articles publiés (attendu : 32)
SELECT count(*) AS publies FROM blog_posts WHERE is_published = true;
SELECT slug FROM blog_posts WHERE is_published = true ORDER BY slug;
