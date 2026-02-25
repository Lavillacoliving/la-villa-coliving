import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';
import { logAudit } from '@/lib/auditLog';
import { PROPERTY_FILTER_OPTIONS } from '@/lib/entities';

// ─── Types ──────────────────────────────────────────────
interface Tenant {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  room_number: string | null;
  current_rent: number | null;
  deposit_amount: number | null;
  deposit_received_date: string | null;
  deposit_refunded_amount: number | null;
  deposit_refunded_date: string | null;
  is_active: boolean;
  move_in_date: string | null;
  move_out_date: string | null;
  property_id: string;
  entity_id: string | null;
  notes: string | null;
}

interface Property {
  id: string;
  name: string;
  slug: string;
  entity_id: string;
}

type DepositStatus = 'detenue' | 'a_restituer' | 'restituee' | 'partielle';

interface DepositRow extends Tenant {
  deposit_status: DepositStatus;
  property_name: string;
  property_slug: string;
}

// ─── Helpers ────────────────────────────────────────────
function fmt(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function fmtDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR');
}

function computeStatus(t: Tenant): DepositStatus {
  if (!t.deposit_amount || t.deposit_amount <= 0) return 'detenue'; // shouldn't happen
  if (t.deposit_refunded_date && t.deposit_refunded_amount && t.deposit_refunded_amount >= t.deposit_amount) return 'restituee';
  if (t.deposit_refunded_amount && t.deposit_refunded_amount > 0 && t.deposit_refunded_amount < t.deposit_amount) return 'partielle';
  if (!t.is_active && t.move_out_date && new Date(t.move_out_date) <= new Date()) return 'a_restituer';
  return 'detenue';
}

const STATUS_CONFIG: Record<DepositStatus, { label: string; color: string; bg: string; emoji: string }> = {
  detenue: { label: 'Détenue', color: '#16a34a', bg: '#f0fdf4', emoji: '🟢' },
  a_restituer: { label: 'À restituer', color: '#d97706', bg: '#fffbeb', emoji: '🟠' },
  restituee: { label: 'Restituée', color: '#3b82f6', bg: '#eff6ff', emoji: '🔵' },
  partielle: { label: 'Partielle', color: '#7c3aed', bg: '#f5f3ff', emoji: '🟣' },
};

// ─── Component ──────────────────────────────────────────
export default function DashboardCautionsPage() {
  const toast = useToast();
  const [rows, setRows] = useState<DepositRow[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Modal
  const [editRow, setEditRow] = useState<DepositRow | null>(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundDate, setRefundDate] = useState('');
  const [refundNotes, setRefundNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // ─── Load data ──────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);

    const { data: props } = await supabase.from('properties').select('id,name,slug,entity_id');
    setProperties(props || []);

    // All tenants with deposit > 0
    const { data: tenants } = await supabase.from('tenants').select('*')
      .gt('deposit_amount', 0)
      .order('move_in_date', { ascending: false });

    const depositRows: DepositRow[] = (tenants || []).map(t => {
      const prop = (props || []).find(p => p.id === t.property_id);
      return {
        ...t,
        deposit_status: computeStatus(t),
        property_name: prop?.name || '?',
        property_slug: prop?.slug || '',
      };
    });

    setRows(depositRows);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // ─── Filter ───────────────────────────────────────────
  let filtered = rows;
  if (propertyFilter !== 'all') filtered = filtered.filter(r => r.property_slug === propertyFilter);
  if (statusFilter !== 'all') filtered = filtered.filter(r => r.deposit_status === statusFilter);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(r =>
      `${r.first_name} ${r.last_name}`.toLowerCase().includes(q) ||
      (r.email || '').toLowerCase().includes(q) ||
      (r.room_number || '').toLowerCase().includes(q)
    );
  }

  // ─── KPIs ─────────────────────────────────────────────
  const detenues = filtered.filter(r => r.deposit_status === 'detenue');
  const aRestituer = filtered.filter(r => r.deposit_status === 'a_restituer');
  const restituees = filtered.filter(r => r.deposit_status === 'restituee' || r.deposit_status === 'partielle');
  const totalDetenu = detenues.reduce((s, r) => s + (r.deposit_amount || 0), 0);
  const totalARestituer = aRestituer.reduce((s, r) => s + (r.deposit_amount || 0), 0);

  // Alert: overdue returns
  const overdue = aRestituer.filter(r => {
    if (!r.move_out_date) return false;
    const daysSinceMoveOut = (Date.now() - new Date(r.move_out_date).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceMoveOut > 30; // More than 30 days since move-out
  });

  // ─── Open return modal ────────────────────────────────
  const openReturn = (row: DepositRow) => {
    setEditRow(row);
    setRefundAmount(String(row.deposit_amount || 0));
    setRefundDate(new Date().toISOString().slice(0, 10));
    setRefundNotes('');
  };

  // ─── Process return ───────────────────────────────────
  const processReturn = async () => {
    if (!editRow) return;
    const amount = parseFloat(refundAmount);
    if (isNaN(amount) || amount <= 0) { toast.error('Montant invalide'); return; }

    setSaving(true);
    const { error } = await supabase.from('tenants').update({
      deposit_refunded_amount: amount,
      deposit_refunded_date: refundDate,
      notes: editRow.notes ? `${editRow.notes}\n[Caution] ${refundNotes}` : `[Caution] ${refundNotes}`,
    }).eq('id', editRow.id);

    if (error) {
      toast.error('Erreur: ' + error.message);
      setSaving(false);
      return;
    }

    await logAudit('deposit_returned', 'tenant', editRow.id, {
      amount,
      date: refundDate,
      full_deposit: editRow.deposit_amount,
      is_partial: amount < (editRow.deposit_amount || 0),
      notes: refundNotes,
    });

    toast.success(`Caution ${amount < (editRow.deposit_amount || 0) ? 'partiellement ' : ''}restituée`);
    setEditRow(null);
    setSaving(false);
    load();
  };

  // ─── Export Excel ─────────────────────────────────────
  const exportExcel = () => {
    const XLSX = (window as any).XLSX;
    if (!XLSX) { toast.error('SheetJS non chargé'); return; }

    const exportRows = filtered.map(r => ({
      'Locataire': `${r.first_name} ${r.last_name}`,
      'Email': r.email || '',
      'Propriété': r.property_name,
      'Chambre': r.room_number || '',
      'Montant caution': r.deposit_amount || 0,
      'Date réception': r.deposit_received_date || '',
      'Statut': STATUS_CONFIG[r.deposit_status].label,
      'Montant restitué': r.deposit_refunded_amount || '',
      'Date restitution': r.deposit_refunded_date || '',
      'Locataire actif': r.is_active ? 'Oui' : 'Non',
      'Date sortie': r.move_out_date || '',
    }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(exportRows), 'Cautions');

    // Summary sheet
    const summaryRows = (properties || []).map(p => {
      const propRows = rows.filter(r => r.property_id === p.id);
      return {
        'Propriété': p.name,
        'Cautions détenues': propRows.filter(r => r.deposit_status === 'detenue').length,
        'Montant détenu': propRows.filter(r => r.deposit_status === 'detenue').reduce((s, r) => s + (r.deposit_amount || 0), 0),
        'À restituer': propRows.filter(r => r.deposit_status === 'a_restituer').length,
        'Restituées': propRows.filter(r => r.deposit_status === 'restituee' || r.deposit_status === 'partielle').length,
      };
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summaryRows), 'Résumé');
    XLSX.writeFile(wb, `cautions_${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast.success('Export téléchargé');
  };

  // ─── Styles ───────────────────────────────────────────
  const S = {
    card: { background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } as React.CSSProperties,
    label: { fontSize: '12px', color: '#888', marginBottom: '4px', textTransform: 'uppercase' as const },
    val: { fontSize: '28px', fontWeight: 800 as const, color: '#1a1a2e', margin: 0 },
    sub: { fontSize: '12px', color: '#999', marginTop: '4px' },
    btn: { padding: '6px 14px', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' } as React.CSSProperties,
    goldBtn: { padding: '6px 14px', background: '#b8860b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 } as React.CSSProperties,
    modal: { position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { background: '#fff', borderRadius: '16px', padding: '32px', width: '500px', maxWidth: '95vw', maxHeight: '85vh', overflow: 'auto' } as React.CSSProperties,
    input: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' as const, marginBottom: '12px' },
  };

  if (loading) return <p style={{ textAlign: 'center', padding: '40px', color: '#b8860b' }}>Chargement...</p>;

  return (
    <div>
      {/* ─── Header ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', color: '#1a1a2e' }}>Cautions</h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {PROPERTY_FILTER_OPTIONS.map(p => (
            <button key={p.value} onClick={() => setPropertyFilter(p.value)} style={{ ...S.btn, background: propertyFilter === p.value ? '#3D4A38' : '#e5e7eb', color: propertyFilter === p.value ? '#fff' : '#555', fontWeight: propertyFilter === p.value ? 600 : 400 }}>{p.label}</button>
          ))}
          <button onClick={exportExcel} style={S.goldBtn}>Export Excel</button>
        </div>
      </div>

      {/* ─── Overdue alert ─── */}
      {overdue.length > 0 && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '14px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <div>
            <strong style={{ color: '#dc2626' }}>{overdue.length} caution{overdue.length > 1 ? 's' : ''} en retard de restitution</strong>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#888' }}>
              {overdue.map(r => `${r.first_name} ${r.last_name} (sorti le ${fmtDate(r.move_out_date)})`).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* ─── KPI Cards ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={S.card}>
          <p style={S.label}>Cautions détenues</p>
          <p style={{ ...S.val, color: '#16a34a' }}>{detenues.length}</p>
          <p style={S.sub}>{fmt(totalDetenu)}</p>
        </div>
        <div style={S.card}>
          <p style={S.label}>À restituer</p>
          <p style={{ ...S.val, color: overdue.length > 0 ? '#dc2626' : '#d97706' }}>{aRestituer.length}</p>
          <p style={S.sub}>{fmt(totalARestituer)}</p>
        </div>
        <div style={S.card}>
          <p style={S.label}>Restituées</p>
          <p style={{ ...S.val, color: '#3b82f6' }}>{restituees.length}</p>
        </div>
        <div style={S.card}>
          <p style={S.label}>Total locataires</p>
          <p style={S.val}>{filtered.length}</p>
          <p style={S.sub}>avec caution</p>
        </div>
      </div>

      {/* ─── Status filter + Search ─── */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        {[
          { v: 'all', l: `Toutes (${rows.length})` },
          { v: 'detenue', l: `Détenues (${rows.filter(r => r.deposit_status === 'detenue').length})` },
          { v: 'a_restituer', l: `À restituer (${rows.filter(r => r.deposit_status === 'a_restituer').length})` },
          { v: 'restituee', l: `Restituées (${rows.filter(r => r.deposit_status === 'restituee').length})` },
          { v: 'partielle', l: `Partielles (${rows.filter(r => r.deposit_status === 'partielle').length})` },
        ].map(s => (
          <button key={s.v} onClick={() => setStatusFilter(s.v)} style={{
            ...S.btn,
            background: statusFilter === s.v ? '#1a1a2e' : '#f5f5f5',
            color: statusFilter === s.v ? '#fff' : '#555',
            fontWeight: statusFilter === s.v ? 600 : 400,
          }}>{s.l}</button>
        ))}
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." style={{ padding: '6px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '13px', width: '200px' }} />
      </div>

      {/* ─── Data table ─── */}
      <div style={{ ...S.card, padding: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f8f8f8', borderBottom: '2px solid #e5e7eb' }}>
              {['Locataire', 'Propriété', 'Chambre', 'Montant', 'Reçue le', 'Statut', 'Restitution', ''].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: h === 'Montant' ? 'right' : 'left', fontWeight: 600, color: '#555', fontSize: '11px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => {
              const cfg = STATUS_CONFIG[row.deposit_status];
              const isOverdue = row.deposit_status === 'a_restituer' && row.move_out_date && (Date.now() - new Date(row.move_out_date).getTime()) / (1000 * 60 * 60 * 24) > 30;
              return (
                <tr key={row.id} style={{ borderBottom: '1px solid #f0f0f0', background: isOverdue ? '#fef2f2' : undefined }}>
                  <td style={{ padding: '8px 12px', fontWeight: 500 }}>
                    {row.first_name} {row.last_name}
                    {!row.is_active && <span style={{ fontSize: '10px', color: '#dc2626', marginLeft: '6px' }}>parti</span>}
                  </td>
                  <td style={{ padding: '8px 12px', fontSize: '13px' }}>{row.property_name}</td>
                  <td style={{ padding: '8px 12px', fontSize: '13px', color: '#888' }}>{row.room_number || '—'}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600 }}>{fmt(row.deposit_amount || 0)}</td>
                  <td style={{ padding: '8px 12px', fontSize: '13px', color: '#888' }}>{fmtDate(row.deposit_received_date)}</td>
                  <td style={{ padding: '8px 12px' }}>
                    <span style={{ background: cfg.bg, color: cfg.color, padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                      {cfg.emoji} {cfg.label}
                    </span>
                    {isOverdue && <span style={{ fontSize: '10px', color: '#dc2626', display: 'block', marginTop: '2px' }}>⚠️ En retard (&gt;30j)</span>}
                  </td>
                  <td style={{ padding: '8px 12px', fontSize: '13px' }}>
                    {row.deposit_refunded_date ? (
                      <span>{fmt(row.deposit_refunded_amount || 0)} le {fmtDate(row.deposit_refunded_date)}</span>
                    ) : '—'}
                  </td>
                  <td style={{ padding: '8px 12px' }}>
                    {(row.deposit_status === 'detenue' || row.deposit_status === 'a_restituer') && (
                      <button onClick={() => openReturn(row)} style={{ background: '#f5f5f5', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }}>
                        Restituer
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Aucune caution trouvée</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ─── Return Modal ─── */}
      {editRow && (
        <div style={S.modal} onClick={() => setEditRow(null)}>
          <div style={S.modalContent} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#1a1a2e' }}>Restitution de caution</h3>
              <button onClick={() => setEditRow(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#888' }}>×</button>
            </div>

            <div style={{ background: '#f8f8f8', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px' }}>
              <div><strong>{editRow.first_name} {editRow.last_name}</strong> — {editRow.property_name} (CH{editRow.room_number})</div>
              <div style={{ color: '#888', fontSize: '13px' }}>Caution : {fmt(editRow.deposit_amount || 0)} — Reçue le {fmtDate(editRow.deposit_received_date)}</div>
            </div>

            <label style={{ fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '4px', display: 'block' }}>Montant restitué (€)</label>
            <input type="number" step="0.01" value={refundAmount} onChange={e => setRefundAmount(e.target.value)} style={S.input} />

            {parseFloat(refundAmount) < (editRow.deposit_amount || 0) && parseFloat(refundAmount) > 0 && (
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 14px', marginBottom: '12px', fontSize: '13px', color: '#d97706' }}>
                Restitution partielle : {fmt((editRow.deposit_amount || 0) - parseFloat(refundAmount))} retenus
              </div>
            )}

            <label style={{ fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '4px', display: 'block' }}>Date de restitution</label>
            <input type="date" value={refundDate} onChange={e => setRefundDate(e.target.value)} style={S.input} />

            <label style={{ fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '4px', display: 'block' }}>Notes (retenues, motif, etc.)</label>
            <textarea value={refundNotes} onChange={e => setRefundNotes(e.target.value)} rows={3} placeholder="Ex: Retenue 150€ pour dégradation porte CH3..." style={{ ...S.input, resize: 'vertical' as const }} />

            <button onClick={processReturn} disabled={saving} style={{ ...S.goldBtn, width: '100%', padding: '12px', opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Enregistrement...' : 'Confirmer la restitution'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
