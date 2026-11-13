/**
 * Sélecteurs PURS sur les lignes de v_public_rooms (L'Appart, brief du 12/11/2026) — le magasin des chambres
 * (src/lib/availability.ts) ne fait que les appeler.
 *
 *  - Entrée filtrée : une ligne d'un lieu inconnu du code (vue en avance sur le site, ou clé mal rendue par la vue) est
 *    écartée dès l'arrivée : elle n'atteint aucune page, ni l'état embarqué dans le HTML prérendu.
 *  - Défaut = maisons : l'inventaire « toutes les chambres » est celui des 3 maisons (totaux, compteurs, offre hiver).
 *    L'Appart ne sort que pour qui le demande par sa clé (`placeRooms(rows, "lappart")`).
 *
 * Aucun React, aucune date, import relatif avec extension : chargé tel quel par Node 24 (tools/test/room-selectors.test.mjs).
 */
import { MAISON_KEYS, PLACE_KEYS, isMaisonKey, isPlaceKey, type MaisonKey, type PlaceKey } from "../data/places.ts";

/** Ce que les sélecteurs lisent d'une ligne : son lieu et son numéro. */
type RoomRef = { house_slug: string; room_number: number };

/** Lignes d'un lieu connu du code (maison ou L'Appart), dans l'ordre reçu. */
export function knownPlaceRows<R extends { house_slug: string }>(rows: readonly R[]): (R & { house_slug: PlaceKey })[] {
  return rows.filter((r): r is R & { house_slug: PlaceKey } => isPlaceKey(r.house_slug));
}

/** Lignes des 3 maisons seulement, dans l'ordre reçu. */
export function maisonRows<R extends { house_slug: string }>(rows: readonly R[]): (R & { house_slug: MaisonKey })[] {
  return rows.filter((r): r is R & { house_slug: MaisonKey } => isMaisonKey(r.house_slug));
}

/** Lignes d'un lieu, ou d'une liste de lieux, dans l'ordre reçu. */
export function placeRows<R extends { house_slug: string }, K extends PlaceKey>(
  rows: readonly R[],
  places: K | readonly K[],
): (R & { house_slug: K })[] {
  const wanted: readonly string[] = typeof places === "string" ? [places] : places;
  return rows.filter((r): r is R & { house_slug: K } => wanted.includes(r.house_slug));
}

/** Rang d'affichage d'un lieu : l'ordre de PLACE_KEYS (maisons d'abord) ; un lieu inconnu passe en dernier. */
function placeRank(slug: string): number {
  const i = (PLACE_KEYS as readonly string[]).indexOf(slug);
  return i === -1 ? PLACE_KEYS.length : i;
}

/** Tri des listes : lieu (maisons d'abord, dans l'ordre d'affichage), puis numéro de chambre. */
export function compareRooms(a: RoomRef, b: RoomRef): number {
  return placeRank(a.house_slug) - placeRank(b.house_slug) || a.room_number - b.room_number;
}

/**
 * Inventaire des MAISONS (`useAllRooms`), trié maison puis numéro. Connu seulement si chacune des 3 maisons a au moins
 * une ligne : l'état embarqué d'une page maison ne porte que les siennes et ne doit pas passer pour l'inventaire complet
 * (correctif du 30/09/2026). Les lignes de L'Appart n'y entrent jamais, avant comme après la bascule de la base.
 */
export function allMaisonRooms<R extends RoomRef>(rows: readonly R[] | null): { known: boolean; rooms: (R & { house_slug: MaisonKey })[] } {
  if (!rows || !MAISON_KEYS.every((k) => rows.some((r) => r.house_slug === k))) return { known: false, rooms: [] };
  const rooms = maisonRows(rows).sort(compareRooms);
  return { known: rooms.length > 0, rooms };
}

/** Chambres d'UN lieu (`useHouseRooms`), triées par numéro ; `known: false` tant qu'il n'a aucune ligne. */
export function placeRooms<R extends RoomRef, K extends PlaceKey>(
  rows: readonly R[] | null,
  place: K,
): { known: boolean; rooms: (R & { house_slug: K })[] } {
  if (!rows) return { known: false, rooms: [] };
  const rooms = placeRows(rows, place).sort((a, b) => a.room_number - b.room_number);
  return { known: rooms.length > 0, rooms };
}

/** Lignes à embarquer dans le HTML (`RoomsEmbed`) : celles des lieux demandés, toutes sans argument ; null si aucune. */
export function embedRows<R extends { house_slug: string }>(
  rows: readonly R[] | null,
  places?: PlaceKey | readonly PlaceKey[],
): readonly R[] | null {
  if (!rows) return null;
  const mine = places === undefined ? rows : placeRows(rows, places);
  return mine.length > 0 ? mine : null;
}
