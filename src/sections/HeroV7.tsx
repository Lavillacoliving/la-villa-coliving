import { LocalizedLink } from "@/components/LocalizedLink";
import { responsiveImage } from "@/lib/responsiveImage";
import { Scrim } from "@/components/Scrim";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { RatingStars } from "@/components/RatingStars";
import { STATS, STATS_DISPLAY, PRICE_FROM_CHF_FR, PRICE_FROM_CHF_EN, GOOGLE_REVIEWS, GOOGLE_REVIEWS_LINK_LABEL } from "@/data/stats";
import { ENTITY_HOUSES } from "@/data/entityFacts";
import { useRoomAvailability, globalAvailabilityLabel } from "@/lib/availability";

/** « Ville-la-Grand, Ambilly et Annemasse » — communes dans l'ordre de la source unique. */
const HERO_COMMUNES = {
  fr: ENTITY_HOUSES.map((h) => h.commune).reduce((acc, c, i, a) => (i === 0 ? c : i === a.length - 1 ? `${acc} et ${c}` : `${acc}, ${c}`), ""),
  en: ENTITY_HOUSES.map((h) => h.commune).reduce((acc, c, i, a) => (i === 0 ? c : i === a.length - 1 ? `${acc} and ${c}` : `${acc}, ${c}`), ""),
};

/**
 * VERSION 9: STONE & BRASS — Condo premium contemporain
 * Hero full-bleed photo.
 *
 * (Lot 2 de la refonte des pages de vente, maquette validée par Jérôme le 24/11/2026, rapport § 4.1) La promesse tient en un
 * écran et finit sur deux boutons : « Découvrir nos 3 maisons » et « Programmer une visite » (le premier appel à l'action
 * arrivait à l'écran 14). Les quatre chiffres passent juste dessous (HomeStats) ; la citation n'est pas reprise ; le bandeau
 * noir « Piscine, sauna & salle de sport — dans chaque maison » est fondu dans « Une communauté, pas un immeuble »
 * (HomeArgumentsV8). Le lien « Colocation Genève » descend dans « Autres options » (même page cible).
 */
export function HeroV7() {
  const { language } = useLanguage();
  const L = language === "en" ? "en" : "fr";
  const availability = useRoomAvailability();
  // Même garde que les autres boutons : la mesure (GA4 `cta_click`) ne bloque jamais l'interface.
  const track = (position: string, target: string) => {
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "cta_click", {
        cta_position: position, cta_target: target, language,
      });
    } catch { /* noop */ }
  };

  return (
    <section className="relative min-h-screen flex items-end pt-24 pb-16 md:pb-20 overflow-hidden">
      {/* Background image — full bleed */}
      <div className="absolute inset-0">
        <img
          src="/images/la villa jardin.webp"
          alt={language === "en" ? `La Villa Coliving — premium house with pool, ${STATS_DISPLAY.en.distance}` : `La Villa Coliving — maison premium avec piscine, à ${STATS_DISPLAY.fr.distance}`}
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
          fetchPriority="high"
          {...responsiveImage("/images/la villa jardin.webp", "100vw")}
        />
        {/* Voile dégradé réutilisable — lisibilité du texte sur photo (WCAG AA) */}
        <Scrim />
      </div>

      {/* Content — aligned bottom-left */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        {/* Badge */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/12 backdrop-blur-sm border border-white/15 rounded-full text-white text-[13px] font-medium tracking-[0.06em] uppercase">
            <span className="w-1.5 h-1.5 bg-[#E0BB8A] rounded-full" />
            {language === "en"
              ? "Boutique Coliving — Greater Geneva"
              : "Coliving boutique — Grand Genève"}
          </span>
        </div>

        {/* H1 — DM Serif Display */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-5 max-w-2xl"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif", lineHeight: 1.08 }}
        >
          {language === "en" ? (
            <>
              3 houses, 7 to 12 residents.
              <br />
              <em className="text-[#E0BB8A] not-italic" style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>
                All-inclusive coliving near Geneva
              </em>
              .
            </>
          ) : (
            <>
              3 maisons, 7 à 12 résidents.
              <br />
              <em className="text-[#E0BB8A] not-italic" style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>
                Coliving tout inclus près de Genève
              </em>
              .
            </>
          )}
        </h1>

        {/* Description — texte arrêté par Jérôme le 09/10/2026 (Lot L1, D1 complet) : la marque, les 3 communes,
            « côté France », le trajet qualifié (STATS_DISPLAY.distance, jamais « du centre »), « sans frais de
            dossier » ; pas de temps de train ici (il vit dans la fiche entité). Une seule chaîne = un seul nœud texte. */}
        <p className="text-base md:text-lg text-white max-w-xl mb-6 leading-relaxed font-light [text-shadow:0_2px_10px_rgba(0,0,0,0.55)]">
          {language === "en"
            ? `Your private room at La Villa Coliving: ${STATS.totalHouses} houses with pool, sauna and gym in ${HERO_COMMUNES.en}, on the French side, ${STATS_DISPLAY.en.distance}. From ${PRICE_FROM_CHF_EN}/month, all inclusive, no application fee.`
            : `Ta chambre privée chez La Villa Coliving : ${STATS.totalHouses} maisons avec piscine, sauna et salle de sport à ${HERO_COMMUNES.fr}, côté France, à ${STATS_DISPLAY.fr.distance}. Dès ${PRICE_FROM_CHF_FR}/mois tout inclus, sans frais de dossier.`}
        </p>

        {/* CTAs — « Découvrir nos 3 maisons » reste la porte principale (31 % des arrivants de l'accueil vont sur /nos-maisons,
            GA4 27/10 → 23/11) ; le second bouton propose la visite (décision du 24/11/2026, rapport § 4.7). */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6">
          <LocalizedLink
            to="/nos-maisons"
            onClick={() => track("hero_houses", "/nos-maisons")}
            className="inline-flex items-center gap-2 bg-[#D4A574] text-[#1C1917] px-8 py-4 rounded-lg font-bold text-base hover:bg-[#E0BB8A] hover:shadow-lg hover:translate-y-[-1px] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1917] w-full sm:w-auto justify-center sm:justify-start"
          >
            {language === "en" ? "Explore our 3 houses" : "Découvrir nos 3 maisons"}
            <ArrowRight className="w-5 h-5" />
          </LocalizedLink>
          <LocalizedLink
            to="/candidature"
            onClick={() => track("hero_visit", "/candidature")}
            className="inline-flex items-center gap-2 border border-white/30 text-white px-7 py-3.5 rounded-lg font-semibold text-[15px] hover:border-white hover:bg-white/5 transition-all duration-300 w-full sm:w-auto justify-center sm:justify-start"
          >
            {language === "en" ? "Book a visit" : "Programmer une visite"}
            <ArrowRight className="w-4 h-4" />
          </LocalizedLink>
        </div>

        {/* Réassurance frais — visible sans scroll. (Retenue premium, lot 1, T3 — 13/10/2026) « tout inclus » et « sans frais de
            dossier » sont déjà dans la phrase d'introduction : ne restent que les deux promesses qu'elle ne dit pas. */}
        <p className="text-sm text-white/90 max-w-xl mb-4 font-light [text-shadow:0_2px_10px_rgba(0,0,0,0.55)]">
          {language === "en"
            ? "No agency fee, no hidden costs."
            : "Pas d'honoraires d'agence, pas de frais cachés."}
        </p>

        {/* Social proof — (Lot L3, D4 Jérôme 09/10/2026) note de la fiche Google (STATS_DISPLAY.googleRating, toujours
            « sur Google ») + lien « Voir les avis » vers la fiche. Une phrase = un nœud texte ; le lien est un élément à part
            (anti-#418). (Lot 2 de la refonte) « 100+ résidents » passe dans les quatre chiffres, juste dessous. */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-5">
          {/* (A9, 11/10/2026) Étoiles proportionnelles à la note (4,8 → 4 pleines + 80 %), déterministes. */}
          <RatingStars lang={L} />
          <span className="text-white/90 text-sm font-medium">{STATS_DISPLAY[L].googleRating}</span>
          <a
            href={GOOGLE_REVIEWS.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 text-sm underline underline-offset-4 hover:text-white transition-colors"
          >
            {GOOGLE_REVIEWS_LINK_LABEL[L]}
          </a>
        </div>

        {/* Availability signal — dispo réelle (v_public_rooms), dates comprises. (Lot 3 SEO funnel — Q14a, 03/09/2026) La
            pastille est la porte la plus visible vers /chambres-disponibles. Même libellé, même style : aucun écart d'hydratation. */}
        <LocalizedLink
          to="/chambres-disponibles"
          onClick={() => track("hero_availability", "/chambres-disponibles")}
          className="text-sm text-[#E0BB8A] inline-flex items-center gap-2 hover:text-white transition-colors underline-offset-4 hover:underline"
        >
          <span className="w-2 h-2 bg-[#E0BB8A] rounded-full animate-pulse" />
          {globalAvailabilityLabel(availability, L)}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </LocalizedLink>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 scroll-indicator">
        <ChevronDown className="w-5 h-5 text-white/40" />
      </div>
    </section>
  );
}
