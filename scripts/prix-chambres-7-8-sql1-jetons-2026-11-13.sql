-- ============================================================================
-- Prix des chambres 7 et 8 de La Villa (décision de Jérôme du 12/11/2026) — SQL 1 : chaque « dès 1 370 CHF » du texte des articles devient le jeton {{PRIX_DES}} (pieds communs de 30 articles et mentions isolées)
-- Généré le 2026-11-13T07:35:37.147Z par scripts/build-slots-sql.mjs depuis scripts/prix-chambres-7-8-jetons.edits.mjs
--   · source unique de la branche feat/prix-chambres-7-8 (src/data/stats.ts : CONTRACT_EUR, HOUSES_FROM ; src/data/answerSlots.ts : priceRangeText, priceRangeCell ; src/lib/contentTokens.ts) ; textes « Avant » lus en base le 13/11/2026
--   · ancres vérifiées sur le contenu vivant de blog_posts (REST anon, lecture seule) le 2026-11-13T07:35:37.139Z : exactement 1 occurrence de chaque ancien texte, nouveau texte absent
-- Peut être appliqué AVANT la mise en ligne du code : le site connaît déjà {{PRIX_DES}} et le rend à 1 370 CHF (aucun changement visible en français ; en anglais, quelques « 1,370 CHF » deviennent « CHF 1,370 »). Après la mise en ligne, le même jeton rend 1 290 CHF.
-- Idempotent : chaque UPDATE est gardé par position(ancien) > 0 [AND position(nouveau) = 0 quand le nouveau texte n'est pas un fragment de l'ancien] — relancer le fichier est sans effet.
-- Fichier UTF-8 : il contient des espaces insécables (U+00A0, « 1 370 ») et des tirets cadratins — ne pas le faire transiter par un éditeur qui normalise les espaces. La forme à exécuter en séance (un seul bloc, littéraux ASCII) est le fichier .seance.sql du même nom.
-- 100 modifications · 36 articles · état en base à la génération (updated_at · longueur fr / en) :
--   allocations-familiales-frontalier-geneve-2026 · 2026-11-12T21:48:49.13221+00:00 · 11464 / 9868
--   arnaques-logement-frontalier-geneve-eviter · 2026-11-12T21:48:49.13221+00:00 · 12657 / 11492
--   assurance-sante-frontalier-lamal-cmu-budget · 2026-11-12T21:48:49.13221+00:00 · 9587 / 9039
--   banque-telephone-internet-frontalier-bons-plans · 2026-11-12T21:48:49.13221+00:00 · 10154 / 9414
--   budget-colocation-geneve-guide-complet · 2026-11-12T21:48:49.13221+00:00 · 18723 / 14725
--   choc-culturel-franco-suisse-expatrie-geneve · 2026-11-12T21:48:49.13221+00:00 · 10973 / 10304
--   coliving-annemasse-geneve-frontaliers-avantages · 2026-10-13T15:31:18.575275+00:00 · 12602 / 11746
--   coliving-communaute-reels-amis-geneve-annemasse · 2026-10-10T08:36:26.258805+00:00 · 11012 / 9629
--   coliving-frais-dossier-geneve-annemasse · 2026-11-02T12:44:57.349739+00:00 · 8227 / 7315
--   coliving-geneve-frontaliers-guide-complet · 2026-10-10T07:59:57.333901+00:00 · 9581 / 8624
--   coliving-transfrontalier-geneve-annemasse-nouvelle-vie · 2026-11-12T21:48:49.13221+00:00 · 3918 / 3797
--   colocation-annemasse-ville-la-grand-ambilly · 2026-11-12T14:44:18.845333+00:00 · 8740 / 7809
--   cout-de-la-vie-suisse-france-frontalier-2026 · 2026-11-12T21:48:49.13221+00:00 · 13254 / 11922
--   cout-transport-frontalier-geneve-2026 · 2026-11-12T14:45:31.771101+00:00 · 9116 / 8488
--   declaration-impots-frontalier-2026 · 2026-11-12T21:48:49.13221+00:00 · 5521 / 5053
--   dossier-location-frontalier-suisse-france · 2026-10-30T17:15:30.671729+00:00 · 9008 / 8358
--   ecole-internationale-geneve-frontalier-ou-habiter · 2026-11-12T21:48:49.13221+00:00 · 11822 / 10010
--   espaces-verts-coliving-lodge-annemasse · 2026-10-10T08:05:59.012724+00:00 · 3541 / 3256
--   fiscalite-frontalier-geneve-impots-2026 · 2026-11-12T21:48:49.13221+00:00 · 10713 / 10055
--   grand-geneve-2026-nouveautes-frontaliers · 2026-11-12T21:48:49.13221+00:00 · 8673 / 7506
--   guide-ressources-frontalier-geneve · 2026-11-12T21:48:49.13221+00:00 · 40430 / 37274
--   living-in-france-working-in-geneva · 2026-11-12T21:48:49.13221+00:00 · 17553 / 15935
--   optimiser-espace-coliving-productivite-bien-etre · 2026-11-12T21:48:49.13221+00:00 · 3962 / 3580
--   organisations-internationales-geneve-ou-habiter · 2026-11-12T21:48:49.13221+00:00 · 7443 / 6821
--   ou-habiter-en-france-quand-on-travaille-a-geneve · 2026-11-12T21:48:49.13221+00:00 · 14927 / 14746
--   permis-g-frontalier-geneve · 2026-11-12T21:48:49.13221+00:00 · 6156 / 5798
--   quartiers-annemasse-ou-vivre-selon-profil · 2026-11-12T14:46:34.264977+00:00 · 10132 / 9030
--   quitter-son-logement-guide-pratique · 2026-11-12T21:48:49.13221+00:00 · 11516 / 10993
--   salaire-suisse-net-frontalier-2026 · 2026-11-12T21:48:49.13221+00:00 · 13925 / 11223
--   se-faire-reseau-geneve-arriver-seul · 2026-11-12T21:48:49.13221+00:00 · 10677 / 9636
--   teletravail-frontalier-geneve-regles-2026 · 2026-11-12T21:48:49.13221+00:00 · 11725 / 10833
--   temps-trajet-annemasse-geneve-par-quartier · 2026-11-12T14:46:34.264977+00:00 · 9226 / 8613
--   transport-annemasse-geneve-leman-express · 2026-11-12T14:46:34.264977+00:00 · 8449 / 7406
--   trouver-colocation-geneve-frontalier · 2026-11-12T21:48:49.13221+00:00 · 5965 / 5580
--   trouver-logement-avant-d-arriver-geneve · 2026-11-12T21:48:49.13221+00:00 · 14603 / 14105
--   vie-quotidienne-frontalier-courses-sport-sorties · 2026-11-12T21:48:49.13221+00:00 · 9465 / 8719
-- ============================================================================

BEGIN;

-- [1/100] allocations-familiales-frontalier-geneve-2026 (fr) · jeton · pied commun : « à partir de 1 370 CHF/mois » → jeton du « dès » des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coûte à partir de **1 370 CHF/mois**$f$, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$),
    updated_at = now()
WHERE slug = 'allocations-familiales-frontalier-geneve-2026'
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) > 0
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) = 0;

-- [2/100] allocations-familiales-frontalier-geneve-2026 (en) · jeton · common footer: "from CHF 1,370/month" → entry-price token
UPDATE blog_posts
SET content_en = replace(content_en, $f$costs from **CHF 1,370/month**$f$, $r$costs from **{{PRIX_DES}}/month**$r$),
    updated_at = now()
WHERE slug = 'allocations-familiales-frontalier-geneve-2026'
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) > 0
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) = 0;

-- [3/100] arnaques-logement-frontalier-geneve-eviter (fr) · jeton · pied commun : « à partir de 1 370 CHF/mois » → jeton du « dès » des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coûte à partir de **1 370 CHF/mois**$f$, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) > 0
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) = 0;

-- [4/100] arnaques-logement-frontalier-geneve-eviter (en) · jeton · common footer: "from CHF 1,370/month" → entry-price token
UPDATE blog_posts
SET content_en = replace(content_en, $f$costs from **CHF 1,370/month**$f$, $r$costs from **{{PRIX_DES}}/month**$r$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) > 0
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) = 0;

-- [5/100] assurance-sante-frontalier-lamal-cmu-budget (fr) · jeton · pied commun : « à partir de 1 370 CHF/mois » → jeton du « dès » des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coûte à partir de **1 370 CHF/mois**$f$, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) > 0
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) = 0;

-- [6/100] assurance-sante-frontalier-lamal-cmu-budget (en) · jeton · common footer: "from CHF 1,370/month" → entry-price token
UPDATE blog_posts
SET content_en = replace(content_en, $f$costs from **CHF 1,370/month**$f$, $r$costs from **{{PRIX_DES}}/month**$r$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) > 0
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) = 0;

-- [7/100] banque-telephone-internet-frontalier-bons-plans (fr) · jeton · pied commun : « à partir de 1 370 CHF/mois » → jeton du « dès » des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coûte à partir de **1 370 CHF/mois**$f$, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$),
    updated_at = now()
WHERE slug = 'banque-telephone-internet-frontalier-bons-plans'
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) > 0
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) = 0;

-- [8/100] banque-telephone-internet-frontalier-bons-plans (en) · jeton · common footer: "from CHF 1,370/month" → entry-price token
UPDATE blog_posts
SET content_en = replace(content_en, $f$costs from **CHF 1,370/month**$f$, $r$costs from **{{PRIX_DES}}/month**$r$),
    updated_at = now()
WHERE slug = 'banque-telephone-internet-frontalier-bons-plans'
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) > 0
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) = 0;

-- [9/100] budget-colocation-geneve-guide-complet (fr) · jeton · pied commun : « à partir de 1 370 CHF/mois » → jeton du « dès » des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coûte à partir de **1 370 CHF/mois**$f$, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) > 0
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) = 0;

-- [10/100] budget-colocation-geneve-guide-complet (en) · jeton · common footer: "from CHF 1,370/month" → entry-price token
UPDATE blog_posts
SET content_en = replace(content_en, $f$costs from **CHF 1,370/month**$f$, $r$costs from **{{PRIX_DES}}/month**$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) > 0
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) = 0;

-- [11/100] choc-culturel-franco-suisse-expatrie-geneve (fr) · jeton · pied commun : « à partir de 1 370 CHF/mois » → jeton du « dès » des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coûte à partir de **1 370 CHF/mois**$f$, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$),
    updated_at = now()
WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve'
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) > 0
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) = 0;

-- [12/100] choc-culturel-franco-suisse-expatrie-geneve (en) · jeton · common footer: "from CHF 1,370/month" → entry-price token
UPDATE blog_posts
SET content_en = replace(content_en, $f$costs from **CHF 1,370/month**$f$, $r$costs from **{{PRIX_DES}}/month**$r$),
    updated_at = now()
WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve'
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) > 0
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) = 0;

-- [13/100] coliving-frais-dossier-geneve-annemasse (fr) · jeton · pied commun : « à partir de 1 370 CHF/mois » → jeton du « dès » des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coûte à partir de **1 370 CHF/mois**$f$, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$),
    updated_at = now()
WHERE slug = 'coliving-frais-dossier-geneve-annemasse'
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) > 0
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) = 0;

-- [14/100] coliving-frais-dossier-geneve-annemasse (en) · jeton · common footer: "from CHF 1,370/month" → entry-price token
UPDATE blog_posts
SET content_en = replace(content_en, $f$costs from **CHF 1,370/month**$f$, $r$costs from **{{PRIX_DES}}/month**$r$),
    updated_at = now()
WHERE slug = 'coliving-frais-dossier-geneve-annemasse'
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) > 0
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) = 0;

-- [15/100] coliving-transfrontalier-geneve-annemasse-nouvelle-vie (fr) · jeton · pied commun : « à partir de 1 370 CHF/mois » → jeton du « dès » des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coûte à partir de **1 370 CHF/mois**$f$, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) > 0
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) = 0;

-- [16/100] coliving-transfrontalier-geneve-annemasse-nouvelle-vie (en) · jeton · common footer: "from CHF 1,370/month" → entry-price token
UPDATE blog_posts
SET content_en = replace(content_en, $f$costs from **CHF 1,370/month**$f$, $r$costs from **{{PRIX_DES}}/month**$r$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) > 0
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) = 0;

-- [17/100] cout-de-la-vie-suisse-france-frontalier-2026 (fr) · jeton · pied commun : « à partir de 1 370 CHF/mois » → jeton du « dès » des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coûte à partir de **1 370 CHF/mois**$f$, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) > 0
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) = 0;

-- [18/100] cout-de-la-vie-suisse-france-frontalier-2026 (en) · jeton · common footer: "from CHF 1,370/month" → entry-price token
UPDATE blog_posts
SET content_en = replace(content_en, $f$costs from **CHF 1,370/month**$f$, $r$costs from **{{PRIX_DES}}/month**$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) > 0
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) = 0;

-- [19/100] cout-transport-frontalier-geneve-2026 (fr) · jeton · pied commun : « à partir de 1 370 CHF/mois » → jeton du « dès » des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coûte à partir de **1 370 CHF/mois**$f$, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$),
    updated_at = now()
WHERE slug = 'cout-transport-frontalier-geneve-2026'
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) > 0
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) = 0;

-- [20/100] cout-transport-frontalier-geneve-2026 (en) · jeton · common footer: "from CHF 1,370/month" → entry-price token
UPDATE blog_posts
SET content_en = replace(content_en, $f$costs from **CHF 1,370/month**$f$, $r$costs from **{{PRIX_DES}}/month**$r$),
    updated_at = now()
WHERE slug = 'cout-transport-frontalier-geneve-2026'
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) > 0
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) = 0;

-- [21/100] declaration-impots-frontalier-2026 (fr) · jeton · pied commun : « à partir de 1 370 CHF/mois » → jeton du « dès » des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coûte à partir de **1 370 CHF/mois**$f$, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$),
    updated_at = now()
WHERE slug = 'declaration-impots-frontalier-2026'
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) > 0
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) = 0;

-- [22/100] declaration-impots-frontalier-2026 (en) · jeton · common footer: "from CHF 1,370/month" → entry-price token
UPDATE blog_posts
SET content_en = replace(content_en, $f$costs from **CHF 1,370/month**$f$, $r$costs from **{{PRIX_DES}}/month**$r$),
    updated_at = now()
WHERE slug = 'declaration-impots-frontalier-2026'
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) > 0
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) = 0;

-- [23/100] ecole-internationale-geneve-frontalier-ou-habiter (fr) · jeton · pied commun : « à partir de 1 370 CHF/mois » → jeton du « dès » des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coûte à partir de **1 370 CHF/mois**$f$, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$),
    updated_at = now()
WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) > 0
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) = 0;

-- [24/100] ecole-internationale-geneve-frontalier-ou-habiter (en) · jeton · common footer: "from CHF 1,370/month" → entry-price token
UPDATE blog_posts
SET content_en = replace(content_en, $f$costs from **CHF 1,370/month**$f$, $r$costs from **{{PRIX_DES}}/month**$r$),
    updated_at = now()
WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) > 0
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) = 0;

-- [25/100] espaces-verts-coliving-lodge-annemasse (fr) · jeton · pied commun : « à partir de 1 370 CHF/mois » → jeton du « dès » des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coûte à partir de **1 370 CHF/mois**$f$, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$),
    updated_at = now()
WHERE slug = 'espaces-verts-coliving-lodge-annemasse'
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) > 0
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) = 0;

-- [26/100] espaces-verts-coliving-lodge-annemasse (en) · jeton · common footer: "from CHF 1,370/month" → entry-price token
UPDATE blog_posts
SET content_en = replace(content_en, $f$costs from **CHF 1,370/month**$f$, $r$costs from **{{PRIX_DES}}/month**$r$),
    updated_at = now()
WHERE slug = 'espaces-verts-coliving-lodge-annemasse'
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) > 0
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) = 0;

-- [27/100] fiscalite-frontalier-geneve-impots-2026 (fr) · jeton · pied commun : « à partir de 1 370 CHF/mois » → jeton du « dès » des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coûte à partir de **1 370 CHF/mois**$f$, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) > 0
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) = 0;

-- [28/100] fiscalite-frontalier-geneve-impots-2026 (en) · jeton · common footer: "from CHF 1,370/month" → entry-price token
UPDATE blog_posts
SET content_en = replace(content_en, $f$costs from **CHF 1,370/month**$f$, $r$costs from **{{PRIX_DES}}/month**$r$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) > 0
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) = 0;

-- [29/100] grand-geneve-2026-nouveautes-frontaliers (fr) · jeton · pied commun : « à partir de 1 370 CHF/mois » → jeton du « dès » des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coûte à partir de **1 370 CHF/mois**$f$, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$),
    updated_at = now()
WHERE slug = 'grand-geneve-2026-nouveautes-frontaliers'
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) > 0
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) = 0;

-- [30/100] grand-geneve-2026-nouveautes-frontaliers (en) · jeton · common footer: "from CHF 1,370/month" → entry-price token
UPDATE blog_posts
SET content_en = replace(content_en, $f$costs from **CHF 1,370/month**$f$, $r$costs from **{{PRIX_DES}}/month**$r$),
    updated_at = now()
WHERE slug = 'grand-geneve-2026-nouveautes-frontaliers'
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) > 0
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) = 0;

-- [31/100] guide-ressources-frontalier-geneve (fr) · jeton · pied commun : « à partir de 1 370 CHF/mois » → jeton du « dès » des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coûte à partir de **1 370 CHF/mois**$f$, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) > 0
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) = 0;

-- [32/100] guide-ressources-frontalier-geneve (en) · jeton · common footer: "from CHF 1,370/month" → entry-price token
UPDATE blog_posts
SET content_en = replace(content_en, $f$costs from **CHF 1,370/month**$f$, $r$costs from **{{PRIX_DES}}/month**$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) > 0
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) = 0;

-- [33/100] living-in-france-working-in-geneva (fr) · jeton · pied commun : « à partir de 1 370 CHF/mois » → jeton du « dès » des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coûte à partir de **1 370 CHF/mois**$f$, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) > 0
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) = 0;

-- [34/100] living-in-france-working-in-geneva (en) · jeton · common footer: "from CHF 1,370/month" → entry-price token
UPDATE blog_posts
SET content_en = replace(content_en, $f$costs from **CHF 1,370/month**$f$, $r$costs from **{{PRIX_DES}}/month**$r$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) > 0
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) = 0;

-- [35/100] optimiser-espace-coliving-productivite-bien-etre (fr) · jeton · pied commun : « à partir de 1 370 CHF/mois » → jeton du « dès » des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coûte à partir de **1 370 CHF/mois**$f$, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$),
    updated_at = now()
WHERE slug = 'optimiser-espace-coliving-productivite-bien-etre'
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) > 0
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) = 0;

-- [36/100] optimiser-espace-coliving-productivite-bien-etre (en) · jeton · common footer: "from CHF 1,370/month" → entry-price token
UPDATE blog_posts
SET content_en = replace(content_en, $f$costs from **CHF 1,370/month**$f$, $r$costs from **{{PRIX_DES}}/month**$r$),
    updated_at = now()
WHERE slug = 'optimiser-espace-coliving-productivite-bien-etre'
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) > 0
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) = 0;

-- [37/100] organisations-internationales-geneve-ou-habiter (fr) · jeton · pied commun : « à partir de 1 370 CHF/mois » → jeton du « dès » des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coûte à partir de **1 370 CHF/mois**$f$, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) > 0
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) = 0;

-- [38/100] organisations-internationales-geneve-ou-habiter (en) · jeton · common footer: "from CHF 1,370/month" → entry-price token
UPDATE blog_posts
SET content_en = replace(content_en, $f$costs from **CHF 1,370/month**$f$, $r$costs from **{{PRIX_DES}}/month**$r$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) > 0
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) = 0;

-- [39/100] ou-habiter-en-france-quand-on-travaille-a-geneve (fr) · jeton · pied commun : « à partir de 1 370 CHF/mois » → jeton du « dès » des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coûte à partir de **1 370 CHF/mois**$f$, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) > 0
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) = 0;

-- [40/100] ou-habiter-en-france-quand-on-travaille-a-geneve (en) · jeton · common footer: "from CHF 1,370/month" → entry-price token
UPDATE blog_posts
SET content_en = replace(content_en, $f$costs from **CHF 1,370/month**$f$, $r$costs from **{{PRIX_DES}}/month**$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) > 0
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) = 0;

-- [41/100] permis-g-frontalier-geneve (fr) · jeton · pied commun : « à partir de 1 370 CHF/mois » → jeton du « dès » des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coûte à partir de **1 370 CHF/mois**$f$, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$),
    updated_at = now()
WHERE slug = 'permis-g-frontalier-geneve'
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) > 0
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) = 0;

-- [42/100] permis-g-frontalier-geneve (en) · jeton · common footer: "from CHF 1,370/month" → entry-price token
UPDATE blog_posts
SET content_en = replace(content_en, $f$costs from **CHF 1,370/month**$f$, $r$costs from **{{PRIX_DES}}/month**$r$),
    updated_at = now()
WHERE slug = 'permis-g-frontalier-geneve'
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) > 0
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) = 0;

-- [43/100] quartiers-annemasse-ou-vivre-selon-profil (fr) · jeton · pied commun : « à partir de 1 370 CHF/mois » → jeton du « dès » des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coûte à partir de **1 370 CHF/mois**$f$, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) > 0
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) = 0;

-- [44/100] quartiers-annemasse-ou-vivre-selon-profil (en) · jeton · common footer: "from CHF 1,370/month" → entry-price token
UPDATE blog_posts
SET content_en = replace(content_en, $f$costs from **CHF 1,370/month**$f$, $r$costs from **{{PRIX_DES}}/month**$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) > 0
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) = 0;

-- [45/100] quitter-son-logement-guide-pratique (fr) · jeton · pied commun : « à partir de 1 370 CHF/mois » → jeton du « dès » des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coûte à partir de **1 370 CHF/mois**$f$, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$),
    updated_at = now()
WHERE slug = 'quitter-son-logement-guide-pratique'
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) > 0
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) = 0;

-- [46/100] quitter-son-logement-guide-pratique (en) · jeton · common footer: "from CHF 1,370/month" → entry-price token
UPDATE blog_posts
SET content_en = replace(content_en, $f$costs from **CHF 1,370/month**$f$, $r$costs from **{{PRIX_DES}}/month**$r$),
    updated_at = now()
WHERE slug = 'quitter-son-logement-guide-pratique'
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) > 0
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) = 0;

-- [47/100] salaire-suisse-net-frontalier-2026 (fr) · jeton · pied commun : « à partir de 1 370 CHF/mois » → jeton du « dès » des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coûte à partir de **1 370 CHF/mois**$f$, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) > 0
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) = 0;

-- [48/100] salaire-suisse-net-frontalier-2026 (en) · jeton · common footer: "from CHF 1,370/month" → entry-price token
UPDATE blog_posts
SET content_en = replace(content_en, $f$costs from **CHF 1,370/month**$f$, $r$costs from **{{PRIX_DES}}/month**$r$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) > 0
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) = 0;

-- [49/100] se-faire-reseau-geneve-arriver-seul (fr) · jeton · pied commun : « à partir de 1 370 CHF/mois » → jeton du « dès » des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coûte à partir de **1 370 CHF/mois**$f$, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$),
    updated_at = now()
WHERE slug = 'se-faire-reseau-geneve-arriver-seul'
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) > 0
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) = 0;

-- [50/100] se-faire-reseau-geneve-arriver-seul (en) · jeton · common footer: "from CHF 1,370/month" → entry-price token
UPDATE blog_posts
SET content_en = replace(content_en, $f$costs from **CHF 1,370/month**$f$, $r$costs from **{{PRIX_DES}}/month**$r$),
    updated_at = now()
WHERE slug = 'se-faire-reseau-geneve-arriver-seul'
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) > 0
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) = 0;

-- [51/100] teletravail-frontalier-geneve-regles-2026 (fr) · jeton · pied commun : « à partir de 1 370 CHF/mois » → jeton du « dès » des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coûte à partir de **1 370 CHF/mois**$f$, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) > 0
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) = 0;

-- [52/100] teletravail-frontalier-geneve-regles-2026 (en) · jeton · common footer: "from CHF 1,370/month" → entry-price token
UPDATE blog_posts
SET content_en = replace(content_en, $f$costs from **CHF 1,370/month**$f$, $r$costs from **{{PRIX_DES}}/month**$r$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) > 0
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) = 0;

-- [53/100] transport-annemasse-geneve-leman-express (fr) · jeton · pied commun : « à partir de 1 370 CHF/mois » → jeton du « dès » des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coûte à partir de **1 370 CHF/mois**$f$, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) > 0
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) = 0;

-- [54/100] transport-annemasse-geneve-leman-express (en) · jeton · common footer: "from CHF 1,370/month" → entry-price token
UPDATE blog_posts
SET content_en = replace(content_en, $f$costs from **CHF 1,370/month**$f$, $r$costs from **{{PRIX_DES}}/month**$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) > 0
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) = 0;

-- [55/100] trouver-colocation-geneve-frontalier (fr) · jeton · pied commun : « à partir de 1 370 CHF/mois » → jeton du « dès » des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coûte à partir de **1 370 CHF/mois**$f$, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) > 0
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) = 0;

-- [56/100] trouver-colocation-geneve-frontalier (en) · jeton · common footer: "from CHF 1,370/month" → entry-price token
UPDATE blog_posts
SET content_en = replace(content_en, $f$costs from **CHF 1,370/month**$f$, $r$costs from **{{PRIX_DES}}/month**$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) > 0
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) = 0;

-- [57/100] trouver-logement-avant-d-arriver-geneve (fr) · jeton · pied commun : « à partir de 1 370 CHF/mois » → jeton du « dès » des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coûte à partir de **1 370 CHF/mois**$f$, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) > 0
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) = 0;

-- [58/100] trouver-logement-avant-d-arriver-geneve (en) · jeton · common footer: "from CHF 1,370/month" → entry-price token
UPDATE blog_posts
SET content_en = replace(content_en, $f$costs from **CHF 1,370/month**$f$, $r$costs from **{{PRIX_DES}}/month**$r$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) > 0
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) = 0;

-- [59/100] vie-quotidienne-frontalier-courses-sport-sorties (fr) · jeton · pied commun : « à partir de 1 370 CHF/mois » → jeton du « dès » des maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$coûte à partir de **1 370 CHF/mois**$f$, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$),
    updated_at = now()
WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties'
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) > 0
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) = 0;

-- [60/100] vie-quotidienne-frontalier-courses-sport-sorties (en) · jeton · common footer: "from CHF 1,370/month" → entry-price token
UPDATE blog_posts
SET content_en = replace(content_en, $f$costs from **CHF 1,370/month**$f$, $r$costs from **{{PRIX_DES}}/month**$r$),
    updated_at = now()
WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties'
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) > 0
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) = 0;

-- [61/100] assurance-sante-frontalier-lamal-cmu-budget (fr) · jeton · « Le coliving, dès 1 370 CHF, est serré »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Le coliving, dès 1 370 CHF, est serré$f$, $r$Le coliving, dès {{PRIX_DES}}, est serré$r$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($f$Le coliving, dès 1 370 CHF, est serré$f$ IN content_fr) > 0
  AND position($r$Le coliving, dès {{PRIX_DES}}, est serré$r$ IN content_fr) = 0;

-- [62/100] assurance-sante-frontalier-lamal-cmu-budget (en) · jeton · "Coliving, from 1,370 CHF, is tight" (graphie : « 1,370 CHF » → « CHF 1,370 », celle du site)
UPDATE blog_posts
SET content_en = replace(content_en, $f$Coliving, from 1,370 CHF, is tight$f$, $r$Coliving, from {{PRIX_DES}}, is tight$r$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($f$Coliving, from 1,370 CHF, is tight$f$ IN content_en) > 0
  AND position($r$Coliving, from {{PRIX_DES}}, is tight$r$ IN content_en) = 0;

-- [63/100] assurance-sante-frontalier-lamal-cmu-budget (fr) · jeton · « Le coliving, dès 1 370 CHF, est très confortable »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Le coliving, dès 1 370 CHF, est très confortable$f$, $r$Le coliving, dès {{PRIX_DES}}, est très confortable$r$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($f$Le coliving, dès 1 370 CHF, est très confortable$f$ IN content_fr) > 0
  AND position($r$Le coliving, dès {{PRIX_DES}}, est très confortable$r$ IN content_fr) = 0;

-- [64/100] assurance-sante-frontalier-lamal-cmu-budget (en) · jeton · "Coliving, from 1,370 CHF, is very comfortable" (graphie : « 1,370 CHF » → « CHF 1,370 », celle du site)
UPDATE blog_posts
SET content_en = replace(content_en, $f$Coliving, from 1,370 CHF, is very comfortable$f$, $r$Coliving, from {{PRIX_DES}}, is very comfortable$r$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($f$Coliving, from 1,370 CHF, is very comfortable$f$ IN content_en) > 0
  AND position($r$Coliving, from {{PRIX_DES}}, is very comfortable$r$ IN content_en) = 0;

-- [65/100] coliving-annemasse-geneve-frontaliers-avantages (fr) · jeton · « tout inclus dès **1 370 CHF/mois** dans 3 maisons »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$tout inclus dès **1 370 CHF/mois** dans 3 maisons$f$, $r$tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons$r$),
    updated_at = now()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages'
  AND position($f$tout inclus dès **1 370 CHF/mois** dans 3 maisons$f$ IN content_fr) > 0
  AND position($r$tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons$r$ IN content_fr) = 0;

-- [66/100] coliving-annemasse-geneve-frontaliers-avantages (en) · jeton · "rooms from **CHF 1,370/month** across 3 houses"
UPDATE blog_posts
SET content_en = replace(content_en, $f$rooms from **CHF 1,370/month** across 3 houses$f$, $r$rooms from **{{PRIX_DES}}/month** across 3 houses$r$),
    updated_at = now()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages'
  AND position($f$rooms from **CHF 1,370/month** across 3 houses$f$ IN content_en) > 0
  AND position($r$rooms from **{{PRIX_DES}}/month** across 3 houses$r$ IN content_en) = 0;

-- [67/100] coliving-communaute-reels-amis-geneve-annemasse (fr) · jeton · « **Tout inclus dès 1 370 CHF par mois** »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$**Tout inclus dès 1 370 CHF par mois**$f$, $r$**Tout inclus dès {{PRIX_DES}} par mois**$r$),
    updated_at = now()
WHERE slug = 'coliving-communaute-reels-amis-geneve-annemasse'
  AND position($f$**Tout inclus dès 1 370 CHF par mois**$f$ IN content_fr) > 0
  AND position($r$**Tout inclus dès {{PRIX_DES}} par mois**$r$ IN content_fr) = 0;

-- [68/100] coliving-communaute-reels-amis-geneve-annemasse (en) · jeton · "**All inclusive from CHF 1,370 per month**"
UPDATE blog_posts
SET content_en = replace(content_en, $f$**All inclusive from CHF 1,370 per month**$f$, $r$**All inclusive from {{PRIX_DES}} per month**$r$),
    updated_at = now()
WHERE slug = 'coliving-communaute-reels-amis-geneve-annemasse'
  AND position($f$**All inclusive from CHF 1,370 per month**$f$ IN content_en) > 0
  AND position($r$**All inclusive from {{PRIX_DES}} per month**$r$ IN content_en) = 0;

-- [69/100] coliving-geneve-frontaliers-guide-complet (fr) · jeton · « tout inclus dès **1 370 CHF/mois**, sans frais de dossier. »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$tout inclus dès **1 370 CHF/mois**, sans frais de dossier.$f$, $r$tout inclus dès **{{PRIX_DES}}/mois**, sans frais de dossier.$r$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($f$tout inclus dès **1 370 CHF/mois**, sans frais de dossier.$f$ IN content_fr) > 0
  AND position($r$tout inclus dès **{{PRIX_DES}}/mois**, sans frais de dossier.$r$ IN content_fr) = 0;

-- [70/100] coliving-geneve-frontaliers-guide-complet (en) · jeton · "all-inclusive from **CHF 1,370/month**, no application fee."
UPDATE blog_posts
SET content_en = replace(content_en, $f$all-inclusive from **CHF 1,370/month**, no application fee.$f$, $r$all-inclusive from **{{PRIX_DES}}/month**, no application fee.$r$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($f$all-inclusive from **CHF 1,370/month**, no application fee.$f$ IN content_en) > 0
  AND position($r$all-inclusive from **{{PRIX_DES}}/month**, no application fee.$r$ IN content_en) = 0;

-- [71/100] coliving-transfrontalier-geneve-annemasse-nouvelle-vie (fr) · jeton · « c'est dès 1 370 CHF par mois, tout compris »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$c'est dès 1 370 CHF par mois, tout compris$f$, $r$c'est dès {{PRIX_DES}} par mois, tout compris$r$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($f$c'est dès 1 370 CHF par mois, tout compris$f$ IN content_fr) > 0
  AND position($r$c'est dès {{PRIX_DES}} par mois, tout compris$r$ IN content_fr) = 0;

-- [72/100] coliving-transfrontalier-geneve-annemasse-nouvelle-vie (en) · jeton · "it's from CHF 1,370 per month, all-inclusive"
UPDATE blog_posts
SET content_en = replace(content_en, $f$it's from CHF 1,370 per month, all-inclusive$f$, $r$it's from {{PRIX_DES}} per month, all-inclusive$r$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($f$it's from CHF 1,370 per month, all-inclusive$f$ IN content_en) > 0
  AND position($r$it's from {{PRIX_DES}} per month, all-inclusive$r$ IN content_en) = 0;

-- [73/100] coliving-transfrontalier-geneve-annemasse-nouvelle-vie (fr) · jeton · « - **Budget** : dès 1 370 CHF tout compris »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$- **Budget** : dès 1 370 CHF tout compris$f$, $r$- **Budget** : dès {{PRIX_DES}} tout compris$r$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($f$- **Budget** : dès 1 370 CHF tout compris$f$ IN content_fr) > 0
  AND position($r$- **Budget** : dès {{PRIX_DES}} tout compris$r$ IN content_fr) = 0;

-- [74/100] coliving-transfrontalier-geneve-annemasse-nouvelle-vie (en) · jeton · "- **Budget**: from CHF 1,370 all-inclusive"
UPDATE blog_posts
SET content_en = replace(content_en, $f$- **Budget**: from CHF 1,370 all-inclusive$f$, $r$- **Budget**: from {{PRIX_DES}} all-inclusive$r$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($f$- **Budget**: from CHF 1,370 all-inclusive$f$ IN content_en) > 0
  AND position($r$- **Budget**: from {{PRIX_DES}} all-inclusive$r$ IN content_en) = 0;

-- [75/100] colocation-annemasse-ville-la-grand-ambilly (fr) · jeton · « - Prix : dès 1 370 CHF/mois tout compris »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$- Prix : dès 1 370 CHF/mois tout compris$f$, $r$- Prix : dès {{PRIX_DES}}/mois tout compris$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$- Prix : dès 1 370 CHF/mois tout compris$f$ IN content_fr) > 0
  AND position($r$- Prix : dès {{PRIX_DES}}/mois tout compris$r$ IN content_fr) = 0;

-- [76/100] colocation-annemasse-ville-la-grand-ambilly (en) · jeton · "- Price: from CHF 1,370/month all-inclusive"
UPDATE blog_posts
SET content_en = replace(content_en, $f$- Price: from CHF 1,370/month all-inclusive$f$, $r$- Price: from {{PRIX_DES}}/month all-inclusive$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$- Price: from CHF 1,370/month all-inclusive$f$ IN content_en) > 0
  AND position($r$- Price: from {{PRIX_DES}}/month all-inclusive$r$ IN content_en) = 0;

-- [77/100] colocation-annemasse-ville-la-grand-ambilly (fr) · jeton · « tout inclus dès **1 370 CHF/mois** dans 3 maisons »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$tout inclus dès **1 370 CHF/mois** dans 3 maisons$f$, $r$tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$tout inclus dès **1 370 CHF/mois** dans 3 maisons$f$ IN content_fr) > 0
  AND position($r$tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons$r$ IN content_fr) = 0;

-- [78/100] colocation-annemasse-ville-la-grand-ambilly (en) · jeton · "rooms from **CHF 1,370/month** across 3 houses"
UPDATE blog_posts
SET content_en = replace(content_en, $f$rooms from **CHF 1,370/month** across 3 houses$f$, $r$rooms from **{{PRIX_DES}}/month** across 3 houses$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$rooms from **CHF 1,370/month** across 3 houses$f$ IN content_en) > 0
  AND position($r$rooms from **{{PRIX_DES}}/month** across 3 houses$r$ IN content_en) = 0;

-- [79/100] dossier-location-frontalier-suisse-france (fr) · jeton · « tout inclus dès **1 370 CHF/mois**, sans frais de dossier. »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$tout inclus dès **1 370 CHF/mois**, sans frais de dossier.$f$, $r$tout inclus dès **{{PRIX_DES}}/mois**, sans frais de dossier.$r$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($f$tout inclus dès **1 370 CHF/mois**, sans frais de dossier.$f$ IN content_fr) > 0
  AND position($r$tout inclus dès **{{PRIX_DES}}/mois**, sans frais de dossier.$r$ IN content_fr) = 0;

-- [80/100] dossier-location-frontalier-suisse-france (en) · jeton · "rooms from **CHF 1,370/month**, no application fee."
UPDATE blog_posts
SET content_en = replace(content_en, $f$rooms from **CHF 1,370/month**, no application fee.$f$, $r$rooms from **{{PRIX_DES}}/month**, no application fee.$r$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($f$rooms from **CHF 1,370/month**, no application fee.$f$ IN content_en) > 0
  AND position($r$rooms from **{{PRIX_DES}}/month**, no application fee.$r$ IN content_en) = 0;

-- [81/100] grand-geneve-2026-nouveautes-frontaliers (fr) · jeton · « **Dès 1 370 CHF par mois, tout inclus** »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$**Dès 1 370 CHF par mois, tout inclus**$f$, $r$**Dès {{PRIX_DES}} par mois, tout inclus**$r$),
    updated_at = now()
WHERE slug = 'grand-geneve-2026-nouveautes-frontaliers'
  AND position($f$**Dès 1 370 CHF par mois, tout inclus**$f$ IN content_fr) > 0
  AND position($r$**Dès {{PRIX_DES}} par mois, tout inclus**$r$ IN content_fr) = 0;

-- [82/100] grand-geneve-2026-nouveautes-frontaliers (en) · jeton · "**From CHF 1,370 per month, all-inclusive**"
UPDATE blog_posts
SET content_en = replace(content_en, $f$**From CHF 1,370 per month, all-inclusive**$f$, $r$**From {{PRIX_DES}} per month, all-inclusive**$r$),
    updated_at = now()
WHERE slug = 'grand-geneve-2026-nouveautes-frontaliers'
  AND position($f$**From CHF 1,370 per month, all-inclusive**$f$ IN content_en) > 0
  AND position($r$**From {{PRIX_DES}} per month, all-inclusive**$r$ IN content_en) = 0;

-- [83/100] guide-ressources-frontalier-geneve (fr) · jeton · « À partir de 1 370 CHF/mois. Le prix affiché »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$À partir de 1 370 CHF/mois. Le prix affiché$f$, $r$À partir de {{PRIX_DES}}/mois. Le prix affiché$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$À partir de 1 370 CHF/mois. Le prix affiché$f$ IN content_fr) > 0
  AND position($r$À partir de {{PRIX_DES}}/mois. Le prix affiché$r$ IN content_fr) = 0;

-- [84/100] guide-ressources-frontalier-geneve (en) · jeton · "From 1,370 CHF/month. The advertised price" (graphie : « 1,370 CHF » → « CHF 1,370 », celle du site)
UPDATE blog_posts
SET content_en = replace(content_en, $f$From 1,370 CHF/month. The advertised price$f$, $r$From {{PRIX_DES}}/month. The advertised price$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$From 1,370 CHF/month. The advertised price$f$ IN content_en) > 0
  AND position($r$From {{PRIX_DES}}/month. The advertised price$r$ IN content_en) = 0;

-- [85/100] living-in-france-working-in-geneva (fr) · jeton · « avec des chambres dès 1 370 CHF par mois tout inclus »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$avec des chambres dès 1 370 CHF par mois tout inclus$f$, $r$avec des chambres dès {{PRIX_DES}} par mois tout inclus$r$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($f$avec des chambres dès 1 370 CHF par mois tout inclus$f$ IN content_fr) > 0
  AND position($r$avec des chambres dès {{PRIX_DES}} par mois tout inclus$r$ IN content_fr) = 0;

-- [86/100] living-in-france-working-in-geneva (en) · jeton · "with rooms from CHF 1,370 a month all inclusive"
UPDATE blog_posts
SET content_en = replace(content_en, $f$with rooms from CHF 1,370 a month all inclusive$f$, $r$with rooms from {{PRIX_DES}} a month all inclusive$r$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($f$with rooms from CHF 1,370 a month all inclusive$f$ IN content_en) > 0
  AND position($r$with rooms from {{PRIX_DES}} a month all inclusive$r$ IN content_en) = 0;

-- [87/100] quartiers-annemasse-ou-vivre-selon-profil (fr) · jeton · « (type le nôtre, dès 1 370 CHF/mois) »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$(type le nôtre, dès 1 370 CHF/mois)$f$, $r$(type le nôtre, dès {{PRIX_DES}}/mois)$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$(type le nôtre, dès 1 370 CHF/mois)$f$ IN content_fr) > 0
  AND position($r$(type le nôtre, dès {{PRIX_DES}}/mois)$r$ IN content_fr) = 0;

-- [88/100] quartiers-annemasse-ou-vivre-selon-profil (en) · jeton · "(like ours, from CHF 1,370/month)"
UPDATE blog_posts
SET content_en = replace(content_en, $f$(like ours, from CHF 1,370/month)$f$, $r$(like ours, from {{PRIX_DES}}/month)$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$(like ours, from CHF 1,370/month)$f$ IN content_en) > 0
  AND position($r$(like ours, from {{PRIX_DES}}/month)$r$ IN content_en) = 0;

-- [89/100] salaire-suisse-net-frontalier-2026 (fr) · jeton · « — dès 1 370 CHF/mois, avec une communauté »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$— dès 1 370 CHF/mois, avec une communauté$f$, $r$— dès {{PRIX_DES}}/mois, avec une communauté$r$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($f$— dès 1 370 CHF/mois, avec une communauté$f$ IN content_fr) > 0
  AND position($r$— dès {{PRIX_DES}}/mois, avec une communauté$r$ IN content_fr) = 0;

-- [90/100] salaire-suisse-net-frontalier-2026 (en) · jeton · "— from CHF 1,370/month, with a community"
UPDATE blog_posts
SET content_en = replace(content_en, $f$— from CHF 1,370/month, with a community$f$, $r$— from {{PRIX_DES}}/month, with a community$r$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($f$— from CHF 1,370/month, with a community$f$ IN content_en) > 0
  AND position($r$— from {{PRIX_DES}}/month, with a community$r$ IN content_en) = 0;

-- [91/100] temps-trajet-annemasse-geneve-par-quartier (fr) · jeton · « — tout inclus dès 1 370 CHF/mois. »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$— tout inclus dès 1 370 CHF/mois.$f$, $r$— tout inclus dès {{PRIX_DES}}/mois.$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$— tout inclus dès 1 370 CHF/mois.$f$ IN content_fr) > 0
  AND position($r$— tout inclus dès {{PRIX_DES}}/mois.$r$ IN content_fr) = 0;

-- [92/100] temps-trajet-annemasse-geneve-par-quartier (en) · jeton · "— all-inclusive from CHF 1,370/month."
UPDATE blog_posts
SET content_en = replace(content_en, $f$— all-inclusive from CHF 1,370/month.$f$, $r$— all-inclusive from {{PRIX_DES}}/month.$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$— all-inclusive from CHF 1,370/month.$f$ IN content_en) > 0
  AND position($r$— all-inclusive from {{PRIX_DES}}/month.$r$ IN content_en) = 0;

-- [93/100] trouver-colocation-geneve-frontalier (fr) · jeton · « déjà installée — dès 1 370 CHF/mois, à »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$déjà installée — dès 1 370 CHF/mois, à$f$, $r$déjà installée — dès {{PRIX_DES}}/mois, à$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$déjà installée — dès 1 370 CHF/mois, à$f$ IN content_fr) > 0
  AND position($r$déjà installée — dès {{PRIX_DES}}/mois, à$r$ IN content_fr) = 0;

-- [94/100] trouver-colocation-geneve-frontalier (en) · jeton · "already settled in — from 1,370 CHF/month, 20 min" (graphie : « 1,370 CHF » → « CHF 1,370 », celle du site)
UPDATE blog_posts
SET content_en = replace(content_en, $f$already settled in — from 1,370 CHF/month, 20 min$f$, $r$already settled in — from {{PRIX_DES}}/month, 20 min$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$already settled in — from 1,370 CHF/month, 20 min$f$ IN content_en) > 0
  AND position($r$already settled in — from {{PRIX_DES}}/month, 20 min$r$ IN content_en) = 0;

-- [95/100] trouver-colocation-geneve-frontalier (fr) · jeton · « d'une salle de sport. À partir de 1 370 CHF/mois. »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$d'une salle de sport. À partir de 1 370 CHF/mois.$f$, $r$d'une salle de sport. À partir de {{PRIX_DES}}/mois.$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$d'une salle de sport. À partir de 1 370 CHF/mois.$f$ IN content_fr) > 0
  AND position($r$d'une salle de sport. À partir de {{PRIX_DES}}/mois.$r$ IN content_fr) = 0;

-- [96/100] trouver-colocation-geneve-frontalier (en) · jeton · "a sauna and a gym. From CHF 1,370/month."
UPDATE blog_posts
SET content_en = replace(content_en, $f$a sauna and a gym. From CHF 1,370/month.$f$, $r$a sauna and a gym. From {{PRIX_DES}}/month.$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$a sauna and a gym. From CHF 1,370/month.$f$ IN content_en) > 0
  AND position($r$a sauna and a gym. From {{PRIX_DES}}/month.$r$ IN content_en) = 0;

-- [97/100] trouver-colocation-geneve-frontalier (fr) · jeton · « tout inclus dès 1 370 CHF/mois, avec piscine »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$tout inclus dès 1 370 CHF/mois, avec piscine$f$, $r$tout inclus dès {{PRIX_DES}}/mois, avec piscine$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$tout inclus dès 1 370 CHF/mois, avec piscine$f$ IN content_fr) > 0
  AND position($r$tout inclus dès {{PRIX_DES}}/mois, avec piscine$r$ IN content_fr) = 0;

-- [98/100] trouver-colocation-geneve-frontalier (en) · jeton · "room from CHF 1,370/month, with a pool"
UPDATE blog_posts
SET content_en = replace(content_en, $f$room from CHF 1,370/month, with a pool$f$, $r$room from {{PRIX_DES}}/month, with a pool$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$room from CHF 1,370/month, with a pool$f$ IN content_en) > 0
  AND position($r$room from {{PRIX_DES}}/month, with a pool$r$ IN content_en) = 0;

-- [99/100] trouver-colocation-geneve-frontalier (fr) · jeton · « porte-à-porte, dès 1 370 CHF/mois. »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$porte-à-porte, dès 1 370 CHF/mois.$f$, $r$porte-à-porte, dès {{PRIX_DES}}/mois.$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$porte-à-porte, dès 1 370 CHF/mois.$f$ IN content_fr) > 0
  AND position($r$porte-à-porte, dès {{PRIX_DES}}/mois.$r$ IN content_fr) = 0;

-- [100/100] trouver-colocation-geneve-frontalier (en) · jeton · "door to door, from CHF 1,370/month."
UPDATE blog_posts
SET content_en = replace(content_en, $f$door to door, from CHF 1,370/month.$f$, $r$door to door, from {{PRIX_DES}}/month.$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$door to door, from CHF 1,370/month.$f$ IN content_en) > 0
  AND position($r$door to door, from {{PRIX_DES}}/month.$r$ IN content_en) = 0;

-- ── Aperçu des ancrages (ancien → nouveau, première ligne de chaque texte) ──
-- [1] allocations-familiales-frontalier-geneve-2026/fr · jeton : « coûte à partir de **1 370 CHF/mois** » → « coûte à partir de **{{PRIX_DES}}/mois** »
-- [2] allocations-familiales-frontalier-geneve-2026/en · jeton : « costs from **CHF 1,370/month** » → « costs from **{{PRIX_DES}}/month** »
-- [3] arnaques-logement-frontalier-geneve-eviter/fr · jeton : « coûte à partir de **1 370 CHF/mois** » → « coûte à partir de **{{PRIX_DES}}/mois** »
-- [4] arnaques-logement-frontalier-geneve-eviter/en · jeton : « costs from **CHF 1,370/month** » → « costs from **{{PRIX_DES}}/month** »
-- [5] assurance-sante-frontalier-lamal-cmu-budget/fr · jeton : « coûte à partir de **1 370 CHF/mois** » → « coûte à partir de **{{PRIX_DES}}/mois** »
-- [6] assurance-sante-frontalier-lamal-cmu-budget/en · jeton : « costs from **CHF 1,370/month** » → « costs from **{{PRIX_DES}}/month** »
-- [7] banque-telephone-internet-frontalier-bons-plans/fr · jeton : « coûte à partir de **1 370 CHF/mois** » → « coûte à partir de **{{PRIX_DES}}/mois** »
-- [8] banque-telephone-internet-frontalier-bons-plans/en · jeton : « costs from **CHF 1,370/month** » → « costs from **{{PRIX_DES}}/month** »
-- [9] budget-colocation-geneve-guide-complet/fr · jeton : « coûte à partir de **1 370 CHF/mois** » → « coûte à partir de **{{PRIX_DES}}/mois** »
-- [10] budget-colocation-geneve-guide-complet/en · jeton : « costs from **CHF 1,370/month** » → « costs from **{{PRIX_DES}}/month** »
-- [11] choc-culturel-franco-suisse-expatrie-geneve/fr · jeton : « coûte à partir de **1 370 CHF/mois** » → « coûte à partir de **{{PRIX_DES}}/mois** »
-- [12] choc-culturel-franco-suisse-expatrie-geneve/en · jeton : « costs from **CHF 1,370/month** » → « costs from **{{PRIX_DES}}/month** »
-- [13] coliving-frais-dossier-geneve-annemasse/fr · jeton : « coûte à partir de **1 370 CHF/mois** » → « coûte à partir de **{{PRIX_DES}}/mois** »
-- [14] coliving-frais-dossier-geneve-annemasse/en · jeton : « costs from **CHF 1,370/month** » → « costs from **{{PRIX_DES}}/month** »
-- [15] coliving-transfrontalier-geneve-annemasse-nouvelle-vie/fr · jeton : « coûte à partir de **1 370 CHF/mois** » → « coûte à partir de **{{PRIX_DES}}/mois** »
-- [16] coliving-transfrontalier-geneve-annemasse-nouvelle-vie/en · jeton : « costs from **CHF 1,370/month** » → « costs from **{{PRIX_DES}}/month** »
-- [17] cout-de-la-vie-suisse-france-frontalier-2026/fr · jeton : « coûte à partir de **1 370 CHF/mois** » → « coûte à partir de **{{PRIX_DES}}/mois** »
-- [18] cout-de-la-vie-suisse-france-frontalier-2026/en · jeton : « costs from **CHF 1,370/month** » → « costs from **{{PRIX_DES}}/month** »
-- [19] cout-transport-frontalier-geneve-2026/fr · jeton : « coûte à partir de **1 370 CHF/mois** » → « coûte à partir de **{{PRIX_DES}}/mois** »
-- [20] cout-transport-frontalier-geneve-2026/en · jeton : « costs from **CHF 1,370/month** » → « costs from **{{PRIX_DES}}/month** »
-- [21] declaration-impots-frontalier-2026/fr · jeton : « coûte à partir de **1 370 CHF/mois** » → « coûte à partir de **{{PRIX_DES}}/mois** »
-- [22] declaration-impots-frontalier-2026/en · jeton : « costs from **CHF 1,370/month** » → « costs from **{{PRIX_DES}}/month** »
-- [23] ecole-internationale-geneve-frontalier-ou-habiter/fr · jeton : « coûte à partir de **1 370 CHF/mois** » → « coûte à partir de **{{PRIX_DES}}/mois** »
-- [24] ecole-internationale-geneve-frontalier-ou-habiter/en · jeton : « costs from **CHF 1,370/month** » → « costs from **{{PRIX_DES}}/month** »
-- [25] espaces-verts-coliving-lodge-annemasse/fr · jeton : « coûte à partir de **1 370 CHF/mois** » → « coûte à partir de **{{PRIX_DES}}/mois** »
-- [26] espaces-verts-coliving-lodge-annemasse/en · jeton : « costs from **CHF 1,370/month** » → « costs from **{{PRIX_DES}}/month** »
-- [27] fiscalite-frontalier-geneve-impots-2026/fr · jeton : « coûte à partir de **1 370 CHF/mois** » → « coûte à partir de **{{PRIX_DES}}/mois** »
-- [28] fiscalite-frontalier-geneve-impots-2026/en · jeton : « costs from **CHF 1,370/month** » → « costs from **{{PRIX_DES}}/month** »
-- [29] grand-geneve-2026-nouveautes-frontaliers/fr · jeton : « coûte à partir de **1 370 CHF/mois** » → « coûte à partir de **{{PRIX_DES}}/mois** »
-- [30] grand-geneve-2026-nouveautes-frontaliers/en · jeton : « costs from **CHF 1,370/month** » → « costs from **{{PRIX_DES}}/month** »
-- [31] guide-ressources-frontalier-geneve/fr · jeton : « coûte à partir de **1 370 CHF/mois** » → « coûte à partir de **{{PRIX_DES}}/mois** »
-- [32] guide-ressources-frontalier-geneve/en · jeton : « costs from **CHF 1,370/month** » → « costs from **{{PRIX_DES}}/month** »
-- [33] living-in-france-working-in-geneva/fr · jeton : « coûte à partir de **1 370 CHF/mois** » → « coûte à partir de **{{PRIX_DES}}/mois** »
-- [34] living-in-france-working-in-geneva/en · jeton : « costs from **CHF 1,370/month** » → « costs from **{{PRIX_DES}}/month** »
-- [35] optimiser-espace-coliving-productivite-bien-etre/fr · jeton : « coûte à partir de **1 370 CHF/mois** » → « coûte à partir de **{{PRIX_DES}}/mois** »
-- [36] optimiser-espace-coliving-productivite-bien-etre/en · jeton : « costs from **CHF 1,370/month** » → « costs from **{{PRIX_DES}}/month** »
-- [37] organisations-internationales-geneve-ou-habiter/fr · jeton : « coûte à partir de **1 370 CHF/mois** » → « coûte à partir de **{{PRIX_DES}}/mois** »
-- [38] organisations-internationales-geneve-ou-habiter/en · jeton : « costs from **CHF 1,370/month** » → « costs from **{{PRIX_DES}}/month** »
-- [39] ou-habiter-en-france-quand-on-travaille-a-geneve/fr · jeton : « coûte à partir de **1 370 CHF/mois** » → « coûte à partir de **{{PRIX_DES}}/mois** »
-- [40] ou-habiter-en-france-quand-on-travaille-a-geneve/en · jeton : « costs from **CHF 1,370/month** » → « costs from **{{PRIX_DES}}/month** »
-- [41] permis-g-frontalier-geneve/fr · jeton : « coûte à partir de **1 370 CHF/mois** » → « coûte à partir de **{{PRIX_DES}}/mois** »
-- [42] permis-g-frontalier-geneve/en · jeton : « costs from **CHF 1,370/month** » → « costs from **{{PRIX_DES}}/month** »
-- [43] quartiers-annemasse-ou-vivre-selon-profil/fr · jeton : « coûte à partir de **1 370 CHF/mois** » → « coûte à partir de **{{PRIX_DES}}/mois** »
-- [44] quartiers-annemasse-ou-vivre-selon-profil/en · jeton : « costs from **CHF 1,370/month** » → « costs from **{{PRIX_DES}}/month** »
-- [45] quitter-son-logement-guide-pratique/fr · jeton : « coûte à partir de **1 370 CHF/mois** » → « coûte à partir de **{{PRIX_DES}}/mois** »
-- [46] quitter-son-logement-guide-pratique/en · jeton : « costs from **CHF 1,370/month** » → « costs from **{{PRIX_DES}}/month** »
-- [47] salaire-suisse-net-frontalier-2026/fr · jeton : « coûte à partir de **1 370 CHF/mois** » → « coûte à partir de **{{PRIX_DES}}/mois** »
-- [48] salaire-suisse-net-frontalier-2026/en · jeton : « costs from **CHF 1,370/month** » → « costs from **{{PRIX_DES}}/month** »
-- [49] se-faire-reseau-geneve-arriver-seul/fr · jeton : « coûte à partir de **1 370 CHF/mois** » → « coûte à partir de **{{PRIX_DES}}/mois** »
-- [50] se-faire-reseau-geneve-arriver-seul/en · jeton : « costs from **CHF 1,370/month** » → « costs from **{{PRIX_DES}}/month** »
-- [51] teletravail-frontalier-geneve-regles-2026/fr · jeton : « coûte à partir de **1 370 CHF/mois** » → « coûte à partir de **{{PRIX_DES}}/mois** »
-- [52] teletravail-frontalier-geneve-regles-2026/en · jeton : « costs from **CHF 1,370/month** » → « costs from **{{PRIX_DES}}/month** »
-- [53] transport-annemasse-geneve-leman-express/fr · jeton : « coûte à partir de **1 370 CHF/mois** » → « coûte à partir de **{{PRIX_DES}}/mois** »
-- [54] transport-annemasse-geneve-leman-express/en · jeton : « costs from **CHF 1,370/month** » → « costs from **{{PRIX_DES}}/month** »
-- [55] trouver-colocation-geneve-frontalier/fr · jeton : « coûte à partir de **1 370 CHF/mois** » → « coûte à partir de **{{PRIX_DES}}/mois** »
-- [56] trouver-colocation-geneve-frontalier/en · jeton : « costs from **CHF 1,370/month** » → « costs from **{{PRIX_DES}}/month** »
-- [57] trouver-logement-avant-d-arriver-geneve/fr · jeton : « coûte à partir de **1 370 CHF/mois** » → « coûte à partir de **{{PRIX_DES}}/mois** »
-- [58] trouver-logement-avant-d-arriver-geneve/en · jeton : « costs from **CHF 1,370/month** » → « costs from **{{PRIX_DES}}/month** »
-- [59] vie-quotidienne-frontalier-courses-sport-sorties/fr · jeton : « coûte à partir de **1 370 CHF/mois** » → « coûte à partir de **{{PRIX_DES}}/mois** »
-- [60] vie-quotidienne-frontalier-courses-sport-sorties/en · jeton : « costs from **CHF 1,370/month** » → « costs from **{{PRIX_DES}}/month** »
-- [61] assurance-sante-frontalier-lamal-cmu-budget/fr · jeton : « Le coliving, dès 1 370 CHF, est serré » → « Le coliving, dès {{PRIX_DES}}, est serré »
-- [62] assurance-sante-frontalier-lamal-cmu-budget/en · jeton : « Coliving, from 1,370 CHF, is tight » → « Coliving, from {{PRIX_DES}}, is tight »
-- [63] assurance-sante-frontalier-lamal-cmu-budget/fr · jeton : « Le coliving, dès 1 370 CHF, est très confortable » → « Le coliving, dès {{PRIX_DES}}, est très confortable »
-- [64] assurance-sante-frontalier-lamal-cmu-budget/en · jeton : « Coliving, from 1,370 CHF, is very comfortable » → « Coliving, from {{PRIX_DES}}, is very comfortable »
-- [65] coliving-annemasse-geneve-frontaliers-avantages/fr · jeton : « tout inclus dès **1 370 CHF/mois** dans 3 maisons » → « tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons »
-- [66] coliving-annemasse-geneve-frontaliers-avantages/en · jeton : « rooms from **CHF 1,370/month** across 3 houses » → « rooms from **{{PRIX_DES}}/month** across 3 houses »
-- [67] coliving-communaute-reels-amis-geneve-annemasse/fr · jeton : « **Tout inclus dès 1 370 CHF par mois** » → « **Tout inclus dès {{PRIX_DES}} par mois** »
-- [68] coliving-communaute-reels-amis-geneve-annemasse/en · jeton : « **All inclusive from CHF 1,370 per month** » → « **All inclusive from {{PRIX_DES}} per month** »
-- [69] coliving-geneve-frontaliers-guide-complet/fr · jeton : « tout inclus dès **1 370 CHF/mois**, sans frais de dossier. » → « tout inclus dès **{{PRIX_DES}}/mois**, sans frais de dossier. »
-- [70] coliving-geneve-frontaliers-guide-complet/en · jeton : « all-inclusive from **CHF 1,370/month**, no application fee. » → « all-inclusive from **{{PRIX_DES}}/month**, no application fee. »
-- [71] coliving-transfrontalier-geneve-annemasse-nouvelle-vie/fr · jeton : « c'est dès 1 370 CHF par mois, tout compris » → « c'est dès {{PRIX_DES}} par mois, tout compris »
-- [72] coliving-transfrontalier-geneve-annemasse-nouvelle-vie/en · jeton : « it's from CHF 1,370 per month, all-inclusive » → « it's from {{PRIX_DES}} per month, all-inclusive »
-- [73] coliving-transfrontalier-geneve-annemasse-nouvelle-vie/fr · jeton : « - **Budget** : dès 1 370 CHF tout compris » → « - **Budget** : dès {{PRIX_DES}} tout compris »
-- [74] coliving-transfrontalier-geneve-annemasse-nouvelle-vie/en · jeton : « - **Budget**: from CHF 1,370 all-inclusive » → « - **Budget**: from {{PRIX_DES}} all-inclusive »
-- [75] colocation-annemasse-ville-la-grand-ambilly/fr · jeton : « - Prix : dès 1 370 CHF/mois tout compris » → « - Prix : dès {{PRIX_DES}}/mois tout compris »
-- [76] colocation-annemasse-ville-la-grand-ambilly/en · jeton : « - Price: from CHF 1,370/month all-inclusive » → « - Price: from {{PRIX_DES}}/month all-inclusive »
-- [77] colocation-annemasse-ville-la-grand-ambilly/fr · jeton : « tout inclus dès **1 370 CHF/mois** dans 3 maisons » → « tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons »
-- [78] colocation-annemasse-ville-la-grand-ambilly/en · jeton : « rooms from **CHF 1,370/month** across 3 houses » → « rooms from **{{PRIX_DES}}/month** across 3 houses »
-- [79] dossier-location-frontalier-suisse-france/fr · jeton : « tout inclus dès **1 370 CHF/mois**, sans frais de dossier. » → « tout inclus dès **{{PRIX_DES}}/mois**, sans frais de dossier. »
-- [80] dossier-location-frontalier-suisse-france/en · jeton : « rooms from **CHF 1,370/month**, no application fee. » → « rooms from **{{PRIX_DES}}/month**, no application fee. »
-- [81] grand-geneve-2026-nouveautes-frontaliers/fr · jeton : « **Dès 1 370 CHF par mois, tout inclus** » → « **Dès {{PRIX_DES}} par mois, tout inclus** »
-- [82] grand-geneve-2026-nouveautes-frontaliers/en · jeton : « **From CHF 1,370 per month, all-inclusive** » → « **From {{PRIX_DES}} per month, all-inclusive** »
-- [83] guide-ressources-frontalier-geneve/fr · jeton : « À partir de 1 370 CHF/mois. Le prix affiché » → « À partir de {{PRIX_DES}}/mois. Le prix affiché »
-- [84] guide-ressources-frontalier-geneve/en · jeton : « From 1,370 CHF/month. The advertised price » → « From {{PRIX_DES}}/month. The advertised price »
-- [85] living-in-france-working-in-geneva/fr · jeton : « avec des chambres dès 1 370 CHF par mois tout inclus » → « avec des chambres dès {{PRIX_DES}} par mois tout inclus »
-- [86] living-in-france-working-in-geneva/en · jeton : « with rooms from CHF 1,370 a month all inclusive » → « with rooms from {{PRIX_DES}} a month all inclusive »
-- [87] quartiers-annemasse-ou-vivre-selon-profil/fr · jeton : « (type le nôtre, dès 1 370 CHF/mois) » → « (type le nôtre, dès {{PRIX_DES}}/mois) »
-- [88] quartiers-annemasse-ou-vivre-selon-profil/en · jeton : « (like ours, from CHF 1,370/month) » → « (like ours, from {{PRIX_DES}}/month) »
-- [89] salaire-suisse-net-frontalier-2026/fr · jeton : « — dès 1 370 CHF/mois, avec une communauté » → « — dès {{PRIX_DES}}/mois, avec une communauté »
-- [90] salaire-suisse-net-frontalier-2026/en · jeton : « — from CHF 1,370/month, with a community » → « — from {{PRIX_DES}}/month, with a community »
-- [91] temps-trajet-annemasse-geneve-par-quartier/fr · jeton : « — tout inclus dès 1 370 CHF/mois. » → « — tout inclus dès {{PRIX_DES}}/mois. »
-- [92] temps-trajet-annemasse-geneve-par-quartier/en · jeton : « — all-inclusive from CHF 1,370/month. » → « — all-inclusive from {{PRIX_DES}}/month. »
-- [93] trouver-colocation-geneve-frontalier/fr · jeton : « déjà installée — dès 1 370 CHF/mois, à » → « déjà installée — dès {{PRIX_DES}}/mois, à »
-- [94] trouver-colocation-geneve-frontalier/en · jeton : « already settled in — from 1,370 CHF/month, 20 min » → « already settled in — from {{PRIX_DES}}/month, 20 min »
-- [95] trouver-colocation-geneve-frontalier/fr · jeton : « d'une salle de sport. À partir de 1 370 CHF/mois. » → « d'une salle de sport. À partir de {{PRIX_DES}}/mois. »
-- [96] trouver-colocation-geneve-frontalier/en · jeton : « a sauna and a gym. From CHF 1,370/month. » → « a sauna and a gym. From {{PRIX_DES}}/month. »
-- [97] trouver-colocation-geneve-frontalier/fr · jeton : « tout inclus dès 1 370 CHF/mois, avec piscine » → « tout inclus dès {{PRIX_DES}}/mois, avec piscine »
-- [98] trouver-colocation-geneve-frontalier/en · jeton : « room from CHF 1,370/month, with a pool » → « room from {{PRIX_DES}}/month, with a pool »
-- [99] trouver-colocation-geneve-frontalier/fr · jeton : « porte-à-porte, dès 1 370 CHF/mois. » → « porte-à-porte, dès {{PRIX_DES}}/mois. »
-- [100] trouver-colocation-geneve-frontalier/en · jeton : « door to door, from CHF 1,370/month. » → « door to door, from {{PRIX_DES}}/month. »

COMMIT;

-- ── Vérification (lecture seule) : une ligne par article ; fr_ok / en_ok = true quand toutes les modifications de la langue sont en place, NULL = langue non touchée.
SELECT slug,
  CASE slug
    WHEN 'allocations-familiales-frontalier-geneve-2026' THEN (position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0)
    WHEN 'arnaques-logement-frontalier-geneve-eviter' THEN (position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0)
    WHEN 'assurance-sante-frontalier-lamal-cmu-budget' THEN (position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0
      AND position($f$Le coliving, dès 1 370 CHF, est serré$f$ IN content_fr) = 0
      AND position($f$Le coliving, dès 1 370 CHF, est très confortable$f$ IN content_fr) = 0)
    WHEN 'banque-telephone-internet-frontalier-bons-plans' THEN (position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0)
    WHEN 'budget-colocation-geneve-guide-complet' THEN (position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0)
    WHEN 'choc-culturel-franco-suisse-expatrie-geneve' THEN (position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0)
    WHEN 'coliving-annemasse-geneve-frontaliers-avantages' THEN (position($f$tout inclus dès **1 370 CHF/mois** dans 3 maisons$f$ IN content_fr) = 0)
    WHEN 'coliving-communaute-reels-amis-geneve-annemasse' THEN (position($f$**Tout inclus dès 1 370 CHF par mois**$f$ IN content_fr) = 0)
    WHEN 'coliving-frais-dossier-geneve-annemasse' THEN (position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0)
    WHEN 'coliving-geneve-frontaliers-guide-complet' THEN (position($f$tout inclus dès **1 370 CHF/mois**, sans frais de dossier.$f$ IN content_fr) = 0)
    WHEN 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie' THEN (position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0
      AND position($f$c'est dès 1 370 CHF par mois, tout compris$f$ IN content_fr) = 0
      AND position($f$- **Budget** : dès 1 370 CHF tout compris$f$ IN content_fr) = 0)
    WHEN 'colocation-annemasse-ville-la-grand-ambilly' THEN (position($f$- Prix : dès 1 370 CHF/mois tout compris$f$ IN content_fr) = 0
      AND position($f$tout inclus dès **1 370 CHF/mois** dans 3 maisons$f$ IN content_fr) = 0)
    WHEN 'cout-de-la-vie-suisse-france-frontalier-2026' THEN (position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0)
    WHEN 'cout-transport-frontalier-geneve-2026' THEN (position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0)
    WHEN 'declaration-impots-frontalier-2026' THEN (position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0)
    WHEN 'dossier-location-frontalier-suisse-france' THEN (position($f$tout inclus dès **1 370 CHF/mois**, sans frais de dossier.$f$ IN content_fr) = 0)
    WHEN 'ecole-internationale-geneve-frontalier-ou-habiter' THEN (position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0)
    WHEN 'espaces-verts-coliving-lodge-annemasse' THEN (position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0)
    WHEN 'fiscalite-frontalier-geneve-impots-2026' THEN (position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0)
    WHEN 'grand-geneve-2026-nouveautes-frontaliers' THEN (position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0
      AND position($f$**Dès 1 370 CHF par mois, tout inclus**$f$ IN content_fr) = 0)
    WHEN 'guide-ressources-frontalier-geneve' THEN (position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0
      AND position($f$À partir de 1 370 CHF/mois. Le prix affiché$f$ IN content_fr) = 0)
    WHEN 'living-in-france-working-in-geneva' THEN (position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0
      AND position($f$avec des chambres dès 1 370 CHF par mois tout inclus$f$ IN content_fr) = 0)
    WHEN 'optimiser-espace-coliving-productivite-bien-etre' THEN (position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0)
    WHEN 'organisations-internationales-geneve-ou-habiter' THEN (position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0)
    WHEN 'ou-habiter-en-france-quand-on-travaille-a-geneve' THEN (position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0)
    WHEN 'permis-g-frontalier-geneve' THEN (position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0)
    WHEN 'quartiers-annemasse-ou-vivre-selon-profil' THEN (position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0
      AND position($f$(type le nôtre, dès 1 370 CHF/mois)$f$ IN content_fr) = 0)
    WHEN 'quitter-son-logement-guide-pratique' THEN (position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0)
    WHEN 'salaire-suisse-net-frontalier-2026' THEN (position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0
      AND position($f$— dès 1 370 CHF/mois, avec une communauté$f$ IN content_fr) = 0)
    WHEN 'se-faire-reseau-geneve-arriver-seul' THEN (position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0)
    WHEN 'teletravail-frontalier-geneve-regles-2026' THEN (position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0)
    WHEN 'temps-trajet-annemasse-geneve-par-quartier' THEN (position($f$— tout inclus dès 1 370 CHF/mois.$f$ IN content_fr) = 0)
    WHEN 'transport-annemasse-geneve-leman-express' THEN (position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0)
    WHEN 'trouver-colocation-geneve-frontalier' THEN (position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0
      AND position($f$déjà installée — dès 1 370 CHF/mois, à$f$ IN content_fr) = 0
      AND position($f$d'une salle de sport. À partir de 1 370 CHF/mois.$f$ IN content_fr) = 0
      AND position($f$tout inclus dès 1 370 CHF/mois, avec piscine$f$ IN content_fr) = 0
      AND position($f$porte-à-porte, dès 1 370 CHF/mois.$f$ IN content_fr) = 0)
    WHEN 'trouver-logement-avant-d-arriver-geneve' THEN (position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0)
    WHEN 'vie-quotidienne-frontalier-courses-sport-sorties' THEN (position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0)
  END AS fr_ok,
  CASE slug
    WHEN 'allocations-familiales-frontalier-geneve-2026' THEN (position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0)
    WHEN 'arnaques-logement-frontalier-geneve-eviter' THEN (position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0)
    WHEN 'assurance-sante-frontalier-lamal-cmu-budget' THEN (position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0
      AND position($f$Coliving, from 1,370 CHF, is tight$f$ IN content_en) = 0
      AND position($f$Coliving, from 1,370 CHF, is very comfortable$f$ IN content_en) = 0)
    WHEN 'banque-telephone-internet-frontalier-bons-plans' THEN (position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0)
    WHEN 'budget-colocation-geneve-guide-complet' THEN (position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0)
    WHEN 'choc-culturel-franco-suisse-expatrie-geneve' THEN (position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0)
    WHEN 'coliving-annemasse-geneve-frontaliers-avantages' THEN (position($f$rooms from **CHF 1,370/month** across 3 houses$f$ IN content_en) = 0)
    WHEN 'coliving-communaute-reels-amis-geneve-annemasse' THEN (position($f$**All inclusive from CHF 1,370 per month**$f$ IN content_en) = 0)
    WHEN 'coliving-frais-dossier-geneve-annemasse' THEN (position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0)
    WHEN 'coliving-geneve-frontaliers-guide-complet' THEN (position($f$all-inclusive from **CHF 1,370/month**, no application fee.$f$ IN content_en) = 0)
    WHEN 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie' THEN (position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0
      AND position($f$it's from CHF 1,370 per month, all-inclusive$f$ IN content_en) = 0
      AND position($f$- **Budget**: from CHF 1,370 all-inclusive$f$ IN content_en) = 0)
    WHEN 'colocation-annemasse-ville-la-grand-ambilly' THEN (position($f$- Price: from CHF 1,370/month all-inclusive$f$ IN content_en) = 0
      AND position($f$rooms from **CHF 1,370/month** across 3 houses$f$ IN content_en) = 0)
    WHEN 'cout-de-la-vie-suisse-france-frontalier-2026' THEN (position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0)
    WHEN 'cout-transport-frontalier-geneve-2026' THEN (position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0)
    WHEN 'declaration-impots-frontalier-2026' THEN (position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0)
    WHEN 'dossier-location-frontalier-suisse-france' THEN (position($f$rooms from **CHF 1,370/month**, no application fee.$f$ IN content_en) = 0)
    WHEN 'ecole-internationale-geneve-frontalier-ou-habiter' THEN (position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0)
    WHEN 'espaces-verts-coliving-lodge-annemasse' THEN (position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0)
    WHEN 'fiscalite-frontalier-geneve-impots-2026' THEN (position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0)
    WHEN 'grand-geneve-2026-nouveautes-frontaliers' THEN (position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0
      AND position($f$**From CHF 1,370 per month, all-inclusive**$f$ IN content_en) = 0)
    WHEN 'guide-ressources-frontalier-geneve' THEN (position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0
      AND position($f$From 1,370 CHF/month. The advertised price$f$ IN content_en) = 0)
    WHEN 'living-in-france-working-in-geneva' THEN (position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0
      AND position($f$with rooms from CHF 1,370 a month all inclusive$f$ IN content_en) = 0)
    WHEN 'optimiser-espace-coliving-productivite-bien-etre' THEN (position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0)
    WHEN 'organisations-internationales-geneve-ou-habiter' THEN (position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0)
    WHEN 'ou-habiter-en-france-quand-on-travaille-a-geneve' THEN (position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0)
    WHEN 'permis-g-frontalier-geneve' THEN (position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0)
    WHEN 'quartiers-annemasse-ou-vivre-selon-profil' THEN (position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0
      AND position($f$(like ours, from CHF 1,370/month)$f$ IN content_en) = 0)
    WHEN 'quitter-son-logement-guide-pratique' THEN (position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0)
    WHEN 'salaire-suisse-net-frontalier-2026' THEN (position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0
      AND position($f$— from CHF 1,370/month, with a community$f$ IN content_en) = 0)
    WHEN 'se-faire-reseau-geneve-arriver-seul' THEN (position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0)
    WHEN 'teletravail-frontalier-geneve-regles-2026' THEN (position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0)
    WHEN 'temps-trajet-annemasse-geneve-par-quartier' THEN (position($f$— all-inclusive from CHF 1,370/month.$f$ IN content_en) = 0)
    WHEN 'transport-annemasse-geneve-leman-express' THEN (position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0)
    WHEN 'trouver-colocation-geneve-frontalier' THEN (position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0
      AND position($f$already settled in — from 1,370 CHF/month, 20 min$f$ IN content_en) = 0
      AND position($f$a sauna and a gym. From CHF 1,370/month.$f$ IN content_en) = 0
      AND position($f$room from CHF 1,370/month, with a pool$f$ IN content_en) = 0
      AND position($f$door to door, from CHF 1,370/month.$f$ IN content_en) = 0)
    WHEN 'trouver-logement-avant-d-arriver-geneve' THEN (position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0)
    WHEN 'vie-quotidienne-frontalier-courses-sport-sorties' THEN (position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0)
  END AS en_ok
FROM blog_posts
WHERE slug IN ('allocations-familiales-frontalier-geneve-2026', 'arnaques-logement-frontalier-geneve-eviter', 'assurance-sante-frontalier-lamal-cmu-budget', 'banque-telephone-internet-frontalier-bons-plans', 'budget-colocation-geneve-guide-complet', 'choc-culturel-franco-suisse-expatrie-geneve', 'coliving-annemasse-geneve-frontaliers-avantages', 'coliving-communaute-reels-amis-geneve-annemasse', 'coliving-frais-dossier-geneve-annemasse', 'coliving-geneve-frontaliers-guide-complet', 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie', 'colocation-annemasse-ville-la-grand-ambilly', 'cout-de-la-vie-suisse-france-frontalier-2026', 'cout-transport-frontalier-geneve-2026', 'declaration-impots-frontalier-2026', 'dossier-location-frontalier-suisse-france', 'ecole-internationale-geneve-frontalier-ou-habiter', 'espaces-verts-coliving-lodge-annemasse', 'fiscalite-frontalier-geneve-impots-2026', 'grand-geneve-2026-nouveautes-frontaliers', 'guide-ressources-frontalier-geneve', 'living-in-france-working-in-geneva', 'optimiser-espace-coliving-productivite-bien-etre', 'organisations-internationales-geneve-ou-habiter', 'ou-habiter-en-france-quand-on-travaille-a-geneve', 'permis-g-frontalier-geneve', 'quartiers-annemasse-ou-vivre-selon-profil', 'quitter-son-logement-guide-pratique', 'salaire-suisse-net-frontalier-2026', 'se-faire-reseau-geneve-arriver-seul', 'teletravail-frontalier-geneve-regles-2026', 'temps-trajet-annemasse-geneve-par-quartier', 'transport-annemasse-geneve-leman-express', 'trouver-colocation-geneve-frontalier', 'trouver-logement-avant-d-arriver-geneve', 'vie-quotidienne-frontalier-courses-sport-sorties')
ORDER BY slug;

-- ── Retour arrière (inverse exact, mêmes gardes miroir) : retirer les deux lignes /* et */ puis exécuter le bloc.
/*
BEGIN;

UPDATE blog_posts
SET content_en = replace(content_en, $r$door to door, from {{PRIX_DES}}/month.$r$, $f$door to door, from CHF 1,370/month.$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$door to door, from {{PRIX_DES}}/month.$r$ IN content_en) > 0
  AND position($f$door to door, from CHF 1,370/month.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$porte-à-porte, dès {{PRIX_DES}}/mois.$r$, $f$porte-à-porte, dès 1 370 CHF/mois.$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$porte-à-porte, dès {{PRIX_DES}}/mois.$r$ IN content_fr) > 0
  AND position($f$porte-à-porte, dès 1 370 CHF/mois.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$room from {{PRIX_DES}}/month, with a pool$r$, $f$room from CHF 1,370/month, with a pool$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$room from {{PRIX_DES}}/month, with a pool$r$ IN content_en) > 0
  AND position($f$room from CHF 1,370/month, with a pool$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$tout inclus dès {{PRIX_DES}}/mois, avec piscine$r$, $f$tout inclus dès 1 370 CHF/mois, avec piscine$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$tout inclus dès {{PRIX_DES}}/mois, avec piscine$r$ IN content_fr) > 0
  AND position($f$tout inclus dès 1 370 CHF/mois, avec piscine$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$a sauna and a gym. From {{PRIX_DES}}/month.$r$, $f$a sauna and a gym. From CHF 1,370/month.$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$a sauna and a gym. From {{PRIX_DES}}/month.$r$ IN content_en) > 0
  AND position($f$a sauna and a gym. From CHF 1,370/month.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$d'une salle de sport. À partir de {{PRIX_DES}}/mois.$r$, $f$d'une salle de sport. À partir de 1 370 CHF/mois.$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$d'une salle de sport. À partir de {{PRIX_DES}}/mois.$r$ IN content_fr) > 0
  AND position($f$d'une salle de sport. À partir de 1 370 CHF/mois.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$already settled in — from {{PRIX_DES}}/month, 20 min$r$, $f$already settled in — from 1,370 CHF/month, 20 min$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$already settled in — from {{PRIX_DES}}/month, 20 min$r$ IN content_en) > 0
  AND position($f$already settled in — from 1,370 CHF/month, 20 min$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$déjà installée — dès {{PRIX_DES}}/mois, à$r$, $f$déjà installée — dès 1 370 CHF/mois, à$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$déjà installée — dès {{PRIX_DES}}/mois, à$r$ IN content_fr) > 0
  AND position($f$déjà installée — dès 1 370 CHF/mois, à$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$— all-inclusive from {{PRIX_DES}}/month.$r$, $f$— all-inclusive from CHF 1,370/month.$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$— all-inclusive from {{PRIX_DES}}/month.$r$ IN content_en) > 0
  AND position($f$— all-inclusive from CHF 1,370/month.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$— tout inclus dès {{PRIX_DES}}/mois.$r$, $f$— tout inclus dès 1 370 CHF/mois.$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$— tout inclus dès {{PRIX_DES}}/mois.$r$ IN content_fr) > 0
  AND position($f$— tout inclus dès 1 370 CHF/mois.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$— from {{PRIX_DES}}/month, with a community$r$, $f$— from CHF 1,370/month, with a community$f$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($r$— from {{PRIX_DES}}/month, with a community$r$ IN content_en) > 0
  AND position($f$— from CHF 1,370/month, with a community$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$— dès {{PRIX_DES}}/mois, avec une communauté$r$, $f$— dès 1 370 CHF/mois, avec une communauté$f$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($r$— dès {{PRIX_DES}}/mois, avec une communauté$r$ IN content_fr) > 0
  AND position($f$— dès 1 370 CHF/mois, avec une communauté$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$(like ours, from {{PRIX_DES}}/month)$r$, $f$(like ours, from CHF 1,370/month)$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$(like ours, from {{PRIX_DES}}/month)$r$ IN content_en) > 0
  AND position($f$(like ours, from CHF 1,370/month)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$(type le nôtre, dès {{PRIX_DES}}/mois)$r$, $f$(type le nôtre, dès 1 370 CHF/mois)$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$(type le nôtre, dès {{PRIX_DES}}/mois)$r$ IN content_fr) > 0
  AND position($f$(type le nôtre, dès 1 370 CHF/mois)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$with rooms from {{PRIX_DES}} a month all inclusive$r$, $f$with rooms from CHF 1,370 a month all inclusive$f$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($r$with rooms from {{PRIX_DES}} a month all inclusive$r$ IN content_en) > 0
  AND position($f$with rooms from CHF 1,370 a month all inclusive$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$avec des chambres dès {{PRIX_DES}} par mois tout inclus$r$, $f$avec des chambres dès 1 370 CHF par mois tout inclus$f$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($r$avec des chambres dès {{PRIX_DES}} par mois tout inclus$r$ IN content_fr) > 0
  AND position($f$avec des chambres dès 1 370 CHF par mois tout inclus$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$From {{PRIX_DES}}/month. The advertised price$r$, $f$From 1,370 CHF/month. The advertised price$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$From {{PRIX_DES}}/month. The advertised price$r$ IN content_en) > 0
  AND position($f$From 1,370 CHF/month. The advertised price$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$À partir de {{PRIX_DES}}/mois. Le prix affiché$r$, $f$À partir de 1 370 CHF/mois. Le prix affiché$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$À partir de {{PRIX_DES}}/mois. Le prix affiché$r$ IN content_fr) > 0
  AND position($f$À partir de 1 370 CHF/mois. Le prix affiché$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**From {{PRIX_DES}} per month, all-inclusive**$r$, $f$**From CHF 1,370 per month, all-inclusive**$f$),
    updated_at = now()
WHERE slug = 'grand-geneve-2026-nouveautes-frontaliers'
  AND position($r$**From {{PRIX_DES}} per month, all-inclusive**$r$ IN content_en) > 0
  AND position($f$**From CHF 1,370 per month, all-inclusive**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$**Dès {{PRIX_DES}} par mois, tout inclus**$r$, $f$**Dès 1 370 CHF par mois, tout inclus**$f$),
    updated_at = now()
WHERE slug = 'grand-geneve-2026-nouveautes-frontaliers'
  AND position($r$**Dès {{PRIX_DES}} par mois, tout inclus**$r$ IN content_fr) > 0
  AND position($f$**Dès 1 370 CHF par mois, tout inclus**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$rooms from **{{PRIX_DES}}/month**, no application fee.$r$, $f$rooms from **CHF 1,370/month**, no application fee.$f$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($r$rooms from **{{PRIX_DES}}/month**, no application fee.$r$ IN content_en) > 0
  AND position($f$rooms from **CHF 1,370/month**, no application fee.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$tout inclus dès **{{PRIX_DES}}/mois**, sans frais de dossier.$r$, $f$tout inclus dès **1 370 CHF/mois**, sans frais de dossier.$f$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($r$tout inclus dès **{{PRIX_DES}}/mois**, sans frais de dossier.$r$ IN content_fr) > 0
  AND position($f$tout inclus dès **1 370 CHF/mois**, sans frais de dossier.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$rooms from **{{PRIX_DES}}/month** across 3 houses$r$, $f$rooms from **CHF 1,370/month** across 3 houses$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$rooms from **{{PRIX_DES}}/month** across 3 houses$r$ IN content_en) > 0
  AND position($f$rooms from **CHF 1,370/month** across 3 houses$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons$r$, $f$tout inclus dès **1 370 CHF/mois** dans 3 maisons$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons$r$ IN content_fr) > 0
  AND position($f$tout inclus dès **1 370 CHF/mois** dans 3 maisons$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$- Price: from {{PRIX_DES}}/month all-inclusive$r$, $f$- Price: from CHF 1,370/month all-inclusive$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$- Price: from {{PRIX_DES}}/month all-inclusive$r$ IN content_en) > 0
  AND position($f$- Price: from CHF 1,370/month all-inclusive$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$- Prix : dès {{PRIX_DES}}/mois tout compris$r$, $f$- Prix : dès 1 370 CHF/mois tout compris$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$- Prix : dès {{PRIX_DES}}/mois tout compris$r$ IN content_fr) > 0
  AND position($f$- Prix : dès 1 370 CHF/mois tout compris$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$- **Budget**: from {{PRIX_DES}} all-inclusive$r$, $f$- **Budget**: from CHF 1,370 all-inclusive$f$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($r$- **Budget**: from {{PRIX_DES}} all-inclusive$r$ IN content_en) > 0
  AND position($f$- **Budget**: from CHF 1,370 all-inclusive$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$- **Budget** : dès {{PRIX_DES}} tout compris$r$, $f$- **Budget** : dès 1 370 CHF tout compris$f$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($r$- **Budget** : dès {{PRIX_DES}} tout compris$r$ IN content_fr) > 0
  AND position($f$- **Budget** : dès 1 370 CHF tout compris$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$it's from {{PRIX_DES}} per month, all-inclusive$r$, $f$it's from CHF 1,370 per month, all-inclusive$f$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($r$it's from {{PRIX_DES}} per month, all-inclusive$r$ IN content_en) > 0
  AND position($f$it's from CHF 1,370 per month, all-inclusive$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$c'est dès {{PRIX_DES}} par mois, tout compris$r$, $f$c'est dès 1 370 CHF par mois, tout compris$f$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($r$c'est dès {{PRIX_DES}} par mois, tout compris$r$ IN content_fr) > 0
  AND position($f$c'est dès 1 370 CHF par mois, tout compris$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$all-inclusive from **{{PRIX_DES}}/month**, no application fee.$r$, $f$all-inclusive from **CHF 1,370/month**, no application fee.$f$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($r$all-inclusive from **{{PRIX_DES}}/month**, no application fee.$r$ IN content_en) > 0
  AND position($f$all-inclusive from **CHF 1,370/month**, no application fee.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$tout inclus dès **{{PRIX_DES}}/mois**, sans frais de dossier.$r$, $f$tout inclus dès **1 370 CHF/mois**, sans frais de dossier.$f$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($r$tout inclus dès **{{PRIX_DES}}/mois**, sans frais de dossier.$r$ IN content_fr) > 0
  AND position($f$tout inclus dès **1 370 CHF/mois**, sans frais de dossier.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**All inclusive from {{PRIX_DES}} per month**$r$, $f$**All inclusive from CHF 1,370 per month**$f$),
    updated_at = now()
WHERE slug = 'coliving-communaute-reels-amis-geneve-annemasse'
  AND position($r$**All inclusive from {{PRIX_DES}} per month**$r$ IN content_en) > 0
  AND position($f$**All inclusive from CHF 1,370 per month**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$**Tout inclus dès {{PRIX_DES}} par mois**$r$, $f$**Tout inclus dès 1 370 CHF par mois**$f$),
    updated_at = now()
WHERE slug = 'coliving-communaute-reels-amis-geneve-annemasse'
  AND position($r$**Tout inclus dès {{PRIX_DES}} par mois**$r$ IN content_fr) > 0
  AND position($f$**Tout inclus dès 1 370 CHF par mois**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$rooms from **{{PRIX_DES}}/month** across 3 houses$r$, $f$rooms from **CHF 1,370/month** across 3 houses$f$),
    updated_at = now()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages'
  AND position($r$rooms from **{{PRIX_DES}}/month** across 3 houses$r$ IN content_en) > 0
  AND position($f$rooms from **CHF 1,370/month** across 3 houses$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons$r$, $f$tout inclus dès **1 370 CHF/mois** dans 3 maisons$f$),
    updated_at = now()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages'
  AND position($r$tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons$r$ IN content_fr) > 0
  AND position($f$tout inclus dès **1 370 CHF/mois** dans 3 maisons$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Coliving, from {{PRIX_DES}}, is very comfortable$r$, $f$Coliving, from 1,370 CHF, is very comfortable$f$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($r$Coliving, from {{PRIX_DES}}, is very comfortable$r$ IN content_en) > 0
  AND position($f$Coliving, from 1,370 CHF, is very comfortable$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Le coliving, dès {{PRIX_DES}}, est très confortable$r$, $f$Le coliving, dès 1 370 CHF, est très confortable$f$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($r$Le coliving, dès {{PRIX_DES}}, est très confortable$r$ IN content_fr) > 0
  AND position($f$Le coliving, dès 1 370 CHF, est très confortable$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Coliving, from {{PRIX_DES}}, is tight$r$, $f$Coliving, from 1,370 CHF, is tight$f$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($r$Coliving, from {{PRIX_DES}}, is tight$r$ IN content_en) > 0
  AND position($f$Coliving, from 1,370 CHF, is tight$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Le coliving, dès {{PRIX_DES}}, est serré$r$, $f$Le coliving, dès 1 370 CHF, est serré$f$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($r$Le coliving, dès {{PRIX_DES}}, est serré$r$ IN content_fr) > 0
  AND position($f$Le coliving, dès 1 370 CHF, est serré$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$costs from **{{PRIX_DES}}/month**$r$, $f$costs from **CHF 1,370/month**$f$),
    updated_at = now()
WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties'
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) > 0
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$, $f$coûte à partir de **1 370 CHF/mois**$f$),
    updated_at = now()
WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties'
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) > 0
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$costs from **{{PRIX_DES}}/month**$r$, $f$costs from **CHF 1,370/month**$f$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) > 0
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$, $f$coûte à partir de **1 370 CHF/mois**$f$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) > 0
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$costs from **{{PRIX_DES}}/month**$r$, $f$costs from **CHF 1,370/month**$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) > 0
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$, $f$coûte à partir de **1 370 CHF/mois**$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) > 0
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$costs from **{{PRIX_DES}}/month**$r$, $f$costs from **CHF 1,370/month**$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) > 0
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$, $f$coûte à partir de **1 370 CHF/mois**$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) > 0
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$costs from **{{PRIX_DES}}/month**$r$, $f$costs from **CHF 1,370/month**$f$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) > 0
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$, $f$coûte à partir de **1 370 CHF/mois**$f$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) > 0
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$costs from **{{PRIX_DES}}/month**$r$, $f$costs from **CHF 1,370/month**$f$),
    updated_at = now()
WHERE slug = 'se-faire-reseau-geneve-arriver-seul'
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) > 0
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$, $f$coûte à partir de **1 370 CHF/mois**$f$),
    updated_at = now()
WHERE slug = 'se-faire-reseau-geneve-arriver-seul'
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) > 0
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$costs from **{{PRIX_DES}}/month**$r$, $f$costs from **CHF 1,370/month**$f$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) > 0
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$, $f$coûte à partir de **1 370 CHF/mois**$f$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) > 0
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$costs from **{{PRIX_DES}}/month**$r$, $f$costs from **CHF 1,370/month**$f$),
    updated_at = now()
WHERE slug = 'quitter-son-logement-guide-pratique'
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) > 0
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$, $f$coûte à partir de **1 370 CHF/mois**$f$),
    updated_at = now()
WHERE slug = 'quitter-son-logement-guide-pratique'
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) > 0
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$costs from **{{PRIX_DES}}/month**$r$, $f$costs from **CHF 1,370/month**$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) > 0
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$, $f$coûte à partir de **1 370 CHF/mois**$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) > 0
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$costs from **{{PRIX_DES}}/month**$r$, $f$costs from **CHF 1,370/month**$f$),
    updated_at = now()
WHERE slug = 'permis-g-frontalier-geneve'
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) > 0
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$, $f$coûte à partir de **1 370 CHF/mois**$f$),
    updated_at = now()
WHERE slug = 'permis-g-frontalier-geneve'
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) > 0
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$costs from **{{PRIX_DES}}/month**$r$, $f$costs from **CHF 1,370/month**$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) > 0
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$, $f$coûte à partir de **1 370 CHF/mois**$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) > 0
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$costs from **{{PRIX_DES}}/month**$r$, $f$costs from **CHF 1,370/month**$f$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) > 0
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$, $f$coûte à partir de **1 370 CHF/mois**$f$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) > 0
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$costs from **{{PRIX_DES}}/month**$r$, $f$costs from **CHF 1,370/month**$f$),
    updated_at = now()
WHERE slug = 'optimiser-espace-coliving-productivite-bien-etre'
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) > 0
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$, $f$coûte à partir de **1 370 CHF/mois**$f$),
    updated_at = now()
WHERE slug = 'optimiser-espace-coliving-productivite-bien-etre'
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) > 0
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$costs from **{{PRIX_DES}}/month**$r$, $f$costs from **CHF 1,370/month**$f$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) > 0
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$, $f$coûte à partir de **1 370 CHF/mois**$f$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) > 0
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$costs from **{{PRIX_DES}}/month**$r$, $f$costs from **CHF 1,370/month**$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) > 0
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$, $f$coûte à partir de **1 370 CHF/mois**$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) > 0
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$costs from **{{PRIX_DES}}/month**$r$, $f$costs from **CHF 1,370/month**$f$),
    updated_at = now()
WHERE slug = 'grand-geneve-2026-nouveautes-frontaliers'
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) > 0
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$, $f$coûte à partir de **1 370 CHF/mois**$f$),
    updated_at = now()
WHERE slug = 'grand-geneve-2026-nouveautes-frontaliers'
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) > 0
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$costs from **{{PRIX_DES}}/month**$r$, $f$costs from **CHF 1,370/month**$f$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) > 0
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$, $f$coûte à partir de **1 370 CHF/mois**$f$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) > 0
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$costs from **{{PRIX_DES}}/month**$r$, $f$costs from **CHF 1,370/month**$f$),
    updated_at = now()
WHERE slug = 'espaces-verts-coliving-lodge-annemasse'
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) > 0
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$, $f$coûte à partir de **1 370 CHF/mois**$f$),
    updated_at = now()
WHERE slug = 'espaces-verts-coliving-lodge-annemasse'
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) > 0
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$costs from **{{PRIX_DES}}/month**$r$, $f$costs from **CHF 1,370/month**$f$),
    updated_at = now()
WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) > 0
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$, $f$coûte à partir de **1 370 CHF/mois**$f$),
    updated_at = now()
WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) > 0
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$costs from **{{PRIX_DES}}/month**$r$, $f$costs from **CHF 1,370/month**$f$),
    updated_at = now()
WHERE slug = 'declaration-impots-frontalier-2026'
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) > 0
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$, $f$coûte à partir de **1 370 CHF/mois**$f$),
    updated_at = now()
WHERE slug = 'declaration-impots-frontalier-2026'
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) > 0
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$costs from **{{PRIX_DES}}/month**$r$, $f$costs from **CHF 1,370/month**$f$),
    updated_at = now()
WHERE slug = 'cout-transport-frontalier-geneve-2026'
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) > 0
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$, $f$coûte à partir de **1 370 CHF/mois**$f$),
    updated_at = now()
WHERE slug = 'cout-transport-frontalier-geneve-2026'
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) > 0
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$costs from **{{PRIX_DES}}/month**$r$, $f$costs from **CHF 1,370/month**$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) > 0
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$, $f$coûte à partir de **1 370 CHF/mois**$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) > 0
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$costs from **{{PRIX_DES}}/month**$r$, $f$costs from **CHF 1,370/month**$f$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) > 0
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$, $f$coûte à partir de **1 370 CHF/mois**$f$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) > 0
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$costs from **{{PRIX_DES}}/month**$r$, $f$costs from **CHF 1,370/month**$f$),
    updated_at = now()
WHERE slug = 'coliving-frais-dossier-geneve-annemasse'
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) > 0
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$, $f$coûte à partir de **1 370 CHF/mois**$f$),
    updated_at = now()
WHERE slug = 'coliving-frais-dossier-geneve-annemasse'
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) > 0
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$costs from **{{PRIX_DES}}/month**$r$, $f$costs from **CHF 1,370/month**$f$),
    updated_at = now()
WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve'
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) > 0
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$, $f$coûte à partir de **1 370 CHF/mois**$f$),
    updated_at = now()
WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve'
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) > 0
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$costs from **{{PRIX_DES}}/month**$r$, $f$costs from **CHF 1,370/month**$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) > 0
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$, $f$coûte à partir de **1 370 CHF/mois**$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) > 0
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$costs from **{{PRIX_DES}}/month**$r$, $f$costs from **CHF 1,370/month**$f$),
    updated_at = now()
WHERE slug = 'banque-telephone-internet-frontalier-bons-plans'
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) > 0
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$, $f$coûte à partir de **1 370 CHF/mois**$f$),
    updated_at = now()
WHERE slug = 'banque-telephone-internet-frontalier-bons-plans'
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) > 0
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$costs from **{{PRIX_DES}}/month**$r$, $f$costs from **CHF 1,370/month**$f$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) > 0
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$, $f$coûte à partir de **1 370 CHF/mois**$f$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) > 0
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$costs from **{{PRIX_DES}}/month**$r$, $f$costs from **CHF 1,370/month**$f$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) > 0
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$, $f$coûte à partir de **1 370 CHF/mois**$f$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) > 0
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$costs from **{{PRIX_DES}}/month**$r$, $f$costs from **CHF 1,370/month**$f$),
    updated_at = now()
WHERE slug = 'allocations-familiales-frontalier-geneve-2026'
  AND position($r$costs from **{{PRIX_DES}}/month**$r$ IN content_en) > 0
  AND position($f$costs from **CHF 1,370/month**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$coûte à partir de **{{PRIX_DES}}/mois**$r$, $f$coûte à partir de **1 370 CHF/mois**$f$),
    updated_at = now()
WHERE slug = 'allocations-familiales-frontalier-geneve-2026'
  AND position($r$coûte à partir de **{{PRIX_DES}}/mois**$r$ IN content_fr) > 0
  AND position($f$coûte à partir de **1 370 CHF/mois**$f$ IN content_fr) = 0;

COMMIT;
*/
