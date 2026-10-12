// Bloc « Articles connexes » des articles du blog (lot indexation du 08/10/2026, audit GSC du 07/10, EN-5).
//
// Avant : loadRelated lisait les 20 articles publiés les plus récents, puis prenait la même catégorie
// d'abord. En pratique, chaque article proposait les 3 plus récents de sa catégorie : seuls 12 articles
// sur 41 recevaient un lien « connexe », en FR comme en EN, et jamais les plus anciens (dont les
// articles EN « Discovered / Crawled – not indexed » dans GSC).
//
// Maintenant : tous les articles publiés sont candidats et le choix est DÉTERMINISTE. Même catégorie
// d'abord, complétée par les autres catégories ; dans chaque groupe, tri par une clé stable calculée
// sur la paire (article courant, candidat) : la distance sur un anneau de hachage FNV-1a,
// (h(candidat) − h(courant)) mod 2³². Chaque article propose les articles qui le suivent sur l'anneau.
// Propriété recherchée : dans une catégorie de n articles, chacun reçoit EXACTEMENT min(3, n − 1)
// liens « connexes » de sa catégorie, donc aucun article n'est oublié dès qu'il a un voisin de
// catégorie. Un tri par hash(courant + candidat) « brut » laissait encore 3 articles sur 41 sans
// lien entrant (dont banque-telephone et grand-geneve, cibles de l'audit) : simulation du 08/10.
// Publier un article ne change que les blocs de ses prédécesseurs sur l'anneau (≈ 3 à 5 articles).
//
// Pourquoi déterministe : le prérendu fige `related` dans __blog_post_data__, et la navigation SPA
// rappelle loadRelated côté client. Un tirage aléatoire donnerait des liens différents entre le HTML
// servi aux robots et la page vue après navigation, et changerait le HTML prérendu des 82 articles à
// chaque run (commit et déploiement du bot inutiles). Ni la date, ni l'ordre renvoyé par Supabase n'interviennent :
// à liste d'articles égale, le résultat est identique partout.
//
// Fonctions PURES, sans import : la simulation de couverture les charge telles quelles avec Node.

/** FNV-1a 32 bits (entier non signé). Suffisant pour un tri stable, sans dépendance. */
export function fnv1a32(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export interface RelatedCandidate {
  slug: string;
  category: string;
}

/**
 * Clé de tri d'un candidat vu depuis l'article courant : distance, dans le sens de l'anneau, entre
 * le hachage du courant et celui du candidat ((h(candidat) − h(courant)) mod 2³²).
 */
export function ringDistance(currentSlug: string, candidateSlug: string): number {
  return (fnv1a32(candidateSlug) - fnv1a32(currentSlug)) >>> 0;
}

/**
 * Choisit `count` articles connexes pour `currentSlug` parmi `candidates` (l'article courant, s'il y
 * figure, est ignoré). Même catégorie d'abord, puis les autres ; dans chaque groupe, tri par
 * ringDistance(courant, candidat), départagé par le slug. L'ordre de `candidates` est indifférent.
 */
export function pickRelatedPosts<T extends RelatedCandidate>(
  currentSlug: string,
  category: string,
  candidates: readonly T[],
  count = 3,
): T[] {
  const scored = candidates
    .filter((p) => p.slug !== currentSlug)
    .map((p) => ({ p, d: ringDistance(currentSlug, p.slug) }));
  const byDistance = (a: { p: T; d: number }, b: { p: T; d: number }) =>
    a.d - b.d || (a.p.slug < b.p.slug ? -1 : a.p.slug > b.p.slug ? 1 : 0);
  const same = scored.filter((x) => x.p.category === category).sort(byDistance);
  const others = scored.filter((x) => x.p.category !== category).sort(byDistance);
  return [...same, ...others].slice(0, count).map((x) => x.p);
}
