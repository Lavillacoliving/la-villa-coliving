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
 *
 * (Lot L2 « Emplacement et transport », 09/10/2026) En plus, par maison et par langue, la section Localisation est
 * comparée à la source unique src/data/houseLocation.ts (chargée via esbuild) : phrase de quartier A.2 présente
 * exactement une fois, ligne de trajet ENTITY_HOUSES[].commute dans les 1 500 premiers caractères du <main> après le
 * H1, attribut data-house-location-version = HOUSE_LOCATION_VERSION, lien « Calculer mon trajet » vers Google Maps
 * depuis le point public de la maison (jamais sa rue, 12/10/2026) ; et ROOM_SURFACE_BY_HOUSE (stats.ts) = Math.round(min/max de v_public_rooms.surface_m2)
 * par maison. Fonctions pures exportées, testées dans tools/test/house-pages-check.test.mjs.
 *
 * (12/10/2026, sécurité — cambriolage, décision Jérôme) Le site ne publie plus l'emplacement exact des maisons : la page
 * maison affiche la ZONE (houseZone), « Calculer mon trajet » part du point public arrondi (publicGeo), et AUCUNE page
 * prérendue (texte, attributs, JSON-LD) ne peut contenir une rue de maison ni ses coordonnées exactes
 * (exactLocationLeaks) — un échec bloque la publication.
 * (13/11/2026, lot « sécurité des adresses ») Plus aucune rue dans le dépôt : les rues à chercher viennent de la même
 * source hors dépôt que `npm run check:locations` (scripts/lib/private-locations.mjs — secret LVC_PRIVATE_LOCATIONS en CI,
 * fichier désigné par LVC_PRIVATE_LOCATIONS_FILE en local). Sans source, la garde le dit et ne contrôle que les
 * coordonnées. Un échec ne cite jamais la rue : seulement la clé du lieu et le fichier (pour le siège social, le
 * libellé « siège social », jamais la clé de son lieu).
 *
 * (Lot 2 « retenue premium », sous-lot A — 11/2026) La FAQ d'une page maison n'affiche plus que ses 5 premières questions,
 * les suivantes sont repliées sous un bouton : checkFaqInHtml vérifie que TOUTES les questions du JSON-LD FAQPage restent
 * dans le texte du HTML prérendu (un repli masque, il ne retire jamais).
 *
 * (L'Appart, brief du 12/11/2026, étape E2g) Par LIEU, plus seulement par maison. Chaque ligne de la vue est classée (scripts/lib/
 * gamme-rules.mjs) : une maison, L'Appart, ou un lieu INCONNU du site (échec : la vue est en avance sur le code). Chaque lieu qui a
 * une page (PLACE_PAGE_KEYS, src/data/places.ts) est contrôlé en deux parties : STATIQUE, même sans ligne dans la vue (fichiers FR
 * et EN, emplacement — placeLocation.ts pour L'Appart —, FAQ, liens contextuels, formats, grammaire « à L'Appart ») ; CHAMBRES,
 * seulement si la vue rend ses lignes (état embarqué, libellé de chaque chambre — la n° 5 de L'Appart s'appelle « Suite » —,
 * bouton de chaque chambre candidate). Un lieu qui a des lignes sans page = échec (la page part avant la bascule). Surfaces :
 * ROOM_SURFACE_BY_HOUSE pour les maisons, APPART.rooms.surface pour L'Appart ; la fourchette de /tarifs reste celle des maisons.
 */

import fs from 'fs/promises';
import path from 'path';
import https from 'https';
import { fileURLToPath, pathToFileURL } from 'url';
import { loadEntityFacts } from './lib/load-entity-facts.mjs';
import { visibleText } from './check-entity-facts.mjs';
import { loadPrivateLocations, buildStreetMatchers, scanStreets, PrivateLocationsError, LOCATIONS_ENV, LOCATIONS_FILE_ENV, LEGAL_PRERENDERED_PAGES, HEAD_OFFICE_KEY } from './lib/private-locations.mjs';
import { classifyViewRows, unknownPlaceMessage, appartSurfaceIssues, isInternalKey, placeKeyLabel } from './lib/gamme-rules.mjs';

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
  const url = `${SUPABASE_URL}/rest/v1/v_public_rooms?select=house_slug,room_number,availability,available_from,rent_chf,surface_m2&order=house_slug,room_number`;
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

// ── (Lot L2 « Emplacement et transport », 09/10/2026) section Localisation × src/data/houseLocation.ts ──────────────

/** Fenêtre (caractères de texte visible après le H1) dans laquelle la ligne de trajet doit apparaître : hero + début de longDescription. */
export const COMMUTE_WINDOW = 1500;

/** Texte visible du <main> (sinon du corps) à partir du H1 — le hero précède la description, d'où la fenêtre de 1 500 caractères. */
export function mainTextAfterH1(html) {
  const main = html.match(/<main\b[\s\S]*?<\/main>/i)?.[0] ?? html.replace(/^[\s\S]*?<\/head>/, '');
  const text = visibleText(main);
  const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
  const h1Text = h1 ? visibleText(h1) : '';
  const i = h1Text ? text.indexOf(h1Text) : -1;
  return i >= 0 ? text.slice(i) : text;
}

/**
 * Section Localisation d'une page maison prérendue (FR ou EN) : (1) houseNeighbourhood(slug, lang) exactement une fois dans
 * le texte visible ; (2) la ligne courte ENTITY_HOUSES[].commute dans les COMMUTE_WINDOW premiers caractères après le H1 ;
 * (3) data-house-location-version="<HOUSE_LOCATION_VERSION>" une fois ; (4) le lien « Calculer mon trajet » / « Check my
 * commute » pointe vers google.com/maps/dir/ depuis le point public de la maison (houseDirectionsUrl), jamais depuis sa rue.
 * `streetMatchers` (facultatif) : détecteurs des rues, bâtis depuis la source hors dépôt — un lien qui en contient une
 * n'est jamais recopié dans un message.
 * (L'Appart, E2g) Page de L'Appart : mêmes règles, sources de src/data/placeLocation.ts (appartLocation.ts) — phrase de quartier,
 * ligne de trajet (le chapeau la porte), version, zone, lien « Calculer mon trajet » depuis son point public (APPART_PLACE : la
 * gare d'Annemasse).
 */
export function checkHouseLocation(html, slug, lang, m, streetMatchers = []) {
  const file = lang === 'fr' ? `${slug}.html` : `en-${slug}.html`;
  const appart = slug === m.APPART_KEY;
  const house = appart ? null : m.ENTITY_HOUSES.find((h) => h.slug === slug);
  if (!appart && !house) return [`${file} : ${slug} absent de ENTITY_HOUSES — nouvelle maison ? → src/data/stats.ts (ROOMS_BY_HOUSE, TRANSIT, ROOM_SURFACE_BY_HOUSE), entityFacts.ts, houseLocation.ts`];
  // Sources de la page : houseLocation.ts pour une maison (messages d'avant L'Appart, inchangés), placeLocation.ts pour L'Appart.
  const src = appart
    ? { neighbourhood: m.placeNeighbourhood(slug, lang), commute: m.placeCommuteLine(slug, lang), version: m.placeLocationVersion(slug), url: m.placeDirectionsUrl(slug, lang), label: m.placeDirectionsLabel(lang), zone: m.placeZone(slug, lang), point: m.publicGeo(m.APPART_PLACE), fn: { nb: 'placeNeighbourhood', url: 'placeDirectionsUrl', zone: 'placeZone' }, lead: 'le chapeau doit la porter en tête', what: "d'un lieu" }
    : { neighbourhood: m.houseNeighbourhood(slug, lang), commute: house.commute[lang], version: m.HOUSE_LOCATION_VERSION, url: m.houseDirectionsUrl(slug, lang), label: m.houseDirectionsLabel(lang), zone: m.houseZone(slug, lang), point: m.publicGeo(m.HOUSES.find((x) => x.slug === slug)), fn: { nb: 'houseNeighbourhood', url: 'houseDirectionsUrl', zone: 'houseZone' }, lead: 'longDescription doit la porter en tête', what: "d'une maison" };
  const failures = [];
  const text = visibleText(html);
  const neighbourhood = src.neighbourhood;
  const n = count(text, neighbourhood);
  if (n !== 1) failures.push(`${file} : phrase de quartier (${src.fn.nb}) présente ${n} fois dans le texte visible (attendu exactement 1) — « ${neighbourhood.slice(0, 60)}… »`);
  const commute = src.commute;
  if (!mainTextAfterH1(html).slice(0, COMMUTE_WINDOW).includes(commute)) failures.push(`${file} : ligne de trajet « ${commute} » absente des ${COMMUTE_WINDOW} premiers caractères après le H1 (${src.lead})`);
  const versionAttr = `data-house-location-version="${src.version}"`;
  const v = count(html, versionAttr);
  if (v !== 1) failures.push(`${file} : ${versionAttr} présent ${v} fois (attendu 1)`);
  const url = src.url;
  const label = src.label;
  const g = src.point;
  const urlHasStreet = scanStreets(url, streetMatchers).length > 0;
  const shownUrl = urlHasStreet ? '(lien non affiché : il contient une rue)' : url;
  if (!url.startsWith('https://www.google.com/maps/dir/') || !url.includes(`origin=${encodeURIComponent(`${g.lat},${g.lng}`)}`)) failures.push(`${file} : ${src.fn.url} ne part pas du point public arrondi (publicGeo) — ${shownUrl}`);
  if (urlHasStreet) failures.push(`${file} : ${src.fn.url} contient la rue ${src.what} — l'itinéraire part du point public (publicGeo)`);
  const zone = src.zone;
  if (!text.includes(zone)) failures.push(`${file} : zone « ${zone} » (${src.fn.zone}) absente du texte visible`);
  if (!html.replace(/&amp;/g, '&').includes(`href="${url}"`)) failures.push(`${file} : lien « ${label} » absent (href attendu : ${shownUrl})`);
  if (!text.includes(label)) failures.push(`${file} : libellé « ${label} » absent du texte visible`);
  return failures;
}

/**
 * (Lot 2 — sous-lot A, 11/2026) FAQ repliée d'une page maison : chaque question du JSON-LD FAQPage (construit depuis la liste
 * complète) doit figurer dans le texte du HTML prérendu — repliée ou non. Pur ; renvoie les échecs.
 */
export function checkFaqInHtml(html, file) {
  const blocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map((x) => { try { return JSON.parse(x[1]); } catch { return null; } })
    .filter(Boolean)
    .flatMap((b) => (Array.isArray(b) ? b : [b]));
  const faq = blocks.find((b) => b['@type'] === 'FAQPage');
  if (!faq || !Array.isArray(faq.mainEntity) || faq.mainEntity.length === 0) return [`${file} : JSON-LD FAQPage absent ou vide`];
  const text = visibleText(html);
  const missing = faq.mainEntity.map((q) => visibleText(String(q.name ?? ''))).filter((name) => !name || !text.includes(name));
  return missing.map((name) => `${file} : question du FAQPage absente du HTML — « ${name.slice(0, 70)} » (un repli masque, il ne retire pas)`);
}

/**
 * (11/11/2026) Accord du nom des maisons en français : « du Loft », « du Lodge », « au Loft », jamais « de Le Loft » ni
 * « à Le Lodge » (les titres « À propos de Le Loft » et « Prêt à faire de Le Lodge ton chez-toi ? » étaient en production).
 * Dans le code : ofHouseFr() de HouseDetailPage.tsx. Pur ; renvoie les échecs.
 * (L'Appart, E2g) Et jamais « au L'Appart », « du L'Appart », « le L'Appart » : « à L'Appart », « de L'Appart ».
 */
export function checkHouseNameGrammar(html, file) {
  const found = [...new Set(visibleText(html).match(/(?:\bde|à) Le (?:Loft|Lodge)\b|\b(?:[Aa]u|[Dd]u|[Ll]e) L['’]Appart\b/g) ?? [])];
  return found.map((f) => (/Appart/.test(f)
    ? `${file} : « ${f} » dans le texte visible — écrire « à L'Appart », « de L'Appart » (le nom garde son article)`
    : `${file} : « ${f} » dans le texte visible — écrire « du Loft », « du Lodge », « au Loft », « au Lodge » (ofHouseFr)`));
}

/**
 * ROOM_SURFACE_BY_HOUSE (src/data/stats.ts) = Math.round(min / max de v_public_rooms.surface_m2) pour chaque maison publique.
 * (L'Appart, E2g) Les lignes de L'Appart se comparent à APPART.rooms.surface (rien tant que la vue ne les rend pas) ; un lieu
 * inconnu reste signalé, jamais sous sa clé interne.
 */
export function checkRoomSurfaceByHouse(byHouse, m) {
  const failures = [];
  const src = m.ROOM_SURFACE_BY_HOUSE;
  for (const [slug, rooms] of byHouse) {
    if (slug === m.APPART_KEY) { failures.push(...appartSurfaceIssues(rooms, m)); continue; }
    const exp = src[slug];
    if (!exp) { failures.push(`${isInternalKey(slug, m) ? placeKeyLabel(slug, m) : slug} : absent de ROOM_SURFACE_BY_HOUSE (src/data/stats.ts) — nouvelle maison ?`); continue; }
    const sizes = rooms.map((r) => Number(r.surface_m2)).filter((n) => Number.isFinite(n) && n > 0);
    if (sizes.length === 0) continue; // surface_m2 absent : la garde /tarifs l'a déjà signalé
    const min = Math.round(Math.min(...sizes)), max = Math.round(Math.max(...sizes));
    if (min !== exp.min || max !== exp.max) failures.push(`${slug} : ROOM_SURFACE_BY_HOUSE = ${exp.min}-${exp.max} m², v_public_rooms = ${min}-${max} m² (Math.round du min/max de surface_m2)`);
  }
  for (const slug of Object.keys(src)) if (!byHouse.has(slug)) failures.push(`${slug} : dans ROOM_SURFACE_BY_HOUSE mais aucune chambre publique en base`);
  return failures;
}

/**
 * Page d'un LIEU (maison ou L'Appart), FR et EN. (L'Appart, E2g) Deux parties : « chambres » (1, 2, 6) seulement si la vue rend des
 * lignes pour ce lieu — L'Appart avant la bascule n'en a pas ; « statique » (3 à 5, 7 à 9) toujours. Pour une maison, qui a
 * toujours ses lignes, rien ne change.
 */
async function checkHouse(slug, rooms, m, streetMatchers = []) {
  const failures = [];
  const candidates = rooms.filter((r) => r.availability === 'available' || !!r.available_from);
  const appart = slug === m.APPART_KEY;
  for (const lang of ['fr', 'en']) {
    const file = lang === 'fr' ? `${slug}.html` : `en-${slug}.html`;
    const prefix = lang === 'fr' ? '' : '/en';
    let html;
    try {
      html = await fs.readFile(path.join(PRERENDERED, file), 'utf-8');
    } catch {
      failures.push(appart
        ? `${file} : page prérendue ABSENTE (L'Appart a sa page dans PLACE_PAGE_KEYS → STATIC_ROUTES de scripts/prerender.mjs, App.tsx, routePreload.ts, LAppartPage.tsx)`
        : `${file} : page prérendue ABSENTE (nouvelle maison ? → STATIC_ROUTES de scripts/prerender.mjs, App.tsx, routePreload.ts, HouseDetailPage.tsx)`);
      continue;
    }
    if (rooms.length > 0) {
      // 1. Embed chambres : toutes les lignes du lieu, sérialisées au prérendu.
      const embed = extractEmbed(html, '__rooms_level_data__');
      const mine = Array.isArray(embed) ? embed.filter((r) => r.house_slug === slug) : [];
      if (mine.length !== rooms.length) failures.push(`${file} : embed __rooms_level_data__ = ${mine.length} chambre(s), base = ${rooms.length}`);
      // 2. Chaque chambre est nommée (roomLabel : « Chambre N » / « Room N », la n° 5 de L'Appart « Suite ») ; chaque chambre
      //    candidate a son CTA à deux paramètres.
      for (const r of rooms) {
        const name = m.roomLabel(slug, Number(r.room_number), lang);
        if (!html.includes(name)) failures.push(`${file} : « ${name} » introuvable`);
      }
      for (const r of candidates) {
        const cta = `href="${prefix}/candidature?property_interest=${slug}&amp;room_interest=chambre-${r.room_number}"`;
        const ctaRaw = cta.replace('&amp;', '&');
        if (!html.includes(cta) && !html.includes(ctaRaw)) failures.push(`${file} : CTA chambre ${r.room_number} (candidate) sans property_interest+room_interest`);
      }
      // 6. Pas de dispo chiffrée en dur : le badge doit venir de l'embed résumé.
      if (!extractEmbed(html, '__room_availability_data__')) failures.push(`${file} : embed __room_availability_data__ absent`);
    }
    // 3. Tous les CTA de candidature de la page portent le lieu (hero, pricing, final, sticky, nav ×2, footer).
    const contextual = count(html, `property_interest=${slug}`);
    if (contextual < 7) failures.push(`${file} : seulement ${contextual} lien(s) property_interest=${slug} (attendu ≥ 7)`);
    const bare = count(html, `href="${prefix}/candidature"`);
    if (bare > 0) failures.push(`${file} : ${bare} lien(s) /candidature NU(S) (sans property_interest)`);
    // 4. Prix : jamais de virgule anglaise en FR, jamais d'espace FR en EN ; jamais de montant périmé.
    if (lang === 'fr' && /\b1,[0-9]{3} CHF/.test(html)) failures.push(`${file} : prix au format anglais (1,430 CHF) sur une page FR`);
    if (/1[  ]380 CHF|1,380 CHF/.test(html)) failures.push(`${file} : montant périmé 1 380 CHF`);
    // 5. Marqueurs d'hydratation posés par scripts/prerender.mjs.
    if (!html.includes('<!--$-->') || !html.includes('<!--/$-->')) failures.push(`${file} : marqueurs Suspense <!--$--> absents (hydratation #418 garantie)`);
    // 7. (Lot L2, 09/10/2026) Section Localisation = source unique houseLocation.ts (L'Appart : placeLocation.ts).
    failures.push(...checkHouseLocation(html, slug, lang, m, streetMatchers));
    // 8. (Lot 2 — sous-lot A, 11/2026) FAQ repliée : toutes les questions du FAQPage restent dans le HTML.
    failures.push(...checkFaqInHtml(html, file));
    // 9. (11/11/2026) Accord du nom des maisons : jamais « de Le Loft » ni « à Le Lodge » sur une page française (ni « au L'Appart »).
    if (lang === 'fr') failures.push(...checkHouseNameGrammar(html, file));
  }
  return failures;
}

/**
 * (Lot 3 SEO funnel, 03/09/2026) /chambres-disponibles FR + EN : l'embed porte les 29 lignes,
 * chaque chambre libre a son CTA à deux paramètres, chaque chambre datée son bouton « Découvrir la maison »
 * (12/10/2026, décision Jérôme : il remplace « Réserver cette date » sur les cartes compactes), chaque maison sa
 * liste d'attente. On candidate pour une chambre datée depuis la page de sa maison (CTA vérifiés plus haut).
 * Pas de contrôle « 0 lien /candidature nu » ici : le chrome (nav, footer) n'est contextuel
 * que sur les pages maisons.
 */
async function checkAvailablePage(byHouse) {
  const failures = [];
  const all = [...byHouse.values()].flat();
  const candidates = all.filter((r) => r.availability === 'available' || !!r.available_from);
  for (const lang of ['fr', 'en']) {
    const file = lang === 'fr' ? 'chambres-disponibles.html' : 'en-chambres-disponibles.html';
    const prefix = lang === 'fr' ? '' : '/en';
    let html;
    try {
      html = await fs.readFile(path.join(PRERENDERED, file), 'utf-8');
    } catch {
      failures.push(`${file} : page prérendue ABSENTE (STATIC_ROUTES_FR de scripts/prerender.mjs, App.tsx, routePreload.ts)`);
      continue;
    }
    const embed = extractEmbed(html, '__rooms_level_data__');
    const n = Array.isArray(embed) ? embed.length : 0;
    if (n !== all.length) failures.push(`${file} : embed __rooms_level_data__ = ${n} chambre(s), base = ${all.length}`);
    for (const r of candidates) {
      const cta = `href="${prefix}/candidature?property_interest=${r.house_slug}&amp;room_interest=chambre-${r.room_number}"`;
      const hasCta = html.includes(cta) || html.includes(cta.replace('&amp;', '&'));
      if (r.availability === 'available' && !hasCta) failures.push(`${file} : CTA ${r.house_slug} chambre ${r.room_number} (libre) absent`);
    }
    // Chambres datées : un bouton « Découvrir la maison » (data-house-cta) vers la page de leur maison, par chambre.
    for (const slug of byHouse.keys()) {
      const dated = candidates.filter((r) => r.house_slug === slug && r.availability !== 'available').length;
      const houseCtas = (html.match(new RegExp(`<a [^>]*href="${prefix}/${slug}"[^>]*data-house-cta|<a [^>]*data-house-cta[^>]*href="${prefix}/${slug}"`, 'g')) || []).length;
      if (houseCtas < dated) failures.push(`${file} : ${houseCtas} bouton(s) « Découvrir la maison » vers ${prefix}/${slug} pour ${dated} chambre(s) datée(s)`);
    }
    for (const slug of byHouse.keys()) {
      const w = `property_interest=${slug}&amp;room_interest=liste-attente`;
      if (!html.includes(w) && !html.includes(w.replace('&amp;', '&'))) failures.push(`${file} : CTA liste d'attente ${slug} absent`);
    }
    if (lang === 'fr' && /\b1,[0-9]{3} CHF/.test(html)) failures.push(`${file} : prix au format anglais (1,430 CHF) sur une page FR`);
    if (/1[  ]380 CHF|1,380 CHF/.test(html)) failures.push(`${file} : montant périmé 1 380 CHF`);
    if (!html.includes('<!--$-->') || !html.includes('<!--/$-->')) failures.push(`${file} : marqueurs Suspense <!--$--> absents (hydratation #418 garantie)`);
    if (!extractEmbed(html, '__room_availability_data__')) failures.push(`${file} : embed __room_availability_data__ absent`);
  }
  return failures;
}

// (Lot 7, 04/09/2026) Décision Jérôme Q1 : la fourchette de surface affichée (STATS.roomSizeMin/Max,
// rendue sur /tarifs FR + EN) doit refléter min/max de v_public_rooms.surface_m2 (15,5 → 16, 24 → 24).
async function checkRoomSizeRange(rooms) {
  const failures = [];
  const sizes = rooms.map((r) => Number(r.surface_m2)).filter((n) => Number.isFinite(n) && n > 0);
  if (sizes.length === 0) { console.log('⚠️  surface_m2 absent de v_public_rooms — garde surface ignorée'); return failures; }
  const min = Math.round(Math.min(...sizes)), max = Math.round(Math.max(...sizes));
  const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'prerendered');
  for (const file of ['tarifs.html', 'en-tarifs.html']) {
    const needle = `${min}-${max} m²`;
    let html;
    try { html = await fs.readFile(path.join(dir, file), 'utf8'); } catch { continue; }
    if (!html.includes(needle)) failures.push(`${file} : « ${needle} » absent — STATS.roomSizeMin/Max ≠ v_public_rooms (min ${min}, max ${max})`);
  }
  console.log(`${failures.length === 0 ? '✅' : '❌'} surface des chambres — ${min}-${max} m² (v_public_rooms) sur /tarifs FR + EN`);
  return failures;
}

/**
 * (12/10/2026, sécurité) Fuites de l'emplacement exact dans une page prérendue : rue d'une maison ou coordonnées exactes
 * (≥ 4 décimales). (13/11/2026) Les rues viennent de `streetMatchers` (source hors dépôt, scripts/lib/private-locations.mjs :
 * casse, accents, encodage d'URL, « + », balises, rue sans son numéro) ; sans détecteur, seules les coordonnées sont
 * contrôlées. `legalPage` : le siège social de la société éditrice (lieu `allowedOnLegalPages`) est toléré sur une page
 * légale, et nulle part ailleurs. Renvoie des LIBELLÉS (clé du lieu, maison), jamais la rue ni la coordonnée ; le siège
 * social est désigné comme tel, jamais par la clé de son lieu (un journal public relierait ce lieu à une adresse publiée). Pur.
 */
export function exactLocationLeaks(html, houses, streetMatchers = [], { legalPage = false } = {}) {
  const leaks = [];
  for (const hit of scanStreets(html, streetMatchers, { html: true })) {
    if (hit.allowedOnLegalPages && legalPage) continue;
    const label = hit.key === HEAD_OFFICE_KEY ? 'siège social hors page légale' : `rue du lieu « ${hit.key} »`;
    if (!leaks.includes(label)) leaks.push(label);
  }
  for (const h of houses) {
    for (const [axis, c] of [['latitude', h.geo.lat], ['longitude', h.geo.lng]]) {
      const s = String(c);
      if (s.split('.')[1]?.length >= 4 && html.includes(s.slice(0, s.indexOf('.') + 5))) leaks.push(`${axis} exacte de ${h.slug}`);
    }
  }
  return leaks;
}

/** Toutes les pages prérendues de `dir` (public/prerendered/ par défaut ; un autre dossier dans les tests). */
export async function checkNoExactLocation(m, streetMatchers = [], dir = PRERENDERED) {
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.html'));
  const failures = [];
  for (const file of files) {
    const leaks = exactLocationLeaks(await fs.readFile(path.join(dir, file), 'utf-8'), m.HOUSES, streetMatchers, { legalPage: LEGAL_PRERENDERED_PAGES.includes(file) });
    if (leaks.length) failures.push(`${file} : emplacement exact publié (${leaks.join(', ')}) — zone et publicGeo seulement (décision du 12/10/2026)`);
  }
  const scope = streetMatchers.length > 0 ? 'rues et coordonnées exactes des maisons absentes' : 'coordonnées exactes des maisons absentes (rues NON contrôlées : aucune source)';
  console.log(`${failures.length === 0 ? '✅' : '❌'} emplacement exact — ${scope} des ${files.length} pages prérendues`);
  return failures;
}

/**
 * (13/11/2026) Détecteurs des rues depuis la source hors dépôt. Sans source : avertissement visible et liste vide (la garde
 * ne contrôle alors que les coordonnées ; `npm run check:locations` porte le contrôle complet). Source invalide : échec.
 * `env` : variables lues (process.env par défaut ; un objet dans les tests).
 */
export async function loadStreetMatchers({ env = process.env } = {}) {
  let source;
  try {
    source = await loadPrivateLocations({ env, root: path.join(__dirname, '..') });
  } catch (e) {
    if (e instanceof PrivateLocationsError) { console.error(`\n❌ ${e.message}`); process.exit(1); }
    throw e;
  }
  if (!source.places) {
    console.log(`⚠️  Rues des maisons NON contrôlées par cette garde : aucune source (${LOCATIONS_ENV} vide, ${LOCATIONS_FILE_ENV} absent). Coordonnées exactes contrôlées.`);
    return [];
  }
  return buildStreetMatchers(source.places);
}

/**
 * Message final d'un passage réussi. Sans source des rues, il redit que les rues n'ont pas été contrôlées :
 * l'avertissement du début défile hors de l'écran, ce message-ci est le dernier lu. Pur.
 */
export function successMessage(streetsChecked) {
  return `Pages maisons cohérentes avec la base et la source d'emplacement (FR + EN)${streetsChecked ? '' : ' — rues des maisons NON contrôlées : aucune source'}.`;
}

async function main() {
  console.log('\n🏠 Garde pages des lieux (maisons, L\'Appart) — v_public_rooms × public/prerendered/ × houseLocation.ts / appartLocation.ts\n');
  const [byHouse, m, streetMatchers] = await Promise.all([fetchRooms(), loadEntityFacts(), loadStreetMatchers()]);
  let total = 0;
  // (L'Appart, E2g) Chaque ligne de la vue : une maison, L'Appart, ou un lieu inconnu du site (la vue en avance sur le code).
  const { byPlace, unknown } = classifyViewRows([...byHouse.values()].flat(), m);
  for (const u of unknown) { total++; console.log(`❌ ${unknownPlaceMessage(u)}`); }
  const surfaceFailures = checkRoomSurfaceByHouse(byHouse, m);
  total += surfaceFailures.length;
  console.log(`${surfaceFailures.length === 0 ? '✅' : '❌'} ROOM_SURFACE_BY_HOUSE (stats.ts) = v_public_rooms par maison ; APPART.rooms.surface pour L'Appart`);
  for (const f of surfaceFailures) console.log(`   • ${f}`);
  // Chaque lieu qui a une page (PLACE_PAGE_KEYS) : partie statique toujours, partie « chambres » s'il a des lignes. Un lieu qui a
  // des lignes sans page = échec ; sans ligne ni page (L'Appart avant l'étape E3) = rien à contrôler.
  for (const slug of m.PLACE_KEYS) {
    const rooms = byPlace.get(slug) ?? [];
    if (!m.PLACE_PAGE_KEYS.includes(slug)) {
      if (rooms.length) { total++; console.log(`❌ ${slug} — ${rooms.length} chambre(s) dans v_public_rooms, mais pas de page pour ce lieu (PLACE_PAGE_KEYS, src/data/places.ts) : la page part en ligne AVANT la bascule`); }
      else console.log(`ℹ️  ${slug} — absent de v_public_rooms et pas encore de page (PLACE_PAGE_KEYS) : rien à contrôler`);
      continue;
    }
    const failures = await checkHouse(slug, rooms, m, streetMatchers);
    total += failures.length;
    const candidates = rooms.filter((r) => r.availability === 'available' || !!r.available_from).length;
    console.log(`${failures.length === 0 ? '✅' : '❌'} ${slug} — ${rooms.length} chambres, ${candidates} candidate(s)${rooms.length ? '' : ' (absent de v_public_rooms : partie « chambres » sautée, partie statique contrôlée)'}`);
    for (const f of failures) console.log(`   • ${f}`);
  }
  const pageFailures = await checkAvailablePage(byPlace);
  total += pageFailures.length;
  console.log(`${pageFailures.length === 0 ? '✅' : '❌'} /chambres-disponibles — FR + EN`);
  for (const f of pageFailures) console.log(`   • ${f}`);
  // La fourchette de surfaces de /tarifs (STATS.roomSizeMin/Max) est celle des MAISONS : L'Appart n'y entre pas.
  const sizeFailures = await checkRoomSizeRange((m.MAISON_KEYS ?? []).flatMap((k) => byPlace.get(k) ?? []));
  total += sizeFailures.length;
  for (const f of sizeFailures) console.log(`   • ${f}`);
  const leakFailures = await checkNoExactLocation(m, streetMatchers);
  total += leakFailures.length;
  for (const f of leakFailures) console.log(`   • ${f}`);
  if (total > 0) {
    console.error(`\n❌ ${total} problème(s) — pages maisons NON publiables.`);
    process.exit(1);
  }
  console.log(`\n🎉 ${successMessage(streetMatchers.length > 0)}\n`);
}

// Importable par les tests (fonctions pures ci-dessus) : main() ne tourne qu'en exécution directe.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => { console.error('Fatal:', err.message); process.exit(1); });
}
