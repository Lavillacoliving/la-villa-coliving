import { useLanguage } from "@/contexts/LanguageContext";
import {
  CheckCircle2,
  Sparkles,
  Wifi,
  Waves,
  Dumbbell,
  Tv,
  Scooter,
  Package,
  UtensilsCrossed,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export function ServicesPageV4() {
  const { t, language } = useLanguage();

  const services = [
    {
      key: "allInclusive",
      icon: CheckCircle2,
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80",
    },
    {
      key: "housekeeping",
      icon: Sparkles,
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80",
    },
    {
      key: "internet",
      icon: Wifi,
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
    },
    {
      key: "pool",
      icon: Waves,
      image: "/images/le loft piscine_interieur_500x200.webp",
    },
    {
      key: "wellness",
      icon: Dumbbell,
      image: "/images/le lodge gym_premium.webp",
    },
    {
      key: "entertainment",
      icon: Tv,
      image: "/images/le loft home_cinema.webp",
    },
    {
      key: "transport",
      icon: Scooter,
      image: "/images/piscine_banner.webp",
    },
    {
      key: "supplies",
      icon: Package,
      image:
        "https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=600&q=80",
    },
    {
      key: "community",
      icon: UtensilsCrossed,
      image: "/images/la villa event.jpg",
    },
    {
      key: "support",
      icon: MessageCircle,
      image: "/images/logo-whatsapp-histoire.jpg.webp",
    },
  ];

  const serviceData = t.servicesPage.services;

  return (
    <main className="relative pt-20">
      {/* Hero */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container-custom text-center">
          <span className="text-xs text-[#999] uppercase tracking-[0.3em] mb-4 block">
            {language === "en" ? "What We Include" : "Ce Que Nous Incluons"}
          </span>
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-light text-[#1a1a1a] mb-4"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            {t.servicesPage.hero.title}
          </h1>
          <p className="text-xl text-[#c44536] font-medium mb-6">
            {t.servicesPage.hero.subtitle}
          </p>
          <p className="text-lg text-[#666] max-w-2xl mx-auto">
            {t.servicesPage.hero.description}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 lg:py-32 bg-[#fafafa]">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-px bg-[#e5e5e5]">
            {services.map((service, index) => {
              const Icon = service.icon;
              const data = serviceData[service.key as keyof typeof serviceData];
              return (
                <div key={index} className="bg-white p-0 group">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={data.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                    {/* Icon Badge */}
                    <div className="absolute top-4 left-4 w-12 h-12 bg-white flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#c44536]" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h3 className="text-xl font-medium text-[#1a1a1a] mb-3">
                      {data.title}
                    </h3>
                    <p className="text-[#666] leading-relaxed">
                      {data.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs text-[#999] uppercase tracking-[0.3em] mb-4 block">
                {language === "en"
                  ? "Premium Amenities"
                  : "Équipements Premium"}
              </span>
              <h2
                className="text-4xl md:text-5xl font-light text-[#1a1a1a] mb-6"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                {language === "en"
                  ? "Everything You Need to Live Well"
                  : "Tout ce dont Vous Avez Besoin pour Bien Vivre"}
              </h2>
              <p className="text-lg text-[#666] leading-relaxed mb-8">
                {language === "en"
                  ? "From heated pools to professional gyms, from high-speed fiber to weekly yoga classes—we've thought of everything so you don't have to."
                  : "Des piscines chauffées aux salles de sport professionnelles, de la fibre haut débit aux cours de yoga hebdomadaires—nous avons pensé à tout."}
              </p>

              <Link
                to="/our-houses"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#1a1a1a] text-white font-bold hover:bg-[#c44536] transition-colors"
              >
                {language === "en"
                  ? "Explore Our Houses"
                  : "Découvrir Nos Maisons"}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 border border-[#e5e5e5]" />
              <div className="relative aspect-[4/3] bg-[#f5f5f5]">
                <img
                  src="/images/Le loft salon.webp"
                  alt="Premium amenities"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-[#c44536]">
        <div className="container-custom text-center">
          <h2
            className="text-3xl md:text-4xl font-light text-white mb-4"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            {language === "en"
              ? "One Price. Everything Included."
              : "Un Prix. Tout Inclus."}
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            {language === "en"
              ? "No hidden costs. No surprise bills. Just one simple monthly payment that covers everything you need."
              : "Pas de coûts cachés. Pas de factures surprises. Juste un paiement mensuel simple qui couvre tout."}
          </p>
          <Link
            to="/rates"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#c44536] font-bold hover:bg-[#1a1a1a] hover:text-white transition-colors"
          >
            {language === "en" ? "View Our Rates" : "Voir Nos Tarifs"}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
