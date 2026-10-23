// Remise sur le 1er mois et caution en 1, 2 ou 3 fois — générateur de bail du dashboard (demande Jérôme du 22/10/2026).
// Calculs PURS partagés par le formulaire, l'aperçu HTML, le PDF (BailPDF.tsx) et les onglets Locataires / Cautions.
// Aucun import : chargé tel quel par Node dans tools/test/lease-terms.test.mjs.
//
// Règles :
// - La remise est un montant libre en euros (charges comprises), saisi par Jérôme, portée sur le PREMIER MOIS
//   COMPLET (règle du 23/10/2026) : le mois d'entrée si l'entrée tombe le 1er, sinon le mois suivant — le prorata
//   d'entrée reste dû normalement. Elle ne peut pas dépasser le loyer d'un mois. Le loyer du bail ne change pas ; le
//   déclencheur `trg_payments_first_month_discount` retire la même remise du loyer attendu du mois stocké
//   (`first_month_discount_month`, scripts/migration-bail-mois-complet-leases-2026-10-23.sql).
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

/** Montant à verser pour le mois remisé, jamais négatif. */
export function firstPaymentAfterDiscount(monthAmount: number, discount: number): number {
  return Math.max(0, Math.round((monthAmount - normalizeDiscount(discount)) * 100) / 100);
}

/** Message bloquant si la remise dépasse le loyer d'un mois complet, sinon null. */
export function discountError(monthAmount: number, discount: number): string | null {
  const d = normalizeDiscount(discount);
  return d > monthAmount ? `La remise dépasse le loyer d'un mois complet (${monthAmount} €) : réduis-la.` : null;
}

/** Mois de la remise (AAAA-MM) : le mois d'entrée si l'entrée tombe le 1er, sinon le mois suivant. null sans date. */
export function discountMonth(entryDate: string): string | null {
  const [year, month, day] = (entryDate || '').split('-').map(Number);
  if (!year || !month || !day) return null;
  const d = new Date(Date.UTC(year, month - 1 + (day === 1 ? 0 : 1), 1));
  return d.toISOString().slice(0, 7);
}

/** true si l'entrée tombe en cours de mois (prorata d'entrée hors remise). */
export function entersMidMonth(entryDate: string): boolean {
  const day = Number((entryDate || '').split('-')[2]);
  return !!day && day !== 1;
}

const MONTHS_FR = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
/** « 2026-12 » → « décembre 2026 » ; chaîne vide si le mois est inconnu. */
export function monthLabelFr(month: string | null | undefined): string {
  const [year, m] = (month || '').split('-').map(Number);
  return year && m >= 1 && m <= 12 ? `${MONTHS_FR[m - 1]} ${year}` : '';
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
