import { lazy, Suspense, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowRight, BedDouble, Check, ChevronRight, Images, MapPin, Maximize, Minus, ShowerHead } from "lucide-react";
import { SEO } from "@/components/SEO";
import { LocalizedLink } from "@/components/LocalizedLink";
import { RoomsEmbed } from "@/components/RoomsEmbed";
import { WhatsAppBarLink, WhatsAppButton } from "@/components/WhatsAppButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { APPART } from "@/data/appart";
import { appartGammeExempt } from "@/data/appartFacts";
import {
  appartRoomBreadcrumb,
  appartRoomDescription,
  appartRoomH1,
  appartRoomIncluded,
  appartRoomIntro,
  appartRoomLabels,
  appartRoomLease,
  appartRoomOthersTitle,
  appartRoomPhotoNote,
  appartRoomPlace,
  appartRoomPrice,
  appartRoomReassurance,
  appartRoomSpecs,
  appartRoomStatus,
  appartRoomTitle,
  appartRoomUnavailable,
  appartRoomWhatsapp,
  appartDateWords,
  appartTypeCards,
  isAppartSuite,
} from "@/data/appartPage";
import { LAPPART_ALBUM, LAPPART_HERO, LAPPART_ROOM_PHOTOS } from "@/data/appartPhotos";
import { isRoomPageOpen, parseRoomPagePath, roomPagePath } from "@/data/roomPages";
import { isAppartKey, roomLabel } from "@/data/places";
import { responsiveImage } from "@/lib/responsiveImage";
import { LAVILLA_PHONE } from "@/lib/structuredData";
import {
  BADGE_PANEL_CLASS,
  BADGE_DOT_CLASS,
  roomBadge,
  splitRooms,
  useAllRooms,
  useHouseRooms,
  type PublicRoom,
} from "@/lib/availability";

/**
 * Fiche d'une chambre de L'Appart — /lappart/chambre-2 à /lappart/chambre-5 (la suite), FR et EN, NON indexées (décision P6 du
 * brief du 12/11/2026 ; étape E3). Faite pour être partagée (annonces, WhatsApp) : pièces communes en photo (« Photo de la
 * chambre à venir »), caractéristiques, prix, compris / pas compris, conditions, emplacement, candidature à deux paramètres.
 *
 * Une page à part : la fiche des maisons (RoomDetailPage) écrit « linge fourni », « ménage 3 fois par semaine » et les
 * équipements des maisons, faux ici. Textes : src/data/appartPage.ts (source du 13/11/2026, au caractère près).
 * Faits de l'offre (prix, surface, salle d'eau ; jamais l'étage, V2-33) : APPART — la fiche est complète même quand la vue n'a pas encore
 * L'Appart (état A : une route qui échoue fait échouer tout le prérendu). Disponibilité (pastille, date) : la vue seulement.
 * Chambre occupée sans date (état B+) : la fiche dit « pas disponible » et renvoie vers /lappart, comme pour les maisons.
 *
 * Hydratation : état embarqué des lignes de L'Appart (RoomsEmbed), dates par appartDateWords (pure ; au mois pour l'ouverture,
 * V2-22 du 19/11/2026 : jamais le jour). Balises SEO posées UNE fois,
 * quand l'état est connu (la vue chargée) : des balises Helmet qui changent entre deux rendus laissent un doublon au prérendu
 * (piège du 08/10/2026, mêmes précautions que les fiches des maisons) ; le HTML prérendu les porte déjà au premier rendu.
 */
const PhotoLightbox = lazy(() => import("@/components/PhotoLightbox"));

const SITE = "https://www.lavillacoliving.com";
const heading = { fontFamily: '"DM Serif Display", serif' };

function track(event: string, params: Record<string, unknown>) {
  try {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", event, params);
  } catch { /* noop — l'analytics ne bloque jamais l'UI */ }
}

const SPEC_ICONS = { size: Maximize, bath: ShowerHead, furniture: BedDouble } as const;

export function AppartRoomPage() {
  const { pathname } = useLocation();
  const { language } = useLanguage();
  const L = language === "en" ? "en" as const : "fr" as const;
  const en = L === "en";

  const parsed = parseRoomPagePath(pathname);
  const n = parsed && isAppartKey(parsed.house) ? parsed.roomNumber : 0;
  const appartRooms = useHouseRooms(APPART.key);
  const houseRooms = useAllRooms();
  // L'état est connu dès que la vue est chargée : avec les lignes de L'Appart (état B) ou sans (état A, maisons seules).
  const settled = appartRooms.known || houseRooms.known;
  const room: PublicRoom<"lappart"> | undefined = appartRooms.rooms.find((r) => r.room_number === n);
  const [viewer, setViewer] = useState<number | null>(null);

  if (!n) {
    return (
      <main className="pt-32 pb-20 bg-white">
        <div className="container-custom text-center">
          <h1 className="text-3xl mb-4 text-[#1C1917]" style={heading}>{en ? "Room not found" : "Chambre introuvable"}</h1>
          <LocalizedLink to="/chambres-disponibles" className="text-[#B8860B] font-semibold underline underline-offset-4">
            {en ? "See the available rooms" : "Voir les chambres disponibles"}
          </LocalizedLink>
        </div>
      </main>
    );
  }

  const suite = isAppartSuite(n);
  const roomName = roomLabel(APPART.key, n, L);
  const labels = appartRoomLabels(L);
  const crumbs = appartRoomBreadcrumb(n, L);
  const eyebrow = `${APPART.name} · ${APPART.commune}`;
  // (21/11/2026) La chambre d'abord (photo type pour les chambres de 12 m², la suite pour la 5), puis les pièces communes.
  const photos = [...(LAPPART_ROOM_PHOTOS[`${APPART.key}:${n}`] ?? []), ...LAPPART_ALBUM];
  // Date de la vue (état B) : seulement si la chambre n'est pas libre maintenant ; jamais calculée.
  const availableNow = room?.availability === "available";
  const date = room && !availableNow && room.available_from ? appartDateWords(room.available_from, L) || null : null;
  const badge = room ? roomBadge(room, L) : null;
  const price = appartRoomPrice(n, L);
  const specsLine = appartTypeCards(L)[suite ? 1 : 0].specs;
  const applyTo = `/candidature?property_interest=${APPART.key}&room_interest=chambre-${n}`;
  const whatsappMessage = appartRoomWhatsapp(n, L, date);
  const others = splitRooms(appartRooms.rooms.filter((r) => r.room_number !== n && isRoomPageOpen(APPART.key, r))).candidates;

  const openPhotos = (index: number, origin: string) => {
    setViewer(index);
    track("photo_lightbox_open", { room_id: `chambre-${n}`, property_interest: APPART.key, photo_index: index, page: "room_page", origin });
  };
  const onApply = (position: string) =>
    track("cta_click", { cta_position: position, cta_target: "/candidature", house: APPART.key, room_id: `chambre-${n}`, language });

  const breadcrumb = (
    <nav aria-label={en ? "Breadcrumb" : "Fil d'Ariane"} className="flex flex-wrap items-center gap-1 text-sm text-[#78716C] mb-5">
      <LocalizedLink to="/" className="hover:text-[#1C1917] underline-offset-4 hover:underline">{crumbs[0]}</LocalizedLink>
      <ChevronRight className="w-4 h-4" aria-hidden="true" />
      <LocalizedLink to={`/${APPART.key}`} className="hover:text-[#1C1917] underline-offset-4 hover:underline">{crumbs[1]}</LocalizedLink>
      <ChevronRight className="w-4 h-4" aria-hidden="true" />
      <span className="text-[#1C1917]">{crumbs[2]}</span>
    </nav>
  );

  const othersSection = others.length > 0 ? (
    <section className="py-14 lg:py-20 bg-[#FAF9F6] border-y border-[#E7E5E4]">
      <div className="container-custom">
        <h2 className="text-2xl md:text-3xl text-[#1C1917] mb-6" style={heading}>{appartRoomOthersTitle(L)}</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {others.map((r) => {
            const st = roomBadge(r, L);
            return (
              <li key={r.room_number}>
                <LocalizedLink
                  to={roomPagePath(APPART.key, r.room_number)}
                  className="flex items-center justify-between gap-3 bg-white rounded-xl border border-[#E7E5E4] px-4 py-3 hover:border-[#1C1917] transition-colors"
                >
                  <span>
                    <span className="block font-black text-[#1C1917]">{roomLabel(APPART.key, r.room_number, L)}</span>
                    <span className="block text-sm text-[#78716C]">{appartTypeCards(L)[isAppartSuite(r.room_number) ? 1 : 0].specs}</span>
                  </span>
                  <span className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${BADGE_PANEL_CLASS[st.tone]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${BADGE_DOT_CLASS[st.tone]}`} aria-hidden="true" />
                    {st.label}
                  </span>
                </LocalizedLink>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  ) : null;

  // Chambre occupée sans date (B+) : fiche NON consultable — un message, puis les chambres à réserver. La route reste (un lien
  // déjà partagé ne tombe pas en erreur) ; aucun lien du site n'y mène.
  if (room && !isRoomPageOpen(APPART.key, room)) {
    const u = appartRoomUnavailable(n, L);
    return (
      <main className="bg-white">
        {settled && <SEO title={u.title} description={u.description} noindex image={`${SITE}${LAPPART_HERO.wide.src}`} />}
        <section className="pt-28 pb-14 lg:pt-32 lg:pb-20">
          <div className="container-custom">
            {breadcrumb}
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B8860B] mb-2">{eyebrow}</p>
            <h1 className="text-3xl md:text-4xl text-[#1C1917] mb-4 max-w-3xl" style={heading}>{u.h1}</h1>
            <p className="text-[#57534E] leading-relaxed max-w-2xl">{u.text}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <LocalizedLink
                to={`/${APPART.key}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#D4A574] text-[#1C1917] font-bold rounded-xl hover:bg-[#E0BB8A] transition-colors"
              >
                {u.cta}
                <ArrowRight className="w-5 h-5" />
              </LocalizedLink>
              <LocalizedLink
                to="/chambres-disponibles"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-[#E7E5E4] text-[#1C1917] font-semibold rounded-xl hover:border-[#1C1917] transition-colors"
              >
                {u.all}
              </LocalizedLink>
            </div>
          </div>
        </section>
        {othersSection}
        <RoomsEmbed places={APPART.key} />
        <WhatsAppButton context={APPART.name} />
      </main>
    );
  }

  const included = appartRoomIncluded(L);
  const notIncluded = [...included.notIncludedBefore, appartGammeExempt(L)["chambre.pas-compris.3"], ...included.notIncludedAfter];
  const lease = appartRoomLease(L);
  const place = appartRoomPlace(L);
  const status = appartRoomStatus(L, date, availableNow);

  const priceCard = (
    <div className="bg-white rounded-2xl border border-[#E7E5E4] shadow-sm p-6">
      <p className="text-3xl font-black text-[#D4A574]">
        {price.chf}
        <span className="text-base font-light text-[#78716C]">{price.perMonth}</span>
      </p>
      <p className="text-sm text-[#78716C] mt-1">{price.note}</p>
      {price.suiteForTwo && <p className="text-sm text-[#57534E] mt-2">{price.suiteForTwo}</p>}
      {badge && (
        <p className={`mt-4 inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg ${BADGE_PANEL_CLASS[badge.tone]}`}>
          <span className={`w-2 h-2 rounded-full ${BADGE_DOT_CLASS[badge.tone]}`} aria-hidden="true" />
          {badge.label}
        </p>
      )}
      <p className="mt-3 text-sm text-[#57534E]">{status}</p>
      <LocalizedLink
        to={applyTo}
        onClick={() => onApply("room_page")}
        className="mt-5 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#D4A574] text-[#1C1917] font-bold rounded-xl hover:bg-[#E0BB8A] transition-colors"
      >
        {labels.apply}
        <ArrowRight className="w-5 h-5" />
      </LocalizedLink>
      <a
        href={`https://wa.me/${LAVILLA_PHONE.replace(/\D/g, "")}?text=${encodeURIComponent(whatsappMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("whatsapp_click", { page_path: pathname, context: `room_page:${APPART.key}:${n}`, language })}
        className="mt-3 w-full inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#E7E5E4] text-[#1C1917] text-sm font-semibold rounded-xl hover:border-[#1C1917] transition-colors"
      >
        {labels.whatsapp}
      </a>
      <ul className="mt-5 space-y-2">
        {appartRoomReassurance(L).map((r) => (
          <li key={r} className="flex items-start gap-2 text-sm text-[#57534E]">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#B8860B]" />
            <span>{r}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <main className="bg-white">
      {settled && (
        <SEO
          title={appartRoomTitle(n, L)}
          description={appartRoomDescription(n, L, date, availableNow)}
          noindex
          image={`${SITE}${LAPPART_HERO.wide.src}`}
        />
      )}

      {/* En-tête : fil d'Ariane, lieu, nom de la chambre, caractéristiques, pastille de la vue (état B). */}
      <section className="pt-28 pb-6 lg:pt-32">
        <div className="container-custom">
          {breadcrumb}
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B8860B] mb-2">{eyebrow}</p>
          <h1 className="text-4xl md:text-5xl text-[#1C1917] mb-3" style={heading}>{appartRoomH1(n, L)}</h1>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[#57534E]">{specsLine}</p>
            {badge && (
              <span className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-full ${BADGE_PANEL_CLASS[badge.tone]}`}>
                <span className={`w-2 h-2 rounded-full ${BADGE_DOT_CLASS[badge.tone]}`} aria-hidden="true" />
                {badge.label}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Galerie : la chambre, puis les pièces communes (21/11/2026). */}
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
              {labels.photos(photos.length)}
            </button>
          </div>
          <p className="mt-3 text-sm text-[#78716C]">{appartRoomPhotoNote(n, L)}</p>
        </div>
      </section>

      {/* Contenu + carte prix (collante sur ordinateur). */}
      <section className="pb-16 lg:pb-24">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="lg:hidden">{priceCard}</div>

            <div>
              <h2 className="text-2xl md:text-3xl text-[#1C1917] mb-4" style={heading}>{labels.theRoom}</h2>
              <p className="text-[#57534E] leading-relaxed max-w-2xl">{appartRoomIntro(n, L)}</p>
              <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {appartRoomSpecs(n, L).map(({ kind, label, value }) => {
                  const Icon = SPEC_ICONS[kind];
                  return (
                    <div key={kind} className="flex items-start gap-3 rounded-xl border border-[#E7E5E4] px-4 py-3">
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#B8860B]" aria-hidden="true" />
                      <div>
                        <dt className="text-xs uppercase tracking-wider text-[#78716C]">{label}</dt>
                        <dd className="text-[#1C1917] font-semibold">{value}</dd>
                      </div>
                    </div>
                  );
                })}
              </dl>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl text-[#1C1917] mb-4" style={heading}>{included.title}</h2>
              <ul aria-label={en ? "Included" : "Compris"} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {included.included.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[#44403C]">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#B8860B]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <ul aria-label={en ? "Not included" : "Pas compris"} className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {notIncluded.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[#57534E]">
                    <Minus className="mt-0.5 h-5 w-5 shrink-0 text-[#A8A29E]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl text-[#1C1917] mb-4" style={heading}>{lease.title}</h2>
              <p className="text-[#57534E] leading-relaxed max-w-2xl">{lease.lease}</p>
              <p className="text-[#57534E] leading-relaxed max-w-2xl mt-2">{lease.deposit}</p>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl text-[#1C1917] mb-4" style={heading}>{place.title}</h2>
              <p className="text-[#57534E] leading-relaxed max-w-2xl">{place.text}</p>
              <ul className="mt-3 space-y-1.5">
                {place.commute.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-[#44403C]">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#B8860B]" aria-hidden="true" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              <LocalizedLink
                to={`/${APPART.key}`}
                onClick={() => track("house_discover_click", { house: APPART.key, cta_position: "room_page", language })}
                className="mt-5 inline-flex items-center gap-2 font-semibold text-[#1C1917] underline underline-offset-4 hover:text-[#B8860B]"
              >
                {place.cta}
                <ArrowRight className="w-4 h-4" />
              </LocalizedLink>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24">{priceCard}</div>
          </aside>
        </div>
      </section>

      {othersSection}

      {/* État des chambres de L'Appart embarqué au prérendu (rien en état A) — instance unique. */}
      <RoomsEmbed places={APPART.key} />

      {viewer !== null && (
        <Suspense fallback={null}>
          <PhotoLightbox
            photos={photos}
            index={viewer}
            onIndexChange={setViewer}
            onClose={() => setViewer(null)}
            en={en}
            title={`${roomName} — ${APPART.name}`}
          />
        </Suspense>
      )}

      {/* CTA collante MOBILE, comme sur les fiches des maisons (icône WhatsApp dans la barre, bulle masquée sur mobile). */}
      <div className="md:hidden h-20" aria-hidden="true" />
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-[#E7E5E4] px-4 py-3">
        <div className="flex items-center gap-3">
          <LocalizedLink
            to={applyTo}
            onClick={() => onApply("sticky_mobile_room")}
            className="flex-1 flex items-center justify-center gap-3 bg-[#D4A574] text-[#1C1917] px-4 py-2.5 rounded-lg"
          >
            <span className="flex flex-col items-center leading-tight">
              <span className="text-sm font-semibold">{labels.apply}</span>
              <span className="text-[11px] text-[#1C1917]/75">{labels.reply}</span>
            </span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </LocalizedLink>
          <WhatsAppBarLink context={`${roomName} — ${APPART.name}`} message={whatsappMessage} />
        </div>
      </div>
      <WhatsAppButton context={`${roomName} — ${APPART.name}`} message={whatsappMessage} hideOnMobile />
    </main>
  );
}
