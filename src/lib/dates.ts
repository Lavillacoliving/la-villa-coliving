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
