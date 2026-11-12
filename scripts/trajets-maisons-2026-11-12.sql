-- ============================================================================
-- Trajets des maisons (décisions de Jérôme du 12/11/2026) : temps à pied jusqu'à la gare (9 / 9 / 8 min), porte-à-porte recalculés (Eaux-Vives 17 / 17 / 16, Cornavin 33), formule D1 « 16 à 17 min », dans 33 articles publiés
-- Généré le 2026-11-12T13:32:53.285Z par scripts/build-slots-sql.mjs depuis scripts/trajets-maisons.edits.mjs
--   · source unique (stats.ts TRANSIT, houseLocation.ts, answerSlots.ts, entityFacts.ts) de la branche fix/trajets-maisons-2026-11 ; textes « Avant » lus en base le 12/11/2026
--   · ancres vérifiées sur le contenu vivant de blog_posts (REST anon, lecture seule) le 2026-11-12T13:32:53.277Z : exactement 1 occurrence de chaque ancien texte, nouveau texte absent
-- À appliquer JUSTE AVANT la fusion de la branche fix/trajets-maisons-2026-11 (check:slots compare les phrases de commune au code : un passage du robot entre les deux échoue et fige la production). Vérifier d'abord qu'aucun prérendu ne tourne (gh run list).
-- Idempotent : chaque UPDATE est gardé par position(ancien) > 0 [AND position(nouveau) = 0 quand le nouveau texte n'est pas un fragment de l'ancien] — relancer le fichier est sans effet.
-- Fichier UTF-8 : tirets cadratins (U+2014), points médians (U+00B7), apostrophes droites — ne pas normaliser.
-- 124 modifications · 33 articles · état en base à la génération (updated_at · longueur fr / en) :
--   allocations-familiales-frontalier-geneve-2026 · 2026-10-13T15:30:10.955122+00:00 · 11464 / 9868
--   arnaques-logement-frontalier-geneve-eviter · 2026-10-30T17:15:30.671729+00:00 · 12657 / 11492
--   assurance-sante-frontalier-lamal-cmu-budget · 2026-11-03T06:13:37.833224+00:00 · 9587 / 9039
--   banque-telephone-internet-frontalier-bons-plans · 2026-10-30T17:15:30.671729+00:00 · 10154 / 9414
--   budget-colocation-geneve-guide-complet · 2026-11-03T06:13:37.833224+00:00 · 18723 / 14725
--   choc-culturel-franco-suisse-expatrie-geneve · 2026-10-30T17:15:30.671729+00:00 · 10973 / 10304
--   coliving-colocation-ou-studio-geneve-comparatif · 2026-10-10T08:03:59.086815+00:00 · 14302 / 13812
--   colocation-annemasse-ville-la-grand-ambilly · 2026-11-03T06:13:37.833224+00:00 · 8708 / 7767
--   cout-de-la-vie-suisse-france-frontalier-2026 · 2026-11-03T06:13:37.833224+00:00 · 13254 / 11922
--   cout-transport-frontalier-geneve-2026 · 2026-10-13T15:32:15.797408+00:00 · 9119 / 8490
--   declaration-impots-frontalier-2026 · 2026-11-03T06:13:37.833224+00:00 · 5521 / 5053
--   ecole-internationale-geneve-frontalier-ou-habiter · 2026-10-13T15:33:01.979749+00:00 · 11822 / 10010
--   fiscalite-frontalier-geneve-impots-2026 · 2026-11-03T06:13:37.833224+00:00 · 10713 / 10055
--   grand-geneve-2026-nouveautes-frontaliers · 2026-10-13T15:33:01.979749+00:00 · 8673 / 7506
--   guide-ressources-frontalier-geneve · 2026-11-03T06:13:37.833224+00:00 · 40430 / 37274
--   living-in-france-working-in-geneva · 2026-11-02T12:54:15.442979+00:00 · 17553 / 15935
--   lodge-annemasse-coliving-premium-portes-geneve · 2026-10-12T08:41:56.358413+00:00 · 15213 / 13537
--   optimiser-espace-coliving-productivite-bien-etre · 2026-10-13T15:33:46.184445+00:00 · 3962 / 3580
--   organisations-internationales-geneve-ou-habiter · 2026-10-30T17:15:30.671729+00:00 · 7443 / 6821
--   ou-habiter-en-france-quand-on-travaille-a-geneve · 2026-11-03T09:33:28.111242+00:00 · 14927 / 14746
--   ou-habiter-frontalier-suisse-villes-france-pas-cher · 2026-11-02T13:41:00.390492+00:00 · 15367 / 15358
--   permis-g-frontalier-geneve · 2026-11-03T06:13:37.833224+00:00 · 6156 / 5798
--   quartiers-annemasse-ou-vivre-selon-profil · 2026-11-03T06:13:37.833224+00:00 · 10138 / 9034
--   quitter-son-logement-guide-pratique · 2026-10-30T17:15:30.671729+00:00 · 11516 / 10993
--   salaire-suisse-net-frontalier-2026 · 2026-10-13T15:39:32.874791+00:00 · 13925 / 11223
--   se-faire-reseau-geneve-arriver-seul · 2026-10-30T17:15:30.671729+00:00 · 10677 / 9636
--   teletravail-frontalier-geneve-regles-2026 · 2026-11-03T06:13:37.833224+00:00 · 11725 / 10833
--   temps-trajet-annemasse-geneve-par-quartier · 2026-11-02T12:54:15.442979+00:00 · 9233 / 8620
--   transport-annemasse-geneve-leman-express · 2026-10-10T07:59:57.333901+00:00 · 8454 / 7411
--   trouver-colocation-geneve-frontalier · 2026-11-03T06:13:37.833224+00:00 · 5965 / 5580
--   trouver-logement-avant-d-arriver-geneve · 2026-11-03T09:33:28.111242+00:00 · 14603 / 14105
--   vie-quotidienne-frontalier-courses-sport-sorties · 2026-10-30T17:15:30.671729+00:00 · 9465 / 8719
--   vivre-a-annemasse-quand-on-travaille-a-geneve · 2026-11-02T12:54:15.442979+00:00 · 12796 / 12491
-- ============================================================================

BEGIN;

-- [1/124] allocations-familiales-frontalier-geneve-2026 (fr) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'allocations-familiales-frontalier-geneve-2026'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) = 0;

-- [2/124] allocations-familiales-frontalier-geneve-2026 (en) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'allocations-familiales-frontalier-geneve-2026'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) = 0;

-- [3/124] arnaques-logement-frontalier-geneve-eviter (fr) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) = 0;

-- [4/124] arnaques-logement-frontalier-geneve-eviter (en) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) = 0;

-- [5/124] assurance-sante-frontalier-lamal-cmu-budget (fr) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) = 0;

-- [6/124] assurance-sante-frontalier-lamal-cmu-budget (en) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) = 0;

-- [7/124] banque-telephone-internet-frontalier-bons-plans (fr) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'banque-telephone-internet-frontalier-bons-plans'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) = 0;

-- [8/124] banque-telephone-internet-frontalier-bons-plans (en) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'banque-telephone-internet-frontalier-bons-plans'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) = 0;

-- [9/124] budget-colocation-geneve-guide-complet (fr) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) = 0;

-- [10/124] budget-colocation-geneve-guide-complet (en) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) = 0;

-- [11/124] choc-culturel-franco-suisse-expatrie-geneve (fr) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) = 0;

-- [12/124] choc-culturel-franco-suisse-expatrie-geneve (en) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) = 0;

-- [13/124] cout-de-la-vie-suisse-france-frontalier-2026 (fr) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) = 0;

-- [14/124] cout-de-la-vie-suisse-france-frontalier-2026 (en) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) = 0;

-- [15/124] declaration-impots-frontalier-2026 (fr) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'declaration-impots-frontalier-2026'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) = 0;

-- [16/124] declaration-impots-frontalier-2026 (en) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'declaration-impots-frontalier-2026'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) = 0;

-- [17/124] ecole-internationale-geneve-frontalier-ou-habiter (fr) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) = 0;

-- [18/124] ecole-internationale-geneve-frontalier-ou-habiter (en) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) = 0;

-- [19/124] fiscalite-frontalier-geneve-impots-2026 (fr) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) = 0;

-- [20/124] fiscalite-frontalier-geneve-impots-2026 (en) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) = 0;

-- [21/124] grand-geneve-2026-nouveautes-frontaliers (fr) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'grand-geneve-2026-nouveautes-frontaliers'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) = 0;

-- [22/124] grand-geneve-2026-nouveautes-frontaliers (en) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'grand-geneve-2026-nouveautes-frontaliers'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) = 0;

-- [23/124] living-in-france-working-in-geneva (fr) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) = 0;

-- [24/124] living-in-france-working-in-geneva (en) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) = 0;

-- [25/124] optimiser-espace-coliving-productivite-bien-etre (fr) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'optimiser-espace-coliving-productivite-bien-etre'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) = 0;

-- [26/124] optimiser-espace-coliving-productivite-bien-etre (en) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'optimiser-espace-coliving-productivite-bien-etre'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) = 0;

-- [27/124] organisations-internationales-geneve-ou-habiter (fr) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) = 0;

-- [28/124] organisations-internationales-geneve-ou-habiter (en) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) = 0;

-- [29/124] ou-habiter-en-france-quand-on-travaille-a-geneve (fr) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) = 0;

-- [30/124] ou-habiter-en-france-quand-on-travaille-a-geneve (en) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) = 0;

-- [31/124] permis-g-frontalier-geneve (fr) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'permis-g-frontalier-geneve'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) = 0;

-- [32/124] permis-g-frontalier-geneve (en) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'permis-g-frontalier-geneve'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) = 0;

-- [33/124] quitter-son-logement-guide-pratique (fr) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'quitter-son-logement-guide-pratique'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) = 0;

-- [34/124] quitter-son-logement-guide-pratique (en) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'quitter-son-logement-guide-pratique'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) = 0;

-- [35/124] salaire-suisse-net-frontalier-2026 (fr) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) = 0;

-- [36/124] salaire-suisse-net-frontalier-2026 (en) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) = 0;

-- [37/124] se-faire-reseau-geneve-arriver-seul (fr) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'se-faire-reseau-geneve-arriver-seul'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) = 0;

-- [38/124] se-faire-reseau-geneve-arriver-seul (en) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'se-faire-reseau-geneve-arriver-seul'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) = 0;

-- [39/124] teletravail-frontalier-geneve-regles-2026 (fr) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) = 0;

-- [40/124] teletravail-frontalier-geneve-regles-2026 (en) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) = 0;

-- [41/124] trouver-colocation-geneve-frontalier (fr) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) = 0;

-- [42/124] trouver-colocation-geneve-frontalier (en) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) = 0;

-- [43/124] trouver-logement-avant-d-arriver-geneve (fr) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) = 0;

-- [44/124] trouver-logement-avant-d-arriver-geneve (en) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) = 0;

-- [45/124] vie-quotidienne-frontalier-courses-sport-sorties (fr) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) = 0;

-- [46/124] vie-quotidienne-frontalier-courses-sport-sorties (en) · formule D1 · pied d'article : porte-à-porte selon la maison
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) = 0;

-- [47/124] guide-ressources-frontalier-geneve (fr) · formule D1 · paragraphe « propriétaires, pas agence »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$côté France (Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$côté France (Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$côté France (Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$côté France (Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) = 0;

-- [48/124] guide-ressources-frontalier-geneve (fr) · formule D1 · phrase d'appel 👉
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) = 0;

-- [49/124] guide-ressources-frontalier-geneve (en) · formule D1 · paragraph « owners, not an agency »
UPDATE blog_posts
SET content_en = replace(content_en, $f$on the French side (Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$on the French side (Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$on the French side (Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$on the French side (Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) = 0;

-- [50/124] guide-ressources-frontalier-geneve (en) · formule D1 · call-to-action line 👉
UPDATE blog_posts
SET content_en = replace(content_en, $f$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) = 0;

-- [51/124] guide-ressources-frontalier-geneve (fr) · tableau · Cornavin porte-à-porte
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$23 min de train, 35 à 40 min porte-à-porte selon la maison$f$, $r$23 min de train, 33 min porte-à-porte depuis chaque maison$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$23 min de train, 35 à 40 min porte-à-porte selon la maison$f$ IN content_fr) > 0
  AND position($r$23 min de train, 33 min porte-à-porte depuis chaque maison$r$ IN content_fr) = 0;

-- [52/124] guide-ressources-frontalier-geneve (en) · tableau · Cornavin door to door
UPDATE blog_posts
SET content_en = replace(content_en, $f$23 min by train, 35 to 40 min door to door depending on the house$f$, $r$23 min by train, 33 min door to door from each house$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$23 min by train, 35 to 40 min door to door depending on the house$f$ IN content_en) > 0
  AND position($r$23 min by train, 33 min door to door from each house$r$ IN content_en) = 0;

-- [53/124] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · phrase de commune · communeSentence(lelodge)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$f$, $r$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte.$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$f$ IN content_fr) > 0
  AND position($r$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte.$r$ IN content_fr) = 0;

-- [54/124] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · phrase de commune · communeSentence(lelodge)
UPDATE blog_posts
SET content_en = replace(content_en, $f$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$f$, $r$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door.$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$f$ IN content_en) > 0
  AND position($r$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door.$r$ IN content_en) = 0;

-- [55/124] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · phrase de commune · communeSentence(lavilla)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 14 min à pied de la gare d'Annemasse — Genève-Eaux-Vives en 22 min porte-à-porte.$f$, $r$À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 9 min à pied de la gare d'Annemasse — Genève-Eaux-Vives en 17 min porte-à-porte.$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 14 min à pied de la gare d'Annemasse — Genève-Eaux-Vives en 22 min porte-à-porte.$f$ IN content_fr) > 0
  AND position($r$À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 9 min à pied de la gare d'Annemasse — Genève-Eaux-Vives en 17 min porte-à-porte.$r$ IN content_fr) = 0;

-- [56/124] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · phrase de commune · communeSentence(lavilla)
UPDATE blog_posts
SET content_en = replace(content_en, $f$In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 14-minute walk from Annemasse station — Geneva Eaux-Vives in 22 minutes door to door.$f$, $r$In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 9-minute walk from Annemasse station — Geneva Eaux-Vives in 17 minutes door to door.$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 14-minute walk from Annemasse station — Geneva Eaux-Vives in 22 minutes door to door.$f$ IN content_en) > 0
  AND position($r$In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 9-minute walk from Annemasse station — Geneva Eaux-Vives in 17 minutes door to door.$r$ IN content_en) = 0;

-- [57/124] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · phrase de commune · communeSentence(leloft)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.$f$, $r$À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 17 min porte-à-porte.$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.$f$ IN content_fr) > 0
  AND position($r$À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 17 min porte-à-porte.$r$ IN content_fr) = 0;

-- [58/124] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · phrase de commune · communeSentence(leloft)
UPDATE blog_posts
SET content_en = replace(content_en, $f$In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door.$f$, $r$In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 17 minutes door to door.$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door.$f$ IN content_en) > 0
  AND position($r$In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 17 minutes door to door.$r$ IN content_en) = 0;

-- [59/124] colocation-annemasse-ville-la-grand-ambilly (fr) · phrase de commune · communeSentence(lelodge)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$f$, $r$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte.$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$f$ IN content_fr) > 0
  AND position($r$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte.$r$ IN content_fr) = 0;

-- [60/124] colocation-annemasse-ville-la-grand-ambilly (en) · phrase de commune · communeSentence(lelodge)
UPDATE blog_posts
SET content_en = replace(content_en, $f$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$f$, $r$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door.$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$f$ IN content_en) > 0
  AND position($r$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door.$r$ IN content_en) = 0;

-- [61/124] colocation-annemasse-ville-la-grand-ambilly (fr) · phrase de commune · communeSentence(lavilla)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 14 min à pied de la gare d'Annemasse — Genève-Eaux-Vives en 22 min porte-à-porte.$f$, $r$À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 9 min à pied de la gare d'Annemasse — Genève-Eaux-Vives en 17 min porte-à-porte.$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 14 min à pied de la gare d'Annemasse — Genève-Eaux-Vives en 22 min porte-à-porte.$f$ IN content_fr) > 0
  AND position($r$À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 9 min à pied de la gare d'Annemasse — Genève-Eaux-Vives en 17 min porte-à-porte.$r$ IN content_fr) = 0;

-- [62/124] colocation-annemasse-ville-la-grand-ambilly (en) · phrase de commune · communeSentence(lavilla)
UPDATE blog_posts
SET content_en = replace(content_en, $f$In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 14-minute walk from Annemasse station — Geneva Eaux-Vives in 22 minutes door to door.$f$, $r$In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 9-minute walk from Annemasse station — Geneva Eaux-Vives in 17 minutes door to door.$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 14-minute walk from Annemasse station — Geneva Eaux-Vives in 22 minutes door to door.$f$ IN content_en) > 0
  AND position($r$In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 9-minute walk from Annemasse station — Geneva Eaux-Vives in 17 minutes door to door.$r$ IN content_en) = 0;

-- [63/124] colocation-annemasse-ville-la-grand-ambilly (fr) · phrase de commune · communeSentence(leloft)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.$f$, $r$À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 17 min porte-à-porte.$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.$f$ IN content_fr) > 0
  AND position($r$À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 17 min porte-à-porte.$r$ IN content_fr) = 0;

-- [64/124] colocation-annemasse-ville-la-grand-ambilly (en) · phrase de commune · communeSentence(leloft)
UPDATE blog_posts
SET content_en = replace(content_en, $f$In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door.$f$, $r$In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 17 minutes door to door.$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door.$f$ IN content_en) > 0
  AND position($r$In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 17 minutes door to door.$r$ IN content_en) = 0;

-- [65/124] quartiers-annemasse-ou-vivre-selon-profil (fr) · phrase de commune · communeSentence(lelodge)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$f$, $r$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte.$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$f$ IN content_fr) > 0
  AND position($r$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte.$r$ IN content_fr) = 0;

-- [66/124] quartiers-annemasse-ou-vivre-selon-profil (en) · phrase de commune · communeSentence(lelodge)
UPDATE blog_posts
SET content_en = replace(content_en, $f$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$f$, $r$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door.$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$f$ IN content_en) > 0
  AND position($r$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door.$r$ IN content_en) = 0;

-- [67/124] vivre-a-annemasse-quand-on-travaille-a-geneve (fr) · phrase de commune · communeSentence(lelodge)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$f$, $r$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte.$r$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($f$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$f$ IN content_fr) > 0
  AND position($r$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte.$r$ IN content_fr) = 0;

-- [68/124] vivre-a-annemasse-quand-on-travaille-a-geneve (en) · phrase de commune · communeSentence(lelodge)
UPDATE blog_posts
SET content_en = replace(content_en, $f$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$f$, $r$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door.$r$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($f$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$f$ IN content_en) > 0
  AND position($r$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door.$r$ IN content_en) = 0;

-- [69/124] vivre-a-annemasse-quand-on-travaille-a-geneve (fr) · phrase de commune · communeSentence(lelodge, ouvert en 2026)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny, ouvert en 2026) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$f$, $r$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny, ouvert en 2026) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte.$r$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($f$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny, ouvert en 2026) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$f$ IN content_fr) > 0
  AND position($r$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny, ouvert en 2026) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte.$r$ IN content_fr) = 0;

-- [70/124] vivre-a-annemasse-quand-on-travaille-a-geneve (en) · phrase de commune · communeSentence(lelodge, ouvert en 2026)
UPDATE blog_posts
SET content_en = replace(content_en, $f$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district, opened in 2026) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$f$, $r$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district, opened in 2026) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door.$r$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($f$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district, opened in 2026) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$f$ IN content_en) > 0
  AND position($r$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district, opened in 2026) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door.$r$ IN content_en) = 0;

-- [71/124] quartiers-annemasse-ou-vivre-selon-profil (fr) · ligne de trajet · houseCommuteLine(lavilla)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$gare d'Annemasse à 14 min à pied · Genève-Eaux-Vives en 22 min porte-à-porte$f$, $r$gare d'Annemasse à 9 min à pied · Genève-Eaux-Vives en 17 min porte-à-porte$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$gare d'Annemasse à 14 min à pied · Genève-Eaux-Vives en 22 min porte-à-porte$f$ IN content_fr) > 0
  AND position($r$gare d'Annemasse à 9 min à pied · Genève-Eaux-Vives en 17 min porte-à-porte$r$ IN content_fr) = 0;

-- [72/124] quartiers-annemasse-ou-vivre-selon-profil (en) · ligne de trajet · houseCommuteLine(lavilla)
UPDATE blog_posts
SET content_en = replace(content_en, $f$Annemasse station 14 min on foot · Geneva Eaux-Vives in 22 min door-to-door$f$, $r$Annemasse station 9 min on foot · Geneva Eaux-Vives in 17 min door-to-door$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$Annemasse station 14 min on foot · Geneva Eaux-Vives in 22 min door-to-door$f$ IN content_en) > 0
  AND position($r$Annemasse station 9 min on foot · Geneva Eaux-Vives in 17 min door-to-door$r$ IN content_en) = 0;

-- [73/124] quartiers-annemasse-ou-vivre-selon-profil (fr) · ligne de trajet · houseCommuteLine(leloft)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$tram 17 à 8 min à pied, gare d'Annemasse à 18 min · Genève-Eaux-Vives en 24 min porte-à-porte$f$, $r$tram 17 à 8 min à pied, gare d'Annemasse à 9 min · Genève-Eaux-Vives en 17 min porte-à-porte$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$tram 17 à 8 min à pied, gare d'Annemasse à 18 min · Genève-Eaux-Vives en 24 min porte-à-porte$f$ IN content_fr) > 0
  AND position($r$tram 17 à 8 min à pied, gare d'Annemasse à 9 min · Genève-Eaux-Vives en 17 min porte-à-porte$r$ IN content_fr) = 0;

-- [74/124] quartiers-annemasse-ou-vivre-selon-profil (en) · ligne de trajet · houseCommuteLine(leloft)
UPDATE blog_posts
SET content_en = replace(content_en, $f$tram 17 stop 8 min on foot, Annemasse station 18 min · Geneva Eaux-Vives in 24 min door-to-door$f$, $r$tram 17 stop 8 min on foot, Annemasse station 9 min · Geneva Eaux-Vives in 17 min door-to-door$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$tram 17 stop 8 min on foot, Annemasse station 18 min · Geneva Eaux-Vives in 24 min door-to-door$f$ IN content_en) > 0
  AND position($r$tram 17 stop 8 min on foot, Annemasse station 9 min · Geneva Eaux-Vives in 17 min door-to-door$r$ IN content_en) = 0;

-- [75/124] quartiers-annemasse-ou-vivre-selon-profil (fr) · ligne de trajet · houseCommuteLine(lelodge)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$gare d'Annemasse à 10 min à pied · Genève-Eaux-Vives en 18 min porte-à-porte$f$, $r$gare d'Annemasse à 8 min à pied · Genève-Eaux-Vives en 16 min porte-à-porte$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$gare d'Annemasse à 10 min à pied · Genève-Eaux-Vives en 18 min porte-à-porte$f$ IN content_fr) > 0
  AND position($r$gare d'Annemasse à 8 min à pied · Genève-Eaux-Vives en 16 min porte-à-porte$r$ IN content_fr) = 0;

-- [76/124] quartiers-annemasse-ou-vivre-selon-profil (en) · ligne de trajet · houseCommuteLine(lelodge)
UPDATE blog_posts
SET content_en = replace(content_en, $f$Annemasse station 10 min on foot · Geneva Eaux-Vives in 18 min door-to-door$f$, $r$Annemasse station 8 min on foot · Geneva Eaux-Vives in 16 min door-to-door$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$Annemasse station 10 min on foot · Geneva Eaux-Vives in 18 min door-to-door$f$ IN content_en) > 0
  AND position($r$Annemasse station 8 min on foot · Geneva Eaux-Vives in 16 min door-to-door$r$ IN content_en) = 0;

-- [77/124] quartiers-annemasse-ou-vivre-selon-profil (fr) · phrase de commune · communeSentence(lelodge) avec lien
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[Le Lodge](/lelodge) de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$f$, $r$[Le Lodge](/lelodge) de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte.$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$[Le Lodge](/lelodge) de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$f$ IN content_fr) > 0
  AND position($r$[Le Lodge](/lelodge) de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte.$r$ IN content_fr) = 0;

-- [78/124] quartiers-annemasse-ou-vivre-selon-profil (en) · phrase de commune · communeSentence(lelodge) with link
UPDATE blog_posts
SET content_en = replace(content_en, $f$[Le Lodge](/en/lelodge) by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$f$, $r$[Le Lodge](/en/lelodge) by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door.$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$[Le Lodge](/en/lelodge) by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$f$ IN content_en) > 0
  AND position($r$[Le Lodge](/en/lelodge) by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door.$r$ IN content_en) = 0;

-- [79/124] coliving-colocation-ou-studio-geneve-comparatif (fr) · phrase · tableau : gare à pied selon la maison
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$gare d'Annemasse à 10 à 18 min à pied selon la maison$f$, $r$gare d'Annemasse à 8 à 9 min à pied selon la maison$r$),
    updated_at = now()
WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif'
  AND position($f$gare d'Annemasse à 10 à 18 min à pied selon la maison$f$ IN content_fr) > 0
  AND position($r$gare d'Annemasse à 8 à 9 min à pied selon la maison$r$ IN content_fr) = 0;

-- [80/124] coliving-colocation-ou-studio-geneve-comparatif (en) · phrase · table: walk to the station by house
UPDATE blog_posts
SET content_en = replace(content_en, $f$Annemasse station a 10 to 18-min walk away depending on the house$f$, $r$Annemasse station an 8 to 9-min walk away depending on the house$r$),
    updated_at = now()
WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif'
  AND position($f$Annemasse station a 10 to 18-min walk away depending on the house$f$ IN content_en) > 0
  AND position($r$Annemasse station an 8 to 9-min walk away depending on the house$r$ IN content_en) = 0;

-- [81/124] coliving-colocation-ou-studio-geneve-comparatif (fr) · phrase · les trois maisons à pied de la gare
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Les trois maisons sont à 10, 14 et 18 minutes à pied de la gare d'Annemasse$f$, $r$Les trois maisons sont à 8, 9 et 9 minutes à pied de la gare d'Annemasse$r$),
    updated_at = now()
WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif'
  AND position($f$Les trois maisons sont à 10, 14 et 18 minutes à pied de la gare d'Annemasse$f$ IN content_fr) > 0
  AND position($r$Les trois maisons sont à 8, 9 et 9 minutes à pied de la gare d'Annemasse$r$ IN content_fr) = 0;

-- [82/124] coliving-colocation-ou-studio-geneve-comparatif (en) · phrase · the three houses from the station
UPDATE blog_posts
SET content_en = replace(content_en, $f$The three houses are a 10, 14 and 18-minute walk from Annemasse station$f$, $r$The three houses are an 8, 9 and 9-minute walk from Annemasse station$r$),
    updated_at = now()
WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif'
  AND position($f$The three houses are a 10, 14 and 18-minute walk from Annemasse station$f$ IN content_en) > 0
  AND position($r$The three houses are an 8, 9 and 9-minute walk from Annemasse station$r$ IN content_en) = 0;

-- [83/124] cout-transport-frontalier-geneve-2026 (fr) · phrase · les trois maisons à pied de la gare
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$sont à 10, 14 et 18 minutes à pied de la gare d'Annemasse$f$, $r$sont à 8, 9 et 9 minutes à pied de la gare d'Annemasse$r$),
    updated_at = now()
WHERE slug = 'cout-transport-frontalier-geneve-2026'
  AND position($f$sont à 10, 14 et 18 minutes à pied de la gare d'Annemasse$f$ IN content_fr) > 0
  AND position($r$sont à 8, 9 et 9 minutes à pied de la gare d'Annemasse$r$ IN content_fr) = 0;

-- [84/124] cout-transport-frontalier-geneve-2026 (en) · phrase · the three houses from the station
UPDATE blog_posts
SET content_en = replace(content_en, $f$are a 10, 14 and 18-minute walk from Annemasse station$f$, $r$are an 8, 9 and 9-minute walk from Annemasse station$r$),
    updated_at = now()
WHERE slug = 'cout-transport-frontalier-geneve-2026'
  AND position($f$are a 10, 14 and 18-minute walk from Annemasse station$f$ IN content_en) > 0
  AND position($r$are an 8, 9 and 9-minute walk from Annemasse station$r$ IN content_en) = 0;

-- [85/124] lodge-annemasse-coliving-premium-portes-geneve (fr) · phrase · introduction : gare à pied
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$notre maison d'Annemasse, à 10 min à pied de la gare d'Annemasse.$f$, $r$notre maison d'Annemasse, à 8 min à pied de la gare d'Annemasse.$r$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($f$notre maison d'Annemasse, à 10 min à pied de la gare d'Annemasse.$f$ IN content_fr) > 0
  AND position($r$notre maison d'Annemasse, à 8 min à pied de la gare d'Annemasse.$r$ IN content_fr) = 0;

-- [86/124] lodge-annemasse-coliving-premium-portes-geneve (fr) · phrase · la maison : gare à pied
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$La gare d'Annemasse — et son Léman Express — est à 10 minutes à pied.$f$, $r$La gare d'Annemasse — et son Léman Express — est à 8 minutes à pied.$r$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($f$La gare d'Annemasse — et son Léman Express — est à 10 minutes à pied.$f$ IN content_fr) > 0
  AND position($r$La gare d'Annemasse — et son Léman Express — est à 8 minutes à pied.$r$ IN content_fr) = 0;

-- [87/124] lodge-annemasse-coliving-premium-portes-geneve (fr) · phrase · localisation stratégique
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$à 10 minutes à pied de la gare d'Annemasse, Genève-Eaux-Vives en 18 minutes porte-à-porte$f$, $r$à 8 minutes à pied de la gare d'Annemasse, Genève-Eaux-Vives en 16 minutes porte-à-porte$r$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($f$à 10 minutes à pied de la gare d'Annemasse, Genève-Eaux-Vives en 18 minutes porte-à-porte$f$ IN content_fr) > 0
  AND position($r$à 8 minutes à pied de la gare d'Annemasse, Genève-Eaux-Vives en 16 minutes porte-à-porte$r$ IN content_fr) = 0;

-- [88/124] lodge-annemasse-coliving-premium-portes-geneve (en) · phrase · introduction: walk to the station
UPDATE blog_posts
SET content_en = replace(content_en, $f$our house in Annemasse, a 10-minute walk from Annemasse station.$f$, $r$our house in Annemasse, an 8-minute walk from Annemasse station.$r$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($f$our house in Annemasse, a 10-minute walk from Annemasse station.$f$ IN content_en) > 0
  AND position($r$our house in Annemasse, an 8-minute walk from Annemasse station.$r$ IN content_en) = 0;

-- [89/124] lodge-annemasse-coliving-premium-portes-geneve (en) · phrase · the house: walk to the station
UPDATE blog_posts
SET content_en = replace(content_en, $f$is a 10-minute walk away.$f$, $r$is an 8-minute walk away.$r$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($f$is a 10-minute walk away.$f$ IN content_en) > 0
  AND position($r$is an 8-minute walk away.$r$ IN content_en) = 0;

-- [90/124] lodge-annemasse-coliving-premium-portes-geneve (en) · phrase · strategic location
UPDATE blog_posts
SET content_en = replace(content_en, $f$a 10-minute walk from Annemasse station, Geneva Eaux-Vives in 18 minutes door to door$f$, $r$an 8-minute walk from Annemasse station, Geneva Eaux-Vives in 16 minutes door to door$r$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($f$a 10-minute walk from Annemasse station, Geneva Eaux-Vives in 18 minutes door to door$f$ IN content_en) > 0
  AND position($r$an 8-minute walk from Annemasse station, Geneva Eaux-Vives in 16 minutes door to door$r$ IN content_en) = 0;

-- [91/124] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · phrase · Ambilly : gare à pied depuis Le Loft
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$et la gare d'Annemasse est à 18 min à pied.$f$, $r$et la gare d'Annemasse est à 9 min à pied.$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$et la gare d'Annemasse est à 18 min à pied.$f$ IN content_fr) > 0
  AND position($r$et la gare d'Annemasse est à 9 min à pied.$r$ IN content_fr) = 0;

-- [92/124] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · phrase · Ambilly: walk to the station from Le Loft
UPDATE blog_posts
SET content_en = replace(content_en, $f$and Annemasse station is an 18-minute walk.$f$, $r$and Annemasse station is a 9-minute walk.$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$and Annemasse station is an 18-minute walk.$f$ IN content_en) > 0
  AND position($r$and Annemasse station is a 9-minute walk.$r$ IN content_en) = 0;

-- [93/124] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · tableau · ligne Annemasse (Le Lodge)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$| Genève-Eaux-Vives en 7 min de Léman Express, 18 min porte-à-porte depuis Le Lodge |$f$, $r$| Genève-Eaux-Vives en 7 min de Léman Express, 16 min porte-à-porte depuis Le Lodge |$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$| Genève-Eaux-Vives en 7 min de Léman Express, 18 min porte-à-porte depuis Le Lodge |$f$ IN content_fr) > 0
  AND position($r$| Genève-Eaux-Vives en 7 min de Léman Express, 16 min porte-à-porte depuis Le Lodge |$r$ IN content_fr) = 0;

-- [94/124] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · tableau · ligne Ville-la-Grand (La Villa)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$| Genève-Eaux-Vives en 7 min de Léman Express, 22 min porte-à-porte depuis La Villa |$f$, $r$| Genève-Eaux-Vives en 7 min de Léman Express, 17 min porte-à-porte depuis La Villa |$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$| Genève-Eaux-Vives en 7 min de Léman Express, 22 min porte-à-porte depuis La Villa |$f$ IN content_fr) > 0
  AND position($r$| Genève-Eaux-Vives en 7 min de Léman Express, 17 min porte-à-porte depuis La Villa |$r$ IN content_fr) = 0;

-- [95/124] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · tableau · ligne Ambilly (Le Loft)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 24 min porte-à-porte depuis Le Loft$f$, $r$Genève-Eaux-Vives en 17 min porte-à-porte depuis Le Loft$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$Genève-Eaux-Vives en 24 min porte-à-porte depuis Le Loft$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 17 min porte-à-porte depuis Le Loft$r$ IN content_fr) = 0;

-- [96/124] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · tableau · Annemasse row (Le Lodge)
UPDATE blog_posts
SET content_en = replace(content_en, $f$| Geneva Eaux-Vives in 7 min by Léman Express, 18 min door to door from Le Lodge |$f$, $r$| Geneva Eaux-Vives in 7 min by Léman Express, 16 min door to door from Le Lodge |$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$| Geneva Eaux-Vives in 7 min by Léman Express, 18 min door to door from Le Lodge |$f$ IN content_en) > 0
  AND position($r$| Geneva Eaux-Vives in 7 min by Léman Express, 16 min door to door from Le Lodge |$r$ IN content_en) = 0;

-- [97/124] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · tableau · Ville-la-Grand row (La Villa)
UPDATE blog_posts
SET content_en = replace(content_en, $f$| Geneva Eaux-Vives in 7 min by Léman Express, 22 min door to door from La Villa |$f$, $r$| Geneva Eaux-Vives in 7 min by Léman Express, 17 min door to door from La Villa |$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$| Geneva Eaux-Vives in 7 min by Léman Express, 22 min door to door from La Villa |$f$ IN content_en) > 0
  AND position($r$| Geneva Eaux-Vives in 7 min by Léman Express, 17 min door to door from La Villa |$r$ IN content_en) = 0;

-- [98/124] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · tableau · Ambilly row (Le Loft)
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 24 min door to door from Le Loft$f$, $r$Geneva Eaux-Vives in 17 min door to door from Le Loft$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$Geneva Eaux-Vives in 24 min door to door from Le Loft$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 17 min door to door from Le Loft$r$ IN content_en) = 0;

-- [99/124] quartiers-annemasse-ou-vivre-selon-profil (fr) · phrase · La Villa : registre résidentiel
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$gare d'Annemasse à 14 min à pied, Genève-Eaux-Vives en 22 min porte-à-porte$f$, $r$gare d'Annemasse à 9 min à pied, Genève-Eaux-Vives en 17 min porte-à-porte$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$gare d'Annemasse à 14 min à pied, Genève-Eaux-Vives en 22 min porte-à-porte$f$ IN content_fr) > 0
  AND position($r$gare d'Annemasse à 9 min à pied, Genève-Eaux-Vives en 17 min porte-à-porte$r$ IN content_fr) = 0;

-- [100/124] quartiers-annemasse-ou-vivre-selon-profil (en) · phrase · La Villa: residential register
UPDATE blog_posts
SET content_en = replace(content_en, $f$Annemasse station is a 14-minute walk, Geneva Eaux-Vives 22 minutes door to door$f$, $r$Annemasse station is a 9-minute walk, Geneva Eaux-Vives 17 minutes door to door$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$Annemasse station is a 14-minute walk, Geneva Eaux-Vives 22 minutes door to door$f$ IN content_en) > 0
  AND position($r$Annemasse station is a 9-minute walk, Geneva Eaux-Vives 17 minutes door to door$r$ IN content_en) = 0;

-- [101/124] temps-trajet-annemasse-geneve-par-quartier (fr) · phrase · Léman Express depuis La Villa
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$(gare à 14 min à pied de La Villa, à Ville-la-Grand)$f$, $r$(gare à 9 min à pied de La Villa, à Ville-la-Grand)$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$(gare à 14 min à pied de La Villa, à Ville-la-Grand)$f$ IN content_fr) > 0
  AND position($r$(gare à 9 min à pied de La Villa, à Ville-la-Grand)$r$ IN content_fr) = 0;

-- [102/124] temps-trajet-annemasse-geneve-par-quartier (en) · phrase · Léman Express from La Villa
UPDATE blog_posts
SET content_en = replace(content_en, $f$(station a 14-min walk from La Villa, in Ville-la-Grand)$f$, $r$(station a 9-min walk from La Villa, in Ville-la-Grand)$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$(station a 14-min walk from La Villa, in Ville-la-Grand)$f$ IN content_en) > 0
  AND position($r$(station a 9-min walk from La Villa, in Ville-la-Grand)$r$ IN content_en) = 0;

-- [103/124] temps-trajet-annemasse-geneve-par-quartier (fr) · phrase · Ambilly : gare à pied depuis Le Loft
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$La gare d'Annemasse est à 18 minutes à pied du Loft$f$, $r$La gare d'Annemasse est à 9 minutes à pied du Loft$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$La gare d'Annemasse est à 18 minutes à pied du Loft$f$ IN content_fr) > 0
  AND position($r$La gare d'Annemasse est à 9 minutes à pied du Loft$r$ IN content_fr) = 0;

-- [104/124] temps-trajet-annemasse-geneve-par-quartier (en) · phrase · Ambilly: walk to the station from Le Loft
UPDATE blog_posts
SET content_en = replace(content_en, $f$Annemasse station is an 18-minute walk from Le Loft$f$, $r$Annemasse station is a 9-minute walk from Le Loft$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$Annemasse station is an 18-minute walk from Le Loft$f$ IN content_en) > 0
  AND position($r$Annemasse station is a 9-minute walk from Le Loft$r$ IN content_en) = 0;

-- [105/124] temps-trajet-annemasse-geneve-par-quartier (fr) · phrase · Annemasse : gare à pied depuis Le Lodge
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$est à Annemasse, à 10 minutes à pied de la gare.$f$, $r$est à Annemasse, à 8 minutes à pied de la gare.$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$est à Annemasse, à 10 minutes à pied de la gare.$f$ IN content_fr) > 0
  AND position($r$est à Annemasse, à 8 minutes à pied de la gare.$r$ IN content_fr) = 0;

-- [106/124] temps-trajet-annemasse-geneve-par-quartier (en) · phrase · Annemasse: walk to the station from Le Lodge
UPDATE blog_posts
SET content_en = replace(content_en, $f$is in Annemasse, a 10-minute walk from the station.$f$, $r$is in Annemasse, an 8-minute walk from the station.$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$is in Annemasse, a 10-minute walk from the station.$f$ IN content_en) > 0
  AND position($r$is in Annemasse, an 8-minute walk from the station.$r$ IN content_en) = 0;

-- [107/124] temps-trajet-annemasse-geneve-par-quartier (fr) · phrase · les trois maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$La Villa à Ville-la-Grand est à 14 minutes à pied de la gare d'Annemasse. Le Loft à Ambilly, à 18 minutes à pied de la gare et à 8 minutes du tram 17. Le Lodge à Annemasse, à 10 minutes à pied.$f$, $r$La Villa à Ville-la-Grand est à 9 minutes à pied de la gare d'Annemasse. Le Loft à Ambilly, à 9 minutes à pied de la gare et à 8 minutes du tram 17. Le Lodge à Annemasse, à 8 minutes à pied.$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$La Villa à Ville-la-Grand est à 14 minutes à pied de la gare d'Annemasse. Le Loft à Ambilly, à 18 minutes à pied de la gare et à 8 minutes du tram 17. Le Lodge à Annemasse, à 10 minutes à pied.$f$ IN content_fr) > 0
  AND position($r$La Villa à Ville-la-Grand est à 9 minutes à pied de la gare d'Annemasse. Le Loft à Ambilly, à 9 minutes à pied de la gare et à 8 minutes du tram 17. Le Lodge à Annemasse, à 8 minutes à pied.$r$ IN content_fr) = 0;

-- [108/124] temps-trajet-annemasse-geneve-par-quartier (en) · phrase · the three houses
UPDATE blog_posts
SET content_en = replace(content_en, $f$La Villa in Ville-la-Grand is a 14-minute walk from Annemasse station. Le Loft in Ambilly, an 18-minute walk from the station and 8 minutes from tram 17. Le Lodge in Annemasse, a 10-minute walk.$f$, $r$La Villa in Ville-la-Grand is a 9-minute walk from Annemasse station. Le Loft in Ambilly, a 9-minute walk from the station and 8 minutes from tram 17. Le Lodge in Annemasse, an 8-minute walk.$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$La Villa in Ville-la-Grand is a 14-minute walk from Annemasse station. Le Loft in Ambilly, an 18-minute walk from the station and 8 minutes from tram 17. Le Lodge in Annemasse, a 10-minute walk.$f$ IN content_en) > 0
  AND position($r$La Villa in Ville-la-Grand is a 9-minute walk from Annemasse station. Le Loft in Ambilly, a 9-minute walk from the station and 8 minutes from tram 17. Le Lodge in Annemasse, an 8-minute walk.$r$ IN content_en) = 0;

-- [109/124] temps-trajet-annemasse-geneve-par-quartier (fr) · phrase · Plan-les-Ouates : La Villa
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$La Villa (10 chambres) est à 14 min à pied de la gare.$f$, $r$La Villa (10 chambres) est à 9 min à pied de la gare.$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$La Villa (10 chambres) est à 14 min à pied de la gare.$f$ IN content_fr) > 0
  AND position($r$La Villa (10 chambres) est à 9 min à pied de la gare.$r$ IN content_fr) = 0;

-- [110/124] temps-trajet-annemasse-geneve-par-quartier (en) · phrase · Plan-les-Ouates: La Villa
UPDATE blog_posts
SET content_en = replace(content_en, $f$La Villa (10 rooms) is a 14-min walk from the station$f$, $r$La Villa (10 rooms) is a 9-min walk from the station$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$La Villa (10 rooms) is a 14-min walk from the station$f$ IN content_en) > 0
  AND position($r$La Villa (10 rooms) is a 9-min walk from the station$r$ IN content_en) = 0;

-- [111/124] transport-annemasse-geneve-leman-express (fr) · phrase · depuis nos maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Depuis nos maisons : 10 min à pied du Lodge (Annemasse), 14 min de La Villa (Ville-la-Grand), 18 min du Loft (Ambilly)$f$, $r$Depuis nos maisons : 8 min à pied du Lodge (Annemasse), 9 min de La Villa (Ville-la-Grand), 9 min du Loft (Ambilly)$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$Depuis nos maisons : 10 min à pied du Lodge (Annemasse), 14 min de La Villa (Ville-la-Grand), 18 min du Loft (Ambilly)$f$ IN content_fr) > 0
  AND position($r$Depuis nos maisons : 8 min à pied du Lodge (Annemasse), 9 min de La Villa (Ville-la-Grand), 9 min du Loft (Ambilly)$r$ IN content_fr) = 0;

-- [112/124] transport-annemasse-geneve-leman-express (en) · phrase · from our houses
UPDATE blog_posts
SET content_en = replace(content_en, $f$From our houses: a 10-min walk from Le Lodge (Annemasse), 14 min from La Villa (Ville-la-Grand), 18 min from Le Loft (Ambilly)$f$, $r$From our houses: an 8-min walk from Le Lodge (Annemasse), 9 min from La Villa (Ville-la-Grand), 9 min from Le Loft (Ambilly)$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$From our houses: a 10-min walk from Le Lodge (Annemasse), 14 min from La Villa (Ville-la-Grand), 18 min from Le Loft (Ambilly)$f$ IN content_en) > 0
  AND position($r$From our houses: an 8-min walk from Le Lodge (Annemasse), 9 min from La Villa (Ville-la-Grand), 9 min from Le Loft (Ambilly)$r$ IN content_en) = 0;

-- [113/124] transport-annemasse-geneve-leman-express (fr) · tableau · Cornavin porte-à-porte depuis La Villa
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$23 min de train · 38 min porte-à-porte depuis La Villa$f$, $r$23 min de train · 33 min porte-à-porte depuis La Villa$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$23 min de train · 38 min porte-à-porte depuis La Villa$f$ IN content_fr) > 0
  AND position($r$23 min de train · 33 min porte-à-porte depuis La Villa$r$ IN content_fr) = 0;

-- [114/124] transport-annemasse-geneve-leman-express (en) · tableau · Cornavin door to door from La Villa
UPDATE blog_posts
SET content_en = replace(content_en, $f$23 min by train · 38 min door to door from La Villa$f$, $r$23 min by train · 33 min door to door from La Villa$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$23 min by train · 38 min door to door from La Villa$f$ IN content_en) > 0
  AND position($r$23 min by train · 33 min door to door from La Villa$r$ IN content_en) = 0;

-- [115/124] transport-annemasse-geneve-leman-express (fr) · phrase · Ville-la-Grand : gare à pied
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$La gare d'Annemasse est à 14 min à pied de La Villa, à Ville-la-Grand.$f$, $r$La gare d'Annemasse est à 9 min à pied de La Villa, à Ville-la-Grand.$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$La gare d'Annemasse est à 14 min à pied de La Villa, à Ville-la-Grand.$f$ IN content_fr) > 0
  AND position($r$La gare d'Annemasse est à 9 min à pied de La Villa, à Ville-la-Grand.$r$ IN content_fr) = 0;

-- [116/124] transport-annemasse-geneve-leman-express (en) · phrase · Ville-la-Grand: walk to the station
UPDATE blog_posts
SET content_en = replace(content_en, $f$Annemasse station is a 14-min walk from La Villa, in Ville-la-Grand$f$, $r$Annemasse station is a 9-min walk from La Villa, in Ville-la-Grand$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$Annemasse station is a 14-min walk from La Villa, in Ville-la-Grand$f$ IN content_en) > 0
  AND position($r$Annemasse station is a 9-min walk from La Villa, in Ville-la-Grand$r$ IN content_en) = 0;

-- [117/124] transport-annemasse-geneve-leman-express (fr) · phrase · Ambilly : gare et tram depuis Le Loft
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$La gare d'Annemasse est à 18 min à pied du Loft, le tram 17 à 8 min.$f$, $r$La gare d'Annemasse est à 9 min à pied du Loft, le tram 17 à 8 min.$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$La gare d'Annemasse est à 18 min à pied du Loft, le tram 17 à 8 min.$f$ IN content_fr) > 0
  AND position($r$La gare d'Annemasse est à 9 min à pied du Loft, le tram 17 à 8 min.$r$ IN content_fr) = 0;

-- [118/124] transport-annemasse-geneve-leman-express (en) · phrase · Ambilly: station and tram from Le Loft
UPDATE blog_posts
SET content_en = replace(content_en, $f$Annemasse station is an 18-min walk from Le Loft, tram 17 an 8-min walk.$f$, $r$Annemasse station is a 9-min walk from Le Loft, tram 17 an 8-min walk.$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$Annemasse station is an 18-min walk from Le Loft, tram 17 an 8-min walk.$f$ IN content_en) > 0
  AND position($r$Annemasse station is a 9-min walk from Le Loft, tram 17 an 8-min walk.$r$ IN content_en) = 0;

-- [119/124] vivre-a-annemasse-quand-on-travaille-a-geneve (fr) · phrase · Ambilly : Le Loft
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Notre maison Le Loft y est, à 8 minutes à pied du tram et à 18 minutes à pied de la gare.$f$, $r$Notre maison Le Loft y est, à 8 minutes à pied du tram et à 9 minutes à pied de la gare.$r$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($f$Notre maison Le Loft y est, à 8 minutes à pied du tram et à 18 minutes à pied de la gare.$f$ IN content_fr) > 0
  AND position($r$Notre maison Le Loft y est, à 8 minutes à pied du tram et à 9 minutes à pied de la gare.$r$ IN content_fr) = 0;

-- [120/124] vivre-a-annemasse-quand-on-travaille-a-geneve (en) · phrase · Ambilly: Le Loft
UPDATE blog_posts
SET content_en = replace(content_en, $f$Our house Le Loft is there, an 8-minute walk from the tram and an 18-minute walk from the station.$f$, $r$Our house Le Loft is there, an 8-minute walk from the tram and a 9-minute walk from the station.$r$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($f$Our house Le Loft is there, an 8-minute walk from the tram and an 18-minute walk from the station.$f$ IN content_en) > 0
  AND position($r$Our house Le Loft is there, an 8-minute walk from the tram and a 9-minute walk from the station.$r$ IN content_en) = 0;

-- [121/124] vivre-a-annemasse-quand-on-travaille-a-geneve (fr) · phrase · Ville-la-Grand : La Villa
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$à 14 minutes à pied de la gare depuis notre maison La Villa.$f$, $r$à 9 minutes à pied de la gare depuis notre maison La Villa.$r$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($f$à 14 minutes à pied de la gare depuis notre maison La Villa.$f$ IN content_fr) > 0
  AND position($r$à 9 minutes à pied de la gare depuis notre maison La Villa.$r$ IN content_fr) = 0;

-- [122/124] vivre-a-annemasse-quand-on-travaille-a-geneve (en) · phrase · Ville-la-Grand: La Villa
UPDATE blog_posts
SET content_en = replace(content_en, $f$a 14-minute walk from the station from our house La Villa.$f$, $r$a 9-minute walk from the station from our house La Villa.$r$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($f$a 14-minute walk from the station from our house La Villa.$f$ IN content_en) > 0
  AND position($r$a 9-minute walk from the station from our house La Villa.$r$ IN content_en) = 0;

-- [123/124] vivre-a-annemasse-quand-on-travaille-a-geneve (fr) · phrase · nos trois maisons : Le Lodge
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Le Lodge à Romagny pour le train (gare à 10 minutes à pied)$f$, $r$Le Lodge à Romagny pour le train (gare à 8 minutes à pied)$r$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($f$Le Lodge à Romagny pour le train (gare à 10 minutes à pied)$f$ IN content_fr) > 0
  AND position($r$Le Lodge à Romagny pour le train (gare à 8 minutes à pied)$r$ IN content_fr) = 0;

-- [124/124] vivre-a-annemasse-quand-on-travaille-a-geneve (en) · phrase · our three houses: Le Lodge
UPDATE blog_posts
SET content_en = replace(content_en, $f$Le Lodge in Romagny for the train (station a 10-minute walk away)$f$, $r$Le Lodge in Romagny for the train (station an 8-minute walk away)$r$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($f$Le Lodge in Romagny for the train (station a 10-minute walk away)$f$ IN content_en) > 0
  AND position($r$Le Lodge in Romagny for the train (station an 8-minute walk away)$r$ IN content_en) = 0;

-- ── Aperçu des ancrages (ancien → nouveau, première ligne de chaque texte) ──
-- [1] allocations-familiales-frontalier-geneve-2026/fr · formule D1 : « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … » → « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … »
-- [2] allocations-familiales-frontalier-geneve-2026/en · formule D1 : « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … » → « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … »
-- [3] arnaques-logement-frontalier-geneve-eviter/fr · formule D1 : « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … » → « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … »
-- [4] arnaques-logement-frontalier-geneve-eviter/en · formule D1 : « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … » → « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … »
-- [5] assurance-sante-frontalier-lamal-cmu-budget/fr · formule D1 : « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … » → « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … »
-- [6] assurance-sante-frontalier-lamal-cmu-budget/en · formule D1 : « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … » → « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … »
-- [7] banque-telephone-internet-frontalier-bons-plans/fr · formule D1 : « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … » → « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … »
-- [8] banque-telephone-internet-frontalier-bons-plans/en · formule D1 : « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … » → « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … »
-- [9] budget-colocation-geneve-guide-complet/fr · formule D1 : « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … » → « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … »
-- [10] budget-colocation-geneve-guide-complet/en · formule D1 : « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … » → « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … »
-- [11] choc-culturel-franco-suisse-expatrie-geneve/fr · formule D1 : « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … » → « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … »
-- [12] choc-culturel-franco-suisse-expatrie-geneve/en · formule D1 : « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … » → « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … »
-- [13] cout-de-la-vie-suisse-france-frontalier-2026/fr · formule D1 : « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … » → « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … »
-- [14] cout-de-la-vie-suisse-france-frontalier-2026/en · formule D1 : « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … » → « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … »
-- [15] declaration-impots-frontalier-2026/fr · formule D1 : « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … » → « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … »
-- [16] declaration-impots-frontalier-2026/en · formule D1 : « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … » → « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … »
-- [17] ecole-internationale-geneve-frontalier-ou-habiter/fr · formule D1 : « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … » → « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … »
-- [18] ecole-internationale-geneve-frontalier-ou-habiter/en · formule D1 : « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … » → « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … »
-- [19] fiscalite-frontalier-geneve-impots-2026/fr · formule D1 : « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … » → « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … »
-- [20] fiscalite-frontalier-geneve-impots-2026/en · formule D1 : « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … » → « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … »
-- [21] grand-geneve-2026-nouveautes-frontaliers/fr · formule D1 : « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … » → « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … »
-- [22] grand-geneve-2026-nouveautes-frontaliers/en · formule D1 : « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … » → « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … »
-- [23] living-in-france-working-in-geneva/fr · formule D1 : « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … » → « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … »
-- [24] living-in-france-working-in-geneva/en · formule D1 : « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … » → « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … »
-- [25] optimiser-espace-coliving-productivite-bien-etre/fr · formule D1 : « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … » → « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … »
-- [26] optimiser-espace-coliving-productivite-bien-etre/en · formule D1 : « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … » → « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … »
-- [27] organisations-internationales-geneve-ou-habiter/fr · formule D1 : « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … » → « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … »
-- [28] organisations-internationales-geneve-ou-habiter/en · formule D1 : « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … » → « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … »
-- [29] ou-habiter-en-france-quand-on-travaille-a-geneve/fr · formule D1 : « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … » → « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … »
-- [30] ou-habiter-en-france-quand-on-travaille-a-geneve/en · formule D1 : « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … » → « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … »
-- [31] permis-g-frontalier-geneve/fr · formule D1 : « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … » → « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … »
-- [32] permis-g-frontalier-geneve/en · formule D1 : « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … » → « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … »
-- [33] quitter-son-logement-guide-pratique/fr · formule D1 : « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … » → « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … »
-- [34] quitter-son-logement-guide-pratique/en · formule D1 : « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … » → « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … »
-- [35] salaire-suisse-net-frontalier-2026/fr · formule D1 : « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … » → « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … »
-- [36] salaire-suisse-net-frontalier-2026/en · formule D1 : « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … » → « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … »
-- [37] se-faire-reseau-geneve-arriver-seul/fr · formule D1 : « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … » → « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … »
-- [38] se-faire-reseau-geneve-arriver-seul/en · formule D1 : « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … » → « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … »
-- [39] teletravail-frontalier-geneve-regles-2026/fr · formule D1 : « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … » → « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … »
-- [40] teletravail-frontalier-geneve-regles-2026/en · formule D1 : « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … » → « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … »
-- [41] trouver-colocation-geneve-frontalier/fr · formule D1 : « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … » → « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … »
-- [42] trouver-colocation-geneve-frontalier/en · formule D1 : « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … » → « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … »
-- [43] trouver-logement-avant-d-arriver-geneve/fr · formule D1 : « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … » → « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … »
-- [44] trouver-logement-avant-d-arriver-geneve/en · formule D1 : « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … » → « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … »
-- [45] vie-quotidienne-frontalier-courses-sport-sorties/fr · formule D1 : « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … » → « Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse … »
-- [46] vie-quotidienne-frontalier-courses-sport-sorties/en · formule D1 : « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … » → « Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station … »
-- [47] guide-ressources-frontalier-geneve/fr · formule D1 : « côté France (Genève-Eaux-Vives en 7 min de Léman Express depuis la gare… » → « côté France (Genève-Eaux-Vives en 7 min de Léman Express depuis la gare… »
-- [48] guide-ressources-frontalier-geneve/fr · formule D1 : « sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depu… » → « sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depu… »
-- [49] guide-ressources-frontalier-geneve/en · formule D1 : « on the French side (Geneva Eaux-Vives in 7 minutes by Léman Express fro… » → « on the French side (Geneva Eaux-Vives in 7 minutes by Léman Express fro… »
-- [50] guide-ressources-frontalier-geneve/en · formule D1 : « no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express fro… » → « no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express fro… »
-- [51] guide-ressources-frontalier-geneve/fr · tableau : « 23 min de train, 35 à 40 min porte-à-porte selon la maison » → « 23 min de train, 33 min porte-à-porte depuis chaque maison »
-- [52] guide-ressources-frontalier-geneve/en · tableau : « 23 min by train, 35 to 40 min door to door depending on the house » → « 23 min by train, 33 min door to door from each house »
-- [53] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · phrase de commune : « À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier … » → « À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier … »
-- [54] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · phrase de commune : « In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny d… » → « In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny d… »
-- [55] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · phrase de commune : « À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 14 … » → « À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 9 m… »
-- [56] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · phrase de commune : « In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 14-min… » → « In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 9-minu… »
-- [57] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · phrase de commune : « À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied… » → « À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied… »
-- [58] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · phrase de commune : « In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk … » → « In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk … »
-- [59] colocation-annemasse-ville-la-grand-ambilly/fr · phrase de commune : « À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier … » → « À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier … »
-- [60] colocation-annemasse-ville-la-grand-ambilly/en · phrase de commune : « In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny d… » → « In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny d… »
-- [61] colocation-annemasse-ville-la-grand-ambilly/fr · phrase de commune : « À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 14 … » → « À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 9 m… »
-- [62] colocation-annemasse-ville-la-grand-ambilly/en · phrase de commune : « In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 14-min… » → « In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 9-minu… »
-- [63] colocation-annemasse-ville-la-grand-ambilly/fr · phrase de commune : « À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied… » → « À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied… »
-- [64] colocation-annemasse-ville-la-grand-ambilly/en · phrase de commune : « In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk … » → « In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk … »
-- [65] quartiers-annemasse-ou-vivre-selon-profil/fr · phrase de commune : « À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier … » → « À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier … »
-- [66] quartiers-annemasse-ou-vivre-selon-profil/en · phrase de commune : « In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny d… » → « In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny d… »
-- [67] vivre-a-annemasse-quand-on-travaille-a-geneve/fr · phrase de commune : « À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier … » → « À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier … »
-- [68] vivre-a-annemasse-quand-on-travaille-a-geneve/en · phrase de commune : « In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny d… » → « In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny d… »
-- [69] vivre-a-annemasse-quand-on-travaille-a-geneve/fr · phrase de commune : « À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier … » → « À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier … »
-- [70] vivre-a-annemasse-quand-on-travaille-a-geneve/en · phrase de commune : « In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny d… » → « In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny d… »
-- [71] quartiers-annemasse-ou-vivre-selon-profil/fr · ligne de trajet : « gare d'Annemasse à 14 min à pied · Genève-Eaux-Vives en 22 min porte-à-… » → « gare d'Annemasse à 9 min à pied · Genève-Eaux-Vives en 17 min porte-à-p… »
-- [72] quartiers-annemasse-ou-vivre-selon-profil/en · ligne de trajet : « Annemasse station 14 min on foot · Geneva Eaux-Vives in 22 min door-to-… » → « Annemasse station 9 min on foot · Geneva Eaux-Vives in 17 min door-to-d… »
-- [73] quartiers-annemasse-ou-vivre-selon-profil/fr · ligne de trajet : « tram 17 à 8 min à pied, gare d'Annemasse à 18 min · Genève-Eaux-Vives e… » → « tram 17 à 8 min à pied, gare d'Annemasse à 9 min · Genève-Eaux-Vives en… »
-- [74] quartiers-annemasse-ou-vivre-selon-profil/en · ligne de trajet : « tram 17 stop 8 min on foot, Annemasse station 18 min · Geneva Eaux-Vive… » → « tram 17 stop 8 min on foot, Annemasse station 9 min · Geneva Eaux-Vives… »
-- [75] quartiers-annemasse-ou-vivre-selon-profil/fr · ligne de trajet : « gare d'Annemasse à 10 min à pied · Genève-Eaux-Vives en 18 min porte-à-… » → « gare d'Annemasse à 8 min à pied · Genève-Eaux-Vives en 16 min porte-à-p… »
-- [76] quartiers-annemasse-ou-vivre-selon-profil/en · ligne de trajet : « Annemasse station 10 min on foot · Geneva Eaux-Vives in 18 min door-to-… » → « Annemasse station 8 min on foot · Geneva Eaux-Vives in 16 min door-to-d… »
-- [77] quartiers-annemasse-ou-vivre-selon-profil/fr · phrase de commune : « [Le Lodge](/lelodge) de La Villa Coliving (12 chambres, quartier de Rom… » → « [Le Lodge](/lelodge) de La Villa Coliving (12 chambres, quartier de Rom… »
-- [78] quartiers-annemasse-ou-vivre-selon-profil/en · phrase de commune : « [Le Lodge](/en/lelodge) by La Villa Coliving (12 rooms, Romagny distric… » → « [Le Lodge](/en/lelodge) by La Villa Coliving (12 rooms, Romagny distric… »
-- [79] coliving-colocation-ou-studio-geneve-comparatif/fr · phrase : « gare d'Annemasse à 10 à 18 min à pied selon la maison » → « gare d'Annemasse à 8 à 9 min à pied selon la maison »
-- [80] coliving-colocation-ou-studio-geneve-comparatif/en · phrase : « Annemasse station a 10 to 18-min walk away depending on the house » → « Annemasse station an 8 to 9-min walk away depending on the house »
-- [81] coliving-colocation-ou-studio-geneve-comparatif/fr · phrase : « Les trois maisons sont à 10, 14 et 18 minutes à pied de la gare d'Annem… » → « Les trois maisons sont à 8, 9 et 9 minutes à pied de la gare d'Annemasse »
-- [82] coliving-colocation-ou-studio-geneve-comparatif/en · phrase : « The three houses are a 10, 14 and 18-minute walk from Annemasse station » → « The three houses are an 8, 9 and 9-minute walk from Annemasse station »
-- [83] cout-transport-frontalier-geneve-2026/fr · phrase : « sont à 10, 14 et 18 minutes à pied de la gare d'Annemasse » → « sont à 8, 9 et 9 minutes à pied de la gare d'Annemasse »
-- [84] cout-transport-frontalier-geneve-2026/en · phrase : « are a 10, 14 and 18-minute walk from Annemasse station » → « are an 8, 9 and 9-minute walk from Annemasse station »
-- [85] lodge-annemasse-coliving-premium-portes-geneve/fr · phrase : « notre maison d'Annemasse, à 10 min à pied de la gare d'Annemasse. » → « notre maison d'Annemasse, à 8 min à pied de la gare d'Annemasse. »
-- [86] lodge-annemasse-coliving-premium-portes-geneve/fr · phrase : « La gare d'Annemasse — et son Léman Express — est à 10 minutes à pied. » → « La gare d'Annemasse — et son Léman Express — est à 8 minutes à pied. »
-- [87] lodge-annemasse-coliving-premium-portes-geneve/fr · phrase : « à 10 minutes à pied de la gare d'Annemasse, Genève-Eaux-Vives en 18 min… » → « à 8 minutes à pied de la gare d'Annemasse, Genève-Eaux-Vives en 16 minu… »
-- [88] lodge-annemasse-coliving-premium-portes-geneve/en · phrase : « our house in Annemasse, a 10-minute walk from Annemasse station. » → « our house in Annemasse, an 8-minute walk from Annemasse station. »
-- [89] lodge-annemasse-coliving-premium-portes-geneve/en · phrase : « is a 10-minute walk away. » → « is an 8-minute walk away. »
-- [90] lodge-annemasse-coliving-premium-portes-geneve/en · phrase : « a 10-minute walk from Annemasse station, Geneva Eaux-Vives in 18 minute… » → « an 8-minute walk from Annemasse station, Geneva Eaux-Vives in 16 minute… »
-- [91] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · phrase : « et la gare d'Annemasse est à 18 min à pied. » → « et la gare d'Annemasse est à 9 min à pied. »
-- [92] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · phrase : « and Annemasse station is an 18-minute walk. » → « and Annemasse station is a 9-minute walk. »
-- [93] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · tableau : « | Genève-Eaux-Vives en 7 min de Léman Express, 18 min porte-à-porte dep… » → « | Genève-Eaux-Vives en 7 min de Léman Express, 16 min porte-à-porte dep… »
-- [94] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · tableau : « | Genève-Eaux-Vives en 7 min de Léman Express, 22 min porte-à-porte dep… » → « | Genève-Eaux-Vives en 7 min de Léman Express, 17 min porte-à-porte dep… »
-- [95] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · tableau : « Genève-Eaux-Vives en 24 min porte-à-porte depuis Le Loft » → « Genève-Eaux-Vives en 17 min porte-à-porte depuis Le Loft »
-- [96] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · tableau : « | Geneva Eaux-Vives in 7 min by Léman Express, 18 min door to door from… » → « | Geneva Eaux-Vives in 7 min by Léman Express, 16 min door to door from… »
-- [97] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · tableau : « | Geneva Eaux-Vives in 7 min by Léman Express, 22 min door to door from… » → « | Geneva Eaux-Vives in 7 min by Léman Express, 17 min door to door from… »
-- [98] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · tableau : « Geneva Eaux-Vives in 24 min door to door from Le Loft » → « Geneva Eaux-Vives in 17 min door to door from Le Loft »
-- [99] quartiers-annemasse-ou-vivre-selon-profil/fr · phrase : « gare d'Annemasse à 14 min à pied, Genève-Eaux-Vives en 22 min porte-à-p… » → « gare d'Annemasse à 9 min à pied, Genève-Eaux-Vives en 17 min porte-à-po… »
-- [100] quartiers-annemasse-ou-vivre-selon-profil/en · phrase : « Annemasse station is a 14-minute walk, Geneva Eaux-Vives 22 minutes doo… » → « Annemasse station is a 9-minute walk, Geneva Eaux-Vives 17 minutes door… »
-- [101] temps-trajet-annemasse-geneve-par-quartier/fr · phrase : « (gare à 14 min à pied de La Villa, à Ville-la-Grand) » → « (gare à 9 min à pied de La Villa, à Ville-la-Grand) »
-- [102] temps-trajet-annemasse-geneve-par-quartier/en · phrase : « (station a 14-min walk from La Villa, in Ville-la-Grand) » → « (station a 9-min walk from La Villa, in Ville-la-Grand) »
-- [103] temps-trajet-annemasse-geneve-par-quartier/fr · phrase : « La gare d'Annemasse est à 18 minutes à pied du Loft » → « La gare d'Annemasse est à 9 minutes à pied du Loft »
-- [104] temps-trajet-annemasse-geneve-par-quartier/en · phrase : « Annemasse station is an 18-minute walk from Le Loft » → « Annemasse station is a 9-minute walk from Le Loft »
-- [105] temps-trajet-annemasse-geneve-par-quartier/fr · phrase : « est à Annemasse, à 10 minutes à pied de la gare. » → « est à Annemasse, à 8 minutes à pied de la gare. »
-- [106] temps-trajet-annemasse-geneve-par-quartier/en · phrase : « is in Annemasse, a 10-minute walk from the station. » → « is in Annemasse, an 8-minute walk from the station. »
-- [107] temps-trajet-annemasse-geneve-par-quartier/fr · phrase : « La Villa à Ville-la-Grand est à 14 minutes à pied de la gare d'Annemass… » → « La Villa à Ville-la-Grand est à 9 minutes à pied de la gare d'Annemasse… »
-- [108] temps-trajet-annemasse-geneve-par-quartier/en · phrase : « La Villa in Ville-la-Grand is a 14-minute walk from Annemasse station. … » → « La Villa in Ville-la-Grand is a 9-minute walk from Annemasse station. L… »
-- [109] temps-trajet-annemasse-geneve-par-quartier/fr · phrase : « La Villa (10 chambres) est à 14 min à pied de la gare. » → « La Villa (10 chambres) est à 9 min à pied de la gare. »
-- [110] temps-trajet-annemasse-geneve-par-quartier/en · phrase : « La Villa (10 rooms) is a 14-min walk from the station » → « La Villa (10 rooms) is a 9-min walk from the station »
-- [111] transport-annemasse-geneve-leman-express/fr · phrase : « Depuis nos maisons : 10 min à pied du Lodge (Annemasse), 14 min de La V… » → « Depuis nos maisons : 8 min à pied du Lodge (Annemasse), 9 min de La Vil… »
-- [112] transport-annemasse-geneve-leman-express/en · phrase : « From our houses: a 10-min walk from Le Lodge (Annemasse), 14 min from L… » → « From our houses: an 8-min walk from Le Lodge (Annemasse), 9 min from La… »
-- [113] transport-annemasse-geneve-leman-express/fr · tableau : « 23 min de train · 38 min porte-à-porte depuis La Villa » → « 23 min de train · 33 min porte-à-porte depuis La Villa »
-- [114] transport-annemasse-geneve-leman-express/en · tableau : « 23 min by train · 38 min door to door from La Villa » → « 23 min by train · 33 min door to door from La Villa »
-- [115] transport-annemasse-geneve-leman-express/fr · phrase : « La gare d'Annemasse est à 14 min à pied de La Villa, à Ville-la-Grand. » → « La gare d'Annemasse est à 9 min à pied de La Villa, à Ville-la-Grand. »
-- [116] transport-annemasse-geneve-leman-express/en · phrase : « Annemasse station is a 14-min walk from La Villa, in Ville-la-Grand » → « Annemasse station is a 9-min walk from La Villa, in Ville-la-Grand »
-- [117] transport-annemasse-geneve-leman-express/fr · phrase : « La gare d'Annemasse est à 18 min à pied du Loft, le tram 17 à 8 min. » → « La gare d'Annemasse est à 9 min à pied du Loft, le tram 17 à 8 min. »
-- [118] transport-annemasse-geneve-leman-express/en · phrase : « Annemasse station is an 18-min walk from Le Loft, tram 17 an 8-min walk. » → « Annemasse station is a 9-min walk from Le Loft, tram 17 an 8-min walk. »
-- [119] vivre-a-annemasse-quand-on-travaille-a-geneve/fr · phrase : « Notre maison Le Loft y est, à 8 minutes à pied du tram et à 18 minutes … » → « Notre maison Le Loft y est, à 8 minutes à pied du tram et à 9 minutes à… »
-- [120] vivre-a-annemasse-quand-on-travaille-a-geneve/en · phrase : « Our house Le Loft is there, an 8-minute walk from the tram and an 18-mi… » → « Our house Le Loft is there, an 8-minute walk from the tram and a 9-minu… »
-- [121] vivre-a-annemasse-quand-on-travaille-a-geneve/fr · phrase : « à 14 minutes à pied de la gare depuis notre maison La Villa. » → « à 9 minutes à pied de la gare depuis notre maison La Villa. »
-- [122] vivre-a-annemasse-quand-on-travaille-a-geneve/en · phrase : « a 14-minute walk from the station from our house La Villa. » → « a 9-minute walk from the station from our house La Villa. »
-- [123] vivre-a-annemasse-quand-on-travaille-a-geneve/fr · phrase : « Le Lodge à Romagny pour le train (gare à 10 minutes à pied) » → « Le Lodge à Romagny pour le train (gare à 8 minutes à pied) »
-- [124] vivre-a-annemasse-quand-on-travaille-a-geneve/en · phrase : « Le Lodge in Romagny for the train (station a 10-minute walk away) » → « Le Lodge in Romagny for the train (station an 8-minute walk away) »

COMMIT;

-- ── Vérification (lecture seule) : une ligne par article ; fr_ok / en_ok = true quand toutes les modifications de la langue sont en place, NULL = langue non touchée.
SELECT slug,
  CASE slug
    WHEN 'allocations-familiales-frontalier-geneve-2026' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'arnaques-logement-frontalier-geneve-eviter' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'assurance-sante-frontalier-lamal-cmu-budget' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'banque-telephone-internet-frontalier-bons-plans' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'budget-colocation-geneve-guide-complet' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'choc-culturel-franco-suisse-expatrie-geneve' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'coliving-colocation-ou-studio-geneve-comparatif' THEN (position($f$gare d'Annemasse à 10 à 18 min à pied selon la maison$f$ IN content_fr) = 0
      AND position($f$Les trois maisons sont à 10, 14 et 18 minutes à pied de la gare d'Annemasse$f$ IN content_fr) = 0)
    WHEN 'colocation-annemasse-ville-la-grand-ambilly' THEN (position($f$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$f$ IN content_fr) = 0
      AND position($f$À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 14 min à pied de la gare d'Annemasse — Genève-Eaux-Vives en 22 min porte-à-porte.$f$ IN content_fr) = 0
      AND position($f$À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.$f$ IN content_fr) = 0)
    WHEN 'cout-de-la-vie-suisse-france-frontalier-2026' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'cout-transport-frontalier-geneve-2026' THEN (position($f$sont à 10, 14 et 18 minutes à pied de la gare d'Annemasse$f$ IN content_fr) = 0)
    WHEN 'declaration-impots-frontalier-2026' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'ecole-internationale-geneve-frontalier-ou-habiter' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'fiscalite-frontalier-geneve-impots-2026' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'grand-geneve-2026-nouveautes-frontaliers' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'guide-ressources-frontalier-geneve' THEN (position($f$côté France (Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0
      AND position($f$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0
      AND position($f$23 min de train, 35 à 40 min porte-à-porte selon la maison$f$ IN content_fr) = 0)
    WHEN 'living-in-france-working-in-geneva' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'lodge-annemasse-coliving-premium-portes-geneve' THEN (position($f$notre maison d'Annemasse, à 10 min à pied de la gare d'Annemasse.$f$ IN content_fr) = 0
      AND position($f$La gare d'Annemasse — et son Léman Express — est à 10 minutes à pied.$f$ IN content_fr) = 0
      AND position($f$à 10 minutes à pied de la gare d'Annemasse, Genève-Eaux-Vives en 18 minutes porte-à-porte$f$ IN content_fr) = 0)
    WHEN 'optimiser-espace-coliving-productivite-bien-etre' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'organisations-internationales-geneve-ou-habiter' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'ou-habiter-en-france-quand-on-travaille-a-geneve' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'ou-habiter-frontalier-suisse-villes-france-pas-cher' THEN (position($f$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$f$ IN content_fr) = 0
      AND position($f$À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 14 min à pied de la gare d'Annemasse — Genève-Eaux-Vives en 22 min porte-à-porte.$f$ IN content_fr) = 0
      AND position($f$À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.$f$ IN content_fr) = 0
      AND position($f$et la gare d'Annemasse est à 18 min à pied.$f$ IN content_fr) = 0
      AND position($f$| Genève-Eaux-Vives en 7 min de Léman Express, 18 min porte-à-porte depuis Le Lodge |$f$ IN content_fr) = 0
      AND position($f$| Genève-Eaux-Vives en 7 min de Léman Express, 22 min porte-à-porte depuis La Villa |$f$ IN content_fr) = 0
      AND position($f$Genève-Eaux-Vives en 24 min porte-à-porte depuis Le Loft$f$ IN content_fr) = 0)
    WHEN 'permis-g-frontalier-geneve' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'quartiers-annemasse-ou-vivre-selon-profil' THEN (position($f$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$f$ IN content_fr) = 0
      AND position($f$gare d'Annemasse à 14 min à pied · Genève-Eaux-Vives en 22 min porte-à-porte$f$ IN content_fr) = 0
      AND position($f$tram 17 à 8 min à pied, gare d'Annemasse à 18 min · Genève-Eaux-Vives en 24 min porte-à-porte$f$ IN content_fr) = 0
      AND position($f$gare d'Annemasse à 10 min à pied · Genève-Eaux-Vives en 18 min porte-à-porte$f$ IN content_fr) = 0
      AND position($f$[Le Lodge](/lelodge) de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$f$ IN content_fr) = 0
      AND position($f$gare d'Annemasse à 14 min à pied, Genève-Eaux-Vives en 22 min porte-à-porte$f$ IN content_fr) = 0)
    WHEN 'quitter-son-logement-guide-pratique' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'salaire-suisse-net-frontalier-2026' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'se-faire-reseau-geneve-arriver-seul' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'teletravail-frontalier-geneve-regles-2026' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'temps-trajet-annemasse-geneve-par-quartier' THEN (position($f$(gare à 14 min à pied de La Villa, à Ville-la-Grand)$f$ IN content_fr) = 0
      AND position($f$La gare d'Annemasse est à 18 minutes à pied du Loft$f$ IN content_fr) = 0
      AND position($f$est à Annemasse, à 10 minutes à pied de la gare.$f$ IN content_fr) = 0
      AND position($f$La Villa à Ville-la-Grand est à 14 minutes à pied de la gare d'Annemasse. Le Loft à Ambilly, à 18 minutes à pied de la gare et à 8 minutes du tram 17. Le Lodge à Annemasse, à 10 minutes à pied.$f$ IN content_fr) = 0
      AND position($f$La Villa (10 chambres) est à 14 min à pied de la gare.$f$ IN content_fr) = 0)
    WHEN 'transport-annemasse-geneve-leman-express' THEN (position($f$Depuis nos maisons : 10 min à pied du Lodge (Annemasse), 14 min de La Villa (Ville-la-Grand), 18 min du Loft (Ambilly)$f$ IN content_fr) = 0
      AND position($f$23 min de train · 38 min porte-à-porte depuis La Villa$f$ IN content_fr) = 0
      AND position($f$La gare d'Annemasse est à 14 min à pied de La Villa, à Ville-la-Grand.$f$ IN content_fr) = 0
      AND position($f$La gare d'Annemasse est à 18 min à pied du Loft, le tram 17 à 8 min.$f$ IN content_fr) = 0)
    WHEN 'trouver-colocation-geneve-frontalier' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'trouver-logement-avant-d-arriver-geneve' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'vie-quotidienne-frontalier-courses-sport-sorties' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'vivre-a-annemasse-quand-on-travaille-a-geneve' THEN (position($f$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$f$ IN content_fr) = 0
      AND position($f$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny, ouvert en 2026) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$f$ IN content_fr) = 0
      AND position($f$Notre maison Le Loft y est, à 8 minutes à pied du tram et à 18 minutes à pied de la gare.$f$ IN content_fr) = 0
      AND position($f$à 14 minutes à pied de la gare depuis notre maison La Villa.$f$ IN content_fr) = 0
      AND position($f$Le Lodge à Romagny pour le train (gare à 10 minutes à pied)$f$ IN content_fr) = 0)
  END AS fr_ok,
  CASE slug
    WHEN 'allocations-familiales-frontalier-geneve-2026' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'arnaques-logement-frontalier-geneve-eviter' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'assurance-sante-frontalier-lamal-cmu-budget' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'banque-telephone-internet-frontalier-bons-plans' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'budget-colocation-geneve-guide-complet' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'choc-culturel-franco-suisse-expatrie-geneve' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'coliving-colocation-ou-studio-geneve-comparatif' THEN (position($f$Annemasse station a 10 to 18-min walk away depending on the house$f$ IN content_en) = 0
      AND position($f$The three houses are a 10, 14 and 18-minute walk from Annemasse station$f$ IN content_en) = 0)
    WHEN 'colocation-annemasse-ville-la-grand-ambilly' THEN (position($f$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$f$ IN content_en) = 0
      AND position($f$In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 14-minute walk from Annemasse station — Geneva Eaux-Vives in 22 minutes door to door.$f$ IN content_en) = 0
      AND position($f$In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door.$f$ IN content_en) = 0)
    WHEN 'cout-de-la-vie-suisse-france-frontalier-2026' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'cout-transport-frontalier-geneve-2026' THEN (position($f$are a 10, 14 and 18-minute walk from Annemasse station$f$ IN content_en) = 0)
    WHEN 'declaration-impots-frontalier-2026' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'ecole-internationale-geneve-frontalier-ou-habiter' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'fiscalite-frontalier-geneve-impots-2026' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'grand-geneve-2026-nouveautes-frontaliers' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'guide-ressources-frontalier-geneve' THEN (position($f$on the French side (Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0
      AND position($f$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0
      AND position($f$23 min by train, 35 to 40 min door to door depending on the house$f$ IN content_en) = 0)
    WHEN 'living-in-france-working-in-geneva' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'lodge-annemasse-coliving-premium-portes-geneve' THEN (position($f$our house in Annemasse, a 10-minute walk from Annemasse station.$f$ IN content_en) = 0
      AND position($f$is a 10-minute walk away.$f$ IN content_en) = 0
      AND position($f$a 10-minute walk from Annemasse station, Geneva Eaux-Vives in 18 minutes door to door$f$ IN content_en) = 0)
    WHEN 'optimiser-espace-coliving-productivite-bien-etre' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'organisations-internationales-geneve-ou-habiter' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'ou-habiter-en-france-quand-on-travaille-a-geneve' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'ou-habiter-frontalier-suisse-villes-france-pas-cher' THEN (position($f$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$f$ IN content_en) = 0
      AND position($f$In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 14-minute walk from Annemasse station — Geneva Eaux-Vives in 22 minutes door to door.$f$ IN content_en) = 0
      AND position($f$In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door.$f$ IN content_en) = 0
      AND position($f$and Annemasse station is an 18-minute walk.$f$ IN content_en) = 0
      AND position($f$| Geneva Eaux-Vives in 7 min by Léman Express, 18 min door to door from Le Lodge |$f$ IN content_en) = 0
      AND position($f$| Geneva Eaux-Vives in 7 min by Léman Express, 22 min door to door from La Villa |$f$ IN content_en) = 0
      AND position($f$Geneva Eaux-Vives in 24 min door to door from Le Loft$f$ IN content_en) = 0)
    WHEN 'permis-g-frontalier-geneve' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'quartiers-annemasse-ou-vivre-selon-profil' THEN (position($f$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$f$ IN content_en) = 0
      AND position($f$Annemasse station 14 min on foot · Geneva Eaux-Vives in 22 min door-to-door$f$ IN content_en) = 0
      AND position($f$tram 17 stop 8 min on foot, Annemasse station 18 min · Geneva Eaux-Vives in 24 min door-to-door$f$ IN content_en) = 0
      AND position($f$Annemasse station 10 min on foot · Geneva Eaux-Vives in 18 min door-to-door$f$ IN content_en) = 0
      AND position($f$[Le Lodge](/en/lelodge) by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$f$ IN content_en) = 0
      AND position($f$Annemasse station is a 14-minute walk, Geneva Eaux-Vives 22 minutes door to door$f$ IN content_en) = 0)
    WHEN 'quitter-son-logement-guide-pratique' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'salaire-suisse-net-frontalier-2026' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'se-faire-reseau-geneve-arriver-seul' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'teletravail-frontalier-geneve-regles-2026' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'temps-trajet-annemasse-geneve-par-quartier' THEN (position($f$(station a 14-min walk from La Villa, in Ville-la-Grand)$f$ IN content_en) = 0
      AND position($f$Annemasse station is an 18-minute walk from Le Loft$f$ IN content_en) = 0
      AND position($f$is in Annemasse, a 10-minute walk from the station.$f$ IN content_en) = 0
      AND position($f$La Villa in Ville-la-Grand is a 14-minute walk from Annemasse station. Le Loft in Ambilly, an 18-minute walk from the station and 8 minutes from tram 17. Le Lodge in Annemasse, a 10-minute walk.$f$ IN content_en) = 0
      AND position($f$La Villa (10 rooms) is a 14-min walk from the station$f$ IN content_en) = 0)
    WHEN 'transport-annemasse-geneve-leman-express' THEN (position($f$From our houses: a 10-min walk from Le Lodge (Annemasse), 14 min from La Villa (Ville-la-Grand), 18 min from Le Loft (Ambilly)$f$ IN content_en) = 0
      AND position($f$23 min by train · 38 min door to door from La Villa$f$ IN content_en) = 0
      AND position($f$Annemasse station is a 14-min walk from La Villa, in Ville-la-Grand$f$ IN content_en) = 0
      AND position($f$Annemasse station is an 18-min walk from Le Loft, tram 17 an 8-min walk.$f$ IN content_en) = 0)
    WHEN 'trouver-colocation-geneve-frontalier' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'trouver-logement-avant-d-arriver-geneve' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'vie-quotidienne-frontalier-courses-sport-sorties' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'vivre-a-annemasse-quand-on-travaille-a-geneve' THEN (position($f$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$f$ IN content_en) = 0
      AND position($f$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district, opened in 2026) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$f$ IN content_en) = 0
      AND position($f$Our house Le Loft is there, an 8-minute walk from the tram and an 18-minute walk from the station.$f$ IN content_en) = 0
      AND position($f$a 14-minute walk from the station from our house La Villa.$f$ IN content_en) = 0
      AND position($f$Le Lodge in Romagny for the train (station a 10-minute walk away)$f$ IN content_en) = 0)
  END AS en_ok
FROM blog_posts
WHERE slug IN ('allocations-familiales-frontalier-geneve-2026', 'arnaques-logement-frontalier-geneve-eviter', 'assurance-sante-frontalier-lamal-cmu-budget', 'banque-telephone-internet-frontalier-bons-plans', 'budget-colocation-geneve-guide-complet', 'choc-culturel-franco-suisse-expatrie-geneve', 'coliving-colocation-ou-studio-geneve-comparatif', 'colocation-annemasse-ville-la-grand-ambilly', 'cout-de-la-vie-suisse-france-frontalier-2026', 'cout-transport-frontalier-geneve-2026', 'declaration-impots-frontalier-2026', 'ecole-internationale-geneve-frontalier-ou-habiter', 'fiscalite-frontalier-geneve-impots-2026', 'grand-geneve-2026-nouveautes-frontaliers', 'guide-ressources-frontalier-geneve', 'living-in-france-working-in-geneva', 'lodge-annemasse-coliving-premium-portes-geneve', 'optimiser-espace-coliving-productivite-bien-etre', 'organisations-internationales-geneve-ou-habiter', 'ou-habiter-en-france-quand-on-travaille-a-geneve', 'ou-habiter-frontalier-suisse-villes-france-pas-cher', 'permis-g-frontalier-geneve', 'quartiers-annemasse-ou-vivre-selon-profil', 'quitter-son-logement-guide-pratique', 'salaire-suisse-net-frontalier-2026', 'se-faire-reseau-geneve-arriver-seul', 'teletravail-frontalier-geneve-regles-2026', 'temps-trajet-annemasse-geneve-par-quartier', 'transport-annemasse-geneve-leman-express', 'trouver-colocation-geneve-frontalier', 'trouver-logement-avant-d-arriver-geneve', 'vie-quotidienne-frontalier-courses-sport-sorties', 'vivre-a-annemasse-quand-on-travaille-a-geneve')
ORDER BY slug;

-- ── Retour arrière (inverse exact, mêmes gardes miroir) : retirer les deux lignes /* et */ puis exécuter le bloc.
/*
BEGIN;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Le Lodge in Romagny for the train (station an 8-minute walk away)$r$, $f$Le Lodge in Romagny for the train (station a 10-minute walk away)$f$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($r$Le Lodge in Romagny for the train (station an 8-minute walk away)$r$ IN content_en) > 0
  AND position($f$Le Lodge in Romagny for the train (station a 10-minute walk away)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Le Lodge à Romagny pour le train (gare à 8 minutes à pied)$r$, $f$Le Lodge à Romagny pour le train (gare à 10 minutes à pied)$f$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($r$Le Lodge à Romagny pour le train (gare à 8 minutes à pied)$r$ IN content_fr) > 0
  AND position($f$Le Lodge à Romagny pour le train (gare à 10 minutes à pied)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$a 9-minute walk from the station from our house La Villa.$r$, $f$a 14-minute walk from the station from our house La Villa.$f$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($r$a 9-minute walk from the station from our house La Villa.$r$ IN content_en) > 0
  AND position($f$a 14-minute walk from the station from our house La Villa.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$à 9 minutes à pied de la gare depuis notre maison La Villa.$r$, $f$à 14 minutes à pied de la gare depuis notre maison La Villa.$f$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($r$à 9 minutes à pied de la gare depuis notre maison La Villa.$r$ IN content_fr) > 0
  AND position($f$à 14 minutes à pied de la gare depuis notre maison La Villa.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Our house Le Loft is there, an 8-minute walk from the tram and a 9-minute walk from the station.$r$, $f$Our house Le Loft is there, an 8-minute walk from the tram and an 18-minute walk from the station.$f$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($r$Our house Le Loft is there, an 8-minute walk from the tram and a 9-minute walk from the station.$r$ IN content_en) > 0
  AND position($f$Our house Le Loft is there, an 8-minute walk from the tram and an 18-minute walk from the station.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Notre maison Le Loft y est, à 8 minutes à pied du tram et à 9 minutes à pied de la gare.$r$, $f$Notre maison Le Loft y est, à 8 minutes à pied du tram et à 18 minutes à pied de la gare.$f$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($r$Notre maison Le Loft y est, à 8 minutes à pied du tram et à 9 minutes à pied de la gare.$r$ IN content_fr) > 0
  AND position($f$Notre maison Le Loft y est, à 8 minutes à pied du tram et à 18 minutes à pied de la gare.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Annemasse station is a 9-min walk from Le Loft, tram 17 an 8-min walk.$r$, $f$Annemasse station is an 18-min walk from Le Loft, tram 17 an 8-min walk.$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$Annemasse station is a 9-min walk from Le Loft, tram 17 an 8-min walk.$r$ IN content_en) > 0
  AND position($f$Annemasse station is an 18-min walk from Le Loft, tram 17 an 8-min walk.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$La gare d'Annemasse est à 9 min à pied du Loft, le tram 17 à 8 min.$r$, $f$La gare d'Annemasse est à 18 min à pied du Loft, le tram 17 à 8 min.$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$La gare d'Annemasse est à 9 min à pied du Loft, le tram 17 à 8 min.$r$ IN content_fr) > 0
  AND position($f$La gare d'Annemasse est à 18 min à pied du Loft, le tram 17 à 8 min.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Annemasse station is a 9-min walk from La Villa, in Ville-la-Grand$r$, $f$Annemasse station is a 14-min walk from La Villa, in Ville-la-Grand$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$Annemasse station is a 9-min walk from La Villa, in Ville-la-Grand$r$ IN content_en) > 0
  AND position($f$Annemasse station is a 14-min walk from La Villa, in Ville-la-Grand$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$La gare d'Annemasse est à 9 min à pied de La Villa, à Ville-la-Grand.$r$, $f$La gare d'Annemasse est à 14 min à pied de La Villa, à Ville-la-Grand.$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$La gare d'Annemasse est à 9 min à pied de La Villa, à Ville-la-Grand.$r$ IN content_fr) > 0
  AND position($f$La gare d'Annemasse est à 14 min à pied de La Villa, à Ville-la-Grand.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$23 min by train · 33 min door to door from La Villa$r$, $f$23 min by train · 38 min door to door from La Villa$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$23 min by train · 33 min door to door from La Villa$r$ IN content_en) > 0
  AND position($f$23 min by train · 38 min door to door from La Villa$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$23 min de train · 33 min porte-à-porte depuis La Villa$r$, $f$23 min de train · 38 min porte-à-porte depuis La Villa$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$23 min de train · 33 min porte-à-porte depuis La Villa$r$ IN content_fr) > 0
  AND position($f$23 min de train · 38 min porte-à-porte depuis La Villa$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$From our houses: an 8-min walk from Le Lodge (Annemasse), 9 min from La Villa (Ville-la-Grand), 9 min from Le Loft (Ambilly)$r$, $f$From our houses: a 10-min walk from Le Lodge (Annemasse), 14 min from La Villa (Ville-la-Grand), 18 min from Le Loft (Ambilly)$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$From our houses: an 8-min walk from Le Lodge (Annemasse), 9 min from La Villa (Ville-la-Grand), 9 min from Le Loft (Ambilly)$r$ IN content_en) > 0
  AND position($f$From our houses: a 10-min walk from Le Lodge (Annemasse), 14 min from La Villa (Ville-la-Grand), 18 min from Le Loft (Ambilly)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Depuis nos maisons : 8 min à pied du Lodge (Annemasse), 9 min de La Villa (Ville-la-Grand), 9 min du Loft (Ambilly)$r$, $f$Depuis nos maisons : 10 min à pied du Lodge (Annemasse), 14 min de La Villa (Ville-la-Grand), 18 min du Loft (Ambilly)$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$Depuis nos maisons : 8 min à pied du Lodge (Annemasse), 9 min de La Villa (Ville-la-Grand), 9 min du Loft (Ambilly)$r$ IN content_fr) > 0
  AND position($f$Depuis nos maisons : 10 min à pied du Lodge (Annemasse), 14 min de La Villa (Ville-la-Grand), 18 min du Loft (Ambilly)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$La Villa (10 rooms) is a 9-min walk from the station$r$, $f$La Villa (10 rooms) is a 14-min walk from the station$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$La Villa (10 rooms) is a 9-min walk from the station$r$ IN content_en) > 0
  AND position($f$La Villa (10 rooms) is a 14-min walk from the station$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$La Villa (10 chambres) est à 9 min à pied de la gare.$r$, $f$La Villa (10 chambres) est à 14 min à pied de la gare.$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$La Villa (10 chambres) est à 9 min à pied de la gare.$r$ IN content_fr) > 0
  AND position($f$La Villa (10 chambres) est à 14 min à pied de la gare.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$La Villa in Ville-la-Grand is a 9-minute walk from Annemasse station. Le Loft in Ambilly, a 9-minute walk from the station and 8 minutes from tram 17. Le Lodge in Annemasse, an 8-minute walk.$r$, $f$La Villa in Ville-la-Grand is a 14-minute walk from Annemasse station. Le Loft in Ambilly, an 18-minute walk from the station and 8 minutes from tram 17. Le Lodge in Annemasse, a 10-minute walk.$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$La Villa in Ville-la-Grand is a 9-minute walk from Annemasse station. Le Loft in Ambilly, a 9-minute walk from the station and 8 minutes from tram 17. Le Lodge in Annemasse, an 8-minute walk.$r$ IN content_en) > 0
  AND position($f$La Villa in Ville-la-Grand is a 14-minute walk from Annemasse station. Le Loft in Ambilly, an 18-minute walk from the station and 8 minutes from tram 17. Le Lodge in Annemasse, a 10-minute walk.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$La Villa à Ville-la-Grand est à 9 minutes à pied de la gare d'Annemasse. Le Loft à Ambilly, à 9 minutes à pied de la gare et à 8 minutes du tram 17. Le Lodge à Annemasse, à 8 minutes à pied.$r$, $f$La Villa à Ville-la-Grand est à 14 minutes à pied de la gare d'Annemasse. Le Loft à Ambilly, à 18 minutes à pied de la gare et à 8 minutes du tram 17. Le Lodge à Annemasse, à 10 minutes à pied.$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$La Villa à Ville-la-Grand est à 9 minutes à pied de la gare d'Annemasse. Le Loft à Ambilly, à 9 minutes à pied de la gare et à 8 minutes du tram 17. Le Lodge à Annemasse, à 8 minutes à pied.$r$ IN content_fr) > 0
  AND position($f$La Villa à Ville-la-Grand est à 14 minutes à pied de la gare d'Annemasse. Le Loft à Ambilly, à 18 minutes à pied de la gare et à 8 minutes du tram 17. Le Lodge à Annemasse, à 10 minutes à pied.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$is in Annemasse, an 8-minute walk from the station.$r$, $f$is in Annemasse, a 10-minute walk from the station.$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$is in Annemasse, an 8-minute walk from the station.$r$ IN content_en) > 0
  AND position($f$is in Annemasse, a 10-minute walk from the station.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$est à Annemasse, à 8 minutes à pied de la gare.$r$, $f$est à Annemasse, à 10 minutes à pied de la gare.$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$est à Annemasse, à 8 minutes à pied de la gare.$r$ IN content_fr) > 0
  AND position($f$est à Annemasse, à 10 minutes à pied de la gare.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Annemasse station is a 9-minute walk from Le Loft$r$, $f$Annemasse station is an 18-minute walk from Le Loft$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$Annemasse station is a 9-minute walk from Le Loft$r$ IN content_en) > 0
  AND position($f$Annemasse station is an 18-minute walk from Le Loft$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$La gare d'Annemasse est à 9 minutes à pied du Loft$r$, $f$La gare d'Annemasse est à 18 minutes à pied du Loft$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$La gare d'Annemasse est à 9 minutes à pied du Loft$r$ IN content_fr) > 0
  AND position($f$La gare d'Annemasse est à 18 minutes à pied du Loft$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$(station a 9-min walk from La Villa, in Ville-la-Grand)$r$, $f$(station a 14-min walk from La Villa, in Ville-la-Grand)$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$(station a 9-min walk from La Villa, in Ville-la-Grand)$r$ IN content_en) > 0
  AND position($f$(station a 14-min walk from La Villa, in Ville-la-Grand)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$(gare à 9 min à pied de La Villa, à Ville-la-Grand)$r$, $f$(gare à 14 min à pied de La Villa, à Ville-la-Grand)$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$(gare à 9 min à pied de La Villa, à Ville-la-Grand)$r$ IN content_fr) > 0
  AND position($f$(gare à 14 min à pied de La Villa, à Ville-la-Grand)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Annemasse station is a 9-minute walk, Geneva Eaux-Vives 17 minutes door to door$r$, $f$Annemasse station is a 14-minute walk, Geneva Eaux-Vives 22 minutes door to door$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$Annemasse station is a 9-minute walk, Geneva Eaux-Vives 17 minutes door to door$r$ IN content_en) > 0
  AND position($f$Annemasse station is a 14-minute walk, Geneva Eaux-Vives 22 minutes door to door$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$gare d'Annemasse à 9 min à pied, Genève-Eaux-Vives en 17 min porte-à-porte$r$, $f$gare d'Annemasse à 14 min à pied, Genève-Eaux-Vives en 22 min porte-à-porte$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$gare d'Annemasse à 9 min à pied, Genève-Eaux-Vives en 17 min porte-à-porte$r$ IN content_fr) > 0
  AND position($f$gare d'Annemasse à 14 min à pied, Genève-Eaux-Vives en 22 min porte-à-porte$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 17 min door to door from Le Loft$r$, $f$Geneva Eaux-Vives in 24 min door to door from Le Loft$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$Geneva Eaux-Vives in 17 min door to door from Le Loft$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 24 min door to door from Le Loft$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$| Geneva Eaux-Vives in 7 min by Léman Express, 17 min door to door from La Villa |$r$, $f$| Geneva Eaux-Vives in 7 min by Léman Express, 22 min door to door from La Villa |$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$| Geneva Eaux-Vives in 7 min by Léman Express, 17 min door to door from La Villa |$r$ IN content_en) > 0
  AND position($f$| Geneva Eaux-Vives in 7 min by Léman Express, 22 min door to door from La Villa |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$| Geneva Eaux-Vives in 7 min by Léman Express, 16 min door to door from Le Lodge |$r$, $f$| Geneva Eaux-Vives in 7 min by Léman Express, 18 min door to door from Le Lodge |$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$| Geneva Eaux-Vives in 7 min by Léman Express, 16 min door to door from Le Lodge |$r$ IN content_en) > 0
  AND position($f$| Geneva Eaux-Vives in 7 min by Léman Express, 18 min door to door from Le Lodge |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 17 min porte-à-porte depuis Le Loft$r$, $f$Genève-Eaux-Vives en 24 min porte-à-porte depuis Le Loft$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$Genève-Eaux-Vives en 17 min porte-à-porte depuis Le Loft$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 24 min porte-à-porte depuis Le Loft$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$| Genève-Eaux-Vives en 7 min de Léman Express, 17 min porte-à-porte depuis La Villa |$r$, $f$| Genève-Eaux-Vives en 7 min de Léman Express, 22 min porte-à-porte depuis La Villa |$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$| Genève-Eaux-Vives en 7 min de Léman Express, 17 min porte-à-porte depuis La Villa |$r$ IN content_fr) > 0
  AND position($f$| Genève-Eaux-Vives en 7 min de Léman Express, 22 min porte-à-porte depuis La Villa |$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$| Genève-Eaux-Vives en 7 min de Léman Express, 16 min porte-à-porte depuis Le Lodge |$r$, $f$| Genève-Eaux-Vives en 7 min de Léman Express, 18 min porte-à-porte depuis Le Lodge |$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$| Genève-Eaux-Vives en 7 min de Léman Express, 16 min porte-à-porte depuis Le Lodge |$r$ IN content_fr) > 0
  AND position($f$| Genève-Eaux-Vives en 7 min de Léman Express, 18 min porte-à-porte depuis Le Lodge |$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$and Annemasse station is a 9-minute walk.$r$, $f$and Annemasse station is an 18-minute walk.$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$and Annemasse station is a 9-minute walk.$r$ IN content_en) > 0
  AND position($f$and Annemasse station is an 18-minute walk.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$et la gare d'Annemasse est à 9 min à pied.$r$, $f$et la gare d'Annemasse est à 18 min à pied.$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$et la gare d'Annemasse est à 9 min à pied.$r$ IN content_fr) > 0
  AND position($f$et la gare d'Annemasse est à 18 min à pied.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$an 8-minute walk from Annemasse station, Geneva Eaux-Vives in 16 minutes door to door$r$, $f$a 10-minute walk from Annemasse station, Geneva Eaux-Vives in 18 minutes door to door$f$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($r$an 8-minute walk from Annemasse station, Geneva Eaux-Vives in 16 minutes door to door$r$ IN content_en) > 0
  AND position($f$a 10-minute walk from Annemasse station, Geneva Eaux-Vives in 18 minutes door to door$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$is an 8-minute walk away.$r$, $f$is a 10-minute walk away.$f$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($r$is an 8-minute walk away.$r$ IN content_en) > 0
  AND position($f$is a 10-minute walk away.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$our house in Annemasse, an 8-minute walk from Annemasse station.$r$, $f$our house in Annemasse, a 10-minute walk from Annemasse station.$f$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($r$our house in Annemasse, an 8-minute walk from Annemasse station.$r$ IN content_en) > 0
  AND position($f$our house in Annemasse, a 10-minute walk from Annemasse station.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$à 8 minutes à pied de la gare d'Annemasse, Genève-Eaux-Vives en 16 minutes porte-à-porte$r$, $f$à 10 minutes à pied de la gare d'Annemasse, Genève-Eaux-Vives en 18 minutes porte-à-porte$f$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($r$à 8 minutes à pied de la gare d'Annemasse, Genève-Eaux-Vives en 16 minutes porte-à-porte$r$ IN content_fr) > 0
  AND position($f$à 10 minutes à pied de la gare d'Annemasse, Genève-Eaux-Vives en 18 minutes porte-à-porte$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$La gare d'Annemasse — et son Léman Express — est à 8 minutes à pied.$r$, $f$La gare d'Annemasse — et son Léman Express — est à 10 minutes à pied.$f$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($r$La gare d'Annemasse — et son Léman Express — est à 8 minutes à pied.$r$ IN content_fr) > 0
  AND position($f$La gare d'Annemasse — et son Léman Express — est à 10 minutes à pied.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$notre maison d'Annemasse, à 8 min à pied de la gare d'Annemasse.$r$, $f$notre maison d'Annemasse, à 10 min à pied de la gare d'Annemasse.$f$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($r$notre maison d'Annemasse, à 8 min à pied de la gare d'Annemasse.$r$ IN content_fr) > 0
  AND position($f$notre maison d'Annemasse, à 10 min à pied de la gare d'Annemasse.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$are an 8, 9 and 9-minute walk from Annemasse station$r$, $f$are a 10, 14 and 18-minute walk from Annemasse station$f$),
    updated_at = now()
WHERE slug = 'cout-transport-frontalier-geneve-2026'
  AND position($r$are an 8, 9 and 9-minute walk from Annemasse station$r$ IN content_en) > 0
  AND position($f$are a 10, 14 and 18-minute walk from Annemasse station$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$sont à 8, 9 et 9 minutes à pied de la gare d'Annemasse$r$, $f$sont à 10, 14 et 18 minutes à pied de la gare d'Annemasse$f$),
    updated_at = now()
WHERE slug = 'cout-transport-frontalier-geneve-2026'
  AND position($r$sont à 8, 9 et 9 minutes à pied de la gare d'Annemasse$r$ IN content_fr) > 0
  AND position($f$sont à 10, 14 et 18 minutes à pied de la gare d'Annemasse$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$The three houses are an 8, 9 and 9-minute walk from Annemasse station$r$, $f$The three houses are a 10, 14 and 18-minute walk from Annemasse station$f$),
    updated_at = now()
WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif'
  AND position($r$The three houses are an 8, 9 and 9-minute walk from Annemasse station$r$ IN content_en) > 0
  AND position($f$The three houses are a 10, 14 and 18-minute walk from Annemasse station$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Les trois maisons sont à 8, 9 et 9 minutes à pied de la gare d'Annemasse$r$, $f$Les trois maisons sont à 10, 14 et 18 minutes à pied de la gare d'Annemasse$f$),
    updated_at = now()
WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif'
  AND position($r$Les trois maisons sont à 8, 9 et 9 minutes à pied de la gare d'Annemasse$r$ IN content_fr) > 0
  AND position($f$Les trois maisons sont à 10, 14 et 18 minutes à pied de la gare d'Annemasse$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Annemasse station an 8 to 9-min walk away depending on the house$r$, $f$Annemasse station a 10 to 18-min walk away depending on the house$f$),
    updated_at = now()
WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif'
  AND position($r$Annemasse station an 8 to 9-min walk away depending on the house$r$ IN content_en) > 0
  AND position($f$Annemasse station a 10 to 18-min walk away depending on the house$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$gare d'Annemasse à 8 à 9 min à pied selon la maison$r$, $f$gare d'Annemasse à 10 à 18 min à pied selon la maison$f$),
    updated_at = now()
WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif'
  AND position($r$gare d'Annemasse à 8 à 9 min à pied selon la maison$r$ IN content_fr) > 0
  AND position($f$gare d'Annemasse à 10 à 18 min à pied selon la maison$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[Le Lodge](/en/lelodge) by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door.$r$, $f$[Le Lodge](/en/lelodge) by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$[Le Lodge](/en/lelodge) by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door.$r$ IN content_en) > 0
  AND position($f$[Le Lodge](/en/lelodge) by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[Le Lodge](/lelodge) de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte.$r$, $f$[Le Lodge](/lelodge) de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$[Le Lodge](/lelodge) de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte.$r$ IN content_fr) > 0
  AND position($f$[Le Lodge](/lelodge) de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Annemasse station 8 min on foot · Geneva Eaux-Vives in 16 min door-to-door$r$, $f$Annemasse station 10 min on foot · Geneva Eaux-Vives in 18 min door-to-door$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$Annemasse station 8 min on foot · Geneva Eaux-Vives in 16 min door-to-door$r$ IN content_en) > 0
  AND position($f$Annemasse station 10 min on foot · Geneva Eaux-Vives in 18 min door-to-door$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$gare d'Annemasse à 8 min à pied · Genève-Eaux-Vives en 16 min porte-à-porte$r$, $f$gare d'Annemasse à 10 min à pied · Genève-Eaux-Vives en 18 min porte-à-porte$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$gare d'Annemasse à 8 min à pied · Genève-Eaux-Vives en 16 min porte-à-porte$r$ IN content_fr) > 0
  AND position($f$gare d'Annemasse à 10 min à pied · Genève-Eaux-Vives en 18 min porte-à-porte$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$tram 17 stop 8 min on foot, Annemasse station 9 min · Geneva Eaux-Vives in 17 min door-to-door$r$, $f$tram 17 stop 8 min on foot, Annemasse station 18 min · Geneva Eaux-Vives in 24 min door-to-door$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$tram 17 stop 8 min on foot, Annemasse station 9 min · Geneva Eaux-Vives in 17 min door-to-door$r$ IN content_en) > 0
  AND position($f$tram 17 stop 8 min on foot, Annemasse station 18 min · Geneva Eaux-Vives in 24 min door-to-door$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$tram 17 à 8 min à pied, gare d'Annemasse à 9 min · Genève-Eaux-Vives en 17 min porte-à-porte$r$, $f$tram 17 à 8 min à pied, gare d'Annemasse à 18 min · Genève-Eaux-Vives en 24 min porte-à-porte$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$tram 17 à 8 min à pied, gare d'Annemasse à 9 min · Genève-Eaux-Vives en 17 min porte-à-porte$r$ IN content_fr) > 0
  AND position($f$tram 17 à 8 min à pied, gare d'Annemasse à 18 min · Genève-Eaux-Vives en 24 min porte-à-porte$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Annemasse station 9 min on foot · Geneva Eaux-Vives in 17 min door-to-door$r$, $f$Annemasse station 14 min on foot · Geneva Eaux-Vives in 22 min door-to-door$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$Annemasse station 9 min on foot · Geneva Eaux-Vives in 17 min door-to-door$r$ IN content_en) > 0
  AND position($f$Annemasse station 14 min on foot · Geneva Eaux-Vives in 22 min door-to-door$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$gare d'Annemasse à 9 min à pied · Genève-Eaux-Vives en 17 min porte-à-porte$r$, $f$gare d'Annemasse à 14 min à pied · Genève-Eaux-Vives en 22 min porte-à-porte$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$gare d'Annemasse à 9 min à pied · Genève-Eaux-Vives en 17 min porte-à-porte$r$ IN content_fr) > 0
  AND position($f$gare d'Annemasse à 14 min à pied · Genève-Eaux-Vives en 22 min porte-à-porte$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district, opened in 2026) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door.$r$, $f$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district, opened in 2026) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$f$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($r$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district, opened in 2026) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door.$r$ IN content_en) > 0
  AND position($f$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district, opened in 2026) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny, ouvert en 2026) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte.$r$, $f$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny, ouvert en 2026) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$f$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($r$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny, ouvert en 2026) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte.$r$ IN content_fr) > 0
  AND position($f$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny, ouvert en 2026) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door.$r$, $f$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$f$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($r$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door.$r$ IN content_en) > 0
  AND position($f$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte.$r$, $f$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$f$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($r$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte.$r$ IN content_fr) > 0
  AND position($f$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door.$r$, $f$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door.$r$ IN content_en) > 0
  AND position($f$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte.$r$, $f$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte.$r$ IN content_fr) > 0
  AND position($f$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 17 minutes door to door.$r$, $f$In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door.$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 17 minutes door to door.$r$ IN content_en) > 0
  AND position($f$In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 17 min porte-à-porte.$r$, $f$À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 17 min porte-à-porte.$r$ IN content_fr) > 0
  AND position($f$À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 9-minute walk from Annemasse station — Geneva Eaux-Vives in 17 minutes door to door.$r$, $f$In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 14-minute walk from Annemasse station — Geneva Eaux-Vives in 22 minutes door to door.$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 9-minute walk from Annemasse station — Geneva Eaux-Vives in 17 minutes door to door.$r$ IN content_en) > 0
  AND position($f$In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 14-minute walk from Annemasse station — Geneva Eaux-Vives in 22 minutes door to door.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 9 min à pied de la gare d'Annemasse — Genève-Eaux-Vives en 17 min porte-à-porte.$r$, $f$À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 14 min à pied de la gare d'Annemasse — Genève-Eaux-Vives en 22 min porte-à-porte.$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 9 min à pied de la gare d'Annemasse — Genève-Eaux-Vives en 17 min porte-à-porte.$r$ IN content_fr) > 0
  AND position($f$À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 14 min à pied de la gare d'Annemasse — Genève-Eaux-Vives en 22 min porte-à-porte.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door.$r$, $f$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door.$r$ IN content_en) > 0
  AND position($f$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte.$r$, $f$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte.$r$ IN content_fr) > 0
  AND position($f$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 17 minutes door to door.$r$, $f$In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door.$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 17 minutes door to door.$r$ IN content_en) > 0
  AND position($f$In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 17 min porte-à-porte.$r$, $f$À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 17 min porte-à-porte.$r$ IN content_fr) > 0
  AND position($f$À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 9-minute walk from Annemasse station — Geneva Eaux-Vives in 17 minutes door to door.$r$, $f$In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 14-minute walk from Annemasse station — Geneva Eaux-Vives in 22 minutes door to door.$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 9-minute walk from Annemasse station — Geneva Eaux-Vives in 17 minutes door to door.$r$ IN content_en) > 0
  AND position($f$In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 14-minute walk from Annemasse station — Geneva Eaux-Vives in 22 minutes door to door.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 9 min à pied de la gare d'Annemasse — Genève-Eaux-Vives en 17 min porte-à-porte.$r$, $f$À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 14 min à pied de la gare d'Annemasse — Genève-Eaux-Vives en 22 min porte-à-porte.$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 9 min à pied de la gare d'Annemasse — Genève-Eaux-Vives en 17 min porte-à-porte.$r$ IN content_fr) > 0
  AND position($f$À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 14 min à pied de la gare d'Annemasse — Genève-Eaux-Vives en 22 min porte-à-porte.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door.$r$, $f$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door.$r$ IN content_en) > 0
  AND position($f$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte.$r$, $f$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte.$r$ IN content_fr) > 0
  AND position($f$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$23 min by train, 33 min door to door from each house$r$, $f$23 min by train, 35 to 40 min door to door depending on the house$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$23 min by train, 33 min door to door from each house$r$ IN content_en) > 0
  AND position($f$23 min by train, 35 to 40 min door to door depending on the house$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$23 min de train, 33 min porte-à-porte depuis chaque maison$r$, $f$23 min de train, 35 à 40 min porte-à-porte selon la maison$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$23 min de train, 33 min porte-à-porte depuis chaque maison$r$ IN content_fr) > 0
  AND position($f$23 min de train, 35 à 40 min porte-à-porte selon la maison$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$, $f$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$on the French side (Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$, $f$on the French side (Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$on the French side (Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$on the French side (Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$, $f$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$côté France (Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$, $f$côté France (Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$côté France (Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$côté France (Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'se-faire-reseau-geneve-arriver-seul'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'se-faire-reseau-geneve-arriver-seul'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'quitter-son-logement-guide-pratique'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'quitter-son-logement-guide-pratique'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'permis-g-frontalier-geneve'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'permis-g-frontalier-geneve'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'optimiser-espace-coliving-productivite-bien-etre'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'optimiser-espace-coliving-productivite-bien-etre'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'grand-geneve-2026-nouveautes-frontaliers'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'grand-geneve-2026-nouveautes-frontaliers'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'declaration-impots-frontalier-2026'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'declaration-impots-frontalier-2026'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'banque-telephone-internet-frontalier-bons-plans'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'banque-telephone-internet-frontalier-bons-plans'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'allocations-familiales-frontalier-geneve-2026'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'allocations-familiales-frontalier-geneve-2026'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

COMMIT;
*/
