/**
 * L'Appart — emplacement, quartier et trajets : SOURCE UNIQUE (brief « Points d'entrée prix, L'Appart » du 12/11/2026 ; relevé
 * de trajets du 12/11, valeurs arrêtées par Jérôme ; textes de L'Appart du 13/11, « à confirmer »). Pendant de
 * src/data/houseLocation.ts pour les maisons ; src/data/placeLocation.ts aiguille entre les deux.
 *
 * Règles (en plus de celles des maisons : destination nommée, jamais de voiture ni d'aéroport, jamais « 15 min », deux
 * ancres de transport — Léman Express et tram 17) :
 *  - les MINUTES, jamais les mètres ni les kilomètres (décision n° 27 : deux distances courtes, l'étage et l'orientation
 *    situeraient l'immeuble) — y compris dans le code, le dépôt étant public ;
 *  - la carte, le lien « Calculer mon trajet » et le JSON-LD partent de la gare d'Annemasse (point public, décision n° 28) :
 *    la page le dit (légende de la carte, phrase sous le lien) ;
 *  - commerces à pied : pas encore relevés — la section ne s'affiche pas (appartNearby() est vide) ;
 *  - en anglais, l'arrêt s'écrit « Tram 17 (Place Deffaugt stop) », entre parenthèses : jamais le numéro de la ligne suivi d'une
 *    virgule et du nom de l'arrêt (la garde des adresses du Lot 8 y lirait un « numéro + place ») ;
 *  - L'Appart reste HORS des agrégats de la marque (TRANSIT, « 16 à 17 min selon la maison », « 20 min de Genève-Eaux-Vives »).
 *
 * Nombres : APPART.transit (src/data/appart.ts) et ANNEMASSE_TRAIN_MIN (temps de train, communs aux deux gammes). Zone et point
 * public : APPART_PLACE (src/lib/structuredData.ts). Module pur : zéro React, chaînes plates, aucune date calculée.
 */
import { APPART } from "./appart";
import { ANNEMASSE_TRAIN_MIN, aOrAn } from "./stats";
import { APPART_PLACE, publicGeo } from "../lib/structuredData";

export type AppartLocLang = "fr" | "en";

/** Incrémenter à chaque changement de texte ou de valeur (porté par data-house-location-version sur la page de L'Appart). */
export const APPART_LOCATION_VERSION = "2026-11-13";

const T = APPART.transit;
const TRAIN = ANNEMASSE_TRAIN_MIN;
/** « 5th » : ordinal anglais (étage). */
const ordinalEn = (n: number): string => {
  const t = n % 100;
  if (t >= 11 && t <= 13) return `${n}th`;
  return `${n}${({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th"}`;
};

/** Titres de la section « Localisation » de la page. */
export function appartLocationHeadings(lang: AppartLocLang): { title: string; neighbourhood: string } {
  return lang === "en"
    ? { title: `Location: ${APPART.name} in ${APPART.commune}`, neighbourhood: "Neighbourhood" }
    : { title: `Localisation : ${APPART.name} à ${APPART.commune}`, neighbourhood: "Quartier" };
}

/** Phrase de quartier (exactement une fois sur la page, garde des pages de lieu). Aucun commerce : le relevé à pied n'est pas fait. */
export function appartNeighbourhood(lang: AppartLocLang): string {
  const f = APPART.flat.floor;
  return lang === "en"
    ? `The station district of ${APPART.commune}: the Léman Express ${aOrAn(T.stationWalkMin)} ${T.stationWalkMin}-minute walk away, tram 17 ${aOrAn(T.tramStop.walkMin)} ${T.tramStop.walkMin}-minute walk away. ${APPART.name} is on the ${ordinalEn(f)} and top floor with a lift, south-facing, with an open view of the Salève.`
    : `Le quartier de la gare d'${APPART.commune} : le Léman Express à ${T.stationWalkMin} min à pied, le tram 17 à ${T.tramStop.walkMin} min. ${APPART.name} est au ${f}e et dernier étage avec ascenseur, plein sud, avec une vue dégagée sur le Salève.`;
}

/** Zone publiée à la place de l'adresse : « Annemasse (74100), quartier de la gare ». */
export function appartZone(lang: AppartLocLang): string {
  return APPART_PLACE.zone[lang];
}

/** Phrase sous la zone : l'adresse exacte, avant la signature du bail (aucune visite n'est promise tant que la question n° 35
 *  n'est pas tranchée — la note des maisons parle d'un rendez-vous de visite). */
export function appartExactAddressNote(lang: AppartLocLang): string {
  return lang === "en"
    ? "We share the exact address before you sign the lease."
    : "L'adresse exacte t'est communiquée avant la signature du bail.";
}

/** Légende de la carte, centrée sur la gare (point public). */
export function appartMapLegend(lang: AppartLocLang): string {
  return lang === "en"
    ? `The map is centred on ${APPART.commune} station, ${aOrAn(T.stationWalkMin)} ${T.stationWalkMin}-minute walk from ${APPART.name}.`
    : `La carte est centrée sur la gare d'${APPART.commune}, à ${T.stationWalkMin} min à pied de ${APPART.name}.`;
}

/** Ligne courte de trajet (en tête de page, fiche « l'essentiel », fiche de la marque) : la gare d'abord (décision n° 25),
 *  deux segments « a · b ». Minuscule au début : la garde la cherche au caractère près. */
export function appartCommuteLine(lang: AppartLocLang): string {
  return lang === "en"
    ? `${APPART.commune} station ${T.stationWalkMin} min on foot, tram 17 stop ${T.tramStop.walkMin} min · Geneva Eaux-Vives in ${T.eauxVivesDoorToDoorMin} min door-to-door`
    : `gare d'${APPART.commune} à ${T.stationWalkMin} min à pied, tram 17 à ${T.tramStop.walkMin} min · Genève-Eaux-Vives en ${T.eauxVivesDoorToDoorMin} min porte-à-porte`;
}

/** Ligne longue (même gabarit que celle du Lodge, sans distance). */
export function appartCommuteLong(lang: AppartLocLang): string {
  return lang === "en"
    ? `${APPART.commune} station is ${aOrAn(T.stationWalkMin)} ${T.stationWalkMin}-minute walk. Direct Léman Express trains: Geneva Eaux-Vives in ${TRAIN.eauxVives} minutes, Champel in ${TRAIN.champel}, Cornavin in ${TRAIN.cornavin} — ${T.eauxVivesDoorToDoorMin} minutes door to door to Eaux-Vives, ${T.riveDoorToDoorMin} minutes to the city centre (Rive). Tram 17 is ${aOrAn(T.tramStop.walkMin)} ${T.tramStop.walkMin}-minute walk (${T.tramStop.name} stop). By bike: central Geneva (Rive) in ${T.bikeToRiveMin} minutes on the Voie Verte.`
    : `Gare d'${APPART.commune} à ${T.stationWalkMin} min à pied. Léman Express direct : Genève-Eaux-Vives en ${TRAIN.eauxVives} min, Champel en ${TRAIN.champel} min, Cornavin en ${TRAIN.cornavin} min — ${T.eauxVivesDoorToDoorMin} min porte-à-porte jusqu'aux Eaux-Vives, ${T.riveDoorToDoorMin} min jusqu'au centre (Rive). Tram 17 à ${T.tramStop.walkMin} min à pied (arrêt ${T.tramStop.name}). Vélo : centre de Genève (Rive) en ${T.bikeToRiveMin} min par la Voie Verte.`;
}

/** Une ligne du tableau des trajets : mode, destination, temps (même forme que houseCommuteRows). */
export interface AppartCommuteRow {
  mode: string;
  destination: string;
  value: string;
}

/** Tableau « Trajets depuis L'Appart » : à pied, Léman Express, transports, tram 17, vélo — minutes seulement. */
export function appartCommuteRows(lang: AppartLocLang): AppartCommuteRow[] {
  const en = lang === "en";
  return [
    { mode: en ? "On foot" : "À pied", destination: en ? `${APPART.commune} station` : `Gare d'${APPART.commune}`, value: `${T.stationWalkMin} min` },
    { mode: en ? "On foot" : "À pied", destination: en ? `Tram 17 (${T.tramStop.name} stop)` : `Tram 17, arrêt ${T.tramStop.name}`, value: `${T.tramStop.walkMin} min` },
    { mode: "Léman Express", destination: en ? "Geneva Eaux-Vives" : "Genève-Eaux-Vives", value: en ? `${TRAIN.eauxVives} min by train · ${T.eauxVivesDoorToDoorMin} min door to door` : `${TRAIN.eauxVives} min de train · ${T.eauxVivesDoorToDoorMin} min porte-à-porte` },
    { mode: "Léman Express", destination: en ? "Geneva Champel" : "Genève-Champel", value: en ? `${TRAIN.champel} min by train` : `${TRAIN.champel} min de train` },
    { mode: "Léman Express", destination: en ? "Geneva Cornavin" : "Genève Cornavin", value: en ? `${TRAIN.cornavin} min by train · ${T.cornavinDoorToDoorMin} min door to door` : `${TRAIN.cornavin} min de train · ${T.cornavinDoorToDoorMin} min porte-à-porte` },
    { mode: en ? "Public transport" : "Transports", destination: en ? "City centre (Rive)" : "Centre de Genève (Rive)", value: en ? `${T.riveDoorToDoorMin} min door to door` : `${T.riveDoorToDoorMin} min porte-à-porte` },
    { mode: "Tram 17", destination: en ? "Rive (city centre)" : "Rive (centre de Genève)", value: en ? `${T.tramStop.tramToRiveMin} min by tram, no change` : `${T.tramStop.tramToRiveMin} min de tram, sans changement` },
    { mode: en ? "Bike (Voie Verte)" : "Vélo (Voie Verte)", destination: en ? "City centre (Rive)" : "Centre de Genève (Rive)", value: `${T.bikeToRiveMin} min` },
  ];
}

/** Note de méthode sous le tableau (relevé du 12/11/2026) : dit ce que « porte-à-porte » contient (décision n° 26). */
export function appartCommuteNote(lang: AppartLocLang): string {
  return lang === "en"
    ? `Google Maps measurements of ${T.measuredOnLabel.en} and our team's, on foot; public transport on a Monday at 8 am. Door to door: the walk to the station, then the train to the arrival platform.`
    : `Mesures Google Maps du ${T.measuredOnLabel.fr} et de notre équipe, à pied ; transports un lundi à 8 h. Porte-à-porte : la marche jusqu'à la gare, puis le train jusqu'au quai d'arrivée.`;
}

/** Lien « Calculer mon trajet » : itinéraire Google Maps en transports, de la gare d'Annemasse (point public) à Genève-Eaux-Vives. */
export function appartDirectionsUrl(lang: AppartLocLang): string {
  const g = publicGeo(APPART_PLACE);
  const origin = encodeURIComponent(`${g.lat},${g.lng}`);
  const destination = encodeURIComponent(lang === "en" ? "Genève-Eaux-Vives station" : "Gare de Genève-Eaux-Vives");
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=transit`;
}

/** Phrase sous le lien « Calculer mon trajet » : d'où part le calcul. */
export function appartDirectionsStart(lang: AppartLocLang): string {
  return lang === "en"
    ? `The route starts from ${APPART.commune} station, ${aOrAn(T.stationWalkMin)} ${T.stationWalkMin}-minute walk from ${APPART.name}.`
    : `Le calcul part de la gare d'${APPART.commune}, à ${T.stationWalkMin} min à pied de ${APPART.name}.`;
}

/**
 * Contenu du tableau « Trajets depuis L'Appart » : `<HouseCommuteTable slug="lappart" content={appartCommuteTable} />`. La page de
 * L'Appart le fournit au composant : les pages des maisons, qui montent le même composant, n'embarquent ainsi aucun texte de L'Appart.
 */
export function appartCommuteTable(lang: AppartLocLang): { rows: AppartCommuteRow[]; note: string; directionsUrl: string; directionsStart: string } {
  return { rows: appartCommuteRows(lang), note: appartCommuteNote(lang), directionsUrl: appartDirectionsUrl(lang), directionsStart: appartDirectionsStart(lang) };
}

/** Commerces et services à pied : pas encore relevés (adresse et navigateur nécessaires) — vide, la section ne s'affiche pas. */
export function appartNearby(): string[] {
  return [];
}

/** Toutes les chaînes d'emplacement de L'Appart (gardes : présence et hygiène). */
export function appartLocationStrings(lang: AppartLocLang): string[] {
  const h = appartLocationHeadings(lang);
  return [
    h.title,
    h.neighbourhood,
    appartNeighbourhood(lang),
    appartZone(lang),
    appartExactAddressNote(lang),
    appartMapLegend(lang),
    appartCommuteLine(lang),
    appartCommuteLong(lang),
    ...appartNearby(),
    ...appartCommuteRows(lang).map((r) => `${r.mode} — ${r.destination} : ${r.value}`),
    appartCommuteNote(lang),
    appartDirectionsStart(lang),
  ];
}

/** Article anglais faux devant une durée (« a 8-minute », « an 5-minute ») ou « 1 minutes » — même règle que les maisons. */
const EN_ARTICLE_ISSUE = /\ba (?:8|11|18|8\d)-minute\b|\ban (?:[1-79]|1[02-79]|[2-79]\d)-minute\b|\b1 minutes\b/;

/** Incohérences détectables sans base : voiture, aéroport, « 15 min », mètres, numéro de ligne, arrêt mal écrit, parité FR/EN. */
export function appartLocationIssues(): string[] {
  const issues: string[] = [];
  const fr = appartLocationStrings("fr"), en = appartLocationStrings("en");
  if (fr.length !== en.length) issues.push(`${fr.length} chaînes FR ≠ ${en.length} EN`);
  for (const [lang, strings] of [["fr", fr], ["en", en]] as const) {
    for (const s of strings) {
      const at = `${lang} : « ${s.slice(0, 60)}… »`;
      if (/\bvoiture\b|\bby car\b|\bdriving\b|a[ée]roport|airport/i.test(s)) issues.push(`promesse en voiture ou aéroport — ${at}`);
      if (/(?<![\d,.])15 ?min/i.test(s)) issues.push(`« 15 min » — ${at}`);
      if (/\b\d+(?:[.,]\d+)?\s?k?m(?![²\w])/.test(s)) issues.push(`distance en mètres ou en kilomètres (décision 27 : les minutes seulement) — ${at}`);
      if (/mitoyen|adjoin|\bTPN\b|ligne \d|line \d|\bbus \d/i.test(s)) issues.push(`formulation interdite (D6/D7) — ${at}`);
      if (/\btram \d+,\s*(?:place|rue|avenue)\b/i.test(s)) issues.push(`ligne de tram suivie d'une virgule et d'une voie (garde des adresses : écrire « Tram 17 (… stop) ») — ${at}`);
      if (/\[FAIT À CONFIRMER|\{\{|undefined|NaN/.test(s)) issues.push(`placeholder — ${at}`);
      if (EN_ARTICLE_ISSUE.test(s)) issues.push(`article ou pluriel anglais faux — ${at}`);
    }
  }
  return issues;
}
