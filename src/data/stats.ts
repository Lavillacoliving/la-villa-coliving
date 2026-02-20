// Source de vérité pour tous les chiffres affichés sur le site
// Modifier ici = mis à jour partout automatiquement

export const STATS = {
  totalResidents: 100,
  totalRooms: 29,
  totalHouses: 3,
  occupancyRate: 99,
  occupancyYears: 5,
  foundedYear: 2021,
  genevaCenterMinutes: 20, // arrondi de 15-25 min, porte à porte en CEVA/tram
  maxResidentsPerHouse: 12,
  minResidentsPerHouse: 7,
  priceChf: 1380,
  depositMonths: 2,
  leaseDurationMonths: 12,
  noticePeriodMonths: 1,
  roomSizeMin: 17,
  roomSizeMax: 23,
  cleaningPerWeek: 2,
  wifiBandwidth: "8 Gbps",
  includedItems: 20,
} as const;

export const STATS_DISPLAY = {
  en: {
    residents: `${STATS.totalResidents}+ residents welcomed since ${STATS.foundedYear}`,
    houses: `${STATS.totalHouses} houses`,
    distance: `${STATS.genevaCenterMinutes} min from Geneva city center`,
    roomSize: `${STATS.roomSizeMin} to ${STATS.roomSizeMax} m² rooms`,
    price: `CHF ${STATS.priceChf.toLocaleString('en')}/month — all inclusive`,
  },
  fr: {
    residents: `${STATS.totalResidents}+ résidents accueillis depuis ${STATS.foundedYear}`,
    houses: `${STATS.totalHouses} maisons`,
    distance: `${STATS.genevaCenterMinutes} min du centre de Genève`,
    roomSize: `Chambres de ${STATS.roomSizeMin} à ${STATS.roomSizeMax} m²`,
    price: `${STATS.priceChf.toLocaleString('fr-FR')} CHF/mois — tout inclus`,
  },
} as const;
