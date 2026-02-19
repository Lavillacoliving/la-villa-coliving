import { Shield, Users, Home, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * VERSION 9: BOUTIQUE HOSPITALITY
 * Trust badges — clean, no emojis
 */

export function TrustBadgesV7() {
  const { language } = useLanguage();

  const badges = [
    {
      icon: Shield,
      title: language === "en" ? "Zero stress, zero surprises" : "Zéro stress, zéro surprise",
      description: language === "en" ? "All inclusive" : "Tout inclus",
    },
    {
      icon: Users,
      title: language === "en" ? "Curated community" : "Communauté sélectionnée",
      description: language === "en" ? "7 to 12 residents per house" : "7 à 12 résidents par maison",
    },
    {
      icon: Home,
      title: language === "en" ? "Move-in ready" : "Prêt à emménager",
      description: language === "en" ? "Fully furnished" : "Entièrement meublé",
    },
    {
      icon: Zap,
      title: language === "en" ? "8 Gbps fiber WiFi" : "WiFi fibre 8 Gbps",
      description: language === "en" ? "Professional-grade internet" : "Internet professionnel",
    },
  ];

  return (
    <section className="py-16 bg-[#FAF8F3] relative overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="group text-center p-6 rounded-2xl bg-white border border-[#E8E5DF] hover:shadow-[0_12px_48px_rgba(27,67,50,0.12)] hover:translate-y-[-4px] transition-all duration-400"
            >
              <badge.icon className="w-6 h-6 text-[#2D6A4F] mx-auto mb-3" />
              <h3 className="text-[#1A1A1A] font-semibold text-sm mb-1">{badge.title}</h3>
              <p className="text-sm text-[#4A4A4A]">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
