/**
 * Articles de blog qui portent le bloc « Où chercher une chambre côté France » (Lot L1, 10/2026) SANS marqueur
 * dans leur markdown : le bloc est inséré par le code, à une ancre = titre H2 existant de l'article (ou juste
 * avant le marqueur `<!-- entity-facts -->` pour une page de décision). Précédent : src/data/entityFactsArticles.ts.
 *
 * Pourquoi une allowlist plutôt qu'un marqueur posé par SQL : aucun marqueur ne transite par la base, donc aucun
 * orphelin visible possible, la preview Vercel montre le bloc avant le SQL, et l'ordre code → SQL ne contraint plus
 * l'insertion (le SQL du lot ne fait que RETIRER les anciennes listes de plateformes fusionnées dans le bloc).
 *
 * Contrat : les titres d'ancrage sont copiés au caractère près depuis la base (dump du 09/10/2026) ; les renommer
 * dans un article = mettre à jour cette liste, sinon le bloc disparaît et scripts/check-answer-slots.mjs échoue
 * (pas de repli « fin d'article » : un bloc hors de la section qui répond ne sert à rien).
 */
import type { OuChercherVariant } from "./answerSlots";
import type { EntityLang } from "./entityFacts";

export type OuChercherAnchor =
  | { kind: "before-heading"; fr: string; en: string }
  | { kind: "before-entity-facts" };

export interface OuChercherArticle {
  variant: OuChercherVariant;
  anchor: OuChercherAnchor;
}

export const OU_CHERCHER_ARTICLES: Readonly<Record<string, OuChercherArticle>> = {
  // Le SQL du lot retire la section « ## Où chercher concrètement ? » (titre + liste) ; le bloc complet la remplace.
  "trouver-colocation-geneve-frontalier": {
    variant: "full",
    anchor: { kind: "before-heading", fr: "Comment éviter les arnaques ?", en: "How to avoid scams?" },
  },
  // Le SQL du lot retire le H2 « Où chercher : les bons sites » et ses paragraphes ; le bloc court les remplace.
  "colocation-annemasse-ville-la-grand-ambilly": {
    variant: "short",
    anchor: { kind: "before-heading", fr: "Les bonnes zones", en: "Best Zones" },
  },
  // Pure insertion, après la section « Où vivre ? » (fiches de communes) — aucun SQL pour M1.
  "living-in-france-working-in-geneva": {
    variant: "short",
    anchor: { kind: "before-heading", fr: "Les défis du logement frontalier", en: "The cross-border housing challenge" },
  },
  // Page de décision : après le tableau d'options, juste avant le bloc entité (son marqueur reste suivi de son paragraphe).
  "s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france": {
    variant: "short",
    anchor: { kind: "before-entity-facts" },
  },
  // Page de décision (Q-vivre, Jérôme 09/10) : avant le tableau d'options, pour ne pas coller au bloc entité.
  "vivre-a-annemasse-quand-on-travaille-a-geneve": {
    variant: "short",
    anchor: { kind: "before-heading", fr: "Les options de logement, catégorie par catégorie", en: "The housing options, category by category" },
  },
};

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Point de coupe du bloc dans le markdown RÉSOLU (tokens remplacés) d'un article de l'allowlist. `entityIndex` =
 * position du marqueur `<!-- entity-facts -->` déjà repérée par BlogPostPage (null s'il n'y en a pas). Retourne null
 * si l'ancre est introuvable (bloc non rendu, garde CI rouge).
 */
export function resolveOuChercherCut(md: string, entry: OuChercherArticle, lang: EntityLang, entityIndex: number | null): { index: number; length: 0 } | null {
  if (entry.anchor.kind === "before-entity-facts") return entityIndex === null ? null : { index: entityIndex, length: 0 };
  const title = entry.anchor[lang];
  const re = new RegExp(`^#{1,2}[ \\t]+${escapeRe(title)}[ \\t]*$`, "m");
  const m = re.exec(md);
  return m ? { index: m.index, length: 0 } : null;
}
