-- ============================================================================
-- Le Lodge, borne basse (décisions de Jérôme du 12/11/2026) : formule D1 « 25 min jusqu'au centre » (30 avant), phrases écrites à la main, ligne Cornavin « 32 à 33 min porte-à-porte selon la maison », dans 27 articles publiés
-- Généré le 2026-11-12T21:46:51.251Z par scripts/build-slots-sql.mjs depuis scripts/trajets-lodge-borne-basse.edits.mjs
--   · source unique (stats.ts : TRANSIT, GENEVA_COMMUTE_FORMULA) de la branche fix/trajets-lodge-borne-basse ; textes « Avant » lus en base le 12/11/2026
--   · ancres vérifiées sur le contenu vivant de blog_posts (REST anon, lecture seule) le 2026-11-12T21:46:51.246Z : exactement 1 occurrence de chaque ancien texte, nouveau texte absent
-- À appliquer JUSTE AVANT la fusion de la branche fix/trajets-lodge-borne-basse : la garde check:facts de la branche interdit « 30 min jusqu'au centre » et « 33 min porte-à-porte depuis chaque maison » — si la fusion précède ce SQL, le prérendu du robot échoue et la production reste figée. Vérifier d'abord qu'aucun prérendu ne tourne (gh run list --workflow prerender.yml --limit 3), puis fusionner dans la minute. Séance du 12/11/2026 : ces 60 substitutions ont été appliquées sous forme groupée (5 UPDATE dans un seul bloc DO, md5 d'entrée et de sortie, tout ou rien) — scripts/trajets-lodge-borne-basse-2026-11-12.seance.sql.
-- Idempotent : chaque UPDATE est gardé par position(ancien) > 0 [AND position(nouveau) = 0 quand le nouveau texte n'est pas un fragment de l'ancien] — relancer le fichier est sans effet.
-- Fichier UTF-8 : tirets cadratins (U+2014), apostrophes droites, aucune espace insécable dans les textes — ne pas normaliser.
-- 60 modifications · 27 articles · état en base à la génération (updated_at · longueur fr / en) :
--   allocations-familiales-frontalier-geneve-2026 · 2026-11-12T14:42:28.437272+00:00 · 11464 / 9868
--   arnaques-logement-frontalier-geneve-eviter · 2026-11-12T14:42:28.437272+00:00 · 12657 / 11492
--   assurance-sante-frontalier-lamal-cmu-budget · 2026-11-12T14:42:28.437272+00:00 · 9587 / 9039
--   banque-telephone-internet-frontalier-bons-plans · 2026-11-12T14:42:28.437272+00:00 · 10154 / 9414
--   budget-colocation-geneve-guide-complet · 2026-11-12T14:42:28.437272+00:00 · 18723 / 14725
--   choc-culturel-franco-suisse-expatrie-geneve · 2026-11-12T14:42:28.437272+00:00 · 10973 / 10304
--   coliving-colocation-ou-studio-geneve-comparatif · 2026-11-12T14:45:31.771101+00:00 · 14297 / 13809
--   coliving-transfrontalier-geneve-annemasse-nouvelle-vie · 2026-10-12T08:41:56.358413+00:00 · 3892 / 3759
--   cout-de-la-vie-suisse-france-frontalier-2026 · 2026-11-12T14:42:28.437272+00:00 · 13254 / 11922
--   declaration-impots-frontalier-2026 · 2026-11-12T14:42:28.437272+00:00 · 5521 / 5053
--   ecole-internationale-geneve-frontalier-ou-habiter · 2026-11-12T14:42:28.437272+00:00 · 11822 / 10010
--   fiscalite-frontalier-geneve-impots-2026 · 2026-11-12T14:42:28.437272+00:00 · 10713 / 10055
--   grand-geneve-2026-nouveautes-frontaliers · 2026-11-12T14:42:28.437272+00:00 · 8673 / 7506
--   guide-ressources-frontalier-geneve · 2026-11-12T14:44:18.845333+00:00 · 40430 / 37261
--   living-in-france-working-in-geneva · 2026-11-12T14:42:28.437272+00:00 · 17553 / 15935
--   optimiser-espace-coliving-productivite-bien-etre · 2026-11-12T14:42:28.437272+00:00 · 3962 / 3580
--   organisations-internationales-geneve-ou-habiter · 2026-11-12T14:42:28.437272+00:00 · 7443 / 6821
--   ou-habiter-en-france-quand-on-travaille-a-geneve · 2026-11-12T14:42:28.437272+00:00 · 14927 / 14746
--   permis-g-frontalier-geneve · 2026-11-12T14:42:28.437272+00:00 · 6156 / 5798
--   quitter-son-logement-guide-pratique · 2026-11-12T14:44:18.845333+00:00 · 11516 / 10993
--   salaire-suisse-net-frontalier-2026 · 2026-11-12T14:44:18.845333+00:00 · 13925 / 11223
--   se-faire-reseau-geneve-arriver-seul · 2026-11-12T14:44:18.845333+00:00 · 10677 / 9636
--   teletravail-frontalier-geneve-regles-2026 · 2026-11-12T14:44:18.845333+00:00 · 11725 / 10833
--   trouver-colocation-geneve-frontalier · 2026-11-12T14:44:18.845333+00:00 · 5965 / 5580
--   trouver-logement-avant-d-arriver-geneve · 2026-11-12T14:44:18.845333+00:00 · 14603 / 14105
--   vie-quotidienne-frontalier-courses-sport-sorties · 2026-11-12T14:44:18.845333+00:00 · 9465 / 8719
--   vivre-a-annemasse-quand-on-travaille-a-geneve · 2026-11-12T14:46:34.264977+00:00 · 12791 / 12488
-- ============================================================================

BEGIN;

-- [1/60] allocations-familiales-frontalier-geneve-2026 (fr) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'allocations-familiales-frontalier-geneve-2026'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) = 0;

-- [2/60] allocations-familiales-frontalier-geneve-2026 (en) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'allocations-familiales-frontalier-geneve-2026'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) = 0;

-- [3/60] arnaques-logement-frontalier-geneve-eviter (fr) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) = 0;

-- [4/60] arnaques-logement-frontalier-geneve-eviter (en) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) = 0;

-- [5/60] assurance-sante-frontalier-lamal-cmu-budget (fr) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) = 0;

-- [6/60] assurance-sante-frontalier-lamal-cmu-budget (en) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) = 0;

-- [7/60] banque-telephone-internet-frontalier-bons-plans (fr) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'banque-telephone-internet-frontalier-bons-plans'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) = 0;

-- [8/60] banque-telephone-internet-frontalier-bons-plans (en) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'banque-telephone-internet-frontalier-bons-plans'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) = 0;

-- [9/60] budget-colocation-geneve-guide-complet (fr) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) = 0;

-- [10/60] budget-colocation-geneve-guide-complet (en) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) = 0;

-- [11/60] choc-culturel-franco-suisse-expatrie-geneve (fr) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) = 0;

-- [12/60] choc-culturel-franco-suisse-expatrie-geneve (en) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) = 0;

-- [13/60] cout-de-la-vie-suisse-france-frontalier-2026 (fr) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) = 0;

-- [14/60] cout-de-la-vie-suisse-france-frontalier-2026 (en) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) = 0;

-- [15/60] declaration-impots-frontalier-2026 (fr) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'declaration-impots-frontalier-2026'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) = 0;

-- [16/60] declaration-impots-frontalier-2026 (en) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'declaration-impots-frontalier-2026'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) = 0;

-- [17/60] ecole-internationale-geneve-frontalier-ou-habiter (fr) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) = 0;

-- [18/60] ecole-internationale-geneve-frontalier-ou-habiter (en) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) = 0;

-- [19/60] fiscalite-frontalier-geneve-impots-2026 (fr) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) = 0;

-- [20/60] fiscalite-frontalier-geneve-impots-2026 (en) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) = 0;

-- [21/60] grand-geneve-2026-nouveautes-frontaliers (fr) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'grand-geneve-2026-nouveautes-frontaliers'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) = 0;

-- [22/60] grand-geneve-2026-nouveautes-frontaliers (en) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'grand-geneve-2026-nouveautes-frontaliers'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) = 0;

-- [23/60] living-in-france-working-in-geneva (fr) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) = 0;

-- [24/60] living-in-france-working-in-geneva (en) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) = 0;

-- [25/60] optimiser-espace-coliving-productivite-bien-etre (fr) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'optimiser-espace-coliving-productivite-bien-etre'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) = 0;

-- [26/60] optimiser-espace-coliving-productivite-bien-etre (en) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'optimiser-espace-coliving-productivite-bien-etre'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) = 0;

-- [27/60] organisations-internationales-geneve-ou-habiter (fr) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) = 0;

-- [28/60] organisations-internationales-geneve-ou-habiter (en) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) = 0;

-- [29/60] ou-habiter-en-france-quand-on-travaille-a-geneve (fr) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) = 0;

-- [30/60] ou-habiter-en-france-quand-on-travaille-a-geneve (en) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) = 0;

-- [31/60] permis-g-frontalier-geneve (fr) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'permis-g-frontalier-geneve'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) = 0;

-- [32/60] permis-g-frontalier-geneve (en) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'permis-g-frontalier-geneve'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) = 0;

-- [33/60] quitter-son-logement-guide-pratique (fr) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'quitter-son-logement-guide-pratique'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) = 0;

-- [34/60] quitter-son-logement-guide-pratique (en) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'quitter-son-logement-guide-pratique'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) = 0;

-- [35/60] salaire-suisse-net-frontalier-2026 (fr) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) = 0;

-- [36/60] salaire-suisse-net-frontalier-2026 (en) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) = 0;

-- [37/60] se-faire-reseau-geneve-arriver-seul (fr) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'se-faire-reseau-geneve-arriver-seul'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) = 0;

-- [38/60] se-faire-reseau-geneve-arriver-seul (en) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'se-faire-reseau-geneve-arriver-seul'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) = 0;

-- [39/60] teletravail-frontalier-geneve-regles-2026 (fr) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) = 0;

-- [40/60] teletravail-frontalier-geneve-regles-2026 (en) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) = 0;

-- [41/60] trouver-colocation-geneve-frontalier (fr) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) = 0;

-- [42/60] trouver-colocation-geneve-frontalier (en) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) = 0;

-- [43/60] trouver-logement-avant-d-arriver-geneve (fr) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) = 0;

-- [44/60] trouver-logement-avant-d-arriver-geneve (en) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) = 0;

-- [45/60] vie-quotidienne-frontalier-courses-sport-sorties (fr) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties'
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) = 0;

-- [46/60] vie-quotidienne-frontalier-courses-sport-sorties (en) · formule D1 · pied d'article : jusqu'au centre
UPDATE blog_posts
SET content_en = replace(content_en, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties'
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) = 0;

-- [47/60] guide-ressources-frontalier-geneve (fr) · formule D1 · paragraphe « propriétaires, pas agence »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$côté France (Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$côté France (Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$côté France (Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$côté France (Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) = 0;

-- [48/60] guide-ressources-frontalier-geneve (fr) · formule D1 · phrase d'appel 👉
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) = 0;

-- [49/60] guide-ressources-frontalier-geneve (en) · formule D1 · paragraph « owners, not an agency »
UPDATE blog_posts
SET content_en = replace(content_en, $f$on the French side (Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$on the French side (Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$on the French side (Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$on the French side (Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) = 0;

-- [50/60] guide-ressources-frontalier-geneve (en) · formule D1 · call-to-action line 👉
UPDATE blog_posts
SET content_en = replace(content_en, $f$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) = 0;

-- [51/60] guide-ressources-frontalier-geneve (fr) · tableau · Cornavin porte-à-porte
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$23 min de train, 33 min porte-à-porte depuis chaque maison$f$, $r$23 min de train, 32 à 33 min porte-à-porte selon la maison$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$23 min de train, 33 min porte-à-porte depuis chaque maison$f$ IN content_fr) > 0
  AND position($r$23 min de train, 32 à 33 min porte-à-porte selon la maison$r$ IN content_fr) = 0;

-- [52/60] guide-ressources-frontalier-geneve (en) · tableau · Cornavin door to door
UPDATE blog_posts
SET content_en = replace(content_en, $f$23 min by train, 33 min door to door from each house$f$, $r$23 min by train, 32 to 33 min door to door depending on the house$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$23 min by train, 33 min door to door from each house$f$ IN content_en) > 0
  AND position($r$23 min by train, 32 to 33 min door to door depending on the house$r$ IN content_en) = 0;

-- [53/60] coliving-colocation-ou-studio-geneve-comparatif (fr) · phrase · trajet : jusqu'au centre
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$20 minutes jusqu'à Genève-Eaux-Vives et 30 minutes jusqu'au centre$f$, $r$20 minutes jusqu'à Genève-Eaux-Vives et 25 minutes jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif'
  AND position($f$20 minutes jusqu'à Genève-Eaux-Vives et 30 minutes jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$20 minutes jusqu'à Genève-Eaux-Vives et 25 minutes jusqu'au centre$r$ IN content_fr) = 0;

-- [54/60] coliving-colocation-ou-studio-geneve-comparatif (en) · phrase · commute: to the city centre
UPDATE blog_posts
SET content_en = replace(content_en, $f$20 minutes to Geneva Eaux-Vives and 30 minutes to the city centre$f$, $r$20 minutes to Geneva Eaux-Vives and 25 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif'
  AND position($f$20 minutes to Geneva Eaux-Vives and 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$20 minutes to Geneva Eaux-Vives and 25 minutes to the city centre$r$ IN content_en) = 0;

-- [55/60] vivre-a-annemasse-quand-on-travaille-a-geneve (fr) · phrase · transports : phrase du corps
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$moins que bien des trajets à l'intérieur de Genève, et 30 minutes jusqu'au centre$f$, $r$moins que bien des trajets à l'intérieur de Genève, et 25 minutes jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($f$moins que bien des trajets à l'intérieur de Genève, et 30 minutes jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$moins que bien des trajets à l'intérieur de Genève, et 25 minutes jusqu'au centre$r$ IN content_fr) = 0;

-- [56/60] vivre-a-annemasse-quand-on-travaille-a-geneve (fr) · phrase · FAQ : comment se rendre à Genève
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Porte-à-porte, compte 20 minutes jusqu'à Genève-Eaux-Vives et 30 minutes jusqu'au centre$f$, $r$Porte-à-porte, compte 20 minutes jusqu'à Genève-Eaux-Vives et 25 minutes jusqu'au centre$r$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($f$Porte-à-porte, compte 20 minutes jusqu'à Genève-Eaux-Vives et 30 minutes jusqu'au centre$f$ IN content_fr) > 0
  AND position($r$Porte-à-porte, compte 20 minutes jusqu'à Genève-Eaux-Vives et 25 minutes jusqu'au centre$r$ IN content_fr) = 0;

-- [57/60] vivre-a-annemasse-quand-on-travaille-a-geneve (en) · phrase · transport: body sentence
UPDATE blog_posts
SET content_en = replace(content_en, $f$less than many commutes inside Geneva, and 30 minutes to the city centre$f$, $r$less than many commutes inside Geneva, and 25 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($f$less than many commutes inside Geneva, and 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$less than many commutes inside Geneva, and 25 minutes to the city centre$r$ IN content_en) = 0;

-- [58/60] vivre-a-annemasse-quand-on-travaille-a-geneve (en) · phrase · FAQ: getting to Geneva
UPDATE blog_posts
SET content_en = replace(content_en, $f$Door to door, count 20 minutes to Geneva Eaux-Vives and 30 minutes to the city centre$f$, $r$Door to door, count 20 minutes to Geneva Eaux-Vives and 25 minutes to the city centre$r$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($f$Door to door, count 20 minutes to Geneva Eaux-Vives and 30 minutes to the city centre$f$ IN content_en) > 0
  AND position($r$Door to door, count 20 minutes to Geneva Eaux-Vives and 25 minutes to the city centre$r$ IN content_en) = 0;

-- [59/60] coliving-transfrontalier-geneve-annemasse-nouvelle-vie (fr) · phrase · centre (Rive) : fourchette des trois maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$et à 30 minutes du centre (Rive)$f$, $r$et entre 25 et 32 minutes du centre (Rive) selon la maison$r$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($f$et à 30 minutes du centre (Rive)$f$ IN content_fr) > 0
  AND position($r$et entre 25 et 32 minutes du centre (Rive) selon la maison$r$ IN content_fr) = 0;

-- [60/60] coliving-transfrontalier-geneve-annemasse-nouvelle-vie (en) · phrase · city centre (Rive): range across the three houses
UPDATE blog_posts
SET content_en = replace(content_en, $f$and 30 minutes from the city centre (Rive)$f$, $r$and between 25 and 32 minutes from the city centre (Rive) depending on the house$r$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($f$and 30 minutes from the city centre (Rive)$f$ IN content_en) > 0
  AND position($r$and between 25 and 32 minutes from the city centre (Rive) depending on the house$r$ IN content_en) = 0;

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
-- [51] guide-ressources-frontalier-geneve/fr · tableau : « 23 min de train, 33 min porte-à-porte depuis chaque maison » → « 23 min de train, 32 à 33 min porte-à-porte selon la maison »
-- [52] guide-ressources-frontalier-geneve/en · tableau : « 23 min by train, 33 min door to door from each house » → « 23 min by train, 32 to 33 min door to door depending on the house »
-- [53] coliving-colocation-ou-studio-geneve-comparatif/fr · phrase : « 20 minutes jusqu'à Genève-Eaux-Vives et 30 minutes jusqu'au centre » → « 20 minutes jusqu'à Genève-Eaux-Vives et 25 minutes jusqu'au centre »
-- [54] coliving-colocation-ou-studio-geneve-comparatif/en · phrase : « 20 minutes to Geneva Eaux-Vives and 30 minutes to the city centre » → « 20 minutes to Geneva Eaux-Vives and 25 minutes to the city centre »
-- [55] vivre-a-annemasse-quand-on-travaille-a-geneve/fr · phrase : « moins que bien des trajets à l'intérieur de Genève, et 30 minutes jusqu… » → « moins que bien des trajets à l'intérieur de Genève, et 25 minutes jusqu… »
-- [56] vivre-a-annemasse-quand-on-travaille-a-geneve/fr · phrase : « Porte-à-porte, compte 20 minutes jusqu'à Genève-Eaux-Vives et 30 minute… » → « Porte-à-porte, compte 20 minutes jusqu'à Genève-Eaux-Vives et 25 minute… »
-- [57] vivre-a-annemasse-quand-on-travaille-a-geneve/en · phrase : « less than many commutes inside Geneva, and 30 minutes to the city centre » → « less than many commutes inside Geneva, and 25 minutes to the city centre »
-- [58] vivre-a-annemasse-quand-on-travaille-a-geneve/en · phrase : « Door to door, count 20 minutes to Geneva Eaux-Vives and 30 minutes to t… » → « Door to door, count 20 minutes to Geneva Eaux-Vives and 25 minutes to t… »
-- [59] coliving-transfrontalier-geneve-annemasse-nouvelle-vie/fr · phrase : « et à 30 minutes du centre (Rive) » → « et entre 25 et 32 minutes du centre (Rive) selon la maison »
-- [60] coliving-transfrontalier-geneve-annemasse-nouvelle-vie/en · phrase : « and 30 minutes from the city centre (Rive) » → « and between 25 and 32 minutes from the city centre (Rive) depending on … »

COMMIT;

-- ── Vérification (lecture seule) : une ligne par article ; fr_ok / en_ok = true quand toutes les modifications de la langue sont en place, NULL = langue non touchée.
SELECT slug,
  CASE slug
    WHEN 'allocations-familiales-frontalier-geneve-2026' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'arnaques-logement-frontalier-geneve-eviter' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'assurance-sante-frontalier-lamal-cmu-budget' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'banque-telephone-internet-frontalier-bons-plans' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'budget-colocation-geneve-guide-complet' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'choc-culturel-franco-suisse-expatrie-geneve' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'coliving-colocation-ou-studio-geneve-comparatif' THEN (position($f$20 minutes jusqu'à Genève-Eaux-Vives et 30 minutes jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie' THEN (position($f$et à 30 minutes du centre (Rive)$f$ IN content_fr) = 0)
    WHEN 'cout-de-la-vie-suisse-france-frontalier-2026' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'declaration-impots-frontalier-2026' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'ecole-internationale-geneve-frontalier-ou-habiter' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'fiscalite-frontalier-geneve-impots-2026' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'grand-geneve-2026-nouveautes-frontaliers' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'guide-ressources-frontalier-geneve' THEN (position($f$côté France (Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0
      AND position($f$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0
      AND position($f$23 min de train, 33 min porte-à-porte depuis chaque maison$f$ IN content_fr) = 0)
    WHEN 'living-in-france-working-in-geneva' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'optimiser-espace-coliving-productivite-bien-etre' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'organisations-internationales-geneve-ou-habiter' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'ou-habiter-en-france-quand-on-travaille-a-geneve' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'permis-g-frontalier-geneve' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'quitter-son-logement-guide-pratique' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'salaire-suisse-net-frontalier-2026' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'se-faire-reseau-geneve-arriver-seul' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'teletravail-frontalier-geneve-regles-2026' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'trouver-colocation-geneve-frontalier' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'trouver-logement-avant-d-arriver-geneve' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'vie-quotidienne-frontalier-courses-sport-sorties' THEN (position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0)
    WHEN 'vivre-a-annemasse-quand-on-travaille-a-geneve' THEN (position($f$moins que bien des trajets à l'intérieur de Genève, et 30 minutes jusqu'au centre$f$ IN content_fr) = 0
      AND position($f$Porte-à-porte, compte 20 minutes jusqu'à Genève-Eaux-Vives et 30 minutes jusqu'au centre$f$ IN content_fr) = 0)
  END AS fr_ok,
  CASE slug
    WHEN 'allocations-familiales-frontalier-geneve-2026' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'arnaques-logement-frontalier-geneve-eviter' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'assurance-sante-frontalier-lamal-cmu-budget' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'banque-telephone-internet-frontalier-bons-plans' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'budget-colocation-geneve-guide-complet' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'choc-culturel-franco-suisse-expatrie-geneve' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'coliving-colocation-ou-studio-geneve-comparatif' THEN (position($f$20 minutes to Geneva Eaux-Vives and 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie' THEN (position($f$and 30 minutes from the city centre (Rive)$f$ IN content_en) = 0)
    WHEN 'cout-de-la-vie-suisse-france-frontalier-2026' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'declaration-impots-frontalier-2026' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'ecole-internationale-geneve-frontalier-ou-habiter' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'fiscalite-frontalier-geneve-impots-2026' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'grand-geneve-2026-nouveautes-frontaliers' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'guide-ressources-frontalier-geneve' THEN (position($f$on the French side (Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0
      AND position($f$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0
      AND position($f$23 min by train, 33 min door to door from each house$f$ IN content_en) = 0)
    WHEN 'living-in-france-working-in-geneva' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'optimiser-espace-coliving-productivite-bien-etre' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'organisations-internationales-geneve-ou-habiter' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'ou-habiter-en-france-quand-on-travaille-a-geneve' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'permis-g-frontalier-geneve' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'quitter-son-logement-guide-pratique' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'salaire-suisse-net-frontalier-2026' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'se-faire-reseau-geneve-arriver-seul' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'teletravail-frontalier-geneve-regles-2026' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'trouver-colocation-geneve-frontalier' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'trouver-logement-avant-d-arriver-geneve' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'vie-quotidienne-frontalier-courses-sport-sorties' THEN (position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0)
    WHEN 'vivre-a-annemasse-quand-on-travaille-a-geneve' THEN (position($f$less than many commutes inside Geneva, and 30 minutes to the city centre$f$ IN content_en) = 0
      AND position($f$Door to door, count 20 minutes to Geneva Eaux-Vives and 30 minutes to the city centre$f$ IN content_en) = 0)
  END AS en_ok
FROM blog_posts
WHERE slug IN ('allocations-familiales-frontalier-geneve-2026', 'arnaques-logement-frontalier-geneve-eviter', 'assurance-sante-frontalier-lamal-cmu-budget', 'banque-telephone-internet-frontalier-bons-plans', 'budget-colocation-geneve-guide-complet', 'choc-culturel-franco-suisse-expatrie-geneve', 'coliving-colocation-ou-studio-geneve-comparatif', 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie', 'cout-de-la-vie-suisse-france-frontalier-2026', 'declaration-impots-frontalier-2026', 'ecole-internationale-geneve-frontalier-ou-habiter', 'fiscalite-frontalier-geneve-impots-2026', 'grand-geneve-2026-nouveautes-frontaliers', 'guide-ressources-frontalier-geneve', 'living-in-france-working-in-geneva', 'optimiser-espace-coliving-productivite-bien-etre', 'organisations-internationales-geneve-ou-habiter', 'ou-habiter-en-france-quand-on-travaille-a-geneve', 'permis-g-frontalier-geneve', 'quitter-son-logement-guide-pratique', 'salaire-suisse-net-frontalier-2026', 'se-faire-reseau-geneve-arriver-seul', 'teletravail-frontalier-geneve-regles-2026', 'trouver-colocation-geneve-frontalier', 'trouver-logement-avant-d-arriver-geneve', 'vie-quotidienne-frontalier-courses-sport-sorties', 'vivre-a-annemasse-quand-on-travaille-a-geneve')
ORDER BY slug;

-- ── Retour arrière (inverse exact, mêmes gardes miroir) : retirer les deux lignes /* et */ puis exécuter le bloc.
/*
BEGIN;

UPDATE blog_posts
SET content_en = replace(content_en, $r$and between 25 and 32 minutes from the city centre (Rive) depending on the house$r$, $f$and 30 minutes from the city centre (Rive)$f$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($r$and between 25 and 32 minutes from the city centre (Rive) depending on the house$r$ IN content_en) > 0
  AND position($f$and 30 minutes from the city centre (Rive)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$et entre 25 et 32 minutes du centre (Rive) selon la maison$r$, $f$et à 30 minutes du centre (Rive)$f$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($r$et entre 25 et 32 minutes du centre (Rive) selon la maison$r$ IN content_fr) > 0
  AND position($f$et à 30 minutes du centre (Rive)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Door to door, count 20 minutes to Geneva Eaux-Vives and 25 minutes to the city centre$r$, $f$Door to door, count 20 minutes to Geneva Eaux-Vives and 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($r$Door to door, count 20 minutes to Geneva Eaux-Vives and 25 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Door to door, count 20 minutes to Geneva Eaux-Vives and 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$less than many commutes inside Geneva, and 25 minutes to the city centre$r$, $f$less than many commutes inside Geneva, and 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($r$less than many commutes inside Geneva, and 25 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$less than many commutes inside Geneva, and 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Porte-à-porte, compte 20 minutes jusqu'à Genève-Eaux-Vives et 25 minutes jusqu'au centre$r$, $f$Porte-à-porte, compte 20 minutes jusqu'à Genève-Eaux-Vives et 30 minutes jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($r$Porte-à-porte, compte 20 minutes jusqu'à Genève-Eaux-Vives et 25 minutes jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Porte-à-porte, compte 20 minutes jusqu'à Genève-Eaux-Vives et 30 minutes jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$moins que bien des trajets à l'intérieur de Genève, et 25 minutes jusqu'au centre$r$, $f$moins que bien des trajets à l'intérieur de Genève, et 30 minutes jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($r$moins que bien des trajets à l'intérieur de Genève, et 25 minutes jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$moins que bien des trajets à l'intérieur de Genève, et 30 minutes jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$20 minutes to Geneva Eaux-Vives and 25 minutes to the city centre$r$, $f$20 minutes to Geneva Eaux-Vives and 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif'
  AND position($r$20 minutes to Geneva Eaux-Vives and 25 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$20 minutes to Geneva Eaux-Vives and 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$20 minutes jusqu'à Genève-Eaux-Vives et 25 minutes jusqu'au centre$r$, $f$20 minutes jusqu'à Genève-Eaux-Vives et 30 minutes jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif'
  AND position($r$20 minutes jusqu'à Genève-Eaux-Vives et 25 minutes jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$20 minutes jusqu'à Genève-Eaux-Vives et 30 minutes jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$23 min by train, 32 to 33 min door to door depending on the house$r$, $f$23 min by train, 33 min door to door from each house$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$23 min by train, 32 to 33 min door to door depending on the house$r$ IN content_en) > 0
  AND position($f$23 min by train, 33 min door to door from each house$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$23 min de train, 32 à 33 min porte-à-porte selon la maison$r$, $f$23 min de train, 33 min porte-à-porte depuis chaque maison$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$23 min de train, 32 à 33 min porte-à-porte selon la maison$r$ IN content_fr) > 0
  AND position($f$23 min de train, 33 min porte-à-porte depuis chaque maison$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$, $f$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$on the French side (Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$, $f$on the French side (Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$on the French side (Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$on the French side (Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$, $f$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$côté France (Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$, $f$côté France (Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$côté France (Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$côté France (Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'se-faire-reseau-geneve-arriver-seul'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'se-faire-reseau-geneve-arriver-seul'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'quitter-son-logement-guide-pratique'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'quitter-son-logement-guide-pratique'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'permis-g-frontalier-geneve'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'permis-g-frontalier-geneve'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'optimiser-espace-coliving-productivite-bien-etre'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'optimiser-espace-coliving-productivite-bien-etre'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'grand-geneve-2026-nouveautes-frontaliers'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'grand-geneve-2026-nouveautes-frontaliers'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'declaration-impots-frontalier-2026'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'declaration-impots-frontalier-2026'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'banque-telephone-internet-frontalier-bons-plans'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'banque-telephone-internet-frontalier-bons-plans'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$, $f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$),
    updated_at = now()
WHERE slug = 'allocations-familiales-frontalier-geneve-2026'
  AND position($r$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 25 minutes to the city centre$r$ IN content_en) > 0
  AND position($f$Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$, $f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$),
    updated_at = now()
WHERE slug = 'allocations-familiales-frontalier-geneve-2026'
  AND position($r$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 25 min jusqu'au centre$r$ IN content_fr) > 0
  AND position($f$Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre$f$ IN content_fr) = 0;

COMMIT;
*/
