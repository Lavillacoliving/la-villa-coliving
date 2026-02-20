import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";
import {
  ArrowRight,
  Users,
  Paintbrush,
  Wrench,
  Heart,
  Globe,
  BarChart3,
  TrendingUp,
  Award,
  Check,
} from "lucide-react";

export function InvestisseursPage() {
  const { language } = useLanguage();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="relative pt-20">
      <SEO
        title={
          language === "en"
            ? "Coliving Investors Geneva — Premium Delegated Management"
            : "Investisseurs Coliving Genève — Gestion Déléguée Premium"
        }
        description={
          language === "en"
            ? "Entrust your exceptional property to La Villa Coliving. 99% occupancy over 5 years, premium community management under our brand. Contact us."
            : "Confiez votre bien d'exception à La Villa Coliving. 99% d'occupation sur 5 ans, gestion de communauté premium sous notre marque. Contactez-nous."
        }
        url="https://www.lavillacoliving.com/investisseurs"
      />

      {/* ============================================ */}
      {/* BLOC 1 — HERO (dark)                        */}
      {/* ============================================ */}
      <section className="bg-[#1C1917] py-24 lg:py-32">
        <div className="container-custom text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-[#D4A574] mb-4 block">
            {language === "en"
              ? "PARTNERS & INVESTORS"
              : "PARTENAIRES & INVESTISSEURS"}
          </span>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 max-w-4xl mx-auto"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "Grow your assets with premium coliving"
              : "Développez votre patrimoine avec le coliving premium"}
          </h1>
          <p className="text-lg text-stone-300 max-w-2xl mx-auto mb-10">
            {language === "en"
              ? "You own an exceptional property near Geneva? We transform it into a profitable premium coliving — we manage everything."
              : "Vous avez un bien d'exception près de Genève ? Nous le transformons en coliving premium rentable — nous gérons tout."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollTo("contact")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4A574] text-white font-semibold rounded-xl hover:bg-[#E0BB8A] transition-colors"
            >
              {language === "en" ? "Book a meeting" : "Prendre rendez-vous"}
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollTo("modele")}
              className="inline-flex items-center gap-2 px-8 py-4 border border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              {language === "en" ? "Discover the model" : "Découvrir le modèle"}
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="container-custom mt-16 pt-10 border-t border-stone-700">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                99%
              </p>
              <p className="text-stone-400 text-sm">
                {language === "en"
                  ? "Occupancy rate over 5 years"
                  : "Taux d'occupation sur 5 ans"}
              </p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                100+
              </p>
              <p className="text-stone-400 text-sm">
                {language === "en"
                  ? "Residents welcomed since 2021"
                  : "Résidents accueillis depuis 2021"}
              </p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                3
              </p>
              <p className="text-stone-400 text-sm">
                {language === "en"
                  ? "Houses under management"
                  : "Maisons en gestion"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* BLOC 2 — L'OPPORTUNITÉ (beige)              */}
      {/* ============================================ */}
      <section className="bg-[#FAF9F6] py-24 lg:py-32">
        <div className="container-custom">
          <span className="text-xs uppercase tracking-[0.3em] text-[#D4A574] mb-4 block">
            {language === "en" ? "THE MARKET" : "LE MARCHÉ"}
          </span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-light text-[#1C1917] mb-12"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "Premium coliving, a booming market"
              : "Le coliving premium, un marché en pleine explosion"}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div className="space-y-6">
              <p className="text-[#57534E] leading-relaxed">
                {language === "en"
                  ? "Greater Geneva attracts thousands of international professionals every year. Overpriced studios on the Swiss side, aging flatshares on the French side — in between, a gap. That's where premium coliving steps in."
                  : "Le Grand Genève attire chaque année des milliers de professionnels internationaux. Studios hors de prix côté Suisse, colocations vieillissantes côté France — entre les deux, un vide. C'est là que le coliving premium s'impose."}
              </p>
              <p className="text-[#57534E] leading-relaxed">
                {language === "en"
                  ? "Our residents aren't looking for a bed. They're looking for an experience: a designer room with private bathroom, a pool, a sauna, yoga classes, a community — and zero mental load. All-inclusive, one single payment."
                  : "Nos résidents ne cherchent pas un lit. Ils cherchent une expérience : une chambre design avec salle de bain privative, une piscine, un sauna, des cours de yoga, une communauté — et zéro charge mentale. Tout inclus, un seul paiement."}
              </p>
              <p className="text-[#57534E] leading-relaxed">
                {language === "en"
                  ? "Result: our houses have maintained 99% occupancy since 2021, with 12-month leases and controlled turnover. This isn't seasonal rental — it's a stable-yield real estate asset."
                  : "Résultat : nos maisons affichent 99% d'occupation depuis 2021, avec des baux de 12 mois et un turnover maîtrisé. Ce n'est pas de la location saisonnière — c'est un actif immobilier à rendement stable."}
              </p>
            </div>

            {/* Image */}
            <div className="rounded-2xl overflow-hidden border border-[#E7E5E4]">
              <img
                src="/images/la villa coliving le loft piscine.webp"
                alt={
                  language === "en"
                    ? "La Villa Coliving pool — premium coliving near Geneva"
                    : "Piscine La Villa Coliving — coliving premium près de Genève"
                }
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* BLOC 3 — LE MODÈLE (dark)                   */}
      {/* ============================================ */}
      <section id="modele" className="bg-[#1C1917] py-24 lg:py-32">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-[#D4A574] mb-4 block">
              {language === "en" ? "OUR MODEL" : "NOTRE MODÈLE"}
            </span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-6"
              style={{ fontFamily: "DM Serif Display, serif" }}
            >
              {language === "en"
                ? "You are the owner. We are the operators."
                : "Vous êtes propriétaire. Nous sommes opérateurs."}
            </h2>
            <p className="text-stone-300 max-w-3xl mx-auto text-lg">
              {language === "en"
                ? "La Villa Coliving doesn't do property management — we build communities. We take full charge of your property under our brand: from resident selection to daily life management. You receive your income, we do the rest."
                : "La Villa Coliving ne fait pas de la gestion immobilière — nous créons des communautés. Nous prenons en charge l'intégralité de votre bien sous notre marque : de la sélection des résidents à l'animation du quotidien. Vous percevez vos revenus, nous faisons le reste."}
            </p>
          </div>

          {/* 6 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Users,
                title:
                  language === "en"
                    ? "Resident selection"
                    : "Sélection des résidents",
                desc:
                  language === "en"
                    ? "We find, screen and welcome your tenants. 12-month leases, qualified profiles."
                    : "Nous trouvons, sélectionnons et accueillons vos locataires. Baux de 12 mois, profils qualifiés.",
              },
              {
                icon: Paintbrush,
                title:
                  language === "en"
                    ? "Design & furnishing"
                    : "Aménagement & design",
                desc:
                  language === "en"
                    ? "We design the premium layout of each room and common spaces."
                    : "Nous concevons l'aménagement premium de chaque chambre et des espaces communs.",
              },
              {
                icon: Wrench,
                title:
                  language === "en"
                    ? "Full maintenance"
                    : "Maintenance complète",
                desc:
                  language === "en"
                    ? "Routine maintenance, repairs, pool, garden — everything is handled by our team."
                    : "Entretien courant, réparations, piscine, jardin — tout est géré par notre équipe.",
              },
              {
                icon: Heart,
                title:
                  language === "en"
                    ? "Community life"
                    : "Vie communautaire",
                desc:
                  language === "en"
                    ? "Events, yoga, fitness, parties — we create the experience that retains your residents."
                    : "Événements, yoga, fitness, soirées — nous créons l'expérience qui fidélise vos résidents.",
              },
              {
                icon: Globe,
                title:
                  language === "en"
                    ? "Marketing & visibility"
                    : "Marketing & visibilité",
                desc:
                  language === "en"
                    ? "Your property benefits from our brand, our website, our social networks and our reputation."
                    : "Votre bien profite de notre marque, notre site, nos réseaux sociaux et notre réputation.",
              },
              {
                icon: BarChart3,
                title:
                  language === "en"
                    ? "Monthly reporting"
                    : "Reporting mensuel",
                desc:
                  language === "en"
                    ? "Real-time dashboard, monthly reports, full transparency on occupancy and revenue."
                    : "Dashboard en temps réel, rapports mensuels, transparence totale sur l'occupation et les revenus.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-stone-800 border border-stone-700 rounded-2xl p-6"
              >
                <card.icon className="w-8 h-8 text-[#D4A574] mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {card.title}
                </h3>
                <p className="text-stone-400 text-sm leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Encart différenciateur */}
          <div className="max-w-3xl mx-auto bg-stone-800 border border-[#D4A574]/30 rounded-2xl p-6 md:p-8">
            <p className="text-stone-300 leading-relaxed">
              <span className="text-white font-semibold">
                {language === "en"
                  ? "The La Villa difference"
                  : "La différence La Villa"}
              </span>{" "}
              {language === "en"
                ? ": a traditional property manager handles walls. We bring a community to life. Yoga classes, cross-house events, personalized welcome for each resident — it's this experience that creates 12-month leases, word-of-mouth referrals, and an occupancy rate that traditional rental management can't match."
                : ": un gestionnaire immobilier classique gère des murs. Nous, nous animons une communauté. Cours de yoga, soirées inter-maisons, accueil personnalisé de chaque résident — c'est cette expérience qui crée des baux de 12 mois, du bouche-à-oreille, et un taux d'occupation que la gestion locative traditionnelle ne peut pas atteindre."}
            </p>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* BLOC 4 — POURQUOI LA VILLA (beige)          */}
      {/* ============================================ */}
      <section className="bg-[#FAF9F6] py-24 lg:py-32">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-[#D4A574] mb-4 block">
              {language === "en" ? "WHY US" : "POURQUOI NOUS"}
            </span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-light text-[#1C1917]"
              style={{ fontFamily: "DM Serif Display, serif" }}
            >
              {language === "en"
                ? "What makes us unique"
                : "Ce qui nous rend uniques"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#D4A574]/10 flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-[#D4A574]" />
              </div>
              <p
                className="text-4xl font-bold text-[#1C1917] mb-1"
                style={{ fontFamily: "DM Serif Display, serif" }}
              >
                99%
              </p>
              <p className="text-sm font-semibold text-[#D4A574] uppercase tracking-wider mb-3">
                {language === "en" ? "Occupancy rate" : "Taux d'occupation"}
              </p>
              <p className="text-[#57534E] text-sm leading-relaxed">
                {language === "en"
                  ? "Over 5 years, our houses have virtually never had a vacancy. Our residents stay between 6 months and 3 years."
                  : "Sur 5 ans, nos maisons n'ont quasiment jamais eu de vacance. Nos résidents restent entre 6 mois et 3 ans."}
              </p>
            </div>

            {/* Column 2 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#D4A574]/10 flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-[#D4A574]" />
              </div>
              <p
                className="text-4xl font-bold text-[#1C1917] mb-1"
                style={{ fontFamily: "DM Serif Display, serif" }}
              >
                {language === "en" ? "Community" : "Communauté"}
              </p>
              <p className="text-sm font-semibold text-[#D4A574] uppercase tracking-wider mb-3">
                {language === "en"
                  ? "Not just real estate"
                  : "Pas juste de l'immobilier"}
              </p>
              <p className="text-[#57534E] text-sm leading-relaxed">
                {language === "en"
                  ? "We don't manage walls — we bring a community to life. Events, yoga, parties, personalized welcome: that's what retains your residents and eliminates vacancy."
                  : "Nous ne gérons pas des murs — nous animons une communauté. Événements, yoga, soirées, accueil personnalisé : c'est ce qui fidélise vos résidents et élimine la vacance."}
              </p>
            </div>

            {/* Column 3 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#D4A574]/10 flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-[#D4A574]" />
              </div>
              <p
                className="text-4xl font-bold text-[#1C1917] mb-1"
                style={{ fontFamily: "DM Serif Display, serif" }}
              >
                {language === "en" ? "5 years" : "5 ans"}
              </p>
              <p className="text-sm font-semibold text-[#D4A574] uppercase tracking-wider mb-3">
                {language === "en" ? "Of experience" : "D'expérience"}
              </p>
              <p className="text-[#57534E] text-sm leading-relaxed">
                {language === "en"
                  ? "3 houses, 29 rooms, 100+ residents. Proven processes, an established brand in Greater Geneva."
                  : "3 maisons, 29 chambres, 100+ résidents. Des process rodés, une marque établie dans le Grand Genève."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* BLOC 5 — PROFIL DES BIENS (stone-50)        */}
      {/* ============================================ */}
      <section className="bg-stone-50 py-24 lg:py-32">
        <div className="container-custom">
          <span className="text-xs uppercase tracking-[0.3em] text-[#D4A574] mb-4 block">
            {language === "en" ? "CRITERIA" : "CRITÈRES"}
          </span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-light text-[#1C1917] mb-12"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "The ideal property for La Villa coliving"
              : "Le bien idéal pour le coliving La Villa"}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Criteria */}
            <div>
              <div className="space-y-4 mb-8">
                {(language === "en"
                  ? [
                      "Detached house or character villa (200 to 500 m²)",
                      "5 to 15 potential rooms (existing or convertible)",
                      "Outdoor spaces (garden, terrace, ideally a pool)",
                      "Greater Geneva area (Annemasse, Ambilly, Ville-la-Grand, Gaillard, Thonex, Veyrier…)",
                      "Good transport links (CEVA, tram, bus to Geneva center)",
                      "Charm and differentiation potential (no apartment blocks, no residences)",
                    ]
                  : [
                      "Maison individuelle ou villa de caractère (200 à 500 m²)",
                      "5 à 15 chambres potentielles (existantes ou aménageables)",
                      "Espaces extérieurs (jardin, terrasse, piscine idéalement)",
                      "Zone Grand Genève (Annemasse, Ambilly, Ville-la-Grand, Gaillard, Thonex, Veyrier…)",
                      "Bon accès transports (CEVA, tram, bus vers Genève centre)",
                      "Potentiel de charme et de différenciation (pas d'immeubles, pas de résidences)",
                    ]
                ).map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#D4A574] mt-0.5 flex-shrink-0" />
                    <span className="text-[#57534E] font-medium">{item}</span>
                  </div>
                ))}
              </div>

              {/* Encart */}
              <div className="bg-stone-100 border border-stone-200 rounded-2xl p-6">
                <p className="text-[#57534E] italic text-sm leading-relaxed">
                  {language === "en"
                    ? "Your property doesn't exactly match these criteria but has potential? Contact us anyway — every project is unique."
                    : "Vous avez un bien qui ne correspond pas exactement à ces critères mais qui a du potentiel ? Contactez-nous quand même — chaque projet est unique."}
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="rounded-2xl overflow-hidden border border-[#E7E5E4]">
              <img
                src="/images/le lodge.webp"
                alt={
                  language === "en"
                    ? "Le Lodge — La Villa Coliving property near Geneva"
                    : "Le Lodge — maison La Villa Coliving près de Genève"
                }
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* BLOC 6 — FORMULAIRE (dark)                  */}
      {/* ============================================ */}
      <section id="contact" className="bg-[#1C1917] py-24 lg:py-32">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.3em] text-[#D4A574] mb-4 block">
              {language === "en"
                ? "LET'S TALK ABOUT YOUR PROJECT"
                : "PARLONS DE VOTRE PROJET"}
            </span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-4"
              style={{ fontFamily: "DM Serif Display, serif" }}
            >
              {language === "en" ? "Book a meeting" : "Prendre rendez-vous"}
            </h2>
            <p className="text-stone-300 max-w-xl mx-auto">
              {language === "en"
                ? "Describe your project in a few words. We'll get back to you within 48h for a no-obligation first conversation."
                : "Décrivez votre projet en quelques mots. Nous vous recontactons sous 48h pour un premier échange sans engagement."}
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <form
              action="https://formspree.io/f/mreazaqz"
              method="POST"
              className="bg-stone-800 border border-stone-700 rounded-2xl p-8"
            >
              {/* Hidden fields to identify this as investor form */}
              <input type="hidden" name="_subject" value="[Investisseurs] Nouvelle demande de contact" />
              <input type="hidden" name="_replyto" />

              <div className="space-y-6">
                {/* Nom complet */}
                <div>
                  <label className="block text-sm text-stone-300 mb-2">
                    {language === "en" ? "Full name" : "Nom complet"} *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    autoComplete="name"
                    className="w-full px-4 py-3 bg-stone-900 border border-stone-600 rounded-xl text-white placeholder-stone-500 focus:border-[#D4A574] focus:outline-none transition-colors"
                  />
                </div>

                {/* Email + Téléphone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-stone-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      className="w-full px-4 py-3 bg-stone-900 border border-stone-600 rounded-xl text-white placeholder-stone-500 focus:border-[#D4A574] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-stone-300 mb-2">
                      {language === "en" ? "Phone" : "Téléphone"} *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      autoComplete="tel"
                      className="w-full px-4 py-3 bg-stone-900 border border-stone-600 rounded-xl text-white placeholder-stone-500 focus:border-[#D4A574] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Profil */}
                <div>
                  <label className="block text-sm text-stone-300 mb-2">
                    {language === "en" ? "Your situation" : "Votre situation"} *
                  </label>
                  <select
                    name="profil"
                    required
                    className="w-full px-4 py-3 bg-stone-900 border border-stone-600 rounded-xl text-white focus:border-[#D4A574] focus:outline-none transition-colors"
                  >
                    <option value="">
                      {language === "en" ? "Select" : "Sélectionner"}
                    </option>
                    <option value="proprietaire">
                      {language === "en"
                        ? "I own a property"
                        : "Je suis propriétaire d'un bien"}
                    </option>
                    <option value="investisseur">
                      {language === "en"
                        ? "I'm looking to acquire a property"
                        : "Je cherche un bien à acquérir"}
                    </option>
                    <option value="autre">
                      {language === "en" ? "Other" : "Autre"}
                    </option>
                  </select>
                </div>

                {/* Localisation + Surface */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-stone-300 mb-2">
                      {language === "en"
                        ? "Property location (city, postal code)"
                        : "Localisation du bien (ville, code postal)"}
                    </label>
                    <input
                      type="text"
                      name="localisation"
                      className="w-full px-4 py-3 bg-stone-900 border border-stone-600 rounded-xl text-white placeholder-stone-500 focus:border-[#D4A574] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-stone-300 mb-2">
                      {language === "en"
                        ? "Approximate area (m²)"
                        : "Surface approximative (m²)"}
                    </label>
                    <input
                      type="text"
                      name="surface"
                      className="w-full px-4 py-3 bg-stone-900 border border-stone-600 rounded-xl text-white placeholder-stone-500 focus:border-[#D4A574] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm text-stone-300 mb-2">
                    {language === "en"
                      ? "Describe your project in a few words"
                      : "Décrivez votre projet en quelques mots"}
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    className="w-full px-4 py-3 bg-stone-900 border border-stone-600 rounded-xl text-white placeholder-stone-500 focus:border-[#D4A574] focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-4 bg-[#D4A574] text-white font-semibold rounded-xl hover:bg-[#E0BB8A] transition-colors flex items-center justify-center gap-2"
                >
                  {language === "en"
                    ? "Send my request"
                    : "Envoyer ma demande"}
                  <ArrowRight className="w-5 h-5" />
                </button>

                <p className="text-xs text-stone-500 text-center">
                  {language === "en"
                    ? "We respond within 48h. No commitment."
                    : "Nous vous répondons sous 48h. Aucun engagement."}
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
