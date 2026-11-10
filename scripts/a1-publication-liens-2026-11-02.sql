-- ============================================================================
-- Publication d'A1 (brief « Genève profils » du 30/10/2026) : liens entrants vers A1 (quartiers, vivre à Annemasse, temps de trajet, s'installer, budget, trouver une colocation, guide ressources, B8) et retour des liens d'A3 (D-S6).
-- Généré le 2026-11-02T12:48:34.827Z par scripts/build-slots-sql.mjs depuis scripts/a1-publication.edits.mjs
--   · chaînes relevées sur la base vivante le 02/11
--   · ancres vérifiées sur le contenu vivant de blog_posts (REST anon, lecture seule) le 2026-11-02T12:48:34.824Z : exactement 1 occurrence de chaque ancien texte, nouveau texte absent
-- APRÈS le SQL de publication d'A1 (maj-article-ou-habiter-en-france-quand-on-travaille-a-geneve-<date>.sql), dans la même séance, sur feu vert de Jérôme.
-- Idempotent : chaque UPDATE est gardé par position(ancien) > 0 [AND position(nouveau) = 0 quand le nouveau texte n'est pas un fragment de l'ancien] — relancer le fichier est sans effet.
-- Fichier UTF-8 — ne pas normaliser les espaces.
-- 20 modifications · 9 articles · état en base à la génération (updated_at · longueur fr / en) :
--   budget-colocation-geneve-guide-complet · 2026-10-13T15:31:18.575275+00:00 · 18482 / 14385
--   guide-ressources-frontalier-geneve · 2026-10-30T17:15:30.671729+00:00 · 44839 / 41015
--   living-in-france-working-in-geneva · 2026-10-30T18:19:08.931783+00:00 · 17361 / 15749
--   quartiers-annemasse-ou-vivre-selon-profil · 2026-10-13T15:38:43.170367+00:00 · 9931 / 8688
--   s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france · 2026-10-30T17:15:30.671729+00:00 · 14548 / 14562
--   temps-trajet-annemasse-geneve-par-quartier · 2026-10-13T15:39:32.874791+00:00 · 8939 / 8319
--   trouver-colocation-geneve-frontalier · 2026-10-13T15:39:32.874791+00:00 · 5859 / 5415
--   trouver-logement-avant-d-arriver-geneve · 2026-11-02T12:44:57.349739+00:00 · 14335 / 13820
--   vivre-a-annemasse-quand-on-travaille-a-geneve · 2026-10-10T08:01:53.42011+00:00 · 12536 / 12237
-- ============================================================================

BEGIN;

-- [1/20] trouver-logement-avant-d-arriver-geneve (fr) · D-S6 · A3 · phrase du J-60 : le lien vers A1 revient à côté de « villes »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[Les villes côté France, comparées](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) donnent la liste commune par commune, avec les trajets et les loyers.$f$, $r$Notre guide [où habiter côté France, profil par profil](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) part de là, et [les villes côté France, comparées](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) donnent la liste commune par commune, avec les trajets et les loyers.$r$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($f$[Les villes côté France, comparées](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) donnent la liste commune par commune, avec les trajets et les loyers.$f$ IN content_fr) > 0
  AND position($r$Notre guide [où habiter côté France, profil par profil](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) part de là, et [les villes côté France, comparées](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) donnent la liste commune par commune, avec les trajets et les loyers.$r$ IN content_fr) = 0;

-- [2/20] trouver-logement-avant-d-arriver-geneve (en) · D-S6 · A3 · D-60 sentence: the link to A1 comes back next to "towns"
UPDATE blog_posts
SET content_en = replace(content_en, $f$[The French towns near Geneva, compared](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) give you the list town by town, with commutes and rents.$f$, $r$Our guide to [where to live in France, profile by profile](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) starts from there, and [the French towns near Geneva, compared](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) give you the list town by town, with commutes and rents.$r$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($f$[The French towns near Geneva, compared](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) give you the list town by town, with commutes and rents.$f$ IN content_en) > 0
  AND position($r$Our guide to [where to live in France, profile by profile](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) starts from there, and [the French towns near Geneva, compared](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) give you the list town by town, with commutes and rents.$r$ IN content_en) = 0;

-- [3/20] trouver-logement-avant-d-arriver-geneve (fr) · D-S6 · A3 · « Pour aller plus loin » : la puce A1 revient en tête
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$- [Les villes côté France pour les frontaliers](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)$f$, $r$- [Où habiter en France quand on travaille à Genève ?](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [Les villes côté France pour les frontaliers](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)$r$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($f$- [Les villes côté France pour les frontaliers](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)$f$ IN content_fr) > 0
  AND position($r$- [Où habiter en France quand on travaille à Genève ?](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [Les villes côté France pour les frontaliers](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)$r$ IN content_fr) = 0;

-- [4/20] trouver-logement-avant-d-arriver-geneve (en) · D-S6 · A3 · "Further reading": the A1 bullet comes back first
UPDATE blog_posts
SET content_en = replace(content_en, $f$- [French towns near Geneva for cross-border workers](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)$f$, $r$- [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [French towns near Geneva for cross-border workers](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)$r$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($f$- [French towns near Geneva for cross-border workers](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)$f$ IN content_en) > 0
  AND position($r$- [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [French towns near Geneva for cross-border workers](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)$r$ IN content_en) = 0;

-- [5/20] quartiers-annemasse-ou-vivre-selon-profil (fr) · LIENS · quartiers · puce A1 dans « Pour aller plus loin »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$- [Où habiter en frontalier : villes françaises abordables](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)$f$, $r$- [Où habiter en frontalier : villes françaises abordables](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)
- [Où habiter côté France selon ton profil](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$- [Où habiter en frontalier : villes françaises abordables](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)$f$ IN content_fr) > 0
  AND position($r$- [Où habiter en frontalier : villes françaises abordables](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)
- [Où habiter côté France selon ton profil](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$ IN content_fr) = 0;

-- [6/20] quartiers-annemasse-ou-vivre-selon-profil (en) · LIENS · neighbourhoods · no "Further reading" in EN: one sentence at the end of the first "In short" paragraph
UPDATE blog_posts
SET content_en = replace(content_en, $f$In Annemasse, you don't pick a neighbourhood in the abstract but **by profile**: align your home with your real daily commute, and the agglo becomes an asset rather than a constraint.$f$, $r$In Annemasse, you don't pick a neighbourhood in the abstract but **by profile**: align your home with your real daily commute, and the agglo becomes an asset rather than a constraint. Still deciding between Annemasse, Ferney-Voltaire and Saint-Julien? [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) goes through it profile by profile.$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$In Annemasse, you don't pick a neighbourhood in the abstract but **by profile**: align your home with your real daily commute, and the agglo becomes an asset rather than a constraint.$f$ IN content_en) > 0
  AND position($r$In Annemasse, you don't pick a neighbourhood in the abstract but **by profile**: align your home with your real daily commute, and the agglo becomes an asset rather than a constraint. Still deciding between Annemasse, Ferney-Voltaire and Saint-Julien? [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) goes through it profile by profile.$r$ IN content_en) = 0;

-- [7/20] vivre-a-annemasse-quand-on-travaille-a-geneve (fr) · LIENS · vivre à Annemasse · « Quand ce n'est pas le bon choix » : le cas Nations / CERN renvoie à A1
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Pour élargir le rayon, lis [où habiter côté France quand on travaille en Suisse](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).$f$, $r$Si tu travailles aux Nations ou au CERN, Annemasse est de l'autre côté de Genève : [notre guide pour choisir où habiter selon ton lieu de travail](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) t'oriente plutôt vers Ferney-Voltaire et le Pays de Gex. Pour élargir le rayon, lis [où habiter côté France quand on travaille en Suisse](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).$r$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($f$Pour élargir le rayon, lis [où habiter côté France quand on travaille en Suisse](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).$f$ IN content_fr) > 0
  AND position($r$Si tu travailles aux Nations ou au CERN, Annemasse est de l'autre côté de Genève : [notre guide pour choisir où habiter selon ton lieu de travail](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) t'oriente plutôt vers Ferney-Voltaire et le Pays de Gex. Pour élargir le rayon, lis [où habiter côté France quand on travaille en Suisse](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).$r$ IN content_fr) = 0;

-- [8/20] vivre-a-annemasse-quand-on-travaille-a-geneve (en) · LIENS · living in Annemasse · "When it is not the right choice": the UN / CERN case points to A1
UPDATE blog_posts
SET content_en = replace(content_en, $f$To widen the radius, read [where to live on the French side when you work in Switzerland](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).$f$, $r$If you work in the UN district or at CERN, Annemasse is on the other side of Geneva: [our guide to choosing where to live by workplace](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) points you to Ferney-Voltaire and the Pays de Gex instead. To widen the radius, read [where to live on the French side when you work in Switzerland](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).$r$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($f$To widen the radius, read [where to live on the French side when you work in Switzerland](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).$f$ IN content_en) > 0
  AND position($r$If you work in the UN district or at CERN, Annemasse is on the other side of Geneva: [our guide to choosing where to live by workplace](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) points you to Ferney-Voltaire and the Pays de Gex instead. To widen the radius, read [where to live on the French side when you work in Switzerland](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).$r$ IN content_en) = 0;

-- [9/20] temps-trajet-annemasse-geneve-par-quartier (fr) · LIENS · temps de trajet · « Quel logement choisir selon ton lieu de travail ? » : renvoi vers A1 avant l'Observatoire
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Avant de choisir ton quartier, jette un œil à l'[Observatoire du logement frontalier](/observatoire-logement-frontalier-geneve)$f$, $r$Si ton poste est aux Nations, à l'aéroport ou au CERN, regarde aussi de l'autre côté de Genève : [notre guide pour choisir ta commune selon ton poste](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) compare Ferney-Voltaire et le Pays de Gex au corridor d'Annemasse, profil par profil.

Avant de choisir ton quartier, jette un œil à l'[Observatoire du logement frontalier](/observatoire-logement-frontalier-geneve)$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$Avant de choisir ton quartier, jette un œil à l'[Observatoire du logement frontalier](/observatoire-logement-frontalier-geneve)$f$ IN content_fr) > 0
  AND position($r$Si ton poste est aux Nations, à l'aéroport ou au CERN, regarde aussi de l'autre côté de Genève : [notre guide pour choisir ta commune selon ton poste](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) compare Ferney-Voltaire et le Pays de Gex au corridor d'Annemasse, profil par profil.

Avant de choisir ton quartier, jette un œil à l'[Observatoire du logement frontalier](/observatoire-logement-frontalier-geneve)$r$ IN content_fr) = 0;

-- [10/20] temps-trajet-annemasse-geneve-par-quartier (en) · LIENS · commuting times · "Which housing to choose based on your workplace?": pointer to A1 before the Observatory
UPDATE blog_posts
SET content_en = replace(content_en, $f$Before picking your neighborhood, check the [Cross-border Housing Observatory](/en/observatoire-logement-frontalier-geneve)$f$, $r$If your job is in the UN district, at the airport or at CERN, look at the other side of Geneva too: [our guide to choosing your town by workplace](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) compares Ferney-Voltaire and the Pays de Gex with the Annemasse corridor, profile by profile.

Before picking your neighborhood, check the [Cross-border Housing Observatory](/en/observatoire-logement-frontalier-geneve)$r$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($f$Before picking your neighborhood, check the [Cross-border Housing Observatory](/en/observatoire-logement-frontalier-geneve)$f$ IN content_en) > 0
  AND position($r$If your job is in the UN district, at the airport or at CERN, look at the other side of Geneva too: [our guide to choosing your town by workplace](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) compares Ferney-Voltaire and the Pays de Gex with the Annemasse corridor, profile by profile.

Before picking your neighborhood, check the [Cross-border Housing Observatory](/en/observatoire-logement-frontalier-geneve)$r$ IN content_en) = 0;

-- [11/20] s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france (fr) · LIENS · s'installer · après le tableau Suisse / France : la colonne « France » mène à A1
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Lecture rapide : citoyen de l'UE, célibataire, délai court, la colonne de droite marche dès la première semaine ; arrivée de l'extérieur de l'Europe ou famille, la colonne de gauche est ton point de départ.$f$, $r$Lecture rapide : citoyen de l'UE, célibataire, délai court, la colonne de droite marche dès la première semaine ; arrivée de l'extérieur de l'Europe ou famille, la colonne de gauche est ton point de départ. Si c'est la colonne de droite, [le choix de la commune côté France, profil par profil](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) est l'étape suivante.$r$),
    updated_at = now()
WHERE slug = 's-installer-a-geneve-expatrie-cote-suisse-ou-cote-france'
  AND position($f$Lecture rapide : citoyen de l'UE, célibataire, délai court, la colonne de droite marche dès la première semaine ; arrivée de l'extérieur de l'Europe ou famille, la colonne de gauche est ton point de départ.$f$ IN content_fr) > 0
  AND position($r$Lecture rapide : citoyen de l'UE, célibataire, délai court, la colonne de droite marche dès la première semaine ; arrivée de l'extérieur de l'Europe ou famille, la colonne de gauche est ton point de départ. Si c'est la colonne de droite, [le choix de la commune côté France, profil par profil](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) est l'étape suivante.$r$ IN content_fr) = 0;

-- [12/20] s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france (en) · LIENS · moving to Geneva · after the Switzerland / France table: the "France" column leads to A1
UPDATE blog_posts
SET content_en = replace(content_en, $f$Quick read: EU citizen, single, short timeline, the right-hand column works from the first week; arriving from outside Europe or as a family, the left-hand column is your starting point.$f$, $r$Quick read: EU citizen, single, short timeline, the right-hand column works from the first week; arriving from outside Europe or as a family, the left-hand column is your starting point. If it's the right-hand column, [choosing your French town, profile by profile](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) is the next step.$r$),
    updated_at = now()
WHERE slug = 's-installer-a-geneve-expatrie-cote-suisse-ou-cote-france'
  AND position($f$Quick read: EU citizen, single, short timeline, the right-hand column works from the first week; arriving from outside Europe or as a family, the left-hand column is your starting point.$f$ IN content_en) > 0
  AND position($r$Quick read: EU citizen, single, short timeline, the right-hand column works from the first week; arriving from outside Europe or as a family, the left-hand column is your starting point. If it's the right-hand column, [choosing your French town, profile by profile](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) is the next step.$r$ IN content_en) = 0;

-- [13/20] budget-colocation-geneve-guide-complet (fr) · LIENS · budget · puce A1 dans « À lire aussi »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$- [Coliving vs colocation : quelles différences ?](/blog/coliving-colocation-ou-studio-geneve-comparatif)$f$, $r$- [Coliving vs colocation : quelles différences ?](/blog/coliving-colocation-ou-studio-geneve-comparatif)
- [Où habiter en France quand on travaille à Genève ?](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$- [Coliving vs colocation : quelles différences ?](/blog/coliving-colocation-ou-studio-geneve-comparatif)$f$ IN content_fr) > 0
  AND position($r$- [Coliving vs colocation : quelles différences ?](/blog/coliving-colocation-ou-studio-geneve-comparatif)
- [Où habiter en France quand on travaille à Genève ?](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$ IN content_fr) = 0;

-- [14/20] budget-colocation-geneve-guide-complet (en) · LIENS · budget · A1 bullet in "Also read"
UPDATE blog_posts
SET content_en = replace(content_en, $f$- [Coliving vs flatshare: what's the difference?](/en/blog/coliving-colocation-ou-studio-geneve-comparatif)$f$, $r$- [Coliving vs flatshare: what's the difference?](/en/blog/coliving-colocation-ou-studio-geneve-comparatif)
- [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$- [Coliving vs flatshare: what's the difference?](/en/blog/coliving-colocation-ou-studio-geneve-comparatif)$f$ IN content_en) > 0
  AND position($r$- [Coliving vs flatshare: what's the difference?](/en/blog/coliving-colocation-ou-studio-geneve-comparatif)
- [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$ IN content_en) = 0;

-- [15/20] trouver-colocation-geneve-frontalier (fr) · LIENS · trouver une colocation · puce A1 dans « À lire aussi », après « villes »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$- [Les meilleurs quartiers frontaliers de Genève](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)$f$, $r$- [Les meilleurs quartiers frontaliers de Genève](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)
- [Où habiter selon ton lieu de travail à Genève](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$- [Les meilleurs quartiers frontaliers de Genève](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)$f$ IN content_fr) > 0
  AND position($r$- [Les meilleurs quartiers frontaliers de Genève](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)
- [Où habiter selon ton lieu de travail à Genève](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$ IN content_fr) = 0;

-- [16/20] trouver-colocation-geneve-frontalier (en) · LIENS · finding a flatshare · A1 bullet in "Also read", after "towns"
UPDATE blog_posts
SET content_en = replace(content_en, $f$- [The best cross-border neighborhoods near Geneva](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)$f$, $r$- [The best cross-border neighborhoods near Geneva](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)
- [Where to live depending on where you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$- [The best cross-border neighborhoods near Geneva](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)$f$ IN content_en) > 0
  AND position($r$- [The best cross-border neighborhoods near Geneva](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)
- [Where to live depending on where you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$ IN content_en) = 0;

-- [17/20] guide-ressources-frontalier-geneve (fr) · LIENS · guide ressources · « La carte des loyers, commune par commune » (chapitre logement)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$— un arbitrage souvent gagnant.$f$, $r$— un arbitrage souvent gagnant. Pour choisir la commune elle-même selon ton lieu de travail, ta voiture et ta durée de séjour, [le guide par profil pour choisir ta commune](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) prend le relais.$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$— un arbitrage souvent gagnant.$f$ IN content_fr) > 0
  AND position($r$— un arbitrage souvent gagnant. Pour choisir la commune elle-même selon ton lieu de travail, ta voiture et ta durée de séjour, [le guide par profil pour choisir ta commune](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) prend le relais.$r$ IN content_fr) = 0;

-- [18/20] guide-ressources-frontalier-geneve (en) · LIENS · resource guide · "The rent map, municipality by municipality" (housing chapter)
UPDATE blog_posts
SET content_en = replace(content_en, $f$— an arbitrage that often pays off.$f$, $r$— an arbitrage that often pays off. To choose the town itself based on where you work, whether you drive and how long you're staying, [our profile-by-profile guide to choosing your town](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) takes it from there.$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$— an arbitrage that often pays off.$f$ IN content_en) > 0
  AND position($r$— an arbitrage that often pays off. To choose the town itself based on where you work, whether you drive and how long you're staying, [our profile-by-profile guide to choosing your town](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) takes it from there.$r$ IN content_en) = 0;

-- [19/20] living-in-france-working-in-geneva (fr) · LIENS · B8 · « Où vivre ? » : la recommandation renvoie à A1 pour les autres profils
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$vise Annemasse, Ambilly ou Ville-la-Grand, près d'une gare ou d'un arrêt de tram.$f$, $r$vise Annemasse, Ambilly ou Ville-la-Grand, près d'une gare ou d'un arrêt de tram. Pour un poste aux Nations, à l'aéroport ou au CERN, ou si tu as une voiture, [où habiter selon ton profil](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) détaille les autres options.$r$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($f$vise Annemasse, Ambilly ou Ville-la-Grand, près d'une gare ou d'un arrêt de tram.$f$ IN content_fr) > 0
  AND position($r$vise Annemasse, Ambilly ou Ville-la-Grand, près d'une gare ou d'un arrêt de tram. Pour un poste aux Nations, à l'aéroport ou au CERN, ou si tu as une voiture, [où habiter selon ton profil](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) détaille les autres options.$r$ IN content_fr) = 0;

-- [20/20] living-in-france-working-in-geneva (en) · LIENS · B8 · "Where to live?": the recommendation points to A1 for the other profiles
UPDATE blog_posts
SET content_en = replace(content_en, $f$aim for Annemasse, Ambilly or Ville-la-Grand, close to a station or a tram stop.$f$, $r$aim for Annemasse, Ambilly or Ville-la-Grand, close to a station or a tram stop. For a job in the UN district, at the airport or at CERN, or if you drive, [where to live by profile](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) covers the other options.$r$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($f$aim for Annemasse, Ambilly or Ville-la-Grand, close to a station or a tram stop.$f$ IN content_en) > 0
  AND position($r$aim for Annemasse, Ambilly or Ville-la-Grand, close to a station or a tram stop. For a job in the UN district, at the airport or at CERN, or if you drive, [where to live by profile](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) covers the other options.$r$ IN content_en) = 0;

-- ── Aperçu des ancrages (ancien → nouveau, première ligne de chaque texte) ──
-- [1] trouver-logement-avant-d-arriver-geneve/fr · D-S6 : « [Les villes côté France, comparées](/blog/ou-habiter-frontalier-suisse-… » → « Notre guide [où habiter côté France, profil par profil](/blog/ou-habite… »
-- [2] trouver-logement-avant-d-arriver-geneve/en · D-S6 : « [The French towns near Geneva, compared](/en/blog/ou-habiter-frontalier… » → « Our guide to [where to live in France, profile by profile](/en/blog/ou-… »
-- [3] trouver-logement-avant-d-arriver-geneve/fr · D-S6 : « - [Les villes côté France pour les frontaliers](/blog/ou-habiter-fronta… » → « - [Où habiter en France quand on travaille à Genève ?](/blog/ou-habiter… »
-- [4] trouver-logement-avant-d-arriver-geneve/en · D-S6 : « - [French towns near Geneva for cross-border workers](/en/blog/ou-habit… » → « - [Where to live in France when you work in Geneva](/en/blog/ou-habiter… »
-- [5] quartiers-annemasse-ou-vivre-selon-profil/fr · LIENS : « - [Où habiter en frontalier : villes françaises abordables](/blog/ou-ha… » → « - [Où habiter en frontalier : villes françaises abordables](/blog/ou-ha… »
-- [6] quartiers-annemasse-ou-vivre-selon-profil/en · LIENS : « In Annemasse, you don't pick a neighbourhood in the abstract but **by p… » → « In Annemasse, you don't pick a neighbourhood in the abstract but **by p… »
-- [7] vivre-a-annemasse-quand-on-travaille-a-geneve/fr · LIENS : « Pour élargir le rayon, lis [où habiter côté France quand on travaille e… » → « Si tu travailles aux Nations ou au CERN, Annemasse est de l'autre côté … »
-- [8] vivre-a-annemasse-quand-on-travaille-a-geneve/en · LIENS : « To widen the radius, read [where to live on the French side when you wo… » → « If you work in the UN district or at CERN, Annemasse is on the other si… »
-- [9] temps-trajet-annemasse-geneve-par-quartier/fr · LIENS : « Avant de choisir ton quartier, jette un œil à l'[Observatoire du logeme… » → « Si ton poste est aux Nations, à l'aéroport ou au CERN, regarde aussi de… »
-- [10] temps-trajet-annemasse-geneve-par-quartier/en · LIENS : « Before picking your neighborhood, check the [Cross-border Housing Obser… » → « If your job is in the UN district, at the airport or at CERN, look at t… »
-- [11] s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france/fr · LIENS : « Lecture rapide : citoyen de l'UE, célibataire, délai court, la colonne … » → « Lecture rapide : citoyen de l'UE, célibataire, délai court, la colonne … »
-- [12] s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france/en · LIENS : « Quick read: EU citizen, single, short timeline, the right-hand column w… » → « Quick read: EU citizen, single, short timeline, the right-hand column w… »
-- [13] budget-colocation-geneve-guide-complet/fr · LIENS : « - [Coliving vs colocation : quelles différences ?](/blog/coliving-coloc… » → « - [Coliving vs colocation : quelles différences ?](/blog/coliving-coloc… »
-- [14] budget-colocation-geneve-guide-complet/en · LIENS : « - [Coliving vs flatshare: what's the difference?](/en/blog/coliving-col… » → « - [Coliving vs flatshare: what's the difference?](/en/blog/coliving-col… »
-- [15] trouver-colocation-geneve-frontalier/fr · LIENS : « - [Les meilleurs quartiers frontaliers de Genève](/blog/ou-habiter-fron… » → « - [Les meilleurs quartiers frontaliers de Genève](/blog/ou-habiter-fron… »
-- [16] trouver-colocation-geneve-frontalier/en · LIENS : « - [The best cross-border neighborhoods near Geneva](/en/blog/ou-habiter… » → « - [The best cross-border neighborhoods near Geneva](/en/blog/ou-habiter… »
-- [17] guide-ressources-frontalier-geneve/fr · LIENS : « — un arbitrage souvent gagnant. » → « — un arbitrage souvent gagnant. Pour choisir la commune elle-même selon… »
-- [18] guide-ressources-frontalier-geneve/en · LIENS : « — an arbitrage that often pays off. » → « — an arbitrage that often pays off. To choose the town itself based on … »
-- [19] living-in-france-working-in-geneva/fr · LIENS : « vise Annemasse, Ambilly ou Ville-la-Grand, près d'une gare ou d'un arrê… » → « vise Annemasse, Ambilly ou Ville-la-Grand, près d'une gare ou d'un arrê… »
-- [20] living-in-france-working-in-geneva/en · LIENS : « aim for Annemasse, Ambilly or Ville-la-Grand, close to a station or a t… » → « aim for Annemasse, Ambilly or Ville-la-Grand, close to a station or a t… »

COMMIT;

-- ── Vérification (lecture seule) : une ligne par article ; fr_ok / en_ok = true quand toutes les modifications de la langue sont en place, NULL = langue non touchée.
SELECT slug,
  CASE slug
    WHEN 'budget-colocation-geneve-guide-complet' THEN (position($r$- [Coliving vs colocation : quelles différences ?](/blog/coliving-colocation-ou-studio-geneve-comparatif)
- [Où habiter en France quand on travaille à Genève ?](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$ IN content_fr) > 0)
    WHEN 'guide-ressources-frontalier-geneve' THEN (position($r$— un arbitrage souvent gagnant. Pour choisir la commune elle-même selon ton lieu de travail, ta voiture et ta durée de séjour, [le guide par profil pour choisir ta commune](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) prend le relais.$r$ IN content_fr) > 0)
    WHEN 'living-in-france-working-in-geneva' THEN (position($r$vise Annemasse, Ambilly ou Ville-la-Grand, près d'une gare ou d'un arrêt de tram. Pour un poste aux Nations, à l'aéroport ou au CERN, ou si tu as une voiture, [où habiter selon ton profil](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) détaille les autres options.$r$ IN content_fr) > 0)
    WHEN 'quartiers-annemasse-ou-vivre-selon-profil' THEN (position($r$- [Où habiter en frontalier : villes françaises abordables](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)
- [Où habiter côté France selon ton profil](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$ IN content_fr) > 0)
    WHEN 's-installer-a-geneve-expatrie-cote-suisse-ou-cote-france' THEN (position($r$Lecture rapide : citoyen de l'UE, célibataire, délai court, la colonne de droite marche dès la première semaine ; arrivée de l'extérieur de l'Europe ou famille, la colonne de gauche est ton point de départ. Si c'est la colonne de droite, [le choix de la commune côté France, profil par profil](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) est l'étape suivante.$r$ IN content_fr) > 0)
    WHEN 'temps-trajet-annemasse-geneve-par-quartier' THEN (position($r$Si ton poste est aux Nations, à l'aéroport ou au CERN, regarde aussi de l'autre côté de Genève : [notre guide pour choisir ta commune selon ton poste](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) compare Ferney-Voltaire et le Pays de Gex au corridor d'Annemasse, profil par profil.

Avant de choisir ton quartier, jette un œil à l'[Observatoire du logement frontalier](/observatoire-logement-frontalier-geneve)$r$ IN content_fr) > 0)
    WHEN 'trouver-colocation-geneve-frontalier' THEN (position($r$- [Les meilleurs quartiers frontaliers de Genève](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)
- [Où habiter selon ton lieu de travail à Genève](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$ IN content_fr) > 0)
    WHEN 'trouver-logement-avant-d-arriver-geneve' THEN (position($f$[Les villes côté France, comparées](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) donnent la liste commune par commune, avec les trajets et les loyers.$f$ IN content_fr) = 0
      AND position($r$- [Où habiter en France quand on travaille à Genève ?](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [Les villes côté France pour les frontaliers](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)$r$ IN content_fr) > 0)
    WHEN 'vivre-a-annemasse-quand-on-travaille-a-geneve' THEN (position($r$Si tu travailles aux Nations ou au CERN, Annemasse est de l'autre côté de Genève : [notre guide pour choisir où habiter selon ton lieu de travail](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) t'oriente plutôt vers Ferney-Voltaire et le Pays de Gex. Pour élargir le rayon, lis [où habiter côté France quand on travaille en Suisse](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).$r$ IN content_fr) > 0)
  END AS fr_ok,
  CASE slug
    WHEN 'budget-colocation-geneve-guide-complet' THEN (position($r$- [Coliving vs flatshare: what's the difference?](/en/blog/coliving-colocation-ou-studio-geneve-comparatif)
- [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$ IN content_en) > 0)
    WHEN 'guide-ressources-frontalier-geneve' THEN (position($r$— an arbitrage that often pays off. To choose the town itself based on where you work, whether you drive and how long you're staying, [our profile-by-profile guide to choosing your town](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) takes it from there.$r$ IN content_en) > 0)
    WHEN 'living-in-france-working-in-geneva' THEN (position($r$aim for Annemasse, Ambilly or Ville-la-Grand, close to a station or a tram stop. For a job in the UN district, at the airport or at CERN, or if you drive, [where to live by profile](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) covers the other options.$r$ IN content_en) > 0)
    WHEN 'quartiers-annemasse-ou-vivre-selon-profil' THEN (position($r$In Annemasse, you don't pick a neighbourhood in the abstract but **by profile**: align your home with your real daily commute, and the agglo becomes an asset rather than a constraint. Still deciding between Annemasse, Ferney-Voltaire and Saint-Julien? [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) goes through it profile by profile.$r$ IN content_en) > 0)
    WHEN 's-installer-a-geneve-expatrie-cote-suisse-ou-cote-france' THEN (position($r$Quick read: EU citizen, single, short timeline, the right-hand column works from the first week; arriving from outside Europe or as a family, the left-hand column is your starting point. If it's the right-hand column, [choosing your French town, profile by profile](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) is the next step.$r$ IN content_en) > 0)
    WHEN 'temps-trajet-annemasse-geneve-par-quartier' THEN (position($r$If your job is in the UN district, at the airport or at CERN, look at the other side of Geneva too: [our guide to choosing your town by workplace](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) compares Ferney-Voltaire and the Pays de Gex with the Annemasse corridor, profile by profile.

Before picking your neighborhood, check the [Cross-border Housing Observatory](/en/observatoire-logement-frontalier-geneve)$r$ IN content_en) > 0)
    WHEN 'trouver-colocation-geneve-frontalier' THEN (position($r$- [The best cross-border neighborhoods near Geneva](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)
- [Where to live depending on where you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$ IN content_en) > 0)
    WHEN 'trouver-logement-avant-d-arriver-geneve' THEN (position($f$[The French towns near Geneva, compared](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) give you the list town by town, with commutes and rents.$f$ IN content_en) = 0
      AND position($r$- [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [French towns near Geneva for cross-border workers](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)$r$ IN content_en) > 0)
    WHEN 'vivre-a-annemasse-quand-on-travaille-a-geneve' THEN (position($r$If you work in the UN district or at CERN, Annemasse is on the other side of Geneva: [our guide to choosing where to live by workplace](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) points you to Ferney-Voltaire and the Pays de Gex instead. To widen the radius, read [where to live on the French side when you work in Switzerland](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).$r$ IN content_en) > 0)
  END AS en_ok
FROM blog_posts
WHERE slug IN ('budget-colocation-geneve-guide-complet', 'guide-ressources-frontalier-geneve', 'living-in-france-working-in-geneva', 'quartiers-annemasse-ou-vivre-selon-profil', 's-installer-a-geneve-expatrie-cote-suisse-ou-cote-france', 'temps-trajet-annemasse-geneve-par-quartier', 'trouver-colocation-geneve-frontalier', 'trouver-logement-avant-d-arriver-geneve', 'vivre-a-annemasse-quand-on-travaille-a-geneve')
ORDER BY slug;

-- ── Retour arrière (inverse exact, mêmes gardes miroir) : retirer les deux lignes /* et */ puis exécuter le bloc.
/*
BEGIN;

UPDATE blog_posts
SET content_en = replace(content_en, $r$aim for Annemasse, Ambilly or Ville-la-Grand, close to a station or a tram stop. For a job in the UN district, at the airport or at CERN, or if you drive, [where to live by profile](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) covers the other options.$r$, $f$aim for Annemasse, Ambilly or Ville-la-Grand, close to a station or a tram stop.$f$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($r$aim for Annemasse, Ambilly or Ville-la-Grand, close to a station or a tram stop. For a job in the UN district, at the airport or at CERN, or if you drive, [where to live by profile](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) covers the other options.$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$vise Annemasse, Ambilly ou Ville-la-Grand, près d'une gare ou d'un arrêt de tram. Pour un poste aux Nations, à l'aéroport ou au CERN, ou si tu as une voiture, [où habiter selon ton profil](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) détaille les autres options.$r$, $f$vise Annemasse, Ambilly ou Ville-la-Grand, près d'une gare ou d'un arrêt de tram.$f$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($r$vise Annemasse, Ambilly ou Ville-la-Grand, près d'une gare ou d'un arrêt de tram. Pour un poste aux Nations, à l'aéroport ou au CERN, ou si tu as une voiture, [où habiter selon ton profil](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) détaille les autres options.$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$— an arbitrage that often pays off. To choose the town itself based on where you work, whether you drive and how long you're staying, [our profile-by-profile guide to choosing your town](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) takes it from there.$r$, $f$— an arbitrage that often pays off.$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$— an arbitrage that often pays off. To choose the town itself based on where you work, whether you drive and how long you're staying, [our profile-by-profile guide to choosing your town](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) takes it from there.$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$— un arbitrage souvent gagnant. Pour choisir la commune elle-même selon ton lieu de travail, ta voiture et ta durée de séjour, [le guide par profil pour choisir ta commune](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) prend le relais.$r$, $f$— un arbitrage souvent gagnant.$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$— un arbitrage souvent gagnant. Pour choisir la commune elle-même selon ton lieu de travail, ta voiture et ta durée de séjour, [le guide par profil pour choisir ta commune](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) prend le relais.$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$- [The best cross-border neighborhoods near Geneva](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)
- [Where to live depending on where you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$, $f$- [The best cross-border neighborhoods near Geneva](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$- [The best cross-border neighborhoods near Geneva](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)
- [Where to live depending on where you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$- [Les meilleurs quartiers frontaliers de Genève](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)
- [Où habiter selon ton lieu de travail à Genève](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$, $f$- [Les meilleurs quartiers frontaliers de Genève](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$- [Les meilleurs quartiers frontaliers de Genève](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)
- [Où habiter selon ton lieu de travail à Genève](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$- [Coliving vs flatshare: what's the difference?](/en/blog/coliving-colocation-ou-studio-geneve-comparatif)
- [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$, $f$- [Coliving vs flatshare: what's the difference?](/en/blog/coliving-colocation-ou-studio-geneve-comparatif)$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$- [Coliving vs flatshare: what's the difference?](/en/blog/coliving-colocation-ou-studio-geneve-comparatif)
- [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$- [Coliving vs colocation : quelles différences ?](/blog/coliving-colocation-ou-studio-geneve-comparatif)
- [Où habiter en France quand on travaille à Genève ?](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$, $f$- [Coliving vs colocation : quelles différences ?](/blog/coliving-colocation-ou-studio-geneve-comparatif)$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$- [Coliving vs colocation : quelles différences ?](/blog/coliving-colocation-ou-studio-geneve-comparatif)
- [Où habiter en France quand on travaille à Genève ?](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Quick read: EU citizen, single, short timeline, the right-hand column works from the first week; arriving from outside Europe or as a family, the left-hand column is your starting point. If it's the right-hand column, [choosing your French town, profile by profile](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) is the next step.$r$, $f$Quick read: EU citizen, single, short timeline, the right-hand column works from the first week; arriving from outside Europe or as a family, the left-hand column is your starting point.$f$),
    updated_at = now()
WHERE slug = 's-installer-a-geneve-expatrie-cote-suisse-ou-cote-france'
  AND position($r$Quick read: EU citizen, single, short timeline, the right-hand column works from the first week; arriving from outside Europe or as a family, the left-hand column is your starting point. If it's the right-hand column, [choosing your French town, profile by profile](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) is the next step.$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Lecture rapide : citoyen de l'UE, célibataire, délai court, la colonne de droite marche dès la première semaine ; arrivée de l'extérieur de l'Europe ou famille, la colonne de gauche est ton point de départ. Si c'est la colonne de droite, [le choix de la commune côté France, profil par profil](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) est l'étape suivante.$r$, $f$Lecture rapide : citoyen de l'UE, célibataire, délai court, la colonne de droite marche dès la première semaine ; arrivée de l'extérieur de l'Europe ou famille, la colonne de gauche est ton point de départ.$f$),
    updated_at = now()
WHERE slug = 's-installer-a-geneve-expatrie-cote-suisse-ou-cote-france'
  AND position($r$Lecture rapide : citoyen de l'UE, célibataire, délai court, la colonne de droite marche dès la première semaine ; arrivée de l'extérieur de l'Europe ou famille, la colonne de gauche est ton point de départ. Si c'est la colonne de droite, [le choix de la commune côté France, profil par profil](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) est l'étape suivante.$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$If your job is in the UN district, at the airport or at CERN, look at the other side of Geneva too: [our guide to choosing your town by workplace](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) compares Ferney-Voltaire and the Pays de Gex with the Annemasse corridor, profile by profile.

Before picking your neighborhood, check the [Cross-border Housing Observatory](/en/observatoire-logement-frontalier-geneve)$r$, $f$Before picking your neighborhood, check the [Cross-border Housing Observatory](/en/observatoire-logement-frontalier-geneve)$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$If your job is in the UN district, at the airport or at CERN, look at the other side of Geneva too: [our guide to choosing your town by workplace](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) compares Ferney-Voltaire and the Pays de Gex with the Annemasse corridor, profile by profile.

Before picking your neighborhood, check the [Cross-border Housing Observatory](/en/observatoire-logement-frontalier-geneve)$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Si ton poste est aux Nations, à l'aéroport ou au CERN, regarde aussi de l'autre côté de Genève : [notre guide pour choisir ta commune selon ton poste](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) compare Ferney-Voltaire et le Pays de Gex au corridor d'Annemasse, profil par profil.

Avant de choisir ton quartier, jette un œil à l'[Observatoire du logement frontalier](/observatoire-logement-frontalier-geneve)$r$, $f$Avant de choisir ton quartier, jette un œil à l'[Observatoire du logement frontalier](/observatoire-logement-frontalier-geneve)$f$),
    updated_at = now()
WHERE slug = 'temps-trajet-annemasse-geneve-par-quartier'
  AND position($r$Si ton poste est aux Nations, à l'aéroport ou au CERN, regarde aussi de l'autre côté de Genève : [notre guide pour choisir ta commune selon ton poste](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) compare Ferney-Voltaire et le Pays de Gex au corridor d'Annemasse, profil par profil.

Avant de choisir ton quartier, jette un œil à l'[Observatoire du logement frontalier](/observatoire-logement-frontalier-geneve)$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$If you work in the UN district or at CERN, Annemasse is on the other side of Geneva: [our guide to choosing where to live by workplace](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) points you to Ferney-Voltaire and the Pays de Gex instead. To widen the radius, read [where to live on the French side when you work in Switzerland](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).$r$, $f$To widen the radius, read [where to live on the French side when you work in Switzerland](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).$f$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($r$If you work in the UN district or at CERN, Annemasse is on the other side of Geneva: [our guide to choosing where to live by workplace](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) points you to Ferney-Voltaire and the Pays de Gex instead. To widen the radius, read [where to live on the French side when you work in Switzerland](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Si tu travailles aux Nations ou au CERN, Annemasse est de l'autre côté de Genève : [notre guide pour choisir où habiter selon ton lieu de travail](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) t'oriente plutôt vers Ferney-Voltaire et le Pays de Gex. Pour élargir le rayon, lis [où habiter côté France quand on travaille en Suisse](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).$r$, $f$Pour élargir le rayon, lis [où habiter côté France quand on travaille en Suisse](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).$f$),
    updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve'
  AND position($r$Si tu travailles aux Nations ou au CERN, Annemasse est de l'autre côté de Genève : [notre guide pour choisir où habiter selon ton lieu de travail](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) t'oriente plutôt vers Ferney-Voltaire et le Pays de Gex. Pour élargir le rayon, lis [où habiter côté France quand on travaille en Suisse](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$In Annemasse, you don't pick a neighbourhood in the abstract but **by profile**: align your home with your real daily commute, and the agglo becomes an asset rather than a constraint. Still deciding between Annemasse, Ferney-Voltaire and Saint-Julien? [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) goes through it profile by profile.$r$, $f$In Annemasse, you don't pick a neighbourhood in the abstract but **by profile**: align your home with your real daily commute, and the agglo becomes an asset rather than a constraint.$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$In Annemasse, you don't pick a neighbourhood in the abstract but **by profile**: align your home with your real daily commute, and the agglo becomes an asset rather than a constraint. Still deciding between Annemasse, Ferney-Voltaire and Saint-Julien? [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) goes through it profile by profile.$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$- [Où habiter en frontalier : villes françaises abordables](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)
- [Où habiter côté France selon ton profil](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$, $f$- [Où habiter en frontalier : villes françaises abordables](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$- [Où habiter en frontalier : villes françaises abordables](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)
- [Où habiter côté France selon ton profil](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$- [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [French towns near Geneva for cross-border workers](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)$r$, $f$- [French towns near Geneva for cross-border workers](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)$f$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($r$- [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [French towns near Geneva for cross-border workers](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$- [Où habiter en France quand on travaille à Genève ?](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [Les villes côté France pour les frontaliers](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)$r$, $f$- [Les villes côté France pour les frontaliers](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)$f$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($r$- [Où habiter en France quand on travaille à Genève ?](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [Les villes côté France pour les frontaliers](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Our guide to [where to live in France, profile by profile](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) starts from there, and [the French towns near Geneva, compared](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) give you the list town by town, with commutes and rents.$r$, $f$[The French towns near Geneva, compared](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) give you the list town by town, with commutes and rents.$f$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($r$Our guide to [where to live in France, profile by profile](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) starts from there, and [the French towns near Geneva, compared](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) give you the list town by town, with commutes and rents.$r$ IN content_en) > 0
  AND position($f$[The French towns near Geneva, compared](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) give you the list town by town, with commutes and rents.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Notre guide [où habiter côté France, profil par profil](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) part de là, et [les villes côté France, comparées](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) donnent la liste commune par commune, avec les trajets et les loyers.$r$, $f$[Les villes côté France, comparées](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) donnent la liste commune par commune, avec les trajets et les loyers.$f$),
    updated_at = now()
WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
  AND position($r$Notre guide [où habiter côté France, profil par profil](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve) part de là, et [les villes côté France, comparées](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) donnent la liste commune par commune, avec les trajets et les loyers.$r$ IN content_fr) > 0
  AND position($f$[Les villes côté France, comparées](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) donnent la liste commune par commune, avec les trajets et les loyers.$f$ IN content_fr) = 0;

COMMIT;
*/
