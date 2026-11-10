-- ============================================================================
-- B2 budget colocation : titres, métas, ancres vers la page argent, À lire aussi
-- Généré le 2026-11-02T14:08:31.298Z par scripts/build-slots-sql.mjs depuis scripts/lotb-b2.edits.mjs
--   · chaînes relevées sur la base vivante le 02/11/2026
--   · ancres vérifiées sur le contenu vivant de blog_posts (REST anon, lecture seule) le 2026-11-02T14:08:31.297Z : exactement 1 occurrence de chaque ancien texte, nouveau texte absent
-- Après validation du diff par Jérôme (D-B0), dans la séance du lot B.
-- Idempotent : chaque UPDATE est gardé par position(ancien) > 0 [AND position(nouveau) = 0 quand le nouveau texte n'est pas un fragment de l'ancien] — relancer le fichier est sans effet.
-- Fichier UTF-8 — ne pas normaliser les espaces.
-- 9 modifications · 2 articles · état en base à la génération (updated_at · longueur fr / en) :
--   budget-colocation-geneve-guide-complet · 2026-11-02T12:54:15.442979+00:00 · 18593 / 14496
--   trouver-colocation-geneve-frontalier · 2026-11-02T12:54:15.442979+00:00 · 5965 / 5530
-- ============================================================================

BEGIN;

-- [1/9] budget-colocation-geneve-guide-complet (fr, title_fr) · B2 · titre FR (version courte validée le 30/10)
UPDATE blog_posts
SET title_fr = replace(title_fr, $f$Budget colocation Genève 2026 : loyers réels et coût total$f$, $r$Colocation à Genève : le vrai budget 2026, tout compris$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$Budget colocation Genève 2026 : loyers réels et coût total$f$ IN title_fr) > 0
  AND position($r$Colocation à Genève : le vrai budget 2026, tout compris$r$ IN title_fr) = 0;

-- [2/9] budget-colocation-geneve-guide-complet (en, title_en) · B2 · EN title (short version approved on 30/10)
UPDATE blog_posts
SET title_en = replace(title_en, $f$Shared Housing Budget near Geneva: The Real Cost (2026)$f$, $r$Flatshare in Geneva: the real 2026 budget, all costs included$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$Shared Housing Budget near Geneva: The Real Cost (2026)$f$ IN title_en) > 0
  AND position($r$Flatshare in Geneva: the real 2026 budget, all costs included$r$ IN title_en) = 0;

-- [3/9] budget-colocation-geneve-guide-complet (fr, meta_description_fr) · B2 · méta FR : la fourchette d'abord (côté Genève seulement, voir le rapport pour l'écart des prix côté France)
UPDATE blog_posts
SET meta_description_fr = replace(meta_description_fr, $f$Combien coûte vraiment une colocation à Genève en 2026 ? Loyers réels par ville, studio vs colocation vs coliving, charges cachées et comment économiser.$f$, $r$Une chambre en colocation coûte 1 200 à 1 600 CHF à Genève centre, bien moins côté France. Loyer, charges, caution, coût d'entrée : le vrai budget 2026.$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$Combien coûte vraiment une colocation à Genève en 2026 ? Loyers réels par ville, studio vs colocation vs coliving, charges cachées et comment économiser.$f$ IN meta_description_fr) > 0
  AND position($r$Une chambre en colocation coûte 1 200 à 1 600 CHF à Genève centre, bien moins côté France. Loyer, charges, caution, coût d'entrée : le vrai budget 2026.$r$ IN meta_description_fr) = 0;

-- [4/9] budget-colocation-geneve-guide-complet (en, meta_description_en) · B2 · EN meta: the range first
UPDATE blog_posts
SET meta_description_en = replace(meta_description_en, $f$What does cross-border housing near Geneva really cost in 2026? Real prices by town, studio vs flatshare vs coliving, hidden costs and savings.$f$, $r$A flatshare room costs CHF 1,200 to 1,600 in central Geneva, far less on the French side. Rent, bills, deposit, move-in costs: the real 2026 budget.$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$What does cross-border housing near Geneva really cost in 2026? Real prices by town, studio vs flatshare vs coliving, hidden costs and savings.$f$ IN meta_description_en) > 0
  AND position($r$A flatshare room costs CHF 1,200 to 1,600 in central Geneva, far less on the French side. Rent, bills, deposit, move-in costs: the real 2026 budget.$r$ IN meta_description_en) = 0;

-- [5/9] budget-colocation-geneve-guide-complet (fr) · B2 · ouverture : ancre exacte « colocation à Genève » (au lieu de « coloc Genève tout inclus »)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$(voir notre [coloc Genève tout inclus](/colocation-geneve), chambres et prix en CHF)$f$, $r$(voir notre page [colocation à Genève](/colocation-geneve), côté France et tout inclus, avec chambres et prix en CHF)$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$(voir notre [coloc Genève tout inclus](/colocation-geneve), chambres et prix en CHF)$f$ IN content_fr) > 0
  AND position($r$(voir notre page [colocation à Genève](/colocation-geneve), côté France et tout inclus, avec chambres et prix en CHF)$r$ IN content_fr) = 0;

-- [6/9] budget-colocation-geneve-guide-complet (en) · B2 · opening: link with the exact anchor "flatshare in Geneva" (none today)
UPDATE blog_posts
SET content_en = replace(content_en, $f$are turning to **shared housing on the French side** as a smart alternative.$f$, $r$are turning to **shared housing on the French side** as a smart alternative (see our page on [flatshare in Geneva](/en/colocation-geneve), French side and all inclusive, with rooms and prices in CHF).$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$are turning to **shared housing on the French side** as a smart alternative.$f$ IN content_en) > 0
  AND position($r$are turning to **shared housing on the French side** as a smart alternative (see our page on [flatshare in Geneva](/en/colocation-geneve), French side and all inclusive, with rooms and prices in CHF).$r$ IN content_en) = 0;

-- [7/9] budget-colocation-geneve-guide-complet (fr) · B2 · « À lire aussi » : A3 (A1 y est depuis le 02/11)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$- [Où habiter en France quand on travaille à Genève ?](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$f$, $r$- [Où habiter en France quand on travaille à Genève ?](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$- [Où habiter en France quand on travaille à Genève ?](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$f$ IN content_fr) > 0
  AND position($r$- [Où habiter en France quand on travaille à Genève ?](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)$r$ IN content_fr) = 0;

-- [8/9] budget-colocation-geneve-guide-complet (en) · B2 · "Read also": A3 (A1 listed since 02/11)
UPDATE blog_posts
SET content_en = replace(content_en, $f$- [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$f$, $r$- [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [Find housing in France before you arrive in Geneva](/en/blog/trouver-logement-avant-d-arriver-geneve)$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$- [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$f$ IN content_en) > 0
  AND position($r$- [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [Find housing in France before you arrive in Geneva](/en/blog/trouver-logement-avant-d-arriver-geneve)$r$ IN content_en) = 0;

-- [9/9] trouver-colocation-geneve-frontalier (en) · B2 · trouver une colocation EN : lien d'ouverture vers la page argent (le FR a déjà « colocation à Genève côté France », décision du 04/09)
UPDATE blog_posts
SET content_en = replace(content_en, $f$Finding a colocation near Geneva when you work in Switzerland is a particular journey:$f$, $r$Finding a [flatshare in Geneva](/en/colocation-geneve), or just across the border, when you work in Switzerland is a particular journey:$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$Finding a colocation near Geneva when you work in Switzerland is a particular journey:$f$ IN content_en) > 0
  AND position($r$Finding a [flatshare in Geneva](/en/colocation-geneve), or just across the border, when you work in Switzerland is a particular journey:$r$ IN content_en) = 0;

-- ── Aperçu des ancrages (ancien → nouveau, première ligne de chaque texte) ──
-- [1] budget-colocation-geneve-guide-complet/fr, title_fr · B2 : « Budget colocation Genève 2026 : loyers réels et coût total » → « Colocation à Genève : le vrai budget 2026, tout compris »
-- [2] budget-colocation-geneve-guide-complet/en, title_en · B2 : « Shared Housing Budget near Geneva: The Real Cost (2026) » → « Flatshare in Geneva: the real 2026 budget, all costs included »
-- [3] budget-colocation-geneve-guide-complet/fr, meta_description_fr · B2 : « Combien coûte vraiment une colocation à Genève en 2026 ? Loyers réels p… » → « Une chambre en colocation coûte 1 200 à 1 600 CHF à Genève centre, bien… »
-- [4] budget-colocation-geneve-guide-complet/en, meta_description_en · B2 : « What does cross-border housing near Geneva really cost in 2026? Real pr… » → « A flatshare room costs CHF 1,200 to 1,600 in central Geneva, far less o… »
-- [5] budget-colocation-geneve-guide-complet/fr · B2 : « (voir notre [coloc Genève tout inclus](/colocation-geneve), chambres et… » → « (voir notre page [colocation à Genève](/colocation-geneve), côté France… »
-- [6] budget-colocation-geneve-guide-complet/en · B2 : « are turning to **shared housing on the French side** as a smart alterna… » → « are turning to **shared housing on the French side** as a smart alterna… »
-- [7] budget-colocation-geneve-guide-complet/fr · B2 : « - [Où habiter en France quand on travaille à Genève ?](/blog/ou-habiter… » → « - [Où habiter en France quand on travaille à Genève ?](/blog/ou-habiter… »
-- [8] budget-colocation-geneve-guide-complet/en · B2 : « - [Where to live in France when you work in Geneva](/en/blog/ou-habiter… » → « - [Where to live in France when you work in Geneva](/en/blog/ou-habiter… »
-- [9] trouver-colocation-geneve-frontalier/en · B2 : « Finding a colocation near Geneva when you work in Switzerland is a part… » → « Finding a [flatshare in Geneva](/en/colocation-geneve), or just across … »

COMMIT;

-- ── Vérification (lecture seule) : une ligne par article ; fr_ok / en_ok = true quand toutes les modifications de la langue sont en place, NULL = langue non touchée.
SELECT slug,
  CASE slug
    WHEN 'budget-colocation-geneve-guide-complet' THEN (position($f$Budget colocation Genève 2026 : loyers réels et coût total$f$ IN title_fr) = 0
      AND position($f$Combien coûte vraiment une colocation à Genève en 2026 ? Loyers réels par ville, studio vs colocation vs coliving, charges cachées et comment économiser.$f$ IN meta_description_fr) = 0
      AND position($f$(voir notre [coloc Genève tout inclus](/colocation-geneve), chambres et prix en CHF)$f$ IN content_fr) = 0
      AND position($r$- [Où habiter en France quand on travaille à Genève ?](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)$r$ IN content_fr) > 0)
  END AS fr_ok,
  CASE slug
    WHEN 'budget-colocation-geneve-guide-complet' THEN (position($f$Shared Housing Budget near Geneva: The Real Cost (2026)$f$ IN title_en) = 0
      AND position($f$What does cross-border housing near Geneva really cost in 2026? Real prices by town, studio vs flatshare vs coliving, hidden costs and savings.$f$ IN meta_description_en) = 0
      AND position($f$are turning to **shared housing on the French side** as a smart alternative.$f$ IN content_en) = 0
      AND position($r$- [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [Find housing in France before you arrive in Geneva](/en/blog/trouver-logement-avant-d-arriver-geneve)$r$ IN content_en) > 0)
    WHEN 'trouver-colocation-geneve-frontalier' THEN (position($f$Finding a colocation near Geneva when you work in Switzerland is a particular journey:$f$ IN content_en) = 0)
  END AS en_ok
FROM blog_posts
WHERE slug IN ('budget-colocation-geneve-guide-complet', 'trouver-colocation-geneve-frontalier')
ORDER BY slug;

-- ── Retour arrière (inverse exact, mêmes gardes miroir) : retirer les deux lignes /* et */ puis exécuter le bloc.
/*
BEGIN;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Finding a [flatshare in Geneva](/en/colocation-geneve), or just across the border, when you work in Switzerland is a particular journey:$r$, $f$Finding a colocation near Geneva when you work in Switzerland is a particular journey:$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$Finding a [flatshare in Geneva](/en/colocation-geneve), or just across the border, when you work in Switzerland is a particular journey:$r$ IN content_en) > 0
  AND position($f$Finding a colocation near Geneva when you work in Switzerland is a particular journey:$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$- [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [Find housing in France before you arrive in Geneva](/en/blog/trouver-logement-avant-d-arriver-geneve)$r$, $f$- [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$- [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [Find housing in France before you arrive in Geneva](/en/blog/trouver-logement-avant-d-arriver-geneve)$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$- [Où habiter en France quand on travaille à Genève ?](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)$r$, $f$- [Où habiter en France quand on travaille à Genève ?](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$- [Où habiter en France quand on travaille à Genève ?](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$are turning to **shared housing on the French side** as a smart alternative (see our page on [flatshare in Geneva](/en/colocation-geneve), French side and all inclusive, with rooms and prices in CHF).$r$, $f$are turning to **shared housing on the French side** as a smart alternative.$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$are turning to **shared housing on the French side** as a smart alternative (see our page on [flatshare in Geneva](/en/colocation-geneve), French side and all inclusive, with rooms and prices in CHF).$r$ IN content_en) > 0
  AND position($f$are turning to **shared housing on the French side** as a smart alternative.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$(voir notre page [colocation à Genève](/colocation-geneve), côté France et tout inclus, avec chambres et prix en CHF)$r$, $f$(voir notre [coloc Genève tout inclus](/colocation-geneve), chambres et prix en CHF)$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$(voir notre page [colocation à Genève](/colocation-geneve), côté France et tout inclus, avec chambres et prix en CHF)$r$ IN content_fr) > 0
  AND position($f$(voir notre [coloc Genève tout inclus](/colocation-geneve), chambres et prix en CHF)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET meta_description_en = replace(meta_description_en, $r$A flatshare room costs CHF 1,200 to 1,600 in central Geneva, far less on the French side. Rent, bills, deposit, move-in costs: the real 2026 budget.$r$, $f$What does cross-border housing near Geneva really cost in 2026? Real prices by town, studio vs flatshare vs coliving, hidden costs and savings.$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$A flatshare room costs CHF 1,200 to 1,600 in central Geneva, far less on the French side. Rent, bills, deposit, move-in costs: the real 2026 budget.$r$ IN meta_description_en) > 0
  AND position($f$What does cross-border housing near Geneva really cost in 2026? Real prices by town, studio vs flatshare vs coliving, hidden costs and savings.$f$ IN meta_description_en) = 0;

UPDATE blog_posts
SET meta_description_fr = replace(meta_description_fr, $r$Une chambre en colocation coûte 1 200 à 1 600 CHF à Genève centre, bien moins côté France. Loyer, charges, caution, coût d'entrée : le vrai budget 2026.$r$, $f$Combien coûte vraiment une colocation à Genève en 2026 ? Loyers réels par ville, studio vs colocation vs coliving, charges cachées et comment économiser.$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$Une chambre en colocation coûte 1 200 à 1 600 CHF à Genève centre, bien moins côté France. Loyer, charges, caution, coût d'entrée : le vrai budget 2026.$r$ IN meta_description_fr) > 0
  AND position($f$Combien coûte vraiment une colocation à Genève en 2026 ? Loyers réels par ville, studio vs colocation vs coliving, charges cachées et comment économiser.$f$ IN meta_description_fr) = 0;

UPDATE blog_posts
SET title_en = replace(title_en, $r$Flatshare in Geneva: the real 2026 budget, all costs included$r$, $f$Shared Housing Budget near Geneva: The Real Cost (2026)$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$Flatshare in Geneva: the real 2026 budget, all costs included$r$ IN title_en) > 0
  AND position($f$Shared Housing Budget near Geneva: The Real Cost (2026)$f$ IN title_en) = 0;

UPDATE blog_posts
SET title_fr = replace(title_fr, $r$Colocation à Genève : le vrai budget 2026, tout compris$r$, $f$Budget colocation Genève 2026 : loyers réels et coût total$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$Colocation à Genève : le vrai budget 2026, tout compris$r$ IN title_fr) > 0
  AND position($f$Budget colocation Genève 2026 : loyers réels et coût total$f$ IN title_fr) = 0;

COMMIT;
*/
