import { useState, useEffect } from 'react';
import { ToastProvider } from '@/components/ui/Toast';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const ADMIN_EMAILS = ['jerome@lavillacoliving.com', 'fanny@lavillacoliving.com'];

const TABS = [
  { id: 'loyers', label: 'Suivi Loyers', path: '/dashboard/loyers' },
  { id: 'locataires', label: 'Locataires', path: '/dashboard/locataires' },
  { id: 'depenses', label: 'Dépenses', path: '/dashboard/depenses' },
  { id: 'maintenance', label: 'Maintenance', path: '/dashboard/maintenance' },
  { id: 'prospects', label: 'Prospects', path: '/dashboard/prospects' },
  { id: 'roadmap', label: 'Roadmap', path: '/dashboard/roadmap' },
  { id: 'documents', label: 'Documents', path: '/dashboard/documents' },
  { id: 'events', label: 'Événements', path: '/dashboard/events' },
  { id: 'maisons', label: 'Maisons', path: '/dashboard/maisons' },
  { id: 'nouveau-bail', label: 'Nouveau Bail', path: '/dashboard/nouveau-bail' },
];

type AuthStep = 'loading' | 'login' | 'mfa-enroll' | 'mfa-verify' | 'ready';

export default function DashboardLayout() {
  const [step, setStep] = useState<AuthStep>('loading');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  // MFA
  const [totpCode, setTotpCode] = useState('');
  const [qrUri, setQrUri] = useState('');
  const [factorId, setFactorId] = useState('');
  const [enrollSecret, setEnrollSecret] = useState('');

  const nav = useNavigate();
  const loc = useLocation();

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
      setStep('login');
      return;
    }
    // Check MFA assurance level
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (!aal) { setStep('ready'); return; } // MFA not enabled on project → skip

    if (aal.currentLevel === 'aal2') {
      setStep('ready');
      return;
    }
    // aal1 — need to check if user has enrolled factors
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const totp = factors?.totp?.find(f => f.status === 'verified');
    if (totp) {
      // Has enrolled factor but needs verification this session
      setFactorId(totp.id);
      setStep('mfa-verify');
    } else {
      // No factor enrolled yet → enroll
      await startEnroll();
    }
  };

  const startEnroll = async () => {
    setErr('');
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'La Villa Admin' });
    if (error) { setErr(error.message); return; }
    if (data) {
      setQrUri(data.totp.qr_code);
      setEnrollSecret(data.totp.secret);
      setFactorId(data.id);
      setStep('mfa-enroll');
    }
  };

  const verifyMFA = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr('');
    const { data: challenge, error: cErr } = await supabase.auth.mfa.challenge({ factorId });
    if (cErr) { setErr(cErr.message); setBusy(false); return; }
    const { error: vErr } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code: totpCode,
    });
    if (vErr) { setErr('Code invalide. Réessaie.'); setBusy(false); setTotpCode(''); return; }
    setStep('ready');
    setBusy(false);
  };

  useEffect(() => { checkAuth(); }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr('');
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    if (error) { setErr(error.message); setBusy(false); return; }
    setBusy(false);
    await checkAuth();
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setStep('login');
    setTotpCode(''); setQrUri(''); setFactorId('');
  };

  const S = {
    wrapper: { display: 'flex' as const, justifyContent: 'center' as const, alignItems: 'center' as const, minHeight: '100vh', background: '#FAF8F5' },
    card: { background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', width: '400px', textAlign: 'center' as const },
    input: { width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box' as const },
    btn: { width: '100%', padding: '12px', background: '#b8860b', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' },
    err: { color: '#e74c3c', fontSize: '13px', marginBottom: '12px' },
  };

  // Loading
  if (step === 'loading') return (
    <div style={S.wrapper}><p style={{ color: '#b8860b', fontSize: '18px' }}>Chargement...</p></div>
  );

  // Login form
  if (step === 'login') return (
    <div style={S.wrapper}>
      <form onSubmit={login} style={S.card}>
        <h2 style={{ color: '#1a1a2e', marginBottom: '8px' }}>Tableau de Bord</h2>
        <p style={{ color: '#888', marginBottom: '24px', fontSize: '14px' }}>Connexion administrateur</p>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required style={S.input} />
        <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Mot de passe" required style={S.input} />
        {err && <p style={S.err}>{err}</p>}
        <button type="submit" disabled={busy} style={{ ...S.btn, opacity: busy ? 0.6 : 1 }}>{busy ? 'Connexion...' : 'Se connecter'}</button>
      </form>
    </div>
  );

  // MFA Enrollment (first time — QR code)
  if (step === 'mfa-enroll') return (
    <div style={S.wrapper}>
      <form onSubmit={verifyMFA} style={{ ...S.card, width: '440px' }}>
        <h2 style={{ color: '#1a1a2e', marginBottom: '8px' }}>🔒 Activer la double authentification</h2>
        <p style={{ color: '#888', marginBottom: '16px', fontSize: '14px' }}>
          Scanne ce QR code avec Google Authenticator ou Authy, puis entre le code à 6 chiffres.
        </p>
        {qrUri && <img src={qrUri} alt="QR Code TOTP" style={{ width: '200px', height: '200px', margin: '0 auto 16px', display: 'block', borderRadius: '8px' }} />}
        {enrollSecret && (
          <p style={{ fontSize: '11px', color: '#aaa', marginBottom: '16px', wordBreak: 'break-all' }}>
            Clé manuelle : <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>{enrollSecret}</code>
          </p>
        )}
        <input
          type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6}
          value={totpCode} onChange={e => setTotpCode(e.target.value.replace(/\D/g, ''))}
          placeholder="Code à 6 chiffres" required autoFocus
          style={{ ...S.input, textAlign: 'center', fontSize: '24px', letterSpacing: '8px', fontWeight: 700 }}
        />
        {err && <p style={S.err}>{err}</p>}
        <button type="submit" disabled={busy || totpCode.length !== 6} style={{ ...S.btn, opacity: (busy || totpCode.length !== 6) ? 0.6 : 1 }}>
          {busy ? 'Vérification...' : 'Activer le 2FA'}
        </button>
        <button type="button" onClick={logout} style={{ marginTop: '12px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '13px' }}>Annuler</button>
      </form>
    </div>
  );

  // MFA Verify (returning user)
  if (step === 'mfa-verify') return (
    <div style={S.wrapper}>
      <form onSubmit={verifyMFA} style={S.card}>
        <h2 style={{ color: '#1a1a2e', marginBottom: '8px' }}>🔒 Vérification 2FA</h2>
        <p style={{ color: '#888', marginBottom: '24px', fontSize: '14px' }}>
          Entre le code à 6 chiffres de ton app d'authentification.
        </p>
        <input
          type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6}
          value={totpCode} onChange={e => setTotpCode(e.target.value.replace(/\D/g, ''))}
          placeholder="000000" required autoFocus
          style={{ ...S.input, textAlign: 'center', fontSize: '24px', letterSpacing: '8px', fontWeight: 700 }}
        />
        {err && <p style={S.err}>{err}</p>}
        <button type="submit" disabled={busy || totpCode.length !== 6} style={{ ...S.btn, opacity: (busy || totpCode.length !== 6) ? 0.6 : 1 }}>
          {busy ? 'Vérification...' : 'Vérifier'}
        </button>
        <button type="button" onClick={logout} style={{ marginTop: '12px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '13px' }}>Se déconnecter</button>
      </form>
    </div>
  );

  // Dashboard (ready)
  const activeTab = TABS.find(t => loc.pathname.startsWith(t.path))?.id || 'loyers';

  return (
    <ToastProvider>
    <div style={{ background: '#FAF8F5', minHeight: '100vh' }}>
      <header style={{ background: '#1a1a2e', color: '#fff', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', color: '#b8860b' }}>La Villa — Tableau de Bord</h1>
          <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>Gestion locative</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => nav('/')} style={{ background: 'none', border: '1px solid #555', color: '#aaa', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Site</button>
          <button onClick={logout} style={{ background: '#c0392b', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Logout</button>
        </div>
      </header>

      <nav style={{ display: 'flex', gap: '4px', padding: '8px 24px', background: '#1a1a2e', borderBottom: '2px solid #b8860b', overflowX: 'auto' }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => nav(tab.path)} style={{ padding: '10px 16px', border: 'none', borderRadius: '8px 8px 0 0', cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap', background: activeTab === tab.id ? '#b8860b' : 'transparent', color: activeTab === tab.id ? '#fff' : '#aaa', fontWeight: activeTab === tab.id ? 600 : 400 }}>{tab.label}</button>
        ))}
      </nav>

      <main style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
    </ToastProvider>
  );
}
