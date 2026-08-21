// Miroir Node de `src/lib/siteLinks.ts` → `HREFLANG_NO_ALTERNATES`.
//
// Les scripts de build (`prerender.mjs`, `inject-prerendered.mjs`) ne peuvent pas
// importer le fichier TS : ce fichier existe uniquement pour ça. Toute entrée
// ajoutée ici doit l'être aussi là-bas, et réciproquement.
//
// Le check #13 de `seo-lint.mjs` compare HTML / sitemap / cette liste et échoue
// en cas de divergence — c'est le filet qui rend la duplication acceptable.
//
// Voir `src/lib/siteLinks.ts` pour le raisonnement complet (pilier EN orphelin
// après la consolidation du 07/07/2026).

// Vide depuis le revert du pilier FR (25/08/2026) — voir src/lib/siteLinks.ts.
export const HREFLANG_NO_ALTERNATES = new Set([]);
