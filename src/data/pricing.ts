// Source of Truth: Supabase properties table (D4)
// Fallback values used during SSR/initial load
export const BASE_PRICE_CHF = 1380;
export const DEPOSIT_MONTHS = 2;
export const DEPOSIT_CHF = BASE_PRICE_CHF * DEPOSIT_MONTHS;

// Geneva comparison breakdown
export const GENEVA = {
  rent: 1400, utilities: 80, internet: 100,
  gym: 40, cleaning: 60, furniture: 200,
  setup: 100, insurance: 25, misc: 40,
};
export const GENEVA_TOTAL = Object.values(GENEVA).reduce((a, b) => a + b, 0);
export const MONTHLY_SAVINGS = GENEVA_TOTAL - BASE_PRICE_CHF;
export const YEARLY_SAVINGS = MONTHLY_SAVINGS * 12;

export const fmt = (n: number) => n.toLocaleString("fr-FR");
export const fmtEn = (n: number) => n.toLocaleString("en-US");

// Dynamic pricing helper (use in components with useProperties)
export function calcSavings(priceCHF: number) {
  const total = Object.values(GENEVA).reduce((a, b) => a + b, 0);
  return { monthly: total - priceCHF, yearly: (total - priceCHF) * 12, genevaTotal: total };
}
