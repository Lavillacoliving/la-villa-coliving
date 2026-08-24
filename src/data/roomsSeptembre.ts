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
   * 3 photos. photos[0] = l'atout de SA maison (décision produit du brief :
   * « la maison vend le rêve, la chambre signe le bail »), photos[1] = la chambre.
   * Chemins sous /images/lp-septembre/ — passés par scripts/optimize-images.mjs
   * pour obtenir les variantes responsive.
   */
  photos: { src: string; alt: { fr: string; en: string } }[];
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
        src: "/images/lp-septembre/lelodge-parc.webp",
        alt: {
          fr: "Le grand parc du Lodge, à Annemasse",
          en: "The Lodge's large park, in Annemasse",
        },
      },
      {
        src: "/images/lp-septembre/chambre-4-lelodge-1.webp",
        alt: {
          fr: "Chambre 4 du Lodge, 20 m² côté jardin",
          en: "Room 4 at the Lodge, 20 sqm on the garden side",
        },
      },
      {
        src: "/images/lp-septembre/chambre-4-lelodge-2.webp",
        alt: {
          fr: "Salle d'eau privative de la chambre 4",
          en: "Room 4's private shower room",
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
        src: "/images/lp-septembre/chambre-8-lavilla-balcon.webp",
        alt: {
          fr: "Vue sur la piscine depuis le balcon privatif de la chambre 8",
          en: "Pool view from room 8's private balcony",
        },
      },
      {
        src: "/images/lp-septembre/chambre-8-lavilla-1.webp",
        alt: {
          fr: "Chambre 8 de La Villa, 18 m² plein sud",
          en: "Room 8 at La Villa, 18 sqm facing south",
        },
      },
      {
        src: "/images/lp-septembre/chambre-8-lavilla-2.webp",
        alt: {
          fr: "Coin bureau de la chambre 8, avec sa grande baie",
          en: "Room 8's desk nook and its large window",
        },
      },
    ],
  },
];

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
