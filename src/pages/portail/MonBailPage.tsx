import { useOutletContext } from 'react-router-dom';
import type { TenantInfo } from '@/hooks/useTenant';
import { usePayments } from '@/hooks/usePayments';

interface PortailContext {
  tenant: TenantInfo;
  language: 'fr' | 'en';
}

const MONTHS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function MonBailPage() {
  const { tenant, language } = useOutletContext<PortailContext>();
  const { payments, loading: paymentsLoading } = usePayments(tenant.id);

  const months = language === 'en' ? MONTHS_EN : MONTHS_FR;

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
      documents: 'Documents signés',
      docComingSoon: 'Tes documents seront bientôt disponibles ici (bail, état des lieux, attestations).',
      quittances: 'Quittances de loyer',
      quittComingSoon: 'La génération automatique de quittances arrive prochainement.',
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
      documents: 'Signed Documents',
      docComingSoon: 'Your documents will be available here soon (lease, inventory, certificates).',
      quittances: 'Rent Receipts',
      quittComingSoon: 'Automatic rent receipt generation coming soon.',
    },
  };

  const lang = t[language] || t.fr;

  const formatDate = (d: string) => new Date(d).toLocaleDateString(language === 'en' ? 'en-GB' : 'fr-FR');
  const formatCurrency = (amount: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      paid: 'bg-green-100 text-green-800',
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
    // month format: "YYYY-MM"
    const parts = monthStr.split('-');
    if (parts.length === 2) {
      const monthIdx = parseInt(parts[1]) - 1;
      return `${months[monthIdx]} ${parts[0]}`;
    }
    return monthStr;
  };

  return (
    <div className="space-y-6">
      {/* Lease Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-xl">📋</span> {lang.leaseInfo}
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
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-xl">💰</span> {lang.payments}
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

      {/* Documents placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-xl">📄</span> {lang.documents}
        </h2>
        <p className="text-sm text-gray-500">{lang.docComingSoon}</p>
      </div>

      {/* Quittances placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-xl">🧾</span> {lang.quittances}
        </h2>
        <p className="text-sm text-gray-500">{lang.quittComingSoon}</p>
      </div>
    </div>
  );
}
