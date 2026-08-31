import { LocalizedLink } from "@/components/LocalizedLink";
import { responsiveImage } from "@/lib/responsiveImage";
import { colocGeneveHref } from "@/lib/siteLinks";
import { Scrim } from "@/components/Scrim";
import { ArrowRight, ChevronDown, Home, Users, Heart, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { STATS, STATS_DISPLAY, PRICE_SHARED_CHF_FR, PRICE_SHARED_CHF_EN } from "@/data/stats";
import { useRoomAvailability, globalAvailabilityLabel } from "@/lib/availability";

/**
 * VERSION 9: STONE & BRASS — Condo premium contemporain
 * Hero full-bleed photo + Bandeau USP 2 parties
 */

export function HeroV7() {
  const { language } = useLanguage();
  const L = language === "en" ? "en" : "fr";
  const availability = useRoomAvailability();

  return (
    <>
      {/* ─── HERO — Full-bleed photo ─── */}
      <section className="relative min-h-screen flex items-end pt-24 pb-16 md:pb-20 overflow-hidden">
        {/* Background image — full bleed */}
        <div className="absolute inset-0">
          <img
            src="/images/la villa jardin.webp"
            alt={language === "en" ? "La Villa Coliving — premium house with pool, 20 min from Geneva city center" : "La Villa Coliving — maison premium avec piscine à 20 min du centre de Genève"}
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

          {/* Description */}
          <p className="text-base md:text-lg text-white max-w-xl mb-6 leading-relaxed font-light [text-shadow:0_2px_10px_rgba(0,0,0,0.55)]">
            {language === "en"
              ? `Your private room in a house with pool, 20 min from Geneva city center. From ${PRICE_SHARED_CHF_EN}/month, all inclusive.`
              : `Ta chambre privée dans une maison avec piscine, à 20 min du centre de Genève. Dès ${PRICE_SHARED_CHF_FR}/mois tout inclus.`}
          </p>

          {/* CTAs — remontés au-dessus de la réassurance/preuve sociale : GA4 montre que
              la home perd ~50 % des visiteurs avant la 2e page, et que le couloir
              Nos 3 Maisons → maison → candidature génère 46 % des candidatures. */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6">
            <LocalizedLink
              to="/nos-maisons"
              className="inline-flex items-center gap-2 bg-[#D4A574] text-[#1C1917] px-8 py-4 rounded-lg font-bold text-base hover:bg-[#E0BB8A] hover:shadow-lg hover:translate-y-[-1px] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1917] w-full sm:w-auto justify-center sm:justify-start"
            >
              {language === "en" ? "Explore our 3 houses" : "Découvrir nos 3 maisons"}
              <ArrowRight className="w-5 h-5" />
            </LocalizedLink>
            <LocalizedLink
              to={colocGeneveHref(language)}
              className="inline-flex items-center gap-2 border border-white/30 text-white px-7 py-3.5 rounded-lg font-semibold text-[15px] hover:border-white hover:bg-white/5 transition-all duration-300 w-full sm:w-auto justify-center sm:justify-start"
            >
              {language === "en" ? "Shared housing Geneva" : "Colocation Genève"}
              <ArrowRight className="w-4 h-4" />
            </LocalizedLink>
          </div>

          {/* Réassurance frais — visible sans scroll */}
          <p className="text-sm text-white/90 max-w-xl mb-4 font-light [text-shadow:0_2px_10px_rgba(0,0,0,0.55)]">
            {language === "en"
              ? "Everything included — no application fee, no agency fee, no hidden costs."
              : "Tout est compris — pas de frais de dossier, pas d'honoraires d'agence, pas de frais cachés."}
          </p>

          {/* Social proof */}
          <div className="flex items-center gap-3 mb-12 md:mb-14">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => (
                <svg key={i} className="w-4 h-4 text-[#E0BB8A]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span
              className="text-white/90 text-sm font-medium"
              title={language === "en" ? "Average rating — resident surveys 2021-2026" : "Note moyenne — enquêtes résidents 2021-2026"}
            >
              {`${STATS_DISPLAY[L].rating}/5 ${language === "en" ? "(resident surveys)" : "(enquêtes résidents)"} — ${STATS_DISPLAY[L].residents}`}
            </span>
          </div>

          {/* Availability signal — dispo réelle (v_public_rooms), dates comprises.
              Avant : constante manuelle + mois suivant calculé, qui annonçait
              « 3 chambres disponibles pour septembre » pour 1 seule libre. */}
          <p className="text-sm text-[#E0BB8A] mt-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#E0BB8A] rounded-full animate-pulse" />
            {globalAvailabilityLabel(availability, L)}
          </p>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:flex md:gap-12 gap-y-4 gap-x-8 pt-6 border-t border-white/20">
            {[
              {
                value: `${STATS.totalResidents}+`,
                label: language === "en" ? `Residents since ${STATS.foundedYear}` : `Résidents depuis ${STATS.foundedYear}`,
              },
              {
                value: `${STATS.roomSizeMin}-${STATS.roomSizeMax} m²`,
                label: language === "en" ? "Private rooms" : "Chambres privées",
              },
              {
                value: language === "en" ? `from ${PRICE_SHARED_CHF_EN}` : `dès ${PRICE_SHARED_CHF_FR}`,
                label: language === "en" ? "All inclusive / month" : "Tout inclus / mois",
              },
              {
                value: `${STATS.occupancyRate}%`,
                label: language === "en" ? `Occupancy over ${STATS.occupancyYears} yrs` : `Taux d'occupation sur ${STATS.occupancyYears} ans`,
              },
            ].map((stat, index) => (
              <div key={index}>
                <span className="text-xl md:text-2xl font-bold text-white">{stat.value}</span>
                <span className="block text-xs text-white/70 uppercase tracking-wider mt-1">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Quick testimonial */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-white/80 text-sm italic max-w-lg">
              {language === "en"
                ? "\"Best decision I made when I moved to Geneva. The community, the pool, the location — everything is perfect.\""
                : "\"La meilleure décision quand je me suis installé près de Genève. La communauté, la piscine, l'emplacement — tout est parfait.\""}
            </p>
            <p className="text-white/60 text-xs mt-2">
              {language === "en" ? "— Thomas K., Developer at UN Geneva" : "— Thomas K., Développeur à l'ONU Genève"}
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 scroll-indicator">
          <ChevronDown className="w-5 h-5 text-white/40" />
        </div>
      </section>

      {/* ─── BANDEAU USP — Partie 1 : USPs exceptionnelles ─── */}
      <section className="bg-[#1C1917] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <span className="text-[#E0BB8A] text-[13px] font-semibold tracking-[0.1em] uppercase">
              {language === "en" ? "What makes us unique" : "Ce qui nous rend uniques"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-4 mb-5" style={{ letterSpacing: '-0.025em' }}>
              {language === "en" ? (
                <>
                  Pool, sauna & gym —{" "}
                  <em style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', color: '#E0BB8A', fontWeight: 400 }}>
                    in every single house.
                  </em>
                </>
              ) : (
                <>
                  Piscine, sauna & salle de sport —{" "}
                  <em style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', color: '#E0BB8A', fontWeight: 400 }}>
                    dans chaque maison.
                  </em>
                </>
              )}
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-base">
              {language === "en"
                ? `This level of amenities is unheard of in coliving. Most don't even have a pool. We have one in all three houses — plus private yoga, fitness classes, pizza nights, and ${STATS.includedItems - 3} more services included.`
                : `Ce niveau de prestations est inédit en coliving. La plupart n'ont même pas de piscine. Nous en avons une dans chacune de nos 3 maisons — plus cours de yoga, cours de fitness, pizza party et ${STATS.includedItems - 3} autres services inclus.`}
            </p>
          </div>

          {/* 5 USP photo cards — cliquables depuis le 29/08 (demande Jérôme :
              l'audience cliquait sans effet, cursor-pointer sans lien). Cible =
              la page qui convertit l'intention du pavé : /nos-maisons (arbitrage
              Jérôme 29/08 : le comparateur des 3 maisons reçoit les intentions
              équipements), /services pour les cours privés. Tracké cta_click hero_amenity. */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              {
                image: "/images/la villa coliving le loft piscine.webp",
                title: language === "en" ? "Pool" : "Piscine",
                desc: language === "en" ? "Indoor at Le Loft, outdoor at La Villa and Le Lodge" : "Intérieure au Loft, extérieure à La Villa et au Lodge",
                highlight: language === "en" ? "In all 3 houses" : "Dans les 3 maisons",
                to: "/nos-maisons",
                amenity: "pool",
              },
              {
                image: "/images/la villa coliving le lodge-sauna2.webp",
                title: "Sauna",
                desc: language === "en" ? "Finnish sauna at Le Loft and Le Lodge, and infrared at La Villa." : "Sauna finlandais au Loft et au Lodge et infrarouge à La Villa.",
                highlight: language === "en" ? "In all 3 houses" : "Dans les 3 maisons",
                to: "/nos-maisons",
                amenity: "sauna",
              },
              {
                image: "/images/la villa coliving le lodge-gym.webp",
                title: language === "en" ? "Gym" : "Salle de sport",
                desc: language === "en" ? "Fully equipped in each house" : "Entièrement équipée dans chaque maison",
                highlight: language === "en" ? "In all 3 houses" : "Dans les 3 maisons",
                to: "/nos-maisons",
                amenity: "gym",
              },
              {
                image: "/images/la villa yoga.webp",
                title: language === "en" ? "Private classes" : "Cours privés",
                desc: language === "en" ? "Weekly yoga & fitness included" : "Yoga & fitness hebdo inclus",
                highlight: language === "en" ? "Included in rent" : "Inclus dans le loyer",
                to: "/services",
                amenity: "classes",
              },
              {
                image: "/images/le loft glamour.webp",
                title: language === "en" ? `${STATS.roomSizeMin}-${STATS.roomSizeMax} m² rooms` : `Chambres ${STATS.roomSizeMin}-${STATS.roomSizeMax} m²`,
                desc: language === "en" ? "50% larger than coliving average" : "50% plus grandes que la moyenne",
                highlight: language === "en" ? "Private bathroom (most)" : "SDB privative (la plupart)",
                to: "/nos-maisons",
                amenity: "rooms",
              },
            ].map((item, index) => (
              <LocalizedLink
                key={index}
                to={item.to}
                onClick={() => {
                  try {
                    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "cta_click", {
                      cta_position: "hero_amenity", cta_target: item.to, amenity: item.amenity, language,
                    });
                  } catch { /* noop */ }
                }}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer block"
              >
                <img
                  src={item.image}
                  alt={`${item.title}${language === "en" ? " — premium coliving near Geneva" : " — coliving premium près de Genève"}`}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  loading="lazy"
                  width={400}
                  height={533}
                  {...responsiveImage(item.image, "(min-width: 768px) 20vw, 50vw")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                  <h3 className="text-white font-semibold text-sm md:text-base">{item.title}</h3>
                  <p className="text-white/70 text-xs md:text-sm mt-1">{item.desc}</p>
                  <span className="inline-block mt-2 md:mt-3 text-[#E0BB8A] text-[11px] font-semibold tracking-wider uppercase">
                    {item.highlight}
                  </span>
                </div>
              </LocalizedLink>
            ))}
          </div>

          {/* Pricing reminder — text-base (au lieu de sm) : demande Jérôme 29/08 */}
          <p className="text-center text-white/50 text-base mt-10 max-w-lg mx-auto">
            {language === "en"
              ? `All of this is included in your rent. No paid add-ons. No application fee, no agency fee. No hidden fees. Ever.`
              : `Tout ceci est inclus dans ton loyer. Pas d'options payantes. Pas de frais de dossier, pas d'honoraires d'agence. Pas de frais cachés. Jamais.`}
          </p>
        </div>

        {/* Partie 2 — Strip positionnement */}
        <div className="border-t border-white/[0.08] mt-16">
          <div className="max-w-7xl mx-auto px-6 py-6 md:py-8">
            {/* Mobile : colonne alignée à gauche (les lignes centrées une à une
                faisaient « voler » les icônes — Jérôme 29/08) ; desktop inchangé. */}
            <div className="flex flex-col items-start gap-4 w-fit mx-auto md:w-auto md:flex-row md:flex-wrap md:justify-center md:gap-12">
              {[
                { icon: Home, text: language === "en" ? "Real houses, not residences" : "De vraies maisons, pas des résidences", bold: language === "en" ? "Real houses" : "vraies maisons" },
                { icon: Users, text: language === "en" ? `${STATS.minResidentsPerHouse} to ${STATS.maxResidentsPerHouse} residents per house` : `${STATS.minResidentsPerHouse} à ${STATS.maxResidentsPerHouse} résidents par maison`, bold: language === "en" ? `${STATS.minResidentsPerHouse} to ${STATS.maxResidentsPerHouse}` : `${STATS.minResidentsPerHouse} à ${STATS.maxResidentsPerHouse}` },
                { icon: Heart, text: language === "en" ? "Real colivings, not shared flats" : "De vrais colivings, pas des colocs", bold: language === "en" ? "Real colivings" : "vrais colivings" },
                { icon: MapPin, text: language === "en" ? `${STATS.genevaCenterMinutes} min from Geneva city center` : `${STATS.genevaCenterMinutes} min du centre de Genève`, bold: `${STATS.genevaCenterMinutes} min` },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/[0.08] rounded-lg flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-[#E0BB8A]" />
                  </div>
                  <span className="text-white/60 text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
