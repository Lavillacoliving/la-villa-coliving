import { Shield, Users, Home, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * VERSION 7: PREMIUM + FACTUEL
 * Trust badges with lucide-react icons
 */

export function TrustBadgesV7() {
  const { language } = useLanguage();

  const badges = [
    {
      icon: Shield,
      title:
        language === "en"
          ? "No stress, no surprises"
          : "Zéro stress, zéro surprise",
      description:
        language === "en"
          ? "All bills included"
          : "Tout est inclus dans le loyer",
    },
    {
      icon: Users,
      title: language === "en" ? "Instant Friends" : "Amitiés Instantanées",
      description:
        language === "en" ? "Curated Community" : "Communauté Sélectionnée",
    },
    {
      icon: Home,
      title: language === "en" ? "Move-in Ready" : "Prêt à Emménager",
      description: language === "en" ? "Fully Furnished" : "Entièrement Meublé",
    },
    {
      icon: Zap,
      title: language === "en" ? "Fast WiFi" : "WiFi Rapide",
      description: language === "en" ? "Pro Fiber Optic" : "Pro Fibre Optique",
    },
  ];

  return (
    <section className="py-16 bg-[#faf9f5] relative overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="group text-center p-6 rounded-3xl bg-white border border-[#7c9a6d]/10 hover:border-[#7c9a6d]/30 hover:shadow-[0_10px40px_rgba(124,154,109,0.1)] transition-all duration-500"
            >
              <badge.icon className="w-7 h-7 text-[#7c9a6d] mb-3 mx-auto" />
              <h3 className="text-[#3d4a38] font-medium mb-1">{badge.title}</h3>
              <p className="text-sm text-[#7c8a72]">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
