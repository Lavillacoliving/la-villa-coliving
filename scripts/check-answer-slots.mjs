/**
 * Garde CI des créneaux de réponse (Lot L1 « Ingénierie des créneaux », brief v3.1 du 09/10/2026 — sous-lot L1.F).
 *
 * Compare la SOURCE UNIQUE (src/data/answerSlots.ts + src/data/ouChercherArticles.ts, chargées via esbuild) au HTML
 * prérendu de public/prerendered :
 *   1. M1 — le bloc <section id="ou-chercher"> est présent EXACTEMENT une fois sur 4 pages money + les articles de
 *      OU_CHERCHER_ARTICLES (FR et EN = 18 fichiers), version = OU_CHERCHER_VERSION, variante attendue, texte rendu
 *      = ouChercherStrings(lang, variante) au caractère près (blancs repliés, U+00A0 conservé) ; 0 bloc ailleurs.
 *   2. Position dans les articles : l'élément qui suit le bloc est le H2 d'ancrage (titre copié de la base) ou le bloc
 *      entité (<aside id="entity-facts">) pour l'ancre « before-entity-facts ».
 *   3. M2/M3/M4 — les créneaux (phrases de commune, ligne de tableau budget/comparatif/coût de la vie, réponse « sans
 *      fiche de salaire », phrase garant) sont dans le texte visible des pages cibles (L1_TARGETS), asides retirés
 *      (bloc offre et bloc entité portent la marque). Mode ADAPTATIF : voir ANSWER_SLOTS_LIVE.
 *   4. Aucun marqueur orphelin (« <!-- » visible) sur AUCUNE page prérendue.
 *   5. Aucune promesse sur le garant interdite (D6) dans le texte visible — adaptatif pour les articles en base.
 *   6. Densité : plus de 12 « La Villa Coliving » visibles sur une page du périmètre → avertissement.
 * Options : --m1-only (règles 1, 2, 4 : vert local avant la séance SQL) · --json · --verbose (tous les avertissements).
 * Modèle : scripts/check-entity-facts.mjs (dont on réutilise routeToFile, visibleText, textBlocks). Exécuté par
 * prerender.yml après check-entity-facts et avant hydration-check. En local : `npm run check:slots` après `npm run build:local`.
 */
import fs from 'fs/promises';
import path from 'path';
import { pathToFileURL } from 'url';
import { loadEntityFacts, ROOT } from './lib/load-entity-facts.mjs';
import { routeToFile, visibleText, textBlocks } from './check-entity-facts.mjs';

/**
 * Bascule du mode adaptatif. false tant que le SQL du lot (créneaux M2/M3/M4 copiés dans les articles) n'est pas
 * appliqué en base : un créneau absent d'un article n'est qu'un AVERTISSEMENT, sauf si l'état embarqué de l'article
 * (script#__blog_post_data__ = contenu de la base au prérendu) contient déjà le texte — le SQL est passé et le prérendu
 * ne le montre pas : ÉCHEC. Le commit de gel passe la constante à true après la séance SQL : tout créneau absent
 * devient un échec. Les pages money (créneaux en JSX) sont toujours strictes.
 */
export const ANSWER_SLOTS_LIVE = false;

const PRERENDERED = path.join(ROOT, 'public', 'prerendered');
const args = process.argv.slice(2);

/** Pages money porteuses du bloc M1 (JSX) → variante. Les articles viennent de OU_CHERCHER_ARTICLES (source, pas une copie). */
export const OU_CHERCHER_MONEY_ROUTES = Object.freeze({
  '/colocation-geneve': 'full',
  '/chambre-a-louer-geneve': 'full',
  '/annemasse-colocation': 'short',
  '/chambre-a-louer-annemasse': 'short',
});

/**
 * Cibles M2/M3/M4 : route → clés de créneaux, résolues par resolveNeedle() depuis la source unique.
 * `commune:<slug>[:<openedIn>]` = communeSentence · `guarantor` = GUARANTOR_SENTENCE · sinon le nom de la fonction
 * (a6Text, budgetRowLabel, budgetVariantText, comparatifRowLabel, coutDeLaVieRowLabel). Chaque route est vérifiée en FR et EN.
 */
export const L1_TARGETS = Object.freeze([
  { route: '/annemasse-colocation', needles: ['commune:lelodge', 'commune:lavilla', 'commune:leloft'] },
  { route: '/chambre-a-louer-annemasse', needles: ['commune:lelodge', 'commune:lavilla', 'commune:leloft'] },
  { route: '/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher', needles: ['commune:lelodge', 'commune:lavilla', 'commune:leloft'] },
  { route: '/blog/quartiers-annemasse-ou-vivre-selon-profil', needles: ['commune:lelodge'] },
  { route: '/blog/colocation-annemasse-ville-la-grand-ambilly', needles: ['commune:lelodge', 'commune:lavilla', 'commune:leloft'] },
  { route: '/blog/vivre-a-annemasse-quand-on-travaille-a-geneve', needles: ['commune:lelodge:2026', 'commune:lelodge'] },
  { route: '/blog/budget-colocation-geneve-guide-complet', needles: ['budgetRowLabel', 'budgetVariantText', 'a6Text'] },
  { route: '/blog/cout-de-la-vie-suisse-france-frontalier-2026', needles: ['coutDeLaVieRowLabel'] },
  { route: '/blog/coliving-colocation-ou-studio-geneve-comparatif', needles: ['comparatifRowLabel'] },
  { route: '/blog/s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france', needles: ['a6Text', 'guarantor'] },
  { route: '/blog/trouver-colocation-geneve-frontalier', needles: ['a6Text'] },
  { route: '/blog/living-in-france-working-in-geneva', needles: ['a6Text'] },
  { route: '/blog/demenager-geneve-frontalier-checklist', needles: ['a6Text'] },
  { route: '/blog/dossier-location-frontalier-suisse-france', needles: ['a6Text'] },
]);

/** Promesses sur le garant interdites (D6). « sans garant français » n'est PAS interdit (titre d'article). */
export const FORBIDDEN_PHRASES = Object.freeze([
  { re: /tu auras besoin d['’]un garant/i, label: '« tu auras besoin d\'un garant »' },
  { re: /you['’]ll need a guarantor/i, label: '« you\'ll need a guarantor »' },
  { re: /you will need a guarantor/i, label: '« you will need a guarantor »' },
  { re: /no French guarantor/i, label: '« no French guarantor »' },
]);

/**
 * Occurrences exemptées de la règle garant : le titre EN de l'article « dossier-location-frontalier-suisse-france »
 * (« Renting in France with No French Guarantor: The Cross-Border Guide »), miroir du titre FR « …sans garant français »
 * que le brief exclut explicitement. Il s'affiche sur l'index du blog, en H1 de l'article et dans les cartes « articles
 * liés » des autres articles EN. Retirer l'entrée si le titre est renommé (la règle redeviendrait alors visible).
 */
export const FORBIDDEN_EXEMPT = Object.freeze([/Renting in France with No French Guarantor: The Cross-Border Guide/g]);
export function exemptForbidden(text) {
  let t = String(text);
  for (const re of FORBIDDEN_EXEMPT) t = t.replace(re, ' ');
  return t;
}

export const BRAND = 'La Villa Coliving';
export const BRAND_MAX = 12;

// ── Fonctions pures (testées dans tools/test/answer-slots.test.mjs) ───────────────────────────────────────────────

/** Repli des blancs (espace, tabulation, retours) en un espace — U+00A0 conservé, comme visibleText(). */
export const normalizeNeedle = (s) => String(s).replace(/[ \t\r\n]+/g, ' ').trim();
const norm = normalizeNeedle;

/** Le créneau est-il dans le texte (les deux côtés repliés de la même façon) ? */
export function hasNeedle(text, needle) {
  return norm(text).includes(norm(needle));
}

/** Résout une clé de L1_TARGETS en phrase canonique pour une langue. */
export function resolveNeedle(m, key, lang) {
  const [kind, slug, opened] = key.split(':');
  if (kind === 'commune') return m.communeSentence(slug, lang, opened ? { openedIn: Number(opened) } : {});
  if (kind === 'guarantor') return m.GUARANTOR_SENTENCE[lang];
  if (['a6Text', 'budgetRowLabel', 'budgetVariantText', 'comparatifRowLabel', 'coutDeLaVieRowLabel'].includes(kind)) return m[kind](lang);
  throw new Error(`check-answer-slots : clé de créneau inconnue « ${key} »`);
}

/** Les 18 fichiers porteurs du bloc M1 : 4 pages money + les articles de OU_CHERCHER_ARTICLES, FR puis EN. */
export function ouChercherPerimeter(m) {
  const out = [];
  for (const lang of ['fr', 'en']) {
    for (const [route, variant] of Object.entries(OU_CHERCHER_MONEY_ROUTES)) out.push({ route, lang, file: routeToFile(route, lang), variant, kind: 'money', anchor: null });
    for (const [slug, entry] of Object.entries(m.OU_CHERCHER_ARTICLES)) {
      const route = `/blog/${slug}`;
      out.push({ route, lang, file: routeToFile(route, lang), variant: entry.variant, kind: 'article', anchor: entry.anchor });
    }
  }
  return out;
}

/** Attributs name="value" d'une balise ouvrante. */
export function tagAttrs(tag) {
  const out = {};
  for (const m of String(tag).matchAll(/([a-zA-Z_:][-a-zA-Z0-9_:.]*)="([^"]*)"/g)) out[m[1]] = m[2];
  return out;
}

export const countOuChercher = (html) => String(html).split('id="ou-chercher"').length - 1;

/**
 * Extrait la <section id="ou-chercher"> (imbrication de <section> gérée) : { html, attrs, after } où `after` est le
 * HTML qui suit la balise fermante. null si absente ; `unclosed: true` si jamais fermée.
 */
export function extractOuChercherSection(html) {
  const open = /<section\b[^>]*\bid="ou-chercher"[^>]*>/i.exec(html);
  if (!open) return null;
  const start = open.index;
  const re = /<\/?section\b[^>]*>/gi;
  re.lastIndex = start + open[0].length;
  let depth = 1, t;
  while ((t = re.exec(html)) !== null) {
    depth += t[0][1] === '/' ? -1 : 1;
    if (depth === 0) {
      const end = t.index + t[0].length;
      return { html: html.slice(start, end), attrs: tagAttrs(open[0]), after: html.slice(end) };
    }
  }
  return { html: html.slice(start), attrs: tagAttrs(open[0]), after: '', unclosed: true };
}

/**
 * Compare les blocs de texte rendus (h2, h3, p — ordre du DOM, entités décodées, blancs repliés) aux chaînes
 * canoniques : { ok, actual, expected, diffs: [{ index, actual, expected }] }.
 */
export function compareBlocks(sectionHtml, expectedStrings) {
  const actual = textBlocks(sectionHtml);
  const expected = expectedStrings.map(norm);
  const diffs = [];
  for (let i = 0; i < Math.max(actual.length, expected.length); i++) {
    if (actual[i] !== expected[i]) diffs.push({ index: i, actual: actual[i] ?? null, expected: expected[i] ?? null });
  }
  return { ok: diffs.length === 0, actual, expected, diffs };
}

/**
 * Premier élément après la fin du bloc : blancs, commentaires (marqueurs React <!--$--> et <!-- -->) et balises
 * OUVRANTES d'habillage (<div>, <span>) ignorés. { tag, attrs, html, text } — tag null s'il ne reste rien d'exploitable
 * (fin du conteneur, texte nu…).
 */
export function nextElementAfter(after) {
  let s = String(after);
  for (;;) {
    s = s.replace(/^\s+/, '');
    if (s.startsWith('<!--')) {
      const e = s.indexOf('-->');
      if (e === -1) return { tag: null, attrs: {}, html: '', text: '' };
      s = s.slice(e + 3);
      continue;
    }
    const wrap = /^<(div|span)\b[^>]*>/i.exec(s);
    if (wrap) { s = s.slice(wrap[0].length); continue; }
    break;
  }
  const open = /^<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/.exec(s);
  if (!open) return { tag: null, attrs: {}, html: s.slice(0, 80), text: norm(visibleText(s.slice(0, 200))) };
  const tag = open[1].toLowerCase();
  const close = s.toLowerCase().indexOf(`</${tag}>`);
  const html = close === -1 ? open[0] : s.slice(0, close + tag.length + 3);
  return { tag, attrs: tagAttrs(open[0]), html, text: tag === 'aside' ? '' : norm(visibleText(html)) };
}

const describeElement = (el) => (el.tag
  ? `<${el.tag}${el.attrs?.id ? ` id="${el.attrs.id}"` : ''}>${el.text ? ` « ${el.text.slice(0, 80)} »` : ''}`
  : `(aucun élément : « ${String(el.html ?? '').slice(0, 60)} »)`);

/** Règle 2 : l'élément après le bloc est le H2 d'ancrage (texte = titre de l'allowlist) ou <aside id="entity-facts">. */
export function checkAnchorAfter(after, anchor, lang) {
  const el = nextElementAfter(after);
  if (anchor.kind === 'before-entity-facts') {
    return { ok: el.tag === 'aside' && el.attrs.id === 'entity-facts', found: describeElement(el), expected: '<aside id="entity-facts">' };
  }
  const title = norm(anchor[lang]);
  return { ok: el.tag === 'h2' && el.text === title, found: describeElement(el), expected: `<h2> « ${title} »` };
}

/** Règle 4 : « <!-- » (ou « &lt;!-- » encore encodé) dans le texte visible = marqueur de contenu rendu en texte. */
export function orphanMarkers(html) {
  const text = visibleText(html);
  const hits = [];
  for (const needle of ['<!--', '&lt;!--']) {
    const i = text.indexOf(needle);
    if (i !== -1) hits.push(text.slice(Math.max(0, i - 40), i + 60));
  }
  return hits;
}

/** Retire tous les <aside …>…</aside> (imbriqués compris) : le bloc offre et le bloc entité portent la marque. */
export function stripAsides(html) {
  const s = String(html);
  let out = '', depth = 0, last = 0;
  for (const t of s.matchAll(/<\/?aside\b[^>]*>/gi)) {
    if (t[0][1] !== '/') { if (depth === 0) out += s.slice(last, t.index); depth++; }
    else if (depth > 0) { depth--; if (depth === 0) last = t.index + t[0].length; }
  }
  return depth === 0 ? out + s.slice(last) : out;
}

/** État embarqué { post, related } d'un article prérendu (script#__blog_post_data__) ; null si absent ou illisible. */
export function embeddedBlogData(html) {
  const t = /<script type="application\/json" id="__blog_post_data__">([\s\S]*?)<\/script>/.exec(String(html));
  if (!t) return null;
  try { return JSON.parse(t[1]); } catch { return null; }
}

/** Markdown de l'article tel qu'en base pour une langue (content_fr / content_en) ; null si pas d'état embarqué. */
export function embeddedContent(html, lang) {
  const c = embeddedBlogData(html)?.post?.[lang === 'en' ? 'content_en' : 'content_fr'];
  return typeof c === 'string' ? c : null;
}

/**
 * Tout le texte venu de la base et embarqué dans la page : article (contenu, titre, extrait, meta) et cartes « articles
 * liés » (titre, extrait). Une phrase visible absente d'ici vient du code ou du rendu, pas de la base. null sans état.
 */
export function embeddedAllText(html, lang) {
  const d = embeddedBlogData(html);
  if (!d?.post) return null;
  const sfx = lang === 'en' ? '_en' : '_fr';
  const pick = (o) => ['content', 'title', 'excerpt', 'meta_description'].map((k) => o?.[`${k}${sfx}`]).filter((v) => typeof v === 'string');
  return [...pick(d.post), ...(Array.isArray(d.related) ? d.related.flatMap(pick) : [])].join('\n');
}

/** Markdown sans marqueurs inline (gras, code, liens → texte, images retirées) pour y chercher un créneau. Les tokens {{…}} restent tels quels. */
export function plainMarkdown(md) {
  return String(md)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\*\*|__|`|\*/g, '');
}

/** Le créneau est-il déjà dans la base (état embarqué) ? true / false / null (état absent : inconnu). */
export function embeddedHasText(html, lang, needle) {
  const c = embeddedContent(html, lang);
  return c === null ? null : hasNeedle(plainMarkdown(c), needle);
}

export const brandCount = (text) => String(text).split(BRAND).length - 1;

/** Page alimentée par la base (index du blog et articles) : adaptative tant que ANSWER_SLOTS_LIVE = false. */
export const isDbPage = (file) => /^(en-)?blog(-.+)?\.html$/.test(file);

// ── Vérification complète sur une Map fichier → HTML ─────────────────────────────────────────────────────────────

export function runChecks(m, pages, { m1Only = false, live = ANSWER_SLOTS_LIVE } = {}) {
  const failures = [], warnings = [];
  const files = [...pages.keys()].sort();
  const stats = { files: files.length, sourceIssues: 0, perimeter: 0, blocksOk: 0, m1Failures: 0, outOfScope: 0, orphanPages: 0, needlesChecked: 0, needleFailures: 0, needleWarnings: 0, forbiddenFailures: 0, forbiddenWarnings: 0, densityPages: 0 };
  const push = (list, counter, msg) => { list.push(msg); stats[counter]++; };

  // Source
  for (const i of m.answerSlotsIssues()) push(failures, 'sourceIssues', `source : ${i}`);

  // M1 + position
  const perimeter = ouChercherPerimeter(m);
  stats.perimeter = perimeter.length;
  const inScope = new Set(perimeter.map((p) => p.file));
  for (const p of perimeter) {
    const html = pages.get(p.file);
    if (html === undefined) { push(failures, 'm1Failures', `${p.file} : page prérendue ABSENTE (périmètre du bloc « Où chercher »)`); continue; }
    const n = countOuChercher(html);
    let ok = true;
    if (n !== 1) { ok = false; push(failures, 'm1Failures', `${p.file} : ${n} bloc(s) « Où chercher » (attendu exactement 1)`); if (n === 0) continue; }
    const sec = extractOuChercherSection(html);
    if (!sec || sec.unclosed) { push(failures, 'm1Failures', `${p.file} : <section id="ou-chercher"> introuvable ou jamais fermée`); continue; }
    const version = sec.attrs['data-ou-chercher-version'], variant = sec.attrs['data-ou-chercher-variant'];
    if (version !== m.OU_CHERCHER_VERSION) { ok = false; push(failures, 'm1Failures', `${p.file} : version du bloc « ${version} » ≠ ${m.OU_CHERCHER_VERSION}`); }
    if (variant !== p.variant) { ok = false; push(failures, 'm1Failures', `${p.file} : variante « ${variant} » (attendu ${p.variant})`); }
    const cmp = compareBlocks(sec.html, m.ouChercherStrings(p.lang, p.variant));
    if (!cmp.ok) {
      ok = false;
      const d = cmp.diffs[0];
      push(failures, 'm1Failures', `${p.file} : texte du bloc ≠ source (${cmp.actual.length} bloc(s) rendus, ${cmp.expected.length} attendus) — bloc ${d.index} rendu « ${(d.actual ?? '∅').slice(0, 80)} » / attendu « ${(d.expected ?? '∅').slice(0, 80)} »`);
    }
    if (p.kind === 'article') {
      const a = checkAnchorAfter(sec.after, p.anchor, p.lang);
      if (!a.ok) { ok = false; push(failures, 'm1Failures', `${p.file} : après le bloc, ${a.found} — attendu ${a.expected}`); }
    }
    if (ok) stats.blocksOk++;
  }
  for (const f of files) {
    if (!inScope.has(f) && countOuChercher(pages.get(f)) > 0) { stats.outOfScope++; push(failures, 'm1Failures', `${f} : bloc « Où chercher » hors périmètre`); }
  }

  // Marqueurs orphelins (toutes pages)
  for (const f of files) {
    const hits = orphanMarkers(pages.get(f));
    if (hits.length) push(failures, 'orphanPages', `${f} : marqueur orphelin visible — « …${hits[0]}… »`);
  }

  if (m1Only) return { failures, warnings, stats };

  // M2 / M3 / M4
  const targetFiles = new Set();
  for (const t of L1_TARGETS) {
    const isDb = t.route.startsWith('/blog/');
    for (const lang of ['fr', 'en']) {
      const file = routeToFile(t.route, lang);
      targetFiles.add(file);
      const html = pages.get(file);
      if (html === undefined) { push(failures, 'needleFailures', `${file} : page prérendue ABSENTE (cible M2/M3/M4)`); continue; }
      const text = visibleText(stripAsides(html));
      for (const key of t.needles) {
        const needle = resolveNeedle(m, key, lang);
        stats.needlesChecked++;
        if (hasNeedle(text, needle)) continue;
        const msg = `${file} : créneau « ${key} » absent du texte visible — « ${needle.slice(0, 70)}… »`;
        if (!isDb || live) { push(failures, 'needleFailures', msg); continue; }
        const inDb = embeddedHasText(html, lang, needle);
        if (inDb === true) push(failures, 'needleFailures', `${msg} (pourtant présent dans l'état embarqué de l'article : prérendu en défaut)`);
        else push(warnings, 'needleWarnings', `${msg} (SQL du lot pas encore appliqué — avertissement tant que ANSWER_SLOTS_LIVE = false)`);
      }
    }
  }

  // Promesses garant interdites (toutes pages ; titre d'article exempté, voir FORBIDDEN_EXEMPT)
  for (const f of files) {
    const html = pages.get(f);
    const text = exemptForbidden(visibleText(html));
    const lang = f.startsWith('en-') ? 'en' : 'fr';
    for (const fb of FORBIDDEN_PHRASES) {
      const hit = fb.re.exec(text);
      if (!hit) continue;
      const msg = `${f} : ${fb.label} dans le texte visible — « …${text.slice(Math.max(0, hit.index - 50), hit.index + 60)}… »`;
      if (!isDbPage(f) || live) { push(failures, 'forbiddenFailures', msg); continue; }
      const c = embeddedAllText(html, lang);
      if (c !== null && !fb.re.test(exemptForbidden(plainMarkdown(c)))) push(failures, 'forbiddenFailures', `${msg} (absente de l'état embarqué : la phrase vient du code ou du rendu, pas de la base)`);
      else push(warnings, 'forbiddenWarnings', `${msg} (à retirer par le SQL du lot — avertissement tant que ANSWER_SLOTS_LIVE = false)`);
    }
  }

  // Densité de la marque (périmètre L1 = pages M1 + cibles)
  for (const f of [...new Set([...inScope, ...targetFiles])].sort()) {
    const html = pages.get(f);
    if (html === undefined) continue;
    const n = brandCount(visibleText(html));
    if (n > BRAND_MAX) push(warnings, 'densityPages', `${f} : « ${BRAND} » ${n} fois dans le texte visible (> ${BRAND_MAX})`);
  }

  return { failures, warnings, stats };
}

// ── CLI ──────────────────────────────────────────────────────────────────────────────────────────────────────────

async function main() {
  const m1Only = args.includes('--m1-only');
  const json = args.includes('--json');
  const verbose = args.includes('--verbose');
  const m = await loadEntityFacts();
  const names = (await fs.readdir(PRERENDERED)).filter((f) => f.endsWith('.html')).sort();
  const pages = new Map();
  for (const f of names) pages.set(f, await fs.readFile(path.join(PRERENDERED, f), 'utf8'));
  const r = runChecks(m, pages, { m1Only });
  const s = r.stats;
  if (json) {
    console.log(JSON.stringify({ ok: r.failures.length === 0, live: ANSWER_SLOTS_LIVE, m1Only, version: m.OU_CHERCHER_VERSION, ...r }, null, 2));
    process.exit(r.failures.length ? 1 : 0);
  }
  console.log(`\n🧭 Garde créneaux de réponse — bloc « Où chercher » × créneaux M2/M3/M4 × public/prerendered${m1Only ? ' (--m1-only : règles 1, 2, 4)' : ''}\n`);
  console.log(`   version ${m.OU_CHERCHER_VERSION} · ${s.perimeter} pages porteuses attendues · ${s.files} fichiers prérendus · mode ${ANSWER_SLOTS_LIVE ? 'STRICT (ANSWER_SLOTS_LIVE = true)' : 'ADAPTATIF (ANSWER_SLOTS_LIVE = false : créneaux manquants en base = avertissements)'}`);
  console.log(`${s.sourceIssues ? '❌' : '✅'} source : ${s.sourceIssues} incohérence(s) interne(s) (answerSlotsIssues)`);
  console.log(`${s.m1Failures ? '❌' : '✅'} M1 : ${s.blocksOk}/${s.perimeter} blocs conformes (présence, version, variante, texte, ancre), ${s.outOfScope} hors périmètre`);
  console.log(`${s.orphanPages ? '❌' : '✅'} marqueurs orphelins : ${s.orphanPages} page(s) sur ${s.files}`);
  if (!m1Only) {
    console.log(`${s.needleFailures ? '❌' : '✅'} M2/M3/M4 : ${s.needlesChecked} créneaux vérifiés sur ${L1_TARGETS.length} routes FR+EN — ${s.needleFailures} échec(s), ${s.needleWarnings} avertissement(s)`);
    console.log(`${s.forbiddenFailures ? '❌' : '✅'} promesses garant interdites : ${s.forbiddenFailures} échec(s), ${s.forbiddenWarnings} avertissement(s)`);
    console.log(`${s.densityPages ? '⚠️ ' : '✅'} densité : ${s.densityPages} page(s) à plus de ${BRAND_MAX} « ${BRAND} »`);
  }
  const shown = verbose ? r.warnings : r.warnings.slice(0, 20);
  for (const w of shown) console.log(`   ⚠️  ${w}`);
  if (r.warnings.length > shown.length) console.log(`   ⚠️  … ${r.warnings.length - shown.length} avertissement(s) de plus (--verbose)`);
  for (const f of r.failures) console.log(`   • ${f}`);
  if (r.failures.length > 0) { console.error(`\n❌ ${r.failures.length} problème(s) — créneaux NON publiables.`); process.exit(1); }
  console.log(`\n🎉 Créneaux cohérents : source = HTML prérendu${r.warnings.length ? ` (${r.warnings.length} avertissement(s))` : ''}.\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
}
