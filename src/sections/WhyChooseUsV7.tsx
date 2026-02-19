// WhyChooseUs V7 - Premium section
import { Wallet, Heart, CalendarHeart, Wifi, Sparkles, Globe, Car } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { STATS } from "@/data/stats";

/**
 * VERSION 7: PREMIUM + FACTUEL + USPs
 * Why Choose Us — vouvoiement, icônes lucide-react, USPs renforcés
 */

export function WhyChooseUsV7() {
  const { language } = useLanguage();

  const features = [
    {
      icon: Wallet,
      text:
        language === "en"
          ? "One payment, everything included"
          : "Un paiement unique, tout compris",
    },
    {
      icon: Heart,
      text: language === "en" ? "Private yoga and fitness every week" : "Yoga et fitness privés chaque semaine",
    },
    {
      icon: CalendarHeart,
      text:
        language === "en" ? "Pizza night, meal basket, events" : "Pizza Party, panier repas, événements",
    },
    {
      icon: Wifi,
      text:
        language === "en" ? `${STATS.wifiBandwidth} fiber internet` : `WiFi fibre ${STATS.wifiBandwidth}`,
    },
    {
      icon: Sparkles,
      text:
        language === "en" ? "Housekeeping twice a week" : "Ménage 2 fois par semaine",
    },
    {
      icon: Globe,
      text:
        language === "en"
          ? `${STATS.genevaDistanceMin}-${STATS.genevaDistanceMax} min from Geneva`
          : `${STATS.genevaDistanceMin}-${STATS.genevaDistanceMax} min de Genève`,
    },
  ];

  return (
    <section className="py-24 bg-[#faf9f5] relative overflow-hidden">
      {/* Organic shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#a8c5d9]/10 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-[0_20px60px_rgba(124,154,109,0.12)]">
              <img
                src="/images/le lodge living room.webp"
                alt={language === "en" ? "Le Lodge living room — premium coliving common space near Geneva" : "Salon du Lodge — espace commun coliving premium près de Genève"}
                className="w-full h-full object-cover" loading="lazy"
              />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-2xl shadow-[0_10px40px_rgba(124,154,109,0.15)]">
              <Car className="w-8 h-8 text-[#7c9a6d] mb-1" />
              <div className="text-2xl font-medium text-[#7c9a6d]">{STATS.genevaDistanceMin}-{STATS.genevaDistanceMax} min</div>
              <div className="text-sm text-[#7c8a72]">
                {language === "en" ? "to Geneva" : "de Genève"}
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <span className="inline-block px-4 py-2 bg-[#7c9a6d]/15 text-[#7c9a6d] text-sm font-medium rounded-full mb-6">
              {language === "en" ? "Why La Villa?" : "Pourquoi La Villa ?"}
            </span>

            <h2 className="text-4xl md:text-5xl font-light text-[#3d4a38] mb-6 leading-tight">
              {language === "en" ? "Live better," : "Vivez mieux,"}
              <br />
              <span className="font-medium text-[#7c9a6d]">
                {language === "en" ? "together" : "ensemble"}
              </span>
            </h2>

            <p className="text-[#5a6355] text-lg leading-relaxed mb-10 max-w-lg">
              {language === "en"
                ? "We're not just a place to stay. We create exceptional living spaces with premium amenities and a curated community of professionals."
                : "Nous ne sommes pas un simple hébergement. Nous créons des lieux de vie d'exception, avec des équipements premium et une communauté sélectionnée de professionnels."}
            </p>

            {/* Features grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#7c9a6d]/10 hover:border-[#7c9a6d]/30 hover:shadow-sm transition-all duration-300"
                >
                  <feature.icon className="w-5 h-5 text-[#7c9a6d] flex-shrink-0" />
                  <span className="text-sm text-[#5a6355]">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
