-- ============================================================================
-- Article « C'est réel ? » (brief v2 du 15/10/2026, décision Q1 de Jérôme du 16/10/2026) : lien retour du guide « arnaques » vers l'article de vérification (FR + EN).
-- Généré le 2026-10-16T10:25:56.918Z par scripts/build-slots-sql.mjs depuis scripts/cest-reel-lien-retour.edits.mjs
--   · ancre = phrase de preuves de « L'alternative sécurisée : le coliving » / « The Secure Alternative: Coliving », copiée depuis la base le 16/10/2026
--   · ancres vérifiées sur le contenu vivant de blog_posts (REST anon, lecture seule) le 2026-10-16T10:25:56.917Z : exactement 1 occurrence de chaque ancien texte, nouveau texte absent
-- APRÈS la publication de l'article non-la-villa-coliving-nest-pas-une-arnaque (sinon lien vers un brouillon), dans la même séance que la fusion du code.
-- Idempotent : chaque UPDATE est gardé par position(ancien) > 0 [AND position(nouveau) = 0 quand le nouveau texte n'est pas un fragment de l'ancien] — relancer le fichier est sans effet.
-- Fichier UTF-8 (guillemets, accents) — ne pas normaliser.
-- 2 modifications · 1 articles · état en base à la génération (updated_at · longueur fr / en) :
--   arnaques-logement-frontalier-geneve-eviter · 2026-10-13T15:30:10.955122+00:00 · 12311 / 11150
-- ============================================================================

BEGIN;

-- [1/2] arnaques-logement-frontalier-geneve-eviter (fr) · ajout de phrase · Q1 (16/10/2026) — lien retour du guide « arnaques » vers l'article « C'est réel ? »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Nous sommes une entreprise établie depuis 2021, avec des dizaines d'avis Google vérifiables et une adresse physique que tu peux visiter.$f$, $r$Nous sommes une entreprise établie depuis 2021, avec des dizaines d'avis Google vérifiables et une adresse physique que tu peux visiter. Et pour le vérifier par toi-même en trente secondes : [comment vérifier qu'on existe](/blog/non-la-villa-coliving-nest-pas-une-arnaque).$r$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($f$Nous sommes une entreprise établie depuis 2021, avec des dizaines d'avis Google vérifiables et une adresse physique que tu peux visiter.$f$ IN content_fr) > 0
  AND position($r$Nous sommes une entreprise établie depuis 2021, avec des dizaines d'avis Google vérifiables et une adresse physique que tu peux visiter. Et pour le vérifier par toi-même en trente secondes : [comment vérifier qu'on existe](/blog/non-la-villa-coliving-nest-pas-une-arnaque).$r$ IN content_fr) = 0;

-- [2/2] arnaques-logement-frontalier-geneve-eviter (en) · ajout de phrase · Q1 (16/10/2026) — lien retour du guide « arnaques » vers l'article « C'est réel ? »
UPDATE blog_posts
SET content_en = replace(content_en, $f$We're an established company since 2021, with dozens of verifiable Google reviews and a physical address you can visit.$f$, $r$We're an established company since 2021, with dozens of verifiable Google reviews and a physical address you can visit. And to check it for yourself in thirty seconds: [how to check we're real](/en/blog/non-la-villa-coliving-nest-pas-une-arnaque).$r$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($f$We're an established company since 2021, with dozens of verifiable Google reviews and a physical address you can visit.$f$ IN content_en) > 0
  AND position($r$We're an established company since 2021, with dozens of verifiable Google reviews and a physical address you can visit. And to check it for yourself in thirty seconds: [how to check we're real](/en/blog/non-la-villa-coliving-nest-pas-une-arnaque).$r$ IN content_en) = 0;

-- ── Aperçu des ancrages (ancien → nouveau, première ligne de chaque texte) ──
-- [1] arnaques-logement-frontalier-geneve-eviter/fr · ajout de phrase : « Nous sommes une entreprise établie depuis 2021, avec des dizaines d'avi… » → « Nous sommes une entreprise établie depuis 2021, avec des dizaines d'avi… »
-- [2] arnaques-logement-frontalier-geneve-eviter/en · ajout de phrase : « We're an established company since 2021, with dozens of verifiable Goog… » → « We're an established company since 2021, with dozens of verifiable Goog… »

COMMIT;

-- ── Vérification (lecture seule) : une ligne par article ; fr_ok / en_ok = true quand toutes les modifications de la langue sont en place, NULL = langue non touchée.
SELECT slug,
  CASE slug
    WHEN 'arnaques-logement-frontalier-geneve-eviter' THEN (position($r$Nous sommes une entreprise établie depuis 2021, avec des dizaines d'avis Google vérifiables et une adresse physique que tu peux visiter. Et pour le vérifier par toi-même en trente secondes : [comment vérifier qu'on existe](/blog/non-la-villa-coliving-nest-pas-une-arnaque).$r$ IN content_fr) > 0)
  END AS fr_ok,
  CASE slug
    WHEN 'arnaques-logement-frontalier-geneve-eviter' THEN (position($r$We're an established company since 2021, with dozens of verifiable Google reviews and a physical address you can visit. And to check it for yourself in thirty seconds: [how to check we're real](/en/blog/non-la-villa-coliving-nest-pas-une-arnaque).$r$ IN content_en) > 0)
  END AS en_ok
FROM blog_posts
WHERE slug IN ('arnaques-logement-frontalier-geneve-eviter')
ORDER BY slug;

-- ── Retour arrière (inverse exact, mêmes gardes miroir) : retirer les deux lignes /* et */ puis exécuter le bloc.
/*
BEGIN;

UPDATE blog_posts
SET content_en = replace(content_en, $r$We're an established company since 2021, with dozens of verifiable Google reviews and a physical address you can visit. And to check it for yourself in thirty seconds: [how to check we're real](/en/blog/non-la-villa-coliving-nest-pas-une-arnaque).$r$, $f$We're an established company since 2021, with dozens of verifiable Google reviews and a physical address you can visit.$f$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($r$We're an established company since 2021, with dozens of verifiable Google reviews and a physical address you can visit. And to check it for yourself in thirty seconds: [how to check we're real](/en/blog/non-la-villa-coliving-nest-pas-une-arnaque).$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Nous sommes une entreprise établie depuis 2021, avec des dizaines d'avis Google vérifiables et une adresse physique que tu peux visiter. Et pour le vérifier par toi-même en trente secondes : [comment vérifier qu'on existe](/blog/non-la-villa-coliving-nest-pas-une-arnaque).$r$, $f$Nous sommes une entreprise établie depuis 2021, avec des dizaines d'avis Google vérifiables et une adresse physique que tu peux visiter.$f$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($r$Nous sommes une entreprise établie depuis 2021, avec des dizaines d'avis Google vérifiables et une adresse physique que tu peux visiter. Et pour le vérifier par toi-même en trente secondes : [comment vérifier qu'on existe](/blog/non-la-villa-coliving-nest-pas-une-arnaque).$r$ IN content_fr) > 0;

COMMIT;
*/
