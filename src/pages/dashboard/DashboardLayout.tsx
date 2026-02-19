import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const ADMIN_EMAILS = ['jerome@lavillacoliving.com', 'fanny@lavillacoliving.com'];

const TABS = [
  { id: 'loyers', label: 'Suivi Loyers', icon: '💰', path: '/dashboard/loyers' },
  { id: 'locataires', label: 'Locataires', icon: '👥', path: '/dashboard/locataires' },
  { id: 'depenses', label: 'Dépenses', icon: '📊', path: '/dashboard/depenses' },
  { id: 'maintenance', label: 'Maintenance', icon: '🔧', path: '/dashboard/maintenance' },
  { id: 'prospects', label: 'Prospects', icon: '🎯', path: '/dashboard/prospects' },
];

export default function DashboardLayout() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && ADMIN_EMAILS.includes(user.email || '')) {
        setIsAdmin(true);
      } else {
        navigate('/');
      }
      setLoading(false);
    };
    checkAdmin();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#FAF8F5' }}>
        <p style={{ color: '#b8860b', fontSize: '18px' }}>Chargement...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  const activeTab = TABS.find(t => location.pathname.startsWith(t.path))?.id || 'loyers';

  return (
    <div style={{ background: '#FAF8F5', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        background: '#1a1a2e', color: '#fff', padding: '16px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', color: '#b8860b' }}>La Villa — Tableau de Bord</h1>
          <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>Gestion locative</p>
        </div>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: '1px solid #555', color: '#aaa', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
        >
          ← Site
        </button>
      </header>

      {/* Tab Navigation */}
      <nav style={{
        display: 'flex', gap: '4px', padding: '8px 24px', background: '#1a1a2e',
        borderBottom: '2px solid #b8860b', overflowX: 'auto'
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            style={{
              padding: '10px 16px', border: 'none', borderRadius: '8px 8px 0 0',
              cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap',
              background: activeTab === tab.id ? '#b8860b' : 'transparent',
              color: activeTab === tab.id ? '#fff' : '#aaa',
              fontWeight: activeTab === tab.id ? 600 : 400,
            }}
          >
            <span style={{ marginRight: '6px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
