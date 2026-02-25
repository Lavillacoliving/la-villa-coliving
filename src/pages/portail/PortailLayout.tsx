import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LoginForm } from '@/components/custom/LoginForm';
import { useTenant } from '@/hooks/useTenant';
import { Home, FileText, MessageSquare, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const tabs: { path: string; icon: LucideIcon; labelFr: string; labelEn: string }[] = [
  { path: '/portail/ma-maison', icon: Home, labelFr: 'Ma Maison', labelEn: 'My Home' },
  { path: '/portail/mon-bail', icon: FileText, labelFr: 'Mon Bail', labelEn: 'My Lease' },
  { path: '/portail/mes-demandes', icon: MessageSquare, labelFr: 'Mes Demandes', labelEn: 'My Requests' },
  { path: '/portail/communaute', icon: Users, labelFr: 'Communauté', labelEn: 'Community' },
];

export function PortailLayout() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { language } = useLanguage();
  const { tenant, loading: tenantLoading } = useTenant();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect /portail to /portail/ma-maison
  useEffect(() => {
    if (location.pathname === '/portail' || location.pathname === '/portail/') {
      navigate('/portail/ma-maison', { replace: true });
    }
  }, [location.pathname, navigate]);

  const t = {
    fr: {
      title: 'Portail Locataire',
      subtitle: 'Bienvenue dans ton espace La Villa Coliving',
      loading: 'Chargement...',
      noTenant: 'Aucun profil locataire trouvé pour cette adresse email. Si tu es locataire, contacte-nous.',
      logout: 'Se déconnecter',
      contact: 'Une question ? Contacte-nous à',
    },
    en: {
      title: 'Tenant Portal',
      subtitle: 'Welcome to your La Villa Coliving space',
      loading: 'Loading...',
      noTenant: 'No tenant profile found for this email address. If you are a tenant, please contact us.',
      logout: 'Sign out',
      contact: 'Any questions? Contact us at',
    },
  };

  const lang = t[language] || t.fr;

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

  if (tenantLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-pulse text-lg text-gray-500">{lang.loading}</div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <img
              src="/logos/NEW Logo La Villa-14.png"
              alt="La Villa Coliving"
              className="h-14 w-auto"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{lang.title}</h1>
              <p className="text-gray-500 mt-1 text-sm">{lang.subtitle}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">{tenant.first_name} {tenant.last_name}</p>
            <p className="text-xs text-gray-400">{tenant.property_name} — {language === 'fr' ? 'Chambre' : 'Room'} {tenant.room_number}</p>
            <button onClick={signOut} className="text-xs text-[#b8860b] hover:underline mt-1">
              {lang.logout}
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-5xl mx-auto px-4 mb-6">
        <div className="flex gap-1 bg-white rounded-xl shadow-sm border border-gray-100 p-1 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path || location.pathname.startsWith(tab.path + '/');
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex-1 justify-center ${
                  isActive
                    ? 'bg-[#b8860b] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{language === 'en' ? tab.labelEn : tab.labelFr}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-5xl mx-auto px-4">
        <Outlet context={{ tenant, language }} />
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto px-4 mt-12 text-center text-sm text-gray-500">
        <p>{lang.contact} <a href="mailto:contact@lavillacoliving.com" className="text-[#b8860b] hover:underline">contact@lavillacoliving.com</a></p>
      </div>
    </div>
  );
}
