/**
 * L'Appart — l'image du haut (/lappart, bloc statique des pages de la marque, partage) et l'image des cartes de chambres (manifeste
 * de l'agent « photos » du 13/11/2026 ; règles : src/data/appartPhotos.ts, qui réexporte ce module).
 *
 * (Corrections du 13/11/2026, relecture technique) Module à part : RoomCard (par roomPhotos.ts, sur toutes les pages qui montrent
 * une carte) et le bloc statique n'ont besoin que de ces deux images ; ils ne chargent plus l'album et ses textes alternatifs.
 * Aucun chemin ni texte ne change. Module pur, sans import à l'exécution (le type vient de roomPhotos.ts et s'efface à la
 * compilation).
 */
import type { RoomPhoto } from "./roomPhotos";

const DIR = "/images/lappart";

export type AppartPhotoCategory = "common" | "interior" | "exterior";
export type AppartPhoto = RoomPhoto & { category: AppartPhotoCategory };
/** Image avec son point focal (`object-position` conseillé pour un cadre très large). */
export type AppartFramedPhoto = RoomPhoto & { focal: string };

/** La cuisine côté plaque, en hauteur : image du haut au téléphone et 2e photo de l'album (src/data/appartPhotos.ts). */
export const LAPPART_CUISINE_2: AppartPhoto = {
  src: `${DIR}/lappart-cuisine-2.webp`, w: 1800, h: 1920, category: "common",
  alt: { fr: "Cuisine de L'Appart : plaque de cuisson, grande suspension à facettes et plan de travail en bois", en: "Kitchen at L'Appart: hob, large faceted pendant and wooden worktop" },
};

/** Image du haut : format large (tablette, ordinateur, partage og:image et JSON-LD, vignette « L'Appart » des autres pages)
 *  et format en hauteur (téléphone) — même cliché, côté plaque de cuisson (recommandation n° 46, à confirmer). */
export const LAPPART_HERO: { readonly wide: AppartFramedPhoto; readonly tall: AppartFramedPhoto } = {
  wide: {
    src: `${DIR}/lappart-cuisine-5.webp`, w: 1920, h: 1080, focal: "66% 20%",
    alt: { fr: "L'Appart, colocation à Annemasse, quartier de la gare : la cuisine au soleil, plaque de cuisson et grande suspension à facettes", en: "L'Appart, flatshare in Annemasse, near the station: the sunlit kitchen with its hob and large faceted pendant" },
  },
  tall: { ...LAPPART_CUISINE_2, focal: "65% 40%" },
};

/** Image des cartes de chambres de L'Appart (aucune photo de chambre) : la cuisine côté évier, avec SON texte alternatif et la
 *  légende « Photo de la chambre à venir » (RoomCard). Hors album (même cliché que cuisine-1). */
export const LAPPART_ROOM_COVER: AppartFramedPhoto = {
  src: `${DIR}/lappart-cuisine-4.webp`, w: 1920, h: 1080, focal: "42% 35%",
  alt: { fr: "Cuisine ouverte de L'Appart : évier avec mitigeur noir, plan de travail en bois et rangements noirs", en: "Open kitchen at L'Appart: sink with black tap, wooden worktop and black units" },
};
