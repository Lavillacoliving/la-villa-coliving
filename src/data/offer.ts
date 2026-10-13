// Offre A « Pose tes valises avant l'hiver » — brief Jérôme du 06/10/2026, rebrief du 12/10/2026 (−50 % sur le
// premier mois, caution en 2 ou 3 fois, bail signé du 15/10 au 25/11 inclus, bail démarrant à la libération).
// SOURCE UNIQUE des dates, des libellés et de la mesure de l'offre : page /offre-hiver, bandeau,
// ligne du formulaire, filtre des chambres. Aucun import : ce module est aussi chargé tel quel
// sous Node par tools/test/offer.test.mjs, qui vérifie que le script inline #lvc-offer
// d'index.html (dates, pages du bandeau, clé localStorage) lui reste identique.
//
// Règles du brief (§0, inchangées au rebrief) : la remise est un GESTE COMMERCIAL appliqué sur le premier mois — jamais
// « loyer réduit », « loyer à … », ni prix mensuel barré ou remplacé ; le loyer contractuel reste
// affiché tel quel partout. Tutoiement FR, parité FR/EN.

/** Valeur du paramètre d'URL `?offre=` et du champ `offer` envoyé à l'edge (v20). */
export const OFFER_ID = "hiver";
/** Paramètre d'URL lu par le formulaire (FR volontairement : c'est ce que portent les liens). */
export const OFFER_QUERY_KEY = "offre";
export const OFFER_QUERY = `${OFFER_QUERY_KEY}=${OFFER_ID}`;

// Dates en configuration, jamais en dur dans les textes (brief §2). Calendrier de Paris.
// Critère de l'offre (rebrief D3) : la DATE DE SIGNATURE du bail, du 15/10 au 25/11/2026 inclus.
export const OFFER_START = "2026-10-15";
export const OFFER_END = "2026-11-25";
/** Premier instant de l'offre (15/10 à 0 h, heure de Paris = UTC+2 en octobre) : le bandeau n'apparaît pas avant. */
export const OFFER_START_MS = Date.parse("2026-10-15T00:00:00+02:00");
/** Premier instant APRÈS l'offre (le 25/11 inclus, heure de Paris = UTC+1 en novembre). */
export const OFFER_END_EXCLUSIVE_MS = Date.parse("2026-11-26T00:00:00+01:00");
/** Chambre déjà libre : le bail démarre dans les N jours suivant la signature (rebrief D4). */
export const ALREADY_FREE_START_DAYS = 7;

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

/** Remise sur le premier mois (loyer + forfait de charges, geste commercial), en pourcentage. */
export const OFFER_DISCOUNT_PERCENT = 50;

/** `true` tant que l'offre n'est pas terminée (jusqu'au 25/11 inclus, heure de Paris). Pilote la page. Pur. */
export function isOfferActive(nowMs: number = Date.now()): boolean {
  return nowMs < OFFER_END_EXCLUSIVE_MS;
}

/** `true` à partir du 15/10 à 0 h (heure de Paris). Le bandeau attend ce moment ; la page, non (relecture des annonces). Pur. */
export function isOfferStarted(nowMs: number = Date.now()): boolean {
  return nowMs >= OFFER_START_MS;
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

/**
 * Chambre concernée par l'offre (rebrief D5) : libre maintenant, OU avec une date de libération connue,
 * quelle qu'elle soit (la ch. 4 du Loft, libre le 16/12, en fait partie). Le bail démarre à la libération. Pur.
 */
export function isOfferRoom(room: { availability: string; available_from: string | null }): boolean {
  return room.availability === "available" || !!room.available_from;
}

/** « AAAA-MM-JJ » du jour à Paris (indépendant du fuseau du lecteur et du prérendu, qui tourne en UTC). Pur. */
export function parisDateIso(nowMs: number = Date.now()): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" })
    .formatToParts(new Date(nowMs));
  const get = (type: string) => parts.find((x) => x.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/**
 * Démarrage du bail d'une chambre de l'offre (rebrief D4) : à sa date de libération si elle est à venir ;
 * « dans les 7 jours suivant la signature » si la chambre est libre, ou si sa date est passée ou du jour
 * (état pas encore mis à jour — décision Jérôme du 12/10). `todayIso` = jour de Paris (parisDateIso). Pur.
 */
export function leaseStartOf(
  room: { availability: string; available_from: string | null },
  todayIso: string,
): { kind: "date"; iso: string } | { kind: "within" } {
  if (room.availability !== "available" && room.available_from && room.available_from > todayIso) {
    return { kind: "date", iso: room.available_from };
  }
  return { kind: "within" };
}

/** Premier mois après la remise (arrondi au franc / à l'euro) : 1 370 → 685, 1 430 → 715 ; 1 470 → 735, 1 530 → 765. */
export function discountedFirstMonth(amount: number): number {
  return Math.round(amount * (100 - OFFER_DISCOUNT_PERCENT) / 100);
}

/**
 * « 25 novembre » / « 25 November », jour et mois liés par une espace insécable (U+00A0 : la date ne se coupe
 * jamais en fin de ligne à 390 px) — formatage maison (jamais toLocaleDateString : ICU ≠ entre prérendu et client).
 */
const MONTHS_FR = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export function formatOfferDate(iso: string, lang: "fr" | "en"): string {
  const [, m, d] = iso.split("-");
  const day = Number(d);
  const month = Number(m) - 1;
  if (lang === "en") return `${day}\u00a0${MONTHS_EN[month]}`;
  return `${day === 1 ? "1ᵉʳ" : day}\u00a0${MONTHS_FR[month]}`;
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

/** « Bail au 16 décembre » / « Lease within 7 days of signing » — ligne de démarrage des cartes de /offre-hiver. Pur. */
export function leaseStartLabel(start: ReturnType<typeof leaseStartOf>, lang: "fr" | "en"): string {
  if (start.kind === "date") return lang === "en" ? `Lease from ${formatOfferDate(start.iso, "en")}` : `Bail au ${formatOfferDate(start.iso, "fr")}`;
  return lang === "en"
    ? `Lease within ${ALREADY_FREE_START_DAYS} days of signing`
    : `Bail dans les ${ALREADY_FREE_START_DAYS} jours suivant la signature`;
}

// ── Textes partagés (bandeau, ligne du formulaire) — rebrief du 12/10 §2.1, verbatim ────────────
const END_FR = formatOfferDate(OFFER_END, "fr");
const END_EN = formatOfferDate(OFFER_END, "en");
export const OFFER_TEXTS = {
  fr: {
    name: "Pose tes valises avant l'hiver",
    banner: `Ton 1er mois à moitié prix si tu signes d'ici le ${END_FR} →`,
    bannerClose: "Fermer ce message",
    formLine: `Offre Pose tes valises : −${OFFER_DISCOUNT_PERCENT}\u00a0% sur ton premier mois pour tout bail signé d'ici le ${END_FR}.`,
    /** (13/10/2026, brief « conversion Ads » §2.2, D3) Suite de la ligne de caution de /chambres-disponibles, pendant l'offre
     *  seulement (isOfferStarted() && isOfferActive()) : « Caution de 2 mois de loyer hors charges, » + depositNote. */
    depositNote: `en 2 ou 3 fois pour tout bail signé d'ici le ${END_FR}`,
  },
  en: {
    name: "Settle in before winter",
    banner: `Half price on your first month if you sign by ${END_EN} →`,
    bannerClose: "Close this message",
    formLine: `Settle-in offer: ${OFFER_DISCOUNT_PERCENT}% off your first month for any lease signed by ${END_EN}.`,
    depositNote: `in 2 or 3 instalments for any lease signed by ${END_EN}`,
  },
} as const;
