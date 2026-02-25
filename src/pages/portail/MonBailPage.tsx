import { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { TenantInfo } from '@/hooks/useTenant';
import { usePayments } from '@/hooks/usePayments';
import { useTenantDocuments, DOCUMENT_TYPES } from '@/hooks/useTenantDocuments';
import { supabase } from '@/lib/supabase';
import { pdf } from '@react-pdf/renderer';
import { QuittancePDF } from './QuittancePDF';
import { FileText, Download, ExternalLink } from 'lucide-react';

interface PortailContext {
  tenant: TenantInfo;
  language: 'fr' | 'en';
}

const MONTHS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function MonBailPage() {
  const { tenant, language } = useOutletContext<PortailContext>();
  const { payments, loading: paymentsLoading } = usePayments(tenant.id);
  const { documents: tenantDocs, loading: docsDbLoading } = useTenantDocuments(tenant.id);
  const [storageDocs, setStorageDocs] = useState<{name:string,updated_at:string|null,metadata:{size?:number}|null}[]>([]);
  const [_storageLoading, setStorageLoading] = useState(true);

  // Fetch bail link from leases table
  const [bailUrl, setBailUrl] = useState<string | null>(null);
  useEffect(() => {
    async function fetchBail() {
      const { data } = await supabase
        .from('leases')
        .select('document_url')
        .eq('tenant_id', tenant.id)
        .eq('is_active', true)
        .maybeSingle();
      if (data?.document_url) setBailUrl(data.document_url);
    }
    fetchBail();
  }, [tenant.id]);

  const loadStorageDocs = useCallback(async () => {
    setStorageLoading(true);
    const { data } = await supabase.storage.from('operations').list('tenants/' + tenant.id, { limit: 50, sortBy: { column: 'name', order: 'asc' } });
    setStorageDocs((data || []).filter(f => f.name !== '.emptyFolderPlaceholder'));
    setStorageLoading(false);
  }, [tenant.id]);

  useEffect(() => { loadStorageDocs(); }, [loadStorageDocs]);

  const downloadStorageDoc = async (fileName: string) => {
    const { data, error } = await supabase.storage.from('operations').download('tenants/' + tenant.id + '/' + fileName);
    if (error || !data) return;
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url; a.download = fileName; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadTenantDoc = async (fileUrl: string, label: string) => {
    const { data, error } = await supabase.storage.from('operations').download(fileUrl);
    if (error || !data) return;
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url; a.download = label; a.click();
    URL.revokeObjectURL(url);
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' o';
    if (bytes < 1048576) return (bytes / 1024).toFixed(0) + ' Ko';
    return (bytes / 1048576).toFixed(1) + ' Mo';
  };

  const [generatingQuittance, setGeneratingQuittance] = useState<string | null>(null);

  const months = language === 'en' ? MONTHS_EN : MONTHS_FR;

  const generateQuittance = async (payment: { month: string; received_amount: number | null; payment_date: string | null }) => {
    if (!payment.received_amount || !payment.payment_date) return;
    setGeneratingQuittance(payment.month);

    try {
      const parts = payment.month.split('-');
      const year = parseInt(parts[0]);
      const monthIdx = parseInt(parts[1]) - 1;
      const monthLabel = `${MONTHS_FR[monthIdx]} ${year}`;
      const lastDay = new Date(year, monthIdx + 1, 0).getDate();
      const pad = (n: number) => n.toString().padStart(2, '0');

      // Charges are stored in EUR in Supabase (despite column names ending in _chf)
      const chargesEUR = (tenant.charges_energy_chf || 0) + (tenant.charges_maintenance_chf || 0) + (tenant.charges_services_chf || 0);
      const loyerNu = Math.max(0, payment.received_amount - chargesEUR);

      // Bailleur = "La Villa Coliving" pour toutes les propriétés
      // Pour Sleep In SCI (Le Loft, Le Lodge), on ajoute "Sleep In SCI —" devant l'adresse
      const isSleepIn = tenant.legal_entity_name?.toLowerCase().includes('sleep in');
      const bailleurAddress = isSleepIn
        ? 'Sleep In SCI — ' + (tenant.siege_social || tenant.property_address)
        : (tenant.siege_social || tenant.property_address);

      const data = {
        bailleur_name: 'La Villa Coliving',
        bailleur_address: bailleurAddress,
        bailleur_siret: tenant.siret || '',
        locataire_name: `${tenant.first_name} ${tenant.last_name}`,
        property_name: tenant.property_name,
        property_address: tenant.property_address,
        room_number: String(tenant.room_number),
        is_coliving: tenant.is_coliving,
        month_label: monthLabel,
        period_start: `${pad(1)}/${pad(monthIdx + 1)}/${year}`,
        period_end: `${pad(lastDay)}/${pad(monthIdx + 1)}/${year}`,
        loyer_nu: loyerNu,
        charges: chargesEUR,
        total: payment.received_amount,
        payment_date: new Date(payment.payment_date).toLocaleDateString('fr-FR'),
        generated_date: new Date().toLocaleDateString('fr-FR'),
      };

      const blob = await pdf(<QuittancePDF data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Quittance_${tenant.last_name}_${payment.month}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Quittance generation error:', err);
    }
    setGeneratingQuittance(null);
  };

  const t = {
    fr: {
      leaseInfo: 'Informations du bail',
      property: 'Propriété',
      room: 'Chambre',
      rent: 'Loyer mensuel',
      moveIn: 'Date d\'entrée',
      moveOut: 'Date de fin',
      deposit: 'Dépôt de garantie',
      dueDay: 'Jour de paiement',
      ofMonth: 'du mois',
      ongoing: 'Reconduction tacite',
      preavis: 'Préavis',
      preavisNone: 'Aucun',
      preavisActive: 'En cours — départ le',
      payments: 'Historique des paiements',
      month: 'Mois',
      expected: 'Attendu',
      received: 'Reçu',
      status: 'Statut',
      paid: 'Payé',
      partial: 'Partiel',
      pending: 'En attente',
      late: 'En retard',
      noPayments: 'Aucun paiement enregistré',
      myDocuments: 'Mes documents',
      signedDocuments: 'Documents signés',
      noDocuments: 'Aucun document disponible pour le moment.',
      download: 'Télécharger',
      viewBail: 'Voir mon bail',
      quittances: 'Quittances de loyer',
      noQuittances: 'Les quittances sont disponibles pour les mois payés.',
      downloadQuittance: 'PDF',
      generating: 'Génération...',
    },
    en: {
      leaseInfo: 'Lease Information',
      property: 'Property',
      room: 'Room',
      rent: 'Monthly rent',
      moveIn: 'Move-in date',
      moveOut: 'End date',
      deposit: 'Security deposit',
      dueDay: 'Payment day',
      ofMonth: 'of the month',
      ongoing: 'Automatic renewal',
      preavis: 'Notice',
      preavisNone: 'None',
      preavisActive: 'Active — departure on',
      payments: 'Payment History',
      month: 'Month',
      expected: 'Expected',
      received: 'Received',
      status: 'Status',
      paid: 'Paid',
      partial: 'Partial',
      pending: 'Pending',
      late: 'Late',
      noPayments: 'No payments recorded',
      myDocuments: 'My Documents',
      signedDocuments: 'Signed Documents',
      noDocuments: 'No documents available yet.',
      download: 'Download',
      viewBail: 'View my lease',
      quittances: 'Rent Receipts',
      noQuittances: 'Receipts are available for paid months.',
      downloadQuittance: 'PDF',
      generating: 'Generating...',
    },
  };

  const lang = t[language] || t.fr;

  const formatDate = (d: string) => new Date(d).toLocaleDateString(language === 'en' ? 'en-GB' : 'fr-FR');
  const formatCurrency = (amount: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      paid: 'bg-[#F5F2ED] text-[#44403C]',
      partial: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-gray-100 text-gray-600',
      late: 'bg-red-100 text-red-800',
    };
    const labels: Record<string, string> = {
      paid: lang.paid, partial: lang.partial, pending: lang.pending, late: lang.late,
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  const formatMonth = (monthStr: string) => {
    const parts = monthStr.split('-');
    if (parts.length === 2) {
      const monthIdx = parseInt(parts[1]) - 1;
      return `${months[monthIdx]} ${parts[0]}`;
    }
    return monthStr;
  };

  const getDocTypeLabel = (type: string) => {
    const dt = DOCUMENT_TYPES.find(d => d.value === type);
    return dt ? (language === 'en' ? dt.label_en : dt.label_fr) : type;
  };

  return (
    <div className="space-y-6">
      {/* Lease Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          {lang.leaseInfo}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between sm:flex-col sm:gap-1">
            <span className="text-gray-500">{lang.property}</span>
            <span className="font-medium">{tenant.property_name}</span>
          </div>
          <div className="flex justify-between sm:flex-col sm:gap-1">
            <span className="text-gray-500">{lang.room}</span>
            <span className="font-medium">{tenant.room_number}</span>
          </div>
          <div className="flex justify-between sm:flex-col sm:gap-1">
            <span className="text-gray-500">{lang.rent}</span>
            <span className="font-bold text-[#b8860b]">{formatCurrency(tenant.current_rent)}</span>
          </div>
          <div className="flex justify-between sm:flex-col sm:gap-1">
            <span className="text-gray-500">{lang.moveIn}</span>
            <span className="font-medium">{formatDate(tenant.move_in_date)}</span>
          </div>
          <div className="flex justify-between sm:flex-col sm:gap-1">
            <span className="text-gray-500">{lang.moveOut}</span>
            <span className="font-medium">{tenant.bail_end ? formatDate(tenant.bail_end) : lang.ongoing}</span>
          </div>
          {tenant.deposit_amount && (
            <div className="flex justify-between sm:flex-col sm:gap-1">
              <span className="text-gray-500">{lang.deposit}</span>
              <span className="font-medium">{formatCurrency(tenant.deposit_amount)}</span>
            </div>
          )}
          {tenant.due_day && (
            <div className="flex justify-between sm:flex-col sm:gap-1">
              <span className="text-gray-500">{lang.dueDay}</span>
              <span className="font-medium">{tenant.due_day} {lang.ofMonth}</span>
            </div>
          )}
          <div className="flex justify-between sm:flex-col sm:gap-1">
            <span className="text-gray-500">{lang.preavis}</span>
            <span className="font-medium">
              {tenant.preavis_status === 'active' && tenant.preavis_date
                ? `${lang.preavisActive} ${formatDate(tenant.preavis_date)}`
                : lang.preavisNone}
            </span>
          </div>
        </div>

        {/* Bail PDF link */}
        {bailUrl && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => downloadTenantDoc(bailUrl, `Bail_${tenant.last_name}.pdf`)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#b8860b] bg-[#b8860b]/10 rounded-lg hover:bg-[#b8860b]/20 transition-colors"
            >
              <FileText className="w-4 h-4" />
              {lang.viewBail}
            </button>
          </div>
        )}
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          {lang.payments}
        </h2>
        {paymentsLoading ? (
          <div className="animate-pulse text-sm text-gray-400">...</div>
        ) : payments.length === 0 ? (
          <p className="text-sm text-gray-500">{lang.noPayments}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-gray-500 font-medium">{lang.month}</th>
                  <th className="text-right py-2 text-gray-500 font-medium">{lang.expected}</th>
                  <th className="text-right py-2 text-gray-500 font-medium">{lang.received}</th>
                  <th className="text-right py-2 text-gray-500 font-medium">{lang.status}</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50">
                    <td className="py-3">{formatMonth(p.month)}</td>
                    <td className="py-3 text-right">{formatCurrency(p.expected_amount)}</td>
                    <td className="py-3 text-right">{p.received_amount ? formatCurrency(p.received_amount) : '—'}</td>
                    <td className="py-3 text-right">{statusBadge(p.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tenant Documents from DB */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          {lang.myDocuments}
        </h2>
        {docsDbLoading ? (
          <div className="animate-pulse text-sm text-gray-400">...</div>
        ) : tenantDocs.length === 0 && storageDocs.length === 0 ? (
          <p className="text-sm text-gray-500">{lang.noDocuments}</p>
        ) : (
          <div className="space-y-2">
            {/* Documents from tenant_documents table */}
            {tenantDocs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <FileText className="w-5 h-5 text-[#D4A574] flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.label}</p>
                    <p className="text-xs text-gray-400">
                      {getDocTypeLabel(doc.document_type)}
                      {doc.uploaded_at ? ` — ${new Date(doc.uploaded_at).toLocaleDateString(language === 'en' ? 'en-GB' : 'fr-FR')}` : ''}
                    </p>
                  </div>
                </div>
                {doc.file_url ? (
                  <button
                    onClick={() => downloadTenantDoc(doc.file_url!, doc.label)}
                    className="ml-3 px-3 py-1.5 text-xs font-medium text-[#b8860b] bg-[#b8860b]/10 rounded-lg hover:bg-[#b8860b]/20 transition-colors flex-shrink-0 inline-flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    {lang.download}
                  </button>
                ) : doc.external_url ? (
                  <a
                    href={doc.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-3 px-3 py-1.5 text-xs font-medium text-[#b8860b] bg-[#b8860b]/10 rounded-lg hover:bg-[#b8860b]/20 transition-colors flex-shrink-0 inline-flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {lang.download}
                  </a>
                ) : null}
              </div>
            ))}

            {/* Legacy documents from Storage (backward compat) */}
            {storageDocs.map((doc) => {
              const ext = doc.name.split('.').pop()?.toLowerCase() || '';
              const icon = ext === 'pdf' ? '📄' : ext === 'jpg' || ext === 'jpeg' || ext === 'png' ? '🖼️' : '📎';
              return (
                <div key={doc.name} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-lg flex-shrink-0">{icon}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                      <p className="text-xs text-gray-400">{formatSize(doc.metadata?.size)}{doc.updated_at ? ` — ${new Date(doc.updated_at).toLocaleDateString(language === 'en' ? 'en-GB' : 'fr-FR')}` : ''}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => downloadStorageDoc(doc.name)}
                    className="ml-3 px-3 py-1.5 text-xs font-medium text-[#b8860b] bg-[#b8860b]/10 rounded-lg hover:bg-[#b8860b]/20 transition-colors flex-shrink-0"
                  >
                    {lang.download}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quittances */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          {lang.quittances}
        </h2>
        {paymentsLoading ? (
          <div className="animate-pulse text-sm text-gray-400">...</div>
        ) : (() => {
          const paidPayments = payments.filter(p => p.status === 'paid' && p.received_amount);
          if (paidPayments.length === 0) {
            return <p className="text-sm text-gray-500">{lang.noQuittances}</p>;
          }
          return (
            <div className="space-y-2">
              {paidPayments.map((p) => (
                <div key={`q-${p.id}`} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{'\ud83d\udcc3'}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{formatMonth(p.month)}</p>
                      <p className="text-xs text-gray-400">{formatCurrency(p.received_amount || 0)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => generateQuittance(p)}
                    disabled={generatingQuittance === p.month}
                    className="px-3 py-1.5 text-xs font-medium text-[#b8860b] bg-[#b8860b]/10 rounded-lg hover:bg-[#b8860b]/20 transition-colors disabled:opacity-50"
                  >
                    {generatingQuittance === p.month ? lang.generating : lang.downloadQuittance}
                  </button>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
