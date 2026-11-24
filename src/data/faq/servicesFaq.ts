import type { QAPair } from "@/lib/structuredData";
import { PRICE_FROM_CHF_FR, PRICE_FROM_CHF_EN } from "@/data/stats";
import { timesPerWeek } from "@/data/priceFacts";
import { inclusPhrases } from "@/data/inclus";

// §10 du playbook AEO — /services (détail des prestations incluses). Tutoiement, texte verbatim.
// (24/11/2026, lot 3 du brief « budget réel ») Plus de « 24 services » ni de cours « chaque semaine » : ce que comprend le prix des
// maisons se lit dans src/data/inclus.ts (bloc 4 de /tarifs) ; la soirée commune remplace « pizza party et dîners communautaires ».
const FR = inclusPhrases("fr");
const EN = inclusPhrases("en");
export const servicesFaq: { fr: QAPair[]; en: QAPair[] } = {
  fr: [
    {
      q: "Quels services sont inclus dans le loyer chez La Villa ?",
      a: `Chez La Villa Coliving, un seul loyer, dès ${PRICE_FROM_CHF_FR}/mois, comprend les charges, la ${FR.fibreSpeed}, le parking sur place, le ménage des communs ${timesPerWeek("fr")}, la buanderie, le panier de base livré chaque mois, ${FR.streaming}, la piscine, le sauna et la salle de sport, ${FR.classesEachHouse}, et ${FR.getTogether}.`,
    },
    {
      q: "Les cours de yoga et de fitness sont-ils vraiment inclus ?",
      a: `Oui. Chez La Villa Coliving, chaque maison accueille chaque mois un cours de yoga et une séance de coaching sportif, ${FR.openToAll}, compris dans ton loyer. Ils restent optionnels : tu y participes quand tu veux, sans supplément.`,
    },
    {
      q: "Le sauna est-il inclus ?",
      a: "Oui. Chaque maison de La Villa Coliving dispose d'un sauna inclus dans le loyer : finlandais au Loft (Ambilly) et au Lodge (Annemasse), infrarouge à La Villa (Ville-la-Grand). Tu y accèdes librement, comme à la piscine et à la salle de sport.",
    },
    {
      q: "La salle de sport est-elle accessible 24h/24 ?",
      a: "Oui. Dans les trois maisons de La Villa Coliving, la salle de sport est en libre accès 24h/24 et 7j/7, sans réservation ni supplément : salle équipée à La Villa (Ville-la-Grand) et au Loft (Ambilly), chalet fitness dédié au Lodge (Annemasse). Tu t'entraînes quand tu veux, tôt le matin comme tard le soir.",
    },
    {
      q: "À quelle fréquence le ménage est-il assuré ?",
      a: "Chez La Villa Coliving, les parties communes sont nettoyées trois fois par semaine, ménage inclus dans ton loyer. L'entretien de la piscine, du jardin et les réparations sont également pris en charge.",
    },
    {
      q: "La nourriture est-elle incluse dans le loyer ?",
      a: "Non, la nourriture n'est pas incluse chez La Villa Coliving : tu disposes d'une cuisine équipée, souvent double, pour cuisiner librement. En revanche, une soirée commune est organisée chaque mois dans chaque maison, et elle est comprise dans le loyer.",
    },
  ],
  en: [
    {
      q: "What services are included in the rent at La Villa?",
      a: `At La Villa Coliving, a single rent, from ${PRICE_FROM_CHF_EN}/month, covers utilities, ${EN.fibreSpeed}, on-site parking, cleaning of the shared areas ${timesPerWeek("en")}, the laundry room, the monthly essentials basket, ${EN.streaming}, the pool, the sauna and the gym, ${EN.classesEachHouse}, and ${EN.getTogether}.`,
    },
    {
      q: "Are the yoga and fitness classes really included?",
      a: `Yes. At La Villa Coliving, each house hosts a yoga class and a fitness coaching session every month, ${EN.openToAll}, included in your rent. They remain optional: you join whenever you want, at no extra cost.`,
    },
    {
      q: "Is the sauna included?",
      a: "Yes. Every La Villa Coliving house has a sauna included in the rent: Finnish at Le Loft (Ambilly) and Le Lodge (Annemasse), infrared at La Villa (Ville-la-Grand). You access it freely, like the pool and the gym.",
    },
    {
      q: "Is the gym open 24/7?",
      a: "Yes. In all three La Villa Coliving houses, the gym is freely accessible 24/7, with no booking and no extra cost: an equipped gym at La Villa (Ville-la-Grand) and Le Loft (Ambilly), a dedicated fitness chalet at Le Lodge (Annemasse). You train whenever you want, early morning or late at night.",
    },
    {
      q: "How often is cleaning done?",
      a: "At La Villa Coliving, common areas are cleaned three times a week, cleaning included in your rent. Pool and garden upkeep and repairs are also taken care of.",
    },
    {
      q: "Is food included in the rent?",
      a: "No, food is not included at La Villa Coliving: you have an equipped kitchen, often double, to cook freely. However, each house hosts a get-together every month, included in the rent.",
    },
  ],
};
