import { useLanguage } from "@/contexts/LanguageContext";
import {
  CheckCircle2,
  Sparkles,
  Wifi,
  Waves,
  Dumbbell,
  Tv,
  Package,
  UtensilsCrossed,
  MessageCircle,
  ArrowRight,
  Star,
  Zap,
  Heart,
  Clock,
  Shield,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

export function ServicesPageV4() {
  const { t, language } = useLanguage();

  // Services organisés par catégories pour plus de clarté
  const serviceCategories = [
    {
      title: language === "en" ? "Live" : "Vivre",
      subtitle:
        language === "en" ? "Your daily comfort" : "Votre confort quotidien",
      color: "bg-[#7c9a6d]",
      services: [
        {
          key: "allInclusive",
          icon: CheckCircle2,
          image:
            "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80",
          highlight: language === "en" ? "Zero hassle" : "Zéro tracas",
        },
        {
          key: "housekeeping",
          icon: Sparkles,
          image:
            "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80",
          highlight: language === "en" ? "2x per week" : "2x par semaine",
        },
        {
          key: "supplies",
          icon: Package,
          image:
            "https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=600&q=80",
          highlight:
            language === "en" ? "Monthly delivery" : "Livraison mensuelle",
        },
      ],
    },
    {
      title: language === "en" ? "Connect" : "Connecter",
      subtitle: language === "en" ? "Stay connected" : "Restez connecté",
      color: "bg-[#a8c5d9]",
      services: [
        {
          key: "internet",
          icon: Wifi,
          image:
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
          highlight: "Fiber Pro",
        },
        {
          key: "entertainment",
          icon: Tv,
          image: "/images/le loft home_cinema.webp",
          highlight: "Netflix & more",
        },
        {
          key: "support",
          icon: MessageCircle,
          image: "/images/logo-whatsapp-histoire.webp.webp",
          highlight:
            language === "en" ? "< 48h response" : "Réponse en 48h max.",
        },
      ],
    },
    {
      title: language === "en" ? "Thrive" : "S'épanouir",
      subtitle:
        language === "en" ? "Wellness & community" : "Bien-être & communauté",
      color: "bg-[#d4897a]",
      services: [
        {
          key: "pool",
          icon: Waves,
          image: "/images/le loft piscine_interieur_500x200.webp",
          highlight:
            language === "en"
              ? "Did you say Paradise?"
              : "Vous avez dit Paradis ?",
        },
        {
          key: "wellness",
          icon: Dumbbell,
          image: "/images/le lodge gym_premium.webp",
          highlight: language === "en" ? "Sauna + Gym" : "Sauna + Sport",
        },
        {
          key: "community",
          icon: UtensilsCrossed,
          image: "/images/la villa event.webp",
          highlight: language === "en" ? "Yoga & dinners" : "Yoga & dîners",
        },
      ],
    },
  ];

  const serviceData = t.servicesPage.services;

  // Stats impactantes
  const stats = [
    {
      value: "30+",
      label: language === "en" ? "Services included" : "Services inclus",
      icon: Star,
    },
    {
      value: "0",
      label: language === "en" ? "Hidden fees" : "Frais cachés",
      icon: Shield,
    },
    {
      value: "2x",
      label: language === "en" ? "Cleaning per week" : "Ménage par semaine",
      icon: Clock,
    },
    {
      value: "50+",
      label: language === "en" ? "Happy colivers" : "Colivers heureux",
      icon: Users,
    },
  ];

  return (
    <main className="relative pt-20">
      <SEO
        title={language === "en" ? "All-Inclusive Coliving Services Near Geneva" : "Services Tout Inclus — Colocation Genève"}
        description={language === "en"
          ? "All-inclusive coliving services near Geneva: heated pool, gym, sauna, yoga, housekeeping, fiber internet, community events. Everything included from 1,380 CHF/month."
          : "Services colocation tout inclus près de Genève : piscine chauffée, gym, sauna, yoga, ménage, fibre internet, événements. Tout compris dès 1 380 CHF/mois."}
        url="https://www.lavillacoliving.com/services"
      />
      {/* HERO - Plus impactant avec visuel immersif */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* Background image avec overlay */}
        <div className="absolute inset-0">
          <img
            src="/images/le loft piscine_interieur_500x200.webp"
            alt="Services"
            className="w-full h-full object-cover" loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a]/90 via-[#1a1a1a]/70 to-transparent" />
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#c44536]/20 text-[#399b30] text-sm font-medium rounded-full mb-6 backdrop-blur-sm">
              <Zap className="w-4 h-4" />
              {language === "en" ? "All-Inclusive Living" : "Vie Tout-Inclus"}
            </span>

            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              {language === "en" ? (
                <>
                  We handle{" "}
                  <span className="font-medium text-[#7c9a6d]">everything</span>
                  .
                  <br />
                  You just{" "}
                  <span className="font-medium text-[#d4897a]">live</span>.
                </>
              ) : (
                <>
                  On gère{" "}
                  <span className="font-medium text-[#7c9a6d]">tout</span>.
                  <br />
                  Vous vivez{" "}
                  <span className="font-medium text-[#d4897a]">
                    sans soucis
                  </span>
                  .
                </>
              )}
            </h1>

            <p className="text-xl text-white/80 mb-8 max-w-lg">
              {language === "en"
                ? "From cleaning to high-speed internet, from yoga classes to community dinners—every detail is taken care of."
                : "Du ménage à la fibre haut débit, des cours de yoga aux dîners communautaires—chaque détail est pensé."}
            </p>

            {/* Stats rapides */}
            <div className="flex flex-wrap gap-6">
              {stats.slice(0, 2).map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-[#7c9a6d]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-sm text-white/60">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION - Pourquoi c'est différent */}
      <section className="py-20 bg-[#faf9f5]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-[#3d4a38] mb-4">
              {language === "en"
                ? "Not just services."
                : "Pas juste des services."}
              <span className="font-medium text-[#8c2c22]">
                {" "}
                {language === "en" ? "A lifestyle." : "Un mode de vie."}
              </span>
            </h2>
            <p className="text-[#5a6355] max-w-2xl mx-auto">
              {language === "en"
                ? "We don't just check boxes. We create an environment where you can focus on what matters."
                : "On ne coche pas juste des cases. On crée un environnement où vous pouvez vous concentrer sur l'essentiel."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title:
                  language === "en"
                    ? "Designed for living"
                    : "Conçu pour vivre",
                desc:
                  language === "en"
                    ? "Every space is crafted for comfort, connection, and well-being. Not just functional—delightful."
                    : "Chaque espace est conçu pour le confort, la connexion et le bien-être. Pas juste fonctionnel—agréable.",
              },
              {
                icon: Clock,
                title:
                  language === "en" ? "Time given back" : "Du temps retrouvé",
                desc:
                  language === "en"
                    ? "No chores, no bills to manage, no maintenance headaches. Reclaim 10+ hours per week."
                    : "Pas de corvées, pas de factures à gérer, pas de tracas de maintenance. Récupérez 10+ pour vous.",
              },
              {
                icon: Users,
                title:
                  language === "en"
                    ? "Instant community"
                    : "Communauté instantanée",
                desc:
                  language === "en"
                    ? "Move in alone, find your people. Curated events and shared spaces create natural connections."
                    : "Emménagez seul, trouvez votre tribu. Des événements sélectionnés et des espaces partagés créent des connexions naturelles.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-[0_4px20px_rgba(124,154,109,0.08)] border border-[#7c9a6d]/10 hover:shadow-[0_8px30px_rgba(124,154,109,0.12)] transition-shadow"
              >
                <div className="w-14 h-14 rounded-xl bg-[#7c9a6d]/10 flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-[#7c9a6d]" />
                </div>
                <h3 className="text-xl font-medium text-[#3d4a38] mb-3">
                  {item.title}
                </h3>
                <p className="text-[#5a6355] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES BY CATEGORY - Organisation plus claire */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-xs text-[#999] uppercase tracking-[0.3em] mb-4 block">
              {language === "en" ? "What's Included" : "Ce Qui Est Inclus"}
            </span>
            <h2
              className="text-4xl md:text-5xl font-light text-[#1a1a1a] mb-6"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              {language === "en"
                ? "Everything You Need"
                : "Tout ce dont Vous Avez Besoin"}
            </h2>
          </div>

          {serviceCategories.map((category, catIndex) => (
            <div key={catIndex} className="mb-20 last:mb-0">
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-12 h-1 ${category.color}`} />
                <div>
                  <h3 className="text-2xl font-medium text-[#1a1a1a]">
                    {category.title}
                  </h3>
                  <p className="text-[#999] text-sm">{category.subtitle}</p>
                </div>
              </div>

              {/* Services Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {category.services.map((service, index) => {
                  const Icon = service.icon;
                  const data =
                    serviceData[service.key as keyof typeof serviceData];
                  return (
                    <div
                      key={index}
                      className="group relative bg-[#fafafa] rounded-2xl overflow-hidden hover:shadow-[0_10px40px_rgba(0,0,0,0.1)] transition-all duration-300"
                    >
                      {/* Image */}
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={service.image}
                          alt={data.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                        {/* Badge highlight */}
                        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-[#1a1a1a]">
                          {service.highlight}
                        </div>

                        {/* Icon */}
                        <div className="absolute bottom-4 left-4 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                          <Icon className="w-6 h-6 text-[#8c2c22]" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h4 className="text-lg font-medium text-[#1a1a1a] mb-2">
                          {data.title}
                        </h4>
                        <p className="text-[#666] text-sm leading-relaxed">
                          {data.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS BAR */}
      <section className="py-16 bg-[#1a1a1a]">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#c44536]/20 mb-4">
                  <stat.icon className="w-8 h-8 text-[#c44536]" />
                </div>
                <div className="text-4xl font-light text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON SILENCIEUSE - Ce que vous n'avez PAS à faire */}
      <section className="py-24 bg-[#faf9f5]">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs text-[#999] uppercase tracking-[0.3em] mb-4 block">
                {language === "en"
                  ? "The La Villa Difference"
                  : "La Différence La Villa"}
              </span>
              <h2
                className="text-4xl md:text-5xl font-light text-[#3d4a38] mb-6"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                {language === "en" ? "Say goodbye to" : "Dites adieu aux"}{" "}
                <span className="font-medium text-[#8c2c22] line-through">
                  {language === "en" ? "chores" : "corvées"}
                </span>
              </h2>

              <div className="space-y-4 mb-8">
                {[
                  language === "en"
                    ? "Cleaning your kitchen"
                    : "Nettoyer votre cuisine",
                  language === "en"
                    ? "Managing utility bills"
                    : "Gérer les factures",
                  language === "en"
                    ? "Buying toilet paper"
                    : "Acheter du papier toilette",
                  language === "en"
                    ? "Fixing the broken heater"
                    : "Réparer le chauffage",
                  language === "en"
                    ? "Finding a gym"
                    : "Trouver une salle de sport",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-[#5a6355]"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#c44536]/10 flex items-center justify-center">
                      <span className="text-[#8c2c22] text-xs">✕</span>
                    </div>
                    <span className="line-through opacity-60">{item}</span>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-[#7c9a6d]/10 rounded-xl border border-[#7c9a6d]/20">
                <p className="text-[#3d4a38] font-medium mb-2">
                  {language === "en"
                    ? "Instead, you get:"
                    : "À la place, vous avez :"}
                </p>
                <p className="text-[#5a6355]">
                  {language === "en"
                    ? "More time to focus on your work, your passions, your people."
                    : "Du temps pour vous concentrer sur votre travail, vos passions, vos proches."}
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_20px60px_rgba(0,0,0,0.15)]">
                <img
                  src="/images/Le loft salon.webp"
                  alt="Premium living"
                  className="w-full h-full object-cover" loading="lazy"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-[0_10px40px_rgba(0,0,0,0.1)]">
                <div className="text-4xl font-bold text-[#c44536]">3+</div>
                <div className="text-sm text-[#666]">
                  {language === "en" ? "hours saved" : "heures gagnées"}
                  <br />
                  {language === "en" ? "per week" : "par semaine"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 bg-[#c44536] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_white_1px,_transparent_1px)] bg-[length:20px_20px]" />
        </div>

        <div className="container-custom relative z-10 text-center">
          <h2
            className="text-4xl md:text-5xl font-light text-white mb-6"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            {language === "en"
              ? "Ready to live lighter?"
              : "Prêt à vivre plus léger?"}
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            {language === "en"
              ? "Join 50+ colivers who've reclaimed their time. One price. Everything included."
              : "Rejoignez 50+ colivers qui ont récupéré leur temps. Un prix. Tout inclus."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/rates"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#c44536] font-bold hover:bg-[#1a1a1a] hover:text-white transition-colors"
            >
              {language === "en" ? "View Rates" : "Voir les Tarifs"}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/join-us"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white font-bold hover:bg-white hover:text-[#c44536] transition-colors"
            >
              {language === "en" ? "Apply Now" : "Postuler"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
