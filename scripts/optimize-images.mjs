#!/usr/bin/env node
/**
 * Variantes responsive des images « héros / cartes » (R2 — checkpoint 21/08/2026).
 *
 * Pourquoi : Lighthouse mobile (21/08) — home LCP 7,3 s, /lelodge 9,1 s : les
 * héros sont servis en 1024-1920 px (jusqu'à 761 Ko) à des viewports de 375 px.
 * Ce script génère, À CÔTÉ de chaque original, des variantes `-w{largeur}.webp`
 * (qualité 78) et écrit le manifeste `src/data/responsiveImages.ts` consommé par
 * `src/lib/responsiveImage.ts` (srcset/sizes). Les originaux ne sont jamais
 * modifiés ; les `src=` des composants restent inchangés (fallback).
 *
 * Usage : node scripts/optimize-images.mjs   (idempotent — ne régénère que si
 * l'original est plus récent que la variante)
 */
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');
const MANIFEST = path.join(ROOT, 'src', 'data', 'responsiveImages.ts');

// Liste explicite : seules les images au-dessus de la ligne de flottaison ou en
// cartes répétées (home, maisons, nos-maisons, blocs offre du blog).
const SOURCES = [
  '/images/la villa jardin.webp',                                    // hero home + /lavilla
  '/images/la villa coliving le loft piscine.webp',                   // /leloft hero, home cards, bloc offre
  '/images/le lodge/exterior/la villa coliving le lodge-14.webp',     // /lelodge hero (761 Ko)
  '/images/la villa coliving le lodge-sauna2.webp',                   // home « uniques »
  '/images/la villa coliving le lodge-gym.webp',
  '/images/la villa yoga.webp',
  '/images/le loft glamour.webp',
  '/images/le lodge piscine.webp',                                    // home cards, nos-maisons
  '/images/villa_portrait.webp',                                      // home cards, nos-maisons
  '/images/le loft/amenities/la villa coliving le loft-94.webp',      // nos-maisons
  '/images/la villa.webp',                                            // bloc offre
  '/images/le lodge.webp',                                            // bloc offre
  // LP payante /chambres-septembre (brief LOT 2, 24/08/2026).
  // Hero : « la villa jardin.webp » (déjà listé plus haut — piscine extérieure,
  // maison et saule ; jeu responsive complet jusqu'à 1920).
  // 3 photos par carte chambre,
  // toutes au-dessus ou juste sous la ligne de flottaison mobile. La LP vise
  // LCP < 2,5 s : ces images DOIVENT avoir leurs variantes responsive.
  '/images/le lodge/rooms/Chambre 4/chambre-4-vue-large.webp',
  '/images/le lodge/rooms/Chambre 4/chambre-4-salle-eau.webp',
  '/images/la villa/rooms/Chambre 8/chambre-8-balcon-piscine.webp',
  '/images/la villa/rooms/Chambre 8/chambre-8-chambre.webp',
  '/images/la villa/rooms/Chambre 8/chambre-8-bureau.webp',
];
// Galeries (carrousel héros des 3 maisons) : les slides voisins du 1er sont chargés
// par le navigateur (lazy horizontal) — en pleine taille sans variantes.
const GALLERY_SOURCES = [
  "/images/la villa/rooms/La Villa-92.webp",
  "/images/la villa/rooms/La Villa-111.webp",
  "/images/la villa/interior/La Villa-105.webp",
  "/images/la villa/common areas/La Villa-113.webp",
  "/images/la villa/exterior/La Villa-110.webp",
  "/images/la villa/exterior/villa_portrait.webp",
  "/images/le loft/rooms/la villa coliving le loft-21.webp",
  "/images/le loft/rooms/la villa coliving le loft-24.webp",
  "/images/le loft/interior/Le loft salon.webp",
  "/images/le loft/exterior/le loft glamour.webp",
  "/images/le loft/exterior/le loft jardin.webp",
  "/images/le loft/common areas/la villa coliving le loft-67.webp",
  "/images/le lodge/rooms/la villa coliving le lodge-104.webp",
  "/images/le lodge/rooms/la villa coliving le lodge-105.webp",
  "/images/le lodge/exterior/le lodge piscine.webp",
  "/images/le lodge/interior/la villa coliving le lodge-85.webp",
  "/images/le lodge/common areas/la villa coliving le lodge-40.webp",
  "/images/le lodge/common areas/la villa coliving le lodge-23.webp"
];
for (const g of GALLERY_SOURCES) if (!SOURCES.includes(g)) SOURCES.push(g);

// Galeries de la LP payante (brief LOT 3, 26/08/2026) : les photos visibles
// UNIQUEMENT en lightbox. Elles ne sont jamais dans le flux de chargement de la
// page — mais une fois la visionneuse ouverte, on ne veut pas servir un 1920 à un
// écran de 412 px. Les 3 photos de carte de chaque chambre sont déjà listées plus haut.
const LP_LIGHTBOX_SOURCES = [
  // Chambre 4 · Le Lodge
  "/images/le lodge/rooms/Chambre 4/chambre-4-bureau.webp",
  "/images/le lodge/exterior/lodge-piscine-maison.webp",
  "/images/le lodge/exterior/lodge-hamac-jardin.webp",
  "/images/le lodge/common areas/lodge-salle-a-manger.webp",
  "/images/le lodge/amenities/la villa coliving le lodge-57.webp",   // sauna finlandais
  "/images/le lodge/amenities/la villa coliving le lodge-121.webp",  // salle de sport
  "/images/le lodge/amenities/la villa coliving le lodge-96.webp",   // home cinéma
  "/images/le lodge/interior/la villa coliving le lodge-85.webp",    // baby-foot
  // Chambre 8 · La Villa
  "/images/la villa/rooms/Chambre 8/chambre-8-vue-bureau.webp",
  "/images/la villa/rooms/Chambre 8/chambre-8-salle-eau.webp",
  "/images/la villa/rooms/La Villa-80.webp",                         // chambre, plan large
  "/images/la villa/amenities/La Villa-11.webp",                     // salle de sport
  "/images/la villa/amenities/La Villa-37.webp",                     // sauna infrarouge
  "/images/la villa/amenities/La Villa-42.webp",                     // baby-foot
  "/images/la villa/interior/La Villa-89.webp",                      // salon
];
for (const g of LP_LIGHTBOX_SOURCES) if (!SOURCES.includes(g)) SOURCES.push(g);

// Héros plein écran sous voile dégradé (Scrim) : qualité plus basse invisible à l'œil.
const QUALITY_OVERRIDES = {
  '/images/la villa jardin.webp': 58,
  '/images/le lodge/exterior/la villa coliving le lodge-14.webp': 58,
  '/images/la villa coliving le loft piscine.webp': 62,
};
const WIDTHS = [480, 768, 1024, 1440];
const QUALITY = 70; // les originaux sont déjà ~q70 : au-dessus, les variantes grossissent
const REENCODE_OVER_KB = 150; // original lourd → variante recompressée à sa largeur native

const variantPath = (src, w) => src.replace(/\.webp$/i, `-w${w}.webp`);

const manifest = {};
for (const src of SOURCES) {
  const abs = path.join(PUBLIC, src);
  let meta, stat;
  try { meta = await sharp(abs).metadata(); stat = await fs.stat(abs); }
  catch (e) { console.error(`✗ ${src} introuvable (${e.message})`); process.exitCode = 1; continue; }
  const widths = WIDTHS.filter(w => w < meta.width);
  if (stat.size / 1024 > REENCODE_OVER_KB && !widths.includes(meta.width)) widths.push(meta.width);
  const done = [];
  for (const w of widths) {
    const out = path.join(PUBLIC, variantPath(src, w));
    let fresh = false;
    try { fresh = (await fs.stat(out)).mtimeMs >= stat.mtimeMs; } catch { /* absent */ }
    if (!fresh) {
      await sharp(abs).resize({ width: w, withoutEnlargement: true }).webp({ quality: QUALITY_OVERRIDES[src] ?? QUALITY }).toFile(out);
    }
    const size = (await fs.stat(out)).size;
    if (size >= stat.size) {
      // Variante plus lourde que l'original (original déjà très compressé) : inutile.
      await fs.unlink(out);
      console.log(`- ${variantPath(src, w)}  ignorée (${Math.round(size / 1024)} Ko ≥ original ${Math.round(stat.size / 1024)} Ko)`);
      continue;
    }
    done.push(w);
    console.log(`${fresh ? '=' : '+'} ${variantPath(src, w)}  ${Math.round(size / 1024)} Ko`);
  }
  manifest[src] = { original: meta.width, widths: done, reencoded: done.includes(meta.width) };
}

const ts = `// GÉNÉRÉ par scripts/optimize-images.mjs — ne pas éditer à la main.
// Variantes \`-w{largeur}.webp\` présentes à côté des originaux dans public/.
export const RESPONSIVE_IMAGES: Record<string, { original: number; widths: number[]; reencoded: boolean }> = ${JSON.stringify(manifest, null, 2)};
`;
await fs.writeFile(MANIFEST, ts, 'utf8');
console.log(`\n✅ manifeste : ${path.relative(ROOT, MANIFEST)} (${Object.keys(manifest).length} images)`);
