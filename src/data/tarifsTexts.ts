/**
 * /tarifs et /en/tarifs — textes des blocs 2, 3, 4 (chapeau), 5, 6, 7 et 9, en-tête de page (brief « Page /tarifs et encadré
 * « l'essentiel » : le budget réel » du 23/11/2026, annexes A et B, textes validés par Jérôme le 23/11/2026 ; décisions D15 à D21,
 * G1 et G2 de Jérôme du 24/11/2026). Le bloc 1 est la fiche « l'essentiel » (src/data/entityFacts.ts), les listes du bloc 4 sont
 * dans src/data/inclus.ts, les onze questions du bloc 8 dans src/data/faq/tarifsFaq.ts (`tarifsPageFaq`).
 *
 * Règles (§ 6 du brief) : les phrases des annexes sont posées MOT POUR MOT — chaque phrase garde son sujet, son chiffre, son unité
 * et sa date, ni fusion ni coupe. Chaque nombre vient d'une source du dépôt : relevé d'annonces du 23/11/2026 (budgetReel.ts), prix,
 * chambres et surfaces (stats.ts), L'Appart (appart.ts), offre (offer.ts) ; les seuls littéraux sont ceux de l'annexe qui n'ont
 * aucune source dans le dépôt, signalés « annexe » ci-dessous. Nombres : espace insécable dans les milliers en français
 * (budgetNum), virgule en anglais (« CHF 1,290 ») ; tiret demi-cadratin dans les fourchettes des phrases (« 1 290–1 400 CHF »),
 * « à » / « to » dans les cellules des tableaux, comme l'annexe. Tutoiement ; aucun concurrent nommé ; aucun point d'exclamation.
 *
 * Module pur : imports relatifs, zéro React, chaînes plates (une phrase ou un paragraphe = un nœud texte : le prérendu ne glisse
 * aucun <!-- --> au milieu d'une phrase). Aucune date n'est lue au chargement ; seul `tarifsOfferShownNow` lit l'horloge, dans
 * le navigateur, après l'hydratation (bloc 6).
 */
import {
  BUDGET_FRANCE,
  BUDGET_GAPS,
  BUDGET_GENEVA,
  BUDGET_ITEMS,
  BUDGET_SURVEY,
  BUDGET_TABLE,
  HOUSES_AVERAGE_M2_PER_RESIDENT,
  budgetNum,
} from "./budgetReel";
import {
  CONTRACT_EUR,
  HOUSE_SURFACES,
  HOUSES_FROM,
  ROOMS_BY_HOUSE,
  ROOM_SURFACE_BY_HOUSE,
  SHARED_BATH_TIERS,
  STATS,
  STATS_SHARED_BATH,
  TAUX_BCE,
  interiorM2PerResident,
  priceTier,
} from "./stats";
import { timesPerWeek } from "./priceFacts";
import { priceRangeText } from "./answerSlots";
import { ENTITY_HOUSES } from "./entityFacts";
import { REPAIR_REPLY_WORKING_HOURS } from "./inclus";
import {
  FIRST_YEAR_END,
  FIRST_YEAR_OFFER_ID,
  FIRST_YEAR_TEXTS,
  FIRST_YEAR_TIERS,
  FIRST_YEAR_TOTAL_EUR,
  OFFER_PATH_FR,
  firstYearTotalChf,
  formatOfferChf,
  formatOfferDate,
  formatOfferEur,
  offerAt,
} from "./offer";
import type { MaisonKey } from "./places";
import { appartTeaser } from "./appartTeaser";

export type TarifsLang = "fr" | "en";

/** Ancres de la page (§ 3 du brief) : `calcul` et `inclus` nouvelles ; `echelle-prix` (avec l'id historique de son titre,
 *  `echelle-prix-title`), `lappart` et `faq` conservées ; `offre` n'existe que dans le navigateur, pendant l'offre. L'ancre
 *  `objection-prix` est PRICE_INCLUDES_ANCHOR (src/data/allInclusive.ts, lien « Ce que comprend le prix » des cartes chambres).
 *  `calcul` = la cible du lien « Voir le calcul » de la fiche « l'essentiel » (BUDGET_CALC_LINK, src/data/entityFacts.ts). */
export const TARIFS_ANCHORS = {
  calcul: "calcul",
  inclus: "inclus",
  prices: "echelle-prix",
  pricesTitle: "echelle-prix-title",
  offer: "offre",
  lappart: "lappart",
  faq: "faq",
} as const;

/** Guide du budget (D16) : « notre guide du budget » — chemin français, `LocalizedLink` ajoute /en (même slug en anglais). */
export const BUDGET_GUIDE_PATH = "/blog/budget-colocation-geneve-guide-complet";

/** Un paragraphe avec un lien au milieu : `before` + lien (`label`) + `after`. La page choisit la cible (ancre ou route). */
export interface LinkedText {
  before: string;
  label: string;
  after: string;
}

// ── Nombres ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────

const n = budgetNum;
/** « 80 à 110 » / « 80 to 110 » (cellules et listes de l'annexe). */
const span = (min: number, max: number, lang: TarifsLang): string => `${n(min, lang)} ${lang === "en" ? "to" : "à"} ${n(max, lang)}`;
/** « 1 290–1 400 » : fourchette d'une phrase, tiret demi-cadratin sans espace (annexe). */
const dash = (min: number, max: number, lang: TarifsLang): string => `${n(min, lang)}–${n(max, lang)}`;

const WORDS: Record<TarifsLang, Record<number, string>> = {
  fr: { 1: "un", 2: "deux", 3: "trois", 4: "quatre", 5: "cinq", 6: "six" },
  en: { 1: "one", 2: "two", 3: "three", 4: "four", 5: "five", 6: "six" },
};
/** Nombre en lettres (« trois », « three ») ; `feminine` : « une » au lieu de « un ». Hors table : en chiffres (tarifsTextsIssues). */
export function inWords(value: number, lang: TarifsLang, feminine = false): string {
  if (lang === "fr" && value === 1 && feminine) return "une";
  return WORDS[lang][value] ?? String(value);
}
const capital = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
/** « d'août 2026 » / « de septembre 2026 » (élision devant une voyelle). */
const deFr = (s: string): string => (/^[aeiouyàâéèêîôûh]/i.test(s) ? `d'${s}` : `de ${s}`);

const STANDARD = priceTier(CONTRACT_EUR.standard);
/** Chambres à salle d'eau privative : toutes, sauf celles des paliers à salle d'eau partagée (25 sur 29). */
const PRIVATE_BATH_ROOMS = STATS.totalRooms - STATS_SHARED_BATH.rooms;
const HOUSE_KEYS: readonly MaisonKey[] = ENTITY_HOUSES.map((h) => h.slug);

// ── En-tête de page ─────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Description de la page (D19) ; SEO la reprend dans la fiche LocalBusiness de la page. `<title>` et H1 inchangés. */
export function tarifsDescription(lang: TarifsLang): string {
  return lang === "en"
    ? `All-inclusive furnished room near Geneva, ${priceRangeText("en")} a month: bills, parking, cleaning, pool and sauna included. The real budget, item by item.`
    : `Chambre meublée tout compris de ${priceRangeText("fr")}/mois près de Genève : charges, parking, ménage, piscine et sauna inclus. Le budget réel, poste par poste.`;
}

// ── Bloc 2 : le budget réel (#calcul) ───────────────────────────────────────────────────────────────────────────────────────

export interface BudgetTableRowText {
  key: string;
  /** La ligne de La Villa Coliving (mise en valeur). */
  ours: boolean;
  /** Logement (en-tête de ligne), puis les cinq colonnes de l'annexe. */
  cells: readonly [string, string, string, string, string, string];
}

export interface BudgetBlockText {
  title: string;
  /** Les trois paragraphes de réponse, juste sous le titre, dans l'ordre de l'annexe. */
  answers: readonly [string, string, string];
  itemsTitle: string;
  items: readonly string[];
  tableTitle: string;
  /** Légende du tableau (unité + D20). */
  caption: string;
  header: readonly [string, string, string, string, string, string];
  rows: readonly BudgetTableRowText[];
  /** « À La Villa Coliving, une chambre à 1 290 CHF coûte 80 CHF de moins… » */
  gaps: string;
  /** « Face à une colocation gérée côté France… » ; le lien « détaillés plus bas » mène au bloc 3 (#objection-prix). */
  france: LinkedText;
  /** Ligne « Méthode » ; le lien « notre guide du budget » mène à BUDGET_GUIDE_PATH (D16). */
  method: LinkedText;
}

export function budgetBlock(lang: TarifsLang): BudgetBlockText {
  const G = BUDGET_GENEVA, F = BUDGET_FRANCE.managedFlatshare, I = BUDGET_ITEMS, S = BUDGET_SURVEY, C = BUDGET_SURVEY.counted;
  const GAP = BUDGET_GAPS;
  const P = G.privateRoom, M = G.managedFlatshare;
  const from = HOUSES_FROM.chf, std = STATS.priceChf;
  const en = lang === "en";
  const rows: BudgetTableRowText[] = BUDGET_TABLE.map((r) => {
    const listed = r.listedEur === undefined ? n(r.listed, lang) : en ? `${n(r.listed, lang)} (€${n(r.listedEur, lang)})` : `${n(r.listed, lang)} (${n(r.listedEur, lang)} €)`;
    const added = r.addedMin === null ? (en ? "none" : "rien") : r.addedMax === undefined ? n(r.addedMin, lang) : span(r.addedMin, r.addedMax, lang);
    const parking = r.parking === null ? (en ? "included" : "compris") : n(r.parking, lang);
    const without = r.withoutCarMax === undefined ? n(r.withoutCarMin, lang) : span(r.withoutCarMin, r.withoutCarMax, lang);
    const withCar = r.withCarMax === undefined ? n(r.withCarMin, lang) : span(r.withCarMin, r.withCarMax, lang);
    return { key: r.key, ours: r.ours === true, cells: [r.label[lang], listed, added, parking, without, withCar] as const };
  });
  if (en) {
    return {
      title: "A room in Geneva or on the French side: what should you budget on top of the rent?",
      answers: [
        "Rent is not a housing budget. In Geneva as on the French side, there are almost always utilities, move-in fees and, if you have a car, a parking space to add.",
        `In ${S.monthLabel.en}, in Geneva, a room in a managed flatshare, furnished with all bills included, is listed between CHF ${n(M.min, lang)} and ${n(M.max, lang)} a month, with a median of CHF ${n(M.median, lang)}; with a private bathroom, the rooms we found start at CHF ${n(M.privateBathFrom, lang)}. A room rented from a private landlord is listed at a median of CHF ${n(P.median, lang)}; it comes to CHF ${dash(P.withoutCarMin, P.withoutCarMax, lang)} a month with running costs, and CHF ${dash(P.withCarMin, P.withCarMax, lang)} with a parking space.`,
        `At La Villa Coliving, the listed price is your total spend: CHF ${n(from, lang)} to ${n(std, lang)} a month depending on the room, CHF ${n(std, lang)} with a private bathroom, with parking, pool, sauna and gym included.`,
      ],
      itemsTitle: "What comes on top of a rent, item by item",
      items: [
        `Heating, water and electricity, when the rent is quoted without charges: CHF ${span(I.charges.min, I.charges.max, lang)} a month.`,
        `Internet, if not included: CHF ${span(I.internet.min, I.internet.max, lang)} a month per person.`,
        `Radio and TV licence fee, in Switzerland: CHF ${span(I.tvLicence.min, I.tvLicence.max, lang)} a month when shared between two or three.`,
        `Rental deposit guarantee, in Switzerland: up to CHF ${n(I.depositGuarantee.max, lang)} a month.`,
        `Application or agency fees, on the French side: often €${n(I.agencyFeesEur.min, lang)} to €${n(I.agencyFeesEur.max, lang)} when you move in.`,
        `Parking space: CHF ${span(I.parkingGeneva.min, I.parkingGeneva.max, lang)} a month in Geneva, €${n(I.parkingAnnemasseEur.min, lang)} to €${n(I.parkingAnnemasseEur.max, lang)} around Annemasse.`,
        `Laundry, everyday supplies, linen: about CHF ${n(I.everyday, lang)} a month.`,
        `A streaming subscription: CHF ${n(I.streaming, lang)} a month.`,
      ],
      tableTitle: "What it adds up to, by type of housing",
      caption: "CHF a month, rounded to the nearest ten; totals calculated before rounding",
      header: ["Housing", "Listed price", "Added costs, excluding parking", "Parking", "Without a car", "With a car"],
      rows,
      gaps: `At La Villa Coliving, a room at CHF ${n(from, lang)} costs CHF ${n(GAP.fromRoomBelowReference, lang)} less than the reference in the table; a room with a private bathroom, at CHF ${n(std, lang)}, costs CHF ${n(GAP.standardRoomAboveReference, lang)} more.`,
      france: {
        before: `Compared with a managed flatshare on the French side, the gap is about CHF ${n(GAP.franceManagedWithCar, lang)} a month with a car. It pays for ${HOUSES_AVERAGE_M2_PER_RESIDENT} m² of indoor space per person on average instead of ${F.perPersonM2} m², rooms of ${STATS.roomSizeMin} to ${STATS.roomSizeMax} m² instead of ${F.roomMinM2} to ${F.roomMaxM2} m², and the houses' facilities, `,
        label: "detailed below",
        after: ".",
      },
      method: {
        before: `Method: prices collected on ${S.dayLabel.en} from listing and operator websites (in Geneva: ${C.genevaPrivateRooms} rooms from private landlords, ${C.genevaManagedRooms} rooms in managed flatshares, ${C.genevaStudios} furnished studios; on the French side: ${C.franceManagedFlatshares} managed flatshares and ${C.franceResidences === 1 ? "one residence" : `${C.franceResidences} residences`}); medians, rounded to the nearest ten. The itemised costs and sources are in `,
        label: "our budget guide",
        after: ".",
      },
    };
  }
  return {
    title: "Chambre à Genève ou côté France : quel budget prévoir en plus du loyer ?",
    answers: [
      "Un loyer n'est pas un budget logement. À Genève comme côté France, il s'y ajoute presque toujours des charges, des frais d'entrée et, si tu as une voiture, une place de parking.",
      `En ${S.monthLabel.fr}, à Genève, une chambre en colocation gérée, meublée et toutes charges comprises, s'affiche entre ${n(M.min, lang)} et ${n(M.max, lang)} CHF par mois, ${n(M.median, lang)} CHF en médiane ; avec une salle d'eau privative, les chambres relevées démarrent à ${n(M.privateBathFrom, lang)} CHF. Une chambre louée entre particuliers s'affiche à ${n(P.median, lang)} CHF en médiane ; elle revient à ${dash(P.withoutCarMin, P.withoutCarMax, lang)} CHF par mois avec les frais courants, et à ${dash(P.withCarMin, P.withCarMax, lang)} CHF avec une place de parking.`,
      `À La Villa Coliving, le prix affiché est la dépense totale : de ${n(from, lang)} à ${n(std, lang)} CHF par mois selon la chambre, ${n(std, lang)} CHF avec une salle d'eau privative, parking, piscine, sauna et salle de sport compris.`,
    ],
    itemsTitle: "Ce qui s'ajoute à un loyer, poste par poste",
    items: [
      `Chauffage, eau, électricité, quand le loyer est annoncé hors charges : ${span(I.charges.min, I.charges.max, lang)} CHF par mois.`,
      `Internet, s'il n'est pas compris : ${span(I.internet.min, I.internet.max, lang)} CHF par mois et par personne.`,
      `Redevance radio-télévision, en Suisse : ${span(I.tvLicence.min, I.tvLicence.max, lang)} CHF par mois à deux ou trois.`,
      `Garantie de loyer, en Suisse : jusqu'à ${n(I.depositGuarantee.max, lang)} CHF par mois.`,
      `Frais de dossier ou d'agence, côté France : ${span(I.agencyFeesEur.min, I.agencyFeesEur.max, lang)} € à l'entrée, fréquents.`,
      `Place de parking : ${span(I.parkingGeneva.min, I.parkingGeneva.max, lang)} CHF par mois à Genève, ${span(I.parkingAnnemasseEur.min, I.parkingAnnemasseEur.max, lang)} € côté Annemasse.`,
      `Lessive, produits du quotidien, linge : environ ${n(I.everyday, lang)} CHF par mois.`,
      `Un abonnement de streaming : ${n(I.streaming, lang)} CHF par mois.`,
    ],
    tableTitle: "Ce que cela donne, par type de logement",
    caption: "CHF par mois, arrondis à la dizaine ; totaux calculés avant arrondi",
    header: ["Logement", "Prix affiché", "Ce qui s'ajoute, hors parking", "Parking", "Sans voiture", "Avec voiture"],
    rows,
    gaps: `À La Villa Coliving, une chambre à ${n(from, lang)} CHF coûte ${n(GAP.fromRoomBelowReference, lang)} CHF de moins que la référence du tableau ; une chambre avec salle d'eau privative, à ${n(std, lang)} CHF, ${n(GAP.standardRoomAboveReference, lang)} CHF de plus.`,
    france: {
      before: `Face à une colocation gérée côté France, l'écart est d'environ ${n(GAP.franceManagedWithCar, lang)} CHF par mois avec une voiture. Il correspond à ${HOUSES_AVERAGE_M2_PER_RESIDENT} m² de surface intérieure par personne en moyenne contre ${F.perPersonM2} m², à des chambres de ${STATS.roomSizeMin} à ${STATS.roomSizeMax} m² contre ${F.roomMinM2} à ${F.roomMaxM2} m², et aux équipements des maisons, `,
      label: "détaillés plus bas",
      after: ".",
    },
    method: {
      before: `Méthode : prix relevés le ${S.dayLabel.fr} sur les sites d'annonces et d'opérateurs (à Genève : ${C.genevaPrivateRooms} chambres entre particuliers, ${C.genevaManagedRooms} chambres en colocation gérée, ${C.genevaStudios} studios meublés ; côté France : ${C.franceManagedFlatshares} colocations gérées et ${C.franceResidences === 1 ? "une résidence" : `${C.franceResidences} résidences`}) ; médianes, arrondies à la dizaine. Le détail des postes et les sources sont dans `,
      label: "notre guide du budget",
      after: ".",
    },
  };
}

// ── Bloc 3 : ce que la différence paie (#objection-prix) ────────────────────────────────────────────────────────────────────

export interface ValuePoint {
  /** H3 numéroté, tel que l'annexe l'écrit (« 1. De la place. »). */
  title: string;
  text: string;
}

export interface HouseColumn {
  slug: MaisonKey;
  name: string;
  commune: string;
}

export interface ValueBlockText {
  title: string;
  intro: string;
  points: readonly [ValuePoint, ValuePoint, ValuePoint, ValuePoint];
  /** Tableau des maisons (sous le point 2) : une colonne par maison, le nom de chaque maison est un lien vers sa page. */
  houses: readonly HouseColumn[];
  houseRows: readonly { label: string; cells: readonly string[] }[];
  /** « Le plus simple pour juger : venir voir une maison. » — le lien mène à la candidature. */
  visit: LinkedText;
}

/**
 * Lignes « Piscine », « Sauna » et « Extérieurs » du tableau des maisons : littéraux de l'annexe (aucune source dans le dépôt :
 * entityFacts.ts ne tient que « piscine extérieure chauffée · sauna · salle de sport », sans dimension ni places ; les pages
 * maisons les écrivent en dur). Les surfaces de jardin, elles, viennent de HOUSE_SURFACES (G2 : La Villa = 2 000 m², jamais 1 948).
 */
const HOUSE_LITERALS: Record<MaisonKey, Record<TarifsLang, { pool: string; sauna: string; outdoor: (garden: string) => string }>> = {
  lavilla: {
    fr: { pool: "extérieure chauffée, 12 × 5 m", sauna: "5 places", outdoor: (g) => `jardin de ${g} m², terrasses, barbecue, volley` },
    en: { pool: "heated outdoor pool, 12 × 5 m", sauna: "seats 5", outdoor: (g) => `${g} m² garden, terraces, barbecue, volleyball` },
  },
  leloft: {
    fr: { pool: "intérieure chauffée, toute l'année", sauna: "2 places", outdoor: () => "terrasses, cuisine extérieure avec barbecue" },
    en: { pool: "heated indoor pool, all year round", sauna: "seats 2", outdoor: () => "terraces, outdoor kitchen with barbecue" },
  },
  lelodge: {
    fr: { pool: "extérieure, 12 × 5 m", sauna: "5 places", outdoor: (g) => `jardin de ${g} m², pool house, pétanque, barbecue` },
    en: { pool: "outdoor pool, 12 × 5 m", sauna: "seats 5", outdoor: (g) => `${g} m² garden, pool house, pétanque, barbecue` },
  },
};

/** Surface du jardin d'une maison (HOUSE_SURFACES.plotM2), « 2 000 » / « 2,000 » ; vide si la maison n'en déclare pas. */
function gardenM2(slug: MaisonKey, lang: TarifsLang): string {
  const s: { livingM2: number; plotM2?: number } = HOUSE_SURFACES[slug];
  return s.plotM2 === undefined ? "" : n(s.plotM2, lang);
}

/** « 7, 10 et 12 » / « 7, 10 and 12 » : chambres par maison, de la plus petite à la plus grande (ROOMS_BY_HOUSE). */
function roomCounts(lang: TarifsLang): string {
  const all = HOUSE_KEYS.map((k) => ROOMS_BY_HOUSE[k]).sort((a, b) => a - b).map(String);
  const last = all.pop();
  return `${all.join(", ")} ${lang === "en" ? "and" : "et"} ${last}`;
}

export function valueBlock(lang: TarifsLang): ValueBlockText {
  const S = BUDGET_SURVEY, G = BUDGET_GENEVA, F = BUDGET_FRANCE.managedFlatshare;
  const en = lang === "en";
  const houses = ENTITY_HOUSES.map((h) => ({ slug: h.slug, name: h.label, commune: h.commune }));
  const perResident = (k: MaisonKey) => `${Math.floor(interiorM2PerResident(k))} m²`;
  const rooms = (k: MaisonKey) => {
    const r = ROOM_SURFACE_BY_HOUSE[k];
    return en ? `${ROOMS_BY_HOUSE[k]}, from ${r.min} to ${r.max} m²` : `${ROOMS_BY_HOUSE[k]}, de ${r.min} à ${r.max} m²`;
  };
  const lit = (k: MaisonKey) => HOUSE_LITERALS[k][lang];
  const houseRows = [
    { label: en ? "Rooms" : "Chambres", cells: HOUSE_KEYS.map(rooms) },
    { label: en ? "Indoor space per resident" : "Surface intérieure par résident", cells: HOUSE_KEYS.map(perResident) },
    { label: en ? "Pool" : "Piscine", cells: HOUSE_KEYS.map((k) => lit(k).pool) },
    { label: "Sauna", cells: HOUSE_KEYS.map((k) => lit(k).sauna) },
    { label: en ? "Outdoor areas" : "Extérieurs", cells: HOUSE_KEYS.map((k) => lit(k).outdoor(gardenM2(k, lang))) },
  ];
  const three = inWords(STATS.totalHouses, lang);
  if (en) {
    return {
      title: "What La Villa Coliving offers beyond a flatshare",
      intro: "The price difference with a flatshare pays for four things.",
      points: [
        {
          title: "1. Space.",
          text: `At La Villa Coliving, each resident has ${HOUSES_AVERAGE_M2_PER_RESIDENT} m² of indoor space on average, from ${STATS.livingSpacePerResidentMin} to ${STATS.livingSpacePerResidentMax} m² depending on the house. In the managed flatshares we surveyed in ${S.monthLabel.en}, it is ${F.perPersonM2} m² on the French side and ${G.managedFlatshare.perPersonM2} m² in Geneva. Rooms at La Villa Coliving measure ${STATS.roomSizeMin} to ${STATS.roomSizeMax} m², and ${PRIVATE_BATH_ROOMS} out of ${STATS.totalRooms} have a private bathroom; in Geneva, a room rented from a private landlord has a median size of ${G.privateRoom.medianM2} m².`,
        },
        { title: "2. A fully equipped house.", text: "Each La Villa Coliving house has its own pool, sauna, gym and home cinema, with landscaped outdoor areas." },
        {
          title: "3. Nothing to manage.",
          text: `A cleaning company cleans the shared areas ${timesPerWeek("en")}. Everyday supplies arrive each month, the garden and pool are maintained, and repairs are taken care of, with a reply within ${REPAIR_REPLY_WORKING_HOURS} working hours. No cleaning rota to negotiate, no bills to split.`,
        },
        {
          title: "4. House life.",
          text: `The La Villa Coliving houses have ${roomCounts("en")} rooms. Residents have a say in who joins them, after an initial selection on our side. Every month, each house hosts a yoga class and a fitness coaching session, open to residents of all ${three} houses, and a house get-together.`,
        },
      ],
      houses,
      houseRows,
      visit: { before: "The simplest way to judge: ", label: "come and see a house", after: "." },
    };
  }
  return {
    title: "Ce que La Villa Coliving offre de plus qu'une colocation",
    intro: "La différence de prix avec une colocation paie quatre choses.",
    points: [
      {
        title: "1. De la place.",
        text: `À La Villa Coliving, chaque résident dispose en moyenne de ${HOUSES_AVERAGE_M2_PER_RESIDENT} m² de surface intérieure, de ${STATS.livingSpacePerResidentMin} à ${STATS.livingSpacePerResidentMax} m² selon la maison. Dans les colocations gérées que nous avons relevées en ${S.monthLabel.fr}, c'est ${F.perPersonM2} m² côté France et ${G.managedFlatshare.perPersonM2} m² à Genève. Les chambres de La Villa Coliving font de ${STATS.roomSizeMin} à ${STATS.roomSizeMax} m², et ${PRIVATE_BATH_ROOMS} sur ${STATS.totalRooms} ont leur salle d'eau privative ; à Genève, une chambre louée entre particuliers fait ${G.privateRoom.medianM2} m² en médiane.`,
      },
      { title: "2. Une maison équipée.", text: "Chaque maison de La Villa Coliving a sa piscine, son sauna, sa salle de sport et son home cinéma, avec des extérieurs aménagés." },
      {
        title: "3. Rien à gérer.",
        // Délai des réparations (annexe, REPAIR_REPLY_WORKING_HOURS), distinct de la réponse aux candidatures (STATS.responseHours).
        text: `Une entreprise nettoie les parties communes ${timesPerWeek("fr")}. Les produits du quotidien arrivent chaque mois, le jardin et la piscine sont entretenus, les réparations sont prises en charge, avec une réponse sous ${REPAIR_REPLY_WORKING_HOURS} heures ouvrées. Tu ne négocies ni planning de ménage ni facture à partager.`,
      },
      {
        title: "4. Une vie de maison.",
        text: `Les maisons de La Villa Coliving comptent ${roomCounts("fr")} chambres. Les résidents participent au choix de ceux qui les rejoignent, après une première sélection par nos soins. Chaque mois, chaque maison accueille un cours de yoga et une séance de coaching sportif, ouverts aux résidents des ${three} maisons, et une soirée commune.`,
      },
    ],
    houses,
    houseRows,
    visit: { before: "Le plus simple pour juger : ", label: "venir voir une maison", after: "." },
  };
}

/** Cartes « Nos maisons » sous le tableau du bloc 3 (D18) : photo, nom, commune, lien — ni prix, ni texte. */
export interface HouseCardText {
  slug: MaisonKey;
  name: string;
  commune: string;
  image: string;
  alt: string;
}

const HOUSE_CARD_IMAGES: Record<MaisonKey, { image: string; alt: Record<TarifsLang, string> }> = {
  lavilla: { image: "/images/villa_portrait.webp", alt: { fr: "La maison La Villa, à Ville-la-Grand", en: "The La Villa house in Ville-la-Grand" } },
  leloft: { image: "/images/le loft jardin.webp", alt: { fr: "Le jardin du Loft, à Ambilly", en: "Le Loft's garden in Ambilly" } },
  lelodge: { image: "/images/le lodge piscine.webp", alt: { fr: "La piscine du Lodge, à Annemasse", en: "Le Lodge's pool in Annemasse" } },
};

export function houseCards(lang: TarifsLang): readonly HouseCardText[] {
  return ENTITY_HOUSES.map((h) => ({ slug: h.slug, name: h.label, commune: h.commune, image: HOUSE_CARD_IMAGES[h.slug].image, alt: HOUSE_CARD_IMAGES[h.slug].alt[lang] }));
}

// ── Bloc 4 : tout ce qui est compris (#inclus) — les listes sont dans src/data/inclus.ts ─────────────────────────────────────

export function includedBlock(lang: TarifsLang): { title: string; intro: string } {
  const three = inWords(STATS.totalHouses, lang);
  return lang === "en"
    ? { title: "Everything included in the price", intro: `At La Villa Coliving, the listed price covers everything below, in all ${three} houses.` }
    : { title: "Tout ce qui est compris dans le prix", intro: `À La Villa Coliving, le prix affiché couvre tout ce qui suit, dans les ${three} maisons.` };
}

// ── Bloc 5 : les prix, chambre par chambre (#echelle-prix) ──────────────────────────────────────────────────────────────────

export interface PriceRowText {
  key: string;
  room: string;
  chf: string;
  eur: string;
  count: string;
  bath: string;
}

export interface PricesBlockText {
  title: string;
  intro: string;
  header: readonly [string, string, string, string, string];
  rows: readonly PriceRowText[];
  /** « Les chambres disponibles et leurs dates sont à jour sur la page des chambres. » — lien vers /chambres-disponibles. */
  rooms: LinkedText;
  lease: string;
  termsTitle: string;
  terms: readonly string[];
}

/** Surfaces des chambres 3 et 4 de La Villa (annexe : « de 18 et 19 m² ») — la base les tient (v_public_rooms), pas le code.
 *  Le palier le plus bas a sa surface dans la source (`approxM2`, gardée contre la base par check:facts). */
const TIER_SURFACES_LITERAL: Record<string, Record<TarifsLang, string>> = { "3,4": { fr: "18 et 19", en: "18 and 19" } };

export function pricesBlock(lang: TarifsLang): PricesBlockText {
  const en = lang === "en";
  const three = inWords(STATS.totalHouses, lang);
  const tiers = 1 + SHARED_BATH_TIERS.length;
  const shared = en ? "shared between two rooms" : "partagée entre deux chambres";
  const rows: PriceRowText[] = [
    {
      key: "standard",
      room: en ? `${STATS.roomSizeMin} to ${STATS.roomSizeMax} m², in all ${three} houses` : `De ${STATS.roomSizeMin} à ${STATS.roomSizeMax} m², dans les ${three} maisons`,
      chf: STANDARD[lang].chf,
      eur: STANDARD[lang].eur,
      count: String(PRIVATE_BATH_ROOMS),
      bath: en ? "private" : "privative",
    },
    ...SHARED_BATH_TIERS.map((t) => {
      const m2 = t.approxM2 !== undefined ? String(t.approxM2) : TIER_SURFACES_LITERAL[t.rooms.join(",")]?.[lang] ?? "";
      return {
        key: `rooms-${t.rooms.join("-")}`,
        room: en ? `${m2} m², at ${STATS_SHARED_BATH.house}` : `De ${m2} m², à ${STATS_SHARED_BATH.house}`,
        chf: t[lang].chf,
        eur: t[lang].eur,
        count: String(t.rooms.length),
        bath: shared,
      };
    }),
  ];
  const deposit = inWords(STATS.depositMonths, lang);
  const notice = inWords(STATS.noticePeriodMonths, lang);
  if (en) {
    return {
      title: "Prices, room by room",
      intro: `${capital(inWords(tiers, "en"))} prices, depending on the bathroom and the size of the room. All give access to the same facilities and services.`,
      header: ["Room", "Price per month, all-inclusive", "Rent on the lease", "Number of rooms", "Bathroom"],
      rows,
      rooms: { before: "Available rooms and their dates are kept up to date on ", label: "the rooms page", after: "." },
      lease: `The lease is in euros; prices in CHF are indicative, at the ${CONTRACT_EUR.rateLabelEn} rate.`,
      termsTitle: "Terms",
      terms: [
        "No move-in fees: no application, agency, booking or inventory fee. We let our houses directly.",
        `Deposit: ${deposit} months' rent excluding charges, payable in one, two or three instalments depending on your application. It is returned within 30 days of your departure, or within two months if damage has to be deducted.`,
        `${STATS.leaseDurationMonths}-month lease. You can leave at any time with ${notice} month's notice, and move in on any date.`,
        "Application: employment contract or job offer, and ID. A guarantor is only requested case by case.",
        "Rent paid by bank transfer, once a month.",
      ],
    };
  }
  return {
    title: "Les prix, chambre par chambre",
    intro: `${capital(inWords(tiers, "fr"))} prix, selon la salle d'eau et la taille de la chambre. Tous donnent accès aux mêmes équipements et aux mêmes services.`,
    header: ["Chambre", "Prix par mois, tout compris", "Loyer du bail", "Nombre de chambres", "Salle d'eau"],
    rows,
    rooms: { before: "Les chambres disponibles et leurs dates sont à jour sur ", label: "la page des chambres", after: "." },
    lease: `Le bail est en euros ; les prix en CHF sont indicatifs, au taux ${deFr(CONTRACT_EUR.rateLabelFr)}.`,
    termsTitle: "Les conditions",
    terms: [
      "Aucun frais d'entrée : ni dossier, ni agence, ni réservation, ni état des lieux. Nous louons nos maisons en direct.",
      `Caution : ${deposit} mois de loyer hors charges, payable en une, deux ou trois fois selon ton dossier. Elle t'est rendue sous 30 jours après ton départ, sous deux mois s'il y a des dégâts à déduire.`,
      `Bail de ${STATS.leaseDurationMonths} mois. Tu peux partir à tout moment avec ${notice} mois de préavis, et entrer à n'importe quelle date.`,
      "Dossier : contrat de travail ou promesse d'embauche, pièce d'identité. Un garant n'est demandé qu'au cas par cas.",
      "Loyer réglé par virement, une fois par mois.",
    ],
  };
}

// ── Bloc 6 : l'offre en cours (#offre) — navigateur seulement ───────────────────────────────────────────────────────────────

export interface OfferBlockText {
  title: string;
  /** Équivalent en CHF, dans une phrase à part, comme sur la page de l'offre (jamais € et CHF dans la même phrase). */
  chf: string;
  subtitle: string;
  deadline: string;
  link: string;
  /** Chemin français de la page de l'offre (`LocalizedLink` le traduit : /en/winter-offer). */
  path: string;
}

/**
 * Textes de l'offre « Ta première année avec nous » (annexe A et B, bloc 6 = textes de la page de l'offre, brief du 21/11/2026).
 * offer.ts ne porte pas l'accroche, le sous-titre ni l'échéance (ils sont écrits dans OfferHiverPage.tsx, non exportés) : ils sont
 * composés ici du nom (FIRST_YEAR_TEXTS), des paliers (FIRST_YEAR_TIERS), du total (FIRST_YEAR_TOTAL_EUR) et de l'échéance
 * (FIRST_YEAR_END), avec les mêmes formats. Jamais de prix mensuel « avec l'offre », de prix barré ni de « loyer réduit ».
 */
export function firstYearOfferBlock(lang: TarifsLang): OfferBlockText {
  const en = lang === "en";
  const eur = (v: number) => formatOfferEur(v, lang);
  const [first, ...later] = FIRST_YEAR_TIERS;
  const total = eur(FIRST_YEAR_TOTAL_EUR);
  const end = formatOfferDate(FIRST_YEAR_END, lang);
  const chf = formatOfferChf(firstYearTotalChf(TAUX_BCE.eurChf), lang);
  const when = (months: number) => (en ? (months === 12 ? "after a year" : `after ${months} months`) : months === 12 ? "à 1 an" : `à ${months} mois`);
  const steps = later.map((t) => `${eur(t.eur)} ${when(t.afterMonths)}`);
  if (en) {
    const last = steps.pop();
    return {
      title: `${FIRST_YEAR_TEXTS.en.name}: up to ${total} back`,
      chf: `That's about ${chf}.`,
      subtitle: `The longer you stay, the more you get back: ${eur(first.eur)} off your first rent, then ${steps.join(", ")} and ${last}. Your rent stays the same.`,
      deadline: `For any lease signed by ${end}, even if you only move in in January.`,
      link: "See the offer and its terms",
      path: OFFER_PATH_FR,
    };
  }
  return {
    title: `${FIRST_YEAR_TEXTS.fr.name} : jusqu'à ${total} remboursés`,
    chf: `Soit environ ${chf}.`,
    subtitle: `Plus tu restes, plus on te rembourse : ${eur(first.eur)} dès ton premier loyer, ${steps.join(", ")}. Ton loyer, lui, ne change pas.`,
    deadline: `Pour tout bail signé d'ici le ${end}, même si tu n'arrives qu'en janvier.`,
    link: "Voir l'offre et ses conditions",
    path: OFFER_PATH_FR,
  };
}

/**
 * Le bloc de l'offre se montre-t-il ? Seulement pendant l'offre « Ta première année avec nous » (offerAt : du 24/11/2026 à 0 h
 * au 31/12/2026 inclus, heure de Paris — le 01/01/2027 à 0 h, il disparaît sans déploiement), et jamais dans un navigateur
 * automatisé : le prérendu est une capture Puppeteer d'un rendu client (navigator.webdriver vrai), le bloc n'est donc jamais
 * dans le HTML prérendu, ni pour les robots qui ne lancent pas le JavaScript. Pur.
 */
export function tarifsOfferShown(nowMs: number, automated: boolean): boolean {
  return !automated && offerAt(nowMs)?.id === FIRST_YEAR_OFFER_ID;
}

/** Navigateur piloté par un automate (prérendu, garde d'hydratation, tests) ? Hors navigateur : vrai (rien à montrer). */
export function isAutomatedBrowser(): boolean {
  try {
    return typeof navigator === "undefined" || navigator.webdriver === true;
  } catch {
    return true;
  }
}

/** Pour la page, APRÈS l'hydratation seulement (useHydrated) : l'heure du lecteur et son navigateur. */
export function tarifsOfferShownNow(): boolean {
  return tarifsOfferShown(Date.now(), isAutomatedBrowser());
}

// ── Bloc 7 : L'Appart (#lappart) ────────────────────────────────────────────────────────────────────────────────────────────

export interface AppartBlockText {
  title: string;
  paragraphs: readonly [string, string];
  link: string;
}

/**
 * Bloc statique de L'Appart sur /tarifs (annexe, bloc 7) : le texte vit dans src/data/appartTeaser.ts (`appartTeaser("/tarifs")`),
 * que la garde check:facts compare à la section `data-appart-teaser="/tarifs"` — une seule source (24/11/2026).
 */
export function appartBlock(lang: TarifsLang): AppartBlockText {
  const t = appartTeaser("/tarifs", lang);
  const [first, second] = t.paragraphs ?? [];
  if (!first || !second || (t.paragraphs?.length ?? 0) !== 2) throw new Error('appartBlock : appartTeaser("/tarifs") doit donner deux paragraphes');
  return { title: t.title, paragraphs: [first, second], link: t.link };
}

// ── Bloc 8 : titre (les questions : src/data/faq/tarifsFaq.ts) ; bloc 9 : candidater ───────────────────────────────────────

/** Titre du bloc 8, inchangé (le titre anglais existant est gardé, conventions de l'annexe B). */
export const TARIFS_FAQ_TITLE: Readonly<Record<TarifsLang, string>> = {
  fr: "Questions fréquentes sur les tarifs",
  en: "Pricing — frequently asked questions",
};

// (24/11/2026, § 4.7 de la refonte des pages de vente) « Candidater » → « Programmer une visite » ; « La candidature prend » → « La demande de visite prend ».
export function applyBlock(lang: TarifsLang): { title: string; text: string; rooms: string; apply: string } {
  const minutes = inWords(STATS.applyMinutes, lang);
  return lang === "en"
    ? {
        title: "Ready to Join?",
        text: `Available rooms and their dates are kept up to date on the rooms page. Requesting a visit takes ${minutes} minutes; we reply within ${STATS.responseHours} hours, then we have a call.`,
        rooms: "See available rooms",
        apply: "Book a visit",
      }
    : {
        title: "Prêt à nous rejoindre ?",
        text: `Les chambres disponibles et leurs dates sont à jour sur la page des chambres. La demande de visite prend ${minutes} minutes ; on te répond sous ${STATS.responseHours} heures, puis on s'appelle.`,
        rooms: "Voir les chambres disponibles",
        apply: "Programmer une visite",
      };
}

// ── Contrôles ───────────────────────────────────────────────────────────────────────────────────────────────────────────────

const linked = (t: LinkedText): string => `${t.before}${t.label}${t.after}`;

/** Toutes les chaînes rendues dans le HTML prérendu (blocs 2 à 5, 7 et 9 ; pas le bloc 6, navigateur seulement). Tests. */
export function tarifsStaticStrings(lang: TarifsLang): string[] {
  const b = budgetBlock(lang), v = valueBlock(lang), i = includedBlock(lang), p = pricesBlock(lang), a = appartBlock(lang), c = applyBlock(lang);
  return [
    tarifsDescription(lang),
    b.title, ...b.answers, b.itemsTitle, ...b.items, b.tableTitle, b.caption, ...b.header, ...b.rows.flatMap((r) => r.cells), b.gaps, linked(b.france), linked(b.method),
    v.title, v.intro, ...v.points.flatMap((x) => [x.title, x.text]), ...v.houseRows.flatMap((r) => [r.label, ...r.cells]), linked(v.visit),
    ...houseCards(lang).flatMap((h) => [h.name, h.commune, h.alt]),
    i.title, i.intro,
    p.title, p.intro, ...p.header, ...p.rows.flatMap((r) => [r.room, r.chf, r.eur, r.count, r.bath]), linked(p.rooms), p.lease, p.termsTitle, ...p.terms,
    a.title, ...a.paragraphs, a.link,
    TARIFS_FAQ_TITLE[lang],
    c.title, c.text, c.rooms, c.apply,
  ];
}

/** Incohérences internes (vide = OK) : parité FR/EN, valeurs manquantes, nombres hors de la table des lettres, D20. */
export function tarifsTextsIssues(): string[] {
  const out: string[] = [];
  const fr = tarifsStaticStrings("fr"), en = tarifsStaticStrings("en");
  if (fr.length !== en.length) out.push(`${fr.length} chaînes en français, ${en.length} en anglais`);
  for (const [lang, all] of [["fr", fr], ["en", en]] as const) {
    for (const s of all) if (/undefined|NaN|\{\{|\[object/.test(s) || s.trim() === "") out.push(`${lang} : valeur manquante — « ${s.slice(0, 60)} »`);
  }
  for (const v of [STATS.totalHouses, STATS.depositMonths, STATS.noticePeriodMonths, STATS.applyMinutes, 1 + SHARED_BATH_TIERS.length]) {
    if (!WORDS.fr[v]) out.push(`nombre ${v} hors de la table des nombres en lettres`);
  }
  if (budgetBlock("fr").rows.length !== 6) out.push(`tableau du bloc 2 : ${budgetBlock("fr").rows.length} lignes (attendu 6)`);
  if (budgetBlock("fr").rows.filter((r) => r.ours).length !== 1) out.push("tableau du bloc 2 : une seule ligne de La Villa Coliving attendue");
  for (const t of SHARED_BATH_TIERS) {
    if (t.approxM2 === undefined && !TIER_SURFACES_LITERAL[t.rooms.join(",")]) out.push(`palier ${t.rooms.join(" et ")} : surface inconnue (annexe)`);
  }
  if (FIRST_YEAR_TIERS[FIRST_YEAR_TIERS.length - 1].afterMonths !== 12) out.push("offre : le dernier palier n'est plus « à 1 an »");
  return out;
}
