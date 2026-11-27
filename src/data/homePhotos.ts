/**
 * Photos de l'accueil (brief « Accueil : récit, avis, photos » du 27/11/2026, lot 2a, §0.2) : quinze vraies photos du dossier
 * PHOTOS de Jérôme, importées par scripts/import-home-photos.mjs (WebP sans métadonnée, recadrées au rapport de leur cadre).
 * Aucune image générée, aucune banque d'images. Dimensions = fichier publié (attributs width/height : pas de décalage).
 * Les variantes -w480/-w960 sont dans src/data/responsiveImages.ts (scripts/optimize-images.mjs).
 */
export type HomePhoto = {
  src: string;
  width: number;
  height: number;
  alt: { fr: string; en: string };
  caption?: { fr: string; en: string };
};

export const HOME_PHOTOS = {
  // n° 1 — haut de page (photo remise par Jérôme le 27/11/2026).
  hero: {
    src: "/images/accueil/hero-la-villa.webp", width: 1600, height: 900,
    alt: {
      fr: "La Villa, maison de coliving à Ville-la-Grand : la maison, le jardin et la piscine",
      en: "La Villa, coliving house in Ville-la-Grand: the house, the garden and the pool",
    },
  },
  // n° 2 à 4 — cartes maisons. n° 2 : fichier de 640 px (D18 : la version de 1280 px du dépôt est un agrandissement).
  cardLaVilla: {
    src: "/images/accueil/carte-la-villa.webp", width: 542, height: 361,
    alt: { fr: "La Villa à Ville-la-Grand : la piscine et la terrasse devant la maison", en: "La Villa in Ville-la-Grand: the pool and terrace in front of the house" },
  },
  cardLeLoft: {
    src: "/images/accueil/carte-le-loft.webp", width: 960, height: 640,
    alt: { fr: "Le Loft à Ambilly : la piscine intérieure chauffée", en: "Le Loft in Ambilly: the heated indoor pool" },
  },
  cardLeLodge: {
    src: "/images/accueil/carte-le-lodge.webp", width: 960, height: 640,
    alt: { fr: "Le Lodge à Annemasse : la piscine et la maison", en: "Le Lodge in Annemasse: the pool and the house" },
  },
  // n° 5 à 7 — récit.
  storyRoom: {
    src: "/images/accueil/recit-chambre-lodge.webp", width: 1600, height: 1000,
    alt: { fr: "Une chambre du Lodge, prête pour une arrivée", en: "A bedroom at Le Lodge, ready for a new arrival" },
  },
  storyKitchen: {
    src: "/images/accueil/recit-cuisine-loft.webp", width: 1600, height: 1000,
    alt: { fr: "La cuisine du Loft et sa grande table", en: "The kitchen and the long table at Le Loft" },
  },
  storyLiving: {
    src: "/images/accueil/recit-salon-lodge.webp", width: 1600, height: 1000,
    alt: { fr: "Le grand salon du Lodge", en: "The main living room at Le Lodge" },
  },
  // n° 8 — bande « Ce qui ne se vit qu'ici ».
  band: {
    src: "/images/accueil/bande-sauna-air-hockey-lodge.webp", width: 1600, height: 1067,
    alt: { fr: "Le sauna et le air hockey du Lodge", en: "The sauna and the air hockey table at Le Lodge" },
  },
  // n° 9 — section Avis (n'illustre aucun auteur cité).
  reviews: {
    src: "/images/accueil/avis-diner-piscine-la-villa.webp", width: 960, height: 960,
    alt: {
      fr: "Dîner entre résidents au bord de la piscine de La Villa, à la tombée du jour",
      en: "Residents having dinner by the pool at La Villa at dusk",
    },
  },
} satisfies Record<string, HomePhoto>;

/** n° 10 à 15 — rangée de vie, dans l'ordre du §0.2. Les légendes du yoga et du coaching reprennent un fait déjà en ligne. */
export const LIFE_ROW: readonly HomePhoto[] = [
  {
    src: "/images/accueil/vie-yoga-la-villa.webp", width: 960, height: 640,
    alt: { fr: "Cours de yoga dans le jardin de La Villa", en: "Yoga class in the garden at La Villa" },
    caption: { fr: "Le cours de yoga du mois", en: "The monthly yoga class" },
  },
  {
    src: "/images/accueil/vie-soiree-pizza.webp", width: 939, height: 626,
    alt: { fr: "Soirée pizza entre résidents", en: "Pizza night with residents" },
    caption: { fr: "Soirée pizza", en: "Pizza night" },
  },
  {
    src: "/images/accueil/vie-tartiflette.webp", width: 960, height: 640,
    alt: { fr: "Deux plats de tartiflette sur la table commune", en: "Two dishes of tartiflette on the shared table" },
    caption: { fr: "Tartiflette", en: "Tartiflette" },
  },
  {
    src: "/images/accueil/vie-halloween-loft.webp", width: 960, height: 640,
    alt: { fr: "Citrouille gravée « LOFT » pour Halloween", en: "Pumpkin carved with \"LOFT\" for Halloween" },
    caption: { fr: "Halloween au Loft", en: "Halloween at Le Loft" },
  },
  {
    src: "/images/accueil/vie-barbecue.webp", width: 960, height: 640,
    alt: { fr: "Barbecue sur la terrasse", en: "Barbecue on the terrace" },
    caption: { fr: "Barbecue", en: "Barbecue" },
  },
  {
    src: "/images/accueil/vie-coaching-la-villa.webp", width: 960, height: 640,
    alt: { fr: "Séance de sport au bord de la piscine de La Villa", en: "Workout session by the pool at La Villa" },
    caption: { fr: "La séance de coaching du mois", en: "The monthly coaching session" },
  },
];
