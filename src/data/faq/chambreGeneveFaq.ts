import type { QAPair } from "@/lib/structuredData";
import { pickSituations } from "@/data/faq/situationsFaq";
import { STATS, PRICE_CHF_FR, PRICE_CHF_EN, PRICE_SHARED_CHF_FR, PRICE_SHARED_CHF_EN } from "@/data/stats";

// FAQ de /chambre-a-louer-geneve — 5 questions du Lot 6 SEO funnel (04/09/2026, sorties de la page le 07/09
// pour partager la source avec le Lot C2) + 4 « situations réelles ». Tutoiement, prix depuis la source unique,
// aucun concurrent nommé, jamais « moins cher que Genève ».
export const chambreGeneveFaq: { fr: QAPair[]; en: QAPair[] } = {
  fr: [
    {
      q: "Quel est le loyer moyen d'une chambre à louer à Genève ?",
      a: "À Genève même, d'après les annonces relevées en 2026, une chambre en colocation ou chez l'habitant se loue le plus souvent entre 1 000 et 1 500 CHF par mois, charges, internet et ménage souvent en plus (relevé de notre Observatoire du logement frontalier, juin 2026), et l'offre est rare (taux de vacance sous 1 %, OCSTAT). C'est pour ça que beaucoup cherchent leur chambre côté France, à 20 minutes du centre : le même budget donne une chambre meublée dans une maison entière.",
    },
    {
      q: `Combien coûte une chambre meublée près de Genève chez La Villa Coliving ?`,
      a: `Dès ${PRICE_SHARED_CHF_FR}/mois tout inclus pour une chambre dont la salle d'eau est partagée avec une seule autre chambre, ${PRICE_CHF_FR}/mois avec salle d'eau privative. Le montant est le coût mensuel total : loyer, charges, fibre jusqu'à 8 Gb/s, ménage des communs 3 fois par semaine, espaces communs (piscine, sauna, salle de sport selon la maison) et événements. 0 frais de dossier, 0 frais d'agence, caution de ${STATS.depositMonths} mois de loyer hors charges.`,
    },
    {
      q: "Quelles sont les conditions pour louer une chambre près de Genève ?",
      a: `Une candidature en ligne de deux minutes, puis un contrat de travail ou une promesse d'embauche et une pièce d'identité. Aucun historique locatif suisse ni garant suisse n'est demandé. Réponse sous 48 h, visite sur place ou en visio, bail meublé français à ton nom (${STATS.leaseDurationMonths} mois renouvelable, préavis d'${STATS.noticePeriodMonths} mois) signé en ligne, emménagement possible en une semaine.`,
    },
    {
      q: "Où trouver une chambre chez l'habitant près de Genève ?",
      a: "Les portails d'annonces et les groupes d'entraide en proposent, des deux côtés de la frontière, avec leurs limites : pas toujours de bail, des charges à part, un coin dans le logement de quelqu'un d'autre. Chez La Villa, ce n'est pas une chambre chez l'habitant : tu loues ta chambre avec un bail à ton nom, dans une maison partagée avec 7 à 12 colocataires qui travaillent à Genève ou dans la région, sans propriétaire sur place.",
    },
    {
      q: "Chambre chez l'habitant, sous-location ou coliving : quelle différence ?",
      a: "Chez l'habitant, tu vis chez quelqu'un, selon ses règles. En sous-location, ton droit d'occuper dépend du bail d'un autre. En coliving, tu signes un bail direct, meublé, à ton nom, avec un seul loyer tout compris, et tu partages une maison pensée pour vivre à plusieurs. Les trois existent près de Genève ; seule la dernière te donne un contrat solide et une maison entière.",
    },
    // Lot C2 (07/09/2026) : 4 des 10 « situations réelles » (P1/P6, P14, non-UE, candidature)
    ...pickSituations(["job-in-a-month", "no-swiss-payslip", "non-eu-expat", "how-to-apply"], "fr"),
  ],
  en: [
    {
      q: "What is the average rent for a room in Geneva?",
      a: "In Geneva itself, based on listings observed in 2026, a room in a shared flat or in someone's home usually rents for 1,000 to 1,500 CHF a month, often with bills, internet and cleaning on top (our cross-border housing Observatory survey, June 2026), and supply is scarce (vacancy rate below 1%, OCSTAT). That is why many people look for their room on the French side, 20 minutes from the centre: the same budget gets a furnished room in a whole house.",
    },
    {
      q: "How much is a furnished room near Geneva at La Villa Coliving?",
      a: `From ${PRICE_SHARED_CHF_EN}/month all inclusive for a room whose shower room is shared with one other room, ${PRICE_CHF_EN}/month with a private shower room. The figure is the total monthly cost: rent, bills, fibre up to 8 Gb/s, cleaning of the common areas 3 times a week, shared spaces (pool, sauna, gym depending on the house) and events. No application or agency fee, deposit of ${STATS.depositMonths} months' rent excluding charges.`,
    },
    {
      q: "What are the conditions to rent a room near Geneva?",
      a: `A two-minute online application, then an employment contract or job offer and an ID. No Swiss rental history or Swiss guarantor is required. Reply within 48 h, visit on site or by video, French furnished lease in your name (${STATS.leaseDurationMonths} months renewable, ${STATS.noticePeriodMonths}-month notice) signed online, move-in possible within a week.`,
    },
    {
      q: "Where can you find a room in someone's home near Geneva?",
      a: "Listing portals and community groups offer them on both sides of the border, with their limits: not always a lease, bills on top, a corner of someone else's home. At La Villa it is not a room in someone's home: you rent your room with a lease in your name, in a house shared with 7 to 12 flatmates who work in Geneva or nearby, with no landlord on site.",
    },
    {
      q: "Room in someone's home, sublet or coliving: what is the difference?",
      a: "In someone's home you live by their rules. In a sublet, your right to stay depends on someone else's lease. In coliving you sign a direct, furnished lease in your name, with a single all-inclusive rent, and share a house designed for living together. All three exist near Geneva; only the last one gives you a solid contract and a whole house.",
    },
    ...pickSituations(["job-in-a-month", "no-swiss-payslip", "non-eu-expat", "how-to-apply"], "en"),
  ],
};
