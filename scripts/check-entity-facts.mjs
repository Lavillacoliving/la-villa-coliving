/**
 * Garde CI de la fiche de faits canonique (Lot S1.3, brief « Socle entité », 05/09/2026).
 *
 * Compare la SOURCE (src/data/entityFacts.ts, chargée via esbuild) à :
 *   a) la BASE : v_public_rooms (clé anon, lecture seule) — chambres par maison et total, min/max rent_chf
 *      et rent_eur, chambres à salle d'eau partagée, surfaces = Math.round(min/max) (règle du Lot 7) ;
 *   b) le HTML prérendu : le bloc <aside id="entity-facts"> présent EXACTEMENT une fois sur les 14 pages
 *      money + 8 articles (FR et EN), version identique, chaque phrase canonique présente une fois ;
 *      0 bloc ailleurs ; aucune chaîne périmée (1 380 CHF, ménage 2×, 25-35 min, séjour 2 mois, bail 1 à
 *      12 mois, placeholders) dans le texte visible du site ; JSON-LD : ≤ 1 LocalBusiness/LodgingBusiness
 *      d'entité et ≤ 1 FAQPage par page, 0 aggregateRating, numberOfRooms cohérents ;
 *   c) public/llms.txt et public/en/llms.txt = régénération (scripts/build-llms-txt.mjs).
 * Options : --no-db (hors ligne) · --strict (règle des minutes et vouvoiement en échec, pas en avertissement)
 *           --json-ld /route (dump des blocs JSON-LD d'une page dans tools/out/) · --tutoiement (rapport)
 * Modèle : scripts/house-pages-check.mjs (collecte, impression, exit 1). Exécuté par prerender.yml après
 * house-pages-check et avant hydration-check. En local : `npm run check:facts` après `npm run build:local`.
 */
import fs from 'fs/promises';
import path from 'path';
import https from 'https';
import { fileURLToPath, pathToFileURL } from 'url';
import { loadEntityFacts, ROOT } from './lib/load-entity-facts.mjs';
import { renderLlms, LLMS_FILES } from './build-llms-txt.mjs';

const PRERENDERED = path.join(ROOT, 'public', 'prerendered');
const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i === -1 ? null : (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true); };
const STRICT = args.includes('--strict');

// Même projet / clé anon (lecture seule) que scripts/prerender.mjs et scripts/house-pages-check.mjs.
const SUPABASE_URL = 'https://tefpynkdxxfiefpkgitz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZnB5bmtkeHhmaWVmcGtnaXR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4OTg5NDksImV4cCI6MjA4NjQ3NDk0OX0.X_Z85w6L4i1IkVevMK73hpFRClCpgh0Gh0WMY9pdDtw';

/** Pages money porteuses du bloc (D13, décision Jérôme 05/09) — FR ; l'EN est le miroir /en/… */
export const ENTITY_FACTS_MONEY_ROUTES = ['/', '/le-coliving', '/nos-maisons', '/lavilla', '/leloft', '/lelodge', '/tarifs', '/faq', '/qui-sommes-nous', '/annemasse-colocation', '/chambre-a-louer-annemasse', '/colocation-geneve', '/chambre-a-louer-geneve', '/chambres-disponibles'];
/** Pages où le vouvoiement est légitime (légal, B2B). */
const VOUVOIEMENT_ALLOW = /^(en-)?(mentions-legales|politique-de-confidentialite|investisseurs)\.html$/;

const FORBIDDEN = [
  { re: /1[\u00A0\u202F ]?380 CHF|1,380 CHF|CHF 1,380/, label: 'ancien prix « 1 380 CHF »' },
  { re: /(2|deux) fois par semaine|twice a week|2[x×]\s?\/?\s?(semaine|week)\b/i, label: 'ménage « 2 fois par semaine »' },
  // « 25-35 minutes » n'est interdit que non qualifié (une piste cyclable via Moillesulaz peut prendre 25-35 min).
  { re: /25[\u00A0\u202F ]?(à|-|–|to)[\u00A0\u202F ]?35[\u00A0\u202F ]?min/i, label: '« 25 à 35 minutes » (trajet Genève non qualifié)', unlessQualified: true },
  { re: /minimum stay (?:of|is) two months|séjour minimum (?:de|est de) deux mois|minimum de deux mois/i, label: '« séjour minimum deux mois »' },
  { re: /bail flexible 1 à 12 mois|1 à 12 mois|1 to 12 months/i, label: '« bail 1 à 12 mois »' },
  { re: /\[FAIT À CONFIRMER|\[À VÉRIFIER|\{\{[A-Z_]+\}\}/, label: 'placeholder' },
];
const MINUTE_QUALIFIER = /\b(?:à pied|on foot|walk\w*|vélo|bike|cycl\w*|voiture|car|driving|aéroport|airport|bus|tram\w*|Cornavin|Eaux-Vives|CERN|Nations|heure de pointe|rush hour|gare|station|Léman Express|CEVA|Moillesulaz|frontière|border|visio|vidéo|video|appel|call|Annemasse[ -–↔]+Gen[èe]v[ea])\b/i;

function routeToFile(route, lang) {
  const r = lang === 'en' ? (route === '/' ? '/en' : `/en${route}`) : route;
  return r === '/' ? 'index.html' : `${r.slice(1).replace(/\//g, '-')}.html`;
}
function httpsGet(url, headers) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => (res.statusCode >= 200 && res.statusCode < 300 ? resolve(JSON.parse(data)) : reject(new Error(`HTTP ${res.statusCode}: ${data}`))));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}
function decodeEntities(s) {
  return s
    .replace(/&nbsp;/g, ' ').replace(/&#160;/g, ' ')
    .replace(/&#x27;|&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(parseInt(d, 10)))
    .replace(/&amp;/g, '&');
}
/** Texte visible (sans <head>, <script>, <style>, balises), entités décodées, blancs repliés (U+00A0 conservé). */
export function visibleText(html) {
  const body = html.replace(/^[\s\S]*?<\/head>/, '').replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<!--[\s\S]*?-->/g, ' ');
  return decodeEntities(body.replace(/<[^>]+>/g, ' ')).replace(/[ \t\r\n]+/g, ' ').trim();
}
/** Blocs de texte visibles (un par élément de bloc ou de lien : p, li, h1-h6, td, a, button, div…). */
export function textBlocks(html) {
  const body = html.replace(/^[\s\S]*?<\/head>/, '').replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<!--[\s\S]*?-->/g, ' ');
  return body.split(/<\/(?:p|li|h[1-6]|td|th|dd|dt|figcaption|blockquote|a|button|summary|label|span|div|section|article|aside|header|footer|nav)>/i)
    .map((chunk) => decodeEntities(chunk.replace(/<[^>]+>/g, ' ')).replace(/[ \t\r\n]+/g, ' ').trim())
    .filter(Boolean);
}
const norm = (s) => s.replace(/[ \t\r\n]+/g, ' ').trim();
const count = (hay, needle) => (needle ? hay.split(needle).length - 1 : 0);
function jsonLdBlocks(html) {
  const out = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try { out.push(JSON.parse(decodeEntities(m[1]))); } catch { out.push({ __invalid: m[1].slice(0, 80) }); }
  }
  return out;
}
function collectTypes(node, acc = []) {
  if (Array.isArray(node)) node.forEach((n) => collectTypes(n, acc));
  else if (node && typeof node === 'object') { if (node['@type']) acc.push(node); for (const v of Object.values(node)) collectTypes(v, acc); }
  return acc;
}

async function checkDb(m) {
  const failures = [];
  const F = m.ENTITY_FACTS;
  const rows = await httpsGet(`${SUPABASE_URL}/rest/v1/v_public_rooms?select=house_slug,rent_chf,rent_eur,surface_m2,bathroom_type`, { apikey: SUPABASE_ANON_KEY, Accept: 'application/json' });
  if (!Array.isArray(rows) || rows.length === 0) throw new Error('v_public_rooms vide');
  const byHouse = new Map();
  for (const r of rows) { if (!byHouse.has(r.house_slug)) byHouse.set(r.house_slug, []); byHouse.get(r.house_slug).push(r); }
  for (const h of F.houses) {
    const rs = byHouse.get(h.slug) ?? [];
    if (rs.length !== h.rooms) failures.push(`base : ${h.slug} a ${rs.length} chambre(s) dans v_public_rooms, la fiche dit ${h.rooms}`);
    const shared = rs.filter((r) => /shared|partag/i.test(String(r.bathroom_type ?? ''))).length;
    if (shared !== h.sharedBathRooms) failures.push(`base : ${h.slug} a ${shared} chambre(s) à salle d'eau partagée, la fiche dit ${h.sharedBathRooms}`);
  }
  if (rows.length !== F.totalRooms) failures.push(`base : ${rows.length} chambres publiques, la fiche dit ${F.totalRooms}`);
  const chf = rows.map((r) => Number(r.rent_chf)).filter(Number.isFinite);
  const eur = rows.map((r) => Number(r.rent_eur)).filter(Number.isFinite);
  const m2 = rows.map((r) => Number(r.surface_m2)).filter((n) => Number.isFinite(n) && n > 0);
  if (Math.min(...chf) !== F.price.fromChf) failures.push(`base : loyer CHF minimum ${Math.min(...chf)} ≠ prix d'appel ${F.price.fromChf}`);
  if (Math.max(...chf) !== F.price.standardChf) failures.push(`base : loyer CHF maximum ${Math.max(...chf)} ≠ ${F.price.standardChf}`);
  if (eur.length && Math.min(...eur) !== F.price.fromEur) failures.push(`base : loyer € minimum ${Math.min(...eur)} ≠ ${F.price.fromEur}`);
  if (eur.length && Math.max(...eur) !== F.price.standardEur) failures.push(`base : loyer € maximum ${Math.max(...eur)} ≠ ${F.price.standardEur}`);
  if (m2.length) {
    const lo = Math.round(Math.min(...m2)), hi = Math.round(Math.max(...m2));
    if (lo !== F.surfaces.min || hi !== F.surfaces.max) failures.push(`base : surfaces ${lo}-${hi} m² (Math.round de v_public_rooms) ≠ fiche ${F.surfaces.min}-${F.surfaces.max}`);
  }
  return { failures, rooms: rows.length };
}

async function checkHtml(m) {
  const failures = [], warnings = [];
  const F = m.ENTITY_FACTS;
  const files = (await fs.readdir(PRERENDERED)).filter((f) => f.endsWith('.html')).sort();
  const inScope = new Map(); // file → lang
  for (const r of ENTITY_FACTS_MONEY_ROUTES) { inScope.set(routeToFile(r, 'fr'), 'fr'); inScope.set(routeToFile(r, 'en'), 'en'); }
  for (const slug of m.ENTITY_FACTS_ARTICLES ?? []) { inScope.set(`blog-${slug}.html`, 'fr'); inScope.set(`en-blog-${slug}.html`, 'en'); }
  for (const f of inScope.keys()) if (!files.includes(f)) failures.push(`${f} : page prérendue ABSENTE (périmètre du bloc entité)`);
  const strings = { fr: m.entityFactsStrings('fr').map(norm), en: m.entityFactsStrings('en').map(norm) };
  let blocks = 0, minuteWarnings = 0, vousPages = 0;
  for (const f of files) {
    const html = await fs.readFile(path.join(PRERENDERED, f), 'utf8');
    const text = visibleText(html);
    const lang = inScope.get(f);
    const nBlocks = count(html, 'id="entity-facts"');
    if (lang) {
      blocks++;
      if (nBlocks !== 1) failures.push(`${f} : ${nBlocks} bloc(s) entité (attendu exactement 1)`);
      if (!html.includes(`data-entity-facts-version="${F.version}"`)) failures.push(`${f} : version du bloc ≠ ${F.version}`);
      for (const s of strings[lang]) {
        const n = count(text, s);
        if (n !== 1) failures.push(`${f} : phrase canonique présente ${n} fois (attendu 1) — « ${s.slice(0, 70)}… »`);
      }
    } else if (nBlocks > 0) failures.push(`${f} : bloc entité hors périmètre (${nBlocks})`);
    // Chaînes périmées (texte visible)
    if (!/^(en-)?(mentions-legales|politique-de-confidentialite)\.html$/.test(f)) {
      for (const fb of FORBIDDEN) {
        if (!fb.re.test(text)) continue;
        if (fb.unlessQualified) {
          // Interdit seulement dans une phrase sans qualificatif (à pied, vélo, Moillesulaz, aéroport…).
          const bad = textBlocks(html).flatMap((b) => b.split(/(?<=[.!?;])\s+/)).filter((sen) => fb.re.test(sen) && !MINUTE_QUALIFIER.test(sen));
          if (bad.length === 0) continue;
          failures.push(`${f} : ${fb.label} — « ${bad[0].slice(0, 120)}… »`);
          continue;
        }
        failures.push(`${f} : ${fb.label} dans le texte visible — « …${text.slice(Math.max(0, text.search(fb.re) - 60), text.search(fb.re) + 60)}… »`);
      }
    }
    // JSON-LD
    const nodes = collectTypes(jsonLdBlocks(html));
    const lb = nodes.filter((n) => n['@type'] === 'LocalBusiness').length;
    const lodgingOrg = nodes.filter((n) => n['@type'] === 'LodgingBusiness' && typeof n['@id'] === 'string' && n['@id'].endsWith('#organization')).length;
    const faq = nodes.filter((n) => n['@type'] === 'FAQPage').length;
    if (lb + lodgingOrg > 1) failures.push(`${f} : ${lb + lodgingOrg} fiches business d'entité (LocalBusiness/LodgingBusiness @organization) — une seule attendue`);
    if (faq > 1) failures.push(`${f} : ${faq} blocs FAQPage (un seul attendu)`);
    if (/aggregateRating/.test(html)) failures.push(`${f} : aggregateRating interdit (note 4,9 = NPS interne)`);
    for (const n of nodes) if (n.numberOfRooms !== undefined) {
      const ok = [F.totalRooms, ...F.houses.map((h) => h.rooms)].includes(Number(n.numberOfRooms));
      if (!ok) failures.push(`${f} : numberOfRooms=${n.numberOfRooms} hors {${[F.totalRooms, ...F.houses.map((h) => h.rooms)].join(',')}}`);
    }
    for (const n of nodes) if (n['@type'] === 'AggregateOffer' && (String(n.lowPrice) !== String(F.price.fromChf) || String(n.highPrice) !== String(F.price.standardChf))) failures.push(`${f} : AggregateOffer ${n.lowPrice}-${n.highPrice} ≠ ${F.price.fromChf}-${F.price.standardChf}`);
    // Règle des minutes (S2) : dans un bloc de texte (p, li, h*, td…) qui nomme Genève, toute valeur
    // « N min » ≠ canonique doit être qualifiée (à pied, tram, Cornavin, aéroport…). Temps de lecture ignorés.
    if (!/^(en-)?(observatoire|blog-(transport|temps-trajet|cout-transport))/.test(f)) {
      for (const block of textBlocks(html)) {
        for (const sentence of block.split(/(?<=[.!?;])\s+/)) {
          if (!/Gen[èe]v[ea]/i.test(sentence)) continue;
          const ms = [...sentence.matchAll(/(?<![\d,.])(\d{1,2})[\u00A0\u202F ]?(?:min\b|minutes?\b)(?![\u00A0\u202F ]?(?:de lecture|read))/gi)].map((x) => Number(x[1]));
          for (const v of ms) if (v !== F.genevaMinutes && !MINUTE_QUALIFIER.test(sentence)) { minuteWarnings++; (STRICT ? failures : warnings).push(`${f} : « ${v} min » non canonique ni qualifié — « ${sentence.slice(0, 110)}… »`); }
        }
      }
    }
    // Tutoiement (S4 — garde anti-régression, FR hors pages légales/B2B)
    if (!f.startsWith('en-') && !VOUVOIEMENT_ALLOW.test(f)) {
      const hits = [...text.matchAll(/(?<!rendez-)\bvous\b|\bvotre\b|\bvos\b/gi)].length;
      if (hits > 0) { vousPages++; (STRICT ? failures : warnings).push(`${f} : ${hits} forme(s) de vouvoiement`); }
    }
  }
  return { failures, warnings, files: files.length, blocks, minuteWarnings, vousPages };
}

async function checkLlms(m) {
  const failures = [];
  for (const lang of ['fr', 'en']) {
    const expected = await renderLlms(lang, m);
    const actual = await fs.readFile(LLMS_FILES[lang], 'utf8').catch(() => '');
    if (expected !== actual) failures.push(`${path.relative(ROOT, LLMS_FILES[lang])} : périmé par rapport à la source — lance « npm run build:llms »`);
  }
  return failures;
}

async function main() {
  console.log('\n🧾 Garde fiche entité — source × v_public_rooms × public/prerendered × llms.txt\n');
  const m = await loadEntityFacts();
  const failures = [];
  const internal = m.entityFactsIssues();
  failures.push(...internal.map((i) => `source : ${i}`));
  console.log(`   version ${m.ENTITY_FACTS.version} · ${m.ENTITY_FACTS.totalRooms} chambres · dès ${m.ENTITY_FACTS.price.fr.fromChf} · ${internal.length} incohérence(s) interne(s)`);
  if (!args.includes('--no-db')) {
    try { const db = await checkDb(m); failures.push(...db.failures); console.log(`${db.failures.length ? '❌' : '✅'} base : ${db.rooms} chambres publiques comparées`); }
    catch (e) { console.log(`⚠️  base injoignable (${e.message}) — comparaison ignorée`); }
  }
  const jsonDump = opt('--json-ld');
  if (typeof jsonDump === 'string') {
    const f = routeToFile(jsonDump.replace(/^\/en(\/|$)/, '/').replace(/\/$/, '') || '/', jsonDump.startsWith('/en') ? 'en' : 'fr');
    const html = await fs.readFile(path.join(PRERENDERED, f), 'utf8');
    const outDir = path.join(ROOT, 'tools', 'out'); await fs.mkdir(outDir, { recursive: true });
    const out = path.join(outDir, `jsonld-${f.replace('.html', '')}.json`);
    await fs.writeFile(out, JSON.stringify(jsonLdBlocks(html), null, 2));
    console.log(`   JSON-LD de ${f} → ${path.relative(ROOT, out)} (à coller dans validator.schema.org)`);
  }
  const h = await checkHtml(m);
  failures.push(...h.failures);
  console.log(`${h.failures.length ? '❌' : '✅'} HTML : ${h.files} fichiers, ${h.blocks} pages en périmètre (bloc attendu), ${h.minuteWarnings} minute(s) non canonique(s), ${h.vousPages} page(s) FR avec vouvoiement`);
  for (const w of h.warnings.slice(0, args.includes('--tutoiement') || args.includes('--verbose') ? 500 : 12)) console.log(`   ⚠️  ${w}`);
  if (h.warnings.length > 12 && !args.includes('--verbose') && !args.includes('--tutoiement')) console.log(`   ⚠️  … ${h.warnings.length - 12} avertissement(s) de plus (--verbose)`);
  const l = await checkLlms(m);
  failures.push(...l);
  console.log(`${l.length ? '❌' : '✅'} llms.txt FR/EN = régénération depuis la source`);
  for (const f of failures) console.log(`   • ${f}`);
  if (failures.length > 0) { console.error(`\n❌ ${failures.length} problème(s) — fiche entité NON publiable.`); process.exit(1); }
  console.log('\n🎉 Fiche entité cohérente : source = base = HTML = llms.txt.\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
}
