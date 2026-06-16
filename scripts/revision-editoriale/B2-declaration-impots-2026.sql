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
