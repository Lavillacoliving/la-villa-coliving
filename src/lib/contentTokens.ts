/**
 * Tokens de faits dans le markdown des articles (Lot C0 — brief « Conquête IA », 09/2026).
 *
 * Pourquoi : les pages de décision citent le prix d'appel 4 à 6 fois chacune (chapô, tableau
 * d'options, FAQ). Un montant en dur dans `blog_posts.content_*` obligerait à réécrire chaque
 * article en SQL à la prochaine bascule tarifaire (cf. la bascule du 01/09/2026). Les tokens
 * sont résolus au rendu depuis la source unique `src/data/stats.ts` — même graphie que le
 * reste du site (séparateurs déterministes, jamais de toLocaleString : règle anti-#418).
 *
 * (13/11/2026) `PRIX_DES` / `PRIX_DES_EUR` = le « dès » des MAISONS (HOUSES_FROM : palier le plus bas, 1 290 CHF / 1 380 €
 * depuis le 19/11/2026), plus jamais « le prix des chambres à salle d'eau partagée ». Deux jetons de FOURCHETTE s'ajoutent
 * (décision de Jérôme du 13/11/2026) : `PRIX_FOURCHETTE` = la fourchette des maisons telle qu'écrite en prose (« 1 290 à
 * 1 430 CHF » / « CHF 1,290 to 1,430 ») et `PRIX_FOURCHETTE_TABLEAU` = sa graphie de cellule de tableau (« 1 290 – 1 430 CHF » /
 * « 1,290 – 1,430 CHF ») — mêmes chaînes, au caractère près, que priceRangeText() / priceRangeCell() de src/data/answerSlots.ts
 * (créneaux vérifiés par check:slots). Le « dès » et la fourchette écrits par jeton suivent un changement de tarif sans SQL ;
 * le prix standard ou unique écrit en clair (Le Loft, Le Lodge), les chiffres calculés à partir du prix et les articles
 * générés (prix en clair, consigne du générateur) se réécrivent encore par SQL (CLAUDE.md § 4).
 *
 * (L'Appart, 14/11/2026 — CB-6, contenu/BLOG.md § 1) Deux jetons pour la deuxième gamme : `PRIX_APPART_DES` = le « dès » de
 * L'Appart en francs (« 730 CHF » / « CHF 730 ») et `PRIX_APPART_DES_EUR` = son loyer contractuel en euros (« 790 € » / « €790 »),
 * lus dans APPART.price.from (src/data/appart.ts : APPART_CONTRACT_EUR, francs dérivés par priceTier), jamais tapés. Aucun
 * article ne les porte encore : les phrases d'articles de L'Appart (SQL n° 10, après la bascule) les porteront, et ce code doit
 * être en ligne avant ce SQL (la garde check:facts refuse tout jeton non résolu). Prix de la suite et par personne : hors jeton.
 *
 * Règles :
 *  - autorisés UNIQUEMENT dans `content_fr` / `content_en` (jamais dans les extraits, les metas ni les posts
 *    Facebook, affichés bruts ; jamais dans la base du bot ni la consigne du générateur d'articles, lues hors du site) ;
 *  - un token inconnu est laissé tel quel (visible → attrapé par scripts/build-article-sql.mjs) ;
 *  - fonction PURE : le prérendu (Puppeteer) et le client résolvent la même chose.
 * Liste miroir dans scripts/lib/article-checks.mjs (le script de build ne charge pas TS).
 */
import {
  STATS,
  HOUSES_FROM,
  EUR_STANDARD_EN_NUM,
  EUR_STANDARD_FR_NUM,
  PRICE_CHF_EN,
  PRICE_CHF_FR,
} from "@/data/stats";
import { priceRangeCell, priceRangeText } from "@/data/answerSlots";
import { APPART } from "@/data/appart";

export type ContentLang = "fr" | "en";

export const CONTENT_TOKENS = [
  "PRIX_DES",
  "PRIX_PRIVATIF",
  "PRIX_DES_EUR",
  "PRIX_PRIVATIF_EUR",
  "NB_CHAMBRES",
  "NB_MAISONS",
  "MIN_GENEVE",
  "CAUTION_MOIS",
  "PRIX_FOURCHETTE",
  "PRIX_FOURCHETTE_TABLEAU",
  "PRIX_APPART_DES",
  "PRIX_APPART_DES_EUR",
] as const;

export type ContentToken = (typeof CONTENT_TOKENS)[number];

function tokenValue(token: ContentToken, lang: ContentLang): string {
  switch (token) {
    // « Dès » des maisons (palier le plus bas) : « 1 290 CHF » / « CHF 1,290 ».
    case "PRIX_DES":
      return HOUSES_FROM[lang].chf;
    case "PRIX_PRIVATIF":
      return lang === "en" ? PRICE_CHF_EN : PRICE_CHF_FR;
    // Loyer contractuel en euros (D7) — même gabarit que la fiche entité (src/data/entityFacts.ts).
    case "PRIX_DES_EUR":
      return HOUSES_FROM[lang].eur;
    case "PRIX_PRIVATIF_EUR":
      return lang === "en" ? `€${EUR_STANDARD_EN_NUM}` : `${EUR_STANDARD_FR_NUM} €`;
    case "NB_CHAMBRES":
      return String(STATS.totalRooms);
    case "NB_MAISONS":
      return String(STATS.totalHouses);
    case "MIN_GENEVE":
      return String(STATS.genevaCenterMinutes);
    case "CAUTION_MOIS":
      return String(STATS.depositMonths);
    // Fourchette des maisons — source unique : les fonctions des créneaux L1 (jamais recomposée ici).
    case "PRIX_FOURCHETTE":
      return priceRangeText(lang);
    case "PRIX_FOURCHETTE_TABLEAU":
      return priceRangeCell(lang);
    // (L'Appart) « Dès » de la deuxième gamme : « 730 CHF » / « CHF 730 », et son loyer contractuel en euros, « 790 € » / « €790 ».
    case "PRIX_APPART_DES":
      return APPART.price.from[lang].chf;
    case "PRIX_APPART_DES_EUR":
      return APPART.price.from[lang].eur;
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
