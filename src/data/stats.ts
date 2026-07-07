// Source de vérité pour tous les chiffres affichés sur le site
// Modifier ici = mis à jour partout automatiquement

export const STATS = {
  totalResidents: 100,
  totalRooms: 29,
  totalHouses: 3,
  occupancyRate: 99,
  occupancyYears: 5,
  foundedYear: 2021,
  genevaCenterMinutes: 20, // arrondi de 15-25 min, porte à porte en CEVA/tram
  maxResidentsPerHouse: 12,
  minResidentsPerHouse: 7,
  priceChf: 1380,
  depositMonths: 2,
  leaseDurationMonths: 12,
  noticePeriodMonths: 1,
  roomSizeMin: 17,
  roomSizeMax: 23,
  cleaningPerWeek: 2,
  fiberSpeed: "8 Gb/s",
  includedItems: 20,
  rating: "4,9", // note interne ; graphie virgule en FR, point en EN (cf. ratingDisplay)
} as const;

// ── Prix public affiché ────────────────────────────────────────────────
// SEULE source du tarif : changer STATS.priceChf met à jour tout le site
// (hero, SEO, FAQ, pages maisons, blocs offre du blog…).
// Séparateurs déterministes (pas de toLocaleString : l'ICU peut différer
// entre le build Puppeteer du prérendu et le navigateur → hydration mismatch).
const thousands = (n: number, sep: string) =>
  String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep);

export const PRICE_FR_NUM = thousands(STATS.priceChf, " "); // « 1 380 » — U+00A0 insécable classique (la fine U+202F était quasi invisible → lisait « 1380 »)
export const PRICE_EN_NUM = thousands(STATS.priceChf, ",");      // « 1,380 »
export const PRICE_CHF_FR = `${PRICE_FR_NUM} CHF`;               // « 1 380 CHF »
export const PRICE_CHF_EN = `CHF ${PRICE_EN_NUM}`;               // « CHF 1,380 »

export function formatPriceChf(lang: "fr" | "en"): string {
  return lang === "en" ? PRICE_CHF_EN : PRICE_CHF_FR;
}

// ⚠️ DISPONIBILITÉ — SOURCE UNIQUE (Jérôme : mets à jour ces 3 nombres quand la dispo change).
// Tout en découle : compteur du hero, cartes de la home, badges des pages maisons,
// option du formulaire candidature. Avant, ces 4 endroits étaient codés en dur et se
// contredisaient (hero « 3 », cartes « Complet/1/Complet », badges « 1 » ×3, form « Plusieurs »).
export const AVAILABILITY = {
  lavilla: 1, // La Villa — Ville-la-Grand (10 chambres) — PROVISOIRE (Jérôme 15/06 : 1 partout)
  leloft: 1, // Le Loft — Ambilly (7 chambres) — PROVISOIRE
  lelodge: 1, // Le Lodge — Annemasse (12 chambres) — PROVISOIRE
} as const;

export type HouseKey = keyof typeof AVAILABILITY;

export const totalAvailable = (): number =>
  AVAILABILITY.lavilla + AVAILABILITY.leloft + AVAILABILITY.lelodge;

// Libellé de dispo d'une maison (« 1 chambre disponible » / « Complet »).
export function houseAvailabilityLabel(house: HouseKey, lang: "fr" | "en"): string {
  const n = AVAILABILITY[house];
  if (n <= 0) return lang === "en" ? "Fully booked" : "Complet";
  if (n === 1) return lang === "en" ? "1 room available" : "1 chambre disponible";
  return lang === "en" ? `${n} rooms available` : `${n} chambres disponibles`;
}

// Libellé global de dispo (hero / candidature), avec le mois pris à part par l'appelant.
export function totalAvailabilityLabel(lang: "fr" | "en"): string {
  const n = totalAvailable();
  if (n <= 0) return lang === "en" ? "Join the waitlist" : "Rejoins la liste d'attente";
  if (n === 1) return lang === "en" ? "1 room available" : "1 chambre disponible";
  return lang === "en" ? `${n} rooms available` : `${n} chambres disponibles`;
}

export const STATS_DISPLAY = {
  en: {
    residents: `${STATS.totalResidents}+ residents since ${STATS.foundedYear}`,
    houses: `${STATS.totalHouses} houses`,
    distance: `${STATS.genevaCenterMinutes} min from Geneva city center`,
    roomSize: `${STATS.roomSizeMin} to ${STATS.roomSizeMax} m² rooms`,
    price: `CHF ${STATS.priceChf.toLocaleString('en')}/month — all inclusive`,
    rating: STATS.rating.replace(",", "."), // 4.9 en EN
    ratingSourced: `${STATS.rating.replace(",", ".")}/5 — resident surveys`,
  },
  fr: {
    residents: `${STATS.totalResidents}+ résidents depuis ${STATS.foundedYear}`,
    houses: `${STATS.totalHouses} maisons`,
    distance: `${STATS.genevaCenterMinutes} min du centre de Genève`,
    roomSize: `Chambres de ${STATS.roomSizeMin} à ${STATS.roomSizeMax} m²`,
    price: `${STATS.priceChf.toLocaleString('fr-FR')} CHF/mois — tout inclus`,
    rating: STATS.rating, // 4,9 en FR (virgule)
    ratingSourced: `${STATS.rating}/5 — enquêtes résidents`,
  },
} as const;
