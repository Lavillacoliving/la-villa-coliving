/**
 * Garde CI des pages maisons (Lot A — A1, 02/09/2026).
 *
 * Pourquoi : le 02/09, le brief « /leloft » supposait un écart de template entre les trois
 * maisons. Il n'y en avait pas (template partagé), mais rien ne le PROUVAIT à chaque build,
 * et une 4ᵉ maison ajoutée en base sans page prérendue passerait inaperçue. Ce script relit
 * `v_public_rooms` (la seule source de dispo) et vérifie, pour CHAQUE maison publique, que la
 * page prérendue FR et EN est complète et cohérente.
 *
 * Exécuté par .github/workflows/prerender.yml APRÈS le prérendu et AVANT le commit des pages :
 * un échec bloque la publication. En local : `node scripts/house-pages-check.mjs` après
 * `npm run build:local`.
 */

import fs from 'fs/promises';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRERENDERED = path.join(__dirname, '..', 'public', 'prerendered');

// Même projet / clé anon (lecture seule) que scripts/prerender.mjs et src/lib/supabase.ts.
const SUPABASE_URL = 'https://tefpynkdxxfiefpkgitz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZnB5bmtkeHhmaWVmcGtnaXR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4OTg5NDksImV4cCI6MjA4NjQ3NDk0OX0.X_Z85w6L4i1IkVevMK73hpFRClCpgh0Gh0WMY9pdDtw';

function httpsGet(url, headers) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => (res.statusCode >= 200 && res.statusCode < 300 ? resolve(JSON.parse(data)) : reject(new Error(`HTTP ${res.statusCode}: ${data}`))));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

async function fetchRooms() {
  const url = `${SUPABASE_URL}/rest/v1/v_public_rooms?select=house_slug,room_number,availability,available_from,rent_chf&order=house_slug,room_number`;
  const rows = await httpsGet(url, { apikey: SUPABASE_ANON_KEY, Accept: 'application/json' });
  if (!Array.isArray(rows) || rows.length === 0) throw new Error('v_public_rooms vide — anomalie (la vue rend 29 lignes)');
  const byHouse = new Map();
  for (const r of rows) {
    if (!byHouse.has(r.house_slug)) byHouse.set(r.house_slug, []);
    byHouse.get(r.house_slug).push(r);
  }
  return byHouse;
}

function count(haystack, needle) {
  return haystack.split(needle).length - 1;
}

function extractEmbed(html, id) {
  const m = html.match(new RegExp(`<script type="application/json" id="${id}">([\\s\\S]*?)</script>`));
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch { return null; }
}

async function checkHouse(slug, rooms) {
  const failures = [];
  const candidates = rooms.filter((r) => r.availability === 'available' || !!r.available_from);
  for (const lang of ['fr', 'en']) {
    const file = lang === 'fr' ? `${slug}.html` : `en-${slug}.html`;
    const prefix = lang === 'fr' ? '' : '/en';
    let html;
    try {
      html = await fs.readFile(path.join(PRERENDERED, file), 'utf-8');
    } catch {
      failures.push(`${file} : page prérendue ABSENTE (nouvelle maison ? → STATIC_ROUTES de scripts/prerender.mjs, App.tsx, routePreload.ts, HouseDetailPage.tsx)`);
      continue;
    }
    // 1. Embed chambres : toutes les lignes de la maison, sérialisées au prérendu.
    const embed = extractEmbed(html, '__rooms_level_data__');
    const mine = Array.isArray(embed) ? embed.filter((r) => r.house_slug === slug) : [];
    if (mine.length !== rooms.length) failures.push(`${file} : embed __rooms_level_data__ = ${mine.length} chambre(s), base = ${rooms.length}`);
    // 2. Chaque chambre est nommée ; chaque chambre candidate a son CTA à deux paramètres.
    for (const r of rooms) {
      const name = lang === 'fr' ? `Chambre ${r.room_number}` : `Room ${r.room_number}`;
      if (!html.includes(name)) failures.push(`${file} : « ${name} » introuvable`);
    }
    for (const r of candidates) {
      const cta = `href="${prefix}/candidature?property_interest=${slug}&amp;room_interest=chambre-${r.room_number}"`;
      const ctaRaw = cta.replace('&amp;', '&');
      if (!html.includes(cta) && !html.includes(ctaRaw)) failures.push(`${file} : CTA chambre ${r.room_number} (candidate) sans property_interest+room_interest`);
    }
    // 3. Tous les CTA de candidature de la page portent la maison (hero, pricing, final, sticky, nav ×2, footer).
    const contextual = count(html, `property_interest=${slug}`);
    if (contextual < 7) failures.push(`${file} : seulement ${contextual} lien(s) property_interest=${slug} (attendu ≥ 7)`);
    const bare = count(html, `href="${prefix}/candidature"`);
    if (bare > 0) failures.push(`${file} : ${bare} lien(s) /candidature NU(S) (sans property_interest)`);
    // 4. Prix : jamais de virgule anglaise en FR, jamais d'espace FR en EN ; jamais de montant périmé.
    if (lang === 'fr' && /\b1,[0-9]{3} CHF/.test(html)) failures.push(`${file} : prix au format anglais (1,430 CHF) sur une page FR`);
    if (/1[  ]380 CHF|1,380 CHF/.test(html)) failures.push(`${file} : montant périmé 1 380 CHF`);
    // 5. Marqueurs d'hydratation posés par scripts/prerender.mjs.
    if (!html.includes('<!--$-->') || !html.includes('<!--/$-->')) failures.push(`${file} : marqueurs Suspense <!--$--> absents (hydratation #418 garantie)`);
    // 6. Pas de dispo chiffrée en dur : le badge doit venir de l'embed résumé.
    if (!extractEmbed(html, '__room_availability_data__')) failures.push(`${file} : embed __room_availability_data__ absent`);
  }
  return failures;
}

async function main() {
  console.log('\n🏠 Garde pages maisons — v_public_rooms × public/prerendered/\n');
  const byHouse = await fetchRooms();
  let total = 0;
  for (const [slug, rooms] of byHouse) {
    const failures = await checkHouse(slug, rooms);
    total += failures.length;
    const candidates = rooms.filter((r) => r.availability === 'available' || !!r.available_from).length;
    console.log(`${failures.length === 0 ? '✅' : '❌'} ${slug} — ${rooms.length} chambres, ${candidates} candidate(s)`);
    for (const f of failures) console.log(`   • ${f}`);
  }
  if (total > 0) {
    console.error(`\n❌ ${total} problème(s) — pages maisons NON publiables.`);
    process.exit(1);
  }
  console.log('\n🎉 Pages maisons cohérentes avec la base (FR + EN).\n');
}

main().catch((err) => { console.error('Fatal:', err.message); process.exit(1); });
