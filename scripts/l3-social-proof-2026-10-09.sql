-- ============================================================================
-- Lot L3 « Note Google et preuves » (brief « Ingénierie des créneaux », décisions D3 / D4 de Jérôme du 09/10/2026) : note Google et nombre de résidents dans les articles en base
-- Généré le 2026-10-10T08:33:50.506Z par scripts/build-slots-sql.mjs depuis scripts/l3-social-proof.edits.mjs
--   · textes insérés = source unique src/data/stats.ts (GOOGLE_REVIEWS, GOOGLE_REVIEWS_LINK_LABEL, STATS_DISPLAY.googleRating, STATS.totalResidents) (ENTITY_FACTS_VERSION 2026-10-10, GOOGLE_REVIEWS.checkedOn 2026-10-08, GOOGLE_REVIEWS.count 36)
--   · ancres vérifiées sur le contenu vivant de blog_posts (REST anon, lecture seule) le 2026-10-10T08:33:50.504Z : exactement 1 occurrence de chaque ancien texte, nouveau texte absent
-- À appliquer par Jérôme dans le SQL Editor, dans le même créneau que le déploiement du code L3 (le hero et les pages passent à la note Google au même moment) ; relancer le prérendu ensuite. Fichier à usage unique : au prochain relevé mensuel (GOOGLE_REVIEWS.checkedOn), régénérer une nouvelle liste dont les ancres sont les textes posés ici.
-- Idempotent : chaque UPDATE est gardé par position(ancien) > 0 [AND position(nouveau) = 0 quand le nouveau texte n'est pas un fragment de l'ancien] — relancer le fichier est sans effet.
-- Fichier UTF-8 : il contient des caractères typographiques (« — ») et des accents — ne pas le faire transiter par un éditeur qui normalise les espaces ou les apostrophes.
-- 10 modifications · 2 articles · état en base à la génération (updated_at · longueur fr / en) :
--   coliving-communaute-reels-amis-geneve-annemasse · 2026-09-29T11:20:24.853765+00:00 · 10926 / 9543
--   lodge-annemasse-coliving-premium-portes-geneve · 2026-10-10T07:59:57.333901+00:00 · 15131 / 13463
-- ============================================================================

BEGIN;

-- [1/10] coliving-communaute-reels-amis-geneve-annemasse (fr) · D3 · intro (L5, absente du recon) : « plus de 150 résidents d'une quinzaine de nationalités » → « plus de 100 résidents » (STATS.totalResidents ; 150 contredisait le reste du site)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$plus de 150 résidents$f$, $r$plus de 100 résidents$r$),
    updated_at = now()
WHERE slug = 'coliving-communaute-reels-amis-geneve-annemasse'
  AND position($f$plus de 150 résidents$f$ IN content_fr) > 0
  AND position($r$plus de 100 résidents$r$ IN content_fr) = 0;

-- [2/10] coliving-communaute-reels-amis-geneve-annemasse (en) · D3 · intro (L5, not in the recon): “more than 150 residents from some fifteen nationalities” → “more than 100 residents” (STATS.totalResidents)
UPDATE blog_posts
SET content_en = replace(content_en, $f$more than 150 residents$f$, $r$more than 100 residents$r$),
    updated_at = now()
WHERE slug = 'coliving-communaute-reels-amis-geneve-annemasse'
  AND position($f$more than 150 residents$f$ IN content_en) > 0
  AND position($r$more than 100 residents$r$ IN content_en) = 0;

-- [3/10] coliving-communaute-reels-amis-geneve-annemasse (fr) · D4 · L75 : « nos maisons affichent une note moyenne de 4,9/5 » → « La Villa Coliving affiche une note de 4,8/5 sur Google (36 avis) » (STATS_DISPLAY.fr.googleRating ; une seule fiche Google, celle de la marque)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$nos maisons affichent une note moyenne de 4,9/5$f$, $r$La Villa Coliving affiche une note de 4,8/5 sur Google (36 avis)$r$),
    updated_at = now()
WHERE slug = 'coliving-communaute-reels-amis-geneve-annemasse'
  AND position($f$nos maisons affichent une note moyenne de 4,9/5$f$ IN content_fr) > 0
  AND position($r$La Villa Coliving affiche une note de 4,8/5 sur Google (36 avis)$r$ IN content_fr) = 0;

-- [4/10] coliving-communaute-reels-amis-geneve-annemasse (fr) · D4 · L75, fin de phrase : lien « voir les avis » vers la fiche Google (D4 : la note est toujours accompagnée du lien)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$: on reste parce qu'on s'y sent bien.$f$, $r$: on reste parce qu'on s'y sent bien — [voir les avis](https://maps.google.com/?cid=14514002506022967350).$r$),
    updated_at = now()
WHERE slug = 'coliving-communaute-reels-amis-geneve-annemasse'
  AND position($f$: on reste parce qu'on s'y sent bien.$f$ IN content_fr) > 0
  AND position($r$: on reste parce qu'on s'y sent bien — [voir les avis](https://maps.google.com/?cid=14514002506022967350).$r$ IN content_fr) = 0;

-- [5/10] coliving-communaute-reels-amis-geneve-annemasse (en) · D4 · L75: “our houses hold an average rating of 4.9/5 and an average stay of” → “La Villa Coliving is rated 4.8/5 on Google (36 reviews), with an average stay of” (STATS_DISPLAY.en.googleRating ; relecture 10/10 : le verbe « hold » régissait les deux compléments)
UPDATE blog_posts
SET content_en = replace(content_en, $f$our houses hold an average rating of 4.9/5 and an average stay of$f$, $r$La Villa Coliving is rated 4.8/5 on Google (36 reviews), with an average stay of$r$),
    updated_at = now()
WHERE slug = 'coliving-communaute-reels-amis-geneve-annemasse'
  AND position($f$our houses hold an average rating of 4.9/5 and an average stay of$f$ IN content_en) > 0
  AND position($r$La Villa Coliving is rated 4.8/5 on Google (36 reviews), with an average stay of$r$ IN content_en) = 0;

-- [6/10] coliving-communaute-reels-amis-geneve-annemasse (en) · D4 · L75, end of sentence: “see the reviews” link to the Google listing (D4)
UPDATE blog_posts
SET content_en = replace(content_en, $f$: people stay because they feel good here.$f$, $r$: people stay because they feel good here — [see the reviews](https://maps.google.com/?cid=14514002506022967350).$r$),
    updated_at = now()
WHERE slug = 'coliving-communaute-reels-amis-geneve-annemasse'
  AND position($f$: people stay because they feel good here.$f$ IN content_en) > 0
  AND position($r$: people stay because they feel good here — [see the reviews](https://maps.google.com/?cid=14514002506022967350).$r$ IN content_en) = 0;

-- [7/10] lodge-annemasse-coliving-premium-portes-geneve (fr) · D3 · L13 : « plus de 150 résidents sont passés par nos trois maisons » → « plus de 100 résidents » (STATS.totalResidents)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$plus de 150 résidents$f$, $r$plus de 100 résidents$r$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($f$plus de 150 résidents$f$ IN content_fr) > 0
  AND position($r$plus de 100 résidents$r$ IN content_fr) = 0;

-- [8/10] lodge-annemasse-coliving-premium-portes-geneve (fr) · D4 · L13 : « avec une note moyenne de 4,9/5. » → « avec une note de 4,8/5 sur Google (36 avis) — voir les avis. » (STATS_DISPLAY.fr.googleRating + lien D4)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$avec une note moyenne de 4,9/5.$f$, $r$avec une note de 4,8/5 sur Google (36 avis) — [voir les avis](https://maps.google.com/?cid=14514002506022967350).$r$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($f$avec une note moyenne de 4,9/5.$f$ IN content_fr) > 0
  AND position($r$avec une note de 4,8/5 sur Google (36 avis) — [voir les avis](https://maps.google.com/?cid=14514002506022967350).$r$ IN content_fr) = 0;

-- [9/10] lodge-annemasse-coliving-premium-portes-geneve (en) · D3 · L13: “more than 150 residents have lived in our three houses” → “more than 100 residents” (STATS.totalResidents)
UPDATE blog_posts
SET content_en = replace(content_en, $f$more than 150 residents$f$, $r$more than 100 residents$r$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($f$more than 150 residents$f$ IN content_en) > 0
  AND position($r$more than 100 residents$r$ IN content_en) = 0;

-- [10/10] lodge-annemasse-coliving-premium-portes-geneve (en) · D4 · L13: “with an average rating of 4.9/5.” → “rated 4.8/5 on Google (36 reviews) — see the reviews.” (STATS_DISPLAY.en.googleRating + D4 link)
UPDATE blog_posts
SET content_en = replace(content_en, $f$with an average rating of 4.9/5.$f$, $r$rated 4.8/5 on Google (36 reviews) — [see the reviews](https://maps.google.com/?cid=14514002506022967350).$r$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($f$with an average rating of 4.9/5.$f$ IN content_en) > 0
  AND position($r$rated 4.8/5 on Google (36 reviews) — [see the reviews](https://maps.google.com/?cid=14514002506022967350).$r$ IN content_en) = 0;

-- ── Aperçu des ancrages (ancien → nouveau, première ligne de chaque texte) ──
-- [1] coliving-communaute-reels-amis-geneve-annemasse/fr · D3 : « plus de 150 résidents » → « plus de 100 résidents »
-- [2] coliving-communaute-reels-amis-geneve-annemasse/en · D3 : « more than 150 residents » → « more than 100 residents »
-- [3] coliving-communaute-reels-amis-geneve-annemasse/fr · D4 : « nos maisons affichent une note moyenne de 4,9/5 » → « La Villa Coliving affiche une note de 4,8/5 sur Google (36 avis) »
-- [4] coliving-communaute-reels-amis-geneve-annemasse/fr · D4 : « : on reste parce qu'on s'y sent bien. » → « : on reste parce qu'on s'y sent bien — [voir les avis](https://maps.goo… »
-- [5] coliving-communaute-reels-amis-geneve-annemasse/en · D4 : « our houses hold an average rating of 4.9/5 and an average stay of » → « La Villa Coliving is rated 4.8/5 on Google (36 reviews), with an averag… »
-- [6] coliving-communaute-reels-amis-geneve-annemasse/en · D4 : « : people stay because they feel good here. » → « : people stay because they feel good here — [see the reviews](https://m… »
-- [7] lodge-annemasse-coliving-premium-portes-geneve/fr · D3 : « plus de 150 résidents » → « plus de 100 résidents »
-- [8] lodge-annemasse-coliving-premium-portes-geneve/fr · D4 : « avec une note moyenne de 4,9/5. » → « avec une note de 4,8/5 sur Google (36 avis) — [voir les avis](https://m… »
-- [9] lodge-annemasse-coliving-premium-portes-geneve/en · D3 : « more than 150 residents » → « more than 100 residents »
-- [10] lodge-annemasse-coliving-premium-portes-geneve/en · D4 : « with an average rating of 4.9/5. » → « rated 4.8/5 on Google (36 reviews) — [see the reviews](https://maps.goo… »

COMMIT;

-- ── Vérification (lecture seule) : une ligne par article ; fr_ok / en_ok = true quand toutes les modifications de la langue sont en place, NULL = langue non touchée.
SELECT slug,
  CASE slug
    WHEN 'coliving-communaute-reels-amis-geneve-annemasse' THEN (position($f$plus de 150 résidents$f$ IN content_fr) = 0
      AND position($f$nos maisons affichent une note moyenne de 4,9/5$f$ IN content_fr) = 0
      AND position($f$: on reste parce qu'on s'y sent bien.$f$ IN content_fr) = 0)
    WHEN 'lodge-annemasse-coliving-premium-portes-geneve' THEN (position($f$plus de 150 résidents$f$ IN content_fr) = 0
      AND position($f$avec une note moyenne de 4,9/5.$f$ IN content_fr) = 0)
  END AS fr_ok,
  CASE slug
    WHEN 'coliving-communaute-reels-amis-geneve-annemasse' THEN (position($f$more than 150 residents$f$ IN content_en) = 0
      AND position($f$our houses hold an average rating of 4.9/5 and an average stay of$f$ IN content_en) = 0
      AND position($f$: people stay because they feel good here.$f$ IN content_en) = 0)
    WHEN 'lodge-annemasse-coliving-premium-portes-geneve' THEN (position($f$more than 150 residents$f$ IN content_en) = 0
      AND position($f$with an average rating of 4.9/5.$f$ IN content_en) = 0)
  END AS en_ok
FROM blog_posts
WHERE slug IN ('coliving-communaute-reels-amis-geneve-annemasse', 'lodge-annemasse-coliving-premium-portes-geneve')
ORDER BY slug;

-- ── Retour arrière (inverse exact, mêmes gardes miroir) : retirer les deux lignes /* et */ puis exécuter le bloc.
/*
BEGIN;

UPDATE blog_posts
SET content_en = replace(content_en, $r$rated 4.8/5 on Google (36 reviews) — [see the reviews](https://maps.google.com/?cid=14514002506022967350).$r$, $f$with an average rating of 4.9/5.$f$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($r$rated 4.8/5 on Google (36 reviews) — [see the reviews](https://maps.google.com/?cid=14514002506022967350).$r$ IN content_en) > 0
  AND position($f$with an average rating of 4.9/5.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$more than 100 residents$r$, $f$more than 150 residents$f$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($r$more than 100 residents$r$ IN content_en) > 0
  AND position($f$more than 150 residents$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$avec une note de 4,8/5 sur Google (36 avis) — [voir les avis](https://maps.google.com/?cid=14514002506022967350).$r$, $f$avec une note moyenne de 4,9/5.$f$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($r$avec une note de 4,8/5 sur Google (36 avis) — [voir les avis](https://maps.google.com/?cid=14514002506022967350).$r$ IN content_fr) > 0
  AND position($f$avec une note moyenne de 4,9/5.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$plus de 100 résidents$r$, $f$plus de 150 résidents$f$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($r$plus de 100 résidents$r$ IN content_fr) > 0
  AND position($f$plus de 150 résidents$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$: people stay because they feel good here — [see the reviews](https://maps.google.com/?cid=14514002506022967350).$r$, $f$: people stay because they feel good here.$f$),
    updated_at = now()
WHERE slug = 'coliving-communaute-reels-amis-geneve-annemasse'
  AND position($r$: people stay because they feel good here — [see the reviews](https://maps.google.com/?cid=14514002506022967350).$r$ IN content_en) > 0
  AND position($f$: people stay because they feel good here.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$La Villa Coliving is rated 4.8/5 on Google (36 reviews), with an average stay of$r$, $f$our houses hold an average rating of 4.9/5 and an average stay of$f$),
    updated_at = now()
WHERE slug = 'coliving-communaute-reels-amis-geneve-annemasse'
  AND position($r$La Villa Coliving is rated 4.8/5 on Google (36 reviews), with an average stay of$r$ IN content_en) > 0
  AND position($f$our houses hold an average rating of 4.9/5 and an average stay of$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$: on reste parce qu'on s'y sent bien — [voir les avis](https://maps.google.com/?cid=14514002506022967350).$r$, $f$: on reste parce qu'on s'y sent bien.$f$),
    updated_at = now()
WHERE slug = 'coliving-communaute-reels-amis-geneve-annemasse'
  AND position($r$: on reste parce qu'on s'y sent bien — [voir les avis](https://maps.google.com/?cid=14514002506022967350).$r$ IN content_fr) > 0
  AND position($f$: on reste parce qu'on s'y sent bien.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$La Villa Coliving affiche une note de 4,8/5 sur Google (36 avis)$r$, $f$nos maisons affichent une note moyenne de 4,9/5$f$),
    updated_at = now()
WHERE slug = 'coliving-communaute-reels-amis-geneve-annemasse'
  AND position($r$La Villa Coliving affiche une note de 4,8/5 sur Google (36 avis)$r$ IN content_fr) > 0
  AND position($f$nos maisons affichent une note moyenne de 4,9/5$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$more than 100 residents$r$, $f$more than 150 residents$f$),
    updated_at = now()
WHERE slug = 'coliving-communaute-reels-amis-geneve-annemasse'
  AND position($r$more than 100 residents$r$ IN content_en) > 0
  AND position($f$more than 150 residents$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$plus de 100 résidents$r$, $f$plus de 150 résidents$f$),
    updated_at = now()
WHERE slug = 'coliving-communaute-reels-amis-geneve-annemasse'
  AND position($r$plus de 100 résidents$r$ IN content_fr) > 0
  AND position($f$plus de 150 résidents$f$ IN content_fr) = 0;

COMMIT;
*/
