import { useLanguage } from "@/contexts/LanguageContext";
import { Check, ArrowRight, Home, Sparkles, X, Star, Droplets } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

export function RatesPageV4() {
  const { language } = useLanguage();

  const includedItems = [
    language === "en"
      ? "Rent & utilities (electricity, water, heating)"
      : "Loyer & charges (électricité, eau, chauffage)",
    language === "en"
      ? "High-speed Pro fiber internet"
      : "Internet fibre Pro haut débit",
    language === "en" ? "Weekly housekeeping" : "Ménage hebdomadaire",
    language === "en"
      ? "Pool & garden maintenance"
      : "Entretien piscine & jardin",
    language === "en"
      ? "Gym, sauna & wellness area"
      : "Salle de sport, sauna & espace bien-être",
    language === "en"
      ? "Weekly yoga & fitness classes"
      : "Cours de yoga & fitness hebdomadaires",
    language === "en" ? "Streaming subscriptions" : "Abonnements streaming",
    language === "en" ? "Community events" : "Événements communautaires",
    language === "en"
      ? "Monthly essentials delivery"
      : "Livraison essentiels mensuels",
    language === "en" ? "WhatsApp support" : "Support WhatsApp",
  ];

  // Detailed services data
  const detailedServices = [
    {
      category: language === "en" ? "Water & Energy" : "Eau & Énergie",
      icon: "water",
      items:
        language === "en"
          ? [
              "Electricity, heating & hot water",
              "Water for common areas & garden maintenance",
              "Pool water treatment & maintenance",
              "All repairs & technical interventions",
              "Boiler maintenance & servicing",
            ]
          : [
              "Électricité, chauffage & eau chaude",
              "Eau pour entretien parties communes & jardin",
              "Traitement & maintenance eau piscine",
              "Toutes réparations & interventions techniques",
              "Entretien chaudière & maintenance",
            ],
    },
    {
      category:
        language === "en" ? "Cleaning & Maintenance" : "Ménage & Entretien",
      icon: "clean",
      items:
        language === "en"
          ? [
              "Common areas cleaned 2x per week",
              "Room cleaning available as option",
              "Pool & garden maintenance",
              "Basic supplies delivered monthly",
              "Waste management & recycling",
            ]
          : [
              "Parties communes nettoyées 2x par semaine",
              "Ménage chambre disponible en option",
              "Entretien piscine & jardin",
              "Fournitures de base livrées mensuellement",
              "Gestion des déchets & recyclage",
            ],
    },
    {
      category:
        language === "en" ? "Community & Wellness" : "Communauté & Bien-être",
      icon: "wellness",
      items:
        language === "en"
          ? [
              "Yoga classes included",
              "Fitness coaching sessions",
              "Community dinners & events",
              "Monthly community box delivery",
              "WhatsApp support < 48h response",
            ]
          : [
              "Cours de yoga inclus",
              "Séances de coaching sportif",
              "Dîners communautaires & événements",
              "Box communautaire livrée mensuellement",
              "Support WhatsApp",
            ],
    },
    {
      category: language === "en" ? "Subscriptions" : "Abonnements",
      icon: "subscriptions",
      items:
        language === "en"
          ? [
              "High-speed fiber internet",
              "Netflix & streaming services",
              "Home insurance guidance",
              "No agency fees",
              "No hidden charges",
            ]
          : [
              "Internet fibre haut débit",
              "Netflix & services streaming",
              "Assistance assurance habitation",
              "Sans frais d'agence",
              "Sans charges cachées",
            ],
    },
    {
      category: language === "en" ? "Taxes & Fees" : "Taxes & Frais",
      icon: "taxes",
      items:
        language === "en"
          ? [
              "Garbage collection tax",
              "Street cleaning tax",
              "Sewage & sanitation charges",
              "Property management included",
              "Move-in/move-out support",
            ]
          : [
              "Taxe enlèvement ordures ménagères",
              "Taxe de balayage",
              "Redevance assainissement",
              "Gestion immobilière incluse",
              "Accompagnement entrée/sortie",
            ],
    },
  ];

  // Houses data with images
  const houses = [
    {
      name: "La Villa",
      location: "Ville-la-Grand",
      image: "/images/villa_portrait.webp",
      alt: language === "en"
        ? "La Villa coliving Ville-la-Grand — all-inclusive furnished rooms from 1,380 CHF near Geneva"
        : "La Villa coliving Ville-la-Grand — chambres meublées tout inclus dès 1 380 CHF près de Genève",
      description:
        language === "en"
          ? "Elegant villa with pool & garden"
          : "Villa élégante avec piscine & jardin",
    },
    {
      name: "Le Loft",
      location: "Ambilly",
      image: "/images/le loft jardin.webp",
      alt: language === "en"
        ? "Le Loft coliving Ambilly — all-inclusive furnished rooms from 1,380 CHF near Geneva"
        : "Le Loft coliving Ambilly — chambres meublées tout inclus dès 1 380 CHF près de Genève",
      description:
        language === "en"
          ? "Modern loft with big rooms"
          : "Loft moderne avec grandes chambres",
    },
    {
      name: "Le Lodge",
      location: "Annemasse",
      image: "/images/le lodge piscine.webp",
      alt: language === "en"
        ? "Le Lodge coliving Annemasse — all-inclusive furnished rooms from 1,380 CHF near Geneva"
        : "Le Lodge coliving Annemasse — chambres meublées tout inclus dès 1 380 CHF près de Genève",
      description:
        language === "en"
          ? "Pool house, full fitness chalet with sauna, Jacuzzi® & arcade"
          : "Pool house, chalet fitness complet avec sauna, Jacuzzi® et jeu d'arcade",
    },
  ];

  // Comparison data
  const genevaTotal = 2045;
  const lavillaPrice = 1380;
  const monthlySavings = genevaTotal - lavillaPrice;
  const yearlySavings = monthlySavings * 12;

  return (
    <main className="relative pt-20">
      <SEO
        title={language === "en" ? "Rates — All-Inclusive Coliving from 1,380 CHF/month" : "Tarifs Colocation Genève — Tout Inclus dès 1 380 CHF/mois"}
        description={language === "en"
          ? "Transparent all-inclusive coliving pricing near Geneva from 1,380 CHF/month. Rent, utilities, gym, pool, sauna, yoga, internet, cleaning — everything included. Compare with Geneva studios."
          : "Tarifs colocation tout inclus près de Genève dès 1 380 CHF/mois. Loyer, charges, gym, piscine, sauna, yoga, internet, ménage — tout compris. Comparez avec les studios à Genève."}
        url="https://www.lavillacoliving.com/rates"
      />
      {/* Hero */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container-custom text-center">
          <span className="text-xs text-[#78716C] uppercase tracking-[0.3em] mb-4 block">
            {language === "en" ? "Pricing" : "Tarification"}
          </span>
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-light text-[#1C1917] mb-6"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en" ? (
              <>
                Transparent <span className="text-[#D4A574]">Pricing</span>
              </>
            ) : (
              <>
                Tarifs <span className="text-[#D4A574]">Transparents</span>
              </>
            )}
          </h1>
          <p className="text-xl text-[#57534E] max-w-2xl mx-auto mb-4">
            {language === "en"
              ? "From 1,380 CHF/month — All inclusive"
              : "À partir de 1 380 CHF/mois — Tout inclus"}
          </p>
          <p className="text-lg text-[#78716C]">
            {language === "en"
              ? "No hidden fees. No surprises. Just exceptional value."
              : "Pas de frais cachés. Pas de surprises. Juste une valeur exceptionnelle."}
          </p>
        </div>
      </section>

      {/* COMPARISON SECTION - Geneva vs La Villa */}
      <section className="py-20 bg-[#1C1917]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4A574]/20 text-[#E0BB8A] text-sm font-medium rounded-full mb-4">
              <Star className="w-4 h-4" />{" "}
              {language === "en"
                ? "Real Cost Comparison"
                : "Comparaison Réelle des Coûts"}
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
              {language === "en"
                ? "Geneva Studio vs La Villa"
                : "Studio Genève vs La Villa"}
            </h2>
            <p className="text-[#78716C] max-w-2xl mx-auto">
              {language === "en"
                ? "See how much you actually save with our all-inclusive model"
                : "Découvrez combien vous économisez réellement avec notre modèle tout-inclus"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Geneva Studio */}
            <div className="bg-[#930202a5] rounded-2xl p-8 border border-[#333]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#666]/20 flex items-center justify-center">
                  <Home className="w-6 h-6 text-[#b3b2b2]" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">
                    {language === "en" ? "Geneva Studio" : "Studio Genève"}
                  </h3>
                  <p className="text-sm text-[#b3b2b2]">
                    {language === "en"
                      ? "Traditional rental"
                      : "Location traditionnelle"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-white">
                  <span>
                    {language === "en"
                      ? "Base rent (small studio)"
                      : "Loyer de base (petit studio)"}
                  </span>
                  <span className="font-medium">1 400 CHF</span>
                </div>
                <div className="flex justify-between text-[#b3b2b2]">
                  <span className="flex items-center gap-2">
                    <X className="w-3 h-3" />{" "}
                    {language === "en" ? "Electricity" : "Électricité"}
                  </span>
                  <span>+ 80 CHF</span>
                </div>
                <div className="flex justify-between text-[#b3b2b2]">
                  <span className="flex items-center gap-2">
                    <X className="w-3 h-3" />{" "}
                    {language === "en" ? "Heating" : "Chauffage"}
                  </span>
                  <span>+ 100 CHF</span>
                </div>
                <div className="flex justify-between text-[#b3b2b2]">
                  <span className="flex items-center gap-2">
                    <X className="w-3 h-3" />{" "}
                    {language === "en" ? "Water" : "Eau"}
                  </span>
                  <span>+ 40 CHF</span>
                </div>
                <div className="flex justify-between text-[#b3b2b2]">
                  <span className="flex items-center gap-2">
                    <X className="w-3 h-3" /> Internet
                  </span>
                  <span>+ 60 CHF</span>
                </div>
                <div className="flex justify-between text-[#b3b2b2]">
                  <span className="flex items-center gap-2">
                    <X className="w-3 h-3" />{" "}
                    {language === "en" ? "Cleaning service" : "Service ménage"}
                  </span>
                  <span>+ 200 CHF</span>
                </div>
                <div className="flex justify-between text-[#b3b2b2]">
                  <span className="flex items-center gap-2">
                    <X className="w-3 h-3" />{" "}
                    {language === "en" ? "Gym membership" : "Abonnement gym"}
                  </span>
                  <span>+ 100 CHF</span>
                </div>
                <div className="flex justify-between text-[#b3b2b2]">
                  <span className="flex items-center gap-2">
                    <X className="w-3 h-3" />{" "}
                    {language === "en"
                      ? "Streaming services"
                      : "Services streaming"}
                  </span>
                  <span>+ 25 CHF</span>
                </div>
                <div className="flex justify-between text-[#b3b2b2]">
                  <span className="flex items-center gap-2">
                    <X className="w-3 h-3" />{" "}
                    {language === "en" ? "Taxes & fees" : "Taxes & frais"}
                  </span>
                  <span>+ 40 CHF</span>
                </div>
              </div>

              <div className="border-t border-[#333] pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#d5d5d5]">
                    {language === "en" ? "Total monthly" : "Total mensuel"}
                  </span>
                  <span className="text-2xl font-medium text-[#d5d5d5]">
                    2 045 CHF
                  </span>
                </div>
              </div>
            </div>

            {/* La Villa */}
            <div className="bg-[#1C1917] rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-[#D4A574] text-[#1C1917] text-xs font-bold px-3 py-1 rounded-full">
                {language === "en"
                  ? "SAVE 665 CHF/MO"
                  : "ÉCONOMISEZ 665 CHF/MOIS"}
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">
                    La Villa Coliving
                  </h3>
                  <p className="text-base text-white/80">
                    {language === "en" ? "All-inclusive" : "Tout-inclus"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-white font-medium text-base">
                  <span>
                    {language === "en"
                      ? "Your room (furnished)"
                      : "Votre chambre (meublée)"}
                  </span>
                  <span>1 380 CHF</span>
                </div>
                <div className="flex justify-between text-white/90">
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D4A574]" />{" "}
                    {language === "en"
                      ? "All utilities included"
                      : "Toutes charges incluses"}
                  </span>
                  <span className="text-[#E0BB8A] font-bold">
                    {language === "en" ? "INCLUDED" : "INCLUS"}
                  </span>
                </div>
                <div className="flex justify-between text-white/90">
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D4A574]" />{" "}
                    {language === "en"
                      ? "Yoga & fitness classes"
                      : "Cours yoga & fitness"}
                  </span>
                  <span className="text-[#E0BB8A] font-bold">
                    {language === "en" ? "INCLUDED" : "INCLUS"}
                  </span>
                </div>
                <div className="flex justify-between text-white/90">
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D4A574]" />{" "}
                    {language === "en"
                      ? "Pool, sauna & gym"
                      : "Piscine, sauna & sport"}
                  </span>
                  <span className="text-[#E0BB8A] font-bold">
                    {language === "en" ? "INCLUDED" : "INCLUS"}
                  </span>
                </div>
                <div className="flex justify-between text-white/90">
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D4A574]" />{" "}
                    {language === "en"
                      ? "Community events"
                      : "Événements communautaires"}
                  </span>
                  <span className="text-[#E0BB8A] font-bold">
                    {language === "en" ? "INCLUDED" : "INCLUS"}
                  </span>
                </div>
                <div className="flex justify-between text-white/90">
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D4A574]" />{" "}
                    {language === "en"
                      ? "Cleaning 2x/week"
                      : "Ménage 2x/semaine"}
                  </span>
                  <span className="text-[#E0BB8A] font-bold">
                    {language === "en" ? "INCLUDED" : "INCLUS"}
                  </span>
                </div>
                <div className="flex justify-between text-white/90">
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#D4A574]" /> Internet & streaming
                  </span>
                  <span className="text-[#E0BB8A] font-bold">
                    {language === "en" ? "INCLUDED" : "INCLUS"}
                  </span>
                </div>
              </div>

              <div className="border-t border-white/20 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">
                    {language === "en" ? "Total monthly" : "Total mensuel"}
                  </span>
                  <span className="text-3xl font-bold text-white">
                    1 380 CHF
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Savings Banner */}
          <div className="mt-12 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-[#D4A574] text-white px-8 py-6 rounded-2xl shadow-[0_10px_40px_rgba(212,165,116,0.3)]">
              <Star className="w-8 h-8 text-white" />
              <div className="text-center sm:text-left">
                <div className="text-sm opacity-90">
                  {language === "en"
                    ? "You save every month"
                    : "Vous économisez chaque mois"}
                </div>
                <div className="text-3xl font-bold">{monthlySavings} CHF</div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-white/20"></div>
              <div className="text-center sm:text-left">
                <div className="text-sm opacity-90">
                  {language === "en" ? "That's per year" : "Soit par an"}
                </div>
                <div className="text-2xl font-bold">
                  {yearlySavings.toLocaleString()} CHF
                </div>
              </div>
              <Star className="w-8 h-8 text-[#D4A574]" />
            </div>
            <p className="text-[#57534E] mt-4 text-sm">
              {language === "en"
                ? "+ An instant community, premium amenities & zero hassle!"
                : "+ Une communauté instantanée, équipements premium & zéro tracas !"}
            </p>
            <a
              href="https://wa.me/33664315134"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-white/50 hover:text-[#E0BB8A] transition-colors duration-300"
            >
              {language === "en"
                ? "Or ask us a question directly on WhatsApp →"
                : "Ou posez-nous directement une question sur WhatsApp →"}
            </a>
          </div>
        </div>
      </section>

      {/* Price Cards WITH IMAGES */}
      <section className="py-24 lg:py-32 bg-[#FAF9F6]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-[#1C1917] mb-4">
              {language === "en" ? "Our Houses" : "Nos Maisons"}
            </h2>
            <p className="text-[#57534E]">
              {language === "en"
                ? "Same premium experience, three unique locations"
                : "Même expérience premium, trois lieux uniques"}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {houses.map((house, index) => (
              <div
                key={index}
                className="bg-white border border-[#E7E5E4] overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={house.image}
                    alt={house.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-2xl font-medium mb-1 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      {house.name}
                    </h3>
                    <p className="text-sm text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      {house.location}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <p className="text-[#57534E] text-sm mb-6">
                    {house.description}
                  </p>

                  <div className="mb-8">
                    <span className="text-4xl font-light text-[#D4A574]">
                      1,380
                    </span>
                    <span className="text-[#78716C]">
                      {" "}
                      CHF/{language === "en" ? "mo" : "mois"}
                    </span>
                  </div>

                  <Link
                    to={`/${house.name.toLowerCase().replace(/\s+/g, "")}`}
                    className="block w-full py-4 bg-[#1C1917] text-white text-center font-bold hover:bg-[#D4A574] transition-colors"
                  >
                    {language === "en" ? "VIEW DETAILS" : "VOIR LES DÉTAILS"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DETAILED SERVICES SECTION */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-xs text-[#78716C] uppercase tracking-[0.3em] mb-4 block">
              {language === "en" ? "Detailed Breakdown" : "Détail Complet"}
            </span>
            <h2
              className="text-4xl md:text-5xl font-light text-[#1C1917] mb-4"
              style={{ fontFamily: "DM Serif Display, serif" }}
            >
              {language === "en"
                ? "What's Really Included"
                : "Ce Qui Est Vraiment Inclus"}
            </h2>
            <p className="text-lg text-[#57534E] max-w-2xl mx-auto">
              {language === "en"
                ? "Every detail of our all-inclusive service. No surprises, no hidden costs."
                : "Chaque détail de notre service tout-inclus. Pas de surprises, pas de frais cachés."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {detailedServices.map((service, index) => (
              <div
                key={index}
                className="bg-[#FAF9F6] rounded-2xl p-8 border border-[#E7E5E4] hover:border-[#D4A574]/30 transition-colors"
              >
                <div className="w-10 h-10 bg-[#F5F2ED] rounded-xl flex items-center justify-center mb-4">
                  <Droplets className="w-5 h-5 text-[#44403C]" />
                </div>
                <h3 className="text-xl font-medium text-[#1C1917] mb-4">
                  {service.category}
                </h3>
                <ul className="space-y-3">
                  {service.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-[#57534E]"
                    >
                      <Check className="w-4 h-4 text-[#D4A574] mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Summary Box */}
          <div className="mt-12 bg-[#1C1917] rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl font-light text-white mb-4">
              {language === "en" ? "The Bottom Line" : "En Résumé"}
            </h3>
            <p className="text-[#78716C] max-w-2xl mx-auto mb-6">
              {language === "en"
                ? "For 1,380 CHF/month, you get a furnished room in a premium house, all utilities, cleaning, gym, pool, sauna, yoga classes, community events, and zero hassle. Compare that to 2,045+ CHF for a basic studio in Geneva."
                : "Pour 1 380 CHF/mois, vous obtenez une chambre meublée dans une maison premium, toutes charges, ménage, sport, piscine, sauna, cours de yoga, événements communautaires, et zéro tracas. Comparez avec 2 045+ CHF pour un studio basique à Genève."}
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4A574] text-white rounded-full font-medium">
              <Sparkles className="w-5 h-5" />
              {language === "en"
                ? `You save ${monthlySavings} CHF every month`
                : `Vous économisez ${monthlySavings} CHF chaque mois`}
            </div>
          </div>
        </div>
      </section>

      {/* What's Included - Quick List */}
      <section className="py-24 lg:py-32 bg-[#FAF9F6]">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <span className="text-xs text-[#78716C] uppercase tracking-[0.3em] mb-4 block">
                {language === "en" ? "Quick Overview" : "Aperçu Rapide"}
              </span>
              <h2
                className="text-4xl md:text-5xl font-light text-[#1C1917] mb-8"
                style={{ fontFamily: "DM Serif Display, serif" }}
              >
                {language === "en"
                  ? "Everything You Need"
                  : "Tout Ce Dont Vous Avez Besoin"}
              </h2>
              <p className="text-lg text-[#57534E] leading-relaxed">
                {language === "en"
                  ? "One monthly payment covers absolutely everything. No hidden costs, no surprise bills."
                  : "Un paiement mensuel couvre absolument tout. Pas de coûts cachés, pas de factures surprises."}
              </p>
            </div>

            <div className="space-y-4">
              {includedItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-white p-4 rounded-xl border border-[#E7E5E4]"
                >
                  <div className="w-6 h-6 bg-[#D4A574]/10 border border-[#D4A574] flex items-center justify-center flex-shrink-0 mt-0.5 rounded">
                    <Check className="w-4 h-4 text-[#D4A574]" />
                  </div>
                  <span className="text-[#1C1917] font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-px bg-[#E7E5E4]">
            <div className="bg-[#FAF9F6] p-10">
              <h3 className="text-xl font-medium text-[#1C1917] mb-4">
                {language === "en" ? "Security Deposit" : "Caution"}
              </h3>
              <p className="text-[#57534E] leading-relaxed">
                {language === "en"
                  ? "We require a security deposit equivalent to two months' rent (2,760 CHF). This is returned within 30 days of move-out, minus any deductions for damages."
                  : "Nous exigeons une caution équivalente à deux mois de loyer (2 760 CHF). Elle est restituée dans les 30 jours suivant le départ, déduction faite des éventuels dommages."}
              </p>
            </div>
            <div className="bg-[#FAF9F6] p-10">
              <h3 className="text-xl font-medium text-[#1C1917] mb-4">
                {language === "en" ? "No Agency Fees" : "Sans Frais d'Agence"}
              </h3>
              <p className="text-[#57534E] leading-relaxed">
                {language === "en"
                  ? "There are absolutely no agency fees at La Villa Coliving. Our pricing is transparent and all-inclusive. What you see is what you pay."
                  : "Il n'y a absolument aucun frais d'agence chez La Villa Coliving. Notre tarification est transparente et tout inclusive. Ce que vous voyez est ce que vous payez."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#D4A574]">
        <div className="container-custom text-center">
          <h2
            className="text-3xl md:text-4xl font-light text-white mb-4"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "Ready to Save & Join?"
              : "Prêt à Économiser & Nous Rejoindre ?"}
          </h2>
          <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
            {language === "en"
              ? `Save ${monthlySavings} CHF/month and join 50+ happy colivers. Limited spots for Spring 2026.`
              : `Économisez ${monthlySavings} CHF/mois et rejoignez 50+ colivers heureux. Places limitées pour le Printemps 2026.`}
          </p>
          <Link
            to="/join-us"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#D4A574] font-bold hover:bg-[#1C1917] hover:text-white transition-colors"
          >
            {language === "en" ? "APPLY NOW" : "CANDIDATER"}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
