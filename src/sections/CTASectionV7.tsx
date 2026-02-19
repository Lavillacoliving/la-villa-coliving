import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * VERSION 9: BOUTIQUE HOSPITALITY
 * CTA section — forest-deep background, gold CTA
 */

export function CTASectionV7() {
  const { language } = useLanguage();

  return (
    <section className="py-24 md:py-32 bg-[#1B4332] relative overflow-hidden">
      <div className="container-custom relative">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-[#D4B87A] text-sm font-semibold tracking-[0.08em] uppercase mb-8 block">
            {language === "en" ? "READY TO JOIN?" : "PRÊT À NOUS REJOINDRE ?"}
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl text-white mb-8 leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
            {language === "en" ? "Your next home is waiting" : "Votre prochaine maison vous attend"}
          </h2>

          <p className="text-white/70 text-lg leading-relaxed mb-12 max-w-xl mx-auto">
            {language === "en"
              ? "Over 100 residents have chosen our houses since 2021. Pool, sauna, gym, private yoga and fitness classes, pizza nights — all included in 3 human-scale houses."
              : "Plus de 100 résidents ont choisi nos maisons depuis 2021. Piscine, sauna, salle de sport, cours de yoga et fitness privés, pizza party — tout inclus dans 3 maisons à taille humaine."}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/join-us"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-[#B5914A] text-white font-semibold rounded-lg hover:bg-[#D4B87A] hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(181,145,74,0.3)] transition-all duration-300"
            >
              {language === "en" ? "Check availability" : "Voir les disponibilités"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            <Link
              to="/our-houses"
              className="inline-flex items-center gap-3 px-10 py-5 border-[1.5px] border-white/30 text-white font-semibold rounded-lg hover:border-white hover:bg-white/10 transition-all duration-300"
            >
              {language === "en" ? "Explore houses" : "Explorer les maisons"}
            </Link>
          </div>

          {/* Trust text */}
          <p className="mt-10 text-sm text-white/40">
            {language === "en"
              ? "Quick 2-minute application — no commitment"
              : "Candidature rapide en 2 minutes — sans engagement"}
          </p>
        </div>
      </div>
    </section>
  );
}
