// Module 1 — « LaMal ou CMU ? » : logique de calcul PURE (testable, sans UI).
// Spec doc 3 §2. Compare le coût annuel des deux régimes d'assurance maladie
// pour un frontalier résidant côté France et travaillant à Genève.

import { DEFAULT_PARAMS, type FrontalierParams } from "./params";

export interface LamalCmuInput {
  /** Revenu fiscal de référence annuel du foyer (€). */
  rfr: number;
  /** Nombre d'adultes 26+ (un célibataire = 1, un couple = 2). */
  adults: number;
  /** Nombre de jeunes adultes 19-25 ans (tranche de prime LaMal réduite). */
  youngAdults: number;
  /** Nombre d'enfants 0-18 ans. */
  children: number;
}

export interface LamalCmuResult {
  /** Coût annuel CMU/PUMa estimé (€/an). */
  cmuAnnual: number;
  /** Coût annuel LaMal estimé, converti en € (€/an). */
  lamalAnnual: number;
  /** Prime LaMal mensuelle du foyer (CHF/mois) — affichage. */
  lamalMonthlyChf: number;
  /** Régime le moins cher pour ce foyer. */
  reco: "CMU" | "LaMal";
  /** Écart annuel en faveur de la reco (€/an, positif). */
  annualSaving: number;
  /** RFR au-dessus duquel LaMal devient plus avantageux (€), ou null. */
  breakEvenRfr: number | null;
}

const round = (n: number) => Math.round(n);

/** Cotisation CMU/PUMa annuelle = (RFR − abattement) × taux, plancher 0. */
export function computeCmuAnnual(rfr: number, p: FrontalierParams): number {
  const base = Math.max(0, rfr - p.cmu_abattement);
  return round(base * p.cmu_taux);
}

/** Prime LaMal mensuelle du foyer (CHF) = Σ primes par tranche d'âge. */
export function computeLamalMonthlyChf(input: LamalCmuInput, p: FrontalierParams): number {
  return (
    input.adults * p.lamal_prime_adulte_geneve +
    input.youngAdults * p.lamal_prime_jeune_adulte +
    input.children * p.lamal_prime_enfant_geneve
  );
}

/** Coût LaMal annuel converti en € = primes mensuelles CHF × 12 × taux de change. */
export function computeLamalAnnualEur(monthlyChf: number, p: FrontalierParams): number {
  return round(monthlyChf * 12 * p.chf_eur);
}

/**
 * RFR où CMU == LaMal : (rfr − abattement) × taux = lamalAnnual
 * → rfr = lamalAnnual / taux + abattement. (LaMal est ~fixe vs le RFR.)
 */
export function computeBreakEvenRfr(input: LamalCmuInput, p: FrontalierParams): number | null {
  if (p.cmu_taux <= 0) return null;
  const lamalAnnual = computeLamalAnnualEur(computeLamalMonthlyChf(input, p), p);
  return round(lamalAnnual / p.cmu_taux + p.cmu_abattement);
}

/** Calcul complet CMU vs LaMal pour un foyer. */
export function computeLamalCmu(
  input: LamalCmuInput,
  p: FrontalierParams = DEFAULT_PARAMS,
): LamalCmuResult {
  const cmuAnnual = computeCmuAnnual(input.rfr, p);
  const lamalMonthlyChf = computeLamalMonthlyChf(input, p);
  const lamalAnnual = computeLamalAnnualEur(lamalMonthlyChf, p);
  const reco: "CMU" | "LaMal" = cmuAnnual <= lamalAnnual ? "CMU" : "LaMal";
  const annualSaving = Math.abs(cmuAnnual - lamalAnnual);
  const breakEvenRfr = computeBreakEvenRfr(input, p);
  return { cmuAnnual, lamalAnnual, lamalMonthlyChf, reco, annualSaving, breakEvenRfr };
}
