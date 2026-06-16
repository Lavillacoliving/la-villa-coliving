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
