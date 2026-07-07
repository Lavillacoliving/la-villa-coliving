// Baromètre du logement frontalier — données FIRST-PARTY La Villa (agrégées, anonymisées).
// Chiffres fournis par Jérôme (juillet 2026). Périmètre : 3 maisons, 29 chambres,
// 100+ résidents depuis octobre 2021 (STATS = source unique pour rooms/année/occupation).
// MAJ annuelle prévue à chaque édition du Baromètre.
//
// ⚠️ Règles d'affichage (verrouillées) :
//  - 1 360 = médiane ACTUELLE 2026 des loyers en cours (PAS une médiane historique),
//    toujours étiquetée ainsi, JAMAIS juxtaposée au prix d'appel « dès 1 380 ».
//  - Ne JAMAIS écrire « moins cher que Genève » (l'angle honnête = tout-inclus / m²).
//  - Caution = 2 mois (ne jamais écrire « 0 caution » ; le « 0 frais » = frais d'agence).
//  - Durée de séjour publiée = « moyenne : 13 mois » (aucune autre variante en public).

import { STATS } from "@/data/stats";

export const BAROMETRE = {
  // Le coût — la money-stat
  rentMedianChf: "1 360", // médiane actuelle 2026 des loyers en cours, tout inclus, facturés en CHF
  m2PerResident: 38, // ≈ agrégé : surface habitable ÷ nb de résidents
  m2PerHouse: { lavilla: "37", lelodge: "37,5", leloft: "41,5" },
  chfPerM2AllIn: 36, // ≈ 1 360 / 38
  // La signature
  tenureAvgMonths: 13, // moyenne
  // La tension
  occupancyPct: STATS.occupancyRate, // 99 affiché ; méthodo : « 98-99 % selon les périodes »
  applicationsPerMonth: "30-45",
  // Le profil
  frontaliersPct: 100,
  ageRange: "22-48",
  ageDominant: "25-35",
  singlesPct: 80,
  couplesPct: 20,
  // L'échantillon
  residentsCovered: `${STATS.totalResidents}+`,
  roomsCount: STATS.totalRooms,
  housesCount: STATS.totalHouses,
  roomSizeMin: STATS.roomSizeMin, // 17 m² — sert à expliquer la méthode du m²/résident
  roomSizeMax: STATS.roomSizeMax, // 23 m²
} as const;

// Tableau « coût complet » — studio nu 30 m² à Annemasse (hypothèses AFFICHÉES sur la page).
// Loyer d'annonce = donnée observatoire (Le Figaro, juin 2026). Le reste = hypothèses posées :
// charges courantes, électricité + internet, meubles amortis sur 24 mois, frais d'agence
// au plafond légal (loi Alur, zone tendue : 15 €/m² part locataire) amortis sur 24 mois.
export const STUDIO_FULL_COST = {
  rentEur: 990,
  chargesEur: 120,
  energyInternetEur: 90,
  furnitureTotalEur: 3000,
  furnitureMonths: 24,
  furnitureMonthlyEur: 125,
  agencyTotalEur: 450, // 15 €/m² × 30 m²
  agencyMonthlyEur: 19,
  totalMonthlyEur: 1344,
  perM2Eur: 45, // ≈ 1 344 / 30
  entryCashEur: 4400, // caution 1 mois (nu) + agence + meubles — à sortir avant d'emménager
  // Équivalents CHF au taux de l'édition (1 € = 0,92 CHF, juillet 2026 — brief correction #2 :
  // plus JAMAIS de « parité » €/CHF ; le taux utilisé est affiché sur la page).
  totalMonthlyChf: 1236, // ≈ 1 344 × 0,92
  perM2Chf: 41, // ≈ 45 × 0,92 (44,8 × 0,92 = 41,2)
} as const;
