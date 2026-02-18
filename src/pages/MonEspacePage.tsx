import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { LoginForm } from '@/components/custom/LoginForm';

interface TenantInfo {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  room_number: string;
  current_rent: number;
  move_in_date: string;
  move_out_date: string | null;
  deposit_amount: number | null;
  due_day: number | null;
  property_name: string;
  property_address: string;
}

interface RentPayment {
  id: string;
  month: string;

  expected_amount: number;
  received_amount: number | null;
  status: string;
  payment_date: string | null;
}

const t = {
  fr: {
    title: 'Mon Espace',
    subtitle: 'Bienvenue dans votre espace locataire La Villa Coliving',
    loading: 'Chargement...',
    noTenant: 'Aucun profil locataire trouvé pour cette adresse email. Si vous êtes locataire, contactez-nous.',
    logout: 'Se déconnecter',
    myHome: 'Ma Maison',
    property: 'Propriété',
    room: 'Chambre',
    address: 'Adresse',
    myLease: 'Mon Bail',
    rent: 'Loyer mensuel',
    moveIn: 'Date d\'entrée',
    moveOut: 'Date de sortie',
    deposit: 'Dépôt de garantie',
    dueDay: 'Jour de paiement',
    ofMonth: 'du mois',
    ongoing: 'En cours',
    myPayments: 'Mes Paiements',
    month: 'Mois',
    expected: 'Attendu',
    received: 'Reçu',
    status: 'Statut',
    paid: 'Payé',
    partial: 'Partiel',
    pending: 'En attente',
    late: 'En retard',
    noPayments: 'Aucun paiement enregistré',
    contact: 'Contact',
    contactText: 'Une question ? Contactez-nous à',
  },
  en: {
    title: 'My Space',
    subtitle: 'Welcome to your La Villa Coliving tenant space',
    loading: 'Loading...',
    noTenant: 'No tenant profile found for this email address. If you are a tenant, please contact us.',
    logout: 'Sign out',
    myHome: 'My Home',
    property: 'Property',
    room: 'Room',
    address: 'Address',
    myLease: 'My Lease',
    rent: 'Monthly rent',
    moveIn: 'Move-in date',
    moveOut: 'Move-out date',
    deposit: 'Security deposit',
    dueDay: 'Payment day',
    ofMonth: 'of the month',
    ongoing: 'Ongoing',
    myPayments: 'My Payments',
    month: 'Month',
    expected: 'Expected',
    received: 'Received',
    status: 'Status',
    paid: 'Paid',
    partial: 'Partial',
    pending: 'Pending',
    late: 'Late',
    noPayments: 'No payments recorded',
    contact: 'Contact',
    contactText: 'Any questions? Contact us at',
  },
};

const MONTHS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function MonEspacePage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { language } = useLanguage();
  const lang = t[language] || t.fr;
  const months = language === 'en' ? MONTHS_EN : MONTHS_FR;

  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [payments, setPayments] = useState<RentPayment[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    async function fetchTenantData() {
      setDataLoading(true);

      // Fetch tenant with property info
      const { data: tenantData } = await supabase
        .from('tenants')
        .select(`
          id, first_name, last_name, email, phone, room_number,
          current_rent, move_in_date, move_out_date, deposit_amount, due_day,
          properties!inner(name, address)
        `)
        .eq('email', user!.email!)
        .eq('is_active', true)
        .single();

      if (tenantData) {
        const prop = (tenantData as any).properties;
        setTenant({
          ...tenantData,
          property_name: prop?.name || '',
          property_address: prop?.address || '',
        } as TenantInfo);

        // Fetch recent payments (last 12 months)
        const { data: paymentsData } = await supabase
          .from('payments')
          .select('id, month, expected_amount, received_amount, status, payment_date')
          .eq('tenant_id', tenantData.id)
          
          .order('month', { ascending: false })
          .limit(12);

        if (paymentsData) {
          setPayments(paymentsData as RentPayment[]);
        }
      }

      setDataLoading(false);
    }

    fetchTenantData();
  }, [user?.email]);

  // Not authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-pulse text-lg text-gray-500">{lang.loading}</div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  // Authenticated but loading data
  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-pulse text-lg text-gray-500">{lang.loading}</div>
      </div>
    );
  }

  // No tenant found
  if (!tenant) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">{lang.title}</h1>
          <p className="text-gray-600 mb-6">{lang.noTenant}</p>
          <p className="text-sm text-gray-500 mb-6">{user.email}</p>
          <button onClick={signOut} className="text-sm text-[#b8860b] hover:underline">
            {lang.logout}
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString(language === 'en' ? 'en-GB' : 'fr-FR');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      paid: 'bg-green-100 text-green-800',
      partial: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-gray-100 text-gray-600',
      late: 'bg-red-100 text-red-800',
    };
    const labels: Record<string, string> = {
      paid: lang.paid,
      partial: lang.partial,
      pending: lang.pending,
      late: lang.late,
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{lang.title}</h1>
            <p className="text-gray-500 mt-1">{lang.subtitle}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">{tenant.first_name} {tenant.last_name}</p>
            <button onClick={signOut} className="text-xs text-[#b8860b] hover:underline mt-1">
              {lang.logout}
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Ma Maison */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-xl">🏠</span> {lang.myHome}
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">{lang.property}</span>
                <span className="font-medium">{tenant.property_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{lang.room}</span>
                <span className="font-medium">{tenant.room_number}</span>
              </div>
              {tenant.property_address && (
                <div className="flex justify-between">
                  <span className="text-gray-500">{lang.address}</span>
                  <span className="font-medium text-right max-w-[60%]">{tenant.property_address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Mon Bail */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-xl">📋</span> {lang.myLease}
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">{lang.rent}</span>
                <span className="font-bold text-[#b8860b]">{formatCurrency(tenant.current_rent)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{lang.moveIn}</span>
                <span className="font-medium">{formatDate(tenant.move_in_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{lang.moveOut}</span>
                <span className="font-medium">{tenant.move_out_date ? formatDate(tenant.move_out_date) : lang.ongoing}</span>
              </div>
              {tenant.deposit_amount && (
                <div className="flex justify-between">
                  <span className="text-gray-500">{lang.deposit}</span>
                  <span className="font-medium">{formatCurrency(tenant.deposit_amount)}</span>
                </div>
              )}
              {tenant.due_day && (
                <div className="flex justify-between">
                  <span className="text-gray-500">{lang.dueDay}</span>
                  <span className="font-medium">{tenant.due_day} {lang.ofMonth}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mes Paiements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-xl">💰</span> {lang.myPayments}
          </h2>
          {payments.length === 0 ? (
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
                      <td className="py-3">{(() => { const [y, m] = p.month.split("-"); return months[parseInt(m) - 1] + " " + y; })()}</td>
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

        {/* Contact */}
        <div className="text-center text-sm text-gray-500">
          <p>{lang.contactText} <a href="mailto:contact@lavillacoliving.com" className="text-[#b8860b] hover:underline">contact@lavillacoliving.com</a></p>
        </div>
      </div>
    </div>
  );
}
