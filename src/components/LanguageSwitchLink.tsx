import type { MouseEvent, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { languageSwitchTarget } from "@/lib/languageSwitch";

/**
 * Lien vers la version de la page dans l'autre langue (barre de navigation, pied de page).
 *
 * Avant le 08/10/2026 : <button onClick={toggleLanguage}>. Le comportement était bon pour les
 * visiteurs, mais Googlebot ne suit pas un bouton : aucune des 63 pages FR prérendues ne liait sa
 * version /en (audit GSC du 07/10/2026 : les 19 URL soumises non indexées sont toutes en /en/).
 * Un vrai <a href> ouvre le chemin d'exploration FR → EN (et EN → FR) sur toutes les pages ; le
 * clic simple garde la bascule SPA, le ctrl/cmd-clic ouvre un nouvel onglet.
 */
export function LanguageSwitchLink({ className, children }: { className?: string; children: ReactNode }) {
  const { language, toggleLanguage } = useLanguage();
  const { pathname } = useLocation();
  const { href, toggle } = languageSwitchTarget(pathname, language);
  // Le texte du lien (EN / FR, « English version » / « Version française ») est dans la langue cible.
  const targetLanguage = language === "en" ? "fr" : "en";

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // ctrl/cmd/shift/alt-clic ou autre bouton que le gauche : comportement natif (nouvel onglet…).
    if (!toggle || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    toggleLanguage(); // garde query, hash et position de lecture (LanguageContext)
  };

  return (
    <a href={href} hrefLang={targetLanguage} lang={targetLanguage} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
