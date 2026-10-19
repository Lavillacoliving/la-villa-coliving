import { useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { SEO } from "@/components/SEO";
import { LocalizedLink } from "@/components/LocalizedLink";
import { FaqSection } from "@/components/FaqSection";
import { RoomCard } from "@/components/RoomCard";
import { RoomsEmbed } from "@/components/RoomsEmbed";
import { useLanguage } from "@/contexts/LanguageContext";
import { useHydrated } from "@/hooks/useHydrated";
import { HOUSES } from "@/data/houses";
import { STATS, STATS_SHARED_BATH, CONTRACT_EUR, thousands } from "@/data/stats";
import { markOffer } from "@/lib/attribution";
import { readPrerenderFlag } from "@/lib/prerenderEmbeddedState";
import type { QAPair } from "@/lib/structuredData";
import { splitRooms, useAllRooms, useRoomsLoadFailed, type PublicRoom } from "@/lib/availability";
import {
  ALREADY_FREE_START_DAYS,
  OFFER_DISCOUNT_PERCENT,
  OFFER_END,
  OFFER_ID,
  OFFER_QUERY,
  OFFER_START,
  OFFER_TEXTS,
  discountedFirstMonth,
  formatOfferDate,
  isOfferActive,
  isOfferRoom,
  leaseStartLabel,
  leaseStartOf,
  parisDateIso,
  trackOfferCta,
  trackOfferSectionView,
  type OfferSection,
} from "@/data/offer";

/**
 * /offre-hiver · /en/winter-offer — Offre A « Pose tes valises avant l'hiver » (brief Jérôme du
 * 06/10/2026 ; rebrief du 12/10/2026 : −50 % sur le premier mois, caution en 2 ou 3 fois, bail signé du
 * 15/10 au 25/11 inclus, bail démarrant à la libération ; communication Facebook + Ads à partir du 15/10).
 *
 * Page TEMPORAIRE : noindex + canonical auto-référente (pas de concurrence avec /chambres-disponibles),
 * prérendue (LCP des liens d'annonce), hors sitemap. Les dates viennent de src/data/offer.ts ; après
 * OFFER_END la page affiche « Cette offre est terminée » avec un lien vers /chambres-disponibles — pas
 * de 301 : les liens Facebook et Ads doivent continuer à tomber sur une page qui explique.
 *
 * Hydratation : l'état « terminée » dépend de la date du lecteur. Pendant l'hydratation le premier rendu
 * reproduit le HTML prérendu (repère `__offer_state__` capturé par main.tsx sur <main data-offer-state>),
 * puis la page se resynchronise sur la date réelle (useHydrated) — même modèle que les filtres de
 * /chambres-disponibles. Les chambres viennent de l'embed de la page (RoomsEmbed, 29 lignes) et du
 * composant partagé RoomCard, filtrées (pur) sur « libre maintenant ou datée » (rebrief D5 : la ch. 4 du
 * Loft, libre le 16/12, en fait partie). Le compteur du hero (D7) = la longueur de cette même liste. La
 * ligne « Bail au … » dépend du jour de Paris : le premier rendu client relit celui du prérendu (repère
 * `__offer_today__` capturé par main.tsx sur <main data-offer-today>), puis se resynchronise.
 *
 * Formulation (brief §0) : la remise est un geste commercial appliqué sur le premier mois — jamais
 * « loyer réduit », « loyer à … », ni prix barré/remplacé ; le loyer contractuel reste affiché tel quel.
 *
 * Brief « page de l'offre » du 19/10/2026 (9 visiteurs sur 10 repartent sans cliquer) : ligne « produit » sous le H1
 * (quoi, où, combien — le prix suit la même liste que le compteur), conditions du hero en une phrase, chambres remontées
 * en section 2, et mesure `offer_section_view` (rooms · concretely · faq) pour savoir si les visiteurs atteignent la grille.
 */

const fmtChf = (n: number, en: boolean) => (en ? `CHF ${thousands(n, ",")}` : `${thousands(n, "\u00a0")} CHF`);
const fmtEur = (n: number, en: boolean) => (en ? `€${thousands(n, ",")}` : `${thousands(n, "\u00a0")} €`);

/** Bouton « Je candidate » → /candidature?offre=hiver, mesuré en `offer_cta_click` (placement = landing, sticky pour la barre mobile). */
function ApplyButton({
  en,
  L,
  className = "",
  placement = "landing",
  compact = false,
}: {
  en: boolean;
  L: "fr" | "en";
  className?: string;
  placement?: "landing" | "sticky";
  compact?: boolean;
}) {
  return (
    <LocalizedLink
      to={`/candidature?${OFFER_QUERY}`}
      onClick={() => trackOfferCta(placement, { language: L })}
      className={`inline-flex items-center justify-center gap-2 ${compact ? "px-6 py-3 text-sm" : "px-8 py-4"} bg-[#1C1917] text-white font-semibold rounded-lg hover:bg-[#44403C] transition-colors ${className}`}
    >
      {en ? "Apply now" : "Je candidate"}
      <ArrowRight className={compact ? "w-4 h-4" : "w-5 h-5"} />
    </LocalizedLink>
  );
}

/**
 * Option D du brief du 19/10/2026 (à trancher par Jérôme, commit séparé) : barre « Je candidate » fixe en bas, mobile
 * seulement, même habillage que les barres des pages maisons. Elle apparaît une fois le hero passé et disparaît dès que le
 * rappel final (section 7, qui a déjà son bouton) arrive à l'écran. Masquée au premier rendu, prérendu compris (capture en
 * haut de page) : zéro impact d'hydratation.
 */
function StickyApplyBar({ en, L }: { en: boolean; L: "fr" | "en" }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const hero = document.getElementById("offre-hero");
    const last = document.getElementById("offre-rappel");
    if (!hero || !last || typeof IntersectionObserver === "undefined") return;
    let heroPassed = false;
    let lastReached = false;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) heroPassed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        else lastReached = entry.isIntersecting || entry.boundingClientRect.top < 0;
      }
      setVisible(heroPassed && !lastReached);
    });
    observer.observe(hero);
    observer.observe(last);
    return () => observer.disconnect();
  }, []);
  if (!visible) return null;
  return (
    <div data-offer-sticky className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-[#E7E5E4] px-4 py-3">
      <ApplyButton en={en} L={L} placement="sticky" compact className="w-full" />
    </div>
  );
}

/** Sections mesurées en `offer_section_view` → id de la section dans la page. */
const TRACKED_SECTIONS: ReadonlyArray<[OfferSection, string]> = [
  ["rooms", "chambres-offre"],
  ["concretely", "concretement-offre"],
  ["faq", "faq-offre"],
];
// Paliers de 5 % : de quoi suivre une section plus haute que l'écran (la grille des chambres à 390 px).
const VIEW_THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20);

/**
 * `offer_section_view` une fois par section et par page vue (brief du 19/10/2026, §2.C). Seuil 0,5 : la moitié de la
 * section est visible OU elle occupe la moitié de l'écran — sans ce second cas, une section plus haute que deux écrans
 * (les chambres sur mobile) ne serait jamais comptée. Effet seul, rien de rendu : zéro impact d'hydratation.
 */
function useOfferSectionViews(L: "fr" | "en") {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const targets = new Map<Element, OfferSection>();
    for (const [section, id] of TRACKED_SECTIONS) {
      const el = document.getElementById(id);
      if (el) targets.set(el, section);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const section = targets.get(entry.target);
          if (!section || !entry.isIntersecting) continue;
          const viewport = entry.rootBounds?.height ?? window.innerHeight;
          if (entry.intersectionRatio < 0.5 && entry.intersectionRect.height < viewport / 2) continue;
          targets.delete(entry.target);
          observer.unobserve(entry.target);
          trackOfferSectionView(section, { language: L });
        }
      },
      { threshold: VIEW_THRESHOLDS },
    );
    targets.forEach((_, el) => observer.observe(el));
    return () => observer.disconnect();
  }, [L]);
}

export function OfferHiverPage() {
  const { language } = useLanguage();
  const en = language === "en";
  const L = en ? ("en" as const) : ("fr" as const);
  const T = OFFER_TEXTS[L];

  // État « terminée » : après l'hydratation seulement (voir en-tête du fichier).
  const hydrated = useHydrated();
  const ended = hydrated ? !isOfferActive() : readPrerenderFlag("__offer_state__") === "ended";

  // Le candidat venu de la campagne est rattaché à l'offre pour la session, même s'il candidate ensuite
  // depuis une page maison (src/lib/attribution.ts). Rien de rendu : zéro impact d'hydratation.
  useEffect(() => {
    if (!ended) markOffer(OFFER_ID);
  }, [ended]);

  const endLabel = formatOfferDate(OFFER_END, L);
  const startLabel = formatOfferDate(OFFER_START, L);
  const year = OFFER_END.slice(0, 4);

  const title = en
    ? `Settle in before winter: ${OFFER_DISCOUNT_PERCENT}% off your first month`
    : `Pose tes valises avant l'hiver : −${OFFER_DISCOUNT_PERCENT}\u00a0% sur ton premier mois`;
  const description = en
    ? `Half of your first month on us and your deposit in 2 or 3 instalments, for any lease signed by ${endLabel}. All-inclusive rooms near Geneva.`
    : `La moitié de ton premier mois offerte et la caution en 2 ou 3 fois, pour tout bail signé d'ici le ${endLabel}. Chambres tout inclus près de Genève.`;

  if (ended) {
    return (
      <main data-offer-state="ended" className="relative pt-16 bg-white">
        <SEO title={title} description={description} noindex selfCanonical />
        <section className="py-20 lg:py-28 bg-[#F5F2ED]">
          <div className="container-custom max-w-2xl text-center">
            <h1 className="text-4xl md:text-5xl font-light text-[#1C1917] mb-5" style={{ fontFamily: '"DM Serif Display", serif' }}>
              {en ? "This offer has ended" : "Cette offre est terminée"}
            </h1>
            <p className="text-lg text-[#44403C] mb-8">
              {en
                ? `“${T.name}” closed on ${endLabel} ${year}. Our rooms free now or opening soon are still here — and we reply within ${STATS.responseHours} h.`
                : `L'offre « ${T.name} » s'est terminée le ${endLabel} ${year}. Nos chambres libres ou à venir sont toujours là, et on répond sous ${STATS.responseHours} h.`}
            </p>
            <LocalizedLink
              to="/chambres-disponibles"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#1C1917] text-white font-semibold rounded-lg hover:bg-[#44403C] transition-colors"
            >
              {en ? "See available rooms" : "Voir les chambres disponibles"}
              <ArrowRight className="w-5 h-5" />
            </LocalizedLink>
          </div>
        </section>
      </main>
    );
  }

  return <OfferActive en={en} L={L} title={title} description={description} labels={{ endLabel, startLabel, year }} />;
}

type Labels = { endLabel: string; startLabel: string; year: string };

function OfferActive({ en, L, title, description, labels }: { en: boolean; L: "fr" | "en"; title: string; description: string; labels: Labels }) {
  const { endLabel, startLabel, year } = labels;
  const T = OFFER_TEXTS[L];
  // Jour de Paris des lignes « Bail au … » : celui du prérendu pendant l'hydratation, puis le jour réel.
  const hydrated = useHydrated();
  const todayIso = hydrated ? parisDateIso() : (readPrerenderFlag("__offer_today__") || parisDateIso());

  // Chambres de l'offre : même store que /chambres-disponibles (embed → premier rendu identique au HTML).
  const all = useAllRooms();
  const loadFailed = useRoomsLoadFailed();
  const rooms = splitRooms(all.rooms).candidates.filter(isOfferRoom);
  // Compteur du hero (D7) : même liste, même source ; masqué tant qu'elle est inconnue ou vide.
  const roomsCount = all.known ? rooms.length : 0;
  const countLabel = en
    ? `${roomsCount} ${roomsCount === 1 ? "room" : "rooms"} included`
    : `${roomsCount} ${roomsCount === 1 ? "chambre concernée" : "chambres concernées"}`;
  const onRoomCta = (room: PublicRoom) =>
    trackOfferCta("rooms", { house: room.house_slug, room_id: `chambre-${room.room_number}`, language: L });
  useOfferSectionViews(L);

  const shared = STATS_SHARED_BATH.priceChf; // 1 370
  const standard = STATS.priceChf; // 1 430

  // Prix de la ligne « produit » du hero (brief du 19/10/2026, §2.A) : le plus bas des chambres de l'offre — même liste,
  // même source et même hydratation que le compteur. « dès » / « from » seulement s'il y a plusieurs prix (règle de
  // Jérôme du 14/10) ; liste inconnue ou vide → prix d'appel du site, avec « dès ».
  const offerPrices = [...new Set(rooms.map((r) => Number(r.rent_chf)).filter((n) => Number.isFinite(n) && n > 0))];
  const fromChf = offerPrices.length > 0 ? Math.min(...offerPrices) : shared;
  const pricePrefix = offerPrices.length === 1 ? "" : en ? "from " : "dès ";
  const priceLabel = `${fmtChf(fromChf, en)}/${en ? "month" : "mois"}`;
  const tiers = [
    { chf: shared, eur: CONTRACT_EUR.sharedBath },
    { chf: standard, eur: CONTRACT_EUR.standard },
  ];

  const whoFor = en
    ? ["You're moving to Geneva for a new job.", "You're in an Airbnb, a sublet or staying with friends.", "You're still serving notice on your current place: the half month we offer covers the overlap."]
    : ["Tu arrives à Genève pour un nouveau poste.", "Tu es en Airbnb, en sous-location ou chez des amis.", "Ton préavis court encore : la moitié offerte absorbe le chevauchement."];

  const included = en
    ? ["Utilities (water, electricity, heating)", "Fibre internet", `Cleaning ${STATS.cleaningPerWeek} times a week`, "Pool", "Sauna", "Gym", "No agency fee, no application fee"]
    : ["Charges (eau, électricité, chauffage)", "Internet fibre", `Ménage ${STATS.cleaningPerWeek} fois par semaine`, "Piscine", "Sauna", "Salle de sport", "0 frais d'agence ni de dossier"];

  const months = STATS.depositMonths;
  const faq: QAPair[] = en
    ? [
        { q: "Until when?", a: `Until ${endLabel} ${year}: the offer applies to any lease signed by then, for an application received from ${startLabel}.` },
        { q: "What if my room only frees up in December?", a: `The offer still applies: your lease starts the day the room frees up, as long as you sign it by ${endLabel}.` },
        { q: "When does my lease start?", a: `The day the room frees up, or within ${ALREADY_FREE_START_DAYS} days of signing if it's already free. Still serving notice on your current place? That's exactly what the half month we offer is for.` },
        { q: "How does the deposit in 2 or 3 instalments work?", a: `The deposit is still ${months} months' rent excluding charges. In 2 instalments: half at signature, the other half with your 2nd month's rent. In 3: one third at signature, one third with your 2nd month's rent, one third with your 3rd. It's returned when you leave, under the usual conditions.` },
        { q: "Can it be combined?", a: "No. One offer per person, not combinable with any other offer." },
        { q: "Does the lease length change?", a: `No: ${STATS.leaseDurationMonths}-month lease, you leave whenever you want with ${STATS.noticePeriodMonths} month's notice. The rent written in your lease is the normal rent; the discount is a commercial gesture applied to your first month.` },
        { q: "Can I visit by video call?", a: "Yes. Visit on site or by video call, as you prefer — and you also meet a current resident for an honest take on life in the house." },
      ]
    : [
        { q: "Jusqu'à quand ?", a: `Jusqu'au ${endLabel} ${year} : l'offre s'applique à tout bail signé d'ici là, pour une candidature reçue à partir du ${startLabel}.` },
        { q: "Et si ma chambre ne se libère qu'en décembre ?", a: `L'offre s'applique quand même : ton bail démarre le jour où la chambre se libère, à condition de le signer d'ici le ${endLabel}.` },
        { q: "Mon bail démarre quand ?", a: `Le jour où la chambre se libère, ou dans les ${ALREADY_FREE_START_DAYS} jours suivant la signature si elle est déjà libre. Ton préavis court encore ? C'est justement à ça que sert la moitié offerte.` },
        { q: "Comment marche la caution en 2 ou 3 fois ?", a: `La caution reste de ${months} mois de loyer hors charges. En 2 fois : la moitié à la signature, l'autre avec ton 2ᵉ loyer. En 3 fois : un tiers à la signature, un tiers avec ton 2ᵉ loyer, un tiers avec ton 3ᵉ. Elle t'est restituée à ton départ dans les conditions habituelles.` },
        { q: "C'est cumulable ?", a: "Non. Une seule offre par personne, non cumulable avec une autre offre." },
        { q: "La durée du bail change ?", a: `Non : bail de ${STATS.leaseDurationMonths} mois, tu pars quand tu veux avec ${STATS.noticePeriodMonths} mois de préavis. Le loyer inscrit à ton bail est le loyer normal ; la remise est un geste commercial appliqué sur ton premier mois.` },
        { q: "Je peux visiter en visio ?", a: "Oui. Visite sur place ou en visio, au choix, et tu rencontres aussi un résident actuel pour un retour honnête sur la vie de la maison." },
      ];

  return (
    <main data-offer-state="active" data-offer-today={todayIso} className="relative pt-16 bg-white">
      <SEO title={title} description={description} noindex selfCanonical />

      {/* 1. Hero — sans image (LCP = le H1) ; date limite + bouton visibles sans défiler à 390 px.
          Rebrief du 12/10 : nom de l'offre en surtitre, H1 = la promesse (D6), compteur de chambres (D7).
          Brief du 19/10 : ligne « produit » sous le H1 (quoi, combien, où), puis les conditions en une phrase. */}
      <section id="offre-hero" className="py-10 md:py-16 lg:py-20 bg-[#F5F2ED]">
        <div className="container-custom max-w-3xl text-center">
          <p className="mb-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[#9A5B08]">{T.name}</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#1C1917] mb-4" style={{ fontFamily: '"DM Serif Display", serif' }}>
            {en ? "Half price on your first month" : "Ton premier mois à moitié prix"}
          </h1>
          {/* Prix, noms de lieu et mots à trait d'union insécables (pas de « Léman / Express » ni « Eaux- / Vives » à 390 px). */}
          <p data-offer-product className="text-lg md:text-xl text-[#1C1917] mb-3">
            {en ? (
              <>
                {"A furnished room in a coliving house, "}
                <span className="whitespace-nowrap">all-inclusive</span>
                {`, ${pricePrefix}`}
                <span className="whitespace-nowrap">{priceLabel}</span>
                {", on the French side, 20 min from Geneva "}
                <span className="whitespace-nowrap">Eaux-Vives</span>
                {" by "}
                <span className="whitespace-nowrap">Léman Express</span>
                {"."}
              </>
            ) : (
              <>
                {`Une chambre meublée en coliving, tout inclus, ${pricePrefix}`}
                <span className="whitespace-nowrap">{priceLabel}</span>
                {", côté France à 20 min de "}
                <span className="whitespace-nowrap">Genève-Eaux-Vives</span>
                {" en "}
                <span className="whitespace-nowrap">Léman Express</span>
                {"."}
              </>
            )}
          </p>
          <p className="text-base md:text-lg text-[#44403C] mb-6">
            {en
              ? `Sign by ${endLabel}: half of your first month is on us and your deposit can be paid in 2 or 3 instalments. Your rent stays the same.`
              : `Signe d'ici le ${endLabel} : la moitié de ton premier mois est offerte et ta caution se paie en 2 ou 3 fois. Ton loyer, lui, ne change pas.`}
          </p>
          <p className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#D4A574] rounded-full text-xs sm:text-sm font-medium text-[#1C1917]">
            <span className="w-2 h-2 bg-[#B8860B] rounded-full shrink-0" aria-hidden="true" />
            {en ? `Offer valid for any lease signed by ${endLabel}` : `Offre valable pour tout bail signé jusqu'au ${endLabel}`}
          </p>
          {roomsCount > 0 && (
            <p data-offer-count className="mt-2 text-sm font-semibold text-[#1C1917]">
              <a href="#chambres-offre" className="underline underline-offset-4 hover:text-[#9A5B08]">{countLabel}</a>
            </p>
          )}
          <div className="mt-6">
            <ApplyButton en={en} L={L} className="w-full sm:w-auto" />
          </div>
          {/* (Retenue premium, lot 1, D2 — Jérôme 13/10/2026) « Premier dossier validé, premier servi » ne vit plus que dans les conditions. */}
          <p className="mt-3 text-sm text-[#57534E]">
            {en
              ? `${STATS.applyMinutes}-minute application. Reply within ${STATS.responseHours} h.`
              : `Candidature en ${STATS.applyMinutes} minutes. Réponse sous ${STATS.responseHours} h.`}
          </p>
        </div>
      </section>

      {/* 2. Les chambres — composant partagé, filtré sur « libre maintenant ou datée » (rebrief D5). Remontées juste
          sous le hero le 19/10 : les photos disent en une seconde ce qu'on vend. */}
      <section id="chambres-offre" className="py-14 lg:py-20 scroll-mt-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-light text-[#1C1917] mb-2" style={{ fontFamily: '"DM Serif Display", serif' }}>
            {en ? "The rooms included in the offer" : "Les chambres concernées"}
          </h2>
          <p className="text-[#57534E] mb-8">
            {en ? "Free now or opening soon. Your lease starts the day the room frees up." : "Libres maintenant ou bientôt. Ton bail démarre le jour où la chambre se libère."}
          </p>
          {!all.known ? (
            loadFailed ? (
              <div role="alert" className="bg-[#FAF9F6] border border-[#E7E5E4] rounded-2xl p-8 text-center">
                <p className="text-[#57534E] max-w-xl mx-auto">
                  {en
                    ? "The rooms didn't load. Reload the page, or apply right away — we'll tell you which rooms are free."
                    : "Les chambres ne se sont pas chargées. Recharge la page, ou candidate directement : on te dit quelles chambres sont libres."}
                </p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1C1917] text-white text-sm font-semibold rounded-lg hover:bg-[#44403C] transition-colors"
                >
                  {en ? "Reload the page" : "Recharger la page"}
                </button>
              </div>
            ) : (
              <div role="status" aria-live="polite">
                <span className="sr-only">{en ? "Loading the rooms…" : "Chargement des chambres…"}</span>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-hidden="true">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="bg-white rounded-2xl border border-[#E7E5E4] overflow-hidden animate-pulse">
                      <div className="h-48 bg-[#F5F2ED]" />
                      <div className="p-6 space-y-3">
                        <div className="h-4 w-1/3 bg-[#F5F2ED] rounded" />
                        <div className="h-5 w-1/2 bg-[#EDE8E1] rounded" />
                        <div className="h-10 w-full bg-[#F5F2ED] rounded-lg mt-6" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : rooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <RoomCard
                  key={`${room.house_slug}:${room.room_number}`}
                  house={room.house_slug}
                  houseName={HOUSES[room.house_slug].label}
                  room={room}
                  fallbackImage={HOUSES[room.house_slug].img}
                  showHouse
                  ctaParams={OFFER_QUERY}
                  leaseStart={leaseStartLabel(leaseStartOf(room, todayIso), L)}
                  onCtaClick={onRoomCta}
                />
              ))}
            </div>
          ) : (
            <div className="bg-[#FAF9F6] border border-[#E7E5E4] rounded-2xl p-8 md:p-10 text-center">
              <p className="text-[#44403C] max-w-xl mx-auto mb-5">
                {en
                  ? `All the rooms covered by the offer have just been taken. Apply anyway: early applicants are the first to know when a room becomes available.`
                  : `Les chambres concernées par l'offre viennent toutes de partir. Candidate quand même : les premiers candidats sont les premiers prévenus quand une chambre se libère.`}
              </p>
              <ApplyButton en={en} L={L} />
            </div>
          )}
        </div>
      </section>

      {/* 3. Pour qui — trois cas, une ligne chacun (pas d'autre cible). Filet en haut depuis qu'il suit les chambres. */}
      <section className="py-12 lg:py-16 border-t border-[#E7E5E4]">
        <div className="container-custom max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-light text-[#1C1917] mb-6" style={{ fontFamily: '"DM Serif Display", serif' }}>
            {en ? "Who it's for" : "Pour qui ?"}
          </h2>
          <ul className="space-y-3">
            {whoFor.map((line) => (
              <li key={line} className="flex items-start gap-3 text-[#44403C]">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#b8860b]" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Concrètement — tableau simple et honnête ; le loyer contractuel reste visible tel quel. */}
      <section id="concretement-offre" className="py-14 lg:py-20 bg-[#FAF9F6] border-y border-[#E7E5E4]">
        <div className="container-custom max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-light text-[#1C1917] mb-6" style={{ fontFamily: '"DM Serif Display", serif' }}>
            {en ? "What it means in practice" : "Ce que ça donne concrètement"}
          </h2>
          <div className="overflow-hidden rounded-2xl border border-[#E7E5E4] bg-white">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="bg-[#F5F2ED] text-left text-xs uppercase tracking-wider text-[#78716C]">
                  <th scope="col" className="px-4 py-3 font-semibold">{en ? "Monthly rent, all inclusive" : "Loyer mensuel tout inclus"}</th>
                  <th scope="col" className="px-4 py-3 font-semibold">{en ? "Your first month, discount applied" : "Ton premier mois, remise appliquée"}</th>
                </tr>
              </thead>
              <tbody>
                {tiers.map((t) => (
                  <tr key={t.chf} className="border-t border-[#E7E5E4]">
                    <td className="px-4 py-4 text-[#1C1917]">
                      <span className="font-semibold whitespace-nowrap">{fmtChf(t.chf, en)}</span>{" "}
                      <span className="text-[#78716C] whitespace-nowrap">({fmtEur(t.eur, en)})</span>
                    </td>
                    <td className="px-4 py-4 text-[#1C1917]">
                      <span className="font-semibold text-[#9A5B08] whitespace-nowrap">{fmtChf(discountedFirstMonth(t.chf), en)}</span>{" "}
                      <span className="text-[#78716C] whitespace-nowrap">({fmtEur(discountedFirstMonth(t.eur), en)})</span>
                    </td>
                  </tr>
                ))}
                <tr className="border-t border-[#E7E5E4]">
                  <td className="px-4 py-4 text-[#1C1917] font-semibold">{en ? "Deposit" : "Caution"}</td>
                  <td className="px-4 py-4 text-[#1C1917]">
                    {en
                      ? `${STATS.depositMonths} months' rent excluding charges, in 2 instalments (½ at signature, ½ with the 2nd month's rent) or 3 (⅓ at signature, ⅓ with the 2nd, ⅓ with the 3rd).`
                      : `${STATS.depositMonths} mois de loyer hors charges, en 2 fois (½ à la signature, ½ avec le 2ᵉ loyer) ou en 3 fois (⅓ à la signature, ⅓ avec le 2ᵉ loyer, ⅓ avec le 3ᵉ).`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-[#44403C]">
            {en
              ? "The rent in your lease stays the normal rent; the discount is applied to your first month."
              : "Le loyer de ton bail reste le loyer normal ; la remise est appliquée sur ton premier mois."}
          </p>
          <p className="mt-2 text-xs text-[#78716C]">
            {en
              ? `Conditions: lease signed between ${startLabel} and ${endLabel} ${year} inclusive, for an application received from ${startLabel} · lease starting the day the room frees up (within ${ALREADY_FREE_START_DAYS} days of signing if it's already free) · first approved application, first served · usual lease (${STATS.leaseDurationMonths} months, ${STATS.noticePeriodMonths} month's notice) · one offer per person, not combinable with any other offer. CHF amounts are indicative (${CONTRACT_EUR.rateLabelEn} rate); the contractual rent is in euros.`
              : `Conditions : bail signé entre le ${startLabel} et le ${endLabel} ${year} inclus, pour une candidature reçue à partir du ${startLabel} · bail démarrant le jour où la chambre se libère (dans les ${ALREADY_FREE_START_DAYS} jours suivant la signature si elle est déjà libre) · premier dossier validé, premier servi · bail habituel (${STATS.leaseDurationMonths} mois, préavis ${STATS.noticePeriodMonths} mois) · une seule offre par personne, non cumulable avec une autre offre. Montants en CHF indicatifs (taux d'${CONTRACT_EUR.rateLabelFr}) ; le loyer contractuel est en euros.`}
          </p>
        </div>
      </section>

      {/* 5. Ce qui est inclus — liste existante du site. */}
      <section className="py-14 lg:py-20">
        <div className="container-custom max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-light text-[#1C1917] mb-6" style={{ fontFamily: '"DM Serif Display", serif' }}>
            {en ? "What's included" : "Ce qui est inclus"}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-xl border border-[#E7E5E4] bg-white px-4 py-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#b8860b]" />
                <span className="text-sm text-[#44403C]">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. FAQ de l'offre — JSON-LD FAQPage construit depuis ces 7 questions (page seule, pas situationsFaq). */}
      <FaqSection title={en ? "The offer, question by question" : "L'offre, question par question"} items={faq} emitSchema id="faq-offre" />

      {/* 7. Rappel du bouton (D2 du 13/10/2026 : plus de ligne « premier servi » ici, elle reste dans les conditions). */}
      <section id="offre-rappel" className="py-16 lg:py-24 bg-white">
        <div className="container-custom max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-light text-[#1C1917] mb-6" style={{ fontFamily: '"DM Serif Display", serif' }}>
            {en ? `Settle in before winter: sign by ${endLabel}` : `Pose tes valises avant l'hiver : signe d'ici le ${endLabel}`}
          </h2>
          <ApplyButton en={en} L={L} className="w-full sm:w-auto" />
        </div>
      </section>

      {/* Barre « Je candidate » mobile (option D du 19/10/2026). */}
      <StickyApplyBar en={en} L={L} />

      {/* État chambres embarqué au prérendu — toutes maisons, instance unique par page. */}
      <RoomsEmbed />
    </main>
  );
}
