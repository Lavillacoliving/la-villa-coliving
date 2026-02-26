import { useState, useMemo } from 'react';
import CreateInvoiceForm from './CreateInvoiceForm';

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

interface Props {
  transaction: BankTransaction;
  linkedInvoice: Invoice | null;
  orphanInvoices: Invoice[];
  entities: Entity[];
  onConfirmMatch: () => void;
  onUnlink: () => void;
  onLinkInvoice: (invoiceId: string) => void;
  onInvoiceCreated: (invoiceId: string) => void;
}

// ─── Helpers ──────────────────────────────────────────────
function fmt(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' \u20ac';
}

function fmtDate(d: string | null) {
  if (!d) return '\u2014';
  return new Date(d).toLocaleDateString('fr-FR');
}

function computeScore(tx: BankTransaction, inv: Invoice): number {
  let score = 0;
  const txAmount = tx.debit > 0 ? tx.debit : tx.credit;

  // Name match (50 points)
  const txFirstWord = tx.label_simple?.split(/[\s,]+/)[0]?.toUpperCase() || '';
  const invFirstWord = inv.supplier?.split(/[\s,]+/)[0]?.toUpperCase() || '';
  if (txFirstWord && invFirstWord && (
    tx.label_simple?.toUpperCase().includes(invFirstWord) ||
    inv.supplier?.toUpperCase().includes(txFirstWord)
  )) {
    score += 50;
  }

  // Amount match (30 points)
  if (txAmount > 0 && inv.amount_ttc > 0) {
    const diff = Math.abs(txAmount - inv.amount_ttc);
    const ratio = 1 - diff / txAmount;
    score += Math.max(0, Math.round(30 * ratio));
  }

  // Date match (20 points)
  if (tx.accounting_date && inv.invoice_date) {
    const daysDiff = Math.abs((new Date(tx.accounting_date).getTime() - new Date(inv.invoice_date).getTime()) / 86400000);
    const ratio = 1 - daysDiff / 30;
    score += Math.max(0, Math.round(20 * ratio));
  }

  return Math.min(100, score);
}

// ─── Component ──────────────────────────────────────────
export default function VerificationTab({
  transaction, linkedInvoice, orphanInvoices, entities,
  onConfirmMatch, onUnlink, onLinkInvoice, onInvoiceCreated,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [dateTolerance, setDateTolerance] = useState(30);
  const [amountTolerance, setAmountTolerance] = useState(10);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const txAmount = transaction.debit > 0 ? transaction.debit : transaction.credit;
  const entityName = entities.find(e => e.id === transaction.entity_id)?.name || '?';

  // Scored & filtered suggestions
  const suggestions = useMemo(() => {
    let candidates = orphanInvoices.filter(inv => inv.entity_id === transaction.entity_id);

    // Amount filter
    if (txAmount > 0) {
      const tolerance = amountTolerance / 100;
      candidates = candidates.filter(inv =>
        inv.amount_ttc >= txAmount * (1 - tolerance) &&
        inv.amount_ttc <= txAmount * (1 + tolerance)
      );
    }

    // Date filter
    if (transaction.accounting_date) {
      candidates = candidates.filter(inv => {
        if (!inv.invoice_date) return true;
        const daysDiff = Math.abs((new Date(transaction.accounting_date).getTime() - new Date(inv.invoice_date).getTime()) / 86400000);
        return daysDiff <= dateTolerance;
      });
    }

    // Text search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      candidates = candidates.filter(inv =>
        inv.supplier?.toLowerCase().includes(q) ||
        inv.product?.toLowerCase().includes(q) ||
        inv.file_name?.toLowerCase().includes(q)
      );
    }

    // Score and sort
    return candidates
      .map(inv => ({ ...inv, _score: computeScore(transaction, inv) }))
      .sort((a, b) => b._score - a._score)
      .slice(0, 15);
  }, [orphanInvoices, transaction, searchQuery, amountTolerance, dateTolerance, txAmount]);

  // Score bar color
  const scoreColor = (s: number) => s >= 80 ? '#16a34a' : s >= 50 ? '#d97706' : '#dc2626';

  // Amount match indicator
  const amountMatch = (invAmount: number) => {
    if (!txAmount || !invAmount) return { icon: '?', color: '#888' };
    if (Math.abs(txAmount - invAmount) < 0.01) return { icon: '\u2713', color: '#16a34a' };
    const pct = Math.abs(txAmount - invAmount) / txAmount * 100;
    if (pct <= 5) return { icon: '\u2248', color: '#d97706' };
    return { icon: '\u2260', color: '#dc2626' };
  };

  const S = {
    card: { background: '#f8f9fa', borderRadius: '10px', padding: '16px', border: '1px solid #e5e7eb' } as React.CSSProperties,
    label: { fontSize: '11px', color: '#999', textTransform: 'uppercase' as const, marginBottom: '2px' },
    val: { fontSize: '14px', fontWeight: 600 as const, color: '#1a1a2e' },
    goldBtn: { padding: '8px 16px', background: '#b8860b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 as const } as React.CSSProperties,
    outlineBtn: { padding: '8px 16px', background: '#fff', color: '#555', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' } as React.CSSProperties,
    input: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' as const },
  };

  // ─── MODE A: Facture liée ─────────────────────────────
  if (linkedInvoice) {
    const am = amountMatch(linkedInvoice.amount_ttc);
    const dateDiff = transaction.accounting_date && linkedInvoice.invoice_date
      ? Math.abs((new Date(transaction.accounting_date).getTime() - new Date(linkedInvoice.invoice_date).getTime()) / 86400000)
      : null;
    const dateOk = dateDiff !== null && dateDiff <= 7;

    return (
      <div>
        {/* Side-by-side comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          {/* Transaction card */}
          <div style={S.card}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#b8860b', marginBottom: '12px', textTransform: 'uppercase' }}>Transaction bancaire</div>
            <div style={{ marginBottom: '8px' }}>
              <div style={S.label}>Libellé</div>
              <div style={S.val}>{transaction.label_simple}</div>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <div style={S.label}>Date</div>
              <div style={S.val}>{fmtDate(transaction.accounting_date)}</div>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <div style={S.label}>Montant</div>
              <div style={{ ...S.val, color: '#ef4444' }}>{fmt(txAmount)}</div>
            </div>
            <div>
              <div style={S.label}>Entité</div>
              <div style={S.val}>{entityName}</div>
            </div>
            {transaction.label_operation && (
              <div style={{ marginTop: '8px' }}>
                <div style={S.label}>Détail opération</div>
                <div style={{ fontSize: '12px', color: '#888' }}>{transaction.label_operation}</div>
              </div>
            )}
          </div>

          {/* Invoice card */}
          <div style={{ ...S.card, borderColor: '#bbf7d0' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#16a34a', marginBottom: '12px', textTransform: 'uppercase' }}>Facture liée</div>
            <div style={{ marginBottom: '8px' }}>
              <div style={S.label}>Fournisseur</div>
              <div style={S.val}>{linkedInvoice.supplier}</div>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <div style={S.label}>Date facture</div>
              <div style={{ ...S.val, color: dateOk ? '#16a34a' : '#d97706' }}>
                {fmtDate(linkedInvoice.invoice_date)}
                {dateDiff !== null && <span style={{ fontSize: '11px', fontWeight: 400, marginLeft: '6px' }}>({dateDiff}j d'écart)</span>}
              </div>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <div style={S.label}>Montant TTC</div>
              <div style={{ ...S.val, color: am.color }}>
                {fmt(linkedInvoice.amount_ttc)} <span style={{ fontSize: '16px' }}>{am.icon}</span>
              </div>
            </div>
            <div>
              <div style={S.label}>Entité</div>
              <div style={S.val}>{entities.find(e => e.id === linkedInvoice.entity_id)?.name || '?'}</div>
            </div>
            {linkedInvoice.type_service && (
              <div style={{ marginTop: '8px' }}>
                <div style={S.label}>Type service</div>
                <div style={{ fontSize: '13px', color: '#555' }}>{linkedInvoice.type_service}</div>
              </div>
            )}
            {linkedInvoice.product && (
              <div style={{ marginTop: '4px' }}>
                <div style={S.label}>Produit</div>
                <div style={{ fontSize: '13px', color: '#555' }}>{linkedInvoice.product}</div>
              </div>
            )}
            {linkedInvoice.file_name && (
              <div style={{ marginTop: '8px' }}>
                <div style={S.label}>Fichier</div>
                <div style={{ fontSize: '12px', color: '#3b82f6' }}>{linkedInvoice.file_name}</div>
              </div>
            )}
            {linkedInvoice.file_path && (
              <a href={linkedInvoice.file_path} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-block', marginTop: '8px', fontSize: '12px', color: '#3b82f6', textDecoration: 'none' }}>
                📄 Voir la facture sur Drive
              </a>
            )}
          </div>
        </div>

        {/* Confidence score bar */}
        {transaction.match_confidence !== null && transaction.match_confidence !== undefined && (
          <div style={{ marginBottom: '16px', padding: '8px 12px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', color: '#555' }}>Score de confiance</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: scoreColor(transaction.match_confidence) }}>{transaction.match_confidence}%</span>
            </div>
            <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '3px' }}>
              <div style={{ height: '100%', background: scoreColor(transaction.match_confidence), borderRadius: '3px', width: transaction.match_confidence + '%' }} />
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={onConfirmMatch} style={S.goldBtn}>
            ✓ Confirmer le match
          </button>
          <button onClick={onUnlink} style={S.outlineBtn}>
            ✏️ Corriger (délier)
          </button>
          <button onClick={() => setShowCreateForm(!showCreateForm)} style={S.outlineBtn}>
            ➕ Créer facture
          </button>
        </div>

        {showCreateForm && (
          <div style={{ marginTop: '16px' }}>
            <CreateInvoiceForm
              transaction={transaction}
              onCreated={(id) => { setShowCreateForm(false); onInvoiceCreated(id); }}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        )}
      </div>
    );
  }

  // ─── MODE B: Pas de facture liée ──────────────────────
  return (
    <div>
      {/* Transaction info */}
      <div style={{ ...S.card, marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600 }}>{transaction.label_simple}</div>
            <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>{fmtDate(transaction.accounting_date)} — {entityName}</div>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#ef4444' }}>{fmt(txAmount)}</div>
        </div>
      </div>

      {/* Search bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' as const }}>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="🔍 Rechercher par fournisseur, produit..."
            style={S.input}
          />
        </div>
        <button onClick={() => setShowAdvanced(!showAdvanced)} style={S.outlineBtn}>
          {showAdvanced ? 'Simple' : 'Avancée'}
        </button>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
          <div>
            <label style={S.label}>Tolérance date (jours)</label>
            <input type="number" value={dateTolerance} onChange={e => setDateTolerance(Number(e.target.value))} style={{ ...S.input, marginTop: '4px' }} min={1} max={365} />
          </div>
          <div>
            <label style={S.label}>Tolérance montant (%)</label>
            <input type="number" value={amountTolerance} onChange={e => setAmountTolerance(Number(e.target.value))} style={{ ...S.input, marginTop: '4px' }} min={1} max={100} />
          </div>
        </div>
      )}

      {/* Suggestions */}
      <div style={{ marginBottom: '8px', fontSize: '13px', color: '#888' }}>
        {suggestions.length > 0 ? `${suggestions.length} facture${suggestions.length > 1 ? 's' : ''} candidate${suggestions.length > 1 ? 's' : ''} :` : 'Aucune facture candidate trouvée.'}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', maxHeight: '320px', overflowY: 'auto' }}>
        {suggestions.map(inv => {
          const am = amountMatch(inv.amount_ttc);
          return (
            <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', border: '1px solid #e5e7eb', borderRadius: '10px', background: '#fff' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>{inv.supplier}</span>
                  <span style={{ fontSize: '12px', color: '#888' }}>{fmtDate(inv.invoice_date)}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: am.color }}>{fmt(inv.amount_ttc)} {am.icon}</span>
                </div>
                {inv.type_service && <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{inv.type_service}{inv.product ? ` — ${inv.product}` : ''}</div>}
                {inv.file_name && <div style={{ fontSize: '11px', color: '#aaa', marginTop: '1px' }}>{inv.file_name}</div>}
                {inv.file_path && (
                  <a href={inv.file_path} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#3b82f6', textDecoration: 'none' }} onClick={e => e.stopPropagation()}>📄 Drive</a>
                )}
                {/* Score bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                  <div style={{ width: '80px', height: '4px', background: '#e5e7eb', borderRadius: '2px' }}>
                    <div style={{ height: '100%', background: scoreColor(inv._score), borderRadius: '2px', width: inv._score + '%' }} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: scoreColor(inv._score) }}>{inv._score}%</span>
                </div>
              </div>
              <button onClick={() => onLinkInvoice(inv.id)} style={{ ...S.goldBtn, fontSize: '12px', whiteSpace: 'nowrap' as const }}>Lier</button>
            </div>
          );
        })}
      </div>

      {/* Create invoice */}
      {!showCreateForm ? (
        <button onClick={() => setShowCreateForm(true)} style={{ ...S.outlineBtn, width: '100%', padding: '12px', textAlign: 'center' as const }}>
          ➕ Créer une facture et la lier
        </button>
      ) : (
        <CreateInvoiceForm
          transaction={transaction}
          onCreated={(id) => { setShowCreateForm(false); onInvoiceCreated(id); }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
}
