-- ============================================================
-- LOT B — Correctifs de contenu blog (Supabase)
-- Projet : tefpynkdxxfiefpkgitz
-- Préparé le 2026-06-04 d'après le CONTENU LIVE (lu via anon key) —
-- les REPLACE sont calqués sur le texte réellement en base.
--
-- Comment lancer : Supabase → SQL Editor → New query → coller TOUT → Run.
-- Chaque bloc se termine par un SELECT de contrôle qui DOIT renvoyer 0 ligne.
--
-- ⚠️ ÉTAPE 0 (à faire AVANT ce fichier, dans une requête séparée) :
--    publier le nouvel article « frais de dossier » en lançant
--    scripts/seo-coliving-frais-dossier-insert.sql
--    (sinon le lien depuis /tarifs renvoie un 404 sur cet article).
-- ============================================================


-- 1) B7 — liens internes vers des redirections → cibles finales
--    Concernés : colocation-expats-geneve-guide, meilleurs-quartiers-frontaliers-geneve
--    /join-us → /candidature · /our-houses → /nos-maisons · /rates → /tarifs
UPDATE blog_posts SET
  content_fr = REPLACE(REPLACE(REPLACE(content_fr,
    '(/join-us)',   '(/candidature)'),
    '(/our-houses)','(/nos-maisons)'),
    '(/rates)',     '(/tarifs)'),
  content_en = REPLACE(REPLACE(REPLACE(content_en,
    '(/join-us)',   '(/candidature)'),
    '(/our-houses)','(/nos-maisons)'),
    '(/rates)',     '(/tarifs)')
WHERE slug IN ('colocation-expats-geneve-guide', 'meilleurs-quartiers-frontaliers-geneve');

-- contrôle B7 (doit renvoyer 0 ligne) :
SELECT slug FROM blog_posts
WHERE content_fr LIKE '%(/join-us)%' OR content_fr LIKE '%(/rates)%' OR content_fr LIKE '%(/our-houses)%'
   OR content_en LIKE '%(/join-us)%' OR content_en LIKE '%(/rates)%' OR content_en LIKE '%(/our-houses)%';


-- 2) « 100 résidents » → « 150 résidents » (cohérence avec le site)
--    Concerné : meilleurs-quartiers-frontaliers-geneve
UPDATE blog_posts SET
  content_fr = REPLACE(content_fr, 'plus de 100 résidents', 'plus de 150 résidents'),
  content_en = REPLACE(content_en, 'over 100 residents',    'over 150 residents')
WHERE slug = 'meilleurs-quartiers-frontaliers-geneve';

-- contrôle 150 (doit renvoyer 0 ligne) :
SELECT slug FROM blog_posts
WHERE content_fr LIKE '%plus de 100 résidents%' OR content_en LIKE '%over 100 residents%';


-- 3) WiFi : « 8 Gbps » → « jusqu'à 8 Gb/s » (cohérence LOT A — fibre vs WiFi)
--    Concerné : grand-geneve-2026-nouveautes-frontaliers
UPDATE blog_posts SET
  content_fr = REPLACE(content_fr, 'WiFi fibre 8 Gbps', 'fibre jusqu''à 8 Gb/s'),
  content_en = REPLACE(content_en, '8 Gbps fiber WiFi', 'fiber up to 8 Gb/s')
WHERE slug = 'grand-geneve-2026-nouveautes-frontaliers';

-- contrôle WiFi (doit renvoyer 0 ligne) :
SELECT slug FROM blog_posts
WHERE content_fr LIKE '%8 Gbps%' OR content_en LIKE '%8 Gbps%';


-- ============================================================
-- FIN. Les 3 SELECT de contrôle ci-dessus doivent tous renvoyer
-- « 0 rows ». Si l'un renvoie une ligne, ne pas paniquer : me
-- l'envoyer, c'est qu'une variante de texte reste à traiter.
-- ============================================================
