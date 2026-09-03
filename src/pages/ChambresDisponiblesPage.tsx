import { lazy, Suspense, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { SEO } from "@/components/SEO";
import { LocalizedLink } from "@/components/LocalizedLink";
import { FaqSection } from "@/components/FaqSection";
import { RoomCard } from "@/components/RoomCard";
import { RoomsEmbed } from "@/components/RoomsEmbed";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { HOUSES } from "@/data/houses";
import { roomGallery } from "@/data/roomPhotos";
import { STATS, PRICE_SHARED_CHF_FR, PRICE_SHARED_CHF_EN } from "@/data/stats";
import { tarifsFaq } from "@/data/faq/tarifsFaq";
import { maisonsFaq } from "@/data/faq/maisonsFaq";
import {
  useAllRooms,
  useRoomAvailability,
  splitRooms,
  formatFreeDate,
  globalAvailabilityLabel,
  BADGE_DOT_CLASS,
  type BadgeTone,
  type HouseKey,
  type PublicRoom,
} from "@/lib/availability";

/**
 * /chambres-disponibles · /en/chambres-disponibles — Lot 3 du plan SEO funnel (02/09/2026,
 * validé le 03/09). La disponibilité devient un objet de première classe : une page
 * indexable qui liste TOUTES les chambres libres ou à libérer des 3 maisons, avec date et
 * prix, un CTA à deux paramètres par chambre, et la liste d'attente par maison quand il n'y
 * a rien — jamais le mot « complet » (décisions Q3, Q4, Q12, Q13).
 *
 * Données : le store partagé (v_public_rooms) — `useAllRooms()` lit l'embed sérialisé par
 * `<RoomsEmbed />` (29 lignes) de façon SYNCHRONE : premier rendu client = HTML prérendu,
 * zéro #418. Les filtres (?maison=, ?sdb=) ne sont appliqués qu'APRÈS hydratation (effet),
 * pour la même raison. Remplace la LP payante /chambres-septembre (301 dans vercel.json).
 */
const PhotoLightbox = lazy(() => import("@/components/PhotoLightbox"));

const HOUSE_ORDER: HouseKey[] = ["lavilla", "leloft", "lelodge"];
type BathFilter = "privative" | "partagee";
const isHouseKey = (v: string | null): v is HouseKey => v === "lavilla" || v === "leloft" || v === "lelodge";
const isBathFilter = (v: string | null): v is BathFilter => v === "privative" || v === "partagee";

// `true` seulement après hydratation : pendant l'hydratation React lit le snapshot serveur
// (false) → premier rendu client = HTML prérendu (liste complète), puis re-rendu filtré.
const noopSubscribe = () => () => {};
const useHydrated = () => useSyncExternalStore(noopSubscribe, () => true, () => false);

function track(event: string, params: Record<string, unknown>) {
  try {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", event, params);
  } catch { /* noop */ }
}

export function ChambresDisponiblesPage() {
  const { language } = useLanguage();
  const en = language === "en";
  const L = en ? "en" as const : "fr" as const;
  const prefix = en ? "/en" : "";

  const all = useAllRooms();
  const availability = useRoomAvailability();
  const { candidates } = splitRooms(all.rooms);

  // Filtres pilotés par l'URL (Q4) — l'URL EST l'état ; lus après hydratation seulement.
  const [searchParams, setSearchParams] = useSearchParams();
  const hydrated = useHydrated();
  const maisonParam = searchParams.get("maison");
  const sdbParam = searchParams.get("sdb");
  const houseFilter: HouseKey | null = hydrated && isHouseKey(maisonParam) ? maisonParam : null;
  const bathFilter: BathFilter | null = hydrated && isBathFilter(sdbParam) ? sdbParam : null;
  const applyFilter = (next: { maison?: HouseKey | null; sdb?: BathFilter | null }) => {
    const params = new URLSearchParams(searchParams);
    const maison = next.maison === undefined ? houseFilter : next.maison;
    const sdb = next.sdb === undefined ? bathFilter : next.sdb;
    if (maison) params.set("maison", maison); else params.delete("maison");
    if (sdb) params.set("sdb", sdb); else params.delete("sdb");
    setSearchParams(params, { replace: true });
    track("filter_change", { page: "chambres_disponibles", maison: maison ?? "all", sdb: sdb ?? "all", language });
  };
  const shown = candidates.filter((r) =>
    (!houseFilter || r.house_slug === houseFilter) &&
    (!bathFilter || (bathFilter === "privative" ? r.bathroom_type === "private" : r.bathroom_type !== "private")),
  );
  const filtered = houseFilter !== null || bathFilter !== null;

  // Visionneuse — une seule à la fois, chargée à la demande.
  const [viewer, setViewer] = useState<{ house: HouseKey; roomNumber: number; index: number } | null>(null);
  const openPhotos = (room: PublicRoom, photoIndex: number) => {
    setViewer({ house: room.house_slug, roomNumber: room.room_number, index: photoIndex });
    track("photo_lightbox_open", {
      room_id: `chambre-${room.room_number}`, property_interest: room.house_slug, photo_index: photoIndex, page: "chambres_disponibles",
    });
  };
  const onRoomCta = (room: PublicRoom) => {
    track("cta_click", {
      cta_position: "available_room_card", cta_target: "/candidature", house: room.house_slug,
      room_id: `chambre-${room.room_number}`, language,
    });
  };

  // Prochaines disponibilités par maison (résumés embarqués) — jamais « complet ».
  const houseLine = (house: HouseKey): { text: string; tone: BadgeTone } => {
    const h = availability.byHouse[house];
    if (availability.known && h.available > 0) {
      return {
        tone: "available",
        text: en
          ? `${h.available} room${h.available > 1 ? "s" : ""} available now`
          : `${h.available} chambre${h.available > 1 ? "s" : ""} libre${h.available > 1 ? "s" : ""} maintenant`,
      };
    }
    if (availability.known && h.nextFreeDate) {
      const n = h.nextFreeCount || 1;
      return {
        tone: "upcoming",
        text: en
          ? `${n} room${n > 1 ? "s" : ""} opening from ${formatFreeDate(h.nextFreeDate, "en")}`
          : `${n} chambre${n > 1 ? "s" : ""} dès le ${formatFreeDate(h.nextFreeDate, "fr")}`,
      };
    }
    return { tone: "full", text: en ? "no date announced yet — join the waiting list" : "pas de date annoncée pour l'instant — rejoins la liste d'attente" };
  };

  const title = en ? "Available rooms near Geneva" : "Chambres disponibles près de Genève";
  const description = en
    ? `Every room free now or opening soon in our ${STATS.totalHouses} houses near Geneva, with date and all-inclusive price from ${PRICE_SHARED_CHF_EN}. Reply within 48 h.`
    : `Toutes les chambres libres ou à libérer dans nos ${STATS.totalHouses} maisons près de Genève, avec date et prix tout inclus dès ${PRICE_SHARED_CHF_FR}. Réponse sous 48 h.`;

  // JSON-LD ItemList d'Offer (Lot 7.3 anticipé) — dérivé du même snapshot que le rendu,
  // sans filtre : identique au prérendu et au premier rendu client.
  const itemList = candidates.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: en ? "Available rooms — La Villa Coliving" : "Chambres disponibles — La Villa Coliving",
        numberOfItems: candidates.length,
        itemListElement: candidates.map((r, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Offer",
            name: `${HOUSES[r.house_slug].label} — ${en ? "Room" : "Chambre"} ${r.room_number}`,
            url: `https://www.lavillacoliving.com${prefix}/${r.house_slug}`,
            ...(r.rent_chf !== null ? { price: r.rent_chf, priceCurrency: "CHF" } : {}),
            availability: r.availability === "available" ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
            ...(r.available_from ? { availabilityStarts: r.available_from } : {}),
            itemOffered: {
              "@type": "Accommodation",
              name: `${en ? "Room" : "Chambre"} ${r.room_number} — ${HOUSES[r.house_slug].label}`,
              ...(r.surface_m2 ? { floorSize: { "@type": "QuantitativeValue", value: Number(r.surface_m2), unitCode: "MTK" } } : {}),
            },
          },
        })),
      }
    : undefined;

  const reassurance = en
    ? ["No agency fee, no application fee", "Reply within 48 hours", "Video tour available", `${STATS.totalResidents}+ residents since ${STATS.foundedYear}`, "All inclusive: bills, fibre, cleaning, pool, sauna, gym", "20 min from Geneva city centre"]
    : ["0 frais d'agence ni de dossier", "Réponse sous 48 h", "Visite en visio possible", `${STATS.totalResidents}+ résidents depuis ${STATS.foundedYear}`, "Tout inclus : charges, fibre, ménage, piscine, sauna, gym", "20 min du centre de Genève"];

  const faqItems = [...maisonsFaq[L].slice(0, 2), ...tarifsFaq[L].slice(0, 2)];

  const chip = (active: boolean) =>
    `px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
      active ? "bg-[#1C1917] text-white border-[#1C1917]" : "bg-white text-[#44403C] border-[#E7E5E4] hover:border-[#1C1917]"
    }`;

  return (
    <main className="bg-white">
      <SEO title={title} description={description} jsonLd={itemList} />

      {/* Hero — léger (pas d'image : LCP = le H1), même grammaire que /nos-maisons. */}
      <section className="pt-32 pb-14 lg:pt-40 lg:pb-20 bg-[#F5F2ED]">
        <div className="container-custom">
          <span className="text-xs text-[#78716C] uppercase tracking-[0.3em] mb-4 block">
            {en ? `${STATS.totalRooms} rooms · ${STATS.totalHouses} houses` : `${STATS.totalRooms} chambres · ${STATS.totalHouses} maisons`}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#1C1917] mb-5" style={{ fontFamily: '"DM Serif Display", serif' }}>
            {en ? "Available rooms" : "Chambres disponibles"}
          </h1>
          <p className="text-lg text-[#44403C] max-w-2xl inline-flex items-center gap-2">
            <span className="w-2 h-2 bg-[#B8860B] rounded-full animate-pulse shrink-0" aria-hidden="true" />
            {globalAvailabilityLabel(availability, L)}
          </p>
          <p className="mt-3 text-[#57534E] max-w-2xl">
            {en
              ? `Furnished private rooms in ${STATS.totalHouses} coliving houses on the French side of Geneva, 20 minutes from the centre. All inclusive from ${PRICE_SHARED_CHF_EN}/month, deposit of 2 months' rent excluding charges, no agency or application fee.`
              : `Chambres privées meublées dans ${STATS.totalHouses} maisons de coliving côté France, à 20 minutes du centre de Genève. Tout inclus dès ${PRICE_SHARED_CHF_FR}/mois, caution de 2 mois de loyer hors charges, 0 frais d'agence ni de dossier.`}
          </p>
        </div>
      </section>

      {/* Filtres (Q4) — appliqués après hydratation, URL partageable. */}
      <section className="py-8 border-b border-[#E7E5E4]">
        <div className="container-custom flex flex-wrap items-center gap-3">
          <span className="text-xs uppercase tracking-wider text-[#78716C] mr-1">{en ? "House" : "Maison"}</span>
          <button type="button" className={chip(houseFilter === null)} onClick={() => applyFilter({ maison: null })}>
            {en ? "All" : "Toutes"}
          </button>
          {HOUSE_ORDER.map((k) => (
            <button key={k} type="button" className={chip(houseFilter === k)} onClick={() => applyFilter({ maison: houseFilter === k ? null : k })}>
              {HOUSES[k].label}
            </button>
          ))}
          <span className="text-xs uppercase tracking-wider text-[#78716C] ml-4 mr-1">{en ? "Bathroom" : "Salle d'eau"}</span>
          <button type="button" className={chip(bathFilter === null)} onClick={() => applyFilter({ sdb: null })}>
            {en ? "All" : "Toutes"}
          </button>
          <button type="button" className={chip(bathFilter === "privative")} onClick={() => applyFilter({ sdb: bathFilter === "privative" ? null : "privative" })}>
            {en ? "Private" : "Privative"}
          </button>
          <button type="button" className={chip(bathFilter === "partagee")} onClick={() => applyFilter({ sdb: bathFilter === "partagee" ? null : "partagee" })}>
            {en ? "Shared" : "Partagée"}
          </button>
        </div>
      </section>

      {/* Les chambres — libres maintenant puis libérations datées (splitRooms). */}
      <section className="py-14 lg:py-20">
        <div className="container-custom">
          {shown.length > 0 ? (
            <>
              <h2 className="text-2xl md:text-3xl font-light text-[#1C1917] mb-8" style={{ fontFamily: '"DM Serif Display", serif' }}>
                {en
                  ? `${shown.length} room${shown.length > 1 ? "s" : ""} free now or opening soon`
                  : `${shown.length} chambre${shown.length > 1 ? "s" : ""} libre${shown.length > 1 ? "s" : ""} maintenant ou bientôt`}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shown.map((room) => (
                  <RoomCard
                    key={`${room.house_slug}:${room.room_number}`}
                    house={room.house_slug}
                    houseName={HOUSES[room.house_slug].label}
                    room={room}
                    fallbackImage={HOUSES[room.house_slug].img}
                    showHouse
                    onOpenPhotos={openPhotos}
                    onCtaClick={onRoomCta}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="bg-[#FAF9F6] border border-[#E7E5E4] rounded-2xl p-8 md:p-10 text-center">
              <h2 className="text-2xl md:text-3xl font-light text-[#1C1917] mb-3" style={{ fontFamily: '"DM Serif Display", serif' }}>
                {filtered
                  ? (en ? "No room matches this filter right now" : "Aucune chambre ne correspond à ce filtre pour l'instant")
                  : (en ? "No room is free right this moment" : "Aucune chambre libre à l'instant même")}
              </h2>
              <p className="text-[#57534E] max-w-xl mx-auto">
                {en
                  ? "Rooms open up all year round. Join the waiting list of the house you prefer: we reply within 48 hours and offer you the next room that frees up."
                  : "Des chambres se libèrent toute l'année. Rejoins la liste d'attente de la maison qui te plaît : on te répond sous 48 h et on te propose la prochaine libération."}
              </p>
              {filtered && (
                <button type="button" onClick={() => applyFilter({ maison: null, sdb: null })} className="mt-5 text-sm font-semibold underline underline-offset-4 text-[#1C1917]">
                  {en ? "Show all houses" : "Voir toutes les maisons"}
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Prochaines disponibilités et liste d'attente par maison (Q3) — toujours présent :
          la page vend la PROCHAINE libération, pas l'occupation du jour. */}
      <section className="py-14 lg:py-20 bg-[#FAF9F6] border-y border-[#E7E5E4]">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-light text-[#1C1917] mb-2" style={{ fontFamily: '"DM Serif Display", serif' }}>
            {en ? "Next openings, house by house" : "Prochaines disponibilités, maison par maison"}
          </h2>
          <p className="text-[#57534E] mb-8">
            {en
              ? "Not the right room, or not the right date? Leave your details for a house: you'll be the first to hear when a room opens up."
              : "Pas la bonne chambre, ou pas la bonne date ? Laisse tes coordonnées pour une maison : tu seras prévenu en premier dès qu'une chambre se libère."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOUSE_ORDER.map((k) => {
              const line = houseLine(k);
              return (
                <div key={k} className="bg-white border border-[#E7E5E4] rounded-2xl overflow-hidden flex flex-col">
                  <LocalizedLink to={`/${k}`} className="block relative aspect-[16/9] overflow-hidden">
                    <img src={HOUSES[k].img} alt={HOUSES[k].label} className="w-full h-full object-cover" loading="lazy" width={800} height={450} />
                  </LocalizedLink>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-black text-[#1C1917]">{HOUSES[k].label}</h3>
                    <p className="text-xs text-[#78716C] mb-3">{en ? HOUSES[k].descEn : HOUSES[k].descFr}</p>
                    <p className="text-sm text-[#44403C] inline-flex items-start gap-2 mb-5">
                      <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${BADGE_DOT_CLASS[line.tone]}`} aria-hidden="true" />
                      <span>{line.text}</span>
                    </p>
                    <LocalizedLink
                      to={`/candidature?property_interest=${k}&room_interest=liste-attente`}
                      onClick={() => track("cta_click", { cta_position: "waitlist", cta_target: "/candidature", house: k, language })}
                      className="mt-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-[#1C1917] text-[#1C1917] text-sm font-semibold rounded-lg hover:bg-[#1C1917] hover:text-white transition-colors"
                    >
                      {en ? "Join the waiting list" : "Rejoindre la liste d'attente"}
                      <ArrowRight className="w-4 h-4" />
                    </LocalizedLink>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Réassurance — liste de la LP, sans « 3 mois minimum » (Q13), 20 min (Q9). */}
      <section className="py-14 lg:py-20">
        <div className="container-custom">
          <ul className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reassurance.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-xl border border-[#E7E5E4] bg-white px-5 py-4">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#b8860b]" />
                <span className="text-sm text-[#44403C]">{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-center text-[#57534E]">
            {en ? "A question before applying? " : "Une question avant de candidater ? "}
            <LocalizedLink to="/faq" className="underline underline-offset-4 hover:text-[#1C1917]">
              {en ? "Read the FAQ" : "Lis la FAQ"}
            </LocalizedLink>
            {en ? " or message us on WhatsApp — we answer fast." : " ou écris-nous sur WhatsApp, on répond vite."}
          </p>
        </div>
      </section>

      <FaqSection
        title={en ? "Rooms and prices — frequently asked questions" : "Questions fréquentes sur les chambres et les prix"}
        items={faqItems}
        emitSchema
      />

      {/* État chambres embarqué au prérendu — TOUTES maisons, instance unique par page. */}
      <RoomsEmbed />

      {viewer && roomGallery(viewer.house, viewer.roomNumber) && (
        <Suspense fallback={null}>
          <PhotoLightbox
            photos={roomGallery(viewer.house, viewer.roomNumber)!}
            index={viewer.index}
            onIndexChange={(i) => setViewer((v) => (v ? { ...v, index: i } : v))}
            onClose={() => setViewer(null)}
            en={en}
            title={`${HOUSES[viewer.house].label} — ${en ? `Room ${viewer.roomNumber}` : `Chambre ${viewer.roomNumber}`}`}
          />
        </Suspense>
      )}

      <WhatsAppButton context="chambres-disponibles" />
    </main>
  );
}
