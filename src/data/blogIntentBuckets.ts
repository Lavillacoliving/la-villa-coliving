/**
 * Intent buckets for blog articles — drives the candidature CTA variant
 * (headline + primary button) shown on each article (BlogPostPage).
 *
 * Source: "Plan de contenu orienté conversion" (2026-06) — articles are
 * classified by proximity to the rental decision, NOT by search volume:
 *  - high   : actively looking for housing → push hard to /candidature
 *  - medium : planning/budget/comparison   → candidature CTA + pillar link
 *  - admin  : tax/admin cross-border guides → soft CTA ("voir les chambres")
 *  - life   : daily life/transport          → geo CTA ("découvre nos maisons")
 *  - coliving: generic coliving content     → default coliving message
 *
 * New articles fall back to their category mapping below; add a slug here
 * only when the category default is wrong.
 */
export type IntentBucket = "high" | "medium" | "admin" | "life" | "coliving";

// 2026-06 : 9 slugs retirés (consolidation blog — voir scripts/consolidation/).
// Les sources fusionnées sont dépubliées en base + 301 dans vercel.json.
const BUCKET_BY_SLUG: Record<string, IntentBucket> = {
  // 🟢 high — the reader is looking for housing / about to apply
  "trouver-colocation-geneve-frontalier": "high",
  "colocation-annemasse-ville-la-grand-ambilly": "high",
  "dossier-location-frontalier-suisse-france": "high",
  "arnaques-logement-frontalier-geneve-eviter": "high",
  "demenager-geneve-frontalier-checklist": "high",
  "coliving-frais-dossier-geneve-annemasse": "high",
  // 🟡 medium — planning, budget, comparison
  "budget-colocation-geneve-guide-complet": "medium",
  "coliving-vs-colocation-differences": "medium",
  "living-in-france-working-in-geneva": "medium",
  "ou-habiter-frontalier-suisse-villes-france-pas-cher": "medium",
  "colocation-expats-geneve-guide": "medium",
  "organisations-internationales-geneve-ou-habiter": "medium",
  // 🟠 admin — tax/admin authority content, soft CTA only
  "fiscalite-frontalier-geneve-impots-2026": "admin",
  "declaration-impots-frontalier-2026": "admin",
  "3e-pilier-frontalier-geneve": "admin",
  "avenant-fiscal-40-frontalier-geneve": "admin",
  "teletravail-frontalier-geneve-regles-2026": "admin",
  "permis-g-frontalier-geneve": "admin",
  "assurance-sante-frontalier-lamal-cmu-budget": "admin",
  "banque-telephone-internet-frontalier-bons-plans": "admin",
  // 🔵 life — daily life / transport / evaluating the area
  "cout-transport-frontalier-geneve-2026": "life",
  "transport-annemasse-geneve-leman-express": "life",
  "grand-geneve-2026-nouveautes-frontaliers": "life",
  "vie-quotidienne-frontalier-courses-sport-sorties": "life",
  "se-faire-reseau-geneve-arriver-seul": "life",
  "choc-culturel-franco-suisse-expatrie-geneve": "life",
};

const BUCKET_BY_CATEGORY: Record<string, IntentBucket> = {
  tips: "medium",
  geneva: "medium",
  lifestyle: "life",
  community: "life",
  coliving: "coliving",
};

export function getIntentBucket(slug: string, category: string): IntentBucket {
  return BUCKET_BY_SLUG[slug] ?? BUCKET_BY_CATEGORY[category] ?? "medium";
}
