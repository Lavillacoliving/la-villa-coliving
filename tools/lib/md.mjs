// Helpers Markdown + formats français partagés par les outils SEO (tools/).
// Brief n°2 — Chantier 1 (21/08/2026). Zéro dépendance.

const NBSP = ' '; // espace insécable : « 1 234 », « 12,3 % »

/** Entier au format FR : 1234 → « 1 234 » (séparateur = espace insécable). */
export function fmtInt(n) {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return '—';
  const v = Math.round(Number(n));
  const sign = v < 0 ? '−' : '';
  const s = String(Math.abs(v));
  return sign + s.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
}

/** Décimal au format FR : 9.35 → « 9,35 » (digits décimales, défaut 1). */
export function fmtNum(n, digits = 1) {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return '—';
  const v = Number(n);
  const fixed = Math.abs(v).toFixed(digits);
  const [int, dec] = fixed.split('.');
  const intFr = int.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  const sign = v < 0 && Number(fixed) !== 0 ? '−' : '';
  return sign + (dec ? `${intFr},${dec}` : intFr);
}

/** Ratio 0-1 → pourcentage FR : 0.1493 → « 14,9 % ». */
export function fmtPct(ratio, digits = 1) {
  if (ratio === null || ratio === undefined || Number.isNaN(Number(ratio))) return '—';
  return `${fmtNum(100 * Number(ratio), digits)}${NBSP}%`;
}

/** Écart en points de pourcentage signé : 0.021 → « +2,1 pt », −0.013 → « −1,3 pt ». */
export function fmtPts(ratio, digits = 1) {
  if (ratio === null || ratio === undefined || Number.isNaN(Number(ratio))) return '—';
  const v = 100 * Number(ratio);
  const rounded = Number(v.toFixed(digits));
  const sign = rounded > 0 ? '+' : rounded < 0 ? '−' : '';
  return `${sign}${fmtNum(Math.abs(rounded), digits)}${NBSP}pt`;
}

/** Nombre signé FR (clics gagnables, etc.) : 12.4 → « +12,4 ». */
export function fmtSigned(n, digits = 1) {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return '—';
  const v = Number(n);
  const rounded = Number(v.toFixed(digits));
  const sign = rounded > 0 ? '+' : rounded < 0 ? '−' : '';
  return `${sign}${fmtNum(Math.abs(rounded), digits)}`;
}

/** Date ISO (AAAA-MM-JJ) → « JJ/MM/AAAA » ; tolère null. */
export function fmtDate(iso) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso ?? '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/** Échappe une cellule de tableau Markdown (pipes, retours ligne, chevrons). */
export function escapeCell(v) {
  return String(v ?? '')
    .replace(/\r?\n/g, ' ')
    .replace(/\|/g, '\\|')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Code inline sûr (une requête ou une URL peut contenir un backtick). */
export function code(v) {
  const s = String(v ?? '');
  if (!s) return '';
  return s.includes('`') ? `\`\` ${s} \`\`` : `\`${s}\``;
}

/**
 * Tableau Markdown. `align` : tableau optionnel de 'l' | 'r' | 'c' par colonne.
 * Aucune ligne → « _(aucune ligne)_ » (le rapport reste lisible).
 */
export function table(headers, rows, { align = null, empty = '_(aucune ligne)_' } = {}) {
  if (!rows || !rows.length) return empty;
  const sep = headers.map((_, i) => {
    const a = align ? align[i] : 'l';
    return a === 'r' ? '---:' : a === 'c' ? ':---:' : '---';
  });
  const line = cells => '| ' + cells.map(escapeCell).join(' | ') + ' |';
  return [line(headers), '|' + sep.join('|') + '|', ...rows.map(line)].join('\n');
}

/** Titre Markdown de niveau n. */
export function h(level, text) {
  return `${'#'.repeat(Math.max(1, Math.min(6, level)))} ${text}`;
}

/** Liste à puces. */
export function bullets(items) {
  return items.filter(x => x !== null && x !== undefined && x !== '').map(x => `- ${x}`).join('\n');
}

export { NBSP };
