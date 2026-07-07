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
