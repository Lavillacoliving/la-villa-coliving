// Offres commerciales datées du site. SOURCE UNIQUE des dates, des libellés et de la mesure des offres : page /offre-hiver
// (mêmes adresses pour toutes les offres, D1 du 21/11/2026), bandeau, ligne du formulaire, filtre des chambres. Aucun
// import : ce module est aussi chargé tel quel sous Node par tools/test/offer.test.mjs, qui vérifie que le script inline
// #lvc-offer d'index.html (fenêtres des offres, pages du bandeau, clés localStorage) lui reste identique.
//
// 1. Offre A « Pose tes valises avant l'hiver » — brief Jérôme du 06/10/2026, rebrief du 12/10/2026 (−50 % sur le
//    premier mois, bail signé du 15/10 au 25/11 inclus, bail démarrant à la libération). (02/11/2026, brief « caution
//    permanente ») La caution en 1, 2 ou 3 fois est une règle permanente, plus un avantage de l'offre : src/data/entityFacts.ts.
//    Ses exports gardent leurs noms d'origine (OFFER_*, sans préfixe) : la page d'hiver reste identique jusqu'au 25/11 à 23 h 59.
// 2. (21/11/2026, brief « Ta première année avec nous », décisions D1 à D15 de Jérôme) Offre « Ta première année avec nous » :
//    jusqu'à 1 400 € remboursés — 200 € déduits du premier loyer complet, puis 300, 400 et 500 € par virement, liés aux 4ᵉ,
//    7ᵉ et 13ᵉ loyers complets ; tout bail signé du 26/11 au 31/12/2026 inclus, dans les trois maisons. Exports FIRST_YEAR_*.
// Bascule AUTOMATIQUE à 0 h, heure de Paris (D8) : la fin exclusive de l'hiver est le début de la nouvelle offre (aucun trou,
// testé). offerAt() = l'offre en cours (bandeau, ligne du formulaire, mesure) ; offerPageState() = l'état de la page.
// D2 : un lien `?offre=hiver` reste accepté et compte pour l'offre en cours (normalizeOffer).
//
// Règles (brief §0 de l'hiver, reprises au brief du 21/11) : une remise ou un remboursement est un GESTE COMMERCIAL — jamais
// « loyer réduit », « loyer à … », ni prix mensuel barré ou remplacé ; le loyer contractuel reste affiché tel quel partout.
// Tutoiement FR, parité FR/EN.

/** Valeur du paramètre d'URL `?offre=` et du champ `offer` envoyé à l'edge (v20) — offre d'hiver. */
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

/** Fermeture du bandeau : localStorage, horodatage ms, 7 jours. Clé de l'offre d'hiver (chaque offre a la sienne). */
export const OFFER_BANNER_DISMISS_KEY = "lvc_offer_hiver_closed";
export const OFFER_BANNER_DISMISS_MS = 7 * 24 * 60 * 60 * 1000;

/** Sessionstorage : l'offre vue (?offre=hiver ou visite de /offre-hiver) suit le candidat jusqu'au formulaire. */
export const OFFER_SESSION_KEY = "lvc_offer";

/** Remise sur le premier mois (loyer + forfait de charges, geste commercial), en pourcentage. */
export const OFFER_DISCOUNT_PERCENT = 50;

/** `true` tant que l'offre d'hiver n'est pas terminée (jusqu'au 25/11 inclus, heure de Paris). Pur. */
export function isOfferActive(nowMs: number = Date.now()): boolean {
  return nowMs < OFFER_END_EXCLUSIVE_MS;
}

/** `true` à partir du 15/10 à 0 h (heure de Paris), début de l'offre d'hiver. Pur. */
export function isOfferStarted(nowMs: number = Date.now()): boolean {
  return nowMs >= OFFER_START_MS;
}

// ── Offre « Ta première année avec nous » (brief Jérôme du 21/11/2026) ─────────────────────────────
/** Valeur du paramètre d'URL `?offre=` et du champ `offer` envoyé à l'edge pour la nouvelle offre (D2). */
export const FIRST_YEAR_OFFER_ID = "premiere-annee";
export const FIRST_YEAR_QUERY = `${OFFER_QUERY_KEY}=${FIRST_YEAR_OFFER_ID}`;
// Critère (brief §1) : la DATE DE SIGNATURE du bail, du 26/11 au 31/12/2026 inclus, quelle que soit la date d'entrée.
export const FIRST_YEAR_START = "2026-11-26";
export const FIRST_YEAR_END = "2026-12-31";
/** Premier instant de l'offre (26/11 à 0 h, heure de Paris = UTC+1) = premier instant APRÈS l'offre d'hiver (test). */
export const FIRST_YEAR_START_MS = Date.parse("2026-11-26T00:00:00+01:00");
/** Premier instant APRÈS l'offre (le 31/12 inclus, heure de Paris = UTC+1). */
export const FIRST_YEAR_END_EXCLUSIVE_MS = Date.parse("2027-01-01T00:00:00+01:00");
/** Fermeture du bandeau : clé propre à l'offre — qui a fermé le bandeau d'hiver voit celui-ci (brief §3.3). */
export const FIRST_YEAR_BANNER_DISMISS_KEY = "lvc_offer_premiere_annee_closed";

/**
 * Paliers (brief §1, D5 : un palier est lié à l'échéance du n-ième loyer COMPLET). `rent` = rang du loyer complet,
 * `eur` = montant, `afterMonths` = ce que dit la page (« à 3 mois »). Le premier est déduit du premier loyer complet
 * (mécanisme de remise existant) ; les trois suivants sont remboursés par virement (D10), le loyer payé ne change jamais.
 */
export const FIRST_YEAR_TIERS = [
  { rent: 1, eur: 200, afterMonths: 0, payment: "deduction" },
  { rent: 4, eur: 300, afterMonths: 3, payment: "transfer" },
  { rent: 7, eur: 400, afterMonths: 6, payment: "transfer" },
  { rent: 13, eur: 500, afterMonths: 12, payment: "transfer" },
] as const;
/** « Jusqu'à 1 400 € » : la SOMME des paliers, jamais saisie à part. */
export const FIRST_YEAR_TOTAL_EUR: number = FIRST_YEAR_TIERS.reduce((sum, t) => sum + t.eur, 0);

/**
 * Équivalent indicatif en CHF du total (D4 et décision n° 2 : sur le site seulement, dans une phrase À PART — jamais € et
 * CHF dans la même phrase) : total × taux figé (TAUX_BCE.eurChf, src/data/stats.ts, passé par l'appelant : ce module
 * n'importe rien), arrondi à la centaine inférieure. 1 400 € × 0,9366 = 1 311 → 1 300 CHF. Pur.
 */
export function firstYearTotalChf(eurChf: number): number {
  return Math.floor((FIRST_YEAR_TOTAL_EUR * eurChf) / 100) * 100;
}

// ── Les offres, dans l'ordre du calendrier ────────────────────────────────────────────────────────
export type OfferId = typeof OFFER_ID | typeof FIRST_YEAR_OFFER_ID;
/** Valeurs acceptées du paramètre `?offre=` (D2 : l'ancienne reste acceptée). Recopiées dans src/lib/attribution.ts (sans import), test. */
export const KNOWN_OFFER_IDS: readonly OfferId[] = [OFFER_ID, FIRST_YEAR_OFFER_ID];

/** Fenêtre d'une offre : [début, fin[ en ms, heure de Paris ; clé de fermeture de son bandeau. Recopiée par #lvc-offer (index.html). */
export interface OfferWindow {
  readonly id: OfferId;
  readonly startMs: number;
  readonly endExclusiveMs: number;
  readonly dismissKey: string;
}
export const OFFER_WINDOWS: readonly OfferWindow[] = [
  { id: OFFER_ID, startMs: OFFER_START_MS, endExclusiveMs: OFFER_END_EXCLUSIVE_MS, dismissKey: OFFER_BANNER_DISMISS_KEY },
  { id: FIRST_YEAR_OFFER_ID, startMs: FIRST_YEAR_START_MS, endExclusiveMs: FIRST_YEAR_END_EXCLUSIVE_MS, dismissKey: FIRST_YEAR_BANNER_DISMISS_KEY },
];

/** Offre EN COURS à l'instant `nowMs` (sa fenêtre la contient), sinon null — avant le 15/10/2026 et à partir du 01/01/2027. Pur. */
export function offerAt(nowMs: number = Date.now()): OfferWindow | null {
  return OFFER_WINDOWS.find((w) => nowMs >= w.startMs && nowMs < w.endExclusiveMs) ?? null;
}

/** États de la page de l'offre, marqués `data-offer-state` sur <main> (lus par main.tsx avant l'hydratation). */
export type OfferPageState = "active" | typeof FIRST_YEAR_OFFER_ID | "ended";
/**
 * État de /offre-hiver · /en/winter-offer (D1 : mêmes adresses pour les deux offres) : « active » = l'offre d'hiver (aussi
 * AVANT le 15/10, pour la relecture des annonces) ; « premiere-annee » dès la fin de l'hiver (26/11 à 0 h) et jusqu'au
 * 31/12 inclus ; « ended » ensuite. Pur.
 */
export function offerPageState(nowMs: number = Date.now()): OfferPageState {
  if (nowMs < OFFER_END_EXCLUSIVE_MS) return "active";
  if (nowMs < FIRST_YEAR_END_EXCLUSIVE_MS) return FIRST_YEAR_OFFER_ID;
  return "ended";
}
/** Valeur lue sur le HTML prérendu (`data-offer-state`, capturée par main.tsx) → état connu, sinon null. Pur. */
export function parseOfferPageState(raw: string | null | undefined): OfferPageState | null {
  return raw === "active" || raw === FIRST_YEAR_OFFER_ID || raw === "ended" ? raw : null;
}

/**
 * Identifiant de l'offre EN COURS si `raw` est une offre connue (« hiver » ou « premiere-annee », casse et espaces
 * ignorés), sinon "" — une valeur inconnue est ignorée en silence. D2 : à partir du 26/11 à 0 h, un lien `?offre=hiver`
 * compte pour « Ta première année » ; à partir du 01/01/2027, plus aucune offre (""). Pur.
 */
export function normalizeOffer(raw: string | null | undefined, nowMs: number = Date.now()): OfferId | "" {
  const v = String(raw ?? "").trim().toLowerCase();
  if (!(KNOWN_OFFER_IDS as readonly string[]).includes(v)) return "";
  return offerAt(nowMs)?.id ?? "";
}

/** Chemin FR du bandeau, sans préfixe /en ni slash final (« /en » → « / »). */
export function isOfferBannerPath(pathname: string): boolean {
  const p = (pathname.replace(/^\/en(?=\/|$)/, "") || "/").replace(/\/+$/, "") || "/";
  return (OFFER_BANNER_PATHS as readonly string[]).includes(p);
}

/**
 * Chambre concernée par l'offre (rebrief D5) : libre maintenant, OU avec une date de libération connue,
 * quelle qu'elle soit (la ch. 4 du Loft, libre le 16/12, en fait partie). Le bail démarre à la libération. Pur.
 * (21/11/2026, D9) Même filtre pour « Ta première année avec nous ».
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

/** Premier mois après la remise (arrondi au franc / à l'euro) : 1 290 → 645, 1 370 → 685, 1 430 → 715 ; en euros 1 380 → 690, 1 470 → 735, 1 530 → 765. */
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
/** `sticky` = barre fixe mobile de /offre-hiver (option D du brief du 19/10/2026). */
export type OfferPlacement = "landing" | "banner" | "rooms" | "sticky";

/** Valeur `offer` des événements GA4 : l'offre EN COURS au moment de l'événement (brief du 21/11/2026), « none » hors offre. */
function currentOfferParam(): string {
  return offerAt()?.id ?? "none";
}

/** `offer_cta_click` — paramètres `offer` (offre en cours) + `placement` (+ contexte libre). Jamais bloquant. */
export function trackOfferCta(placement: OfferPlacement, extra: Record<string, string | number> = {}): void {
  try {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "offer_cta_click", {
      offer: currentOfferParam(),
      placement,
      ...extra,
    });
  } catch {
    /* l'analytics ne bloque jamais l'UI */
  }
}

/** Sections de /offre-hiver mesurées à l'affichage (brief « page de l'offre » du 19/10/2026, §2.C). */
export type OfferSection = "rooms" | "concretely" | "faq";

/**
 * `offer_section_view` — paramètres `offer` (offre en cours) + `section` (+ contexte libre : `language`). Une fois par section
 * et par page vue, quand la section est vue à moitié (OfferHiverPage). Sert à savoir si les visiteurs atteignent la grille des
 * chambres. Même mécanique que trackOfferCta : jamais bloquant.
 */
export function trackOfferSectionView(section: OfferSection, extra: Record<string, string | number> = {}): void {
  try {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "offer_section_view", {
      offer: currentOfferParam(),
      section,
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

/**
 * (« Ta première année », décision n° 4 proposée) Ligne de démarrage des cartes : la date de libération si elle est à venir
 * (« Bail au 16 décembre », comme l'hiver) ; sinon « Libre maintenant » — plus de « 7 jours suivant la signature » : c'est la
 * date de signature qui compte, quelle que soit la date d'entrée (brief §1). Pur.
 */
export function firstYearLeaseStartLabel(start: ReturnType<typeof leaseStartOf>, lang: "fr" | "en"): string {
  if (start.kind === "date") return leaseStartLabel(start, lang);
  return lang === "en" ? "Available now" : "Libre maintenant";
}

/** « 1 400 € » (espaces insécables : le montant ne se coupe jamais en fin de ligne) / « €1,400 ». Pur. */
export function formatOfferEur(n: number, lang: "fr" | "en"): string {
  const digits = String(n);
  return lang === "en" ? `€${digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` : `${digits.replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0")}\u00a0€`;
}
/** « 1 300 CHF » / « CHF 1,300 » (insécables). Pur. */
export function formatOfferChf(n: number, lang: "fr" | "en"): string {
  const digits = String(n);
  return lang === "en" ? `CHF\u00a0${digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` : `${digits.replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0")}\u00a0CHF`;
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
  },
  en: {
    name: "Settle in before winter",
    banner: `Half price on your first month if you sign by ${END_EN} →`,
    bannerClose: "Close this message",
    formLine: `Settle-in offer: ${OFFER_DISCOUNT_PERCENT}% off your first month for any lease signed by ${END_EN}.`,
  },
} as const;

// « Ta première année avec nous » — brief du 21/11/2026 §5 (textes validés par Jérôme), verbatim ; montants et dates calculés.
const FIRST_YEAR_END_FR = formatOfferDate(FIRST_YEAR_END, "fr");
const FIRST_YEAR_END_EN = formatOfferDate(FIRST_YEAR_END, "en");
const FIRST_YEAR_TOTAL_FR = formatOfferEur(FIRST_YEAR_TOTAL_EUR, "fr");
const FIRST_YEAR_TOTAL_EN = formatOfferEur(FIRST_YEAR_TOTAL_EUR, "en");
export const FIRST_YEAR_TEXTS = {
  fr: {
    name: "Ta première année avec nous",
    banner: `Ta première année avec nous : jusqu'à ${FIRST_YEAR_TOTAL_FR} remboursés →`,
    bannerClose: "Fermer ce message",
    formLine: `Offre Ta première année : jusqu'à ${FIRST_YEAR_TOTAL_FR} remboursés pour tout bail signé d'ici le ${FIRST_YEAR_END_FR}.`,
  },
  en: {
    name: "Your first year with us",
    banner: `Your first year with us: up to ${FIRST_YEAR_TOTAL_EN} back →`,
    bannerClose: "Close this message",
    formLine: `First-year offer: up to ${FIRST_YEAR_TOTAL_EN} back for any lease signed by ${FIRST_YEAR_END_EN}.`,
  },
} as const;

export interface OfferTexts {
  readonly name: string;
  readonly banner: string;
  readonly bannerClose: string;
  readonly formLine: string;
}
/** Textes du bandeau et de la ligne du formulaire, par offre (offerAt / normalizeOffer → identifiant → textes). */
export const OFFER_TEXTS_BY_ID: Readonly<Record<OfferId, { readonly fr: OfferTexts; readonly en: OfferTexts }>> = {
  [OFFER_ID]: OFFER_TEXTS,
  [FIRST_YEAR_OFFER_ID]: FIRST_YEAR_TEXTS,
};
