// Offre A « Pose tes valises avant l'hiver » — brief Jérôme du 06/10/2026 (mise en ligne 07/10).
// SOURCE UNIQUE des dates, des libellés et de la mesure de l'offre : page /offre-hiver, bandeau,
// ligne du formulaire, filtre des chambres. Aucun import : ce module est aussi chargé tel quel
// sous Node par tools/test/offer.test.mjs, qui vérifie que le script inline #lvc-offer
// d'index.html (dates, pages du bandeau, clé localStorage) lui reste identique.
//
// Règles du brief (§0) : la remise est un GESTE COMMERCIAL appliqué sur le premier loyer — jamais
// « loyer réduit », « loyer à … », ni prix mensuel barré ou remplacé ; le loyer contractuel reste
// affiché tel quel partout. Tutoiement FR, parité FR/EN.

/** Valeur du paramètre d'URL `?offre=` et du champ `offer` envoyé à l'edge (v20). */
export const OFFER_ID = "hiver";
/** Paramètre d'URL lu par le formulaire (FR volontairement : c'est ce que portent les liens). */
export const OFFER_QUERY_KEY = "offre";
export const OFFER_QUERY = `${OFFER_QUERY_KEY}=${OFFER_ID}`;

// Dates en configuration, jamais en dur dans les textes (brief §2). Calendrier de Paris.
export const OFFER_START = "2026-10-07";
export const OFFER_END = "2026-11-15";
export const MOVE_IN_DEADLINE = "2026-11-30";
/** Premier instant APRÈS l'offre (le 15/11 inclus, heure de Paris = UTC+1 en novembre). */
export const OFFER_END_EXCLUSIVE_MS = Date.parse("2026-11-16T00:00:00+01:00");

/** Chemins FR de /offre-hiver et de son miroir EN (slug différent : voir src/lib/localizedPath.ts). */
export const OFFER_PATH_FR = "/offre-hiver";
export const OFFER_PATH_EN = "/en/winter-offer";

/** Bandeau : pages FR qui le portent (miroirs /en/… inclus) — brief §3. Ni /candidature, ni blog, ni légal. */
export const OFFER_BANNER_PATHS = [
  "/",
  "/chambres-disponibles",
  "/lavilla",
  "/leloft",
  "/lelodge",
  "/tarifs",
  "/colocation-geneve",
  "/chambre-a-louer-geneve",
  "/annemasse-colocation",
] as const;

/** Fermeture du bandeau : localStorage, horodatage ms, 7 jours. */
export const OFFER_BANNER_DISMISS_KEY = "lvc_offer_hiver_closed";
export const OFFER_BANNER_DISMISS_MS = 7 * 24 * 60 * 60 * 1000;

/** Sessionstorage : l'offre vue (?offre=hiver ou visite de /offre-hiver) suit le candidat jusqu'au formulaire. */
export const OFFER_SESSION_KEY = "lvc_offer";

/** Remise sur le premier loyer (geste commercial), en pourcentage. */
export const OFFER_DISCOUNT_PERCENT = 30;

/** `true` tant que l'offre est ouverte (jusqu'au 15/11 inclus, heure de Paris). Pur. */
export function isOfferActive(nowMs: number = Date.now()): boolean {
  return nowMs < OFFER_END_EXCLUSIVE_MS;
}

/** « hiver » si la valeur est une offre connue, sinon "" — une valeur inconnue est ignorée en silence. */
export function normalizeOffer(raw: string | null | undefined): string {
  const v = String(raw ?? "").trim().toLowerCase();
  return v === OFFER_ID ? OFFER_ID : "";
}

/** Chemin FR du bandeau, sans préfixe /en ni slash final (« /en » → « / »). */
export function isOfferBannerPath(pathname: string): boolean {
  const p = (pathname.replace(/^\/en(?=\/|$)/, "") || "/").replace(/\/+$/, "") || "/";
  return (OFFER_BANNER_PATHS as readonly string[]).includes(p);
}

/** Chambre concernée par l'offre : libre maintenant, ou libérée au plus tard le 30/11. Pur. */
export function isOfferRoom(room: { availability: string; available_from: string | null }): boolean {
  if (room.availability === "available") return true;
  return !!room.available_from && room.available_from <= MOVE_IN_DEADLINE;
}

/** Premier mois après la remise (arrondi au franc / à l'euro) : 1 370 → 959, 1 430 → 1 001. */
export function discountedFirstMonth(amount: number): number {
  return Math.round(amount * (100 - OFFER_DISCOUNT_PERCENT) / 100);
}

/** « 15 novembre » / « 15 November » — formatage maison (jamais toLocaleDateString : ICU ≠ entre prérendu et client). */
const MONTHS_FR = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export function formatOfferDate(iso: string, lang: "fr" | "en"): string {
  const [, m, d] = iso.split("-");
  const day = Number(d);
  const month = Number(m) - 1;
  if (lang === "en") return `${day} ${MONTHS_EN[month]}`;
  return `${day === 1 ? "1ᵉʳ" : day} ${MONTHS_FR[month]}`;
}

// ── Télémétrie GA4 (brief §1) ─────────────────────────────────────────────────────────────────
export type OfferPlacement = "landing" | "banner" | "rooms";

/** `offer_cta_click` — paramètres `offer` + `placement` (+ contexte libre). Jamais bloquant. */
export function trackOfferCta(placement: OfferPlacement, extra: Record<string, string | number> = {}): void {
  try {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "offer_cta_click", {
      offer: OFFER_ID,
      placement,
      ...extra,
    });
  } catch {
    /* l'analytics ne bloque jamais l'UI */
  }
}

// ── Textes partagés (bandeau, ligne du formulaire) — brief §1 et §3, verbatim ──────────────────
export const OFFER_TEXTS = {
  fr: {
    name: "Pose tes valises avant l'hiver",
    banner: "Emménage avant le 1ᵉʳ décembre : ton premier mois à −30 % →",
    bannerClose: "Fermer ce message",
    formLine: "Offre Pose tes valises : −30 % sur ton premier mois si tu emménages avant le 1ᵉʳ décembre.",
  },
  en: {
    name: "Settle in before winter",
    banner: "Move in by 1 December: 30% off your first month →",
    bannerClose: "Close this message",
    formLine: "Settle-in offer: 30% off your first month if you move in by 1 December.",
  },
} as const;
