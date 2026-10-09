import type { QAPair } from "@/lib/structuredData";
import { STATS, STATS_DISPLAY, PRICE_SHARED_CHF_FR, PRICE_SHARED_CHF_EN, TRANSIT } from "@/data/stats";
import { GUARANTOR_SENTENCE } from "@/data/entityFacts";

// (Lot L1 « ingénierie des créneaux », 10/2026) Trajets depuis TRANSIT (D1-L1), « 20 min » toujours qualifié
// (STATS_DISPLAY.distance), réponse A.6 (dossier en trois pièces + phrase garant canonique) dans « Comment se
// passe la candidature ? » — pas dans le hero (mobile).
const T = TRANSIT;

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
      a: `Oui. La Villa Coliving gère trois maisons de coliving côté France, à ${STATS_DISPLAY.fr.distance} : La Villa à Ville-la-Grand, Le Loft à Ambilly et Le Lodge à Annemasse. Chacune propose des chambres meublées de ${STATS.roomSizeMin} à ${STATS.roomSizeMax} m², tout inclus dès ${PRICE_SHARED_CHF_FR}/mois, avec piscine, sauna et salle de sport.`,
    },
    {
      q: "Combien coûte une chambre en coliving à Genève ?",
      a: `Chez La Villa Coliving, le loyer tout inclus démarre à ${PRICE_SHARED_CHF_FR}/mois : chambre meublée de ${STATS.roomSizeMin} à ${STATS.roomSizeMax} m², toutes les charges, internet fibre jusqu'à 8 Gb/s, ménage des parties communes trois fois par semaine, piscine, sauna, salle de sport, cours de yoga et événements. Un seul paiement par mois, sans frais cachés.`,
    },
    {
      q: "Y a-t-il des frais de dossier ou d'agence ?",
      a: "Non, aucun. Tu ne paies ni frais de dossier, ni honoraires d'agence, ni frais de réservation : 0 € à l'entrée. Nous louons nos maisons en direct, sans intermédiaire. Le seul autre montant est la caution de deux mois de loyer hors charges, restituée après ton départ.",
    },
    {
      q: "Comment rejoindre Genève depuis les maisons ?",
      a: `Les trois maisons sont dans le Grand Genève, côté France, à Ville-la-Grand, Ambilly et Annemasse. Depuis la gare d'Annemasse, le Léman Express rejoint Genève-Eaux-Vives en ${T.trainEauxVivesMin} min, avec un train toutes les 10 minutes en heure de pointe. Porte-à-porte jusqu'à Genève-Eaux-Vives : ${T.byHouse.lavilla.eauxVivesDoorToDoorMin} min depuis La Villa, ${T.byHouse.leloft.eauxVivesDoorToDoorMin} depuis Le Loft, ${T.byHouse.lelodge.eauxVivesDoorToDoorMin} depuis Le Lodge, et ${T.centreDoorToDoorMin} min jusqu'au centre.`,
    },
    {
      q: "Comment se passe la candidature ?",
      a: `Tu remplis le formulaire de candidature en ${STATS.applyMinutes} minutes, et on te répond sous ${STATS.responseHours} h. Ensuite : un échange pour faire connaissance, une visite de la maison, et si tout est aligné et qu'une chambre est disponible, tu peux emménager en 72 h dès ton premier contact. Pas encore de fiche de salaire suisse ? Le dossier tient en trois pièces : contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de ${STATS.depositMonths} mois de loyer hors charges ; ${GUARANTOR_SENTENCE.fr}. Sans engagement et sans frais de dossier — la durée de séjour moyenne chez nous est de 13 mois (9 mois hors longs séjours).`,
    },
  ],
  en: [
    {
      q: "What is coliving at La Villa?",
      a: "Coliving is a housing model where each resident has their own private furnished room in a shared house, with all services bundled into a single rent: utilities, fibre internet, cleaning, amenities and community life. At La Villa Coliving, this takes the form of three houses of 7 to 12 residents near Geneva, with a pool, sauna and gym.",
    },
    {
      q: "Is there coliving near Geneva?",
      a: `Yes. La Villa Coliving runs three coliving houses on the French side, ${STATS_DISPLAY.en.distance}: La Villa in Ville-la-Grand, Le Loft in Ambilly and Le Lodge in Annemasse. Each offers furnished rooms of ${STATS.roomSizeMin} to ${STATS.roomSizeMax} m², all inclusive from ${PRICE_SHARED_CHF_EN}/month, with a pool, sauna and gym.`,
    },
    {
      q: "How much does a coliving room near Geneva cost?",
      a: `At La Villa Coliving, all-inclusive rent starts at ${PRICE_SHARED_CHF_EN}/month: a furnished room of ${STATS.roomSizeMin} to ${STATS.roomSizeMax} m², all utilities, fibre internet up to 8 Gb/s, cleaning of common areas three times a week, pool, sauna, gym, yoga classes and events. One single monthly payment, no hidden costs.`,
    },
    {
      q: "Are there application or agency fees?",
      a: "No, none. You pay no application fee, no agency commission and no booking fee: €0 to move in. We rent our houses directly, with no middleman. The only other amount is the deposit of two months' rent excluding charges, returned after you leave.",
    },
    {
      q: "How do you get to Geneva from the houses?",
      a: `All three houses are in Greater Geneva, on the French side, in Ville-la-Grand, Ambilly and Annemasse. From Annemasse station, the Léman Express reaches Geneva Eaux-Vives in ${T.trainEauxVivesMin} minutes, with a train every 10 minutes at peak times. Door to door to Geneva Eaux-Vives: ${T.byHouse.lavilla.eauxVivesDoorToDoorMin} minutes from La Villa, ${T.byHouse.leloft.eauxVivesDoorToDoorMin} from Le Loft, ${T.byHouse.lelodge.eauxVivesDoorToDoorMin} from Le Lodge, and ${T.centreDoorToDoorMin} minutes to the city centre.`,
    },
    {
      q: "How does the application work?",
      a: `You fill in the application form in ${STATS.applyMinutes} minutes, and we reply within ${STATS.responseHours} h. Then: a chat to get to know each other, a house visit, and if everything lines up and a room is available, you can move in within 72 h of your first contact. No Swiss payslip yet? The file comes down to three items: a signed employment contract or job offer, an ID, and a deposit of ${STATS.depositMonths} months' rent excluding bills; ${GUARANTOR_SENTENCE.en}. No commitment and no application fees — the average stay with us is 13 months (9 months excluding long stays).`,
    },
  ],
};
