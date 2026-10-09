-- ============================================================================
-- Lot L1 « Ingénierie des créneaux » (brief v3.1 du 09/10/2026) — sous-lot L1.E : créneaux M1-M4 et pied commun D1 dans les articles en base
-- Généré le 2026-10-09T13:10:11.207Z par scripts/build-slots-sql.mjs depuis scripts/l1-slots.edits.mjs
--   · textes insérés = source unique src/data/answerSlots.ts + entityFacts.ts + stats.ts (ENTITY_FACTS_VERSION 2026-10-09, OU_CHERCHER_VERSION 2026-10-09)
--   · ancres vérifiées sur le contenu vivant de blog_posts (REST anon, lecture seule) le 2026-10-09T13:10:11.201Z : exactement 1 occurrence de chaque ancien texte, nouveau texte absent
-- À appliquer par Jérôme dans le SQL Editor APRÈS déploiement du code L1 (le bloc « Où chercher » rendu par le code remplace les sections retirées ici).
-- Idempotent : chaque UPDATE est gardé par position(ancien) > 0 [AND position(nouveau) = 0 quand le nouveau texte n'est pas un fragment de l'ancien] — relancer le fichier est sans effet.
-- Fichier UTF-8 : il contient des espaces insécables (U+00A0, « 1 370 ») et le signe moins U+2212 (cout-de-la-vie) — ne pas le faire transiter par un éditeur qui normalise les espaces.
-- 148 modifications · 30 articles · état en base à la génération (updated_at · longueur fr / en) :
--   allocations-familiales-frontalier-geneve-2026 · 2026-10-08T14:21:15.770218+00:00 · 11309 / 9689
--   arnaques-logement-frontalier-geneve-eviter · 2026-10-01T11:17:05.015987+00:00 · 11793 / 10631
--   assurance-sante-frontalier-lamal-cmu-budget · 2026-10-08T14:21:15.770218+00:00 · 8998 / 8443
--   avenant-fiscal-40-frontalier-geneve · 2026-10-08T14:21:15.770218+00:00 · 7021 / 6488
--   banque-telephone-internet-frontalier-bons-plans · 2026-09-04T15:38:25.960321+00:00 · 10031 / 9269
--   budget-colocation-geneve-guide-complet · 2026-09-30T07:43:18.866905+00:00 · 17133 / 13108
--   choc-culturel-franco-suisse-expatrie-geneve · 2026-09-04T15:38:25.960321+00:00 · 10614 / 9797
--   coliving-annemasse-geneve-frontaliers-avantages · 2026-09-08T12:10:52.349868+00:00 · 12521 / 11644
--   coliving-transfrontalier-geneve-annemasse-nouvelle-vie · 2026-09-07T12:44:51.197878+00:00 · 3768 / 3643
--   colocation-annemasse-ville-la-grand-ambilly · 2026-10-08T14:21:15.770218+00:00 · 9150 / 8276
--   cout-de-la-vie-suisse-france-frontalier-2026 · 2026-10-08T14:21:15.770218+00:00 · 10996 / 9685
--   declaration-impots-frontalier-2026 · 2026-10-08T14:21:15.770218+00:00 · 5384 / 4900
--   demenager-geneve-frontalier-checklist · 2026-09-04T15:38:25.960321+00:00 · 8698 / 7218
--   dossier-location-frontalier-suisse-france · 2026-09-07T12:44:51.197878+00:00 · 8374 / 7711
--   ecole-internationale-geneve-frontalier-ou-habiter · 2026-10-08T14:21:15.770218+00:00 · 11645 / 9814
--   fiscalite-frontalier-geneve-impots-2026 · 2026-10-08T14:21:15.770218+00:00 · 10493 / 9841
--   grand-geneve-2026-nouveautes-frontaliers · 2026-09-04T15:38:25.960321+00:00 · 8561 / 7376
--   guide-ressources-frontalier-geneve · 2026-10-08T14:21:15.770218+00:00 · 44037 / 40172
--   living-in-france-working-in-geneva · 2026-09-29T11:20:24.853765+00:00 · 14756 / 12890
--   optimiser-espace-coliving-productivite-bien-etre · 2026-09-04T14:50:24.032883+00:00 · 3850 / 3443
--   organisations-internationales-geneve-ou-habiter · 2026-09-30T07:43:18.866905+00:00 · 7935 / 7253
--   ou-habiter-frontalier-suisse-villes-france-pas-cher · 2026-10-08T14:21:15.770218+00:00 · 8122 / 7558
--   permis-g-frontalier-geneve · 2026-10-08T14:21:15.770218+00:00 · 5565 / 5207
--   quartiers-annemasse-ou-vivre-selon-profil · 2026-09-08T13:12:02.072664+00:00 · 9310 / 8006
--   quitter-son-logement-guide-pratique · 2026-09-29T11:20:24.853765+00:00 · 11359 / 10812
--   salaire-suisse-net-frontalier-2026 · 2026-10-08T14:21:15.770218+00:00 · 13332 / 10564
--   se-faire-reseau-geneve-arriver-seul · 2026-09-04T05:53:03.362804+00:00 · 10559 / 9493
--   teletravail-frontalier-geneve-regles-2026 · 2026-10-08T14:21:15.770218+00:00 · 9979 / 9161
--   trouver-colocation-geneve-frontalier · 2026-09-29T11:20:24.853765+00:00 · 5577 / 5160
--   vie-quotidienne-frontalier-courses-sport-sorties · 2026-09-04T14:50:24.032883+00:00 · 9347 / 8576
-- ============================================================================

BEGIN;

-- [1/148] trouver-colocation-geneve-frontalier (fr) · M1 · retrait de la section « Où chercher concrètement ? » (titre + chapô + 4 puces) ; le bloc <OuChercher/> est inséré par le code devant « ## Comment éviter les arnaques ? »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$## Où chercher concrètement ?

Plusieurs pistes, avec leurs avantages et leurs limites :
- les **groupes Facebook frontaliers** (très actifs, mais premier arrivé premier servi) ;
- les sites d'annonces (leboncoin, etc.) — beaucoup d'offres, mais à filtrer ;
- les **agences immobilières** françaises [(sérieuses, mais frais de dossier et dossier lourd)](https://www.anil.org/) ;
- les **opérateurs de coliving**, [qui gèrent tout de A à Z](/blog/coliving-colocation-ou-studio-geneve-comparatif) (chambre meublée, charges, communauté).

## Comment éviter les arnaques ?$f$, $r$## Comment éviter les arnaques ?$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$## Où chercher concrètement ?

Plusieurs pistes, avec leurs avantages et leurs limites :
- les **groupes Facebook frontaliers** (très actifs, mais premier arrivé premier servi) ;
- les sites d'annonces (leboncoin, etc.) — beaucoup d'offres, mais à filtrer ;
- les **agences immobilières** françaises [(sérieuses, mais frais de dossier et dossier lourd)](https://www.anil.org/) ;
- les **opérateurs de coliving**, [qui gèrent tout de A à Z](/blog/coliving-colocation-ou-studio-geneve-comparatif) (chambre meublée, charges, communauté).

## Comment éviter les arnaques ?$f$ IN content_fr) > 0;

-- [2/148] trouver-colocation-geneve-frontalier (en) · M1 · removal of the “Where to actually look?” section (title + lead + 4 bullets); the <OuChercher/> block is inserted by code before “## How to avoid scams?”
UPDATE blog_posts
SET content_en = replace(content_en, $f$## Where to actually look?

Several options, each with pros and cons:
- **cross-border Facebook groups** (very active, but first come first served);
- listings sites (leboncoin, etc.) — many offers, but filter carefully;
- French **real estate agencies** [(serious, but application fees and heavy files)](https://www.anil.org/);
- **coliving operators**, [who handle everything end to end](/en/blog/coliving-colocation-ou-studio-geneve-comparatif) (furnished room, utilities, community).

## How to avoid scams?$f$, $r$## How to avoid scams?$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$## Where to actually look?

Several options, each with pros and cons:
- **cross-border Facebook groups** (very active, but first come first served);
- listings sites (leboncoin, etc.) — many offers, but filter carefully;
- French **real estate agencies** [(serious, but application fees and heavy files)](https://www.anil.org/);
- **coliving operators**, [who handle everything end to end](/en/blog/coliving-colocation-ou-studio-geneve-comparatif) (furnished room, utilities, community).

## How to avoid scams?$f$ IN content_en) > 0;

-- [3/148] trouver-colocation-geneve-frontalier (fr) · M4 · § « Quel dossier… » : la phrase « Bonne nouvelle : en coliving, le dossier est simplifié… » devient la réponse A.6
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Bonne nouvelle : en coliving, le dossier est simplifié — contrat de travail ou promesse d'embauche, garant seulement au cas par cas.$f$, $r$Pas encore de fiche de salaire suisse ? Certains bailleurs côté France évaluent ton contrat plutôt que ton passé : chez La Villa Coliving, le dossier tient en trois pièces (contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges) et un garant n'est demandé qu'au cas par cas, quand le contrat ne couvre pas le loyer — on t'en parle avant de te répondre, jamais après la visite.$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$Bonne nouvelle : en coliving, le dossier est simplifié — contrat de travail ou promesse d'embauche, garant seulement au cas par cas.$f$ IN content_fr) > 0
  AND position($r$Pas encore de fiche de salaire suisse ? Certains bailleurs côté France évaluent ton contrat plutôt que ton passé : chez La Villa Coliving, le dossier tient en trois pièces (contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges) et un garant n'est demandé qu'au cas par cas, quand le contrat ne couvre pas le loyer — on t'en parle avant de te répondre, jamais après la visite.$r$ IN content_fr) = 0;

-- [4/148] trouver-colocation-geneve-frontalier (en) · M4 · § “What application…”: the absolute promise “no French guarantor required” becomes the A.6 answer
UPDATE blog_posts
SET content_en = replace(content_en, $f$Good news: in coliving, the application is simplified — **[no French guarantor required](https://www.service-public.gouv.fr/particuliers/vosdroits/F34661?lang=en)**.$f$, $r$No Swiss payslip yet? Some landlords on the French side assess your contract rather than your history: at La Villa Coliving the file comes down to three items (a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills) and a guarantor is only asked for case by case, when the contract does not cover the rent — we tell you before we reply, never after the visit.$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$Good news: in coliving, the application is simplified — **[no French guarantor required](https://www.service-public.gouv.fr/particuliers/vosdroits/F34661?lang=en)**.$f$ IN content_en) > 0
  AND position($r$No Swiss payslip yet? Some landlords on the French side assess your contract rather than your history: at La Villa Coliving the file comes down to three items (a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills) and a guarantor is only asked for case by case, when the contract does not cover the rent — we tell you before we reply, never after the visit.$r$ IN content_en) = 0;

-- [5/148] trouver-colocation-geneve-frontalier (en) · fix · “In short” bullet: second “no French guarantor” promise reworded (the file is your employment contract)
UPDATE blog_posts
SET content_en = replace(content_en, $f$- In coliving, **no French guarantor** and everything is included.$f$, $r$- In coliving, the file is your employment contract and everything is included.$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$- In coliving, **no French guarantor** and everything is included.$f$ IN content_en) > 0
  AND position($r$- In coliving, the file is your employment contract and everything is included.$r$ IN content_en) = 0;

-- [6/148] trouver-colocation-geneve-frontalier (fr) · M1 · puce « En résumé » : les quatre canaux du bloc « Où chercher », lien vers le comparatif conservé (la section retirée portait le seul lien)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$- Cherche sur les groupes frontaliers, les annonces, les agences ou les opérateurs de coliving.$f$, $r$- Cherche par quatre canaux : [les opérateurs de coliving côté France](/blog/coliving-colocation-ou-studio-geneve-comparatif) comme La Villa Coliving, les plateformes de colocation entre particuliers, les groupes Facebook et la bourse du logement du CAGI.$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$- Cherche sur les groupes frontaliers, les annonces, les agences ou les opérateurs de coliving.$f$ IN content_fr) > 0
  AND position($r$- Cherche par quatre canaux : [les opérateurs de coliving côté France](/blog/coliving-colocation-ou-studio-geneve-comparatif) comme La Villa Coliving, les plateformes de colocation entre particuliers, les groupes Facebook et la bourse du logement du CAGI.$r$ IN content_fr) = 0;

-- [7/148] trouver-colocation-geneve-frontalier (en) · M1 · “In short” bullet: the four channels of the “Where to look” block, link to the comparison article kept
UPDATE blog_posts
SET content_en = replace(content_en, $f$- Look on cross-border groups, listings, agencies or coliving operators.$f$, $r$- Search through four channels: [coliving operators on the French side](/en/blog/coliving-colocation-ou-studio-geneve-comparatif) such as La Villa Coliving, peer-to-peer flatshare platforms, Facebook groups and the CAGI housing exchange.$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$- Look on cross-border groups, listings, agencies or coliving operators.$f$ IN content_en) > 0
  AND position($r$- Search through four channels: [coliving operators on the French side](/en/blog/coliving-colocation-ou-studio-geneve-comparatif) such as La Villa Coliving, peer-to-peer flatshare platforms, Facebook groups and the CAGI housing exchange.$r$ IN content_en) = 0;

-- [8/148] trouver-colocation-geneve-frontalier (fr) · fix · fourchette d'une chambre entre particuliers alignée sur MARKET_ROOM_EUR (« 600 à 900 € » → 700 à 1 000 €)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$de 600 à 900 € en location classique$f$, $r$de 700 à 1 000 € en location classique$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$de 600 à 900 € en location classique$f$ IN content_fr) > 0
  AND position($r$de 700 à 1 000 € en location classique$r$ IN content_fr) = 0;

-- [9/148] trouver-colocation-geneve-frontalier (en) · fix · peer-to-peer room range aligned with MARKET_ROOM_EUR (“€600 to €900” → €700 to €1,000)
UPDATE blog_posts
SET content_en = replace(content_en, $f$from €600 to €900 in a classic rental$f$, $r$from €700 to €1,000 in a classic rental$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$from €600 to €900 in a classic rental$f$ IN content_en) > 0
  AND position($r$from €700 to €1,000 in a classic rental$r$ IN content_en) = 0;

-- [10/148] budget-colocation-geneve-guide-complet (fr) · M3 · tableau du coût réel : ligne « Coliving premium tout inclus | 1 370 CHF » → libellé budgetRowLabel + fourchette priceRangeCell
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$| Coliving premium tout inclus | — | — | 1 370 CHF |$f$, $r$| Chambre en coliving tout inclus côté France — La Villa Coliving | — | — | 1 370 – 1 430 CHF |$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$| Coliving premium tout inclus | — | — | 1 370 CHF |$f$ IN content_fr) > 0
  AND position($r$| Chambre en coliving tout inclus côté France — La Villa Coliving | — | — | 1 370 – 1 430 CHF |$r$ IN content_fr) = 0;

-- [11/148] budget-colocation-geneve-guide-complet (en) · M3 · real-cost table: row “Premium coliving all-inclusive | 1,370 CHF” → budgetRowLabel + priceRangeCell
UPDATE blog_posts
SET content_en = replace(content_en, $f$| Premium coliving all-inclusive | — | — | 1,370 CHF |$f$, $r$| All-inclusive coliving room on the French side — La Villa Coliving | — | — | 1,370 – 1,430 CHF |$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$| Premium coliving all-inclusive | — | — | 1,370 CHF |$f$ IN content_en) > 0
  AND position($r$| All-inclusive coliving room on the French side — La Villa Coliving | — | — | 1,370 – 1,430 CHF |$r$ IN content_en) = 0;

-- [12/148] budget-colocation-geneve-guide-complet (fr) · M3 · fin du § « Le coût réel d'un logement à Genève en 2026 » : ajout du paragraphe A.5 « variante budget »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Et encore, ces chiffres ne prennent pas en compte les charges (80-150 CHF/mois à Genève), le dépôt de garantie (jusqu'à 3 mois en Suisse vs 2 mois hors charges en France), ni les frais d'agence.$f$, $r$Et encore, ces chiffres ne prennent pas en compte les charges (80-150 CHF/mois à Genève), le dépôt de garantie (jusqu'à 3 mois en Suisse vs 2 mois hors charges en France), ni les frais d'agence.

Chambre en coliving côté France : 1 370 à 1 430 CHF tout inclus chez La Villa Coliving (charges, fibre, ménage, piscine, sauna, salle de sport compris, 0 € de frais de dossier).$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$Et encore, ces chiffres ne prennent pas en compte les charges (80-150 CHF/mois à Genève), le dépôt de garantie (jusqu'à 3 mois en Suisse vs 2 mois hors charges en France), ni les frais d'agence.$f$ IN content_fr) > 0
  AND position($r$Et encore, ces chiffres ne prennent pas en compte les charges (80-150 CHF/mois à Genève), le dépôt de garantie (jusqu'à 3 mois en Suisse vs 2 mois hors charges en France), ni les frais d'agence.

Chambre en coliving côté France : 1 370 à 1 430 CHF tout inclus chez La Villa Coliving (charges, fibre, ménage, piscine, sauna, salle de sport compris, 0 € de frais de dossier).$r$ IN content_fr) = 0;

-- [13/148] budget-colocation-geneve-guide-complet (en) · M3 · end of “The Real Cost of Housing in Geneva in 2026”: A.5 “budget variant” paragraph appended
UPDATE blog_posts
SET content_en = replace(content_en, $f$**The gap is brutal.** A studio in central Geneva costs an average of 1,600 CHF/month — utilities extra. The same space on the French side? 800 €, or about 800 CHF. Do the math: **that's nearly 10,000 CHF saved per year**, just on rent.$f$, $r$**The gap is brutal.** A studio in central Geneva costs an average of 1,600 CHF/month — utilities extra. The same space on the French side? 800 €, or about 800 CHF. Do the math: **that's nearly 10,000 CHF saved per year**, just on rent.

Coliving room on the French side: CHF 1,370 to 1,430 all inclusive at La Villa Coliving (bills, fibre, cleaning, pool, sauna and gym included, no application fee).$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$**The gap is brutal.** A studio in central Geneva costs an average of 1,600 CHF/month — utilities extra. The same space on the French side? 800 €, or about 800 CHF. Do the math: **that's nearly 10,000 CHF saved per year**, just on rent.$f$ IN content_en) > 0
  AND position($r$**The gap is brutal.** A studio in central Geneva costs an average of 1,600 CHF/month — utilities extra. The same space on the French side? 800 €, or about 800 CHF. Do the math: **that's nearly 10,000 CHF saved per year**, just on rent.

Coliving room on the French side: CHF 1,370 to 1,430 all inclusive at La Villa Coliving (bills, fibre, cleaning, pool, sauna and gym included, no application fee).$r$ IN content_en) = 0;

-- [14/148] budget-colocation-geneve-guide-complet (fr) · fix · tableau « Prix réels par commune » : colonne Coliving de Ville-la-Grand (La Villa) = fourchette 1 370 – 1 430
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$| **Ville-la-Grand** | 700 – 950 € | 900 – 1 200 € | 500 – 700 € | 1 370 CHF |$f$, $r$| **Ville-la-Grand** | 700 – 950 € | 900 – 1 200 € | 500 – 700 € | 1 370 – 1 430 CHF |$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$| **Ville-la-Grand** | 700 – 950 € | 900 – 1 200 € | 500 – 700 € | 1 370 CHF |$f$ IN content_fr) > 0
  AND position($r$| **Ville-la-Grand** | 700 – 950 € | 900 – 1 200 € | 500 – 700 € | 1 370 – 1 430 CHF |$r$ IN content_fr) = 0;

-- [15/148] budget-colocation-geneve-guide-complet (fr) · fix · tableau « Prix réels par commune » : colonne Coliving d'Ambilly (Le Loft, 100 % privatif) = prix standard
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$| **Ambilly** | 700 – 1 000 € | 900 – 1 250 € | 500 – 750 € | 1 370 CHF |$f$, $r$| **Ambilly** | 700 – 1 000 € | 900 – 1 250 € | 500 – 750 € | 1 430 CHF |$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$| **Ambilly** | 700 – 1 000 € | 900 – 1 250 € | 500 – 750 € | 1 370 CHF |$f$ IN content_fr) > 0
  AND position($r$| **Ambilly** | 700 – 1 000 € | 900 – 1 250 € | 500 – 750 € | 1 430 CHF |$r$ IN content_fr) = 0;

-- [16/148] budget-colocation-geneve-guide-complet (fr) · fix · tableau « Prix réels par commune » : colonne Coliving d'Annemasse gare (Le Lodge, 100 % privatif) = prix standard au lieu de « — » (plan L0 §1.1)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$| **Annemasse gare (Léman Express)** | 850 – 1 150 € | 1 000 – 1 350 € | 600 – 800 € | — |$f$, $r$| **Annemasse gare (Léman Express)** | 850 – 1 150 € | 1 000 – 1 350 € | 600 – 800 € | 1 430 CHF |$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$| **Annemasse gare (Léman Express)** | 850 – 1 150 € | 1 000 – 1 350 € | 600 – 800 € | — |$f$ IN content_fr) > 0
  AND position($r$| **Annemasse gare (Léman Express)** | 850 – 1 150 € | 1 000 – 1 350 € | 600 – 800 € | 1 430 CHF |$r$ IN content_fr) = 0;

-- [17/148] budget-colocation-geneve-guide-complet (en) · fix · “Real Prices by Town” table: Coliving column for Ville-la-Grand (La Villa) = 1,370 – 1,430 range
UPDATE blog_posts
SET content_en = replace(content_en, $f$| **Ville-la-Grand** | 700–950 € | 900–1,200 € | 500–700 € | 1,370 CHF |$f$, $r$| **Ville-la-Grand** | 700–950 € | 900–1,200 € | 500–700 € | 1,370 – 1,430 CHF |$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$| **Ville-la-Grand** | 700–950 € | 900–1,200 € | 500–700 € | 1,370 CHF |$f$ IN content_en) > 0
  AND position($r$| **Ville-la-Grand** | 700–950 € | 900–1,200 € | 500–700 € | 1,370 – 1,430 CHF |$r$ IN content_en) = 0;

-- [18/148] budget-colocation-geneve-guide-complet (en) · fix · “Real Prices by Town” table: Coliving column for Ambilly (Le Loft, all private bathrooms) = standard price
UPDATE blog_posts
SET content_en = replace(content_en, $f$| **Ambilly** | 700–1,000 € | 900–1,250 € | 500–750 € | 1,370 CHF |$f$, $r$| **Ambilly** | 700–1,000 € | 900–1,250 € | 500–750 € | 1,430 CHF |$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$| **Ambilly** | 700–1,000 € | 900–1,250 € | 500–750 € | 1,370 CHF |$f$ IN content_en) > 0
  AND position($r$| **Ambilly** | 700–1,000 € | 900–1,250 € | 500–750 € | 1,430 CHF |$r$ IN content_en) = 0;

-- [19/148] budget-colocation-geneve-guide-complet (en) · fix · “Real Prices by Town” table: Coliving column for Annemasse station (Le Lodge) = standard price instead of “—”
UPDATE blog_posts
SET content_en = replace(content_en, $f$| **Annemasse station (Léman Express)** | 850–1,150 € | 1,000–1,350 € | 600–800 € | — |$f$, $r$| **Annemasse station (Léman Express)** | 850–1,150 € | 1,000–1,350 € | 600–800 € | 1,430 CHF |$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$| **Annemasse station (Léman Express)** | 850–1,150 € | 1,000–1,350 € | 600–800 € | — |$f$ IN content_en) > 0
  AND position($r$| **Annemasse station (Léman Express)** | 850–1,150 € | 1,000–1,350 € | 600–800 € | 1,430 CHF |$r$ IN content_en) = 0;

-- [20/148] budget-colocation-geneve-guide-complet (fr) · M4 · § « Se loger à moins de 1 500 CHF… » : réponse A.6 (question en gras, sans titre) insérée après la liste des 3 options — le point de coupe du bloc entité (dernier titre des 40 % finaux) ne bouge pas
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$

Le bon réflexe n'est pas de comparer les loyers nus$f$, $r$

**Pas encore de fiche de salaire suisse ?** Certains bailleurs côté France évaluent ton contrat plutôt que ton passé : chez La Villa Coliving, le dossier tient en trois pièces (contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges) et un garant n'est demandé qu'au cas par cas, quand le contrat ne couvre pas le loyer — on t'en parle avant de te répondre, jamais après la visite.

Le bon réflexe n'est pas de comparer les loyers nus$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$

Le bon réflexe n'est pas de comparer les loyers nus$f$ IN content_fr) > 0
  AND position($r$

**Pas encore de fiche de salaire suisse ?** Certains bailleurs côté France évaluent ton contrat plutôt que ton passé : chez La Villa Coliving, le dossier tient en trois pièces (contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges) et un garant n'est demandé qu'au cas par cas, quand le contrat ne couvre pas le loyer — on t'en parle avant de te répondre, jamais après la visite.

Le bon réflexe n'est pas de comparer les loyers nus$r$ IN content_fr) = 0;

-- [21/148] budget-colocation-geneve-guide-complet (en) · M4 · “Living under CHF 1,500…”: A.6 answer (bold question, no heading) inserted after the 3-option list
UPDATE blog_posts
SET content_en = replace(content_en, $f$

The right reflex is not to compare bare rents$f$, $r$

**No Swiss payslip yet?** Some landlords on the French side assess your contract rather than your history: at La Villa Coliving the file comes down to three items (a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills) and a guarantor is only asked for case by case, when the contract does not cover the rent — we tell you before we reply, never after the visit.

The right reflex is not to compare bare rents$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$

The right reflex is not to compare bare rents$f$ IN content_en) > 0
  AND position($r$

**No Swiss payslip yet?** Some landlords on the French side assess your contract rather than your history: at La Villa Coliving the file comes down to three items (a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills) and a guarantor is only asked for case by case, when the contract does not cover the rent — we tell you before we reply, never after the visit.

The right reflex is not to compare bare rents$r$ IN content_en) = 0;

-- [22/148] budget-colocation-geneve-guide-complet (fr) · fix · conseil n° 5 : conversion périmée « 1 490 à 1 540 € » → loyers contractuels en euros (fromEur / standardEur), phrase rendue grammaticale
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$un loyer de 1 370 CHF équivaut à de 1 490 à 1 540 € : c'est le loyer contractuel, libellé en euros$f$, $r$un loyer de 1 370 à 1 430 CHF correspond à un loyer contractuel de 1 470 à 1 530 €, libellé en euros$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$un loyer de 1 370 CHF équivaut à de 1 490 à 1 540 € : c'est le loyer contractuel, libellé en euros$f$ IN content_fr) > 0
  AND position($r$un loyer de 1 370 à 1 430 CHF correspond à un loyer contractuel de 1 470 à 1 530 €, libellé en euros$r$ IN content_fr) = 0;

-- [23/148] budget-colocation-geneve-guide-complet (en) · fix · tip 5: outdated conversion “1,480-1,530 € depending on the current rate” → contractual rents in euros (fromEur / standardEur)
UPDATE blog_posts
SET content_en = replace(content_en, $f$a 1,370 CHF rent is worth roughly 1,480-1,530 € depending on the current rate$f$, $r$a CHF 1,370 to 1,430 rent corresponds to a contractual rent of €1,470 to €1,530, set in euros$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$a 1,370 CHF rent is worth roughly 1,480-1,530 € depending on the current rate$f$ IN content_en) > 0
  AND position($r$a CHF 1,370 to 1,430 rent corresponds to a contractual rent of €1,470 to €1,530, set in euros$r$ IN content_en) = 0;

-- [24/148] budget-colocation-geneve-guide-complet (fr) · fix · tutoiement : « Faites le calcul » → « Fais le calcul »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Faites le calcul :$f$, $r$Fais le calcul :$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$Faites le calcul :$f$ IN content_fr) > 0
  AND position($r$Fais le calcul :$r$ IN content_fr) = 0;

-- [25/148] living-in-france-working-in-geneva (fr) · M4 · § « Pas d'administration lourde » : première phrase → réponse A.6 ; « Le coliving sait que les frontaliers bougent… » conservée
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Pas de garantie bancaire farfelue, pas de 10 justificatifs de revenu : un contrat de travail ou une promesse d'embauche suffit, un garant seulement au cas par cas.$f$, $r$Pas encore de fiche de salaire suisse ? Certains bailleurs côté France évaluent ton contrat plutôt que ton passé : chez La Villa Coliving, le dossier tient en trois pièces (contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges) et un garant n'est demandé qu'au cas par cas, quand le contrat ne couvre pas le loyer — on t'en parle avant de te répondre, jamais après la visite.$r$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($f$Pas de garantie bancaire farfelue, pas de 10 justificatifs de revenu : un contrat de travail ou une promesse d'embauche suffit, un garant seulement au cas par cas.$f$ IN content_fr) > 0
  AND position($r$Pas encore de fiche de salaire suisse ? Certains bailleurs côté France évaluent ton contrat plutôt que ton passé : chez La Villa Coliving, le dossier tient en trois pièces (contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges) et un garant n'est demandé qu'au cas par cas, quand le contrat ne couvre pas le loyer — on t'en parle avant de te répondre, jamais après la visite.$r$ IN content_fr) = 0;

-- [26/148] living-in-france-working-in-geneva (en) · M4 · “No heavy administration”: first sentence (“no French guarantor if you're foreign”) → A.6 answer; “Coliving knows cross-border workers move…” kept
UPDATE blog_posts
SET content_en = replace(content_en, $f$No outrageous bank guarantees, no French guarantor if you're foreign, no 10 income proofs.$f$, $r$No Swiss payslip yet? Some landlords on the French side assess your contract rather than your history: at La Villa Coliving the file comes down to three items (a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills) and a guarantor is only asked for case by case, when the contract does not cover the rent — we tell you before we reply, never after the visit.$r$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($f$No outrageous bank guarantees, no French guarantor if you're foreign, no 10 income proofs.$f$ IN content_en) > 0
  AND position($r$No Swiss payslip yet? Some landlords on the French side assess your contract rather than your history: at La Villa Coliving the file comes down to three items (a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills) and a guarantor is only asked for case by case, when the contract does not cover the rent — we tell you before we reply, never after the visit.$r$ IN content_en) = 0;

-- [27/148] living-in-france-working-in-geneva (fr) · fix · exemple de location traditionnelle : « = 1 380 EUR » (ancien prix La Villa) → « ≈ 1 400 EUR »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$= 1 380 EUR.$f$, $r$≈ 1 400 EUR.$r$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($f$= 1 380 EUR.$f$ IN content_fr) > 0
  AND position($r$≈ 1 400 EUR.$r$ IN content_fr) = 0;

-- [28/148] living-in-france-working-in-geneva (en) · fix · traditional rental example: “= €1,380” (old La Villa price) → “≈ €1,400”
UPDATE blog_posts
SET content_en = replace(content_en, $f$= €1,380.$f$, $r$≈ €1,400.$r$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($f$= €1,380.$f$ IN content_en) > 0
  AND position($r$≈ €1,400.$r$ IN content_en) = 0;

-- [29/148] living-in-france-working-in-geneva (fr) · fix · retrait du chiffre « 50+ personnes qui arrivent chaque année » (non sourcé)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Voici ce qu'on recommande aux 50+ personnes qui arrivent chaque année chez nous.$f$, $r$Voici ce qu'on recommande aux nouveaux résidents qui arrivent chaque année chez nous.$r$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($f$Voici ce qu'on recommande aux 50+ personnes qui arrivent chaque année chez nous.$f$ IN content_fr) > 0
  AND position($r$Voici ce qu'on recommande aux nouveaux résidents qui arrivent chaque année chez nous.$r$ IN content_fr) = 0;

-- [30/148] living-in-france-working-in-geneva (en) · fix · removal of the unsourced “50+ people arriving annually” figure
UPDATE blog_posts
SET content_en = replace(content_en, $f$Here's our advice for the 50+ people arriving annually.$f$, $r$Here's our advice for the new residents who arrive every year.$r$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($f$Here's our advice for the 50+ people arriving annually.$f$ IN content_en) > 0
  AND position($r$Here's our advice for the new residents who arrive every year.$r$ IN content_en) = 0;

-- [31/148] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · M2 · fiche Ville-la-Grand : « C'est ici qu'on a installé La Villa Coliving — pour de bonnes raisons. » → phrase de commune (La Villa)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$C'est ici qu'on a installé La Villa Coliving — pour de bonnes raisons.$f$, $r$À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 14 min à pied de la gare d'Annemasse — Genève-Eaux-Vives en 22 min porte-à-porte.$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$C'est ici qu'on a installé La Villa Coliving — pour de bonnes raisons.$f$ IN content_fr) > 0
  AND position($r$À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 14 min à pied de la gare d'Annemasse — Genève-Eaux-Vives en 22 min porte-à-porte.$r$ IN content_fr) = 0;

-- [32/148] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · M2 · Ville-la-Grand card: “This is where we built La Villa Coliving — for good reasons.” → commune sentence (La Villa)
UPDATE blog_posts
SET content_en = replace(content_en, $f$This is where we built La Villa Coliving — for good reasons.$f$, $r$In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 14-minute walk from Annemasse station — Geneva Eaux-Vives in 22 minutes door to door.$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$This is where we built La Villa Coliving — for good reasons.$f$ IN content_en) > 0
  AND position($r$In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 14-minute walk from Annemasse station — Geneva Eaux-Vives in 22 minutes door to door.$r$ IN content_en) = 0;

-- [33/148] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · M2 · fiche Annemasse : phrase de commune (Le Lodge) insérée avant « Pour qui ? »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Le revers : les prix grimpent vite et le centre est bondé aux heures de pointe.$f$, $r$Le revers : les prix grimpent vite et le centre est bondé aux heures de pointe.

À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$Le revers : les prix grimpent vite et le centre est bondé aux heures de pointe.$f$ IN content_fr) > 0
  AND position($r$Le revers : les prix grimpent vite et le centre est bondé aux heures de pointe.

À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$r$ IN content_fr) = 0;

-- [34/148] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · M2 · Annemasse card: commune sentence (Le Lodge) inserted before “For whom?”
UPDATE blog_posts
SET content_en = replace(content_en, $f$Downside: prices climb fast and the center is packed at peak hours.$f$, $r$Downside: prices climb fast and the center is packed at peak hours.

In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$Downside: prices climb fast and the center is packed at peak hours.$f$ IN content_en) > 0
  AND position($r$Downside: prices climb fast and the center is packed at peak hours.

In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$r$ IN content_en) = 0;

-- [35/148] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · M2 · fiche Ambilly : phrase de commune (Le Loft) ajoutée
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Position centrale, juste entre Annemasse et la frontière suisse.$f$, $r$Position centrale, juste entre Annemasse et la frontière suisse.

À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$Position centrale, juste entre Annemasse et la frontière suisse.$f$ IN content_fr) > 0
  AND position($r$Position centrale, juste entre Annemasse et la frontière suisse.

À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.$r$ IN content_fr) = 0;

-- [36/148] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · M2 · Ambilly card: commune sentence (Le Loft) appended
UPDATE blog_posts
SET content_en = replace(content_en, $f$Central location, right between Annemasse and the Swiss border.$f$, $r$Central location, right between Annemasse and the Swiss border.

In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door.$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$Central location, right between Annemasse and the Swiss border.$f$ IN content_en) > 0
  AND position($r$Central location, right between Annemasse and the Swiss border.

In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door.$r$ IN content_en) = 0;

-- [37/148] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · fix · puce « En résumé » : « Sans bail, tout inclus » (faux : bail de 12 mois) → « Tout inclus, sans frais de dossier », les 3 communes
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$- **Sans bail, tout inclus** : coliving à Ville-la-Grand$f$, $r$- **Tout inclus, sans frais de dossier** : le coliving de La Villa Coliving à Ville-la-Grand, Ambilly ou Annemasse$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$- **Sans bail, tout inclus** : coliving à Ville-la-Grand$f$ IN content_fr) > 0
  AND position($r$- **Tout inclus, sans frais de dossier** : le coliving de La Villa Coliving à Ville-la-Grand, Ambilly ou Annemasse$r$ IN content_fr) = 0;

-- [38/148] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · fix · “TL;DR” bullet: “No lease, all-inclusive” (wrong: 12-month lease) → “All inclusive, no application fee”, the 3 towns
UPDATE blog_posts
SET content_en = replace(content_en, $f$- **No lease, all-inclusive**: coliving in Ville-la-Grand$f$, $r$- **All inclusive, no application fee**: coliving with La Villa Coliving in Ville-la-Grand, Ambilly or Annemasse$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$- **No lease, all-inclusive**: coliving in Ville-la-Grand$f$ IN content_en) > 0
  AND position($r$- **All inclusive, no application fee**: coliving with La Villa Coliving in Ville-la-Grand, Ambilly or Annemasse$r$ IN content_en) = 0;

-- [39/148] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · fix · fiche Ville-la-Grand : « à 15 minutes du bureau » (minute non qualifiée, « 15 » n'existe plus) → « près de Genève »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$frontaliers qui veulent du calme à 15 minutes du bureau.$f$, $r$frontaliers qui veulent du calme près de Genève.$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$frontaliers qui veulent du calme à 15 minutes du bureau.$f$ IN content_fr) > 0
  AND position($r$frontaliers qui veulent du calme près de Genève.$r$ IN content_fr) = 0;

-- [40/148] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · fix · Ville-la-Grand card: “15 minutes from the office” (unqualified minute) → “near Geneva”
UPDATE blog_posts
SET content_en = replace(content_en, $f$cross-border workers who want quiet 15 minutes from the office.$f$, $r$cross-border workers who want quiet near Geneva.$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$cross-border workers who want quiet 15 minutes from the office.$f$ IN content_en) > 0
  AND position($r$cross-border workers who want quiet near Geneva.$r$ IN content_en) = 0;

-- [41/148] cout-de-la-vie-suisse-france-frontalier-2026 (fr) · M3 · budget mensuel : ligne « − Logement (T2 ou coliving tout inclus) » → libellé coutDeLaVieRowLabel, borne haute = prix standard (U+2212 conservé)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$| − Logement (T2 ou coliving tout inclus) | −1 100 à −1 400 CHF |$f$, $r$| − Logement (T2, ou chambre en coliving côté France — ex. La Villa Coliving : 1 370 à 1 430 CHF tout inclus, 0 € de frais de dossier, préavis 1 mois) | −1 100 à −1 430 CHF |$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$| − Logement (T2 ou coliving tout inclus) | −1 100 à −1 400 CHF |$f$ IN content_fr) > 0
  AND position($r$| − Logement (T2, ou chambre en coliving côté France — ex. La Villa Coliving : 1 370 à 1 430 CHF tout inclus, 0 € de frais de dossier, préavis 1 mois) | −1 100 à −1 430 CHF |$r$ IN content_fr) = 0;

-- [42/148] cout-de-la-vie-suisse-france-frontalier-2026 (en) · M3 · monthly budget: row “− Housing (2-room or all-inclusive coliving)” → coutDeLaVieRowLabel, upper bound = standard price (U+2212 kept)
UPDATE blog_posts
SET content_en = replace(content_en, $f$| − Housing (2-room or all-inclusive coliving) | −1,100 to −1,400 CHF |$f$, $r$| − Housing (2-room, or a coliving room on the French side — e.g. La Villa Coliving: CHF 1,370 to 1,430 all inclusive, no application fee, one month's notice) | −1,100 to −1,430 CHF |$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$| − Housing (2-room or all-inclusive coliving) | −1,100 to −1,400 CHF |$f$ IN content_en) > 0
  AND position($r$| − Housing (2-room, or a coliving room on the French side — e.g. La Villa Coliving: CHF 1,370 to 1,430 all inclusive, no application fee, one month's notice) | −1,100 to −1,430 CHF |$r$ IN content_en) = 0;

-- [43/148] demenager-geneve-frontalier-checklist (fr) · M4 · Phase 1 « Garant » : « tu auras besoin d'un garant » → « un bailleur te demandera souvent un garant » + réponse A.6 en paragraphe suivant
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$**Garant** : Si tu n'as pas un CDI français connu, tu auras besoin d'un garant (parent, ami, quelqu'un avec un CDI et un appart). Prépare sa documentation aussi : CDI, bulletins, domicile.$f$, $r$**Garant** : Si tu n'as pas un CDI français connu, un bailleur te demandera souvent un garant (parent, ami, quelqu'un avec un CDI et un appart) : prépare sa documentation aussi (CDI, bulletins, domicile).

Pas encore de fiche de salaire suisse ? Certains bailleurs côté France évaluent ton contrat plutôt que ton passé : chez La Villa Coliving, le dossier tient en trois pièces (contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges) et un garant n'est demandé qu'au cas par cas, quand le contrat ne couvre pas le loyer — on t'en parle avant de te répondre, jamais après la visite.$r$),
    updated_at = now()
WHERE slug = 'demenager-geneve-frontalier-checklist'
  AND position($f$**Garant** : Si tu n'as pas un CDI français connu, tu auras besoin d'un garant (parent, ami, quelqu'un avec un CDI et un appart). Prépare sa documentation aussi : CDI, bulletins, domicile.$f$ IN content_fr) > 0
  AND position($r$**Garant** : Si tu n'as pas un CDI français connu, un bailleur te demandera souvent un garant (parent, ami, quelqu'un avec un CDI et un appart) : prépare sa documentation aussi (CDI, bulletins, domicile).

Pas encore de fiche de salaire suisse ? Certains bailleurs côté France évaluent ton contrat plutôt que ton passé : chez La Villa Coliving, le dossier tient en trois pièces (contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges) et un garant n'est demandé qu'au cas par cas, quand le contrat ne couvre pas le loyer — on t'en parle avant de te répondre, jamais après la visite.$r$ IN content_fr) = 0;

-- [44/148] demenager-geneve-frontalier-checklist (en) · M4 · Phase 1 “Guarantor”: “you'll need a guarantor” → “a landlord will often ask for a guarantor” + A.6 answer as the next paragraph
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Guarantor**: If you don't have a known French permanent job, you'll need a guarantor (parent, friend, someone with permanent employment and an apartment). Prepare their documents too.$f$, $r$**Guarantor**: If you don't have a known French permanent job, a landlord will often ask for a guarantor (parent, friend, someone with permanent employment and an apartment): prepare their documents too.

No Swiss payslip yet? Some landlords on the French side assess your contract rather than your history: at La Villa Coliving the file comes down to three items (a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills) and a guarantor is only asked for case by case, when the contract does not cover the rent — we tell you before we reply, never after the visit.$r$),
    updated_at = now()
WHERE slug = 'demenager-geneve-frontalier-checklist'
  AND position($f$**Guarantor**: If you don't have a known French permanent job, you'll need a guarantor (parent, friend, someone with permanent employment and an apartment). Prepare their documents too.$f$ IN content_en) > 0
  AND position($r$**Guarantor**: If you don't have a known French permanent job, a landlord will often ask for a guarantor (parent, friend, someone with permanent employment and an apartment): prepare their documents too.

No Swiss payslip yet? Some landlords on the French side assess your contract rather than your history: at La Villa Coliving the file comes down to three items (a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills) and a guarantor is only asked for case by case, when the contract does not cover the rent — we tell you before we reply, never after the visit.$r$ IN content_en) = 0;

-- [45/148] demenager-geneve-frontalier-checklist (fr) · fix · puce « Adresse du garant + ses documents » → « …, si on t'en demande un »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$- Adresse du garant + ses documents$f$, $r$- Adresse du garant + ses documents, si on t'en demande un$r$),
    updated_at = now()
WHERE slug = 'demenager-geneve-frontalier-checklist'
  AND position($f$- Adresse du garant + ses documents$f$ IN content_fr) > 0
  AND position($r$- Adresse du garant + ses documents, si on t'en demande un$r$ IN content_fr) = 0;

-- [46/148] demenager-geneve-frontalier-checklist (en) · fix · bullet “Guarantor address + documents” → “…, if one is asked of you”
UPDATE blog_posts
SET content_en = replace(content_en, $f$- Guarantor address + documents$f$, $r$- Guarantor address + documents, if one is asked of you$r$),
    updated_at = now()
WHERE slug = 'demenager-geneve-frontalier-checklist'
  AND position($f$- Guarantor address + documents$f$ IN content_en) > 0
  AND position($r$- Guarantor address + documents, if one is asked of you$r$ IN content_en) = 0;

-- [47/148] quartiers-annemasse-ou-vivre-selon-profil (fr) · M2 · Profil 1 : « en moins de 10 minutes » → « en une dizaine de minutes » ; « C'est précisément là qu'est posé notre [Lodge…](/lelodge). » → phrase de commune (Le Lodge, lien conservé)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Tu marches à la gare en moins de 10 minutes, tu oublies la voiture et les bouchons de la douane. C'est précisément là qu'est posé notre [Lodge, à Romagny — à 9 minutes à pied de la gare](/lelodge).$f$, $r$Tu marches à la gare en une dizaine de minutes, tu oublies la voiture et les bouchons de la douane. À Annemasse même, [Le Lodge](/lelodge) de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$Tu marches à la gare en moins de 10 minutes, tu oublies la voiture et les bouchons de la douane. C'est précisément là qu'est posé notre [Lodge, à Romagny — à 9 minutes à pied de la gare](/lelodge).$f$ IN content_fr) > 0
  AND position($r$Tu marches à la gare en une dizaine de minutes, tu oublies la voiture et les bouchons de la douane. À Annemasse même, [Le Lodge](/lelodge) de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$r$ IN content_fr) = 0;

-- [48/148] quartiers-annemasse-ou-vivre-selon-profil (en) · M2 · Profile 1: “in under 10 minutes” → “in about ten minutes”; “That's exactly where our [Lodge…](/en/lelodge), sits.” → commune sentence (Le Lodge, link kept)
UPDATE blog_posts
SET content_en = replace(content_en, $f$You walk to the station in under 10 minutes, forget the car and the customs jams. That's exactly where our [Lodge, in Romagny — 9 minutes' walk from the station](/en/lelodge), sits.$f$, $r$You walk to the station in about ten minutes, forget the car and the customs jams. In Annemasse itself, [Le Lodge](/en/lelodge) by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$You walk to the station in under 10 minutes, forget the car and the customs jams. That's exactly where our [Lodge, in Romagny — 9 minutes' walk from the station](/en/lelodge), sits.$f$ IN content_en) > 0
  AND position($r$You walk to the station in about ten minutes, forget the car and the customs jams. In Annemasse itself, [Le Lodge](/en/lelodge) by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$r$ IN content_en) = 0;

-- [49/148] quartiers-annemasse-ou-vivre-selon-profil (fr) · M2 · FAQ « Quel quartier d'Annemasse est le plus proche de la gare ? » : « en moins de 10 minutes » → « en une dizaine de minutes » + phrase de commune (Le Lodge) en fin de réponse
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$on rejoint la gare du Léman Express à pied en moins de 10 minutes. Idéal pour un frontalier qui veut vivre sans voiture.$f$, $r$on rejoint la gare du Léman Express à pied en une dizaine de minutes. Idéal pour un frontalier qui veut vivre sans voiture. À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$on rejoint la gare du Léman Express à pied en moins de 10 minutes. Idéal pour un frontalier qui veut vivre sans voiture.$f$ IN content_fr) > 0
  AND position($r$on rejoint la gare du Léman Express à pied en une dizaine de minutes. Idéal pour un frontalier qui veut vivre sans voiture. À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$r$ IN content_fr) = 0;

-- [50/148] quartiers-annemasse-ou-vivre-selon-profil (en) · M2 · FAQ “Which Annemasse area is closest to the station?”: “under 10 minutes' walk” → “about ten minutes' walk” + commune sentence (Le Lodge) at the end of the answer
UPDATE blog_posts
SET content_en = replace(content_en, $f$the Léman Express station is under 10 minutes' walk. Ideal for a car-free commuter.$f$, $r$the Léman Express station is about ten minutes' walk. Ideal for a car-free commuter. In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$the Léman Express station is under 10 minutes' walk. Ideal for a car-free commuter.$f$ IN content_en) > 0
  AND position($r$the Léman Express station is about ten minutes' walk. Ideal for a car-free commuter. In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$r$ IN content_en) = 0;

-- [51/148] colocation-annemasse-ville-la-grand-ambilly (fr) · M1 · retrait du H2 « Où chercher : les bons sites » et de ses 4 paragraphes ; le bloc <OuChercher/> est inséré par le code devant « ## Les bonnes zones »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$## Où chercher : les bons sites

**Leboncoin** : C'est le classique français. Beaucoup d'annonces, mais aussi beaucoup de pollution (arnaqueurs, arnaques). Filtre par localisation (Annemasse, Ville-la-Grand), par prix (900-1300 CHF), par "meublé". Vérifie toujours le numéro de téléphone : si c'est un numéro fictif ou bizarre, c'est une arnaque.

**Airbnb (long-term)** : Oui, sérieusement. Les propriétaires sur Airbnb sont généralement moins arnaqueurs (système d'avis). Les prix sont un peu plus hauts (10-15%), mais c'est plus sûr pour le premier mois. Cherche "monthly stays" à moins de 1300 EUR.

**Anibis** : Suisse/France frontière. Moins connu mais sérieux. Annonces souvent de quality supérieure.

**Facebook groupes** : Il y a environ 15-20 groupes "Cherche colocataire Genève/Annemasse/Ville-la-Grand". Demande adhésion, puis poste "Je cherche chambre...". Réponses en 24-48h souvent. C'est très local, très actif, pas mal honnête.

## Les bonnes zones$f$, $r$## Les bonnes zones$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$## Où chercher : les bons sites

**Leboncoin** : C'est le classique français. Beaucoup d'annonces, mais aussi beaucoup de pollution (arnaqueurs, arnaques). Filtre par localisation (Annemasse, Ville-la-Grand), par prix (900-1300 CHF), par "meublé". Vérifie toujours le numéro de téléphone : si c'est un numéro fictif ou bizarre, c'est une arnaque.

**Airbnb (long-term)** : Oui, sérieusement. Les propriétaires sur Airbnb sont généralement moins arnaqueurs (système d'avis). Les prix sont un peu plus hauts (10-15%), mais c'est plus sûr pour le premier mois. Cherche "monthly stays" à moins de 1300 EUR.

**Anibis** : Suisse/France frontière. Moins connu mais sérieux. Annonces souvent de quality supérieure.

**Facebook groupes** : Il y a environ 15-20 groupes "Cherche colocataire Genève/Annemasse/Ville-la-Grand". Demande adhésion, puis poste "Je cherche chambre...". Réponses en 24-48h souvent. C'est très local, très actif, pas mal honnête.

## Les bonnes zones$f$ IN content_fr) > 0;

-- [52/148] colocation-annemasse-ville-la-grand-ambilly (en) · M1 · removal of the H2 “Where to Search: Best Sites” and its 5 paragraphs; the <OuChercher/> block is inserted by code before “## Best Zones”
UPDATE blog_posts
SET content_en = replace(content_en, $f$## Where to Search: Best Sites

**Leboncoin**: France's largest classified-ads website, where locals sell everything from sofas to cars and where most private landlords advertise their rooms. You'll find the most listings there, but also the most scams. Search by town (Annemasse, Ville-la-Grand), set your budget and tick "meublé" (furnished). Always check the phone number: if it looks fake or odd, walk away.

**Airbnb (long-term)**: Seriously. Airbnb landlords are usually less crooked (review system). Prices ~10-15% higher, but safer first month. Search "monthly stays" under 1300 EUR.

**Flatshare platforms**: specialised in shared housing. Less noise than Leboncoin. Bonus: landlord and roommate ratings.

**Anibis**: Swiss/French border. Less known but serious. Often higher quality listings.

**Facebook groups**: ~15-20 groups "Looking for roommate Geneva/Annemasse/Ville-la-Grand." Request membership, post "Looking for room..." Responses in 24-48h often. Very local, active, fairly honest.

## Best Zones$f$, $r$## Best Zones$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$## Where to Search: Best Sites

**Leboncoin**: France's largest classified-ads website, where locals sell everything from sofas to cars and where most private landlords advertise their rooms. You'll find the most listings there, but also the most scams. Search by town (Annemasse, Ville-la-Grand), set your budget and tick "meublé" (furnished). Always check the phone number: if it looks fake or odd, walk away.

**Airbnb (long-term)**: Seriously. Airbnb landlords are usually less crooked (review system). Prices ~10-15% higher, but safer first month. Search "monthly stays" under 1300 EUR.

**Flatshare platforms**: specialised in shared housing. Less noise than Leboncoin. Bonus: landlord and roommate ratings.

**Anibis**: Swiss/French border. Less known but serious. Often higher quality listings.

**Facebook groups**: ~15-20 groups "Looking for roommate Geneva/Annemasse/Ville-la-Grand." Request membership, post "Looking for room..." Responses in 24-48h often. Very local, active, fairly honest.

## Best Zones$f$ IN content_en) > 0;

-- [53/148] colocation-annemasse-ville-la-grand-ambilly (fr) · M2 · « Les bonnes zones » / Annemasse centre (près de la gare) : phrase de commune (Le Lodge, Romagny est au sud-est de la gare) ajoutée
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$**Annemasse centre (près de la gare)** : Prix : 1000-1400 CHF. Vibrant, commerces, bars. Transports au top. Malus : plus cher, plus bruyant.$f$, $r$**Annemasse centre (près de la gare)** : Prix : 1000-1400 CHF. Vibrant, commerces, bars. Transports au top. Malus : plus cher, plus bruyant. À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$**Annemasse centre (près de la gare)** : Prix : 1000-1400 CHF. Vibrant, commerces, bars. Transports au top. Malus : plus cher, plus bruyant.$f$ IN content_fr) > 0
  AND position($r$**Annemasse centre (près de la gare)** : Prix : 1000-1400 CHF. Vibrant, commerces, bars. Transports au top. Malus : plus cher, plus bruyant. À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$r$ IN content_fr) = 0;

-- [54/148] colocation-annemasse-ville-la-grand-ambilly (en) · M2 · “Best Zones” / Annemasse center (near station): commune sentence (Le Lodge) appended
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Annemasse center (near station)**: Price: 1000-1400 CHF. Vibrant, shops, bars. Transport top-notch. Downside: pricier, louder.$f$, $r$**Annemasse center (near station)**: Price: 1000-1400 CHF. Vibrant, shops, bars. Transport top-notch. Downside: pricier, louder. In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$**Annemasse center (near station)**: Price: 1000-1400 CHF. Vibrant, shops, bars. Transport top-notch. Downside: pricier, louder.$f$ IN content_en) > 0
  AND position($r$**Annemasse center (near station)**: Price: 1000-1400 CHF. Vibrant, shops, bars. Transport top-notch. Downside: pricier, louder. In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$r$ IN content_en) = 0;

-- [55/148] colocation-annemasse-ville-la-grand-ambilly (fr) · M2 · « Les bonnes zones » / Ville-la-Grand : « Toujours 10 min à pied de la gare » (faux : 14 min) → phrase de commune (La Villa)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Toujours 10 min à pied de la gare, plus d'espaces verts et plus familial.$f$, $r$Plus d'espaces verts et plus familial. À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 14 min à pied de la gare d'Annemasse — Genève-Eaux-Vives en 22 min porte-à-porte.$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$Toujours 10 min à pied de la gare, plus d'espaces verts et plus familial.$f$ IN content_fr) > 0
  AND position($r$Plus d'espaces verts et plus familial. À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 14 min à pied de la gare d'Annemasse — Genève-Eaux-Vives en 22 min porte-à-porte.$r$ IN content_fr) = 0;

-- [56/148] colocation-annemasse-ville-la-grand-ambilly (en) · M2 · “Best Zones” / Ville-la-Grand: “Also 10 min on foot from the station” (wrong: 14 min) → commune sentence (La Villa)
UPDATE blog_posts
SET content_en = replace(content_en, $f$Also 10 min on foot from the station, more green space and more family-friendly.$f$, $r$More green space and more family-friendly. In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 14-minute walk from Annemasse station — Geneva Eaux-Vives in 22 minutes door to door.$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$Also 10 min on foot from the station, more green space and more family-friendly.$f$ IN content_en) > 0
  AND position($r$More green space and more family-friendly. In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 14-minute walk from Annemasse station — Geneva Eaux-Vives in 22 minutes door to door.$r$ IN content_en) = 0;

-- [57/148] colocation-annemasse-ville-la-grand-ambilly (fr) · M2 · « Les bonnes zones » / Ambilly : phrase de commune (Le Loft) ajoutée
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$**Ambilly** : Prix : 850-1150 CHF. Très résidentiel et assez haut de gamme en fonction des quartiers.$f$, $r$**Ambilly** : Prix : 850-1150 CHF. Très résidentiel et assez haut de gamme en fonction des quartiers. À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$**Ambilly** : Prix : 850-1150 CHF. Très résidentiel et assez haut de gamme en fonction des quartiers.$f$ IN content_fr) > 0
  AND position($r$**Ambilly** : Prix : 850-1150 CHF. Très résidentiel et assez haut de gamme en fonction des quartiers. À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.$r$ IN content_fr) = 0;

-- [58/148] colocation-annemasse-ville-la-grand-ambilly (en) · M2 · “Best Zones” / Ambilly: commune sentence (Le Loft) appended
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Ambilly**: Price: 850-1150 CHF. Very residential and fairly upscale depending on the neighbourhood.$f$, $r$**Ambilly**: Price: 850-1150 CHF. Very residential and fairly upscale depending on the neighbourhood. In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door.$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$**Ambilly**: Price: 850-1150 CHF. Very residential and fairly upscale depending on the neighbourhood.$f$ IN content_en) > 0
  AND position($r$**Ambilly**: Price: 850-1150 CHF. Very residential and fairly upscale depending on the neighbourhood. In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door.$r$ IN content_en) = 0;

-- [59/148] colocation-annemasse-ville-la-grand-ambilly (fr) · M3 · tableau « Le vrai prix d'une chambre meublée » : « 1 370 CHF/mois » → fourchette priceRangeCell + « /mois »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$| Coliving premium tout compris | 1 370 CHF/mois |$f$, $r$| Coliving premium tout compris | 1 370 – 1 430 CHF/mois |$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$| Coliving premium tout compris | 1 370 CHF/mois |$f$ IN content_fr) > 0
  AND position($r$| Coliving premium tout compris | 1 370 – 1 430 CHF/mois |$r$ IN content_fr) = 0;

-- [60/148] colocation-annemasse-ville-la-grand-ambilly (en) · M3 · “Real Prices for a Furnished Room” table: “1,370 CHF/month” → priceRangeCell + “/month”
UPDATE blog_posts
SET content_en = replace(content_en, $f$| All-inclusive premium coliving | 1,370 CHF/month |$f$, $r$| All-inclusive premium coliving | 1,370 – 1,430 CHF/month |$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$| All-inclusive premium coliving | 1,370 CHF/month |$f$ IN content_en) > 0
  AND position($r$| All-inclusive premium coliving | 1,370 – 1,430 CHF/month |$r$ IN content_en) = 0;

-- [61/148] dossier-location-frontalier-suisse-france (fr) · M4 · § 7 Garant : « tu auras besoin d'un garant » → « la plupart des bailleurs te demanderont un garant » (lien ANIL conservé), « Deux options » → « Les options »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$[tu auras besoin d'un garant](https://www.anil.org/parole-expert-logement-location-pas-garant/). Deux options :$f$, $r$[la plupart des bailleurs te demanderont un garant](https://www.anil.org/parole-expert-logement-location-pas-garant/). Les options :$r$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($f$[tu auras besoin d'un garant](https://www.anil.org/parole-expert-logement-location-pas-garant/). Deux options :$f$ IN content_fr) > 0
  AND position($r$[la plupart des bailleurs te demanderont un garant](https://www.anil.org/parole-expert-logement-location-pas-garant/). Les options :$r$ IN content_fr) = 0;

-- [62/148] dossier-location-frontalier-suisse-france (en) · M4 · § 7 Guarantor: “you'll need a guarantor” → “most landlords will ask for a guarantor” (ANIL link kept), “Two options” → “The options”
UPDATE blog_posts
SET content_en = replace(content_en, $f$[you'll need a guarantor](https://www.anil.org/parole-expert-logement-location-pas-garant/). Two options:$f$, $r$[most landlords will ask for a guarantor](https://www.anil.org/parole-expert-logement-location-pas-garant/). The options:$r$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($f$[you'll need a guarantor](https://www.anil.org/parole-expert-logement-location-pas-garant/). Two options:$f$ IN content_en) > 0
  AND position($r$[most landlords will ask for a guarantor](https://www.anil.org/parole-expert-logement-location-pas-garant/). The options:$r$ IN content_en) = 0;

-- [63/148] dossier-location-frontalier-suisse-france (fr) · M4 · § 7 Garant : 4e option « **Le coliving** : » + réponse A.6, après Garantme / Cautioneo
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$**Garantme ou Cautioneo** : des services payants (3-4 % du loyer annuel) qui se portent garants pour toi. Particulièrement utile si tu n'as pas de garant en France.$f$, $r$**Garantme ou Cautioneo** : des services payants (3-4 % du loyer annuel) qui se portent garants pour toi. Particulièrement utile si tu n'as pas de garant en France.

**Le coliving** : Pas encore de fiche de salaire suisse ? Certains bailleurs côté France évaluent ton contrat plutôt que ton passé : chez La Villa Coliving, le dossier tient en trois pièces (contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges) et un garant n'est demandé qu'au cas par cas, quand le contrat ne couvre pas le loyer — on t'en parle avant de te répondre, jamais après la visite.$r$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($f$**Garantme ou Cautioneo** : des services payants (3-4 % du loyer annuel) qui se portent garants pour toi. Particulièrement utile si tu n'as pas de garant en France.$f$ IN content_fr) > 0
  AND position($r$**Garantme ou Cautioneo** : des services payants (3-4 % du loyer annuel) qui se portent garants pour toi. Particulièrement utile si tu n'as pas de garant en France.

**Le coliving** : Pas encore de fiche de salaire suisse ? Certains bailleurs côté France évaluent ton contrat plutôt que ton passé : chez La Villa Coliving, le dossier tient en trois pièces (contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges) et un garant n'est demandé qu'au cas par cas, quand le contrat ne couvre pas le loyer — on t'en parle avant de te répondre, jamais après la visite.$r$ IN content_fr) = 0;

-- [64/148] dossier-location-frontalier-suisse-france (en) · M4 · § 7 Guarantor: 4th option “**Coliving**: ” + A.6 answer, after Garantme / Cautioneo
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Garantme or Cautioneo**: paid services (3-4% of annual rent) that act as guarantors for you. Particularly useful if you don't have a guarantor in France.$f$, $r$**Garantme or Cautioneo**: paid services (3-4% of annual rent) that act as guarantors for you. Particularly useful if you don't have a guarantor in France.

**Coliving**: No Swiss payslip yet? Some landlords on the French side assess your contract rather than your history: at La Villa Coliving the file comes down to three items (a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills) and a guarantor is only asked for case by case, when the contract does not cover the rent — we tell you before we reply, never after the visit.$r$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($f$**Garantme or Cautioneo**: paid services (3-4% of annual rent) that act as guarantors for you. Particularly useful if you don't have a guarantor in France.$f$ IN content_en) > 0
  AND position($r$**Garantme or Cautioneo**: paid services (3-4% of annual rent) that act as guarantors for you. Particularly useful if you don't have a guarantor in France.

**Coliving**: No Swiss payslip yet? Some landlords on the French side assess your contract rather than your history: at La Villa Coliving the file comes down to three items (a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills) and a guarantor is only asked for case by case, when the contract does not cover the rent — we tell you before we reply, never after the visit.$r$ IN content_en) = 0;

-- [65/148] dossier-location-frontalier-suisse-france (en) · fix · footer 👉: “accepts cross-border workers with no French guarantor” → “on the basis of their employment contract” (FR parity)
UPDATE blog_posts
SET content_en = replace(content_en, $f$accepts cross-border workers with no French guarantor — furnished all-inclusive rooms$f$, $r$accepts cross-border workers on the basis of their employment contract — furnished all-inclusive rooms$r$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($f$accepts cross-border workers with no French guarantor — furnished all-inclusive rooms$f$ IN content_en) > 0
  AND position($r$accepts cross-border workers on the basis of their employment contract — furnished all-inclusive rooms$r$ IN content_en) = 0;

-- [66/148] dossier-location-frontalier-suisse-france (fr) · fix · H2 « L'alternative coliving : zéro dossier, zéro galère » (faux : il y a un dossier) → « un dossier en trois pièces »
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$## L'alternative coliving : zéro dossier, zéro galère$f$, $r$## L'alternative coliving : un dossier en trois pièces$r$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($f$## L'alternative coliving : zéro dossier, zéro galère$f$ IN content_fr) > 0
  AND position($r$## L'alternative coliving : un dossier en trois pièces$r$ IN content_fr) = 0;

-- [67/148] dossier-location-frontalier-suisse-france (en) · fix · H2 “The Coliving Alternative: Zero Hassle” → “A Three-Document File” (FR parity)
UPDATE blog_posts
SET content_en = replace(content_en, $f$## The Coliving Alternative: Zero Hassle$f$, $r$## The Coliving Alternative: A Three-Document File$r$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($f$## The Coliving Alternative: Zero Hassle$f$ IN content_en) > 0
  AND position($r$## The Coliving Alternative: A Three-Document File$r$ IN content_en) = 0;

-- [68/148] coliving-transfrontalier-geneve-annemasse-nouvelle-vie (en) · M4 · “Paperwork”: “No French guarantor to find, …” → clause removed, sentence aligned with the FR (which has no guarantor clause)
UPDATE blog_posts
SET content_en = replace(content_en, $f$No French guarantor to find, no electricity and internet contracts to open, no furniture to buy then resell when you leave.$f$, $r$No electricity and internet contracts to open, no furniture to buy then resell when you leave.$r$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($f$No French guarantor to find, no electricity and internet contracts to open, no furniture to buy then resell when you leave.$f$ IN content_en) > 0
  AND position($r$No electricity and internet contracts to open, no furniture to buy then resell when you leave.$r$ IN content_en) = 0;

-- [69/148] guide-ressources-frontalier-geneve (en) · M4 · “Housing” / Visale paragraph: “No French guarantor? The Visale guarantee…” → “No guarantor in France? …” (same meaning, forbidden pattern removed; FR unchanged)
UPDATE blog_posts
SET content_en = replace(content_en, $f$No French guarantor? The **[Visale](https://www.visale.fr)** guarantee$f$, $r$No guarantor in France? The **[Visale](https://www.visale.fr)** guarantee$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$No French guarantor? The **[Visale](https://www.visale.fr)** guarantee$f$ IN content_en) > 0
  AND position($r$No guarantor in France? The **[Visale](https://www.visale.fr)** guarantee$r$ IN content_en) = 0;

-- [70/148] coliving-annemasse-geneve-frontaliers-avantages (en) · fix · EN footer 👉: links to the FR URLs /colocation-geneve and /annemasse-colocation → /en/…
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Looking for [La Villa Coliving, French side](/colocation-geneve) or [in Annemasse](/annemasse-colocation)?**$f$, $r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve) or [in Annemasse](/en/annemasse-colocation)?**$r$),
    updated_at = now()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages'
  AND position($f$**Looking for [La Villa Coliving, French side](/colocation-geneve) or [in Annemasse](/annemasse-colocation)?**$f$ IN content_en) > 0
  AND position($r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve) or [in Annemasse](/en/annemasse-colocation)?**$r$ IN content_en) = 0;

-- [71/148] coliving-annemasse-geneve-frontaliers-avantages (en) · fix · EN footer 👉: third link of the same sentence, FR URL /chambre-a-louer-annemasse → /en/…
UPDATE blog_posts
SET content_en = replace(content_en, $f$see also our [rooms for rent in Annemasse](/chambre-a-louer-annemasse). No application fee.$f$, $r$see also our [rooms for rent in Annemasse](/en/chambre-a-louer-annemasse). No application fee.$r$),
    updated_at = now()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages'
  AND position($f$see also our [rooms for rent in Annemasse](/chambre-a-louer-annemasse). No application fee.$f$ IN content_en) > 0
  AND position($r$see also our [rooms for rent in Annemasse](/en/chambre-a-louer-annemasse). No application fee.$r$ IN content_en) = 0;

-- [72/148] colocation-annemasse-ville-la-grand-ambilly (en) · fix · EN footer 👉: broken anchor “Looking for [see our rooms on the French side]” → “a room on the French side”, FR URLs /colocation-geneve and /annemasse-colocation → /en/…
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Looking for [see our rooms on the French side](/colocation-geneve) or [in Annemasse](/annemasse-colocation)?**$f$, $r$**Looking for [a room on the French side](/en/colocation-geneve) or [in Annemasse](/en/annemasse-colocation)?**$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$**Looking for [see our rooms on the French side](/colocation-geneve) or [in Annemasse](/annemasse-colocation)?**$f$ IN content_en) > 0
  AND position($r$**Looking for [a room on the French side](/en/colocation-geneve) or [in Annemasse](/en/annemasse-colocation)?**$r$ IN content_en) = 0;

-- [73/148] colocation-annemasse-ville-la-grand-ambilly (en) · fix · EN footer 👉: third link of the same sentence, FR URL /chambre-a-louer-annemasse → /en/…
UPDATE blog_posts
SET content_en = replace(content_en, $f$see also our [rooms for rent in Annemasse](/chambre-a-louer-annemasse). No application fee.$f$, $r$see also our [rooms for rent in Annemasse](/en/chambre-a-louer-annemasse). No application fee.$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$see also our [rooms for rent in Annemasse](/chambre-a-louer-annemasse). No application fee.$f$ IN content_en) > 0
  AND position($r$see also our [rooms for rent in Annemasse](/en/chambre-a-louer-annemasse). No application fee.$r$ IN content_en) = 0;

-- [74/148] allocations-familiales-frontalier-geneve-2026 (en) · fix · EN footer 👉: link to the FR URL /colocation-geneve → /en/colocation-geneve
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$, $r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve)?**$r$),
    updated_at = now()
WHERE slug = 'allocations-familiales-frontalier-geneve-2026'
  AND position($f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$ IN content_en) > 0
  AND position($r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve)?**$r$ IN content_en) = 0;

-- [75/148] arnaques-logement-frontalier-geneve-eviter (en) · fix · EN footer 👉: link to the FR URL /colocation-geneve → /en/colocation-geneve
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$, $r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve)?**$r$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$ IN content_en) > 0
  AND position($r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve)?**$r$ IN content_en) = 0;

-- [76/148] assurance-sante-frontalier-lamal-cmu-budget (en) · fix · EN footer 👉: link to the FR URL /colocation-geneve → /en/colocation-geneve
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$, $r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve)?**$r$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$ IN content_en) > 0
  AND position($r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve)?**$r$ IN content_en) = 0;

-- [77/148] avenant-fiscal-40-frontalier-geneve (en) · fix · EN footer 👉: link to the FR URL /colocation-geneve → /en/colocation-geneve
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$, $r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve)?**$r$),
    updated_at = now()
WHERE slug = 'avenant-fiscal-40-frontalier-geneve'
  AND position($f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$ IN content_en) > 0
  AND position($r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve)?**$r$ IN content_en) = 0;

-- [78/148] banque-telephone-internet-frontalier-bons-plans (en) · fix · EN footer 👉: link to the FR URL /colocation-geneve → /en/colocation-geneve
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$, $r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve)?**$r$),
    updated_at = now()
WHERE slug = 'banque-telephone-internet-frontalier-bons-plans'
  AND position($f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$ IN content_en) > 0
  AND position($r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve)?**$r$ IN content_en) = 0;

-- [79/148] budget-colocation-geneve-guide-complet (en) · fix · EN footer 👉: link to the FR URL /colocation-geneve → /en/colocation-geneve
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$, $r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve)?**$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$ IN content_en) > 0
  AND position($r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve)?**$r$ IN content_en) = 0;

-- [80/148] choc-culturel-franco-suisse-expatrie-geneve (en) · fix · EN footer 👉: link to the FR URL /colocation-geneve → /en/colocation-geneve
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$, $r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve)?**$r$),
    updated_at = now()
WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve'
  AND position($f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$ IN content_en) > 0
  AND position($r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve)?**$r$ IN content_en) = 0;

-- [81/148] cout-de-la-vie-suisse-france-frontalier-2026 (en) · fix · EN footer 👉: broken anchor “Looking for [see our rooms on the French side]” (FR URL) → proper sentence and /en/ URL
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$, $r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$ IN content_en) > 0
  AND position($r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$ IN content_en) = 0;

-- [82/148] declaration-impots-frontalier-2026 (en) · fix · EN footer 👉: broken anchor “Looking for [see our rooms on the French side]” (FR URL) → proper sentence and /en/ URL
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$, $r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$),
    updated_at = now()
WHERE slug = 'declaration-impots-frontalier-2026'
  AND position($f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$ IN content_en) > 0
  AND position($r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$ IN content_en) = 0;

-- [83/148] demenager-geneve-frontalier-checklist (en) · fix · EN footer 👉: broken anchor “Looking for [see our rooms on the French side]” (FR URL) → proper sentence and /en/ URL
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$, $r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$),
    updated_at = now()
WHERE slug = 'demenager-geneve-frontalier-checklist'
  AND position($f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$ IN content_en) > 0
  AND position($r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$ IN content_en) = 0;

-- [84/148] ecole-internationale-geneve-frontalier-ou-habiter (en) · fix · EN footer 👉: broken anchor “Looking for [see our rooms on the French side]” (FR URL) → proper sentence and /en/ URL
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$, $r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$),
    updated_at = now()
WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
  AND position($f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$ IN content_en) > 0
  AND position($r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$ IN content_en) = 0;

-- [85/148] fiscalite-frontalier-geneve-impots-2026 (en) · fix · EN footer 👉: broken anchor “Looking for [see our rooms on the French side]” (FR URL) → proper sentence and /en/ URL
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$, $r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$ IN content_en) > 0
  AND position($r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$ IN content_en) = 0;

-- [86/148] grand-geneve-2026-nouveautes-frontaliers (en) · fix · EN footer 👉: broken anchor “Looking for [see our rooms on the French side]” (FR URL) → proper sentence and /en/ URL
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$, $r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$),
    updated_at = now()
WHERE slug = 'grand-geneve-2026-nouveautes-frontaliers'
  AND position($f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$ IN content_en) > 0
  AND position($r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$ IN content_en) = 0;

-- [87/148] guide-ressources-frontalier-geneve (en) · fix · EN footer 👉: broken anchor “Looking for [see our rooms on the French side]” (FR URL) → proper sentence and /en/ URL
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$, $r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$ IN content_en) > 0
  AND position($r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$ IN content_en) = 0;

-- [88/148] living-in-france-working-in-geneva (en) · fix · EN footer 👉: link to the FR URL /colocation-geneve → /en/colocation-geneve
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$, $r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$ IN content_en) > 0
  AND position($r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$ IN content_en) = 0;

-- [89/148] optimiser-espace-coliving-productivite-bien-etre (en) · fix · EN footer 👉: link to the FR URL /colocation-geneve → /en/colocation-geneve
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$, $r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$),
    updated_at = now()
WHERE slug = 'optimiser-espace-coliving-productivite-bien-etre'
  AND position($f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$ IN content_en) > 0
  AND position($r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$ IN content_en) = 0;

-- [90/148] organisations-internationales-geneve-ou-habiter (en) · fix · EN footer 👉: link to the FR URL /colocation-geneve → /en/colocation-geneve
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$, $r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$ IN content_en) > 0
  AND position($r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$ IN content_en) = 0;

-- [91/148] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · fix · EN footer 👉: link to the FR URL /colocation-geneve → /en/colocation-geneve
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$, $r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$ IN content_en) > 0
  AND position($r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$ IN content_en) = 0;

-- [92/148] permis-g-frontalier-geneve (en) · fix · EN footer 👉: link to the FR URL /colocation-geneve → /en/colocation-geneve
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$, $r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$),
    updated_at = now()
WHERE slug = 'permis-g-frontalier-geneve'
  AND position($f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$ IN content_en) > 0
  AND position($r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$ IN content_en) = 0;

-- [93/148] quitter-son-logement-guide-pratique (en) · fix · EN footer 👉: link to the FR URL /colocation-geneve → /en/colocation-geneve
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$, $r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$),
    updated_at = now()
WHERE slug = 'quitter-son-logement-guide-pratique'
  AND position($f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$ IN content_en) > 0
  AND position($r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$ IN content_en) = 0;

-- [94/148] salaire-suisse-net-frontalier-2026 (en) · fix · EN footer 👉: broken anchor “Looking for [see our rooms on the French side]” (FR URL) → proper sentence and /en/ URL
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$, $r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$ IN content_en) > 0
  AND position($r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$ IN content_en) = 0;

-- [95/148] se-faire-reseau-geneve-arriver-seul (en) · fix · EN footer 👉: link to the FR URL /colocation-geneve → /en/colocation-geneve
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$, $r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$),
    updated_at = now()
WHERE slug = 'se-faire-reseau-geneve-arriver-seul'
  AND position($f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$ IN content_en) > 0
  AND position($r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$ IN content_en) = 0;

-- [96/148] teletravail-frontalier-geneve-regles-2026 (en) · fix · EN footer 👉: link to the FR URL /colocation-geneve → /en/colocation-geneve
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$, $r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$ IN content_en) > 0
  AND position($r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$ IN content_en) = 0;

-- [97/148] trouver-colocation-geneve-frontalier (en) · fix · EN footer 👉: link to the FR URL /colocation-geneve → /en/colocation-geneve
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$, $r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$ IN content_en) > 0
  AND position($r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$ IN content_en) = 0;

-- [98/148] vie-quotidienne-frontalier-courses-sport-sorties (en) · fix · EN footer 👉: link to the FR URL /colocation-geneve → /en/colocation-geneve
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$, $r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$),
    updated_at = now()
WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties'
  AND position($f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$ IN content_en) > 0
  AND position($r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$ IN content_en) = 0;

-- [99/148] allocations-familiales-frontalier-geneve-2026 (fr) · footer · pied commun : « à 20 minutes de Genève en Léman Express ou tram » → formule de trajet D1 (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$),
    updated_at = now()
WHERE slug = 'allocations-familiales-frontalier-geneve-2026'
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) > 0
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) = 0;

-- [100/148] allocations-familiales-frontalier-geneve-2026 (en) · footer · common footer: “15-20 minutes from Geneva by Léman Express or tram” → D1 commute formula (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_en = replace(content_en, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$),
    updated_at = now()
WHERE slug = 'allocations-familiales-frontalier-geneve-2026'
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) > 0
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) = 0;

-- [101/148] arnaques-logement-frontalier-geneve-eviter (fr) · footer · pied commun : « à 20 minutes de Genève en Léman Express ou tram » → formule de trajet D1 (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) > 0
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) = 0;

-- [102/148] arnaques-logement-frontalier-geneve-eviter (en) · footer · common footer: “15-20 minutes from Geneva by Léman Express or tram” → D1 commute formula (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_en = replace(content_en, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) > 0
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) = 0;

-- [103/148] assurance-sante-frontalier-lamal-cmu-budget (fr) · footer · pied commun : « à 20 minutes de Genève en Léman Express ou tram » → formule de trajet D1 (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) > 0
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) = 0;

-- [104/148] assurance-sante-frontalier-lamal-cmu-budget (en) · footer · common footer: “15-20 minutes from Geneva by Léman Express or tram” → D1 commute formula (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_en = replace(content_en, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) > 0
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) = 0;

-- [105/148] avenant-fiscal-40-frontalier-geneve (fr) · footer · pied commun : « à 20 minutes de Genève en Léman Express ou tram » → formule de trajet D1 (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$),
    updated_at = now()
WHERE slug = 'avenant-fiscal-40-frontalier-geneve'
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) > 0
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) = 0;

-- [106/148] avenant-fiscal-40-frontalier-geneve (en) · footer · common footer: “15-20 minutes from Geneva by Léman Express or tram” → D1 commute formula (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_en = replace(content_en, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$),
    updated_at = now()
WHERE slug = 'avenant-fiscal-40-frontalier-geneve'
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) > 0
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) = 0;

-- [107/148] banque-telephone-internet-frontalier-bons-plans (fr) · footer · pied commun : « à 20 minutes de Genève en Léman Express ou tram » → formule de trajet D1 (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$),
    updated_at = now()
WHERE slug = 'banque-telephone-internet-frontalier-bons-plans'
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) > 0
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) = 0;

-- [108/148] banque-telephone-internet-frontalier-bons-plans (en) · footer · common footer: “15-20 minutes from Geneva by Léman Express or tram” → D1 commute formula (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_en = replace(content_en, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$),
    updated_at = now()
WHERE slug = 'banque-telephone-internet-frontalier-bons-plans'
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) > 0
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) = 0;

-- [109/148] budget-colocation-geneve-guide-complet (fr) · footer · pied commun : « à 20 minutes de Genève en Léman Express ou tram » → formule de trajet D1 (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) > 0
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) = 0;

-- [110/148] budget-colocation-geneve-guide-complet (en) · footer · common footer: “15-20 minutes from Geneva by Léman Express or tram” → D1 commute formula (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_en = replace(content_en, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) > 0
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) = 0;

-- [111/148] choc-culturel-franco-suisse-expatrie-geneve (fr) · footer · pied commun : « à 20 minutes de Genève en Léman Express ou tram » → formule de trajet D1 (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$),
    updated_at = now()
WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve'
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) > 0
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) = 0;

-- [112/148] choc-culturel-franco-suisse-expatrie-geneve (en) · footer · common footer: “15-20 minutes from Geneva by Léman Express or tram” → D1 commute formula (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_en = replace(content_en, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$),
    updated_at = now()
WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve'
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) > 0
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) = 0;

-- [113/148] cout-de-la-vie-suisse-france-frontalier-2026 (fr) · footer · pied commun : « à 20 minutes de Genève en Léman Express ou tram » → formule de trajet D1 (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) > 0
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) = 0;

-- [114/148] cout-de-la-vie-suisse-france-frontalier-2026 (en) · footer · common footer: “15-20 minutes from Geneva by Léman Express or tram” → D1 commute formula (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_en = replace(content_en, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) > 0
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) = 0;

-- [115/148] declaration-impots-frontalier-2026 (fr) · footer · pied commun : « à 20 minutes de Genève en Léman Express ou tram » → formule de trajet D1 (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$),
    updated_at = now()
WHERE slug = 'declaration-impots-frontalier-2026'
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) > 0
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) = 0;

-- [116/148] declaration-impots-frontalier-2026 (en) · footer · common footer: “15-20 minutes from Geneva by Léman Express or tram” → D1 commute formula (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_en = replace(content_en, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$),
    updated_at = now()
WHERE slug = 'declaration-impots-frontalier-2026'
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) > 0
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) = 0;

-- [117/148] demenager-geneve-frontalier-checklist (fr) · footer · pied commun : « à 20 minutes de Genève en Léman Express ou tram » → formule de trajet D1 (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$),
    updated_at = now()
WHERE slug = 'demenager-geneve-frontalier-checklist'
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) > 0
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) = 0;

-- [118/148] demenager-geneve-frontalier-checklist (en) · footer · common footer: “15-20 minutes from Geneva by Léman Express or tram” → D1 commute formula (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_en = replace(content_en, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$),
    updated_at = now()
WHERE slug = 'demenager-geneve-frontalier-checklist'
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) > 0
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) = 0;

-- [119/148] ecole-internationale-geneve-frontalier-ou-habiter (fr) · footer · pied commun : « à 20 minutes de Genève en Léman Express ou tram » → formule de trajet D1 (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$),
    updated_at = now()
WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) > 0
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) = 0;

-- [120/148] ecole-internationale-geneve-frontalier-ou-habiter (en) · footer · common footer: “15-20 minutes from Geneva by Léman Express or tram” → D1 commute formula (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_en = replace(content_en, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$),
    updated_at = now()
WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) > 0
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) = 0;

-- [121/148] fiscalite-frontalier-geneve-impots-2026 (fr) · footer · pied commun : « à 20 minutes de Genève en Léman Express ou tram » → formule de trajet D1 (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) > 0
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) = 0;

-- [122/148] fiscalite-frontalier-geneve-impots-2026 (en) · footer · common footer: “15-20 minutes from Geneva by Léman Express or tram” → D1 commute formula (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_en = replace(content_en, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) > 0
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) = 0;

-- [123/148] grand-geneve-2026-nouveautes-frontaliers (fr) · footer · pied commun : « à 20 minutes de Genève en Léman Express ou tram » → formule de trajet D1 (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$),
    updated_at = now()
WHERE slug = 'grand-geneve-2026-nouveautes-frontaliers'
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) > 0
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) = 0;

-- [124/148] grand-geneve-2026-nouveautes-frontaliers (en) · footer · common footer: “15-20 minutes from Geneva by Léman Express or tram” → D1 commute formula (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_en = replace(content_en, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$),
    updated_at = now()
WHERE slug = 'grand-geneve-2026-nouveautes-frontaliers'
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) > 0
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) = 0;

-- [125/148] guide-ressources-frontalier-geneve (fr) · footer · pied commun : « à 20 minutes de Genève en Léman Express ou tram » → formule de trajet D1 (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) > 0
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) = 0;

-- [126/148] guide-ressources-frontalier-geneve (en) · footer · common footer: “15-20 minutes from Geneva by Léman Express or tram” → D1 commute formula (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_en = replace(content_en, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) > 0
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) = 0;

-- [127/148] living-in-france-working-in-geneva (fr) · footer · pied commun : « à 20 minutes de Genève en Léman Express ou tram » → formule de trajet D1 (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) > 0
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) = 0;

-- [128/148] living-in-france-working-in-geneva (en) · footer · common footer: “15-20 minutes from Geneva by Léman Express or tram” → D1 commute formula (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_en = replace(content_en, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) > 0
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) = 0;

-- [129/148] optimiser-espace-coliving-productivite-bien-etre (fr) · footer · pied commun : « à 20 minutes de Genève en Léman Express ou tram » → formule de trajet D1 (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$),
    updated_at = now()
WHERE slug = 'optimiser-espace-coliving-productivite-bien-etre'
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) > 0
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) = 0;

-- [130/148] optimiser-espace-coliving-productivite-bien-etre (en) · footer · common footer: “15-20 minutes from Geneva by Léman Express or tram” → D1 commute formula (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_en = replace(content_en, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$),
    updated_at = now()
WHERE slug = 'optimiser-espace-coliving-productivite-bien-etre'
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) > 0
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) = 0;

-- [131/148] organisations-internationales-geneve-ou-habiter (fr) · footer · pied commun : « à 20 minutes de Genève en Léman Express ou tram » → formule de trajet D1 (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) > 0
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) = 0;

-- [132/148] organisations-internationales-geneve-ou-habiter (en) · footer · common footer: “15-20 minutes from Geneva by Léman Express or tram” → D1 commute formula (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_en = replace(content_en, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) > 0
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) = 0;

-- [133/148] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · footer · pied commun : « à 20 minutes de Genève en Léman Express ou tram » → formule de trajet D1 (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) > 0
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) = 0;

-- [134/148] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · footer · common footer: “15-20 minutes from Geneva by Léman Express or tram” → D1 commute formula (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_en = replace(content_en, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) > 0
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) = 0;

-- [135/148] permis-g-frontalier-geneve (fr) · footer · pied commun : « à 20 minutes de Genève en Léman Express ou tram » → formule de trajet D1 (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$),
    updated_at = now()
WHERE slug = 'permis-g-frontalier-geneve'
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) > 0
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) = 0;

-- [136/148] permis-g-frontalier-geneve (en) · footer · common footer: “15-20 minutes from Geneva by Léman Express or tram” → D1 commute formula (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_en = replace(content_en, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$),
    updated_at = now()
WHERE slug = 'permis-g-frontalier-geneve'
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) > 0
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) = 0;

-- [137/148] quitter-son-logement-guide-pratique (fr) · footer · pied commun : « à 20 minutes de Genève en Léman Express ou tram » → formule de trajet D1 (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$),
    updated_at = now()
WHERE slug = 'quitter-son-logement-guide-pratique'
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) > 0
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) = 0;

-- [138/148] quitter-son-logement-guide-pratique (en) · footer · common footer: “15-20 minutes from Geneva by Léman Express or tram” → D1 commute formula (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_en = replace(content_en, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$),
    updated_at = now()
WHERE slug = 'quitter-son-logement-guide-pratique'
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) > 0
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) = 0;

-- [139/148] salaire-suisse-net-frontalier-2026 (fr) · footer · pied commun : « à 20 minutes de Genève en Léman Express ou tram » → formule de trajet D1 (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) > 0
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) = 0;

-- [140/148] salaire-suisse-net-frontalier-2026 (en) · footer · common footer: “15-20 minutes from Geneva by Léman Express or tram” → D1 commute formula (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_en = replace(content_en, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) > 0
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) = 0;

-- [141/148] se-faire-reseau-geneve-arriver-seul (fr) · footer · pied commun : « à 20 minutes de Genève en Léman Express ou tram » → formule de trajet D1 (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$),
    updated_at = now()
WHERE slug = 'se-faire-reseau-geneve-arriver-seul'
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) > 0
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) = 0;

-- [142/148] se-faire-reseau-geneve-arriver-seul (en) · footer · common footer: “15-20 minutes from Geneva by Léman Express or tram” → D1 commute formula (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_en = replace(content_en, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$),
    updated_at = now()
WHERE slug = 'se-faire-reseau-geneve-arriver-seul'
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) > 0
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) = 0;

-- [143/148] teletravail-frontalier-geneve-regles-2026 (fr) · footer · pied commun : « à 20 minutes de Genève en Léman Express ou tram » → formule de trajet D1 (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) > 0
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) = 0;

-- [144/148] teletravail-frontalier-geneve-regles-2026 (en) · footer · common footer: “15-20 minutes from Geneva by Léman Express or tram” → D1 commute formula (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_en = replace(content_en, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) > 0
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) = 0;

-- [145/148] trouver-colocation-geneve-frontalier (fr) · footer · pied commun : « à 20 minutes de Genève en Léman Express ou tram » → formule de trajet D1 (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) > 0
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) = 0;

-- [146/148] trouver-colocation-geneve-frontalier (en) · footer · common footer: “15-20 minutes from Geneva by Léman Express or tram” → D1 commute formula (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_en = replace(content_en, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) > 0
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) = 0;

-- [147/148] vie-quotidienne-frontalier-courses-sport-sorties (fr) · footer · pied commun : « à 20 minutes de Genève en Léman Express ou tram » → formule de trajet D1 (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$),
    updated_at = now()
WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties'
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) > 0
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) = 0;

-- [148/148] vie-quotidienne-frontalier-courses-sport-sorties (en) · footer · common footer: “15-20 minutes from Geneva by Léman Express or tram” → D1 commute formula (GENEVA_COMMUTE_FORMULA)
UPDATE blog_posts
SET content_en = replace(content_en, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$),
    updated_at = now()
WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties'
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) > 0
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) = 0;

-- ── Aperçu des ancrages (ancien → nouveau, première ligne de chaque texte) ──
-- [1] trouver-colocation-geneve-frontalier/fr · M1 : « ## Où chercher concrètement ?⏎⏎Plusieurs pistes, avec leurs avantages e… » → « ## Comment éviter les arnaques ? »
-- [2] trouver-colocation-geneve-frontalier/en · M1 : « ## Where to actually look?⏎⏎Several options, each with pros and cons:⏎-… » → « ## How to avoid scams? »
-- [3] trouver-colocation-geneve-frontalier/fr · M4 : « Bonne nouvelle : en coliving, le dossier est simplifié — contrat de tra… » → « Pas encore de fiche de salaire suisse ? Certains bailleurs côté France … »
-- [4] trouver-colocation-geneve-frontalier/en · M4 : « Good news: in coliving, the application is simplified — **[no French gu… » → « No Swiss payslip yet? Some landlords on the French side assess your con… »
-- [5] trouver-colocation-geneve-frontalier/en · fix : « - In coliving, **no French guarantor** and everything is included. » → « - In coliving, the file is your employment contract and everything is i… »
-- [6] trouver-colocation-geneve-frontalier/fr · M1 : « - Cherche sur les groupes frontaliers, les annonces, les agences ou les… » → « - Cherche par quatre canaux : [les opérateurs de coliving côté France](… »
-- [7] trouver-colocation-geneve-frontalier/en · M1 : « - Look on cross-border groups, listings, agencies or coliving operators. » → « - Search through four channels: [coliving operators on the French side]… »
-- [8] trouver-colocation-geneve-frontalier/fr · fix : « de 600 à 900 € en location classique » → « de 700 à 1 000 € en location classique »
-- [9] trouver-colocation-geneve-frontalier/en · fix : « from €600 to €900 in a classic rental » → « from €700 to €1,000 in a classic rental »
-- [10] budget-colocation-geneve-guide-complet/fr · M3 : « | Coliving premium tout inclus | — | — | 1 370 CHF | » → « | Chambre en coliving tout inclus côté France — La Villa Coliving | — |… »
-- [11] budget-colocation-geneve-guide-complet/en · M3 : « | Premium coliving all-inclusive | — | — | 1,370 CHF | » → « | All-inclusive coliving room on the French side — La Villa Coliving | … »
-- [12] budget-colocation-geneve-guide-complet/fr · M3 : « Et encore, ces chiffres ne prennent pas en compte les charges (80-150 C… » → « Et encore, ces chiffres ne prennent pas en compte les charges (80-150 C… »
-- [13] budget-colocation-geneve-guide-complet/en · M3 : « **The gap is brutal.** A studio in central Geneva costs an average of 1… » → « **The gap is brutal.** A studio in central Geneva costs an average of 1… »
-- [14] budget-colocation-geneve-guide-complet/fr · fix : « | **Ville-la-Grand** | 700 – 950 € | 900 – 1 200 € | 500 – 700 € | 1 37… » → « | **Ville-la-Grand** | 700 – 950 € | 900 – 1 200 € | 500 – 700 € | 1 37… »
-- [15] budget-colocation-geneve-guide-complet/fr · fix : « | **Ambilly** | 700 – 1 000 € | 900 – 1 250 € | 500 – 750 € | 1 370 CHF… » → « | **Ambilly** | 700 – 1 000 € | 900 – 1 250 € | 500 – 750 € | 1 430 CHF… »
-- [16] budget-colocation-geneve-guide-complet/fr · fix : « | **Annemasse gare (Léman Express)** | 850 – 1 150 € | 1 000 – 1 350 € … » → « | **Annemasse gare (Léman Express)** | 850 – 1 150 € | 1 000 – 1 350 € … »
-- [17] budget-colocation-geneve-guide-complet/en · fix : « | **Ville-la-Grand** | 700–950 € | 900–1,200 € | 500–700 € | 1,370 CHF | » → « | **Ville-la-Grand** | 700–950 € | 900–1,200 € | 500–700 € | 1,370 – 1,… »
-- [18] budget-colocation-geneve-guide-complet/en · fix : « | **Ambilly** | 700–1,000 € | 900–1,250 € | 500–750 € | 1,370 CHF | » → « | **Ambilly** | 700–1,000 € | 900–1,250 € | 500–750 € | 1,430 CHF | »
-- [19] budget-colocation-geneve-guide-complet/en · fix : « | **Annemasse station (Léman Express)** | 850–1,150 € | 1,000–1,350 € |… » → « | **Annemasse station (Léman Express)** | 850–1,150 € | 1,000–1,350 € |… »
-- [20] budget-colocation-geneve-guide-complet/fr · M4 : « ⏎⏎Le bon réflexe n'est pas de comparer les loyers nus » → « ⏎⏎**Pas encore de fiche de salaire suisse ?** Certains bailleurs côté F… »
-- [21] budget-colocation-geneve-guide-complet/en · M4 : « ⏎⏎The right reflex is not to compare bare rents » → « ⏎⏎**No Swiss payslip yet?** Some landlords on the French side assess yo… »
-- [22] budget-colocation-geneve-guide-complet/fr · fix : « un loyer de 1 370 CHF équivaut à de 1 490 à 1 540 € : c'est le loyer co… » → « un loyer de 1 370 à 1 430 CHF correspond à un loyer contractuel de 1 47… »
-- [23] budget-colocation-geneve-guide-complet/en · fix : « a 1,370 CHF rent is worth roughly 1,480-1,530 € depending on the curren… » → « a CHF 1,370 to 1,430 rent corresponds to a contractual rent of €1,470 t… »
-- [24] budget-colocation-geneve-guide-complet/fr · fix : « Faites le calcul : » → « Fais le calcul : »
-- [25] living-in-france-working-in-geneva/fr · M4 : « Pas de garantie bancaire farfelue, pas de 10 justificatifs de revenu : … » → « Pas encore de fiche de salaire suisse ? Certains bailleurs côté France … »
-- [26] living-in-france-working-in-geneva/en · M4 : « No outrageous bank guarantees, no French guarantor if you're foreign, n… » → « No Swiss payslip yet? Some landlords on the French side assess your con… »
-- [27] living-in-france-working-in-geneva/fr · fix : « = 1 380 EUR. » → « ≈ 1 400 EUR. »
-- [28] living-in-france-working-in-geneva/en · fix : « = €1,380. » → « ≈ €1,400. »
-- [29] living-in-france-working-in-geneva/fr · fix : « Voici ce qu'on recommande aux 50+ personnes qui arrivent chaque année c… » → « Voici ce qu'on recommande aux nouveaux résidents qui arrivent chaque an… »
-- [30] living-in-france-working-in-geneva/en · fix : « Here's our advice for the 50+ people arriving annually. » → « Here's our advice for the new residents who arrive every year. »
-- [31] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · M2 : « C'est ici qu'on a installé La Villa Coliving — pour de bonnes raisons. » → « À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 14 … »
-- [32] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · M2 : « This is where we built La Villa Coliving — for good reasons. » → « In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 14-min… »
-- [33] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · M2 : « Le revers : les prix grimpent vite et le centre est bondé aux heures de… » → « Le revers : les prix grimpent vite et le centre est bondé aux heures de… »
-- [34] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · M2 : « Downside: prices climb fast and the center is packed at peak hours. » → « Downside: prices climb fast and the center is packed at peak hours.⏎⏎In… »
-- [35] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · M2 : « Position centrale, juste entre Annemasse et la frontière suisse. » → « Position centrale, juste entre Annemasse et la frontière suisse.⏎⏎À Amb… »
-- [36] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · M2 : « Central location, right between Annemasse and the Swiss border. » → « Central location, right between Annemasse and the Swiss border.⏎⏎In Amb… »
-- [37] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · fix : « - **Sans bail, tout inclus** : coliving à Ville-la-Grand » → « - **Tout inclus, sans frais de dossier** : le coliving de La Villa Coli… »
-- [38] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · fix : « - **No lease, all-inclusive**: coliving in Ville-la-Grand » → « - **All inclusive, no application fee**: coliving with La Villa Colivin… »
-- [39] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · fix : « frontaliers qui veulent du calme à 15 minutes du bureau. » → « frontaliers qui veulent du calme près de Genève. »
-- [40] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · fix : « cross-border workers who want quiet 15 minutes from the office. » → « cross-border workers who want quiet near Geneva. »
-- [41] cout-de-la-vie-suisse-france-frontalier-2026/fr · M3 : « | − Logement (T2 ou coliving tout inclus) | −1 100 à −1 400 CHF | » → « | − Logement (T2, ou chambre en coliving côté France — ex. La Villa Col… »
-- [42] cout-de-la-vie-suisse-france-frontalier-2026/en · M3 : « | − Housing (2-room or all-inclusive coliving) | −1,100 to −1,400 CHF | » → « | − Housing (2-room, or a coliving room on the French side — e.g. La Vi… »
-- [43] demenager-geneve-frontalier-checklist/fr · M4 : « **Garant** : Si tu n'as pas un CDI français connu, tu auras besoin d'un… » → « **Garant** : Si tu n'as pas un CDI français connu, un bailleur te deman… »
-- [44] demenager-geneve-frontalier-checklist/en · M4 : « **Guarantor**: If you don't have a known French permanent job, you'll n… » → « **Guarantor**: If you don't have a known French permanent job, a landlo… »
-- [45] demenager-geneve-frontalier-checklist/fr · fix : « - Adresse du garant + ses documents » → « - Adresse du garant + ses documents, si on t'en demande un »
-- [46] demenager-geneve-frontalier-checklist/en · fix : « - Guarantor address + documents » → « - Guarantor address + documents, if one is asked of you »
-- [47] quartiers-annemasse-ou-vivre-selon-profil/fr · M2 : « Tu marches à la gare en moins de 10 minutes, tu oublies la voiture et l… » → « Tu marches à la gare en une dizaine de minutes, tu oublies la voiture e… »
-- [48] quartiers-annemasse-ou-vivre-selon-profil/en · M2 : « You walk to the station in under 10 minutes, forget the car and the cus… » → « You walk to the station in about ten minutes, forget the car and the cu… »
-- [49] quartiers-annemasse-ou-vivre-selon-profil/fr · M2 : « on rejoint la gare du Léman Express à pied en moins de 10 minutes. Idéa… » → « on rejoint la gare du Léman Express à pied en une dizaine de minutes. I… »
-- [50] quartiers-annemasse-ou-vivre-selon-profil/en · M2 : « the Léman Express station is under 10 minutes' walk. Ideal for a car-fr… » → « the Léman Express station is about ten minutes' walk. Ideal for a car-f… »
-- [51] colocation-annemasse-ville-la-grand-ambilly/fr · M1 : « ## Où chercher : les bons sites⏎⏎**Leboncoin** : C'est le classique fra… » → « ## Les bonnes zones »
-- [52] colocation-annemasse-ville-la-grand-ambilly/en · M1 : « ## Where to Search: Best Sites⏎⏎**Leboncoin**: France's largest classif… » → « ## Best Zones »
-- [53] colocation-annemasse-ville-la-grand-ambilly/fr · M2 : « **Annemasse centre (près de la gare)** : Prix : 1000-1400 CHF. Vibrant,… » → « **Annemasse centre (près de la gare)** : Prix : 1000-1400 CHF. Vibrant,… »
-- [54] colocation-annemasse-ville-la-grand-ambilly/en · M2 : « **Annemasse center (near station)**: Price: 1000-1400 CHF. Vibrant, sho… » → « **Annemasse center (near station)**: Price: 1000-1400 CHF. Vibrant, sho… »
-- [55] colocation-annemasse-ville-la-grand-ambilly/fr · M2 : « Toujours 10 min à pied de la gare, plus d'espaces verts et plus familia… » → « Plus d'espaces verts et plus familial. À Ville-la-Grand, La Villa de La… »
-- [56] colocation-annemasse-ville-la-grand-ambilly/en · M2 : « Also 10 min on foot from the station, more green space and more family-… » → « More green space and more family-friendly. In Ville-la-Grand, La Villa … »
-- [57] colocation-annemasse-ville-la-grand-ambilly/fr · M2 : « **Ambilly** : Prix : 850-1150 CHF. Très résidentiel et assez haut de ga… » → « **Ambilly** : Prix : 850-1150 CHF. Très résidentiel et assez haut de ga… »
-- [58] colocation-annemasse-ville-la-grand-ambilly/en · M2 : « **Ambilly**: Price: 850-1150 CHF. Very residential and fairly upscale d… » → « **Ambilly**: Price: 850-1150 CHF. Very residential and fairly upscale d… »
-- [59] colocation-annemasse-ville-la-grand-ambilly/fr · M3 : « | Coliving premium tout compris | 1 370 CHF/mois | » → « | Coliving premium tout compris | 1 370 – 1 430 CHF/mois | »
-- [60] colocation-annemasse-ville-la-grand-ambilly/en · M3 : « | All-inclusive premium coliving | 1,370 CHF/month | » → « | All-inclusive premium coliving | 1,370 – 1,430 CHF/month | »
-- [61] dossier-location-frontalier-suisse-france/fr · M4 : « [tu auras besoin d'un garant](https://www.anil.org/parole-expert-logeme… » → « [la plupart des bailleurs te demanderont un garant](https://www.anil.or… »
-- [62] dossier-location-frontalier-suisse-france/en · M4 : « [you'll need a guarantor](https://www.anil.org/parole-expert-logement-l… » → « [most landlords will ask for a guarantor](https://www.anil.org/parole-e… »
-- [63] dossier-location-frontalier-suisse-france/fr · M4 : « **Garantme ou Cautioneo** : des services payants (3-4 % du loyer annuel… » → « **Garantme ou Cautioneo** : des services payants (3-4 % du loyer annuel… »
-- [64] dossier-location-frontalier-suisse-france/en · M4 : « **Garantme or Cautioneo**: paid services (3-4% of annual rent) that act… » → « **Garantme or Cautioneo**: paid services (3-4% of annual rent) that act… »
-- [65] dossier-location-frontalier-suisse-france/en · fix : « accepts cross-border workers with no French guarantor — furnished all-i… » → « accepts cross-border workers on the basis of their employment contract … »
-- [66] dossier-location-frontalier-suisse-france/fr · fix : « ## L'alternative coliving : zéro dossier, zéro galère » → « ## L'alternative coliving : un dossier en trois pièces »
-- [67] dossier-location-frontalier-suisse-france/en · fix : « ## The Coliving Alternative: Zero Hassle » → « ## The Coliving Alternative: A Three-Document File »
-- [68] coliving-transfrontalier-geneve-annemasse-nouvelle-vie/en · M4 : « No French guarantor to find, no electricity and internet contracts to o… » → « No electricity and internet contracts to open, no furniture to buy then… »
-- [69] guide-ressources-frontalier-geneve/en · M4 : « No French guarantor? The **[Visale](https://www.visale.fr)** guarantee » → « No guarantor in France? The **[Visale](https://www.visale.fr)** guarant… »
-- [70] coliving-annemasse-geneve-frontaliers-avantages/en · fix : « **Looking for [La Villa Coliving, French side](/colocation-geneve) or [… » → « **Looking for [La Villa Coliving, French side](/en/colocation-geneve) o… »
-- [71] coliving-annemasse-geneve-frontaliers-avantages/en · fix : « see also our [rooms for rent in Annemasse](/chambre-a-louer-annemasse).… » → « see also our [rooms for rent in Annemasse](/en/chambre-a-louer-annemass… »
-- [72] colocation-annemasse-ville-la-grand-ambilly/en · fix : « **Looking for [see our rooms on the French side](/colocation-geneve) or… » → « **Looking for [a room on the French side](/en/colocation-geneve) or [in… »
-- [73] colocation-annemasse-ville-la-grand-ambilly/en · fix : « see also our [rooms for rent in Annemasse](/chambre-a-louer-annemasse).… » → « see also our [rooms for rent in Annemasse](/en/chambre-a-louer-annemass… »
-- [74] allocations-familiales-frontalier-geneve-2026/en · fix : « **Looking for [La Villa Coliving, French side](/colocation-geneve)?** » → « **Looking for [La Villa Coliving, French side](/en/colocation-geneve)?** »
-- [75] arnaques-logement-frontalier-geneve-eviter/en · fix : « **Looking for [La Villa Coliving, French side](/colocation-geneve)?** » → « **Looking for [La Villa Coliving, French side](/en/colocation-geneve)?** »
-- [76] assurance-sante-frontalier-lamal-cmu-budget/en · fix : « **Looking for [La Villa Coliving, French side](/colocation-geneve)?** » → « **Looking for [La Villa Coliving, French side](/en/colocation-geneve)?** »
-- [77] avenant-fiscal-40-frontalier-geneve/en · fix : « **Looking for [La Villa Coliving, French side](/colocation-geneve)?** » → « **Looking for [La Villa Coliving, French side](/en/colocation-geneve)?** »
-- [78] banque-telephone-internet-frontalier-bons-plans/en · fix : « **Looking for [La Villa Coliving, French side](/colocation-geneve)?** » → « **Looking for [La Villa Coliving, French side](/en/colocation-geneve)?** »
-- [79] budget-colocation-geneve-guide-complet/en · fix : « **Looking for [La Villa Coliving, French side](/colocation-geneve)?** » → « **Looking for [La Villa Coliving, French side](/en/colocation-geneve)?** »
-- [80] choc-culturel-franco-suisse-expatrie-geneve/en · fix : « **Looking for [La Villa Coliving, French side](/colocation-geneve)?** » → « **Looking for [La Villa Coliving, French side](/en/colocation-geneve)?** »
-- [81] cout-de-la-vie-suisse-france-frontalier-2026/en · fix : « **Looking for [see our rooms on the French side](/colocation-geneve)?** » → « **Looking for [a room on the French side](/en/colocation-geneve)?** »
-- [82] declaration-impots-frontalier-2026/en · fix : « **Looking for [see our rooms on the French side](/colocation-geneve)?** » → « **Looking for [a room on the French side](/en/colocation-geneve)?** »
-- [83] demenager-geneve-frontalier-checklist/en · fix : « **Looking for [see our rooms on the French side](/colocation-geneve)?** » → « **Looking for [a room on the French side](/en/colocation-geneve)?** »
-- [84] ecole-internationale-geneve-frontalier-ou-habiter/en · fix : « **Looking for [see our rooms on the French side](/colocation-geneve)?** » → « **Looking for [a room on the French side](/en/colocation-geneve)?** »
-- [85] fiscalite-frontalier-geneve-impots-2026/en · fix : « **Looking for [see our rooms on the French side](/colocation-geneve)?** » → « **Looking for [a room on the French side](/en/colocation-geneve)?** »
-- [86] grand-geneve-2026-nouveautes-frontaliers/en · fix : « **Looking for [see our rooms on the French side](/colocation-geneve)?** » → « **Looking for [a room on the French side](/en/colocation-geneve)?** »
-- [87] guide-ressources-frontalier-geneve/en · fix : « **Looking for [see our rooms on the French side](/colocation-geneve)?** » → « **Looking for [a room on the French side](/en/colocation-geneve)?** »
-- [88] living-in-france-working-in-geneva/en · fix : « **Looking for [shared housing near Geneva](/colocation-geneve)?** » → « **Looking for [shared housing near Geneva](/en/colocation-geneve)?** »
-- [89] optimiser-espace-coliving-productivite-bien-etre/en · fix : « **Looking for [shared housing near Geneva](/colocation-geneve)?** » → « **Looking for [shared housing near Geneva](/en/colocation-geneve)?** »
-- [90] organisations-internationales-geneve-ou-habiter/en · fix : « **Looking for [shared housing near Geneva](/colocation-geneve)?** » → « **Looking for [shared housing near Geneva](/en/colocation-geneve)?** »
-- [91] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · fix : « **Looking for [shared housing near Geneva](/colocation-geneve)?** » → « **Looking for [shared housing near Geneva](/en/colocation-geneve)?** »
-- [92] permis-g-frontalier-geneve/en · fix : « **Looking for [shared housing near Geneva](/colocation-geneve)?** » → « **Looking for [shared housing near Geneva](/en/colocation-geneve)?** »
-- [93] quitter-son-logement-guide-pratique/en · fix : « **Looking for [shared housing near Geneva](/colocation-geneve)?** » → « **Looking for [shared housing near Geneva](/en/colocation-geneve)?** »
-- [94] salaire-suisse-net-frontalier-2026/en · fix : « **Looking for [see our rooms on the French side](/colocation-geneve)?** » → « **Looking for [a room on the French side](/en/colocation-geneve)?** »
-- [95] se-faire-reseau-geneve-arriver-seul/en · fix : « **Looking for [shared housing near Geneva](/colocation-geneve)?** » → « **Looking for [shared housing near Geneva](/en/colocation-geneve)?** »
-- [96] teletravail-frontalier-geneve-regles-2026/en · fix : « **Looking for [shared housing near Geneva](/colocation-geneve)?** » → « **Looking for [shared housing near Geneva](/en/colocation-geneve)?** »
-- [97] trouver-colocation-geneve-frontalier/en · fix : « **Looking for [shared housing near Geneva](/colocation-geneve)?** » → « **Looking for [shared housing near Geneva](/en/colocation-geneve)?** »
-- [98] vie-quotidienne-frontalier-courses-sport-sorties/en · fix : « **Looking for [shared housing near Geneva](/colocation-geneve)?** » → « **Looking for [shared housing near Geneva](/en/colocation-geneve)?** »
-- [99] allocations-familiales-frontalier-geneve-2026/fr · footer : « sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram. » → « sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depu… »
-- [100] allocations-familiales-frontalier-geneve-2026/en · footer : « no application fee — 15-20 minutes from Geneva by Léman Express or tram. » → « no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express fro… »
-- [101] arnaques-logement-frontalier-geneve-eviter/fr · footer : « sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram. » → « sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depu… »
-- [102] arnaques-logement-frontalier-geneve-eviter/en · footer : « no application fee — 15-20 minutes from Geneva by Léman Express or tram. » → « no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express fro… »
-- [103] assurance-sante-frontalier-lamal-cmu-budget/fr · footer : « sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram. » → « sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depu… »
-- [104] assurance-sante-frontalier-lamal-cmu-budget/en · footer : « no application fee — 15-20 minutes from Geneva by Léman Express or tram. » → « no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express fro… »
-- [105] avenant-fiscal-40-frontalier-geneve/fr · footer : « sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram. » → « sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depu… »
-- [106] avenant-fiscal-40-frontalier-geneve/en · footer : « no application fee — 15-20 minutes from Geneva by Léman Express or tram. » → « no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express fro… »
-- [107] banque-telephone-internet-frontalier-bons-plans/fr · footer : « sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram. » → « sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depu… »
-- [108] banque-telephone-internet-frontalier-bons-plans/en · footer : « no application fee — 15-20 minutes from Geneva by Léman Express or tram. » → « no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express fro… »
-- [109] budget-colocation-geneve-guide-complet/fr · footer : « sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram. » → « sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depu… »
-- [110] budget-colocation-geneve-guide-complet/en · footer : « no application fee — 15-20 minutes from Geneva by Léman Express or tram. » → « no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express fro… »
-- [111] choc-culturel-franco-suisse-expatrie-geneve/fr · footer : « sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram. » → « sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depu… »
-- [112] choc-culturel-franco-suisse-expatrie-geneve/en · footer : « no application fee — 15-20 minutes from Geneva by Léman Express or tram. » → « no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express fro… »
-- [113] cout-de-la-vie-suisse-france-frontalier-2026/fr · footer : « sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram. » → « sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depu… »
-- [114] cout-de-la-vie-suisse-france-frontalier-2026/en · footer : « no application fee — 15-20 minutes from Geneva by Léman Express or tram. » → « no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express fro… »
-- [115] declaration-impots-frontalier-2026/fr · footer : « sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram. » → « sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depu… »
-- [116] declaration-impots-frontalier-2026/en · footer : « no application fee — 15-20 minutes from Geneva by Léman Express or tram. » → « no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express fro… »
-- [117] demenager-geneve-frontalier-checklist/fr · footer : « sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram. » → « sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depu… »
-- [118] demenager-geneve-frontalier-checklist/en · footer : « no application fee — 15-20 minutes from Geneva by Léman Express or tram. » → « no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express fro… »
-- [119] ecole-internationale-geneve-frontalier-ou-habiter/fr · footer : « sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram. » → « sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depu… »
-- [120] ecole-internationale-geneve-frontalier-ou-habiter/en · footer : « no application fee — 15-20 minutes from Geneva by Léman Express or tram. » → « no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express fro… »
-- [121] fiscalite-frontalier-geneve-impots-2026/fr · footer : « sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram. » → « sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depu… »
-- [122] fiscalite-frontalier-geneve-impots-2026/en · footer : « no application fee — 15-20 minutes from Geneva by Léman Express or tram. » → « no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express fro… »
-- [123] grand-geneve-2026-nouveautes-frontaliers/fr · footer : « sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram. » → « sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depu… »
-- [124] grand-geneve-2026-nouveautes-frontaliers/en · footer : « no application fee — 15-20 minutes from Geneva by Léman Express or tram. » → « no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express fro… »
-- [125] guide-ressources-frontalier-geneve/fr · footer : « sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram. » → « sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depu… »
-- [126] guide-ressources-frontalier-geneve/en · footer : « no application fee — 15-20 minutes from Geneva by Léman Express or tram. » → « no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express fro… »
-- [127] living-in-france-working-in-geneva/fr · footer : « sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram. » → « sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depu… »
-- [128] living-in-france-working-in-geneva/en · footer : « no application fee — 15-20 minutes from Geneva by Léman Express or tram. » → « no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express fro… »
-- [129] optimiser-espace-coliving-productivite-bien-etre/fr · footer : « sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram. » → « sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depu… »
-- [130] optimiser-espace-coliving-productivite-bien-etre/en · footer : « no application fee — 15-20 minutes from Geneva by Léman Express or tram. » → « no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express fro… »
-- [131] organisations-internationales-geneve-ou-habiter/fr · footer : « sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram. » → « sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depu… »
-- [132] organisations-internationales-geneve-ou-habiter/en · footer : « no application fee — 15-20 minutes from Geneva by Léman Express or tram. » → « no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express fro… »
-- [133] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · footer : « sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram. » → « sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depu… »
-- [134] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · footer : « no application fee — 15-20 minutes from Geneva by Léman Express or tram. » → « no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express fro… »
-- [135] permis-g-frontalier-geneve/fr · footer : « sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram. » → « sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depu… »
-- [136] permis-g-frontalier-geneve/en · footer : « no application fee — 15-20 minutes from Geneva by Léman Express or tram. » → « no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express fro… »
-- [137] quitter-son-logement-guide-pratique/fr · footer : « sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram. » → « sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depu… »
-- [138] quitter-son-logement-guide-pratique/en · footer : « no application fee — 15-20 minutes from Geneva by Léman Express or tram. » → « no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express fro… »
-- [139] salaire-suisse-net-frontalier-2026/fr · footer : « sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram. » → « sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depu… »
-- [140] salaire-suisse-net-frontalier-2026/en · footer : « no application fee — 15-20 minutes from Geneva by Léman Express or tram. » → « no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express fro… »
-- [141] se-faire-reseau-geneve-arriver-seul/fr · footer : « sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram. » → « sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depu… »
-- [142] se-faire-reseau-geneve-arriver-seul/en · footer : « no application fee — 15-20 minutes from Geneva by Léman Express or tram. » → « no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express fro… »
-- [143] teletravail-frontalier-geneve-regles-2026/fr · footer : « sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram. » → « sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depu… »
-- [144] teletravail-frontalier-geneve-regles-2026/en · footer : « no application fee — 15-20 minutes from Geneva by Léman Express or tram. » → « no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express fro… »
-- [145] trouver-colocation-geneve-frontalier/fr · footer : « sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram. » → « sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depu… »
-- [146] trouver-colocation-geneve-frontalier/en · footer : « no application fee — 15-20 minutes from Geneva by Léman Express or tram. » → « no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express fro… »
-- [147] vie-quotidienne-frontalier-courses-sport-sorties/fr · footer : « sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram. » → « sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depu… »
-- [148] vie-quotidienne-frontalier-courses-sport-sorties/en · footer : « no application fee — 15-20 minutes from Geneva by Léman Express or tram. » → « no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express fro… »

COMMIT;

-- ── Vérification (lecture seule) : une ligne par article ; fr_ok / en_ok = true quand toutes les modifications de la langue sont en place, NULL = langue non touchée.
SELECT slug,
  CASE slug
    WHEN 'allocations-familiales-frontalier-geneve-2026' THEN (position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0)
    WHEN 'arnaques-logement-frontalier-geneve-eviter' THEN (position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0)
    WHEN 'assurance-sante-frontalier-lamal-cmu-budget' THEN (position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0)
    WHEN 'avenant-fiscal-40-frontalier-geneve' THEN (position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0)
    WHEN 'banque-telephone-internet-frontalier-bons-plans' THEN (position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0)
    WHEN 'budget-colocation-geneve-guide-complet' THEN (position($f$| Coliving premium tout inclus | — | — | 1 370 CHF |$f$ IN content_fr) = 0
      AND position($r$Et encore, ces chiffres ne prennent pas en compte les charges (80-150 CHF/mois à Genève), le dépôt de garantie (jusqu'à 3 mois en Suisse vs 2 mois hors charges en France), ni les frais d'agence.

Chambre en coliving côté France : 1 370 à 1 430 CHF tout inclus chez La Villa Coliving (charges, fibre, ménage, piscine, sauna, salle de sport compris, 0 € de frais de dossier).$r$ IN content_fr) > 0
      AND position($f$| **Ville-la-Grand** | 700 – 950 € | 900 – 1 200 € | 500 – 700 € | 1 370 CHF |$f$ IN content_fr) = 0
      AND position($f$| **Ambilly** | 700 – 1 000 € | 900 – 1 250 € | 500 – 750 € | 1 370 CHF |$f$ IN content_fr) = 0
      AND position($f$| **Annemasse gare (Léman Express)** | 850 – 1 150 € | 1 000 – 1 350 € | 600 – 800 € | — |$f$ IN content_fr) = 0
      AND position($r$

**Pas encore de fiche de salaire suisse ?** Certains bailleurs côté France évaluent ton contrat plutôt que ton passé : chez La Villa Coliving, le dossier tient en trois pièces (contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges) et un garant n'est demandé qu'au cas par cas, quand le contrat ne couvre pas le loyer — on t'en parle avant de te répondre, jamais après la visite.

Le bon réflexe n'est pas de comparer les loyers nus$r$ IN content_fr) > 0
      AND position($f$un loyer de 1 370 CHF équivaut à de 1 490 à 1 540 € : c'est le loyer contractuel, libellé en euros$f$ IN content_fr) = 0
      AND position($f$Faites le calcul :$f$ IN content_fr) = 0
      AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0)
    WHEN 'choc-culturel-franco-suisse-expatrie-geneve' THEN (position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0)
    WHEN 'colocation-annemasse-ville-la-grand-ambilly' THEN (position($f$## Où chercher : les bons sites

**Leboncoin** : C'est le classique français. Beaucoup d'annonces, mais aussi beaucoup de pollution (arnaqueurs, arnaques). Filtre par localisation (Annemasse, Ville-la-Grand), par prix (900-1300 CHF), par "meublé". Vérifie toujours le numéro de téléphone : si c'est un numéro fictif ou bizarre, c'est une arnaque.

**Airbnb (long-term)** : Oui, sérieusement. Les propriétaires sur Airbnb sont généralement moins arnaqueurs (système d'avis). Les prix sont un peu plus hauts (10-15%), mais c'est plus sûr pour le premier mois. Cherche "monthly stays" à moins de 1300 EUR.

**Anibis** : Suisse/France frontière. Moins connu mais sérieux. Annonces souvent de quality supérieure.

**Facebook groupes** : Il y a environ 15-20 groupes "Cherche colocataire Genève/Annemasse/Ville-la-Grand". Demande adhésion, puis poste "Je cherche chambre...". Réponses en 24-48h souvent. C'est très local, très actif, pas mal honnête.

## Les bonnes zones$f$ IN content_fr) = 0
      AND position($r$**Annemasse centre (près de la gare)** : Prix : 1000-1400 CHF. Vibrant, commerces, bars. Transports au top. Malus : plus cher, plus bruyant. À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$r$ IN content_fr) > 0
      AND position($f$Toujours 10 min à pied de la gare, plus d'espaces verts et plus familial.$f$ IN content_fr) = 0
      AND position($r$**Ambilly** : Prix : 850-1150 CHF. Très résidentiel et assez haut de gamme en fonction des quartiers. À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.$r$ IN content_fr) > 0
      AND position($f$| Coliving premium tout compris | 1 370 CHF/mois |$f$ IN content_fr) = 0)
    WHEN 'cout-de-la-vie-suisse-france-frontalier-2026' THEN (position($f$| − Logement (T2 ou coliving tout inclus) | −1 100 à −1 400 CHF |$f$ IN content_fr) = 0
      AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0)
    WHEN 'declaration-impots-frontalier-2026' THEN (position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0)
    WHEN 'demenager-geneve-frontalier-checklist' THEN (position($f$**Garant** : Si tu n'as pas un CDI français connu, tu auras besoin d'un garant (parent, ami, quelqu'un avec un CDI et un appart). Prépare sa documentation aussi : CDI, bulletins, domicile.$f$ IN content_fr) = 0
      AND position($r$- Adresse du garant + ses documents, si on t'en demande un$r$ IN content_fr) > 0
      AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0)
    WHEN 'dossier-location-frontalier-suisse-france' THEN (position($f$[tu auras besoin d'un garant](https://www.anil.org/parole-expert-logement-location-pas-garant/). Deux options :$f$ IN content_fr) = 0
      AND position($r$**Garantme ou Cautioneo** : des services payants (3-4 % du loyer annuel) qui se portent garants pour toi. Particulièrement utile si tu n'as pas de garant en France.

**Le coliving** : Pas encore de fiche de salaire suisse ? Certains bailleurs côté France évaluent ton contrat plutôt que ton passé : chez La Villa Coliving, le dossier tient en trois pièces (contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges) et un garant n'est demandé qu'au cas par cas, quand le contrat ne couvre pas le loyer — on t'en parle avant de te répondre, jamais après la visite.$r$ IN content_fr) > 0
      AND position($f$## L'alternative coliving : zéro dossier, zéro galère$f$ IN content_fr) = 0)
    WHEN 'ecole-internationale-geneve-frontalier-ou-habiter' THEN (position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0)
    WHEN 'fiscalite-frontalier-geneve-impots-2026' THEN (position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0)
    WHEN 'grand-geneve-2026-nouveautes-frontaliers' THEN (position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0)
    WHEN 'guide-ressources-frontalier-geneve' THEN (position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0)
    WHEN 'living-in-france-working-in-geneva' THEN (position($f$Pas de garantie bancaire farfelue, pas de 10 justificatifs de revenu : un contrat de travail ou une promesse d'embauche suffit, un garant seulement au cas par cas.$f$ IN content_fr) = 0
      AND position($f$= 1 380 EUR.$f$ IN content_fr) = 0
      AND position($f$Voici ce qu'on recommande aux 50+ personnes qui arrivent chaque année chez nous.$f$ IN content_fr) = 0
      AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0)
    WHEN 'optimiser-espace-coliving-productivite-bien-etre' THEN (position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0)
    WHEN 'organisations-internationales-geneve-ou-habiter' THEN (position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0)
    WHEN 'ou-habiter-frontalier-suisse-villes-france-pas-cher' THEN (position($f$C'est ici qu'on a installé La Villa Coliving — pour de bonnes raisons.$f$ IN content_fr) = 0
      AND position($r$Le revers : les prix grimpent vite et le centre est bondé aux heures de pointe.

À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$r$ IN content_fr) > 0
      AND position($r$Position centrale, juste entre Annemasse et la frontière suisse.

À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.$r$ IN content_fr) > 0
      AND position($f$- **Sans bail, tout inclus** : coliving à Ville-la-Grand$f$ IN content_fr) = 0
      AND position($f$frontaliers qui veulent du calme à 15 minutes du bureau.$f$ IN content_fr) = 0
      AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0)
    WHEN 'permis-g-frontalier-geneve' THEN (position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0)
    WHEN 'quartiers-annemasse-ou-vivre-selon-profil' THEN (position($f$Tu marches à la gare en moins de 10 minutes, tu oublies la voiture et les bouchons de la douane. C'est précisément là qu'est posé notre [Lodge, à Romagny — à 9 minutes à pied de la gare](/lelodge).$f$ IN content_fr) = 0
      AND position($f$on rejoint la gare du Léman Express à pied en moins de 10 minutes. Idéal pour un frontalier qui veut vivre sans voiture.$f$ IN content_fr) = 0)
    WHEN 'quitter-son-logement-guide-pratique' THEN (position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0)
    WHEN 'salaire-suisse-net-frontalier-2026' THEN (position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0)
    WHEN 'se-faire-reseau-geneve-arriver-seul' THEN (position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0)
    WHEN 'teletravail-frontalier-geneve-regles-2026' THEN (position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0)
    WHEN 'trouver-colocation-geneve-frontalier' THEN (position($f$## Où chercher concrètement ?

Plusieurs pistes, avec leurs avantages et leurs limites :
- les **groupes Facebook frontaliers** (très actifs, mais premier arrivé premier servi) ;
- les sites d'annonces (leboncoin, etc.) — beaucoup d'offres, mais à filtrer ;
- les **agences immobilières** françaises [(sérieuses, mais frais de dossier et dossier lourd)](https://www.anil.org/) ;
- les **opérateurs de coliving**, [qui gèrent tout de A à Z](/blog/coliving-colocation-ou-studio-geneve-comparatif) (chambre meublée, charges, communauté).

## Comment éviter les arnaques ?$f$ IN content_fr) = 0
      AND position($f$Bonne nouvelle : en coliving, le dossier est simplifié — contrat de travail ou promesse d'embauche, garant seulement au cas par cas.$f$ IN content_fr) = 0
      AND position($f$- Cherche sur les groupes frontaliers, les annonces, les agences ou les opérateurs de coliving.$f$ IN content_fr) = 0
      AND position($f$de 600 à 900 € en location classique$f$ IN content_fr) = 0
      AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0)
    WHEN 'vie-quotidienne-frontalier-courses-sport-sorties' THEN (position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0)
  END AS fr_ok,
  CASE slug
    WHEN 'allocations-familiales-frontalier-geneve-2026' THEN (position($f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$ IN content_en) = 0
      AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0)
    WHEN 'arnaques-logement-frontalier-geneve-eviter' THEN (position($f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$ IN content_en) = 0
      AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0)
    WHEN 'assurance-sante-frontalier-lamal-cmu-budget' THEN (position($f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$ IN content_en) = 0
      AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0)
    WHEN 'avenant-fiscal-40-frontalier-geneve' THEN (position($f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$ IN content_en) = 0
      AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0)
    WHEN 'banque-telephone-internet-frontalier-bons-plans' THEN (position($f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$ IN content_en) = 0
      AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0)
    WHEN 'budget-colocation-geneve-guide-complet' THEN (position($f$| Premium coliving all-inclusive | — | — | 1,370 CHF |$f$ IN content_en) = 0
      AND position($r$**The gap is brutal.** A studio in central Geneva costs an average of 1,600 CHF/month — utilities extra. The same space on the French side? 800 €, or about 800 CHF. Do the math: **that's nearly 10,000 CHF saved per year**, just on rent.

Coliving room on the French side: CHF 1,370 to 1,430 all inclusive at La Villa Coliving (bills, fibre, cleaning, pool, sauna and gym included, no application fee).$r$ IN content_en) > 0
      AND position($f$| **Ville-la-Grand** | 700–950 € | 900–1,200 € | 500–700 € | 1,370 CHF |$f$ IN content_en) = 0
      AND position($f$| **Ambilly** | 700–1,000 € | 900–1,250 € | 500–750 € | 1,370 CHF |$f$ IN content_en) = 0
      AND position($f$| **Annemasse station (Léman Express)** | 850–1,150 € | 1,000–1,350 € | 600–800 € | — |$f$ IN content_en) = 0
      AND position($r$

**No Swiss payslip yet?** Some landlords on the French side assess your contract rather than your history: at La Villa Coliving the file comes down to three items (a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills) and a guarantor is only asked for case by case, when the contract does not cover the rent — we tell you before we reply, never after the visit.

The right reflex is not to compare bare rents$r$ IN content_en) > 0
      AND position($f$a 1,370 CHF rent is worth roughly 1,480-1,530 € depending on the current rate$f$ IN content_en) = 0
      AND position($f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$ IN content_en) = 0
      AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0)
    WHEN 'choc-culturel-franco-suisse-expatrie-geneve' THEN (position($f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$ IN content_en) = 0
      AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0)
    WHEN 'coliving-annemasse-geneve-frontaliers-avantages' THEN (position($f$**Looking for [La Villa Coliving, French side](/colocation-geneve) or [in Annemasse](/annemasse-colocation)?**$f$ IN content_en) = 0
      AND position($f$see also our [rooms for rent in Annemasse](/chambre-a-louer-annemasse). No application fee.$f$ IN content_en) = 0)
    WHEN 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie' THEN (position($f$No French guarantor to find, no electricity and internet contracts to open, no furniture to buy then resell when you leave.$f$ IN content_en) = 0)
    WHEN 'colocation-annemasse-ville-la-grand-ambilly' THEN (position($f$## Where to Search: Best Sites

**Leboncoin**: France's largest classified-ads website, where locals sell everything from sofas to cars and where most private landlords advertise their rooms. You'll find the most listings there, but also the most scams. Search by town (Annemasse, Ville-la-Grand), set your budget and tick "meublé" (furnished). Always check the phone number: if it looks fake or odd, walk away.

**Airbnb (long-term)**: Seriously. Airbnb landlords are usually less crooked (review system). Prices ~10-15% higher, but safer first month. Search "monthly stays" under 1300 EUR.

**Flatshare platforms**: specialised in shared housing. Less noise than Leboncoin. Bonus: landlord and roommate ratings.

**Anibis**: Swiss/French border. Less known but serious. Often higher quality listings.

**Facebook groups**: ~15-20 groups "Looking for roommate Geneva/Annemasse/Ville-la-Grand." Request membership, post "Looking for room..." Responses in 24-48h often. Very local, active, fairly honest.

## Best Zones$f$ IN content_en) = 0
      AND position($r$**Annemasse center (near station)**: Price: 1000-1400 CHF. Vibrant, shops, bars. Transport top-notch. Downside: pricier, louder. In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$r$ IN content_en) > 0
      AND position($f$Also 10 min on foot from the station, more green space and more family-friendly.$f$ IN content_en) = 0
      AND position($r$**Ambilly**: Price: 850-1150 CHF. Very residential and fairly upscale depending on the neighbourhood. In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door.$r$ IN content_en) > 0
      AND position($f$| All-inclusive premium coliving | 1,370 CHF/month |$f$ IN content_en) = 0
      AND position($f$**Looking for [see our rooms on the French side](/colocation-geneve) or [in Annemasse](/annemasse-colocation)?**$f$ IN content_en) = 0
      AND position($f$see also our [rooms for rent in Annemasse](/chambre-a-louer-annemasse). No application fee.$f$ IN content_en) = 0)
    WHEN 'cout-de-la-vie-suisse-france-frontalier-2026' THEN (position($f$| − Housing (2-room or all-inclusive coliving) | −1,100 to −1,400 CHF |$f$ IN content_en) = 0
      AND position($f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$ IN content_en) = 0
      AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0)
    WHEN 'declaration-impots-frontalier-2026' THEN (position($f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$ IN content_en) = 0
      AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0)
    WHEN 'demenager-geneve-frontalier-checklist' THEN (position($f$**Guarantor**: If you don't have a known French permanent job, you'll need a guarantor (parent, friend, someone with permanent employment and an apartment). Prepare their documents too.$f$ IN content_en) = 0
      AND position($r$- Guarantor address + documents, if one is asked of you$r$ IN content_en) > 0
      AND position($f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$ IN content_en) = 0
      AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0)
    WHEN 'dossier-location-frontalier-suisse-france' THEN (position($f$[you'll need a guarantor](https://www.anil.org/parole-expert-logement-location-pas-garant/). Two options:$f$ IN content_en) = 0
      AND position($r$**Garantme or Cautioneo**: paid services (3-4% of annual rent) that act as guarantors for you. Particularly useful if you don't have a guarantor in France.

**Coliving**: No Swiss payslip yet? Some landlords on the French side assess your contract rather than your history: at La Villa Coliving the file comes down to three items (a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills) and a guarantor is only asked for case by case, when the contract does not cover the rent — we tell you before we reply, never after the visit.$r$ IN content_en) > 0
      AND position($f$accepts cross-border workers with no French guarantor — furnished all-inclusive rooms$f$ IN content_en) = 0
      AND position($f$## The Coliving Alternative: Zero Hassle$f$ IN content_en) = 0)
    WHEN 'ecole-internationale-geneve-frontalier-ou-habiter' THEN (position($f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$ IN content_en) = 0
      AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0)
    WHEN 'fiscalite-frontalier-geneve-impots-2026' THEN (position($f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$ IN content_en) = 0
      AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0)
    WHEN 'grand-geneve-2026-nouveautes-frontaliers' THEN (position($f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$ IN content_en) = 0
      AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0)
    WHEN 'guide-ressources-frontalier-geneve' THEN (position($f$No French guarantor? The **[Visale](https://www.visale.fr)** guarantee$f$ IN content_en) = 0
      AND position($f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$ IN content_en) = 0
      AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0)
    WHEN 'living-in-france-working-in-geneva' THEN (position($f$No outrageous bank guarantees, no French guarantor if you're foreign, no 10 income proofs.$f$ IN content_en) = 0
      AND position($f$= €1,380.$f$ IN content_en) = 0
      AND position($f$Here's our advice for the 50+ people arriving annually.$f$ IN content_en) = 0
      AND position($f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$ IN content_en) = 0
      AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0)
    WHEN 'optimiser-espace-coliving-productivite-bien-etre' THEN (position($f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$ IN content_en) = 0
      AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0)
    WHEN 'organisations-internationales-geneve-ou-habiter' THEN (position($f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$ IN content_en) = 0
      AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0)
    WHEN 'ou-habiter-frontalier-suisse-villes-france-pas-cher' THEN (position($f$This is where we built La Villa Coliving — for good reasons.$f$ IN content_en) = 0
      AND position($r$Downside: prices climb fast and the center is packed at peak hours.

In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$r$ IN content_en) > 0
      AND position($r$Central location, right between Annemasse and the Swiss border.

In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door.$r$ IN content_en) > 0
      AND position($f$- **No lease, all-inclusive**: coliving in Ville-la-Grand$f$ IN content_en) = 0
      AND position($f$cross-border workers who want quiet 15 minutes from the office.$f$ IN content_en) = 0
      AND position($f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$ IN content_en) = 0
      AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0)
    WHEN 'permis-g-frontalier-geneve' THEN (position($f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$ IN content_en) = 0
      AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0)
    WHEN 'quartiers-annemasse-ou-vivre-selon-profil' THEN (position($f$You walk to the station in under 10 minutes, forget the car and the customs jams. That's exactly where our [Lodge, in Romagny — 9 minutes' walk from the station](/en/lelodge), sits.$f$ IN content_en) = 0
      AND position($f$the Léman Express station is under 10 minutes' walk. Ideal for a car-free commuter.$f$ IN content_en) = 0)
    WHEN 'quitter-son-logement-guide-pratique' THEN (position($f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$ IN content_en) = 0
      AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0)
    WHEN 'salaire-suisse-net-frontalier-2026' THEN (position($f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$ IN content_en) = 0
      AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0)
    WHEN 'se-faire-reseau-geneve-arriver-seul' THEN (position($f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$ IN content_en) = 0
      AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0)
    WHEN 'teletravail-frontalier-geneve-regles-2026' THEN (position($f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$ IN content_en) = 0
      AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0)
    WHEN 'trouver-colocation-geneve-frontalier' THEN (position($f$## Where to actually look?

Several options, each with pros and cons:
- **cross-border Facebook groups** (very active, but first come first served);
- listings sites (leboncoin, etc.) — many offers, but filter carefully;
- French **real estate agencies** [(serious, but application fees and heavy files)](https://www.anil.org/);
- **coliving operators**, [who handle everything end to end](/en/blog/coliving-colocation-ou-studio-geneve-comparatif) (furnished room, utilities, community).

## How to avoid scams?$f$ IN content_en) = 0
      AND position($f$Good news: in coliving, the application is simplified — **[no French guarantor required](https://www.service-public.gouv.fr/particuliers/vosdroits/F34661?lang=en)**.$f$ IN content_en) = 0
      AND position($f$- In coliving, **no French guarantor** and everything is included.$f$ IN content_en) = 0
      AND position($f$- Look on cross-border groups, listings, agencies or coliving operators.$f$ IN content_en) = 0
      AND position($f$from €600 to €900 in a classic rental$f$ IN content_en) = 0
      AND position($f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$ IN content_en) = 0
      AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0)
    WHEN 'vie-quotidienne-frontalier-courses-sport-sorties' THEN (position($f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$ IN content_en) = 0
      AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0)
  END AS en_ok
FROM blog_posts
WHERE slug IN ('allocations-familiales-frontalier-geneve-2026', 'arnaques-logement-frontalier-geneve-eviter', 'assurance-sante-frontalier-lamal-cmu-budget', 'avenant-fiscal-40-frontalier-geneve', 'banque-telephone-internet-frontalier-bons-plans', 'budget-colocation-geneve-guide-complet', 'choc-culturel-franco-suisse-expatrie-geneve', 'coliving-annemasse-geneve-frontaliers-avantages', 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie', 'colocation-annemasse-ville-la-grand-ambilly', 'cout-de-la-vie-suisse-france-frontalier-2026', 'declaration-impots-frontalier-2026', 'demenager-geneve-frontalier-checklist', 'dossier-location-frontalier-suisse-france', 'ecole-internationale-geneve-frontalier-ou-habiter', 'fiscalite-frontalier-geneve-impots-2026', 'grand-geneve-2026-nouveautes-frontaliers', 'guide-ressources-frontalier-geneve', 'living-in-france-working-in-geneva', 'optimiser-espace-coliving-productivite-bien-etre', 'organisations-internationales-geneve-ou-habiter', 'ou-habiter-frontalier-suisse-villes-france-pas-cher', 'permis-g-frontalier-geneve', 'quartiers-annemasse-ou-vivre-selon-profil', 'quitter-son-logement-guide-pratique', 'salaire-suisse-net-frontalier-2026', 'se-faire-reseau-geneve-arriver-seul', 'teletravail-frontalier-geneve-regles-2026', 'trouver-colocation-geneve-frontalier', 'vie-quotidienne-frontalier-courses-sport-sorties')
ORDER BY slug;

-- ── Retour arrière (inverse exact, mêmes gardes miroir) : retirer les deux lignes /* et */ puis exécuter le bloc.
/*
BEGIN;

UPDATE blog_posts
SET content_en = replace(content_en, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$),
    updated_at = now()
WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties'
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) > 0
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$),
    updated_at = now()
WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties'
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) > 0
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) > 0
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) > 0
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) > 0
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) > 0
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$),
    updated_at = now()
WHERE slug = 'se-faire-reseau-geneve-arriver-seul'
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) > 0
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$),
    updated_at = now()
WHERE slug = 'se-faire-reseau-geneve-arriver-seul'
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) > 0
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) > 0
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) > 0
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$),
    updated_at = now()
WHERE slug = 'quitter-son-logement-guide-pratique'
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) > 0
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$),
    updated_at = now()
WHERE slug = 'quitter-son-logement-guide-pratique'
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) > 0
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$),
    updated_at = now()
WHERE slug = 'permis-g-frontalier-geneve'
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) > 0
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$),
    updated_at = now()
WHERE slug = 'permis-g-frontalier-geneve'
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) > 0
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) > 0
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) > 0
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) > 0
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) > 0
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$),
    updated_at = now()
WHERE slug = 'optimiser-espace-coliving-productivite-bien-etre'
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) > 0
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$),
    updated_at = now()
WHERE slug = 'optimiser-espace-coliving-productivite-bien-etre'
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) > 0
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) > 0
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) > 0
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) > 0
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) > 0
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$),
    updated_at = now()
WHERE slug = 'grand-geneve-2026-nouveautes-frontaliers'
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) > 0
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$),
    updated_at = now()
WHERE slug = 'grand-geneve-2026-nouveautes-frontaliers'
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) > 0
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) > 0
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) > 0
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$),
    updated_at = now()
WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) > 0
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$),
    updated_at = now()
WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) > 0
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$),
    updated_at = now()
WHERE slug = 'demenager-geneve-frontalier-checklist'
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) > 0
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$),
    updated_at = now()
WHERE slug = 'demenager-geneve-frontalier-checklist'
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) > 0
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$),
    updated_at = now()
WHERE slug = 'declaration-impots-frontalier-2026'
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) > 0
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$),
    updated_at = now()
WHERE slug = 'declaration-impots-frontalier-2026'
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) > 0
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) > 0
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) > 0
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$),
    updated_at = now()
WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve'
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) > 0
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$),
    updated_at = now()
WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve'
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) > 0
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) > 0
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) > 0
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$),
    updated_at = now()
WHERE slug = 'banque-telephone-internet-frontalier-bons-plans'
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) > 0
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$),
    updated_at = now()
WHERE slug = 'banque-telephone-internet-frontalier-bons-plans'
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) > 0
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$),
    updated_at = now()
WHERE slug = 'avenant-fiscal-40-frontalier-geneve'
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) > 0
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$),
    updated_at = now()
WHERE slug = 'avenant-fiscal-40-frontalier-geneve'
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) > 0
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) > 0
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) > 0
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) > 0
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) > 0
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$, $f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$),
    updated_at = now()
WHERE slug = 'allocations-familiales-frontalier-geneve-2026'
  AND position($r$no application fee. Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre.$r$ IN content_en) > 0
  AND position($f$no application fee — 15-20 minutes from Geneva by Léman Express or tram.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$, $f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$),
    updated_at = now()
WHERE slug = 'allocations-familiales-frontalier-geneve-2026'
  AND position($r$sans frais de dossier. Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre.$r$ IN content_fr) > 0
  AND position($f$sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$, $f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$),
    updated_at = now()
WHERE slug = 'vie-quotidienne-frontalier-courses-sport-sorties'
  AND position($r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$ IN content_en) > 0
  AND position($f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$, $f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$ IN content_en) > 0
  AND position($f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$, $f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$),
    updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND position($r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$ IN content_en) > 0
  AND position($f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$, $f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$),
    updated_at = now()
WHERE slug = 'se-faire-reseau-geneve-arriver-seul'
  AND position($r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$ IN content_en) > 0
  AND position($f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$, $f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$ IN content_en) > 0
  AND position($f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$, $f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$),
    updated_at = now()
WHERE slug = 'quitter-son-logement-guide-pratique'
  AND position($r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$ IN content_en) > 0
  AND position($f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$, $f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$),
    updated_at = now()
WHERE slug = 'permis-g-frontalier-geneve'
  AND position($r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$ IN content_en) > 0
  AND position($f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$, $f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$ IN content_en) > 0
  AND position($f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$, $f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$),
    updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter'
  AND position($r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$ IN content_en) > 0
  AND position($f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$, $f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$),
    updated_at = now()
WHERE slug = 'optimiser-espace-coliving-productivite-bien-etre'
  AND position($r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$ IN content_en) > 0
  AND position($f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$, $f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($r$**Looking for [shared housing near Geneva](/en/colocation-geneve)?**$r$ IN content_en) > 0
  AND position($f$**Looking for [shared housing near Geneva](/colocation-geneve)?**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$, $f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$ IN content_en) > 0
  AND position($f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$, $f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$),
    updated_at = now()
WHERE slug = 'grand-geneve-2026-nouveautes-frontaliers'
  AND position($r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$ IN content_en) > 0
  AND position($f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$, $f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$ IN content_en) > 0
  AND position($f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$, $f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$),
    updated_at = now()
WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
  AND position($r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$ IN content_en) > 0
  AND position($f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$, $f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$),
    updated_at = now()
WHERE slug = 'demenager-geneve-frontalier-checklist'
  AND position($r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$ IN content_en) > 0
  AND position($f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$, $f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$),
    updated_at = now()
WHERE slug = 'declaration-impots-frontalier-2026'
  AND position($r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$ IN content_en) > 0
  AND position($f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$, $f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$**Looking for [a room on the French side](/en/colocation-geneve)?**$r$ IN content_en) > 0
  AND position($f$**Looking for [see our rooms on the French side](/colocation-geneve)?**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve)?**$r$, $f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$),
    updated_at = now()
WHERE slug = 'choc-culturel-franco-suisse-expatrie-geneve'
  AND position($r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve)?**$r$ IN content_en) > 0
  AND position($f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve)?**$r$, $f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve)?**$r$ IN content_en) > 0
  AND position($f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve)?**$r$, $f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$),
    updated_at = now()
WHERE slug = 'banque-telephone-internet-frontalier-bons-plans'
  AND position($r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve)?**$r$ IN content_en) > 0
  AND position($f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve)?**$r$, $f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$),
    updated_at = now()
WHERE slug = 'avenant-fiscal-40-frontalier-geneve'
  AND position($r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve)?**$r$ IN content_en) > 0
  AND position($f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve)?**$r$, $f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$),
    updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND position($r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve)?**$r$ IN content_en) > 0
  AND position($f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve)?**$r$, $f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$),
    updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter'
  AND position($r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve)?**$r$ IN content_en) > 0
  AND position($f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve)?**$r$, $f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$),
    updated_at = now()
WHERE slug = 'allocations-familiales-frontalier-geneve-2026'
  AND position($r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve)?**$r$ IN content_en) > 0
  AND position($f$**Looking for [La Villa Coliving, French side](/colocation-geneve)?**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$see also our [rooms for rent in Annemasse](/en/chambre-a-louer-annemasse). No application fee.$r$, $f$see also our [rooms for rent in Annemasse](/chambre-a-louer-annemasse). No application fee.$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$see also our [rooms for rent in Annemasse](/en/chambre-a-louer-annemasse). No application fee.$r$ IN content_en) > 0
  AND position($f$see also our [rooms for rent in Annemasse](/chambre-a-louer-annemasse). No application fee.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Looking for [a room on the French side](/en/colocation-geneve) or [in Annemasse](/en/annemasse-colocation)?**$r$, $f$**Looking for [see our rooms on the French side](/colocation-geneve) or [in Annemasse](/annemasse-colocation)?**$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$**Looking for [a room on the French side](/en/colocation-geneve) or [in Annemasse](/en/annemasse-colocation)?**$r$ IN content_en) > 0
  AND position($f$**Looking for [see our rooms on the French side](/colocation-geneve) or [in Annemasse](/annemasse-colocation)?**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$see also our [rooms for rent in Annemasse](/en/chambre-a-louer-annemasse). No application fee.$r$, $f$see also our [rooms for rent in Annemasse](/chambre-a-louer-annemasse). No application fee.$f$),
    updated_at = now()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages'
  AND position($r$see also our [rooms for rent in Annemasse](/en/chambre-a-louer-annemasse). No application fee.$r$ IN content_en) > 0
  AND position($f$see also our [rooms for rent in Annemasse](/chambre-a-louer-annemasse). No application fee.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve) or [in Annemasse](/en/annemasse-colocation)?**$r$, $f$**Looking for [La Villa Coliving, French side](/colocation-geneve) or [in Annemasse](/annemasse-colocation)?**$f$),
    updated_at = now()
WHERE slug = 'coliving-annemasse-geneve-frontaliers-avantages'
  AND position($r$**Looking for [La Villa Coliving, French side](/en/colocation-geneve) or [in Annemasse](/en/annemasse-colocation)?**$r$ IN content_en) > 0
  AND position($f$**Looking for [La Villa Coliving, French side](/colocation-geneve) or [in Annemasse](/annemasse-colocation)?**$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$No guarantor in France? The **[Visale](https://www.visale.fr)** guarantee$r$, $f$No French guarantor? The **[Visale](https://www.visale.fr)** guarantee$f$),
    updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND position($r$No guarantor in France? The **[Visale](https://www.visale.fr)** guarantee$r$ IN content_en) > 0
  AND position($f$No French guarantor? The **[Visale](https://www.visale.fr)** guarantee$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$No electricity and internet contracts to open, no furniture to buy then resell when you leave.$r$, $f$No French guarantor to find, no electricity and internet contracts to open, no furniture to buy then resell when you leave.$f$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($r$No electricity and internet contracts to open, no furniture to buy then resell when you leave.$r$ IN content_en) > 0
  AND position($f$No French guarantor to find, no electricity and internet contracts to open, no furniture to buy then resell when you leave.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$## The Coliving Alternative: A Three-Document File$r$, $f$## The Coliving Alternative: Zero Hassle$f$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($r$## The Coliving Alternative: A Three-Document File$r$ IN content_en) > 0
  AND position($f$## The Coliving Alternative: Zero Hassle$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$## L'alternative coliving : un dossier en trois pièces$r$, $f$## L'alternative coliving : zéro dossier, zéro galère$f$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($r$## L'alternative coliving : un dossier en trois pièces$r$ IN content_fr) > 0
  AND position($f$## L'alternative coliving : zéro dossier, zéro galère$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$accepts cross-border workers on the basis of their employment contract — furnished all-inclusive rooms$r$, $f$accepts cross-border workers with no French guarantor — furnished all-inclusive rooms$f$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($r$accepts cross-border workers on the basis of their employment contract — furnished all-inclusive rooms$r$ IN content_en) > 0
  AND position($f$accepts cross-border workers with no French guarantor — furnished all-inclusive rooms$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Garantme or Cautioneo**: paid services (3-4% of annual rent) that act as guarantors for you. Particularly useful if you don't have a guarantor in France.

**Coliving**: No Swiss payslip yet? Some landlords on the French side assess your contract rather than your history: at La Villa Coliving the file comes down to three items (a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills) and a guarantor is only asked for case by case, when the contract does not cover the rent — we tell you before we reply, never after the visit.$r$, $f$**Garantme or Cautioneo**: paid services (3-4% of annual rent) that act as guarantors for you. Particularly useful if you don't have a guarantor in France.$f$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($r$**Garantme or Cautioneo**: paid services (3-4% of annual rent) that act as guarantors for you. Particularly useful if you don't have a guarantor in France.

**Coliving**: No Swiss payslip yet? Some landlords on the French side assess your contract rather than your history: at La Villa Coliving the file comes down to three items (a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills) and a guarantor is only asked for case by case, when the contract does not cover the rent — we tell you before we reply, never after the visit.$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$**Garantme ou Cautioneo** : des services payants (3-4 % du loyer annuel) qui se portent garants pour toi. Particulièrement utile si tu n'as pas de garant en France.

**Le coliving** : Pas encore de fiche de salaire suisse ? Certains bailleurs côté France évaluent ton contrat plutôt que ton passé : chez La Villa Coliving, le dossier tient en trois pièces (contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges) et un garant n'est demandé qu'au cas par cas, quand le contrat ne couvre pas le loyer — on t'en parle avant de te répondre, jamais après la visite.$r$, $f$**Garantme ou Cautioneo** : des services payants (3-4 % du loyer annuel) qui se portent garants pour toi. Particulièrement utile si tu n'as pas de garant en France.$f$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($r$**Garantme ou Cautioneo** : des services payants (3-4 % du loyer annuel) qui se portent garants pour toi. Particulièrement utile si tu n'as pas de garant en France.

**Le coliving** : Pas encore de fiche de salaire suisse ? Certains bailleurs côté France évaluent ton contrat plutôt que ton passé : chez La Villa Coliving, le dossier tient en trois pièces (contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges) et un garant n'est demandé qu'au cas par cas, quand le contrat ne couvre pas le loyer — on t'en parle avant de te répondre, jamais après la visite.$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$[most landlords will ask for a guarantor](https://www.anil.org/parole-expert-logement-location-pas-garant/). The options:$r$, $f$[you'll need a guarantor](https://www.anil.org/parole-expert-logement-location-pas-garant/). Two options:$f$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($r$[most landlords will ask for a guarantor](https://www.anil.org/parole-expert-logement-location-pas-garant/). The options:$r$ IN content_en) > 0
  AND position($f$[you'll need a guarantor](https://www.anil.org/parole-expert-logement-location-pas-garant/). Two options:$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$[la plupart des bailleurs te demanderont un garant](https://www.anil.org/parole-expert-logement-location-pas-garant/). Les options :$r$, $f$[tu auras besoin d'un garant](https://www.anil.org/parole-expert-logement-location-pas-garant/). Deux options :$f$),
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND position($r$[la plupart des bailleurs te demanderont un garant](https://www.anil.org/parole-expert-logement-location-pas-garant/). Les options :$r$ IN content_fr) > 0
  AND position($f$[tu auras besoin d'un garant](https://www.anil.org/parole-expert-logement-location-pas-garant/). Deux options :$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$| All-inclusive premium coliving | 1,370 – 1,430 CHF/month |$r$, $f$| All-inclusive premium coliving | 1,370 CHF/month |$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$| All-inclusive premium coliving | 1,370 – 1,430 CHF/month |$r$ IN content_en) > 0
  AND position($f$| All-inclusive premium coliving | 1,370 CHF/month |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$| Coliving premium tout compris | 1 370 – 1 430 CHF/mois |$r$, $f$| Coliving premium tout compris | 1 370 CHF/mois |$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$| Coliving premium tout compris | 1 370 – 1 430 CHF/mois |$r$ IN content_fr) > 0
  AND position($f$| Coliving premium tout compris | 1 370 CHF/mois |$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Ambilly**: Price: 850-1150 CHF. Very residential and fairly upscale depending on the neighbourhood. In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door.$r$, $f$**Ambilly**: Price: 850-1150 CHF. Very residential and fairly upscale depending on the neighbourhood.$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$**Ambilly**: Price: 850-1150 CHF. Very residential and fairly upscale depending on the neighbourhood. In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door.$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$**Ambilly** : Prix : 850-1150 CHF. Très résidentiel et assez haut de gamme en fonction des quartiers. À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.$r$, $f$**Ambilly** : Prix : 850-1150 CHF. Très résidentiel et assez haut de gamme en fonction des quartiers.$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$**Ambilly** : Prix : 850-1150 CHF. Très résidentiel et assez haut de gamme en fonction des quartiers. À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$More green space and more family-friendly. In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 14-minute walk from Annemasse station — Geneva Eaux-Vives in 22 minutes door to door.$r$, $f$Also 10 min on foot from the station, more green space and more family-friendly.$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$More green space and more family-friendly. In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 14-minute walk from Annemasse station — Geneva Eaux-Vives in 22 minutes door to door.$r$ IN content_en) > 0
  AND position($f$Also 10 min on foot from the station, more green space and more family-friendly.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Plus d'espaces verts et plus familial. À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 14 min à pied de la gare d'Annemasse — Genève-Eaux-Vives en 22 min porte-à-porte.$r$, $f$Toujours 10 min à pied de la gare, plus d'espaces verts et plus familial.$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$Plus d'espaces verts et plus familial. À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 14 min à pied de la gare d'Annemasse — Genève-Eaux-Vives en 22 min porte-à-porte.$r$ IN content_fr) > 0
  AND position($f$Toujours 10 min à pied de la gare, plus d'espaces verts et plus familial.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Annemasse center (near station)**: Price: 1000-1400 CHF. Vibrant, shops, bars. Transport top-notch. Downside: pricier, louder. In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$r$, $f$**Annemasse center (near station)**: Price: 1000-1400 CHF. Vibrant, shops, bars. Transport top-notch. Downside: pricier, louder.$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$**Annemasse center (near station)**: Price: 1000-1400 CHF. Vibrant, shops, bars. Transport top-notch. Downside: pricier, louder. In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$**Annemasse centre (près de la gare)** : Prix : 1000-1400 CHF. Vibrant, commerces, bars. Transports au top. Malus : plus cher, plus bruyant. À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$r$, $f$**Annemasse centre (près de la gare)** : Prix : 1000-1400 CHF. Vibrant, commerces, bars. Transports au top. Malus : plus cher, plus bruyant.$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$**Annemasse centre (près de la gare)** : Prix : 1000-1400 CHF. Vibrant, commerces, bars. Transports au top. Malus : plus cher, plus bruyant. À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$## Best Zones$r$, $f$## Where to Search: Best Sites

**Leboncoin**: France's largest classified-ads website, where locals sell everything from sofas to cars and where most private landlords advertise their rooms. You'll find the most listings there, but also the most scams. Search by town (Annemasse, Ville-la-Grand), set your budget and tick "meublé" (furnished). Always check the phone number: if it looks fake or odd, walk away.

**Airbnb (long-term)**: Seriously. Airbnb landlords are usually less crooked (review system). Prices ~10-15% higher, but safer first month. Search "monthly stays" under 1300 EUR.

**Flatshare platforms**: specialised in shared housing. Less noise than Leboncoin. Bonus: landlord and roommate ratings.

**Anibis**: Swiss/French border. Less known but serious. Often higher quality listings.

**Facebook groups**: ~15-20 groups "Looking for roommate Geneva/Annemasse/Ville-la-Grand." Request membership, post "Looking for room..." Responses in 24-48h often. Very local, active, fairly honest.

## Best Zones$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$## Best Zones$r$ IN content_en) > 0
  AND position($f$## Where to Search: Best Sites

**Leboncoin**: France's largest classified-ads website, where locals sell everything from sofas to cars and where most private landlords advertise their rooms. You'll find the most listings there, but also the most scams. Search by town (Annemasse, Ville-la-Grand), set your budget and tick "meublé" (furnished). Always check the phone number: if it looks fake or odd, walk away.

**Airbnb (long-term)**: Seriously. Airbnb landlords are usually less crooked (review system). Prices ~10-15% higher, but safer first month. Search "monthly stays" under 1300 EUR.

**Flatshare platforms**: specialised in shared housing. Less noise than Leboncoin. Bonus: landlord and roommate ratings.

**Anibis**: Swiss/French border. Less known but serious. Often higher quality listings.

**Facebook groups**: ~15-20 groups "Looking for roommate Geneva/Annemasse/Ville-la-Grand." Request membership, post "Looking for room..." Responses in 24-48h often. Very local, active, fairly honest.

## Best Zones$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$## Les bonnes zones$r$, $f$## Où chercher : les bons sites

**Leboncoin** : C'est le classique français. Beaucoup d'annonces, mais aussi beaucoup de pollution (arnaqueurs, arnaques). Filtre par localisation (Annemasse, Ville-la-Grand), par prix (900-1300 CHF), par "meublé". Vérifie toujours le numéro de téléphone : si c'est un numéro fictif ou bizarre, c'est une arnaque.

**Airbnb (long-term)** : Oui, sérieusement. Les propriétaires sur Airbnb sont généralement moins arnaqueurs (système d'avis). Les prix sont un peu plus hauts (10-15%), mais c'est plus sûr pour le premier mois. Cherche "monthly stays" à moins de 1300 EUR.

**Anibis** : Suisse/France frontière. Moins connu mais sérieux. Annonces souvent de quality supérieure.

**Facebook groupes** : Il y a environ 15-20 groupes "Cherche colocataire Genève/Annemasse/Ville-la-Grand". Demande adhésion, puis poste "Je cherche chambre...". Réponses en 24-48h souvent. C'est très local, très actif, pas mal honnête.

## Les bonnes zones$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$## Les bonnes zones$r$ IN content_fr) > 0
  AND position($f$## Où chercher : les bons sites

**Leboncoin** : C'est le classique français. Beaucoup d'annonces, mais aussi beaucoup de pollution (arnaqueurs, arnaques). Filtre par localisation (Annemasse, Ville-la-Grand), par prix (900-1300 CHF), par "meublé". Vérifie toujours le numéro de téléphone : si c'est un numéro fictif ou bizarre, c'est une arnaque.

**Airbnb (long-term)** : Oui, sérieusement. Les propriétaires sur Airbnb sont généralement moins arnaqueurs (système d'avis). Les prix sont un peu plus hauts (10-15%), mais c'est plus sûr pour le premier mois. Cherche "monthly stays" à moins de 1300 EUR.

**Anibis** : Suisse/France frontière. Moins connu mais sérieux. Annonces souvent de quality supérieure.

**Facebook groupes** : Il y a environ 15-20 groupes "Cherche colocataire Genève/Annemasse/Ville-la-Grand". Demande adhésion, puis poste "Je cherche chambre...". Réponses en 24-48h souvent. C'est très local, très actif, pas mal honnête.

## Les bonnes zones$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$the Léman Express station is about ten minutes' walk. Ideal for a car-free commuter. In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$r$, $f$the Léman Express station is under 10 minutes' walk. Ideal for a car-free commuter.$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$the Léman Express station is about ten minutes' walk. Ideal for a car-free commuter. In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$r$ IN content_en) > 0
  AND position($f$the Léman Express station is under 10 minutes' walk. Ideal for a car-free commuter.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$on rejoint la gare du Léman Express à pied en une dizaine de minutes. Idéal pour un frontalier qui veut vivre sans voiture. À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$r$, $f$on rejoint la gare du Léman Express à pied en moins de 10 minutes. Idéal pour un frontalier qui veut vivre sans voiture.$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$on rejoint la gare du Léman Express à pied en une dizaine de minutes. Idéal pour un frontalier qui veut vivre sans voiture. À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$r$ IN content_fr) > 0
  AND position($f$on rejoint la gare du Léman Express à pied en moins de 10 minutes. Idéal pour un frontalier qui veut vivre sans voiture.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$You walk to the station in about ten minutes, forget the car and the customs jams. In Annemasse itself, [Le Lodge](/en/lelodge) by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$r$, $f$You walk to the station in under 10 minutes, forget the car and the customs jams. That's exactly where our [Lodge, in Romagny — 9 minutes' walk from the station](/en/lelodge), sits.$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$You walk to the station in about ten minutes, forget the car and the customs jams. In Annemasse itself, [Le Lodge](/en/lelodge) by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$r$ IN content_en) > 0
  AND position($f$You walk to the station in under 10 minutes, forget the car and the customs jams. That's exactly where our [Lodge, in Romagny — 9 minutes' walk from the station](/en/lelodge), sits.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Tu marches à la gare en une dizaine de minutes, tu oublies la voiture et les bouchons de la douane. À Annemasse même, [Le Lodge](/lelodge) de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$r$, $f$Tu marches à la gare en moins de 10 minutes, tu oublies la voiture et les bouchons de la douane. C'est précisément là qu'est posé notre [Lodge, à Romagny — à 9 minutes à pied de la gare](/lelodge).$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$Tu marches à la gare en une dizaine de minutes, tu oublies la voiture et les bouchons de la douane. À Annemasse même, [Le Lodge](/lelodge) de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$r$ IN content_fr) > 0
  AND position($f$Tu marches à la gare en moins de 10 minutes, tu oublies la voiture et les bouchons de la douane. C'est précisément là qu'est posé notre [Lodge, à Romagny — à 9 minutes à pied de la gare](/lelodge).$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$- Guarantor address + documents, if one is asked of you$r$, $f$- Guarantor address + documents$f$),
    updated_at = now()
WHERE slug = 'demenager-geneve-frontalier-checklist'
  AND position($r$- Guarantor address + documents, if one is asked of you$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$- Adresse du garant + ses documents, si on t'en demande un$r$, $f$- Adresse du garant + ses documents$f$),
    updated_at = now()
WHERE slug = 'demenager-geneve-frontalier-checklist'
  AND position($r$- Adresse du garant + ses documents, si on t'en demande un$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Guarantor**: If you don't have a known French permanent job, a landlord will often ask for a guarantor (parent, friend, someone with permanent employment and an apartment): prepare their documents too.

No Swiss payslip yet? Some landlords on the French side assess your contract rather than your history: at La Villa Coliving the file comes down to three items (a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills) and a guarantor is only asked for case by case, when the contract does not cover the rent — we tell you before we reply, never after the visit.$r$, $f$**Guarantor**: If you don't have a known French permanent job, you'll need a guarantor (parent, friend, someone with permanent employment and an apartment). Prepare their documents too.$f$),
    updated_at = now()
WHERE slug = 'demenager-geneve-frontalier-checklist'
  AND position($r$**Guarantor**: If you don't have a known French permanent job, a landlord will often ask for a guarantor (parent, friend, someone with permanent employment and an apartment): prepare their documents too.

No Swiss payslip yet? Some landlords on the French side assess your contract rather than your history: at La Villa Coliving the file comes down to three items (a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills) and a guarantor is only asked for case by case, when the contract does not cover the rent — we tell you before we reply, never after the visit.$r$ IN content_en) > 0
  AND position($f$**Guarantor**: If you don't have a known French permanent job, you'll need a guarantor (parent, friend, someone with permanent employment and an apartment). Prepare their documents too.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$**Garant** : Si tu n'as pas un CDI français connu, un bailleur te demandera souvent un garant (parent, ami, quelqu'un avec un CDI et un appart) : prépare sa documentation aussi (CDI, bulletins, domicile).

Pas encore de fiche de salaire suisse ? Certains bailleurs côté France évaluent ton contrat plutôt que ton passé : chez La Villa Coliving, le dossier tient en trois pièces (contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges) et un garant n'est demandé qu'au cas par cas, quand le contrat ne couvre pas le loyer — on t'en parle avant de te répondre, jamais après la visite.$r$, $f$**Garant** : Si tu n'as pas un CDI français connu, tu auras besoin d'un garant (parent, ami, quelqu'un avec un CDI et un appart). Prépare sa documentation aussi : CDI, bulletins, domicile.$f$),
    updated_at = now()
WHERE slug = 'demenager-geneve-frontalier-checklist'
  AND position($r$**Garant** : Si tu n'as pas un CDI français connu, un bailleur te demandera souvent un garant (parent, ami, quelqu'un avec un CDI et un appart) : prépare sa documentation aussi (CDI, bulletins, domicile).

Pas encore de fiche de salaire suisse ? Certains bailleurs côté France évaluent ton contrat plutôt que ton passé : chez La Villa Coliving, le dossier tient en trois pièces (contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges) et un garant n'est demandé qu'au cas par cas, quand le contrat ne couvre pas le loyer — on t'en parle avant de te répondre, jamais après la visite.$r$ IN content_fr) > 0
  AND position($f$**Garant** : Si tu n'as pas un CDI français connu, tu auras besoin d'un garant (parent, ami, quelqu'un avec un CDI et un appart). Prépare sa documentation aussi : CDI, bulletins, domicile.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$| − Housing (2-room, or a coliving room on the French side — e.g. La Villa Coliving: CHF 1,370 to 1,430 all inclusive, no application fee, one month's notice) | −1,100 to −1,430 CHF |$r$, $f$| − Housing (2-room or all-inclusive coliving) | −1,100 to −1,400 CHF |$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$| − Housing (2-room, or a coliving room on the French side — e.g. La Villa Coliving: CHF 1,370 to 1,430 all inclusive, no application fee, one month's notice) | −1,100 to −1,430 CHF |$r$ IN content_en) > 0
  AND position($f$| − Housing (2-room or all-inclusive coliving) | −1,100 to −1,400 CHF |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$| − Logement (T2, ou chambre en coliving côté France — ex. La Villa Coliving : 1 370 à 1 430 CHF tout inclus, 0 € de frais de dossier, préavis 1 mois) | −1 100 à −1 430 CHF |$r$, $f$| − Logement (T2 ou coliving tout inclus) | −1 100 à −1 400 CHF |$f$),
    updated_at = now()
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND position($r$| − Logement (T2, ou chambre en coliving côté France — ex. La Villa Coliving : 1 370 à 1 430 CHF tout inclus, 0 € de frais de dossier, préavis 1 mois) | −1 100 à −1 430 CHF |$r$ IN content_fr) > 0
  AND position($f$| − Logement (T2 ou coliving tout inclus) | −1 100 à −1 400 CHF |$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$cross-border workers who want quiet near Geneva.$r$, $f$cross-border workers who want quiet 15 minutes from the office.$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$cross-border workers who want quiet near Geneva.$r$ IN content_en) > 0
  AND position($f$cross-border workers who want quiet 15 minutes from the office.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$frontaliers qui veulent du calme près de Genève.$r$, $f$frontaliers qui veulent du calme à 15 minutes du bureau.$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$frontaliers qui veulent du calme près de Genève.$r$ IN content_fr) > 0
  AND position($f$frontaliers qui veulent du calme à 15 minutes du bureau.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$- **All inclusive, no application fee**: coliving with La Villa Coliving in Ville-la-Grand, Ambilly or Annemasse$r$, $f$- **No lease, all-inclusive**: coliving in Ville-la-Grand$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$- **All inclusive, no application fee**: coliving with La Villa Coliving in Ville-la-Grand, Ambilly or Annemasse$r$ IN content_en) > 0
  AND position($f$- **No lease, all-inclusive**: coliving in Ville-la-Grand$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$- **Tout inclus, sans frais de dossier** : le coliving de La Villa Coliving à Ville-la-Grand, Ambilly ou Annemasse$r$, $f$- **Sans bail, tout inclus** : coliving à Ville-la-Grand$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$- **Tout inclus, sans frais de dossier** : le coliving de La Villa Coliving à Ville-la-Grand, Ambilly ou Annemasse$r$ IN content_fr) > 0
  AND position($f$- **Sans bail, tout inclus** : coliving à Ville-la-Grand$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Central location, right between Annemasse and the Swiss border.

In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door.$r$, $f$Central location, right between Annemasse and the Swiss border.$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$Central location, right between Annemasse and the Swiss border.

In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door.$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Position centrale, juste entre Annemasse et la frontière suisse.

À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.$r$, $f$Position centrale, juste entre Annemasse et la frontière suisse.$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$Position centrale, juste entre Annemasse et la frontière suisse.

À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Downside: prices climb fast and the center is packed at peak hours.

In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$r$, $f$Downside: prices climb fast and the center is packed at peak hours.$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$Downside: prices climb fast and the center is packed at peak hours.

In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Le revers : les prix grimpent vite et le centre est bondé aux heures de pointe.

À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$r$, $f$Le revers : les prix grimpent vite et le centre est bondé aux heures de pointe.$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$Le revers : les prix grimpent vite et le centre est bondé aux heures de pointe.

À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 14-minute walk from Annemasse station — Geneva Eaux-Vives in 22 minutes door to door.$r$, $f$This is where we built La Villa Coliving — for good reasons.$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 14-minute walk from Annemasse station — Geneva Eaux-Vives in 22 minutes door to door.$r$ IN content_en) > 0
  AND position($f$This is where we built La Villa Coliving — for good reasons.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 14 min à pied de la gare d'Annemasse — Genève-Eaux-Vives en 22 min porte-à-porte.$r$, $f$C'est ici qu'on a installé La Villa Coliving — pour de bonnes raisons.$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 14 min à pied de la gare d'Annemasse — Genève-Eaux-Vives en 22 min porte-à-porte.$r$ IN content_fr) > 0
  AND position($f$C'est ici qu'on a installé La Villa Coliving — pour de bonnes raisons.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Here's our advice for the new residents who arrive every year.$r$, $f$Here's our advice for the 50+ people arriving annually.$f$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($r$Here's our advice for the new residents who arrive every year.$r$ IN content_en) > 0
  AND position($f$Here's our advice for the 50+ people arriving annually.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Voici ce qu'on recommande aux nouveaux résidents qui arrivent chaque année chez nous.$r$, $f$Voici ce qu'on recommande aux 50+ personnes qui arrivent chaque année chez nous.$f$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($r$Voici ce qu'on recommande aux nouveaux résidents qui arrivent chaque année chez nous.$r$ IN content_fr) > 0
  AND position($f$Voici ce qu'on recommande aux 50+ personnes qui arrivent chaque année chez nous.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$≈ €1,400.$r$, $f$= €1,380.$f$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($r$≈ €1,400.$r$ IN content_en) > 0
  AND position($f$= €1,380.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$≈ 1 400 EUR.$r$, $f$= 1 380 EUR.$f$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($r$≈ 1 400 EUR.$r$ IN content_fr) > 0
  AND position($f$= 1 380 EUR.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$No Swiss payslip yet? Some landlords on the French side assess your contract rather than your history: at La Villa Coliving the file comes down to three items (a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills) and a guarantor is only asked for case by case, when the contract does not cover the rent — we tell you before we reply, never after the visit.$r$, $f$No outrageous bank guarantees, no French guarantor if you're foreign, no 10 income proofs.$f$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($r$No Swiss payslip yet? Some landlords on the French side assess your contract rather than your history: at La Villa Coliving the file comes down to three items (a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills) and a guarantor is only asked for case by case, when the contract does not cover the rent — we tell you before we reply, never after the visit.$r$ IN content_en) > 0
  AND position($f$No outrageous bank guarantees, no French guarantor if you're foreign, no 10 income proofs.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Pas encore de fiche de salaire suisse ? Certains bailleurs côté France évaluent ton contrat plutôt que ton passé : chez La Villa Coliving, le dossier tient en trois pièces (contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges) et un garant n'est demandé qu'au cas par cas, quand le contrat ne couvre pas le loyer — on t'en parle avant de te répondre, jamais après la visite.$r$, $f$Pas de garantie bancaire farfelue, pas de 10 justificatifs de revenu : un contrat de travail ou une promesse d'embauche suffit, un garant seulement au cas par cas.$f$),
    updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva'
  AND position($r$Pas encore de fiche de salaire suisse ? Certains bailleurs côté France évaluent ton contrat plutôt que ton passé : chez La Villa Coliving, le dossier tient en trois pièces (contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges) et un garant n'est demandé qu'au cas par cas, quand le contrat ne couvre pas le loyer — on t'en parle avant de te répondre, jamais après la visite.$r$ IN content_fr) > 0
  AND position($f$Pas de garantie bancaire farfelue, pas de 10 justificatifs de revenu : un contrat de travail ou une promesse d'embauche suffit, un garant seulement au cas par cas.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Fais le calcul :$r$, $f$Faites le calcul :$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$Fais le calcul :$r$ IN content_fr) > 0
  AND position($f$Faites le calcul :$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$a CHF 1,370 to 1,430 rent corresponds to a contractual rent of €1,470 to €1,530, set in euros$r$, $f$a 1,370 CHF rent is worth roughly 1,480-1,530 € depending on the current rate$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$a CHF 1,370 to 1,430 rent corresponds to a contractual rent of €1,470 to €1,530, set in euros$r$ IN content_en) > 0
  AND position($f$a 1,370 CHF rent is worth roughly 1,480-1,530 € depending on the current rate$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$un loyer de 1 370 à 1 430 CHF correspond à un loyer contractuel de 1 470 à 1 530 €, libellé en euros$r$, $f$un loyer de 1 370 CHF équivaut à de 1 490 à 1 540 € : c'est le loyer contractuel, libellé en euros$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$un loyer de 1 370 à 1 430 CHF correspond à un loyer contractuel de 1 470 à 1 530 €, libellé en euros$r$ IN content_fr) > 0
  AND position($f$un loyer de 1 370 CHF équivaut à de 1 490 à 1 540 € : c'est le loyer contractuel, libellé en euros$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$

**No Swiss payslip yet?** Some landlords on the French side assess your contract rather than your history: at La Villa Coliving the file comes down to three items (a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills) and a guarantor is only asked for case by case, when the contract does not cover the rent — we tell you before we reply, never after the visit.

The right reflex is not to compare bare rents$r$, $f$

The right reflex is not to compare bare rents$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$

**No Swiss payslip yet?** Some landlords on the French side assess your contract rather than your history: at La Villa Coliving the file comes down to three items (a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills) and a guarantor is only asked for case by case, when the contract does not cover the rent — we tell you before we reply, never after the visit.

The right reflex is not to compare bare rents$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$

**Pas encore de fiche de salaire suisse ?** Certains bailleurs côté France évaluent ton contrat plutôt que ton passé : chez La Villa Coliving, le dossier tient en trois pièces (contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges) et un garant n'est demandé qu'au cas par cas, quand le contrat ne couvre pas le loyer — on t'en parle avant de te répondre, jamais après la visite.

Le bon réflexe n'est pas de comparer les loyers nus$r$, $f$

Le bon réflexe n'est pas de comparer les loyers nus$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$

**Pas encore de fiche de salaire suisse ?** Certains bailleurs côté France évaluent ton contrat plutôt que ton passé : chez La Villa Coliving, le dossier tient en trois pièces (contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges) et un garant n'est demandé qu'au cas par cas, quand le contrat ne couvre pas le loyer — on t'en parle avant de te répondre, jamais après la visite.

Le bon réflexe n'est pas de comparer les loyers nus$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$| **Annemasse station (Léman Express)** | 850–1,150 € | 1,000–1,350 € | 600–800 € | 1,430 CHF |$r$, $f$| **Annemasse station (Léman Express)** | 850–1,150 € | 1,000–1,350 € | 600–800 € | — |$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$| **Annemasse station (Léman Express)** | 850–1,150 € | 1,000–1,350 € | 600–800 € | 1,430 CHF |$r$ IN content_en) > 0
  AND position($f$| **Annemasse station (Léman Express)** | 850–1,150 € | 1,000–1,350 € | 600–800 € | — |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$| **Ambilly** | 700–1,000 € | 900–1,250 € | 500–750 € | 1,430 CHF |$r$, $f$| **Ambilly** | 700–1,000 € | 900–1,250 € | 500–750 € | 1,370 CHF |$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$| **Ambilly** | 700–1,000 € | 900–1,250 € | 500–750 € | 1,430 CHF |$r$ IN content_en) > 0
  AND position($f$| **Ambilly** | 700–1,000 € | 900–1,250 € | 500–750 € | 1,370 CHF |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$| **Ville-la-Grand** | 700–950 € | 900–1,200 € | 500–700 € | 1,370 – 1,430 CHF |$r$, $f$| **Ville-la-Grand** | 700–950 € | 900–1,200 € | 500–700 € | 1,370 CHF |$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$| **Ville-la-Grand** | 700–950 € | 900–1,200 € | 500–700 € | 1,370 – 1,430 CHF |$r$ IN content_en) > 0
  AND position($f$| **Ville-la-Grand** | 700–950 € | 900–1,200 € | 500–700 € | 1,370 CHF |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$| **Annemasse gare (Léman Express)** | 850 – 1 150 € | 1 000 – 1 350 € | 600 – 800 € | 1 430 CHF |$r$, $f$| **Annemasse gare (Léman Express)** | 850 – 1 150 € | 1 000 – 1 350 € | 600 – 800 € | — |$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$| **Annemasse gare (Léman Express)** | 850 – 1 150 € | 1 000 – 1 350 € | 600 – 800 € | 1 430 CHF |$r$ IN content_fr) > 0
  AND position($f$| **Annemasse gare (Léman Express)** | 850 – 1 150 € | 1 000 – 1 350 € | 600 – 800 € | — |$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$| **Ambilly** | 700 – 1 000 € | 900 – 1 250 € | 500 – 750 € | 1 430 CHF |$r$, $f$| **Ambilly** | 700 – 1 000 € | 900 – 1 250 € | 500 – 750 € | 1 370 CHF |$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$| **Ambilly** | 700 – 1 000 € | 900 – 1 250 € | 500 – 750 € | 1 430 CHF |$r$ IN content_fr) > 0
  AND position($f$| **Ambilly** | 700 – 1 000 € | 900 – 1 250 € | 500 – 750 € | 1 370 CHF |$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$| **Ville-la-Grand** | 700 – 950 € | 900 – 1 200 € | 500 – 700 € | 1 370 – 1 430 CHF |$r$, $f$| **Ville-la-Grand** | 700 – 950 € | 900 – 1 200 € | 500 – 700 € | 1 370 CHF |$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$| **Ville-la-Grand** | 700 – 950 € | 900 – 1 200 € | 500 – 700 € | 1 370 – 1 430 CHF |$r$ IN content_fr) > 0
  AND position($f$| **Ville-la-Grand** | 700 – 950 € | 900 – 1 200 € | 500 – 700 € | 1 370 CHF |$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**The gap is brutal.** A studio in central Geneva costs an average of 1,600 CHF/month — utilities extra. The same space on the French side? 800 €, or about 800 CHF. Do the math: **that's nearly 10,000 CHF saved per year**, just on rent.

Coliving room on the French side: CHF 1,370 to 1,430 all inclusive at La Villa Coliving (bills, fibre, cleaning, pool, sauna and gym included, no application fee).$r$, $f$**The gap is brutal.** A studio in central Geneva costs an average of 1,600 CHF/month — utilities extra. The same space on the French side? 800 €, or about 800 CHF. Do the math: **that's nearly 10,000 CHF saved per year**, just on rent.$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$**The gap is brutal.** A studio in central Geneva costs an average of 1,600 CHF/month — utilities extra. The same space on the French side? 800 €, or about 800 CHF. Do the math: **that's nearly 10,000 CHF saved per year**, just on rent.

Coliving room on the French side: CHF 1,370 to 1,430 all inclusive at La Villa Coliving (bills, fibre, cleaning, pool, sauna and gym included, no application fee).$r$ IN content_en) > 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Et encore, ces chiffres ne prennent pas en compte les charges (80-150 CHF/mois à Genève), le dépôt de garantie (jusqu'à 3 mois en Suisse vs 2 mois hors charges en France), ni les frais d'agence.

Chambre en coliving côté France : 1 370 à 1 430 CHF tout inclus chez La Villa Coliving (charges, fibre, ménage, piscine, sauna, salle de sport compris, 0 € de frais de dossier).$r$, $f$Et encore, ces chiffres ne prennent pas en compte les charges (80-150 CHF/mois à Genève), le dépôt de garantie (jusqu'à 3 mois en Suisse vs 2 mois hors charges en France), ni les frais d'agence.$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$Et encore, ces chiffres ne prennent pas en compte les charges (80-150 CHF/mois à Genève), le dépôt de garantie (jusqu'à 3 mois en Suisse vs 2 mois hors charges en France), ni les frais d'agence.

Chambre en coliving côté France : 1 370 à 1 430 CHF tout inclus chez La Villa Coliving (charges, fibre, ménage, piscine, sauna, salle de sport compris, 0 € de frais de dossier).$r$ IN content_fr) > 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$| All-inclusive coliving room on the French side — La Villa Coliving | — | — | 1,370 – 1,430 CHF |$r$, $f$| Premium coliving all-inclusive | — | — | 1,370 CHF |$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$| All-inclusive coliving room on the French side — La Villa Coliving | — | — | 1,370 – 1,430 CHF |$r$ IN content_en) > 0
  AND position($f$| Premium coliving all-inclusive | — | — | 1,370 CHF |$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$| Chambre en coliving tout inclus côté France — La Villa Coliving | — | — | 1 370 – 1 430 CHF |$r$, $f$| Coliving premium tout inclus | — | — | 1 370 CHF |$f$),
    updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND position($r$| Chambre en coliving tout inclus côté France — La Villa Coliving | — | — | 1 370 – 1 430 CHF |$r$ IN content_fr) > 0
  AND position($f$| Coliving premium tout inclus | — | — | 1 370 CHF |$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$from €700 to €1,000 in a classic rental$r$, $f$from €600 to €900 in a classic rental$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$from €700 to €1,000 in a classic rental$r$ IN content_en) > 0
  AND position($f$from €600 to €900 in a classic rental$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$de 700 à 1 000 € en location classique$r$, $f$de 600 à 900 € en location classique$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$de 700 à 1 000 € en location classique$r$ IN content_fr) > 0
  AND position($f$de 600 à 900 € en location classique$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$- Search through four channels: [coliving operators on the French side](/en/blog/coliving-colocation-ou-studio-geneve-comparatif) such as La Villa Coliving, peer-to-peer flatshare platforms, Facebook groups and the CAGI housing exchange.$r$, $f$- Look on cross-border groups, listings, agencies or coliving operators.$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$- Search through four channels: [coliving operators on the French side](/en/blog/coliving-colocation-ou-studio-geneve-comparatif) such as La Villa Coliving, peer-to-peer flatshare platforms, Facebook groups and the CAGI housing exchange.$r$ IN content_en) > 0
  AND position($f$- Look on cross-border groups, listings, agencies or coliving operators.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$- Cherche par quatre canaux : [les opérateurs de coliving côté France](/blog/coliving-colocation-ou-studio-geneve-comparatif) comme La Villa Coliving, les plateformes de colocation entre particuliers, les groupes Facebook et la bourse du logement du CAGI.$r$, $f$- Cherche sur les groupes frontaliers, les annonces, les agences ou les opérateurs de coliving.$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$- Cherche par quatre canaux : [les opérateurs de coliving côté France](/blog/coliving-colocation-ou-studio-geneve-comparatif) comme La Villa Coliving, les plateformes de colocation entre particuliers, les groupes Facebook et la bourse du logement du CAGI.$r$ IN content_fr) > 0
  AND position($f$- Cherche sur les groupes frontaliers, les annonces, les agences ou les opérateurs de coliving.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$- In coliving, the file is your employment contract and everything is included.$r$, $f$- In coliving, **no French guarantor** and everything is included.$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$- In coliving, the file is your employment contract and everything is included.$r$ IN content_en) > 0
  AND position($f$- In coliving, **no French guarantor** and everything is included.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$No Swiss payslip yet? Some landlords on the French side assess your contract rather than your history: at La Villa Coliving the file comes down to three items (a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills) and a guarantor is only asked for case by case, when the contract does not cover the rent — we tell you before we reply, never after the visit.$r$, $f$Good news: in coliving, the application is simplified — **[no French guarantor required](https://www.service-public.gouv.fr/particuliers/vosdroits/F34661?lang=en)**.$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$No Swiss payslip yet? Some landlords on the French side assess your contract rather than your history: at La Villa Coliving the file comes down to three items (a signed employment contract or job offer, an ID, and a deposit of two months' rent excluding bills) and a guarantor is only asked for case by case, when the contract does not cover the rent — we tell you before we reply, never after the visit.$r$ IN content_en) > 0
  AND position($f$Good news: in coliving, the application is simplified — **[no French guarantor required](https://www.service-public.gouv.fr/particuliers/vosdroits/F34661?lang=en)**.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Pas encore de fiche de salaire suisse ? Certains bailleurs côté France évaluent ton contrat plutôt que ton passé : chez La Villa Coliving, le dossier tient en trois pièces (contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges) et un garant n'est demandé qu'au cas par cas, quand le contrat ne couvre pas le loyer — on t'en parle avant de te répondre, jamais après la visite.$r$, $f$Bonne nouvelle : en coliving, le dossier est simplifié — contrat de travail ou promesse d'embauche, garant seulement au cas par cas.$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$Pas encore de fiche de salaire suisse ? Certains bailleurs côté France évaluent ton contrat plutôt que ton passé : chez La Villa Coliving, le dossier tient en trois pièces (contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de 2 mois de loyer hors charges) et un garant n'est demandé qu'au cas par cas, quand le contrat ne couvre pas le loyer — on t'en parle avant de te répondre, jamais après la visite.$r$ IN content_fr) > 0
  AND position($f$Bonne nouvelle : en coliving, le dossier est simplifié — contrat de travail ou promesse d'embauche, garant seulement au cas par cas.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$## How to avoid scams?$r$, $f$## Where to actually look?

Several options, each with pros and cons:
- **cross-border Facebook groups** (very active, but first come first served);
- listings sites (leboncoin, etc.) — many offers, but filter carefully;
- French **real estate agencies** [(serious, but application fees and heavy files)](https://www.anil.org/);
- **coliving operators**, [who handle everything end to end](/en/blog/coliving-colocation-ou-studio-geneve-comparatif) (furnished room, utilities, community).

## How to avoid scams?$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$## How to avoid scams?$r$ IN content_en) > 0
  AND position($f$## Where to actually look?

Several options, each with pros and cons:
- **cross-border Facebook groups** (very active, but first come first served);
- listings sites (leboncoin, etc.) — many offers, but filter carefully;
- French **real estate agencies** [(serious, but application fees and heavy files)](https://www.anil.org/);
- **coliving operators**, [who handle everything end to end](/en/blog/coliving-colocation-ou-studio-geneve-comparatif) (furnished room, utilities, community).

## How to avoid scams?$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$## Comment éviter les arnaques ?$r$, $f$## Où chercher concrètement ?

Plusieurs pistes, avec leurs avantages et leurs limites :
- les **groupes Facebook frontaliers** (très actifs, mais premier arrivé premier servi) ;
- les sites d'annonces (leboncoin, etc.) — beaucoup d'offres, mais à filtrer ;
- les **agences immobilières** françaises [(sérieuses, mais frais de dossier et dossier lourd)](https://www.anil.org/) ;
- les **opérateurs de coliving**, [qui gèrent tout de A à Z](/blog/coliving-colocation-ou-studio-geneve-comparatif) (chambre meublée, charges, communauté).

## Comment éviter les arnaques ?$f$),
    updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND position($r$## Comment éviter les arnaques ?$r$ IN content_fr) > 0
  AND position($f$## Où chercher concrètement ?

Plusieurs pistes, avec leurs avantages et leurs limites :
- les **groupes Facebook frontaliers** (très actifs, mais premier arrivé premier servi) ;
- les sites d'annonces (leboncoin, etc.) — beaucoup d'offres, mais à filtrer ;
- les **agences immobilières** françaises [(sérieuses, mais frais de dossier et dossier lourd)](https://www.anil.org/) ;
- les **opérateurs de coliving**, [qui gèrent tout de A à Z](/blog/coliving-colocation-ou-studio-geneve-comparatif) (chambre meublée, charges, communauté).

## Comment éviter les arnaques ?$f$ IN content_fr) = 0;

COMMIT;
*/
