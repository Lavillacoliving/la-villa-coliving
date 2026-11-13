// Images publiées : aucune métadonnée de prise de vue (L'Appart, étape E2 ; décision n° 50 de la critique du 13/11/2026).
// Une photo de téléphone porte sa position GPS, l'appareil et la date : rien de tout cela ne doit partir en ligne.
//  1. Chaque WebP de public/ : aucun bloc EXIF, XMP ni profil ICC (lecture du conteneur RIFF, octet par octet).
//  2. Les photos de L'Appart : WebP valides, ≤ 1 920 px de large, tailles = celles du manifeste (src/data/appartPhotos.ts).
//  3. Les deux scripts de conversion redressent la photo (orientation EXIF appliquée aux pixels) et ne gardent aucune
//     métadonnée ; scripts/convert-images.cjs supprime un fichier qui en porterait encore.
//  4. La chaîne de sharp qu'ils emploient, sur une photo « couchée » avec position GPS : sortie debout, sans métadonnée.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { loadEntityFacts } from '../../scripts/lib/load-entity-facts.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const read = (rel) => readFileSync(path.join(ROOT, rel), 'utf8');

/** Blocs d'un fichier WebP (RIFF) : code à 4 lettres, taille, drapeaux du bloc VP8X ; dimensions du canevas. `null` si ce
 *  n'est pas un WebP. Ne lit que les en-têtes de blocs. Pure (fichier en lecture seule). */
export function webpInfo(buffer) {
  if (buffer.length < 12 || buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') return null;
  const chunks = [];
  let width = null, height = null;
  for (let off = 12; off + 8 <= buffer.length;) {
    const cc = buffer.toString('ascii', off, off + 4);
    const len = buffer.readUInt32LE(off + 4);
    const p = off + 8;
    const chunk = { cc, len };
    if (cc === 'VP8X' && p + 10 <= buffer.length) {
      chunk.flags = buffer[p];
      width = 1 + buffer.readUIntLE(p + 4, 3); height = 1 + buffer.readUIntLE(p + 7, 3);
    } else if (cc === 'VP8 ' && width === null && p + 10 <= buffer.length) {
      width = buffer.readUInt16LE(p + 6) & 0x3fff; height = buffer.readUInt16LE(p + 8) & 0x3fff;
    } else if (cc === 'VP8L' && width === null && p + 5 <= buffer.length) {
      const bits = buffer.readUInt32LE(p + 1);
      width = (bits & 0x3fff) + 1; height = ((bits >> 14) & 0x3fff) + 1;
    }
    chunks.push(chunk);
    off = p + len + (len & 1);
  }
  return { chunks, width, height };
}

/** Métadonnées d'un WebP : blocs EXIF / XMP / ICCP, et drapeaux VP8X correspondants (0x20 ICC, 0x08 EXIF, 0x04 XMP). */
export function webpMetadata(info) {
  const found = info.chunks.filter((c) => ['EXIF', 'XMP ', 'ICCP'].includes(c.cc)).map((c) => c.cc.trim());
  const vp8x = info.chunks.find((c) => c.cc === 'VP8X');
  if (vp8x && vp8x.flags & 0x2c) found.push(`drapeaux VP8X ${vp8x.flags & 0x2c}`);
  return found;
}

function filesUnder(dir, re) {
  const out = [];
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p); else if (re.test(e.name)) out.push(p);
    }
  };
  walk(dir);
  return out;
}

test('aucun WebP de public/ ne porte de métadonnées (EXIF, XMP, profil ICC)', () => {
  const files = filesUnder(path.join(ROOT, 'public'), /\.webp$/i);
  assert.ok(files.length > 600, `${files.length} fichiers lus`);
  const bad = [];
  for (const f of files) {
    const info = webpInfo(readFileSync(f));
    if (!info) { bad.push(`${path.relative(ROOT, f)} : pas un WebP`); continue; }
    const meta = webpMetadata(info);
    if (meta.length) bad.push(`${path.relative(ROOT, f)} : ${meta.join(', ')}`);
  }
  assert.deepEqual(bad, []);
});

test('photos de L\'Appart : WebP sans métadonnée, ≤ 1 920 px de large, tailles du manifeste, aucun autre fichier dans le dossier', async () => {
  const m = await loadEntityFacts();
  const dir = path.join(ROOT, 'public', 'images', 'lappart');
  const onDisk = readdirSync(dir).filter((f) => !f.startsWith('.')).map((f) => `/images/lappart/${f}`).sort();
  assert.deepEqual(onDisk, m.lappartPhotoFiles().sort());
  const declared = new Map([m.LAPPART_HERO.wide, m.LAPPART_HERO.tall, m.LAPPART_ROOM_COVER, ...m.LAPPART_ALBUM].map((p) => [p.src, p]));
  for (const src of onDisk) {
    const info = webpInfo(readFileSync(path.join(ROOT, 'public', src)));
    assert.ok(info, `${src} : pas un WebP`);
    assert.deepEqual(webpMetadata(info), [], src);
    assert.ok(info.width <= 1920, `${src} : ${info.width} px de large`);
    assert.deepEqual([info.width, info.height], [declared.get(src).w, declared.get(src).h], src);
  }
});

test('lecture du conteneur : un bloc EXIF, XMP ou ICC est vu, avec ou sans drapeau VP8X', () => {
  const chunk = (cc, data) => {
    const body = Buffer.concat([data, Buffer.alloc(data.length & 1)]);
    const h = Buffer.alloc(8); h.write(cc, 0, 'ascii'); h.writeUInt32LE(data.length, 4);
    return Buffer.concat([h, body]);
  };
  const riff = (...chunks) => {
    const payload = Buffer.concat([Buffer.from('WEBP', 'ascii'), ...chunks]);
    const h = Buffer.alloc(8); h.write('RIFF', 0, 'ascii'); h.writeUInt32LE(payload.length, 4);
    return Buffer.concat([h, payload]);
  };
  const vp8x = (flags, w, h) => { const d = Buffer.alloc(10); d[0] = flags; d.writeUIntLE(w - 1, 4, 3); d.writeUIntLE(h - 1, 7, 3); return chunk('VP8X', d); };
  const vp8l = Buffer.from([0x2f, 0, 0, 0, 0]);
  const clean = webpInfo(riff(vp8x(0, 800, 600), chunk('VP8L', vp8l)));
  assert.deepEqual(webpMetadata(clean), []);
  assert.deepEqual([clean.width, clean.height], [800, 600]);
  assert.deepEqual(webpMetadata(webpInfo(riff(vp8x(0x08, 800, 600), chunk('VP8L', vp8l), chunk('EXIF', Buffer.from('Exif\0\0GPS'))))), ['EXIF', 'drapeaux VP8X 8']);
  assert.deepEqual(webpMetadata(webpInfo(riff(vp8x(0, 10, 10), chunk('ICCP', Buffer.alloc(7)), chunk('VP8L', vp8l), chunk('XMP ', Buffer.from('<x/>'))))), ['ICCP', 'XMP']);
  assert.equal(webpInfo(Buffer.from('not a webp file')), null);
});

test('scripts de conversion : la photo est redressée avant d\'être réduite, aucune métadonnée gardée, garde après écriture', () => {
  const keep = /\.(?:withMetadata|keepMetadata|keepExif|keepIccProfile|withExif|withExifMerge|withIccProfile)\s*\(/;
  for (const rel of ['scripts/convert-images.cjs', 'scripts/optimize-images.cjs']) {
    const src = read(rel).replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
    assert.doesNotMatch(src, keep, `${rel} : garde des métadonnées`);
    const rotate = src.indexOf('.rotate()'), resize = src.indexOf('.resize(');
    assert.ok(rotate > 0 && resize > rotate, `${rel} : .rotate() avant .resize()`);
  }
  const convert = read('scripts/convert-images.cjs');
  assert.match(convert, /async function metadataLeftovers\(/);
  assert.match(convert, /\['exif', 'xmp', 'iptc', 'icc', 'tifftagPhotoshop'\]/);
  assert.match(convert, /fs\.unlinkSync\(outputPath\)/);
  assert.match(convert, /if \(errors > 0\) process\.exitCode = 1;/);
});

test('chaîne de sharp des scripts : une photo couchée avec position GPS sort debout et sans métadonnée', async (t) => {
  let sharp;
  try { sharp = createRequire(import.meta.url)('sharp'); } catch { t.skip('sharp absent'); return; }
  // Photo de téléphone simulée : 40 × 20 px stockés, orientation EXIF 6 (à faire pivoter de 90°), bloc GPS, profil sRGB.
  const jpeg = await sharp({ create: { width: 40, height: 20, channels: 3, background: { r: 200, g: 120, b: 40 } } })
    .jpeg()
    .withMetadata({ orientation: 6, exif: { IFD0: { Make: 'Essai' }, IFD3: { GPSLatitudeRef: 'N', GPSLatitude: '46/1 11/1 0/1' } } })
    .toBuffer();
  const before = await sharp(jpeg).metadata();
  assert.equal(before.orientation, 6);
  assert.ok(before.exif, 'le témoin porte bien un EXIF');
  // Même chaîne que scripts/convert-images.cjs (et optimize-images.cjs) après correctif.
  const webp = await sharp(jpeg).rotate().resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
  const info = webpInfo(webp);
  assert.deepEqual(webpMetadata(info), []);
  assert.deepEqual([info.width, info.height], [20, 40], 'photo redressée (debout)');
  const after = await sharp(webp).metadata();
  assert.equal(after.exif, undefined); assert.equal(after.icc, undefined); assert.equal(after.xmp, undefined);
  assert.ok(!after.orientation || after.orientation === 1);
});
