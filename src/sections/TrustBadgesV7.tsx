import { Shield, Users, Home, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * VERSION 7: JEUNE + NOMADE + ZEN + FRAIS
 * Trust badges style lifestyle
 */

export function TrustBadgesV7() {
  const { language } = useLanguage();

  const badges = [
    {
      icon: Shield,
      emoji: "🔒",
      title:
        language === "en"
          ? "No stress,No Surprise"
          : "Aucun Stress, Aucune Surprise",
      description:
        language === "en"
          ? "All bills included"
          : "Tout est inclus dans le loyer",
    },
    {
      icon: Users,
      emoji: "🤝",
      title: language === "en" ? "Instant Friends" : "Amitiés Instantanées",
      description:
        language === "en" ? "Curated Community" : "Communauté Sélectionnée",
    },
    {
      icon: Home,
      emoji: "🏠",
      title: language === "en" ? "Move-in Ready" : "Prêt à Emménager",
      description: language === "en" ? "Fully Furnished" : "Entièrement Meublé",
    },
    {
      icon: Zap,
      emoji: "⚡",
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
              <div className="text-3xl mb-3">{badge.emoji}</div>
              <h3 className="text-[#3d4a38] font-medium mb-1">{badge.title}</h3>
              <p className="text-sm text-[#7c8a72]">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
