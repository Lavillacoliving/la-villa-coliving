import { useLanguage } from "@/contexts/LanguageContext";
import { Check, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function ColivingConcept() {
  const { language } = useLanguage();

  const comparisonData = {
    coliving: {
      title:
        language === "en" ? "Coliving at La Villa" : "Coliving chez La Villa",
      features: [
        language === "en"
          ? "Fully furnished & ready to move in"
          : "Entièrement meublé & prêt à emménager",
        language === "en"
          ? "All utilities included"
          : "Tous les services inclus",
        language === "en"
          ? "Curated community of like-minded people"
          : "Communauté sélectionnée de personnes partageant les mêmes valeurs",
        language === "en"
          ? "Weekly cleaning included"
          : "Ménage hebdomadaire inclus",
        language === "en"
          ? "Premium amenities (pool, gym, sauna)"
          : "Équipements premium (piscine, gym, sauna)",
        language === "en"
          ? "Instant social network"
          : "Réseau social instantané",
        language === "en"
          ? "Flexible lease terms"
          : "Conditions de bail flexibles",
        language === "en"
          ? "Professional management"
          : "Gestion professionnelle",
      ],
      image: "/ACTIVITES & ILLUSTRATIONS/colocs.jpg",
      color: "#10b981",
    },
    colocation: {
      title:
        language === "en"
          ? "Traditional Colocation"
          : "Colocation Traditionnelle",
      features: [
        language === "en"
          ? "Find and buy your own furniture"
          : "Trouver et acheter votre propre mobilier",
        language === "en"
          ? "Set up utilities yourself"
          : "Configurer les services vous-même",
        language === "en"
          ? "Find compatible roommates"
          : "Trouver des colocataires compatibles",
        language === "en"
          ? "Coordinate cleaning schedules"
          : "Coordonner les plannings de ménage",
        language === "en"
          ? "No shared amenities"
          : "Pas d'équipements partagés",
        language === "en"
          ? "Build social circle from scratch"
          : "Construire un cercle social from scratch",
        language === "en"
          ? "Long-term commitments"
          : "Engagements à long terme",
        language === "en"
          ? "Deal with landlords directly"
          : "Traiter directement avec les propriétaires",
      ],
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      color: "#94a3b8",
    },
  };

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#10b981]/5 blob rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#f97316]/5 blob-reverse rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 text-[#10b981] text-sm font-extrabold uppercase tracking-wider mb-4">
            <span className="w-8 h-1.5 bg-[#10b981] rounded-full" />
            {language === "en"
              ? "Understanding Coliving"
              : "Comprendre le Coliving"}
            <span className="w-8 h-1.5 bg-[#10b981] rounded-full" />
          </span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0f172a] mb-6"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            {language === "en"
              ? "Coliving vs Colocation"
              : "Coliving vs Colocation"}
          </h2>
          <p className="text-lg text-gray-600">
            {language === "en"
              ? "See why coliving at La Villa is the smarter choice for modern professionals"
              : "Voyez pourquoi le coliving chez La Villa est le choix le plus intelligent pour les professionnels modernes"}
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Coliving Card */}
          <div className="group relative bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-[#10b981]/20 hover:border-[#10b981] transition-all duration-500">
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={comparisonData.coliving.image}
                alt="Coliving"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10b981]/80 to-transparent" />

              {/* Badge */}
              <div className="absolute bottom-4 left-4 px-4 py-2 bg-white rounded-full text-[#10b981] font-bold text-sm flex items-center gap-2">
                <Check className="w-4 h-4" />
                {language === "en" ? "Recommended" : "Recommandé"}
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <h3 className="text-2xl font-bold text-[#0f172a] mb-6">
                {comparisonData.coliving.title}
              </h3>

              <ul className="space-y-4">
                {comparisonData.coliving.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#10b981]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-[#10b981]" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Colocation Card */}
          <div className="group relative bg-gray-50 rounded-3xl overflow-hidden shadow-lg border border-gray-200">
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={comparisonData.colocation.image}
                alt="Colocation"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />

              {/* Badge */}
              <div className="absolute bottom-4 left-4 px-4 py-2 bg-gray-200 rounded-full text-gray-600 font-bold text-sm flex items-center gap-2">
                <X className="w-4 h-4" />
                {language === "en" ? "Traditional" : "Traditionnel"}
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-500 mb-6">
                {comparisonData.colocation.title}
              </h3>

              <ul className="space-y-4">
                {comparisonData.colocation.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="w-4 h-4 text-gray-400" />
                    </div>
                    <span className="text-gray-500">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            {language === "en"
              ? "Ready to experience the La Villa difference?"
              : "Prêt à vivre la différence La Villa ?"}
          </p>
          <Link
            to="/join-us"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#10b981] text-white font-bold rounded-full hover:bg-[#059669] transition-colors shadow-lg shadow-[#10b981]/25"
          >
            {language === "en" ? "Apply Now" : "Candidater"}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
