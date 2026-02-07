import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Wifi, Coffee } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * VERSION 7: JEUNE + NOMADE + ZEN + FRAIS
 * Style: Lifestyle, décontracté, organique, plein de vie
 */

export function HeroV7() {
  const { language } = useLanguage();

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#faf9f5]">
      {/* Background organic shapes */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#7c9a6d]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#d4897a]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-[#a8c5d9]/15 rounded-full blur-3xl" />

      {/* Main content */}
      <div className="flex-1 flex items-center relative pt-20">
        <div className="container-custom py-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Content */}
            <div className="relative z-10">
              {/* Tagline fraîche */}
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#7c9a6d]/15 text-[#7c9a6d] text-sm font-medium rounded-full">
                  🌿{" "}
                  {language === "en"
                    ? "Prémium Coliving - Grand Genève"
                    : "Coliving Premium - Grand Genève"}
                </span>
              </div>

              {/* Title - ton décontracté */}
              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-light text-[#3d4a38] leading-[1.1] tracking-tight mb-8"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                {language === "en" ? (
                  <>
                    Your home,
                    <br />
                    <span className="font-medium text-[#7c9a6d]">
                      your people
                    </span>
                    <span className="text-[#d4897a]">.</span>
                  </>
                ) : (
                  <>
                    Ta maison,
                    <br />
                    <span className="font-medium text-[#7c9a6d]">tes gens</span>
                    <span className="text-[#d4897a]">.</span>
                  </>
                )}
              </h1>

              {/* Description - ton conversationnel */}
              <p className="text-lg text-[#5a6355] max-w-lg leading-relaxed mb-8">
                {language === "en"
                  ? "Fully furnished premium homes, instant community, all-inclusive living. Just bring your suitcase and good vibes ✨"
                  : "Maisons Premiums toutes équipées, communauté instantanée, vie tout inclus. Amène juste ta valise et ta bonne humeur ✨"}
              </p>

              {/* Quick stats - style badges */}
              <div className="flex flex-wrap gap-3 mb-10">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#7c9a6d]/20 text-[#5a6355] text-sm rounded-full">
                  <Wifi className="w-4 h-4 text-[#7c9a6d]" />
                  {language === "en" ? "Great Outdoors" : "Grands Espaces"}
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#d4897a]/20 text-[#5a6355] text-sm rounded-full">
                  <Coffee className="w-4 h-4 text-[#d4897a]" />
                  {language === "en"
                    ? "Pool, Gym & Sauna"
                    : "Piscine, Sport & Sauna"}
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#a8c5d9]/30 text-[#5a6355] text-sm rounded-full">
                  <MapPin className="w-4 h-4 text-[#a8c5d9]" />
                  {language === "en"
                    ? "Geneva in 20 minutes"
                    : "Genève en 20 minutes"}
                </span>
              </div>

              {/* CTAs - style organique */}
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link
                  to="/our-houses"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-[#7c9a6d] text-white font-medium rounded-full hover:bg-[#6b8560] transition-all duration-300 hover:shadow-[0_8px30px_rgba(124,154,109,0.35)]"
                >
                  {language === "en"
                    ? "Explore houses"
                    : "Découvrir les maisons"}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>

                <Link
                  to="/join-us"
                  className="inline-flex items-center gap-3 px-8 py-4 border-2 border-[#d4897a] text-[#d4897a] font-medium rounded-full hover:bg-[#d4897a] hover:text-white transition-all duration-300"
                >
                  {language === "en" ? "Apply now" : "Postuler"}
                </Link>
              </div>

              {/* Social proof - style décontracté */}
              <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c9a6d] to-[#a8c5d9] border-2 border-[#faf9f5] flex items-center justify-center text-white text-xs font-medium"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-[#5a6355]">
                  <span className="font-medium text-[#7c9a6d]">50+</span>{" "}
                  {language === "en" ? "happy colivers" : "colivers heureux"}
                </div>
              </div>
            </div>

            {/* Right - Image collage style */}
            <div className="relative hidden lg:block">
              {/* Main image */}
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-[0_20px60px_rgba(124,154,109,0.15)]">
                <img
                  src="/images/la villa jardin.webp"
                  alt="La Villa Coliving"
                  className="w-full h-full object-cover"
                />
                {/* Soft overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#3d4a38]/20 via-transparent to-transparent" />
              </div>

              {/* Floating card 1 */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-[0_10px40px_rgba(124,154,109,0.12)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#7c9a6d]/15 flex items-center justify-center">
                    <span className="text-lg">🏠</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#3d4a38]">
                      3 maisons
                    </div>
                    <div className="text-xs text-[#5a6355]">
                      {language === "en" ? "All Unique" : "Toutes Uniques"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating card 2 */}
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl shadow-[0_10px40px_rgba(212,137,122,0.12)]">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <div className="text-lg font-medium text-[#3d4a38]">
                      4.9
                    </div>
                    <div className="text-xs text-[#5a6355]">
                      {language === "en" ? "Rating" : "Note"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating card 3 */}
              <div className="absolute top-1/2 -right-8 bg-[#d4897a] text-white p-4 rounded-2xl shadow-[0_10px40px_rgba(212,137,122,0.25)]">
                <div className="text-sm font-medium">
                  {language === "en"
                    ? "Room Available"
                    : "Chambres Disponibles"}
                </div>
                <div className="text-xs opacity-90">
                  {language === "en" ? "Spring 2026" : "Printemps 2026"}🗓 ️
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BANDEAU PREMIUM - Points Différenciants */}
      <div className="relative bg-[#3d4a38] py-16 overflow-hidden">
        {/* Background subtle pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#7c9a6d_1px,_transparent_1px)] bg-[length:20px_20px]" />
        </div>

        <div className="container-custom relative z-10">
          {/* Header text */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#7c9a6d]/20 text-[#a8d695] text-sm font-medium rounded-full mb-4">
              ✨{" "}
              {language === "en"
                ? "Why we're different"
                : "Pourquoi nous sommes uniques"}
            </span>
            <h2
              className="text-3xl md:text-4xl font-light text-[#faf9f5] mb-4"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              {language === "en" ? (
                <>
                  The True Premium Coliving experience, <br />
                  <span className="font-medium text-[#7c9a6d]">
                    intimate community feel
                  </span>
                </>
              ) : (
                <>
                  L'Authentique Expérience du Coliving, <br />
                  <span className="font-medium text-[#7c9a6d]">
                    l'âme d'une communauté intimiste
                  </span>
                </>
              )}
            </h2>
            <p className="text-[#a8b5a0] max-w-2xl mx-auto">
              {language === "en"
                ? "Only 3 very exclusive homes. Each one designed like a premium retreat, not a crowded shared house."
                : "Seulement 3 maisons exclusives. Chacune à taille humaine, pas une colocation bondée."}
            </p>
          </div>

          {/* 5 Differentiators Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
            {[
              {
                icon: "",
                image: "/images/le loft glamour.webp",
                title: language === "en" ? "Human Scale" : "Taille Humaine",
                desc:
                  language === "en"
                    ? "12 colivers maximum"
                    : "12 colivers maximum",
                highlight:
                  language === "en" ? "Intimate & Premium" : "Intime & Premium",
              },
              {
                icon: "",
                image: "/images/la villa coliving le loft piscine.jpg",
                title: language === "en" ? "Swimming Pool" : "Piscine",
                desc:
                  language === "en"
                    ? "Indoor or outdoor"
                    : "Intérieure ou extérieure",
                highlight:
                  language === "en" ? "For you Only" : "Pour vous Seulement",
              },
              {
                icon: "",
                image: "/images/la villa coliving le lodge-sauna2.jpg",
                title: "Sauna",
                desc:
                  language === "en"
                    ? "Wellness & recovery"
                    : "Bien-être & récupération",
                highlight:
                  language === "en" ? "Pure Relaxation" : "Relaxation Pure",
              },
              {
                icon: "",
                image: "/images/la villa coliving le lodge-gym.jpg",
                title: language === "en" ? "Gym" : "Salle de Sport",
                desc:
                  language === "en" ? "Fully equipped" : "Entièrement équipée",
                highlight: language === "en" ? "Stay Active" : "Restez Actif",
              },
              {
                icon: "",
                image: "/images/la villa yoga.webp",
                title: language === "en" ? "Community Events" : "Événements",
                desc:
                  language === "en"
                    ? "Yoga, dinners & more"
                    : "Yoga, dîners & plus",
                highlight:
                  language === "en" ? "Real Connections" : "Vraies Connexions",
              },
            ].map((item, index) => (
              <div key={index} className="group relative">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#4a5744] shadow-[0_10px40px_rgba(0,0,0,0.3)]">
                  {/* Image placeholder - replace src with your actual images */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3d4a38] via-[#3d4a38]/40 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <div className="mb-2">
                      <span className="text-2xl">{item.icon}</span>
                    </div>
                    <h3 className="text-[#faf9f5] font-medium text-lg mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[#a8b5a0] text-sm mb-2">{item.desc}</p>
                    <span className="inline-block px-3 py-1 bg-[#7c9a6d]/30 text-[#a8d695] text-xs font-medium rounded-full backdrop-blur-sm">
                      {item.highlight}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center">
            <p className="text-[#a8b5a0] text-lg mb-4">
              {language === "en"
                ? "🌟 This level of amenities is rare in coliving. That's why we only have 3 homes."
                : "🌟 Ce niveau d'équipements est rare en coliving. C'est pourquoi nous n'avons que 3 maisons."}
            </p>
            <Link
              to="/our-houses"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#7c9a6d] text-white font-medium rounded-full hover:bg-[#6b8560] transition-all duration-300 hover:shadow-[0_8px30px_rgba(124,154,109,0.4)]"
            >
              {language === "en" ? "See the houses" : "Voir les maisons"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar - style léger */}
      <div className="border-t border-[#7c9a6d]/10">
        <div className="container-custom py-6">
          <div className="flex items-center justify-center gap-8 md:gap-16">
            {[
              {
                value: "100+",
                label:
                  language === "en"
                    ? "Community members"
                    : "Membres de la communauté",
              },
              {
                value: "3",
                label:
                  language === "en"
                    ? "Only Exclusives Homes"
                    : "Maisons Uniquement",
              },
              {
                value: "20 min max",
                label: language === "en" ? "From Geneva" : "De Genève",
              },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <span className="text-xl font-medium text-[#7c9a6d]">
                  {stat.value}
                </span>
                <span className="block text-xs text-[#5a6355] mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
