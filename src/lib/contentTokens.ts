/**
 * Tokens de faits dans le markdown des articles (Lot C0 — brief « Conquête IA », 09/2026).
 *
 * Pourquoi : les pages de décision citent le prix d'appel 4 à 6 fois chacune (chapô, tableau
 * d'options, FAQ). Un montant en dur dans `blog_posts.content_*` obligerait à réécrire chaque
 * article en SQL à la prochaine bascule tarifaire (cf. la bascule du 01/09/2026). Les tokens
 * sont résolus au rendu depuis la source unique `src/data/stats.ts` — même graphie que le
 * reste du site (séparateurs déterministes, jamais de toLocaleString : règle anti-#418).
 *
 * Règles :
 *  - autorisés UNIQUEMENT dans `content_fr` / `content_en` (jamais dans les extraits ni les
 *    metas, affichés bruts par BlogPage) ;
 *  - un token inconnu est laissé tel quel (visible → attrapé par scripts/build-article-sql.mjs) ;
 *  - fonction PURE : le prérendu (Puppeteer) et le client résolvent la même chose.
 * Liste miroir dans scripts/lib/article-checks.mjs (le script de build ne charge pas TS).
 */
import {
  STATS,
  STATS_SHARED_BATH,
  CONTRACT_EUR,
  EUR_SHARED_EN_NUM,
  EUR_SHARED_FR_NUM,
  EUR_STANDARD_EN_NUM,
  EUR_STANDARD_FR_NUM,
  PRICE_CHF_EN,
  PRICE_CHF_FR,
  PRICE_SHARED_CHF_EN,
  PRICE_SHARED_CHF_FR,
} from "@/data/stats";

export type ContentLang = "fr" | "en";

export const CONTENT_TOKENS = [
  "PRIX_DES",
  "PRIX_PRIVATIF",
  "PRIX_DES_EUR",
  "PRIX_PRIVATIF_EUR",
  "PRIX_M_CARRE",
  "NB_CHAMBRES",
  "NB_MAISONS",
  "MIN_GENEVE",
  "CAUTION_MOIS",
] as const;

export type ContentToken = (typeof CONTENT_TOKENS)[number];

function tokenValue(token: ContentToken, lang: ContentLang): string {
  switch (token) {
    case "PRIX_DES":
      return lang === "en" ? PRICE_SHARED_CHF_EN : PRICE_SHARED_CHF_FR;
    case "PRIX_PRIVATIF":
      return lang === "en" ? PRICE_CHF_EN : PRICE_CHF_FR;
    // Loyer contractuel en euros (D7) — même gabarit que la fiche entité (src/data/entityFacts.ts).
    case "PRIX_DES_EUR":
      return lang === "en" ? `€${EUR_SHARED_EN_NUM}` : `${EUR_SHARED_FR_NUM} €`;
    case "PRIX_PRIVATIF_EUR":
      return lang === "en" ? `€${EUR_STANDARD_EN_NUM}` : `${EUR_STANDARD_FR_NUM} €`;
    // Coût au m² d'espace de vie (décision Jérôme 28/09/2026, C4) : loyer tout inclus ÷ espace de vie
    // par colocataire (STATS.livingSpacePerResidentMin/Max). Bas = palier salle d'eau partagée ÷ max,
    // haut = palier standard ÷ min ; CHF affiché puis € contractuel, arrondis à l'unité.
    case "PRIX_M_CARRE": {
      const lo = (n: number) => Math.round(n / STATS.livingSpacePerResidentMax);
      const hi = (n: number) => Math.round(n / STATS.livingSpacePerResidentMin);
      const chf = [lo(STATS_SHARED_BATH.priceChf), hi(STATS.priceChf)];
      const eur = [lo(CONTRACT_EUR.sharedBath), hi(CONTRACT_EUR.standard)];
      return lang === "en"
        ? `CHF ${chf[0]} to ${chf[1]}/€${eur[0]} to ${eur[1]}`
        : `${chf[0]} à ${chf[1]} CHF/${eur[0]} à ${eur[1]} €`;
    }
    case "NB_CHAMBRES":
      return String(STATS.totalRooms);
    case "NB_MAISONS":
      return String(STATS.totalHouses);
    case "MIN_GENEVE":
      return String(STATS.genevaCenterMinutes);
    case "CAUTION_MOIS":
      return String(STATS.depositMonths);
  }
}

const TOKEN_RE = /\{\{\s*([A-Z_]+)\s*\}\}/g;

/** Remplace les tokens connus ; laisse les inconnus intacts. */
export function resolveContentTokens(md: string, lang: ContentLang): string {
  if (!md.includes("{{")) return md;
  return md.replace(TOKEN_RE, (whole, name: string) =>
    (CONTENT_TOKENS as readonly string[]).includes(name) ? tokenValue(name as ContentToken, lang) : whole,
  );
}
