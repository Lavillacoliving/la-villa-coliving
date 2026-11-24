-- ============================================================================
-- « Programmer une visite » hors du site — lot 2 (articles du blog, plan du 24/11/2026, § 2 et annexe A) : appels à agir vers le formulaire, RÈGLE A SEULEMENT (décision de Jérôme du 24/11/2026)
-- Généré le 2026-11-24T18:16:54.421Z par scripts/build-slots-sql.mjs depuis scripts/visite-articles.edits.mjs
--   · textes insérés = mots du site (« Programmer une visite », « Demande ta visite (2 min) », « la demande de visite prend… » ; EN « Book a visit », « Request your visit ») ; adresses des liens inchangées (plan PLAN_visite_email-articles-bot-n8n_2026-11-24.md § 2 et annexe A, règle A seulement)
--   · ancres vérifiées sur le contenu vivant de blog_posts (REST anon, lecture seule) le 2026-11-24T18:16:54.414Z : exactement 1 occurrence de chaque ancien texte, nouveau texte absent
-- À appliquer sur GO de Jérôme, dans la séance SQL des lots 2 et 3 (articles puis bot), AVANT le push de la PR (pages de décision : mêmes phrases dans content/decision-pages), hors passage du robot du prérendu. Forme de séance (un seul appel, 100 % ASCII, gardes md5) : scripts/visite-articles-2026-11-24.seance.sql.
-- Idempotent : chaque UPDATE est gardé par position(ancien) > 0 [AND position(nouveau) = 0 quand le nouveau texte n'est pas un fragment de l'ancien] — relancer le fichier est sans effet.
-- Fichier UTF-8 : il contient des tirets cadratins (« — »), des flèches (« → ») et des accents — ne pas le faire transiter par un éditeur qui normalise les caractères. Aucune espace insécable dans ces phrases.
-- 75 modifications · 33 articles · état en base à la génération (updated_at · longueur fr / en) :
--   arnaques-logement-frontalier-geneve-eviter · 2026-11-19T11:57:43.20886+00:00 · 12660 / 11495
--   assurance-sante-frontalier-lamal-cmu-budget · 2026-11-19T14:26:48.508096+00:00 · 9602 / 9054
--   banque-telephone-internet-frontalier-bons-plans · 2026-11-19T11:57:43.20886+00:00 · 10157 / 9417
--   budget-colocation-geneve-guide-complet · 2026-11-24T16:58:38.684155+00:00 · 25344 / 21220
--   choc-culturel-franco-suisse-expatrie-geneve · 2026-11-21T10:21:32.19045+00:00 · 10976 / 10315
--   coliving-annemasse-geneve-frontaliers-avantages · 2026-11-21T10:21:32.19045+00:00 · 12737 / 11876
--   coliving-colocation-ou-studio-geneve-comparatif · 2026-11-22T08:32:50.079676+00:00 · 14350 / 13863
--   coliving-communaute-reels-amis-geneve-annemasse · 2026-11-24T16:58:24.279782+00:00 · 11078 / 9701
--   coliving-frais-dossier-geneve-annemasse · 2026-11-19T11:57:43.20886+00:00 · 8230 / 7318
--   coliving-transfrontalier-geneve-annemasse-nouvelle-vie · 2026-11-19T14:27:12.782459+00:00 · 3927 / 3806
--   colocation-annemasse-ville-la-grand-ambilly · 2026-11-21T10:21:32.19045+00:00 · 9097 / 8176
--   cout-transport-frontalier-geneve-2026 · 2026-11-19T11:57:43.20886+00:00 · 9119 / 8491
--   dossier-location-frontalier-suisse-france · 2026-11-20T14:12:50.186527+00:00 · 9077 / 8422
--   espaces-verts-coliving-lodge-annemasse · 2026-11-19T11:57:43.20886+00:00 · 3544 / 3259
--   fiscalite-frontalier-geneve-impots-2026 · 2026-11-20T09:56:59.747586+00:00 · 10727 / 10068
--   grand-geneve-2026-nouveautes-frontaliers · 2026-11-19T11:57:43.20886+00:00 · 8679 / 7512
--   guide-ressources-frontalier-geneve · 2026-11-24T16:58:24.279782+00:00 · 40524 / 37361
--   ia-solitude-lien-social-coliving · 2026-11-19T14:31:10.186085+00:00 · 11865 / 11130
--   living-in-france-working-in-geneva · 2026-11-21T10:21:32.19045+00:00 · 17699 / 16057
--   lodge-annemasse-coliving-premium-portes-geneve · 2026-11-24T16:58:24.279782+00:00 · 15231 / 13561
--   non-la-villa-coliving-nest-pas-une-arnaque · 2026-10-16T12:42:59.833452+00:00 · 5580 / 5127
--   organisations-internationales-geneve-ou-habiter · 2026-11-20T09:56:59.747586+00:00 · 7456 / 6834
--   ou-habiter-en-france-quand-on-travaille-a-geneve · 2026-11-21T10:21:32.19045+00:00 · 15249 / 15080
--   ou-habiter-frontalier-suisse-villes-france-pas-cher · 2026-11-12T14:46:34.264977+00:00 · 15422 / 15423
--   salaire-suisse-net-frontalier-2026 · 2026-11-20T09:56:59.747586+00:00 · 13933 / 11230
--   se-faire-reseau-geneve-arriver-seul · 2026-11-19T16:37:46.768178+00:00 · 10722 / 9684
--   teletravail-frontalier-geneve-regles-2026 · 2026-11-19T11:57:43.20886+00:00 · 11728 / 10836
--   temps-trajet-annemasse-geneve-par-quartier · 2026-11-21T10:21:32.19045+00:00 · 9241 / 8630
--   transport-annemasse-geneve-leman-express · 2026-11-19T11:57:43.20886+00:00 · 8452 / 7409
--   trouver-colocation-geneve-frontalier · 2026-11-21T10:21:32.19045+00:00 · 6303 / 5893
--   trouver-logement-avant-d-arriver-geneve · 2026-11-20T09:56:59.747586+00:00 · 14608 / 14109
--   vie-quotidienne-frontalier-courses-sport-sorties · 2026-11-19T11:57:43.20886+00:00 · 9468 / 8722
--   vivre-a-annemasse-quand-on-travaille-a-geneve · 2026-11-12T21:48:49.13221+00:00 · 12791 / 12488
-- ============================================================================

BEGIN;

-- [1/75] arnaques-logement-frontalier-geneve-eviter (fr) · A · annexe A n° 1 · encadré final : « Candidate chez La Villa Coliving » → « Programme une visite chez La Villa Coliving », sur place ou en vidéo
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[Candidate chez La Villa Coliving](/candidature) — visite sur place, bail légal, zéro mauvaise surprise.$f$, $r$[Programme une visite chez La Villa Coliving](/candidature) — sur place ou en vidéo, bail légal, zéro mauvaise surprise.$r$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($f$[Candidate chez La Villa Coliving](/candidature) — visite sur place, bail légal, zéro mauvaise surprise.$f$ IN content_fr) > 0
  AND position($r$[Programme une visite chez La Villa Coliving](/candidature) — sur place ou en vidéo, bail légal, zéro mauvaise surprise.$r$ IN content_fr) = 0;

-- [2/75] arnaques-logement-frontalier-geneve-eviter (en) · A · appendix A no. 1 · closing box: “Apply to La Villa Coliving” → “Book a visit at La Villa Coliving”, on site or by video
UPDATE blog_posts
SET content_en = replace(content_en, $f$[Apply to La Villa Coliving](/en/candidature) — on-site visits, legal lease, zero nasty surprises.$f$, $r$[Book a visit at La Villa Coliving](/en/candidature) — on site or by video, legal lease, zero nasty surprises.$r$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($f$[Apply to La Villa Coliving](/en/candidature) — on-site visits, legal lease, zero nasty surprises.$f$ IN content_en) > 0
  AND position($r$[Book a visit at La Villa Coliving](/en/candidature) — on site or by video, legal lease, zero nasty surprises.$r$ IN content_en) = 0;

-- [3/75] assurance-sante-frontalier-lamal-cmu-budget (fr) · A · annexe A n° 2 · lien final « postule directement » → « programme une visite »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[postule directement](/candidature)$f$, $r$[programme une visite](/candidature)$r$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($f$[postule directement](/candidature)$f$ IN content_fr) > 0
  AND position($r$[programme une visite](/candidature)$r$ IN content_fr) = 0;

-- [4/75] assurance-sante-frontalier-lamal-cmu-budget (en) · A · appendix A no. 2 · closing link “apply directly” → “book a visit”
UPDATE blog_posts
SET content_en = replace(content_en, $f$[apply directly](/en/candidature)$f$, $r$[book a visit](/en/candidature)$r$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($f$[apply directly](/en/candidature)$f$ IN content_en) > 0
  AND position($r$[book a visit](/en/candidature)$r$ IN content_en) = 0;

-- [5/75] banque-telephone-internet-frontalier-bons-plans (fr) · A · annexe A n° 3 · lien final « candidate ici » → « programme une visite »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[candidate ici](/candidature)$f$, $r$[programme une visite](/candidature)$r$),
    updated_at = now()
WHERE slug = 'banque-telephone-internet-frontalier-bons-plans'
  AND position($f$[candidate ici](/candidature)$f$ IN content_fr) > 0
  AND position($r$[programme une visite](/candidature)$r$ IN content_fr) = 0;

-- [6/75] banque-telephone-internet-frontalier-bons-plans (en) · A · appendix A no. 3 · closing link “apply here” → “book a visit”
UPDATE blog_posts
SET content_en = replace(content_en, $f$[apply here](/en/candidature)$f$, $r$[book a visit](/en/candidature)$r$),
    updated_at = now()
WHERE slug = 'banque-telephone-internet-frontalier-bons-plans'
  AND position($f$[apply here](/en/candidature)$f$ IN content_en) > 0
  AND position($r$[book a visit](/en/candidature)$r$ IN content_en) = 0;

-- [7/75] budget-colocation-geneve-guide-complet (fr) · A · annexe A n° 4 · « candidater dès maintenant pour figurer sur la liste d'attente » → « te manifester dès maintenant… »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$la meilleure stratégie est de candidater dès maintenant pour figurer sur la liste d'attente$f$, $r$la meilleure stratégie est de te manifester dès maintenant pour figurer sur la liste d'attente$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$la meilleure stratégie est de candidater dès maintenant pour figurer sur la liste d'attente$f$ IN content_fr) > 0
  AND position($r$la meilleure stratégie est de te manifester dès maintenant pour figurer sur la liste d'attente$r$ IN content_fr) = 0;

-- [8/75] budget-colocation-geneve-guide-complet (fr) · A · annexe A n° 4 · « dépose ta [candidature en 2 minutes] » → « [demande ta visite en 2 minutes] »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$ou dépose ta [candidature en 2 minutes](https://www.lavillacoliving.com/candidature)$f$, $r$ou [demande ta visite en 2 minutes](https://www.lavillacoliving.com/candidature)$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$ou dépose ta [candidature en 2 minutes](https://www.lavillacoliving.com/candidature)$f$ IN content_fr) > 0
  AND position($r$ou [demande ta visite en 2 minutes](https://www.lavillacoliving.com/candidature)$r$ IN content_fr) = 0;

-- [9/75] budget-colocation-geneve-guide-complet (en) · A · appendix A no. 4 · “apply now to get on the waiting list” → “get in touch now…”
UPDATE blog_posts
SET content_en = replace(content_en, $f$the best strategy is to apply now to get on the waiting list$f$, $r$the best strategy is to get in touch now to get on the waiting list$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$the best strategy is to apply now to get on the waiting list$f$ IN content_en) > 0
  AND position($r$the best strategy is to get in touch now to get on the waiting list$r$ IN content_en) = 0;

-- [10/75] budget-colocation-geneve-guide-complet (en) · A · appendix A no. 4 · “submit your [application in 2 minutes]” → “[request your visit in 2 minutes]”
UPDATE blog_posts
SET content_en = replace(content_en, $f$or submit your [application in 2 minutes](https://www.lavillacoliving.com/en/candidature)$f$, $r$or [request your visit in 2 minutes](https://www.lavillacoliving.com/en/candidature)$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$or submit your [application in 2 minutes](https://www.lavillacoliving.com/en/candidature)$f$ IN content_en) > 0
  AND position($r$or [request your visit in 2 minutes](https://www.lavillacoliving.com/en/candidature)$r$ IN content_en) = 0;

-- [11/75] choc-culturel-franco-suisse-expatrie-geneve (fr) · A · annexe A n° 5 · lien final « candidate ici » → « programme une visite »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[candidate ici](/candidature)$f$, $r$[programme une visite](/candidature)$r$),
    updated_at = now()
WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve'
  AND position($f$[candidate ici](/candidature)$f$ IN content_fr) > 0
  AND position($r$[programme une visite](/candidature)$r$ IN content_fr) = 0;

-- [12/75] choc-culturel-franco-suisse-expatrie-geneve (en) · A · appendix A no. 5 · closing link “apply here” → “book a visit”
UPDATE blog_posts
SET content_en = replace(content_en, $f$[apply here](/en/candidature)$f$, $r$[book a visit](/en/candidature)$r$),
    updated_at = now()
WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve'
  AND position($f$[apply here](/en/candidature)$f$ IN content_en) > 0
  AND position($r$[book a visit](/en/candidature)$r$ IN content_en) = 0;

-- [13/75] coliving-annemasse-geneve-frontaliers-avantages (fr) · A · annexe A n° 6 · « Postule en 2 minutes » → « Demande ta visite en 2 minutes »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[Postule en 2 minutes](/candidature)$f$, $r$[Demande ta visite en 2 minutes](/candidature)$r$),
    updated_at = now()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages'
  AND position($f$[Postule en 2 minutes](/candidature)$f$ IN content_fr) > 0
  AND position($r$[Demande ta visite en 2 minutes](/candidature)$r$ IN content_fr) = 0;

-- [14/75] coliving-annemasse-geneve-frontaliers-avantages (en) · A · appendix A no. 6 · “Apply in 2 minutes” → “Request your visit in 2 minutes”
UPDATE blog_posts
SET content_en = replace(content_en, $f$[Apply in 2 minutes](/en/candidature)$f$, $r$[Request your visit in 2 minutes](/en/candidature)$r$),
    updated_at = now()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages'
  AND position($f$[Apply in 2 minutes](/en/candidature)$f$ IN content_en) > 0
  AND position($r$[Request your visit in 2 minutes](/en/candidature)$r$ IN content_en) = 0;

-- [15/75] coliving-colocation-ou-studio-geneve-comparatif (fr) · A · annexe A n° 7 (1/3) · verdict « nouveau job » : « candidature en deux minutes » → « demande en deux minutes »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$pas dans un magasin de meubles : candidature en deux minutes, réponse sous 48 h$f$, $r$pas dans un magasin de meubles : demande en deux minutes, réponse sous 48 h$r$),
    updated_at = now()
WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif'
  AND position($f$pas dans un magasin de meubles : candidature en deux minutes, réponse sous 48 h$f$ IN content_fr) > 0
  AND position($r$pas dans un magasin de meubles : demande en deux minutes, réponse sous 48 h$r$ IN content_fr) = 0;

-- [16/75] coliving-colocation-ou-studio-geneve-comparatif (fr) · A · annexe A n° 7 (2/3) · lien « candidature en deux minutes » → « demande en deux minutes »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[candidature en deux minutes](/candidature)$f$, $r$[demande en deux minutes](/candidature)$r$),
    updated_at = now()
WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif'
  AND position($f$[candidature en deux minutes](/candidature)$f$ IN content_fr) > 0
  AND position($r$[demande en deux minutes](/candidature)$r$ IN content_fr) = 0;

-- [17/75] coliving-colocation-ou-studio-geneve-comparatif (fr) · A · annexe A n° 7 (3/3) · FAQ « 72 h » : « candidature en deux minutes » → « demande en deux minutes »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$si une chambre est disponible : candidature en deux minutes, réponse sous 48 h$f$, $r$si une chambre est disponible : demande en deux minutes, réponse sous 48 h$r$),
    updated_at = now()
WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif'
  AND position($f$si une chambre est disponible : candidature en deux minutes, réponse sous 48 h$f$ IN content_fr) > 0
  AND position($r$si une chambre est disponible : demande en deux minutes, réponse sous 48 h$r$ IN content_fr) = 0;

-- [18/75] coliving-colocation-ou-studio-geneve-comparatif (en) · A · appendix A no. 7 (1/3) · “new job” verdict: “a two-minute application” → “a two-minute request”
UPDATE blog_posts
SET content_en = replace(content_en, $f$not in a furniture store: a two-minute application, a reply within 48 h$f$, $r$not in a furniture store: a two-minute request, a reply within 48 h$r$),
    updated_at = now()
WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif'
  AND position($f$not in a furniture store: a two-minute application, a reply within 48 h$f$ IN content_en) > 0
  AND position($r$not in a furniture store: a two-minute request, a reply within 48 h$r$ IN content_en) = 0;

-- [19/75] coliving-colocation-ou-studio-geneve-comparatif (en) · A · appendix A no. 7 (2/3) · link “a two-minute application” → “a two-minute request”
UPDATE blog_posts
SET content_en = replace(content_en, $f$[a two-minute application](/en/candidature)$f$, $r$[a two-minute request](/en/candidature)$r$),
    updated_at = now()
WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif'
  AND position($f$[a two-minute application](/en/candidature)$f$ IN content_en) > 0
  AND position($r$[a two-minute request](/en/candidature)$r$ IN content_en) = 0;

-- [20/75] coliving-colocation-ou-studio-geneve-comparatif (en) · A · appendix A no. 7 (3/3) · “72 h” FAQ: “a two-minute application” → “a two-minute request”
UPDATE blog_posts
SET content_en = replace(content_en, $f$if a room is available: a two-minute application, a reply within 48 h$f$, $r$if a room is available: a two-minute request, a reply within 48 h$r$),
    updated_at = now()
WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif'
  AND position($f$if a room is available: a two-minute application, a reply within 48 h$f$ IN content_en) > 0
  AND position($r$if a room is available: a two-minute request, a reply within 48 h$r$ IN content_en) = 0;

-- [21/75] coliving-communaute-reels-amis-geneve-annemasse (fr) · A · annexe A n° 8 · « Candidate dès maintenant » → « Programme une visite dès maintenant »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[Candidate dès maintenant](/candidature)$f$, $r$[Programme une visite dès maintenant](/candidature)$r$),
    updated_at = now()
WHERE slug = 'coliving-communaute-reels-amis-geneve-annemasse'
  AND position($f$[Candidate dès maintenant](/candidature)$f$ IN content_fr) > 0
  AND position($r$[Programme une visite dès maintenant](/candidature)$r$ IN content_fr) = 0;

-- [22/75] coliving-communaute-reels-amis-geneve-annemasse (en) · A · appendix A no. 8 · “Apply now” → “Book a visit now”
UPDATE blog_posts
SET content_en = replace(content_en, $f$[Apply now](/en/candidature)$f$, $r$[Book a visit now](/en/candidature)$r$),
    updated_at = now()
WHERE slug = 'coliving-communaute-reels-amis-geneve-annemasse'
  AND position($f$[Apply now](/en/candidature)$f$ IN content_en) > 0
  AND position($r$[Book a visit now](/en/candidature)$r$ IN content_en) = 0;

-- [23/75] coliving-frais-dossier-geneve-annemasse (fr) · A · annexe A n° 9 · « candidate en 2 minutes, gratuitement » → « demande ta visite en 2 minutes, gratuitement »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[candidate en 2 minutes, gratuitement](/candidature)$f$, $r$[demande ta visite en 2 minutes, gratuitement](/candidature)$r$),
    updated_at = now()
WHERE slug = 'coliving-frais-dossier-geneve-annemasse'
  AND position($f$[candidate en 2 minutes, gratuitement](/candidature)$f$ IN content_fr) > 0
  AND position($r$[demande ta visite en 2 minutes, gratuitement](/candidature)$r$ IN content_fr) = 0;

-- [24/75] coliving-frais-dossier-geneve-annemasse (en) · A · appendix A no. 9 · “apply in 2 minutes, for free” → “request your visit in 2 minutes, for free”
UPDATE blog_posts
SET content_en = replace(content_en, $f$[apply in 2 minutes, for free](/en/candidature)$f$, $r$[request your visit in 2 minutes, for free](/en/candidature)$r$),
    updated_at = now()
WHERE slug = 'coliving-frais-dossier-geneve-annemasse'
  AND position($f$[apply in 2 minutes, for free](/en/candidature)$f$ IN content_en) > 0
  AND position($r$[request your visit in 2 minutes, for free](/en/candidature)$r$ IN content_en) = 0;

-- [25/75] coliving-transfrontalier-geneve-annemasse-nouvelle-vie (fr) · A · annexe A n° 10 · « Postule en 2 minutes » → « Demande ta visite en 2 minutes »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[Postule en 2 minutes](/candidature)$f$, $r$[Demande ta visite en 2 minutes](/candidature)$r$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($f$[Postule en 2 minutes](/candidature)$f$ IN content_fr) > 0
  AND position($r$[Demande ta visite en 2 minutes](/candidature)$r$ IN content_fr) = 0;

-- [26/75] coliving-transfrontalier-geneve-annemasse-nouvelle-vie (en) · A · appendix A no. 10 · “Apply in 2 minutes” → “Request your visit in 2 minutes”
UPDATE blog_posts
SET content_en = replace(content_en, $f$[Apply in 2 minutes](/en/candidature)$f$, $r$[Request your visit in 2 minutes](/en/candidature)$r$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($f$[Apply in 2 minutes](/en/candidature)$f$ IN content_en) > 0
  AND position($r$[Request your visit in 2 minutes](/en/candidature)$r$ IN content_en) = 0;

-- [27/75] colocation-annemasse-ville-la-grand-ambilly (fr) · A · annexe A n° 11 · « Candidate en 2 minutes → » → « Demande ta visite en 2 minutes → »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[Candidate en 2 minutes →](/candidature)$f$, $r$[Demande ta visite en 2 minutes →](/candidature)$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$[Candidate en 2 minutes →](/candidature)$f$ IN content_fr) > 0
  AND position($r$[Demande ta visite en 2 minutes →](/candidature)$r$ IN content_fr) = 0;

-- [28/75] cout-transport-frontalier-geneve-2026 (fr) · A · annexe A n° 12 · « postule en 2 minutes » → « demande ta visite en 2 minutes »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[postule en 2 minutes](/candidature)$f$, $r$[demande ta visite en 2 minutes](/candidature)$r$),
    updated_at = now()
WHERE slug = 'cout-transport-frontalier-geneve-2026'
  AND position($f$[postule en 2 minutes](/candidature)$f$ IN content_fr) > 0
  AND position($r$[demande ta visite en 2 minutes](/candidature)$r$ IN content_fr) = 0;

-- [29/75] cout-transport-frontalier-geneve-2026 (en) · A · appendix A no. 12 · “apply in 2 minutes” → “request your visit in 2 minutes”
UPDATE blog_posts
SET content_en = replace(content_en, $f$[apply in 2 minutes](/en/candidature)$f$, $r$[request your visit in 2 minutes](/en/candidature)$r$),
    updated_at = now()
WHERE slug = 'cout-transport-frontalier-geneve-2026'
  AND position($f$[apply in 2 minutes](/en/candidature)$f$ IN content_en) > 0
  AND position($r$[request your visit in 2 minutes](/en/candidature)$r$ IN content_en) = 0;

-- [30/75] dossier-location-frontalier-suisse-france (fr) · A · annexe A n° 13 · « Candidate chez La Villa Coliving » → « Programme une visite chez La Villa Coliving »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[Candidate chez La Villa Coliving](/candidature)$f$, $r$[Programme une visite chez La Villa Coliving](/candidature)$r$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($f$[Candidate chez La Villa Coliving](/candidature)$f$ IN content_fr) > 0
  AND position($r$[Programme une visite chez La Villa Coliving](/candidature)$r$ IN content_fr) = 0;

-- [31/75] dossier-location-frontalier-suisse-france (en) · A · appendix A no. 13 · “Apply to La Villa Coliving” → “Book a visit at La Villa Coliving”
UPDATE blog_posts
SET content_en = replace(content_en, $f$[Apply to La Villa Coliving](/en/candidature)$f$, $r$[Book a visit at La Villa Coliving](/en/candidature)$r$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($f$[Apply to La Villa Coliving](/en/candidature)$f$ IN content_en) > 0
  AND position($r$[Book a visit at La Villa Coliving](/en/candidature)$r$ IN content_en) = 0;

-- [32/75] espaces-verts-coliving-lodge-annemasse (fr) · A · annexe A n° 14 · « postule en 2 minutes » → « demande ta visite en 2 minutes »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[postule en 2 minutes](/candidature)$f$, $r$[demande ta visite en 2 minutes](/candidature)$r$),
    updated_at = now()
WHERE slug = 'espaces-verts-coliving-lodge-annemasse'
  AND position($f$[postule en 2 minutes](/candidature)$f$ IN content_fr) > 0
  AND position($r$[demande ta visite en 2 minutes](/candidature)$r$ IN content_fr) = 0;

-- [33/75] espaces-verts-coliving-lodge-annemasse (en) · A · appendix A no. 14 · “apply in 2 minutes” → “request your visit in 2 minutes”
UPDATE blog_posts
SET content_en = replace(content_en, $f$[apply in 2 minutes](/en/candidature)$f$, $r$[request your visit in 2 minutes](/en/candidature)$r$),
    updated_at = now()
WHERE slug = 'espaces-verts-coliving-lodge-annemasse'
  AND position($f$[apply in 2 minutes](/en/candidature)$f$ IN content_en) > 0
  AND position($r$[request your visit in 2 minutes](/en/candidature)$r$ IN content_en) = 0;

-- [34/75] fiscalite-frontalier-geneve-impots-2026 (fr) · A · annexe A n° 15 · « dépose ta [candidature] » → « [programme une visite] »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$ou dépose ta [candidature](/candidature)$f$, $r$ou [programme une visite](/candidature)$r$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($f$ou dépose ta [candidature](/candidature)$f$ IN content_fr) > 0
  AND position($r$ou [programme une visite](/candidature)$r$ IN content_fr) = 0;

-- [35/75] fiscalite-frontalier-geneve-impots-2026 (en) · A · appendix A no. 15 · “submit your [application]” → “[book a visit]”
UPDATE blog_posts
SET content_en = replace(content_en, $f$or submit your [application](/en/candidature)$f$, $r$or [book a visit](/en/candidature)$r$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($f$or submit your [application](/en/candidature)$f$ IN content_en) > 0
  AND position($r$or [book a visit](/en/candidature)$r$ IN content_en) = 0;

-- [36/75] grand-geneve-2026-nouveautes-frontaliers (fr) · A · annexe A n° 16 · « Candidate en 2 minutes → » → « Demande ta visite en 2 minutes → »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[Candidate en 2 minutes →](/candidature)$f$, $r$[Demande ta visite en 2 minutes →](/candidature)$r$),
    updated_at = now()
WHERE slug = 'grand-geneve-2026-nouveautes-frontaliers'
  AND position($f$[Candidate en 2 minutes →](/candidature)$f$ IN content_fr) > 0
  AND position($r$[Demande ta visite en 2 minutes →](/candidature)$r$ IN content_fr) = 0;

-- [37/75] guide-ressources-frontalier-geneve (fr) · A · annexe A n° 17 · « candidate en quelques minutes, gratuitement » → « demande ta visite en quelques minutes, gratuitement »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[candidate en quelques minutes, gratuitement](/candidature)$f$, $r$[demande ta visite en quelques minutes, gratuitement](/candidature)$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$[candidate en quelques minutes, gratuitement](/candidature)$f$ IN content_fr) > 0
  AND position($r$[demande ta visite en quelques minutes, gratuitement](/candidature)$r$ IN content_fr) = 0;

-- [38/75] guide-ressources-frontalier-geneve (en) · A · appendix A no. 17 · “apply in a few minutes, for free” → “request your visit in a few minutes, for free” (URL unchanged)
UPDATE blog_posts
SET content_en = replace(content_en, $f$[apply in a few minutes, for free](/candidature)$f$, $r$[request your visit in a few minutes, for free](/candidature)$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$[apply in a few minutes, for free](/candidature)$f$ IN content_en) > 0
  AND position($r$[request your visit in a few minutes, for free](/candidature)$r$ IN content_en) = 0;

-- [39/75] ia-solitude-lien-social-coliving (fr) · A · annexe A n° 18 · « candidate en ligne » → « demande une visite en ligne »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[candidate en ligne](/candidature)$f$, $r$[demande une visite en ligne](/candidature)$r$),
    updated_at = now()
WHERE slug = 'ia-solitude-lien-social-coliving'
  AND position($f$[candidate en ligne](/candidature)$f$ IN content_fr) > 0
  AND position($r$[demande une visite en ligne](/candidature)$r$ IN content_fr) = 0;

-- [40/75] ia-solitude-lien-social-coliving (en) · A · appendix A no. 18 · “apply online” → “book a visit online”
UPDATE blog_posts
SET content_en = replace(content_en, $f$[apply online](/en/candidature)$f$, $r$[book a visit online](/en/candidature)$r$),
    updated_at = now()
WHERE slug = 'ia-solitude-lien-social-coliving'
  AND position($f$[apply online](/en/candidature)$f$ IN content_en) > 0
  AND position($r$[book a visit online](/en/candidature)$r$ IN content_en) = 0;

-- [41/75] living-in-france-working-in-geneva (fr) · A · annexe A n° 19 · « Candidate en 2 minutes → » → « Demande ta visite en 2 minutes → »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[Candidate en 2 minutes →](/candidature)$f$, $r$[Demande ta visite en 2 minutes →](/candidature)$r$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($f$[Candidate en 2 minutes →](/candidature)$f$ IN content_fr) > 0
  AND position($r$[Demande ta visite en 2 minutes →](/candidature)$r$ IN content_fr) = 0;

-- [42/75] lodge-annemasse-coliving-premium-portes-geneve (fr) · A · annexe A n° 20 · étape 1 : « Tu remplis le [formulaire de candidature]… ton profil… » → « Tu [demandes ta visite en ligne] : prénom, nom, email et téléphone, deux minutes. » (champs obligatoires du formulaire)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Tu remplis le [formulaire de candidature](/candidature) en ligne en présentant ton profil, ta situation professionnelle et tes attentes vis-à-vis de la vie en coliving.$f$, $r$Tu [demandes ta visite en ligne](/candidature) : prénom, nom, email et téléphone, deux minutes.$r$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($f$Tu remplis le [formulaire de candidature](/candidature) en ligne en présentant ton profil, ta situation professionnelle et tes attentes vis-à-vis de la vie en coliving.$f$ IN content_fr) > 0
  AND position($r$Tu [demandes ta visite en ligne](/candidature) : prénom, nom, email et téléphone, deux minutes.$r$ IN content_fr) = 0;

-- [43/75] lodge-annemasse-coliving-premium-portes-geneve (fr) · A · annexe A n° 20 · conclusion : « [candidate directement] pour vérifier la disponibilité » → « [programme une visite] : on vérifie avec toi les chambres disponibles »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$ou [candidate directement](/candidature) pour vérifier la disponibilité des chambres.$f$, $r$ou [programme une visite](/candidature) : on vérifie avec toi les chambres disponibles.$r$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($f$ou [candidate directement](/candidature) pour vérifier la disponibilité des chambres.$f$ IN content_fr) > 0
  AND position($r$ou [programme une visite](/candidature) : on vérifie avec toi les chambres disponibles.$r$ IN content_fr) = 0;

-- [44/75] lodge-annemasse-coliving-premium-portes-geneve (en) · A · appendix A no. 20 · step 1: “You fill in the online [application form] presenting your profile…” → “You [book your visit online]: first name, last name, email and phone, two minutes.”
UPDATE blog_posts
SET content_en = replace(content_en, $f$You fill in the online [application form](/en/candidature) presenting your profile, your professional situation, and what you expect from coliving life.$f$, $r$You [book your visit online](/en/candidature): first name, last name, email and phone, two minutes.$r$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($f$You fill in the online [application form](/en/candidature) presenting your profile, your professional situation, and what you expect from coliving life.$f$ IN content_en) > 0
  AND position($r$You [book your visit online](/en/candidature): first name, last name, email and phone, two minutes.$r$ IN content_en) = 0;

-- [45/75] lodge-annemasse-coliving-premium-portes-geneve (en) · A · appendix A no. 20 · conclusion: “[apply directly] to check room availability” → “[book a visit]: we'll check room availability with you”
UPDATE blog_posts
SET content_en = replace(content_en, $f$or [apply directly](/en/candidature) to check room availability.$f$, $r$or [book a visit](/en/candidature): we'll check room availability with you.$r$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($f$or [apply directly](/en/candidature) to check room availability.$f$ IN content_en) > 0
  AND position($r$or [book a visit](/en/candidature): we'll check room availability with you.$r$ IN content_en) = 0;

-- [46/75] non-la-villa-coliving-nest-pas-une-arnaque (fr) · A · annexe A n° 21 · étape 1 : « Tu [candidates en ligne] » → « Tu [demandes une visite en ligne] »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$1. Tu [candidates en ligne](/candidature), ou tu nous écris.$f$, $r$1. Tu [demandes une visite en ligne](/candidature), ou tu nous écris.$r$),
    updated_at = now()
WHERE slug = 'non-la-villa-coliving-nest-pas-une-arnaque'
  AND position($f$1. Tu [candidates en ligne](/candidature), ou tu nous écris.$f$ IN content_fr) > 0
  AND position($r$1. Tu [demandes une visite en ligne](/candidature), ou tu nous écris.$r$ IN content_fr) = 0;

-- [47/75] non-la-villa-coliving-nest-pas-une-arnaque (fr) · A · annexe A n° 21 · « Avant de candidater, trois lectures utiles » → « Avant ta visite, trois lectures utiles »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Avant de candidater, trois lectures utiles$f$, $r$Avant ta visite, trois lectures utiles$r$),
    updated_at = now()
WHERE slug = 'non-la-villa-coliving-nest-pas-une-arnaque'
  AND position($f$Avant de candidater, trois lectures utiles$f$ IN content_fr) > 0
  AND position($r$Avant ta visite, trois lectures utiles$r$ IN content_fr) = 0;

-- [48/75] non-la-villa-coliving-nest-pas-une-arnaque (en) · A · appendix A no. 21 · step 1: “You [apply online]” → “You [book a visit online]”
UPDATE blog_posts
SET content_en = replace(content_en, $f$1. You [apply online](/en/candidature), or you message us.$f$, $r$1. You [book a visit online](/en/candidature), or you message us.$r$),
    updated_at = now()
WHERE slug = 'non-la-villa-coliving-nest-pas-une-arnaque'
  AND position($f$1. You [apply online](/en/candidature), or you message us.$f$ IN content_en) > 0
  AND position($r$1. You [book a visit online](/en/candidature), or you message us.$r$ IN content_en) = 0;

-- [49/75] non-la-villa-coliving-nest-pas-une-arnaque (en) · A · appendix A no. 21 · “Before you apply, three useful reads” → “Before your visit, three useful reads”
UPDATE blog_posts
SET content_en = replace(content_en, $f$Before you apply, three useful reads$f$, $r$Before your visit, three useful reads$r$),
    updated_at = now()
WHERE slug = 'non-la-villa-coliving-nest-pas-une-arnaque'
  AND position($f$Before you apply, three useful reads$f$ IN content_en) > 0
  AND position($r$Before your visit, three useful reads$r$ IN content_en) = 0;

-- [50/75] organisations-internationales-geneve-ou-habiter (fr) · A · annexe A n° 22 · titre « Comment candidater si tu es en poste OI » → « Comment demander une visite si tu es en poste OI »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$## Comment candidater si tu es en poste OI$f$, $r$## Comment demander une visite si tu es en poste OI$r$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($f$## Comment candidater si tu es en poste OI$f$ IN content_fr) > 0
  AND position($r$## Comment demander une visite si tu es en poste OI$r$ IN content_fr) = 0;

-- [51/75] organisations-internationales-geneve-ou-habiter (fr) · A · annexe A n° 22 · « Envoie ta candidature via notre [formulaire en ligne] » → « Demande ta visite via notre [formulaire en ligne] »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Envoie ta candidature via notre [formulaire en ligne](/candidature).$f$, $r$Demande ta visite via notre [formulaire en ligne](/candidature).$r$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($f$Envoie ta candidature via notre [formulaire en ligne](/candidature).$f$ IN content_fr) > 0
  AND position($r$Demande ta visite via notre [formulaire en ligne](/candidature).$r$ IN content_fr) = 0;

-- [52/75] organisations-internationales-geneve-ou-habiter (en) · A · appendix A no. 22 · heading “How to apply if you're in an IO position” → “How to book a visit if you're in an IO position”
UPDATE blog_posts
SET content_en = replace(content_en, $f$## How to apply if you're in an IO position$f$, $r$## How to book a visit if you're in an IO position$r$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($f$## How to apply if you're in an IO position$f$ IN content_en) > 0
  AND position($r$## How to book a visit if you're in an IO position$r$ IN content_en) = 0;

-- [53/75] organisations-internationales-geneve-ou-habiter (en) · A · appendix A no. 22 · “Submit your application via our [online form]” → “Request your visit via our [online form]”
UPDATE blog_posts
SET content_en = replace(content_en, $f$Submit your application via our [online form](/en/candidature).$f$, $r$Request your visit via our [online form](/en/candidature).$r$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($f$Submit your application via our [online form](/en/candidature).$f$ IN content_en) > 0
  AND position($r$Request your visit via our [online form](/en/candidature).$r$ IN content_en) = 0;

-- [54/75] ou-habiter-en-france-quand-on-travaille-a-geneve (fr) · A · annexe A n° 23 · « [la candidature se fait à distance] » → « [la visite peut se faire en vidéo] »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$et [la candidature se fait à distance](/candidature).$f$, $r$et [la visite peut se faire en vidéo](/candidature).$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($f$et [la candidature se fait à distance](/candidature).$f$ IN content_fr) > 0
  AND position($r$et [la visite peut se faire en vidéo](/candidature).$r$ IN content_fr) = 0;

-- [55/75] ou-habiter-en-france-quand-on-travaille-a-geneve (en) · A · appendix A no. 23 · “[you can apply remotely]” → “[you can visit by video]”
UPDATE blog_posts
SET content_en = replace(content_en, $f$and [you can apply remotely](/en/candidature).$f$, $r$and [you can visit by video](/en/candidature).$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($f$and [you can apply remotely](/en/candidature).$f$ IN content_en) > 0
  AND position($r$and [you can visit by video](/en/candidature).$r$ IN content_en) = 0;

-- [56/75] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · A · annexe A n° 24 · « la [candidature prend deux minutes] » → « la [demande de visite prend deux minutes] » (comme /tarifs)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$la [candidature prend deux minutes](/candidature)$f$, $r$la [demande de visite prend deux minutes](/candidature)$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$la [candidature prend deux minutes](/candidature)$f$ IN content_fr) > 0
  AND position($r$la [demande de visite prend deux minutes](/candidature)$r$ IN content_fr) = 0;

-- [57/75] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · A · appendix A no. 24 · “the [application takes two minutes]” → “the [visit request takes two minutes]”
UPDATE blog_posts
SET content_en = replace(content_en, $f$the [application takes two minutes](/en/candidature)$f$, $r$the [visit request takes two minutes](/en/candidature)$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$the [application takes two minutes](/en/candidature)$f$ IN content_en) > 0
  AND position($r$the [visit request takes two minutes](/en/candidature)$r$ IN content_en) = 0;

-- [58/75] salaire-suisse-net-frontalier-2026 (fr) · A · annexe A n° 26 · « Postule en 2 min » → « Demande ta visite en 2 min »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[Postule en 2 min](/candidature)$f$, $r$[Demande ta visite en 2 min](/candidature)$r$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($f$[Postule en 2 min](/candidature)$f$ IN content_fr) > 0
  AND position($r$[Demande ta visite en 2 min](/candidature)$r$ IN content_fr) = 0;

-- [59/75] salaire-suisse-net-frontalier-2026 (en) · A · appendix A no. 26 · “Apply in 2 min” → “Request your visit in 2 min”
UPDATE blog_posts
SET content_en = replace(content_en, $f$[Apply in 2 min](/en/candidature)$f$, $r$[Request your visit in 2 min](/en/candidature)$r$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($f$[Apply in 2 min](/en/candidature)$f$ IN content_en) > 0
  AND position($r$[Request your visit in 2 min](/en/candidature)$r$ IN content_en) = 0;

-- [60/75] se-faire-reseau-geneve-arriver-seul (fr) · A · annexe A n° 27 · lien final « candidate ici » → « programme une visite »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[candidate ici](/candidature)$f$, $r$[programme une visite](/candidature)$r$),
    updated_at = now()
WHERE slug = 'se-faire-reseau-geneve-arriver-seul'
  AND position($f$[candidate ici](/candidature)$f$ IN content_fr) > 0
  AND position($r$[programme une visite](/candidature)$r$ IN content_fr) = 0;

-- [61/75] se-faire-reseau-geneve-arriver-seul (en) · A · appendix A no. 27 · closing link “apply here” → “book a visit”
UPDATE blog_posts
SET content_en = replace(content_en, $f$[apply here](/en/candidature)$f$, $r$[book a visit](/en/candidature)$r$),
    updated_at = now()
WHERE slug = 'se-faire-reseau-geneve-arriver-seul'
  AND position($f$[apply here](/en/candidature)$f$ IN content_en) > 0
  AND position($r$[book a visit](/en/candidature)$r$ IN content_en) = 0;

-- [62/75] teletravail-frontalier-geneve-regles-2026 (fr) · A · annexe A n° 28 · lien final « postule » → « programme une visite »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[postule](/candidature)$f$, $r$[programme une visite](/candidature)$r$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($f$[postule](/candidature)$f$ IN content_fr) > 0
  AND position($r$[programme une visite](/candidature)$r$ IN content_fr) = 0;

-- [63/75] teletravail-frontalier-geneve-regles-2026 (en) · A · appendix A no. 28 · closing link “apply” → “book a visit”
UPDATE blog_posts
SET content_en = replace(content_en, $f$[apply](/en/candidature)$f$, $r$[book a visit](/en/candidature)$r$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($f$[apply](/en/candidature)$f$ IN content_en) > 0
  AND position($r$[book a visit](/en/candidature)$r$ IN content_en) = 0;

-- [64/75] temps-trajet-annemasse-geneve-par-quartier (fr) · A · annexe A n° 29 · lien final « postule directement » → « programme une visite »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[postule directement](/candidature)$f$, $r$[programme une visite](/candidature)$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$[postule directement](/candidature)$f$ IN content_fr) > 0
  AND position($r$[programme une visite](/candidature)$r$ IN content_fr) = 0;

-- [65/75] temps-trajet-annemasse-geneve-par-quartier (en) · A · appendix A no. 29 · closing link “apply directly” → “book a visit”
UPDATE blog_posts
SET content_en = replace(content_en, $f$[apply directly](/en/candidature)$f$, $r$[book a visit](/en/candidature)$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$[apply directly](/en/candidature)$f$ IN content_en) > 0
  AND position($r$[book a visit](/en/candidature)$r$ IN content_en) = 0;

-- [66/75] transport-annemasse-geneve-leman-express (fr) · A · annexe A n° 30 · « Candidate en 2 minutes → » → « Demande ta visite en 2 minutes → »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[Candidate en 2 minutes →](/candidature)$f$, $r$[Demande ta visite en 2 minutes →](/candidature)$r$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($f$[Candidate en 2 minutes →](/candidature)$f$ IN content_fr) > 0
  AND position($r$[Demande ta visite en 2 minutes →](/candidature)$r$ IN content_fr) = 0;

-- [67/75] trouver-colocation-geneve-frontalier (fr) · A · annexe A n° 31 · intro : « voir les chambres libres et candidater » → « … et programmer une visite » (ancre exacte du lien inchangée)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$voir les chambres libres et candidater, va sur notre page [colocation à Genève côté France](/colocation-geneve)$f$, $r$voir les chambres libres et programmer une visite, va sur notre page [colocation à Genève côté France](/colocation-geneve)$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$voir les chambres libres et candidater, va sur notre page [colocation à Genève côté France](/colocation-geneve)$f$ IN content_fr) > 0
  AND position($r$voir les chambres libres et programmer une visite, va sur notre page [colocation à Genève côté France](/colocation-geneve)$r$ IN content_fr) = 0;

-- [68/75] trouver-colocation-geneve-frontalier (fr) · A · annexe A n° 31 · « postule en 2 minutes » → « demande ta visite en 2 minutes » (adresse ?src=bloc_offre inchangée)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[postule en 2 minutes](/candidature?src=bloc_offre&article=trouver-colocation-geneve-frontalier)$f$, $r$[demande ta visite en 2 minutes](/candidature?src=bloc_offre&article=trouver-colocation-geneve-frontalier)$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$[postule en 2 minutes](/candidature?src=bloc_offre&article=trouver-colocation-geneve-frontalier)$f$ IN content_fr) > 0
  AND position($r$[demande ta visite en 2 minutes](/candidature?src=bloc_offre&article=trouver-colocation-geneve-frontalier)$r$ IN content_fr) = 0;

-- [69/75] trouver-colocation-geneve-frontalier (en) · A · appendix A no. 31 · “Apply in 2 minutes” → “Request your visit in 2 minutes”
UPDATE blog_posts
SET content_en = replace(content_en, $f$[Apply in 2 minutes](/en/candidature)$f$, $r$[Request your visit in 2 minutes](/en/candidature)$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$[Apply in 2 minutes](/en/candidature)$f$ IN content_en) > 0
  AND position($r$[Request your visit in 2 minutes](/en/candidature)$r$ IN content_en) = 0;

-- [70/75] trouver-logement-avant-d-arriver-geneve (fr) · A · annexe A n° 32 · « [la candidature se remplit à distance], avant même la première visite » → « [la visite peut se faire en vidéo], avant même ton arrivée »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$et [la candidature se remplit à distance](/candidature), avant même la première visite.$f$, $r$et [la visite peut se faire en vidéo](/candidature), avant même ton arrivée.$r$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($f$et [la candidature se remplit à distance](/candidature), avant même la première visite.$f$ IN content_fr) > 0
  AND position($r$et [la visite peut se faire en vidéo](/candidature), avant même ton arrivée.$r$ IN content_fr) = 0;

-- [71/75] trouver-logement-avant-d-arriver-geneve (en) · A · appendix A no. 32 · “[the application can be done remotely], before you've even had a viewing” → “[the visit can be done by video], before you even arrive”
UPDATE blog_posts
SET content_en = replace(content_en, $f$and [the application can be done remotely](/en/candidature), before you've even had a viewing.$f$, $r$and [the visit can be done by video](/en/candidature), before you even arrive.$r$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($f$and [the application can be done remotely](/en/candidature), before you've even had a viewing.$f$ IN content_en) > 0
  AND position($r$and [the visit can be done by video](/en/candidature), before you even arrive.$r$ IN content_en) = 0;

-- [72/75] vie-quotidienne-frontalier-courses-sport-sorties (fr) · A · annexe A n° 33 · lien final « candidate ici » → « programme une visite »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[candidate ici](/candidature)$f$, $r$[programme une visite](/candidature)$r$),
    updated_at = now()
WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties'
  AND position($f$[candidate ici](/candidature)$f$ IN content_fr) > 0
  AND position($r$[programme une visite](/candidature)$r$ IN content_fr) = 0;

-- [73/75] vie-quotidienne-frontalier-courses-sport-sorties (en) · A · appendix A no. 33 · closing link “apply here” → “book a visit”
UPDATE blog_posts
SET content_en = replace(content_en, $f$[apply here](/en/candidature)$f$, $r$[book a visit](/en/candidature)$r$),
    updated_at = now()
WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties'
  AND position($f$[apply here](/en/candidature)$f$ IN content_en) > 0
  AND position($r$[book a visit](/en/candidature)$r$ IN content_en) = 0;

-- [74/75] vivre-a-annemasse-quand-on-travaille-a-geneve (fr) · A · annexe A n° 34 · « la [candidature prend deux minutes] » → « la [demande de visite prend deux minutes] »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$la [candidature prend deux minutes](/candidature)$f$, $r$la [demande de visite prend deux minutes](/candidature)$r$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($f$la [candidature prend deux minutes](/candidature)$f$ IN content_fr) > 0
  AND position($r$la [demande de visite prend deux minutes](/candidature)$r$ IN content_fr) = 0;

-- [75/75] vivre-a-annemasse-quand-on-travaille-a-geneve (en) · A · appendix A no. 34 · “the [application takes two minutes]” → “the [visit request takes two minutes]”
UPDATE blog_posts
SET content_en = replace(content_en, $f$the [application takes two minutes](/en/candidature)$f$, $r$the [visit request takes two minutes](/en/candidature)$r$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($f$the [application takes two minutes](/en/candidature)$f$ IN content_en) > 0
  AND position($r$the [visit request takes two minutes](/en/candidature)$r$ IN content_en) = 0;

-- ── Aperçu des ancrages (ancien → nouveau, première ligne de chaque texte) ──
-- [1] arnaques-logement-frontalier-geneve-eviter/fr · A : « [Candidate chez La Villa Coliving](/candidature) — visite sur place, ba… » → « [Programme une visite chez La Villa Coliving](/candidature) — sur place… »
-- [2] arnaques-logement-frontalier-geneve-eviter/en · A : « [Apply to La Villa Coliving](/en/candidature) — on-site visits, legal l… » → « [Book a visit at La Villa Coliving](/en/candidature) — on site or by vi… »
-- [3] assurance-sante-frontalier-lamal-cmu-budget/fr · A : « [postule directement](/candidature) » → « [programme une visite](/candidature) »
-- [4] assurance-sante-frontalier-lamal-cmu-budget/en · A : « [apply directly](/en/candidature) » → « [book a visit](/en/candidature) »
-- [5] banque-telephone-internet-frontalier-bons-plans/fr · A : « [candidate ici](/candidature) » → « [programme une visite](/candidature) »
-- [6] banque-telephone-internet-frontalier-bons-plans/en · A : « [apply here](/en/candidature) » → « [book a visit](/en/candidature) »
-- [7] budget-colocation-geneve-guide-complet/fr · A : « la meilleure stratégie est de candidater dès maintenant pour figurer su… » → « la meilleure stratégie est de te manifester dès maintenant pour figurer… »
-- [8] budget-colocation-geneve-guide-complet/fr · A : « ou dépose ta [candidature en 2 minutes](https://www.lavillacoliving.com… » → « ou [demande ta visite en 2 minutes](https://www.lavillacoliving.com/can… »
-- [9] budget-colocation-geneve-guide-complet/en · A : « the best strategy is to apply now to get on the waiting list » → « the best strategy is to get in touch now to get on the waiting list »
-- [10] budget-colocation-geneve-guide-complet/en · A : « or submit your [application in 2 minutes](https://www.lavillacoliving.c… » → « or [request your visit in 2 minutes](https://www.lavillacoliving.com/en… »
-- [11] choc-culturel-franco-suisse-expatrie-geneve/fr · A : « [candidate ici](/candidature) » → « [programme une visite](/candidature) »
-- [12] choc-culturel-franco-suisse-expatrie-geneve/en · A : « [apply here](/en/candidature) » → « [book a visit](/en/candidature) »
-- [13] coliving-annemasse-geneve-frontaliers-avantages/fr · A : « [Postule en 2 minutes](/candidature) » → « [Demande ta visite en 2 minutes](/candidature) »
-- [14] coliving-annemasse-geneve-frontaliers-avantages/en · A : « [Apply in 2 minutes](/en/candidature) » → « [Request your visit in 2 minutes](/en/candidature) »
-- [15] coliving-colocation-ou-studio-geneve-comparatif/fr · A : « pas dans un magasin de meubles : candidature en deux minutes, réponse s… » → « pas dans un magasin de meubles : demande en deux minutes, réponse sous … »
-- [16] coliving-colocation-ou-studio-geneve-comparatif/fr · A : « [candidature en deux minutes](/candidature) » → « [demande en deux minutes](/candidature) »
-- [17] coliving-colocation-ou-studio-geneve-comparatif/fr · A : « si une chambre est disponible : candidature en deux minutes, réponse so… » → « si une chambre est disponible : demande en deux minutes, réponse sous 4… »
-- [18] coliving-colocation-ou-studio-geneve-comparatif/en · A : « not in a furniture store: a two-minute application, a reply within 48 h » → « not in a furniture store: a two-minute request, a reply within 48 h »
-- [19] coliving-colocation-ou-studio-geneve-comparatif/en · A : « [a two-minute application](/en/candidature) » → « [a two-minute request](/en/candidature) »
-- [20] coliving-colocation-ou-studio-geneve-comparatif/en · A : « if a room is available: a two-minute application, a reply within 48 h » → « if a room is available: a two-minute request, a reply within 48 h »
-- [21] coliving-communaute-reels-amis-geneve-annemasse/fr · A : « [Candidate dès maintenant](/candidature) » → « [Programme une visite dès maintenant](/candidature) »
-- [22] coliving-communaute-reels-amis-geneve-annemasse/en · A : « [Apply now](/en/candidature) » → « [Book a visit now](/en/candidature) »
-- [23] coliving-frais-dossier-geneve-annemasse/fr · A : « [candidate en 2 minutes, gratuitement](/candidature) » → « [demande ta visite en 2 minutes, gratuitement](/candidature) »
-- [24] coliving-frais-dossier-geneve-annemasse/en · A : « [apply in 2 minutes, for free](/en/candidature) » → « [request your visit in 2 minutes, for free](/en/candidature) »
-- [25] coliving-transfrontalier-geneve-annemasse-nouvelle-vie/fr · A : « [Postule en 2 minutes](/candidature) » → « [Demande ta visite en 2 minutes](/candidature) »
-- [26] coliving-transfrontalier-geneve-annemasse-nouvelle-vie/en · A : « [Apply in 2 minutes](/en/candidature) » → « [Request your visit in 2 minutes](/en/candidature) »
-- [27] colocation-annemasse-ville-la-grand-ambilly/fr · A : « [Candidate en 2 minutes →](/candidature) » → « [Demande ta visite en 2 minutes →](/candidature) »
-- [28] cout-transport-frontalier-geneve-2026/fr · A : « [postule en 2 minutes](/candidature) » → « [demande ta visite en 2 minutes](/candidature) »
-- [29] cout-transport-frontalier-geneve-2026/en · A : « [apply in 2 minutes](/en/candidature) » → « [request your visit in 2 minutes](/en/candidature) »
-- [30] dossier-location-frontalier-suisse-france/fr · A : « [Candidate chez La Villa Coliving](/candidature) » → « [Programme une visite chez La Villa Coliving](/candidature) »
-- [31] dossier-location-frontalier-suisse-france/en · A : « [Apply to La Villa Coliving](/en/candidature) » → « [Book a visit at La Villa Coliving](/en/candidature) »
-- [32] espaces-verts-coliving-lodge-annemasse/fr · A : « [postule en 2 minutes](/candidature) » → « [demande ta visite en 2 minutes](/candidature) »
-- [33] espaces-verts-coliving-lodge-annemasse/en · A : « [apply in 2 minutes](/en/candidature) » → « [request your visit in 2 minutes](/en/candidature) »
-- [34] fiscalite-frontalier-geneve-impots-2026/fr · A : « ou dépose ta [candidature](/candidature) » → « ou [programme une visite](/candidature) »
-- [35] fiscalite-frontalier-geneve-impots-2026/en · A : « or submit your [application](/en/candidature) » → « or [book a visit](/en/candidature) »
-- [36] grand-geneve-2026-nouveautes-frontaliers/fr · A : « [Candidate en 2 minutes →](/candidature) » → « [Demande ta visite en 2 minutes →](/candidature) »
-- [37] guide-ressources-frontalier-geneve/fr · A : « [candidate en quelques minutes, gratuitement](/candidature) » → « [demande ta visite en quelques minutes, gratuitement](/candidature) »
-- [38] guide-ressources-frontalier-geneve/en · A : « [apply in a few minutes, for free](/candidature) » → « [request your visit in a few minutes, for free](/candidature) »
-- [39] ia-solitude-lien-social-coliving/fr · A : « [candidate en ligne](/candidature) » → « [demande une visite en ligne](/candidature) »
-- [40] ia-solitude-lien-social-coliving/en · A : « [apply online](/en/candidature) » → « [book a visit online](/en/candidature) »
-- [41] living-in-france-working-in-geneva/fr · A : « [Candidate en 2 minutes →](/candidature) » → « [Demande ta visite en 2 minutes →](/candidature) »
-- [42] lodge-annemasse-coliving-premium-portes-geneve/fr · A : « Tu remplis le [formulaire de candidature](/candidature) en ligne en pré… » → « Tu [demandes ta visite en ligne](/candidature) : prénom, nom, email et … »
-- [43] lodge-annemasse-coliving-premium-portes-geneve/fr · A : « ou [candidate directement](/candidature) pour vérifier la disponibilité… » → « ou [programme une visite](/candidature) : on vérifie avec toi les chamb… »
-- [44] lodge-annemasse-coliving-premium-portes-geneve/en · A : « You fill in the online [application form](/en/candidature) presenting y… » → « You [book your visit online](/en/candidature): first name, last name, e… »
-- [45] lodge-annemasse-coliving-premium-portes-geneve/en · A : « or [apply directly](/en/candidature) to check room availability. » → « or [book a visit](/en/candidature): we'll check room availability with … »
-- [46] non-la-villa-coliving-nest-pas-une-arnaque/fr · A : « 1. Tu [candidates en ligne](/candidature), ou tu nous écris. » → « 1. Tu [demandes une visite en ligne](/candidature), ou tu nous écris. »
-- [47] non-la-villa-coliving-nest-pas-une-arnaque/fr · A : « Avant de candidater, trois lectures utiles » → « Avant ta visite, trois lectures utiles »
-- [48] non-la-villa-coliving-nest-pas-une-arnaque/en · A : « 1. You [apply online](/en/candidature), or you message us. » → « 1. You [book a visit online](/en/candidature), or you message us. »
-- [49] non-la-villa-coliving-nest-pas-une-arnaque/en · A : « Before you apply, three useful reads » → « Before your visit, three useful reads »
-- [50] organisations-internationales-geneve-ou-habiter/fr · A : « ## Comment candidater si tu es en poste OI » → « ## Comment demander une visite si tu es en poste OI »
-- [51] organisations-internationales-geneve-ou-habiter/fr · A : « Envoie ta candidature via notre [formulaire en ligne](/candidature). » → « Demande ta visite via notre [formulaire en ligne](/candidature). »
-- [52] organisations-internationales-geneve-ou-habiter/en · A : « ## How to apply if you're in an IO position » → « ## How to book a visit if you're in an IO position »
-- [53] organisations-internationales-geneve-ou-habiter/en · A : « Submit your application via our [online form](/en/candidature). » → « Request your visit via our [online form](/en/candidature). »
-- [54] ou-habiter-en-france-quand-on-travaille-a-geneve/fr · A : « et [la candidature se fait à distance](/candidature). » → « et [la visite peut se faire en vidéo](/candidature). »
-- [55] ou-habiter-en-france-quand-on-travaille-a-geneve/en · A : « and [you can apply remotely](/en/candidature). » → « and [you can visit by video](/en/candidature). »
-- [56] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · A : « la [candidature prend deux minutes](/candidature) » → « la [demande de visite prend deux minutes](/candidature) »
-- [57] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · A : « the [application takes two minutes](/en/candidature) » → « the [visit request takes two minutes](/en/candidature) »
-- [58] salaire-suisse-net-frontalier-2026/fr · A : « [Postule en 2 min](/candidature) » → « [Demande ta visite en 2 min](/candidature) »
-- [59] salaire-suisse-net-frontalier-2026/en · A : « [Apply in 2 min](/en/candidature) » → « [Request your visit in 2 min](/en/candidature) »
-- [60] se-faire-reseau-geneve-arriver-seul/fr · A : « [candidate ici](/candidature) » → « [programme une visite](/candidature) »
-- [61] se-faire-reseau-geneve-arriver-seul/en · A : « [apply here](/en/candidature) » → « [book a visit](/en/candidature) »
-- [62] teletravail-frontalier-geneve-regles-2026/fr · A : « [postule](/candidature) » → « [programme une visite](/candidature) »
-- [63] teletravail-frontalier-geneve-regles-2026/en · A : « [apply](/en/candidature) » → « [book a visit](/en/candidature) »
-- [64] temps-trajet-annemasse-geneve-par-quartier/fr · A : « [postule directement](/candidature) » → « [programme une visite](/candidature) »
-- [65] temps-trajet-annemasse-geneve-par-quartier/en · A : « [apply directly](/en/candidature) » → « [book a visit](/en/candidature) »
-- [66] transport-annemasse-geneve-leman-express/fr · A : « [Candidate en 2 minutes →](/candidature) » → « [Demande ta visite en 2 minutes →](/candidature) »
-- [67] trouver-colocation-geneve-frontalier/fr · A : « voir les chambres libres et candidater, va sur notre page [colocation à… » → « voir les chambres libres et programmer une visite, va sur notre page [c… »
-- [68] trouver-colocation-geneve-frontalier/fr · A : « [postule en 2 minutes](/candidature?src=bloc_offre&article=trouver-colo… » → « [demande ta visite en 2 minutes](/candidature?src=bloc_offre&article=tr… »
-- [69] trouver-colocation-geneve-frontalier/en · A : « [Apply in 2 minutes](/en/candidature) » → « [Request your visit in 2 minutes](/en/candidature) »
-- [70] trouver-logement-avant-d-arriver-geneve/fr · A : « et [la candidature se remplit à distance](/candidature), avant même la … » → « et [la visite peut se faire en vidéo](/candidature), avant même ton arr… »
-- [71] trouver-logement-avant-d-arriver-geneve/en · A : « and [the application can be done remotely](/en/candidature), before you… » → « and [the visit can be done by video](/en/candidature), before you even … »
-- [72] vie-quotidienne-frontalier-courses-sport-sorties/fr · A : « [candidate ici](/candidature) » → « [programme une visite](/candidature) »
-- [73] vie-quotidienne-frontalier-courses-sport-sorties/en · A : « [apply here](/en/candidature) » → « [book a visit](/en/candidature) »
-- [74] vivre-a-annemasse-quand-on-travaille-a-geneve/fr · A : « la [candidature prend deux minutes](/candidature) » → « la [demande de visite prend deux minutes](/candidature) »
-- [75] vivre-a-annemasse-quand-on-travaille-a-geneve/en · A : « the [application takes two minutes](/en/candidature) » → « the [visit request takes two minutes](/en/candidature) »

COMMIT;

-- ── Vérification (lecture seule) : une ligne par article ; fr_ok / en_ok = true quand toutes les modifications de la langue sont en place, NULL = langue non touchée.
SELECT slug,
  CASE slug
    WHEN 'arnaques-logement-frontalier-geneve-eviter' THEN (position($f$[Candidate chez La Villa Coliving](/candidature) — visite sur place, bail légal, zéro mauvaise surprise.$f$ IN content_fr) = 0)
    WHEN 'assurance-sante-frontalier-lamal-cmu-budget' THEN (position($f$[postule directement](/candidature)$f$ IN content_fr) = 0)
    WHEN 'banque-telephone-internet-frontalier-bons-plans' THEN (position($f$[candidate ici](/candidature)$f$ IN content_fr) = 0)
    WHEN 'budget-colocation-geneve-guide-complet' THEN (position($f$la meilleure stratégie est de candidater dès maintenant pour figurer sur la liste d'attente$f$ IN content_fr) = 0
      AND position($f$ou dépose ta [candidature en 2 minutes](https://www.lavillacoliving.com/candidature)$f$ IN content_fr) = 0)
    WHEN 'choc-culturel-franco-suisse-expatrie-geneve' THEN (position($f$[candidate ici](/candidature)$f$ IN content_fr) = 0)
    WHEN 'coliving-annemasse-geneve-frontaliers-avantages' THEN (position($f$[Postule en 2 minutes](/candidature)$f$ IN content_fr) = 0)
    WHEN 'coliving-colocation-ou-studio-geneve-comparatif' THEN (position($f$pas dans un magasin de meubles : candidature en deux minutes, réponse sous 48 h$f$ IN content_fr) = 0
      AND position($f$[candidature en deux minutes](/candidature)$f$ IN content_fr) = 0
      AND position($f$si une chambre est disponible : candidature en deux minutes, réponse sous 48 h$f$ IN content_fr) = 0)
    WHEN 'coliving-communaute-reels-amis-geneve-annemasse' THEN (position($f$[Candidate dès maintenant](/candidature)$f$ IN content_fr) = 0)
    WHEN 'coliving-frais-dossier-geneve-annemasse' THEN (position($f$[candidate en 2 minutes, gratuitement](/candidature)$f$ IN content_fr) = 0)
    WHEN 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie' THEN (position($f$[Postule en 2 minutes](/candidature)$f$ IN content_fr) = 0)
    WHEN 'colocation-annemasse-ville-la-grand-ambilly' THEN (position($f$[Candidate en 2 minutes →](/candidature)$f$ IN content_fr) = 0)
    WHEN 'cout-transport-frontalier-geneve-2026' THEN (position($f$[postule en 2 minutes](/candidature)$f$ IN content_fr) = 0)
    WHEN 'dossier-location-frontalier-suisse-france' THEN (position($f$[Candidate chez La Villa Coliving](/candidature)$f$ IN content_fr) = 0)
    WHEN 'espaces-verts-coliving-lodge-annemasse' THEN (position($f$[postule en 2 minutes](/candidature)$f$ IN content_fr) = 0)
    WHEN 'fiscalite-frontalier-geneve-impots-2026' THEN (position($f$ou dépose ta [candidature](/candidature)$f$ IN content_fr) = 0)
    WHEN 'grand-geneve-2026-nouveautes-frontaliers' THEN (position($f$[Candidate en 2 minutes →](/candidature)$f$ IN content_fr) = 0)
    WHEN 'guide-ressources-frontalier-geneve' THEN (position($f$[candidate en quelques minutes, gratuitement](/candidature)$f$ IN content_fr) = 0)
    WHEN 'ia-solitude-lien-social-coliving' THEN (position($f$[candidate en ligne](/candidature)$f$ IN content_fr) = 0)
    WHEN 'living-in-france-working-in-geneva' THEN (position($f$[Candidate en 2 minutes →](/candidature)$f$ IN content_fr) = 0)
    WHEN 'lodge-annemasse-coliving-premium-portes-geneve' THEN (position($f$Tu remplis le [formulaire de candidature](/candidature) en ligne en présentant ton profil, ta situation professionnelle et tes attentes vis-à-vis de la vie en coliving.$f$ IN content_fr) = 0
      AND position($f$ou [candidate directement](/candidature) pour vérifier la disponibilité des chambres.$f$ IN content_fr) = 0)
    WHEN 'non-la-villa-coliving-nest-pas-une-arnaque' THEN (position($f$1. Tu [candidates en ligne](/candidature), ou tu nous écris.$f$ IN content_fr) = 0
      AND position($f$Avant de candidater, trois lectures utiles$f$ IN content_fr) = 0)
    WHEN 'organisations-internationales-geneve-ou-habiter' THEN (position($f$## Comment candidater si tu es en poste OI$f$ IN content_fr) = 0
      AND position($f$Envoie ta candidature via notre [formulaire en ligne](/candidature).$f$ IN content_fr) = 0)
    WHEN 'ou-habiter-en-france-quand-on-travaille-a-geneve' THEN (position($f$et [la candidature se fait à distance](/candidature).$f$ IN content_fr) = 0)
    WHEN 'ou-habiter-frontalier-suisse-villes-france-pas-cher' THEN (position($f$la [candidature prend deux minutes](/candidature)$f$ IN content_fr) = 0)
    WHEN 'salaire-suisse-net-frontalier-2026' THEN (position($f$[Postule en 2 min](/candidature)$f$ IN content_fr) = 0)
    WHEN 'se-faire-reseau-geneve-arriver-seul' THEN (position($f$[candidate ici](/candidature)$f$ IN content_fr) = 0)
    WHEN 'teletravail-frontalier-geneve-regles-2026' THEN (position($f$[postule](/candidature)$f$ IN content_fr) = 0)
    WHEN 'temps-trajet-annemasse-geneve-par-quartier' THEN (position($f$[postule directement](/candidature)$f$ IN content_fr) = 0)
    WHEN 'transport-annemasse-geneve-leman-express' THEN (position($f$[Candidate en 2 minutes →](/candidature)$f$ IN content_fr) = 0)
    WHEN 'trouver-colocation-geneve-frontalier' THEN (position($f$voir les chambres libres et candidater, va sur notre page [colocation à Genève côté France](/colocation-geneve)$f$ IN content_fr) = 0
      AND position($f$[postule en 2 minutes](/candidature?src=bloc_offre&article=trouver-colocation-geneve-frontalier)$f$ IN content_fr) = 0)
    WHEN 'trouver-logement-avant-d-arriver-geneve' THEN (position($f$et [la candidature se remplit à distance](/candidature), avant même la première visite.$f$ IN content_fr) = 0)
    WHEN 'vie-quotidienne-frontalier-courses-sport-sorties' THEN (position($f$[candidate ici](/candidature)$f$ IN content_fr) = 0)
    WHEN 'vivre-a-annemasse-quand-on-travaille-a-geneve' THEN (position($f$la [candidature prend deux minutes](/candidature)$f$ IN content_fr) = 0)
  END AS fr_ok,
  CASE slug
    WHEN 'arnaques-logement-frontalier-geneve-eviter' THEN (position($f$[Apply to La Villa Coliving](/en/candidature) — on-site visits, legal lease, zero nasty surprises.$f$ IN content_en) = 0)
    WHEN 'assurance-sante-frontalier-lamal-cmu-budget' THEN (position($f$[apply directly](/en/candidature)$f$ IN content_en) = 0)
    WHEN 'banque-telephone-internet-frontalier-bons-plans' THEN (position($f$[apply here](/en/candidature)$f$ IN content_en) = 0)
    WHEN 'budget-colocation-geneve-guide-complet' THEN (position($f$the best strategy is to apply now to get on the waiting list$f$ IN content_en) = 0
      AND position($f$or submit your [application in 2 minutes](https://www.lavillacoliving.com/en/candidature)$f$ IN content_en) = 0)
    WHEN 'choc-culturel-franco-suisse-expatrie-geneve' THEN (position($f$[apply here](/en/candidature)$f$ IN content_en) = 0)
    WHEN 'coliving-annemasse-geneve-frontaliers-avantages' THEN (position($f$[Apply in 2 minutes](/en/candidature)$f$ IN content_en) = 0)
    WHEN 'coliving-colocation-ou-studio-geneve-comparatif' THEN (position($f$not in a furniture store: a two-minute application, a reply within 48 h$f$ IN content_en) = 0
      AND position($f$[a two-minute application](/en/candidature)$f$ IN content_en) = 0
      AND position($f$if a room is available: a two-minute application, a reply within 48 h$f$ IN content_en) = 0)
    WHEN 'coliving-communaute-reels-amis-geneve-annemasse' THEN (position($f$[Apply now](/en/candidature)$f$ IN content_en) = 0)
    WHEN 'coliving-frais-dossier-geneve-annemasse' THEN (position($f$[apply in 2 minutes, for free](/en/candidature)$f$ IN content_en) = 0)
    WHEN 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie' THEN (position($f$[Apply in 2 minutes](/en/candidature)$f$ IN content_en) = 0)
    WHEN 'cout-transport-frontalier-geneve-2026' THEN (position($f$[apply in 2 minutes](/en/candidature)$f$ IN content_en) = 0)
    WHEN 'dossier-location-frontalier-suisse-france' THEN (position($f$[Apply to La Villa Coliving](/en/candidature)$f$ IN content_en) = 0)
    WHEN 'espaces-verts-coliving-lodge-annemasse' THEN (position($f$[apply in 2 minutes](/en/candidature)$f$ IN content_en) = 0)
    WHEN 'fiscalite-frontalier-geneve-impots-2026' THEN (position($f$or submit your [application](/en/candidature)$f$ IN content_en) = 0)
    WHEN 'guide-ressources-frontalier-geneve' THEN (position($f$[apply in a few minutes, for free](/candidature)$f$ IN content_en) = 0)
    WHEN 'ia-solitude-lien-social-coliving' THEN (position($f$[apply online](/en/candidature)$f$ IN content_en) = 0)
    WHEN 'lodge-annemasse-coliving-premium-portes-geneve' THEN (position($f$You fill in the online [application form](/en/candidature) presenting your profile, your professional situation, and what you expect from coliving life.$f$ IN content_en) = 0
      AND position($f$or [apply directly](/en/candidature) to check room availability.$f$ IN content_en) = 0)
    WHEN 'non-la-villa-coliving-nest-pas-une-arnaque' THEN (position($f$1. You [apply online](/en/candidature), or you message us.$f$ IN content_en) = 0
      AND position($f$Before you apply, three useful reads$f$ IN content_en) = 0)
    WHEN 'organisations-internationales-geneve-ou-habiter' THEN (position($f$## How to apply if you're in an IO position$f$ IN content_en) = 0
      AND position($f$Submit your application via our [online form](/en/candidature).$f$ IN content_en) = 0)
    WHEN 'ou-habiter-en-france-quand-on-travaille-a-geneve' THEN (position($f$and [you can apply remotely](/en/candidature).$f$ IN content_en) = 0)
    WHEN 'ou-habiter-frontalier-suisse-villes-france-pas-cher' THEN (position($f$the [application takes two minutes](/en/candidature)$f$ IN content_en) = 0)
    WHEN 'salaire-suisse-net-frontalier-2026' THEN (position($f$[Apply in 2 min](/en/candidature)$f$ IN content_en) = 0)
    WHEN 'se-faire-reseau-geneve-arriver-seul' THEN (position($f$[apply here](/en/candidature)$f$ IN content_en) = 0)
    WHEN 'teletravail-frontalier-geneve-regles-2026' THEN (position($f$[apply](/en/candidature)$f$ IN content_en) = 0)
    WHEN 'temps-trajet-annemasse-geneve-par-quartier' THEN (position($f$[apply directly](/en/candidature)$f$ IN content_en) = 0)
    WHEN 'trouver-colocation-geneve-frontalier' THEN (position($f$[Apply in 2 minutes](/en/candidature)$f$ IN content_en) = 0)
    WHEN 'trouver-logement-avant-d-arriver-geneve' THEN (position($f$and [the application can be done remotely](/en/candidature), before you've even had a viewing.$f$ IN content_en) = 0)
    WHEN 'vie-quotidienne-frontalier-courses-sport-sorties' THEN (position($f$[apply here](/en/candidature)$f$ IN content_en) = 0)
    WHEN 'vivre-a-annemasse-quand-on-travaille-a-geneve' THEN (position($f$the [application takes two minutes](/en/candidature)$f$ IN content_en) = 0)
  END AS en_ok
FROM blog_posts
WHERE slug IN ('arnaques-logement-frontalier-geneve-eviter', 'assurance-sante-frontalier-lamal-cmu-budget', 'banque-telephone-internet-frontalier-bons-plans', 'budget-colocation-geneve-guide-complet', 'choc-culturel-franco-suisse-expatrie-geneve', 'coliving-annemasse-geneve-frontaliers-avantages', 'coliving-colocation-ou-studio-geneve-comparatif', 'coliving-communaute-reels-amis-geneve-annemasse', 'coliving-frais-dossier-geneve-annemasse', 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie', 'colocation-annemasse-ville-la-grand-ambilly', 'cout-transport-frontalier-geneve-2026', 'dossier-location-frontalier-suisse-france', 'espaces-verts-coliving-lodge-annemasse', 'fiscalite-frontalier-geneve-impots-2026', 'grand-geneve-2026-nouveautes-frontaliers', 'guide-ressources-frontalier-geneve', 'ia-solitude-lien-social-coliving', 'living-in-france-working-in-geneva', 'lodge-annemasse-coliving-premium-portes-geneve', 'non-la-villa-coliving-nest-pas-une-arnaque', 'organisations-internationales-geneve-ou-habiter', 'ou-habiter-en-france-quand-on-travaille-a-geneve', 'ou-habiter-frontalier-suisse-villes-france-pas-cher', 'salaire-suisse-net-frontalier-2026', 'se-faire-reseau-geneve-arriver-seul', 'teletravail-frontalier-geneve-regles-2026', 'temps-trajet-annemasse-geneve-par-quartier', 'transport-annemasse-geneve-leman-express', 'trouver-colocation-geneve-frontalier', 'trouver-logement-avant-d-arriver-geneve', 'vie-quotidienne-frontalier-courses-sport-sorties', 'vivre-a-annemasse-quand-on-travaille-a-geneve')
ORDER BY slug;

-- ── Retour arrière (inverse exact, mêmes gardes miroir) : retirer les deux lignes /* et */ puis exécuter le bloc.
/*
BEGIN;

UPDATE blog_posts
SET content_en = replace(content_en, $r$the [visit request takes two minutes](/en/candidature)$r$, $f$the [application takes two minutes](/en/candidature)$f$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($r$the [visit request takes two minutes](/en/candidature)$r$ IN content_en) > 0
  AND position($f$the [application takes two minutes](/en/candidature)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$la [demande de visite prend deux minutes](/candidature)$r$, $f$la [candidature prend deux minutes](/candidature)$f$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($r$la [demande de visite prend deux minutes](/candidature)$r$ IN content_fr) > 0
  AND position($f$la [candidature prend deux minutes](/candidature)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[book a visit](/en/candidature)$r$, $f$[apply here](/en/candidature)$f$),
    updated_at = now()
WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties'
  AND position($r$[book a visit](/en/candidature)$r$ IN content_en) > 0
  AND position($f$[apply here](/en/candidature)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[programme une visite](/candidature)$r$, $f$[candidate ici](/candidature)$f$),
    updated_at = now()
WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties'
  AND position($r$[programme une visite](/candidature)$r$ IN content_fr) > 0
  AND position($f$[candidate ici](/candidature)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$and [the visit can be done by video](/en/candidature), before you even arrive.$r$, $f$and [the application can be done remotely](/en/candidature), before you've even had a viewing.$f$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($r$and [the visit can be done by video](/en/candidature), before you even arrive.$r$ IN content_en) > 0
  AND position($f$and [the application can be done remotely](/en/candidature), before you've even had a viewing.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$et [la visite peut se faire en vidéo](/candidature), avant même ton arrivée.$r$, $f$et [la candidature se remplit à distance](/candidature), avant même la première visite.$f$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($r$et [la visite peut se faire en vidéo](/candidature), avant même ton arrivée.$r$ IN content_fr) > 0
  AND position($f$et [la candidature se remplit à distance](/candidature), avant même la première visite.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[Request your visit in 2 minutes](/en/candidature)$r$, $f$[Apply in 2 minutes](/en/candidature)$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$[Request your visit in 2 minutes](/en/candidature)$r$ IN content_en) > 0
  AND position($f$[Apply in 2 minutes](/en/candidature)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[demande ta visite en 2 minutes](/candidature?src=bloc_offre&article=trouver-colocation-geneve-frontalier)$r$, $f$[postule en 2 minutes](/candidature?src=bloc_offre&article=trouver-colocation-geneve-frontalier)$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$[demande ta visite en 2 minutes](/candidature?src=bloc_offre&article=trouver-colocation-geneve-frontalier)$r$ IN content_fr) > 0
  AND position($f$[postule en 2 minutes](/candidature?src=bloc_offre&article=trouver-colocation-geneve-frontalier)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$voir les chambres libres et programmer une visite, va sur notre page [colocation à Genève côté France](/colocation-geneve)$r$, $f$voir les chambres libres et candidater, va sur notre page [colocation à Genève côté France](/colocation-geneve)$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$voir les chambres libres et programmer une visite, va sur notre page [colocation à Genève côté France](/colocation-geneve)$r$ IN content_fr) > 0
  AND position($f$voir les chambres libres et candidater, va sur notre page [colocation à Genève côté France](/colocation-geneve)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[Demande ta visite en 2 minutes →](/candidature)$r$, $f$[Candidate en 2 minutes →](/candidature)$f$),
    updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express'
  AND position($r$[Demande ta visite en 2 minutes →](/candidature)$r$ IN content_fr) > 0
  AND position($f$[Candidate en 2 minutes →](/candidature)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[book a visit](/en/candidature)$r$, $f$[apply directly](/en/candidature)$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$[book a visit](/en/candidature)$r$ IN content_en) > 0
  AND position($f$[apply directly](/en/candidature)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[programme une visite](/candidature)$r$, $f$[postule directement](/candidature)$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$[programme une visite](/candidature)$r$ IN content_fr) > 0
  AND position($f$[postule directement](/candidature)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[book a visit](/en/candidature)$r$, $f$[apply](/en/candidature)$f$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($r$[book a visit](/en/candidature)$r$ IN content_en) > 0
  AND position($f$[apply](/en/candidature)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[programme une visite](/candidature)$r$, $f$[postule](/candidature)$f$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($r$[programme une visite](/candidature)$r$ IN content_fr) > 0
  AND position($f$[postule](/candidature)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[book a visit](/en/candidature)$r$, $f$[apply here](/en/candidature)$f$),
    updated_at = now()
WHERE slug = 'se-faire-reseau-geneve-arriver-seul'
  AND position($r$[book a visit](/en/candidature)$r$ IN content_en) > 0
  AND position($f$[apply here](/en/candidature)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[programme une visite](/candidature)$r$, $f$[candidate ici](/candidature)$f$),
    updated_at = now()
WHERE slug = 'se-faire-reseau-geneve-arriver-seul'
  AND position($r$[programme une visite](/candidature)$r$ IN content_fr) > 0
  AND position($f$[candidate ici](/candidature)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[Request your visit in 2 min](/en/candidature)$r$, $f$[Apply in 2 min](/en/candidature)$f$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($r$[Request your visit in 2 min](/en/candidature)$r$ IN content_en) > 0
  AND position($f$[Apply in 2 min](/en/candidature)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[Demande ta visite en 2 min](/candidature)$r$, $f$[Postule en 2 min](/candidature)$f$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($r$[Demande ta visite en 2 min](/candidature)$r$ IN content_fr) > 0
  AND position($f$[Postule en 2 min](/candidature)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$the [visit request takes two minutes](/en/candidature)$r$, $f$the [application takes two minutes](/en/candidature)$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$the [visit request takes two minutes](/en/candidature)$r$ IN content_en) > 0
  AND position($f$the [application takes two minutes](/en/candidature)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$la [demande de visite prend deux minutes](/candidature)$r$, $f$la [candidature prend deux minutes](/candidature)$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$la [demande de visite prend deux minutes](/candidature)$r$ IN content_fr) > 0
  AND position($f$la [candidature prend deux minutes](/candidature)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$and [you can visit by video](/en/candidature).$r$, $f$and [you can apply remotely](/en/candidature).$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($r$and [you can visit by video](/en/candidature).$r$ IN content_en) > 0
  AND position($f$and [you can apply remotely](/en/candidature).$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$et [la visite peut se faire en vidéo](/candidature).$r$, $f$et [la candidature se fait à distance](/candidature).$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($r$et [la visite peut se faire en vidéo](/candidature).$r$ IN content_fr) > 0
  AND position($f$et [la candidature se fait à distance](/candidature).$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Request your visit via our [online form](/en/candidature).$r$, $f$Submit your application via our [online form](/en/candidature).$f$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($r$Request your visit via our [online form](/en/candidature).$r$ IN content_en) > 0
  AND position($f$Submit your application via our [online form](/en/candidature).$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$## How to book a visit if you're in an IO position$r$, $f$## How to apply if you're in an IO position$f$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($r$## How to book a visit if you're in an IO position$r$ IN content_en) > 0
  AND position($f$## How to apply if you're in an IO position$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Demande ta visite via notre [formulaire en ligne](/candidature).$r$, $f$Envoie ta candidature via notre [formulaire en ligne](/candidature).$f$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($r$Demande ta visite via notre [formulaire en ligne](/candidature).$r$ IN content_fr) > 0
  AND position($f$Envoie ta candidature via notre [formulaire en ligne](/candidature).$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$## Comment demander une visite si tu es en poste OI$r$, $f$## Comment candidater si tu es en poste OI$f$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($r$## Comment demander une visite si tu es en poste OI$r$ IN content_fr) > 0
  AND position($f$## Comment candidater si tu es en poste OI$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Before your visit, three useful reads$r$, $f$Before you apply, three useful reads$f$),
    updated_at = now()
WHERE slug = 'non-la-villa-coliving-nest-pas-une-arnaque'
  AND position($r$Before your visit, three useful reads$r$ IN content_en) > 0
  AND position($f$Before you apply, three useful reads$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$1. You [book a visit online](/en/candidature), or you message us.$r$, $f$1. You [apply online](/en/candidature), or you message us.$f$),
    updated_at = now()
WHERE slug = 'non-la-villa-coliving-nest-pas-une-arnaque'
  AND position($r$1. You [book a visit online](/en/candidature), or you message us.$r$ IN content_en) > 0
  AND position($f$1. You [apply online](/en/candidature), or you message us.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Avant ta visite, trois lectures utiles$r$, $f$Avant de candidater, trois lectures utiles$f$),
    updated_at = now()
WHERE slug = 'non-la-villa-coliving-nest-pas-une-arnaque'
  AND position($r$Avant ta visite, trois lectures utiles$r$ IN content_fr) > 0
  AND position($f$Avant de candidater, trois lectures utiles$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$1. Tu [demandes une visite en ligne](/candidature), ou tu nous écris.$r$, $f$1. Tu [candidates en ligne](/candidature), ou tu nous écris.$f$),
    updated_at = now()
WHERE slug = 'non-la-villa-coliving-nest-pas-une-arnaque'
  AND position($r$1. Tu [demandes une visite en ligne](/candidature), ou tu nous écris.$r$ IN content_fr) > 0
  AND position($f$1. Tu [candidates en ligne](/candidature), ou tu nous écris.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$or [book a visit](/en/candidature): we'll check room availability with you.$r$, $f$or [apply directly](/en/candidature) to check room availability.$f$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($r$or [book a visit](/en/candidature): we'll check room availability with you.$r$ IN content_en) > 0
  AND position($f$or [apply directly](/en/candidature) to check room availability.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$You [book your visit online](/en/candidature): first name, last name, email and phone, two minutes.$r$, $f$You fill in the online [application form](/en/candidature) presenting your profile, your professional situation, and what you expect from coliving life.$f$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($r$You [book your visit online](/en/candidature): first name, last name, email and phone, two minutes.$r$ IN content_en) > 0
  AND position($f$You fill in the online [application form](/en/candidature) presenting your profile, your professional situation, and what you expect from coliving life.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$ou [programme une visite](/candidature) : on vérifie avec toi les chambres disponibles.$r$, $f$ou [candidate directement](/candidature) pour vérifier la disponibilité des chambres.$f$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($r$ou [programme une visite](/candidature) : on vérifie avec toi les chambres disponibles.$r$ IN content_fr) > 0
  AND position($f$ou [candidate directement](/candidature) pour vérifier la disponibilité des chambres.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Tu [demandes ta visite en ligne](/candidature) : prénom, nom, email et téléphone, deux minutes.$r$, $f$Tu remplis le [formulaire de candidature](/candidature) en ligne en présentant ton profil, ta situation professionnelle et tes attentes vis-à-vis de la vie en coliving.$f$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($r$Tu [demandes ta visite en ligne](/candidature) : prénom, nom, email et téléphone, deux minutes.$r$ IN content_fr) > 0
  AND position($f$Tu remplis le [formulaire de candidature](/candidature) en ligne en présentant ton profil, ta situation professionnelle et tes attentes vis-à-vis de la vie en coliving.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[Demande ta visite en 2 minutes →](/candidature)$r$, $f$[Candidate en 2 minutes →](/candidature)$f$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($r$[Demande ta visite en 2 minutes →](/candidature)$r$ IN content_fr) > 0
  AND position($f$[Candidate en 2 minutes →](/candidature)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[book a visit online](/en/candidature)$r$, $f$[apply online](/en/candidature)$f$),
    updated_at = now()
WHERE slug = 'ia-solitude-lien-social-coliving'
  AND position($r$[book a visit online](/en/candidature)$r$ IN content_en) > 0
  AND position($f$[apply online](/en/candidature)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[demande une visite en ligne](/candidature)$r$, $f$[candidate en ligne](/candidature)$f$),
    updated_at = now()
WHERE slug = 'ia-solitude-lien-social-coliving'
  AND position($r$[demande une visite en ligne](/candidature)$r$ IN content_fr) > 0
  AND position($f$[candidate en ligne](/candidature)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[request your visit in a few minutes, for free](/candidature)$r$, $f$[apply in a few minutes, for free](/candidature)$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$[request your visit in a few minutes, for free](/candidature)$r$ IN content_en) > 0
  AND position($f$[apply in a few minutes, for free](/candidature)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[demande ta visite en quelques minutes, gratuitement](/candidature)$r$, $f$[candidate en quelques minutes, gratuitement](/candidature)$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$[demande ta visite en quelques minutes, gratuitement](/candidature)$r$ IN content_fr) > 0
  AND position($f$[candidate en quelques minutes, gratuitement](/candidature)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[Demande ta visite en 2 minutes →](/candidature)$r$, $f$[Candidate en 2 minutes →](/candidature)$f$),
    updated_at = now()
WHERE slug = 'grand-geneve-2026-nouveautes-frontaliers'
  AND position($r$[Demande ta visite en 2 minutes →](/candidature)$r$ IN content_fr) > 0
  AND position($f$[Candidate en 2 minutes →](/candidature)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$or [book a visit](/en/candidature)$r$, $f$or submit your [application](/en/candidature)$f$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($r$or [book a visit](/en/candidature)$r$ IN content_en) > 0
  AND position($f$or submit your [application](/en/candidature)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$ou [programme une visite](/candidature)$r$, $f$ou dépose ta [candidature](/candidature)$f$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($r$ou [programme une visite](/candidature)$r$ IN content_fr) > 0
  AND position($f$ou dépose ta [candidature](/candidature)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[request your visit in 2 minutes](/en/candidature)$r$, $f$[apply in 2 minutes](/en/candidature)$f$),
    updated_at = now()
WHERE slug = 'espaces-verts-coliving-lodge-annemasse'
  AND position($r$[request your visit in 2 minutes](/en/candidature)$r$ IN content_en) > 0
  AND position($f$[apply in 2 minutes](/en/candidature)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[demande ta visite en 2 minutes](/candidature)$r$, $f$[postule en 2 minutes](/candidature)$f$),
    updated_at = now()
WHERE slug = 'espaces-verts-coliving-lodge-annemasse'
  AND position($r$[demande ta visite en 2 minutes](/candidature)$r$ IN content_fr) > 0
  AND position($f$[postule en 2 minutes](/candidature)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[Book a visit at La Villa Coliving](/en/candidature)$r$, $f$[Apply to La Villa Coliving](/en/candidature)$f$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($r$[Book a visit at La Villa Coliving](/en/candidature)$r$ IN content_en) > 0
  AND position($f$[Apply to La Villa Coliving](/en/candidature)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[Programme une visite chez La Villa Coliving](/candidature)$r$, $f$[Candidate chez La Villa Coliving](/candidature)$f$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($r$[Programme une visite chez La Villa Coliving](/candidature)$r$ IN content_fr) > 0
  AND position($f$[Candidate chez La Villa Coliving](/candidature)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[request your visit in 2 minutes](/en/candidature)$r$, $f$[apply in 2 minutes](/en/candidature)$f$),
    updated_at = now()
WHERE slug = 'cout-transport-frontalier-geneve-2026'
  AND position($r$[request your visit in 2 minutes](/en/candidature)$r$ IN content_en) > 0
  AND position($f$[apply in 2 minutes](/en/candidature)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[demande ta visite en 2 minutes](/candidature)$r$, $f$[postule en 2 minutes](/candidature)$f$),
    updated_at = now()
WHERE slug = 'cout-transport-frontalier-geneve-2026'
  AND position($r$[demande ta visite en 2 minutes](/candidature)$r$ IN content_fr) > 0
  AND position($f$[postule en 2 minutes](/candidature)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[Demande ta visite en 2 minutes →](/candidature)$r$, $f$[Candidate en 2 minutes →](/candidature)$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$[Demande ta visite en 2 minutes →](/candidature)$r$ IN content_fr) > 0
  AND position($f$[Candidate en 2 minutes →](/candidature)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[Request your visit in 2 minutes](/en/candidature)$r$, $f$[Apply in 2 minutes](/en/candidature)$f$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($r$[Request your visit in 2 minutes](/en/candidature)$r$ IN content_en) > 0
  AND position($f$[Apply in 2 minutes](/en/candidature)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[Demande ta visite en 2 minutes](/candidature)$r$, $f$[Postule en 2 minutes](/candidature)$f$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($r$[Demande ta visite en 2 minutes](/candidature)$r$ IN content_fr) > 0
  AND position($f$[Postule en 2 minutes](/candidature)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[request your visit in 2 minutes, for free](/en/candidature)$r$, $f$[apply in 2 minutes, for free](/en/candidature)$f$),
    updated_at = now()
WHERE slug = 'coliving-frais-dossier-geneve-annemasse'
  AND position($r$[request your visit in 2 minutes, for free](/en/candidature)$r$ IN content_en) > 0
  AND position($f$[apply in 2 minutes, for free](/en/candidature)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[demande ta visite en 2 minutes, gratuitement](/candidature)$r$, $f$[candidate en 2 minutes, gratuitement](/candidature)$f$),
    updated_at = now()
WHERE slug = 'coliving-frais-dossier-geneve-annemasse'
  AND position($r$[demande ta visite en 2 minutes, gratuitement](/candidature)$r$ IN content_fr) > 0
  AND position($f$[candidate en 2 minutes, gratuitement](/candidature)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[Book a visit now](/en/candidature)$r$, $f$[Apply now](/en/candidature)$f$),
    updated_at = now()
WHERE slug = 'coliving-communaute-reels-amis-geneve-annemasse'
  AND position($r$[Book a visit now](/en/candidature)$r$ IN content_en) > 0
  AND position($f$[Apply now](/en/candidature)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[Programme une visite dès maintenant](/candidature)$r$, $f$[Candidate dès maintenant](/candidature)$f$),
    updated_at = now()
WHERE slug = 'coliving-communaute-reels-amis-geneve-annemasse'
  AND position($r$[Programme une visite dès maintenant](/candidature)$r$ IN content_fr) > 0
  AND position($f$[Candidate dès maintenant](/candidature)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$if a room is available: a two-minute request, a reply within 48 h$r$, $f$if a room is available: a two-minute application, a reply within 48 h$f$),
    updated_at = now()
WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif'
  AND position($r$if a room is available: a two-minute request, a reply within 48 h$r$ IN content_en) > 0
  AND position($f$if a room is available: a two-minute application, a reply within 48 h$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[a two-minute request](/en/candidature)$r$, $f$[a two-minute application](/en/candidature)$f$),
    updated_at = now()
WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif'
  AND position($r$[a two-minute request](/en/candidature)$r$ IN content_en) > 0
  AND position($f$[a two-minute application](/en/candidature)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$not in a furniture store: a two-minute request, a reply within 48 h$r$, $f$not in a furniture store: a two-minute application, a reply within 48 h$f$),
    updated_at = now()
WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif'
  AND position($r$not in a furniture store: a two-minute request, a reply within 48 h$r$ IN content_en) > 0
  AND position($f$not in a furniture store: a two-minute application, a reply within 48 h$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$si une chambre est disponible : demande en deux minutes, réponse sous 48 h$r$, $f$si une chambre est disponible : candidature en deux minutes, réponse sous 48 h$f$),
    updated_at = now()
WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif'
  AND position($r$si une chambre est disponible : demande en deux minutes, réponse sous 48 h$r$ IN content_fr) > 0
  AND position($f$si une chambre est disponible : candidature en deux minutes, réponse sous 48 h$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[demande en deux minutes](/candidature)$r$, $f$[candidature en deux minutes](/candidature)$f$),
    updated_at = now()
WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif'
  AND position($r$[demande en deux minutes](/candidature)$r$ IN content_fr) > 0
  AND position($f$[candidature en deux minutes](/candidature)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$pas dans un magasin de meubles : demande en deux minutes, réponse sous 48 h$r$, $f$pas dans un magasin de meubles : candidature en deux minutes, réponse sous 48 h$f$),
    updated_at = now()
WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif'
  AND position($r$pas dans un magasin de meubles : demande en deux minutes, réponse sous 48 h$r$ IN content_fr) > 0
  AND position($f$pas dans un magasin de meubles : candidature en deux minutes, réponse sous 48 h$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[Request your visit in 2 minutes](/en/candidature)$r$, $f$[Apply in 2 minutes](/en/candidature)$f$),
    updated_at = now()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages'
  AND position($r$[Request your visit in 2 minutes](/en/candidature)$r$ IN content_en) > 0
  AND position($f$[Apply in 2 minutes](/en/candidature)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[Demande ta visite en 2 minutes](/candidature)$r$, $f$[Postule en 2 minutes](/candidature)$f$),
    updated_at = now()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages'
  AND position($r$[Demande ta visite en 2 minutes](/candidature)$r$ IN content_fr) > 0
  AND position($f$[Postule en 2 minutes](/candidature)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[book a visit](/en/candidature)$r$, $f$[apply here](/en/candidature)$f$),
    updated_at = now()
WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve'
  AND position($r$[book a visit](/en/candidature)$r$ IN content_en) > 0
  AND position($f$[apply here](/en/candidature)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[programme une visite](/candidature)$r$, $f$[candidate ici](/candidature)$f$),
    updated_at = now()
WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve'
  AND position($r$[programme une visite](/candidature)$r$ IN content_fr) > 0
  AND position($f$[candidate ici](/candidature)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$or [request your visit in 2 minutes](https://www.lavillacoliving.com/en/candidature)$r$, $f$or submit your [application in 2 minutes](https://www.lavillacoliving.com/en/candidature)$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$or [request your visit in 2 minutes](https://www.lavillacoliving.com/en/candidature)$r$ IN content_en) > 0
  AND position($f$or submit your [application in 2 minutes](https://www.lavillacoliving.com/en/candidature)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$the best strategy is to get in touch now to get on the waiting list$r$, $f$the best strategy is to apply now to get on the waiting list$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$the best strategy is to get in touch now to get on the waiting list$r$ IN content_en) > 0
  AND position($f$the best strategy is to apply now to get on the waiting list$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$ou [demande ta visite en 2 minutes](https://www.lavillacoliving.com/candidature)$r$, $f$ou dépose ta [candidature en 2 minutes](https://www.lavillacoliving.com/candidature)$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$ou [demande ta visite en 2 minutes](https://www.lavillacoliving.com/candidature)$r$ IN content_fr) > 0
  AND position($f$ou dépose ta [candidature en 2 minutes](https://www.lavillacoliving.com/candidature)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$la meilleure stratégie est de te manifester dès maintenant pour figurer sur la liste d'attente$r$, $f$la meilleure stratégie est de candidater dès maintenant pour figurer sur la liste d'attente$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$la meilleure stratégie est de te manifester dès maintenant pour figurer sur la liste d'attente$r$ IN content_fr) > 0
  AND position($f$la meilleure stratégie est de candidater dès maintenant pour figurer sur la liste d'attente$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[book a visit](/en/candidature)$r$, $f$[apply here](/en/candidature)$f$),
    updated_at = now()
WHERE slug = 'banque-telephone-internet-frontalier-bons-plans'
  AND position($r$[book a visit](/en/candidature)$r$ IN content_en) > 0
  AND position($f$[apply here](/en/candidature)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[programme une visite](/candidature)$r$, $f$[candidate ici](/candidature)$f$),
    updated_at = now()
WHERE slug = 'banque-telephone-internet-frontalier-bons-plans'
  AND position($r$[programme une visite](/candidature)$r$ IN content_fr) > 0
  AND position($f$[candidate ici](/candidature)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[book a visit](/en/candidature)$r$, $f$[apply directly](/en/candidature)$f$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($r$[book a visit](/en/candidature)$r$ IN content_en) > 0
  AND position($f$[apply directly](/en/candidature)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[programme une visite](/candidature)$r$, $f$[postule directement](/candidature)$f$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($r$[programme une visite](/candidature)$r$ IN content_fr) > 0
  AND position($f$[postule directement](/candidature)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[Book a visit at La Villa Coliving](/en/candidature) — on site or by video, legal lease, zero nasty surprises.$r$, $f$[Apply to La Villa Coliving](/en/candidature) — on-site visits, legal lease, zero nasty surprises.$f$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($r$[Book a visit at La Villa Coliving](/en/candidature) — on site or by video, legal lease, zero nasty surprises.$r$ IN content_en) > 0
  AND position($f$[Apply to La Villa Coliving](/en/candidature) — on-site visits, legal lease, zero nasty surprises.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[Programme une visite chez La Villa Coliving](/candidature) — sur place ou en vidéo, bail légal, zéro mauvaise surprise.$r$, $f$[Candidate chez La Villa Coliving](/candidature) — visite sur place, bail légal, zéro mauvaise surprise.$f$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($r$[Programme une visite chez La Villa Coliving](/candidature) — sur place ou en vidéo, bail légal, zéro mauvaise surprise.$r$ IN content_fr) > 0
  AND position($f$[Candidate chez La Villa Coliving](/candidature) — visite sur place, bail légal, zéro mauvaise surprise.$f$ IN content_fr) = 0;

COMMIT;
*/
