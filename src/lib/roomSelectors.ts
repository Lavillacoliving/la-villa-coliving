/**
 * Sélecteurs PURS sur les lignes de v_public_rooms (L'Appart, brief du 12/11/2026) — le magasin des chambres
 * (src/lib/availability.ts) ne fait que les appeler.
 *
 *  - Entrée filtrée : une ligne d'un lieu inconnu du code (vue en avance sur le site, ou clé mal rendue par la vue) est
 *    écartée dès l'arrivée : elle n'atteint aucune page, ni l'état embarqué dans le HTML prérendu.
 *  - Défaut = maisons : l'inventaire « toutes les chambres » est celui des 3 maisons (totaux, compteurs, offre hiver).
 *    L'Appart ne sort que pour qui le demande par sa clé (`placeRooms(rows, "lappart")`).
 *  - (19/11/2026) Lignes de L'Appart publiées sans jour d'ouverture ni étage (`publicAppartRows`).
 *
 * Aucun React, aucune date calculée, import relatif avec extension : chargé tel quel par Node 24 (tools/test/room-selectors.test.mjs).
 */
import { MAISON_KEYS, PLACE_KEYS, isAppartKey, isMaisonKey, isPlaceKey, type MaisonKey, type PlaceKey } from "../data/places.ts";

/** Ce que les sélecteurs lisent d'une ligne : son lieu et son numéro. */
type RoomRef = { house_slug: string; room_number: number };

/** Lignes d'un lieu connu du code (maison ou L'Appart), dans l'ordre reçu. */
export function knownPlaceRows<R extends { house_slug: string }>(rows: readonly R[]): (R & { house_slug: PlaceKey })[] {
  return rows.filter((r): r is R & { house_slug: PlaceKey } => isPlaceKey(r.house_slug));
}

/** Une date « au mois près » (« AAAA-MM ») : l'ouverture de L'Appart telle que le site la publie (V2-22). Pure. */
export function isMonthOnly(iso: string | null | undefined): boolean {
  return typeof iso === "string" && /^\d{4}-(?:0[1-9]|1[0-2])$/.test(iso);
}

/**
 * (19/11/2026, réponses V2-22 et V2-33 de Jérôme) Lignes de L'Appart telles que le site les publie, appliqué dès l'arrivée (fetch
 * et état embarqué, src/lib/availability.ts) :
 *  - la date d'ouverture se publie AU MOIS : la vue rend le jour posé en base (`rooms.opens_on`, repère technique) ; une ligne de
 *    L'Appart datée dans le mois d'ouverture (`openingMonth`, « AAAA-MM » = APPART.opensOn) ne garde que ce mois. Une date d'un
 *    autre mois (une vraie libération, après l'ouverture) passe telle quelle, comme pour les maisons ;
 *  - jamais d'étage (V2-33, décision de Jérôme du 19/11/2026).
 * Les lignes des maisons ne bougent pas. Pure, idempotente (l'état embarqué relu donne les mêmes lignes).
 */
export function publicAppartRows<R extends { house_slug: string; available_from: string | null; floor: string | null }>(
  rows: readonly R[],
  openingMonth: string,
): R[] {
  return rows.map((r) => {
    if (!isAppartKey(r.house_slug)) return r;
    const from = typeof r.available_from === "string" && r.available_from.slice(0, 7) === openingMonth ? openingMonth : r.available_from;
    return from === r.available_from && r.floor === null ? r : { ...r, available_from: from, floor: null };
  });
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
