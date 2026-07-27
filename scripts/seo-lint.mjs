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
 *  8. hreflang : cible redirigée/inconnue, réciprocité rompue, x-default absent ou multiple
 *  9. JSON-LD : LocalBusiness/LodgingBusiness sans `address`, ou `url` vers une redirection
 * 10. llms.txt (FR + EN) : liens vers une redirection ou une URL inconnue
 * 11. Cohérence de serving : même code HTTP en UA Googlebot et en UA navigateur  (--net)
 * 12. Sitemap : aucune URL (loc ET alternates) ne doit être une source de redirection
 * 13. Sitemap vs HTML : les alternates hreflang doivent être identiques des deux côtés
 *
 * Les checks 8, 12 et 13 existent parce que le linter ne regardait que le <body> :
 * c'est par là que `/en/colocation-geneve` a pu déclarer 20 jours durant un
 * hreflang vers une URL en 308, sans que rien ne le signale (27/07/2026).
 *
 * Usage :  node scripts/seo-lint.mjs          (rapport lisible, hors ligne)
 *          node scripts/seo-lint.mjs --json   (sortie JSON pour scripts)
 *          node scripts/seo-lint.mjs --net    (ajoute le check 11 — requêtes réseau)
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { HREFLANG_NO_ALTERNATES } from './hreflang-overrides.mjs';

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
const withNet = process.argv.includes('--net');

const UA_BOT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const UA_HUMAN = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
  + '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

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

// ─── extraction <head> : hreflang & JSON-LD ─────────────────

// ⚠️ insensible à la casse : react-helmet écrit `hrefLang`, Puppeteer sérialise
// `hreflang`. Une regex sensible à la casse ne voit rien (bug historique de
// inject-prerendered.mjs). L'ordre des attributs n'est pas garanti non plus.
function extractHreflang(html) {
  const head = html.split('</head>')[0];
  const out = [];
  for (const m of head.matchAll(/<link\s[^>]*rel="alternate"[^>]*>/gi)) {
    const tag = m[0];
    const lang = (tag.match(/hreflang="([^"]*)"/i) || [])[1];
    const href = (tag.match(/href="([^"]*)"/i) || [])[1];
    if (lang && href) out.push({ lang: lang.toLowerCase(), href: decodeEntities(href) });
  }
  return out;
}

function extractJsonLd(html) {
  const blocks = [];
  for (const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try { blocks.push(JSON.parse(m[1].trim())); } catch { blocks.push({ __parseError: true }); }
  }
  return blocks;
}

// Parcourt un JSON-LD et renvoie toutes les valeurs de clés `url`/`@id`.
function collectJsonLdUrls(node, acc = []) {
  if (Array.isArray(node)) { for (const x of node) collectJsonLdUrls(x, acc); return acc; }
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if ((k === 'url' || k === '@id') && typeof v === 'string') acc.push(v);
      else collectJsonLdUrls(v, acc);
    }
  }
  return acc;
}

// Types qui doivent porter une `address` à la racine du bloc (exigence Google).
const NEEDS_ADDRESS = new Set(['LocalBusiness', 'LodgingBusiness']);

function jsonLdTypesMissingAddress(block) {
  const missing = [];
  const walk = (n, depth) => {
    if (Array.isArray(n)) { for (const x of n) walk(x, depth); return; }
    if (!n || typeof n !== 'object') return;
    const t = n['@type'];
    // uniquement la racine du bloc : `department[].address` ne compte pas pour l'entité mère
    if (depth === 0 && typeof t === 'string' && NEEDS_ADDRESS.has(t) && !n.address) missing.push(t);
    if (depth === 0) for (const v of Object.values(n)) walk(v, depth + 1);
  };
  walk(block, 0);
  return missing;
}

// ─── sitemap : loc + alternates par URL ─────────────────────

async function loadSitemapEntries() {
  const xml = await fs.readFile(path.join(ROOT, 'public', 'sitemap.xml'), 'utf-8');
  const entries = new Map(); // route → [{lang, href}]
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const block = m[1];
    const loc = (block.match(/<loc>([^<]+)<\/loc>/) || [])[1];
    if (!loc) continue;
    const alts = [...block.matchAll(/hreflang="([^"]+)"\s+href="([^"]+)"/g)]
      .map(a => ({ lang: a[1].toLowerCase(), href: a[2] }));
    entries.set(loc.replace(SITE, '') || '/', alts);
  }
  return entries;
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

  const sitemapEntries = await loadSitemapEntries();

  const report = {
    titleTooLong: [], metaTooLong: [],
    linksToRedirect: [], badScheme: [], trailingSlash: [], deadLinks: [],
    weakIncoming: [],
    hreflang: [], jsonLd: [], llmsTxt: [], serving: [], sitemapRedirect: [], sitemapVsHtml: [],
  };

  const isRedirectPath = (p) => exact.has(p) || patterns.some(pt => pt.rx.test(p));
  const hreflangByRoute = new Map(); // route → [{lang, href}] (pour la réciprocité)

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

    // ── 8. hreflang
    const alts = extractHreflang(html);
    hreflangByRoute.set(route, alts);
    if (HREFLANG_NO_ALTERNATES.has(route)) {
      if (alts.length) {
        report.hreflang.push({ route, kind: 'orpheline-avec-alternates',
          detail: `${alts.length} balise(s) alors que la route est déclarée sans équivalent` });
      }
    } else if (alts.length) {
      const xdef = alts.filter(a => a.lang === 'x-default').length;
      if (xdef !== 1) report.hreflang.push({ route, kind: 'x-default', detail: `${xdef} x-default (attendu : 1)` });
      for (const { lang, href } of alts) {
        const n = normalizeHref(href);
        if (!n) { report.hreflang.push({ route, kind: 'href-externe', detail: `${lang} → ${href}` }); continue; }
        if (isRedirectPath(n.path)) {
          report.hreflang.push({ route, kind: 'cible-redirigee', detail: `${lang} → ${n.path} (→ ${map.get(n.path) || 'pattern'})` });
        } else if (!knownSet.has(n.path)) {
          report.hreflang.push({ route, kind: 'cible-inconnue', detail: `${lang} → ${n.path}` });
        }
      }
    }

    // ── 9. JSON-LD
    for (const block of extractJsonLd(html)) {
      if (block.__parseError) { report.jsonLd.push({ route, kind: 'json-invalide', detail: '' }); continue; }
      for (const t of jsonLdTypesMissingAddress(block)) {
        report.jsonLd.push({ route, kind: 'address-manquante', detail: t });
      }
      for (const u of collectJsonLdUrls(block)) {
        const n = normalizeHref(u);
        if (n && isRedirectPath(n.path)) {
          report.jsonLd.push({ route, kind: 'url-vers-redirection', detail: n.path });
        }
      }
    }

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

  // ── 8 (suite). Réciprocité : si A déclare B en langue L, B doit renvoyer vers A.
  for (const [route, alts] of hreflangByRoute) {
    if (HREFLANG_NO_ALTERNATES.has(route) || !alts.length) continue;
    for (const { lang, href } of alts) {
      if (lang === 'x-default') continue;
      const n = normalizeHref(href);
      if (!n || n.path === route) continue;
      const back = hreflangByRoute.get(n.path);
      if (back === undefined) continue; // page hors périmètre prerendered
      const reciproque = back.some(b => {
        const bn = normalizeHref(b.href);
        return bn && bn.path === route;
      });
      if (!reciproque) {
        report.hreflang.push({ route, kind: 'reciprocite-rompue',
          detail: `déclare ${lang} → ${n.path}, qui ne renvoie pas vers ${route}` });
      }
    }
  }
  // Deux CLUSTERS distincts revendiquant la même cible pour la même langue.
  //
  // ⚠️ Ne pas confondre avec le cas normal : dans un cluster sain FR↔EN, les deux
  // pages déclarent le MÊME jeu d'alternates (chacune liste les deux membres).
  // Que « fr → A » soit déclaré par A et par B n'est donc pas une anomalie.
  // L'anomalie, c'est deux pages aux jeux d'alternates DIFFÉRENTS qui visent la
  // même cible : elles appartiennent alors à deux clusters concurrents, et
  // Google n'en retient qu'un (motif « more than one page for same language »).
  const signature = (alts) => alts
    .filter(a => a.lang !== 'x-default')
    .map(a => `${a.lang}=${(normalizeHref(a.href) || { path: a.href }).path}`)
    .sort().join(',');
  const claims = new Map(); // `${lang}|${cible}` → Map(signature → [routes])
  for (const [route, alts] of hreflangByRoute) {
    if (HREFLANG_NO_ALTERNATES.has(route) || !alts.length) continue;
    const sig = signature(alts);
    for (const { lang, href } of alts) {
      if (lang === 'x-default') continue;
      const n = normalizeHref(href);
      if (!n) continue;
      const k = `${lang}|${n.path}`;
      if (!claims.has(k)) claims.set(k, new Map());
      const bySig = claims.get(k);
      if (!bySig.has(sig)) bySig.set(sig, []);
      bySig.get(sig).push(route);
    }
  }
  for (const [k, bySig] of claims) {
    if (bySig.size > 1) {
      const [lang, cible] = k.split('|');
      const groupes = [...bySig.values()].map(rs => rs.join('+')).join(' | ');
      report.hreflang.push({ route: cible, kind: 'clusters-concurrents',
        detail: `${bySig.size} clusters distincts déclarent ${lang} → ${cible} : ${groupes}` });
    }
  }

  // ── 10. llms.txt (FR + EN)
  for (const rel of ['public/llms.txt', 'public/en/llms.txt']) {
    let txt;
    try { txt = await fs.readFile(path.join(ROOT, rel), 'utf-8'); } catch { continue; }
    for (const m of txt.matchAll(/https?:\/\/[^\s)]+/g)) {
      const n = normalizeHref(m[0]);
      if (!n) continue;
      if (isRedirectPath(n.path)) report.llmsTxt.push({ file: rel, href: n.path, kind: 'redirection' });
      else if (!knownSet.has(n.path)) {
        let asset = false;
        try { await fs.access(path.join(ROOT, 'public', n.path.slice(1))); asset = true; } catch { /* */ }
        if (!asset) report.llmsTxt.push({ file: rel, href: n.path, kind: 'inconnue' });
      }
    }
  }

  // ── 12. Sitemap : aucune URL (loc OU alternate) ne doit être une source de redirection
  for (const [route, alts] of sitemapEntries) {
    if (isRedirectPath(route)) report.sitemapRedirect.push({ where: '<loc>', href: route });
    for (const { lang, href } of alts) {
      const n = normalizeHref(href);
      if (n && isRedirectPath(n.path)) report.sitemapRedirect.push({ where: `alternate ${lang} de ${route}`, href: n.path });
    }
  }

  // ── 13. Sitemap vs HTML : mêmes alternates des deux côtés
  const key = (list) => list
    .filter(a => a.lang !== 'x-default')  // le sitemap ne porte pas de x-default
    .map(a => `${a.lang}=${(normalizeHref(a.href) || { path: a.href }).path}`)
    .sort().join(',');
  for (const [route, alts] of sitemapEntries) {
    const html = hreflangByRoute.get(route);
    if (html === undefined) continue;
    const a = key(alts), b = key(html);
    if (a !== b) report.sitemapVsHtml.push({ route, sitemap: a || '(aucun)', html: b || '(aucun)' });
  }

  // ── 11. Cohérence de serving bot / navigateur (réseau, opt-in)
  if (withNet) {
    const sources = [...exact];
    const status = async (url, ua) => {
      try {
        const r = await fetch(url, { method: 'HEAD', redirect: 'manual', headers: { 'user-agent': ua } });
        return r.status;
      } catch { return 0; }
    };
    for (let i = 0; i < sources.length; i += 8) {
      const chunk = sources.slice(i, i + 8);
      await Promise.all(chunk.map(async (src) => {
        const url = SITE + src;
        const [b, h] = await Promise.all([status(url, UA_BOT), status(url, UA_HUMAN)]);
        if (b !== h) report.serving.push({ source: src, bot: b, humain: h });
      }));
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

  sec(`8. hreflang : ${report.hreflang.length}`);
  for (const x of report.hreflang) console.log(`  [${x.kind}] ${x.route}\n        ${x.detail}`);

  sec(`9. JSON-LD : ${report.jsonLd.length}`);
  for (const x of report.jsonLd) console.log(`  [${x.kind}] ${x.route}${x.detail ? `\n        ${x.detail}` : ''}`);

  sec(`10. llms.txt : ${report.llmsTxt.length}`);
  for (const x of report.llmsTxt) console.log(`  [${x.kind}] ${x.file} → ${x.href}`);

  sec(`11. Cohérence de serving bot/navigateur : ${withNet ? report.serving.length : 'non exécuté (--net)'}`);
  for (const x of report.serving) console.log(`  ${x.source} : Googlebot=${x.bot} navigateur=${x.humain}`);

  sec(`12. Sitemap → redirection : ${report.sitemapRedirect.length}`);
  for (const x of report.sitemapRedirect) console.log(`  ${x.where} : ${x.href}`);

  sec(`13. Sitemap vs HTML (alternates) : ${report.sitemapVsHtml.length}`);
  for (const x of report.sitemapVsHtml) console.log(`  ${x.route}\n        sitemap : ${x.sitemap}\n        html    : ${x.html}`);

  const total = report.titleTooLong.length + report.metaTooLong.length + report.linksToRedirect.length
    + report.badScheme.length + report.trailingSlash.length + report.deadLinks.length + report.weakIncoming.length
    + report.hreflang.length + report.jsonLd.length + report.llmsTxt.length + report.serving.length
    + report.sitemapRedirect.length + report.sitemapVsHtml.length;
  console.log(`\n${total === 0 ? '✅ Aucun problème détecté' : `⚠️  ${total} problème(s) au total`}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
