/**
 * Article « Non, La Villa Coliving n'est pas une arnaque (et voici comment le vérifier) » — brief v2 du 15/10/2026,
 * décisions Q1-Q20 de Jérôme du 16/10/2026 (RAPPORT_Reconnaissance_Article_Cest_Reel_2026-10-16.md, §6).
 *
 * Source unique du slug et des exceptions de gabarit propres à cet article. Les liens internes (FAQ, pied de page,
 * /candidature, /qui-sommes-nous) pointent vers l'URL de l'article, jamais vers les URL courtes : /cest-reel,
 * /en/cest-reel et /is-this-real sont des redirections 308 (vercel.json) réservées au partage (WhatsApp, annonces).
 */
export const VERIFY_ARTICLE_SLUG = "non-la-villa-coliving-nest-pas-une-arnaque";
/** Chemin neutre (LocalizedLink / localizePath ajoutent /en). */
export const VERIFY_ARTICLE_PATH = `/blog/${VERIFY_ARTICLE_SLUG}`;

/** (Q13) Articles sans bloc offre (aucun prix affiché) : BlogPostPage rend <ArticleContactCta/> à la place. */
export const NO_OFFER_ARTICLES: ReadonlySet<string> = new Set([VERIFY_ARTICLE_SLUG]);

/** (Q18) Articles dont l'en-tête n'affiche que « Mis à jour le … » (le JSON-LD garde datePublished et dateModified). */
export const UPDATED_ONLY_ARTICLES: ReadonlySet<string> = new Set([VERIFY_ARTICLE_SLUG]);

/** Libellé du lien de réassurance (pied de page, /candidature, /qui-sommes-nous, FAQ). */
export const VERIFY_LINK_LABEL = {
  footer: { fr: "C'est réel ?", en: "Is this real?" },
  howTo: { fr: "Comment vérifier qu'on existe", en: "How to check we're real" },
} as const;
