/**
 * Vignettes de l'album de chaque maison : les 6 photos montrées sur la page, avant le bouton « Voir les N photos ».
 *
 * Choisies à la main et validées par Jérôme le 11/11/2026. Le choix automatique (albumPicks, src/lib/gallery.ts) oubliait
 * la piscine intérieure du Loft et montrait deux gros plans au Lodge (carte d'accueil, coin de bureau).
 *
 * Chaque entrée est le `src` d'une photo de `photoGallery` (src/pages/HouseDetailPage.tsx), dans l'ordre d'affichage.
 * Une photo retirée de l'album est ignorée et remplacée par le choix automatique (albumCover) ; le test
 * tools/test/gallery.test.mjs échoue dès qu'une entrée ne correspond plus à une photo de l'album.
 */
export const ALBUM_COVERS: Record<string, string[]> = {
  // façade et piscine · salon · salle de jeux · chambre · sauna · salle de sport
  lavilla: [
    "/images/la villa/exterior/villa_portrait.webp",
    "/images/la villa/common areas/La Villa-9.webp",
    "/images/la villa/interior/La Villa-105.webp",
    "/images/la villa/rooms/La Villa-92.webp",
    "/images/la villa/amenities/La Villa-37.webp",
    "/images/la villa/amenities/La Villa-11.webp",
  ],
  // piscine intérieure · salon · dîner entre résidents · chambre · sauna · jardin
  leloft: [
    "/images/le loft/amenities/la villa coliving le loft-93.webp",
    "/images/le loft/common areas/la villa coliving le loft-63.webp",
    "/images/le loft/exterior/le loft glamour.webp",
    "/images/le loft/rooms/la villa coliving le loft-52.webp",
    "/images/le loft/amenities/la villa coliving le loft-2.webp",
    "/images/le loft/exterior/la villa coliving le loft-25.webp",
  ],
  // piscine · salon · chambre · chalet fitness · sauna · cuisine
  lelodge: [
    "/images/le lodge/exterior/le lodge piscine.webp",
    "/images/le lodge/common areas/la villa coliving le lodge-39.webp",
    "/images/le lodge/rooms/la villa coliving le lodge-67.webp",
    "/images/le lodge/amenities/la villa coliving le lodge-122.webp",
    "/images/le lodge/amenities/la villa coliving le lodge-57.webp",
    "/images/le lodge/amenities/la villa coliving le lodge-29.webp",
  ],
};
