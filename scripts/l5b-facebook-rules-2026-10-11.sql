-- ============================================================================
-- C3 « règles du groupe épinglées » + C2 « emplacement de la mention » (décisions Jérôme du 11/10/2026) : mention A.7 enrichie dans 4 articles, déplacée dans arnaques.
-- Généré le 2026-10-11T12:49:19.405Z par scripts/build-slots-sql.mjs depuis scripts/l5b-facebook-rules.edits.mjs
--   · texte = source unique src/data/answerSlots.ts (facebookMentionMarkdown ← FACEBOOK_GROUP) ; ancienne mention reconstruite (dernière phrase L5 du 10/10) ; ancres = FACEBOOK_MENTION_ARTICLES + MOVE (ce fichier) (FACEBOOK_GROUP_VERSION 2026-10-11, FACEBOOK_GROUP.checkedOn 2026-10-09, FACEBOOK_GROUP.membersApprox 1600)
--   · ancres vérifiées sur le contenu vivant de blog_posts (REST anon, lecture seule) le 2026-10-11T12:49:19.403Z : exactement 1 occurrence de chaque ancien texte, nouveau texte absent
-- À appliquer juste avant le push du code C3 sur main (la garde check:slots exige la mention de la source dans ces 4 articles au prérendu suivant).
-- Idempotent : chaque UPDATE est gardé par position(ancien) > 0 [AND position(nouveau) = 0 quand le nouveau texte n'est pas un fragment de l'ancien] — relancer le fichier est sans effet.
-- Fichier UTF-8 : guillemets « » et accents — ne pas le faire transiter par un éditeur qui normalise les espaces.
-- 12 modifications · 4 articles · état en base à la génération (updated_at · longueur fr / en) :
--   arnaques-logement-frontalier-geneve-eviter · 2026-10-10T08:58:53.487537+00:00 · 12236 / 11070
--   budget-colocation-geneve-guide-complet · 2026-10-10T08:58:53.487537+00:00 · 18403 / 14296
--   guide-ressources-frontalier-geneve · 2026-10-10T08:58:53.487537+00:00 · 44598 / 40757
--   ou-habiter-frontalier-suisse-villes-france-pas-cher · 2026-10-10T08:58:53.487537+00:00 · 9434 / 8932
-- ============================================================================

BEGIN;

-- [1/12] budget-colocation-geneve-guide-complet (fr) · A7 · mention A.7 enrichie (C3 : animé et modéré, règles épinglées), même emplacement
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.$f$, $r$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé et modéré par l'équipe de La Villa Coliving : règles épinglées, annonces douteuses retirées.$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.$f$ IN content_fr) > 0
  AND position($r$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé et modéré par l'équipe de La Villa Coliving : règles épinglées, annonces douteuses retirées.$r$ IN content_fr) = 0;

-- [2/12] budget-colocation-geneve-guide-complet (en) · A7 · mention A.7 enrichie (C3 : animé et modéré, règles épinglées), même emplacement
UPDATE blog_posts
SET content_en = replace(content_en, $f$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.$f$, $r$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run and moderated by the La Villa Coliving team: pinned rules, suspicious listings removed.$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.$f$ IN content_en) > 0
  AND position($r$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run and moderated by the La Villa Coliving team: pinned rules, suspicious listings removed.$r$ IN content_en) = 0;

-- [3/12] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · A7 · mention A.7 enrichie (C3 : animé et modéré, règles épinglées), même emplacement
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.$f$, $r$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé et modéré par l'équipe de La Villa Coliving : règles épinglées, annonces douteuses retirées.$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.$f$ IN content_fr) > 0
  AND position($r$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé et modéré par l'équipe de La Villa Coliving : règles épinglées, annonces douteuses retirées.$r$ IN content_fr) = 0;

-- [4/12] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · A7 · mention A.7 enrichie (C3 : animé et modéré, règles épinglées), même emplacement
UPDATE blog_posts
SET content_en = replace(content_en, $f$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.$f$, $r$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run and moderated by the La Villa Coliving team: pinned rules, suspicious listings removed.$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.$f$ IN content_en) > 0
  AND position($r$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run and moderated by the La Villa Coliving team: pinned rules, suspicious listings removed.$r$ IN content_en) = 0;

-- [5/12] guide-ressources-frontalier-geneve (fr) · A7 · mention A.7 enrichie (C3 : animé et modéré, règles épinglées), même emplacement
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.$f$, $r$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé et modéré par l'équipe de La Villa Coliving : règles épinglées, annonces douteuses retirées.$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.$f$ IN content_fr) > 0
  AND position($r$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé et modéré par l'équipe de La Villa Coliving : règles épinglées, annonces douteuses retirées.$r$ IN content_fr) = 0;

-- [6/12] guide-ressources-frontalier-geneve (en) · A7 · mention A.7 enrichie (C3 : animé et modéré, règles épinglées), même emplacement
UPDATE blog_posts
SET content_en = replace(content_en, $f$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.$f$, $r$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run and moderated by the La Villa Coliving team: pinned rules, suspicious listings removed.$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.$f$ IN content_en) > 0
  AND position($r$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run and moderated by the La Villa Coliving team: pinned rules, suspicious listings removed.$r$ IN content_en) = 0;

-- [7/12] arnaques-logement-frontalier-geneve-eviter (fr) · A7 · retrait de la mention A.7 en fin de section (avant « ## L'alternative sécurisée : le coliving »)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$
Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.

## L'alternative sécurisée : le coliving
$f$, $r$
## L'alternative sécurisée : le coliving
$r$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($f$
Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.

## L'alternative sécurisée : le coliving
$f$ IN content_fr) > 0;

-- [8/12] arnaques-logement-frontalier-geneve-eviter (fr) · A7 · phrase précédente retouchée (anaphore « Pour un… / Pour une… » après le déplacement)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Pour un nouveau frontalier qui ne connaît pas encore le marché local, c'est une sécurité non négligeable :$f$, $r$Un nouveau frontalier qui ne connaît pas encore le marché local y gagne une sécurité non négligeable :$r$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($f$Pour un nouveau frontalier qui ne connaît pas encore le marché local, c'est une sécurité non négligeable :$f$ IN content_fr) > 0
  AND position($r$Un nouveau frontalier qui ne connaît pas encore le marché local y gagne une sécurité non négligeable :$r$ IN content_fr) = 0;

-- [9/12] arnaques-logement-frontalier-geneve-eviter (fr) · A7 · mention A.7 enrichie réinsérée avant « ## Au-delà des arnaques : les erreurs classiques à » (C2)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$
## Au-delà des arnaques : les erreurs classiques à éviter
$f$, $r$
Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé et modéré par l'équipe de La Villa Coliving : règles épinglées, annonces douteuses retirées.

## Au-delà des arnaques : les erreurs classiques à éviter
$r$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($f$
## Au-delà des arnaques : les erreurs classiques à éviter
$f$ IN content_fr) > 0
  AND position($r$
Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé et modéré par l'équipe de La Villa Coliving : règles épinglées, annonces douteuses retirées.

## Au-delà des arnaques : les erreurs classiques à éviter
$r$ IN content_fr) = 0;

-- [10/12] arnaques-logement-frontalier-geneve-eviter (en) · A7 · retrait de la mention A.7 en fin de section (avant « ## The Secure Alternative: Coliving »)
UPDATE blog_posts
SET content_en = replace(content_en, $f$
For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.

## The Secure Alternative: Coliving
$f$, $r$
## The Secure Alternative: Coliving
$r$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($f$
For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.

## The Secure Alternative: Coliving
$f$ IN content_en) > 0;

-- [11/12] arnaques-logement-frontalier-geneve-eviter (en) · A7 · phrase précédente retouchée (anaphore « Pour un… / Pour une… » après le déplacement)
UPDATE blog_posts
SET content_en = replace(content_en, $f$For a new cross-border worker who doesn't yet know the local market, this is significant security:$f$, $r$A new cross-border worker who doesn't yet know the local market gains real security here:$r$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($f$For a new cross-border worker who doesn't yet know the local market, this is significant security:$f$ IN content_en) > 0
  AND position($r$A new cross-border worker who doesn't yet know the local market gains real security here:$r$ IN content_en) = 0;

-- [12/12] arnaques-logement-frontalier-geneve-eviter (en) · A7 · mention A.7 enrichie réinsérée avant « ## Beyond Scams: The Classic Mistakes to Avoid » (C2)
UPDATE blog_posts
SET content_en = replace(content_en, $f$
## Beyond Scams: The Classic Mistakes to Avoid
$f$, $r$
For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run and moderated by the La Villa Coliving team: pinned rules, suspicious listings removed.

## Beyond Scams: The Classic Mistakes to Avoid
$r$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($f$
## Beyond Scams: The Classic Mistakes to Avoid
$f$ IN content_en) > 0
  AND position($r$
For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run and moderated by the La Villa Coliving team: pinned rules, suspicious listings removed.

## Beyond Scams: The Classic Mistakes to Avoid
$r$ IN content_en) = 0;

-- ── Aperçu des ancrages (ancien → nouveau, première ligne de chaque texte) ──
-- [1] budget-colocation-geneve-guide-complet/fr · A7 : « Pour une colocation classique, le groupe Facebook public [« Coliving & … » → « Pour une colocation classique, le groupe Facebook public [« Coliving & … »
-- [2] budget-colocation-geneve-guide-complet/en · A7 : « For a standard flatshare, the public Facebook group ["Coliving & Coloca… » → « For a standard flatshare, the public Facebook group ["Coliving & Coloca… »
-- [3] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · A7 : « Pour une colocation classique, le groupe Facebook public [« Coliving & … » → « Pour une colocation classique, le groupe Facebook public [« Coliving & … »
-- [4] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · A7 : « For a standard flatshare, the public Facebook group ["Coliving & Coloca… » → « For a standard flatshare, the public Facebook group ["Coliving & Coloca… »
-- [5] guide-ressources-frontalier-geneve/fr · A7 : « Pour une colocation classique, le groupe Facebook public [« Coliving & … » → « Pour une colocation classique, le groupe Facebook public [« Coliving & … »
-- [6] guide-ressources-frontalier-geneve/en · A7 : « For a standard flatshare, the public Facebook group ["Coliving & Coloca… » → « For a standard flatshare, the public Facebook group ["Coliving & Coloca… »
-- [7] arnaques-logement-frontalier-geneve-eviter/fr · A7 : « ⏎Pour une colocation classique, le groupe Facebook public [« Coliving &… » → « ⏎## L'alternative sécurisée : le coliving⏎ »
-- [8] arnaques-logement-frontalier-geneve-eviter/fr · A7 : « Pour un nouveau frontalier qui ne connaît pas encore le marché local, c… » → « Un nouveau frontalier qui ne connaît pas encore le marché local y gagne… »
-- [9] arnaques-logement-frontalier-geneve-eviter/fr · A7 : « ⏎## Au-delà des arnaques : les erreurs classiques à éviter⏎ » → « ⏎Pour une colocation classique, le groupe Facebook public [« Coliving &… »
-- [10] arnaques-logement-frontalier-geneve-eviter/en · A7 : « ⏎For a standard flatshare, the public Facebook group ["Coliving & Coloc… » → « ⏎## The Secure Alternative: Coliving⏎ »
-- [11] arnaques-logement-frontalier-geneve-eviter/en · A7 : « For a new cross-border worker who doesn't yet know the local market, th… » → « A new cross-border worker who doesn't yet know the local market gains r… »
-- [12] arnaques-logement-frontalier-geneve-eviter/en · A7 : « ⏎## Beyond Scams: The Classic Mistakes to Avoid⏎ » → « ⏎For a standard flatshare, the public Facebook group ["Coliving & Coloc… »

COMMIT;

-- ── Vérification (lecture seule) : une ligne par article ; fr_ok / en_ok = true quand toutes les modifications de la langue sont en place, NULL = langue non touchée.
SELECT slug,
  CASE slug
    WHEN 'arnaques-logement-frontalier-geneve-eviter' THEN (position($f$
Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.

## L'alternative sécurisée : le coliving
$f$ IN content_fr) = 0
      AND position($f$Pour un nouveau frontalier qui ne connaît pas encore le marché local, c'est une sécurité non négligeable :$f$ IN content_fr) = 0
      AND position($r$
Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé et modéré par l'équipe de La Villa Coliving : règles épinglées, annonces douteuses retirées.

## Au-delà des arnaques : les erreurs classiques à éviter
$r$ IN content_fr) > 0)
    WHEN 'budget-colocation-geneve-guide-complet' THEN (position($f$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.$f$ IN content_fr) = 0)
    WHEN 'guide-ressources-frontalier-geneve' THEN (position($f$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.$f$ IN content_fr) = 0)
    WHEN 'ou-habiter-frontalier-suisse-villes-france-pas-cher' THEN (position($f$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.$f$ IN content_fr) = 0)
  END AS fr_ok,
  CASE slug
    WHEN 'arnaques-logement-frontalier-geneve-eviter' THEN (position($f$
For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.

## The Secure Alternative: Coliving
$f$ IN content_en) = 0
      AND position($f$For a new cross-border worker who doesn't yet know the local market, this is significant security:$f$ IN content_en) = 0
      AND position($r$
For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run and moderated by the La Villa Coliving team: pinned rules, suspicious listings removed.

## Beyond Scams: The Classic Mistakes to Avoid
$r$ IN content_en) > 0)
    WHEN 'budget-colocation-geneve-guide-complet' THEN (position($f$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.$f$ IN content_en) = 0)
    WHEN 'guide-ressources-frontalier-geneve' THEN (position($f$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.$f$ IN content_en) = 0)
    WHEN 'ou-habiter-frontalier-suisse-villes-france-pas-cher' THEN (position($f$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.$f$ IN content_en) = 0)
  END AS en_ok
FROM blog_posts
WHERE slug IN ('arnaques-logement-frontalier-geneve-eviter', 'budget-colocation-geneve-guide-complet', 'guide-ressources-frontalier-geneve', 'ou-habiter-frontalier-suisse-villes-france-pas-cher')
ORDER BY slug;

-- ── Retour arrière (inverse exact, mêmes gardes miroir) : retirer les deux lignes /* et */ puis exécuter le bloc.
/*
BEGIN;

UPDATE blog_posts
SET content_en = replace(content_en, $r$
For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run and moderated by the La Villa Coliving team: pinned rules, suspicious listings removed.

## Beyond Scams: The Classic Mistakes to Avoid
$r$, $f$
## Beyond Scams: The Classic Mistakes to Avoid
$f$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($r$
For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run and moderated by the La Villa Coliving team: pinned rules, suspicious listings removed.

## Beyond Scams: The Classic Mistakes to Avoid
$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$A new cross-border worker who doesn't yet know the local market gains real security here:$r$, $f$For a new cross-border worker who doesn't yet know the local market, this is significant security:$f$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($r$A new cross-border worker who doesn't yet know the local market gains real security here:$r$ IN content_en) > 0
  AND position($f$For a new cross-border worker who doesn't yet know the local market, this is significant security:$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$
## The Secure Alternative: Coliving
$r$, $f$
For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.

## The Secure Alternative: Coliving
$f$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($r$
## The Secure Alternative: Coliving
$r$ IN content_en) > 0
  AND position($f$
For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.

## The Secure Alternative: Coliving
$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$
Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé et modéré par l'équipe de La Villa Coliving : règles épinglées, annonces douteuses retirées.

## Au-delà des arnaques : les erreurs classiques à éviter
$r$, $f$
## Au-delà des arnaques : les erreurs classiques à éviter
$f$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($r$
Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé et modéré par l'équipe de La Villa Coliving : règles épinglées, annonces douteuses retirées.

## Au-delà des arnaques : les erreurs classiques à éviter
$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Un nouveau frontalier qui ne connaît pas encore le marché local y gagne une sécurité non négligeable :$r$, $f$Pour un nouveau frontalier qui ne connaît pas encore le marché local, c'est une sécurité non négligeable :$f$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($r$Un nouveau frontalier qui ne connaît pas encore le marché local y gagne une sécurité non négligeable :$r$ IN content_fr) > 0
  AND position($f$Pour un nouveau frontalier qui ne connaît pas encore le marché local, c'est une sécurité non négligeable :$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$
## L'alternative sécurisée : le coliving
$r$, $f$
Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.

## L'alternative sécurisée : le coliving
$f$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($r$
## L'alternative sécurisée : le coliving
$r$ IN content_fr) > 0
  AND position($f$
Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.

## L'alternative sécurisée : le coliving
$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run and moderated by the La Villa Coliving team: pinned rules, suspicious listings removed.$r$, $f$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run and moderated by the La Villa Coliving team: pinned rules, suspicious listings removed.$r$ IN content_en) > 0
  AND position($f$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé et modéré par l'équipe de La Villa Coliving : règles épinglées, annonces douteuses retirées.$r$, $f$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé et modéré par l'équipe de La Villa Coliving : règles épinglées, annonces douteuses retirées.$r$ IN content_fr) > 0
  AND position($f$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run and moderated by the La Villa Coliving team: pinned rules, suspicious listings removed.$r$, $f$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run and moderated by the La Villa Coliving team: pinned rules, suspicious listings removed.$r$ IN content_en) > 0
  AND position($f$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé et modéré par l'équipe de La Villa Coliving : règles épinglées, annonces douteuses retirées.$r$, $f$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé et modéré par l'équipe de La Villa Coliving : règles épinglées, annonces douteuses retirées.$r$ IN content_fr) > 0
  AND position($f$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run and moderated by the La Villa Coliving team: pinned rules, suspicious listings removed.$r$, $f$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run and moderated by the La Villa Coliving team: pinned rules, suspicious listings removed.$r$ IN content_en) > 0
  AND position($f$For a standard flatshare, the public Facebook group ["Coliving & Colocation à Genève et alentours !"](https://www.facebook.com/groups/1035429495275120/) (about 1,600 members, around a hundred listings a month covering Geneva and the French border area) gathers room and flatmate listings. It is run by the La Villa Coliving team.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé et modéré par l'équipe de La Villa Coliving : règles épinglées, annonces douteuses retirées.$r$, $f$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé et modéré par l'équipe de La Villa Coliving : règles épinglées, annonces douteuses retirées.$r$ IN content_fr) > 0
  AND position($f$Pour une colocation classique, le groupe Facebook public [« Coliving & Colocation à Genève et alentours ! »](https://www.facebook.com/groups/1035429495275120/) (environ 1 600 membres, une centaine d'annonces par mois sur Genève et la France voisine) regroupe des annonces de chambres et de colocataires. Il est animé par l'équipe de La Villa Coliving.$f$ IN content_fr) = 0;

COMMIT;
*/
