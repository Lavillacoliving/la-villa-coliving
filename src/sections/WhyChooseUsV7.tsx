// WhyChooseUs V9 - Stone & Brass
import { Wallet, Heart, CalendarDays, Trophy, Sparkles, Users, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { STATS } from "@/data/stats";

/**
 * VERSION 9: STONE & BRASS
 * Why Choose Us — clean cards, no blobs, Inter bold H2
 */

export function WhyChooseUsV7() {
  const { language } = useLanguage();

  const features = [
    {
      icon: Wallet,
      text: language === "en" ? "One payment, everything included" : "Un paiement unique, tout compris",
    },
    {
      icon: Heart,
      text: language === "en" ? "Private yoga and fitness every week" : "Yoga et fitness privés chaque semaine",
    },
    {
      icon: CalendarDays,
      text: language === "en" ? "Pizza night, meal basket, events" : "Pizza Party, panier repas, événements",
    },
    {
      icon: Trophy,
      text: language === "en" ? "Exceptional amenities" : "Équipements exceptionnels",
      description: language === "en"
        ? "Pool, sauna, full gym, foosball, board games — a level of amenities unique in coliving."
        : "Piscine, sauna, salle de sport complète, babyfoot, jeux de société — un niveau de prestations unique en coliving.",
    },
    {
      icon: Sparkles,
      text: language === "en" ? "Housekeeping twice a week" : "Ménage 2 fois par semaine",
    },
    {
      icon: Users,
      text: language === "en" ? "A real community" : "Une vraie communauté",
      description: language === "en"
        ? "Pizza party, yoga classes, meal baskets, game nights — bonds that form naturally between residents."
        : "Pizza party, cours de yoga, paniers repas, soirées jeux — des liens qui se créent naturellement entre résidents.",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-[#F5F2ED]">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src="/images/le lodge living room.webp"
                alt={language === "en" ? "Le Lodge living room — premium coliving common space near Geneva" : "Salon du Lodge — espace commun coliving premium près de Genève"}
                className="w-full h-full object-cover" loading="lazy"
              />
            </div>
            {/* Location badge */}
            <div className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-white border border-[#E7E5E4] rounded-xl text-sm font-medium text-[#44403C]">
              <MapPin className="w-4 h-4 text-[#D4A574]" />
              {language === "en" ? `${STATS.genevaCenterMinutes} min from Geneva city center` : `${STATS.genevaCenterMinutes} min du centre de Genève`}
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <span className="text-[#44403C] text-[13px] font-semibold tracking-[0.1em] uppercase">
              {language === "en" ? "WHY LA VILLA" : "POURQUOI LA VILLA"}
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-[#1C1917] mt-4 mb-6 leading-tight" style={{ letterSpacing: '-0.025em' }}>
              {language === "en" ? (
                <>A home, not a building.</>
              ) : (
                <>Une maison, pas un immeuble.</>
              )}
            </h2>

            <p className="text-[#78716C] text-base md:text-lg leading-relaxed mb-10 max-w-lg">
              {language === "en"
                ? `Mega-colivings house 300 people in residences. We welcome ${STATS.minResidentsPerHouse} to ${STATS.maxResidentsPerHouse} professionals in real houses with gardens, pools, and terraces. Bonds form naturally, without forcing it.`
                : `Les méga-colivings logent 300 personnes dans des résidences. Nous accueillons ${STATS.minResidentsPerHouse} à ${STATS.maxResidentsPerHouse} professionnels dans de vraies maisons avec jardin, piscine et terrasses. Les liens se créent naturellement, sans forcer.`}
            </p>

            {/* Features grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-[#E7E5E4] hover:border-[#44403C]/20 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:translate-y-[-2px] transition-all duration-300"
                >
                  <feature.icon className="w-5 h-5 text-[#44403C] flex-shrink-0" />
                  <span className="text-sm text-[#1C1917] font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
