import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, Check, Clock, Shield, Loader2, Star, Users, Calendar, ChevronDown, ChevronUp, MessageCircle, Sparkles } from "lucide-react";
import { SEO } from "@/components/SEO";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase";
import { STATS, STATS_DISPLAY, totalAvailabilityLabel, PRICE_CHF_FR, PRICE_CHF_EN } from "@/data/stats";

type FormStatus = "idle" | "submitting" | "success" | "error";

const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/send-candidature-email`;

export function JoinPageV4() {
  const { language } = useLanguage();
  const L = language === "en" ? "en" : "fr";
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  // Attribution observée : les blocs offre du blog arrivent avec
  // ?src=bloc_offre&article={slug} (params custom, pas utm_* — les utm sur liens
  // internes redémarrent l'attribution de session GA4). Transmis à l'Edge Function
  // → notes + prospects.source. Le canal DÉCLARÉ (select ci-dessous) prime.
  const [searchParams] = useSearchParams();
  const refSrc = (searchParams.get("src") ?? "").slice(0, 50);
  const refArticle = (searchParams.get("article") ?? "").slice(0, 120);

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
    // Couche « observée » de l'attribution (l'URL d'arrivée), à côté du canal déclaré.
    if (refSrc) payload.ref_src = refSrc;
    if (refArticle) payload.ref_article = refArticle;

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

      // Tracking GA4 — on déclenche explicitement l'event `form_submit` au succès.
      // La détection automatique de GA4 (mesure améliorée) ne capte PAS de façon fiable
      // les formulaires SPA envoyés via fetch() : c'est pourquoi le suivi des candidatures
      // est tombé à zéro après la refonte du formulaire de mai 2026. Même motif sûr que
      // WaitlistForm.tsx. On ne le déclenche qu'après une réponse OK = vraie candidature.
      try {
        (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.(
          "event",
          "form_submit",
          {
            form_id: "candidature",
            form_destination: "supabase-edge",
            language,
            lead_source: payload.source || "unknown",
            ref_src: refSrc || "none",
            ref_article: refArticle || "none",
          }
        );
      } catch { /* noop — ne jamais bloquer l'UI de succès à cause de l'analytics */ }

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
          ? "Apply to join La Villa Coliving near Geneva. Simple process, move in within 2 weeks. Furnished all-inclusive rooms for cross-border workers & expats."
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
              : "Ta nouvelle maison t'attend. Complète le formulaire ci-dessous et on t'accompagne à chaque étape."}
          </p>
        </div>
      </section>

      {/* Social proof stats — chiffres business pour rassurer (CRO win #1) */}
      <section className="py-12 bg-[#FAF9F6] border-y border-[#E7E5E4]">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div className="flex flex-col items-center">
              <Users className="w-8 h-8 text-[#D4A574] mb-3" />
              <p className="text-3xl font-light text-[#1C1917] mb-1" style={{ fontFamily: "DM Serif Display, serif" }}>
                {STATS.totalResidents}+
              </p>
              <p className="text-sm text-[#57534E]">
                {language === "en" ? "Residents since 2021" : "Résidents depuis 2021"}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Sparkles className="w-8 h-8 text-[#D4A574] mb-3" />
              <p className="text-3xl font-light text-[#1C1917] mb-1" style={{ fontFamily: "DM Serif Display, serif" }}>
                99%
              </p>
              <p className="text-sm text-[#57534E]">
                {language === "en" ? "Occupancy rate over 5 years" : "Taux d'occupation sur 5 ans"}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Star className="w-8 h-8 text-[#D4A574] mb-3 fill-[#D4A574]" />
              <p className="text-3xl font-light text-[#1C1917] mb-1" style={{ fontFamily: "DM Serif Display, serif" }}>
                {STATS_DISPLAY[L].rating}/5
              </p>
              <p className="text-sm text-[#57534E]">
                {language === "en" ? "Average rating from residents" : "Note moyenne des résidents"}
              </p>
            </div>
          </div>
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
                    : "Remplis le formulaire de candidature avec tes coordonnées.",
              },
              {
                number: "02",
                title: language === "en" ? "Meet" : "Rencontrer",
                description:
                  language === "en"
                    ? "We'll schedule a video call to get to know you better."
                    : "On planifiera un appel vidéo pour mieux te connaître.",
              },
              {
                number: "03",
                title: language === "en" ? "Move In" : "Emménager",
                description:
                  language === "en"
                    ? "Refundable deposit, and that's it — zero application fee. Welcome home!"
                    : "Caution remboursable, et c'est tout — zéro frais de dossier. Bienvenue chez toi !",
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

      {/* Testimonials — 3 résidents (CRO win #2) */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-xs text-[#78716C] uppercase tracking-[0.3em] mb-4 block">
              {language === "en" ? "What our residents say" : "Ce que disent nos résidents"}
            </span>
            <h2
              className="text-3xl md:text-4xl font-light text-[#1C1917]"
              style={{ fontFamily: "DM Serif Display, serif" }}
            >
              {language === "en" ? "They took the leap" : "Ils ont sauté le pas"}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                initials: "SM",
                name: "Sarah M.",
                role_fr: "Responsable Marketing · 8 mois au Lodge",
                role_en: "Marketing Manager · 8 months at Le Lodge",
                quote_fr: "Le processus de candidature était super simple. J'ai emménagé 2 semaines après. La communauté est exactement ce que je cherchais en arrivant à Genève.",
                quote_en: "The application process was super simple. I moved in 2 weeks later. The community is exactly what I was looking for when arriving in Geneva.",
              },
              {
                initials: "TL",
                name: "Thomas L.",
                role_fr: "Ingénieur frontalier · 1 an à La Villa",
                role_en: "Cross-border engineer · 1 year at La Villa",
                quote_fr: "Je voulais éviter la galère de chercher un studio à Genève. Ici, tout est inclus et la piscine après le boulot, c'est priceless.",
                quote_en: "I wanted to skip the hassle of finding a studio in Geneva. Everything is included here, and the pool after work is priceless.",
              },
              {
                initials: "CD",
                name: "Camille D.",
                role_fr: "Chargée de projet OI · 6 mois au Loft",
                role_en: "International org. project lead · 6 months at Le Loft",
                quote_fr: "Atterrir à Genève seule était stressant. Le Loft m'a donné un réseau social en 2 semaines. Je recommande à toutes les expats qui arrivent.",
                quote_en: "Landing in Geneva alone was stressful. Le Loft gave me a social network in 2 weeks. I recommend it to every expat arriving.",
              },
            ].map((t, i) => (
              <div key={i} className="bg-[#FAF9F6] border border-[#E7E5E4] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#D4A574] text-white flex items-center justify-center font-medium">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1C1917]">{t.name}</p>
                    <p className="text-xs text-[#78716C]">{language === "en" ? t.role_en : t.role_fr}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-[#D4A574] text-[#D4A574]" />
                  ))}
                </div>
                <p className="text-sm text-[#57534E] italic leading-relaxed">
                  "{language === "en" ? t.quote_en : t.quote_fr}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-24 lg:py-32 bg-[#FAF9F6]">
        <div className="container-custom max-w-3xl">
          {/* Scarcité honnête — créer micro-urgence (CRO win #5) */}
          <div className="mb-6 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#D4A574] text-sm text-[#1C1917]">
              <Calendar className="w-4 h-4 text-[#D4A574]" />
              {totalAvailabilityLabel(L)}
            </span>
          </div>

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
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#D4A574]" />
              {language === "en" ? "No application fee" : "Aucun frais de dossier"}
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
                  : "Merci pour ta candidature."}
              </p>
              <p className="text-[#78716C] mb-8">
                {language === "en"
                  ? "We've sent you a confirmation email and will get back to you within 48 hours."
                  : "Tu vas recevoir un email de confirmation. On te recontacte sous 48h."}
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
                <span className="text-sm text-[#1C1917] font-medium">{language === "en" ? "Your info" : "Tes infos"}</span>
              </div>
              <div className="flex-1 h-px bg-[#E7E5E4]" />
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-[#D4A574] text-white text-xs rounded-full flex items-center justify-center font-medium">2</span>
                <span className="text-sm text-[#1C1917] font-medium">{language === "en" ? "Your stay" : "Ton séjour"}</span>
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
              </div>
            </div>

            {/* Stay Info */}
            <div className="mb-10">
              <h2 className="text-xs uppercase tracking-widest text-[#78716C] mb-6">
                {language === "en" ? "Your Stay" : "Ton Séjour"}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-[#57534E] mb-2">
                    {language === "en"
                      ? "When would you like to join?"
                      : "Quand souhaites-tu nous rejoindre ?"}
                  </label>
                  <select
                    name="arrival"
                    required
                    className="w-full px-4 py-3 border border-[#E7E5E4] focus:border-[#D4A574] focus:outline-none transition-colors bg-white"
                  >
                    <option value="">
                      {language === "en" ? "Select arrival period" : "Sélectionner la période"}
                    </option>
                    <option value="asap">
                      {language === "en" ? "As soon as possible (within 1 month)" : "Le plus tôt possible (sous 1 mois)"}
                    </option>
                    <option value="1-3-months">
                      {language === "en" ? "Within 1 to 3 months" : "Dans 1 à 3 mois"}
                    </option>
                    <option value="3-6-months">
                      {language === "en" ? "Within 3 to 6 months" : "Dans 3 à 6 mois"}
                    </option>
                    <option value="later">
                      {language === "en" ? "Later / not decided yet" : "Plus tard / pas encore décidé"}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#57534E] mb-2">
                    {language === "en"
                      ? "How long do you plan to stay?"
                      : "Combien de temps comptes-tu rester ?"}
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
                      : "Comment as-tu entendu parler de nous ?"}
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
                    <option value="article-blog">
                      {language === "en" ? "A blog article" : "Un article du blog"}
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
                : "Réponse sous 48h. Tes données restent confidentielles."}
            </p>
          </form>
          )}
        </div>
      </section>

      {/* WhatsApp alternative + FAQ contextuelle (CRO wins #4 + #8) */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="container-custom max-w-3xl">
          {/* WhatsApp CTA */}
          <div className="bg-[#FAF9F6] border border-[#E7E5E4] p-6 md:p-8 text-center mb-12">
            <MessageCircle className="w-10 h-10 text-[#25D366] mx-auto mb-4" />
            <h2 className="text-xl md:text-2xl font-medium text-[#1C1917] mb-2">
              {language === "en"
                ? "Prefer to chat first? Reach us on WhatsApp"
                : "Tu préfères discuter d'abord ? Joins-nous sur WhatsApp"}
            </h2>
            <p className="text-sm text-[#57534E] mb-6 max-w-xl mx-auto">
              {language === "en"
                ? "Quick questions about availability, neighborhoods, or how it works? Send us a message — we usually reply within the hour during business days."
                : "Une question rapide sur les disponibilités, les quartiers ou le fonctionnement ? Écrivez-nous — réponse généralement sous 1h en jours ouvrés."}
            </p>
            <a
              href="https://wa.me/33664315134"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-medium hover:bg-[#1FAD52] transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              {language === "en" ? "Message us on WhatsApp" : "Écrire sur WhatsApp"}
            </a>
          </div>

          {/* FAQ contextuelle — réduit les abandons du form */}
          <div className="text-center mb-8">
            <span className="text-xs text-[#78716C] uppercase tracking-[0.3em] mb-4 block">
              {language === "en" ? "Before you apply" : "Avant de candidater"}
            </span>
            <h2
              className="text-3xl md:text-4xl font-light text-[#1C1917]"
              style={{ fontFamily: "DM Serif Display, serif" }}
            >
              {language === "en" ? "Frequently asked questions" : "Questions fréquentes"}
            </h2>
          </div>
          <div className="space-y-3">
            {[
              {
                q_fr: "Qui peut postuler ? Y a-t-il un profil type ?",
                q_en: "Who can apply? Is there a typical profile?",
                a_fr: "Notre communauté est principalement composée de frontaliers en CDI à Genève, de jeunes professionnels et d'expats. Nous sélectionnons sur dossier (justificatif de revenus, motivation, compatibilité avec la communauté). Pas de critère d'âge strict, mais la majorité de nos résidents ont entre 25 et 40 ans.",
                a_en: "Our community is mainly cross-border workers on permanent contracts (CDI) in Geneva, young professionals and expats. We select based on application (income proof, motivation, fit with community). No strict age limit, but most residents are 25-40 years old.",
              },
              {
                q_fr: "Combien de temps entre la candidature et l'emménagement ?",
                q_en: "How long from application to move-in?",
                a_fr: "En moyenne 2 à 4 semaines. Étape 1 : réponse sous 48h. Étape 2 : appel vidéo (30 min). Étape 3 : visite physique ou virtuelle. Étape 4 : signature en ligne du bail + caution. Étape 5 : emménagement avec une valise.",
                a_en: "Usually 2 to 4 weeks. Step 1: reply within 48h. Step 2: video call (30 min). Step 3: physical or virtual tour. Step 4: online lease signing + deposit. Step 5: move in with a suitcase.",
              },
              {
                q_fr: "Quel est le loyer et que comprend-il vraiment ?",
                q_en: "What is the rent and what does it really include?",
                a_fr: `À partir de ${PRICE_CHF_FR}/mois tout inclus : chambre meublée, charges (eau, électricité, chauffage), fibre 8 Gbps, ménage 2 fois par semaine, accès piscine/sauna/gym, cours de yoga et fitness privés, abonnements streaming, événements communautaires mensuels. Caution 2 mois de loyer hors charges. Aucun frais d'agence, aucun frais de dossier.`,
                a_en: `From ${PRICE_CHF_EN}/month all-inclusive: furnished room, utilities (water, electricity, heating), 8 Gbps fiber, twice-weekly cleaning, pool/sauna/gym access, private yoga and fitness classes, streaming subscriptions, monthly community events. Deposit: 2 months' rent excl. utilities. No agency fees, no application fees.`,
              },
              {
                q_fr: "Quelle est la durée minimale du bail ?",
                q_en: "What is the minimum lease duration?",
                a_fr: "Le bail standard est de 12 mois renouvelable, avec préavis d'1 mois. Cadre conforme à la loi française (Alur). Nous étudions au cas par cas des séjours plus courts (6 mois) selon disponibilité.",
                a_en: "Standard lease is 12 months renewable, with 1-month notice. Compliant with French Alur law. We consider shorter stays (6 months) case-by-case depending on availability.",
              },
              {
                q_fr: "Je peux visiter avant de signer ?",
                q_en: "Can I visit before signing?",
                a_fr: "Oui, c'est systématique. Visite physique (30-45 min) ou virtuelle si tu es à l'étranger. Tu rencontres aussi un coliver actuel pour avoir un retour terrain honnête sur la vie communautaire.",
                a_en: "Yes, always. Physical tour (30-45 min) or virtual if you're abroad. You also meet a current resident to get an honest first-hand take on community life.",
              },
              {
                q_fr: "Et si je ne sais pas encore quelle date d'arrivée mettre ?",
                q_en: "What if I don't know my arrival date yet?",
                a_fr: "Pas de souci — choisis \"Plus tard / pas encore décidé\". On revient vers toi avec les chambres disponibles et on cale ensemble une date qui te convient. Candidater ne t'engage à rien.",
                a_en: "No worries — pick \"Later / not decided yet\". We'll get back to you with available rooms and we'll set a date together. Applying doesn't commit you to anything.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-[#FAF9F6] border border-[#E7E5E4]">
                <button
                  type="button"
                  onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm md:text-base font-medium text-[#1C1917] pr-4">
                    {language === "en" ? item.q_en : item.q_fr}
                  </span>
                  {openFAQ === i ? (
                    <ChevronUp className="w-5 h-5 text-[#D4A574] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#78716C] flex-shrink-0" />
                  )}
                </button>
                {openFAQ === i && (
                  <div className="px-5 pb-5 text-sm text-[#57534E] leading-relaxed border-t border-[#E7E5E4] pt-4">
                    {language === "en" ? item.a_en : item.a_fr}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
