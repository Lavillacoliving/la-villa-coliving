/**
 * « Tests de types » des deux gammes (L'Appart, brief du 12/11/2026 ; règle V2 : maisons et L'Appart jamais fondus).
 *
 * Ce fichier n'est importé par personne : il n'entre dans aucun bundle, mais `tsc -b` le compile (tsconfig.app.json
 * inclut tout src/). Chaque ligne précédée de `@ts-expect-error` DOIT être une erreur de compilation. Si quelqu'un
 * élargit un type (une table des maisons qui accepte L'Appart, `MaisonKey` remplacé par `PlaceKey`…), l'erreur
 * disparaît, la directive devient inutile et `tsc -b` ÉCHOUE (TS2578), en local comme en CI.
 *
 * Ce que ce fichier ne couvre pas : les constantes globales des maisons (note Google, « 100+ résidents »…), qu'aucun type
 * ne relie à un lieu. Elles sont gardées sur le HTML publié (scripts/check-entity-facts.mjs).
 * La ligne « tout compris » réelle (cardInclusions, src/data/allInclusive.ts) prend des chaînes : elle est contrôlée à
 * l'exécution (tools/test/all-inclusive.test.mjs) ; ici, le cas 11 vérifie sa table des gammes (GAMME).
 */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { ROOMS_BY_HOUSE, HOUSE_SURFACES, ROOM_SURFACE_BY_HOUSE, TRANSIT } from "./stats";
import { ENTITY_HOUSES, houseCommuteLine, type EntityHouse } from "./entityFacts";
import { houseBorder, houseNeighbourhood } from "./houseLocation";
import { HOUSES as HOUSE_CARDS } from "./houses";
import { GAMME, type AppartKey, type MaisonKey, type PlaceKey } from "./places";
import { buildHouseLodgingNode, HOUSES as HOUSE_NODES } from "../lib/structuredData";
import { housePriceFrom } from "../lib/housePrice";
import { allMaisonRooms, placeRooms } from "../lib/roomSelectors";
import { splitRooms, type PlaceRoom, type PublicRoom, type SiteAvailability, type useHouseRooms } from "../lib/availability";

export function gammeTypeProofs(
  appart: AppartKey,
  place: PlaceKey,
  maison: MaisonKey,
  availability: SiteAvailability,
  placeRoom: PlaceRoom,
  appartRoom: PublicRoom<AppartKey>,
  maisonRoom: PublicRoom,
  placeRows: PlaceRoom[],
): void {
  // ── Ce qui DOIT compiler ────────────────────────────────────────────────────────────────────────────────
  ROOMS_BY_HOUSE[maison];
  HOUSE_CARDS[maisonRoom.house_slug].label;
  const widened: PlaceRoom = maisonRoom; // une chambre de maison est une chambre d'un lieu
  const appartGamme: "appart" = GAMME[appart];
  const maisonGamme: "maisons" = GAMME[maison];
  const appartRooms: PublicRoom<AppartKey>[] = placeRooms(placeRows, appart).rooms;
  const appartSplit: { candidates: PublicRoom<AppartKey>[] } = splitRooms(appartRooms); // splitRooms garde le type reçu
  const maisonList: PublicRoom[] = allMaisonRooms(placeRows).rooms;
  const hookRooms: PublicRoom<AppartKey>[] = [] as ReturnType<typeof useHouseRooms<AppartKey>>["rooms"];
  void [widened, appartGamme, maisonGamme, appartSplit, maisonList, hookRooms];

  // ── 1 à 5. « 29 chambres », surfaces et trajets des maisons : L'Appart n'y entre pas ────────────────────────
  // @ts-expect-error (1) ROOMS_BY_HOUSE ne connaît que les 3 maisons
  ROOMS_BY_HOUSE[appart];
  // @ts-expect-error (2) une clé de lieu quelconque n'indexe pas une table des maisons
  HOUSE_SURFACES[place];
  // @ts-expect-error (3) idem pour les surfaces de chambres par maison (« 16 à 24 m² »)
  ROOM_SURFACE_BY_HOUSE[place];
  // @ts-expect-error (4) les trajets de L'Appart ne sont pas dans TRANSIT.byHouse (fourchettes de la marque = maisons)
  TRANSIT.byHouse[appart];
  // @ts-expect-error (5) ajouter L'Appart à une table des maisons ne compile pas
  ({ lavilla: 10, leloft: 7, lelodge: 12, lappart: 4 }) satisfies Record<MaisonKey, number>;

  // ── 6 à 11. Piscine, sauna, salle de sport : portés par les maisons seulement ───────────────────────────────
  // @ts-expect-error (6) aucune entrée de ENTITY_HOUSES ne peut être L'Appart (comparaison sans recouvrement)
  ENTITY_HOUSES.find((h) => h.slug === appart);
  // @ts-expect-error (7) on ne fabrique pas une « maison » L'Appart avec des équipements de maison
  const fake: EntityHouse = { slug: "lappart", label: "L'Appart", commune: "Annemasse", rooms: 4, sharedBathRooms: 3, amenities: { fr: "piscine", en: "pool" }, commute: { fr: "", en: "" } };
  void fake;
  // @ts-expect-error (8) la carte d'une maison (« piscine · jardin ») ne se lit pas avec la clé d'un lieu quelconque
  HOUSE_CARDS[placeRoom.house_slug];
  // @ts-expect-error (9) ni avec une chambre de L'Appart
  HOUSE_CARDS[appartRoom.house_slug];
  // @ts-expect-error (10) le nœud JSON-LD d'une maison (amenityFeature piscine…) ne se construit pas pour L'Appart
  buildHouseLodgingNode({ ...HOUSE_NODES[0], slug: appart });
  // @ts-expect-error (11) la gamme de L'Appart est « appart » dès la compilation (table lue par la ligne « tout compris »)
  const appartAsMaisons: "maisons" = GAMME[appart];
  void appartAsMaisons;

  // ── 12 à 16. Statistiques, prix et textes des maisons ───────────────────────────────────────────────────────
  // @ts-expect-error (12) le résumé de disponibilité (accueil, /candidature) n'a pas d'entrée L'Appart
  availability.byHouse[appart];
  // @ts-expect-error (13) le prix d'appel « dès 1 290 CHF » des maisons ne se demande pas pour un lieu quelconque
  housePriceFrom(place, "fr");
  // @ts-expect-error (14) la ligne de trajet d'une maison ne se calcule pas pour L'Appart
  houseCommuteLine(appart, "fr");
  // @ts-expect-error (15) la phrase « frontière » (le Foron) est un fait des maisons
  houseBorder(place, "fr");
  // @ts-expect-error (16) la phrase de quartier d'une maison ne se demande pas pour L'Appart
  houseNeighbourhood(appart, "fr");

  // ── 17 à 20. Une chambre de L'Appart n'entre pas dans une liste typée « maisons » ───────────────────────────
  // @ts-expect-error (17) PlaceRoom → PublicRoom (maison) : refusé
  const asMaison: PublicRoom = placeRoom;
  void asMaison;
  // @ts-expect-error (18) une liste de chambres de maisons n'accepte pas une chambre de L'Appart
  const list: PublicRoom[] = [maisonRoom, appartRoom];
  void list;
  // @ts-expect-error (19) les chambres de L'Appart rendues par le sélecteur restent des chambres de L'Appart
  const appartAsMaisonList: PublicRoom[] = placeRooms(placeRows, appart).rooms;
  void appartAsMaisonList;
  // @ts-expect-error (20) l'inventaire « toutes les chambres » (useAllRooms) ne rend jamais L'Appart
  const maisonsAsAppart: PublicRoom<AppartKey>[] = allMaisonRooms(placeRows).rooms;
  void maisonsAsAppart;
}
