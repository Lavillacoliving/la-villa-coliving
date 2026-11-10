/**
 * Accès aux charges saisies (tables `property_charges` et `property_charges_lines`, réservées à l'administrateur par
 * RLS). Une interface, deux réalisations : Supabase (tableau de bord) et mémoire (aperçu de développement, tests
 * d'écran) — la carte « Forfait de charges » ne connaît que l'interface.
 *
 * Enregistrement sans fonction SQL : les nouvelles lignes sont écrites avant le retrait des anciennes, puis le total de
 * l'en-tête est relu en base (somme des parts récupérables calculées par Postgres) : un échec à mi-chemin ne laisse
 * jamais une saisie vide, et la carte signale tout écart entre l'en-tête et ses lignes.
 */
import { supabase } from "@/lib/supabase";
import { logAudit } from "@/lib/auditLog";
import type { ChargesExercise, ExercisePayload } from "./chargesEntry";
import type { PropertyChargesLineRow, PropertyChargesRow } from "./types";

export interface ChargesStore {
  /** Toutes les saisies d'une maison, de l'exercice le plus récent au plus ancien. */
  list(propertyId: string): Promise<ChargesExercise[]>;
  /** Crée ou met à jour une saisie provisoire ; renvoie son identifiant. */
  save(payload: ExercisePayload): Promise<string>;
  validate(id: string): Promise<void>;
  /** Correction d'une saisie validée : elle redevient provisoire, le motif est journalisé. */
  reopen(id: string, reason: string): Promise<void>;
  remove(id: string): Promise<void>;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

type RawExercise = PropertyChargesRow & { property_charges_lines?: PropertyChargesLineRow[] | null };

function toExercise(raw: RawExercise): ChargesExercise {
  const { property_charges_lines, ...row } = raw;
  return {
    ...row,
    total_recoverable_eur: Number(row.total_recoverable_eur),
    per_room_month_eur: Number(row.per_room_month_eur),
    room_count: Number(row.room_count),
    lines: (property_charges_lines || [])
      .map((l) => ({ ...l, amount_eur: Number(l.amount_eur), recoverable_pct: Number(l.recoverable_pct), recoverable_eur: Number(l.recoverable_eur) }))
      .sort((a, b) => a.sort_order - b.sort_order),
  };
}

function fail(step: string, error: { message: string } | null): never {
  throw new Error(`${step}${error?.message ? ` (${error.message})` : ""}`);
}

export const supabaseChargesStore: ChargesStore = {
  async list(propertyId) {
    const { data, error } = await supabase.from("property_charges").select("*, property_charges_lines(*)").eq("property_id", propertyId).order("fiscal_year", { ascending: false });
    if (error) fail("Lecture des charges impossible", error);
    return ((data || []) as RawExercise[]).map(toExercise);
  },

  async save(payload) {
    const { header, lines } = payload;
    let id = payload.id;
    const created = !id;
    if (!id) {
      const { data, error } = await supabase.from("property_charges").insert({ ...header, status: "provisoire" }).select("id").single();
      if (error || !data) fail("Création de l'exercice impossible", error);
      id = (data as { id: string }).id;
      const { error: linesError } = await supabase.from("property_charges_lines").insert(lines.map((l) => ({ ...l, property_charges_id: id })));
      if (linesError) {
        await supabase.from("property_charges").delete().eq("id", id);
        fail("Enregistrement des lignes impossible, rien n'a été créé", linesError);
      }
    } else {
      const { data: current, error: readError } = await supabase.from("property_charges").select("status").eq("id", id).single();
      if (readError || !current) fail("Exercice introuvable", readError);
      if ((current as { status: string }).status === "valide") throw new Error("Cet exercice est validé : utilise « Corriger » avant de le modifier.");
      const { data: old, error: oldError } = await supabase.from("property_charges_lines").select("id").eq("property_charges_id", id);
      if (oldError) fail("Lecture des lignes impossible", oldError);
      const { error: insertError } = await supabase.from("property_charges_lines").insert(lines.map((l) => ({ ...l, property_charges_id: id })));
      if (insertError) fail("Enregistrement des lignes impossible, rien n'a changé", insertError);
      const oldIds = ((old || []) as Array<{ id: string }>).map((l) => l.id);
      if (oldIds.length) {
        const { error: deleteError } = await supabase.from("property_charges_lines").delete().in("id", oldIds);
        if (deleteError) fail("Les anciennes lignes n'ont pas pu être retirées : enregistre à nouveau", deleteError);
      }
    }
    // Total de l'en-tête = somme des parts récupérables telles que Postgres les a calculées.
    const { data: saved, error: sumError } = await supabase.from("property_charges_lines").select("recoverable_eur").eq("property_charges_id", id);
    if (sumError) fail("Relecture des lignes impossible : enregistre à nouveau", sumError);
    const total = round2(((saved || []) as Array<{ recoverable_eur: number }>).reduce((s, l) => s + Number(l.recoverable_eur), 0));
    const { error: headError } = await supabase.from("property_charges")
      .update({ ...header, total_recoverable_eur: total, updated_at: new Date().toISOString() }).eq("id", id);
    if (headError) fail("Le total de l'exercice n'a pas pu être mis à jour : enregistre à nouveau", headError);
    logAudit("charges_saved", "property_charges", id, { created, property_id: header.property_id, fiscal_year: header.fiscal_year, method: header.method, total_recoverable_eur: total, room_count: header.room_count, effective_from: header.effective_from, lines: lines.length });
    return id as string;
  },

  async validate(id) {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("property_charges")
      .update({ status: "valide", validated_at: new Date().toISOString(), validated_by: user?.email || null, updated_at: new Date().toISOString() })
      .eq("id", id).select("property_id, fiscal_year, total_recoverable_eur, per_room_month_eur, effective_from").single();
    if (error || !data) fail("Validation impossible", error);
    logAudit("charges_validated", "property_charges", id, data as Record<string, unknown>);
  },

  async reopen(id, reason) {
    const { data, error } = await supabase.from("property_charges")
      .update({ status: "provisoire", validated_at: null, validated_by: null, updated_at: new Date().toISOString() })
      .eq("id", id).select("property_id, fiscal_year, total_recoverable_eur, per_room_month_eur").single();
    if (error || !data) fail("Réouverture impossible", error);
    logAudit("charges_reopened", "property_charges", id, { ...(data as Record<string, unknown>), reason });
  },

  async remove(id) {
    const { data, error } = await supabase.from("property_charges").delete().eq("id", id).select("property_id, fiscal_year, status, total_recoverable_eur").single();
    if (error || !data) fail("Suppression impossible", error);
    logAudit("delete", "property_charges", id, data as Record<string, unknown>);
  },
};

/** Réalisation en mémoire (aperçu /dev/charges) : mêmes règles d'écriture, aucune requête. */
export function memoryChargesStore(seed: ChargesExercise[]): ChargesStore & { all(): ChargesExercise[] } {
  let rows = seed.map((r) => ({ ...r, lines: r.lines.map((l) => ({ ...l })) }));
  let seq = 0;
  const find = (id: string) => {
    const row = rows.find((r) => r.id === id);
    if (!row) throw new Error("Exercice introuvable");
    return row;
  };
  return {
    all: () => rows,
    async list(propertyId) {
      return rows.filter((r) => r.property_id === propertyId).sort((a, b) => b.fiscal_year - a.fiscal_year).map((r) => ({ ...r, lines: r.lines.map((l) => ({ ...l })) }));
    },
    async save(payload) {
      const id = payload.id || `mem-${++seq}`;
      if (payload.id && find(payload.id).status === "valide") throw new Error("Cet exercice est validé : utilise « Corriger » avant de le modifier.");
      if (!payload.id && rows.some((r) => r.property_id === payload.header.property_id && r.fiscal_year === payload.header.fiscal_year)) throw new Error("Cet exercice existe déjà pour cette maison.");
      const lines: PropertyChargesLineRow[] = payload.lines.map((l, i) => ({
        id: `${id}-l${i}`, property_charges_id: id, poste_code: l.poste_code, label: l.label, amount_eur: l.amount_eur, recoverable_pct: l.recoverable_pct,
        recoverable_eur: round2(l.amount_eur * l.recoverable_pct / 100), source: l.source, sort_order: l.sort_order,
      }));
      const total = round2(lines.reduce((s, l) => s + l.recoverable_eur, 0));
      const previous = rows.find((r) => r.id === id);
      const row: ChargesExercise = {
        id, property_id: payload.header.property_id, fiscal_year: payload.header.fiscal_year, method: payload.header.method,
        status: "provisoire", total_recoverable_eur: total, room_count: payload.header.room_count,
        per_room_month_eur: round2(total / payload.header.room_count / 12), effective_from: payload.header.effective_from,
        validated_at: null, validated_by: null, notes: payload.header.notes, lines,
        ...(previous ? { status: previous.status } : {}),
      };
      rows = [...rows.filter((r) => r.id !== id), row];
      return id;
    },
    async validate(id) { const r = find(id); r.status = "valide"; r.validated_at = new Date().toISOString(); r.validated_by = "apercu@exemple.test"; },
    async reopen(id) { const r = find(id); r.status = "provisoire"; r.validated_at = null; r.validated_by = null; },
    async remove(id) { find(id); rows = rows.filter((r) => r.id !== id); },
  };
}
