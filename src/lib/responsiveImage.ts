import { RESPONSIVE_IMAGES } from "@/data/responsiveImages";

/**
 * srcset/sizes pour les images déclarées dans scripts/optimize-images.mjs.
 * Retourne {} pour toute image hors manifeste : le <img src> reste seul maître.
 *
 * ⚠️ Les URLs d'images contiennent des espaces (« /images/la villa jardin.webp ») :
 * valides dans `src`, mais dans `srcset` l'espace sépare l'URL de son
 * descripteur — d'où l'encodage systématique.
 */
export function responsiveImage(src: string, sizes: string): { srcSet?: string; sizes?: string } {
  const entry = RESPONSIVE_IMAGES[src];
  if (!entry) return {};
  const candidates = entry.widths.map(
    (w) => `${encodeURI(src.replace(/\.webp$/i, `-w${w}.webp`))} ${w}w`,
  );
  if (!entry.reencoded) candidates.push(`${encodeURI(src)} ${entry.original}w`);
  return { srcSet: candidates.join(", "), sizes };
}
