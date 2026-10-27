/** Formats partagés du bail v3 (PDF et aperçu). Espaces insécables : la police Helvetica du PDF les rend correctement. */
const NBSP = " ";

export function groupThousands(n: number): string {
  const [int, dec] = Math.abs(n).toFixed(dec2(n)).split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  return (n < 0 ? "-" : "") + grouped + (dec ? "," + dec : "");
}
function dec2(n: number): 0 | 2 {
  return Math.abs(n - Math.round(n)) < 0.005 ? 0 : 2;
}
export function fEUR(n: number): string {
  return groupThousands(n) + NBSP + "€";
}
export function fCHF(n: number): string {
  return groupThousands(Math.round(n)) + NBSP + "CHF";
}
export function fRate(rate: number): string {
  return rate.toFixed(4).replace(".", ",");
}

const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
export function fDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d === 1 ? "1er" : d} ${MONTHS[m - 1]} ${y}`;
}
export function monthLabel(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}
export function addMonths(iso: string, months: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1 + months, d));
  return dt.toISOString().slice(0, 10);
}
export function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}
export function roman(n: number): string {
  const map: Array<[number, string]> = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let r = "";
  for (const [v, s] of map) while (n >= v) { r += s; n -= v; }
  return r;
}
