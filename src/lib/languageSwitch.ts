import type { Language } from "@/i18n/translations";
import { mirrorPath } from "@/lib/localizedPath";
import { HREFLANG_NO_ALTERNATES } from "@/lib/siteLinks";

// Cible du lien de changement de langue (src/components/LanguageSwitchLink.tsx), lot A
// indexation du 08/10/2026. Le href est le chemin miroir SANS query ni hash : aucune variante
// paramétrée à explorer, et un attribut identique entre le prérendu et l'hydratation quelle que
// soit la query de la visite.

/** Route de prérendu du 404.html partagé (scripts/prerender.mjs, EXTRA_RENDER_ROUTES). */
const NOT_FOUND_RENDER_ROUTE = "/404";

/**
 * Le document affiché est-il le 404.html partagé ? Vercel le sert pour TOUTE URL inconnue : un
 * href calculé depuis le chemin y serait figé au prérendu (« /en/404 ») et faux partout. Au
 * prérendu, la route est /404 ; dans le navigateur, main.tsx note le chemin servi dans
 * __PRERENDER_STATE__.__not_found__ (repère data-not-found de NotFoundPage).
 */
function isSharedNotFoundDocument(pathname: string): boolean {
  if (pathname === NOT_FOUND_RENDER_ROUTE) return true;
  if (typeof window === "undefined") return false;
  const stash = (window as unknown as { __PRERENDER_STATE__?: Record<string, string> }).__PRERENDER_STATE__;
  return !!stash?.__not_found__ && stash.__not_found__ === pathname;
}

export interface LanguageSwitchTarget {
  href: string;
  /** true : le clic garde la bascule SPA (toggleLanguage). false : navigation native vers href. */
  toggle: boolean;
}

export function languageSwitchTarget(pathname: string, language: Language): LanguageSwitchTarget {
  const otherHome = language === "en" ? "/" : "/en";
  // 404 partagé : href constant, identique au prérendu sur toutes les URL inconnues. Le clic garde
  // la bascule actuelle (un article publié depuis le dashboard, pas encore prérendu, s'affiche
  // par-dessus ce 404 et a bien son miroir).
  if (isSharedNotFoundDocument(pathname)) return { href: otherHome, toggle: true };
  // Page sans équivalent dans l'autre langue : même table que les hreflang (SEO.tsx, siteLinks.ts).
  if (HREFLANG_NO_ALTERNATES.has(pathname)) return { href: otherHome, toggle: false };
  return { href: mirrorPath(pathname), toggle: true };
}
