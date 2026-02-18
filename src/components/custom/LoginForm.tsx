import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const t = {
  fr: {
    title: 'Mon Espace',
    subtitle: 'Connecte-toi avec ton email',
    email: 'Adresse email',
    emailPlaceholder: 'ton.email@exemple.com',
    submit: 'Recevoir le lien de connexion',
    sending: 'Envoi en cours...',
    success: 'Un lien de connexion a été envoyé à ton adresse email. Vérifie ta boîte de réception.',
    error: 'Une erreur est survenue. Vérifie ton email et réessaye.',
    note: 'Utilise l\'email renseigné dans ton bail La Villa Coliving.',
  },
  en: {
    title: 'Tenant Space',
    subtitle: 'Sign in with your tenant email',
    email: 'Email address',
    emailPlaceholder: 'your.email@example.com',
    submit: 'Send login link',
    sending: 'Sending...',
    success: 'A login link has been sent to your email address. Check your inbox.',
    error: 'An error occurred. Check your email and try again.',
    note: 'Use the email registered in your La Villa Coliving lease.',
  },
};

export function LoginForm() {
  const { signInWithMagicLink } = useAuth();
  const { language } = useLanguage();
  const lang = t[language] || t.fr;

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const { error: authError } = await signInWithMagicLink(email);

    setLoading(false);
    if (authError) {
      setError(true);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#b8860b]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏡</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{lang.title}</h1>
            <p className="text-sm text-gray-500 mt-2">{lang.subtitle}</p>
          </div>

          {sent ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✉️</span>
              </div>
              <p className="text-sm text-green-700">{lang.success}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {lang.email}
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={lang.emailPlaceholder}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b8860b]/30 focus:border-[#b8860b] outline-none transition text-sm"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">{lang.error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#b8860b] text-white rounded-lg font-medium hover:bg-[#a0750a] transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? lang.sending : lang.submit}
              </button>

              <p className="text-xs text-gray-400 text-center mt-4">{lang.note}</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
