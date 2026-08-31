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
