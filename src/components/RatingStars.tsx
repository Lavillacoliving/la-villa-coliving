/**
 * Étoiles proportionnelles à la note Google (décision Jérôme du 11/10/2026, point A9) : 4,8 → quatre étoiles pleines et une
 * remplie à 80 %, au lieu de cinq pleines. Rendu purement déterministe depuis GOOGLE_REVIEWS.value (aucune date, aucun
 * aléa : le HTML prérendu et le premier rendu client sont identiques — anti-#418). Aucun texte ajouté : la note elle-même reste
 * portée par la phrase STATS_DISPLAY.googleRating à côté ; le conteneur expose un aria-label « 4,8 sur 5 ».
 */
import { GOOGLE_REVIEWS } from "@/data/stats";

const STAR_PATH = "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z";

export interface RatingStarsProps {
  /** Note sur 5 ; défaut GOOGLE_REVIEWS.value. */
  value?: number;
  lang?: "fr" | "en";
  /** Classes de taille/couleur d'UNE étoile (ex. « w-4 h-4 text-[#E0BB8A] »). */
  className?: string;
  /** Couleur des étoiles vides (ex. « text-white/30 »). */
  emptyClassName?: string;
}

export function RatingStars({ value = GOOGLE_REVIEWS.value, lang = "fr", className = "w-4 h-4 text-[#E0BB8A]", emptyClassName = "text-white/30" }: RatingStarsProps) {
  // Libellé lu dérivé de la valeur RENDUE (= GOOGLE_REVIEWS.ratingEn/rating par défaut) : une valeur passée en prop reste cohérente.
  const label = lang === "en" ? `${value.toFixed(1)} out of 5` : `${value.toFixed(1).replace(".", ",")} sur 5`;
  return (
    <span className="inline-flex items-center gap-1" role="img" aria-label={label}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        const pct = Math.round(fill * 100);
        return (
          <span key={i} className="relative inline-block" aria-hidden="true">
            <svg className={`${className} ${emptyClassName}`.replace(/text-\[[^\]]+\]\s*/, "")} fill="currentColor" viewBox="0 0 20 20">
              <path d={STAR_PATH} />
            </svg>
            <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pct}%` }}>
              <svg className={className} fill="currentColor" viewBox="0 0 20 20">
                <path d={STAR_PATH} />
              </svg>
            </span>
          </span>
        );
      })}
    </span>
  );
}
