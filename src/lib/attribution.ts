// Attribution technique de session — Google Ads (brief UTM/GCLID du 22/08/2026)
// + page d'atterrissage et « UTM virtuels » des portes internes (Lot 1 du brief
//   SEO funnel, plan validé par Jérôme le 03/09/2026).
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
// ── Lot 1 (03/09/2026) — deux ajouts, même philosophie ─────────────────────────
// 1. `lvc_landing` : page d'atterrissage + referrer de la session, écrits UNE fois au
//    premier chargement, toujours (même sans utm). Envoyés à l'Edge v17 comme
//    `landing_page` / `referrer` (+ `entry_page` = page de soumission), colonnes
//    dédiées de form_submissions. Referrer = origine + chemin, sans query (Q5).
// 2. « UTM virtuels » : les portes INTERNES (bloc offre, CTA dans le corps des articles,
//    section « bail classique », cartes chambres…) ne portent JAMAIS d'utm_* dans leurs
//    URL — GA4 redémarrerait l'attribution de la session et « site / bloc_offre »
//    remplacerait « google / organic » dans tous les rapports. Elles portent
//    `?src=<source>&article=<slug>&pos=<mid|end|body>` (ou déclenchent markInternalRef()
//    au clic), et c'est ICI qu'on traduit en utm_source=site / utm_medium=<source> /
//    utm_campaign=<slug> / utm_content=<pos> — écrits dans `lvc_attribution` SEULEMENT
//    s'il n'y a pas déjà une première touche (externe ou interne). Résultat : la base
//    porte utm_medium = bloc_offre pour les candidatures nées d'un article, GA4 reste
//    propre, et une touche Ads (cpc) n'est jamais écrasée par un clic interne.
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

// ── Page d'atterrissage de la session (Lot 1, 03/09/2026) ────────────────────

export const LANDING_STORAGE_KEY = "lvc_landing";
const MAX_PATH_LENGTH = 512;

export interface StoredLanding {
  /** Premier `pathname` de la session (sans query). */
  landing_page: string;
  /** `document.referrer` du premier chargement : origine + chemin, sans query ni fragment ; "" si absent. */
  referrer: string;
  /** Instant de la capture (ISO 8601). */
  captured_at: string;
}

/**
 * Referrer réduit à origine + chemin (Q5 du plan : ni query string — un gclid ou un
 * identifiant tiers n'a rien à faire en base — ni fragment). Vide si absent ou illisible.
 * Pur, testable.
 */
export function normalizeReferrer(raw: string): string {
  if (!raw) return "";
  try {
    const url = new URL(raw);
    return `${url.origin}${url.pathname}`.slice(0, MAX_PATH_LENGTH);
  } catch {
    return "";
  }
}

/** Page d'atterrissage mémorisée pour la session, ou `null`. */
export function getStoredLanding(): StoredLanding | null {
  const store = storage();
  if (!store) return null;
  try {
    const raw = store.getItem(LANDING_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const rec = parsed as Partial<StoredLanding>;
    if (typeof rec.landing_page !== "string") return null;
    return {
      landing_page: rec.landing_page,
      referrer: typeof rec.referrer === "string" ? rec.referrer : "",
      captured_at: typeof rec.captured_at === "string" ? rec.captured_at : "",
    };
  } catch {
    return null;
  }
}

/**
 * Mémorise la page d'atterrissage de la session (write-once, TOUJOURS — même sans utm).
 * Appelée dans main.tsx avant l'hydratation. Renvoie l'enregistrement écrit, ou `null`.
 */
export function captureLanding(
  pathname: string = window.location.pathname,
  referrer: string = typeof document !== "undefined" ? document.referrer : "",
): StoredLanding | null {
  const store = storage();
  if (!store) return null;
  try {
    if (getStoredLanding()) return null; // première page de la session, jamais écrasée
    const record: StoredLanding = {
      landing_page: (pathname || "/").slice(0, MAX_PATH_LENGTH),
      referrer: normalizeReferrer(referrer),
      captured_at: new Date().toISOString(),
    };
    store.setItem(LANDING_STORAGE_KEY, JSON.stringify(record));
    return record;
  } catch {
    return null;
  }
}

/** `landing_page` / `referrer` à joindre au payload du formulaire — clés présentes seulement. */
export function landingPayload(): { landing_page?: string; referrer?: string } {
  const stored = getStoredLanding();
  const out: { landing_page?: string; referrer?: string } = {};
  if (!stored) return out;
  if (stored.landing_page) out.landing_page = stored.landing_page.slice(0, MAX_PATH_LENGTH);
  if (stored.referrer) out.referrer = stored.referrer.slice(0, MAX_PATH_LENGTH);
  return out;
}

// ── Portes internes → « UTM virtuels » (Lot 1, 03/09/2026) ───────────────────

/**
 * Sources internes autorisées (= futures valeurs de `utm_medium`). Liste blanche :
 * une valeur inconnue dans l'URL est ignorée, jamais écrite en base.
 *   bloc_offre     — BlocOffre (mi-article / fin d'article), plan blog-conversion 07/07
 *   article_cta    — lien /candidature ou page maison écrit dans le corps d'un article
 *   bail_classique — section « Et si tu ne voulais pas gérer un bail classique ? »
 *   room_card      — carte chambre (pages maisons, /chambres-disponibles — Lot 3)
 *   dispo_line     — ligne « N chambres dès le… → voir » (Lot 3)
 *   house_cta      — CTA d'une page maison
 */
export const INTERNAL_REF_SOURCES = [
  "bloc_offre",
  "article_cta",
  "bail_classique",
  "room_card",
  "dispo_line",
  "house_cta",
] as const;
export type InternalRefSource = (typeof INTERNAL_REF_SOURCES)[number];

export interface InternalRef {
  src: InternalRefSource;
  /** Slug de l'article (ou de la page) hôte — devient `utm_campaign`. */
  article: string | null;
  /** Position du lien dans la page hôte — devient `utm_content`. */
  pos: string | null;
}

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,119}$/i;
const POS_RE = /^[a-z_]{1,24}$/i;

function isInternalRefSource(value: string): value is InternalRefSource {
  return (INTERNAL_REF_SOURCES as readonly string[]).includes(value);
}

/**
 * Lit `?src=<source>&article=<slug>&pos=<pos>` ; `null` si `src` est absent ou hors liste.
 * Compatible avec les liens déjà déployés (`?src=bloc_offre&article=…`, décision Q11a).
 * Pur, testable.
 */
export function parseInternalRef(search: string): InternalRef | null {
  const params = new URLSearchParams(search);
  const src = (params.get("src") ?? "").trim();
  if (!src || !isInternalRefSource(src)) return null;
  const article = (params.get("article") ?? "").trim();
  const pos = (params.get("pos") ?? "").trim();
  return {
    src,
    article: SLUG_RE.test(article) ? article : null,
    pos: POS_RE.test(pos) ? pos.toLowerCase() : null,
  };
}

/**
 * Écrit les « UTM virtuels » d'une porte interne — SEULEMENT si aucune attribution
 * n'est déjà stockée (première touche, externe ou interne, jamais écrasée : règle 1.3
 * du brief). Appelable au clic (navigation SPA : main.tsx ne se rejoue pas) ou depuis
 * l'URL (captureInternalRef). `utm_campaign` = slug hôte, à défaut la page
 * d'atterrissage de la session. Renvoie l'enregistrement écrit, ou `null`.
 */
export function markInternalRef(
  src: InternalRefSource,
  article: string | null | undefined,
  pos: string | null | undefined,
  pathname: string = typeof window !== "undefined" ? window.location.pathname : "/",
): StoredAttribution | null {
  const store = storage();
  if (!store) return null;
  try {
    if (getStoredAttribution()) return null;
    const campaign = article && SLUG_RE.test(article)
      ? article
      : (getStoredLanding()?.landing_page ?? null);
    const record: StoredAttribution = {
      utm_source: "site",
      utm_medium: src,
      ...(campaign ? { utm_campaign: campaign.slice(0, MAX_VALUE_LENGTH) } : {}),
      ...(pos && POS_RE.test(pos) ? { utm_content: pos.toLowerCase() } : {}),
      captured_at: new Date().toISOString(),
      landing_path: pathname,
    };
    store.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(record));
    return record;
  } catch {
    return null;
  }
}

/**
 * Variante « depuis l'URL » de markInternalRef : lit `?src=…` sur la page courante.
 * Appelée dans main.tsx (chargement complet) ET à chaque navigation SPA
 * (composant InternalRefCapture) — un lien ouvert dans un nouvel onglet ou une page
 * rechargée garde ainsi son origine.
 */
export function captureInternalRef(
  search: string = window.location.search,
  pathname: string = window.location.pathname,
): StoredAttribution | null {
  const ref = parseInternalRef(search);
  if (!ref) return null;
  return markInternalRef(ref.src, ref.article, ref.pos, pathname);
}

/**
 * Couche « observée » pour les notes du prospect (`Origine observée : …`) quand la
 * porte interne n'est plus sur l'URL de /candidature (navigation par une page maison,
 * par exemple) : on la retrouve dans les UTM virtuels stockés. Une touche externe
 * (utm_source ≠ site) ne renvoie rien — elle vit dans ses colonnes utm_*.
 */
export function internalRefPayload(): { ref_src?: string; ref_article?: string } {
  const stored = getStoredAttribution();
  if (!stored || stored.utm_source !== "site" || !stored.utm_medium) return {};
  const out: { ref_src?: string; ref_article?: string } = { ref_src: stored.utm_medium.slice(0, 50) };
  if (stored.utm_campaign && SLUG_RE.test(stored.utm_campaign)) out.ref_article = stored.utm_campaign.slice(0, 120);
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
