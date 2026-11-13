/**
 * Ligne « tout compris » des cartes chambres — source unique (décisions de Jérôme des 12 et 13/11/2026).
 *
 * Le prospect compare le prix d'une chambre à celui d'une colocation classique : la carte dit donc, à côté du prix,
 * ce que ce prix comprend. Trois surfaces lisent ce module :
 *   - `src/components/RoomCard.tsx` : la ligne (longue sur les cartes « featured » et « default », courte sur la carte
 *     « compact ») et le lien « Ce que comprend le prix » ;
 *   - `src/pages/RatesPageV4.tsx` : l'ancre visée par le lien ;
 *   - les pages qui affichent des cartes : l'événement GA4 du lien.
 *
 * Deux gammes, jamais fondues : les maisons de coliving (piscine, sauna, salle de sport) et L'Appart (colocation).
 * La gamme se déduit du `house_slug` de la chambre. Une carte de L'Appart ne reçoit jamais la ligne des maisons, et un
 * lieu inconnu ne reçoit rien : on préfère une carte sans ligne à une piscine annoncée à tort.
 *
 * Aucun import à l'exécution (les tests chargent le module tel quel), chaînes plates rendues en un seul nœud texte,
 * rien qui dépende d'une date ou de la base. Le texte ne dépend que de la gamme et de la langue : il est le même au
 * prérendu et dans le navigateur. Seule `trackPriceWhyClick` touche au navigateur (GA4).
 */
import type { HouseKey } from "../lib/availability";

export type InclusiveLang = "fr" | "en";
export type Gamme = "maisons" | "appart";
export type InclusiveLength = "long" | "short";
/** Variantes de `RoomCard`. */
export type InclusiveCardVariant = "default" | "featured" | "compact";

/** Nom public de L'Appart dans les données du site (`house_slug`). */
export const APPART_HOUSE_SLUG = "lappart";

// Un `HouseKey` ajouté sans gamme ne compile pas : aucun lieu connu du site ne reçoit une ligne par défaut.
const GAMME_BY_HOUSE_SLUG: Readonly<Record<HouseKey | typeof APPART_HOUSE_SLUG, Gamme>> = {
  lavilla: "maisons",
  leloft: "maisons",
  lelodge: "maisons",
  [APPART_HOUSE_SLUG]: "appart",
};

/** Gamme d'un lieu d'après son `house_slug` ; `null` pour un lieu inconnu. */
export function gammeOf(houseSlug: string | null | undefined): Gamme | null {
  if (typeof houseSlug !== "string") return null;
  return Object.prototype.hasOwnProperty.call(GAMME_BY_HOUSE_SLUG, houseSlug)
    ? GAMME_BY_HOUSE_SLUG[houseSlug as keyof typeof GAMME_BY_HOUSE_SLUG]
    : null;
}

/**
 * Textes validés par Jérôme. « ménage des communs » : le ménage compris est celui des espaces communs, pas celui des
 * chambres. Espaces insécables (U+00A0) : après « 0 » dans la version longue ; dans la version courte, la ligne ne se
 * coupe qu'après un « · » — jamais avant (une ligne ne commence pas par un point médian), jamais à l'intérieur d'un
 * élément (« salle de sport »), ni après le dernier « · » quand le dernier élément tient en un mot (« gym »,
 * « streaming » : il ne reste pas seul sur sa ligne).
 */
export const ALL_INCLUSIVE_LINE: Readonly<Record<Gamme, Readonly<Record<InclusiveLength, Readonly<Record<InclusiveLang, string>>>>>> = {
  maisons: {
    long: {
      fr: "Tout compris : charges, fibre, ménage des communs, piscine, sauna et salle de sport. 0\u00a0frais de dossier.",
      en: "All-inclusive: bills, fibre, cleaning of the shared areas, pool, sauna and gym. No application fee.",
    },
    short: {
      fr: "Tout\u00a0compris\u00a0· piscine\u00a0· sauna\u00a0· salle\u00a0de\u00a0sport",
      en: "All-inclusive\u00a0· pool\u00a0· sauna\u00a0·\u00a0gym",
    },
  },
  appart: {
    long: {
      fr: "Tout compris : charges, fibre, streaming et ménage des communs chaque semaine, accès aux cours de yoga et de sport des maisons. 0\u00a0frais de dossier.",
      en: "All-inclusive: bills, fibre, streaming and weekly cleaning of the shared areas, plus access to the houses' yoga and fitness classes. No application fee.",
    },
    short: {
      fr: "Tout\u00a0compris\u00a0· fibre\u00a0·\u00a0streaming",
      en: "All-inclusive\u00a0· fibre\u00a0·\u00a0streaming",
    },
  },
};

/** Ancre de la section de `/tarifs` qui détaille ce que le prix comprend. */
export const PRICE_INCLUDES_ANCHOR = "objection-prix";

/** Lien des cartes vers cette section. Chemin en version française : `LocalizedLink` ajoute `/en`. */
export const PRICE_INCLUDES_LINK: { readonly to: string; readonly label: Readonly<Record<InclusiveLang, string>> } = {
  to: `/tarifs#${PRICE_INCLUDES_ANCHOR}`,
  label: { fr: "Ce que comprend le prix", en: "What the price includes" },
};

export type CardInclusions = {
  gamme: Gamme;
  /** Ligne « tout compris » : longue, ou courte sur la carte « compact ». */
  line: string;
  /** Lien vers `/tarifs` : cartes des maisons seulement, jamais sur la carte « compact ». */
  link: { to: string; label: string } | null;
};

/**
 * Ce qu'une carte chambre affiche à côté du prix, ou `null` si elle ne doit rien afficher.
 * La gamme est celle de la chambre (`roomHouse`, la ligne lue en base). Si la carte est montée pour un lieu d'une
 * autre gamme (`house`), ou pour un lieu inconnu, elle n'affiche rien.
 */
export function cardInclusions(input: {
  house: string;
  roomHouse: string;
  variant: InclusiveCardVariant;
  lang: InclusiveLang;
}): CardInclusions | null {
  const gamme = gammeOf(input.roomHouse);
  if (gamme === null || gammeOf(input.house) !== gamme) return null;
  const length: InclusiveLength = input.variant === "compact" ? "short" : "long";
  const link =
    gamme === "maisons" && input.variant !== "compact"
      ? { to: PRICE_INCLUDES_LINK.to, label: PRICE_INCLUDES_LINK.label[input.lang] }
      : null;
  return { gamme, line: ALL_INCLUSIVE_LINE[gamme][length][input.lang], link };
}

// ── Mesure GA4 ───────────────────────────────────────────────────────────────────────────────

/** Événement envoyé au clic sur le lien « Ce que comprend le prix ». */
export const PRICE_WHY_EVENT = "price_why_click";

/** Variantes de carte qui portent le lien. */
export type PriceWhyVariant = Exclude<InclusiveCardVariant, "compact">;

/** Pages qui affichent des cartes avec le lien : un nom par page, le même en français et en anglais. */
export type PriceWhyPage =
  | "chambres_disponibles"
  | "colocation_geneve"
  | "chambre_a_louer_geneve"
  | "chambre_a_louer_annemasse"
  | "offre_hiver";

export type PriceWhyClick = {
  house: string;
  roomNumber: number;
  variant: PriceWhyVariant;
  page: PriceWhyPage;
  language: InclusiveLang;
};

/** Paramètres de l'événement, dans les conventions des événements voisins (`room_id` = « chambre-N »). Pur. */
export function priceWhyClickParams(click: PriceWhyClick): Record<string, string> {
  return {
    house: click.house,
    room_id: `chambre-${click.roomNumber}`,
    variant: click.variant,
    page: click.page,
    language: click.language,
  };
}

/** `price_why_click` — même garde que les autres événements du site : la mesure ne bloque jamais l'interface. */
export function trackPriceWhyClick(click: PriceWhyClick): void {
  try {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", PRICE_WHY_EVENT, priceWhyClickParams(click));
  } catch {
    /* noop */
  }
}
