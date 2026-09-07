import type { QAPair } from "@/lib/structuredData";
import { STATS, PRICE_CHF_FR, PRICE_CHF_EN } from "@/data/stats";
import { pickSituations } from "@/data/faq/situationsFaq";

// FAQ de /chambre-a-louer-annemasse (inventaire du Lodge) — les 6 questions du Lot 6 SEO funnel, sorties de
// la page le 07/09/2026 (Lot C2) : FR **et** EN, réponses dans le DOM via FaqSection, durée alignée sur D5
// (plus de « baux plus courts au cas par cas »). + 4 « situations réelles » (P10, durée, P17, candidature).
export const chambreAnnemasseFaq: { fr: QAPair[]; en: QAPair[] } = {
  fr: [
    {
      q: "Quel est le prix d'une chambre meublée à Annemasse chez La Villa Coliving ?",
      a: `Les 12 chambres du Lodge, à Annemasse Romagny, sont à ${PRICE_CHF_FR}/mois tout inclus : loyer, charges, fibre, ménage des communs ${STATS.cleaningPerWeek} fois par semaine, sauna, salle de sport, piscine et jardin, événements. Chaque chambre a sa salle d'eau privative. Pas de frais d'agence, pas de frais de dossier, caution de ${STATS.depositMonths} mois de loyer hors charges, restituée après l'état des lieux.`,
    },
    {
      q: "Les chambres à louer à Annemasse sont-elles vraiment meublées ?",
      a: "Oui, intégralement : lit double avec sa parure, bureau, placard sur mesure, salle d'eau privative. Les espaces communs du Lodge (cuisine, salon, terrasse, jardin, sauna, salle de sport) sont aussi entièrement équipés. Tu n'as qu'à arriver avec tes valises.",
    },
    {
      q: "Quelle différence entre un studio à Annemasse et une chambre au Lodge ?",
      a: `Un studio à Annemasse se loue en moyenne 700 à 950 € par mois charges non comprises : eau, électricité, internet, ménage et mobilier s'ajoutent. Au Lodge, ${PRICE_CHF_FR} tout inclus, avec des espaces communs pensés pour vivre et 11 colocataires qui travaillent à Genève ou dans la région. Compare le coût total, pas le loyer affiché.`,
    },
    {
      q: "Pour combien de temps peut-on louer une chambre à Annemasse ?",
      a: `Le bail meublé est de ${STATS.leaseDurationMonths} mois renouvelable, avec un engagement minimum de ${STATS.leaseMinimumMonths} mois, puis un préavis d'${STATS.noticePeriodMonths} mois. Idéal pour s'installer durablement comme frontalier ou pour une période d'essai à Genève : passé les trois premiers mois, tu pars quand tu veux.`,
    },
    {
      q: "Quelles sont les disponibilités actuelles au Lodge ?",
      a: "La liste ci-dessus est lue en temps réel sur la même source que nos réservations : chaque chambre libre ou datée y figure avec sa date. S'il n'y a rien à ta date, rejoins la liste d'attente du Lodge, ou regarde les chambres de nos deux autres maisons à Ville-la-Grand et Ambilly sur la page des chambres à louer près de Genève.",
    },
    {
      q: "Comment se passe la visite avant de signer ?",
      a: `Après ta candidature, on organise une visite sur place ou en visio du Lodge et de la chambre disponible : tour de la maison, présentation des espaces communs et des services, et un échange avec un résident actuel. Réponse sous ${STATS.responseHours} h, bail signé en ligne.`,
    },
    ...pickSituations(["annemasse-safe", "minimum-duration", "studio-vs-room", "how-to-apply"], "fr"),
  ],
  en: [
    {
      q: "How much is a furnished room in Annemasse at La Villa Coliving?",
      a: `The Lodge's 12 rooms, in Annemasse Romagny, cost ${PRICE_CHF_EN}/month all inclusive: rent, bills, fibre, cleaning of the common areas ${STATS.cleaningPerWeek} times a week, sauna, gym, pool and garden, events. Every room has its own private shower room. No agency fee, no application fee, deposit of ${STATS.depositMonths} months' rent excluding charges, returned after the check-out inspection.`,
    },
    {
      q: "Are the rooms for rent in Annemasse really furnished?",
      a: "Yes, fully: double bed with linen, desk, made-to-measure wardrobe, private shower room. The Lodge's common areas (kitchen, living room, terrace, garden, sauna, gym) are fully equipped too. You just arrive with your suitcases.",
    },
    {
      q: "What is the difference between a studio in Annemasse and a room at the Lodge?",
      a: `A studio in Annemasse rents on average for 700 to 950 € a month excluding charges: water, electricity, internet, cleaning and furniture come on top. At the Lodge, ${PRICE_CHF_EN} all inclusive, with common areas designed for living and 11 flatmates who work in Geneva or in the area. Compare the total cost, not the advertised rent.`,
    },
    {
      q: "How long can you rent a room in Annemasse for?",
      a: `The furnished lease runs ${STATS.leaseDurationMonths} months, renewable, with a ${STATS.leaseMinimumMonths}-month minimum commitment and then ${STATS.noticePeriodMonths} month's notice. Ideal to settle in for good as a cross-border worker or for a probation period in Geneva: after the first three months you leave whenever you want.`,
    },
    {
      q: "What is the current availability at the Lodge?",
      a: "The list above is read in real time from the same source as our bookings: every free or dated room appears with its date. If nothing matches your date, join the Lodge's waiting list, or look at the rooms of our two other houses in Ville-la-Grand and Ambilly on the page of rooms for rent near Geneva.",
    },
    {
      q: "How does the visit work before signing?",
      a: `After your application, we organise a visit on site or by video of the Lodge and the available room: a tour of the house, a presentation of the common areas and services, and a chat with a current resident. Reply within ${STATS.responseHours} h, lease signed online.`,
    },
    ...pickSituations(["annemasse-safe", "minimum-duration", "studio-vs-room", "how-to-apply"], "en"),
  ],
};
