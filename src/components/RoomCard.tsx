import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { thousands } from "@/data/stats";
import { cardInclusions, type PriceWhyVariant } from "@/data/allInclusive";
import { roomGallery, roomPendingCover } from "@/data/roomPhotos";
import { isRoomPageOpen, roomPagePath } from "@/data/roomPages";
import { isAppartKey, placeDiscoverLabel, placeGammeBadge, roomCapacityLabel, roomLabel, type PlaceKey } from "@/data/places";
import { formatShortDate } from "@/lib/dates";
import { responsiveImage } from "@/lib/responsiveImage";
import { BADGE_CHIP_CLASS, roomBadge, roomSpecs, type PlaceRoom, type PublicRoom } from "@/lib/availability";

/** (12/10/2026, maquette validée par Jérôme) Équipements de la chambre tirés de v_public_rooms — jamais d'attribut inventé. */
function roomExtras(room: PlaceRoom, lang: "fr" | "en"): string[] {
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
export type RoomCardProps<R extends PlaceRoom = PublicRoom> = {
  /** (L'Appart, 13/11/2026) Lieu de la carte : une maison ou L'Appart (clé publique). Une carte de L'Appart garde son libellé
   *  (« Suite » pour la n° 5), sa capacité (« 1 ou 2 personnes »), sa ligne « tout compris » de gamme et, tant que ses chambres
   *  n'ont pas de photo, une pièce commune avec SON texte alternatif et la légende « Photo de la chambre à venir ». */
  house: PlaceKey;
  /** Nom affiché de la maison (« Le Loft ») — alt de repli et sur-titre. */
  houseName: string;
  room: R;
  /** Photo de TYPE de la maison quand la chambre n'a pas de pack dédié (déterministe). */
  fallbackImage: string;
  /** Affiche la maison au-dessus du n° de chambre (page toutes maisons). */
  showHouse?: boolean;
  /** Ouvre la visionneuse ; absent = photo non cliquable. */
  onOpenPhotos?: (room: R, photoIndex: number) => void;
  onCtaClick?: (room: R) => void;
  /** (Offre hiver, 06/10/2026) Paramètres d'URL ajoutés EN TÊTE de la query du CTA, ex. « offre=hiver ». */
  ctaParams?: string;
  /** (Offre hiver −50 %, rebrief du 12/10/2026) Ligne de démarrage du bail, ex. « Bail au 16 décembre » — carte par défaut, page de l'offre seulement. */
  leaseStart?: string;
  /**
   * (12/10/2026, demandes Jérôme) « Découvrir la maison » sur /chambres-disponibles : la maison est le point fort de
   * l'offre, et candidater après quelques photos de chambre est un engagement trop fort. Carte featured : bouton
   * principal AU-DESSUS de « Candidater pour cette chambre » (conservé). Carte compact : À LA PLACE de « Réserver cette
   * date ». Absent = cartes inchangées (pages maisons : on y est déjà). Garde : scripts/house-pages-check.mjs.
   */
  houseCta?: boolean;
  onHouseClick?: (room: R) => void;
  /**
   * (12/10/2026, refonte /chambres-disponibles validée par Jérôme) « featured » = grande carte horizontale d'une chambre libre
   * maintenant ; « compact » = petite carte en retrait d'une libération datée ; « default » = carte historique (pages maisons,
   * /offre-hiver, pages money ; depuis le 13/10/2026 « Candidater » passe au-dessus du lien vers la fiche).
   */
  variant?: "default" | "featured" | "compact";
  /** Commune de la maison (sur-titre des variantes featured / compact). */
  commune?: string;
  /**
   * (13/11/2026, décisions Jérôme des 12 et 13/11) Ligne « tout compris » à côté du prix, et lien « Ce que comprend le
   * prix » vers /tarifs sur les cartes featured et default des maisons. Textes, gamme et lien : src/data/allInclusive.ts.
   * `false` sur les pages maisons : la carte y reste telle qu'elle était (aucun changement visuel sur ces pages).
   */
  showInclusions?: boolean;
  /** Clic sur le lien « Ce que comprend le prix » — la mesure reste au parent, comme pour `onCtaClick`. */
  onPriceWhyClick?: (room: R, variant: PriceWhyVariant) => void;
  /** (L'Appart, 13/11/2026) Badge de gamme (« L'Appart · colocation ») au-dessus du nom de la chambre : listes qui mêlent les
   *  deux gammes seulement, jamais sur la page du lieu. Sans effet sur une carte de maison (aucun badge). */
  showGammeBadge?: boolean;
};

// Lien « Ce que comprend le prix » : discret (taille xs, souligné), mais avec une zone de toucher de 30 px de haut
// (minimum WCAG 2.5.8 : 24 px). La zone est un pseudo-élément qui déborde du texte de 2 px au-dessus (moitié de l'écart
// `mt-1` avec la ligne « tout compris » : elle ne la touche pas, même arrondie au pixel) et de 12 px au-dessous (il reste
// 4 px avant le bouton) : la mise en page ne change pas. Focus au clavier : anneau au ras du texte, même style que le
// bouton de la barre de navigation (le contour par défaut du navigateur engloberait toute la zone de toucher).
const PRICE_WHY_LINK_CLASS =
  "relative inline-block rounded-sm text-[#57534E] underline underline-offset-2 hover:text-[#1C1917] transition-colors after:absolute after:inset-x-0 after:-top-0.5 after:-bottom-3 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#44403C] focus-visible:ring-offset-2";

// Légende posée sur la photo d'une carte sans photo de chambre (L'Appart) : lisible sur toute photo, retour à la ligne permis
// dans la petite photo de la carte « compact ».
const PHOTO_PENDING_CLASS = "absolute bottom-2 left-2 max-w-[calc(100%-1rem)] text-[11px] leading-tight font-medium px-2 py-1 rounded-md bg-black/65 text-white";
// Badge de gamme (cartes de L'Appart) : `self-start`, sinon il s'étire sur toute la largeur dans les colonnes flex des variantes
// « compact » et par défaut (captures de la réunion des étapes, 13/11/2026).
const GAMME_BADGE_CLASS = "inline-block self-start mb-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F5F0E8] text-[#7A5215]";

export function RoomCard<R extends PlaceRoom = PublicRoom>({ house, houseName, room, fallbackImage, showHouse = false, onOpenPhotos, onCtaClick, ctaParams, leaseStart, houseCta = false, onHouseClick, variant = "default", commune, showInclusions = true, onPriceWhyClick, showGammeBadge = false }: RoomCardProps<R>) {
  const { t, language } = useLanguage();
  const uiLang = language === "en" ? "en" as const : "fr" as const;
  // Ne dépend que de la gamme (house_slug) et de la langue : même texte au prérendu et dans le navigateur.
  const inclusions = showInclusions ? cardInclusions({ house, roomHouse: room.house_slug, variant, lang: uiLang }) : null;
  // Pack dédié, ou galerie standard du Lodge (chambre → communs → extérieurs).
  const gallery = roomGallery(house, room.room_number);
  // (L'Appart, 13/11/2026) Sans photo de chambre : une pièce commune du lieu, avec SON texte alternatif (jamais « Chambre 2 —
  // L'Appart » sur une photo de cuisine) et la légende « Photo de la chambre à venir ». `null` pour une maison : carte inchangée.
  const pendingCover = gallery ? null : roomPendingCover(house);
  const cover = gallery?.[0] ?? pendingCover ?? undefined;
  const pendingLegend = pendingCover ? (
    <span data-photo-pending className={PHOTO_PENDING_CLASS}>
      {uiLang === "en" ? "Room photo coming soon" : "Photo de la chambre à venir"}
    </span>
  ) : null;
  const badge = roomBadge(room, uiLang);
  const specs = roomSpecs(room, uiLang);
  // « Chambre 4 » / « Room 4 » ; la n° 5 de L'Appart s'appelle « Suite » (src/data/places.ts).
  const label = roomLabel(house, room.room_number, uiLang);
  const rentEur =
    room.rent_eur !== null && room.rent_eur !== undefined && Number.isFinite(Number(room.rent_eur))
      ? Math.round(Number(room.rent_eur))
      : null;
  // (Lot 2 — C3, 16/10/2026) Variantes responsive quand la photo est au manifeste (scripts/optimize-images.mjs) : une
  // vignette de 144 px ne charge plus l'original de 1 440 px. Chaînes déterministes (même HTML au prérendu et au client).
  const coverSrc = cover?.src ?? fallbackImage;
  const roomImg = (
    <>
      <img
        src={coverSrc}
        {...responsiveImage(coverSrc, "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw")}
        alt={cover ? cover.alt[uiLang] : `${label} — ${houseName}`}
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
      {pendingLegend}
    </>
  );
  const en = language === "en";
  // « 1 ou 2 personnes » sous la suite de L'Appart ; rien sur les autres cartes.
  const capacity = roomCapacityLabel(house, room.room_number, uiLang);
  const gammeBadge = showGammeBadge ? placeGammeBadge(house, uiLang) : null;
  // Équipements de la chambre (balcon, entrée privée) sur les cartes « default » et « compact » de L'Appart seulement : la
  // carte « featured » les montre déjà pour tous les lieux ; les cartes des maisons restent celles d'aujourd'hui.
  const appartExtras = isAppartKey(house) ? roomExtras(room, uiLang).join(" · ") || null : null;
  const pageOpen = isRoomPageOpen(house, room);
  const ctaHref = `/candidature?${ctaParams ? `${ctaParams}&` : ""}property_interest=${house}&room_interest=chambre-${room.room_number}`;
  const eyebrow = commune ? `${houseName} · ${commune}` : houseName;
  const chf = room.rent_chf !== null ? (en ? `CHF ${thousands(room.rent_chf, ",")}` : `${thousands(room.rent_chf, "\u00a0")} CHF`) : null;
  const eur = rentEur !== null ? (en ? `€${thousands(rentEur, ",")}` : `${thousands(rentEur, "\u00a0")} €`) : null;
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
              src={coverSrc}
              {...responsiveImage(coverSrc, "(min-width: 768px) 58vw, 100vw")}
              alt={cover ? cover.alt[uiLang] : `${label} — ${houseName}`}
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
            {pendingLegend}
          </>
        ))}
        <div className="md:col-span-5 p-6 md:p-8 flex flex-col gap-4">
          <div>
            {gammeBadge && <p data-gamme-badge className={GAMME_BADGE_CLASS}>{gammeBadge}</p>}
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8A6508] mb-1">{eyebrow}</p>
            <h3 className="text-3xl text-[#1C1917] leading-tight">
              {pageOpen ? (
                <LocalizedLink to={roomPagePath(house, room.room_number)} className="hover:text-[#8A6508] transition-colors">{label}</LocalizedLink>
              ) : label}
            </h3>
            {!en && room.location_detail && <p className="mt-1 text-sm text-[#57534E]">{room.location_detail.trim()}</p>}
          </div>
          <ul className="space-y-1.5 text-sm text-[#44403C]">
            {specs && <li>{specs}</li>}
            {extras.length > 0 && <li>{extras.join(" · ")}</li>}
            {capacity && <li>{capacity}</li>}
          </ul>
          {chf && (
            <div className="pt-4 border-t border-[#E7E5E4]">
              <p className="text-[#1C1917]">
                <span className="text-3xl" style={{ fontFamily: '"DM Serif Display", serif' }}>{chf}</span>
                <span className="text-sm text-[#57534E]">{eur ? ` (${eur})` : ""} {t.houseDetail.perMonth}</span>
              </p>
              {inclusions && (
                <p data-all-inclusive={inclusions.gamme} className="mt-1 text-xs text-[#57534E]">{inclusions.line}</p>
              )}
              {inclusions?.link && (
                <p className="mt-1 text-xs">
                  <LocalizedLink to={inclusions.link.to} onClick={() => onPriceWhyClick?.(room, "featured")} data-price-why className={PRICE_WHY_LINK_CLASS}>
                    {inclusions.link.label}
                  </LocalizedLink>
                </p>
              )}
            </div>
          )}
          <div className="mt-auto flex flex-col gap-3">
            {houseCta && (
              <LocalizedLink
                to={`/${house}`}
                onClick={() => onHouseClick?.(room)}
                data-house-cta
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 bg-[#1C1917] text-white text-sm font-semibold rounded-lg hover:bg-[#44403C] transition-colors"
              >
                {placeDiscoverLabel(house, uiLang)}
                <ArrowRight className="w-4 h-4" />
              </LocalizedLink>
            )}
            <div className="flex flex-wrap gap-3">
              <LocalizedLink
                to={ctaHref}
                onClick={() => onCtaClick?.(room)}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 bg-[#D4A574] text-[#1C1917] text-sm font-semibold rounded-lg hover:bg-[#E0BB8A] transition-colors"
              >
                {/* (24/11/2026) « Programmer une visite » pour les maisons ; L'Appart, qui ne se visite pas avant son ouverture
                    (Jérôme), garde « Candidater pour cette chambre ». */}
                {isAppartKey(house)
                  ? (en ? "Apply for this room" : "Candidater pour cette chambre")
                  : (en ? "Book a visit" : "Programmer une visite")}
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
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    // (13/10/2026, brief « conversion Ads » §2.1 — D1 et option A de Jérôme) Photo en couleur, pleine opacité ; la date de
    // libération en pastille SUR la photo à toutes les tailles, format court (« Libre le 15 oct. » / « Free from 15 Oct ») ;
    // photo mobile élargie de 112 à 144 px pour que la pastille y tienne. Une information, pas un appel.
    const shortDate = room.available_from ? formatShortDate(room.available_from, uiLang) : "";
    const datePill = room.availability !== "available" && shortDate
      ? (en ? `Free from ${shortDate}` : `Libre le ${shortDate}`)
      : badge.label;
    return (
      <article className="bg-[#FAF9F6] border border-[#E7E5E4] rounded-xl overflow-hidden flex flex-row md:flex-col group">
        {photoButton("relative w-36 shrink-0 md:w-full md:h-36 overflow-hidden", (
          <>
            <img
              src={coverSrc}
              {...responsiveImage(coverSrc, "(min-width: 768px) 25vw, 144px")}
              alt={cover ? cover.alt[uiLang] : `${label} — ${houseName}`}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              width={cover?.w ?? 800}
              height={cover?.h ?? 600}
            />
            <span className={`absolute top-2 left-2 md:top-3 md:left-3 whitespace-nowrap text-xs font-semibold px-2.5 py-1 md:px-3 md:py-1.5 rounded-full ${BADGE_CHIP_CLASS[badge.tone]}`}>
              {datePill}
            </span>
            {pendingLegend}
          </>
        ))}
        <div className="p-3 md:p-4 flex flex-col gap-1 min-w-0 flex-1">
          {gammeBadge && <p data-gamme-badge className={GAMME_BADGE_CLASS}>{gammeBadge}</p>}
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C]">{eyebrow}</p>
          <h3 className="text-lg text-[#1C1917] leading-snug">
            {pageOpen ? (
              <LocalizedLink to={roomPagePath(house, room.room_number)} className="hover:text-[#8A6508] transition-colors">{label}</LocalizedLink>
            ) : label}
          </h3>
          {specs && <p className="text-xs text-[#57534E] leading-relaxed">{specs}</p>}
          {appartExtras && <p className="text-xs text-[#57534E] leading-relaxed">{appartExtras}</p>}
          {capacity && <p className="text-xs text-[#57534E] leading-relaxed">{capacity}</p>}
          {chf && (
            <p className="text-sm text-[#1C1917] mt-1">
              <strong>{chf}</strong>
              <span className="text-xs text-[#78716C]">{eur ? ` (${eur})` : ""} {t.houseDetail.perMonth}</span>
            </p>
          )}
          {/* Version courte, sans lien : la carte reste une information, pas un appel. */}
          {chf && inclusions && (
            <p data-all-inclusive={inclusions.gamme} className="text-xs text-[#57534E]">{inclusions.line}</p>
          )}
          {houseCta ? (
            <LocalizedLink
              to={`/${house}`}
              onClick={() => onHouseClick?.(room)}
              data-house-cta
              className="mt-auto inline-flex items-center gap-1.5 min-h-[44px] text-sm font-semibold text-[#1C1917] hover:text-[#8A6508]"
            >
              {placeDiscoverLabel(house, uiLang)}
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </LocalizedLink>
          ) : (
            <LocalizedLink
              to={ctaHref}
              onClick={() => onCtaClick?.(room)}
              className="mt-auto inline-flex items-center gap-1.5 min-h-[44px] text-sm font-semibold text-[#57534E] hover:text-[#1C1917]"
            >
              {en ? "Book this date" : "Réserver cette date"}
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </LocalizedLink>
          )}
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
        {gammeBadge && <p data-gamme-badge className={GAMME_BADGE_CLASS}>{gammeBadge}</p>}
        {showHouse && (
          <p className="text-xs font-semibold uppercase tracking-wider text-[#B8860B] mb-1">{houseName}</p>
        )}
        <h3 className="text-lg text-[#1C1917] mb-1">
          {/* (28/09/2026) Fiche chambre quand elle existe ET est consultable (roomPages.ts). */}
          {isRoomPageOpen(house, room) ? (
            <LocalizedLink to={roomPagePath(house, room.room_number)} className="hover:text-[#B8860B] transition-colors">
              {label}
            </LocalizedLink>
          ) : (
            label
          )}
        </h3>
        {specs && <p className="text-sm text-[#78716C] mb-1">{specs}</p>}
        {appartExtras && <p className="text-sm text-[#78716C] mb-1">{appartExtras}</p>}
        {capacity && <p className="text-sm text-[#78716C] mb-1">{capacity}</p>}
        {language !== "en" && room.location_detail && (
          <p className="text-xs text-[#78716C] mb-3">{room.location_detail.trim()}</p>
        )}
        <div className="mt-auto pt-3">
          {leaseStart && (
            <p data-lease-start className="mb-2 text-sm font-semibold text-[#7A5215]">{leaseStart}</p>
          )}
          {room.rent_chf !== null && (
            <p className={`text-xl font-black text-[#D4A574] ${inclusions ? "mb-1" : "mb-4"}`}>
              {language === "en"
                ? `CHF ${thousands(room.rent_chf, ",")}`
                : `${thousands(room.rent_chf, "\u00a0")} CHF`}
              {rentEur !== null && (
                <span className="text-sm font-light text-[#78716C]">
                  {language === "en" ? ` (€${thousands(rentEur, ",")})` : ` (${thousands(rentEur, "\u00a0")} €)`}
                </span>
              )}
              <span className="text-sm font-light text-[#78716C]"> {t.houseDetail.perMonth}</span>
            </p>
          )}
          {/* Sous le prix, avant le bouton. Sans `inclusions` (pages maisons), le prix garde sa marge : carte inchangée. */}
          {room.rent_chf !== null && inclusions && (
            <div className="mb-4">
              <p data-all-inclusive={inclusions.gamme} className="text-xs text-[#78716C]">{inclusions.line}</p>
              {inclusions.link && (
                <p className="mt-1 text-xs">
                  <LocalizedLink to={inclusions.link.to} onClick={() => onPriceWhyClick?.(room, "default")} data-price-why className={PRICE_WHY_LINK_CLASS}>
                    {inclusions.link.label}
                  </LocalizedLink>
                </p>
              )}
            </div>
          )}
          {/* (13/10/2026, brief « conversion Ads » §2.5) « Candidater » d'abord, la fiche en lien secondaire dessous — même
              ordre que la variante featured, sur toutes les utilisations (pages maisons, /offre-hiver, pages money). */}
          <LocalizedLink
            to={`/candidature?${ctaParams ? `${ctaParams}&` : ""}property_interest=${house}&room_interest=chambre-${room.room_number}`}
            onClick={() => onCtaClick?.(room)}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#D4A574] text-[#1C1917] text-sm font-semibold rounded-lg hover:bg-[#E0BB8A] transition-colors"
          >
            {isAppartKey(house)
              ? (language === "en" ? "Apply" : "Candidater")
              : (language === "en" ? "Book a visit" : "Programmer une visite")}
            <ArrowRight className="w-4 h-4" />
          </LocalizedLink>
          {isRoomPageOpen(house, room) && (
            <div className="mt-3 text-center">
              <LocalizedLink
                to={roomPagePath(house, room.room_number)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1C1917] underline underline-offset-4 hover:text-[#B8860B]"
              >
                {language === "en" ? "See the room's page" : "Voir la fiche de la chambre"}
                <ArrowRight className="w-3.5 h-3.5" />
              </LocalizedLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
