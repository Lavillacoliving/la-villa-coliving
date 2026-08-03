import type { QAPair } from "@/lib/structuredData";
import { PRICE_CHF_FR, PRICE_CHF_EN } from "@/data/stats";

// FAQ de l'accueil — front A6 « coliving genève » (PAA + AEO). Tutoiement,
// texte verbatim : ces réponses sont AUSSI balisées FAQPage (règle d'or :
// le texte balisé doit être identique au texte visible).
// Faits verrouillés : prix via stats.ts, caution 2 mois hors charges,
// durée « 13 mois en moyenne (9 mois hors longs séjours) », jamais de
// comparaison « moins cher que Genève » (voir src/data/barometre.ts).
export const homeFaq: { fr: QAPair[]; en: QAPair[] } = {
  fr: [
    {
      q: "Qu'est-ce que le coliving chez La Villa ?",
      a: "Le coliving est un mode de logement où chaque résident dispose de sa chambre meublée privée dans une maison partagée, avec tous les services réunis dans un seul loyer : charges, internet fibre, ménage, équipements et vie de communauté. Chez La Villa Coliving, cela prend la forme de trois maisons de 7 à 12 résidents près de Genève, avec piscine, sauna et salle de sport.",
    },
    {
      q: "Y a-t-il du coliving près de Genève ?",
      a: `Oui. La Villa Coliving gère trois maisons de coliving à 20 minutes du centre de Genève, côté France : La Villa à Ville-la-Grand, Le Loft à Ambilly et Le Lodge à Annemasse. Chacune propose des chambres meublées de 17 à 23 m², tout inclus dès ${PRICE_CHF_FR}/mois, avec piscine, sauna et salle de sport.`,
    },
    {
      q: "Combien coûte une chambre en coliving à Genève ?",
      a: `Chez La Villa Coliving, le loyer tout inclus démarre à ${PRICE_CHF_FR}/mois : chambre meublée de 17 à 23 m², toutes les charges, internet fibre jusqu'à 8 Gb/s, ménage des parties communes deux fois par semaine, piscine, sauna, salle de sport, cours de yoga et événements. Un seul paiement par mois, sans frais cachés.`,
    },
    {
      q: "Y a-t-il des frais de dossier ou d'agence ?",
      a: "Non, aucun. Tu ne paies ni frais de dossier, ni honoraires d'agence, ni frais de réservation : 0 € à l'entrée. Nous louons nos maisons en direct, sans intermédiaire. Le seul autre montant est la caution de deux mois de loyer hors charges, restituée après ton départ.",
    },
    {
      q: "Comment rejoindre Genève depuis les maisons ?",
      a: "Les trois maisons sont dans le Grand Genève, côté France, à Ville-la-Grand, Ambilly et Annemasse. Depuis la gare d'Annemasse, le Léman Express rejoint Genève Eaux-Vives en 8 minutes environ, avec un train toutes les 10 minutes en heure de pointe. En transports, en vélo ou en voiture, le centre de Genève est à environ 20 minutes.",
    },
    {
      q: "Comment se passe la candidature ?",
      a: "Tu remplis le formulaire de candidature en 2 minutes, et on te répond sous 48 h. Ensuite : un échange pour faire connaissance, une visite de la maison, et si tout est aligné, tu peux emménager en 2 semaines. Sans engagement et sans frais de dossier — la durée de séjour moyenne chez nous est de 13 mois (9 mois hors longs séjours).",
    },
  ],
  en: [
    {
      q: "What is coliving at La Villa?",
      a: "Coliving is a housing model where each resident has their own private furnished room in a shared house, with all services bundled into a single rent: utilities, fibre internet, cleaning, amenities and community life. At La Villa Coliving, this takes the form of three houses of 7 to 12 residents near Geneva, with a pool, sauna and gym.",
    },
    {
      q: "Is there coliving near Geneva?",
      a: `Yes. La Villa Coliving runs three coliving houses 20 minutes from central Geneva, on the French side: La Villa in Ville-la-Grand, Le Loft in Ambilly and Le Lodge in Annemasse. Each offers furnished rooms of 17 to 23 m², all inclusive from ${PRICE_CHF_EN}/month, with a pool, sauna and gym.`,
    },
    {
      q: "How much does a coliving room near Geneva cost?",
      a: `At La Villa Coliving, all-inclusive rent starts at ${PRICE_CHF_EN}/month: a furnished room of 17 to 23 m², all utilities, fibre internet up to 8 Gb/s, cleaning of common areas twice a week, pool, sauna, gym, yoga classes and events. One single monthly payment, no hidden costs.`,
    },
    {
      q: "Are there application or agency fees?",
      a: "No, none. You pay no application fee, no agency commission and no booking fee: €0 to move in. We rent our houses directly, with no middleman. The only other amount is the deposit of two months' rent excluding charges, returned after you leave.",
    },
    {
      q: "How do you get to Geneva from the houses?",
      a: "All three houses are in Greater Geneva, on the French side, in Ville-la-Grand, Ambilly and Annemasse. From Annemasse station, the Léman Express reaches Geneva Eaux-Vives in about 8 minutes, with a train every 10 minutes at peak times. By public transport, bike or car, central Geneva is about 20 minutes away.",
    },
    {
      q: "How does the application work?",
      a: "You fill in the application form in 2 minutes, and we reply within 48h. Then: a chat to get to know each other, a house visit, and if everything lines up you can move in within 2 weeks. No commitment and no application fees — the average stay with us is 13 months (9 months excluding long stays).",
    },
  ],
};
