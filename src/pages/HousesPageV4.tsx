import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Users, ArrowRight, Check, X } from "lucide-react";
import { SEO } from "@/components/SEO";

export function HousesPageV4() {
  const { language } = useLanguage();

  const houses = [
    {
      id: "lavilla",
      name: "La Villa",
      location: "Ville-la-Grand",
      description:
        language === "en"
          ? "370 m² of designed living on a 2,000 m² estate bordering a nature reserve. Heated pool, sauna, gym, and more."
          : "370 m² de vie design sur un domaine de 2 000 m² bordant une réserve naturelle. Piscine chauffée, sauna, gym et plus.",
      image: "/images/villa_portrait.webp",
      alt: language === "en"
        ? "La Villa — premium coliving with heated pool, gym and sauna in Ville-la-Grand near Geneva"
        : "La Villa — colocation premium avec piscine chauffée, gym et sauna à Ville-la-Grand près de Genève",
      capacity: "10",
      price: "1,380",
      features: language === "en"
        ? ["Heated outdoor pool", "Sauna (5 seats)", "Gym", "2,000 m² garden"]
        : ["Piscine chauffée extérieure", "Sauna (5 places)", "Salle de sport", "Jardin 2 000 m²"],
    },
    {
      id: "leloft",
      name: "Le Loft",
      location: "Ambilly",
      description:
        language === "en"
          ? "A 300 m² townhouse with urban sophistication. Year-round heated indoor pool, Finnish sauna, gym, and spacious designer rooms."
          : "Maison de ville de 300 m² avec sophistication urbaine. Piscine intérieure chauffée toute l'année, sauna finlandais, gym et chambres design spacieuses.",
      image: "/images/le loft jardin.webp",
      alt: language === "en"
        ? "Le Loft — urban coliving with indoor pool and designer rooms in Ambilly near Geneva"
        : "Le Loft — colocation urbaine avec piscine intérieure et chambres design à Ambilly près de Genève",
      capacity: "7",
      price: "1,380",
      features: language === "en"
        ? ["Year-round indoor pool", "Finnish sauna", "Gym", "Outdoor kitchen"]
        : ["Piscine intérieure toute l'année", "Sauna finlandais", "Salle de sport", "Cuisine extérieure"],
    },
    {
      id: "lelodge",
      name: "Le Lodge",
      location: "Annemasse",
      description:
        language === "en"
          ? "Our newest and largest home (Jan 2026). Pool house, full fitness chalet with sauna, Jacuzzi® & arcade."
          : "Notre maison la plus récente et la plus grande (jan. 2026). Pool house, chalet fitness complet avec sauna, Jacuzzi® et jeu d'arcade.",
      image: "/images/le lodge piscine.webp",
      alt: language === "en"
        ? "Le Lodge — coliving with pool, gym and gardens in Annemasse, 10 min from Geneva"
        : "Le Lodge — colocation avec piscine, gym et jardins à Annemasse, 10 min de Genève",
      capacity: "12",
      price: "1,380",
      features: language === "en"
        ? ["Outdoor pool + pool house", "Sauna & Jacuzzi®", "Full fitness chalet", "Arcade & games"]
        : ["Piscine + pool house", "Sauna & Jacuzzi®", "Chalet fitness complet", "Arcade & jeux"],
    },
  ];

  const comparisonRows = [
    {
      label: language === "en" ? "Size" : "Surface",
      values: ["370 m²", "300 m²", "500 m²"],
    },
    {
      label: language === "en" ? "Plot" : "Terrain",
      values: ["2,000 m²", "—", "1,500 m²"],
    },
    {
      label: language === "en" ? "Residents" : "Résidents",
      values: ["10", "7", "12"],
    },
    {
      label: language === "en" ? "Pool" : "Piscine",
      values: [
        language === "en" ? "Outdoor heated" : "Extérieure chauffée",
        language === "en" ? "Indoor year-round" : "Intérieure toute l'année",
        language === "en" ? "Outdoor + pool house" : "Extérieure + pool house",
      ],
    },
    {
      label: "Sauna",
      values: [
        language === "en" ? "Infrared (5 seats)" : "Infrarouge (5 places)",
        language === "en" ? "Finnish (2 seats)" : "Finlandais (2 places)",
        language === "en" ? "Sauna + Jacuzzi®" : "Sauna + Jacuzzi®",
      ],
    },
    {
      label: language === "en" ? "Gym" : "Salle de sport",
      values: [true, true, true],
    },
    {
      label: language === "en" ? "Private bathrooms" : "SDB privatives",
      values: [
        language === "en" ? "Most rooms" : "La plupart",
        language === "en" ? "All rooms" : "Toutes",
        language === "en" ? "All rooms" : "Toutes",
      ],
    },
    {
      label: "DPE",
      values: ["D", "C", "B"],
    },
    {
      label: language === "en" ? "Transport to Geneva" : "Transport vers Genève",
      values: [
        language === "en" ? "CEVA train 15 min" : "CEVA 15 min",
        language === "en" ? "Tram 20 min" : "Tram 20 min",
        language === "en" ? "Tram 1 min walk" : "Tram 1 min à pied",
      ],
    },
    {
      label: language === "en" ? "Price" : "Tarif",
      values: ["1,380 CHF", "1,380 CHF", "1,380 CHF"],
    },
  ];

  return (
    <main className="relative pt-20">
      <SEO
        title={language === "en" ? "Our 3 Coliving Houses Near Geneva" : "Nos 3 Maisons de Colocation près de Genève"}
        description={language === "en"
          ? "Explore our 3 premium coliving houses: La Villa (Ville-la-Grand), Le Loft (Ambilly), Le Lodge (Annemasse). 29 furnished rooms, all 15 min from Geneva."
          : "Explore nos 3 maisons de colocation premium : La Villa (Ville-la-Grand), Le Loft (Ambilly), Le Lodge (Annemasse). 29 chambres meublées, toutes à 15 min de Genève."}
        url="https://www.lavillacoliving.com/our-houses"
      />
      {/* Hero */}
      <section className="py-24 lg:py-32 bg-[#F5F2ED]">
        <div className="container-custom text-center">
          <span className="text-xs text-[#78716C] uppercase tracking-[0.3em] mb-4 block">
            {language === "en" ? "Our Homes" : "Nos Maisons"}
          </span>
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-light text-[#1C1917] mb-6"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en" ? (
              <>
                Three Homes<span className="text-[#D4A574]">.</span>
              </>
            ) : (
              <>
                Trois Maisons<span className="text-[#D4A574]">.</span>
              </>
            )}
          </h1>
          <p className="text-xl text-[#57534E] max-w-2xl mx-auto">
            {language === "en"
              ? "Each designed for modern community living. Choose the one that fits your lifestyle."
              : "Chacune conçue pour la vie communautaire moderne. Choisissez celle qui correspond à votre style de vie."}
          </p>
        </div>
      </section>

      {/* Houses Cards */}
      <section className="py-24 lg:py-32 bg-[#FAF9F6]">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {houses.map((house) => (
              <div
                key={house.id}
                className="bg-white rounded-2xl border border-[#E7E5E4] overflow-hidden hover:border-[#44403C]/20 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:translate-y-[-2px] transition-all duration-300 flex flex-col"
              >
                {/* Photo */}
                <Link to={`/${house.id}`} className="block relative aspect-[16/10] overflow-hidden group">
                  <img
                    src={house.image}
                    alt={house.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#1C1917] text-xs font-semibold px-3 py-1.5 rounded-lg">
                    {house.capacity} {language === "en" ? "residents" : "résidents"}
                  </span>
                  <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-lg">
                    {language === "en" ? "20 min Geneva" : "20 min Genève"}
                  </span>
                </Link>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3 text-xs text-[#78716C]">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {house.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      {house.capacity}
                    </span>
                  </div>

                  <h2
                    className="text-2xl font-light text-[#1C1917] mb-3"
                    style={{ fontFamily: "DM Serif Display, serif" }}
                  >
                    {house.name}
                  </h2>

                  <p className="text-sm text-[#57534E] leading-relaxed mb-5">
                    {house.description}
                  </p>

                  {/* Key features */}
                  <div className="space-y-2 mb-6">
                    {house.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-[#44403C]">
                        <Check className="w-4 h-4 text-[#D4A574] flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Price + CTA */}
                  <div className="mt-auto pt-5 border-t border-[#E7E5E4]">
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-light text-[#D4A574]">
                        {house.price} CHF
                      </span>
                      <span className="text-sm text-[#78716C]">
                        / {language === "en" ? "month" : "mois"}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        to={`/${house.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#1C1917] text-white text-sm font-semibold rounded-lg hover:bg-[#D4A574] transition-colors"
                      >
                        {language === "en" ? "Discover" : "Découvrir"}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Link
                        to="/join-us"
                        className="inline-flex items-center justify-center px-5 py-3 border border-[#1C1917] text-[#1C1917] text-sm font-semibold rounded-lg hover:bg-[#1C1917] hover:text-white transition-colors"
                      >
                        {language === "en" ? "Apply" : "Postuler"}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-xs text-[#78716C] uppercase tracking-[0.3em] mb-4 block">
              {language === "en" ? "Compare" : "Comparer"}
            </span>
            <h2
              className="text-3xl md:text-4xl font-light text-[#1C1917]"
              style={{ fontFamily: "DM Serif Display, serif" }}
            >
              {language === "en" ? "Side by Side" : "Côte à Côte"}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b-2 border-[#1C1917]">
                  <th className="text-left py-4 pr-6 text-sm font-semibold text-[#78716C] uppercase tracking-wider w-1/4">
                    {language === "en" ? "Feature" : "Caractéristique"}
                  </th>
                  {houses.map((house) => (
                    <th key={house.id} className="py-4 px-4 text-center w-1/4">
                      <span className="text-lg font-medium text-[#1C1917]" style={{ fontFamily: "DM Serif Display, serif" }}>
                        {house.name}
                      </span>
                      <span className="block text-xs text-[#78716C] mt-1">{house.location}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, index) => (
                  <tr key={index} className={`border-b border-[#E7E5E4] ${index % 2 === 0 ? "bg-[#FAF9F6]" : "bg-white"}`}>
                    <td className="py-4 pr-6 text-sm font-medium text-[#44403C]">
                      {row.label}
                    </td>
                    {row.values.map((val, i) => (
                      <td key={i} className="py-4 px-4 text-center text-sm text-[#57534E]">
                        {val === true ? (
                          <Check className="w-5 h-5 text-[#D4A574] mx-auto" />
                        ) : val === false ? (
                          <X className="w-5 h-5 text-[#78716C]/40 mx-auto" />
                        ) : (
                          val
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#1C1917]">
        <div className="container-custom text-center">
          <h2
            className="text-3xl md:text-4xl font-light text-white mb-4"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "Not Sure Which One?"
              : "Pas Sûr de Laquelle Choisir ?"}
          </h2>
          <p className="text-lg text-white/60 max-w-xl mx-auto mb-8">
            {language === "en"
              ? "Contact us and we'll help you find the perfect home for your lifestyle."
              : "Contactez-nous et nous vous aiderons à trouver la maison parfaite pour votre style de vie."}
          </p>
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 px-8 py-4 border border-white text-white font-bold hover:bg-white hover:text-[#1C1917] transition-colors"
          >
            {language === "en" ? "VISIT OUR FAQ" : "CONSULTER NOTRE FAQ"}
          </Link>
        </div>
      </section>
    </main>
  );
}
