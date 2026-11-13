/**
 * L'Appart — faits canoniques (brief « Points d'entrée prix, L'Appart » du 12/11/2026, Lots 3 et 4 ; décisions V5, V7, V8,
 * V9 de Jérôme ; numéros, date d'ouverture et surface « à confirmer » — Q10, Q11, Q14).
 *
 * SOURCE UNIQUE des faits de L'Appart : nom, descripteur, commune, surfaces, chambres et numéro de la suite, date
 * d'ouverture, loyers (saisis en EUROS, francs dérivés par priceTier comme pour les maisons), ménage, DPE, trajets.
 * Aucune page, aucun texte, aucune garde n'écrit un de ces faits en dur : les textes de L'Appart (src/data/appartFacts.ts,
 * src/data/appartLocation.ts) sont des gabarits sur cette constante.
 *
 * Deux gammes, jamais fondues (V2) : ce module ne lit AUCUN fait des maisons (ni ROOMS_BY_HOUSE, ni HOUSE_SURFACES, ni
 * TRANSIT, ni STATS, ni OCCUPANCY, ni GOOGLE_REVIEWS, ni ENTITY_HOUSES) — règle de lint (eslint.config.js) et test
 * tools/test/appart-boundary.test.mjs. Inversement, les tables des maisons n'acceptent pas L'Appart (types, places.ts).
 *
 * Ce que le code ne porte PAS, exprès (le dépôt est public) : aucune rue, aucune coordonnée du logement, aucune distance
 * en mètres ni en kilomètres (décision 27 : deux distances courtes, l'étage et l'orientation situeraient l'immeuble ; on
 * publie les minutes), aucune date de diagnostic (DPE daté + classe + surface + commune = une seule fiche dans la base
 * publique des diagnostics), aucune clé interne de la base (un seul fichier la connaît : src/lib/placeBridge.ts).
 *
 * Module pur : imports relatifs, zéro React, chaînes plates, aucune date calculée à l'exécution.
 */
import { APPART_KEY, APPART_SUITE_MAX_OCCUPANTS, APPART_SUITE_ROOM_NUMBER, PLACE_LABEL, type AppartKey } from "./places";
import { priceTier, type PriceTier } from "./stats";
import { MONTHS_EN, MONTHS_FR } from "../lib/dates";

/** Loyers contractuels en euros (prix maîtres, V8) — la SEULE saisie de prix de L'Appart. Séparés de CONTRACT_EUR : le
 *  « dès » des maisons (HOUSES_FROM) ne peut pas descendre à 790 €. */
export const APPART_CONTRACT_EUR = { room: 790, suite: 1060 } as const;

const ROOM_TIER: PriceTier = priceTier(APPART_CONTRACT_EUR.room); //   790 € →   730 CHF
const SUITE_TIER: PriceTier = priceTier(APPART_CONTRACT_EUR.suite); // 1 060 € → 990 CHF

/** « 1er février 2027 » / « 1 February 2027 » — forme des dates fixes du site (l'anglais : jour, mois, année). Pure. */
function fixedDateLabel(iso: string, lang: "fr" | "en"): string {
  const [y, m, d] = iso.split("-").map(Number);
  return lang === "en" ? `${d} ${MONTHS_EN[m - 1]} ${y}` : `${d === 1 ? "1er" : d} ${MONTHS_FR[m - 1]} ${y}`;
}

const OPENS_ON = "2027-02-01";

export const APPART = {
  key: APPART_KEY as AppartKey,
  gamme: "appart",
  /** Nom public (V7) — à sa première mention sur une page, toujours avec son descripteur. */
  name: PLACE_LABEL.lappart,
  descriptor: { fr: "colocation à Annemasse, quartier de la gare", en: "flatshare in Annemasse, near the station" },
  /** Signature des annonces et des réseaux (brief § 4) ; le site écrit « la colocation de La Villa Coliving ». */
  signature: { fr: "la coloc de La Villa Coliving", en: "La Villa Coliving's flatshare" },
  commune: "Annemasse",
  postalCode: "74100",
  /** Ouverture à la location (Q11, à confirmer) : une seule valeur, égale à `rooms.opens_on` en base (garde check:facts). */
  opensOn: OPENS_ON,
  opensOnLabel: { fr: fixedDateLabel(OPENS_ON, "fr"), en: fixedDateLabel(OPENS_ON, "en") },
  /** L'appartement (Q14 : 151 m², surface du diagnostic) : 5e et dernier étage, communs d'environ 90 m² dont un séjour-cuisine
   *  de 80 m² et un balcon de 8 m². */
  flat: { surfaceM2: 151, floor: 5, commonM2: 90, livingKitchenM2: 80, balconyM2: 8 },
  rooms: {
    total: 4,
    /** Numéros publics (Q10, à confirmer) : le n° 1 est réservé en base, jamais public. */
    numbers: [2, 3, 4, APPART_SUITE_ROOM_NUMBER],
    /** Trois chambres de 12 m² : une salle d'eau et un WC pour les trois. */
    standard: { numbers: [2, 3, 4], surfaceM2: 12, sharedBathBetween: 3, maxOccupants: 1 },
    /** La suite (n° 5, « Suite ») : salle d'eau et WC privés, balcon privatif, porte sur le palier, une ou deux personnes. */
    suite: { number: APPART_SUITE_ROOM_NUMBER, surfaceM2: 22, maxOccupants: APPART_SUITE_MAX_OCCUPANTS },
    surface: { min: 12, max: 22 },
    bedCm: 140,
  },
  price: {
    room: ROOM_TIER,
    suite: SUITE_TIER,
    /** « Dès » de la gamme L'Appart = le palier le plus bas ; jamais le prix par personne de la suite (P5). */
    from: ROOM_TIER.eur <= SUITE_TIER.eur ? ROOM_TIER : SUITE_TIER,
    /** Suite à deux : « 1 060 € par mois, soit 530 € par personne à deux » — jamais « dès 530 € » (P5). */
    suitePerPersonEur: APPART_CONTRACT_EUR.suite / APPART_SUITE_MAX_OCCUPANTS,
  },
  /** Ménage des parties communes : une fois par semaine (les maisons : trois). */
  cleaningPerWeek: 1,
  /** Classe énergie du diagnostic (surface du diagnostic = flat.surfaceM2) ; la date du diagnostic n'est pas publiée. */
  dpe: { class: "D" },
  /** « Photos à venir » pour les chambres (décision de Jérôme du 12/11/2026) : les cartes montrent une pièce commune. */
  roomPhotosPending: true,
  /**
   * Trajets : relevé du 12/11/2026, valeurs arrêtées par Jérôme. HORS de TRANSIT.byHouse : les fourchettes de la marque
   * (« 16 à 17 min selon la maison », « 20 min de Genève-Eaux-Vives ») décrivent les maisons. Minutes seulement (décision 27).
   * Temps de train depuis la gare d'Annemasse : ANNEMASSE_TRAIN_MIN (stats.ts), communs aux deux gammes.
   */
  transit: {
    measuredOn: "2026-11-12",
    measuredOnLabel: { fr: "12 novembre 2026", en: "12 November 2026" },
    stationWalkMin: 5,
    tramStop: { name: "Place Deffaugt", walkMin: 2, tramToRiveMin: 28 },
    eauxVivesDoorToDoorMin: 13,
    riveDoorToDoorMin: 22,
    cornavinDoorToDoorMin: 29,
    bikeToRiveMin: 28,
  },
} as const;

/** Incohérences internes détectables sans base (tools/test) ; la CI ajoutera la comparaison avec v_public_rooms (E2g). */
export function appartIssues(): string[] {
  const A = APPART;
  const issues: string[] = [];
  const numbers: readonly number[] = A.rooms.numbers;
  if (numbers.length !== A.rooms.total) issues.push(`numéros (${numbers.length}) ≠ total (${A.rooms.total})`);
  if (new Set(numbers).size !== numbers.length) issues.push("numéros en double");
  if (numbers.includes(1)) issues.push("le n° 1 est réservé en base : jamais public");
  if (!numbers.includes(A.rooms.suite.number)) issues.push("la suite n'est pas dans la liste des numéros");
  const standard: readonly number[] = A.rooms.standard.numbers;
  if ([...standard, A.rooms.suite.number].sort((a, b) => a - b).join() !== [...numbers].sort((a, b) => a - b).join()) issues.push("chambres + suite ≠ numéros");
  if (A.rooms.standard.sharedBathBetween !== standard.length) issues.push("la salle d'eau partagée l'est par toutes les chambres standard");
  if (A.rooms.surface.min !== Math.min(A.rooms.standard.surfaceM2, A.rooms.suite.surfaceM2)) issues.push("surface min ≠ plus petite chambre");
  if (A.rooms.surface.max !== Math.max(A.rooms.standard.surfaceM2, A.rooms.suite.surfaceM2)) issues.push("surface max ≠ plus grande chambre");
  if (A.price.from.eur !== Math.min(A.price.room.eur, A.price.suite.eur)) issues.push("« dès » ≠ palier le plus bas");
  if (A.price.from.chf >= 1000 || A.price.room.chf >= 1000 || A.price.suite.chf >= 1000) issues.push("un loyer de L'Appart ≥ 1 000 CHF : revoir les motifs bornés de la garde de gamme");
  if (A.price.suitePerPersonEur * A.rooms.suite.maxOccupants !== A.price.suite.eur) issues.push("prix par personne de la suite ≠ loyer / occupants");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(A.opensOn)) issues.push("date d'ouverture : AAAA-MM-JJ attendu");
  if (A.opensOnLabel.fr !== fixedDateLabel(A.opensOn, "fr") || A.opensOnLabel.en !== fixedDateLabel(A.opensOn, "en")) issues.push("libellé de la date ≠ opensOn");
  // Textes écrits en lettres (src/data/appartFacts.ts) : « une ou deux personnes », « une fois par semaine », « chaque semaine ».
  if (A.rooms.suite.maxOccupants !== 2) issues.push("la suite n'accueille plus 2 personnes : revoir « une ou deux personnes » (appartFacts.ts)");
  if (A.cleaningPerWeek !== 1) issues.push("le ménage n'est plus hebdomadaire : revoir « une fois par semaine » / « chaque semaine » (appartFacts.ts, allInclusive.ts)");
  const minutes: readonly number[] = [A.transit.stationWalkMin, A.transit.tramStop.walkMin, A.transit.tramStop.tramToRiveMin, A.transit.eauxVivesDoorToDoorMin, A.transit.riveDoorToDoorMin, A.transit.cornavinDoorToDoorMin, A.transit.bikeToRiveMin];
  if (minutes.includes(15)) issues.push("« 15 min » interdit (règle D1)");
  if (minutes.some((n) => !Number.isInteger(n) || n <= 0)) issues.push("une durée n'est pas un nombre entier de minutes");
  return issues;
}
