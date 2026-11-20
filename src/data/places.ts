/**
 * Lieux publics de La Villa Coliving : clés, gammes, chemins — source unique (L'Appart, brief du 12/11/2026).
 *
 * Deux gammes, jamais fondues (règle V2, Jérôme 12/11/2026) : les 3 maisons de coliving (piscine, sauna, salle de sport)
 * et L'Appart, une colocation à Annemasse. Par défaut, tout ce qui décrit « les maisons » est typé `MaisonKey` (tables de
 * stats.ts, ENTITY_HOUSES, cartes, trajets, totaux) : L'Appart n'entre que là où le code écrit `PlaceKey` ou `AppartKey`.
 *
 * Module FEUILLE : aucun import, aucun React, aucune date. Il est lu par le bundle d'entrée (routes, contexte de
 * navigation), par les scripts (esbuild, scripts/lib/load-entity-facts.mjs) et tel quel par Node 24 (tools/test).
 * Ses exports doivent rester UNIQUES parmi les modules chargés par load-entity-facts.mjs : deux `export *` du même nom
 * disparaissent sans message (d'où `GAMME` / `GammeOf`, et pas de fonction `gammeOf`, déjà exportée par allInclusive.ts).
 * Liste vérifiée par tools/test/places.test.mjs.
 *
 * La clé interne de L'Appart (base, candidature) n'est pas ici : un seul fichier du site la connaîtra.
 */

/** Les 3 maisons de coliving, dans l'ordre d'affichage. */
export const MAISON_KEYS = ["lavilla", "leloft", "lelodge"] as const;
export type MaisonKey = (typeof MAISON_KEYS)[number];

/** Clé PUBLIQUE de L'Appart : URL, `?property_interest=`, `house_slug` de v_public_rooms, JSON-LD, GA4, noms de fichiers. */
export const APPART_KEY = "lappart";
export type AppartKey = typeof APPART_KEY;

/** Tous les lieux publics, maisons d'abord. */
export const PLACE_KEYS = [...MAISON_KEYS, APPART_KEY] as const;
export type PlaceKey = (typeof PLACE_KEYS)[number];

/** Les deux gammes : les maisons de coliving et L'Appart. */
export type Gamme = "maisons" | "appart";

/** Gamme de chaque lieu. Un lieu ajouté à PLACE_KEYS sans sa gamme ne compile pas. */
export const GAMME = {
  lavilla: "maisons",
  leloft: "maisons",
  lelodge: "maisons",
  lappart: "appart",
} as const satisfies Record<PlaceKey, Gamme>;

/** Gamme d'un lieu au niveau des types : `GammeOf<"lappart">` = `"appart"`. */
export type GammeOf<K extends PlaceKey> = (typeof GAMME)[K];

export const isMaisonKey = (v: unknown): v is MaisonKey =>
  typeof v === "string" && (MAISON_KEYS as readonly string[]).includes(v);
export const isAppartKey = (v: unknown): v is AppartKey => v === APPART_KEY;
export const isPlaceKey = (v: unknown): v is PlaceKey => isMaisonKey(v) || isAppartKey(v);

/** Garde d'exhaustivité : un lieu oublié dans un `switch` devient une erreur de compilation. */
export function assertNever(x: never): never {
  throw new Error(`places : cas non traité (${String(x)})`);
}

/** Nom public court de chaque lieu (cartes, fil d'Ariane, données structurées, gardes). */
export const PLACE_LABEL = {
  lavilla: "La Villa",
  leloft: "Le Loft",
  lelodge: "Le Lodge",
  lappart: "L'Appart",
} as const satisfies Record<PlaceKey, string>;

/** « lavilla|leloft|lelodge|lappart » : pour les expressions régulières écrites hors TypeScript (vercel.json, index.html). */
export const PLACE_KEYS_PATTERN: string = PLACE_KEYS.join("|");
export const MAISON_KEYS_PATTERN: string = MAISON_KEYS.join("|");

const PLACE_PATH_RE = new RegExp(`^(?:/en)?/(${PLACE_KEYS_PATTERN})/?$`);
const ROOM_PATH_RE = new RegExp(`^(?:/en)?/(${PLACE_KEYS_PATTERN})/chambre-(\\d{1,2})/?$`);

/** « /lelodge », « /en/lappart » → clé du lieu ; tout autre chemin → null. */
export function placeFromPath(pathname: string): PlaceKey | null {
  const m = PLACE_PATH_RE.exec(pathname);
  return m && isPlaceKey(m[1]) ? m[1] : null;
}

/** « /lelodge/chambre-4 », « /en/lappart/chambre-5 » → { place, roomNumber } ; tout autre chemin → null. */
export function roomFromPath(pathname: string): { place: PlaceKey; roomNumber: number } | null {
  const m = ROOM_PATH_RE.exec(pathname);
  return m && isPlaceKey(m[1]) ? { place: m[1], roomNumber: Number(m[2]) } : null;
}

/**
 * Lieux qui ONT une page prérendue (/<clé> et /en/<clé>) : les 3 maisons et, depuis l'étape E3 (13/11/2026), L'Appart.
 * Interrupteur unique du contexte de navigation (src/lib/houseContext.ts), de l'encart Facebook des pages de lieu
 * (src/data/answerSlots.ts) et des gardes des pages de lieu (house-pages-check, check:facts). Les listes écrites à la main
 * ailleurs le suivent, tools/test/places.test.mjs l'exige : vercel.json, index.html, scripts/prerender.mjs,
 * scripts/hydration-check.mjs, src/lib/routePreload.ts, src/App.tsx, src/data/roomPages.json.
 */
export const PLACE_PAGE_KEYS: readonly PlaceKey[] = PLACE_KEYS;

/** Numéro de la suite de L'Appart (décision à confirmer) : sa seule saisie dans le code. */
export const APPART_SUITE_ROOM_NUMBER = 5;

/** Libellé public d'une chambre : « Chambre 4 » / « Room 4 » ; la n° 5 de L'Appart s'appelle « Suite » dans les deux langues. */
export function roomLabel(place: PlaceKey, roomNumber: number, lang: "fr" | "en"): string {
  if (place === APPART_KEY && roomNumber === APPART_SUITE_ROOM_NUMBER) return "Suite";
  return lang === "en" ? `Room ${roomNumber}` : `Chambre ${roomNumber}`;
}

/** Personnes au plus dans la suite de L'Appart : la seule chambre de La Villa Coliving qui se loue à deux (une ailleurs). */
export const APPART_SUITE_MAX_OCCUPANTS = 2;

/** Capacité affichée sur la carte d'une chambre : « 1 ou 2 personnes » pour la suite de L'Appart, `null` ailleurs (une
 *  chambre = une personne : rien à dire, la carte reste celle d'aujourd'hui). */
export function roomCapacityLabel(place: PlaceKey, roomNumber: number, lang: "fr" | "en"): string | null {
  if (place !== APPART_KEY || roomNumber !== APPART_SUITE_ROOM_NUMBER) return null;
  return lang === "en" ? `1 or ${APPART_SUITE_MAX_OCCUPANTS} people` : `1 ou ${APPART_SUITE_MAX_OCCUPANTS} personnes`;
}

/** Badge de gamme des cartes de L'Appart dans les listes qui mêlent les deux gammes (« L'Appart · colocation ») ; `null` pour
 *  une maison (ses cartes n'en portent pas). */
export function placeGammeBadge(place: PlaceKey, lang: "fr" | "en"): string | null {
  if (place !== APPART_KEY) return null;
  return lang === "en" ? `${PLACE_LABEL.lappart} · flatshare` : `${PLACE_LABEL.lappart} · colocation`;
}

/** Bouton des cartes vers la page du lieu : « Découvrir la maison » (maisons) / « Découvrir L'Appart ». */
export function placeDiscoverLabel(place: PlaceKey, lang: "fr" | "en"): string {
  if (place === APPART_KEY) return lang === "en" ? `Discover ${PLACE_LABEL.lappart}` : `Découvrir ${PLACE_LABEL.lappart}`;
  return lang === "en" ? "Discover the house" : "Découvrir la maison";
}
