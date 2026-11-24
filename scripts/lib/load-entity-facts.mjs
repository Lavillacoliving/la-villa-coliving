/**
 * Charge la source unique TypeScript `src/data/entityFacts.ts` (+ `entityFactsArticles.ts`) depuis Node (scripts CI), sans build
 * complet : esbuild (déjà présent via Vite) la bundle en mémoire avec ses imports relatifs
 * (`./stats`, `../lib/structuredData`, alias `@/` → src/) puis on l'importe en data: URL.
 * Utilisé par scripts/check-entity-facts.mjs et scripts/build-llms-txt.mjs.
 */
import path from 'path';
import { fileURLToPath } from 'url';
import { build } from 'esbuild';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.join(__dirname, '..', '..');

let cached = null;
export async function loadEntityFacts() {
  if (cached) return cached;
  const result = await build({
    // Point d'entrée virtuel : la fiche + l'allowlist des 8 articles porteurs (entityFactsArticles.ts) + (Lot L1,
    // 10/2026) les créneaux de réponse (answerSlots.ts), l'allowlist du bloc « Où chercher » (ouChercherArticles.ts),
    // le registre des marqueurs (contentMarkers.ts) + (Lot L2, 09/10/2026) l'emplacement par maison (houseLocation.ts :
    // quartier, frontière, trajets, commerces, lien « Calculer mon trajet », HOUSE_LOCATION_VERSION) et les constantes
    // de stats.ts qu'ils exposent (TRANSIT, HOUSE_SURFACES, ROOM_SURFACE_BY_HOUSE…) + (Lot L3 « Note Google et preuves »,
    // 09/10/2026) la note Google (GOOGLE_REVIEWS, GOOGLE_REVIEWS_LINK_LABEL), l'occupation mesurée (OCCUPANCY, OCCUPANCY_DISPLAY)
    // et la base des preuves (STATS_SOURCE), lus par scripts/l3-social-proof.edits.mjs et la garde check-entity-facts.
    // + (Lot L4 « Justification du prix », D8, 10/10/2026) la FAQ A.3 et la phrase-clé A.4 (priceFacts.ts : priceJustificationFaq,
    // PRICE_KEY_SENTENCE, PRICE_FAQ_ROUTES, priceFactsStrings, priceFactsIssues) et les repères du marché (MARKET_COMPARISON).
    stdin: {
      contents: [
        "export * from './src/data/entityFacts';",
        "export * from './src/data/entityFactsArticles';",
        "export * from './src/data/answerSlots';",
        "export * from './src/data/ouChercherArticles';",
        "export * from './src/lib/contentMarkers';",
        "export * from './src/data/houseLocation';",
        "export * from './src/data/priceFacts';",
        // (24/11/2026, brief « budget réel ») Relevé d'annonces du 23/11/2026 : tableau du bloc 2, repères de la fiche, llms.txt.
        "export * from './src/data/budgetReel';",
        // (24/11/2026, brief « budget réel », lot 2) Section « Budget réel » de llms.txt : tableau et ligne « Méthode » du bloc 2 de
        // /tarifs (tarifsTexts.ts) et trois questions de comparaison de sa FAQ (tarifsFaq.ts) — mêmes chaînes que la page.
        "export { budgetBlock, BUDGET_GUIDE_PATH } from './src/data/tarifsTexts';",
        "export { tarifsPageFaq } from './src/data/faq/tarifsFaq';",
        // (16/10/2026) Règle d'affichage des milliers des articles (typography.ts) : check-answer-slots cherche les créneaux
        // des articles tels que le lecteur les voit.
        "export * from './src/lib/typography';",
        // (13/11/2026) Jetons des articles (contentTokens.ts : CONTENT_TOKENS, resolveContentTokens) — le test compare la liste
        // miroir de scripts/lib/article-checks.mjs à la source, et les outils de SQL simulent le rendu d'un article à jetons.
        "export * from './src/lib/contentTokens';",
        // (L'Appart, 12/11/2026) Lieux publics (places.ts : MAISON_KEYS, PLACE_KEYS, GAMME, PLACE_PAGE_KEYS, roomLabel…) —
        // noms uniques parmi les modules ci-dessus (deux `export *` du même nom disparaissent sans message) : liste
        // vérifiée par tools/test/places.test.mjs.
        "export * from './src/data/places';",
        // (L'Appart, 13/11/2026, étape E2) Faits, emplacement, textes partagés et photos de L'Appart (appart.ts, appartLocation.ts,
        // appartFacts.ts, appartPhotos.ts), aiguillage de l'emplacement par lieu (placeLocation.ts) et pont des clés publique →
        // interne (placeBridge.ts : la garde « aucune clé interne » lit INTERNAL_ONLY_KEYS) — noms uniques, liste vérifiée par
        // tools/test/appart.test.mjs.
        "export * from './src/data/appart';",
        "export * from './src/data/appartLocation';",
        "export * from './src/data/appartFacts';",
        // (20/11/2026, reco 3 acceptée par Jérôme) parenthèse du ménage de L'Appart, reprise dans llms.txt (build-llms-txt.mjs).
        "export { cleaningSharedBath } from './src/data/appartWords';",
        "export * from './src/data/appartPhotos';",
        "export * from './src/data/placeLocation';",
        "export * from './src/lib/placeBridge';",
        "export { ORG_ID, ORG_IDENTITY, LAVILLA_ALTERNATE_NAMES, LAVILLA_SAME_AS, GOOGLE_BUSINESS_PROFILE_URL, HOUSES, publicGeo, LAVILLA_NAP, houseLodgingId, buildHouseLodgingNode, buildAvailableRoomsItemList, buildLocalBusinessSchema, buildHomeLodgingBusinessSchema, APPART_PLACE, placeInfo, placeLodgingId, buildAppartLodgingNode } from './src/lib/structuredData';",
        "export { STATS, STATS_DISPLAY, TRANSIT, aOrAn, GENEVA_COMMUTE_FORMULA, MARKET_ROOM_EUR, FACEBOOK_GROUP, HOUSE_SURFACES, ROOM_SURFACE_BY_HOUSE, GOOGLE_REVIEWS, GOOGLE_REVIEWS_LINK_LABEL, OCCUPANCY, OCCUPANCY_DISPLAY, STATS_SOURCE, MARKET_COMPARISON, CONTRACT_EUR, HOUSES_FROM, SHARED_BATH_TIERS, STATS_SHARED_BATH, sharedBathTiersText, sharedBathPricesText, thousands, ANNEMASSE_TRAIN_MIN, priceTier } from './src/data/stats';",
      ].join(' '),
      resolveDir: ROOT,
      loader: 'ts',
    },
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'neutral',
    target: 'es2022',
    alias: { '@': path.join(ROOT, 'src') },
    logLevel: 'silent',
  });
  const code = result.outputFiles[0].text;
  cached = await import(`data:text/javascript;base64,${Buffer.from(code, 'utf8').toString('base64')}`);
  return cached;
}
