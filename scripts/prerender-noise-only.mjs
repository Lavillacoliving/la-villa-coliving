#!/usr/bin/env node
/**
 * Le prérendu du jour change-t-il VRAIMENT le site servi ? (12/11/2026, alerte Vercel « Deployment Storage »)
 *
 * PROBLÈME : chaque commit du bot « auto-prerender: » déclenche un déploiement production complet (~140 Mo,
 * dont 121 Mo d'images de public/). Le quota Hobby de 10 Go de stockage des déploiements a été atteint le
 * 12/11/2026 : 98 déploiements en 23 jours, dont 41 commits du cron (05:00 et 13:00 UTC). Une bonne part de
 * ces commits ne changeait RIEN de servi : seulement les identifiants useId/Radix (`radix-_r_7_` → `radix-_r_n_`),
 * l'ordre des blocs JSON-LD, ou le repère `data-offer-today` de /offre-hiver.
 *
 * RÈGLE : prerender.yml ne commite pas (donc ne déploie pas) un run du cron ou de n8n dont TOUS les fichiers
 * modifiés sont des pages prérendues d'empreinte identique (scripts/lib/content-fingerprint.mjs, la même que
 * pour le <lastmod> du sitemap). Toute autre modification compte comme réelle : page ajoutée ou retirée,
 * sitemap.xml, vercel.json, autre fichier. Les disponibilités de chambres restent des changements réels
 * (l'empreinte ne les neutralise pas) : le cron de 13:00 garde sa raison d'être.
 *
 * En plus de l'empreinte, et pour cette décision seulement (pas pour le sitemap) : le repère
 * `data-offer-today="AAAA-MM-JJ"` de <main> sur /offre-hiver est neutralisé. Le premier rendu client relit la
 * date du prérendu puis se resynchronise sur la date réelle (src/pages/OfferHiverPage.tsx) : un repère d'un
 * jour plus ancien, avec le même texte, s'hydrate sans écart. Si le TEXTE change (ligne « Bail au … »,
 * état « terminée »), l'empreinte change et le run déploie.
 *
 * Usage :
 *   node scripts/prerender-noise-only.mjs                      # index git (git add fait) contre HEAD
 *   node scripts/prerender-noise-only.mjs --base A --head B    # deux commits (contrôle a posteriori)
 * Sortie : 0 = bruit seulement (aucun commit nécessaire) ; 1 = au moins un vrai changement, ou doute
 * (erreur, aucun fichier modifié lisible) → le workflow commite comme avant. Ne jamais bloquer par prudence.
 *
 * Testé dans tools/test/prerender-noise-only.test.mjs.
 */

import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { contentFingerprint } from './lib/content-fingerprint.mjs';

const PRERENDERED_HTML_RE = /^public\/prerendered\/[^/]+\.html$/;
const OFFER_TODAY_RE = /(\bdata-offer-today=")\d{4}-\d{2}-\d{2}(")/g;

/** Empreinte utilisée pour décider du déploiement : celle du sitemap, `data-offer-today` en plus neutralisé. */
export function deployFingerprint(html) {
  return contentFingerprint(typeof html === 'string' ? html.replace(OFFER_TODAY_RE, '$1$2') : html);
}

/**
 * Un fichier modifié est-il du bruit ? `before`/`after` : contenu, ou null si le fichier n'existe pas de ce côté.
 * Fonction PURE.
 */
export function isNoiseChange({ path, before, after }) {
  if (!PRERENDERED_HTML_RE.test(path)) return false;
  if (typeof before !== 'string' || typeof after !== 'string') return false;
  return deployFingerprint(before) === deployFingerprint(after);
}

/** Vrai seulement s'il y a au moins un fichier et que TOUS sont du bruit. Fonction PURE. */
export function isNoiseOnly(changes) {
  return Array.isArray(changes) && changes.length > 0 && changes.every(isNoiseChange);
}

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });

function readAt(rev, path) {
  try {
    return git('show', `${rev}:${path}`);
  } catch {
    return null;
  }
}

/** Fichiers modifiés entre `base` et `head` (head absent = index git), avec leur contenu des deux côtés. */
export function collectChanges({ base = 'HEAD', head } = {}) {
  const diffArgs = head ? ['diff', '--name-only', '--no-renames', base, head] : ['diff', '--cached', '--name-only', '--no-renames', base];
  const paths = git(...diffArgs).split('\n').filter(Boolean);
  // `git show :<chemin>` lit l'index (ce que `git add` a préparé).
  const headRev = head ?? '';
  return paths.map((path) => ({ path, before: readAt(base, path), after: readAt(headRev, path) }));
}

function main(argv) {
  const opt = (name) => {
    const i = argv.indexOf(name);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const changes = collectChanges({ base: opt('--base') ?? 'HEAD', head: opt('--head') });
  const real = changes.filter((c) => !isNoiseChange(c)).map((c) => c.path);
  if (isNoiseOnly(changes)) {
    console.log(`♻️  ${changes.length} fichier(s) modifié(s), aucun changement du contenu servi (identifiants useId/Radix, ordre JSON-LD, repère de date).`);
    return 0;
  }
  if (changes.length === 0) console.log('Aucun fichier modifié lu — par prudence, considéré comme un vrai changement.');
  else console.log(`🆕 ${real.length} vrai(s) changement(s) sur ${changes.length} fichier(s) : ${real.slice(0, 15).join(', ')}${real.length > 15 ? ', …' : ''}`);
  return 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (err) {
    console.log(`Vérification impossible (${err.message}) — par prudence, considéré comme un vrai changement.`);
    process.exitCode = 1;
  }
}
