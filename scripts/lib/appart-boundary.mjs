/**
 * Frontière des deux gammes, côté code (L'Appart, brief du 12/11/2026 ; ARCHITECTURE § 1.6 b) — SOURCE UNIQUE des règles,
 * lue par eslint.config.js (règle no-restricted-imports, `npm run lint`) et par tools/test/appart-boundary.test.mjs
 * (`npm run test:tools`, qui ne dépend pas d'ESLint).
 *
 * Les fichiers de L'Appart (ses données, ses composants, ses deux pages) n'importent AUCUNE preuve ni table des maisons :
 *  - de src/data/stats.ts : seulement ce qui vaut pour les deux gammes (dérivation des prix, formats, temps de train depuis la
 *    gare d'Annemasse, repères du marché, groupe Facebook) — liste d'autorisation ;
 *  - de src/data/entityFacts.ts : seulement les constantes communes exportées par leur nom (bail, caution et frais, garant,
 *    bouton de la fiche, phrases canoniques de L'Appart et de la marque, renvoi vers les maisons) — liste d'autorisation ;
 *  - jamais src/data/priceFacts.ts (justification du prix des MAISONS) ni src/data/houseLocation.ts (emplacement des MAISONS :
 *    L'Appart lit src/data/appartLocation.ts ou src/data/placeLocation.ts).
 * Toute nouvelle porte est une décision : l'ajouter ici, avec sa raison.
 *
 * Ce que ce contrôle ne voit pas (une chaîne écrite à la main) : la garde du HTML publié (gammeMixIssues, étape E2g) le juge.
 */
import path from 'node:path';

/** Fichiers de L'Appart (motifs ESLint, chemins relatifs à la racine du dépôt). */
export const APPART_BOUNDARY_FILES = [
  'src/data/appart*.ts',
  'src/components/appart/**/*.{ts,tsx}',
  'src/pages/LAppartPage.tsx',
  'src/pages/AppartRoomPage.tsx',
];

/** src/data/stats.ts : noms permis aux fichiers de L'Appart (tout autre nom est une donnée des maisons). */
export const STATS_ALLOWED = [
  'TAUX_BCE', 'thousands', 'aOrAn', 'PriceTier', 'priceTier', 'ANNEMASSE_TRAIN_MIN', 'MARKET_ROOM_EUR', 'MARKET_COMPARISON', 'FACEBOOK_GROUP',
];

/** src/data/entityFacts.ts : constantes communes aux deux gammes, exportées par leur nom pour L'Appart. */
export const ENTITY_FACTS_ALLOWED = [
  'GUARANTOR_SENTENCE', 'LEASE_SENTENCE', 'FEES_DEPOSIT_SENTENCE', 'ENTITY_FACTS_CTA',
  'MAISONS_CROSS_LINK', 'MAISONS_REFERRAL', 'APPART_CANONICAL_SENTENCE', 'BRAND_CANONICAL_SENTENCE', 'EntityLang',
];

/** Modules des maisons interdits en entier aux fichiers de L'Appart. */
export const HOUSE_ONLY_MODULES = ['src/data/priceFacts', 'src/data/houseLocation'];

const RULES = new Map([
  ['src/data/stats', { allowed: STATS_ALLOWED }],
  ['src/data/entityFacts', { allowed: ENTITY_FACTS_ALLOWED }],
  ...HOUSE_ONLY_MODULES.map((m) => [m, { allowed: [] }]),
]);

/** Les formes d'écriture d'un module de src/data dans un import (alias, relatif depuis src/data, src/components/appart, src/pages). */
export function importSpecifiers(modulePath) {
  const base = modulePath.replace(/^src\//, '');
  const name = path.posix.basename(base);
  return [`@/${base}`, `@/${base}.ts`, `./${name}`, `./${name}.ts`, `../${base}`, `../${base}.ts`, `../../${base}`, `../../${base}.ts`];
}

/** Règle ESLint `no-restricted-imports` équivalente (paths). */
export function eslintRestrictedPaths() {
  const out = [];
  for (const [mod, { allowed }] of RULES) {
    const message = allowed.length
      ? `L'Appart (deux gammes, jamais fondues) : de ${mod}.ts, seulement ${allowed.join(', ')} — scripts/lib/appart-boundary.mjs.`
      : `L'Appart (deux gammes, jamais fondues) : ${mod}.ts décrit les maisons — scripts/lib/appart-boundary.mjs.`;
    for (const name of importSpecifiers(mod)) out.push(allowed.length ? { name, allowImportNames: allowed, message } : { name, message });
  }
  return out;
}

/** Imports d'un fichier source : module importé et noms (« default », « * » pour un espace de noms). Pur. */
export function parseImports(source) {
  const src = source.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:"'`])\/\/.*$/gm, '$1');
  const out = [];
  const named = (clause) => {
    const braces = /\{([^}]*)\}/.exec(clause);
    return braces ? braces[1].split(',').map((part) => part.trim().replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim()).filter(Boolean) : [];
  };
  // import X, { a, b as c, type D } from "…" · import * as N from "…" · import type { T } from "…"
  for (const m of src.matchAll(/\bimport\s+(?:type\s+)?([^;'"`]*?)\s*from\s*["']([^"']+)["']/g)) {
    const clause = m[1].trim();
    const names = named(clause);
    const head = clause.replace(/\{[^}]*\}/, '').replace(/,/g, ' ').trim();
    if (/\*\s+as\s+\w+/.test(head)) names.push('*');
    else if (head) names.push('default');
    out.push({ specifier: m[2], names });
  }
  // export { a } from "…" · export * from "…" · export * as N from "…"
  for (const m of src.matchAll(/\bexport\s+(?:type\s+)?(\*(?:\s+as\s+\w+)?|\{[^}]*\})\s*from\s*["']([^"']+)["']/g)) {
    out.push({ specifier: m[2], names: m[1].startsWith('*') ? ['*'] : named(m[1]) });
  }
  // import("…")
  for (const m of src.matchAll(/\bimport\(\s*["']([^"']+)["']\s*\)/g)) out.push({ specifier: m[1], names: ['*'] });
  return out;
}

/** Module visé par un import, en chemin du dépôt sans extension (« src/data/stats ») ; null hors du dépôt. */
export function resolveSpecifier(file, specifier) {
  let p;
  if (specifier.startsWith('@/')) p = `src/${specifier.slice(2)}`;
  else if (specifier.startsWith('.')) p = path.posix.normalize(path.posix.join(path.posix.dirname(file), specifier));
  else return null;
  return p.replace(/\.(tsx?|mjs|js)$/, '');
}

/** Infractions d'un fichier de L'Appart (`file` : chemin du dépôt, « src/data/appart.ts »). Pur. */
export function boundaryIssues(file, source) {
  const issues = [];
  for (const { specifier, names } of parseImports(source)) {
    const mod = resolveSpecifier(file, specifier);
    const rule = mod && RULES.get(mod);
    if (!rule) continue;
    for (const n of names) if (!rule.allowed.includes(n)) issues.push(`${file} : « ${n} » importé de ${mod}.ts (donnée des maisons)`);
  }
  return issues;
}
