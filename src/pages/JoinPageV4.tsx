import { useState, type FormEvent } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, Check, Clock, Shield, Loader2 } from "lucide-react";
import { SEO } from "@/components/SEO";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase";

type FormStatus = "idle" | "submitting" | "success" | "error";

const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/send-candidature-email`;

export function JoinPageV4() {
  const { language } = useLanguage();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload: Record<string, string> = {};
    formData.forEach((value, key) => {
      payload[key] = typeof value === "string" ? value : "";
    });

    try {
      const response = await fetch(EDGE_FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          (data && typeof data === "object" && "error" in data && typeof data.error === "string")
            ? data.error
            : `Erreur ${response.status}`
        );
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : language === "en"
          ? "Submission failed. Please try again."
          : "L'envoi a échoué. Merci de réessayer."
      );
    }
  }

  return (
    <main className="relative pt-16">
      <SEO
        title={language === "en" ? "Apply — Join La Villa Coliving" : "Candidater — Rejoindre La Villa Coliving"}
        description={language === "en"
          ? "Apply to join La Villa Coliving near Geneva. Simple process, curated community, move in within 2 weeks. Furnished rooms, all-inclusive, ideal for cross-border workers & expats."
          : "Postulez en 2 minutes. Communauté sélectionnée, emménagement en 2 semaines. Chambres meublées tout inclus près de Genève."}
        url="https://www.lavillacoliving.com/candidature"
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

      {/* Steps — shown before the form to reduce anxiety */}
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

      {/* Form */}
      <section className="py-24 lg:py-32 bg-[#FAF9F6]">
        <div className="container-custom max-w-3xl">
          {/* Reassurance strip */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-[#57534E]">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#D4A574]" />
              {language === "en" ? "No commitment" : "Sans engagement"}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D4A574]" />
              {language === "en" ? "2 min to complete" : "2 min pour compléter"}
            </span>
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#D4A574]" />
              {language === "en" ? "Response within 48h" : "Réponse sous 48h"}
            </span>
          </div>

          {status === "success" ? (
            <div className="bg-white border border-[#E7E5E4] p-12 md:p-16 text-center">
              <div className="w-16 h-16 bg-[#D4A574] rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-white" strokeWidth={3} />
              </div>
              <h2
                className="text-3xl md:text-4xl font-light text-[#1C1917] mb-4"
                style={{ fontFamily: "DM Serif Display, serif" }}
              >
                {language === "en" ? "Application received!" : "Candidature reçue !"}
              </h2>
              <p className="text-lg text-[#57534E] mb-2">
                {language === "en"
                  ? "Thank you for your application."
                  : "Merci pour votre candidature."}
              </p>
              <p className="text-[#78716C] mb-8">
                {language === "en"
                  ? "We've sent you a confirmation email and will get back to you within 48 hours."
                  : "Vous allez recevoir un email de confirmation. Nous vous recontactons sous 48h."}
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="text-sm text-[#78716C] underline hover:text-[#1C1917] transition-colors"
              >
                {language === "en" ? "Submit another application" : "Envoyer une autre candidature"}
              </button>
            </div>
          ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#E7E5E4] p-8 md:p-12"
          >
            {/* Honeypot anti-spam (caché aux humains) */}
            <input
              type="text"
              name="botcheck"
              className="hidden"
              style={{ display: "none" }}
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Progress indicator */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[#E7E5E4]">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-[#D4A574] text-white text-xs rounded-full flex items-center justify-center font-medium">1</span>
                <span className="text-sm text-[#1C1917] font-medium">{language === "en" ? "Your info" : "Vos infos"}</span>
              </div>
              <div className="flex-1 h-px bg-[#E7E5E4]" />
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-[#D4A574] text-white text-xs rounded-full flex items-center justify-center font-medium">2</span>
                <span className="text-sm text-[#1C1917] font-medium">{language === "en" ? "Your stay" : "Votre séjour"}</span>
              </div>
              <div className="flex-1 h-px bg-[#E7E5E4]" />
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-[#E7E5E4] text-[#78716C] text-xs rounded-full flex items-center justify-center font-medium">&#10003;</span>
                <span className="text-sm text-[#78716C]">{language === "en" ? "Done!" : "Envoyé !"}</span>
              </div>
            </div>

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
                    autoComplete="given-name"
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
                    autoComplete="family-name"
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
                    autoComplete="email"
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
                    autoComplete="tel"
                    className="w-full px-4 py-3 border border-[#E7E5E4] focus:border-[#D4A574] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#57534E] mb-2">
                    {language === "en" ? "Date of Birth (optional)" : "Date de Naissance (optionnel)"}
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    autoComplete="bday"
                    className="w-full px-4 py-3 border border-[#E7E5E4] focus:border-[#D4A574] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#57534E] mb-2">
                    {language === "en" ? "Job Position (optional)" : "Poste (optionnel)"}
                  </label>
                  <input
                    type="text"
                    name="job"
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
                <div className="md:col-span-2">
                  <label className="block text-sm text-[#57534E] mb-2">
                    {language === "en"
                      ? "How did you hear about us?"
                      : "Comment avez-vous entendu parler de nous ?"}
                  </label>
                  <select
                    name="source"
                    className="w-full px-4 py-3 border border-[#E7E5E4] focus:border-[#D4A574] focus:outline-none transition-colors bg-white"
                  >
                    <option value="">
                      {language === "en" ? "Select" : "Sélectionner"}
                    </option>
                    <option value="google">Google</option>
                    <option value="instagram">Instagram</option>
                    <option value="word-of-mouth">
                      {language === "en" ? "Word of mouth" : "Bouche à oreille"}
                    </option>
                    <option value="leboncoin">Leboncoin</option>
                    <option value="other">
                      {language === "en" ? "Other" : "Autre"}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Social proof */}
            <div className="mb-6 p-4 bg-[#FAF9F6] border border-[#E7E5E4] text-center">
              <p className="text-sm text-[#57534E] italic mb-1">
                {language === "en"
                  ? "\"The application process was super simple. I moved in 2 weeks later!\""
                  : "\"Le processus de candidature était super simple. J'ai emménagé 2 semaines après !\""}
              </p>
              <p className="text-xs text-[#78716C]">
                {language === "en" ? "— Sarah M., Marketing Manager" : "— Sarah M., Responsable Marketing"}
              </p>
            </div>

            {/* Error message */}
            {status === "error" && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-sm">
                {errorMessage}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full py-4 bg-[#1C1917] text-white font-bold hover:bg-[#D4A574] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {language === "en" ? "Sending..." : "Envoi en cours..."}
                </>
              ) : (
                <>
                  {language === "en"
                    ? "SEND MY APPLICATION — IT'S FREE"
                    : "ENVOYER MA CANDIDATURE — C'EST GRATUIT"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="text-sm text-[#78716C] text-center mt-4">
              {language === "en"
                ? "Response within 48h. Your data remains confidential."
                : "Réponse sous 48h. Vos données restent confidentielles."}
            </p>
          </form>
          )}
        </div>
      </section>

    </main>
  );
}
