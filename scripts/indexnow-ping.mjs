#!/usr/bin/env node
// IndexNow — notification des moteurs à index Bing (Bing, et via lui
// ChatGPT/Copilot qui sourcent leurs réponses sur cet index).
//
// POURQUOI (A4-bis, 04/08/2026) : les endpoints historiques de ping sitemap
// (google.com/ping et bing.com/ping) sont dépréciés et répondent 404 depuis
// 2023-2024 — le step « Ping Google & Bing » du workflow ne notifiait plus
// personne. Google découvre désormais via le sitemap déclaré dans GSC (rien à
// faire) ; Bing s'appuie sur IndexNow.
//
// (08/10/2026, audit GSC SYS-05) Seules les URL NOUVELLES ou dont le <lastmod> a changé sont
// soumises, comme le demande le protocole IndexNow. Avant, les ~126 <loc> partaient à chaque run
// (2 fois par jour). Base de comparaison : une copie du sitemap prise AVANT le prérendu (le workflow
// la dépose dans $RUNNER_TEMP), pas HEAD~1 — quand le run ne commit rien, HEAD~1 n'est pas le sitemap
// précédent. Dépend du <lastmod> honnête des pages statiques (scripts/prerender.mjs).
//
// Chaque changement n'étant plus soumis qu'UNE fois, la soumission attend que le déploiement Vercel
// du commit du bot soit en ligne (--wait-live) : sinon Bing pouvait lire l'ancienne version (la
// disponibilité d'hier) et la garder jusqu'à son prochain passage. Le run suivant, lui, ne
// resoumettrait plus rien.
//
// PROTOCOLE : la clé est PUBLIQUE par design — elle vit dans
// public/<clé>.txt, servie à la racine du site (keyLocation), et prouve
// seulement que l'émetteur contrôle le domaine. Aucun secret ici.
//
// Usage : node scripts/indexnow-ping.mjs [--previous <sitemap précédent>] [--wait-live[=<min>]] [--dry-run]
//   --previous  : sitemap d'avant le prérendu ; absent ou illisible → tout le sitemap est soumis
//                 (comportement historique) ; aucune URL nouvelle ni modifiée → rien n'est soumis.
//   --wait-live : avant de soumettre, relit https://www.lavillacoliving.com/sitemap.xml toutes les
//                 20 s jusqu'à y trouver le <lastmod> de ce run pour chaque URL à soumettre
//                 (= déploiement en ligne), au plus 6 min (ou <min>, plafonné à 15) ; au-delà,
//                 soumet quand même et le note dans le journal.
//   --dry-run   : affiche ce qui serait soumis, sans aucun appel réseau (ni attente, ni soumission).
// Sortie : code 0 TOUJOURS — la notification est best-effort, elle ne doit
// jamais faire échouer le déploiement.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parseSitemapLastmod, diffSitemaps, notYetLive } from "./lib/sitemap-lastmod.mjs";

const HOST = "www.lavillacoliving.com";
const KEY = "e81c34f3e1815a0d46b63baf93f18f08"; // = public/<KEY>.txt
const ENDPOINT = "https://api.indexnow.org/indexnow";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Valeur de --previous (« --previous <f> » ou « --previous=<f> »), ou null. */
function previousArg(argv) {
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--previous") return argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : null;
    if (argv[i].startsWith("--previous=")) return argv[i].slice("--previous=".length) || null;
  }
  return null;
}

/** Minutes d'attente du déploiement : « --wait-live » = 6, « --wait-live=<n> » (1 à 15), absent = 0. */
function waitLiveArg(argv) {
  for (const a of argv) {
    if (a === "--wait-live") return 6;
    if (a.startsWith("--wait-live=")) {
      const n = Number(a.slice("--wait-live=".length));
      return Number.isFinite(n) && n > 0 ? Math.min(n, 15) : 6;
    }
  }
  return 0;
}

/**
 * Attend que le sitemap PUBLIÉ porte, pour chaque URL à soumettre, le <lastmod> de ce run : le
 * déploiement du commit du bot est alors en ligne. Best-effort : erreur réseau ou délai dépassé →
 * on rend la main (la soumission part quand même).
 */
async function waitUntilLive(current, urls, minutes) {
  const INTERVAL_MS = 20_000;
  const deadline = Date.now() + minutes * 60_000;
  let pending = urls;
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(`https://${HOST}/sitemap.xml`, { cache: "no-store", signal: AbortSignal.timeout(15_000) });
      if (res.ok) {
        pending = notYetLive(parseSitemapLastmod(await res.text()), current, urls);
        if (pending.length === 0) {
          console.log(`IndexNow: déploiement en ligne (sitemap publié à jour, essai ${attempt}) — soumission`);
          return;
        }
      } else {
        console.log(`IndexNow: sitemap publié en HTTP ${res.status} (essai ${attempt})`);
      }
    } catch (e) {
      console.log(`IndexNow: sitemap publié illisible (essai ${attempt}) — ${e?.message ?? e}`);
    }
    if (Date.now() + INTERVAL_MS > deadline) {
      console.log(`IndexNow: ⚠️ déploiement non constaté après ${minutes} min (${pending.length} URL pas encore à jour en ligne) — soumission quand même`);
      return;
    }
    await new Promise((r) => setTimeout(r, INTERVAL_MS));
  }
}

try {
  const argv = process.argv.slice(2);
  const dryRun = argv.includes("--dry-run");
  const sitemap = readFileSync(join(root, "public", "sitemap.xml"), "utf8");
  const current = parseSitemapLastmod(sitemap);
  // <loc> uniquement (pas les alternates hreflang — mêmes URLs, dédupliquées par la Map)
  let urls = [...current.keys()];

  if (urls.length === 0) {
    console.error("IndexNow: sitemap vide ou illisible — aucune notification envoyée");
    process.exit(0);
  }

  const previousPath = previousArg(argv);
  let previous = null;
  if (previousPath) {
    try {
      previous = parseSitemapLastmod(readFileSync(previousPath, "utf8"));
      if (previous.size === 0) previous = null;
    } catch { previous = null; }
    if (!previous) console.log(`IndexNow: sitemap précédent absent ou illisible (${previousPath}) — soumission de tout le sitemap`);
  } else if (argv.some((a) => a === "--previous" || a.startsWith("--previous="))) {
    console.log("IndexNow: --previous sans fichier — soumission de tout le sitemap");
  }

  if (previous) {
    const diff = diffSitemaps(previous, current);
    console.log(`IndexNow: comparaison au sitemap précédent — ${diff.added.length} nouvelle(s), ${diff.modified.length} lastmod modifié(s), ${diff.unchanged} inchangée(s), ${diff.removed.length} retirée(s) (non soumises)`);
    if (diff.toSubmit.length === 0) {
      console.log("IndexNow: aucune URL nouvelle ni modifiée — rien soumis ✅");
      process.exit(0);
    }
    urls = diff.toSubmit;
  }

  if (dryRun) {
    console.log(`IndexNow (--dry-run): ${urls.length} URL(s) seraient soumises, aucun appel réseau :`);
    for (const u of urls) console.log(`  ${u}`);
    process.exit(0);
  }

  const waitMinutes = waitLiveArg(argv);
  if (waitMinutes > 0) await waitUntilLive(current, urls, waitMinutes);

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList: urls, // limite protocole : 10 000 URLs — on en a ~126
    }),
  });

  // 200 = reçu · 202 = reçu, clé en cours de validation — les deux sont OK
  console.log(`IndexNow: ${urls.length} URLs soumises — HTTP ${res.status}${res.status === 200 || res.status === 202 ? " ✅" : " ⚠️ (voir doc indexnow.org)"}`);
  if (urls.length <= 20) for (const u of urls) console.log(`  ${u}`);
} catch (e) {
  console.error("IndexNow: échec non bloquant —", e?.message ?? e);
}
process.exit(0);
