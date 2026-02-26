import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';
import { logAudit } from '@/lib/auditLog';
import { INVOICE_CATEGORIES } from '@/lib/entities';
import InvoiceUploader from './InvoiceUploader';

interface BankTransaction {
  id: string;
  entity_id: string;
  accounting_date: string;
  label_simple: string;
  debit: number;
  credit: number;
}

interface Props {
  transaction: BankTransaction;
  withUpload?: boolean;
  onCreated: (invoiceId: string) => void;
  onCancel: () => void;
}

export default function CreateInvoiceForm({ transaction, withUpload, onCreated, onCancel }: Props) {
  const toast = useToast();
  const [saving, setSaving] = useState(false);

  const amount = transaction.debit > 0 ? transaction.debit : transaction.credit;
  const [supplier, setSupplier] = useState(transaction.label_simple?.split(',')[0]?.trim() || '');
  const [invoiceDate, setInvoiceDate] = useState(transaction.accounting_date || '');
  const [amountTtc, setAmountTtc] = useState(amount.toString());
  const [typeService, setTypeService] = useState('');
  const [product, setProduct] = useState('');
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!supplier || !invoiceDate || !amountTtc || !typeService) {
      toast.error('Remplissez les champs obligatoires');
      return;
    }
    if (withUpload && !uploadedPath) {
      toast.error('Veuillez uploader le PDF de la facture');
      return;
    }
    setSaving(true);

    // INSERT invoice
    const insertData: Record<string, any> = {
      entity_id: transaction.entity_id,
      supplier,
      invoice_date: invoiceDate,
      amount_ttc: parseFloat(amountTtc),
      type_service: typeService,
      product: product || null,
      rapprochement_status: 'manuel',
      bank_transaction_id: transaction.id,
    };
    if (uploadedPath) insertData.storage_path = uploadedPath;
    if (uploadedFileName) insertData.file_name = uploadedFileName;

    const { data: inv, error } = await supabase.from('invoices').insert(insertData).select().single();

    if (error || !inv) {
      toast.error('Erreur création facture: ' + (error?.message || 'inconnue'));
      setSaving(false);
      return;
    }

    // UPDATE bank_transaction
    await supabase.from('bank_transactions').update({
      matched_invoice_id: inv.id,
      rapprochement_status: 'manuel',
      updated_by: 'dashboard',
      updated_at: new Date().toISOString(),
    }).eq('id', transaction.id);

    await logAudit('invoice_linked', 'bank_transaction', transaction.id, {
      invoice_id: inv.id,
      created_inline: true,
      supplier,
      amount_ttc: parseFloat(amountTtc),
    });

    toast.success('Facture créée et liée');
    setSaving(false);
    onCreated(inv.id);
  };

  const S = {
    label: { fontSize: '13px', fontWeight: 600 as const, color: '#555', marginBottom: '4px', display: 'block' as const },
    input: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' as const, marginBottom: '12px' },
    select: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', marginBottom: '12px', background: '#fff' },
    goldBtn: { padding: '10px 14px', background: '#b8860b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 as const },
  };

  return (
    <div style={{ background: '#fffbeb', borderRadius: '10px', padding: '20px', border: '1px solid #fbbf24' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h4 style={{ margin: 0, fontSize: '15px', color: '#92400e' }}>Créer une facture</h4>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '18px' }}>×</button>
      </div>

      <label style={S.label}>Fournisseur *</label>
      <input value={supplier} onChange={e => setSupplier(e.target.value)} style={S.input} placeholder="Nom du fournisseur" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={S.label}>Date facture *</label>
          <input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} style={S.input} />
        </div>
        <div>
          <label style={S.label}>Montant TTC *</label>
          <input type="number" step="0.01" value={amountTtc} onChange={e => setAmountTtc(e.target.value)} style={S.input} />
        </div>
      </div>

      <label style={S.label}>Type de service *</label>
      <select value={typeService} onChange={e => setTypeService(e.target.value)} style={S.select}>
        <option value="">— Sélectionner —</option>
        {INVOICE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <label style={S.label}>Produit / description</label>
      <input value={product} onChange={e => setProduct(e.target.value)} style={S.input} placeholder="Optionnel" />

      {withUpload && (
        <div style={{ marginBottom: '12px' }}>
          <label style={S.label}>Fichier PDF *</label>
          <InvoiceUploader
            entityId={transaction.entity_id}
            onUploadSuccess={(path, name) => { setUploadedPath(path); setUploadedFileName(name); }}
            onError={(msg) => toast.error(msg)}
          />
        </div>
      )}

      <button onClick={handleCreate} disabled={saving} style={{ ...S.goldBtn, width: '100%', padding: '12px', opacity: saving ? 0.6 : 1 }}>
        {saving ? 'Création...' : 'Créer et lier la facture'}
      </button>
    </div>
  );
}
