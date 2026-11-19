// Garde « aucune rue de maison » (lot « sécurité des adresses », 11/2026) : scripts/check-private-locations.mjs.
// Toutes les adresses de ce fichier sont FICTIVES, avec des noms de voie inventés (les vraies rues ne sont jamais dans le
// dépôt, et aucun exemple ne reprend un nom de voie de l'agglomération).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  auditFile, auditFileNames, headOfficeException, inGenericScope, maskValues, decodeText, parseCliOptions, describeLeak,
  repoFiles, HEAD_OFFICE_EXCEPTIONS, GENERIC_ALLOW, BINARY_EXT, OPAQUE_EXT,
} from '../../scripts/check-private-locations.mjs';
import { buildStreetMatchers, HEAD_OFFICE_KEY } from '../../scripts/lib/private-locations.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const SCRIPT = path.join(ROOT, 'scripts', 'check-private-locations.mjs');

// La clé que la source donne au siège social (« lieu-du-siege ») ne doit sortir nulle part : résultats et messages disent
// HEAD_OFFICE_KEY / « siège social » (un journal public relierait sinon ce lieu à une adresse publiée).
const PLACES = [
  { key: 'maison-b', street: '7 impasse des Tests' },
  { key: 'lieu-du-siege', street: '9 chemin du Greffe', allowedOnLegalPages: true },
];
const SIEGE = HEAD_OFFICE_KEY;
const M = buildStreetMatchers(PLACES);
const SOURCE = JSON.stringify({ version: 1, places: PLACES });
const HOUSE = '7 impasse des Tests, 74100 Annemasse';
const HEAD_OFFICE = '9 chemin du Greffe, 74100 Annemasse';
const where = (leaks) => leaks.map((l) => `${l.file}:${l.line}:${l.key ?? l.way}`);

test('exceptions du siège social : pages légales et bail v2 seulement, fichier par fichier', () => {
  for (const ok of ['src/data/entityFacts.ts', 'src/pages/PolitiqueConfidentialitePage.tsx', 'src/pages/dashboard/BailPDF.tsx', 'src/pages/dashboard/DashboardNouveauBailPage.tsx',
    'public/prerendered/mentions-legales.html', 'public/prerendered/en-politique-de-confidentialite.html', 'dist/prerendered/en-mentions-legales.html',
    'dist/assets/entityFacts-BJ-XV1ql.js', 'dist/assets/PolitiqueConfidentialitePage-SugLq_aq.js', 'dist/assets/DashboardNouveauBailPage-Cm46GLeX.js']) {
    assert.ok(headOfficeException(ok), ok);
  }
  for (const ko of ['src/data/stats.ts', 'src/pages/MentionsLegalesPage.tsx', 'src/pages/dashboard/DashboardNouveauBailV3Page.tsx', 'src/data/entityFacts.ts.bak', 'tools/test/x.test.mjs',
    'public/prerendered/index.html', 'public/prerendered/lelodge.html', 'public/prerendered/blog-mentions-legales.html', 'public/llms.txt',
    'dist/assets/index-D8YBzTYG.js', 'dist/assets/DashboardNouveauBailV3Page-abc12345.js', 'dist/entityFacts-abc.js', 'scripts/backups/x.avant.json']) {
    assert.equal(headOfficeException(ko), null, ko);
  }
  for (const e of HEAD_OFFICE_EXCEPTIONS) { assert.ok(e.file instanceof RegExp && e.max >= 1 && e.why.length > 10); }
  for (const a of GENERIC_ALLOW) { assert.ok(a.re instanceof RegExp && a.why.length > 20, 'chaque entrée de la liste blanche porte sa raison'); }
});

test('exceptions du siège social : emplacements et plafonds FIGÉS (les relever se décide, et se voit dans ce test)', () => {
  assert.deepEqual(HEAD_OFFICE_EXCEPTIONS.map((e) => [e.file.source, e.max]), [
    ['^src\\/data\\/entityFacts\\.ts$', 1],
    ['^src\\/pages\\/PolitiqueConfidentialitePage\\.tsx$', 2],
    ['^(?:public|dist)\\/prerendered\\/(?:mentions-legales\\.html|en-mentions-legales\\.html|politique-de-confidentialite\\.html|en-politique-de-confidentialite\\.html)$', Infinity],
    ['^dist\\/assets\\/entityFacts-[\\w-]+\\.js$', 1],
    ['^dist\\/assets\\/PolitiqueConfidentialitePage-[\\w-]+\\.js$', 2],
    ['^src\\/pages\\/dashboard\\/BailPDF\\.tsx$', 3],
    ['^src\\/pages\\/dashboard\\/DashboardNouveauBailPage\\.tsx$', 3],
    ['^dist\\/assets\\/DashboardNouveauBailPage-[\\w-]+\\.js$', 6],
  ]);
  // Chaque plafond est une vraie limite : une occurrence de plus dans le fichier = fuite.
  const cases = [['src/data/entityFacts.ts', 1], ['src/pages/PolitiqueConfidentialitePage.tsx', 2], ['dist/assets/entityFacts-abc12345.js', 1], ['dist/assets/PolitiqueConfidentialitePage-abc12345.js', 2],
    ['src/pages/dashboard/BailPDF.tsx', 3], ['src/pages/dashboard/DashboardNouveauBailPage.tsx', 3], ['dist/assets/DashboardNouveauBailPage-abc12345.js', 6]];
  for (const [file, max] of cases) {
    assert.equal(auditFile(file, Array(max).fill(`"${HEAD_OFFICE}"`).join('\n'), M).exact.length, 0, `${file} : ${max} toléré(s)`);
    assert.equal(auditFile(file, Array(max + 1).fill(`"${HEAD_OFFICE}"`).join('\n'), M).exact.length, max + 1, `${file} : ${max + 1} = fuite`);
  }
});

test('liste blanche RÉELLE de la partie générique : elle ne couvre que ses 4 cas, pas « N rue des … », « N rue du … » ni « N place … »', () => {
  const others = ['12 rue des Essais', '3 rue du Brouillon', '5 place de la Maquette', '1 rue des Exemplaires', '4 rue du Faux', '1 place du Parking', '1, rue du Brouillon, 75009 Paris'];
  for (const a of others) assert.deepEqual(where(auditFile('src/x.ts', `const a = "${a}";`, M).generic).length, 1, a);
  const r = auditFile('src/x.ts', others.slice(0, 3).map((a) => `"${a}"`).join('\n'), M);
  assert.deepEqual(r.generic.map((g) => [g.line, g.way]), [[1, 'rue'], [2, 'rue'], [3, 'place']]);
  assert.equal(r.tolerated.generic, 0);
  // Ses 4 cas, eux, passent.
  const allowed = ['1 rue des Exemples', '12 bis, rue des Exemples', '4 rue du Faux-Exemple', '4 rue du Faux Exemple', '1, rue Jules-Lefebvre, 75009 Paris', '1 place par chambre', '2 places de parking'];
  for (const a of allowed) assert.deepEqual(auditFile('src/x.ts', `const a = "${a}";`, M).generic, [], a);
  assert.equal(GENERIC_ALLOW.length, 4, 'une entrée de plus se décide : ajouter ici son cas et sa raison');
});

test('périmètre de la partie générique : src/, scripts/, JavaScript de dist/', () => {
  for (const f of ['src/lib/x.ts', 'src/data/README.md', 'scripts/a.sql', 'scripts/backups/b.json', 'dist/assets/index-abc.js', 'dist/x.mjs']) assert.equal(inGenericScope(f), true, f);
  for (const f of ['tools/test/x.test.mjs', 'public/prerendered/blog-a.html', 'content/decision-pages/a.fr.md', 'dist/prerendered/a.html', 'dist/assets/index-abc.css', 'CLAUDE.md', 'docs/a.md']) assert.equal(inGenericScope(f), false, f);
  assert.ok(BINARY_EXT.test('public/images/a.webp') && BINARY_EXT.test('x.PNG') && !BINARY_EXT.test('scripts/a.sql') && !BINARY_EXT.test('public/data/a.csv'));
});

test('partie exacte : une rue de maison est une fuite partout, pages légales et bail v2 compris', () => {
  for (const f of ['src/lib/structuredData.ts', 'tools/test/a.test.mjs', 'scripts/migration.sql', 'public/prerendered/lelodge.html', 'public/llms.txt', 'public/sitemap.xml', 'docs/a.md',
    'dist/assets/index-abc12345.js', 'public/prerendered/mentions-legales.html', 'src/data/entityFacts.ts', 'src/pages/dashboard/BailPDF.tsx']) {
    const r = auditFile(f, `ligne 1\nconst a = "${HOUSE}";\n`, M);
    assert.deepEqual(where(r.exact), [`${f}:2:maison-b`], f);
    assert.equal(r.exact[0].form, 'numero+voie');
    assert.deepEqual(r.generic, [], `${f} : la rue déjà signalée n'est pas signalée deux fois`);
  }
  assert.equal(auditFile('public/prerendered/lelodge.html', '<p>impasse <em>des Tests</em></p>', M).exact[0].form, 'voie', 'HTML : balises et rue sans numéro');
  assert.deepEqual(auditFile('src/x.ts', 'rien ici', M), { exact: [], generic: [], tolerated: { headOffice: 0, generic: 0 } });
});

test('siège social : toléré aux emplacements prévus dans la limite du fichier, fuite ailleurs ou au-delà', () => {
  const one = `export const X = "${HEAD_OFFICE}";`;
  const ok = auditFile('src/data/entityFacts.ts', one, M);
  assert.deepEqual([ok.exact, ok.generic, ok.tolerated.headOffice], [[], [], 1]);
  // Une occurrence de plus que la limite : toutes les lignes du fichier sont signalées, avec le dépassement.
  const over = auditFile('src/data/entityFacts.ts', `${one}\n${one}`, M);
  assert.deepEqual(where(over.exact), [`src/data/entityFacts.ts:1:${SIEGE}`, `src/data/entityFacts.ts:2:${SIEGE}`]);
  assert.deepEqual(over.exact[0].over, { found: 2, max: 1 });
  // Ailleurs : fuite, comme une rue de maison.
  for (const f of ['src/data/stats.ts', 'public/prerendered/lelodge.html', 'tools/test/a.test.mjs', 'scripts/a.sql', 'dist/assets/index-abc12345.js', 'public/llms.txt']) {
    const r = auditFile(f, one, M);
    assert.deepEqual(where(r.exact), [`${f}:1:${SIEGE}`], f);
    assert.equal(r.exact[0].over, null);
    assert.doesNotMatch(JSON.stringify(r), /lieu-du-siege/, 'la clé du lieu du siège ne sort jamais');
  }
  // Page légale prérendue : sans limite de nombre ; JavaScript construit : limite du fichier.
  assert.equal(auditFile('public/prerendered/mentions-legales.html', `<p>${HEAD_OFFICE}</p><p>${HEAD_OFFICE}</p><p>${HEAD_OFFICE}</p>`, M).exact.length, 0);
  assert.equal(auditFile('dist/assets/DashboardNouveauBailPage-Cm46GLeX.js', Array(6).fill(`"${HEAD_OFFICE}"`).join(','), M).exact.length, 0);
  assert.equal(auditFile('dist/assets/DashboardNouveauBailPage-Cm46GLeX.js', Array(7).fill(`"${HEAD_OFFICE}"`).join(','), M).exact.length, 1, 'JavaScript minifié : une ligne, sept occurrences');
});

test('partie générique : adresse inconnue de la source dans src/, scripts/ ou le JavaScript de dist/ ; liste blanche ; hors périmètre', () => {
  const unknown = 'const lettre = "Résidence, 18 avenue des Inconnus, 74000 Annecy";';
  for (const f of ['src/pages/x.tsx', 'scripts/a.sql', 'dist/assets/index-abc12345.js']) assert.deepEqual(where(auditFile(f, unknown, M).generic), [`${f}:1:avenue`], f);
  for (const f of ['tools/test/x.test.mjs', 'public/prerendered/blog-a.html', 'content/decision-pages/a.fr.md', 'public/llms.txt']) assert.deepEqual(auditFile(f, unknown, M).generic, [], f);
  // Adresses fictives du dépôt et faux positifs stables : tolérés, et comptés.
  const allowed = '// « 1 rue des Exemples - 74100 Ville-la-Grand - France » → « 4 rue du Faux-Exemple, 74100 Annemasse »\nParking souterrain : 1 place par chambre (badge)';
  const r = auditFile('src/lib/x.ts', allowed, M);
  assert.deepEqual([r.generic, r.tolerated.generic], [[], 3]);
  // Le siège social déjà reconnu par la partie exacte ne revient pas dans la partie générique.
  assert.deepEqual(auditFile('src/data/entityFacts.ts', `headOffice: "${HEAD_OFFICE}", autre: "18 avenue des Inconnus"`, M).generic.map((g) => g.way), ['avenue']);
});

test('sans source : la partie générique tourne, le siège social est toléré par fichier dans la même limite', () => {
  const one = `headOffice: "${HEAD_OFFICE}",`;
  const ok = auditFile('src/data/entityFacts.ts', one, []);
  assert.deepEqual([ok.exact, ok.generic, ok.tolerated.generic], [[], [], 1]);
  assert.equal(auditFile('src/data/entityFacts.ts', `${one}\n${one}`, []).generic.length, 2, 'au-delà de la limite : tout est signalé');
  assert.deepEqual(where(auditFile('src/data/stats.ts', one, []).generic), ['src/data/stats.ts:1:chemin']);
  assert.deepEqual(where(auditFile('src/lib/structuredData.ts', `streetAddress: "${HOUSE}",`, []).generic), ['src/lib/structuredData.ts:1:impasse'], 'une rue de maison avec son numéro est vue même sans source');
  assert.deepEqual(auditFile('public/prerendered/lelodge.html', `<p>${HOUSE}</p>`, []).generic, [], 'HTML prérendu : hors périmètre générique (c\'est le rôle de la partie exacte)');
});

test('noms de fichiers et masque des journaux', () => {
  assert.deepEqual(where(auditFileNames(['src/a.ts', 'public/images/7-impasse-des-tests/salon.webp', 'docs/Chemin du Greffe.md'], M)), ['public/images/7-impasse-des-tests/salon.webp:0:maison-b', `docs/Chemin du Greffe.md:0:${SIEGE}`]);
  assert.deepEqual(auditFileNames(['src/a.ts'], []), []);
  assert.deepEqual(maskValues([{ street: '7 impasse des Tests' }, { street: '3 bis avenue Érable-Fictif' }, { street: '12B, allée du Test' }, { street: 'Lieu-dit Test' }, { street: '' }]),
    ['7 impasse des Tests', 'impasse des Tests', '3 bis avenue Érable-Fictif', 'avenue Érable-Fictif', '12B, allée du Test', 'allée du Test', 'Lieu-dit Test']);
});

test('compte rendu d\'une fuite : clé du lieu pour une maison ; « siège social » et renvoi à HEAD_OFFICE_EXCEPTIONS pour le siège', () => {
  assert.equal(describeLeak({ file: 'src/a.ts', line: 3, key: 'maison-b', form: 'numero+voie', over: null }), 'src/a.ts:3 — rue du lieu « maison-b » (numéro et voie)');
  assert.equal(describeLeak({ file: 'public/images/x.webp', line: 0, key: 'maison-b', form: 'voie', over: null }), 'public/images/x.webp (nom du fichier) — rue du lieu « maison-b » (voie sans son numéro)');
  assert.equal(describeLeak({ file: 'dist/assets/index-abc.js', line: 1, key: SIEGE, form: 'numero+voie', over: null }),
    'dist/assets/index-abc.js:1 — siège social hors des emplacements prévus (numéro et voie) — voir HEAD_OFFICE_EXCEPTIONS');
  assert.equal(describeLeak({ file: 'src/data/entityFacts.ts', line: 2, key: SIEGE, form: 'numero+voie', over: { found: 2, max: 1 } }),
    'src/data/entityFacts.ts:2 — siège social hors des emplacements prévus (numéro et voie) : 2 occurrence(s) dans ce fichier pour 1 tolérée(s) — voir HEAD_OFFICE_EXCEPTIONS');
});

test('decodeText : un octet nul ne fait jamais sauter un fichier ; UTF-16 avec ou sans marque d\'ordre d\'octets', () => {
  const NUL = String.fromCharCode(0);
  const js = Buffer.from(`const sep = "${NUL}"; const a = "${HOUSE}";`, 'utf8');
  assert.ok(js.includes(0));
  assert.equal(decodeText(js), `const sep = ""; const a = "${HOUSE}";`);
  assert.deepEqual(where(auditFile('dist/assets/x-abc12345.js', decodeText(js), M).exact), ['dist/assets/x-abc12345.js:1:maison-b']);
  const text = `ligne 1\nadresse : ${HOUSE} — été\n`;
  const le = Buffer.from(text, 'utf16le');
  const be = Buffer.from(le).swap16();
  assert.equal(decodeText(Buffer.concat([Buffer.from([0xff, 0xfe]), le])), text, 'UTF-16 LE avec marque');
  assert.equal(decodeText(Buffer.concat([Buffer.from([0xfe, 0xff]), be])), text, 'UTF-16 BE avec marque');
  assert.equal(decodeText(le), text, 'UTF-16 LE sans marque');
  assert.equal(decodeText(be), text, 'UTF-16 BE sans marque');
  assert.equal(decodeText(Buffer.from('été — 12 rue des Exemples', 'utf8')), 'été — 12 rue des Exemples', 'UTF-8 inchangé');
  assert.equal(decodeText(Buffer.alloc(0)), '');
  assert.equal(decodeText(Buffer.from([0xff, 0xfe, 0x41])), '', 'longueur impaire : le dernier octet est ignoré');
});

test('options : une option inconnue, un argument isolé ou une valeur manquante sont refusés', () => {
  const ok = parseCliOptions(['--require', '--require-dist', '--dist', '/tmp/x', '--json']);
  assert.deepEqual([[...ok.flags].sort(), ok.values], [['--json', '--require', '--require-dist'], { '--dist': '/tmp/x' }]);
  assert.deepEqual([...parseCliOptions([]).flags], []);
  assert.match(parseCliOptions(['--requrie']).error, /option inconnue : --requrie/);
  assert.match(parseCliOptions(['--require', '--Require-dist']).error, /option inconnue/);
  assert.match(parseCliOptions(['--dist']).error, /valeur manquante/);
  assert.match(parseCliOptions(['--dist', '--json']).error, /valeur manquante/);
  const stray = parseCliOptions(['7 impasse des Tests']);
  assert.match(stray.error, /argument isolé/);
  assert.doesNotMatch(stray.error, /impasse/i, 'un argument isolé n\'est jamais recopié');
  assert.ok(OPAQUE_EXT.test('docs/bail.PDF') && OPAQUE_EXT.test('a.docx') && OPAQUE_EXT.test('a.zip') && !OPAQUE_EXT.test('a.webp') && !OPAQUE_EXT.test('a.sql'));
  for (const f of ['a.pdf', 'a.docx', 'a.xlsx', 'a.zip', 'a.webp']) assert.ok(BINARY_EXT.test(f), f);
});

/* ── Exécution réelle du script sur un site construit FICTIF (dossier temporaire) ── */

async function fixture(files) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'lvc-check-locations-'));
  for (const [rel, content] of Object.entries(files)) {
    await fs.mkdir(path.dirname(path.join(dir, rel)), { recursive: true });
    await fs.writeFile(path.join(dir, rel), content);
  }
  return dir;
}
function run(args, env = {}) {
  const r = spawnSync(process.execPath, [SCRIPT, ...args], { cwd: ROOT, encoding: 'utf8', env: { ...process.env, LVC_PRIVATE_LOCATIONS: '', LVC_PRIVATE_LOCATIONS_FILE: '', REQUIRE_PRIVATE_LOCATIONS: '', GITHUB_ACTIONS: '', ...env } });
  return { code: r.status, out: `${r.stdout}\n${r.stderr}`, stdout: r.stdout };
}
const CLEAN = {
  'assets/index-abc12345.js': 'const zone="Annemasse (74100), quartier de Romagny";const p={lat:46.19,lng:6.24};',
  'assets/entityFacts-abc12345.js': `const L={headOffice:"${HEAD_OFFICE}, France"};`,
  'prerendered/mentions-legales.html': `<html><body><p>Siège social : <strong>${HEAD_OFFICE}, France</strong></p></body></html>`,
  'prerendered/lelodge.html': '<html><body><p>Annemasse (74100), quartier de Romagny</p></body></html>',
  'llms.txt': 'La Villa Coliving — 3 maisons',
  'images/photo.webp': 'RIFF',
};

test('script : site construit sain → sortie 0 ; la rue du siège reste aux emplacements prévus', async () => {
  const dir = await fixture(CLEAN);
  try {
    const r = run(['--no-repo', '--dist', dir], { LVC_PRIVATE_LOCATIONS: SOURCE });
    assert.equal(r.code, 0, r.out);
    assert.match(r.out, /partie exacte — 5 fichier\(s\) texte lus .* 0 fuite\(s\) ; siège social : 2 occurrence\(s\) aux emplacements prévus/);
    assert.match(r.out, /partie générique — 2 fichier\(s\) lus/);
    assert.match(r.out, /non lus : 1 image\(s\), police\(s\), vidéo\(s\) ou son\(s\) ; 0 document\(s\) ou archive\(s\) ; 0 fichier\(s\) absent/);
    assert.doesNotMatch(r.out, /greffe|impasse des tests|lieu-du-siege/i, 'aucune rue ni clé du siège dans la sortie');
  } finally { await fs.rm(dir, { recursive: true, force: true }); }
});

test('script : rue de maison dans le JavaScript construit et siège hors page légale → sortie 1, clé + fichier + ligne, jamais la rue', async () => {
  const dir = await fixture({
    ...CLEAN,
    'assets/index-abc12345.js': `const a=1;\nconst HOUSES=[{slug:"x",streetAddress:"${HOUSE}"}];`,
    'prerendered/lelodge.html': `<html><body>\n<p>Écris-nous : ${HEAD_OFFICE}</p></body></html>`,
    'sitemap.xml': '<urlset><url><loc>https://exemple.test/7-impasse-des-tests</loc></url></urlset>',
    // Une rue dans un NOM de fichier (une image n'est pas lue, son nom si).
    'images/7-impasse-des-tests.webp': 'RIFF',
  });
  try {
    const r = run(['--no-repo', '--dist', dir], { LVC_PRIVATE_LOCATIONS: SOURCE });
    assert.equal(r.code, 1, r.out);
    assert.match(r.out, /dist\/assets\/index-abc12345\.js:2 — rue du lieu « maison-b » \(numéro et voie\)/);
    assert.match(r.out, /dist\/prerendered\/lelodge\.html:2 — siège social hors des emplacements prévus \(numéro et voie\) — voir HEAD_OFFICE_EXCEPTIONS/);
    assert.match(r.out, /dist\/sitemap\.xml:1 — rue du lieu « maison-b »/);
    assert.match(r.out, /dist\/images\/7-impasse-des-tests\.webp \(nom du fichier\) — rue du lieu « maison-b »/);
    assert.match(r.out, /4 fuite\(s\)/);
    assert.match(r.out, /Siège social hors des emplacements prévus : si seul le nom d'un fichier JavaScript a changé/);
    // La sortie ne cite ni une rue (hors le chemin du fichier fautif, que le compte rendu doit donner), ni la clé du lieu du siège.
    assert.doesNotMatch(r.out.replaceAll('7-impasse-des-tests.webp', ''), /greffe|impasse des tests/i, 'aucune rue dans la sortie');
    assert.doesNotMatch(r.out, /lieu-du-siege/, 'la clé du lieu du siège ne sort jamais');
    const j = run(['--no-repo', '--dist', dir, '--json'], { LVC_PRIVATE_LOCATIONS: SOURCE });
    assert.equal(j.code, 1);
    const report = JSON.parse(j.stdout);
    assert.deepEqual(report.exact.map((e) => `${e.file}:${e.line}:${e.key}`).sort(),
      ['dist/assets/index-abc12345.js:2:maison-b', 'dist/images/7-impasse-des-tests.webp:0:maison-b', `dist/prerendered/lelodge.html:2:${SIEGE}`, 'dist/sitemap.xml:1:maison-b']);
    assert.deepEqual(report.files.notRead, { media: 2, opaque: [], unreadable: 0 });
    assert.doesNotMatch(j.stdout.replaceAll('7-impasse-des-tests.webp', ''), /greffe|impasse des tests|lieu-du-siege/i);
  } finally { await fs.rm(dir, { recursive: true, force: true }); }
});

test('script : un fichier JavaScript qui contient un octet nul est lu comme les autres (il n\'est plus sauté en silence)', async () => {
  const NUL = String.fromCharCode(0);
  const withStreet = `const HOUSES=[{slug:"x",streetAddress:"${HOUSE}"}];`;
  const dir = await fixture({
    ...CLEAN,
    'assets/avec-octet-nul-abc12345.js': `const sep="${NUL}";${withStreet}`,
    'assets/sans-octet-nul-abc12345.js': withStreet,
    'assets/utf16-abc12345.js': Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from(withStreet, 'utf16le')]),
  });
  try {
    const r = run(['--no-repo', '--dist', dir], { LVC_PRIVATE_LOCATIONS: SOURCE });
    assert.equal(r.code, 1, r.out);
    for (const f of ['avec-octet-nul', 'sans-octet-nul', 'utf16']) assert.match(r.out, new RegExp(`dist/assets/${f}-abc12345\\.js:1 — rue du lieu « maison-b »`), f);
    assert.match(r.out, /partie exacte — 8 fichier\(s\) texte lus/);
    // Sans source non plus : la partie générique lit les trois fichiers.
    const g = run(['--no-repo', '--dist', dir]);
    assert.equal(g.code, 1, g.out);
    for (const f of ['avec-octet-nul', 'sans-octet-nul', 'utf16']) assert.match(g.out, new RegExp(`dist/assets/${f}-abc12345\\.js:1 — motif « numéro \\+ impasse »`), f);
  } finally { await fs.rm(dir, { recursive: true, force: true }); }
});

test('script : document ou archive (PDF, Word, zip) → non lu, NOMMÉ dans un avertissement ; la sortie reste 0', async () => {
  const dir = await fixture({ ...CLEAN, 'docs/plaquette.pdf': '%PDF-1.7', 'docs/modele.docx': 'PK' });
  try {
    const r = run(['--no-repo', '--dist', dir], { LVC_PRIVATE_LOCATIONS: SOURCE });
    assert.equal(r.code, 0, r.out);
    assert.match(r.out, /non lus : 1 image\(s\), police\(s\), vidéo\(s\) ou son\(s\) ; 2 document\(s\) ou archive\(s\)/);
    assert.match(r.out, /2 document\(s\) ou archive\(s\) que la garde ne sait pas ouvrir — à contrôler à la main : dist\/docs\/modele\.docx, dist\/docs\/plaquette\.pdf/);
    const ci = run(['--no-repo', '--dist', dir], { LVC_PRIVATE_LOCATIONS: SOURCE, GITHUB_ACTIONS: 'true' });
    assert.match(ci.out, /::warning title=Garde des rues : fichiers non lus::2 document\(s\) ou archive\(s\) non lus/);
  } finally { await fs.rm(dir, { recursive: true, force: true }); }
});

test('script : option mal écrite → sortie 1 et mode d\'emploi (une faute de frappe ne coupe pas --require)', async () => {
  const clean = await fixture(CLEAN);
  try {
    const typo = run(['--no-repo', '--dist', clean, '--requrie']);
    assert.equal(typo.code, 1, typo.out);
    assert.match(typo.out, /option inconnue : --requrie/);
    assert.match(typo.out, /usage : node scripts\/check-private-locations\.mjs/);
    assert.doesNotMatch(typo.out, /Garde « aucune rue de maison »/, 'rien n\'est contrôlé avec une option inconnue');
    assert.equal(run(['--no-repo', '--dist']).code, 1, '--dist sans dossier');
    assert.equal(run(['--no-repo', clean]).code, 1, 'argument isolé');
    const help = run(['--help']);
    assert.equal(help.code, 0);
    assert.match(help.out, /usage : /);
  } finally { await fs.rm(clean, { recursive: true, force: true }); }
});

test('script : sans source → avertissement visible, partie générique seule ; --require → sortie 1', async () => {
  const dir = await fixture({ ...CLEAN, 'assets/Page-abc12345.js': 'const adresse="18 avenue des Inconnus, 74000 Annecy";' });
  try {
    const r = run(['--no-repo', '--dist', dir]);
    assert.equal(r.code, 1, r.out);
    assert.match(r.out, /PARTIE EXACTE NON EXÉCUTÉE/);
    assert.match(r.out, /dist\/assets\/Page-abc12345\.js:1 — motif « numéro \+ avenue »/);
    assert.doesNotMatch(r.out, /inconnus/i, 'la partie générique ne cite pas non plus l\'adresse');
    const clean = await fixture(CLEAN);
    try {
      const ok = run(['--no-repo', '--dist', clean]);
      assert.equal(ok.code, 0, ok.out);
      assert.match(ok.out, /PARTIE EXACTE NON EXÉCUTÉE/);
      assert.match(ok.out, /partie exacte non exécutée/);
      assert.equal(run(['--no-repo', '--dist', clean, '--require']).code, 1);
      assert.equal(run(['--no-repo', '--dist', clean], { REQUIRE_PRIVATE_LOCATIONS: '1' }).code, 1);
    } finally { await fs.rm(clean, { recursive: true, force: true }); }
  } finally { await fs.rm(dir, { recursive: true, force: true }); }
});

test('script : en CI, chaque rue est déclarée au masque des journaux avant tout autre affichage', async () => {
  const dir = await fixture(CLEAN);
  try {
    const r = run(['--no-repo', '--dist', dir], { LVC_PRIVATE_LOCATIONS: SOURCE, GITHUB_ACTIONS: 'true' });
    assert.equal(r.code, 0, r.out);
    const lines = r.stdout.split('\n');
    assert.deepEqual(lines.slice(0, 4), ['::add-mask::7 impasse des Tests', '::add-mask::impasse des Tests', '::add-mask::9 chemin du Greffe', '::add-mask::chemin du Greffe']);
    assert.doesNotMatch(lines.slice(4).join('\n'), /greffe|impasse des tests|lieu-du-siege/i, 'après le masque, plus aucune rue');
  } finally { await fs.rm(dir, { recursive: true, force: true }); }
});

test('script : source invalide ou dossier construit exigé mais absent → sortie 1, message sans valeur lue', async () => {
  const bad = run(['--no-repo', '--no-dist'], { LVC_PRIVATE_LOCATIONS: '{"version":1,"places":[{"key":"maison-b","street":"7 impasse des Tests"' });
  assert.equal(bad.code, 1);
  assert.match(bad.out, /source des lieux privés illisible/);
  assert.doesNotMatch(bad.out, /impasse/i);
  const missing = run(['--no-repo', '--dist', path.join(os.tmpdir(), 'lvc-absent-' + process.pid), '--require-dist'], { LVC_PRIVATE_LOCATIONS: SOURCE });
  assert.equal(missing.code, 1);
  assert.match(missing.out, /dist\/ absent/);
});

test('fichiers du dépôt : suivis ET nouveaux non ignorés (une page tout juste prérendue est lue), jamais un fichier ignoré', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'lvc-repo-files-'));
  try {
    const git = (...args) => execFileSync('git', args, { cwd: dir, stdio: 'pipe' });
    git('init', '-q');
    const files = {
      '.gitignore': 'ignore/\n*.local.json\n',
      'src/suivi.ts': 'export const a = 1;',
      'public/prerendered/blog-nouveau.html': '<p>page tout juste prérendue, pas encore suivie</p>',
      'ignore/brouillon.txt': 'ignoré',
      'rues.local.json': '{}',
    };
    for (const [rel, content] of Object.entries(files)) {
      await fs.mkdir(path.dirname(path.join(dir, rel)), { recursive: true });
      await fs.writeFile(path.join(dir, rel), content);
    }
    git('add', '.gitignore', 'src/suivi.ts');
    assert.deepEqual(repoFiles(dir).sort(), ['.gitignore', 'public/prerendered/blog-nouveau.html', 'src/suivi.ts']);
  } finally { await fs.rm(dir, { recursive: true, force: true }); }
});

test('dépôt réel : la partie générique est au vert sur src/ et scripts/ (aucune adresse hors liste blanche)', () => {
  const r = run(['--no-dist']);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /partie générique — \d+ fichier\(s\) lus .* 0 adresse\(s\) hors liste blanche/);
});
