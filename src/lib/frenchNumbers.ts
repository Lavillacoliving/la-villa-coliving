// Nombres en lettres (français) — utilisé pour la durée du bail dans le contrat
// (aperçu HTML du créateur de bail + PDF). Couvre 0 à 999, orthographe
// traditionnelle (« vingt et un », « soixante-dix », « quatre-vingts »).

const UNITS = [
  'zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
  'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize',
  'dix-sept', 'dix-huit', 'dix-neuf',
];

const TENS: Record<number, string> = {
  20: 'vingt', 30: 'trente', 40: 'quarante', 50: 'cinquante', 60: 'soixante', 80: 'quatre-vingt',
};

function below100(n: number): string {
  if (n < 20) return UNITS[n];
  // 70-79 et 90-99 se construisent sur 60 et 80 (soixante-dix, quatre-vingt-onze…)
  const base = n >= 80 ? 80 : n >= 70 ? 60 : Math.floor(n / 10) * 10;
  const rest = n - base;
  const tens = TENS[base];
  if (rest === 0) return base === 80 ? 'quatre-vingts' : tens;
  // « et » devant un/onze (vingt et un, soixante et onze) sauf après quatre-vingt
  if ((rest === 1 || rest === 11) && base !== 80) return `${tens} et ${UNITS[rest]}`;
  return `${tens}-${UNITS[rest]}`;
}

/**
 * Convertit un entier (0-999) en lettres. Hors plage ou non entier : renvoie
 * le nombre en chiffres, pour ne jamais casser un contrat.
 */
export function numberInWordsFr(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > 999) return String(n);
  if (n < 100) return below100(n);
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  const head = hundreds === 1 ? 'cent' : `${UNITS[hundreds]} cent`;
  if (rest === 0) return hundreds === 1 ? 'cent' : `${head}s`;
  return `${head} ${below100(rest)}`;
}
