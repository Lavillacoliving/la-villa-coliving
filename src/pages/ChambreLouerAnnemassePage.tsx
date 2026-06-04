import { Link } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";
import {
  BedDouble,
  Train,
  Check,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Euro,
  Calendar,
  Sparkles,
} from "lucide-react";

// ───────────────────────────────────────────────────────────────────────
// FAQ (FR) — cible "chambre à louer annemasse" 170/mois + "studio annemasse" 590/mois
// ───────────────────────────────────────────────────────────────────────
const chambreFAQ = [
  {
    q: "Quel est le prix d'une chambre meublée à Annemasse chez La Villa Coliving ?",
    a: "Nos chambres meublées à Annemasse Agglo sont à partir de 1 380 CHF/mois tout inclus (loyer + charges + fibre + ménage 2x/semaine + accès piscine/sauna/gym + cours fitness privés + abonnements streaming). Pas de frais d'agence, pas de frais de dossier, caution équivalente à 2 mois de loyer hors charges (restituée sous 30 jours après l'état des lieux).",
  },
  {
    q: "Vos chambres à louer à Annemasse sont-elles vraiment meublées ?",
    a: "Oui, intégralement. Chaque chambre dispose d'un lit double qualité avec parure de linge, d'un bureau ergonomique, de rangements (placard sur mesure au Lodge), et selon les résidences d'une salle de bain privative. Les espaces communs (cuisine, salon, terrasse, piscine, sauna, salle de sport) sont aussi entièrement équipés. Vous n'avez qu'à arriver avec vos valises.",
  },
  {
    q: "Quelle différence entre studio à Annemasse et chambre en coliving ?",
    a: "Un studio à Annemasse coûte en moyenne 700-950 €/mois charges non comprises (eau, électricité, internet, ménage, mobilier en plus). Nos chambres en coliving coûtent 1 380 CHF tout inclus, avec accès à 200 m² d'espaces communs et 25 services. Au final, le coût mensuel d'un studio Annemasse meublé + équipé + tout charges incluses se rapproche de 1 200-1 400 CHF — pour beaucoup moins de m² communs et zéro communauté.",
  },
  {
    q: "Pour combien de temps puis-je louer une chambre à Annemasse ?",
    a: "Le bail standard est de 12 mois renouvelable, avec préavis d'1 mois. Idéal pour les frontaliers qui s'installent durablement ou en période d'essai à Genève. Le cadre est conforme à la loi française (Alur). Nous étudions au cas par cas des baux plus courts (6 mois) selon disponibilité.",
  },
  {
    q: "Quelles sont les disponibilités actuelles à Annemasse ?",
    a: "Les disponibilités évoluent en continu sur nos 29 chambres réparties dans 3 résidences (La Villa à Ville-la-Grand, Le Loft à Ambilly, Le Lodge à Annemasse Romagny). Le moyen le plus fiable de connaître les disponibilités est de candidater via notre page Candidature — nous vous indiquons sous 48h les chambres libres ou bientôt libérées qui matchent votre profil.",
  },
  {
    q: "Comment se passe la visite avant de signer ?",
    a: "Après votre candidature, nous organisons une visite physique ou virtuelle (selon votre localisation) de la résidence qui correspond à votre profil. La visite physique dure 30-45 min : tour de la maison, de la chambre disponible, présentation des espaces communs et services. Vous rencontrez aussi un coliver actuel pour avoir un retour terrain.",
  },
];

export function ChambreLouerAnnemassePage() {
  const { language } = useLanguage();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: chambreFAQ.map((item) => ({
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
            ? "Furnished rooms Annemasse 2026 from CHF 1,380"
            : "Chambre à louer Annemasse 2026 : dès 1 380 CHF"
        }
        description={
          language === "en"
            ? "Furnished rooms for rent in Annemasse 2026, all-inclusive from CHF 1,380/mo. Pool, gym, sauna, fiber up to 8 Gb/s. Léman Express direct to Geneva 15 min. No agency fees."
            : "Chambre meublée à louer à Annemasse en 2026, tout inclus dès 1 380 CHF/mois. Piscine, gym, sauna, fibre jusqu'à 8 Gb/s. Léman Express direct Genève 15 min. Sans frais d'agence."
        }
        url="https://www.lavillacoliving.com/chambre-a-louer-annemasse"
        image="https://www.lavillacoliving.com/images/le lodge/rooms/la villa coliving le lodge-78.webp"
        jsonLd={faqSchema}
      />

      {/* ===== HERO ===== */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-b from-white to-[#FAF9F6]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="text-xs text-[#D4A574] uppercase tracking-[0.3em] mb-4 block font-medium">
            {language === "en" ? "Furnished rooms · Annemasse 74100" : "Chambres meublées · Annemasse 74100"}
          </span>
          <h1
            className="text-4xl md:text-6xl font-light text-[#1C1917] mb-6 leading-tight"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "Furnished rooms to rent in Annemasse — from CHF 1,380/mo all-inclusive"
              : "Chambres meublées à louer à Annemasse — dès 1 380 CHF/mois tout inclus"}
          </h1>
          <p className="text-lg md:text-xl text-[#57534E] max-w-3xl mx-auto leading-relaxed mb-10 font-medium">
            {language === "en"
              ? "29 furnished rooms across 3 design houses in Annemasse Agglo. Move in with just your suitcases — bed, desk, fiber, utilities, weekly cleaning, pool & gym all included."
              : "29 chambres meublées dans 3 maisons design à Annemasse Agglo. Emménagez avec une valise — lit, bureau, fibre, charges, ménage 2x/semaine, piscine et salle de sport sont inclus."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/candidature"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#1C1917] text-white font-semibold rounded-full hover:bg-[#44403C] transition-colors"
            >
              {language === "en" ? "Check availability" : "Voir les disponibilités"}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/tarifs"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#1C1917] text-[#1C1917] font-semibold rounded-full hover:bg-[#1C1917] hover:text-white transition-colors"
            >
              {language === "en" ? "See pricing" : "Voir les tarifs"}
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TYPES OF ROOMS ===== */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-12 text-center"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en" ? "Choose your room type" : "Choisissez votre type de chambre"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Standard */}
            <div className="bg-[#FAF9F6] p-8">
              <BedDouble className="w-10 h-10 text-[#D4A574] mb-4" />
              <h3 className="text-xl font-medium text-[#1C1917] mb-2">
                {language === "en" ? "Standard room" : "Chambre standard"}
              </h3>
              <p className="text-2xl font-bold text-[#D4A574] mb-4">CHF 1,380/mo</p>
              <ul className="space-y-2 text-sm text-[#57534E]">
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#D4A574] mt-0.5 flex-shrink-0" /> {language === "en" ? "12-15 m² furnished" : "12-15 m² meublée"}</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#D4A574] mt-0.5 flex-shrink-0" /> {language === "en" ? "Shared bathroom" : "Salle de bain partagée"}</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#D4A574] mt-0.5 flex-shrink-0" /> {language === "en" ? "Available at La Villa & Le Loft" : "Disponible à La Villa et Le Loft"}</li>
              </ul>
            </div>

            {/* Premium with private bathroom */}
            <div className="bg-[#1C1917] text-white p-8 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D4A574] text-[#1C1917] text-xs uppercase tracking-wider px-3 py-1 rounded-full font-bold">
                {language === "en" ? "Most popular" : "Le plus demandé"}
              </span>
              <BedDouble className="w-10 h-10 text-[#D4A574] mb-4" />
              <h3 className="text-xl font-medium mb-2">
                {language === "en" ? "Room with private bathroom" : "Chambre salle de bain privative"}
              </h3>
              <p className="text-2xl font-bold text-[#D4A574] mb-4">CHF 1,380/mo</p>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#D4A574] mt-0.5 flex-shrink-0" /> {language === "en" ? "17-19 m² furnished" : "17-19 m² meublée"}</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#D4A574] mt-0.5 flex-shrink-0" /> {language === "en" ? "Private en-suite bathroom" : "Salle de bain privative"}</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#D4A574] mt-0.5 flex-shrink-0" /> {language === "en" ? "All 12 rooms at Le Lodge" : "Les 12 chambres du Lodge"}</li>
              </ul>
            </div>

            {/* Studio alternative */}
            <div className="bg-[#FAF9F6] p-8">
              <Sparkles className="w-10 h-10 text-[#D4A574] mb-4" />
              <h3 className="text-xl font-medium text-[#1C1917] mb-2">
                {language === "en" ? "Studio Annemasse — alternative" : "Studio Annemasse — alternative"}
              </h3>
              <p className="text-2xl font-bold text-[#78716C] mb-4">700-950 €/mo +</p>
              <ul className="space-y-2 text-sm text-[#57534E]">
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#78716C] mt-0.5 flex-shrink-0" /> {language === "en" ? "Charges not included" : "Charges en plus"}</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#78716C] mt-0.5 flex-shrink-0" /> {language === "en" ? "Furniture not included" : "Mobilier non inclus"}</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#78716C] mt-0.5 flex-shrink-0" /> {language === "en" ? "No community, no shared spaces" : "Pas de communauté, pas d'espaces partagés"}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHY US ===== */}
      <section className="py-24 lg:py-32 bg-[#FAF9F6]">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-12 text-center"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "Why rent your room at La Villa Coliving in Annemasse"
              : "Pourquoi louer votre chambre chez La Villa Coliving à Annemasse"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 max-w-3xl mx-auto">
            {(language === "en"
              ? [
                  "29 furnished rooms — 3 houses, 1 community",
                  "All-inclusive from CHF 1,380/mo (no surprises)",
                  "Move in within 2 weeks (no paperwork friction)",
                  "Léman Express direct to Geneva Cornavin 15 min",
                  "Pool, gym, sauna in every house",
                  "fiber internet up to 8 Gb/s",
                  "Twice-weekly cleaning of common areas",
                  "Weekly yoga and fitness classes included",
                  "Monthly community events, community dinners",
                  "No agency fees, no application fees",
                  "Flexible 12-month lease, 1-month notice",
                  "Cross-border profile expected (CDI Geneva)",
                ]
              : [
                  "29 chambres meublées — 3 maisons, 1 communauté",
                  "Tout inclus dès 1 380 CHF/mois (zéro surprise)",
                  "Emménagement en 2 semaines (zéro friction administrative)",
                  "Léman Express direct Genève Cornavin en 15 min",
                  "Piscine, salle de sport, sauna dans chaque maison",
                  "Internet fibre jusqu'à 8 Gb/s",
                  "Ménage 2 fois par semaine des espaces communs",
                  "Cours hebdomadaires yoga et fitness inclus",
                  "Événements communautaires mensuels, dîners communautaires",
                  "Aucun frais d'agence, aucun frais de dossier",
                  "Bail flexible 12 mois, préavis 1 mois",
                  "Profil frontalier attendu (CDI Genève)",
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

      {/* ===== TRANSPORT (compact) ===== */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Train className="w-12 h-12 text-[#D4A574] mx-auto mb-6" />
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-6"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en" ? "15 min from Geneva Cornavin" : "À 15 min de Genève Cornavin"}
          </h2>
          <p className="text-lg text-[#57534E] leading-relaxed max-w-3xl mx-auto">
            {language === "en"
              ? "Annemasse station is the Léman Express terminus — direct train to Geneva Cornavin in 15 minutes, no transfer. Tram 17 TPG and direct buses also connect to central Geneva. Whether you commute daily or visit occasionally, our 3 houses are optimised for cross-border life."
              : "La gare d'Annemasse est le terminus du Léman Express — train direct Genève Cornavin en 15 minutes, sans correspondance. Le Tram 17 TPG et des bus directs desservent aussi le centre de Genève. Que vous fassiez le trajet quotidien ou occasionnellement, nos 3 maisons sont optimisées pour la vie frontalière."}
          </p>
          <Link
            to="/annemasse-colocation"
            className="inline-flex items-center gap-2 mt-8 text-[#D4A574] font-medium hover:underline"
          >
            {language === "en" ? "See full Annemasse coliving guide" : "Voir le guide complet colocation Annemasse"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24 lg:py-32 bg-[#FAF9F6]">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-12 text-center"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en" ? "How to rent your room — 4 steps" : "Comment louer votre chambre — 4 étapes"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                num: "1",
                title_fr: "Candidature en ligne",
                title_en: "Online application",
                desc_fr: "5 min pour remplir votre profil (motivation, contexte pro, dates d'emménagement).",
                desc_en: "5 min to fill your profile (motivation, pro context, move-in dates).",
              },
              {
                num: "2",
                title_fr: "Échange sous 48h",
                title_en: "Reply within 48h",
                desc_fr: "On vous appelle pour confirmer la disponibilité et vérifier le fit communauté.",
                desc_en: "We call to confirm availability and check community fit.",
              },
              {
                num: "3",
                title_fr: "Visite",
                title_en: "Visit",
                desc_fr: "Tour physique ou virtuel de la résidence et de la chambre disponible.",
                desc_en: "Physical or virtual tour of the house and available room.",
              },
              {
                num: "4",
                title_fr: "Emménagement 2 sem.",
                title_en: "Move in within 2 weeks",
                desc_fr: "Bail meublé signé en ligne, caution 2 mois hors charges, emménagement avec une valise.",
                desc_en: "Furnished lease signed online, 2-month deposit excluding charges, move in with a suitcase.",
              },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#1C1917] text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="text-lg font-medium text-[#1C1917] mb-2">
                  {language === "en" ? step.title_en : step.title_fr}
                </h3>
                <p className="text-sm text-[#57534E] leading-relaxed">
                  {language === "en" ? step.desc_en : step.desc_fr}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-12 text-center"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en" ? "Frequently asked questions" : "Questions fréquentes"}
          </h2>
          <div className="space-y-4">
            {chambreFAQ.map((item, i) => (
              <div key={i} className="bg-[#FAF9F6] border border-[#E7E5E4]">
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
          <Calendar className="w-12 h-12 text-[#D4A574] mx-auto mb-6" />
          <h2
            className="text-3xl md:text-4xl font-light mb-6"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en"
              ? "Check current room availability"
              : "Voir les chambres disponibles maintenant"}
          </h2>
          <p className="text-lg text-white/80 mb-10 leading-relaxed">
            {language === "en"
              ? "Disponibilités change weekly across our 29 rooms. Fill the form, we get back within 48h with the rooms that match your move-in date and profile."
              : "Les disponibilités évoluent chaque semaine sur nos 29 chambres. Remplissez le formulaire, on revient sous 48h avec les chambres qui matchent votre date d'emménagement et votre profil."}
          </p>
          <Link
            to="/candidature"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1C1917] font-semibold rounded-full hover:bg-gray-100 transition-colors"
          >
            {language === "en" ? "Apply now" : "Candidater maintenant"}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ===== Internal linking ===== */}
      <section className="py-12 bg-white border-t border-[#E7E5E4]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm text-[#78716C] mb-4">
            {language === "en" ? "Related pages" : "Pages liées"}
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link to="/annemasse-colocation" className="text-[#1C1917] underline hover:text-[#D4A574]">
              {language === "en" ? "Annemasse coliving guide" : "Guide colocation Annemasse"}
            </Link>
            <span className="text-[#E7E5E4]">·</span>
            <Link to="/colocation-geneve" className="text-[#1C1917] underline hover:text-[#D4A574]">
              {language === "en" ? "Shared housing Geneva" : "Colocation Genève"}
            </Link>
            <span className="text-[#E7E5E4]">·</span>
            <Link to="/nos-maisons" className="text-[#1C1917] underline hover:text-[#D4A574]">
              {language === "en" ? "Our 3 houses" : "Nos 3 maisons"}
            </Link>
            <span className="text-[#E7E5E4]">·</span>
            <Link to="/lelodge" className="text-[#1C1917] underline hover:text-[#D4A574]">
              {language === "en" ? "Le Lodge — 12 rooms Annemasse" : "Le Lodge — 12 chambres Annemasse"}
            </Link>
            <span className="text-[#E7E5E4]">·</span>
            <Link to="/tarifs" className="text-[#1C1917] underline hover:text-[#D4A574]">
              {language === "en" ? "Pricing" : "Tarifs"}
            </Link>
          </div>
          <Euro className="w-5 h-5 text-[#D4A574]/40 mx-auto mt-6" />
        </div>
      </section>
    </main>
  );
}
