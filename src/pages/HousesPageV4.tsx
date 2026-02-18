import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Users, ArrowRight } from "lucide-react";
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
          ? "400m² of designed living on a 2000m² estate bordering a nature reserve. Heated pool, sauna, gym, and more."
          : "400m² de vie design sur un domaine de 2000m² bordant une réserve naturelle. Piscine chauffée, sauna, gym et plus.",
      image: "/images/la villa.webp",
      alt: language === "en"
        ? "La Villa — premium coliving with heated pool, gym and sauna in Ville-la-Grand near Geneva"
        : "La Villa — colocation premium avec piscine chauffée, gym et sauna à Ville-la-Grand près de Genève",
      capacity: "10",
      price: "1,380",
      available: true,
    },
    {
      id: "leloft",
      name: "Le Loft",
      location: "Ambilly",
      description:
        language === "en"
          ? "A charming townhouse with urban sophistication. Indoor pool, sauna, gym, and spacious designer rooms."
          : "Une maison de ville charmante avec sophistication urbaine. Piscine intérieure, sauna, gym et chambres design spacieuses.",
      image: "/images/le loft jardin.webp",
      alt: language === "en"
        ? "Le Loft — urban coliving with indoor pool and designer rooms in Ambilly near Geneva"
        : "Le Loft — colocation urbaine avec piscine intérieure et chambres design à Ambilly près de Genève",
      capacity: "7",
      price: "1,380",
      available: true,
    },
    {
      id: "lelodge",
      name: "Le Lodge",
      location: "Annemasse",
      description:
        language === "en"
          ? "Our newest and largest home. Outdoor pool, fitness chalet, pool house, and expansive gardens."
          : "Notre maison la plus récente et la plus grande. Piscine extérieure, chalet fitness, pool house et jardins spacieux.",
      image: "/images/le lodge.webp",
      alt: language === "en"
        ? "Le Lodge — coliving with pool, gym and gardens in Annemasse, 10 min from Geneva"
        : "Le Lodge — colocation avec piscine, gym et jardins à Annemasse, 10 min de Genève",
      capacity: "12",
      price: "1,380",
      available: false,
      badge: language === "en" ? "Opening Jan 2026" : "Ouverture Jan 2026",
    },
  ];

  return (
    <main className="relative pt-20">
      <SEO
        title={language === "en" ? "Our 3 Coliving Houses Near Geneva" : "Nos 3 Maisons de Colocation près de Genève"}
        description={language === "en"
          ? "Explore our 3 premium coliving houses: La Villa (Ville-la-Grand), Le Loft (Ambilly), Le Lodge (Annemasse). 29 furnished rooms, all 15 min from Geneva."
          : "Explorez nos 3 maisons de colocation premium : La Villa (Ville-la-Grand), Le Loft (Ambilly), Le Lodge (Annemasse). 29 chambres meublées, toutes à 15 min de Genève."}
        url="https://www.lavillacoliving.com/our-houses"
      />
      {/* Hero */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container-custom text-center">
          <span className="text-xs text-[#999] uppercase tracking-[0.3em] mb-4 block">
            {language === "en" ? "Our Homes" : "Nos Maisons"}
          </span>
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-light text-[#1a1a1a] mb-6"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            {language === "en" ? (
              <>
                Three Homes<span className="text-[#c44536]">.</span>
              </>
            ) : (
              <>
                Trois Maisons<span className="text-[#c44536]">.</span>
              </>
            )}
          </h1>
          <p className="text-xl text-[#666] max-w-2xl mx-auto">
            {language === "en"
              ? "Each designed for modern community living. Choose the one that fits your lifestyle."
              : "Chacune conçue pour la vie communautaire moderne. Choisissez celle qui correspond à votre style de vie."}
          </p>
        </div>
      </section>

      {/* Houses List */}
      <section className="py-24 lg:py-32 bg-[#fafafa]">
        <div className="container-custom">
          <div className="space-y-24">
            {houses.map((house, index) => (
              <div
                key={house.id}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Image */}
                <div className={`${index % 2 === 1 ? "lg:order-2" : ""}`}>
                  <Link to={`/${house.id}`} className="block relative group">
                    <div className="absolute -inset-4 border border-[#e5e5e5] group-hover:border-[#c44536] transition-colors" />
                    <div className="relative aspect-[4/3] bg-[#f5f5f5] overflow-hidden">
                      <img
                        src={house.image}
                        alt={house.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy"
                      />
                      {house.badge && (
                        <div className="absolute top-4 left-4 px-4 py-2 bg-[#1a1a1a] text-white text-xs uppercase tracking-wider">
                          {house.badge}
                        </div>
                      )}
                    </div>
                  </Link>
                </div>

                {/* Content */}
                <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="flex items-center gap-4 mb-4 text-sm text-[#666]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {house.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {house.capacity}{" "}
                      {language === "en" ? "members" : "membres"}
                    </span>
                  </div>

                  <h2
                    className="text-4xl md:text-5xl font-light text-[#1a1a1a] mb-4"
                    style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                  >
                    {house.name}
                  </h2>

                  <p className="text-lg text-[#666] leading-relaxed mb-6">
                    {house.description}
                  </p>

                  <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-3xl font-light text-[#01942d]">
                      {house.price} CHF
                    </span>
                    <span className="text-[#999]">
                      / {language === "en" ? "month" : "mois"}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <Link
                      to={`/${house.id}`}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-[#1a1a1a] text-white font-bold hover:bg-[#c44536] transition-colors"
                    >
                      {language === "en" ? "VIEW DETAILS" : "VOIR LES DÉTAILS"}
                      <ArrowRight className="w-5 h-5" />
                    </Link>

                    {house.available && (
                      <Link
                        to="/join-us"
                        className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#1a1a1a] text-[#1a1a1a] font-bold hover:bg-[#1a1a1a] hover:text-white transition-colors"
                      >
                        {language === "en" ? "APPLY NOW" : "POSTULER"}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#1a1a1a]">
        <div className="container-custom text-center">
          <h2
            className="text-3xl md:text-4xl font-light text-white mb-4"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            {language === "en"
              ? "Not Sure Which One?"
              : "Pas Sûr de laquelle Choisir ?"}
          </h2>
          <p className="text-lg text-[#666] max-w-xl mx-auto mb-8">
            {language === "en"
              ? "Contact us and we'll help you find the perfect home for your lifestyle."
              : "Contactez-nous et nous vous aiderons à trouver la maison parfaite pour votre style de vie."}
          </p>
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 px-8 py-4 border border-white text-white font-bold hover:bg-white hover:text-[#1a1a1a] transition-colors"
          >
            {language === "en" ? "VISIT OUR FAQ" : "CONSULTER NOTRE FAQ"}
          </Link>
        </div>
      </section>
    </main>
  );
}
