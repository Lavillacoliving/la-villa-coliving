import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { STATS } from "@/data/stats";

/**
 * VERSION 7: PREMIUM + FACTUEL
 * CTA section — vouvoiement, USPs, plus d'emojis
 */

export function CTASectionV7() {
  const { language } = useLanguage();

  return (
    <section className="py-24 bg-[#f5f2ed] relative overflow-hidden">
      {/* Organic shapes */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7c9a6d]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#d4897a]/10 rounded-full blur-3xl" />

      <div className="container-custom relative">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block px-4 py-2 bg-white text-[#7c9a6d] text-sm font-medium rounded-full mb-8">
            {language === "en"
              ? "Ready to join us?"
              : "Prêt à nous rejoindre ?"}
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#3d4a38] mb-8 leading-tight">
            {language === "en" ? "Your next home" : "Votre prochaine maison"}
            <br />
            <span className="font-medium text-[#7c9a6d]">
              {language === "en" ? "is waiting" : "vous attend"}
            </span>
          </h2>

          <p className="text-[#5a6355] text-lg leading-relaxed mb-12 max-w-xl mx-auto">
            {language === "en"
              ? `Over ${STATS.totalResidents} residents have trusted us since ${STATS.foundedYear}. Pool, sauna, gym, private classes — everything is included.`
              : `Plus de ${STATS.totalResidents} résidents nous ont fait confiance depuis ${STATS.foundedYear}. Piscine, sauna, salle de sport, cours privés — tout est inclus.`}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/join-us"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-[#7c9a6d] text-white font-medium rounded-full hover:bg-[#6b8560] transition-all duration-300 hover:shadow-[0_8px30px_rgba(124,154,109,0.4)]"
            >
              {language === "en" ? "Check availability" : "Voir les disponibilités"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            <Link
              to="/our-houses"
              className="inline-flex items-center gap-3 px-10 py-5 border-2 border-[#3d4a38] text-[#3d4a38] font-medium rounded-full hover:bg-[#3d4a38] hover:text-white transition-all duration-300"
            >
              {language === "en" ? "Explore houses" : "Explorer les maisons"}
            </Link>
          </div>

          {/* Trust text */}
          <p className="mt-10 text-sm text-[#7c8a72]">
            {language === "en"
              ? "Quick application, no commitment."
              : "Candidature rapide et sans engagement."}
          </p>
        </div>
      </div>
    </section>
  );
}
