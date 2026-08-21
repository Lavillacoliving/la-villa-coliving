// Lecture des données Search Console : exports UI (CSV) et réponses API (JSON, sonde n8n).
// Brief n°2 — Chantier 1 (21/08/2026). Zéro dépendance (node:fs/promises, node:path).
//
// Deux entrées, un seul format de sortie : des lignes { query?, page?, country?, clicks,
// impressions, ctr (ratio 0-1), position } prêtes pour tools/lib/ctr-curve.mjs.
import fs from 'node:fs/promises';
import path from 'node:path';
import { SITE, COUNTRY_LABEL_TO_SEGMENT, COUNTRY_ISO_TO_SEGMENT } from './gsc-config.mjs';

// ─── CSV (RFC 4180 : guillemets, "" échappé, retours ligne dans les champs, CRLF, BOM) ───

/** Texte CSV → tableau de lignes (tableaux de cellules). Séparateur virgule. */
export function parseCsv(text) {
  let s = String(text ?? '');
  if (s.charCodeAt(0) === 0xFEFF) s = s.slice(1); // BOM UTF-8
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') { field += '"'; i++; } else inQuotes = false;
      } else field += c;
      continue;
    }
    if (c === '"') { inQuotes = true; continue; }
    if (c === ',') { row.push(field); field = ''; continue; }
    if (c === '\r') continue;
    if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; continue; }
    field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => !(r.length === 1 && r[0].trim() === ''));
}

/** « 14.93% » → 0.1493 ; « 14,93 % » → 0.1493 ; « 0.1493 » → 0.1493 ; vide → 0. */
export function parsePct(v) {
  const s = String(v ?? '').replace(/\s/g, '');
  if (!s) return 0;
  const f = parseFloat(s.replace('%', '').replace(',', '.'));
  if (Number.isNaN(f)) return 0;
  return s.endsWith('%') ? Math.round(f * 1e8) / 1e10 : f; // arrondi : évite 0.43479999999999996
}

/** « 9.35 » / « 9,35 » / « 1234 » → nombre ; vide ou invalide → 0. */
export function parseNum(v) {
  const f = parseFloat(String(v ?? '').replace(/\s/g, '').replace(',', '.'));
  return Number.isNaN(f) ? 0 : f;
}

const norm = s => String(s ?? '').normalize('NFC').replace(/\s+/g, ' ').trim().toLowerCase();

const KIND_PATTERNS = [
  [/^(top pages|pages les plus populaires)$/, 'pages'],
  [/^(top queries|requêtes les plus fréquentes|requetes les plus frequentes)$/, 'queries'],
  [/^(country|pays)$/, 'countries'],
  [/^(date|date range|plage de dates|période|periode)$/, 'dates'], // « Date Range » = graphique agrégé par semaine
  [/^(device|appareil)$/, 'devices'],
  [/^(filter|filtre)$/, 'filters'],
  [/^(search appearance|apparence dans les résultats de recherche)$/, 'appearance'],
];

/** Type d'un export d'après la 1ʳᵉ cellule de l'en-tête. */
export function detectCsvKind(header) {
  const first = norm(Array.isArray(header) ? header[0] : header);
  for (const [re, kind] of KIND_PATTERNS) if (re.test(first)) return kind;
  return 'unknown';
}

// ─── En-têtes de métriques (simple 5 colonnes, ou comparaison 9 colonnes) ───

const US_RANGE_RE = /(\d{1,2})\/(\d{1,2})\/(\d{2,4})\s*[-–]\s*(\d{1,2})\/(\d{1,2})\/(\d{2,4})/;
const METRIC_RES = {
  clicks: /^(clicks|clics)$/,
  impressions: /^impressions$/,
  ctr: /^ctr$/,
  position: /^position$/,
};
const pad2 = n => String(n).padStart(2, '0');
const yyyy = y => (String(y).length === 2 ? `20${y}` : String(y));

/** « 6/1/26 - 6/13/26 » → { start: '2026-06-01', end: '2026-06-13', label }. */
export function parseUsRange(label) {
  const m = US_RANGE_RE.exec(String(label ?? ''));
  if (!m) return null;
  return {
    label: m[0].replace(/\s*[-–]\s*/, ' - '),
    start: `${yyyy(m[3])}-${pad2(m[1])}-${pad2(m[2])}`,
    end: `${yyyy(m[6])}-${pad2(m[4])}-${pad2(m[5])}`,
  };
}

function metricOf(cell) {
  const c = norm(cell);
  for (const [k, re] of Object.entries(METRIC_RES)) if (re.test(c)) return k;
  return null;
}

/**
 * Analyse l'en-tête d'un Pages.csv / Queries.csv.
 * Simple  → { comparison:false, cols:{clicks,impressions,ctr,position} }
 * Comparé → { comparison:true, periods:[{label,start,end,cols}] } (tri par date de fin croissante)
 */
export function analyzeHeader(header) {
  const cells = (header || []).map(c => String(c ?? '').replace(/^\uFEFF/, ''));
  const hasRange = cells.length > 5 && cells.slice(1).some(c => US_RANGE_RE.test(c));
  if (!hasRange) {
    const cols = {};
    cells.forEach((c, i) => { if (i === 0) return; const m = metricOf(c); if (m && cols[m] === undefined) cols[m] = i; });
    return { comparison: false, cols, periods: [] };
  }
  const byLabel = new Map();
  cells.forEach((c, i) => {
    if (i === 0) return;
    const r = parseUsRange(c);
    if (!r) return;
    const metric = metricOf(c.replace(US_RANGE_RE, '').trim());
    if (!metric) return;
    if (!byLabel.has(r.label)) byLabel.set(r.label, { ...r, cols: {} });
    byLabel.get(r.label).cols[metric] = i;
  });
  const periods = [...byLabel.values()].sort((a, b) => a.end.localeCompare(b.end) || a.start.localeCompare(b.start));
  return { comparison: true, cols: null, periods };
}

/** Choisit la période d'un export comparé : 'latest' (date de fin la plus grande) ou 'previous'. */
export function choosePeriod(periods, which = 'latest') {
  if (!periods || !periods.length) return null;
  return which === 'previous' ? periods[0] : periods[periods.length - 1];
}

/**
 * Parse un Pages.csv / Queries.csv (simple ou comparé) en lignes { key, clicks, impressions, ctr, position }.
 * Les lignes à 0 impression (période comparée vide) sont écartées et comptées dans `dropped`.
 */
export function parseMetricsCsv(text, { period = 'latest' } = {}) {
  const rows = parseCsv(text);
  if (!rows.length) return { kind: 'unknown', header: [], comparison: false, periods: [], chosen: null, rows: [], dropped: 0 };
  const header = rows[0];
  const kind = detectCsvKind(header);
  const ana = analyzeHeader(header);
  const chosen = ana.comparison ? choosePeriod(ana.periods, period) : null;
  const cols = ana.comparison ? chosen?.cols : ana.cols;
  if (!cols || cols.clicks === undefined || cols.impressions === undefined || cols.position === undefined) {
    throw new Error(`En-tête CSV non reconnu (colonnes Clicks/Impressions/CTR/Position introuvables) : « ${header.join(',').slice(0, 120)} »`);
  }
  const out = [];
  let dropped = 0;
  for (const r of rows.slice(1)) {
    const key = String(r[0] ?? '').trim();
    if (!key) continue;
    const clicks = parseNum(r[cols.clicks]);
    const impressions = parseNum(r[cols.impressions]);
    const position = parseNum(r[cols.position]);
    const ctr = cols.ctr !== undefined ? parsePct(r[cols.ctr]) : (impressions ? clicks / impressions : 0);
    if (impressions <= 0) { dropped++; continue; }
    out.push({ key, clicks, impressions, ctr, position });
  }
  return { kind, header, comparison: ana.comparison, periods: ana.periods, chosen, rows: out, dropped };
}

// ─── Filters.csv / Filtres.csv ───

const FILTER_KEYS = [
  [/^(search type|type de recherche)$/, 'searchType'],
  [/^date$/, 'dateLabel'],
  [/^(country|pays)$/, 'country'],
  [/^(query|queries|requête|requete|requêtes|requetes)$/, 'query'],
  [/^page$/, 'page'],
  [/^(device|appareil)$/, 'device'],
  [/^(search appearance|apparence dans les résultats de recherche)$/, 'appearance'],
];

/** Parse le fichier de filtres (2 colonnes Filter,Value / Filtre,Valeur). */
export function parseFiltersCsv(text) {
  const rows = parseCsv(text);
  const out = { searchType: null, dateLabel: null, country: null, query: null, page: null, device: null, appearance: null, raw: [] };
  for (const r of rows.slice(1)) {
    const k = norm(r[0]);
    const v = String(r[1] ?? '').trim();
    if (!k) continue;
    out.raw.push([String(r[0]).trim(), v]);
    for (const [re, field] of FILTER_KEYS) if (re.test(k)) { out[field] = v; break; }
  }
  return out;
}

// ─── Dates ───

const MONTHS = {
  jan: 1, janv: 1, janvier: 1, feb: 2, fév: 2, fev: 2, févr: 2, fevr: 2, février: 2, fevrier: 2,
  mar: 3, mars: 3, apr: 4, avr: 4, avril: 4, may: 5, mai: 5, jun: 6, juin: 6, jul: 7, juil: 7, juillet: 7,
  aug: 8, août: 8, aout: 8, sep: 9, sept: 9, septembre: 9, oct: 10, octobre: 10, nov: 11, novembre: 11,
  dec: 12, déc: 12, décembre: 12, decembre: 12,
};
const monthNum = s => MONTHS[norm(s).replace(/\.$/, '')] ?? null;

/**
 * Valeur du filtre Date → { start, end, relative, label }.
 * Explicite : « Jun 1, 2026-Jun 13, 2026 », « 1 juin 2026 - 13 juin 2026 », « 2026-06-01 - 2026-06-13 ».
 * Relatif (« Last 3 months », « Les 28 derniers jours ») : start/end null, relative=true.
 */
export function parseDateLabel(label) {
  const s = String(label ?? '').trim();
  const res = { label: s || null, start: null, end: null, relative: false };
  if (!s) return res;
  let m = /^(\d{4}-\d{2}-\d{2})\s*[-–]\s*(\d{4}-\d{2}-\d{2})$/.exec(s);
  if (m) return { ...res, start: m[1], end: m[2] };
  m = /^([A-Za-zéû.]+)\s+(\d{1,2}),?\s+(\d{4})\s*[-–]\s*([A-Za-zéû.]+)\s+(\d{1,2}),?\s+(\d{4})$/.exec(s);
  if (m) {
    const m1 = monthNum(m[1]); const m2 = monthNum(m[4]);
    if (m1 && m2) return { ...res, start: `${m[3]}-${pad2(m1)}-${pad2(m[2])}`, end: `${m[6]}-${pad2(m2)}-${pad2(m[5])}` };
  }
  m = /^(\d{1,2})\s+([A-Za-zéû.]+)\s+(\d{4})\s*[-–]\s*(\d{1,2})\s+([A-Za-zéû.]+)\s+(\d{4})$/.exec(s);
  if (m) {
    const m1 = monthNum(m[2]); const m2 = monthNum(m[5]);
    if (m1 && m2) return { ...res, start: `${m[3]}-${pad2(m1)}-${pad2(m[1])}`, end: `${m[6]}-${pad2(m2)}-${pad2(m[4])}` };
  }
  const us = parseUsRange(s);
  if (us) return { ...res, start: us.start, end: us.end };
  return { ...res, relative: true };
}

/** Lignes d'un Chart.csv / Graphique.csv → { start, end } (dates AAAA-MM-JJ, ou plages « AAAA-MM-JJ - AAAA-MM-JJ »). */
export function dateRangeOfChart(rows) {
  let start = null; let end = null;
  for (const r of (rows || []).slice(1)) {
    const dates = String(r[0] ?? '').match(/\d{4}-\d{2}-\d{2}/g);
    if (!dates) continue;
    for (const d of dates) { if (!start || d < start) start = d; if (!end || d > end) end = d; }
  }
  return start ? { start, end } : null;
}

/** AAAA-MM d'une date ISO. */
export const monthOf = iso => (iso && /^\d{4}-\d{2}/.test(iso) ? iso.slice(0, 7) : null);

// ─── Normalisation ───

const SITE_HOST_RE = new RegExp(`^https?://(www\\.)?${SITE.replace(/^https?:\/\/(www\.)?/, '').replace(/\./g, '\\.')}`, 'i');

/** URL de page → chemin sans origine du site (« https://www.lavillacoliving.com/en/tarifs/ » → « /en/tarifs »). */
export function normalizePage(url) {
  let s = String(url ?? '').trim();
  if (!s) return '/';
  if (SITE_HOST_RE.test(s)) s = s.replace(SITE_HOST_RE, '');
  else if (/^https?:\/\//i.test(s)) return s; // autre hôte : conservé tel quel (signalé par l'appelant si besoin)
  s = s.replace(/#.*$/, '');
  if (!s.startsWith('/')) s = '/' + s;
  if (s.length > 1) s = s.replace(/\/+(\?|$)/, '$1');
  return s || '/';
}

/** Langue d'un chemin : préfixe /en → 'en', sinon 'fr'. */
export const langOfPage = p => (p === '/en' || String(p).startsWith('/en/') ? 'en' : 'fr');

/** Requête : minuscules, espaces normalisés, NFC. */
export const normalizeQuery = q => norm(q);

/** Compile la regex de marque (chaîne CLI ou RegExp) sans drapeau global (évite lastIndex). */
export function compileBrandRe(src) {
  if (src instanceof RegExp) {
    const flags = src.flags.replace(/[gy]/g, '');
    return new RegExp(src.source, flags.includes('i') ? flags : flags + 'i');
  }
  let s = String(src ?? '').trim();
  const m = /^\/(.*)\/([a-z]*)$/.exec(s);
  if (m) s = m[1];
  try { return new RegExp(s, 'i'); } catch (e) { throw new Error(`Regex de marque invalide (--brand) : ${s} — ${e.message}`); }
}

/** Libellé pays d'un filtre UI → segment ('fr' | 'ch' | 'global'). */
export const segmentOfCountryLabel = label => COUNTRY_LABEL_TO_SEGMENT[norm(label)] ?? 'global';

/** Code ISO alpha-3 (sonde) → groupe ('fr' | 'ch' | 'autres'). */
export const segmentOfIso = code => COUNTRY_ISO_TO_SEGMENT[norm(code)] ?? 'autres';

// ─── Dossier d'export UI → source ───

/**
 * Lit un dossier d'export Search Console (Pages/Queries/Filters/Chart…) et renvoie une « source » :
 * { mode:'csv', dir, label, files:[{file,kind,rows}], filters, segment, country, queryFilter,
 *   window:{start,end,label,source}, comparison:{periods,chosen,period}|null, queryRows, pageRows, warnings }
 */
export async function loadCsvDir(dir, { period = 'latest' } = {}) {
  const abs = path.resolve(String(dir));
  let entries;
  try { entries = await fs.readdir(abs); } catch { throw new Error(`Dossier introuvable ou illisible : ${abs}`); }
  const csvs = entries.filter(f => f.toLowerCase().endsWith('.csv')).sort((a, b) => a.localeCompare(b, 'fr'));
  if (!csvs.length) throw new Error(`Aucun fichier .csv dans ${abs} (déposer le contenu dézippé de l'export Search Console)`);

  const src = {
    mode: 'csv', dir: abs, label: path.basename(abs), files: [], filters: null,
    segment: 'global', country: null, queryFilter: null,
    window: { start: null, end: null, label: null, source: null },
    comparison: null, queryRows: [], pageRows: [], warnings: [],
  };
  let chartRange = null;
  let chartTotals = null;
  let countryTotals = null;
  const totalsOf = text => {
    try { const m = parseMetricsCsv(text, { period }); return { clicks: m.rows.reduce((s, r) => s + r.clicks, 0), impressions: m.rows.reduce((s, r) => s + r.impressions, 0) }; } catch { return null; }
  };
  for (const f of csvs) {
    const text = await fs.readFile(path.join(abs, f), 'utf-8');
    const rows = parseCsv(text);
    const kind = detectCsvKind(rows[0] || []);
    const entry = { file: f, kind, rows: Math.max(0, rows.length - 1) };
    src.files.push(entry);
    if (kind === 'filters') { src.filters = parseFiltersCsv(text); continue; }
    if (kind === 'dates') { chartRange = dateRangeOfChart(rows); chartTotals = totalsOf(text); continue; }
    if (kind === 'countries') { countryTotals = totalsOf(text); continue; }
    if (kind !== 'pages' && kind !== 'queries') { entry.ignored = true; continue; }
    const m = parseMetricsCsv(text, { period });
    entry.rows = m.rows.length;
    entry.dropped = m.dropped;
    if (m.comparison) {
      const c = { periods: m.periods, chosen: m.chosen, period };
      if (src.comparison && src.comparison.chosen?.label !== c.chosen?.label) src.warnings.push(`Périodes de comparaison différentes entre ${f} et un autre fichier du dossier.`);
      src.comparison = src.comparison || c;
    }
    if (kind === 'pages') {
      src.pageRows = m.rows.map(r => { const page = normalizePage(r.key); return { page, pageRaw: r.key, lang: langOfPage(page), clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position }; });
    } else {
      src.queryRows = m.rows.map(r => ({ query: normalizeQuery(r.key), queryRaw: r.key, clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position }));
    }
  }
  src.totals = countryTotals || chartTotals || null; // total du site (ou du segment) pour la note d'anonymisation
  if (!src.queryRows.length && !src.pageRows.length) {
    throw new Error(`Aucun Pages.csv / Queries.csv reconnu dans ${abs} (en-tête attendu : « Top pages », « Top queries », « Pages les plus populaires » ou « Requêtes les plus fréquentes »).`);
  }
  if (!src.queryRows.length) src.warnings.push('Pas de fichier requêtes (Queries.csv / Requêtes.csv) : courbe CTR et striking distance impossibles pour ce dossier.');
  if (!src.pageRows.length) src.warnings.push('Pas de fichier pages (Pages.csv) : section « pages sous la courbe » vide pour ce dossier.');
  if (!src.filters) src.warnings.push('Pas de Filters.csv / Filtres.csv : segment supposé global, fenêtre déduite du graphique si présent.');

  if (src.filters) {
    src.country = src.filters.country;
    src.segment = segmentOfCountryLabel(src.filters.country);
    src.queryFilter = src.filters.query ? normalizeQuery(src.filters.query) : null;
    if (src.filters.page) src.warnings.push(`Filtre Page actif (« ${src.filters.page} ») : données partielles, à interpréter avec prudence.`);
    if (src.filters.searchType && !/^(web|recherche web)$/i.test(src.filters.searchType)) src.warnings.push(`Type de recherche « ${src.filters.searchType} » (pas « Web »).`);
  }
  const explicit = parseDateLabel(src.filters?.dateLabel);
  src.window.label = explicit.label;
  if (src.comparison?.chosen) {
    src.window = { start: src.comparison.chosen.start, end: src.comparison.chosen.end, label: `${src.comparison.chosen.label} (période ${period === 'previous' ? 'précédente' : 'la plus récente'} de la comparaison)`, source: 'comparaison' };
  } else if (explicit.start) {
    src.window = { start: explicit.start, end: explicit.end, label: explicit.label, source: 'filtre' };
  } else if (chartRange) {
    src.window = { start: chartRange.start, end: chartRange.end, label: explicit.label, source: 'graphique' };
  } else {
    src.window.source = null;
    src.warnings.push('Fenêtre de dates inconnue (filtre relatif sans Chart.csv) : indiquer --month si besoin.');
  }
  return src;
}

// ─── JSON (réponses Search Analytics API, sonde n8n) ───

/**
 * Extrait les lignes GSC d'un JSON quelle que soit sa forme :
 * {rows:[…]} | [{rows:[…]}] | [{json:{rows:[…]}}] | [{keys:[…],clicks,…}] | {json:{rows}} | {data:{rows}}
 */
export function rowsOfJson(data) {
  if (!data) return [];
  if (Array.isArray(data)) {
    if (data.length && data.every(x => x && typeof x === 'object' && Array.isArray(x.keys))) return data;
    const out = [];
    for (const x of data) {
      if (!x || typeof x !== 'object') continue;
      if (Array.isArray(x.rows)) out.push(...x.rows);
      else if (Array.isArray(x.keys)) out.push(x);
      else if (x.json !== undefined) out.push(...rowsOfJson(x.json));
      else if (x.data !== undefined) out.push(...rowsOfJson(x.data));
    }
    return out;
  }
  if (typeof data === 'object') {
    if (Array.isArray(data.rows)) return data.rows;
    if (Array.isArray(data.keys)) return [data];
    if (data.json !== undefined) return rowsOfJson(data.json);
    if (data.data !== undefined) return rowsOfJson(data.data);
  }
  return [];
}

const DIM_NAMES = new Set(['page', 'query', 'country', 'date', 'device', 'searchAppearance']);

/**
 * Infère la dimension de chaque position de `keys` PAR VALEUR :
 * http… → page ; /^[a-z]{3}$/ → country ; AAAA-MM-JJ → date ; MOBILE|DESKTOP|TABLET → device ; sinon query.
 * `override` (tableau de noms, ex. ['page','query','country']) force l'ordre.
 */
export function inferDims(rows, override = null) {
  if (override) {
    const dims = (Array.isArray(override) ? override : String(override).split(',')).map(s => s.trim()).filter(Boolean);
    const bad = dims.filter(d => !DIM_NAMES.has(d));
    if (bad.length) throw new Error(`--dims : dimension(s) inconnue(s) « ${bad.join(', ')} » (attendu : ${[...DIM_NAMES].join(', ')}).`);
    return dims;
  }
  const width = rows.reduce((m, r) => Math.max(m, Array.isArray(r.keys) ? r.keys.length : 0), 0);
  const dims = [];
  for (let i = 0; i < width; i++) {
    const vals = rows.map(r => r.keys?.[i]).filter(v => v !== undefined && v !== null && String(v) !== '').map(String);
    const all = re => vals.length > 0 && vals.every(v => re.test(v));
    if (all(/^https?:\/\//i)) dims.push('page');
    else if (all(/^[a-z]{3}$/)) dims.push('country');
    else if (all(/^\d{4}-\d{2}-\d{2}$/)) dims.push('date');
    else if (all(/^(MOBILE|DESKTOP|TABLET)$/i)) dims.push('device');
    else dims.push('query');
  }
  return dims;
}

/** Lignes API brutes + dims → lignes normalisées (page, lang, query, country, segment, clicks, impressions, ctr, position). */
export function normalizeJsonRows(rows, dims) {
  const out = [];
  for (const r of rows) {
    if (!r || typeof r !== 'object') continue;
    const keys = Array.isArray(r.keys) ? r.keys : [];
    const o = { clicks: parseNum(r.clicks), impressions: parseNum(r.impressions), position: parseNum(r.position) };
    let ctr = r.ctr === undefined || r.ctr === null ? null : parseNum(r.ctr);
    if (ctr !== null && ctr > 1) ctr = ctr / 100; // pourcentage fourni par erreur
    o.ctr = ctr === null ? (o.impressions ? o.clicks / o.impressions : 0) : ctr;
    dims.forEach((d, i) => {
      const v = keys[i];
      if (v === undefined) return;
      if (d === 'page') { o.pageRaw = String(v); o.page = normalizePage(v); o.lang = langOfPage(o.page); }
      else if (d === 'query') { o.queryRaw = String(v); o.query = normalizeQuery(v); }
      else if (d === 'country') { o.country = norm(v); o.segment = segmentOfIso(v); }
      else if (d === 'date') o.date = String(v);
      else if (d === 'device') o.device = String(v).toLowerCase();
      else o[d] = String(v);
    });
    if (o.impressions <= 0) continue;
    out.push(o);
  }
  return out;
}

/**
 * Charge un ou plusieurs fichiers JSON (pagination → concaténation) en une source « sonde ».
 * { mode:'sonde', files:[{file,rows,dims}], dims, rows, warnings }
 */
export async function loadJsonFiles(files, { dims: override = null } = {}) {
  const list = Array.isArray(files) ? files : [files];
  const src = { mode: 'sonde', files: [], dims: null, rows: [], warnings: [], window: { start: null, end: null, label: null, source: null } };
  for (const f of list) {
    const abs = path.resolve(String(f));
    let text;
    try { text = await fs.readFile(abs, 'utf-8'); } catch { throw new Error(`Fichier JSON introuvable ou illisible : ${abs}`); }
    let data;
    try { data = JSON.parse(text.replace(/^\uFEFF/, '')); } catch (e) { throw new Error(`JSON invalide (${abs}) : ${e.message}`); }
    const w = findJsonWindow(data);
    if (w) {
      if (!src.window.start || w.start < src.window.start) src.window.start = w.start;
      if (!src.window.end || w.end > src.window.end) src.window.end = w.end;
      src.window.source = 'startDate/endDate du JSON';
    }
    const raw = rowsOfJson(data);
    if (!raw.length) { src.warnings.push(`${path.basename(abs)} : aucune ligne GSC reconnue (attendu {rows:[…]} ou une liste de lignes avec "keys").`); src.files.push({ file: abs, rows: 0, dims: [] }); continue; }
    const dims = inferDims(raw, override);
    if (src.dims && src.dims.join(',') !== dims.join(',')) src.warnings.push(`${path.basename(abs)} : dimensions « ${dims.join(',')} » différentes des fichiers précédents (« ${src.dims.join(',')} »).`);
    src.dims = src.dims || dims;
    const rows = normalizeJsonRows(raw, dims);
    src.files.push({ file: abs, rows: rows.length, dims });
    src.rows.push(...rows);
  }
  if (!src.rows.length) throw new Error('Aucune ligne exploitable dans les fichiers JSON fournis.');
  if (!src.window.start && src.dims?.includes('date')) {
    const dates = src.rows.map(r => r.date).filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d || '')).sort();
    if (dates.length) src.window = { start: dates[0], end: dates[dates.length - 1], label: null, source: 'dimension date' };
  }
  if (!src.window.start) src.warnings.push('Fenêtre de dates inconnue (pas de startDate/endDate ni de dimension date) : indiquer --month si besoin.');
  return src;
}

/** Cherche startDate/endDate (AAAA-MM-JJ) dans l'enveloppe d'une réponse/sonde (profondeur ≤ 3). */
export function findJsonWindow(data, depth = 0) {
  if (!data || typeof data !== 'object' || depth > 3) return null;
  const iso = v => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v) ? v.slice(0, 10) : null);
  if (iso(data.startDate) && iso(data.endDate)) return { start: iso(data.startDate), end: iso(data.endDate) };
  const cands = Array.isArray(data) ? data.slice(0, 5) : [data.json, data.data, data.params, data.request, data.meta, data.body].filter(Boolean);
  for (const c of cands) { const w = findJsonWindow(c, depth + 1); if (w) return w; }
  return null;
}
