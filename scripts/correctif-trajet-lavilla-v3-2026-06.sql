-- ============================================================
-- CORRECTIF v3 — temps de trajet La Villa (vérifié Google Maps par Jérôme 12/06)
-- Projet Supabase : tefpynkdxxfiefpkgitz
--
-- CHIFFRES CANONIQUES v3 : gare d'Annemasse à MOINS DE 10 min à pied de La Villa,
-- Léman Express → centre de Genève en 8-9 min, MOINS DE 20 MIN PORTE-À-PORTE.
-- (Annule le « 12 minutes » de la v2 d'hier.)
--
-- Lancer : Supabase → SQL Editor → coller → Run.
-- ============================================================

-- ─── ÉTAPE 1 : APERÇU (les ancrages v2 doivent être trouvés) ───
SELECT slug,
  (content_fr LIKE '%gare à 12 min à pied ou 3 min en vélo%')                AS fr_1,
  (content_fr LIKE '%12 minutes à pied de la gare%')                          AS fr_2,
  (content_en LIKE '%station 12 min walk or 3 min bike%')                     AS en_1,
  (content_en LIKE '%12-minute walk from Annemasse station%')                 AS en_2
FROM blog_posts WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier';

-- ─── ÉTAPE 2 : CORRECTION ───
UPDATE blog_posts SET
  content_fr = REPLACE(REPLACE(content_fr,
    $q$gare à 12 min à pied ou 3 min en vélo de Ville-la-Grand$q$,
    $q$gare à 10 min à pied ou 3 min en vélo de Ville-la-Grand$q$),
    $q$La Villa à Ville-la-Grand est à 12 minutes à pied de la gare d'Annemasse, par un raccourci piéton.$q$,
    $q$La Villa à Ville-la-Grand est à moins de 10 minutes à pied de la gare d'Annemasse.$q$),
  content_en = REPLACE(REPLACE(content_en,
    $q$station 12 min walk or 3 min bike from Ville-la-Grand$q$,
    $q$station 10 min walk or 3 min bike from Ville-la-Grand$q$),
    $q$La Villa in Ville-la-Grand is a 12-minute walk from Annemasse station, via a pedestrian shortcut.$q$,
    $q$La Villa in Ville-la-Grand is less than a 10-minute walk from Annemasse station.$q$)
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier';

-- ─── ÉTAPE 3 : CONTRÔLE ───
SELECT slug,
  (content_fr LIKE '%10 min à pied ou 3 min en vélo%')          AS fr_1_ok,
  (content_fr LIKE '%moins de 10 minutes à pied de la gare%')   AS fr_2_ok,
  (content_en LIKE '%10 min walk or 3 min bike%')               AS en_1_ok,
  (content_en LIKE '%less than a 10-minute walk%')              AS en_2_ok,
  (content_fr NOT LIKE '%12 min%')                              AS plus_de_12
FROM blog_posts WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier';
-- Attendu : tout à true. Je relancerai le prerender après ton feu vert.
