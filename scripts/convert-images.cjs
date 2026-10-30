/**
 * Script de conversion JPG/PNG → WebP
 * Usage: node scripts/convert-images.cjs
 *
 * - Convertit tous les JPG et PNG dans public/images/ en WebP
 * - Qualité 80, largeur max 1920px
 * - Conserve les originaux sur le disque (ne les supprime pas) ; ils sont ignorés par git (.gitignore) :
 *   seul le .webp part en déploiement
 * - Les pages référencent le .webp ; un ancien lien .jpg reçoit le .webp (rewrite de secours, scripts/prerender.mjs)
 * - Skip les fichiers déjà convertis (.webp existant)
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');
const QUALITY = 80;
const MAX_WIDTH = 1920;

let converted = 0;
let skipped = 0;
let errors = 0;
let totalSavedBytes = 0;

async function findImages(dir) {
  const results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results.push(...await findImages(fullPath));
    } else if (/\.(jpg|jpeg|png)$/i.test(item.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

async function convertImage(inputPath) {
  const outputPath = inputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');

  // Skip if WebP already exists and is newer
  if (fs.existsSync(outputPath)) {
    const inputStat = fs.statSync(inputPath);
    const outputStat = fs.statSync(outputPath);
    if (outputStat.mtimeMs >= inputStat.mtimeMs) {
      skipped++;
      return;
    }
  }

  try {
    const inputStats = fs.statSync(inputPath);
    const inputSize = inputStats.size;

    await sharp(inputPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    const outputStats = fs.statSync(outputPath);
    const outputSize = outputStats.size;
    const saved = inputSize - outputSize;
    const savedPct = ((saved / inputSize) * 100).toFixed(1);

    totalSavedBytes += saved;
    converted++;

    const relativePath = path.relative(IMAGES_DIR, inputPath);
    console.log(`✓ ${relativePath}: ${(inputSize/1024).toFixed(0)}KB → ${(outputSize/1024).toFixed(0)}KB (-${savedPct}%)`);
  } catch (err) {
    errors++;
    const relativePath = path.relative(IMAGES_DIR, inputPath);
    console.error(`✗ ${relativePath}: ${err.message}`);
  }
}

async function main() {
  console.log('🔄 Conversion JPG/PNG → WebP');
  console.log(`   Dossier: ${IMAGES_DIR}`);
  console.log(`   Qualité: ${QUALITY}, Max largeur: ${MAX_WIDTH}px`);
  console.log('---');

  const images = await findImages(IMAGES_DIR);
  console.log(`   ${images.length} images trouvées\n`);

  for (const img of images) {
    await convertImage(img);
  }

  console.log('\n--- RÉSULTAT ---');
  console.log(`✓ Converties: ${converted}`);
  console.log(`⏭ Skippées: ${skipped}`);
  console.log(`✗ Erreurs: ${errors}`);
  console.log(`💾 Espace économisé: ${(totalSavedBytes / 1024 / 1024).toFixed(1)} Mo`);
}

main().catch(console.error);
