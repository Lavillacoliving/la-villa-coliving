-- ============================================================================
-- Lot L5 « Groupe Facebook comme ressource nommée » (brief « Ingénierie des créneaux », D5 / D10 de Jérôme) : mention canonique A.7 insérée dans 4 articles, devant une ancre conservée.
-- Généré le 2026-10-10T08:58:12.507Z par scripts/build-slots-sql.mjs depuis scripts/l5-facebook.edits.mjs
--   · texte inséré = source unique src/data/answerSlots.ts (facebookMentionMarkdown ← FACEBOOK_GROUP de src/data/stats.ts : nom, url, membres, volume) ; ancres = FACEBOOK_MENTION_ARTICLES (FACEBOOK_GROUP_VERSION 2026-10-10, FACEBOOK_GROUP.checkedOn 2026-10-09, FACEBOOK_GROUP.membersApprox 1600)
--   · ancres vérifiées sur le contenu vivant de blog_posts (REST anon, lecture seule) le 2026-10-10T08:58:12.505Z : exactement 1 occurrence de chaque ancien texte, nouveau texte absent
-- À appliquer dans le même créneau que le déploiement du code L5 (la garde check:slots exige la mention dans ces 4 articles dès le prérendu suivant).
-- Idempotent : chaque UPDATE est gardé par position(ancien) > 0 [AND position(nouveau) = 0 quand le nouveau texte n'est pas un fragment de l'ancien] — relancer le fichier est sans effet.
-- Fichier UTF-8 : il contient des guillemets « » et des accents — ne pas le faire transiter par un éditeur qui normalise les espaces.
-- 8 modifications · 4 articles · état en base à la génération (updated_at · longueur fr / en) :
--   arnaques-logement-frontalier-geneve-eviter · 2026-10-09T14:33:23.72146+00:00 · 11883 / 10739
--   budget-colocation-geneve-guide-complet · 2026-10-10T08:05:59.012724+00:00 · 18050 / 13965
--   guide-ressources-frontalier-geneve · 2026-10-10T08:05:59.012724+00:00 · 44245 / 40426
--   ou-habiter-frontalier-suisse-villes-france-pas-cher · 2026-10-10T08:05:59.012724+00:00 · 9081 / 8601
-- ============================================================================

BEGIN;

-- [1/8] budget-colocation-geneve-guide-complet (fr) · A7 · mention canonique du groupe Facebook (A.7, D5) insérée avant « ### 3. Coliving premium ( »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$### 3. Coliving premium ($f$, $r$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.

### 3. Coliving premium ($r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$### 3. Coliving premium ($f$ IN content_fr) > 0
  AND position($r$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.

### 3. Coliving premium ($r$ IN content_fr) = 0;

-- [2/8] budget-colocation-geneve-guide-complet (en) · A7 · mention canonique du groupe Facebook (A.7, D5) insérée avant « ### 3. Premium coliving ( »
UPDATE blog_posts
SET content_en = replace(content_en, $f$### 3. Premium coliving ($f$, $r$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.

### 3. Premium coliving ($r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$### 3. Premium coliving ($f$ IN content_en) > 0
  AND position($r$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.

### 3. Premium coliving ($r$ IN content_en) = 0;

-- [3/8] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · A7 · mention canonique du groupe Facebook (A.7, D5) insérée avant « ## En résumé »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$
## En résumé
$f$, $r$
Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.

## En résumé
$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$
## En résumé
$f$ IN content_fr) > 0
  AND position($r$
Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.

## En résumé
$r$ IN content_fr) = 0;

-- [4/8] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · A7 · mention canonique du groupe Facebook (A.7, D5) insérée avant « ## TL;DR »
UPDATE blog_posts
SET content_en = replace(content_en, $f$
## TL;DR
$f$, $r$
For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.

## TL;DR
$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$
## TL;DR
$f$ IN content_en) > 0
  AND position($r$
For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.

## TL;DR
$r$ IN content_en) = 0;

-- [5/8] guide-ressources-frontalier-geneve (fr) · A7 · mention canonique du groupe Facebook (A.7, D5) insérée avant « # Et chez La Villa ? »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$
# Et chez La Villa ?
$f$, $r$
Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.

# Et chez La Villa ?
$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$
# Et chez La Villa ?
$f$ IN content_fr) > 0
  AND position($r$
Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.

# Et chez La Villa ?
$r$ IN content_fr) = 0;

-- [6/8] guide-ressources-frontalier-geneve (en) · A7 · mention canonique du groupe Facebook (A.7, D5) insérée avant « # And at La Villa? »
UPDATE blog_posts
SET content_en = replace(content_en, $f$
# And at La Villa?
$f$, $r$
For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.

# And at La Villa?
$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$
# And at La Villa?
$f$ IN content_en) > 0
  AND position($r$
For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.

# And at La Villa?
$r$ IN content_en) = 0;

-- [7/8] arnaques-logement-frontalier-geneve-eviter (fr) · A7 · mention canonique du groupe Facebook (A.7, D5) insérée avant « ## L'alternative sécurisée : le coliving »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$
## L'alternative sécurisée : le coliving
$f$, $r$
Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.

## L'alternative sécurisée : le coliving
$r$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($f$
## L'alternative sécurisée : le coliving
$f$ IN content_fr) > 0
  AND position($r$
Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.

## L'alternative sécurisée : le coliving
$r$ IN content_fr) = 0;

-- [8/8] arnaques-logement-frontalier-geneve-eviter (en) · A7 · mention canonique du groupe Facebook (A.7, D5) insérée avant « ## The Secure Alternative: Coliving »
UPDATE blog_posts
SET content_en = replace(content_en, $f$
## The Secure Alternative: Coliving
$f$, $r$
For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.

## The Secure Alternative: Coliving
$r$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($f$
## The Secure Alternative: Coliving
$f$ IN content_en) > 0
  AND position($r$
For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.

## The Secure Alternative: Coliving
$r$ IN content_en) = 0;

-- ── Aperçu des ancrages (ancien → nouveau, première ligne de chaque texte) ──
-- [1] budget-colocation-geneve-guide-complet/fr · A7 : « ### 3. Coliving premium ( » → « Pour une colocation classique, le groupe Facebook public [« Coliving & … »
-- [2] budget-colocation-geneve-guide-complet/en · A7 : « ### 3. Premium coliving ( » → « For a standard flatshare, the public Facebook group ["Coliving & Coloca… »
-- [3] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · A7 : « ⏎## En résumé⏎ » → « ⏎Pour une colocation classique, le groupe Facebook public [« Coliving &… »
-- [4] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · A7 : « ⏎## TL;DR⏎ » → « ⏎For a standard flatshare, the public Facebook group ["Coliving & Coloc… »
-- [5] guide-ressources-frontalier-geneve/fr · A7 : « ⏎# Et chez La Villa ?⏎ » → « ⏎Pour une colocation classique, le groupe Facebook public [« Coliving &… »
-- [6] guide-ressources-frontalier-geneve/en · A7 : « ⏎# And at La Villa?⏎ » → « ⏎For a standard flatshare, the public Facebook group ["Coliving & Coloc… »
-- [7] arnaques-logement-frontalier-geneve-eviter/fr · A7 : « ⏎## L'alternative sécurisée : le coliving⏎ » → « ⏎Pour une colocation classique, le groupe Facebook public [« Coliving &… »
-- [8] arnaques-logement-frontalier-geneve-eviter/en · A7 : « ⏎## The Secure Alternative: Coliving⏎ » → « ⏎For a standard flatshare, the public Facebook group ["Coliving & Coloc… »

COMMIT;

-- ── Vérification (lecture seule) : une ligne par article ; fr_ok / en_ok = true quand toutes les modifications de la langue sont en place, NULL = langue non touchée.
SELECT slug,
  CASE slug
    WHEN 'arnaques-logement-frontalier-geneve-eviter' THEN (position($r$
Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.

## L'alternative sécurisée : le coliving
$r$ IN content_fr) > 0)
    WHEN 'budget-colocation-geneve-guide-complet' THEN (position($r$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.

### 3. Coliving premium ($r$ IN content_fr) > 0)
    WHEN 'guide-ressources-frontalier-geneve' THEN (position($r$
Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.

# Et chez La Villa ?
$r$ IN content_fr) > 0)
    WHEN 'ou-habiter-frontalier-suisse-villes-france-pas-cher' THEN (position($r$
Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.

## En résumé
$r$ IN content_fr) > 0)
  END AS fr_ok,
  CASE slug
    WHEN 'arnaques-logement-frontalier-geneve-eviter' THEN (position($r$
For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.

## The Secure Alternative: Coliving
$r$ IN content_en) > 0)
    WHEN 'budget-colocation-geneve-guide-complet' THEN (position($r$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.

### 3. Premium coliving ($r$ IN content_en) > 0)
    WHEN 'guide-ressources-frontalier-geneve' THEN (position($r$
For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.

# And at La Villa?
$r$ IN content_en) > 0)
    WHEN 'ou-habiter-frontalier-suisse-villes-france-pas-cher' THEN (position($r$
For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.

## TL;DR
$r$ IN content_en) > 0)
  END AS en_ok
FROM blog_posts
WHERE slug IN ('arnaques-logement-frontalier-geneve-eviter', 'budget-colocation-geneve-guide-complet', 'guide-ressources-frontalier-geneve', 'ou-habiter-frontalier-suisse-villes-france-pas-cher')
ORDER BY slug;

-- ── Retour arrière (inverse exact, mêmes gardes miroir) : retirer les deux lignes /* et */ puis exécuter le bloc.
/*
BEGIN;

UPDATE blog_posts
SET content_en = replace(content_en, $r$
For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.

## The Secure Alternative: Coliving
$r$, $f$
## The Secure Alternative: Coliving
$f$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($r$
For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.

## The Secure Alternative: Coliving
$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$
Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.

## L'alternative sécurisée : le coliving
$r$, $f$
## L'alternative sécurisée : le coliving
$f$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($r$
Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.

## L'alternative sécurisée : le coliving
$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$
For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.

# And at La Villa?
$r$, $f$
# And at La Villa?
$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$
For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.

# And at La Villa?
$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$
Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.

# Et chez La Villa ?
$r$, $f$
# Et chez La Villa ?
$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$
Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.

# Et chez La Villa ?
$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$
For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.

## TL;DR
$r$, $f$
## TL;DR
$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$
For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.

## TL;DR
$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$
Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.

## En résumé
$r$, $f$
## En résumé
$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$
Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.

## En résumé
$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.

### 3. Premium coliving ($r$, $f$### 3. Premium coliving ($f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.

### 3. Premium coliving ($r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.

### 3. Coliving premium ($r$, $f$### 3. Coliving premium ($f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.

### 3. Coliving premium ($r$ IN content_fr) > 0;

COMMIT;
*/
