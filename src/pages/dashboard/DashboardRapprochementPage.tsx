import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';
import { logAudit } from '@/lib/auditLog';
import {
  TRANSACTION_TYPES,
  getTransactionTypeLabel, getTransactionTypeColor, getRapprochementBadge,
  ENTITY_IDS,
} from '@/lib/entities';
import RapprochementEditModal from '@/components/dashboard/RapprochementEditModal';

// ─── Types ──────────────────────────────────────────────
interface BankTransaction {
  id: string;
  entity_id: string;
  accounting_date: string;
  operation_date: string | null;
  label_simple: string;
  label_operation: string;
  reference: string | null;
  details: string | null;
  debit: number;
  credit: number;
  category: string | null;
  subcategory: string | null;
  transaction_type: string;
  rapprochement_status: string;
  rapprochement_notes: string | null;
  manual_category: string | null;
  manual_comment: string | null;
  matched_invoice_id: string | null;
  matched_tenant_id: string | null;
  match_confidence: number | null;
  split_group_id: string | null;
  flagged_reason: string | null;
}

interface Invoice {
  id: string;
  entity_id: string;
  supplier: string;
  amount_ttc: number;
  invoice_date: string;
  file_name: string | null;
  file_path: string | null;
  type_service: string | null;
  product: string | null;
  confidence_score: number | null;
  rapprochement_status: string;
  bank_transaction_id: string | null;
}

interface Entity {
  id: string;
  name: string;
  code: string;
}

interface KPI {
  entity_id: string;
  entity_name: string;
  total: number;
  rapprochees: number;
  non_rapprochees: number;
  flaggees: number;
  total_debits: number;
  total_credits: number;
}

// ─── Helpers ────────────────────────────────────────────
function fmt(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function fmtDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR');
}

// ─── Component ──────────────────────────────────────────
export default function DashboardRapprochementPage() {
  const toast = useToast();

  // State
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [entityFilter, setEntityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Modal
  const [editTx, setEditTx] = useState<BankTransaction | null>(null);

  // Batch mode
  const [batchMode, setBatchMode] = useState<'none' | 'auto' | 'non_rapproche'>('none');
  const [batchIndex, setBatchIndex] = useState(0);

  // YTD mode
  const [ytdMode, setYtdMode] = useState(false);

  // ─── Load data ──────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);

    // Entities
    const { data: ents } = await supabase.from('entities').select('id,name,code');
    setEntities(ents || []);

    // Transactions
    let txQuery = supabase.from('bank_transactions').select('*').order('accounting_date', { ascending: false });

    if (ytdMode) {
      const year = month.slice(0, 4);
      // Compute actual last day of the selected month
      const [y, m] = month.split('-').map(Number);
      const lastDay = new Date(y, m, 0).getDate(); // day 0 of next month = last day of current month
      txQuery = txQuery.gte('accounting_date', `${year}-01-01`).lte('accounting_date', `${month}-${String(lastDay).padStart(2, '0')}`);
    } else {
      const nextMonth = new Date(month + '-01');
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      txQuery = txQuery.gte('accounting_date', `${month}-01`).lt('accounting_date', nextMonth.toISOString().slice(0, 10));
    }

    if (entityFilter !== 'all') {
      const entityId = ENTITY_IDS[entityFilter];
      if (entityId) txQuery = txQuery.eq('entity_id', entityId);
    }

    const { data: txData } = await txQuery;
    setTransactions(txData || []);

    // Orphan invoices (unmatched)
    const { data: invData } = await supabase.from('invoices').select('*').eq('rapprochement_status', 'non_rapproche').order('invoice_date', { ascending: false }).limit(100);
    setInvoices(invData || []);

    setLoading(false);
  }, [month, entityFilter, ytdMode]);

  useEffect(() => { load(); }, [load]);

  // ─── KPI computation ──────────────────────────────────
  const computeKPI = (): { global: KPI; byEntity: KPI[] } => {
    const byEntity: Record<string, KPI> = {};
    transactions.forEach(tx => {
      const ent = entities.find(e => e.id === tx.entity_id);
      const key = tx.entity_id;
      if (!byEntity[key]) {
        byEntity[key] = { entity_id: key, entity_name: ent?.name || '?', total: 0, rapprochees: 0, non_rapprochees: 0, flaggees: 0, total_debits: 0, total_credits: 0 };
      }
      byEntity[key].total++;
      if (['auto', 'manuel'].includes(tx.rapprochement_status)) byEntity[key].rapprochees++;
      if (tx.rapprochement_status === 'non_rapproche') byEntity[key].non_rapprochees++;
      if (tx.rapprochement_status === 'flag') byEntity[key].flaggees++;
      byEntity[key].total_debits += tx.debit || 0;
      byEntity[key].total_credits += tx.credit || 0;
    });

    const arr = Object.values(byEntity);
    const global: KPI = {
      entity_id: 'all', entity_name: 'Toutes entités',
      total: arr.reduce((s, k) => s + k.total, 0),
      rapprochees: arr.reduce((s, k) => s + k.rapprochees, 0),
      non_rapprochees: arr.reduce((s, k) => s + k.non_rapprochees, 0),
      flaggees: arr.reduce((s, k) => s + k.flaggees, 0),
      total_debits: arr.reduce((s, k) => s + k.total_debits, 0),
      total_credits: arr.reduce((s, k) => s + k.total_credits, 0),
    };
    return { global, byEntity: arr };
  };

  const { global: kpi, byEntity: kpiByEntity } = computeKPI();
  const pct = kpi.total > 0 ? Math.round((kpi.rapprochees / kpi.total) * 100) : 0;
  const pctColor = pct >= 90 ? '#16a34a' : pct >= 70 ? '#d97706' : '#dc2626';

  // ─── Filtered transactions ────────────────────────────
  let filtered = transactions;
  if (statusFilter !== 'all') filtered = filtered.filter(tx => tx.rapprochement_status === statusFilter);
  if (typeFilter !== 'all') filtered = filtered.filter(tx => tx.transaction_type === typeFilter);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(tx =>
      (tx.label_simple || '').toLowerCase().includes(q) ||
      (tx.label_operation || '').toLowerCase().includes(q) ||
      (tx.details || '').toLowerCase().includes(q) ||
      (tx.manual_comment || '').toLowerCase().includes(q)
    );
  }

  // Status counts
  const countByStatus = (s: string) => transactions.filter(tx => tx.rapprochement_status === s).length;

  // ─── Open edit modal ──────────────────────────────────
  const openEdit = (tx: BankTransaction) => {
    setEditTx(tx);
    setBatchMode('none');
  };

  // ─── Batch mode helpers ───────────────────────────────
  const batchList = batchMode === 'auto'
    ? transactions.filter(tx => tx.rapprochement_status === 'auto')
    : batchMode === 'non_rapproche'
    ? transactions.filter(tx => tx.rapprochement_status === 'non_rapproche')
    : [];

  const startBatch = (mode: 'auto' | 'non_rapproche') => {
    const list = mode === 'auto'
      ? transactions.filter(tx => tx.rapprochement_status === 'auto')
      : transactions.filter(tx => tx.rapprochement_status === 'non_rapproche');
    if (list.length === 0) { toast.error('Aucune transaction à traiter'); return; }
    setBatchMode(mode);
    setBatchIndex(0);
    setEditTx(list[0]);
  };

  const handleBatchNavigate = (index: number) => {
    const list = batchMode === 'auto'
      ? transactions.filter(tx => tx.rapprochement_status === 'auto')
      : transactions.filter(tx => tx.rapprochement_status === 'non_rapproche');
    if (index >= 0 && index < list.length) {
      setBatchIndex(index);
      setEditTx(list[index]);
    }
  };

  const handleModalSave = () => {
    setEditTx(null);
    setBatchMode('none');
    load();
  };

  // ─── Unlink invoice (from table) ──────────────────────
  const unlinkInvoice = async (tx: BankTransaction) => {
    if (!tx.matched_invoice_id) return;
    await supabase.from('invoices').update({ bank_transaction_id: null, rapprochement_status: 'non_rapproche' }).eq('id', tx.matched_invoice_id);
    await supabase.from('bank_transactions').update({ matched_invoice_id: null, rapprochement_status: 'non_rapproche', updated_by: 'dashboard', updated_at: new Date().toISOString() }).eq('id', tx.id);
    await logAudit('invoice_unlinked', 'bank_transaction', tx.id, { invoice_id: tx.matched_invoice_id });
    toast.success('Lien facture supprimé');
    load();
  };

  // ─── Export Excel YTD ─────────────────────────────────
  const exportExcel = () => {
    const XLSX = (window as any).XLSX;
    if (!XLSX) { toast.error('SheetJS non chargé'); return; }

    const year = month.slice(0, 4);
    const label = ytdMode ? `YTD_${year}_au_${month}` : month;

    // Sheet 1: Résumé par entité
    const summaryRows = kpiByEntity.map(k => ({
      'Entité': k.entity_name,
      'Total transactions': k.total,
      'Rapprochées': k.rapprochees,
      'Non rapprochées': k.non_rapprochees,
      'Flaggées': k.flaggees,
      '% Couverture': k.total > 0 ? Math.round((k.rapprochees / k.total) * 100) + '%' : '0%',
      'Total débits': k.total_debits,
      'Total crédits': k.total_credits,
    }));

    // Sheet 2: Détail chronologique
    const detailRows = filtered.map(tx => {
      const ent = entities.find(e => e.id === tx.entity_id);
      return {
        'Date': tx.accounting_date,
        'Libellé': tx.label_simple,
        'Opération': tx.label_operation,
        'Débit': tx.debit || '',
        'Crédit': tx.credit || '',
        'Type': getTransactionTypeLabel(tx.transaction_type),
        'Catégorie': tx.manual_category || tx.category || '',
        'Statut': getRapprochementBadge(tx.rapprochement_status).label,
        'Entité': ent?.name || '',
        'Commentaire': tx.manual_comment || '',
        'Référence': tx.reference || '',
      };
    });

    // Sheet 3: Non rapprochées
    const unreconciledRows = transactions
      .filter(tx => tx.rapprochement_status === 'non_rapproche' || tx.rapprochement_status === 'flag')
      .map(tx => {
        const ent = entities.find(e => e.id === tx.entity_id);
        return {
          'Date': tx.accounting_date,
          'Libellé': tx.label_simple,
          'Montant': tx.debit > 0 ? -tx.debit : tx.credit,
          'Type': getTransactionTypeLabel(tx.transaction_type),
          'Entité': ent?.name || '',
          'Raison flag': tx.flagged_reason || '',
          'Notes': tx.rapprochement_notes || '',
        };
      });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summaryRows), 'Résumé');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(detailRows), 'Détail');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(unreconciledRows), 'À revoir');
    XLSX.writeFile(wb, `rapprochement_${label}.xlsx`);
    toast.success('Export téléchargé');
  };

  // ─── Navigation mois ──────────────────────────────────
  const prevMonth = () => { const d = new Date(month + '-01'); d.setMonth(d.getMonth() - 1); setMonth(d.toISOString().slice(0, 7)); };
  const nextMonth = () => { const d = new Date(month + '-01'); d.setMonth(d.getMonth() + 1); setMonth(d.toISOString().slice(0, 7)); };

  // ─── Styles ───────────────────────────────────────────
  const S = {
    card: { background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } as React.CSSProperties,
    label: { fontSize: '12px', color: '#888', marginBottom: '4px', textTransform: 'uppercase' as const },
    val: { fontSize: '28px', fontWeight: 800 as const, color: '#1a1a2e', margin: 0 },
    sub: { fontSize: '12px', color: '#999', marginTop: '4px' },
    btn: { padding: '6px 14px', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' } as React.CSSProperties,
    goldBtn: { padding: '6px 14px', background: '#b8860b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 } as React.CSSProperties,
  };

  if (loading) return <p style={{ textAlign: 'center', padding: '40px', color: '#b8860b' }}>Chargement...</p>;

  return (
    <div>
      {/* ─── Header ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={prevMonth} style={{ border: '1px solid #ddd', background: '#fff', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '16px' }}>←</button>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#1a1a2e' }}>
            {ytdMode ? `YTD ${month.slice(0, 4)} → ${new Date(month + '-01').toLocaleDateString('fr-FR', { month: 'long' })}` :
              new Date(month + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase())}
          </h2>
          <button onClick={nextMonth} style={{ border: '1px solid #ddd', background: '#fff', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '16px' }}>→</button>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button onClick={() => setYtdMode(!ytdMode)} style={{ ...S.btn, background: ytdMode ? '#1a1a2e' : '#e5e7eb', color: ytdMode ? '#fff' : '#555', fontWeight: ytdMode ? 600 : 400 }}>
            {ytdMode ? 'YTD ✓' : 'YTD'}
          </button>
          {[{ v: 'all', l: 'Toutes' }, { v: 'LMP', l: 'LMP' }, { v: 'SCI', l: 'SCI' }, { v: 'MB', l: 'MB' }].map(e => (
            <button key={e.v} onClick={() => setEntityFilter(e.v)} style={{ ...S.btn, background: entityFilter === e.v ? '#3D4A38' : '#e5e7eb', color: entityFilter === e.v ? '#fff' : '#555', fontWeight: entityFilter === e.v ? 600 : 400 }}>{e.l}</button>
          ))}
          <button onClick={exportExcel} style={S.goldBtn}>Export Excel COGESTRA</button>
          {countByStatus('auto') > 0 && (
            <button onClick={() => startBatch('auto')} style={{ ...S.goldBtn, background: '#16a34a' }}>
              Vérifier les auto ({countByStatus('auto')})
            </button>
          )}
          {countByStatus('non_rapproche') > 0 && (
            <button onClick={() => startBatch('non_rapproche')} style={{ ...S.goldBtn, background: '#dc2626' }}>
              Traiter non-rappr. ({countByStatus('non_rapproche')})
            </button>
          )}
        </div>
      </div>

      {/* ─── KPI Cards ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={S.card}>
          <p style={S.label}>Rapprochées</p>
          <p style={{ ...S.val, color: pctColor }}>{kpi.rapprochees}/{kpi.total}</p>
          <div style={{ height: '6px', background: '#f0f0f0', borderRadius: '3px', marginTop: '8px' }}>
            <div style={{ height: '100%', background: pctColor, borderRadius: '3px', width: pct + '%', transition: 'width 0.3s' }} />
          </div>
          <p style={S.sub}>{pct}% de couverture</p>
        </div>
        <div style={S.card}>
          <p style={S.label}>Non rapprochées</p>
          <p style={{ ...S.val, color: '#dc2626' }}>{kpi.non_rapprochees}</p>
          <p style={S.sub}>à traiter</p>
        </div>
        <div style={S.card}>
          <p style={S.label}>Flaggées</p>
          <p style={{ ...S.val, color: '#d97706' }}>{kpi.flaggees}</p>
          <p style={S.sub}>à revoir</p>
        </div>
        <div style={S.card}>
          <p style={S.label}>Factures orphelines</p>
          <p style={{ ...S.val, color: '#7c3aed' }}>{invoices.length}</p>
          <p style={S.sub}>non liées</p>
        </div>
        <div style={S.card}>
          <p style={S.label}>Total débits</p>
          <p style={{ ...S.val, fontSize: '22px', color: '#ef4444' }}>{fmt(kpi.total_debits)}</p>
        </div>
        <div style={S.card}>
          <p style={S.label}>Total crédits</p>
          <p style={{ ...S.val, fontSize: '22px', color: '#22c55e' }}>{fmt(kpi.total_credits)}</p>
        </div>
      </div>

      {/* ─── Per-entity mini bars ─── */}
      {kpiByEntity.length > 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: '12px', marginBottom: '24px' }}>
          {kpiByEntity.map(k => {
            const p = k.total > 0 ? Math.round((k.rapprochees / k.total) * 100) : 0;
            const c = p >= 90 ? '#16a34a' : p >= 70 ? '#d97706' : '#dc2626';
            return (
              <div key={k.entity_id} style={{ ...S.card, padding: '14px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>{k.entity_name}</span>
                  <span style={{ color: c, fontWeight: 700, fontSize: '14px' }}>{p}%</span>
                </div>
                <div style={{ height: '4px', background: '#f0f0f0', borderRadius: '2px' }}>
                  <div style={{ height: '100%', background: c, borderRadius: '2px', width: p + '%' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '11px', color: '#999' }}>
                  <span>{k.rapprochees}/{k.total} rappr.</span>
                  <span>{k.non_rapprochees} restantes</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Sub-tabs + Type filter ─── */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        {[
          { v: 'all', l: `Toutes (${transactions.length})` },
          { v: 'non_rapproche', l: `Non rapprochées (${countByStatus('non_rapproche')})` },
          { v: 'auto', l: `Auto (${countByStatus('auto')})` },
          { v: 'manuel', l: `Manuel (${countByStatus('manuel')})` },
          { v: 'flag', l: `Flaggées (${countByStatus('flag')})` },
        ].map(s => (
          <button key={s.v} onClick={() => setStatusFilter(s.v)} style={{
            ...S.btn,
            background: statusFilter === s.v ? '#1a1a2e' : '#f5f5f5',
            color: statusFilter === s.v ? '#fff' : '#555',
            fontWeight: statusFilter === s.v ? 600 : 400,
          }}>{s.l}</button>
        ))}
        <span style={{ color: '#ccc', margin: '0 4px' }}>|</span>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ padding: '6px 10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '13px', background: '#fff' }}>
          <option value="all">Tous types</option>
          {TRANSACTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." style={{ padding: '6px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '13px', width: '200px' }} />
      </div>

      {/* ─── Data table ─── */}
      <div style={{ ...S.card, padding: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f8f8f8', borderBottom: '2px solid #e5e7eb' }}>
              {['Date', 'Libellé', 'Débit', 'Crédit', 'Type', 'Catégorie', 'Statut', 'Facture', ''].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: ['Débit', 'Crédit'].includes(h) ? 'right' : 'left', fontWeight: 600, color: '#555', fontSize: '11px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(tx => {
              const badge = getRapprochementBadge(tx.rapprochement_status);
              const typeColor = getTransactionTypeColor(tx.transaction_type);
              const ent = entities.find(e => e.id === tx.entity_id);
              return (
                <tr key={tx.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '8px 12px', color: '#888', whiteSpace: 'nowrap', fontSize: '13px' }}>{fmtDate(tx.accounting_date)}</td>
                  <td style={{ padding: '8px 12px', fontWeight: 500, maxWidth: '300px' }} title={tx.details || tx.label_operation}>
                    <div>{tx.label_simple}</div>
                    {tx.manual_comment && <div style={{ fontSize: '11px', color: '#888', fontStyle: 'italic' }}>💬 {tx.manual_comment}</div>}
                    {ent && <span style={{ fontSize: '10px', color: '#aaa' }}>{ent.code}</span>}
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: '#ef4444' }}>{tx.debit > 0 ? fmt(tx.debit) : ''}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: '#22c55e' }}>{tx.credit > 0 ? fmt(tx.credit) : ''}</td>
                  <td style={{ padding: '8px 12px' }}>
                    <span style={{ color: typeColor, fontSize: '12px', fontWeight: 500 }}>{getTransactionTypeLabel(tx.transaction_type)}</span>
                  </td>
                  <td style={{ padding: '8px 12px', fontSize: '13px' }}>{tx.manual_category || tx.category || '—'}</td>
                  <td style={{ padding: '8px 12px' }}>
                    <span style={{ background: badge.bg, color: badge.color, padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {badge.label}
                    </span>
                    {tx.flagged_reason && <div style={{ fontSize: '10px', color: '#d97706', marginTop: '2px' }}>{tx.flagged_reason}</div>}
                  </td>
                  <td style={{ padding: '8px 12px', fontSize: '12px' }}>
                    {tx.matched_invoice_id ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ color: '#16a34a' }}>📎</span>
                        <button onClick={() => unlinkInvoice(tx)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '11px', textDecoration: 'underline' }}>délier</button>
                      </span>
                    ) : <span style={{ color: '#ccc' }}>—</span>}
                  </td>
                  <td style={{ padding: '8px 12px' }}>
                    <button onClick={() => openEdit(tx)} style={{ background: '#f5f5f5', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }}>✏️</button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Aucune transaction{ytdMode ? ' YTD' : ' ce mois'}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <p style={{ textAlign: 'right', fontSize: '12px', color: '#aaa', marginTop: '8px' }}>{filtered.length} transaction{filtered.length > 1 ? 's' : ''} affichée{filtered.length > 1 ? 's' : ''}</p>

      {/* ─── Edit Modal (extracted component) ─── */}
      {editTx && (
        <RapprochementEditModal
          transaction={editTx}
          entities={entities}
          orphanInvoices={invoices}
          onClose={() => { setEditTx(null); setBatchMode('none'); }}
          onSave={handleModalSave}
          batchTransactions={batchMode !== 'none' ? batchList : undefined}
          currentIndex={batchMode !== 'none' ? batchIndex : undefined}
          onNavigate={batchMode !== 'none' ? handleBatchNavigate : undefined}
        />
      )}
    </div>
  );
}
