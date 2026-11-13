import type { HouseKey } from "@/lib/availability";
import { PRICE_CHF_EN, PRICE_CHF_FR, PRICE_FROM_CHF_EN, PRICE_FROM_CHF_FR } from "@/data/stats";
import { APPART } from "@/data/appart";
import { assertNever, type PlaceKey } from "@/data/places";

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

const priceLabel = ({ amount, from }: { amount: string; from: boolean }, lang: "fr" | "en"): string =>
  lang === "en" ? `${from ? "from " : ""}${amount}/month` : `${from ? "dès " : ""}${amount}/mois`;

/** « dès 1 290 CHF/mois » · « 1 430 CHF/mois » — EN : « from CHF 1,290/month » · « CHF 1,430/month ». */
export function housePriceLabel(house: HouseKey, lang: "fr" | "en"): string {
  return priceLabel(housePriceFrom(house, lang), lang);
}

/** (L'Appart, 13/11/2026) Montant d'appel d'un lieu public : celui de la maison (ci-dessus) ou, pour L'Appart, « dès » son palier
 *  le plus bas (APPART.price.from : 730 CHF) — jamais le « dès » des maisons, jamais le prix par personne de la suite. */
export function placePriceFrom(place: PlaceKey, lang: "fr" | "en"): { amount: string; from: boolean } {
  switch (place) {
    case "lavilla":
    case "leloft":
    case "lelodge":
      return housePriceFrom(place, lang);
    case "lappart":
      return { amount: APPART.price.from[lang].chf, from: true };
    default:
      return assertNever(place);
  }
}

/** « dès 730 CHF/mois » / « from CHF 730/month » pour L'Appart ; le libellé de la maison sinon (housePriceLabel). */
export function placePriceLabel(place: PlaceKey, lang: "fr" | "en"): string {
  return priceLabel(placePriceFrom(place, lang), lang);
}
