import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, Check, Shield, Loader2, Star, Users, Calendar, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { SEO } from "@/components/SEO";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase";
import { STATS, STATS_DISPLAY, PRICE_SHARED_CHF_FR, PRICE_SHARED_CHF_EN, CONTRACT_EUR, EUR_STANDARD_FR_NUM, EUR_SHARED_FR_NUM, EUR_STANDARD_EN_NUM, EUR_SHARED_EN_NUM, GOOGLE_REVIEWS, GOOGLE_REVIEWS_LINK_LABEL } from "@/data/stats";
import { useFormTelemetry } from "@/hooks/useFormTelemetry";
import { useRoomAvailability, useHouseRooms, shortAvailabilityLabel, type HouseKey } from "@/lib/availability";
import { housePriceLabel } from "@/lib/housePrice";
import { attributionPayload, internalRefPayload, isTestSession, landingPayload } from "@/lib/attribution";
import { HOUSES } from "@/data/houses";
import { CandidatureDetails } from "@/components/CandidatureDetails";
import { FacebookGroupCallout } from "@/components/FacebookGroupCallout";
import { useHydrated } from "@/hooks/useHydrated";

type FormStatus = "idle" | "submitting" | "success" | "error";

// (Lot A, 01/10/2026) Canal préféré — pastilles facultatives sous le téléphone. Valeurs = clés de
// CONTACT_PREFERENCE_LABELS dans l'edge v19 (valeur inconnue ignorée là-bas, sans erreur).
const CONTACT_OPTIONS: Array<{ value: string; fr: string; en: string }> = [
  { value: "whatsapp", fr: "WhatsApp", en: "WhatsApp" },
  { value: "call", fr: "Appel", en: "Phone call" },
  { value: "email", fr: "Email", en: "Email" },
];

const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/send-candidature-email`;

// Idempotence (edge v15, Lot 1a/1b) : une clé uuid par TENTATIVE de candidature,
// posée au premier clic submit et réutilisée tant que le succès n'est pas reçu —
// un re-clic après erreur, un rechargement ou un rejeu réseau ne crée jamais de
// doublon (colonne unique form_submissions.submission_key ; l'edge re-renvoie le
// succès sans ré-envoyer d'emails). Effacée au succès : une nouvelle candidature
// dans la même session reçoit une nouvelle clé.
const SUBMISSION_KEY_STORAGE = "candidature_submission_key";

export function JoinPageV4() {
  const { language } = useLanguage();
  const L = language === "en" ? "en" : "fr";
  const availability = useRoomAvailability();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  // Canal déclaré — contrôlé pour pouvoir afficher le champ conditionnel
  // « parrain » quand le candidat dit venir d'un résident (programme parrainage).
  const [sourceChoice, setSourceChoice] = useState("");
  // Attribution observée : les blocs offre du blog arrivent avec
  // ?src=bloc_offre&article={slug} (params custom, pas utm_* — les utm sur liens
  // internes redémarrent l'attribution de session GA4). Transmis à l'Edge Function
  // → notes + prospects.source. Le canal DÉCLARÉ (select ci-dessous) prime.
  const [searchParams] = useSearchParams();
  // (Lot 1, 03/09/2026) Repli sur les UTM virtuels de la session quand la porte interne
  // n'est plus sur l'URL (lecteur passé par une page maison avant de candidater) : la
  // note « Origine observée » du prospect reste renseignée. Rien de rendu → zéro #418.
  const storedRef = internalRefPayload();
  const refSrc = (searchParams.get("src") ?? storedRef.ref_src ?? "").slice(0, 50);
  const refArticle = (searchParams.get("article") ?? storedRef.ref_article ?? "").slice(0, 120);
  // Intérêt déclaré au clic sur une carte chambre (pages maisons, /chambres-disponibles ;
  // origine : LP /chambres-septembre, brief LOT 2, 24/08/2026) : ?property_interest=<slug properties.slug SANS tiret>
  // &room_interest=<repère chambre>. Transmis à l'Edge v14 → colonnes dédiées sur
  // prospects + form_submissions. Le canal DÉCLARÉ (select ci-dessous) reste prioritaire,
  // ces champs ne le touchent pas. ⚠️ Les liens INTERNES vers /candidature ne portent
  // volontairement aucun utm_* : ils redémarreraient l'attribution de session GA4 —
  // l'attribution Ads est déjà capturée à l'atterrissage (sessionStorage, first-touch).
  const refProperty = (searchParams.get("property_interest") ?? "").slice(0, 64);
  const refRoom = (searchParams.get("room_interest") ?? "").slice(0, 64);
  // Période d'arrivée pré-choisie depuis le bloc « pipeline » des pages maisons
  // (03/09/2026). (Lot A, 01/10/2026) Plus de liste dans le formulaire : la valeur, si elle est
  // l'une des 4 attendues, part SILENCIEUSEMENT dans le payload (handleSubmit) — pas
  // d'<input hidden>, dont la valeur différerait du HTML prérendu sans query. Le bloc post-envoi
  // ne repose alors que la question de la durée.
  const refArrival = (["asap", "1-3-months", "3-6-months", "later"] as const).find(
    (v) => v === searchParams.get("arrival"),
  ) ?? "";
  // (Lot A) Jeton du mode « compléments » (edge v19), reçu au succès ; absent → pas de bloc.
  const [detailsToken, setDetailsToken] = useState<string | null>(null);
  // (Lot A) Carte de succès ramenée dans la vue : plus courte que le formulaire, elle pouvait
  // rester au-dessus de l'écran sur mobile (triple soumission du 22/09).
  const successRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (status !== "success" || !successRef.current) return;
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    successRef.current.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [status]);
  // En-tête contextuel (Lot 1d) : quand le candidat arrive d'un CTA maison ou
  // chambre, le formulaire accuse réception de son choix (continuité du
  // parcours). Slug inconnu → pas d'en-tête, jamais d'erreur.
  // (Lot B, 01/10/2026) Rendu APRÈS l'hydratation : Vercel sert le MÊME HTML prérendu, sans
  // query, pour /candidature?… — calculer l'en-tête au premier rendu le rendait différent du HTML
  // et React jetait tout le contenu de la page, formulaire compris (#418 à chaque chargement
  // direct d'un lien maison ou chambre). En navigation interne (cas le plus fréquent), useHydrated
  // vaut déjà true : l'en-tête s'affiche au premier rendu. Au chargement direct, sa hauteur est
  // réservée dès la première peinture par la classe `lvc-cand-ctx` (script #lvc-cand-ctx
  // d'index.html + src/index.css). La réservation reste tant que l'en-tête est affiché (aucun
  // rétrécissement au montage) et tombe dès qu'il disparaît (navigation SPA vers /candidature sans
  // maison, départ de la page). hasOwnProperty : `?property_interest=constructor` ne remonte plus
  // au prototype.
  const hydrated = useHydrated();
  const contextHouse = hydrated && Object.prototype.hasOwnProperty.call(HOUSES, refProperty)
    ? (HOUSES as Record<string, (typeof HOUSES)[keyof typeof HOUSES]>)[refProperty]
    : null;
  useLayoutEffect(() => {
    if (!hydrated || contextHouse) return;
    document.documentElement.classList.remove("lvc-cand-ctx");
  }, [hydrated, contextHouse]);
  useLayoutEffect(() => () => document.documentElement.classList.remove("lvc-cand-ctx"), []);
  const contextRoomNum = refRoom.match(/^chambre-?(\d+)$/)?.[1] ?? null;
  // (Lot 3 SEO funnel — Q3) Liste d'attente d'une maison, et chambre partie entre le clic et
  // le formulaire : `useHouseRooms` n'a aucune donnée au premier rendu sur cette page (pas
  // d'embed chambres) → note affichée seulement après le refresh client, zéro mismatch.
  const contextIsWaitlist = refRoom === "liste-attente";
  const contextRooms = useHouseRooms((contextHouse ? refProperty : "lavilla") as HouseKey);
  const contextRoomGone =
    !!contextHouse && !!contextRoomNum && contextRooms.known &&
    !contextRooms.rooms.some((r) => String(r.room_number) === contextRoomNum && (r.availability === "available" || !!r.available_from));
  // Soumission de TEST (équipe) : /candidature?test=1 → prospects.is_test = true côté
  // Edge (v12), exclue du bulletin et des comptages. Jamais exposée dans l'UI.
  // Depuis le 22/08/2026, `?test=1` posé sur N'IMPORTE QUELLE page d'atterrissage marque
  // aussi toute la session (sessionStorage, cf. src/lib/attribution.ts — protocole LOT F).
  const isTest = searchParams.get("test") === "1" || isTestSession();

  // Formulaire 1 ÉTAPE depuis S33 (10/08/2026). Les champs arrival/duration, retirés à cette
  // date puis rétablis (obligatoires) le 29/08/2026, quittent à nouveau le formulaire principal
  // le 01/10/2026 (Lot A du brief « Formulaire, hydratation, mesure ») : complétion 80 → 60 %,
  // 77 → 60 % à chaque fois qu'ils étaient obligatoires. Ils sont posés APRÈS l'envoi, dans le
  // bloc facultatif CandidatureDetails (edge v19, mode « details ») ; l'edge les accepte toujours
  // dans le payload principal (?arrival= des pages maisons, ancien bundle en cache).
  const telemetry = useFormTelemetry({
    formId: "candidature",
    formDestination: "supabase-edge",
    baseParams: {
      language: L,
      ref_src: refSrc || "none",
      ref_article: refArticle || "none",
      property_interest: refProperty || "none",
      room_interest: refRoom || "none",
    },
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
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
    if (refProperty) payload.property_interest = refProperty;
    if (refRoom) payload.room_interest = refRoom;
    // (Lot A) Période pré-choisie sur une page maison, transmise sans être affichée.
    if (refArrival) payload.arrival = refArrival;
    if (isTest) payload.isTest = "1";
    // Attribution technique Ads (utm_* + gclid) capturée à l'atterrissage de la session
    // (first-touch, sessionStorage — src/lib/attribution.ts) → colonnes dédiées côté base
    // (Edge v13). Le canal DÉCLARÉ (`source`) n'est jamais surchargé. Absente → rien
    // d'envoyé : un client ancien/en cache reste strictement rétrocompatible.
    Object.assign(payload, attributionPayload());
    // (Lot 1, 03/09/2026) Page d'atterrissage + referrer de la session (write-once,
    // src/lib/attribution.ts) et page de soumission → colonnes landing_page / referrer /
    // entry_page de form_submissions (Edge v17). Absents (ancien bundle, stockage
    // indisponible) → rien d'envoyé, l'Edge reste rétrocompatible.
    Object.assign(payload, landingPayload());
    try { payload.entry_page = window.location.pathname.slice(0, 512); } catch { /* noop */ }
    // Langue explicite : l'Edge Function ne peut plus se fier au Referer
    // (la Referrer-Policy par défaut ampute le path en cross-origin, ce qui
    // loggait toutes les soumissions en « fr »).
    payload.language = L;

    // Clé d'idempotence (cf. SUBMISSION_KEY_STORAGE). sessionStorage peut jeter
    // (navigation privée stricte) : dans ce cas, pas d'idempotence — comme avant.
    let submissionKey = "";
    try {
      submissionKey = sessionStorage.getItem(SUBMISSION_KEY_STORAGE) ?? "";
      if (!submissionKey) {
        submissionKey = crypto.randomUUID();
        sessionStorage.setItem(SUBMISSION_KEY_STORAGE, submissionKey);
      }
    } catch { /* stockage indisponible — l'envoi reste possible */ }
    if (submissionKey) payload.submission_key = submissionKey;

    // Latence réelle du POST (Lot 1b) : jointe à form_submit ET form_error —
    // tranche l'invérifiable « latence mobile 4G » du diagnostic (§4.1).
    const submitStartedAt = performance.now();
    let httpStatus: number | "network" = "network";

    try {
      const response = await fetch(EDGE_FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(payload),
      });
      httpStatus = response.status;

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          (data && typeof data === "object" && "error" in data && typeof data.error === "string")
            ? data.error
            : `Erreur ${response.status}`
        );
      }

      // (Lot A) Jeton du bloc « 2 questions » (edge v19) ; absent (edge v18, doublon,
      // même email < 10 min) → pas de bloc, rien d'autre ne change.
      setDetailsToken(
        data && typeof data === "object" && "details_token" in data && typeof data.details_token === "string"
          ? data.details_token
          : null,
      );
      setStatus("success");

      // Succès reçu : la clé a fait son travail — une éventuelle candidature
      // suivante dans la même session repart avec une clé neuve.
      try { sessionStorage.removeItem(SUBMISSION_KEY_STORAGE); } catch { /* noop */ }

      // Tracking GA4 — form_submit émis UNIQUEMENT après réponse OK (vraie
      // candidature) via useFormTelemetry, qui désarme aussi form_abandon.
      telemetry.trackSubmit({
        lead_source: payload.source || "unknown",
        submit_latency_ms: Math.round(performance.now() - submitStartedAt),
        // (Lot A) Canal préféré choisi (dimension personnalisée contact_pref).
        contact_pref: payload.contact_preference || "none",
      });

      form.reset();
      setSourceChoice(""); // le select est contrôlé — form.reset() ne le vide pas
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : language === "en"
          ? "Submission failed. Please try again."
          : "L'envoi a échoué. Merci de réessayer."
      );
      // form_error (Lot 1b) — le catch n'est plus muet : échecs HTTP (status du
      // POST) et réseau ("network") remontent avec la latence réelle.
      telemetry.trackError({
        status: httpStatus,
        message: err instanceof Error ? err.message : String(err),
        submitLatencyMs: performance.now() - submitStartedAt,
      });
    }
  }

  return (
    <main className="relative pt-16">
      <SEO
        title={language === "en" ? "Apply in 2 minutes, reply within 48 h" : "Candidater en 2 minutes, réponse sous 48 h"}
        description={language === "en"
          ? "Apply in 2 minutes: reply within 48 h, move in within 72 h of your first contact if a room is available. Furnished all-inclusive rooms near Geneva."
          : "Candidate en 2 minutes. Réponse sous 48 h, emménagement en 72 h dès le premier contact si une chambre est disponible. Chambres meublées près de Genève."}
        url="https://www.lavillacoliving.com/candidature"
      />
      {/* Hero compacté (S33) : ≤ 0,8 écran, le formulaire doit arriver vite. */}
      <section className="py-10 md:py-14 bg-white">
        <div className="container-custom text-center">
          <span className="text-xs text-[#78716C] uppercase tracking-[0.3em] mb-4 block">
            {language === "en" ? "Get Started" : "Commencer"}
          </span>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-light text-[#1C1917] mb-4"
            style={{ fontFamily: '"DM Serif Display", serif' }}
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

      {/* Form — remonté juste sous le hero (S33) : premier champ ≤ 1,2 écran desktop */}
      <section className="py-12 lg:py-16 bg-[#FAF9F6]">
        <div className="container-custom max-w-3xl">
          {/* Dispo réelle (revue 18/08) : lue sur v_public_rooms via useRoomAvailability,
              embarquée dans le prérendu. La constante manuelle AVAILABILITY a été
              supprimée — sans données, le libellé redevient qualitatif, jamais chiffré. */}
          <div className="mb-6 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#D4A574] text-sm text-[#1C1917]">
              <Calendar className="w-4 h-4 text-[#D4A574]" />
              {shortAvailabilityLabel(availability, L)}
            </span>
          </div>

          {/* En-tête contextuel (Lot 1d) — accuse réception du choix maison/chambre
              porté par ?property_interest (± room_interest). (Lot B) Emplacement toujours rendu,
              vide dans le HTML prérendu : hauteur réservée par html.lvc-cand-ctx (index.css). */}
          <div className="cand-ctx-slot">
          {contextHouse && (
            <div className="mb-6 bg-white border border-[#E7E5E4] p-4 flex items-center gap-4">
              <img
                src={contextHouse.img}
                alt={contextHouse.label}
                className="w-20 h-16 object-cover flex-none"
                width={80}
                height={64}
              />
              <div className="text-left">
                <p className="text-sm text-[#1C1917]">
                  {L === "en" ? "Your application is for: " : "Ta candidature concerne : "}
                  <strong>
                    {contextHouse.label}
                    {refRoom
                      ? ` — ${contextRoomNum
                        ? (L === "en" ? `room ${contextRoomNum}` : `chambre ${contextRoomNum}`)
                        : contextIsWaitlist ? (L === "en" ? "waiting list" : "liste d'attente") : refRoom}`
                      : ""}
                  </strong>
                </p>
                {contextRoomGone && (
                  <p className="text-xs text-[#9A5B08] mt-1">
                    {L === "en"
                      ? "This room has just been taken — send your application anyway, we'll offer you the next one in this house."
                      : "Cette chambre vient de partir — envoie quand même ta candidature, on te propose la prochaine libération dans cette maison."}
                  </p>
                )}
                <p className="text-xs text-[#57534E] mt-1">
                  {L === "en"
                    ? <>All inclusive {housePriceLabel(refProperty as HouseKey, "en")} · Reply within 48h</>
                    : <>Tout inclus {housePriceLabel(refProperty as HouseKey, "fr")} · Réponse sous 48 h</>}
                </p>
              </div>
            </div>
          )}
          </div>

          {/* Reassurance strip */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-[#57534E]">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#D4A574]" />
              {language === "en" ? "No commitment" : "Sans engagement"}
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
            <div ref={successRef} className="bg-white border border-[#E7E5E4] p-12 md:p-16 text-center scroll-mt-24">
              <div className="w-16 h-16 bg-[#D4A574] rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-white" strokeWidth={3} />
              </div>
              <h2
                className="text-3xl md:text-4xl font-light text-[#1C1917] mb-4"
                style={{ fontFamily: '"DM Serif Display", serif' }}
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
              {/* (Lot A) 2 questions facultatives après l'envoi — jamais bloquantes. */}
              {detailsToken && (
                <CandidatureDetails
                  token={detailsToken}
                  language={L}
                  arrivalKnown={!!refArrival}
                  endpoint={EDGE_FUNCTION_URL}
                  anonKey={SUPABASE_ANON_KEY}
                  baseParams={{
                    language: L,
                    property_interest: refProperty || "none",
                    room_interest: refRoom || "none",
                  }}
                />
              )}
              {/* (Lot L5, D10 Jérôme 09/10/2026) Encart A.8 après confirmation seulement (brief §8, question 3). */}
              <FacebookGroupCallout position="candidature_success" house={refProperty || undefined} className="mt-8 text-left" />
              <button
                type="button"
                onClick={() => { setDetailsToken(null); setStatus("idle"); }}
                className={`text-sm text-[#78716C] underline hover:text-[#1C1917] transition-colors${detailsToken ? " mt-8" : ""}`}
              >
                {language === "en" ? "Submit another application" : "Envoyer une autre candidature"}
              </button>
            </div>
          ) : (
          <form
            onSubmit={handleSubmit}
            {...telemetry.formProps}
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

            {/* Micro-réassurance (Lot 1d) — une ligne, uniquement quand le candidat
                arrive sans contexte maison (l'en-tête contextuel la remplace sinon). */}
            {!contextHouse && (
              <p className="cand-micro text-xs text-[#78716C] text-center mb-6">
                {language === "en"
                  ? "2 minutes is all it takes — reply within 48h."
                  : "2 minutes suffisent — réponse sous 48 h."}
              </p>
            )}

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
                    aria-describedby="phone-help"
                    className="w-full px-4 py-3 border border-[#E7E5E4] focus:border-[#D4A574] focus:outline-none transition-colors"
                  />
                  {/* (Lot A, 01/10/2026) Réassurance toujours visible — pas un placeholder. */}
                  <p id="phone-help" className="mt-2 text-xs text-[#78716C]">
                    {language === "en"
                      ? "Only used to set up your chat with Fanny. Never any sales calls."
                      : "Uniquement pour caler ton échange avec Fanny. Jamais de démarchage."}
                  </p>
                  {/* (Lot A) Canal préféré — facultatif, un geste, aucune présélection, jamais
                      `required` : un groupe radio natif (clavier, lecteurs d'écran), pastilles
                      d'au moins 44 px. Arrivée et durée : posées APRÈS l'envoi (CandidatureDetails). */}
                  <fieldset className="mt-4">
                    <legend className="block text-sm text-[#57534E] mb-2">
                      {language === "en"
                        ? "How would you like us to reach you? (optional)"
                        : "Comment préfères-tu qu'on te contacte ? (facultatif)"}
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {CONTACT_OPTIONS.map((o) => (
                        <label key={o.value} className="cursor-pointer">
                          <input type="radio" name="contact_preference" value={o.value} className="peer sr-only" />
                          <span className="inline-flex items-center justify-center min-h-[44px] px-4 border border-[#E7E5E4] text-sm text-[#57534E] transition-colors hover:border-[#D4A574] peer-checked:border-[#D4A574] peer-checked:bg-[#FAF9F6] peer-checked:text-[#1C1917] peer-focus-visible:ring-2 peer-focus-visible:ring-[#D4A574] peer-focus-visible:ring-offset-1">
                            {language === "en" ? o.en : o.fr}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-[#57534E] mb-2">
                    {language === "en"
                      ? "How did you hear about us? (optional)"
                      : "Comment as-tu entendu parler de nous ? (optionnel)"}
                  </label>
                  <select
                    name="source"
                    value={sourceChoice}
                    onChange={(e) => setSourceChoice(e.target.value)}
                    className="w-full px-4 py-3 border border-[#E7E5E4] focus:border-[#D4A574] focus:outline-none transition-colors bg-white"
                  >
                    <option value="">
                      {language === "en" ? "Select" : "Sélectionner"}
                    </option>
                    {/* Parrainage en tête de liste : la visibilité de l'option
                        conditionne le succès du programme (brief 28/07/2026). */}
                    <option value="resident-referral">
                      {language === "en" ? "A resident referred me" : "Un résident m'a recommandé"}
                    </option>
                    <option value="google">Google</option>
                    {/* ai-assistant (Lot S3 brief Socle entité, 09/2026) : mesure de la part de voix
                        des assistants IA (ChatGPT, Perplexity, Gemini…). Mappé côté Edge v18 vers
                        `assistant_ia` (prospects_source_check, 16 valeurs). GA4 : `lead_source`
                        porte déjà la valeur brute du select (useFormTelemetry). */}
                    <option value="ai-assistant">
                      {language === "en"
                        ? "AI assistant (ChatGPT, Perplexity, Gemini…)"
                        : "Assistant IA (ChatGPT, Perplexity, Gemini…)"}
                    </option>
                    {/* google-maps / facebook / whatsapp (02/09/2026) : mappés côté
                        Edge v16 vers facebook / whatsapp / google_maps
                        (prospects_source_check, 15 valeurs depuis le 02/09). */}
                    <option value="google-maps">Google Maps</option>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="whatsapp">WhatsApp</option>
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
                  {sourceChoice === "resident-referral" && (
                    <div className="mt-4">
                      <label className="block text-sm text-[#57534E] mb-2">
                        {language === "en"
                          ? "First name (and last name if known) of the resident who referred you"
                          : "Prénom (et nom si tu le connais) du résident qui t'a recommandé"}
                      </label>
                      {/* Optionnel volontairement : ne jamais bloquer une candidature
                          parce que le candidat ne se souvient plus du nom exact. */}
                      <input
                        type="text"
                        name="referrerName"
                        maxLength={80}
                        className="w-full px-4 py-3 border border-[#E7E5E4] focus:border-[#D4A574] focus:outline-none transition-colors"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Error message */}
            {status === "error" && (
              <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-sm">
                {errorMessage}
              </div>
            )}

            {/* Submit — (Lot A) form_submit_click au clic, AVANT la validation native (Entrée
                comprise), puis form_invalid pour chaque champ bloqué pendant cette tentative. */}
            <button
              type="submit"
              disabled={status === "submitting"}
              onClick={(e) => {
                const choice = e.currentTarget.form?.elements.namedItem("contact_preference");
                const pref = choice && "value" in choice ? String(choice.value || "") : "";
                telemetry.trackSubmitClick({ contact_pref: pref || "none" });
              }}
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
                    ? "SEND MY APPLICATION"
                    : "ENVOYER MA CANDIDATURE"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            {/* (Lot A, 01/10/2026) Juste sous le bouton : visible avec lui à 390 px. */}
            <p className="text-xs text-[#57534E] text-center mt-3">
              {language === "en"
                ? "Early applicants are the first to know when a room becomes available."
                : "Les premiers candidats sont les premiers prévenus quand une chambre se libère."}
            </p>
            <p className="text-sm text-[#78716C] text-center mt-3">
              {language === "en" ? "30 seconds, no commitment" : "30 secondes, sans engagement"}
            </p>
            <p className="text-xs text-[#78716C] text-center mt-1">
              {language === "en" ? "Your data remains confidential." : "Tes données restent confidentielles."}
            </p>
            {/* Porte humaine au plus près de la décision (Lot 1d) — discrète,
                cohérence premium ; la porte existante en bas de page reste. */}
            <p className="text-sm text-center mt-6">
              <a
                href="https://wa.me/33664315134"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  try {
                    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "whatsapp_click", {
                      position: "under_submit",
                      language: L,
                    });
                  } catch { /* noop */ }
                }}
                className="text-[#57534E] underline decoration-[#D4A574] underline-offset-4 hover:text-[#1C1917] transition-colors"
              >
                {language === "en" ? "Prefer to talk first? → WhatsApp" : "Tu préfères discuter d'abord ? → WhatsApp"}
              </a>
            </p>
          </form>
          )}
        </div>
      </section>

      {/* Testimonials — réassurance post-form (S33) */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-xs text-[#78716C] uppercase tracking-[0.3em] mb-4 block">
              {language === "en" ? "What our residents say" : "Ce que disent nos résidents"}
            </span>
            <h2
              className="text-3xl md:text-4xl font-light text-[#1C1917]"
              style={{ fontFamily: '"DM Serif Display", serif' }}
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

      {/* Steps — après le form (S33) : explique la suite, Candidater ✓ → Rencontrer → Emménager */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-xs text-[#78716C] uppercase tracking-[0.3em] mb-4 block">
              {language === "en" ? "The Process" : "Le Processus"}
            </span>
            <h2
              className="text-4xl md:text-5xl font-light text-[#1C1917]"
              style={{ fontFamily: '"DM Serif Display", serif' }}
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

      {/* Social proof stats — chiffres business pour rassurer (CRO win #1).
          (Lot L3, Jérôme 09/10/2026) D3 : ancien taux d'occupation « sur 5 ans » retiré → séjour moyen (STATS.averageStayMonths) ;
          D4 : note Google (STATS_DISPLAY.googleRatingValue/Label) + lien « Voir les avis » ; année = STATS.foundedYear. */}
      <section className="py-12 bg-[#FAF9F6] border-y border-[#E7E5E4]">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div className="flex flex-col items-center">
              <Users className="w-8 h-8 text-[#D4A574] mb-3" />
              <p className="text-3xl font-light text-[#1C1917] mb-1" style={{ fontFamily: '"DM Serif Display", serif' }}>
                {`${STATS.totalResidents}+`}
              </p>
              <p className="text-sm text-[#57534E]">
                {language === "en" ? `Residents since ${STATS.foundedYear}` : `Résidents depuis ${STATS.foundedYear}`}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Calendar className="w-8 h-8 text-[#D4A574] mb-3" />
              <p className="text-3xl font-light text-[#1C1917] mb-1" style={{ fontFamily: '"DM Serif Display", serif' }}>
                {language === "en" ? `${STATS.averageStayMonths} months` : `${STATS.averageStayMonths} mois`}
              </p>
              <p className="text-sm text-[#57534E]">
                {language === "en" ? "Average stay" : "De séjour en moyenne"}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Star className="w-8 h-8 text-[#D4A574] mb-3 fill-[#D4A574]" />
              <p className="text-3xl font-light text-[#1C1917] mb-1" style={{ fontFamily: '"DM Serif Display", serif' }}>
                {STATS_DISPLAY[L].googleRatingValue}
              </p>
              <p className="text-sm text-[#57534E]">{STATS_DISPLAY[L].googleRatingLabel}</p>
              <a
                href={GOOGLE_REVIEWS.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 text-sm text-[#D4A574] underline underline-offset-4 hover:text-[#1C1917] transition-colors"
              >
                {GOOGLE_REVIEWS_LINK_LABEL[L]}
              </a>
            </div>
          </div>
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
                : "Une question rapide sur les disponibilités, les quartiers ou le fonctionnement ? Écris-nous — réponse généralement sous 1h en jours ouvrés."}
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
              style={{ fontFamily: '"DM Serif Display", serif' }}
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
                a_fr: "72 h dès ton premier contact si une chambre est disponible. Étape 1 : réponse sous 48 h. Étape 2 : appel vidéo (30 min). Étape 3 : visite physique ou virtuelle. Étape 4 : signature en ligne du bail + caution. Étape 5 : emménagement avec une valise.",
                a_en: "Within 72 h of your first contact if a room is available. Step 1: reply within 48 h. Step 2: video call (30 min). Step 3: physical or virtual tour. Step 4: online lease signing + deposit. Step 5: move in with a suitcase.",
              },
              {
                q_fr: "Quel est le loyer et que comprend-il vraiment ?",
                q_en: "What is the rent and what does it really include?",
                a_fr: `À partir de ${PRICE_SHARED_CHF_FR}/mois tout inclus : chambre meublée, charges (eau, électricité, chauffage), fibre 8 Gbps, ménage 3 fois par semaine, accès piscine/sauna/gym, cours de yoga et fitness privés, abonnements streaming, événements communautaires mensuels. Caution 2 mois de loyer hors charges. Aucun frais d'agence, aucun frais de dossier. Le loyer contractuel est libellé en euros : de ${EUR_SHARED_FR_NUM} à ${EUR_STANDARD_FR_NUM} €/mois selon la chambre. Les montants en CHF affichés sur le site sont indicatifs (taux d'${CONTRACT_EUR.rateLabelFr}).`,
                a_en: `From ${PRICE_SHARED_CHF_EN}/month all-inclusive: furnished room, utilities (water, electricity, heating), 8 Gbps fiber, cleaning three times a week, pool/sauna/gym access, private yoga and fitness classes, streaming subscriptions, monthly community events. Deposit: 2 months' rent excl. utilities. No agency fees, no application fees. The contractual rent is set in euros: €${EUR_SHARED_EN_NUM}–€${EUR_STANDARD_EN_NUM}/month depending on the room. CHF amounts shown on the site are indicative (${CONTRACT_EUR.rateLabelEn} rate).`,
              },
              {
                q_fr: "Quelle est la durée minimale du bail ?",
                q_en: "What is the minimum lease duration?",
                a_fr: "Aucune durée minimale imposée : le bail est de 12 mois renouvelable, et tu es libre de partir à tout moment avec 1 mois de préavis. Cadre conforme à la loi française (Alur).",
                a_en: "No set minimum: the lease is 12 months, renewable, and you are free to leave at any time with 1 month's notice. Compliant with French Alur law.",
              },
              {
                q_fr: "Je peux visiter avant de signer ?",
                q_en: "Can I visit before signing?",
                a_fr: "Oui, c'est systématique. Visite physique (30-45 min) ou virtuelle si tu es à l'étranger. Tu rencontres aussi un coliver actuel pour avoir un retour terrain honnête sur la vie communautaire.",
                a_en: "Yes, always. Physical tour (30-45 min) or virtual if you're abroad. You also meet a current resident to get an honest first-hand take on community life.",
              },
              {
                // (Lot A, 01/10/2026) Le formulaire ne demande plus la date : réponse alignée.
                q_fr: "Et si je ne connais pas encore ma date d'arrivée ?",
                q_en: "What if I don't know my arrival date yet?",
                a_fr: "Aucun souci : le formulaire ne te la demande pas. Juste après l'envoi, tu peux nous indiquer une période si tu la connais déjà ; sinon, on cale ensemble une date au premier échange. Candidater ne t'engage à rien.",
                a_en: "No problem: the form doesn't ask for it. Right after sending, you can tell us a rough period if you already know it; otherwise, we'll set a date together on our first call. Applying doesn't commit you to anything.",
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
