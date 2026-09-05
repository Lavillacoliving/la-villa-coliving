/**
 * Contrôles PURS des brouillons de pages de décision (Lot C0.2, brief « Conquête IA », 09/2026).
 * Consommés par scripts/build-article-sql.mjs ; testés dans tools/test/article-checks.test.mjs.
 *
 * Les regex FAQ et marqueur sont des MIROIRS de src/pages/BlogPostPage.tsx (extractFaqPairs,
 * ENTITY_FACTS_MARKER_RE) et la liste de tokens un miroir de src/lib/contentTokens.ts — si l'un
 * change, changer l'autre (les scripts Node ne chargent pas le TS de l'app).
 */

export const CONTENT_TOKENS = ['PRIX_DES', 'PRIX_PRIVATIF', 'NB_CHAMBRES', 'NB_MAISONS', 'MIN_GENEVE', 'CAUTION_MOIS'];
export const ENTITY_FACTS_MARKER = '<!-- entity-facts -->';
export const ENTITY_FACTS_MARKER_RE = /^[ \t]*<!--\s*entity-facts\s*-->[ \t]*$/gm;

export const TITLE_SUFFIX = ' | La Villa Coliving';
export const TITLE_MAX_FULL = 70;      // scripts/seo-lint.mjs TITLE_MAX
export const META_MAX = 155;           // Lot 7 SEO funnel : metas ≤ 155
export const META_MIN = 110;
export const WORDS = { min: 1800, max: 2500 };
export const FAQ = { min: 5, max: 8 };
export const CATEGORIES = ['coliving', 'lifestyle', 'tips', 'geneva', 'community'];
export const BUCKETS = ['high', 'medium', 'ville', 'admin', 'life', 'coliving'];
export const AUTHOR_CANONICAL = 'Jerome Austin';

/** Pages money (au moins un lien sortant obligatoire). */
export const MONEY_PAGES = ['/colocation-geneve', '/chambre-a-louer-geneve', '/chambres-disponibles', '/annemasse-colocation', '/chambre-a-louer-annemasse', '/tarifs', '/nos-maisons', '/lavilla', '/leloft', '/lelodge', '/le-coliving'];
/** Piliers éditoriaux (au moins un lien sortant obligatoire). */
export const PILLAR_ARTICLES = ['/blog/trouver-colocation-geneve-frontalier', '/blog/budget-colocation-geneve-guide-complet', '/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher', '/blog/living-in-france-working-in-geneva', '/blog/guide-ressources-frontalier-geneve', '/blog/dossier-location-frontalier-suisse-france', '/blog/colocation-annemasse-ville-la-grand-ambilly'];

export const OPTIONS_TABLE_HEADERS = {
  fr: ['Option', 'Prix', 'Délai réaliste', 'Dossier demandé', 'Durée minimum'],
  en: ['Option', 'Price', 'Realistic timeline', 'Paperwork required', 'Minimum stay'],
};

export function stripMarker(md) { return String(md).replace(ENTITY_FACTS_MARKER_RE, ''); }

export function wordCount(md) {
  const t = stripMarker(md).replace(/\{\{[A-Z_]+\}\}/g, 'x').trim();
  return t ? t.split(/\s+/).length : 0;
}

export function findMarkers(md) {
  const out = [];
  const re = new RegExp(ENTITY_FACTS_MARKER_RE.source, 'gm');
  let m;
  while ((m = re.exec(md)) !== null) out.push({ index: m.index, length: m[0].length });
  return out;
}

/** Miroir exact de BlogPostPage.tsx:extractFaqPairs. */
export function extractFaqPairs(md) {
  const section = md.match(/(?:^|\n)#{1,2}\s+(?:FAQ[^\n]*|[^\n]*questions?[^\n]*)\n([\s\S]*?)(?=\n#{1,2}\s|\s*$)/i);
  if (!section) return { pairs: [], section: null };
  const pairs = [];
  const re = /\*\*([^*\n]+\?)\*\*\s*\n+([\s\S]*?)(?=\n\s*\*\*[^*\n]+\?\*\*|$)/g;
  let m;
  while ((m = re.exec(section[1])) !== null) {
    const q = m[1].trim();
    const a = m[2].replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`>]/g, '').replace(/\s+/g, ' ').trim();
    if (a) pairs.push({ q, a });
  }
  return { pairs, section: section[1] };
}

/** Tableaux GFM : position, en-têtes, nombre de lignes de corps. */
export function extractGfmTables(md) {
  const tables = [];
  const lines = md.split('\n');
  let pos = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/.test(lines[i + 1])) {
      const headers = line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.replace(/\*\*/g, '').trim());
      let rows = 0; let j = i + 2;
      while (j < lines.length && /^\s*\|.*\|\s*$/.test(lines[j])) { rows++; j++; }
      tables.push({ index: pos, headers, rows });
      i = j - 1;
    }
    pos += line.length + 1;
  }
  return tables;
}

export function extractLinks(md) {
  const out = [];
  const re = /\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let m;
  while ((m = re.exec(md)) !== null) out.push({ text: m[1], href: m[2] });
  return out;
}

export function extractHeadings(md) {
  const out = [];
  const re = /^(#{1,6})\s+(.+)$/gm;
  let m;
  while ((m = re.exec(md)) !== null) out.push({ level: m[1].length, text: m[2].trim(), index: m.index });
  return out;
}

export function unknownTokens(md) {
  const found = new Set();
  for (const m of String(md).matchAll(/\{\{\s*([A-Z_]+)\s*\}\}/g)) if (!CONTENT_TOKENS.includes(m[1])) found.add(m[1]);
  return [...found];
}

function pathOf(href) {
  try { return new URL(href, 'https://www.lavillacoliving.com').pathname.replace(/\/+$/, '') || '/'; } catch { return null; }
}
function isInternal(href) {
  return href.startsWith('/') || /^https?:\/\/(www\.)?lavillacoliving\.com/i.test(href);
}

/**
 * Contrôle d'un brouillon (une langue). `opts.isRedirected(path)` : prédicat fourni par le CLI
 * (sources de vercel.json). Retourne { failures, warnings, stats }.
 */
export function checkContent(md, lang, opts = {}) {
  const failures = [], warnings = [];
  const words = opts.words ?? WORDS;
  const n = wordCount(md);
  if (n < words.min || n > words.max) failures.push(`${lang} : ${n} mots (attendu ${words.min}-${words.max})`);
  if (md.includes('$$')) failures.push(`${lang} : « $$ » interdit dans le contenu (dollar-quoting du SQL)`);
  const unk = unknownTokens(md);
  if (unk.length) failures.push(`${lang} : token(s) inconnu(s) ${unk.map((t) => `{{${t}}}`).join(', ')} (liste : ${CONTENT_TOKENS.join(', ')})`);

  // Marqueur du bloc entité
  const markers = findMarkers(md);
  const tables = extractGfmTables(md);
  if (markers.length !== 1) failures.push(`${lang} : ${markers.length} marqueur(s) « ${ENTITY_FACTS_MARKER} » (attendu exactement 1)`);
  else {
    const mk = markers[0];
    if (mk.index < md.length * 0.4) failures.push(`${lang} : le marqueur est dans les 40 % de tête (${Math.round((100 * mk.index) / md.length)} %) — le bloc entité vient après le tableau d'options, jamais en tête`);
    if (!tables.some((t) => t.index < mk.index)) failures.push(`${lang} : aucun tableau d'options (GFM) avant le marqueur`);
    const after = md.slice(mk.index + mk.length).replace(/^\s*\n/, '').split('\n')[0] ?? '';
    if (!after.trim() || /^(#|\||[-*+]\s|>|\d+\.\s|<!--)/.test(after.trim())) failures.push(`${lang} : le marqueur doit être suivi d'un paragraphe (la phrase de contexte de la page), pas d'un titre/liste/tableau`);
  }

  // Tableau d'options : colonnes imposées, ≥ 4 lignes
  const expectedHeaders = (opts.optionsTableHeaders ?? OPTIONS_TABLE_HEADERS)[lang];
  const options = tables.find((t) => t.headers.length === expectedHeaders.length && t.headers.every((h, i) => h.toLowerCase() === expectedHeaders[i].toLowerCase()));
  if (!options) failures.push(`${lang} : tableau d'options absent — en-têtes attendus « | ${expectedHeaders.join(' | ')} | »`);
  else if (options.rows < 4) failures.push(`${lang} : tableau d'options à ${options.rows} ligne(s) (attendu ≥ 4 catégories)`);

  // Structure : sections ##, pas de sommaire auto involontaire (≥ 4 « # »), section « pas le bon choix »
  const hs = extractHeadings(md);
  const h1 = hs.filter((h) => h.level === 1).length;
  const h2 = hs.filter((h) => h.level === 2).length;
  if (h1 >= 4) warnings.push(`${lang} : ${h1} titres « # » → le sommaire automatique s'affichera (voulu ?)`);
  if (h2 < 6) failures.push(`${lang} : ${h2} sections « ## » (attendu ≥ 6)`);
  if (!hs.some((h) => /pas le bon choix|not the right (choice|fit)|when (it'?s|it is) not for you|when not to/i.test(h.text))) failures.push(`${lang} : section « Quand ce n'est pas le bon choix » absente`);
  if (!/^\s*(\*\*|##\s*)?(En bref|In short|Key takeaways)/im.test(md)) warnings.push(`${lang} : bloc « En bref » / « In short » absent après le chapô`);

  // FAQ : format reconnu par BlogPostPage, 5-8 paires, pas de ### dans la section
  const { pairs, section } = extractFaqPairs(md);
  if (!section) failures.push(`${lang} : section FAQ absente (titre « ## Questions fréquentes … » ou « ## FAQ … »)`);
  else {
    if (pairs.length < FAQ.min || pairs.length > FAQ.max) failures.push(`${lang} : ${pairs.length} paire(s) FAQ (attendu ${FAQ.min}-${FAQ.max}, format « **Question ?** » + paragraphe)`);
    if (/^###\s/m.test(section)) failures.push(`${lang} : « ### » dans la section FAQ (avalé dans la réponse précédente par extractFaqPairs)`);
    for (const p of pairs) {
      const sentences = p.a.split(/(?<=[.!?])\s+/).filter(Boolean).length;
      if (sentences > 5) warnings.push(`${lang} : réponse FAQ longue (${sentences} phrases) — « ${p.q} »`);
    }
  }

  // Liens : candidature, page money, pilier ; EN en /en/ ; jamais vers une source de redirection
  const links = extractLinks(md);
  const internal = links.filter((l) => isInternal(l.href)).map((l) => ({ ...l, path: pathOf(l.href) }));
  const norm = (p) => (lang === 'en' ? p.replace(/^\/en(?=\/|$)/, '') : p);
  if (!internal.some((l) => norm(l.path) === '/candidature')) failures.push(`${lang} : aucun lien vers /candidature`);
  if (!internal.some((l) => MONEY_PAGES.includes(norm(l.path)))) failures.push(`${lang} : aucun lien vers une page money (${MONEY_PAGES.slice(0, 5).join(', ')}…)`);
  if (!internal.some((l) => PILLAR_ARTICLES.includes(norm(l.path)))) failures.push(`${lang} : aucun lien vers un pilier éditorial (${PILLAR_ARTICLES.slice(0, 3).join(', ')}…)`);
  if (lang === 'en') for (const l of internal) if (l.path && !/^\/en(\/|$)/.test(l.path) && !l.path.startsWith('/#')) failures.push(`en : lien interne « ${l.href} » sans préfixe /en/`);
  if (lang === 'fr') for (const l of internal) if (l.path && /^\/en(\/|$)/.test(l.path)) warnings.push(`fr : lien interne « ${l.href} » vers la version EN`);
  if (opts.isRedirected) for (const l of internal) if (l.path && opts.isRedirected(l.path)) failures.push(`${lang} : lien « ${l.href} » vers une URL redirigée (vercel.json)`);
  for (const l of links) if (!isInternal(l.href) && !/^https:\/\//.test(l.href) && !/^(mailto:|tel:|#)/.test(l.href)) warnings.push(`${lang} : lien externe non https « ${l.href} »`);

  return { failures, warnings, stats: { words: n, faq: pairs.length, tables: tables.length, links: links.length, h2 } };
}

/** Contrôle des métadonnées (meta.json). */
export function checkMeta(meta) {
  const failures = [], warnings = [];
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.slug ?? '')) failures.push(`slug « ${meta.slug} » invalide (minuscules, chiffres, tirets)`);
  for (const lang of ['fr', 'en']) {
    const t = meta[`title_${lang}`] ?? '';
    const d = meta[`meta_description_${lang}`] ?? '';
    const x = meta[`excerpt_${lang}`] ?? '';
    if (!t.trim()) failures.push(`title_${lang} manquant`);
    else if (t.length + TITLE_SUFFIX.length > TITLE_MAX_FULL) failures.push(`title_${lang} : ${t.length} car. + « ${TITLE_SUFFIX} » > ${TITLE_MAX_FULL}`);
    if (/\d\s?(CHF|€|EUR)/.test(t)) failures.push(`title_${lang} : prix dans le title (interdit — décision S33)`);
    if (!d.trim()) failures.push(`meta_description_${lang} manquante`);
    else if (d.length > META_MAX) failures.push(`meta_description_${lang} : ${d.length} car. > ${META_MAX}`);
    else if (d.length < META_MIN) warnings.push(`meta_description_${lang} : ${d.length} car. < ${META_MIN}`);
    if (!x.trim()) failures.push(`excerpt_${lang} manquant`);
    else if (x.length > 300) warnings.push(`excerpt_${lang} : ${x.length} car. (long pour une carte)`);
    for (const f of [t, d, x]) if (/\{\{/.test(f)) failures.push(`${lang} : token {{…}} dans title/meta/excerpt (résolus uniquement dans le contenu)`);
  }
  if (meta.author !== AUTHOR_CANONICAL) warnings.push(`author « ${meta.author} » ≠ « ${AUTHOR_CANONICAL} » : pas de Person + AuthorBox (structuredData.getFounderByAuthorName)`);
  if (!CATEGORIES.includes(meta.category)) failures.push(`category « ${meta.category} » hors liste (${CATEGORIES.join(', ')})`);
  if (!Array.isArray(meta.tags) || meta.tags.length < 3) failures.push('tags : tableau de ≥ 3 entrées attendu');
  if (meta.intent_bucket && !BUCKETS.includes(meta.intent_bucket)) failures.push(`intent_bucket « ${meta.intent_bucket} » hors liste (${BUCKETS.join(', ')})`);
  if (!meta.image_url) failures.push('image_url manquante');
  for (const inb of meta.inbound ?? []) {
    for (const k of ['slug', 'anchor_fr', 'anchor_en']) if (!inb[k]) failures.push(`inbound : champ ${k} manquant (${JSON.stringify(inb).slice(0, 60)})`);
    for (const k of ['anchor_fr', 'anchor_en']) if (inb[k] && /[^\x20-\x7E]/.test(inb[k])) warnings.push(`inbound ${inb.slug} : ancre ${k} non ASCII (« ${inb[k]} ») — vérifier l'encodage à l'application du SQL`);
  }
  for (const c of meta.consolidates ?? []) if (!/^[a-z0-9-]+$/.test(c)) failures.push(`consolidates : slug « ${c} » invalide`);
  return { failures, warnings };
}

/** Échappe une chaîne pour un littéral SQL simple. */
export function sqlString(s) { return `'${String(s).replace(/'/g, "''")}'`; }

/** Dollar-quoting pour le markdown : tag unique, contenu vérifié sans « $$ ». */
export function sqlDollar(s, tag = 'md') { if (String(s).includes(`$${tag}$`)) throw new Error(`le contenu contient $${tag}$`); return `$${tag}$${s}$${tag}$`; }

export function sqlArray(arr) { return `ARRAY[${arr.map(sqlString).join(', ')}]`; }

export function readTimeMin(words) { return Math.max(1, Math.ceil(words / 200)); }
