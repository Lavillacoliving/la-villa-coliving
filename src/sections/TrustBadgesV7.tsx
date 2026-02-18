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
      emoji: "\uD83D\uDD12",
      title:
        language === "en"
          ? "Zero Surprise"
          : "Z\u00E9ro surprise",
      description:
        language === "en"
          ? "Everything's in the rent. Period."
          : "Tout est dans le loyer, point.",
    },
    {
      icon: Users,
      emoji: "\uD83E\uDD1D",
      title: language === "en" ? "Your Tribe, Day 1" : "Ta tribu, d\u00E8s le jour 1",
      description:
        language === "en" ? "Curated community of pros" : "Communaut\u00E9 s\u00E9lectionn\u00E9e de pros",
    },
    {
      icon: Home,
      emoji: "\uD83C\uDFE0",
      title: language === "en" ? "Drop Your Bags" : "Pose ta valise",
      description: language === "en" ? "Fully furnished, move-in ready" : "Enti\u00E8rement meubl\u00E9, pr\u00EAt \u00E0 vivre",
    },
    {
      icon: Zap,
      emoji: "\u26A1",
      title: language === "en" ? "Pro Fiber" : "Fibre Pro",
      description: language === "en" ? "Symmetric, unlimited, included" : "Sym\u00E9trique, illimit\u00E9e, incluse",
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
