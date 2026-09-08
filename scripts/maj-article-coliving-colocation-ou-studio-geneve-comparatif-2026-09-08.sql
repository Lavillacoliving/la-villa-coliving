-- ============================================================================
-- Mise à jour : coliving-colocation-ou-studio-geneve-comparatif (page de décision — brief « Conquête IA »)
-- Généré le 2026-09-08 par scripts/build-article-sql.mjs depuis content/decision-pages/coliving-colocation-ou-studio-geneve-comparatif.{fr,en}.md + .meta.json
-- Mode : update (brouillon, is_published = false) · à appliquer par Jérôme (SQL Editor / MCP)
-- Relecture : https://www.lavillacoliving.com/blog/coliving-colocation-ou-studio-geneve-comparatif?preview=lavilla2026 (et /en/blog/…)
-- ============================================================================

BEGIN;

UPDATE public.blog_posts SET
  title_fr = 'Coliving, colocation ou studio à Genève ?',
  title_en = 'Coliving, flatshare or studio in Geneva?',
  excerpt_fr = 'Studio à Genève, colocation classique ou coliving côté France : le coût mensuel réel de chaque catégorie, tout compris, puis la décision profil par profil, du célibataire pressé au séjour de moins de six mois.',
  excerpt_en = 'Studio in Geneva, classic flatshare or coliving on the French side: the real all-in monthly cost of each category, then the decision profile by profile, from the newcomer in a hurry to the stay under six months.',
  meta_description_fr = 'Studio à Genève, colocation ou coliving côté France ? Le coût réel tout compris de chaque catégorie, puis la réponse selon ton profil et ton budget.',
  meta_description_en = 'Studio in Geneva, flatshare or coliving on the French side? The real all-in cost of each category, then the answer for your profile and budget.',
  content_fr = $fr$Pour un jeune actif qui arrive avec un contrat à Genève, la chambre côté France gagne dans la plupart des cas : le même budget qu'un studio genevois t'achète une chambre meublée dans une maison avec piscine, sauna et salle de sport, des colocataires qui t'attendent, et un trajet de 20 minutes porte-à-porte jusqu'au centre. Le studio reste le bon choix si tu veux vivre seul, en ville, pour deux ans ou plus, avec un dossier suisse déjà prêt. Ce guide met les vrais chiffres côte à côte, puis tranche profil par profil.

**En bref**
- Le loyer affiché ne dit rien : compare ce que chaque catégorie inclut, charges, meubles, ménage, sport, transport et dépôt compris.
- Un studio à Genève se situe entre 1 200 et 2 500 CHF par mois hors charges, avant les meubles, le dépôt et les abonnements ; une chambre côté France entre 800 et 1 250 € tout compris en colocation classique, et dès {{PRIX_DES}} en coliving premium.
- La bonne catégorie dépend de ton profil : la durée du séjour, l'état de ton dossier et le besoin d'un logement entier décident avant le prix.

## Ce que chaque catégorie inclut vraiment, poste par poste

Le vrai coût d'un logement, c'est le loyer plus tout ce que l'annonce ne montre pas, et tout ce qu'elle ne te donne pas. Voici les ordres de grandeur pour une personne seule qui travaille à Genève, en septembre 2026, sans marque, et ce que comprend chez nous une chambre en coliving premium.

| Poste | Studio à Genève | Colocation classique côté France | Coliving premium côté France (La Villa) | Grande résidence de coliving côté France |
|---|---|---|---|---|
| Loyer affiché | 1 200 à 2 500 CHF hors charges (annonces, 2026) | 600 à 1 000 € hors charges selon la commune (annonces, septembre 2026) | dès {{PRIX_DES}} tout inclus, {{PRIX_PRIVATIF}} avec salle d'eau privative | dès 750 € environ charges comprises (septembre 2026) |
| Charges, chauffage, électricité | 150 à 280 CHF | 60 à 100 € | inclus | inclus le plus souvent |
| Internet | 40 à 70 CHF | 10 à 15 € par personne | fibre jusqu'à 8 Gb/s incluse | inclus le plus souvent |
| Redevance radio-TV | 28 CHF (335 CHF par an, Serafe) | comprise dans les impôts locaux | aucune | aucune |
| Meubles | 3 000 à 7 000 CHF si le studio est vide | 300 à 800 € pour la chambre | chambre meublée et décorée, rien à acheter | meublé |
| Ménage des espaces communs | toi | à négocier entre colocataires | 3 fois par semaine, inclus | variable |
| Produits du quotidien (entretien) | à acheter | à acheter et à partager | inclus | variable |
| Serviettes et draps | à acheter | à acheter | fournis | variable |
| Salle de sport | 80 à 120 CHF par mois en salle | abonnement à payer | dans la maison, incluse | selon la résidence |
| Piscine | non | non | dans le jardin, chauffée | rarement |
| Sauna | non | non | oui | rarement |
| Jardin et barbecue | non | rarement | oui | variable |
| Home cinéma et streaming | à payer | chacun son abonnement | inclus | variable |
| Animations communautaires | aucune | selon les colocataires | yoga, sport et événements chaque semaine | selon la résidence |
| Transport vers le travail | 70 CHF (unireso Tout Genève, tpg 2026) | 116,50 € (Léman Pass mensuel, 2026) | 116,50 € (Léman Pass mensuel, 2026) | selon la commune, souvent la voiture |
| **Total mensuel réel** | **loyer + 300 à 450 CHF de charges et d'abonnements, + meubles si vide** | **800 à 1 250 €** | **{{PRIX_DES}} + le transport, rien d'autre** | **900 à 1 300 € + le transport** |
| Dépôt et frais d'entrée | jusqu'à 3 mois de loyer sur compte bloqué (art. 257e CO) | 1 à 2 mois, garant fréquent | caution {{CAUTION_MOIS}} mois hors charges, 0 € de frais de dossier et d'agence | variable selon la résidence |
| Délai d'emménagement | 4 à 8 semaines sans historique suisse | 2 à 6 semaines | 72 h si une chambre est libre | quelques jours à 2 semaines |

Lis ce tableau ligne par ligne et l'écart change de sens. Le studio à Genève coûte surtout par ce qu'il ne comprend pas : meubles, dépôt, abonnements, semaines de recherche dans un canton où le taux de vacance est inférieur à 1 % (OCSTAT), et une vie à organiser seul. La colocation classique reste la moins chère au mois, contre un bail de douze mois, un garant en France et une part de hasard sur les colocataires. Le coliving premium coûte plus cher qu'une colocation, et ce que tu achètes, c'est tout le reste de la colonne : une chambre de 16 à 24 m², 37 à 42 m² d'espace de vie partagé par résident, la piscine après le train, le sauna en hiver, une salle de sport à trente secondes de ton lit, le ménage fait, les draps fournis, et des colocataires qui travaillent à Genève comme toi.

## Décision par profil : cinq situations, cinq verdicts

**Célibataire pressé, poste dans trente jours.** Verdict : coliving. Tu candidates en deux minutes, tu as une réponse sous 48 h, une visite sur place ou en visio dans la semaine, et si une chambre est libre tu emménages en 72 h avec ta valise. Pas de meubles à acheter, pas de garant à trouver, pas de dépôt bloqué à trois mois, et le premier soir tu dînes avec sept à douze colocataires qui connaissent déjà les bons plans de Genève. Un studio à Genève demande quatre à huit semaines sans historique suisse : tu y reviendras après trois fiches de salaire si l'envie est toujours là. Elle l'est rarement.

**Couple.** Verdict : un logement entier. Un deux-pièces meublé côté France se loue 900 à 1 150 € par mois hors charges (portails et Observatoire, 2026), un deux-pièces à Genève nettement plus. Nos chambres sont individuelles, le coliving n'est pas conçu pour deux. Si l'un de vous arrive avant l'autre, la chambre en coliving est en revanche le meilleur point de chute des premiers mois, le temps de chercher l'appartement à deux sans pression.

**Télétravailleur.** Verdict : coliving. Tu as besoin d'une connexion sérieuse, d'un bureau et de gens le soir : fibre jusqu'à 8 Gb/s, un bureau dans ta chambre, la piscine à midi, le sauna à 18 h et des colocataires qui rentrent de Genève à 19 h. Un studio garantit le silence mais t'isole, et l'internet, le bureau, le sport et les sorties s'ajoutent au loyer. La colocation classique dépend entièrement de l'appartement et des colocataires que tu trouves.

**Budget inférieur à 1 200 € par mois tout compris.** Verdict : colocation classique. Le coliving premium est au-dessus de ce budget, autant le dire clairement : vise une colocation classique côté France, entre 800 et 1 250 € tout compris, ou une grande résidence de coliving si tu acceptes un studio en immeuble et la voiture. Notre [guide pour trouver une colocation près de Genève](/blog/trouver-colocation-geneve-frontalier) te donne les groupes, les portails et les pièges. Et si ton budget peut monter jusqu'au loyer d'un coliving, souviens-toi qu'il comprend ce qu'une colocation te fait payer à côté.

**Séjour de trois à six mois.** Verdict : coliving, sans hésiter. Chez nous, le bail est de 12 mois avec un engagement minimum de 3 mois, puis tu es libre avec un mois de préavis : c'est exactement le format d'une mission, d'un stage de fin d'études ou d'une période d'essai. Zéro meuble à revendre, zéro frais d'entrée, une caution restituée. Le studio à Genève est hors jeu pour moins d'un an, et la colocation classique se négocie parfois en sous-location, avec les risques que ça comporte.

## Les options de logement, catégorie par catégorie

| Option | Prix | Délai réaliste | Dossier demandé | Durée minimum |
|---|---|---|---|---|
| Studio en ville (Genève) | 1 200 à 2 500 CHF hors charges (annonces, 2026) | 4 à 8 semaines sans historique suisse | 3 fiches de salaire suisses, extrait des poursuites, garant ou garantie bancaire, dépôt jusqu'à 3 mois | 12 mois en pratique |
| Colocation classique côté France | 600 à 1 000 € hors charges selon la commune (annonces, septembre 2026) | 2 à 6 semaines | Fiches de salaire, souvent un garant en France, dépôt 1 à 2 mois | 12 mois le plus souvent |
| Coliving premium côté France (La Villa) | dès {{PRIX_DES}} tout inclus, {{PRIX_PRIVATIF}} avec salle d'eau privative | 72 h si une chambre est libre | Contrat de travail ou promesse d'embauche, pièce d'identité, caution {{CAUTION_MOIS}} mois hors charges | 3 mois |
| Grande résidence de coliving côté France | dès 750 € environ charges comprises (septembre 2026) | quelques jours à 2 semaines | Dossier en ligne, garant ou dépôt selon la résidence | souvent 1 mois |
| Studio meublé ou appart'hôtel côté France | 1 300 à 1 600 € charges comprises (annonces, septembre 2026) | 1 jour à 2 semaines | Carte bancaire ou dossier léger | 1 nuit à 1 mois |

<!-- entity-facts -->

Concrètement, pour un nouveau job dans un mois : [candidature en deux minutes](/candidature), réponse sous 48 h, visite sur place ou en visio dans la semaine, bail signé en ligne, emménagement en 72 h quand la chambre est libre. Les [chambres libres](/chambres-disponibles) sont visibles en direct, ce que le loyer inclut est détaillé poste par poste sur la [page des tarifs](/tarifs), et les trois maisons avec leur trajet sont sur [notre page colocation à Genève côté France](/colocation-geneve).

## Vivre à La Villa, une journée ordinaire

7 h 40, tu fermes ta porte à Ville-la-Grand, à Ambilly ou à Annemasse ; 8 h, tu es à Genève Eaux-Vives par le Léman Express, ou au centre par le tram 17 ; 20 minutes porte-à-porte, sans voiture. 18 h 30, retour : vingt longueurs dans la piscine chauffée, un sauna, ou une séance dans la salle de sport de la maison. Le ménage des communs est passé dans la journée, trois fois par semaine, et les produits du quotidien sont dans le placard. 20 h, barbecue dans le jardin avec les colocataires, ou soirée home cinéma, ou le cours de yoga de la semaine. Le samedi, tu pars en randonnée avec deux d'entre eux, parce que c'est comme ça que ça se passe depuis 2021 : plus de 100 résidents accueillis, un séjour moyen de 13 mois quand la plupart arrivaient « pour six mois », et une note de 4,9/5 dans nos enquêtes résidents. Ce n'est pas un argument, c'est le quotidien que le loyer achète.

## Quand le studio à Genève est le bon choix

Le studio gagne si tu remplis quatre conditions : vivre seul, rester deux ans ou plus, avoir déjà un dossier suisse, trois fiches de salaire, extrait des poursuites et garantie de loyer, et tenir à marcher jusqu'au travail. Le surcoût t'achète alors l'autonomie totale et une adresse genevoise. Beaucoup de nos résidents ont fait le chemin dans l'autre sens : quelques mois chez nous, le temps de constituer un dossier suisse et de connaître les quartiers, puis un appartement à Genève, ou pas. Pour choisir ton côté de la frontière, permis et impôts compris, lis [s'installer à Genève : côté Suisse ou côté France](/blog/s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france).

## Quand ce n'est pas le bon choix

Le coliving n'est pas fait pour tout le monde, et le dire évite des visites inutiles : moins de trois mois, une résidence hôtelière côté France, entre 1 300 et 1 600 € par mois charges comprises (annonces, septembre 2026) ; un couple ou un enfant, un logement entier ; un budget total sous 1 200 € par mois, la colocation classique ; une voiture indispensable chaque jour, un logement plus loin des postes-frontière, parce que la douane aux heures de pointe ne ressemble pas aux temps de train. Pour comparer les communes côté France, lis [où habiter côté France quand on travaille en Suisse](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).

## Questions fréquentes

**Studio à Genève ou chambre côté France : qu'est-ce qui revient le moins cher, tout compris ?**

La chambre côté France, nettement, dès qu'on additionne tout. Un studio à Genève se loue 1 200 à 2 500 CHF par mois hors charges d'après les annonces relevées en 2026, plus 300 à 450 CHF de charges, d'électricité, d'internet et de redevance, plus les meubles s'il est vide et un dépôt bloqué jusqu'à trois mois de loyer. Une chambre en colocation classique côté France revient à 800 à 1 250 € tout compris ; en coliving premium, le loyer dès {{PRIX_DES}} comprend tout sauf le transport.

**Coliving ou colocation : quelle différence concrète ?**

La colocation, c'est partager un loyer : tu trouves l'appartement, tu meubles ta chambre, tu répartis les charges et le ménage entre colocataires, avec un bail de douze mois et souvent un garant. Le coliving, c'est partager une maison déjà organisée : chambre meublée, charges, fibre et ménage des communs compris, résidents sélectionnés, un seul interlocuteur, et chez nous un bail de 12 mois avec un engagement minimum de 3 mois, puis un mois de préavis. Tu paies plus cher au mois, tu achètes l'espace, le confort et le temps que tu ne passes pas à gérer.

**Combien coûte vraiment un studio à Genève par mois ?**

Compte le loyer, 1 200 à 2 500 CHF hors charges (annonces, 2026), plus 300 à 450 CHF par mois de charges, d'électricité, d'internet, de redevance (Serafe) et d'abonnement tpg (unireso, 2026), plus 3 000 à 7 000 CHF de meubles si le studio est vide, et un dépôt qui peut atteindre trois mois de loyer sur un compte bloqué (art. 257e CO).

**En combien de temps peut-on emménager chez La Villa ?**

En 72 h quand une chambre est libre : candidature en deux minutes, réponse sous 48 h, visite sur place ou en visio, bail signé en ligne, et tu arrives avec ta valise dans une chambre meublée, draps et serviettes fournis. Les chambres libres et les prochaines libérations sont affichées en direct sur le site.

**Faut-il un garant pour une chambre côté France ?**

En colocation classique, très souvent oui, et un garant établi en France, ce qu'un nouvel arrivant n'a pas. Chez nous, le dossier se limite au contrat de travail ou à la promesse d'embauche, à une pièce d'identité et à la caution de {{CAUTION_MOIS}} mois hors charges ; un garant n'est discuté qu'au cas par cas, quand le contrat ne couvre pas le loyer, et toujours avant la visite.
$fr$,
  content_en = $en$For a young professional arriving with a contract in Geneva, the room on the French side wins in most cases: the same budget as a Geneva studio buys you a furnished room in a house with a pool, a sauna and a gym, flatmates waiting for you, and a 20-minute door-to-door commute to the centre. The studio remains the right choice if you want to live alone, in town, for two years or more, with a Swiss rental file already ready. This guide puts the real figures side by side, then decides profile by profile.

**In short**
- The advertised rent tells you nothing: compare what each category includes, bills, furniture, cleaning, sport, transport and deposit.
- A studio in Geneva sits between 1,200 and 2,500 CHF a month excluding charges, before furniture, deposit and subscriptions; a room on the French side between 800 and 1,250 € all-in in a classic flatshare, and from {{PRIX_DES}} in premium coliving.
- The right category depends on your profile: the length of your stay, the state of your file and the need for a whole home decide before the price does.

## What each category really includes, item by item

The real cost of a home is the rent plus everything the listing does not show, and everything it does not give you. Here are the orders of magnitude for a single person working in Geneva, in September 2026, without brands, and what a premium coliving room includes with us.

| Item | Studio in Geneva | Classic flatshare, French side | Premium coliving, French side (La Villa) | Large coliving residence, French side |
|---|---|---|---|---|
| Advertised rent | 1,200 to 2,500 CHF excluding charges (listings, 2026) | 600 to 1,000 € excluding charges depending on the town (listings, September 2026) | from {{PRIX_DES}} all-inclusive, {{PRIX_PRIVATIF}} with a private shower room | from about 750 € including charges (September 2026) |
| Charges, heating, electricity | 150 to 280 CHF | 60 to 100 € | included | usually included |
| Internet | 40 to 70 CHF | 10 to 15 € per person | fibre up to 8 Gb/s included | usually included |
| Radio and TV licence | 28 CHF (335 CHF a year, Serafe) | included in local taxes | none | none |
| Furniture | 3,000 to 7,000 CHF if the studio is empty | 300 to 800 € for the room | furnished and decorated room, nothing to buy | furnished |
| Cleaning of common areas | you | to negotiate between flatmates | 3 times a week, included | varies |
| Everyday household products | to buy | to buy and share | included | varies |
| Towels and bed linen | to buy | to buy | provided | varies |
| Gym | 80 to 120 CHF a month at a gym | membership to pay | in the house, included | depends on the residence |
| Pool | no | no | in the garden, heated | rarely |
| Sauna | no | no | yes | rarely |
| Garden and barbecue | no | rarely | yes | varies |
| Home cinema and streaming | to pay | everyone their own subscription | included | varies |
| Community life | none | depends on the flatmates | yoga, sport and events every week | depends on the residence |
| Transport to work | 70 CHF (unireso Tout Genève, tpg 2026) | 116.50 € (Léman Pass monthly, 2026) | 116.50 € (Léman Pass monthly, 2026) | depends on the town, often a car |
| **Real monthly total** | **rent + 300 to 450 CHF of bills and subscriptions, + furniture if empty** | **800 to 1,250 €** | **{{PRIX_DES}} + transport, nothing else** | **900 to 1,300 € + transport** |
| Deposit and entry costs | up to 3 months' rent on a blocked account (art. 257e of the Swiss Code of Obligations) | 1 to 2 months, guarantor frequent | deposit of {{CAUTION_MOIS}} months excluding charges, 0 € in application and agency fees | varies by residence |
| Move-in time | 4 to 8 weeks without a Swiss history | 2 to 6 weeks | 72 h if a room is free | a few days to 2 weeks |

Read this table line by line and the gap changes meaning. The studio in Geneva costs mostly through what it does not include: furniture, deposit, subscriptions, weeks of searching in a canton where the vacancy rate is below 1% (OCSTAT), and a life to organise alone. The classic flatshare remains the cheapest per month, against a twelve-month lease, a guarantor in France and a share of luck with your flatmates. Premium coliving costs more than a flatshare, and what you buy is the whole rest of the column: a room of 16 to 24 m², 37 to 42 m² of shared living space per resident, the pool after the train, the sauna in winter, a gym thirty seconds from your bed, the cleaning done, the linen provided, and flatmates who work in Geneva like you.

## Decision by profile: five situations, five verdicts

**Single and in a hurry, job starting in thirty days.** Verdict: coliving. You apply in two minutes, you get a reply within 48 h, a visit on site or by video within the week, and if a room is free you move in within 72 h with your suitcase. No furniture to buy, no guarantor to find, no three-month blocked deposit, and on the first evening you have dinner with seven to twelve flatmates who already know the good spots in Geneva. A studio in Geneva takes four to eight weeks without a Swiss history: you will come back to it after three payslips if you still want it. You rarely do.

**Couple.** Verdict: a whole home. A furnished one-bedroom flat on the French side rents for 900 to 1,150 € a month excluding charges (portals and Observatory, 2026), a one-bedroom in Geneva markedly more. Our rooms are single, coliving is not designed for two. If one of you arrives before the other, though, a coliving room is the best landing spot for the first months, while you look for the flat for two without pressure.

**Remote worker.** Verdict: coliving. You need a serious connection, a desk and people in the evening: fibre up to 8 Gb/s, a desk in your room, the pool at lunchtime, the sauna at 6 pm and flatmates coming back from Geneva at 7 pm. A studio guarantees silence but isolates you, and internet, desk, sport and going out add to the rent. The classic flatshare depends entirely on the flat and the flatmates you find.

**Budget below 1,200 € a month all-in.** Verdict: classic flatshare. Premium coliving is above that budget, and it is better said plainly: aim for a classic flatshare on the French side, between 800 and 1,250 € all-in, or a large coliving residence if you accept a studio in a block and a car. Our [guide to finding a flatshare near Geneva](/en/blog/trouver-colocation-geneve-frontalier) gives you the groups, the portals and the traps. And if your budget can stretch to a coliving rent, remember that it includes what a flatshare makes you pay on the side.

**Stay of three to six months.** Verdict: coliving, without hesitation. With us, the lease is 12 months with a minimum commitment of 3 months, then you are free to leave with one month's notice: exactly the format of an assignment, an end-of-studies internship or a probation period. No furniture to resell, no entry fees, a deposit returned. The studio in Geneva is out of the game for less than a year, and a classic flatshare is sometimes negotiated as a sublet, with the risks that go with it.

## The housing options, category by category

| Option | Price | Realistic timeline | Paperwork required | Minimum stay |
|---|---|---|---|---|
| Studio in the city (Geneva) | 1,200 to 2,500 CHF excluding charges (listings, 2026) | 4 to 8 weeks without a Swiss history | 3 Swiss payslips, debt-collection extract, guarantor or bank guarantee, deposit of up to 3 months | 12 months in practice |
| Classic flatshare, French side | 600 to 1,000 € excluding charges depending on the town (listings, September 2026) | 2 to 6 weeks | Payslips, often a guarantor in France, 1 to 2 months' deposit | 12 months most of the time |
| Premium coliving, French side (La Villa) | from {{PRIX_DES}} all-inclusive, {{PRIX_PRIVATIF}} with a private shower room | 72 h if a room is free | Employment contract or job offer, ID, deposit of {{CAUTION_MOIS}} months excluding charges | 3 months |
| Large coliving residence, French side | from about 750 € including charges (September 2026) | a few days to 2 weeks | Online file, guarantor or deposit depending on the residence | often 1 month |
| Furnished studio or aparthotel, French side | 1,300 to 1,600 € including charges (listings, September 2026) | 1 day to 2 weeks | Credit card or light file | 1 night to 1 month |

<!-- entity-facts -->

In practice, for a new job in a month: [a two-minute application](/en/candidature), a reply within 48 h, a visit on site or by video within the week, a lease signed online, move-in within 72 h when the room is free. The [free rooms](/en/chambres-disponibles) are visible live, what the rent includes is detailed item by item on the [rates page](/en/tarifs), and the three houses with their commute are on [our page for flatshares in Geneva, French side](/en/colocation-geneve).

## Living at La Villa, an ordinary day

7:40 am, you close your door in Ville-la-Grand, Ambilly or Annemasse; 8 am, you are at Geneva Eaux-Vives by Léman Express, or in the centre by tram 17; 20 minutes door-to-door, no car. 6:30 pm, back home: twenty lengths in the heated pool, a sauna, or a session in the house gym. The common areas were cleaned during the day, three times a week, and the everyday products are in the cupboard. 8 pm, barbecue in the garden with the flatmates, or a home-cinema evening, or the yoga class of the week. On Saturday you go hiking with two of them, because that is how it has gone since 2021: more than 100 residents welcomed, an average stay of 13 months when most arrived "for six months", and a 4.9/5 score in our resident surveys. It is not an argument, it is the daily life the rent buys.

## When the studio in Geneva is the right choice

The studio wins if you meet four conditions: living alone, staying two years or more, already having a Swiss file, three payslips, debt-collection extract and rent guarantee, and insisting on walking to work. The extra cost then buys you total autonomy and a Geneva address. Many of our residents went the other way round: a few months with us, the time to build a Swiss file and get to know the neighbourhoods, then a flat in Geneva, or not. To choose your side of the border, permit and taxes included, read [moving to Geneva: Swiss side or French side](/en/blog/s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france).

## When it is not the right choice

Coliving is not for everyone, and saying so avoids pointless visits: under three months, a serviced residence on the French side, between 1,300 and 1,600 € a month including charges (listings, September 2026); a couple or a child, a whole home; a total budget under 1,200 € a month, a classic flatshare; a car that is essential every day, a home further from the crossings, because the border at rush hour looks nothing like the train times. To compare the French-side towns, read [where to live on the French side when you work in Switzerland](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).

## Frequently asked questions

**Studio in Geneva or a room on the French side: which costs less, all-in?**

The room on the French side, by a wide margin, once you add everything up. A studio in Geneva rents for 1,200 to 2,500 CHF a month excluding charges according to the listings surveyed in 2026, plus 300 to 450 CHF of bills, electricity, internet and licence fee, plus furniture if it is empty and a blocked deposit of up to three months' rent. A room in a classic flatshare on the French side comes to 800 to 1,250 € all-in; in premium coliving, the rent from {{PRIX_DES}} includes everything except transport.

**Coliving or flatshare: what is the concrete difference?**

A flatshare means sharing a rent: you find the flat, furnish your room, split the bills and the cleaning between flatmates, with a twelve-month lease and often a guarantor. Coliving means sharing a house that is already organised: furnished room, bills, fibre and cleaning of the common areas included, selected residents, a single point of contact, and with us a 12-month lease with a minimum commitment of 3 months, then one month's notice. You pay more per month, and you buy space, comfort and the time you do not spend managing.

**How much does a studio in Geneva really cost per month?**

Count the rent, 1,200 to 2,500 CHF excluding charges (listings, 2026), plus 300 to 450 CHF a month of charges, electricity, internet, licence fee (Serafe) and tpg pass (unireso, 2026), plus 3,000 to 7,000 CHF of furniture if the studio is empty, and a deposit that can reach three months' rent on a blocked account (art. 257e of the Swiss Code of Obligations).

**How fast can I move into La Villa?**

Within 72 h when a room is free: a two-minute application, a reply within 48 h, a visit on site or by video, a lease signed online, and you arrive with your suitcase in a furnished room, linen and towels provided. The free rooms and the upcoming departures are displayed live on the site.

**Do I need a guarantor for a room on the French side?**

In a classic flatshare, very often yes, and a guarantor based in France, which a newcomer does not have. With us, the file is limited to the employment contract or job offer, an ID and the deposit of {{CAUTION_MOIS}} months excluding charges; a guarantor is only discussed case by case, when the contract does not cover the rent, and always before the visit.
$en$,
  author = 'Jerome Austin',
  category = 'geneva',
  image_url = '/images/le lodge piscine.webp',
  read_time_min = 13,
  tags = ARRAY['coliving', 'colocation', 'studio', 'genève', 'budget', 'comparatif'],
  updated_at = now()
WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif';

COMMIT;

-- Vérification :
--   SELECT slug, is_published, published_at, updated_at, read_time_min, length(content_fr) AS fr, length(content_en) AS en,
--          (SELECT count(*) FROM regexp_matches(content_fr, '\*\*[^*]+\?\*\*', 'g')) AS faq_fr,
--          position('<!-- entity-facts -->' IN content_fr) AS marker_fr, position('<!-- entity-facts -->' IN content_en) AS marker_en
--   FROM blog_posts WHERE slug = 'coliving-colocation-ou-studio-geneve-comparatif';
--   SELECT slug FROM blog_posts WHERE is_published AND (content_fr LIKE '%](/blog/coliving-vs-colocation-differences)%' OR content_en LIKE '%/blog/coliving-vs-colocation-differences)%' OR content_fr LIKE '%](/blog/coliving-vs-colocation-choisir-mode-vie-geneve-frontalier)%' OR content_en LIKE '%/blog/coliving-vs-colocation-choisir-mode-vie-geneve-frontalier)%' OR content_fr LIKE '%](/blog/studio-geneve-vs-colocation-france-budget)%' OR content_en LIKE '%/blog/studio-geneve-vs-colocation-france-budget)%');  -- attendu : 0 ligne
