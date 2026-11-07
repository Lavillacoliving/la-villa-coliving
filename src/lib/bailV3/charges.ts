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
