import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { logAudit } from '@/lib/auditLog';

/** Émetteur du code (otpauth) : le domaine aide l'app Mots de passe à rattacher le code au mot de passe du site. */
export const TOTP_ISSUER = 'lavillacoliving.com';

type Enrollment = { id: string; qr: string; uri: string; secret: string };

/**
 * Remplace le code de connexion (TOTP) du compte connecté : nouveau code rangé dans l'app Mots de
 * passe d'Apple (Safari le remplit après Face ID / Touch ID grâce à autocomplete="one-time-code"),
 * puis retrait de l'ancien code une fois le nouveau validé. Session aal2 requise (dashboard ouvert).
 */
export default function TotpReplacePanel({ onClose }: { onClose: () => void }) {
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  // Nouveau code créé mais pas encore validé : retiré si on ferme le panneau
  const pending = useRef<string | null>(null);

  const close = useCallback(() => {
    if (pending.current) void supabase.auth.mfa.unenroll({ factorId: pending.current });
    onClose();
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  const start = async () => {
    setBusy(true); setErr('');
    // Nom unique obligatoire (Supabase refuse deux codes du même nom)
    const stamp = new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'medium' });
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp', friendlyName: `La Villa Admin · ${stamp}`, issuer: TOTP_ISSUER });
    setBusy(false);
    if (error) { setErr(error.message); return; }
    pending.current = data.id;
    setEnrollment({ id: data.id, qr: data.totp.qr_code, uri: data.totp.uri, secret: data.totp.secret });
  };

  const confirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollment) return;
    setBusy(true); setErr('');
    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: enrollment.id, code });
    if (error) { setBusy(false); setCode(''); setErr('Code invalide. Réessaie avec le code affiché dans Mots de passe.'); return; }
    pending.current = null;
    await logAudit('create', 'mfa_factor', enrollment.id, { factor_type: 'totp', issuer: TOTP_ISSUER });
    // L'ancien code (Google Authenticator) ne sert plus. S'il ne part pas, la connexion accepte les deux.
    const { data } = await supabase.auth.mfa.listFactors();
    for (const f of (data?.totp ?? []).filter(f => f.id !== enrollment.id)) {
      const { error: uErr } = await supabase.auth.mfa.unenroll({ factorId: f.id });
      if (!uErr) await logAudit('delete', 'mfa_factor', f.id, { factor_type: 'totp', friendly_name: f.friendly_name });
    }
    setBusy(false); setDone(true);
  };

  const p = { margin: '0 0 12px', color: '#555', fontSize: '14px', textAlign: 'left' as const };
  const btn = { width: '100%', padding: '12px', background: '#b8860b', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', opacity: busy ? 0.6 : 1 };

  return (
    <div onClick={close} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 1000 }}>
      <div role="dialog" aria-modal="true" aria-labelledby="code-panel-title" onClick={e => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: '16px', padding: '28px', width: '440px', maxWidth: '100%', maxHeight: '100%', overflowY: 'auto', boxSizing: 'border-box', boxShadow: '0 4px 24px rgba(0,0,0,0.15)', textAlign: 'center' }}>
        <h2 id="code-panel-title" style={{ margin: '0 0 12px', color: '#1a1a2e', fontSize: '20px' }}>Code de connexion</h2>

        {done ? (
          <>
            <p style={p}>C'est fait. Ton code est rangé dans Mots de passe : à la prochaine connexion, Safari le proposera après Face ID ou Touch ID.</p>
            <p style={p}>L'ancien code Google Authenticator ne marche plus : tu peux supprimer l'entrée La Villa de Google Authenticator.</p>
            <button type="button" onClick={onClose} style={btn}>Fermer</button>
          </>
        ) : !enrollment ? (
          <>
            <p style={p}>Range ton code de connexion dans l'app Mots de passe d'Apple : à la prochaine connexion, Safari le remplira après Face ID ou Touch ID, plus besoin de le recopier.</p>
            <p style={p}>L'ancien code Google Authenticator sera désactivé dès que le nouveau sera validé.</p>
            {err && <p style={{ color: '#e74c3c', fontSize: '13px', marginBottom: '12px' }}>{err}</p>}
            <button type="button" onClick={start} disabled={busy} style={btn}>{busy ? 'Patiente...' : 'Créer un nouveau code'}</button>
          </>
        ) : (
          <form onSubmit={confirm}>
            <p style={p}>1. Sur ton iPhone ou ton Mac, touche « Ajouter dans Mots de passe ». Depuis un autre écran, scanne le QR code avec l'appareil photo de l'iPhone.</p>
            <a href={enrollment.uri} style={{ display: 'block', margin: '0 0 12px', padding: '10px', border: '1px solid #b8860b', borderRadius: '8px', color: '#b8860b', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>
              Ajouter dans Mots de passe
            </a>
            <img src={enrollment.qr} alt="QR code du code de connexion" style={{ width: '180px', height: '180px', margin: '0 auto 8px', display: 'block' }} />
            <p style={{ fontSize: '11px', color: '#aaa', margin: '0 0 16px', wordBreak: 'break-all' }}>
              Clé manuelle : <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>{enrollment.secret}</code>
            </p>
            <p style={p}>2. Si l'app le demande, rattache le code à ton mot de passe lavillacoliving.com.</p>
            <p style={p}>3. Entre le code à 6 chiffres affiché dans Mots de passe.</p>
            <input
              type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6} autoComplete="one-time-code"
              value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000" required className="dash-fs-keep"
              style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box', textAlign: 'center', fontSize: '24px', letterSpacing: '8px', fontWeight: 700 }}
            />
            {err && <p style={{ color: '#e74c3c', fontSize: '13px', marginBottom: '12px' }}>{err}</p>}
            <button type="submit" disabled={busy || code.length !== 6} style={{ ...btn, opacity: (busy || code.length !== 6) ? 0.6 : 1 }}>
              {busy ? 'Vérification...' : 'Valider le nouveau code'}
            </button>
          </form>
        )}

        {!done && <button type="button" onClick={close} style={{ display: 'block', margin: '12px auto 0', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '13px' }}>Annuler</button>}
      </div>
    </div>
  );
}
