-- ╔══════════════════════════════════════════════════════════════════╗
-- ║  RUN — RÉVISION FISCAL B1-B3 (3e-pilier, déclaration, avenant)     ║
-- ║  Colle TOUT dans Supabase SQL Editor → Run. tefpynkdxxfiefpkgitz.   ║
-- ║  Corrections factuelles vérifiées + liens officiels. Idempotent.   ║
-- ╚══════════════════════════════════════════════════════════════════╝

-- ════════ B1-3e-pilier.sql ════════
-- ════════════════════════════════════════════════════════════════════════
-- RÉVISION ÉDITORIALE — B1 : 3e-pilier-frontalier-geneve
-- Verdict brief : article SOLIDE (aucune erreur). Valeur ajoutée + liens officiels (A1).
-- Faits vérifiés : plafond 3a 2026 = 7 258 CHF (estv.admin.ch/bsv.admin.ch) ;
-- rachat rétroactif dès 2025 (admin.ch). Liens 200-vérifiés. Idempotent.
-- Projet Supabase : tefpynkdxxfiefpkgitz
-- ════════════════════════════════════════════════════════════════════════

-- 1) FR — lien portail officiel 3a (intro)
UPDATE blog_posts SET content_fr = replace(content_fr,
$o$Le 3e pilier (pilier 3a) est l'outil d'épargne retraite préféré des Suisses, surtout pour son avantage fiscal.$o$,
$n$Le 3e pilier ([pilier 3a](https://www.ch.ch/fr/retraite/prevoyance-vieillesse/prevoyance-privee-3e-pilier/)) est l'outil d'épargne retraite préféré des Suisses, surtout pour son avantage fiscal.$n$),
updated_at = now() WHERE slug = '3e-pilier-frontalier-geneve';

-- 2) FR — nommer des prestataires 3a accessibles aux non-résidents (avec réserve, sans reco engageante)
UPDATE blog_posts SET content_fr = replace(content_fr,
$o$La solution passe souvent par des **assureurs ou prestataires spécialisés** en prévoyance frontalière, qui proposent des 3a accessibles depuis la France.$o$,
$n$La solution passe souvent par des **assureurs ou prestataires spécialisés** en prévoyance frontalière, qui proposent des 3a accessibles depuis la France. Parmi les solutions 3a existantes, on cite souvent des acteurs en ligne comme **Finpension, VIAC ou Frankly**, ou des prestataires de prévoyance frontalière — **vérifiez au cas par cas l'éligibilité des non-résidents**, qui varie selon l'acteur et votre situation.$n$),
updated_at = now() WHERE slug = '3e-pilier-frontalier-geneve';

-- 3) FR — lien quasi-résident (AFC-GE)
UPDATE blog_posts SET content_fr = replace(content_fr,
$o$vous devez demander la **taxation ordinaire ultérieure (TOU)** et remplir la condition des **90 %** (au moins 90 % des revenus de votre foyer imposés en Suisse).$o$,
$n$vous devez demander la **taxation ordinaire ultérieure (TOU)** et remplir la condition des **90 %** (au moins 90 % des revenus de votre foyer imposés en Suisse) — c'est le statut de [quasi-résident](https://www.ge.ch/taxation-ordinaire-ulterieure-tou/qu-est-ce-qu-quasi-resident).$n$),
updated_at = now() WHERE slug = '3e-pilier-frontalier-geneve';

-- 4) FR — sourcer le plafond 7 258 CHF
UPDATE blog_posts SET content_fr = replace(content_fr,
$o$Le plafond 2026, pour un salarié affilié à une caisse de pension (LPP), est de **7 258 CHF**.$o$,
$n$Le plafond 2026, pour un salarié affilié à une caisse de pension (LPP), est de **7 258 CHF** ([montant officiel](https://www.estv.admin.ch/fr/taux-interet-deductions-maximales-pilier-3a-impot-federal-direct)).$n$),
updated_at = now() WHERE slug = '3e-pilier-frontalier-geneve';

-- ─────────────── EN ───────────────
-- 5) EN — official 3a portal link (intro)
UPDATE blog_posts SET content_en = replace(content_en,
$o$The third pillar (pillar 3a) is the Swiss favorite for retirement savings, mainly for its tax advantage.$o$,
$n$The third pillar ([pillar 3a](https://www.ch.ch/en/retirement/old-age-provision/private-provision-pillar-3/)) is the Swiss favorite for retirement savings, mainly for its tax advantage.$n$),
updated_at = now() WHERE slug = '3e-pilier-frontalier-geneve';

-- 6) EN — name 3a providers accessible to non-residents (with caveat)
UPDATE blog_posts SET content_en = replace(content_en,
$o$The way around it is usually through **specialized insurers or providers** of cross-border pension solutions, who offer 3a plans accessible from France.$o$,
$n$The way around it is usually through **specialized insurers or providers** of cross-border pension solutions, who offer 3a plans accessible from France. Among the existing 3a solutions, online providers such as **Finpension, VIAC or Frankly**, or cross-border pension specialists, are often mentioned — **check non-resident eligibility case by case**, as it varies by provider and situation.$n$),
updated_at = now() WHERE slug = '3e-pilier-frontalier-geneve';

-- 7) EN — quasi-resident link
UPDATE blog_posts SET content_en = replace(content_en,
$o$you must request **subsequent ordinary taxation (TOU)** and meet the **90% condition** (at least 90% of your household income taxed in Switzerland).$o$,
$n$you must request **subsequent ordinary taxation (TOU)** and meet the **90% condition** (at least 90% of your household income taxed in Switzerland) — this is [quasi-resident](https://www.ge.ch/taxation-ordinaire-ulterieure-tou/qu-est-ce-qu-quasi-resident) status.$n$),
updated_at = now() WHERE slug = '3e-pilier-frontalier-geneve';

-- 8) EN — source the 7,258 CHF cap
UPDATE blog_posts SET content_en = replace(content_en,
$o$The 2026 cap, for an employee affiliated with a pension fund (LPP), is **7,258 CHF**.$o$,
$n$The 2026 cap, for an employee affiliated with a pension fund (LPP), is **7,258 CHF** ([official amount](https://www.estv.admin.ch/fr/taux-interet-deductions-maximales-pilier-3a-impot-federal-direct)).$n$),
updated_at = now() WHERE slug = '3e-pilier-frontalier-geneve';

-- ─── Contrôle ───
SELECT
  (position('Finpension' IN content_fr) > 0) AS prestataires_fr,
  (position('estv.admin.ch' IN content_fr) > 0) AS lien_plafond_fr,
  (position('quasi-resident' IN content_en) > 0) AS lien_qr_en,
  (position('Finpension' IN content_en) > 0) AS prestataires_en
FROM blog_posts WHERE slug = '3e-pilier-frontalier-geneve';

-- ════════ B2-declaration-impots-2026.sql ════════
-- ════════════════════════════════════════════════════════════════════════
-- RÉVISION ÉDITORIALE — B2 : declaration-impots-frontalier-2026
-- Corrections factuelles VÉRIFIÉES (juin 2026) + liens officiels (A1).
-- Faits vérifiés : ouverture 9 avril 2026 (lafinancepourtous/economie.gouv/info.gouv) ;
-- dates limites en ligne 21/28 mai & 4 juin 2026, papier 19 mai (economie.gouv.fr) ;
-- taux moyen 1,07 = tolérance salaires réguliers (impots.gouv.fr) ; art. 25 A (BOFiP).
-- Liens 200-vérifiés. Idempotent : un replace d'une chaîne déjà corrigée ne fait rien.
-- Projet Supabase : tefpynkdxxfiefpkgitz
-- ════════════════════════════════════════════════════════════════════════

-- 1) FR — date d'ouverture (10→9 avril) + dates limites précises par zone/département
UPDATE blog_posts SET content_fr = replace(content_fr,
$o$La déclaration en ligne a ouvert le **10 avril 2026** sur impots.gouv.fr. Les dates limites dépendent de votre département : autour du **22 mai, 29 mai ou 5 juin 2026** selon votre zone. Vérifiez la vôtre — un retard entraîne des pénalités.$o$,
$n$La déclaration en ligne a ouvert le **9 avril 2026** sur [impots.gouv.fr](https://www.impots.gouv.fr/les-modalites-de-la-declaration-de-revenus-en-2026). Les dates limites de la déclaration **en ligne** dépendent de votre département : **21 mai** (zone 1 — départements 01-19, dont l'**Ain (01)**, et non-résidents), **28 mai** (zone 2 — départements 20-54, dont le **Doubs (25)** et le **Jura (39)**) et **4 juin 2026** (zone 3 — départements 55-976, dont la **Haute-Savoie (74)**, le **Haut-Rhin (68)** et le **Territoire de Belfort (90)**). La déclaration **papier** est, elle, à renvoyer pour le **19 mai 2026**. Un retard entraîne des pénalités.$n$),
updated_at = now() WHERE slug = 'declaration-impots-frontalier-2026';

-- 2) FR — résumé (dates)
UPDATE blog_posts SET content_fr = replace(content_fr,
$o$- Dates 2026 : ouverture **10 avril**, limites **22 mai → 5 juin** selon le département.$o$,
$n$- Dates 2026 : ouverture **9 avril**, limites en ligne **21 mai → 4 juin** selon le département (papier : 19 mai).$n$),
updated_at = now() WHERE slug = 'declaration-impots-frontalier-2026';

-- 3) FR — taux de change : nuancer (tolérance salaires réguliers vs revenus exceptionnels) + lien officiel
UPDATE blog_posts SET content_fr = replace(content_fr,
$o$Pour convertir vos revenus 2025 perçus en francs suisses, le taux officiel à appliquer est **1 CHF = 1,07 €**. Utilisez-le sur votre salaire annuel (tel qu'il figure sur votre certificat de salaire suisse) avant de le reporter sur votre déclaration.$o$,
$n$Pour vos **salaires réguliers**, l'administration tolère un **taux moyen annuel** — fixé à **1 CHF = 1,07 €** pour les revenus 2025 — appliqué automatiquement en ligne via le formulaire **2047-SUISSE**. C'est une tolérance : le [taux officiel](https://www.impots.gouv.fr/international-particulier/questions/quel-taux-de-change-dois-je-utiliser-pour-la-declaration) reste en principe le cours du jour de chaque encaissement. **Attention** : ce taux moyen ne vaut **pas** pour les revenus **exceptionnels** (versement de 2e pilier en capital, stock-options…), pour lesquels c'est le cours du jour qui s'applique.$n$),
updated_at = now() WHERE slug = 'declaration-impots-frontalier-2026';

-- 4) FR — résumé (taux)
UPDATE blog_posts SET content_fr = replace(content_fr,
$o$- Taux de change 2025 : **1 CHF = 1,07 €**.$o$,
$n$- Taux de change 2025 : **1 CHF = 1,07 €** (taux moyen toléré pour les salaires réguliers ; cours du jour pour les revenus exceptionnels).$n$),
updated_at = now() WHERE slug = 'declaration-impots-frontalier-2026';

-- 5) FR — article 25 A : lien BOFiP
UPDATE blog_posts SET content_fr = replace(content_fr,
$o$Grâce au mécanisme du **crédit d'impôt** prévu par la convention franco-suisse (article 25A).$o$,
$n$Grâce au mécanisme du **crédit d'impôt** prévu par la convention franco-suisse ([article 25 A](https://bofip.impots.gouv.fr/bofip/3141-PGP.html/identifiant=BOI-INT-CVB-CHE-10-40-20160728)).$n$),
updated_at = now() WHERE slug = 'declaration-impots-frontalier-2026';

-- 6) FR — formulaires : lien 2047 + ajout case 8UU / 3916 (comptes suisses) + lien quasi-résident
UPDATE blog_posts SET content_fr = replace(content_fr,
$o$- **2042** : votre déclaration principale ;
- **2047** : vos revenus de source étrangère (Suisse) ;
- **2042-C** : compléments éventuels ;
- côté quasi-résident : **DRIS/TOU** pour la demande, puis le formulaire de taxation genevois.$o$,
$n$- **2042** : votre déclaration principale ;
- **2047** : vos revenus de source étrangère (Suisse) — voir le [formulaire officiel](https://www.impots.gouv.fr/formulaire/2047/declaration-des-revenus-encaisses-letranger) ;
- **2042-C** : compléments éventuels ;
- **comptes bancaires suisses** : déclarez **chaque compte** (même de simple transit) via la **case 8UU** et un **formulaire 3916** par compte — c'est l'oubli le plus fréquent, et il est sanctionnable ;
- côté quasi-résident : **DRIS/TOU** pour la demande (statut de [quasi-résident](https://www.ge.ch/taxation-ordinaire-ulterieure-tou/qu-est-ce-qu-quasi-resident)), puis le formulaire de taxation genevois.$n$),
updated_at = now() WHERE slug = 'declaration-impots-frontalier-2026';

-- ─────────────── EN ───────────────
-- 7) EN — dates
UPDATE blog_posts SET content_en = replace(content_en,
$o$Online filing opened on **10 April 2026** on impots.gouv.fr. Deadlines depend on your department: around **22 May, 29 May or 5 June 2026** depending on your zone. Check yours — a late filing means penalties.$o$,
$n$Online filing opened on **9 April 2026** on [impots.gouv.fr](https://www.impots.gouv.fr/les-modalites-de-la-declaration-de-revenus-en-2026). Online-filing deadlines depend on your department: **21 May** (zone 1 — depts 01-19, incl. **Ain (01)**, and non-residents), **28 May** (zone 2 — depts 20-54, incl. **Doubs (25)** and **Jura (39)**) and **4 June 2026** (zone 3 — depts 55-976, incl. **Haute-Savoie (74)**, **Haut-Rhin (68)** and **Territoire de Belfort (90)**). The **paper** return is due **19 May 2026**. A late filing means penalties.$n$),
updated_at = now() WHERE slug = 'declaration-impots-frontalier-2026';

-- 8) EN — summary (dates)
UPDATE blog_posts SET content_en = replace(content_en,
$o$- 2026 dates: opens **10 April**, deadlines **22 May → 5 June** by department.$o$,
$n$- 2026 dates: opens **9 April**, online deadlines **21 May → 4 June** by department (paper: 19 May).$n$),
updated_at = now() WHERE slug = 'declaration-impots-frontalier-2026';

-- 9) EN — exchange rate nuance + link
UPDATE blog_posts SET content_en = replace(content_en,
$o$To convert your 2025 income earned in Swiss francs, the official rate to apply is **1 CHF = 1.07 €**. Use it on your annual salary (as shown on your Swiss salary certificate) before reporting it on your return.$o$,
$n$For your **regular salary**, the administration tolerates an **average annual rate** — set at **1 CHF = 1.07 €** for 2025 income — applied automatically online via form **2047-SUISSE**. It is a tolerance: the [official rate](https://www.impots.gouv.fr/international-particulier/questions/quel-taux-de-change-dois-je-utiliser-pour-la-declaration) is in principle the spot rate on each pay date. **Note**: this average rate does **not** apply to **exceptional** income (second-pillar lump-sum, stock options…), for which the spot rate applies.$n$),
updated_at = now() WHERE slug = 'declaration-impots-frontalier-2026';

-- 10) EN — summary (rate)
UPDATE blog_posts SET content_en = replace(content_en,
$o$- 2025 exchange rate: **1 CHF = 1.07 €**.$o$,
$n$- 2025 exchange rate: **1 CHF = 1.07 €** (average rate tolerated for regular salary; spot rate for exceptional income).$n$),
updated_at = now() WHERE slug = 'declaration-impots-frontalier-2026';

-- 11) EN — article 25 A link
UPDATE blog_posts SET content_en = replace(content_en,
$o$Through the **tax-credit** mechanism in the Franco-Swiss treaty (article 25A).$o$,
$n$Through the **tax-credit** mechanism in the Franco-Swiss treaty ([article 25 A](https://bofip.impots.gouv.fr/bofip/3141-PGP.html/identifiant=BOI-INT-CVB-CHE-10-40-20160728)).$n$),
updated_at = now() WHERE slug = 'declaration-impots-frontalier-2026';

-- 12) EN — forms (link 2047 + 8UU/3916 + quasi-resident link)
UPDATE blog_posts SET content_en = replace(content_en,
$o$- **2042**: your main return;
- **2047**: your foreign-source (Swiss) income;
- **2042-C**: any extras;
- quasi-resident side: **DRIS/TOU** for the request, then the Geneva taxation form.$o$,
$n$- **2042**: your main return;
- **2047**: your foreign-source (Swiss) income — see the [official form](https://www.impots.gouv.fr/formulaire/2047/declaration-des-revenus-encaisses-letranger);
- **2042-C**: any extras;
- **Swiss bank accounts**: declare **each account** (even a transit one) via **box 8UU** and one **form 3916** per account — the most common oversight, and a punishable one;
- quasi-resident side: **DRIS/TOU** for the request ([quasi-resident](https://www.ge.ch/taxation-ordinaire-ulterieure-tou/qu-est-ce-qu-quasi-resident) status), then the Geneva taxation form.$n$),
updated_at = now() WHERE slug = 'declaration-impots-frontalier-2026';

-- ─── Contrôle ───
SELECT
  (position('9 avril 2026' IN content_fr) > 0) AS date_corrigee,
  (position('taux moyen annuel' IN content_fr) > 0) AS taux_nuance,
  (position('case **8UU**' IN content_fr) > 0) AS comptes_8uu,
  (position('BOI-INT-CVB-CHE' IN content_fr) > 0) AS lien_bofip,
  (position('10 avril 2026' IN content_fr) = 0) AS ancienne_date_absente
FROM blog_posts WHERE slug = 'declaration-impots-frontalier-2026';

-- ════════ B3-avenant-40.sql ════════
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
