-- ============================================================================
-- PUBLICATION GROUPÉE du 29/09/2026 — PHASE A (AVANT le push sur main)
--   C4 « Coliving, colocation ou studio à Genève ? » publiée + maillage + consolidation de 3 anciens articles
--   C1 et C3 alignés (bail sans engagement minimum, 72 h si chambre disponible, prix CHF/€, T2 Annemasse)
--   4 articles publiés : plus d'« engagement de 12 mois » ni de « pénalité » (bail résiliable à tout moment, 1 mois de préavis)
--   Générateur n8n : blog_editorial_strategy v4 (v3 désactivée, jamais supprimée)
--
-- POURQUOI DEUX PHASES : les tokens {{PRIX_DES_EUR}} / {{PRIX_PRIVATIF_EUR}} n'existent que dans le code des
--   branches content/comparatif-profils + fix/bail-sans-minimum. Tant que ce code n'est pas en production, un token
--   en base s'afficherait brut. La phase A écrit donc les montants en euros EN CLAIR (1 470 € / 1 530 €, graphie
--   identique à celle que produit le token) ; la phase B (après le déploiement) remet les tokens.
--   Et la CI du push exige que l'ancien article soit dépublié et que C1 ne dise plus « trois mois minimum »
--   (check-redirects + check-entity-facts --strict) : la phase A doit donc précéder le push.
--
-- ORDRE : GO Jérôme → phase A (MCP) → vérifications ci-dessous → push main IMMÉDIAT (hors créneau 05 h / 13 h UTC)
--         → CI verte + commit du bot → phase B.
-- Généré depuis content/decision-pages/*.md (source de vérité) par scratchpad assemble.py + scripts/build-article-sql.mjs.
-- ============================================================================

BEGIN;

-- 1. C4 : contenu, publication, maillage entrant, consolidation (dépublication + repointage des liens)
UPDATE public.blog_posts SET
  title_fr = 'Coliving, colocation ou studio à Genève ?',
  title_en = 'Coliving, flatshare or studio in Geneva?',
  excerpt_fr = 'Studio à Genève, colocation classique, coliving premium ou grande résidence : les quatre formats comparés sur ce qui compte au quotidien, de l''emménagement aux amis, de l''espace au trajet, puis six raisons de choisir une chambre chez nous.',
  excerpt_en = 'Studio in Geneva, classic flatshare, premium coliving or large residence: the four formats compared on what matters day to day, from moving in to making friends, from space to the commute, then six reasons to choose a room with us.',
  meta_description_fr = 'Studio à Genève, colocation ou coliving côté France ? Emménagement, amis, espace, piscine, ménage, trajet, coût : les quatre formats comparés.',
  meta_description_en = 'Studio in Geneva, flatshare or coliving on the French side? Moving in, friends, space, pool, cleaning, commute, cost: the four formats compared.',
  content_fr = $fr$Pour un jeune actif qui arrive avec un contrat à Genève, le format de logement change surtout ta vie de tous les jours : le temps qu'il te faut pour avoir une adresse, les gens avec qui tu dînes le soir, l'espace dont tu disposes, ce que tu trouves en rentrant du travail et le trajet pour y aller. Sur ces critères, le coliving premium côté France arrive en tête dans la plupart des cas : une chambre en 72 h dès ton premier contact si elle est disponible, une maison de 7 à 12 résidents qui travaillent à Genève, piscine, sauna et salle de sport sur place, et le centre de Genève à 20 minutes porte-à-porte. Le studio à Genève garde l'avantage de l'autonomie totale, si tu veux vivre seul et en ville. Ce guide compare les quatre formats critère par critère, sans marque, puis tranche selon ce que tu attends de ton logement.

**En bref**
- Le vrai écart entre les formats n'est pas le loyer, c'est la vie qu'il t'achète : l'emménagement, les gens autour de toi, l'espace, le sport, le ménage et le trajet.
- Le coliving premium réunit ce que les autres formats séparent : emménagement en 72 h dès le premier contact si une chambre est disponible, colocataires sélectionnés dès le premier soir, piscine et sauna à la maison, ménage des communs trois fois par semaine, gare à pied.
- Côté budget, un studio à Genève se loue 1 200 à 2 500 CHF par mois hors charges. Côté France, une colocation classique revient à 600 à 1 000 € charges comprises, et le coliving premium démarre à {{PRIX_DES}}/1 470 € tout inclus, transport en plus dans les deux cas.

## Les quatre formats, critère par critère

Ce que chaque format change au quotidien pour une personne seule qui travaille à Genève, en septembre 2026, sans marque ; la colonne « grande résidence » reprend ce que publient le site d'une résidence de coliving de plusieurs centaines de logements côté France et des portails de location.

| Critère | Studio à Genève | Colocation classique côté France | Coliving premium côté France (La Villa) | Grande résidence de coliving côté France |
|---|---|---|---|---|
| Emménager | 4 à 8 semaines sans historique suisse, meubles à acheter | 2 à 6 semaines, chambre en général meublée, équipement variable | 72 h dès ton premier contact si une chambre est disponible, avec ta valise | contact sous 24 à 48 h après pré-réservation, logement meublé |
| Te faire des amis | à construire seul, par le travail et les clubs | selon les colocataires trouvés au hasard des annonces | dès le premier soir, dans une maison de 7 à 12 résidents sélectionnés qui travaillent à Genève | plusieurs centaines de résidents : étudiants, jeunes actifs et voyageurs |
| Espace de vie | tout le studio, sans espace partagé | une chambre et une part de l'appartement | chambre de 16 à 24 m², 37 à 42 m² d'espace de vie par colocataire, jardin | chambre en colocation de 10 à 17 m², mini-studio de 14 m², studio de 16 à 35 m² (portails de location, septembre 2026) |
| Infrastructures | celles de l'immeuble, souvent une buanderie | celles de l'appartement | piscine dans chaque maison (intérieure et chauffée toute l'année au Loft, extérieure de mi-avril à fin septembre à La Villa, où elle est chauffée, et au Lodge), sauna, salle de sport, pièce home cinéma dédiée dans chaque maison, jardin, barbecue | salle de sport, salle de cinéma, karaoké, bar, studio de musique et de podcast, salle de yoga ; espace bien-être avec sauna annoncé « à venir » ; pas de piscine |
| Ménage et services | toi, et tout le reste à souscrire | à répartir entre colocataires | ménage des communs 3 fois par semaine, produits du quotidien, draps et serviettes fournis, fibre jusqu'à 8 Gb/s ; ménage de ta chambre en option | communs entretenus. OPTION payante : ménage de ton logement, linge et laverie |
| Animations communautaires | aucune | selon les colocataires | yoga et fitness privés chaque semaine, pizza party chaque mois | programme d'événements inclus |
| Aller travailler à Genève | à pied, en tram ou en bus, 70 CHF par mois (unireso, tpg 2026) | selon la commune ; 119,50 € par mois depuis l'agglomération d'Annemasse avec le Léman Pass (2026) | gare d'Annemasse à 9 ou 10 min à pied, Eaux-Vives en 8 min et Cornavin en 20 min environ en Léman Express, centre en 20 min porte-à-porte | bus M jusqu'à Saint-Julien-en-Genevois, puis ligne 80 vers le centre de Genève ; gare de Saint-Julien à 10 min en voiture |
| Pannes, factures, gestion | toi, face à la régie | entre colocataires | un seul interlocuteur pour tout | l'équipe de la résidence, via une application |
| Coût total par mois | loyer de 1 200 à 2 500 CHF hors charges selon les annonces (loyer médian 1 475 CHF, RealAdvisor, septembre 2026), plus 300 à 450 CHF de charges et d'abonnements | 700 à 1 100 € charges et transport compris | dès {{PRIX_DES}}/1 470 € tout inclus, plus le transport | dès 690 € pour une chambre, studios dès 920 €, plus les options et le transport |

Lis la colonne du coliving premium de haut en bas : si une chambre est disponible, tu emménages en 72 h avec ta valise, tu dînes avec tes colocataires dès le premier soir, piscine, sauna et salle de sport sont chez toi, et le ménage des communs est fait pour toi. Le studio à Genève t'offre la ville et l'autonomie, mais tout le reste est à construire seul. La colocation classique coûte moins cher au mois, contre le hasard des colocataires et un appartement à organiser. La grande résidence mise sur sa taille et ses nombreux espaces partagés en immeuble, avec le ménage de ton logement et le linge en option, et un trajet en bus avec correspondance.

## Décision par profil : six raisons de choisir une chambre chez nous

**Tu veux te consacrer à ton nouveau job.** Verdict : coliving. Les premières semaines se jouent au bureau, pas dans un magasin de meubles : candidature en deux minutes, réponse sous 48 h, visite sur place ou en visio, et si une chambre est disponible, tu emménages 72 h après ton premier contact. Le lundi, tu es à 100 % pour ton employeur.

**Tu manques de temps.** Verdict : coliving. Ménage des communs trois fois par semaine, produits du quotidien dans le placard, draps et serviettes fournis, fibre qui marche, un seul interlocuteur quand quelque chose cloche : tes soirées et tes week-ends restent à toi.

**Tu veux profiter de la vie.** Verdict : coliving. Vingt longueurs dans la piscine en rentrant, un sauna en janvier, une séance de sport sans abonnement ni trajet, un barbecue dans le jardin, une soirée home cinéma, le cours de yoga de la semaine. Un studio de centre-ville réunit rarement tout ça, et jamais à ce prix.

**Tu veux te faire des relations.** Verdict : coliving. Arriver seul dans une ville où tout le monde a déjà ses amis est la partie la plus dure d'une expatriation. Chez nous, tu dînes le premier soir avec des colocataires sélectionnés qui travaillent à Genève comme toi, et la pizza party du mois fait le reste.

**Tu veux vivre premium.** Verdict : coliving. Une maison, pas un immeuble : chambre meublée et décorée de 16 à 24 m², salle d'eau privative si tu la choisis, 37 à 42 m² d'espace de vie par colocataire, et des services qu'un studio genevois ne comprend presque jamais. Le prix d'entrée est plus haut qu'une colocation classique, le niveau aussi.

**Tu veux un style de vie à taille humaine.** Verdict : coliving. Piscine, salle de sport, sauna et jardin partagés entre résidents, comme dans un condo, mais dans une maison à taille humaine, avec des colocataires internationaux et le centre de Genève à 20 minutes porte-à-porte.

## Les options de logement, catégorie par catégorie

| Option | Prix | Délai réaliste | Dossier demandé | Durée minimum |
|---|---|---|---|---|
| Studio en ville (Genève) | 1 200 à 2 500 CHF hors charges (annonces, 2026) | 4 à 8 semaines sans historique suisse | 3 fiches de salaire suisses, extrait des poursuites, garant ou garantie bancaire, dépôt jusqu'à 3 mois | 12 mois en pratique |
| Colocation classique côté France | 600 à 1 000 € charges comprises selon la commune (annonces, septembre 2026) | 2 à 6 semaines | Fiches de salaire, souvent un garant en France, dépôt 1 à 2 mois | bail d'un an, préavis d'un mois en meublé, solidarité entre colocataires possible jusqu'à 6 mois |
| Coliving premium côté France (La Villa) | dès {{PRIX_DES}}/1 470 € tout inclus, {{PRIX_PRIVATIF}}/1 530 € avec salle d'eau privative | 72 h dès le premier contact si une chambre est disponible | Contrat de travail ou promesse d'embauche, pièce d'identité, caution {{CAUTION_MOIS}} mois hors charges | aucune : bail de 12 mois, préavis d'un mois |
| Grande résidence de coliving côté France | dès 690 € (site de la résidence, septembre 2026) | contact sous 24 à 48 h après pré-réservation | Garant obligatoire sauf CDI hors période d'essai et revenus de 3 fois le loyer, frais de dossier jusqu'à 990 € | dès 1 mois selon disponibilité, préavis d'un mois |
| Appart'hôtel ou studio meublé en courte durée côté France | 1 300 à 1 600 € charges comprises (annonces, septembre 2026) | 1 jour à 2 semaines | Carte bancaire ou dossier léger | 1 nuit à 1 mois |

<!-- entity-facts -->

Concrètement, pour un nouveau job dans un mois : [candidature en deux minutes](/candidature), réponse sous 48 h, visite sur place ou en visio, bail signé en ligne. Si une chambre est disponible, tu emménages 72 h après ton premier contact. Les [chambres disponibles](/chambres-disponibles) sont visibles en direct, ce que le loyer inclut est détaillé sur la [page des tarifs](/tarifs), et les trois maisons avec leur trajet sont sur [notre page colocation à Genève côté France](/colocation-geneve).

## Quand le studio à Genève est le bon choix

Le studio gagne si tu remplis quatre conditions : vivre seul, rester deux ans ou plus, avoir déjà un dossier suisse, et tenir à marcher jusqu'au travail. Il t'achète alors l'autonomie totale et une adresse genevoise. Beaucoup de nos résidents ont fait le chemin dans l'autre sens : quelques mois chez nous, le temps de constituer un dossier suisse, puis un appartement à Genève, ou pas. Pour choisir ton côté de la frontière, lis [s'installer à Genève : côté Suisse ou côté France](/blog/s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france).

## Quand ce n'est pas le bon choix

Le coliving n'est pas fait pour tout le monde. Un couple qui veut partager une seule chambre, ou une famille, a besoin d'un logement entier : un deux-pièces meublé côté France se loue 1 200 à 1 500 € par mois charges comprises (annonces, septembre 2026). Chez nous, une chambre accueille une seule personne ; un couple peut venir en prenant deux chambres. Un séjour touristique de quelques semaines relève d'une résidence hôtelière. Un budget total sous 1 200 € par mois oriente vers la colocation classique : notre [guide pour trouver une colocation près de Genève](/blog/trouver-colocation-geneve-frontalier) te donne les groupes, les portails et les pièges. Et si ta voiture est indispensable chaque jour, un logement plus loin des postes-frontière sera plus logique. Pour comparer les communes côté France, lis [où habiter côté France quand on travaille en Suisse](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).

## Questions fréquentes

**Studio à Genève ou chambre côté France : qu'est-ce qui change vraiment au quotidien ?**

Presque tout, sauf ton travail. En studio à Genève, tu as la ville à pied et l'autonomie totale, mais tu emménages en quatre à huit semaines, tu meubles, tu gères et tu te fais des amis seul. En coliving premium côté France, tu emménages en 72 h dès ton premier contact si une chambre est disponible, tu dînes avec tes colocataires dès le premier soir, tu as piscine, sauna et salle de sport à la maison et le ménage des communs fait, pour un trajet de 20 minutes porte-à-porte jusqu'au centre de Genève.

**Coliving ou colocation : quelle différence concrète ?**

La colocation, c'est partager un loyer : tu trouves une chambre dans un appartement, meublée ou non, tu répartis les charges et le ménage entre colocataires, avec un bail d'un an et souvent un garant. Le coliving premium, c'est une maison pensée pour bien vivre à plusieurs : une chambre meublée et décorée, la fibre, le ménage des communs trois fois par semaine, les draps et les serviettes fournis, la piscine, le sauna et la salle de sport dans chaque maison, des colocataires sélectionnés, du yoga et du fitness chaque semaine, et un seul interlocuteur pour tout. Chez nous, c'est un bail meublé de résidence principale de 12 mois, et tu es libre de partir à tout moment avec un mois de préavis. Tu paies plus cher au mois qu'en colocation classique, et tu gagnes du temps, du confort, une vie sociale immédiate et un cadre que même un studio à Genève ne t'offre pas.

**Est-ce qu'on se fait vraiment des amis en coliving ?**

Oui, et vite, parce que la maison est pensée pour ça. Chez nous, tu vis avec 6 à 11 colocataires sélectionnés, jeunes actifs qui travaillent à Genève, tu partages la cuisine, le jardin et la piscine, et le yoga, le fitness et la pizza party du mois créent les premières occasions. Plus de 100 résidents sont passés par nos maisons depuis 2021 ; beaucoup y ont trouvé leurs amis genevois, parfois leur prochain job.

**En combien de temps peut-on emménager chez La Villa ?**

En 72 h dès ton premier contact, si une chambre est disponible : candidature en deux minutes, réponse sous 48 h, visite sur place ou en visio, bail signé en ligne, et tu arrives avec ta valise dans une chambre meublée, draps et serviettes fournis. Les chambres disponibles et les prochaines libérations sont affichées en direct sur le site.

**Combien de temps pour aller travailler à Genève depuis les maisons ?**

Les trois maisons sont à 9 ou 10 minutes à pied de la gare d'Annemasse, d'où le Léman Express rejoint Genève Eaux-Vives en 8 minutes et Cornavin en 20 minutes environ, sans changement ; Le Loft est aussi à 5 minutes à pied du tram 17. Porte-à-porte, compte 20 minutes jusqu'au centre de Genève, et 119,50 € par mois pour le Léman Pass (2026).
$fr$,
  content_en = $en$For a young professional arriving with a contract in Geneva, what the housing format really changes is your daily life: how long it takes to get an address, who you have dinner with in the evening, how much space you have, what you find when you get home from work and how you get there. On those criteria, premium coliving on the French side comes out ahead in most cases: a room within 72 h of your first contact if one is available, a house of 7 to 12 residents who work in Geneva, pool, sauna and gym on site, and central Geneva 20 minutes door-to-door. A studio in Geneva keeps one advantage, total independence, if you want to live alone in the city. This guide compares the four formats criterion by criterion, without naming brands, then gives a verdict based on what you expect from your home.

**In short**
- The real gap between the formats is not the rent, it is the life it buys you: moving in, the people around you, space, sport, cleaning and the commute.
- Premium coliving brings together what the other formats keep apart: move-in within 72 h of your first contact if a room is available, selected flatmates from the first evening, pool and sauna at home, common areas cleaned three times a week, a station within walking distance.
- Budget-wise, a studio in Geneva rents for CHF 1,200 to 2,500 a month excluding charges. On the French side, a classic flatshare costs €600 to €1,000 including charges, and premium coliving starts at {{PRIX_DES}}/€1,470 all-inclusive, with transport on top in both cases.

## The four formats, criterion by criterion

What each format changes day to day for a single person working in Geneva, in September 2026, without naming brands; the "large residence" column repeats what the website of a coliving residence of several hundred units on the French side and rental portals publish.

| Criterion | Studio in Geneva | Classic flatshare, French side | Premium coliving, French side (La Villa) | Large coliving residence, French side |
|---|---|---|---|---|
| Moving in | 4 to 8 weeks without a Swiss rental record, furniture to buy | 2 to 6 weeks, room usually furnished, equipment varies | 72 h from your first contact if a room is available, with your suitcase | contact within 24 to 48 h after pre-booking, furnished unit |
| Making friends | built alone, through work and clubs | depends on the flatmates you find through listings | from the first evening, in a house of 7 to 12 selected residents who work in Geneva | several hundred residents: students, young professionals and travellers |
| Living space | the whole studio, no shared space | a room and a share of the flat | room of 16 to 24 m², 37 to 42 m² of living space per flatmate, garden | room in a flatshare of 10 to 17 m², mini studio of 14 m², studio of 16 to 35 m² (rental portals, September 2026) |
| Facilities | those of the building, often a laundry room | those of the flat | a pool in every house (indoor and heated year-round at Le Loft, outdoor from mid-April to the end of September at La Villa, where it is heated, and at Le Lodge), sauna, gym, a dedicated home-cinema room in every house, garden, barbecue | gym, cinema room, karaoke, bar, music and podcast studio, yoga room; wellness area with sauna announced as "coming soon"; no pool |
| Cleaning and services | you, plus everything else to sign up for | split between flatmates | common areas cleaned 3 times a week, everyday products, sheets and towels provided, fibre up to 8 Gb/s; cleaning of your room as an option | common areas maintained. PAID OPTIONS: cleaning of your unit, linen and laundry |
| Community life | none | depends on the flatmates | private yoga and fitness classes every week, a pizza party every month | events programme included |
| Getting to work in Geneva | on foot, by tram or bus, CHF 70 a month (unireso, tpg 2026) | depends on the town; €119.50 a month from the Annemasse area with the Léman Pass (2026) | Annemasse station a 9 or 10-min walk away, Eaux-Vives in 8 min and Cornavin in about 20 by Léman Express, the centre 20 min door-to-door | bus M to Saint-Julien-en-Genevois, then line 80 to central Geneva; Saint-Julien station 10 min by car |
| Repairs, bills, admin | you, dealing with the letting agency | between flatmates | a single point of contact for everything | the residence team, through an app |
| Total monthly cost | rent of CHF 1,200 to 2,500 excluding charges according to listings (median rent CHF 1,475, RealAdvisor, September 2026), plus CHF 300 to 450 of bills and subscriptions | €700 to €1,100 including bills and transport | from {{PRIX_DES}}/€1,470 all-inclusive, plus transport | from €690 for a room, studios from €920, plus options and transport |

Read the premium coliving column from top to bottom: if a room is available, you move in within 72 h with your suitcase, you have dinner with your flatmates from the first evening, pool, sauna and gym are at home, and the common areas are cleaned for you. A studio in Geneva gives you the city and independence, but everything else is yours to build alone. The classic flatshare costs less per month, but you take pot luck with flatmates and have a flat to organise. The large residence relies on its size and its many shared spaces in a large apartment block, with cleaning of your unit and linen as options, and a bus commute with a change.

## Decision by profile: six reasons to choose a room with us

**You want to focus on your new job.** Verdict: coliving. Your first weeks belong at the office, not in a furniture store: a two-minute application, a reply within 48 h, a visit on site or by video, and if a room is available, you move in 72 h after your first contact. On Monday, you can give your employer 100%.

**You are short on time.** Verdict: coliving. Common areas cleaned three times a week, everyday products in the cupboard, sheets and towels provided, fibre that works, a single point of contact when something goes wrong: your evenings and weekends stay yours.

**You want to enjoy life.** Verdict: coliving. Twenty lengths in the pool when you get home, a sauna in January, a workout with no membership and no commute, a barbecue in the garden, a home-cinema evening, this week's yoga class. A city-centre studio rarely brings all of that together, and never at this price.

**You want to make friends.** Verdict: coliving. Arriving alone in a city where everyone already has their friends is the hardest part of moving abroad. With us, you have dinner on the first evening with selected flatmates who work in Geneva like you, and the monthly pizza party does the rest.

**You want a premium lifestyle.** Verdict: coliving. A house, not an apartment block: a furnished and decorated room of 16 to 24 m², a private shower room if you choose it, 37 to 42 m² of living space per flatmate, and services a Geneva studio almost never includes. The entry price is higher than a classic flatshare, and so is the standard.

**You want a human-scale way of life.** Verdict: coliving. Pool, gym, sauna and garden shared between residents, like in a condo, but in a human-sized house, with international flatmates and central Geneva 20 minutes door-to-door.

## The housing options, category by category

| Option | Price | Realistic timeline | Paperwork required | Minimum stay |
|---|---|---|---|---|
| Studio in the city (Geneva) | CHF 1,200 to 2,500 excluding charges (listings, 2026) | 4 to 8 weeks without a Swiss rental record | 3 Swiss payslips, extract from the debt collection register, guarantor or bank guarantee, deposit of up to 3 months | 12 months in practice |
| Classic flatshare, French side | €600 to €1,000 including charges depending on the town (listings, September 2026) | 2 to 6 weeks | Payslips, often a guarantor in France, 1 to 2 months' deposit | one-year lease, one month's notice when furnished, joint liability between flatmates possible for up to 6 months |
| Premium coliving, French side (La Villa) | from {{PRIX_DES}}/€1,470 all-inclusive, {{PRIX_PRIVATIF}}/€1,530 with a private shower room | 72 h from first contact if a room is available | Employment contract or job offer, ID, deposit of {{CAUTION_MOIS}} months excluding charges | none: 12-month lease, one month's notice |
| Large coliving residence, French side | from €690 (residence website, September 2026) | contact within 24 to 48 h after pre-booking | Guarantor required unless on a permanent contract past probation and earning 3 times the rent, application fee of up to €990 | from 1 month subject to availability, one month's notice |
| Aparthotel or short-let furnished studio, French side | €1,300 to €1,600 including charges (listings, September 2026) | 1 day to 2 weeks | Credit card or minimal paperwork | 1 night to 1 month |

<!-- entity-facts -->

In practice, for a new job in a month: [a two-minute application](/en/candidature), a reply within 48 h, a visit on site or by video, a lease signed online. If a room is available, you move in 72 h after your first contact. [Available rooms](/en/chambres-disponibles) are shown live, what the rent includes is detailed on the [rates page](/en/tarifs), and the three houses with their commute are on [our page for flatshares in Geneva, French side](/en/colocation-geneve).

## When a studio in Geneva is the right choice

A studio wins if you meet four conditions: living alone, staying two years or more, already having a Swiss rental record, and insisting on walking to work. It then buys you total independence and a Geneva address. Many of our residents went the other way round: a few months with us, long enough to build up a Swiss rental record, then a flat in Geneva, or not. To choose your side of the border, read [moving to Geneva: Swiss side or French side](/en/blog/s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france).

## When it is not the right choice

Coliving is not for everyone. A couple who want to share a single room, or a family, need a whole home: a furnished one-bedroom flat on the French side rents for €1,200 to €1,500 a month including charges (listings, September 2026). With us, each room is let to one person; a couple can come by taking two rooms. A tourist stay of a few weeks belongs in a serviced residence. A total budget under €1,200 a month points to a classic flatshare: our [guide to finding a flatshare near Geneva](/en/blog/trouver-colocation-geneve-frontalier) gives you the groups, the portals and the traps. And if your car is essential every day, a home further from the border crossings will make more sense. To compare the French-side towns, read [where to live on the French side when you work in Switzerland](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).

## Frequently asked questions

**Studio in Geneva or a room on the French side: what really changes day to day?**

Almost everything except your job. In a Geneva studio, you have the city on foot and total independence, but you move in after four to eight weeks, you furnish, you manage and you make friends on your own. In premium coliving on the French side, you move in within 72 h of your first contact if a room is available, you have dinner with your flatmates from the first evening, you have a pool, a sauna and a gym at home and the common areas cleaned for you, for a 20-minute door-to-door commute to central Geneva.

**Coliving or flatshare: what is the concrete difference?**

A flatshare means sharing the rent: you find a room in a flat, furnished or not, and split the bills and the cleaning between flatmates, with a one-year lease and often a guarantor. Premium coliving is a house designed for living well together: a furnished and decorated room, fibre, the common areas cleaned three times a week, sheets and towels provided, a pool, a sauna and a gym in every house, selected flatmates, yoga and fitness classes every week, and a single point of contact for everything. With us, it is a 12-month furnished primary-residence lease, and you are free to leave at any time with one month's notice. You pay more per month than in a classic flatshare, and you gain time, comfort, an immediate social life and a setting that even a studio in Geneva does not give you.

**Do you really make friends in coliving?**

Yes, and quickly, because the house is designed for it. With us, you live with 6 to 11 selected flatmates, young professionals who work in Geneva, you share the kitchen, the garden and the pool, and yoga, fitness and the monthly pizza party break the ice. More than 100 residents have passed through our houses since 2021; many found their Geneva friends there, sometimes their next job.

**How quickly can I move in with La Villa Coliving?**

Within 72 h of your first contact, if a room is available: a two-minute application, a reply within 48 h, a visit on site or by video, a lease signed online, and you arrive with your suitcase in a furnished room, sheets and towels provided. Available rooms and rooms opening up soon are shown live on the site.

**How long does it take to get to work in Geneva from the houses?**

All three houses are a 9 or 10-minute walk from Annemasse station, from where the Léman Express gets you to Geneva Eaux-Vives in 8 minutes and Cornavin in about 20 minutes, with no change; Le Loft is also a 5-minute walk from tram 17. Door-to-door, allow 20 minutes to central Geneva, and €119.50 a month for the Léman Pass (2026).
$en$,
  author = 'Jerome Austin',
  category = 'geneva',
  image_url = '/images/le lodge piscine.webp',
  read_time_min = 13,
  tags = ARRAY['coliving', 'colocation', 'studio', 'genève', 'vie communautaire', 'comparatif'],
  is_published = true,
  published_at = COALESCE(published_at, now()),
  updated_at = now()
WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif';

-- Lien entrant depuis « budget-colocation-geneve-guide-complet » (ancre FR « pas forcément plus cher qu'un studio tout compris », EN « compare total budget (rent + charges + furniture + transport) rather than rent alone ») — idempotent
UPDATE public.blog_posts SET
  content_fr = replace(content_fr, 'pas forcément plus cher qu''un studio tout compris', '[pas forcément plus cher qu''un studio tout compris](/blog/coliving-colocation-ou-studio-geneve-comparatif)'),
  content_en = replace(content_en, 'compare total budget (rent + charges + furniture + transport) rather than rent alone', '[compare total budget (rent + charges + furniture + transport) rather than rent alone](/en/blog/coliving-colocation-ou-studio-geneve-comparatif)'),
  updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet'
  AND content_fr NOT LIKE '%](/blog/coliving-colocation-ou-studio-geneve-comparatif)%'
  AND (content_fr LIKE '%pas forcément plus cher qu''un studio tout compris%' OR content_en LIKE '%compare total budget (rent + charges + furniture + transport) rather than rent alone%');

-- Lien entrant depuis « trouver-colocation-geneve-frontalier » (ancre FR « qui gèrent tout de A à Z », EN « who handle everything end to end ») — idempotent
UPDATE public.blog_posts SET
  content_fr = replace(content_fr, 'qui gèrent tout de A à Z', '[qui gèrent tout de A à Z](/blog/coliving-colocation-ou-studio-geneve-comparatif)'),
  content_en = replace(content_en, 'who handle everything end to end', '[who handle everything end to end](/en/blog/coliving-colocation-ou-studio-geneve-comparatif)'),
  updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier'
  AND content_fr NOT LIKE '%](/blog/coliving-colocation-ou-studio-geneve-comparatif)%'
  AND (content_fr LIKE '%qui gèrent tout de A à Z%' OR content_en LIKE '%who handle everything end to end%');

-- Consolidation de « coliving-vs-colocation-differences » dans « coliving-colocation-ou-studio-geneve-comparatif » : dépublication (JAMAIS de DELETE — runbook scripts/consolidation/00-RUNBOOK.md)
UPDATE public.blog_posts SET is_published = false, updated_at = now() WHERE slug = 'coliving-vs-colocation-differences';
-- Repointage des liens internes vers l'ancien slug (FR, EN, et liens /blog/ écrits dans l'EN)
UPDATE public.blog_posts SET
  content_fr = replace(content_fr, '](/blog/coliving-vs-colocation-differences)', '](/blog/coliving-colocation-ou-studio-geneve-comparatif)'),
  content_en = replace(replace(content_en, '](/en/blog/coliving-vs-colocation-differences)', '](/en/blog/coliving-colocation-ou-studio-geneve-comparatif)'), '](/blog/coliving-vs-colocation-differences)', '](/en/blog/coliving-colocation-ou-studio-geneve-comparatif)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/coliving-vs-colocation-differences)%' OR content_en LIKE '%/blog/coliving-vs-colocation-differences)%';
-- Côté code (même PR) : node scripts/redirects.mjs --add /blog/coliving-vs-colocation-differences /blog/coliving-colocation-ou-studio-geneve-comparatif ; retirer « coliving-vs-colocation-differences » de src/data/blogIntentBuckets.ts ;
-- ajouter la paire à scripts/redirects.expected.json.

-- Consolidation de « coliving-vs-colocation-choisir-mode-vie-geneve-frontalier » dans « coliving-colocation-ou-studio-geneve-comparatif » : dépublication (JAMAIS de DELETE — runbook scripts/consolidation/00-RUNBOOK.md)
UPDATE public.blog_posts SET is_published = false, updated_at = now() WHERE slug = 'coliving-vs-colocation-choisir-mode-vie-geneve-frontalier';
-- Repointage des liens internes vers l'ancien slug (FR, EN, et liens /blog/ écrits dans l'EN)
UPDATE public.blog_posts SET
  content_fr = replace(content_fr, '](/blog/coliving-vs-colocation-choisir-mode-vie-geneve-frontalier)', '](/blog/coliving-colocation-ou-studio-geneve-comparatif)'),
  content_en = replace(replace(content_en, '](/en/blog/coliving-vs-colocation-choisir-mode-vie-geneve-frontalier)', '](/en/blog/coliving-colocation-ou-studio-geneve-comparatif)'), '](/blog/coliving-vs-colocation-choisir-mode-vie-geneve-frontalier)', '](/en/blog/coliving-colocation-ou-studio-geneve-comparatif)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/coliving-vs-colocation-choisir-mode-vie-geneve-frontalier)%' OR content_en LIKE '%/blog/coliving-vs-colocation-choisir-mode-vie-geneve-frontalier)%';
-- Côté code (même PR) : node scripts/redirects.mjs --add /blog/coliving-vs-colocation-choisir-mode-vie-geneve-frontalier /blog/coliving-colocation-ou-studio-geneve-comparatif ; retirer « coliving-vs-colocation-choisir-mode-vie-geneve-frontalier » de src/data/blogIntentBuckets.ts ;
-- ajouter la paire à scripts/redirects.expected.json.

-- Consolidation de « studio-geneve-vs-colocation-france-budget » dans « coliving-colocation-ou-studio-geneve-comparatif » : dépublication (JAMAIS de DELETE — runbook scripts/consolidation/00-RUNBOOK.md)
UPDATE public.blog_posts SET is_published = false, updated_at = now() WHERE slug = 'studio-geneve-vs-colocation-france-budget';
-- Repointage des liens internes vers l'ancien slug (FR, EN, et liens /blog/ écrits dans l'EN)
UPDATE public.blog_posts SET
  content_fr = replace(content_fr, '](/blog/studio-geneve-vs-colocation-france-budget)', '](/blog/coliving-colocation-ou-studio-geneve-comparatif)'),
  content_en = replace(replace(content_en, '](/en/blog/studio-geneve-vs-colocation-france-budget)', '](/en/blog/coliving-colocation-ou-studio-geneve-comparatif)'), '](/blog/studio-geneve-vs-colocation-france-budget)', '](/en/blog/coliving-colocation-ou-studio-geneve-comparatif)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/studio-geneve-vs-colocation-france-budget)%' OR content_en LIKE '%/blog/studio-geneve-vs-colocation-france-budget)%';
-- Côté code (même PR) : node scripts/redirects.mjs --add /blog/studio-geneve-vs-colocation-france-budget /blog/coliving-colocation-ou-studio-geneve-comparatif ; retirer « studio-geneve-vs-colocation-france-budget » de src/data/blogIntentBuckets.ts ;
-- ajouter la paire à scripts/redirects.expected.json.

-- 2. C1 : contenu depuis content/decision-pages/s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france.{fr,en}.md
UPDATE public.blog_posts SET
  title_fr = 'S''installer à Genève : côté Suisse ou France ?',
  title_en = 'Moving to Geneva: Swiss side or French side?',
  excerpt_fr = 'Tu arrives à Genève avec un contrat et tu hésites entre la Suisse et la France voisine ? Ton permis décide, ton budget et ton délai font le reste : le guide pour trancher en une lecture.',
  excerpt_en = 'Arriving in Geneva with a contract and hesitating between Switzerland and neighbouring France? Your permit decides, your budget and timeline do the rest: the guide to settle it in one read.',
  meta_description_fr = 'Suisse ou France voisine quand tu arrives à Genève ? Permis G ou B, dossier sans garant, délai réaliste, impôt et LAMal : le comparatif pour décider.',
  meta_description_en = 'Switzerland or the French side when you move to Geneva? G or B permit, no-guarantor file, realistic timeline, tax and health insurance: the comparison.',
  content_fr = $fr$Tu as signé, ou tu vas signer, un contrat à Genève, et tu hésites entre habiter en Suisse et habiter en France voisine. Réponse courte : ton permis décide de ce que tu as le droit de faire, ton budget et ton délai décident du reste, et pour la plupart des salariés qui arrivent, la France voisine est possible dès le premier jour à condition de connaître trois règles. Ce guide est écrit pour les expatriés qui débarquent avec un contrat suisse, et surtout pour ceux qui doivent être installés dans les trente jours.

**En bref**
- La vraie question n'est pas « Suisse ou France ? » mais « quel permis, quel budget, quel délai ? ».
- Un salarié de l'UE ou de l'AELE peut vivre côté France dès son arrivée ; un ressortissant d'un autre pays doit d'abord avoir vécu six mois dans la zone frontalière (OCPM, 2026).
- Le dossier de location côté Genève est le vrai obstacle des premières semaines : fiches de salaire suisses, garant, dépôt jusqu'à trois mois. Côté France, des options s'en passent, dont le coliving.

## Ce qui tranche vraiment : permis, budget, délai

Ce n'est pas une affaire de goût, c'est une affaire de règles. Trois paramètres décident avant tout le reste : ton permis (où tu as le droit d'habiter), ton budget net après impôt à la source (ce que tu peux payer) et ton délai (ce qui est réaliste avant ton premier jour).

Le permis d'abord. Si tu habites en Suisse avec un contrat suisse, tu reçois un permis de séjour, en général un permis B. Si tu habites en France et travailles à Genève, tu es frontalier et tu reçois un permis G, demandé auprès de l'Office cantonal de la population et des migrations (OCPM). La différence, c'est qui y a droit tout de suite.

Le budget ensuite. À Genève, l'impôt est retenu à la source sur ton salaire dans les deux cas. Ce qui change, c'est le logement : d'après les annonces relevées en 2026, un studio à Genève se loue entre 1 200 et 2 500 CHF par mois hors charges, avec un taux de vacance inférieur à 1 % (OCSTAT). Côté France, le même budget donne une chambre dans une maison ou un appartement entier, avec un bail français, un dossier français et un trajet quotidien.

Le délai enfin. Trouver un logement à Genève prend souvent quatre à huit semaines sans historique locatif suisse ni fiches de salaire suisses. Côté France, une colocation se trouve en deux à six semaines. Chez nous, le délai médian entre la candidature et l'emménagement est de trente jours (données 2026), et 72 h suffisent dès le premier contact quand une chambre est disponible.

## Quatre profils, quatre marges de manœuvre

**Salarié citoyen de l'UE ou de l'AELE.** Tu peux habiter côté France dès ton arrivée. Le permis G se demande sur la base de ton contrat de travail ; la seule contrainte durable est de rentrer à ton domicile français au moins une fois par semaine (OCPM, page « Demander un permis de travail frontalier », mise à jour juillet 2025). Tu peux donc signer un bail en France avant ton premier jour, puis lancer la demande.

**Ressortissant d'un pays hors UE/AELE.** C'est le profil pour lequel la France voisine n'est pas automatique. Pour un permis G, l'OCPM exige d'avoir « depuis six mois au moins, son domicile régulier dans la zone frontalière voisine », un droit de séjour durable dans le pays voisin, et de « retourner au moins un jour par semaine dans son domicile à l'étranger » ; l'employeur dépose la demande, doit prouver une recherche infructueuse sur les marchés suisse et européen, et le délai annoncé est de douze semaines (OCPM, page « Activité salariée pour frontalier hors UE/AELE », mise à jour du 16 février 2026). En clair : si tu arrives de l'extérieur de l'Europe avec un permis B, tu commences en Suisse, et la France voisine devient une option après six mois de résidence régulière en zone frontalière, avec un titre de séjour français durable. Vérifie ta situation avec ton employeur et l'OCPM avant de signer quoi que ce soit.

**Personnel des organisations internationales.** Avec une carte de légitimation du DFAE, tu es dans un cadre à part. Beaucoup de fonctionnaires internationaux vivent en France voisine, et la bourse du logement du Centre d'accueil de la Genève internationale (CAGI) publie des offres à Genève, dans le canton de Vaud et en France voisine. Les modalités de résidence en France passent par le service du protocole de ton organisation : renseigne-toi avant de t'engager sur un bail.

**Couple ou famille.** Le permis du conjoint dépend de sa nationalité et de son activité, et une famille a besoin d'un logement entier, d'écoles et souvent d'une voiture : la question devient quel côté offre ce logement dans ton budget, avec un trajet supportable pour les deux. Pour un couple sans enfant arrivé avec un seul contrat, trois à six mois de transition côté France sont fréquents, le temps de chercher sans pression.

## Suisse ou France : le tableau qui tranche

| Critère | Habiter à Genève | Habiter côté France |
|---|---|---|
| Loyer d'un studio | 1 200 à 2 500 CHF hors charges | 1 300 à 1 400 € charges comprises pour 27 à 30 m² meublés à Annemasse (annonces, septembre 2026) |
| Dossier de location | Trois fiches de salaire suisses, extrait des poursuites, souvent un garant ou une garantie bancaire | Fiches de salaire ou contrat de travail, souvent un garant en France pour une location classique |
| Dépôt de garantie | Jusqu'à trois mois de loyer, sur un compte bloqué à ton nom (art. 257e du Code des obligations) | Un à deux mois de loyer selon le bail ; deux mois hors charges en meublé |
| Délai réaliste | Quatre à huit semaines sans historique suisse | Deux à six semaines en colocation classique, une à deux semaines en coliving |
| Impôt sur le salaire | Retenu à la source, puis déclaration genevoise | Retenu à la source à Genève ; déclaration en France des revenus mondiaux, sans double imposition ; quasi-résident possible si 90 % de tes revenus sont imposables en Suisse (AFC Genève, formulaire DRIS/TOU avant le 31 mars) |
| Assurance maladie | LAMal obligatoire | Droit d'option dans les trois mois suivant la prise d'emploi : LAMal ou assurance française ; choix irrévocable, LAMal par défaut (ameli.fr, avril 2026) |
| Trajet domicile-travail | Tram, bus ou vélo dans la ville | Depuis Annemasse, Genève Eaux-Vives en 8 minutes de Léman Express et Cornavin en 20 minutes environ ; compte 20 minutes porte-à-porte jusqu'au centre depuis Ville-la-Grand, Ambilly ou Annemasse |
| Chômage en cas de perte d'emploi | Assurance chômage suisse | Indemnisation par France Travail sur la base du salaire suisse, avec le document U1 (Unédic, 2026) |

Lecture rapide : citoyen de l'UE, célibataire, délai court, la colonne de droite marche dès la première semaine ; arrivée de l'extérieur de l'Europe ou famille, la colonne de gauche est ton point de départ.

## Sans fiche de salaire suisse ni garant : ce qui passe, ce qui bloque

C'est l'objection numéro un des nouveaux arrivants, et elle est fondée. À Genève, une régie demande le plus souvent trois fiches de salaire, un extrait des poursuites et une garantie de loyer ; sans historique suisse, ton dossier passe derrière celui d'un résident. Côté France, une agence classique demande des fiches de salaire et, très souvent, un garant domicilié en France, ce qu'un expatrié n'a pas.

Ce qui passe : les logements dont le bailleur évalue ton contrat de travail plutôt que ton passé. Chez La Villa, le dossier tient en trois pièces, un contrat de travail signé ou une promesse d'embauche, une pièce d'identité, et la caution de {{CAUTION_MOIS}} mois de loyer hors charges. Un garant n'est demandé qu'au cas par cas, quand le contrat ne couvre pas le loyer, et on te le dit avant la visite, jamais après. Les résidences hôtelières passent aussi, carte bancaire en main, à un prix qui ne dure pas.

Ce qui bloque : un studio en ville dans les quatre premières semaines, sauf relation personnelle ou logement d'entreprise. Beaucoup de nos résidents ont commencé côté France, constitué trois fiches de salaire suisses, puis déménagé, ou sont restés.

## Les options de logement, catégorie par catégorie

| Option | Prix | Délai réaliste | Dossier demandé | Durée minimum |
|---|---|---|---|---|
| Studio en ville (Genève) | 1 200 à 2 500 CHF hors charges | 4 à 8 semaines | 3 fiches de salaire suisses, extrait des poursuites, garant ou garantie bancaire, dépôt jusqu'à 3 mois | 12 mois en pratique |
| Colocation classique côté France | 600 à 1 000 € selon la ville (annonces, septembre 2026) | 2 à 6 semaines | Fiches de salaire, souvent un garant en France, dépôt 1 à 2 mois | bail d'un an, préavis d'un mois en meublé |
| Coliving côté France (La Villa) | dès {{PRIX_DES}}/1 470 € tout inclus, {{PRIX_PRIVATIF}}/1 530 € avec salle d'eau privative | 72 h dès le premier contact si une chambre est disponible | Contrat de travail ou promesse d'embauche, pièce d'identité, caution {{CAUTION_MOIS}} mois hors charges | aucune : bail de 12 mois, préavis d'un mois |
| Studio meublé ou appart'hôtel côté France | 1 300 à 1 600 € charges comprises (annonces, septembre 2026) | 1 jour à 2 semaines | Carte bancaire ou dossier léger | 1 nuit à 1 mois |
| Appart'hôtel à Genève | 700 à 1 700 CHF la semaine selon la résidence et la saison (tarifs affichés, septembre 2026) | 1 jour | Carte bancaire | 1 nuit |

<!-- entity-facts -->

Pour un nouveau job dans un mois, la mécanique côté coliving est simple : dossier en deux minutes, [réponse sous 48 h](/candidature), visite sur place ou en visio, bail signé en ligne, emménagement 72 h après ton premier contact si une chambre est disponible, et [les chambres libres](/chambres-disponibles) sont visibles en direct. Si tu vises une colocation classique ou un studio, le [guide pour trouver une colocation à Genève](/blog/trouver-colocation-geneve-frontalier) détaille les portails, les groupes et les pièges.

## Les 30 premiers jours, semaine par semaine

**Semaine 1, avant même d'arriver.** Tu choisis ton camp avec le tableau ci-dessus. Si c'est la France voisine, tu envoies deux ou trois candidatures et tu demandes une visite en visio. Tu réunis les pièces universelles : passeport, contrat de travail, attestation de l'employeur.

**Semaine 2, l'arrivée.** Tu signes ton bail, tu ouvres un compte bancaire (une banque suisse pour le salaire, une banque française si tu vis en France), et ton employeur lance le permis B ou G. Si tu vis côté France, note la date de ta prise d'emploi : ton droit d'option pour l'assurance maladie court à partir de là, pendant trois mois, et le choix est irrévocable (ameli.fr, avril 2026). Demande deux devis avant la fin du deuxième mois.

**Semaine 3, l'administratif qui compte.** Impôts : rien à faire tout de suite, l'impôt est retenu à la source ; tu noteras la demande de quasi-résident pour le printemps suivant si 90 % de tes revenus sont imposables en Suisse. Abonnement Léman Express ou TPG, médecin traitant.

**Semaine 4, le premier bilan.** Le logement choisi tient-il ses promesses de trajet et de budget ? Si oui, tu prolonges. Si non, un bail comme le nôtre te laisse partir avec un mois de préavis sans avoir perdu l'année.

## Quand ce n'est pas le bon choix

La France voisine n'est pas faite pour tout le monde, autant le dire. Si tu es ressortissant d'un pays hors UE/AELE et que tu arrives directement de l'étranger, commence en Suisse : la règle des six mois est claire. Si tu viens pour une mission de quelques semaines, une résidence hôtelière est plus adaptée qu'un bail. Si tu arrives en famille avec des enfants, il te faut un logement entier et une école, pas une chambre dans une maison partagée. Si ton travail t'impose une voiture, le trajet frontalier aux heures de pointe ne ressemble pas aux temps de train affichés. Et si ton budget logement est inférieur à 1 200 € par mois tout compris, une colocation classique côté France sera plus juste qu'un coliving. Pour comparer les villes frontalières entre elles, lis [où habiter côté France quand on travaille en Suisse](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).

## Questions fréquentes

**Je peux vivre en France avec un permis B ?**

Pas en gardant le permis B : habiter en France et travailler à Genève, c'est le statut de frontalier, donc un permis G. Pour un citoyen de l'UE ou de l'AELE, le changement se fait sur simple demande avec le contrat de travail. Pour un ressortissant d'un autre pays, l'OCPM exige six mois de domicile régulier dans la zone frontalière et un droit de séjour durable en France (page mise à jour le 16 février 2026). Dans le doute, demande une confirmation écrite à ton employeur et à l'OCPM avant de signer un bail.

**Combien de temps pour trouver un logement ?**

À Genève, compte quatre à huit semaines sans historique locatif suisse. Côté France, deux à six semaines pour une colocation classique, et une à deux semaines en coliving quand une chambre est libre. Chez La Villa, le délai médian entre la candidature et l'emménagement est de trente jours (données 2026), et 72 h suffisent dès le premier contact quand une chambre est disponible.

**Sans garant suisse, c'est possible ?**

Oui. Une régie genevoise demande le plus souvent un garant ou une garantie bancaire, mais côté France, plusieurs bailleurs évaluent ton contrat de travail plutôt qu'un garant. Chez nous, le dossier se limite au contrat de travail ou à la promesse d'embauche, à une pièce d'identité et à la caution de {{CAUTION_MOIS}} mois hors charges ; un garant n'est discuté qu'au cas par cas, avant la visite.

**Le coût de la vie est-il vraiment plus bas côté France ?**

Pour le logement, oui, à surface égale : c'est ce que montrent les annonces relevées par notre Observatoire en juin 2026. Pour le reste, ça dépend de ton mode de vie : les courses coûtent moins cher en France, mais l'assurance maladie française se calcule sur ton revenu et l'essence s'ajoute si tu roules. Compare le coût total mensuel, logement, charges, transport et assurance compris, pas le loyer affiché.

**Et si je perds mon job ?**

Un frontalier qui perd son emploi est indemnisé par son pays de résidence, donc par France Travail, sur la base de son salaire suisse, avec le document U1 remis par l'assurance chômage suisse (France Travail et Unédic, 2026). Ton permis G tombe avec le contrat. Côté logement, un bail avec un mois de préavis, comme chez La Villa, limite le risque : tu n'es pas engagé sur une année.
$fr$,
  content_en = $en$You have signed, or are about to sign, a contract in Geneva, and you are hesitating between living in Switzerland and living just across the border in France. Short answer: your permit decides what you are allowed to do, your budget and your timeline decide the rest, and for most employees arriving from abroad, the French side is possible from day one as long as you know three rules. This guide is written for expats landing with a Swiss contract, and above all for those who need to be settled within thirty days.

**In short**
- The real question is not "Switzerland or France?" but "which permit, which budget, which timeline?".
- An EU or EFTA employee can live on the French side from arrival; a national of any other country must first have lived six months in the border zone (OCPM, 2026).
- The Geneva rental file is the real obstacle of the first weeks: Swiss payslips, a guarantor, a deposit of up to three months. On the French side some options skip all of that, coliving among them, one category among several.

## What really decides: permit, budget, timeline

This is not a matter of taste, it is a matter of rules. Three parameters settle everything else: your permit (it sets where you are allowed to live), your net budget after tax at source (it sets what you can pay without putting yourself at risk), and your timeline (it sets what is realistic before your first day at work).

The permit first. If you live in Switzerland with a Swiss contract, you receive a residence permit, usually a B permit. If you live in France and work in Geneva, you are a cross-border worker and receive a G permit, requested from the cantonal population and migration office (OCPM). The difference is who is entitled to which one right away.

The budget next. In Geneva, tax is withheld at source from your salary in both cases. What changes is housing: according to the listings surveyed in 2026, a studio in Geneva rents for 1,200 to 2,500 CHF a month excluding charges, with a vacancy rate below 1% (OCSTAT). On the French side, the same budget gets you a room in a house or a whole flat, with a French lease, a French file and a daily commute.

The timeline last. Finding a flat in Geneva often takes four to eight weeks without a Swiss rental history or Swiss payslips. On the French side, a classic flatshare takes two to six weeks. With us, the median time between application and move-in is thirty days (2026 data), and 72 h from your first contact is enough when a room is available.

## Four profiles, four degrees of freedom

**EU or EFTA employee.** You can live on the French side from arrival. The G permit is requested on the basis of your employment contract; the one lasting constraint is to return to your French home at least once a week (OCPM, "Applying for a cross-border work permit" page, updated July 2025). So you can sign a lease in France before your first day at work, then start the application.

**National of a country outside the EU/EFTA.** This is the profile for which neighbouring France is not automatic. For a G permit, the OCPM requires that you have had "for at least six months, your regular domicile in the neighbouring border zone", a durable right of residence in the neighbouring country, and that you "return at least one day a week to your home abroad"; the employer files the application, must prove an unsuccessful search on the Swiss and European labour markets, and the announced processing time is twelve weeks (OCPM, "Salaried work for non-EU/EFTA cross-border workers" page, updated 16 February 2026). In plain terms: if you arrive from outside Europe with a B permit, you start in Switzerland, and the French side becomes an option after six months of regular residence in the border zone, with a durable French residence title. Check your situation with your employer and the OCPM before signing anything.

**Staff of international organisations.** With a legitimation card from the Swiss foreign ministry (DFAE), you are in a category of your own. Many international civil servants live in neighbouring France, and the Geneva Welcome Centre (CAGI) lists housing in Geneva, in the canton of Vaud and in neighbouring France on its housing platform. The residence formalities in France go through your organisation's protocol service: ask before committing to a lease.

**Couple or family.** The spouse's permit follows its own logic depending on nationality and activity, and a family needs a whole home, schools and often a car. The question becomes: which side offers the family home within your budget, with a commute both of you can live with? For a couple without children arriving with a single contract, a transitional solution on the French side for three to six months is common, the time to look for the long-term home without pressure.

## Switzerland or France: the table that settles it

| Criterion | Living in Geneva | Living on the French side |
|---|---|---|
| Rent for a studio | 1,200 to 2,500 CHF excluding charges | 1,300 to 1,400 € including charges for 27 to 30 m² furnished in Annemasse (listings, September 2026) |
| Rental file | Three Swiss payslips, debt-collection register extract, often a guarantor or a bank guarantee | Payslips or employment contract, often a guarantor based in France for a classic rental |
| Deposit | Up to three months' rent, on a blocked account in your name (art. 257e of the Swiss Code of Obligations) | One to two months' rent depending on the lease; two months excluding charges for furnished rentals |
| Realistic timeline | Four to eight weeks without a Swiss history | Two to six weeks in a classic flatshare, one to two weeks in coliving |
| Tax on your salary | Withheld at source, then a Geneva tax return | Withheld at source in Geneva; worldwide income declared in France, without double taxation; quasi-resident status possible if 90% of your income is taxable in Switzerland (Geneva tax administration, DRIS/TOU form before 31 March) |
| Health insurance | Compulsory LAMal | Right of option within three months of starting work: LAMal or French health insurance; irrevocable choice, LAMal by default (ameli.fr, April 2026) |
| Commute | Tram, bus or bike within the city | From Annemasse, Geneva Eaux-Vives in 8 minutes by Léman Express and Cornavin in about 20; count 20 minutes door-to-door to the centre from Ville-la-Grand, Ambilly or Annemasse |
| Unemployment if you lose your job | Swiss unemployment insurance | Paid by France Travail on the basis of your Swiss salary, with the U1 document (Unédic, 2026) |

Quick read: EU citizen, single, short timeline, the right-hand column works from the first week; arriving from outside Europe or as a family, the left-hand column is your starting point.

## No Swiss payslips, no guarantor: what works, what does not

It is the number one objection of newcomers, and it is well founded. In Geneva, a letting agency most often asks for three payslips, a debt-collection extract and a rent guarantee; without a Swiss history, your file ranks behind a resident's. On the French side, a classic agency asks for payslips and, very often, a guarantor based in France, which an expat does not have.

What works: housing where the landlord assesses your employment contract rather than your past. At La Villa, the file comes down to three items, a signed employment contract or a job offer, an ID, and the deposit of {{CAUTION_MOIS}} months' rent excluding charges. A guarantor is only asked for case by case, when the contract does not cover the rent, and we tell you before the visit, never after. Serviced residences work too, with a credit card, at a price not meant to last.

What does not work: a studio in the city within the first four weeks, unless you have a personal connection or company housing. Many of our residents started on the French side, built up three Swiss payslips, then moved, or stayed.

## The housing options, category by category

| Option | Price | Realistic timeline | Paperwork required | Minimum stay |
|---|---|---|---|---|
| Studio in the city (Geneva) | 1,200 to 2,500 CHF excluding charges | 4 to 8 weeks | 3 Swiss payslips, debt-collection extract, guarantor or bank guarantee, deposit of up to 3 months | 12 months in practice |
| Classic flatshare, French side | 600 to 1,000 € depending on the town (listings, September 2026) | 2 to 6 weeks | Payslips, often a guarantor in France, 1 to 2 months' deposit | one-year lease, one month's notice when furnished |
| Coliving, French side (La Villa) | from {{PRIX_DES}}/€1,470 all-inclusive, {{PRIX_PRIVATIF}}/€1,530 with a private shower room | 72 h from first contact if a room is available | Employment contract or job offer, ID, deposit of {{CAUTION_MOIS}} months excluding charges | none: 12-month lease, one month's notice |
| Furnished studio or aparthotel, French side | 1,300 to 1,600 € including charges (listings, September 2026) | 1 day to 2 weeks | Credit card or light file | 1 night to 1 month |
| Aparthotel in Geneva | 700 to 1,700 CHF a week depending on the residence and the season (rates displayed, September 2026) | 1 day | Credit card | 1 night |

<!-- entity-facts -->

For a new job in a month, the coliving mechanics are simple: a two-minute application, [a reply within 48 h](/en/candidature), a visit on site or by video, a lease signed online, move-in 72 h after your first contact if a room is available, and [the free rooms](/en/chambres-disponibles) are visible live. If you are aiming for a classic flatshare or a studio instead, the [guide to finding a flatshare in Geneva](/en/blog/trouver-colocation-geneve-frontalier) covers the portals, the groups and the traps.

## The first 30 days, week by week

**Week 1, before you even arrive.** You pick your side with the table above. If it is the French side, you send two or three applications and ask for a video visit. You gather the universal documents: passport, employment contract, your employer's attestation for the permit.

**Week 2, arrival.** You sign your lease, you open a bank account (a Swiss bank for the salary, a French bank if you live in France), and your employer launches the B or G permit. If you live on the French side, note the date you started work: your health-insurance right of option runs from that date, for three months, and the choice is irrevocable (ameli.fr, April 2026). Ask for two quotes before the end of the second month.

**Week 3, the paperwork that matters.** Taxes: nothing to do right away, tax is withheld at source; you note the quasi-resident request for the following spring if 90% of your income is taxable in Switzerland. Léman Express or TPG pass, family doctor.

**Week 4, the first review.** Does the housing you chose keep its promises on commute and budget? If yes, you extend. If not, a lease like ours lets you leave with one month's notice without having lost the year.

## When it is not the right choice

Neighbouring France is not for everyone, and saying so saves us pointless visits. If you are a national of a country outside the EU/EFTA and you arrive straight from abroad, start in Switzerland: the six-month rule is clear. If you are coming for an assignment of a few weeks, a serviced residence suits you better than a lease. If you arrive as a family with children, you need a whole home and a school, not a room in a shared house. If your job requires a car every day, the cross-border drive at rush hour looks nothing like the train times displayed. And if your housing budget is below 1,200 € a month all inclusive, a classic flatshare on the French side will be a better fit than a coliving. To compare the border towns with each other, read [where to live on the French side when you work in Switzerland](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).

## Frequently asked questions

**Can I live in France with a B permit?**

Not while keeping the B permit: living in France and working in Geneva is cross-border status, hence a G permit. For an EU or EFTA citizen, the switch is made on simple request with the employment contract. For a national of another country, the OCPM requires six months of regular domicile in the border zone and a durable right of residence in France (page updated 16 February 2026). When in doubt, ask your employer and the OCPM for written confirmation before signing a lease.

**How long does it take to find housing?**

In Geneva, count four to eight weeks without a Swiss rental history, sometimes more in sought-after neighbourhoods. On the French side, two to six weeks for a classic flatshare, and one to two weeks in coliving when a room is free. At La Villa, the median time between application and move-in is thirty days (2026 data), and 72 h from your first contact is enough when a room is available.

**Is it possible without a Swiss guarantor?**

Yes. A Geneva letting agency most often asks for a guarantor or a bank guarantee, but on the French side several landlords assess your employment contract rather than a guarantor. With us, the file is limited to the employment contract or job offer, an ID and the deposit of {{CAUTION_MOIS}} months excluding charges; a guarantor is only discussed case by case, before the visit.

**Is the cost of living really lower on the French side?**

For housing, yes, at equal size: that is what the listings surveyed by our Observatory in June 2026 show. For everything else, it depends on your lifestyle. Groceries and restaurants cost less in France, but French health insurance is calculated on your income, fuel and tolls add up if you drive, and your salary remains taxed at source in Geneva. The right method: compare the total monthly cost, housing, bills, transport and insurance included, not the advertised rent.

**What if I lose my job?**

A cross-border worker who loses their job is paid by their country of residence, so by France Travail, on the basis of their Swiss salary, with the U1 document issued by the Swiss unemployment insurance (France Travail and Unédic, 2026). Your G permit ends with the contract. On the housing side, a lease with one month's notice, like La Villa's, limits the risk: you are not committed for a year.
$en$,
  author = 'Jerome Austin',
  category = 'geneva',
  image_url = '/images/la villa coliving le loft piscine.webp',
  read_time_min = 13,
  tags = ARRAY['expatrié', 'genève', 'permis G', 'installation', 'frontalier'],
  updated_at = now()
WHERE slug = 's-installer-a-geneve-expatrie-cote-suisse-ou-cote-france';

-- 3. C3 : contenu depuis content/decision-pages/vivre-a-annemasse-quand-on-travaille-a-geneve.{fr,en}.md
UPDATE public.blog_posts SET
  title_fr = 'Vivre à Annemasse quand on travaille à Genève',
  title_en = 'Living in Annemasse when you work in Geneva',
  excerpt_fr = 'Gare du Léman Express, tram, centre animé, courses et loyers aux prix français, ville en pleine transformation : pourquoi Annemasse est l''un des meilleurs endroits où vivre quand on travaille à Genève, et quel quartier choisir.',
  excerpt_en = 'Léman Express station, tram, lively centre, groceries and rents at French prices, a town in full transformation: why Annemasse is one of the best places to live when you work in Geneva, and which district to choose.',
  meta_description_fr = 'Annemasse quand on travaille à Genève : 20 min du centre en Léman Express, tram prolongé en 2026, centre animé, loyers et courses aux prix français.',
  meta_description_en = 'Annemasse when you work in Geneva: 20 min to the centre by Léman Express, tram extended in 2026, lively centre, French rents and groceries.',
  content_fr = $fr$Oui, Annemasse est un bon endroit pour vivre quand on travaille à Genève, et c'est même l'un des plus pratiques du Grand Genève : une gare du Léman Express qui met le centre de Genève à 20 minutes porte-à-porte, un tram qui entre en ville sans changement, un centre-ville qui vit le soir, des loyers et des courses aux prix français, et un chantier de transformation qui change le visage de la ville d'ici 2030. Ce guide est écrit pour celles et ceux qui hésitent entre Annemasse, Ville-la-Grand et Ambilly, ou qui ont lu des choses contradictoires sur la ville et veulent des faits datés.

**En bref**
- La vraie question n'est pas « Annemasse ou pas », mais « à quelle distance de la gare ou du tram » : c'est ça qui fait la qualité de vie d'un frontalier.
- La ville est en pleine transformation : écoquartier de l'Étoile autour de la gare (1 200 logements), rénovation de Perrier-Livron-Château-Rouge (plus de 90 millions d'euros), tram 17 prolongé fin 2026.
- Le coût de la vie est celui de la France, le salaire celui de Genève : les courses coûtent nettement moins cher qu'en Suisse, et un studio se loue deux à trois fois moins qu'à Genève.

## La réponse courte : oui, si tu vises la gare ou le tram

Annemasse est la ville-centre d'une agglomération de communes collées à la frontière genevoise : 37 600 habitants (INSEE, population 2023), une gare qui est le terminus français du Léman Express, un tram transfrontalier, des commerces, un marché, des restaurants. Ce n'est pas une banlieue-dortoir : c'est une petite ville complète, à dix minutes à pied de la Suisse.

Ce qui fait la différence pour un frontalier, ce n'est pas la commune mais l'adresse. À distance de marche de la gare ou d'un arrêt du tram 17, tu vis sans voiture, tu gagnes une heure par jour par rapport à la douane en voiture, et tu profites du centre à pied. Au-delà de quinze minutes à pied des transports, l'avantage s'effrite. Le reste de ce guide t'aide à choisir cette adresse.

## Annemasse en 2026 : la ville qui change de visage

Trois chantiers publics redessinent la ville, et ils sont documentés par l'agglomération.

**L'écoquartier de l'Étoile, autour de la gare.** Sur 19 hectares à cheval sur Annemasse, Ambilly et Ville-la-Grand, le projet Étoile Annemasse-Genève construit un vrai quartier de gare : près de 1 200 logements, des bureaux, des commerces, un centre de formation, des espaces publics, avec 60 % des surfaces pour l'habitat et 40 % pour les activités (Annemasse Agglo). L'arrivée du Léman Express en 2019 a déclenché ce projet ; le pôle d'échanges relie déjà la gare au centre historique.

**Perrier, Livron et Château-Rouge.** Le programme de renouvellement urbain engagé depuis 2019, après un premier programme 2007-2019, représente plus de 90 millions d'euros : plus de 540 logements rénovés, un conservatoire, un gymnase réhabilité, une maison de santé, un tiers-lieu, et l'écoquartier Château-Rouge de 330 logements neufs dont le chantier a démarré en 2025 (Annemasse Agglo). Le tram 17 y aura son terminus.

**Le tram 17 prolongé.** Fin 2026, le tram qui relie Annemasse à Genève gagne trois arrêts dans la ville, Place Deffaugt, Barbusse et Perrier-Aubrac, passe à une rame toutes les six minutes en heure de pointe, et met la douane de Moillesulaz à douze minutes du nouveau terminus (Annemasse Agglo). À Ville-la-Grand, le centre-ville est lui aussi en travaux de réaménagement en 2026 (Ville de Ville-la-Grand).

Concrètement, pour toi : un quartier de gare neuf, plus de commerces et de services à pied, et une ville dont la valeur monte pendant que tu y habites.

## Les trajets : le Léman Express et le tram, la vraie raison d'habiter ici

Depuis la gare d'Annemasse, le Léman Express rejoint Genève Eaux-Vives en 8 minutes et Cornavin en 20 minutes environ, sans changement, avec un train toutes les dix minutes en heure de pointe. Depuis Ambilly, le tram 17 entre dans Genève par Moillesulaz. Compte 20 minutes porte-à-porte jusqu'au centre depuis Annemasse, Ville-la-Grand ou Ambilly : c'est moins que bien des trajets à l'intérieur de Genève.

Le vélo est l'autre option : les pistes cyclables passent la frontière à Moillesulaz, et beaucoup de résidents pédalent jusqu'aux Eaux-Vives en une vingtaine de minutes à la belle saison. Beaucoup de frontaliers finissent d'ailleurs sans voiture : train, tram et vélo suffisent au quotidien, et la douane en voiture aux heures de pointe est le trajet à éviter.

## Le centre-ville : marché, petits restos, cinéma et concerts

Le centre d'Annemasse se vit à pied. Le marché a lieu le mardi et le vendredi ; autour de la place de la Libération et des rues commerçantes, on trouve des petits restaurants de toutes les cuisines, des cafés, des bars, le cinéma Ciné Actuel et Château Rouge, la scène de musiques actuelles de l'agglomération, qui programme des concerts toute l'année. Le parc Montessuit, où le tram a aujourd'hui son terminus, fait le poumon vert du centre.

C'est le seul secteur de l'agglomération où l'on sort le soir sans voiture : les autres communes se couchent tôt. Si tu veux les restaurants en bas de chez toi et le calme pour dormir, choisis une rue perpendiculaire aux axes principaux plutôt qu'au-dessus d'un bar.

## Le coût de la vie côté France : courses, restos, loyers

C'est l'argument que tout le monde connaît, et il est vrai. La Suisse est le pays le plus cher d'Europe pour l'alimentation, autour de 60 % au-dessus de la moyenne européenne, quand la France est proche de cette moyenne (Eurostat, niveaux de prix comparés, 2024). Faire ses courses à Annemasse avec un salaire genevois, c'est l'écart le plus visible du statut de frontalier, et il se voit chaque semaine sur le ticket de caisse. Les restaurants et les sorties suivent la même logique.

Le logement ensuite. À Annemasse, un studio meublé se loue en ordre de grandeur 650 à 820 € par mois hors charges, un deux-pièces meublé 1 200 à 1 500 € charges comprises (annonces, septembre 2026). À Genève, d'après les annonces relevées en 2026, un studio se loue entre 1 200 et 2 500 CHF par mois hors charges. À surface égale, le rapport va de un à trois.

Ce qui ne baisse pas : ton salaire reste imposé à la source à Genève, l'assurance maladie se choisit dans les trois mois suivant la prise d'emploi entre LAMal et assurance française (ameli.fr, avril 2026), et l'essence s'ajoute si tu roules. La bonne méthode : compare le coût total mensuel, logement, charges, transport et assurance compris, pas le loyer affiché.

## Quel quartier pour quel mode de vie

**Le centre et la gare.** Pour sortir à pied, prendre le train sans y penser et vivre au milieu des commerces. Le quartier de gare est en chantier pour quelques années : c'est le prix d'un quartier neuf.

**Romagny.** Résidentiel, calme, à neuf minutes à pied de la gare : le secteur des frontaliers qui veulent le train sans la vie de gare. C'est là qu'est notre maison Le Lodge, ouverte en 2026, et ce n'est pas un hasard.

**Ambilly.** La commune la plus proche de la douane de Moillesulaz, avec le tram 17 à l'arrêt Croix-d'Ambilly : le raccourci vers Genève à pied ou à vélo. Notre maison Le Loft y est, à cinq minutes à pied du tram.

**Ville-la-Grand.** Pavillonnaire, verte, bordée par la réserve naturelle du Foron, frontière mitoyenne, un centre en cours de réaménagement : la commune familiale et calme de l'agglomération, à dix minutes à pied de la gare depuis notre maison La Villa.

**Vétraz-Monthoux.** Plus pavillonnaire encore, un cran plus loin des transports : le choix des familles avec voiture, moins celui d'un frontalier sans.

## Les options de logement, catégorie par catégorie

| Option | Prix | Délai réaliste | Dossier demandé | Durée minimum |
|---|---|---|---|---|
| Studio ou T2 meublé à Annemasse | 650 à 820 € hors charges pour un studio, 1 200 à 1 500 € charges comprises pour un T2 (annonces, 2026) | 2 à 6 semaines | Fiches de salaire, souvent un garant en France, dépôt 1 à 2 mois | bail d'un an, préavis d'un mois |
| Colocation classique dans l'agglomération | 700 à 900 € hors charges (ordres de grandeur 2026) | 2 à 6 semaines | Dossier complet, garant fréquent | bail d'un an, préavis d'un mois en meublé |
| Coliving côté France (La Villa) | dès {{PRIX_DES}}/1 470 € tout inclus, {{PRIX_PRIVATIF}}/1 530 € avec salle d'eau privative | 72 h dès le premier contact si une chambre est disponible | Contrat de travail ou promesse d'embauche, pièce d'identité, caution {{CAUTION_MOIS}} mois hors charges | aucune : bail de 12 mois, préavis d'un mois |
| Studio meublé ou appart'hôtel côté France | 1 300 à 1 600 € charges comprises (annonces, septembre 2026) | 1 jour à 2 semaines | Carte bancaire ou dossier léger | 1 nuit à 1 mois |

<!-- entity-facts -->

Nos trois maisons répondent chacune à un quartier de ce guide : Le Lodge à Romagny pour le train (gare à 9 minutes à pied), Le Loft à Ambilly pour le tram et la frontière à pied, La Villa à Ville-la-Grand pour le calme et le jardin. Les [chambres libres](/chambres-disponibles) sont visibles en direct, la [candidature prend deux minutes](/candidature), et si tu veux d'abord comparer les quartiers selon ton mode de vie, lis notre [guide des quartiers d'Annemasse par profil](/blog/quartiers-annemasse-ou-vivre-selon-profil).

## Quand ce n'est pas le bon choix

Si tu veux sortir tard à Genève plusieurs soirs par semaine, le dernier train et le dernier tram te rappelleront que tu habites de l'autre côté d'une frontière ; un logement côté suisse, ou un budget taxi, sera plus juste. Si ton travail t'impose une voiture chaque jour, la douane aux heures de pointe ne ressemble pas aux temps de train affichés : vise alors une commune plus éloignée des postes-frontière. Si tu arrives en famille, la carte scolaire et la desserte en bus comptent plus que tout ce qui précède : regarde Ville-la-Grand et Vétraz-Monthoux plutôt que le centre. Pour élargir le rayon, lis [où habiter côté France quand on travaille en Suisse](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).

## Questions fréquentes

**Annemasse, c'est sûr ?**

Oui, avec le bon sens qu'on applique à toute ville-centre : on choisit son immeuble et sa rue, et on préfère un parking fermé pour sa voiture. La ville a investi dans la tranquillité publique : un centre de supervision urbain relié à 70 caméras, bientôt 80, avec déport d'images vers la police nationale, et un nouveau bâtiment rue du Salève qui regroupe en 2026 la police municipale et la vidéoprotection (Ville d'Annemasse). Les secteurs résidentiels comme Romagny, Ville-la-Grand ou Ambilly sont calmes, et nos résidents y vivent depuis 2021 sans histoire.

**Où habiter à Annemasse quand on travaille à Genève ?**

À distance de marche de la gare ou du tram, dans un secteur résidentiel : Romagny et les rues calmes autour du centre pour le Léman Express, Ambilly pour le tram 17 et la frontière à pied, Ville-la-Grand pour le calme et le jardin. Depuis les trois, compte 20 minutes porte-à-porte jusqu'au centre de Genève.

**Combien de temps pour aller à Genève depuis Annemasse ?**

Depuis la gare d'Annemasse, le Léman Express met 8 minutes jusqu'à Genève Eaux-Vives et 20 minutes environ jusqu'à Cornavin, sans changement. Le tram 17 relie Ambilly et Annemasse à Genève par Moillesulaz. Porte-à-porte, compte 20 minutes jusqu'au centre.

**Les courses coûtent-elles vraiment moins cher côté France ?**

Oui, et nettement : la Suisse est le pays le plus cher d'Europe pour l'alimentation, autour de 60 % au-dessus de la moyenne européenne, quand la France est proche de cette moyenne (Eurostat, niveaux de prix 2024). Les résidents qui font leurs courses à Annemasse avec un salaire genevois le voient sur chaque ticket ; les restaurants et les sorties suivent la même logique.

**Que change le tram 17 en 2026 ?**

Fin 2026, la ligne 17 gagne trois arrêts dans Annemasse, Place Deffaugt, Barbusse et Perrier-Aubrac, passe à une rame toutes les six minutes en heure de pointe et met la douane de Moillesulaz à douze minutes du nouveau terminus (Annemasse Agglo). Pour un frontalier, ça veut dire un deuxième axe vers Genève, complémentaire du Léman Express, depuis le cœur de la ville.
$fr$,
  content_en = $en$Yes, Annemasse is a good place to live when you work in Geneva, and it is even one of the most practical in Greater Geneva: a Léman Express station that puts central Geneva 20 minutes door-to-door away, a tram that enters the city with no change, a town centre that is alive in the evening, rents and groceries at French prices, and a transformation programme that is changing the face of the town by 2030. This guide is written for those hesitating between Annemasse, Ville-la-Grand and Ambilly, or who have read contradictory things about the town and want dated facts.

**In short**
- The real question is not "Annemasse or not" but "how far from the station or the tram": that is what makes a cross-border worker's quality of life.
- The town is in full transformation: the Étoile eco-district around the station (1,200 homes), the renewal of Perrier-Livron-Château-Rouge (over 90 million euros), tram 17 extended at the end of 2026.
- The cost of living is France's, the salary is Geneva's: groceries cost markedly less than in Switzerland, and a studio rents for two to three times less than in Geneva.

## The short answer: yes, if you aim for the station or the tram

Annemasse is the central town of an agglomeration of communes pressed against the Geneva border: 37,600 inhabitants (INSEE, 2023 population), a station that is the French terminus of the Léman Express, a cross-border tram, shops, a market, restaurants. It is not a dormitory suburb: it is a small, complete town, a ten-minute walk from Switzerland.

What makes the difference for a cross-border worker is not the commune but the address. Within walking distance of the station or a tram 17 stop, you live without a car, you save an hour a day compared with driving through the border crossing, and you enjoy the centre on foot. Beyond fifteen minutes on foot from public transport, the advantage fades. The rest of this guide helps you choose that address.

## Annemasse in 2026: the town changing its face

Three public projects are redrawing the town, and the agglomeration documents them.

**The Étoile eco-district, around the station.** On 19 hectares straddling Annemasse, Ambilly and Ville-la-Grand, the Étoile Annemasse-Genève project is building a real station district: nearly 1,200 homes, offices, shops, a training centre, public spaces, with 60% of floor space for housing and 40% for activities (Annemasse Agglo). The arrival of the Léman Express in 2019 triggered the project; the transport hub already links the station to the historic centre.

**Perrier, Livron and Château-Rouge.** The urban renewal programme under way since 2019, after a first programme in 2007-2019, represents over 90 million euros: more than 540 renovated homes, a music conservatory, a rehabilitated gymnasium, a health centre, a community hub, and the Château-Rouge eco-district of 330 new homes whose construction started in 2025 (Annemasse Agglo). Tram 17 will have its terminus there.

**Tram 17 extended.** At the end of 2026, the tram linking Annemasse to Geneva gains three stops in the town, Place Deffaugt, Barbusse and Perrier-Aubrac, moves to a tram every six minutes at peak times, and puts the Moillesulaz border crossing twelve minutes from the new terminus (Annemasse Agglo). In Ville-la-Grand, the town centre is also being redeveloped in 2026 (Town of Ville-la-Grand).

In practice, for you: a brand-new station district, more shops and services on foot, and a town whose value rises while you live there.

## The commute: the Léman Express and the tram, the real reason to live here

From Annemasse station, the Léman Express reaches Geneva Eaux-Vives in 8 minutes and Cornavin in about 20, no change, with a train every ten minutes at peak times. From Ambilly, tram 17 enters Geneva through Moillesulaz. Count 20 minutes door-to-door to the centre from Annemasse, Ville-la-Grand or Ambilly: that is less than many commutes inside Geneva.

Cycling is the other option: the cycle paths cross the border at Moillesulaz, and many residents pedal to Eaux-Vives in about twenty minutes in the warm season. Many cross-border workers end up without a car: train, tram and bike are enough day to day, and driving through the border crossing at rush hour is the one commute to avoid.

## The town centre: market, small restaurants, cinema and concerts

Central Annemasse is lived on foot. The market takes place on Tuesdays and Fridays; around place de la Libération and the shopping streets you find small restaurants of every cuisine, cafés, bars, the Ciné Actuel cinema and Château Rouge, the agglomeration's live-music venue, which programmes concerts all year round. Parc Montessuit, where the tram currently ends, is the green lung of the centre.

It is the only area of the agglomeration where you go out at night without a car: the other communes go to bed early. If you want the restaurants downstairs and quiet to sleep, choose a street perpendicular to the main roads rather than above a bar.

## The cost of living on the French side: groceries, restaurants, rents

It is the argument everyone knows, and it is true. Switzerland is the most expensive country in Europe for food, around 60% above the European average, while France is close to that average (Eurostat, comparative price levels, 2024). Doing your shopping in Annemasse on a Geneva salary is the most visible gain of cross-border status, and it shows on every receipt. Restaurants and going out follow the same logic.

Housing next. In Annemasse, a furnished studio rents, as an order of magnitude, for 650 to 820 € a month excluding charges, a furnished one-bedroom flat for 1,200 to 1,500 € including charges (listings, September 2026). In Geneva, according to the listings surveyed in 2026, a studio rents for 1,200 to 2,500 CHF a month excluding charges. At equal size, the ratio runs from one to three.

What does not go down: your salary remains taxed at source in Geneva, health insurance is chosen within three months of starting work between LAMal and French insurance (ameli.fr, April 2026), and fuel adds up if you drive. The right method: compare the total monthly cost, housing, bills, transport and insurance included, not the advertised rent.

## Which district for which lifestyle

**The centre and the station.** To go out on foot, take the train without thinking and live among the shops. The station district is under construction for a few years: that is the price of a brand-new district.

**Romagny.** Residential, quiet, a nine-minute walk from the station: the area of cross-border workers who want the train without the station life. Our house Le Lodge is there, opened in 2026, and it is no coincidence.

**Ambilly.** The commune closest to the Moillesulaz crossing, with tram 17 at the Croix-d'Ambilly stop: the shortcut to Geneva on foot or by bike. Our house Le Loft is there, a five-minute walk from the tram.

**Ville-la-Grand.** Detached houses, greenery, bordered by the Foron nature reserve, the border next door, a town centre being redeveloped: the family-friendly, quiet commune of the agglomeration, a ten-minute walk from the station from our house La Villa.

**Vétraz-Monthoux.** Even more suburban, one notch further from public transport: the choice of families with a car, less that of a cross-border worker without one.

## The housing options, category by category

| Option | Price | Realistic timeline | Paperwork required | Minimum stay |
|---|---|---|---|---|
| Furnished studio or one-bedroom flat in Annemasse | 650 to 820 € excluding charges for a studio, 1,200 to 1,500 € including charges for a one-bedroom flat (listings, 2026) | 2 to 6 weeks | Payslips, often a guarantor in France, 1 to 2 months' deposit | one-year lease, one month's notice |
| Classic flatshare in the agglomeration | 700 to 900 € excluding charges (2026 orders of magnitude) | 2 to 6 weeks | Full file, guarantor frequent | one-year lease, one month's notice when furnished |
| Coliving, French side (La Villa) | from {{PRIX_DES}}/€1,470 all-inclusive, {{PRIX_PRIVATIF}}/€1,530 with a private shower room | 72 h from first contact if a room is available | Employment contract or job offer, ID, deposit of {{CAUTION_MOIS}} months excluding charges | none: 12-month lease, one month's notice |
| Furnished studio or aparthotel, French side | 1,300 to 1,600 € including charges (listings, September 2026) | 1 day to 2 weeks | Credit card or light file | 1 night to 1 month |

<!-- entity-facts -->

Each of our three houses answers one district of this guide: Le Lodge in Romagny for the train (station a 9-minute walk away), Le Loft in Ambilly for the tram and the border on foot, La Villa in Ville-la-Grand for quiet and the garden. The [free rooms](/en/chambres-disponibles) are visible live, the [application takes two minutes](/en/candidature), and if you first want to compare the districts by lifestyle, read our [guide to Annemasse's districts by profile](/en/blog/quartiers-annemasse-ou-vivre-selon-profil).

## When it is not the right choice

If you want to go out late in Geneva several nights a week, the last train and the last tram will remind you that you live on the other side of a border; a home on the Swiss side, or a taxi budget, will suit you better. If your job requires a car every day, the border crossing at rush hour looks nothing like the train times displayed: aim for a commune further from the crossings. If you arrive as a family, the school catchment and the bus service matter more than anything above: look at Ville-la-Grand and Vétraz-Monthoux rather than the centre. To widen the radius, read [where to live on the French side when you work in Switzerland](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).

## Frequently asked questions

**Is Annemasse safe?**

Yes, with the common sense you apply to any central town: you choose your building and your street, and you prefer a closed car park for your car. The town has invested in public safety: an urban supervision centre linked to 70 cameras, soon 80, with live image sharing with the national police, and a new building on rue du Salève that brings the municipal police and video surveillance together in 2026 (Town of Annemasse). Residential areas like Romagny, Ville-la-Grand or Ambilly are quiet, and our residents have lived there since 2021 without trouble.

**Where should I live in Annemasse when I work in Geneva?**

Within walking distance of the station or the tram, in a residential area: Romagny and the quiet streets around the centre for the Léman Express, Ambilly for tram 17 and the border on foot, Ville-la-Grand for quiet and the garden. From all three, count 20 minutes door-to-door to central Geneva.

**How long does it take to get to Geneva from Annemasse?**

From Annemasse station, the Léman Express takes 8 minutes to Geneva Eaux-Vives and about 20 minutes to Cornavin, with no change. Tram 17 links Ambilly and Annemasse to Geneva through Moillesulaz. Door-to-door, count 20 minutes to the centre.

**Are groceries really cheaper on the French side?**

Yes, markedly: Switzerland is the most expensive country in Europe for food, around 60% above the European average, while France is close to that average (Eurostat, price levels 2024). Residents who shop in Annemasse on a Geneva salary see it on every receipt; restaurants and going out follow the same logic.

**What does tram 17 change in 2026?**

At the end of 2026, line 17 gains three stops in Annemasse, Place Deffaugt, Barbusse and Perrier-Aubrac, moves to a tram every six minutes at peak times and puts the Moillesulaz border crossing twelve minutes from the new terminus (Annemasse Agglo). For a cross-border worker, it means a second axis to Geneva, complementary to the Léman Express, from the heart of the town.
$en$,
  author = 'Jerome Austin',
  category = 'lifestyle',
  image_url = '/images/la villa/exterior/La Villa-107.webp',
  read_time_min = 11,
  tags = ARRAY['annemasse', 'ville-la-grand', 'frontalier', 'quartiers', 'léman express'],
  updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve';

-- 4. Articles publiés : bail de 12 mois résiliable à tout moment (chaque phrase vérifiée présente 1 fois le 29/09)
UPDATE public.blog_posts SET
  content_fr = replace(content_fr,
    'Le bail de La Villa Coliving est de 12 mois avec 1 mois de préavis. Pas de pénalité de rupture anticipée au-delà de la première année.',
    'Le bail de La Villa Coliving est de 12 mois, et tu peux partir à tout moment avec 1 mois de préavis.'),
  content_en = replace(content_en,
    'La Villa Coliving''s lease is 12 months with 1 month''s notice. No early termination penalty beyond the first year.',
    'La Villa Coliving''s lease is 12 months, and you can leave at any time with 1 month''s notice.'),
  updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter';
UPDATE public.blog_posts SET
  content_fr = replace(replace(replace(content_fr,
    'Chez La Villa Coliving, nos baux sont systématiquement conclus pour une durée de 12 mois. Certains pourraient y voir une contrainte face à des formules de coliving plus flexibles proposées ailleurs. Nous y voyons au contraire un gage de sérénité, pour toi comme pour la communauté.',
    'Chez La Villa Coliving, nos baux sont conclus pour une durée de 12 mois, et tu restes libre de partir à tout moment avec un mois de préavis. Ce n''est donc pas une contrainte : c''est un gage de sérénité, pour toi comme pour la communauté.'),
    'Un engagement de 12 mois signifie que tu t''installes vraiment.',
    'Un bail de 12 mois signifie que tu t''installes vraiment.'),
    'Enfin, un engagement annuel nous permet de te garantir un tarif fixe',
    'Enfin, un bail annuel nous permet de te garantir un tarif fixe'),
  content_en = replace(replace(replace(content_en,
    'At La Villa Coliving, leases are systematically signed for 12 months. Some might see that as a constraint compared to more flexible coliving formulas elsewhere. We see it as a guarantee of serenity, for you and for the community.',
    'At La Villa Coliving, leases are signed for 12 months, and you remain free to leave at any time with one month''s notice. So it is not a constraint: it is a guarantee of serenity, for you and for the community.'),
    'A 12-month commitment means you truly settle in.',
    'A 12-month lease means you truly settle in.'),
    'Finally, an annual commitment lets us guarantee you a fixed rate',
    'Finally, an annual lease lets us guarantee you a fixed rate'),
  updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve';
UPDATE public.blog_posts SET
  content_fr = replace(replace(content_fr,
    '### Un engagement de 12 mois pour des relations durables',
    '### Des baux de 12 mois pour des relations durables'),
    'Nous privilégions les baux de 12 mois car nous croyons fermement',
    'Nous privilégions les baux de 12 mois, résiliables à tout moment avec un mois de préavis, car nous croyons fermement'),
  content_en = replace(replace(content_en,
    '### A 12-month commitment for lasting relationships',
    '### 12-month leases for lasting relationships'),
    'We favor 12-month leases because we firmly believe',
    'We favor 12-month leases, which you can end at any time with one month''s notice, because we firmly believe'),
  updated_at = now()
WHERE slug = 'coliving-communaute-reels-amis-geneve-annemasse';
UPDATE public.blog_posts SET
  content_fr = replace(content_fr,
    'Le bail de 12 mois offre stabilité et sécurité au résidant comme au propriétaire. Une durée claire et engageante pour construire une véritable intégration dans ta nouvelle communauté.',
    'Le bail de 12 mois offre stabilité et sécurité au résidant comme au propriétaire, et tu restes libre de partir à tout moment avec un mois de préavis : le temps de construire une véritable intégration dans ta nouvelle communauté, sans t''enfermer.'),
  content_en = replace(content_en,
    'The 12-month lease provides stability and security for both resident and landlord. A clear commitment duration to build genuine community integration.',
    'The 12-month lease provides stability and security for both resident and landlord, and you remain free to leave at any time with one month''s notice: time to build genuine community integration without being locked in.'),
  updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva';

-- 5. Générateur de blog (n8n) : stratégie v4
UPDATE public.blog_editorial_strategy SET is_active = false WHERE version = 3;
INSERT INTO public.blog_editorial_strategy (version, is_active, content_md, updated_by)
SELECT 4, true,
  replace(replace(replace(content_md,
    '(v3, 05/09/2026 — faits alignés sur la fiche entité src/data/entityFacts.ts ; v2 04/08 citabilité IA ; v1 27/07)',
    '(v4, 29/09/2026 — bail sans engagement minimum, 72 h, couples, home cinéma ; v3 05/09 fiche entité src/data/entityFacts.ts ; v2 04/08 citabilité IA ; v1 27/07)'),
    'bail : « Bail de 12 mois. Engagement minimum de 3 mois, puis 1 mois de préavis. »',
    'bail : « Bail de 12 mois : libre de partir à tout moment avec 1 mois de préavis. » (jamais d''engagement minimum ni de « 3 mois minimum ») · emménagement : « 72 h dès le premier contact si une chambre est disponible » · une chambre = une personne (un couple peut venir en prenant deux chambres)'),
    '- Ménage 3×/semaine dans les 3 maisons · fibre "jusqu''à 8 Gb/s" · PAS de jacuzzi au Lodge',
    '- Ménage 3×/semaine dans les 3 maisons · fibre "jusqu''à 8 Gb/s" · PAS de jacuzzi au Lodge · pièce home cinéma dédiée dans chaque maison'),
  'Claude Code — décisions Jérôme 29/09/2026 (bail, 72 h, couples, home cinéma)'
FROM public.blog_editorial_strategy WHERE version = 3
  AND NOT EXISTS (SELECT 1 FROM public.blog_editorial_strategy WHERE version = 4);

COMMIT;

-- ============================================================================
-- VÉRIFICATIONS (à lancer juste après, avant le push) — résultats attendus en commentaire
-- ============================================================================
SELECT slug, is_published, position('{{PRIX_DES_EUR}}' IN content_fr) AS token_eur_fr, position('1 470 €' IN content_fr) > 0 AS eur_clair_fr
FROM blog_posts WHERE slug IN ('coliving-colocation-ou-studio-geneve-comparatif', 's-installer-a-geneve-expatrie-cote-suisse-ou-cote-france', 'vivre-a-annemasse-quand-on-travaille-a-geneve', 'coliving-vs-colocation-differences') ORDER BY slug;
-- attendu : C4/C1/C3 publiés, token_eur_fr = 0, eur_clair_fr = true ; coliving-vs-colocation-differences is_published = false

SELECT slug FROM blog_posts WHERE is_published AND (content_fr || content_en) ~* '(trois|3) mois minimum|(three|3)-month minimum|engagement minimum de|minimum commitment of|Un engagement de 12 mois|A 12-month commitment|engagement annuel|annual commitment|rupture anticipée au-delà|early termination penalty beyond|claire et engageante';
-- attendu : 0 ligne

SELECT slug FROM blog_posts WHERE is_published AND (content_fr || content_en) ~ '/blog/(coliving-vs-colocation-differences|coliving-vs-colocation-choisir-mode-vie-geneve-frontalier|studio-geneve-vs-colocation-france-budget)\)';
-- attendu : 0 ligne

SELECT version, is_active, position('Engagement minimum' IN content_md) = 0 AS bail_ok, position('72 h dès le premier contact' IN content_md) > 0 AS delai_ok, position('home cinéma' IN content_md) > 0 AS cinema_ok
FROM blog_editorial_strategy ORDER BY version;
-- attendu : seule la v4 active, bail_ok / delai_ok / cinema_ok = true sur la v4

-- RETOUR ARRIÈRE (si besoin, AVANT le push) : UPDATE blog_posts SET is_published = (slug <> 'coliving-colocation-ou-studio-geneve-comparatif') WHERE slug IN ('coliving-colocation-ou-studio-geneve-comparatif', 'coliving-vs-colocation-differences');
--   UPDATE blog_editorial_strategy SET is_active = (version = 3);  — les textes C1/C3/articles se restaurent depuis content/decision-pages (git) et les SQL précédents.
