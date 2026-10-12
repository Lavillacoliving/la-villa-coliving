import type { Language } from "@/i18n/translations";

// Routes privées/techniques jamais préfixées par /en (pas de version EN routée).
const EXCLUDED_PREFIXES = ["/portail", "/dashboard", "/reset-password", "/mon-espace"];

/** Route privée/technique sans miroir /en (portail, dashboard…). */
export function isExcludedPath(pathname: string): boolean {
  return EXCLUDED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

const isExcluded = isExcludedPath;

// Exception à la règle « même slug FR/EN » (offre « Pose tes valises avant l'hiver », 06/10/2026) :
// /offre-hiver ↔ /en/winter-offer. Les deux sens sont dérivés de cette seule table ; App.tsx porte
// aussi des <Navigate> de secours (/winter-offer → /offre-hiver, /en/offre-hiver → /en/winter-offer).
const SLUG_FR_TO_EN: Record<string, string> = { "/offre-hiver": "/winter-offer" };
const SLUG_EN_TO_FR: Record<string, string> = Object.fromEntries(
  Object.entries(SLUG_FR_TO_EN).map(([fr, en]) => [en, fr]),
);
const toEnPath = (frPath: string): string => {
  const mapped = Object.prototype.hasOwnProperty.call(SLUG_FR_TO_EN, frPath) ? SLUG_FR_TO_EN[frPath] : frPath;
  return mapped === "/" ? "/en" : `/en${mapped}`;
};
const toFrPath = (enRest: string): string =>
  Object.prototype.hasOwnProperty.call(SLUG_EN_TO_FR, enRest) ? SLUG_EN_TO_FR[enRest] : enRest;

/**
 * Préfixe un chemin interne par /en quand la langue courante est l'anglais.
 * Idempotent (un chemin déjà en /en/* est rendu tel quel), préserve query et
 * hash, ignore les ancres, les URLs externes et les routes privées.
 * Les slugs blog sont identiques FR/EN : seul le préfixe change.
 */
export function localizePath(path: string, language: Language): string {
  if (language !== "en") return path;
  if (!path.startsWith("/")) return path; // ancre '#...', 'mailto:', URL externe…
  const match = path.match(/^([^?#]*)([?#].*)?$/);
  const pathname = match?.[1] ?? path;
  const suffix = match?.[2] ?? "";
  if (pathname === "/en" || pathname.startsWith("/en/")) return path;
  if (isExcluded(pathname)) return path;
  return toEnPath(pathname) + suffix;
}

/**
 * Chemin miroir dans l'autre langue (/x ↔ /en/x) — utilisé par le toggle de
 * langue. Les routes privées n'ont pas de miroir et sont rendues telles quelles.
 */
export function mirrorPath(pathname: string): string {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return toFrPath(pathname.slice(3) || "/");
  if (isExcluded(pathname)) return pathname;
  return toEnPath(pathname);
}
