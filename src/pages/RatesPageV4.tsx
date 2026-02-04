import { useLanguage } from "@/contexts/LanguageContext";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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

  return (
    <main className="relative pt-20">
      {/* Hero */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container-custom text-center">
          <span className="text-xs text-[#999] uppercase tracking-[0.3em] mb-4 block">
            {language === "en" ? "Pricing" : "Tarification"}
          </span>
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-light text-[#1a1a1a] mb-6"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            {language === "en" ? (
              <>
                Transparent <span className="text-[#129036]">Pricing</span>
              </>
            ) : (
              <>
                Tarifs <span className="text-[#129036]">Transparents</span>
              </>
            )}
          </h1>
          <p className="text-xl text-[#666] max-w-2xl mx-auto mb-4">
            {language === "en"
              ? "From 1,380 CHF/month — All inclusive"
              : "À partir de 1 380 CHF/mois — Tout inclus"}
          </p>
          <p className="text-lg text-[#999]">
            {language === "en"
              ? "No hidden fees. No surprises. Just exceptional value."
              : "Pas de frais cachés. Pas de surprises. Juste une valeur exceptionnelle."}
          </p>
        </div>
      </section>

      {/* Price Cards */}
      <section className="py-24 lg:py-32 bg-[#fafafa]">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            {/* La Villa */}
            <div className="bg-white border border-[#e5e5e5] p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-medium text-[#1a1a1a] mb-2">
                  La Villa
                </h3>
                <p className="text-[#666] text-sm">Ville-la-Grand</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-light text-[#1a1a1a]">
                  1,380
                </span>
                <span className="text-[#999]">
                  {" "}
                  CHF/{language === "en" ? "mo" : "mois"}
                </span>
              </div>
              <Link
                to="/lavilla"
                className="block w-full py-4 bg-[#1a1a1a] text-white text-center font-bold hover:bg-[#c44536] transition-colors"
              >
                {language === "en" ? "VIEW DETAILS" : "VOIR LES DÉTAILS"}
              </Link>
            </div>

            {/* Le Loft */}
            <div className="bg-white border border-[#e5e5e5] p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-medium text-[#1a1a1a] mb-2">
                  Le Loft
                </h3>
                <p className="text-[#666] text-sm">Ambilly</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-light text-[#1a1a1a]">
                  1,380
                </span>
                <span className="text-[#999]">
                  {" "}
                  CHF/{language === "en" ? "mo" : "mois"}
                </span>
              </div>
              <Link
                to="/leloft"
                className="block w-full py-4 bg-[#1a1a1a] text-white text-center font-bold hover:bg-[#c44536] transition-colors"
              >
                {language === "en" ? "VIEW DETAILS" : "VOIR LES DÉTAILS"}
              </Link>
            </div>

            {/* Le Lodge */}
            <div className="bg-white border border-[#e5e5e5] p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-medium text-[#1a1a1a] mb-2">
                  Le Lodge
                </h3>
                <p className="text-[#666] text-sm">Annemasse</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-light text-[#1a1a1a]">
                  1,380
                </span>
                <span className="text-[#999]">
                  {" "}
                  CHF/{language === "en" ? "mo" : "mois"}
                </span>
              </div>
              <Link
                to="/lelodge"
                className="block w-full py-4 bg-[#1a1a1a] text-white text-center font-bold hover:bg-[#c44536] transition-colors"
              >
                {language === "en" ? "VIEW DETAILS" : "VOIR LES DÉTAILS"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <span className="text-xs text-[#999] uppercase tracking-[0.3em] mb-4 block">
                {language === "en" ? "What's Included" : "Ce Qui Est Inclus"}
              </span>
              <h2
                className="text-4xl md:text-5xl font-light text-[#1a1a1a] mb-8"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                {language === "en"
                  ? "Everything You Need"
                  : "Tout ce dont Vous Avez Besoin"}
              </h2>
              <p className="text-lg text-[#666] leading-relaxed">
                {language === "en"
                  ? "One monthly payment covers absolutely everything. No hidden costs, no surprise bills."
                  : "Un paiement mensuel couvre absolument tout. Pas de coûts cachés, pas de factures surprises."}
              </p>
            </div>

            <div className="space-y-4">
              {includedItems.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-6 h-6 border border-[#c44536] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-[#c44536]" />
                  </div>
                  <span className="text-[#666]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-24 lg:py-32 bg-[#fafafa]">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-px bg-[#e5e5e5]">
            <div className="bg-white p-10">
              <h3 className="text-xl font-medium text-[#1a1a1a] mb-4">
                {language === "en" ? "Security Deposit" : "Caution"}
              </h3>
              <p className="text-[#666] leading-relaxed">
                {language === "en"
                  ? "We require a security deposit equivalent to two months' rent. This is returned within 30 days of move-out, minus any deductions for damages."
                  : "Nous exigeons une caution équivalente à deux mois de loyer. Elle est restituée dans les 30 jours suivant le départ."}
              </p>
            </div>
            <div className="bg-white p-10">
              <h3 className="text-xl font-medium text-[#1a1a1a] mb-4">
                {language === "en" ? "No Agency Fees" : "Sans Frais d'Agence"}
              </h3>
              <p className="text-[#666] leading-relaxed">
                {language === "en"
                  ? "There are absolutely no agency fees at La Villa Coliving. Our pricing is transparent and all-inclusive."
                  : "Il n'y a absolument aucun frais d'agence chez La Villa Coliving. Notre tarification est transparente et tout inclusive."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#c44536]">
        <div className="container-custom text-center">
          <h2
            className="text-3xl md:text-4xl font-light text-white mb-4"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            {language === "en" ? "Ready to Join?" : "Prêt à Nous Rejoindre ?"}
          </h2>
          <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
            {language === "en"
              ? "Apply now and start your coliving journey with us."
              : "Candidaturez maintenant et commencez votre voyage coliving avec nous."}
          </p>
          <Link
            to="/join-us"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#c44536] font-bold hover:bg-[#1a1a1a] hover:text-white transition-colors"
          >
            {language === "en" ? "APPLY NOW" : "CANDIDATER"}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
