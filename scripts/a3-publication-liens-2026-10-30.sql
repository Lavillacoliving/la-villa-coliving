-- ============================================================================
-- Publication d'A3 (brief « Genève profils » du 30/10/2026) : ancres D-A3b réécrites vers A3 et liens entrants (permis G, s'installer, arnaques, guide ressources).
-- Généré le 2026-10-30T15:19:55.433Z par scripts/build-slots-sql.mjs depuis scripts/a3-publication.edits.mjs
--   · chaînes relevées sur la base vivante le 30/10
--   · ancres vérifiées sur le contenu vivant de blog_posts (REST anon, lecture seule) le 2026-10-30T15:19:55.426Z : exactement 1 occurrence de chaque ancien texte, nouveau texte absent
-- AVANT le SQL de publication d'A3 (maj-article-trouver-logement-avant-d-arriver-geneve-<date>.sql), dans la même séance, sur feu vert de Jérôme.
-- Idempotent : chaque UPDATE est gardé par position(ancien) > 0 [AND position(nouveau) = 0 quand le nouveau texte n'est pas un fragment de l'ancien] — relancer le fichier est sans effet.
-- Fichier UTF-8 — ne pas normaliser les espaces.
-- 22 modifications · 11 articles · état en base à la génération (updated_at · longueur fr / en) :
--   arnaques-logement-frontalier-geneve-eviter · 2026-10-16T12:43:19.689087+00:00 · 12448 / 11278
--   banque-telephone-internet-frontalier-bons-plans · 2026-10-13T15:30:10.955122+00:00 · 10148 / 9408
--   choc-culturel-franco-suisse-expatrie-geneve · 2026-10-13T15:31:18.575275+00:00 · 10967 / 10298
--   dossier-location-frontalier-suisse-france · 2026-10-13T15:32:15.797408+00:00 · 9015 / 8352
--   guide-ressources-frontalier-geneve · 2026-10-13T15:33:46.184445+00:00 · 44671 / 40830
--   organisations-internationales-geneve-ou-habiter · 2026-10-14T09:24:43.338645+00:00 · 7539 / 6911
--   ou-habiter-frontalier-suisse-villes-france-pas-cher · 2026-10-13T15:34:45.02722+00:00 · 9288 / 8733
--   permis-g-frontalier-geneve · 2026-10-13T15:38:43.170367+00:00 · 5956 / 5611
--   s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france · 2026-10-09T14:36:49.066755+00:00 · 14395 / 14396
--   se-faire-reseau-geneve-arriver-seul · 2026-10-13T15:39:32.874791+00:00 · 10671 / 9630
--   vie-quotidienne-frontalier-courses-sport-sorties · 2026-10-13T15:39:52.091173+00:00 · 9459 / 8713
-- ============================================================================

BEGIN;

-- [1/22] banque-telephone-internet-frontalier-bons-plans (fr) · ANCRES · D-A3b · ancre « Arriver seul… » → titre d'A3 (l'ancienne cible est fondue dans A3)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$- [Arriver seul à Genève : le guide 30 jours](/blog/demenager-geneve-frontalier-checklist)$f$, $r$- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)$r$),
    updated_at = now()
WHERE slug = 'banque-telephone-internet-frontalier-bons-plans'
  AND position($f$- [Arriver seul à Genève : le guide 30 jours](/blog/demenager-geneve-frontalier-checklist)$f$ IN content_fr) > 0
  AND position($r$- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)$r$ IN content_fr) = 0;

-- [2/22] banque-telephone-internet-frontalier-bons-plans (en) · ANCRES · D-A3b · "Arriving alone…" anchor → A3 title (the old target is merged into A3)
UPDATE blog_posts
SET content_en = replace(content_en, $f$- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)$f$, $r$- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)$r$),
    updated_at = now()
WHERE slug = 'banque-telephone-internet-frontalier-bons-plans'
  AND position($f$- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)$f$ IN content_en) > 0
  AND position($r$- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)$r$ IN content_en) = 0;

-- [3/22] choc-culturel-franco-suisse-expatrie-geneve (fr) · ANCRES · D-A3b · ancre « Arriver seul… » → titre d'A3 (l'ancienne cible est fondue dans A3)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$- [Arriver seul à Genève : le guide 30 jours](/blog/demenager-geneve-frontalier-checklist)$f$, $r$- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)$r$),
    updated_at = now()
WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve'
  AND position($f$- [Arriver seul à Genève : le guide 30 jours](/blog/demenager-geneve-frontalier-checklist)$f$ IN content_fr) > 0
  AND position($r$- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)$r$ IN content_fr) = 0;

-- [4/22] choc-culturel-franco-suisse-expatrie-geneve (en) · ANCRES · D-A3b · "Arriving alone…" anchor → A3 title (the old target is merged into A3)
UPDATE blog_posts
SET content_en = replace(content_en, $f$- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)$f$, $r$- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)$r$),
    updated_at = now()
WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve'
  AND position($f$- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)$f$ IN content_en) > 0
  AND position($r$- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)$r$ IN content_en) = 0;

-- [5/22] dossier-location-frontalier-suisse-france (fr) · ANCRES · D-A3b · ancre « Arriver seul… » → titre d'A3 (l'ancienne cible est fondue dans A3)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$- [Arriver seul à Genève : le guide des 30 premiers jours](/blog/demenager-geneve-frontalier-checklist)$f$, $r$- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)$r$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($f$- [Arriver seul à Genève : le guide des 30 premiers jours](/blog/demenager-geneve-frontalier-checklist)$f$ IN content_fr) > 0
  AND position($r$- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)$r$ IN content_fr) = 0;

-- [6/22] dossier-location-frontalier-suisse-france (en) · ANCRES · D-A3b · "Arriving alone…" anchor → A3 title (the old target is merged into A3)
UPDATE blog_posts
SET content_en = replace(content_en, $f$- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)$f$, $r$- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)$r$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($f$- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)$f$ IN content_en) > 0
  AND position($r$- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)$r$ IN content_en) = 0;

-- [7/22] se-faire-reseau-geneve-arriver-seul (fr) · ANCRES · D-A3b · ancre « Arriver seul… » → titre d'A3 (l'ancienne cible est fondue dans A3)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$- [Arriver seul à Genève : le guide 30 jours](/blog/demenager-geneve-frontalier-checklist)$f$, $r$- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)$r$),
    updated_at = now()
WHERE slug = 'se-faire-reseau-geneve-arriver-seul'
  AND position($f$- [Arriver seul à Genève : le guide 30 jours](/blog/demenager-geneve-frontalier-checklist)$f$ IN content_fr) > 0
  AND position($r$- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)$r$ IN content_fr) = 0;

-- [8/22] se-faire-reseau-geneve-arriver-seul (en) · ANCRES · D-A3b · "Arriving alone…" anchor → A3 title (the old target is merged into A3)
UPDATE blog_posts
SET content_en = replace(content_en, $f$- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)$f$, $r$- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)$r$),
    updated_at = now()
WHERE slug = 'se-faire-reseau-geneve-arriver-seul'
  AND position($f$- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)$f$ IN content_en) > 0
  AND position($r$- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)$r$ IN content_en) = 0;

-- [9/22] vie-quotidienne-frontalier-courses-sport-sorties (fr) · ANCRES · D-A3b · ancre « Arriver seul… » → titre d'A3 (l'ancienne cible est fondue dans A3)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$- [Arriver seul à Genève : le guide 30 jours](/blog/demenager-geneve-frontalier-checklist)$f$, $r$- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)$r$),
    updated_at = now()
WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties'
  AND position($f$- [Arriver seul à Genève : le guide 30 jours](/blog/demenager-geneve-frontalier-checklist)$f$ IN content_fr) > 0
  AND position($r$- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)$r$ IN content_fr) = 0;

-- [10/22] vie-quotidienne-frontalier-courses-sport-sorties (en) · ANCRES · D-A3b · "Arriving alone…" anchor → A3 title (the old target is merged into A3)
UPDATE blog_posts
SET content_en = replace(content_en, $f$- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)$f$, $r$- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)$r$),
    updated_at = now()
WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties'
  AND position($f$- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)$f$ IN content_en) > 0
  AND position($r$- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)$r$ IN content_en) = 0;

-- [11/22] organisations-internationales-geneve-ou-habiter (fr) · ANCRES · D-A3b · deux puces vers la checklist (« Arriver seul… », « Déménager… ») → une seule puce vers A3 (sinon doublon après consolidation)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$- [Arriver seul à Genève : les 30 premiers jours](/blog/demenager-geneve-frontalier-checklist)
- [Déménager près de Genève : la checklist complète](/blog/demenager-geneve-frontalier-checklist)$f$, $r$- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)$r$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($f$- [Arriver seul à Genève : les 30 premiers jours](/blog/demenager-geneve-frontalier-checklist)
- [Déménager près de Genève : la checklist complète](/blog/demenager-geneve-frontalier-checklist)$f$ IN content_fr) > 0
  AND position($r$- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)$r$ IN content_fr) = 0;

-- [12/22] organisations-internationales-geneve-ou-habiter (en) · ANCRES · D-A3b · two bullets to the checklist → one bullet to A3 (otherwise a duplicate after consolidation)
UPDATE blog_posts
SET content_en = replace(content_en, $f$- [Arriving alone in Geneva: the first 30 days](/en/blog/demenager-geneve-frontalier-checklist)
- [Moving near Geneva: the complete checklist](/en/blog/demenager-geneve-frontalier-checklist)$f$, $r$- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)$r$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($f$- [Arriving alone in Geneva: the first 30 days](/en/blog/demenager-geneve-frontalier-checklist)
- [Moving near Geneva: the complete checklist](/en/blog/demenager-geneve-frontalier-checklist)$f$ IN content_en) > 0
  AND position($r$- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)$r$ IN content_en) = 0;

-- [13/22] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · ANCRES · D-A3b · « la checklist déménagement de La Villa » → ancre descriptive d'A3
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Une fois ta ville choisie, [la checklist déménagement de La Villa](/blog/demenager-geneve-frontalier-checklist) t'évite d'oublier une démarche.$f$, $r$Une fois ta ville choisie, [le calendrier pour te loger côté France avant d'arriver](/blog/trouver-logement-avant-d-arriver-geneve) t'évite d'oublier une étape.$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$Une fois ta ville choisie, [la checklist déménagement de La Villa](/blog/demenager-geneve-frontalier-checklist) t'évite d'oublier une démarche.$f$ IN content_fr) > 0
  AND position($r$Une fois ta ville choisie, [le calendrier pour te loger côté France avant d'arriver](/blog/trouver-logement-avant-d-arriver-geneve) t'évite d'oublier une étape.$r$ IN content_fr) = 0;

-- [14/22] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · ANCRES · D-A3b · "La Villa's moving checklist" → descriptive anchor to A3
UPDATE blog_posts
SET content_en = replace(content_en, $f$Once you've picked your town, [La Villa's moving checklist](/en/blog/demenager-geneve-frontalier-checklist) makes sure you don't miss a step.$f$, $r$Once you've picked your town, [our countdown to finding housing in France before you arrive](/en/blog/trouver-logement-avant-d-arriver-geneve) makes sure you don't miss a step.$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$Once you've picked your town, [La Villa's moving checklist](/en/blog/demenager-geneve-frontalier-checklist) makes sure you don't miss a step.$f$ IN content_en) > 0
  AND position($r$Once you've picked your town, [our countdown to finding housing in France before you arrive](/en/blog/trouver-logement-avant-d-arriver-geneve) makes sure you don't miss a step.$r$ IN content_en) = 0;

-- [15/22] permis-g-frontalier-geneve (fr) · LIENS · lien entrant vers A3 à la fin de « Permis G et logement »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Découvre [nos maisons](/nos-maisons).

## En résumé$f$, $r$Découvre [nos maisons](/nos-maisons).

Si tu n'as pas encore de logement et que tu ne peux pas visiter avant d'arriver, [notre calendrier de J-60 au jour J](/blog/trouver-logement-avant-d-arriver-geneve) te dit quoi faire et quand.

## En résumé$r$),
    updated_at = now()
WHERE slug = 'permis-g-frontalier-geneve'
  AND position($f$Découvre [nos maisons](/nos-maisons).

## En résumé$f$ IN content_fr) > 0
  AND position($r$Découvre [nos maisons](/nos-maisons).

Si tu n'as pas encore de logement et que tu ne peux pas visiter avant d'arriver, [notre calendrier de J-60 au jour J](/blog/trouver-logement-avant-d-arriver-geneve) te dit quoi faire et quand.

## En résumé$r$ IN content_fr) = 0;

-- [16/22] permis-g-frontalier-geneve (en) · LIENS · inbound link to A3 at the end of "Permis G and housing"
UPDATE blog_posts
SET content_en = replace(content_en, $f$Discover [our houses](/en/nos-maisons).

## In short$f$, $r$Discover [our houses](/en/nos-maisons).

If you don't have a place yet and can't view before you arrive, [our countdown from D-60 to day 0](/en/blog/trouver-logement-avant-d-arriver-geneve) tells you what to do and when.

## In short$r$),
    updated_at = now()
WHERE slug = 'permis-g-frontalier-geneve'
  AND position($f$Discover [our houses](/en/nos-maisons).

## In short$f$ IN content_en) > 0
  AND position($r$Discover [our houses](/en/nos-maisons).

If you don't have a place yet and can't view before you arrive, [our countdown from D-60 to day 0](/en/blog/trouver-logement-avant-d-arriver-geneve) tells you what to do and when.

## In short$r$ IN content_en) = 0;

-- [17/22] s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france (fr) · LIENS · lien entrant vers A3 dans « Semaine 1, avant même d'arriver »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Si c'est la France voisine, tu envoies deux ou trois candidatures et tu demandes une visite en visio.$f$, $r$Si c'est la France voisine, tu envoies deux ou trois candidatures et tu demandes une visite en visio. Si tu as deux mois devant toi, [le calendrier pour te loger côté France avant d'arriver](/blog/trouver-logement-avant-d-arriver-geneve) commence à J-60.$r$),
    updated_at = now()
WHERE slug = 's-installer-a-geneve-expatrie-cote-suisse-ou-cote-france'
  AND position($f$Si c'est la France voisine, tu envoies deux ou trois candidatures et tu demandes une visite en visio.$f$ IN content_fr) > 0
  AND position($r$Si c'est la France voisine, tu envoies deux ou trois candidatures et tu demandes une visite en visio. Si tu as deux mois devant toi, [le calendrier pour te loger côté France avant d'arriver](/blog/trouver-logement-avant-d-arriver-geneve) commence à J-60.$r$ IN content_fr) = 0;

-- [18/22] s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france (en) · LIENS · inbound link to A3 in "Week 1, before you even arrive"
UPDATE blog_posts
SET content_en = replace(content_en, $f$If it is the French side, you send two or three applications and ask for a video visit.$f$, $r$If it is the French side, you send two or three applications and ask for a video visit. If you have two months ahead of you, [our countdown to finding housing in France before you arrive](/en/blog/trouver-logement-avant-d-arriver-geneve) starts at D-60.$r$),
    updated_at = now()
WHERE slug = 's-installer-a-geneve-expatrie-cote-suisse-ou-cote-france'
  AND position($f$If it is the French side, you send two or three applications and ask for a video visit.$f$ IN content_en) > 0
  AND position($r$If it is the French side, you send two or three applications and ask for a video visit. If you have two months ahead of you, [our countdown to finding housing in France before you arrive](/en/blog/trouver-logement-avant-d-arriver-geneve) starts at D-60.$r$ IN content_en) = 0;

-- [19/22] arnaques-logement-frontalier-geneve-eviter (fr) · LIENS · lien entrant vers A3 à la fin de « L'arnaque n°1 : le faux propriétaire à distance »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Un vrai propriétaire comprendra la démarche.

## L'arnaque n°2$f$, $r$Un vrai propriétaire comprendra la démarche.

Si tu cherches à distance, [notre calendrier pour te loger côté France avant d'arriver](/blog/trouver-logement-avant-d-arriver-geneve) place ces vérifications au bon moment, avant de verser quoi que ce soit.

## L'arnaque n°2$r$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($f$Un vrai propriétaire comprendra la démarche.

## L'arnaque n°2$f$ IN content_fr) > 0
  AND position($r$Un vrai propriétaire comprendra la démarche.

Si tu cherches à distance, [notre calendrier pour te loger côté France avant d'arriver](/blog/trouver-logement-avant-d-arriver-geneve) place ces vérifications au bon moment, avant de verser quoi que ce soit.

## L'arnaque n°2$r$ IN content_fr) = 0;

-- [20/22] arnaques-logement-frontalier-geneve-eviter (en) · LIENS · inbound link to A3 at the end of "Scam #1"
UPDATE blog_posts
SET content_en = replace(content_en, $f$A real landlord will understand the request.

## Scam #2$f$, $r$A real landlord will understand the request.

If you're searching from a distance, [our countdown to finding housing in France before you arrive](/en/blog/trouver-logement-avant-d-arriver-geneve) puts these checks at the right point, before you pay anything.

## Scam #2$r$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($f$A real landlord will understand the request.

## Scam #2$f$ IN content_en) > 0
  AND position($r$A real landlord will understand the request.

If you're searching from a distance, [our countdown to finding housing in France before you arrive](/en/blog/trouver-logement-avant-d-arriver-geneve) puts these checks at the right point, before you pay anything.

## Scam #2$r$ IN content_en) = 0;

-- [21/22] guide-ressources-frontalier-geneve (fr) · LIENS · lien entrant vers A3 dans « Le bon timing, et l'état des lieux » (section logement)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$**juin-août** offre plus de choix mais aux prix les plus hauts.$f$, $r$**juin-août** offre plus de choix mais aux prix les plus hauts. Si tu arrives d'ailleurs, [le calendrier pour te loger côté France avant d'arriver](/blog/trouver-logement-avant-d-arriver-geneve) cale chaque étape de J-60 au jour J.$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$**juin-août** offre plus de choix mais aux prix les plus hauts.$f$ IN content_fr) > 0
  AND position($r$**juin-août** offre plus de choix mais aux prix les plus hauts. Si tu arrives d'ailleurs, [le calendrier pour te loger côté France avant d'arriver](/blog/trouver-logement-avant-d-arriver-geneve) cale chaque étape de J-60 au jour J.$r$ IN content_fr) = 0;

-- [22/22] guide-ressources-frontalier-geneve (en) · LIENS · inbound link to A3 in "The right timing, and the inventory" (housing section)
UPDATE blog_posts
SET content_en = replace(content_en, $f$**June-August** offers more choice but at the highest prices.$f$, $r$**June-August** offers more choice but at the highest prices. If you're moving from elsewhere, [our countdown to finding housing in France before you arrive](/en/blog/trouver-logement-avant-d-arriver-geneve) sets out each step from D-60 to day 0.$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$**June-August** offers more choice but at the highest prices.$f$ IN content_en) > 0
  AND position($r$**June-August** offers more choice but at the highest prices. If you're moving from elsewhere, [our countdown to finding housing in France before you arrive](/en/blog/trouver-logement-avant-d-arriver-geneve) sets out each step from D-60 to day 0.$r$ IN content_en) = 0;

-- ── Aperçu des ancrages (ancien → nouveau, première ligne de chaque texte) ──
-- [1] banque-telephone-internet-frontalier-bons-plans/fr · ANCRES : « - [Arriver seul à Genève : le guide 30 jours](/blog/demenager-geneve-fr… » → « - [Se loger côté France avant d'arriver à Genève](/blog/trouver-logemen… »
-- [2] banque-telephone-internet-frontalier-bons-plans/en · ANCRES : « - [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-genev… » → « - [Moving to Geneva? Find housing in France first](/en/blog/trouver-log… »
-- [3] choc-culturel-franco-suisse-expatrie-geneve/fr · ANCRES : « - [Arriver seul à Genève : le guide 30 jours](/blog/demenager-geneve-fr… » → « - [Se loger côté France avant d'arriver à Genève](/blog/trouver-logemen… »
-- [4] choc-culturel-franco-suisse-expatrie-geneve/en · ANCRES : « - [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-genev… » → « - [Moving to Geneva? Find housing in France first](/en/blog/trouver-log… »
-- [5] dossier-location-frontalier-suisse-france/fr · ANCRES : « - [Arriver seul à Genève : le guide des 30 premiers jours](/blog/demena… » → « - [Se loger côté France avant d'arriver à Genève](/blog/trouver-logemen… »
-- [6] dossier-location-frontalier-suisse-france/en · ANCRES : « - [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-genev… » → « - [Moving to Geneva? Find housing in France first](/en/blog/trouver-log… »
-- [7] se-faire-reseau-geneve-arriver-seul/fr · ANCRES : « - [Arriver seul à Genève : le guide 30 jours](/blog/demenager-geneve-fr… » → « - [Se loger côté France avant d'arriver à Genève](/blog/trouver-logemen… »
-- [8] se-faire-reseau-geneve-arriver-seul/en · ANCRES : « - [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-genev… » → « - [Moving to Geneva? Find housing in France first](/en/blog/trouver-log… »
-- [9] vie-quotidienne-frontalier-courses-sport-sorties/fr · ANCRES : « - [Arriver seul à Genève : le guide 30 jours](/blog/demenager-geneve-fr… » → « - [Se loger côté France avant d'arriver à Genève](/blog/trouver-logemen… »
-- [10] vie-quotidienne-frontalier-courses-sport-sorties/en · ANCRES : « - [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-genev… » → « - [Moving to Geneva? Find housing in France first](/en/blog/trouver-log… »
-- [11] organisations-internationales-geneve-ou-habiter/fr · ANCRES : « - [Arriver seul à Genève : les 30 premiers jours](/blog/demenager-genev… » → « - [Se loger côté France avant d'arriver à Genève](/blog/trouver-logemen… »
-- [12] organisations-internationales-geneve-ou-habiter/en · ANCRES : « - [Arriving alone in Geneva: the first 30 days](/en/blog/demenager-gene… » → « - [Moving to Geneva? Find housing in France first](/en/blog/trouver-log… »
-- [13] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · ANCRES : « Une fois ta ville choisie, [la checklist déménagement de La Villa](/blo… » → « Une fois ta ville choisie, [le calendrier pour te loger côté France ava… »
-- [14] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · ANCRES : « Once you've picked your town, [La Villa's moving checklist](/en/blog/de… » → « Once you've picked your town, [our countdown to finding housing in Fran… »
-- [15] permis-g-frontalier-geneve/fr · LIENS : « Découvre [nos maisons](/nos-maisons).⏎⏎## En résumé » → « Découvre [nos maisons](/nos-maisons).⏎⏎Si tu n'as pas encore de logemen… »
-- [16] permis-g-frontalier-geneve/en · LIENS : « Discover [our houses](/en/nos-maisons).⏎⏎## In short » → « Discover [our houses](/en/nos-maisons).⏎⏎If you don't have a place yet … »
-- [17] s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france/fr · LIENS : « Si c'est la France voisine, tu envoies deux ou trois candidatures et tu… » → « Si c'est la France voisine, tu envoies deux ou trois candidatures et tu… »
-- [18] s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france/en · LIENS : « If it is the French side, you send two or three applications and ask fo… » → « If it is the French side, you send two or three applications and ask fo… »
-- [19] arnaques-logement-frontalier-geneve-eviter/fr · LIENS : « Un vrai propriétaire comprendra la démarche.⏎⏎## L'arnaque n°2 » → « Un vrai propriétaire comprendra la démarche.⏎⏎Si tu cherches à distance… »
-- [20] arnaques-logement-frontalier-geneve-eviter/en · LIENS : « A real landlord will understand the request.⏎⏎## Scam #2 » → « A real landlord will understand the request.⏎⏎If you're searching from … »
-- [21] guide-ressources-frontalier-geneve/fr · LIENS : « **juin-août** offre plus de choix mais aux prix les plus hauts. » → « **juin-août** offre plus de choix mais aux prix les plus hauts. Si tu a… »
-- [22] guide-ressources-frontalier-geneve/en · LIENS : « **June-August** offers more choice but at the highest prices. » → « **June-August** offers more choice but at the highest prices. If you're… »

COMMIT;

-- ── Vérification (lecture seule) : une ligne par article ; fr_ok / en_ok = true quand toutes les modifications de la langue sont en place, NULL = langue non touchée.
SELECT slug,
  CASE slug
    WHEN 'arnaques-logement-frontalier-geneve-eviter' THEN (position($f$Un vrai propriétaire comprendra la démarche.

## L'arnaque n°2$f$ IN content_fr) = 0)
    WHEN 'banque-telephone-internet-frontalier-bons-plans' THEN (position($f$- [Arriver seul à Genève : le guide 30 jours](/blog/demenager-geneve-frontalier-checklist)$f$ IN content_fr) = 0)
    WHEN 'choc-culturel-franco-suisse-expatrie-geneve' THEN (position($f$- [Arriver seul à Genève : le guide 30 jours](/blog/demenager-geneve-frontalier-checklist)$f$ IN content_fr) = 0)
    WHEN 'dossier-location-frontalier-suisse-france' THEN (position($f$- [Arriver seul à Genève : le guide des 30 premiers jours](/blog/demenager-geneve-frontalier-checklist)$f$ IN content_fr) = 0)
    WHEN 'guide-ressources-frontalier-geneve' THEN (position($r$**juin-août** offre plus de choix mais aux prix les plus hauts. Si tu arrives d'ailleurs, [le calendrier pour te loger côté France avant d'arriver](/blog/trouver-logement-avant-d-arriver-geneve) cale chaque étape de J-60 au jour J.$r$ IN content_fr) > 0)
    WHEN 'organisations-internationales-geneve-ou-habiter' THEN (position($f$- [Arriver seul à Genève : les 30 premiers jours](/blog/demenager-geneve-frontalier-checklist)
- [Déménager près de Genève : la checklist complète](/blog/demenager-geneve-frontalier-checklist)$f$ IN content_fr) = 0)
    WHEN 'ou-habiter-frontalier-suisse-villes-france-pas-cher' THEN (position($f$Une fois ta ville choisie, [la checklist déménagement de La Villa](/blog/demenager-geneve-frontalier-checklist) t'évite d'oublier une démarche.$f$ IN content_fr) = 0)
    WHEN 'permis-g-frontalier-geneve' THEN (position($f$Découvre [nos maisons](/nos-maisons).

## En résumé$f$ IN content_fr) = 0)
    WHEN 's-installer-a-geneve-expatrie-cote-suisse-ou-cote-france' THEN (position($r$Si c'est la France voisine, tu envoies deux ou trois candidatures et tu demandes une visite en visio. Si tu as deux mois devant toi, [le calendrier pour te loger côté France avant d'arriver](/blog/trouver-logement-avant-d-arriver-geneve) commence à J-60.$r$ IN content_fr) > 0)
    WHEN 'se-faire-reseau-geneve-arriver-seul' THEN (position($f$- [Arriver seul à Genève : le guide 30 jours](/blog/demenager-geneve-frontalier-checklist)$f$ IN content_fr) = 0)
    WHEN 'vie-quotidienne-frontalier-courses-sport-sorties' THEN (position($f$- [Arriver seul à Genève : le guide 30 jours](/blog/demenager-geneve-frontalier-checklist)$f$ IN content_fr) = 0)
  END AS fr_ok,
  CASE slug
    WHEN 'arnaques-logement-frontalier-geneve-eviter' THEN (position($f$A real landlord will understand the request.

## Scam #2$f$ IN content_en) = 0)
    WHEN 'banque-telephone-internet-frontalier-bons-plans' THEN (position($f$- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)$f$ IN content_en) = 0)
    WHEN 'choc-culturel-franco-suisse-expatrie-geneve' THEN (position($f$- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)$f$ IN content_en) = 0)
    WHEN 'dossier-location-frontalier-suisse-france' THEN (position($f$- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)$f$ IN content_en) = 0)
    WHEN 'guide-ressources-frontalier-geneve' THEN (position($r$**June-August** offers more choice but at the highest prices. If you're moving from elsewhere, [our countdown to finding housing in France before you arrive](/en/blog/trouver-logement-avant-d-arriver-geneve) sets out each step from D-60 to day 0.$r$ IN content_en) > 0)
    WHEN 'organisations-internationales-geneve-ou-habiter' THEN (position($f$- [Arriving alone in Geneva: the first 30 days](/en/blog/demenager-geneve-frontalier-checklist)
- [Moving near Geneva: the complete checklist](/en/blog/demenager-geneve-frontalier-checklist)$f$ IN content_en) = 0)
    WHEN 'ou-habiter-frontalier-suisse-villes-france-pas-cher' THEN (position($f$Once you've picked your town, [La Villa's moving checklist](/en/blog/demenager-geneve-frontalier-checklist) makes sure you don't miss a step.$f$ IN content_en) = 0)
    WHEN 'permis-g-frontalier-geneve' THEN (position($f$Discover [our houses](/en/nos-maisons).

## In short$f$ IN content_en) = 0)
    WHEN 's-installer-a-geneve-expatrie-cote-suisse-ou-cote-france' THEN (position($r$If it is the French side, you send two or three applications and ask for a video visit. If you have two months ahead of you, [our countdown to finding housing in France before you arrive](/en/blog/trouver-logement-avant-d-arriver-geneve) starts at D-60.$r$ IN content_en) > 0)
    WHEN 'se-faire-reseau-geneve-arriver-seul' THEN (position($f$- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)$f$ IN content_en) = 0)
    WHEN 'vie-quotidienne-frontalier-courses-sport-sorties' THEN (position($f$- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)$f$ IN content_en) = 0)
  END AS en_ok
FROM blog_posts
WHERE slug IN ('arnaques-logement-frontalier-geneve-eviter', 'banque-telephone-internet-frontalier-bons-plans', 'choc-culturel-franco-suisse-expatrie-geneve', 'dossier-location-frontalier-suisse-france', 'guide-ressources-frontalier-geneve', 'organisations-internationales-geneve-ou-habiter', 'ou-habiter-frontalier-suisse-villes-france-pas-cher', 'permis-g-frontalier-geneve', 's-installer-a-geneve-expatrie-cote-suisse-ou-cote-france', 'se-faire-reseau-geneve-arriver-seul', 'vie-quotidienne-frontalier-courses-sport-sorties')
ORDER BY slug;

-- ── Retour arrière (inverse exact, mêmes gardes miroir) : retirer les deux lignes /* et */ puis exécuter le bloc.
/*
BEGIN;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**June-August** offers more choice but at the highest prices. If you're moving from elsewhere, [our countdown to finding housing in France before you arrive](/en/blog/trouver-logement-avant-d-arriver-geneve) sets out each step from D-60 to day 0.$r$, $f$**June-August** offers more choice but at the highest prices.$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$**June-August** offers more choice but at the highest prices. If you're moving from elsewhere, [our countdown to finding housing in France before you arrive](/en/blog/trouver-logement-avant-d-arriver-geneve) sets out each step from D-60 to day 0.$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$**juin-août** offre plus de choix mais aux prix les plus hauts. Si tu arrives d'ailleurs, [le calendrier pour te loger côté France avant d'arriver](/blog/trouver-logement-avant-d-arriver-geneve) cale chaque étape de J-60 au jour J.$r$, $f$**juin-août** offre plus de choix mais aux prix les plus hauts.$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$**juin-août** offre plus de choix mais aux prix les plus hauts. Si tu arrives d'ailleurs, [le calendrier pour te loger côté France avant d'arriver](/blog/trouver-logement-avant-d-arriver-geneve) cale chaque étape de J-60 au jour J.$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$A real landlord will understand the request.

If you're searching from a distance, [our countdown to finding housing in France before you arrive](/en/blog/trouver-logement-avant-d-arriver-geneve) puts these checks at the right point, before you pay anything.

## Scam #2$r$, $f$A real landlord will understand the request.

## Scam #2$f$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($r$A real landlord will understand the request.

If you're searching from a distance, [our countdown to finding housing in France before you arrive](/en/blog/trouver-logement-avant-d-arriver-geneve) puts these checks at the right point, before you pay anything.

## Scam #2$r$ IN content_en) > 0
  AND position($f$A real landlord will understand the request.

## Scam #2$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Un vrai propriétaire comprendra la démarche.

Si tu cherches à distance, [notre calendrier pour te loger côté France avant d'arriver](/blog/trouver-logement-avant-d-arriver-geneve) place ces vérifications au bon moment, avant de verser quoi que ce soit.

## L'arnaque n°2$r$, $f$Un vrai propriétaire comprendra la démarche.

## L'arnaque n°2$f$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($r$Un vrai propriétaire comprendra la démarche.

Si tu cherches à distance, [notre calendrier pour te loger côté France avant d'arriver](/blog/trouver-logement-avant-d-arriver-geneve) place ces vérifications au bon moment, avant de verser quoi que ce soit.

## L'arnaque n°2$r$ IN content_fr) > 0
  AND position($f$Un vrai propriétaire comprendra la démarche.

## L'arnaque n°2$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$If it is the French side, you send two or three applications and ask for a video visit. If you have two months ahead of you, [our countdown to finding housing in France before you arrive](/en/blog/trouver-logement-avant-d-arriver-geneve) starts at D-60.$r$, $f$If it is the French side, you send two or three applications and ask for a video visit.$f$),
    updated_at = now()
WHERE slug = 's-installer-a-geneve-expatrie-cote-suisse-ou-cote-france'
  AND position($r$If it is the French side, you send two or three applications and ask for a video visit. If you have two months ahead of you, [our countdown to finding housing in France before you arrive](/en/blog/trouver-logement-avant-d-arriver-geneve) starts at D-60.$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Si c'est la France voisine, tu envoies deux ou trois candidatures et tu demandes une visite en visio. Si tu as deux mois devant toi, [le calendrier pour te loger côté France avant d'arriver](/blog/trouver-logement-avant-d-arriver-geneve) commence à J-60.$r$, $f$Si c'est la France voisine, tu envoies deux ou trois candidatures et tu demandes une visite en visio.$f$),
    updated_at = now()
WHERE slug = 's-installer-a-geneve-expatrie-cote-suisse-ou-cote-france'
  AND position($r$Si c'est la France voisine, tu envoies deux ou trois candidatures et tu demandes une visite en visio. Si tu as deux mois devant toi, [le calendrier pour te loger côté France avant d'arriver](/blog/trouver-logement-avant-d-arriver-geneve) commence à J-60.$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Discover [our houses](/en/nos-maisons).

If you don't have a place yet and can't view before you arrive, [our countdown from D-60 to day 0](/en/blog/trouver-logement-avant-d-arriver-geneve) tells you what to do and when.

## In short$r$, $f$Discover [our houses](/en/nos-maisons).

## In short$f$),
    updated_at = now()
WHERE slug = 'permis-g-frontalier-geneve'
  AND position($r$Discover [our houses](/en/nos-maisons).

If you don't have a place yet and can't view before you arrive, [our countdown from D-60 to day 0](/en/blog/trouver-logement-avant-d-arriver-geneve) tells you what to do and when.

## In short$r$ IN content_en) > 0
  AND position($f$Discover [our houses](/en/nos-maisons).

## In short$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Découvre [nos maisons](/nos-maisons).

Si tu n'as pas encore de logement et que tu ne peux pas visiter avant d'arriver, [notre calendrier de J-60 au jour J](/blog/trouver-logement-avant-d-arriver-geneve) te dit quoi faire et quand.

## En résumé$r$, $f$Découvre [nos maisons](/nos-maisons).

## En résumé$f$),
    updated_at = now()
WHERE slug = 'permis-g-frontalier-geneve'
  AND position($r$Découvre [nos maisons](/nos-maisons).

Si tu n'as pas encore de logement et que tu ne peux pas visiter avant d'arriver, [notre calendrier de J-60 au jour J](/blog/trouver-logement-avant-d-arriver-geneve) te dit quoi faire et quand.

## En résumé$r$ IN content_fr) > 0
  AND position($f$Découvre [nos maisons](/nos-maisons).

## En résumé$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Once you've picked your town, [our countdown to finding housing in France before you arrive](/en/blog/trouver-logement-avant-d-arriver-geneve) makes sure you don't miss a step.$r$, $f$Once you've picked your town, [La Villa's moving checklist](/en/blog/demenager-geneve-frontalier-checklist) makes sure you don't miss a step.$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$Once you've picked your town, [our countdown to finding housing in France before you arrive](/en/blog/trouver-logement-avant-d-arriver-geneve) makes sure you don't miss a step.$r$ IN content_en) > 0
  AND position($f$Once you've picked your town, [La Villa's moving checklist](/en/blog/demenager-geneve-frontalier-checklist) makes sure you don't miss a step.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Une fois ta ville choisie, [le calendrier pour te loger côté France avant d'arriver](/blog/trouver-logement-avant-d-arriver-geneve) t'évite d'oublier une étape.$r$, $f$Une fois ta ville choisie, [la checklist déménagement de La Villa](/blog/demenager-geneve-frontalier-checklist) t'évite d'oublier une démarche.$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$Une fois ta ville choisie, [le calendrier pour te loger côté France avant d'arriver](/blog/trouver-logement-avant-d-arriver-geneve) t'évite d'oublier une étape.$r$ IN content_fr) > 0
  AND position($f$Une fois ta ville choisie, [la checklist déménagement de La Villa](/blog/demenager-geneve-frontalier-checklist) t'évite d'oublier une démarche.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)$r$, $f$- [Arriving alone in Geneva: the first 30 days](/en/blog/demenager-geneve-frontalier-checklist)
- [Moving near Geneva: the complete checklist](/en/blog/demenager-geneve-frontalier-checklist)$f$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($r$- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)$r$ IN content_en) > 0
  AND position($f$- [Arriving alone in Geneva: the first 30 days](/en/blog/demenager-geneve-frontalier-checklist)
- [Moving near Geneva: the complete checklist](/en/blog/demenager-geneve-frontalier-checklist)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)$r$, $f$- [Arriver seul à Genève : les 30 premiers jours](/blog/demenager-geneve-frontalier-checklist)
- [Déménager près de Genève : la checklist complète](/blog/demenager-geneve-frontalier-checklist)$f$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($r$- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)$r$ IN content_fr) > 0
  AND position($f$- [Arriver seul à Genève : les 30 premiers jours](/blog/demenager-geneve-frontalier-checklist)
- [Déménager près de Genève : la checklist complète](/blog/demenager-geneve-frontalier-checklist)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)$r$, $f$- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)$f$),
    updated_at = now()
WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties'
  AND position($r$- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)$r$ IN content_en) > 0
  AND position($f$- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)$r$, $f$- [Arriver seul à Genève : le guide 30 jours](/blog/demenager-geneve-frontalier-checklist)$f$),
    updated_at = now()
WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties'
  AND position($r$- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)$r$ IN content_fr) > 0
  AND position($f$- [Arriver seul à Genève : le guide 30 jours](/blog/demenager-geneve-frontalier-checklist)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)$r$, $f$- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)$f$),
    updated_at = now()
WHERE slug = 'se-faire-reseau-geneve-arriver-seul'
  AND position($r$- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)$r$ IN content_en) > 0
  AND position($f$- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)$r$, $f$- [Arriver seul à Genève : le guide 30 jours](/blog/demenager-geneve-frontalier-checklist)$f$),
    updated_at = now()
WHERE slug = 'se-faire-reseau-geneve-arriver-seul'
  AND position($r$- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)$r$ IN content_fr) > 0
  AND position($f$- [Arriver seul à Genève : le guide 30 jours](/blog/demenager-geneve-frontalier-checklist)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)$r$, $f$- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)$f$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($r$- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)$r$ IN content_en) > 0
  AND position($f$- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)$r$, $f$- [Arriver seul à Genève : le guide des 30 premiers jours](/blog/demenager-geneve-frontalier-checklist)$f$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($r$- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)$r$ IN content_fr) > 0
  AND position($f$- [Arriver seul à Genève : le guide des 30 premiers jours](/blog/demenager-geneve-frontalier-checklist)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)$r$, $f$- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)$f$),
    updated_at = now()
WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve'
  AND position($r$- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)$r$ IN content_en) > 0
  AND position($f$- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)$r$, $f$- [Arriver seul à Genève : le guide 30 jours](/blog/demenager-geneve-frontalier-checklist)$f$),
    updated_at = now()
WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve'
  AND position($r$- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)$r$ IN content_fr) > 0
  AND position($f$- [Arriver seul à Genève : le guide 30 jours](/blog/demenager-geneve-frontalier-checklist)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)$r$, $f$- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)$f$),
    updated_at = now()
WHERE slug = 'banque-telephone-internet-frontalier-bons-plans'
  AND position($r$- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)$r$ IN content_en) > 0
  AND position($f$- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)$r$, $f$- [Arriver seul à Genève : le guide 30 jours](/blog/demenager-geneve-frontalier-checklist)$f$),
    updated_at = now()
WHERE slug = 'banque-telephone-internet-frontalier-bons-plans'
  AND position($r$- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)$r$ IN content_fr) > 0
  AND position($f$- [Arriver seul à Genève : le guide 30 jours](/blog/demenager-geneve-frontalier-checklist)$f$ IN content_fr) = 0;

COMMIT;
*/
