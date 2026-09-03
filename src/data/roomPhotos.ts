// Manifeste statique des photos PAR CHAMBRE (Lot 3 — design arbitré rapport
// §3.B) : les photos sont des assets du repo et changent rarement, la dispo et
// les prix viennent de `v_public_rooms`. Clé = `${house_slug}:${room_number}`.
// Une chambre absente d'ici retombe sur la photo de TYPE de sa maison (carte
// sans galerie). Compléter au fil des shootings — mêmes règles que la LP :
// dimensions RÉELLES obligatoires (le cadre est calculé du ratio, borné, sinon
// les portraits sont recadrés de 40 %+).
export type RoomPhoto = {
  src: string;
  w: number;
  h: number;
  alt: { fr: string; en: string };
};

export const ROOM_PHOTOS: Record<string, RoomPhoto[]> = {
  "lavilla:8": [
    {
      src: "/images/la villa/rooms/Chambre 8/chambre-8-balcon-piscine.webp",
      w: 941,
      h: 1672,
      alt: {
        fr: "La piscine de La Villa vue depuis le balcon privatif de la chambre 8",
        en: "La Villa's pool seen from room 8's private balcony",
      },
    },
    {
      src: "/images/la villa/rooms/Chambre 8/chambre-8-chambre.webp",
      w: 1086,
      h: 1448,
      alt: {
        fr: "Chambre 8 de La Villa : lit double, tête de lit capitonnée et mur bleu",
        en: "Room 8 at La Villa: double bed, upholstered headboard and blue accent wall",
      },
    },
    {
      src: "/images/la villa/rooms/Chambre 8/chambre-8-bureau.webp",
      w: 1335,
      h: 1178,
      alt: {
        fr: "Le coin bureau de la chambre 8, en plein soleil devant la baie",
        en: "Room 8's desk nook, in full sun by the window",
      },
    },
    {
      src: "/images/la villa/rooms/La Villa-80.webp",
      w: 1440,
      h: 1920,
      alt: {
        fr: "La chambre 8 en plan large : le lit, le parquet et l'accès au balcon",
        en: "Room 8 from a wider angle: the bed, the wood floor and the way out to the balcony",
      },
    },
    {
      src: "/images/la villa/rooms/Chambre 8/chambre-8-vue-bureau.webp",
      w: 1086,
      h: 1448,
      alt: {
        fr: "Depuis le lit de la chambre 8 : le fauteuil tressé et l'alcôve bureau baignée de lumière",
        en: "From room 8's bed: the woven lounge chair and the sunlit desk alcove",
      },
    },
    {
      src: "/images/la villa/rooms/Chambre 8/chambre-8-salle-eau.webp",
      w: 1086,
      h: 1448,
      alt: {
        fr: "La salle d'eau partagée de l'étage : douche à l'italienne et double vasque",
        en: "The floor's shared shower room: walk-in shower and double washbasin",
      },
    },
  ],
  // (03/09/2026, demande Jérôme) Le Loft, chambre 5 : pack complet dans l'ordre chambre →
  // équipements → le reste (23 photos, source PHOTOS/LOFT CH5, webp ≤ 1920 px q80, dimensions réelles).
  "leloft:5": [
    { src: "/images/le loft/rooms/Chambre 5/chambre-5-vue-large.webp", w: 1280, h: 960, alt: { fr: "Chambre 5 du Loft : lit double, grande fenêtre et accès à la salle d'eau privative", en: "Room 5 at Le Loft: double bed, large window and access to the private shower room" } },
    { src: "/images/le loft/rooms/Chambre 5/chambre-5-fauteuil.webp", w: 1920, h: 1440, alt: { fr: "Le coin lecture de la chambre 5 : fauteuil jaune, miroir verrière et plante", en: "Room 5's reading nook: yellow armchair, loft-style mirror and plant" } },
    { src: "/images/le loft/rooms/Chambre 5/chambre-5-coin-salon.webp", w: 1280, h: 960, alt: { fr: "Chambre 5 vue depuis le lit : le coin fauteuil et le mur ocre", en: "Room 5 seen from the bed: the armchair corner and the ochre wall" } },
    { src: "/images/le loft/rooms/Chambre 5/chambre-5-salle-eau.webp", w: 1280, h: 1920, alt: { fr: "Salle d'eau privative de la chambre 5 : meuble vasque en bois et miroir rétroéclairé", en: "Room 5's private shower room: wooden vanity unit and backlit mirror" } },
    { src: "/images/le loft/rooms/Chambre 5/chambre-5-douche.webp", w: 1280, h: 1920, alt: { fr: "La douche à l'italienne de la chambre 5", en: "Room 5's walk-in shower" } },
    { src: "/images/le loft/rooms/Chambre 5/loft-piscine-interieure.webp", w: 1920, h: 1440, alt: { fr: "Équipements — la piscine intérieure chauffée du Loft", en: "Amenities — Le Loft's heated indoor pool" } },
    { src: "/images/le loft/rooms/Chambre 5/loft-piscine-interieure-transat.webp", w: 1440, h: 1920, alt: { fr: "Équipements — la piscine intérieure et son transat", en: "Amenities — the indoor pool and its lounger" } },
    { src: "/images/le loft/rooms/Chambre 5/loft-sauna.webp", w: 1358, h: 1920, alt: { fr: "Équipements — le sauna du Loft", en: "Amenities — Le Loft's sauna" } },
    { src: "/images/le loft/rooms/Chambre 5/loft-salle-de-sport-rameur.webp", w: 1440, h: 1920, alt: { fr: "Équipements — la salle de sport : rameur et grand miroir", en: "Amenities — the gym: rowing machine and large mirror" } },
    { src: "/images/le loft/rooms/Chambre 5/loft-salle-de-sport-tapis.webp", w: 1440, h: 1920, alt: { fr: "Équipements — la salle de sport : tapis de course, banc et haltères", en: "Amenities — the gym: treadmill, bench and dumbbells" } },
    { src: "/images/le loft/rooms/Chambre 5/loft-home-cinema.webp", w: 1920, h: 1440, alt: { fr: "Équipements — le home cinéma : grand écran, enceintes et canapé", en: "Amenities — the home cinema: big screen, speakers and sofa" } },
    { src: "/images/le loft/rooms/Chambre 5/loft-home-cinema-canape.webp", w: 1920, h: 1440, alt: { fr: "Équipements — le home cinéma vu du canapé", en: "Amenities — the home cinema seen from the sofa" } },
    { src: "/images/le loft/rooms/Chambre 5/loft-babyfoot.webp", w: 1277, h: 1920, alt: { fr: "Équipements — le babyfoot", en: "Amenities — the table football" } },
    { src: "/images/le loft/rooms/Chambre 5/loft-jeux-de-societe.webp", w: 1920, h: 1440, alt: { fr: "Équipements — l'étagère de jeux de société du salon", en: "Amenities — the living room's board-game shelf" } },
    { src: "/images/le loft/rooms/Chambre 5/loft-salon.webp", w: 1280, h: 960, alt: { fr: "Espaces communs — le salon : canapés blancs et grand miroir", en: "Common areas — the living room: white sofas and large mirror" } },
    { src: "/images/le loft/rooms/Chambre 5/loft-cuisine.webp", w: 1920, h: 1440, alt: { fr: "Espaces communs — la cuisine équipée et sa table haute", en: "Common areas — the fitted kitchen and its high table" } },
    { src: "/images/le loft/rooms/Chambre 5/loft-cuisine-table.webp", w: 1920, h: 1440, alt: { fr: "Espaces communs — la table haute de la cuisine", en: "Common areas — the kitchen's high table" } },
    { src: "/images/le loft/rooms/Chambre 5/loft-terrasse-jardin.webp", w: 1920, h: 1440, alt: { fr: "Extérieur — la terrasse et le jardin du Loft, palmier et transats", en: "Outdoors — Le Loft's terrace and garden, palm tree and loungers" } },
    { src: "/images/le loft/rooms/Chambre 5/loft-jardin-oliviers.webp", w: 1440, h: 1920, alt: { fr: "Extérieur — le jardin : oliviers et palmiers en pots", en: "Outdoors — the garden: potted olive trees and palms" } },
    { src: "/images/le loft/rooms/Chambre 5/loft-cabane-tv.webp", w: 1920, h: 1440, alt: { fr: "Extérieur — la cabane du jardin avec écran, fléchettes et pouf", en: "Outdoors — the garden cabin with screen, darts and beanbag" } },
    { src: "/images/le loft/rooms/Chambre 5/loft-palmiers.webp", w: 1440, h: 1920, alt: { fr: "Extérieur — les palmiers du jardin sous le soleil", en: "Outdoors — the garden's palm trees in the sun" } },
    { src: "/images/le loft/rooms/Chambre 5/loft-escalier.webp", w: 1440, h: 1920, alt: { fr: "Intérieur — l'escalier et ses suspensions", en: "Indoors — the staircase and its pendant lights" } },
    { src: "/images/le loft/rooms/Chambre 5/loft-tableau-bienvenue.webp", w: 1440, h: 1920, alt: { fr: "Intérieur — le tableau d'accueil de la maison", en: "Indoors — the house's welcome board" } },
  ],
  "lelodge:4": [
    {
      src: "/images/le lodge/rooms/Chambre 4/chambre-4-vue-large.webp",
      w: 1600,
      h: 1067,
      alt: {
        fr: "Chambre 4 du Lodge : lit double, bureau et grande fenêtre côté jardin",
        en: "Room 4 at the Lodge: double bed, desk and a large garden-side window",
      },
    },
    {
      src: "/images/le lodge/rooms/Chambre 4/chambre-4-salle-eau.webp",
      w: 1600,
      h: 1067,
      alt: {
        fr: "Salle d'eau privative de la chambre 4 : douche à l'italienne, meuble vasque et miroir rétroéclairé",
        en: "Room 4's private shower room: walk-in shower, vanity unit and backlit mirror",
      },
    },
    {
      src: "/images/le lodge/rooms/Chambre 4/chambre-4-bureau.webp",
      w: 1800,
      h: 1200,
      alt: {
        fr: "Le coin bureau de la chambre 4, sous une suspension noire, à côté du lit",
        en: "Room 4's desk nook, under a black pendant lamp, beside the bed",
      },
    },
  ],
};

// ── Le Lodge : galerie STANDARDISÉE (demande Jérôme 03/09/2026) ─────────────
// Les 12 chambres du Lodge sont bâties sur le même modèle (design, salle d'eau
// privative) : un jeu de photos standard, tourné en 2026, illustre N'IMPORTE QUELLE
// chambre libre ou à réserver, dans l'ordre voulu par Jérôme : chambre → espaces
// communs intérieurs → extérieurs. Source : PHOTOS/STANDARDISEE LE LODGE (19 photos,
// converties en webp ≤ 1920 px, variantes responsive par scripts/optimize-images.mjs).
// Une chambre qui a son propre pack (ex. lelodge:4) garde ses photos en tête, puis
// enchaîne sur les communs et extérieurs standard (cf. roomGallery ci-dessous).
const LODGE_STD = "/images/le lodge/rooms/standard";
export const LODGE_STANDARD_ROOM: RoomPhoto[] = [
  { src: `${LODGE_STD}/chambre-vue-large.webp`, w: 1920, h: 1280, alt: { fr: "Chambre — lit double, bureau et parquet clair, lumière du jour", en: "Room — double bed, desk and light wood floor, daylight" } },
  { src: `${LODGE_STD}/chambre-lit.webp`, w: 1277, h: 1920, alt: { fr: "Chambre — tête de lit, coussins et lampe de chevet", en: "Room — headboard, cushions and bedside lamp" } },
  { src: `${LODGE_STD}/chambre-chevet.webp`, w: 1277, h: 1920, alt: { fr: "Chambre — chevet, lampe et affiche au mur", en: "Room — bedside, lamp and wall print" } },
  { src: `${LODGE_STD}/chambre-bureau.webp`, w: 1277, h: 1920, alt: { fr: "Chambre — le bureau en bois, mug et plante", en: "Room — wooden desk, mug and plant" } },
  { src: `${LODGE_STD}/sdb-douche.webp`, w: 1280, h: 1920, alt: { fr: "Chambre — salle d'eau privative : douche à l'italienne", en: "Room — private shower room: walk-in shower" } },
  { src: `${LODGE_STD}/sdb-vasque.webp`, w: 1920, h: 1280, alt: { fr: "Chambre — salle d'eau privative : meuble vasque et rangements", en: "Room — private shower room: vanity unit and storage" } },
  { src: `${LODGE_STD}/sdb-robinet.webp`, w: 1277, h: 1920, alt: { fr: "Chambre — salle d'eau privative : vasque et miroir rétroéclairé", en: "Room — private shower room: basin and backlit mirror" } },
];
export const LODGE_COMMON_INTERIOR: RoomPhoto[] = [
  { src: `${LODGE_STD}/salle-a-manger.webp`, w: 1920, h: 1280, alt: { fr: "Espaces communs — la grande table et la cuisine ouverte", en: "Common areas — the big table and the open kitchen" } },
  { src: `${LODGE_STD}/cuisine.webp`, w: 1920, h: 1280, alt: { fr: "Espaces communs — la cuisine équipée", en: "Common areas — the fitted kitchen" } },
  { src: `${LODGE_STD}/cuisine-petit-dejeuner.webp`, w: 1920, h: 1277, alt: { fr: "Espaces communs — coin petit-déjeuner : bouilloire, machine à café, grille-pain", en: "Common areas — breakfast corner: kettle, coffee machine, toaster" } },
  { src: `${LODGE_STD}/tireuse.webp`, w: 1277, h: 1920, alt: { fr: "Espaces communs — la tireuse de la cuisine", en: "Common areas — the kitchen drinks dispenser" } },
  { src: `${LODGE_STD}/salon.webp`, w: 1920, h: 1280, alt: { fr: "Espaces communs — le salon, canapés et lumière du jardin", en: "Common areas — the lounge, sofas and garden light" } },
  { src: `${LODGE_STD}/salon-tv.webp`, w: 1920, h: 1280, alt: { fr: "Espaces communs — le coin TV avec Canal+", en: "Common areas — the TV corner with Canal+" } },
  { src: `${LODGE_STD}/sauna-entree.webp`, w: 1920, h: 1280, alt: { fr: "Espaces communs — le sauna et la salle de jeux", en: "Common areas — the sauna and the games room" } },
  { src: `${LODGE_STD}/sauna.webp`, w: 1920, h: 1280, alt: { fr: "Espaces communs — l'intérieur du sauna", en: "Common areas — inside the sauna" } },
  { src: `${LODGE_STD}/salle-de-sport-air-hockey.webp`, w: 1920, h: 1280, alt: { fr: "Espaces communs — salle de sport et air hockey", en: "Common areas — gym and air hockey" } },
  { src: `${LODGE_STD}/salle-de-sport.webp`, w: 1536, h: 1024, alt: { fr: "Espaces communs — la salle de sport : cage à squat, vélo, sac de frappe", en: "Common areas — the gym: squat rack, bike, punching bag" } },
  { src: `${LODGE_STD}/babyfoot.webp`, w: 1277, h: 1920, alt: { fr: "Espaces communs — le babyfoot", en: "Common areas — the table football" } },
];
export const LODGE_EXTERIOR: RoomPhoto[] = [
  { src: `${LODGE_STD}/piscine-jardin.webp`, w: 1086, h: 1448, alt: { fr: "Extérieur — la piscine et le jardin", en: "Outdoors — the pool and the garden" } },
  { src: "/images/le lodge/exterior/lodge-piscine-maison.webp", w: 1086, h: 1448, alt: { fr: "Extérieur — la piscine devant la maison", en: "Outdoors — the pool in front of the house" } },
  { src: "/images/le lodge/exterior/lodge-hamac-jardin.webp", w: 1022, h: 1363, alt: { fr: "Extérieur — le hamac dans le jardin", en: "Outdoors — the hammock in the garden" } },
  { src: "/images/le lodge/exterior/la villa coliving le lodge-14.webp", w: 1440, h: 1920, alt: { fr: "Extérieur — la façade du Lodge", en: "Outdoors — the Lodge's façade" } },
];

/**
 * Galerie d'une chambre pour la visionneuse des pages maisons.
 * - pack dédié (ROOM_PHOTOS) s'il existe, sinon les photos de chambre standard du Lodge ;
 * - au Lodge, on enchaîne toujours sur les espaces communs intérieurs puis les extérieurs ;
 * - ailleurs (Villa, Loft), uniquement le pack dédié — `undefined` = pas de visionneuse.
 */
export function roomGallery(house: string, roomNumber: number): RoomPhoto[] | undefined {
  const dedicated = ROOM_PHOTOS[`${house}:${roomNumber}`];
  if (house === "lelodge") return [...(dedicated ?? LODGE_STANDARD_ROOM), ...LODGE_COMMON_INTERIOR, ...LODGE_EXTERIOR];
  return dedicated;
}
