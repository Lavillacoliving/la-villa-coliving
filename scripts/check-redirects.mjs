/**
 * Garde CI des redirections (Lot C0.3, brief « Conquête IA », 09/2026).
 *
 * Vérifie, sur vercel.json + public/sitemap.xml (tous deux fraîchement régénérés par le prérendu) :
 *   1. forme : sources/destinations en « /… », sans query ni slash final, sources uniques, permanent:true ;
 *   2. AUCUNE chaîne : aucune destination n'est une source (exacte ou motif) ;
 *   3. aucune source de redirection n'est aussi une source de rewrite (page prérendue inatteignable) ;
 *   4. aucune URL du sitemap (<loc> ou alternate hreflang) n'est une source de redirection ;
 *   5. --expect <json> : chaque paire {from,to} attendue existe avec cette destination exacte (un saut).
 *   --net [base]  : après déploiement, HEAD sur chaque paire attendue (ou --all) → 3xx + Location = to, puis to → 200.
 * Échec = process.exit(1) (modèle scripts/house-pages-check.mjs). Exécuté par prerender.yml après le prérendu.
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadConfig, sourceToRegExp, normalizePath } from './redirects.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITEMAP = path.join(__dirname, '..', 'public', 'sitemap.xml');
const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i === -1 ? null : (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true); };

function pathOf(url) {
  try { return new URL(url).pathname.replace(/\/+$/, '') || '/'; } catch { return normalizePath(url); }
}

export function checkStatic(config, sitemapXml, expected = []) {
  const failures = [];
  const warnings = [];
  const redirects = config.redirects ?? [];
  const seen = new Set();
  for (const r of redirects) {
    for (const [k, v] of [['source', r.source], ['destination', r.destination]]) {
      if (typeof v !== 'string' || !v.startsWith('/')) failures.push(`forme : ${k} « ${v} » doit commencer par /`);
      else if (/[?#]/.test(v)) failures.push(`forme : ${k} « ${v} » porte une query ou un fragment`);
      else if (v.length > 1 && v.endsWith('/')) warnings.push(`forme : ${k} « ${v} » a un slash final (trailingSlash:false le normalise d'abord → 2 sauts possibles ; entrée héritée, à retirer si sa version sans slash existe)`);
    }
    // Politique du site : redirection permanente (permanent:true = 308, ou statusCode 301/308 explicite).
    if (r.permanent !== true && ![301, 308].includes(r.statusCode)) failures.push(`politique : « ${r.source} » n'est pas permanente (permanent:true ou statusCode 301/308)`);
    if (seen.has(r.source)) failures.push(`doublon : source « ${r.source} » déclarée deux fois`);
    seen.add(r.source);
    if (r.source === r.destination) failures.push(`boucle : « ${r.source} » → lui-même`);
  }
  // 2. chaînes
  const patterns = redirects.filter((r) => r.source.includes(':')).map((r) => ({ r, re: sourceToRegExp(r.source) }));
  for (const r of redirects) {
    const hit = redirects.find((x) => x.source === r.destination) ?? patterns.find((p) => p.re.test(r.destination))?.r;
    if (hit) failures.push(`chaîne : « ${r.source} » → « ${r.destination} » → « ${hit.destination} » (écrire directement → ${hit.destination})`);
  }
  // 3. source de redirect = source de rewrite
  const rewriteSources = new Set((config.rewrites ?? []).map((rw) => rw.source));
  for (const r of redirects) if (rewriteSources.has(r.source)) failures.push(`conflit : « ${r.source} » est à la fois redirigé et réécrit vers un prérendu`);
  // 4. sitemap
  const sitemapPaths = new Set();
  for (const m of sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)) sitemapPaths.add(pathOf(m[1].trim()));
  for (const m of sitemapXml.matchAll(/hreflang="[^"]+"\s+href="([^"]+)"/g)) sitemapPaths.add(pathOf(m[1].trim()));
  for (const p of sitemapPaths) {
    const hit = redirects.find((r) => r.source === p) ?? patterns.find((pt) => pt.re.test(p))?.r;
    if (hit) failures.push(`sitemap : « ${p} » est une source de redirection (→ ${hit.destination})`);
  }
  // 5. attendus
  for (const e of expected) {
    const r = redirects.find((x) => x.source === normalizePath(e.from));
    if (!r) failures.push(`attendu : « ${e.from} » n'est pas redirigé`);
    else if (r.destination !== normalizePath(e.to)) failures.push(`attendu : « ${e.from} » → « ${r.destination} », attendu « ${e.to} »`);
  }
  return { failures, warnings, counts: { redirects: redirects.length, sitemap: sitemapPaths.size, expected: expected.length } };
}

async function checkNet(base, pairs) {
  const failures = [];
  const head = (url) => fetch(url, { method: 'HEAD', redirect: 'manual', headers: { 'User-Agent': 'Mozilla/5.0 (check-redirects)' } });
  let i = 0;
  const worker = async () => {
    while (i < pairs.length) {
      const { from, to } = pairs[i++];
      try {
        const r1 = await head(`${base}${from}?nocache=${Date.now()}`);
        const loc = r1.headers.get('location');
        const locPath = loc ? pathOf(loc) : null;
        if (![301, 302, 307, 308].includes(r1.status)) failures.push(`${from} : HTTP ${r1.status} (attendu 308)`);
        else if (locPath !== normalizePath(to)) failures.push(`${from} : Location = ${locPath} (attendu ${to})`);
        else if (r1.status !== 308) failures.push(`${from} : HTTP ${r1.status} au lieu de 308 (politique permanent:true)`);
        const r2 = await head(`${base}${to}?nocache=${Date.now()}`);
        if (r2.status !== 200) failures.push(`${to} : HTTP ${r2.status} (la destination doit répondre 200 en un saut)`);
      } catch (e) {
        failures.push(`${from} : erreur réseau ${e.message}`);
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(8, pairs.length) }, worker));
  return failures;
}

async function main() {
  console.log('\n🔀 Garde redirections — vercel.json × public/sitemap.xml\n');
  const config = await loadConfig();
  const sitemap = await fs.readFile(SITEMAP, 'utf8').catch(() => '');
  const expectFile = opt('--expect');
  const expected = expectFile && expectFile !== true ? JSON.parse(await fs.readFile(path.resolve(expectFile), 'utf8')) : [];
  const { failures, warnings, counts } = checkStatic(config, sitemap, expected);
  console.log(`   ${counts.redirects} redirections · ${counts.sitemap} URL au sitemap · ${counts.expected} paire(s) attendue(s)`);
  for (const w of warnings) console.log(`   ⚠️  ${w}`);
  let all = [...failures];
  const net = opt('--net');
  if (net) {
    const base = typeof net === 'string' ? net.replace(/\/$/, '') : 'https://www.lavillacoliving.com';
    const pairs = args.includes('--all') ? config.redirects.filter((r) => !r.source.includes(':')).map((r) => ({ from: r.source, to: r.destination })) : expected;
    console.log(`   --net : ${pairs.length} paire(s) testée(s) sur ${base}`);
    all.push(...(await checkNet(base, pairs)));
  }
  for (const f of all) console.log(`   • ${f}`);
  if (all.length > 0) {
    console.error(`\n❌ ${all.length} problème(s) de redirection.`);
    process.exit(1);
  }
  console.log('\n🎉 Redirections saines : aucune chaîne, aucune URL du sitemap redirigée.\n');
}

if (process.argv[1] && import.meta.url === (await import('url')).pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
}
