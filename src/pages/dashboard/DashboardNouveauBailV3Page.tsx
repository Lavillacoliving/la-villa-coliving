/**
 * Générateur de bail v3 (lot 3, 29/10/2026) — EUR-maître, deux bailleurs (indivision / SCI), forfait de charges par maison,
 * plafond de relocation avec dérogation motivée, dépôt en 1-3 fois, remise sur le premier mois complet.
 * Texte et calculs : src/lib/bailV3 (clauses.ts, pricing.ts) ; aperçu = LeaseDocHtml ; PDF = BailV3PDF (même document).
 * Écritures : fonction SQL create_lease_v3 (transaction tenants + leases), puis PDF dans Storage, tenant_documents, audit.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { logAudit } from '@/lib/auditLog';
import { RELOCATION_EXCEPTIONS } from '@/lib/entities';
import { normalizeDiscount, normalizeInstallments, type DepositInstallments } from '@/lib/leaseTerms';
import { buildLeaseV3, type LeaseV3Input, type ServiceLine } from '@/lib/bailV3/clauses';
import { computePricing } from '@/lib/bailV3/pricing';
import { fEUR, fRate } from '@/lib/bailV3/format';
import { BailV3PDF } from '@/lib/bailV3/BailV3PDF';
import { LeaseDocHtml } from '@/lib/bailV3/renderHtml';
import { entityToLease, propertyToLease, roomToLease, previousLeaseFacts, type PropertyV3Row, type RoomV3Row, type LeaseFactsRow } from '@/lib/bailV3/buildInput';
import type { CurrentChargesRow, EntityLegalRow, EntityRow, RelocationException, ServiceCatalogRow } from '@/lib/bailV3/types';
import { BAIL_SERVICES, BAIL_SERVICES_VERSION } from '@/data/bailServices';
import { NOTICE_INFORMATION_2023, NOTICE_SOURCE, NOTICE_TITLE } from '@/data/noticeInformation2023';

const NOTICE = { title: NOTICE_TITLE, source: NOTICE_SOURCE, sections: NOTICE_INFORMATION_2023 };

const HOUSE_SLUGS = ['lavilla', 'leloft', 'lelodge'];
const RGPD_EMAIL = 'hello@lavillacoliving.com';
const EDL_TOOL = 'Etadly';

interface FormState {
  property_id: string; room_id: string;
  nom: string; prenom: string; dob: string; birthplace: string; nationality: string; previous_address: string; email: string; phone: string; profession: string; employer: string;
  entry_date: string; lease_duration_months: number;
  discount_eur: number; deposit_installments: DepositInstallments;
  prev_hc: string; prev_paid_on: string; prev_revision: string; prev_departure: string; prev_works: string;
  relocation_exception: '' | RelocationException; override: boolean; override_reason: string;
  forfait_manual: string;            // saisi seulement si la maison n'a pas de forfait courant
  signatory_index: number;           // SCI : gérant signataire
  particular_clauses: string;
  total_cc_manual: string;           // loyer charges comprises saisi (prérempli avec le palier de la chambre, modifiable)
}
const EMPTY_FORM: FormState = {
  property_id: '', room_id: '', nom: '', prenom: '', dob: '', birthplace: '', nationality: '', previous_address: '', email: '', phone: '', profession: '', employer: '',
  entry_date: '', lease_duration_months: 12, discount_eur: 0, deposit_installments: 1,
  prev_hc: '', prev_paid_on: '', prev_revision: '', prev_departure: '', prev_works: 'néant',
  relocation_exception: '', override: false, override_reason: '', forfait_manual: '', signatory_index: 0, particular_clauses: '', total_cc_manual: '',
};

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function addMonthsISO(iso: string, months: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1 + months, d)).toISOString().slice(0, 10);
}
function fDateLong(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

const input: React.CSSProperties = { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' };
const label: React.CSSProperties = { display: 'block', fontWeight: 600, marginBottom: '6px', color: '#333', fontSize: '13px' };
const h3: React.CSSProperties = { color: '#333', marginBottom: '12px', marginTop: '28px', fontSize: '16px' };
const hint: React.CSSProperties = { fontSize: '12px', color: '#666', margin: '-4px 0 10px' };
const warn: React.CSSProperties = { background: '#fff7ed', border: '1px solid #fdba74', color: '#9a3412', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', marginBottom: '12px' };
const ok: React.CSSProperties = { background: '#f0fdf4', border: '1px solid #86efac', color: '#166534', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', marginBottom: '12px' };

export default function DashboardNouveauBailV3Page() {
  const isMobile = useIsMobile();
  const toast = useToast();
  const [properties, setProperties] = useState<PropertyV3Row[]>([]);
  const [rooms, setRooms] = useState<RoomV3Row[]>([]);
  const [entities, setEntities] = useState<EntityRow[]>([]);
  const [entityLegal, setEntityLegal] = useState<EntityLegalRow[]>([]);
  const [charges, setCharges] = useState<CurrentChargesRow[]>([]);
  const [services, setServices] = useState<ServiceCatalogRow[]>([]);
  const [roomLeases, setRoomLeases] = useState<LeaseFactsRow[]>([]);
  const [irl, setIrl] = useState<{ label: string; value: number; old: number | null; oldLabel: string; status: 'live' | 'cache' | 'manual' }>({ label: '', value: 0, old: null, oldLabel: '', status: 'manual' });
  const [rateText, setRateText] = useState('');       // saisie du taux (texte, pour autoriser la virgule)
  const [rate, setRate] = useState<{ eurChf: number; dateIso: string; status: 'live' | 'fallback' | 'manual' }>({ eurChf: 0, dateIso: todayISO(), status: 'fallback' });
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [replaceConfirm, setReplaceConfirm] = useState<{ id: string; first_name: string; last_name: string } | null>(null);
  const [annexeFiles, setAnnexeFiles] = useState<{ file: File; label: string }[]>([]);
  const [showPreview, setShowPreview] = useState(!isMobile);
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  // ---------- chargement ----------
  useEffect(() => {
    const load = async () => {
      const [p, r, e, l, c, s] = await Promise.all([
        supabase.from('properties').select('id, slug, name, address, city, room_count, common_areas, entity_id, is_coliving, dpe_class, surface_total_m2, equipment, setting_clause_fr, zone_tendue, relocation_exception_default, buildings_fr, buildings_intro_fr').eq('is_coliving', true),
        supabase.from('rooms').select('id, property_id, name, room_number, surface_m2, floor, location_detail, bathroom_type, bathroom_detail, has_parking, has_balcony, has_terrace, rent_eur, rent_chf, bloc_a').order('room_number'),
        supabase.from('entities').select('*'),
        supabase.from('entity_legal').select('*'),
        supabase.from('v_property_current_charges').select('*'),
        supabase.from('services_catalog').select('*').order('sort_order'),
      ]);
      const failed = [p, r, e, l, c, s].filter((x) => x.error);
      if (failed.length) toast.error('Chargement incomplet : ' + failed.map((x) => x.error?.message).join(' · ') + ' — la migration du lot 1 est-elle appliquée ?');
      setProperties(((p.data || []) as PropertyV3Row[]).filter((x) => HOUSE_SLUGS.includes(x.slug || '')));
      setRooms((r.data || []) as RoomV3Row[]);
      setEntities((e.data || []) as EntityRow[]);
      setEntityLegal((l.data || []) as EntityLegalRow[]);
      setCharges((c.data || []) as CurrentChargesRow[]);
      setServices((s.data || []) as ServiceCatalogRow[]);
      // taux BCE (1 € = X CHF) et IRL via les Edge Functions existantes
      try {
        const { data } = await supabase.functions.invoke('get-exchange-rate');
        if (data?.ok && data?.rate && data?.date) { setRate({ eurChf: Number(data.rate), dateIso: String(data.date), status: 'live' }); setRateText(String(data.rate)); }
      } catch { /* saisie manuelle */ }
      // IRL courant (Edge get-irl, série INSEE 001515333) + IRL du même trimestre de l'année précédente, lu dans
      // irl_indices (série tenue en base) ou, à défaut, dans irl_history (cache de la fonction). Rien n'est codé en dur.
      let period: string | null = null; let label = ''; let value = 0; let status: 'live' | 'cache' | 'manual' = 'manual';
      try {
        const { data } = await supabase.functions.invoke('get-irl');
        if (data?.ok && typeof data?.value === 'number' && data?.period_label) { period = String(data.period); label = String(data.period_label); value = Number(data.value); status = data.source === 'insee' ? 'live' : 'cache'; }
      } catch { /* repli ci-dessous */ }
      if (!period) {
        const { data: last } = await supabase.from('irl_indices').select('year, quarter, value').order('year', { ascending: false }).order('quarter', { ascending: false }).limit(1).maybeSingle();
        if (last) { period = `${last.year}-Q${last.quarter}`; label = `${last.quarter === 1 ? '1er' : `${last.quarter}ème`} trimestre ${last.year}`; value = Number(last.value); status = 'cache'; }
      }
      const m = period ? period.match(/^(\d{4})-Q([1-4])$/) : null;
      let old: number | null = null; let oldLabel = '';
      if (m) {
        const y = Number(m[1]) - 1, q = Number(m[2]);
        const { data: prev } = await supabase.from('irl_indices').select('value').eq('year', y).eq('quarter', q).maybeSingle();
        if (prev?.value != null) { old = Number(prev.value); oldLabel = `${q === 1 ? '1er' : `${q}ème`} trimestre ${y} (irl_indices)`; }
        else {
          const { data: h } = await supabase.from('irl_history').select('value').eq('period', `${y}-Q${q}`).maybeSingle();
          if (h?.value != null) { old = Number(h.value); oldLabel = `${q === 1 ? '1er' : `${q}ème`} trimestre ${y} (irl_history)`; }
        }
      }
      setIrl({ label, value, old, oldLabel, status });
    };
    load();
  }, [toast]);

  const property = properties.find((p) => p.id === form.property_id) || null;
  const room = rooms.find((r) => r.id === form.room_id) || null;
  const entity = property ? entities.find((e) => e.id === property.entity_id) || null : null;
  const legal = entity ? entityLegal.find((l) => l.entity_id === entity.id) || null : null;
  const currentCharges = property ? charges.find((c) => c.property_id === property.id) || null : null;
  const propertyRooms = rooms.filter((r) => r.property_id === form.property_id);

  // ---------- dernier bail de la chambre → encadré 2.6 (proposé, modifiable) ----------
  useEffect(() => {
    if (!property || !room) { setRoomLeases([]); return; }
    let cancelled = false;
    supabase.from('leases')
      .select('lease_version, status, start_date, end_date, created_at, rent_eur, rent_hc_eur, charges_forfait_eur, charges_energy_chf, charges_maintenance_chf, charges_services_chf')
      .eq('property_id', property.id).eq('room_number', room.room_number).order('start_date', { ascending: false }).limit(10)
      .then(({ data }) => {
        if (cancelled) return;
        const rows = (data || []) as LeaseFactsRow[];
        setRoomLeases(rows);
        const facts = previousLeaseFacts(rows, todayISO());
        setForm((f) => ({ ...f,
          total_cc_manual: room.rent_eur != null ? String(room.rent_eur) : '',
          prev_hc: facts.prev_hc != null ? String(facts.prev_hc) : '', prev_paid_on: facts.prev_paid_on || '', prev_revision: facts.prev_revision || '',
          prev_departure: facts.prev_departure || '', prev_works: 'néant',
          relocation_exception: facts.prev_hc == null ? 'first_letting' : ((property.relocation_exception_default as RelocationException | null) || ''),
          override: false, override_reason: '' }));
      });
    return () => { cancelled = true; };
  }, [property, room]);

  // ---------- calculs ----------
  const forfait = currentCharges ? Math.round(Number(currentCharges.per_room_month_eur)) : (Number(form.forfait_manual) || 0);
  const roomReferenceCc = room?.rent_eur != null ? Number(room.rent_eur) : 0;
  const totalCc = Number(form.total_cc_manual) > 0 ? Number(form.total_cc_manual) : roomReferenceCc;
  const prevHc = form.prev_hc.trim() === '' ? null : Number(form.prev_hc);
  const pricing = room ? computePricing({
    totalCc, forfait, prevHc, prevDepartureIso: form.prev_departure || null, irlNew: irl.value || 1, irlOld: irl.old || irl.value || 1,
    zoneTendue: property?.zone_tendue !== false, exception: form.relocation_exception || null, override: form.override,
    surfaceM2: Number(room.surface_m2), startIso: form.entry_date || todayISO(), eurChf: rate.eurChf || 0,
  }) : null;
  const discount = normalizeDiscount(form.discount_eur);
  const installments = normalizeInstallments(form.deposit_installments);
  const endIso = form.entry_date ? addMonthsISO(form.entry_date, form.lease_duration_months || 12) : '';

  const soleSignatory = useMemo(() => {
    // Indivision : mandat d'administration entre indivisaires (entity_legal.mandate.scope commence par « indivision »)
    const m = legal?.mandate;
    if (!entity || entity.legal_form !== 'indivision' || !m || !/indivis/i.test(m.scope || '')) return null;
    const sigs = (legal?.signatories || []).slice().sort((a, b) => a.order - b.order);
    const idx = Math.max(0, sigs.findIndex((s) => s.name === m.mandatary));
    const from = sigs.findIndex((_, i) => i !== idx);
    return from >= 0 ? { index: idx, mandate_from: from, mandate_date: m.since || null } : null;
  }, [entity, legal]);

  const leaseInput: LeaseV3Input | null = useMemo(() => {
    if (!property || !room || !entity || !pricing || !form.entry_date) return null;
    const catalog = services.filter((s) => s.property_id === property.id && s.active_from <= todayISO() && (!s.active_to || s.active_to > todayISO()));
    const lines: ServiceLine[] = catalog.length
      ? catalog.map((s) => ({ service: s.service, frequency: s.frequency || '—', provider: s.provider || '—', evidence: s.evidence || '—' }))
      : [...BAIL_SERVICES];
    return {
      entity: entityToLease(entity, legal, { signatoryIndex: form.signatory_index, soleSignatory }),
      property: propertyToLease(property),
      room: roomToLease(room, property.slug),
      tenant: { first_name: form.prenom, last_name: form.nom, dob: form.dob || null, birthplace: form.birthplace || null, nationality: form.nationality || null,
        previous_address: form.previous_address || null, email: form.email || null, phone: form.phone || null, profession: form.profession || null, employer: form.employer || null },
      terms: {
        start: form.entry_date, total_cc: totalCc, forfait, forfait_year: currentCharges?.fiscal_year || new Date().getFullYear(),
        forfait_method: currentCharges ? `${currentCharges.status === 'valide' ? 'charges' : 'charges provisoires'} ${currentCharges.fiscal_year} : ${fEUR(Number(currentCharges.total_recoverable_eur))} pour la maison` : 'forfait saisi dans le générateur',
        prev_hc: prevHc, prev_paid_on: form.prev_paid_on || null, prev_revision: form.prev_revision || null, prev_departure: form.prev_departure || null, prev_works: form.prev_works || null,
        relocation_exception: form.relocation_exception || null, override: form.override, override_reason: form.override_reason || null,
        irl_label: irl.label, irl_value: irl.value, irl_old_value: irl.old || irl.value,
        eur_chf: rate.eurChf || 0, eur_chf_date: fDateLong(rate.dateIso),
        discount_eur: discount || null, deposit_installments: installments, services_version: catalog[0]?.version || BAIL_SERVICES_VERSION,
        edl_tool: EDL_TOOL, rgpd_email: RGPD_EMAIL, zone_tendue: property.zone_tendue !== false,
      },
      services: lines,
      particular_clauses: form.particular_clauses || null,
      maquette: null,
    };
  }, [property, room, entity, legal, pricing, form, services, currentCharges, totalCc, forfait, prevHc, irl, rate, discount, installments, soleSignatory]);

  const doc = useMemo(() => (leaseInput ? buildLeaseV3(leaseInput) : null), [leaseInput]);
  const logoSrc = `${window.location.origin}/logos/logo-full.png`;

  // ---------- garde-fous ----------
  const blockers: string[] = [];
  if (property && !currentCharges && !(Number(form.forfait_manual) > 0)) blockers.push("Aucun forfait de charges courant pour cette maison : saisis-le dans l'onglet Maisons (lot 2) ou ci-dessous.");
  if (rate.status === 'fallback' && !(rate.eurChf > 0)) blockers.push('Taux BCE indisponible : saisis le taux du jour (1 € = … CHF).');
  if (room && room.rent_eur == null) blockers.push('La chambre n\'a pas de loyer en euros (rooms.rent_eur).');
  if (!(irl.value > 0)) blockers.push('IRL courant manquant : saisis le trimestre et l\'indice.');
  if (pricing?.capApplies && !(irl.old && irl.old > 0)) blockers.push('IRL du même trimestre de l\'année précédente manquant : saisis-le (il sert au plafond de relocation).');
  if (pricing?.capped && form.override && form.override_reason.trim().length < 10) blockers.push('La dérogation au plafond de relocation exige un motif (10 caractères minimum).');
  if (!form.nom || !form.prenom || !form.email || !form.entry_date) blockers.push('Nom, prénom, email et date d\'entrée sont obligatoires.');
  if (discount > 0 && pricing && discount > pricing.total) blockers.push('La remise dépasse le loyer du premier mois complet.');
  const canSave = !!doc && blockers.length === 0 && !saving;

  // ---------- PDF ----------
  const makePdf = async () => {
    if (!doc) throw new Error('document incomplet');
    return pdf(<BailV3PDF doc={doc} logoSrc={logoSrc} notice={NOTICE} />).toBlob();
  };
  const previewPdf = async () => {
    try { const blob = await makePdf(); window.open(URL.createObjectURL(blob), '_blank'); }
    catch (e) { toast.error('PDF : ' + ((e as Error).message || e)); }
  };

  // ---------- enregistrement ----------
  const doSave = async (oldTenantId?: string) => {
    if (!doc || !pricing || !property || !room || !entity || !leaseInput) return;
    setSaving(true);
    try {
      const payload = {
        old_tenant_id: oldTenantId || null,
        tenant: {
          first_name: form.prenom, last_name: form.nom, email: form.email, phone: form.phone || null, property_id: property.id, room_number: room.room_number,
          current_rent: pricing.total, rent_eur: pricing.hc, charges_forfait_eur: forfait, move_in_date: form.entry_date, bail_end: endIso,
          deposit_amount: pricing.deposit, date_of_birth: form.dob || null, place_of_birth: form.birthplace || null, occupation: form.profession || null, employer: form.employer || null,
          previous_tenant_rent_eur: prevHc, previous_tenant_departure_date: form.prev_departure || null,
          first_month_discount_eur: discount > 0 ? discount : null, first_month_discount_month: discount > 0 ? (Number(form.entry_date.slice(8, 10)) === 1 ? form.entry_date.slice(0, 7) : addMonthsISO(form.entry_date.slice(0, 7) + '-01', 1).slice(0, 7)) : null,
          deposit_installments: installments,
          notes: `Bail v3 généré le ${new Date().toLocaleDateString('fr-FR')}` + (discount > 0 ? ` · remise 1er mois complet ${discount} €` : '') + (installments > 1 ? ` · caution en ${installments} fois` : '') + (form.override ? ' · dérogation au plafond de relocation' : ''),
        },
        lease: {
          lease_version: 'v3', property_id: property.id, room_number: room.room_number,
          tenant_first_name: form.prenom, tenant_last_name: form.nom, tenant_email: form.email,
          rent_eur: pricing.total, rent_hc_eur: pricing.hc, charges_forfait_eur: forfait, rent_chf: null, deposit_eur: pricing.deposit,
          start_date: form.entry_date, end_date: endIso, lease_duration_months: form.lease_duration_months || 12,
          exchange_rate: rate.eurChf || null, exchange_rate_date: rate.dateIso || null,
          irl_quarter: irl.label, irl_value: irl.value,
          previous_rent_hc_eur: prevHc, previous_rent_paid_on: form.prev_paid_on || null, previous_rent_last_revision_on: null, previous_tenant_departure_on: form.prev_departure || null,
          relocation_cap_hc_eur: pricing.cap, relocation_exception: form.relocation_exception || null, exposed_premium_eur: pricing.exposedPremium || null,
          relocation_override_reason: form.override ? form.override_reason : null, entry_fee_eur: pricing.fees,
          entity_snapshot: { entity: leaseInput.entity, forfait: currentCharges, irl, rate },
          services_catalog_version: leaseInput.terms.services_version,
          first_month_discount_eur: discount > 0 ? discount : null,
          first_month_discount_month: discount > 0 ? (Number(form.entry_date.slice(8, 10)) === 1 ? form.entry_date.slice(0, 7) : addMonthsISO(form.entry_date.slice(0, 7) + '-01', 1).slice(0, 7)) : null,
          deposit_installments: installments, status: 'draft',
        },
      };
      const { data: created, error } = await supabase.rpc('create_lease_v3', { p: payload });
      if (error) throw error;
      const tenantId: string = created?.tenant_id; const leaseId: string = created?.lease_id;
      // PDF → Storage → fiche du bail et documents du locataire
      let documentUrl: string | null = null;
      try {
        const blob = await makePdf();
        const path = `tenants/${tenantId}/Bail_v3_${form.nom}_${form.prenom}_${form.entry_date}.pdf`.replace(/[^a-zA-Z0-9._/-]/g, '_');
        const { error: upErr } = await supabase.storage.from('operations').upload(path, blob, { contentType: 'application/pdf', upsert: true });
        if (upErr) throw upErr;
        documentUrl = path;
        await supabase.from('leases').update({ document_url: path, generated_at: new Date().toISOString() }).eq('id', leaseId);
        await supabase.from('tenant_documents').insert({ tenant_id: tenantId, type: 'bail', label: `Bail v3 ${form.prenom} ${form.nom} — ${property.name}`, file_url: path });
      } catch (e) { toast.warning('Bail enregistré, mais le PDF n\'a pas pu être déposé : ' + ((e as Error).message || e)); }
      // annexes déposées à la main (diagnostics, règlement…)
      let uploaded = 0;
      for (const { file, label: lbl } of annexeFiles) {
        const path = `tenants/${tenantId}/annexes/${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const { error: upErr } = await supabase.storage.from('operations').upload(path, file, { contentType: file.type, upsert: true });
        if (!upErr) { await supabase.from('tenant_documents').insert({ tenant_id: tenantId, type: 'annexe', label: lbl || file.name, file_url: path }); uploaded++; }
      }
      logAudit('lease_generated', 'tenant', tenantId, {
        lease_version: 'v3', lease_id: leaseId, name: `${form.prenom} ${form.nom}`, property: property.name, room: room.room_number,
        total_eur: pricing.total, room_reference_total_eur: roomReferenceCc, rent_overridden: totalCc !== roomReferenceCc, rent_hc_eur: pricing.hc, forfait_eur: forfait, deposit_eur: pricing.deposit, entry_date: form.entry_date,
        relocation_cap: pricing.cap, capped: pricing.capped, override: form.override, exposed_premium_eur: pricing.exposedPremium,
        discount_eur: discount, deposit_installments: installments, document_url: documentUrl, annexe_files_uploaded: uploaded,
      });
      if (form.override && pricing.capped) {
        logAudit('relocation_override', 'tenant', tenantId, { lease_id: leaseId, room: `${property.name} ${room.room_number}`, cap_hc_eur: pricing.cap, hc_eur: pricing.hc, exposed_premium_eur: pricing.exposedPremium, reason: form.override_reason });
      }
      if (oldTenantId) logAudit('tenant_deactivated', 'tenant', oldTenantId);
      toast.success(`Bail v3 créé en brouillon pour ${form.prenom} ${form.nom}.${documentUrl ? ' PDF déposé.' : ''} → Envoie-le à la signature, puis confirme depuis la fiche locataire.`);
      setForm({ ...EMPTY_FORM, property_id: form.property_id });
      setAnnexeFiles([]);
    } catch (e) {
      toast.error('Erreur : ' + ((e as Error).message || e));
    } finally { setSaving(false); }
  };
  const handleSave = async () => {
    if (!canSave || !property || !room) { if (blockers[0]) toast.warning(blockers[0]); return; }
    const { data: existing } = await supabase.from('tenants').select('id, first_name, last_name').eq('property_id', property.id).eq('room_number', room.room_number).eq('is_active', true);
    if (existing && existing.length) setReplaceConfirm(existing[0]); else doSave();
  };

  // ---------- rendu ----------
  const field = (k: keyof FormState, placeholder: string, type: string = 'text') => (
    <input type={type} placeholder={placeholder} value={String(form[k] ?? '')} onChange={(e) => set(k, e.target.value as never)} style={input} />
  );
  const sciSignatories = entity?.legal_form === 'sci' ? (legal?.signatories || []).slice().sort((a, b) => a.order - b.order) : [];

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', height: isMobile ? 'auto' : '100vh', background: '#fafafa' }}>
      <div className="dash-scroll-x bail-form-panel" style={{ flex: isMobile ? '0 0 auto' : '0 0 540px', overflowY: 'auto', background: 'white', padding: isMobile ? '16px' : '30px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#333', marginBottom: '6px', fontFamily: 'Georgia, serif' }}>Nouveau bail</h1>
        <p style={{ ...hint, marginBottom: 20 }}>Gabarit v3 (loyer en euros, forfait de charges par maison, plafond de relocation). L'ancien gabarit reste disponible sous <a href="/dashboard/nouveau-bail/v2">nouveau-bail/v2</a>.</p>

        <label style={label}>Maison</label>
        <select value={form.property_id} onChange={(e) => setForm({ ...EMPTY_FORM, property_id: e.target.value })} style={input}>
          <option value="">-- Sélectionner --</option>
          {properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        {property && (
          <>
            <label style={label}>Chambre</label>
            <select value={form.room_id} onChange={(e) => set('room_id', e.target.value)} style={input}>
              <option value="">-- Sélectionner --</option>
              {propertyRooms.map((r) => <option key={r.id} value={r.id}>{r.name} — {r.surface_m2} m² — {r.rent_eur != null ? `${r.rent_eur} €` : 'loyer € manquant'}</option>)}
            </select>
            <div style={hint}>
              Bailleur : {entity ? `${entity.legal_name || entity.name}${entity.legal_form === 'indivision' && soleSignatory ? ' — signature de Jérôme au nom des deux (mandat du 28/10/2026)' : ''}` : 'entité introuvable'}
              {' · '}Forfait courant : {currentCharges ? `${Math.round(Number(currentCharges.per_room_month_eur))} € (${currentCharges.status} ${currentCharges.fiscal_year})` : 'aucun'}
            </div>
            {!currentCharges && (<><label style={label}>Forfait de charges (€/mois, faute de saisie dans Maisons)</label>{field('forfait_manual', 'ex. 344', 'number')}</>)}
            {sciSignatories.length > 1 && (
              <><label style={label}>Signataire pour la SCI</label>
                <select value={form.signatory_index} onChange={(e) => set('signatory_index', Number(e.target.value))} style={input}>
                  {sciSignatories.map((s, i) => <option key={i} value={i}>{s.name}, {s.quality}</option>)}
                </select></>
            )}
          </>
        )}

        <h3 style={h3}>Locataire</h3>
        {field('nom', 'Nom')}{field('prenom', 'Prénom')}
        <label style={label}>Date de naissance</label>{field('dob', '', 'date')}
        {field('birthplace', 'Lieu de naissance')}{field('nationality', 'Nationalité')}{field('previous_address', 'Adresse précédente')}
        {field('email', 'Email', 'email')}{field('phone', 'Téléphone', 'tel')}{field('profession', 'Profession')}{field('employer', 'Employeur')}

        <h3 style={h3}>Conditions</h3>
        <label style={label}>Date d'entrée</label>{field('entry_date', '', 'date')}
        <label style={label}>Durée (mois) — 12 par défaut, tacite reconduction</label>
        <input type="number" min={1} max={60} value={form.lease_duration_months} onChange={(e) => set('lease_duration_months', Math.max(1, Math.min(60, Number(e.target.value) || 12)))} style={input} />
        {endIso && <div style={hint}>Fin de la période initiale : {fDateLong(addMonthsISO(endIso, 0) === endIso ? new Date(new Date(endIso).getTime() - 86400000).toISOString().slice(0, 10) : endIso)}</div>}
        <label style={label}>Remise sur le premier mois complet (€, 0 = aucune)</label>
        <input type="number" min={0} value={form.discount_eur} onChange={(e) => set('discount_eur', Number(e.target.value) || 0)} style={input} />
        <label style={label}>Dépôt de garantie versé en</label>
        <select value={form.deposit_installments} onChange={(e) => set('deposit_installments', normalizeInstallments(e.target.value))} style={input}>
          <option value={1}>1 fois (à la signature)</option><option value={2}>2 fois</option><option value={3}>3 fois</option>
        </select>

        {room && pricing && (
          <>
            <h3 style={h3}>Loyer et relocation</h3>
            <label style={label}>Loyer mensuel charges comprises (€) — palier de la fiche chambre : {fEUR(roomReferenceCc)}</label>
            <input type="number" min={0} step={1} value={form.total_cc_manual} onChange={(e) => set('total_cc_manual', e.target.value)} style={input} />
            {totalCc !== roomReferenceCc && <div style={{ ...hint, color: '#b45309' }}>Loyer différent du palier de la chambre ({fEUR(roomReferenceCc)}) : l'écart sera journalisé.</div>}
            <div style={{ fontSize: '13px', lineHeight: 1.7, marginBottom: 10 }}>
              Forfait de charges <strong>{fEUR(forfait)}</strong> → loyer hors charges cible <strong>{fEUR(pricing.hcTarget)}</strong>
              {rate.eurChf > 0 ? <><br />CHF indicatif : {fEUR(pricing.total)} = {Math.round(pricing.total * rate.eurChf)} CHF au taux 1 € = {fRate(rate.eurChf)} CHF</> : <><br /><span style={{ color: '#b45309' }}>Taux de change manquant : saisis-le ci-dessous.</span></>}
            </div>
            <label style={label}>Taux de change (1 € = … CHF) — {rate.status === 'live' ? `BCE du ${fDateLong(rate.dateIso)}, modifiable` : rate.status === 'manual' ? `saisi manuellement le ${fDateLong(rate.dateIso)}` : 'API indisponible : saisis le taux du jour'}</label>
            <input type="text" inputMode="decimal" placeholder="ex. 0,9222" value={rateText} onChange={(e) => { const v = e.target.value; setRateText(v); const n = Number(v.replace(',', '.')); setRate({ eurChf: n > 0 ? n : 0, dateIso: todayISO(), status: 'manual' }); }} style={input} />
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 2 }}><label style={label}>IRL : trimestre</label><input value={irl.label} onChange={(e) => setIrl({ ...irl, label: e.target.value, status: 'manual' })} style={input} /></div>
              <div style={{ flex: 1 }}><label style={label}>Indice</label><input type="number" step="0.01" value={irl.value} onChange={(e) => setIrl({ ...irl, value: Number(e.target.value) || 0, status: 'manual' })} style={input} /></div>
              <div style={{ flex: 1 }}><label style={label}>Indice n−1</label><input type="number" step="0.01" value={irl.old ?? ''} onChange={(e) => setIrl({ ...irl, old: Number(e.target.value) || null, oldLabel: 'saisi', status: 'manual' })} style={input} /></div>
            </div>
            <div style={hint}>IRL : {irl.status === 'live' ? 'INSEE' : irl.status === 'cache' ? 'cache' : 'saisie manuelle'}{irl.oldLabel ? ` · n−1 : ${irl.oldLabel}` : ' · n−1 introuvable en base, à saisir'}</div>
            <label style={label}>Dernier loyer hors charges du précédent locataire (€) — {roomLeases.length ? `proposé d'après le dernier bail de la chambre` : 'aucun bail connu'}</label>
            {field('prev_hc', 'vide = première mise en location', 'number')}
            <label style={label}>Payé le</label>{field('prev_paid_on', '', 'date')}
            <label style={label}>Dernière révision</label>{field('prev_revision', 'aucune (bail du …)')}
            <label style={label}>Départ du précédent locataire</label>{field('prev_departure', '', 'date')}
            <label style={label}>Travaux depuis le dernier bail</label>{field('prev_works', 'néant')}
            <label style={label}>Exception au plafond de relocation</label>
            <select value={form.relocation_exception} onChange={(e) => set('relocation_exception', e.target.value as FormState['relocation_exception'])} style={input}>
              <option value="">aucune (plafond applicable)</option>
              {RELOCATION_EXCEPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            {pricing.capApplies && pricing.cap != null && (
              pricing.capped ? (
                <div style={warn}>
                  Plafond de relocation : {fEUR(pricing.cap)} hors charges (dernier loyer {fEUR(prevHc || 0)} × {irl.value} / {irl.old || irl.value}), en dessous du loyer cible {fEUR(pricing.hcTarget)}.
                  <label style={{ display: 'block', marginTop: 8 }}><input type="checkbox" checked={form.override} onChange={(e) => set('override', e.target.checked)} /> Appliquer quand même le loyer cible (dérogation, écart {fEUR(pricing.hcTarget - pricing.cap)} par mois, journalisé)</label>
                  {form.override && <input placeholder="Motif de la dérogation (obligatoire)" value={form.override_reason} onChange={(e) => set('override_reason', e.target.value)} style={{ ...input, marginTop: 8 }} />}
                </div>
              ) : <div style={ok}>Plafond de relocation {fEUR(pricing.cap)} ≥ loyer cible : le décret est respecté.</div>
            )}
            <div style={{ background: '#f9f7f4', border: '1px solid #e5decf', borderRadius: 6, padding: '10px 12px', fontSize: '13px', lineHeight: 1.7 }}>
              <strong>Loyer hors charges retenu : {fEUR(pricing.hc)}</strong> · forfait {fEUR(forfait)} · <strong>total {fEUR(pricing.total)}</strong> par mois<br />
              Dépôt {fEUR(pricing.deposit)}{installments > 1 ? ` en ${installments} fois` : ''} · frais de dossier et d'état des lieux {fEUR(pricing.fees)} (offerts à 3 mois)
              {pricing.prorataDays ? <><br />Prorata d'entrée {pricing.prorataDays}/30 : {fEUR(pricing.prorataTotal)}</> : null}
              {discount > 0 && <><br />Remise {fEUR(discount)} sur le premier mois complet → {fEUR(pricing.total - discount)}</>}
            </div>
          </>
        )}

        <h3 style={h3}>Clauses particulières (optionnel)</h3>
        <textarea value={form.particular_clauses} onChange={(e) => set('particular_clauses', e.target.value)} placeholder="Un paragraphe par ligne vide. Laisse vide s'il n'y en a pas." style={{ ...input, minHeight: 80 }} />

        <h3 style={h3}>Documents à joindre au dossier (diagnostics, règlement…)</h3>
        <input type="file" multiple onChange={(e) => setAnnexeFiles([...annexeFiles, ...Array.from(e.target.files || []).map((file) => ({ file, label: file.name }))])} style={{ marginBottom: 10 }} />
        {annexeFiles.map((a, i) => <div key={i} style={{ fontSize: 13, display: 'flex', gap: 8, alignItems: 'center' }}><span style={{ flex: 1 }}>{a.file.name}</span><button onClick={() => setAnnexeFiles(annexeFiles.filter((_, j) => j !== i))} style={{ border: 'none', background: 'none', color: '#b91c1c', cursor: 'pointer' }}>retirer</button></div>)}

        {blockers.length > 0 && form.property_id && form.room_id && <div style={{ ...warn, marginTop: 16 }}>{blockers.map((b, i) => <div key={i}>• {b}</div>)}</div>}
        <div className="dash-toolbar" style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button onClick={previewPdf} disabled={!doc} style={{ flex: 1, padding: 12, background: doc ? '#c9a96e' : '#ccc', color: 'white', border: 'none', borderRadius: 4, fontWeight: 600, cursor: doc ? 'pointer' : 'not-allowed' }}>Voir le PDF</button>
          {isMobile && <button onClick={() => setShowPreview(!showPreview)} style={{ flex: 1, padding: 12, background: '#999', color: 'white', border: 'none', borderRadius: 4, fontWeight: 600 }}>{showPreview ? 'Masquer l\'aperçu' : 'Aperçu'}</button>}
          <button onClick={handleSave} disabled={!canSave} style={{ flex: 1, padding: 12, background: canSave ? '#27AB9F' : '#999', color: 'white', border: 'none', borderRadius: 4, fontWeight: 600, cursor: canSave ? 'pointer' : 'not-allowed' }}>{saving ? 'Enregistrement…' : '✓ Enregistrer le bail'}</button>
        </div>
      </div>

      {(showPreview || !isMobile) && (
        <div style={{ flex: 1, overflowY: 'auto', background: '#f5f5f5', padding: isMobile ? 12 : 30, display: 'flex', justifyContent: isMobile ? 'flex-start' : 'center' }}>
          {doc ? (
            <div id="contract-preview" style={{ boxShadow: '0 0 20px rgba(0,0,0,0.15)', borderRadius: 4, flexShrink: isMobile ? 0 : undefined }}>
              <LeaseDocHtml doc={doc} logoSrc={logoSrc} notice={NOTICE} />
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#999', paddingTop: 100, fontSize: 16 }}>Choisis une maison, une chambre et une date d'entrée pour voir le contrat.</div>
          )}
        </div>
      )}

      {replaceConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: 'white', borderRadius: 8, padding: 24, maxWidth: 420 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 16 }}>Chambre occupée</h3>
            <p style={{ fontSize: 14 }}>{replaceConfirm.first_name} {replaceConfirm.last_name} est encore actif sur cette chambre. Le désactiver et créer le nouveau bail ?</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setReplaceConfirm(null)} style={{ padding: '8px 16px', border: '1px solid #ddd', background: '#fff', borderRadius: 6 }}>Annuler</button>
              <button onClick={() => { const id = replaceConfirm.id; setReplaceConfirm(null); doSave(id); }} style={{ padding: '8px 16px', background: '#27AB9F', color: 'white', border: 'none', borderRadius: 6 }}>Remplacer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
