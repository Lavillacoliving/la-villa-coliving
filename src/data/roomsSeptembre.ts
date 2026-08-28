/**
 * Inventaire de la LP payante /chambres-septembre · /en/rooms-september.
 * Brief LOT 2 (24/08/2026), rendu PILOTABLE PAR LA DONNÉE au LOT 4 (28/08/2026).
 *
 * ── SOURCE UNIQUE ────────────────────────────────────────────────────────────
 * Le badge, le H1, le compteur, le CTA, les cartes et les metas dérivent TOUS de
 * ce fichier. Un blast se prépare ici et nulle part ailleurs :
 *
 *   • rouvrir une chambre  → son `status` passe à "disponible"
 *   • fermer une chambre   → son `status` passe à "réservée" (on NE supprime rien :
 *                            photos et textes restent prêts pour la prochaine fois)
 *   • changer de mois      → `LP_MONTH`
 *
 * La page se met alors seule dans le bon des trois états (voir `AVAILABLE_COUNT`)
 * sans qu'une ligne de composant bouge. Procédure complète : README.md.
 *
 * Pourquoi un fichier et pas une table : le gros du volume est ÉDITORIAL (12 photos
 * par chambre avec alt FR/EN rédigés et dimensions réelles, pitch, repère) — en base
 * ce serait une colonne JSON, sans typage ni relecture en diff. Et la LP est
 * prérendue : son H1 est l'élément LCP, il doit être dans le HTML servi, pas derrière
 * un fetch. `tsc -b` sert de garde-fou : une faute de frappe sur un statut casse le
 * build au lieu de partir en prod.
 *
 * ⚠️ `property` DOIT rester un slug canonique `properties.slug` SANS tiret
 * (src/lib/entities.ts) : il part tel quel dans `property_interest` (Edge v14 →
 * colonnes prospects/form_submissions, migration property_interest_2026_08_24).
 *
 * Données fournies par Jérôme le 24/08/2026. Ne rien inventer ici : toute chambre
 * ajoutée doit venir de lui (maison, repère, surface, salle d'eau, prix, date, atout).
 */

import { STATS, thousands } from "@/data/stats";

/**
 * Le mois de la campagne — VARIABLE, jamais écrit dans un composant.
 * FR en minuscule et EN en capitale : ils s'insèrent tels quels dans
 * « pour septembre » / « for September ».
 *
 * L'URL, elle, reste /chambres-septembre en toute saison : les campagnes Ads en
 * pause pointent dessus et seront réactivées. La page est noindex et l'URL n'est
 * lue par personne — la changer coûterait des campagnes, la garder ne coûte rien.
 */
export const LP_MONTH = {
  fr: "septembre",
  en: "September",
};

/**
 * Le seul champ à toucher pour ouvrir ou fermer une chambre.
 * Accent inclus, c'est voulu : « reservee » ne compile pas, donc une coquille
 * s'arrête au build et n'atteint jamais une page payante.
 */
export type RoomStatus = "disponible" | "réservée";

export interface RoomSeptembre {
  /** Identifiant stable — part dans `room_interest`. */
  id: string;
  /**
   * Ouvre ou ferme la chambre sur la page. C'EST LE SEUL CHAMP DU BLAST.
   * "réservée" la retire des cartes et du compteur sans rien effacer :
   * elle revient telle quelle au prochain départ.
   */
  status: RoomStatus;
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
    // Réservée le 27/08/2026 — les 3 chambres de septembre sont parties.
    status: "réservée",
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
    // Réservée le 27/08/2026.
    status: "réservée",
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

// ── Dérivations : la page ne compte jamais elle-même ────────────────────────

/**
 * Les chambres réellement proposées. TOUT ce que la page affiche part d'ici :
 * cartes, compteur, H1, CTA, metas. Une chambre "réservée" reste dans le fichier
 * mais sort de la page — impossible d'annoncer un nombre qu'on n'affiche pas.
 */
export const AVAILABLE_ROOMS = ROOMS_SEPTEMBRE.filter((r) => r.status === "disponible");

/**
 * Le compteur du hero. Il gouverne les TROIS états de la page :
 *   ≥ 2 → « Il ne reste que N chambres pour {mois} »
 *   = 1 → « Dernière chambre disponible pour {mois} »
 *   = 0 → mode « Complet » : liste d'attente vers /candidature, bloc des 3 maisons
 * Aucun de ces trois cas n'est écrit en dur dans un composant.
 */
export const AVAILABLE_COUNT = AVAILABLE_ROOMS.length;

/**
 * Loyer d'entrée du « dès X CHF » du hero.
 *
 * Le plus bas des chambres OUVERTES ; à zéro chambre ouverte (mode complet), le
 * tarif public de src/data/stats.ts — seule source du prix (CLAUDE.md), et pas
 * `Math.min()` d'un tableau vide, qui vaut Infinity.
 */
export const PRICE_FROM_CHF = AVAILABLE_ROOMS.length
  ? Math.min(...AVAILABLE_ROOMS.map((r) => r.priceChf))
  : STATS.priceChf;

/**
 * Les 3 maisons — bloc de repli du mode « complet » : quand il n'y a plus de
 * chambre à montrer, on montre où elles se libèrent.
 *
 * `slug` est aussi le chemin (/lavilla, /leloft, /lelodge), préfixé par /en côté
 * anglais. Photos déjà présentes dans RESPONSIVE_IMAGES avec un jeu complet, et
 * dimensions RÉELLES des fichiers : le cadre 4/3 de la carte s'en sert pour ne
 * pas faire sauter la mise en page pendant le chargement.
 */
export const LP_HOUSES = [
  {
    slug: "lavilla",
    name: "La Villa",
    city: "Ville-la-Grand",
    src: "/images/la villa.webp",
    w: 1280,
    h: 722,
    alt: {
      fr: "La Villa, à Ville-la-Grand : la maison et son jardin",
      en: "La Villa, in Ville-la-Grand: the house and its garden",
    },
  },
  {
    slug: "leloft",
    name: "Le Loft",
    city: "Ambilly",
    src: "/images/la villa coliving le loft piscine.webp",
    w: 1920,
    h: 1440,
    alt: {
      fr: "La piscine du Loft, à Ambilly",
      en: "The Loft's pool, in Ambilly",
    },
  },
  {
    slug: "lelodge",
    name: "Le Lodge",
    city: "Annemasse",
    src: "/images/le lodge piscine.webp",
    w: 1024,
    h: 1024,
    alt: {
      fr: "La piscine du Lodge, à Annemasse",
      en: "The Lodge's pool, in Annemasse",
    },
  },
];

/**
 * « 1 380 » en FR, « 1,380 » en EN — exactement la graphie de src/data/stats.ts
 * (PRICE_FR_NUM / PRICE_EN_NUM), y compris dans le JSON-LD de cette page.
 *
 * Deux corrections par rapport au LOT 2, qui appelait `toLocaleString("fr-CH")` :
 *  • la LANGUE était ignorée — la LP anglaise affichait « CHF 1 380/month » là où
 *    tout le reste du site anglais écrit « CHF 1,380 » ;
 *  • `toLocaleString` est proscrit ici : l'ICU du build Puppeteer du prérendu et
 *    celui du navigateur peuvent diverger, ce qui produit un mismatch
 *    d'hydratation sur une page dont le prix est au premier écran.
 *
 * L'insécable FR (U+00A0, pas la fine U+202F quasi invisible) interdit par
 * ailleurs la coupure de ligne entre « 1 » et « 380 » en colonne étroite
 * (mobile ≈ 60 % du trafic payant).
 */
export function formatChf(value: number, en: boolean): string {
  return thousands(value, en ? "," : " ");
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
