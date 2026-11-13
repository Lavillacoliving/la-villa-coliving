// Briques de L'Appart rendues (étape E2) : <AppartFacts/>, <AppartIncluded/>, <AppartTeaser/>, <HouseCommuteTable slug="lappart"/>
// et <RoomCard/> sur les 4 chambres de L'Appart telles que la vue les rendra après la bascule (relevé « état B »). Aucune page ne
// les montre encore : ce rendu (react-dom/server, comme un premier rendu) prouve leurs textes au caractère près, avant l'étape E3.
// Contrôles : chaque phrase canonique de la fiche une seule fois ; aucun équipement des maisons hors des exceptions ; aucune clé
// interne ; une carte de maison inchangée (ni légende, ni badge, ni capacité).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
import { loadEntityFacts } from '../../scripts/lib/load-entity-facts.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const m = await loadEntityFacts();
const ROWS_B = JSON.parse(readFileSync(path.join(ROOT, 'tools/test/fixtures/v_public_rooms.etat-B.json'), 'utf8'));
const rows = Array.isArray(ROWS_B) ? ROWS_B : ROWS_B.rows ?? ROWS_B.lignes;
const appartRows = rows.filter((r) => r.house_slug === 'lappart').sort((a, b) => a.room_number - b.room_number);
const houseRow = rows.find((r) => r.house_slug === 'lelodge');
const HOUSE_AMENITY = /piscine|sauna|salle de sport|\bpools?\b|\bgym\b/i;

/** Texte visible d'un fragment HTML, comme le lisent les gardes (balises → espace, entités décodées, espaces repliés). */
const text = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, '\u00a0').replace(/[ \t\r\n]+/g, ' ').trim();
const count = (hay, needle) => hay.split(needle).length - 1;

// Les composants, regroupés en un module CommonJS dans un dossier temporaire (React et ses dépendances compris).
const dir = mkdtempSync(path.join(tmpdir(), 'lvc-appart-'));
const entry = `
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AppartFacts } from "@/components/appart/AppartFacts";
import { AppartIncluded } from "@/components/appart/AppartIncluded";
import { AppartTeaser } from "@/components/appart/AppartTeaser";
import { HouseCommuteTable } from "@/components/HouseCommuteTable";
import { appartCommuteTable } from "@/data/appartLocation";
import { RoomCard } from "@/components/RoomCard";
const wrap = (lang, node) => renderToStaticMarkup(<MemoryRouter initialEntries={[lang === "en" ? "/en/essai" : "/essai"]}><LanguageProvider>{node}</LanguageProvider></MemoryRouter>);
export const facts = (lang) => wrap(lang, <AppartFacts />);
export const included = (lang) => wrap(lang, <AppartIncluded />);
export const teaser = (lang, page) => wrap(lang, <AppartTeaser page={page} />);
export const commute = (lang, slug) => wrap(lang, slug === "lappart" ? <HouseCommuteTable slug="lappart" content={appartCommuteTable} /> : <HouseCommuteTable slug={slug} />);
export const card = (lang, house, room, props = {}) => wrap(lang, <RoomCard house={house} houseName={props.houseName ?? house} room={room} fallbackImage="/images/essai.webp" {...props} />);
`;
const out = path.join(dir, 'briques.cjs');
await build({
  stdin: { contents: entry, resolveDir: ROOT, loader: 'tsx' },
  bundle: true, outfile: out, format: 'cjs', platform: 'node', target: 'node20', jsx: 'automatic',
  alias: { '@': path.join(ROOT, 'src') }, logLevel: 'silent',
  define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env': '{"DEV":false,"PROD":true,"MODE":"production"}' },
});
const B = createRequire(import.meta.url)(out);
rmSync(dir, { recursive: true, force: true });

test('<AppartFacts/> : id, version, chaque chaîne canonique une fois, bouton vers la candidature de L\'Appart, aucune preuve des maisons', () => {
  for (const lang of ['fr', 'en']) {
    const html = B.facts(lang), t = text(html);
    assert.match(html, /<aside id="appart-facts" data-appart-facts-version="\d{4}-\d{2}-\d{2}[a-z]?"/);
    for (const s of m.appartFactsStrings(lang)) assert.equal(count(t, s), 1, `${lang} : « ${s.slice(0, 50)}… »`);
    const href = /href="([^"]*candidature[^"]*)"/.exec(html)?.[1].replace(/&amp;/g, '&');
    assert.equal(href, `${lang === 'en' ? '/en' : ''}/candidature?property_interest=lappart&src=entity_facts&article=lappart&pos=appart_facts`);
    assert.doesNotMatch(t, HOUSE_AMENITY);
    assert.doesNotMatch(t, /Google|100\+/);
  }
});

test('<AppartIncluded/> : 15 lignes, la ligne « piscine » au caractère près avec son lien vers /nos-maisons', () => {
  for (const lang of ['fr', 'en']) {
    const html = B.included(lang);
    const trs = [...html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)].map((x) => x[1]);
    assert.equal(trs.length, 16, 'en-tête + 15 lignes');
    const t = m.appartIncluded(lang);
    t.rows.forEach((r, i) => {
      const cells = [...trs[i + 1].matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/g)].map((x) => text(x[1]));
      assert.deepEqual(cells, [r.item, r.status, r.detail], `${lang} ligne ${i + 1}`);
    });
    assert.ok(html.includes(`href="${lang === 'en' ? '/en' : ''}/nos-maisons"`), `${lang} : lien vers les maisons`);
    // Équipements des maisons : seulement dans les exceptions.
    const exempt = m.appartGammeExemptStrings(lang);
    for (const tr of trs) { const row = text(tr); if (HOUSE_AMENITY.test(row)) assert.ok(exempt.some((e) => row.includes(e)), row); }
  }
});

test('<AppartTeaser/> : un bloc par page, son texte, un lien vers /lappart, la photo du haut avec son texte alternatif (sauf l\'accueil)', () => {
  for (const lang of ['fr', 'en']) for (const page of m.APPART_TEASER_ROUTES) {
    const html = B.teaser(lang, page), t = text(html), src = m.appartTeaser(page, lang);
    assert.ok(html.includes(`data-appart-teaser="${page}"`), page);
    for (const s of [src.title, src.text, src.link, ...(src.eyebrow ? [src.eyebrow] : [])]) assert.equal(count(t, s), 1, `${lang} ${page} : « ${s.slice(0, 40)}… »`);
    assert.ok(html.includes(`href="${lang === 'en' ? '/en' : ''}/lappart"`), `${lang} ${page} : lien`);
    if (page === '/') {
      // Accueil : « une bande courte […], pas d'image » (source des textes, SURFACES S9.3 ; réunion des étapes du 13/11/2026).
      assert.ok(!html.includes('<img'), `${lang} ${page} : aucune image`);
    } else {
      assert.ok(html.includes(m.LAPPART_HERO.wide.src) && html.includes('loading="lazy"') && html.includes(m.LAPPART_HERO.wide.alt[lang].replace(/'/g, '&#x27;')), `${lang} ${page} : image`);
      assert.ok(html.includes('srcSet=') || html.includes('srcset='), `${lang} ${page} : variantes responsive`);
    }
  }
});

test('<HouseCommuteTable slug="lappart"/> : 8 lignes en minutes, note du 12 novembre, lien depuis la gare et la phrase qui le dit', () => {
  for (const lang of ['fr', 'en']) {
    const html = B.commute(lang, 'lappart'), t = text(html);
    assert.ok(html.includes('data-house-commute-table="lappart"'));
    assert.equal([...html.matchAll(/<tr class="align-top">/g)].length, 8);
    for (const r of m.appartCommuteRows(lang)) assert.ok(t.includes(`${r.mode} ${r.destination} ${r.value}`), r.destination);
    assert.ok(t.includes(m.appartCommuteNote(lang)) && t.includes(m.appartDirectionsStart(lang)));
    assert.ok(html.includes(m.appartDirectionsUrl(lang).replace(/&/g, '&amp;')));
    assert.match(t, lang === 'en' ? /Commute from L'Appart/ : /Trajets depuis L'Appart/);
    assert.doesNotMatch(t, /\b\d+(?:[.,]\d+)?\s?k?m(?![²\w])/, 'aucune distance');
    // Une maison : pas de phrase « le calcul part de… ».
    assert.ok(!B.commute(lang, 'lelodge').includes('data-directions-start'));
  }
});

test('<RoomCard/> sur les 4 chambres de L\'Appart (état B) : libellé, specs, prix, capacité, photo commune et sa légende, bouton du lieu', () => {
  assert.equal(appartRows.length, 4);
  for (const lang of ['fr', 'en']) for (const variant of ['default', 'featured', 'compact']) for (const room of appartRows) {
    const suite = room.room_number === 5;
    const html = B.card(lang, 'lappart', room, { houseName: "L'Appart", variant, commune: 'Annemasse', houseCta: variant !== 'default' });
    const t = text(html);
    const label = m.roomLabel('lappart', room.room_number, lang);
    assert.ok(t.includes(label), `${lang} ${variant} ${label}`);
    assert.ok(t.includes(lang === 'en'
      ? (suite ? '22 m² · 5th floor · private bathroom' : '12 m² · 5th floor · shared shower room')
      : (suite ? '22 m² · Étage 5 · SDB privative' : "12 m² · Étage 5 · salle d'eau partagée")), `${lang} ${variant} specs`);
    const price = lang === 'en' ? (suite ? 'CHF 990 (€1,060) /month' : 'CHF 730 (€790) /month') : (suite ? '990 CHF (1\u00a0060 €) /mois' : '730 CHF (790 €) /mois');
    assert.ok(t.includes(price), `${lang} ${variant} prix : ${t}`);
    assert.equal(t.includes(lang === 'en' ? '1 or 2 people' : '1 ou 2 personnes'), suite, `${lang} ${variant} capacité`);
    assert.equal(t.includes(lang === 'en' ? 'Balcony · Private entrance' : 'Balcon · Entrée privée'), suite, `${lang} ${variant} équipements`);
    assert.ok(t.includes(lang === 'en' ? 'Room photo coming soon' : 'Photo de la chambre à venir'), `${lang} ${variant} légende`);
    assert.ok(html.includes(`src="${m.LAPPART_ROOM_COVER.src}"`) && html.includes(`alt="${m.LAPPART_ROOM_COVER.alt[lang].replace(/'/g, '&#x27;')}"`), `${lang} ${variant} photo et texte alternatif`);
    assert.ok(!html.includes(`alt="${label} — L&#x27;Appart"`), `${lang} ${variant} : jamais « ${label} — L'Appart » sur une photo de cuisine`);
    if (variant !== 'default') {
      assert.ok(t.includes("L'Appart · Annemasse"), `${lang} ${variant} sur-titre`);
      assert.ok(t.includes(lang === 'en' ? "Discover L'Appart" : "Découvrir L'Appart"), `${lang} ${variant} bouton du lieu`);
      assert.ok(html.includes(`href="${lang === 'en' ? '/en' : ''}/lappart"`));
    }
    // La carte « compact » avec le bouton du lieu remplace « Réserver cette date » par « Découvrir L'Appart » (comme les maisons).
    if (variant !== 'compact') assert.ok(html.replace(/&amp;/g, '&').includes(`property_interest=lappart&room_interest=chambre-${room.room_number}`), `${lang} ${variant} candidature`);
    assert.doesNotMatch(t, HOUSE_AMENITY, `${lang} ${variant} : aucun équipement des maisons sur une carte de L'Appart`);
    assert.ok(!html.includes('data-gamme-badge'), 'badge seulement sur demande');
  }
  // Badge de gamme sur demande (listes mixtes).
  assert.ok(text(B.card('fr', 'lappart', appartRows[0], { showGammeBadge: true })).includes("L'Appart · colocation"));
  assert.ok(text(B.card('en', 'lappart', appartRows[0], { showGammeBadge: true })).includes("L'Appart · flatshare"));
});

test('<RoomCard/> d\'une maison : ni légende, ni capacité, ni badge (même avec showGammeBadge), libellé et bouton d\'aujourd\'hui', () => {
  for (const lang of ['fr', 'en']) {
    const html = B.card(lang, 'lelodge', houseRow, { houseName: 'Le Lodge', variant: 'featured', houseCta: true, showGammeBadge: true });
    const t = text(html);
    assert.ok(!html.includes('data-photo-pending') && !html.includes('data-gamme-badge'));
    assert.ok(!/1 (?:ou|or) 2/.test(t));
    assert.ok(t.includes(lang === 'en' ? 'Discover the house' : 'Découvrir la maison'));
    assert.ok(t.includes(lang === 'en' ? `Room ${houseRow.room_number}` : `Chambre ${houseRow.room_number}`));
  }
});

test('aucune clé interne dans le HTML des briques', () => {
  const html = ['fr', 'en'].flatMap((lang) => [B.facts(lang), B.included(lang), B.commute(lang, 'lappart'),
    ...m.APPART_TEASER_ROUTES.map((p) => B.teaser(lang, p)), ...appartRows.map((r) => B.card(lang, 'lappart', r, { variant: 'featured', houseCta: true }))]).join('\n').toLowerCase();
  for (const k of m.INTERNAL_ONLY_KEYS) assert.ok(!html.includes(k.toLowerCase()), 'clé interne dans le HTML');
});
