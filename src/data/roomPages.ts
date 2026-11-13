import type { PublicRoom } from "@/lib/availability";
import { PLACE_KEYS, roomFromPath, type PlaceKey } from "@/data/places";
import ROOM_PAGES_JSON from "./roomPages.json";

/**
 * Fiches chambres (28/09/2026, demande Jérôme) : une page par chambre, à partager en lien
 * (WhatsApp, Instagram, annonces) — /lelodge/chambre-4, /en/lelodge/chambre-4…
 *
 * Source unique : `roomPages.json`, aussi lu par scripts/prerender.mjs (routes prérendues,
 * rewrites vercel.json). Ajouter une chambre = ajouter son numéro dans le JSON ; la page
 * lit ses données dans v_public_rooms et ses photos dans src/data/roomPhotos.ts.
 *
 * Pages NOINDEX (hors sitemap, X-Robots-Tag) : 13 pages quasi identiques d'une même maison
 * seraient de la génération de pages en masse au sens de CLAUDE.md §4 ; ce sont des pages de
 * conversion, pas des actifs SEO. L'intention « chambre disponible » est portée par
 * /chambres-disponibles et les pages maisons, qui renvoient vers ces fiches.
 * (L'Appart, 12/11/2026) Par lieu public (src/data/places.ts) : L'Appart a sa liste, vide tant que le JSON n'a pas sa clé.
 */
const json = ROOM_PAGES_JSON as Record<string, unknown>;
const listFor = (k: PlaceKey): readonly number[] => (Array.isArray(json[k]) ? (json[k] as number[]) : []);
export const ROOM_PAGES: Readonly<Record<PlaceKey, readonly number[]>> = {
  lavilla: listFor("lavilla"),
  leloft: listFor("leloft"),
  lelodge: listFor("lelodge"),
  lappart: listFor("lappart"),
};

export function hasRoomPage(house: string, roomNumber: number): boolean {
  return (ROOM_PAGES as Record<string, readonly number[]>)[house]?.includes(roomNumber) ?? false;
}

/**
 * Fiche CONSULTABLE (demande Jérôme du 28/09/2026) : seulement si la chambre est libre
 * maintenant ou a une date de libération — même partition que splitRooms(). Une chambre
 * occupée sans date garde sa route, mais la page affiche « pas disponible » et plus aucun
 * lien du site n'y mène. Évalué sur v_public_rooms (prérendu 2×/jour + rafraîchi au montage).
 */
export function isRoomPageOpen(house: string, room: Pick<PublicRoom, "room_number" | "availability" | "available_from">): boolean {
  return hasRoomPage(house, room.room_number) && (room.availability === "available" || !!room.available_from);
}

/** Chemin FR (LocalizedLink ajoute /en). */
export function roomPagePath(house: PlaceKey, roomNumber: number): string {
  return `/${house}/chambre-${roomNumber}`;
}

/** Toutes les routes FR des fiches (App.tsx). */
export const ROOM_PAGE_PATHS: string[] = PLACE_KEYS.flatMap((k) => ROOM_PAGES[k].map((n) => roomPagePath(k, n)));

/** Parse `/lelodge/chambre-4` ou `/en/lelodge/chambre-4` → { house, roomNumber } si la fiche existe. Lieu quelconque :
 *  la page d'une maison (RoomDetailPage) n'accepte que les maisons. */
export function parseRoomPagePath(pathname: string): { house: PlaceKey; roomNumber: number } | null {
  const r = roomFromPath(pathname.replace(/\/+$/, ""));
  return r && hasRoomPage(r.place, r.roomNumber) ? { house: r.place, roomNumber: r.roomNumber } : null;
}
