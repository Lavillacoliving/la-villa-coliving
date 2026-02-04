// WhyChooseUs V7 - Lifestyle section
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * VERSION 7: JEUNE + NOMADE + ZEN + FRAIS
 * Why Choose Us style lifestyle et décontracté
 */

export function WhyChooseUsV7() {
  const { language } = useLanguage();

  const features = [
    {
      emoji: "💰",
      text:
        language === "en"
          ? "One price, zero surprises"
          : "Un prix, zéro surprise",
    },
    {
      emoji: "🧘",
      text: language === "en" ? "Zen living spaces" : "Espaces de vie zen",
    },
    {
      emoji: "🎉",
      text:
        language === "en" ? "Community events" : "Événements communautaires",
    },
    {
      emoji: "💻",
      text:
        language === "en" ? "Work-from-home friendly" : "Télétravail friendly",
    },
    {
      emoji: "🧹",
      text:
        language === "en" ? "Weekly cleaning included" : "Ménage hebdo inclus",
    },
    {
      emoji: "🌍",
      text:
        language === "en"
          ? "International community"
          : "Communauté internationale",
    },
  ];

  return (
    <section className="py-24 bg-[#faf9f5] relative overflow-hidden">
      {/* Organic shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#a8c5d9]/10 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-[0_20px60px_rgba(124,154,109,0.12)]">
              <img
                src="/images/le lodge living room.webp"
                alt="La Villa Coliving"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-2xl shadow-[0_10px40px_rgba(124,154,109,0.15)]">
              <div className="text-4xl mb-1">🚗</div>
              <div className="text-2xl font-medium text-[#7c9a6d]">20 min</div>
              <div className="text-sm text-[#7c8a72]">
                {language === "en" ? "to Geneva" : "de Genève"}
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <span className="inline-block px-4 py-2 bg-[#7c9a6d]/15 text-[#7c9a6d] text-sm font-medium rounded-full mb-6">
              ✨ {language === "en" ? "Why La Villa?" : "Pourquoi La Villa ?"}
            </span>

            <h2 className="text-4xl md:text-5xl font-light text-[#3d4a38] mb-6 leading-tight">
              {language === "en" ? "Live better," : "Vis mieux,"}
              <br />
              <span className="font-medium text-[#7c9a6d]">
                {language === "en" ? "together" : "ensemble"}
              </span>{" "}
              🌿
            </h2>

            <p className="text-[#5a6355] text-lg leading-relaxed mb-10 max-w-lg">
              {language === "en"
                ? "We're not just a place to sleep. We're a premium community of people who value freedom, connection, and good vibes."
                : "On n'est pas juste un endroit pour dormir. On est une communauté premium de gens qui valorisent la liberté, la connexion et la bonne humeur."}
            </p>

            {/* Features grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#7c9a6d]/10 hover:border-[#7c9a6d]/30 hover:shadow-sm transition-all duration-300"
                >
                  <span className="text-xl">{feature.emoji}</span>
                  <span className="text-sm text-[#5a6355]">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
