// Source de vérité pour tous les chiffres affichés sur le site
// Modifier ici = mis à jour partout automatiquement

// ── Prix maître : l'EURO. Le CHF affiché en est DÉRIVÉ. ────────────────
// Décision Jérôme 13/08/2026 : les prix CHF du site ne sont plus une constante
// indépendante mais la conversion des prix contractuels en euros, au taux BCE
// d'une date choisie et figée, arrondie à la dizaine INFÉRIEURE (le CHF affiché
// n'excède jamais la conversion réelle). Avec le taux ci-dessous :
//   1 530 € × 0,9366 = 1 433,00 → 1 430 CHF ; 1 470 € × 0,9366 = 1 376,80 → 1 370 CHF
// ⚠️ Actualiser le taux change les prix publics ET doit entraîner la mise à jour
// des littéraux du blog/knowledge_base (cf. SQL de bascule du 31/08).
export const TAUX_BCE = {
  eurChf: 0.9366,
  dateFr: "12 août 2026",
  dateEn: "12 August 2026",
} as const;

/** Loyer contractuel en euros (prix maître depuis le 01/09/2026).
 *  Phase B (post-01/09) : ces valeurs seront servies par la table pricing_current. */
export const CONTRACT_EUR = { standard: 1530, sharedBath: 1470, rateLabelFr: "août 2026", rateLabelEn: "August 2026" } as const; // 1 530/1 470 € (Jérôme 13/08)

// Conversion affichée : euro × taux BCE figé, arrondi à la dizaine inférieure.
const chfAffiche = (eur: number): number => Math.floor((eur * TAUX_BCE.eurChf) / 10) * 10;

// (Lot S1, 05/09/2026) Chambres par maison — source unique (= v_public_rooms, gardée par
// scripts/check-entity-facts.mjs) ; STATS.totalRooms en est la SOMME, plus une saisie.
export const ROOMS_BY_HOUSE = { lavilla: 10, leloft: 7, lelodge: 12 } as const;
const TOTAL_ROOMS: number = ROOMS_BY_HOUSE.lavilla + ROOMS_BY_HOUSE.leloft + ROOMS_BY_HOUSE.lelodge; // 29

export const STATS = {
  totalResidents: 100,
  totalRooms: TOTAL_ROOMS,
  totalHouses: 3,
  occupancyRate: 99,
  occupancyYears: 5,
  foundedYear: 2021,
  genevaCenterMinutes: 20, // arrondi de 15-25 min, porte à porte en CEVA/tram
  maxResidentsPerHouse: 12,
  minResidentsPerHouse: 7,
  priceChf: chfAffiche(CONTRACT_EUR.standard), // 1 430 — dérivé, ne plus saisir en dur
  depositMonths: 2,
  leaseDurationMonths: 12,
  // (Lot S1, D5 Jérôme 04/09/2026) « Bail de 12 mois. Engagement minimum de 3 mois, puis tu es
  // libre avec 1 mois de préavis. » — phrase canonique dans src/data/entityFacts.ts.
  leaseMinimumMonths: 3,
  noticePeriodMonths: 1,
  responseHours: 48, // « réponse sous 48 h » — promesse du formulaire et de l'auto-réponse
  // (Lot 7, 04/09/2026) Décision Jérôme Q1 : surfaces lues dans `rooms` (v_public_rooms : min 15,5 → 16, max 24,0 m²).
  // Garde CI : house-pages-check.mjs compare ces bornes au min/max de v_public_rooms.surface_m2.
  roomSizeMin: 16,
  // (Lot 6 SEO funnel, 04/09/2026) Fact block CLAUDE.md §1 : séjour moyen et espace de vie par colocataire.
  averageStayMonths: 13,
  livingSpacePerResidentMin: 37,
  livingSpacePerResidentMax: 42,
  roomSizeMax: 24,
  cleaningPerWeek: 3, // 3×/semaine dans les 3 maisons depuis le 01/09/2026 (vote des résidents).
  // Consommée par /tarifs et par la fiche entité (src/data/entityFacts.ts) ; les autres mentions
  // de fréquence restent des littéraux — remplacement progressif (Lot S2).
  fiberSpeed: "8 Gb/s",
  // Nombre de services affichés dans la grille « Ce Qui Est Vraiment Inclus » de /tarifs.
  // ⚠️ Maintenu à la main jusqu'à la mise en base (septembre) : doit TOUJOURS égaler le nombre
  // d'items réellement listés sur /tarifs (24 depuis le retrait du panier repas au 01/09/2026).
  includedItems: 24,
  rating: "4,9", // note interne ; graphie virgule en FR, point en EN (cf. ratingDisplay)
} as const;

// ── Prix public affiché ────────────────────────────────────────────────
// Le tarif se change en modifiant CONTRACT_EUR (et/ou TAUX_BCE) en tête de
// fichier : le CHF suit par dérivation et tout le site se met à jour
// (hero, SEO, FAQ, pages maisons, blocs offre du blog…).
// Deux niveaux depuis le 01/09/2026 : 1 430 CHF (salle d'eau privative, 25 ch.)
// et 1 370 CHF (les 4 chambres de La Villa à salle d'eau partagée entre 2 chambres,
// entretien par l'équipe de ménage inclus). Le Loft / Le Lodge : 100 % privatif.
// Séparateurs déterministes (pas de toLocaleString : l'ICU peut différer
// entre le build Puppeteer du prérendu et le navigateur → hydration mismatch).
// Exporté : les cartes chambres formatent des loyers PAR CHAMBRE (RoomCard, v_public_rooms),
// qui peuvent différer de STATS.priceChf — elle doit le faire avec le même séparateur.
export const thousands = (n: number, sep: string) =>
  String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep);

export const PRICE_FR_NUM = thousands(STATS.priceChf, " "); // « 1 430 » — U+00A0 insécable classique (la fine U+202F était quasi invisible → le nombre se lisait collé)
export const PRICE_EN_NUM = thousands(STATS.priceChf, ",");      // « 1,430 »
export const PRICE_CHF_FR = `${PRICE_FR_NUM} CHF`;               // « 1 430 CHF »
export const PRICE_CHF_EN = `CHF ${PRICE_EN_NUM}`;               // « CHF 1,430 »

// Second niveau — les 4 chambres de La Villa à salle d'eau partagée (entre 2 chambres).
export const STATS_SHARED_BATH = { priceChf: chfAffiche(CONTRACT_EUR.sharedBath), rooms: 4, house: "La Villa" } as const; // 1 370 — dérivé
export const PRICE_SHARED_FR_NUM = thousands(STATS_SHARED_BATH.priceChf, " "); // « 1 370 »
export const PRICE_SHARED_EN_NUM = thousands(STATS_SHARED_BATH.priceChf, ","); // « 1,370 »
export const PRICE_SHARED_CHF_FR = `${PRICE_SHARED_FR_NUM} CHF`;               // « 1 370 CHF »
export const PRICE_SHARED_CHF_EN = `CHF ${PRICE_SHARED_EN_NUM}`;               // « CHF 1,370 »

export const EUR_STANDARD_FR_NUM = thousands(CONTRACT_EUR.standard, " "); // « 1 530 »
export const EUR_SHARED_FR_NUM = thousands(CONTRACT_EUR.sharedBath, " ");   // « 1 470 »
export const EUR_STANDARD_EN_NUM = thousands(CONTRACT_EUR.standard, ",");      // « 1,530 »
export const EUR_SHARED_EN_NUM = thousands(CONTRACT_EUR.sharedBath, ",");      // « 1,470 »

export function formatPriceChf(lang: "fr" | "en"): string {
  return lang === "en" ? PRICE_CHF_EN : PRICE_CHF_FR;
}

// ⚠️ DISPONIBILITÉ — PLUS ICI (18/08/2026). L'ancienne constante `AVAILABILITY`,
// tenue à la main, était restée aux valeurs provisoires du 15/06 (1/1/1) et rendait
// 2 badges maisons sur 3 faux en prod. Source unique désormais : la vue Supabase
// `v_public_rooms`, via `src/lib/availability.ts` (useRoomAvailability).
// RÈGLE PERMANENTE : ne jamais réintroduire un chiffre de dispo en dur.

export const STATS_DISPLAY = {
  en: {
    residents: `${STATS.totalResidents}+ residents since ${STATS.foundedYear}`,
    houses: `${STATS.totalHouses} houses`,
    distance: `${STATS.genevaCenterMinutes} min from Geneva city center`,
    roomSize: `${STATS.roomSizeMin} to ${STATS.roomSizeMax} m² rooms`,
    price: `${PRICE_CHF_EN}/month — all inclusive`, // (03/09) plus de toLocaleString : même graphie que le reste du site
    rating: STATS.rating.replace(",", "."), // 4.9 en EN
    ratingSourced: `${STATS.rating.replace(",", ".")}/5 — resident surveys`,
  },
  fr: {
    residents: `${STATS.totalResidents}+ résidents depuis ${STATS.foundedYear}`,
    houses: `${STATS.totalHouses} maisons`,
    distance: `${STATS.genevaCenterMinutes} min du centre de Genève`,
    roomSize: `Chambres de ${STATS.roomSizeMin} à ${STATS.roomSizeMax} m²`,
    price: `${PRICE_CHF_FR}/mois — tout inclus`,
    rating: STATS.rating, // 4,9 en FR (virgule)
    ratingSourced: `${STATS.rating}/5 — enquêtes résidents`,
  },
} as const;
