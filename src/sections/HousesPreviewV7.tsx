import { LocalizedLink } from "@/components/LocalizedLink";
import { colocGeneveHref } from "@/lib/siteLinks";
import { HouseAvailabilityLine } from "@/components/HouseAvailabilityLine";
import { responsiveImage } from "@/lib/responsiveImage";
import { ArrowRight, MapPin, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  useRoomAvailability,
  houseBadgeLabel,
  houseBadgeTone,
  BADGE_CHIP_CLASS,
  type HouseKey,
} from "@/lib/availability";

/**
 * VERSION 9: STONE & BRASS
 * Houses preview — photo cards, tags overlay, CTA link
 */

export function HousesPreviewV7() {
  const { language } = useLanguage();
  const L = language === "en" ? "en" : "fr";
  const availability = useRoomAvailability();
  const badge = (house: HouseKey) =>
    houseBadgeLabel(availability.byHouse[house], availability.known, L);
  const tone = (house: HouseKey) =>
    houseBadgeTone(availability.byHouse[house], availability.known);

  const houses = [
    {
      id: "lavilla",
      name: "La Villa",
      location: "Ville-la-Grand",
      residents: "10",
      image: "/images/villa_portrait.webp",
      description: language === "en"
        ? "20 min from Geneva city center by CEVA. Heated pool, 2,000 m² garden, nature reserve."
        : "20 min du centre de Genève en CEVA. Piscine chauffée, 2 000 m² de jardin, réserve naturelle.",
      alt: language === "en"
        ? "La Villa — premium coliving house with garden and pool in Ville-la-Grand, near Geneva"
        : "La Villa — maison de colocation premium avec jardin et piscine à Ville-la-Grand, près de Genève",
      availability: badge("lavilla"),
      tone: tone("lavilla"),
    },
    {
      id: "leloft",
      name: "Le Loft",
      location: "Ambilly",
      residents: "7",
      image: "/images/la villa coliving le loft piscine.webp",
      description: language === "en"
        ? "20 min from Geneva city center by tram or CEVA. Year-round heated indoor pool, Finnish sauna."
        : "20 min du centre de Genève en tram ou CEVA. Piscine intérieure chauffée toute l'année, sauna finlandais.",
      alt: language === "en"
        ? "Le Loft — urban coliving house with indoor pool in Ambilly, near Geneva"
        : "Le Loft — colocation urbaine avec piscine intérieure à Ambilly, près de Genève",
      availability: badge("leloft"),
      tone: tone("leloft"),
    },
    {
      id: "lelodge",
      name: "Le Lodge",
      location: "Annemasse",
      residents: "12",
      image: "/images/le lodge piscine.webp",
      description: language === "en"
        ? "20 min from Geneva city center by CEVA. The largest: pool house, full fitness chalet with sauna & arcade."
        : "20 min du centre de Genève en CEVA. Le plus grand : pool house, chalet fitness complet avec sauna et jeu d'arcade.",
      alt: language === "en"
        ? "Le Lodge — coliving house with pool and gym in Annemasse, near Geneva"
        : "Le Lodge — maison de colocation avec piscine et salle de sport à Annemasse, près de Genève",
      availability: badge("lelodge"),
      tone: tone("lelodge"),
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-[#F5F2ED]">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 md:mb-16">
          <div>
            <span className="text-[#78716C] text-[13px] font-semibold tracking-[0.1em] uppercase">
              {language === "en" ? "OUR HOUSES" : "NOS MAISONS"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1C1917] mt-4" style={{ letterSpacing: '-0.025em' }}>
              {language === "en" ? "3 houses, 3 personalities" : "3 maisons, 3 personnalités"}
            </h2>
          </div>
          <LocalizedLink
            to="/nos-maisons"
            className="group mt-6 md:mt-0 inline-flex items-center gap-2 text-[#44403C] font-semibold text-sm hover:gap-3 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#44403C] focus-visible:ring-offset-2 rounded-lg"
          >
            {language === "en" ? "See all houses" : "Voir toutes les maisons"}
            <ArrowRight className="w-4 h-4" />
          </LocalizedLink>
        </div>

        {/* Houses grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {houses.map((house, index) => (
            <div key={index} className="flex flex-col gap-3">
            <LocalizedLink to={`/${house.id}`} className="group block bg-white rounded-2xl border border-[#E7E5E4] overflow-hidden hover:border-[#44403C]/20 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:translate-y-[-2px] transition-all duration-300">
              {/* Photo */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={house.image}
                  alt={house.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"
                  {...responsiveImage(house.image, "(min-width: 768px) 33vw, 100vw")}
                />
                {/* Tag résidents */}
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#1C1917] text-xs font-semibold px-3 py-1.5 rounded-lg">
                  {house.residents} {language === "en" ? "residents" : "résidents"}
                </span>
                {/* Tag transport */}
                <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-lg">
                  {language === "en" ? "20 min Geneva center" : "20 min centre Genève"}
                </span>
                {/* Availability badge — couleur dérivée de la dispo réelle, pas du libellé.
                    Libellé null (dispo inconnue) = pas de badge, jamais de chiffre inventé. */}
                {house.availability && house.tone && (
                  <span className={`absolute bottom-4 left-4 backdrop-blur-sm text-xs font-semibold px-3 py-1.5 rounded-lg ${BADGE_CHIP_CLASS[house.tone]}`}>
                    {house.availability}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-5 md:p-6">
                <h3 className="text-lg font-bold text-[#1C1917] mb-2 group-hover:text-[#44403C] transition-colors duration-300">
                  {house.name}
                </h3>
                <p className="text-[#78716C] text-sm mb-4">
                  {house.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-[#78716C]">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {house.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      {house.residents}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#44403C] group-hover:gap-2.5 transition-all duration-300">
                    {language === "en" ? "Discover" : "Découvrir"}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </LocalizedLink>
              {/* (Lot 3 SEO funnel — 3.3) Porte vers /chambres-disponibles?maison=… */}
              <HouseAvailabilityLine house={house.id as HouseKey} className="px-1" />
            </div>
          ))}
        </div>

        {/* R5 (checkpoint 21/08) — front Annemasse : /annemasse-colocation et
            /chambre-a-louer-annemasse n'avaient aucun lien entrant depuis les
            pages fortes (home, maisons, tarifs, FAQ). */}
        <p className="mt-8 text-sm text-[#57534E]">
          {language === "en" ? "Focused on Annemasse Agglo? " : "Tu vises Annemasse Agglo ? "}
          <LocalizedLink to="/annemasse-colocation" className="underline underline-offset-4 hover:text-[#1C1917]">
            {language === "en" ? "Annemasse, La Villa Coliving side" : "Annemasse, côté La Villa Coliving"}
          </LocalizedLink>
          {" · "}
          <LocalizedLink to="/chambre-a-louer-annemasse" className="underline underline-offset-4 hover:text-[#1C1917]">
            {language === "en" ? "Le Lodge, our house in Annemasse" : "Le Lodge, notre maison d'Annemasse"}
          </LocalizedLink>
          {" · "}
          {/* (Lot 5 SEO funnel) Page money « colocation Genève », chambres et dates en temps réel. */}
          <LocalizedLink to={colocGeneveHref(language)} className="underline underline-offset-4 hover:text-[#1C1917]">
            {language === "en" ? "Shared housing in Geneva, French side" : "Colocation à Genève côté France"}
          </LocalizedLink>
        </p>
      </div>
    </section>
  );
}
