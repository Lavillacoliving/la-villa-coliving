/**
 * Disponibilité des chambres — SOURCE UNIQUE, branchée sur la base.
 *
 * Remplace l'ancienne constante `AVAILABILITY` de src/data/stats.ts, tenue à la
 * main : ses valeurs du 15/06 (1/1/1) rendaient 2 badges maisons sur 3 faux en
 * prod le 18/08 (hero « 3 chambres disponibles » pour 1 seule libre). Règle
 * permanente : **aucun chiffre de dispo saisi à la main sur le site**.
 *
 * Source = vue Supabase `v_public_rooms` (v2 du 17/08, critère composite
 * lease_status + fenêtres move_in/move_out ; `anon` a le SELECT). Elle donne
 * par chambre `availability` (available/occupied) et `available_from` (date de
 * sortie du locataire en place, exposée seulement si elle est connue et
 * qu'aucun entrant n'est déjà signé — donc toujours une vraie libération).
 *
 * ── Hydratation (pages prérendues) ────────────────────────────────────────
 * Le résumé par maison est embarqué dans le HTML prérendu (pattern
 * prerenderEmbeddedState.ts) et relu de façon SYNCHRONE à l'init du store :
 * premier rendu client identique au snapshot → pas de mismatch #418, pas de CLS.
 * Un rafraîchissement part quand même après le montage : le prérendu ne rejoue
 * qu'aux push (+ cron), or la dispo bouge sans déploiement.
 *
 * ⚠️ Toute dérivation doit rester PURE sur les lignes reçues : pas de
 * `new Date()` dans un libellé rendu au premier passage, sinon le rendu client
 * du jour J+n diffère du snapshot construit au jour J → mismatch d'hydratation.
 *
 * (Les 29 pages /chambres de septembre liront la même vue, au niveau chambre.)
 */

import { useEffect, useSyncExternalStore } from "react";
import { supabase } from "@/lib/supabase";
import { readEmbeddedArray } from "@/lib/prerenderEmbeddedState";

export const AVAILABILITY_EMBED_ID = "__room_availability_data__";

export type HouseKey = "lavilla" | "leloft" | "lelodge";

const HOUSE_KEYS: HouseKey[] = ["lavilla", "leloft", "lelodge"];

/** Résumé par maison — la forme embarquée dans le HTML (3 lignes, pas 29). */
export type HouseSummary = {
  house_slug: HouseKey;
  /** Chambres libres tout de suite. */
  available: number;
  /** Nombre de CHAMBRES ayant une libération datée (pas de maisons : deux
   *  départs dans la même maison doivent compter pour deux). */
  upcoming: number;
  /** Prochaine libération datée, « YYYY-MM-DD », ou null. */
  next_free_date: string | null;
  /** Chambres libérées À `next_free_date` — PAS `upcoming` : deux départs à
   *  deux dates différentes ne libèrent pas deux chambres le même jour. */
  next_free_count: number;
};

// ── Store minimal partagé (hero, cartes, pages maisons, /candidature) ───────
// Un seul fetch par page, quel que soit le nombre de consommateurs.

let snapshot: HouseSummary[] | null = null;
let initialised = false;
let fetchStarted = false;
const listeners = new Set<() => void>();

function getSnapshot(): HouseSummary[] | null {
  if (!initialised) {
    initialised = true;
    snapshot = readEmbeddedArray<HouseSummary>(AVAILABILITY_EMBED_ID);
  }
  return snapshot;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function publish(rows: HouseSummary[]): void {
  snapshot = rows;
  for (const listener of listeners) listener();
}

type RoomRow = {
  house_slug: string;
  availability: string;
  available_from: string | null;
};

/** Agrège les 29 lignes chambres en 3 résumés maison. */
function summarise(rooms: RoomRow[]): HouseSummary[] {
  return HOUSE_KEYS.map((key) => {
    const mine = rooms.filter((r) => r.house_slug === key);
    const dates = mine
      .map((r) => r.available_from)
      .filter((d): d is string => typeof d === "string" && d.length > 0)
      .sort();
    return {
      house_slug: key,
      available: mine.filter((r) => r.availability === "available").length,
      upcoming: dates.length,
      next_free_date: dates[0] ?? null,
      next_free_count: dates.filter((d) => d === dates[0]).length,
    };
  });
}

async function refresh(): Promise<void> {
  if (fetchStarted) return;
  fetchStarted = true;
  try {
    const { data, error } = await supabase
      .from("v_public_rooms")
      .select("house_slug,availability,available_from");
    if (error) throw error;
    // Vue vide = anomalie (elle rend 29 lignes) → on garde l'état embarqué.
    if (data && data.length > 0) publish(summarise(data as RoomRow[]));
  } catch (e) {
    // Jamais bloquant : les libellés retombent sur la variante qualitative.
    console.error("Room availability load:", e);
  }
}

// ── Dérivations ────────────────────────────────────────────────────────────

export type HouseAvailability = {
  /** Chambres libres tout de suite. */
  available: number;
  /** Chambres ayant une libération datée. */
  upcoming: number;
  /** Prochaine libération datée, ou null. */
  nextFreeDate: string | null;
  /** Chambres libérées à cette date précise (≠ `upcoming`). */
  nextFreeCount: number;
};

export type SiteAvailability = {
  /** false = données indisponibles → libellés qualitatifs, jamais de chiffre. */
  known: boolean;
  /** Chambres libres tout de suite, toutes maisons. */
  totalAvailable: number;
  /** Chambres ayant une libération datée, toutes maisons. */
  upcoming: number;
  /** Plus proche libération datée, toutes maisons. */
  nextFreeDate: string | null;
  byHouse: Record<HouseKey, HouseAvailability>;
};

const UNKNOWN_HOUSE: HouseAvailability = { available: 0, upcoming: 0, nextFreeDate: null, nextFreeCount: 0 };

function derive(rows: HouseSummary[] | null): SiteAvailability {
  const byHouse = {
    lavilla: UNKNOWN_HOUSE,
    leloft: UNKNOWN_HOUSE,
    lelodge: UNKNOWN_HOUSE,
  } as Record<HouseKey, HouseAvailability>;

  if (!rows || rows.length === 0) {
    return { known: false, totalAvailable: 0, upcoming: 0, nextFreeDate: null, byHouse };
  }

  for (const row of rows) {
    if (!HOUSE_KEYS.includes(row.house_slug)) continue;
    byHouse[row.house_slug] = {
      available: row.available,
      // Repli sur l'ancienne forme embarquée (sans `upcoming`) : un HTML
      // prérendu par la version précédente reste lisible sans afficher 0.
      upcoming: typeof row.upcoming === "number" ? row.upcoming : (row.next_free_date ? 1 : 0),
      nextFreeDate: row.next_free_date,
      nextFreeCount:
        typeof row.next_free_count === "number" ? row.next_free_count : (row.next_free_date ? 1 : 0),
    };
  }

  const dates = HOUSE_KEYS.map((k) => byHouse[k].nextFreeDate)
    .filter((d): d is string => !!d)
    .sort();

  return {
    known: true,
    totalAvailable: HOUSE_KEYS.reduce((n, k) => n + byHouse[k].available, 0),
    upcoming: HOUSE_KEYS.reduce((n, k) => n + byHouse[k].upcoming, 0),
    nextFreeDate: dates[0] ?? null,
    byHouse,
  };
}

/**
 * Dispo réelle, partagée par tous les consommateurs.
 * Init synchrone depuis le HTML prérendu, puis rafraîchissement après montage.
 */
export function useRoomAvailability(): SiteAvailability {
  const rows = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  useEffect(() => {
    void refresh();
  }, []);
  return derive(rows);
}

/** Snapshot brut, pour le composant qui sérialise l'état dans le HTML. */
export function useAvailabilitySnapshot(): HouseSummary[] | null {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

// ── Libellés (FR/EN) ───────────────────────────────────────────────────────

const MONTHS_FR = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];
const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * « 10 septembre » / « September 10 » à partir de « YYYY-MM-DD ».
 * Formatage maison volontaire : `toLocaleDateString` peut différer entre l'ICU
 * de Puppeteer (prérendu) et celui du navigateur → mismatch d'hydratation.
 */
export function formatFreeDate(iso: string, lang: "fr" | "en"): string {
  const [, m, d] = iso.split("-");
  const monthIndex = Number(m) - 1;
  const day = Number(d);
  if (!Number.isFinite(day) || monthIndex < 0 || monthIndex > 11) return "";
  return lang === "en"
    ? `${MONTHS_EN[monthIndex]} ${day}`
    : `${day === 1 ? "1er" : day} ${MONTHS_FR[monthIndex]}`;
}

/**
 * Badge d'une maison (cartes home, pages maisons, blocs offre du blog).
 * `null` = dispo inconnue → l'appelant masque le badge (jamais de chiffre faux).
 */
export function houseBadgeLabel(house: HouseAvailability, known: boolean, lang: "fr" | "en"): string | null {
  if (!known) return null;
  if (house.available === 1) return lang === "en" ? "1 room available" : "1 chambre disponible";
  if (house.available > 1) {
    return lang === "en"
      ? `${house.available} rooms available`
      : `${house.available} chambres disponibles`;
  }
  if (house.nextFreeDate) {
    const date = formatFreeDate(house.nextFreeDate, lang);
    // « Libre dès le X » seul se lisait « la MAISON est libre » — faux pour une
    // maison de 10 résidents. On nomme l'unité, et on compte les chambres
    // libérées à cette date (repli à 1 : un HTML prérendu d'avant ce champ).
    const n = house.nextFreeCount > 0 ? house.nextFreeCount : 1;
    return lang === "en"
      ? `${n} room${n > 1 ? "s" : ""} available from ${date}`
      : `${n} chambre${n > 1 ? "s" : ""} libre${n > 1 ? "s" : ""} dès le ${date}`;
  }
  return lang === "en" ? "Fully booked" : "Complet";
}

// ── Code couleur du badge ──────────────────────────────────────────────────
// Vert = libre maintenant, bronze = libération datée, pierre = complet. Dérivé
// de la dispo réelle, jamais du libellé.
//
// Pastilles claires à texte foncé, et non plus aplats à texte blanc : le bronze
// #D4A574 sur blanc plafonnait à 2,23:1, sous le minimum AA de 4,5:1 — illisible
// en plein soleil, or l'audience est mobile. Ici : 8,1:1 / 5,7:1 / 8,2:1. La
// forme reprend la puce blanche « N résidents » déjà posée sur ces photos.

export type BadgeTone = "available" | "upcoming" | "full";

/** `null` = dispo inconnue → l'appelant masque le badge (comme le libellé). */
export function houseBadgeTone(house: HouseAvailability, known: boolean): BadgeTone | null {
  if (!known) return null;
  if (house.available > 0) return "available";
  if (house.nextFreeDate) return "upcoming";
  return "full";
}

/** Classes de la pastille posée sur une photo (cartes home, hero maison, blog). */
export const BADGE_CHIP_CLASS: Record<BadgeTone, string> = {
  available: "bg-[#2F7D5B]/95 text-white",
  upcoming: "bg-[#F5E7D3]/95 text-[#7A5215]",
  full: "bg-[#E7E5E4]/95 text-[#44403C]",
};

/** Classes de la même pastille sur fond blanc (colonne latérale page maison). */
export const BADGE_PANEL_CLASS: Record<BadgeTone, string> = {
  available: "bg-[#DFF3E6] text-[#0F5132]",
  upcoming: "bg-[#F5E7D3] text-[#7A5215]",
  full: "bg-[#E7E5E4] text-[#44403C]",
};

/** Pastille de statut (le point) qui accompagne le libellé dans la colonne. */
export const BADGE_DOT_CLASS: Record<BadgeTone, string> = {
  available: "bg-[#0F5132]",
  upcoming: "bg-[#7A5215]",
  full: "bg-[#44403C]",
};

/**
 * Libellé global (hero home, badge /candidature).
 * Sans données : libellé qualitatif du sprint S33 — vrai en toutes circonstances.
 */
export function globalAvailabilityLabel(a: SiteAvailability, lang: "fr" | "en"): string {
  if (!a.known) {
    return lang === "en"
      ? "Rooms are opening up — apply now"
      : "Des chambres se libèrent — candidate maintenant";
  }

  const rooms = (n: number) =>
    lang === "en"
      ? `${n} room${n > 1 ? "s" : ""}`
      : `${n} chambre${n > 1 ? "s" : ""}`;

  if (a.totalAvailable > 0 && a.nextFreeDate) {
    const date = formatFreeDate(a.nextFreeDate, lang);
    return lang === "en"
      ? `${rooms(a.totalAvailable)} available now — ${a.upcoming} more from ${date}`
      : `${rooms(a.totalAvailable)} libre${a.totalAvailable > 1 ? "s" : ""} maintenant — ${a.upcoming} autre${a.upcoming > 1 ? "s" : ""} à partir du ${date}`;
  }
  if (a.totalAvailable > 0) {
    return lang === "en"
      ? `${rooms(a.totalAvailable)} available`
      : `${rooms(a.totalAvailable)} disponible${a.totalAvailable > 1 ? "s" : ""}`;
  }
  if (a.nextFreeDate) {
    const date = formatFreeDate(a.nextFreeDate, lang);
    return lang === "en"
      ? `Next room available: ${date}`
      : `Prochaine chambre libre : ${date}`;
  }
  return lang === "en" ? "Join the waitlist" : "Rejoins la liste d'attente";
}

/**
 * Variante courte pour le badge de /candidature : une seule ligne sur mobile
 * (audience majoritairement mobile), sans le « — N autres à partir du … » du
 * hero. Même règle de repli qualitatif quand la dispo est inconnue.
 */
export function shortAvailabilityLabel(a: SiteAvailability, lang: "fr" | "en"): string {
  if (!a.known) {
    return lang === "en"
      ? "Rooms are opening up — apply now"
      : "Des chambres se libèrent — candidate maintenant";
  }
  if (a.totalAvailable === 1) {
    return lang === "en" ? "1 room available now" : "1 chambre libre maintenant";
  }
  if (a.totalAvailable > 1) {
    return lang === "en"
      ? `${a.totalAvailable} rooms available now`
      : `${a.totalAvailable} chambres libres maintenant`;
  }
  if (a.nextFreeDate) {
    const date = formatFreeDate(a.nextFreeDate, lang);
    return lang === "en"
      ? `Next room: ${date}`
      : `Prochaine chambre : ${date}`;
  }
  return lang === "en" ? "Join the waitlist" : "Rejoins la liste d'attente";
}
