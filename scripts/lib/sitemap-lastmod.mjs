/**
 * Lecture du sitemap et comparaison de deux versions (lot indexation du 08/10/2026, audit GSC SYS-04/05).
 *
 * Deux usages :
 *   - scripts/prerender.mjs relit le sitemap publié pour CONSERVER le <lastmod> des pages statiques
 *     dont le contenu n'a pas changé (voir scripts/lib/content-fingerprint.mjs) ;
 *   - scripts/indexnow-ping.mjs compare le sitemap d'avant le prérendu à celui d'après et ne soumet
 *     à IndexNow que les <loc> nouvelles ou dont le <lastmod> a changé.
 *
 * Fonctions PURES ; testées dans tools/test/sitemap-lastmod.test.mjs.
 */

/**
 * Map <loc> → <lastmod> (ou null si l'entrée n'a pas de lastmod), dans l'ordre du fichier.
 * Analyse bloc <url> par bloc <url> : une entrée sans lastmod ne « vole » jamais celui de la suivante.
 */
export function parseSitemapLastmod(xml) {
  const entries = new Map();
  if (typeof xml !== 'string') return entries;
  for (const block of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = block[1].match(/<loc>\s*([^<]+?)\s*<\/loc>/);
    if (!loc) continue;
    const lastmod = block[1].match(/<lastmod>\s*([^<]+?)\s*<\/lastmod>/);
    entries.set(loc[1], lastmod ? lastmod[1] : null);
  }
  return entries;
}

/**
 * Différence entre deux sitemaps (Map issues de parseSitemapLastmod).
 * - added    : <loc> absentes du précédent ;
 * - modified : <loc> présentes des deux côtés dont le <lastmod> a changé ;
 * - removed  : <loc> retirées (information seulement : IndexNow ne les reçoit pas, elles redirigent
 *              ou répondent 404 et le sitemap n'annonce que des URL en 200) ;
 * - toSubmit : added + modified, dans l'ordre du sitemap courant.
 */
export function diffSitemaps(previous, current) {
  const added = [];
  const modified = [];
  let unchanged = 0;
  for (const [loc, lastmod] of current) {
    if (!previous.has(loc)) added.push(loc);
    else if (previous.get(loc) !== lastmod) modified.push(loc);
    else unchanged++;
  }
  const removed = [...previous.keys()].filter((loc) => !current.has(loc));
  const pending = new Set([...added, ...modified]);
  const toSubmit = [...current.keys()].filter((loc) => pending.has(loc));
  return { added, modified, removed, unchanged, toSubmit };
}

/**
 * Horodatage W3C Datetime à la seconde, en UTC (`2026-10-08T13:04:21+00:00`), format de <lastmod>
 * admis par sitemaps.org et Google. Sert au <lastmod> des pages statiques modifiées pendant un run.
 */
export function w3cDatetime(date) {
  return date.toISOString().replace(/\.\d{3}Z$/, '+00:00');
}

/**
 * URL de `urls` dont le <lastmod> publié sur le site (`live`, Map de parseSitemapLastmod) n'est pas
 * encore celui du sitemap de ce run (`current`) : le déploiement du commit du bot n'est pas en ligne.
 * IndexNow attend que cette liste soit vide avant de soumettre (scripts/indexnow-ping.mjs --wait-live).
 */
export function notYetLive(live, current, urls) {
  return urls.filter((u) => live.get(u) !== current.get(u));
}
