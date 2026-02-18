import { useLanguage } from "@/contexts/LanguageContext";
import { Users, Zap, Heart, Check, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

export function ColivingPageV4() {
  const { t, language } = useLanguage();

  const values = [
    {
      icon: Users,
      title: t.colivingPage.values.value1.title,
      description: t.colivingPage.values.value1.description,
    },
    {
      icon: Zap,
      title: t.colivingPage.values.value2.title,
      description: t.colivingPage.values.value2.description,
    },
    {
      icon: Heart,
      title: t.colivingPage.values.value3.title,
      description: t.colivingPage.values.value3.description,
    },
  ];

  const benefits = [
    t.colivingPage.benefits.benefit1,
    t.colivingPage.benefits.benefit2,
    t.colivingPage.benefits.benefit3,
    t.colivingPage.benefits.benefit4,
    t.colivingPage.benefits.benefit5,
    t.colivingPage.benefits.benefit6,
    t.colivingPage.benefits.benefit7,
    t.colivingPage.benefits.benefit8,
  ];

  const profiles = [
    t.colivingPage.whoIsItFor.profile1,
    t.colivingPage.whoIsItFor.profile2,
    t.colivingPage.whoIsItFor.profile3,
    t.colivingPage.whoIsItFor.profile4,
    t.colivingPage.whoIsItFor.profile5,
  ];

  return (
    <main className="relative pt-20">
      <SEO
        title={language === "en" ? "The Coliving Experience Near Geneva" : "Coliving & Colocation près de Genève — L'Expérience La Villa"}
        description={language === "en"
          ? "Discover premium coliving near Geneva. Furnished rooms, curated community, heated pool, gym & all-inclusive services. The modern alternative to traditional shared housing."
          : "Découvre le coliving premium près de Genève. Chambres meublées, communauté sélectionnée, piscine chauffée, gym et services tout inclus. L'alternative moderne à la colocation traditionnelle."}
        url="https://www.lavillacoliving.com/the-coliving"
      />
      {/* Hero avec image de fond */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        {/* Image de fond */}
        <div className="absolute inset-0">
          <img
            src="/images/la villa jardin.webp"
            alt={language === "en" ? "La Villa Coliving — premium coliving house with garden and pool near Geneva" : "La Villa Coliving — maison de colocation premium avec jardin et piscine près de Genève"}
            className="w-full h-full object-cover" loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Contenu par-dessus */}
        <div className="container-custom relative z-10">
          <div className="max-w-4xl">
            {/* Tout le contenu en blanc explicitement */}
            <span className="text-xs uppercase tracking-[0.3em] mb-6 block text-white">
              {t.hero.subtitle}
            </span>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-light mb-8 text-white"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              {t.hero.title}
            </h1>
            <p className="text-xl mb-8 text-white/90">
              {language === "en"
                ? "Experience premium coliving in our beautifully designed houses"
                : "Vis l'expérience coliving dans nos maisons magnifiquement designées"}
            </p>
            <Link
              to="/our-houses"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1a1a1a] font-bold hover:bg-[#c44536] hover:text-white transition-colors"
            >
              {language === "en"
                ? "Explore Our Houses"
                : "Découvrir Nos Maisons"}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* PHOTO 1 : What is Coliving - ESPACE COMMUN */}
      <section className="py-24 lg:py-32 bg-[#fafafa]">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs text-[#999] uppercase tracking-[0.3em] mb-4 block">
                {language === "en" ? "The Concept" : "Le Concept"}
              </span>
              <h2
                className="text-4xl md:text-5xl font-light text-[#1a1a1a] mb-6"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                {t.colivingPage.whatIs.title}
              </h2>
              <p className="text-lg text-[#666] leading-relaxed mb-4">
                {t.colivingPage.whatIs.description}
              </p>
              <p className="text-lg text-[#666] leading-relaxed">
                {t.colivingPage.whatIs.description2}
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 border border-[#e5e5e5]" />
              <div className="relative aspect-[4/3] bg-[#f5f5f5]">
                {/* PHOTO 1 : ESPACE COMMUN LUMINEUX */}
                <img
                  src="/images/la-villa-salon.webp"
                  alt={language === "en" ? "Bright common space at La Villa — open kitchen and living room in coliving near Geneva" : "Espace commun lumineux de La Villa — salon et cuisine ouverte en colocation près de Genève"}
                  className="w-full h-full object-cover" loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coliving vs Colocation */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute -inset-4 border border-[#e5e5e5]" />
              <div className="relative aspect-[4/3] bg-[#f5f5f5]">
                <img
                  src="/images/le loft glamour.webp"
                  alt={language === "en" ? "Le Loft — modern coliving interior design near Geneva" : "Le Loft — intérieur design de colocation moderne près de Genève"}
                  className="w-full h-full object-cover" loading="lazy"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-xs text-[#999] uppercase tracking-[0.3em] mb-4 block">
                {language === "en"
                  ? "Understanding the Difference"
                  : "Comprendre la Différence"}
              </span>
              <h2
                className="text-4xl md:text-5xl font-light text-[#1a1a1a] mb-6"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                {t.colivingPage.notColocation.title}
              </h2>
              <p className="text-lg text-[#666] leading-relaxed mb-4">
                {t.colivingPage.notColocation.description}
              </p>
              <p className="text-lg text-[#666] leading-relaxed">
                {t.colivingPage.notColocation.description2}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* La Villa Difference */}
      <section className="py-24 lg:py-32 bg-[#fafafa]">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs text-[#999] uppercase tracking-[0.3em] mb-4 block">
              {language === "en"
                ? "What Makes Us Different"
                : "Ce Qui Nous Différencie"}
            </span>
            <h2
              className="text-4xl md:text-5xl font-light text-[#1a1a1a] mb-6"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              {t.colivingPage.difference.title}
            </h2>
            <p className="text-lg text-[#666] leading-relaxed">
              {t.colivingPage.difference.description}
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-3 gap-px bg-[#e5e5e5]">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white p-10 text-center">
                  <div className="w-16 h-16 border border-[#e5e5e5] flex items-center justify-center mx-auto mb-6">
                    <Icon size={28} className="text-[#c44536]" />
                  </div>
                  <h3 className="text-xl font-medium text-[#1a1a1a] mb-3">
                    {value.title}
                  </h3>
                  <p className="text-[#666]">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs text-[#999] uppercase tracking-[0.3em] mb-4 block">
                {language === "en" ? "Why Choose Us" : "Pourquoi Nous Choisir"}
              </span>
              <h2
                className="text-4xl md:text-5xl font-light text-[#1a1a1a] mb-8"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                {t.colivingPage.benefits.title}
              </h2>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-6 h-6 border border-[#c44536] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-[#c44536]" />
                    </div>
                    <span className="text-[#666]">{benefit}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/our-houses"
                className="inline-flex items-center gap-2 mt-10 px-8 py-4 bg-[#1a1a1a] text-white font-bold hover:bg-[#c44536] transition-colors"
              >
                {language === "en"
                  ? "Explore Our Houses"
                  : "Explorer Nos Maisons"}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 border border-[#e5e5e5]" />
              <div className="relative aspect-[4/3] bg-[#f5f5f5]">
                <img
                  src="/images/la villa yoga.webp"
                  alt={language === "en" ? "Yoga class at La Villa Coliving — weekly wellness included in colocation near Geneva" : "Cours de yoga à La Villa Coliving — bien-être hebdomadaire inclus en colocation près de Genève"}
                  className="w-full h-full object-cover" loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PHOTO 2 : Section Communauté - ESPACE VIE */}
      <section className="py-24 lg:py-32 bg-[#f5f5f5]">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Photo d'ambiance */}
            <div className="relative">
              <div className="absolute -inset-4 border border-[#e5e5e5]" />
              <div className="relative aspect-[4/3]">
                <img
                  src="/images/espace-commun.webp"
                  alt={language === "en" ? "Shared living space at La Villa — friendly community atmosphere in coliving near Geneva" : "Espace de vie partagé à La Villa — ambiance communautaire conviviale en coliving près de Genève"}
                  className="w-full h-full object-cover" loading="lazy"
                />
              </div>
            </div>

            {/* Texte */}
            <div>
              <span className="text-xs text-[#999] uppercase tracking-[0.3em] mb-4 block">
                {language === "en" ? "Real Connections" : "Vraies Connexions"}
              </span>
              <h2
                className="text-4xl md:text-5xl font-light text-[#1a1a1a] mb-6"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                {language === "en"
                  ? "More Than Roommates"
                  : "Plus Que Des Colocataires"}
              </h2>
              <p className="text-lg text-[#666] leading-relaxed mb-6">
                {language === "en"
                  ? "At La Villa, our residents become family. Shared dinners, yoga mornings, ski weekends—our community creates bonds that last far beyond your stay."
                  : "Chez La Villa, nos résidents deviennent famille. Dîners partagés, yoga matinal, weekends au ski—notre communauté crée des liens qui durent bien au-delà de ton séjour."}
              </p>

              {/* Stats au lieu de portraits */}
              <div className="flex items-center gap-8 mb-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#c44536]" />
                  <span className="text-sm text-[#666]">
                    {language === "en"
                      ? "50+ happy residents"
                      : "50+ résidents heureux"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#c44536]" />
                  <span className="text-sm text-[#666]">
                    {language === "en" ? "4.9/5 rating" : "Note 4.9/5"}
                  </span>
                </div>
              </div>

              <Link
                to="/join-us"
                className="inline-flex items-center gap-2 text-[#c44536] font-bold hover:text-[#1a1a1a] transition-colors"
              >
                {language === "en"
                  ? "Join our community"
                  : "Rejoindre notre communauté"}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Who Is It For */}
      <section className="py-24 lg:py-32 bg-[#fafafa]">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute -inset-4 border border-[#e5e5e5]" />
              <div className="relative aspect-[4/3] bg-[#f5f5f5]">
                <img
                  src="/images/le lodge.webp"
                  alt={language === "en" ? "Le Lodge — coliving community for expats and cross-border workers near Geneva" : "Le Lodge — communauté coliving pour expats et frontaliers près de Genève"}
                  className="w-full h-full object-cover" loading="lazy"
                />
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="text-xs text-[#999] uppercase tracking-[0.3em] mb-4 block">
                {language === "en" ? "For You?" : "Pour Toi ?"}
              </span>
              <h2
                className="text-4xl md:text-5xl font-light text-[#1a1a1a] mb-6"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                {t.colivingPage.whoIsItFor.title}
              </h2>
              <p className="text-lg text-[#666] leading-relaxed mb-8">
                {t.colivingPage.whoIsItFor.description}
              </p>

              <div className="space-y-4">
                {profiles.map((profile, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-8 h-8 border border-[#c44536] flex items-center justify-center flex-shrink-0">
                      <Star className="w-4 h-4 text-[#c44536]" />
                    </div>
                    <span className="text-[#1a1a1a]">{profile}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/join-us"
                className="inline-flex items-center gap-2 mt-10 px-8 py-4 bg-[#c44536] text-white font-bold hover:bg-[#1a1a1a] transition-colors"
              >
                {language === "en" ? "Apply Now" : "Candidater"}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="py-24 bg-[#1a1a1a]">
        <div className="container-custom text-center">
          <p
            className="text-2xl md:text-3xl font-light text-white max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            {language === "en" ? (
              <>
                "La Villa isn't just a place to live—it's a{" "}
                <span className="text-[#c44536] font-medium">community</span>{" "}
                that becomes{" "}
                <span className="text-[#c44536] font-medium">family</span>."
              </>
            ) : (
              <>
                "La Villa n'est pas qu'un lieu de vie—c'est une{" "}
                <span className="text-[#c44536] font-medium">communauté</span>{" "}
                qui devient{" "}
                <span className="text-[#c44536] font-medium">famille</span>."
              </>
            )}
          </p>
        </div>
      </section>
    </main>
  );
}
