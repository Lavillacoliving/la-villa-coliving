// Garde « aucune clé interne » (L'Appart, étape E2g ; ARCHITECTURE § 4.3) : scripts/lib/internal-keys.mjs.
//  - fonctions pures sur une clé FICTIVE (« boisjoli ») : texte, attribut, URL encodée, JSON échappé, entité HTML, casse, nom de
//    fichier ; « d'un seul tenant » (« Bois-Joli », « Bois Joli » passent : le nom en deux mots n'est pas la clé) ; lien externe
//    d'un article = avertissement ; exceptions nominatives ; aucun message ne recopie la clé ;
//  - surfaces publiées d'un dépôt d'essai (dossier temporaire), puis celles de ce dépôt avec la VRAIE clé, lue dans le pont
//    (src/lib/placeBridge.ts, INTERNAL_ONLY_KEYS) et jamais écrite ici ;
//  - contrôle local des SOURCES : la clé n'apparaît que dans la liste blanche (INTERNAL_KEY_SOURCE_ALLOWLIST).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, existsSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { loadEntityFacts } from '../../scripts/lib/load-entity-facts.mjs';
import {
  internalKeyLeaks, internalKeySurfaceIssues, externalHrefSpans, nameHasKey, maskKeys, keyNeedles, sourceKeyIssues,
  INTERNAL_KEY_SOURCE_ALLOWLIST, INTERNAL_KEY_EXCEPTIONS, PUBLIC_TEXT_EXT,
} from '../../scripts/lib/internal-keys.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const KEY = 'boisjoli';
const KEYS = [KEY];
const silent = (msgs) => assert.doesNotMatch(msgs.join('\n'), /bois\s?-?joli/i, 'un message recopie la clé');

test('internalKeyLeaks : la clé dans le texte, un attribut, une URL encodée, du JSON échappé, une entité HTML, en capitales → échec', () => {
  const forms = [
    '<p>Chez boisjoli, au calme.</p>',
    '<div data-place="BoisJoli"></div>',
    '<a href="/candidature?property_interest=bois%6Aoli">x</a>',
    '<script type="application/json">{"house_slug":"bois\\u006aoli"}</script>',
    '<p>&#98;oisjoli</p>',
    'BOISJOLI',
    '<a href="/x?q=bois%256Aoli">encodée deux fois</a>',
  ];
  for (const t of forms) {
    const r = internalKeyLeaks(t, KEYS);
    assert.equal(r.failures.length, 1, t);
    assert.match(r.failures[0], /^clé interne de la base trouvée 1 fois \(ligne 1\) — seule la clé publique se publie/);
    silent(r.failures);
  }
});

test('internalKeyLeaks : « d\'un seul tenant » — le nom en deux mots (tiret, espace) passe ; lignes comptées', () => {
  for (const t of ['Bois-Joli', 'Bois Joli', 'bois joli', 'le massif du Bois‑Joli', 'Bois&nbsp;Joli']) assert.deepEqual(internalKeyLeaks(t, KEYS).failures, [], t);
  const r = internalKeyLeaks('ligne 1\nligne 2 boisjoli\nligne 3\nboisjoli et boisjoli', KEYS);
  assert.deepEqual(r.failures, ['clé interne de la base trouvée 3 fois (lignes 2, 4) — seule la clé publique se publie (src/lib/placeBridge.ts)']);
  assert.deepEqual(internalKeyLeaks('boisjoli', []).failures, [], 'aucune clé à chercher');
  assert.deepEqual(keyNeedles(['  BoisJoli ', '', null, 'boisjoli']), ['boisjoli']);
});

test('lien externe d\'un article de blog = avertissement ; même lien hors article, lien interne ou relatif = échec', () => {
  const ext = '<p>Voir <a href="https://exemple.org/guide/boisjoli">ce guide</a>.</p>';
  const blog = internalKeyLeaks(ext, KEYS, { externalLinksAsWarnings: true });
  assert.deepEqual(blog.failures, []);
  assert.equal(blog.warnings.length, 1);
  assert.match(blog.warnings[0], /^clé interne dans l'URL d'un lien externe \(1 lien\(s\), ligne 1\) — contenu de la base : corriger l'article/);
  silent(blog.warnings);
  assert.equal(internalKeyLeaks(ext, KEYS).failures.length, 1, 'hors article : échec');
  for (const t of ['<a href="https://www.lavillacoliving.com/boisjoli">x</a>', '<a href="/boisjoli">x</a>', '<p>boisjoli</p><a href="https://exemple.org/boisjoli">x</a>']) {
    assert.equal(internalKeyLeaks(t, KEYS, { externalLinksAsWarnings: true }).failures.length, 1, t);
  }
  assert.deepEqual(externalHrefSpans('<a href="https://lavillacoliving.com/a">a</a><a href=\'https://ex.org/b?c=1&amp;d=2\'>b</a><a href="/c">c</a>').map((s) => s.length), ['https://ex.org/b?c=1&amp;d=2'.length]);
});

test('exceptions nominatives : un texte exact toléré dans un fichier, et rien d\'autre ; aucune exception au départ', () => {
  const t = '<p>Domaine BoisJoli (nom d\'une cave)</p><p>chez boisjoli</p>';
  assert.equal(internalKeyLeaks(t, KEYS).failures.length, 1);
  assert.match(internalKeyLeaks(t, KEYS, { exceptions: ['Domaine BoisJoli'] }).failures[0], /trouvée 1 fois/);
  assert.deepEqual(internalKeyLeaks('<p>Domaine BoisJoli</p>', KEYS, { exceptions: ['Domaine BoisJoli'] }).failures, []);
  assert.deepEqual([...INTERNAL_KEY_EXCEPTIONS], []);
});

test('noms : un nom de fichier, de dossier ou une clé d\'URL qui porte la clé ; le nom affiché est masqué', () => {
  assert.ok(nameHasKey('lappart-boisjoli-1.webp', KEYS));
  assert.ok(nameHasKey('bois%6Aoli.webp', KEYS));
  assert.ok(!nameHasKey('bois-joli.webp', KEYS));
  assert.equal(maskKeys('public/images/lappart-BoisJoli-1.webp', KEYS), 'public/images/lappart-<clé interne>-1.webp');
  assert.equal(maskKeys('bois%6Aoli.webp', KEYS), '(nom masqué)');
  assert.equal(maskKeys('lappart-cuisine-1.webp', KEYS), 'lappart-cuisine-1.webp');
});

test('surfaces publiées d\'un dépôt d\'essai : pages, llms.txt, noms sous public/, index.html, vercel.json, roomPages.json', async () => {
  const root = mkdtempSync(path.join(tmpdir(), 'lvc-internal-keys-'));
  try {
    const put = (rel, text) => { mkdirSync(path.dirname(path.join(root, rel)), { recursive: true }); writeFileSync(path.join(root, rel), text); };
    put('public/prerendered/index.html', '<html><body><p>Annemasse, quartier de la gare</p></body></html>');
    put('public/prerendered/lappart.html', '<html><body><script type="application/json" id="__rooms_level_data__">[{"house_slug":"boisjoli"}]</script></body></html>');
    put('public/prerendered/blog-guide.html', '<a href="https://exemple.org/boisjoli">guide</a>');
    put('public/prerendered/en-blog-guide.html', '<a href="https://exemple.org/x">guide</a><p>BoisJoli</p>');
    put('public/llms.txt', '# La Villa Coliving\n- boisjoli : 4 chambres\n');
    put('public/sitemap.xml', '<urlset><url><loc>https://www.lavillacoliving.com/lappart</loc></url></urlset>');
    put('public/images/boisjoli/photo.webp', 'binaire');
    put('public/images/lappart/lappart-cuisine-1.webp', 'binaire : boisjoli (non lu : image)');
    put('index.html', '<html><head></head><body><div id="root"></div></body></html>');
    put('vercel.json', JSON.stringify({ redirects: [{ source: '/boisjoli', destination: '/lappart' }] }));
    put('src/data/roomPages.json', JSON.stringify({ _comment: 'x', lelodge: [1], boisjoli: [2] }));
    const r = await internalKeySurfaceIssues({ root, keys: KEYS });
    assert.equal(r.skipped, false);
    assert.deepEqual(r.failures.map((f) => f.split(' : ')[0]), [
      'public/images/<clé interne>',
      'public/llms.txt',
      'public/prerendered/en-blog-guide.html',
      'public/prerendered/lappart.html',
      'vercel.json',
      'src/data/roomPages.json',
    ]);
    assert.deepEqual(r.warnings.map((f) => f.split(' : ')[0]), ['public/prerendered/blog-guide.html']);
    silent([...r.failures, ...r.warnings]);
    assert.equal(r.read, 8, '6 fichiers texte de public/ + index.html + vercel.json');
    const none = await internalKeySurfaceIssues({ root, keys: [] });
    assert.equal(none.skipped, true);
    assert.ok(PUBLIC_TEXT_EXT.test('a.html') && PUBLIC_TEXT_EXT.test('a.csv') && !PUBLIC_TEXT_EXT.test('a.webp'));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

const m = await loadEntityFacts();

test('ce dépôt : la vraie clé interne (lue dans le pont) est absente de tout ce qui est publié', async () => {
  assert.ok(m.INTERNAL_ONLY_KEYS.length >= 1, 'le pont donne au moins une clé interne');
  for (const k of m.INTERNAL_ONLY_KEYS) assert.ok(!m.PLACE_KEYS.includes(k), 'une clé interne n\'est jamais une clé publique');
  const r = await internalKeySurfaceIssues({ root: ROOT, keys: m.INTERNAL_ONLY_KEYS });
  assert.equal(r.skipped, false);
  assert.deepEqual(r.failures, []);
  assert.deepEqual(r.warnings, []);
  assert.ok(r.read > 100 && r.names > 100, `${r.read} fichiers lus, ${r.names} noms`);
});

/** Fichiers suivis et nouveaux (non ignorés) du dépôt, en texte. */
function repoTextFiles() {
  const out = execFileSync('git', ['-C', ROOT, 'ls-files', '--cached', '--others', '--exclude-standard', '-z'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const files = [];
  for (const rel of [...new Set(out.split('\0').filter(Boolean))]) {
    const abs = path.join(ROOT, rel);
    if (!existsSync(abs)) continue; // supprimé de l'arbre de travail, pas encore du dépôt
    const st = statSync(abs);
    if (!st.isFile() || st.size > 8 * 1024 * 1024) continue;
    const buf = readFileSync(abs);
    if (buf.includes(0)) continue; // binaire (images, PDF)
    files.push({ path: rel, text: buf.toString('utf8') });
  }
  return files;
}

test('sources : la clé interne n\'apparaît que dans la liste blanche (pont des clés, code interne, SQL d\'août, CLAUDE.md)', () => {
  const files = repoTextFiles();
  assert.ok(files.length > 500, `${files.length} fichiers lus`);
  const issues = sourceKeyIssues(files, m.INTERNAL_ONLY_KEYS);
  assert.deepEqual(issues, []);
  // La liste blanche ne nomme que des fichiers qui existent (une faute de frappe y laisserait un trou), sans doublon.
  for (const f of INTERNAL_KEY_SOURCE_ALLOWLIST) assert.ok(existsSync(path.join(ROOT, f)), f);
  assert.equal(new Set(INTERNAL_KEY_SOURCE_ALLOWLIST).size, INTERNAL_KEY_SOURCE_ALLOWLIST.length);
  // Le pont des clés en fait partie, et il porte bien la clé (sinon la garde chercherait une liste vide).
  const bridge = files.find((f) => f.path === 'src/lib/placeBridge.ts');
  assert.ok(bridge && internalKeyLeaks(bridge.text, m.INTERNAL_ONLY_KEYS).failures.length === 1);
});

test('sourceKeyIssues : un fichier hors de la liste blanche qui porte la clé = un message (chemin, nombre), jamais la clé', () => {
  const r = sourceKeyIssues([{ path: 'src/pages/Essai.tsx', text: 'const slug = "boisjoli";' }, { path: 'src/lib/placeBridge.ts', text: 'boisjoli' }, { path: 'src/data/boisjoli.ts', text: '' }], KEYS);
  assert.deepEqual(r, [
    'src/pages/Essai.tsx : clé interne de la base trouvée 1 fois (ligne 1) — seule la clé publique se publie (src/lib/placeBridge.ts) — hors de la liste blanche (INTERNAL_KEY_SOURCE_ALLOWLIST, scripts/lib/internal-keys.mjs)',
    'src/data/<clé interne>.ts : le chemin du fichier porte la clé interne',
  ]);
});
