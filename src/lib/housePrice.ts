import type { HouseKey } from "@/lib/availability";
import { PRICE_CHF_EN, PRICE_CHF_FR, PRICE_FROM_CHF_EN, PRICE_FROM_CHF_FR } from "@/data/stats";

// Prix d'appel PAR MAISON — décision Jérôme du 03/09/2026 (plan SEO funnel, Q1), paliers du 13/11/2026 :
//   • La Villa : 4 chambres sur 10 à salle d'eau partagée (chambres 3 et 4, chambres 7 et 8) → « dès » le palier le
//     plus bas, soit « dès 1 290 CHF » depuis le 19/11/2026 (« dès 1 370 CHF » avant)
//   • Le Loft et Le Lodge : 100 % salle d'eau privative, prix unique → « 1 430 CHF »
//     (jamais « dès » : toutes leurs chambres sont au prix standard)
//   • site entier (home, FAQ, pages Annemasse, meta) : le même « dès » — PRICE_FROM_* (HOUSES_FROM, src/data/stats.ts)
// Les montants viennent de src/data/stats.ts (dérivés du contrat en euros, source unique).
// Base (v_public_rooms.rent_chf), comparée chambre par chambre par la garde check-entity-facts : lavilla ∈ {1290, 1370, 1430},
// leloft = 1430 ×7, lelodge = 1430 ×12. Fonctions PURES (constantes) : rendu prérendu
// et rendu client identiques, aucun risque d'hydratation #418.
export const HOUSE_HAS_ENTRY_TIER: Record<HouseKey, boolean> = {
  lavilla: true,
  leloft: false,
  lelodge: false,
};

/** Montant d'appel de la maison et s'il faut le précéder de « dès » / « from ».
 *  (L'Appart, 12/11/2026) Maisons seulement : plus de repli `?? true` — un lieu inconnu aurait reçu le « dès » des maisons. */
export function housePriceFrom(house: HouseKey, lang: "fr" | "en"): { amount: string; from: boolean } {
  const from = HOUSE_HAS_ENTRY_TIER[house];
  const amount = from
    ? (lang === "en" ? PRICE_FROM_CHF_EN : PRICE_FROM_CHF_FR)
    : (lang === "en" ? PRICE_CHF_EN : PRICE_CHF_FR);
  return { amount, from };
}

/** « dès 1 290 CHF/mois » · « 1 430 CHF/mois » — EN : « from CHF 1,290/month » · « CHF 1,430/month ». */
export function housePriceLabel(house: HouseKey, lang: "fr" | "en"): string {
  const { amount, from } = housePriceFrom(house, lang);
  if (lang === "en") return `${from ? "from " : ""}${amount}/month`;
  return `${from ? "dès " : ""}${amount}/mois`;
}
