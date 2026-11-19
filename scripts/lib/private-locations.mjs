/**
 * Lieux privés : détection des rues des maisons dans du texte, du code ou du JavaScript construit.
 * Fonctions PURES (testées dans tools/test/private-locations.test.mjs avec des adresses fictives) +
 * un chargeur de la source. Utilisé par scripts/check-private-locations.mjs (`npm run check:locations`)
 * et par scripts/house-pages-check.mjs (contrôle `exactLocationLeaks`).
 *
 * Règle (CLAUDE.md §1) : le site publie la zone et un point public à ≈ 500 m, jamais la rue d'une maison.
 * Depuis le lot « sécurité des adresses » (11/2026), AUCUNE rue de maison n'est écrite dans ce dépôt : les
 * valeurs à chercher viennent d'une source hors dépôt, jamais d'un fichier suivi ni d'une variable de build
 * (Vite recopierait une variable `VITE_*` dans le JavaScript servi).
 *
 * Source (format v1) — JSON : { "version": 1, "places": [ { "key", "street", "allowedOnLegalPages"? … } ] }
 *   - CI : secret GitHub `LVC_PRIVATE_LOCATIONS`, passé à l'étape en variable d'environnement ;
 *   - local : variable `LVC_PRIVATE_LOCATIONS_FILE` = chemin d'un fichier HORS du dépôt.
 *   `allowedOnLegalPages: true` marque le siège social de la société éditrice : sa publication sur les pages
 *   légales est une obligation ; partout ailleurs il est traité comme une rue de maison.
 *
 * Confidentialité : aucune fonction de ce module ne renvoie ni n'écrit le texte trouvé. Un résultat ne porte
 * que la clé du lieu (`key` ; pour le siège social, le libellé neutre HEAD_OFFICE_KEY), la forme trouvée et un
 * numéro de ligne. Les messages d'erreur ne citent jamais une valeur de la source.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

export const LOCATIONS_ENV = 'LVC_PRIVATE_LOCATIONS';
export const LOCATIONS_FILE_ENV = 'LVC_PRIVATE_LOCATIONS_FILE';

/**
 * Libellé du siège social dans tous les résultats, à la place de la clé que la source donne à ce lieu. La clé de la
 * source nomme un lieu ; le siège, lui, est publié sur les pages légales : un message « rue du lieu « <clé> » » avec
 * le fichier et la ligne, dans un journal public, relierait ce lieu à une adresse publiée. Aucun résultat ne porte
 * donc la clé d'un lieu `allowedOnLegalPages`.
 */
export const HEAD_OFFICE_KEY = 'siege-social';

/**
 * Pages légales prérendues (noms de fichiers de public/prerendered/) : les seules pages où le siège social de la
 * société éditrice (lieu `allowedOnLegalPages`) doit figurer.
 */
export const LEGAL_PRERENDERED_PAGES = Object.freeze([
  'mentions-legales.html', 'en-mentions-legales.html', 'politique-de-confidentialite.html', 'en-politique-de-confidentialite.html',
]);

/** Erreur de source : son message ne contient jamais une valeur de la source. */
export class PrivateLocationsError extends Error {}

/**
 * Lit le JSON de la source. Toute erreur est reformulée : le message d'origine de JSON.parse cite un extrait
 * du texte lu, donc potentiellement une rue. Une rue que le détecteur ne saurait pas chercher (ni numéro ni
 * type de voie reconnu) est refusée : un lieu ne reste jamais sans contrôle en silence.
 * @returns {{ key: string, street: string, allowedOnLegalPages: boolean }[]}
 */
export function parsePrivateLocations(jsonText) {
  let data;
  let raw = String(jsonText);
  if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1); // marque d'ordre d'octets en tête de fichier
  try { data = JSON.parse(raw); } catch { throw new PrivateLocationsError('source des lieux privés illisible : JSON attendu (format v1)'); }
  if (!data || typeof data !== 'object' || data.version !== 1 || !Array.isArray(data.places)) {
    throw new PrivateLocationsError('source des lieux privés : format v1 attendu ({ "version": 1, "places": [...] })');
  }
  const places = [];
  const seen = new Set();
  data.places.forEach((p, i) => {
    const key = typeof p?.key === 'string' ? p.key.trim() : '';
    const street = typeof p?.street === 'string' ? p.street.trim() : '';
    if (!/^[a-z0-9-]{2,40}$/.test(key)) throw new PrivateLocationsError(`source des lieux privés : lieu n° ${i + 1} sans clé valide (« key » : minuscules, chiffres, tirets)`);
    if (seen.has(key)) throw new PrivateLocationsError(`source des lieux privés : clé « ${key} » en double`);
    if (!street) throw new PrivateLocationsError(`source des lieux privés : lieu « ${key} » sans rue (« street »)`);
    const place = { key, street, allowedOnLegalPages: p.allowedOnLegalPages === true };
    if (key === HEAD_OFFICE_KEY && !place.allowedOnLegalPages) {
      throw new PrivateLocationsError(`source des lieux privés : la clé « ${HEAD_OFFICE_KEY} » est réservée au lieu marqué « allowedOnLegalPages »`);
    }
    // Le message d'une erreur de construction citerait le motif, donc la rue : il n'est jamais repris.
    let usable = false;
    try { usable = buildStreetMatchers([place]).length > 0; } catch { usable = false; }
    if (!usable) {
      throw new PrivateLocationsError(`source des lieux privés : la rue du lieu « ${key} » n'est pas exploitable (ni numéro ni type de voie reconnu, ou aucun mot distinctif)`);
    }
    seen.add(key);
    places.push(place);
  });
  if (places.length === 0) throw new PrivateLocationsError('source des lieux privés : aucun lieu');
  return places;
}

/**
 * Charge la source. Renvoie `{ places, origin }`, ou `{ places: null, origin: null }` si aucune source n'est
 * fournie (variable vide ou absente, pas de fichier indiqué). Une source fournie mais invalide lève une
 * PrivateLocationsError : une garde ne se désactive pas en silence.
 * `root` (facultatif) : racine du dépôt — un fichier de rues placé dedans est refusé.
 */
export async function loadPrivateLocations({ env = process.env, root = null } = {}) {
  const inline = env[LOCATIONS_ENV];
  if (typeof inline === 'string' && inline.trim() !== '') {
    return { places: parsePrivateLocations(inline), origin: `variable ${LOCATIONS_ENV}` };
  }
  const file = env[LOCATIONS_FILE_ENV];
  if (typeof file === 'string' && file.trim() !== '') {
    const abs = path.resolve(file.trim());
    if (root) {
      const rel = path.relative(path.resolve(root), abs);
      if (rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel))) {
        throw new PrivateLocationsError(`${LOCATIONS_FILE_ENV} désigne un fichier situé DANS le dépôt : la source des rues doit vivre hors du dépôt`);
      }
    }
    let text;
    try { text = await fs.readFile(abs, 'utf8'); } catch { throw new PrivateLocationsError(`${LOCATIONS_FILE_ENV} : fichier introuvable ou illisible`); }
    return { places: parsePrivateLocations(text), origin: `fichier local (${LOCATIONS_FILE_ENV})` };
  }
  return { places: null, origin: null };
}

/* ─────────────────────────── normalisation ─────────────────────────── */

const NAMED_ENTITIES = {
  nbsp: ' ', amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', rsquo: "'", lsquo: "'", ndash: '-', mdash: '-', shy: '',
  eacute: 'e', egrave: 'e', ecirc: 'e', euml: 'e', agrave: 'a', acirc: 'a', auml: 'a', ccedil: 'c', icirc: 'i', iuml: 'i',
  ocirc: 'o', ouml: 'o', ugrave: 'u', ucirc: 'u', uuml: 'u', oelig: 'oe', aelig: 'ae',
};
const oneLine = (s) => s.replace(/[\r\n]/g, ' ');
const fromCode = (n) => { try { return oneLine(String.fromCodePoint(n)); } catch { return ' '; } };

/**
 * Texte prêt à comparer : séquences d'échappement JS/JSON, entités HTML et encodage d'URL décodés, sans accents,
 * en minuscules, tirets et apostrophes typographiques ramenés à « - » et « ' », espaces insécables ramenés à une espace,
 * caractères invisibles retirés au milieu d'un mot.
 * Le NOMBRE DE SAUTS DE LIGNE est conservé (un saut de ligne décodé devient une espace) : l'index d'une
 * correspondance donne donc son numéro de ligne dans le fichier d'origine.
 */
export function normalizeForScan(text) {
  let s = String(text ?? '');
  // 1. Échappements JS/JSON : \uXXXX, \u{…}, \xHH ; \n \r \t écrits en deux caractères ; \/ .
  s = s.replace(/\\u\{([0-9a-fA-F]{1,6})\}/g, (_, h) => fromCode(parseInt(h, 16)));
  s = s.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => fromCode(parseInt(h, 16)));
  s = s.replace(/\\x([0-9a-fA-F]{2})/g, (_, h) => fromCode(parseInt(h, 16)));
  s = s.replace(/\\[nrt]/g, ' ').replace(/\\\//g, '/');
  // 2. Entités HTML.
  s = s.replace(/&#x([0-9a-fA-F]{1,6});/g, (_, h) => fromCode(parseInt(h, 16)));
  s = s.replace(/&#(\d{1,7});/g, (_, d) => fromCode(parseInt(d, 10)));
  s = s.replace(/&([a-zA-Z]{2,8});/g, (m, name) => (Object.hasOwn(NAMED_ENTITIES, name.toLowerCase()) ? NAMED_ENTITIES[name.toLowerCase()] : m));
  // 3. Encodage d'URL (%20, %2C, %C3%A9…), deux passes pour un lien encodé deux fois (%2520). Une séquence invalide
  //    est laissée telle quelle.
  for (let pass = 0; pass < 2; pass++) {
    s = s.replace(/(?:%[0-9a-fA-F]{2})+/g, (m) => { try { return oneLine(decodeURIComponent(m)); } catch { return m; } });
  }
  // 4. Accents (signes combinants U+0300 à U+036F), casse, typographie. Les caractères spéciaux sont écrits en
  //    échappements : un éditeur ne peut pas les altérer sans que cela se voie.
  s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  s = s.replace(/[\u2018\u2019\u201a\u2032`\u00b4]/g, "'").replace(/[\u2010-\u2015\u2212]/g, '-');
  s = s.replace(/\u0153/g, 'oe').replace(/\u00e6/g, 'ae');
  // 5. Caractères invisibles (césure molle, sans chasse, joints, marque d'ordre d'octets), fréquents dans un
  //    copier-coller depuis un PDF ou un traitement de texte : au milieu d'un mot, ils sont retirés (le mot se
  //    recolle) ; ailleurs, ils deviennent une espace (« r.<invisible>des » reste « r. des »).
  s = s.replace(/(?<=[\p{L}\p{N}])[\u00ad\u180e\u200b-\u200d\u2060-\u2064\ufeff]+(?=[\p{L}\p{N}])/gu, '');
  s = s.replace(/[\u00a0\u00ad\u1680\u180e\u2000-\u200d\u202f\u205f\u2060-\u2064\u3000\ufeff]/g, ' ');
  return s;
}

/** Variante pour le HTML : les balises d'une même ligne deviennent une espace (« 12 rue <b>des Exemples</b> »). */
export function stripInlineTags(normalized) {
  return normalized.replace(/<[^<>\n]*>/g, ' ');
}

/* ─────────────────────────── rues exactes ─────────────────────────── */

/** Types de voie reconnus → abréviations courantes (sans accents, minuscules). */
export const WAY_TYPES = {
  rue: ['r'], avenue: ['av', 'ave'], boulevard: ['bd', 'bld', 'blvd', 'boul'], chemin: ['ch', 'che', 'chem'], route: ['rte'],
  allee: ['all'], impasse: ['imp'], place: ['pl'], square: ['sq'], passage: ['pass'], quai: [], cours: ['crs'], sentier: [],
  voie: [], promenade: ['prom'], montee: ['mte'], faubourg: ['fg', 'fbg'], traverse: ['trav'], ruelle: [], venelle: [],
  esplanade: ['espl'], residence: ['res'], lotissement: ['lot'], hameau: ['ham'], clos: [], cite: [], parvis: [],
};
/** Mots d'un nom de voie souvent abrégés. */
const NAME_ABBREVIATIONS = {
  saint: ['st'], sainte: ['ste'], general: ['gal', 'gen'], docteur: ['dr'], marechal: ['mal'], president: ['pdt', 'pres'],
  professeur: ['pr', 'prof'], lieutenant: ['lt'], capitaine: ['cne'], commandant: ['cdt'], colonel: ['col'],
};
/** Petits mots qu'une autre graphie peut omettre (« rue du Lac » ↔ « rue Lac »). */
const PARTICLES = new Set(['de', 'du', 'des', 'd', 'la', 'le', 'les', 'l', 'aux', 'au', 'a', 'en', 'et', 'sur', 'sous']);

/** Ce qui peut séparer deux mots d'une adresse : espaces (sauts de ligne compris), ponctuation, `+` des URL, `{' '}` du JSX. */
const SEP = String.raw`[\s,;.:+_\-'"/(){}\\]*`;
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** `after` : ce qui doit suivre une ABRÉVIATION (le mot entier, lui, n'a pas cette contrainte). */
const withAbbreviations = (word, abbreviations, after = '(?![a-z0-9])') => (abbreviations && abbreviations.length
  ? `(?:${escapeRe(word)}|(?:${abbreviations.map(escapeRe).join('|')})\\.?${after})`
  : escapeRe(word));
/**
 * Après l'abréviation d'un TYPE DE VOIE (« r. », « av », « ch »…) : une espace, ou le « + » d'une URL. Sans cette
 * règle, une variable d'une ou deux lettres du JavaScript minifié suivie d'une ponctuation puis d'un mot du nom
 * (`r.exemples`, `f(r,"exemples")`, `{av:"exemples"}`) passerait pour une rue : fuite introuvable, puisque la garde
 * ne montre jamais le texte. Le type de voie écrit en entier reste reconnu devant n'importe quel séparateur.
 */
const AFTER_WAY_ABBREVIATION = '(?=[\\s+])';

/**
 * Découpe une rue (« 12 bis rue des Exemples ») en numéro, type de voie et mots du nom (normalisés).
 * `way` vaut null si le premier mot après le numéro n'est pas un type de voie connu.
 */
export function parseStreet(street) {
  const tokens = normalizeForScan(street).split(/[^a-z0-9]+/).filter(Boolean);
  const number = [];
  while (tokens.length && (/^\d+[a-z]?$/.test(tokens[0]) || (number.length && /^(bis|ter|quater)$/.test(tokens[0])))) number.push(tokens.shift());
  const way = tokens.length && Object.hasOwn(WAY_TYPES, tokens[0]) ? tokens.shift() : null;
  return { number, way, name: tokens };
}

/**
 * Un détecteur par lieu. Deux formes : « numero+voie » (le numéro et la rue) et « voie » (la rue sans son numéro,
 * ou avec un autre numéro). Le nom de la voie seul (sans « rue », « avenue »…) n'est jamais cherché : il sert aussi
 * de nom de quartier ou de commune dans les textes publiés. Une rue sans type de voie reconnu n'est cherchée
 * qu'avec son numéro ; une rue sans mot distinctif n'a pas de détecteur (refusée au chargement de la source).
 * Le détecteur d'un lieu `allowedOnLegalPages` (le siège social) porte la clé HEAD_OFFICE_KEY, jamais celle de la
 * source : aucun résultat, aucun message ne relie donc ce lieu à l'adresse publiée du siège.
 * @param {{ key: string, street: string, allowedOnLegalPages?: boolean }[]} places
 */
export function buildStreetMatchers(places) {
  const matchers = [];
  for (const place of places ?? []) {
    const { number, way, name } = parseStreet(place.street);
    const significant = name.filter((w) => !PARTICLES.has(w));
    if (significant.length === 0) continue; // rien de distinctif à chercher
    const nameRe = name
      .map((w) => (PARTICLES.has(w) ? `(?:${escapeRe(w)}${SEP})?` : `${withAbbreviations(w, NAME_ABBREVIATIONS[w])}${SEP}`))
      .join('')
      .replace(new RegExp(`${escapeRe(SEP)}$`), '');
    const numberRe = number.length ? number.map(escapeRe).join(SEP) : null;
    let source;
    if (way) {
      const wayRe = withAbbreviations(way, WAY_TYPES[way], AFTER_WAY_ABBREVIATION);
      source = `(?<![a-z0-9])(?:(${numberRe ?? '(?!)'})${SEP})?${wayRe}${SEP}${nameRe}(?![a-z0-9])`;
    } else if (numberRe) {
      source = `(?<![a-z0-9])(${numberRe})${SEP}${nameRe}(?![a-z0-9])`;
    } else continue;
    const headOffice = place.allowedOnLegalPages === true;
    matchers.push({ key: headOffice ? HEAD_OFFICE_KEY : place.key, allowedOnLegalPages: headOffice, re: new RegExp(source, 'g') });
  }
  return matchers;
}

/** Numéro de ligne (à partir de 1) d'un index dans un texte. */
const lineAt = (text, index) => {
  let line = 1;
  for (let i = text.indexOf('\n'); i !== -1 && i < index; i = text.indexOf('\n', i + 1)) line++;
  return line;
};

/**
 * Toutes les occurrences dans un texte DÉJÀ normalisé : [{ key, form, index, length, line, allowedOnLegalPages }].
 * `index` et `length` portent sur le texte normalisé (voir blankSpans). Jamais le texte trouvé.
 */
export function findStreets(normalized, matchers) {
  const found = [];
  for (const { key, allowedOnLegalPages, re } of matchers ?? []) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(normalized)) !== null) {
      if (m[0].length === 0) { re.lastIndex++; continue; }
      found.push({ key, form: m[1] !== undefined ? 'numero+voie' : 'voie', index: m.index, length: m[0].length, line: lineAt(normalized, m.index), allowedOnLegalPages });
    }
  }
  return found.sort((a, b) => a.index - b.index);
}

/** Remplace des portions `{ index, length }` d'un texte par des espaces, sauts de ligne conservés. */
export function blankSpans(text, spans) {
  let out = text;
  for (const { index, length } of spans) {
    out = out.slice(0, index) + out.slice(index, index + length).replace(/[^\n]/g, ' ') + out.slice(index + length);
  }
  return out;
}

function tally(found, into) {
  const perPass = new Map();
  for (const f of found) {
    const id = `${f.key}|${f.line}`;
    const cur = perPass.get(id);
    if (!cur) perPass.set(id, { key: f.key, form: f.form, line: f.line, count: 1, allowedOnLegalPages: f.allowedOnLegalPages });
    else { cur.count++; if (f.form === 'numero+voie') cur.form = 'numero+voie'; }
  }
  for (const [id, hit] of perPass) {
    const prev = into.get(id);
    if (!prev) into.set(id, hit);
    else into.set(id, { ...prev, count: Math.max(prev.count, hit.count), form: prev.form === 'numero+voie' || hit.form === 'numero+voie' ? 'numero+voie' : 'voie' });
  }
}

/**
 * Rues trouvées dans un texte DÉJÀ normalisé : [{ key, form, line, count, allowedOnLegalPages }], une entrée par lieu
 * et par ligne (`count` = nombre d'occurrences sur la ligne). `html: true` ajoute une passe sans les balises (le
 * compte retenu est le plus grand des deux passes). Ne renvoie jamais le texte trouvé.
 */
export function scanStreetsNormalized(normalized, matchers, { html = false } = {}) {
  if (!matchers || matchers.length === 0) return [];
  const hits = new Map();
  tally(findStreets(normalized, matchers), hits);
  if (html) tally(findStreets(stripInlineTags(normalized), matchers), hits);
  return [...hits.values()].sort((a, b) => a.line - b.line || a.key.localeCompare(b.key));
}

/** Rues trouvées dans un texte brut (normalisé ici) — voir scanStreetsNormalized. */
export function scanStreets(text, matchers, options = {}) {
  if (!matchers || matchers.length === 0) return [];
  return scanStreetsNormalized(normalizeForScan(text), matchers, options);
}

/* ─────────────────────────── motif générique ─────────────────────────── */

/** Types de voie du motif générique « numéro + voie ». */
export const GENERIC_WAY_WORDS = ['rue', 'avenue', 'chemin', 'route', 'allee', 'impasse', 'place', 'boulevard'];
/**
 * Numéro : 1 à 4 chiffres, une lettre collée de A à D (« 12B » ; pas « 3e », qui est un rang), une plage (« 12-14 »),
 * « bis / ter / quater ».
 * Puis deux écritures : la forme courante (espaces, virgule facultative, « av. » et « bd » compris), ou la forme
 * d'une URL (« N+rue+des+… » : un « + » de chaque côté du type de voie — `1+route.length` n'est pas une adresse).
 * Limite connue : les autres abréviations (« r. », « ch. », « rte »…) ne sont vues que par la partie exacte.
 */
const GENERIC_NUMBER = String.raw`\d{1,4}[a-d]?(?:-\d{1,4}[a-d]?)?(?:\s?(?:bis|ter|quater))?`;
const GENERIC_RE = new RegExp(
  String.raw`(?<![a-z0-9.,/\-])${GENERIC_NUMBER}(?:\s*,?\s+(${GENERIC_WAY_WORDS.join('|')}|av\.?|bd\.?)(?![a-z0-9])(?=[\s.]*[a-z'])|\+(${GENERIC_WAY_WORDS.join('|')})\+(?=[a-z']))`,
  'g',
);
/** Longueur du texte (à partir du numéro) soumis à la liste blanche. */
const GENERIC_TAIL = 160;

/**
 * Motif générique sur un texte DÉJÀ normalisé (voir scanGenericAddresses). Renvoie [{ line, way, index }].
 */
export function scanGenericNormalized(normalized, allow = []) {
  const anchored = allow.map(({ re }) => new RegExp(`^(?:${re.source})`, re.flags.replace(/[gy]/g, '')));
  const hits = [];
  GENERIC_RE.lastIndex = 0;
  let m;
  while ((m = GENERIC_RE.exec(normalized)) !== null) {
    const tail = normalized.slice(m.index, m.index + GENERIC_TAIL);
    if (anchored.some((re) => re.test(tail))) continue;
    hits.push({ line: lineAt(normalized, m.index), way: (m[1] ?? m[2]).replace(/\.$/, ''), index: m.index });
  }
  return hits;
}

/**
 * Motif générique « numéro + rue / avenue / chemin / route / allée / impasse / place / boulevard ».
 * `allow` : liste blanche de { re, why } — `re` est essayée sur le texte normalisé (minuscules, sans accents)
 * À PARTIR du numéro trouvé : elle décrit le début de l'adresse tolérée.
 * Renvoie [{ line, way }] ; jamais le texte trouvé.
 */
export function scanGenericAddresses(text, allow = []) {
  return scanGenericNormalized(normalizeForScan(text), allow).map(({ line, way }) => ({ line, way }));
}
