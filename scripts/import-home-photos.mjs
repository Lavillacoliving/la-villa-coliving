#!/usr/bin/env node
/**
 * Import des vraies photos du dossier PHOTOS de Jérôme (brief « Accueil : récit, avis, photos » du 27/11/2026, lot 2a, §0.2
 * et §0.8) vers public/images, en WebP, SANS aucune métadonnée (ni GPS, ni appareil, ni nom de photographe : sharp n'écrit
 * aucune métadonnée par défaut), orientation EXIF appliquée, converties en sRGB.
 *
 * - Le dossier PHOTOS est en LECTURE SEULE : rien n'y est écrit, renommé ni supprimé.
 * - Les noms publiés n'ont pas d'espace (pas d'encodage %20 dans srcset ni dans le préchargement du haut de page).
 * - Jamais d'agrandissement : la largeur publiée est min(largeur source après recadrage, `max`).
 * - `crop` : recadrage au rapport du cadre d'affichage, à la position donnée (même rendu qu'`object-fit: cover` avec
 *   `object-position`, §0.9) — moins d'octets pour les photos dont le cadre a toujours le même rapport. Sans `crop`, la
 *   photo garde son cadrage (haut de page et bande : cadres de rapports différents sur ordinateur et sur mobile).
 * - Les variantes -w480/-w960 et le manifeste src/data/responsiveImages.ts sont produits ensuite par
 *   scripts/optimize-images.mjs (une seule chaîne pour toutes les images du site).
 *
 * Usage : LVC_PHOTOS_DIR="/chemin/vers/PHOTOS" node scripts/import-home-photos.mjs
 */
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');
const PHOTOS = process.env.LVC_PHOTOS_DIR;
if (!PHOTOS) {
  console.error('✗ LVC_PHOTOS_DIR manquant (dossier PHOTOS de Jérôme, lecture seule).');
  process.exit(1);
}

/** @type {{ src: string; out: string; max: number; quality: number; crop?: { ratio: number; x: number; y: number } }[]} */
export const HOME_PHOTOS = [
  // n° 1 — haut de page (photo remise par Jérôme le 27/11 : recadrage 16:9 de LA VILLA/EXTERIEURS/IMG_6681.jpeg).
  { src: 'REFONTE SITE/hero-villa-coliving.jpg', out: '/images/accueil/hero-la-villa.webp', max: 1600, quality: 30 },
  // n° 2 à 4 — cartes maisons, cadre 3:2.
  { src: 'REFONTE SITE/2. Carte La Villa.jpeg', out: '/images/accueil/carte-la-villa.webp', max: 960, quality: 80, crop: { ratio: 3 / 2, x: 0.5, y: 0.5 } },
  { src: 'REFONTE SITE/3. Carte Le Loft.jpg', out: '/images/accueil/carte-le-loft.webp', max: 960, quality: 72, crop: { ratio: 3 / 2, x: 0.5, y: 0.6 } },
  { src: 'REFONTE SITE/4. Carte Le Lodge.jpeg', out: '/images/accueil/carte-le-lodge.webp', max: 960, quality: 72, crop: { ratio: 3 / 2, x: 0.5, y: 0.62 } },
  // n° 5 à 7 — récit, cadre 16:10.
  { src: 'REFONTE SITE/5. tu pose tes valises.jpg', out: '/images/accueil/recit-chambre-lodge.webp', max: 1600, quality: 70, crop: { ratio: 16 / 10, x: 0.5, y: 0.5 } },
  { src: 'LE LOFT/COMMUNS/photoshoot Fanny - immo - Vincent Sastre - R06_3988.jpg', out: '/images/accueil/recit-cuisine-loft.webp', max: 1600, quality: 70, crop: { ratio: 16 / 10, x: 0.5, y: 0.5 } },
  { src: 'REFONTE SITE/7. recit une maison de 7 à 12 personnes.jpg', out: '/images/accueil/recit-salon-lodge.webp', max: 1600, quality: 70, crop: { ratio: 16 / 10, x: 0.5, y: 0.5 } },
  // n° 8 — bande « Ce qui ne se vit qu'ici » (cadre large sur ordinateur, 16:10 env. sur mobile : pas de recadrage).
  { src: "REFONTE SITE/8. ce qui ne se vit qu'ici .jpg", out: '/images/accueil/bande-sauna-air-hockey-lodge.webp', max: 1600, quality: 70 },
  // n° 9 — section Avis, cadre carré.
  { src: 'Communauté/IMG_9620.jpg', out: '/images/accueil/avis-diner-piscine-la-villa.webp', max: 960, quality: 74, crop: { ratio: 1, x: 0.55, y: 0.62 } },
  // n° 10 à 15 — rangée de vie, cadre 3:2.
  { src: 'REFONTE SITE/Cours de Yoga.jpeg', out: '/images/accueil/vie-yoga-la-villa.webp', max: 960, quality: 70, crop: { ratio: 3 / 2, x: 0.5, y: 0.78 } },
  { src: 'Communauté/IMG_9645.jpg', out: '/images/accueil/vie-soiree-pizza.webp', max: 960, quality: 72, crop: { ratio: 3 / 2, x: 0.5, y: 0.4 } },
  { src: 'Communauté/IMG_9615.jpg', out: '/images/accueil/vie-tartiflette.webp', max: 960, quality: 72, crop: { ratio: 3 / 2, x: 0.5, y: 0.6 } },
  { src: 'Communauté/IMG_9646.jpg', out: '/images/accueil/vie-halloween-loft.webp', max: 960, quality: 72, crop: { ratio: 3 / 2, x: 0.5, y: 0.62 } },
  { src: 'Communauté/IMG_9618.jpg', out: '/images/accueil/vie-barbecue.webp', max: 960, quality: 72, crop: { ratio: 3 / 2, x: 0.5, y: 0.38 } },
  { src: 'ACTIVITES & ILLUSTRATIONS/IMG_6111.jpg', out: '/images/accueil/vie-coaching-la-villa.webp', max: 960, quality: 72, crop: { ratio: 3 / 2, x: 0.5, y: 0.36 } },
  // §0.8 (D15) — photos réelles du chalet fitness du Lodge, à la place des deux images générées de la galerie.
  { src: 'LE LODGE/1-38.jpg', out: '/images/le lodge/amenities/le-lodge-chalet-fitness-1.webp', max: 1536, quality: 72 },
  { src: 'LE LODGE/1-39.jpg', out: '/images/le lodge/amenities/le-lodge-chalet-fitness-2.webp', max: 1536, quality: 72 },
];

/** Fenêtre de recadrage (équivalent d'object-fit: cover + object-position). */
function cropBox(w, h, { ratio, x, y }) {
  if (w / h > ratio) {
    const cw = Math.round(h * ratio);
    return { left: Math.round((w - cw) * x), top: 0, width: cw, height: h };
  }
  const ch = Math.round(w / ratio);
  return { left: 0, top: Math.round((h - ch) * y), width: w, height: ch };
}

/** Le dossier « Communauté » peut être écrit en NFC ou NFD selon l'outil qui l'a créé. */
async function resolveSource(rel) {
  for (const form of ['NFC', 'NFD']) {
    const p = path.join(PHOTOS, rel.normalize(form));
    try { await fs.access(p); return p; } catch { /* autre forme */ }
  }
  throw new Error(`source introuvable : ${rel}`);
}

let failed = 0;
for (const item of HOME_PHOTOS) {
  try {
    const abs = await resolveSource(item.src);
    // Orientation EXIF appliquée d'abord : les dimensions qui suivent sont celles de l'image redressée.
    const upright = await sharp(abs).rotate().toBuffer({ resolveWithObject: true });
    let pipeline = sharp(upright.data);
    let { width: w, height: h } = upright.info;
    if (item.crop) {
      const box = cropBox(w, h, item.crop);
      pipeline = pipeline.extract(box);
      ({ width: w, height: h } = box);
    }
    const outW = Math.min(w, item.max);
    const dest = path.join(PUBLIC, item.out);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    const info = await pipeline
      .resize({ width: outW, withoutEnlargement: true })
      .toColourspace('srgb')
      .webp({ quality: item.quality, effort: 6, smartSubsample: true })
      .toFile(dest);
    console.log(`+ ${item.out}  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} Ko  (source ${upright.info.width}×${upright.info.height})`);
  } catch (e) {
    failed++;
    console.error(`✗ ${item.src} → ${item.out} : ${e.message}`);
  }
}
if (failed) process.exit(1);
