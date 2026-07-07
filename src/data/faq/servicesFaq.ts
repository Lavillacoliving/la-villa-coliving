import type { QAPair } from "@/lib/structuredData";
import { PRICE_CHF_FR, PRICE_CHF_EN } from "@/data/stats";

// §10 du playbook AEO — /services (détail des prestations incluses). Tutoiement, texte verbatim.
export const servicesFaq: { fr: QAPair[]; en: QAPair[] } = {
  fr: [
    {
      q: "Quels services sont inclus dans le loyer chez La Villa ?",
      a: `Chez La Villa Coliving, une vingtaine de services sont inclus dans un loyer unique dès ${PRICE_CHF_FR}/mois : charges, internet fibre jusqu'à 8 Gb/s, ménage des communs deux fois par semaine, piscine, sauna, salle de sport, cours de yoga et fitness, streaming, événements communautaires et livraison d'essentiels mensuels.`,
    },
    {
      q: "Les cours de yoga et de fitness sont-ils vraiment inclus ?",
      a: "Oui. Chez La Villa Coliving, les cours de yoga et de fitness sont inclus dans ton loyer et organisés chaque semaine dans les maisons. Ils restent optionnels : tu y participes quand tu veux, sans supplément.",
    },
    {
      q: "Le sauna est-il inclus ?",
      a: "Oui. Chaque maison de La Villa Coliving dispose d'un sauna inclus dans le loyer : finlandais au Loft (Ambilly) et au Lodge (Annemasse), infrarouge à La Villa (Ville-la-Grand). Tu y accèdes librement, comme à la piscine et à la salle de sport.",
    },
    {
      q: "À quelle fréquence le ménage est-il assuré ?",
      a: "Chez La Villa Coliving, les parties communes sont nettoyées deux fois par semaine, ménage inclus dans ton loyer. L'entretien de la piscine, du jardin et les réparations sont également pris en charge.",
    },
    {
      q: "La nourriture est-elle incluse dans le loyer ?",
      a: "Non, la nourriture n'est pas incluse chez La Villa Coliving : tu disposes d'une cuisine équipée, souvent double, pour cuisiner librement. En revanche, des moments conviviaux comme la pizza party mensuelle et les dîners communautaires sont organisés et inclus.",
    },
  ],
  en: [
    {
      q: "What services are included in the rent at La Villa?",
      a: `At La Villa Coliving, around twenty services are included in a single rent from ${PRICE_CHF_EN}/month: utilities, fibre internet up to 8 Gb/s, cleaning of common areas twice a week, pool, sauna, gym, yoga and fitness classes, streaming, community events and monthly delivery of essentials.`,
    },
    {
      q: "Are the yoga and fitness classes really included?",
      a: "Yes. At La Villa Coliving, yoga and fitness classes are included in your rent and held every week in the houses. They remain optional: you join whenever you want, at no extra cost.",
    },
    {
      q: "Is the sauna included?",
      a: "Yes. Every La Villa Coliving house has a sauna included in the rent: Finnish at Le Loft (Ambilly) and Le Lodge (Annemasse), infrared at La Villa (Ville-la-Grand). You access it freely, like the pool and the gym.",
    },
    {
      q: "How often is cleaning done?",
      a: "At La Villa Coliving, common areas are cleaned twice a week, cleaning included in your rent. Pool and garden upkeep and repairs are also taken care of.",
    },
    {
      q: "Is food included in the rent?",
      a: "No, food is not included at La Villa Coliving: you have an equipped kitchen, often double, to cook freely. However, convivial moments like the monthly pizza party and community dinners are organised and included.",
    },
  ],
};
