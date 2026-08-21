// Cibles internes « colocation Genève » — consolidation du 07/07/2026.
// Google a élu l'article (pos 9,3 page 1) contre le pilier FR (pos 44,8) :
// le pilier /colocation-geneve est redirigé (308) vers l'article et toutes
// les ancres internes FR pointent désormais ici. Le pilier EN, lui, reste
// en ligne (money page en progression — pos 7,0) : l'EN garde sa cible.
// Une seule fonction à changer si la stratégie évolue.

export const COLOC_GENEVE_ARTICLE = "/blog/trouver-colocation-geneve-frontalier";
export const COLOC_GENEVE_PILLAR_FR = "/colocation-geneve";
export const COLOC_GENEVE_PILLAR_EN = "/en/colocation-geneve";

// ── REVERT 25/08/2026 (arbitrage au critère écrit du 03/08) ──────────────────
// Règle : « coliving-frais-dossier ≤ pos 11 deux semaines de suite AVEC clics →
// cible officielle ; sinon revert ». Données : sem. 6-12/08 pos 15,3 / 0 clic ;
// sem. 12-18/08 ~9,7 / 1 clic ; cible de la 308 (trouver-colocation) 1 clic /
// 103 impr / pos 20 sur 28 j. → le pilier /colocation-geneve est restauré en 200
// (FR et EN), toutes les ancres internes y reviennent, gel jusqu'au 05/10.
// L'article reste en ligne comme how-to (titles différenciés : pilier = offre).
export function colocGeneveHref(language: string): string {
  return language === "en" ? COLOC_GENEVE_PILLAR_EN : COLOC_GENEVE_PILLAR_FR;
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
// Vide depuis le revert du 25/08/2026 : /colocation-geneve (FR) existe à nouveau,
// le pilier EN a donc retrouvé son pendant — le miroir mécanique /en/X ↔ /X vaut.
export const HREFLANG_NO_ALTERNATES: ReadonlySet<string> = new Set<string>([]);
