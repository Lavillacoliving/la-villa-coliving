#!/usr/bin/env node
/**
 * SEO lint — reproduit en local les checks « warning » de l'audit Ahrefs
 * sur les pages prerendered (= ce que Google et Ahrefs crawlent réellement).
 *
 * Checks :
 *  1. <title> trop long (> 60 caractères — seuil Ahrefs)
 *  2. Meta description trop longue (> 160 caractères — seuil Ahrefs)
 *  3. Liens internes <a href> pointant vers une redirection (vercel.json `redirects`)
 *  4. Liens internes en http:// ou sans www (une 308 de plus à chaque clic)
 *  5. Liens internes avec trailing slash (trailingSlash:false → 308)
 *  6. Liens internes vers une URL inconnue (ni page, ni redirection → 404)
 *  7. Pages avec ≤ 1 lien interne entrant (quasi-orphelines)
 *
 * Usage :  node scripts/seo-lint.mjs          (rapport lisible)
 *          node scripts/seo-lint.mjs --json   (sortie JSON pour scripts)
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PRERENDERED_DIR = path.join(ROOT, 'public', 'prerendered');
const VERCEL_JSON = path.join(ROOT, 'vercel.json');
const SITE = 'https://www.lavillacoliving.com';

// Google affiche ~60 caractères mais Ahrefs n'alerte qu'au-delà de ~70 (mesure pixels).
// On vise ≤60 pour les nouvelles pages, on alerte à >70 pour éviter le bruit permanent.
const TITLE_MAX = 70;   // seuil Ahrefs « Title too long » (empirique, audit 2026-06)
const META_MAX = 160;   // seuil Ahrefs « Meta description too long » (~920 px)

const asJson = process.argv.includes('--json');

// ─── helpers ────────────────────────────────────────────────

function decodeEntities(s) {
  return s
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

// nom de fichier prerendered → route ('index.html' → '/', 'en-blog-x.html' ambigu :
// on reconstruit depuis les routes connues, pas l'inverse)
function routeToFile(route) {
  return route === '/' ? 'index.html' : `${route.slice(1).replace(/\//g, '-')}.html`;
}

// ─── load : routes connues (sitemap) + redirects (vercel.json) ─

async function loadKnownRoutes() {
  const xml = await fs.readFile(path.join(ROOT, 'public', 'sitemap.xml'), 'utf-8');
  const routes = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map(m => m[1].replace(SITE, '') || '/');
  return [...new Set(routes)];
}

async function loadRedirects() {
  const config = JSON.parse(await fs.readFile(VERCEL_JSON, 'utf-8'));
  const exact = new Set();
  const patterns = [];
  for (const r of config.redirects || []) {
    if (r.source.includes(':')) {
      // '/product-page/:slug' → ^/product-page/[^/]+$ ; ':path*' → .*
      const rx = '^' + r.source
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\\\$\{/g, '') // (aucun cas réel, sécurité regex)
        .replace(/:[a-zA-Z]+\\\*/g, '.*')
        .replace(/:[a-zA-Z]+/g, '[^/]+') + '$';
      patterns.push({ rx: new RegExp(rx), source: r.source, dest: r.destination });
    } else {
      exact.add(r.source);
    }
  }
  const map = new Map((config.redirects || []).map(r => [r.source, r.destination]));
  return { exact, patterns, map };
}

// ─── analyse d'une page ─────────────────────────────────────

function extractHead(html) {
  const title = decodeEntities((html.match(/<title[^>]*>([^<]*)<\/title>/i) || [, ''])[1].trim());
  // Les fichiers prerendered contiennent 2 metas description : celle de la coquille
  // index.html (générique) + celle de react-helmet (spécifique à la page).
  // inject-prerendered.mjs garde la DERNIÈRE au déploiement → on mesure la même.
  let meta = '';
  for (const m of html.split('</head>')[0].matchAll(/<meta\s+name="description"\s+content="([^"]*)"[^>]*>/gi)) {
    meta = decodeEntities(m[1].trim());
  }
  return { title, meta };
}

function extractLinks(html) {
  // uniquement le <body> : canonical/hreflang/og sont légitimes en <head>
  const bodyStart = html.search(/<body[^>]*>/i);
  const body = bodyStart >= 0 ? html.slice(bodyStart) : html;
  const links = [];
  for (const m of body.matchAll(/<a\s([^>]*)>/gi)) {
    const attrs = m[1];
    const href = (attrs.match(/href="([^"]*)"/) || attrs.match(/href='([^']*)'/) || [])[1];
    if (!href) continue;
    const nofollow = /rel="[^"]*nofollow[^"]*"/i.test(attrs);
    links.push({ href: decodeEntities(href), nofollow });
  }
  return links;
}

// normalise un href interne → { path, issues } ; null si externe/mailto/ancre pure
function normalizeHref(href) {
  const issues = [];
  if (/^(mailto:|tel:|javascript:|#)/i.test(href)) return null;
  let url = href;
  if (/^https?:\/\//i.test(url)) {
    if (!/lavillacoliving\.com/i.test(url)) return null; // externe
    if (/^http:\/\//i.test(url)) issues.push('http');
    if (/^https?:\/\/lavillacoliving\.com/i.test(url)) issues.push('no-www');
    url = url.replace(/^https?:\/\/(www\.)?lavillacoliving\.com/i, '') || '/';
  }
  if (!url.startsWith('/')) return null; // relatif exotique — ignorer
  url = url.split('#')[0].split('?')[0] || '/';
  if (url.length > 1 && url.endsWith('/')) {
    issues.push('trailing-slash');
    url = url.replace(/\/+$/, '');
  }
  return { path: url || '/', issues };
}

// ─── main ───────────────────────────────────────────────────

async function main() {
  const knownRoutes = await loadKnownRoutes();
  const { exact, patterns, map } = await loadRedirects();
  const knownSet = new Set(knownRoutes);

  const report = {
    titleTooLong: [], metaTooLong: [],
    linksToRedirect: [], badScheme: [], trailingSlash: [], deadLinks: [],
    weakIncoming: [],
  };

  // agrégats de liens : href problématique → Set(pages sources)
  const redirectHits = new Map(), schemeHits = new Map(), slashHits = new Map(), deadHits = new Map();
  const incoming = new Map(); // route cible → Set(routes sources)

  for (const route of knownRoutes) {
    const file = path.join(PRERENDERED_DIR, routeToFile(route));
    let html;
    try { html = await fs.readFile(file, 'utf-8'); }
    catch { continue; } // route du sitemap sans fichier — signalé ailleurs

    const { title, meta } = extractHead(html);
    if (title.length > TITLE_MAX) report.titleTooLong.push({ route, len: title.length, title });
    if (meta.length > META_MAX) report.metaTooLong.push({ route, len: meta.length, meta });

    for (const { href, nofollow } of extractLinks(html)) {
      const n = normalizeHref(href);
      if (!n) continue;
      const { path: p, issues } = n;

      const isRedirect = exact.has(p) || patterns.some(pt => pt.rx.test(p));
      if (isRedirect) {
        if (!redirectHits.has(p)) redirectHits.set(p, new Set());
        redirectHits.get(p).add(route);
      }
      if (issues.includes('http') || issues.includes('no-www')) {
        if (!schemeHits.has(href)) schemeHits.set(href, new Set());
        schemeHits.get(href).add(route);
      }
      if (issues.includes('trailing-slash')) {
        if (!slashHits.has(href)) slashHits.set(href, new Set());
        slashHits.get(href).add(route);
      }
      if (!isRedirect && !knownSet.has(p) && !p.startsWith('/portail') && !p.startsWith('/dashboard')
          && !p.startsWith('/mon-espace') && p !== '/reset-password' && p !== '/404') {
        // Un lien vers un fichier statique de public/ (CSV, PDF, image…) n'est pas mort.
        let isStaticAsset = false;
        try { await fs.access(path.join(ROOT, 'public', p.slice(1))); isStaticAsset = true; } catch { /* pas un asset */ }
        if (!isStaticAsset) {
          if (!deadHits.has(p)) deadHits.set(p, new Set());
          deadHits.get(p).add(route);
        }
      }

      // graphe de liens entrants (dofollow, pages connues, pas de self-link)
      const target = isRedirect ? (map.get(p) || p) : p;
      if (!nofollow && knownSet.has(target) && target !== route) {
        if (!incoming.has(target)) incoming.set(target, new Set());
        incoming.get(target).add(route);
      }
    }
  }

  for (const [href, sources] of redirectHits) {
    report.linksToRedirect.push({ href, dest: map.get(href) || '(pattern)', pages: sources.size, examples: [...sources].slice(0, 4) });
  }
  for (const [href, sources] of schemeHits) report.badScheme.push({ href, pages: sources.size, examples: [...sources].slice(0, 4) });
  for (const [href, sources] of slashHits) report.trailingSlash.push({ href, pages: sources.size, examples: [...sources].slice(0, 4) });
  for (const [href, sources] of deadHits) report.deadLinks.push({ href, pages: sources.size, examples: [...sources].slice(0, 4) });

  for (const route of knownRoutes) {
    const n = (incoming.get(route) || new Set()).size;
    if (n <= 1) report.weakIncoming.push({ route, incoming: n });
  }

  if (asJson) { console.log(JSON.stringify(report, null, 2)); return; }

  // ─── rapport lisible ───
  const sec = (t) => console.log(`\n━━━ ${t} ━━━`);
  console.log(`SEO lint — ${knownRoutes.length} routes analysées (public/prerendered/)`);

  sec(`1. Titles > ${TITLE_MAX} caractères : ${report.titleTooLong.length}`);
  for (const x of report.titleTooLong.sort((a, b) => b.len - a.len))
    console.log(`  [${x.len}] ${x.route}\n        "${x.title}"`);

  sec(`2. Meta descriptions > ${META_MAX} caractères : ${report.metaTooLong.length}`);
  for (const x of report.metaTooLong.sort((a, b) => b.len - a.len))
    console.log(`  [${x.len}] ${x.route}\n        "${x.meta}"`);

  sec(`3. Liens internes → redirection : ${report.linksToRedirect.length} URL(s) distincte(s)`);
  for (const x of report.linksToRedirect.sort((a, b) => b.pages - a.pages))
    console.log(`  ${x.href} → ${x.dest}\n        sur ${x.pages} page(s) : ${x.examples.join(', ')}${x.pages > 4 ? '…' : ''}`);

  sec(`4. Liens http:// ou sans www : ${report.badScheme.length}`);
  for (const x of report.badScheme)
    console.log(`  ${x.href}\n        sur ${x.pages} page(s) : ${x.examples.join(', ')}${x.pages > 4 ? '…' : ''}`);

  sec(`5. Liens avec trailing slash : ${report.trailingSlash.length}`);
  for (const x of report.trailingSlash)
    console.log(`  ${x.href}\n        sur ${x.pages} page(s) : ${x.examples.join(', ')}${x.pages > 4 ? '…' : ''}`);

  sec(`6. Liens internes morts (→ 404) : ${report.deadLinks.length}`);
  for (const x of report.deadLinks)
    console.log(`  ${x.href}\n        sur ${x.pages} page(s) : ${x.examples.join(', ')}${x.pages > 4 ? '…' : ''}`);

  sec(`7. Pages avec ≤ 1 lien interne entrant : ${report.weakIncoming.length}`);
  for (const x of report.weakIncoming) console.log(`  [${x.incoming} entrant(s)] ${x.route}`);

  const total = report.titleTooLong.length + report.metaTooLong.length + report.linksToRedirect.length
    + report.badScheme.length + report.trailingSlash.length + report.deadLinks.length + report.weakIncoming.length;
  console.log(`\n${total === 0 ? '✅ Aucun problème détecté' : `⚠️  ${total} problème(s) au total`}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
