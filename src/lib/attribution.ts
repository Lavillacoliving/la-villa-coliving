// Attribution technique de session — Google Ads (brief UTM/GCLID du 22/08/2026).
//
// À l'atterrissage (appelé depuis main.tsx, AVANT l'hydratation React, dès que le
// bundle s'exécute — l'URL d'arrivée est encore intacte), on lit dans l'URL
// utm_source / utm_medium / utm_campaign / utm_content / utm_term / gclid et on les
// mémorise en sessionStorage (clé `lvc_attribution`), horodatés.
//
// Choix assumés du brief (ne pas « améliorer » sans GO) :
//   - FIRST-TOUCH de session : write-once, jamais écrasé par une navigation ultérieure ;
//   - sessionStorage, PAS localStorage : un revenant J+3 compte organique — biais
//     conservateur voulu (on sous-compte le payant, on ne pollue jamais le juge
//     organique = les candidatures nettes du bulletin) ;
//   - aucune normalisation hors trim + 256 caractères (l'Edge Function fait pareil).
//
// À la soumission, JoinPageV4 joint ces champs au payload de `send-candidature-email`
// (v13), qui les écrit tels quels dans `prospects` ET `form_submissions` (colonnes
// dédiées). `prospects.source` = le DÉCLARATIF du candidat, jamais surchargé par ça.
//
// Marqueur de test (LOT E) : `?test=1` sur N'IMPORTE QUELLE page d'atterrissage (pas
// seulement /candidature) pose `lvc_test_session` pour la session → JoinPageV4 envoie
// `isTest=1` → `is_test = true` en base, exclu des comptages (protocole LOT F).

export const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
] as const;

export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number];
export type AttributionParams = Partial<Record<AttributionKey, string>>;

export interface StoredAttribution extends AttributionParams {
  /** Instant de la capture (ISO 8601) — first-touch de la session. */
  captured_at: string;
  /** Chemin d'atterrissage (sans query), pour diagnostic uniquement. */
  landing_path: string;
}

export const ATTRIBUTION_STORAGE_KEY = "lvc_attribution";
export const TEST_SESSION_STORAGE_KEY = "lvc_test_session";
const MAX_VALUE_LENGTH = 256;

// sessionStorage peut être absent ou lever (navigation privée Safari, stockage
// désactivé, iframe sans partition) : l'attribution ne doit JAMAIS casser la page.
function storage(): Storage | null {
  try {
    if (typeof window === "undefined" || !window.sessionStorage) return null;
    return window.sessionStorage;
  } catch {
    return null;
  }
}

/** Extrait les paramètres d'attribution d'une query string ; `null` si aucun. Pur, testable. */
export function parseAttributionParams(search: string): AttributionParams | null {
  const params = new URLSearchParams(search);
  const out: AttributionParams = {};
  let found = false;
  for (const key of ATTRIBUTION_KEYS) {
    const raw = params.get(key);
    if (raw === null) continue;
    const value = raw.trim().slice(0, MAX_VALUE_LENGTH);
    if (!value) continue;
    out[key] = value;
    found = true;
  }
  return found ? out : null;
}

/** Attribution mémorisée pour la session, ou `null` (absente ou illisible). */
export function getStoredAttribution(): StoredAttribution | null {
  const store = storage();
  if (!store) return null;
  try {
    const raw = store.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as StoredAttribution;
  } catch {
    return null;
  }
}

/**
 * Mémorise l'attribution de la session (first-touch, write-once).
 * Sans effet si l'URL ne porte aucun paramètre ou si une attribution est déjà stockée.
 * Renvoie l'enregistrement écrit, ou `null` si rien n'a été écrit.
 */
export function captureAttribution(
  search: string = window.location.search,
  pathname: string = window.location.pathname,
): StoredAttribution | null {
  const store = storage();
  if (!store) return null;
  try {
    if (getStoredAttribution()) return null; // first-touch : on n'écrase jamais
    const params = parseAttributionParams(search);
    if (!params) return null;
    const record: StoredAttribution = {
      ...params,
      captured_at: new Date().toISOString(),
      landing_path: pathname,
    };
    store.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(record));
    return record;
  } catch {
    return null;
  }
}

/** Champs d'attribution à joindre au payload du formulaire — uniquement les clés présentes. */
export function attributionPayload(): AttributionParams {
  const stored = getStoredAttribution();
  const out: AttributionParams = {};
  if (!stored) return out;
  for (const key of ATTRIBUTION_KEYS) {
    const value = stored[key];
    if (typeof value !== "string") continue;
    const clean = value.trim().slice(0, MAX_VALUE_LENGTH);
    if (clean) out[key] = clean;
  }
  return out;
}

/** `?test=1` à l'atterrissage → toute la session est une session de TEST (équipe). */
export function captureTestFlag(search: string = window.location.search): void {
  const store = storage();
  if (!store) return;
  try {
    if (new URLSearchParams(search).get("test") === "1") {
      store.setItem(TEST_SESSION_STORAGE_KEY, "1");
    }
  } catch {
    /* noop */
  }
}

export function isTestSession(): boolean {
  const store = storage();
  if (!store) return false;
  try {
    return store.getItem(TEST_SESSION_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}
