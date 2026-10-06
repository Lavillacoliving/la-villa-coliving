import { useEffect } from "react";
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
  MOVE_IN_DEADLINE,
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
  trackOfferCta,
} from "@/data/offer";

/**
 * /offre-hiver · /en/winter-offer — Offre A « Pose tes valises avant l'hiver » (brief Jérôme du
 * 06/10/2026, communication Facebook + Ads à partir du 07/10).
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
 * composant partagé RoomCard, filtrées (pur) sur « libre au plus tard le 30/11 » — la ch. 4 du Loft
 * (16/12) n'apparaît donc pas.
 *
 * Formulation (brief §0) : la remise est un geste commercial appliqué sur le premier loyer — jamais
 * « loyer réduit », « loyer à … », ni prix barré/remplacé ; le loyer contractuel reste affiché tel quel.
 */

const fmtChf = (n: number, en: boolean) => (en ? `CHF ${thousands(n, ",")}` : `${thousands(n, " ")} CHF`);
const fmtEur = (n: number, en: boolean) => (en ? `€${thousands(n, ",")}` : `${thousands(n, " ")} €`);

/** Bouton « Je candidate » → /candidature?offre=hiver, mesuré en `offer_cta_click` (placement = landing). */
function ApplyButton({ en, L, className = "" }: { en: boolean; L: "fr" | "en"; className?: string }) {
  return (
    <LocalizedLink
      to={`/candidature?${OFFER_QUERY}`}
      onClick={() => trackOfferCta("landing", { language: L })}
      className={`inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1C1917] text-white font-semibold rounded-lg hover:bg-[#44403C] transition-colors ${className}`}
    >
      {en ? "Apply now" : "Je candidate"}
      <ArrowRight className="w-5 h-5" />
    </LocalizedLink>
  );
}

/** Lendemain de MOVE_IN_DEADLINE (« 1ᵉʳ décembre ») — calcul UTC, pur. */
function nextDayIso(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + 1));
  return `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}-${String(next.getUTCDate()).padStart(2, "0")}`;
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
  const moveInLabel = formatOfferDate(MOVE_IN_DEADLINE, L);
  const beforeLabel = formatOfferDate(nextDayIso(MOVE_IN_DEADLINE), L);
  const year = OFFER_END.slice(0, 4);

  const title = en
    ? `Settle in before winter: ${OFFER_DISCOUNT_PERCENT}% off your first month`
    : `Pose tes valises avant l'hiver : −${OFFER_DISCOUNT_PERCENT} % sur ton premier mois`;
  const description = en
    ? `30% off your first month + deposit in 3 instalments if you move in by ${beforeLabel}. All-inclusive furnished rooms near Geneva. Apply until ${endLabel}.`
    : `−30 % sur ton premier mois et caution en 3 fois si tu emménages avant le ${beforeLabel}. Chambres tout inclus près de Genève. Jusqu'au ${endLabel}.`;

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

  return <OfferActive en={en} L={L} title={title} description={description} labels={{ endLabel, startLabel, moveInLabel, beforeLabel, year }} />;
}

type Labels = { endLabel: string; startLabel: string; moveInLabel: string; beforeLabel: string; year: string };

function OfferActive({ en, L, title, description, labels }: { en: boolean; L: "fr" | "en"; title: string; description: string; labels: Labels }) {
  const { endLabel, startLabel, moveInLabel, beforeLabel, year } = labels;
  const T = OFFER_TEXTS[L];

  // Chambres de l'offre : même store que /chambres-disponibles (embed → premier rendu identique au HTML).
  const all = useAllRooms();
  const loadFailed = useRoomsLoadFailed();
  const rooms = splitRooms(all.rooms).candidates.filter(isOfferRoom);
  const onRoomCta = (room: PublicRoom) =>
    trackOfferCta("rooms", { house: room.house_slug, room_id: `chambre-${room.room_number}`, language: L });

  const shared = STATS_SHARED_BATH.priceChf; // 1 370
  const standard = STATS.priceChf; // 1 430
  const tiers = [
    { chf: shared, eur: CONTRACT_EUR.sharedBath },
    { chf: standard, eur: CONTRACT_EUR.standard },
  ];

  const whoFor = en
    ? ["You're moving to Geneva for a new job.", "You're in an Airbnb, a sublet or staying with friends.", "Your lease ends at the end of November."]
    : ["Tu arrives à Genève pour un nouveau poste.", "Tu es en Airbnb, en sous-location ou chez des amis.", "Ton bail se termine fin novembre."];

  const included = en
    ? ["Utilities (water, electricity, heating)", "Fibre internet", `Cleaning ${STATS.cleaningPerWeek} times a week`, "Pool", "Sauna", "Gym", "No agency fee, no application fee"]
    : ["Charges (eau, électricité, chauffage)", "Internet fibre", `Ménage ${STATS.cleaningPerWeek} fois par semaine`, "Piscine", "Sauna", "Salle de sport", "0 frais d'agence ni de dossier"];

  const faq: QAPair[] = en
    ? [
        { q: "Until when can I apply?", a: `Until ${endLabel} ${year}. The offer applies to any application sent between ${startLabel} and ${endLabel}, for a move-in by ${moveInLabel} at the latest.` },
        { q: "What if I can only move in in December?", a: `The offer doesn't apply: it's reserved for move-ins by ${moveInLabel}. Apply anyway — we'll let you know as soon as a room frees up.` },
        { q: "How does the deposit in 3 instalments work?", a: `The deposit is still ${STATS.depositMonths} months' rent excluding charges. You pay it in three thirds: one third when you sign the lease, one third with your 2nd month's rent, one third with your 3rd. It's returned when you leave, under the usual conditions.` },
        { q: "Can it be combined with another offer?", a: "No. One offer per person, and it can't be combined with any other offer." },
        { q: "Does the lease length change?", a: `No: ${STATS.leaseDurationMonths}-month lease, you leave whenever you want with ${STATS.noticePeriodMonths} month's notice. The rent written in your lease is the normal rent; the discount is a commercial gesture applied to your first month.` },
        { q: "Can I visit by video call?", a: "Yes. Visit on site or by video call, as you prefer — and you also meet a current resident for an honest take on life in the house." },
      ]
    : [
        { q: "Jusqu'à quand je peux candidater ?", a: `Jusqu'au ${endLabel} ${year}. L'offre s'applique à toute candidature envoyée entre le ${startLabel} et le ${endLabel}, pour un emménagement au plus tard le ${moveInLabel}.` },
        { q: "Et si je ne peux emménager qu'en décembre ?", a: `L'offre ne s'applique pas : elle est réservée aux emménagements au plus tard le ${moveInLabel}. Candidate quand même, on te prévient dès qu'une chambre se libère.` },
        { q: "Comment marche la caution en 3 fois ?", a: `La caution reste de ${STATS.depositMonths} mois de loyer hors charges. Tu la règles en trois tiers : un tiers à la signature du bail, un tiers avec ton 2ᵉ loyer, un tiers avec ton 3ᵉ. Elle t'est restituée à ton départ dans les conditions habituelles.` },
        { q: "C'est cumulable avec une autre offre ?", a: "Non. Une seule offre par personne, et elle n'est pas cumulable avec une autre offre." },
        { q: "La durée du bail change ?", a: `Non : bail de ${STATS.leaseDurationMonths} mois, tu pars quand tu veux avec ${STATS.noticePeriodMonths} mois de préavis. Le loyer inscrit à ton bail est le loyer normal ; la remise est un geste commercial appliqué sur ton premier mois.` },
        { q: "Je peux visiter en visio ?", a: "Oui. Visite sur place ou en visio, au choix, et tu rencontres aussi un résident actuel pour un retour honnête sur la vie de la maison." },
      ];

  return (
    <main data-offer-state="active" className="relative pt-16 bg-white">
      <SEO title={title} description={description} noindex selfCanonical />

      {/* 1. Hero — sans image (LCP = le H1) ; date limite + bouton visibles sans défiler à 390 px. */}
      <section className="py-10 md:py-16 lg:py-20 bg-[#F5F2ED]">
        <div className="container-custom max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 px-4 py-2 mb-5 bg-white border border-[#D4A574] rounded-full text-xs sm:text-sm font-medium text-[#1C1917]">
            <span className="w-2 h-2 bg-[#B8860B] rounded-full shrink-0" aria-hidden="true" />
            {en ? `Offer valid for any application until ${endLabel}.` : `Offre valable pour toute candidature jusqu'au ${endLabel}.`}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#1C1917] mb-4" style={{ fontFamily: '"DM Serif Display", serif' }}>
            {T.name}
          </h1>
          <p className="text-lg md:text-xl text-[#44403C] mb-7">
            {en
              ? `30% off your first month + deposit in 3 instalments, if you move in by ${beforeLabel}.`
              : `−30 % sur ton premier mois + caution en 3 fois, si tu emménages avant le ${beforeLabel}.`}
          </p>
          <ApplyButton en={en} L={L} className="w-full sm:w-auto" />
          <p className="mt-3 text-sm text-[#57534E]">
            {en ? `2-minute application. Reply within ${STATS.responseHours} h.` : `Candidature en 2 minutes. Réponse sous ${STATS.responseHours} h.`}
          </p>
        </div>
      </section>

      {/* 2. Pour qui — trois cas, une ligne chacun (pas d'autre cible). */}
      <section className="py-12 lg:py-16 border-b border-[#E7E5E4]">
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

      {/* 3. Les chambres — composant partagé, filtré sur « libre au plus tard le 30/11 ». */}
      <section className="py-14 lg:py-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-light text-[#1C1917] mb-2" style={{ fontFamily: '"DM Serif Display", serif' }}>
            {en ? "The rooms included in the offer" : "Les chambres concernées"}
          </h2>
          <p className="text-[#57534E] mb-8">
            {en ? `Free now, or opening by ${moveInLabel} at the latest.` : `Libres maintenant, ou libérées au plus tard le ${moveInLabel}.`}
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

      {/* 4. Concrètement — tableau simple et honnête ; le loyer contractuel reste visible tel quel. */}
      <section className="py-14 lg:py-20 bg-[#FAF9F6] border-y border-[#E7E5E4]">
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
                      <span className="font-semibold">{fmtChf(t.chf, en)}</span>
                      <span className="text-[#78716C]"> ({fmtEur(t.eur, en)})</span>
                    </td>
                    <td className="px-4 py-4 text-[#1C1917]">
                      <span className="font-semibold text-[#9A5B08]">{fmtChf(discountedFirstMonth(t.chf), en)}</span>
                      <span className="text-[#78716C]"> ({fmtEur(discountedFirstMonth(t.eur), en)})</span>
                    </td>
                  </tr>
                ))}
                <tr className="border-t border-[#E7E5E4]">
                  <td className="px-4 py-4 text-[#1C1917] font-semibold">{en ? "Deposit" : "Caution"}</td>
                  <td className="px-4 py-4 text-[#1C1917]">
                    {en
                      ? `${STATS.depositMonths} months' rent excluding charges, paid in 3 instalments: ⅓ at signature, ⅓ with the 2nd month's rent, ⅓ with the 3rd.`
                      : `${STATS.depositMonths} mois de loyer hors charges, payée en 3 fois : ⅓ à la signature, ⅓ avec le 2ᵉ loyer, ⅓ avec le 3ᵉ.`}
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
              ? `Conditions: application between ${startLabel} and ${endLabel} ${year} · move-in by ${moveInLabel} ${year} at the latest · usual lease (${STATS.leaseDurationMonths} months, ${STATS.noticePeriodMonths} month's notice) · one offer per person, not combinable with any other offer. CHF amounts are indicative (${CONTRACT_EUR.rateLabelEn} rate); the contractual rent is in euros.`
              : `Conditions : candidature entre le ${startLabel} et le ${endLabel} ${year} · emménagement au plus tard le ${moveInLabel} ${year} · bail habituel (${STATS.leaseDurationMonths} mois, préavis ${STATS.noticePeriodMonths} mois) · une seule offre par personne, non cumulable avec une autre offre. Montants en CHF indicatifs (taux d'${CONTRACT_EUR.rateLabelFr}) ; le loyer contractuel est en euros.`}
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

      {/* 6. FAQ de l'offre — JSON-LD FAQPage construit depuis ces 6 questions (page seule, pas situationsFaq). */}
      <FaqSection title={en ? "The offer, question by question" : "L'offre, question par question"} items={faq} emitSchema id="faq-offre" />

      {/* 7. Rappel du bouton + ligne du lot A. */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-custom max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-light text-[#1C1917] mb-6" style={{ fontFamily: '"DM Serif Display", serif' }}>
            {en ? `Settle in before ${beforeLabel}` : `Pose tes valises avant le ${beforeLabel}`}
          </h2>
          <ApplyButton en={en} L={L} className="w-full sm:w-auto" />
          <p className="mt-4 text-sm text-[#57534E]">
            {en
              ? "Early applicants are the first to know when a room becomes available."
              : "Les premiers candidats sont les premiers prévenus quand une chambre se libère."}
          </p>
        </div>
      </section>

      {/* État chambres embarqué au prérendu — toutes maisons, instance unique par page. */}
      <RoomsEmbed />
    </main>
  );
}
