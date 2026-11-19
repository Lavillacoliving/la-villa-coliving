import { lazy, Suspense, useState } from "react";
import { Helmet } from "react-helmet";
import { ArrowRight, ChevronDown, ChevronRight, Clock, Grid3X3, MapPin, Maximize, Users, Zap } from "lucide-react";
import { SEO } from "@/components/SEO";
import { LocalizedLink } from "@/components/LocalizedLink";
import { Scrim } from "@/components/Scrim";
import { Badge } from "@/components/ui/badge";
import { RoomCard } from "@/components/RoomCard";
import { RoomsEmbed } from "@/components/RoomsEmbed";
import { RoomPipeline } from "@/components/RoomPipeline";
import { FacebookGroupCallout } from "@/components/FacebookGroupCallout";
import { HouseCommuteTable } from "@/components/HouseCommuteTable";
import { HouseMap } from "@/components/HouseMap";
import { WhatsAppBarLink, WhatsAppButton } from "@/components/WhatsAppButton";
import { AppartFacts } from "@/components/appart/AppartFacts";
import { AppartIncluded } from "@/components/appart/AppartIncluded";
import { useLanguage } from "@/contexts/LanguageContext";
import { APPART } from "@/data/appart";
import { appartGammeExempt } from "@/data/appartFacts";
import {
  APPART_LOCATION_VERSION,
  appartCommuteTable,
  appartExactAddressNote,
  appartLocationHeadings,
  appartMapLegend,
  appartNeighbourhood,
  appartZone,
} from "@/data/appartLocation";
import {
  appartConditionsSection,
  appartFaq,
  appartFaqHeading,
  appartFinalCta,
  appartFullText,
  appartHousesLink,
  appartLivingSection,
  appartPageDescription,
  appartPageDpe,
  appartPageHero,
  appartPageLead,
  appartPageTitle,
  appartPageWhatsapp,
  appartPhotoPendingLegend,
  appartRoomsSection,
  appartSuiteCta,
  appartSuiteSection,
  appartTypeCards,
  appartWaitlistText,
  isAppartSuite,
  type AppartTypeCard,
} from "@/data/appartPage";
import { LAPPART_ALBUM, LAPPART_ALBUM_COVERS, LAPPART_HERO, LAPPART_ROOM_COVER } from "@/data/appartPhotos";
import { placeCard } from "@/data/houses";
import { MAISON_KEYS, PLACE_KEYS, PLACE_LABEL, roomLabel } from "@/data/places";
import { thousands } from "@/data/stats";
import { responsiveImage } from "@/lib/responsiveImage";
import { APPART_PLACE, LAVILLA_PHONE, buildAppartLodgingNode, buildFaqPageSchema, publicGeo } from "@/lib/structuredData";
import {
  BADGE_CHIP_CLASS,
  BADGE_PANEL_CLASS,
  BADGE_DOT_CLASS,
  roomBadge,
  roomSpecs,
  splitRooms,
  useAllRooms,
  useHouseRooms,
  type PublicRoom,
} from "@/lib/availability";

/**
 * Page de L'Appart — /lappart et /en/lappart (brief « Points d'entrée prix, L'Appart » du 12/11/2026, Lot 3 ; étape E3).
 *
 * Une page À PART (décision Q12) : HouseDetailPage dit « linge fourni », « ménage 3 fois », « piscine… » — trois choses fausses
 * ici. Deux gammes, jamais fondues (V2) : aucune preuve des maisons sur cette page (note Google, « 100+ résidents », séjour
 * moyen, occupation, formule de trajet de la marque) ; piscine, sauna et salle de sport n'y sont nommés que par les textes qui
 * les NIENT ou RENVOIENT aux maisons (appartGammeExempt, même source que la garde check:facts). Fiche « l'essentiel » propre
 * (<AppartFacts/>, décision n° 13), jamais la fiche de la marque.
 *
 * Textes : src/data/appartPage.ts (page), appartFacts.ts (fiche, tableau compris / pas compris, exceptions), appartLocation.ts
 * (emplacement) — source des textes du 13/11/2026, au caractère près. Faits : APPART (prix, surfaces, mois d'ouverture) ;
 * disponibilité d'une chambre : SEULEMENT la vue v_public_rooms (pastille, date, cartes).
 *
 * Deux états de la base (ARCHITECTURE § 3) :
 *  - A (la vue n'a pas encore L'Appart) : deux cartes « types » tirées d'APPART, boutons sans numéro de chambre, aucune
 *    pastille, aucun état embarqué de chambres ;
 *  - B (4 lignes datées) : les cartes de la vue (pastille « Libre dès février » : le mois d'ouverture, jamais le jour — V2-22),
 *    boutons à deux paramètres, état embarqué ;
 *  - B+ complet (4 lignes occupées sans date) : prix toujours publiés, liste d'attente en tête, et les chambres candidates les
 *    moins chères des maisons en cartes compactes SANS ligne « tout compris » (elle nomme piscine et sauna).
 * Hydratation (#418) : tout le rendu dépend de l'état embarqué (le même au prérendu et au premier rendu du navigateur) ;
 * aucune date calculée (formatFreeDate est pure) ; JSON-LD statique (aucune donnée de la base).
 */
const PhotoLightbox = lazy(() => import("@/components/PhotoLightbox"));

const SITE = "https://www.lavillacoliving.com";
/** Questions dépliées de la FAQ (les suivantes sous un bouton, comme sur les pages maisons). */
const FAQ_VISIBLE = 5;
/** Chambres des maisons proposées quand L'Appart est complet. */
const COMPLETE_HOUSE_ROOMS = 3;

function track(event: string, params: Record<string, unknown>) {
  try {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", event, params);
  } catch { /* noop — l'analytics ne bloque jamais l'UI */ }
}

const heading = { fontFamily: '"DM Serif Display", serif' };

/** Carte « type » (état A) : même habillage que la carte d'une chambre (RoomCard « default »), sans pastille de disponibilité ni
 *  lien vers une fiche ; la photo est une pièce commune, avec SON texte alternatif et la légende « Photo de la chambre à venir ». */
function TypeCard({ card, lang, onApply }: { card: AppartTypeCard; lang: "fr" | "en"; onApply: () => void }) {
  const cover = LAPPART_ROOM_COVER;
  return (
    <div className="card-ultra bg-white rounded-2xl border border-[#E7E5E4] shadow-sm overflow-hidden flex flex-col">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={cover.src}
          {...responsiveImage(cover.src, "(min-width: 768px) 50vw, 100vw")}
          alt={cover.alt[lang]}
          className="w-full h-full object-cover"
          style={{ objectPosition: cover.focal }}
          loading="lazy"
          width={cover.w}
          height={cover.h}
        />
        <span data-photo-pending className="absolute bottom-2 left-2 max-w-[calc(100%-1rem)] text-[11px] leading-tight font-medium px-2 py-1 rounded-md bg-black/65 text-white">
          {appartPhotoPendingLegend(lang)}
        </span>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-black text-[#1C1917] mb-1">{card.name}</h3>
        {card.count && <p className="text-sm font-semibold text-[#57534E] mb-1">{card.count}</p>}
        <p className="text-sm text-[#78716C] mb-1">{card.specs}</p>
        {card.furniture && <p className="text-sm text-[#78716C] mb-1">{card.furniture}</p>}
        {card.extras && <p className="text-sm text-[#78716C] mb-1">{card.extras}</p>}
        {card.capacity && <p className="text-sm text-[#78716C] mb-1">{card.capacity}</p>}
        <div className="mt-auto pt-3">
          <p className="text-xl font-black text-[#D4A574] mb-4">
            {card.chf}
            <span className="text-sm font-light text-[#78716C]">{` (${card.eur})`}</span>
            <span className="text-sm font-light text-[#78716C]">{` ${card.perMonth}`}</span>
          </p>
          <LocalizedLink
            to={`/candidature?property_interest=${APPART.key}`}
            onClick={onApply}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#D4A574] text-[#1C1917] text-sm font-semibold rounded-lg hover:bg-[#E0BB8A] transition-colors"
          >
            {card.cta}
            <ArrowRight className="w-4 h-4" />
          </LocalizedLink>
        </div>
      </div>
    </div>
  );
}

/** Chambre de L'Appart occupée sans date (états B+) : sa pastille, son prix, aucun bouton — on ne candidate pas pour une chambre
 *  prise ; la liste d'attente est juste à côté. Libellés : ceux du site (roomLabel, roomSpecs, roomBadge). */
function OccupiedRoom({ room, lang }: { room: PublicRoom<"lappart">; lang: "fr" | "en" }) {
  const badge = roomBadge(room, lang);
  const eur = room.rent_eur !== null && room.rent_eur !== undefined && Number.isFinite(Number(room.rent_eur)) ? Math.round(Number(room.rent_eur)) : null;
  const label = roomLabel(APPART.key, room.room_number, lang);
  return (
    <div className="bg-white border border-[#E7E5E4] rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="font-black text-[#1C1917]">{label}</p>
        <p className="text-sm text-[#78716C]">{roomSpecs(room, lang)}</p>
        {room.rent_chf !== null && (
          <p className="text-sm text-[#1C1917] mt-1">
            <strong>{lang === "en" ? `CHF ${thousands(room.rent_chf, ",")}` : `${thousands(room.rent_chf, " ")} CHF`}</strong>
            <span className="text-xs text-[#78716C]">{eur !== null ? (lang === "en" ? ` (€${thousands(eur, ",")})` : ` (${thousands(eur, " ")} €)`) : ""}{lang === "en" ? " /month" : " /mois"}</span>
          </p>
        )}
      </div>
      <span className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${BADGE_PANEL_CLASS[badge.tone]}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${BADGE_DOT_CLASS[badge.tone]}`} aria-hidden="true" />
        {badge.label}
      </span>
    </div>
  );
}

export function LAppartPage() {
  const { language } = useLanguage();
  const L = language === "en" ? "en" as const : "fr" as const;
  const en = L === "en";

  // Chambres de L'Appart : la vue seulement (`known: false` tant qu'elle n'a aucune ligne de L'Appart — état A).
  const appartRooms = useHouseRooms(APPART.key);
  const stateB = appartRooms.known;
  const { candidates, occupied } = splitRooms(appartRooms.rooms);
  const full = stateB && candidates.length === 0;
  // État complet : les chambres candidates les moins chères des MAISONS (useAllRooms : maisons seulement), embarquées avec
  // celles de L'Appart (RoomsEmbed ci-dessous) — le premier rendu du navigateur relit les mêmes lignes que le prérendu.
  const houseRooms = useAllRooms();
  const cheapestHouseRooms = full && houseRooms.known
    ? splitRooms(houseRooms.rooms).candidates
        .filter((r) => r.rent_chf !== null)
        .sort((a, b) => (a.rent_chf as number) - (b.rent_chf as number) || MAISON_KEYS.indexOf(a.house_slug) - MAISON_KEYS.indexOf(b.house_slug) || a.room_number - b.room_number)
        .slice(0, COMPLETE_HOUSE_ROOMS)
    : [];
  // Pastille du haut de page : celle d'une chambre de L'Appart, lue dans la vue (jamais le résumé des maisons) ; aucune en état A.
  const heroBadge = stateB ? roomBadge(candidates[0] ?? appartRooms.rooms[0], L) : null;
  const suiteRow = appartRooms.rooms.find((r) => isAppartSuite(r.room_number));
  const suiteIsCandidate = !!suiteRow && candidates.includes(suiteRow);

  const [introOpen, setIntroOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [viewer, setViewer] = useState<number | null>(null);

  const hero = appartPageHero(L);
  const lead = appartPageLead(L);
  const ex = appartGammeExempt(L);
  const roomsText = appartRoomsSection(L);
  const typeCards = appartTypeCards(L);
  const fullText = appartFullText(L);
  const living = appartLivingSection(L);
  const suite = appartSuiteSection(L);
  const conditions = appartConditionsSection(L);
  const faqs = appartFaq(L);
  const faqHeading = appartFaqHeading(L);
  const finalCta = appartFinalCta(L);
  const locHeadings = appartLocationHeadings(L);
  const whatsappMessage = appartPageWhatsapp(L);
  const applyTo = `/candidature?property_interest=${APPART.key}`;
  const pageUrl = `${SITE}${en ? "/en" : ""}/${APPART.key}`;
  const g = publicGeo(APPART_PLACE);

  const trackCta = (position: string, extra: Record<string, unknown> = {}) =>
    track("cta_click", { cta_position: position, cta_target: "/candidature", house: APPART.key, language, ...extra });
  const trackFold = (fold: string, open: boolean) =>
    track("fold_toggle", { fold, state: open ? "open" : "closed", house: APPART.key, language });
  const openAlbum = (index: number, source: "tile" | "button") => {
    setViewer(index);
    track("gallery_expand", { house: APPART.key, mode: "viewer", source, shown: LAPPART_ALBUM_COVERS.length, total: LAPPART_ALBUM.length, language });
  };

  const faqCard = ({ q, a }: { q: string; a: string }, i: number) => (
    <div key={i} className="card-ultra bg-white rounded-2xl border border-[#E7E5E4] shadow-sm p-5 md:p-6">
      <dt className="text-base md:text-lg font-black text-[#1C1917] mb-2 md:mb-3">{q}</dt>
      <dd className="text-[15px] md:text-base text-[#57534E] font-medium leading-relaxed">{a}</dd>
    </div>
  );

  return (
    <main className="relative">
      <SEO
        title={appartPageTitle(L)}
        description={appartPageDescription(L)}
        url={pageUrl}
        image={`${SITE}${LAPPART_HERO.wide.src}`}
      />
      {/* Un seul nœud LodgingBusiness pour L'Appart (buildAppartLodgingNode : sans piscine, sauna ni salle de sport, adresse sans
          rue, point public = la gare d'Annemasse), et un seul FAQPage, construit depuis la même liste que la FAQ visible. Le fil
          d'Ariane « Accueil > L'Appart » est injecté par le prérendu (L'Appart hors de « Nos maisons », décision n° 29). */}
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(buildAppartLodgingNode(L, { context: true }))}</script>
        <script type="application/ld+json">{JSON.stringify(buildFaqPageSchema(faqs.map(({ q, a }) => ({ q, a }))))}</script>
      </Helmet>

      {/* Haut de page : la cuisine côté plaque (format en hauteur sur téléphone, large ailleurs), voile, titre, repères, prix. */}
      <section className="relative pt-16">
        <div className="relative h-[60vh] min-h-[520px] md:h-[70vh]">
          {/* Variantes responsive des deux formats (scripts/optimize-images.mjs, réunion des étapes du 13/11/2026) : un téléphone
              ne charge plus la photo de 1 800 px. */}
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet={responsiveImage(LAPPART_HERO.tall.src, "100vw").srcSet ?? encodeURI(LAPPART_HERO.tall.src)}
              sizes="100vw"
              width={LAPPART_HERO.tall.w}
              height={LAPPART_HERO.tall.h}
            />
            <img
              src={LAPPART_HERO.wide.src}
              {...responsiveImage(LAPPART_HERO.wide.src, "100vw")}
              alt={LAPPART_HERO.wide.alt[L]}
              className="w-full h-full object-cover"
              style={{ objectPosition: LAPPART_HERO.wide.focal }}
              width={LAPPART_HERO.wide.w}
              height={LAPPART_HERO.wide.h}
              loading="eager"
              fetchPriority="high"
            />
          </picture>
          <Scrim />
        </div>
        <div className="absolute bottom-0 left-0 right-0 pb-8 pt-20">
          <div className="container-custom">
            <nav aria-label={en ? "Breadcrumb" : "Fil d'Ariane"} className="flex flex-wrap items-center gap-1 text-sm text-white/80 mb-3">
              <LocalizedLink to="/" className="hover:text-white underline-offset-4 hover:underline">{en ? "Home" : "Accueil"}</LocalizedLink>
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
              <span className="text-white">{APPART.name}</span>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E8C9A0] mb-3">{hero.eyebrow}</p>
            {heroBadge && (
              <div className="mb-4">
                <Badge className={`font-extrabold backdrop-blur-sm ${BADGE_CHIP_CLASS[heroBadge.tone]}`}>{heroBadge.label}</Badge>
              </div>
            )}
            <h1 className="text-3xl md:text-6xl mb-4 text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.55)] max-w-4xl" style={heading}>
              {hero.h1}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/90 font-medium">
              <span className="flex items-center gap-2"><MapPin size={18} className="text-[#D4A574]" />{hero.markers[0]}</span>
              <span className="flex items-center gap-2"><Users size={18} className="text-[#D4A574]" />{hero.markers[1]}</span>
              <span className="flex items-center gap-2"><Maximize size={18} className="text-white/80" />{hero.markers[2]}</span>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <LocalizedLink
                to={applyTo}
                onClick={() => trackCta("lappart_hero")}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#D4A574] text-[#1C1917] font-bold rounded-full hover:bg-[#E0BB8A] transition-colors shadow-sharp"
              >
                {hero.apply}
                <ArrowRight className="w-5 h-5" />
              </LocalizedLink>
              <span className="text-sm font-semibold text-[#1C1917] bg-white/85 backdrop-blur px-4 py-2 rounded-full">{hero.pricePill}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Chapeau : ouvert par la ligne de trajet (garde house-pages-check : 1 500 premiers caractères après le H1). Sur mobile,
          le premier paragraphe, puis « Lire la suite » ; le reste est toujours dans le HTML et toujours affiché à partir de md. */}
      <section className="py-8 md:py-16 relative bg-white">
        <div className="container-custom">
          <div className="max-w-3xl space-y-4 text-base md:text-lg text-[#57534E] leading-relaxed font-medium">
            <p>{lead.lead}</p>
            <div className={introOpen ? "space-y-4" : "hidden md:block space-y-4"}>
              <p>{lead.price}</p>
              <p>{ex["page.chapeau.3"]}</p>
            </div>
          </div>
          {!introOpen && (
            <button
              type="button"
              onClick={() => { setIntroOpen(true); trackFold("intro", true); }}
              className="md:hidden mt-2 text-sm font-semibold text-[#1C1917] underline underline-offset-4"
            >
              {en ? "Read more" : "Lire la suite"}
            </button>
          )}
          <p className="text-sm text-[#78716C] mt-4 md:mt-6 flex items-center gap-2">
            <Zap size={14} className="text-[#78716C]" />
            {appartPageDpe(L)}
          </p>
        </div>
      </section>

      {/* Les 4 chambres. État A : deux cartes « types » ; état B : les cartes de la vue ; complet : liste d'attente en tête. */}
      <section className="py-8 md:py-20 relative bg-[#FAF9F6]">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl mb-4 text-[#1C1917]" style={heading}>{roomsText.title}</h2>
          <div className="mb-8 space-y-3 max-w-3xl text-[15px] md:text-base text-[#57534E]">
            {/* (Corrections du 13/11/2026) « … Tu peux candidater dès maintenant » appartient aux états A et B (PAGE-LAPPART § 12.1) :
                jamais au-dessus du bloc « complet » (§ 12.3), qui le remplace. */}
            {!full && <p className="font-semibold text-[#1C1917]">{roomsText.beforeOpening}</p>}
            <p>{roomsText.intro}</p>
            <p>{roomsText.frank}</p>
            {!stateB && <p>{roomsText.stateA}</p>}
          </div>

          {full && (
            <div className="mb-8 max-w-3xl">
              <h3 className="text-2xl text-[#1C1917] mb-2" style={heading}>{fullText.title}</h3>
              <p className="text-[#57534E] leading-relaxed">{fullText.text}</p>
            </div>
          )}

          {full && (
            <RoomPipeline
              house={APPART.key}
              houseName={APPART.name}
              en={en}
              hasCandidates={false}
              texts={appartWaitlistText(L)}
              fromMonth={APPART.opensOn.slice(0, 7)}
              onApplyClick={(month) => trackCta("pipeline_month", { month })}
            />
          )}

          {!stateB ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 max-w-4xl">
              {typeCards.map((card) => (
                <TypeCard key={card.kind} card={card} lang={L} onApply={() => trackCta("room_type_card", { room_id: card.kind })} />
              ))}
            </div>
          ) : (
            <>
              {candidates.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {candidates.map((room) => (
                    // Carte des pages de lieu : ni ligne « tout compris » ni lien « Ce que comprend le prix » (D4 du Lot 5) ; pas
                    // de badge de gamme sur la page du lieu.
                    <RoomCard
                      key={room.room_number}
                      house={APPART.key}
                      houseName={APPART.name}
                      room={room}
                      fallbackImage={LAPPART_ROOM_COVER.src}
                      showInclusions={false}
                      onCtaClick={(r) => trackCta("room_card", { room_id: `chambre-${r.room_number}` })}
                    />
                  ))}
                </div>
              )}
              {occupied.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10 max-w-4xl">
                  {occupied.map((room) => <OccupiedRoom key={room.room_number} room={room} lang={L} />)}
                </div>
              )}
            </>
          )}

          <div className="mb-10 space-y-3 max-w-3xl text-[15px] md:text-base text-[#57534E]">
            <p>{roomsText.suitePrice}</p>
            <p>{roomsText.photos}</p>
          </div>

          {!full && (
            <RoomPipeline
              house={APPART.key}
              houseName={APPART.name}
              en={en}
              hasCandidates={candidates.length > 0}
              texts={appartWaitlistText(L)}
              fromMonth={APPART.opensOn.slice(0, 7)}
              onApplyClick={(month) => trackCta("pipeline_month", { month })}
            />
          )}

          {/* Complet : les chambres disponibles les moins chères des maisons (cartes compactes, sans ligne « tout compris »). */}
          {full && (
            <div className="mt-2 mb-10">
              {cheapestHouseRooms.length > 0 && (
                <>
                  <p className="text-[#57534E] leading-relaxed max-w-3xl mb-5">{ex["page.complet.maisons"]}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                    {cheapestHouseRooms.map((room) => {
                      const card = placeCard(room.house_slug);
                      return (
                        <RoomCard
                          key={`${room.house_slug}-${room.room_number}`}
                          variant="compact"
                          house={room.house_slug}
                          houseName={PLACE_LABEL[room.house_slug]}
                          commune={card.commune}
                          room={room}
                          fallbackImage={card.img}
                          houseCta
                          showInclusions={false}
                          onHouseClick={(r) => track("house_discover_click", { house: r.house_slug, cta_position: "lappart_full", language })}
                        />
                      );
                    })}
                  </div>
                </>
              )}
              <LocalizedLink to="/chambres-disponibles" className="inline-flex items-center gap-2 font-semibold text-[#1C1917] underline underline-offset-4 hover:text-[#B8860B]">
                {fullText.link}
                <ArrowRight className="w-4 h-4" />
              </LocalizedLink>
            </div>
          )}

          {/* Encart A.8 sous la liste des chambres, comme sur les pages maisons (texte unique answerSlots.ts). */}
          <FacebookGroupCallout position="house_rooms" house={APPART.key} className="mt-10" />
        </div>
      </section>

      {/* État des chambres embarqué au prérendu (rien en état A) ; complet : les lignes des maisons aussi (cartes ci-dessus). */}
      <RoomsEmbed places={full ? PLACE_KEYS : APPART.key} />

      {/* Le séjour-cuisine de 80 m² et le balcon : album des pièces communes (6 vignettes, visionneuse sur les 8 photos). */}
      <section id="galerie" className="py-8 md:py-20 bg-white relative scroll-mt-24">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl mb-4 text-[#1C1917]" style={heading}>{living.title}</h2>
          <p className="text-base md:text-lg text-[#57534E] leading-relaxed font-medium max-w-3xl mb-6 md:mb-8">{living.text}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
            {LAPPART_ALBUM_COVERS.map((src) => {
              const index = LAPPART_ALBUM.findIndex((p) => p.src === src);
              const photo = LAPPART_ALBUM[index];
              if (!photo) return null;
              return (
                <button
                  type="button"
                  key={src}
                  onClick={() => openAlbum(index, "tile")}
                  aria-label={en ? `Open the photo: ${photo.alt.en}` : `Agrandir la photo : ${photo.alt.fr}`}
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-[#F5F2ED] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C1917]"
                >
                  <img
                    src={photo.src}
                    alt={photo.alt[L]}
                    width={photo.w}
                    height={photo.h}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                    {...responsiveImage(photo.src, "(min-width: 768px) 33vw, 50vw")}
                  />
                </button>
              );
            })}
          </div>
          <div className="mt-4 md:mt-8">
            <button
              type="button"
              onClick={() => openAlbum(0, "button")}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-[#1C1917] text-[#1C1917] font-semibold rounded-xl hover:bg-[#1C1917] hover:text-white transition-colors"
            >
              <Grid3X3 className="w-4 h-4" aria-hidden="true" />
              {living.album(LAPPART_ALBUM.length)}
            </button>
          </div>
        </div>
        {viewer !== null && (
          <Suspense fallback={null}>
            <PhotoLightbox
              photos={[...LAPPART_ALBUM]}
              index={viewer}
              onIndexChange={setViewer}
              onClose={() => setViewer(null)}
              en={en}
              title={APPART.name}
            />
          </Suspense>
        )}
      </section>

      {/* Ce qui est compris, ce qui ne l'est pas (tableau de la source ; une ligne nie piscine, sauna et salle de sport). */}
      <section className="py-8 md:py-20 relative bg-[#FAF9F6]">
        <div className="container-custom max-w-4xl">
          <AppartIncluded lang={L} />
        </div>
      </section>

      {/* Emplacement et trajets : phrase de quartier (1 fois), zone, note, tableau (minutes seulement), carte sur la gare. */}
      <section className="py-8 md:py-20 relative bg-white" data-house-location-version={APPART_LOCATION_VERSION}>
        <div className="container-custom max-w-5xl">
          <h2 className="text-3xl md:text-4xl mb-6 text-[#1C1917]" style={heading}>{locHeadings.title}</h2>
          <p className="text-base md:text-lg text-[#57534E] leading-relaxed mb-8 font-medium">{appartNeighbourhood(L)}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-2">
            <div>
              <h3 className="text-xl font-black mb-4 text-[#1C1917] flex items-center gap-2">
                <MapPin size={20} className="text-[#D4A574]" />
                {locHeadings.neighbourhood}
              </h3>
              <p className="text-[#57534E] font-medium mb-1">{appartZone(L)}</p>
              <p className="text-sm text-[#78716C] mb-6">{appartExactAddressNote(L)}</p>
            </div>
            <div>
              <h3 className="text-xl font-black mb-4 text-[#1C1917] flex items-center gap-2">
                <Clock size={20} className="text-[#D4A574]" />
                {en ? "Transport & travel times" : "Transport & temps de trajet"}
              </h3>
              <HouseCommuteTable slug={APPART.key} content={appartCommuteTable} lang={L} />
            </div>
          </div>
          <p className="mt-8 text-sm text-[#78716C]">{appartMapLegend(L)}</p>
          <HouseMap name={APPART.name} zone={appartZone(L)} lat={g.lat} lng={g.lng} en={en} />
        </div>
      </section>

      {/* À deux : la suite (P5 : « 1 060 € par mois, soit 530 € par personne à deux »). */}
      <section className="py-8 md:py-16 relative bg-[#FAF9F6]">
        <div className="container-custom max-w-3xl">
          <h2 className="text-3xl md:text-4xl mb-4 text-[#1C1917]" style={heading}>{suite.title}</h2>
          <p className="text-base md:text-lg text-[#57534E] leading-relaxed font-medium">{suite.text}</p>
          <LocalizedLink
            to={suiteIsCandidate ? `${applyTo}&room_interest=chambre-${suiteRow?.room_number}` : applyTo}
            onClick={() => trackCta("lappart_suite", suiteIsCandidate ? { room_id: `chambre-${suiteRow?.room_number}` } : {})}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 border border-[#1C1917] text-[#1C1917] text-sm font-semibold rounded-lg hover:bg-[#1C1917] hover:text-white transition-colors"
          >
            {appartSuiteCta(L)}
            <ArrowRight className="w-4 h-4" />
          </LocalizedLink>
        </div>
      </section>

      {/* Conditions : bail, caution, frais et garant sont dans la fiche juste en dessous (une seule fois par page). */}
      <section className="pt-8 md:pt-20 relative bg-white">
        <div className="container-custom max-w-3xl">
          <h2 className="text-3xl md:text-4xl mb-4 text-[#1C1917]" style={heading}>{conditions.title}</h2>
          <p className="text-base md:text-lg text-[#57534E] leading-relaxed font-medium">{conditions.intro}</p>
          <p className="mt-3 text-base md:text-lg text-[#57534E] leading-relaxed font-medium">{conditions.profiles}</p>
        </div>
      </section>

      {/* Fiche « L'Appart — l'essentiel » (id="appart-facts") : la fiche PROPRE à L'Appart, jamais celle de la marque. */}
      <section className="pb-8 md:pb-20 relative bg-white">
        <div className="container-custom max-w-3xl">
          <AppartFacts lang={L} className="text-[15px] md:text-base" />
        </div>
      </section>

      {/* FAQ : 8 questions, un seul FAQPage (ci-dessus) ; les 5 premières dépliées, les suivantes dans le HTML sous un bouton. */}
      <section className="py-8 md:py-20 relative bg-[#FAF9F6]">
        <div className="container-custom max-w-3xl">
          <h2 className="text-3xl md:text-4xl mb-5 md:mb-8 text-[#1C1917]" style={heading}>{faqHeading.title}</h2>
          <dl className="space-y-4 md:space-y-6">{faqs.slice(0, FAQ_VISIBLE).map(faqCard)}</dl>
          {faqs.length > FAQ_VISIBLE && (
            <>
              <button
                type="button"
                aria-expanded={faqOpen}
                aria-controls="faq-suite"
                onClick={() => { trackFold("faq_more", !faqOpen); setFaqOpen((v) => !v); }}
                className="mt-4 md:mt-6 w-full flex items-center justify-between gap-3 px-5 py-4 md:px-6 bg-white border border-[#E7E5E4] rounded-2xl text-left font-bold text-[#1C1917] hover:border-[#D4A574] transition-colors"
              >
                {faqHeading.more(faqs.length - FAQ_VISIBLE)}
                <ChevronDown className={`w-5 h-5 shrink-0 text-[#57534E] transition-transform ${faqOpen ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
              <dl id="faq-suite" className={`${faqOpen ? "" : "hidden "}mt-4 md:mt-6 space-y-4 md:space-y-6`}>
                {faqs.slice(FAQ_VISIBLE).map(faqCard)}
              </dl>
            </>
          )}
        </div>
      </section>

      {/* « Tu veux piscine et sauna ? » : le renvoi vers les maisons (titre et texte = exceptions de gamme de la source). */}
      <section className="py-8 md:py-16 relative bg-white">
        <div className="container-custom max-w-3xl">
          <h2 className="text-3xl md:text-4xl mb-4 text-[#1C1917]" style={heading}>{ex["page.maisons.h2"]}</h2>
          <p className="text-base md:text-lg text-[#57534E] leading-relaxed font-medium">{ex["page.maisons.texte"]}</p>
          <LocalizedLink
            to="/nos-maisons"
            onClick={() => track("house_discover_click", { house: "maisons", cta_position: "lappart_houses", language })}
            className="mt-5 inline-flex items-center gap-2 font-semibold text-[#1C1917] underline underline-offset-4 hover:text-[#B8860B]"
          >
            {appartHousesLink(L)}
            <ArrowRight className="w-4 h-4" />
          </LocalizedLink>
        </div>
      </section>

      {/* Appel final. */}
      <section className="py-14 md:py-20 relative bg-[#1C1917] overflow-hidden">
        <div className="container-custom relative text-center">
          <h2 className="text-3xl md:text-4xl mb-4 text-white font-black" style={heading}>{finalCta.title}</h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto font-bold mb-8">{finalCta.text}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <LocalizedLink
              to={applyTo}
              onClick={() => trackCta("lappart_footer")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1C1917] font-bold rounded-full hover:bg-gray-100 transition-colors"
            >
              {finalCta.apply}
              <ArrowRight className="w-5 h-5" />
            </LocalizedLink>
            <a
              href={`https://wa.me/${LAVILLA_PHONE.replace(/\D/g, "")}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { page_path: en ? `/en/${APPART.key}` : `/${APPART.key}`, context: `lappart_footer`, language })}
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-colors"
            >
              {finalCta.whatsapp}
            </a>
          </div>
        </div>
      </section>

      {/* Barre fixée MOBILE : « Candidater » et l'icône WhatsApp (la bulle flottante est masquée sur mobile). */}
      <div className="md:hidden h-16" aria-hidden="true" />
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-[#E7E5E4] px-4 py-3">
        <div className="flex items-center gap-3">
          <LocalizedLink
            to={applyTo}
            onClick={() => trackCta("sticky_mobile")}
            className="flex-1 flex items-center justify-center gap-2 bg-[#D4A574] text-[#1C1917] py-3 rounded-lg text-sm font-semibold"
          >
            {hero.apply}
            <ArrowRight className="w-4 h-4" />
          </LocalizedLink>
          <WhatsAppBarLink context={APPART.name} message={whatsappMessage} />
        </div>
      </div>
      <WhatsAppButton context={APPART.name} message={whatsappMessage} hideOnMobile />
    </main>
  );
}
