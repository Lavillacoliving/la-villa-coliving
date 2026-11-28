import { useLanguage } from "@/contexts/LanguageContext";
import { STATS } from "@/data/stats";
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
import { LocalizedLink } from "@/components/LocalizedLink";
import { SEO } from "@/components/SEO";
import { FaqSection } from "@/components/FaqSection";
import { servicesFaq } from "@/data/faq/servicesFaq";
import { APPART } from "@/data/appart";
import { STREAMING_SERVICES, capitalFirst, inclusPhrases, type InclusLang } from "@/data/inclus";

type ServiceKey = "allInclusive" | "housekeeping" | "internet" | "pool" | "wellness" | "entertainment" | "transport" | "supplies" | "community" | "support";

/**
 * Les dix cartes de /services (titre, texte), en français et en anglais. (24/11/2026, lot 3 du brief « budget réel ») Sorties de
 * src/i18n/translations.ts, qui est chargé par toutes les pages : les cartes lisent désormais ce que comprend le prix des maisons
 * dans src/data/inclus.ts (cours un de chaque par mois, panier de base, six services de streaming, fibre Orange Pro, ménage par une
 * entreprise trois fois par semaine, soirée commune, parking), sans que ce module entre dans le morceau d'entrée. Les autres
 * textes sont repris tels quels ; « nettoyage approfondi hebdomadaire » est retiré (aucune source).
 */
function serviceCards(lang: InclusLang): Record<ServiceKey, { title: string; description: string }> {
  const P = inclusPhrases(lang);
  if (lang === "en") {
    return {
      allInclusive: { title: "Truly All-Inclusive", description: "Rent, utilities, on-site parking, maintenance and replacements—all covered. One payment. Zero surprises." },
      housekeeping: { title: "Effortless Upkeep", description: `${P.lines.cleaning}. Your home stays pristine, effortlessly.` },
      internet: { title: capitalFirst(P.fibre), description: `${P.lines.fibreSpeed}. Work, stream, connect—without limits.` },
      pool: { title: "Pool & Garden", description: "Heated swimming pool, BBQ area, garden furniture, and outdoor spaces designed for relaxation and gatherings." },
      wellness: { title: "Wellness Included", description: "Fully equipped gym (24/7 access) and sauna, because balance matters." },
      entertainment: { title: "Entertainment Hub", description: `Home cinema with ${P.streamingOnScreen}, gaming consoles, and spaces designed for connection.` },
      transport: { title: "Yoga & fitness coaching", description: `${capitalFirst(P.classesOpenToAll)}, included in your rent. Stay active without leaving home.` },
      supplies: { title: "Monthly essentials", description: `${P.lines.basket}.` },
      community: { title: "Community Events", description: `${P.lines.getTogether} and seasonal events. Real connections, zero obligations.` },
      support: { title: "Always Here for You", description: "Direct WhatsApp support for quick responses. We're just a message away." },
    };
  }
  return {
    allInclusive: { title: "Vraiment Tout Inclus", description: "Loyer, charges, parking sur place, entretien et remplacements — tout est couvert. Un paiement. Zéro surprise." },
    housekeeping: { title: "Entretien Sans Effort", description: `${P.lines.cleaning}. Ta maison reste impeccable, sans effort.` },
    internet: { title: capitalFirst(P.fibre), description: `${P.lines.fibreSpeed}. Travaille, streame, connecte-toi — sans limites.` },
    pool: { title: "Piscine & Jardin", description: "Piscine chauffée, espace BBQ, mobilier de jardin et espaces extérieurs conçus pour la détente et les rassemblements." },
    wellness: { title: "Bien-être Inclus", description: "Salle de sport équipée (accès 24h/24) et sauna, parce que l'équilibre compte." },
    entertainment: { title: "Espace Divertissement", description: `Home cinéma avec ${P.streamingOnScreen}, consoles de jeu et espaces conçus pour la connexion.` },
    transport: { title: "Cours de yoga et coaching sportif", description: `${capitalFirst(P.classesOpenToAll)}, compris dans ton loyer. Reste en forme sans quitter la maison.` },
    supplies: { title: "Panier de base mensuel", description: `${P.lines.basket}.` },
    community: { title: "Événements Communautaires", description: `${P.lines.getTogether} et des événements saisonniers. De vraies connexions, zéro obligation.` },
    support: { title: "Toujours Là pour Toi", description: "Support WhatsApp direct pour des réponses rapides. Nous sommes à un message." },
  };
}

export function ServicesPageV4() {
  const { language } = useLanguage();

  const serviceCategories = [
    {
      title: language === "en" ? "Live" : "Vivre",
      subtitle:
        language === "en" ? "Your daily comfort" : "Ton confort quotidien",
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
          highlight: language === "en" ? "3x per week" : "3x par semaine",
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
      subtitle: language === "en" ? "Stay connected" : "Reste connecté",
      color: "bg-[#D4A574]",
      services: [
        {
          key: "internet",
          icon: Wifi,
          image:
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
          highlight: STATS.fiberOperator, // (24/11/2026, lot 3) « Orange Pro » (était « Fiber Pro »)
        },
        {
          key: "entertainment",
          icon: Tv,
          image: "/images/le loft home_cinema.webp",
          // (24/11/2026, lot 3) Nombre = longueur de STREAMING_SERVICES (était « Netflix & more »).
          highlight: language === "en" ? `${STREAMING_SERVICES.length} streaming services` : `${STREAMING_SERVICES.length} services de streaming`,
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
      // Services communautaires : gratuits, jamais facturés en supplément (cf. charte de transparence).
      subtitle:
        language === "en"
          ? "Wellness & community — included, at no extra cost"
          : "Bien-être & communauté — inclus, sans supplément",
      color: "bg-[#78716C]",
      services: [
        {
          key: "pool",
          icon: Waves,
          image: "/images/la villa jardin.webp",
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
          highlight: language === "en" ? "Yoga, get-togethers & more" : "Yoga, soirées & plus", // (24/11/2026, lot 3) soirée commune
        },
      ],
    },
  ];

  const serviceData = serviceCards(language === "en" ? "en" : "fr");

  const stats = [
    {
      // (24/11/2026, lot 3 du brief « budget réel », décision L3-g) « 24 · Services inclus » : le compte disparaît.
      value: language === "en" ? "All-inclusive" : "Tout compris",
      label: language === "en" ? "one single rent" : "un seul loyer",
      icon: Star,
    },
    {
      value: "0",
      label: language === "en" ? "Hidden fees" : "Frais cachés",
      icon: Shield,
    },
    {
      value: "3x",
      label: language === "en" ? "Cleaning per week" : "Ménage par semaine",
      icon: Clock,
    },
    {
      value: `${STATS.totalResidents}+`,
      label: language === "en" ? "Happy residents" : "Résidents satisfaits",
      icon: Users,
    },
  ];

  return (
    <main className="relative pt-16">
      <SEO
        title={language === "en" ? "All-Inclusive Services — La Villa Coliving" : "Services Tout Inclus — La Villa Coliving"}
        description={language === "en"
          ? "Cleaning, pool, sauna, gym, yoga, fitness, events — everything included in your rent. Discover our services."
          : "Ménage, piscine, sauna, salle de sport, yoga, fitness, événements — tout est inclus dans ton loyer. Découvre nos services."}
        url="https://www.lavillacoliving.com/services"
      />
      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/la villa coliving le loft piscine.webp"
            alt={language === "en" ? "Le Loft indoor pool — all-inclusive coliving services near Geneva" : "Piscine intérieure du Loft — services colocation tout inclus près de Genève"}
            className="w-full h-full object-cover" loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C1917]/90 via-[#1C1917]/70 to-transparent" />
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/12 backdrop-blur-sm border border-white/15 text-white text-[13px] font-semibold tracking-wider uppercase rounded-full mb-6">
              <Zap className="w-4 h-4 text-[#E0BB8A]" />
              {language === "en" ? "All-Inclusive Living" : "Vie tout inclus"}
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
                  Tu vis sans soucis.
                </>
              )}
            </h1>

            <p className="text-xl text-white/80 mb-8 max-w-lg">
              {language === "en"
                ? "From cleaning to high-speed internet, from yoga classes to community events — every detail is taken care of."
                : "Du ménage à la fibre haut débit, des cours de yoga aux événements communautaires — chaque détail est pensé."}
            </p>

            <div className="grid grid-cols-2 gap-x-8 gap-y-6 max-w-xl">
              {stats.map((stat, index) => (
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
          {/* Cadrage — texte verbatim (ADDENDUM_3_Services_et_Charte.md, A4). Gabarit YmylNotice. */}
          <aside className="max-w-3xl mx-auto mb-16 p-5 bg-[#FBF7F0] border border-[#E7D9C2] rounded-lg text-sm text-[#57534E]">
            <p>
              {language === "en"
                ? "None of these services is billed on top, and none is a condition of your tenancy. Community services are free; running costs are covered by a fixed fee set at actual cost."
                : "Aucun de ces services n'est facturé en supplément et aucun ne conditionne ta location. Les services communautaires sont gratuits ; les charges courantes sont couvertes par un forfait établi au coût réel."}{" "}
              <LocalizedLink
                to="/charte-transparence"
                className="underline underline-offset-4 hover:text-[#1C1917] transition-colors"
              >
                {language === "en" ? "Read our transparency charter" : "Lire notre charte de transparence"}
              </LocalizedLink>
            </p>
          </aside>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl text-[#1C1917] mb-4 tracking-tight">
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
                : "Nous ne cochons pas juste des cases. Nous créons un environnement où tu peux te concentrer sur l'essentiel."}
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
                // (24/11/2026, lot 3, L3-e) « 10+ heures par semaine » retiré : aucune source, et jamais un nombre d'heures.
                desc:
                  language === "en"
                    ? "No chores, no bills to manage, no maintenance headaches."
                    : "Pas de corvées, pas de factures à gérer, pas de tracas de maintenance.",
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
                    : "Emménage seul, trouve ta tribu. Des événements sélectionnés et des espaces partagés créent des connexions naturelles.",
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
            <span className="lvc-eyebrow mb-4">
              {language === "en" ? "What's Included" : "Ce qui est inclus"}
            </span>
            <h2 className="text-3xl md:text-4xl text-[#1C1917] tracking-tight">
              {language === "en"
                ? "Everything you need"
                : "Tout ce dont tu as besoin"}
            </h2>
            {/* (L'Appart, Lot 4, étape E5 — texte du 13/11/2026 « à confirmer ») Ces services sont ceux des maisons ; ce que comprend L'Appart. */}
            <p className="mt-4 text-[#57534E] max-w-2xl mx-auto leading-relaxed">
              {language === "en"
                ? `These services are those of our ${STATS.totalHouses} coliving houses. At ${APPART.name}, our flatshare in ${APPART.commune}, the rent covers bills, fibre, streaming and cleaning of the shared areas once a week, plus access to the yoga and fitness classes held at the houses.`
                : `Ces services sont ceux de nos ${STATS.totalHouses} maisons de coliving. À ${APPART.name}, notre colocation à ${APPART.commune}, le loyer comprend les charges, la fibre, le streaming et le ménage des communs une fois par semaine, plus l'accès aux cours de yoga et de sport des maisons.`}
            </p>
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

      {/* COMPARISON */}
      <section className="py-24 bg-[#F5F2ED]">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="lvc-eyebrow mb-4">
                {language === "en"
                  ? "The La Villa Difference"
                  : "La différence La Villa"}
              </span>
              <h2 className="text-3xl md:text-4xl text-[#1C1917] mb-6 tracking-tight">
                {language === "en" ? "Say goodbye to" : "Dis adieu aux"}{" "}
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
                    : "À la place, tu as :"}
                </p>
                <p className="text-[#78716C] text-sm">
                  {language === "en"
                    ? "More time to focus on your work, your passions, your people."
                    : "Du temps pour te concentrer sur ton travail, tes passions, tes proches."}
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
              {/* (24/11/2026, lot 3, L3-e) Pastille « 3+ heures gagnées par semaine » retirée : aucune source, jamais un nombre d'heures. */}
            </div>
          </div>
        </div>
      </section>

      <FaqSection
        title={language === "en" ? "Included services — frequently asked questions" : "Services inclus — questions fréquentes"}
        items={servicesFaq[language === "en" ? "en" : "fr"]}
        emitSchema
      />

      {/* CTA FINAL */}
      <section className="py-24 bg-[#1C1917]">
        <div className="container-custom text-center">
          <span className="lvc-eyebrow text-[#E0BB8A] mb-5">
            {language === "en" ? "Ready?" : "Prêt ?"}
          </span>
          <h2 className="text-3xl md:text-4xl text-white mb-6 tracking-tight">
            {language === "en"
              ? "Ready to live lighter?"
              : "Prêt à vivre plus léger ?"}
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-8">
            {language === "en"
              ? `Join ${STATS.totalResidents}+ residents who've reclaimed their time. One price. Everything included.`
              : `Rejoins plus de ${STATS.totalResidents} résidents qui ont récupéré leur temps. Un prix. Tout inclus.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LocalizedLink
              to="/tarifs"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#D4A574] text-[#1C1917] font-semibold rounded-lg hover:bg-[#E0BB8A] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A574] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1917]"
            >
              {language === "en" ? "View Rates" : "Voir les Tarifs"}
              <ArrowRight className="w-5 h-5" />
            </LocalizedLink>
            <LocalizedLink
              to="/candidature"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-semibold rounded-lg hover:border-white hover:bg-white/5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1917]"
            >
              {language === "en" ? "Book a visit" : "Programmer une visite"}
            </LocalizedLink>
          </div>
        </div>
      </section>
    </main>
  );
}
