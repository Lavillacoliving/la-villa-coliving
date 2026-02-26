import { useState, useMemo } from 'react';
import InvoicePDFViewer from './InvoicePDFViewer';
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
  storage_path: string | null;
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
  onVerify: (notes?: string) => void;
  onReject: () => void;
  onConfirmMatch: () => void;
  onUnlink: () => void;
  onLinkInvoice: (invoiceId: string) => void;
  onInvoiceCreated: (invoiceId: string) => void;
}

// ─── Helpers ──────────────────────────────────────────────
function fmt(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function fmtDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR');
}

function computeScore(tx: BankTransaction, inv: Invoice): number {
  let score = 0;
  const txAmount = tx.debit > 0 ? tx.debit : tx.credit;

  // Name match (50 points)
  const txFirst = tx.label_simple?.split(/[\s,]+/)[0]?.toUpperCase() || '';
  const invFirst = inv.supplier?.split(/[\s,]+/)[0]?.toUpperCase() || '';
  if (txFirst && invFirst && (
    tx.label_simple?.toUpperCase().includes(invFirst) ||
    inv.supplier?.toUpperCase().includes(txFirst)
  )) score += 50;

  // Amount match (30 points)
  if (txAmount > 0 && inv.amount_ttc > 0) {
    const ratio = 1 - Math.abs(txAmount - inv.amount_ttc) / txAmount;
    score += Math.max(0, Math.round(30 * ratio));
  }

  // Date match (20 points)
  if (tx.accounting_date && inv.invoice_date) {
    const days = Math.abs((new Date(tx.accounting_date).getTime() - new Date(inv.invoice_date).getTime()) / 86400000);
    score += Math.max(0, Math.round(20 * (1 - days / 30)));
  }

  return Math.min(100, score);
}

// ─── Component ──────────────────────────────────────────
export default function VerificationTab({
  transaction, linkedInvoice, orphanInvoices, entities,
  onVerify, onReject, onUnlink, onLinkInvoice, onInvoiceCreated,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [dateTolerance, setDateTolerance] = useState(30);
  const [amountTolerance, setAmountTolerance] = useState(10);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [verifyNotes, setVerifyNotes] = useState('');
  const [activeMode, setActiveMode] = useState<'search' | 'upload'>('search');

  const txAmount = transaction.debit > 0 ? transaction.debit : transaction.credit;
  const entityName = entities.find(e => e.id === transaction.entity_id)?.name || '?';

  // Scored suggestions
  const suggestions = useMemo(() => {
    let candidates = orphanInvoices.filter(inv => inv.entity_id === transaction.entity_id);

    if (txAmount > 0) {
      const tol = amountTolerance / 100;
      candidates = candidates.filter(inv =>
        inv.amount_ttc >= txAmount * (1 - tol) && inv.amount_ttc <= txAmount * (1 + tol)
      );
    }

    if (transaction.accounting_date) {
      candidates = candidates.filter(inv => {
        if (!inv.invoice_date) return true;
        const days = Math.abs((new Date(transaction.accounting_date).getTime() - new Date(inv.invoice_date).getTime()) / 86400000);
        return days <= dateTolerance;
      });
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      candidates = candidates.filter(inv =>
        inv.supplier?.toLowerCase().includes(q) ||
        inv.product?.toLowerCase().includes(q) ||
        inv.file_name?.toLowerCase().includes(q)
      );
    }

    return candidates
      .map(inv => ({ ...inv, _score: computeScore(transaction, inv) }))
      .sort((a, b) => b._score - a._score)
      .slice(0, 15);
  }, [orphanInvoices, transaction, searchQuery, amountTolerance, dateTolerance, txAmount]);

  const scoreColor = (s: number) => s >= 80 ? '#16a34a' : s >= 50 ? '#d97706' : '#dc2626';
  const amountIcon = (invAmt: number) => {
    if (!txAmount || !invAmt) return { icon: '?', color: '#888' };
    if (Math.abs(txAmount - invAmt) < 0.01) return { icon: '✓', color: '#16a34a' };
    if (Math.abs(txAmount - invAmt) / txAmount <= 0.05) return { icon: '≈', color: '#d97706' };
    return { icon: '≠', color: '#dc2626' };
  };

  // ═══════════════════════════════════════════════════════
  // MODE A : Facture liée — vérification côte-à-côte
  // ═══════════════════════════════════════════════════════
  if (linkedInvoice) {
    const am = amountIcon(linkedInvoice.amount_ttc);
    const dateDiff = transaction.accounting_date && linkedInvoice.invoice_date
      ? Math.abs((new Date(transaction.accounting_date).getTime() - new Date(linkedInvoice.invoice_date).getTime()) / 86400000)
      : null;
    const dateOk = dateDiff !== null && dateDiff <= 7;

    return (
      <div>
        {/* Side-by-side comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          {/* Transaction card */}
          <div style={S.card}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#b8860b', marginBottom: '10px', textTransform: 'uppercase' }}>Transaction bancaire</div>
            <div style={{ marginBottom: '6px' }}><div style={S.label}>Libellé</div><div style={S.val}>{transaction.label_simple}</div></div>
            <div style={{ marginBottom: '6px' }}><div style={S.label}>Date</div><div style={S.val}>{fmtDate(transaction.accounting_date)}</div></div>
            <div style={{ marginBottom: '6px' }}><div style={S.label}>Montant</div><div style={{ ...S.val, color: '#ef4444' }}>{fmt(txAmount)}</div></div>
            <div><div style={S.label}>Entité</div><div style={S.val}>{entityName}</div></div>
            {transaction.label_operation && (
              <div style={{ marginTop: '6px' }}><div style={S.label}>Détail</div><div style={{ fontSize: '12px', color: '#888' }}>{transaction.label_operation}</div></div>
            )}
          </div>

          {/* Invoice card */}
          <div style={{ ...S.card, borderColor: '#bbf7d0' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#16a34a', marginBottom: '10px', textTransform: 'uppercase' }}>Facture liée</div>
            <div style={{ marginBottom: '6px' }}><div style={S.label}>Fournisseur</div><div style={S.val}>{linkedInvoice.supplier}</div></div>
            <div style={{ marginBottom: '6px' }}>
              <div style={S.label}>Date facture</div>
              <div style={{ ...S.val, color: dateOk ? '#16a34a' : '#d97706' }}>
                {fmtDate(linkedInvoice.invoice_date)}
                {dateDiff !== null && <span style={{ fontSize: '11px', fontWeight: 400, marginLeft: '6px' }}>({dateDiff}j)</span>}
              </div>
            </div>
            <div style={{ marginBottom: '6px' }}>
              <div style={S.label}>Montant TTC</div>
              <div style={{ ...S.val, color: am.color }}>{fmt(linkedInvoice.amount_ttc)} {am.icon}</div>
            </div>
            {linkedInvoice.type_service && (
              <div style={{ marginBottom: '4px' }}><div style={S.label}>Type</div><div style={{ fontSize: '13px', color: '#555' }}>{linkedInvoice.type_service}</div></div>
            )}
            {linkedInvoice.file_name && (
              <div style={{ marginTop: '6px' }}><div style={S.label}>Fichier</div><div style={{ fontSize: '12px', color: '#3b82f6' }}>{linkedInvoice.file_name}</div></div>
            )}
            {/* File status indicator */}
            <div style={{ marginTop: '8px', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600,
              background: linkedInvoice.storage_path ? '#f0fdf4' : linkedInvoice.file_path ? '#fffbeb' : '#fef2f2',
              color: linkedInvoice.storage_path ? '#16a34a' : linkedInvoice.file_path ? '#92400e' : '#dc2626',
            }}>
              {linkedInvoice.storage_path ? '✓ PDF dans Supabase Storage' : linkedInvoice.file_path ? '📁 Drive uniquement (pas de preview)' : '⚠ Aucun fichier'}
            </div>
          </div>
        </div>

        {/* Confidence score bar */}
        {transaction.match_confidence != null && (
          <div style={{ marginBottom: '12px', padding: '8px 12px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', color: '#555' }}>Score de confiance</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: scoreColor(transaction.match_confidence) }}>{transaction.match_confidence}%</span>
            </div>
            <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '3px' }}>
              <div style={{ height: '100%', background: scoreColor(transaction.match_confidence), borderRadius: '3px', width: transaction.match_confidence + '%' }} />
            </div>
          </div>
        )}

        {/* ★ PDF VIEWER — the key addition */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#555', marginBottom: '6px', textTransform: 'uppercase' }}>
            Vérification visuelle
          </div>
          <InvoicePDFViewer
            storagePath={linkedInvoice.storage_path}
            filePath={linkedInvoice.file_path}
            fileName={linkedInvoice.file_name}
          />
        </div>

        {/* Verification notes */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>
            Notes de vérification (optionnel)
          </label>
          <textarea
            value={verifyNotes}
            onChange={e => setVerifyNotes(e.target.value)}
            rows={2}
            placeholder="Ex: montant OK, fournisseur validé"
            style={S.input}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={() => onVerify(verifyNotes)} style={{ ...S.goldBtn, flex: 1, background: '#16a34a', padding: '12px' }}>
            ✓ Vérifié
          </button>
          <button onClick={onReject} style={{ ...S.outlineBtn, flex: 1, padding: '12px', color: '#dc2626', borderColor: '#fecaca' }}>
            ✗ Rejeter
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button onClick={onUnlink} style={{ ...S.outlineBtn, flex: 1, fontSize: '12px' }}>
            ✏️ Délier la facture
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // MODE B : Pas de facture liée
  // ═══════════════════════════════════════════════════════
  return (
    <div>
      {/* Transaction summary */}
      <div style={{ ...S.card, marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600 }}>{transaction.label_simple}</div>
            <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>{fmtDate(transaction.accounting_date)} — {entityName}</div>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: transaction.debit > 0 ? '#ef4444' : '#22c55e' }}>
            {transaction.debit > 0 ? '-' : '+'}{fmt(txAmount)}
          </div>
        </div>
      </div>

      {/* Mode tabs : Search / Upload */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '16px', borderBottom: '2px solid #e5e7eb' }}>
        {([
          { key: 'search' as const, label: '🔍 Chercher une facture' },
          { key: 'upload' as const, label: '📎 Uploader un PDF' },
        ]).map(tab => (
          <button key={tab.key} onClick={() => setActiveMode(tab.key)} style={{
            padding: '8px 16px', border: 'none', cursor: 'pointer', fontSize: '13px',
            borderBottom: activeMode === tab.key ? '2px solid #b8860b' : '2px solid transparent',
            background: 'transparent', color: activeMode === tab.key ? '#b8860b' : '#888',
            fontWeight: activeMode === tab.key ? 700 : 400, marginBottom: '-2px',
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Search mode ─── */}
      {activeMode === 'search' && (
        <>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rechercher par fournisseur, produit..."
              style={{ ...S.input, flex: 1 }}
            />
            <button onClick={() => setShowAdvanced(!showAdvanced)} style={S.outlineBtn}>
              {showAdvanced ? 'Simple' : 'Filtres'}
            </button>
          </div>

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

          <div style={{ marginBottom: '8px', fontSize: '13px', color: '#888' }}>
            {suggestions.length > 0 ? `${suggestions.length} facture${suggestions.length > 1 ? 's' : ''} candidate${suggestions.length > 1 ? 's' : ''} :` : 'Aucune facture candidate trouvée.'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', maxHeight: '280px', overflowY: 'auto' }}>
            {suggestions.map(inv => {
              const am = amountIcon(inv.amount_ttc);
              return (
                <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', border: '1px solid #e5e7eb', borderRadius: '10px', background: '#fff' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, fontSize: '14px' }}>{inv.supplier}</span>
                      <span style={{ fontSize: '12px', color: '#888' }}>{fmtDate(inv.invoice_date)}</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: am.color }}>{fmt(inv.amount_ttc)} {am.icon}</span>
                    </div>
                    {inv.type_service && <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{inv.type_service}{inv.product ? ` — ${inv.product}` : ''}</div>}
                    {inv.file_name && <div style={{ fontSize: '11px', color: '#aaa', marginTop: '1px' }}>{inv.file_name}</div>}
                    {/* Score bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                      <div style={{ width: '80px', height: '4px', background: '#e5e7eb', borderRadius: '2px' }}>
                        <div style={{ height: '100%', background: scoreColor(inv._score), borderRadius: '2px', width: inv._score + '%' }} />
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: scoreColor(inv._score) }}>{inv._score}%</span>
                    </div>
                  </div>
                  <button onClick={() => onLinkInvoice(inv.id)} style={{ ...S.goldBtn, fontSize: '12px', whiteSpace: 'nowrap', marginLeft: '8px' }}>Lier</button>
                </div>
              );
            })}
          </div>

          {!showCreateForm ? (
            <button onClick={() => setShowCreateForm(true)} style={{ ...S.outlineBtn, width: '100%', padding: '12px', textAlign: 'center' }}>
              ➕ Créer une facture et la lier
            </button>
          ) : (
            <CreateInvoiceForm
              transaction={transaction}
              onCreated={(id) => { setShowCreateForm(false); onInvoiceCreated(id); }}
              onCancel={() => setShowCreateForm(false)}
            />
          )}
        </>
      )}

      {/* ─── Upload mode ─── */}
      {activeMode === 'upload' && (
        <div>
          <p style={{ fontSize: '13px', color: '#555', marginBottom: '12px' }}>
            Uploadez le PDF de la facture, puis renseignez les métadonnées pour la lier à cette transaction.
          </p>
          <CreateInvoiceForm
            transaction={transaction}
            withUpload
            onCreated={(id) => onInvoiceCreated(id)}
            onCancel={() => setActiveMode('search')}
          />
        </div>
      )}

      {/* ─── Verify without invoice (bank fees, subscriptions, etc.) ─── */}
      <div style={{ marginTop: '16px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>
          Pas de facture disponible ?
        </div>
        <textarea
          value={verifyNotes}
          onChange={e => setVerifyNotes(e.target.value)}
          rows={2}
          placeholder="Commentaire obligatoire (ex: frais bancaires, prélèvement auto...)"
          style={{ ...S.input, marginBottom: '8px' }}
        />
        <button
          onClick={() => verifyNotes.trim() ? onVerify(verifyNotes) : undefined}
          disabled={!verifyNotes.trim()}
          style={{ ...S.goldBtn, width: '100%', padding: '10px', background: '#7c3aed', opacity: verifyNotes.trim() ? 1 : 0.4 }}
        >
          ✓ Vérifier sans facture
        </button>
      </div>
    </div>
  );
}

// ─── Shared styles ──────────────────────────────────────
const S = {
  card: { background: '#f8f9fa', borderRadius: '10px', padding: '16px', border: '1px solid #e5e7eb' } as React.CSSProperties,
  label: { fontSize: '11px', color: '#999', textTransform: 'uppercase' as const, marginBottom: '2px' },
  val: { fontSize: '14px', fontWeight: 600 as const, color: '#1a1a2e' },
  input: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' as const } as React.CSSProperties,
  goldBtn: { padding: '8px 16px', background: '#b8860b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 as const } as React.CSSProperties,
  outlineBtn: { padding: '8px 16px', background: '#fff', color: '#555', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' } as React.CSSProperties,
};
