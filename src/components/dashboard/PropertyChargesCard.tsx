/**
 * Carte « Forfait de charges » de l'onglet Maisons (lot 2 du bail v3, 10/11/2026) : saisie manuelle des charges
 * récupérables d'une maison, exercice par exercice. Décision de Jérôme (26/10/2026) : pas de moteur de charges, le
 * cabinet comptable fait les clôtures et Jérôme recopie les montants ici.
 *
 * Par exercice : lignes « poste du décret → montant annuel → % récupérable », total, forfait = total ÷ chambres ÷ 12,
 * date d'effet, statut provisoire ou validé. Un exercice validé ne se modifie plus sans correction motivée et
 * journalisée. Le générateur de bail lit le forfait en vigueur (vue v_property_current_charges) ; l'« État
 * récapitulatif des charges » (PDF) sort des lignes enregistrées.
 *
 * Toutes les règles sont dans src/lib/bailV3/charges.ts et chargesEntry.ts (testées) ; l'accès à la base passe par
 * l'interface ChargesStore (Supabase ici, mémoire dans l'aperçu /dev/charges).
 */
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { CHARGE_POSTES } from '@/data/chargePostes';
import { PROJECTION_POSTE, currentExercise, exerciseStanding, localTodayIso, printedForfaitEur, type ExerciseStanding } from '@/lib/bailV3/charges';
import {
  draftFromExercise, draftIssues, draftToPayload, draftTotals, forfaitChange, lineForPoste, newExerciseDraft, replaceProjection,
  publicLabel, statementFromExercise, validationIssues, type ChargeLineDraft, type ChargesExercise, type ExerciseDraft,
} from '@/lib/bailV3/chargesEntry';
import { supabaseChargesStore, type ChargesStore } from '@/lib/bailV3/chargesStore';
import { leaseAddress } from '@/lib/bailV3/buildInput';
import { fEUR, fDate } from '@/lib/bailV3/format';

interface Props {
  property: { id: string; slug: string | null; name: string; address: string; room_count: number };
  /** Bailleur imprimé sur l'état récapitulatif (entité juridique de la maison). */
  lessor: { name: string; address: string | null } | null;
  isMobile?: boolean;
  store?: ChargesStore;
  /** Date du jour (AAAA-MM-JJ) : seulement pour l'aperçu de développement. */
  todayIso?: string;
  /** Appelé après chaque écriture : la page recharge le forfait en vigueur. */
  onChanged?: () => void;
}

type Busy = null | 'save' | 'validate' | 'reopen' | 'delete' | 'pdf';
type Confirm = null | 'validate' | 'delete' | 'reopen';

const GOLD = '#b8860b';
const S = {
  card: { background: '#fff', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px' },
  h3: { margin: '0 0 4px', fontSize: '16px', color: '#1a1a2e' },
  hint: { margin: '0 0 12px', fontSize: '12px', color: '#777', lineHeight: 1.5 },
  btn: { padding: '6px 14px', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' },
  ghost: { padding: '6px 14px', border: '1px solid #ddd', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', background: '#fff', color: '#1a1a2e' },
  input: { width: '100%', padding: '7px 9px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' as const },
  label: { fontSize: '12px', fontWeight: 600 as const, color: '#555', marginBottom: '4px', display: 'block' as const },
  th: { fontSize: '11px', color: '#888', textTransform: 'uppercase' as const, padding: '0 6px 6px' },
  info: { background: '#f9f7f4', borderLeft: '3px solid #c9a96e', borderRadius: '6px', padding: '10px 12px', fontSize: '13px', lineHeight: 1.6, margin: '12px 0' },
  warn: { background: '#fff7ed', border: '1px solid #fdba74', borderRadius: '6px', padding: '10px 12px', fontSize: '13px', lineHeight: 1.6, color: '#9a3412', margin: '12px 0' },
  error: { background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '6px', padding: '10px 12px', fontSize: '13px', lineHeight: 1.6, color: '#b91c1c', margin: '12px 0' },
};
const GRID = 'minmax(190px, 2.2fr) 120px 76px 110px minmax(130px, 1.3fr) 34px';

function message(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}
function standingText(st: ExerciseStanding): string {
  switch (st.kind) {
    case 'current': return 'En vigueur : c\'est le forfait des nouveaux baux.';
    case 'future': return `S'appliquera aux baux générés à partir du ${fDate(st.from)}.`;
    case 'future_needs_validation': return `Date d'effet le ${fDate(st.from)}, mais tant que cet exercice n'est pas validé, l'exercice ${st.by} (validé) reste appliqué.`;
    case 'needs_validation': return `Pas encore appliqué : l'exercice ${st.by} est validé et prime sur un exercice provisoire. Valide celui-ci pour qu'il s'applique.`;
    case 'superseded': return `Remplacé par l'exercice ${st.by}.`;
    default: return '';
  }
}

export default function PropertyChargesCard({ property, lessor, isMobile = false, store = supabaseChargesStore, todayIso, onChanged }: Props) {
  const toast = useToast();
  const today = todayIso || localTodayIso();
  const [data, setData] = useState<{ propertyId: string; rows: ChargesExercise[] } | null>(null);
  const [loadError, setLoadError] = useState<{ propertyId: string; text: string } | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const wanted = useRef<string | null>(null);
  const [draft, setDraft] = useState<ExerciseDraft | null>(null);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState<Busy>(null);
  const [confirm, setConfirm] = useState<Confirm>(null);
  const [reopenReason, setReopenReason] = useState('');

  useEffect(() => {
    let cancelled = false;
    store.list(property.id).then((list) => {
      if (cancelled) return;
      const pick = (wanted.current && list.find((r) => r.id === wanted.current)) || currentExercise(list, property.id, today) || list[0] || null;
      wanted.current = null;
      setData({ propertyId: property.id, rows: list });
      setLoadError(null);
      setDraft(pick ? draftFromExercise(pick) : null);
      setDirty(false);
      setConfirm(null);
    }).catch((e) => { if (!cancelled) setLoadError({ propertyId: property.id, text: message(e) }); });
    return () => { cancelled = true; };
  }, [store, property.id, today, reloadKey]);

  const ready = !!data && data.propertyId === property.id;
  const rows = ready ? data.rows : [];
  const failed = loadError && loadError.propertyId === property.id ? loadError.text : null;
  const current = currentExercise(rows, property.id, today);
  const mine = ready && draft && draft.property_id === property.id ? draft : null;
  const saved = mine?.id ? rows.find((r) => r.id === mine.id) || null : null;
  const readOnly = saved?.status === 'valide';
  const totals = mine ? draftTotals(mine) : null;
  const issues = mine && !readOnly ? draftIssues(mine, { rows, todayIso: today }) : [];
  const vIssues = mine && !readOnly ? validationIssues(mine) : [];
  const hasProjection = !!mine?.lines.some((l) => l.poste_code === PROJECTION_POSTE);
  const standing = saved ? standingText(exerciseStanding(rows, saved.id, today)) : '';
  const headerMismatch = !!saved && Math.abs(saved.lines.reduce((s, l) => s + l.recoverable_eur, 0) - saved.total_recoverable_eur) > 0.005;
  const canDelete = !!saved && !readOnly && (!current || !!currentExercise(rows.filter((r) => r.id !== saved.id), property.id, today));
  // Montants de l'exercice précédent, pour repérer une faute de frappe d'un coup d'œil.
  const previous = mine ? rows.filter((r) => r.fiscal_year < mine.fiscal_year).sort((a, b) => b.fiscal_year - a.fiscal_year)[0] : undefined;
  const previousByPoste = new Map((previous?.lines || []).filter((l) => l.poste_code !== 'autre' && l.poste_code !== PROJECTION_POSTE).map((l) => [l.poste_code, l.amount_eur]));
  const usedCodes = new Set((mine?.lines || []).map((l) => l.poste_code));
  const addable = CHARGE_POSTES.filter((p) => p.code !== PROJECTION_POSTE && (p.code === 'autre' || !usedCodes.has(p.code)));

  const edit = (fn: (d: ExerciseDraft) => ExerciseDraft) => { setDraft((d) => (d ? fn(d) : d)); setDirty(true); setConfirm(null); };
  const updateLine = (key: string, patch: Partial<ChargeLineDraft>) => edit((d) => ({ ...d, lines: d.lines.map((l) => (l.key === key ? { ...l, ...patch } : l)) }));
  const leaveOk = () => !dirty || window.confirm('Tes modifications ne sont pas enregistrées. Les abandonner ?');
  const reload = (selectId: string | null) => { wanted.current = selectId; setReloadKey((k) => k + 1); };

  const selectExercise = (id: string) => {
    const row = rows.find((r) => r.id === id);
    if (!row || !leaveOk()) return;
    setDraft(draftFromExercise(row)); setDirty(false); setConfirm(null);
  };
  const startNew = () => {
    if (!leaveOk()) return;
    const years = rows.map((r) => r.fiscal_year);
    const fiscalYear = years.length ? Math.max(...years) + 1 : Number(today.slice(0, 4)) - 1;
    setDraft(newExerciseDraft({ propertyId: property.id, houseSlug: property.slug, roomCount: property.room_count, fiscalYear, todayIso: today }));
    setDirty(true); setConfirm(null);
  };

  const save = async () => {
    if (!mine || issues.length) return;
    setBusy('save');
    try {
      const id = await store.save(draftToPayload(mine));
      toast.success(`Charges ${mine.fiscal_year} enregistrées`);
      reload(id); onChanged?.();
    } catch (e) { toast.error(message(e)); } finally { setBusy(null); }
  };
  const validate = async () => {
    if (!mine || issues.length || vIssues.length) return;
    setBusy('validate');
    let id = mine.id;
    try {
      if (dirty || !id) id = await store.save(draftToPayload(mine));
      await store.validate(id as string);
      toast.success(`Charges ${mine.fiscal_year} validées`);
    } catch (e) { toast.error(message(e)); } finally { setBusy(null); reload(id); onChanged?.(); }
  };
  const reopen = async () => {
    if (!saved || reopenReason.trim().length < 10) return;
    setBusy('reopen');
    try {
      await store.reopen(saved.id, reopenReason.trim());
      toast.success(`Exercice ${saved.fiscal_year} rouvert pour correction`);
      setReopenReason('');
    } catch (e) { toast.error(message(e)); } finally { setBusy(null); reload(saved.id); onChanged?.(); }
  };
  const remove = async () => {
    if (!saved || !canDelete) return;
    setBusy('delete');
    try {
      await store.remove(saved.id);
      toast.success(`Exercice ${saved.fiscal_year} supprimé`);
    } catch (e) { toast.error(message(e)); } finally { setBusy(null); reload(null); onChanged?.(); }
  };
  const exportPdf = async () => {
    if (!saved || dirty) return;
    setBusy('pdf');
    try {
      const [{ pdf }, { ChargesStatementPDF }] = await Promise.all([import('@react-pdf/renderer'), import('@/lib/bailV3/ChargesStatementPDF')]);
      const st = statementFromExercise(saved, { name: property.name, address: leaseAddress(property.address) }, lessor, today);
      const blob = await pdf(<ChargesStatementPDF st={st} logoSrc={`${window.location.origin}/logos/logo-full.png`} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `Etat_charges_${property.name.replace(/\s+/g, '_')}_${saved.fiscal_year}.pdf`; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (e) { toast.error(`PDF impossible : ${message(e)}`); } finally { setBusy(null); }
  };

  const change = mine && confirm === 'validate' ? forfaitChange(rows, mine, 'valide', today) : null;
  // Enregistrer l'exercice en vigueur change tout de suite le forfait des nouveaux baux : on l'annonce avant.
  const saveEffect = mine && dirty && !readOnly && issues.length === 0 ? forfaitChange(rows, mine, mine.status, today) : null;

  return (
    <div style={S.card} data-testid="charges-card">
      <h3 style={S.h3}>Forfait de charges (bail v3)</h3>
      <p style={S.hint}>
        Tu recopies ici les charges récupérables de la maison, exercice par exercice, d'après la clôture de ton cabinet comptable.
        Le forfait d'une chambre = total récupérable ÷ nombre de chambres ÷ 12 mois. Le générateur de bail prend le forfait en vigueur.
      </p>

      {failed && <div style={S.error}>Lecture des charges impossible : {failed}</div>}
      {!ready && !failed && <p style={{ color: GOLD, fontSize: '13px' }}>Chargement…</p>}

      {ready && (
        <>
          <div style={S.info} data-testid="charges-current">
            {current
              ? <>Forfait en vigueur : <strong>{fEUR(printedForfaitEur(current.per_room_month_eur))} par chambre et par mois</strong> ({fEUR(current.per_room_month_eur)} avant arrondi) — exercice {current.fiscal_year}, {current.status === 'valide' ? 'validé' : 'provisoire'}, depuis le {fDate(current.effective_from)}.</>
              : <>Aucun forfait en vigueur pour cette maison : le générateur de bail demandera de le saisir à la main.</>}
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '14px' }}>
            {rows.map((r) => {
              const active = mine?.id === r.id;
              return (
                <button key={r.id} onClick={() => selectExercise(r.id)} style={{ ...S.btn, background: active ? GOLD : '#f5f5f5', color: active ? '#fff' : '#1a1a2e', fontWeight: active ? 600 : 400 }}>
                  {r.fiscal_year} · {r.status === 'valide' ? 'validé' : 'provisoire'}{current?.id === r.id ? ' · en vigueur' : ''}
                </button>
              );
            })}
            {mine && !mine.id && <span style={{ ...S.btn, background: GOLD, color: '#fff', fontWeight: 600, cursor: 'default' }}>Nouvel exercice</span>}
            {!(mine && !mine.id) && <button onClick={startNew} style={S.ghost}>+ Nouvel exercice</button>}
          </div>

          {!mine && <p style={{ fontSize: '13px', color: '#555' }}>Aucune charge saisie pour cette maison. Clique sur « Nouvel exercice » pour commencer.</p>}

          {mine && totals && (
            <>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'baseline', marginBottom: '8px' }}>
                {mine.id
                  ? <strong style={{ fontSize: '15px', color: '#1a1a2e' }}>Exercice {mine.fiscal_year}</strong>
                  : <label style={{ fontSize: '14px', fontWeight: 600 }}>Exercice{' '}
                      <input type="number" aria-label="Année de l'exercice" value={mine.fiscal_year} onChange={(e) => edit((d) => ({ ...d, fiscal_year: Number(e.target.value) || 0 }))} style={{ ...S.input, width: '90px', display: 'inline-block' }} />
                    </label>}
                <span style={{ fontSize: '12px', padding: '2px 10px', borderRadius: '12px', background: readOnly ? '#dcfce7' : '#fef3c7', color: readOnly ? '#166534' : '#92400e' }}>
                  {readOnly ? `Validé${saved?.validated_at ? ` le ${fDate(saved.validated_at.slice(0, 10))}` : ''}${saved?.validated_by ? ` par ${saved.validated_by}` : ''}` : mine.id ? 'Provisoire' : 'Pas encore enregistré'}
                </span>
                {standing && <span style={{ fontSize: '12px', color: '#555' }} data-testid="charges-standing">{standing}</span>}
              </div>

              {hasProjection && !readOnly && (
                <div style={S.info}>
                  Cet exercice est une <strong>projection</strong> : les charges récupérables réelles de l'année précédente, majorées de 10 %.
                  Quand ton cabinet a clôturé {mine.fiscal_year}, clique sur « Saisir la clôture » : la projection laisse la place aux postes du décret, tu recopies les montants, puis tu valides.
                  <div style={{ marginTop: '8px' }}><button onClick={() => edit((d) => replaceProjection(d, property.slug))} style={{ ...S.btn, background: '#1a1a2e', color: '#fff' }}>Saisir la clôture</button></div>
                </div>
              )}
              {headerMismatch && !dirty && <div style={S.warn}>Le total enregistré ({fEUR(saved!.total_recoverable_eur)}) ne correspond pas à la somme des lignes : clique sur « Enregistrer » pour le recalculer.</div>}

              <div style={{ overflowX: 'auto' }}>
                <div style={{ minWidth: isMobile ? '700px' : undefined }}>
                  <div style={{ display: 'grid', gridTemplateColumns: GRID, gap: '6px', alignItems: 'end' }}>
                    <span style={S.th}>Poste</span>
                    <span style={{ ...S.th, textAlign: 'right' }}>Montant annuel (€)</span>
                    <span style={{ ...S.th, textAlign: 'right' }}>% récup.</span>
                    <span style={{ ...S.th, textAlign: 'right' }}>Part récupérable</span>
                    <span style={S.th}>Justificatif</span>
                    <span />
                  </div>
                  {mine.lines.map((l, i) => {
                    const poste = CHARGE_POSTES.find((p) => p.code === l.poste_code);
                    const before = previousByPoste.get(l.poste_code);
                    const name = publicLabel(poste?.label || l.label) || 'autre poste';
                    return (
                      <div key={l.key} data-testid="charges-line" style={{ display: 'grid', gridTemplateColumns: GRID, gap: '6px', alignItems: 'start', padding: '6px 0', borderTop: '1px solid #f0f0f0' }}>
                        <div style={{ fontSize: '13px', color: '#1a1a2e', padding: '6px' }} title={poste?.decretRef}>
                          {l.poste_code === 'autre'
                            ? <input aria-label="Nom du poste" placeholder="Nom du poste (ex. ramonage)" value={l.label} disabled={readOnly} onChange={(e) => updateLine(l.key, { label: e.target.value })} style={S.input} />
                            : name}
                          {poste?.hint && !readOnly && <div style={{ fontSize: '11px', color: '#999' }}>{poste.hint}</div>}
                        </div>
                        <div>
                          <input aria-label={`Montant annuel, ${name}`} inputMode="decimal" placeholder="0" value={l.amount} disabled={readOnly} onChange={(e) => updateLine(l.key, { amount: e.target.value })} style={{ ...S.input, textAlign: 'right' }} />
                          {before != null && !readOnly && <div style={{ fontSize: '11px', color: '#999', textAlign: 'right' }}>{previous?.fiscal_year} : {fEUR(before)}</div>}
                        </div>
                        <input aria-label={`Pourcentage récupérable, ${name}`} inputMode="decimal" value={l.pct} disabled={readOnly} onChange={(e) => updateLine(l.key, { pct: e.target.value })} style={{ ...S.input, textAlign: 'right' }} />
                        <div style={{ fontSize: '14px', textAlign: 'right', padding: '8px 6px', color: totals.perLine[i] ? '#1a1a2e' : '#bbb' }}>{fEUR(totals.perLine[i])}</div>
                        <input aria-label={`Justificatif, ${name}`} placeholder="ex. clôture cabinet" value={l.source} disabled={readOnly} onChange={(e) => updateLine(l.key, { source: e.target.value })} style={S.input} />
                        {!readOnly
                          ? <button aria-label={`Retirer la ligne ${name}`} title="Retirer la ligne" onClick={() => edit((d) => ({ ...d, lines: d.lines.filter((x) => x.key !== l.key) }))} style={{ ...S.btn, padding: '6px 8px', background: 'none', color: '#b91c1c' }}>✕</button>
                          : <span />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {!readOnly && (
                <select aria-label="Ajouter un poste" value="" onChange={(e) => { const code = e.target.value; if (code) edit((d) => ({ ...d, lines: [...d.lines, lineForPoste(code, d.fiscal_year, property.slug)] })); }} style={{ ...S.input, width: 'auto', maxWidth: '100%', marginTop: '8px' }}>
                  <option value="">+ Ajouter un poste…</option>
                  {addable.map((p) => <option key={p.code} value={p.code}>{p.label}{p.defaultPct === 0 ? ' (hors forfait, 0 %)' : ''}</option>)}
                </select>
              )}

              <div style={{ ...S.info, fontSize: '14px' }} data-testid="charges-totals">
                Total récupérable <strong>{fEUR(totals.total)}</strong> ÷ {mine.room_count} chambres ÷ 12 mois = {fEUR(totals.perRoomMonth)}
                {' → '}<strong style={{ color: GOLD }}>{fEUR(totals.printed)} par chambre et par mois dans les baux</strong>
                {current && current.id !== mine.id && <span style={{ color: '#777' }}> (en vigueur aujourd'hui : {fEUR(printedForfaitEur(current.per_room_month_eur))})</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '220px 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={S.label}>Date d'effet</label>
                  <input type="date" aria-label="Date d'effet" value={mine.effective_from} disabled={readOnly} onChange={(e) => edit((d) => ({ ...d, effective_from: e.target.value }))} style={S.input} />
                  <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>Les baux générés à partir de cette date utilisent ce forfait.</div>
                </div>
                <div>
                  <label style={S.label}>Notes internes (jamais imprimées)</label>
                  <textarea aria-label="Notes internes" rows={2} value={mine.notes} disabled={readOnly} onChange={(e) => edit((d) => ({ ...d, notes: e.target.value }))} style={{ ...S.input, resize: 'vertical' }} />
                </div>
              </div>

              {saveEffect?.changes && saveEffect.after && (
                <div style={S.warn} data-testid="charges-effect">
                  En enregistrant, le forfait des nouveaux baux passe {saveEffect.before ? <>de {fEUR(saveEffect.before.printed)} </> : null}à <strong>{fEUR(saveEffect.after.printed)}</strong> dès aujourd'hui. Les baux déjà signés ne bougent pas.
                </div>
              )}
              {!readOnly && issues.length > 0 && (dirty || !mine.id) && (
                <div style={S.error} data-testid="charges-issues">{issues.map((x) => <div key={x}>{x}</div>)}</div>
              )}

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                {!readOnly && <button onClick={save} disabled={!dirty || issues.length > 0 || !!busy} style={{ ...S.btn, background: GOLD, color: '#fff', fontWeight: 600, opacity: !dirty || issues.length > 0 || busy ? 0.5 : 1 }}>{busy === 'save' ? 'Enregistrement…' : 'Enregistrer'}</button>}
                {!readOnly && <button onClick={() => setConfirm('validate')} disabled={issues.length > 0 || vIssues.length > 0 || !!busy} style={{ ...S.btn, background: '#166534', color: '#fff', fontWeight: 600, opacity: issues.length > 0 || vIssues.length > 0 || busy ? 0.5 : 1 }}>Valider…</button>}
                <button onClick={exportPdf} disabled={!saved || dirty || !!busy} title={!saved || dirty ? 'Enregistre d\'abord' : undefined} style={{ ...S.ghost, opacity: !saved || dirty || busy ? 0.5 : 1 }}>{busy === 'pdf' ? 'Préparation…' : 'État récapitulatif (PDF)'}</button>
                {readOnly && <button onClick={() => setConfirm('reopen')} disabled={!!busy} style={S.ghost}>Corriger…</button>}
                {canDelete && <button onClick={() => setConfirm('delete')} disabled={!!busy} style={{ ...S.ghost, color: '#b91c1c' }}>Supprimer</button>}
                {!mine.id && <button onClick={() => { setDirty(false); reload(null); }} style={S.ghost}>Abandonner</button>}
              </div>
              {!readOnly && vIssues.length > 0 && <div style={{ fontSize: '12px', color: '#9a3412', marginTop: '8px' }}>{vIssues[0]}</div>}

              {confirm === 'validate' && change && (
                <div style={S.warn} data-testid="charges-confirm">
                  <strong>Valider les charges {mine.fiscal_year} de {property.name} ?</strong><br />
                  {change.changes && change.after
                    ? <>Dès la validation, les nouveaux baux utiliseront un forfait de <strong>{fEUR(change.after.printed)}</strong> (exercice {change.after.fiscal_year}){change.before ? <>, au lieu de {fEUR(change.before.printed)}</> : null}.</>
                    : mine.effective_from > today
                      ? <>Le forfait d'aujourd'hui ne change pas ; celui-ci ({fEUR(totals.printed)}) s'appliquera à partir du {fDate(mine.effective_from)}.</>
                      : <>Le forfait appliqué aux nouveaux baux ne change pas.</>}
                  {' '}Les baux déjà signés ne bougent pas. Un exercice validé ne se modifie plus, sauf correction motivée et journalisée.
                  <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                    <button onClick={validate} disabled={!!busy} style={{ ...S.btn, background: '#166534', color: '#fff', fontWeight: 600 }}>{busy === 'validate' ? 'Validation…' : 'Confirmer la validation'}</button>
                    <button onClick={() => setConfirm(null)} style={S.ghost}>Annuler</button>
                  </div>
                </div>
              )}
              {confirm === 'reopen' && saved && (
                <div style={S.warn} data-testid="charges-confirm">
                  <strong>Corriger l'exercice {saved.fiscal_year} ?</strong> Il redevient provisoire jusqu'à sa nouvelle validation ; s'il existe un autre exercice validé, c'est lui qui s'applique entre-temps. Le motif est journalisé.
                  <input aria-label="Motif de la correction" placeholder="Motif de la correction (10 caractères minimum)" value={reopenReason} onChange={(e) => setReopenReason(e.target.value)} style={{ ...S.input, marginTop: '8px' }} />
                  <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                    <button onClick={reopen} disabled={!!busy || reopenReason.trim().length < 10} style={{ ...S.btn, background: '#9a3412', color: '#fff', fontWeight: 600, opacity: reopenReason.trim().length < 10 ? 0.5 : 1 }}>{busy === 'reopen' ? 'Réouverture…' : 'Rouvrir pour correction'}</button>
                    <button onClick={() => setConfirm(null)} style={S.ghost}>Annuler</button>
                  </div>
                </div>
              )}
              {confirm === 'delete' && saved && (
                <div style={S.warn} data-testid="charges-confirm">
                  <strong>Supprimer l'exercice {saved.fiscal_year} et ses lignes ?</strong> Cette suppression est définitive.
                  <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                    <button onClick={remove} disabled={!!busy} style={{ ...S.btn, background: '#b91c1c', color: '#fff', fontWeight: 600 }}>{busy === 'delete' ? 'Suppression…' : 'Supprimer définitivement'}</button>
                    <button onClick={() => setConfirm(null)} style={S.ghost}>Annuler</button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
