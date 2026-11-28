import { useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { SEO } from "@/components/SEO";
import { LocalizedLink } from "@/components/LocalizedLink";
import { FaqSection } from "@/components/FaqSection";
import { RoomCard } from "@/components/RoomCard";
import { trackPriceWhyClick, type PriceWhyVariant } from "@/data/allInclusive";
import { RoomsEmbed } from "@/components/RoomsEmbed";
import { useLanguage } from "@/contexts/LanguageContext";
import { useHydrated } from "@/hooks/useHydrated";
import { HOUSES } from "@/data/houses";
import { STATS, STATS_SHARED_BATH, HOUSES_FROM, CONTRACT_EUR, PRICE_FROM_CHF_EN, PRICE_FROM_CHF_FR, TAUX_BCE, thousands } from "@/data/stats";
import { markOffer } from "@/lib/attribution";
import { readPrerenderFlag } from "@/lib/prerenderEmbeddedState";
import type { QAPair } from "@/lib/structuredData";
import { splitRooms, useAllRooms, useRoomsLoadFailed, type PublicRoom } from "@/lib/availability";
import {
  ALREADY_FREE_START_DAYS,
  FIRST_YEAR_END,
  FIRST_YEAR_OFFER_ID,
  FIRST_YEAR_QUERY,
  FIRST_YEAR_START,
  FIRST_YEAR_TEXTS,
  FIRST_YEAR_TIERS,
  FIRST_YEAR_TOTAL_EUR,
  OFFER_DISCOUNT_PERCENT,
  OFFER_END,
  OFFER_ID,
  OFFER_QUERY,
  OFFER_START,
  OFFER_TEXTS,
  discountedFirstMonth,
  firstYearLeaseStartLabel,
  firstYearTotalChf,
  formatOfferChf,
  formatOfferDate,
  formatOfferEur,
  isOfferRoom,
  leaseStartLabel,
  leaseStartOf,
  offerPageState,
  parisDateIso,
  parseOfferPageState,
  trackOfferCta,
  trackOfferSectionView,
  type OfferPageState,
  type OfferSection,
} from "@/data/offer";

/**
 * /offre-hiver · /en/winter-offer — Offre A « Pose tes valises avant l'hiver » (brief Jérôme du
 * 06/10/2026 ; rebrief du 12/10/2026 : −50 % sur le premier mois, bail signé du
 * 15/10 au 25/11 inclus, bail démarrant à la libération ; communication Facebook + Ads à partir du 15/10).
 * (02/11/2026, brief « caution permanente ») La caution en 1, 2 ou 3 fois n'est plus un avantage de l'offre : règle
 * permanente pour tout bail (src/data/entityFacts.ts, FAQ du site) ; la FAQ et le tableau de l'offre le rappellent.
 *
 * (21/11/2026, brief « Ta première année avec nous », D1 à D15 de Jérôme) Mêmes adresses (D1 : tous les liens publiés y
 * mènent), trois états marqués sur <main> (`data-offer-state` + `data-offer-id`) et choisis par offerPageState()
 * (src/data/offer.ts) : « active » = l'offre d'hiver, identique jusqu'à sa sortie du site (24/11 à 0 h) ; « premiere-annee » du 24/11 à 0 h
 * (heure de Paris, bascule automatique, D8) au 31/12 inclus — jusqu'à 1 400 € remboursés en quatre paliers, textes du brief
 * §5 ; « ended » à partir du 01/01/2027 (page « terminée » au nom de la nouvelle offre). Jamais « loyer réduit », aucun prix
 * barré, le loyer affiché ne change nulle part, aucun « −50 % » hors de l'état « active ».
 *
 * Page TEMPORAIRE : noindex + canonical auto-référente (pas de concurrence avec /chambres-disponibles),
 * prérendue (LCP des liens d'annonce), hors sitemap. Les dates viennent de src/data/offer.ts ; après la dernière offre,
 * la page affiche « Cette offre est terminée » avec un lien vers /chambres-disponibles — pas
 * de 301 : les liens Facebook et Ads doivent continuer à tomber sur une page qui explique. (Décision A de Jérôme
 * du 02/11/2026) L'état « terminée » rappelle aussi ce qui ne change pas — loyer tout inclus, bail, 0 frais, caution
 * payable en 1, 2 ou 3 fois selon le dossier, visite — avec un lien vers /faq : le post Reddit du 02/11 (r/geneva)
 * renvoie vers /en/winter-offer ; title et description propres à cet état (plus de « −50 % » une fois l'offre close).
 *
 * Hydratation : l'état dépend de la date du lecteur. Pendant l'hydratation le premier rendu
 * reproduit le HTML prérendu (repère `__offer_state__` capturé par main.tsx sur <main data-offer-state>),
 * puis la page se resynchronise sur la date réelle (useHydrated) — même modèle que les filtres de
 * /chambres-disponibles. À la bascule, tant que le robot n'a pas refait le prérendu, le HTML d'hiver s'hydrate tel quel
 * puis la nouvelle offre le remplace. Les chambres viennent de l'embed de la page (RoomsEmbed, 29 lignes) et du
 * composant partagé RoomCard, filtrées (pur) sur « libre maintenant ou datée » (rebrief D5 : la ch. 4 du
 * Loft, libre le 16/12, en fait partie ; D9 : inchangé pour la nouvelle offre). Le compteur du hero (D7) = la longueur de
 * cette même liste. La ligne « Bail au … » dépend du jour de Paris : le premier rendu client relit celui du prérendu
 * (repère `__offer_today__` capturé par main.tsx sur <main data-offer-today>), puis se resynchronise.
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
const SERIF = { fontFamily: '"DM Serif Display", serif' };

/** Bouton « Je candidate » → /candidature?offre=… (offre affichée), mesuré en `offer_cta_click` (placement = landing, sticky pour la barre mobile). */
function ApplyButton({
  en,
  L,
  className = "",
  placement = "landing",
  compact = false,
  query = OFFER_QUERY,
}: {
  en: boolean;
  L: "fr" | "en";
  className?: string;
  placement?: "landing" | "sticky";
  compact?: boolean;
  query?: string;
}) {
  return (
    <LocalizedLink
      to={`/candidature?${query}`}
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
function StickyApplyBar({ en, L, query = OFFER_QUERY }: { en: boolean; L: "fr" | "en"; query?: string }) {
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
      <ApplyButton en={en} L={L} placement="sticky" compact className="w-full" query={query} />
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

/**
 * Chambres de l'offre (les deux offres, D9) : même store que /chambres-disponibles (embed → premier rendu identique au
 * HTML). `roomsCount` = compteur du hero (D7) : même liste, même source ; 0 tant qu'elle est inconnue.
 */
function useOfferRooms() {
  const all = useAllRooms();
  const loadFailed = useRoomsLoadFailed();
  const rooms = splitRooms(all.rooms).candidates.filter(isOfferRoom);
  return { known: all.known, loadFailed, rooms, roomsCount: all.known ? rooms.length : 0 };
}

/**
 * Ligne « produit » du hero (brief du 19/10/2026, §2.A ; ligne de situation de « Ta première année », brief du 21/11 §5) :
 * quoi, combien, où. Prix = le plus bas des chambres de l'offre — même liste, même source et même hydratation que le
 * compteur. « dès » / « from » seulement s'il y a plusieurs prix (règle de Jérôme du 14/10) ; liste inconnue ou vide → prix
 * d'appel du site, avec « dès ». Prix, noms de lieu et mots à trait d'union insécables (pas de « Léman / Express » ni
 * « Eaux- / Vives » à 390 px).
 */
function OfferProductLine({ en, rooms, className }: { en: boolean; rooms: PublicRoom[]; className: string }) {
  const offerPrices = [...new Set(rooms.map((r) => Number(r.rent_chf)).filter((n) => Number.isFinite(n) && n > 0))];
  const fromChf = offerPrices.length > 0 ? Math.min(...offerPrices) : HOUSES_FROM.chf;
  const pricePrefix = offerPrices.length === 1 ? "" : en ? "from " : "dès ";
  const priceLabel = `${fmtChf(fromChf, en)}/${en ? "month" : "mois"}`;
  return (
    <p data-offer-product className={className}>
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
  );
}

/**
 * Grille des chambres de l'offre — composant partagé RoomCard, filtré sur « libre maintenant ou datée » (rebrief D5, D9) :
 * squelette tant que la liste est inconnue, message de rechargement si elle n'a pas pu se charger, encart « toutes parties »
 * si elle est vide. `ctaParams` = le paramètre `?offre=` de l'offre affichée ; `leaseStart` = la ligne de démarrage du bail.
 */
function OfferRoomGrid({
  en,
  L,
  known,
  loadFailed,
  rooms,
  ctaParams,
  leaseStart,
}: {
  en: boolean;
  L: "fr" | "en";
  known: boolean;
  loadFailed: boolean;
  rooms: PublicRoom[];
  ctaParams: string;
  leaseStart: (room: PublicRoom) => string;
}) {
  const onRoomCta = (room: PublicRoom) =>
    trackOfferCta("rooms", { house: room.house_slug, room_id: `chambre-${room.room_number}`, language: L });
  // (13/11/2026) Lien « Ce que comprend le prix » des cartes : événement price_why_click, distinct de offer_cta_click.
  const onPriceWhy = (room: PublicRoom, variant: PriceWhyVariant) =>
    trackPriceWhyClick({ house: room.house_slug, roomNumber: room.room_number, variant, page: "offre_hiver", language: L });
  if (!known) {
    return loadFailed ? (
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
    );
  }
  if (rooms.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <RoomCard
            key={`${room.house_slug}:${room.room_number}`}
            house={room.house_slug}
            houseName={HOUSES[room.house_slug].label}
            room={room}
            fallbackImage={HOUSES[room.house_slug].img}
            showHouse
            ctaParams={ctaParams}
            leaseStart={leaseStart(room)}
            onCtaClick={onRoomCta}
            onPriceWhyClick={onPriceWhy}
          />
        ))}
      </div>
    );
  }
  return (
    <div className="bg-[#FAF9F6] border border-[#E7E5E4] rounded-2xl p-8 md:p-10 text-center">
      <p className="text-[#44403C] max-w-xl mx-auto mb-5">
        {en
          ? `All the rooms covered by the offer have just been taken. Apply anyway: early applicants are the first to know when a room becomes available.`
          : `Les chambres concernées par l'offre viennent toutes de partir. Candidate quand même : les premiers candidats sont les premiers prévenus quand une chambre se libère.`}
      </p>
      <ApplyButton en={en} L={L} query={ctaParams} />
    </div>
  );
}

/** Puces à coche (Pour qui ?, Toujours vrai…) — même habillage que les listes de la page d'hiver. */
function CheckList({ items, className = "space-y-3" }: { items: string[]; className?: string }) {
  return (
    <ul className={className}>
      {items.map((line) => (
        <li key={line} className="flex items-start gap-3 text-[#44403C]">
          <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#b8860b]" />
          <span>{line}</span>
        </li>
      ))}
    </ul>
  );
}

/** « Ce qui est inclus » — liste existante du site (neutre vis-à-vis de l'offre : commune aux deux offres). */
function includedItems(en: boolean): string[] {
  return en
    ? ["Utilities (water, electricity, heating)", "Fibre internet", `Cleaning ${STATS.cleaningPerWeek} times a week`, "Pool", "Sauna", "Gym", "No agency fee, no application fee"]
    : ["Charges (eau, électricité, chauffage)", "Internet fibre", `Ménage ${STATS.cleaningPerWeek} fois par semaine`, "Piscine", "Sauna", "Salle de sport", "0 frais d'agence ni de dossier"];
}

function IncludedSection({ en }: { en: boolean }) {
  return (
    <section className="py-14 lg:py-20">
      <div className="container-custom max-w-3xl">
        <h2 className="text-2xl md:text-3xl text-[#1C1917] mb-6" style={SERIF}>
          {en ? "What's included" : "Ce qui est inclus"}
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {includedItems(en).map((item) => (
            <li key={item} className="flex items-start gap-3 rounded-xl border border-[#E7E5E4] bg-white px-4 py-3">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#b8860b]" />
              <span className="text-sm text-[#44403C]">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function OfferHiverPage() {
  const { language } = useLanguage();
  const en = language === "en";
  const L = en ? ("en" as const) : ("fr" as const);
  const T = OFFER_TEXTS[L];

  // État de la page (offre d'hiver « active », « premiere-annee », « ended ») : la date réelle après l'hydratation
  // seulement ; pendant l'hydratation, celui du HTML prérendu (voir en-tête du fichier). Sans repère (rendu serveur des
  // tests, qui fixent l'état par ce repère) : « active », comme avant le 21/11 — un rendu sans horloge reste déterministe.
  const hydrated = useHydrated();
  const state: OfferPageState = hydrated
    ? offerPageState()
    : parseOfferPageState(readPrerenderFlag("__offer_state__")) ?? "active";

  // Le candidat venu de la campagne est rattaché à l'offre pour la session, même s'il candidate ensuite
  // depuis une page maison (src/lib/attribution.ts). Rien de rendu : zéro impact d'hydratation.
  useEffect(() => {
    if (state === "active") markOffer(OFFER_ID);
    else if (state === FIRST_YEAR_OFFER_ID) markOffer(FIRST_YEAR_OFFER_ID);
  }, [state]);

  if (state === "ended") return <OfferEnded en={en} L={L} />;
  if (state === FIRST_YEAR_OFFER_ID) return <OfferFirstYear en={en} L={L} />;

  const endLabel = formatOfferDate(OFFER_END, L);
  const startLabel = formatOfferDate(OFFER_START, L);
  const year = OFFER_END.slice(0, 4);

  const title = en
    ? `Settle in before winter: ${OFFER_DISCOUNT_PERCENT}% off your first month`
    : `Pose tes valises avant l'hiver : −${OFFER_DISCOUNT_PERCENT}\u00a0% sur ton premier mois`;
  const description = en
    ? `Half of your first month on us for any lease signed by ${endLabel}. All-inclusive rooms near Geneva.`
    : `La moitié de ton premier mois offerte pour tout bail signé d'ici le ${endLabel}. Chambres tout inclus près de Genève.`;

  return (
    <OfferActive en={en} L={L} title={title} description={description} labels={{ endLabel, startLabel, year }} nameLabel={T.name} />
  );
}

/**
 * État « terminée » (décision A de Jérôme, 02/11/2026) : une page qui explique ce qui ne change pas, avec ou sans offre.
 * Valeurs des constantes (STATS, PRICE_FROM_CHF_*), aucun chiffre nouveau ; title/description propres à cet état.
 * (21/11/2026) Depuis la nouvelle offre, l'état « terminée » (à partir du 01/01/2027) porte le nom et la date de fin de
 * « Ta première année avec nous ».
 */
function OfferEnded({ en, L }: { en: boolean; L: "fr" | "en" }) {
  const name = FIRST_YEAR_TEXTS[L].name;
  const endLabel = formatOfferDate(FIRST_YEAR_END, L);
  const year = FIRST_YEAR_END.slice(0, 4);
  const endedTitle = en ? "This offer has ended" : "Cette offre est terminée";
  const endedDescription = en
    ? `“${name}” closed on ${endLabel} ${year}. What stays the same: all-inclusive rent, ${STATS.leaseDurationMonths}-month lease, no fees, deposit payable in 1, 2 or 3 instalments depending on your application.`
    : `L'offre « ${name} » s'est terminée le ${endLabel} ${year}. Ce qui ne change pas : loyer tout inclus, bail de ${STATS.leaseDurationMonths} mois, 0 frais, caution payable en 1, 2 ou 3 fois selon ton dossier.`;
  const stays = en
    ? [
        `All-inclusive rent from ${PRICE_FROM_CHF_EN}/month: utilities, fibre, common-area cleaning, pool, sauna and gym included.`,
        `${STATS.leaseDurationMonths}-month lease: you're free to leave at any time with ${STATS.noticePeriodMonths} month's notice.`,
        `No application fee, no agency fee. Deposit: ${STATS.depositMonths} months' rent excluding charges, payable in 1, 2 or 3 instalments depending on your application.`,
        "Visit on site or by video call, as you prefer.",
      ]
    : [
        `Loyer tout inclus dès ${PRICE_FROM_CHF_FR}/mois : charges, fibre, ménage des espaces communs, piscine, sauna et salle de sport compris.`,
        `Bail de ${STATS.leaseDurationMonths} mois : tu es libre de partir à tout moment avec ${STATS.noticePeriodMonths} mois de préavis.`,
        `0 € de frais de dossier, 0 € de frais d'agence. Caution : ${STATS.depositMonths} mois de loyer hors charges, payable en 1, 2 ou 3 fois selon ton dossier.`,
        "Visite sur place ou en visio, au choix.",
      ];
  return (
    <main data-offer-state="ended" data-offer-id={FIRST_YEAR_OFFER_ID} className="relative pt-16 bg-white">
      <SEO title={endedTitle} description={endedDescription} noindex selfCanonical />
      <section className="py-20 lg:py-28 bg-[#F5F2ED]">
        <div className="container-custom max-w-2xl text-center">
          <h1 className="text-4xl md:text-5xl text-[#1C1917] mb-5" style={SERIF}>
            {endedTitle}
          </h1>
          <p className="text-lg text-[#44403C] mb-8">
            {en
              ? `“${name}” closed on ${endLabel} ${year}. Our rooms free now or opening soon are still here — and we reply within ${STATS.responseHours} h.`
              : `L'offre « ${name} » s'est terminée le ${endLabel} ${year}. Nos chambres libres ou à venir sont toujours là, et on répond sous ${STATS.responseHours} h.`}
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
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-custom max-w-2xl">
          <h2 className="text-2xl md:text-3xl text-[#1C1917] mb-6 text-center" style={SERIF}>
            {en ? "What stays the same, offer or not" : "Ce qui ne change pas, avec ou sans offre"}
          </h2>
          <ul className="space-y-3 text-[#44403C] leading-relaxed">
            {stays.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check className="mt-1 h-5 w-5 shrink-0 text-[#b8860b]" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center">
            <LocalizedLink to="/faq" className="text-[#b8860b] underline underline-offset-4 hover:text-[#1C1917]">
              {en ? "Read the FAQ" : "Lire la FAQ"}
            </LocalizedLink>
          </p>
        </div>
      </section>
    </main>
  );
}

type Labels = { endLabel: string; startLabel: string; year: string };

/** Offre d'hiver (état « active ») — inchangée jusqu'à sa sortie du site, le 24/11 à 0 h (décision du 24/11/2026). */
function OfferActive({
  en,
  L,
  title,
  description,
  labels,
  nameLabel,
}: {
  en: boolean;
  L: "fr" | "en";
  title: string;
  description: string;
  labels: Labels;
  nameLabel: string;
}) {
  const { endLabel, startLabel, year } = labels;
  // Jour de Paris des lignes « Bail au … » : celui du prérendu pendant l'hydratation, puis le jour réel.
  const hydrated = useHydrated();
  const todayIso = hydrated ? parisDateIso() : (readPrerenderFlag("__offer_today__") || parisDateIso());

  // Chambres de l'offre : même store que /chambres-disponibles (embed → premier rendu identique au HTML).
  const { known, loadFailed, rooms, roomsCount } = useOfferRooms();
  // Compteur du hero (D7) : même liste, même source ; masqué tant qu'elle est inconnue ou vide.
  const countLabel = en
    ? `${roomsCount} ${roomsCount === 1 ? "room" : "rooms"} included`
    : `${roomsCount} ${roomsCount === 1 ? "chambre concernée" : "chambres concernées"}`;
  useOfferSectionViews(L);

  const standard = STATS.priceChf; // 1 430

  // Lignes du tableau « Ce que ça donne concrètement » : le palier des chambres 3 et 4 de La Villa (1 370 CHF) et le prix
  // standard (1 430 CHF), dérivés de la source unique (src/data/stats.ts). Le palier des chambres 7 et 8 (1 290 CHF) n'y est
  // pas : aucune chambre de l'offre n'est à ce prix (19/11/2026). Le tableau n'est rendu que tant que
  // l'offre est ouverte (état « ended » plus haut).
  const tiers = [
    ...STATS_SHARED_BATH.tiers.filter((t) => t.eur === CONTRACT_EUR.sharedBath).map((t) => ({ chf: t.chf, eur: t.eur })),
    { chf: standard, eur: CONTRACT_EUR.standard },
  ];

  const whoFor = en
    ? ["You're moving to Geneva for a new job.", "You're in an Airbnb, a sublet or staying with friends.", "You're still serving notice on your current place: the half month we offer covers the overlap."]
    : ["Tu arrives à Genève pour un nouveau poste.", "Tu es en Airbnb, en sous-location ou chez des amis.", "Ton préavis court encore : la moitié offerte absorbe le chevauchement."];

  const months = STATS.depositMonths;
  const faq: QAPair[] = en
    ? [
        { q: "Until when?", a: `Until ${endLabel} ${year}: the offer applies to any lease signed by then, for an application received from ${startLabel}.` },
        { q: "What if my room only frees up in December?", a: `The offer still applies: your lease starts the day the room frees up, as long as you sign it by ${endLabel}.` },
        { q: "When does my lease start?", a: `The day the room frees up, or within ${ALREADY_FREE_START_DAYS} days of signing if it's already free. Still serving notice on your current place? That's exactly what the half month we offer is for.` },
        { q: "How does the deposit in 2 or 3 instalments work?", a: `This applies to all our leases, offer or not. The deposit is still ${months} months' rent excluding charges. In 2 instalments: half at signature, the other half with your 2nd month's rent. In 3: one third at signature, one third with your 2nd month's rent, one third with your 3rd. La Villa sets the number of instalments when your application is approved, based on your financial situation. It's returned when you leave, under the usual conditions.` },
        { q: "Can it be combined?", a: "No. One offer per person, not combinable with any other offer." },
        { q: "Does the lease length change?", a: `No: ${STATS.leaseDurationMonths}-month lease, you leave whenever you want with ${STATS.noticePeriodMonths} month's notice. The rent written in your lease is the normal rent; the discount is a commercial gesture applied to your first month.` },
        { q: "Can I visit by video call?", a: "Yes. Visit on site or by video call, as you prefer — and you also meet a current resident for an honest take on life in the house." },
      ]
    : [
        { q: "Jusqu'à quand ?", a: `Jusqu'au ${endLabel} ${year} : l'offre s'applique à tout bail signé d'ici là, pour une candidature reçue à partir du ${startLabel}.` },
        { q: "Et si ma chambre ne se libère qu'en décembre ?", a: `L'offre s'applique quand même : ton bail démarre le jour où la chambre se libère, à condition de le signer d'ici le ${endLabel}.` },
        { q: "Mon bail démarre quand ?", a: `Le jour où la chambre se libère, ou dans les ${ALREADY_FREE_START_DAYS} jours suivant la signature si elle est déjà libre. Ton préavis court encore ? C'est justement à ça que sert la moitié offerte.` },
        { q: "Comment marche la caution en 2 ou 3 fois ?", a: `C'est valable pour tous nos baux, avec ou sans offre. La caution reste de ${months} mois de loyer hors charges. En 2 fois : la moitié à la signature, l'autre avec ton 2ᵉ loyer. En 3 fois : un tiers à la signature, un tiers avec ton 2ᵉ loyer, un tiers avec ton 3ᵉ. Le nombre de versements est fixé par La Villa au moment de valider ton dossier, en fonction de ta situation financière. Elle t'est restituée à ton départ dans les conditions habituelles.` },
        { q: "C'est cumulable ?", a: "Non. Une seule offre par personne, non cumulable avec une autre offre." },
        { q: "La durée du bail change ?", a: `Non : bail de ${STATS.leaseDurationMonths} mois, tu pars quand tu veux avec ${STATS.noticePeriodMonths} mois de préavis. Le loyer inscrit à ton bail est le loyer normal ; la remise est un geste commercial appliqué sur ton premier mois.` },
        { q: "Je peux visiter en visio ?", a: "Oui. Visite sur place ou en visio, au choix, et tu rencontres aussi un résident actuel pour un retour honnête sur la vie de la maison." },
      ];

  return (
    <main data-offer-state="active" data-offer-id={OFFER_ID} data-offer-today={todayIso} className="relative pt-16 bg-white">
      <SEO title={title} description={description} noindex selfCanonical />

      {/* 1. Hero — sans image (LCP = le H1) ; date limite + bouton visibles sans défiler à 390 px.
          Rebrief du 12/10 : nom de l'offre en surtitre, H1 = la promesse (D6), compteur de chambres (D7).
          Brief du 19/10 : ligne « produit » sous le H1 (quoi, combien, où), puis les conditions en une phrase. */}
      <section id="offre-hero" className="py-10 md:py-16 lg:py-20 bg-[#F5F2ED]">
        <div className="container-custom max-w-3xl text-center">
          <p className="lvc-eyebrow mb-3">{nameLabel}</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-[#1C1917] mb-4" style={SERIF}>
            {en ? "Half price on your first month" : "Ton premier mois à moitié prix"}
          </h1>
          <OfferProductLine en={en} rooms={rooms} className="text-lg md:text-xl text-[#1C1917] mb-3" />
          <p className="text-base md:text-lg text-[#44403C] mb-6">
            {en
              ? `Sign by ${endLabel}: half of your first month is on us. Your rent stays the same.`
              : `Signe d'ici le ${endLabel} : la moitié de ton premier mois est offerte. Ton loyer, lui, ne change pas.`}
          </p>
          <p className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#D4A574] rounded-full text-xs sm:text-sm font-semibold text-[#1C1917]">
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
          <h2 className="text-2xl md:text-3xl text-[#1C1917] mb-2" style={SERIF}>
            {en ? "The rooms included in the offer" : "Les chambres concernées"}
          </h2>
          <p className="text-[#57534E] mb-8">
            {en ? "Free now or opening soon. Your lease starts the day the room frees up." : "Libres maintenant ou bientôt. Ton bail démarre le jour où la chambre se libère."}
          </p>
          <OfferRoomGrid
            en={en}
            L={L}
            known={known}
            loadFailed={loadFailed}
            rooms={rooms}
            ctaParams={OFFER_QUERY}
            leaseStart={(room) => leaseStartLabel(leaseStartOf(room, todayIso), L)}
          />
        </div>
      </section>

      {/* 3. Pour qui — trois cas, une ligne chacun (pas d'autre cible). Filet en haut depuis qu'il suit les chambres. */}
      <section className="py-12 lg:py-16 border-t border-[#E7E5E4]">
        <div className="container-custom max-w-3xl">
          <h2 className="text-2xl md:text-3xl text-[#1C1917] mb-6" style={SERIF}>
            {en ? "Who it's for" : "Pour qui ?"}
          </h2>
          <CheckList items={whoFor} />
        </div>
      </section>

      {/* 4. Concrètement — tableau simple et honnête ; le loyer contractuel reste visible tel quel. */}
      <section id="concretement-offre" className="py-14 lg:py-20 bg-[#FAF9F6] border-y border-[#E7E5E4]">
        <div className="container-custom max-w-3xl">
          <h2 className="text-2xl md:text-3xl text-[#1C1917] mb-6" style={SERIF}>
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
                      ? `${STATS.depositMonths} months' rent excluding charges, payable in 1, 2 or 3 instalments as for all our leases: in 2 (½ at signature, ½ with the 2nd month's rent) or 3 (⅓ at signature, ⅓ with the 2nd, ⅓ with the 3rd). La Villa sets the number of instalments based on your financial situation.`
                      : `${STATS.depositMonths} mois de loyer hors charges, payable en 1, 2 ou 3 fois comme pour tous nos baux : en 2 fois (½ à la signature, ½ avec le 2ᵉ loyer) ou en 3 fois (⅓ à la signature, ⅓ avec le 2ᵉ loyer, ⅓ avec le 3ᵉ). Le nombre de versements est fixé par La Villa selon ta situation financière.`}
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
      <IncludedSection en={en} />

      {/* 6. FAQ de l'offre — JSON-LD FAQPage construit depuis ces 7 questions (page seule, pas situationsFaq). */}
      <FaqSection title={en ? "The offer, question by question" : "L'offre, question par question"} items={faq} emitSchema id="faq-offre" />

      {/* 7. Rappel du bouton (D2 du 13/10/2026 : plus de ligne « premier servi » ici, elle reste dans les conditions). */}
      <section id="offre-rappel" className="py-16 lg:py-24 bg-white">
        <div className="container-custom max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl text-[#1C1917] mb-6" style={SERIF}>
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

/** « 4ᵉ » / « 4th » — rang d'un loyer dans les textes de « Ta première année ». Pur. */
function ordinal(n: number, L: "fr" | "en"): string {
  if (L === "fr") return n === 1 ? "1ᵉʳ" : `${n}ᵉ`;
  const mod100 = n % 100;
  const suffix = mod100 >= 11 && mod100 <= 13 ? "th" : n % 10 === 1 ? "st" : n % 10 === 2 ? "nd" : n % 10 === 3 ? "rd" : "th";
  return `${n}${suffix}`;
}

/**
 * Offre « Ta première année avec nous » (état « premiere-annee », du 24/11 à 0 h au 31/12/2026 inclus, heure de Paris).
 * Textes du brief du 21/11/2026 §5, verbatim (H1, sous-titre, échéance, conditions, « Toujours vrai », FAQ) ; montants,
 * rangs et dates calculés depuis src/data/offer.ts. Propositions à relire par Jérôme (décisions n° 1 à 4 de la recon) :
 * title, surtitre, ligne CHF (D4 : à part, jamais dans la phrase de l'accroche), « Comment ça marche », « Pour qui ? »
 * (troisième ligne de l'hiver adaptée, ligne « déjà à Genève » ajoutée : le nom de l'offre ne doit exclure personne), chapeau
 * des chambres, « Libre maintenant », rappel final. Jamais « loyer réduit », aucun prix barré, le loyer affiché ne change pas.
 * Mêmes ids de section que l'hiver : la mesure `offer_section_view` (rooms · concretely · faq) continue, avec `offer` =
 * « premiere-annee ».
 */
function OfferFirstYear({ en, L }: { en: boolean; L: "fr" | "en" }) {
  const T = FIRST_YEAR_TEXTS[L];
  // Jour de Paris des lignes « Bail au … » : celui du prérendu pendant l'hydratation, puis le jour réel.
  const hydrated = useHydrated();
  const todayIso = hydrated ? parisDateIso() : (readPrerenderFlag("__offer_today__") || parisDateIso());
  const { known, loadFailed, rooms, roomsCount } = useOfferRooms();
  const countLabel = en
    ? `${roomsCount} ${roomsCount === 1 ? "room" : "rooms"} included`
    : `${roomsCount} ${roomsCount === 1 ? "chambre concernée" : "chambres concernées"}`;
  useOfferSectionViews(L);

  const eur = (n: number) => formatOfferEur(n, L);
  const [arrival, threeMonths, sixMonths, oneYear] = FIRST_YEAR_TIERS;
  const total = eur(FIRST_YEAR_TOTAL_EUR);
  const endLabel = formatOfferDate(FIRST_YEAR_END, L);
  const startLabel = formatOfferDate(FIRST_YEAR_START, L);
  const year = FIRST_YEAR_END.slice(0, 4);

  const headline = en ? `${T.name}: up to ${total} back` : `${T.name} : jusqu'à ${total} remboursés`;
  // (D4, décision n° 2) Équivalent en CHF : une phrase à part, sur le site seulement.
  const chfLine = en
    ? `That's about ${formatOfferChf(firstYearTotalChf(TAUX_BCE.eurChf), "en")}.`
    : `Soit environ ${formatOfferChf(firstYearTotalChf(TAUX_BCE.eurChf), "fr")}.`;
  const subtitle = en
    ? `The longer you stay, the more you get back: ${eur(arrival.eur)} off your first rent, then ${eur(threeMonths.eur)} after 3 months, ${eur(sixMonths.eur)} after 6 months and ${eur(oneYear.eur)} after a year. Your rent stays the same.`
    : `Plus tu restes, plus on te rembourse : ${eur(arrival.eur)} dès ton premier loyer, ${eur(threeMonths.eur)} à 3 mois, ${eur(sixMonths.eur)} à 6 mois, ${eur(oneYear.eur)} à 1 an. Ton loyer, lui, ne change pas.`;
  const deadline = en
    ? `For any lease signed by ${endLabel}, even if you only move in in January.`
    : `Pour tout bail signé d'ici le ${endLabel}, même si tu n'arrives qu'en janvier.`;
  // (Décision n° 1, proposition) Title : un montant remboursé, pas un prix de loyer (règle S33).
  const title = headline;
  const description = en
    ? `The longer you stay, the more you get back: ${eur(arrival.eur)} off your first rent, then ${eur(threeMonths.eur)}, ${eur(sixMonths.eur)} and ${eur(oneYear.eur)} after 3, 6 and 12 months. For any lease signed by ${endLabel}.`
    : `Plus tu restes, plus on te rembourse : ${eur(arrival.eur)} dès ton premier loyer, ${eur(threeMonths.eur)} à 3 mois, ${eur(sixMonths.eur)} à 6 mois, ${eur(oneYear.eur)} à 1 an. Pour tout bail signé d'ici le ${endLabel}.`;

  // « Comment ça marche » (proposition) : les quatre paliers, puis le déroulé des virements.
  const steps: Array<[string, string]> = en
    ? [
        ["When you move in:", `${eur(arrival.eur)} off your first full month's rent.`],
        ["After 3 months:", `${eur(threeMonths.eur)} paid back by bank transfer, once your ${ordinal(threeMonths.rent, "en")} rent is paid.`],
        ["After 6 months:", `${eur(sixMonths.eur)}, once your ${ordinal(sixMonths.rent, "en")} rent is paid.`],
        ["After a year:", `${eur(oneYear.eur)}, once your ${ordinal(oneYear.rent, "en")} rent is paid.`],
      ]
    : [
        ["À l'arrivée :", `${eur(arrival.eur)} déduits de ton premier loyer complet.`],
        ["À 3 mois :", `${eur(threeMonths.eur)} remboursés par virement, une fois ton ${ordinal(threeMonths.rent, "fr")} loyer réglé.`],
        ["À 6 mois :", `${eur(sixMonths.eur)}, une fois ton ${ordinal(sixMonths.rent, "fr")} loyer réglé.`],
        ["À 1 an :", `${eur(oneYear.eur)}, une fois ton ${ordinal(oneYear.rent, "fr")} loyer réglé.`],
      ];
  const ribLine = en
    ? "A month before each step, we let you know and ask for your bank details."
    : "Un mois avant chaque palier, on te prévient et on te demande ton RIB.";

  // « Pour qui ? » de l'hiver, adapté : sa troisième ligne parlait de « la moitié offerte » ; la ligne « déjà à Genève »
  // suit le choix du nom (brief §1 : ne pas exclure ceux qui vivent déjà à Genève).
  const whoFor = en
    ? [
        "You're moving to Geneva for a new job.",
        "You already live in Geneva or the area and want to move.",
        "You're in an Airbnb, a sublet or staying with friends.",
        `You're still serving notice on your current place: sign by ${endLabel}, even if you only move in in January.`,
      ]
    : [
        "Tu arrives à Genève pour un nouveau poste.",
        "Tu vis déjà à Genève ou dans la région et tu veux changer de logement.",
        "Tu es en Airbnb, en sous-location ou chez des amis.",
        `Ton préavis court encore : signe d'ici le ${endLabel}, même si tu n'arrives qu'en janvier.`,
      ];

  // Conditions (brief §5, verbatim).
  const conditions = en
    ? [
        `${eur(arrival.eur)} off your first full month's rent.`,
        `${eur(threeMonths.eur)} after 3 months, ${eur(sixMonths.eur)} after 6 months, ${eur(oneYear.eur)} after a year: paid back by bank transfer once your ${ordinal(threeMonths.rent, "en")}, ${ordinal(sixMonths.rent, "en")} and ${ordinal(oneYear.rent, "en")} rents are paid.`,
        "A step is earned if, when that rent is due, your lease is running, no notice has been given and your rent is up to date. What you have already received stays yours.",
        "Your rent stays the same: you pay it as usual, and we pay you back separately.",
        `For any lease signed between ${startLabel} and ${endLabel} ${year}, at La Villa, Le Loft or Le Lodge.`,
      ]
    : [
        `${eur(arrival.eur)} déduits de ton premier loyer complet.`,
        `${eur(threeMonths.eur)} après 3 mois, ${eur(sixMonths.eur)} après 6 mois, ${eur(oneYear.eur)} après 1 an : remboursés par virement, une fois ton ${ordinal(threeMonths.rent, "fr")}, ton ${ordinal(sixMonths.rent, "fr")} et ton ${ordinal(oneYear.rent, "fr")} loyer réglés.`,
        "Un palier est acquis si ton bail est en cours, sans préavis donné, et tes loyers à jour à l'échéance du loyer concerné. Ce que tu as déjà reçu te reste acquis.",
        "Ton loyer ne change pas : tu le paies normalement, on te rembourse à part.",
        `Pour tout bail signé du ${startLabel} au ${endLabel} ${year}, à La Villa, au Loft ou au Lodge.`,
      ];

  // « Toujours vrai, avec ou sans offre » (brief §5) : tout inclus, 0 € de frais de dossier, caution, visite.
  const always = en
    ? [
        "All-inclusive: utilities, fibre, common-area cleaning, pool, sauna and gym are included in your rent.",
        "No application fee.",
        `Deposit of ${STATS.depositMonths} months' rent excluding charges, payable in 1, 2 or 3 instalments (the landlord decides how many, based on your application).`,
        "Visit on site or by video call.",
      ]
    : [
        "Tout inclus : charges, fibre, ménage des espaces communs, piscine, sauna et salle de sport sont compris dans ton loyer.",
        "0 € de frais de dossier.",
        `Caution de ${STATS.depositMonths} mois de loyer hors charges, payable en 1, 2 ou 3 fois (le nombre de versements est décidé par le bailleur selon ton dossier).`,
        "Visite sur place ou en visio.",
      ];

  // FAQ de l'offre (brief §5, verbatim en FR ; EN : la question 1 du brief, les autres traduites).
  const faq: QAPair[] = en
    ? [
        { q: "How do I get the money?", a: `The ${eur(arrival.eur)} comes off your first full month's rent. For the next steps, we let you know a month ahead, you send us your bank details and we make a transfer.` },
        { q: "What if I leave before a year?", a: "You can leave whenever you want, with one month's notice. You keep what you've already received; the later steps aren't paid." },
        { q: "I already live in Geneva or the area. Am I eligible?", a: `Yes. The offer applies to anyone who signs their first lease with us by ${endLabel}.` },
        { q: "What if my room only frees up in January?", a: "The offer still applies: what counts is the date you sign." },
        { q: "Does my rent change?", a: "No. The rent in your lease stays the same all year." },
        { q: "And the deposit?", a: "Two months' rent excluding charges, payable in 1, 2 or 3 instalments depending on your application. That's true all year round." },
        { q: "Can I combine it with the referral scheme?", a: "Yes: the resident who recommends you keeps their reward." },
      ]
    : [
        { q: "Comment je reçois ces montants ?", a: `Les ${eur(arrival.eur)} sont déduits de ton premier loyer complet. Pour les suivants, on te prévient un mois avant, tu nous envoies ton RIB et on te fait un virement.` },
        { q: "Et si je pars avant un an ?", a: "Tu pars quand tu veux, avec un mois de préavis. Tu gardes ce que tu as déjà reçu ; les paliers suivants ne sont pas versés." },
        { q: "Je vis déjà à Genève ou dans la région, j'y ai droit ?", a: `Oui. L'offre vaut pour toute personne qui signe son premier bail chez nous d'ici le ${endLabel}.` },
        { q: "Ma chambre ne se libère qu'en janvier ?", a: "L'offre s'applique : c'est la date de signature qui compte." },
        { q: "Mon loyer change ?", a: "Non. Le loyer de ton bail reste le même toute l'année." },
        { q: "Et la caution ?", a: "Deux mois de loyer hors charges, payable en 1, 2 ou 3 fois selon ton dossier. C'est vrai toute l'année." },
        { q: "C'est cumulable avec le parrainage ?", a: "Oui : le résident qui te recommande garde son avantage." },
      ];

  const h2 = "text-2xl md:text-3xl text-[#1C1917] mb-6";
  return (
    <main data-offer-state={FIRST_YEAR_OFFER_ID} data-offer-id={FIRST_YEAR_OFFER_ID} data-offer-today={todayIso} className="relative pt-16 bg-white">
      <SEO title={title} description={description} noindex selfCanonical />

      {/* 1. Hero — sans image (LCP = le H1). Surtitre (échéance), accroche, équivalent CHF à part (D4), sous-titre, ligne de
          situation (celle de l'hiver), échéance, compteur, bouton. */}
      <section id="offre-hero" className="py-10 md:py-16 lg:py-20 bg-[#F5F2ED]">
        <div className="container-custom max-w-3xl text-center">
          <p className="lvc-eyebrow mb-3">
            {en ? `Offer until ${endLabel}` : `Offre jusqu'au ${endLabel}`}
          </p>
          <h1 className="text-[2rem] leading-tight sm:text-4xl md:text-5xl lg:text-6xl text-[#1C1917] mb-2" style={SERIF}>
            {headline}
          </h1>
          <p data-offer-chf className="mb-4 text-sm text-[#78716C]">{chfLine}</p>
          <p className="text-base md:text-lg text-[#44403C] mb-3">{subtitle}</p>
          <OfferProductLine en={en} rooms={rooms} className="text-base md:text-lg text-[#1C1917] mb-5" />
          <p data-offer-deadline className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#D4A574] rounded-2xl text-xs sm:text-sm font-semibold text-[#1C1917] text-left sm:text-center">
            <span className="w-2 h-2 bg-[#B8860B] rounded-full shrink-0" aria-hidden="true" />
            <span>{deadline}</span>
          </p>
          {roomsCount > 0 && (
            <p data-offer-count className="mt-2 text-sm font-semibold text-[#1C1917]">
              <a href="#chambres-offre" className="underline underline-offset-4 hover:text-[#9A5B08]">{countLabel}</a>
            </p>
          )}
          <div className="mt-6">
            <ApplyButton en={en} L={L} className="w-full sm:w-auto" query={FIRST_YEAR_QUERY} />
          </div>
          <p className="mt-3 text-sm text-[#57534E]">
            {en
              ? `${STATS.applyMinutes}-minute application. Reply within ${STATS.responseHours} h.`
              : `Candidature en ${STATS.applyMinutes} minutes. Réponse sous ${STATS.responseHours} h.`}
          </p>
        </div>
      </section>

      {/* 2. Les chambres (D9 : inchangé — libres ou à date connue, dans les trois maisons). Décision n° 4 proposée : « Libre
          maintenant » au lieu de « dans les 7 jours suivant la signature ». */}
      <section id="chambres-offre" className="py-14 lg:py-20 scroll-mt-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl text-[#1C1917] mb-2" style={SERIF}>
            {en ? "The rooms included in the offer" : "Les chambres concernées"}
          </h2>
          <p className="text-[#57534E] mb-8">
            {en
              ? "Free now or opening soon: what counts is the date you sign your lease, not the date you move in."
              : "Libres maintenant ou bientôt : c'est la date de signature du bail qui compte, pas celle de ton arrivée."}
          </p>
          <OfferRoomGrid
            en={en}
            L={L}
            known={known}
            loadFailed={loadFailed}
            rooms={rooms}
            ctaParams={FIRST_YEAR_QUERY}
            leaseStart={(room) => firstYearLeaseStartLabel(leaseStartOf(room, todayIso), L)}
          />
        </div>
      </section>

      {/* 3. Pour qui ? — adapté (voir plus haut). */}
      <section className="py-12 lg:py-16 border-t border-[#E7E5E4]">
        <div className="container-custom max-w-3xl">
          <h2 className={h2} style={SERIF}>
            {en ? "Who it's for" : "Pour qui ?"}
          </h2>
          <CheckList items={whoFor} />
        </div>
      </section>

      {/* 4. Comment ça marche — les quatre paliers (proposition), id de la section « concretely » de la mesure. */}
      <section id="concretement-offre" className="py-14 lg:py-20 bg-[#FAF9F6] border-y border-[#E7E5E4]">
        <div className="container-custom max-w-3xl">
          <h2 className={h2} style={SERIF}>
            {en ? "How it works" : "Comment ça marche"}
          </h2>
          <ol data-offer-steps className="space-y-3">
            {steps.map(([label, text], i) => (
              <li key={label} className="flex items-start gap-3 rounded-xl border border-[#E7E5E4] bg-white px-4 py-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F5F2ED] text-xs font-semibold text-[#9A5B08]"
                >
                  {i + 1}
                </span>
                <span className="text-[#44403C]">
                  <strong className="font-semibold text-[#1C1917]">{label}</strong> {text}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-[#44403C]">{ribLine}</p>
        </div>
      </section>

      {/* 5. Conditions (brief §5, verbatim). */}
      <section className="py-14 lg:py-20">
        <div className="container-custom max-w-3xl">
          <h2 className={h2} style={SERIF}>
            {en ? "Conditions" : "Conditions"}
          </h2>
          <CheckList items={conditions} />
        </div>
      </section>

      {/* 6. Ce qui est permanent (brief §5 : tout inclus, 0 frais, caution — un acquis, pas un avantage de l'offre). */}
      <section className="py-14 lg:py-20 bg-[#FAF9F6] border-y border-[#E7E5E4]">
        <div className="container-custom max-w-3xl">
          <h2 className={h2} style={SERIF}>
            {en ? "Always true, offer or not" : "Toujours vrai, avec ou sans offre"}
          </h2>
          <CheckList items={always} />
        </div>
      </section>

      {/* 7. Ce qui est inclus — liste existante du site, neutre vis-à-vis de l'offre. */}
      <IncludedSection en={en} />

      {/* 8. FAQ de l'offre — JSON-LD FAQPage construit depuis ces 7 questions. */}
      <FaqSection title={en ? "The offer, question by question" : "L'offre, question par question"} items={faq} emitSchema id="faq-offre" />

      {/* 9. Rappel final (proposition). */}
      <section id="offre-rappel" className="py-16 lg:py-24 bg-white">
        <div className="container-custom max-w-3xl text-center">
          <h2 className={h2} style={SERIF}>
            {en ? `${headline}, for any lease signed by ${endLabel}` : `${headline}, pour tout bail signé d'ici le ${endLabel}`}
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <ApplyButton en={en} L={L} className="w-full sm:w-auto" query={FIRST_YEAR_QUERY} />
            <a
              href="#chambres-offre"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-4 border border-[#1C1917] text-[#1C1917] font-semibold rounded-lg hover:bg-[#F5F2ED] transition-colors"
            >
              {en ? "See the rooms" : "Voir les chambres"}
            </a>
          </div>
        </div>
      </section>

      {/* Barre « Je candidate » mobile (option D du 19/10/2026). */}
      <StickyApplyBar en={en} L={L} query={FIRST_YEAR_QUERY} />

      {/* État chambres embarqué au prérendu — toutes maisons, instance unique par page. */}
      <RoomsEmbed />
    </main>
  );
}
