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
  // (03/09/2026, demande Jérôme) Le Loft, chambre 5 — photos de la chambre (source PHOTOS/LOFT CH5).
  // Les communs et extérieurs du même shooting vivent dans LOFT_COMMON_INTERIOR / LOFT_EXTERIOR
  // (partagés par toutes les chambres du Loft qui ont un pack, cf. roomGallerySections).
  "leloft:5": [
    { src: "/images/le loft/rooms/Chambre 5/chambre-5-vue-large.webp", w: 1280, h: 960, alt: { fr: "Chambre 5 du Loft : lit double, grande fenêtre et accès à la salle d'eau privative", en: "Room 5 at Le Loft: double bed, large window and access to the private shower room" } },
    { src: "/images/le loft/rooms/Chambre 5/chambre-5-fauteuil.webp", w: 1920, h: 1440, alt: { fr: "Le coin lecture de la chambre 5 : fauteuil jaune, miroir verrière et plante", en: "Room 5's reading nook: yellow armchair, loft-style mirror and plant" } },
    { src: "/images/le loft/rooms/Chambre 5/chambre-5-coin-salon.webp", w: 1280, h: 960, alt: { fr: "Chambre 5 vue depuis le lit : le coin fauteuil et le mur ocre", en: "Room 5 seen from the bed: the armchair corner and the ochre wall" } },
    { src: "/images/le loft/rooms/Chambre 5/chambre-5-salle-eau.webp", w: 1280, h: 1920, alt: { fr: "Salle d'eau privative de la chambre 5 : meuble vasque en bois et miroir rétroéclairé", en: "Room 5's private shower room: wooden vanity unit and backlit mirror" } },
    { src: "/images/le loft/rooms/Chambre 5/chambre-5-douche.webp", w: 1280, h: 1920, alt: { fr: "La douche à l'italienne de la chambre 5", en: "Room 5's walk-in shower" } },
  ],
  // (28/09/2026, demande Jérôme — fiches chambres) Le Loft, chambre 4 : shooting pro (R06_*) en tête,
  // puis vue d'ensemble, lit et salle d'eau (iPhone) — source PHOTOS/LE LOFT/CH4, webp ≤ 1920 px q80.
  "leloft:4": [
    { src: "/images/le loft/rooms/Chambre 4/chambre-4-vue-large.webp", w: 1920, h: 1440, alt: { fr: "Chambre 4 du Loft : lit double, fauteuil club en cuir et lumière douce", en: "Room 4 at Le Loft: double bed, leather club armchair and soft lighting" } },
    { src: "/images/le loft/rooms/Chambre 4/chambre-4-coin-fauteuil.webp", w: 1920, h: 1440, alt: { fr: "Chambre 4 — le coin fauteuil, le tapis en jute et la fenêtre", en: "Room 4 — the armchair corner, jute rug and window" } },
    { src: "/images/le loft/rooms/Chambre 4/chambre-4-fenetre.webp", w: 1920, h: 1440, alt: { fr: "Chambre 4 — lumière naturelle, plante et grand tableau", en: "Room 4 — natural light, plant and large painting" } },
    { src: "/images/le loft/rooms/Chambre 4/chambre-4-sous-les-toits.webp", w: 1440, h: 1920, alt: { fr: "Chambre 4 — vue d'ensemble sous les toits, avec fenêtre de toit", en: "Room 4 — overview under the roof, with skylight" } },
    { src: "/images/le loft/rooms/Chambre 4/chambre-4-lit.webp", w: 1440, h: 1920, alt: { fr: "Chambre 4 — le lit double et sa tête de lit cannée", en: "Room 4 — the double bed and its cane headboard" } },
    { src: "/images/le loft/rooms/Chambre 4/chambre-4-salle-eau.webp", w: 1440, h: 1920, alt: { fr: "Chambre 4 — salle d'eau privative : vasque, miroir et douche vitrée", en: "Room 4 — private shower room: basin, mirror and glass shower" } },
  ],
  // (28/09/2026) Le Lodge n'a plus de pack dédié : décision Jérôme, TOUTES les chambres utilisent le pack
  // standardisé ci-dessous (les photos de l'ancien pack chambre 4 restent dans public/, non référencées).
};

// ── Le Loft : communs intérieurs et extérieurs (shooting du 03/09/2026, PHOTOS/LOFT CH5) ──────
// Partagés par les chambres du Loft qui ont un pack dédié (4 et 5) : chambre → communs → extérieurs.
export const LOFT_COMMON_INTERIOR: RoomPhoto[] = [
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
  { src: "/images/le loft/rooms/Chambre 5/loft-escalier.webp", w: 1440, h: 1920, alt: { fr: "Intérieur — l'escalier et ses suspensions", en: "Indoors — the staircase and its pendant lights" } },
  { src: "/images/le loft/rooms/Chambre 5/loft-tableau-bienvenue.webp", w: 1440, h: 1920, alt: { fr: "Intérieur — le tableau d'accueil de la maison", en: "Indoors — the house's welcome board" } },
];
export const LOFT_EXTERIOR: RoomPhoto[] = [
  { src: "/images/le loft/rooms/Chambre 5/loft-terrasse-jardin.webp", w: 1920, h: 1440, alt: { fr: "Extérieur — la terrasse et le jardin du Loft, palmier et transats", en: "Outdoors — Le Loft's terrace and garden, palm tree and loungers" } },
  { src: "/images/le loft/rooms/Chambre 5/loft-jardin-oliviers.webp", w: 1440, h: 1920, alt: { fr: "Extérieur — le jardin : oliviers et palmiers en pots", en: "Outdoors — the garden: potted olive trees and palms" } },
  { src: "/images/le loft/rooms/Chambre 5/loft-cabane-tv.webp", w: 1920, h: 1440, alt: { fr: "Extérieur — la cabane du jardin avec écran, fléchettes et pouf", en: "Outdoors — the garden cabin with screen, darts and beanbag" } },
  { src: "/images/le loft/rooms/Chambre 5/loft-palmiers.webp", w: 1440, h: 1920, alt: { fr: "Extérieur — les palmiers du jardin sous le soleil", en: "Outdoors — the garden's palm trees in the sun" } },
];

// ── Le Lodge : galerie STANDARDISÉE (demande Jérôme 03/09/2026) ─────────────
// Les 12 chambres du Lodge sont bâties sur le même modèle (design, salle d'eau
// privative) : un jeu de photos standard, tourné en 2026, illustre N'IMPORTE QUELLE
// chambre libre ou à réserver, dans l'ordre voulu par Jérôme : chambre → espaces
// communs intérieurs → extérieurs. Source : PHOTOS/STANDARDISEE LE LODGE (19 photos,
// converties en webp ≤ 1920 px, variantes responsive par scripts/optimize-images.mjs).
// Depuis le 28/09/2026 (décision Jérôme), aucune chambre du Lodge n'a de pack dédié : les 12
// fiches chambres et les cartes utilisent toutes ce jeu (cf. roomGallerySections ci-dessous).
const LODGE_STD = "/images/le lodge/rooms/standard";
export const LODGE_STANDARD_ROOM: RoomPhoto[] = [
  { src: `${LODGE_STD}/chambre-vue-large.webp`, w: 1920, h: 1280, alt: { fr: "Photo d'une chambre standard — lit double, bureau et parquet clair, lumière du jour", en: "Photo of a standard room — double bed, desk and light wood floor, daylight" } },
  // 6 photos ajoutées par Jérôme le 28/09/2026 (même pack standardisé) : vues d'ensemble
  // en paysage, idéales pour la mosaïque des fiches chambres.
  { src: `${LODGE_STD}/chambre-lit-bureau.webp`, w: 1920, h: 1280, alt: { fr: "Photo d'une chambre standard — lit double, coin bureau et suspension", en: "Photo of a standard room — double bed, desk corner and pendant light" } },
  { src: `${LODGE_STD}/chambre-fauteuil-salle-eau.webp`, w: 1920, h: 1280, alt: { fr: "Photo d'une chambre standard — lit, fauteuil et accès à la salle d'eau", en: "Photo of a standard room — bed, armchair and access to the shower room" } },
  { src: `${LODGE_STD}/chambre-coin-fauteuil.webp`, w: 1920, h: 1280, alt: { fr: "Photo d'une chambre standard — coin fauteuil et bureau", en: "Photo of a standard room — armchair corner and desk" } },
  { src: `${LODGE_STD}/sdb-vue-ensemble.webp`, w: 1920, h: 1280, alt: { fr: "Photo d'une chambre standard — salle d'eau privative : douche, vasque et miroir rétroéclairé", en: "Photo of a standard room — private shower room: shower, basin and backlit mirror" } },
  { src: `${LODGE_STD}/chambre-lit-placards.webp`, w: 1920, h: 1280, alt: { fr: "Photo d'une chambre standard — lit double, chevet et placards", en: "Photo of a standard room — double bed, bedside and wardrobes" } },
  { src: `${LODGE_STD}/chambre-vue-depuis-le-lit.webp`, w: 1920, h: 1280, alt: { fr: "Photo d'une chambre standard — vue depuis le lit : placards, bureau et plante", en: "Photo of a standard room — view from the bed: wardrobes, desk and plant" } },
  { src: `${LODGE_STD}/chambre-lit.webp`, w: 1277, h: 1920, alt: { fr: "Photo d'une chambre standard — tête de lit, coussins et lampe de chevet", en: "Photo of a standard room — headboard, cushions and bedside lamp" } },
  { src: `${LODGE_STD}/chambre-chevet.webp`, w: 1277, h: 1920, alt: { fr: "Photo d'une chambre standard — chevet, lampe et affiche au mur", en: "Photo of a standard room — bedside, lamp and wall print" } },
  { src: `${LODGE_STD}/chambre-bureau.webp`, w: 1277, h: 1920, alt: { fr: "Photo d'une chambre standard — le bureau en bois, mug et plante", en: "Photo of a standard room — wooden desk, mug and plant" } },
  { src: `${LODGE_STD}/sdb-douche.webp`, w: 1280, h: 1920, alt: { fr: "Photo d'une chambre standard — salle d'eau privative : douche à l'italienne", en: "Photo of a standard room — private shower room: walk-in shower" } },
  { src: `${LODGE_STD}/sdb-vasque.webp`, w: 1920, h: 1280, alt: { fr: "Photo d'une chambre standard — salle d'eau privative : meuble vasque et rangements", en: "Photo of a standard room — private shower room: vanity unit and storage" } },
  { src: `${LODGE_STD}/sdb-robinet.webp`, w: 1277, h: 1920, alt: { fr: "Photo d'une chambre standard — salle d'eau privative : vasque et miroir rétroéclairé", en: "Photo of a standard room — private shower room: basin and backlit mirror" } },
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
 * Photos de chambre du Lodge HORS pack standard, utilisées seulement comme photo principale
 * d'une chambre précise (elles n'entrent pas dans la galerie des autres chambres).
 * 28/09/2026 : 1-68 de la séance du Lodge (demande Jérôme) pour la chambre 12.
 */
const LODGE_HERO_EXTRA: RoomPhoto[] = [
  { src: `${LODGE_STD}/chambre-lit-fenetre-bureau.webp`, w: 1920, h: 1280, alt: { fr: "Photo d'une chambre standard — lit double, fenêtre, fauteuil et bureau", en: "Photo of a standard room — double bed, window, armchair and desk" } },
];

/**
 * Photo principale (« hero ») de chaque chambre du Lodge — demande Jérôme du 28/09/2026 :
 * elle doit être DIFFÉRENTE pour chacune des 12 chambres (grande photo de la fiche, carte
 * chambre, aperçu WhatsApp). Chambre n → LODGE_HERO_ORDER[n - 1], puis le reste de la
 * section « chambre » dans l'ordre standard. Un nom par chambre, jamais deux fois.
 * Vues d'ensemble d'abord : il n'y en a que 6 dans le pack, donc les chambres 7 à 11 ont
 * pour l'instant un détail ou la salle d'eau — à remplacer quand de nouvelles vues
 * d'ensemble arrivent. Un nom peut aussi désigner une photo de LODGE_HERO_EXTRA.
 */
const LODGE_HERO_ORDER: readonly string[] = [
  "chambre-lit-bureau",         // chambre 1
  "chambre-fauteuil-salle-eau", // chambre 2
  "chambre-coin-fauteuil",      // chambre 3
  "chambre-vue-large",          // chambre 4 (la photo historique de la chambre 4)
  "chambre-lit-placards",       // chambre 5
  "chambre-vue-depuis-le-lit",  // chambre 6
  "chambre-lit",                // chambre 7
  "chambre-bureau",             // chambre 8
  "chambre-chevet",             // chambre 9
  "sdb-vue-ensemble",           // chambre 10
  "sdb-vasque",                 // chambre 11
  "chambre-lit-fenetre-bureau", // chambre 12 (LODGE_HERO_EXTRA)
];

/** Section « chambre » d'une chambre du Lodge : sa photo principale, puis les autres. */
function lodgeRoomPhotos(roomNumber: number): RoomPhoto[] {
  const name = LODGE_HERO_ORDER[roomNumber - 1];
  const src = `${LODGE_STD}/${name}.webp`;
  const hero = name ? [...LODGE_STANDARD_ROOM, ...LODGE_HERO_EXTRA].find((p) => p.src === src) : undefined;
  return hero ? [hero, ...LODGE_STANDARD_ROOM.filter((p) => p !== hero)] : LODGE_STANDARD_ROOM;
}

/** Section d'une galerie de chambre — ordre voulu par Jérôme : chambre → communs intérieurs → extérieurs. */
export type GallerySectionKey = "room" | "interior" | "exterior";
export type GallerySection = { key: GallerySectionKey; photos: RoomPhoto[] };

/**
 * Galerie d'une chambre, découpée en sections (fiches chambres, 28/09/2026) :
 * - Le Lodge : TOUTES les chambres → pack standardisé (chambre, communs, extérieurs),
 *   avec une photo principale propre à chaque chambre (LODGE_HERO_ORDER) ;
 * - Le Loft : pack dédié de la chambre, puis communs et extérieurs du Loft ;
 * - ailleurs (La Villa) : le pack dédié seul ;
 * - `undefined` = pas de photos propres → pas de visionneuse (la carte garde la photo de type).
 */
export function roomGallerySections(house: string, roomNumber: number): GallerySection[] | undefined {
  if (house === "lelodge") {
    return [
      { key: "room", photos: lodgeRoomPhotos(roomNumber) },
      { key: "interior", photos: LODGE_COMMON_INTERIOR },
      { key: "exterior", photos: LODGE_EXTERIOR },
    ];
  }
  const dedicated = ROOM_PHOTOS[`${house}:${roomNumber}`];
  if (!dedicated) return undefined;
  if (house === "leloft") {
    return [
      { key: "room", photos: dedicated },
      { key: "interior", photos: LOFT_COMMON_INTERIOR },
      { key: "exterior", photos: LOFT_EXTERIOR },
    ];
  }
  return [{ key: "room", photos: dedicated }];
}

/** Galerie à plat pour la visionneuse (cartes, pages maisons, /chambres-disponibles). */
export function roomGallery(house: string, roomNumber: number): RoomPhoto[] | undefined {
  return roomGallerySections(house, roomNumber)?.flatMap((s) => s.photos);
}
