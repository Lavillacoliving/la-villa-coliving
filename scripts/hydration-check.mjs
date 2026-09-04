/**
 * Garde d'hydratation React (Lot B — B3, 02/09/2026).
 *
 * Pourquoi : 84 à 95 % des erreurs JS vues dans Clarity sont des « Minified React error #418 »
 * (le HTML prérendu ne correspond pas au premier rendu client → React jette l'arbre et
 * re-rend tout : clics perdus, CPU mobile). Les correctifs du 10/08 et du 31/08 ont réglé les
 * causes structurelles, mais rien ne VÉRIFIAIT à chaque build qu'une régression ne repartait
 * pas en production. Ce script hydrate les pages prérendues fraîchement générées contre le
 * bundle de CE build et échoue sur toute erreur d'hydratation.
 *
 * Exécuté par .github/workflows/prerender.yml APRÈS scripts/prerender.mjs et AVANT le commit
 * des pages. Serveur local : les routes servent public/prerendered/<page>.html (les snapshots
 * Puppeteer référencent déjà les assets de ce build), le reste vient de dist/.
 *
 * Local (messages complets, avec le diff) :
 *   NODE_ENV=development npx vite build --mode development && node scripts/prerender.mjs
 *   && node scripts/hydration-check.mjs
 * En CI (bundle de production) l'erreur est « Minified React error #418 » — détectée aussi.
 */

import fs from 'fs/promises';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const PRERENDERED = path.join(ROOT, 'public', 'prerendered');
const PORT = 3458;

// Pages hydratées : les 7 pages du brief (FR + EN), /chambres-disponibles (Lot 3 SEO funnel) et le premier article de blog.
const STATIC = ['/', '/nos-maisons', '/lavilla', '/leloft', '/lelodge', '/candidature', '/tarifs'];
const ROUTES = [
  ...STATIC,
  ...STATIC.map((r) => (r === '/' ? '/en' : `/en${r}`)),
  '/chambres-disponibles',
  '/en/chambres-disponibles',
  '/colocation-geneve',
  '/en/colocation-geneve',
  '/chambre-a-louer-geneve',
  '/en/chambre-a-louer-geneve',
];

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.txt': 'text/plain', '.xml': 'application/xml',
};

/** /en/nos-maisons → en-nos-maisons.html ; / → index.html (même règle que prerender.mjs). */
function fileFor(route) {
  return route === '/' ? 'index.html' : `${route.slice(1).replace(/\//g, '-')}.html`;
}

// Erreurs d'hydratation (dev ET prod). Les avertissements d'attributs (dev uniquement,
// « A tree hydrated but some attributes… ») ne font PAS échouer : React les ignore en prod.
const HYDRATION_RE = /Hydration failed|Minified React error #4(18|23|25)|regenerated on the client|Text content does not match|did not match/i;

async function main() {
  const puppeteer = (await import('puppeteer')).default;
  // Premier article de blog publié (prérendu) : couvre BlogPostPage et son embed.
  const blogFile = (await fs.readdir(PRERENDERED)).filter((f) => /^blog-.*\.html$/.test(f)).sort()[0];
  const routes = blogFile ? [...ROUTES, `/blog/${blogFile.replace(/^blog-/, '').replace(/\.html$/, '')}`] : ROUTES;

  const server = http.createServer(async (req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    const candidates = url.startsWith('/assets/') || path.extname(url)
      ? [path.join(DIST, url)]
      : [path.join(PRERENDERED, fileFor(url)), path.join(DIST, url, 'index.html'), path.join(DIST, '_spa.html'), path.join(DIST, 'index.html')];
    for (const file of candidates) {
      try {
        const data = await fs.readFile(file);
        res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
        res.end(data);
        return;
      } catch { /* next */ }
    }
    res.writeHead(404); res.end();
  });
  await new Promise((r) => server.listen(PORT, r));

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'] });
  const DEVICES = {
    mobile: { viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, ua: 'Mozilla/5.0 (Linux; Android 13; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/23.0 Chrome/115.0.0.0 Mobile Safari/537.36' },
    desktop: { viewport: { width: 1440, height: 900 }, ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36 Edg/128.0' },
  };
  console.log(`\n💧 Garde hydratation — ${routes.length} routes × ${Object.keys(DEVICES).length} profils\n`);
  const failures = [];
  for (const route of routes) {
    for (const [device, cfg] of Object.entries(DEVICES)) {
      const page = await browser.newPage();
      await page.setViewport(cfg.viewport);
      await page.setUserAgent(cfg.ua);
      const hits = [];
      page.on('console', (m) => { if (['error', 'warning'].includes(m.type()) && HYDRATION_RE.test(m.text())) hits.push(m.text()); });
      page.on('pageerror', (e) => { if (HYDRATION_RE.test(e.message)) hits.push(e.message); });
      try {
        await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle0', timeout: 45000 });
        await new Promise((r) => setTimeout(r, 2000));
        const hydrated = await page.evaluate(() => !!document.getElementById('root')?.children.length);
        if (!hydrated) hits.push('#root vide après chargement');
      } catch (e) {
        hits.push(`chargement : ${e.message}`);
      }
      await page.close();
      const ok = hits.length === 0;
      console.log(`${ok ? '✅' : '❌'} ${route} [${device}]${ok ? '' : ` — ${hits[0].split('\n')[0].slice(0, 160)}`}`);
      if (!ok) failures.push({ route, device, message: hits[0].slice(0, 2000) });
    }
  }
  await browser.close();
  server.close();
  if (failures.length > 0) {
    console.error(`\n❌ ${failures.length} chargement(s) avec erreur d'hydratation — pages NON publiables.\n`);
    for (const f of failures) console.error(`--- ${f.route} [${f.device}]\n${f.message}\n`);
    process.exit(1);
  }
  console.log('\n🎉 Aucune erreur d\'hydratation.\n');
}

main().catch((err) => { console.error('Fatal:', err.message); process.exit(1); });
