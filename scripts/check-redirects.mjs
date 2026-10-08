/**
 * Garde CI des redirections (Lot C0.3, brief « Conquête IA », 09/2026 ; étape 6 : audit indexation 07/10/2026).
 *
 * Vérifie, sur vercel.json + public/sitemap.xml + public/prerendered/*.html (tous fraîchement régénérés par le prérendu) :
 *   1. forme : sources/destinations en « /… », sans query ni slash final, sources uniques, permanent:true ;
 *   2. AUCUNE chaîne : aucune destination n'est une source (exacte ou motif) ;
 *   3. aucune source de redirection n'est aussi une source de rewrite (page prérendue inatteignable) ;
 *   4. aucune URL du sitemap (<loc> ou alternate hreflang) n'est une source de redirection ;
 *   5. --expect <json> : chaque paire {from,to} attendue existe avec cette destination exacte (un saut) ;
 *   6. HTML prérendu + llms.txt : aucune URL interne ne déclenche de redirection. Sont lus : href des
 *      <a>/<area>/<link> (dont canonical et hreflang), og:url, dans le JSON-LD les clés item, url, @id,
 *      mainEntityOfPage, sameAs et target, et les liens de public/llms.txt et public/en/llms.txt. Est interne une
 *      URL relative en « / » ou dont l'hôte est lavillacoliving.com ou *.lavillacoliving.com ; les liens externes
 *      (le sameAs Instagram finit par « / »), mailto:, tel:, ancres et fichiers statiques (images, /assets,
 *      CSV, PDF, XML, TXT…) sont ignorés. Faute si l'URL est : une source de redirection de vercel.json (règle
 *      exacte ou motif :param, comparée au chemin percent-encodé comme Vercel) ; un chemin à slash final hors
 *      racine (trailingSlash:false → 308) ; l'apex lavillacoliving.com (307 → www) ; en http://. La query
 *      (/candidature?src=…) n'est pas une faute. Né du fil d'Ariane EN : 45 pages déclaraient « …/en/ » (308).
 *      ÉCHEC pour tout ce que le code génère ; simple AVERTISSEMENT pour un lien d'une page d'article écrit dans
 *      le markdown de cet article en base (__blog_post_data__) : du contenu, à repointer par le dashboard ou en
 *      SQL, qui ne doit pas bloquer le bot (ni les rafraîchissements de disponibilité). Cas typique : un article
 *      renommé avec sa 308, que d'autres articles lient encore par l'ancien slug.
 *      --no-html : saute l'étape 6 (contrôler vercel.json seul contre un public/prerendered pas encore régénéré).
 *      --dist    : scanne aussi dist/**.html. Hors CI seulement : en CI, dist/ est copié par « vite build » AVANT
 *                  le prérendu et contient donc le HTML du commit précédent (faux échecs le jour d'un correctif).
 *   En CI (GITHUB_ACTIONS), échecs et avertissements sont aussi publiés en annotations (10 de chaque au plus),
 *   lisibles sans compte GitHub connecté, comme pour hydration-check.
 *   --net [base]  : après déploiement, HEAD sur chaque paire attendue (ou --all) → 3xx + Location = to, puis to → 200 ;
 *                   plus l'apex (https://lavillacoliving.com/ et /tarifs → www) : 308/301 attendu, mais un 307 n'est
 *                   qu'un AVERTISSEMENT (réglage Vercel > Settings > Domains, hors repo).
 * Échec = process.exit(1) (modèle scripts/house-pages-check.mjs). Exécuté par prerender.yml après le prérendu
 * (sans --net) : un échec = pas de commit du bot, donc pas de déploiement.
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadConfig, sourceToRegExp, normalizePath } from './redirects.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SITEMAP = path.join(ROOT, 'public', 'sitemap.xml');
const PRERENDERED_DIR = path.join(ROOT, 'public', 'prerendered');
const DIST_DIR = path.join(ROOT, 'dist');
const LLMS_FILES = ['public/llms.txt', 'public/en/llms.txt']; // générés par npm run build:llms, servis tels quels
const SITE_ORIGIN = 'https://www.lavillacoliving.com';
const SITE_HOST = 'www.lavillacoliving.com';
const APEX_HOST = 'lavillacoliving.com';
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

// ─── 6. URL internes du HTML prérendu ────────────────────────────────────────

const ASSET_EXT = /\.(?:png|jpe?g|webp|avif|gif|svg|ico|bmp|css|js|mjs|map|json|webmanifest|xml|txt|csv|pdf|woff2?|ttf|otf|eot|mp4|webm|mov|mp3)$/i;
const ASSET_DIR = /^\/(?:assets|images|logos|fonts|videos|icons)\//;
// Clés JSON-LD qui portent une URL de page (image, logo, contentUrl désignent des fichiers : hors périmètre).
const JSONLD_KEYS = new Set(['item', 'url', '@id', 'mainEntityOfPage', 'sameAs', 'target']);
// Page d'article prérendue (blog-<slug>.html, en-blog-<slug>.html) — pas l'index blog.html.
const BLOG_ARTICLE_FILE = /(?:^|\/)(?:en-)?blog-[^/]+\.html$/;

function decodeEntities(s) {
  return s
    .replace(/&quot;/g, '"').replace(/&#0*39;|&apos;|&#x0*27;/gi, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#x0*2F;|&#0*47;/gi, '/')
    .replace(/&amp;|&#0*38;/g, '&');
}

function attrOf(attrs, name) {
  const m = attrs.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'>]+))`, 'i'));
  return m ? decodeEntities(m[1] ?? m[2] ?? m[3] ?? '') : null;
}

/** Index des sources de redirection : exactes + motifs (:slug, :path*) compilés une fois. */
export function redirectIndex(config) {
  const exact = new Map();
  const patterns = [];
  for (const r of config.redirects ?? []) {
    if (r.source.includes(':')) patterns.push({ re: sourceToRegExp(r.source), r });
    else exact.set(r.source, r);
  }
  return { exact, patterns, find: (p) => exact.get(p) ?? patterns.find((x) => x.re.test(p))?.r ?? null };
}

/**
 * URL candidates d'une page : href (<a>, <area>, <link> — canonical, hreflang…), og:url, et clés item/url/@id
 * du JSON-LD. Les autres <script> (état d'hydratation, article embarqué) sont ignorés : leurs liens sont déjà
 * rendus dans le DOM. Retourne [{ kind, raw }].
 */
export function extractHtmlUrls(html) {
  const out = [];
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (!/type\s*=\s*["']?application\/ld\+json/i.test(m[1])) continue;
    let data;
    try { data = JSON.parse(m[2]); } catch { data = undefined; }
    if (data === undefined) {
      // JSON-LD illégal (le seo-lint le signale) : repli regex, pour ne rien laisser passer.
      for (const x of m[2].matchAll(/"(item|url|@id|mainEntityOfPage|sameAs|target)"\s*:\s*"([^"]+)"/g)) out.push({ kind: `JSON-LD ${x[1]}`, raw: x[2] });
      continue;
    }
    const walk = (node, key) => {
      if (typeof node === 'string') { if (JSONLD_KEYS.has(key)) out.push({ kind: `JSON-LD ${key}`, raw: node }); return; }
      if (Array.isArray(node)) { for (const v of node) walk(v, key); return; }
      if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) walk(v, k);
    };
    walk(data, null);
  }
  const markup = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  for (const m of markup.matchAll(/<(a|area|link)\b([^>]*)>/gi)) {
    const href = attrOf(m[2], 'href');
    if (href === null) continue;
    let kind = 'href';
    if (m[1].toLowerCase() === 'link') {
      const rel = (attrOf(m[2], 'rel') ?? '').toLowerCase();
      const lang = attrOf(m[2], 'hreflang');
      kind = rel === 'canonical' ? 'canonical' : lang ? `hreflang ${lang}` : `link rel=${rel || '?'}`;
    }
    out.push({ kind, raw: href });
  }
  for (const m of markup.matchAll(/<meta\b([^>]*)>/gi)) {
    if ((attrOf(m[1], 'property') ?? attrOf(m[1], 'name')) === 'og:url') {
      const c = attrOf(m[1], 'content');
      if (c !== null) out.push({ kind: 'og:url', raw: c });
    }
  }
  return out;
}

/**
 * Audit d'une URL : null si elle est hors périmètre (externe, ancre, mailto/tel, fichier statique, relative sans
 * « / » initial), sinon { url, path, reasons, fix } — reasons vide = URL saine.
 * `index` = redirectIndex(config).
 */
export function auditInternalUrl(raw, index) {
  const s = decodeEntities(String(raw)).trim();
  if (!s || s.startsWith('#')) return null;
  const absolute = /^https?:\/\//i.test(s) || s.startsWith('//');
  if (!absolute && !s.startsWith('/')) return null; // mailto:, tel:, javascript:, data:, relatif exotique
  let u;
  try { u = new URL(s, `${SITE_ORIGIN}/`); } catch { return null; }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
  const host = u.hostname.toLowerCase();
  if (host !== APEX_HOST && !host.endsWith(`.${APEX_HOST}`)) return null; // externe
  const p = u.pathname; // percent-encodé, comme le chemin que Vercel compare aux sources
  if (ASSET_EXT.test(p) || ASSET_DIR.test(p)) return null;
  const reasons = [];
  if (u.protocol === 'http:') reasons.push('http (308 vers https)');
  if (host === APEX_HOST) reasons.push('apex sans www (307 vers www)');
  else if (host !== SITE_HOST) return reasons.length ? { url: s, path: p, reasons, fix: s.replace(/^http:/i, 'https:') } : null; // autre sous-domaine (sign.…) : seul le http compte
  let fixPath = p;
  if (p.length > 1 && p.endsWith('/')) {
    reasons.push('slash final (trailingSlash:false → 308)');
    fixPath = p.replace(/\/+$/, '') || '/';
  }
  const hit = index.find(fixPath);
  if (hit) {
    reasons.push(`source de redirection (→ ${hit.destination})`);
    fixPath = hit.destination;
  }
  return { url: s, path: p, reasons, fix: `${absolute ? SITE_ORIGIN : ''}${fixPath}${u.search}` };
}

/** URL d'un fichier texte (llms.txt) : URL absolues du site et cibles de liens markdown relatives « ](/…) ». */
export function extractTextUrls(text) {
  const out = [];
  for (const m of text.matchAll(/https?:\/\/(?:[a-z0-9-]+\.)*lavillacoliving\.com[^\s)<>\]"'`]*/gi)) out.push({ kind: 'lien', raw: m[0].replace(/[.,;:!?]+$/, '') });
  for (const m of text.matchAll(/\]\((\/[^)\s]*)\)/g)) out.push({ kind: 'lien', raw: m[1] });
  return out;
}

/** Markdown du corps d'un article prérendu (__blog_post_data__ : post.content_fr + post.content_en), sinon null. */
export function blogMarkdownOf(html) {
  const m = html.match(/<script\b[^>]*\bid\s*=\s*["']?__blog_post_data__["']?[^>]*>([\s\S]*?)<\/script>/i);
  if (!m) return null;
  try {
    const d = JSON.parse(m[1]);
    const p = d?.post ?? d;
    return [p?.content_fr, p?.content_en].filter((c) => typeof c === 'string').join('\n');
  } catch { return null; }
}

/** Le markdown lie-t-il ce chemin ? (`/en` retiré : BlogPostPage localise les liens du corps à l'affichage.) */
function markdownMentions(md, p) {
  const variants = new Set([p, p.replace(/^\/en(?=\/)/, '')]);
  for (const v of [...variants]) { try { variants.add(decodeURI(v)); } catch { /* chemin mal encodé : variante brute seule */ } }
  for (const v of variants) {
    for (let i = md.indexOf(v); i !== -1; i = md.indexOf(v, i + 1)) {
      const next = md[i + v.length];
      if (next === undefined || !/[\w%-]/.test(next)) return true;
    }
  }
  return false;
}

/**
 * Étape 6 : `pages` = [{ name, html }] ou [{ name, urls }] (fichier texte déjà extrait, ex. llms.txt). Une ligne
 * par couple (URL, type), avec le nombre de fichiers.
 * - ÉCHEC : tout ce que le code génère (canonical, hreflang, og:url, JSON-LD, liens de gabarit, llms.txt).
 * - AVERTISSEMENT : un href d'une page d'article (blog-*.html) écrit dans le markdown de CET article en base
 *   (__blog_post_data__). C'est du contenu, corrigé par le dashboard ou en SQL : il ne doit pas bloquer le bot
 *   (donc les rafraîchissements de disponibilité). Cas typique : un article renommé avec sa 308, que d'autres
 *   articles lient encore par l'ancien slug. Classement fichier par fichier : la même URL trouvée dans le gabarit
 *   (autre page, ou article dont le markdown ne la cite pas) reste un échec.
 */
export function checkHtml(config, pages) {
  const index = redirectIndex(config);
  const hits = new Map();
  const markdown = new Map(); // nom de fichier → markdown du corps (pages d'article seulement)
  let urls = 0;
  for (const { name, html, urls: given } of pages) {
    if (html && BLOG_ARTICLE_FILE.test(name)) { const md = blogMarkdownOf(html); if (md !== null) markdown.set(name, md); }
    for (const { kind, raw } of given ?? extractHtmlUrls(html)) {
      const a = auditInternalUrl(raw, index);
      if (!a) continue;
      urls++;
      if (a.reasons.length === 0) continue;
      // Classement par fichier : la même URL peut être du contenu dans un article et du gabarit ailleurs.
      const content = kind === 'href' && markdown.has(name) && markdownMentions(markdown.get(name), a.path);
      const key = `${a.url}\u0000${kind}\u0000${content ? 'contenu' : 'code'}`;
      if (!hits.has(key)) hits.set(key, { ...a, kind, content, files: new Set() });
      hits.get(key).files.add(name);
    }
  }
  const all = [...hits.values()].sort((x, y) => y.files.size - x.files.size || x.url.localeCompare(y.url));
  const line = (h) => {
    const files = [...h.files].sort();
    const sample = files.slice(0, 4).join(', ') + (files.length > 4 ? `, … (+${files.length - 4})` : '');
    return `« ${h.url} » (${h.kind}) — ${h.reasons.join(' + ')} — écrire « ${h.fix} » — ${files.length} fichier(s) : ${sample}`;
  };
  const failures = all.filter((h) => !h.content).map((h) => `html : ${line(h)}`);
  const warnings = all.filter((h) => h.content).map((h) => `contenu d'article (non bloquant, à repointer en base) : ${line(h)}`);
  return { failures, warnings, hits: all, counts: { files: pages.length, urls } };
}

async function readHtmlFiles(dir, { recursive = false, label = path.relative(ROOT, dir) } = {}) {
  const out = [];
  const walk = async (d) => {
    let entries;
    try { entries = await fs.readdir(d, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { if (recursive) await walk(p); }
      else if (e.name.endsWith('.html')) out.push({ name: `${label}/${path.relative(dir, p)}`, html: await fs.readFile(p, 'utf8') });
    }
  };
  await walk(dir);
  return out;
}

/** --net : l'apex doit rediriger vers www en permanent. Avertissements seulement (réglage Vercel hors repo). */
async function checkApex() {
  const warnings = [];
  for (const p of ['/', '/tarifs']) {
    const from = `https://${APEX_HOST}${p}`;
    const want = `${SITE_ORIGIN}${p}`;
    try {
      const r = await fetch(from, { method: 'HEAD', redirect: 'manual', headers: { 'User-Agent': 'Mozilla/5.0 (check-redirects)' } });
      const loc = r.headers.get('location');
      const target = loc ? new URL(loc, from).href : null;
      if (target !== want) warnings.push(`apex : ${from} → ${target ?? 'aucune redirection'} (HTTP ${r.status}), attendu ${want}`);
      else if (![301, 308].includes(r.status)) warnings.push(`apex : ${from} répond ${r.status} (temporaire) vers www — attendu 308 : Vercel > Settings > Domains > ${APEX_HOST} (hors vercel.json)`);
    } catch (e) {
      warnings.push(`apex : ${from} — erreur réseau ${e.message}`);
    }
  }
  return warnings;
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
  console.log('\n🔀 Garde redirections — vercel.json × public/sitemap.xml × HTML prérendu\n');
  const config = await loadConfig();
  const sitemap = await fs.readFile(SITEMAP, 'utf8').catch(() => '');
  const expectFile = opt('--expect');
  const expected = expectFile && expectFile !== true ? JSON.parse(await fs.readFile(path.resolve(expectFile), 'utf8')) : [];
  const { failures, warnings, counts } = checkStatic(config, sitemap, expected);
  console.log(`   ${counts.redirects} redirections · ${counts.sitemap} URL au sitemap · ${counts.expected} paire(s) attendue(s)`);
  let all = [...failures];
  // 6. HTML prérendu (public/prerendered ; dist/ sur demande, voir l'en-tête)
  if (args.includes('--no-html')) {
    console.log('   HTML : étape 6 sautée (--no-html)');
  } else {
    const pages = await readHtmlFiles(PRERENDERED_DIR);
    if (pages.length === 0) warnings.push('HTML : aucun fichier .html dans public/prerendered — étape 6 sans objet');
    if (args.includes('--dist')) pages.push(...(await readHtmlFiles(DIST_DIR, { recursive: true })));
    let llms = 0;
    for (const rel of LLMS_FILES) {
      const text = await fs.readFile(path.join(ROOT, rel), 'utf8').catch(() => null);
      if (text !== null) { pages.push({ name: rel, urls: extractTextUrls(text) }); llms++; }
    }
    const html = checkHtml(config, pages);
    console.log(`   HTML : ${html.counts.files - llms} fichier(s)${args.includes('--dist') ? ' (public/prerendered + dist)' : ' (public/prerendered)'} + ${llms} llms.txt · ${html.counts.urls} URL internes contrôlées`);
    all.push(...html.failures);
    warnings.push(...html.warnings);
  }
  const net = opt('--net');
  if (net) {
    const base = typeof net === 'string' ? net.replace(/\/$/, '') : 'https://www.lavillacoliving.com';
    const pairs = args.includes('--all') ? config.redirects.filter((r) => !r.source.includes(':')).map((r) => ({ from: r.source, to: r.destination })) : expected;
    console.log(`   --net : ${pairs.length} paire(s) testée(s) sur ${base} + apex`);
    all.push(...(await checkNet(base, pairs)));
    warnings.push(...(await checkApex()));
  }
  for (const w of warnings) console.log(`   ⚠️  ${w}`);
  for (const f of all) console.log(`   • ${f}`);
  // En CI : annotations lisibles sans compte GitHub connecté (API check-runs/…/annotations), comme hydration-check.
  // GitHub n'en affiche que 10 de chaque niveau par étape.
  if (process.env.GITHUB_ACTIONS) {
    const esc = (s) => s.slice(0, 900).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
    for (const f of all.slice(0, 10)) console.log(`::error title=check-redirects::${esc(f)}`);
    for (const w of warnings.slice(0, 10)) console.log(`::warning title=check-redirects::${esc(w)}`);
  }
  if (all.length > 0) {
    console.error(`\n❌ ${all.length} problème(s) de redirection.`);
    process.exit(1);
  }
  console.log(`\n🎉 Redirections saines : aucune chaîne, aucune URL du sitemap${args.includes('--no-html') ? '' : ' ni du HTML prérendu'} redirigée.\n`);
}

if (process.argv[1] && import.meta.url === (await import('url')).pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
}
