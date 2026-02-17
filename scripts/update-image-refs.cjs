/**
 * Script pour mettre à jour les références d'images dans le code source
 * JPG/PNG → WebP
 *
 * Usage: node scripts/update-image-refs.cjs
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');
const EXTENSIONS = ['.tsx', '.ts', '.css'];

let totalReplacements = 0;
let filesModified = 0;

function findSourceFiles(dir) {
  const results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results.push(...findSourceFiles(fullPath));
    } else if (EXTENSIONS.some(ext => item.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

function updateReferences(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Replace .jpg references in image paths (but not in URLs or external refs)
  // Match patterns like: "/images/xxx.jpg" or '/images/xxx.jpg'
  const jpgPattern = /(\/images\/[^"']+)\.(jpg|jpeg|png)/gi;

  let count = 0;
  content = content.replace(jpgPattern, (match, imgPath, ext) => {
    count++;
    return `${imgPath}.webp`;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    const relativePath = path.relative(path.join(__dirname, '..'), filePath);
    console.log(`✓ ${relativePath}: ${count} remplacement(s)`);
    totalReplacements += count;
    filesModified++;
  }
}

function main() {
  console.log('🔄 Mise à jour des références images: JPG/PNG → WebP');
  console.log(`   Dossier: ${SRC_DIR}`);
  console.log('---\n');

  const files = findSourceFiles(SRC_DIR);

  for (const file of files) {
    updateReferences(file);
  }

  console.log(`\n--- RÉSULTAT ---`);
  console.log(`✓ Fichiers modifiés: ${filesModified}`);
  console.log(`✓ Remplacements: ${totalReplacements}`);
}

main();
