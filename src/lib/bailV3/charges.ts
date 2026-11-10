/**
 * Calculs purs du forfait de charges (bail v3, décisions D8/D9 du 26/10/2026) : à parts égales par chambre,
 * diviseur = nombre de chambres sans correction d'occupation, mensualisation sur 12 mois.
 * Même arrondi que la colonne générée `property_charges.per_room_month_eur` (2 décimales).
 */
export function perRoomMonthEur(totalRecoverableEur: number, roomCount: number): number {
  if (!Number.isFinite(totalRecoverableEur) || !Number.isFinite(roomCount) || roomCount <= 0 || totalRecoverableEur < 0) return 0;
  return Math.round((totalRecoverableEur / roomCount / 12) * 100) / 100;
}

/** Part récupérable d'une ligne de charges (montant annuel × % récupérable), arrondie au centime. */
export function recoverableEur(amountEur: number, recoverablePct: number): number {
  if (!Number.isFinite(amountEur) || !Number.isFinite(recoverablePct) || amountEur < 0) return 0;
  const pct = Math.min(100, Math.max(0, recoverablePct));
  return Math.round(amountEur * pct) / 100;
}

/** Total récupérable d'un exercice depuis ses lignes. */
export function totalRecoverableEur(lines: Array<{ amount_eur: number; recoverable_pct: number }>): number {
  return Math.round(lines.reduce((sum, l) => sum + recoverableEur(l.amount_eur, l.recoverable_pct), 0) * 100) / 100;
}

/** Forfait imprimé dans le bail : le forfait mensuel par chambre arrondi à l'euro (générateur v3). */
export function printedForfaitEur(perRoomMonth: number): number {
  return Math.round(Number(perRoomMonth) || 0);
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
// Lot 2 (10/11/2026) — saisie manuelle des charges par maison et par exercice. Fonctions pures, sans import,
// partagées par la carte « Forfait de charges » de l'onglet Maisons, le bandeau de rappel et leurs tests.
// ─────────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Poste de la projection « réel 2025 + 10 % » (forfait provisoire de la transition 2026, D12-bis). */
export const PROJECTION_POSTE = 'projection_2025_plus_10';

export type ChargesMethod = 'provisional_2025_plus_10' | 'manual_closing';
export type ChargesStatus = 'provisoire' | 'valide';

/** Ce que les règles ci-dessous lisent d'une ligne `property_charges` (une saisie = une maison × un exercice). */
export interface ChargesExerciseFacts {
  id: string;
  property_id: string;
  fiscal_year: number;
  method: ChargesMethod;
  status: ChargesStatus;
  effective_from: string;        // AAAA-MM-JJ
  per_room_month_eur?: number | null;
}

/** Une saisie qui contient la ligne de projection reste une projection ; sinon c'est une clôture saisie à la main. */
export function chargesMethod(lines: Array<{ poste_code: string }>): ChargesMethod {
  return lines.some((l) => l.poste_code === PROJECTION_POSTE) ? 'provisional_2025_plus_10' : 'manual_closing';
}

/**
 * Forfait en vigueur d'une maison à une date : même règle que la vue SQL `v_property_current_charges`
 * (saisies dont la date d'effet est atteinte ; une saisie validée prime sur toute saisie provisoire ;
 * à statut égal, la date d'effet la plus récente puis l'exercice le plus récent).
 */
export function currentExercise<T extends ChargesExerciseFacts>(rows: T[], propertyId: string, dateIso: string): T | null {
  const inForce = rows.filter((r) => r.property_id === propertyId && r.effective_from <= dateIso);
  const validated = inForce.filter((r) => r.status === 'valide');
  const pool = validated.length ? validated : inForce;
  return pool.slice().sort((a, b) => b.effective_from.localeCompare(a.effective_from) || b.fiscal_year - a.fiscal_year)[0] || null;
}

export type ExerciseStanding =
  | { kind: 'current' }                                   // en vigueur aujourd'hui
  | { kind: 'future'; from: string }                      // prendra le relais à sa date d'effet
  | { kind: 'future_needs_validation'; from: string; by: number }  // date future, mais une saisie validée primera tant qu'elle reste provisoire
  | { kind: 'needs_validation'; by: number }              // date atteinte, mais une saisie validée prime (elle est provisoire)
  | { kind: 'superseded'; by: number }                    // remplacée par une saisie plus récente
  | { kind: 'none' };

/** Où en est une saisie par rapport au forfait appliqué aux nouveaux baux (phrase d'état de la carte). */
export function exerciseStanding<T extends ChargesExerciseFacts>(rows: T[], id: string, todayIso: string): ExerciseStanding {
  const row = rows.find((r) => r.id === id);
  if (!row) return { kind: 'none' };
  const current = currentExercise(rows, row.property_id, todayIso);
  if (current && current.id === row.id) return { kind: 'current' };
  if (row.effective_from > todayIso) {
    const then = currentExercise(rows, row.property_id, row.effective_from);
    if (then && then.id === row.id) return { kind: 'future', from: row.effective_from };
    return then ? { kind: 'future_needs_validation', from: row.effective_from, by: then.fiscal_year } : { kind: 'future', from: row.effective_from };
  }
  if (!current) return { kind: 'none' };
  return row.status === 'provisoire' && current.status === 'valide'
    ? { kind: 'needs_validation', by: current.fiscal_year }
    : { kind: 'superseded', by: current.fiscal_year };
}

/**
 * Exercice attendu par le rappel du tableau de bord (D10 : l'exercice N-1 se saisit en février, pour les baux
 * signés dès mars) : à partir du 1er février, l'année précédente ; en janvier, encore celle d'avant.
 */
export function expectedChargesYear(todayIso: string): number {
  const [y, m] = todayIso.split('-').map(Number);
  return m >= 2 ? y - 1 : y - 2;
}

/**
 * Maisons dont les charges de l'exercice attendu ne sont pas saisies et validées (bandeau du tableau de bord).
 * Une maison est à jour si la clôture de l'exercice attendu est validée, ou si elle travaille déjà sur un exercice
 * plus récent (année de transition : les forfaits provisoires 2026 reposent sur le réel 2025, rien à réclamer avant
 * février 2027). Une projection, même validée par erreur, ne vaut jamais clôture.
 */
export function housesMissingCharges<T extends ChargesExerciseFacts, H extends { id: string }>(rows: T[], houses: H[], todayIso: string): H[] {
  const expected = expectedChargesYear(todayIso);
  return houses.filter((h) => !rows.some((r) => r.property_id === h.id && (
    r.fiscal_year > expected
    || (r.fiscal_year === expected && r.status === 'valide' && r.method === 'manual_closing')
  )));
}

/** Date du jour au fuseau du navigateur, AAAA-MM-JJ (les dates d'effet sont des dates civiles, pas des instants UTC). */
export function localTodayIso(now: Date = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
