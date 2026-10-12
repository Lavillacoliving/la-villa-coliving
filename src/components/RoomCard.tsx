import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { thousands } from "@/data/stats";
import { roomGallery } from "@/data/roomPhotos";
import { isRoomPageOpen, roomPagePath } from "@/data/roomPages";
import { BADGE_CHIP_CLASS, roomBadge, roomSpecs, type HouseKey, type PublicRoom } from "@/lib/availability";

/** (12/10/2026, maquette validée par Jérôme) Équipements de la chambre tirés de v_public_rooms — jamais d'attribut inventé. */
function roomExtras(room: PublicRoom, lang: "fr" | "en"): string[] {
  const out: string[] = [];
  if (room.has_balcony) out.push(lang === "en" ? "Balcony" : "Balcon");
  if (room.has_terrace) out.push(lang === "en" ? "Terrace" : "Terrasse");
  if (room.has_private_entrance) out.push(lang === "en" ? "Private entrance" : "Entrée privée");
  if (room.has_parking) out.push(lang === "en" ? "Parking space" : "Place de parking");
  return out;
}

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
  /** (Offre hiver, 06/10/2026) Paramètres d'URL ajoutés EN TÊTE de la query du CTA, ex. « offre=hiver ». */
  ctaParams?: string;
  /**
   * (12/10/2026, refonte /chambres-disponibles validée par Jérôme) « featured » = grande carte horizontale d'une chambre libre
   * maintenant ; « compact » = petite carte en retrait d'une libération datée ; « default » = carte historique (pages maisons, inchangée).
   */
  variant?: "default" | "featured" | "compact";
  /** Commune de la maison (sur-titre des variantes featured / compact). */
  commune?: string;
};

export function RoomCard({ house, houseName, room, fallbackImage, showHouse = false, onOpenPhotos, onCtaClick, ctaParams, variant = "default", commune }: RoomCardProps) {
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
  const en = language === "en";
  const roomLabel = en ? `Room ${room.room_number}` : `Chambre ${room.room_number}`;
  const pageOpen = isRoomPageOpen(house, room);
  const ctaHref = `/candidature?${ctaParams ? `${ctaParams}&` : ""}property_interest=${house}&room_interest=chambre-${room.room_number}`;
  const eyebrow = commune ? `${houseName} · ${commune}` : houseName;
  const chf = room.rent_chf !== null ? (en ? `CHF ${thousands(room.rent_chf, ",")}` : `${thousands(room.rent_chf, " ")} CHF`) : null;
  const eur = rentEur !== null ? (en ? `€${thousands(rentEur, ",")}` : `${thousands(rentEur, " ")} €`) : null;
  const photoButton = (className: string, children: ReactNode) =>
    gallery && onOpenPhotos ? (
      <button
        type="button"
        onClick={() => onOpenPhotos(room, 0)}
        className={`${className} text-left cursor-zoom-in`}
        aria-label={en ? `See photos of room ${room.room_number}` : `Voir les photos de la chambre ${room.room_number}`}
      >
        {children}
      </button>
    ) : (
      <div className={className}>{children}</div>
    );

  if (variant === "featured") {
    const extras = roomExtras(room, uiLang);
    return (
      <article className="bg-white rounded-2xl border border-[#E7E5E4] overflow-hidden group grid md:grid-cols-12 shadow-[0_18px_40px_rgba(28,25,23,0.08)]">
        {photoButton("relative md:col-span-7 h-64 sm:h-80 md:h-auto md:min-h-[400px] w-full overflow-hidden", (
          <>
            <img
              src={cover?.src ?? fallbackImage}
              alt={cover ? cover.alt[uiLang] : `${roomLabel} — ${houseName}`}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
              loading="lazy"
              width={cover?.w ?? 1200}
              height={cover?.h ?? 800}
            />
            <span className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1.5 rounded-full ${BADGE_CHIP_CLASS[badge.tone]}`}>
              {badge.label}
            </span>
            {gallery && gallery.length > 1 && (
              <span className="absolute bottom-4 left-4 text-xs font-semibold px-3 py-1.5 rounded-full bg-black/70 text-white">
                {gallery.length} photos
              </span>
            )}
          </>
        ))}
        <div className="md:col-span-5 p-6 md:p-8 flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8A6508] mb-1">{eyebrow}</p>
            <h3 className="text-3xl text-[#1C1917] leading-tight" style={{ fontFamily: '"DM Serif Display", serif' }}>
              {pageOpen ? (
                <LocalizedLink to={roomPagePath(house, room.room_number)} className="hover:text-[#8A6508] transition-colors">{roomLabel}</LocalizedLink>
              ) : roomLabel}
            </h3>
            {!en && room.location_detail && <p className="mt-1 text-sm text-[#57534E]">{room.location_detail.trim()}</p>}
          </div>
          <ul className="space-y-1.5 text-sm text-[#44403C]">
            {specs && <li>{specs}</li>}
            {extras.length > 0 && <li>{extras.join(" · ")}</li>}
          </ul>
          {chf && (
            <div className="pt-4 border-t border-[#E7E5E4]">
              <p className="text-[#1C1917]">
                <span className="text-3xl" style={{ fontFamily: '"DM Serif Display", serif' }}>{chf}</span>
                <span className="text-sm text-[#57534E]">{eur ? ` (${eur})` : ""} {t.houseDetail.perMonth}</span>
              </p>
              <p className="mt-1 text-xs text-[#57534E]">
                {en
                  ? "Bills, fibre, cleaning, pool, sauna and gym included. No application fee."
                  : "Charges, fibre, ménage, piscine, sauna et salle de sport compris. 0 frais de dossier."}
              </p>
            </div>
          )}
          <div className="mt-auto flex flex-wrap gap-3">
            <LocalizedLink
              to={ctaHref}
              onClick={() => onCtaClick?.(room)}
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 bg-[#D4A574] text-[#1C1917] text-sm font-semibold rounded-lg hover:bg-[#E0BB8A] transition-colors"
            >
              {en ? "Apply for this room" : "Candidater pour cette chambre"}
              <ArrowRight className="w-4 h-4" />
            </LocalizedLink>
            {pageOpen && (
              <LocalizedLink
                to={roomPagePath(house, room.room_number)}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 border border-[#D6D3CE] text-[#1C1917] text-sm font-semibold rounded-lg hover:border-[#1C1917] transition-colors"
              >
                {en ? "See the room's page" : "Voir la fiche"}
              </LocalizedLink>
            )}
          </div>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="bg-[#FAF9F6] border border-[#E7E5E4] rounded-xl overflow-hidden flex flex-row md:flex-col group">
        {photoButton("relative w-28 shrink-0 md:w-full md:h-36 overflow-hidden", (
          <>
            <img
              src={cover?.src ?? fallbackImage}
              alt={cover ? cover.alt[uiLang] : `${roomLabel} — ${houseName}`}
              className="absolute inset-0 w-full h-full object-cover saturate-[.75] opacity-90"
              loading="lazy"
              width={cover?.w ?? 800}
              height={cover?.h ?? 600}
            />
            <span className={`hidden md:inline-block absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${BADGE_CHIP_CLASS[badge.tone]}`}>
              {badge.label}
            </span>
          </>
        ))}
        <div className="p-3 md:p-4 flex flex-col gap-1 min-w-0 flex-1">
          <p className="md:hidden text-xs font-bold text-[#7A5215]">{badge.label}</p>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C]">{eyebrow}</p>
          <h3 className="text-lg text-[#1C1917] leading-snug" style={{ fontFamily: '"DM Serif Display", serif' }}>
            {pageOpen ? (
              <LocalizedLink to={roomPagePath(house, room.room_number)} className="hover:text-[#8A6508] transition-colors">{roomLabel}</LocalizedLink>
            ) : roomLabel}
          </h3>
          {specs && <p className="text-xs text-[#57534E] leading-relaxed">{specs}</p>}
          {chf && (
            <p className="text-sm text-[#1C1917] mt-1">
              <strong>{chf}</strong>
              <span className="text-xs text-[#78716C]">{eur ? ` (${eur})` : ""} {t.houseDetail.perMonth}</span>
            </p>
          )}
          <LocalizedLink
            to={ctaHref}
            onClick={() => onCtaClick?.(room)}
            className="mt-auto inline-flex items-center gap-1.5 min-h-[44px] text-sm font-semibold text-[#57534E] hover:text-[#1C1917]"
          >
            {en ? "Book this date" : "Réserver cette date"}
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </LocalizedLink>
        </div>
      </article>
    );
  }

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
          {/* (28/09/2026) Fiche chambre quand elle existe ET est consultable (roomPages.ts). */}
          {isRoomPageOpen(house, room) ? (
            <LocalizedLink to={roomPagePath(house, room.room_number)} className="hover:text-[#B8860B] transition-colors">
              {language === "en" ? `Room ${room.room_number}` : `Chambre ${room.room_number}`}
            </LocalizedLink>
          ) : (
            language === "en" ? `Room ${room.room_number}` : `Chambre ${room.room_number}`
          )}
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
          {isRoomPageOpen(house, room) && (
            <LocalizedLink
              to={roomPagePath(house, room.room_number)}
              className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1C1917] underline underline-offset-4 hover:text-[#B8860B]"
            >
              {language === "en" ? "See the room's page" : "Voir la fiche de la chambre"}
              <ArrowRight className="w-3.5 h-3.5" />
            </LocalizedLink>
          )}
          <LocalizedLink
            to={`/candidature?${ctaParams ? `${ctaParams}&` : ""}property_interest=${house}&room_interest=chambre-${room.room_number}`}
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
