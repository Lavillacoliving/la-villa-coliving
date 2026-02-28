import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase will auto-detect the recovery token in the URL hash
    // and fire PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'PASSWORD_RECOVERY') {
          setReady(true);
        }
      }
    );
    // Also check if we already have a session (token was already processed)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setBusy(false);
      return;
    }
    setSuccess(true);
    setBusy(false);
  };

  const S = {
    wrapper: {
      display: 'flex' as const,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      minHeight: '100vh',
      background: '#FAF8F5',
      fontFamily: "'Inter', -apple-system, sans-serif",
    },
    card: {
      background: '#fff',
      padding: '40px',
      borderRadius: '16px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      width: '420px',
      maxWidth: '90vw',
      textAlign: 'center' as const,
    },
    logo: {
      width: '160px',
      margin: '0 auto 20px',
      display: 'block',
    },
    title: {
      color: '#1a1a2e',
      fontSize: '22px',
      fontWeight: 700,
      marginBottom: '8px',
    },
    subtitle: {
      color: '#888',
      fontSize: '14px',
      marginBottom: '28px',
    },
    input: {
      width: '100%',
      padding: '12px',
      marginBottom: '12px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '15px',
      boxSizing: 'border-box' as const,
    },
    btn: {
      width: '100%',
      padding: '12px',
      background: '#b8860b',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: 600,
      cursor: 'pointer',
    },
    err: { color: '#e74c3c', fontSize: '13px', marginBottom: '12px' },
    successBox: {
      background: '#f0fdf4',
      border: '1px solid #bbf7d0',
      borderRadius: '12px',
      padding: '24px',
    },
    successText: { color: '#166534', fontSize: '15px', marginBottom: '16px' },
    link: {
      display: 'inline-block',
      marginTop: '8px',
      padding: '10px 24px',
      background: '#b8860b',
      color: '#fff',
      borderRadius: '8px',
      textDecoration: 'none',
      fontWeight: 600,
      fontSize: '14px',
    },
  };

  // Success state
  if (success) {
    return (
      <div style={S.wrapper}>
        <div style={S.card}>
          <img src="/logos/NEW Logo La Villa-18.png" alt="La Villa Coliving" style={S.logo} />
          <div style={S.successBox}>
            <p style={S.successText}>Mot de passe modifié avec succès !</p>
            <a href="/dashboard" style={S.link}>Accéder au tableau de bord</a>
          </div>
        </div>
      </div>
    );
  }

  // Waiting for token to be processed
  if (!ready) {
    return (
      <div style={S.wrapper}>
        <div style={S.card}>
          <img src="/logos/NEW Logo La Villa-18.png" alt="La Villa Coliving" style={S.logo} />
          <p style={{ color: '#b8860b', fontSize: '16px' }}>Vérification du lien en cours...</p>
          <p style={{ color: '#888', fontSize: '13px', marginTop: '12px' }}>
            Si cette page ne change pas, le lien a peut-être expiré. Demande un nouveau lien de réinitialisation.
          </p>
        </div>
      </div>
    );
  }

  // Reset form
  return (
    <div style={S.wrapper}>
      <form onSubmit={handleSubmit} style={S.card}>
        <img src="/logos/NEW Logo La Villa-18.png" alt="La Villa Coliving" style={S.logo} />
        <h2 style={S.title}>Nouveau mot de passe</h2>
        <p style={S.subtitle}>Choisis un nouveau mot de passe pour ton compte.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nouveau mot de passe"
          required
          style={S.input}
          autoFocus
        />
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirmer le mot de passe"
          required
          style={S.input}
        />
        {error && <p style={S.err}>{error}</p>}
        <button
          type="submit"
          disabled={busy}
          style={{ ...S.btn, opacity: busy ? 0.6 : 1 }}
        >
          {busy ? 'Modification en cours...' : 'Modifier le mot de passe'}
        </button>
      </form>
    </div>
  );
}
