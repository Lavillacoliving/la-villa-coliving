/**
 * Budget réel — relevé d'annonces du 23/11/2026 (brief « Page /tarifs et encadré « l'essentiel » : le budget réel » du 23/11/2026,
 * annexe C ; décisions de Jérôme du 23/11 et du 24/11/2026). SOURCE UNIQUE des chiffres de comparaison : le tableau du bloc 2 de
 * /tarifs, les phrases 5 et 6 de l'encadré « l'essentiel », les questions de comparaison de la FAQ de /tarifs et la section
 * « Budget réel » de llms.txt. Quand le relevé sera refait, on ne change QUE ce fichier (et les phrases que check:facts signale).
 *
 * Relevé : 135 annonces, classeur `Budget_Reel_LaVilla_v5_2026-11-23.xlsx` (onglets Relevé, Échelle, Hypothèses) ; valeurs en CHF
 * par mois, arrondies à la dizaine (totaux calculés avant arrondi, D20) ; conversion du site (1 430 CHF pour 1 530 €). Aucun nom
 * d'opérateur ni de plateforme n'est publié. Les écarts avec La Villa Coliving sont CALCULÉS à partir des prix du site
 * (SHARED_BATH_TIERS, HOUSES_FROM, STATS.priceChf) : ils suivent tout changement de prix sans retouche ici.
 */
import { HOUSES_FROM, HOUSE_INTERIOR_TOTAL_M2, SHARED_BATH_TIERS, STATS, thousands } from "./stats";

export type BudgetLang = "fr" | "en";

/** Date et taille du relevé. */
export const BUDGET_SURVEY = {
  date: "2026-11-23",
  monthLabel: { fr: "novembre 2026", en: "November 2026" },
  dayLabel: { fr: "23 novembre 2026", en: "23 November 2026" },
  listings: 135,
  counted: {
    genevaPrivateRooms: 47,
    genevaManagedRooms: 16,
    genevaStudios: 13,
    franceManagedFlatshares: 15,
    franceResidences: 1,
  },
} as const;

/** Genève : chambre entre particuliers, colocation gérée, studio meublé (CHF par mois). */
export const BUDGET_GENEVA = {
  privateRoom: { median: 1000, medianM2: 14, addedMin: 90, addedMax: 200, parking: 200, withoutCarMin: 1090, withoutCarMax: 1200, withCarMin: 1290, withCarMax: 1400 },
  managedFlatshare: { median: 1570, min: 1250, max: 1785, privateBathFrom: 1560, perPersonM2: 36, added: 80, parking: 200, withoutCar: 1650, withCar: 1850 },
  furnishedStudio: { median: 2100, added: 200, parking: 200, withoutCar: 2300, withCar: 2500 },
} as const;

/** Côté France : colocation gérée, studio en résidence (CHF par mois ; prix affiché aussi en euros). */
export const BUDGET_FRANCE = {
  managedFlatshare: { listed: 770, listedEur: 825, perPersonM2: 26, roomMinM2: 11, roomMaxM2: 16, added: 60, parking: 70, withoutCar: 830, withCar: 900 },
  residenceStudio: { listed: 990, listedEur: 1055, added: 160, parking: 70, withoutCar: 1150, withCar: 1210 },
} as const;

/** Ce qui s'ajoute à un loyer, poste par poste (bloc 2). */
export const BUDGET_ITEMS = {
  charges: { min: 80, max: 110 },          // CHF par mois, quand le loyer est hors charges
  internet: { min: 10, max: 22 },          // CHF par mois et par personne
  tvLicence: { min: 9, max: 14 },          // CHF par mois à deux ou trois, en Suisse
  depositGuarantee: { max: 26 },           // CHF par mois, en Suisse
  agencyFeesEur: { min: 200, max: 700 },   // € à l'entrée, côté France
  parkingGeneva: { min: 120, max: 350 },   // CHF par mois
  parkingAnnemasseEur: { min: 40, max: 155 }, // € par mois
  everyday: 40,                            // CHF par mois : lessive, produits du quotidien, linge
  streaming: 23,                           // CHF par mois : un abonnement
} as const;

/** La chambre de référence du tableau : le palier à 1 370 CHF (D2 : une seule référence dans le tableau). */
export const BUDGET_REFERENCE_ROOM_CHF: number = SHARED_BATH_TIERS[0].chf;

/** Surface intérieure moyenne par résident, toutes maisons : somme des surfaces intérieures ÷ nombre de chambres (≈ 44 m²). */
export const HOUSES_AVERAGE_M2_PER_RESIDENT: number = Math.round(
  (HOUSE_INTERIOR_TOTAL_M2.lavilla + HOUSE_INTERIOR_TOTAL_M2.leloft + HOUSE_INTERIOR_TOTAL_M2.lelodge) / STATS.totalRooms,
);

/** Écarts calculés à partir des prix du site (bloc 2 et FAQ). */
export const BUDGET_GAPS = {
  /** Chambre au « dès » (1 290 CHF) : combien de moins que la référence (80). */
  fromRoomBelowReference: BUDGET_REFERENCE_ROOM_CHF - HOUSES_FROM.chf,
  /** Chambre avec salle d'eau privative (1 430 CHF) : combien de plus que la référence (60). */
  standardRoomAboveReference: STATS.priceChf - BUDGET_REFERENCE_ROOM_CHF,
  /** Face à une colocation gérée côté France, avec une voiture (470). */
  franceManagedWithCar: BUDGET_REFERENCE_ROOM_CHF - BUDGET_FRANCE.managedFlatshare.withCar,
  /** Sans voiture, face à une chambre entre particuliers à Genève (170 à 280). */
  genevaPrivateWithoutCarMin: BUDGET_REFERENCE_ROOM_CHF - BUDGET_GENEVA.privateRoom.withoutCarMax,
  genevaPrivateWithoutCarMax: BUDGET_REFERENCE_ROOM_CHF - BUDGET_GENEVA.privateRoom.withoutCarMin,
} as const;

/** Nombres : espace insécable en français, virgule en anglais (convention de stats.ts). */
export const budgetNum = (n: number, lang: BudgetLang): string => thousands(n, lang === "en" ? "," : " ");

/** Une ligne du tableau « Ce que cela donne, par type de logement » (bloc 2). `null` = « compris » / « rien ». */
export interface BudgetTableRow {
  key: string;
  label: Record<BudgetLang, string>;
  listed: number;
  listedEur?: number;
  addedMin: number | null;
  addedMax?: number;
  parking: number | null;
  withoutCarMin: number;
  withoutCarMax?: number;
  withCarMin: number;
  withCarMax?: number;
  /** La ligne de La Villa Coliving, mise en valeur. */
  ours?: boolean;
}

export const BUDGET_TABLE: readonly BudgetTableRow[] = [
  {
    key: "lavilla",
    label: { fr: `La Villa Coliving, chambre à ${budgetNum(BUDGET_REFERENCE_ROOM_CHF, "fr")} CHF`, en: `La Villa Coliving, room at CHF ${budgetNum(BUDGET_REFERENCE_ROOM_CHF, "en")}` },
    listed: BUDGET_REFERENCE_ROOM_CHF, addedMin: null, parking: null,
    withoutCarMin: BUDGET_REFERENCE_ROOM_CHF, withCarMin: BUDGET_REFERENCE_ROOM_CHF, ours: true,
  },
  {
    key: "geneva-private",
    label: { fr: "Chambre entre particuliers à Genève", en: "Room from a private landlord in Geneva" },
    listed: BUDGET_GENEVA.privateRoom.median, addedMin: BUDGET_GENEVA.privateRoom.addedMin, addedMax: BUDGET_GENEVA.privateRoom.addedMax,
    parking: BUDGET_GENEVA.privateRoom.parking,
    withoutCarMin: BUDGET_GENEVA.privateRoom.withoutCarMin, withoutCarMax: BUDGET_GENEVA.privateRoom.withoutCarMax,
    withCarMin: BUDGET_GENEVA.privateRoom.withCarMin, withCarMax: BUDGET_GENEVA.privateRoom.withCarMax,
  },
  {
    key: "geneva-managed",
    label: { fr: "Colocation gérée à Genève", en: "Managed flatshare in Geneva" },
    listed: BUDGET_GENEVA.managedFlatshare.median, addedMin: BUDGET_GENEVA.managedFlatshare.added, parking: BUDGET_GENEVA.managedFlatshare.parking,
    withoutCarMin: BUDGET_GENEVA.managedFlatshare.withoutCar, withCarMin: BUDGET_GENEVA.managedFlatshare.withCar,
  },
  {
    key: "geneva-studio",
    label: { fr: "Studio meublé à Genève", en: "Furnished studio in Geneva" },
    listed: BUDGET_GENEVA.furnishedStudio.median, addedMin: BUDGET_GENEVA.furnishedStudio.added, parking: BUDGET_GENEVA.furnishedStudio.parking,
    withoutCarMin: BUDGET_GENEVA.furnishedStudio.withoutCar, withCarMin: BUDGET_GENEVA.furnishedStudio.withCar,
  },
  {
    key: "france-managed",
    label: { fr: "Colocation gérée côté France", en: "Managed flatshare on the French side" },
    listed: BUDGET_FRANCE.managedFlatshare.listed, listedEur: BUDGET_FRANCE.managedFlatshare.listedEur,
    addedMin: BUDGET_FRANCE.managedFlatshare.added, parking: BUDGET_FRANCE.managedFlatshare.parking,
    withoutCarMin: BUDGET_FRANCE.managedFlatshare.withoutCar, withCarMin: BUDGET_FRANCE.managedFlatshare.withCar,
  },
  {
    key: "france-studio",
    label: { fr: "Studio en résidence côté France", en: "Studio in a residence on the French side" },
    listed: BUDGET_FRANCE.residenceStudio.listed, listedEur: BUDGET_FRANCE.residenceStudio.listedEur,
    addedMin: BUDGET_FRANCE.residenceStudio.added, parking: BUDGET_FRANCE.residenceStudio.parking,
    withoutCarMin: BUDGET_FRANCE.residenceStudio.withoutCar, withCarMin: BUDGET_FRANCE.residenceStudio.withCar,
  },
];

/** Incohérences internes (vide = OK) — lues par check:facts et les tests. */
export function budgetReelIssues(): string[] {
  const out: string[] = [];
  const G = BUDGET_GAPS;
  if (HOUSES_AVERAGE_M2_PER_RESIDENT !== 44) out.push(`surface moyenne par résident ${HOUSES_AVERAGE_M2_PER_RESIDENT} m² ≠ 44 m² des textes validés`);
  if (G.fromRoomBelowReference !== 80) out.push(`écart chambre « dès » / référence ${G.fromRoomBelowReference} ≠ 80`);
  if (G.standardRoomAboveReference !== 60) out.push(`écart chambre standard / référence ${G.standardRoomAboveReference} ≠ 60`);
  if (G.franceManagedWithCar !== 470) out.push(`écart colocation gérée côté France ${G.franceManagedWithCar} ≠ 470`);
  if (G.genevaPrivateWithoutCarMin !== 170 || G.genevaPrivateWithoutCarMax !== 280) out.push(`écart sans voiture ${G.genevaPrivateWithoutCarMin}–${G.genevaPrivateWithoutCarMax} ≠ 170–280`);
  for (const r of BUDGET_TABLE) {
    if (r.withCarMin < r.withoutCarMin) out.push(`${r.key} : « avec voiture » < « sans voiture »`);
  }
  return out;
}
