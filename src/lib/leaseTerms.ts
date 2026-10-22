// Remise sur le 1er mois et caution en 1, 2 ou 3 fois — générateur de bail du dashboard (demande Jérôme du 22/10/2026).
// Calculs PURS partagés par le formulaire, l'aperçu HTML, le PDF (BailPDF.tsx) et les onglets Locataires / Cautions.
// Aucun import : chargé tel quel par Node dans tools/test/lease-terms.test.mjs.
//
// Règles :
// - La remise est un montant libre en euros (charges comprises), saisi par Jérôme, retiré du 1er versement
//   (prorata du mois d'entrée, ou mois plein si l'entrée tombe le 1er). Elle ne peut pas dépasser ce versement.
//   Le loyer du bail ne change pas ; le déclencheur `trg_payments_first_month_discount` retire la même remise du
//   loyer attendu du mois d'entrée (scripts/migration-bail-remise-caution-2026-10-22.sql).
// - La caution (montant inchangé) se verse en 1, 2 ou 3 fois : à la signature, puis avec le loyer du 2e et du 3e mois,
//   au plus tard le 5. Montants au centime, la dernière échéance absorbe l'arrondi.

export type DepositInstallments = 1 | 2 | 3;

export interface DepositInstallment {
  /** 1, 2 ou 3. */
  index: number;
  amount: number;
  /** null pour la 1re échéance (à la signature) ou si la date d'entrée est inconnue ; sinon AAAA-MM-JJ (le 5 du mois). */
  dueDate: string | null;
}

/** 1, 2 ou 3 ; toute autre valeur vaut 1 (caution en une fois, comme avant). */
export function normalizeInstallments(n: unknown): DepositInstallments {
  const v = Number(n);
  return v === 2 || v === 3 ? v : 1;
}

/** Remise saisie : nombre fini > 0 arrondi au centime, sinon 0 (aucune remise). */
export function normalizeDiscount(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : 0;
}

/** Montant du 1er versement après remise, jamais négatif. */
export function firstPaymentAfterDiscount(firstMonthAmount: number, discount: number): number {
  return Math.max(0, Math.round((firstMonthAmount - normalizeDiscount(discount)) * 100) / 100);
}

/** Message bloquant si la remise dépasse le 1er versement, sinon null. */
export function discountError(firstMonthAmount: number, discount: number): string | null {
  const d = normalizeDiscount(discount);
  return d > firstMonthAmount ? `La remise dépasse le montant du 1er mois (${firstMonthAmount} €) : réduis-la.` : null;
}

/** Le 5 du mois `monthIndex0` (0 = janvier, débordement accepté) de l'année `year`, en AAAA-MM-JJ. */
function fifthOfMonth(year: number, monthIndex0: number): string {
  return new Date(Date.UTC(year, monthIndex0, 5)).toISOString().slice(0, 10);
}

/** Échéancier de la caution. `entryDate` = date d'entrée AAAA-MM-JJ (vide accepté : dates inconnues). */
export function depositSchedule(total: number, installments: number, entryDate: string): DepositInstallment[] {
  const n = normalizeInstallments(installments);
  const cents = Math.round(total * 100);
  const part = Math.floor(cents / n);
  const [year, month] = (entryDate || '').split('-').map(Number);
  return Array.from({ length: n }, (_, i) => ({
    index: i + 1,
    amount: (i === n - 1 ? cents - part * (n - 1) : part) / 100,
    dueDate: i === 0 || !year || !month ? null : fifthOfMonth(year, month - 1 + i),
  }));
}

/** « à la signature du bail » · « au plus tard le 05/12/2026, avec le loyer du deuxième mois ». */
export function installmentDueLabel(item: DepositInstallment, formatDate: (iso: string) => string): string {
  if (item.index === 1) return 'à la signature du bail';
  const rank = item.index === 2 ? 'deuxième' : 'troisième';
  return item.dueDate
    ? `au plus tard le ${formatDate(item.dueDate)}, avec le loyer du ${rank} mois`
    : `avec le loyer du ${rank} mois`;
}

/** « deux (2) » / « trois (3) » pour le texte du bail. */
export function installmentsInWords(n: number): string {
  return normalizeInstallments(n) === 3 ? 'trois (3)' : normalizeInstallments(n) === 2 ? 'deux (2)' : 'une (1)';
}

/** Prochaine échéance de caution non reçue, ou null si tout est reçu. */
export function nextInstallment(schedule: DepositInstallment[], received: number): DepositInstallment | null {
  return schedule[Math.max(0, Math.floor(received))] ?? null;
}
