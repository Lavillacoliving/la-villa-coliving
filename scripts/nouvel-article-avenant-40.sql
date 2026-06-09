-- ════════════════════════════════════════════════════════════════════════
-- P3 — NOUVEL ARTICLE : « Avenant fiscal 40 % » (télétravail frontalier 2026)
-- Date : 2026-06-08
-- Slug : avenant-fiscal-40-frontalier-geneve
-- ────────────────────────────────────────────────────────────────────────
-- Angle DISTINCT de l'article télétravail (qui reste le hub « règles »):
--   ici = la réforme légale (avenant), la déclaration 2026, la compensation.
--   Fortement maillé vers télétravail + fiscalité + guide (anti-cannibalisation).
-- Faits vérifiés sur sources officielles (economie.gouv.fr, ge.ch, impots.gouv.fr):
--   avenant signé 27/06/2023, décret 21/08/2025, applicable revenus 2026 ;
--   ≤40% télétravail annuel -> 100% imposé en Suisse (+10 j/an missions inclus) ;
--   >40% -> part télétravail imposable en France DÈS LE 1er JOUR + crédit d'impôt ;
--   social 49,9% (A1) séparé ; compensation CH->FR = 40% de l'impôt télétravail.
--
-- Inséré avec is_published = TRUE (texte validé). Après l'INSERT, lance le
-- pré-rendu/déploiement pour le rendre visible côté SEO (Claude s'en charge).
-- ════════════════════════════════════════════════════════════════════════

INSERT INTO blog_posts (
  slug, title_fr, title_en,
  excerpt_fr, excerpt_en,
  meta_description_fr, meta_description_en,
  content_fr, content_en,
  author, category,
  image_url, read_time_min,
  is_published, published_at, tags
) VALUES (
  'avenant-fiscal-40-frontalier-geneve',
  'Avenant fiscal 40 % frontalier (2026)',
  'The 40% Tax Rule: Cross-Border Work 2026',
  'Avenant franco-suisse : le seuil de 40 % de télétravail est pérenne depuis 2026. Ce qui change pour votre imposition de frontalier, expliqué simplement.',
  'Franco-Swiss amendment: the 40% telework threshold is permanent since 2026. What changes for your cross-border taxation, explained simply.',
  'Avenant fiscal franco-suisse : le télétravail frontalier à 40 % est pérenne depuis 2026. Seuils, déclaration, crédit d''impôt : ce qui change pour votre imposition.',
  'Franco-Swiss tax amendment: 40% cross-border telework is permanent since 2026. Thresholds, tax return, tax credit: what changes for your taxation.',
  $$Depuis le 1er janvier 2026, le télétravail des frontaliers franco-suisses obéit à une règle claire et **permanente** : le seuil des 40 %. Fini les accords temporaires bricolés pendant le Covid — un avenant à la convention fiscale entre la France et la Suisse a tranché. Voici ce qui change concrètement pour votre imposition, expliqué sans jargon.

## L'avenant fiscal franco-suisse, qu'est-ce que c'est ?

C'est une modification de la convention de double imposition qui lie la France et la Suisse depuis 1966. Cet avenant a été **signé le 27 juin 2023**, puis publié en France par le **décret du 21 août 2025**, et il s'applique aux **revenus perçus à partir du 1er janvier 2026**. Son objectif : remplacer les accords amiables temporaires de la période Covid par une règle stable. Résultat, frontaliers comme employeurs savent désormais à quoi s'en tenir.

## Le seuil des 40 %, comment ça marche ?

La règle tient en une phrase : tant que vous télétravaillez **jusqu'à 40 % de votre temps de travail annuel** depuis la France, **l'intégralité de votre salaire reste imposée à la source en Suisse**, exactement comme si vous étiez 100 % sur place. Sur une semaine de 5 jours, cela représente **2 jours de télétravail** par semaine. Bon à savoir : jusqu'à **10 jours par an de missions temporaires** hors de Suisse (en France ou dans un pays tiers) sont comptabilisés dans ces 40 %.

## Que se passe-t-il si je dépasse 40 % ?

Si vous franchissez le seuil, la part de votre salaire correspondant à vos jours de télétravail devient imposable **en France** — et ce **dès le premier jour télétravaillé**, pas seulement pour les jours au-delà de 40 %. Pour éviter que vous payiez deux fois, la convention applique un **crédit d'impôt** (article 25A). En clair : au-delà de 40 %, votre déclaration se complique un peu. Le plus simple reste de rester sous le seuil ; si votre activité l'impose, faites-vous accompagner par un fiduciaire spécialisé en fiscalité transfrontalière.

## Attention à ne pas confondre fiscal et social

Le seuil de 40 % ne concerne **que vos impôts**. Pour votre **sécurité sociale** (AVS, LPP, assurance maladie), c'est un autre seuil qui s'applique : vous pouvez télétravailler jusqu'à **49,9 %** tout en restant affilié au régime suisse, grâce à l'accord-cadre européen — à condition de détenir une **attestation A1** à jour, demandée par votre employeur. Deux seuils, deux logiques : on détaille tout dans notre [guide du télétravail frontalier](/blog/teletravail-frontalier-geneve-regles-2026).

## Qu'est-ce que ça change pour ma déclaration 2026 ?

Côté pratique, deux choses. D'abord, depuis le 1er janvier 2026, votre **employeur suisse doit suivre** vos jours de télétravail et de missions, puis transmettre votre taux annuel à l'administration fiscale suisse (AFC) début 2027. Ensuite, vous, vous continuez de **déclarer vos revenus en France** (formulaire 2047), où le crédit d'impôt neutralise l'impôt déjà prélevé en Suisse. Si vous êtes resté sous 40 %, rien ne change par rapport aux années précédentes. Pour le détail du calcul brut → net, voir notre [guide de la fiscalité frontalière](/blog/fiscalite-frontalier-geneve-impots-2026).

## Et cette histoire de « compensation » entre les deux pays ?

Un point de contexte qui **n'impacte pas votre porte-monnaie** : en échange du droit de continuer à imposer le télétravail, la Suisse verse à la France une compensation égale à **40 % de l'impôt** perçu sur les rémunérations télétravaillées. C'est un arrangement entre États — vous, frontalier, n'avez strictement rien de plus à payer.

## 2 jours de télétravail par semaine, concrètement

La vraie bonne nouvelle de l'avenant, c'est que **2 jours de télétravail hebdomadaires (40 %)** sont désormais pleinement compatibles avec votre statut fiscal **et** social suisse. Encore faut-il un endroit où travailler correctement. En coliving, chaque chambre dispose d'un bureau et d'une fibre dimensionnée pour les visioconférences, et les espaces communs créent une ambiance de coworking informel les jours où plusieurs résidents télétravaillent. De quoi profiter de ces journées côté France sans subir l'isolement d'un studio. Découvrez [nos maisons](/nos-maisons).

## En résumé

- **Fiscal : 40 %** de télétravail annuel → salaire 100 % imposé en Suisse.
- **Social : 49,9 %** (attestation A1) → maintien de la sécurité sociale suisse.
- **2 jours/semaine = 40 %** : compatible avec les deux seuils.
- **Au-delà de 40 %** : imposition en France dès le 1er jour télétravaillé, avec crédit d'impôt.
- Une règle **permanente** depuis le 1er janvier 2026.

Une question sur votre situation de frontalier ? [Écrivez-nous](/candidature) — le sujet, on le connaît bien.

---

*À lire aussi :*
- [Télétravail frontalier Genève : règles et limites 2026](/blog/teletravail-frontalier-geneve-regles-2026)
- [Impôt frontalier Genève 2026 : calcul net](/blog/fiscalite-frontalier-geneve-impots-2026)
- [Frontalier Genève : guide complet 2026](/blog/living-in-france-working-in-geneva)$$,
  $$Since 1 January 2026, telework for Franco-Swiss cross-border workers has followed a clear, **permanent** rule: the 40% threshold. The makeshift temporary agreements of the Covid era are over — an amendment to the France–Switzerland tax treaty settled the matter. Here's what actually changes for your taxation, in plain language.

## What is the Franco-Swiss tax amendment?

It's a change to the double-taxation treaty that has linked France and Switzerland since 1966. This amendment was **signed on 27 June 2023**, published in France by the **decree of 21 August 2025**, and it applies to **income earned from 1 January 2026**. Its goal: replace the temporary Covid-era arrangements with a stable rule. As a result, both cross-border workers and employers finally know where they stand.

## How does the 40% threshold work?

The rule fits in one sentence: as long as you telework **up to 40% of your annual working time** from France, **your entire salary remains taxed at source in Switzerland**, exactly as if you were on site 100% of the time. Over a 5-day week, that's **2 days of telework** per week. Good to know: up to **10 days per year of temporary assignments** outside Switzerland (in France or a third country) count within that 40%.

## What happens if I exceed 40%?

If you cross the threshold, the portion of your salary corresponding to your teleworked days becomes taxable **in France** — and from the **very first teleworked day**, not only for the days above 40%. To prevent you from paying twice, the treaty applies a **tax credit** (article 25A). In short: above 40%, your tax return gets a little more complex. The simplest approach is to stay under the threshold; if your job requires more, get help from a fiduciary specializing in cross-border taxation.

## Don't confuse tax and social security

The 40% threshold concerns **only your taxes**. For your **social security** (AVS, LPP, health insurance), a different threshold applies: you can telework up to **49.9%** while staying in the Swiss system, thanks to the European framework agreement — provided you hold a valid **A1 certificate**, requested by your employer. Two thresholds, two logics: we cover it all in our [cross-border telework guide](/en/blog/teletravail-frontalier-geneve-regles-2026).

## What does it change for my 2026 tax return?

Two practical things. First, since 1 January 2026, your **Swiss employer must track** your telework and assignment days, then report your annual rate to the Swiss tax administration (AFC) in early 2027. Second, you still **declare your income in France** (form 2047), where the tax credit offsets the tax already withheld in Switzerland. If you stayed under 40%, nothing changes versus previous years. For the gross-to-net calculation, see our [cross-border tax guide](/en/blog/fiscalite-frontalier-geneve-impots-2026).

## What about the "compensation" between the two countries?

A bit of context that **doesn't affect your wallet**: in exchange for keeping the right to tax telework, Switzerland pays France a compensation equal to **40% of the tax** collected on teleworked remuneration. It's an arrangement between States — you, the cross-border worker, owe nothing extra.

## Two days of telework a week, in practice

The real good news of the amendment is that **2 weekly telework days (40%)** are now fully compatible with both your Swiss tax **and** social-security status. You still need a proper place to work. In coliving, every room has a desk and fiber sized for video calls, and the common areas create an informal coworking vibe on days when several residents work from home. A great way to enjoy those days on the French side without the isolation of a studio. Discover [our houses](/en/nos-maisons).

## In short

- **Tax: 40%** annual telework → salary 100% taxed in Switzerland.
- **Social: 49.9%** (A1 certificate) → Swiss social security maintained.
- **2 days/week = 40%**: compatible with both thresholds.
- **Above 40%**: taxed in France from the first teleworked day, with a tax credit.
- A **permanent** rule since 1 January 2026.

Questions about your cross-border situation? [Get in touch](/en/candidature) — it's a topic we know well.

---

*Also read:*
- [Remote Work for Cross-Border Workers: Rules & Limits 2026](/en/blog/teletravail-frontalier-geneve-regles-2026)
- [Geneva Cross-Border Tax: net pay 2026](/en/blog/fiscalite-frontalier-geneve-impots-2026)
- [Living in France, Working in Geneva: the complete guide](/en/blog/living-in-france-working-in-geneva)$$,
  'La Villa Team',
  'tips',
  '/images/le loft home_cinema.webp',
  6,
  true,                        -- PUBLIÉ (texte validé par Jérôme, 2026-06-08)
  NOW(),
  ARRAY['avenant fiscal', 'télétravail', 'frontalier', '40%', '2026', 'genève']
);

-- ─── Vérification de l'insertion (brouillon) ───
SELECT slug, title_fr, is_published,
       LENGTH(content_fr) AS len_fr, LENGTH(content_en) AS len_en,
       LENGTH(title_fr) + LENGTH(' | La Villa Coliving') AS title_total_fr
FROM blog_posts WHERE slug = 'avenant-fiscal-40-frontalier-geneve';

-- (Article inséré directement publié. Pour le dépublier si besoin :
--  UPDATE blog_posts SET is_published = false WHERE slug = 'avenant-fiscal-40-frontalier-geneve'; )
