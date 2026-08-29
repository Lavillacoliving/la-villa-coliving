import { useEffect, useMemo, useRef } from "react";

// Télémétrie GA4 des formulaires publics (candidature, waitlist).
// La mesure améliorée GA4 ne capte pas de façon fiable les formulaires SPA
// envoyés via fetch() (suivi tombé à zéro après la refonte de mai 2026) :
// tout est donc instrumenté à la main ici.
//
// Events émis :
//   form_start          — première interaction réelle avec un champ nommé (≠ honeypot)
//   form_step_complete  — champ validé au blur (une fois par champ et par session de
//                         formulaire ; form_step = NOM du champ). ⚠️ Historique GA4 :
//                         les hits antérieurs au 29/08/2026 (6 events) viennent du
//                         formulaire 2 étapes S32 (03-10/08, form_step numérique) —
//                         ne JAMAIS comparer avant/après ce branchement (Lot 1b).
//   form_error          — échec du submit (Lot 1b) : statut HTTP ou "network",
//                         message tronqué 120 c., latence réelle du POST
//   <submitEventName>   — via trackSubmit(), à appeler UNIQUEMENT après réponse OK
//   form_abandon        — départ après form_start sans submit (pagehide, onglet
//                         masqué — l'OS mobile peut tuer l'onglet sans pagehide —,
//                         ou navigation SPA via le cleanup) ; au plus une fois
//
// ⚠️ Double comptage assumé (audit 28/08, C2) : form_abandon part aussi sur
// visibilitychange→hidden. Un mobile qui bascule d'app en cours de saisie puis
// revient soumettre compte en abandon ET en submit — le taux d'abandon GA4 est un
// MAJORANT structurel. Option volontairement non implémentée (à décider avec
// Jérôme) : différer l'abandon-on-hidden de ~60 s, annulable au retour, pour
// réduire le double comptage sans perdre les vrais départs.
// form_error ne désarme PAS form_abandon : après un échec, le candidat peut encore
// soumettre (ou partir — et ce départ-là est un vrai abandon).

export interface UseFormTelemetryOptions {
  formId: string;
  formDestination: string;
  /** Params joints à chaque event (language, ref_src, ref_article…). */
  baseParams?: Record<string, string>;
  /** "form_submit" par défaut ; "waitlist_submit" pour la liste d'attente. */
  submitEventName?: string;
}

export interface FormTelemetry {
  /** À spreader sur le <form> : capte focus + input (form_start) et blur (form_step_complete). */
  formProps: {
    onFocus: (e: React.FocusEvent<HTMLFormElement>) => void;
    onInput: (e: React.FormEvent<HTMLFormElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLFormElement>) => void;
  };
  /** À appeler après réponse OK du backend : émet le submit et désarme form_abandon. */
  trackSubmit: (extraParams?: Record<string, string | number>) => void;
  /** Échec du submit (HTTP ou réseau) — le catch n'est plus muet (Lot 1b). */
  trackError: (params: { status: number | string; message: string; submitLatencyMs?: number }) => void;
}

// L'analytics ne doit jamais bloquer l'UI (adblock, gtag absent, etc.).
function safeGtag(...args: unknown[]) {
  try {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.(...args);
  } catch {
    /* noop */
  }
}

const FIELD_TAGS = new Set(["INPUT", "SELECT", "TEXTAREA"]);
const HONEYPOT_NAME = "botcheck";

export function useFormTelemetry(options: UseFormTelemetryOptions): FormTelemetry {
  const startedRef = useRef(false);
  const submittedRef = useRef(false);
  const abandonedRef = useRef(false);
  const startedAtRef = useRef(0);
  const lastFieldRef = useRef("none");
  const completedFieldsRef = useRef<Set<string>>(new Set());

  // Options lues via ref dans les listeners : jamais de closure périmée.
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  });

  const timeOnForm = () =>
    startedAtRef.current ? Math.round((Date.now() - startedAtRef.current) / 1000) : 0;

  const eventParams = (extra?: Record<string, string | number>) => {
    const { formId, formDestination, baseParams } = optionsRef.current;
    return {
      form_id: formId,
      form_destination: formDestination,
      ...(baseParams ?? {}),
      ...(extra ?? {}),
    };
  };

  useEffect(() => {
    const fireAbandon = () => {
      if (!startedRef.current || submittedRef.current || abandonedRef.current) return;
      abandonedRef.current = true;
      safeGtag(
        "event",
        "form_abandon",
        eventParams({
          // Formulaire 1 étape : le « champ d'arrêt » se lit via last_field +
          // fields_completed (nombre de champs validés au blur avant le départ).
          fields_completed: completedFieldsRef.current.size,
          last_field: lastFieldRef.current,
          time_on_form_seconds: timeOnForm(),
          transport_type: "beacon",
        })
      );
    };

    const onPageHide = () => fireAbandon();
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") fireAbandon();
    };

    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      // Navigation SPA interne (navbar, toggle langue) : ni pagehide ni
      // visibilitychange ne partent — le démontage est le signal d'abandon.
      // Sans risque en StrictMode dev : au double-mount, started est encore faux.
      fireAbandon();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useMemo<FormTelemetry>(() => {
    const handleFieldInteraction = (e: { target: EventTarget | null }) => {
      const el = e.target as HTMLElement | null;
      if (!el || !FIELD_TAGS.has(el.tagName)) return;
      const name = (el as HTMLInputElement).name;
      if (!name || name === HONEYPOT_NAME) return;
      lastFieldRef.current = name;
      if (startedRef.current) return;
      startedRef.current = true;
      startedAtRef.current = Date.now();
      safeGtag("event", "form_start", eventParams({ first_field: name }));
    };

    // form_step_complete au blur d'un champ VALIDE et non vide, une fois par champ.
    // Délégué depuis le <form> (le blur bubble en focusout) : couvre aussi les
    // champs conditionnels montés plus tard (referrerName).
    const handleFieldBlur = (e: { target: EventTarget | null }) => {
      const el = e.target as HTMLInputElement | null;
      if (!el || !FIELD_TAGS.has(el.tagName)) return;
      const name = el.name;
      if (!name || name === HONEYPOT_NAME) return;
      if (!String(el.value ?? "").trim()) return;
      if (typeof el.checkValidity === "function" && !el.checkValidity()) return;
      if (completedFieldsRef.current.has(name)) return;
      completedFieldsRef.current.add(name);
      safeGtag(
        "event",
        "form_step_complete",
        eventParams({
          form_step: name,
          fields_completed: completedFieldsRef.current.size,
          time_on_form_seconds: timeOnForm(),
        })
      );
    };

    return {
      formProps: {
        onFocus: handleFieldInteraction,
        onInput: handleFieldInteraction,
        onBlur: handleFieldBlur,
      },
      trackSubmit(extraParams?: Record<string, string | number>) {
        submittedRef.current = true;
        safeGtag(
          "event",
          optionsRef.current.submitEventName ?? "form_submit",
          eventParams({ ...(extraParams ?? {}), time_on_form_seconds: timeOnForm() })
        );
      },
      trackError({ status, message, submitLatencyMs }) {
        safeGtag(
          "event",
          "form_error",
          eventParams({
            error_status: String(status),
            error_message: String(message ?? "").slice(0, 120),
            time_on_form_seconds: timeOnForm(),
            ...(submitLatencyMs !== undefined
              ? { submit_latency_ms: Math.round(submitLatencyMs) }
              : {}),
          })
        );
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
