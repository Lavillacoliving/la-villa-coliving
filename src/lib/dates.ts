// Noms des mois FR / EN — source unique (availability.ts et /tarifs les réutilisent). Aucun import :
// ce module est testé directement sous Node (tools/test/dates.test.mjs).
export const MONTHS_FR = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];
export const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Dates longues du blog (Lot B du brief « Formulaire, hydratation, mesure », 01/10/2026).
// Avant : toLocaleDateString sans fuseau — le prérendu (CI en UTC) et l'appareil du lecteur pouvaient
// afficher deux jours différents (Asie-Pacifique ; ou mise à jour entre 22 h et minuit UTC), et l'ICU
// de Puppeteer peut différer de celui du navigateur (même règle que formatFreeDate, availability.ts).
// Ici : date calendaire de PARIS lue en parties numériques, mise en forme maison — sortie identique à
// l'ancienne (« 12 septembre 2026 », « September 12, 2026 »), quel que soit l'appareil.

const PARIS_PARTS = new Intl.DateTimeFormat("en-US", {
  timeZone: "Europe/Paris",
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

/** Date longue d'un horodatage ISO, calendrier de Paris ; "" si illisible. Pure. */
export function formatLongDate(iso: string, lang: "fr" | "en"): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  let year = 0;
  let month = 0;
  let day = 0;
  for (const part of PARIS_PARTS.formatToParts(d)) {
    if (part.type === "year") year = Number(part.value);
    else if (part.type === "month") month = Number(part.value);
    else if (part.type === "day") day = Number(part.value);
  }
  if (!year || month < 1 || month > 12 || !day) return "";
  return lang === "en"
    ? `${MONTHS_EN[month - 1]} ${day}, ${year}`
    : `${day} ${MONTHS_FR[month - 1]} ${year}`;
}

// Mois abrégés (13/10/2026, brief « conversion Ads » §2.1 et §2.2, option A validée par Jérôme) : pastille de date des
// cartes « Bientôt disponibles » (« Libre le 15 oct. ») et ligne « Prochaines entrées » de /chambres-disponibles.
export const MONTHS_SHORT_FR = [
  "janv.", "févr.", "mars", "avr.", "mai", "juin",
  "juil.", "août", "sept.", "oct.", "nov.", "déc.",
];
export const MONTHS_SHORT_EN = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * « 15 oct. » / « 15 Oct » à partir de « YYYY-MM-DD » (date de libération de v_public_rooms) ; "" si illisible.
 * Jour et mois liés par une espace insécable (U+00A0 : la date ne se coupe jamais en fin de ligne). Pur, sans Date :
 * même texte au prérendu et chez le lecteur (règle de formatFreeDate, availability.ts).
 */
export function formatShortDate(iso: string, lang: "fr" | "en"): string {
  const [, m, d] = String(iso).split("-");
  const monthIndex = Number(m) - 1;
  const day = Number(d);
  if (!Number.isInteger(day) || day < 1 || day > 31 || !Number.isInteger(monthIndex) || monthIndex < 0 || monthIndex > 11) return "";
  return lang === "en"
    ? `${day} ${MONTHS_SHORT_EN[monthIndex]}`
    : `${day === 1 ? "1er" : day} ${MONTHS_SHORT_FR[monthIndex]}`;
}
