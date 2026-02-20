import { ShieldCheck, Users, Home, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * VERSION 9: STONE & BRASS
 * Trust badges — clean cards, bordure fine, icônes lucide-react
 */

export function TrustBadgesV7() {
  const { language } = useLanguage();

  const badges = [
    {
      icon: ShieldCheck,
      title: language === "en" ? "Zero stress, zero surprises" : "Zéro stress, zéro surprise",
      description: language === "en" ? "One payment, everything included" : "Un seul paiement, tout est inclus",
    },
    {
      icon: Users,
      title: language === "en" ? "Curated community" : "Communauté sélectionnée",
      description: language === "en" ? "7 to 12 residents per house" : "7 à 12 résidents par maison",
    },
    {
      icon: Home,
      title: language === "en" ? "Move-in ready" : "Prêt à emménager",
      description: language === "en" ? "Designer furniture, linen, equipped kitchen" : "Mobilier design, linge, cuisine équipée",
    },
    {
      icon: Zap,
      title: language === "en" ? "8 Gbps fiber WiFi" : "WiFi fibre 8 Gbps",
      description: language === "en" ? "Work from home, no compromises" : "Télétravail sans compromis",
    },
  ];

  return (
    <section className="py-10 md:py-12 bg-[#FAF9F6]">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="text-center p-5 md:p-6 bg-white rounded-2xl border border-[#E7E5E4] hover:border-[#44403C]/20 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:translate-y-[-2px] transition-all duration-300"
            >
              <badge.icon className="w-5 h-5 text-[#44403C] mb-2 mx-auto" />
              <h3 className="text-[#1C1917] font-semibold text-sm mb-1">{badge.title}</h3>
              <p className="text-xs text-[#78716C]">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
