import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";
import {
  MapPin,
  Clock,
  Train,
  Euro,
  Home,
  Users,
  Waves,
  Dumbbell,
  Wifi,
  ArrowRight,
  Check,
  Star,
  Shield,
  ChevronDown,
  ChevronUp,
  Tv,
  UtensilsCrossed,
  Globe,
  Briefcase,
  Laptop2,
} from "lucide-react";
import { useState } from "react";

// FAQ data specific to this page
const colocationFAQ = [
  {
    q: "Combien coûte une colocation près de Genève chez La Villa ?",
    a: "Nos chambres privatives tout inclus sont à 1 380 CHF/mois. Ce prix comprend le loyer, les charges, la fibre internet, le ménage 2x/semaine, l'accès à la piscine, la salle de sport, le sauna, les cours de yoga et de sport hebdomadaires, les événements communautaires mensuels et les paniers repas mensuels. C'est en moyenne 30 à 40% moins cher qu'un studio équivalent à Genève.",
  },
  {
    q: "Quel est le temps de trajet entre La Villa et le centre de Genève ?",
    a: "Depuis nos résidences, vous rejoignez le centre de Genève (gare Cornavin) en 15 à 25 minutes selon le mode de transport. En voiture : 15 min via la douane de Moillesulaz. En Léman Express : 20 min depuis la gare d'Annemasse. En bus : lignes TAC et TPG avec correspondances directes.",
  },
  {
    q: "Faut-il un permis de travail suisse pour vivre chez La Villa et travailler à Genève ?",
    a: "Oui, pour travailler à Genève en vivant côté France, vous avez besoin d'un permis G (permis frontalier). C'est votre employeur suisse qui fait la demande. La Villa Coliving se situe dans la zone frontalière éligible. Beaucoup de nos résidents sont des frontaliers actifs.",
  },
  {
    q: "Quels sont les avantages fiscaux de vivre côté France et travailler à Genève ?",
    a: "Le canton de Genève a un accord fiscal spécifique : les frontaliers sont imposés à la source en Suisse (à un taux souvent inférieur au taux français). De plus, le coût de la vie (loyer, courses, loisirs) est 30 à 50% moins cher côté France qu'à Genève. En vivant chez La Villa, vous bénéficiez d'un salaire suisse avec des charges de vie françaises.",
  },
  {
    q: "Quelle est la durée du bail ?",
    a: "Le bail est un contrat meublé de 12 mois, renouvelable, avec un préavis de départ d'1 mois. C'est idéal pour les frontaliers qui s'installent durablement près de Genève.",
  },
  {
    q: "Les chambres sont-elles meublées ?",
    a: "Oui, toutes nos chambres sont entièrement meublées et équipées : lit double de qualité, bureau, rangements, linge de maison. Vous n'avez qu'à poser vos valises. Les espaces communs (cuisine, salon, terrasse) sont également équipés haut de gamme.",
  },
  {
    q: "Comment candidater ?",
    a: "Le processus est simple : remplissez le formulaire sur notre page 'Nous Rejoindre', nous vous contactons sous 48h pour un échange, puis une visite est organisée. L'emménagement peut se faire en 2 semaines.",
  },
];

export function ColocationGenevePage() {
  const { language } = useLanguage();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // FAQPage schema for rich snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: colocationFAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <main className="relative pt-20">
      <SEO
        title={
          language === "en"
            ? "Shared Housing Near Geneva — Premium Coliving from 1,380 CHF/month"
            : "Colocation près de Genève — Coliving Premium dès 1 380 CHF/mois"
        }
        description={
          language === "en"
            ? "Premium shared housing 15 min from Geneva. 29 furnished all-inclusive rooms in 3 houses. Pool, gym, sauna. Ideal for cross-border workers, expats & young professionals."
            : "Colocation premium à 15 min de Genève. 29 chambres meublées tout inclus dans 3 maisons. Piscine, gym, sauna. Idéal frontaliers, expats et jeunes professionnels."
        }
        url="https://www.lavillacoliving.com/colocation-geneve"
        image="https://www.lavillacoliving.com/images/villa_portrait.webp"
        jsonLd={faqSchema}
      />

      {/* ===== HERO ===== */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-b from-white to-[#FAF9F6]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="text-xs text-[#D4A574] uppercase tracking-[0.3em] mb-4 block font-medium">
            {language === "en" ? "Shared housing near Geneva" : "Colocation Grand Genève"}
          </span>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-light text-[#1C1917] mb-6 leading-tight"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en" ? (
              <>
                Premium <span className="text-[#D4A574]">Shared Housing</span>
                <br />
                15 Minutes from Geneva
              </>
            ) : (
              <>
                <span className="text-[#D4A574]">Colocation</span> Premium
                <br />à 15 Minutes de Genève
              </>
            )}
          </h1>
          <p className="text-lg md:text-xl text-[#57534E] max-w-3xl mx-auto mb-10 leading-relaxed">
            {language === "en"
              ? "Live on the French side, work in Geneva. 29 fully furnished, all-inclusive rooms across 3 designer houses in Ville-la-Grand, Ambilly and Annemasse. Pool, gym, sauna, fiber internet — everything included."
              : "Vivez côté France, travaillez à Genève. 29 chambres meublées tout inclus dans 3 maisons design à Ville-la-Grand, Ambilly et Annemasse. Piscine, gym, sauna, fibre optique — tout est compris."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/join-us"
              className="inline-flex items-center gap-2 bg-[#D4A574] text-white px-8 py-4 text-sm uppercase tracking-wider hover:bg-[#44403C] transition-colors"
            >
              {language === "en" ? "Apply Now" : "Candidater"}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/our-houses"
              className="inline-flex items-center gap-2 border border-[#1C1917] text-[#1C1917] px-8 py-4 text-sm uppercase tracking-wider hover:bg-[#1C1917] hover:text-white transition-colors"
            >
              {language === "en" ? "View Our Houses" : "Voir Nos Maisons"}
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm text-[#78716C]">
            <span className="flex items-center gap-2">
              <Home className="w-4 h-4" /> 29{" "}
              {language === "en" ? "rooms" : "chambres"}
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" /> 3{" "}
              {language === "en" ? "houses" : "maisons"}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> 15 min{" "}
              {language === "en" ? "from Geneva" : "de Genève"}
            </span>
            <span className="flex items-center gap-2">
              <Euro className="w-4 h-4" />{" "}
              {language === "en" ? "From" : "Dès"} 1 380 CHF/
              {language === "en" ? "month" : "mois"}
            </span>
          </div>
        </div>
      </section>

      {/* ===== POURQUOI LA COLOCATION CÔTÉ FRANCE ===== */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-4 text-center"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "Why Choose Shared Housing on the French Side?"
              : "Pourquoi Choisir la Colocation Côté France ?"}
          </h2>
          <p className="text-[#57534E] text-center max-w-3xl mx-auto mb-16">
            {language === "en"
              ? "Geneva is one of the most expensive cities in the world for housing. Living across the border gives you Swiss salaries with French cost of living."
              : "Genève est l'une des villes les plus chères au monde pour se loger. Vivre côté France vous donne un salaire suisse avec un coût de vie français."}
          </p>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Card 1: Savings */}
            <div className="bg-[#FAF9F6] p-8">
              <Euro className="w-8 h-8 text-[#D4A574] mb-4" />
              <h3 className="text-xl font-medium text-[#1C1917] mb-3">
                {language === "en" ? "Save 30-50% on Housing" : "Économisez 30 à 50% sur le Logement"}
              </h3>
              <p className="text-[#57534E] leading-relaxed mb-4">
                {language === "en"
                  ? "A studio in Geneva starts at 1,800 CHF/month — without furniture or services. At La Villa, you get a fully furnished room with pool, gym, sauna, cleaning 2x/week, weekly yoga & sports classes, monthly community events and meal baskets — from 1,380 CHF/month."
                  : "Un studio à Genève coûte minimum 1 800 CHF/mois — sans meubles ni services. Chez La Villa, vous avez une chambre meublée avec piscine, gym, sauna, ménage 2x/semaine, cours de yoga et sport hebdomadaires, événements communautaires et paniers repas mensuels — dès 1 380 CHF/mois."}
              </p>
              <div className="bg-white p-4 border border-[#E7E5E4]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#78716C]">
                    Studio Genève
                  </span>
                  <span className="font-medium text-[#1C1917]">
                    1 800 - 2 500 CHF
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#78716C]">
                    + {language === "en" ? "Utilities & internet" : "Charges & internet"}
                  </span>
                  <span className="font-medium text-[#1C1917]">
                    + 200 - 400 CHF
                  </span>
                </div>
                <div className="border-t border-[#E7E5E4] my-2 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#D4A574]">
                      La Villa ({language === "en" ? "all included" : "tout compris"})
                    </span>
                    <span className="font-medium text-[#D4A574]">
                      1 380 CHF
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Tax Benefits */}
            <div className="bg-[#FAF9F6] p-8">
              <Shield className="w-8 h-8 text-[#D4A574] mb-4" />
              <h3 className="text-xl font-medium text-[#1C1917] mb-3">
                {language === "en" ? "Cross-Border Tax Benefits" : "Avantages Fiscaux Frontaliers"}
              </h3>
              <p className="text-[#57534E] leading-relaxed">
                {language === "en"
                  ? "As a cross-border worker in Geneva, you're taxed at source in Switzerland — often at a lower rate than in France. You enjoy Swiss salaries while benefiting from French cost of living: groceries, leisure, transport, and healthcare costs are significantly lower on the French side."
                  : "En tant que frontalier à Genève, vous êtes imposé à la source en Suisse — souvent à un taux inférieur au taux français. Vous bénéficiez d'un salaire suisse avec un coût de vie français : courses, loisirs, transports et santé sont nettement moins chers côté France."}
              </p>
            </div>

            {/* Card 3: Transport */}
            <div className="bg-[#FAF9F6] p-8">
              <Train className="w-8 h-8 text-[#D4A574] mb-4" />
              <h3 className="text-xl font-medium text-[#1C1917] mb-3">
                {language === "en" ? "15 min from Geneva Centre" : "15 min du Centre de Genève"}
              </h3>
              <p className="text-[#57534E] leading-relaxed mb-4">
                {language === "en"
                  ? "Our houses are located in the heart of the cross-border area, with excellent connections to Geneva."
                  : "Nos maisons sont situées au cœur de la zone frontalière, avec d'excellentes connexions vers Genève."}
              </p>
              <ul className="space-y-2 text-[#57534E]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4A574] flex-shrink-0" />
                  <span>
                    <strong>Léman Express :</strong> Annemasse → Cornavin en 20 min
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4A574] flex-shrink-0" />
                  <span>
                    <strong>{language === "en" ? "By car" : "En voiture"} :</strong>{" "}
                    15 min {language === "en" ? "via Moillesulaz border" : "via la douane de Moillesulaz"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4A574] flex-shrink-0" />
                  <span>
                    <strong>Bus TAC / TPG :</strong>{" "}
                    {language === "en" ? "Direct lines to Geneva" : "Lignes directes vers Genève"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4A574] flex-shrink-0" />
                  <span>
                    <strong>{language === "en" ? "By bike" : "À vélo"} :</strong>{" "}
                    {language === "en"
                      ? "Cycle paths to the Swiss border"
                      : "Pistes cyclables jusqu'à la frontière suisse"}
                  </span>
                </li>
              </ul>
            </div>

            {/* Card 4: Quality of Life */}
            <div className="bg-[#FAF9F6] p-8">
              <Star className="w-8 h-8 text-[#D4A574] mb-4" />
              <h3 className="text-xl font-medium text-[#1C1917] mb-3">
                {language === "en" ? "Premium Quality of Life" : "Qualité de Vie Premium"}
              </h3>
              <p className="text-[#57534E] leading-relaxed">
                {language === "en"
                  ? "Forget the isolation of a tiny studio. At La Villa, you live in designer houses with pool, gym, sauna, garden, coworking spaces, and a vibrant international community. Weekly yoga & sports classes, monthly community events, monthly meal baskets — cleaning 2x/week, maintenance, streaming subscriptions all included."
                  : "Oubliez l'isolement d'un petit studio. Chez La Villa, vous vivez dans des maisons design avec piscine, salle de sport, sauna, jardin, espaces coworking et une communauté internationale dynamique. Cours de yoga et sport hebdomadaires, événements communautaires mensuels, paniers repas mensuels — ménage 2x/semaine, entretien, abonnements streaming inclus."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NOS 3 RÉSIDENCES ===== */}
      <section className="py-24 lg:py-32 bg-[#FAF9F6]">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-4 text-center"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "3 Houses, 3 Locations, 1 Community"
              : "3 Maisons, 3 Adresses, 1 Communauté"}
          </h2>
          <p className="text-[#57534E] text-center max-w-3xl mx-auto mb-16">
            {language === "en"
              ? "All within the Grand Geneva cross-border area, 15 minutes from the Swiss border."
              : "Toutes dans la zone frontalière du Grand Genève, à 15 minutes de la frontière suisse."}
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* La Villa */}
            <Link to="/lavilla" className="group bg-white border border-[#E7E5E4] hover:border-[#D4A574] transition-colors">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="/images/la villa jardin.webp"
                  alt="La Villa Coliving — colocation premium avec piscine chauffée à Ville-la-Grand, près de Genève"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium text-[#1C1917] mb-1">La Villa</h3>
                <p className="text-sm text-[#D4A574] flex items-center gap-1 mb-3">
                  <MapPin className="w-3 h-3" /> Ville-la-Grand
                </p>
                <p className="text-sm text-[#57534E] mb-4">
                  {language === "en"
                    ? "370m² designer house on 2,000m² estate. Heated pool, sauna, gym. 10 rooms."
                    : "Maison design de 370m² sur domaine de 2 000m². Piscine chauffée, sauna, gym. 10 chambres."}
                </p>
                <div className="flex items-center gap-4 text-xs text-[#78716C]">
                  <span className="flex items-center gap-1"><Waves className="w-3 h-3" /> {language === "en" ? "Pool" : "Piscine"}</span>
                  <span className="flex items-center gap-1"><Dumbbell className="w-3 h-3" /> Gym</span>
                  <span className="flex items-center gap-1"><Wifi className="w-3 h-3" /> Fibre</span>
                </div>
              </div>
            </Link>

            {/* Le Loft */}
            <Link to="/leloft" className="group bg-white border border-[#E7E5E4] hover:border-[#D4A574] transition-colors">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="/images/le loft glamour.webp"
                  alt="Le Loft Coliving — colocation moderne avec piscine intérieure à Ambilly, près de Genève"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium text-[#1C1917] mb-1">Le Loft</h3>
                <p className="text-sm text-[#D4A574] flex items-center gap-1 mb-3">
                  <MapPin className="w-3 h-3" /> Ambilly
                </p>
                <p className="text-sm text-[#57534E] mb-4">
                  {language === "en"
                    ? "Charming townhouse with indoor pool, sauna, gym. Spacious designer rooms. 7 rooms."
                    : "Maison de ville charmante avec piscine intérieure, sauna, gym. Chambres design spacieuses. 7 chambres."}
                </p>
                <div className="flex items-center gap-4 text-xs text-[#78716C]">
                  <span className="flex items-center gap-1"><Waves className="w-3 h-3" /> {language === "en" ? "Pool" : "Piscine"}</span>
                  <span className="flex items-center gap-1"><Dumbbell className="w-3 h-3" /> Gym</span>
                  <span className="flex items-center gap-1"><Wifi className="w-3 h-3" /> Fibre</span>
                </div>
              </div>
            </Link>

            {/* Le Lodge */}
            <Link to="/lelodge" className="group bg-white border border-[#E7E5E4] hover:border-[#D4A574] transition-colors">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="/images/le lodge piscine.webp"
                  alt="Le Lodge Coliving — colocation avec piscine et salle de sport à Annemasse, à 10 min de Genève"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium text-[#1C1917] mb-1">Le Lodge</h3>
                <p className="text-sm text-[#D4A574] flex items-center gap-1 mb-3">
                  <MapPin className="w-3 h-3" /> Annemasse
                </p>
                <p className="text-sm text-[#57534E] mb-4">
                  {language === "en"
                    ? "Spacious estate near Annemasse centre. Pool house, fitness chalet, large garden. 12 rooms."
                    : "Domaine spacieux proche du centre d'Annemasse. Pool house, chalet fitness, grand jardin. 12 chambres."}
                </p>
                <div className="flex items-center gap-4 text-xs text-[#78716C]">
                  <span className="flex items-center gap-1"><Waves className="w-3 h-3" /> {language === "en" ? "Pool" : "Piscine"}</span>
                  <span className="flex items-center gap-1"><Dumbbell className="w-3 h-3" /> Gym</span>
                  <span className="flex items-center gap-1"><Wifi className="w-3 h-3" /> Fibre</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/our-houses"
              className="inline-flex items-center gap-2 text-[#D4A574] font-medium hover:underline"
            >
              {language === "en" ? "Explore all houses in detail" : "Explorer toutes nos maisons en détail"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TOUT INCLUS ===== */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-4 text-center"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "Everything Included in Your Rent"
              : "Tout Est Compris dans Votre Loyer"}
          </h2>
          <p className="text-[#57534E] text-center max-w-3xl mx-auto mb-16">
            {language === "en"
              ? "No hidden fees, no surprise bills. One simple monthly payment covers everything."
              : "Pas de frais cachés, pas de mauvaises surprises. Un seul paiement mensuel couvre tout."}
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Home, label: language === "en" ? "Furnished private room" : "Chambre privée meublée" },
              { icon: Euro, label: language === "en" ? "Rent & all utilities" : "Loyer & toutes les charges" },
              { icon: Wifi, label: language === "en" ? "Pro fiber internet" : "Internet fibre Pro" },
              { icon: Waves, label: language === "en" ? "Pool access" : "Accès piscine" },
              { icon: Dumbbell, label: language === "en" ? "Gym & sauna" : "Salle de sport & sauna" },
              { icon: Star, label: language === "en" ? "Weekly yoga & sports classes" : "Cours de yoga & sport hebdomadaires" },
              { icon: Users, label: language === "en" ? "Monthly community events" : "Événements communautaires mensuels" },
              { icon: Check, label: language === "en" ? "Housekeeping 2x/week" : "Ménage 2x/semaine" },
              { icon: UtensilsCrossed, label: language === "en" ? "Monthly meal baskets" : "Paniers repas mensuels" },
              { icon: Tv, label: language === "en" ? "Streaming subscriptions" : "Abonnements streaming" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-[#FAF9F6]">
                <item.icon className="w-5 h-5 text-[#D4A574] flex-shrink-0" />
                <span className="text-[#1C1917]">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/rates"
              className="inline-flex items-center gap-2 text-[#D4A574] font-medium hover:underline"
            >
              {language === "en" ? "See detailed pricing" : "Voir les tarifs détaillés"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== POUR QUI ? ===== */}
      <section className="py-24 lg:py-32 bg-[#FAF9F6]">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-16 text-center"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "Who Lives at La Villa?"
              : "Qui Vit à La Villa ?"}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                Icon: MapPin,
                title: language === "en" ? "Cross-Border Workers" : "Frontaliers",
                desc: language === "en"
                  ? "Working in Geneva, living in France. Save on rent while enjoying Swiss salaries."
                  : "Travailler à Genève, vivre en France. Économisez sur le loyer tout en profitant d'un salaire suisse.",
              },
              {
                Icon: Globe,
                title: language === "en" ? "Expats & Internationals" : "Expats & Internationaux",
                desc: language === "en"
                  ? "New to the area? Join a welcoming community. No need to furnish or deal with admin alone."
                  : "Nouveau dans la région ? Rejoignez une communauté accueillante. Pas besoin de meubler ni de gérer l'administratif seul.",
              },
              {
                Icon: Briefcase,
                title: language === "en" ? "Young Professionals" : "Jeunes Professionnels",
                desc: language === "en"
                  ? "Start your career near Geneva with flexible, affordable, premium housing."
                  : "Démarrez votre carrière près de Genève avec un logement flexible, abordable et premium.",
              },
              {
                Icon: Laptop2,
                title: language === "en" ? "Remote Workers" : "Télétravailleurs",
                desc: language === "en"
                  ? "Coworking spaces, fast fiber internet, and a community of like-minded professionals."
                  : "Espaces coworking, fibre internet rapide et une communauté de professionnels motivés.",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-[#F5F2ED] rounded-xl flex items-center justify-center mb-4 mx-auto"><item.Icon className="w-6 h-6 text-[#D4A574]" /></div>
                <h3 className="text-lg font-medium text-[#1C1917] mb-2">{item.title}</h3>
                <p className="text-sm text-[#57534E] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COLOCATION VS STUDIO COMPARATIF ===== */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-4 text-center"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "Coliving vs Studio in Geneva: The Comparison"
              : "Colocation vs Studio à Genève : Le Comparatif"}
          </h2>
          <p className="text-[#57534E] text-center max-w-3xl mx-auto mb-12">
            {language === "en"
              ? "See why our coliving is the smartest choice for living near Geneva."
              : "Découvrez pourquoi notre colocation est le choix le plus malin pour vivre près de Genève."}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#FAF9F6]">
                  <th className="border border-[#E7E5E4] px-6 py-4 text-left font-medium text-[#1C1917]"></th>
                  <th className="border border-[#E7E5E4] px-6 py-4 text-left font-medium text-[#D4A574]">
                    La Villa Coliving
                  </th>
                  <th className="border border-[#E7E5E4] px-6 py-4 text-left font-medium text-[#78716C]">
                    Studio Genève
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  [language === "en" ? "Monthly cost" : "Coût mensuel", language === "en" ? "From 1,380 CHF (all-incl.)" : "Dès 1 380 CHF (tout compris)", "1 800 - 2 500 CHF + charges"],
                  [language === "en" ? "Furnished" : "Meublé", "✓ " + (language === "en" ? "Fully furnished" : "Entièrement meublé"), language === "en" ? "Usually unfurnished" : "Généralement non meublé"],
                  [language === "en" ? "Pool" : "Piscine", "✓ " + (language === "en" ? "Pool included" : "Piscine incluse"), "✗"],
                  ["Gym / Sauna", "✓ " + (language === "en" ? "Included" : "Inclus"), "✗ " + (language === "en" ? "Extra 80-150 CHF/month" : "En plus : 80-150 CHF/mois")],
                  ["Internet", "✓ " + (language === "en" ? "Pro fiber included" : "Fibre Pro incluse"), "~50 CHF/" + (language === "en" ? "month" : "mois")],
                  [language === "en" ? "Cleaning" : "Ménage", "✓ " + (language === "en" ? "2x/week, included" : "2x/semaine, inclus"), language === "en" ? "You manage" : "À votre charge"],
                  [language === "en" ? "Community" : "Communauté", "✓ " + (language === "en" ? "Monthly events, yoga & sports, meal baskets" : "Événements mensuels, yoga & sport, paniers repas"), "✗ " + (language === "en" ? "Isolated" : "Isolé")],
                  [language === "en" ? "Lease" : "Bail", language === "en" ? "12 months, renewable" : "12 mois, renouvelable", language === "en" ? "12+ months lease" : "Bail 12+ mois"],
                  [language === "en" ? "Deposit" : "Caution", language === "en" ? "2 months" : "2 mois", language === "en" ? "3 months typical" : "3 mois généralement"],
                ].map(([label, villa, studio], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#FAF9F6]"}>
                    <td className="border border-[#E7E5E4] px-6 py-3 font-medium text-[#1C1917]">{label}</td>
                    <td className="border border-[#E7E5E4] px-6 py-3 text-[#1C1917]">{villa}</td>
                    <td className="border border-[#E7E5E4] px-6 py-3 text-[#57534E]">{studio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-24 lg:py-32 bg-[#FAF9F6]">
        <div className="max-w-3xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-12 text-center"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "Frequently Asked Questions"
              : "Questions Fréquentes sur la Colocation près de Genève"}
          </h2>

          <div className="space-y-4">
            {colocationFAQ.map((item, i) => (
              <div key={i} className="bg-white border border-[#E7E5E4]">
                <button
                  onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-medium text-[#1C1917] pr-4">{item.q}</span>
                  {openFAQ === i ? (
                    <ChevronUp className="w-5 h-5 text-[#D4A574] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#78716C] flex-shrink-0" />
                  )}
                </button>
                {openFAQ === i && (
                  <div className="px-6 pb-5 text-[#57534E] leading-relaxed border-t border-[#E7E5E4] pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="py-24 lg:py-32 bg-[#1C1917] text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2
            className="text-3xl md:text-4xl font-light mb-6"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "Ready to Find Your Room Near Geneva?"
              : "Prêt à Trouver Votre Chambre près de Genève ?"}
          </h2>
          <p className="text-[#78716C] text-lg mb-10 max-w-xl mx-auto">
            {language === "en"
              ? "Apply in 2 minutes. We'll get back to you within 48 hours. Move in within 2 weeks."
              : "Candidatez en 2 minutes. Réponse sous 48h. Emménagement en 2 semaines."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/join-us"
              className="inline-flex items-center gap-2 bg-[#D4A574] text-white px-8 py-4 text-sm uppercase tracking-wider hover:bg-[#44403C] transition-colors"
            >
              {language === "en" ? "Apply Now" : "Candidater Maintenant"}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/rates"
              className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 text-sm uppercase tracking-wider hover:bg-white hover:text-[#1C1917] transition-colors"
            >
              {language === "en" ? "View Pricing" : "Voir les Tarifs"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
