import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * VERSION 9: BOUTIQUE HOSPITALITY
 * Houses preview — serif initials, no emojis
 */

export function HousesPreviewV7() {
  const { language } = useLanguage();

  const houses = [
    {
      id: "lavilla",
      name: "La Villa",
      initial: "V",
      location: "Ville-la-Grand",
      residents: "10",
      image: "/images/villa_portrait.webp",
      description: language === "en"
        ? "Heated pool, 2,000 m² garden, nature reserve"
        : "Piscine chauffée, 2 000 m² de jardin, réserve naturelle",
      alt: language === "en"
        ? "La Villa — premium coliving house with garden and pool in Ville-la-Grand, near Geneva"
        : "La Villa — maison de colocation premium avec jardin et piscine à Ville-la-Grand, près de Genève",
    },
    {
      id: "leloft",
      name: "Le Loft",
      initial: "Le",
      location: "Ambilly",
      residents: "7",
      image: "/images/le loft jardin.webp",
      description: language === "en"
        ? "Year-round heated indoor pool, 7 residents"
        : "Piscine intérieure chauffée toute l'année, 7 résidents",
      alt: language === "en"
        ? "Le Loft — urban coliving house with indoor pool in Ambilly, near Geneva"
        : "Le Loft — colocation urbaine avec piscine intérieure à Ambilly, près de Genève",
    },
    {
      id: "lelodge",
      name: "Le Lodge",
      initial: "Le",
      location: "Annemasse",
      residents: "12",
      image: "/images/le lodge piscine.webp",
      description: language === "en"
        ? "The largest: 4 buildings, fitness chalet with jacuzzi"
        : "Le plus grand : 4 bâtiments, chalet fitness avec jacuzzi",
      alt: language === "en"
        ? "Le Lodge — coliving house with pool and gym in Annemasse, 10 min from Geneva"
        : "Le Lodge — maison de colocation avec piscine et salle de sport à Annemasse, 10 min de Genève",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-[#FAF8F3] relative overflow-hidden">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div>
            <span className="text-[#2D6A4F] text-sm font-semibold tracking-[0.08em] uppercase mb-6 block">
              {language === "en" ? "OUR HOUSES" : "NOS MAISONS"}
            </span>
            <h2 className="text-3xl md:text-4xl text-[#1A1A1A]" style={{ fontFamily: "'DM Serif Display', serif" }}>
              {language === "en" ? "3 houses, 3 personalities" : "3 maisons, 3 personnalités"}
            </h2>
          </div>
          <Link
            to="/our-houses"
            className="group mt-6 md:mt-0 inline-flex items-center gap-2 text-[#2D6A4F] font-semibold hover:gap-3 transition-all duration-300"
          >
            {language === "en" ? "See all houses" : "Voir toutes les maisons"}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Houses grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {houses.map((house, index) => (
            <Link key={index} to={`/${house.id}`} className="group block">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-6 shadow-[0_2px_8px_rgba(27,67,50,0.06)]">
                <img
                  src={house.image}
                  alt={house.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332]/50 via-transparent to-transparent" />

                {/* Serif initial badge */}
                <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-[#2D6A4F] flex items-center justify-center text-white text-lg shadow-lg" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  {house.initial}
                </div>

                {/* Residents tag */}
                <span className="absolute bottom-3 right-3 bg-[#1B4332]/85 backdrop-blur text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {house.residents} {language === "en" ? "residents" : "résidents"}
                </span>

                {/* Hover content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-flex items-center gap-2 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {language === "en" ? "Discover" : "Découvrir"}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Info */}
              <div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2 group-hover:text-[#2D6A4F] transition-colors duration-300">
                  {house.name}
                </h3>
                <p className="text-[#4A4A4A] text-sm mb-3">{house.description}</p>
                <div className="flex items-center gap-4 text-sm text-[#4A4A4A]">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {house.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    {house.residents}
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
