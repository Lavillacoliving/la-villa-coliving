-- ============================================================================
-- L'Appart (V2-16, étape 43) — SQL n° 10 : les articles qui décrivent toute la marque nomment aussi L'Appart ; une phrase sur L'Appart dans 5 articles (budget, Annemasse).
-- Généré le 2026-11-21T09:46:16.265Z par scripts/build-slots-sql.mjs depuis scripts/lappart-articles.edits.mjs
--   · inventaire 06_INVENTAIRE_PERIMETRE.md § 3 et contenu/BLOG.md § 2 (13/11/2026), recalés sur le texte vivant du 21/11/2026 ; prix de L'Appart en jetons {{PRIX_APPART_DES}} / {{PRIX_APPART_DES_EUR}} ; minutes = APPART.transit (APPART_LOCATION_VERSION 2026-11-20)
--   · ancres vérifiées sur le contenu vivant de blog_posts (REST anon, lecture seule) le 2026-11-21T09:46:16.263Z : exactement 1 occurrence de chaque ancien texte, nouveau texte absent
-- Après la bascule de L'Appart (faite le 20/11/2026) ; sur GO de Jérôme. La page de décision « Où habiter en France… » reçoit la même phrase dans content/decision-pages (même PR).
-- Idempotent : chaque UPDATE est gardé par position(ancien) > 0 [AND position(nouveau) = 0 quand le nouveau texte n'est pas un fragment de l'ancien] — relancer le fichier est sans effet.
-- Fichier UTF-8 : guillemets « », tirets — et accents — ne pas normaliser.
-- 29 modifications · 11 articles · état en base à la génération (updated_at · longueur fr / en) :
--   budget-colocation-geneve-guide-complet · 2026-11-20T09:56:59.747586+00:00 · 18797 / 14812
--   choc-culturel-franco-suisse-expatrie-geneve · 2026-11-19T11:57:43.20886+00:00 · 10976 / 10307
--   coliving-annemasse-geneve-frontaliers-avantages · 2026-11-19T11:57:43.20886+00:00 · 12605 / 11749
--   coliving-colocation-ou-studio-geneve-comparatif · 2026-11-12T21:48:49.13221+00:00 · 14297 / 13809
--   coliving-geneve-frontaliers-guide-complet · 2026-11-19T14:27:12.782459+00:00 · 9584 / 8627
--   colocation-annemasse-ville-la-grand-ambilly · 2026-11-20T09:56:59.747586+00:00 · 8756 / 7825
--   living-in-france-working-in-geneva · 2026-11-19T11:57:43.20886+00:00 · 17559 / 15941
--   ou-habiter-en-france-quand-on-travaille-a-geneve · 2026-11-20T09:56:59.747586+00:00 · 14933 / 14750
--   quartiers-annemasse-ou-vivre-selon-profil · 2026-11-19T11:57:43.20886+00:00 · 10138 / 9036
--   temps-trajet-annemasse-geneve-par-quartier · 2026-11-19T11:57:43.20886+00:00 · 9229 / 8616
--   trouver-colocation-geneve-frontalier · 2026-11-20T09:56:59.747586+00:00 · 5983 / 5598
-- ============================================================================

BEGIN;

-- [1/29] coliving-annemasse-geneve-frontaliers-avantages (fr) · phrase · encart d'appel : L'Appart d'abord, puis les 3 maisons de coliving
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$À **La Villa Coliving**, 29 chambres meublées tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons à Ville-la-Grand, Ambilly et Annemasse$f$, $r$À **La Villa Coliving**, une colocation à Annemasse, quartier de la gare, dès **{{PRIX_APPART_DES}}/mois** ([L'Appart](/lappart), 4 chambres) et 29 chambres meublées tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons de coliving à Ville-la-Grand, Ambilly et Annemasse$r$),
    updated_at = now()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages'
  AND position($f$À **La Villa Coliving**, 29 chambres meublées tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons à Ville-la-Grand, Ambilly et Annemasse$f$ IN content_fr) > 0
  AND position($r$À **La Villa Coliving**, une colocation à Annemasse, quartier de la gare, dès **{{PRIX_APPART_DES}}/mois** ([L'Appart](/lappart), 4 chambres) et 29 chambres meublées tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons de coliving à Ville-la-Grand, Ambilly et Annemasse$r$ IN content_fr) = 0;

-- [2/29] coliving-annemasse-geneve-frontaliers-avantages (en) · phrase · call-out: L'Appart first, then the 3 coliving houses
UPDATE blog_posts
SET content_en = replace(content_en, $f$At **La Villa Coliving**, 29 furnished all-inclusive rooms from **{{PRIX_DES}}/month** across 3 houses in Ville-la-Grand, Ambilly and Annemasse$f$, $r$At **La Villa Coliving**, a flatshare in Annemasse, near the station, from **{{PRIX_APPART_DES}}/month** ([L'Appart](/en/lappart), 4 rooms) and 29 furnished all-inclusive rooms from **{{PRIX_DES}}/month** across 3 coliving houses in Ville-la-Grand, Ambilly and Annemasse$r$),
    updated_at = now()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages'
  AND position($f$At **La Villa Coliving**, 29 furnished all-inclusive rooms from **{{PRIX_DES}}/month** across 3 houses in Ville-la-Grand, Ambilly and Annemasse$f$ IN content_en) > 0
  AND position($r$At **La Villa Coliving**, a flatshare in Annemasse, near the station, from **{{PRIX_APPART_DES}}/month** ([L'Appart](/en/lappart), 4 rooms) and 29 furnished all-inclusive rooms from **{{PRIX_DES}}/month** across 3 coliving houses in Ville-la-Grand, Ambilly and Annemasse$r$ IN content_en) = 0;

-- [3/29] colocation-annemasse-ville-la-grand-ambilly (fr) · phrase · encart d'appel : L'Appart d'abord, puis les 3 maisons de coliving
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$À **La Villa Coliving**, 29 chambres meublées tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons à Ville-la-Grand, Ambilly et Annemasse$f$, $r$À **La Villa Coliving**, une colocation à Annemasse, quartier de la gare, dès **{{PRIX_APPART_DES}}/mois** ([L'Appart](/lappart), 4 chambres) et 29 chambres meublées tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons de coliving à Ville-la-Grand, Ambilly et Annemasse$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$À **La Villa Coliving**, 29 chambres meublées tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons à Ville-la-Grand, Ambilly et Annemasse$f$ IN content_fr) > 0
  AND position($r$À **La Villa Coliving**, une colocation à Annemasse, quartier de la gare, dès **{{PRIX_APPART_DES}}/mois** ([L'Appart](/lappart), 4 chambres) et 29 chambres meublées tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons de coliving à Ville-la-Grand, Ambilly et Annemasse$r$ IN content_fr) = 0;

-- [4/29] colocation-annemasse-ville-la-grand-ambilly (en) · phrase · call-out: L'Appart first, then the 3 coliving houses
UPDATE blog_posts
SET content_en = replace(content_en, $f$At **La Villa Coliving**, 29 furnished all-inclusive rooms from **{{PRIX_DES}}/month** across 3 houses in Ville-la-Grand, Ambilly and Annemasse$f$, $r$At **La Villa Coliving**, a flatshare in Annemasse, near the station, from **{{PRIX_APPART_DES}}/month** ([L'Appart](/en/lappart), 4 rooms) and 29 furnished all-inclusive rooms from **{{PRIX_DES}}/month** across 3 coliving houses in Ville-la-Grand, Ambilly and Annemasse$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$At **La Villa Coliving**, 29 furnished all-inclusive rooms from **{{PRIX_DES}}/month** across 3 houses in Ville-la-Grand, Ambilly and Annemasse$f$ IN content_en) > 0
  AND position($r$At **La Villa Coliving**, a flatshare in Annemasse, near the station, from **{{PRIX_APPART_DES}}/month** ([L'Appart](/en/lappart), 4 rooms) and 29 furnished all-inclusive rooms from **{{PRIX_DES}}/month** across 3 coliving houses in Ville-la-Grand, Ambilly and Annemasse$r$ IN content_en) = 0;

-- [5/29] colocation-annemasse-ville-la-grand-ambilly (fr) · phrase · phrase de commune de L'Appart après celle du Lodge (« Annemasse centre »)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte.$f$, $r$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte. Toujours à Annemasse, [L'Appart](/lappart) de La Villa Coliving (4 chambres en colocation, quartier de la gare) est à 5 min à pied de la gare et à 2 min du tram 17 — Genève-Eaux-Vives en 13 min porte-à-porte.$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte.$f$ IN content_fr) > 0
  AND position($r$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte. Toujours à Annemasse, [L'Appart](/lappart) de La Villa Coliving (4 chambres en colocation, quartier de la gare) est à 5 min à pied de la gare et à 2 min du tram 17 — Genève-Eaux-Vives en 13 min porte-à-porte.$r$ IN content_fr) = 0;

-- [6/29] colocation-annemasse-ville-la-grand-ambilly (en) · phrase · L'Appart's local sentence after Le Lodge's (« Annemasse center »)
UPDATE blog_posts
SET content_en = replace(content_en, $f$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door.$f$, $r$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door. Also in Annemasse, [L'Appart](/en/lappart) by La Villa Coliving (4 rooms in a flatshare, near the station) is a 5-minute walk from the station and a 2-minute walk from tram 17 — Geneva Eaux-Vives in 13 minutes door to door.$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door.$f$ IN content_en) > 0
  AND position($r$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door. Also in Annemasse, [L'Appart](/en/lappart) by La Villa Coliving (4 rooms in a flatshare, near the station) is a 5-minute walk from the station and a 2-minute walk from tram 17 — Geneva Eaux-Vives in 13 minutes door to door.$r$ IN content_en) = 0;

-- [7/29] coliving-geneve-frontaliers-guide-complet (fr) · phrase · présentation de l'offre : 3 maisons de coliving, puis L'Appart
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$— 29 chambres privées meublées dans 3 maisons (Ville-la-Grand, Ambilly, Annemasse), tout inclus dès **{{PRIX_DES}}/mois**, sans frais de dossier.$f$, $r$— 29 chambres privées meublées dans 3 maisons de coliving (Ville-la-Grand, Ambilly, Annemasse), tout inclus dès **{{PRIX_DES}}/mois**, et [L'Appart](/lappart), colocation à Annemasse, quartier de la gare, 4 chambres dès **{{PRIX_APPART_DES}}/mois**, sans frais de dossier.$r$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($f$— 29 chambres privées meublées dans 3 maisons (Ville-la-Grand, Ambilly, Annemasse), tout inclus dès **{{PRIX_DES}}/mois**, sans frais de dossier.$f$ IN content_fr) > 0
  AND position($r$— 29 chambres privées meublées dans 3 maisons de coliving (Ville-la-Grand, Ambilly, Annemasse), tout inclus dès **{{PRIX_DES}}/mois**, et [L'Appart](/lappart), colocation à Annemasse, quartier de la gare, 4 chambres dès **{{PRIX_APPART_DES}}/mois**, sans frais de dossier.$r$ IN content_fr) = 0;

-- [8/29] coliving-geneve-frontaliers-guide-complet (en) · phrase · offer: 3 coliving houses, then L'Appart
UPDATE blog_posts
SET content_en = replace(content_en, $f$— 29 private furnished rooms across 3 houses (Ville-la-Grand, Ambilly, Annemasse), all-inclusive from **{{PRIX_DES}}/month**, no application fee.$f$, $r$— 29 private furnished rooms across 3 coliving houses (Ville-la-Grand, Ambilly, Annemasse), all-inclusive from **{{PRIX_DES}}/month**, and [L'Appart](/en/lappart), a flatshare in Annemasse near the station, 4 rooms from **{{PRIX_APPART_DES}}/month**, no application fee.$r$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($f$— 29 private furnished rooms across 3 houses (Ville-la-Grand, Ambilly, Annemasse), all-inclusive from **{{PRIX_DES}}/month**, no application fee.$f$ IN content_en) > 0
  AND position($r$— 29 private furnished rooms across 3 coliving houses (Ville-la-Grand, Ambilly, Annemasse), all-inclusive from **{{PRIX_DES}}/month**, and [L'Appart](/en/lappart), a flatshare in Annemasse near the station, 4 rooms from **{{PRIX_APPART_DES}}/month**, no application fee.$r$ IN content_en) = 0;

-- [9/29] living-in-france-working-in-geneva (fr) · phrase · inventaire de la marque : L'Appart après les 3 maisons, sans piscine
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$les espaces communs (salon, cuisine, piscine, sauna, salle de sport) sont partagés.$f$, $r$les espaces communs (salon, cuisine, piscine, sauna, salle de sport) sont partagés. Et [L'Appart](/lappart), colocation à Annemasse, quartier de la gare : un appartement de 4 chambres, sans piscine, sauna ni salle de sport.$r$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($f$les espaces communs (salon, cuisine, piscine, sauna, salle de sport) sont partagés.$f$ IN content_fr) > 0
  AND position($r$les espaces communs (salon, cuisine, piscine, sauna, salle de sport) sont partagés. Et [L'Appart](/lappart), colocation à Annemasse, quartier de la gare : un appartement de 4 chambres, sans piscine, sauna ni salle de sport.$r$ IN content_fr) = 0;

-- [10/29] living-in-france-working-in-geneva (en) · phrase · brand inventory: L'Appart after the 3 houses, no pool
UPDATE blog_posts
SET content_en = replace(content_en, $f$the shared spaces (living room, kitchen, pool, sauna, gym) are communal.$f$, $r$the shared spaces (living room, kitchen, pool, sauna, gym) are communal. And [L'Appart](/en/lappart), a flatshare in Annemasse, near the station: a 4-room flat, with no pool, sauna or gym.$r$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($f$the shared spaces (living room, kitchen, pool, sauna, gym) are communal.$f$ IN content_en) > 0
  AND position($r$the shared spaces (living room, kitchen, pool, sauna, gym) are communal. And [L'Appart](/en/lappart), a flatshare in Annemasse, near the station: a 4-room flat, with no pool, sauna or gym.$r$ IN content_en) = 0;

-- [11/29] temps-trajet-annemasse-geneve-par-quartier (fr) · phrase · 29 chambres = les maisons
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$C'est là que se trouvent 10 des 29 chambres de La Villa Coliving.$f$, $r$C'est là que se trouvent 10 des 29 chambres des maisons de La Villa Coliving.$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$C'est là que se trouvent 10 des 29 chambres de La Villa Coliving.$f$ IN content_fr) > 0
  AND position($r$C'est là que se trouvent 10 des 29 chambres des maisons de La Villa Coliving.$r$ IN content_fr) = 0;

-- [12/29] temps-trajet-annemasse-geneve-par-quartier (en) · phrase · 29 rooms = the houses
UPDATE blog_posts
SET content_en = replace(content_en, $f$It's home to 10 of La Villa Coliving's 29 rooms.$f$, $r$It's home to 10 of the 29 rooms in La Villa Coliving's houses.$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$It's home to 10 of La Villa Coliving's 29 rooms.$f$ IN content_en) > 0
  AND position($r$It's home to 10 of the 29 rooms in La Villa Coliving's houses.$r$ IN content_en) = 0;

-- [13/29] trouver-colocation-geneve-frontalier (fr) · phrase · budget : L'Appart entre la location classique et le coliving (prix en jetons, euros à part)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Pour cadrer ton budget précisément selon ton salaire$f$, $r$Entre les deux, [L'Appart](/lappart), la colocation de La Villa Coliving à Annemasse, quartier de la gare, loue ses chambres dès {{PRIX_APPART_DES}} par mois, charges comprises. En euros : dès {{PRIX_APPART_DES_EUR}}. Pour cadrer ton budget précisément selon ton salaire$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$Pour cadrer ton budget précisément selon ton salaire$f$ IN content_fr) > 0
  AND position($r$Entre les deux, [L'Appart](/lappart), la colocation de La Villa Coliving à Annemasse, quartier de la gare, loue ses chambres dès {{PRIX_APPART_DES}} par mois, charges comprises. En euros : dès {{PRIX_APPART_DES_EUR}}. Pour cadrer ton budget précisément selon ton salaire$r$ IN content_fr) = 0;

-- [14/29] trouver-colocation-geneve-frontalier (en) · phrase · budget: L'Appart between a classic rental and coliving (token prices, euros apart)
UPDATE blog_posts
SET content_en = replace(content_en, $f$To frame your budget precisely by salary$f$, $r$In between, [L'Appart](/en/lappart), La Villa Coliving's flatshare in Annemasse, near the station, lets its rooms from {{PRIX_APPART_DES}} a month, bills included. In euros: from {{PRIX_APPART_DES_EUR}}. To frame your budget precisely by salary$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$To frame your budget precisely by salary$f$ IN content_en) > 0
  AND position($r$In between, [L'Appart](/en/lappart), La Villa Coliving's flatshare in Annemasse, near the station, lets its rooms from {{PRIX_APPART_DES}} a month, bills included. In euros: from {{PRIX_APPART_DES_EUR}}. To frame your budget precisely by salary$r$ IN content_en) = 0;

-- [15/29] trouver-colocation-geneve-frontalier (fr) · phrase · les maisons sont des maisons de coliving
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$tout inclus dans trois maisons situées côté France$f$, $r$tout inclus dans trois maisons de coliving situées côté France$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$tout inclus dans trois maisons situées côté France$f$ IN content_fr) > 0
  AND position($r$tout inclus dans trois maisons de coliving situées côté France$r$ IN content_fr) = 0;

-- [16/29] trouver-colocation-geneve-frontalier (en) · phrase · the houses are coliving houses
UPDATE blog_posts
SET content_en = replace(content_en, $f$all-inclusive shared rooms in three houses located on the French side$f$, $r$all-inclusive shared rooms in three coliving houses located on the French side$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$all-inclusive shared rooms in three houses located on the French side$f$ IN content_en) > 0
  AND position($r$all-inclusive shared rooms in three coliving houses located on the French side$r$ IN content_en) = 0;

-- [17/29] trouver-colocation-geneve-frontalier (fr) · phrase · la colocation de la marque : L'Appart, sans prix ici (le prix est plus haut)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$À partir de {{PRIX_DES}}/mois.$f$, $r$À partir de {{PRIX_DES}}/mois. Et [L'Appart](/lappart), notre colocation de 4 chambres à Annemasse, quartier de la gare.$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$À partir de {{PRIX_DES}}/mois.$f$ IN content_fr) > 0
  AND position($r$À partir de {{PRIX_DES}}/mois. Et [L'Appart](/lappart), notre colocation de 4 chambres à Annemasse, quartier de la gare.$r$ IN content_fr) = 0;

-- [18/29] trouver-colocation-geneve-frontalier (en) · phrase · the brand's flatshare: L'Appart, no price here (given above)
UPDATE blog_posts
SET content_en = replace(content_en, $f$From {{PRIX_DES}}/month.$f$, $r$From {{PRIX_DES}}/month. And [L'Appart](/en/lappart), our 4-room flatshare in Annemasse, near the station.$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$From {{PRIX_DES}}/month.$f$ IN content_en) > 0
  AND position($r$From {{PRIX_DES}}/month. And [L'Appart](/en/lappart), our 4-room flatshare in Annemasse, near the station.$r$ IN content_en) = 0;

-- [19/29] choc-culturel-franco-suisse-expatrie-geneve (en) · phrase · alignment: the 29 rooms are the houses' (the French already says so)
UPDATE blog_posts
SET content_en = replace(content_en, $f$That's what La Villa Coliving offers: 29 rooms in three houses on the French side$f$, $r$That's what La Villa Coliving's houses offer: 29 rooms in three houses on the French side$r$),
    updated_at = now()
WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve'
  AND position($f$That's what La Villa Coliving offers: 29 rooms in three houses on the French side$f$ IN content_en) > 0
  AND position($r$That's what La Villa Coliving's houses offer: 29 rooms in three houses on the French side$r$ IN content_en) = 0;

-- [20/29] budget-colocation-geneve-guide-complet (fr) · phrase · budget : L'Appart entre la colocation classique et le coliving (euros à part)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$**Pas encore de fiche de salaire suisse ?**$f$, $r$Entre la colocation classique et le coliving, il y a aussi [L'Appart](/lappart), la colocation de La Villa Coliving à Annemasse, dans le quartier de la gare : 4 chambres meublées dès {{PRIX_APPART_DES}} par mois, charges, fibre, streaming et ménage des communs compris. En euros : dès {{PRIX_APPART_DES_EUR}}.

**Pas encore de fiche de salaire suisse ?**$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$**Pas encore de fiche de salaire suisse ?**$f$ IN content_fr) > 0
  AND position($r$Entre la colocation classique et le coliving, il y a aussi [L'Appart](/lappart), la colocation de La Villa Coliving à Annemasse, dans le quartier de la gare : 4 chambres meublées dès {{PRIX_APPART_DES}} par mois, charges, fibre, streaming et ménage des communs compris. En euros : dès {{PRIX_APPART_DES_EUR}}.

**Pas encore de fiche de salaire suisse ?**$r$ IN content_fr) = 0;

-- [21/29] budget-colocation-geneve-guide-complet (en) · phrase · budget: L'Appart between a standard flatshare and coliving (euros apart)
UPDATE blog_posts
SET content_en = replace(content_en, $f$**No Swiss payslip yet?**$f$, $r$Between a standard flatshare and coliving, there's also [L'Appart](/en/lappart), La Villa Coliving's flatshare in Annemasse, near the station: 4 furnished rooms from {{PRIX_APPART_DES}} a month, with bills, fibre, streaming and cleaning of the shared areas included. In euros: from {{PRIX_APPART_DES_EUR}}.

**No Swiss payslip yet?**$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$**No Swiss payslip yet?**$f$ IN content_en) > 0
  AND position($r$Between a standard flatshare and coliving, there's also [L'Appart](/en/lappart), La Villa Coliving's flatshare in Annemasse, near the station: 4 furnished rooms from {{PRIX_APPART_DES}} a month, with bills, fibre, streaming and cleaning of the shared areas included. In euros: from {{PRIX_APPART_DES_EUR}}.

**No Swiss payslip yet?**$r$ IN content_en) = 0;

-- [22/29] quartiers-annemasse-ou-vivre-selon-profil (fr) · phrase · profil 1 : la phrase de commune de L'Appart avant « Tu commandes ton train »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Tu commandes ton train, pas l'inverse.$f$, $r$Toujours à Annemasse, [L'Appart](/lappart) de La Villa Coliving (4 chambres en colocation, quartier de la gare) est à 5 min à pied de la gare et à 2 min du tram 17 — Genève-Eaux-Vives en 13 min porte-à-porte. Tu commandes ton train, pas l'inverse.$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$Tu commandes ton train, pas l'inverse.$f$ IN content_fr) > 0
  AND position($r$Toujours à Annemasse, [L'Appart](/lappart) de La Villa Coliving (4 chambres en colocation, quartier de la gare) est à 5 min à pied de la gare et à 2 min du tram 17 — Genève-Eaux-Vives en 13 min porte-à-porte. Tu commandes ton train, pas l'inverse.$r$ IN content_fr) = 0;

-- [23/29] quartiers-annemasse-ou-vivre-selon-profil (en) · phrase · profile 1: L'Appart's local sentence at the end of « Where to aim »
UPDATE blog_posts
SET content_en = replace(content_en, $f$door to door.

**The real test:** measure the actual walking time$f$, $r$door to door. Also in Annemasse, [L'Appart](/en/lappart) by La Villa Coliving (4 rooms in a flatshare, near the station) is a 5-minute walk from the station and a 2-minute walk from tram 17 — Geneva Eaux-Vives in 13 minutes door to door.

**The real test:** measure the actual walking time$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$door to door.

**The real test:** measure the actual walking time$f$ IN content_en) > 0
  AND position($r$door to door. Also in Annemasse, [L'Appart](/en/lappart) by La Villa Coliving (4 rooms in a flatshare, near the station) is a 5-minute walk from the station and a 2-minute walk from tram 17 — Geneva Eaux-Vives in 13 minutes door to door.

**The real test:** measure the actual walking time$r$ IN content_en) = 0;

-- [24/29] ou-habiter-en-france-quand-on-travaille-a-geneve (fr) · phrase · profil 4 (budget serré) : L'Appart, forme compacte CHF/€ des pages de décision
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Pour un premier poste, deux pièges reviennent$f$, $r$Si ton budget est vraiment serré, regarde [L'Appart](/lappart), la colocation de La Villa Coliving à Annemasse, quartier de la gare : des chambres dès {{PRIX_APPART_DES}}/{{PRIX_APPART_DES_EUR}} par mois, charges, fibre, streaming et ménage des communs compris.

Pour un premier poste, deux pièges reviennent$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($f$Pour un premier poste, deux pièges reviennent$f$ IN content_fr) > 0
  AND position($r$Si ton budget est vraiment serré, regarde [L'Appart](/lappart), la colocation de La Villa Coliving à Annemasse, quartier de la gare : des chambres dès {{PRIX_APPART_DES}}/{{PRIX_APPART_DES_EUR}} par mois, charges, fibre, streaming et ménage des communs compris.

Pour un premier poste, deux pièges reviennent$r$ IN content_fr) = 0;

-- [25/29] ou-habiter-en-france-quand-on-travaille-a-geneve (en) · phrase · profile 4 (tight budget): L'Appart, compact CHF/€ form of decision pages
UPDATE blog_posts
SET content_en = replace(content_en, $f$For a first job, two traps come up again and again$f$, $r$If your budget is really tight, have a look at [L'Appart](/en/lappart), La Villa Coliving's flatshare in Annemasse, near the station: rooms from {{PRIX_APPART_DES}}/{{PRIX_APPART_DES_EUR}} a month, with bills, fibre, streaming and cleaning of the shared areas included.

For a first job, two traps come up again and again$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($f$For a first job, two traps come up again and again$f$ IN content_en) > 0
  AND position($r$If your budget is really tight, have a look at [L'Appart](/en/lappart), La Villa Coliving's flatshare in Annemasse, near the station: rooms from {{PRIX_APPART_DES}}/{{PRIX_APPART_DES_EUR}} a month, with bills, fibre, streaming and cleaning of the shared areas included.

For a first job, two traps come up again and again$r$ IN content_en) = 0;

-- [26/29] coliving-colocation-ou-studio-geneve-comparatif (fr) · phrase · couples : la suite de L'Appart se loue à deux (page de décision)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Un couple qui veut partager une seule chambre, ou une famille, a besoin d'un logement entier : un deux-pièces meublé côté France se loue 1 200 à 1 500 € par mois charges comprises (annonces, septembre 2026). Chez nous, une chambre accueille une seule personne ; un couple peut venir en prenant deux chambres.$f$, $r$Une famille a besoin d'un logement entier : un deux-pièces meublé côté France se loue 1 200 à 1 500 € par mois charges comprises (annonces, septembre 2026). Dans nos maisons, une chambre accueille une seule personne ; un couple peut venir en prenant deux chambres, ou partager la suite de [L'Appart](/lappart), notre colocation à Annemasse, quartier de la gare.$r$),
    updated_at = now()
WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif'
  AND position($f$Un couple qui veut partager une seule chambre, ou une famille, a besoin d'un logement entier : un deux-pièces meublé côté France se loue 1 200 à 1 500 € par mois charges comprises (annonces, septembre 2026). Chez nous, une chambre accueille une seule personne ; un couple peut venir en prenant deux chambres.$f$ IN content_fr) > 0
  AND position($r$Une famille a besoin d'un logement entier : un deux-pièces meublé côté France se loue 1 200 à 1 500 € par mois charges comprises (annonces, septembre 2026). Dans nos maisons, une chambre accueille une seule personne ; un couple peut venir en prenant deux chambres, ou partager la suite de [L'Appart](/lappart), notre colocation à Annemasse, quartier de la gare.$r$ IN content_fr) = 0;

-- [27/29] coliving-colocation-ou-studio-geneve-comparatif (en) · phrase · couples: L'Appart's suite is let to two people (decision page)
UPDATE blog_posts
SET content_en = replace(content_en, $f$A couple who want to share a single room, or a family, need a whole home: a furnished one-bedroom flat on the French side rents for €1,200 to €1,500 a month including charges (listings, September 2026). With us, each room is let to one person; a couple can come by taking two rooms.$f$, $r$A family needs a whole home: a furnished one-bedroom flat on the French side rents for €1,200 to €1,500 a month including charges (listings, September 2026). In our houses, each room is let to one person; a couple can come by taking two rooms, or share the suite at [L'Appart](/en/lappart), our flatshare in Annemasse, near the station.$r$),
    updated_at = now()
WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif'
  AND position($f$A couple who want to share a single room, or a family, need a whole home: a furnished one-bedroom flat on the French side rents for €1,200 to €1,500 a month including charges (listings, September 2026). With us, each room is let to one person; a couple can come by taking two rooms.$f$ IN content_en) > 0
  AND position($r$A family needs a whole home: a furnished one-bedroom flat on the French side rents for €1,200 to €1,500 a month including charges (listings, September 2026). In our houses, each room is let to one person; a couple can come by taking two rooms, or share the suite at [L'Appart](/en/lappart), our flatshare in Annemasse, near the station.$r$ IN content_en) = 0;

-- [28/29] ou-habiter-en-france-quand-on-travaille-a-geneve (fr) · phrase · couples : la règle « une chambre, une personne » est celle des maisons (page de décision)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$chez nous, une chambre accueille une seule personne (un couple peut en prendre deux).$f$, $r$dans nos maisons, une chambre accueille une seule personne (un couple peut en prendre deux), et à L'Appart, seule la suite se loue à deux.$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($f$chez nous, une chambre accueille une seule personne (un couple peut en prendre deux).$f$ IN content_fr) > 0
  AND position($r$dans nos maisons, une chambre accueille une seule personne (un couple peut en prendre deux), et à L'Appart, seule la suite se loue à deux.$r$ IN content_fr) = 0;

-- [29/29] ou-habiter-en-france-quand-on-travaille-a-geneve (en) · phrase · couples: « one room, one person » is the houses' rule (decision page)
UPDATE blog_posts
SET content_en = replace(content_en, $f$with us, each room is for one person (a couple can take two).$f$, $r$in our houses, each room is for one person (a couple can take two), and at L'Appart only the suite is let to two people.$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($f$with us, each room is for one person (a couple can take two).$f$ IN content_en) > 0
  AND position($r$in our houses, each room is for one person (a couple can take two), and at L'Appart only the suite is let to two people.$r$ IN content_en) = 0;

-- ── Aperçu des ancrages (ancien → nouveau, première ligne de chaque texte) ──
-- [1] coliving-annemasse-geneve-frontaliers-avantages/fr · phrase : « À **La Villa Coliving**, 29 chambres meublées tout inclus dès **{{PRIX_… » → « À **La Villa Coliving**, une colocation à Annemasse, quartier de la gar… »
-- [2] coliving-annemasse-geneve-frontaliers-avantages/en · phrase : « At **La Villa Coliving**, 29 furnished all-inclusive rooms from **{{PRI… » → « At **La Villa Coliving**, a flatshare in Annemasse, near the station, f… »
-- [3] colocation-annemasse-ville-la-grand-ambilly/fr · phrase : « À **La Villa Coliving**, 29 chambres meublées tout inclus dès **{{PRIX_… » → « À **La Villa Coliving**, une colocation à Annemasse, quartier de la gar… »
-- [4] colocation-annemasse-ville-la-grand-ambilly/en · phrase : « At **La Villa Coliving**, 29 furnished all-inclusive rooms from **{{PRI… » → « At **La Villa Coliving**, a flatshare in Annemasse, near the station, f… »
-- [5] colocation-annemasse-ville-la-grand-ambilly/fr · phrase : « À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier … » → « À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier … »
-- [6] colocation-annemasse-ville-la-grand-ambilly/en · phrase : « In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny d… » → « In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny d… »
-- [7] coliving-geneve-frontaliers-guide-complet/fr · phrase : « — 29 chambres privées meublées dans 3 maisons (Ville-la-Grand, Ambilly,… » → « — 29 chambres privées meublées dans 3 maisons de coliving (Ville-la-Gra… »
-- [8] coliving-geneve-frontaliers-guide-complet/en · phrase : « — 29 private furnished rooms across 3 houses (Ville-la-Grand, Ambilly, … » → « — 29 private furnished rooms across 3 coliving houses (Ville-la-Grand, … »
-- [9] living-in-france-working-in-geneva/fr · phrase : « les espaces communs (salon, cuisine, piscine, sauna, salle de sport) so… » → « les espaces communs (salon, cuisine, piscine, sauna, salle de sport) so… »
-- [10] living-in-france-working-in-geneva/en · phrase : « the shared spaces (living room, kitchen, pool, sauna, gym) are communal. » → « the shared spaces (living room, kitchen, pool, sauna, gym) are communal… »
-- [11] temps-trajet-annemasse-geneve-par-quartier/fr · phrase : « C'est là que se trouvent 10 des 29 chambres de La Villa Coliving. » → « C'est là que se trouvent 10 des 29 chambres des maisons de La Villa Col… »
-- [12] temps-trajet-annemasse-geneve-par-quartier/en · phrase : « It's home to 10 of La Villa Coliving's 29 rooms. » → « It's home to 10 of the 29 rooms in La Villa Coliving's houses. »
-- [13] trouver-colocation-geneve-frontalier/fr · phrase : « Pour cadrer ton budget précisément selon ton salaire » → « Entre les deux, [L'Appart](/lappart), la colocation de La Villa Colivin… »
-- [14] trouver-colocation-geneve-frontalier/en · phrase : « To frame your budget precisely by salary » → « In between, [L'Appart](/en/lappart), La Villa Coliving's flatshare in A… »
-- [15] trouver-colocation-geneve-frontalier/fr · phrase : « tout inclus dans trois maisons situées côté France » → « tout inclus dans trois maisons de coliving situées côté France »
-- [16] trouver-colocation-geneve-frontalier/en · phrase : « all-inclusive shared rooms in three houses located on the French side » → « all-inclusive shared rooms in three coliving houses located on the Fren… »
-- [17] trouver-colocation-geneve-frontalier/fr · phrase : « À partir de {{PRIX_DES}}/mois. » → « À partir de {{PRIX_DES}}/mois. Et [L'Appart](/lappart), notre colocatio… »
-- [18] trouver-colocation-geneve-frontalier/en · phrase : « From {{PRIX_DES}}/month. » → « From {{PRIX_DES}}/month. And [L'Appart](/en/lappart), our 4-room flatsh… »
-- [19] choc-culturel-franco-suisse-expatrie-geneve/en · phrase : « That's what La Villa Coliving offers: 29 rooms in three houses on the F… » → « That's what La Villa Coliving's houses offer: 29 rooms in three houses … »
-- [20] budget-colocation-geneve-guide-complet/fr · phrase : « **Pas encore de fiche de salaire suisse ?** » → « Entre la colocation classique et le coliving, il y a aussi [L'Appart](/… »
-- [21] budget-colocation-geneve-guide-complet/en · phrase : « **No Swiss payslip yet?** » → « Between a standard flatshare and coliving, there's also [L'Appart](/en/… »
-- [22] quartiers-annemasse-ou-vivre-selon-profil/fr · phrase : « Tu commandes ton train, pas l'inverse. » → « Toujours à Annemasse, [L'Appart](/lappart) de La Villa Coliving (4 cham… »
-- [23] quartiers-annemasse-ou-vivre-selon-profil/en · phrase : « door to door.⏎⏎**The real test:** measure the actual walking time » → « door to door. Also in Annemasse, [L'Appart](/en/lappart) by La Villa Co… »
-- [24] ou-habiter-en-france-quand-on-travaille-a-geneve/fr · phrase : « Pour un premier poste, deux pièges reviennent » → « Si ton budget est vraiment serré, regarde [L'Appart](/lappart), la colo… »
-- [25] ou-habiter-en-france-quand-on-travaille-a-geneve/en · phrase : « For a first job, two traps come up again and again » → « If your budget is really tight, have a look at [L'Appart](/en/lappart),… »
-- [26] coliving-colocation-ou-studio-geneve-comparatif/fr · phrase : « Un couple qui veut partager une seule chambre, ou une famille, a besoin… » → « Une famille a besoin d'un logement entier : un deux-pièces meublé côté … »
-- [27] coliving-colocation-ou-studio-geneve-comparatif/en · phrase : « A couple who want to share a single room, or a family, need a whole hom… » → « A family needs a whole home: a furnished one-bedroom flat on the French… »
-- [28] ou-habiter-en-france-quand-on-travaille-a-geneve/fr · phrase : « chez nous, une chambre accueille une seule personne (un couple peut en … » → « dans nos maisons, une chambre accueille une seule personne (un couple p… »
-- [29] ou-habiter-en-france-quand-on-travaille-a-geneve/en · phrase : « with us, each room is for one person (a couple can take two). » → « in our houses, each room is for one person (a couple can take two), and… »

COMMIT;

-- ── Vérification (lecture seule) : une ligne par article ; fr_ok / en_ok = true quand toutes les modifications de la langue sont en place, NULL = langue non touchée.
SELECT slug,
  CASE slug
    WHEN 'budget-colocation-geneve-guide-complet' THEN (position($r$Entre la colocation classique et le coliving, il y a aussi [L'Appart](/lappart), la colocation de La Villa Coliving à Annemasse, dans le quartier de la gare : 4 chambres meublées dès {{PRIX_APPART_DES}} par mois, charges, fibre, streaming et ménage des communs compris. En euros : dès {{PRIX_APPART_DES_EUR}}.

**Pas encore de fiche de salaire suisse ?**$r$ IN content_fr) > 0)
    WHEN 'coliving-annemasse-geneve-frontaliers-avantages' THEN (position($f$À **La Villa Coliving**, 29 chambres meublées tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons à Ville-la-Grand, Ambilly et Annemasse$f$ IN content_fr) = 0)
    WHEN 'coliving-colocation-ou-studio-geneve-comparatif' THEN (position($f$Un couple qui veut partager une seule chambre, ou une famille, a besoin d'un logement entier : un deux-pièces meublé côté France se loue 1 200 à 1 500 € par mois charges comprises (annonces, septembre 2026). Chez nous, une chambre accueille une seule personne ; un couple peut venir en prenant deux chambres.$f$ IN content_fr) = 0)
    WHEN 'coliving-geneve-frontaliers-guide-complet' THEN (position($f$— 29 chambres privées meublées dans 3 maisons (Ville-la-Grand, Ambilly, Annemasse), tout inclus dès **{{PRIX_DES}}/mois**, sans frais de dossier.$f$ IN content_fr) = 0)
    WHEN 'colocation-annemasse-ville-la-grand-ambilly' THEN (position($f$À **La Villa Coliving**, 29 chambres meublées tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons à Ville-la-Grand, Ambilly et Annemasse$f$ IN content_fr) = 0
      AND position($r$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte. Toujours à Annemasse, [L'Appart](/lappart) de La Villa Coliving (4 chambres en colocation, quartier de la gare) est à 5 min à pied de la gare et à 2 min du tram 17 — Genève-Eaux-Vives en 13 min porte-à-porte.$r$ IN content_fr) > 0)
    WHEN 'living-in-france-working-in-geneva' THEN (position($r$les espaces communs (salon, cuisine, piscine, sauna, salle de sport) sont partagés. Et [L'Appart](/lappart), colocation à Annemasse, quartier de la gare : un appartement de 4 chambres, sans piscine, sauna ni salle de sport.$r$ IN content_fr) > 0)
    WHEN 'ou-habiter-en-france-quand-on-travaille-a-geneve' THEN (position($r$Si ton budget est vraiment serré, regarde [L'Appart](/lappart), la colocation de La Villa Coliving à Annemasse, quartier de la gare : des chambres dès {{PRIX_APPART_DES}}/{{PRIX_APPART_DES_EUR}} par mois, charges, fibre, streaming et ménage des communs compris.

Pour un premier poste, deux pièges reviennent$r$ IN content_fr) > 0
      AND position($f$chez nous, une chambre accueille une seule personne (un couple peut en prendre deux).$f$ IN content_fr) = 0)
    WHEN 'quartiers-annemasse-ou-vivre-selon-profil' THEN (position($r$Toujours à Annemasse, [L'Appart](/lappart) de La Villa Coliving (4 chambres en colocation, quartier de la gare) est à 5 min à pied de la gare et à 2 min du tram 17 — Genève-Eaux-Vives en 13 min porte-à-porte. Tu commandes ton train, pas l'inverse.$r$ IN content_fr) > 0)
    WHEN 'temps-trajet-annemasse-geneve-par-quartier' THEN (position($f$C'est là que se trouvent 10 des 29 chambres de La Villa Coliving.$f$ IN content_fr) = 0)
    WHEN 'trouver-colocation-geneve-frontalier' THEN (position($r$Entre les deux, [L'Appart](/lappart), la colocation de La Villa Coliving à Annemasse, quartier de la gare, loue ses chambres dès {{PRIX_APPART_DES}} par mois, charges comprises. En euros : dès {{PRIX_APPART_DES_EUR}}. Pour cadrer ton budget précisément selon ton salaire$r$ IN content_fr) > 0
      AND position($f$tout inclus dans trois maisons situées côté France$f$ IN content_fr) = 0
      AND position($r$À partir de {{PRIX_DES}}/mois. Et [L'Appart](/lappart), notre colocation de 4 chambres à Annemasse, quartier de la gare.$r$ IN content_fr) > 0)
  END AS fr_ok,
  CASE slug
    WHEN 'budget-colocation-geneve-guide-complet' THEN (position($r$Between a standard flatshare and coliving, there's also [L'Appart](/en/lappart), La Villa Coliving's flatshare in Annemasse, near the station: 4 furnished rooms from {{PRIX_APPART_DES}} a month, with bills, fibre, streaming and cleaning of the shared areas included. In euros: from {{PRIX_APPART_DES_EUR}}.

**No Swiss payslip yet?**$r$ IN content_en) > 0)
    WHEN 'choc-culturel-franco-suisse-expatrie-geneve' THEN (position($f$That's what La Villa Coliving offers: 29 rooms in three houses on the French side$f$ IN content_en) = 0)
    WHEN 'coliving-annemasse-geneve-frontaliers-avantages' THEN (position($f$At **La Villa Coliving**, 29 furnished all-inclusive rooms from **{{PRIX_DES}}/month** across 3 houses in Ville-la-Grand, Ambilly and Annemasse$f$ IN content_en) = 0)
    WHEN 'coliving-colocation-ou-studio-geneve-comparatif' THEN (position($f$A couple who want to share a single room, or a family, need a whole home: a furnished one-bedroom flat on the French side rents for €1,200 to €1,500 a month including charges (listings, September 2026). With us, each room is let to one person; a couple can come by taking two rooms.$f$ IN content_en) = 0)
    WHEN 'coliving-geneve-frontaliers-guide-complet' THEN (position($f$— 29 private furnished rooms across 3 houses (Ville-la-Grand, Ambilly, Annemasse), all-inclusive from **{{PRIX_DES}}/month**, no application fee.$f$ IN content_en) = 0)
    WHEN 'colocation-annemasse-ville-la-grand-ambilly' THEN (position($f$At **La Villa Coliving**, 29 furnished all-inclusive rooms from **{{PRIX_DES}}/month** across 3 houses in Ville-la-Grand, Ambilly and Annemasse$f$ IN content_en) = 0
      AND position($r$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door. Also in Annemasse, [L'Appart](/en/lappart) by La Villa Coliving (4 rooms in a flatshare, near the station) is a 5-minute walk from the station and a 2-minute walk from tram 17 — Geneva Eaux-Vives in 13 minutes door to door.$r$ IN content_en) > 0)
    WHEN 'living-in-france-working-in-geneva' THEN (position($r$the shared spaces (living room, kitchen, pool, sauna, gym) are communal. And [L'Appart](/en/lappart), a flatshare in Annemasse, near the station: a 4-room flat, with no pool, sauna or gym.$r$ IN content_en) > 0)
    WHEN 'ou-habiter-en-france-quand-on-travaille-a-geneve' THEN (position($r$If your budget is really tight, have a look at [L'Appart](/en/lappart), La Villa Coliving's flatshare in Annemasse, near the station: rooms from {{PRIX_APPART_DES}}/{{PRIX_APPART_DES_EUR}} a month, with bills, fibre, streaming and cleaning of the shared areas included.

For a first job, two traps come up again and again$r$ IN content_en) > 0
      AND position($f$with us, each room is for one person (a couple can take two).$f$ IN content_en) = 0)
    WHEN 'quartiers-annemasse-ou-vivre-selon-profil' THEN (position($r$door to door. Also in Annemasse, [L'Appart](/en/lappart) by La Villa Coliving (4 rooms in a flatshare, near the station) is a 5-minute walk from the station and a 2-minute walk from tram 17 — Geneva Eaux-Vives in 13 minutes door to door.

**The real test:** measure the actual walking time$r$ IN content_en) > 0)
    WHEN 'temps-trajet-annemasse-geneve-par-quartier' THEN (position($f$It's home to 10 of La Villa Coliving's 29 rooms.$f$ IN content_en) = 0)
    WHEN 'trouver-colocation-geneve-frontalier' THEN (position($r$In between, [L'Appart](/en/lappart), La Villa Coliving's flatshare in Annemasse, near the station, lets its rooms from {{PRIX_APPART_DES}} a month, bills included. In euros: from {{PRIX_APPART_DES_EUR}}. To frame your budget precisely by salary$r$ IN content_en) > 0
      AND position($f$all-inclusive shared rooms in three houses located on the French side$f$ IN content_en) = 0
      AND position($r$From {{PRIX_DES}}/month. And [L'Appart](/en/lappart), our 4-room flatshare in Annemasse, near the station.$r$ IN content_en) > 0)
  END AS en_ok
FROM blog_posts
WHERE slug IN ('budget-colocation-geneve-guide-complet', 'choc-culturel-franco-suisse-expatrie-geneve', 'coliving-annemasse-geneve-frontaliers-avantages', 'coliving-colocation-ou-studio-geneve-comparatif', 'coliving-geneve-frontaliers-guide-complet', 'colocation-annemasse-ville-la-grand-ambilly', 'living-in-france-working-in-geneva', 'ou-habiter-en-france-quand-on-travaille-a-geneve', 'quartiers-annemasse-ou-vivre-selon-profil', 'temps-trajet-annemasse-geneve-par-quartier', 'trouver-colocation-geneve-frontalier')
ORDER BY slug;

-- ── Retour arrière (inverse exact, mêmes gardes miroir) : retirer les deux lignes /* et */ puis exécuter le bloc.
/*
BEGIN;

UPDATE blog_posts
SET content_en = replace(content_en, $r$in our houses, each room is for one person (a couple can take two), and at L'Appart only the suite is let to two people.$r$, $f$with us, each room is for one person (a couple can take two).$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($r$in our houses, each room is for one person (a couple can take two), and at L'Appart only the suite is let to two people.$r$ IN content_en) > 0
  AND position($f$with us, each room is for one person (a couple can take two).$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$dans nos maisons, une chambre accueille une seule personne (un couple peut en prendre deux), et à L'Appart, seule la suite se loue à deux.$r$, $f$chez nous, une chambre accueille une seule personne (un couple peut en prendre deux).$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($r$dans nos maisons, une chambre accueille une seule personne (un couple peut en prendre deux), et à L'Appart, seule la suite se loue à deux.$r$ IN content_fr) > 0
  AND position($f$chez nous, une chambre accueille une seule personne (un couple peut en prendre deux).$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$A family needs a whole home: a furnished one-bedroom flat on the French side rents for €1,200 to €1,500 a month including charges (listings, September 2026). In our houses, each room is let to one person; a couple can come by taking two rooms, or share the suite at [L'Appart](/en/lappart), our flatshare in Annemasse, near the station.$r$, $f$A couple who want to share a single room, or a family, need a whole home: a furnished one-bedroom flat on the French side rents for €1,200 to €1,500 a month including charges (listings, September 2026). With us, each room is let to one person; a couple can come by taking two rooms.$f$),
    updated_at = now()
WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif'
  AND position($r$A family needs a whole home: a furnished one-bedroom flat on the French side rents for €1,200 to €1,500 a month including charges (listings, September 2026). In our houses, each room is let to one person; a couple can come by taking two rooms, or share the suite at [L'Appart](/en/lappart), our flatshare in Annemasse, near the station.$r$ IN content_en) > 0
  AND position($f$A couple who want to share a single room, or a family, need a whole home: a furnished one-bedroom flat on the French side rents for €1,200 to €1,500 a month including charges (listings, September 2026). With us, each room is let to one person; a couple can come by taking two rooms.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Une famille a besoin d'un logement entier : un deux-pièces meublé côté France se loue 1 200 à 1 500 € par mois charges comprises (annonces, septembre 2026). Dans nos maisons, une chambre accueille une seule personne ; un couple peut venir en prenant deux chambres, ou partager la suite de [L'Appart](/lappart), notre colocation à Annemasse, quartier de la gare.$r$, $f$Un couple qui veut partager une seule chambre, ou une famille, a besoin d'un logement entier : un deux-pièces meublé côté France se loue 1 200 à 1 500 € par mois charges comprises (annonces, septembre 2026). Chez nous, une chambre accueille une seule personne ; un couple peut venir en prenant deux chambres.$f$),
    updated_at = now()
WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif'
  AND position($r$Une famille a besoin d'un logement entier : un deux-pièces meublé côté France se loue 1 200 à 1 500 € par mois charges comprises (annonces, septembre 2026). Dans nos maisons, une chambre accueille une seule personne ; un couple peut venir en prenant deux chambres, ou partager la suite de [L'Appart](/lappart), notre colocation à Annemasse, quartier de la gare.$r$ IN content_fr) > 0
  AND position($f$Un couple qui veut partager une seule chambre, ou une famille, a besoin d'un logement entier : un deux-pièces meublé côté France se loue 1 200 à 1 500 € par mois charges comprises (annonces, septembre 2026). Chez nous, une chambre accueille une seule personne ; un couple peut venir en prenant deux chambres.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$If your budget is really tight, have a look at [L'Appart](/en/lappart), La Villa Coliving's flatshare in Annemasse, near the station: rooms from {{PRIX_APPART_DES}}/{{PRIX_APPART_DES_EUR}} a month, with bills, fibre, streaming and cleaning of the shared areas included.

For a first job, two traps come up again and again$r$, $f$For a first job, two traps come up again and again$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($r$If your budget is really tight, have a look at [L'Appart](/en/lappart), La Villa Coliving's flatshare in Annemasse, near the station: rooms from {{PRIX_APPART_DES}}/{{PRIX_APPART_DES_EUR}} a month, with bills, fibre, streaming and cleaning of the shared areas included.

For a first job, two traps come up again and again$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Si ton budget est vraiment serré, regarde [L'Appart](/lappart), la colocation de La Villa Coliving à Annemasse, quartier de la gare : des chambres dès {{PRIX_APPART_DES}}/{{PRIX_APPART_DES_EUR}} par mois, charges, fibre, streaming et ménage des communs compris.

Pour un premier poste, deux pièges reviennent$r$, $f$Pour un premier poste, deux pièges reviennent$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve'
  AND position($r$Si ton budget est vraiment serré, regarde [L'Appart](/lappart), la colocation de La Villa Coliving à Annemasse, quartier de la gare : des chambres dès {{PRIX_APPART_DES}}/{{PRIX_APPART_DES_EUR}} par mois, charges, fibre, streaming et ménage des communs compris.

Pour un premier poste, deux pièges reviennent$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$door to door. Also in Annemasse, [L'Appart](/en/lappart) by La Villa Coliving (4 rooms in a flatshare, near the station) is a 5-minute walk from the station and a 2-minute walk from tram 17 — Geneva Eaux-Vives in 13 minutes door to door.

**The real test:** measure the actual walking time$r$, $f$door to door.

**The real test:** measure the actual walking time$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$door to door. Also in Annemasse, [L'Appart](/en/lappart) by La Villa Coliving (4 rooms in a flatshare, near the station) is a 5-minute walk from the station and a 2-minute walk from tram 17 — Geneva Eaux-Vives in 13 minutes door to door.

**The real test:** measure the actual walking time$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Toujours à Annemasse, [L'Appart](/lappart) de La Villa Coliving (4 chambres en colocation, quartier de la gare) est à 5 min à pied de la gare et à 2 min du tram 17 — Genève-Eaux-Vives en 13 min porte-à-porte. Tu commandes ton train, pas l'inverse.$r$, $f$Tu commandes ton train, pas l'inverse.$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$Toujours à Annemasse, [L'Appart](/lappart) de La Villa Coliving (4 chambres en colocation, quartier de la gare) est à 5 min à pied de la gare et à 2 min du tram 17 — Genève-Eaux-Vives en 13 min porte-à-porte. Tu commandes ton train, pas l'inverse.$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Between a standard flatshare and coliving, there's also [L'Appart](/en/lappart), La Villa Coliving's flatshare in Annemasse, near the station: 4 furnished rooms from {{PRIX_APPART_DES}} a month, with bills, fibre, streaming and cleaning of the shared areas included. In euros: from {{PRIX_APPART_DES_EUR}}.

**No Swiss payslip yet?**$r$, $f$**No Swiss payslip yet?**$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$Between a standard flatshare and coliving, there's also [L'Appart](/en/lappart), La Villa Coliving's flatshare in Annemasse, near the station: 4 furnished rooms from {{PRIX_APPART_DES}} a month, with bills, fibre, streaming and cleaning of the shared areas included. In euros: from {{PRIX_APPART_DES_EUR}}.

**No Swiss payslip yet?**$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Entre la colocation classique et le coliving, il y a aussi [L'Appart](/lappart), la colocation de La Villa Coliving à Annemasse, dans le quartier de la gare : 4 chambres meublées dès {{PRIX_APPART_DES}} par mois, charges, fibre, streaming et ménage des communs compris. En euros : dès {{PRIX_APPART_DES_EUR}}.

**Pas encore de fiche de salaire suisse ?**$r$, $f$**Pas encore de fiche de salaire suisse ?**$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$Entre la colocation classique et le coliving, il y a aussi [L'Appart](/lappart), la colocation de La Villa Coliving à Annemasse, dans le quartier de la gare : 4 chambres meublées dès {{PRIX_APPART_DES}} par mois, charges, fibre, streaming et ménage des communs compris. En euros : dès {{PRIX_APPART_DES_EUR}}.

**Pas encore de fiche de salaire suisse ?**$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$That's what La Villa Coliving's houses offer: 29 rooms in three houses on the French side$r$, $f$That's what La Villa Coliving offers: 29 rooms in three houses on the French side$f$),
    updated_at = now()
WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve'
  AND position($r$That's what La Villa Coliving's houses offer: 29 rooms in three houses on the French side$r$ IN content_en) > 0
  AND position($f$That's what La Villa Coliving offers: 29 rooms in three houses on the French side$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$From {{PRIX_DES}}/month. And [L'Appart](/en/lappart), our 4-room flatshare in Annemasse, near the station.$r$, $f$From {{PRIX_DES}}/month.$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$From {{PRIX_DES}}/month. And [L'Appart](/en/lappart), our 4-room flatshare in Annemasse, near the station.$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$À partir de {{PRIX_DES}}/mois. Et [L'Appart](/lappart), notre colocation de 4 chambres à Annemasse, quartier de la gare.$r$, $f$À partir de {{PRIX_DES}}/mois.$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$À partir de {{PRIX_DES}}/mois. Et [L'Appart](/lappart), notre colocation de 4 chambres à Annemasse, quartier de la gare.$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$all-inclusive shared rooms in three coliving houses located on the French side$r$, $f$all-inclusive shared rooms in three houses located on the French side$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$all-inclusive shared rooms in three coliving houses located on the French side$r$ IN content_en) > 0
  AND position($f$all-inclusive shared rooms in three houses located on the French side$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$tout inclus dans trois maisons de coliving situées côté France$r$, $f$tout inclus dans trois maisons situées côté France$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$tout inclus dans trois maisons de coliving situées côté France$r$ IN content_fr) > 0
  AND position($f$tout inclus dans trois maisons situées côté France$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$In between, [L'Appart](/en/lappart), La Villa Coliving's flatshare in Annemasse, near the station, lets its rooms from {{PRIX_APPART_DES}} a month, bills included. In euros: from {{PRIX_APPART_DES_EUR}}. To frame your budget precisely by salary$r$, $f$To frame your budget precisely by salary$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$In between, [L'Appart](/en/lappart), La Villa Coliving's flatshare in Annemasse, near the station, lets its rooms from {{PRIX_APPART_DES}} a month, bills included. In euros: from {{PRIX_APPART_DES_EUR}}. To frame your budget precisely by salary$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Entre les deux, [L'Appart](/lappart), la colocation de La Villa Coliving à Annemasse, quartier de la gare, loue ses chambres dès {{PRIX_APPART_DES}} par mois, charges comprises. En euros : dès {{PRIX_APPART_DES_EUR}}. Pour cadrer ton budget précisément selon ton salaire$r$, $f$Pour cadrer ton budget précisément selon ton salaire$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$Entre les deux, [L'Appart](/lappart), la colocation de La Villa Coliving à Annemasse, quartier de la gare, loue ses chambres dès {{PRIX_APPART_DES}} par mois, charges comprises. En euros : dès {{PRIX_APPART_DES_EUR}}. Pour cadrer ton budget précisément selon ton salaire$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$It's home to 10 of the 29 rooms in La Villa Coliving's houses.$r$, $f$It's home to 10 of La Villa Coliving's 29 rooms.$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$It's home to 10 of the 29 rooms in La Villa Coliving's houses.$r$ IN content_en) > 0
  AND position($f$It's home to 10 of La Villa Coliving's 29 rooms.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$C'est là que se trouvent 10 des 29 chambres des maisons de La Villa Coliving.$r$, $f$C'est là que se trouvent 10 des 29 chambres de La Villa Coliving.$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$C'est là que se trouvent 10 des 29 chambres des maisons de La Villa Coliving.$r$ IN content_fr) > 0
  AND position($f$C'est là que se trouvent 10 des 29 chambres de La Villa Coliving.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$the shared spaces (living room, kitchen, pool, sauna, gym) are communal. And [L'Appart](/en/lappart), a flatshare in Annemasse, near the station: a 4-room flat, with no pool, sauna or gym.$r$, $f$the shared spaces (living room, kitchen, pool, sauna, gym) are communal.$f$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($r$the shared spaces (living room, kitchen, pool, sauna, gym) are communal. And [L'Appart](/en/lappart), a flatshare in Annemasse, near the station: a 4-room flat, with no pool, sauna or gym.$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$les espaces communs (salon, cuisine, piscine, sauna, salle de sport) sont partagés. Et [L'Appart](/lappart), colocation à Annemasse, quartier de la gare : un appartement de 4 chambres, sans piscine, sauna ni salle de sport.$r$, $f$les espaces communs (salon, cuisine, piscine, sauna, salle de sport) sont partagés.$f$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($r$les espaces communs (salon, cuisine, piscine, sauna, salle de sport) sont partagés. Et [L'Appart](/lappart), colocation à Annemasse, quartier de la gare : un appartement de 4 chambres, sans piscine, sauna ni salle de sport.$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$— 29 private furnished rooms across 3 coliving houses (Ville-la-Grand, Ambilly, Annemasse), all-inclusive from **{{PRIX_DES}}/month**, and [L'Appart](/en/lappart), a flatshare in Annemasse near the station, 4 rooms from **{{PRIX_APPART_DES}}/month**, no application fee.$r$, $f$— 29 private furnished rooms across 3 houses (Ville-la-Grand, Ambilly, Annemasse), all-inclusive from **{{PRIX_DES}}/month**, no application fee.$f$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($r$— 29 private furnished rooms across 3 coliving houses (Ville-la-Grand, Ambilly, Annemasse), all-inclusive from **{{PRIX_DES}}/month**, and [L'Appart](/en/lappart), a flatshare in Annemasse near the station, 4 rooms from **{{PRIX_APPART_DES}}/month**, no application fee.$r$ IN content_en) > 0
  AND position($f$— 29 private furnished rooms across 3 houses (Ville-la-Grand, Ambilly, Annemasse), all-inclusive from **{{PRIX_DES}}/month**, no application fee.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$— 29 chambres privées meublées dans 3 maisons de coliving (Ville-la-Grand, Ambilly, Annemasse), tout inclus dès **{{PRIX_DES}}/mois**, et [L'Appart](/lappart), colocation à Annemasse, quartier de la gare, 4 chambres dès **{{PRIX_APPART_DES}}/mois**, sans frais de dossier.$r$, $f$— 29 chambres privées meublées dans 3 maisons (Ville-la-Grand, Ambilly, Annemasse), tout inclus dès **{{PRIX_DES}}/mois**, sans frais de dossier.$f$),
    updated_at = now()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet'
  AND position($r$— 29 chambres privées meublées dans 3 maisons de coliving (Ville-la-Grand, Ambilly, Annemasse), tout inclus dès **{{PRIX_DES}}/mois**, et [L'Appart](/lappart), colocation à Annemasse, quartier de la gare, 4 chambres dès **{{PRIX_APPART_DES}}/mois**, sans frais de dossier.$r$ IN content_fr) > 0
  AND position($f$— 29 chambres privées meublées dans 3 maisons (Ville-la-Grand, Ambilly, Annemasse), tout inclus dès **{{PRIX_DES}}/mois**, sans frais de dossier.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door. Also in Annemasse, [L'Appart](/en/lappart) by La Villa Coliving (4 rooms in a flatshare, near the station) is a 5-minute walk from the station and a 2-minute walk from tram 17 — Geneva Eaux-Vives in 13 minutes door to door.$r$, $f$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door.$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door. Also in Annemasse, [L'Appart](/en/lappart) by La Villa Coliving (4 rooms in a flatshare, near the station) is a 5-minute walk from the station and a 2-minute walk from tram 17 — Geneva Eaux-Vives in 13 minutes door to door.$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte. Toujours à Annemasse, [L'Appart](/lappart) de La Villa Coliving (4 chambres en colocation, quartier de la gare) est à 5 min à pied de la gare et à 2 min du tram 17 — Genève-Eaux-Vives en 13 min porte-à-porte.$r$, $f$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte.$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte. Toujours à Annemasse, [L'Appart](/lappart) de La Villa Coliving (4 chambres en colocation, quartier de la gare) est à 5 min à pied de la gare et à 2 min du tram 17 — Genève-Eaux-Vives en 13 min porte-à-porte.$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$At **La Villa Coliving**, a flatshare in Annemasse, near the station, from **{{PRIX_APPART_DES}}/month** ([L'Appart](/en/lappart), 4 rooms) and 29 furnished all-inclusive rooms from **{{PRIX_DES}}/month** across 3 coliving houses in Ville-la-Grand, Ambilly and Annemasse$r$, $f$At **La Villa Coliving**, 29 furnished all-inclusive rooms from **{{PRIX_DES}}/month** across 3 houses in Ville-la-Grand, Ambilly and Annemasse$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$At **La Villa Coliving**, a flatshare in Annemasse, near the station, from **{{PRIX_APPART_DES}}/month** ([L'Appart](/en/lappart), 4 rooms) and 29 furnished all-inclusive rooms from **{{PRIX_DES}}/month** across 3 coliving houses in Ville-la-Grand, Ambilly and Annemasse$r$ IN content_en) > 0
  AND position($f$At **La Villa Coliving**, 29 furnished all-inclusive rooms from **{{PRIX_DES}}/month** across 3 houses in Ville-la-Grand, Ambilly and Annemasse$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$À **La Villa Coliving**, une colocation à Annemasse, quartier de la gare, dès **{{PRIX_APPART_DES}}/mois** ([L'Appart](/lappart), 4 chambres) et 29 chambres meublées tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons de coliving à Ville-la-Grand, Ambilly et Annemasse$r$, $f$À **La Villa Coliving**, 29 chambres meublées tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons à Ville-la-Grand, Ambilly et Annemasse$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$À **La Villa Coliving**, une colocation à Annemasse, quartier de la gare, dès **{{PRIX_APPART_DES}}/mois** ([L'Appart](/lappart), 4 chambres) et 29 chambres meublées tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons de coliving à Ville-la-Grand, Ambilly et Annemasse$r$ IN content_fr) > 0
  AND position($f$À **La Villa Coliving**, 29 chambres meublées tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons à Ville-la-Grand, Ambilly et Annemasse$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$At **La Villa Coliving**, a flatshare in Annemasse, near the station, from **{{PRIX_APPART_DES}}/month** ([L'Appart](/en/lappart), 4 rooms) and 29 furnished all-inclusive rooms from **{{PRIX_DES}}/month** across 3 coliving houses in Ville-la-Grand, Ambilly and Annemasse$r$, $f$At **La Villa Coliving**, 29 furnished all-inclusive rooms from **{{PRIX_DES}}/month** across 3 houses in Ville-la-Grand, Ambilly and Annemasse$f$),
    updated_at = now()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages'
  AND position($r$At **La Villa Coliving**, a flatshare in Annemasse, near the station, from **{{PRIX_APPART_DES}}/month** ([L'Appart](/en/lappart), 4 rooms) and 29 furnished all-inclusive rooms from **{{PRIX_DES}}/month** across 3 coliving houses in Ville-la-Grand, Ambilly and Annemasse$r$ IN content_en) > 0
  AND position($f$At **La Villa Coliving**, 29 furnished all-inclusive rooms from **{{PRIX_DES}}/month** across 3 houses in Ville-la-Grand, Ambilly and Annemasse$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$À **La Villa Coliving**, une colocation à Annemasse, quartier de la gare, dès **{{PRIX_APPART_DES}}/mois** ([L'Appart](/lappart), 4 chambres) et 29 chambres meublées tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons de coliving à Ville-la-Grand, Ambilly et Annemasse$r$, $f$À **La Villa Coliving**, 29 chambres meublées tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons à Ville-la-Grand, Ambilly et Annemasse$f$),
    updated_at = now()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages'
  AND position($r$À **La Villa Coliving**, une colocation à Annemasse, quartier de la gare, dès **{{PRIX_APPART_DES}}/mois** ([L'Appart](/lappart), 4 chambres) et 29 chambres meublées tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons de coliving à Ville-la-Grand, Ambilly et Annemasse$r$ IN content_fr) > 0
  AND position($f$À **La Villa Coliving**, 29 chambres meublées tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons à Ville-la-Grand, Ambilly et Annemasse$f$ IN content_fr) = 0;

COMMIT;
*/
