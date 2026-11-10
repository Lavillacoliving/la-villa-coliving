/**
 * Saisie manuelle des charges récupérables par maison et par exercice (lot 2 du bail v3, 10/11/2026) : brouillon
 * d'écran, contrôles, totaux, données envoyées à la base et contenu de l'« État récapitulatif des charges ».
 * Fonctions pures (aucune requête ici) : la carte « Forfait de charges » de l'onglet Maisons les appelle, les tests
 * tools/test/bail-v3-charges-entry.test.mjs les vérifient. Décision de Jérôme (26/10/2026) : aucun moteur de charges,
 * le cabinet comptable fait les clôtures, Jérôme recopie les montants ici.
 */
import { CHARGE_POSTES, TEOM_BY_YEAR, chargePosteLabel } from "../../data/chargePostes";
import {
  PROJECTION_POSTE, chargesMethod, currentExercise, perRoomMonthEur, printedForfaitEur, recoverableEur,
  type ChargesExerciseFacts, type ChargesMethod, type ChargesStatus,
} from "./charges";
import type { PropertyChargesLineRow, PropertyChargesRow } from "./types";

/** Unité de location d'un bien : la chambre (coliving, bail v3) ou le logement entier (Mont-Blanc, hors générateur). */
export type ChargesUnit = "chambre" | "logement";

/** Libellés de l'écran et de l'état récapitulatif selon l'unité de location. */
export interface ChargesWording {
  title: string;          // titre de la carte
  intro: string;          // phrase d'explication sous le titre
  inForce: string;        // « Forfait en vigueur » | « Charges en vigueur »
  perUnit: string;        // « par chambre et par mois » | « par mois »
  divisor: string;        // « ÷ 10 chambres ÷ 12 mois » | « ÷ 12 mois »
  scope: string;          // ce que le forfait concerne : « des nouveaux baux » | « de ce bien »
  signedNote: string;     // rappel : ce qui est déjà signé ne bouge pas
  effectiveHint: string;  // sous la date d'effet
  rounded: boolean;       // le bail v3 imprime l'arrondi à l'euro ; un logement entier garde le montant exact
}

export function chargesWording(unit: ChargesUnit, roomCount: number): ChargesWording {
  if (unit === "logement") {
    const single = roomCount <= 1;
    return {
      title: "Charges du logement",
      intro: `Tu recopies ici les charges récupérables de ce bien, exercice par exercice, d'après la clôture de ton cabinet comptable. Le montant mensuel = total récupérable ${single ? "÷ 12 mois" : "÷ nombre de logements ÷ 12 mois"}. Ce bien est loué en entier, hors du générateur de bail : la saisie sert au suivi et à l'état récapitulatif.`,
      inForce: "Charges en vigueur",
      perUnit: single ? "par mois" : "par logement et par mois",
      divisor: single ? "÷ 12 mois" : `÷ ${roomCount} logements ÷ 12 mois`,
      scope: "de ce bien",
      signedNote: "Le bail en cours ne bouge pas.",
      effectiveHint: "Date à partir de laquelle ce montant s'applique.",
      rounded: false,
    };
  }
  return {
    title: "Forfait de charges (bail v3)",
    intro: "Tu recopies ici les charges récupérables de la maison, exercice par exercice, d'après la clôture de ton cabinet comptable. Le forfait d'une chambre = total récupérable ÷ nombre de chambres ÷ 12 mois. Le générateur de bail prend le forfait en vigueur.",
    inForce: "Forfait en vigueur",
    perUnit: "par chambre et par mois",
    divisor: `÷ ${roomCount} chambres ÷ 12 mois`,
    scope: "des nouveaux baux",
    signedNote: "Les baux déjà signés ne bougent pas.",
    effectiveHint: "Les baux générés à partir de cette date utilisent ce forfait.",
    rounded: true,
  };
}

/** Une saisie complète : la ligne `property_charges` et ses lignes de postes. */
export interface ChargesExercise extends PropertyChargesRow { lines: PropertyChargesLineRow[] }

/** Ligne en cours de saisie : les nombres restent du texte tant qu'ils ne sont pas enregistrés (virgule acceptée). */
export interface ChargeLineDraft { key: string; poste_code: string; label: string; amount: string; pct: string; source: string }
export interface ExerciseDraft {
  id: string | null;             // null = nouvel exercice pas encore enregistré
  property_id: string;
  fiscal_year: number;
  status: ChargesStatus;
  effective_from: string;        // AAAA-MM-JJ
  notes: string;
  room_count: number;
  lines: ChargeLineDraft[];
}

let lineSeq = 0;
const nextKey = () => `ligne-${++lineSeq}`;

/** « 1 234,56 » → 1234.56 ; vide → 0 (ligne ignorée) ; texte illisible → NaN (signalé). */
export function parseAmount(text: string | number | null | undefined): number {
  const t = String(text ?? "").replace(/[\s\u00a0\u202f€%]/g, "").replace(",", ".");
  if (t === "") return 0;
  return /^\d+(\.\d+)?$/.test(t) ? Number(t) : NaN;
}

/** 456.39 → « 456,39 » (valeur d'un champ de saisie). */
export function amountInput(n: number | null | undefined): string {
  return n == null || !Number.isFinite(Number(n)) ? "" : String(Number(n)).replace(".", ",");
}

/** Postes proposés par défaut à la saisie d'une clôture : tous les postes récupérables du décret, sans la projection ni « autre ». */
export function templatePosteCodes(): string[] {
  return CHARGE_POSTES.filter((p) => p.defaultPct > 0 && p.code !== PROJECTION_POSTE && p.code !== "autre").map((p) => p.code);
}

/** Nouvelle ligne pour un poste : pourcentage préréglé ; TEOM préremplie quand l'avis de l'année est connu. */
export function lineForPoste(code: string, fiscalYear: number, houseSlug: string | null | undefined): ChargeLineDraft {
  const poste = CHARGE_POSTES.find((p) => p.code === code);
  const teom = code === "teom" ? TEOM_BY_YEAR[fiscalYear]?.[houseSlug || ""] : undefined;
  return {
    key: nextKey(),
    poste_code: code,
    label: code === "autre" ? "" : chargePosteLabel(code),
    amount: teom != null ? amountInput(teom) : "",
    pct: String(poste ? poste.defaultPct : 100),
    source: teom != null ? `avis de taxe foncière ${fiscalYear}` : "",
  };
}

export function templateLines(fiscalYear: number, houseSlug: string | null | undefined): ChargeLineDraft[] {
  return templatePosteCodes().map((code) => lineForPoste(code, fiscalYear, houseSlug));
}

/** Premier jour du mois suivant (D10 : charges saisies en février, appliquées aux baux signés dès mars). */
export function firstOfNextMonth(todayIso: string): string {
  const [y, m] = todayIso.split("-").map(Number);
  const ny = m === 12 ? y + 1 : y;
  const nm = m === 12 ? 1 : m + 1;
  return `${ny}-${String(nm).padStart(2, "0")}-01`;
}

export function newExerciseDraft(o: { propertyId: string; houseSlug: string | null | undefined; roomCount: number; fiscalYear: number; todayIso: string }): ExerciseDraft {
  return {
    id: null, property_id: o.propertyId, fiscal_year: o.fiscalYear, status: "provisoire",
    effective_from: firstOfNextMonth(o.todayIso), notes: "", room_count: o.roomCount,
    lines: templateLines(o.fiscalYear, o.houseSlug),
  };
}

export function draftFromExercise(ex: ChargesExercise): ExerciseDraft {
  return {
    id: ex.id, property_id: ex.property_id, fiscal_year: ex.fiscal_year, status: ex.status,
    effective_from: ex.effective_from, notes: ex.notes || "", room_count: ex.room_count,
    lines: ex.lines.slice().sort((a, b) => a.sort_order - b.sort_order).map((l) => ({
      key: nextKey(), poste_code: l.poste_code, label: l.label, amount: amountInput(l.amount_eur), pct: amountInput(l.recoverable_pct), source: l.source || "",
    })),
  };
}

/** Remplace la ligne de projection par les postes du décret (bouton « Saisir la clôture » d'une saisie provisoire). */
export function replaceProjection(d: ExerciseDraft, houseSlug: string | null | undefined): ExerciseDraft {
  const kept = d.lines.filter((l) => l.poste_code !== PROJECTION_POSTE);
  const present = new Set(kept.map((l) => l.poste_code));
  return { ...d, lines: [...kept, ...templatePosteCodes().filter((c) => !present.has(c)).map((c) => lineForPoste(c, d.fiscal_year, houseSlug))] };
}

export interface DraftTotals {
  perLine: number[];      // part récupérable de chaque ligne (0 si la ligne est vide ou illisible)
  total: number;          // total récupérable de la maison pour l'exercice
  perRoomMonth: number;   // total ÷ chambres ÷ 12, au centime (colonne générée en base)
  printed: number;        // arrondi à l'euro : ce que le bail imprime
  filled: number;         // lignes avec un montant
}

export function draftTotals(d: ExerciseDraft): DraftTotals {
  const perLine = d.lines.map((l) => {
    const a = parseAmount(l.amount);
    const p = parseAmount(l.pct);
    return Number.isFinite(a) && Number.isFinite(p) ? recoverableEur(a, p) : 0;
  });
  const total = Math.round(perLine.reduce((s, x) => s + x, 0) * 100) / 100;
  const perRoomMonth = perRoomMonthEur(total, d.room_count);
  return { perLine, total, perRoomMonth, printed: printedForfaitEur(perRoomMonth), filled: d.lines.filter((l) => parseAmount(l.amount) > 0).length };
}

/** Les saisies de la maison telles qu'elles seraient après enregistrement du brouillon (statut au choix). */
export function rowsAfterDraft(rows: ChargesExerciseFacts[], d: ExerciseDraft, status: ChargesStatus = d.status): ChargesExerciseFacts[] {
  const mine: ChargesExerciseFacts = {
    id: d.id || "__nouveau__", property_id: d.property_id, fiscal_year: d.fiscal_year,
    method: chargesMethod(d.lines.filter((l) => parseAmount(l.amount) > 0)), status,
    effective_from: d.effective_from, per_room_month_eur: draftTotals(d).perRoomMonth,
  };
  return [...rows.filter((r) => r.id !== mine.id && !(d.id == null && r.id === "__nouveau__")), mine];
}

/** Ce qui empêche d'enregistrer le brouillon (liste vide = enregistrable). `rows` = saisies déjà en base pour la maison. */
export function draftIssues(d: ExerciseDraft, ctx: { rows: ChargesExerciseFacts[]; todayIso: string }): string[] {
  const issues: string[] = [];
  const thisYear = Number(ctx.todayIso.slice(0, 4));
  if (!Number.isInteger(d.fiscal_year) || d.fiscal_year < 2021 || d.fiscal_year > thisYear + 1) issues.push(`L'exercice doit être une année entre 2021 et ${thisYear + 1}.`);
  if (ctx.rows.some((r) => r.property_id === d.property_id && r.fiscal_year === d.fiscal_year && r.id !== d.id)) issues.push(`L'exercice ${d.fiscal_year} existe déjà pour cette maison : ouvre-le au lieu d'en créer un second.`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.effective_from) || Number.isNaN(Date.parse(d.effective_from))) issues.push("La date d'effet est obligatoire.");
  if (!(d.room_count > 0)) issues.push("Le nombre de chambres ou de logements de la fiche du bien est manquant.");
  const seen = new Set<string>();
  d.lines.forEach((l, i) => {
    const name = l.label.trim() || chargePosteLabel(l.poste_code) || `ligne ${i + 1}`;
    const a = parseAmount(l.amount);
    const p = parseAmount(l.pct);
    if (Number.isNaN(a)) issues.push(`Montant illisible pour « ${name} » : écris un nombre, par exemple 4512,30.`);
    if (Number.isNaN(p) || p > 100) issues.push(`Le pourcentage récupérable de « ${name} » doit être compris entre 0 et 100.`);
    if (l.poste_code === "autre" && a > 0 && !l.label.trim()) issues.push("Donne un nom au poste « Autre ».");
    if (l.poste_code !== "autre" && a > 0) {
      if (seen.has(l.poste_code)) issues.push(`Le poste « ${name} » figure deux fois : garde une seule ligne.`);
      seen.add(l.poste_code);
    }
  });
  if (draftTotals(d).filled === 0) issues.push("Saisis au moins un montant.");
  // Jamais de trou : une maison qui a un forfait en vigueur doit en garder un après l'enregistrement.
  const before = currentExercise(ctx.rows, d.property_id, ctx.todayIso);
  if (before && issues.length === 0 && !currentExercise(rowsAfterDraft(ctx.rows, d), d.property_id, ctx.todayIso)) {
    issues.push("Avec cette date d'effet, la maison n'aurait plus de forfait en vigueur jusqu'à cette date : garde une date d'effet déjà passée pour cet exercice.");
  }
  return issues;
}

/** Ce qui empêche de valider (en plus de `draftIssues`) : une projection reste provisoire. */
export function validationIssues(d: ExerciseDraft): string[] {
  return d.lines.some((l) => l.poste_code === PROJECTION_POSTE && parseAmount(l.amount) > 0)
    ? ["Une projection ne se valide pas : remplace la ligne « Projection » par les montants de la clôture de ton cabinet, puis valide."]
    : [];
}

export interface ForfaitChange { before: { fiscal_year: number; printed: number } | null; after: { fiscal_year: number; printed: number } | null; changes: boolean }

/** Effet d'un enregistrement ou d'une validation sur le forfait appliqué aux nouveaux baux aujourd'hui. */
export function forfaitChange(rows: ChargesExerciseFacts[], d: ExerciseDraft, status: ChargesStatus, todayIso: string): ForfaitChange {
  const pick = (r: ChargesExerciseFacts | null) => (r ? { fiscal_year: r.fiscal_year, printed: printedForfaitEur(Number(r.per_room_month_eur) || 0) } : null);
  const before = pick(currentExercise(rows, d.property_id, todayIso));
  const after = pick(currentExercise(rowsAfterDraft(rows, d, status), d.property_id, todayIso));
  return { before, after, changes: (before?.printed ?? null) !== (after?.printed ?? null) || (before?.fiscal_year ?? null) !== (after?.fiscal_year ?? null) };
}

export interface ExercisePayload {
  id: string | null;
  header: { property_id: string; fiscal_year: number; method: ChargesMethod; total_recoverable_eur: number; room_count: number; effective_from: string; notes: string | null };
  lines: Array<{ poste_code: string; label: string; amount_eur: number; recoverable_pct: number; source: string | null; sort_order: number }>;
}

/** Données envoyées à la base : seules les lignes avec un montant sont gardées, dans l'ordre de l'écran. */
export function draftToPayload(d: ExerciseDraft): ExercisePayload {
  const lines = d.lines
    .filter((l) => parseAmount(l.amount) > 0)
    .map((l, i) => ({
      poste_code: l.poste_code,
      label: l.poste_code === "autre" ? l.label.trim() : (CHARGE_POSTES.some((p) => p.code === l.poste_code) ? chargePosteLabel(l.poste_code) : l.label.trim() || l.poste_code),
      amount_eur: parseAmount(l.amount),
      recoverable_pct: parseAmount(l.pct),
      source: l.source.trim() || null,
      sort_order: i,
    }));
  return {
    id: d.id,
    header: {
      property_id: d.property_id, fiscal_year: d.fiscal_year, method: chargesMethod(lines),
      total_recoverable_eur: draftTotals(d).total, room_count: d.room_count, effective_from: d.effective_from, notes: d.notes.trim() || null,
    },
    lines,
  };
}

/** Contenu de l'« État récapitulatif des charges » (PDF remis au locataire sur demande) — jamais les notes internes. */
export interface ChargesStatement {
  /** Chambre = forfait du bail v3 (loi de 1989, arrondi à l'euro) ; logement = bien loué en entier, montant exact, sans mention du forfait légal. */
  unit: ChargesUnit;
  house: { name: string; address: string };
  lessor: { name: string; address: string | null } | null;
  fiscal_year: number;
  provisional: boolean;
  projection: boolean;
  validated_on: string | null;   // AAAA-MM-JJ
  effective_from: string;
  lines: Array<{ label: string; amount: number; pct: number; recoverable: number; source: string }>;
  total: number;
  room_count: number;
  per_room_month: number;
  printed: number;
  generated_on: string;          // AAAA-MM-JJ
}

/** Retire les repères internes des libellés (« (D12-bis) », « (D2 : …) ») avant impression. */
export function publicLabel(label: string): string {
  return label.replace(/\s*\(D\d+[^)]*\)/g, "").trim();
}

export function statementFromExercise(ex: ChargesExercise, house: { name: string; address: string }, lessor: { name: string; address: string | null } | null, generatedOnIso: string, unit: ChargesUnit = "chambre"): ChargesStatement {
  const lines = ex.lines.slice().sort((a, b) => a.sort_order - b.sort_order).map((l) => ({
    label: publicLabel(l.label), amount: Number(l.amount_eur), pct: Number(l.recoverable_pct),
    recoverable: recoverableEur(Number(l.amount_eur), Number(l.recoverable_pct)), source: l.source || "",
  }));
  const total = Math.round(lines.reduce((s, l) => s + l.recoverable, 0) * 100) / 100;
  const perRoomMonth = perRoomMonthEur(total, ex.room_count);
  return {
    unit, house, lessor, fiscal_year: ex.fiscal_year,
    provisional: ex.status !== "valide",
    projection: ex.lines.some((l) => l.poste_code === PROJECTION_POSTE),
    validated_on: ex.validated_at ? ex.validated_at.slice(0, 10) : null,
    effective_from: ex.effective_from,
    lines, total, room_count: ex.room_count, per_room_month: perRoomMonth, printed: printedForfaitEur(perRoomMonth),
    generated_on: generatedOnIso,
  };
}
