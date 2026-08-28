#!/usr/bin/env node
/**
 * gsc-sonde-pull — interroge Search Console via la sonde n8n (webhook) et écrit des JSON
 * lisibles par `tools/mining-gsc.mjs --json` (Brief n°2, Chantier 1 — mode sonde).
 *
 * Zéro dépendance. L'URL de la sonde n'est JAMAIS dans le repo : variable d'env GSC_SONDE_URL
 * (URL Production du webhook n8n « Cowork — Sonde Google »). Les JSON sont écrits HORS repo
 * par défaut (../GSC_exports/sonde/).
 *
 * Usage :
 *   export GSC_SONDE_URL="https://…/webhook/…"      # dans le terminal, pas dans un fichier du repo
 *   node tools/gsc-sonde-pull.mjs                    # 3 mois glissants (J-93 → J-3), page×query×country
 *   node tools/gsc-sonde-pull.mjs --dims query,country --start 2026-05-21 --end 2026-08-18
 *   node tools/gsc-sonde-pull.mjs --out ../GSC_exports/sonde --site https://www.lavillacoliving.com/
 * Puis :
 *   node tools/mining-gsc.mjs --json ../GSC_exports/sonde/gsc_page-query-country_2026-05-21_2026-08-18_p1.json [--json …_p2.json]
 *
 * Le webhook attend { method:"POST", url, payload } et renvoie la réponse Google telle quelle
 * ({ rows:[{keys,clicks,impressions,ctr,position}], responseAggregationType }).
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const argv = process.argv.slice(2);
const opt = (name, def = null) => { const i = argv.indexOf(name); return i === -1 ? def : (argv[i + 1] ?? true); };
if (argv.includes('--help') || argv.includes('-h')) {
  console.log(`gsc-sonde-pull — Search Console via la sonde n8n
  --site URL        propriété GSC (défaut https://www.lavillacoliving.com/)
  --start AAAA-MM-JJ  début (défaut J-93)      --end AAAA-MM-JJ  fin (défaut J-3, données GSC finalisées)
  --dims a,b,c      dimensions (défaut page,query,country) — aussi : query,country · page,country · query
  --country XXX     filtre pays alpha-3 (ex. fra, che) — optionnel
  --out DIR         dossier de sortie (défaut ../GSC_exports/sonde, hors repo)
  --row-limit N     lignes par page (défaut 25000, max API)
  Env : GSC_SONDE_URL (obligatoire)`);
  process.exit(0);
}

const SONDE = process.env.GSC_SONDE_URL;
if (!SONDE) { console.error('Erreur : variable d\'environnement GSC_SONDE_URL absente (URL Production du webhook n8n).'); process.exit(1); }

const iso = d => d.toISOString().slice(0, 10);
const today = new Date();
const defEnd = new Date(today); defEnd.setUTCDate(defEnd.getUTCDate() - 3);
const defStart = new Date(defEnd); defStart.setUTCDate(defStart.getUTCDate() - 90);
const SITE = String(opt('--site', 'https://www.lavillacoliving.com/'));
const START = String(opt('--start', iso(defStart)));
const END = String(opt('--end', iso(defEnd)));
const DIMS = String(opt('--dims', 'page,query,country')).split(',').map(s => s.trim()).filter(Boolean);
const COUNTRY = opt('--country');
const OUT = path.resolve(String(opt('--out', '../GSC_exports/sonde')));
const ROW_LIMIT = Number(opt('--row-limit', 25000));
if (!/^\d{4}-\d{2}-\d{2}$/.test(START) || !/^\d{4}-\d{2}-\d{2}$/.test(END)) { console.error('Dates attendues au format AAAA-MM-JJ'); process.exit(1); }

const apiUrl = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`;

async function callSonde(payload) {
  const res = await fetch(SONDE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ method: 'POST', url: apiUrl, payload }) });
  const text = await res.text();
  if (!res.ok) throw new Error(`Sonde HTTP ${res.status} : ${text.slice(0, 300)}`);
  let json; try { json = JSON.parse(text); } catch { throw new Error(`Réponse non JSON : ${text.slice(0, 300)}`); }
  if (Array.isArray(json) && json[0]?.json) json = json[0].json; // enveloppe n8n éventuelle
  if (json.error) throw new Error(`Google : ${JSON.stringify(json.error).slice(0, 300)}`);
  return json;
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const base = `gsc_${DIMS.join('-')}${COUNTRY ? '_' + String(COUNTRY).toLowerCase() : ''}_${START}_${END}`;
  let startRow = 0, page = 1, total = 0;
  const files = [];
  console.log(`Sonde → ${SITE} · ${START} → ${END} · dims ${DIMS.join(',')}${COUNTRY ? ' · pays ' + COUNTRY : ''} · ${ROW_LIMIT} lignes/page`);
  while (true) {
    const payload = { startDate: START, endDate: END, dimensions: DIMS, rowLimit: ROW_LIMIT, startRow, type: 'web', dataState: 'final' };
    if (COUNTRY) payload.dimensionFilterGroups = [{ filters: [{ dimension: 'country', operator: 'equals', expression: String(COUNTRY).toUpperCase() }] }];
    const t0 = Date.now();
    const json = await callSonde(payload);
    const rows = Array.isArray(json.rows) ? json.rows : [];
    const file = path.join(OUT, `${base}_p${page}.json`);
    await fs.writeFile(file, JSON.stringify({ site: SITE, startDate: START, endDate: END, dimensions: DIMS, startRow, rowLimit: ROW_LIMIT, fetchedAt: new Date().toISOString(), rows, responseAggregationType: json.responseAggregationType }, null, 0));
    files.push(file); total += rows.length;
    console.log(`  page ${page} : ${rows.length} lignes en ${((Date.now() - t0) / 1000).toFixed(1)} s → ${path.relative(process.cwd(), file)}`);
    if (rows.length < ROW_LIMIT) break;
    startRow += ROW_LIMIT; page++;
    if (page > 20) { console.warn('  ⚠️ arrêt après 20 pages (sécurité)'); break; }
  }
  console.log(`OK : ${total} lignes, ${files.length} fichier(s). Ensuite :\n  node tools/mining-gsc.mjs ${files.map(f => `--json "${path.relative(process.cwd(), f)}"`).join(' ')}`);
}

main().catch(err => { console.error('Erreur :', err.message); process.exit(1); });
