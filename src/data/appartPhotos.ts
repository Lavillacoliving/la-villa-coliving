/**
 * Photos de L'Appart (manifeste de l'agent « photos » du 13/11/2026, 10 fichiers publiés) — source unique : chemins, tailles
 * réelles, textes alternatifs FR/EN, emploi. Fichiers : public/images/lappart/ (WebP ≤ 1 920 px, aucune métadonnée — test
 * tools/test/image-metadata.test.mjs).
 *
 * Règles (décisions de Jérôme du 12/11/2026, critique du 13/11) :
 *  - aucune photo de chambre : « Photo de la chambre à venir » sur les cartes (la carte montre une pièce commune, avec SON
 *    texte alternatif — jamais « Chambre 2 — L'Appart » sur une photo de cuisine) ;
 *  - les textes alternatifs ne disent que ce qui se voit, ne nomment pas une pièce non confirmée et ne citent ni la rue, ni
 *    la façade, ni la vue côté rue ; la ville et le quartier une seule fois, sur l'image du haut ;
 *  - deux paires de clichés identiques (cuisine-5 / cuisine-2, cuisine-4 / cuisine-1) : jamais les deux d'une paire dans
 *    l'album ;
 *  - noms de fichiers neutres pour les deux pièces non confirmées (« cheminee », « placards », au lieu de « sejour » et
 *    « entree » : un nom de fichier est public).
 *
 * Module pur, sans import à l'exécution (le type vient de roomPhotos.ts et s'efface à la compilation).
 */
import type { RoomPhoto } from "./roomPhotos";

const DIR = "/images/lappart";

export type AppartPhotoCategory = "common" | "interior" | "exterior";
export type AppartPhoto = RoomPhoto & { category: AppartPhotoCategory };
/** Image avec son point focal (`object-position` conseillé pour un cadre très large). */
export type AppartFramedPhoto = RoomPhoto & { focal: string };

const kitchen1: AppartPhoto = {
  src: `${DIR}/lappart-cuisine-1.webp`, w: 1440, h: 1920, category: "common",
  alt: { fr: "Cuisine de L'Appart : meubles noirs, plan de travail en bois et quatre ampoules suspendues", en: "Kitchen at L'Appart: black units, wooden worktop and four pendant bulbs" },
};
const kitchen2: AppartPhoto = {
  src: `${DIR}/lappart-cuisine-2.webp`, w: 1800, h: 1920, category: "common",
  alt: { fr: "Cuisine de L'Appart : plaque de cuisson, grande suspension à facettes et plan de travail en bois", en: "Kitchen at L'Appart: hob, large faceted pendant and wooden worktop" },
};
const kitchen3: AppartPhoto = {
  src: `${DIR}/lappart-cuisine-3.webp`, w: 1306, h: 1920, category: "common",
  alt: { fr: "Cuisine de L'Appart : plaque de cuisson, électroménager encastré et rangements noirs du sol au plafond", en: "Kitchen at L'Appart: hob, built-in appliances and floor-to-ceiling black units" },
};
const fireplace1: AppartPhoto = {
  src: `${DIR}/lappart-cheminee-1.webp`, w: 1920, h: 1087, category: "common",
  alt: { fr: "L'Appart : cheminée aux portes vitrées à cadre laiton et parquet en chêne", en: "L'Appart: fireplace with brass-framed glass doors and oak floor" },
};
const balcony1: AppartPhoto = {
  src: `${DIR}/lappart-balcon-1.webp`, w: 679, h: 913, category: "exterior",
  alt: { fr: "Balcon de L'Appart : deux fauteuils tressés et une table d'appoint au soleil", en: "Balcony at L'Appart: two woven armchairs and a side table in the sun" },
};
const cupboards1: AppartPhoto = {
  src: `${DIR}/lappart-placards-1.webp`, w: 1920, h: 1440, category: "interior",
  alt: { fr: "L'Appart : placards intégrés blancs et noirs, banquette et parquet en chêne", en: "L'Appart: built-in white and black cupboards, bench seat and oak floor" },
};
const showerRoom1: AppartPhoto = {
  src: `${DIR}/lappart-salle-eau-1.webp`, w: 1112, h: 1482, category: "interior",
  alt: { fr: "Salle d'eau de L'Appart : douche à l'italienne, murs sombres et robinetterie couleur laiton", en: "Shower room at L'Appart: walk-in shower, dark walls and brass-tone fittings" },
};
const toilet1: AppartPhoto = {
  src: `${DIR}/lappart-wc-1.webp`, w: 1239, h: 1920, category: "interior",
  alt: { fr: "WC de L'Appart : toilettes suspendues et mur en mosaïque aux tons cuivrés", en: "Toilet at L'Appart: wall-hung WC and copper-tone mosaic wall" },
};

/** L'album des pièces communes, dans l'ordre d'affichage (8 photos ; les chambres : photos à venir). */
export const LAPPART_ALBUM: readonly AppartPhoto[] = [kitchen1, kitchen2, kitchen3, fireplace1, balcony1, cupboards1, showerRoom1, toilet1];

/** Les 6 vignettes de l'album, par `src`, dans l'ordre (propres à L'Appart, hors de ALBUM_COVERS des maisons). */
export const LAPPART_ALBUM_COVERS: readonly string[] = [kitchen1.src, fireplace1.src, kitchen3.src, balcony1.src, cupboards1.src, showerRoom1.src];

/** Image du haut : format large (tablette, ordinateur, partage og:image et JSON-LD, vignette « L'Appart » des autres pages)
 *  et format en hauteur (téléphone) — même cliché, côté plaque de cuisson (recommandation n° 46, à confirmer). */
export const LAPPART_HERO: { readonly wide: AppartFramedPhoto; readonly tall: AppartFramedPhoto } = {
  wide: {
    src: `${DIR}/lappart-cuisine-5.webp`, w: 1920, h: 1080, focal: "66% 20%",
    alt: { fr: "L'Appart, colocation à Annemasse, quartier de la gare : la cuisine au soleil, plaque de cuisson et grande suspension à facettes", en: "L'Appart, flatshare in Annemasse, near the station: the sunlit kitchen with its hob and large faceted pendant" },
  },
  tall: { ...kitchen2, focal: "65% 40%" },
};

/** Image des cartes de chambres de L'Appart (aucune photo de chambre) : la cuisine côté évier, avec SON texte alternatif et la
 *  légende « Photo de la chambre à venir » (RoomCard). Hors album (même cliché que cuisine-1). */
export const LAPPART_ROOM_COVER: AppartFramedPhoto = {
  src: `${DIR}/lappart-cuisine-4.webp`, w: 1920, h: 1080, focal: "42% 35%",
  alt: { fr: "Cuisine ouverte de L'Appart : évier avec mitigeur noir, plan de travail en bois et rangements noirs", en: "Open kitchen at L'Appart: sink with black tap, wooden worktop and black units" },
};

/** Tous les fichiers publiés de L'Appart (10), pour les tests : chacun existe dans public/, aucun autre n'y est. Une fonction, et
 *  non une constante calculée : un calcul au chargement du module garderait l'album entier dans chaque morceau qui importe ce
 *  module pour la seule image des cartes (RoomCard, par roomPhotos.ts). */
export function lappartPhotoFiles(): string[] {
  return [...new Set([LAPPART_HERO.wide.src, LAPPART_HERO.tall.src, LAPPART_ROOM_COVER.src, ...LAPPART_ALBUM.map((p) => p.src)])];
}
