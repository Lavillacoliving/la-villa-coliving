-- ============================================================================
-- Prix des chambres 7 et 8 de La Villa (décision de Jérôme du 12/11/2026) — SQL 4 : metas de 2 articles et posts Facebook de 3 articles, prix en clair (les jetons n'y sont pas résolus)
-- Généré le 2026-11-13T07:35:38.009Z par scripts/build-slots-sql.mjs depuis scripts/prix-chambres-7-8-metas.edits.mjs
--   · source unique de la branche feat/prix-chambres-7-8 (src/data/stats.ts : CONTRACT_EUR, HOUSES_FROM ; src/data/answerSlots.ts : priceRangeText, priceRangeCell ; src/lib/contentTokens.ts) ; textes « Avant » lus en base le 13/11/2026
--   · ancres vérifiées sur le contenu vivant de blog_posts (REST anon, lecture seule) le 2026-11-13T07:35:38.005Z : exactement 1 occurrence de chaque ancien texte, nouveau texte absent
-- À appliquer dans le même créneau que la fusion de la branche feat/prix-chambres-7-8. Sans effet sur les gardes du site. Les posts Facebook ne sont affichés que dans le tableau de bord : un post déjà publié sur Facebook se corrige à la main.
-- Idempotent : chaque UPDATE est gardé par position(ancien) > 0 [AND position(nouveau) = 0 quand le nouveau texte n'est pas un fragment de l'ancien] — relancer le fichier est sans effet.
-- Fichier UTF-8 : il contient des espaces insécables (U+00A0, « 1 370 ») et des tirets cadratins — ne pas le faire transiter par un éditeur qui normalise les espaces. La forme à exécuter en séance (un seul bloc, littéraux ASCII) est le fichier .seance.sql du même nom.
-- 10 modifications · 3 articles · état en base à la génération (updated_at · longueur fr / en) :
--   coliving-geneve-frontaliers-guide-complet · 2026-10-10T07:59:57.333901+00:00 · 9581 / 8624
--   coliving-transfrontalier-geneve-annemasse-nouvelle-vie · 2026-11-12T21:48:49.13221+00:00 · 3918 / 3797
--   lodge-annemasse-coliving-premium-portes-geneve · 2026-11-12T14:45:31.771101+00:00 · 15210 / 13537
-- ============================================================================

BEGIN;

-- [1/10] coliving-geneve-frontaliers-guide-complet (fr, meta_description_fr) · meta · meta : prix d'appel en clair
UPDATE blog_posts
SET meta_description_fr = replace(meta_description_fr, $f$près de Genève dès 1 370 CHF/mois.$f$, $r$près de Genève dès 1 290 CHF/mois.$r$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($f$près de Genève dès 1 370 CHF/mois.$f$ IN meta_description_fr) > 0
  AND position($r$près de Genève dès 1 290 CHF/mois.$r$ IN meta_description_fr) = 0;

-- [2/10] coliving-geneve-frontaliers-guide-complet (en, meta_description_en) · meta · meta: entry price in clear
UPDATE blog_posts
SET meta_description_en = replace(meta_description_en, $f$near Geneva from 1,370 CHF/month.$f$, $r$near Geneva from 1,290 CHF/month.$r$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($f$near Geneva from 1,370 CHF/month.$f$ IN meta_description_en) > 0
  AND position($r$near Geneva from 1,290 CHF/month.$r$ IN meta_description_en) = 0;

-- [3/10] coliving-geneve-frontaliers-guide-complet (fr, facebook_post_fr) · facebook · post Facebook : prix d'appel en clair
UPDATE blog_posts
SET facebook_post_fr = replace(facebook_post_fr, $f$✨ dès 1 370 CHF/mois tout inclus$f$, $r$✨ dès 1 290 CHF/mois tout inclus$r$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($f$✨ dès 1 370 CHF/mois tout inclus$f$ IN facebook_post_fr) > 0
  AND position($r$✨ dès 1 290 CHF/mois tout inclus$r$ IN facebook_post_fr) = 0;

-- [4/10] coliving-geneve-frontaliers-guide-complet (en, facebook_post_en) · facebook · Facebook post: entry price in clear
UPDATE blog_posts
SET facebook_post_en = replace(facebook_post_en, $f$✨ from CHF 1,370/month all-inclusive$f$, $r$✨ from CHF 1,290/month all-inclusive$r$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($f$✨ from CHF 1,370/month all-inclusive$f$ IN facebook_post_en) > 0
  AND position($r$✨ from CHF 1,290/month all-inclusive$r$ IN facebook_post_en) = 0;

-- [5/10] coliving-transfrontalier-geneve-annemasse-nouvelle-vie (fr, meta_description_fr) · meta · meta : prix d'appel en clair
UPDATE blog_posts
SET meta_description_fr = replace(meta_description_fr, $f$trajet 20 min, dès 1 370 CHF tout compris$f$, $r$trajet 20 min, dès 1 290 CHF tout compris$r$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($f$trajet 20 min, dès 1 370 CHF tout compris$f$ IN meta_description_fr) > 0
  AND position($r$trajet 20 min, dès 1 290 CHF tout compris$r$ IN meta_description_fr) = 0;

-- [6/10] coliving-transfrontalier-geneve-annemasse-nouvelle-vie (en, meta_description_en) · meta · meta: entry price in clear
UPDATE blog_posts
SET meta_description_en = replace(meta_description_en, $f$20-min commute, from 1,370 CHF all-inclusive$f$, $r$20-min commute, from 1,290 CHF all-inclusive$r$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($f$20-min commute, from 1,370 CHF all-inclusive$f$ IN meta_description_en) > 0
  AND position($r$20-min commute, from 1,290 CHF all-inclusive$r$ IN meta_description_en) = 0;

-- [7/10] coliving-transfrontalier-geneve-annemasse-nouvelle-vie (fr, facebook_post_fr) · facebook · post Facebook : prix d'appel en clair
UPDATE blog_posts
SET facebook_post_fr = replace(facebook_post_fr, $f$✨ Dès 1 370 CHF/mois$f$, $r$✨ Dès 1 290 CHF/mois$r$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($f$✨ Dès 1 370 CHF/mois$f$ IN facebook_post_fr) > 0
  AND position($r$✨ Dès 1 290 CHF/mois$r$ IN facebook_post_fr) = 0;

-- [8/10] coliving-transfrontalier-geneve-annemasse-nouvelle-vie (en, facebook_post_en) · facebook · Facebook post: entry price in clear
UPDATE blog_posts
SET facebook_post_en = replace(facebook_post_en, $f$✨ From CHF 1,370/month$f$, $r$✨ From CHF 1,290/month$r$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($f$✨ From CHF 1,370/month$f$ IN facebook_post_en) > 0
  AND position($r$✨ From CHF 1,290/month$r$ IN facebook_post_en) = 0;

-- [9/10] lodge-annemasse-coliving-premium-portes-geneve (fr, facebook_post_fr) · facebook · post Facebook du Lodge : prix unique du Lodge, sans « dès »
UPDATE blog_posts
SET facebook_post_fr = replace(facebook_post_fr, $f$tout compris dès 1 370 CHF/mois.$f$, $r$tout compris à 1 430 CHF/mois.$r$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($f$tout compris dès 1 370 CHF/mois.$f$ IN facebook_post_fr) > 0
  AND position($r$tout compris à 1 430 CHF/mois.$r$ IN facebook_post_fr) = 0;

-- [10/10] lodge-annemasse-coliving-premium-portes-geneve (en, facebook_post_en) · facebook · Le Lodge Facebook post: the Lodge's single price, no "from"
UPDATE blog_posts
SET facebook_post_en = replace(facebook_post_en, $f$all-inclusive from CHF 1,370/month.$f$, $r$all-inclusive at CHF 1,430/month.$r$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($f$all-inclusive from CHF 1,370/month.$f$ IN facebook_post_en) > 0
  AND position($r$all-inclusive at CHF 1,430/month.$r$ IN facebook_post_en) = 0;

-- ── Aperçu des ancrages (ancien → nouveau, première ligne de chaque texte) ──
-- [1] coliving-geneve-frontaliers-guide-complet/fr, meta_description_fr · meta : « près de Genève dès 1 370 CHF/mois. » → « près de Genève dès 1 290 CHF/mois. »
-- [2] coliving-geneve-frontaliers-guide-complet/en, meta_description_en · meta : « near Geneva from 1,370 CHF/month. » → « near Geneva from 1,290 CHF/month. »
-- [3] coliving-geneve-frontaliers-guide-complet/fr, facebook_post_fr · facebook : « ✨ dès 1 370 CHF/mois tout inclus » → « ✨ dès 1 290 CHF/mois tout inclus »
-- [4] coliving-geneve-frontaliers-guide-complet/en, facebook_post_en · facebook : « ✨ from CHF 1,370/month all-inclusive » → « ✨ from CHF 1,290/month all-inclusive »
-- [5] coliving-transfrontalier-geneve-annemasse-nouvelle-vie/fr, meta_description_fr · meta : « trajet 20 min, dès 1 370 CHF tout compris » → « trajet 20 min, dès 1 290 CHF tout compris »
-- [6] coliving-transfrontalier-geneve-annemasse-nouvelle-vie/en, meta_description_en · meta : « 20-min commute, from 1,370 CHF all-inclusive » → « 20-min commute, from 1,290 CHF all-inclusive »
-- [7] coliving-transfrontalier-geneve-annemasse-nouvelle-vie/fr, facebook_post_fr · facebook : « ✨ Dès 1 370 CHF/mois » → « ✨ Dès 1 290 CHF/mois »
-- [8] coliving-transfrontalier-geneve-annemasse-nouvelle-vie/en, facebook_post_en · facebook : « ✨ From CHF 1,370/month » → « ✨ From CHF 1,290/month »
-- [9] lodge-annemasse-coliving-premium-portes-geneve/fr, facebook_post_fr · facebook : « tout compris dès 1 370 CHF/mois. » → « tout compris à 1 430 CHF/mois. »
-- [10] lodge-annemasse-coliving-premium-portes-geneve/en, facebook_post_en · facebook : « all-inclusive from CHF 1,370/month. » → « all-inclusive at CHF 1,430/month. »

COMMIT;

-- ── Vérification (lecture seule) : une ligne par article ; fr_ok / en_ok = true quand toutes les modifications de la langue sont en place, NULL = langue non touchée.
SELECT slug,
  CASE slug
    WHEN 'coliving-geneve-frontaliers-guide-complet' THEN (position($f$près de Genève dès 1 370 CHF/mois.$f$ IN meta_description_fr) = 0
      AND position($f$✨ dès 1 370 CHF/mois tout inclus$f$ IN facebook_post_fr) = 0)
    WHEN 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie' THEN (position($f$trajet 20 min, dès 1 370 CHF tout compris$f$ IN meta_description_fr) = 0
      AND position($f$✨ Dès 1 370 CHF/mois$f$ IN facebook_post_fr) = 0)
    WHEN 'lodge-annemasse-coliving-premium-portes-geneve' THEN (position($f$tout compris dès 1 370 CHF/mois.$f$ IN facebook_post_fr) = 0)
  END AS fr_ok,
  CASE slug
    WHEN 'coliving-geneve-frontaliers-guide-complet' THEN (position($f$near Geneva from 1,370 CHF/month.$f$ IN meta_description_en) = 0
      AND position($f$✨ from CHF 1,370/month all-inclusive$f$ IN facebook_post_en) = 0)
    WHEN 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie' THEN (position($f$20-min commute, from 1,370 CHF all-inclusive$f$ IN meta_description_en) = 0
      AND position($f$✨ From CHF 1,370/month$f$ IN facebook_post_en) = 0)
    WHEN 'lodge-annemasse-coliving-premium-portes-geneve' THEN (position($f$all-inclusive from CHF 1,370/month.$f$ IN facebook_post_en) = 0)
  END AS en_ok
FROM blog_posts
WHERE slug IN ('coliving-geneve-frontaliers-guide-complet', 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie', 'lodge-annemasse-coliving-premium-portes-geneve')
ORDER BY slug;

-- ── Retour arrière (inverse exact, mêmes gardes miroir) : retirer les deux lignes /* et */ puis exécuter le bloc.
/*
BEGIN;

UPDATE blog_posts
SET facebook_post_en = replace(facebook_post_en, $r$all-inclusive at CHF 1,430/month.$r$, $f$all-inclusive from CHF 1,370/month.$f$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($r$all-inclusive at CHF 1,430/month.$r$ IN facebook_post_en) > 0
  AND position($f$all-inclusive from CHF 1,370/month.$f$ IN facebook_post_en) = 0;

UPDATE blog_posts
SET facebook_post_fr = replace(facebook_post_fr, $r$tout compris à 1 430 CHF/mois.$r$, $f$tout compris dès 1 370 CHF/mois.$f$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($r$tout compris à 1 430 CHF/mois.$r$ IN facebook_post_fr) > 0
  AND position($f$tout compris dès 1 370 CHF/mois.$f$ IN facebook_post_fr) = 0;

UPDATE blog_posts
SET facebook_post_en = replace(facebook_post_en, $r$✨ From CHF 1,290/month$r$, $f$✨ From CHF 1,370/month$f$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($r$✨ From CHF 1,290/month$r$ IN facebook_post_en) > 0
  AND position($f$✨ From CHF 1,370/month$f$ IN facebook_post_en) = 0;

UPDATE blog_posts
SET facebook_post_fr = replace(facebook_post_fr, $r$✨ Dès 1 290 CHF/mois$r$, $f$✨ Dès 1 370 CHF/mois$f$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($r$✨ Dès 1 290 CHF/mois$r$ IN facebook_post_fr) > 0
  AND position($f$✨ Dès 1 370 CHF/mois$f$ IN facebook_post_fr) = 0;

UPDATE blog_posts
SET meta_description_en = replace(meta_description_en, $r$20-min commute, from 1,290 CHF all-inclusive$r$, $f$20-min commute, from 1,370 CHF all-inclusive$f$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($r$20-min commute, from 1,290 CHF all-inclusive$r$ IN meta_description_en) > 0
  AND position($f$20-min commute, from 1,370 CHF all-inclusive$f$ IN meta_description_en) = 0;

UPDATE blog_posts
SET meta_description_fr = replace(meta_description_fr, $r$trajet 20 min, dès 1 290 CHF tout compris$r$, $f$trajet 20 min, dès 1 370 CHF tout compris$f$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($r$trajet 20 min, dès 1 290 CHF tout compris$r$ IN meta_description_fr) > 0
  AND position($f$trajet 20 min, dès 1 370 CHF tout compris$f$ IN meta_description_fr) = 0;

UPDATE blog_posts
SET facebook_post_en = replace(facebook_post_en, $r$✨ from CHF 1,290/month all-inclusive$r$, $f$✨ from CHF 1,370/month all-inclusive$f$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($r$✨ from CHF 1,290/month all-inclusive$r$ IN facebook_post_en) > 0
  AND position($f$✨ from CHF 1,370/month all-inclusive$f$ IN facebook_post_en) = 0;

UPDATE blog_posts
SET facebook_post_fr = replace(facebook_post_fr, $r$✨ dès 1 290 CHF/mois tout inclus$r$, $f$✨ dès 1 370 CHF/mois tout inclus$f$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($r$✨ dès 1 290 CHF/mois tout inclus$r$ IN facebook_post_fr) > 0
  AND position($f$✨ dès 1 370 CHF/mois tout inclus$f$ IN facebook_post_fr) = 0;

UPDATE blog_posts
SET meta_description_en = replace(meta_description_en, $r$near Geneva from 1,290 CHF/month.$r$, $f$near Geneva from 1,370 CHF/month.$f$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($r$near Geneva from 1,290 CHF/month.$r$ IN meta_description_en) > 0
  AND position($f$near Geneva from 1,370 CHF/month.$f$ IN meta_description_en) = 0;

UPDATE blog_posts
SET meta_description_fr = replace(meta_description_fr, $r$près de Genève dès 1 290 CHF/mois.$r$, $f$près de Genève dès 1 370 CHF/mois.$f$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($r$près de Genève dès 1 290 CHF/mois.$r$ IN meta_description_fr) > 0
  AND position($f$près de Genève dès 1 370 CHF/mois.$f$ IN meta_description_fr) = 0;

COMMIT;
*/
