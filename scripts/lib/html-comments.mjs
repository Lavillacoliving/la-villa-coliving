/**
 * Nettoyage des commentaires HTML d'auteur dans le HTML prérendu (Lot S1.7, brief « Socle entité »).
 *
 * Constat du 04/09/2026 : les 8 commentaires d'index.html (gtag, bloc Clarity de 25 lignes, favicon,
 * fonts, notes preload/meta…) partaient dans les 125 pages servies aux bots. On les retire à l'écriture,
 * MAIS on préserve les marqueurs que React exige pour hydrater le HTML prérendu (scripts/prerender.mjs
 * les insère volontairement) : <!--$--> / <!--/$--> (frontières Suspense), <!--$?--> <!--$!-->,
 * <!--&--> / <!--/&--> (activité), et le séparateur de nœuds texte <!-- --> (un seul espace).
 * Fonction PURE ; testée dans tools/test/html-comments.test.mjs.
 */

const REACT_MARKER_RE = /^(?:\/?[$&][?!~]?| )$/;

/** true si le contenu d'un commentaire est un marqueur React à conserver. */
export function isReactMarker(inner) {
  return REACT_MARKER_RE.test(inner);
}

/**
 * Supprime tous les commentaires du <head> et, dans le reste du document, tout commentaire qui n'est
 * pas un marqueur React. Les retours à la ligne laissés par un commentaire de <head> sont repliés.
 */
export function stripAuthoringComments(html) {
  if (typeof html !== 'string' || !html.includes('<!--')) return html;
  const headEnd = html.indexOf('</head>');
  const splitAt = headEnd === -1 ? 0 : headEnd;
  const head = html.slice(0, splitAt).replace(/[ \t]*<!--[\s\S]*?-->[ \t]*(\r?\n)?/g, '');
  const rest = html.slice(splitAt).replace(/<!--([\s\S]*?)-->/g, (m, inner) => (isReactMarker(inner) ? m : ''));
  return head + rest;
}
