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
import { blockAnalytics } from './lib/block-analytics.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const PRERENDERED = path.join(ROOT, 'public', 'prerendered');
const PORT = 3458;

// Pages hydratées : les 7 pages du brief (FR + EN), /chambres-disponibles (Lot 3 SEO funnel) et le premier article de blog.
// (Lot S1, 05/09/2026) + les pages qui portent la fiche entité : /faq, /le-coliving, /qui-sommes-nous, pages Annemasse.
const STATIC = ['/', '/nos-maisons', '/lavilla', '/leloft', '/lelodge', '/candidature', '/tarifs', '/faq', '/le-coliving', '/qui-sommes-nous', '/annemasse-colocation', '/chambre-a-louer-annemasse'];
const ROUTES = [
  ...STATIC,
  ...STATIC.map((r) => (r === '/' ? '/en' : `/en${r}`)),
  '/chambres-disponibles',
  '/en/chambres-disponibles',
  // Fiches chambres (28/09/2026) : une du Lodge FR + EN, celle du Loft.
  '/lelodge/chambre-4',
  '/en/lelodge/chambre-4',
  '/leloft/chambre-4',
  // Fiche NON consultable (chambre occupée sans date au moment du rendu) : vue « pas disponible ».
  '/lelodge/chambre-2',
  '/colocation-geneve',
  '/en/colocation-geneve',
  '/chambre-a-louer-geneve',
  '/en/chambre-a-louer-geneve',
];

// (28/09/2026, fix soft-404) URL sans prérendu : Vercel sert 404.html (en HTTP 404). Servies ici avec
// le 404.html prérendu, comme en production : un slug d'article inconnu (BlogPostPage démarre sur la
// vue « introuvable », identique au 404) et une page inconnue (NotFoundPage), en FR et en EN (le 404
// est prérendu en français : main.tsx fait un rendu client sur /en/… au lieu d'hydrater).
// (Lot B, 01/10/2026) URL AVEC query : servies, comme sur Vercel, par le snapshot SANS query (le serveur
// ci-dessous ignore la query). L'en-tête contextuel de /candidature (maison, chambre, liste d'attente,
// chambre partie, slug piégé) ne doit plus jamais diverger du HTML prérendu (#418 du 30/09).
const QUERY_ROUTES = [
  '/candidature?property_interest=lelodge',
  '/candidature?property_interest=leloft&room_interest=chambre-5',
  '/candidature?property_interest=lavilla&room_interest=liste-attente',
  '/candidature?property_interest=lelodge&room_interest=chambre-99',
  '/en/candidature?property_interest=leloft&room_interest=chambre-2',
  '/candidature?property_interest=constructor',
];

// (Lot B) Index du blog et articles qui citent un numéro de téléphone (format-detection, liens tel:).
const BLOG_ROUTES = ['/blog', '/en/blog', '/blog/guide-ressources-frontalier-geneve', '/en/blog/guide-ressources-frontalier-geneve'];

// (Lot B) Horloge décalée : le lecteur charge la page des semaines après le prérendu (changement de mois
// et d'année). Tout texte calculé avec new Date() au rendu (année du pied de page, mois de /tarifs)
// divergerait du HTML — il doit venir du mois embarqué (src/lib/renderMonth.tsx).
const CLOCK_SHIFT_DAYS = 95;
const CLOCK_SHIFT_ROUTES = ['/', '/tarifs', '/en/tarifs', '/candidature?property_interest=lelodge'];

const NOT_FOUND_ROUTES = [
  '/blog/article-inexistant-garde-hydratation',
  '/page-inexistante-garde-hydratation',
  '/en/blog/article-inexistant-garde-hydratation',
  '/en/page-inexistante-garde-hydratation',
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
  const routes = [...(blogFile ? [...ROUTES, `/blog/${blogFile.replace(/^blog-/, '').replace(/\.html$/, '')}`] : ROUTES), ...QUERY_ROUTES, ...BLOG_ROUTES, ...NOT_FOUND_ROUTES];

  const server = http.createServer(async (req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    const candidates = url.startsWith('/assets/') || path.extname(url)
      ? [path.join(DIST, url)]
      : NOT_FOUND_ROUTES.includes(url)
        ? [path.join(PRERENDERED, '404.html')]
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
  console.log(`\n💧 Garde hydratation — ${routes.length} routes × ${Object.keys(DEVICES).length} profils + ${CLOCK_SHIFT_ROUTES.length} routes à l'horloge +${CLOCK_SHIFT_DAYS} j\n`);
  const failures = [];
  const runs = [
    ...routes.flatMap((route) => Object.keys(DEVICES).map((device) => ({ route, device, shift: 0 }))),
    ...CLOCK_SHIFT_ROUTES.map((route) => ({ route, device: 'desktop', shift: CLOCK_SHIFT_DAYS })),
  ];
  for (const { route, device: profile, shift } of runs) {
    const cfg = DEVICES[profile];
    const device = shift ? `${profile}, horloge +${shift} j` : profile;
    const page = await browser.newPage();
    await page.setViewport(cfg.viewport);
    await page.setUserAgent(cfg.ua);
    if (shift) {
      // Date décalée AVANT tout script de la page (new Date(), Date.now()).
      await page.evaluateOnNewDocument((ms) => {
        const RealDate = Date;
        class ShiftedDate extends RealDate {
          constructor(...args) { if (args.length === 0) super(RealDate.now() + ms); else super(...args); }
          static now() { return RealDate.now() + ms; }
        }
        globalThis.Date = ShiftedDate;
      }, shift * 86400000);
    }
    // Lot C (01/10/2026) : aucun hit GA4/Clarity (ex-« 390×844 » et « 1440×900 » de GA4).
    await blockAnalytics(page);
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
  await browser.close();
  server.close();
  if (failures.length > 0) {
    console.error(`\n❌ ${failures.length} chargement(s) avec erreur d'hydratation — pages NON publiables.\n`);
    for (const f of failures) console.error(`--- ${f.route} [${f.device}]\n${f.message}\n`);
    // En CI : une annotation par échec, lisible sans connexion (API check-runs/…/annotations),
    // alors que les journaux GitHub Actions exigent un compte (constat du 01/10/2026).
    if (process.env.GITHUB_ACTIONS) {
      for (const f of failures.slice(0, 10)) {
        const msg = f.message.slice(0, 900).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
        const title = `Hydratation ${f.route} [${f.device}]`.replace(/%/g, '%25').replace(/:/g, '%3A').replace(/,/g, '%2C');
        console.log(`::error title=${title}::${msg}`);
      }
    }
    process.exit(1);
  }
  console.log('\n🎉 Aucune erreur d\'hydratation.\n');
}

main().catch((err) => { console.error('Fatal:', err.message); process.exit(1); });
