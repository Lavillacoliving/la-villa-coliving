#!/usr/bin/env node
/**
 * B4a — Re-encode oversized images in public/images to lean WebP.
 *
 * For each image "basename" whose current .webp is over TARGET (or missing),
 * re-encode from the best available source (original .jpg/.png preferred for
 * quality, else the existing .webp) to WebP quality 75, capped at 1920px wide.
 * Writes to a temp file and atomically replaces the .webp ONLY if the result is
 * smaller — so we never make a file bigger (fixes the "webp heavier than jpg" cases).
 * Originals (.jpg/.png) are kept untouched. Safe to re-run (idempotent: files
 * already <= TARGET are skipped).
 *
 * Usage: node scripts/optimize-images.cjs
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..', 'public', 'images');
const MAX_WIDTH = 1920;
const QUALITY = 75;
const TARGET = 200 * 1024; // 200 KB
const EXTS = ['.jpg', '.jpeg', '.png', '.webp'];

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

(async () => {
  const files = walk(ROOT).filter((f) => EXTS.includes(path.extname(f).toLowerCase()));
  const byBase = {};
  for (const f of files) {
    const ext = path.extname(f).toLowerCase();
    const base = f.slice(0, -ext.length);
    (byBase[base] = byBase[base] || {})[ext] = f;
  }

  let optimized = 0;
  let skipped = 0;
  let saved = 0;

  for (const base of Object.keys(byBase)) {
    const e = byBase[base];
    const webpPath = base + '.webp';
    const webpSize = e['.webp'] ? fs.statSync(e['.webp']).size : 0;

    // Already-lean webp → leave it alone.
    if (webpSize && webpSize <= TARGET) { skipped++; continue; }

    // Prefer the original (less generational loss) as the encode source.
    const src = e['.jpg'] || e['.jpeg'] || e['.png'] || e['.webp'];
    if (!src) continue;
    const before = webpSize || fs.statSync(src).size;

    const tmp = webpPath + '.tmp';
    try {
      const buf = fs.readFileSync(src);
      await sharp(buf)
        // Cap the LONGEST side to MAX_WIDTH (fit inside the box) so tall portraits
        // (e.g. 1920x2560) are also downscaled, not just wide landscapes.
        .resize({ width: MAX_WIDTH, height: MAX_WIDTH, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(tmp);
    } catch (err) {
      console.error(`x ${path.relative(ROOT, src)}: ${err.message}`);
      if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
      continue;
    }

    const after = fs.statSync(tmp).size;
    if (!webpSize || after < webpSize) {
      fs.renameSync(tmp, webpPath);
      saved += before - after;
      optimized++;
      console.log(`ok ${path.relative(ROOT, webpPath)}  ${Math.round(before / 1024)}KB -> ${Math.round(after / 1024)}KB`);
    } else {
      fs.unlinkSync(tmp); // new version not smaller — keep the existing one
      skipped++;
    }
  }

  console.log(`\nDone. Optimized ${optimized}, skipped ${skipped}. Saved ${(saved / 1024 / 1024).toFixed(1)} MB.`);
})();
