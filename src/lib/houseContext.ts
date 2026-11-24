import { PLACE_PAGE_KEYS, isAppartKey, placeFromPath, roomFromPath, type PlaceKey } from "@/data/places";

/**
 * Contexte « maison » dérivé de l'URL (Lot A — A3/Q9, 02/09/2026).
 *
 * Les CTA de la nav et du footer sont communs à tout le site : sur une page maison, ils
 * étaient les seuls liens /candidature SANS `property_interest` (3 par page), alors que le
 * formulaire, l'Edge Function et le dashboard savent exploiter ce paramètre. Dérivé du
 * pathname (identique au prérendu et au premier rendu client) : aucun risque d'hydratation.
 */

/** Clé du lieu si le chemin est la page d'un lieu qui A une page (FR ou EN), sinon null. (L'Appart, 12/11/2026)
 *  Lieux = PLACE_PAGE_KEYS (src/data/places.ts) : les 3 maisons tant que la page de L'Appart n'existe pas. */
export function houseSlugFromPath(pathname: string): PlaceKey | null {
  const place = placeFromPath(pathname);
  return place && PLACE_PAGE_KEYS.includes(place) ? place : null;
}

/** Cible du CTA « Candidater » : contextualisée sur une page maison, générique ailleurs. */
export function applyHref(pathname: string): string {
  const slug = houseSlugFromPath(pathname);
  return slug ? `/candidature?property_interest=${slug}` : "/candidature";
}

/**
 * (24/11/2026) Libellé du lien commun vers /candidature (pied de page) : « Programmer une visite » (refonte des pages de vente,
 * § 4.7), sauf sur les pages de L'Appart — sa page et ses fiches chambres —, qui ne se visite pas avant son ouverture (Jérôme) :
 * « Candidater ». Dérivé du chemin, comme applyHref : identique au prérendu et au premier rendu client.
 */
export function applyLabel(pathname: string, lang: "fr" | "en"): string {
  const place = placeFromPath(pathname) ?? roomFromPath(pathname)?.place ?? null;
  if (isAppartKey(place)) return lang === "en" ? "Apply" : "Candidater";
  return lang === "en" ? "Book a visit" : "Programmer une visite";
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
