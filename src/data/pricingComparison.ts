// Comparatif marché de /tarifs — source unique des montants « studio à Genève ».
// ⚠️ Ce sont des OBSERVATIONS DE MARCHÉ (fourchettes indicatives relevées côté
// Genève), à ne jamais confondre avec le loyer La Villa : lui vit dans
// src/data/stats.ts (dérivé des euros contractuels au taux BCE figé).
// Toute mise à jour du comparatif se fait ICI, jamais en littéral dans le JSX
// de RatesPageV4 — le total et les économies affichées en dérivent.
import { STATS, thousands, HOUSES_EUR_PER_M2, MARKET_CLASSIC_EUR_PER_M2, GENEVA_LISTING_CHF_PER_M2 } from "@/data/stats";

/** Postes mensuels du « studio à Genève » type (CHF). L'ordre documente la carte de /tarifs. */
export const GENEVA_STUDIO_COSTS = {
  baseRent: 1600, // loyer de base (petit studio)
  electricity: 80,
  heating: 100,
  water: 40,
  internet: 60,
  cleaning: 200, // service ménage
  gym: 100, // abonnement gym
  streaming: 25,
  taxes: 40, // taxes & frais
} as const;

/** Total mensuel studio Genève — SOMME des postes ci-dessus (2 245 CHF), jamais saisi en dur. */
export const GENEVA_STUDIO_TOTAL = Object.values(GENEVA_STUDIO_COSTS).reduce(
  (somme, poste) => somme + poste,
  0,
);

// Chaînes formatées — mêmes séparateurs déterministes que stats.ts
// (U+00A0 insécable en FR, virgule en EN ; pas de toLocaleString, règle anti-ICU).
export const GENEVA_STUDIO_BASE_RENT_FR = `${thousands(GENEVA_STUDIO_COSTS.baseRent, " ")} CHF`; // « 1 600 CHF »
export const GENEVA_STUDIO_BASE_RENT_EN = `CHF ${thousands(GENEVA_STUDIO_COSTS.baseRent, ",")}`; // « CHF 1,600 »
export const GENEVA_STUDIO_TOTAL_FR_NUM = thousands(GENEVA_STUDIO_TOTAL, " "); // « 2 245 »
export const GENEVA_STUDIO_TOTAL_EN_NUM = thousands(GENEVA_STUDIO_TOTAL, ","); // « 2,245 »
export const GENEVA_STUDIO_TOTAL_FR = `${GENEVA_STUDIO_TOTAL_FR_NUM} CHF`; // « 2 245 CHF »
export const GENEVA_STUDIO_TOTAL_EN = `CHF ${GENEVA_STUDIO_TOTAL_EN_NUM}`; // « CHF 2,245 »

/** Économie mensuelle affichée : total studio Genève − loyer standard La Villa (1 430). */
export const MONTHLY_SAVINGS_CHF = GENEVA_STUDIO_TOTAL - STATS.priceChf; // 815
/** Économie annuelle = mensuelle × 12. */
export const YEARLY_SAVINGS_CHF = MONTHLY_SAVINGS_CHF * 12; // 9 780
export const YEARLY_SAVINGS_FR_NUM = thousands(YEARLY_SAVINGS_CHF, " "); // « 9 780 »
export const YEARLY_SAVINGS_EN_NUM = thousands(YEARLY_SAVINGS_CHF, ","); // « 9,780 »

// (21/11/2026, lot « élevé, pas cher ») Ligne « Prix du m² » du tableau « objection prix » : CALCULÉE dans stats.ts, plus figée à
// la main (l'ancienne chaîne « ~37-42 €/m² » recopiait la surface par personne). Maisons = tout compris ; colocation classique =
// loyer seul ; studio = annonces genevoises, hors charges (Observatoire 2026, même chiffre que llms.txt).
export const VILLA_EUR_PER_M2_FR = `${HOUSES_EUR_PER_M2.min}-${HOUSES_EUR_PER_M2.max} €/m² tout compris`;
export const VILLA_EUR_PER_M2_EN = `€${HOUSES_EUR_PER_M2.min}-${HOUSES_EUR_PER_M2.max}/m², everything included`;
export const CLASSIC_EUR_PER_M2_FR = `~${MARKET_CLASSIC_EUR_PER_M2.min}-${MARKET_CLASSIC_EUR_PER_M2.max} €/m², loyer seul`;
export const CLASSIC_EUR_PER_M2_EN = `~€${MARKET_CLASSIC_EUR_PER_M2.min}-${MARKET_CLASSIC_EUR_PER_M2.max}/m², rent alone`;
export const STUDIO_CHF_PER_M2_FR = `~${GENEVA_LISTING_CHF_PER_M2} CHF/m² + charges (annonces)`;
export const STUDIO_CHF_PER_M2_EN = `~CHF ${GENEVA_LISTING_CHF_PER_M2}/m² + utilities (listings)`;
