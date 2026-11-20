// Frontière des deux gammes, côté code (L'Appart, étape E2 ; ARCHITECTURE § 1.6 b) : les fichiers de L'Appart n'importent
// aucune preuve ni table des maisons. Règles : scripts/lib/appart-boundary.mjs (aussi lues par eslint.config.js). Ce test double
// le lint, qui ne tourne ni en CI ni sans ESLint : il relit les imports de chaque fichier de L'Appart, quelle que soit la façon
// d'écrire le chemin (alias `@/`, relatif, avec ou sans extension).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  APPART_BOUNDARY_FILES, STATS_ALLOWED, ENTITY_FACTS_ALLOWED, HOUSE_ONLY_MODULES,
  boundaryIssues, parseImports, resolveSpecifier, eslintRestrictedPaths, importSpecifiers,
} from '../../scripts/lib/appart-boundary.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const read = (rel) => readFileSync(path.join(ROOT, rel), 'utf8');

/** Fichiers du dépôt qui répondent aux motifs de la frontière (motifs simples : `*`, `**`, `{a,b}`). */
function boundaryFiles() {
  const all = [];
  const walk = (dir) => {
    for (const e of readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const rel = `${dir}/${e.name}`;
      if (e.isDirectory()) walk(rel); else all.push(rel);
    }
  };
  walk('src');
  const toRe = (glob) => new RegExp(`^${glob.replace(/[.+^$()|[\]\\]/g, '\\$&').replace(/\{([^}]*)\}/g, (_, alt) => `(?:${alt.split(',').join('|')})`).replace(/\*\*\//g, '(?:.*/)?').replace(/\*/g, '[^/]*')}$`);
  const res = APPART_BOUNDARY_FILES.map(toRe);
  return all.filter((f) => res.some((re) => re.test(f)));
}

test('les fichiers de L\'Appart n\'importent aucune donnée des maisons', () => {
  const files = boundaryFiles();
  // Au moins les fichiers posés à l'étape E2 (les deux pages arriveront à l'étape E3).
  for (const f of ['src/data/appart.ts', 'src/data/appartFacts.ts', 'src/data/appartLocation.ts', 'src/data/appartPhotos.ts',
    'src/components/appart/AppartFacts.tsx', 'src/components/appart/AppartIncluded.tsx', 'src/components/appart/AppartTeaser.tsx']) {
    assert.ok(files.includes(f), `${f} hors du périmètre de la frontière`);
  }
  for (const f of files) assert.deepEqual(boundaryIssues(f, read(f)), [], f);
});

test('le contrôle voit une fuite, sous toutes les formes de chemin', () => {
  const sample = [
    'import { priceTier, type PriceTier } from "./stats";',
    'import {',
    '  STATS,',
    '  thousands,',
    '} from "@/data/stats";',
    'import { GUARANTOR_SENTENCE, ENTITY_HOUSES } from "../data/entityFacts.ts";',
    'import * as F from "@/data/entityFacts";',
    'import { PRICE_KEY_SENTENCE } from "./priceFacts";',
    'export { TRANSIT } from "./stats.ts";',
    'const h = await import("@/data/houseLocation");',
    '// import { OCCUPANCY } from "./stats";',
    'export const X = { from: "./stats" };',
  ].join('\n');
  const issues = boundaryIssues('src/data/appartEssai.ts', sample);
  for (const name of ['STATS', 'ENTITY_HOUSES', '*', 'PRICE_KEY_SENTENCE', 'TRANSIT']) assert.ok(issues.some((i) => i.includes(`« ${name} »`)), `${name} non signalé : ${issues.join(' | ')}`);
  assert.equal(issues.filter((i) => i.includes('houseLocation')).length, 1, 'import dynamique de houseLocation');
  assert.ok(!issues.some((i) => /« (?:priceTier|PriceTier|thousands|GUARANTOR_SENTENCE|OCCUPANCY) »/.test(i)), issues.join(' | '));
  assert.equal(issues.length, 6, issues.join(' | '));
  assert.deepEqual(boundaryIssues('src/data/appartEssai.ts', 'import { APPART } from "./appart";\nimport { aOrAn } from "./stats";'), []);
  // Depuis un composant : chemin relatif à deux niveaux.
  const fromComponent = boundaryIssues('src/components/appart/Essai.tsx', 'import { ROOMS_BY_HOUSE } from "../../data/stats";\nimport { LEASE_SENTENCE } from "../../data/entityFacts";');
  assert.equal(fromComponent.length, 1, fromComponent.join(' | '));
  assert.match(fromComponent[0], /« ROOMS_BY_HOUSE »/);
});

test('lecture des imports et des chemins', () => {
  assert.deepEqual(parseImports('import X, { a as b, type C } from "./m";'), [{ specifier: './m', names: ['a', 'C', 'default'] }]);
  assert.deepEqual(parseImports('import type { T } from "@/data/stats";'), [{ specifier: '@/data/stats', names: ['T'] }]);
  assert.deepEqual(parseImports('export * from "./stats";'), [{ specifier: './stats', names: ['*'] }]);
  assert.equal(resolveSpecifier('src/components/appart/AppartFacts.tsx', '../../data/stats'), 'src/data/stats');
  assert.equal(resolveSpecifier('src/pages/LAppartPage.tsx', '@/data/entityFacts.ts'), 'src/data/entityFacts');
  assert.equal(resolveSpecifier('src/data/appart.ts', 'react'), null);
  for (const s of importSpecifiers('src/data/stats')) assert.equal(resolveSpecifier(s.startsWith('../../') ? 'src/components/appart/X.tsx' : s.startsWith('../') ? 'src/pages/X.tsx' : 'src/data/X.ts', s), 'src/data/stats', s);
});

test('les noms permis existent encore (aucune porte périmée) et aucune donnée des maisons n\'y figure', () => {
  const exportsOf = (rel) => new Set([...read(rel).matchAll(/^export (?:const|function|interface|type) ([A-Za-z_]\w*)/gm)].map((x) => x[1]));
  const stats = exportsOf('src/data/stats.ts'), facts = exportsOf('src/data/entityFacts.ts');
  for (const n of STATS_ALLOWED) assert.ok(stats.has(n), `stats.ts : ${n} n'existe plus`);
  for (const n of ENTITY_FACTS_ALLOWED) assert.ok(facts.has(n), `entityFacts.ts : ${n} n'existe plus`);
  for (const n of ['STATS', 'STATS_DISPLAY', 'TRANSIT', 'ROOMS_BY_HOUSE', 'HOUSE_SURFACES', 'ROOM_SURFACE_BY_HOUSE', 'OCCUPANCY', 'GOOGLE_REVIEWS', 'HOUSES_FROM', 'GENEVA_COMMUTE_FORMULA', 'PRICE_FROM_CHF_FR']) {
    assert.ok(!STATS_ALLOWED.includes(n), `${n} ne doit pas être permis`);
  }
  for (const n of ['ENTITY_HOUSES', 'ENTITY_FACTS', 'entityFactsText', 'houseCommuteLine', 'LEGAL_ENTITY']) assert.ok(!ENTITY_FACTS_ALLOWED.includes(n), `${n} ne doit pas être permis`);
  for (const mod of HOUSE_ONLY_MODULES) assert.ok(existsSync(path.join(ROOT, `${mod}.ts`)), mod);
});

test('eslint.config.js applique la même frontière (motifs et chemins de scripts/lib/appart-boundary.mjs)', async () => {
  const config = (await import('../../eslint.config.js')).default;
  const block = config.find((c) => JSON.stringify(c.files) === JSON.stringify(APPART_BOUNDARY_FILES));
  assert.ok(block, 'bloc de la frontière absent de eslint.config.js');
  assert.deepEqual(block.rules['no-restricted-imports'], ['error', { paths: eslintRestrictedPaths() }]);
});
