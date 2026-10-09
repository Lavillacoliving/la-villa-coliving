-- ============================================================================
-- Lot L2 « Emplacement et transport » (brief « Ingénierie des créneaux » v3.1 du 09/10/2026, règles D1 / D6 / D7 de Jérôme) : faits d'emplacement des articles en base
-- Généré le 2026-10-09T16:31:26.609Z par scripts/build-slots-sql.mjs depuis scripts/l2-location.edits.mjs
--   · textes insérés = source unique src/data/stats.ts (TRANSIT, STATS_DISPLAY, GENEVA_COMMUTE_FORMULA) + entityFacts.ts (houseCommuteLine, prix d'appel) (ENTITY_FACTS_VERSION 2026-10-09, TRANSIT.measuredOn 2026-10-08)
--   · ancres vérifiées sur le contenu vivant de blog_posts (REST anon, lecture seule) le 2026-10-09T16:31:26.599Z : exactement 1 occurrence de chaque ancien texte, nouveau texte absent
-- À appliquer par Jérôme dans le SQL Editor, indépendant du code (aucun composant à déployer) ; relancer le prérendu ensuite.
-- Idempotent : chaque UPDATE est gardé par position(ancien) > 0 [AND position(nouveau) = 0 quand le nouveau texte n'est pas un fragment de l'ancien] — relancer le fichier est sans effet.
-- Fichier UTF-8 : il contient des espaces insécables (U+00A0, « 1 370 ») et des caractères typographiques (« — », « – », « · », « → », « ⭐ », émojis) — ne pas le faire transiter par un éditeur qui normalise les espaces.
-- 175 modifications · 22 articles · état en base à la génération (updated_at · longueur fr / en) :
--   allocations-familiales-frontalier-geneve-2026 · 2026-10-09T14:33:23.72146+00:00 · 11399 / 9797
--   budget-colocation-geneve-guide-complet · 2026-10-09T14:46:13.99062+00:00 · 17918 / 13884
--   choc-culturel-franco-suisse-expatrie-geneve · 2026-10-09T14:33:23.72146+00:00 · 10704 / 9905
--   coliving-annemasse-geneve-frontaliers-avantages · 2026-10-09T14:33:23.72146+00:00 · 12521 / 11653
--   coliving-geneve-frontaliers-guide-complet · 2026-09-03T16:09:18.480833+00:00 · 9547 / 8565
--   coliving-transfrontalier-geneve-annemasse-nouvelle-vie · 2026-10-09T14:33:23.72146+00:00 · 3768 / 3614
--   cout-de-la-vie-suisse-france-frontalier-2026 · 2026-10-09T14:33:23.72146+00:00 · 11195 / 9898
--   cout-transport-frontalier-geneve-2026 · 2026-10-08T14:21:15.770218+00:00 · 9062 / 8432
--   ecole-internationale-geneve-frontalier-ou-habiter · 2026-10-09T14:33:23.72146+00:00 · 11735 / 9915
--   espaces-verts-coliving-lodge-annemasse · 2026-09-04T14:08:51.927825+00:00 · 3463 / 3180
--   guide-ressources-frontalier-geneve · 2026-10-09T14:33:23.72146+00:00 · 44127 / 40276
--   living-in-france-working-in-geneva · 2026-10-09T14:33:23.72146+00:00 · 15116 / 13319
--   lodge-annemasse-coliving-premium-portes-geneve · 2026-09-30T07:43:18.866905+00:00 · 15078 / 13388
--   organisations-internationales-geneve-ou-habiter · 2026-10-09T14:33:23.72146+00:00 · 8025 / 7361
--   ou-habiter-frontalier-suisse-villes-france-pas-cher · 2026-10-09T14:33:23.72146+00:00 · 8630 / 8095
--   permis-g-frontalier-geneve · 2026-10-09T14:33:23.72146+00:00 · 5655 / 5315
--   quartiers-annemasse-ou-vivre-selon-profil · 2026-10-09T14:31:15.368716+00:00 · 9545 / 8253
--   quitter-son-logement-guide-pratique · 2026-10-09T14:33:23.72146+00:00 · 11449 / 10920
--   salaire-suisse-net-frontalier-2026 · 2026-10-09T14:33:23.72146+00:00 · 13422 / 10665
--   temps-trajet-annemasse-geneve-par-quartier · 2026-09-04T14:08:51.927825+00:00 · 8717 / 8087
--   transport-annemasse-geneve-leman-express · 2026-09-04T14:08:51.927825+00:00 · 7951 / 6884
--   trouver-colocation-geneve-frontalier · 2026-10-09T14:33:23.72146+00:00 · 5589 / 5198
-- ============================================================================

BEGIN;

-- [1/175] quartiers-annemasse-ou-vivre-selon-profil (fr) · D6 · intro : « communes mitoyennes » (les communes entre elles, sens différent de D6) → « communes voisines », pour que le mot « mitoyenne » disparaisse du site
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$une **agglomération de communes mitoyennes**, collée à la frontière genevoise :$f$, $r$une **agglomération de communes voisines**, collée à la frontière genevoise :$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$une **agglomération de communes mitoyennes**, collée à la frontière genevoise :$f$ IN content_fr) > 0
  AND position($r$une **agglomération de communes voisines**, collée à la frontière genevoise :$r$ IN content_fr) = 0;

-- [2/175] quartiers-annemasse-ou-vivre-selon-profil (en) · D6 · intro: “cluster of adjoining towns” (towns adjoining each other) → “neighbouring towns”, so that “adjoin” disappears from the site
UPDATE blog_posts
SET content_en = replace(content_en, $f$a **cluster of adjoining towns**, pressed against the Geneva border:$f$, $r$a **cluster of neighbouring towns**, pressed against the Geneva border:$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$a **cluster of adjoining towns**, pressed against the Geneva border:$f$ IN content_en) > 0
  AND position($r$a **cluster of neighbouring towns**, pressed against the Geneva border:$r$ IN content_en) = 0;

-- [3/175] quartiers-annemasse-ou-vivre-selon-profil (fr) · D6 · L11 : « frontière mitoyenne au nord-est » (Ville-la-Grand) → le Foron, rivière-frontière (D6) ; direction non sourcée retirée
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$- **Ville-la-Grand** — résidentiel et familial, frontière mitoyenne au nord-est.$f$, $r$- **Ville-la-Grand** — résidentiel et familial, bordé par le Foron, la rivière qui marque la frontière suisse.$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$- **Ville-la-Grand** — résidentiel et familial, frontière mitoyenne au nord-est.$f$ IN content_fr) > 0
  AND position($r$- **Ville-la-Grand** — résidentiel et familial, bordé par le Foron, la rivière qui marque la frontière suisse.$r$ IN content_fr) = 0;

-- [4/175] quartiers-annemasse-ou-vivre-selon-profil (en) · D6 · L10: “border-adjacent to the northeast” (Ville-la-Grand) → the Foron, the border river (D6); unsourced direction removed
UPDATE blog_posts
SET content_en = replace(content_en, $f$- **Ville-la-Grand** — residential and family-friendly, border-adjacent to the northeast.$f$, $r$- **Ville-la-Grand** — residential and family-friendly, bordered by the Foron, the river that marks the Swiss border.$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$- **Ville-la-Grand** — residential and family-friendly, border-adjacent to the northeast.$f$ IN content_en) > 0
  AND position($r$- **Ville-la-Grand** — residential and family-friendly, bordered by the Foron, the river that marks the Swiss border.$r$ IN content_en) = 0;

-- [5/175] quartiers-annemasse-ou-vivre-selon-profil (fr) · D7 · L14 : « terminus français du Léman Express, Genève en moins de 15 min » → temps de train nommés (Eaux-Vives 7, Cornavin 23), plus de « terminus »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$la **gare d'Annemasse** (terminus français du Léman Express, Genève en moins de 15 min)$f$, $r$la **gare d'Annemasse** (Léman Express : Genève-Eaux-Vives en 7 min de train, Cornavin en 23 min)$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$la **gare d'Annemasse** (terminus français du Léman Express, Genève en moins de 15 min)$f$ IN content_fr) > 0
  AND position($r$la **gare d'Annemasse** (Léman Express : Genève-Eaux-Vives en 7 min de train, Cornavin en 23 min)$r$ IN content_fr) = 0;

-- [6/175] quartiers-annemasse-ou-vivre-selon-profil (en) · D7 · L13: “French terminus of the Léman Express, Geneva in under 15 min” → named train times (Eaux-Vives 7, Cornavin 23), no “terminus”
UPDATE blog_posts
SET content_en = replace(content_en, $f$the **Annemasse station** (French terminus of the Léman Express, Geneva in under 15 min)$f$, $r$the **Annemasse station** (Léman Express: Geneva Eaux-Vives in 7 min by train, Cornavin in 23 min)$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$the **Annemasse station** (French terminus of the Léman Express, Geneva in under 15 min)$f$ IN content_en) > 0
  AND position($r$the **Annemasse station** (Léman Express: Geneva Eaux-Vives in 7 min by train, Cornavin in 23 min)$r$ IN content_en) = 0;

-- [7/175] quartiers-annemasse-ou-vivre-selon-profil (fr) · D1 · L18 : « Eaux-Vives en ~15 min, Cornavin en ~22 min, 2 à 4 trains par heure » → 7 / 23 min, cadence de pointe TRANSIT
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Le Léman Express te dépose à Genève-Eaux-Vives en ~15 min, à Cornavin en ~22 min, avec une fréquence de 2 à 4 trains par heure selon le moment.$f$, $r$Le Léman Express te dépose à Genève-Eaux-Vives en 7 min, à Cornavin en 23 min, avec un train toutes les 10 minutes en heure de pointe.$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$Le Léman Express te dépose à Genève-Eaux-Vives en ~15 min, à Cornavin en ~22 min, avec une fréquence de 2 à 4 trains par heure selon le moment.$f$ IN content_fr) > 0
  AND position($r$Le Léman Express te dépose à Genève-Eaux-Vives en 7 min, à Cornavin en 23 min, avec un train toutes les 10 minutes en heure de pointe.$r$ IN content_fr) = 0;

-- [8/175] quartiers-annemasse-ou-vivre-selon-profil (en) · D1 · L17: “Eaux-Vives in ~15 min, Cornavin in ~22 min, 2 to 4 trains per hour” → 7 / 23 min, TRANSIT peak headway
UPDATE blog_posts
SET content_en = replace(content_en, $f$The Léman Express drops you at Geneva-Eaux-Vives in ~15 min, Cornavin in ~22 min, with 2 to 4 trains per hour depending on the time.$f$, $r$The Léman Express drops you at Geneva Eaux-Vives in 7 min, Cornavin in 23 min, with a train every 10 minutes at peak times.$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$The Léman Express drops you at Geneva-Eaux-Vives in ~15 min, Cornavin in ~22 min, with 2 to 4 trains per hour depending on the time.$f$ IN content_en) > 0
  AND position($r$The Léman Express drops you at Geneva Eaux-Vives in 7 min, Cornavin in 23 min, with a train every 10 minutes at peak times.$r$ IN content_en) = 0;

-- [9/175] quartiers-annemasse-ou-vivre-selon-profil (fr) · D7 · L28 : « Genève se rejoint à vélo en quelques minutes » (vélo non mesuré) → Rive par la Voie Verte, 23 min depuis Le Loft ; « terminus côté français à Moillesulaz » (faux, et tout « terminus » est périssable) → arrêts nommés de la source (Croix-d'Ambilly à Ambilly, Parc Montessuit à Annemasse) ; Loft « 5 minutes à pied du Tram 17 — Genève centre en ~20 min » → 8 min, arrêt Croix-d'Ambilly, Rive en 23 min de tram, 32 min porte-à-porte
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Depuis là, Genève se rejoint à vélo en quelques minutes par les pistes cyclables transfrontalières, ou en **Tram 17** (terminus côté français à Moillesulaz). Notre [Loft, à Ambilly](/leloft), est à 5 minutes à pied du Tram 17 — Genève centre en ~20 min sans changement, et sa piscine intérieure$f$, $r$Depuis là, le centre de Genève (Rive) se rejoint à vélo par la Voie Verte (23 min depuis Le Loft), ou en **Tram 17** (arrêts Croix-d'Ambilly à Ambilly, Parc Montessuit à Annemasse). Notre [Loft, à Ambilly](/leloft), est à 8 min à pied du Tram 17 (arrêt Croix-d'Ambilly) — Rive, au centre de Genève, en 23 min de tram sans changement, 32 min porte-à-porte, et sa piscine intérieure$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$Depuis là, Genève se rejoint à vélo en quelques minutes par les pistes cyclables transfrontalières, ou en **Tram 17** (terminus côté français à Moillesulaz). Notre [Loft, à Ambilly](/leloft), est à 5 minutes à pied du Tram 17 — Genève centre en ~20 min sans changement, et sa piscine intérieure$f$ IN content_fr) > 0
  AND position($r$Depuis là, le centre de Genève (Rive) se rejoint à vélo par la Voie Verte (23 min depuis Le Loft), ou en **Tram 17** (arrêts Croix-d'Ambilly à Ambilly, Parc Montessuit à Annemasse). Notre [Loft, à Ambilly](/leloft), est à 8 min à pied du Tram 17 (arrêt Croix-d'Ambilly) — Rive, au centre de Genève, en 23 min de tram sans changement, 32 min porte-à-porte, et sa piscine intérieure$r$ IN content_fr) = 0;

-- [10/175] quartiers-annemasse-ou-vivre-selon-profil (en) · D7 · L27: “Geneva is a few minutes by bike” (unmeasured bike time) → Rive on the Voie Verte, 23 min from Le Loft; “French terminus at Moillesulaz” (wrong, and any “terminus” is perishable) → named stops from the source (Croix-d'Ambilly in Ambilly, Parc Montessuit in Annemasse); Loft “5 minutes' walk from Tram 17 — central Geneva in ~20 min” → 8 min, Croix-d'Ambilly stop, Rive in 23 min by tram, 32 min door to door
UPDATE blog_posts
SET content_en = replace(content_en, $f$From there, Geneva is a few minutes by bike via the cross-border cycle paths, or by **Tram 17** (French terminus at Moillesulaz). Our [Loft, in Ambilly](/en/leloft), is 5 minutes' walk from Tram 17 — central Geneva in ~20 min with no change, plus an indoor pool$f$, $r$From there, central Geneva (Rive) is reached by bike on the Voie Verte (23 min from Le Loft), or by **Tram 17** (Croix-d'Ambilly stop in Ambilly, Parc Montessuit stop in Annemasse). Our [Loft, in Ambilly](/en/leloft), is an 8-minute walk from Tram 17 (Croix-d'Ambilly stop) — Rive, in central Geneva, in 23 min by tram with no change, 32 min door to door, plus an indoor pool$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$From there, Geneva is a few minutes by bike via the cross-border cycle paths, or by **Tram 17** (French terminus at Moillesulaz). Our [Loft, in Ambilly](/en/leloft), is 5 minutes' walk from Tram 17 — central Geneva in ~20 min with no change, plus an indoor pool$f$ IN content_en) > 0
  AND position($r$From there, central Geneva (Rive) is reached by bike on the Voie Verte (23 min from Le Loft), or by **Tram 17** (Croix-d'Ambilly stop in Ambilly, Parc Montessuit stop in Annemasse). Our [Loft, in Ambilly](/en/leloft), is an 8-minute walk from Tram 17 (Croix-d'Ambilly stop) — Rive, in central Geneva, in 23 min by tram with no change, 32 min door to door, plus an indoor pool$r$ IN content_en) = 0;

-- [11/175] quartiers-annemasse-ou-vivre-selon-profil (fr) · D6 · L36 : « 10-15 min de la gare et de la frontière » (mode non précisé, « 15 ») + « frontière mitoyenne » (La Villa) → gare à 14 min à pied, Eaux-Vives en 22 min porte-à-porte, le Foron longe la rue
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$tout en restant à 10-15 min de la gare et de la frontière. Notre maison [La Villa, à Ville-la-Grand](/lavilla), est dans ce registre résidentiel, frontière mitoyenne.$f$, $r$tout en restant proche de la gare et de la frontière. Notre maison [La Villa, à Ville-la-Grand](/lavilla), est dans ce registre résidentiel : gare d'Annemasse à 14 min à pied, Genève-Eaux-Vives en 22 min porte-à-porte, et le Foron, la rivière-frontière, longe la rue.$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$tout en restant à 10-15 min de la gare et de la frontière. Notre maison [La Villa, à Ville-la-Grand](/lavilla), est dans ce registre résidentiel, frontière mitoyenne.$f$ IN content_fr) > 0
  AND position($r$tout en restant proche de la gare et de la frontière. Notre maison [La Villa, à Ville-la-Grand](/lavilla), est dans ce registre résidentiel : gare d'Annemasse à 14 min à pied, Genève-Eaux-Vives en 22 min porte-à-porte, et le Foron, la rivière-frontière, longe la rue.$r$ IN content_fr) = 0;

-- [12/175] quartiers-annemasse-ou-vivre-selon-profil (en) · D6 · L35: “10-15 min from the station and the border” (no mode, “15”) + “border-adjacent” (La Villa) → station a 14-minute walk, Eaux-Vives 22 minutes door to door, the Foron runs along the street
UPDATE blog_posts
SET content_en = replace(content_en, $f$while staying 10-15 min from the station and the border. Our [Villa, in Ville-la-Grand](/en/lavilla), fits this residential register, border-adjacent.$f$, $r$while staying close to the station and the border. Our [Villa, in Ville-la-Grand](/en/lavilla), fits this residential register: Annemasse station is a 14-minute walk, Geneva Eaux-Vives 22 minutes door to door, and the Foron, the border river, runs along the street.$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$while staying 10-15 min from the station and the border. Our [Villa, in Ville-la-Grand](/en/lavilla), fits this residential register, border-adjacent.$f$ IN content_en) > 0
  AND position($r$while staying close to the station and the border. Our [Villa, in Ville-la-Grand](/en/lavilla), fits this residential register: Annemasse station is a 14-minute walk, Geneva Eaux-Vives 22 minutes door to door, and the Foron, the border river, runs along the street.$r$ IN content_en) = 0;

-- [13/175] quartiers-annemasse-ou-vivre-selon-profil (fr) · fix · L64 : « autoroute A40 » (nuisance sonore, pas un trajet) → « autoroute » : le libellé « A40 » disparaît du site
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Évite les abords immédiats de l'**autoroute A40** et des grands axes$f$, $r$Évite les abords immédiats de l'**autoroute** et des grands axes$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$Évite les abords immédiats de l'**autoroute A40** et des grands axes$f$ IN content_fr) > 0
  AND position($r$Évite les abords immédiats de l'**autoroute** et des grands axes$r$ IN content_fr) = 0;

-- [14/175] quartiers-annemasse-ou-vivre-selon-profil (en) · fix · L64: “A40 motorway” (noise, not a commute) → “motorway”: the “A40” label disappears from the site
UPDATE blog_posts
SET content_en = replace(content_en, $f$Avoid the immediate surroundings of the **A40 motorway** and major roads$f$, $r$Avoid the immediate surroundings of the **motorway** and major roads$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$Avoid the immediate surroundings of the **A40 motorway** and major roads$f$ IN content_en) > 0
  AND position($r$Avoid the immediate surroundings of the **motorway** and major roads$r$ IN content_en) = 0;

-- [15/175] quartiers-annemasse-ou-vivre-selon-profil (fr) · D1 · L99 : « (Léman Express et Tram 17 à pied) » ×3 (faux pour La Villa et le Lodge) → ligne de trajet courte de chaque maison (houseCommuteLine)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[Le Lodge à Annemasse](/lelodge) (Léman Express et Tram 17 à pied), [Le Loft à Ambilly](/leloft) (Léman Express et Tram 17 à pied), [La Villa à Ville-la-Grand](/lavilla) (Léman Express et Tram 17 à pied)$f$, $r$[Le Lodge à Annemasse](/lelodge) (gare d'Annemasse à 10 min à pied · Genève-Eaux-Vives en 18 min porte-à-porte), [Le Loft à Ambilly](/leloft) (tram 17 à 8 min à pied, gare d'Annemasse à 18 min · Genève-Eaux-Vives en 24 min porte-à-porte), [La Villa à Ville-la-Grand](/lavilla) (gare d'Annemasse à 14 min à pied · Genève-Eaux-Vives en 22 min porte-à-porte)$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$[Le Lodge à Annemasse](/lelodge) (Léman Express et Tram 17 à pied), [Le Loft à Ambilly](/leloft) (Léman Express et Tram 17 à pied), [La Villa à Ville-la-Grand](/lavilla) (Léman Express et Tram 17 à pied)$f$ IN content_fr) > 0
  AND position($r$[Le Lodge à Annemasse](/lelodge) (gare d'Annemasse à 10 min à pied · Genève-Eaux-Vives en 18 min porte-à-porte), [Le Loft à Ambilly](/leloft) (tram 17 à 8 min à pied, gare d'Annemasse à 18 min · Genève-Eaux-Vives en 24 min porte-à-porte), [La Villa à Ville-la-Grand](/lavilla) (gare d'Annemasse à 14 min à pied · Genève-Eaux-Vives en 22 min porte-à-porte)$r$ IN content_fr) = 0;

-- [16/175] quartiers-annemasse-ou-vivre-selon-profil (en) · D1 · L92: “(Léman Express and Tram 17 on foot)” ×3 (wrong for La Villa and Le Lodge) → each house's short commute line (houseCommuteLine)
UPDATE blog_posts
SET content_en = replace(content_en, $f$[Le Lodge in Annemasse](/en/lelodge) (Léman Express and Tram 17 on foot), [Le Loft in Ambilly](/en/leloft) (Léman Express and Tram 17 on foot), [La Villa in Ville-la-Grand](/en/lavilla) (Léman Express and Tram 17 on foot)$f$, $r$[Le Lodge in Annemasse](/en/lelodge) (Annemasse station 10 min on foot · Geneva Eaux-Vives in 18 min door-to-door), [Le Loft in Ambilly](/en/leloft) (tram 17 stop 8 min on foot, Annemasse station 18 min · Geneva Eaux-Vives in 24 min door-to-door), [La Villa in Ville-la-Grand](/en/lavilla) (Annemasse station 14 min on foot · Geneva Eaux-Vives in 22 min door-to-door)$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$[Le Lodge in Annemasse](/en/lelodge) (Léman Express and Tram 17 on foot), [Le Loft in Ambilly](/en/leloft) (Léman Express and Tram 17 on foot), [La Villa in Ville-la-Grand](/en/lavilla) (Léman Express and Tram 17 on foot)$f$ IN content_en) > 0
  AND position($r$[Le Lodge in Annemasse](/en/lelodge) (Annemasse station 10 min on foot · Geneva Eaux-Vives in 18 min door-to-door), [Le Loft in Ambilly](/en/leloft) (tram 17 stop 8 min on foot, Annemasse station 18 min · Geneva Eaux-Vives in 24 min door-to-door), [La Villa in Ville-la-Grand](/en/lavilla) (Annemasse station 14 min on foot · Geneva Eaux-Vives in 22 min door-to-door)$r$ IN content_en) = 0;

-- [17/175] temps-trajet-annemasse-geneve-par-quartier (fr) · D6 · L16 : « Ville-la-Grand est la commune la plus proche de la frontière suisse » (affirmation contredite ailleurs) → le Foron, rivière-frontière, borde la commune
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Ville-la-Grand est la commune la plus proche de la frontière suisse.$f$, $r$Ville-la-Grand est bordée par le Foron, la rivière qui marque la frontière suisse.$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$Ville-la-Grand est la commune la plus proche de la frontière suisse.$f$ IN content_fr) > 0
  AND position($r$Ville-la-Grand est bordée par le Foron, la rivière qui marque la frontière suisse.$r$ IN content_fr) = 0;

-- [18/175] temps-trajet-annemasse-geneve-par-quartier (en) · D6 · L15: “Ville-la-Grand is the closest municipality to the Swiss border” (claim contradicted elsewhere) → bordered by the Foron, the border river
UPDATE blog_posts
SET content_en = replace(content_en, $f$Ville-la-Grand is the closest municipality to the Swiss border.$f$, $r$Ville-la-Grand is bordered by the Foron, the river that marks the Swiss border.$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$Ville-la-Grand is the closest municipality to the Swiss border.$f$ IN content_en) > 0
  AND position($r$Ville-la-Grand is bordered by the Foron, the river that marks the Swiss border.$r$ IN content_en) = 0;

-- [19/175] temps-trajet-annemasse-geneve-par-quartier (fr) · D1 · L20 : « gare à 10 min à pied ou 3 min en vélo de Ville-la-Grand : 20 minutes jusqu'à Cornavin, trains toutes les 15 minutes » → 14 min à pied de La Villa, Eaux-Vives 7 / Cornavin 23, cadence 10
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$En **Léman Express** depuis Annemasse (gare à 10 min à pied ou 3 min en vélo de Ville-la-Grand) : 20 minutes jusqu'à Cornavin, trains toutes les 15 minutes aux heures de pointe.$f$, $r$En **Léman Express** depuis Annemasse (gare à 14 min à pied de La Villa, à Ville-la-Grand) : 7 minutes jusqu'à Genève-Eaux-Vives, 23 minutes jusqu'à Cornavin, un train toutes les 10 minutes aux heures de pointe.$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$En **Léman Express** depuis Annemasse (gare à 10 min à pied ou 3 min en vélo de Ville-la-Grand) : 20 minutes jusqu'à Cornavin, trains toutes les 15 minutes aux heures de pointe.$f$ IN content_fr) > 0
  AND position($r$En **Léman Express** depuis Annemasse (gare à 14 min à pied de La Villa, à Ville-la-Grand) : 7 minutes jusqu'à Genève-Eaux-Vives, 23 minutes jusqu'à Cornavin, un train toutes les 10 minutes aux heures de pointe.$r$ IN content_fr) = 0;

-- [20/175] temps-trajet-annemasse-geneve-par-quartier (en) · D1 · L19: “station 10 min walk or 3 min bike from Ville-la-Grand: 20 minutes to Cornavin, trains every 15 minutes” → 14-min walk from La Villa, Eaux-Vives 7 / Cornavin 23, 10-min headway
UPDATE blog_posts
SET content_en = replace(content_en, $f$By **Léman Express** from Annemasse (station 10 min walk or 3 min bike from Ville-la-Grand): 20 minutes to Cornavin, trains every 15 minutes during rush hour.$f$, $r$By **Léman Express** from Annemasse (station a 14-min walk from La Villa, in Ville-la-Grand): 7 minutes to Geneva Eaux-Vives, 23 minutes to Cornavin, a train every 10 minutes during rush hour.$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$By **Léman Express** from Annemasse (station 10 min walk or 3 min bike from Ville-la-Grand): 20 minutes to Cornavin, trains every 15 minutes during rush hour.$f$ IN content_en) > 0
  AND position($r$By **Léman Express** from Annemasse (station a 14-min walk from La Villa, in Ville-la-Grand): 7 minutes to Geneva Eaux-Vives, 23 minutes to Cornavin, a train every 10 minutes during rush hour.$r$ IN content_en) = 0;

-- [21/175] temps-trajet-annemasse-geneve-par-quartier (fr) · D7 · L22 : « En bus (ligne D ou tpg 61) » → numéros de ligne retirés (D7) ; les temps de voiture de la phrase (conseil de marché) sont conservés
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$En **bus** (ligne D ou tpg 61) : 35-50 minutes selon la circulation.$f$, $r$En **bus** : 35-50 minutes selon la circulation.$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$En **bus** (ligne D ou tpg 61) : 35-50 minutes selon la circulation.$f$ IN content_fr) > 0
  AND position($r$En **bus** : 35-50 minutes selon la circulation.$r$ IN content_fr) = 0;

-- [22/175] temps-trajet-annemasse-geneve-par-quartier (en) · D7 · L21: “By bus (line D or tpg 61)” → line numbers removed (D7); the car times of the sentence (market advice) are kept
UPDATE blog_posts
SET content_en = replace(content_en, $f$By **bus** (line D or tpg 61): 35-50 minutes depending on traffic.$f$, $r$By **bus**: 35-50 minutes depending on traffic.$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$By **bus** (line D or tpg 61): 35-50 minutes depending on traffic.$f$ IN content_en) > 0
  AND position($r$By **bus**: 35-50 minutes depending on traffic.$r$ IN content_en) = 0;

-- [23/175] temps-trajet-annemasse-geneve-par-quartier (fr) · D1 · L24 : « Léman Express, sans hésitation. 20 minutes, prévisible » (destination absente) → Eaux-Vives 7 / Cornavin 23
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Léman Express, sans hésitation. 20 minutes, prévisible, 80 CHF/mois d'abonnement.$f$, $r$Léman Express, sans hésitation. Genève-Eaux-Vives en 7 minutes, Cornavin en 23, prévisible, 80 CHF/mois d'abonnement.$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$Léman Express, sans hésitation. 20 minutes, prévisible, 80 CHF/mois d'abonnement.$f$ IN content_fr) > 0
  AND position($r$Léman Express, sans hésitation. Genève-Eaux-Vives en 7 minutes, Cornavin en 23, prévisible, 80 CHF/mois d'abonnement.$r$ IN content_fr) = 0;

-- [24/175] temps-trajet-annemasse-geneve-par-quartier (en) · D1 · L23: “Léman Express, without hesitation. 20 minutes, predictable” (no destination) → Eaux-Vives 7 / Cornavin 23
UPDATE blog_posts
SET content_en = replace(content_en, $f$Léman Express, without hesitation. 20 minutes, predictable, 80 CHF/month subscription.$f$, $r$Léman Express, without hesitation. Geneva Eaux-Vives in 7 minutes, Cornavin in 23, predictable, 80 CHF/month subscription.$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$Léman Express, without hesitation. 20 minutes, predictable, 80 CHF/month subscription.$f$ IN content_en) > 0
  AND position($r$Léman Express, without hesitation. Geneva Eaux-Vives in 7 minutes, Cornavin in 23, predictable, 80 CHF/month subscription.$r$ IN content_en) = 0;

-- [25/175] temps-trajet-annemasse-geneve-par-quartier (fr) · D1 · L36 (CERN) : « Léman Express jusqu'à Cornavin (20 min) » → 23 min
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Léman Express jusqu'à Cornavin (20 min) + tram 18$f$, $r$Léman Express jusqu'à Cornavin (23 min) + tram 18$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$Léman Express jusqu'à Cornavin (20 min) + tram 18$f$ IN content_fr) > 0
  AND position($r$Léman Express jusqu'à Cornavin (23 min) + tram 18$r$ IN content_fr) = 0;

-- [26/175] temps-trajet-annemasse-geneve-par-quartier (en) · D1 · L35 (CERN): “Léman Express to Cornavin (20 min)” → 23 min
UPDATE blog_posts
SET content_en = replace(content_en, $f$Léman Express to Cornavin (20 min) + tram 18$f$, $r$Léman Express to Cornavin (23 min) + tram 18$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$Léman Express to Cornavin (20 min) + tram 18$f$ IN content_en) > 0
  AND position($r$Léman Express to Cornavin (23 min) + tram 18$r$ IN content_en) = 0;

-- [27/175] temps-trajet-annemasse-geneve-par-quartier (fr) · D1 · L50 : « La gare d'Annemasse est à 5-8 minutes en vélo depuis Ambilly » (vélo non sourcé) → 18 min à pied du Loft, arrêt de bus Olympe de Gouges à 6 min, tram 17 à 8 min
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$La gare d'Annemasse est à 5-8 minutes en vélo depuis Ambilly.$f$, $r$La gare d'Annemasse est à 18 minutes à pied du Loft (arrêt de bus Olympe de Gouges à 6 min), le tram 17 à 8 minutes.$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$La gare d'Annemasse est à 5-8 minutes en vélo depuis Ambilly.$f$ IN content_fr) > 0
  AND position($r$La gare d'Annemasse est à 18 minutes à pied du Loft (arrêt de bus Olympe de Gouges à 6 min), le tram 17 à 8 minutes.$r$ IN content_fr) = 0;

-- [28/175] temps-trajet-annemasse-geneve-par-quartier (en) · D1 · L49: “Annemasse station is 5-8 minutes by bike from Ambilly” (unsourced bike time) → 18-minute walk from Le Loft, Olympe de Gouges bus stop 6 min, tram 17 8 min
UPDATE blog_posts
SET content_en = replace(content_en, $f$Annemasse station is 5-8 minutes by bike from Ambilly.$f$, $r$Annemasse station is an 18-minute walk from Le Loft (Olympe de Gouges bus stop 6 min away), tram 17 8 minutes.$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$Annemasse station is 5-8 minutes by bike from Ambilly.$f$ IN content_en) > 0
  AND position($r$Annemasse station is an 18-minute walk from Le Loft (Olympe de Gouges bus stop 6 min away), tram 17 8 minutes.$r$ IN content_en) = 0;

-- [29/175] temps-trajet-annemasse-geneve-par-quartier (fr) · D1 · L54 : Le Lodge « à environ 9 minutes à pied de la gare » → 10 minutes
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$est à Annemasse, à environ 9 minutes à pied de la gare.$f$, $r$est à Annemasse, à 10 minutes à pied de la gare.$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$est à Annemasse, à environ 9 minutes à pied de la gare.$f$ IN content_fr) > 0
  AND position($r$est à Annemasse, à 10 minutes à pied de la gare.$r$ IN content_fr) = 0;

-- [30/175] temps-trajet-annemasse-geneve-par-quartier (en) · D1 · L53: Le Lodge “about a 9-minute walk from the station” → 10 minutes
UPDATE blog_posts
SET content_en = replace(content_en, $f$is in Annemasse, about a 9-minute walk from the station.$f$, $r$is in Annemasse, a 10-minute walk from the station.$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$is in Annemasse, about a 9-minute walk from the station.$f$ IN content_en) > 0
  AND position($r$is in Annemasse, a 10-minute walk from the station.$r$ IN content_en) = 0;

-- [31/175] temps-trajet-annemasse-geneve-par-quartier (fr) · D1 · L64 tableau des modes : « Léman Express | ~80 CHF | 20 min » (destination absente) → 7 min (Eaux-Vives), 23 min (Cornavin)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$| Léman Express (abonnement) | ~80 CHF | 20 min |$f$, $r$| Léman Express (abonnement) | ~80 CHF | 7 min (Eaux-Vives), 23 min (Cornavin) |$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$| Léman Express (abonnement) | ~80 CHF | 20 min |$f$ IN content_fr) > 0
  AND position($r$| Léman Express (abonnement) | ~80 CHF | 7 min (Eaux-Vives), 23 min (Cornavin) |$r$ IN content_fr) = 0;

-- [32/175] temps-trajet-annemasse-geneve-par-quartier (en) · D1 · L63 modes table: “Léman Express | ~80 CHF | 20 min” (no destination) → 7 min (Eaux-Vives), 23 min (Cornavin)
UPDATE blog_posts
SET content_en = replace(content_en, $f$| Léman Express (pass) | ~80 CHF | 20 min |$f$, $r$| Léman Express (pass) | ~80 CHF | 7 min (Eaux-Vives), 23 min (Cornavin) |$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$| Léman Express (pass) | ~80 CHF | 20 min |$f$ IN content_en) > 0
  AND position($r$| Léman Express (pass) | ~80 CHF | 7 min (Eaux-Vives), 23 min (Cornavin) |$r$ IN content_en) = 0;

-- [33/175] temps-trajet-annemasse-geneve-par-quartier (fr) · D1 · L80 : « La Villa à moins de 10 minutes à pied de la gare. Le Loft à 8 minutes en vélo. Le Lodge à environ 9 minutes à pied » → 14 min à pied / 18 min à pied + tram 17 à 8 min / 10 min à pied
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$La Villa à Ville-la-Grand est à moins de 10 minutes à pied de la gare d'Annemasse. Le Loft à Ambilly, à 8 minutes en vélo. Le Lodge à Annemasse, à environ 9 minutes à pied.$f$, $r$La Villa à Ville-la-Grand est à 14 minutes à pied de la gare d'Annemasse. Le Loft à Ambilly, à 18 minutes à pied de la gare et à 8 minutes du tram 17. Le Lodge à Annemasse, à 10 minutes à pied.$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$La Villa à Ville-la-Grand est à moins de 10 minutes à pied de la gare d'Annemasse. Le Loft à Ambilly, à 8 minutes en vélo. Le Lodge à Annemasse, à environ 9 minutes à pied.$f$ IN content_fr) > 0
  AND position($r$La Villa à Ville-la-Grand est à 14 minutes à pied de la gare d'Annemasse. Le Loft à Ambilly, à 18 minutes à pied de la gare et à 8 minutes du tram 17. Le Lodge à Annemasse, à 10 minutes à pied.$r$ IN content_fr) = 0;

-- [34/175] temps-trajet-annemasse-geneve-par-quartier (en) · D1 · L79: “La Villa less than a 10-minute walk from the station. Le Loft 8 minutes by bike. Le Lodge about a 9-minute walk” → 14-minute walk / 18-minute walk + tram 17 8 min / 10-minute walk
UPDATE blog_posts
SET content_en = replace(content_en, $f$La Villa in Ville-la-Grand is less than a 10-minute walk from Annemasse station. Le Loft in Ambilly, 8 minutes by bike. Le Lodge in Annemasse, about a 9-minute walk.$f$, $r$La Villa in Ville-la-Grand is a 14-minute walk from Annemasse station. Le Loft in Ambilly, an 18-minute walk from the station and 8 minutes from tram 17. Le Lodge in Annemasse, a 10-minute walk.$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$La Villa in Ville-la-Grand is less than a 10-minute walk from Annemasse station. Le Loft in Ambilly, 8 minutes by bike. Le Lodge in Annemasse, about a 9-minute walk.$f$ IN content_en) > 0
  AND position($r$La Villa in Ville-la-Grand is a 14-minute walk from Annemasse station. Le Loft in Ambilly, an 18-minute walk from the station and 8 minutes from tram 17. Le Lodge in Annemasse, a 10-minute walk.$r$ IN content_en) = 0;

-- [35/175] temps-trajet-annemasse-geneve-par-quartier (fr) · D1 · L86 : « La Villa (10 chambres) est à 10 min de la gare » (mode non précisé, faux) → 14 min à pied
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$La Villa (10 chambres) est à 10 min de la gare.$f$, $r$La Villa (10 chambres) est à 14 min à pied de la gare.$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$La Villa (10 chambres) est à 10 min de la gare.$f$ IN content_fr) > 0
  AND position($r$La Villa (10 chambres) est à 14 min à pied de la gare.$r$ IN content_fr) = 0;

-- [36/175] temps-trajet-annemasse-geneve-par-quartier (en) · D1 · L85: “La Villa (10 rooms) is 10 min from the station” (no mode, wrong) → 14-min walk
UPDATE blog_posts
SET content_en = replace(content_en, $f$La Villa (10 rooms) is 10 min from the station.$f$, $r$La Villa (10 rooms) is a 14-min walk from the station.$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$La Villa (10 rooms) is 10 min from the station.$f$ IN content_en) > 0
  AND position($r$La Villa (10 rooms) is a 14-min walk from the station.$r$ IN content_en) = 0;

-- [37/175] temps-trajet-annemasse-geneve-par-quartier (fr) · D1 · L88 : « Léman Express jusqu'à Genève-Aéroport (30 min, direct) » → faux (aucun Léman Express direct : changement à Cornavin) et minute vers l'aéroport interdite → énoncé de la FAQ airport-access, sans minute
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Annemasse avec Léman Express jusqu'à Genève-Aéroport (30 min, direct).$f$, $r$Annemasse, en train depuis la gare d'Annemasse : Léman Express jusqu'à Genève Cornavin, puis correspondance pour l'aéroport.$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$Annemasse avec Léman Express jusqu'à Genève-Aéroport (30 min, direct).$f$ IN content_fr) > 0
  AND position($r$Annemasse, en train depuis la gare d'Annemasse : Léman Express jusqu'à Genève Cornavin, puis correspondance pour l'aéroport.$r$ IN content_fr) = 0;

-- [38/175] temps-trajet-annemasse-geneve-par-quartier (en) · D1 · L87: “Léman Express to Geneva Airport (30 min, direct)” → wrong (no direct Léman Express: change at Cornavin) and airport minute forbidden → wording of the airport-access FAQ, no minute
UPDATE blog_posts
SET content_en = replace(content_en, $f$Annemasse with Léman Express to Geneva Airport (30 min, direct).$f$, $r$Annemasse, by train from Annemasse station: Léman Express to Geneva Cornavin, then a connection to the airport.$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$Annemasse with Léman Express to Geneva Airport (30 min, direct).$f$ IN content_en) > 0
  AND position($r$Annemasse, by train from Annemasse station: Léman Express to Geneva Cornavin, then a connection to the airport.$r$ IN content_en) = 0;

-- [39/175] transport-annemasse-geneve-leman-express (fr) · D1 · L8 : « Annemasse-Genève-Cornavin = 20 minutes. Aéroport (Cointrin) = 25 minutes » → Eaux-Vives 7 / Cornavin 23 ; aéroport : énoncé de la FAQ airport-access (Léman Express jusqu'à Cornavin, puis correspondance — aucun train direct), sans minute
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$**Temps** : Annemasse-Genève-Cornavin = 20 minutes. Aéroport (Cointrin) = 25 minutes de Annemasse.$f$, $r$**Temps** : Annemasse-Genève-Eaux-Vives = 7 minutes, Annemasse-Genève-Cornavin = 23 minutes. Aéroport (Cointrin) en train depuis la gare d'Annemasse : Léman Express jusqu'à Genève Cornavin, puis correspondance pour l'aéroport.$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$**Temps** : Annemasse-Genève-Cornavin = 20 minutes. Aéroport (Cointrin) = 25 minutes de Annemasse.$f$ IN content_fr) > 0
  AND position($r$**Temps** : Annemasse-Genève-Eaux-Vives = 7 minutes, Annemasse-Genève-Cornavin = 23 minutes. Aéroport (Cointrin) en train depuis la gare d'Annemasse : Léman Express jusqu'à Genève Cornavin, puis correspondance pour l'aéroport.$r$ IN content_fr) = 0;

-- [40/175] transport-annemasse-geneve-leman-express (en) · D1 · L7: “Annemasse-Geneva-Cornavin = 20 minutes. Airport (Cointrin) = 25 minutes” → Eaux-Vives 7 / Cornavin 23; airport: wording of the airport-access FAQ (Léman Express to Cornavin, then a connection — no direct train), no minute
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Time**: Annemasse-Geneva-Cornavin = 20 minutes. Airport (Cointrin) = 25 minutes from Annemasse.$f$, $r$**Time**: Annemasse-Geneva Eaux-Vives = 7 minutes, Annemasse-Geneva-Cornavin = 23 minutes. Airport (Cointrin) by train from Annemasse station: Léman Express to Geneva Cornavin, then a connection to the airport.$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$**Time**: Annemasse-Geneva-Cornavin = 20 minutes. Airport (Cointrin) = 25 minutes from Annemasse.$f$ IN content_en) > 0
  AND position($r$**Time**: Annemasse-Geneva Eaux-Vives = 7 minutes, Annemasse-Geneva-Cornavin = 23 minutes. Airport (Cointrin) by train from Annemasse station: Léman Express to Geneva Cornavin, then a connection to the airport.$r$ IN content_en) = 0;

-- [41/175] transport-annemasse-geneve-leman-express (fr) · fix · L14 : cadence « Toutes les 15 min en heures de pointe » → 10 min (TRANSIT.peakHeadwayMin, départs relevés le 08/10)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[Toutes les 15 min en heures de pointe](https://www.lemanexpress.com/)$f$, $r$[Toutes les 10 min en heures de pointe](https://www.lemanexpress.com/)$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$[Toutes les 15 min en heures de pointe](https://www.lemanexpress.com/)$f$ IN content_fr) > 0
  AND position($r$[Toutes les 10 min en heures de pointe](https://www.lemanexpress.com/)$r$ IN content_fr) = 0;

-- [42/175] transport-annemasse-geneve-leman-express (en) · fix · L13: headway “Every 15 min peak hours” → 10 min (TRANSIT.peakHeadwayMin, departures surveyed on 8 Oct.)
UPDATE blog_posts
SET content_en = replace(content_en, $f$[Every 15 min peak hours](https://www.lemanexpress.com/en/)$f$, $r$[Every 10 min at peak hours](https://www.lemanexpress.com/en/)$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$[Every 15 min peak hours](https://www.lemanexpress.com/en/)$f$ IN content_en) > 0
  AND position($r$[Every 10 min at peak hours](https://www.lemanexpress.com/en/)$r$ IN content_en) = 0;

-- [43/175] transport-annemasse-geneve-leman-express (fr) · D1 · L16 : « À Ville-la-Grand, c'est 10-15 min à pied. À Ambilly, c'est loin. » → minutes à pied par maison (10 / 14 / 18, tram 17 à 8 min au Loft)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$À Ville-la-Grand, c'est 10-15 min à pied. À Ambilly, c'est loin.$f$, $r$Depuis nos maisons : 10 min à pied du Lodge (Annemasse), 14 min de La Villa (Ville-la-Grand), 18 min du Loft (Ambilly), qui a aussi le tram 17 à 8 min.$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$À Ville-la-Grand, c'est 10-15 min à pied. À Ambilly, c'est loin.$f$ IN content_fr) > 0
  AND position($r$Depuis nos maisons : 10 min à pied du Lodge (Annemasse), 14 min de La Villa (Ville-la-Grand), 18 min du Loft (Ambilly), qui a aussi le tram 17 à 8 min.$r$ IN content_fr) = 0;

-- [44/175] transport-annemasse-geneve-leman-express (en) · D1 · L15: “Ville-la-Grand: 10-15 min walk. Ambilly: far.” → walking minutes per house (10 / 14 / 18, tram 17 an 8-min walk from Le Loft)
UPDATE blog_posts
SET content_en = replace(content_en, $f$Ville-la-Grand: 10-15 min walk. Ambilly: far.$f$, $r$From our houses: a 10-min walk from Le Lodge (Annemasse), 14 min from La Villa (Ville-la-Grand), 18 min from Le Loft (Ambilly), which also has tram 17 an 8-min walk away.$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$Ville-la-Grand: 10-15 min walk. Ambilly: far.$f$ IN content_en) > 0
  AND position($r$From our houses: a 10-min walk from Le Lodge (Annemasse), 14 min from La Villa (Ville-la-Grand), 18 min from Le Loft (Ambilly), which also has tram 17 an 8-min walk away.$r$ IN content_en) = 0;

-- [45/175] transport-annemasse-geneve-leman-express (fr) · D1 · L35 (section vélo) : « Annemasse-Genève-centre = 35-40 minutes (piste cyclable) » → valeurs Voie Verte de TRANSIT vers Rive (23 à 29 min selon la maison)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$**Temps** : Annemasse-Genève-centre = 35-40 minutes (piste cyclable).$f$, $r$**Temps** : Annemasse-Genève centre (Rive) = 23 à 29 minutes par la Voie Verte selon la maison.$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$**Temps** : Annemasse-Genève-centre = 35-40 minutes (piste cyclable).$f$ IN content_fr) > 0
  AND position($r$**Temps** : Annemasse-Genève centre (Rive) = 23 à 29 minutes par la Voie Verte selon la maison.$r$ IN content_fr) = 0;

-- [46/175] transport-annemasse-geneve-leman-express (en) · D1 · L35 (bike section): “Annemasse-Geneva-center = 35-40 min (bike path)” → TRANSIT Voie Verte values to Rive (23 to 29 min depending on the house)
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Time**: Annemasse-Geneva-center = 35-40 min (bike path).$f$, $r$**Time**: Annemasse-Geneva centre (Rive) = 23 to 29 min on the Voie Verte depending on the house.$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$**Time**: Annemasse-Geneva-center = 35-40 min (bike path).$f$ IN content_en) > 0
  AND position($r$**Time**: Annemasse-Geneva centre (Rive) = 23 to 29 min on the Voie Verte depending on the house.$r$ IN content_en) = 0;

-- [47/175] transport-annemasse-geneve-leman-express (fr) · D1 · L76 tableau final : « Léman Express | 200€ | 20 min » (destination absente) → 7 min (Eaux-Vives), 23 min (Cornavin)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$| Léman Express | 200€ | 20 min | Bas | 9/10 |$f$, $r$| Léman Express | 200€ | 7 min (Eaux-Vives), 23 min (Cornavin) | Bas | 9/10 |$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$| Léman Express | 200€ | 20 min | Bas | 9/10 |$f$ IN content_fr) > 0
  AND position($r$| Léman Express | 200€ | 7 min (Eaux-Vives), 23 min (Cornavin) | Bas | 9/10 |$r$ IN content_fr) = 0;

-- [48/175] transport-annemasse-geneve-leman-express (en) · D1 · L75 final table: “Léman Express | 200€ | 20 min” (no destination) → 7 min (Eaux-Vives), 23 min (Cornavin)
UPDATE blog_posts
SET content_en = replace(content_en, $f$| Léman Express | 200€ | 20 min | Low | 9/10 |$f$, $r$| Léman Express | 200€ | 7 min (Eaux-Vives), 23 min (Cornavin) | Low | 9/10 |$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$| Léman Express | 200€ | 20 min | Low | 9/10 |$f$ IN content_en) > 0
  AND position($r$| Léman Express | 200€ | 7 min (Eaux-Vives), 23 min (Cornavin) | Low | 9/10 |$r$ IN content_en) = 0;

-- [49/175] transport-annemasse-geneve-leman-express (fr) · D1 · L78 tableau final : « Vélo | 0€ | 35-40 min » → valeurs Voie Verte de TRANSIT (23-29 min)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$| Vélo | 0€ | 35-40 min | Bas | 5/10 (été) |$f$, $r$| Vélo | 0€ | 23-29 min (Voie Verte) | Bas | 5/10 (été) |$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$| Vélo | 0€ | 35-40 min | Bas | 5/10 (été) |$f$ IN content_fr) > 0
  AND position($r$| Vélo | 0€ | 23-29 min (Voie Verte) | Bas | 5/10 (été) |$r$ IN content_fr) = 0;

-- [50/175] transport-annemasse-geneve-leman-express (en) · D1 · L77 final table: “Bike | 0€ | 35-40 min” → TRANSIT Voie Verte values (23-29 min)
UPDATE blog_posts
SET content_en = replace(content_en, $f$| Bike | 0€ | 35-40 min | Low | 5/10 (summer) |$f$, $r$| Bike | 0€ | 23-29 min (Voie Verte) | Low | 5/10 (summer) |$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$| Bike | 0€ | 35-40 min | Low | 5/10 (summer) |$f$ IN content_en) > 0
  AND position($r$| Bike | 0€ | 23-29 min (Voie Verte) | Low | 5/10 (summer) |$r$ IN content_en) = 0;

-- [51/175] transport-annemasse-geneve-leman-express (fr) · D1 · L104 tableau « Depuis Ville-la-Grand » : « Centre (Cornavin) | 22 min » présenté comme porte-à-porte → la cellule porte les deux nombres et le mode : 23 min de train · 38 min porte-à-porte depuis La Villa (Léman Express)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$| Centre (Cornavin) | 22 min | 20-25 → 40-55 min | 35-50 min | 30-40 min |$f$, $r$| Centre (Cornavin) | 23 min de train · 38 min porte-à-porte depuis La Villa (Léman Express) | 20-25 → 40-55 min | 35-50 min | 30-40 min |$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$| Centre (Cornavin) | 22 min | 20-25 → 40-55 min | 35-50 min | 30-40 min |$f$ IN content_fr) > 0
  AND position($r$| Centre (Cornavin) | 23 min de train · 38 min porte-à-porte depuis La Villa (Léman Express) | 20-25 → 40-55 min | 35-50 min | 30-40 min |$r$ IN content_fr) = 0;

-- [52/175] transport-annemasse-geneve-leman-express (en) · D1 · L98 “From Ville-la-Grand” table: “Center (Cornavin) | 22 min” presented as door to door → the cell carries both numbers and the mode: 23 min by train · 38 min door to door from La Villa (Léman Express)
UPDATE blog_posts
SET content_en = replace(content_en, $f$| Center (Cornavin) | 22 min | 20-25 → 40-55 min | 35-50 min | 30-40 min |$f$, $r$| Center (Cornavin) | 23 min by train · 38 min door to door from La Villa (Léman Express) | 20-25 → 40-55 min | 35-50 min | 30-40 min |$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$| Center (Cornavin) | 22 min | 20-25 → 40-55 min | 35-50 min | 30-40 min |$f$ IN content_en) > 0
  AND position($r$| Center (Cornavin) | 23 min by train · 38 min door to door from La Villa (Léman Express) | 20-25 → 40-55 min | 35-50 min | 30-40 min |$r$ IN content_en) = 0;

-- [53/175] transport-annemasse-geneve-leman-express (fr) · D1 · L106 tableau : « CERN (Meyrin) … (Cornavin 22 min + tram 18) » → 23 min
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$| CERN (Meyrin) | 50-55 min (Cornavin 22 min + tram 18) |$f$, $r$| CERN (Meyrin) | 50-55 min (Cornavin 23 min + tram 18) |$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$| CERN (Meyrin) | 50-55 min (Cornavin 22 min + tram 18) |$f$ IN content_fr) > 0
  AND position($r$| CERN (Meyrin) | 50-55 min (Cornavin 23 min + tram 18) |$r$ IN content_fr) = 0;

-- [54/175] transport-annemasse-geneve-leman-express (en) · D1 · L100 table: “CERN (Meyrin) … (Cornavin 22 min + tram 18)” → 23 min
UPDATE blog_posts
SET content_en = replace(content_en, $f$| CERN (Meyrin) | 50-55 min (Cornavin 22 min + tram 18) |$f$, $r$| CERN (Meyrin) | 50-55 min (Cornavin 23 min + tram 18) |$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$| CERN (Meyrin) | 50-55 min (Cornavin 22 min + tram 18) |$f$ IN content_en) > 0
  AND position($r$| CERN (Meyrin) | 50-55 min (Cornavin 23 min + tram 18) |$r$ IN content_en) = 0;

-- [55/175] transport-annemasse-geneve-leman-express (fr) · D1 · L109 : « La gare d'Annemasse est à 10 min à pied (ou 3 min en vélo) de Ville-la-Grand » → 14 min à pied de La Villa
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$La gare d'Annemasse est à 10 min à pied (ou 3 min en vélo) de Ville-la-Grand.$f$, $r$La gare d'Annemasse est à 14 min à pied de La Villa, à Ville-la-Grand.$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$La gare d'Annemasse est à 10 min à pied (ou 3 min en vélo) de Ville-la-Grand.$f$ IN content_fr) > 0
  AND position($r$La gare d'Annemasse est à 14 min à pied de La Villa, à Ville-la-Grand.$r$ IN content_fr) = 0;

-- [56/175] transport-annemasse-geneve-leman-express (en) · D1 · L103: “Annemasse station is a 10-min walk (or 3-min bike ride) from Ville-la-Grand” → 14-min walk from La Villa
UPDATE blog_posts
SET content_en = replace(content_en, $f$Annemasse station is a 10-min walk (or 3-min bike ride) from Ville-la-Grand.$f$, $r$Annemasse station is a 14-min walk from La Villa, in Ville-la-Grand.$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$Annemasse station is a 10-min walk (or 3-min bike ride) from Ville-la-Grand.$f$ IN content_en) > 0
  AND position($r$Annemasse station is a 14-min walk from La Villa, in Ville-la-Grand.$r$ IN content_en) = 0;

-- [57/175] transport-annemasse-geneve-leman-express (fr) · D1 · L113 (Ambilly) : « La gare d'Annemasse est à 5-8 min en vélo » (vélo non sourcé) → 18 min à pied du Loft, tram 17 à 8 min
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$La gare d'Annemasse est à 5-8 min en vélo.$f$, $r$La gare d'Annemasse est à 18 min à pied du Loft, le tram 17 à 8 min.$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$La gare d'Annemasse est à 5-8 min en vélo.$f$ IN content_fr) > 0
  AND position($r$La gare d'Annemasse est à 18 min à pied du Loft, le tram 17 à 8 min.$r$ IN content_fr) = 0;

-- [58/175] transport-annemasse-geneve-leman-express (en) · D1 · L107 (Ambilly): “Annemasse station is 5-8 min by bike” (unsourced bike time) → 18-min walk from Le Loft, tram 17 an 8-min walk
UPDATE blog_posts
SET content_en = replace(content_en, $f$Annemasse station is 5-8 min by bike.$f$, $r$Annemasse station is an 18-min walk from Le Loft, tram 17 an 8-min walk.$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$Annemasse station is 5-8 min by bike.$f$ IN content_en) > 0
  AND position($r$Annemasse station is an 18-min walk from Le Loft, tram 17 an 8-min walk.$r$ IN content_en) = 0;

-- [59/175] transport-annemasse-geneve-leman-express (fr) · D1 · L117 : « Vers l'aéroport, le Léman Express est direct (30 min) » → faux (changement à Cornavin) et minute interdite → énoncé de la FAQ airport-access
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Vers l'aéroport, le Léman Express est direct (30 min).$f$, $r$Vers l'aéroport, en train depuis la gare d'Annemasse : Léman Express jusqu'à Genève Cornavin, puis correspondance pour l'aéroport.$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$Vers l'aéroport, le Léman Express est direct (30 min).$f$ IN content_fr) > 0
  AND position($r$Vers l'aéroport, en train depuis la gare d'Annemasse : Léman Express jusqu'à Genève Cornavin, puis correspondance pour l'aéroport.$r$ IN content_fr) = 0;

-- [60/175] transport-annemasse-geneve-leman-express (en) · D1 · L111: “To the airport, the Léman Express is direct (30 min)” → wrong (change at Cornavin) and minute forbidden → wording of the airport-access FAQ
UPDATE blog_posts
SET content_en = replace(content_en, $f$To the airport, the Léman Express is direct (30 min).$f$, $r$To the airport, by train from Annemasse station: Léman Express to Geneva Cornavin, then a connection to the airport.$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$To the airport, the Léman Express is direct (30 min).$f$ IN content_en) > 0
  AND position($r$To the airport, by train from Annemasse station: Léman Express to Geneva Cornavin, then a connection to the airport.$r$ IN content_en) = 0;

-- [61/175] transport-annemasse-geneve-leman-express (fr) · D1 · L123 : « Léman Express direct jusqu'à Genève-Aéroport (30 min) » → faux (changement à Cornavin) et minute interdite → énoncé de la FAQ airport-access
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$- **Aéroport** : Annemasse, Léman Express direct jusqu'à Genève-Aéroport (30 min).$f$, $r$- **Aéroport** : Annemasse, en train depuis la gare d'Annemasse : Léman Express jusqu'à Genève Cornavin, puis correspondance pour l'aéroport.$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$- **Aéroport** : Annemasse, Léman Express direct jusqu'à Genève-Aéroport (30 min).$f$ IN content_fr) > 0
  AND position($r$- **Aéroport** : Annemasse, en train depuis la gare d'Annemasse : Léman Express jusqu'à Genève Cornavin, puis correspondance pour l'aéroport.$r$ IN content_fr) = 0;

-- [62/175] transport-annemasse-geneve-leman-express (en) · D1 · L117: “direct Léman Express to Geneva Airport (30 min)” → wrong (change at Cornavin) and minute forbidden → wording of the airport-access FAQ
UPDATE blog_posts
SET content_en = replace(content_en, $f$- **Airport**: Annemasse, direct Léman Express to Geneva Airport (30 min).$f$, $r$- **Airport**: Annemasse, by train from Annemasse station: Léman Express to Geneva Cornavin, then a connection to the airport.$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$- **Airport**: Annemasse, direct Léman Express to Geneva Airport (30 min).$f$ IN content_en) > 0
  AND position($r$- **Airport**: Annemasse, by train from Annemasse station: Léman Express to Geneva Cornavin, then a connection to the airport.$r$ IN content_en) = 0;

-- [63/175] coliving-geneve-frontaliers-guide-complet (fr) · D1 · L26 : « tu restes à quelques minutes de ton lieu de travail » (non qualifié) → 7 minutes de train de Genève-Eaux-Vives
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$À Annemasse par exemple, tu restes à quelques minutes de ton lieu de travail tout en bénéficiant$f$, $r$À Annemasse par exemple, tu restes à 7 minutes de train de Genève-Eaux-Vives (Léman Express depuis la gare d'Annemasse) tout en bénéficiant$r$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($f$À Annemasse par exemple, tu restes à quelques minutes de ton lieu de travail tout en bénéficiant$f$ IN content_fr) > 0
  AND position($r$À Annemasse par exemple, tu restes à 7 minutes de train de Genève-Eaux-Vives (Léman Express depuis la gare d'Annemasse) tout en bénéficiant$r$ IN content_fr) = 0;

-- [64/175] coliving-geneve-frontaliers-guide-complet (en) · D1 · L25: “you stay just minutes from your workplace” (unqualified) → 7 minutes by train from Geneva Eaux-Vives
UPDATE blog_posts
SET content_en = replace(content_en, $f$In Annemasse, for example, you stay just minutes from your workplace while benefiting from French cost of living.$f$, $r$In Annemasse, for example, you stay 7 minutes by train from Geneva Eaux-Vives (Léman Express from Annemasse station) while benefiting from the French cost of living.$r$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($f$In Annemasse, for example, you stay just minutes from your workplace while benefiting from French cost of living.$f$ IN content_en) > 0
  AND position($r$In Annemasse, for example, you stay 7 minutes by train from Geneva Eaux-Vives (Léman Express from Annemasse station) while benefiting from the French cost of living.$r$ IN content_en) = 0;

-- [65/175] coliving-geneve-frontaliers-guide-complet (fr) · D1 · L62 : « 20 minutes en transport en commun pour rejoindre le centre de Genève » → libellé de marque STATS_DISPLAY.distance
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$**Proximité de Genève** : 20 minutes en transport en commun pour rejoindre le centre de Genève$f$, $r$**Proximité de Genève** : 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte$r$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($f$**Proximité de Genève** : 20 minutes en transport en commun pour rejoindre le centre de Genève$f$ IN content_fr) > 0
  AND position($r$**Proximité de Genève** : 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte$r$ IN content_fr) = 0;

-- [66/175] coliving-geneve-frontaliers-guide-complet (en) · D1 · L61: “20 minutes by public transport to reach Geneva center” → brand wording STATS_DISPLAY.distance
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Geneva proximity**: 20 minutes by public transport to reach Geneva center$f$, $r$**Geneva proximity**: 20 min from Geneva Eaux-Vives by Léman Express, door to door$r$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($f$**Geneva proximity**: 20 minutes by public transport to reach Geneva center$f$ IN content_en) > 0
  AND position($r$**Geneva proximity**: 20 min from Geneva Eaux-Vives by Léman Express, door to door$r$ IN content_en) = 0;

-- [67/175] coliving-geneve-frontaliers-guide-complet (fr, facebook_post_fr) · D1 · post Facebook : « 🚊 15 min de Genève en transports » → STATS_DISPLAY.distance
UPDATE blog_posts
SET facebook_post_fr = replace(facebook_post_fr, $f$🚊 15 min de Genève en transports$f$, $r$🚊 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte$r$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($f$🚊 15 min de Genève en transports$f$ IN facebook_post_fr) > 0
  AND position($r$🚊 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte$r$ IN facebook_post_fr) = 0;

-- [68/175] coliving-geneve-frontaliers-guide-complet (en, facebook_post_en) · D1 · Facebook post: “🚊 15 min from Geneva by transport” → STATS_DISPLAY.distance
UPDATE blog_posts
SET facebook_post_en = replace(facebook_post_en, $f$🚊 15 min from Geneva by transport$f$, $r$🚊 20 min from Geneva Eaux-Vives by Léman Express, door to door$r$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($f$🚊 15 min from Geneva by transport$f$ IN facebook_post_en) > 0
  AND position($r$🚊 20 min from Geneva Eaux-Vives by Léman Express, door to door$r$ IN facebook_post_en) = 0;

-- [69/175] coliving-geneve-frontaliers-guide-complet (fr, facebook_post_fr) · fix · post Facebook : « ✨ 1 430 CHF/mois tout inclus » (second palier, interdit hors /tarifs) → prix d'appel « dès 1 370 CHF/mois »
UPDATE blog_posts
SET facebook_post_fr = replace(facebook_post_fr, $f$✨ 1 430 CHF/mois tout inclus à Annemasse$f$, $r$✨ dès 1 370 CHF/mois tout inclus à Annemasse$r$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($f$✨ 1 430 CHF/mois tout inclus à Annemasse$f$ IN facebook_post_fr) > 0
  AND position($r$✨ dès 1 370 CHF/mois tout inclus à Annemasse$r$ IN facebook_post_fr) = 0;

-- [70/175] coliving-geneve-frontaliers-guide-complet (en, facebook_post_en) · fix · Facebook post: “✨ 1,430 CHF/month all-inclusive” (second tier, forbidden outside /tarifs) → entry price “from CHF 1,370/month”
UPDATE blog_posts
SET facebook_post_en = replace(facebook_post_en, $f$✨ 1,430 CHF/month all-inclusive in Annemasse$f$, $r$✨ from CHF 1,370/month all-inclusive in Annemasse$r$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($f$✨ 1,430 CHF/month all-inclusive in Annemasse$f$ IN facebook_post_en) > 0
  AND position($r$✨ from CHF 1,370/month all-inclusive in Annemasse$r$ IN facebook_post_en) = 0;

-- [71/175] lodge-annemasse-coliving-premium-portes-geneve (fr) · D1 · L2 : « à quelques minutes seulement de la frontière suisse » (Le Lodge : aucune promesse de frontière) → 10 min à pied de la gare d'Annemasse
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$notre maison d'Annemasse, à quelques minutes seulement de la frontière suisse.$f$, $r$notre maison d'Annemasse, à 10 min à pied de la gare d'Annemasse.$r$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($f$notre maison d'Annemasse, à quelques minutes seulement de la frontière suisse.$f$ IN content_fr) > 0
  AND position($r$notre maison d'Annemasse, à 10 min à pied de la gare d'Annemasse.$r$ IN content_fr) = 0;

-- [72/175] lodge-annemasse-coliving-premium-portes-geneve (en) · D1 · L1: “just minutes from the Swiss border” (Le Lodge: no border promise) → a 10-minute walk from Annemasse station
UPDATE blog_posts
SET content_en = replace(content_en, $f$our house in Annemasse, just minutes from the Swiss border.$f$, $r$our house in Annemasse, a 10-minute walk from Annemasse station.$r$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($f$our house in Annemasse, just minutes from the Swiss border.$f$ IN content_en) > 0
  AND position($r$our house in Annemasse, a 10-minute walk from Annemasse station.$r$ IN content_en) = 0;

-- [73/175] lodge-annemasse-coliving-premium-portes-geneve (fr) · D1 · L10 : « relie la gare d'Annemasse à Cornavin en 20 minutes » → Genève-Eaux-Vives en 7 minutes et Cornavin en 23
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Le Léman Express relie la gare d'Annemasse à Cornavin en 20 minutes, et le tram 17$f$, $r$Le Léman Express relie la gare d'Annemasse à Genève-Eaux-Vives en 7 minutes et à Cornavin en 23 minutes, et le tram 17$r$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($f$Le Léman Express relie la gare d'Annemasse à Cornavin en 20 minutes, et le tram 17$f$ IN content_fr) > 0
  AND position($r$Le Léman Express relie la gare d'Annemasse à Genève-Eaux-Vives en 7 minutes et à Cornavin en 23 minutes, et le tram 17$r$ IN content_fr) = 0;

-- [74/175] lodge-annemasse-coliving-premium-portes-geneve (en) · D1 · L9: “connects Annemasse station to Cornavin in 20 minutes” → Geneva Eaux-Vives in 7 minutes and Cornavin in 23
UPDATE blog_posts
SET content_en = replace(content_en, $f$The Léman Express connects Annemasse station to Cornavin in 20 minutes, and tram 17$f$, $r$The Léman Express connects Annemasse station to Geneva Eaux-Vives in 7 minutes and to Cornavin in 23 minutes, and tram 17$r$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($f$The Léman Express connects Annemasse station to Cornavin in 20 minutes, and tram 17$f$ IN content_en) > 0
  AND position($r$The Léman Express connects Annemasse station to Geneva Eaux-Vives in 7 minutes and to Cornavin in 23 minutes, and tram 17$r$ IN content_en) = 0;

-- [75/175] lodge-annemasse-coliving-premium-portes-geneve (fr) · D1 · L20 : « La gare d'Annemasse — et son Léman Express — est à environ 9 minutes à pied » → 10 minutes
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$La gare d'Annemasse — et son Léman Express — est à environ 9 minutes à pied.$f$, $r$La gare d'Annemasse — et son Léman Express — est à 10 minutes à pied.$r$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($f$La gare d'Annemasse — et son Léman Express — est à environ 9 minutes à pied.$f$ IN content_fr) > 0
  AND position($r$La gare d'Annemasse — et son Léman Express — est à 10 minutes à pied.$r$ IN content_fr) = 0;

-- [76/175] lodge-annemasse-coliving-premium-portes-geneve (en) · D1 · L19: “Annemasse station — and its Léman Express — is about a 9-minute walk away” → 10-minute walk
UPDATE blog_posts
SET content_en = replace(content_en, $f$Annemasse station — and its Léman Express — is about a 9-minute walk away.$f$, $r$Annemasse station — and its Léman Express — is a 10-minute walk away.$r$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($f$Annemasse station — and its Léman Express — is about a 9-minute walk away.$f$ IN content_en) > 0
  AND position($r$Annemasse station — and its Léman Express — is a 10-minute walk away.$r$ IN content_en) = 0;

-- [77/175] lodge-annemasse-coliving-premium-portes-geneve (fr) · D1 · L24 : « environ 9 minutes à pied de la gare, soit 20 minutes de Cornavin » → 10 min à pied, Eaux-Vives en 18 min porte-à-porte, Cornavin en 23 min de train
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$à environ 9 minutes à pied de la gare d'Annemasse, soit 20 minutes de Cornavin en Léman Express$f$, $r$à 10 minutes à pied de la gare d'Annemasse, Genève-Eaux-Vives en 18 minutes porte-à-porte et Cornavin en 23 minutes de Léman Express$r$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($f$à environ 9 minutes à pied de la gare d'Annemasse, soit 20 minutes de Cornavin en Léman Express$f$ IN content_fr) > 0
  AND position($r$à 10 minutes à pied de la gare d'Annemasse, Genève-Eaux-Vives en 18 minutes porte-à-porte et Cornavin en 23 minutes de Léman Express$r$ IN content_fr) = 0;

-- [78/175] lodge-annemasse-coliving-premium-portes-geneve (en) · D1 · L23: “about 9 minutes' walk from the station, i.e. 20 minutes from Cornavin” → 10-minute walk, Eaux-Vives in 18 minutes door to door, Cornavin in 23 minutes by train
UPDATE blog_posts
SET content_en = replace(content_en, $f$about 9 minutes' walk from Annemasse station, i.e. 20 minutes from Cornavin by Léman Express$f$, $r$a 10-minute walk from Annemasse station, Geneva Eaux-Vives in 18 minutes door to door and Cornavin in 23 minutes by Léman Express$r$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($f$about 9 minutes' walk from Annemasse station, i.e. 20 minutes from Cornavin by Léman Express$f$ IN content_en) > 0
  AND position($r$a 10-minute walk from Annemasse station, Geneva Eaux-Vives in 18 minutes door to door and Cornavin in 23 minutes by Léman Express$r$ IN content_en) = 0;

-- [79/175] lodge-annemasse-coliving-premium-portes-geneve (fr, facebook_post_fr) · D1 · post Facebook : « tout compris à 1 430 CHF/mois. À 10 minutes de Genève » (second palier + minute fausse non qualifiée) → « dès 1 370 CHF/mois » + STATS_DISPLAY.distance
UPDATE blog_posts
SET facebook_post_fr = replace(facebook_post_fr, $f$tout compris à 1 430 CHF/mois. À 10 minutes de Genève, à des années-lumière$f$, $r$tout compris dès 1 370 CHF/mois. À 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, à des années-lumière$r$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($f$tout compris à 1 430 CHF/mois. À 10 minutes de Genève, à des années-lumière$f$ IN facebook_post_fr) > 0
  AND position($r$tout compris dès 1 370 CHF/mois. À 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, à des années-lumière$r$ IN facebook_post_fr) = 0;

-- [80/175] lodge-annemasse-coliving-premium-portes-geneve (en, facebook_post_en) · D1 · Facebook post: “all-inclusive at 1,430 CHF/month. 10 minutes from Geneva” (second tier + wrong unqualified minute) → “from CHF 1,370/month” + STATS_DISPLAY.distance
UPDATE blog_posts
SET facebook_post_en = replace(facebook_post_en, $f$all-inclusive at 1,430 CHF/month. 10 minutes from Geneva, light-years$f$, $r$all-inclusive from CHF 1,370/month. 20 min from Geneva Eaux-Vives by Léman Express, door to door, light-years$r$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($f$all-inclusive at 1,430 CHF/month. 10 minutes from Geneva, light-years$f$ IN facebook_post_en) > 0
  AND position($r$all-inclusive from CHF 1,370/month. 20 min from Geneva Eaux-Vives by Léman Express, door to door, light-years$r$ IN facebook_post_en) = 0;

-- [81/175] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · D1 · L10 fiche Annemasse : « Temps de trajet : 15-20 min en Léman Express » → Genève-Eaux-Vives en 7 min, Cornavin en 23 (lien conservé)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$**Temps de trajet** : 15-20 min [en Léman Express](https://www.lemanexpress.com/)$f$, $r$**Temps de trajet** : Genève-Eaux-Vives en 7 min [en Léman Express](https://www.lemanexpress.com/), Cornavin en 23 min$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$**Temps de trajet** : 15-20 min [en Léman Express](https://www.lemanexpress.com/)$f$ IN content_fr) > 0
  AND position($r$**Temps de trajet** : Genève-Eaux-Vives en 7 min [en Léman Express](https://www.lemanexpress.com/), Cornavin en 23 min$r$ IN content_fr) = 0;

-- [82/175] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · D1 · L11 Annemasse card: “Commute: 15-20 min by Léman Express” → Geneva Eaux-Vives in 7 min, Cornavin in 23 (link kept)
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Commute**: [15-20 min by Léman Express](https://www.lemanexpress.com/)$f$, $r$**Commute**: Geneva Eaux-Vives in 7 min [by Léman Express](https://www.lemanexpress.com/), Cornavin in 23 min$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$**Commute**: [15-20 min by Léman Express](https://www.lemanexpress.com/)$f$ IN content_en) > 0
  AND position($r$**Commute**: Geneva Eaux-Vives in 7 min [by Léman Express](https://www.lemanexpress.com/), Cornavin in 23 min$r$ IN content_en) = 0;

-- [83/175] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · D1 · L12 : « Le Léman Express te dépose à Cornavin en 20 minutes » → Eaux-Vives 7 / Cornavin 23
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Le Léman Express te dépose à Cornavin en 20 minutes.$f$, $r$Le Léman Express te dépose à Genève-Eaux-Vives en 7 minutes et à Cornavin en 23 minutes.$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$Le Léman Express te dépose à Cornavin en 20 minutes.$f$ IN content_fr) > 0
  AND position($r$Le Léman Express te dépose à Genève-Eaux-Vives en 7 minutes et à Cornavin en 23 minutes.$r$ IN content_fr) = 0;

-- [84/175] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · D1 · L13: “The Léman Express drops you at Cornavin in 20 minutes” → Eaux-Vives 7 / Cornavin 23
UPDATE blog_posts
SET content_en = replace(content_en, $f$The Léman Express drops you at Cornavin in 20 minutes.$f$, $r$The Léman Express drops you at Geneva Eaux-Vives in 7 minutes and at Cornavin in 23 minutes.$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$The Léman Express drops you at Cornavin in 20 minutes.$f$ IN content_en) > 0
  AND position($r$The Léman Express drops you at Geneva Eaux-Vives in 7 minutes and at Cornavin in 23 minutes.$r$ IN content_en) = 0;

-- [85/175] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · D1 · L20 fiche Ville-la-Grand : « 12 min en voiture, 20 min en bus » (promesse en voiture) → Léman Express 7 min, 22 min porte-à-porte depuis La Villa
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$**Temps de trajet** : 12 min en voiture, 20 min en bus$f$, $r$**Temps de trajet** : Genève-Eaux-Vives en 7 min de Léman Express, 22 min porte-à-porte depuis La Villa$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$**Temps de trajet** : 12 min en voiture, 20 min en bus$f$ IN content_fr) > 0
  AND position($r$**Temps de trajet** : Genève-Eaux-Vives en 7 min de Léman Express, 22 min porte-à-porte depuis La Villa$r$ IN content_fr) = 0;

-- [86/175] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · D1 · L23 Ville-la-Grand card: “12 min by car, 20 min by bus” (car promise) → Léman Express 7 min, 22 min door to door from La Villa
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Commute**: 12 min by car, 20 min by bus$f$, $r$**Commute**: Geneva Eaux-Vives in 7 min by Léman Express, 22 min door to door from La Villa$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$**Commute**: 12 min by car, 20 min by bus$f$ IN content_en) > 0
  AND position($r$**Commute**: Geneva Eaux-Vives in 7 min by Léman Express, 22 min door to door from La Villa$r$ IN content_en) = 0;

-- [87/175] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · D7 · L22 : « plusieurs lignes TPN qui filent direct sur Genève » (TPN = réseau de Nyon) → le Léman Express depuis la gare d'Annemasse
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$plusieurs lignes TPN qui filent direct sur Genève.$f$, $r$le Léman Express depuis la gare d'Annemasse.$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$plusieurs lignes TPN qui filent direct sur Genève.$f$ IN content_fr) > 0
  AND position($r$le Léman Express depuis la gare d'Annemasse.$r$ IN content_fr) = 0;

-- [88/175] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · D7 · L25: “several TPN bus lines straight to Geneva” (TPN = Nyon network) → the Léman Express from Annemasse station
UPDATE blog_posts
SET content_en = replace(content_en, $f$several TPN bus lines straight to Geneva.$f$, $r$the Léman Express from Annemasse station.$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$several TPN bus lines straight to Geneva.$f$ IN content_en) > 0
  AND position($r$the Léman Express from Annemasse station.$r$ IN content_en) = 0;

-- [89/175] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · D6 · L68 fiche Ambilly : « Frontière à pied : 5 min · 10 min en voiture, 10 min en Tram, 20 min en CEVA » → le Foron à 8 min (600 m du Loft) · deux nombres par mode puisque la maison est nommée (D1.3) : Rive en 23 min de tram 17 (32 min porte-à-porte depuis Le Loft), Genève-Eaux-Vives en 7 min de Léman Express (24 min porte-à-porte)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$**Frontière à pied** : 5 min · **Temps de trajet Genève** : 10 min en voiture, 10 min en Tram, 20 min en CEVA$f$, $r$**Frontière à pied** : 8 min (le Foron, à 600 m du Loft) · **Temps de trajet Genève** : Rive en 23 min de tram 17 (32 min porte-à-porte depuis Le Loft), Genève-Eaux-Vives en 7 min de Léman Express (24 min porte-à-porte)$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$**Frontière à pied** : 5 min · **Temps de trajet Genève** : 10 min en voiture, 10 min en Tram, 20 min en CEVA$f$ IN content_fr) > 0
  AND position($r$**Frontière à pied** : 8 min (le Foron, à 600 m du Loft) · **Temps de trajet Genève** : Rive en 23 min de tram 17 (32 min porte-à-porte depuis Le Loft), Genève-Eaux-Vives en 7 min de Léman Express (24 min porte-à-porte)$r$ IN content_fr) = 0;

-- [90/175] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · D6 · L71 Ambilly card: “Walk to border: 5 min · 10 min by car, 10 min by tram, 20 min by CEVA” → the Foron 8 min (600 m from Le Loft) · two numbers per mode since the house is named (D1.3): Rive in 23 min by tram 17 (32 min door to door from Le Loft), Geneva Eaux-Vives in 7 min by Léman Express (24 min door to door)
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Walk to border**: 5 min · **Commute to Geneva**: 10 min by car, 10 min by tram, 20 min by CEVA$f$, $r$**Walk to border**: 8 min (the Foron, 600 m from Le Loft) · **Commute to Geneva**: Rive in 23 min by tram 17 (32 min door to door from Le Loft), Geneva Eaux-Vives in 7 min by Léman Express (24 min door to door)$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$**Walk to border**: 5 min · **Commute to Geneva**: 10 min by car, 10 min by tram, 20 min by CEVA$f$ IN content_en) > 0
  AND position($r$**Walk to border**: 8 min (the Foron, 600 m from Le Loft) · **Commute to Geneva**: Rive in 23 min by tram 17 (32 min door to door from Le Loft), Geneva Eaux-Vives in 7 min by Léman Express (24 min door to door)$r$ IN content_en) = 0;

-- [91/175] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · D6 · L70 : « la commune française la plus proche de la frontière : compte 5 minutes à pied jusqu'au poste de douane » → le Foron à 600 m / 8 min du Loft, douane de Moillesulaz à 1,8 km
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Ambilly est la commune française la plus proche de la frontière : compte 5 minutes à pied jusqu'au poste de douane.$f$, $r$Ambilly est la commune collée à la frontière : depuis Le Loft, le Foron, la rivière-frontière, est à 600 m, 8 min à pied, et la douane de Moillesulaz à 1,8 km.$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$Ambilly est la commune française la plus proche de la frontière : compte 5 minutes à pied jusqu'au poste de douane.$f$ IN content_fr) > 0
  AND position($r$Ambilly est la commune collée à la frontière : depuis Le Loft, le Foron, la rivière-frontière, est à 600 m, 8 min à pied, et la douane de Moillesulaz à 1,8 km.$r$ IN content_fr) = 0;

-- [92/175] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · D6 · L73: “the closest French town to the border — about a 5-minute walk to the border crossing” → the Foron 600 m / 8 min from Le Loft, Moillesulaz crossing 1.8 km
UPDATE blog_posts
SET content_en = replace(content_en, $f$Ambilly is the closest French town to the border — about a 5-minute walk to the border crossing.$f$, $r$Ambilly is the town right on the border: from Le Loft, the Foron, the border river, is 600 m away, an 8-minute walk, and the Moillesulaz crossing 1.8 km away.$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$Ambilly is the closest French town to the border — about a 5-minute walk to the border crossing.$f$ IN content_en) > 0
  AND position($r$Ambilly is the town right on the border: from Le Loft, the Foron, the border river, is 600 m away, an 8-minute walk, and the Moillesulaz crossing 1.8 km away.$r$ IN content_en) = 0;

-- [93/175] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · D7 · L76 : « Un tram Annemasse-Genève est prévu pour 2027 » (faux) → prolongement du tram 17 dans Annemasse fin 2026 (Annemasse Agglo)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$- Un **tram Annemasse-Genève** est prévu pour **2027**, en plus du Tram 17 déjà direct sur Genève.$f$, $r$- Le **Tram 17**, déjà direct sur Genève, est **prolongé dans Annemasse fin 2026** (trois nouveaux arrêts, Annemasse Agglo).$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$- Un **tram Annemasse-Genève** est prévu pour **2027**, en plus du Tram 17 déjà direct sur Genève.$f$ IN content_fr) > 0
  AND position($r$- Le **Tram 17**, déjà direct sur Genève, est **prolongé dans Annemasse fin 2026** (trois nouveaux arrêts, Annemasse Agglo).$r$ IN content_fr) = 0;

-- [94/175] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · D7 · L81: “An Annemasse-Geneva tram is planned for 2027” (wrong) → tram 17 extended into Annemasse at the end of 2026 (Annemasse Agglo)
UPDATE blog_posts
SET content_en = replace(content_en, $f$- An **Annemasse-Geneva tram** is planned for **2027**.$f$, $r$- **Tram 17**, already direct to Geneva, is **extended into Annemasse at the end of 2026** (three new stops, Annemasse Agglo).$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$- An **Annemasse-Geneva tram** is planned for **2027**.$f$ IN content_en) > 0
  AND position($r$- **Tram 17**, already direct to Geneva, is **extended into Annemasse at the end of 2026** (three new stops, Annemasse Agglo).$r$ IN content_en) = 0;

-- [95/175] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · D1 · L83 tableau récapitulatif : « Annemasse | 15-20 min » (mode non précisé) → deux nombres (D1.3, maison nommée) : Genève-Eaux-Vives en 7 min de Léman Express, 18 min porte-à-porte depuis Le Lodge
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$| Annemasse | 15-20 min |$f$, $r$| Annemasse | Genève-Eaux-Vives en 7 min de Léman Express, 18 min porte-à-porte depuis Le Lodge |$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$| Annemasse | 15-20 min |$f$ IN content_fr) > 0
  AND position($r$| Annemasse | Genève-Eaux-Vives en 7 min de Léman Express, 18 min porte-à-porte depuis Le Lodge |$r$ IN content_fr) = 0;

-- [96/175] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · D1 · L88 summary table: “Annemasse | 15-20 min” (no mode) → two numbers (D1.3, house named): Geneva Eaux-Vives in 7 min by Léman Express, 18 min door to door from Le Lodge
UPDATE blog_posts
SET content_en = replace(content_en, $f$| Annemasse | 15-20 min |$f$, $r$| Annemasse | Geneva Eaux-Vives in 7 min by Léman Express, 18 min door to door from Le Lodge |$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$| Annemasse | 15-20 min |$f$ IN content_en) > 0
  AND position($r$| Annemasse | Geneva Eaux-Vives in 7 min by Léman Express, 18 min door to door from Le Lodge |$r$ IN content_en) = 0;

-- [97/175] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · D1 · L84 tableau récapitulatif : « Ville-la-Grand | 12-20 min » → deux nombres (D1.3, maison nommée) : Genève-Eaux-Vives en 7 min de Léman Express, 22 min porte-à-porte depuis La Villa
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$| **Ville-la-Grand** | **12-20 min** |$f$, $r$| **Ville-la-Grand** | **Genève-Eaux-Vives en 7 min de Léman Express, 22 min porte-à-porte depuis La Villa** |$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$| **Ville-la-Grand** | **12-20 min** |$f$ IN content_fr) > 0
  AND position($r$| **Ville-la-Grand** | **Genève-Eaux-Vives en 7 min de Léman Express, 22 min porte-à-porte depuis La Villa** |$r$ IN content_fr) = 0;

-- [98/175] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · D1 · L89 summary table: “Ville-la-Grand | 12-20 min” → two numbers (D1.3, house named): Geneva Eaux-Vives in 7 min by Léman Express, 22 min door to door from La Villa
UPDATE blog_posts
SET content_en = replace(content_en, $f$| **Ville-la-Grand** | **12-20 min** |$f$, $r$| **Ville-la-Grand** | **Geneva Eaux-Vives in 7 min by Léman Express, 22 min door to door from La Villa** |$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$| **Ville-la-Grand** | **12-20 min** |$f$ IN content_en) > 0
  AND position($r$| **Ville-la-Grand** | **Geneva Eaux-Vives in 7 min by Léman Express, 22 min door to door from La Villa** |$r$ IN content_en) = 0;

-- [99/175] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · D7 · L107 : « les bus transfrontaliers TPG/TPN » → TPG (TPN = réseau de Nyon)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$les bus transfrontaliers TPG/TPN$f$, $r$les bus transfrontaliers TPG$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$les bus transfrontaliers TPG/TPN$f$ IN content_fr) > 0;

-- [100/175] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · D7 · L109: “the cross-border TPG/TPN buses” → TPG (TPN = Nyon network)
UPDATE blog_posts
SET content_en = replace(content_en, $f$the cross-border TPG/TPN buses$f$, $r$the cross-border TPG buses$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$the cross-border TPG/TPN buses$f$ IN content_en) > 0
  AND position($r$the cross-border TPG buses$r$ IN content_en) = 0;

-- [101/175] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · D1 · L109 (absent en EN) : « 3 maisons côté France, à 20 minutes du centre de Genève porte à porte » → STATS_DISPLAY.distance
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$3 maisons côté France, à 20 minutes du centre de Genève porte à porte, chambre meublée$f$, $r$3 maisons côté France, à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, chambre meublée$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$3 maisons côté France, à 20 minutes du centre de Genève porte à porte, chambre meublée$f$ IN content_fr) > 0
  AND position($r$3 maisons côté France, à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, chambre meublée$r$ IN content_fr) = 0;

-- [102/175] coliving-annemasse-geneve-frontaliers-avantages (fr) · D1 · L12 : « Située à seulement 20 minutes de Genève en Léman Express » (destination vague) → 7 minutes de Genève-Eaux-Vives depuis sa gare
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Située à seulement 20 minutes de Genève en [Léman Express](https://www.lemanexpress.com/), **Annemasse**$f$, $r$Située à 7 minutes de Genève-Eaux-Vives en [Léman Express](https://www.lemanexpress.com/) depuis sa gare, **Annemasse**$r$),
    updated_at = now()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages'
  AND position($f$Située à seulement 20 minutes de Genève en [Léman Express](https://www.lemanexpress.com/), **Annemasse**$f$ IN content_fr) > 0
  AND position($r$Située à 7 minutes de Genève-Eaux-Vives en [Léman Express](https://www.lemanexpress.com/) depuis sa gare, **Annemasse**$r$ IN content_fr) = 0;

-- [103/175] coliving-annemasse-geneve-frontaliers-avantages (en) · D1 · L11: “Located just 20 minutes from Geneva on the Léman Express” (vague destination) → 7 minutes from Geneva Eaux-Vives from its station
UPDATE blog_posts
SET content_en = replace(content_en, $f$Located just 20 minutes from Geneva on the [Léman Express](https://www.lemanexpress.com/), **Annemasse**$f$, $r$Located 7 minutes from Geneva Eaux-Vives by [Léman Express](https://www.lemanexpress.com/) from its station, **Annemasse**$r$),
    updated_at = now()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages'
  AND position($f$Located just 20 minutes from Geneva on the [Léman Express](https://www.lemanexpress.com/), **Annemasse**$f$ IN content_en) > 0
  AND position($r$Located 7 minutes from Geneva Eaux-Vives by [Léman Express](https://www.lemanexpress.com/) from its station, **Annemasse**$r$ IN content_en) = 0;

-- [104/175] coliving-annemasse-geneve-frontaliers-avantages (fr) · D1 · L97 : « 20 minutes du centre de Genève en Léman Express » (forme interdite par D1) → libellé de marque
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$- **20 minutes** du centre de Genève en Léman Express$f$, $r$- **20 min** de Genève-Eaux-Vives en Léman Express, porte-à-porte$r$),
    updated_at = now()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages'
  AND position($f$- **20 minutes** du centre de Genève en Léman Express$f$ IN content_fr) > 0
  AND position($r$- **20 min** de Genève-Eaux-Vives en Léman Express, porte-à-porte$r$ IN content_fr) = 0;

-- [105/175] coliving-annemasse-geneve-frontaliers-avantages (en) · D1 · L96: “20 minutes from Geneva center on the Léman Express” (wording forbidden by D1) → brand wording
UPDATE blog_posts
SET content_en = replace(content_en, $f$- **20 minutes** from Geneva center on the Léman Express$f$, $r$- **20 min** from Geneva Eaux-Vives by Léman Express, door to door$r$),
    updated_at = now()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages'
  AND position($f$- **20 minutes** from Geneva center on the Léman Express$f$ IN content_en) > 0
  AND position($r$- **20 min** from Geneva Eaux-Vives by Léman Express, door to door$r$ IN content_en) = 0;

-- [106/175] coliving-annemasse-geneve-frontaliers-avantages (fr) · D1 · L183 : « Et Genève, à quelques minutes » (non qualifié) → 7 minutes de Léman Express depuis la gare d'Annemasse
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Et Genève, à quelques minutes, enrichit encore l'offre$f$, $r$Et Genève, à 7 minutes de Léman Express depuis la gare d'Annemasse, enrichit encore l'offre$r$),
    updated_at = now()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages'
  AND position($f$Et Genève, à quelques minutes, enrichit encore l'offre$f$ IN content_fr) > 0
  AND position($r$Et Genève, à 7 minutes de Léman Express depuis la gare d'Annemasse, enrichit encore l'offre$r$ IN content_fr) = 0;

-- [107/175] coliving-annemasse-geneve-frontaliers-avantages (en) · D1 · L182: “And Geneva, just minutes away” (unqualified) → 7 minutes away by Léman Express from Annemasse station
UPDATE blog_posts
SET content_en = replace(content_en, $f$And Geneva, just minutes away, enriches the offering even further$f$, $r$And Geneva, 7 minutes away by Léman Express from Annemasse station, enriches the offering even further$r$),
    updated_at = now()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages'
  AND position($f$And Geneva, just minutes away, enriches the offering even further$f$ IN content_en) > 0
  AND position($r$And Geneva, 7 minutes away by Léman Express from Annemasse station, enriches the offering even further$r$ IN content_en) = 0;

-- [108/175] guide-ressources-frontalier-geneve (fr) · D1 · L392 : « à une vingtaine de minutes de Genève, côté France » (non qualifié) → formule D1 (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$des maisons de chambres meublées tout inclus à une vingtaine de minutes de Genève, côté France, pensées pour$f$, $r$des maisons de chambres meublées tout inclus côté France (Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre), pensées pour$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$des maisons de chambres meublées tout inclus à une vingtaine de minutes de Genève, côté France, pensées pour$f$ IN content_fr) > 0
  AND position($r$des maisons de chambres meublées tout inclus côté France (Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre), pensées pour$r$ IN content_fr) = 0;

-- [109/175] guide-ressources-frontalier-geneve (en) · D1 · L390: “about twenty minutes from Geneva, on the French side” (unqualified) → D1 formula (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_en = replace(content_en, $f$a set of houses with all-inclusive furnished rooms about twenty minutes from Geneva, on the French side, designed for$f$, $r$a set of houses with all-inclusive furnished rooms on the French side (Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre), designed for$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$a set of houses with all-inclusive furnished rooms about twenty minutes from Geneva, on the French side, designed for$f$ IN content_en) > 0
  AND position($r$a set of houses with all-inclusive furnished rooms on the French side (Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre), designed for$r$ IN content_en) = 0;

-- [110/175] guide-ressources-frontalier-geneve (fr) · D1 · L217 tableau des modes : « Léman Express | ~115 CHF | ~20 min » (destination absente, « ~ ») → 7 min (Genève-Eaux-Vives), 23 min (Cornavin), comme temps-trajet et transport (relecture du 09/10)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$| Léman Express | ~115 CHF | ~20 min | Très élevée |$f$, $r$| Léman Express | ~115 CHF | 7 min (Genève-Eaux-Vives), 23 min (Cornavin) | Très élevée |$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$| Léman Express | ~115 CHF | ~20 min | Très élevée |$f$ IN content_fr) > 0
  AND position($r$| Léman Express | ~115 CHF | 7 min (Genève-Eaux-Vives), 23 min (Cornavin) | Très élevée |$r$ IN content_fr) = 0;

-- [111/175] guide-ressources-frontalier-geneve (en) · D1 · L215 modes table: “Léman Express | ~115 CHF | ~20 min” (no destination, “~”) → 7 min (Geneva Eaux-Vives), 23 min (Cornavin), as in temps-trajet and transport (review of 9 Oct.)
UPDATE blog_posts
SET content_en = replace(content_en, $f$| Léman Express | ~115 CHF | ~20 min | Very high |$f$, $r$| Léman Express | ~115 CHF | 7 min (Geneva Eaux-Vives), 23 min (Cornavin) | Very high |$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$| Léman Express | ~115 CHF | ~20 min | Very high |$f$ IN content_en) > 0
  AND position($r$| Léman Express | ~115 CHF | 7 min (Geneva Eaux-Vives), 23 min (Cornavin) | Very high |$r$ IN content_en) = 0;

-- [112/175] guide-ressources-frontalier-geneve (fr) · D1 · L253 tableau par destination : « Centre (Cornavin) | Léman Express direct | ~22 min » → 23 min de train, 35 à 40 min porte-à-porte selon la maison
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$| Centre (Cornavin) | Léman Express direct | ~22 min |$f$, $r$| Centre (Cornavin) | Léman Express direct | 23 min de train, 35 à 40 min porte-à-porte selon la maison |$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$| Centre (Cornavin) | Léman Express direct | ~22 min |$f$ IN content_fr) > 0
  AND position($r$| Centre (Cornavin) | Léman Express direct | 23 min de train, 35 à 40 min porte-à-porte selon la maison |$r$ IN content_fr) = 0;

-- [113/175] guide-ressources-frontalier-geneve (en) · D1 · L251 destination table: “Centre (Cornavin) | Léman Express direct | ~22 min” → 23 min by train, 35 to 40 min door to door depending on the house
UPDATE blog_posts
SET content_en = replace(content_en, $f$| Centre (Cornavin) | Léman Express direct | ~22 min |$f$, $r$| Centre (Cornavin) | Léman Express direct | 23 min by train, 35 to 40 min door to door depending on the house |$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$| Centre (Cornavin) | Léman Express direct | ~22 min |$f$ IN content_en) > 0
  AND position($r$| Centre (Cornavin) | Léman Express direct | 23 min by train, 35 to 40 min door to door depending on the house |$r$ IN content_en) = 0;

-- [114/175] guide-ressources-frontalier-geneve (fr) · D1 · L257 tableau : ligne « Aéroport / Palexpo | … | ~30 min » retirée (temps vers l'aéroport, règle D1 de Jérôme) ; la ligne CERN sert de contexte
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$| CERN (Meyrin) | Léman Express → Cornavin + tram 18 | 50 à 55 min |
| Aéroport / Palexpo | Léman Express direct depuis Annemasse | ~30 min |$f$, $r$| CERN (Meyrin) | Léman Express → Cornavin + tram 18 | 50 à 55 min |$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$| CERN (Meyrin) | Léman Express → Cornavin + tram 18 | 50 à 55 min |
| Aéroport / Palexpo | Léman Express direct depuis Annemasse | ~30 min |$f$ IN content_fr) > 0;

-- [115/175] guide-ressources-frontalier-geneve (en) · D1 · L255 table: row “Airport / Palexpo | … | ~30 min” removed (airport time, Jérôme's D1 rule); the CERN row is the context
UPDATE blog_posts
SET content_en = replace(content_en, $f$| CERN (Meyrin) | Léman Express → Cornavin + tram 18 | 50 to 55 min |
| Airport / Palexpo | Léman Express direct from Annemasse | ~30 min |$f$, $r$| CERN (Meyrin) | Léman Express → Cornavin + tram 18 | 50 to 55 min |$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$| CERN (Meyrin) | Léman Express → Cornavin + tram 18 | 50 to 55 min |
| Airport / Palexpo | Léman Express direct from Annemasse | ~30 min |$f$ IN content_en) > 0;

-- [116/175] organisations-internationales-geneve-ou-habiter (fr) · D1 · L6 : « côté France, à 20-30 minutes de trajet » (non qualifié) → STATS_DISPLAY.distance
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$La réponse pragmatique : côté France, à 20-30 minutes de trajet.$f$, $r$La réponse pragmatique : côté France, à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte.$r$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($f$La réponse pragmatique : côté France, à 20-30 minutes de trajet.$f$ IN content_fr) > 0
  AND position($r$La réponse pragmatique : côté France, à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte.$r$ IN content_fr) = 0;

-- [117/175] organisations-internationales-geneve-ou-habiter (en) · D1 · L5: “on the French side, 20-30 minutes away” (unqualified) → STATS_DISPLAY.distance
UPDATE blog_posts
SET content_en = replace(content_en, $f$The pragmatic answer: on the French side, 20-30 minutes away.$f$, $r$The pragmatic answer: on the French side, 20 min from Geneva Eaux-Vives by Léman Express, door to door.$r$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($f$The pragmatic answer: on the French side, 20-30 minutes away.$f$ IN content_en) > 0
  AND position($r$The pragmatic answer: on the French side, 20 min from Geneva Eaux-Vives by Léman Express, door to door.$r$ IN content_en) = 0;

-- [118/175] organisations-internationales-geneve-ou-habiter (fr) · D1 · L20 : « la gare de Cornavin (22 min en Léman Express depuis Annemasse) » → 23 min
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$la gare de Cornavin (22 min en Léman Express depuis Annemasse)$f$, $r$la gare de Cornavin (23 min en Léman Express depuis Annemasse)$r$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($f$la gare de Cornavin (22 min en Léman Express depuis Annemasse)$f$ IN content_fr) > 0
  AND position($r$la gare de Cornavin (23 min en Léman Express depuis Annemasse)$r$ IN content_fr) = 0;

-- [119/175] organisations-internationales-geneve-ou-habiter (en) · D1 · L19: “Cornavin station (22 min by Léman Express from Annemasse)” → 23 min
UPDATE blog_posts
SET content_en = replace(content_en, $f$Cornavin station (22 min by Léman Express from Annemasse)$f$, $r$Cornavin station (23 min by Léman Express from Annemasse)$r$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($f$Cornavin station (22 min by Léman Express from Annemasse)$f$ IN content_en) > 0
  AND position($r$Cornavin station (23 min by Léman Express from Annemasse)$r$ IN content_en) = 0;

-- [120/175] organisations-internationales-geneve-ou-habiter (fr) · D1 · L75 (absent en EN) : « côté France à 20 minutes du centre de Genève porte à porte » → STATS_DISPLAY.distance
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$côté France à 20 minutes du centre de Genève porte à porte.$f$, $r$côté France, à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte.$r$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($f$côté France à 20 minutes du centre de Genève porte à porte.$f$ IN content_fr) > 0
  AND position($r$côté France, à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte.$r$ IN content_fr) = 0;

-- [121/175] espaces-verts-coliving-lodge-annemasse (fr) · D1 · L26 : « un vrai jardin à 20 minutes de Genève » (non qualifié) → STATS_DISPLAY.distance
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$un vrai jardin à 20 minutes de Genève —$f$, $r$un vrai jardin à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte —$r$),
    updated_at = now()
WHERE slug = 'espaces-verts-coliving-lodge-annemasse'
  AND position($f$un vrai jardin à 20 minutes de Genève —$f$ IN content_fr) > 0
  AND position($r$un vrai jardin à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte —$r$ IN content_fr) = 0;

-- [122/175] espaces-verts-coliving-lodge-annemasse (en) · D1 · L25: “a real garden 20 minutes from Geneva” (unqualified) → STATS_DISPLAY.distance
UPDATE blog_posts
SET content_en = replace(content_en, $f$a real garden 20 minutes from Geneva —$f$, $r$a real garden 20 min from Geneva Eaux-Vives by Léman Express, door to door —$r$),
    updated_at = now()
WHERE slug = 'espaces-verts-coliving-lodge-annemasse'
  AND position($f$a real garden 20 minutes from Geneva —$f$ IN content_en) > 0
  AND position($r$a real garden 20 min from Geneva Eaux-Vives by Léman Express, door to door —$r$ IN content_en) = 0;

-- [123/175] espaces-verts-coliving-lodge-annemasse (fr) · D1 · L32 : « - À 20 minutes de Genève, côté France. » → STATS_DISPLAY.distance
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$- À 20 minutes de Genève, côté France.$f$, $r$- À 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, côté France.$r$),
    updated_at = now()
WHERE slug = 'espaces-verts-coliving-lodge-annemasse'
  AND position($f$- À 20 minutes de Genève, côté France.$f$ IN content_fr) > 0
  AND position($r$- À 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, côté France.$r$ IN content_fr) = 0;

-- [124/175] espaces-verts-coliving-lodge-annemasse (en) · D1 · L31: “- 20 minutes from Geneva, on the French side.” → STATS_DISPLAY.distance
UPDATE blog_posts
SET content_en = replace(content_en, $f$- 20 minutes from Geneva, on the French side.$f$, $r$- 20 min from Geneva Eaux-Vives by Léman Express, door to door, on the French side.$r$),
    updated_at = now()
WHERE slug = 'espaces-verts-coliving-lodge-annemasse'
  AND position($f$- 20 minutes from Geneva, on the French side.$f$ IN content_en) > 0
  AND position($r$- 20 min from Geneva Eaux-Vives by Léman Express, door to door, on the French side.$r$ IN content_en) = 0;

-- [125/175] budget-colocation-geneve-guide-complet (fr) · D1 · L4 : « vivre confortablement à 20 minutes de Genève » (non qualifié) → STATS_DISPLAY.distance
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$pour vivre confortablement à 20 minutes de Genève, par exemple$f$, $r$pour vivre confortablement à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, par exemple$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$pour vivre confortablement à 20 minutes de Genève, par exemple$f$ IN content_fr) > 0
  AND position($r$pour vivre confortablement à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, par exemple$r$ IN content_fr) = 0;

-- [126/175] budget-colocation-geneve-guide-complet (en) · D1 · L3: “living comfortably 20 minutes door-to-door from Geneva” (destination vague) → STATS_DISPLAY.distance
UPDATE blog_posts
SET content_en = replace(content_en, $f$for living comfortably 20 minutes door-to-door from Geneva.$f$, $r$for living comfortably 20 min from Geneva Eaux-Vives by Léman Express, door to door.$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$for living comfortably 20 minutes door-to-door from Geneva.$f$ IN content_en) > 0
  AND position($r$for living comfortably 20 min from Geneva Eaux-Vives by Léman Express, door to door.$r$ IN content_en) = 0;

-- [127/175] budget-colocation-geneve-guide-complet (fr) · D1 · L31 : « Annemasse↔Genève Cornavin en 20 minutes » → Eaux-Vives 7 / Cornavin 23 (lien conservé)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[Annemasse↔Genève Cornavin en 20 minutes, directement](https://www.lemanexpress.com/)$f$, $r$[Annemasse↔Genève-Eaux-Vives en 7 minutes, Cornavin en 23, directement](https://www.lemanexpress.com/)$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$[Annemasse↔Genève Cornavin en 20 minutes, directement](https://www.lemanexpress.com/)$f$ IN content_fr) > 0
  AND position($r$[Annemasse↔Genève-Eaux-Vives en 7 minutes, Cornavin en 23, directement](https://www.lemanexpress.com/)$r$ IN content_fr) = 0;

-- [128/175] budget-colocation-geneve-guide-complet (en) · D1 · L24: “Léman Express connecting Annemasse to Geneva Cornavin in 20 minutes” → Eaux-Vives 7 / Cornavin 23 (link kept)
UPDATE blog_posts
SET content_en = replace(content_en, $f$[Léman Express connecting Annemasse to Geneva Cornavin in 20 minutes](https://www.lemanexpress.com/en/)$f$, $r$[Léman Express connecting Annemasse to Geneva Eaux-Vives in 7 minutes and Cornavin in 23](https://www.lemanexpress.com/en/)$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$[Léman Express connecting Annemasse to Geneva Cornavin in 20 minutes](https://www.lemanexpress.com/en/)$f$ IN content_en) > 0
  AND position($r$[Léman Express connecting Annemasse to Geneva Eaux-Vives in 7 minutes and Cornavin in 23](https://www.lemanexpress.com/en/)$r$ IN content_en) = 0;

-- [129/175] budget-colocation-geneve-guide-complet (fr) · D1 · L33 (absent en EN) : « On parle de 20 minutes de trajet » (non qualifié) → le « 20 min » de marque sous sa forme canonique (STATS_DISPLAY.distance)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$On parle de 20 minutes de trajet, pas de 2 heures.$f$, $r$On parle de 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte — pas de 2 heures.$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$On parle de 20 minutes de trajet, pas de 2 heures.$f$ IN content_fr) > 0
  AND position($r$On parle de 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte — pas de 2 heures.$r$ IN content_fr) = 0;

-- [130/175] budget-colocation-geneve-guide-complet (fr) · D1 · L131 : « accès direct Genève en 20 min » (destination vague) → Genève-Eaux-Vives en 7 min et Cornavin en 23 min de Léman Express
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$accès direct Genève en 20 min.$f$, $r$Genève-Eaux-Vives en 7 min et Cornavin en 23 min de Léman Express.$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$accès direct Genève en 20 min.$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min et Cornavin en 23 min de Léman Express.$r$ IN content_fr) = 0;

-- [131/175] budget-colocation-geneve-guide-complet (en) · D1 · L96: “with direct Geneva access in 20 min” (vague destination) → Geneva Eaux-Vives in 7 min and Cornavin in 23 min by Léman Express
UPDATE blog_posts
SET content_en = replace(content_en, $f$with direct Geneva access in 20 min.$f$, $r$with Geneva Eaux-Vives in 7 min and Cornavin in 23 min by Léman Express.$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$with direct Geneva access in 20 min.$f$ IN content_en) > 0
  AND position($r$with Geneva Eaux-Vives in 7 min and Cornavin in 23 min by Léman Express.$r$ IN content_en) = 0;

-- [132/175] cout-transport-frontalier-geneve-2026 (fr) · D1 · L46 : « relie Annemasse à Genève en 20 minutes » (destination vague) → Genève-Eaux-Vives en 7 minutes et Cornavin en 23 ; cadence 10 lue dans TRANSIT
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$relie Annemasse à Genève en 20 minutes, avec des trains toutes les 10 minutes en pointe$f$, $r$relie Annemasse à Genève-Eaux-Vives en 7 minutes et à Cornavin en 23, avec des trains toutes les 10 minutes en pointe$r$),
    updated_at = now()
WHERE slug = 'cout-transport-frontalier-geneve-2026'
  AND position($f$relie Annemasse à Genève en 20 minutes, avec des trains toutes les 10 minutes en pointe$f$ IN content_fr) > 0
  AND position($r$relie Annemasse à Genève-Eaux-Vives en 7 minutes et à Cornavin en 23, avec des trains toutes les 10 minutes en pointe$r$ IN content_fr) = 0;

-- [133/175] cout-transport-frontalier-geneve-2026 (en) · D1 · L45: “connects Annemasse to Geneva in 20 minutes” (vague destination) → Geneva Eaux-Vives in 7 minutes and Cornavin in 23; headway 10 read from TRANSIT
UPDATE blog_posts
SET content_en = replace(content_en, $f$connects Annemasse to Geneva in 20 minutes, with trains every 10 minutes during rush hour$f$, $r$connects Annemasse to Geneva Eaux-Vives in 7 minutes and Cornavin in 23, with trains every 10 minutes during rush hour$r$),
    updated_at = now()
WHERE slug = 'cout-transport-frontalier-geneve-2026'
  AND position($f$connects Annemasse to Geneva in 20 minutes, with trains every 10 minutes during rush hour$f$ IN content_en) > 0
  AND position($r$connects Annemasse to Geneva Eaux-Vives in 7 minutes and Cornavin in 23, with trains every 10 minutes during rush hour$r$ IN content_en) = 0;

-- [134/175] cout-transport-frontalier-geneve-2026 (fr) · D1 · L100 : « toutes à moins de 10 minutes de la gare d'Annemasse » (faux pour deux maisons, mode non précisé) → 10, 14 et 18 minutes à pied
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Les trois maisons de La Villa Coliving sont toutes à moins de 10 minutes de la gare d'Annemasse.$f$, $r$Les trois maisons de La Villa Coliving sont à 10, 14 et 18 minutes à pied de la gare d'Annemasse (Le Lodge, La Villa, Le Loft).$r$),
    updated_at = now()
WHERE slug = 'cout-transport-frontalier-geneve-2026'
  AND position($f$Les trois maisons de La Villa Coliving sont toutes à moins de 10 minutes de la gare d'Annemasse.$f$ IN content_fr) > 0
  AND position($r$Les trois maisons de La Villa Coliving sont à 10, 14 et 18 minutes à pied de la gare d'Annemasse (Le Lodge, La Villa, Le Loft).$r$ IN content_fr) = 0;

-- [135/175] cout-transport-frontalier-geneve-2026 (en) · D1 · L99: “all within 10 minutes of Annemasse station” (wrong for two houses, no mode) → a 10, 14 and 18-minute walk
UPDATE blog_posts
SET content_en = replace(content_en, $f$La Villa Coliving's three houses are all within 10 minutes of Annemasse station.$f$, $r$La Villa Coliving's three houses are a 10, 14 and 18-minute walk from Annemasse station (Le Lodge, La Villa, Le Loft).$r$),
    updated_at = now()
WHERE slug = 'cout-transport-frontalier-geneve-2026'
  AND position($f$La Villa Coliving's three houses are all within 10 minutes of Annemasse station.$f$ IN content_en) > 0
  AND position($r$La Villa Coliving's three houses are a 10, 14 and 18-minute walk from Annemasse station (Le Lodge, La Villa, Le Loft).$r$ IN content_en) = 0;

-- [136/175] cout-de-la-vie-suisse-france-frontalier-2026 (fr) · D1 · L12 : « qu'à Annemasse, à 20 minutes de là » (non qualifié) → 7 minutes de Genève-Eaux-Vives en Léman Express
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$qu'à Annemasse, à 20 minutes de là.$f$, $r$qu'à Annemasse, à 7 minutes de Genève-Eaux-Vives en Léman Express.$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$qu'à Annemasse, à 20 minutes de là.$f$ IN content_fr) > 0
  AND position($r$qu'à Annemasse, à 7 minutes de Genève-Eaux-Vives en Léman Express.$r$ IN content_fr) = 0;

-- [137/175] cout-de-la-vie-suisse-france-frontalier-2026 (en) · D1 · L11: “than in Annemasse, 20 minutes away” (unqualified) → 7 minutes from Geneva Eaux-Vives by Léman Express
UPDATE blog_posts
SET content_en = replace(content_en, $f$than in Annemasse, 20 minutes away.$f$, $r$than in Annemasse, 7 minutes from Geneva Eaux-Vives by Léman Express.$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$than in Annemasse, 20 minutes away.$f$ IN content_en) > 0
  AND position($r$than in Annemasse, 7 minutes from Geneva Eaux-Vives by Léman Express.$r$ IN content_en) = 0;

-- [138/175] cout-de-la-vie-suisse-france-frontalier-2026 (fr) · D1 · L113 ancre : « colocation tout inclus à 20 min de Genève » → le « 20 min » de marque sous sa forme canonique (STATS_DISPLAY.distance)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[colocation tout inclus à 20 min de Genève](/blog/trouver-colocation-geneve-frontalier)$f$, $r$[colocation tout inclus à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte](/blog/trouver-colocation-geneve-frontalier)$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$[colocation tout inclus à 20 min de Genève](/blog/trouver-colocation-geneve-frontalier)$f$ IN content_fr) > 0
  AND position($r$[colocation tout inclus à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte](/blog/trouver-colocation-geneve-frontalier)$r$ IN content_fr) = 0;

-- [139/175] cout-de-la-vie-suisse-france-frontalier-2026 (en) · D1 · L112 anchor: “all-inclusive coliving 20 min from Geneva” → the brand “20 min” in its canonical form (STATS_DISPLAY.distance)
UPDATE blog_posts
SET content_en = replace(content_en, $f$[all-inclusive coliving 20 min from Geneva](/en/colocation-geneve)$f$, $r$[all-inclusive coliving 20 min from Geneva Eaux-Vives by Léman Express, door to door](/en/colocation-geneve)$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$[all-inclusive coliving 20 min from Geneva](/en/colocation-geneve)$f$ IN content_en) > 0
  AND position($r$[all-inclusive coliving 20 min from Geneva Eaux-Vives by Léman Express, door to door](/en/colocation-geneve)$r$ IN content_en) = 0;

-- [140/175] allocations-familiales-frontalier-geneve-2026 (fr) · D1 · ancre de lien « coliving tout inclus à 20 min de Genève » → le « 20 min » de marque sous sa forme canonique (STATS_DISPLAY.distance, D1)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[coliving tout inclus à 20 min de Genève](/blog/trouver-colocation-geneve-frontalier)$f$, $r$[coliving tout inclus à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte](/blog/trouver-colocation-geneve-frontalier)$r$),
    updated_at = now()
WHERE slug = 'allocations-familiales-frontalier-geneve-2026'
  AND position($f$[coliving tout inclus à 20 min de Genève](/blog/trouver-colocation-geneve-frontalier)$f$ IN content_fr) > 0
  AND position($r$[coliving tout inclus à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte](/blog/trouver-colocation-geneve-frontalier)$r$ IN content_fr) = 0;

-- [141/175] allocations-familiales-frontalier-geneve-2026 (en) · D1 · link anchor “all-inclusive coliving 20 min from Geneva” → the brand “20 min” in its canonical form (STATS_DISPLAY.distance, D1)
UPDATE blog_posts
SET content_en = replace(content_en, $f$[all-inclusive coliving 20 min from Geneva](/en/colocation-geneve)$f$, $r$[all-inclusive coliving 20 min from Geneva Eaux-Vives by Léman Express, door to door](/en/colocation-geneve)$r$),
    updated_at = now()
WHERE slug = 'allocations-familiales-frontalier-geneve-2026'
  AND position($f$[all-inclusive coliving 20 min from Geneva](/en/colocation-geneve)$f$ IN content_en) > 0
  AND position($r$[all-inclusive coliving 20 min from Geneva Eaux-Vives by Léman Express, door to door](/en/colocation-geneve)$r$ IN content_en) = 0;

-- [142/175] ecole-internationale-geneve-frontalier-ou-habiter (fr) · D1 · ancre de lien « coliving tout inclus à 20 min de Genève » → le « 20 min » de marque sous sa forme canonique (STATS_DISPLAY.distance, D1)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[coliving tout inclus à 20 min de Genève](/blog/trouver-colocation-geneve-frontalier)$f$, $r$[coliving tout inclus à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte](/blog/trouver-colocation-geneve-frontalier)$r$),
    updated_at = now()
WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
  AND position($f$[coliving tout inclus à 20 min de Genève](/blog/trouver-colocation-geneve-frontalier)$f$ IN content_fr) > 0
  AND position($r$[coliving tout inclus à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte](/blog/trouver-colocation-geneve-frontalier)$r$ IN content_fr) = 0;

-- [143/175] ecole-internationale-geneve-frontalier-ou-habiter (en) · D1 · link anchor “all-inclusive coliving 20 min from Geneva” → the brand “20 min” in its canonical form (STATS_DISPLAY.distance, D1)
UPDATE blog_posts
SET content_en = replace(content_en, $f$[all-inclusive coliving 20 min from Geneva](/en/colocation-geneve)$f$, $r$[all-inclusive coliving 20 min from Geneva Eaux-Vives by Léman Express, door to door](/en/colocation-geneve)$r$),
    updated_at = now()
WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
  AND position($f$[all-inclusive coliving 20 min from Geneva](/en/colocation-geneve)$f$ IN content_en) > 0
  AND position($r$[all-inclusive coliving 20 min from Geneva Eaux-Vives by Léman Express, door to door](/en/colocation-geneve)$r$ IN content_en) = 0;

-- [144/175] quitter-son-logement-guide-pratique (fr) · D1 · ancre de lien « coliving tout inclus à 20 min de Genève » → le « 20 min » de marque sous sa forme canonique (STATS_DISPLAY.distance, D1)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[coliving tout inclus à 20 min de Genève](/blog/trouver-colocation-geneve-frontalier)$f$, $r$[coliving tout inclus à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte](/blog/trouver-colocation-geneve-frontalier)$r$),
    updated_at = now()
WHERE slug = 'quitter-son-logement-guide-pratique'
  AND position($f$[coliving tout inclus à 20 min de Genève](/blog/trouver-colocation-geneve-frontalier)$f$ IN content_fr) > 0
  AND position($r$[coliving tout inclus à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte](/blog/trouver-colocation-geneve-frontalier)$r$ IN content_fr) = 0;

-- [145/175] quitter-son-logement-guide-pratique (en) · D1 · link anchor “all-inclusive coliving 20 min from Geneva” → the brand “20 min” in its canonical form (STATS_DISPLAY.distance, D1)
UPDATE blog_posts
SET content_en = replace(content_en, $f$[all-inclusive coliving 20 min from Geneva](/en/colocation-geneve)$f$, $r$[all-inclusive coliving 20 min from Geneva Eaux-Vives by Léman Express, door to door](/en/colocation-geneve)$r$),
    updated_at = now()
WHERE slug = 'quitter-son-logement-guide-pratique'
  AND position($f$[all-inclusive coliving 20 min from Geneva](/en/colocation-geneve)$f$ IN content_en) > 0
  AND position($r$[all-inclusive coliving 20 min from Geneva Eaux-Vives by Léman Express, door to door](/en/colocation-geneve)$r$ IN content_en) = 0;

-- [146/175] salaire-suisse-net-frontalier-2026 (fr) · D1 · ancre de lien « coliving tout inclus à 20 min de Genève » → le « 20 min » de marque sous sa forme canonique (STATS_DISPLAY.distance, D1)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[coliving tout inclus à 20 min de Genève](/blog/trouver-colocation-geneve-frontalier)$f$, $r$[coliving tout inclus à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte](/blog/trouver-colocation-geneve-frontalier)$r$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($f$[coliving tout inclus à 20 min de Genève](/blog/trouver-colocation-geneve-frontalier)$f$ IN content_fr) > 0
  AND position($r$[coliving tout inclus à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte](/blog/trouver-colocation-geneve-frontalier)$r$ IN content_fr) = 0;

-- [147/175] salaire-suisse-net-frontalier-2026 (en) · D1 · link anchor “all-inclusive coliving 20 min from Geneva” → the brand “20 min” in its canonical form (STATS_DISPLAY.distance, D1)
UPDATE blog_posts
SET content_en = replace(content_en, $f$[all-inclusive coliving 20 min from Geneva](/en/colocation-geneve)$f$, $r$[all-inclusive coliving 20 min from Geneva Eaux-Vives by Léman Express, door to door](/en/colocation-geneve)$r$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($f$[all-inclusive coliving 20 min from Geneva](/en/colocation-geneve)$f$ IN content_en) > 0
  AND position($r$[all-inclusive coliving 20 min from Geneva Eaux-Vives by Léman Express, door to door](/en/colocation-geneve)$r$ IN content_en) = 0;

-- [148/175] permis-g-frontalier-geneve (fr) · D1 · L37 : « une maison à 20 minutes de Genève » (non qualifié) → STATS_DISPLAY.distance
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$dans une maison à 20 minutes de Genève te donne$f$, $r$dans une maison à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte te donne$r$),
    updated_at = now()
WHERE slug = 'permis-g-frontalier-geneve'
  AND position($f$dans une maison à 20 minutes de Genève te donne$f$ IN content_fr) > 0
  AND position($r$dans une maison à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte te donne$r$ IN content_fr) = 0;

-- [149/175] permis-g-frontalier-geneve (en) · D1 · L36: “a house 20 minutes from Geneva” (unqualified) → STATS_DISPLAY.distance
UPDATE blog_posts
SET content_en = replace(content_en, $f$in a house 20 minutes from Geneva gives you$f$, $r$in a house 20 min from Geneva Eaux-Vives by Léman Express, door to door gives you$r$),
    updated_at = now()
WHERE slug = 'permis-g-frontalier-geneve'
  AND position($f$in a house 20 minutes from Geneva gives you$f$ IN content_en) > 0
  AND position($r$in a house 20 min from Geneva Eaux-Vives by Léman Express, door to door gives you$r$ IN content_en) = 0;

-- [150/175] salaire-suisse-net-frontalier-2026 (fr) · D1 · L131 : « vivre côté France à 20 minutes de Genève » (non qualifié) → STATS_DISPLAY.distance
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$vivre côté France à 20 minutes de Genève, c'est$f$, $r$vivre côté France à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, c'est$r$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($f$vivre côté France à 20 minutes de Genève, c'est$f$ IN content_fr) > 0
  AND position($r$vivre côté France à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, c'est$r$ IN content_fr) = 0;

-- [151/175] salaire-suisse-net-frontalier-2026 (en) · D1 · L108: “living on the French side at 20 min from Geneva” (unqualified) → STATS_DISPLAY.distance
UPDATE blog_posts
SET content_en = replace(content_en, $f$living on the French side at 20 min from Geneva is$f$, $r$living on the French side 20 min from Geneva Eaux-Vives by Léman Express, door to door is$r$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($f$living on the French side at 20 min from Geneva is$f$ IN content_en) > 0
  AND position($r$living on the French side 20 min from Geneva Eaux-Vives by Léman Express, door to door is$r$ IN content_en) = 0;

-- [152/175] trouver-colocation-geneve-frontalier (fr) · D1 · L6 : « à 20 minutes du centre en Léman Express » → STATS_DISPLAY.distance
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$— à 20 minutes du centre en Léman Express, pour des loyers$f$, $r$— à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, pour des loyers$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$— à 20 minutes du centre en Léman Express, pour des loyers$f$ IN content_fr) > 0
  AND position($r$— à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, pour des loyers$r$ IN content_fr) = 0;

-- [153/175] trouver-colocation-geneve-frontalier (en) · D1 · L5: “20 minutes from the center by Léman Express” → STATS_DISPLAY.distance
UPDATE blog_posts
SET content_en = replace(content_en, $f$— 20 minutes from the center by Léman Express, for rents$f$, $r$— 20 min from Geneva Eaux-Vives by Léman Express, door to door, for rents$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$— 20 minutes from the center by Léman Express, for rents$f$ IN content_en) > 0
  AND position($r$— 20 min from Geneva Eaux-Vives by Léman Express, door to door, for rents$r$ IN content_en) = 0;

-- [154/175] trouver-colocation-geneve-frontalier (fr) · D1 · L30 : « à 20 minutes de Genève côté France » (non qualifié) → STATS_DISPLAY.distance
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$à 20 minutes de Genève côté France. Tu arrives avec ta valise.$f$, $r$à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, côté France. Tu arrives avec ta valise.$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$à 20 minutes de Genève côté France. Tu arrives avec ta valise.$f$ IN content_fr) > 0
  AND position($r$à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, côté France. Tu arrives avec ta valise.$r$ IN content_fr) = 0;

-- [155/175] trouver-colocation-geneve-frontalier (en) · D1 · L21: “20 minutes from Geneva on the French side” (unqualified) → STATS_DISPLAY.distance
UPDATE blog_posts
SET content_en = replace(content_en, $f$20 minutes from Geneva on the French side. You arrive with your suitcase.$f$, $r$20 min from Geneva Eaux-Vives by Léman Express, door to door, on the French side. You arrive with your suitcase.$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$20 minutes from Geneva on the French side. You arrive with your suitcase.$f$ IN content_en) > 0
  AND position($r$20 min from Geneva Eaux-Vives by Léman Express, door to door, on the French side. You arrive with your suitcase.$r$ IN content_en) = 0;

-- [156/175] trouver-colocation-geneve-frontalier (fr) · D1 · L36 FAQ : « trois maisons situées à 20 minutes du centre de Genève, côté France » (mode non précisé) → STATS_DISPLAY.distance
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$trois maisons situées à 20 minutes du centre de Genève, côté France :$f$, $r$trois maisons situées côté France, à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte :$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$trois maisons situées à 20 minutes du centre de Genève, côté France :$f$ IN content_fr) > 0
  AND position($r$trois maisons situées côté France, à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte :$r$ IN content_fr) = 0;

-- [157/175] trouver-colocation-geneve-frontalier (en) · D1 · L27 FAQ: “three houses located 20 minutes from Geneva city center, on the French side” (no mode) → STATS_DISPLAY.distance
UPDATE blog_posts
SET content_en = replace(content_en, $f$three houses located 20 minutes from Geneva city center, on the French side:$f$, $r$three houses located on the French side, 20 min from Geneva Eaux-Vives by Léman Express, door to door:$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$three houses located 20 minutes from Geneva city center, on the French side:$f$ IN content_en) > 0
  AND position($r$three houses located on the French side, 20 min from Geneva Eaux-Vives by Léman Express, door to door:$r$ IN content_en) = 0;

-- [158/175] trouver-colocation-geneve-frontalier (fr) · D1 · L40 FAQ : « tout en restant à 20 minutes en transports » (mode générique) → STATS_DISPLAY.distance
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$tout en restant à 20 minutes en transports.$f$, $r$tout en restant à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte.$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$tout en restant à 20 minutes en transports.$f$ IN content_fr) > 0
  AND position($r$tout en restant à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte.$r$ IN content_fr) = 0;

-- [159/175] trouver-colocation-geneve-frontalier (en) · D1 · L31 FAQ: “while staying 20 minutes away by public transport” (generic mode) → STATS_DISPLAY.distance
UPDATE blog_posts
SET content_en = replace(content_en, $f$while staying 20 minutes away by public transport.$f$, $r$while staying 20 min from Geneva Eaux-Vives by Léman Express, door to door.$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$while staying 20 minutes away by public transport.$f$ IN content_en) > 0
  AND position($r$while staying 20 min from Geneva Eaux-Vives by Léman Express, door to door.$r$ IN content_en) = 0;

-- [160/175] trouver-colocation-geneve-frontalier (fr) · D1 · L44 FAQ : « à 20 minutes du centre de Genève côté France » (mode non précisé) → STATS_DISPLAY.distance
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$à 20 minutes du centre de Genève côté France, dès$f$, $r$côté France, à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, dès$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$à 20 minutes du centre de Genève côté France, dès$f$ IN content_fr) > 0
  AND position($r$côté France, à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, dès$r$ IN content_fr) = 0;

-- [161/175] trouver-colocation-geneve-frontalier (en) · D1 · L35 FAQ: “20 minutes from Geneva city center on the French side” (no mode) → STATS_DISPLAY.distance
UPDATE blog_posts
SET content_en = replace(content_en, $f$20 minutes from Geneva city center on the French side, from$f$, $r$on the French side, 20 min from Geneva Eaux-Vives by Léman Express, door to door, from$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$20 minutes from Geneva city center on the French side, from$f$ IN content_en) > 0
  AND position($r$on the French side, 20 min from Geneva Eaux-Vives by Léman Express, door to door, from$r$ IN content_en) = 0;

-- [162/175] trouver-colocation-geneve-frontalier (fr) · D1 · L48 « En résumé » : « côté France (20 min, 30-50 % moins cher) » (non qualifié) → STATS_DISPLAY.distance
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$**côté France** (20 min, 30-50 % moins cher)$f$, $r$**côté France** (20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, 30-50 % moins cher)$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$**côté France** (20 min, 30-50 % moins cher)$f$ IN content_fr) > 0
  AND position($r$**côté France** (20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, 30-50 % moins cher)$r$ IN content_fr) = 0;

-- [163/175] trouver-colocation-geneve-frontalier (en) · D1 · L39 “In short”: “on the French side (20 min, 30-50% cheaper)” (unqualified) → STATS_DISPLAY.distance
UPDATE blog_posts
SET content_en = replace(content_en, $f$**on the French side** (20 min, 30-50% cheaper)$f$, $r$**on the French side** (20 min from Geneva Eaux-Vives by Léman Express, door to door, 30-50% cheaper)$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$**on the French side** (20 min, 30-50% cheaper)$f$ IN content_en) > 0
  AND position($r$**on the French side** (20 min from Geneva Eaux-Vives by Léman Express, door to door, 30-50% cheaper)$r$ IN content_en) = 0;

-- [164/175] trouver-colocation-geneve-frontalier (fr) · D1 · L53 (absent en EN) : ancre « notre coliving à 20 minutes de Genève » → le « 20 min » de marque sous sa forme canonique (STATS_DISPLAY.distance)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[notre coliving à 20 minutes de Genève](/)$f$, $r$[notre coliving à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte](/)$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$[notre coliving à 20 minutes de Genève](/)$f$ IN content_fr) > 0
  AND position($r$[notre coliving à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte](/)$r$ IN content_fr) = 0;

-- [165/175] coliving-transfrontalier-geneve-annemasse-nouvelle-vie (fr) · D1 · L4 H2 « Le matin : 20 minutes, porte à porte » (destination absente ; pas un titre d'ancrage) → le « 20 min » de marque sous sa forme canonique (STATS_DISPLAY.distance)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$## Le matin : 20 minutes, porte à porte$f$, $r$## Le matin : 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte$r$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($f$## Le matin : 20 minutes, porte à porte$f$ IN content_fr) > 0
  AND position($r$## Le matin : 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte$r$ IN content_fr) = 0;

-- [166/175] coliving-transfrontalier-geneve-annemasse-nouvelle-vie (en) · D1 · L3 H2 “Mornings: 20 minutes, door to door” (no destination; not an anchoring heading) → the brand “20 min” in its canonical form (STATS_DISPLAY.distance)
UPDATE blog_posts
SET content_en = replace(content_en, $f$## Mornings: 20 minutes, door to door$f$, $r$## Mornings: 20 min from Geneva Eaux-Vives by Léman Express, door to door$r$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($f$## Mornings: 20 minutes, door to door$f$ IN content_en) > 0
  AND position($r$## Mornings: 20 min from Geneva Eaux-Vives by Léman Express, door to door$r$ IN content_en) = 0;

-- [167/175] coliving-transfrontalier-geneve-annemasse-nouvelle-vie (fr) · D1 · L6 : « le centre de Genève est à environ 20 minutes en Léman Express ou en tram » (« environ ») → forme canonique STATS_DISPLAY.distance (« tu es à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte ») + centre (Rive) 30 min
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$le centre de Genève est à environ 20 minutes en Léman Express ou [en tram](https://www.tpg.ch/).$f$, $r$tu es à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, et à 30 minutes du centre (Rive), en train ou [en tram](https://www.tpg.ch/).$r$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($f$le centre de Genève est à environ 20 minutes en Léman Express ou [en tram](https://www.tpg.ch/).$f$ IN content_fr) > 0
  AND position($r$tu es à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, et à 30 minutes du centre (Rive), en train ou [en tram](https://www.tpg.ch/).$r$ IN content_fr) = 0;

-- [168/175] coliving-transfrontalier-geneve-annemasse-nouvelle-vie (en) · D1 · L5: “central Geneva is about 20 minutes away by Léman Express or tram” (“about”) → canonical form STATS_DISPLAY.distance (“you are 20 min from Geneva Eaux-Vives by Léman Express, door to door”) + city centre (Rive) 30 min
UPDATE blog_posts
SET content_en = replace(content_en, $f$central Geneva is about 20 minutes away by Léman Express [or tram](https://www.tpg.ch/).$f$, $r$you are 20 min from Geneva Eaux-Vives by Léman Express, door to door, and 30 minutes from the city centre (Rive), by train [or tram](https://www.tpg.ch/).$r$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($f$central Geneva is about 20 minutes away by Léman Express [or tram](https://www.tpg.ch/).$f$ IN content_en) > 0
  AND position($r$you are 20 min from Geneva Eaux-Vives by Léman Express, door to door, and 30 minutes from the city centre (Rive), by train [or tram](https://www.tpg.ch/).$r$ IN content_en) = 0;

-- [169/175] coliving-transfrontalier-geneve-annemasse-nouvelle-vie (fr) · D1 · L30 : « Trajet : ~20 min vers Genève » → STATS_DISPLAY.distance
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$- **Trajet** : ~20 min vers Genève, sans voiture.$f$, $r$- **Trajet** : 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, sans voiture.$r$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($f$- **Trajet** : ~20 min vers Genève, sans voiture.$f$ IN content_fr) > 0
  AND position($r$- **Trajet** : 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, sans voiture.$r$ IN content_fr) = 0;

-- [170/175] coliving-transfrontalier-geneve-annemasse-nouvelle-vie (en) · D1 · L29: “Commute: ~20 min to Geneva” → STATS_DISPLAY.distance
UPDATE blog_posts
SET content_en = replace(content_en, $f$- **Commute**: ~20 min to Geneva, no car.$f$, $r$- **Commute**: 20 min from Geneva Eaux-Vives by Léman Express, door to door, no car.$r$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($f$- **Commute**: ~20 min to Geneva, no car.$f$ IN content_en) > 0
  AND position($r$- **Commute**: 20 min from Geneva Eaux-Vives by Léman Express, door to door, no car.$r$ IN content_en) = 0;

-- [171/175] living-in-france-working-in-geneva (fr) · D1 · L44 : « Le trajet Annemasse–Genève Cornavin dure environ 20 minutes » → Eaux-Vives 7 / Cornavin 23 (lien conservé ; tiret demi-cadratin de l'original)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[Le trajet Annemasse–Genève Cornavin dure environ 20 minutes](https://www.lemanexpress.com/)$f$, $r$[Le trajet Annemasse–Genève-Eaux-Vives dure 7 minutes, Annemasse–Cornavin 23 minutes](https://www.lemanexpress.com/)$r$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($f$[Le trajet Annemasse–Genève Cornavin dure environ 20 minutes](https://www.lemanexpress.com/)$f$ IN content_fr) > 0
  AND position($r$[Le trajet Annemasse–Genève-Eaux-Vives dure 7 minutes, Annemasse–Cornavin 23 minutes](https://www.lemanexpress.com/)$r$ IN content_fr) = 0;

-- [172/175] living-in-france-working-in-geneva (en) · D1 · L43: “The Annemasse–Geneva Cornavin journey takes about 20 minutes” → Eaux-Vives 7 / Cornavin 23 (link kept; en dash of the original)
UPDATE blog_posts
SET content_en = replace(content_en, $f$[The Annemasse–Geneva Cornavin journey takes about 20 minutes](https://www.lemanexpress.com/)$f$, $r$[The Annemasse–Geneva Eaux-Vives journey takes 7 minutes, Annemasse–Cornavin 23 minutes](https://www.lemanexpress.com/)$r$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($f$[The Annemasse–Geneva Cornavin journey takes about 20 minutes](https://www.lemanexpress.com/)$f$ IN content_en) > 0
  AND position($r$[The Annemasse–Geneva Eaux-Vives journey takes 7 minutes, Annemasse–Cornavin 23 minutes](https://www.lemanexpress.com/)$r$ IN content_en) = 0;

-- [173/175] choc-culturel-franco-suisse-expatrie-geneve (fr) · D1 · L86 (absent en EN) : « 3 maisons côté France, à 20 minutes du centre de Genève porte à porte » → STATS_DISPLAY.distance
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$dans 3 maisons côté France, à 20 minutes du centre de Genève porte à porte.$f$, $r$dans 3 maisons côté France, à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte.$r$),
    updated_at = now()
WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve'
  AND position($f$dans 3 maisons côté France, à 20 minutes du centre de Genève porte à porte.$f$ IN content_fr) > 0
  AND position($r$dans 3 maisons côté France, à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte.$r$ IN content_fr) = 0;

-- [174/175] ecole-internationale-geneve-frontalier-ou-habiter (fr) · D1 · L55 : « relie Annemasse au centre de Genève en ~20 min » (« ~ ») → Genève-Eaux-Vives en 7 min et Cornavin en 23 min
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$relie Annemasse au centre de Genève en ~20 min, ce qui ouvre$f$, $r$relie Annemasse à Genève-Eaux-Vives en 7 min et à Cornavin en 23 min, ce qui ouvre$r$),
    updated_at = now()
WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
  AND position($f$relie Annemasse au centre de Genève en ~20 min, ce qui ouvre$f$ IN content_fr) > 0
  AND position($r$relie Annemasse à Genève-Eaux-Vives en 7 min et à Cornavin en 23 min, ce qui ouvre$r$ IN content_fr) = 0;

-- [175/175] ecole-internationale-geneve-frontalier-ou-habiter (en) · D1 · L54: “links Annemasse to central Geneva in ~20 min” (“~”) → Geneva Eaux-Vives in 7 min and Cornavin in 23 min
UPDATE blog_posts
SET content_en = replace(content_en, $f$links Annemasse to central Geneva in ~20 min, opening up$f$, $r$links Annemasse to Geneva Eaux-Vives in 7 min and Cornavin in 23 min, opening up$r$),
    updated_at = now()
WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
  AND position($f$links Annemasse to central Geneva in ~20 min, opening up$f$ IN content_en) > 0
  AND position($r$links Annemasse to Geneva Eaux-Vives in 7 min and Cornavin in 23 min, opening up$r$ IN content_en) = 0;

-- ── Aperçu des ancrages (ancien → nouveau, première ligne de chaque texte) ──
-- [1] quartiers-annemasse-ou-vivre-selon-profil/fr · D6 : « une **agglomération de communes mitoyennes**, collée à la frontière gen… » → « une **agglomération de communes voisines**, collée à la frontière genev… »
-- [2] quartiers-annemasse-ou-vivre-selon-profil/en · D6 : « a **cluster of adjoining towns**, pressed against the Geneva border: » → « a **cluster of neighbouring towns**, pressed against the Geneva border: »
-- [3] quartiers-annemasse-ou-vivre-selon-profil/fr · D6 : « - **Ville-la-Grand** — résidentiel et familial, frontière mitoyenne au … » → « - **Ville-la-Grand** — résidentiel et familial, bordé par le Foron, la … »
-- [4] quartiers-annemasse-ou-vivre-selon-profil/en · D6 : « - **Ville-la-Grand** — residential and family-friendly, border-adjacent… » → « - **Ville-la-Grand** — residential and family-friendly, bordered by the… »
-- [5] quartiers-annemasse-ou-vivre-selon-profil/fr · D7 : « la **gare d'Annemasse** (terminus français du Léman Express, Genève en … » → « la **gare d'Annemasse** (Léman Express : Genève-Eaux-Vives en 7 min de … »
-- [6] quartiers-annemasse-ou-vivre-selon-profil/en · D7 : « the **Annemasse station** (French terminus of the Léman Express, Geneva… » → « the **Annemasse station** (Léman Express: Geneva Eaux-Vives in 7 min by… »
-- [7] quartiers-annemasse-ou-vivre-selon-profil/fr · D1 : « Le Léman Express te dépose à Genève-Eaux-Vives en ~15 min, à Cornavin e… » → « Le Léman Express te dépose à Genève-Eaux-Vives en 7 min, à Cornavin en … »
-- [8] quartiers-annemasse-ou-vivre-selon-profil/en · D1 : « The Léman Express drops you at Geneva-Eaux-Vives in ~15 min, Cornavin i… » → « The Léman Express drops you at Geneva Eaux-Vives in 7 min, Cornavin in … »
-- [9] quartiers-annemasse-ou-vivre-selon-profil/fr · D7 : « Depuis là, Genève se rejoint à vélo en quelques minutes par les pistes … » → « Depuis là, le centre de Genève (Rive) se rejoint à vélo par la Voie Ver… »
-- [10] quartiers-annemasse-ou-vivre-selon-profil/en · D7 : « From there, Geneva is a few minutes by bike via the cross-border cycle … » → « From there, central Geneva (Rive) is reached by bike on the Voie Verte … »
-- [11] quartiers-annemasse-ou-vivre-selon-profil/fr · D6 : « tout en restant à 10-15 min de la gare et de la frontière. Notre maison… » → « tout en restant proche de la gare et de la frontière. Notre maison [La … »
-- [12] quartiers-annemasse-ou-vivre-selon-profil/en · D6 : « while staying 10-15 min from the station and the border. Our [Villa, in… » → « while staying close to the station and the border. Our [Villa, in Ville… »
-- [13] quartiers-annemasse-ou-vivre-selon-profil/fr · fix : « Évite les abords immédiats de l'**autoroute A40** et des grands axes » → « Évite les abords immédiats de l'**autoroute** et des grands axes »
-- [14] quartiers-annemasse-ou-vivre-selon-profil/en · fix : « Avoid the immediate surroundings of the **A40 motorway** and major roads » → « Avoid the immediate surroundings of the **motorway** and major roads »
-- [15] quartiers-annemasse-ou-vivre-selon-profil/fr · D1 : « [Le Lodge à Annemasse](/lelodge) (Léman Express et Tram 17 à pied), [Le… » → « [Le Lodge à Annemasse](/lelodge) (gare d'Annemasse à 10 min à pied · Ge… »
-- [16] quartiers-annemasse-ou-vivre-selon-profil/en · D1 : « [Le Lodge in Annemasse](/en/lelodge) (Léman Express and Tram 17 on foot… » → « [Le Lodge in Annemasse](/en/lelodge) (Annemasse station 10 min on foot … »
-- [17] temps-trajet-annemasse-geneve-par-quartier/fr · D6 : « Ville-la-Grand est la commune la plus proche de la frontière suisse. » → « Ville-la-Grand est bordée par le Foron, la rivière qui marque la fronti… »
-- [18] temps-trajet-annemasse-geneve-par-quartier/en · D6 : « Ville-la-Grand is the closest municipality to the Swiss border. » → « Ville-la-Grand is bordered by the Foron, the river that marks the Swiss… »
-- [19] temps-trajet-annemasse-geneve-par-quartier/fr · D1 : « En **Léman Express** depuis Annemasse (gare à 10 min à pied ou 3 min en… » → « En **Léman Express** depuis Annemasse (gare à 14 min à pied de La Villa… »
-- [20] temps-trajet-annemasse-geneve-par-quartier/en · D1 : « By **Léman Express** from Annemasse (station 10 min walk or 3 min bike … » → « By **Léman Express** from Annemasse (station a 14-min walk from La Vill… »
-- [21] temps-trajet-annemasse-geneve-par-quartier/fr · D7 : « En **bus** (ligne D ou tpg 61) : 35-50 minutes selon la circulation. » → « En **bus** : 35-50 minutes selon la circulation. »
-- [22] temps-trajet-annemasse-geneve-par-quartier/en · D7 : « By **bus** (line D or tpg 61): 35-50 minutes depending on traffic. » → « By **bus**: 35-50 minutes depending on traffic. »
-- [23] temps-trajet-annemasse-geneve-par-quartier/fr · D1 : « Léman Express, sans hésitation. 20 minutes, prévisible, 80 CHF/mois d'a… » → « Léman Express, sans hésitation. Genève-Eaux-Vives en 7 minutes, Cornavi… »
-- [24] temps-trajet-annemasse-geneve-par-quartier/en · D1 : « Léman Express, without hesitation. 20 minutes, predictable, 80 CHF/mont… » → « Léman Express, without hesitation. Geneva Eaux-Vives in 7 minutes, Corn… »
-- [25] temps-trajet-annemasse-geneve-par-quartier/fr · D1 : « Léman Express jusqu'à Cornavin (20 min) + tram 18 » → « Léman Express jusqu'à Cornavin (23 min) + tram 18 »
-- [26] temps-trajet-annemasse-geneve-par-quartier/en · D1 : « Léman Express to Cornavin (20 min) + tram 18 » → « Léman Express to Cornavin (23 min) + tram 18 »
-- [27] temps-trajet-annemasse-geneve-par-quartier/fr · D1 : « La gare d'Annemasse est à 5-8 minutes en vélo depuis Ambilly. » → « La gare d'Annemasse est à 18 minutes à pied du Loft (arrêt de bus Olymp… »
-- [28] temps-trajet-annemasse-geneve-par-quartier/en · D1 : « Annemasse station is 5-8 minutes by bike from Ambilly. » → « Annemasse station is an 18-minute walk from Le Loft (Olympe de Gouges b… »
-- [29] temps-trajet-annemasse-geneve-par-quartier/fr · D1 : « est à Annemasse, à environ 9 minutes à pied de la gare. » → « est à Annemasse, à 10 minutes à pied de la gare. »
-- [30] temps-trajet-annemasse-geneve-par-quartier/en · D1 : « is in Annemasse, about a 9-minute walk from the station. » → « is in Annemasse, a 10-minute walk from the station. »
-- [31] temps-trajet-annemasse-geneve-par-quartier/fr · D1 : « | Léman Express (abonnement) | ~80 CHF | 20 min | » → « | Léman Express (abonnement) | ~80 CHF | 7 min (Eaux-Vives), 23 min (Co… »
-- [32] temps-trajet-annemasse-geneve-par-quartier/en · D1 : « | Léman Express (pass) | ~80 CHF | 20 min | » → « | Léman Express (pass) | ~80 CHF | 7 min (Eaux-Vives), 23 min (Cornavin… »
-- [33] temps-trajet-annemasse-geneve-par-quartier/fr · D1 : « La Villa à Ville-la-Grand est à moins de 10 minutes à pied de la gare d… » → « La Villa à Ville-la-Grand est à 14 minutes à pied de la gare d'Annemass… »
-- [34] temps-trajet-annemasse-geneve-par-quartier/en · D1 : « La Villa in Ville-la-Grand is less than a 10-minute walk from Annemasse… » → « La Villa in Ville-la-Grand is a 14-minute walk from Annemasse station. … »
-- [35] temps-trajet-annemasse-geneve-par-quartier/fr · D1 : « La Villa (10 chambres) est à 10 min de la gare. » → « La Villa (10 chambres) est à 14 min à pied de la gare. »
-- [36] temps-trajet-annemasse-geneve-par-quartier/en · D1 : « La Villa (10 rooms) is 10 min from the station. » → « La Villa (10 rooms) is a 14-min walk from the station. »
-- [37] temps-trajet-annemasse-geneve-par-quartier/fr · D1 : « Annemasse avec Léman Express jusqu'à Genève-Aéroport (30 min, direct). » → « Annemasse, en train depuis la gare d'Annemasse : Léman Express jusqu'à … »
-- [38] temps-trajet-annemasse-geneve-par-quartier/en · D1 : « Annemasse with Léman Express to Geneva Airport (30 min, direct). » → « Annemasse, by train from Annemasse station: Léman Express to Geneva Cor… »
-- [39] transport-annemasse-geneve-leman-express/fr · D1 : « **Temps** : Annemasse-Genève-Cornavin = 20 minutes. Aéroport (Cointrin)… » → « **Temps** : Annemasse-Genève-Eaux-Vives = 7 minutes, Annemasse-Genève-C… »
-- [40] transport-annemasse-geneve-leman-express/en · D1 : « **Time**: Annemasse-Geneva-Cornavin = 20 minutes. Airport (Cointrin) = … » → « **Time**: Annemasse-Geneva Eaux-Vives = 7 minutes, Annemasse-Geneva-Cor… »
-- [41] transport-annemasse-geneve-leman-express/fr · fix : « [Toutes les 15 min en heures de pointe](https://www.lemanexpress.com/) » → « [Toutes les 10 min en heures de pointe](https://www.lemanexpress.com/) »
-- [42] transport-annemasse-geneve-leman-express/en · fix : « [Every 15 min peak hours](https://www.lemanexpress.com/en/) » → « [Every 10 min at peak hours](https://www.lemanexpress.com/en/) »
-- [43] transport-annemasse-geneve-leman-express/fr · D1 : « À Ville-la-Grand, c'est 10-15 min à pied. À Ambilly, c'est loin. » → « Depuis nos maisons : 10 min à pied du Lodge (Annemasse), 14 min de La V… »
-- [44] transport-annemasse-geneve-leman-express/en · D1 : « Ville-la-Grand: 10-15 min walk. Ambilly: far. » → « From our houses: a 10-min walk from Le Lodge (Annemasse), 14 min from L… »
-- [45] transport-annemasse-geneve-leman-express/fr · D1 : « **Temps** : Annemasse-Genève-centre = 35-40 minutes (piste cyclable). » → « **Temps** : Annemasse-Genève centre (Rive) = 23 à 29 minutes par la Voi… »
-- [46] transport-annemasse-geneve-leman-express/en · D1 : « **Time**: Annemasse-Geneva-center = 35-40 min (bike path). » → « **Time**: Annemasse-Geneva centre (Rive) = 23 to 29 min on the Voie Ver… »
-- [47] transport-annemasse-geneve-leman-express/fr · D1 : « | Léman Express | 200€ | 20 min | Bas | 9/10 | » → « | Léman Express | 200€ | 7 min (Eaux-Vives), 23 min (Cornavin) | Bas | … »
-- [48] transport-annemasse-geneve-leman-express/en · D1 : « | Léman Express | 200€ | 20 min | Low | 9/10 | » → « | Léman Express | 200€ | 7 min (Eaux-Vives), 23 min (Cornavin) | Low | … »
-- [49] transport-annemasse-geneve-leman-express/fr · D1 : « | Vélo | 0€ | 35-40 min | Bas | 5/10 (été) | » → « | Vélo | 0€ | 23-29 min (Voie Verte) | Bas | 5/10 (été) | »
-- [50] transport-annemasse-geneve-leman-express/en · D1 : « | Bike | 0€ | 35-40 min | Low | 5/10 (summer) | » → « | Bike | 0€ | 23-29 min (Voie Verte) | Low | 5/10 (summer) | »
-- [51] transport-annemasse-geneve-leman-express/fr · D1 : « | Centre (Cornavin) | 22 min | 20-25 → 40-55 min | 35-50 min | 30-40 mi… » → « | Centre (Cornavin) | 23 min de train · 38 min porte-à-porte depuis La … »
-- [52] transport-annemasse-geneve-leman-express/en · D1 : « | Center (Cornavin) | 22 min | 20-25 → 40-55 min | 35-50 min | 30-40 mi… » → « | Center (Cornavin) | 23 min by train · 38 min door to door from La Vil… »
-- [53] transport-annemasse-geneve-leman-express/fr · D1 : « | CERN (Meyrin) | 50-55 min (Cornavin 22 min + tram 18) | » → « | CERN (Meyrin) | 50-55 min (Cornavin 23 min + tram 18) | »
-- [54] transport-annemasse-geneve-leman-express/en · D1 : « | CERN (Meyrin) | 50-55 min (Cornavin 22 min + tram 18) | » → « | CERN (Meyrin) | 50-55 min (Cornavin 23 min + tram 18) | »
-- [55] transport-annemasse-geneve-leman-express/fr · D1 : « La gare d'Annemasse est à 10 min à pied (ou 3 min en vélo) de Ville-la-… » → « La gare d'Annemasse est à 14 min à pied de La Villa, à Ville-la-Grand. »
-- [56] transport-annemasse-geneve-leman-express/en · D1 : « Annemasse station is a 10-min walk (or 3-min bike ride) from Ville-la-G… » → « Annemasse station is a 14-min walk from La Villa, in Ville-la-Grand. »
-- [57] transport-annemasse-geneve-leman-express/fr · D1 : « La gare d'Annemasse est à 5-8 min en vélo. » → « La gare d'Annemasse est à 18 min à pied du Loft, le tram 17 à 8 min. »
-- [58] transport-annemasse-geneve-leman-express/en · D1 : « Annemasse station is 5-8 min by bike. » → « Annemasse station is an 18-min walk from Le Loft, tram 17 an 8-min walk. »
-- [59] transport-annemasse-geneve-leman-express/fr · D1 : « Vers l'aéroport, le Léman Express est direct (30 min). » → « Vers l'aéroport, en train depuis la gare d'Annemasse : Léman Express ju… »
-- [60] transport-annemasse-geneve-leman-express/en · D1 : « To the airport, the Léman Express is direct (30 min). » → « To the airport, by train from Annemasse station: Léman Express to Genev… »
-- [61] transport-annemasse-geneve-leman-express/fr · D1 : « - **Aéroport** : Annemasse, Léman Express direct jusqu'à Genève-Aéropor… » → « - **Aéroport** : Annemasse, en train depuis la gare d'Annemasse : Léman… »
-- [62] transport-annemasse-geneve-leman-express/en · D1 : « - **Airport**: Annemasse, direct Léman Express to Geneva Airport (30 mi… » → « - **Airport**: Annemasse, by train from Annemasse station: Léman Expres… »
-- [63] coliving-geneve-frontaliers-guide-complet/fr · D1 : « À Annemasse par exemple, tu restes à quelques minutes de ton lieu de tr… » → « À Annemasse par exemple, tu restes à 7 minutes de train de Genève-Eaux-… »
-- [64] coliving-geneve-frontaliers-guide-complet/en · D1 : « In Annemasse, for example, you stay just minutes from your workplace wh… » → « In Annemasse, for example, you stay 7 minutes by train from Geneva Eaux… »
-- [65] coliving-geneve-frontaliers-guide-complet/fr · D1 : « **Proximité de Genève** : 20 minutes en transport en commun pour rejoin… » → « **Proximité de Genève** : 20 min de Genève-Eaux-Vives en Léman Express,… »
-- [66] coliving-geneve-frontaliers-guide-complet/en · D1 : « **Geneva proximity**: 20 minutes by public transport to reach Geneva ce… » → « **Geneva proximity**: 20 min from Geneva Eaux-Vives by Léman Express, d… »
-- [67] coliving-geneve-frontaliers-guide-complet/fr, facebook_post_fr · D1 : « 🚊 15 min de Genève en transports » → « 🚊 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte »
-- [68] coliving-geneve-frontaliers-guide-complet/en, facebook_post_en · D1 : « 🚊 15 min from Geneva by transport » → « 🚊 20 min from Geneva Eaux-Vives by Léman Express, door to door »
-- [69] coliving-geneve-frontaliers-guide-complet/fr, facebook_post_fr · fix : « ✨ 1 430 CHF/mois tout inclus à Annemasse » → « ✨ dès 1 370 CHF/mois tout inclus à Annemasse »
-- [70] coliving-geneve-frontaliers-guide-complet/en, facebook_post_en · fix : « ✨ 1,430 CHF/month all-inclusive in Annemasse » → « ✨ from CHF 1,370/month all-inclusive in Annemasse »
-- [71] lodge-annemasse-coliving-premium-portes-geneve/fr · D1 : « notre maison d'Annemasse, à quelques minutes seulement de la frontière … » → « notre maison d'Annemasse, à 10 min à pied de la gare d'Annemasse. »
-- [72] lodge-annemasse-coliving-premium-portes-geneve/en · D1 : « our house in Annemasse, just minutes from the Swiss border. » → « our house in Annemasse, a 10-minute walk from Annemasse station. »
-- [73] lodge-annemasse-coliving-premium-portes-geneve/fr · D1 : « Le Léman Express relie la gare d'Annemasse à Cornavin en 20 minutes, et… » → « Le Léman Express relie la gare d'Annemasse à Genève-Eaux-Vives en 7 min… »
-- [74] lodge-annemasse-coliving-premium-portes-geneve/en · D1 : « The Léman Express connects Annemasse station to Cornavin in 20 minutes,… » → « The Léman Express connects Annemasse station to Geneva Eaux-Vives in 7 … »
-- [75] lodge-annemasse-coliving-premium-portes-geneve/fr · D1 : « La gare d'Annemasse — et son Léman Express — est à environ 9 minutes à … » → « La gare d'Annemasse — et son Léman Express — est à 10 minutes à pied. »
-- [76] lodge-annemasse-coliving-premium-portes-geneve/en · D1 : « Annemasse station — and its Léman Express — is about a 9-minute walk aw… » → « Annemasse station — and its Léman Express — is a 10-minute walk away. »
-- [77] lodge-annemasse-coliving-premium-portes-geneve/fr · D1 : « à environ 9 minutes à pied de la gare d'Annemasse, soit 20 minutes de C… » → « à 10 minutes à pied de la gare d'Annemasse, Genève-Eaux-Vives en 18 min… »
-- [78] lodge-annemasse-coliving-premium-portes-geneve/en · D1 : « about 9 minutes' walk from Annemasse station, i.e. 20 minutes from Corn… » → « a 10-minute walk from Annemasse station, Geneva Eaux-Vives in 18 minute… »
-- [79] lodge-annemasse-coliving-premium-portes-geneve/fr, facebook_post_fr · D1 : « tout compris à 1 430 CHF/mois. À 10 minutes de Genève, à des années-lum… » → « tout compris dès 1 370 CHF/mois. À 20 min de Genève-Eaux-Vives en Léman… »
-- [80] lodge-annemasse-coliving-premium-portes-geneve/en, facebook_post_en · D1 : « all-inclusive at 1,430 CHF/month. 10 minutes from Geneva, light-years » → « all-inclusive from CHF 1,370/month. 20 min from Geneva Eaux-Vives by Lé… »
-- [81] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · D1 : « **Temps de trajet** : 15-20 min [en Léman Express](https://www.lemanexp… » → « **Temps de trajet** : Genève-Eaux-Vives en 7 min [en Léman Express](htt… »
-- [82] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · D1 : « **Commute**: [15-20 min by Léman Express](https://www.lemanexpress.com/) » → « **Commute**: Geneva Eaux-Vives in 7 min [by Léman Express](https://www.… »
-- [83] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · D1 : « Le Léman Express te dépose à Cornavin en 20 minutes. » → « Le Léman Express te dépose à Genève-Eaux-Vives en 7 minutes et à Cornav… »
-- [84] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · D1 : « The Léman Express drops you at Cornavin in 20 minutes. » → « The Léman Express drops you at Geneva Eaux-Vives in 7 minutes and at Co… »
-- [85] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · D1 : « **Temps de trajet** : 12 min en voiture, 20 min en bus » → « **Temps de trajet** : Genève-Eaux-Vives en 7 min de Léman Express, 22 m… »
-- [86] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · D1 : « **Commute**: 12 min by car, 20 min by bus » → « **Commute**: Geneva Eaux-Vives in 7 min by Léman Express, 22 min door t… »
-- [87] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · D7 : « plusieurs lignes TPN qui filent direct sur Genève. » → « le Léman Express depuis la gare d'Annemasse. »
-- [88] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · D7 : « several TPN bus lines straight to Geneva. » → « the Léman Express from Annemasse station. »
-- [89] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · D6 : « **Frontière à pied** : 5 min · **Temps de trajet Genève** : 10 min en v… » → « **Frontière à pied** : 8 min (le Foron, à 600 m du Loft) · **Temps de t… »
-- [90] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · D6 : « **Walk to border**: 5 min · **Commute to Geneva**: 10 min by car, 10 mi… » → « **Walk to border**: 8 min (the Foron, 600 m from Le Loft) · **Commute t… »
-- [91] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · D6 : « Ambilly est la commune française la plus proche de la frontière : compt… » → « Ambilly est la commune collée à la frontière : depuis Le Loft, le Foron… »
-- [92] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · D6 : « Ambilly is the closest French town to the border — about a 5-minute wal… » → « Ambilly is the town right on the border: from Le Loft, the Foron, the b… »
-- [93] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · D7 : « - Un **tram Annemasse-Genève** est prévu pour **2027**, en plus du Tram… » → « - Le **Tram 17**, déjà direct sur Genève, est **prolongé dans Annemasse… »
-- [94] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · D7 : « - An **Annemasse-Geneva tram** is planned for **2027**. » → « - **Tram 17**, already direct to Geneva, is **extended into Annemasse a… »
-- [95] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · D1 : « | Annemasse | 15-20 min | » → « | Annemasse | Genève-Eaux-Vives en 7 min de Léman Express, 18 min porte… »
-- [96] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · D1 : « | Annemasse | 15-20 min | » → « | Annemasse | Geneva Eaux-Vives in 7 min by Léman Express, 18 min door … »
-- [97] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · D1 : « | **Ville-la-Grand** | **12-20 min** | » → « | **Ville-la-Grand** | **Genève-Eaux-Vives en 7 min de Léman Express, 2… »
-- [98] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · D1 : « | **Ville-la-Grand** | **12-20 min** | » → « | **Ville-la-Grand** | **Geneva Eaux-Vives in 7 min by Léman Express, 2… »
-- [99] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · D7 : « les bus transfrontaliers TPG/TPN » → « les bus transfrontaliers TPG »
-- [100] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · D7 : « the cross-border TPG/TPN buses » → « the cross-border TPG buses »
-- [101] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · D1 : « 3 maisons côté France, à 20 minutes du centre de Genève porte à porte, … » → « 3 maisons côté France, à 20 min de Genève-Eaux-Vives en Léman Express, … »
-- [102] coliving-annemasse-geneve-frontaliers-avantages/fr · D1 : « Située à seulement 20 minutes de Genève en [Léman Express](https://www.… » → « Située à 7 minutes de Genève-Eaux-Vives en [Léman Express](https://www.… »
-- [103] coliving-annemasse-geneve-frontaliers-avantages/en · D1 : « Located just 20 minutes from Geneva on the [Léman Express](https://www.… » → « Located 7 minutes from Geneva Eaux-Vives by [Léman Express](https://www… »
-- [104] coliving-annemasse-geneve-frontaliers-avantages/fr · D1 : « - **20 minutes** du centre de Genève en Léman Express » → « - **20 min** de Genève-Eaux-Vives en Léman Express, porte-à-porte »
-- [105] coliving-annemasse-geneve-frontaliers-avantages/en · D1 : « - **20 minutes** from Geneva center on the Léman Express » → « - **20 min** from Geneva Eaux-Vives by Léman Express, door to door »
-- [106] coliving-annemasse-geneve-frontaliers-avantages/fr · D1 : « Et Genève, à quelques minutes, enrichit encore l'offre » → « Et Genève, à 7 minutes de Léman Express depuis la gare d'Annemasse, enr… »
-- [107] coliving-annemasse-geneve-frontaliers-avantages/en · D1 : « And Geneva, just minutes away, enriches the offering even further » → « And Geneva, 7 minutes away by Léman Express from Annemasse station, enr… »
-- [108] guide-ressources-frontalier-geneve/fr · D1 : « des maisons de chambres meublées tout inclus à une vingtaine de minutes… » → « des maisons de chambres meublées tout inclus côté France (Genève-Eaux-V… »
-- [109] guide-ressources-frontalier-geneve/en · D1 : « a set of houses with all-inclusive furnished rooms about twenty minutes… » → « a set of houses with all-inclusive furnished rooms on the French side (… »
-- [110] guide-ressources-frontalier-geneve/fr · D1 : « | Léman Express | ~115 CHF | ~20 min | Très élevée | » → « | Léman Express | ~115 CHF | 7 min (Genève-Eaux-Vives), 23 min (Cornavi… »
-- [111] guide-ressources-frontalier-geneve/en · D1 : « | Léman Express | ~115 CHF | ~20 min | Very high | » → « | Léman Express | ~115 CHF | 7 min (Geneva Eaux-Vives), 23 min (Cornavi… »
-- [112] guide-ressources-frontalier-geneve/fr · D1 : « | Centre (Cornavin) | Léman Express direct | ~22 min | » → « | Centre (Cornavin) | Léman Express direct | 23 min de train, 35 à 40 m… »
-- [113] guide-ressources-frontalier-geneve/en · D1 : « | Centre (Cornavin) | Léman Express direct | ~22 min | » → « | Centre (Cornavin) | Léman Express direct | 23 min by train, 35 to 40 … »
-- [114] guide-ressources-frontalier-geneve/fr · D1 : « | CERN (Meyrin) | Léman Express → Cornavin + tram 18 | 50 à 55 min |⏎| … » → « | CERN (Meyrin) | Léman Express → Cornavin + tram 18 | 50 à 55 min | »
-- [115] guide-ressources-frontalier-geneve/en · D1 : « | CERN (Meyrin) | Léman Express → Cornavin + tram 18 | 50 to 55 min |⏎|… » → « | CERN (Meyrin) | Léman Express → Cornavin + tram 18 | 50 to 55 min | »
-- [116] organisations-internationales-geneve-ou-habiter/fr · D1 : « La réponse pragmatique : côté France, à 20-30 minutes de trajet. » → « La réponse pragmatique : côté France, à 20 min de Genève-Eaux-Vives en … »
-- [117] organisations-internationales-geneve-ou-habiter/en · D1 : « The pragmatic answer: on the French side, 20-30 minutes away. » → « The pragmatic answer: on the French side, 20 min from Geneva Eaux-Vives… »
-- [118] organisations-internationales-geneve-ou-habiter/fr · D1 : « la gare de Cornavin (22 min en Léman Express depuis Annemasse) » → « la gare de Cornavin (23 min en Léman Express depuis Annemasse) »
-- [119] organisations-internationales-geneve-ou-habiter/en · D1 : « Cornavin station (22 min by Léman Express from Annemasse) » → « Cornavin station (23 min by Léman Express from Annemasse) »
-- [120] organisations-internationales-geneve-ou-habiter/fr · D1 : « côté France à 20 minutes du centre de Genève porte à porte. » → « côté France, à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-po… »
-- [121] espaces-verts-coliving-lodge-annemasse/fr · D1 : « un vrai jardin à 20 minutes de Genève — » → « un vrai jardin à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-… »
-- [122] espaces-verts-coliving-lodge-annemasse/en · D1 : « a real garden 20 minutes from Geneva — » → « a real garden 20 min from Geneva Eaux-Vives by Léman Express, door to d… »
-- [123] espaces-verts-coliving-lodge-annemasse/fr · D1 : « - À 20 minutes de Genève, côté France. » → « - À 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, côté F… »
-- [124] espaces-verts-coliving-lodge-annemasse/en · D1 : « - 20 minutes from Geneva, on the French side. » → « - 20 min from Geneva Eaux-Vives by Léman Express, door to door, on the … »
-- [125] budget-colocation-geneve-guide-complet/fr · D1 : « pour vivre confortablement à 20 minutes de Genève, par exemple » → « pour vivre confortablement à 20 min de Genève-Eaux-Vives en Léman Expre… »
-- [126] budget-colocation-geneve-guide-complet/en · D1 : « for living comfortably 20 minutes door-to-door from Geneva. » → « for living comfortably 20 min from Geneva Eaux-Vives by Léman Express, … »
-- [127] budget-colocation-geneve-guide-complet/fr · D1 : « [Annemasse↔Genève Cornavin en 20 minutes, directement](https://www.lema… » → « [Annemasse↔Genève-Eaux-Vives en 7 minutes, Cornavin en 23, directement]… »
-- [128] budget-colocation-geneve-guide-complet/en · D1 : « [Léman Express connecting Annemasse to Geneva Cornavin in 20 minutes](h… » → « [Léman Express connecting Annemasse to Geneva Eaux-Vives in 7 minutes a… »
-- [129] budget-colocation-geneve-guide-complet/fr · D1 : « On parle de 20 minutes de trajet, pas de 2 heures. » → « On parle de 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte… »
-- [130] budget-colocation-geneve-guide-complet/fr · D1 : « accès direct Genève en 20 min. » → « Genève-Eaux-Vives en 7 min et Cornavin en 23 min de Léman Express. »
-- [131] budget-colocation-geneve-guide-complet/en · D1 : « with direct Geneva access in 20 min. » → « with Geneva Eaux-Vives in 7 min and Cornavin in 23 min by Léman Express. »
-- [132] cout-transport-frontalier-geneve-2026/fr · D1 : « relie Annemasse à Genève en 20 minutes, avec des trains toutes les 10 m… » → « relie Annemasse à Genève-Eaux-Vives en 7 minutes et à Cornavin en 23, a… »
-- [133] cout-transport-frontalier-geneve-2026/en · D1 : « connects Annemasse to Geneva in 20 minutes, with trains every 10 minute… » → « connects Annemasse to Geneva Eaux-Vives in 7 minutes and Cornavin in 23… »
-- [134] cout-transport-frontalier-geneve-2026/fr · D1 : « Les trois maisons de La Villa Coliving sont toutes à moins de 10 minute… » → « Les trois maisons de La Villa Coliving sont à 10, 14 et 18 minutes à pi… »
-- [135] cout-transport-frontalier-geneve-2026/en · D1 : « La Villa Coliving's three houses are all within 10 minutes of Annemasse… » → « La Villa Coliving's three houses are a 10, 14 and 18-minute walk from A… »
-- [136] cout-de-la-vie-suisse-france-frontalier-2026/fr · D1 : « qu'à Annemasse, à 20 minutes de là. » → « qu'à Annemasse, à 7 minutes de Genève-Eaux-Vives en Léman Express. »
-- [137] cout-de-la-vie-suisse-france-frontalier-2026/en · D1 : « than in Annemasse, 20 minutes away. » → « than in Annemasse, 7 minutes from Geneva Eaux-Vives by Léman Express. »
-- [138] cout-de-la-vie-suisse-france-frontalier-2026/fr · D1 : « [colocation tout inclus à 20 min de Genève](/blog/trouver-colocation-ge… » → « [colocation tout inclus à 20 min de Genève-Eaux-Vives en Léman Express,… »
-- [139] cout-de-la-vie-suisse-france-frontalier-2026/en · D1 : « [all-inclusive coliving 20 min from Geneva](/en/colocation-geneve) » → « [all-inclusive coliving 20 min from Geneva Eaux-Vives by Léman Express,… »
-- [140] allocations-familiales-frontalier-geneve-2026/fr · D1 : « [coliving tout inclus à 20 min de Genève](/blog/trouver-colocation-gene… » → « [coliving tout inclus à 20 min de Genève-Eaux-Vives en Léman Express, p… »
-- [141] allocations-familiales-frontalier-geneve-2026/en · D1 : « [all-inclusive coliving 20 min from Geneva](/en/colocation-geneve) » → « [all-inclusive coliving 20 min from Geneva Eaux-Vives by Léman Express,… »
-- [142] ecole-internationale-geneve-frontalier-ou-habiter/fr · D1 : « [coliving tout inclus à 20 min de Genève](/blog/trouver-colocation-gene… » → « [coliving tout inclus à 20 min de Genève-Eaux-Vives en Léman Express, p… »
-- [143] ecole-internationale-geneve-frontalier-ou-habiter/en · D1 : « [all-inclusive coliving 20 min from Geneva](/en/colocation-geneve) » → « [all-inclusive coliving 20 min from Geneva Eaux-Vives by Léman Express,… »
-- [144] quitter-son-logement-guide-pratique/fr · D1 : « [coliving tout inclus à 20 min de Genève](/blog/trouver-colocation-gene… » → « [coliving tout inclus à 20 min de Genève-Eaux-Vives en Léman Express, p… »
-- [145] quitter-son-logement-guide-pratique/en · D1 : « [all-inclusive coliving 20 min from Geneva](/en/colocation-geneve) » → « [all-inclusive coliving 20 min from Geneva Eaux-Vives by Léman Express,… »
-- [146] salaire-suisse-net-frontalier-2026/fr · D1 : « [coliving tout inclus à 20 min de Genève](/blog/trouver-colocation-gene… » → « [coliving tout inclus à 20 min de Genève-Eaux-Vives en Léman Express, p… »
-- [147] salaire-suisse-net-frontalier-2026/en · D1 : « [all-inclusive coliving 20 min from Geneva](/en/colocation-geneve) » → « [all-inclusive coliving 20 min from Geneva Eaux-Vives by Léman Express,… »
-- [148] permis-g-frontalier-geneve/fr · D1 : « dans une maison à 20 minutes de Genève te donne » → « dans une maison à 20 min de Genève-Eaux-Vives en Léman Express, porte-à… »
-- [149] permis-g-frontalier-geneve/en · D1 : « in a house 20 minutes from Geneva gives you » → « in a house 20 min from Geneva Eaux-Vives by Léman Express, door to door… »
-- [150] salaire-suisse-net-frontalier-2026/fr · D1 : « vivre côté France à 20 minutes de Genève, c'est » → « vivre côté France à 20 min de Genève-Eaux-Vives en Léman Express, porte… »
-- [151] salaire-suisse-net-frontalier-2026/en · D1 : « living on the French side at 20 min from Geneva is » → « living on the French side 20 min from Geneva Eaux-Vives by Léman Expres… »
-- [152] trouver-colocation-geneve-frontalier/fr · D1 : « — à 20 minutes du centre en Léman Express, pour des loyers » → « — à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, pour d… »
-- [153] trouver-colocation-geneve-frontalier/en · D1 : « — 20 minutes from the center by Léman Express, for rents » → « — 20 min from Geneva Eaux-Vives by Léman Express, door to door, for ren… »
-- [154] trouver-colocation-geneve-frontalier/fr · D1 : « à 20 minutes de Genève côté France. Tu arrives avec ta valise. » → « à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, côté Fra… »
-- [155] trouver-colocation-geneve-frontalier/en · D1 : « 20 minutes from Geneva on the French side. You arrive with your suitcas… » → « 20 min from Geneva Eaux-Vives by Léman Express, door to door, on the Fr… »
-- [156] trouver-colocation-geneve-frontalier/fr · D1 : « trois maisons situées à 20 minutes du centre de Genève, côté France : » → « trois maisons situées côté France, à 20 min de Genève-Eaux-Vives en Lém… »
-- [157] trouver-colocation-geneve-frontalier/en · D1 : « three houses located 20 minutes from Geneva city center, on the French … » → « three houses located on the French side, 20 min from Geneva Eaux-Vives … »
-- [158] trouver-colocation-geneve-frontalier/fr · D1 : « tout en restant à 20 minutes en transports. » → « tout en restant à 20 min de Genève-Eaux-Vives en Léman Express, porte-à… »
-- [159] trouver-colocation-geneve-frontalier/en · D1 : « while staying 20 minutes away by public transport. » → « while staying 20 min from Geneva Eaux-Vives by Léman Express, door to d… »
-- [160] trouver-colocation-geneve-frontalier/fr · D1 : « à 20 minutes du centre de Genève côté France, dès » → « côté France, à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-po… »
-- [161] trouver-colocation-geneve-frontalier/en · D1 : « 20 minutes from Geneva city center on the French side, from » → « on the French side, 20 min from Geneva Eaux-Vives by Léman Express, doo… »
-- [162] trouver-colocation-geneve-frontalier/fr · D1 : « **côté France** (20 min, 30-50 % moins cher) » → « **côté France** (20 min de Genève-Eaux-Vives en Léman Express, porte-à-… »
-- [163] trouver-colocation-geneve-frontalier/en · D1 : « **on the French side** (20 min, 30-50% cheaper) » → « **on the French side** (20 min from Geneva Eaux-Vives by Léman Express,… »
-- [164] trouver-colocation-geneve-frontalier/fr · D1 : « [notre coliving à 20 minutes de Genève](/) » → « [notre coliving à 20 min de Genève-Eaux-Vives en Léman Express, porte-à… »
-- [165] coliving-transfrontalier-geneve-annemasse-nouvelle-vie/fr · D1 : « ## Le matin : 20 minutes, porte à porte » → « ## Le matin : 20 min de Genève-Eaux-Vives en Léman Express, porte-à-por… »
-- [166] coliving-transfrontalier-geneve-annemasse-nouvelle-vie/en · D1 : « ## Mornings: 20 minutes, door to door » → « ## Mornings: 20 min from Geneva Eaux-Vives by Léman Express, door to do… »
-- [167] coliving-transfrontalier-geneve-annemasse-nouvelle-vie/fr · D1 : « le centre de Genève est à environ 20 minutes en Léman Express ou [en tr… » → « tu es à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, et… »
-- [168] coliving-transfrontalier-geneve-annemasse-nouvelle-vie/en · D1 : « central Geneva is about 20 minutes away by Léman Express [or tram](http… » → « you are 20 min from Geneva Eaux-Vives by Léman Express, door to door, a… »
-- [169] coliving-transfrontalier-geneve-annemasse-nouvelle-vie/fr · D1 : « - **Trajet** : ~20 min vers Genève, sans voiture. » → « - **Trajet** : 20 min de Genève-Eaux-Vives en Léman Express, porte-à-po… »
-- [170] coliving-transfrontalier-geneve-annemasse-nouvelle-vie/en · D1 : « - **Commute**: ~20 min to Geneva, no car. » → « - **Commute**: 20 min from Geneva Eaux-Vives by Léman Express, door to … »
-- [171] living-in-france-working-in-geneva/fr · D1 : « [Le trajet Annemasse–Genève Cornavin dure environ 20 minutes](https://w… » → « [Le trajet Annemasse–Genève-Eaux-Vives dure 7 minutes, Annemasse–Cornav… »
-- [172] living-in-france-working-in-geneva/en · D1 : « [The Annemasse–Geneva Cornavin journey takes about 20 minutes](https://… » → « [The Annemasse–Geneva Eaux-Vives journey takes 7 minutes, Annemasse–Cor… »
-- [173] choc-culturel-franco-suisse-expatrie-geneve/fr · D1 : « dans 3 maisons côté France, à 20 minutes du centre de Genève porte à po… » → « dans 3 maisons côté France, à 20 min de Genève-Eaux-Vives en Léman Expr… »
-- [174] ecole-internationale-geneve-frontalier-ou-habiter/fr · D1 : « relie Annemasse au centre de Genève en ~20 min, ce qui ouvre » → « relie Annemasse à Genève-Eaux-Vives en 7 min et à Cornavin en 23 min, c… »
-- [175] ecole-internationale-geneve-frontalier-ou-habiter/en · D1 : « links Annemasse to central Geneva in ~20 min, opening up » → « links Annemasse to Geneva Eaux-Vives in 7 min and Cornavin in 23 min, o… »

COMMIT;

-- ── Vérification (lecture seule) : une ligne par article ; fr_ok / en_ok = true quand toutes les modifications de la langue sont en place, NULL = langue non touchée.
SELECT slug,
  CASE slug
    WHEN 'allocations-familiales-frontalier-geneve-2026' THEN (position($f$[coliving tout inclus à 20 min de Genève](/blog/trouver-colocation-geneve-frontalier)$f$ IN content_fr) = 0)
    WHEN 'budget-colocation-geneve-guide-complet' THEN (position($f$pour vivre confortablement à 20 minutes de Genève, par exemple$f$ IN content_fr) = 0
      AND position($f$[Annemasse↔Genève Cornavin en 20 minutes, directement](https://www.lemanexpress.com/)$f$ IN content_fr) = 0
      AND position($f$On parle de 20 minutes de trajet, pas de 2 heures.$f$ IN content_fr) = 0
      AND position($f$accès direct Genève en 20 min.$f$ IN content_fr) = 0)
    WHEN 'choc-culturel-franco-suisse-expatrie-geneve' THEN (position($f$dans 3 maisons côté France, à 20 minutes du centre de Genève porte à porte.$f$ IN content_fr) = 0)
    WHEN 'coliving-annemasse-geneve-frontaliers-avantages' THEN (position($f$Située à seulement 20 minutes de Genève en [Léman Express](https://www.lemanexpress.com/), **Annemasse**$f$ IN content_fr) = 0
      AND position($f$- **20 minutes** du centre de Genève en Léman Express$f$ IN content_fr) = 0
      AND position($f$Et Genève, à quelques minutes, enrichit encore l'offre$f$ IN content_fr) = 0)
    WHEN 'coliving-geneve-frontaliers-guide-complet' THEN (position($f$À Annemasse par exemple, tu restes à quelques minutes de ton lieu de travail tout en bénéficiant$f$ IN content_fr) = 0
      AND position($f$**Proximité de Genève** : 20 minutes en transport en commun pour rejoindre le centre de Genève$f$ IN content_fr) = 0
      AND position($f$🚊 15 min de Genève en transports$f$ IN facebook_post_fr) = 0
      AND position($f$✨ 1 430 CHF/mois tout inclus à Annemasse$f$ IN facebook_post_fr) = 0)
    WHEN 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie' THEN (position($f$## Le matin : 20 minutes, porte à porte$f$ IN content_fr) = 0
      AND position($f$le centre de Genève est à environ 20 minutes en Léman Express ou [en tram](https://www.tpg.ch/).$f$ IN content_fr) = 0
      AND position($f$- **Trajet** : ~20 min vers Genève, sans voiture.$f$ IN content_fr) = 0)
    WHEN 'cout-de-la-vie-suisse-france-frontalier-2026' THEN (position($f$qu'à Annemasse, à 20 minutes de là.$f$ IN content_fr) = 0
      AND position($f$[colocation tout inclus à 20 min de Genève](/blog/trouver-colocation-geneve-frontalier)$f$ IN content_fr) = 0)
    WHEN 'cout-transport-frontalier-geneve-2026' THEN (position($f$relie Annemasse à Genève en 20 minutes, avec des trains toutes les 10 minutes en pointe$f$ IN content_fr) = 0
      AND position($f$Les trois maisons de La Villa Coliving sont toutes à moins de 10 minutes de la gare d'Annemasse.$f$ IN content_fr) = 0)
    WHEN 'ecole-internationale-geneve-frontalier-ou-habiter' THEN (position($f$[coliving tout inclus à 20 min de Genève](/blog/trouver-colocation-geneve-frontalier)$f$ IN content_fr) = 0
      AND position($f$relie Annemasse au centre de Genève en ~20 min, ce qui ouvre$f$ IN content_fr) = 0)
    WHEN 'espaces-verts-coliving-lodge-annemasse' THEN (position($f$un vrai jardin à 20 minutes de Genève —$f$ IN content_fr) = 0
      AND position($f$- À 20 minutes de Genève, côté France.$f$ IN content_fr) = 0)
    WHEN 'guide-ressources-frontalier-geneve' THEN (position($f$des maisons de chambres meublées tout inclus à une vingtaine de minutes de Genève, côté France, pensées pour$f$ IN content_fr) = 0
      AND position($f$| Léman Express | ~115 CHF | ~20 min | Très élevée |$f$ IN content_fr) = 0
      AND position($f$| Centre (Cornavin) | Léman Express direct | ~22 min |$f$ IN content_fr) = 0
      AND position($f$| CERN (Meyrin) | Léman Express → Cornavin + tram 18 | 50 à 55 min |
| Aéroport / Palexpo | Léman Express direct depuis Annemasse | ~30 min |$f$ IN content_fr) = 0)
    WHEN 'living-in-france-working-in-geneva' THEN (position($f$[Le trajet Annemasse–Genève Cornavin dure environ 20 minutes](https://www.lemanexpress.com/)$f$ IN content_fr) = 0)
    WHEN 'lodge-annemasse-coliving-premium-portes-geneve' THEN (position($f$notre maison d'Annemasse, à quelques minutes seulement de la frontière suisse.$f$ IN content_fr) = 0
      AND position($f$Le Léman Express relie la gare d'Annemasse à Cornavin en 20 minutes, et le tram 17$f$ IN content_fr) = 0
      AND position($f$La gare d'Annemasse — et son Léman Express — est à environ 9 minutes à pied.$f$ IN content_fr) = 0
      AND position($f$à environ 9 minutes à pied de la gare d'Annemasse, soit 20 minutes de Cornavin en Léman Express$f$ IN content_fr) = 0
      AND position($f$tout compris à 1 430 CHF/mois. À 10 minutes de Genève, à des années-lumière$f$ IN facebook_post_fr) = 0)
    WHEN 'organisations-internationales-geneve-ou-habiter' THEN (position($f$La réponse pragmatique : côté France, à 20-30 minutes de trajet.$f$ IN content_fr) = 0
      AND position($f$la gare de Cornavin (22 min en Léman Express depuis Annemasse)$f$ IN content_fr) = 0
      AND position($f$côté France à 20 minutes du centre de Genève porte à porte.$f$ IN content_fr) = 0)
    WHEN 'ou-habiter-frontalier-suisse-villes-france-pas-cher' THEN (position($f$**Temps de trajet** : 15-20 min [en Léman Express](https://www.lemanexpress.com/)$f$ IN content_fr) = 0
      AND position($f$Le Léman Express te dépose à Cornavin en 20 minutes.$f$ IN content_fr) = 0
      AND position($f$**Temps de trajet** : 12 min en voiture, 20 min en bus$f$ IN content_fr) = 0
      AND position($f$plusieurs lignes TPN qui filent direct sur Genève.$f$ IN content_fr) = 0
      AND position($f$**Frontière à pied** : 5 min · **Temps de trajet Genève** : 10 min en voiture, 10 min en Tram, 20 min en CEVA$f$ IN content_fr) = 0
      AND position($f$Ambilly est la commune française la plus proche de la frontière : compte 5 minutes à pied jusqu'au poste de douane.$f$ IN content_fr) = 0
      AND position($f$- Un **tram Annemasse-Genève** est prévu pour **2027**, en plus du Tram 17 déjà direct sur Genève.$f$ IN content_fr) = 0
      AND position($f$| Annemasse | 15-20 min |$f$ IN content_fr) = 0
      AND position($f$| **Ville-la-Grand** | **12-20 min** |$f$ IN content_fr) = 0
      AND position($f$les bus transfrontaliers TPG/TPN$f$ IN content_fr) = 0
      AND position($f$3 maisons côté France, à 20 minutes du centre de Genève porte à porte, chambre meublée$f$ IN content_fr) = 0)
    WHEN 'permis-g-frontalier-geneve' THEN (position($f$dans une maison à 20 minutes de Genève te donne$f$ IN content_fr) = 0)
    WHEN 'quartiers-annemasse-ou-vivre-selon-profil' THEN (position($f$une **agglomération de communes mitoyennes**, collée à la frontière genevoise :$f$ IN content_fr) = 0
      AND position($f$- **Ville-la-Grand** — résidentiel et familial, frontière mitoyenne au nord-est.$f$ IN content_fr) = 0
      AND position($f$la **gare d'Annemasse** (terminus français du Léman Express, Genève en moins de 15 min)$f$ IN content_fr) = 0
      AND position($f$Le Léman Express te dépose à Genève-Eaux-Vives en ~15 min, à Cornavin en ~22 min, avec une fréquence de 2 à 4 trains par heure selon le moment.$f$ IN content_fr) = 0
      AND position($f$Depuis là, Genève se rejoint à vélo en quelques minutes par les pistes cyclables transfrontalières, ou en **Tram 17** (terminus côté français à Moillesulaz). Notre [Loft, à Ambilly](/leloft), est à 5 minutes à pied du Tram 17 — Genève centre en ~20 min sans changement, et sa piscine intérieure$f$ IN content_fr) = 0
      AND position($f$tout en restant à 10-15 min de la gare et de la frontière. Notre maison [La Villa, à Ville-la-Grand](/lavilla), est dans ce registre résidentiel, frontière mitoyenne.$f$ IN content_fr) = 0
      AND position($f$Évite les abords immédiats de l'**autoroute A40** et des grands axes$f$ IN content_fr) = 0
      AND position($f$[Le Lodge à Annemasse](/lelodge) (Léman Express et Tram 17 à pied), [Le Loft à Ambilly](/leloft) (Léman Express et Tram 17 à pied), [La Villa à Ville-la-Grand](/lavilla) (Léman Express et Tram 17 à pied)$f$ IN content_fr) = 0)
    WHEN 'quitter-son-logement-guide-pratique' THEN (position($f$[coliving tout inclus à 20 min de Genève](/blog/trouver-colocation-geneve-frontalier)$f$ IN content_fr) = 0)
    WHEN 'salaire-suisse-net-frontalier-2026' THEN (position($f$[coliving tout inclus à 20 min de Genève](/blog/trouver-colocation-geneve-frontalier)$f$ IN content_fr) = 0
      AND position($f$vivre côté France à 20 minutes de Genève, c'est$f$ IN content_fr) = 0)
    WHEN 'temps-trajet-annemasse-geneve-par-quartier' THEN (position($f$Ville-la-Grand est la commune la plus proche de la frontière suisse.$f$ IN content_fr) = 0
      AND position($f$En **Léman Express** depuis Annemasse (gare à 10 min à pied ou 3 min en vélo de Ville-la-Grand) : 20 minutes jusqu'à Cornavin, trains toutes les 15 minutes aux heures de pointe.$f$ IN content_fr) = 0
      AND position($f$En **bus** (ligne D ou tpg 61) : 35-50 minutes selon la circulation.$f$ IN content_fr) = 0
      AND position($f$Léman Express, sans hésitation. 20 minutes, prévisible, 80 CHF/mois d'abonnement.$f$ IN content_fr) = 0
      AND position($f$Léman Express jusqu'à Cornavin (20 min) + tram 18$f$ IN content_fr) = 0
      AND position($f$La gare d'Annemasse est à 5-8 minutes en vélo depuis Ambilly.$f$ IN content_fr) = 0
      AND position($f$est à Annemasse, à environ 9 minutes à pied de la gare.$f$ IN content_fr) = 0
      AND position($f$| Léman Express (abonnement) | ~80 CHF | 20 min |$f$ IN content_fr) = 0
      AND position($f$La Villa à Ville-la-Grand est à moins de 10 minutes à pied de la gare d'Annemasse. Le Loft à Ambilly, à 8 minutes en vélo. Le Lodge à Annemasse, à environ 9 minutes à pied.$f$ IN content_fr) = 0
      AND position($f$La Villa (10 chambres) est à 10 min de la gare.$f$ IN content_fr) = 0
      AND position($f$Annemasse avec Léman Express jusqu'à Genève-Aéroport (30 min, direct).$f$ IN content_fr) = 0)
    WHEN 'transport-annemasse-geneve-leman-express' THEN (position($f$**Temps** : Annemasse-Genève-Cornavin = 20 minutes. Aéroport (Cointrin) = 25 minutes de Annemasse.$f$ IN content_fr) = 0
      AND position($f$[Toutes les 15 min en heures de pointe](https://www.lemanexpress.com/)$f$ IN content_fr) = 0
      AND position($f$À Ville-la-Grand, c'est 10-15 min à pied. À Ambilly, c'est loin.$f$ IN content_fr) = 0
      AND position($f$**Temps** : Annemasse-Genève-centre = 35-40 minutes (piste cyclable).$f$ IN content_fr) = 0
      AND position($f$| Léman Express | 200€ | 20 min | Bas | 9/10 |$f$ IN content_fr) = 0
      AND position($f$| Vélo | 0€ | 35-40 min | Bas | 5/10 (été) |$f$ IN content_fr) = 0
      AND position($f$| Centre (Cornavin) | 22 min | 20-25 → 40-55 min | 35-50 min | 30-40 min |$f$ IN content_fr) = 0
      AND position($f$| CERN (Meyrin) | 50-55 min (Cornavin 22 min + tram 18) |$f$ IN content_fr) = 0
      AND position($f$La gare d'Annemasse est à 10 min à pied (ou 3 min en vélo) de Ville-la-Grand.$f$ IN content_fr) = 0
      AND position($f$La gare d'Annemasse est à 5-8 min en vélo.$f$ IN content_fr) = 0
      AND position($f$Vers l'aéroport, le Léman Express est direct (30 min).$f$ IN content_fr) = 0
      AND position($f$- **Aéroport** : Annemasse, Léman Express direct jusqu'à Genève-Aéroport (30 min).$f$ IN content_fr) = 0)
    WHEN 'trouver-colocation-geneve-frontalier' THEN (position($f$— à 20 minutes du centre en Léman Express, pour des loyers$f$ IN content_fr) = 0
      AND position($f$à 20 minutes de Genève côté France. Tu arrives avec ta valise.$f$ IN content_fr) = 0
      AND position($f$trois maisons situées à 20 minutes du centre de Genève, côté France :$f$ IN content_fr) = 0
      AND position($f$tout en restant à 20 minutes en transports.$f$ IN content_fr) = 0
      AND position($f$à 20 minutes du centre de Genève côté France, dès$f$ IN content_fr) = 0
      AND position($f$**côté France** (20 min, 30-50 % moins cher)$f$ IN content_fr) = 0
      AND position($f$[notre coliving à 20 minutes de Genève](/)$f$ IN content_fr) = 0)
  END AS fr_ok,
  CASE slug
    WHEN 'allocations-familiales-frontalier-geneve-2026' THEN (position($f$[all-inclusive coliving 20 min from Geneva](/en/colocation-geneve)$f$ IN content_en) = 0)
    WHEN 'budget-colocation-geneve-guide-complet' THEN (position($f$for living comfortably 20 minutes door-to-door from Geneva.$f$ IN content_en) = 0
      AND position($f$[Léman Express connecting Annemasse to Geneva Cornavin in 20 minutes](https://www.lemanexpress.com/en/)$f$ IN content_en) = 0
      AND position($f$with direct Geneva access in 20 min.$f$ IN content_en) = 0)
    WHEN 'coliving-annemasse-geneve-frontaliers-avantages' THEN (position($f$Located just 20 minutes from Geneva on the [Léman Express](https://www.lemanexpress.com/), **Annemasse**$f$ IN content_en) = 0
      AND position($f$- **20 minutes** from Geneva center on the Léman Express$f$ IN content_en) = 0
      AND position($f$And Geneva, just minutes away, enriches the offering even further$f$ IN content_en) = 0)
    WHEN 'coliving-geneve-frontaliers-guide-complet' THEN (position($f$In Annemasse, for example, you stay just minutes from your workplace while benefiting from French cost of living.$f$ IN content_en) = 0
      AND position($f$**Geneva proximity**: 20 minutes by public transport to reach Geneva center$f$ IN content_en) = 0
      AND position($f$🚊 15 min from Geneva by transport$f$ IN facebook_post_en) = 0
      AND position($f$✨ 1,430 CHF/month all-inclusive in Annemasse$f$ IN facebook_post_en) = 0)
    WHEN 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie' THEN (position($f$## Mornings: 20 minutes, door to door$f$ IN content_en) = 0
      AND position($f$central Geneva is about 20 minutes away by Léman Express [or tram](https://www.tpg.ch/).$f$ IN content_en) = 0
      AND position($f$- **Commute**: ~20 min to Geneva, no car.$f$ IN content_en) = 0)
    WHEN 'cout-de-la-vie-suisse-france-frontalier-2026' THEN (position($f$than in Annemasse, 20 minutes away.$f$ IN content_en) = 0
      AND position($f$[all-inclusive coliving 20 min from Geneva](/en/colocation-geneve)$f$ IN content_en) = 0)
    WHEN 'cout-transport-frontalier-geneve-2026' THEN (position($f$connects Annemasse to Geneva in 20 minutes, with trains every 10 minutes during rush hour$f$ IN content_en) = 0
      AND position($f$La Villa Coliving's three houses are all within 10 minutes of Annemasse station.$f$ IN content_en) = 0)
    WHEN 'ecole-internationale-geneve-frontalier-ou-habiter' THEN (position($f$[all-inclusive coliving 20 min from Geneva](/en/colocation-geneve)$f$ IN content_en) = 0
      AND position($f$links Annemasse to central Geneva in ~20 min, opening up$f$ IN content_en) = 0)
    WHEN 'espaces-verts-coliving-lodge-annemasse' THEN (position($f$a real garden 20 minutes from Geneva —$f$ IN content_en) = 0
      AND position($f$- 20 minutes from Geneva, on the French side.$f$ IN content_en) = 0)
    WHEN 'guide-ressources-frontalier-geneve' THEN (position($f$a set of houses with all-inclusive furnished rooms about twenty minutes from Geneva, on the French side, designed for$f$ IN content_en) = 0
      AND position($f$| Léman Express | ~115 CHF | ~20 min | Very high |$f$ IN content_en) = 0
      AND position($f$| Centre (Cornavin) | Léman Express direct | ~22 min |$f$ IN content_en) = 0
      AND position($f$| CERN (Meyrin) | Léman Express → Cornavin + tram 18 | 50 to 55 min |
| Airport / Palexpo | Léman Express direct from Annemasse | ~30 min |$f$ IN content_en) = 0)
    WHEN 'living-in-france-working-in-geneva' THEN (position($f$[The Annemasse–Geneva Cornavin journey takes about 20 minutes](https://www.lemanexpress.com/)$f$ IN content_en) = 0)
    WHEN 'lodge-annemasse-coliving-premium-portes-geneve' THEN (position($f$our house in Annemasse, just minutes from the Swiss border.$f$ IN content_en) = 0
      AND position($f$The Léman Express connects Annemasse station to Cornavin in 20 minutes, and tram 17$f$ IN content_en) = 0
      AND position($f$Annemasse station — and its Léman Express — is about a 9-minute walk away.$f$ IN content_en) = 0
      AND position($f$about 9 minutes' walk from Annemasse station, i.e. 20 minutes from Cornavin by Léman Express$f$ IN content_en) = 0
      AND position($f$all-inclusive at 1,430 CHF/month. 10 minutes from Geneva, light-years$f$ IN facebook_post_en) = 0)
    WHEN 'organisations-internationales-geneve-ou-habiter' THEN (position($f$The pragmatic answer: on the French side, 20-30 minutes away.$f$ IN content_en) = 0
      AND position($f$Cornavin station (22 min by Léman Express from Annemasse)$f$ IN content_en) = 0)
    WHEN 'ou-habiter-frontalier-suisse-villes-france-pas-cher' THEN (position($f$**Commute**: [15-20 min by Léman Express](https://www.lemanexpress.com/)$f$ IN content_en) = 0
      AND position($f$The Léman Express drops you at Cornavin in 20 minutes.$f$ IN content_en) = 0
      AND position($f$**Commute**: 12 min by car, 20 min by bus$f$ IN content_en) = 0
      AND position($f$several TPN bus lines straight to Geneva.$f$ IN content_en) = 0
      AND position($f$**Walk to border**: 5 min · **Commute to Geneva**: 10 min by car, 10 min by tram, 20 min by CEVA$f$ IN content_en) = 0
      AND position($f$Ambilly is the closest French town to the border — about a 5-minute walk to the border crossing.$f$ IN content_en) = 0
      AND position($f$- An **Annemasse-Geneva tram** is planned for **2027**.$f$ IN content_en) = 0
      AND position($f$| Annemasse | 15-20 min |$f$ IN content_en) = 0
      AND position($f$| **Ville-la-Grand** | **12-20 min** |$f$ IN content_en) = 0
      AND position($f$the cross-border TPG/TPN buses$f$ IN content_en) = 0)
    WHEN 'permis-g-frontalier-geneve' THEN (position($f$in a house 20 minutes from Geneva gives you$f$ IN content_en) = 0)
    WHEN 'quartiers-annemasse-ou-vivre-selon-profil' THEN (position($f$a **cluster of adjoining towns**, pressed against the Geneva border:$f$ IN content_en) = 0
      AND position($f$- **Ville-la-Grand** — residential and family-friendly, border-adjacent to the northeast.$f$ IN content_en) = 0
      AND position($f$the **Annemasse station** (French terminus of the Léman Express, Geneva in under 15 min)$f$ IN content_en) = 0
      AND position($f$The Léman Express drops you at Geneva-Eaux-Vives in ~15 min, Cornavin in ~22 min, with 2 to 4 trains per hour depending on the time.$f$ IN content_en) = 0
      AND position($f$From there, Geneva is a few minutes by bike via the cross-border cycle paths, or by **Tram 17** (French terminus at Moillesulaz). Our [Loft, in Ambilly](/en/leloft), is 5 minutes' walk from Tram 17 — central Geneva in ~20 min with no change, plus an indoor pool$f$ IN content_en) = 0
      AND position($f$while staying 10-15 min from the station and the border. Our [Villa, in Ville-la-Grand](/en/lavilla), fits this residential register, border-adjacent.$f$ IN content_en) = 0
      AND position($f$Avoid the immediate surroundings of the **A40 motorway** and major roads$f$ IN content_en) = 0
      AND position($f$[Le Lodge in Annemasse](/en/lelodge) (Léman Express and Tram 17 on foot), [Le Loft in Ambilly](/en/leloft) (Léman Express and Tram 17 on foot), [La Villa in Ville-la-Grand](/en/lavilla) (Léman Express and Tram 17 on foot)$f$ IN content_en) = 0)
    WHEN 'quitter-son-logement-guide-pratique' THEN (position($f$[all-inclusive coliving 20 min from Geneva](/en/colocation-geneve)$f$ IN content_en) = 0)
    WHEN 'salaire-suisse-net-frontalier-2026' THEN (position($f$[all-inclusive coliving 20 min from Geneva](/en/colocation-geneve)$f$ IN content_en) = 0
      AND position($f$living on the French side at 20 min from Geneva is$f$ IN content_en) = 0)
    WHEN 'temps-trajet-annemasse-geneve-par-quartier' THEN (position($f$Ville-la-Grand is the closest municipality to the Swiss border.$f$ IN content_en) = 0
      AND position($f$By **Léman Express** from Annemasse (station 10 min walk or 3 min bike from Ville-la-Grand): 20 minutes to Cornavin, trains every 15 minutes during rush hour.$f$ IN content_en) = 0
      AND position($f$By **bus** (line D or tpg 61): 35-50 minutes depending on traffic.$f$ IN content_en) = 0
      AND position($f$Léman Express, without hesitation. 20 minutes, predictable, 80 CHF/month subscription.$f$ IN content_en) = 0
      AND position($f$Léman Express to Cornavin (20 min) + tram 18$f$ IN content_en) = 0
      AND position($f$Annemasse station is 5-8 minutes by bike from Ambilly.$f$ IN content_en) = 0
      AND position($f$is in Annemasse, about a 9-minute walk from the station.$f$ IN content_en) = 0
      AND position($f$| Léman Express (pass) | ~80 CHF | 20 min |$f$ IN content_en) = 0
      AND position($f$La Villa in Ville-la-Grand is less than a 10-minute walk from Annemasse station. Le Loft in Ambilly, 8 minutes by bike. Le Lodge in Annemasse, about a 9-minute walk.$f$ IN content_en) = 0
      AND position($f$La Villa (10 rooms) is 10 min from the station.$f$ IN content_en) = 0
      AND position($f$Annemasse with Léman Express to Geneva Airport (30 min, direct).$f$ IN content_en) = 0)
    WHEN 'transport-annemasse-geneve-leman-express' THEN (position($f$**Time**: Annemasse-Geneva-Cornavin = 20 minutes. Airport (Cointrin) = 25 minutes from Annemasse.$f$ IN content_en) = 0
      AND position($f$[Every 15 min peak hours](https://www.lemanexpress.com/en/)$f$ IN content_en) = 0
      AND position($f$Ville-la-Grand: 10-15 min walk. Ambilly: far.$f$ IN content_en) = 0
      AND position($f$**Time**: Annemasse-Geneva-center = 35-40 min (bike path).$f$ IN content_en) = 0
      AND position($f$| Léman Express | 200€ | 20 min | Low | 9/10 |$f$ IN content_en) = 0
      AND position($f$| Bike | 0€ | 35-40 min | Low | 5/10 (summer) |$f$ IN content_en) = 0
      AND position($f$| Center (Cornavin) | 22 min | 20-25 → 40-55 min | 35-50 min | 30-40 min |$f$ IN content_en) = 0
      AND position($f$| CERN (Meyrin) | 50-55 min (Cornavin 22 min + tram 18) |$f$ IN content_en) = 0
      AND position($f$Annemasse station is a 10-min walk (or 3-min bike ride) from Ville-la-Grand.$f$ IN content_en) = 0
      AND position($f$Annemasse station is 5-8 min by bike.$f$ IN content_en) = 0
      AND position($f$To the airport, the Léman Express is direct (30 min).$f$ IN content_en) = 0
      AND position($f$- **Airport**: Annemasse, direct Léman Express to Geneva Airport (30 min).$f$ IN content_en) = 0)
    WHEN 'trouver-colocation-geneve-frontalier' THEN (position($f$— 20 minutes from the center by Léman Express, for rents$f$ IN content_en) = 0
      AND position($f$20 minutes from Geneva on the French side. You arrive with your suitcase.$f$ IN content_en) = 0
      AND position($f$three houses located 20 minutes from Geneva city center, on the French side:$f$ IN content_en) = 0
      AND position($f$while staying 20 minutes away by public transport.$f$ IN content_en) = 0
      AND position($f$20 minutes from Geneva city center on the French side, from$f$ IN content_en) = 0
      AND position($f$**on the French side** (20 min, 30-50% cheaper)$f$ IN content_en) = 0)
  END AS en_ok
FROM blog_posts
WHERE slug IN ('allocations-familiales-frontalier-geneve-2026', 'budget-colocation-geneve-guide-complet', 'choc-culturel-franco-suisse-expatrie-geneve', 'coliving-annemasse-geneve-frontaliers-avantages', 'coliving-geneve-frontaliers-guide-complet', 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie', 'cout-de-la-vie-suisse-france-frontalier-2026', 'cout-transport-frontalier-geneve-2026', 'ecole-internationale-geneve-frontalier-ou-habiter', 'espaces-verts-coliving-lodge-annemasse', 'guide-ressources-frontalier-geneve', 'living-in-france-working-in-geneva', 'lodge-annemasse-coliving-premium-portes-geneve', 'organisations-internationales-geneve-ou-habiter', 'ou-habiter-frontalier-suisse-villes-france-pas-cher', 'permis-g-frontalier-geneve', 'quartiers-annemasse-ou-vivre-selon-profil', 'quitter-son-logement-guide-pratique', 'salaire-suisse-net-frontalier-2026', 'temps-trajet-annemasse-geneve-par-quartier', 'transport-annemasse-geneve-leman-express', 'trouver-colocation-geneve-frontalier')
ORDER BY slug;

-- ── Retour arrière (inverse exact, mêmes gardes miroir) : retirer les deux lignes /* et */ puis exécuter le bloc.
/*
BEGIN;

UPDATE blog_posts
SET content_en = replace(content_en, $r$links Annemasse to Geneva Eaux-Vives in 7 min and Cornavin in 23 min, opening up$r$, $f$links Annemasse to central Geneva in ~20 min, opening up$f$),
    updated_at = now()
WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
  AND position($r$links Annemasse to Geneva Eaux-Vives in 7 min and Cornavin in 23 min, opening up$r$ IN content_en) > 0
  AND position($f$links Annemasse to central Geneva in ~20 min, opening up$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$relie Annemasse à Genève-Eaux-Vives en 7 min et à Cornavin en 23 min, ce qui ouvre$r$, $f$relie Annemasse au centre de Genève en ~20 min, ce qui ouvre$f$),
    updated_at = now()
WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
  AND position($r$relie Annemasse à Genève-Eaux-Vives en 7 min et à Cornavin en 23 min, ce qui ouvre$r$ IN content_fr) > 0
  AND position($f$relie Annemasse au centre de Genève en ~20 min, ce qui ouvre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$dans 3 maisons côté France, à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte.$r$, $f$dans 3 maisons côté France, à 20 minutes du centre de Genève porte à porte.$f$),
    updated_at = now()
WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve'
  AND position($r$dans 3 maisons côté France, à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte.$r$ IN content_fr) > 0
  AND position($f$dans 3 maisons côté France, à 20 minutes du centre de Genève porte à porte.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[The Annemasse–Geneva Eaux-Vives journey takes 7 minutes, Annemasse–Cornavin 23 minutes](https://www.lemanexpress.com/)$r$, $f$[The Annemasse–Geneva Cornavin journey takes about 20 minutes](https://www.lemanexpress.com/)$f$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($r$[The Annemasse–Geneva Eaux-Vives journey takes 7 minutes, Annemasse–Cornavin 23 minutes](https://www.lemanexpress.com/)$r$ IN content_en) > 0
  AND position($f$[The Annemasse–Geneva Cornavin journey takes about 20 minutes](https://www.lemanexpress.com/)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[Le trajet Annemasse–Genève-Eaux-Vives dure 7 minutes, Annemasse–Cornavin 23 minutes](https://www.lemanexpress.com/)$r$, $f$[Le trajet Annemasse–Genève Cornavin dure environ 20 minutes](https://www.lemanexpress.com/)$f$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($r$[Le trajet Annemasse–Genève-Eaux-Vives dure 7 minutes, Annemasse–Cornavin 23 minutes](https://www.lemanexpress.com/)$r$ IN content_fr) > 0
  AND position($f$[Le trajet Annemasse–Genève Cornavin dure environ 20 minutes](https://www.lemanexpress.com/)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$- **Commute**: 20 min from Geneva Eaux-Vives by Léman Express, door to door, no car.$r$, $f$- **Commute**: ~20 min to Geneva, no car.$f$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($r$- **Commute**: 20 min from Geneva Eaux-Vives by Léman Express, door to door, no car.$r$ IN content_en) > 0
  AND position($f$- **Commute**: ~20 min to Geneva, no car.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$- **Trajet** : 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, sans voiture.$r$, $f$- **Trajet** : ~20 min vers Genève, sans voiture.$f$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($r$- **Trajet** : 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, sans voiture.$r$ IN content_fr) > 0
  AND position($f$- **Trajet** : ~20 min vers Genève, sans voiture.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$you are 20 min from Geneva Eaux-Vives by Léman Express, door to door, and 30 minutes from the city centre (Rive), by train [or tram](https://www.tpg.ch/).$r$, $f$central Geneva is about 20 minutes away by Léman Express [or tram](https://www.tpg.ch/).$f$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($r$you are 20 min from Geneva Eaux-Vives by Léman Express, door to door, and 30 minutes from the city centre (Rive), by train [or tram](https://www.tpg.ch/).$r$ IN content_en) > 0
  AND position($f$central Geneva is about 20 minutes away by Léman Express [or tram](https://www.tpg.ch/).$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$tu es à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, et à 30 minutes du centre (Rive), en train ou [en tram](https://www.tpg.ch/).$r$, $f$le centre de Genève est à environ 20 minutes en Léman Express ou [en tram](https://www.tpg.ch/).$f$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($r$tu es à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, et à 30 minutes du centre (Rive), en train ou [en tram](https://www.tpg.ch/).$r$ IN content_fr) > 0
  AND position($f$le centre de Genève est à environ 20 minutes en Léman Express ou [en tram](https://www.tpg.ch/).$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$## Mornings: 20 min from Geneva Eaux-Vives by Léman Express, door to door$r$, $f$## Mornings: 20 minutes, door to door$f$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($r$## Mornings: 20 min from Geneva Eaux-Vives by Léman Express, door to door$r$ IN content_en) > 0
  AND position($f$## Mornings: 20 minutes, door to door$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$## Le matin : 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte$r$, $f$## Le matin : 20 minutes, porte à porte$f$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($r$## Le matin : 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte$r$ IN content_fr) > 0
  AND position($f$## Le matin : 20 minutes, porte à porte$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[notre coliving à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte](/)$r$, $f$[notre coliving à 20 minutes de Genève](/)$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$[notre coliving à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte](/)$r$ IN content_fr) > 0
  AND position($f$[notre coliving à 20 minutes de Genève](/)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**on the French side** (20 min from Geneva Eaux-Vives by Léman Express, door to door, 30-50% cheaper)$r$, $f$**on the French side** (20 min, 30-50% cheaper)$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$**on the French side** (20 min from Geneva Eaux-Vives by Léman Express, door to door, 30-50% cheaper)$r$ IN content_en) > 0
  AND position($f$**on the French side** (20 min, 30-50% cheaper)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$**côté France** (20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, 30-50 % moins cher)$r$, $f$**côté France** (20 min, 30-50 % moins cher)$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$**côté France** (20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, 30-50 % moins cher)$r$ IN content_fr) > 0
  AND position($f$**côté France** (20 min, 30-50 % moins cher)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$on the French side, 20 min from Geneva Eaux-Vives by Léman Express, door to door, from$r$, $f$20 minutes from Geneva city center on the French side, from$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$on the French side, 20 min from Geneva Eaux-Vives by Léman Express, door to door, from$r$ IN content_en) > 0
  AND position($f$20 minutes from Geneva city center on the French side, from$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$côté France, à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, dès$r$, $f$à 20 minutes du centre de Genève côté France, dès$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$côté France, à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, dès$r$ IN content_fr) > 0
  AND position($f$à 20 minutes du centre de Genève côté France, dès$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$while staying 20 min from Geneva Eaux-Vives by Léman Express, door to door.$r$, $f$while staying 20 minutes away by public transport.$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$while staying 20 min from Geneva Eaux-Vives by Léman Express, door to door.$r$ IN content_en) > 0
  AND position($f$while staying 20 minutes away by public transport.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$tout en restant à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte.$r$, $f$tout en restant à 20 minutes en transports.$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$tout en restant à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte.$r$ IN content_fr) > 0
  AND position($f$tout en restant à 20 minutes en transports.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$three houses located on the French side, 20 min from Geneva Eaux-Vives by Léman Express, door to door:$r$, $f$three houses located 20 minutes from Geneva city center, on the French side:$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$three houses located on the French side, 20 min from Geneva Eaux-Vives by Léman Express, door to door:$r$ IN content_en) > 0
  AND position($f$three houses located 20 minutes from Geneva city center, on the French side:$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$trois maisons situées côté France, à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte :$r$, $f$trois maisons situées à 20 minutes du centre de Genève, côté France :$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$trois maisons situées côté France, à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte :$r$ IN content_fr) > 0
  AND position($f$trois maisons situées à 20 minutes du centre de Genève, côté France :$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$20 min from Geneva Eaux-Vives by Léman Express, door to door, on the French side. You arrive with your suitcase.$r$, $f$20 minutes from Geneva on the French side. You arrive with your suitcase.$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$20 min from Geneva Eaux-Vives by Léman Express, door to door, on the French side. You arrive with your suitcase.$r$ IN content_en) > 0
  AND position($f$20 minutes from Geneva on the French side. You arrive with your suitcase.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, côté France. Tu arrives avec ta valise.$r$, $f$à 20 minutes de Genève côté France. Tu arrives avec ta valise.$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, côté France. Tu arrives avec ta valise.$r$ IN content_fr) > 0
  AND position($f$à 20 minutes de Genève côté France. Tu arrives avec ta valise.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$— 20 min from Geneva Eaux-Vives by Léman Express, door to door, for rents$r$, $f$— 20 minutes from the center by Léman Express, for rents$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$— 20 min from Geneva Eaux-Vives by Léman Express, door to door, for rents$r$ IN content_en) > 0
  AND position($f$— 20 minutes from the center by Léman Express, for rents$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$— à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, pour des loyers$r$, $f$— à 20 minutes du centre en Léman Express, pour des loyers$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$— à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, pour des loyers$r$ IN content_fr) > 0
  AND position($f$— à 20 minutes du centre en Léman Express, pour des loyers$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$living on the French side 20 min from Geneva Eaux-Vives by Léman Express, door to door is$r$, $f$living on the French side at 20 min from Geneva is$f$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($r$living on the French side 20 min from Geneva Eaux-Vives by Léman Express, door to door is$r$ IN content_en) > 0
  AND position($f$living on the French side at 20 min from Geneva is$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$vivre côté France à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, c'est$r$, $f$vivre côté France à 20 minutes de Genève, c'est$f$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($r$vivre côté France à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, c'est$r$ IN content_fr) > 0
  AND position($f$vivre côté France à 20 minutes de Genève, c'est$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$in a house 20 min from Geneva Eaux-Vives by Léman Express, door to door gives you$r$, $f$in a house 20 minutes from Geneva gives you$f$),
    updated_at = now()
WHERE slug = 'permis-g-frontalier-geneve'
  AND position($r$in a house 20 min from Geneva Eaux-Vives by Léman Express, door to door gives you$r$ IN content_en) > 0
  AND position($f$in a house 20 minutes from Geneva gives you$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$dans une maison à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte te donne$r$, $f$dans une maison à 20 minutes de Genève te donne$f$),
    updated_at = now()
WHERE slug = 'permis-g-frontalier-geneve'
  AND position($r$dans une maison à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte te donne$r$ IN content_fr) > 0
  AND position($f$dans une maison à 20 minutes de Genève te donne$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[all-inclusive coliving 20 min from Geneva Eaux-Vives by Léman Express, door to door](/en/colocation-geneve)$r$, $f$[all-inclusive coliving 20 min from Geneva](/en/colocation-geneve)$f$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($r$[all-inclusive coliving 20 min from Geneva Eaux-Vives by Léman Express, door to door](/en/colocation-geneve)$r$ IN content_en) > 0
  AND position($f$[all-inclusive coliving 20 min from Geneva](/en/colocation-geneve)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[coliving tout inclus à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte](/blog/trouver-colocation-geneve-frontalier)$r$, $f$[coliving tout inclus à 20 min de Genève](/blog/trouver-colocation-geneve-frontalier)$f$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($r$[coliving tout inclus à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte](/blog/trouver-colocation-geneve-frontalier)$r$ IN content_fr) > 0
  AND position($f$[coliving tout inclus à 20 min de Genève](/blog/trouver-colocation-geneve-frontalier)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[all-inclusive coliving 20 min from Geneva Eaux-Vives by Léman Express, door to door](/en/colocation-geneve)$r$, $f$[all-inclusive coliving 20 min from Geneva](/en/colocation-geneve)$f$),
    updated_at = now()
WHERE slug = 'quitter-son-logement-guide-pratique'
  AND position($r$[all-inclusive coliving 20 min from Geneva Eaux-Vives by Léman Express, door to door](/en/colocation-geneve)$r$ IN content_en) > 0
  AND position($f$[all-inclusive coliving 20 min from Geneva](/en/colocation-geneve)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[coliving tout inclus à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte](/blog/trouver-colocation-geneve-frontalier)$r$, $f$[coliving tout inclus à 20 min de Genève](/blog/trouver-colocation-geneve-frontalier)$f$),
    updated_at = now()
WHERE slug = 'quitter-son-logement-guide-pratique'
  AND position($r$[coliving tout inclus à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte](/blog/trouver-colocation-geneve-frontalier)$r$ IN content_fr) > 0
  AND position($f$[coliving tout inclus à 20 min de Genève](/blog/trouver-colocation-geneve-frontalier)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[all-inclusive coliving 20 min from Geneva Eaux-Vives by Léman Express, door to door](/en/colocation-geneve)$r$, $f$[all-inclusive coliving 20 min from Geneva](/en/colocation-geneve)$f$),
    updated_at = now()
WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
  AND position($r$[all-inclusive coliving 20 min from Geneva Eaux-Vives by Léman Express, door to door](/en/colocation-geneve)$r$ IN content_en) > 0
  AND position($f$[all-inclusive coliving 20 min from Geneva](/en/colocation-geneve)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[coliving tout inclus à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte](/blog/trouver-colocation-geneve-frontalier)$r$, $f$[coliving tout inclus à 20 min de Genève](/blog/trouver-colocation-geneve-frontalier)$f$),
    updated_at = now()
WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
  AND position($r$[coliving tout inclus à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte](/blog/trouver-colocation-geneve-frontalier)$r$ IN content_fr) > 0
  AND position($f$[coliving tout inclus à 20 min de Genève](/blog/trouver-colocation-geneve-frontalier)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[all-inclusive coliving 20 min from Geneva Eaux-Vives by Léman Express, door to door](/en/colocation-geneve)$r$, $f$[all-inclusive coliving 20 min from Geneva](/en/colocation-geneve)$f$),
    updated_at = now()
WHERE slug = 'allocations-familiales-frontalier-geneve-2026'
  AND position($r$[all-inclusive coliving 20 min from Geneva Eaux-Vives by Léman Express, door to door](/en/colocation-geneve)$r$ IN content_en) > 0
  AND position($f$[all-inclusive coliving 20 min from Geneva](/en/colocation-geneve)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[coliving tout inclus à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte](/blog/trouver-colocation-geneve-frontalier)$r$, $f$[coliving tout inclus à 20 min de Genève](/blog/trouver-colocation-geneve-frontalier)$f$),
    updated_at = now()
WHERE slug = 'allocations-familiales-frontalier-geneve-2026'
  AND position($r$[coliving tout inclus à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte](/blog/trouver-colocation-geneve-frontalier)$r$ IN content_fr) > 0
  AND position($f$[coliving tout inclus à 20 min de Genève](/blog/trouver-colocation-geneve-frontalier)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[all-inclusive coliving 20 min from Geneva Eaux-Vives by Léman Express, door to door](/en/colocation-geneve)$r$, $f$[all-inclusive coliving 20 min from Geneva](/en/colocation-geneve)$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$[all-inclusive coliving 20 min from Geneva Eaux-Vives by Léman Express, door to door](/en/colocation-geneve)$r$ IN content_en) > 0
  AND position($f$[all-inclusive coliving 20 min from Geneva](/en/colocation-geneve)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[colocation tout inclus à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte](/blog/trouver-colocation-geneve-frontalier)$r$, $f$[colocation tout inclus à 20 min de Genève](/blog/trouver-colocation-geneve-frontalier)$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$[colocation tout inclus à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte](/blog/trouver-colocation-geneve-frontalier)$r$ IN content_fr) > 0
  AND position($f$[colocation tout inclus à 20 min de Genève](/blog/trouver-colocation-geneve-frontalier)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$than in Annemasse, 7 minutes from Geneva Eaux-Vives by Léman Express.$r$, $f$than in Annemasse, 20 minutes away.$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$than in Annemasse, 7 minutes from Geneva Eaux-Vives by Léman Express.$r$ IN content_en) > 0
  AND position($f$than in Annemasse, 20 minutes away.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$qu'à Annemasse, à 7 minutes de Genève-Eaux-Vives en Léman Express.$r$, $f$qu'à Annemasse, à 20 minutes de là.$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$qu'à Annemasse, à 7 minutes de Genève-Eaux-Vives en Léman Express.$r$ IN content_fr) > 0
  AND position($f$qu'à Annemasse, à 20 minutes de là.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$La Villa Coliving's three houses are a 10, 14 and 18-minute walk from Annemasse station (Le Lodge, La Villa, Le Loft).$r$, $f$La Villa Coliving's three houses are all within 10 minutes of Annemasse station.$f$),
    updated_at = now()
WHERE slug = 'cout-transport-frontalier-geneve-2026'
  AND position($r$La Villa Coliving's three houses are a 10, 14 and 18-minute walk from Annemasse station (Le Lodge, La Villa, Le Loft).$r$ IN content_en) > 0
  AND position($f$La Villa Coliving's three houses are all within 10 minutes of Annemasse station.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Les trois maisons de La Villa Coliving sont à 10, 14 et 18 minutes à pied de la gare d'Annemasse (Le Lodge, La Villa, Le Loft).$r$, $f$Les trois maisons de La Villa Coliving sont toutes à moins de 10 minutes de la gare d'Annemasse.$f$),
    updated_at = now()
WHERE slug = 'cout-transport-frontalier-geneve-2026'
  AND position($r$Les trois maisons de La Villa Coliving sont à 10, 14 et 18 minutes à pied de la gare d'Annemasse (Le Lodge, La Villa, Le Loft).$r$ IN content_fr) > 0
  AND position($f$Les trois maisons de La Villa Coliving sont toutes à moins de 10 minutes de la gare d'Annemasse.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$connects Annemasse to Geneva Eaux-Vives in 7 minutes and Cornavin in 23, with trains every 10 minutes during rush hour$r$, $f$connects Annemasse to Geneva in 20 minutes, with trains every 10 minutes during rush hour$f$),
    updated_at = now()
WHERE slug = 'cout-transport-frontalier-geneve-2026'
  AND position($r$connects Annemasse to Geneva Eaux-Vives in 7 minutes and Cornavin in 23, with trains every 10 minutes during rush hour$r$ IN content_en) > 0
  AND position($f$connects Annemasse to Geneva in 20 minutes, with trains every 10 minutes during rush hour$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$relie Annemasse à Genève-Eaux-Vives en 7 minutes et à Cornavin en 23, avec des trains toutes les 10 minutes en pointe$r$, $f$relie Annemasse à Genève en 20 minutes, avec des trains toutes les 10 minutes en pointe$f$),
    updated_at = now()
WHERE slug = 'cout-transport-frontalier-geneve-2026'
  AND position($r$relie Annemasse à Genève-Eaux-Vives en 7 minutes et à Cornavin en 23, avec des trains toutes les 10 minutes en pointe$r$ IN content_fr) > 0
  AND position($f$relie Annemasse à Genève en 20 minutes, avec des trains toutes les 10 minutes en pointe$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$with Geneva Eaux-Vives in 7 min and Cornavin in 23 min by Léman Express.$r$, $f$with direct Geneva access in 20 min.$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$with Geneva Eaux-Vives in 7 min and Cornavin in 23 min by Léman Express.$r$ IN content_en) > 0
  AND position($f$with direct Geneva access in 20 min.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min et Cornavin en 23 min de Léman Express.$r$, $f$accès direct Genève en 20 min.$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$Genève-Eaux-Vives en 7 min et Cornavin en 23 min de Léman Express.$r$ IN content_fr) > 0
  AND position($f$accès direct Genève en 20 min.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$On parle de 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte — pas de 2 heures.$r$, $f$On parle de 20 minutes de trajet, pas de 2 heures.$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$On parle de 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte — pas de 2 heures.$r$ IN content_fr) > 0
  AND position($f$On parle de 20 minutes de trajet, pas de 2 heures.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[Léman Express connecting Annemasse to Geneva Eaux-Vives in 7 minutes and Cornavin in 23](https://www.lemanexpress.com/en/)$r$, $f$[Léman Express connecting Annemasse to Geneva Cornavin in 20 minutes](https://www.lemanexpress.com/en/)$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$[Léman Express connecting Annemasse to Geneva Eaux-Vives in 7 minutes and Cornavin in 23](https://www.lemanexpress.com/en/)$r$ IN content_en) > 0
  AND position($f$[Léman Express connecting Annemasse to Geneva Cornavin in 20 minutes](https://www.lemanexpress.com/en/)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[Annemasse↔Genève-Eaux-Vives en 7 minutes, Cornavin en 23, directement](https://www.lemanexpress.com/)$r$, $f$[Annemasse↔Genève Cornavin en 20 minutes, directement](https://www.lemanexpress.com/)$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$[Annemasse↔Genève-Eaux-Vives en 7 minutes, Cornavin en 23, directement](https://www.lemanexpress.com/)$r$ IN content_fr) > 0
  AND position($f$[Annemasse↔Genève Cornavin en 20 minutes, directement](https://www.lemanexpress.com/)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$for living comfortably 20 min from Geneva Eaux-Vives by Léman Express, door to door.$r$, $f$for living comfortably 20 minutes door-to-door from Geneva.$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$for living comfortably 20 min from Geneva Eaux-Vives by Léman Express, door to door.$r$ IN content_en) > 0
  AND position($f$for living comfortably 20 minutes door-to-door from Geneva.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$pour vivre confortablement à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, par exemple$r$, $f$pour vivre confortablement à 20 minutes de Genève, par exemple$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$pour vivre confortablement à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, par exemple$r$ IN content_fr) > 0
  AND position($f$pour vivre confortablement à 20 minutes de Genève, par exemple$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$- 20 min from Geneva Eaux-Vives by Léman Express, door to door, on the French side.$r$, $f$- 20 minutes from Geneva, on the French side.$f$),
    updated_at = now()
WHERE slug = 'espaces-verts-coliving-lodge-annemasse'
  AND position($r$- 20 min from Geneva Eaux-Vives by Léman Express, door to door, on the French side.$r$ IN content_en) > 0
  AND position($f$- 20 minutes from Geneva, on the French side.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$- À 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, côté France.$r$, $f$- À 20 minutes de Genève, côté France.$f$),
    updated_at = now()
WHERE slug = 'espaces-verts-coliving-lodge-annemasse'
  AND position($r$- À 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, côté France.$r$ IN content_fr) > 0
  AND position($f$- À 20 minutes de Genève, côté France.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$a real garden 20 min from Geneva Eaux-Vives by Léman Express, door to door —$r$, $f$a real garden 20 minutes from Geneva —$f$),
    updated_at = now()
WHERE slug = 'espaces-verts-coliving-lodge-annemasse'
  AND position($r$a real garden 20 min from Geneva Eaux-Vives by Léman Express, door to door —$r$ IN content_en) > 0
  AND position($f$a real garden 20 minutes from Geneva —$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$un vrai jardin à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte —$r$, $f$un vrai jardin à 20 minutes de Genève —$f$),
    updated_at = now()
WHERE slug = 'espaces-verts-coliving-lodge-annemasse'
  AND position($r$un vrai jardin à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte —$r$ IN content_fr) > 0
  AND position($f$un vrai jardin à 20 minutes de Genève —$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$côté France, à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte.$r$, $f$côté France à 20 minutes du centre de Genève porte à porte.$f$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($r$côté France, à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte.$r$ IN content_fr) > 0
  AND position($f$côté France à 20 minutes du centre de Genève porte à porte.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Cornavin station (23 min by Léman Express from Annemasse)$r$, $f$Cornavin station (22 min by Léman Express from Annemasse)$f$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($r$Cornavin station (23 min by Léman Express from Annemasse)$r$ IN content_en) > 0
  AND position($f$Cornavin station (22 min by Léman Express from Annemasse)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$la gare de Cornavin (23 min en Léman Express depuis Annemasse)$r$, $f$la gare de Cornavin (22 min en Léman Express depuis Annemasse)$f$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($r$la gare de Cornavin (23 min en Léman Express depuis Annemasse)$r$ IN content_fr) > 0
  AND position($f$la gare de Cornavin (22 min en Léman Express depuis Annemasse)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$The pragmatic answer: on the French side, 20 min from Geneva Eaux-Vives by Léman Express, door to door.$r$, $f$The pragmatic answer: on the French side, 20-30 minutes away.$f$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($r$The pragmatic answer: on the French side, 20 min from Geneva Eaux-Vives by Léman Express, door to door.$r$ IN content_en) > 0
  AND position($f$The pragmatic answer: on the French side, 20-30 minutes away.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$La réponse pragmatique : côté France, à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte.$r$, $f$La réponse pragmatique : côté France, à 20-30 minutes de trajet.$f$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($r$La réponse pragmatique : côté France, à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte.$r$ IN content_fr) > 0
  AND position($f$La réponse pragmatique : côté France, à 20-30 minutes de trajet.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$| CERN (Meyrin) | Léman Express → Cornavin + tram 18 | 50 to 55 min |$r$, $f$| CERN (Meyrin) | Léman Express → Cornavin + tram 18 | 50 to 55 min |
| Airport / Palexpo | Léman Express direct from Annemasse | ~30 min |$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$| CERN (Meyrin) | Léman Express → Cornavin + tram 18 | 50 to 55 min |$r$ IN content_en) > 0
  AND position($f$| CERN (Meyrin) | Léman Express → Cornavin + tram 18 | 50 to 55 min |
| Airport / Palexpo | Léman Express direct from Annemasse | ~30 min |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$| CERN (Meyrin) | Léman Express → Cornavin + tram 18 | 50 à 55 min |$r$, $f$| CERN (Meyrin) | Léman Express → Cornavin + tram 18 | 50 à 55 min |
| Aéroport / Palexpo | Léman Express direct depuis Annemasse | ~30 min |$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$| CERN (Meyrin) | Léman Express → Cornavin + tram 18 | 50 à 55 min |$r$ IN content_fr) > 0
  AND position($f$| CERN (Meyrin) | Léman Express → Cornavin + tram 18 | 50 à 55 min |
| Aéroport / Palexpo | Léman Express direct depuis Annemasse | ~30 min |$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$| Centre (Cornavin) | Léman Express direct | 23 min by train, 35 to 40 min door to door depending on the house |$r$, $f$| Centre (Cornavin) | Léman Express direct | ~22 min |$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$| Centre (Cornavin) | Léman Express direct | 23 min by train, 35 to 40 min door to door depending on the house |$r$ IN content_en) > 0
  AND position($f$| Centre (Cornavin) | Léman Express direct | ~22 min |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$| Centre (Cornavin) | Léman Express direct | 23 min de train, 35 à 40 min porte-à-porte selon la maison |$r$, $f$| Centre (Cornavin) | Léman Express direct | ~22 min |$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$| Centre (Cornavin) | Léman Express direct | 23 min de train, 35 à 40 min porte-à-porte selon la maison |$r$ IN content_fr) > 0
  AND position($f$| Centre (Cornavin) | Léman Express direct | ~22 min |$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$| Léman Express | ~115 CHF | 7 min (Geneva Eaux-Vives), 23 min (Cornavin) | Very high |$r$, $f$| Léman Express | ~115 CHF | ~20 min | Very high |$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$| Léman Express | ~115 CHF | 7 min (Geneva Eaux-Vives), 23 min (Cornavin) | Very high |$r$ IN content_en) > 0
  AND position($f$| Léman Express | ~115 CHF | ~20 min | Very high |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$| Léman Express | ~115 CHF | 7 min (Genève-Eaux-Vives), 23 min (Cornavin) | Très élevée |$r$, $f$| Léman Express | ~115 CHF | ~20 min | Très élevée |$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$| Léman Express | ~115 CHF | 7 min (Genève-Eaux-Vives), 23 min (Cornavin) | Très élevée |$r$ IN content_fr) > 0
  AND position($f$| Léman Express | ~115 CHF | ~20 min | Très élevée |$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$a set of houses with all-inclusive furnished rooms on the French side (Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre), designed for$r$, $f$a set of houses with all-inclusive furnished rooms about twenty minutes from Geneva, on the French side, designed for$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$a set of houses with all-inclusive furnished rooms on the French side (Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre), designed for$r$ IN content_en) > 0
  AND position($f$a set of houses with all-inclusive furnished rooms about twenty minutes from Geneva, on the French side, designed for$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$des maisons de chambres meublées tout inclus côté France (Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre), pensées pour$r$, $f$des maisons de chambres meublées tout inclus à une vingtaine de minutes de Genève, côté France, pensées pour$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$des maisons de chambres meublées tout inclus côté France (Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre), pensées pour$r$ IN content_fr) > 0
  AND position($f$des maisons de chambres meublées tout inclus à une vingtaine de minutes de Genève, côté France, pensées pour$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$And Geneva, 7 minutes away by Léman Express from Annemasse station, enriches the offering even further$r$, $f$And Geneva, just minutes away, enriches the offering even further$f$),
    updated_at = now()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages'
  AND position($r$And Geneva, 7 minutes away by Léman Express from Annemasse station, enriches the offering even further$r$ IN content_en) > 0
  AND position($f$And Geneva, just minutes away, enriches the offering even further$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Et Genève, à 7 minutes de Léman Express depuis la gare d'Annemasse, enrichit encore l'offre$r$, $f$Et Genève, à quelques minutes, enrichit encore l'offre$f$),
    updated_at = now()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages'
  AND position($r$Et Genève, à 7 minutes de Léman Express depuis la gare d'Annemasse, enrichit encore l'offre$r$ IN content_fr) > 0
  AND position($f$Et Genève, à quelques minutes, enrichit encore l'offre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$- **20 min** from Geneva Eaux-Vives by Léman Express, door to door$r$, $f$- **20 minutes** from Geneva center on the Léman Express$f$),
    updated_at = now()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages'
  AND position($r$- **20 min** from Geneva Eaux-Vives by Léman Express, door to door$r$ IN content_en) > 0
  AND position($f$- **20 minutes** from Geneva center on the Léman Express$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$- **20 min** de Genève-Eaux-Vives en Léman Express, porte-à-porte$r$, $f$- **20 minutes** du centre de Genève en Léman Express$f$),
    updated_at = now()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages'
  AND position($r$- **20 min** de Genève-Eaux-Vives en Léman Express, porte-à-porte$r$ IN content_fr) > 0
  AND position($f$- **20 minutes** du centre de Genève en Léman Express$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Located 7 minutes from Geneva Eaux-Vives by [Léman Express](https://www.lemanexpress.com/) from its station, **Annemasse**$r$, $f$Located just 20 minutes from Geneva on the [Léman Express](https://www.lemanexpress.com/), **Annemasse**$f$),
    updated_at = now()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages'
  AND position($r$Located 7 minutes from Geneva Eaux-Vives by [Léman Express](https://www.lemanexpress.com/) from its station, **Annemasse**$r$ IN content_en) > 0
  AND position($f$Located just 20 minutes from Geneva on the [Léman Express](https://www.lemanexpress.com/), **Annemasse**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Située à 7 minutes de Genève-Eaux-Vives en [Léman Express](https://www.lemanexpress.com/) depuis sa gare, **Annemasse**$r$, $f$Située à seulement 20 minutes de Genève en [Léman Express](https://www.lemanexpress.com/), **Annemasse**$f$),
    updated_at = now()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages'
  AND position($r$Située à 7 minutes de Genève-Eaux-Vives en [Léman Express](https://www.lemanexpress.com/) depuis sa gare, **Annemasse**$r$ IN content_fr) > 0
  AND position($f$Située à seulement 20 minutes de Genève en [Léman Express](https://www.lemanexpress.com/), **Annemasse**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$3 maisons côté France, à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, chambre meublée$r$, $f$3 maisons côté France, à 20 minutes du centre de Genève porte à porte, chambre meublée$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$3 maisons côté France, à 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, chambre meublée$r$ IN content_fr) > 0
  AND position($f$3 maisons côté France, à 20 minutes du centre de Genève porte à porte, chambre meublée$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$the cross-border TPG buses$r$, $f$the cross-border TPG/TPN buses$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$the cross-border TPG buses$r$ IN content_en) > 0
  AND position($f$the cross-border TPG/TPN buses$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$les bus transfrontaliers TPG$r$, $f$les bus transfrontaliers TPG/TPN$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$les bus transfrontaliers TPG$r$ IN content_fr) > 0
  AND position($f$les bus transfrontaliers TPG/TPN$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$| **Ville-la-Grand** | **Geneva Eaux-Vives in 7 min by Léman Express, 22 min door to door from La Villa** |$r$, $f$| **Ville-la-Grand** | **12-20 min** |$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$| **Ville-la-Grand** | **Geneva Eaux-Vives in 7 min by Léman Express, 22 min door to door from La Villa** |$r$ IN content_en) > 0
  AND position($f$| **Ville-la-Grand** | **12-20 min** |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$| **Ville-la-Grand** | **Genève-Eaux-Vives en 7 min de Léman Express, 22 min porte-à-porte depuis La Villa** |$r$, $f$| **Ville-la-Grand** | **12-20 min** |$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$| **Ville-la-Grand** | **Genève-Eaux-Vives en 7 min de Léman Express, 22 min porte-à-porte depuis La Villa** |$r$ IN content_fr) > 0
  AND position($f$| **Ville-la-Grand** | **12-20 min** |$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$| Annemasse | Geneva Eaux-Vives in 7 min by Léman Express, 18 min door to door from Le Lodge |$r$, $f$| Annemasse | 15-20 min |$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$| Annemasse | Geneva Eaux-Vives in 7 min by Léman Express, 18 min door to door from Le Lodge |$r$ IN content_en) > 0
  AND position($f$| Annemasse | 15-20 min |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$| Annemasse | Genève-Eaux-Vives en 7 min de Léman Express, 18 min porte-à-porte depuis Le Lodge |$r$, $f$| Annemasse | 15-20 min |$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$| Annemasse | Genève-Eaux-Vives en 7 min de Léman Express, 18 min porte-à-porte depuis Le Lodge |$r$ IN content_fr) > 0
  AND position($f$| Annemasse | 15-20 min |$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$- **Tram 17**, already direct to Geneva, is **extended into Annemasse at the end of 2026** (three new stops, Annemasse Agglo).$r$, $f$- An **Annemasse-Geneva tram** is planned for **2027**.$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$- **Tram 17**, already direct to Geneva, is **extended into Annemasse at the end of 2026** (three new stops, Annemasse Agglo).$r$ IN content_en) > 0
  AND position($f$- An **Annemasse-Geneva tram** is planned for **2027**.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$- Le **Tram 17**, déjà direct sur Genève, est **prolongé dans Annemasse fin 2026** (trois nouveaux arrêts, Annemasse Agglo).$r$, $f$- Un **tram Annemasse-Genève** est prévu pour **2027**, en plus du Tram 17 déjà direct sur Genève.$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$- Le **Tram 17**, déjà direct sur Genève, est **prolongé dans Annemasse fin 2026** (trois nouveaux arrêts, Annemasse Agglo).$r$ IN content_fr) > 0
  AND position($f$- Un **tram Annemasse-Genève** est prévu pour **2027**, en plus du Tram 17 déjà direct sur Genève.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Ambilly is the town right on the border: from Le Loft, the Foron, the border river, is 600 m away, an 8-minute walk, and the Moillesulaz crossing 1.8 km away.$r$, $f$Ambilly is the closest French town to the border — about a 5-minute walk to the border crossing.$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$Ambilly is the town right on the border: from Le Loft, the Foron, the border river, is 600 m away, an 8-minute walk, and the Moillesulaz crossing 1.8 km away.$r$ IN content_en) > 0
  AND position($f$Ambilly is the closest French town to the border — about a 5-minute walk to the border crossing.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Ambilly est la commune collée à la frontière : depuis Le Loft, le Foron, la rivière-frontière, est à 600 m, 8 min à pied, et la douane de Moillesulaz à 1,8 km.$r$, $f$Ambilly est la commune française la plus proche de la frontière : compte 5 minutes à pied jusqu'au poste de douane.$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$Ambilly est la commune collée à la frontière : depuis Le Loft, le Foron, la rivière-frontière, est à 600 m, 8 min à pied, et la douane de Moillesulaz à 1,8 km.$r$ IN content_fr) > 0
  AND position($f$Ambilly est la commune française la plus proche de la frontière : compte 5 minutes à pied jusqu'au poste de douane.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Walk to border**: 8 min (the Foron, 600 m from Le Loft) · **Commute to Geneva**: Rive in 23 min by tram 17 (32 min door to door from Le Loft), Geneva Eaux-Vives in 7 min by Léman Express (24 min door to door)$r$, $f$**Walk to border**: 5 min · **Commute to Geneva**: 10 min by car, 10 min by tram, 20 min by CEVA$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$**Walk to border**: 8 min (the Foron, 600 m from Le Loft) · **Commute to Geneva**: Rive in 23 min by tram 17 (32 min door to door from Le Loft), Geneva Eaux-Vives in 7 min by Léman Express (24 min door to door)$r$ IN content_en) > 0
  AND position($f$**Walk to border**: 5 min · **Commute to Geneva**: 10 min by car, 10 min by tram, 20 min by CEVA$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$**Frontière à pied** : 8 min (le Foron, à 600 m du Loft) · **Temps de trajet Genève** : Rive en 23 min de tram 17 (32 min porte-à-porte depuis Le Loft), Genève-Eaux-Vives en 7 min de Léman Express (24 min porte-à-porte)$r$, $f$**Frontière à pied** : 5 min · **Temps de trajet Genève** : 10 min en voiture, 10 min en Tram, 20 min en CEVA$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$**Frontière à pied** : 8 min (le Foron, à 600 m du Loft) · **Temps de trajet Genève** : Rive en 23 min de tram 17 (32 min porte-à-porte depuis Le Loft), Genève-Eaux-Vives en 7 min de Léman Express (24 min porte-à-porte)$r$ IN content_fr) > 0
  AND position($f$**Frontière à pied** : 5 min · **Temps de trajet Genève** : 10 min en voiture, 10 min en Tram, 20 min en CEVA$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$the Léman Express from Annemasse station.$r$, $f$several TPN bus lines straight to Geneva.$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$the Léman Express from Annemasse station.$r$ IN content_en) > 0
  AND position($f$several TPN bus lines straight to Geneva.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$le Léman Express depuis la gare d'Annemasse.$r$, $f$plusieurs lignes TPN qui filent direct sur Genève.$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$le Léman Express depuis la gare d'Annemasse.$r$ IN content_fr) > 0
  AND position($f$plusieurs lignes TPN qui filent direct sur Genève.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Commute**: Geneva Eaux-Vives in 7 min by Léman Express, 22 min door to door from La Villa$r$, $f$**Commute**: 12 min by car, 20 min by bus$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$**Commute**: Geneva Eaux-Vives in 7 min by Léman Express, 22 min door to door from La Villa$r$ IN content_en) > 0
  AND position($f$**Commute**: 12 min by car, 20 min by bus$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$**Temps de trajet** : Genève-Eaux-Vives en 7 min de Léman Express, 22 min porte-à-porte depuis La Villa$r$, $f$**Temps de trajet** : 12 min en voiture, 20 min en bus$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$**Temps de trajet** : Genève-Eaux-Vives en 7 min de Léman Express, 22 min porte-à-porte depuis La Villa$r$ IN content_fr) > 0
  AND position($f$**Temps de trajet** : 12 min en voiture, 20 min en bus$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$The Léman Express drops you at Geneva Eaux-Vives in 7 minutes and at Cornavin in 23 minutes.$r$, $f$The Léman Express drops you at Cornavin in 20 minutes.$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$The Léman Express drops you at Geneva Eaux-Vives in 7 minutes and at Cornavin in 23 minutes.$r$ IN content_en) > 0
  AND position($f$The Léman Express drops you at Cornavin in 20 minutes.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Le Léman Express te dépose à Genève-Eaux-Vives en 7 minutes et à Cornavin en 23 minutes.$r$, $f$Le Léman Express te dépose à Cornavin en 20 minutes.$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$Le Léman Express te dépose à Genève-Eaux-Vives en 7 minutes et à Cornavin en 23 minutes.$r$ IN content_fr) > 0
  AND position($f$Le Léman Express te dépose à Cornavin en 20 minutes.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Commute**: Geneva Eaux-Vives in 7 min [by Léman Express](https://www.lemanexpress.com/), Cornavin in 23 min$r$, $f$**Commute**: [15-20 min by Léman Express](https://www.lemanexpress.com/)$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$**Commute**: Geneva Eaux-Vives in 7 min [by Léman Express](https://www.lemanexpress.com/), Cornavin in 23 min$r$ IN content_en) > 0
  AND position($f$**Commute**: [15-20 min by Léman Express](https://www.lemanexpress.com/)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$**Temps de trajet** : Genève-Eaux-Vives en 7 min [en Léman Express](https://www.lemanexpress.com/), Cornavin en 23 min$r$, $f$**Temps de trajet** : 15-20 min [en Léman Express](https://www.lemanexpress.com/)$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$**Temps de trajet** : Genève-Eaux-Vives en 7 min [en Léman Express](https://www.lemanexpress.com/), Cornavin en 23 min$r$ IN content_fr) > 0
  AND position($f$**Temps de trajet** : 15-20 min [en Léman Express](https://www.lemanexpress.com/)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET facebook_post_en = replace(facebook_post_en, $r$all-inclusive from CHF 1,370/month. 20 min from Geneva Eaux-Vives by Léman Express, door to door, light-years$r$, $f$all-inclusive at 1,430 CHF/month. 10 minutes from Geneva, light-years$f$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($r$all-inclusive from CHF 1,370/month. 20 min from Geneva Eaux-Vives by Léman Express, door to door, light-years$r$ IN facebook_post_en) > 0
  AND position($f$all-inclusive at 1,430 CHF/month. 10 minutes from Geneva, light-years$f$ IN facebook_post_en) = 0;

UPDATE blog_posts
SET facebook_post_fr = replace(facebook_post_fr, $r$tout compris dès 1 370 CHF/mois. À 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, à des années-lumière$r$, $f$tout compris à 1 430 CHF/mois. À 10 minutes de Genève, à des années-lumière$f$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($r$tout compris dès 1 370 CHF/mois. À 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte, à des années-lumière$r$ IN facebook_post_fr) > 0
  AND position($f$tout compris à 1 430 CHF/mois. À 10 minutes de Genève, à des années-lumière$f$ IN facebook_post_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$a 10-minute walk from Annemasse station, Geneva Eaux-Vives in 18 minutes door to door and Cornavin in 23 minutes by Léman Express$r$, $f$about 9 minutes' walk from Annemasse station, i.e. 20 minutes from Cornavin by Léman Express$f$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($r$a 10-minute walk from Annemasse station, Geneva Eaux-Vives in 18 minutes door to door and Cornavin in 23 minutes by Léman Express$r$ IN content_en) > 0
  AND position($f$about 9 minutes' walk from Annemasse station, i.e. 20 minutes from Cornavin by Léman Express$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$à 10 minutes à pied de la gare d'Annemasse, Genève-Eaux-Vives en 18 minutes porte-à-porte et Cornavin en 23 minutes de Léman Express$r$, $f$à environ 9 minutes à pied de la gare d'Annemasse, soit 20 minutes de Cornavin en Léman Express$f$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($r$à 10 minutes à pied de la gare d'Annemasse, Genève-Eaux-Vives en 18 minutes porte-à-porte et Cornavin en 23 minutes de Léman Express$r$ IN content_fr) > 0
  AND position($f$à environ 9 minutes à pied de la gare d'Annemasse, soit 20 minutes de Cornavin en Léman Express$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Annemasse station — and its Léman Express — is a 10-minute walk away.$r$, $f$Annemasse station — and its Léman Express — is about a 9-minute walk away.$f$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($r$Annemasse station — and its Léman Express — is a 10-minute walk away.$r$ IN content_en) > 0
  AND position($f$Annemasse station — and its Léman Express — is about a 9-minute walk away.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$La gare d'Annemasse — et son Léman Express — est à 10 minutes à pied.$r$, $f$La gare d'Annemasse — et son Léman Express — est à environ 9 minutes à pied.$f$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($r$La gare d'Annemasse — et son Léman Express — est à 10 minutes à pied.$r$ IN content_fr) > 0
  AND position($f$La gare d'Annemasse — et son Léman Express — est à environ 9 minutes à pied.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$The Léman Express connects Annemasse station to Geneva Eaux-Vives in 7 minutes and to Cornavin in 23 minutes, and tram 17$r$, $f$The Léman Express connects Annemasse station to Cornavin in 20 minutes, and tram 17$f$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($r$The Léman Express connects Annemasse station to Geneva Eaux-Vives in 7 minutes and to Cornavin in 23 minutes, and tram 17$r$ IN content_en) > 0
  AND position($f$The Léman Express connects Annemasse station to Cornavin in 20 minutes, and tram 17$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Le Léman Express relie la gare d'Annemasse à Genève-Eaux-Vives en 7 minutes et à Cornavin en 23 minutes, et le tram 17$r$, $f$Le Léman Express relie la gare d'Annemasse à Cornavin en 20 minutes, et le tram 17$f$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($r$Le Léman Express relie la gare d'Annemasse à Genève-Eaux-Vives en 7 minutes et à Cornavin en 23 minutes, et le tram 17$r$ IN content_fr) > 0
  AND position($f$Le Léman Express relie la gare d'Annemasse à Cornavin en 20 minutes, et le tram 17$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$our house in Annemasse, a 10-minute walk from Annemasse station.$r$, $f$our house in Annemasse, just minutes from the Swiss border.$f$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($r$our house in Annemasse, a 10-minute walk from Annemasse station.$r$ IN content_en) > 0
  AND position($f$our house in Annemasse, just minutes from the Swiss border.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$notre maison d'Annemasse, à 10 min à pied de la gare d'Annemasse.$r$, $f$notre maison d'Annemasse, à quelques minutes seulement de la frontière suisse.$f$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($r$notre maison d'Annemasse, à 10 min à pied de la gare d'Annemasse.$r$ IN content_fr) > 0
  AND position($f$notre maison d'Annemasse, à quelques minutes seulement de la frontière suisse.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET facebook_post_en = replace(facebook_post_en, $r$✨ from CHF 1,370/month all-inclusive in Annemasse$r$, $f$✨ 1,430 CHF/month all-inclusive in Annemasse$f$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($r$✨ from CHF 1,370/month all-inclusive in Annemasse$r$ IN facebook_post_en) > 0
  AND position($f$✨ 1,430 CHF/month all-inclusive in Annemasse$f$ IN facebook_post_en) = 0;

UPDATE blog_posts
SET facebook_post_fr = replace(facebook_post_fr, $r$✨ dès 1 370 CHF/mois tout inclus à Annemasse$r$, $f$✨ 1 430 CHF/mois tout inclus à Annemasse$f$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($r$✨ dès 1 370 CHF/mois tout inclus à Annemasse$r$ IN facebook_post_fr) > 0
  AND position($f$✨ 1 430 CHF/mois tout inclus à Annemasse$f$ IN facebook_post_fr) = 0;

UPDATE blog_posts
SET facebook_post_en = replace(facebook_post_en, $r$🚊 20 min from Geneva Eaux-Vives by Léman Express, door to door$r$, $f$🚊 15 min from Geneva by transport$f$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($r$🚊 20 min from Geneva Eaux-Vives by Léman Express, door to door$r$ IN facebook_post_en) > 0
  AND position($f$🚊 15 min from Geneva by transport$f$ IN facebook_post_en) = 0;

UPDATE blog_posts
SET facebook_post_fr = replace(facebook_post_fr, $r$🚊 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte$r$, $f$🚊 15 min de Genève en transports$f$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($r$🚊 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte$r$ IN facebook_post_fr) > 0
  AND position($f$🚊 15 min de Genève en transports$f$ IN facebook_post_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Geneva proximity**: 20 min from Geneva Eaux-Vives by Léman Express, door to door$r$, $f$**Geneva proximity**: 20 minutes by public transport to reach Geneva center$f$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($r$**Geneva proximity**: 20 min from Geneva Eaux-Vives by Léman Express, door to door$r$ IN content_en) > 0
  AND position($f$**Geneva proximity**: 20 minutes by public transport to reach Geneva center$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$**Proximité de Genève** : 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte$r$, $f$**Proximité de Genève** : 20 minutes en transport en commun pour rejoindre le centre de Genève$f$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($r$**Proximité de Genève** : 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte$r$ IN content_fr) > 0
  AND position($f$**Proximité de Genève** : 20 minutes en transport en commun pour rejoindre le centre de Genève$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$In Annemasse, for example, you stay 7 minutes by train from Geneva Eaux-Vives (Léman Express from Annemasse station) while benefiting from the French cost of living.$r$, $f$In Annemasse, for example, you stay just minutes from your workplace while benefiting from French cost of living.$f$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($r$In Annemasse, for example, you stay 7 minutes by train from Geneva Eaux-Vives (Léman Express from Annemasse station) while benefiting from the French cost of living.$r$ IN content_en) > 0
  AND position($f$In Annemasse, for example, you stay just minutes from your workplace while benefiting from French cost of living.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$À Annemasse par exemple, tu restes à 7 minutes de train de Genève-Eaux-Vives (Léman Express depuis la gare d'Annemasse) tout en bénéficiant$r$, $f$À Annemasse par exemple, tu restes à quelques minutes de ton lieu de travail tout en bénéficiant$f$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($r$À Annemasse par exemple, tu restes à 7 minutes de train de Genève-Eaux-Vives (Léman Express depuis la gare d'Annemasse) tout en bénéficiant$r$ IN content_fr) > 0
  AND position($f$À Annemasse par exemple, tu restes à quelques minutes de ton lieu de travail tout en bénéficiant$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$- **Airport**: Annemasse, by train from Annemasse station: Léman Express to Geneva Cornavin, then a connection to the airport.$r$, $f$- **Airport**: Annemasse, direct Léman Express to Geneva Airport (30 min).$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$- **Airport**: Annemasse, by train from Annemasse station: Léman Express to Geneva Cornavin, then a connection to the airport.$r$ IN content_en) > 0
  AND position($f$- **Airport**: Annemasse, direct Léman Express to Geneva Airport (30 min).$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$- **Aéroport** : Annemasse, en train depuis la gare d'Annemasse : Léman Express jusqu'à Genève Cornavin, puis correspondance pour l'aéroport.$r$, $f$- **Aéroport** : Annemasse, Léman Express direct jusqu'à Genève-Aéroport (30 min).$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$- **Aéroport** : Annemasse, en train depuis la gare d'Annemasse : Léman Express jusqu'à Genève Cornavin, puis correspondance pour l'aéroport.$r$ IN content_fr) > 0
  AND position($f$- **Aéroport** : Annemasse, Léman Express direct jusqu'à Genève-Aéroport (30 min).$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$To the airport, by train from Annemasse station: Léman Express to Geneva Cornavin, then a connection to the airport.$r$, $f$To the airport, the Léman Express is direct (30 min).$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$To the airport, by train from Annemasse station: Léman Express to Geneva Cornavin, then a connection to the airport.$r$ IN content_en) > 0
  AND position($f$To the airport, the Léman Express is direct (30 min).$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Vers l'aéroport, en train depuis la gare d'Annemasse : Léman Express jusqu'à Genève Cornavin, puis correspondance pour l'aéroport.$r$, $f$Vers l'aéroport, le Léman Express est direct (30 min).$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$Vers l'aéroport, en train depuis la gare d'Annemasse : Léman Express jusqu'à Genève Cornavin, puis correspondance pour l'aéroport.$r$ IN content_fr) > 0
  AND position($f$Vers l'aéroport, le Léman Express est direct (30 min).$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Annemasse station is an 18-min walk from Le Loft, tram 17 an 8-min walk.$r$, $f$Annemasse station is 5-8 min by bike.$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$Annemasse station is an 18-min walk from Le Loft, tram 17 an 8-min walk.$r$ IN content_en) > 0
  AND position($f$Annemasse station is 5-8 min by bike.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$La gare d'Annemasse est à 18 min à pied du Loft, le tram 17 à 8 min.$r$, $f$La gare d'Annemasse est à 5-8 min en vélo.$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$La gare d'Annemasse est à 18 min à pied du Loft, le tram 17 à 8 min.$r$ IN content_fr) > 0
  AND position($f$La gare d'Annemasse est à 5-8 min en vélo.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Annemasse station is a 14-min walk from La Villa, in Ville-la-Grand.$r$, $f$Annemasse station is a 10-min walk (or 3-min bike ride) from Ville-la-Grand.$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$Annemasse station is a 14-min walk from La Villa, in Ville-la-Grand.$r$ IN content_en) > 0
  AND position($f$Annemasse station is a 10-min walk (or 3-min bike ride) from Ville-la-Grand.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$La gare d'Annemasse est à 14 min à pied de La Villa, à Ville-la-Grand.$r$, $f$La gare d'Annemasse est à 10 min à pied (ou 3 min en vélo) de Ville-la-Grand.$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$La gare d'Annemasse est à 14 min à pied de La Villa, à Ville-la-Grand.$r$ IN content_fr) > 0
  AND position($f$La gare d'Annemasse est à 10 min à pied (ou 3 min en vélo) de Ville-la-Grand.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$| CERN (Meyrin) | 50-55 min (Cornavin 23 min + tram 18) |$r$, $f$| CERN (Meyrin) | 50-55 min (Cornavin 22 min + tram 18) |$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$| CERN (Meyrin) | 50-55 min (Cornavin 23 min + tram 18) |$r$ IN content_en) > 0
  AND position($f$| CERN (Meyrin) | 50-55 min (Cornavin 22 min + tram 18) |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$| CERN (Meyrin) | 50-55 min (Cornavin 23 min + tram 18) |$r$, $f$| CERN (Meyrin) | 50-55 min (Cornavin 22 min + tram 18) |$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$| CERN (Meyrin) | 50-55 min (Cornavin 23 min + tram 18) |$r$ IN content_fr) > 0
  AND position($f$| CERN (Meyrin) | 50-55 min (Cornavin 22 min + tram 18) |$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$| Center (Cornavin) | 23 min by train · 38 min door to door from La Villa (Léman Express) | 20-25 → 40-55 min | 35-50 min | 30-40 min |$r$, $f$| Center (Cornavin) | 22 min | 20-25 → 40-55 min | 35-50 min | 30-40 min |$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$| Center (Cornavin) | 23 min by train · 38 min door to door from La Villa (Léman Express) | 20-25 → 40-55 min | 35-50 min | 30-40 min |$r$ IN content_en) > 0
  AND position($f$| Center (Cornavin) | 22 min | 20-25 → 40-55 min | 35-50 min | 30-40 min |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$| Centre (Cornavin) | 23 min de train · 38 min porte-à-porte depuis La Villa (Léman Express) | 20-25 → 40-55 min | 35-50 min | 30-40 min |$r$, $f$| Centre (Cornavin) | 22 min | 20-25 → 40-55 min | 35-50 min | 30-40 min |$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$| Centre (Cornavin) | 23 min de train · 38 min porte-à-porte depuis La Villa (Léman Express) | 20-25 → 40-55 min | 35-50 min | 30-40 min |$r$ IN content_fr) > 0
  AND position($f$| Centre (Cornavin) | 22 min | 20-25 → 40-55 min | 35-50 min | 30-40 min |$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$| Bike | 0€ | 23-29 min (Voie Verte) | Low | 5/10 (summer) |$r$, $f$| Bike | 0€ | 35-40 min | Low | 5/10 (summer) |$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$| Bike | 0€ | 23-29 min (Voie Verte) | Low | 5/10 (summer) |$r$ IN content_en) > 0
  AND position($f$| Bike | 0€ | 35-40 min | Low | 5/10 (summer) |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$| Vélo | 0€ | 23-29 min (Voie Verte) | Bas | 5/10 (été) |$r$, $f$| Vélo | 0€ | 35-40 min | Bas | 5/10 (été) |$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$| Vélo | 0€ | 23-29 min (Voie Verte) | Bas | 5/10 (été) |$r$ IN content_fr) > 0
  AND position($f$| Vélo | 0€ | 35-40 min | Bas | 5/10 (été) |$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$| Léman Express | 200€ | 7 min (Eaux-Vives), 23 min (Cornavin) | Low | 9/10 |$r$, $f$| Léman Express | 200€ | 20 min | Low | 9/10 |$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$| Léman Express | 200€ | 7 min (Eaux-Vives), 23 min (Cornavin) | Low | 9/10 |$r$ IN content_en) > 0
  AND position($f$| Léman Express | 200€ | 20 min | Low | 9/10 |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$| Léman Express | 200€ | 7 min (Eaux-Vives), 23 min (Cornavin) | Bas | 9/10 |$r$, $f$| Léman Express | 200€ | 20 min | Bas | 9/10 |$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$| Léman Express | 200€ | 7 min (Eaux-Vives), 23 min (Cornavin) | Bas | 9/10 |$r$ IN content_fr) > 0
  AND position($f$| Léman Express | 200€ | 20 min | Bas | 9/10 |$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Time**: Annemasse-Geneva centre (Rive) = 23 to 29 min on the Voie Verte depending on the house.$r$, $f$**Time**: Annemasse-Geneva-center = 35-40 min (bike path).$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$**Time**: Annemasse-Geneva centre (Rive) = 23 to 29 min on the Voie Verte depending on the house.$r$ IN content_en) > 0
  AND position($f$**Time**: Annemasse-Geneva-center = 35-40 min (bike path).$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$**Temps** : Annemasse-Genève centre (Rive) = 23 à 29 minutes par la Voie Verte selon la maison.$r$, $f$**Temps** : Annemasse-Genève-centre = 35-40 minutes (piste cyclable).$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$**Temps** : Annemasse-Genève centre (Rive) = 23 à 29 minutes par la Voie Verte selon la maison.$r$ IN content_fr) > 0
  AND position($f$**Temps** : Annemasse-Genève-centre = 35-40 minutes (piste cyclable).$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$From our houses: a 10-min walk from Le Lodge (Annemasse), 14 min from La Villa (Ville-la-Grand), 18 min from Le Loft (Ambilly), which also has tram 17 an 8-min walk away.$r$, $f$Ville-la-Grand: 10-15 min walk. Ambilly: far.$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$From our houses: a 10-min walk from Le Lodge (Annemasse), 14 min from La Villa (Ville-la-Grand), 18 min from Le Loft (Ambilly), which also has tram 17 an 8-min walk away.$r$ IN content_en) > 0
  AND position($f$Ville-la-Grand: 10-15 min walk. Ambilly: far.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Depuis nos maisons : 10 min à pied du Lodge (Annemasse), 14 min de La Villa (Ville-la-Grand), 18 min du Loft (Ambilly), qui a aussi le tram 17 à 8 min.$r$, $f$À Ville-la-Grand, c'est 10-15 min à pied. À Ambilly, c'est loin.$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$Depuis nos maisons : 10 min à pied du Lodge (Annemasse), 14 min de La Villa (Ville-la-Grand), 18 min du Loft (Ambilly), qui a aussi le tram 17 à 8 min.$r$ IN content_fr) > 0
  AND position($f$À Ville-la-Grand, c'est 10-15 min à pied. À Ambilly, c'est loin.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[Every 10 min at peak hours](https://www.lemanexpress.com/en/)$r$, $f$[Every 15 min peak hours](https://www.lemanexpress.com/en/)$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$[Every 10 min at peak hours](https://www.lemanexpress.com/en/)$r$ IN content_en) > 0
  AND position($f$[Every 15 min peak hours](https://www.lemanexpress.com/en/)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[Toutes les 10 min en heures de pointe](https://www.lemanexpress.com/)$r$, $f$[Toutes les 15 min en heures de pointe](https://www.lemanexpress.com/)$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$[Toutes les 10 min en heures de pointe](https://www.lemanexpress.com/)$r$ IN content_fr) > 0
  AND position($f$[Toutes les 15 min en heures de pointe](https://www.lemanexpress.com/)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Time**: Annemasse-Geneva Eaux-Vives = 7 minutes, Annemasse-Geneva-Cornavin = 23 minutes. Airport (Cointrin) by train from Annemasse station: Léman Express to Geneva Cornavin, then a connection to the airport.$r$, $f$**Time**: Annemasse-Geneva-Cornavin = 20 minutes. Airport (Cointrin) = 25 minutes from Annemasse.$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$**Time**: Annemasse-Geneva Eaux-Vives = 7 minutes, Annemasse-Geneva-Cornavin = 23 minutes. Airport (Cointrin) by train from Annemasse station: Léman Express to Geneva Cornavin, then a connection to the airport.$r$ IN content_en) > 0
  AND position($f$**Time**: Annemasse-Geneva-Cornavin = 20 minutes. Airport (Cointrin) = 25 minutes from Annemasse.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$**Temps** : Annemasse-Genève-Eaux-Vives = 7 minutes, Annemasse-Genève-Cornavin = 23 minutes. Aéroport (Cointrin) en train depuis la gare d'Annemasse : Léman Express jusqu'à Genève Cornavin, puis correspondance pour l'aéroport.$r$, $f$**Temps** : Annemasse-Genève-Cornavin = 20 minutes. Aéroport (Cointrin) = 25 minutes de Annemasse.$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$**Temps** : Annemasse-Genève-Eaux-Vives = 7 minutes, Annemasse-Genève-Cornavin = 23 minutes. Aéroport (Cointrin) en train depuis la gare d'Annemasse : Léman Express jusqu'à Genève Cornavin, puis correspondance pour l'aéroport.$r$ IN content_fr) > 0
  AND position($f$**Temps** : Annemasse-Genève-Cornavin = 20 minutes. Aéroport (Cointrin) = 25 minutes de Annemasse.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Annemasse, by train from Annemasse station: Léman Express to Geneva Cornavin, then a connection to the airport.$r$, $f$Annemasse with Léman Express to Geneva Airport (30 min, direct).$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$Annemasse, by train from Annemasse station: Léman Express to Geneva Cornavin, then a connection to the airport.$r$ IN content_en) > 0
  AND position($f$Annemasse with Léman Express to Geneva Airport (30 min, direct).$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Annemasse, en train depuis la gare d'Annemasse : Léman Express jusqu'à Genève Cornavin, puis correspondance pour l'aéroport.$r$, $f$Annemasse avec Léman Express jusqu'à Genève-Aéroport (30 min, direct).$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$Annemasse, en train depuis la gare d'Annemasse : Léman Express jusqu'à Genève Cornavin, puis correspondance pour l'aéroport.$r$ IN content_fr) > 0
  AND position($f$Annemasse avec Léman Express jusqu'à Genève-Aéroport (30 min, direct).$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$La Villa (10 rooms) is a 14-min walk from the station.$r$, $f$La Villa (10 rooms) is 10 min from the station.$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$La Villa (10 rooms) is a 14-min walk from the station.$r$ IN content_en) > 0
  AND position($f$La Villa (10 rooms) is 10 min from the station.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$La Villa (10 chambres) est à 14 min à pied de la gare.$r$, $f$La Villa (10 chambres) est à 10 min de la gare.$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$La Villa (10 chambres) est à 14 min à pied de la gare.$r$ IN content_fr) > 0
  AND position($f$La Villa (10 chambres) est à 10 min de la gare.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$La Villa in Ville-la-Grand is a 14-minute walk from Annemasse station. Le Loft in Ambilly, an 18-minute walk from the station and 8 minutes from tram 17. Le Lodge in Annemasse, a 10-minute walk.$r$, $f$La Villa in Ville-la-Grand is less than a 10-minute walk from Annemasse station. Le Loft in Ambilly, 8 minutes by bike. Le Lodge in Annemasse, about a 9-minute walk.$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$La Villa in Ville-la-Grand is a 14-minute walk from Annemasse station. Le Loft in Ambilly, an 18-minute walk from the station and 8 minutes from tram 17. Le Lodge in Annemasse, a 10-minute walk.$r$ IN content_en) > 0
  AND position($f$La Villa in Ville-la-Grand is less than a 10-minute walk from Annemasse station. Le Loft in Ambilly, 8 minutes by bike. Le Lodge in Annemasse, about a 9-minute walk.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$La Villa à Ville-la-Grand est à 14 minutes à pied de la gare d'Annemasse. Le Loft à Ambilly, à 18 minutes à pied de la gare et à 8 minutes du tram 17. Le Lodge à Annemasse, à 10 minutes à pied.$r$, $f$La Villa à Ville-la-Grand est à moins de 10 minutes à pied de la gare d'Annemasse. Le Loft à Ambilly, à 8 minutes en vélo. Le Lodge à Annemasse, à environ 9 minutes à pied.$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$La Villa à Ville-la-Grand est à 14 minutes à pied de la gare d'Annemasse. Le Loft à Ambilly, à 18 minutes à pied de la gare et à 8 minutes du tram 17. Le Lodge à Annemasse, à 10 minutes à pied.$r$ IN content_fr) > 0
  AND position($f$La Villa à Ville-la-Grand est à moins de 10 minutes à pied de la gare d'Annemasse. Le Loft à Ambilly, à 8 minutes en vélo. Le Lodge à Annemasse, à environ 9 minutes à pied.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$| Léman Express (pass) | ~80 CHF | 7 min (Eaux-Vives), 23 min (Cornavin) |$r$, $f$| Léman Express (pass) | ~80 CHF | 20 min |$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$| Léman Express (pass) | ~80 CHF | 7 min (Eaux-Vives), 23 min (Cornavin) |$r$ IN content_en) > 0
  AND position($f$| Léman Express (pass) | ~80 CHF | 20 min |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$| Léman Express (abonnement) | ~80 CHF | 7 min (Eaux-Vives), 23 min (Cornavin) |$r$, $f$| Léman Express (abonnement) | ~80 CHF | 20 min |$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$| Léman Express (abonnement) | ~80 CHF | 7 min (Eaux-Vives), 23 min (Cornavin) |$r$ IN content_fr) > 0
  AND position($f$| Léman Express (abonnement) | ~80 CHF | 20 min |$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$is in Annemasse, a 10-minute walk from the station.$r$, $f$is in Annemasse, about a 9-minute walk from the station.$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$is in Annemasse, a 10-minute walk from the station.$r$ IN content_en) > 0
  AND position($f$is in Annemasse, about a 9-minute walk from the station.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$est à Annemasse, à 10 minutes à pied de la gare.$r$, $f$est à Annemasse, à environ 9 minutes à pied de la gare.$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$est à Annemasse, à 10 minutes à pied de la gare.$r$ IN content_fr) > 0
  AND position($f$est à Annemasse, à environ 9 minutes à pied de la gare.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Annemasse station is an 18-minute walk from Le Loft (Olympe de Gouges bus stop 6 min away), tram 17 8 minutes.$r$, $f$Annemasse station is 5-8 minutes by bike from Ambilly.$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$Annemasse station is an 18-minute walk from Le Loft (Olympe de Gouges bus stop 6 min away), tram 17 8 minutes.$r$ IN content_en) > 0
  AND position($f$Annemasse station is 5-8 minutes by bike from Ambilly.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$La gare d'Annemasse est à 18 minutes à pied du Loft (arrêt de bus Olympe de Gouges à 6 min), le tram 17 à 8 minutes.$r$, $f$La gare d'Annemasse est à 5-8 minutes en vélo depuis Ambilly.$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$La gare d'Annemasse est à 18 minutes à pied du Loft (arrêt de bus Olympe de Gouges à 6 min), le tram 17 à 8 minutes.$r$ IN content_fr) > 0
  AND position($f$La gare d'Annemasse est à 5-8 minutes en vélo depuis Ambilly.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Léman Express to Cornavin (23 min) + tram 18$r$, $f$Léman Express to Cornavin (20 min) + tram 18$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$Léman Express to Cornavin (23 min) + tram 18$r$ IN content_en) > 0
  AND position($f$Léman Express to Cornavin (20 min) + tram 18$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Léman Express jusqu'à Cornavin (23 min) + tram 18$r$, $f$Léman Express jusqu'à Cornavin (20 min) + tram 18$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$Léman Express jusqu'à Cornavin (23 min) + tram 18$r$ IN content_fr) > 0
  AND position($f$Léman Express jusqu'à Cornavin (20 min) + tram 18$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Léman Express, without hesitation. Geneva Eaux-Vives in 7 minutes, Cornavin in 23, predictable, 80 CHF/month subscription.$r$, $f$Léman Express, without hesitation. 20 minutes, predictable, 80 CHF/month subscription.$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$Léman Express, without hesitation. Geneva Eaux-Vives in 7 minutes, Cornavin in 23, predictable, 80 CHF/month subscription.$r$ IN content_en) > 0
  AND position($f$Léman Express, without hesitation. 20 minutes, predictable, 80 CHF/month subscription.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Léman Express, sans hésitation. Genève-Eaux-Vives en 7 minutes, Cornavin en 23, prévisible, 80 CHF/mois d'abonnement.$r$, $f$Léman Express, sans hésitation. 20 minutes, prévisible, 80 CHF/mois d'abonnement.$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$Léman Express, sans hésitation. Genève-Eaux-Vives en 7 minutes, Cornavin en 23, prévisible, 80 CHF/mois d'abonnement.$r$ IN content_fr) > 0
  AND position($f$Léman Express, sans hésitation. 20 minutes, prévisible, 80 CHF/mois d'abonnement.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$By **bus**: 35-50 minutes depending on traffic.$r$, $f$By **bus** (line D or tpg 61): 35-50 minutes depending on traffic.$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$By **bus**: 35-50 minutes depending on traffic.$r$ IN content_en) > 0
  AND position($f$By **bus** (line D or tpg 61): 35-50 minutes depending on traffic.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$En **bus** : 35-50 minutes selon la circulation.$r$, $f$En **bus** (ligne D ou tpg 61) : 35-50 minutes selon la circulation.$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$En **bus** : 35-50 minutes selon la circulation.$r$ IN content_fr) > 0
  AND position($f$En **bus** (ligne D ou tpg 61) : 35-50 minutes selon la circulation.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$By **Léman Express** from Annemasse (station a 14-min walk from La Villa, in Ville-la-Grand): 7 minutes to Geneva Eaux-Vives, 23 minutes to Cornavin, a train every 10 minutes during rush hour.$r$, $f$By **Léman Express** from Annemasse (station 10 min walk or 3 min bike from Ville-la-Grand): 20 minutes to Cornavin, trains every 15 minutes during rush hour.$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$By **Léman Express** from Annemasse (station a 14-min walk from La Villa, in Ville-la-Grand): 7 minutes to Geneva Eaux-Vives, 23 minutes to Cornavin, a train every 10 minutes during rush hour.$r$ IN content_en) > 0
  AND position($f$By **Léman Express** from Annemasse (station 10 min walk or 3 min bike from Ville-la-Grand): 20 minutes to Cornavin, trains every 15 minutes during rush hour.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$En **Léman Express** depuis Annemasse (gare à 14 min à pied de La Villa, à Ville-la-Grand) : 7 minutes jusqu'à Genève-Eaux-Vives, 23 minutes jusqu'à Cornavin, un train toutes les 10 minutes aux heures de pointe.$r$, $f$En **Léman Express** depuis Annemasse (gare à 10 min à pied ou 3 min en vélo de Ville-la-Grand) : 20 minutes jusqu'à Cornavin, trains toutes les 15 minutes aux heures de pointe.$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$En **Léman Express** depuis Annemasse (gare à 14 min à pied de La Villa, à Ville-la-Grand) : 7 minutes jusqu'à Genève-Eaux-Vives, 23 minutes jusqu'à Cornavin, un train toutes les 10 minutes aux heures de pointe.$r$ IN content_fr) > 0
  AND position($f$En **Léman Express** depuis Annemasse (gare à 10 min à pied ou 3 min en vélo de Ville-la-Grand) : 20 minutes jusqu'à Cornavin, trains toutes les 15 minutes aux heures de pointe.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Ville-la-Grand is bordered by the Foron, the river that marks the Swiss border.$r$, $f$Ville-la-Grand is the closest municipality to the Swiss border.$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$Ville-la-Grand is bordered by the Foron, the river that marks the Swiss border.$r$ IN content_en) > 0
  AND position($f$Ville-la-Grand is the closest municipality to the Swiss border.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Ville-la-Grand est bordée par le Foron, la rivière qui marque la frontière suisse.$r$, $f$Ville-la-Grand est la commune la plus proche de la frontière suisse.$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$Ville-la-Grand est bordée par le Foron, la rivière qui marque la frontière suisse.$r$ IN content_fr) > 0
  AND position($f$Ville-la-Grand est la commune la plus proche de la frontière suisse.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[Le Lodge in Annemasse](/en/lelodge) (Annemasse station 10 min on foot · Geneva Eaux-Vives in 18 min door-to-door), [Le Loft in Ambilly](/en/leloft) (tram 17 stop 8 min on foot, Annemasse station 18 min · Geneva Eaux-Vives in 24 min door-to-door), [La Villa in Ville-la-Grand](/en/lavilla) (Annemasse station 14 min on foot · Geneva Eaux-Vives in 22 min door-to-door)$r$, $f$[Le Lodge in Annemasse](/en/lelodge) (Léman Express and Tram 17 on foot), [Le Loft in Ambilly](/en/leloft) (Léman Express and Tram 17 on foot), [La Villa in Ville-la-Grand](/en/lavilla) (Léman Express and Tram 17 on foot)$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$[Le Lodge in Annemasse](/en/lelodge) (Annemasse station 10 min on foot · Geneva Eaux-Vives in 18 min door-to-door), [Le Loft in Ambilly](/en/leloft) (tram 17 stop 8 min on foot, Annemasse station 18 min · Geneva Eaux-Vives in 24 min door-to-door), [La Villa in Ville-la-Grand](/en/lavilla) (Annemasse station 14 min on foot · Geneva Eaux-Vives in 22 min door-to-door)$r$ IN content_en) > 0
  AND position($f$[Le Lodge in Annemasse](/en/lelodge) (Léman Express and Tram 17 on foot), [Le Loft in Ambilly](/en/leloft) (Léman Express and Tram 17 on foot), [La Villa in Ville-la-Grand](/en/lavilla) (Léman Express and Tram 17 on foot)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[Le Lodge à Annemasse](/lelodge) (gare d'Annemasse à 10 min à pied · Genève-Eaux-Vives en 18 min porte-à-porte), [Le Loft à Ambilly](/leloft) (tram 17 à 8 min à pied, gare d'Annemasse à 18 min · Genève-Eaux-Vives en 24 min porte-à-porte), [La Villa à Ville-la-Grand](/lavilla) (gare d'Annemasse à 14 min à pied · Genève-Eaux-Vives en 22 min porte-à-porte)$r$, $f$[Le Lodge à Annemasse](/lelodge) (Léman Express et Tram 17 à pied), [Le Loft à Ambilly](/leloft) (Léman Express et Tram 17 à pied), [La Villa à Ville-la-Grand](/lavilla) (Léman Express et Tram 17 à pied)$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$[Le Lodge à Annemasse](/lelodge) (gare d'Annemasse à 10 min à pied · Genève-Eaux-Vives en 18 min porte-à-porte), [Le Loft à Ambilly](/leloft) (tram 17 à 8 min à pied, gare d'Annemasse à 18 min · Genève-Eaux-Vives en 24 min porte-à-porte), [La Villa à Ville-la-Grand](/lavilla) (gare d'Annemasse à 14 min à pied · Genève-Eaux-Vives en 22 min porte-à-porte)$r$ IN content_fr) > 0
  AND position($f$[Le Lodge à Annemasse](/lelodge) (Léman Express et Tram 17 à pied), [Le Loft à Ambilly](/leloft) (Léman Express et Tram 17 à pied), [La Villa à Ville-la-Grand](/lavilla) (Léman Express et Tram 17 à pied)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Avoid the immediate surroundings of the **motorway** and major roads$r$, $f$Avoid the immediate surroundings of the **A40 motorway** and major roads$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$Avoid the immediate surroundings of the **motorway** and major roads$r$ IN content_en) > 0
  AND position($f$Avoid the immediate surroundings of the **A40 motorway** and major roads$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Évite les abords immédiats de l'**autoroute** et des grands axes$r$, $f$Évite les abords immédiats de l'**autoroute A40** et des grands axes$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$Évite les abords immédiats de l'**autoroute** et des grands axes$r$ IN content_fr) > 0
  AND position($f$Évite les abords immédiats de l'**autoroute A40** et des grands axes$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$while staying close to the station and the border. Our [Villa, in Ville-la-Grand](/en/lavilla), fits this residential register: Annemasse station is a 14-minute walk, Geneva Eaux-Vives 22 minutes door to door, and the Foron, the border river, runs along the street.$r$, $f$while staying 10-15 min from the station and the border. Our [Villa, in Ville-la-Grand](/en/lavilla), fits this residential register, border-adjacent.$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$while staying close to the station and the border. Our [Villa, in Ville-la-Grand](/en/lavilla), fits this residential register: Annemasse station is a 14-minute walk, Geneva Eaux-Vives 22 minutes door to door, and the Foron, the border river, runs along the street.$r$ IN content_en) > 0
  AND position($f$while staying 10-15 min from the station and the border. Our [Villa, in Ville-la-Grand](/en/lavilla), fits this residential register, border-adjacent.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$tout en restant proche de la gare et de la frontière. Notre maison [La Villa, à Ville-la-Grand](/lavilla), est dans ce registre résidentiel : gare d'Annemasse à 14 min à pied, Genève-Eaux-Vives en 22 min porte-à-porte, et le Foron, la rivière-frontière, longe la rue.$r$, $f$tout en restant à 10-15 min de la gare et de la frontière. Notre maison [La Villa, à Ville-la-Grand](/lavilla), est dans ce registre résidentiel, frontière mitoyenne.$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$tout en restant proche de la gare et de la frontière. Notre maison [La Villa, à Ville-la-Grand](/lavilla), est dans ce registre résidentiel : gare d'Annemasse à 14 min à pied, Genève-Eaux-Vives en 22 min porte-à-porte, et le Foron, la rivière-frontière, longe la rue.$r$ IN content_fr) > 0
  AND position($f$tout en restant à 10-15 min de la gare et de la frontière. Notre maison [La Villa, à Ville-la-Grand](/lavilla), est dans ce registre résidentiel, frontière mitoyenne.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$From there, central Geneva (Rive) is reached by bike on the Voie Verte (23 min from Le Loft), or by **Tram 17** (Croix-d'Ambilly stop in Ambilly, Parc Montessuit stop in Annemasse). Our [Loft, in Ambilly](/en/leloft), is an 8-minute walk from Tram 17 (Croix-d'Ambilly stop) — Rive, in central Geneva, in 23 min by tram with no change, 32 min door to door, plus an indoor pool$r$, $f$From there, Geneva is a few minutes by bike via the cross-border cycle paths, or by **Tram 17** (French terminus at Moillesulaz). Our [Loft, in Ambilly](/en/leloft), is 5 minutes' walk from Tram 17 — central Geneva in ~20 min with no change, plus an indoor pool$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$From there, central Geneva (Rive) is reached by bike on the Voie Verte (23 min from Le Loft), or by **Tram 17** (Croix-d'Ambilly stop in Ambilly, Parc Montessuit stop in Annemasse). Our [Loft, in Ambilly](/en/leloft), is an 8-minute walk from Tram 17 (Croix-d'Ambilly stop) — Rive, in central Geneva, in 23 min by tram with no change, 32 min door to door, plus an indoor pool$r$ IN content_en) > 0
  AND position($f$From there, Geneva is a few minutes by bike via the cross-border cycle paths, or by **Tram 17** (French terminus at Moillesulaz). Our [Loft, in Ambilly](/en/leloft), is 5 minutes' walk from Tram 17 — central Geneva in ~20 min with no change, plus an indoor pool$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Depuis là, le centre de Genève (Rive) se rejoint à vélo par la Voie Verte (23 min depuis Le Loft), ou en **Tram 17** (arrêts Croix-d'Ambilly à Ambilly, Parc Montessuit à Annemasse). Notre [Loft, à Ambilly](/leloft), est à 8 min à pied du Tram 17 (arrêt Croix-d'Ambilly) — Rive, au centre de Genève, en 23 min de tram sans changement, 32 min porte-à-porte, et sa piscine intérieure$r$, $f$Depuis là, Genève se rejoint à vélo en quelques minutes par les pistes cyclables transfrontalières, ou en **Tram 17** (terminus côté français à Moillesulaz). Notre [Loft, à Ambilly](/leloft), est à 5 minutes à pied du Tram 17 — Genève centre en ~20 min sans changement, et sa piscine intérieure$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$Depuis là, le centre de Genève (Rive) se rejoint à vélo par la Voie Verte (23 min depuis Le Loft), ou en **Tram 17** (arrêts Croix-d'Ambilly à Ambilly, Parc Montessuit à Annemasse). Notre [Loft, à Ambilly](/leloft), est à 8 min à pied du Tram 17 (arrêt Croix-d'Ambilly) — Rive, au centre de Genève, en 23 min de tram sans changement, 32 min porte-à-porte, et sa piscine intérieure$r$ IN content_fr) > 0
  AND position($f$Depuis là, Genève se rejoint à vélo en quelques minutes par les pistes cyclables transfrontalières, ou en **Tram 17** (terminus côté français à Moillesulaz). Notre [Loft, à Ambilly](/leloft), est à 5 minutes à pied du Tram 17 — Genève centre en ~20 min sans changement, et sa piscine intérieure$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$The Léman Express drops you at Geneva Eaux-Vives in 7 min, Cornavin in 23 min, with a train every 10 minutes at peak times.$r$, $f$The Léman Express drops you at Geneva-Eaux-Vives in ~15 min, Cornavin in ~22 min, with 2 to 4 trains per hour depending on the time.$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$The Léman Express drops you at Geneva Eaux-Vives in 7 min, Cornavin in 23 min, with a train every 10 minutes at peak times.$r$ IN content_en) > 0
  AND position($f$The Léman Express drops you at Geneva-Eaux-Vives in ~15 min, Cornavin in ~22 min, with 2 to 4 trains per hour depending on the time.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Le Léman Express te dépose à Genève-Eaux-Vives en 7 min, à Cornavin en 23 min, avec un train toutes les 10 minutes en heure de pointe.$r$, $f$Le Léman Express te dépose à Genève-Eaux-Vives en ~15 min, à Cornavin en ~22 min, avec une fréquence de 2 à 4 trains par heure selon le moment.$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$Le Léman Express te dépose à Genève-Eaux-Vives en 7 min, à Cornavin en 23 min, avec un train toutes les 10 minutes en heure de pointe.$r$ IN content_fr) > 0
  AND position($f$Le Léman Express te dépose à Genève-Eaux-Vives en ~15 min, à Cornavin en ~22 min, avec une fréquence de 2 à 4 trains par heure selon le moment.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$the **Annemasse station** (Léman Express: Geneva Eaux-Vives in 7 min by train, Cornavin in 23 min)$r$, $f$the **Annemasse station** (French terminus of the Léman Express, Geneva in under 15 min)$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$the **Annemasse station** (Léman Express: Geneva Eaux-Vives in 7 min by train, Cornavin in 23 min)$r$ IN content_en) > 0
  AND position($f$the **Annemasse station** (French terminus of the Léman Express, Geneva in under 15 min)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$la **gare d'Annemasse** (Léman Express : Genève-Eaux-Vives en 7 min de train, Cornavin en 23 min)$r$, $f$la **gare d'Annemasse** (terminus français du Léman Express, Genève en moins de 15 min)$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$la **gare d'Annemasse** (Léman Express : Genève-Eaux-Vives en 7 min de train, Cornavin en 23 min)$r$ IN content_fr) > 0
  AND position($f$la **gare d'Annemasse** (terminus français du Léman Express, Genève en moins de 15 min)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$- **Ville-la-Grand** — residential and family-friendly, bordered by the Foron, the river that marks the Swiss border.$r$, $f$- **Ville-la-Grand** — residential and family-friendly, border-adjacent to the northeast.$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$- **Ville-la-Grand** — residential and family-friendly, bordered by the Foron, the river that marks the Swiss border.$r$ IN content_en) > 0
  AND position($f$- **Ville-la-Grand** — residential and family-friendly, border-adjacent to the northeast.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$- **Ville-la-Grand** — résidentiel et familial, bordé par le Foron, la rivière qui marque la frontière suisse.$r$, $f$- **Ville-la-Grand** — résidentiel et familial, frontière mitoyenne au nord-est.$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$- **Ville-la-Grand** — résidentiel et familial, bordé par le Foron, la rivière qui marque la frontière suisse.$r$ IN content_fr) > 0
  AND position($f$- **Ville-la-Grand** — résidentiel et familial, frontière mitoyenne au nord-est.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$a **cluster of neighbouring towns**, pressed against the Geneva border:$r$, $f$a **cluster of adjoining towns**, pressed against the Geneva border:$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$a **cluster of neighbouring towns**, pressed against the Geneva border:$r$ IN content_en) > 0
  AND position($f$a **cluster of adjoining towns**, pressed against the Geneva border:$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$une **agglomération de communes voisines**, collée à la frontière genevoise :$r$, $f$une **agglomération de communes mitoyennes**, collée à la frontière genevoise :$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$une **agglomération de communes voisines**, collée à la frontière genevoise :$r$ IN content_fr) > 0
  AND position($f$une **agglomération de communes mitoyennes**, collée à la frontière genevoise :$f$ IN content_fr) = 0;

COMMIT;
*/
