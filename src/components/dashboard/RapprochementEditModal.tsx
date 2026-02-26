import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';
import { logAudit } from '@/lib/auditLog';
import {
  TRANSACTION_TYPES, INVOICE_CATEGORIES,
  getRapprochementBadge,
} from '@/lib/entities';
import VerificationTab from './VerificationTab';

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

type ModalTab = 'verification' | 'classify' | 'type' | 'flag';

interface Props {
  transaction: BankTransaction;
  entities: Entity[];
  orphanInvoices: Invoice[];
  onClose: () => void;
  onSave: () => void;
  // Batch navigation
  batchTransactions?: BankTransaction[];
  currentIndex?: number;
  onNavigate?: (index: number) => void;
}

// ─── Helpers ──────────────────────────────────────────────
function fmt(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' \u20ac';
}

function fmtDate(d: string | null) {
  if (!d) return '\u2014';
  return new Date(d).toLocaleDateString('fr-FR');
}

// ─── Component ──────────────────────────────────────────
export default function RapprochementEditModal({
  transaction, entities, orphanInvoices,
  onClose, onSave,
  batchTransactions, currentIndex, onNavigate,
}: Props) {
  const toast = useToast();
  const [saving, setSaving] = useState(false);

  // Auto-select tab based on transaction status
  const defaultTab: ModalTab = ['auto', 'non_rapproche'].includes(transaction.rapprochement_status) ? 'verification' : 'classify';
  const [activeTab, setActiveTab] = useState<ModalTab>(defaultTab);

  // Form state
  const [editCategory, setEditCategory] = useState(transaction.manual_category || transaction.category || '');
  const [editComment, setEditComment] = useState(transaction.manual_comment || '');
  const [editType, setEditType] = useState(transaction.transaction_type || 'non_classe');
  const [editFlagReason, setEditFlagReason] = useState(transaction.flagged_reason || '');
  const [editNotes, setEditNotes] = useState(transaction.rapprochement_notes || '');

  // Linked invoice (fetched if matched_invoice_id exists)
  const [linkedInvoice, setLinkedInvoice] = useState<Invoice | null>(null);
  const [loadingInvoice, setLoadingInvoice] = useState(false);

  // Reset form when transaction changes (batch navigation)
  useEffect(() => {
    setEditCategory(transaction.manual_category || transaction.category || '');
    setEditComment(transaction.manual_comment || '');
    setEditType(transaction.transaction_type || 'non_classe');
    setEditFlagReason(transaction.flagged_reason || '');
    setEditNotes(transaction.rapprochement_notes || '');
    setActiveTab(['auto', 'non_rapproche'].includes(transaction.rapprochement_status) ? 'verification' : 'classify');
    // Fetch linked invoice
    fetchLinkedInvoice();
  }, [transaction.id]);

  const fetchLinkedInvoice = async () => {
    if (!transaction.matched_invoice_id) {
      setLinkedInvoice(null);
      return;
    }
    setLoadingInvoice(true);
    const { data } = await supabase.from('invoices').select('*').eq('id', transaction.matched_invoice_id).single();
    setLinkedInvoice(data || null);
    setLoadingInvoice(false);
  };

  // Initial fetch
  useEffect(() => { fetchLinkedInvoice(); }, []);

  // ─── Actions ──────────────────────────────────────────
  const saveClassification = async () => {
    setSaving(true);
    const updates: Record<string, any> = {
      manual_category: editCategory || null,
      manual_comment: editComment || null,
      transaction_type: editType,
      rapprochement_notes: editNotes || null,
      updated_by: 'dashboard',
      updated_at: new Date().toISOString(),
    };

    if (editCategory && transaction.rapprochement_status === 'non_rapproche') {
      updates.rapprochement_status = 'manuel';
    }

    const { error } = await supabase.from('bank_transactions').update(updates).eq('id', transaction.id);
    if (error) { toast.error('Erreur: ' + error.message); setSaving(false); return; }

    // Upsert supplier_defaults
    if (editCategory && transaction.label_simple) {
      const pattern = transaction.label_simple.split(' ').slice(0, 3).join(' ').toUpperCase();
      await supabase.from('supplier_defaults').upsert({
        supplier_pattern: pattern,
        default_category: editCategory,
        entity_id: transaction.entity_id,
        times_used: 1,
      }, { onConflict: 'supplier_pattern,entity_id' }).select();
    }

    await logAudit('transaction_classified', 'bank_transaction', transaction.id, { category: editCategory, type: editType, comment: editComment });
    toast.success('Transaction mise à jour');
    setSaving(false);
    onSave();
  };

  const flagTransaction = async () => {
    if (!editFlagReason) return;
    setSaving(true);
    const { error } = await supabase.from('bank_transactions').update({
      rapprochement_status: 'flag',
      flagged_reason: editFlagReason,
      rapprochement_notes: editNotes || null,
      updated_by: 'dashboard',
      updated_at: new Date().toISOString(),
    }).eq('id', transaction.id);

    if (error) { toast.error('Erreur: ' + error.message); setSaving(false); return; }
    await logAudit('transaction_flagged', 'bank_transaction', transaction.id, { reason: editFlagReason });
    toast.success('Transaction flaggée');
    setSaving(false);
    onSave();
  };

  const confirmMatch = async () => {
    setSaving(true);
    const { error } = await supabase.from('bank_transactions').update({
      rapprochement_status: 'manuel',
      updated_by: 'dashboard',
      updated_at: new Date().toISOString(),
    }).eq('id', transaction.id);

    if (error) { toast.error('Erreur: ' + error.message); setSaving(false); return; }

    if (transaction.matched_invoice_id) {
      await supabase.from('invoices').update({ rapprochement_status: 'manuel' }).eq('id', transaction.matched_invoice_id);
    }

    await logAudit('transaction_classified', 'bank_transaction', transaction.id, { action: 'confirm_match' });
    toast.success('Match confirmé');
    setSaving(false);

    // Auto-navigate to next in batch
    if (batchTransactions && currentIndex !== undefined && onNavigate && currentIndex < batchTransactions.length - 1) {
      onNavigate(currentIndex + 1);
    } else {
      onSave();
    }
  };

  const verifyTransaction = async (notes?: string) => {
    setSaving(true);
    const updates: Record<string, any> = {
      rapprochement_status: 'verified',
      verified_by: 'dashboard',
      verified_at: new Date().toISOString(),
      updated_by: 'dashboard',
      updated_at: new Date().toISOString(),
    };
    if (notes) updates.rapprochement_notes = notes;

    const { error } = await supabase.from('bank_transactions').update(updates).eq('id', transaction.id);
    if (error) { toast.error('Erreur: ' + error.message); setSaving(false); return; }

    // Also mark linked invoice as verified
    if (transaction.matched_invoice_id) {
      await supabase.from('invoices').update({ rapprochement_status: 'verified' }).eq('id', transaction.matched_invoice_id);
    }

    await logAudit('transaction_verified', 'bank_transaction', transaction.id, { notes, had_invoice: !!transaction.matched_invoice_id });
    toast.success('Transaction vérifiée ✓');
    setSaving(false);

    // Auto-navigate to next in batch
    if (batchTransactions && currentIndex !== undefined && onNavigate && currentIndex < batchTransactions.length - 1) {
      onNavigate(currentIndex + 1);
    } else {
      onSave();
    }
  };

  const rejectMatch = async () => {
    if (!transaction.matched_invoice_id) return;
    setSaving(true);
    // Unlink invoice and reset both to non_rapproche
    await supabase.from('invoices').update({ bank_transaction_id: null, rapprochement_status: 'non_rapproche' }).eq('id', transaction.matched_invoice_id);
    await supabase.from('bank_transactions').update({
      matched_invoice_id: null,
      rapprochement_status: 'non_rapproche',
      updated_by: 'dashboard',
      updated_at: new Date().toISOString(),
    }).eq('id', transaction.id);
    await logAudit('invoice_unlinked', 'bank_transaction', transaction.id, { invoice_id: transaction.matched_invoice_id, reason: 'rejected_during_verification' });
    toast.success('Match rejeté — facture déliée');
    setLinkedInvoice(null);
    setSaving(false);

    // Auto-navigate to next in batch
    if (batchTransactions && currentIndex !== undefined && onNavigate && currentIndex < batchTransactions.length - 1) {
      onNavigate(currentIndex + 1);
    } else {
      onSave();
    }
  };

  const unlinkInvoice = async () => {
    if (!transaction.matched_invoice_id) return;
    setSaving(true);
    await supabase.from('invoices').update({ bank_transaction_id: null, rapprochement_status: 'non_rapproche' }).eq('id', transaction.matched_invoice_id);
    await supabase.from('bank_transactions').update({
      matched_invoice_id: null,
      rapprochement_status: 'non_rapproche',
      updated_by: 'dashboard',
      updated_at: new Date().toISOString(),
    }).eq('id', transaction.id);
    await logAudit('invoice_unlinked', 'bank_transaction', transaction.id, { invoice_id: transaction.matched_invoice_id });
    toast.success('Facture déliée');
    setLinkedInvoice(null);
    setSaving(false);
    onSave();
  };

  const linkInvoice = async (invoiceId: string) => {
    setSaving(true);
    await supabase.from('bank_transactions').update({
      matched_invoice_id: invoiceId,
      rapprochement_status: 'manuel',
      updated_by: 'dashboard',
      updated_at: new Date().toISOString(),
    }).eq('id', transaction.id);
    await supabase.from('invoices').update({
      bank_transaction_id: transaction.id,
      rapprochement_status: 'manuel',
    }).eq('id', invoiceId);
    await logAudit('invoice_linked', 'bank_transaction', transaction.id, { invoice_id: invoiceId });
    toast.success('Facture liée');
    setSaving(false);
    onSave();
  };

  const handleInvoiceCreated = (_invoiceId: string) => {
    onSave();
  };

  // ─── Batch info ───────────────────────────────────────
  const hasBatch = batchTransactions && batchTransactions.length > 1 && currentIndex !== undefined && onNavigate;
  const canPrev = hasBatch && currentIndex! > 0;
  const canNext = hasBatch && currentIndex! < batchTransactions!.length - 1;

  const entityName = entities.find(e => e.id === transaction.entity_id)?.name || '?';
  const entityCode = entities.find(e => e.id === transaction.entity_id)?.code || '';
  const badge = getRapprochementBadge(transaction.rapprochement_status);
  const txAmount = transaction.debit > 0 ? transaction.debit : transaction.credit;

  // ─── Styles ───────────────────────────────────────────
  const S = {
    overlay: { position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modal: { background: '#fff', borderRadius: '16px', padding: '0', width: '720px', maxWidth: '95vw', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' as const },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #e5e7eb', background: '#fafafa' } as React.CSSProperties,
    body: { padding: '24px', overflowY: 'auto' as const, flex: 1 },
    label: { fontSize: '11px', color: '#999', textTransform: 'uppercase' as const, marginBottom: '2px' },
    inputStyle: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' as const, marginBottom: '12px' },
    selectStyle: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', marginBottom: '12px', background: '#fff' },
    goldBtn: { padding: '8px 16px', background: '#b8860b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 as const } as React.CSSProperties,
    navBtn: { padding: '6px 14px', background: '#fff', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', color: '#555' } as React.CSSProperties,
  };

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        {/* ─── Header with batch navigation ─── */}
        <div style={S.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {hasBatch && (
              <button onClick={() => canPrev && onNavigate!(currentIndex! - 1)} disabled={!canPrev}
                style={{ ...S.navBtn, opacity: canPrev ? 1 : 0.3, cursor: canPrev ? 'pointer' : 'default' }}>←</button>
            )}
            <h3 style={{ margin: 0, fontSize: '17px', color: '#1a1a2e' }}>Modifier la transaction</h3>
            {hasBatch && (
              <>
                <span style={{ fontSize: '13px', color: '#888', fontWeight: 500 }}>{currentIndex! + 1}/{batchTransactions!.length}</span>
                <button onClick={() => canNext && onNavigate!(currentIndex! + 1)} disabled={!canNext}
                  style={{ ...S.navBtn, opacity: canNext ? 1 : 0.3, cursor: canNext ? 'pointer' : 'default' }}>→</button>
              </>
            )}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#888' }}>×</button>
        </div>

        <div style={S.body}>
          {/* ─── Transaction summary ─── */}
          <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a2e' }}>{transaction.label_simple}</div>
                <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
                  {fmtDate(transaction.accounting_date)} · {entityName} ({entityCode})
                </div>
                {transaction.label_operation && (
                  <div style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>{transaction.label_operation}</div>
                )}
              </div>
              <div style={{ textAlign: 'right' as const }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: transaction.debit > 0 ? '#ef4444' : '#22c55e' }}>
                  {transaction.debit > 0 ? `-${fmt(txAmount)}` : `+${fmt(txAmount)}`}
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px', justifyContent: 'flex-end' }}>
                  <span style={{ background: badge.bg, color: badge.color, padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                    {badge.label}
                  </span>
                  {transaction.matched_invoice_id && (
                    <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>📎 Facture</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ─── Tabs ─── */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '2px solid #e5e7eb', paddingBottom: '4px' }}>
            {([
              { v: 'verification' as const, l: 'Vérification', dot: transaction.rapprochement_status !== 'verified' },
              { v: 'classify' as const, l: 'Classifier', dot: false },
              { v: 'type' as const, l: 'Typer', dot: false },
              { v: 'flag' as const, l: 'Flagger', dot: false },
            ] as const).map(t => (
              <button key={t.v} onClick={() => setActiveTab(t.v)} style={{
                padding: '8px 16px', border: 'none', borderRadius: '6px 6px 0 0', cursor: 'pointer', fontSize: '13px',
                background: activeTab === t.v ? '#1a1a2e' : 'transparent',
                color: activeTab === t.v ? '#fff' : '#888',
                fontWeight: activeTab === t.v ? 600 : 400,
                position: 'relative' as const,
              }}>
                {t.l}
                {t.dot && <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', marginLeft: '6px', verticalAlign: 'middle' }} />}
              </button>
            ))}
          </div>

          {/* ─── Tab: Verification ─── */}
          {activeTab === 'verification' && (
            loadingInvoice ? (
              <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>Chargement...</p>
            ) : (
              <VerificationTab
                transaction={transaction}
                linkedInvoice={linkedInvoice}
                orphanInvoices={orphanInvoices}
                entities={entities}
                onVerify={verifyTransaction}
                onReject={rejectMatch}
                onConfirmMatch={confirmMatch}
                onUnlink={unlinkInvoice}
                onLinkInvoice={linkInvoice}
                onInvoiceCreated={handleInvoiceCreated}
              />
            )
          )}

          {/* ─── Tab: Classify ─── */}
          {activeTab === 'classify' && (
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '4px', display: 'block' }}>Catégorie</label>
              <select value={editCategory} onChange={e => setEditCategory(e.target.value)} style={S.selectStyle}>
                <option value="">— Aucune —</option>
                {INVOICE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <label style={{ fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '4px', display: 'block' }}>Commentaire</label>
              <textarea value={editComment} onChange={e => setEditComment(e.target.value)} rows={3} placeholder="Note libre pour COGESTRA..." style={{ ...S.inputStyle, resize: 'vertical' as const }} />

              <button onClick={saveClassification} disabled={saving} style={{ ...S.goldBtn, width: '100%', padding: '12px', opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Sauvegarde...' : 'Enregistrer'}
              </button>
            </div>
          )}

          {/* ─── Tab: Type ─── */}
          {activeTab === 'type' && (
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '4px', display: 'block' }}>Type de transaction</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '8px', marginBottom: '16px' }}>
                {TRANSACTION_TYPES.map(t => (
                  <button key={t.value} onClick={() => setEditType(t.value)} style={{
                    padding: '10px 14px', border: editType === t.value ? `2px solid ${t.color}` : '1px solid #e5e7eb',
                    borderRadius: '8px', cursor: 'pointer', background: editType === t.value ? `${t.color}15` : '#fff',
                    color: t.color, fontWeight: editType === t.value ? 700 : 400, fontSize: '13px',
                  }}>{t.label}</button>
                ))}
              </div>

              <label style={{ fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '4px', display: 'block' }}>Notes</label>
              <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} rows={2} placeholder="Notes de rapprochement..." style={{ ...S.inputStyle, resize: 'vertical' as const }} />

              <button onClick={saveClassification} disabled={saving} style={{ ...S.goldBtn, width: '100%', padding: '12px', opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Sauvegarde...' : 'Enregistrer le type'}
              </button>
            </div>
          )}

          {/* ─── Tab: Flag ─── */}
          {activeTab === 'flag' && (
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '4px', display: 'block' }}>Raison du flag</label>
              <select value={editFlagReason} onChange={e => setEditFlagReason(e.target.value)} style={S.selectStyle}>
                <option value="">— Sélectionner —</option>
                <option value="possible_duplicate">Doublon possible</option>
                <option value="wrong_entity">Mauvaise entité</option>
                <option value="unusual_amount">Montant inhabituel</option>
                <option value="date_gap">Écart de date suspect</option>
                <option value="manual_review">Revue manuelle nécessaire</option>
              </select>

              <label style={{ fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '4px', display: 'block' }}>Notes</label>
              <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} rows={3} placeholder="Expliquer le problème..." style={{ ...S.inputStyle, resize: 'vertical' as const }} />

              <button onClick={flagTransaction} disabled={saving || !editFlagReason} style={{ ...S.goldBtn, width: '100%', padding: '12px', opacity: (saving || !editFlagReason) ? 0.6 : 1, background: '#d97706' }}>
                {saving ? 'Sauvegarde...' : '⚠️ Flagger cette transaction'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
