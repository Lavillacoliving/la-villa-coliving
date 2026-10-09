/**
 * Registre des marqueurs de contenu dans le markdown des articles (Lot L1 « ingénierie des créneaux », 10/2026).
 *
 * Un marqueur est une ligne SEULE `<!-- nom -->` ou `<!-- nom:variante -->` dans `blog_posts.content_*`.
 * react-markdown 10 n'a pas rehype-raw : tout HTML brut est rendu en TEXTE VISIBLE. BlogPostPage découpe donc
 * le markdown AVANT le parseur et remplace le marqueur par un composant React (précédent `<!-- entity-facts -->`,
 * Lot C0). Ce module généralise : (1) une regex unique, (2) `stripCommentLines()` retire du rendu TOUTE ligne qui
 * n'est qu'un commentaire HTML, connue ou non — plus jamais de marqueur orphelin visible, même si un SQL précède le
 * code ; (3) `isKnownMarker()` pour les gardes (scripts/lib/article-checks.mjs en est le MIROIR : si l'un change,
 * changer l'autre).
 *
 * Fonctions pures, imports nuls : même résultat au prérendu (Puppeteer) et au client.
 */
export const CONTENT_MARKER_LINE_RE = /^[ \t]*<!--[ \t]*([a-z][a-z-]*)(?::([a-z]+))?[ \t]*-->[ \t]*$/gm;
/** Toute ligne qui n'est qu'un commentaire HTML (sur UNE ligne — jamais à travers plusieurs lignes). */
export const COMMENT_LINE_RE = /^[ \t]*<!--[^\n]*?-->[ \t]*$/gm;

/** Marqueurs enregistrés → variantes admises (vide = aucune variante). */
export const KNOWN_MARKERS: Readonly<Record<string, readonly string[]>> = {
  "entity-facts": [],
  "ou-chercher": ["court"],
};

export interface ContentMarker {
  name: string;
  variant?: string;
  index: number;
  length: number;
}

export function findContentMarkers(md: string): ContentMarker[] {
  const out: ContentMarker[] = [];
  const re = new RegExp(CONTENT_MARKER_LINE_RE.source, "gm");
  let m: RegExpExecArray | null;
  while ((m = re.exec(md)) !== null) {
    out.push({ name: m[1], ...(m[2] ? { variant: m[2] } : {}), index: m.index, length: m[0].length });
  }
  return out;
}

export function isKnownMarker(name: string, variant?: string): boolean {
  const variants = KNOWN_MARKERS[name];
  if (!variants) return false;
  return variant ? variants.includes(variant) : true;
}

/** Positions de toutes les lignes-commentaires (marqueurs connus compris) — pour les retirer du rendu. */
export function findCommentLines(md: string): Array<{ index: number; length: number }> {
  const out: Array<{ index: number; length: number }> = [];
  const re = new RegExp(COMMENT_LINE_RE.source, "gm");
  let m: RegExpExecArray | null;
  while ((m = re.exec(md)) !== null) out.push({ index: m.index, length: m[0].length });
  return out;
}

/** Retire toute ligne qui n'est qu'un commentaire HTML (marqueur connu ou non) — le reste du markdown est intact. */
export function stripCommentLines(md: string): string {
  return md.replace(new RegExp(COMMENT_LINE_RE.source, "gm"), "");
}
