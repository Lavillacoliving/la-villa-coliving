/**
 * Garde CI « aucun concurrent nommé » (Lot C0.4, brief « Conquête IA », 09/2026).
 *
 * Scanne le HTML prérendu (public/prerendered/*.html — texte visible, metas, JSON-LD ET embeds JSON),
 * public/llms.txt et public/en/llms.txt. Frontières de mot, insensible casse/accents (scripts/lib/competitor-scan.mjs).
 *
 * Liste des noms (JAMAIS dans le repo public) :
 *   - CI : secret GitHub COMPETITOR_NAMES (séparateur virgule) — Jérôme le crée dans Settings → Secrets ;
 *   - local : scripts/competitors.local.json (gitignoré) : { "names": [...], "allow": [{ "name", "file", "until" }] }.
 *   Sans liste : avertissement et exit 0 (pas de blocage du déploiement pour un secret absent) —
 *   sauf `--require` / REQUIRE_COMPETITOR_LIST=1 (alors exit 1).
 * Options : --routes /a,/en/b  (fichiers dérivés : a.html, en-b.html)  ·  --file <chemin>  ·  --json
 * Échec = process.exit(1) si ≥ 1 occurrence non exclue (modèle scripts/house-pages-check.mjs).
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildMatchers, scanHtml, parseNamesEnv, isAllowed } from './lib/competitor-scan.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PRERENDERED = path.join(ROOT, 'public', 'prerendered');
const LOCAL_LIST = path.join(__dirname, 'competitors.local.json');
const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i === -1 ? null : (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true); };

export function routeToFile(route) {
  const r = route.replace(/\/+$/, '') || '/';
  return r === '/' ? 'index.html' : r === '/en' ? 'en.html' : `${r.slice(1).replace(/\//g, '-')}.html`;
}

async function loadList() {
  if (process.env.COMPETITOR_NAMES) return { names: parseNamesEnv(process.env.COMPETITOR_NAMES), allow: [], origin: 'env COMPETITOR_NAMES' };
  try {
    const j = JSON.parse(await fs.readFile(LOCAL_LIST, 'utf8'));
    return { names: j.names ?? [], allow: j.allow ?? [], origin: 'scripts/competitors.local.json' };
  } catch { return null; }
}

async function main() {
  console.log('\n🕵️  Garde « aucun concurrent nommé » — public/prerendered/ + llms.txt\n');
  const list = await loadList();
  const required = args.includes('--require') || process.env.REQUIRE_COMPETITOR_LIST === '1';
  if (!list || list.names.length === 0) {
    const msg = 'aucune liste de concurrents (secret COMPETITOR_NAMES ou scripts/competitors.local.json) — garde NON exécutée';
    if (required) { console.error(`❌ ${msg}`); process.exit(1); }
    console.log(`⚠️  ${msg}`);
    return;
  }
  const matchers = buildMatchers(list.names);
  const routes = opt('--routes');
  let files;
  if (typeof routes === 'string') files = routes.split(',').map((r) => path.join(PRERENDERED, routeToFile(r.trim())));
  else if (typeof opt('--file') === 'string') files = [path.resolve(opt('--file'))];
  else {
    const names = (await fs.readdir(PRERENDERED)).filter((f) => f.endsWith('.html')).sort();
    files = names.map((f) => path.join(PRERENDERED, f));
    for (const extra of ['public/llms.txt', 'public/en/llms.txt']) {
      try { await fs.access(path.join(ROOT, extra)); files.push(path.join(ROOT, extra)); } catch { /* absent */ }
    }
  }
  const report = [];
  let allowed = 0;
  for (const file of files) {
    let content;
    try { content = await fs.readFile(file, 'utf8'); } catch { report.push({ file: path.relative(ROOT, file), error: 'fichier absent' }); continue; }
    for (const hit of scanHtml(content, matchers)) {
      const rel = path.relative(ROOT, file);
      if (isAllowed(hit, path.basename(file), list.allow)) { allowed++; continue; }
      report.push({ file: rel, name: hit.name, excerpt: hit.excerpt });
    }
  }
  console.log(`   ${list.names.length} nom(s) (${list.origin}) · ${files.length} fichier(s) · ${allowed} exclusion(s) datée(s) appliquée(s)`);
  if (args.includes('--json')) console.log(JSON.stringify(report, null, 2));
  else for (const r of report) console.log(`   • ${r.file}${r.error ? ` : ${r.error}` : ` — « ${r.name} » … ${r.excerpt} …`}`);
  if (report.length > 0) {
    console.error(`\n❌ ${report.length} occurrence(s) de nom de concurrent — pages NON publiables (CLAUDE.md §1).`);
    process.exit(1);
  }
  console.log('\n🎉 Aucun concurrent nommé.\n');
}

if (process.argv[1] && import.meta.url === (await import('url')).pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
}
