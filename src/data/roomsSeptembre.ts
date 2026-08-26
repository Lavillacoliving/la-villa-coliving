/**
 * Chambres disponibles — LP payante /chambres-septembre (brief LOT 2, 24/08/2026).
 *
 * SOURCE UNIQUE de la page : le H1, le compteur et les cartes dérivent tous de
 * ROOMS_SEPTEMBRE. Ajouter/retirer une chambre = éditer ce tableau, rien d'autre.
 * Le titre ne peut donc jamais annoncer un nombre différent de ce qui est affiché —
 * garde-fou volontaire : sur une page d'atterrissage payante, un écart entre
 * « X chambres » et le nombre de cartes est une allégation trompeuse.
 *
 * ⚠️ `property` DOIT rester un slug canonique `properties.slug` SANS tiret
 * (src/lib/entities.ts) : il part tel quel dans `property_interest` (Edge v14 →
 * colonnes prospects/form_submissions, migration property_interest_2026_08_24).
 *
 * Données fournies par Jérôme le 24/08/2026. Ne rien inventer ici : toute chambre
 * ajoutée doit venir de lui (maison, repère, surface, salle d'eau, prix, date, atout).
 */

export interface RoomSeptembre {
  /** Identifiant stable — part dans `room_interest`. */
  id: string;
  /** Slug canonique properties.slug, SANS tiret — part dans `property_interest`. */
  property: "lavilla" | "leloft" | "lelodge" | "montblanc";
  houseName: string;
  /** Repère interne affiché au candidat (étage, orientation). */
  landmark: { fr: string; en: string };
  surfaceM2: number;
  privateBathroom: boolean;
  /** Loyer mensuel tout inclus, en CHF. Affiché formaté par la page. */
  priceChf: number;
  /** Date de disponibilité au format ISO (tri fiable) + rendu localisé. */
  availableFrom: string;
  /** L'atout vendeur, une phrase. EN = miroir, pas du mot à mot. */
  pitch: { fr: string; en: string };
  /**
   * Galerie de la chambre — 12 photos (LOT 3, 26/08/2026).
   *
   * ORDRE SIGNIFIANT, ne pas mélanger :
   *   [0]      l'atout de SA maison — décision produit du brief LOT 2, « la maison
   *            vend le rêve, la chambre signe le bail ». C'est la grande photo de la carte.
   *   [1], [2] la chambre — les 2 vignettes de la carte.
   *   [3…]     le reste : chambre puis équipements de la maison (piscine, sauna,
   *            salle de sport, salon, jeux). Visible en LIGHTBOX UNIQUEMENT.
   *
   * Les 3 premières seules entrent dans le flux initial de la page ; les suivantes
   * ne sont jamais requêtées tant que la lightbox n'est pas ouverte (LCP, brief C4).
   * L'`alt` sert aussi de légende dans la lightbox — d'où des phrases descriptives
   * et non des mots-clés.
   */
  photos: {
    src: string;
    /** Dimensions RÉELLES du fichier. Sans elles, un cadre fixe recadre les
     *  portraits de 40 %+ (« ça zoome beaucoup trop », Jérôme 24/08). La page
     *  calcule le cadre de chaque photo à partir de ce ratio, borné [0,75 ; 1,5]. */
    w: number;
    h: number;
    alt: { fr: string; en: string };
  }[];
}

export const ROOMS_SEPTEMBRE: RoomSeptembre[] = [
  {
    id: "chambre-4",
    property: "lelodge",
    houseName: "Le Lodge",
    landmark: {
      fr: "Chambre 4 · 1ᵉʳ étage, côté jardin",
      en: "Room 4 · first floor, garden side",
    },
    surfaceM2: 20,
    privateBathroom: true,
    priceChf: 1380,
    availableFrom: "2026-09-05",
    pitch: {
      fr: "Calme, très lumineuse, entièrement neuve.",
      en: "Quiet, full of light, brand new.",
    },
    photos: [
      {
        src: "/images/le lodge/common areas/la villa coliving le lodge-40.webp",
        w: 1920,
        h: 1280,
        alt: {
          fr: "Le grand salon commun du Lodge, canapés et coin musique",
          en: "The Lodge's large shared lounge, sofas and record corner",
        },
      },
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
      {
        src: "/images/le lodge/exterior/le lodge piscine.webp",
        w: 1024,
        h: 1024,
        alt: {
          fr: "La piscine extérieure du Lodge, bordée de cyprès",
          en: "The Lodge's outdoor pool, lined with cypress trees",
        },
      },
      {
        src: "/images/le lodge/exterior/lodge-piscine-maison.webp",
        w: 1086,
        h: 1448,
        alt: {
          fr: "La piscine du Lodge et la maison en arrière-plan, un jour de plein soleil",
          en: "The Lodge's pool with the house behind it, on a bright sunny day",
        },
      },
      {
        src: "/images/le lodge/amenities/la villa coliving le lodge-57.webp",
        w: 1920,
        h: 1280,
        alt: {
          fr: "Le sauna finlandais du Lodge, banquettes en bois clair",
          en: "The Lodge's Finnish sauna, pale wooden benches",
        },
      },
      {
        src: "/images/le lodge/amenities/la villa coliving le lodge-121.webp",
        w: 1536,
        h: 1024,
        alt: {
          fr: "La salle de sport du Lodge : cage à squat, bancs et poids libres",
          en: "The Lodge's gym: squat rack, benches and free weights",
        },
      },
      {
        src: "/images/le lodge/amenities/la villa coliving le lodge-96.webp",
        w: 1920,
        h: 1280,
        alt: {
          fr: "L'espace home cinéma du Lodge, grand écran et canapés bas",
          en: "The Lodge's home cinema area, big screen and low sofas",
        },
      },
      {
        src: "/images/le lodge/interior/la villa coliving le lodge-85.webp",
        w: 1920,
        h: 1280,
        alt: {
          fr: "Le baby-foot du Lodge, à l'entrée du salon",
          en: "The Lodge's foosball table, at the entrance to the lounge",
        },
      },
      {
        src: "/images/le lodge/common areas/lodge-salle-a-manger.webp",
        w: 1086,
        h: 1448,
        alt: {
          fr: "La salle à manger du Lodge : grande table en bois, chaises colorées et suspensions en rotin",
          en: "The Lodge's dining room: long wooden table, colourful chairs and rattan pendant lights",
        },
      },
      {
        src: "/images/le lodge/exterior/lodge-hamac-jardin.webp",
        w: 1022,
        h: 1363,
        alt: {
          fr: "Un hamac tendu dans le jardin du Lodge",
          en: "A hammock strung up in the Lodge's garden",
        },
      },
    ],
  },
  {
    id: "chambre-8",
    property: "lavilla",
    houseName: "La Villa",
    landmark: {
      fr: "Chambre 8 · 1ᵉʳ étage, plein sud face piscine",
      en: "Room 8 · first floor, south-facing over the pool",
    },
    surfaceM2: 18,
    privateBathroom: false,
    priceChf: 1380,
    availableFrom: "2026-09-10",
    pitch: {
      fr: "Balcon privatif plein sud, vue sur la piscine, calme et lumineuse.",
      en: "South-facing private balcony, pool view, quiet and full of light.",
    },
    photos: [
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
      {
        src: "/images/la villa jardin.webp",
        w: 1024,
        h: 1536,
        alt: {
          fr: "Le jardin de La Villa : la piscine et le banc de pierre, sous le saule pleureur",
          en: "La Villa's garden: the pool and the stone bench, under the weeping willow",
        },
      },
      {
        src: "/images/la villa/amenities/La Villa-11.webp",
        w: 1651,
        h: 1920,
        alt: {
          fr: "La salle de sport de La Villa : tapis de course, haltères et cheval d'arçons",
          en: "La Villa's gym: treadmill, dumbbells and a pommel horse",
        },
      },
      {
        src: "/images/la villa/amenities/La Villa-37.webp",
        w: 1920,
        h: 1307,
        alt: {
          fr: "Le sauna infrarouge de La Villa",
          en: "La Villa's infrared sauna",
        },
      },
      {
        src: "/images/la villa/interior/La Villa-89.webp",
        w: 1170,
        h: 878,
        alt: {
          fr: "Le salon de La Villa : canapé moutarde, grande méridienne et plantes",
          en: "La Villa's lounge: mustard sofa, a large daybed and plants",
        },
      },
      {
        src: "/images/la villa/amenities/La Villa-42.webp",
        w: 1127,
        h: 1464,
        alt: {
          fr: "Le baby-foot de La Villa, devant la baie vitrée",
          en: "La Villa's foosball table, in front of the bay window",
        },
      },
    ],
  },
];

/**
 * Hero — « la villa jardin.webp » (choix de Jérôme, 24/08). Piscine extérieure,
 * maison et saule pleureur : la photo qui « vend le rêve » du brief. Déjà servie
 * en hero de la home et de /lavilla, jeu responsive complet jusqu'à 1920 — donc
 * nette aussi en desktop, ce que la piscine du Lodge (1086 px de large) n'était pas.
 */
export const HERO_IMAGE = "/images/la villa jardin.webp";
export const HERO_W = 1024;
export const HERO_H = 1536;
export const HERO_ALT = {
  fr: "La piscine extérieure de La Villa, sous le saule pleureur",
  en: "La Villa's outdoor pool, under the weeping willow",
};

/** Loyer d'entrée réel — alimente le « dès X CHF » du hero (jamais une valeur en dur). */
export const PRICE_FROM_CHF = Math.min(...ROOMS_SEPTEMBRE.map((r) => r.priceChf));

/**
 * « 1 380 » — `fr-CH` produit déjà une ESPACE FINE INSÉCABLE (U+202F) entre les
 * milliers. On la garde telle quelle : la remplacer par une espace ordinaire
 * autoriserait une coupure de ligne entre « 1 » et « 380 » en colonne étroite
 * (mobile ≈ 60 % du trafic payant). Ne pas « normaliser » ce caractère.
 */
export function formatChf(value: number): string {
  return value.toLocaleString("fr-CH");
}

/** « 05/09 » en FR, « 5 September » en EN. */
export function formatAvailability(iso: string, en: boolean): string {
  const [, month, day] = iso.split("-");
  if (!en) return `${day}/${month}`;
  const monthName = new Date(`${iso}T12:00:00Z`).toLocaleString("en-GB", {
    month: "long",
    timeZone: "UTC",
  });
  return `${Number(day)} ${monthName}`;
}
