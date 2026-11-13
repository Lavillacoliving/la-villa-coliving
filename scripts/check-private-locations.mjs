/**
 * Garde « aucune rue de maison » (lot « sécurité des adresses », 11/2026) — `npm run check:locations`.
 *
 * Règle (CLAUDE.md §1) : le site publie la zone d'une maison et un point public à ≈ 500 m, jamais sa rue.
 * Depuis ce lot, aucune rue de maison n'est écrite dans le dépôt ni dans le JavaScript construit : un écran qui
 * a besoin d'une adresse la lit en base, avec la session connectée (src/lib/propertyAddress.ts).
 *
 * Deux parties :
 *   1. EXACTE — les rues réelles, lues dans une source HORS dépôt (scripts/lib/private-locations.mjs : secret
 *      `LVC_PRIVATE_LOCATIONS` en CI, fichier désigné par `LVC_PRIVATE_LOCATIONS_FILE` en local), cherchées dans
 *      TOUS les fichiers du dépôt (suivis, ou nouveaux et non ignorés : code, SQL, sauvegardes, HTML prérendu,
 *      JSON-LD, llms.txt, sitemap, noms de fichiers) et dans tout `dist/` (JavaScript construit compris).
 *      Comparaison normalisée : casse, accents, espaces et tirets, abréviations courantes, encodage d'URL,
 *      entités HTML, échappements JS, rue coupée sur deux lignes, rue sans son numéro.
 *   2. GÉNÉRIQUE — le motif « numéro + rue / avenue / chemin / route / allée / impasse / place / boulevard »
 *      dans `src/`, `scripts/` et le JavaScript de `dist/`. Elle tourne toujours, même sans source, et attrape
 *      une adresse que la source ne connaît pas encore.
 *
 * Exceptions (aucune n'est globale) :
 *   - le siège social de la société éditrice (lieu marqué `allowedOnLegalPages` dans la source) : toléré sur les
 *     seules pages légales, où sa publication est une obligation, et dans le générateur de bail v2 — fichier par
 *     fichier, avec un nombre maximal d'occurrences (HEAD_OFFICE_EXCEPTIONS) ;
 *   - partie générique seulement : une liste blanche courte de faux positifs stables (GENERIC_ALLOW). Elle ne lit
 *     ni le HTML prérendu ni les articles de blog, qui citent des adresses d'institutions publiques.
 *
 * Confidentialité : la garde n'écrit JAMAIS une rue. Une fuite est désignée par la clé du lieu, le fichier et le
 * numéro de ligne ; pour le siège social, par le libellé neutre « siège social », jamais par la clé de son lieu
 * (HEAD_OFFICE_KEY). En CI, chaque rue est d'abord déclarée au masque des journaux (`::add-mask::`).
 *
 * Ce qui est lu : tout fichier qui n'est ni un média ni un document (extension). Un octet nul ne fait PAS sauter
 * un fichier (decodeText) ; le compte rendu dit combien de fichiers ne sont pas lus, et nomme les documents et
 * archives (PDF, Word, zip…), que la garde ne sait pas ouvrir : ceux-là se contrôlent à la main.
 *
 * Sans source : la partie exacte est sautée avec un avertissement, la partie générique tourne quand même.
 * Options : --require (échec si la source manque) · --require-dist (échec si dist/ manque) · --no-dist ·
 *           --dist <dossier> (autre copie du site construit) · --no-repo · --json · --help
 *           Toute autre option est refusée : une faute de frappe ne coupe pas une exigence en silence.
 * Sortie : 1 si une fuite est trouvée, si la source est invalide, si une option est inconnue, ou si une option
 *          --require-* n'est pas satisfaite.
 *
 * À lancer AVANT tout push, sur un arbre propre (`git status` vide), après `npx vite build`, AVEC `--require
 * --require-dist` (sans elles, une source absente — variable vide ou non définie — et un `dist/` manquant ne donnent
 * qu'un avertissement) :
 *   npx vite build && LVC_PRIVATE_LOCATIONS_FILE=<fichier hors dépôt> npm run check:locations -- --require --require-dist
 * La garde lit les fichiers du disque, pas l'historique : une rue committée puis retirée dans un commit suivant
 * partirait quand même avec le push (réécrire d'abord ces commits locaux). Le dépôt est public, la CI passe après le push.
 * En CI : .github/workflows/prerender.yml, après le build et le prérendu, avant le commit du bot.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  loadPrivateLocations, buildStreetMatchers, normalizeForScan, findStreets, scanStreetsNormalized, blankSpans,
  scanGenericNormalized, parseStreet, PrivateLocationsError, LOCATIONS_ENV, LOCATIONS_FILE_ENV, LEGAL_PRERENDERED_PAGES,
  HEAD_OFFICE_KEY,
} from './lib/private-locations.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

/**
 * Documents et archives : du texte qui peut porter une adresse, mais compressé — la garde ne sait pas l'ouvrir.
 * Ils ne sont pas lus ; le compte rendu les NOMME, pour un contrôle à la main (aucun dans le dépôt au 13/11/2026).
 */
export const OPAQUE_EXT = /\.(?:pdf|docx?|xlsx?|pptx?|od[tsp]|zip|gz|tgz|bz2|xz|7z|rar|tar|br)$/i;
/** Fichiers jamais lus comme du texte : images, polices, vidéos, sons — et les documents et archives ci-dessus. */
export const BINARY_EXT = /\.(?:png|jpe?g|webp|gif|ico|avif|heic|bmp|tiff?|woff2?|ttf|otf|eot|mp4|mov|webm|mp3|wav|pdf|docx?|xlsx?|pptx?|od[tsp]|zip|gz|tgz|bz2|xz|7z|rar|tar|br)$/i;

/**
 * Texte d'un fichier, quel que soit son encodage. Un octet nul ne fait jamais sauter un fichier : il est retiré
 * (un fichier JavaScript peut en contenir un dans une chaîne), et un texte en UTF-16 (un octet sur deux à zéro,
 * avec ou sans marque d'ordre d'octets) est décodé comme tel. Pur.
 * @param {Buffer} buf
 */
export function decodeText(buf) {
  const utf16 = (b, bigEndian) => {
    const even = b.length % 2 === 0 ? Buffer.from(b) : Buffer.from(b.subarray(0, b.length - 1));
    if (bigEndian) even.swap16();
    return even.toString('utf16le');
  };
  let text;
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) text = utf16(buf.subarray(2), false);
  else if (buf.length >= 2 && buf[0] === 0xfe && buf[1] === 0xff) text = utf16(buf.subarray(2), true);
  else {
    // UTF-16 sans marque : sur le début du fichier, les octets nuls sont tous à la même parité.
    const sample = buf.subarray(0, 4096);
    let odd = 0;
    let even = 0;
    for (let i = 0; i < sample.length; i++) if (sample[i] === 0) { if (i % 2) odd++; else even++; }
    const half = sample.length / 2;
    if (half >= 8 && odd > half * 0.4 && even < half * 0.05) text = utf16(buf, false);
    else if (half >= 8 && even > half * 0.4 && odd < half * 0.05) text = utf16(buf, true);
    else text = buf.toString('utf8');
  }
  return text.includes('\0') ? text.replace(/\0/g, '') : text;
}

/** Options reconnues. Une option inconnue est une erreur : `--requrie` ne doit pas couper `--require` en silence. */
const CLI_FLAGS = ['--require', '--require-dist', '--no-dist', '--no-repo', '--json', '--help'];
const CLI_VALUED = ['--dist'];
export const USAGE = `usage : node scripts/check-private-locations.mjs [${CLI_FLAGS.join('] [')}] [--dist <dossier>]`;

/**
 * Lecture de la ligne de commande. Renvoie `{ flags: Set, values: { '--dist': … } }`, ou `{ error }` pour une option
 * inconnue, un argument isolé ou une valeur manquante. Pur.
 */
export function parseCliOptions(argv) {
  const flags = new Set();
  const values = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (CLI_FLAGS.includes(arg)) flags.add(arg);
    else if (CLI_VALUED.includes(arg)) {
      const next = argv[i + 1];
      if (next === undefined || next === '' || next.startsWith('--')) return { error: `option ${arg} : valeur manquante` };
      values[arg] = next;
      i++;
    } else return { error: `option inconnue : ${arg.startsWith('-') ? arg.split('=')[0].slice(0, 40) : '(argument isolé)'}` };
  }
  return { flags, values };
}

/**
 * Où le siège social de la société éditrice (lieu `allowedOnLegalPages` de la source) est toléré, et combien de
 * fois au plus par fichier. Tout autre fichier, toute occurrence de plus = fuite. Les chemins de `dist/` suivent
 * les noms de fichiers produits par Vite : si le découpage du JavaScript change, la garde échoue, son message
 * renvoie ici, et cette liste se met à jour en connaissance de cause. Les plafonds sont figés par un test
 * (tools/test/check-private-locations.test.mjs) : les relever demande de modifier aussi le test.
 */
export const HEAD_OFFICE_EXCEPTIONS = [
  // Pages légales — sources.
  { file: /^src\/data\/entityFacts\.ts$/, max: 1, why: 'siège social des mentions légales (LEGAL_ENTITY.headOffice)' },
  { file: /^src\/pages\/PolitiqueConfidentialitePage\.tsx$/, max: 2, why: 'politique de confidentialité, FR et EN (responsable du traitement)' },
  // Pages légales — HTML prérendu, dans le dépôt et dans dist/ : la page entière est une page légale.
  { file: new RegExp(`^(?:public|dist)/prerendered/(?:${LEGAL_PRERENDERED_PAGES.map((f) => f.replace(/\./g, '\\.')).join('|')})$`), max: Infinity, why: 'page légale prérendue' },
  // Pages légales — JavaScript construit.
  { file: /^dist\/assets\/entityFacts-[\w-]+\.js$/, max: 1, why: 'JavaScript des mentions légales' },
  { file: /^dist\/assets\/PolitiqueConfidentialitePage-[\w-]+\.js$/, max: 2, why: 'JavaScript de la politique de confidentialité' },
  // Générateur de bail v2 : conservé tel quel (décision du 13/11/2026), il imprime le siège social du bailleur.
  { file: /^src\/pages\/dashboard\/BailPDF\.tsx$/, max: 3, why: 'générateur de bail v2' },
  { file: /^src\/pages\/dashboard\/DashboardNouveauBailPage\.tsx$/, max: 3, why: 'générateur de bail v2' },
  { file: /^dist\/assets\/DashboardNouveauBailPage-[\w-]+\.js$/, max: 6, why: 'JavaScript du générateur de bail v2' },
];

/**
 * Liste blanche de la partie générique : faux positifs STABLES, chacun avec sa raison. `re` s'applique au texte
 * normalisé (minuscules, sans accents) à partir du numéro trouvé. Pour une adresse d'institution publique qui
 * entrerait dans `src/` ou `scripts/` : ajouter ici une ligne commentée, jamais une exclusion de dossier.
 */
export const GENERIC_ALLOW = [
  { re: /\d{1,4}(?: (?:bis|ter))?,? rue des exemples(?![a-z0-9])/, why: 'adresse FICTIVE du dépôt (commentaires, page de démonstration) : « N rue des Exemples »' },
  { re: /\d{1,4}(?: (?:bis|ter))?,? rue du faux[- ]exemple(?![a-z0-9])/, why: 'adresse FICTIVE du dépôt : « N rue du Faux-Exemple »' },
  { re: /1, rue jules-lefebvre, 75009 paris/, why: 'Bureau central de tarification, cité par la notice d\'information officielle annexée au bail (src/data/noticeInformation2023.ts)' },
  { re: /\d{1,4} places? (?:par|de parking)(?![a-z0-9])/, why: '« 1 place par chambre » : une place de parking, pas une voie' },
];

/** Exception « siège social » applicable à un fichier (chemin relatif à la racine, séparateur « / »), ou null. */
export function headOfficeException(rel) {
  return HEAD_OFFICE_EXCEPTIONS.find((e) => e.file.test(rel)) ?? null;
}

/** Périmètre de la partie générique : `src/`, `scripts/` et le JavaScript de `dist/`. */
export function inGenericScope(rel) {
  return rel.startsWith('src/') || rel.startsWith('scripts/') || (rel.startsWith('dist/') && /\.(?:js|mjs|cjs)$/i.test(rel));
}

/**
 * Contrôle d'un fichier. `matchers` vide = source absente (partie exacte sautée).
 * Renvoie { exact: [{ file, line, key, form, over }], generic: [{ file, line, way }], tolerated: { headOffice, generic } }.
 * `key` = clé du lieu, ou HEAD_OFFICE_KEY pour le siège social (jamais la clé de son lieu dans la source).
 * `over` = { found, max } quand le siège social dépasse l'exception du fichier. Jamais le texte trouvé. Pur.
 */
export function auditFile(rel, text, matchers = []) {
  const normalized = normalizeForScan(text);
  const exception = headOfficeException(rel);
  const out = { exact: [], generic: [], tolerated: { headOffice: 0, generic: 0 } };
  let spans = [];
  if (matchers.length > 0) {
    spans = findStreets(normalized, matchers);
    const hits = scanStreetsNormalized(normalized, matchers, { html: /\.html?$/i.test(rel) });
    const headOfficeTotal = hits.filter((h) => h.allowedOnLegalPages).reduce((n, h) => n + h.count, 0);
    const within = exception !== null && headOfficeTotal <= exception.max;
    for (const h of hits) {
      if (h.allowedOnLegalPages && within) { out.tolerated.headOffice += h.count; continue; }
      const over = h.allowedOnLegalPages && exception !== null ? { found: headOfficeTotal, max: exception.max } : null;
      out.exact.push({ file: rel, line: h.line, key: h.key, form: h.form, over });
    }
  }
  if (inGenericScope(rel)) {
    // Les rues déjà identifiées par la partie exacte sont effacées : la partie générique ne signale que le reste.
    const cleared = blankSpans(normalized, spans);
    const hits = scanGenericNormalized(cleared, GENERIC_ALLOW);
    out.tolerated.generic += scanGenericNormalized(cleared, []).length - hits.length;
    // Sans source, le siège social ne peut pas être reconnu : il est toléré par fichier, dans la même limite.
    if (matchers.length === 0 && exception !== null && hits.length <= exception.max) out.tolerated.generic += hits.length;
    else for (const g of hits) out.generic.push({ file: rel, line: g.line, way: g.way });
  }
  return out;
}

/** Rues dans les NOMS de fichiers (chemins relatifs). Renvoie [{ file, line: 0, key, form, over: null }]. Pur. */
export function auditFileNames(rels, matchers = []) {
  if (matchers.length === 0) return [];
  const out = [];
  for (const rel of rels) {
    for (const h of scanStreetsNormalized(normalizeForScan(rel), matchers)) out.push({ file: rel, line: 0, key: h.key, form: h.form, over: null });
  }
  return out;
}

const FORM_LABEL = { 'numero+voie': 'numéro et voie', voie: 'voie sans son numéro' };

/**
 * Ligne de compte rendu d'une fuite de la partie exacte : fichier, ligne, lieu — jamais la rue. Le siège social est
 * désigné comme tel, sans la clé de son lieu, et la ligne dit où regarder (HEAD_OFFICE_EXCEPTIONS). Pur.
 */
export function describeLeak(e) {
  const where = e.line > 0 ? `${e.file}:${e.line}` : `${e.file} (nom du fichier)`;
  const form = FORM_LABEL[e.form] ?? e.form;
  if (e.key !== HEAD_OFFICE_KEY) return `${where} — rue du lieu « ${e.key} » (${form})`;
  const extra = e.over ? ` : ${e.over.found} occurrence(s) dans ce fichier pour ${e.over.max} tolérée(s)` : '';
  return `${where} — siège social hors des emplacements prévus (${form})${extra} — voir HEAD_OFFICE_EXCEPTIONS`;
}

/** Chaînes à déclarer au masque des journaux de GitHub Actions : la rue entière et la rue sans son numéro. Pur. */
export function maskValues(places) {
  const values = new Set();
  for (const p of places ?? []) {
    const street = String(p.street ?? '').trim();
    if (!street) continue;
    values.add(street);
    const { number } = parseStreet(street);
    if (number.length) {
      const withoutNumber = street.replace(/^\s*\d+\s*[a-zA-Z]?(?:\s+(?:bis|ter|quater))?[\s,]+/i, '').trim();
      if (withoutNumber && withoutNumber !== street) values.add(withoutNumber);
    }
  }
  return [...values].filter((v) => !/[\r\n]/.test(v));
}

/* ─────────────────────────── exécution ─────────────────────────── */

async function walk(dir, base = dir, acc = []) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(abs, base, acc);
    else if (entry.isFile() || entry.isSymbolicLink()) acc.push(path.relative(base, abs).split(path.sep).join('/'));
  }
  return acc;
}

/** Texte d'un fichier, ou null s'il n'est pas lisible (supprimé du disque, dossier, lien cassé) — jamais sauté pour son contenu. */
async function readText(abs) {
  let buf;
  try { buf = await fs.readFile(abs); } catch { return null; }
  return decodeText(buf);
}

/**
 * Fichiers du dépôt à lire : suivis (`--cached`) ET nouveaux non ignorés (`--others`). En CI, une page tout juste
 * prérendue n'est pas encore suivie au moment de la garde : sans `--others`, elle ne serait pas lue. Un fichier
 * ignoré (`.gitignore`) ne l'est pas. Testé sur un dépôt git temporaire (tools/test/check-private-locations.test.mjs).
 */
export function repoFiles(root = ROOT) {
  const out = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], { cwd: root, maxBuffer: 1 << 28 });
  return [...new Set(out.toString('utf8').split('\0').filter(Boolean))];
}

async function main() {
  const cli = parseCliOptions(process.argv.slice(2));
  if (cli.error) { console.error(`❌ ${cli.error}\n${USAGE}`); process.exit(1); }
  const has = (name) => cli.flags.has(name);
  const value = (name) => cli.values[name] ?? null;
  if (has('--help')) { console.log(USAGE); return; }
  const json = has('--json');
  const log = (...a) => { if (!json) console.log(...a); };
  const inCi = process.env.GITHUB_ACTIONS === 'true';

  let source;
  try { source = await loadPrivateLocations({ root: ROOT }); } catch (e) {
    if (e instanceof PrivateLocationsError) { console.error(`\n❌ ${e.message}\n`); process.exit(1); }
    throw e;
  }
  // Avant tout autre affichage : en CI, chaque rue entre au masque des journaux.
  if (inCi && source.places) for (const v of maskValues(source.places)) console.log(`::add-mask::${v}`);

  log('\n🔒 Garde « aucune rue de maison » — fichiers du dépôt + site construit\n');
  const matchers = source.places ? buildStreetMatchers(source.places) : [];
  if (source.places) log(`   source : ${source.origin} · ${source.places.length} lieu(x)`);
  else {
    const lines = [
      'PARTIE EXACTE NON EXÉCUTÉE — aucune source des rues',
      `(variable ${LOCATIONS_ENV} vide et ${LOCATIONS_FILE_ENV} absent)`,
      'Seule la partie générique tourne : une rue écrite sans son numéro passerait.',
    ];
    if (has('--require') || process.env.REQUIRE_PRIVATE_LOCATIONS === '1') { console.error(`❌ ${lines.join(' ')}`); process.exit(1); }
    log(`⚠️  ${'═'.repeat(70)}`);
    for (const l of lines) log(`⚠️  ${l}`);
    log(`⚠️  ${'═'.repeat(70)}`);
    if (inCi) console.log(`::warning title=Garde des rues incomplète::${lines[0]} ${lines[1]}`);
  }

  // 1. Fichiers à lire : dépôt (suivis + nouveaux non ignorés) puis site construit.
  const targets = []; // { rel, abs }
  if (!has('--no-repo')) {
    let rels;
    try { rels = repoFiles(); } catch { console.error('❌ liste des fichiers du dépôt indisponible (`git ls-files` a échoué : git absent, ou dossier hors dépôt)'); process.exit(1); }
    for (const rel of rels) targets.push({ rel, abs: path.join(ROOT, rel) });
  }
  const repoCount = targets.length;
  let distCount = 0;
  let distMissing = false;
  if (!has('--no-dist')) {
    const distDir = path.resolve(value('--dist') ?? path.join(ROOT, 'dist'));
    let rels = null;
    try { rels = await walk(distDir); } catch { distMissing = true; }
    if (rels) { for (const rel of rels) targets.push({ rel: `dist/${rel}`, abs: path.join(distDir, rel) }); distCount = rels.length; }
    if (distMissing) {
      const msg = 'dist/ absent : le JavaScript construit n\'est PAS contrôlé (lancer `npx vite build` avant la garde)';
      if (has('--require-dist')) { console.error(`❌ ${msg}`); process.exit(1); }
      log(`⚠️  ${msg}`);
    }
  }

  // 2. Contrôle.
  const exact = auditFileNames(targets.map((t) => t.rel), matchers);
  const generic = [];
  const tolerated = { headOffice: 0, generic: 0 };
  let read = 0;
  let genericRead = 0;
  const notRead = { media: 0, opaque: [], unreadable: 0 }; // rien n'est sauté en silence
  for (const { rel, abs } of targets) {
    if (BINARY_EXT.test(rel)) { if (OPAQUE_EXT.test(rel)) notRead.opaque.push(rel); else notRead.media++; continue; }
    const text = await readText(abs);
    if (text === null) { notRead.unreadable++; continue; }
    read++;
    if (inGenericScope(rel)) genericRead++;
    const r = auditFile(rel, text, matchers);
    exact.push(...r.exact);
    generic.push(...r.generic);
    tolerated.headOffice += r.tolerated.headOffice;
    tolerated.generic += r.tolerated.generic;
  }

  // 3. Compte rendu — jamais le texte trouvé.
  if (json) {
    console.log(JSON.stringify({ source: source.places ? source.origin : null, files: { repo: repoCount, dist: distCount, read, genericRead, notRead }, tolerated, exact, generic }, null, 2));
  } else {
    if (matchers.length > 0) {
      log(`${exact.length === 0 ? '✅' : '❌'} partie exacte — ${read} fichier(s) texte lus (dépôt : ${repoCount} fichier(s), site construit : ${distCount}), ${exact.length} fuite(s) ; siège social : ${tolerated.headOffice} occurrence(s) aux emplacements prévus`);
      for (const e of exact) log(`   • ${describeLeak(e)}`);
    }
    log(`${generic.length === 0 ? '✅' : '❌'} partie générique — ${genericRead} fichier(s) lus (src/, scripts/, JavaScript de dist/), ${generic.length} adresse(s) hors liste blanche (${tolerated.generic} tolérée(s))`);
    for (const g of generic) log(`   • ${g.file}:${g.line} — motif « numéro + ${g.way} »`);
    log(`   non lus : ${notRead.media} image(s), police(s), vidéo(s) ou son(s) ; ${notRead.opaque.length} document(s) ou archive(s) ; ${notRead.unreadable} fichier(s) absent(s) du disque ou illisible(s)`);
    if (notRead.opaque.length > 0) {
      const shown = notRead.opaque.slice(0, 20).join(', ');
      log(`⚠️  ${notRead.opaque.length} document(s) ou archive(s) que la garde ne sait pas ouvrir — à contrôler à la main : ${shown}${notRead.opaque.length > 20 ? ' …' : ''}`);
      if (inCi) console.log(`::warning title=Garde des rues : fichiers non lus::${notRead.opaque.length} document(s) ou archive(s) non lus (PDF, Word, zip…) : à contrôler à la main`);
    }
  }
  const total = exact.length + generic.length;
  if (total > 0) {
    const headOffice = exact.some((e) => e.key === HEAD_OFFICE_KEY)
      ? ' Siège social hors des emplacements prévus : si seul le nom d\'un fichier JavaScript a changé (autre découpage du build), mettre à jour HEAD_OFFICE_EXCEPTIONS et son test ; sinon, retirer l\'adresse.'
      : '';
    console.error(`\n❌ ${total} fuite(s) — rien à publier en l'état. Une adresse de maison se lit en base, jamais dans le code ; une adresse d'exemple s'écrit « N rue des Exemples » ; un faux positif stable s'ajoute à GENERIC_ALLOW avec sa raison.${headOffice}\n`);
    process.exit(1);
  }
  log(`\n🎉 Aucune rue de maison${matchers.length > 0 ? '' : ' détectée par la partie générique (partie exacte non exécutée)'}.\n`);
}

// Importable par les tests (fonctions pures ci-dessus) : main() ne tourne qu'en exécution directe.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  // Le message d'une erreur inattendue peut citer un extrait de ce qui a été lu : seuls son type et son code sortent.
  main().catch((e) => { console.error('Fatal:', e instanceof PrivateLocationsError ? e.message : `${e?.name ?? 'Erreur'}${e?.code ? ` ${e.code}` : ''} (message non affiché : il pourrait citer une valeur lue)`); process.exit(1); });
}
