/**
 * Détection de noms de concurrents dans du texte / du HTML prérendu (Lot C0.4). Fonctions PURES,
 * testées dans tools/test/competitor-scan.test.mjs, réutilisées par scripts/check-no-competitor.mjs
 * et par scripts/build-article-sql.mjs (scan des brouillons .md).
 *
 * Règle CLAUDE.md §1 : « jamais un concurrent nommé (texte, alt, meta, JSON-LD, annuaires, presse) ».
 * La LISTE des noms n'est jamais dans le repo public : secret GitHub COMPETITOR_NAMES (CI) ou
 * scripts/competitors.local.json (gitignoré) en local.
 */

/** NFD sans diacritiques, minuscules, apostrophes typographiques normalisées, espaces repliés. */
export function normalizeText(s) {
  return String(s ?? '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/\s+/g, ' ');
}

/** Entités HTML courantes + séquences JSON (\uXXXX, \", \/) — le HTML prérendu embarque du JSON. */
export function decodeForScan(html) {
  let s = String(html ?? '');
  s = s.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
  s = s.replace(/\\\//g, '/').replace(/\\"/g, '"').replace(/\\n/g, ' ');
  s = s.replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
  s = s.replace(/&#(\d+);/g, (_, d) => String.fromCharCode(parseInt(d, 10)));
  s = s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  return s;
}

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

/**
 * Un matcher par nom : frontières de mot Unicode, insensible casse/accents (les deux côtés sont
 * normalisés), un espace du nom tolère espace(s) ou tiret (« La Casa » ↔ « la-casa »).
 */
export function buildMatchers(names) {
  const out = [];
  for (const raw of names) {
    const name = normalizeText(raw).trim();
    if (!name) continue;
    const body = name.split(' ').map(escapeRe).join('[\\s-]*');
    out.push({ name: raw.trim(), re: new RegExp(`(?<![\\p{L}\\p{N}])${body}(?![\\p{L}\\p{N}])`, 'giu') });
  }
  return out;
}

/** Retourne les occurrences [{name, index, excerpt}] dans un texte DÉJÀ normalisé ou brut (normalisé ici). */
export function scanText(text, matchers, excerptRadius = 60) {
  const t = normalizeText(text);
  const hits = [];
  for (const { name, re } of matchers) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(t)) !== null) {
      hits.push({ name, index: m.index, excerpt: t.slice(Math.max(0, m.index - excerptRadius), m.index + m[0].length + excerptRadius).trim() });
      if (m[0].length === 0) re.lastIndex++;
    }
  }
  return hits;
}

/** HTML complet (head, body, JSON-LD, embeds) : on décode puis on scanne tout — un crawler lit tout. */
export function scanHtml(html, matchers, excerptRadius = 60) {
  return scanText(decodeForScan(html), matchers, excerptRadius);
}

/** Liste depuis l'env (CSV) ou un objet {names, allow}. */
export function parseNamesEnv(value) {
  return String(value ?? '').split(/[,\n;]/).map((s) => s.trim()).filter(Boolean);
}

/** Exclusion valide : même nom, fichier identique ou absent, date `until` (AAAA-MM-JJ) non dépassée. */
export function isAllowed(hit, file, allow = [], today = new Date()) {
  const day = today.toISOString().slice(0, 10);
  return allow.some((a) => normalizeText(a.name) === normalizeText(hit.name) && (!a.file || a.file === file) && (!a.until || a.until >= day));
}
