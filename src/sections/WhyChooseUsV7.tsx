import { Wallet, Heart, CalendarDays, Wifi, Sparkles, Shield, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * VERSION 9: BOUTIQUE HOSPITALITY
 * Why Choose Us — clean, no organic shapes
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
      icon: Wifi,
      text: language === "en" ? "8 Gbps fiber internet" : "WiFi fibre 8 Gbps",
    },
    {
      icon: Sparkles,
      text: language === "en" ? "Housekeeping twice a week" : "Ménage 2 fois par semaine",
    },
    {
      icon: Shield,
      text: language === "en" ? "Founder-managed" : "Gérés par les fondateurs",
      desc: language === "en"
        ? "No impersonal helpdesk. Jérôme and Fanny manage all 3 houses. A WhatsApp message is all it takes."
        : "Pas de support impersonnel. Jérôme et Fanny gèrent les 3 maisons. Un WhatsApp suffit.",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-[#FAF8F3] relative overflow-hidden">
      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(27,67,50,0.06)]">
              <img
                src="/images/le lodge living room.webp"
                alt={language === "en" ? "Le Lodge living room — premium coliving common space near Geneva" : "Salon du Lodge — espace commun coliving premium près de Genève"}
                className="w-full h-full object-cover" loading="lazy"
              />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-2xl shadow-[0_12px_48px_rgba(27,67,50,0.12)] border border-[#E8E5DF]">
              <MapPin className="w-6 h-6 text-[#2D6A4F] mb-2" />
              <div className="text-2xl font-semibold text-[#2D6A4F]" style={{ fontFamily: "'DM Serif Display', serif" }}>15-25 min</div>
              <div className="text-sm text-[#4A4A4A]">
                {language === "en" ? "from Geneva" : "de Genève"}
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <span className="text-[#2D6A4F] text-sm font-semibold tracking-[0.08em] uppercase mb-6 block">
              {language === "en" ? "WHY LA VILLA" : "POURQUOI LA VILLA"}
            </span>

            <h2 className="text-3xl md:text-4xl text-[#1A1A1A] mb-6 leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
              {language === "en" ? "A home, not a building." : "Une maison, pas un immeuble."}
            </h2>

            <p className="text-[#4A4A4A] text-lg leading-relaxed mb-10 max-w-lg">
              {language === "en"
                ? "Mega-colivings house 300 people in residences. We welcome 7 to 12 professionals in real houses with gardens, pools, and terraces. Bonds form naturally, without forcing it."
                : "Les méga-colivings logent 300 personnes dans des résidences. Nous accueillons 7 à 12 professionnels dans de vraies maisons avec jardin, piscine et terrasses. Les liens se créent naturellement, sans forcer."}
            </p>

            {/* Features grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#E8E5DF] hover:shadow-[0_12px_48px_rgba(27,67,50,0.12)] hover:translate-y-[-4px] transition-all duration-300"
                >
                  <feature.icon className="w-5 h-5 text-[#2D6A4F] flex-shrink-0" />
                  <span className="text-sm text-[#4A4A4A]">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
