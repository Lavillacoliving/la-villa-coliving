#!/usr/bin/env node
/**
 * D6 du brief « conversion Ads » (13/10/2026 ; option gratuite validée par Jérôme le 13/10) — le nouveau déploiement sert
 * AUSSI les fichiers JS/CSS de la version précédente.
 *
 * Symptôme : chaque mise en ligne de code renomme les chunks hachés (/assets/*.js) ; un visiteur dont l'onglet a chargé la
 * version précédente demande des fichiers qui n'existent plus (404) → `chunk_reload`, au pire `chunk_error`
 * (src/lib/lazyWithRetry.ts, ErrorBoundary). Constat du 13/10 : l'entrée JS du 12/10 à 18 h renvoie 404. La Skew Protection
 * de Vercel demande le plan Pro (le projet est en Hobby) et n'a pas d'intégration Vite.
 *
 * Mécanique (dans `npm run build`, après `vite build`, avant inject-prerendered) :
 *  1. `own` = fichiers de dist/assets produits par ce build ;
 *  2. lecture du manifeste de la version en ligne (`/lvc-assets.json` de la source) :
 *     - version différente (ensemble `own` différent) → on recopie SES fichiers (`live.own`) ;
 *     - même version (2ᵉ build back-to-back du bot de prérendu : mêmes hachages) → on recopie `live.previous`, pour que la
 *       version d'avant reste servie après ce rebuild ;
 *     - pas de manifeste (premier déploiement de ce script) → exploration du graphe en ligne : HTML → entrée →
 *       __vite__mapDeps, import("./…"), url(/assets/…) ;
 *  3. téléchargement des fichiers manquants dans dist/assets (jamais d'écrasement : un nom haché = un contenu) ;
 *  4. écriture de dist/lvc-assets.json { own, previous } : `previous` = UNE seule version, jamais d'accumulation
 *     (consigne de Jérôme du 13/10).
 *
 * Jamais bloquant : erreur réseau, délai, réponse HTML ou taille excessive = avertissement, le build continue (au pire sans
 * copie, comme avant). Source : KEEP_ASSETS_ORIGIN si défini ; sinon, sur Vercel, la production pour VERCEL_ENV=production,
 * et pour une preview l'alias de branche (VERCEL_BRANCH_URL = déploiement précédent de la même branche) puis la production.
 * Hors Vercel et sans KEEP_ASSETS_ORIGIN : ne fait rien (`npm run build` local et la CI restent hors ligne).
 * Fonctions pures testées : tools/test/keep-previous-assets.test.mjs.
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const MANIFEST_FILE = 'lvc-assets.json';
export const PRODUCTION_ORIGIN = 'https://www.lavillacoliving.com';
const LIMITS = { files: 600, bytes: 40 * 1024 * 1024, perFileMs: 15_000, totalMs: 120_000, concurrency: 8 };

/** Nom de fichier d'asset sûr (plat, sans chemin) : lettres, chiffres, « _ », « - », « . ». */
export function isSafeAssetName(name) {
  return typeof name === 'string' && /^[A-Za-z0-9_][A-Za-z0-9_.-]*\.(?:js|css|woff2?|ttf|otf|svg|png|jpe?g|webp|avif|gif|ico)$/.test(name) && !name.includes('..');
}

/** Noms d'assets référencés par un HTML, un JS ou un CSS de build Vite (/assets/x, "assets/x", "./x.js"). Pur. */
export function extractAssetRefs(text) {
  const out = new Set();
  const s = String(text);
  for (const m of s.matchAll(/(?:^|[^A-Za-z0-9_.-])\/?assets\/([A-Za-z0-9_][A-Za-z0-9_.-]*\.[A-Za-z0-9]+)/g)) out.add(m[1]);
  for (const m of s.matchAll(/["'`(]\.\/([A-Za-z0-9_][A-Za-z0-9_.-]*\.(?:js|css))["'`)]/g)) out.add(m[1]);
  return [...out].filter(isSafeAssetName).sort();
}

/**
 * Que recopier ? `live` = manifeste de la version en ligne (ou null) ; `own` = fichiers de ce build. Pur.
 * → { mode: 'new-version' | 'same-version' | 'bootstrap', carry: string[] }
 */
export function planCarry({ live, own }) {
  const ownSet = new Set(own);
  const valid = live && Array.isArray(live.own) && live.own.every(isSafeAssetName);
  if (!valid) return { mode: 'bootstrap', carry: [] };
  const liveOwn = [...new Set(live.own)].sort();
  const same = liveOwn.length === ownSet.size && liveOwn.every((f) => ownSet.has(f));
  const prev = Array.isArray(live.previous) ? live.previous.filter(isSafeAssetName) : [];
  return same ? { mode: 'same-version', carry: [...new Set(prev)].sort() } : { mode: 'new-version', carry: liveOwn };
}

/** Sources à essayer, dans l'ordre (voir l'en-tête). Pur. */
export function sourceOrigins(env) {
  if (env.KEEP_ASSETS_ORIGIN) return [env.KEEP_ASSETS_ORIGIN.replace(/\/+$/, '')];
  if (!env.VERCEL) return [];
  if (env.VERCEL_ENV === 'production') return [PRODUCTION_ORIGIN];
  const branch = env.VERCEL_BRANCH_URL ? [`https://${env.VERCEL_BRANCH_URL}`] : [];
  return [...branch, PRODUCTION_ORIGIN];
}

const warn = (msg) => console.warn(`⚠️  keep-previous-assets : ${msg}`);

async function fetchOk(url, deadline) {
  const left = deadline - Date.now();
  if (left <= 0) throw new Error('budget de temps épuisé');
  const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(Math.min(LIMITS.perFileMs, left)) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res;
}

/** Télécharge un asset ; refuse une réponse HTML (repli SPA) et un type incohérent. */
async function fetchAsset(origin, name, deadline) {
  const res = await fetchOk(`${origin}/assets/${name}`, deadline);
  const type = res.headers.get('content-type') || '';
  if (/text\/html/i.test(type)) throw new Error('réponse HTML (fichier absent)');
  if (name.endsWith('.js') && !/javascript|ecmascript/i.test(type)) throw new Error(`type inattendu ${type}`);
  if (name.endsWith('.css') && !/text\/css/i.test(type)) throw new Error(`type inattendu ${type}`);
  return Buffer.from(await res.arrayBuffer());
}

async function pool(items, worker) {
  const queue = [...items];
  const runners = Array.from({ length: Math.min(LIMITS.concurrency, queue.length) }, async () => {
    while (queue.length) await worker(queue.shift());
  });
  await Promise.all(runners);
}

/**
 * Copie `names` depuis `origin` dans `assetsDir` (sans écraser) ; `explore` = suivre les références des JS/CSS téléchargés
 * (exploration du premier déploiement). Retourne la liste des fichiers désormais présents (copiés ou déjà là).
 */
async function copyAssets(origin, names, assetsDir, ownSet, deadline, explore) {
  const seen = new Set();
  const present = new Set();
  let bytes = 0;
  let pending = [...names];
  while (pending.length) {
    const batch = pending.filter((n) => !seen.has(n) && isSafeAssetName(n));
    pending = [];
    for (const n of batch) seen.add(n);
    await pool(batch, async (name) => {
      if (ownSet.has(name)) { present.add(name); return; }
      if (seen.size > LIMITS.files) return;
      try {
        const buf = await fetchAsset(origin, name, deadline);
        bytes += buf.length;
        if (bytes > LIMITS.bytes) throw new Error('plafond de taille atteint');
        await fs.writeFile(path.join(assetsDir, name), buf, { flag: 'wx' }).catch((e) => { if (e.code !== 'EEXIST') throw e; });
        present.add(name);
        if (explore && /\.(js|css)$/.test(name)) pending.push(...extractAssetRefs(buf.toString('utf8')));
      } catch (e) {
        warn(`${name} non copié (${e.message})`);
      }
    });
  }
  return { present: [...present].sort(), bytes };
}

export async function run({ env = process.env, distDir = path.join(ROOT, 'dist') } = {}) {
  const origins = sourceOrigins(env);
  const assetsDir = path.join(distDir, 'assets');
  const own = (await fs.readdir(assetsDir)).filter(isSafeAssetName).sort();
  const ownSet = new Set(own);
  let previous = [];
  if (origins.length === 0) {
    console.log('keep-previous-assets : hors Vercel et sans KEEP_ASSETS_ORIGIN — aucune copie (manifeste écrit).');
  }
  const deadline = Date.now() + LIMITS.totalMs;
  for (const origin of origins) {
    try {
      let live = null;
      try {
        const res = await fetchOk(`${origin}/${MANIFEST_FILE}`, deadline);
        if (!/json/i.test(res.headers.get('content-type') || '')) throw new Error('pas du JSON');
        live = await res.json();
      } catch (e) {
        warn(`manifeste de ${origin} illisible (${e.message}) — exploration du graphe en ligne`);
      }
      const plan = planCarry({ live, own });
      let names = plan.carry;
      if (plan.mode === 'bootstrap') {
        const html = await (await fetchOk(`${origin}/`, deadline)).text();
        names = extractAssetRefs(html);
        if (names.length === 0) throw new Error('aucun asset dans le HTML en ligne');
      }
      const { present, bytes } = await copyAssets(origin, names, assetsDir, ownSet, deadline, plan.mode === 'bootstrap');
      previous = present;
      const copied = present.filter((n) => !ownSet.has(n)).length;
      console.log(`keep-previous-assets : ${origin} (${plan.mode}) — ${copied} fichier(s) de la version précédente copiés (${Math.round(bytes / 1024)} Ko), ${present.length} servis au total pour elle.`);
      break;
    } catch (e) {
      warn(`${origin} : ${e.message} — source suivante ou aucune copie`);
    }
  }
  // Manifeste de CE déploiement : ses propres fichiers + UNE version précédente (jamais d'accumulation).
  await fs.writeFile(path.join(distDir, MANIFEST_FILE), JSON.stringify({ schema: 1, own, previous }, null, 0) + '\n');
  return { own, previous };
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  run().catch((e) => { warn(`erreur inattendue (${e.message}) — build poursuivi sans copie`); });
}
