-- ============================================================================
-- B1 coût de la vie : titres, métas, section « quel salaire compense », Pour aller plus loin
-- Généré le 2026-11-02T14:08:30.694Z par scripts/build-slots-sql.mjs depuis scripts/lotb-b1.edits.mjs
--   · chaînes relevées sur la base vivante le 02/11/2026
--   · ancres vérifiées sur le contenu vivant de blog_posts (REST anon, lecture seule) le 2026-11-02T14:08:30.687Z : exactement 1 occurrence de chaque ancien texte, nouveau texte absent
-- Après validation du diff par Jérôme (D-B0), dans la séance du lot B.
-- Idempotent : chaque UPDATE est gardé par position(ancien) > 0 [AND position(nouveau) = 0 quand le nouveau texte n'est pas un fragment de l'ancien] — relancer le fichier est sans effet.
-- Fichier UTF-8 — ne pas normaliser les espaces.
-- 11 modifications · 1 articles · état en base à la génération (updated_at · longueur fr / en) :
--   cout-de-la-vie-suisse-france-frontalier-2026 · 2026-10-13T15:32:15.797408+00:00 · 11291 / 10003
-- ============================================================================

BEGIN;

-- [1/11] cout-de-la-vie-suisse-france-frontalier-2026 (fr, title_fr) · B1 · titre FR (version courte validée le 30/10)
UPDATE blog_posts
SET title_fr = replace(title_fr, $f$Coût de la vie Suisse vs France 2026 : prix réels et vrai bilan$f$, $r$Coût de la vie Suisse-France 2026 : prix réels et salaire à viser$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$Coût de la vie Suisse vs France 2026 : prix réels et vrai bilan$f$ IN title_fr) > 0
  AND position($r$Coût de la vie Suisse-France 2026 : prix réels et salaire à viser$r$ IN title_fr) = 0;

-- [2/11] cout-de-la-vie-suisse-france-frontalier-2026 (en, title_en) · B1 · EN title (short version approved on 30/10)
UPDATE blog_posts
SET title_en = replace(title_en, $f$Switzerland vs France cost of living 2026$f$, $r$Switzerland vs France cost of living 2026: real prices, salary needed$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$Switzerland vs France cost of living 2026$f$ IN title_en) > 0
  AND position($r$Switzerland vs France cost of living 2026: real prices, salary needed$r$ IN title_en) = 0;

-- [3/11] cout-de-la-vie-suisse-france-frontalier-2026 (fr, meta_description_fr) · B1 · méta FR : la réponse chiffrée d'abord
UPDATE blog_posts
SET meta_description_fr = replace(meta_description_fr, $f$Prix de la vie en Suisse vs France en 2026 : loyer ×2-3, courses, restaurants, LAMal vs CMU, transport. Le vrai bilan chiffré d'un frontalier de Genève.$f$, $r$Logement ×2 à ×3 à Genève, courses de base 30 à 40 % moins chères en France, LAMal ou CMU : le bilan 2026 du frontalier, et le salaire qui compense.$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$Prix de la vie en Suisse vs France en 2026 : loyer ×2-3, courses, restaurants, LAMal vs CMU, transport. Le vrai bilan chiffré d'un frontalier de Genève.$f$ IN meta_description_fr) > 0
  AND position($r$Logement ×2 à ×3 à Genève, courses de base 30 à 40 % moins chères en France, LAMal ou CMU : le bilan 2026 du frontalier, et le salaire qui compense.$r$ IN meta_description_fr) = 0;

-- [4/11] cout-de-la-vie-suisse-france-frontalier-2026 (en, meta_description_en) · B1 · EN meta: the figures first
UPDATE blog_posts
SET meta_description_en = replace(meta_description_en, $f$Cost of living Switzerland vs France 2026: rent ×2-3, groceries, dining, LAMal vs CMU, transport. The real numbers for a Geneva cross-border worker.$f$, $r$Housing ×2 to ×3 in Geneva, staples 30-40% cheaper in France, LAMal or CMU: the 2026 frontalier balance, and the salary that makes it worth it.$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$Cost of living Switzerland vs France 2026: rent ×2-3, groceries, dining, LAMal vs CMU, transport. The real numbers for a Geneva cross-border worker.$f$ IN meta_description_en) > 0
  AND position($r$Housing ×2 to ×3 in Geneva, staples 30-40% cheaper in France, LAMal or CMU: the 2026 frontalier balance, and the salary that makes it worth it.$r$ IN meta_description_en) = 0;

-- [5/11] cout-de-la-vie-suisse-france-frontalier-2026 (fr) · B1 · nouvelle section « quel salaire compense », avant « Le vrai score »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$## Le vrai score : combien te revient ta vie ?$f$, $r$## Quel salaire genevois compense vraiment le coût de la vie suisse ? Le cas du célibataire logé côté France

Logé côté France, un célibataire vit confortablement à partir d'environ 5 300 CHF net par mois, soit 90 000 CHF brut par an : son logement tout inclus reste sous 30 % de son net, et il lui reste 2 100 à 2 800 CHF une fois les dépenses courantes payées. En dessous, ça tient encore, mais la marge fond vite.

Pour le calcul, on a repris les postes de ce guide (courses optimisées côté France, santé, abonnement Léman Express, sorties) et le loyer d'une de nos chambres tout inclus côté France, 1 370 à 1 430 CHF par mois charges, fibre et ménage compris. Total : 2 510 à 3 180 CHF de dépenses par mois. Les salaires nets sont ceux de notre [grille des salaires suisses 2026](/blog/salaire-suisse-net-frontalier-2026), pour une personne seule sans enfant (barème A).

| Salaire brut annuel (médiane du métier) | Net mensuel estimé | Logement tout inclus, en part du net | Reste après dépenses courantes |
|---|---|---|---|
| 72 000 CHF (métiers techniques, administratif) | ~4 400 CHF | 31 à 33 % | 1 200 à 1 900 CHF |
| 90 000 CHF (santé non médicale) | ~5 300 CHF | 26 à 27 % | 2 100 à 2 800 CHF |
| 102 000 CHF (ingénierie, IT) | ~5 950 CHF | 23 à 24 % | 2 750 à 3 450 CHF |

Le seuil des 30 % est le repère classique : au-delà, le logement commence à rogner sur l'épargne. Avec une chambre tout inclus, tu passes sous ce seuil à partir de 4 600 à 4 800 CHF net par mois. Le même célibataire logé à Genève, dans un studio à 1 600 à 2 400 CHF hors charges, y consacrerait 30 à 45 % d'un net de 5 300 CHF.

Ce sont des ordres de grandeur : ton net réel dépend de ta caisse de pension et de ta situation, et ta fiche de paie fait foi.

## Le vrai score : combien te revient ta vie ?$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$## Le vrai score : combien te revient ta vie ?$f$ IN content_fr) > 0
  AND position($r$## Quel salaire genevois compense vraiment le coût de la vie suisse ? Le cas du célibataire logé côté France

Logé côté France, un célibataire vit confortablement à partir d'environ 5 300 CHF net par mois, soit 90 000 CHF brut par an : son logement tout inclus reste sous 30 % de son net, et il lui reste 2 100 à 2 800 CHF une fois les dépenses courantes payées. En dessous, ça tient encore, mais la marge fond vite.

Pour le calcul, on a repris les postes de ce guide (courses optimisées côté France, santé, abonnement Léman Express, sorties) et le loyer d'une de nos chambres tout inclus côté France, 1 370 à 1 430 CHF par mois charges, fibre et ménage compris. Total : 2 510 à 3 180 CHF de dépenses par mois. Les salaires nets sont ceux de notre [grille des salaires suisses 2026](/blog/salaire-suisse-net-frontalier-2026), pour une personne seule sans enfant (barème A).

| Salaire brut annuel (médiane du métier) | Net mensuel estimé | Logement tout inclus, en part du net | Reste après dépenses courantes |
|---|---|---|---|
| 72 000 CHF (métiers techniques, administratif) | ~4 400 CHF | 31 à 33 % | 1 200 à 1 900 CHF |
| 90 000 CHF (santé non médicale) | ~5 300 CHF | 26 à 27 % | 2 100 à 2 800 CHF |
| 102 000 CHF (ingénierie, IT) | ~5 950 CHF | 23 à 24 % | 2 750 à 3 450 CHF |

Le seuil des 30 % est le repère classique : au-delà, le logement commence à rogner sur l'épargne. Avec une chambre tout inclus, tu passes sous ce seuil à partir de 4 600 à 4 800 CHF net par mois. Le même célibataire logé à Genève, dans un studio à 1 600 à 2 400 CHF hors charges, y consacrerait 30 à 45 % d'un net de 5 300 CHF.

Ce sont des ordres de grandeur : ton net réel dépend de ta caisse de pension et de ta situation, et ta fiche de paie fait foi.

## Le vrai score : combien te revient ta vie ?$r$ IN content_fr) = 0;

-- [6/11] cout-de-la-vie-suisse-france-frontalier-2026 (en) · B1 · new "what salary makes up for it" section, before "The real score"
UPDATE blog_posts
SET content_en = replace(content_en, $f$## The real score: what does your life cost?$f$, $r$## What Geneva salary really makes up for the Swiss cost of living? A single person living on the French side

Living on the French side, a single person lives comfortably from about CHF 5,300 net a month, or CHF 90,000 gross a year: all-inclusive housing stays under 30% of net pay, and CHF 2,100 to 2,800 is left once everyday costs are paid. Below that it still works, but the margin shrinks fast.

For the maths, we took the items in this guide (groceries bought on the French side, healthcare, a Léman Express pass, going out) and the rent of one of our all-inclusive rooms on the French side, CHF 1,370 to 1,430 a month with bills, fibre and cleaning included. That's CHF 2,510 to 3,180 of spending a month. Net salaries come from our [2026 Swiss salary grid](/en/blog/salaire-suisse-net-frontalier-2026), for a single person with no children (tax scale A).

| Gross annual salary (median for the role) | Estimated monthly net | All-inclusive housing, share of net | Left after everyday costs |
|---|---|---|---|
| CHF 72,000 (technical, admin) | ~CHF 4,400 | 31 to 33% | CHF 1,200 to 1,900 |
| CHF 90,000 (healthcare, non-medical) | ~CHF 5,300 | 26 to 27% | CHF 2,100 to 2,800 |
| CHF 102,000 (engineering, IT) | ~CHF 5,950 | 23 to 24% | CHF 2,750 to 3,450 |

The 30% line is the usual benchmark: above it, housing starts eating into your savings. With an all-inclusive room, you drop below it from CHF 4,600 to 4,800 net a month. The same person renting a studio in Geneva at CHF 1,600 to 2,400 before bills would spend 30 to 45% of a CHF 5,300 net on it.

These are ballpark figures: your real net depends on your pension fund and your situation, and your payslip has the final word.

## The real score: what does your life cost?$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$## The real score: what does your life cost?$f$ IN content_en) > 0
  AND position($r$## What Geneva salary really makes up for the Swiss cost of living? A single person living on the French side

Living on the French side, a single person lives comfortably from about CHF 5,300 net a month, or CHF 90,000 gross a year: all-inclusive housing stays under 30% of net pay, and CHF 2,100 to 2,800 is left once everyday costs are paid. Below that it still works, but the margin shrinks fast.

For the maths, we took the items in this guide (groceries bought on the French side, healthcare, a Léman Express pass, going out) and the rent of one of our all-inclusive rooms on the French side, CHF 1,370 to 1,430 a month with bills, fibre and cleaning included. That's CHF 2,510 to 3,180 of spending a month. Net salaries come from our [2026 Swiss salary grid](/en/blog/salaire-suisse-net-frontalier-2026), for a single person with no children (tax scale A).

| Gross annual salary (median for the role) | Estimated monthly net | All-inclusive housing, share of net | Left after everyday costs |
|---|---|---|---|
| CHF 72,000 (technical, admin) | ~CHF 4,400 | 31 to 33% | CHF 1,200 to 1,900 |
| CHF 90,000 (healthcare, non-medical) | ~CHF 5,300 | 26 to 27% | CHF 2,100 to 2,800 |
| CHF 102,000 (engineering, IT) | ~CHF 5,950 | 23 to 24% | CHF 2,750 to 3,450 |

The 30% line is the usual benchmark: above it, housing starts eating into your savings. With an all-inclusive room, you drop below it from CHF 4,600 to 4,800 net a month. The same person renting a studio in Geneva at CHF 1,600 to 2,400 before bills would spend 30 to 45% of a CHF 5,300 net on it.

These are ballpark figures: your real net depends on your pension fund and your situation, and your payslip has the final word.

## The real score: what does your life cost?$r$ IN content_en) = 0;

-- [7/11] cout-de-la-vie-suisse-france-frontalier-2026 (fr) · B1 · « Pour aller plus loin » : A1 et B8 (budget colocation y est déjà)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$- [Quartiers d'Annemasse : où vivre selon ton profil](/blog/quartiers-annemasse-ou-vivre-selon-profil)$f$, $r$- [Quartiers d'Annemasse : où vivre selon ton profil](/blog/quartiers-annemasse-ou-vivre-selon-profil)
- [Où habiter en France quand on travaille à Genève ?](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [Vivre en France, travailler à Genève : le guide du frontalier](/blog/living-in-france-working-in-geneva)$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$- [Quartiers d'Annemasse : où vivre selon ton profil](/blog/quartiers-annemasse-ou-vivre-selon-profil)$f$ IN content_fr) > 0
  AND position($r$- [Quartiers d'Annemasse : où vivre selon ton profil](/blog/quartiers-annemasse-ou-vivre-selon-profil)
- [Où habiter en France quand on travaille à Genève ?](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [Vivre en France, travailler à Genève : le guide du frontalier](/blog/living-in-france-working-in-geneva)$r$ IN content_fr) = 0;

-- [8/11] cout-de-la-vie-suisse-france-frontalier-2026 (en) · B1 · "Further reading": A1 and B8 (flatshare budget already listed)
UPDATE blog_posts
SET content_en = replace(content_en, $f$- [Annemasse neighbourhoods by profile](/en/blog/quartiers-annemasse-ou-vivre-selon-profil)$f$, $r$- [Annemasse neighbourhoods by profile](/en/blog/quartiers-annemasse-ou-vivre-selon-profil)
- [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [Living in France, working in Geneva: the complete guide](/en/blog/living-in-france-working-in-geneva)$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$- [Annemasse neighbourhoods by profile](/en/blog/quartiers-annemasse-ou-vivre-selon-profil)$f$ IN content_en) > 0
  AND position($r$- [Annemasse neighbourhoods by profile](/en/blog/quartiers-annemasse-ou-vivre-selon-profil)
- [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [Living in France, working in Geneva: the complete guide](/en/blog/living-in-france-working-in-geneva)$r$ IN content_en) = 0;

-- [9/11] cout-de-la-vie-suisse-france-frontalier-2026 (fr) · B1 · date de mise à jour (nouvelle section)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$*Article mis à jour 2026-06.$f$, $r$*Article mis à jour 2026-11.$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$*Article mis à jour 2026-06.$f$ IN content_fr) > 0
  AND position($r$*Article mis à jour 2026-11.$r$ IN content_fr) = 0;

-- [10/11] cout-de-la-vie-suisse-france-frontalier-2026 (en) · B1 · update date (new section)
UPDATE blog_posts
SET content_en = replace(content_en, $f$*Article updated 2026-06.$f$, $r$*Article updated 2026-11.$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$*Article updated 2026-06.$f$ IN content_en) > 0
  AND position($r$*Article updated 2026-11.$r$ IN content_en) = 0;

-- [11/11] cout-de-la-vie-suisse-france-frontalier-2026 (en) · CORRECTIF · lien « See available rooms » qui menait à la candidature
UPDATE blog_posts
SET content_en = replace(content_en, $f$[See available rooms](/en/candidature)$f$, $r$[See available rooms](/en/chambres-disponibles)$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$[See available rooms](/en/candidature)$f$ IN content_en) > 0
  AND position($r$[See available rooms](/en/chambres-disponibles)$r$ IN content_en) = 0;

-- ── Aperçu des ancrages (ancien → nouveau, première ligne de chaque texte) ──
-- [1] cout-de-la-vie-suisse-france-frontalier-2026/fr, title_fr · B1 : « Coût de la vie Suisse vs France 2026 : prix réels et vrai bilan » → « Coût de la vie Suisse-France 2026 : prix réels et salaire à viser »
-- [2] cout-de-la-vie-suisse-france-frontalier-2026/en, title_en · B1 : « Switzerland vs France cost of living 2026 » → « Switzerland vs France cost of living 2026: real prices, salary needed »
-- [3] cout-de-la-vie-suisse-france-frontalier-2026/fr, meta_description_fr · B1 : « Prix de la vie en Suisse vs France en 2026 : loyer ×2-3, courses, resta… » → « Logement ×2 à ×3 à Genève, courses de base 30 à 40 % moins chères en Fr… »
-- [4] cout-de-la-vie-suisse-france-frontalier-2026/en, meta_description_en · B1 : « Cost of living Switzerland vs France 2026: rent ×2-3, groceries, dining… » → « Housing ×2 to ×3 in Geneva, staples 30-40% cheaper in France, LAMal or … »
-- [5] cout-de-la-vie-suisse-france-frontalier-2026/fr · B1 : « ## Le vrai score : combien te revient ta vie ? » → « ## Quel salaire genevois compense vraiment le coût de la vie suisse ? L… »
-- [6] cout-de-la-vie-suisse-france-frontalier-2026/en · B1 : « ## The real score: what does your life cost? » → « ## What Geneva salary really makes up for the Swiss cost of living? A s… »
-- [7] cout-de-la-vie-suisse-france-frontalier-2026/fr · B1 : « - [Quartiers d'Annemasse : où vivre selon ton profil](/blog/quartiers-a… » → « - [Quartiers d'Annemasse : où vivre selon ton profil](/blog/quartiers-a… »
-- [8] cout-de-la-vie-suisse-france-frontalier-2026/en · B1 : « - [Annemasse neighbourhoods by profile](/en/blog/quartiers-annemasse-ou… » → « - [Annemasse neighbourhoods by profile](/en/blog/quartiers-annemasse-ou… »
-- [9] cout-de-la-vie-suisse-france-frontalier-2026/fr · B1 : « *Article mis à jour 2026-06. » → « *Article mis à jour 2026-11. »
-- [10] cout-de-la-vie-suisse-france-frontalier-2026/en · B1 : « *Article updated 2026-06. » → « *Article updated 2026-11. »
-- [11] cout-de-la-vie-suisse-france-frontalier-2026/en · CORRECTIF : « [See available rooms](/en/candidature) » → « [See available rooms](/en/chambres-disponibles) »

COMMIT;

-- ── Vérification (lecture seule) : une ligne par article ; fr_ok / en_ok = true quand toutes les modifications de la langue sont en place, NULL = langue non touchée.
SELECT slug,
  CASE slug
    WHEN 'cout-de-la-vie-suisse-france-frontalier-2026' THEN (position($f$Coût de la vie Suisse vs France 2026 : prix réels et vrai bilan$f$ IN title_fr) = 0
      AND position($f$Prix de la vie en Suisse vs France en 2026 : loyer ×2-3, courses, restaurants, LAMal vs CMU, transport. Le vrai bilan chiffré d'un frontalier de Genève.$f$ IN meta_description_fr) = 0
      AND position($r$## Quel salaire genevois compense vraiment le coût de la vie suisse ? Le cas du célibataire logé côté France

Logé côté France, un célibataire vit confortablement à partir d'environ 5 300 CHF net par mois, soit 90 000 CHF brut par an : son logement tout inclus reste sous 30 % de son net, et il lui reste 2 100 à 2 800 CHF une fois les dépenses courantes payées. En dessous, ça tient encore, mais la marge fond vite.

Pour le calcul, on a repris les postes de ce guide (courses optimisées côté France, santé, abonnement Léman Express, sorties) et le loyer d'une de nos chambres tout inclus côté France, 1 370 à 1 430 CHF par mois charges, fibre et ménage compris. Total : 2 510 à 3 180 CHF de dépenses par mois. Les salaires nets sont ceux de notre [grille des salaires suisses 2026](/blog/salaire-suisse-net-frontalier-2026), pour une personne seule sans enfant (barème A).

| Salaire brut annuel (médiane du métier) | Net mensuel estimé | Logement tout inclus, en part du net | Reste après dépenses courantes |
|---|---|---|---|
| 72 000 CHF (métiers techniques, administratif) | ~4 400 CHF | 31 à 33 % | 1 200 à 1 900 CHF |
| 90 000 CHF (santé non médicale) | ~5 300 CHF | 26 à 27 % | 2 100 à 2 800 CHF |
| 102 000 CHF (ingénierie, IT) | ~5 950 CHF | 23 à 24 % | 2 750 à 3 450 CHF |

Le seuil des 30 % est le repère classique : au-delà, le logement commence à rogner sur l'épargne. Avec une chambre tout inclus, tu passes sous ce seuil à partir de 4 600 à 4 800 CHF net par mois. Le même célibataire logé à Genève, dans un studio à 1 600 à 2 400 CHF hors charges, y consacrerait 30 à 45 % d'un net de 5 300 CHF.

Ce sont des ordres de grandeur : ton net réel dépend de ta caisse de pension et de ta situation, et ta fiche de paie fait foi.

## Le vrai score : combien te revient ta vie ?$r$ IN content_fr) > 0
      AND position($r$- [Quartiers d'Annemasse : où vivre selon ton profil](/blog/quartiers-annemasse-ou-vivre-selon-profil)
- [Où habiter en France quand on travaille à Genève ?](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [Vivre en France, travailler à Genève : le guide du frontalier](/blog/living-in-france-working-in-geneva)$r$ IN content_fr) > 0
      AND position($f$*Article mis à jour 2026-06.$f$ IN content_fr) = 0)
  END AS fr_ok,
  CASE slug
    WHEN 'cout-de-la-vie-suisse-france-frontalier-2026' THEN (position($r$Switzerland vs France cost of living 2026: real prices, salary needed$r$ IN title_en) > 0
      AND position($f$Cost of living Switzerland vs France 2026: rent ×2-3, groceries, dining, LAMal vs CMU, transport. The real numbers for a Geneva cross-border worker.$f$ IN meta_description_en) = 0
      AND position($r$## What Geneva salary really makes up for the Swiss cost of living? A single person living on the French side

Living on the French side, a single person lives comfortably from about CHF 5,300 net a month, or CHF 90,000 gross a year: all-inclusive housing stays under 30% of net pay, and CHF 2,100 to 2,800 is left once everyday costs are paid. Below that it still works, but the margin shrinks fast.

For the maths, we took the items in this guide (groceries bought on the French side, healthcare, a Léman Express pass, going out) and the rent of one of our all-inclusive rooms on the French side, CHF 1,370 to 1,430 a month with bills, fibre and cleaning included. That's CHF 2,510 to 3,180 of spending a month. Net salaries come from our [2026 Swiss salary grid](/en/blog/salaire-suisse-net-frontalier-2026), for a single person with no children (tax scale A).

| Gross annual salary (median for the role) | Estimated monthly net | All-inclusive housing, share of net | Left after everyday costs |
|---|---|---|---|
| CHF 72,000 (technical, admin) | ~CHF 4,400 | 31 to 33% | CHF 1,200 to 1,900 |
| CHF 90,000 (healthcare, non-medical) | ~CHF 5,300 | 26 to 27% | CHF 2,100 to 2,800 |
| CHF 102,000 (engineering, IT) | ~CHF 5,950 | 23 to 24% | CHF 2,750 to 3,450 |

The 30% line is the usual benchmark: above it, housing starts eating into your savings. With an all-inclusive room, you drop below it from CHF 4,600 to 4,800 net a month. The same person renting a studio in Geneva at CHF 1,600 to 2,400 before bills would spend 30 to 45% of a CHF 5,300 net on it.

These are ballpark figures: your real net depends on your pension fund and your situation, and your payslip has the final word.

## The real score: what does your life cost?$r$ IN content_en) > 0
      AND position($r$- [Annemasse neighbourhoods by profile](/en/blog/quartiers-annemasse-ou-vivre-selon-profil)
- [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [Living in France, working in Geneva: the complete guide](/en/blog/living-in-france-working-in-geneva)$r$ IN content_en) > 0
      AND position($f$*Article updated 2026-06.$f$ IN content_en) = 0
      AND position($f$[See available rooms](/en/candidature)$f$ IN content_en) = 0)
  END AS en_ok
FROM blog_posts
WHERE slug IN ('cout-de-la-vie-suisse-france-frontalier-2026')
ORDER BY slug;

-- ── Retour arrière (inverse exact, mêmes gardes miroir) : retirer les deux lignes /* et */ puis exécuter le bloc.
/*
BEGIN;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[See available rooms](/en/chambres-disponibles)$r$, $f$[See available rooms](/en/candidature)$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$[See available rooms](/en/chambres-disponibles)$r$ IN content_en) > 0
  AND position($f$[See available rooms](/en/candidature)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$*Article updated 2026-11.$r$, $f$*Article updated 2026-06.$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$*Article updated 2026-11.$r$ IN content_en) > 0
  AND position($f$*Article updated 2026-06.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$*Article mis à jour 2026-11.$r$, $f$*Article mis à jour 2026-06.$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$*Article mis à jour 2026-11.$r$ IN content_fr) > 0
  AND position($f$*Article mis à jour 2026-06.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$- [Annemasse neighbourhoods by profile](/en/blog/quartiers-annemasse-ou-vivre-selon-profil)
- [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [Living in France, working in Geneva: the complete guide](/en/blog/living-in-france-working-in-geneva)$r$, $f$- [Annemasse neighbourhoods by profile](/en/blog/quartiers-annemasse-ou-vivre-selon-profil)$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$- [Annemasse neighbourhoods by profile](/en/blog/quartiers-annemasse-ou-vivre-selon-profil)
- [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [Living in France, working in Geneva: the complete guide](/en/blog/living-in-france-working-in-geneva)$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$- [Quartiers d'Annemasse : où vivre selon ton profil](/blog/quartiers-annemasse-ou-vivre-selon-profil)
- [Où habiter en France quand on travaille à Genève ?](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [Vivre en France, travailler à Genève : le guide du frontalier](/blog/living-in-france-working-in-geneva)$r$, $f$- [Quartiers d'Annemasse : où vivre selon ton profil](/blog/quartiers-annemasse-ou-vivre-selon-profil)$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$- [Quartiers d'Annemasse : où vivre selon ton profil](/blog/quartiers-annemasse-ou-vivre-selon-profil)
- [Où habiter en France quand on travaille à Genève ?](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)
- [Vivre en France, travailler à Genève : le guide du frontalier](/blog/living-in-france-working-in-geneva)$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$## What Geneva salary really makes up for the Swiss cost of living? A single person living on the French side

Living on the French side, a single person lives comfortably from about CHF 5,300 net a month, or CHF 90,000 gross a year: all-inclusive housing stays under 30% of net pay, and CHF 2,100 to 2,800 is left once everyday costs are paid. Below that it still works, but the margin shrinks fast.

For the maths, we took the items in this guide (groceries bought on the French side, healthcare, a Léman Express pass, going out) and the rent of one of our all-inclusive rooms on the French side, CHF 1,370 to 1,430 a month with bills, fibre and cleaning included. That's CHF 2,510 to 3,180 of spending a month. Net salaries come from our [2026 Swiss salary grid](/en/blog/salaire-suisse-net-frontalier-2026), for a single person with no children (tax scale A).

| Gross annual salary (median for the role) | Estimated monthly net | All-inclusive housing, share of net | Left after everyday costs |
|---|---|---|---|
| CHF 72,000 (technical, admin) | ~CHF 4,400 | 31 to 33% | CHF 1,200 to 1,900 |
| CHF 90,000 (healthcare, non-medical) | ~CHF 5,300 | 26 to 27% | CHF 2,100 to 2,800 |
| CHF 102,000 (engineering, IT) | ~CHF 5,950 | 23 to 24% | CHF 2,750 to 3,450 |

The 30% line is the usual benchmark: above it, housing starts eating into your savings. With an all-inclusive room, you drop below it from CHF 4,600 to 4,800 net a month. The same person renting a studio in Geneva at CHF 1,600 to 2,400 before bills would spend 30 to 45% of a CHF 5,300 net on it.

These are ballpark figures: your real net depends on your pension fund and your situation, and your payslip has the final word.

## The real score: what does your life cost?$r$, $f$## The real score: what does your life cost?$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$## What Geneva salary really makes up for the Swiss cost of living? A single person living on the French side

Living on the French side, a single person lives comfortably from about CHF 5,300 net a month, or CHF 90,000 gross a year: all-inclusive housing stays under 30% of net pay, and CHF 2,100 to 2,800 is left once everyday costs are paid. Below that it still works, but the margin shrinks fast.

For the maths, we took the items in this guide (groceries bought on the French side, healthcare, a Léman Express pass, going out) and the rent of one of our all-inclusive rooms on the French side, CHF 1,370 to 1,430 a month with bills, fibre and cleaning included. That's CHF 2,510 to 3,180 of spending a month. Net salaries come from our [2026 Swiss salary grid](/en/blog/salaire-suisse-net-frontalier-2026), for a single person with no children (tax scale A).

| Gross annual salary (median for the role) | Estimated monthly net | All-inclusive housing, share of net | Left after everyday costs |
|---|---|---|---|
| CHF 72,000 (technical, admin) | ~CHF 4,400 | 31 to 33% | CHF 1,200 to 1,900 |
| CHF 90,000 (healthcare, non-medical) | ~CHF 5,300 | 26 to 27% | CHF 2,100 to 2,800 |
| CHF 102,000 (engineering, IT) | ~CHF 5,950 | 23 to 24% | CHF 2,750 to 3,450 |

The 30% line is the usual benchmark: above it, housing starts eating into your savings. With an all-inclusive room, you drop below it from CHF 4,600 to 4,800 net a month. The same person renting a studio in Geneva at CHF 1,600 to 2,400 before bills would spend 30 to 45% of a CHF 5,300 net on it.

These are ballpark figures: your real net depends on your pension fund and your situation, and your payslip has the final word.

## The real score: what does your life cost?$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$## Quel salaire genevois compense vraiment le coût de la vie suisse ? Le cas du célibataire logé côté France

Logé côté France, un célibataire vit confortablement à partir d'environ 5 300 CHF net par mois, soit 90 000 CHF brut par an : son logement tout inclus reste sous 30 % de son net, et il lui reste 2 100 à 2 800 CHF une fois les dépenses courantes payées. En dessous, ça tient encore, mais la marge fond vite.

Pour le calcul, on a repris les postes de ce guide (courses optimisées côté France, santé, abonnement Léman Express, sorties) et le loyer d'une de nos chambres tout inclus côté France, 1 370 à 1 430 CHF par mois charges, fibre et ménage compris. Total : 2 510 à 3 180 CHF de dépenses par mois. Les salaires nets sont ceux de notre [grille des salaires suisses 2026](/blog/salaire-suisse-net-frontalier-2026), pour une personne seule sans enfant (barème A).

| Salaire brut annuel (médiane du métier) | Net mensuel estimé | Logement tout inclus, en part du net | Reste après dépenses courantes |
|---|---|---|---|
| 72 000 CHF (métiers techniques, administratif) | ~4 400 CHF | 31 à 33 % | 1 200 à 1 900 CHF |
| 90 000 CHF (santé non médicale) | ~5 300 CHF | 26 à 27 % | 2 100 à 2 800 CHF |
| 102 000 CHF (ingénierie, IT) | ~5 950 CHF | 23 à 24 % | 2 750 à 3 450 CHF |

Le seuil des 30 % est le repère classique : au-delà, le logement commence à rogner sur l'épargne. Avec une chambre tout inclus, tu passes sous ce seuil à partir de 4 600 à 4 800 CHF net par mois. Le même célibataire logé à Genève, dans un studio à 1 600 à 2 400 CHF hors charges, y consacrerait 30 à 45 % d'un net de 5 300 CHF.

Ce sont des ordres de grandeur : ton net réel dépend de ta caisse de pension et de ta situation, et ta fiche de paie fait foi.

## Le vrai score : combien te revient ta vie ?$r$, $f$## Le vrai score : combien te revient ta vie ?$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$## Quel salaire genevois compense vraiment le coût de la vie suisse ? Le cas du célibataire logé côté France

Logé côté France, un célibataire vit confortablement à partir d'environ 5 300 CHF net par mois, soit 90 000 CHF brut par an : son logement tout inclus reste sous 30 % de son net, et il lui reste 2 100 à 2 800 CHF une fois les dépenses courantes payées. En dessous, ça tient encore, mais la marge fond vite.

Pour le calcul, on a repris les postes de ce guide (courses optimisées côté France, santé, abonnement Léman Express, sorties) et le loyer d'une de nos chambres tout inclus côté France, 1 370 à 1 430 CHF par mois charges, fibre et ménage compris. Total : 2 510 à 3 180 CHF de dépenses par mois. Les salaires nets sont ceux de notre [grille des salaires suisses 2026](/blog/salaire-suisse-net-frontalier-2026), pour une personne seule sans enfant (barème A).

| Salaire brut annuel (médiane du métier) | Net mensuel estimé | Logement tout inclus, en part du net | Reste après dépenses courantes |
|---|---|---|---|
| 72 000 CHF (métiers techniques, administratif) | ~4 400 CHF | 31 à 33 % | 1 200 à 1 900 CHF |
| 90 000 CHF (santé non médicale) | ~5 300 CHF | 26 à 27 % | 2 100 à 2 800 CHF |
| 102 000 CHF (ingénierie, IT) | ~5 950 CHF | 23 à 24 % | 2 750 à 3 450 CHF |

Le seuil des 30 % est le repère classique : au-delà, le logement commence à rogner sur l'épargne. Avec une chambre tout inclus, tu passes sous ce seuil à partir de 4 600 à 4 800 CHF net par mois. Le même célibataire logé à Genève, dans un studio à 1 600 à 2 400 CHF hors charges, y consacrerait 30 à 45 % d'un net de 5 300 CHF.

Ce sont des ordres de grandeur : ton net réel dépend de ta caisse de pension et de ta situation, et ta fiche de paie fait foi.

## Le vrai score : combien te revient ta vie ?$r$ IN content_fr) > 0;

UPDATE blog_posts
SET meta_description_en = replace(meta_description_en, $r$Housing ×2 to ×3 in Geneva, staples 30-40% cheaper in France, LAMal or CMU: the 2026 frontalier balance, and the salary that makes it worth it.$r$, $f$Cost of living Switzerland vs France 2026: rent ×2-3, groceries, dining, LAMal vs CMU, transport. The real numbers for a Geneva cross-border worker.$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$Housing ×2 to ×3 in Geneva, staples 30-40% cheaper in France, LAMal or CMU: the 2026 frontalier balance, and the salary that makes it worth it.$r$ IN meta_description_en) > 0
  AND position($f$Cost of living Switzerland vs France 2026: rent ×2-3, groceries, dining, LAMal vs CMU, transport. The real numbers for a Geneva cross-border worker.$f$ IN meta_description_en) = 0;

UPDATE blog_posts
SET meta_description_fr = replace(meta_description_fr, $r$Logement ×2 à ×3 à Genève, courses de base 30 à 40 % moins chères en France, LAMal ou CMU : le bilan 2026 du frontalier, et le salaire qui compense.$r$, $f$Prix de la vie en Suisse vs France en 2026 : loyer ×2-3, courses, restaurants, LAMal vs CMU, transport. Le vrai bilan chiffré d'un frontalier de Genève.$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$Logement ×2 à ×3 à Genève, courses de base 30 à 40 % moins chères en France, LAMal ou CMU : le bilan 2026 du frontalier, et le salaire qui compense.$r$ IN meta_description_fr) > 0
  AND position($f$Prix de la vie en Suisse vs France en 2026 : loyer ×2-3, courses, restaurants, LAMal vs CMU, transport. Le vrai bilan chiffré d'un frontalier de Genève.$f$ IN meta_description_fr) = 0;

UPDATE blog_posts
SET title_en = replace(title_en, $r$Switzerland vs France cost of living 2026: real prices, salary needed$r$, $f$Switzerland vs France cost of living 2026$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$Switzerland vs France cost of living 2026: real prices, salary needed$r$ IN title_en) > 0;

UPDATE blog_posts
SET title_fr = replace(title_fr, $r$Coût de la vie Suisse-France 2026 : prix réels et salaire à viser$r$, $f$Coût de la vie Suisse vs France 2026 : prix réels et vrai bilan$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$Coût de la vie Suisse-France 2026 : prix réels et salaire à viser$r$ IN title_fr) > 0
  AND position($f$Coût de la vie Suisse vs France 2026 : prix réels et vrai bilan$f$ IN title_fr) = 0;

COMMIT;
*/
