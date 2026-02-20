import { useState } from 'react';
import { Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const t = {
  fr: {
    title: 'Mon Espace',
    subtitle: 'Connectez-vous avec votre email',
    email: 'Adresse email',
    emailPlaceholder: 'votre.email@exemple.com',
    submit: 'Recevoir le lien de connexion',
    sending: 'Envoi en cours...',
    success: 'Un lien de connexion a été envoyé à votre adresse email. Vérifiez votre boîte de réception.',
    error: 'Une erreur est survenue. Vérifiez votre email et réessayez.',
    note: 'Utilisez l\'email renseigné dans votre bail La Villa Coliving.',
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
    <div className="min-h-screen flex items-center justify-center pt-20 px-4 bg-[#FAF9F6]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-[#E7E5E4] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8">
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#F5F2ED] rounded-xl flex items-center justify-center mx-auto mb-4">
              <Home className="w-7 h-7 text-[#44403C]" />
            </div>
            <h1 className="text-2xl font-bold text-[#1C1917]">{lang.title}</h1>
            <p className="text-sm text-[#78716C] mt-2">{lang.subtitle}</p>
          </div>

          {sent ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-[#F5F2ED] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Home className="w-6 h-6 text-[#44403C]" />
              </div>
              <p className="text-sm text-[#44403C]">{lang.success}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#1C1917] mb-1">
                  {lang.email}
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={lang.emailPlaceholder}
                  className="w-full px-4 py-3 border border-[#E7E5E4] rounded-lg focus:ring-2 focus:ring-[#44403C]/30 focus:border-[#44403C] outline-none transition text-sm"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">{lang.error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#44403C] text-white rounded-lg font-semibold hover:bg-[#57534E] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#44403C] focus-visible:ring-offset-2"
              >
                {loading ? lang.sending : lang.submit}
              </button>

              <p className="text-xs text-[#78716C] text-center mt-4">{lang.note}</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
