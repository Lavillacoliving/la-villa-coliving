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
// PROTOCOLE : la clé est PUBLIQUE par design — elle vit dans
// public/<clé>.txt, servie à la racine du site (keyLocation), et prouve
// seulement que l'émetteur contrôle le domaine. Aucun secret ici.
//
// Usage : node scripts/indexnow-ping.mjs   (après génération du sitemap)
// Sortie : code 0 TOUJOURS — la notification est best-effort, elle ne doit
// jamais faire échouer le déploiement.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HOST = "www.lavillacoliving.com";
const KEY = "e81c34f3e1815a0d46b63baf93f18f08"; // = public/<KEY>.txt
const ENDPOINT = "https://api.indexnow.org/indexnow";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

try {
  const sitemap = readFileSync(join(root, "public", "sitemap.xml"), "utf8");
  // <loc> uniquement (pas les alternates hreflang — mêmes URLs, dédupliquées)
  const urls = [...new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]))];

  if (urls.length === 0) {
    console.error("IndexNow: sitemap vide ou illisible — aucune notification envoyée");
    process.exit(0);
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList: urls, // limite protocole : 10 000 URLs — on en a ~115
    }),
  });

  // 200 = reçu · 202 = reçu, clé en cours de validation — les deux sont OK
  console.log(`IndexNow: ${urls.length} URLs soumises — HTTP ${res.status}${res.status === 200 || res.status === 202 ? " ✅" : " ⚠️ (voir doc indexnow.org)"}`);
} catch (e) {
  console.error("IndexNow: échec non bloquant —", e?.message ?? e);
}
process.exit(0);
