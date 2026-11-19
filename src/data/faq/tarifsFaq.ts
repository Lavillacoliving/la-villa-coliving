import type { QAPair } from "@/lib/structuredData";
import { STATS, STATS_SHARED_BATH, PRICE_CHF_FR, PRICE_CHF_EN, PRICE_FROM_CHF_FR, PRICE_FROM_CHF_EN, sharedBathTiersText } from "@/data/stats";
import { priceJustificationFaq } from "@/data/priceFacts";

// §2 du playbook AEO — /tarifs (page canonique prix). Tutoiement, texte verbatim.
// (Lot L2 « Emplacement et transport », 09/10/2026) Surfaces de chambres uniquement depuis STATS.roomSizeMin/Max
// (« 17 et 25 », « 17 to 25 », « 17 and 23 m² » en dur : retirés).
// (13/11/2026) Trois niveaux de prix : la question « Le prix varie-t-il… » détaille les paliers par chambre (sharedBathTiersText,
// source unique src/data/stats.ts). Chambres du palier le plus bas : numéros ET surface lus dans la source (SHARED_BATH_TIERS,
// `approxM2`, gardée contre v_public_rooms par check-entity-facts), jamais tapés. Et non plus STATS.roomSizeMin : borne des
// 29 chambres, elle ne donnait « environ 16 m² » pour les chambres 7 et 8 que par coïncidence.
const lowestTier = [...STATS_SHARED_BATH.tiers].sort((a, b) => a.chf - b.chf)[0];
const LOWEST_TIER_ROOMS = { fr: lowestTier.rooms.join(" et "), en: lowestTier.rooms.join(" and ") };
const LOWEST_TIER_SIZE = lowestTier.approxM2
  ? { fr: `, environ ${lowestTier.approxM2} m²`, en: `, at about ${lowestTier.approxM2} m²` }
  : { fr: "", en: "" };

export const tarifsFaq: { fr: QAPair[]; en: QAPair[] } = {
  fr: [
    {
      q: "Qu'est-ce qui est inclus dans le loyer chez La Villa Coliving ?",
      a: `Chez La Villa Coliving, ton loyer tout inclus dès ${PRICE_FROM_CHF_FR}/mois couvre la chambre meublée de ${STATS.roomSizeMin} à ${STATS.roomSizeMax} m², toutes les charges, l'internet fibre jusqu'à 8 Gb/s, le ménage des parties communes trois fois par semaine, l'accès à la piscine, au sauna et à la salle de sport, les cours de yoga et fitness et les événements. Un seul paiement par mois, sans frais de dossier, sans frais cachés.`,
    },
    // (Lot L4, D8 — 10/10/2026) FAQ A.3 de justification du prix : texte unique src/data/priceFacts.ts (aussi /faq, /le-coliving,
    // /colocation-geneve, /chambre-a-louer-geneve ; /chambres-disponibles via tarifsFaq.slice(0, 2)).
    priceJustificationFaq("fr"),
    {
      q: "Y a-t-il des frais de dossier ou d'agence chez La Villa Coliving ?",
      a: "Non, aucun. Chez La Villa Coliving, tu ne paies ni frais de dossier, ni honoraires d'agence, ni frais de réservation, ni frais d'état des lieux : 0 € à l'entrée. Sur le marché du coliving, ces frais vont souvent de 200 à 700 €. Nous louons nos maisons en direct, sans intermédiaire : il n'y a donc rien à facturer pour entrer.",
    },
    {
      q: "Quel est le montant de la caution chez La Villa Coliving ?",
      a: "La caution chez La Villa Coliving correspond à deux mois de loyer hors charges, conformément à la réglementation. Elle peut se payer en une fois, en 2 fois (la moitié à la signature, l'autre avec ton 2ᵉ loyer) ou en 3 fois (un tiers à la signature, puis un tiers avec tes 2ᵉ et 3ᵉ loyers) ; le nombre de versements est fixé par La Villa au moment de valider ton dossier, en fonction de ta situation financière. Elle t'est restituée sous 30 jours après ton départ si aucune dégradation n'est constatée, sinon sous 2 mois, déduction faite des éventuels dégâts. Aucun frais d'entrée non remboursable ne s'y ajoute : tu règles ton premier loyer et cette caution, c'est tout.",
    },
    {
      q: "Le prix varie-t-il selon la maison ou la chambre ?",
      a: `Oui, il existe trois niveaux. La plupart des chambres (${STATS.totalRooms - STATS_SHARED_BATH.rooms} sur ${STATS.totalRooms}) disposent d'une salle d'eau privative : ${PRICE_CHF_FR}/mois tout inclus. Les ${STATS_SHARED_BATH.rooms} chambres de la maison La Villa qui partagent une salle d'eau entre 2 chambres — son entretien est assuré par notre équipe de ménage — sont à ${sharedBathTiersText("fr", { perMonth: true })} : les chambres ${LOWEST_TIER_ROOMS.fr} sont les plus petites des quatre${LOWEST_TIER_SIZE.fr}. Toutes les chambres font de ${STATS.roomSizeMin} à ${STATS.roomSizeMax} m² et donnent accès aux mêmes équipements — piscine, sauna et salle de sport — dans les trois maisons.`,
    },
    {
      q: "Combien coûte une colocation tout inclus près de Genève ?",
      a: `Une colocation tout inclus près de Genève comme La Villa Coliving démarre à ${PRICE_FROM_CHF_FR}/mois : charges, internet fibre, ménage et accès piscine, sauna et salle de sport compris. À titre de comparaison, un studio basique à Genève dépasse souvent 2\u00a0000 CHF une fois toutes les charges ajoutées. Un seul paiement, sans frais d'entrée.`,
    },
    {
      q: "Y a-t-il des frais cachés ou des suppléments en cours de séjour ?",
      a: `Non. Chez La Villa Coliving, le prix affiché est le prix payé : ton loyer mensuel dès ${PRICE_FROM_CHF_FR} couvre l'ensemble des services inclus. Pas d'option payante à ajouter, pas de charges de régularisation, pas de frais cachés. Le seul autre montant est la caution, qui t'est restituée à la fin.`,
    },
    {
      q: "Comment La Villa se compare-t-elle à la location d'un studio à Genève ?",
      a: `À Genève, un studio basique additionne loyer, électricité, chauffage, eau, internet, ménage et abonnements pour dépasser souvent 2\u00a0000 CHF par mois. Chez La Villa Coliving, tout cela est réuni dans un seul loyer dès ${PRICE_FROM_CHF_FR} — avec en plus piscine, sauna, salle de sport et une communauté. Et 0 € de frais d'entrée.`,
    },
    {
      q: "Comment se règle le loyer chez La Villa Coliving ?",
      a: "Le loyer chez La Villa Coliving se règle par virement, une fois par mois. Ce paiement unique couvre l'ensemble des services inclus — charges, internet, ménage, piscine, sauna, salle de sport — sans frais d'entrée ni facture surprise en cours de séjour.",
    },
  ],
  en: [
    {
      q: "What's included in the rent at La Villa Coliving?",
      a: `At La Villa Coliving, your all-inclusive rent from ${PRICE_FROM_CHF_EN}/month covers a furnished room of ${STATS.roomSizeMin} to ${STATS.roomSizeMax} m², all utilities, fibre internet up to 8 Gb/s, cleaning of common areas three times a week, access to the pool, sauna and gym, yoga and fitness classes and community events. A single monthly payment, with no application fees and no hidden costs.`,
    },
    priceJustificationFaq("en"),
    {
      q: "Are there application or agency fees at La Villa Coliving?",
      a: "No, none. At La Villa Coliving you pay no application fee, no agency commission, no booking fee and no check-in inventory fee: €0 to move in. On the coliving market, these fees often range from €200 to €700. We rent our houses directly, with no middleman, so there is nothing to charge you to move in.",
    },
    {
      q: "How much is the security deposit at La Villa Coliving?",
      a: "The deposit at La Villa Coliving is two months' rent excluding charges, in line with regulations. It can be paid in one go, in 2 instalments (half at signing, half with your 2nd month's rent) or in 3 (a third at signing, then a third with your 2nd and 3rd month's rent); La Villa sets the number of instalments when your application is approved, based on your financial situation. It is returned within 30 days of your departure if there is no damage, otherwise within 2 months, less any damage. No non-refundable move-in fee is added: you pay your first month's rent and this deposit, that's all.",
    },
    {
      q: "Does the price vary by house or room?",
      a: `Yes, there are three levels. Most rooms (${STATS.totalRooms - STATS_SHARED_BATH.rooms} of ${STATS.totalRooms}) have a private bathroom: ${PRICE_CHF_EN}/month all inclusive. The ${STATS_SHARED_BATH.rooms} rooms at our La Villa house that share a shower room between 2 rooms — it is cleaned by our housekeeping team — are ${sharedBathTiersText("en", { perMonth: true })}: rooms ${LOWEST_TIER_ROOMS.en} are the smallest of the four${LOWEST_TIER_SIZE.en}. All rooms are ${STATS.roomSizeMin} to ${STATS.roomSizeMax} m² and give access to the same amenities — pool, sauna and gym — across the three houses.`,
    },
    {
      q: "How much does all-inclusive shared housing near Geneva cost?",
      a: `All-inclusive shared housing near Geneva like La Villa Coliving starts at ${PRICE_FROM_CHF_EN}/month: utilities, fibre internet, cleaning and access to the pool, sauna and gym included. For comparison, a basic studio in Geneva often exceeds CHF 2,000 once all charges are added. A single payment, with no move-in fees.`,
    },
    {
      q: "Are there hidden fees or extra charges during the stay?",
      a: `No. At La Villa Coliving the displayed price is the price you pay: your monthly rent from ${PRICE_FROM_CHF_EN} covers all included services. No paid add-ons, no year-end charge adjustments, no hidden fees. The only other amount is the deposit, which is returned to you at the end.`,
    },
    {
      q: "How does La Villa compare to renting a studio in Geneva?",
      a: `In Geneva, a basic studio adds up rent, electricity, heating, water, internet, cleaning and subscriptions to often exceed CHF 2,000 per month. At La Villa Coliving all of that is bundled into a single rent from ${PRICE_FROM_CHF_EN} — plus a pool, sauna, gym and a community. And €0 in move-in fees.`,
    },
    {
      q: "How is the rent paid at La Villa Coliving?",
      a: "Rent at La Villa Coliving is paid by bank transfer, once a month. This single payment covers all included services — utilities, internet, cleaning, pool, sauna, gym — with no move-in fees and no surprise bills during your stay.",
    },
  ],
};
