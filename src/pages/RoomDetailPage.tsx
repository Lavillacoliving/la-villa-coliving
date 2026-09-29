import { Suspense, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowRight, BedDouble, Car, Check, ChevronRight, Images, Layers, MapPin, Maximize, ShowerHead } from "lucide-react";
import { SEO } from "@/components/SEO";
import { LocalizedLink } from "@/components/LocalizedLink";
import { RoomsEmbed } from "@/components/RoomsEmbed";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { HOUSES } from "@/data/houses";
import { ENTITY_FACTS, ENTITY_HOUSES } from "@/data/entityFacts";
import { roomGallerySections, type GallerySectionKey, type RoomPhoto } from "@/data/roomPhotos";
import { isRoomPageOpen, parseRoomPagePath, roomPagePath } from "@/data/roomPages";
import { thousands } from "@/data/stats";
import { lazyWithRetry } from "@/lib/lazyWithRetry";
import { responsiveImage } from "@/lib/responsiveImage";
import { LAVILLA_PHONE } from "@/lib/structuredData";
import {
  useHouseRooms,
  splitRooms,
  roomSurface,
  floorLabel,
  bathroomLabel,
  formatFreeDate,
  BADGE_PANEL_CLASS,
  BADGE_DOT_CLASS,
  type BadgeTone,
  type HouseKey,
  type PublicRoom,
} from "@/lib/availability";

/**
 * Fiche chambre — /lelodge/chambre-4, /en/lelodge/chambre-4… (demande Jérôme du 28/09/2026).
 *
 * Une page par chambre, faite pour être PARTAGÉE (WhatsApp, Instagram, annonces) : galerie
 * classée chambre → communs intérieurs → extérieurs, caractéristiques, prix, date de
 * libération, candidature pré-remplie avec la chambre. Liste des fiches : src/data/roomPages.json.
 * Pages noindex (cf. roomPages.ts) : l'intention de recherche est portée par /chambres-disponibles.
 *
 * Données : v_public_rooms via le store partagé (`useHouseRooms`), embarqué au prérendu par
 * <RoomsEmbed house /> et relu de façon SYNCHRONE → premier rendu client = HTML prérendu, zéro
 * #418. Aucune date calculée au rendu (formatFreeDate est pure). Photos : roomGallerySections().
 * Faits (caution, bail, inclusions, trajets) : src/data/entityFacts.ts — jamais en dur ici.
 */
const PhotoLightbox = lazyWithRetry(() => import("@/components/PhotoLightbox"), "PhotoLightbox");

const SITE = "https://www.lavillacoliving.com";

const SECTION_LABELS: Record<GallerySectionKey, { fr: string; en: string }> = {
  room: { fr: "La chambre", en: "The room" },
  interior: { fr: "Espaces communs", en: "Common areas" },
  exterior: { fr: "Extérieurs", en: "Outdoors" },
};

function track(event: string, params: Record<string, unknown>) {
  try {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", event, params);
  } catch { /* noop — l'analytics ne bloque jamais l'UI */ }
}

/** « du Lodge », « du Loft », « de La Villa ». */
const ofHouse = (label: string) => (label.startsWith("Le ") ? `du ${label.slice(3)}` : `de ${label}`);
/** « au Lodge », « au Loft », « à La Villa ». */
const atHouse = (label: string) => (label.startsWith("Le ") ? `au ${label.slice(3)}` : `à ${label}`);

/**
 * Présentation de la chambre. Au Lodge, les photos de chambre sont celles d'une chambre STANDARD
 * (pack standardisé, décision Jérôme du 28/09) : on le dit, par honnêteté.
 */
function roomIntro(house: HouseKey, n: number, rooms: number, en: boolean): string {
  if (house === "leloft" && n === 4) {
    return en
      ? "On the 2nd floor of Le Loft, under the roof: a double bed, an armchair corner, a skylight and a private shower room — a bright room in our most intimate house."
      : "Au 2e étage du Loft, sous les toits : lit double, coin fauteuil, fenêtre de toit et salle d'eau privative — une chambre lumineuse dans notre maison la plus intime.";
  }
  if (house === "lelodge") {
    return en
      ? `A furnished room at Le Lodge, our newest house in Annemasse: double bed, desk, storage and a private shower room with walk-in shower. All ${rooms} rooms are fitted out to the same design — the room photos show a standard Lodge room.`
      : `Une chambre meublée du Lodge, notre maison la plus récente, à Annemasse : lit double, bureau, rangements et salle d'eau privative avec douche à l'italienne. Les ${rooms} chambres sont aménagées sur le même modèle — les photos de la chambre sont celles d'une chambre standard du Lodge.`;
  }
  return en
    ? "A private furnished room with its own bathroom arrangement, in one of our coliving houses near Geneva."
    : "Une chambre privée meublée, dans l'une de nos maisons de coliving près de Genève.";
}

type Status = { tone: BadgeTone; badge: string; lead: string; cta: string };

/**
 * Statut d'une chambre CONSULTABLE (libre ou datée). Une chambre occupée sans date n'a plus
 * de fiche visible (demande Jérôme du 28/09, cf. isRoomPageOpen) : elle n'arrive jamais ici
 * avec des données, seulement en état neutre.
 */
function roomStatus(room: PublicRoom | undefined, en: boolean): Status {
  const hours = ENTITY_FACTS.responseHours;
  const neutral: Status = {
    tone: "upcoming",
    badge: "",
    lead: en ? `Apply and we reply within ${hours} h.` : `Candidate, on te répond sous ${hours} h.`,
    cta: en ? "Apply for this room" : "Candidater pour cette chambre",
  };
  // Données pas encore chargées (navigation client avant le fetch) : état neutre, pas de
  // pastille. Au prérendu la chambre est toujours connue.
  if (!room) return neutral;
  if (room.availability === "available") {
    return {
      tone: "available",
      badge: en ? "Available now" : "Libre maintenant",
      lead: en ? `It's free right now: apply and we reply within ${hours} h.` : `Elle est libre dès maintenant : candidate, on te répond sous ${hours} h.`,
      cta: en ? "Apply for this room" : "Candidater pour cette chambre",
    };
  }
  if (room.available_from) {
    const date = formatFreeDate(room.available_from, en ? "en" : "fr");
    return {
      tone: "upcoming",
      badge: en ? `Available from ${date}` : `Libre dès le ${date}`,
      lead: en
        ? `It frees up on ${date}: apply today to reserve it — reply within ${hours} h.`
        : `Elle se libère le ${date} : candidate dès aujourd'hui pour la réserver, réponse sous ${hours} h.`,
      cta: en ? "Apply for this room" : "Candidater pour cette chambre",
    };
  }
  return neutral;
}

export function RoomDetailPage() {
  const { pathname } = useLocation();
  const { language } = useLanguage();
  const en = language === "en";
  const L = en ? "en" as const : "fr" as const;

  const parsed = parseRoomPagePath(pathname);
  const house: HouseKey = parsed?.house ?? "lelodge";
  const n = parsed?.roomNumber ?? 0;
  const houseRooms = useHouseRooms(house);
  const room = houseRooms.rooms.find((r) => r.room_number === n);
  const [viewer, setViewer] = useState<number | null>(null);

  const houseLabel = HOUSES[house].label;
  const facts = ENTITY_HOUSES.find((h) => h.slug === house)!;
  const sections = parsed ? roomGallerySections(house, n) : undefined;
  const photos: RoomPhoto[] = sections?.flatMap((s) => s.photos) ?? [];
  const sectionStart = (key: GallerySectionKey) => {
    let i = 0;
    for (const s of sections ?? []) { if (s.key === key) return i; i += s.photos.length; }
    return 0;
  };

  if (!parsed) {
    return (
      <main className="pt-32 pb-20 bg-white">
        <div className="container-custom text-center">
          <h1 className="text-3xl mb-4 text-[#1C1917]" style={{ fontFamily: '"DM Serif Display", serif' }}>
            {en ? "Room not found" : "Chambre introuvable"}
          </h1>
          <LocalizedLink to="/chambres-disponibles" className="text-[#B8860B] font-semibold underline underline-offset-4">
            {en ? "See the available rooms" : "Voir les chambres disponibles"}
          </LocalizedLink>
        </div>
      </main>
    );
  }

  const roomName = en ? `Room ${n}` : `Chambre ${n}`;
  const status = roomStatus(room, en);
  const surface = room ? roomSurface(room) : null;
  const floor = room ? floorLabel(room, L) : null;
  const bath = room ? bathroomLabel(room, L) : null;
  const rentEur = room?.rent_eur != null && Number.isFinite(Number(room.rent_eur)) ? Math.round(Number(room.rent_eur)) : null;
  const applyTo = `/candidature?property_interest=${house}&room_interest=chambre-${n}`;
  const specsLine = [surface !== null ? `${surface} m²` : null, floor, bath].filter(Boolean).join(" · ");

  const openPhotos = (index: number, origin: string) => {
    setViewer(index);
    track("photo_lightbox_open", { room_id: `chambre-${n}`, property_interest: house, photo_index: index, page: "room_page", origin });
  };
  const onApply = (position: string) =>
    track("cta_click", { cta_position: position, cta_target: "/candidature", house, room_id: `chambre-${n}`, language });

  const whatsappMessage = en
    ? `Hi! I'm interested in room ${n} at ${houseLabel}${room?.available_from ? ` (available from ${formatFreeDate(room.available_from, "en")})` : ""}.`
    : `Bonjour ! La chambre ${n} ${ofHouse(houseLabel)} m'intéresse${room?.available_from ? ` (libre dès le ${formatFreeDate(room.available_from, "fr")})` : ""}.`;

  // Autres fiches CONSULTABLES de la même maison : libres, puis datées (ordre de splitRooms).
  const others = splitRooms(
    houseRooms.rooms.filter((r) => r.room_number !== n && isRoomPageOpen(house, r)),
  ).candidates;

  const title = `${roomName} — ${houseLabel}, ${facts.commune}`;
  const description = en
    ? `${roomName} at ${houseLabel} in ${facts.commune}${surface !== null ? `: ${surface} m²` : ""}${bath ? `, ${bath}` : ""}. ${status.badge}. All inclusive, no application fee, reply within ${ENTITY_FACTS.responseHours} h.`
    : `${roomName} ${ofHouse(houseLabel)} à ${facts.commune}${surface !== null ? ` : ${surface} m²` : ""}${bath ? `, ${bath}` : ""}. ${status.badge}. Tout inclus, 0 frais de dossier, réponse sous ${ENTITY_FACTS.responseHours} h.`;

  const amenities = facts.amenities[L].split(" · ");
  const amenitiesLine = amenities.map((a, i) => (i === 0 ? a.charAt(0).toUpperCase() + a.slice(1) : a)).join(", ");
  const included = en
    ? ["Bills: water, electricity, heating", `Fibre internet up to ${ENTITY_FACTS.fiberSpeed}`, `Common-area cleaning ${ENTITY_FACTS.cleaningPerWeek} times a week`, amenitiesLine, "Streaming, yoga and community events", "Bed linen and towels provided"]
    : ["Charges : eau, électricité, chauffage", `Internet fibre jusqu'à ${ENTITY_FACTS.fiberSpeed}`, `Ménage des espaces communs ${ENTITY_FACTS.cleaningPerWeek} fois par semaine`, amenitiesLine, "Streaming, yoga et événements", "Linge de lit et serviettes fournis"];
  const reassurance = en
    ? ["No application or agency fee", `Deposit: ${ENTITY_FACTS.depositMonths} months' rent, excluding charges`, `Reply within ${ENTITY_FACTS.responseHours} hours`, "Video tour available"]
    : ["0 € de frais de dossier et d'agence", `Caution : ${ENTITY_FACTS.depositMonths} mois de loyer hors charges`, `Réponse sous ${ENTITY_FACTS.responseHours} h`, "Visite en visio possible"];
  const lease = en
    ? `${ENTITY_FACTS.lease.months}-month lease. Minimum commitment of ${ENTITY_FACTS.lease.minimumMonths} months, then you're free to leave with ${ENTITY_FACTS.lease.noticeMonths} month's notice.`
    : `Bail de ${ENTITY_FACTS.lease.months} mois. Engagement minimum de ${ENTITY_FACTS.lease.minimumMonths} mois, puis tu es libre avec ${ENTITY_FACTS.lease.noticeMonths} mois de préavis.`;

  const specs: { icon: typeof Maximize; label: string; value: string }[] = [
    ...(surface !== null ? [{ icon: Maximize, label: en ? "Size" : "Surface", value: `${surface} m²` }] : []),
    ...(floor ? [{ icon: Layers, label: en ? "Floor" : "Étage", value: floor }] : []),
    ...(!en && room?.location_detail ? [{ icon: MapPin, label: "Emplacement", value: room.location_detail.trim() }] : []),
    ...(bath ? [{ icon: ShowerHead, label: en ? "Bathroom" : "Salle d'eau", value: bath.charAt(0).toUpperCase() + bath.slice(1) }] : []),
    { icon: BedDouble, label: en ? "Furnished" : "Meublée", value: en ? "Double bed, desk, storage" : "Lit double, bureau, rangements" },
    ...(room?.has_parking ? [{ icon: Car, label: "Parking", value: en ? "Parking right in the property" : "Droit de parking dans la propriété" }] : []),
  ];

  const heading = { fontFamily: '"DM Serif Display", serif' };
  const cover = photos[0];

  const priceCard = (
    <div className="bg-white rounded-2xl border border-[#E7E5E4] shadow-sm p-6">
      {room?.rent_chf != null && (
        <p className="text-3xl font-black text-[#D4A574]">
          {en ? `CHF ${thousands(room.rent_chf, ",")}` : `${thousands(room.rent_chf, " ")} CHF`}
          <span className="text-base font-light text-[#78716C]">{en ? " /month" : " /mois"}</span>
        </p>
      )}
      <p className="text-sm text-[#78716C] mt-1">
        {en ? "All inclusive" : "Tout inclus"}
        {rentEur !== null && (en ? ` · contractual rent €${thousands(rentEur, ",")}` : ` · loyer contractuel ${thousands(rentEur, " ")} €`)}
      </p>
      {status.badge && (
        <p className={`mt-4 inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg ${BADGE_PANEL_CLASS[status.tone]}`}>
          <span className={`w-2 h-2 rounded-full ${BADGE_DOT_CLASS[status.tone]}`} aria-hidden="true" />
          {status.badge}
        </p>
      )}
      <p className="mt-3 text-sm text-[#57534E]">{status.lead}</p>
      <LocalizedLink
        to={applyTo}
        onClick={() => onApply("room_page")}
        className="mt-5 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#D4A574] text-[#1C1917] font-bold rounded-xl hover:bg-[#E0BB8A] transition-colors"
      >
        {status.cta}
        <ArrowRight className="w-5 h-5" />
      </LocalizedLink>
      <a
        href={`https://wa.me/${LAVILLA_PHONE.replace(/\D/g, "")}?text=${encodeURIComponent(whatsappMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("whatsapp_click", { page_path: pathname, context: `room_page:${house}:${n}`, language })}
        className="mt-3 w-full inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#E7E5E4] text-[#1C1917] text-sm font-semibold rounded-xl hover:border-[#1C1917] transition-colors"
      >
        {en ? "Ask a question on WhatsApp" : "Poser une question sur WhatsApp"}
      </a>
      <ul className="mt-5 space-y-2">
        {reassurance.map((r) => (
          <li key={r} className="flex items-start gap-2 text-sm text-[#57534E]">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#B8860B]" />
            <span>{r}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  // Les autres fiches consultables de la maison, puis toutes les chambres disponibles.
  const othersSection = (title: string) => (
    <section className="py-14 lg:py-20 bg-[#FAF9F6] border-y border-[#E7E5E4]">
      <div className="container-custom">
        {others.length > 0 && (
          <>
            <h2 className="text-2xl md:text-3xl text-[#1C1917] mb-6" style={heading}>{title}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
              {others.map((r) => {
                const st = roomStatus(r, en);
                const m2 = roomSurface(r);
                return (
                  <li key={r.room_number}>
                    <LocalizedLink
                      to={roomPagePath(house, r.room_number)}
                      className="flex items-center justify-between gap-3 bg-white rounded-xl border border-[#E7E5E4] px-4 py-3 hover:border-[#1C1917] transition-colors"
                    >
                      <span>
                        <span className="block font-black text-[#1C1917]">{en ? `Room ${r.room_number}` : `Chambre ${r.room_number}`}</span>
                        <span className="block text-sm text-[#78716C]">{[m2 !== null ? `${m2} m²` : null, floorLabel(r, L)].filter(Boolean).join(" · ")}</span>
                      </span>
                      <span className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${BADGE_PANEL_CLASS[st.tone]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${BADGE_DOT_CLASS[st.tone]}`} aria-hidden="true" />
                        {st.badge}
                      </span>
                    </LocalizedLink>
                  </li>
                );
              })}
            </ul>
          </>
        )}
        <p className="text-[#57534E]">
          {en ? "Looking at other houses too? " : "Tu regardes aussi les autres maisons ? "}
          <LocalizedLink to="/chambres-disponibles" className="font-semibold text-[#1C1917] underline underline-offset-4 hover:text-[#B8860B]">
            {en ? "See every available room" : "Voir toutes les chambres disponibles"}
          </LocalizedLink>
        </p>
      </div>
    </section>
  );

  // Chambre occupée sans date : fiche NON consultable (demande Jérôme du 28/09/2026). La route
  // reste (un lien déjà partagé ne tombe pas en erreur) mais n'affiche ni photos, ni prix, ni
  // caractéristiques : un message, puis les chambres à réserver. Aucun lien du site n'y mène.
  if (room && !isRoomPageOpen(house, room)) {
    return (
      <main className="bg-white">
        <SEO
          title={en ? `${roomName} — ${houseLabel}: not available` : `${roomName} — ${houseLabel} : pas disponible`}
          description={
            en
              ? `${roomName} at ${houseLabel} isn't available right now. See the rooms you can book at ${houseLabel} and in our other houses near Geneva.`
              : `La ${roomName.toLowerCase()} ${ofHouse(houseLabel)} n'est pas disponible pour le moment. Découvre les chambres à réserver ${atHouse(houseLabel)} et dans nos autres maisons près de Genève.`
          }
          noindex
        />
        <section className="pt-28 pb-14 lg:pt-32 lg:pb-20">
          <div className="container-custom">
            <nav aria-label={en ? "Breadcrumb" : "Fil d'Ariane"} className="flex flex-wrap items-center gap-1 text-sm text-[#78716C] mb-5">
              <LocalizedLink to="/nos-maisons" className="hover:text-[#1C1917] underline-offset-4 hover:underline">{en ? "Our houses" : "Nos maisons"}</LocalizedLink>
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
              <LocalizedLink to={`/${house}`} className="hover:text-[#1C1917] underline-offset-4 hover:underline">{houseLabel}</LocalizedLink>
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
              <span className="text-[#1C1917]">{roomName}</span>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B8860B] mb-2">{houseLabel} · {facts.commune}</p>
            <h1 className="text-3xl md:text-4xl text-[#1C1917] mb-4 max-w-3xl" style={heading}>
              {en ? "This room isn't available right now" : "Cette chambre n'est pas disponible pour le moment"}
            </h1>
            <p className="text-[#57534E] leading-relaxed max-w-2xl">
              {en
                ? `${roomName} at ${houseLabel} is occupied. Have a look at the rooms that are free now or soon — you can apply today to reserve one.`
                : `La ${roomName.toLowerCase()} ${ofHouse(houseLabel)} est occupée. Regarde les chambres libres maintenant ou bientôt\u00a0: tu peux candidater dès aujourd'hui pour en réserver une.`}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <LocalizedLink
                to={`/${house}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#D4A574] text-[#1C1917] font-bold rounded-xl hover:bg-[#E0BB8A] transition-colors"
              >
                {en ? `See the rooms at ${houseLabel}` : `Voir les chambres ${ofHouse(houseLabel)}`}
                <ArrowRight className="w-5 h-5" />
              </LocalizedLink>
              <LocalizedLink
                to="/chambres-disponibles"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-[#E7E5E4] text-[#1C1917] font-semibold rounded-xl hover:border-[#1C1917] transition-colors"
              >
                {en ? "Every available room" : "Toutes les chambres disponibles"}
              </LocalizedLink>
            </div>
          </div>
        </section>
        {othersSection(en ? `Rooms you can book at ${houseLabel}` : `Les chambres à réserver ${atHouse(houseLabel)}`)}
        {/* État chambres embarqué au prérendu (hydratation sans fetch) — instance unique. */}
        <RoomsEmbed house={house} />
        <WhatsAppButton context={houseLabel} />
      </main>
    );
  }

  return (
    <main className="bg-white">
      {/* SEO rendu seulement quand la chambre est connue : au prérendu, un premier rendu sans
          données puis un second avec laissaient DEUX blocs LocalBusiness (react-helmet ne retirait
          pas le premier) — refusé par check:facts. Prérendu et hydratation ont toujours la donnée. */}
      {room && (
        <SEO
          title={title}
          description={description}
          noindex
          image={cover ? `${SITE}${encodeURI(cover.src)}` : undefined}
        />
      )}

      {/* En-tête : fil d'Ariane, maison, n°, caractéristiques, disponibilité. */}
      <section className="pt-28 pb-6 lg:pt-32">
        <div className="container-custom">
          <nav aria-label={en ? "Breadcrumb" : "Fil d'Ariane"} className="flex flex-wrap items-center gap-1 text-sm text-[#78716C] mb-5">
            <LocalizedLink to="/nos-maisons" className="hover:text-[#1C1917] underline-offset-4 hover:underline">{en ? "Our houses" : "Nos maisons"}</LocalizedLink>
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
            <LocalizedLink to={`/${house}`} className="hover:text-[#1C1917] underline-offset-4 hover:underline">{houseLabel}</LocalizedLink>
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
            <span className="text-[#1C1917]">{roomName}</span>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B8860B] mb-2">{houseLabel} · {facts.commune}</p>
          <h1 className="text-4xl md:text-5xl text-[#1C1917] mb-3" style={heading}>
            {en ? `${roomName} at ${houseLabel}` : `${roomName} ${atHouse(houseLabel)}`}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            {specsLine && <p className="text-[#57534E]">{specsLine}</p>}
            {status.badge && (
              <span className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-full ${BADGE_PANEL_CLASS[status.tone]}`}>
                <span className={`w-2 h-2 rounded-full ${BADGE_DOT_CLASS[status.tone]}`} aria-hidden="true" />
                {status.badge}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Galerie : grande photo + 4 vignettes (ordinateur), photo + compteur (mobile), onglets par section. */}
      {photos.length > 0 && (
        <section className="pb-10">
          <div className="container-custom">
            <div className="relative md:grid md:grid-cols-4 md:grid-rows-2 md:gap-2 md:h-[460px] lg:h-[520px] rounded-2xl overflow-hidden">
              {photos.slice(0, 5).map((p, i) => (
                <button
                  key={p.src}
                  type="button"
                  onClick={() => openPhotos(i, "mosaic")}
                  className={`relative block w-full overflow-hidden cursor-zoom-in group ${
                    i === 0 ? "aspect-[4/3] md:aspect-auto md:col-span-2 md:row-span-2 md:h-full" : "hidden md:block md:h-full"
                  }`}
                  aria-label={en ? `Open photo ${i + 1} of ${photos.length}` : `Ouvrir la photo ${i + 1} sur ${photos.length}`}
                >
                  <img
                    src={p.src}
                    alt={p.alt[L]}
                    width={p.w}
                    height={p.h}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    loading={i === 0 ? "eager" : "lazy"}
                    {...(i === 0 ? { fetchPriority: "high" as const } : {})}
                    {...responsiveImage(p.src, i === 0 ? "(min-width: 768px) 50vw, 100vw" : "25vw")}
                  />
                </button>
              ))}
              <button
                type="button"
                onClick={() => openPhotos(0, "all_photos")}
                className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 text-[#1C1917] text-sm font-semibold shadow-md hover:bg-white"
              >
                <Images className="w-4 h-4" />
                {en ? `See the ${photos.length} photos` : `Voir les ${photos.length} photos`}
              </button>
            </div>
            {/* Lodge : les photos de chambre sont celles d'une chambre standard (pack commun aux
                12 chambres) — dit sous la galerie ET dans la légende de chaque photo (roomPhotos.ts). */}
            {house === "lelodge" && (
              <p className="mt-3 text-sm text-[#78716C]">
                {en
                  ? `Room photos: a standard ${houseLabel} room — all ${facts.rooms} rooms are fitted out to the same design.`
                  : `Photos de chambre\u00a0: une chambre standard ${ofHouse(houseLabel)} — les ${facts.rooms} chambres sont aménagées sur le même modèle.`}
              </p>
            )}
            {sections && sections.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {sections.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => openPhotos(sectionStart(s.key), `section_${s.key}`)}
                    className="px-4 py-2 rounded-full border border-[#E7E5E4] text-sm text-[#44403C] hover:border-[#1C1917] transition-colors"
                  >
                    {SECTION_LABELS[s.key][L]} <span className="text-[#A8A29E]">({s.photos.length})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Contenu + carte prix (collante sur ordinateur). */}
      <section className="pb-16 lg:pb-24">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="lg:hidden">{priceCard}</div>

            <div>
              <h2 className="text-2xl md:text-3xl text-[#1C1917] mb-4" style={heading}>{en ? "The room" : "La chambre"}</h2>
              <p className="text-[#57534E] leading-relaxed max-w-2xl">{roomIntro(house, n, facts.rooms, en)}</p>
              <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 rounded-xl border border-[#E7E5E4] px-4 py-3">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#B8860B]" aria-hidden="true" />
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-[#78716C]">{label}</dt>
                      <dd className="text-[#1C1917] font-semibold">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl text-[#1C1917] mb-4" style={heading}>{en ? "Everything is included" : "Tout est inclus dans le loyer"}</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[#44403C]">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#B8860B]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl text-[#1C1917] mb-4" style={heading}>{en ? "Lease and conditions" : "Bail et conditions"}</h2>
              <p className="text-[#57534E] leading-relaxed max-w-2xl">{lease}</p>
              <p className="text-[#57534E] leading-relaxed max-w-2xl mt-2">
                {en
                  ? `Deposit of ${ENTITY_FACTS.depositMonths} months' rent excluding charges, no application or agency fee.`
                  : `Caution de ${ENTITY_FACTS.depositMonths} mois de loyer hors charges, 0 € de frais de dossier et d'agence.`}
              </p>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl text-[#1C1917] mb-4" style={heading}>
                {en ? `The house: ${houseLabel}` : `La maison : ${houseLabel}`}
              </h2>
              <p className="text-[#57534E] leading-relaxed max-w-2xl">
                {en
                  ? `${houseLabel} in ${facts.commune}, ${facts.rooms} rooms — ${facts.amenities.en}.`
                  : `${houseLabel} à ${facts.commune}, ${facts.rooms} chambres — ${facts.amenities.fr}.`}
              </p>
              <ul className="mt-3 space-y-1.5">
                {facts.commute[L].split(" · ").map((c) => (
                  <li key={c} className="flex items-start gap-2 text-[#44403C]">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#B8860B]" aria-hidden="true" />
                    <span>{c.charAt(0).toUpperCase() + c.slice(1)}</span>
                  </li>
                ))}
              </ul>
              <LocalizedLink to={`/${house}`} className="mt-5 inline-flex items-center gap-2 font-semibold text-[#1C1917] underline underline-offset-4 hover:text-[#B8860B]">
                {en ? `Discover ${houseLabel}` : `Découvrir ${houseLabel}`}
                <ArrowRight className="w-4 h-4" />
              </LocalizedLink>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24">{priceCard}</div>
          </aside>
        </div>
      </section>

      {othersSection(en ? `The other rooms at ${houseLabel}` : `Les autres chambres ${ofHouse(houseLabel)}`)}

      {/* État chambres embarqué au prérendu (hydratation sans fetch) — instance unique. */}
      <RoomsEmbed house={house} />

      {viewer !== null && photos.length > 0 && (
        <Suspense fallback={null}>
          <PhotoLightbox
            photos={photos}
            index={viewer}
            onIndexChange={setViewer}
            onClose={() => setViewer(null)}
            en={en}
            title={`${roomName} — ${houseLabel}`}
          />
        </Suspense>
      )}

      {/* CTA collante MOBILE, comme sur les pages maisons. */}
      <div className="md:hidden h-20" aria-hidden="true" />
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-[#E7E5E4] px-4 py-3">
        <LocalizedLink
          to={applyTo}
          onClick={() => onApply("sticky_mobile_room")}
          className="flex items-center justify-center gap-3 w-full bg-[#D4A574] text-[#1C1917] px-4 py-2.5 rounded-lg"
        >
          <span className="flex flex-col items-center leading-tight">
            <span className="text-sm font-semibold">{status.cta}</span>
            <span className="text-[11px] text-[#1C1917]/75">
              {en ? `Reply within ${ENTITY_FACTS.responseHours}h` : `Réponse sous ${ENTITY_FACTS.responseHours} h`}
            </span>
          </span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </LocalizedLink>
      </div>
      <WhatsAppButton context={`${roomName} — ${houseLabel}`} message={whatsappMessage} bottomClass="bottom-20 md:bottom-6" />
    </main>
  );
}
