-- ════════════════════════════════════════════════════════════════════════
-- RÉVISION ÉDITORIALE — B3 : avenant-fiscal-40-frontalier-geneve
-- Corrections de framing + valeur ajoutée + liens officiels (A1).
-- Faits vérifiés (ge.ch) : 40% appliqué depuis 2023 (accord transitoire), pérennisé 2026 ;
-- avenant signé 27/06/2023, entré en vigueur 24/07/2025, applicable 01/01/2026 ;
-- au-delà de 40% = imposition FR dès le 1er jour (confirmé ge.ch) ; reporting AFC jan-2027.
-- Ajout encart « Genève hors accord 1983 + rétrocession 3,5% (accord 1973) ».
-- Liens 200-vérifiés. Idempotent. Projet Supabase : tefpynkdxxfiefpkgitz
-- ════════════════════════════════════════════════════════════════════════

-- 1) FR — intro : la règle 40% n'est PAS nouvelle (depuis 2023), pérennisée en 2026
UPDATE blog_posts SET content_fr = replace(content_fr,
$o$Depuis le 1er janvier 2026, le télétravail des frontaliers franco-suisses obéit à une règle claire et **permanente** : le seuil des 40 %. Fini les accords temporaires bricolés pendant le Covid — un avenant à la convention fiscale entre la France et la Suisse a tranché. Voici ce qui change concrètement pour votre imposition, expliqué sans jargon.$o$,
$n$La règle des **40 % de télétravail n'est pas nouvelle** : elle s'applique déjà depuis 2023, via un accord transitoire. Ce qui change au **1er janvier 2026**, c'est qu'elle devient **permanente** — un avenant à la convention fiscale franco-suisse remplace les accords temporaires de la période Covid et l'accompagne désormais d'un suivi formalisé. Voici ce qui change concrètement pour votre imposition, expliqué sans jargon.$n$),
updated_at = now() WHERE slug = 'avenant-fiscal-40-frontalier-geneve';

-- 2) FR — dates de l'avenant : remplacer le décret (non confirmé) par l'entrée en vigueur (vérifiée) + lien ge.ch
UPDATE blog_posts SET content_fr = replace(content_fr,
$o$Cet avenant a été **signé le 27 juin 2023**, puis publié en France par le **décret du 21 août 2025**, et il s'applique aux **revenus perçus à partir du 1er janvier 2026**.$o$,
$n$Cet avenant a été **signé le 27 juin 2023**, est **entré en vigueur le 24 juillet 2025**, et s'applique aux **revenus perçus à partir du 1er janvier 2026** ([entrée en vigueur — ge.ch](https://www.ge.ch/actualite/teletravail-personnes-frontalieres-entree-vigueur-avenant-convention-franco-suisse-29-07-2025)).$n$),
updated_at = now() WHERE slug = 'avenant-fiscal-40-frontalier-geneve';

-- 3) FR — seuil 40% : lien règle officielle ge.ch
UPDATE blog_posts SET content_fr = replace(content_fr,
$o$tant que vous télétravaillez **jusqu'à 40 % de votre temps de travail annuel** depuis la France, **l'intégralité de votre salaire reste imposée à la source en Suisse**, exactement comme si vous étiez 100 % sur place.$o$,
$n$tant que vous télétravaillez **jusqu'à 40 % de votre temps de travail annuel** depuis la France, **l'intégralité de votre salaire reste imposée à la source en Suisse** ([règle officielle — ge.ch](https://www.ge.ch/imposition-du-teletravail-personnes-frontalieres/40-activite-teletravail)), exactement comme si vous étiez 100 % sur place.$n$),
updated_at = now() WHERE slug = 'avenant-fiscal-40-frontalier-geneve';

-- 4) FR — au-delà de 40% : sourcer (confirmé ge.ch)
UPDATE blog_posts SET content_fr = replace(content_fr,
$o$Si vous franchissez le seuil, la part de votre salaire correspondant à vos jours de télétravail devient imposable **en France** — et ce **dès le premier jour télétravaillé**, pas seulement pour les jours au-delà de 40 %.$o$,
$n$Si vous franchissez le seuil, la part de votre salaire correspondant à vos jours de télétravail devient imposable **en France** — et ce **dès le premier jour télétravaillé**, pas seulement pour les jours au-delà de 40 % ([détail officiel — ge.ch](https://www.ge.ch/imposition-du-teletravail-personnes-frontalieres/au-dela-40-activite-teletravail)).$n$),
updated_at = now() WHERE slug = 'avenant-fiscal-40-frontalier-geneve';

-- 5) FR — AJOUT encart « Genève, un régime à part » (avant la section « 2 jours… »)
UPDATE blog_posts SET content_fr = replace(content_fr,
$o$## 2 jours de télétravail par semaine, concrètement$o$,
$n$## Genève, un régime à part

Un point clé que beaucoup ignorent : **Genève ne fait pas partie de l'accord frontalier de 1983** (qui couvre 8 cantons : Berne, Soleure, Bâle-Ville, Bâle-Campagne, Vaud, Valais, Neuchâtel et Jura). Pour ces 8 cantons, le frontalier est imposé **en France**. À Genève, c'est l'inverse : vous êtes **imposé à la source à Genève**, puis un **crédit d'impôt** neutralise l'impôt en France (convention de 1966). C'est aussi pour cela que Genève **rétrocède 3,5 % de la masse salariale** de ses frontaliers à l'Ain et à la Haute-Savoie (accord du 29 janvier 1973). C'est la clé de voûte de la fiscalité du frontalier genevois.

## 2 jours de télétravail par semaine, concrètement$n$),
updated_at = now() WHERE slug = 'avenant-fiscal-40-frontalier-geneve';

-- ─────────────── EN ───────────────
-- 6) EN — intro
UPDATE blog_posts SET content_en = replace(content_en,
$o$Since 1 January 2026, telework for Franco-Swiss cross-border workers has followed a clear, **permanent** rule: the 40% threshold. The makeshift temporary agreements of the Covid era are over — an amendment to the France–Switzerland tax treaty settled the matter. Here's what actually changes for your taxation, in plain language.$o$,
$n$The **40% telework rule is not new**: it has applied since 2023 via a transitional agreement. What changes on **1 January 2026** is that it becomes **permanent** — an amendment to the France–Switzerland tax treaty replaces the temporary Covid-era arrangements and now comes with formal monitoring. Here's what actually changes for your taxation, in plain language.$n$),
updated_at = now() WHERE slug = 'avenant-fiscal-40-frontalier-geneve';

-- 7) EN — amendment dates
UPDATE blog_posts SET content_en = replace(content_en,
$o$This amendment was **signed on 27 June 2023**, published in France by the **decree of 21 August 2025**, and it applies to **income earned from 1 January 2026**.$o$,
$n$This amendment was **signed on 27 June 2023**, **entered into force on 24 July 2025**, and applies to **income earned from 1 January 2026** ([entry into force — ge.ch](https://www.ge.ch/actualite/teletravail-personnes-frontalieres-entree-vigueur-avenant-convention-franco-suisse-29-07-2025)).$n$),
updated_at = now() WHERE slug = 'avenant-fiscal-40-frontalier-geneve';

-- 8) EN — 40% threshold link
UPDATE blog_posts SET content_en = replace(content_en,
$o$as long as you telework **up to 40% of your annual working time** from France, **your entire salary remains taxed at source in Switzerland**, exactly as if you were on site 100% of the time.$o$,
$n$as long as you telework **up to 40% of your annual working time** from France, **your entire salary remains taxed at source in Switzerland** ([official rule — ge.ch](https://www.ge.ch/imposition-du-teletravail-personnes-frontalieres/40-activite-teletravail)), exactly as if you were on site 100% of the time.$n$),
updated_at = now() WHERE slug = 'avenant-fiscal-40-frontalier-geneve';

-- 9) EN — above 40% source
UPDATE blog_posts SET content_en = replace(content_en,
$o$If you cross the threshold, the portion of your salary corresponding to your teleworked days becomes taxable **in France** — and from the **very first teleworked day**, not only for the days above 40%.$o$,
$n$If you cross the threshold, the portion of your salary corresponding to your teleworked days becomes taxable **in France** — and from the **very first teleworked day**, not only for the days above 40% ([official detail — ge.ch](https://www.ge.ch/imposition-du-teletravail-personnes-frontalieres/au-dela-40-activite-teletravail)).$n$),
updated_at = now() WHERE slug = 'avenant-fiscal-40-frontalier-geneve';

-- 10) EN — ADD « Geneva, a regime of its own » box
UPDATE blog_posts SET content_en = replace(content_en,
$o$## Two days of telework a week, in practice$o$,
$n$## Geneva, a regime of its own

A key point many miss: **Geneva is not part of the 1983 cross-border agreement** (which covers 8 cantons: Bern, Solothurn, Basel-City, Basel-Country, Vaud, Valais, Neuchâtel and Jura). For those 8 cantons, the cross-border worker is taxed **in France**. Geneva is the opposite: you are **taxed at source in Geneva**, then a **tax credit** offsets the French tax (1966 treaty). It's also why Geneva **rebates 3.5% of its cross-border workers' payroll** to the Ain and Haute-Savoie departments (agreement of 29 January 1973). This is the cornerstone of Geneva cross-border taxation.

## Two days of telework a week, in practice$n$),
updated_at = now() WHERE slug = 'avenant-fiscal-40-frontalier-geneve';

-- ─── Contrôle ───
SELECT
  (position('n''est pas nouvelle' IN content_fr) > 0) AS reframe_fr,
  (position('entré en vigueur le 24 juillet 2025' IN content_fr) > 0) AS date_vigueur_fr,
  (position('Genève, un régime à part' IN content_fr) > 0) AS encart_geneve_fr,
  (position('décret du 21 août 2025' IN content_fr) = 0) AS ancien_decret_absent,
  (position('Geneva, a regime of its own' IN content_en) > 0) AS encart_en
FROM blog_posts WHERE slug = 'avenant-fiscal-40-frontalier-geneve';
