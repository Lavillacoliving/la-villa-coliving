import type { Language } from "@/i18n/translations";

// Routes privées/techniques jamais préfixées par /en (pas de version EN routée).
const EXCLUDED_PREFIXES = ["/portail", "/dashboard", "/reset-password", "/mon-espace"];

/** Route privée/technique sans miroir /en (portail, dashboard…). */
export function isExcludedPath(pathname: string): boolean {
  return EXCLUDED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

const isExcluded = isExcludedPath;

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
  return (pathname === "/" ? "/en" : `/en${pathname}`) + suffix;
}

/**
 * Chemin miroir dans l'autre langue (/x ↔ /en/x) — utilisé par le toggle de
 * langue. Les routes privées n'ont pas de miroir et sont rendues telles quelles.
 */
export function mirrorPath(pathname: string): string {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3) || "/";
  if (isExcluded(pathname)) return pathname;
  return pathname === "/" ? "/en" : `/en${pathname}`;
}
