import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { safeGtag } from "@/hooks/useFormTelemetry";

// Bloc « 2 questions pour préparer ton échange » (Lot A du brief « Formulaire, hydratation,
// mesure », 01/10/2026) : les questions arrivée / durée, retirées du formulaire principal, sont
// posées APRÈS l'envoi, sur l'écran de succès. La candidature est déjà enregistrée : ce bloc ne
// peut jamais la faire échouer ni modifier l'état de succès. Les réponses partent à l'edge
// `send-candidature-email` (v19, mode « details ») avec le jeton à 1 h reçu au succès ; l'edge
// n'écrit que ce qui est encore vide et envoie l'email « Compléments » dans le fil de la
// notification. Rendu UNIQUEMENT après une soumission réussie : jamais dans le HTML prérendu.
//
// Events GA4 (hors <form> instrumenté → n'alimentent pas form_step_complete) :
//   form_details_view    — bloc visible à ≥ 50 % (IntersectionObserver), une fois
//   form_details_submit  — réponses enregistrées (arrival_answered / duration_answered)
//   form_details_skip    — « Plus tard » (skip_reason=later) ou départ sans répondre après
//                          l'avoir vu (skip_reason=leave : pagehide, onglet masqué, démontage)
//   form_details_error   — échec de l'envoi (statut HTTP ou "network")

type Lang = "fr" | "en";

// Mêmes valeurs que les maps ARRIVAL_LABELS / DURATION_LABELS de l'edge v19 : ne pas les
// renommer d'un seul côté. Libellés identiques à ceux de l'ancien formulaire.
const ARRIVAL_OPTIONS: Array<{ value: string; fr: string; en: string }> = [
  { value: "asap", fr: "Le plus tôt possible (sous 1 mois)", en: "As soon as possible (within 1 month)" },
  { value: "1-3-months", fr: "Dans 1 à 3 mois", en: "Within 1 to 3 months" },
  { value: "3-6-months", fr: "Dans 3 à 6 mois", en: "Within 3 to 6 months" },
  { value: "later", fr: "Plus tard / pas encore décidé", en: "Later / not decided yet" },
];
const DURATION_OPTIONS: Array<{ value: string; fr: string; en: string }> = [
  { value: "2-3", fr: "Jusqu'à 3 mois", en: "Up to 3 months" },
  { value: "3-6", fr: "3-6 mois", en: "3-6 months" },
  { value: "6-12", fr: "6-12 mois", en: "6-12 months" },
  { value: "12+", fr: "12+ mois", en: "12+ months" },
];

const SELECT_CLASS =
  "w-full px-4 py-3 border border-[#E7E5E4] focus:border-[#D4A574] focus:outline-none transition-colors bg-white";

export interface CandidatureDetailsProps {
  token: string;
  language: Lang;
  /** L'arrivée est déjà connue (lien ?arrival= des pages maisons) : seule la durée est demandée. */
  arrivalKnown: boolean;
  endpoint: string;
  anonKey: string;
  /** Params joints à chaque event (language, property_interest…). */
  baseParams: Record<string, string>;
}

type Status = "idle" | "sending" | "done" | "skipped" | "error";

export function CandidatureDetails({ token, language, arrivalKnown, endpoint, anonKey, baseParams }: CandidatureDetailsProps) {
  const en = language === "en";
  const [arrival, setArrival] = useState("");
  const [duration, setDuration] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const rootRef = useRef<HTMLDivElement>(null);
  const viewedRef = useRef(false);
  const settledRef = useRef(false); // répondu, ignoré ou parti : plus aucun skip
  const paramsRef = useRef(baseParams);
  useEffect(() => {
    paramsRef.current = baseParams;
  });

  const track = (event: string, extra: Record<string, string | number> = {}) =>
    safeGtag("event", event, { form_id: "candidature_details", ...paramsRef.current, ...extra });

  // Vue : au moins la moitié du bloc à l'écran, une fois.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      viewedRef.current = true;
      track("form_details_view");
      return;
    }
    const io = new IntersectionObserver((entries) => {
      if (viewedRef.current || !entries.some((e) => e.isIntersecting)) return;
      viewedRef.current = true;
      track("form_details_view");
      io.disconnect();
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Départ sans répondre, après avoir vu le bloc : skip « leave », une fois.
  useEffect(() => {
    const leave = () => {
      if (!viewedRef.current || settledRef.current) return;
      settledRef.current = true;
      track("form_details_skip", { skip_reason: "leave", transport_type: "beacon" });
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") leave();
    };
    window.addEventListener("pagehide", leave);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", leave);
      document.removeEventListener("visibilitychange", onVisibility);
      leave();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function send() {
    if (status === "sending" || (!arrival && !duration)) return;
    setStatus("sending");
    let httpStatus: number | "network" = "network";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${anonKey}` },
        body: JSON.stringify({
          mode: "details",
          details_token: token,
          language,
          ...(arrival && !arrivalKnown ? { arrival } : {}),
          ...(duration ? { duration } : {}),
        }),
      });
      httpStatus = response.status;
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      settledRef.current = true;
      setStatus("done");
      track("form_details_submit", {
        arrival_answered: arrival && !arrivalKnown ? 1 : 0,
        duration_answered: duration ? 1 : 0,
      });
    } catch {
      setStatus("error");
      track("form_details_error", { error_status: String(httpStatus) });
    }
  }

  function later() {
    settledRef.current = true;
    setStatus("skipped");
    track("form_details_skip", { skip_reason: "later" });
  }

  if (status === "skipped") return null;

  if (status === "done") {
    return (
      <div ref={rootRef} className="mt-8 pt-8 border-t border-[#E7E5E4] text-sm text-[#57534E] flex items-center justify-center gap-2" role="status">
        <Check className="w-4 h-4 text-[#D4A574]" />
        {en ? "Thanks, noted — see you soon." : "Merci, c'est noté — à très vite."}
      </div>
    );
  }

  const questions = arrivalKnown ? 1 : 2;
  return (
    <div ref={rootRef} className="mt-8 pt-8 border-t border-[#E7E5E4] text-left">
      <h3 className="text-lg font-medium text-[#1C1917] mb-1">
        {en
          ? `${questions === 1 ? "1 question" : "2 questions"} to prepare our chat`
          : `${questions === 1 ? "1 question" : "2 questions"} pour préparer ton échange`}
      </h3>
      <p className="text-sm text-[#78716C] mb-6">
        {en ? "Optional — your application is already saved." : "Facultatif — ta candidature est déjà enregistrée."}
      </p>
      <div className="grid gap-4">
        {!arrivalKnown && (
          <div>
            <label htmlFor="details-arrival" className="block text-sm text-[#57534E] mb-2">
              {en ? "When would you like to join?" : "Quand souhaites-tu nous rejoindre ?"}
            </label>
            <select id="details-arrival" value={arrival} onChange={(e) => setArrival(e.target.value)} className={SELECT_CLASS}>
              <option value="">{en ? "Select arrival period" : "Sélectionner la période"}</option>
              {ARRIVAL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{en ? o.en : o.fr}</option>)}
            </select>
          </div>
        )}
        <div>
          <label htmlFor="details-duration" className="block text-sm text-[#57534E] mb-2">
            {en ? "How long do you plan to stay?" : "Combien de temps comptes-tu rester ?"}
          </label>
          <select id="details-duration" value={duration} onChange={(e) => setDuration(e.target.value)} className={SELECT_CLASS}>
            <option value="">{en ? "Select duration" : "Sélectionner la durée"}</option>
            {DURATION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{en ? o.en : o.fr}</option>)}
          </select>
        </div>
      </div>
      {status === "error" && (
        <p role="alert" className="mt-4 text-sm text-[#9A5B08]">
          {en ? "No worries — we'll cover it on our call." : "Pas grave, on en parlera à l'échange."}
        </p>
      )}
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="button"
          onClick={send}
          disabled={status === "sending" || (!arrival && !duration)}
          className="px-6 py-3 border border-[#1C1917] text-sm font-medium text-[#1C1917] hover:bg-[#1C1917] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#1C1917]"
        >
          {status === "sending" ? (en ? "Sending…" : "Envoi…") : (en ? "Send my answers" : "Envoyer mes réponses")}
        </button>
        <button type="button" onClick={later} className="text-sm text-[#78716C] underline underline-offset-4 hover:text-[#1C1917] transition-colors">
          {en ? "Later" : "Plus tard"}
        </button>
      </div>
    </div>
  );
}
