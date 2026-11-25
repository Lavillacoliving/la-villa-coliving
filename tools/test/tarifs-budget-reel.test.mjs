// /tarifs et /en/tarifs construites comme une argumentation (brief « Page /tarifs et encadré « l'essentiel » : le budget réel » du
// 23/11/2026, lot 1 ; textes des annexes A et B validés par Jérôme le 23/11/2026 ; décisions D15 à D21, G1 et G2 du 24/11/2026).
//
// La page est rendue par react-dom/server (premier rendu, = ce que le prérendu capture, offre exceptée : voir plus bas), en
// français et en anglais, puis comparée aux annexes MOT POUR MOT : titres, paragraphes, listes, cellules des tableaux, questions
// et réponses (texte visible et FAQPage). Comparaison au caractère près, espaces insécables mises à part (l'annexe écrit « 1 290 »
// avec une espace ordinaire, le site avec une insécable U+00A0) ; le texte d'un élément est lu comme un navigateur le lit
// (balises en ligne retirées sans espace : « détaillés plus bas. » reste collé à son point).
//
// Les annexes sont recopiées ci-dessous (ANNEX) par extraction automatique du brief, puis figées ; écarts DÉCIDÉS, appliqués dans
// le test et non dans la recopie : G2 (jardin de La Villa : 2 000 m², jamais 1 948) et D20 (légende du tableau du bloc 2). Le
// bloc 1 (fiche « l'essentiel ») a ses propres tests et sa garde (check:facts).
//
// Aussi : ordre des neuf blocs et ancres ; chaînes interdites du § 3 (page rendue, textes et source de la page) ; l'offre (bloc 6)
// jamais dans le premier rendu ni dans le FAQPage, visible du 24/11/2026 au 31/12/2026 23 h 59 et absente le 01/01/2027 à 0 h 01
// (horloge simulée), jamais sous automatisation (prérendu) ; données structurées (FAQPage = questions visibles, onze ; aucun
// aggregateRating ni Review ; description D19 reprise par la fiche LocalBusiness) ; tableaux dans un cadre qui défile seul.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { build } from 'esbuild';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const LANGS = ['fr', 'en'];

/** Annexes A (français) et B (anglais) du brief, blocs 2 à 9, et la description D19 : extraction automatique du brief du
 *  23/11/2026 (notes entre crochets et gras retirés), figée ici. Ne pas « corriger » une phrase ici : la page suit l'annexe. */
const ANNEX = {
  "fr": {
    "block2": {
      "title": "Chambre à Genève ou côté France : quel budget prévoir en plus du loyer ?",
      "answers": [
        "Un loyer n'est pas un budget logement. À Genève comme côté France, il s'y ajoute presque toujours des charges, des frais d'entrée et, si tu as une voiture, une place de parking.",
        "En novembre 2026, à Genève, une chambre en colocation gérée, meublée et toutes charges comprises, s'affiche entre 1 250 et 1 785 CHF par mois, 1 570 CHF en médiane ; avec une salle d'eau privative, les chambres relevées démarrent à 1 560 CHF. Une chambre louée entre particuliers s'affiche à 1 000 CHF en médiane ; elle revient à 1 090–1 200 CHF par mois avec les frais courants, et à 1 290–1 400 CHF avec une place de parking.",
        "À La Villa Coliving, le prix affiché est la dépense totale : de 1 290 à 1 430 CHF par mois selon la chambre, 1 430 CHF avec une salle d'eau privative, parking, piscine, sauna et salle de sport compris."
      ],
      "itemsTitle": "Ce qui s'ajoute à un loyer, poste par poste",
      "items": [
        "Chauffage, eau, électricité, quand le loyer est annoncé hors charges : 80 à 110 CHF par mois.",
        "Internet, s'il n'est pas compris : 10 à 22 CHF par mois et par personne.",
        "Redevance radio-télévision, en Suisse : 9 à 14 CHF par mois à deux ou trois.",
        "Garantie de loyer, en Suisse : jusqu'à 26 CHF par mois.",
        "Frais de dossier ou d'agence, côté France : 200 à 700 € à l'entrée, fréquents.",
        "Place de parking : 120 à 350 CHF par mois à Genève, 40 à 155 € côté Annemasse.",
        "Lessive, produits du quotidien, linge : environ 40 CHF par mois.",
        "Un abonnement de streaming : 23 CHF par mois."
      ],
      "tableTitle": "Ce que cela donne, par type de logement",
      "tableUnit": "(CHF par mois, arrondis à la dizaine)",
      "header": [
        "Logement",
        "Prix affiché",
        "Ce qui s'ajoute, hors parking",
        "Parking",
        "Sans voiture",
        "Avec voiture"
      ],
      "rows": [
        [
          "La Villa Coliving, chambre à 1 370 CHF",
          "1 370",
          "rien",
          "compris",
          "1 370",
          "1 370"
        ],
        [
          "Chambre entre particuliers à Genève",
          "1 000",
          "90 à 200",
          "200",
          "1 090 à 1 200",
          "1 290 à 1 400"
        ],
        [
          "Colocation gérée à Genève",
          "1 570",
          "80",
          "200",
          "1 650",
          "1 850"
        ],
        [
          "Studio meublé à Genève",
          "2 100",
          "200",
          "200",
          "2 300",
          "2 500"
        ],
        [
          "Colocation gérée côté France",
          "770 (825 €)",
          "60",
          "70",
          "830",
          "900"
        ],
        [
          "Studio en résidence côté France",
          "990 (1 055 €)",
          "160",
          "70",
          "1 150",
          "1 210"
        ]
      ],
      "gaps": "À La Villa Coliving, une chambre à 1 290 CHF coûte 80 CHF de moins que la référence du tableau ; une chambre avec salle d'eau privative, à 1 430 CHF, 60 CHF de plus.",
      "france": "Face à une colocation gérée côté France, l'écart est d'environ 470 CHF par mois avec une voiture. Il correspond à 44 m² de surface intérieure par personne en moyenne contre 26 m², à des chambres de 16 à 24 m² contre 11 à 16 m², et aux équipements des maisons, détaillés plus bas.",
      "method": "Méthode : prix relevés le 23 novembre 2026 sur les sites d'annonces et d'opérateurs (à Genève : 47 chambres entre particuliers, 16 chambres en colocation gérée, 13 studios meublés ; côté France : 15 colocations gérées et une résidence) ; médianes, arrondies à la dizaine. Le détail des postes et les sources sont dans notre guide du budget."
    },
    "block3": {
      "title": "Ce que La Villa Coliving offre de plus qu'une colocation",
      "intro": "La différence de prix avec une colocation paie quatre choses.",
      "points": [
        [
          "1. De la place.",
          "À La Villa Coliving, chaque résident dispose en moyenne de 44 m² de surface intérieure, de 38 à 49 m² selon la maison. Dans les colocations gérées que nous avons relevées en novembre 2026, c'est 26 m² côté France et 36 m² à Genève. Les chambres de La Villa Coliving font de 16 à 24 m², et 25 sur 29 ont leur salle d'eau privative ; à Genève, une chambre louée entre particuliers fait 14 m² en médiane."
        ],
        [
          "2. Une maison équipée.",
          "Chaque maison de La Villa Coliving a sa piscine, son sauna, sa salle de sport et son home cinéma, avec des extérieurs aménagés."
        ],
        [
          "3. Rien à gérer.",
          "Une entreprise nettoie les parties communes trois fois par semaine. Les produits du quotidien arrivent chaque mois, le jardin et la piscine sont entretenus, les réparations sont prises en charge, avec une réponse sous 48 heures ouvrées. Tu ne négocies ni planning de ménage ni facture à partager."
        ],
        [
          "4. Une vie de maison.",
          "Les maisons de La Villa Coliving comptent 7, 10 et 12 chambres. Les résidents participent au choix de ceux qui les rejoignent, après une première sélection par nos soins. Chaque mois, chaque maison accueille un cours de yoga et une séance de coaching sportif, ouverts aux résidents des trois maisons, et une soirée commune."
        ]
      ],
      "tableHeader": [
        "",
        "La Villa, Ville-la-Grand",
        "Le Loft, Ambilly",
        "Le Lodge, Annemasse"
      ],
      "tableRows": [
        [
          "Chambres",
          "10, de 16 à 24 m²",
          "7, de 20 à 23 m²",
          "12, de 18 à 20 m²"
        ],
        [
          "Surface intérieure par résident",
          "38 m²",
          "44 m²",
          "49 m²"
        ],
        [
          "Piscine",
          "extérieure chauffée, 12 × 5 m",
          "intérieure chauffée, toute l'année",
          "extérieure, 12 × 5 m"
        ],
        [
          "Sauna",
          "5 places",
          "2 places",
          "5 places"
        ],
        [
          "Extérieurs",
          "jardin de 1 948 m², terrasses, barbecue, volley",
          "terrasses, cuisine extérieure avec barbecue",
          "jardin de 1 500 m², pool house, pétanque, barbecue"
        ]
      ],
      "visit": "Le plus simple pour juger : venir voir une maison."
    },
    "block4": {
      "title": "Tout ce qui est compris dans le prix",
      "intro": "À La Villa Coliving, le prix affiché couvre tout ce qui suit, dans les trois maisons.",
      "groups": [
        [
          "Ce que tu paierais à part ailleurs",
          [
            "Eau, électricité et chauffage, sans régularisation en fin d'année.",
            "Taxe d'ordures et assainissement.",
            "Fibre Orange Pro, Wi-Fi dans toute la maison.",
            "Parking sur place (au Lodge, sans place attribuée) et parking à vélos extérieur.",
            "Chambre meublée : lit double, matelas, bureau, rangements.",
            "Linge de lit et serviette, prêtés à ton arrivée.",
            "Cuisine équipée, vaisselle comprise.",
            "Buanderie : lave-linge et sèche-linge en libre accès, lessive fournie.",
            "Panier de base, livré chaque mois : papier toilette, essuie-tout, lave-main, lessive, produits d'entretien, sacs poubelle, chiffons, sel, poivre, huile.",
            "Six services de streaming sur l'écran commun : Netflix, Canal+, Apple TV, Amazon Prime, Paramount+ et Max.",
            "Aucun frais d'entrée : ni dossier, ni agence, ni réservation, ni état des lieux."
          ]
        ],
        [
          "Ce qu'une colocation n'offre pas",
          [
            "Ménage des parties communes par une entreprise, trois fois par semaine.",
            "Piscine, sauna et salle de sport dans chaque maison.",
            "Home cinéma, jeux et extérieurs aménagés.",
            "Un cours de yoga et une séance de coaching sportif par mois dans chaque maison, ouverts aux résidents des trois maisons.",
            "Une soirée commune chaque mois.",
            "Entretien du jardin, de la piscine et de la maison ; réparations prises en charge, réponse sous 48 heures ouvrées."
          ]
        ],
        [
          "Ce qui n'est pas compris",
          [
            "Ton assurance habitation.",
            "Le ménage de ta chambre et de ta salle d'eau.",
            "Le lavage et le renouvellement du linge.",
            "Les repas, hors soirées."
          ]
        ]
      ]
    },
    "block5": {
      "title": "Les prix, chambre par chambre",
      "intro": "Trois prix, selon la salle d'eau et la taille de la chambre. Tous donnent accès aux mêmes équipements et aux mêmes services.",
      "header": [
        "Chambre",
        "Prix par mois, tout compris",
        "Loyer du bail",
        "Nombre de chambres",
        "Salle d'eau"
      ],
      "rows": [
        [
          "De 16 à 24 m², dans les trois maisons",
          "1 430 CHF",
          "1 530 €",
          "25",
          "privative"
        ],
        [
          "De 18 et 19 m², à La Villa",
          "1 370 CHF",
          "1 470 €",
          "2",
          "partagée entre deux chambres"
        ],
        [
          "De 16 m², à La Villa",
          "1 290 CHF",
          "1 380 €",
          "2",
          "partagée entre deux chambres"
        ]
      ],
      "rooms": "Les chambres disponibles et leurs dates sont à jour sur la page des chambres.",
      "lease": "Le bail est en euros ; les prix en CHF sont indicatifs, au taux d'août 2026.",
      "termsTitle": "Les conditions",
      "terms": [
        "Aucun frais d'entrée : ni dossier, ni agence, ni réservation, ni état des lieux. Nous louons nos maisons en direct.",
        "Caution : deux mois de loyer hors charges, payable en une, deux ou trois fois selon ton dossier. Elle t'est rendue sous 30 jours après ton départ, sous deux mois s'il y a des dégâts à déduire.",
        "Bail de 12 mois. Tu peux partir à tout moment avec un mois de préavis, et entrer à n'importe quelle date.",
        "Dossier : contrat de travail ou promesse d'embauche, pièce d'identité. Un garant n'est demandé qu'au cas par cas.",
        "Loyer réglé par virement, une fois par mois."
      ]
    },
    "block6": {
      "title": "Ta première année avec nous : jusqu'à 1 400 € remboursés",
      "subtitle": "Plus tu restes, plus on te rembourse : 200 € dès ton premier loyer, 300 € à 3 mois, 400 € à 6 mois, 500 € à 1 an. Ton loyer, lui, ne change pas.",
      "deadline": "Pour tout bail signé d'ici le 31 décembre, même si tu n'arrives qu'en janvier."
    },
    "block7": {
      "title": "Une autre formule : L'Appart, notre colocation",
      "paragraphs": [
        "L'Appart est notre colocation à Annemasse, dans le quartier de la gare : 4 chambres dans un appartement de 151 m², disponibles à partir du 1er février 2027. Trois chambres de 12 m² à 730 CHF par mois (790 €) et une suite de 22 m², pour une ou deux personnes, à 990 CHF par mois (1 060 €).",
        "Le prix comprend les charges, la fibre, le streaming et le ménage des parties communes une fois par semaine, et donne accès aux cours de yoga et de sport des maisons. Il ne comprend ni le linge, ni les produits d'entretien. L'Appart n'a ni piscine, ni sauna, ni salle de sport."
      ]
    },
    "block8": [
      [
        "Combien coûte une chambre à La Villa Coliving ?",
        "De 1 290 à 1 430 CHF par mois, tout compris, selon la chambre (de 1 380 à 1 530 € au bail). 25 chambres sur 29 ont une salle d'eau privative et coûtent 1 430 CHF."
      ],
      [
        "Qu'est-ce qui est compris dans le prix à La Villa Coliving ?",
        "Les charges (eau, électricité, chauffage), la fibre, le parking, le ménage des parties communes trois fois par semaine, la buanderie, les produits du quotidien, le streaming sur l'écran commun, et l'accès à la piscine, au sauna et à la salle de sport de la maison. Seule ton assurance habitation s'y ajoute."
      ],
      [
        "J'ai un budget de 1 000 à 1 100 CHF pour mon loyer : La Villa Coliving est-elle dans mes moyens ?",
        "Un loyer de 1 000 CHF à Genève revient à 1 090–1 200 CHF par mois une fois les frais courants ajoutés, et à 1 290–1 400 CHF avec une place de parking (relevé de novembre 2026). À La Villa Coliving, une chambre coûte de 1 290 à 1 430 CHF tout compris, parking inclus. Avec une voiture, c'est le même budget. Sans voiture, une chambre à 1 370 CHF revient à 170–280 CHF de plus par mois, pour plus d'espace et les équipements de la maison."
      ],
      [
        "La Villa Coliving est-elle plus chère qu'une colocation ?",
        "Cela dépend de la colocation. À Genève, une chambre en colocation gérée s'affiche à 1 570 CHF par mois en médiane : La Villa Coliving coûte moins. Côté France, une colocation gérée revient à environ 900 CHF par mois avec une voiture : l'écart est d'environ 470 CHF. Il paie 44 m² par personne au lieu de 26, des chambres de 16 à 24 m², la piscine, le sauna, la salle de sport et le ménage des parties communes trois fois par semaine."
      ],
      [
        "Comment La Villa Coliving se compare-t-elle à un studio à Genève ?",
        "Un studio meublé à Genève s'affiche à 2 100 CHF par mois en médiane (novembre 2026). Avec les charges, l'électricité, internet et les frais courants, il revient à environ 2 300 CHF, et 2 500 CHF avec une place de parking. Une chambre à La Villa Coliving coûte de 1 290 à 1 430 CHF, tout compris."
      ],
      [
        "Y a-t-il des frais de dossier ou d'agence à La Villa Coliving ?",
        "Non, aucun : ni frais de dossier, ni honoraires d'agence, ni frais de réservation, ni frais d'état des lieux. Nous louons nos maisons en direct."
      ],
      [
        "Quel est le montant de la caution ?",
        "Deux mois de loyer hors charges. Elle se paie en une, deux ou trois fois ; le nombre de versements est fixé quand ton dossier est validé. Elle t'est rendue sous 30 jours après ton départ, sous deux mois s'il y a des dégâts à déduire."
      ],
      [
        "Faut-il un garant ou une fiche de salaire suisse ?",
        "Pas d'office. Le dossier tient en trois pièces : contrat de travail signé ou promesse d'embauche, pièce d'identité, caution. Un garant n'est demandé qu'au cas par cas, quand le contrat ne couvre pas le loyer."
      ],
      [
        "Pour combien de temps est-ce que je m'engage ?",
        "Le bail est de 12 mois, mais tu peux partir à tout moment avec un mois de préavis. Tu peux entrer à n'importe quelle date."
      ],
      [
        "Comment se règle le loyer ?",
        "Par virement, une fois par mois. Le bail est en euros ; les prix en CHF du site sont indicatifs."
      ],
      [
        "Existe-t-il une formule moins chère ?",
        "Oui : L'Appart, notre colocation à Annemasse, dès 730 CHF par mois, à partir du 1er février 2027. Elle n'a ni piscine, ni sauna, ni salle de sport."
      ]
    ],
    "block9": {
      "text": "Les chambres disponibles et leurs dates sont à jour sur la page des chambres. La candidature prend deux minutes ; on te répond sous 48 heures, puis on s'appelle."
    }
  },
  "en": {
    "block2": {
      "title": "A room in Geneva or on the French side: what should you budget on top of the rent?",
      "answers": [
        "Rent is not a housing budget. In Geneva as on the French side, there are almost always utilities, move-in fees and, if you have a car, a parking space to add.",
        "In November 2026, in Geneva, a room in a managed flatshare, furnished with all bills included, is listed between CHF 1,250 and 1,785 a month, with a median of CHF 1,570; with a private bathroom, the rooms we found start at CHF 1,560. A room rented from a private landlord is listed at a median of CHF 1,000; it comes to CHF 1,090–1,200 a month with running costs, and CHF 1,290–1,400 with a parking space.",
        "At La Villa Coliving, the listed price is your total spend: CHF 1,290 to 1,430 a month depending on the room, CHF 1,430 with a private bathroom, with parking, pool, sauna and gym included."
      ],
      "itemsTitle": "What comes on top of a rent, item by item",
      "items": [
        "Heating, water and electricity, when the rent is quoted without charges: CHF 80 to 110 a month.",
        "Internet, if not included: CHF 10 to 22 a month per person.",
        "Radio and TV licence fee, in Switzerland: CHF 9 to 14 a month when shared between two or three.",
        "Rental deposit guarantee, in Switzerland: up to CHF 26 a month.",
        "Application or agency fees, on the French side: often €200 to €700 when you move in.",
        "Parking space: CHF 120 to 350 a month in Geneva, €40 to €155 around Annemasse.",
        "Laundry, everyday supplies, linen: about CHF 40 a month.",
        "A streaming subscription: CHF 23 a month."
      ],
      "tableTitle": "What it adds up to, by type of housing",
      "tableUnit": "(CHF a month, rounded to the nearest ten)",
      "header": [
        "Housing",
        "Listed price",
        "Added costs, excluding parking",
        "Parking",
        "Without a car",
        "With a car"
      ],
      "rows": [
        [
          "La Villa Coliving, room at CHF 1,370",
          "1,370",
          "none",
          "included",
          "1,370",
          "1,370"
        ],
        [
          "Room from a private landlord in Geneva",
          "1,000",
          "90 to 200",
          "200",
          "1,090 to 1,200",
          "1,290 to 1,400"
        ],
        [
          "Managed flatshare in Geneva",
          "1,570",
          "80",
          "200",
          "1,650",
          "1,850"
        ],
        [
          "Furnished studio in Geneva",
          "2,100",
          "200",
          "200",
          "2,300",
          "2,500"
        ],
        [
          "Managed flatshare on the French side",
          "770 (€825)",
          "60",
          "70",
          "830",
          "900"
        ],
        [
          "Studio in a residence on the French side",
          "990 (€1,055)",
          "160",
          "70",
          "1,150",
          "1,210"
        ]
      ],
      "gaps": "At La Villa Coliving, a room at CHF 1,290 costs CHF 80 less than the reference in the table; a room with a private bathroom, at CHF 1,430, costs CHF 60 more.",
      "france": "Compared with a managed flatshare on the French side, the gap is about CHF 470 a month with a car. It pays for 44 m² of indoor space per person on average instead of 26 m², rooms of 16 to 24 m² instead of 11 to 16 m², and the houses' facilities, detailed below.",
      "method": "Method: prices collected on 23 November 2026 from listing and operator websites (in Geneva: 47 rooms from private landlords, 16 rooms in managed flatshares, 13 furnished studios; on the French side: 15 managed flatshares and one residence); medians, rounded to the nearest ten. The itemised costs and sources are in our budget guide."
    },
    "block3": {
      "title": "What La Villa Coliving offers beyond a flatshare",
      "intro": "The price difference with a flatshare pays for four things.",
      "points": [
        [
          "1. Space.",
          "At La Villa Coliving, each resident has 44 m² of indoor space on average, from 38 to 49 m² depending on the house. In the managed flatshares we surveyed in November 2026, it is 26 m² on the French side and 36 m² in Geneva. Rooms at La Villa Coliving measure 16 to 24 m², and 25 out of 29 have a private bathroom; in Geneva, a room rented from a private landlord has a median size of 14 m²."
        ],
        [
          "2. A fully equipped house.",
          "Each La Villa Coliving house has its own pool, sauna, gym and home cinema, with landscaped outdoor areas."
        ],
        [
          "3. Nothing to manage.",
          "A cleaning company cleans the shared areas three times a week. Everyday supplies arrive each month, the garden and pool are maintained, and repairs are taken care of, with a reply within 48 working hours. No cleaning rota to negotiate, no bills to split."
        ],
        [
          "4. House life.",
          "The La Villa Coliving houses have 7, 10 and 12 rooms. Residents have a say in who joins them, after an initial selection on our side. Every month, each house hosts a yoga class and a fitness coaching session, open to residents of all three houses, and a house get-together."
        ]
      ],
      "tableHeader": [
        "",
        "La Villa, Ville-la-Grand",
        "Le Loft, Ambilly",
        "Le Lodge, Annemasse"
      ],
      "tableRows": [
        [
          "Rooms",
          "10, from 16 to 24 m²",
          "7, from 20 to 23 m²",
          "12, from 18 to 20 m²"
        ],
        [
          "Indoor space per resident",
          "38 m²",
          "44 m²",
          "49 m²"
        ],
        [
          "Pool",
          "heated outdoor pool, 12 × 5 m",
          "heated indoor pool, all year round",
          "outdoor pool, 12 × 5 m"
        ],
        [
          "Sauna",
          "seats 5",
          "seats 2",
          "seats 5"
        ],
        [
          "Outdoor areas",
          "1,948 m² garden, terraces, barbecue, volleyball",
          "terraces, outdoor kitchen with barbecue",
          "1,500 m² garden, pool house, pétanque, barbecue"
        ]
      ],
      "visit": "The simplest way to judge: come and see a house."
    },
    "block4": {
      "title": "Everything included in the price",
      "intro": "At La Villa Coliving, the listed price covers everything below, in all three houses.",
      "groups": [
        [
          "What you would pay separately elsewhere",
          [
            "Water, electricity and heating, with no year-end adjustment.",
            "Waste collection tax and sewerage charges.",
            "Orange Pro fibre, Wi-Fi throughout the house.",
            "On-site parking (at Le Lodge, no allocated space) and outdoor bike parking.",
            "Furnished room: double bed, mattress, desk, storage.",
            "Bed linen and a towel, lent to you on arrival.",
            "Equipped kitchen, crockery included.",
            "Laundry room: washing machine and tumble dryer free to use, detergent provided.",
            "Essentials basket, delivered each month: toilet paper, kitchen roll, hand soap, laundry detergent, cleaning products, bin bags, cloths, salt, pepper, oil.",
            "Six streaming services on the shared screen: Netflix, Canal+, Apple TV, Amazon Prime, Paramount+ and Max.",
            "No move-in fees: no application, agency, booking or inventory fee."
          ]
        ],
        [
          "What a flatshare doesn't offer",
          [
            "Cleaning of the shared areas by a company, three times a week.",
            "A pool, a sauna and a gym in each house.",
            "Home cinema, games and landscaped outdoor areas.",
            "A yoga class and a fitness coaching session each month in each house, open to residents of all three houses.",
            "A house get-together every month.",
            "Upkeep of the garden, pool and house; repairs taken care of, with a reply within 48 working hours."
          ]
        ],
        [
          "What is not included",
          [
            "Your home insurance.",
            "Cleaning of your room and bathroom.",
            "Washing and replacing linen.",
            "Meals, apart from get-togethers."
          ]
        ]
      ]
    },
    "block5": {
      "title": "Prices, room by room",
      "intro": "Three prices, depending on the bathroom and the size of the room. All give access to the same facilities and services.",
      "header": [
        "Room",
        "Price per month, all-inclusive",
        "Rent on the lease",
        "Number of rooms",
        "Bathroom"
      ],
      "rows": [
        [
          "16 to 24 m², in all three houses",
          "CHF 1,430",
          "€1,530",
          "25",
          "private"
        ],
        [
          "18 and 19 m², at La Villa",
          "CHF 1,370",
          "€1,470",
          "2",
          "shared between two rooms"
        ],
        [
          "16 m², at La Villa",
          "CHF 1,290",
          "€1,380",
          "2",
          "shared between two rooms"
        ]
      ],
      "rooms": "Available rooms and their dates are kept up to date on the rooms page.",
      "lease": "The lease is in euros; prices in CHF are indicative, at the August 2026 rate.",
      "termsTitle": "Terms",
      "terms": [
        "No move-in fees: no application, agency, booking or inventory fee. We let our houses directly.",
        "Deposit: two months' rent excluding charges, payable in one, two or three instalments depending on your application. It is returned within 30 days of your departure, or within two months if damage has to be deducted.",
        "12-month lease. You can leave at any time with one month's notice, and move in on any date.",
        "Application: employment contract or job offer, and ID. A guarantor is only requested case by case.",
        "Rent paid by bank transfer, once a month."
      ]
    },
    "block6": {
      "title": "Your first year with us: up to €1,400 back",
      "subtitle": "The longer you stay, the more you get back: €200 off your first rent, then €300 after 3 months, €400 after 6 months and €500 after a year. Your rent stays the same.",
      "deadline": "For any lease signed by 31 December, even if you only move in in January."
    },
    "block7": {
      "title": "Another option: L'Appart, our flatshare",
      "paragraphs": [
        "L'Appart is our flatshare in Annemasse, in the station district: 4 rooms in a 151 m² flat, available from 1 February 2027. Three 12 m² rooms at CHF 730 a month (€790) and a 22 m² suite, for one or two people, at CHF 990 a month (€1,060).",
        "The price covers utilities, fibre, streaming and cleaning of the shared areas once a week, and gives access to the yoga and fitness classes held in the houses. It does not cover linen or cleaning products. L'Appart has no pool, sauna or gym."
      ]
    },
    "block8": [
      [
        "How much does a room at La Villa Coliving cost?",
        "CHF 1,290 to 1,430 a month, all-inclusive, depending on the room (€1,380 to €1,530 on the lease). 25 rooms out of 29 have a private bathroom and cost CHF 1,430."
      ],
      [
        "What is included in the price at La Villa Coliving?",
        "Utilities (water, electricity, heating), fibre, parking, cleaning of the shared areas three times a week, the laundry room, everyday supplies, streaming on the shared screen, and access to the house's pool, sauna and gym. Only your home insurance comes on top."
      ],
      [
        "My rent budget is CHF 1,000 to 1,100: can I afford La Villa Coliving?",
        "A CHF 1,000 rent in Geneva comes to CHF 1,090–1,200 a month once running costs are added, and CHF 1,290–1,400 with a parking space (November 2026 survey). At La Villa Coliving, a room costs CHF 1,290 to 1,430 all-inclusive, parking included. With a car, it is the same budget. Without a car, a room at CHF 1,370 comes to CHF 170–280 more a month, for more space and the house's facilities."
      ],
      [
        "Is La Villa Coliving more expensive than a flatshare?",
        "It depends on the flatshare. In Geneva, a room in a managed flatshare is listed at a median of CHF 1,570 a month: La Villa Coliving costs less. On the French side, a managed flatshare comes to about CHF 900 a month with a car: the gap is about CHF 470. It pays for 44 m² per person instead of 26, rooms of 16 to 24 m², the pool, the sauna, the gym and cleaning of the shared areas three times a week."
      ],
      [
        "How does La Villa Coliving compare with a studio in Geneva?",
        "A furnished studio in Geneva is listed at a median of CHF 2,100 a month (November 2026). With charges, electricity, internet and running costs, it comes to about CHF 2,300, and CHF 2,500 with a parking space. A room at La Villa Coliving costs CHF 1,290 to 1,430, all-inclusive."
      ],
      [
        "Are there any application or agency fees at La Villa Coliving?",
        "No, none: no application fee, agency fee, booking fee or inventory fee. We let our houses directly."
      ],
      [
        "How much is the deposit?",
        "Two months' rent excluding charges. It can be paid in one, two or three instalments; the number is set when your application is approved. It is returned within 30 days of your departure, or within two months if damage has to be deducted."
      ],
      [
        "Do I need a guarantor or a Swiss payslip?",
        "Not as a rule. The application takes three things: a signed employment contract or job offer, ID, and the deposit. A guarantor is only requested case by case, when the contract does not cover the rent."
      ],
      [
        "How long am I committing for?",
        "The lease is for 12 months, but you can leave at any time with one month's notice. You can move in on any date."
      ],
      [
        "How is the rent paid?",
        "By bank transfer, once a month. The lease is in euros; the CHF prices on the site are indicative."
      ],
      [
        "Is there a cheaper option?",
        "Yes: L'Appart, our flatshare in Annemasse, from CHF 730 a month, available from 1 February 2027. It has no pool, sauna or gym."
      ]
    ],
    "block9": {
      "text": "Available rooms and their dates are kept up to date on the rooms page. Applying takes two minutes; we reply within 48 hours, then we have a call."
    }
  },
  "description": {
    "fr": "Chambre meublée tout compris de 1 290 à 1 430 CHF/mois près de Genève : charges, parking, ménage, piscine et sauna inclus. Le budget réel, poste par poste.",
    "en": "All-inclusive furnished room near Geneva, CHF 1,290 to 1,430 a month: bills, parking, cleaning, pool and sauna included. The real budget, item by item."
  }
};

// Écarts décidés par Jérôme le 24/11/2026, appliqués à la recopie de l'annexe (jamais à la recopie elle-même).
const D20 = {
  fr: 'CHF par mois, arrondis à la dizaine ; totaux calculés avant arrondi',
  en: 'CHF a month, rounded to the nearest ten; totals calculated before rounding',
};
const G2 = { fr: ['1 948', '2 000'], en: ['1,948', '2,000'] };
for (const lang of LANGS) {
  const rows = ANNEX[lang].block3.tableRows;
  rows[rows.length - 1] = rows[rows.length - 1].map((c) => c.replace(G2[lang][0], G2[lang][1]));
}
// (24/11/2026, décision de Jérôme : « restons flous sur la date ») L'ouverture de L'Appart n'est plus datée sur /tarifs : bloc 7 et
// question « Existe-t-il une formule moins chère ? » sans « à partir du 1er février 2027 » / « available from 1 February 2027 ».
const SANS_DATE = { fr: [', disponibles à partir du 1er février 2027', ', à partir du 1er février 2027'], en: [', available from 1 February 2027'] };
const sansDate = (s, lang) => SANS_DATE[lang].reduce((acc, d) => acc.split(d).join(''), s);
for (const lang of LANGS) {
  const walk = (v) => (typeof v === 'string' ? sansDate(v, lang) : Array.isArray(v) ? v.map(walk) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)])) : v);
  ANNEX[lang] = walk(ANNEX[lang]);
}
// (24/11/2026, § 4.7 de la refonte des pages de vente, décision de Jérôme du 24/11, postérieure aux annexes du 23/11) « Candidater »
// devient « Programmer une visite » partout : bloc 9, « La candidature prend… » → « La demande de visite prend… », et son bouton.
const VISITE = { fr: ['La candidature prend', 'La demande de visite prend'], en: ['Applying takes', 'Requesting a visit takes'] };
for (const lang of LANGS) ANNEX[lang].block9.text = ANNEX[lang].block9.text.replace(VISITE[lang][0], VISITE[lang][1]);
/** Titres existants gardés (annexe B : « Existing English headings … are kept ») ; bloc 9 : titre inchangé, boutons de l'annexe
 *  (« Candidater » / « Apply » → « Programmer une visite » / « Book a visit », § 4.7). */
const KEPT = {
  fr: { faq: 'Questions fréquentes sur les tarifs', apply: 'Prêt à nous rejoindre ?', buttons: ['Voir les chambres disponibles', 'Programmer une visite'], essentials: "La Villa Coliving — l'essentiel" },
  en: { faq: 'Pricing — frequently asked questions', apply: 'Ready to Join?', buttons: ['See available rooms', 'Book a visit'], essentials: 'La Villa Coliving — the essentials' },
};
/** Libellés des liens de l'annexe (« [lien : …] »). */
const LINKS = {
  fr: { offer: "Voir l'offre et ses conditions", appart: "Voir L'Appart et ses 4 chambres" },
  en: { offer: 'See the offer and its terms', appart: 'See L\'Appart and its 4 rooms' },
};

// ── La page, regroupée en un module CommonJS dans un dossier temporaire (React et ses dépendances compris) ──────────────────
const dir = mkdtempSync(path.join(tmpdir(), 'lvc-tarifs-budget-'));
const entry = `
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { RatesPageV4 } from "@/pages/RatesPageV4";
export * as T from "@/data/tarifsTexts";
export * as I from "@/data/inclus";
export * as Q from "@/data/faq/tarifsFaq";
export * as B from "@/data/budgetReel";
export * as P from "@/data/priceFacts";
export * as E from "@/data/entityFacts";
export * as O from "@/data/offer";
export function render(lang) {
  const html = renderToStaticMarkup(<MemoryRouter initialEntries={[lang === "en" ? "/en/tarifs" : "/tarifs"]}><LanguageProvider><RatesPageV4 /></LanguageProvider></MemoryRouter>);
  const head = Helmet.renderStatic();
  return { html, script: head.script.toString(), meta: head.meta.toString(), title: head.title.toString() };
}
`;
const out = path.join(dir, 'tarifs.cjs');
await build({
  stdin: { contents: entry, resolveDir: ROOT, loader: 'tsx' },
  bundle: true, outfile: out, format: 'cjs', platform: 'node', target: 'node20', jsx: 'automatic',
  alias: { '@': path.join(ROOT, 'src') }, logLevel: 'silent', loader: { '.css': 'empty', '.svg': 'dataurl', '.png': 'dataurl', '.jpg': 'dataurl', '.webp': 'dataurl' },
  define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env': '{"DEV":false,"PROD":true,"MODE":"production"}' },
});
const M = createRequire(import.meta.url)(out);
const R = { fr: M.render('fr'), en: M.render('en') };
rmSync(dir, { recursive: true, force: true });
const { T, I, Q, B, P, E, O } = M;

// ── Lecture du HTML ───────────────────────────────────────────────────────────────────────────────────────────────────────────
const decode = (s) => String(s).replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
/** Espaces insécables → espace ordinaire, blancs repliés (l'annexe n'a que des espaces ordinaires). */
const plain = (s) => String(s).replace(/[  ]/g, ' ').replace(/\s+/g, ' ').trim();
/** Texte d'un fragment comme un navigateur le lit : balises retirées SANS espace (liens en ligne), entités décodées. */
const inner = (h) => plain(decode(String(h).replace(/<[^>]+>/g, '')));
/** Texte d'un bloc : balises remplacées par une espace (aucune fusion de deux blocs voisins). */
const visible = (h) => plain(decode(String(h).replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ')));
const elements = (html, tag) => [...String(html).matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, 'g'))].map((m) => inner(m[1]));
const main = (lang) => {
  const m = R[lang].html.match(/<main\b[\s\S]*<\/main>/);
  assert.ok(m, `${lang} : <main> absent`);
  return m[0];
};
/** HTML d'une section, de son ouverture (repérée par `marker`) à sa fermeture (les sections ne s'imbriquent pas ici). */
function section(lang, marker) {
  const html = main(lang);
  const at = html.indexOf(marker);
  assert.ok(at !== -1, `${lang} : section « ${marker} » absente`);
  const start = html.lastIndexOf('<section', at);
  const end = html.indexOf('</section>', at);
  return html.slice(start, end + '</section>'.length);
}
/** Lignes d'un tableau : textes des cellules (<th>/<td>), ligne par ligne. */
const tableRows = (html) => [...String(html).matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)]
  .map((r) => [...r[1].matchAll(/<(t[hd])\b[^>]*>([\s\S]*?)<\/\1>|<td\b[^>]*\/>/g)].map((c) => inner(c[2] ?? '')));
const jsonLd = (lang) => [...R[lang].script.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  .map((m) => JSON.parse(m[1].includes('&quot;') ? decode(m[1]) : m[1]));
const metaContent = (lang, name) => decode(R[lang].meta.match(new RegExp(`<meta[^>]*name="${name}"[^>]*content="([^"]*)"`))?.[1] ?? '');
const has = (list, s, where) => assert.ok(list.includes(plain(s)), `${where} : « ${plain(s).slice(0, 110)}… » absent (${list.length} éléments lus)`);

// ── Tests ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

test('sources : contrôles internes vides (relevé, textes, inclus, FAQ)', () => {
  assert.deepEqual(B.budgetReelIssues(), []);
  assert.deepEqual(T.tarifsTextsIssues(), []);
  assert.deepEqual(I.inclusIssues(), []);
  assert.deepEqual(Q.tarifsPageFaqIssues(), []);
  // L'ancre du bloc 2 est celle du lien « Voir le calcul » de la fiche « l'essentiel » (src/data/entityFacts.ts), si elle l'exporte.
  if (E.BUDGET_CALC_LINK) assert.equal(E.BUDGET_CALC_LINK.anchor, T.TARIFS_ANCHORS.calcul);
});

// (25/11/2026, décision de Jérôme) Ordre d'affichage : les prix, puis l'offre (navigateur seulement, absente ici), ce que La Villa
// Coliving offre de plus qu'une colocation, le calcul, les inclus, L'Appart, la FAQ, la fiche « l'essentiel » en bas de page, candidater.
test('ordre des neuf blocs (H1 inchangé, puis les prix, la différence, le calcul, les inclus, L\'Appart, la FAQ, la fiche, candidater) et ancres', () => {
  for (const lang of LANGS) {
    const html = main(lang);
    const A = ANNEX[lang];
    assert.deepEqual(elements(html, 'h1'), [lang === 'en' ? 'Transparent Pricing' : 'Tarifs Transparents'], `${lang} : H1`);
    const h2 = elements(html, 'h2');
    assert.deepEqual(h2, [A.block5.title, A.block3.title, A.block2.title, A.block4.title, A.block7.title, KEPT[lang].faq, KEPT[lang].essentials, KEPT[lang].apply], `${lang} : titres des blocs`);
    // Ancres : nouvelles (calcul, inclus), conservées (objection-prix, echelle-prix + son titre, lappart, faq), l'offre absente.
    const ids = ['echelle-prix', 'echelle-prix-title', 'objection-prix', 'calcul', 'inclus', 'lappart', 'faq', 'entity-facts'];
    let last = -1;
    for (const id of ids) {
      const at = html.indexOf(`id="${id}"`);
      assert.ok(at > last, `${lang} : id="${id}" absent ou hors de l'ordre des blocs`);
      assert.equal(html.split(`id="${id}"`).length - 1, 1, `${lang} : id="${id}" une seule fois`);
      last = at;
    }
    assert.doesNotMatch(html, /id="offre"/, `${lang} : le bloc de l'offre n'est jamais dans le premier rendu`);
  }
});

test('bloc 2 (#calcul) : les trois paragraphes de réponse juste sous le titre, les postes, le tableau et la ligne Méthode, mot pour mot', () => {
  for (const lang of LANGS) {
    const A = ANNEX[lang].block2;
    const s = section(lang, 'id="calcul"');
    // Rien entre le titre et les trois paragraphes de réponse.
    assert.match(s, /<\/h2>\s*<div[^>]*>\s*<p>/, `${lang} : les paragraphes suivent le titre`);
    assert.deepEqual(elements(s, 'p').slice(0, 3), A.answers.map(plain), `${lang} : trois paragraphes de réponse`);
    assert.deepEqual(elements(s, 'h3'), [A.itemsTitle, A.tableTitle].map(plain), `${lang} : sous-titres H3`);
    assert.deepEqual(elements(s, 'li'), A.items.map(plain), `${lang} : postes`);
    const p = elements(s, 'p');
    for (const x of [A.gaps, A.france, A.method]) has(p, x, `${lang} bloc 2`);
    // Le tableau : vrai <table>, <caption> (unité + D20), en-têtes <th scope>, six lignes, les deux colonnes visibles.
    assert.equal((s.match(/<table\b/g) ?? []).length, 1, `${lang} : un tableau`);
    assert.deepEqual(elements(s, 'caption'), [D20[lang]], `${lang} : légende du tableau`);
    assert.ok(A.tableUnit.includes(D20[lang].split(lang === 'en' ? ';' : ' ;')[0]), `${lang} : la légende reprend l'unité de l'annexe`);
    const [head, ...rows] = tableRows(s);
    assert.deepEqual(head, A.header.map(plain), `${lang} : en-têtes de colonnes`);
    assert.deepEqual(rows, A.rows.map((r) => r.map(plain)), `${lang} : lignes du tableau`);
    assert.equal((s.match(/<th scope="col"/g) ?? []).length, 6, `${lang} : 6 en-têtes de colonne`);
    assert.equal((s.match(/<th scope="row"/g) ?? []).length, 6, `${lang} : 6 en-têtes de ligne`);
    assert.equal((s.match(/data-ours="true"/g) ?? []).length, 1, `${lang} : la ligne de La Villa Coliving mise en valeur`);
    assert.match(s, /<tr[^>]*data-ours="true"[^>]*><th scope="row"[^>]*>La Villa Coliving/, `${lang} : la ligne mise en valeur est celle de La Villa Coliving`);
    // Liens : « détaillés plus bas » → #objection-prix ; « notre guide du budget » → l'article (D16).
    assert.match(s, new RegExp(`<a href="#objection-prix"[^>]*>${lang === 'en' ? 'detailed below' : 'détaillés plus bas'}</a>`), `${lang} : lien vers le bloc 3`);
    assert.match(s, new RegExp(`<a[^>]*href="${lang === 'en' ? '/en' : ''}/blog/budget-colocation-geneve-guide-complet"[^>]*>${lang === 'en' ? 'our budget guide' : 'notre guide du budget'}</a>`), `${lang} : lien vers le guide du budget`);
  }
});

test('bloc 3 (#objection-prix) : quatre H3 numérotés, le tableau des maisons (noms liés), les trois cartes sans prix ni texte, mot pour mot', () => {
  for (const lang of LANGS) {
    const A = ANNEX[lang].block3;
    const s = section(lang, 'id="objection-prix"');
    assert.deepEqual(elements(s, 'h3'), A.points.map(([t]) => plain(t)), `${lang} : quatre H3 numérotés`);
    const p = elements(s, 'p');
    has(p, A.intro, `${lang} bloc 3`);
    for (const [, x] of A.points) has(p, x, `${lang} bloc 3`);
    has(p, A.visit, `${lang} bloc 3`);
    assert.match(s, new RegExp(`<a[^>]*href="${lang === 'en' ? '/en' : ''}/candidature"[^>]*>${lang === 'en' ? 'come and see a house' : 'venir voir une maison'}</a>`), `${lang} : lien vers la candidature`);
    // Tableau des maisons (G2 appliqué : jardin de La Villa = 2 000 m²) ; le nom de chaque maison est un lien vers sa page.
    const [head, ...rows] = tableRows(s.slice(s.indexOf('<table'), s.indexOf('</table>')));
    assert.deepEqual(head, A.tableHeader.map(plain), `${lang} : en-tête du tableau des maisons`);
    assert.deepEqual(rows, A.tableRows.map((r) => r.map(plain)), `${lang} : lignes du tableau des maisons`);
    for (const slug of ['lavilla', 'leloft', 'lelodge']) assert.match(s, new RegExp(`<th scope="col"[^>]*><a[^>]*href="${lang === 'en' ? '/en' : ''}/${slug}"`), `${lang} : nom de ${slug} lié à sa page`);
    assert.doesNotMatch(s, /1[  ,]?948/, `${lang} : jamais 1 948 m² (G2)`);
    // D18 : trois cartes (photo, nom, commune, lien), ni prix ni texte.
    const cards = [...s.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)].map((m) => m[1]);
    assert.equal(cards.length, 3, `${lang} : trois cartes`);
    for (const c of cards) {
      assert.match(c, /<img\b[^>]*alt="[^"]+"/, `${lang} : photo avec texte alternatif`);
      assert.doesNotMatch(visible(c), /CHF|€|\d{3}/, `${lang} : aucun prix sur une carte`);
      assert.equal(elements(c, 'p').length, 2, `${lang} : nom et commune seulement`);
    }
  }
});

test('bloc 4 (#inclus) : trois listes sous trois H3, sans compteur, mot pour mot', () => {
  for (const lang of LANGS) {
    const A = ANNEX[lang].block4;
    const s = section(lang, 'id="inclus"');
    has(elements(s, 'p'), A.intro, `${lang} bloc 4`);
    assert.deepEqual(elements(s, 'h3'), A.groups.map(([t]) => plain(t)), `${lang} : trois H3`);
    assert.deepEqual(elements(s, 'li'), A.groups.flatMap(([, items]) => items.map(plain)), `${lang} : listes`);
    // Même source que la page : src/data/inclus.ts.
    assert.deepEqual(I.inclusGroups(lang).map((g) => g.items.map(plain)), A.groups.map(([, items]) => items.map(plain)));
    assert.doesNotMatch(visible(s), /\b24\b/, `${lang} : aucun « 24 » dans le bloc`);
  }
});

test('bloc 5 (#echelle-prix) : trois lignes (du prix le plus courant au moins courant), lien vers les chambres, conditions, mot pour mot', () => {
  for (const lang of LANGS) {
    const A = ANNEX[lang].block5;
    const s = section(lang, 'id="echelle-prix"');
    const p = elements(s, 'p');
    for (const x of [A.intro, A.rooms, A.lease]) has(p, x, `${lang} bloc 5`);
    const [head, ...rows] = tableRows(s);
    assert.deepEqual(head, A.header.map(plain), `${lang} : en-têtes`);
    assert.deepEqual(rows, A.rows.map((r) => r.map(plain)), `${lang} : trois lignes`);
    assert.deepEqual(elements(s, 'h3'), [plain(A.termsTitle)], `${lang} : H3 des conditions`);
    assert.deepEqual(elements(s, 'li'), A.terms.map(plain), `${lang} : conditions`);
    assert.match(s, new RegExp(`<a[^>]*href="${lang === 'en' ? '/en' : ''}/chambres-disponibles"[^>]*>${lang === 'en' ? 'the rooms page' : 'la page des chambres'}</a>`), `${lang} : lien vers les chambres`);
    assert.doesNotMatch(visible(s), /L'Appart|730|990/, `${lang} : L'Appart n'est plus dans ce tableau`);
  }
});

test('bloc 7 (#lappart) : texte de l\'annexe, lien vers /lappart, bloc statique de L\'Appart (data-appart-teaser), deux gammes', () => {
  for (const lang of LANGS) {
    const A = ANNEX[lang].block7;
    const s = section(lang, 'id="lappart"');
    assert.deepEqual(elements(s, 'p'), A.paragraphs.map(plain), `${lang} : deux paragraphes`);
    assert.match(s, /^<section\b[^>]*\bdata-appart-teaser="\/tarifs"/, `${lang} : bloc statique de L'Appart de /tarifs`);
    assert.equal((main(lang).match(/data-appart-teaser=/g) ?? []).length, 1, `${lang} : un seul bloc statique`);
    assert.match(decode(s), new RegExp(`<a[^>]*href="${lang === 'en' ? '/en' : ''}/lappart"[^>]*>${LINKS[lang].appart}`), `${lang} : lien vers L'Appart`);
    // Texte du bloc tel que la garde le lit (titre, paragraphes, lien) : ce que appartTeaser('/tarifs') doit rendre.
    assert.equal(visible(s), plain([A.title, ...A.paragraphs, LINKS[lang].appart].join(' ')), `${lang} : texte du bloc statique`);
    // Deux gammes : aucun prix de L'Appart dans une phrase qui nomme piscine, sauna ou salle de sport.
    for (const sentence of A.paragraphs.flatMap((x) => x.split(/(?<=[.!?;])\s+/))) {
      assert.ok(!(/\b(?:730|790|990|1[ ,]060|530)\b/.test(sentence) && /piscine|sauna|salle de sport|\bpool\b|\bgym\b/i.test(sentence)), `${lang} : « ${sentence} »`);
    }
  }
});

test('bloc 8 (#faq) : onze questions en H3, réponses dans le HTML même repliées, FAQPage identique (mots et nombre), sans la FAQ A.3', () => {
  for (const lang of LANGS) {
    const A = ANNEX[lang].block8;
    assert.equal(A.length, 11);
    const s = section(lang, 'id="faq"');
    assert.deepEqual(elements(s, 'h3'), A.map(([q]) => plain(q)), `${lang} : onze questions`);
    const text = inner(s);
    for (const [, a] of A) assert.ok(text.includes(plain(a)), `${lang} : réponse absente du HTML — « ${plain(a).slice(0, 80)}… »`);
    assert.deepEqual(Q.tarifsPageFaq[lang].map(({ q, a }) => [plain(q), plain(a)]), A.map(([q, a]) => [plain(q), plain(a)]), `${lang} : source`);
    const faqPages = jsonLd(lang).filter((n) => n['@type'] === 'FAQPage');
    assert.equal(faqPages.length, 1, `${lang} : un FAQPage`);
    const ld = faqPages[0].mainEntity.map((x) => [x.name, x.acceptedAnswer.text]);
    assert.deepEqual(ld, Q.tarifsPageFaq[lang].map(({ q, a }) => [q, a]), `${lang} : FAQPage = questions visibles, au caractère près`);
    assert.deepEqual(ld.map(([q, a]) => [plain(q), plain(a)]), A.map(([q, a]) => [plain(q), plain(a)]), `${lang} : FAQPage = annexe`);
    // G1 : la FAQ A.3 « La Villa Coliving est-elle chère ? » n'est plus sur /tarifs (les autres pages la gardent).
    const a3 = P.priceJustificationFaq(lang);
    assert.ok(!visible(main(lang)).includes(plain(a3.q)) && !visible(main(lang)).includes(plain(a3.a).slice(0, 80)), `${lang} : FAQ A.3 absente`);
  }
});

test('bloc 9 : texte de l\'annexe sans chiffre d\'économie, les deux boutons (chambres, candidature)', () => {
  for (const lang of LANGS) {
    const s = section(lang, KEPT[lang].apply);
    has(elements(s, 'p'), ANNEX[lang].block9.text, `${lang} bloc 9`);
    const links = [...s.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map((m) => ({ href: /href="([^"]*)"/.exec(m[1])?.[1], text: inner(m[2]) }));
    assert.deepEqual(links.map((l) => l.text), KEPT[lang].buttons, `${lang} : boutons`);
    assert.deepEqual(links.map((l) => l.href), [`${lang === 'en' ? '/en' : ''}/chambres-disponibles`, `${lang === 'en' ? '/en' : ''}/candidature`], `${lang} : cibles`);
  }
});

test('bloc 6 (l\'offre) : textes de l\'annexe ; seulement du 24/11/2026 au 31/12/2026 23 h 59 (Paris) ; jamais sous automatisation ni au premier rendu', () => {
  for (const lang of LANGS) {
    const A = ANNEX[lang].block6;
    const t = T.firstYearOfferBlock(lang);
    assert.deepEqual([t.title, t.subtitle, t.deadline].map(plain), [A.title, A.subtitle, A.deadline].map(plain), `${lang} : textes de l'offre`);
    assert.equal(t.link, LINKS[lang].offer);
    assert.equal(t.path, O.OFFER_PATH_FR);
    // L'équivalent en CHF, comme sur la page de l'offre : une phrase à part (jamais € et CHF dans la même phrase).
    assert.equal(plain(t.chf), lang === 'en' ? "That's about CHF 1,300." : 'Soit environ 1 300 CHF.');
    for (const s of [t.title, t.subtitle, t.deadline]) assert.doesNotMatch(s, /CHF|loyer réduit|reduced rent|barr/i, `${lang} : « ${s} »`);
  }
  const at = (iso) => Date.parse(iso);
  assert.equal(T.tarifsOfferShown(at('2026-11-24T00:01:00+01:00'), false), true, 'début de l\'offre (24/11, 0 h 01)');
  assert.equal(T.tarifsOfferShown(at('2026-12-31T23:59:00+01:00'), false), true, '31/12/2026 à 23 h 59 : visible');
  assert.equal(T.tarifsOfferShown(at('2027-01-01T00:01:00+01:00'), false), false, '01/01/2027 à 0 h 01 : absent');
  assert.equal(T.tarifsOfferShown(at('2026-11-23T23:59:00+01:00'), false), false, 'avant le 24/11 (offre d\'hiver) : absent');
  assert.equal(T.tarifsOfferShown(at('2026-12-15T12:00:00+01:00'), true), false, 'navigateur automatisé (prérendu) : jamais');
  // Le premier rendu (= ce que capture le prérendu) ne porte aucune trace de l'offre, ni le FAQPage, ni les données structurées.
  const offerWords = /première année|first year|remboursés|jusqu'à 1[  ]400|1[  ]400[  ]€|€1,400|up to €|winter-offer|offre-hiver/i;
  for (const lang of LANGS) {
    assert.doesNotMatch(visible(main(lang)), offerWords, `${lang} : offre absente du premier rendu`);
    assert.doesNotMatch(main(lang), /href="[^"]*(?:offre-hiver|winter-offer)/, `${lang} : aucun lien vers l'offre au premier rendu`);
    assert.doesNotMatch(R[lang].script, offerWords, `${lang} : offre absente des données structurées`);
    for (const { q, a } of Q.tarifsPageFaq[lang]) assert.doesNotMatch(q + a, offerWords, `${lang} : offre absente de la FAQ`);
  }
  // Le bloc n'est rendu qu'après l'hydratation (useHydrated) et seulement si tarifsOfferShownNow() — jamais par un état initial.
  const src = readFileSync(path.join(ROOT, 'src/pages/RatesPageV4.tsx'), 'utf8');
  assert.match(src, /function OfferSection\([^)]*\) \{\s*const hydrated = useHydrated\(\);[\s\S]{0,120}?if \(!hydrated \|\| !tarifsOfferShownNow\(\)\) return null;/);
  assert.match(src, /gtagEvent\("offer_cta_click", \{ offer: offerAt\(\)\?\.id \?\? "none", placement: "tarifs"/, 'événement offer_cta_click, emplacement tarifs');
});

test('en-tête de page : <title> inchangé, description D19 (≤ 160 caractères) reprise par la fiche LocalBusiness ; données structurées', () => {
  const TITLE = { fr: 'Tarifs : un loyer tout compris près de Genève | La Villa Coliving', en: 'Rates: one all-inclusive rent near Geneva | La Villa Coliving' };
  for (const lang of LANGS) {
    assert.equal(inner(R[lang].title), TITLE[lang], `${lang} : <title>`);
    const description = metaContent(lang, 'description');
    assert.equal(plain(description), plain(ANNEX.description[lang]), `${lang} : description D19`);
    assert.ok(description.length <= 160, `${lang} : description de ${description.length} caractères`);
    assert.doesNotMatch(R[lang].title, /CHF|€/, `${lang} : jamais de prix dans le <title>`);
    const nodes = jsonLd(lang);
    const lb = nodes.filter((n) => n['@type'] === 'LocalBusiness');
    assert.equal(lb.length, 1, `${lang} : une fiche LocalBusiness`);
    assert.equal(lb[0].description, description, `${lang} : la fiche LocalBusiness reprend la description`);
    assert.ok(lb[0].priceRange, `${lang} : priceRange présent (inchangé, D21)`);
    const offers = nodes.filter((n) => n['@type'] === 'AggregateOffer');
    assert.equal(offers.length, 1, `${lang} : une AggregateOffer de premier niveau (les maisons)`);
    assert.deepEqual([offers[0].lowPrice, offers[0].highPrice, offers[0].offerCount], ['1290', '1430', 29], `${lang} : offre des maisons`);
    const catalog = nodes.find((n) => n['@type'] === 'OfferCatalog');
    assert.ok(catalog, `${lang} : catalogue de L'Appart`);
    const ap = catalog.itemListElement[0];
    assert.deepEqual([ap['@type'], ap.lowPrice, ap.highPrice, ap.offerCount], ['AggregateOffer', '730', '990', 4], `${lang} : offre de L'Appart`);
    assert.ok(nodes.some((n) => n['@type'] === 'BreadcrumbList'), `${lang} : fil d'Ariane`);
    assert.doesNotMatch(R[lang].script, /aggregateRating|"@type":\s*"Review"/, `${lang} : aucun aggregateRating ni Review`);
  }
});

test('chaînes interdites (§ 3 du brief) : absentes de la page rendue, des textes et du code de la page', () => {
  const FORBIDDEN = [
    /\b815\b/, /100\s?\+\s?(?:résidents heureux|happy residents)/i, /places limitées|limited (?:spots|places)/i, /Marie L\./,
    /\b24 services\b/i, /deux fois plus grandes|up to twice/i, /9 à 12 m²|9-12 m²|9 to 12 m²/, /loyer le plus bas|lowest rent/i,
    /\d+\s?(?:h|heures?|hours?)\s+(?:de ménage|of cleaning)/i, /chaque semaine|hebdomadaires?|\bweekly\b|every week/i,
    /en option|as an? option/i, /dîners? communautaires?|community dinners?/i, /Netflix (?:&|et) (?:services )?streaming/i,
    /Pour moins qu'un studio|For less than a studio/i, /1[  ]380 CHF|CHF 1,380/, /loyer réduit|reduced rent/i, /!/,
  ];
  for (const lang of LANGS) {
    const page = visible(main(lang));
    const texts = [...T.tarifsStaticStrings(lang), ...I.inclusGroups(lang).flatMap((g) => [g.title, ...g.items]), ...Q.tarifsPageFaq[lang].flatMap(({ q, a }) => [q, a]), ...Object.values(T.firstYearOfferBlock(lang))].join('\n');
    // La fiche « l'essentiel » (lot 2) a sa garde : ici, la page hors fiche.
    const own = page.replace(visible(section(lang, 'id="entity-facts"')), ' ');
    for (const re of FORBIDDEN) {
      if (re.source === '!') { assert.doesNotMatch(texts, re, `${lang} : point d'exclamation`); continue; }
      assert.doesNotMatch(own, re, `${lang} : ${re} dans la page`);
      assert.doesNotMatch(texts, re, `${lang} : ${re} dans les textes`);
    }
  }
  const src = readFileSync(path.join(ROOT, 'src/pages/RatesPageV4.tsx'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  for (const re of FORBIDDEN.slice(0, -1)) assert.doesNotMatch(src, re, `code de la page : ${re}`);
  // Plus aucune source de l'ancienne page : économie mensuelle, phrase-clé A.4, FAQ A.3, bloc L'Appart de la marque, mois suivant.
  for (const name of ['MONTHLY_SAVINGS_CHF', 'PRICE_KEY_SENTENCE', 'priceJustificationFaq', 'MARKET_COMPARISON', 'useRenderMonth', 'AppartTeaser', 'tarifsFaq[']) {
    assert.ok(!src.includes(name), `code de la page : ${name}`);
  }
});

test('mobile (375 px) : chaque tableau défile dans son propre cadre, première colonne figée ; la page ne défile jamais en largeur', () => {
  for (const lang of LANGS) {
    const html = main(lang);
    const tables = [...html.matchAll(/<table\b/g)].map((m) => m.index);
    assert.equal(tables.length, 3, `${lang} : trois tableaux (budget, maisons, prix)`);
    for (const at of tables) {
      const open = html.lastIndexOf('<div', at);
      const frame = html.slice(open, at);
      assert.match(frame, /^<div class="[^"]*\boverflow-x-auto\b[^"]*"[^>]*role="region"[^>]*tabindex="0"[^>]*>$/, `${lang} : cadre défilant accessible au clavier`);
    }
    for (const row of [...html.matchAll(/<th scope="row" class="([^"]*)"/g)].map((m) => m[1])) assert.match(row, /\bsticky left-0\b/, `${lang} : en-tête de ligne figé`);
    // Rien d'autre n'impose une largeur minimale à la page.
    const minW = [...html.matchAll(/class="[^"]*\bmin-w-\[(\d+)px\][^"]*"/g)];
    for (const m of minW) assert.ok(Number(m[1]) <= 200 || /<table\b[^>]*$/.test(html.slice(html.lastIndexOf('<', m.index), m.index + 1)), `${lang} : largeur minimale ${m[1]} px hors d'un tableau`);
  }
});

test('l\'ancienne FAQ reste servie à /chambres-disponibles (deux premières questions, dont A.3) et /faq (questions de L\'Appart), inchangées', () => {
  for (const lang of LANGS) {
    const a3 = P.priceJustificationFaq(lang);
    assert.equal(Q.tarifsFaq[lang][1].q, a3.q, `${lang} : tarifsFaq[1] = FAQ A.3 (lue par /chambres-disponibles)`);
    assert.equal(Q.tarifsFaq[lang][1].a, a3.a);
    assert.equal(Q.appartPriceFaq[lang].length, 2, `${lang} : appartPriceFaq (lue par /faq)`);
    assert.equal(Q.tarifsPageFaq[lang].length, 11);
    assert.ok(Q.tarifsPageFaq[lang].every(({ q }) => q !== a3.q), `${lang} : A.3 hors du bloc 8`);
  }
});

test('typographie : milliers en espace insécable en français (jamais une espace ordinaire), virgule en anglais ; fourchettes au tiret demi-cadratin', () => {
  for (const lang of LANGS) {
    // Blocs 2 à 9 (la fiche « l'essentiel » a sa garde), nœud texte par nœud texte, insécables gardées.
    const html = main(lang);
    const nodes = html.slice(html.indexOf('id="calcul"')).split(/<[^>]+>/).map(decode).filter((t) => /\d/.test(t));
    assert.ok(nodes.length > 50, `${lang} : ${nodes.length} nœuds texte chiffrés lus`);
    const plainSpace = nodes.filter((t) => /\d \d{3}(?!\d)/.test(t));
    assert.deepEqual(plainSpace, [], `${lang} : milliers séparés par une espace ordinaire`);
    if (lang === 'fr') {
      assert.ok(nodes.some((t) => t.includes('1 290–1 400 CHF')), 'fr : « 1 290–1 400 CHF » (insécables, tiret demi-cadratin)');
      assert.ok(nodes.every((t) => !/\d,\d{3}\b/.test(t)), 'fr : jamais de virgule de milliers');
    } else {
      assert.ok(nodes.some((t) => t.includes('CHF 1,290–1,400')), 'en : « CHF 1,290–1,400 »');
      assert.ok(nodes.every((t) => !/\d \d{3}\b/.test(t)), 'en : jamais d\'insécable de milliers');
    }
  }
});
