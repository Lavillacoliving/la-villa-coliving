// Slug d'article du blog — fonctions PURES (testées dans tools/test/blog-slug.test.mjs, Node 24 retire les types).
// Audit indexation 07/10/2026 : le slug du dashboard était un champ libre. Un accent (« …-genève ») ou une coquille
// produisait une URL que Vercel compare sous forme percent-encodée, et renommer un article publié laissait
// l'ancienne URL en 404 sans redirection.
// ⚠️ Pas d'alias « @/ » ici : le module est importé tel quel par les tests Node.

/** Format accepté : minuscules ASCII, chiffres, tirets simples entre les mots. */
export const BLOG_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Ligatures et lettres que NFD ne décompose pas.
const SPECIAL: Record<string, string> = { œ: "oe", Œ: "oe", æ: "ae", Æ: "ae", ß: "ss", ø: "o", Ø: "o", đ: "d", Đ: "d", ł: "l", Ł: "l" };

/**
 * Normalise une saisie libre en slug : accents retirés (NFD), minuscules, tout caractère hors [a-z0-9] → « - »,
 * tirets fusionnés puis rognés. « Vivre à Annemasse quand on travaille à Genève » →
 * « vivre-a-annemasse-quand-on-travaille-a-geneve ». Peut renvoyer « » (saisie sans lettre ni chiffre).
 */
export function normalizeBlogSlug(input: string): string {
  return input
    .replace(/[œŒæÆßøØđĐłŁ]/g, (c) => SPECIAL[c] ?? c)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // diacritiques combinants (U+0300 à U+036F) détachés par NFD
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isValidBlogSlug(slug: string): boolean {
  return BLOG_SLUG_RE.test(slug);
}

/**
 * Commande exacte qui ajoute la 308 /blog/<ancien> → /blog/<nouveau> et son jumeau /en (scripts/redirects.mjs).
 * Réservée à deux slugs au format (BLOG_SLUG_RE) : rien à percent-encoder pour Vercel, rien à citer pour le shell.
 */
export function blogSlugRedirectCommand(oldSlug: string, newSlug: string): string {
  return `node scripts/redirects.mjs --add /blog/${oldSlug} /blog/${newSlug}`;
}

/** Marqueur du bloc entité posé dans le markdown des pages de décision (voir BlogPostPage, check-entity-facts). */
const ENTITY_FACTS_MARKER_RE = /<!--\s*entity-facts\s*-->/;

/**
 * Slug figé par le code du site : le renommer depuis le dashboard ferait échouer une garde du bot de prérendu,
 * donc bloquerait tout déploiement, rafraîchissements de disponibilité compris.
 *  - `lockedSlugs` : slugs cités par le code (ENTITY_FACTS_ARTICLES, COLOC_GENEVE_ARTICLE…). check-entity-facts
 *    exige leur page prérendue (« page prérendue ABSENTE ») ;
 *  - marqueur `<!-- entity-facts -->` dans le markdown : page de décision, dont le périmètre est déclaré par
 *    content/decision-pages/<slug>.meta.json (sinon « bloc entité hors périmètre »).
 */
export function isBlogSlugLockedByCode(
  slug: string,
  contents: ReadonlyArray<string | null | undefined>,
  lockedSlugs: Iterable<string>,
): boolean {
  for (const s of lockedSlugs) if (s === slug) return true;
  return contents.some((c) => typeof c === "string" && ENTITY_FACTS_MARKER_RE.test(c));
}

const escapeRegExp = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Articles dont le markdown (FR ou EN) lie encore /blog/<slug> (ou /en/blog/<slug>, relatif ou absolu), hors
 * l'article `excludeId`. Après un renommage, ces liens passent par la redirection : ils sont à repointer.
 */
export function postsLinkingToSlug<T extends { id: string; content_fr?: string | null; content_en?: string | null }>(
  posts: ReadonlyArray<T>,
  slug: string,
  excludeId?: string,
): T[] {
  const re = new RegExp(`/blog/${escapeRegExp(slug)}(?![\\w%-])`);
  return posts.filter((p) => p.id !== excludeId && [p.content_fr, p.content_en].some((c) => typeof c === "string" && re.test(c)));
}

export type BlogSlugCheck =
  | { kind: "unchanged"; slug: string }
  | { kind: "invalid"; slug: string }
  | { kind: "locked"; slug: string }
  | { kind: "rename"; slug: string; redirect: "none" | "command" | "manual"; redirectCommand: string | null };

/**
 * Décide quoi faire d'une saisie de slug :
 *  - `unchanged` : même slug après normalisation ;
 *  - `invalid`   : rien d'utilisable ;
 *  - `locked`    : slug figé par le code (`locked` = isBlogSlugLockedByCode) — renommage refusé, à faire avec le code ;
 *  - `rename`    : `redirect` = « none » (brouillon : aucune URL en ligne), « command » (article publié : commande
 *    de redirection prête), « manual » (article publié dont l'ancien slug est hors format : la source devrait être
 *    percent-encodée comme Vercel la compare et pourrait contenir des caractères spéciaux pour le shell).
 */
export function checkBlogSlugChange(input: string, currentSlug: string, isPublished: boolean, locked = false): BlogSlugCheck {
  const slug = normalizeBlogSlug(input);
  if (!isValidBlogSlug(slug)) return { kind: "invalid", slug };
  if (slug === currentSlug) return { kind: "unchanged", slug };
  if (locked) return { kind: "locked", slug: currentSlug };
  if (!isPublished) return { kind: "rename", slug, redirect: "none", redirectCommand: null };
  if (!isValidBlogSlug(currentSlug)) return { kind: "rename", slug, redirect: "manual", redirectCommand: null };
  return { kind: "rename", slug, redirect: "command", redirectCommand: blogSlugRedirectCommand(currentSlug, slug) };
}
