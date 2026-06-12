import React, { createContext, useContext, useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { translations, type Language, type Translations } from '@/i18n/translations';
import { mirrorPath } from '@/lib/localizedPath';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// L'URL est la SOURCE DE VÉRITÉ de la langue : /en/* → anglais, sinon français.
// (Avant : state initialisé une fois au chargement, jamais resynchronisé — le
// toggle changeait les textes sans changer l'URL : reload/partage retombaient
// en français et GA4 attribuait les pages FR aux visiteurs EN.)
function languageFromPathname(pathname: string): Language {
  return /^\/en(\/|$)/.test(pathname) ? 'en' : 'fr';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const language = languageFromPathname(location.pathname);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Changer de langue = naviguer vers l'URL miroir (/x ↔ /en/x), en préservant
  // query et hash. Les slugs étant identiques FR/EN, le miroir existe toujours.
  const setLanguage = useCallback(
    (lang: Language) => {
      if (lang === languageFromPathname(location.pathname)) return;
      // Le changement de route démonte/remonte le composant de page : la hauteur
      // du document s'effondre un instant et le navigateur ramène le scroll à 0.
      // On restaure la position de lecture une fois la page miroir peinte.
      const scrollY = window.scrollY;
      navigate(mirrorPath(location.pathname) + location.search + location.hash);
      // 'instant' : la page a scroll-behavior:smooth — une restauration animée
      // serait interrompue par le clamp du remount et repartirait de 0.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => window.scrollTo({ top: scrollY, behavior: "instant" })),
      );
    },
    [navigate, location.pathname, location.search, location.hash],
  );

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  }, [language, setLanguage]);

  const value = useMemo(
    () => ({ language, setLanguage, t: translations[language], toggleLanguage }),
    [language, setLanguage, toggleLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
