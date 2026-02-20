import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";

export function JoinPageV4() {
  const { language } = useLanguage();

  return (
    <main className="relative pt-20">
      <SEO
        title={language === "en" ? "Apply — Join Our Coliving Community" : "Candidater — Rejoindre Notre Colocation près de Genève"}
        description={language === "en"
          ? "Apply to join La Villa Coliving near Geneva. Simple process, curated community, move in within 2 weeks. Furnished rooms, all-inclusive, ideal for cross-border workers & expats."
          : "Postule pour La Villa Coliving près de Genève. Processus simple, communauté sélectionnée, emménagement en 2 semaines. Chambres meublées tout inclus, idéal frontaliers et expats."}
        url="https://www.lavillacoliving.com/join-us"
      />
      {/* Hero */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container-custom text-center">
          <span className="text-xs text-[#78716C] uppercase tracking-[0.3em] mb-4 block">
            {language === "en" ? "Get Started" : "Commencer"}
          </span>
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-light text-[#1C1917] mb-6"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en" ? (
              <>
                Join <span className="text-[#D4A574]">La Villa</span>
              </>
            ) : (
              <>
                Rejoindre <span className="text-[#D4A574]">La Villa</span>
              </>
            )}
          </h1>
          <p className="text-lg text-[#57534E] max-w-2xl mx-auto">
            {language === "en"
              ? "Your new home is waiting. Complete the form below and we'll guide you through every step."
              : "Votre nouvelle maison vous attend. Complétez le formulaire ci-dessous et on vous accompagne à chaque étape."}
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-24 lg:py-32 bg-[#FAF9F6]">
        <div className="container-custom max-w-3xl">
          <form
            action="https://formspree.io/f/mreazaqz"
            method="POST"
            className="bg-white border border-[#E7E5E4] p-8 md:p-12"
          >
            {/* Personal Info */}
            <div className="mb-10">
              <h2 className="text-xs uppercase tracking-widest text-[#78716C] mb-6">
                {language === "en"
                  ? "Personal Information"
                  : "Informations Personnelles"}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-[#57534E] mb-2">
                    {language === "en" ? "First Name" : "Prénom"}
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    className="w-full px-4 py-3 border border-[#E7E5E4] focus:border-[#D4A574] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#57534E] mb-2">
                    {language === "en" ? "Last Name" : "Nom"}
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    className="w-full px-4 py-3 border border-[#E7E5E4] focus:border-[#D4A574] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#57534E] mb-2">
                    {language === "en" ? "Email" : "Email"}
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-[#E7E5E4] focus:border-[#D4A574] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#57534E] mb-2">
                    {language === "en" ? "Phone" : "Téléphone"}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full px-4 py-3 border border-[#E7E5E4] focus:border-[#D4A574] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#57534E] mb-2">
                    {language === "en" ? "Date of Birth" : "Date de Naissance"}
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    required
                    className="w-full px-4 py-3 border border-[#E7E5E4] focus:border-[#D4A574] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#57534E] mb-2">
                    {language === "en" ? "Job Position" : "Poste"}
                  </label>
                  <input
                    type="text"
                    name="job"
                    required
                    className="w-full px-4 py-3 border border-[#E7E5E4] focus:border-[#D4A574] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Stay Info */}
            <div className="mb-10">
              <h2 className="text-xs uppercase tracking-widest text-[#78716C] mb-6">
                {language === "en" ? "Your Stay" : "Votre Séjour"}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-[#57534E] mb-2">
                    {language === "en"
                      ? "When would you like to join?"
                      : "Quand souhaitez-vous nous rejoindre ?"}
                  </label>
                  <input
                    type="date"
                    name="arrival"
                    required
                    className="w-full px-4 py-3 border border-[#E7E5E4] focus:border-[#D4A574] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#57534E] mb-2">
                    {language === "en"
                      ? "How long do you plan to stay?"
                      : "Combien de temps comptez-vous rester ?"}
                  </label>
                  <select
                    name="duration"
                    required
                    className="w-full px-4 py-3 border border-[#E7E5E4] focus:border-[#D4A574] focus:outline-none transition-colors bg-white"
                  >
                    <option value="">
                      {language === "en"
                        ? "Select duration"
                        : "Sélectionner la durée"}
                    </option>
                    <option value="2-3">
                      {language === "en" ? "2-3 months" : "2-3 mois"}
                    </option>
                    <option value="3-6">
                      {language === "en" ? "3-6 months" : "3-6 mois"}
                    </option>
                    <option value="6-12">
                      {language === "en" ? "6-12 months" : "6-12 mois"}
                    </option>
                    <option value="12+">
                      {language === "en" ? "12+ months" : "12+ mois"}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 bg-[#1C1917] text-white font-bold hover:bg-[#D4A574] transition-colors flex items-center justify-center gap-2"
            >
              {language === "en"
                ? "SUBMIT APPLICATION"
                : "SOUMETTRE MA CANDIDATURE"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-xs text-[#78716C] uppercase tracking-[0.3em] mb-4 block">
              {language === "en" ? "The Process" : "Le Processus"}
            </span>
            <h2
              className="text-4xl md:text-5xl font-light text-[#1C1917]"
              style={{ fontFamily: "DM Serif Display, serif" }}
            >
              {language === "en" ? "How It Works" : "Comment Ça Marche"}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-[#E7E5E4]">
            {[
              {
                number: "01",
                title: language === "en" ? "Apply" : "Candidater",
                description:
                  language === "en"
                    ? "Fill out the application form with your details."
                    : "Remplissez le formulaire de candidature avec vos coordonnées.",
              },
              {
                number: "02",
                title: language === "en" ? "Meet" : "Rencontrer",
                description:
                  language === "en"
                    ? "We'll schedule a video call to get to know you better."
                    : "On planifiera un appel vidéo pour mieux vous connaître.",
              },
              {
                number: "03",
                title: language === "en" ? "Move In" : "Emménager",
                description:
                  language === "en"
                    ? "Welcome to your new home and community!"
                    : "Bienvenue dans votre nouveau chez-vous et votre communauté !",
              },
            ].map((step, index) => (
              <div key={index} className="bg-white p-10 text-center">
                <span className="text-6xl font-light text-[#E7E5E4] block mb-6">
                  {step.number}
                </span>
                <h3 className="text-xl font-medium text-[#1C1917] mb-4">
                  {step.title}
                </h3>
                <p className="text-[#57534E]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
