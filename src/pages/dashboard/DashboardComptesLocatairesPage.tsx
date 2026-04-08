import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { ENTITY_FILTER_OPTIONS, ENTITY_SLUGS } from '@/lib/entities';

interface Tenant {
  id: string;
  first_name: string;
  last_name: string;
  room_number: number | null;
  current_rent: number | null;
  property_id: string;
  move_in_date: string | null;
  is_active: boolean;
  properties?: { name: string; slug: string } | null;
}

interface LedgerEntry {
  id: string;
  tenant_id: string;
  entry_date: string;
  type: 'loyer' | 'paiement' | 'caution' | 'regularisation';
  amount: number;
  month: string | null;
  label: string | null;
  bank_transaction_id: string | null;
  created_by: string | null;
  notes: string | null;
}

interface TenantBalance {
  tenant: Tenant;
  loyer: number;       // loyers dus + régularisations
  paiement: number;    // paiements (négatif)
  caution: number;     // cautions détenues (négatif)
  solde: number;       // loyer + paiement
  statut: 'OK' | 'IMPAYE' | 'CREDITEUR';
  entries: LedgerEntry[];
}

const STATUT_COLORS: Record<string, string> = {
  OK: '#22c55e',
  IMPAYE: '#ef4444',
  CREDITEUR: '#3b82f6',
};

const STATUT_LABELS: Record<string, string> = {
  OK: 'OK',
  IMPAYE: 'Impayé',
  CREDITEUR: 'Créditeur',
};

const TYPE_LABELS: Record<string, string> = {
  loyer: 'Loyer dû',
  paiement: 'Paiement',
  caution: 'Caution',
  regularisation: 'Régularisation',
};

const TYPE_COLORS: Record<string, string> = {
  loyer: '#64748b',
  paiement: '#22c55e',
  caution: '#8b5cf6',
  regularisation: '#f59e0b',
};

function fmt(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function fmtDate(s: string | null) {
  if (!s) return '—';
  const d = new Date(s);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function DashboardComptesLocatairesPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterEntity, setFilterEntity] = useState<string>('all');
  const [filterStatut, setFilterStatut] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);

  const reload = async () => {
    const [tRes, lRes] = await Promise.all([
      supabase
        .from('tenants')
        .select('id,first_name,last_name,room_number,current_rent,property_id,move_in_date,is_active,properties(name,slug)')
        .eq('is_active', true)
        .order('last_name'),
      supabase
        .from('tenant_ledger')
        .select('*')
        .order('entry_date', { ascending: true }),
    ]);
    if (tRes.data) setTenants(tRes.data as any);
    if (lRes.data) setLedger(lRes.data as any);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await reload();
      setLoading(false);
    })();
  }, []);

  const balances: TenantBalance[] = useMemo(() => {
    const byTenant: Record<string, LedgerEntry[]> = {};
    for (const e of ledger) {
      if (!byTenant[e.tenant_id]) byTenant[e.tenant_id] = [];
      byTenant[e.tenant_id].push(e);
    }
    return tenants.map(t => {
      const entries = byTenant[t.id] || [];
      let loyer = 0, paiement = 0, caution = 0;
      for (const e of entries) {
        const a = Number(e.amount);
        if (e.type === 'loyer' || e.type === 'regularisation') loyer += a;
        else if (e.type === 'paiement') paiement += a;
        else if (e.type === 'caution') caution += a;
      }
      const solde = Math.round((loyer + paiement) * 100) / 100;
      let statut: 'OK' | 'IMPAYE' | 'CREDITEUR' = 'OK';
      if (solde >= 1) statut = 'IMPAYE';
      else if (solde <= -1) statut = 'CREDITEUR';
      return { tenant: t, loyer, paiement, caution, solde, statut, entries };
    });
  }, [tenants, ledger]);

  const filtered = useMemo(() => {
    return balances.filter(b => {
      if (filterStatut !== 'all' && b.statut !== filterStatut) return false;
      if (filterEntity !== 'all') {
        const slug = b.tenant.properties?.slug || '';
        const allowed = ENTITY_SLUGS[filterEntity] || [];
        if (!allowed.includes(slug)) return false;
      }
      if (search) {
        const s = search.toLowerCase();
        const full = `${b.tenant.first_name} ${b.tenant.last_name}`.toLowerCase();
        if (!full.includes(s)) return false;
      }
      return true;
    });
  }, [balances, filterEntity, filterStatut, search]);

  // KPIs
  const kpis = useMemo(() => {
    const total = filtered.length;
    const ok = filtered.filter(b => b.statut === 'OK').length;
    const impayes = filtered.filter(b => b.statut === 'IMPAYE');
    const crediteurs = filtered.filter(b => b.statut === 'CREDITEUR');
    const montantImpayes = impayes.reduce((s, b) => s + b.solde, 0);
    const montantCrediteurs = crediteurs.reduce((s, b) => s + b.solde, 0);
    return {
      total,
      ok,
      nbImpayes: impayes.length,
      nbCrediteurs: crediteurs.length,
      montantImpayes,
      montantCrediteurs,
    };
  }, [filtered]);

  // Group by property for display
  const grouped = useMemo(() => {
    const g: Record<string, TenantBalance[]> = {};
    for (const b of filtered) {
      const key = b.tenant.properties?.name || '—';
      if (!g[key]) g[key] = [];
      g[key].push(b);
    }
    // sort each group by last_name
    for (const k in g) g[k].sort((a, b) => a.tenant.last_name.localeCompare(b.tenant.last_name));
    return g;
  }, [filtered]);

  if (loading) return <div style={{ padding: 24 }}>Chargement…</div>;

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Comptes Locataires</h1>
      <p style={{ color: '#64748b', marginBottom: 24 }}>
        Solde de chaque locataire actif — loyers dus vs paiements reçus. Clique sur un locataire pour voir le détail du ledger.
      </p>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <KpiCard label="Total actifs" value={String(kpis.total)} color="#64748b" />
        <KpiCard label="Soldes OK" value={String(kpis.ok)} color="#22c55e" />
        <KpiCard
          label={`Impayés (${kpis.nbImpayes})`}
          value={fmt(kpis.montantImpayes)}
          color="#ef4444"
        />
        <KpiCard
          label={`Créditeurs (${kpis.nbCrediteurs})`}
          value={fmt(Math.abs(kpis.montantCrediteurs))}
          color="#3b82f6"
        />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <select
          value={filterEntity}
          onChange={e => setFilterEntity(e.target.value)}
          style={selectStyle}
        >
          {ENTITY_FILTER_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          value={filterStatut}
          onChange={e => setFilterStatut(e.target.value)}
          style={selectStyle}
        >
          <option value="all">Tous statuts</option>
          <option value="OK">OK</option>
          <option value="IMPAYE">Impayé</option>
          <option value="CREDITEUR">Créditeur</option>
        </select>
        <input
          type="text"
          placeholder="Rechercher un locataire…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...selectStyle, minWidth: 240 }}
        />
      </div>

      {/* Grouped tables */}
      {Object.keys(grouped).sort().map(propName => (
        <div key={propName} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: '#0f172a' }}>
            {propName} <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: 14 }}>— {grouped[propName].length} locataires</span>
          </h2>
          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 12, background: '#fff' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={thStyle}>Locataire</th>
                  <th style={thStyle}>Chambre</th>
                  <th style={thStyle}>Entrée</th>
                  <th style={thStyle}>Loyer</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Dus</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Paiements</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Caution</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Solde</th>
                  <th style={thStyle}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {grouped[propName].map(b => (
                  <tr
                    key={b.tenant.id}
                    onClick={() => setSelectedTenantId(b.tenant.id)}
                    style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                  >
                    <td style={tdStyle}>
                      <strong>{b.tenant.first_name} {b.tenant.last_name}</strong>
                    </td>
                    <td style={tdStyle}>{b.tenant.room_number || '—'}</td>
                    <td style={tdStyle}>{fmtDate(b.tenant.move_in_date)}</td>
                    <td style={tdStyle}>{b.tenant.current_rent ? fmt(b.tenant.current_rent) : '—'}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{fmt(b.loyer)}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', color: '#22c55e' }}>{fmt(b.paiement)}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', color: '#8b5cf6' }}>{fmt(b.caution)}</td>
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: 'right',
                        fontWeight: 700,
                        color: b.statut === 'IMPAYE' ? '#ef4444' : b.statut === 'CREDITEUR' ? '#3b82f6' : '#0f172a',
                      }}
                    >
                      {fmt(b.solde)}
                    </td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 10px',
                          borderRadius: 12,
                          background: STATUT_COLORS[b.statut] + '22',
                          color: STATUT_COLORS[b.statut],
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {STATUT_LABELS[b.statut]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>
          Aucun locataire ne correspond aux filtres.
        </div>
      )}

      {/* Detail modal */}
      {selectedTenantId && (() => {
        const current = balances.find(b => b.tenant.id === selectedTenantId);
        if (!current) return null;
        return (
          <LedgerDetailModal
            balance={current}
            onClose={() => setSelectedTenantId(null)}
            onRefresh={reload}
          />
        );
      })()}
    </div>
  );
}

function KpiCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderLeft: `4px solid ${color}`,
        borderRadius: 12,
        padding: '16px 20px',
      }}
    >
      <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginTop: 4 }}>{value}</div>
    </div>
  );
}

function LedgerDetailModal({
  balance,
  onClose,
  onRefresh,
}: {
  balance: TenantBalance;
  onClose: () => void;
  onRefresh: () => Promise<void>;
}) {
  const { tenant, entries, loyer, paiement, caution, solde, statut } = balance;
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const currentMonth = today.slice(0, 7);
  const [form, setForm] = useState({
    entry_date: today,
    amount: '',
    month: currentMonth,
    label: '',
  });

  const handleSave = async () => {
    const amt = parseFloat(form.amount.replace(',', '.'));
    if (!form.label.trim() || isNaN(amt) || amt === 0) {
      alert('Montant et libellé requis. Montant positif = dû au locataire (impayé ↑), négatif = en faveur du locataire.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('tenant_ledger').insert({
      tenant_id: tenant.id,
      entry_date: form.entry_date,
      type: 'regularisation',
      amount: amt,
      month: form.month || null,
      label: form.label.trim(),
      created_by: 'dashboard_manual',
    });
    setSaving(false);
    if (error) {
      alert('Erreur: ' + error.message);
      return;
    }
    setForm({ entry_date: today, amount: '', month: currentMonth, label: '' });
    setShowForm(false);
    await onRefresh();
  };

  const handleDelete = async (entry: LedgerEntry) => {
    if (entry.type !== 'regularisation') return;
    if (!confirm(`Supprimer cette régularisation ?\n${entry.label} — ${fmt(Number(entry.amount))}`)) return;
    const { error } = await supabase.from('tenant_ledger').delete().eq('id', entry.id);
    if (error) {
      alert('Erreur: ' + error.message);
      return;
    }
    await onRefresh();
  };
  // sort entries: by date, then by type priority (caution first, then loyer, then paiement, then regul)
  const sorted = [...entries].sort((a, b) => {
    if (a.entry_date !== b.entry_date) return a.entry_date.localeCompare(b.entry_date);
    const order = { caution: 0, loyer: 1, regularisation: 2, paiement: 3 };
    return (order[a.type] ?? 4) - (order[b.type] ?? 4);
  });

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: 16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 16,
          maxWidth: 900,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          padding: 24,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
              {tenant.first_name} {tenant.last_name}
            </h2>
            <div style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
              {tenant.properties?.name} {tenant.room_number ? `· Chambre ${tenant.room_number}` : ''} · Entrée {fmtDate(tenant.move_in_date)}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: 28,
              cursor: 'pointer',
              color: '#94a3b8',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          <SummaryBox label="Loyers dus" value={fmt(loyer)} color="#64748b" />
          <SummaryBox label="Paiements" value={fmt(paiement)} color="#22c55e" />
          <SummaryBox label="Caution" value={fmt(caution)} color="#8b5cf6" />
          <SummaryBox
            label="Solde"
            value={fmt(solde)}
            color={statut === 'IMPAYE' ? '#ef4444' : statut === 'CREDITEUR' ? '#3b82f6' : '#22c55e'}
          />
        </div>

        {/* Ledger entries header with add button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Détail du ledger ({sorted.length} écritures)</h3>
          <button
            onClick={() => setShowForm(v => !v)}
            style={{
              background: showForm ? '#e2e8f0' : '#f59e0b',
              color: showForm ? '#475569' : '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 14px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {showForm ? 'Annuler' : '+ Nouvelle régularisation'}
          </button>
        </div>

        {showForm && (
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: 14, marginBottom: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 10 }}>
              <div>
                <label style={formLabel}>Date</label>
                <input type="date" value={form.entry_date} onChange={e => setForm({ ...form, entry_date: e.target.value })} style={formInput} />
              </div>
              <div>
                <label style={formLabel}>Mois (YYYY-MM)</label>
                <input type="text" value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} placeholder="2026-04" style={formInput} />
              </div>
              <div>
                <label style={formLabel}>Montant (€)</label>
                <input type="text" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="+180 ou -15.92" style={formInput} />
              </div>
              <div>
                <label style={formLabel}>Libellé</label>
                <input type="text" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="Rattrapage déc. 2025" style={formInput} />
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#92400e', marginBottom: 10 }}>
              💡 Positif (+180) = dû par le locataire (augmente l'impayé). Négatif (−15.92) = en faveur du locataire (crédit).
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                background: '#22c55e',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 600,
                cursor: saving ? 'wait' : 'pointer',
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        )}

        <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Mois</th>
                <th style={thStyle}>Libellé</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Montant</th>
                <th style={{ ...thStyle, width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(e => (
                <tr key={e.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={tdStyle}>{fmtDate(e.entry_date)}</td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: 10,
                        background: TYPE_COLORS[e.type] + '22',
                        color: TYPE_COLORS[e.type],
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {TYPE_LABELS[e.type]}
                    </span>
                  </td>
                  <td style={tdStyle}>{e.month || '—'}</td>
                  <td style={{ ...tdStyle, color: '#475569' }}>{e.label || '—'}</td>
                  <td
                    style={{
                      ...tdStyle,
                      textAlign: 'right',
                      fontWeight: 600,
                      color: Number(e.amount) < 0 ? '#22c55e' : '#0f172a',
                    }}
                  >
                    {fmt(Number(e.amount))}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    {e.type === 'regularisation' && (
                      <button
                        onClick={() => handleDelete(e)}
                        title="Supprimer cette régularisation"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#ef4444',
                          fontSize: 14,
                          padding: 4,
                        }}
                      >
                        🗑
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SummaryBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ background: '#f8fafc', borderLeft: `3px solid ${color}`, padding: '10px 14px', borderRadius: 6 }}>
      <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color, marginTop: 2 }}>{value}</div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px 12px',
  fontSize: 12,
  fontWeight: 600,
  color: '#475569',
  textTransform: 'uppercase',
  letterSpacing: 0.4,
};

const tdStyle: React.CSSProperties = {
  padding: '10px 12px',
  color: '#1e293b',
};

const formLabel: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  color: '#92400e',
  textTransform: 'uppercase',
  letterSpacing: 0.4,
  marginBottom: 4,
};

const formInput: React.CSSProperties = {
  width: '100%',
  padding: '6px 10px',
  borderRadius: 6,
  border: '1px solid #fcd34d',
  background: '#fff',
  fontSize: 13,
  boxSizing: 'border-box',
};

const selectStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid #cbd5e1',
  background: '#fff',
  fontSize: 14,
  cursor: 'pointer',
};
