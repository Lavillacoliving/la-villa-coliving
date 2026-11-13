// Lieux privés (lot « sécurité des adresses », 11/2026) : fonctions pures de scripts/lib/private-locations.mjs.
// Toutes les adresses de ce fichier sont FICTIVES, avec des noms de voie inventés (« des Exemples », « du Brouillon »,
// « Érable-Fictif », « de Nulle-Part »…) : jamais un nom de voie de l'agglomération. Les vraies rues ne sont jamais dans
// le dépôt : la garde les reçoit d'une source hors dépôt (secret LVC_PRIVATE_LOCATIONS, ou fichier désigné par
// LVC_PRIVATE_LOCATIONS_FILE).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parsePrivateLocations, loadPrivateLocations, PrivateLocationsError, normalizeForScan, stripInlineTags, parseStreet,
  buildStreetMatchers, findStreets, blankSpans, scanStreets, scanGenericAddresses, LEGAL_PRERENDERED_PAGES,
  LOCATIONS_ENV, LOCATIONS_FILE_ENV, HEAD_OFFICE_KEY,
} from '../../scripts/lib/private-locations.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const BACKSLASH = String.fromCharCode(92);
const NBSP = String.fromCharCode(0xa0);
const EN_DASH = String.fromCharCode(0x2013);

const PLACES = [
  { key: 'maison-a', street: '12 rue des Exemples' },
  { key: 'maison-b', street: '3 bis avenue Érable-Fictif' },
  { key: 'maison-c', street: '7 impasse Saint-Test' },
  // La clé de la source (« lieu-du-siege ») ne doit sortir dans aucun résultat : le siège social s'appelle HEAD_OFFICE_KEY.
  { key: 'lieu-du-siege', street: '4 rue du Faux-Exemple', allowedOnLegalPages: true },
];
const M = buildStreetMatchers(PLACES);
const source = (places = PLACES) => JSON.stringify({ version: 1, generatedOn: '2026-11-13', places });
const keys = (hits) => hits.map((h) => `${h.key}:${h.form}:${h.line}`);

test('source v1 : lieux lus, drapeau allowedOnLegalPages, champs inconnus ignorés', () => {
  const places = parsePrivateLocations(source([...PLACES, { key: 'maison-d', street: ' 9 chemin du Brouillon ', geo: { lat: 1, lng: 2 }, label: 'x' }]));
  assert.equal(places.length, 5);
  assert.deepEqual(places[0], { key: 'maison-a', street: '12 rue des Exemples', allowedOnLegalPages: false });
  assert.equal(places[3].allowedOnLegalPages, true);
  assert.equal(parsePrivateLocations(String.fromCharCode(0xfeff) + source()).length, 4, 'marque d\'ordre d\'octets tolérée');
  assert.deepEqual(places[4], { key: 'maison-d', street: '9 chemin du Brouillon', allowedOnLegalPages: false });
});

test('source invalide : erreur nommée, jamais une valeur lue dans le message', () => {
  const cases = [
    '{ "version": 1, "places": [ { "key": "maison-a", "street": "12 rue des Exemples" ',            // JSON coupé
    JSON.stringify({ version: 2, places: PLACES }),                                                  // autre version
    JSON.stringify({ version: 1, places: [] }),                                                      // aucun lieu
    JSON.stringify({ version: 1, places: [{ key: 'Maison A', street: '12 rue des Exemples' }] }),    // clé invalide
    JSON.stringify({ version: 1, places: [{ key: 'maison-a', street: '' }] }),                       // rue vide
    source([PLACES[0], PLACES[0]]),                                                                  // clé en double
    JSON.stringify({ version: 1, places: [{ key: 'maison-a', street: 'Exemples' }] }),               // ni numéro ni type de voie
    JSON.stringify({ version: 1, places: [{ key: 'maison-a', street: '12 rue de la' }] }),           // aucun mot distinctif
    JSON.stringify({ version: 1, places: [{ key: HEAD_OFFICE_KEY, street: '12 rue des Exemples' }] }), // clé réservée au siège
    // Pas du JSON : le message d'origine de JSON.parse (V8) cite le début du texte lu ; il ne doit jamais être repris.
    'rue des Exemples, 74100 Nulle-Part',
    '12 rue des Exemples',
  ];
  for (const c of cases) {
    assert.throws(() => parsePrivateLocations(c), (e) => {
      assert.ok(e instanceof PrivateLocationsError, c);
      // V8 ne cite que le début du texte (« "rue des Ex"... ») : chercher aussi ce début.
      assert.doesNotMatch(e.message, /exemples|12 rue|rue des|nulle/i, `message sans valeur lue — ${e.message}`);
      return true;
    });
  }
});

test('chargement : variable, fichier hors dépôt, rien ; un fichier DANS le dépôt est refusé', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'lvc-locations-'));
  const file = path.join(dir, 'source.json');
  await fs.writeFile(file, source());
  try {
    const fromEnv = await loadPrivateLocations({ env: { [LOCATIONS_ENV]: source() }, root: ROOT });
    assert.equal(fromEnv.places.length, 4);
    assert.match(fromEnv.origin, /variable LVC_PRIVATE_LOCATIONS/);
    const fromFile = await loadPrivateLocations({ env: { [LOCATIONS_FILE_ENV]: file }, root: ROOT });
    assert.equal(fromFile.places.length, 4);
    assert.ok(!fromFile.origin.includes(dir), 'le chemin du fichier ne sort jamais');
    // La variable l'emporte sur le fichier ; une variable vide ne compte pas.
    assert.match((await loadPrivateLocations({ env: { [LOCATIONS_ENV]: source([PLACES[0]]), [LOCATIONS_FILE_ENV]: file }, root: ROOT })).origin, /variable/);
    assert.equal((await loadPrivateLocations({ env: { [LOCATIONS_ENV]: '  ', [LOCATIONS_FILE_ENV]: file }, root: ROOT })).places.length, 4);
    assert.deepEqual(await loadPrivateLocations({ env: {}, root: ROOT }), { places: null, origin: null });
    await assert.rejects(loadPrivateLocations({ env: { [LOCATIONS_FILE_ENV]: path.join(ROOT, 'scripts', 'rues.json') }, root: ROOT }), /DANS le dépôt/);
    await assert.rejects(loadPrivateLocations({ env: { [LOCATIONS_FILE_ENV]: path.join(dir, 'absent.json') }, root: ROOT }), (e) => e instanceof PrivateLocationsError && !e.message.includes(dir));
    await assert.rejects(loadPrivateLocations({ env: { [LOCATIONS_ENV]: 'pas du JSON' }, root: ROOT }), (e) => e instanceof PrivateLocationsError && !/pas du json/i.test(e.message));
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
});

test('normalizeForScan : casse, accents, typographie, entités HTML, encodage d\'URL, échappements JS ; nombre de lignes conservé', () => {
  assert.equal(normalizeForScan('12 Rue des EXEMPLES'), '12 rue des exemples');
  assert.equal(normalizeForScan('avenue Érable-Fictif'), 'avenue erable-fictif');
  assert.equal(normalizeForScan(`12${NBSP}rue des Exemples ${EN_DASH} 74100`), '12 rue des exemples - 74100');
  assert.equal(normalizeForScan('12&nbsp;rue&#32;des&#x20;Exemples &eacute;t&eacute;'), '12 rue des exemples ete');
  assert.equal(normalizeForScan('origin=12%20rue%20des%20Exemples%2C%2074100'), 'origin=12 rue des exemples, 74100');
  assert.equal(normalizeForScan('next=%2Fmaps%3Fq%3D12%2520rue%2520des%2520Exemples'), 'next=/maps?q=12 rue des exemples', 'lien encodé deux fois');
  assert.equal(normalizeForScan(`12 rue des Ex${BACKSLASH}u0065mples${BACKSLASH}n74100`), '12 rue des exemples 74100');
  assert.equal(normalizeForScan(`12${BACKSLASH}x20rue des Ex${BACKSLASH}x65mples`), '12 rue des exemples', 'échappement JS en deux chiffres hexadécimaux');
  assert.equal(normalizeForScan(`12 rue des Ex${BACKSLASH}u{65}mples`), '12 rue des exemples', 'échappement JS entre accolades');
  assert.equal(normalizeForScan('%E0%A4%A'), '%e0%a4%a', 'séquence invalide laissée telle quelle');
  const multi = 'ligne 1\n12 rue&#10;des Exemples\nligne 3';
  assert.equal(normalizeForScan(multi).split('\n').length, multi.split('\n').length, 'un saut de ligne décodé devient une espace');
  assert.equal(stripInlineTags('12 rue <b>des</b> exemples'), '12 rue  des  exemples');
});

test('caractères invisibles (copier-coller depuis un PDF ou un traitement de texte) : retirés au milieu d\'un mot, espace ailleurs', () => {
  // Césure molle, séparateur mongol, sans chasse, antiliant, liant, gluon de mot, opérateurs invisibles, marque d'ordre d'octets.
  const INVISIBLES = [0xad, 0x180e, 0x200b, 0x200c, 0x200d, 0x2060, 0x2061, 0x2064, 0xfeff];
  for (const cp of INVISIBLES) {
    const c = String.fromCodePoint(cp);
    const label = `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`;
    assert.equal(normalizeForScan(`12 rue des Exem${c}ples`), '12 rue des exemples', `${label} au milieu d'un mot`);
    assert.deepEqual(keys(scanStreets(`12 rue des Exem${c}ples`, M)), ['maison-a:numero+voie:1'], `${label} dans le nom de la voie`);
    assert.deepEqual(keys(scanStreets(`12${c}rue${c}des${c}Exemples`, M)), ['maison-a:numero+voie:1'], `${label} entre les mots`);
    assert.deepEqual(keys(scanStreets(`12 r.${c}des Exemples`, M)), ['maison-a:numero+voie:1'], `${label} après une abréviation de voie`);
    assert.deepEqual(keys(scanStreets(`${c}3 bis avenue Éra${c}ble-Fictif${c}`, M)), ['maison-b:numero+voie:1'], `${label} en bord de texte`);
    assert.deepEqual(scanStreets(`rue des Exem${c}plaires`, M), [], `${label} : un autre mot reste un autre mot`);
  }
  // Écrits en entité HTML, en échappement JS ou en encodage d'URL : même résultat.
  for (const f of ['12 rue des Exem&#173;ples', '12 rue des Exem&shy;ples', `12 rue des Exem${BACKSLASH}u00adples`, '12%20rue%20des%20Exem%C2%ADples', '12 rue des Exem%E2%80%8Bples']) {
    assert.deepEqual(keys(scanStreets(f, M)), ['maison-a:numero+voie:1'], f);
  }
  assert.equal(normalizeForScan(`c${String.fromCodePoint(0x153)}${String.fromCodePoint(0xad)}ur`), 'coeur', 'lettre hors ASCII avant le caractère invisible');
  assert.equal(normalizeForScan(`ligne 1${String.fromCodePoint(0x200b)}\nligne 2`).split('\n').length, 2, 'nombre de lignes conservé');
});

test('parseStreet : numéro (bis, lettre), type de voie, mots du nom', () => {
  assert.deepEqual(parseStreet('12 rue des Exemples'), { number: ['12'], way: 'rue', name: ['des', 'exemples'] });
  assert.deepEqual(parseStreet('3 bis avenue Érable-Fictif'), { number: ['3', 'bis'], way: 'avenue', name: ['erable', 'fictif'] });
  assert.deepEqual(parseStreet('12B Allée du Test'), { number: ['12b'], way: 'allee', name: ['du', 'test'] });
  assert.deepEqual(parseStreet('Lieu-dit Les Exemples'), { number: [], way: null, name: ['lieu', 'dit', 'les', 'exemples'] });
});

test('rue avec son numéro : toutes les graphies courantes sont trouvées (forme « numero+voie »)', () => {
  const forms = [
    '12 rue des Exemples', '12 RUE DES EXEMPLES', '12, rue des Exemples', '12 rue des exemples, 74100 Annemasse', '12-rue-des-exemples',
    '12+rue+des+Exemples', '12%20rue%20des%20Exemples', `12${NBSP}rue des Exemples`, '12 r. des Exemples', '12 rue Exemples',
    '"streetAddress":"12 rue des Exemples"', "siege = '12 rue des Exemples'", '12 rue des&nbsp;Exemples',
  ];
  for (const f of forms) assert.deepEqual(keys(scanStreets(`avant ${f} après`, M)), ['maison-a:numero+voie:1'], f);
  assert.deepEqual(keys(scanStreets('3 bis avenue Erable Fictif', M)), ['maison-b:numero+voie:1']);
  assert.deepEqual(keys(scanStreets('3bis av. Érable-Fictif', M)), ['maison-b:numero+voie:1']);
  assert.deepEqual(keys(scanStreets('7 imp. St-Test', M)), ['maison-c:numero+voie:1'], 'abréviations du type de voie et du nom');
  // L'abréviation d'un type de voie vaut devant une espace ou le « + » d'une URL…
  for (const f of ['12 r des Exemples', '12 R. DES EXEMPLES', '12+r.+des+Exemples', '12+r+des+Exemples', `12 r.${NBSP}des Exemples`]) {
    assert.deepEqual(keys(scanStreets(f, M)), ['maison-a:numero+voie:1'], f);
  }
});

test('JavaScript minifié : une variable d\'une ou deux lettres suivie d\'une ponctuation n\'est pas une abréviation de voie', () => {
  // … mais pas devant une autre ponctuation : `r.exemples` est un accès à une propriété, pas « r. Exemples ».
  for (const js of ['x=r.exemples', 'f(r,"exemples")', '{r:"exemples"}', 'a=r(exemples)', 'r"exemples"', 'r-exemples', 'r_exemples',
    't=av.erable.fictif', '{av:"erable-fictif"}', 'g(imp,"saint-test")', 'imp.st.test', 'const r="des exemples"']) {
    assert.deepEqual(scanStreets(js, M), [], js);
  }
  // Le type de voie écrit en entier reste reconnu devant n'importe quel séparateur.
  for (const f of ['rue.des.exemples', '{rue:"exemples"}', '12-rue-des-exemples', '12_rue_des_exemples', 'avenue:"erable-fictif"']) {
    assert.equal(scanStreets(f, M).length, 1, f);
  }
});

test('rue sans son numéro, ou avec un autre : forme « voie » ; le nom de voie seul n\'est jamais cherché', () => {
  assert.deepEqual(keys(scanStreets('La maison est rue des Exemples.', M)), ['maison-a:voie:1']);
  assert.deepEqual(keys(scanStreets('au 112 rue des Exemples', M)), ['maison-a:voie:1'], 'autre numéro : la rue reste signalée');
  assert.deepEqual(keys(scanStreets('parcelle AB 45 rue du Faux Exemple', M)), [`${HEAD_OFFICE_KEY}:voie:1`]);
  for (const safe of ['le quartier des Exemples', 'Exemples (74100)', 'avenue des Exemples', 'rue des Exemplaires', 'rue des Exemplesville', 'boulevard-rue des Exemples2', 'la rue du Brouillon', '12 routes', 'Érable Fictif, un arbre']) {
    assert.deepEqual(scanStreets(safe, M), [], safe);
  }
});

test('rue coupée sur deux lignes (JSX), balises au milieu (HTML), plusieurs occurrences par ligne', () => {
  const jsx = '<p>\n  Siège : 4 rue du\n  Faux-Exemple, 74100 Annemasse\n</p>';
  assert.deepEqual(keys(scanStreets(jsx, M)), [`${HEAD_OFFICE_KEY}:numero+voie:2`], 'la ligne est celle où la rue commence');
  const html = '<p>12 rue <strong>des Exemples</strong></p>';
  assert.deepEqual(scanStreets(html, M), [], 'sans la passe HTML, la balise coupe la rue');
  assert.deepEqual(keys(scanStreets(html, M, { html: true })), ['maison-a:numero+voie:1']);
  const twice = 'a="12 rue des Exemples";b="rue des Exemples";\nc="12 rue des Exemples"';
  const hits = scanStreets(twice, M);
  assert.deepEqual(hits.map((h) => [h.line, h.count, h.form]), [[1, 2, 'numero+voie'], [2, 1, 'numero+voie']]);
  // Passe HTML : une occurrence visible dans les deux passes ne compte qu'une fois.
  assert.equal(scanStreets('<a href="?q=12+rue+des+Exemples">12 rue des Exemples</a>', M, { html: true })[0].count, 2);
  assert.equal(scanStreets('<p>12 rue des Exemples</p>', M, { html: true })[0].count, 1);
});

test('un résultat ne porte jamais le texte trouvé ; le siège social sort sous un libellé neutre, jamais sous la clé de son lieu', () => {
  const hits = scanStreets('12 rue des Exemples — 4 rue du Faux-Exemple', M);
  assert.deepEqual(hits.map((h) => [h.key, h.allowedOnLegalPages]), [['maison-a', false], [HEAD_OFFICE_KEY, true]]);
  assert.equal(HEAD_OFFICE_KEY, 'siege-social');
  assert.deepEqual(M.map((x) => x.key), ['maison-a', 'maison-b', 'maison-c', HEAD_OFFICE_KEY]);
  assert.doesNotMatch(JSON.stringify(hits), /exemple|lieu-du-siege/i);
  for (const h of hits) assert.deepEqual(Object.keys(h).sort(), ['allowedOnLegalPages', 'count', 'form', 'key', 'line']);
});

test('findStreets + blankSpans : les rues identifiées sont effacées, longueur et sauts de ligne conservés', () => {
  const n = normalizeForScan('a\n12 rue des Exemples, 74100\nrue du\nFaux-Exemple\nfin');
  const spans = findStreets(n, M);
  assert.deepEqual(spans.map((s) => [s.key, s.form, s.line]), [['maison-a', 'numero+voie', 2], [HEAD_OFFICE_KEY, 'voie', 3]]);
  const cleared = blankSpans(n, spans);
  assert.equal(cleared.length, n.length);
  assert.equal(cleared.split('\n').length, n.split('\n').length);
  assert.doesNotMatch(cleared, /exemple/);
  assert.match(cleared, /, 74100/);
});

test('lieux sans détecteur possible : ignorés par buildStreetMatchers (et refusés au chargement de la source)', () => {
  assert.equal(buildStreetMatchers([{ key: 'x', street: 'Exemples' }, { key: 'y', street: '12 rue de la' }]).length, 0);
  assert.equal(buildStreetMatchers([{ key: 'z', street: '12 Les Exemples' }]).length, 1, 'sans type de voie connu : cherchée avec son numéro');
  assert.deepEqual(keys(scanStreets('au 12, Les Exemples', buildStreetMatchers([{ key: 'z', street: '12 Les Exemples' }]))), ['z:numero+voie:1']);
  assert.deepEqual(scanStreets('Les Exemples', buildStreetMatchers([{ key: 'z', street: '12 Les Exemples' }])), []);
  assert.deepEqual(buildStreetMatchers(null), []);
  assert.deepEqual(scanStreets('12 rue des Exemples', []), []);
});

test('motif générique : « numéro + rue / avenue / chemin / route / allée / impasse / place / boulevard »', () => {
  const found = ['12 rue des Essais', '12, avenue de la Maquette', '3 bis chemin du Brouillon', '5 Impasse Fictive', '1 place de la Maquette', '24 Boulevard Inventé', '8 allée des Essais', '40 route de Nulle-Part', '12 av. de la Maquette', '3 bd Inventé', "2 rue de l'Essai"];
  for (const f of found) assert.equal(scanGenericAddresses(`x ${f} y`).length, 1, f);
  const safe = ['2 routes prérendues', 'route: 3', 'les 3 maisons', 'place 12', '74100 rue', '12/11/2026 rue Inventée', '2026-11-12 rue Inventée', 'version 1.5 rue', 'rue des Essais', '12 ruelles', 'priorité 1, routePreload'];
  for (const s of safe) assert.deepEqual(scanGenericAddresses(s), [], s);
  assert.deepEqual(scanGenericAddresses('a\nb\n  12 rue des Essais\n'), [{ line: 3, way: 'rue' }]);
  assert.deepEqual(scanGenericAddresses('3 Bd. Inventé'), [{ line: 1, way: 'bd' }]);
});

test('motif générique : lettre collée au numéro, plage de numéros, adresse encodée avec des « + »', () => {
  for (const f of ['12B rue des Essais', '12b, rue des Essais', '12-14 rue des Essais', '12a-14b chemin du Brouillon', '3bis avenue de la Maquette', '3 bis, avenue de la Maquette']) {
    assert.equal(scanGenericAddresses(`x ${f} y`).length, 1, f);
  }
  assert.deepEqual(scanGenericAddresses('origin=12+rue+des+Essais%2C+74100'), [{ line: 1, way: 'rue' }], 'forme d\'une URL');
  assert.deepEqual(scanGenericAddresses('q=5+impasse+fictive'), [{ line: 1, way: 'impasse' }]);
  // Ni un rang (« 3e place »), ni une addition du code (`1+route.length`), ni une date suivie d'un mot de voie.
  for (const s of ['la 3e place du classement', 'le 2e chemin à gauche', 'x=1+route.length', 'a=2+place', 'n=i+1, route=x', 'le 12-11-2026 rue Inventée', '5m route']) {
    assert.deepEqual(scanGenericAddresses(s), [], s);
  }
});

test('motif générique : liste blanche ancrée sur le numéro, sans effet sur une autre adresse', () => {
  const allow = [{ re: /\d{1,4} rue des exemples(?![a-z0-9])/, why: 'adresse fictive' }, { re: /\d{1,4} places? par /, why: 'parking' }];
  assert.deepEqual(scanGenericAddresses('1 rue des Exemples, puis 2 rue des Exemples', allow), []);
  assert.deepEqual(scanGenericAddresses('Parking : 1 place par chambre', allow), []);
  assert.equal(scanGenericAddresses('12 rue des Essais, près du 1 rue des Exemples', allow).length, 1);
  assert.equal(scanGenericAddresses('1 rue des Exemplaires', allow).length, 1);
});

test('pages légales prérendues : les quatre, FR et EN', () => {
  assert.deepEqual([...LEGAL_PRERENDERED_PAGES].sort(), ['en-mentions-legales.html', 'en-politique-de-confidentialite.html', 'mentions-legales.html', 'politique-de-confidentialite.html']);
});
