/**
 * Photos de L'Appart (manifeste de l'agent « photos » du 13/11/2026, 10 fichiers publiés) — source unique : chemins, tailles
 * réelles, textes alternatifs FR/EN, emploi. Fichiers : public/images/lappart/ (WebP ≤ 1 920 px, aucune métadonnée — test
 * tools/test/image-metadata.test.mjs).
 *
 * Règles (décisions de Jérôme du 12/11/2026, critique du 13/11) :
 *  - (21/11/2026, photos de Jérôme) les chambres ont leur photo, dans src/data/appartCovers.ts : une chambre de 12 m² TYPE
 *    pour les chambres 2 à 4 (texte alternatif générique, jamais « Chambre 2 » sur une photo partagée) et la suite ; le séjour
 *    a une nouvelle photo (lappart-sejour-1, qui remplace lappart-cheminee-1) ;
 *  - les textes alternatifs ne disent que ce qui se voit, ne nomment pas une pièce non confirmée et ne citent ni la rue, ni
 *    la façade, ni la vue côté rue ; la ville et le quartier une seule fois, sur l'image du haut. Pièces confirmées par Jérôme
 *    le 19/11/2026 (V2-30) : la cheminée est au séjour, les placards dans l'entrée — leurs textes les nomment ; le balcon, la
 *    salle d'eau et le WC restent sans nom de pièce (ni « commun », ni « de la suite ») ;
 *  - deux paires de clichés identiques (cuisine-5 / cuisine-2, cuisine-4 / cuisine-1) : jamais les deux d'une paire dans
 *    l'album ;
 *  - noms de fichiers neutres (« placards ») : gardés tels quels après la confirmation du 19/11/2026 (un nom de
 *    fichier est public et déjà dans les liens).
 *
 * Module pur, zéro React. (Corrections du 13/11/2026, relecture technique) L'image du haut et celle des cartes vivent dans
 * src/data/appartCovers.ts, réexporté ici (mêmes noms pour les gardes et les tests) : les pages des maisons et le bloc statique
 * ne chargent plus l'album pour une seule image.
 */
import { LAPPART_CUISINE_2, LAPPART_HERO, LAPPART_ROOM_COVER, LAPPART_ROOM_STANDARD_PHOTO, LAPPART_SUITE_PHOTO, type AppartPhoto } from "./appartCovers";

export * from "./appartCovers";

const DIR = "/images/lappart";

const kitchen1: AppartPhoto = {
  src: `${DIR}/lappart-cuisine-1.webp`, w: 1440, h: 1920, category: "common",
  alt: { fr: "Cuisine de L'Appart : meubles noirs, plan de travail en bois et quatre ampoules suspendues", en: "Kitchen at L'Appart: black units, wooden worktop and four pendant bulbs" },
};
const kitchen2: AppartPhoto = LAPPART_CUISINE_2;
const kitchen3: AppartPhoto = {
  src: `${DIR}/lappart-cuisine-3.webp`, w: 1306, h: 1920, category: "common",
  alt: { fr: "Cuisine de L'Appart : plaque de cuisson, électroménager encastré et rangements noirs du sol au plafond", en: "Kitchen at L'Appart: hob, built-in appliances and floor-to-ceiling black units" },
};
// (21/11/2026, photos de Jérôme) Le séjour en grand angle : remplace l'ancien cliché de la cheminée (lappart-cheminee-1).
const living1: AppartPhoto = {
  src: `${DIR}/lappart-sejour-1.webp`, w: 1170, h: 791, category: "common",
  alt: { fr: "Séjour de L'Appart : canapé en cuir blanc, table basse en bois et cheminée aux portes vitrées", en: "Living room at L'Appart: white leather sofa, wooden coffee table and fireplace with glass doors" },
};
const balcony1: AppartPhoto = {
  src: `${DIR}/lappart-balcon-1.webp`, w: 679, h: 913, category: "exterior",
  alt: { fr: "Balcon de L'Appart : deux fauteuils tressés et une table d'appoint au soleil", en: "Balcony at L'Appart: two woven armchairs and a side table in the sun" },
};
const cupboards1: AppartPhoto = {
  src: `${DIR}/lappart-placards-1.webp`, w: 1920, h: 1440, category: "interior",
  alt: { fr: "Entrée de L'Appart : placards intégrés blancs et noirs, banquette et parquet en chêne", en: "Entrance hall at L'Appart: built-in white and black cupboards, bench seat and oak floor" },
};
const showerRoom1: AppartPhoto = {
  src: `${DIR}/lappart-salle-eau-1.webp`, w: 1112, h: 1482, category: "interior",
  alt: { fr: "Salle d'eau de L'Appart : douche à l'italienne, murs sombres et robinetterie couleur laiton", en: "Shower room at L'Appart: walk-in shower, dark walls and brass-tone fittings" },
};
const toilet1: AppartPhoto = {
  src: `${DIR}/lappart-wc-1.webp`, w: 1239, h: 1920, category: "interior",
  alt: { fr: "WC de L'Appart : toilettes suspendues et mur en mosaïque aux tons cuivrés", en: "Toilet at L'Appart: wall-hung WC and copper-tone mosaic wall" },
};

/** L'album des pièces communes, dans l'ordre d'affichage (8 photos ; les chambres ont la leur, src/data/appartCovers.ts). */
export const LAPPART_ALBUM: readonly AppartPhoto[] = [kitchen1, kitchen2, kitchen3, living1, balcony1, cupboards1, showerRoom1, toilet1];

/** Les 6 vignettes de l'album, par `src`, dans l'ordre (propres à L'Appart, hors de ALBUM_COVERS des maisons). */
export const LAPPART_ALBUM_COVERS: readonly string[] = [kitchen1.src, living1.src, kitchen3.src, balcony1.src, cupboards1.src, showerRoom1.src];

/** Tous les fichiers publiés de L'Appart (12 depuis le 21/11/2026), pour les tests : chacun existe dans public/, aucun autre n'y est. Une fonction, et
 *  non une constante calculée : un calcul au chargement du module garderait l'album entier dans chaque morceau qui importe ce
 *  module pour la seule image des cartes (RoomCard, par roomPhotos.ts). */
export function lappartPhotoFiles(): string[] {
  return [...new Set([LAPPART_HERO.wide.src, LAPPART_HERO.tall.src, LAPPART_ROOM_COVER.src, LAPPART_ROOM_STANDARD_PHOTO.src, LAPPART_SUITE_PHOTO.src, ...LAPPART_ALBUM.map((p) => p.src)])];
}
