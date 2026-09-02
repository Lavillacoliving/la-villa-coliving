import type { HouseKey } from "@/lib/availability";

/**
 * Contexte « maison » dérivé de l'URL (Lot A — A3/Q9, 02/09/2026).
 *
 * Les CTA de la nav et du footer sont communs à tout le site : sur une page maison, ils
 * étaient les seuls liens /candidature SANS `property_interest` (3 par page), alors que le
 * formulaire, l'Edge Function et le dashboard savent exploiter ce paramètre. Dérivé du
 * pathname (identique au prérendu et au premier rendu client) : aucun risque d'hydratation.
 */

const HOUSE_PATH_RE = /^(?:\/en)?\/(lavilla|leloft|lelodge)\/?$/;

/** `lavilla` | `leloft` | `lelodge` si le chemin est une page maison (FR ou EN), sinon null. */
export function houseSlugFromPath(pathname: string): HouseKey | null {
  const match = pathname.match(HOUSE_PATH_RE);
  return match ? (match[1] as HouseKey) : null;
}

/** Cible du CTA « Candidater » : contextualisée sur une page maison, générique ailleurs. */
export function applyHref(pathname: string): string {
  const slug = houseSlugFromPath(pathname);
  return slug ? `/candidature?property_interest=${slug}` : "/candidature";
}

/** Même événement `cta_click` que les CTA des pages maisons (jamais bloquant). */
export function trackApplyClick(position: "nav" | "nav_mobile" | "footer", pathname: string, language: string): void {
  try {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "cta_click", {
      cta_position: position,
      cta_target: "/candidature",
      house: houseSlugFromPath(pathname) ?? "none",
      language,
    });
  } catch {
    /* noop */
  }
}
