import { ArrowRight } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { HOUSES } from "@/data/houses";
import { BADGE_DOT_CLASS, formatFreeDate, useRoomAvailability, type BadgeTone, type HouseKey } from "@/lib/availability";

/**
 * (Lot 3 SEO funnel — 3.3) Ligne de disponibilité d'une maison, porte vers /chambres-disponibles
 * filtrée sur la maison : « La Villa : 1 chambre dès le 10 septembre → voir ». Dérivée du résumé
 * embarqué (useRoomAvailability, déjà présent sur / et /nos-maisons) : premier rendu = snapshot,
 * jamais de chiffre inventé (dispo inconnue = rien). Jamais le mot « complet » : sans chambre
 * ni date, la maison propose la liste d'attente.
 */
/** Couleur du « voir → » : accent par défaut (lot « couleurs », 28/11/2026, §0.5 : le doré sur fond clair est sous le
 *  contraste minimal ; il ne sert plus qu'au bouton principal et aux étoiles). */
export function HouseAvailabilityLine({
  house,
  className = "",
  linkClassName = "text-lvc-accent",
}: { house: HouseKey; className?: string; linkClassName?: string }) {
  const { language } = useLanguage();
  const L = language === "en" ? "en" as const : "fr" as const;
  const availability = useRoomAvailability();
  if (!availability.known) return null;
  const h = availability.byHouse[house];
  let text: string;
  let tone: BadgeTone;
  if (h.available > 0) {
    text = L === "en"
      ? `${h.available} room${h.available > 1 ? "s" : ""} available now`
      : `${h.available} chambre${h.available > 1 ? "s" : ""} libre${h.available > 1 ? "s" : ""} maintenant`;
    tone = "available";
  } else if (h.nextFreeDate) {
    const n = h.nextFreeCount || 1;
    text = L === "en"
      ? `${n} room${n > 1 ? "s" : ""} from ${formatFreeDate(h.nextFreeDate, "en")}`
      : `${n} chambre${n > 1 ? "s" : ""} dès le ${formatFreeDate(h.nextFreeDate, "fr")}`;
    tone = "upcoming";
  } else {
    text = L === "en" ? "waiting list" : "liste d'attente";
    tone = "full";
  }
  const track = () => {
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "cta_click", {
        cta_position: "house_availability_line", cta_target: "/chambres-disponibles", house, language,
      });
    } catch { /* noop */ }
  };
  return (
    <LocalizedLink
      to={`/chambres-disponibles?maison=${house}`}
      onClick={track}
      className={`inline-flex items-center gap-2 text-sm text-[#44403C] hover:text-[#1C1917] transition-colors ${className}`}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${BADGE_DOT_CLASS[tone]}`} aria-hidden="true" />
      <span>
        <span className="font-semibold">{HOUSES[house].label}</span> : {text}
      </span>
      <span className={`inline-flex items-center gap-1 font-semibold ${linkClassName}`}>
        {L === "en" ? "see" : "voir"}
        <ArrowRight className="w-3.5 h-3.5" />
      </span>
    </LocalizedLink>
  );
}
