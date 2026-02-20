import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * VERSION 9: STONE & BRASS
 * Houses preview — photo cards, tags overlay, CTA link
 */

export function HousesPreviewV7() {
  const { language } = useLanguage();

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
      availability: "Complet" as const,
    },
    {
      id: "leloft",
      name: "Le Loft",
      location: "Ambilly",
      residents: "7",
      image: "/images/le loft jardin.webp",
      description: language === "en"
        ? "20 min from Geneva city center by tram. Year-round heated indoor pool, Finnish sauna."
        : "20 min du centre de Genève en tram. Piscine intérieure chauffée toute l'année, sauna finlandais.",
      alt: language === "en"
        ? "Le Loft — urban coliving house with indoor pool in Ambilly, near Geneva"
        : "Le Loft — colocation urbaine avec piscine intérieure à Ambilly, près de Genève",
      availability: (language === "en" ? "1 room available" : "1 chambre disponible") as string,
    },
    {
      id: "lelodge",
      name: "Le Lodge",
      location: "Annemasse",
      residents: "12",
      image: "/images/le lodge piscine.webp",
      description: language === "en"
        ? "20 min from Geneva city center by CEVA. The largest: pool house, full fitness chalet with sauna, Jacuzzi® & arcade."
        : "20 min du centre de Genève en CEVA. Le plus grand : pool house, chalet fitness complet avec sauna, Jacuzzi® et jeu d'arcade.",
      alt: language === "en"
        ? "Le Lodge — coliving house with pool and gym in Annemasse, near Geneva"
        : "Le Lodge — maison de colocation avec piscine et salle de sport à Annemasse, près de Genève",
      availability: "Complet" as const,
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
          <Link
            to="/our-houses"
            className="group mt-6 md:mt-0 inline-flex items-center gap-2 text-[#44403C] font-semibold text-sm hover:gap-3 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#44403C] focus-visible:ring-offset-2 rounded-lg"
          >
            {language === "en" ? "See all houses" : "Voir toutes les maisons"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Houses grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {houses.map((house, index) => (
            <Link key={index} to={`/${house.id}`} className="group block bg-white rounded-2xl border border-[#E7E5E4] overflow-hidden hover:border-[#44403C]/20 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:translate-y-[-2px] transition-all duration-300">
              {/* Photo */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={house.image}
                  alt={house.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"
                />
                {/* Tag résidents */}
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#1C1917] text-xs font-semibold px-3 py-1.5 rounded-lg">
                  {house.residents} {language === "en" ? "residents" : "résidents"}
                </span>
                {/* Tag transport */}
                <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-lg">
                  {language === "en" ? "20 min Geneva center" : "20 min centre Genève"}
                </span>
                {/* Availability badge */}
                <span className={`absolute bottom-4 left-4 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-lg ${
                  house.availability === "Complet"
                    ? "bg-[#78716C]/90"
                    : "bg-[#D4A574]/90"
                }`}>
                  {house.availability}
                </span>
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
