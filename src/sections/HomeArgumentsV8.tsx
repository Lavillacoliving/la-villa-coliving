/**
 * Accueil — les blocs de l'argumentation (lot 2 de la refonte des pages de vente ; maquette téléphone validée par Jérôme le
 * 24/11/2026, rapport « Pages qui vendent », § 4.1).
 *
 * Ordre de la page (HomePage.tsx) : promesse → quatre chiffres → maisons → « Une communauté, pas un immeuble » → le prix,
 * expliqué → « Viens nous rencontrer » → note Google → autres options → FAQ → fiche « l'essentiel » → articles → dernier appel.
 * Ces blocs remplacent « Ce que ton loyer comprend », les quatre badges, « Une maison, pas un immeuble », les témoignages et
 * « Nous rejoindre est simple » : chaque fait n'est dit qu'une fois, lu dans les sources (stats.ts, priceFacts.ts, TRANSIT).
 * Une phrase = un nœud texte (chaînes construites d'un tenant) ; les liens sont des éléments à part (anti-#418).
 * « Programmer une visite » (décision du 24/11/2026, § 4.7) mène au formulaire `/candidature`, dont l'adresse ne change pas.
 */
import type { ComponentType } from "react";
import { ArrowRight, CircleCheck, Home, TrainFront, Waves } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { RatingStars } from "@/components/RatingStars";
import { FacebookGroupLine } from "@/components/FacebookGroupLine";
import { AppartTeaser } from "@/components/appart/AppartTeaser";
import { useLanguage } from "@/contexts/LanguageContext";
import { colocGeneveHref } from "@/lib/siteLinks";
import {
  GOOGLE_REVIEWS,
  GOOGLE_REVIEWS_LINK_LABEL,
  PRICE_FROM_CHF_EN,
  PRICE_FROM_CHF_FR,
  STATS,
  STATS_DISPLAY,
} from "@/data/stats";
import { housesChfPerM2Text, timesPerWeek } from "@/data/priceFacts";
import { housesStationWalk } from "@/data/houseLocation";
import { PRICE_INCLUDES_LINK } from "@/data/allInclusive";

/** Mesure GA4 — même garde que les autres boutons du site : jamais bloquant. */
function track(event: string, params: Record<string, unknown>): void {
  try {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", event, params);
  } catch { /* noop */ }
}

const EYEBROW = "block text-[#44403C] text-[13px] font-semibold tracking-[0.1em] uppercase";
const H2 = "text-3xl md:text-4xl font-bold text-[#1C1917] mt-3 mb-6 md:mb-10";
const H2_STYLE = { letterSpacing: "-0.025em" } as const;
const TEXT_LINK =
  "inline-flex items-center gap-1.5 font-semibold text-[#44403C] underline decoration-[#D4A574] decoration-2 underline-offset-4 hover:text-[#1C1917] transition-colors";
const PRIMARY_BUTTON =
  "inline-flex items-center justify-center gap-2 bg-[#D4A574] text-[#1C1917] px-8 py-4 rounded-lg font-bold text-base hover:bg-[#E0BB8A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#44403C] focus-visible:ring-offset-2";

/** Quatre chiffres, juste sous la promesse (ils étaient sur la photo du haut de page). */
export function HomeStats() {
  const { language } = useLanguage();
  const en = language === "en";
  const stats = [
    { key: "residents", value: `${STATS.totalResidents}+`, label: en ? `residents since ${STATS.foundedYear}` : `résidents depuis ${STATS.foundedYear}` },
    {
      key: "rooms",
      value: en ? `${STATS.roomSizeMin} to ${STATS.roomSizeMax} m²` : `${STATS.roomSizeMin} à ${STATS.roomSizeMax} m²`,
      label: en ? "private furnished rooms" : "chambres privées, meublées",
    },
    { key: "price", value: en ? `from ${PRICE_FROM_CHF_EN}` : `dès ${PRICE_FROM_CHF_FR}`, label: en ? "a month, all inclusive" : "par mois, tout inclus" },
    {
      key: "stay",
      value: en ? `${STATS.averageStayMonths} months` : `${STATS.averageStayMonths} mois`,
      label: en ? "average stay" : "de séjour en moyenne",
    },
  ];
  // (Lot 2a, 27/11/2026, version B §0.9) Une ligne entre deux filets ; chiffres en DM Serif Display, couleur d'accent.
  return (
    <section className="bg-lvc-page">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5 border-y border-lvc-line py-6 md:py-7">
          {stats.map((s) => (
            <div key={s.key}>
              <p className="lvc-display text-2xl md:text-[34px] leading-none text-lvc-accent">{s.value}</p>
              <p className="text-sm text-lvc-muted mt-2 leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type Reason = { key: string; icon: ComponentType<{ className?: string }>; title: string; text: string; link?: { to: string; label: string } };

/** « Une communauté, pas un immeuble. » — quatre raisons, chacune dite une fois (titre choisi par Jérôme dans la maquette). */
export function HomeWhy() {
  const { language } = useLanguage();
  const en = language === "en";
  const L = en ? "en" : "fr";
  const distance = STATS_DISPLAY[L].distance;
  const reasons: Reason[] = [
    {
      key: "community",
      icon: Home,
      title: en
        ? `${STATS.minResidentsPerHouse} to ${STATS.maxResidentsPerHouse} residents per house`
        : `${STATS.minResidentsPerHouse} à ${STATS.maxResidentsPerHouse} résidents par maison`,
      text: en
        ? "Real houses with gardens and terraces: bonds form naturally, without forcing it."
        : "De vraies maisons avec jardin et terrasses : les liens se créent sans forcer.",
    },
    {
      key: "amenities",
      icon: Waves,
      title: en ? "Pool, sauna and gym, in every house" : "Piscine, sauna et salle de sport, dans chaque maison",
      text: en ? "Indoor pool at Le Loft, outdoor at La Villa and Le Lodge." : "Piscine intérieure au Loft, extérieure à La Villa et au Lodge.",
    },
    {
      key: "rent",
      icon: CircleCheck,
      title: en ? "One rent, everything included" : "Un seul loyer, tout compris",
      // Parking compris (au Lodge, sans place attribuée) ; aucun compteur de services (brief « budget réel » du 23/11/2026,
      // lot 3 : « 24 services » disparaît partout).
      text: en
        ? `Bills, fibre up to ${STATS.fiberSpeed}, parking, cleaning of the shared areas ${timesPerWeek("en")}, streaming, fitness classes, bed linen.`
        : `Charges, fibre jusqu'à ${STATS.fiberSpeed}, parking, ménage des communs ${timesPerWeek("fr")}, streaming, cours de sport, linge de lit.`,
      link: { to: "/services", label: en ? "See all the services" : "Voir tous les services" },
    },
    {
      key: "commute",
      icon: TrainFront,
      // (D1, 09/10/2026) « 20 min » toujours qualifié : le libellé de marque entier (STATS_DISPLAY.distance).
      title: distance.charAt(0).toUpperCase() + distance.slice(1),
      // Marche jusqu'à la gare : houseLocation.ts (source unique de l'emplacement), jamais une minute en dur.
      text: en
        ? `Annemasse station is ${housesStationWalk("en")} on foot from the houses.`
        : `La gare d'Annemasse est à ${housesStationWalk("fr")} à pied des maisons.`,
    },
  ];
  return (
    <section className="py-12 md:py-24 bg-[#F5F2ED]">
      <div className="max-w-5xl mx-auto px-6">
        <span className={EYEBROW}>{en ? "WHY LA VILLA" : "POURQUOI LA VILLA"}</span>
        <h2 className={H2} style={H2_STYLE}>{en ? "A community, not a building." : "Une communauté, pas un immeuble."}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
          {reasons.map((r) => (
            <div key={r.key} className="flex gap-4">
              <span className="w-11 h-11 shrink-0 rounded-xl bg-white border border-[#E7E5E4] flex items-center justify-center" aria-hidden="true">
                <r.icon className="w-5 h-5 text-[#8A6508]" />
              </span>
              <div className="min-w-0">
                <h3 className="text-base md:text-lg font-semibold text-[#1C1917] mb-1">{r.title}</h3>
                <p className="text-[15px] text-[#57534E] leading-relaxed">{r.text}</p>
                {r.link && (
                  <LocalizedLink
                    to={r.link.to}
                    onClick={() => track("cta_click", { cta_position: "why_services", cta_target: r.link?.to, language })}
                    className={`${TEXT_LINK} mt-2 text-sm`}
                  >
                    {r.link.label}
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </LocalizedLink>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** « Le prix, expliqué » — titre choisi par Jérôme dans la maquette. Prix au m² = source unique (priceFacts.ts). La FAQ
 *  « La Villa Coliving est-elle chère ? » reste plus bas, inchangée (rendue une fois, garde check:facts). */
export function HomePrice() {
  const { language } = useLanguage();
  const en = language === "en";
  return (
    <section className="py-12 md:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <span className={EYEBROW}>{en ? "THE PRICE, EXPLAINED" : "LE PRIX, EXPLIQUÉ"}</span>
        <h2 className={H2} style={H2_STYLE}>
          {en ? "More complete than a regular flatshare. All inclusive." : "Plus complet qu'une coloc classique. Tout compris."}
        </h2>
        <div className="space-y-3 text-base md:text-lg text-[#44403C] leading-relaxed">
          <p>
            {en
              ? `From ${PRICE_FROM_CHF_EN} a month, with your furnished room, bills, fibre, parking, cleaning of the shared areas ${timesPerWeek("en")}, the pool, the sauna and the gym.`
              : `Dès ${PRICE_FROM_CHF_FR} par mois, avec la chambre meublée, les charges, la fibre, le parking, le ménage des communs ${timesPerWeek("fr")}, la piscine, le sauna et la salle de sport.`}
          </p>
          <p>
            {en
              ? `Per square metre, it costs less than it seems: ${housesChfPerM2Text("en")}, all inclusive.`
              : `Rapporté au mètre carré, c'est moins cher qu'il n'y paraît : ${housesChfPerM2Text("fr")}, tout compris.`}
          </p>
          <p>{en ? "No application or agency fees." : "Aucun frais de dossier ni d'agence."}</p>
        </div>
        {/* (25/11/2026, décision de Jérôme) Le lien mène à « Ce que La Villa Coliving offre de plus qu'une colocation » de /tarifs
            (#objection-prix, même cible que le lien « Ce que comprend le prix » des cartes chambres ; arrivée gérée par la page). */}
        <LocalizedLink
          to={PRICE_INCLUDES_LINK.to}
          onClick={() => track("cta_click", { cta_position: "price_explained", cta_target: PRICE_INCLUDES_LINK.to, language })}
          className={`${TEXT_LINK} mt-6`}
        >
          {en ? "See all prices" : "Voir tous les tarifs"}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </LocalizedLink>
      </div>
    </section>
  );
}

/** « Viens nous rencontrer » — trois étapes et « Programmer une visite » (§ 4.7). Délai et caution : formulations canoniques. */
export function HomeVisit() {
  const { language } = useLanguage();
  const en = language === "en";
  const steps = [
    {
      key: "request",
      title: en ? "Request your visit" : "Demande ta visite",
      text: en
        ? `${STATS.applyMinutes} minutes, no CV, no commitment. Fanny replies within ${STATS.responseHours} h.`
        : `${STATS.applyMinutes} minutes, sans CV ni engagement. Fanny te répond sous ${STATS.responseHours} h.`,
    },
    {
      key: "visit",
      title: en ? "Visit, on site or by video" : "Visite, sur place ou en vidéo",
      text: en ? "See the house, your room and the vibe, at your own pace." : "Tu découvres la maison, ta chambre et l'ambiance, à ton rythme.",
    },
    {
      key: "move",
      title: en ? "Move in" : "Emménage",
      text: en
        ? "Within 72 h of your first contact if a room is available. Deposit payable in 1, 2 or 3 instalments depending on your application."
        : "72 h dès le premier contact si une chambre est disponible. Caution payable en 1, 2 ou 3 fois selon ton dossier.",
    },
  ];
  return (
    <section id="visite" className="pt-12 pb-6 md:pt-24 md:pb-10 bg-[#F5F2ED] scroll-mt-24">
      <div className="max-w-3xl mx-auto px-6">
        <span className={EYEBROW}>{en ? "HOW IT WORKS" : "COMMENT ÇA SE PASSE"}</span>
        <h2 className={H2} style={H2_STYLE}>{en ? "Come and meet us" : "Viens nous rencontrer"}</h2>
        <ol className="space-y-5">
          {steps.map((s, i) => (
            <li key={s.key} className="flex gap-4">
              <span className="w-9 h-9 shrink-0 rounded-full bg-[#1C1917] text-white text-sm font-bold flex items-center justify-center" aria-hidden="true">
                {i + 1}
              </span>
              <div className="min-w-0">
                <h3 className="text-base md:text-lg font-semibold text-[#1C1917] mb-1">{s.title}</h3>
                <p className="text-[15px] text-[#57534E] leading-relaxed">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-col items-center gap-3">
          <LocalizedLink
            to="/candidature"
            onClick={() => track("cta_click", { cta_position: "how_to_join", cta_target: "/candidature", language })}
            className={`${PRIMARY_BUTTON} w-full sm:w-auto`}
          >
            {en ? "Book a visit" : "Programmer une visite"}
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </LocalizedLink>
          <p className="text-sm text-[#57534E] text-center">
            {en
              ? `On site or by video · No commitment · Reply within ${STATS.responseHours} h`
              : `Sur place ou en vidéo · Sans engagement · Réponse sous ${STATS.responseHours} h`}
          </p>
        </div>
      </div>
    </section>
  );
}

/** Note Google, juste sous « Viens nous rencontrer » (décision de Jérôme du 24/11/2026 : pas d'extraits d'avis). Toujours
 *  « sur Google » avec le lien « Voir les avis » (GOOGLE_REVIEWS, stats.ts). */
export function HomeGoogleRating() {
  const { language } = useLanguage();
  const L = language === "en" ? "en" : "fr";
  return (
    <section className="pt-2 pb-12 md:pb-24 bg-[#F5F2ED]">
      <div className="max-w-md mx-auto px-6">
        <div className="bg-white border border-[#E7E5E4] rounded-2xl p-5 flex items-center gap-4">
          <p className="text-4xl font-bold text-[#1C1917] shrink-0">{STATS_DISPLAY[L].googleRatingValue}</p>
          <div className="min-w-0 flex flex-col gap-1">
            <RatingStars lang={L} className="w-4 h-4 text-[#D4A574]" emptyClassName="text-[#E7E5E4]" />
            <span className="text-sm text-[#44403C]">{STATS_DISPLAY[L].googleRatingLabel}</span>
            <a
              href={GOOGLE_REVIEWS.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("cta_click", { cta_position: "google_rating", cta_target: "google_reviews", language: L })}
              className="self-start text-sm font-semibold text-[#1C1917] underline underline-offset-4 hover:text-[#8A6508] transition-colors"
            >
              {GOOGLE_REVIEWS_LINK_LABEL[L]}
            </a>
          </div>
        </div>
        <p className="mt-3 text-sm text-[#57534E] text-center">
          {L === "en"
            ? `${STATS_DISPLAY.en.residents} · ${STATS.averageStayMonths}-month average stay`
            : `${STATS_DISPLAY.fr.residents} · ${STATS.averageStayMonths} mois de séjour en moyenne`}
        </p>
      </div>
    </section>
  );
}

/** Autres options : L'Appart (bloc statique de l'accueil, texte propre à la page, sans image), la ligne du groupe Facebook
 *  (A.9, texte inchangé) et les liens d'ancrage Annemasse / Genève (descendus de la section maisons, mêmes mots — R5). */
export function HomeOtherOptions() {
  const { language } = useLanguage();
  const en = language === "en";
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        {/* Pas de sur-titre ici : le bloc L'Appart porte déjà le sien (« Aussi chez La Villa Coliving »). */}
        <div data-home-section="appart_teaser">
          <AppartTeaser page="/" />
        </div>
        <div className="max-w-2xl mx-auto mt-8 text-center">
          <FacebookGroupLine position="home_other_options" />
        </div>
        {/* R5 (checkpoint 21/08) — front Annemasse : /annemasse-colocation et /chambre-a-louer-annemasse n'avaient aucun lien
            entrant depuis les pages fortes. Ligne descendue de la section maisons (lot 2 de la refonte, 24/11/2026). */}
        <p className="mt-6 text-sm text-[#57534E] text-center">
          {en ? "Focused on Annemasse Agglo? " : "Tu vises Annemasse Agglo ? "}
          <LocalizedLink to="/annemasse-colocation" className="underline underline-offset-4 hover:text-[#1C1917]">
            {en ? "Annemasse, with Le Lodge" : "Annemasse, avec Le Lodge"}
          </LocalizedLink>
          {" · "}
          <LocalizedLink to="/chambre-a-louer-annemasse" className="underline underline-offset-4 hover:text-[#1C1917]">
            {en ? "Le Lodge, our house in Annemasse" : "Le Lodge, notre maison d'Annemasse"}
          </LocalizedLink>
          {" · "}
          {/* (Lot 5 SEO funnel) Page money « colocation Genève », chambres et dates en temps réel. */}
          <LocalizedLink to={colocGeneveHref(language)} className="underline underline-offset-4 hover:text-[#1C1917]">
            {en ? "Shared housing in Geneva, French side" : "Colocation à Genève côté France"}
          </LocalizedLink>
        </p>
      </div>
    </section>
  );
}
