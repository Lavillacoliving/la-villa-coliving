import type { QAPair } from "@/lib/structuredData";
import { STATS, STATS_SHARED_BATH, PRICE_CHF_FR, PRICE_CHF_EN, PRICE_FROM_CHF_FR, PRICE_FROM_CHF_EN, MARKET_ROOM_EUR, sharedBathTiersText, thousands, HOUSES_FROM, CONTRACT_EUR } from "@/data/stats";
import { priceJustificationFaq, timesPerWeek } from "@/data/priceFacts";
import { APPART } from "@/data/appart";
import { appartHousesFaq } from "@/data/appartHousesFaq";
import { inclusPhrases } from "@/data/inclus";
import {
  BUDGET_FRANCE,
  BUDGET_GAPS,
  BUDGET_GENEVA,
  BUDGET_REFERENCE_ROOM_CHF,
  BUDGET_SURVEY,
  HOUSES_AVERAGE_M2_PER_RESIDENT,
  budgetNum,
} from "@/data/budgetReel";

// ── Deux listes dans ce fichier (24/11/2026, brief « budget réel » du 23/11/2026, décision G1 de Jérôme) ─────────────────────
//  - `tarifsPageFaq` (en bas) : les onze questions du bloc 8 de /tarifs et /en/tarifs, et leur FAQPage. C'est LA FAQ de la page.
//  - `tarifsFaq` (ci-dessous, inchangée) : l'ancienne FAQ de /tarifs. Elle n'est plus rendue sur /tarifs ; seule
//    /chambres-disponibles en lit encore les deux premières questions (`tarifsFaq[L].slice(0, 2)` : « Qu'est-ce qui est inclus… »
//    et la FAQ A.3 « La Villa Coliving est-elle chère ? », que G1 garde partout sauf sur /tarifs). `appartPriceFaq` (inchangée)
//    reste lue par /faq (src/data/faqData.ts).
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

// ── (L'Appart, Lot 4, étape E5 — textes du 13/11/2026, « à confirmer ») ─────────────────────────────────────────────────────
// Les réponses de prix nomment les deux gammes, chacune dans sa phrase : jamais un prix de L'Appart dans la phrase de la piscine
// (règle V2). Les paliers de L'Appart (730 et 990 CHF) s'écrivent dans les réponses qui répondent à une question de PRIX (décision
// n° 24 de la critique, à confirmer). Tous les nombres viennent de APPART (src/data/appart.ts) et de stats.ts, jamais tapés.
const A = APPART;
const AP = APPART.price;
const STD = APPART.rooms.standard;
const SUITE = APPART.rooms.suite;
const WORD: Record<"fr" | "en", Record<number, string>> = { fr: { 2: "deux", 3: "trois", 4: "quatre" }, en: { 2: "two", 3: "three", 4: "four" } };
const word = (n: number, lang: "fr" | "en"): string => WORD[lang][n] ?? String(n);
const ONE_OR_TWO = { fr: "une ou deux personnes", en: "one or two people" };
/** Seuil de la question « moins de 800 € » (la requête des assistants, pas un fait du site) : il doit rester au-dessus du loyer. */
export const BUDGET_QUESTION_EUR = 800;

/** (L'Appart, E5) Deux questions nouvelles, partagées par /tarifs et /faq (src/data/faqData.ts) : L'Appart ouvre (intention budget). */
export const appartPriceFaq: { fr: QAPair[]; en: QAPair[] } = {
  fr: [
    {
      q: "Quelle est la chambre la moins chère chez La Villa Coliving ?",
      a: `Une chambre de ${STD.surfaceM2} m² à ${A.name}, la colocation de La Villa Coliving à ${A.commune}, dans le quartier de la gare : ${AP.room.fr.chf} par mois, charges, fibre, streaming et ménage des communs compris. En euros : ${AP.room.fr.eur}. Dans les maisons de coliving, avec piscine, sauna et salle de sport, les chambres démarrent à ${PRICE_FROM_CHF_FR} par mois.`,
    },
    {
      q: `Existe-t-il une colocation à moins de ${BUDGET_QUESTION_EUR} € par mois près de Genève ?`,
      a: `Oui, côté France. Sur les plateformes entre particuliers, une chambre en colocation se loue ${MARKET_ROOM_EUR.min} à ${thousands(MARKET_ROOM_EUR.max, "\u00a0")} € selon la commune, charges souvent en plus. Chez La Villa Coliving, les ${word(STD.numbers.length, "fr")} chambres de ${STD.surfaceM2} m² de ${A.name}, à ${A.commune}, dans le quartier de la gare, sont à ${AP.room.fr.chf} par mois, charges, fibre, streaming et ménage des communs compris. En euros, le loyer du bail est de ${AP.room.fr.eur}. Genève-Eaux-Vives est à ${A.transit.eauxVivesDoorToDoorMin} min porte-à-porte en Léman Express.`,
    },
  ],
  en: [
    {
      q: "What is the cheapest room at La Villa Coliving?",
      a: `A ${STD.surfaceM2} m² room at ${A.name}, La Villa Coliving's flatshare in ${A.commune}, near the station: ${AP.room.en.chf} a month, with bills, fibre, streaming and cleaning of the shared areas included. In euros: ${AP.room.en.eur}. In the coliving houses, with a pool, sauna and gym, rooms start at ${PRICE_FROM_CHF_EN} a month.`,
    },
    {
      q: `Is there a flatshare under €${BUDGET_QUESTION_EUR} a month near Geneva?`,
      a: `Yes, on the French side. On peer-to-peer platforms, a room in a flatshare goes for €${MARKET_ROOM_EUR.min} to €${thousands(MARKET_ROOM_EUR.max, ",")} depending on the town, often with bills on top. At La Villa Coliving, the ${word(STD.numbers.length, "en")} ${STD.surfaceM2} m² rooms at ${A.name}, in ${A.commune}, near the station, are ${AP.room.en.chf} a month, with bills, fibre, streaming and cleaning of the shared areas included. In euros, the rent on the lease is ${AP.room.en.eur}. Geneva Eaux-Vives is ${A.transit.eauxVivesDoorToDoorMin} minutes door to door by Léman Express.`,
    },
  ],
};

export const tarifsFaq: { fr: QAPair[]; en: QAPair[] } = {
  fr: [
    {
      q: "Qu'est-ce qui est inclus dans le loyer chez La Villa Coliving ?",
      // (L'Appart, E5) Les deux gammes : sous la liste des chambres disponibles, L'Appart a ses cartes — la piscine n'y est pas comprise.
      a: `Dans les maisons de La Villa Coliving, ton loyer tout inclus dès ${PRICE_FROM_CHF_FR}/mois couvre la chambre meublée de ${STATS.roomSizeMin} à ${STATS.roomSizeMax} m², toutes les charges, la ${inclusPhrases("fr").fibreSpeed}, le parking sur place, le ménage des parties communes ${timesPerWeek("fr")}, l'accès à la piscine, au sauna et à la salle de sport, les cours de yoga et fitness et les événements. À ${A.name}, notre colocation à ${A.commune}, le loyer dès ${AP.from.fr.chf}/mois couvre la chambre meublée, les charges, la fibre, le streaming et le ménage des parties communes une fois par semaine ; le linge de lit et les produits d'entretien ne sont pas compris. Un seul paiement par mois, sans frais de dossier, sans frais cachés.`,
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
      a: `Oui. Dans les maisons, il existe trois niveaux. La plupart des chambres (${STATS.totalRooms - STATS_SHARED_BATH.rooms} sur ${STATS.totalRooms}) disposent d'une salle d'eau privative : ${PRICE_CHF_FR}/mois tout inclus. Les ${STATS_SHARED_BATH.rooms} chambres de la maison La Villa qui partagent une salle d'eau entre 2 chambres — son entretien est assuré par notre équipe de ménage — sont à ${sharedBathTiersText("fr", { perMonth: true })} : les chambres ${LOWEST_TIER_ROOMS.fr} sont les plus petites des quatre${LOWEST_TIER_SIZE.fr}. Toutes les chambres des maisons font de ${STATS.roomSizeMin} à ${STATS.roomSizeMax} m² et donnent accès aux mêmes équipements — piscine, sauna et salle de sport. À ${A.name}, notre colocation à ${A.commune}, les ${word(STD.numbers.length, "fr")} chambres de ${STD.surfaceM2} m² sont à ${AP.room.fr.chf}/mois et la suite de ${SUITE.surfaceM2} m², pour ${ONE_OR_TWO.fr}, à ${AP.suite.fr.chf}/mois.`,
    },
    {
      q: "Combien coûte une colocation tout inclus près de Genève ?",
      a: `Chez La Villa Coliving, une chambre en colocation à ${A.name}, à ${A.commune}, démarre à ${AP.from.fr.chf}/mois, charges, fibre, streaming et ménage des communs compris. Dans les maisons de coliving, une chambre démarre à ${PRICE_FROM_CHF_FR}/mois : charges, internet fibre, ménage et accès piscine, sauna et salle de sport compris. À titre de comparaison, un studio basique à Genève dépasse souvent 2\u00a0000 CHF une fois toutes les charges ajoutées. Un seul paiement, sans frais d'entrée.`,
    },
    // (L'Appart, E5) Deux questions nouvelles d'intention budget (aussi sur /faq).
    ...appartPriceFaq.fr,
    // (14/11/2026, CB-4) Les questions 3 (« L'Appart a-t-il une piscine ? ») et 4 (différence avec les maisons) de /lappart, au
    // caractère près : texte unique src/data/appartHousesFaq.ts (aussi sur /faq), jamais un prix de L'Appart à côté de la piscine.
    ...appartHousesFaq("fr").map(({ q, a }) => ({ q, a })),
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
      a: `In La Villa Coliving's houses, your all-inclusive rent from ${PRICE_FROM_CHF_EN}/month covers a furnished room of ${STATS.roomSizeMin} to ${STATS.roomSizeMax} m², all utilities, ${inclusPhrases("en").fibreSpeed}, on-site parking, cleaning of common areas ${timesPerWeek("en")}, access to the pool, sauna and gym, yoga and fitness classes and community events. At ${A.name}, our flatshare in ${A.commune}, the rent from ${AP.from.en.chf}/month covers the furnished room, bills, fibre, streaming and cleaning of the shared areas once a week; bed linen and cleaning products are not included. A single monthly payment, with no application fees and no hidden costs.`,
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
      a: `Yes. In the houses, there are three levels. Most rooms (${STATS.totalRooms - STATS_SHARED_BATH.rooms} of ${STATS.totalRooms}) have a private bathroom: ${PRICE_CHF_EN}/month all inclusive. The ${STATS_SHARED_BATH.rooms} rooms at our La Villa house that share a shower room between 2 rooms — it is cleaned by our housekeeping team — are ${sharedBathTiersText("en", { perMonth: true })}: rooms ${LOWEST_TIER_ROOMS.en} are the smallest of the four${LOWEST_TIER_SIZE.en}. All rooms in the houses are ${STATS.roomSizeMin} to ${STATS.roomSizeMax} m² and give access to the same amenities — pool, sauna and gym. At ${A.name}, our flatshare in ${A.commune}, the ${word(STD.numbers.length, "en")} ${STD.surfaceM2} m² rooms are ${AP.room.en.chf}/month and the ${SUITE.surfaceM2} m² suite, for ${ONE_OR_TWO.en}, ${AP.suite.en.chf}/month.`,
    },
    {
      q: "How much does all-inclusive shared housing near Geneva cost?",
      a: `At La Villa Coliving, a room in the flatshare at ${A.name}, in ${A.commune}, starts at ${AP.from.en.chf}/month, with bills, fibre, streaming and cleaning of the shared areas included. In the coliving houses, a room starts at ${PRICE_FROM_CHF_EN}/month: utilities, fibre internet, cleaning and access to the pool, sauna and gym included. For comparison, a basic studio in Geneva often exceeds CHF 2,000 once all charges are added. A single payment, with no move-in fees.`,
    },
    ...appartPriceFaq.en,
    ...appartHousesFaq("en").map(({ q, a }) => ({ q, a })),
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

// ── (24/11/2026) Bloc 8 de /tarifs : les onze questions du « budget réel » ──────────────────────────────────────────────────────
// Brief « Page /tarifs et encadré « l'essentiel » : le budget réel » du 23/11/2026, annexes A et B (bloc 8), textes validés par
// Jérôme le 23/11/2026 ; décisions D11 (onze questions, « budget de 1 000 à 1 100 CHF », L'Appart « à partir du 1er février
// 2027 ») et G1 (la FAQ A.3 n'est plus sur /tarifs). Les réponses se posent MOT POUR MOT : chacune garde son sujet (« La Villa
// Coliving »), son chiffre, son unité et sa date — une IA cite souvent la réponse seule. Le FAQPage de /tarifs est construit à
// partir de CE tableau (FaqSection emitSchema) : mêmes mots, même nombre que les questions visibles, en français sur /tarifs et
// en anglais sur /en/tarifs. Chiffres : relevé du 23/11/2026 (src/data/budgetReel.ts), prix et chambres (src/data/stats.ts),
// L'Appart (src/data/appart.ts) ; littéraux de l'annexe : le budget de la question 3 (ci-dessous), « 30 jours » et « deux mois »
// de la restitution de la caution, « trois pièces » du dossier. Jamais l'offre en cours ici (absente du FAQPage, brief § 3).

/** Budget de la question 3 : la requête des prospects (« un logement à 1 000 ou 1 100 CHF », § 1 du brief), pas un fait du site. */
export const BUDGET_QUESTION_CHF = { min: 1000, max: 1100 } as const;

type FaqLang = "fr" | "en";
const FAQ_WORDS: Record<FaqLang, Record<number, string>> = {
  fr: { 1: "un", 2: "deux", 3: "trois" },
  en: { 1: "one", 2: "two", 3: "three" },
};
const inWords = (n: number, lang: FaqLang): string => FAQ_WORDS[lang][n] ?? String(n);
const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

function budgetFaq(lang: FaqLang): QAPair[] {
  const n = (x: number) => budgetNum(x, lang);
  const G = BUDGET_GENEVA, FR = BUDGET_FRANCE.managedFlatshare, GAP = BUDGET_GAPS, S = BUDGET_SURVEY;
  const from = HOUSES_FROM.chf, std = STATS.priceChf, ref = BUDGET_REFERENCE_ROOM_CHF;
  const privateRooms = STATS.totalRooms - STATS_SHARED_BATH.rooms;
  const A = APPART;
  if (lang === "en") {
    return [
      {
        q: "How much does a room at La Villa Coliving cost?",
        a: `CHF ${n(from)} to ${n(std)} a month, all-inclusive, depending on the room (€${n(HOUSES_FROM.eur)} to €${n(CONTRACT_EUR.standard)} on the lease). ${privateRooms} rooms out of ${STATS.totalRooms} have a private bathroom and cost CHF ${n(std)}.`,
      },
      {
        q: "What is included in the price at La Villa Coliving?",
        a: `Utilities (water, electricity, heating), fibre, parking, cleaning of the shared areas ${timesPerWeek("en")}, the laundry room, everyday supplies, streaming on the shared screen, and access to the house's pool, sauna and gym. Only your home insurance comes on top.`,
      },
      {
        q: `My rent budget is CHF ${n(BUDGET_QUESTION_CHF.min)} to ${n(BUDGET_QUESTION_CHF.max)}: can I afford La Villa Coliving?`,
        a: `A CHF ${n(G.privateRoom.median)} rent in Geneva comes to CHF ${n(G.privateRoom.withoutCarMin)}–${n(G.privateRoom.withoutCarMax)} a month once running costs are added, and CHF ${n(G.privateRoom.withCarMin)}–${n(G.privateRoom.withCarMax)} with a parking space (${S.monthLabel.en} survey). At La Villa Coliving, a room costs CHF ${n(from)} to ${n(std)} all-inclusive, parking included. With a car, it is the same budget. Without a car, a room at CHF ${n(ref)} comes to CHF ${n(GAP.genevaPrivateWithoutCarMin)}–${n(GAP.genevaPrivateWithoutCarMax)} more a month, for more space and the house's facilities.`,
      },
      {
        q: "Is La Villa Coliving more expensive than a flatshare?",
        a: `It depends on the flatshare. In Geneva, a room in a managed flatshare is listed at a median of CHF ${n(G.managedFlatshare.median)} a month: La Villa Coliving costs less. On the French side, a managed flatshare comes to about CHF ${n(FR.withCar)} a month with a car: the gap is about CHF ${n(GAP.franceManagedWithCar)}. It pays for ${HOUSES_AVERAGE_M2_PER_RESIDENT} m² per person instead of ${FR.perPersonM2}, rooms of ${STATS.roomSizeMin} to ${STATS.roomSizeMax} m², the pool, the sauna, the gym and cleaning of the shared areas ${timesPerWeek("en")}.`,
      },
      {
        q: "How does La Villa Coliving compare with a studio in Geneva?",
        a: `A furnished studio in Geneva is listed at a median of CHF ${n(G.furnishedStudio.median)} a month (${S.monthLabel.en}). With charges, electricity, internet and running costs, it comes to about CHF ${n(G.furnishedStudio.withoutCar)}, and CHF ${n(G.furnishedStudio.withCar)} with a parking space. A room at La Villa Coliving costs CHF ${n(from)} to ${n(std)}, all-inclusive.`,
      },
      {
        q: "Are there any application or agency fees at La Villa Coliving?",
        a: "No, none: no application fee, agency fee, booking fee or inventory fee. We let our houses directly.",
      },
      {
        q: "How much is the deposit?",
        a: `${capitalize(inWords(STATS.depositMonths, "en"))} months' rent excluding charges. It can be paid in one, two or three instalments; the number is set when your application is approved. It is returned within 30 days of your departure, or within two months if damage has to be deducted.`,
      },
      {
        q: "Do I need a guarantor or a Swiss payslip?",
        a: "Not as a rule. The application takes three things: a signed employment contract or job offer, ID, and the deposit. A guarantor is only requested case by case, when the contract does not cover the rent.",
      },
      {
        q: "How long am I committing for?",
        a: `The lease is for ${STATS.leaseDurationMonths} months, but you can leave at any time with ${inWords(STATS.noticePeriodMonths, "en")} month's notice. You can move in on any date.`,
      },
      {
        q: "How is the rent paid?",
        a: "By bank transfer, once a month. The lease is in euros; the CHF prices on the site are indicative.",
      },
      {
        q: "Is there a cheaper option?",
        // Deux gammes : le prix de L'Appart et « no pool, sauna or gym » dans deux phrases distinctes (règle V2, par phrase).
        a: `Yes: ${A.name}, our flatshare in ${A.commune}, from ${A.price.from.en.chf} a month. It has no pool, sauna or gym.`,
      },
    ];
  }
  return [
    {
      q: "Combien coûte une chambre à La Villa Coliving ?",
      a: `De ${n(from)} à ${n(std)} CHF par mois, tout compris, selon la chambre (de ${n(HOUSES_FROM.eur)} à ${n(CONTRACT_EUR.standard)} € au bail). ${privateRooms} chambres sur ${STATS.totalRooms} ont une salle d'eau privative et coûtent ${n(std)} CHF.`,
    },
    {
      q: "Qu'est-ce qui est compris dans le prix à La Villa Coliving ?",
      a: `Les charges (eau, électricité, chauffage), la fibre, le parking, le ménage des parties communes ${timesPerWeek("fr")}, la buanderie, les produits du quotidien, le streaming sur l'écran commun, et l'accès à la piscine, au sauna et à la salle de sport de la maison. Seule ton assurance habitation s'y ajoute.`,
    },
    {
      q: `J'ai un budget de ${n(BUDGET_QUESTION_CHF.min)} à ${n(BUDGET_QUESTION_CHF.max)} CHF pour mon loyer : La Villa Coliving est-elle dans mes moyens ?`,
      a: `Un loyer de ${n(G.privateRoom.median)} CHF à Genève revient à ${n(G.privateRoom.withoutCarMin)}–${n(G.privateRoom.withoutCarMax)} CHF par mois une fois les frais courants ajoutés, et à ${n(G.privateRoom.withCarMin)}–${n(G.privateRoom.withCarMax)} CHF avec une place de parking (relevé de ${S.monthLabel.fr}). À La Villa Coliving, une chambre coûte de ${n(from)} à ${n(std)} CHF tout compris, parking inclus. Avec une voiture, c'est le même budget. Sans voiture, une chambre à ${n(ref)} CHF revient à ${n(GAP.genevaPrivateWithoutCarMin)}–${n(GAP.genevaPrivateWithoutCarMax)} CHF de plus par mois, pour plus d'espace et les équipements de la maison.`,
    },
    {
      q: "La Villa Coliving est-elle plus chère qu'une colocation ?",
      a: `Cela dépend de la colocation. À Genève, une chambre en colocation gérée s'affiche à ${n(G.managedFlatshare.median)} CHF par mois en médiane : La Villa Coliving coûte moins. Côté France, une colocation gérée revient à environ ${n(FR.withCar)} CHF par mois avec une voiture : l'écart est d'environ ${n(GAP.franceManagedWithCar)} CHF. Il paie ${HOUSES_AVERAGE_M2_PER_RESIDENT} m² par personne au lieu de ${FR.perPersonM2}, des chambres de ${STATS.roomSizeMin} à ${STATS.roomSizeMax} m², la piscine, le sauna, la salle de sport et le ménage des parties communes ${timesPerWeek("fr")}.`,
    },
    {
      q: "Comment La Villa Coliving se compare-t-elle à un studio à Genève ?",
      a: `Un studio meublé à Genève s'affiche à ${n(G.furnishedStudio.median)} CHF par mois en médiane (${S.monthLabel.fr}). Avec les charges, l'électricité, internet et les frais courants, il revient à environ ${n(G.furnishedStudio.withoutCar)} CHF, et ${n(G.furnishedStudio.withCar)} CHF avec une place de parking. Une chambre à La Villa Coliving coûte de ${n(from)} à ${n(std)} CHF, tout compris.`,
    },
    {
      q: "Y a-t-il des frais de dossier ou d'agence à La Villa Coliving ?",
      a: "Non, aucun : ni frais de dossier, ni honoraires d'agence, ni frais de réservation, ni frais d'état des lieux. Nous louons nos maisons en direct.",
    },
    {
      q: "Quel est le montant de la caution ?",
      a: `${capitalize(inWords(STATS.depositMonths, "fr"))} mois de loyer hors charges. Elle se paie en une, deux ou trois fois ; le nombre de versements est fixé quand ton dossier est validé. Elle t'est rendue sous 30 jours après ton départ, sous deux mois s'il y a des dégâts à déduire.`,
    },
    {
      q: "Faut-il un garant ou une fiche de salaire suisse ?",
      a: "Pas d'office. Le dossier tient en trois pièces : contrat de travail signé ou promesse d'embauche, pièce d'identité, caution. Un garant n'est demandé qu'au cas par cas, quand le contrat ne couvre pas le loyer.",
    },
    {
      q: "Pour combien de temps est-ce que je m'engage ?",
      a: `Le bail est de ${STATS.leaseDurationMonths} mois, mais tu peux partir à tout moment avec ${inWords(STATS.noticePeriodMonths, "fr")} mois de préavis. Tu peux entrer à n'importe quelle date.`,
    },
    {
      q: "Comment se règle le loyer ?",
      a: "Par virement, une fois par mois. Le bail est en euros ; les prix en CHF du site sont indicatifs.",
    },
    {
      q: "Existe-t-il une formule moins chère ?",
      // Deux gammes : le prix de L'Appart et « ni piscine, ni sauna, ni salle de sport » dans deux phrases (règle V2, par phrase).
      // « à partir du 1er février 2027 » : décision D11 / F1-h de Jérôme (le jour est un littéral de l'annexe, mois = APPART.opensOn).
      a: `Oui : ${A.name}, notre colocation à ${A.commune}, dès ${A.price.from.fr.chf} par mois. Elle n'a ni piscine, ni sauna, ni salle de sport.`,
    },
  ];
}

/** Les onze questions du bloc 8 de /tarifs (FR et EN), dans l'ordre de l'annexe ; le FAQPage de la page en est construit. */
export const tarifsPageFaq: { fr: QAPair[]; en: QAPair[] } = { fr: budgetFaq("fr"), en: budgetFaq("en") };

/** Montants de L'Appart (loyers en CHF et en euros, prix par personne de la suite), BORNÉS : « 530 » ne se lit pas dans « 1 530 ». */
const APPART_AMOUNT_RE = new RegExp(
  `(?<!\\d[\\s\\u00a0\\u202f,.]?)(?:${[AP.room.chf, AP.room.eur, AP.suite.chf, AP.suite.eur, AP.suitePerPersonEur]
    .map((v) => (v < 1000 ? String(v) : `${String(v).slice(0, -3)}[\\s\\u00a0\\u202f,.]?${String(v).slice(-3)}`))
    .join("|")})(?![\\s\\u00a0\\u202f,.]?\\d)`,
);

/** Incohérences internes (vide = OK) : onze questions par langue, parité, prémisses des comparaisons, aucune offre, aucun « dès 530 ». */
export function tarifsPageFaqIssues(): string[] {
  const out: string[] = [];
  for (const lang of ["fr", "en"] as const) {
    const faq = tarifsPageFaq[lang];
    if (faq.length !== 11) out.push(`${lang} : ${faq.length} questions (attendu 11, D11)`);
    for (const { q, a } of faq) {
      if (/undefined|NaN|\{\{/.test(q + a)) out.push(`${lang} : valeur manquante — « ${q} »`);
      if (/première année|first year|rembours|money back|\bback\b/i.test(q + a)) out.push(`${lang} : l'offre en cours n'entre jamais dans la FAQ — « ${q} »`);
      if (q === priceJustificationFaq(lang).q) out.push(`${lang} : la FAQ A.3 n'est plus sur /tarifs (G1)`);
      for (const sentence of a.split(/(?<=[.!?;])\s+/)) {
        if (APPART_AMOUNT_RE.test(sentence) && /piscine|sauna|salle de sport|\bpool\b|\bgym\b/i.test(sentence)) out.push(`${lang} : prix de L'Appart et équipement des maisons dans la même phrase — « ${sentence.slice(0, 60)} »`);
      }
    }
  }
  // « La Villa Coliving coûte moins » (question 4) n'est vrai que si la médiane genevoise dépasse le prix standard des maisons.
  if (BUDGET_GENEVA.managedFlatshare.median <= STATS.priceChf) out.push("question 4 : la colocation gérée genevoise ne coûte plus davantage que La Villa Coliving — revoir « coûte moins »");
  // Question 3 : « Avec une voiture, c'est le même budget » — la fourchette « avec parking » doit couvrir les prix des maisons.
  if (BUDGET_GENEVA.privateRoom.withCarMin > HOUSES_FROM.chf || BUDGET_GENEVA.privateRoom.withCarMax < BUDGET_REFERENCE_ROOM_CHF) out.push("question 3 : « le même budget » avec une voiture n'est plus vrai");
  return out;
}
