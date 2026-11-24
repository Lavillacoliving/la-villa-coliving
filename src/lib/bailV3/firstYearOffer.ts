/**
 * Offre « Ta première année avec nous » — côté bail (brief de Jérôme du 21/11/2026, lot 2 ; décisions D5, D10, D12).
 * Source unique des paliers pour la clause du bail v3 (clauses.ts), le générateur (DashboardNouveauBailV3Page) et les 3 lignes
 * `offer_rewards` que crée `create_lease_v3` (scripts/migration-offre-premiere-annee-2026-11-21.sql).
 *
 * Palier 1 (200 €) = la remise du premier mois complet, par le mécanisme existant (first_month_discount_eur / _month, déclencheur
 * trg_payments_first_month_discount) ; paliers 2 à 4 (300, 400, 500 €) = remboursements par VIREMENT, liés aux 4e, 7e et 13e
 * loyers complets. Le loyer du bail et le loyer attendu de chaque mois ne changent pas (D10).
 *
 * Module pur (zéro React, zéro réseau) : testé par tools/test/bail-v3-premiere-annee.test.mjs.
 */

/** Identifiant de l'offre (même valeur que le site, src/data/offer.ts, et que offer_rewards.offer_id). */
export const FIRST_YEAR_OFFER_ID = "premiere-annee";
/**
 * Fenêtre de SIGNATURE du bail (heure de Paris, bornes incluses) : c'est la date de signature qui compte, pas l'entrée.
 * Début avancé du 26/11 au 24/11 (décision de Jérôme du 24/11/2026), comme FIRST_YEAR_START de src/data/offer.ts.
 */
export const FIRST_YEAR_SIGN_FROM = "2026-11-24";
export const FIRST_YEAR_SIGN_TO = "2026-12-31";
/** Délai du virement après l'encaissement du loyer du mois concerné (D12). */
export const FIRST_YEAR_TRANSFER_DAYS = 10;

export type FirstYearTier = 1 | 2 | 3 | 4;
/** Les quatre paliers : rang du mois complet (1er, 4e, 7e, 13e) et montant. */
export const FIRST_YEAR_TIERS: readonly { tier: FirstYearTier; monthRank: number; eur: number; kind: "discount" | "refund" }[] = [
  { tier: 1, monthRank: 1, eur: 200, kind: "discount" },
  { tier: 2, monthRank: 4, eur: 300, kind: "refund" },
  { tier: 3, monthRank: 7, eur: 400, kind: "refund" },
  { tier: 4, monthRank: 13, eur: 500, kind: "refund" },
];
/** 1 400 € : la somme des paliers, jamais saisie. */
export const FIRST_YEAR_TOTAL_EUR = FIRST_YEAR_TIERS.reduce((n, t) => n + t.eur, 0);
/** 200 € : la remise du premier mois complet. */
export const FIRST_YEAR_DISCOUNT_EUR = FIRST_YEAR_TIERS[0].eur;

const isoMonthStart = (y: number, monthIndex0: number): string => new Date(Date.UTC(y, monthIndex0, 1)).toISOString().slice(0, 10);

/**
 * Premier mois complet (AAAA-MM-01) : le mois d'entrée si l'entrée tombe le 1er, sinon le mois suivant — la règle de
 * `discountMonth` (src/lib/leaseTerms.ts), de la clause de remise et du repli SQL du déclencheur. null sans date valide.
 */
export function firstFullMonth(entryIso: string): string | null {
  const [y, m, d] = (entryIso || "").split("-").map(Number);
  if (!y || !m || !d) return null;
  return isoMonthStart(y, m - 1 + (d === 1 ? 0 : 1));
}

/** Premier jour du mois `n` mois après `monthIso` (AAAA-MM-01). */
function addMonthsToMonth(monthIso: string, n: number): string {
  const [y, m] = monthIso.split("-").map(Number);
  return isoMonthStart(y, m - 1 + n);
}

export interface FirstYearStep {
  tier: FirstYearTier;
  eur: number;
  kind: "discount" | "refund";
  /** Premier jour du mois complet concerné (1er, 4e, 7e ou 13e). */
  referenceMonth: string;
  /** Un mois avant `referenceMonth` : le jour où l'on prévient le locataire et lui demande son RIB. null pour le palier 1. */
  remindOn: string | null;
}

/** Les quatre paliers datés pour une date d'entrée (AAAA-MM-JJ). null sans date valide. Pur. */
export function firstYearSchedule(entryIso: string): FirstYearStep[] | null {
  const first = firstFullMonth(entryIso);
  if (!first) return null;
  return FIRST_YEAR_TIERS.map((t) => {
    const referenceMonth = addMonthsToMonth(first, t.monthRank - 1);
    return { tier: t.tier, eur: t.eur, kind: t.kind, referenceMonth, remindOn: t.kind === "refund" ? addMonthsToMonth(referenceMonth, -1) : null };
  });
}

/** Les 3 lignes `offer_rewards` (paliers 2 à 4) envoyées à `create_lease_v3` dans `p.offer_rewards`. null sans date valide. */
export function offerRewardsPayload(entryIso: string): { offer_id: string; tier: FirstYearTier; amount_eur: number; reference_month: string }[] | null {
  const steps = firstYearSchedule(entryIso);
  if (!steps) return null;
  return steps.filter((s) => s.kind === "refund").map((s) => ({ offer_id: FIRST_YEAR_OFFER_ID, tier: s.tier, amount_eur: s.eur, reference_month: s.referenceMonth }));
}

/** true si le jour (AAAA-MM-JJ, heure de Paris) est dans la fenêtre de signature de l'offre. Pur. */
export function isFirstYearSignDate(dayIso: string): boolean {
  return dayIso >= FIRST_YEAR_SIGN_FROM && dayIso <= FIRST_YEAR_SIGN_TO;
}
