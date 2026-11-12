/**
 * Emplacement, quartier et trajets par maison — SOURCE UNIQUE (Lot L2 « Emplacement et transport »,
 * brief « Ingénierie des créneaux » v3.1 du 09/10/2026, décisions D1, D2, D6, D7 de Jérôme + mise à jour n° 1 du 09/10 14 h).
 *
 * Pourquoi : la recon L0.2a (09/10/2026) a trouvé tous les faits d'emplacement écrits en dur dans le code, avec des
 * valeurs contradictoires entre pages (« gare à 10 / 9 / moins de 10 min », « tram à 1 min », « 15 min en voiture »,
 * « frontière mitoyenne » contre « Moillesulaz à 2 km », « TPN ligne 61 »…). Tout fait d'emplacement se lit ICI ;
 * les nombres viennent de TRANSIT / HOUSE_SURFACES (src/data/stats.ts, maître numérique) et les adresses de HOUSES
 * (src/lib/structuredData.ts). Les pages maisons, les cartes, les FAQ et les scripts (llms, gardes) consomment ces
 * fonctions ; aucune minute, distance ou surface d'emplacement ne s'écrit ailleurs.
 *
 * Règles (ne pas rediscuter) :
 *  - D1, méthode trajet : la destination est toujours nommée (Genève-Eaux-Vives par défaut ; Champel, Cornavin, le
 *    centre (Rive) quand on les cite) ; mode par défaut Léman Express, tram 17 pour Le Loft ; deux nombres, toujours :
 *    le temps de train (fixe) puis le porte-à-porte de la maison (depuis le 12/11/2026 : temps à pied de l'équipe + part
 *    transport du relevé Google Maps d'un lundi à 8 h, attente comprise) ;
 *    JAMAIS de promesse en voiture (ni d'aéroport en voiture) ; vélo en bonus mesuré (Voie Verte) ; « 15 min » n'existe plus.
 *  - D6 : phrases de quartier A.2 ; le Foron (rivière-frontière) borde La Villa — jamais « mitoyenne » / « adjoins ».
 *  - D7 : aucun numéro de ligne de bus ; un arrêt se décrit « arrêt de bus X à N min à pied ». Deux ancres : Léman Express, tram 17.
 *  - (12/11/2026, décision Jérôme) Gare à pied : La Villa 9 min (700 m), Le Loft 9 min (700 m), Le Lodge 8 min (900 m) ;
 *    E.Leclerc de La Villa 9 min (700 m) ; tram 17 du Lodge = arrêt Barbusse, place de l'Étoile, 2 min (150 m) depuis le
 *    prolongement du 17/10/2026 ; arrêt de bus du Lodge retiré. Détail et porte-à-porte recalculés : commentaire de TRANSIT.
 *  - (12/11/2026, décision Jérôme, lot « borne basse ») Relevé en fourchette : toujours la borne basse, pour toutes les maisons
 *    (Le Lodge : Rive 25 min, Cornavin 32 min). L'arrondi au 5 supérieur ne vaut que pour les agrégats de marque
 *    (TRANSIT.centreDoorToDoorMin, « 25 min jusqu'au centre »).
 *  - Mesures : Releves_Trajets_GoogleMaps_2026-10-08.md (brief §1.3) — TRANSIT.measuredOn ; remesure à chaque changement
 *    d'horaire (décembre) ou au plus tard tous les 12 mois.
 *  - Imports RELATIFS, zéro React, chaînes plates (anti-#418), nombres ≥ 1 000 via thousands(), aucune date calculée.
 */
import { STATS, TRANSIT, HOUSE_SURFACES, thousands, aOrAn } from "./stats";
import { HOUSES, publicGeo } from "../lib/structuredData";

export type HouseSlug = keyof typeof TRANSIT.byHouse;
export type LocLang = "fr" | "en";

/** Incrémenter à chaque changement de texte ou de valeur (porté par data-house-location-version sur les pages maisons) :
 *  date AAAA-MM-JJ, suffixe b, c… pour un second changement le même jour (12/11/2026, « b » = lot « borne basse » :
 *  Le Lodge à 25 min de Rive et 32 min de Cornavin). */
export const HOUSE_LOCATION_VERSION = "2026-11-12b";

export const HOUSE_SLUGS: readonly HouseSlug[] = ["lavilla", "leloft", "lelodge"] as const;

const T = TRANSIT.byHouse;

/** Distance lisible : 750 → « 750 m », 1000 → « 1 km », 1300 → « 1,3 km » (FR) / « 1.3 km » (EN). */
export function formatDistance(meters: number, lang: LocLang): string {
  if (meters < 1000) return `${meters} m`;
  const km = meters / 1000;
  const s = Number.isInteger(km) ? String(km) : km.toFixed(1);
  return `${lang === "en" ? s : s.replace(".", ",")} km`;
}

const walkFr = (min: number, m?: number) => `${min} min à pied${m ? ` (${formatDistance(m, "fr")})` : ""}`;
const walkEn = (min: number, m?: number) => `${min}-minute walk${m ? ` (${formatDistance(m, "en")})` : ""}`;

/* ── Commerces & services à pied (brief §1.3, relevés du 08/10/2026) ───────────────────────────────────────── */

export interface NearbyPlace {
  /** Identifiant stable (phrases de quartier, tests). */
  id: string;
  fr: string;
  en: string;
  /** Minutes à pied ; absent = fait sans durée (ex. le Foron longe la rue). */
  walkMin?: number;
  distanceM?: number;
}

export const HOUSE_NEARBY: Record<HouseSlug, readonly NearbyPlace[]> = {
  lavilla: [
    { id: "supermarket", fr: "Supermarché E.Leclerc", en: "E.Leclerc supermarket", walkMin: 9, distanceM: 700 },
    { id: "townhall", fr: "Mairie de Ville-la-Grand", en: "Ville-la-Grand town hall", walkMin: 22 },
    { id: "foron", fr: "Zone naturelle du Foron, la rivière-frontière, le long de la rue", en: "The Foron nature reserve, the border river, along the street" },
  ],
  leloft: [
    { id: "townhall", fr: "Mairie d'Ambilly", en: "Ambilly town hall", walkMin: 5 },
    { id: "supermarket", fr: "Carrefour Express", en: "Carrefour Express", walkMin: 6, distanceM: 400 },
    { id: "foron", fr: "Berges du Foron", en: "Banks of the Foron", walkMin: 8, distanceM: 600 },
    { id: "park", fr: "Parc Montessuit", en: "Parc Montessuit", walkMin: 9 },
  ],
  lelodge: [
    { id: "lidl", fr: "Lidl", en: "Lidl", walkMin: 4, distanceM: 300 },
    { id: "supermarket", fr: "Carrefour Market Florissant", en: "Carrefour Market Florissant", walkMin: 5 },
    { id: "townhall", fr: "Mairie d'Annemasse", en: "Annemasse town hall", walkMin: 10, distanceM: 750 },
    { id: "centre", fr: "Centre-ville d'Annemasse (cinéma, restaurants, marché du mardi et du vendredi)", en: "Annemasse town centre (cinema, restaurants, Tuesday and Friday market)", walkMin: 10 },
  ],
};

const nearbyMin = (slug: HouseSlug, id: string): number => {
  const p = HOUSE_NEARBY[slug].find((x) => x.id === id);
  if (!p || p.walkMin === undefined) throw new Error(`houseLocation: ${slug}/${id} sans walkMin`);
  return p.walkMin;
};

/** Liste « Commerces & services à proximité » — une ligne par lieu, durée à pied quand elle est mesurée. */
export function houseNearby(slug: HouseSlug, lang: LocLang): string[] {
  return HOUSE_NEARBY[slug].map((p) => {
    const label = lang === "en" ? p.en : p.fr;
    if (p.walkMin === undefined) return label;
    // Ponctuation de la langue : « label : valeur » en FR (espace insécable avant le deux-points), « label: value » en EN.
    return lang === "en" ? `${label}: ${walkEn(p.walkMin, p.distanceM)}` : `${label} : ${walkFr(p.walkMin, p.distanceM)}`;
  });
}

/* ── Phrase de quartier (A.2, D6) ─────────────────────────────────────────────────────────────────────────── */

export function houseNeighbourhood(slug: HouseSlug, lang: LocLang): string {
  if (slug === "lavilla") {
    const plot = HOUSE_SURFACES.lavilla.plotM2;
    return lang === "en"
      ? `A quiet residential street in Ville-la-Grand, beside the Foron — the river that marks the Swiss border — and its nature reserve. A ${thousands(plot, ",")} m² garden, Annemasse station ${aOrAn(T.lavilla.stationWalkMin)} ${T.lavilla.stationWalkMin}-minute walk away, a supermarket ${nearbyMin("lavilla", "supermarket")} minutes away.`
      : `Rue résidentielle calme de Ville-la-Grand, en bordure du Foron — la rivière qui marque la frontière suisse — et de sa zone naturelle. Jardin de ${thousands(plot, " ")} m², gare d'Annemasse à ${T.lavilla.stationWalkMin} min à pied, supermarché à ${nearbyMin("lavilla", "supermarket")} min.`;
  }
  if (slug === "leloft") {
    return lang === "en"
      ? `In the centre of Ambilly, the town right on the border: town hall ${nearbyMin("leloft", "townhall")} minutes on foot, Carrefour Express ${nearbyMin("leloft", "supermarket")} minutes, tram 17 in ${T.leloft.tramWalkMin} minutes, Parc Montessuit and the banks of the Foron under 10 minutes away.`
      : `Au centre d'Ambilly, la commune collée à la frontière : mairie à ${nearbyMin("leloft", "townhall")} min à pied, Carrefour Express à ${nearbyMin("leloft", "supermarket")} min, tram 17 à ${T.leloft.tramWalkMin} min, parc Montessuit et berges du Foron à moins de 10 min.`;
  }
  const shops = Math.max(nearbyMin("lelodge", "lidl"), nearbyMin("lelodge", "supermarket"));
  return lang === "en"
    ? `The residential Romagny district of Annemasse: quiet streets of houses, Lidl and Carrefour Market ${shops} minutes on foot, the station ${T.lelodge.stationWalkMin} minutes and the town centre ${nearbyMin("lelodge", "centre")} minutes away.`
    : `Quartier résidentiel de Romagny, à Annemasse : rues calmes de maisons, Lidl et Carrefour Market à ${shops} min à pied, gare à ${T.lelodge.stationWalkMin} min, centre-ville à ${nearbyMin("lelodge", "centre")} min.`;
}

/* ── Frontière suisse (une seule formulation par maison, D6) ──────────────────────────────────────────────── */

/** Phrase « frontière » de la maison ; undefined pour Le Lodge (aucune mesure à pied/vélo : on ne promet rien). */
export function houseBorder(slug: HouseSlug, lang: LocLang): string | undefined {
  if (slug === "lavilla") {
    const b = T.lavilla.border;
    return lang === "en"
      ? `The Swiss border: the Foron, the border river, runs along the street; the Puplinge road crossing is ${aOrAn(b.puplingeWalkMin)} ${b.puplingeWalkMin}-minute walk (${formatDistance(b.puplingeDistanceM, "en")}), the Moillesulaz crossing ${formatDistance(b.moillesulazM, "en")} away (${b.moillesulazBikeMin} minutes by bike).`
      : `La frontière suisse : le Foron, la rivière-frontière, longe la rue ; passage routier de Puplinge à ${b.puplingeWalkMin} min à pied (${formatDistance(b.puplingeDistanceM, "fr")}), douane de Moillesulaz à ${formatDistance(b.moillesulazM, "fr")} (${b.moillesulazBikeMin} min à vélo).`;
  }
  if (slug === "leloft") {
    const b = T.leloft.border;
    return lang === "en"
      ? `The Swiss border (the Foron river) is ${formatDistance(b.foronDistanceM, "en")} away, ${aOrAn(b.foronWalkMin)} ${b.foronWalkMin}-minute walk; the Moillesulaz crossing is ${formatDistance(b.moillesulazM, "en")} away (a ${b.moillesulazWalkMin}-minute walk).`
      : `La frontière suisse (le Foron) est à ${formatDistance(b.foronDistanceM, "fr")}, ${b.foronWalkMin} min à pied ; la douane de Moillesulaz à ${formatDistance(b.moillesulazM, "fr")} (${b.moillesulazWalkMin} min à pied).`;
  }
  return undefined;
}

/* ── Ligne de transport canonique longue (A.1, sans voiture) ──────────────────────────────────────────────── */

export function houseCommuteLong(slug: HouseSlug, lang: LocLang): string {
  const tr = TRANSIT;
  if (slug === "leloft") {
    const h = T.leloft;
    // (09/10/2026) Règle D1.3 sur la phrase gare aussi : temps de train fixe + porte-à-porte, deux nombres.
    return lang === "en"
      ? `Tram 17 is ${aOrAn(h.tramWalkMin)} ${h.tramWalkMin}-minute walk (${h.tramStop.name} stop, ${formatDistance(h.tramStop.distanceM, "en")}): Rive in ${h.tramStop.tramToRiveMin} minutes by tram, ${h.riveDoorToDoorMin} minutes door to door. Annemasse station is ${aOrAn(h.stationWalkMin)} ${h.stationWalkMin}-minute walk (${formatDistance(h.stationDistanceM, "en")}): Geneva Eaux-Vives in ${tr.trainEauxVivesMin} minutes by Léman Express, ${h.eauxVivesDoorToDoorMin} minutes door to door. By bike: central Geneva (Rive) in ${h.bikeToRiveMin} minutes on the Voie Verte.`
      : `Tram 17 à ${h.tramWalkMin} min à pied (arrêt ${h.tramStop.name}, ${formatDistance(h.tramStop.distanceM, "fr")}) : Rive en ${h.tramStop.tramToRiveMin} min de tram, ${h.riveDoorToDoorMin} min porte-à-porte. Gare d'Annemasse à ${h.stationWalkMin} min à pied (${formatDistance(h.stationDistanceM, "fr")}) : Genève-Eaux-Vives en ${tr.trainEauxVivesMin} min de Léman Express, ${h.eauxVivesDoorToDoorMin} min porte-à-porte. Vélo : centre de Genève (Rive) en ${h.bikeToRiveMin} min par la Voie Verte.`;
  }
  const h = T[slug];
  // (12/11/2026) Le Lodge : tram 17 depuis le prolongement du 17/10/2026 (arrêt Barbusse, place de l'Étoile) ; plus d'arrêt de bus.
  const ts = T.lelodge.tramStop;
  const extraFr = slug === "lelodge" ? ` Tram 17 à ${ts.walkMin} min à pied (arrêt ${ts.name}, ${ts.place.fr}, ${formatDistance(ts.distanceM, "fr")}).` : "";
  const extraEn = slug === "lelodge" ? ` Tram 17 is ${aOrAn(ts.walkMin)} ${ts.walkMin}-minute walk (${ts.name} stop, ${ts.place.en}, ${formatDistance(ts.distanceM, "en")}).` : "";
  return lang === "en"
    ? `Annemasse station is ${aOrAn(h.stationWalkMin)} ${h.stationWalkMin}-minute walk (${formatDistance(h.stationDistanceM, "en")}). Direct Léman Express trains: Geneva Eaux-Vives in ${tr.trainEauxVivesMin} minutes, Champel in ${tr.trainChampelMin}, Cornavin in ${tr.trainCornavinMin} — ${h.eauxVivesDoorToDoorMin} minutes door to door to Eaux-Vives, ${h.riveDoorToDoorMin} minutes to the city centre (Rive).${extraEn} By bike: central Geneva (Rive) in ${h.bikeToRiveMin} minutes on the Voie Verte.`
    : `Gare d'Annemasse à ${h.stationWalkMin} min à pied (${formatDistance(h.stationDistanceM, "fr")}). Léman Express direct : Genève-Eaux-Vives en ${tr.trainEauxVivesMin} min, Champel en ${tr.trainChampelMin} min, Cornavin en ${tr.trainCornavinMin} min — ${h.eauxVivesDoorToDoorMin} min porte-à-porte jusqu'aux Eaux-Vives, ${h.riveDoorToDoorMin} min jusqu'au centre (Rive).${extraFr} Vélo : centre de Genève (Rive) en ${h.bikeToRiveMin} min par la Voie Verte.`;
}

/* ── Tableau commun « à pied / en train / à vélo » (question §8.2 du brief : tableau commun, décision Jérôme) ── */

export interface CommuteRow {
  /** Mode : « À pied », « Léman Express », « Tram 17 », « Vélo (Voie Verte) », « Transports ». */
  mode: string;
  destination: string;
  value: string;
}

export function houseCommuteRows(slug: HouseSlug, lang: LocLang): CommuteRow[] {
  const en = lang === "en";
  const tr = TRANSIT;
  const h = T[slug];
  const rows: CommuteRow[] = [];
  rows.push({
    mode: en ? "On foot" : "À pied",
    destination: en ? "Annemasse station" : "Gare d'Annemasse",
    value: en ? `${h.stationWalkMin} min (${formatDistance(h.stationDistanceM, "en")})` : `${h.stationWalkMin} min (${formatDistance(h.stationDistanceM, "fr")})`,
  });
  if (slug === "leloft") {
    const s = T.leloft.tramStop;
    rows.push({ mode: en ? "On foot" : "À pied", destination: en ? `Tram 17, ${s.name} stop` : `Tram 17, arrêt ${s.name}`, value: `${s.walkMin} min (${formatDistance(s.distanceM, lang)})` });
  }
  if (slug === "lelodge") {
    // (12/11/2026, décision Jérôme) Arrêt Barbusse, place de l'Étoile (tram 17 prolongé le 17/10/2026) ; ligne de bus retirée.
    const s = T.lelodge.tramStop;
    rows.push({ mode: en ? "On foot" : "À pied", destination: en ? `Tram 17, ${s.name} stop, ${s.place.en}` : `Tram 17, arrêt ${s.name}, ${s.place.fr}`, value: `${s.walkMin} min (${formatDistance(s.distanceM, lang)})` });
  }
  if (slug === "lavilla") {
    const b = T.lavilla.busStop;
    rows.push({ mode: en ? "On foot" : "À pied", destination: en ? `${b.name} bus stop` : `Arrêt de bus ${b.name}`, value: `${b.walkMin} min (${formatDistance(b.distanceM, lang)})` });
  }
  rows.push({
    mode: "Léman Express",
    destination: en ? "Geneva Eaux-Vives" : "Genève-Eaux-Vives",
    value: en ? `${tr.trainEauxVivesMin} min by train · ${h.eauxVivesDoorToDoorMin} min door to door` : `${tr.trainEauxVivesMin} min de train · ${h.eauxVivesDoorToDoorMin} min porte-à-porte`,
  });
  rows.push({
    mode: "Léman Express",
    destination: en ? "Geneva Champel" : "Genève-Champel",
    value: en ? `${tr.trainChampelMin} min by train` : `${tr.trainChampelMin} min de train`,
  });
  rows.push({
    mode: "Léman Express",
    destination: en ? "Geneva Cornavin" : "Genève Cornavin",
    value: en ? `${tr.trainCornavinMin} min by train · ${h.cornavinDoorToDoorMin} min door to door` : `${tr.trainCornavinMin} min de train · ${h.cornavinDoorToDoorMin} min porte-à-porte`,
  });
  if (slug === "leloft") {
    const s = T.leloft.tramStop;
    rows.push({ mode: "Tram 17", destination: en ? "Rive (city centre)" : "Rive (centre de Genève)", value: en ? `${s.tramToRiveMin} min by tram · ${h.riveDoorToDoorMin} min door to door` : `${s.tramToRiveMin} min de tram · ${h.riveDoorToDoorMin} min porte-à-porte` });
  } else {
    rows.push({ mode: en ? "Public transport" : "Transports", destination: en ? "City centre (Rive)" : "Centre de Genève (Rive)", value: en ? `${h.riveDoorToDoorMin} min door to door` : `${h.riveDoorToDoorMin} min porte-à-porte` });
  }
  rows.push({
    mode: en ? "Bike (Voie Verte)" : "Vélo (Voie Verte)",
    destination: en ? "City centre (Rive)" : "Centre de Genève (Rive)",
    value: `${h.bikeToRiveMin} min (${formatDistance(Math.round(h.bikeToRiveKm * 1000), lang)})`,
  });
  return rows;
}

/** Note de méthode affichée sous le tableau (D1.3 : « on laisse vérifier »). */
export function houseCommuteNote(lang: LocLang): string {
  return lang === "en"
    ? `Google Maps measurements of ${TRANSIT.measuredOnLabel.en} and our team's (${TRANSIT.walkCheckedOnLabel.en}), on foot; public transport on a Monday at 8 am, walking and waiting included.`
    : `Mesures Google Maps du ${TRANSIT.measuredOnLabel.fr} et de notre équipe (${TRANSIT.walkCheckedOnLabel.fr}), à pied ; transports un lundi à 8 h, marche et attente comprises.`;
}

/**
 * Lien « Calculer mon trajet » : itinéraire Google Maps en transports vers Genève-Eaux-Vives (D1.5). (12/10/2026, sécurité)
 * L'origine est le point PUBLIC arrondi de la maison (publicGeo, ≈ 500 m), plus jamais son adresse.
 */
export function houseDirectionsUrl(slug: HouseSlug, lang: LocLang): string {
  const h = HOUSES.find((x) => x.slug === slug);
  if (!h) throw new Error(`houseLocation: adresse inconnue pour ${slug}`);
  const g = publicGeo(h);
  const origin = encodeURIComponent(`${g.lat},${g.lng}`);
  const destination = encodeURIComponent(lang === "en" ? "Genève-Eaux-Vives station" : "Gare de Genève-Eaux-Vives");
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=transit`;
}

export function houseDirectionsLabel(lang: LocLang): string {
  return lang === "en" ? "Check my commute" : "Calculer mon trajet";
}

/* ── Zone affichée (12/10/2026, sécurité) : plus jamais l'adresse ─────────────────────────────────────────── */

/** Zone publiée à la place de l'adresse : « Annemasse (74100), quartier de Romagny ». */
export function houseZone(slug: HouseSlug, lang: LocLang): string {
  const h = HOUSES.find((x) => x.slug === slug);
  if (!h) throw new Error(`houseLocation: zone inconnue pour ${slug}`);
  return h.zone[lang];
}

/** Phrase sous la zone : l'adresse exacte n'est donnée qu'au rendez-vous de visite. */
export function houseExactAddressNote(lang: LocLang): string {
  return lang === "en"
    ? "We share the exact address when you book a visit."
    : "L'adresse exacte t'est communiquée à la prise de rendez-vous de visite.";
}

/** INTERNE — adresse postale complète (gardes, annuaires). JAMAIS rendue sur le site : la garde house-pages-check l'interdit. */
export function houseAddressLine(slug: HouseSlug): string {
  const h = HOUSES.find((x) => x.slug === slug);
  if (!h) throw new Error(`houseLocation: adresse inconnue pour ${slug}`);
  return `${h.streetAddress}, ${h.postalCode} ${h.addressLocality}`;
}

/* ── Gardes ───────────────────────────────────────────────────────────────────────────────────────────────── */

/** Toutes les chaînes rendues d'une maison (les gardes vérifient leur présence et leur hygiène). */
export function houseLocationStrings(slug: HouseSlug, lang: LocLang): string[] {
  const border = houseBorder(slug, lang);
  return [
    houseNeighbourhood(slug, lang),
    houseZone(slug, lang),
    houseExactAddressNote(lang),
    houseCommuteLong(slug, lang),
    ...(border ? [border] : []),
    ...houseNearby(slug, lang),
    ...houseCommuteRows(slug, lang).map((r) => `${r.mode} — ${r.destination} : ${r.value}`),
    houseCommuteNote(lang),
  ];
}

/** (12/11/2026) Article anglais faux devant une durée (« a 8-minute », « an 9-minute ») ou « 1 minutes ». « an 11 / 18 / 8x » sont justes. */
export const EN_ARTICLE_ISSUE_RE = /\ba (?:8|11|18|8\d)-minute\b|\ban (?:[1-79]|1[02-79]|[2-79]\d)-minute\b|\b1 minutes\b/;

/** Incohérences détectables sans base : promesse en voiture, « 15 min », placeholder, parité FR/EN. */
export function houseLocationIssues(): string[] {
  const issues: string[] = [];
  for (const slug of HOUSE_SLUGS) {
    const fr = houseLocationStrings(slug, "fr"), en = houseLocationStrings(slug, "en");
    if (fr.length !== en.length) issues.push(`${slug} : ${fr.length} chaînes FR ≠ ${en.length} EN`);
    for (const [lang, strings] of [["fr", fr], ["en", en]] as const) {
      for (const s of strings) {
        if (/\bvoiture\b|\bby car\b|\bdriving\b|a[ée]roport|airport/i.test(s)) issues.push(`${slug}/${lang} : promesse en voiture ou aéroport — « ${s.slice(0, 60)}… »`);
        if (/(?<![\d,.])15 ?min/i.test(s)) issues.push(`${slug}/${lang} : « 15 min » — « ${s.slice(0, 60)}… »`);
        if (/mitoyen|adjoin|\bTPN\b|ligne \d|line \d|\bbus \d/i.test(s)) issues.push(`${slug}/${lang} : formulation interdite (D6/D7) — « ${s.slice(0, 60)}… »`);
        if (/\[FAIT À CONFIRMER|\{\{|undefined|NaN/.test(s)) issues.push(`${slug}/${lang} : placeholder — « ${s.slice(0, 60)}… »`);
        if (EN_ARTICLE_ISSUE_RE.test(s)) issues.push(`${slug}/${lang} : article ou pluriel anglais faux — « ${s.slice(0, 60)}… »`);
      }
    }
  }
  // (12/11/2026) Agrégats saisis à la main dans TRANSIT : ils doivent suivre byHouse (un 18/24 oublié passait sans bruit).
  const range = (pick: (h: (typeof T)[HouseSlug]) => number): [number, number] => {
    const v = HOUSE_SLUGS.map((s) => pick(T[s]));
    return [Math.min(...v), Math.max(...v)];
  };
  const ceil5 = (n: number) => Math.ceil(n / 5) * 5;
  const [evMin, evMax] = range((h) => h.eauxVivesDoorToDoorMin);
  if (TRANSIT.doorToDoorEauxVivesMin !== evMin || TRANSIT.doorToDoorEauxVivesMax !== evMax) issues.push(`TRANSIT.doorToDoorEauxVives ${TRANSIT.doorToDoorEauxVivesMin}-${TRANSIT.doorToDoorEauxVivesMax} ≠ maisons ${evMin}-${evMax}`);
  const [rvMin, rvMax] = range((h) => h.riveDoorToDoorMin);
  if (TRANSIT.riveDoorToDoorMin !== rvMin || TRANSIT.riveDoorToDoorMax !== rvMax) issues.push(`TRANSIT.riveDoorToDoor ${TRANSIT.riveDoorToDoorMin}-${TRANSIT.riveDoorToDoorMax} ≠ maisons ${rvMin}-${rvMax}`);
  if (TRANSIT.centreDoorToDoorMin !== ceil5(rvMin)) issues.push(`TRANSIT.centreDoorToDoorMin ${TRANSIT.centreDoorToDoorMin} ≠ ${ceil5(rvMin)} (D1.4 : 5 supérieur de ${rvMin})`);
  // Marque D1.4 : 5 supérieur du meilleur porte-à-porte Eaux-Vives, jamais 15 (« 15 min » n'existe plus), jamais vers le bas.
  const brand = Math.max(20, ceil5(evMin));
  if (STATS.genevaCenterMinutes !== brand) issues.push(`STATS.genevaCenterMinutes ${STATS.genevaCenterMinutes} ≠ ${brand} (D1.4)`);
  return issues;
}
