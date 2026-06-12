-- ============================================================
-- CORRECTIF IMPÉRATIF — temps de trajet La Villa (article temps-trajet)
-- Date : 2026-06-11   Projet Supabase : tefpynkdxxfiefpkgitz
--
-- FAIT CONFIRMÉ PAR JÉRÔME : La Villa → gare d'Annemasse = 12 minutes à pied
-- par un raccourci piéton NON visible sur Google Maps (ni 9, ni 10, ni 26 min).
-- Gare → centre de Genève = 10 min de Léman Express. < 25 min porte-à-porte.
-- L'article temps-trajet-annemasse-geneve-par-quartier dit « 10 minutes » → 12.
--
-- REPLACE chirurgicaux, ancrés au mot près (vérifiés via l'API le 11/06).
-- Idempotent : après exécution, les anciens textes n'existent plus.
-- Lancer : Supabase → SQL Editor → coller → Run.
-- ============================================================

-- ─── ÉTAPE 1 : APERÇU (les 2 ancrages FR + 2 EN doivent être trouvés) ───
SELECT slug,
  (content_fr LIKE $a$%gare à 10 min à pied ou 3 min en vélo de Ville-la-Grand%$a$)            AS fr_ancrage_1,
  (content_fr LIKE $a$%La Villa à Ville-la-Grand est à 10 minutes à pied de la gare d'Annemasse.%$a$) AS fr_ancrage_2,
  (content_en LIKE $a$%station 10 min walk or 3 min bike from Ville-la-Grand%$a$)              AS en_ancrage_1,
  (content_en LIKE $a$%La Villa in Ville-la-Grand is 10 minutes walk from Annemasse station.%$a$)     AS en_ancrage_2
FROM blog_posts WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier';

-- ─── ÉTAPE 2 : CORRECTION ───
UPDATE blog_posts SET
  content_fr = REPLACE(REPLACE(content_fr,
    $q$gare à 10 min à pied ou 3 min en vélo de Ville-la-Grand$q$,
    $q$gare à 12 min à pied ou 3 min en vélo de Ville-la-Grand$q$),
    $q$La Villa à Ville-la-Grand est à 12 minutes à pied de la gare d'Annemasse.$q$,
    $q$La Villa à Ville-la-Grand est à 12 minutes à pied de la gare d'Annemasse, par un raccourci piéton.$q$),
  content_en = REPLACE(REPLACE(content_en,
    $q$station 10 min walk or 3 min bike from Ville-la-Grand$q$,
    $q$station 12 min walk or 3 min bike from Ville-la-Grand$q$),
    $q$La Villa in Ville-la-Grand is 10 minutes walk from Annemasse station.$q$,
    $q$La Villa in Ville-la-Grand is a 12-minute walk from Annemasse station, via a pedestrian shortcut.$q$)
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier';

-- ⚠️ correction de l'étape 2 ci-dessus : le 2e REPLACE FR doit partir de l'ANCIEN texte.
-- Si l'aperçu (étape 1) montre fr_ancrage_2 = true, lance plutôt ceci :
UPDATE blog_posts SET
  content_fr = REPLACE(content_fr,
    $q$La Villa à Ville-la-Grand est à 10 minutes à pied de la gare d'Annemasse.$q$,
    $q$La Villa à Ville-la-Grand est à 12 minutes à pied de la gare d'Annemasse, par un raccourci piéton.$q$)
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND content_fr LIKE $a$%La Villa à Ville-la-Grand est à 10 minutes à pied%$a$;

-- ─── ÉTAPE 3 : CONTRÔLE — plus aucun « 10 min » lié à La Villa/Ville-la-Grand ───
SELECT slug,
  (content_fr LIKE '%12 min à pied ou 3 min en vélo%')      AS fr_1_ok,
  (content_fr LIKE '%12 minutes à pied de la gare%')        AS fr_2_ok,
  (content_en LIKE '%12 min walk or 3 min bike%')           AS en_1_ok,
  (content_en LIKE '%12-minute walk from Annemasse station%') AS en_2_ok
FROM blog_posts WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier';
-- Attendu : tout à true. Puis re-déployer (Action Pre-render & Deploy).
