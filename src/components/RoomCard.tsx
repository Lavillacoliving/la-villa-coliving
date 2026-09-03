import { ArrowRight } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { thousands } from "@/data/stats";
import { roomGallery } from "@/data/roomPhotos";
import { BADGE_CHIP_CLASS, roomBadge, roomSpecs, type HouseKey, type PublicRoom } from "@/lib/availability";

/**
 * (Lot 3 SEO funnel — 03/09/2026) Carte d'une chambre CANDIDATE (libre maintenant ou
 * libération datée) : photo (pack dédié, sinon photo de type de la maison), pastille de
 * dispo, n°, spécifications, prix CHF (+ €) et CTA de candidature à deux paramètres.
 * Extraite telle quelle du JSX « Option 2 » de HouseDetailPage (décision Jérôme 02/09) :
 * AUCUN changement visuel sur les pages maisons. Partagée avec /chambres-disponibles,
 * qui ajoute la maison en sur-titre (`showHouse`).
 *
 * Pureté d'hydratation : tout est dérivé de props stables (room_number, galerie statique) —
 * jamais d'aléatoire ni de Date au rendu. Le tracking (visionneuse, CTA) reste au parent.
 */
export type RoomCardProps = {
  house: HouseKey;
  /** Nom affiché de la maison (« Le Loft ») — alt de repli et sur-titre. */
  houseName: string;
  room: PublicRoom;
  /** Photo de TYPE de la maison quand la chambre n'a pas de pack dédié (déterministe). */
  fallbackImage: string;
  /** Affiche la maison au-dessus du n° de chambre (page toutes maisons). */
  showHouse?: boolean;
  /** Ouvre la visionneuse ; absent = photo non cliquable. */
  onOpenPhotos?: (room: PublicRoom, photoIndex: number) => void;
  onCtaClick?: (room: PublicRoom) => void;
};

export function RoomCard({ house, houseName, room, fallbackImage, showHouse = false, onOpenPhotos, onCtaClick }: RoomCardProps) {
  const { t, language } = useLanguage();
  const uiLang = language === "en" ? "en" as const : "fr" as const;
  // Pack dédié, ou galerie standard du Lodge (chambre → communs → extérieurs).
  const gallery = roomGallery(house, room.room_number);
  const cover = gallery?.[0];
  const badge = roomBadge(room, uiLang);
  const specs = roomSpecs(room, uiLang);
  const rentEur =
    room.rent_eur !== null && room.rent_eur !== undefined && Number.isFinite(Number(room.rent_eur))
      ? Math.round(Number(room.rent_eur))
      : null;
  const roomImg = (
    <>
      <img
        src={cover?.src ?? fallbackImage}
        alt={cover
          ? cover.alt[uiLang]
          : `${language === "en" ? "Room" : "Chambre"} ${room.room_number} — ${houseName}`}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        loading="lazy"
        width={cover?.w ?? 800}
        height={cover?.h ?? 600}
      />
      <span className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${BADGE_CHIP_CLASS[badge.tone]}`}>
        {badge.label}
      </span>
      {gallery && gallery.length > 1 && (
        <span className="absolute bottom-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full bg-black/55 text-white">
          {gallery.length} photos
        </span>
      )}
    </>
  );
  return (
    <div className="card-ultra bg-white rounded-2xl border border-[#E7E5E4] shadow-sm overflow-hidden group flex flex-col">
      {gallery && onOpenPhotos ? (
        <button
          type="button"
          onClick={() => onOpenPhotos(room, 0)}
          className="relative h-48 w-full overflow-hidden text-left cursor-zoom-in"
          aria-label={language === "en"
            ? `See photos of room ${room.room_number}`
            : `Voir les photos de la chambre ${room.room_number}`}
        >
          {roomImg}
        </button>
      ) : (
        <div className="relative h-48 w-full overflow-hidden">{roomImg}</div>
      )}
      <div className="p-6 flex flex-col flex-1">
        {showHouse && (
          <p className="text-xs font-semibold uppercase tracking-wider text-[#B8860B] mb-1">{houseName}</p>
        )}
        <h3 className="text-lg font-black text-[#1C1917] mb-1">
          {language === "en" ? `Room ${room.room_number}` : `Chambre ${room.room_number}`}
        </h3>
        {specs && <p className="text-sm text-[#78716C] mb-1">{specs}</p>}
        {language !== "en" && room.location_detail && (
          <p className="text-xs text-[#78716C] mb-3">{room.location_detail.trim()}</p>
        )}
        <div className="mt-auto pt-3">
          {room.rent_chf !== null && (
            <p className="text-xl font-black text-[#D4A574] mb-4">
              {language === "en"
                ? `CHF ${thousands(room.rent_chf, ",")}`
                : `${thousands(room.rent_chf, " ")} CHF`}
              {rentEur !== null && (
                <span className="text-sm font-light text-[#78716C]">
                  {language === "en" ? ` (€${thousands(rentEur, ",")})` : ` (${thousands(rentEur, " ")} €)`}
                </span>
              )}
              <span className="text-sm font-light text-[#78716C]"> {t.houseDetail.perMonth}</span>
            </p>
          )}
          <LocalizedLink
            to={`/candidature?property_interest=${house}&room_interest=chambre-${room.room_number}`}
            onClick={() => onCtaClick?.(room)}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#D4A574] text-[#1C1917] text-sm font-semibold rounded-lg hover:bg-[#E0BB8A] transition-colors"
          >
            {language === "en" ? "Apply" : "Candidater"}
            <ArrowRight className="w-4 h-4" />
          </LocalizedLink>
        </div>
      </div>
    </div>
  );
}
