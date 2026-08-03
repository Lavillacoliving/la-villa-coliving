import { useEffect, useMemo, useRef } from "react";

// Télémétrie GA4 des formulaires publics (candidature, waitlist).
// La mesure améliorée GA4 ne capte pas de façon fiable les formulaires SPA
// envoyés via fetch() (suivi tombé à zéro après la refonte de mai 2026) :
// tout est donc instrumenté à la main ici.
//
// Events émis :
//   form_start          — première interaction réelle avec un champ nommé (≠ honeypot)
//   form_step_complete  — étape validée (une seule fois par étape)
//   <submitEventName>   — via trackSubmit(), à appeler UNIQUEMENT après réponse OK
//   form_abandon        — départ après form_start sans submit (pagehide, onglet
//                         masqué — l'OS mobile peut tuer l'onglet sans pagehide —,
//                         ou navigation SPA via le cleanup) ; au plus une fois

export interface UseFormTelemetryOptions {
  formId: string;
  formDestination: string;
  /** Params joints à chaque event (language, ref_src, ref_article…). */
  baseParams?: Record<string, string>;
  /** "form_submit" par défaut ; "waitlist_submit" pour la liste d'attente. */
  submitEventName?: string;
}

export interface FormTelemetry {
  /** À spreader sur le <form> : capte focus + input de tous les champs. */
  formProps: {
    onFocus: (e: React.FocusEvent<HTMLFormElement>) => void;
    onInput: (e: React.FormEvent<HTMLFormElement>) => void;
  };
  /** Étape validée (1-indexée) — mémorise aussi l'étape courante pour form_abandon. */
  trackStepComplete: (completedStep: number) => void;
  /** À appeler après réponse OK du backend : émet le submit et désarme form_abandon. */
  trackSubmit: (extraParams?: Record<string, string>) => void;
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
  const currentStepRef = useRef(1);
  const firedStepsRef = useRef<Set<number>>(new Set());

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
          form_step: currentStepRef.current,
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

    return {
      formProps: {
        onFocus: handleFieldInteraction,
        onInput: handleFieldInteraction,
      },
      trackStepComplete(completedStep: number) {
        currentStepRef.current = completedStep + 1;
        if (firedStepsRef.current.has(completedStep)) return;
        firedStepsRef.current.add(completedStep);
        startedRef.current = true;
        safeGtag(
          "event",
          "form_step_complete",
          eventParams({ form_step: completedStep, time_on_form_seconds: timeOnForm() })
        );
      },
      trackSubmit(extraParams?: Record<string, string>) {
        submittedRef.current = true;
        safeGtag(
          "event",
          optionsRef.current.submitEventName ?? "form_submit",
          eventParams({ ...(extraParams ?? {}), time_on_form_seconds: timeOnForm() })
        );
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
