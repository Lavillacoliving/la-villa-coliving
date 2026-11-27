import { LocalizedLink } from "@/components/LocalizedLink";
import { responsiveImage } from "@/lib/responsiveImage";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { RatingStars } from "@/components/RatingStars";
import { STATS, STATS_DISPLAY, PRICE_FROM_CHF_FR, PRICE_FROM_CHF_EN, GOOGLE_REVIEWS, GOOGLE_REVIEWS_LINK_LABEL } from "@/data/stats";
import { ENTITY_HOUSES } from "@/data/entityFacts";
import { HOME_PHOTOS } from "@/data/homePhotos";
import { useRoomAvailability, globalAvailabilityLabel } from "@/lib/availability";

/** « Ville-la-Grand, Ambilly et Annemasse » — communes dans l'ordre de la source unique. */
const HERO_COMMUNES = {
  fr: ENTITY_HOUSES.map((h) => h.commune).reduce((acc, c, i, a) => (i === 0 ? c : i === a.length - 1 ? `${acc} et ${c}` : `${acc}, ${c}`), ""),
  en: ENTITY_HOUSES.map((h) => h.commune).reduce((acc, c, i, a) => (i === 0 ? c : i === a.length - 1 ? `${acc} and ${c}` : `${acc}, ${c}`), ""),
};

/**
 * `sizes` de la photo du haut de page. Le préchargement (scripts/inject-prerendered.mjs) recopie ces mêmes `srcset`/`sizes`
 * depuis le HTML prérendu : le navigateur ne télécharge qu'UNE fois la photo (point 6b de Jérôme, 27/11/2026).
 */
const HERO_SIZES = "(min-width: 1280px) 626px, (min-width: 1024px) 50vw, calc(100vw - 40px)";

/**
 * Haut de page de l'accueil.
 *
 * (Lot 2 de la refonte des pages de vente, maquette validée par Jérôme le 24/11/2026, rapport § 4.1) La promesse tient en un
 * écran et finit sur deux boutons : « Découvrir nos 3 maisons » et « Programmer une visite ».
 *
 * (Lot 2a, brief « Accueil : récit, avis, photos » du 27/11/2026, version B « fraîcheur compacte », §0.9) Deux colonnes sur
 * fond clair : texte à gauche, photo n° 1 à droite, sans voile ni texte posé dessus. Sur mobile, la photo s'intercale entre le
 * H1 et l'introduction (grille à zones, une seule <img> : pas de double téléchargement). Textes, liens et événements
 * inchangés ; plus aucune animation dans le haut de page (§0.9 : flèche de défilement retirée, point de disponibilité fixe —
 * décision de Jérôme du 27/11). La classe `pt-24` reste : src/index.css compense le bandeau d'offre sur cette section.
 */
export function HeroV7() {
  const { language } = useLanguage();
  const L = language === "en" ? "en" : "fr";
  const availability = useRoomAvailability();
  const photo = HOME_PHOTOS.hero;
  // Même garde que les autres boutons : la mesure (GA4 `cta_click`) ne bloque jamais l'interface.
  const track = (position: string, target: string) => {
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "cta_click", {
        cta_position: position, cta_target: target, language,
      });
    } catch { /* noop */ }
  };

  return (
    <section className="pt-24 pb-10 md:pb-14 bg-lvc-page">
      <div className="lvc-hero-grid mx-auto max-w-[1280px] px-5 md:px-8">
        {/* Pastille */}
        <div className="lvc-hero-pill">
          <span className="lvc-pill px-3.5 py-1.5 text-[12px] tracking-[0.08em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-lvc-accent" aria-hidden="true" />
            {language === "en"
              ? "Boutique Coliving — Greater Geneva"
              : "Coliving boutique — Grand Genève"}
          </span>
        </div>

        {/* H1 — texte inchangé (arrêté le 09/10/2026) ; la seconde phrase en italique, couleur d'accent, sur sa ligne (D13). */}
        <h1 className="lvc-hero-title lvc-display text-[38px] leading-[1.05] md:text-[48px] lg:text-[58px] text-lvc-ink">
          {language === "en" ? (
            <>
              3 houses, 7 to 12 residents.
              <br />
              <em className="lvc-h1-accent">All-inclusive coliving near Geneva</em>
              <span className="lvc-h1-accent">.</span>
            </>
          ) : (
            <>
              3 maisons, 7 à 12 résidents.
              <br />
              <em className="lvc-h1-accent">Coliving tout inclus près de Genève</em>
              <span className="lvc-h1-accent">.</span>
            </>
          )}
        </h1>

        {/* Photo n° 1 — sans voile ni texte dessus ; préchargée sur / et /en (data-preload, inject-prerendered.mjs). */}
        <div className="lvc-hero-photo">
          <img
            src={photo.src}
            {...responsiveImage(photo.src, HERO_SIZES)}
            alt={photo.alt[L]}
            width={photo.width}
            height={photo.height}
            fetchPriority="high"
            data-preload="hero"
            className="w-full h-[210px] md:h-[380px] lg:h-[500px] object-cover rounded-[20px] lg:rounded-[28px]"
            style={{ objectPosition: "50% 50%" }}
          />
        </div>

        <div className="lvc-hero-body">
          {/* Description — texte arrêté par Jérôme le 09/10/2026 (Lot L1, D1 complet) : la marque, les 3 communes,
              « côté France », le trajet qualifié (STATS_DISPLAY.distance, jamais « du centre »), « sans frais de
              dossier » ; pas de temps de train ici (il vit dans la fiche entité). Une seule chaîne = un seul nœud texte. */}
          <p className="text-base md:text-lg text-lvc-text max-w-[560px] leading-relaxed">
            {language === "en"
              ? `Your private room at La Villa Coliving: ${STATS.totalHouses} houses with pool, sauna and gym in ${HERO_COMMUNES.en}, on the French side, ${STATS_DISPLAY.en.distance}. From ${PRICE_FROM_CHF_EN}/month, all inclusive, no application fee.`
              : `Ta chambre privée chez La Villa Coliving : ${STATS.totalHouses} maisons avec piscine, sauna et salle de sport à ${HERO_COMMUNES.fr}, côté France, à ${STATS_DISPLAY.fr.distance}. Dès ${PRICE_FROM_CHF_FR}/mois tout inclus, sans frais de dossier.`}
          </p>

          {/* CTAs — « Découvrir nos 3 maisons » reste la porte principale (31 % des arrivants de l'accueil vont sur /nos-maisons,
              GA4 27/10 → 23/11) ; le second bouton propose la visite (décision du 24/11/2026, rapport § 4.7). */}
          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <LocalizedLink
              to="/nos-maisons"
              onClick={() => track("hero_houses", "/nos-maisons")}
              className="lvc-btn-primary h-[52px] px-6 text-base"
            >
              {language === "en" ? "Explore our 3 houses" : "Découvrir nos 3 maisons"}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </LocalizedLink>
            <LocalizedLink
              to="/candidature"
              onClick={() => track("hero_visit", "/candidature")}
              className="lvc-btn-secondary h-[52px] px-6 text-base"
            >
              {language === "en" ? "Book a visit" : "Programmer une visite"}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </LocalizedLink>
          </div>

          {/* Réassurance frais — (Retenue premium, lot 1, T3 — 13/10/2026) « tout inclus » et « sans frais de dossier » sont déjà
              dans la phrase d'introduction : ne restent que les deux promesses qu'elle ne dit pas. */}
          <p className="mt-5 text-sm text-lvc-muted">
            {language === "en"
              ? "No agency fee, no hidden costs."
              : "Pas d'honoraires d'agence, pas de frais cachés."}
          </p>

          {/* Social proof — (Lot L3, D4 Jérôme 09/10/2026) note de la fiche Google (STATS_DISPLAY.googleRating, toujours
              « sur Google ») + lien « Voir les avis » vers la fiche. Une phrase = un nœud texte ; le lien est un élément à part
              (anti-#418). */}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
            {/* (A9, 11/10/2026) Étoiles proportionnelles à la note (4,8 → 4 pleines + 80 %), déterministes. */}
            <RatingStars lang={L} className="w-4 h-4 text-[#D4A574]" emptyClassName="text-[#E7E5E4]" />
            <span className="text-sm text-lvc-ink">{STATS_DISPLAY[L].googleRating}</span>
            <a
              href={GOOGLE_REVIEWS.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-lvc-ink underline underline-offset-4 hover:text-lvc-accent transition-colors"
            >
              {GOOGLE_REVIEWS_LINK_LABEL[L]}
            </a>
          </div>

          {/* Availability signal — dispo réelle (v_public_rooms), dates comprises. (Lot 3 SEO funnel — Q14a, 03/09/2026) La
              pastille est la porte la plus visible vers /chambres-disponibles. Même libellé : aucun écart d'hydratation. */}
          <LocalizedLink
            to="/chambres-disponibles"
            onClick={() => track("hero_availability", "/chambres-disponibles")}
            className="lvc-pill mt-5 px-4 py-2.5 text-sm hover:bg-[#D5E5D8] transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-lvc-accent" aria-hidden="true" />
            {globalAvailabilityLabel(availability, L)}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </LocalizedLink>
        </div>
      </div>
    </section>
  );
}
