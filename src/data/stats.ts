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
// Exporté : la LP payante formate des loyers PAR CHAMBRE (src/data/roomsSeptembre.ts),
// qui peuvent différer de STATS.priceChf — elle doit le faire avec le même séparateur.
export const thousands = (n: number, sep: string) =>
  String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep);

export const PRICE_FR_NUM = thousands(STATS.priceChf, " "); // « 1 380 » — U+00A0 insécable classique (la fine U+202F était quasi invisible → lisait « 1380 »)
export const PRICE_EN_NUM = thousands(STATS.priceChf, ",");      // « 1,380 »
export const PRICE_CHF_FR = `${PRICE_FR_NUM} CHF`;               // « 1 380 CHF »
export const PRICE_CHF_EN = `CHF ${PRICE_EN_NUM}`;               // « CHF 1,380 »

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
