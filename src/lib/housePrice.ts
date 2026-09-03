import type { HouseKey } from "@/lib/availability";
import { PRICE_CHF_EN, PRICE_CHF_FR, PRICE_SHARED_CHF_EN, PRICE_SHARED_CHF_FR } from "@/data/stats";

// Prix d'appel PAR MAISON — décision Jérôme du 03/09/2026 (plan SEO funnel, Q1) :
//   • La Villa : 4 chambres sur 10 à salle d'eau partagée → « dès 1 370 CHF »
//   • Le Loft et Le Lodge : 100 % salle d'eau privative, prix unique → « 1 430 CHF »
//     (jamais « dès » : aucune chambre n'y est à 1 370)
//   • site entier (home, FAQ, pages Annemasse, meta) : « dès 1 370 CHF » — PRICE_SHARED_*
// Les montants viennent de src/data/stats.ts (dérivés du contrat en euros, source unique).
// Base vérifiée le 02/09/2026 (v_public_rooms.rent_chf) : lavilla ∈ {1370, 1430},
// leloft = 1430 ×7, lelodge = 1430 ×12. Fonctions PURES (constantes) : rendu prérendu
// et rendu client identiques, aucun risque d'hydratation #418.
export const HOUSE_HAS_ENTRY_TIER: Record<HouseKey, boolean> = {
  lavilla: true,
  leloft: false,
  lelodge: false,
};

/** Montant d'appel de la maison et s'il faut le précéder de « dès » / « from ». */
export function housePriceFrom(house: HouseKey, lang: "fr" | "en"): { amount: string; from: boolean } {
  const from = HOUSE_HAS_ENTRY_TIER[house] ?? true;
  const amount = from
    ? (lang === "en" ? PRICE_SHARED_CHF_EN : PRICE_SHARED_CHF_FR)
    : (lang === "en" ? PRICE_CHF_EN : PRICE_CHF_FR);
  return { amount, from };
}

/** « dès 1 370 CHF/mois » · « 1 430 CHF/mois » — EN : « from CHF 1,370/month » · « CHF 1,430/month ». */
export function housePriceLabel(house: HouseKey, lang: "fr" | "en"): string {
  const { amount, from } = housePriceFrom(house, lang);
  if (lang === "en") return `${from ? "from " : ""}${amount}/month`;
  return `${from ? "dès " : ""}${amount}/mois`;
}
