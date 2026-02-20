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

  const serviceCategories = [
    {
      title: language === "en" ? "Live" : "Vivre",
      subtitle:
        language === "en" ? "Your daily comfort" : "Votre confort quotidien",
      color: "bg-[#44403C]",
      services: [
        {
          key: "allInclusive",
          icon: CheckCircle2,
          image:
            "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80",
          highlight: language === "en" ? "Zero hassle" : "Zero tracas",
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
      color: "bg-[#D4A574]",
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
          image: "/images/logo-whatsapp-histoire.jpg.webp",
          highlight:
            language === "en" ? "< 48h response" : "Réponse en 48h max.",
        },
      ],
    },
    {
      title: language === "en" ? "Thrive" : "S'épanouir",
      subtitle:
        language === "en" ? "Wellness & community" : "Bien-être & communauté",
      color: "bg-[#78716C]",
      services: [
        {
          key: "pool",
          icon: Waves,
          image: "/images/le loft piscine_interieur_500x200.webp",
          highlight:
            language === "en"
              ? "In all 3 houses"
              : "Dans les 3 maisons",
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
          highlight: language === "en" ? "Yoga, Pizza Party & more" : "Yoga, Pizza Party & plus",
        },
      ],
    },
  ];

  const serviceData = t.servicesPage.services;

  const stats = [
    {
      value: "20+",
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
      value: "100+",
      label: language === "en" ? "Happy residents" : "Résidents satisfaits",
      icon: Users,
    },
  ];

  return (
    <main className="relative pt-20">
      <SEO
        title={language === "en" ? "All-Inclusive Services — La Villa Coliving" : "Services Tout Inclus — La Villa Coliving"}
        description={language === "en"
          ? "Cleaning, pool, sauna, gym, yoga, fitness, events — everything included in your rent. Discover our services."
          : "Ménage, piscine, sauna, salle de sport, yoga, fitness, événements — tout est inclus dans votre loyer. Découvrez nos services."}
        url="https://www.lavillacoliving.com/services"
      />
      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/le loft piscine_interieur_500x200.webp"
            alt={language === "en" ? "Le Loft indoor pool — all-inclusive coliving services near Geneva" : "Piscine intérieure du Loft — services colocation tout inclus près de Genève"}
            className="w-full h-full object-cover" loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C1917]/90 via-[#1C1917]/70 to-transparent" />
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/12 backdrop-blur-sm border border-white/15 text-white text-[13px] font-semibold tracking-wider uppercase rounded-full mb-6">
              <Zap className="w-4 h-4 text-[#E0BB8A]" />
              {language === "en" ? "All-Inclusive Living" : "Vie Tout Inclus"}
            </span>

            <h1
              className="text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight"
            >
              {language === "en" ? (
                <>
                  We handle{" "}
                  <em className="text-[#E0BB8A] not-italic" style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic' }}>everything</em>.
                  <br />
                  You just live.
                </>
              ) : (
                <>
                  On gère{" "}
                  <em className="text-[#E0BB8A] not-italic" style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic' }}>tout</em>.
                  <br />
                  Vous vivez sans soucis.
                </>
              )}
            </h1>

            <p className="text-xl text-white/80 mb-8 max-w-lg">
              {language === "en"
                ? "From cleaning to high-speed internet, from yoga classes to community dinners — every detail is taken care of."
                : "Du ménage à la fibre haut débit, des cours de yoga aux dîners communautaires — chaque détail est pensé."}
            </p>

            <div className="flex flex-wrap gap-6">
              {stats.slice(0, 2).map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-white/[0.08] flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-[#E0BB8A]" />
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

      {/* VALUE PROPOSITION */}
      <section className="py-20 bg-[#FAF9F6]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-4 tracking-tight">
              {language === "en"
                ? "Not just services."
                : "Pas juste des services."}
              <span className="text-[#D4A574]">
                {" "}
                {language === "en" ? "A lifestyle." : "Un mode de vie."}
              </span>
            </h2>
            <p className="text-[#78716C] max-w-2xl mx-auto">
              {language === "en"
                ? "We don't just check boxes. We create an environment where you can focus on what matters."
                : "Nous ne cochons pas juste des cases. Nous créons un environnement où vous pouvez vous concentrer sur l'essentiel."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Heart,
                title:
                  language === "en"
                    ? "Designed for living"
                    : "Conçu pour vivre",
                desc:
                  language === "en"
                    ? "Every space is crafted for comfort, connection, and well-being. Not just functional — delightful."
                    : "Chaque espace est conçu pour le confort, la connexion et le bien-être. Pas juste fonctionnel — agréable.",
              },
              {
                icon: Clock,
                title:
                  language === "en" ? "Time given back" : "Du temps retrouvé",
                desc:
                  language === "en"
                    ? "No chores, no bills to manage, no maintenance headaches. Reclaim 10+ hours per week."
                    : "Pas de corvées, pas de factures à gérer, pas de tracas de maintenance. Récupérez 10+ heures par semaine.",
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
                className="bg-white rounded-2xl p-8 border border-[#E7E5E4] hover:border-[#44403C]/20 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:translate-y-[-2px] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F5F2ED] flex items-center justify-center mb-6">
                  <item.icon className="w-6 h-6 text-[#44403C]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1C1917] mb-3">
                  {item.title}
                </h3>
                <p className="text-[#78716C] leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES BY CATEGORY */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-[13px] font-semibold tracking-wider uppercase text-[#78716C] mb-4 block">
              {language === "en" ? "What's Included" : "Ce qui est inclus"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1C1917] tracking-tight">
              {language === "en"
                ? "Everything you need"
                : "Tout ce dont vous avez besoin"}
            </h2>
          </div>

          {serviceCategories.map((category, catIndex) => (
            <div key={catIndex} className="mb-20 last:mb-0">
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-12 h-1 ${category.color} rounded-full`} />
                <div>
                  <h3 className="text-2xl font-semibold text-[#1C1917]">
                    {category.title}
                  </h3>
                  <p className="text-[#78716C] text-sm">{category.subtitle}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {category.services.map((service, index) => {
                  const Icon = service.icon;
                  const data =
                    serviceData[service.key as keyof typeof serviceData];
                  return (
                    <div
                      key={index}
                      className="group relative bg-[#FAF9F6] rounded-2xl overflow-hidden border border-[#E7E5E4] hover:border-[#44403C]/20 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300"
                    >
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={service.image}
                          alt={data.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-[#1C1917]">
                          {service.highlight}
                        </div>

                        <div className="absolute bottom-4 left-4 w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                          <Icon className="w-5 h-5 text-[#44403C]" />
                        </div>
                      </div>

                      <div className="p-6">
                        <h4 className="text-base font-semibold text-[#1C1917] mb-2">
                          {data.title}
                        </h4>
                        <p className="text-[#78716C] text-sm leading-relaxed">
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
      <section className="py-16 bg-[#1C1917]">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/[0.06] mb-4">
                  <stat.icon className="w-7 h-7 text-[#D4A574]" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="py-24 bg-[#F5F2ED]">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[13px] font-semibold tracking-wider uppercase text-[#78716C] mb-4 block">
                {language === "en"
                  ? "The La Villa Difference"
                  : "La Différence La Villa"}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-6 tracking-tight">
                {language === "en" ? "Say goodbye to" : "Dites adieu aux"}{" "}
                <span className="text-[#78716C] line-through">
                  {language === "en" ? "chores" : "corvées"}
                </span>
              </h2>

              <div className="space-y-4 mb-8">
                {[
                  language === "en"
                    ? "Cleaning your kitchen"
                    : "Nettoyer la cuisine",
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
                    className="flex items-center gap-3 text-[#78716C]"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#E7E5E4] flex items-center justify-center">
                      <span className="text-[#78716C] text-xs font-bold">x</span>
                    </div>
                    <span className="line-through opacity-60">{item}</span>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-white rounded-xl border border-[#E7E5E4]">
                <p className="text-[#1C1917] font-semibold mb-2">
                  {language === "en"
                    ? "Instead, you get:"
                    : "À la place, vous avez :"}
                </p>
                <p className="text-[#78716C] text-sm">
                  {language === "en"
                    ? "More time to focus on your work, your passions, your people."
                    : "Du temps pour vous concentrer sur votre travail, vos passions, vos proches."}
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <img
                  src="/images/Le loft salon.webp"
                  alt={language === "en" ? "Le Loft modern living room — premium all-inclusive coliving near Geneva" : "Salon moderne du Loft — coliving premium tout inclus près de Genève"}
                  className="w-full h-full object-cover" loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl border border-[#E7E5E4] shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                <div className="text-4xl font-bold text-[#D4A574]">3+</div>
                <div className="text-sm text-[#78716C]">
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
      <section className="py-24 bg-[#1C1917]">
        <div className="container-custom text-center">
          <span className="text-[13px] font-semibold tracking-wider uppercase text-[#E0BB8A] mb-5 block">
            {language === "en" ? "Ready?" : "Prêt ?"}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
            {language === "en"
              ? "Ready to live lighter?"
              : "Prêt à vivre plus léger ?"}
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-8">
            {language === "en"
              ? "Join 100+ residents who've reclaimed their time. One price. Everything included."
              : "Rejoignez plus de 100 résidents qui ont récupéré leur temps. Un prix. Tout inclus."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/rates"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#D4A574] text-[#1C1917] font-semibold rounded-lg hover:bg-[#E0BB8A] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A574] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1917]"
            >
              {language === "en" ? "View Rates" : "Voir les Tarifs"}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/join-us"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-semibold rounded-lg hover:border-white hover:bg-white/5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1917]"
            >
              {language === "en" ? "Apply Now" : "Candidater"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
