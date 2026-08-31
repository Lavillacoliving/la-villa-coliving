/**
 * Intent buckets for blog articles — drives the candidature CTA variant
 * (headline + primary button) shown on each article (BlogPostPage).
 *
 * Source: "Plan de contenu orienté conversion" (2026-06) — articles are
 * classified by proximity to the rental decision, NOT by search volume:
 *  - high   : actively looking for housing
 *  - medium : planning/budget/comparison
 *  - ville  : « je choisis ma ville » (pré-achat — Lot 1e, 29/08) : CTA primaire
 *             = page MAISON (« la maison vend le rêve »), Candidater en secondaire
 *  - admin  : tax/admin cross-border guides
 *  - life   : daily life/transport
 *  - coliving: generic coliving content
 * NB (audit 28/08) : dans BlocOffre, seuls l'accroche (tous buckets) et
 * l'inversion des CTA (bucket ville) varient — le bouton primaire reste
 * « Candidater » partout ailleurs.
 *
 * New articles fall back to their category mapping below; add a slug here
 * only when the category default is wrong.
 */
export type IntentBucket = "high" | "medium" | "ville" | "admin" | "life" | "coliving";

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
  "colocation-expats-geneve-guide": "medium",
  // 🏙 ville — « je choisis ma ville » (Lot 1e, arbitrage 28/08) : ou-habiter
  // FR+EN = 32 % des clics SEO du site et 0 candidature avec Candidater en
  // primaire (0/9 vs 9/9 pour l'intention chambre) → la page maison prend le
  // CTA primaire sur ces slugs, Candidater reste en secondaire.
  "ou-habiter-frontalier-suisse-villes-france-pas-cher": "ville",
  "organisations-internationales-geneve-ou-habiter": "ville",
  "ecole-internationale-geneve-frontalier-ou-habiter": "ville",
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
