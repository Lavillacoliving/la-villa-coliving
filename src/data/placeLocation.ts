/**
 * Emplacement d'un LIEU public, maison ou L'Appart : aiguillage (L'Appart, brief du 12/11/2026). Chaque fonction choisit entre
 * src/data/houseLocation.ts (les 3 maisons, inchangé) et src/data/appartLocation.ts (L'Appart) par un `switch` exhaustif : un
 * lieu ajouté à PLACE_KEYS sans sa branche ne compile pas, et une maison rend exactement ce qu'elle rendait.
 *
 * Lu par <HouseCommuteTable/> (tableau, note, lien) et par les pages et les gardes qui traitent un lieu quelconque. Les
 * fonctions des maisons restent la référence pour les pages des maisons ; celles-ci ne changent pas.
 */
import {
  HOUSE_LOCATION_VERSION,
  houseBorder,
  houseCommuteLong,
  houseCommuteNote,
  houseCommuteRows,
  houseDirectionsLabel,
  houseDirectionsUrl,
  houseExactAddressNote,
  houseLocationStrings,
  houseNearby,
  houseNeighbourhood,
  houseZone,
  type CommuteRow,
} from "./houseLocation";
import {
  APPART_LOCATION_VERSION,
  appartCommuteLine,
  appartCommuteLong,
  appartCommuteNote,
  appartCommuteRows,
  appartDirectionsStart,
  appartDirectionsUrl,
  appartExactAddressNote,
  appartLocationStrings,
  appartMapLegend,
  appartNearby,
  appartNeighbourhood,
  appartZone,
} from "./appartLocation";
import { houseCommuteLine } from "./entityFacts";
import { assertNever, type PlaceKey } from "./places";

export type PlaceLocLang = "fr" | "en";

/** Phrase de quartier (exactement une fois par page de lieu). */
export function placeNeighbourhood(place: PlaceKey, lang: PlaceLocLang): string {
  switch (place) {
    case "lavilla":
    case "leloft":
    case "lelodge":
      return houseNeighbourhood(place, lang);
    case "lappart":
      return appartNeighbourhood(lang);
    default:
      return assertNever(place);
  }
}

/** Zone publiée à la place de l'adresse. */
export function placeZone(place: PlaceKey, lang: PlaceLocLang): string {
  switch (place) {
    case "lavilla":
    case "leloft":
    case "lelodge":
      return houseZone(place, lang);
    case "lappart":
      return appartZone(lang);
    default:
      return assertNever(place);
  }
}

/** Phrase sous la zone (quand l'adresse exacte est donnée). */
export function placeExactAddressNote(place: PlaceKey, lang: PlaceLocLang): string {
  switch (place) {
    case "lavilla":
    case "leloft":
    case "lelodge":
      return houseExactAddressNote(lang);
    case "lappart":
      return appartExactAddressNote(lang);
    default:
      return assertNever(place);
  }
}

/** Phrase « frontière » : les maisons qui en ont une ; jamais L'Appart. */
export function placeBorder(place: PlaceKey, lang: PlaceLocLang): string | undefined {
  switch (place) {
    case "lavilla":
    case "leloft":
    case "lelodge":
      return houseBorder(place, lang);
    case "lappart":
      return undefined;
    default:
      return assertNever(place);
  }
}

/** Ligne courte de trajet (en tête de page, fiches). */
export function placeCommuteLine(place: PlaceKey, lang: PlaceLocLang): string {
  switch (place) {
    case "lavilla":
    case "leloft":
    case "lelodge":
      return houseCommuteLine(place, lang);
    case "lappart":
      return appartCommuteLine(lang);
    default:
      return assertNever(place);
  }
}

/** Ligne longue de trajet. */
export function placeCommuteLong(place: PlaceKey, lang: PlaceLocLang): string {
  switch (place) {
    case "lavilla":
    case "leloft":
    case "lelodge":
      return houseCommuteLong(place, lang);
    case "lappart":
      return appartCommuteLong(lang);
    default:
      return assertNever(place);
  }
}

/** Lignes du tableau des trajets. */
export function placeCommuteRows(place: PlaceKey, lang: PlaceLocLang): CommuteRow[] {
  switch (place) {
    case "lavilla":
    case "leloft":
    case "lelodge":
      return houseCommuteRows(place, lang);
    case "lappart":
      return appartCommuteRows(lang);
    default:
      return assertNever(place);
  }
}

/** Note de méthode sous le tableau : relevé du 8 octobre pour les maisons, du 12 novembre pour L'Appart. */
export function placeCommuteNote(place: PlaceKey, lang: PlaceLocLang): string {
  switch (place) {
    case "lavilla":
    case "leloft":
    case "lelodge":
      return houseCommuteNote(lang);
    case "lappart":
      return appartCommuteNote(lang);
    default:
      return assertNever(place);
  }
}

/** Lien « Calculer mon trajet » (Google Maps, transports) : depuis le point public du lieu. */
export function placeDirectionsUrl(place: PlaceKey, lang: PlaceLocLang): string {
  switch (place) {
    case "lavilla":
    case "leloft":
    case "lelodge":
      return houseDirectionsUrl(place, lang);
    case "lappart":
      return appartDirectionsUrl(lang);
    default:
      return assertNever(place);
  }
}

/** Libellé du lien « Calculer mon trajet » (le même pour tous les lieux). */
export function placeDirectionsLabel(lang: PlaceLocLang): string {
  return houseDirectionsLabel(lang);
}

/** Phrase sous le lien « Calculer mon trajet » quand le calcul ne part pas du lieu lui-même (L'Appart : la gare) ; null sinon. */
export function placeDirectionsStart(place: PlaceKey, lang: PlaceLocLang): string | null {
  switch (place) {
    case "lavilla":
    case "leloft":
    case "lelodge":
      return null;
    case "lappart":
      return appartDirectionsStart(lang);
    default:
      return assertNever(place);
  }
}

/** Légende de la carte quand elle n'est pas centrée sur le lieu lui-même (L'Appart : la gare) ; null sinon. */
export function placeMapLegend(place: PlaceKey, lang: PlaceLocLang): string | null {
  switch (place) {
    case "lavilla":
    case "leloft":
    case "lelodge":
      return null;
    case "lappart":
      return appartMapLegend(lang);
    default:
      return assertNever(place);
  }
}

/** Commerces et services à pied (vide pour L'Appart : pas encore relevés, la section ne s'affiche pas). */
export function placeNearby(place: PlaceKey, lang: PlaceLocLang): string[] {
  switch (place) {
    case "lavilla":
    case "leloft":
    case "lelodge":
      return houseNearby(place, lang);
    case "lappart":
      return appartNearby();
    default:
      return assertNever(place);
  }
}

/** Version des textes d'emplacement du lieu (data-house-location-version). */
export function placeLocationVersion(place: PlaceKey): string {
  switch (place) {
    case "lavilla":
    case "leloft":
    case "lelodge":
      return HOUSE_LOCATION_VERSION;
    case "lappart":
      return APPART_LOCATION_VERSION;
    default:
      return assertNever(place);
  }
}

/** Toutes les chaînes d'emplacement d'un lieu (gardes). */
export function placeLocationStrings(place: PlaceKey, lang: PlaceLocLang): string[] {
  switch (place) {
    case "lavilla":
    case "leloft":
    case "lelodge":
      return houseLocationStrings(place, lang);
    case "lappart":
      return appartLocationStrings(lang);
    default:
      return assertNever(place);
  }
}
