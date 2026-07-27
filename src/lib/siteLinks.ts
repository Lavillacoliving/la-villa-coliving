// Cibles internes « colocation Genève » — consolidation du 07/07/2026.
// Google a élu l'article (pos 9,3 page 1) contre le pilier FR (pos 44,8) :
// le pilier /colocation-geneve est redirigé (308) vers l'article et toutes
// les ancres internes FR pointent désormais ici. Le pilier EN, lui, reste
// en ligne (money page en progression — pos 7,0) : l'EN garde sa cible.
// Une seule fonction à changer si la stratégie évolue.

export const COLOC_GENEVE_ARTICLE = "/blog/trouver-colocation-geneve-frontalier";
export const COLOC_GENEVE_PILLAR_EN = "/en/colocation-geneve";

export function colocGeneveHref(language: string): string {
  return language === "en" ? COLOC_GENEVE_PILLAR_EN : COLOC_GENEVE_ARTICLE;
}

// ─────────────────────────────────────────────────────────────────────────────
// Routes SANS page équivalente dans l'autre langue → aucune balise hreflang.
//
// Cas unique au 27/07/2026 : `/en/colocation-geneve`. Le pilier FR a été
// consolidé le 07/07 (308 vers `/blog/trouver-colocation-geneve-frontalier`),
// donc ce pilier EN n'a plus de pendant français.
//
// Le miroir mécanique `/en/X` → `/X` lui faisait déclarer `hreflang="fr"` vers
// une URL en 308 — Google exige des cibles en 200.
//
// ⚠️ Et le déclarer vers l'article ne marche pas non plus : cet article a DÉJÀ
// son jumeau EN (`/en/blog/trouver-colocation-geneve-frontalier`). Deux pages EN
// revendiqueraient la même page FR, et l'article ne renverrait l'ascenseur qu'à
// l'une des deux — c'est le motif d'erreur « more than one page for same
// language » + « no return tag ». Le sitemap porte aujourd'hui exactement ce
// défaut (corrigé dans `scripts/prerender.mjs`).
//
// Une page sans équivalent n'a pas de cluster : on n'émet rien.
//
// ⚠️ MIROIR À TENIR À JOUR : `scripts/hreflang-overrides.mjs` (les scripts Node
// ne peuvent pas importer ce fichier TS). Le check #13 de `scripts/seo-lint.mjs`
// détecte toute divergence entre le HTML, le sitemap et cette liste.
export const HREFLANG_NO_ALTERNATES: ReadonlySet<string> = new Set([
  "/en/colocation-geneve",
]);
