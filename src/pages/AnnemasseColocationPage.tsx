import { Link } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";
import {
  MapPin,
  Train,
  Home,
  Users,
  Check,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Euro,
} from "lucide-react";

// ───────────────────────────────────────────────────────────────────────
// FAQ (FR) — cible "colocation annemasse" 880/mois + secondaires
// ───────────────────────────────────────────────────────────────────────
const annemasseFAQ = [
  {
    q: "Combien coûte une colocation à Annemasse chez La Villa Coliving ?",
    a: "Nos chambres privatives à Annemasse Agglo (Ville-la-Grand, Ambilly, Annemasse) sont à partir de 1 380 CHF/mois tout inclus. Le prix comprend le loyer, les charges (eau, électricité, chauffage), la fibre 8 Gbps, le ménage 2 fois par semaine des communs, l'accès à la piscine chauffée, à la salle de sport et au sauna, les cours de yoga et fitness privés hebdomadaires, et les événements communautaires mensuels. Pas de frais d'agence, pas de frais de dossier.",
  },
  {
    q: "Combien de temps pour aller à Genève depuis Annemasse ?",
    a: "Depuis Annemasse, Genève Cornavin est à 15 minutes en Léman Express direct (sans correspondance) depuis la gare d'Annemasse. En voiture, comptez 15-20 min selon la douane (Moillesulaz est la plus rapide). Le Tram 17 TPG (Lancy-Pont-Rouge ↔ Annemasse) dessert aussi le centre de Genève. L'aéroport de Genève est à 25-30 min en voiture.",
  },
  {
    q: "Quel quartier d'Annemasse Agglo choisir : Ville-la-Grand, Ambilly ou Annemasse ?",
    a: "Cela dépend de votre priorité. Ambilly est la commune la plus proche de la frontière suisse (Moillesulaz à 5 min à pied, Tram 17 à 5 min — idéal si vous voulez marcher ou pédaler vers Genève). Ville-la-Grand est résidentielle et calme, frontière mitoyenne, idéale pour ceux qui cherchent du vert (réserve naturelle du Foron à la porte). Annemasse centre (quartier Romagny pour Le Lodge) offre la proximité de la gare Léman Express et de toutes les commodités urbaines.",
  },
  {
    q: "Faut-il un permis G pour vivre à Annemasse et travailler à Genève ?",
    a: "Oui, pour travailler à Genève en habitant côté France, vous avez besoin d'un permis G (permis frontalier). Votre employeur suisse en fait la demande. Annemasse Agglo se situe dans la zone frontalière éligible. Le permis G est délivré rapidement (souvent en quelques semaines) une fois le contrat signé.",
  },
  {
    q: "Quelle est la durée du bail à Annemasse ?",
    a: "Le bail est un contrat de location meublée de 12 mois renouvelable, avec un préavis d'1 mois. Cela convient aux frontaliers qui s'installent durablement comme à ceux en période d'essai à Genève. Le bail respecte le cadre français (loi Alur), avec une caution de 2 mois et aucun frais d'agence.",
  },
  {
    q: "Quelle différence entre colocation classique et coliving à Annemasse ?",
    a: "Une colocation classique implique généralement de gérer soi-même les charges (électricité, eau, internet), le ménage, l'entretien, et de meubler sa chambre. Notre coliving à Annemasse inclut tout dans un seul loyer : charges, fibre, ménage 2x/semaine, mobilier design, accès aux espaces premium (piscine, gym, sauna), événements communautaires. Le prix au mètre carré reste cohérent avec une colocation classique haut de gamme à Annemasse, mais sans aucune mauvaise surprise.",
  },
  {
    q: "Comment réserver une chambre à Annemasse ?",
    a: "Remplissez le formulaire sur notre page Candidature. Nous vous rappelons sous 48h pour un échange (motivation, contexte pro, disponibilité). Si le fit est bon, une visite est organisée dans la résidence qui correspond à votre profil (La Villa à Ville-la-Grand, Le Loft à Ambilly, Le Lodge à Annemasse Romagny). L'emménagement peut se faire en 2 à 4 semaines selon les disponibilités.",
  },
];

export function AnnemasseColocationPage() {
  const { language } = useLanguage();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // JSON-LD FAQPage — rich snippet
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: annemasseFAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <main className="relative pt-16">
      <SEO
        title={
          language === "en"
            ? "Shared housing Annemasse 2026: 29 rooms"
            : "Colocation Annemasse 2026 : dès 1 380 CHF"
        }
        description={
          language === "en"
            ? "Shared housing Annemasse 2026: 29 furnished rooms all-inclusive from CHF 1,380/mo. Léman Express direct to Geneva 15 min. Cross-border living, no agency fees."
            : "Colocation Annemasse : 29 chambres meublées tout inclus dès 1 380 CHF/mois. Léman Express direct Genève 15 min. Coliving frontaliers. Sans frais d'agence."
        }
        url="https://www.lavillacoliving.com/annemasse-colocation"
        image="https://www.lavillacoliving.com/images/le lodge/exterior/la villa coliving le lodge-14.webp"
        jsonLd={faqSchema}
      />

      {/* ===== HERO ===== */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-b from-white to-[#FAF9F6]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="text-xs text-[#D4A574] uppercase tracking-[0.3em] mb-4 block font-medium">
            {language === "en" ? "Shared housing Annemasse Agglo" : "Colocation Annemasse Agglo"}
          </span>
          <h1
            className="text-4xl md:text-6xl font-light text-[#1C1917] mb-6 leading-tight"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "Shared housing in Annemasse — 29 premium rooms from CHF 1,380/mo"
              : "Colocation à Annemasse — 29 chambres premium dès 1 380 CHF/mois"}
          </h1>
          <p className="text-lg md:text-xl text-[#57534E] max-w-3xl mx-auto leading-relaxed mb-10 font-medium">
            {language === "en"
              ? "Three premium coliving houses in Annemasse Agglo (Ville-la-Grand, Ambilly, Annemasse) — for cross-border workers who want a Swiss salary with French cost of living. Direct Léman Express to Geneva Cornavin in 15 min."
              : "Trois maisons coliving premium dans Annemasse Agglo (Ville-la-Grand, Ambilly, Annemasse) — pour frontaliers qui veulent un salaire suisse avec le coût de la vie français. Léman Express direct Genève Cornavin en 15 min."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/candidature"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#1C1917] text-white font-semibold rounded-full hover:bg-[#44403C] transition-colors"
            >
              {language === "en" ? "Apply now" : "Candidater"}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/nos-maisons"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#1C1917] text-[#1C1917] font-semibold rounded-full hover:bg-[#1C1917] hover:text-white transition-colors"
            >
              {language === "en" ? "See the 3 houses" : "Voir les 3 maisons"}
            </Link>
          </div>
        </div>
      </section>

      {/* ===== WHY ANNEMASSE ===== */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-12 text-center"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "Why Annemasse Agglo when you work in Geneva"
              : "Pourquoi Annemasse Agglo quand on travaille à Genève"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-[#D4A574]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Euro className="w-7 h-7 text-[#D4A574]" />
              </div>
              <h3 className="text-xl font-medium text-[#1C1917] mb-3">
                {language === "en" ? "30-50% cheaper than Geneva" : "30 à 50 % moins cher que Genève"}
              </h3>
              <p className="text-[#57534E] leading-relaxed">
                {language === "en"
                  ? "Same Swiss salary, but rent and daily expenses 30-50 % lower than central Geneva. A 12 m² room in Geneva costs CHF 1,800-2,500 — we offer the same comfort at CHF 1,380 all-inclusive."
                  : "Même salaire suisse, mais loyer et coût de la vie 30 à 50 % inférieurs au centre de Genève. Une chambre 12 m² à Genève coûte 1 800-2 500 CHF — on offre le même confort à 1 380 CHF tout inclus."}
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-[#D4A574]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Train className="w-7 h-7 text-[#D4A574]" />
              </div>
              <h3 className="text-xl font-medium text-[#1C1917] mb-3">
                {language === "en" ? "15 min direct to Geneva" : "15 min direct vers Genève"}
              </h3>
              <p className="text-[#57534E] leading-relaxed">
                {language === "en"
                  ? "Léman Express direct from Annemasse station to Geneva Cornavin in 15 minutes, no transfer. Tram 17 TPG and direct buses also connect to central Geneva."
                  : "Léman Express direct depuis la gare d'Annemasse jusqu'à Genève Cornavin en 15 minutes, sans correspondance. Le Tram 17 TPG et des bus directs desservent aussi le centre de Genève."}
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-[#D4A574]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-[#D4A574]" />
              </div>
              <h3 className="text-xl font-medium text-[#1C1917] mb-3">
                {language === "en" ? "A real community" : "Une vraie communauté"}
              </h3>
              <p className="text-[#57534E] leading-relaxed">
                {language === "en"
                  ? "29 housemates selected by application — mostly cross-border professionals, young pros and expats working in Geneva. Monthly events, weekly private yoga and fitness, shared meals."
                  : "29 colocataires sélectionnés sur dossier — majoritairement frontaliers, jeunes pros et expats travaillant à Genève. Événements mensuels, cours de yoga et fitness privés hebdomadaires, repas partagés."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 3 RÉSIDENCES ===== */}
      <section className="py-24 lg:py-32 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-4 text-center"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "Our 3 coliving houses in Annemasse Agglo"
              : "Nos 3 maisons coliving à Annemasse Agglo"}
          </h2>
          <p className="text-[#57534E] text-center max-w-3xl mx-auto mb-12">
            {language === "en"
              ? "29 furnished rooms across 3 design houses — same all-inclusive pricing, different vibes. Pick the location that fits your commute and lifestyle."
              : "29 chambres meublées dans 3 maisons design — même prix tout inclus, ambiances différentes. Choisissez la résidence qui colle à votre trajet et votre style de vie."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* La Villa */}
            <Link
              to="/lavilla"
              className="bg-white p-8 hover:shadow-xl transition-shadow group"
            >
              <h3 className="text-2xl font-medium text-[#1C1917] mb-2">La Villa</h3>
              <p className="text-sm text-[#D4A574] uppercase tracking-wider mb-4">
                Ville-la-Grand · 10 chambres
              </p>
              <p className="text-[#57534E] leading-relaxed mb-6">
                {language === "en"
                  ? "370 m² on a 2,000 m² estate bordering a nature reserve. Heated pool 12×5 m, sauna, gym. The Swiss border adjoins La Villa."
                  : "370 m² sur un domaine de 2 000 m² bordant une réserve naturelle. Piscine chauffée 12×5 m, sauna, gym. La frontière suisse est mitoyenne à La Villa."}
              </p>
              <span className="inline-flex items-center gap-2 text-[#D4A574] font-medium group-hover:gap-3 transition-all">
                {language === "en" ? "Discover La Villa" : "Découvrir La Villa"}
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            {/* Le Loft */}
            <Link
              to="/leloft"
              className="bg-white p-8 hover:shadow-xl transition-shadow group"
            >
              <h3 className="text-2xl font-medium text-[#1C1917] mb-2">Le Loft</h3>
              <p className="text-sm text-[#D4A574] uppercase tracking-wider mb-4">
                Ambilly · 7 chambres
              </p>
              <p className="text-[#57534E] leading-relaxed mb-6">
                {language === "en"
                  ? "Urban design, indoor heated pool year-round, terrace. Tram 17 (Lancy-Pont-Rouge ↔ Annemasse) is a 5-min walk away."
                  : "Design urbain, piscine intérieure chauffée toute l'année, terrasse. Le Tram 17 (Lancy-Pont-Rouge ↔ Annemasse) est à 5 minutes à pied."}
              </p>
              <span className="inline-flex items-center gap-2 text-[#D4A574] font-medium group-hover:gap-3 transition-all">
                {language === "en" ? "Discover Le Loft" : "Découvrir Le Loft"}
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            {/* Le Lodge */}
            <Link
              to="/lelodge"
              className="bg-white p-8 hover:shadow-xl transition-shadow group"
            >
              <h3 className="text-2xl font-medium text-[#1C1917] mb-2">Le Lodge</h3>
              <p className="text-sm text-[#D4A574] uppercase tracking-wider mb-4">
                Annemasse (Romagny) · 12 chambres
              </p>
              <p className="text-[#57534E] leading-relaxed mb-6">
                {language === "en"
                  ? "Opened January 2026. 500 m² over 4 buildings on 1,500 m² of gardens. Annemasse station 9-min walk — Léman Express direct to Cornavin in 15 min."
                  : "Ouvert en janvier 2026. 500 m² sur 4 bâtiments au cœur de 1 500 m² de jardins. Gare d'Annemasse à 9 min à pied — Léman Express direct Cornavin en 15 min."}
              </p>
              <span className="inline-flex items-center gap-2 text-[#D4A574] font-medium group-hover:gap-3 transition-all">
                {language === "en" ? "Discover Le Lodge" : "Découvrir Le Lodge"}
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TRANSPORT ===== */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-12 text-center"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "Annemasse ↔ Geneva — real travel times"
              : "Annemasse ↔ Genève — temps de trajet réels"}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#FAF9F6]">
                  <th className="border border-[#E7E5E4] px-6 py-4 text-left font-medium text-[#1C1917]">
                    {language === "en" ? "From Annemasse to" : "Depuis Annemasse vers"}
                  </th>
                  <th className="border border-[#E7E5E4] px-6 py-4 text-left font-medium text-[#1C1917]">
                    {language === "en" ? "Time" : "Temps"}
                  </th>
                  <th className="border border-[#E7E5E4] px-6 py-4 text-left font-medium text-[#1C1917]">
                    {language === "en" ? "Mode" : "Mode"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  [language === "en" ? "Geneva Cornavin (city center)" : "Genève Cornavin (centre)", "15 min", language === "en" ? "Léman Express direct" : "Léman Express direct"],
                  [language === "en" ? "Geneva Eaux-Vives" : "Genève Eaux-Vives", "20 min", language === "en" ? "Tram 17 TPG" : "Tram 17 TPG"],
                  [language === "en" ? "Geneva Airport" : "Aéroport de Genève", "25-30 min", language === "en" ? "Car (A40 highway)" : "Voiture (autoroute A40)"],
                  [language === "en" ? "Moillesulaz Swiss border" : "Frontière de Moillesulaz", "2-5 min", language === "en" ? "Walk / bike (Ambilly), 5 min car (Lodge/Villa)" : "À pied / vélo (Ambilly), 5 min voiture (Lodge/Villa)"],
                  [language === "en" ? "Geneva CHUV / WHO area" : "Genève CHUV / OMS", "20-25 min", language === "en" ? "Tram 17 + correspondence" : "Tram 17 + correspondance"],
                ].map(([dest, time, mode], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#FAF9F6]"}>
                    <td className="border border-[#E7E5E4] px-6 py-3 font-medium text-[#1C1917]">{dest}</td>
                    <td className="border border-[#E7E5E4] px-6 py-3 text-[#D4A574] font-bold">{time}</td>
                    <td className="border border-[#E7E5E4] px-6 py-3 text-[#57534E]">{mode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== ALL INCLUDED ===== */}
      <section className="py-24 lg:py-32 bg-[#FAF9F6]">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-4 text-center"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "What's included in CHF 1,380/month"
              : "Ce qui est inclus dans 1 380 CHF/mois"}
          </h2>
          <p className="text-[#57534E] text-center max-w-3xl mx-auto mb-12">
            {language === "en"
              ? "One payment, zero surprises. No agency fees, no application fees."
              : "Un seul paiement, zéro surprise. Aucun frais d'agence, aucun frais de dossier."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {(language === "en"
              ? [
                  "Furnished private room with quality bed and ergonomic desk",
                  "All utilities (water, electricity, heating)",
                  "8 Gbps fiber internet",
                  "Twice-weekly cleaning of common areas",
                  "Heated pool, sauna and gym access",
                  "Private weekly yoga and fitness classes",
                  "Streaming subscriptions (Netflix, Canal+, etc.)",
                  "Monthly meal basket and pizza party",
                  "Pool, garden and property maintenance",
                  "Bedding and towels provided",
                ]
              : [
                  "Chambre privée meublée avec lit qualité et bureau ergonomique",
                  "Toutes charges (eau, électricité, chauffage)",
                  "Internet fibre 8 Gbps",
                  "Ménage 2 fois par semaine des espaces communs",
                  "Accès piscine chauffée, sauna et salle de sport",
                  "Cours privés de yoga et fitness hebdomadaires",
                  "Abonnements streaming (Netflix, Canal+, etc.)",
                  "Panier repas mensuel et pizza party",
                  "Entretien piscine, jardin et propriété",
                  "Parure de linge et serviettes fournies",
                ]
            ).map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <Check className="text-[#D4A574] mt-1 flex-shrink-0" size={20} />
                <span className="text-[#57534E] font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ICP ===== */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-12 text-center"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en" ? "Who lives at our Annemasse coliving" : "Qui habite notre coliving à Annemasse"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Home className="w-10 h-10 text-[#D4A574] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#1C1917] mb-2">
                {language === "en" ? "Cross-border workers" : "Frontaliers"}
              </h3>
              <p className="text-[#57534E] text-sm leading-relaxed">
                {language === "en"
                  ? "Permanent contracts (CDI) in Geneva, daily commute via Léman Express. The majority of our community."
                  : "CDI à Genève, trajet quotidien en Léman Express. La majorité de notre communauté."}
              </p>
            </div>
            <div>
              <Users className="w-10 h-10 text-[#D4A574] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#1C1917] mb-2">
                {language === "en" ? "Young professionals" : "Jeunes professionnels"}
              </h3>
              <p className="text-[#57534E] text-sm leading-relaxed">
                {language === "en"
                  ? "Early to mid-career, looking for both quality housing and a real social network in their new city."
                  : "Début et mi-carrière, qui cherchent à la fois un logement de qualité et un vrai réseau social dans leur nouvelle ville."}
              </p>
            </div>
            <div>
              <MapPin className="w-10 h-10 text-[#D4A574] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#1C1917] mb-2">
                {language === "en" ? "Expats and OI staff" : "Expats et personnel OI"}
              </h3>
              <p className="text-[#57534E] text-sm leading-relaxed">
                {language === "en"
                  ? "International staff (WHO, UN, ICRC) and expats who want a soft landing in the Geneva area."
                  : "Personnel international (OMS, ONU, CICR) et expatriés qui veulent un atterrissage en douceur dans la région genevoise."}
              </p>
            </div>
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
            {language === "en" ? "Frequently asked questions about Annemasse coliving" : "Questions fréquentes sur la colocation à Annemasse"}
          </h2>
          <div className="space-y-4">
            {annemasseFAQ.map((item, i) => (
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

      {/* ===== CTA ===== */}
      <section className="py-24 lg:py-32 bg-[#1C1917] text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2
            className="text-3xl md:text-4xl font-light mb-6"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "Ready for a coliving room in Annemasse?"
              : "Prêt pour une chambre en colocation à Annemasse ?"}
          </h2>
          <p className="text-lg text-white/80 mb-10 leading-relaxed">
            {language === "en"
              ? "Tell us about you and your move plans — we get back to you within 48 hours, and a visit can be organised within 2 weeks."
              : "Dites-nous qui vous êtes et votre projet d'emménagement — on revient sous 48h, et une visite peut s'organiser sous 2 semaines."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/candidature"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1C1917] font-semibold rounded-full hover:bg-gray-100 transition-colors"
            >
              {language === "en" ? "Apply now" : "Candidater"}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/colocation-geneve"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-[#1C1917] transition-colors"
            >
              {language === "en" ? "See Geneva-side option" : "Voir l'option côté Genève"}
            </Link>
          </div>
        </div>
      </section>

      {/* ===== INTERNAL LINKING — Essentials guides for un-crawled articles ===== */}
      <section className="py-12 lg:py-16 bg-[#FAF9F6]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-light text-[#1C1917] mb-8 text-center" style={{ fontFamily: "DM Serif Display, serif" }}>
            {language === "en" ? "Essential reads for cross-border workers" : "Lectures essentielles pour les frontaliers"}
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm max-w-3xl mx-auto">
            {[
              { fr: "Où habiter quand on est frontalier suisse — Top 7 villes côté France", en: "Where to live as a Swiss cross-border worker — Top 7 French towns", slug: "ou-habiter-frontalier-suisse-villes-france-pas-cher" },
              { fr: "Télétravail frontalier Genève : règles 2026", en: "Cross-border remote work Geneva: 2026 rules", slug: "teletravail-frontalier-geneve-regles-2026" },
              { fr: "Grand Genève 2026 : nouveautés pour les frontaliers", en: "Greater Geneva 2026: what's new for cross-border workers", slug: "grand-geneve-2026-nouveautes-frontaliers" },
              { fr: "Organisations internationales à Genève : où habiter", en: "Geneva international organisations: where to live", slug: "organisations-internationales-geneve-ou-habiter" },
              { fr: "Économies du coliving tout-inclus près de Genève", en: "All-inclusive coliving savings near Geneva", slug: "economies-coliving-tout-inclus-geneve" },
              { fr: "Temps de trajet Annemasse ↔ Genève par quartier", en: "Annemasse ↔ Geneva travel times by district", slug: "temps-trajet-annemasse-geneve-par-quartier" },
            ].map((item) => (
              <li key={item.slug} className="flex items-start gap-2">
                <span className="text-[#D4A574]">→</span>
                <Link to={`/blog/${item.slug}`} className="text-[#1C1917] hover:text-[#D4A574] hover:underline transition-colors">
                  {language === "en" ? item.en : item.fr}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== Internal linking (existing nav strip) ===== */}
      <section className="py-12 bg-white border-t border-[#E7E5E4]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm text-[#78716C] mb-4">
            {language === "en" ? "Related pages" : "Pages liées"}
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link to="/colocation-geneve" className="text-[#1C1917] underline hover:text-[#D4A574]">
              {language === "en" ? "Shared housing Geneva" : "Colocation Genève"}
            </Link>
            <span className="text-[#E7E5E4]">·</span>
            <Link to="/le-coliving" className="text-[#1C1917] underline hover:text-[#D4A574]">
              {language === "en" ? "What is coliving" : "Le coliving"}
            </Link>
            <span className="text-[#E7E5E4]">·</span>
            <Link to="/nos-maisons" className="text-[#1C1917] underline hover:text-[#D4A574]">
              {language === "en" ? "Our 3 houses" : "Nos 3 maisons"}
            </Link>
            <span className="text-[#E7E5E4]">·</span>
            <Link to="/tarifs" className="text-[#1C1917] underline hover:text-[#D4A574]">
              {language === "en" ? "Pricing" : "Tarifs"}
            </Link>
            <span className="text-[#E7E5E4]">·</span>
            <Link to="/blog/meilleurs-quartiers-frontaliers-geneve" className="text-[#1C1917] underline hover:text-[#D4A574]">
              {language === "en" ? "Best cross-border neighborhoods" : "Meilleurs quartiers frontaliers"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
