// L'Appart dans les pages de listes (étape E4) : /chambres-disponibles, /colocation-geneve, /chambre-a-louer-geneve,
// /chambre-a-louer-annemasse — et /offre-hiver, qui ne doit pas changer. Les pages sont rendues par react-dom/server (comme un
// premier rendu), l'état embarqué des chambres pris dans les relevés de la vue : « état A » (29 lignes, sans L'Appart) et
// « état B » (les mêmes + les 4 chambres de L'Appart, datées du 01/02/2027). La chaîne réelle (prérendu, gardes, hydratation)
// tourne au banc d'essai ; ce test fige ce que chaque état doit montrer, sans base ni navigateur.
// Contrôles : section L'Appart à part (repli en A, cartes en B), compteurs du haut de page inchangés (maisons), aucune
// carte de L'Appart qui nomme piscine, sauna ou salle de sport, JSON-LD (offres PreOrder datées), garde de gamme du prérendu.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
import { loadEntityFacts } from '../../scripts/lib/load-entity-facts.mjs';
import { gammeMixIssues } from '../../scripts/check-entity-facts.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const m = await loadEntityFacts();
const fixture = (s) => { const j = JSON.parse(readFileSync(path.join(ROOT, `tools/test/fixtures/v_public_rooms.etat-${s}.json`), 'utf8')); return Array.isArray(j) ? j : j.rows; };
const ROWS = { A: fixture('A'), B: fixture('B') };
const KEY = m.APPART_KEY;
const HOUSE_AMENITY = /piscine|sauna|salle de sport|\bpools?\b|\bgym\b/i;
const LANGS = ['fr', 'en'];
const PAGES = ['/chambres-disponibles', '/colocation-geneve', '/chambre-a-louer-geneve', '/chambre-a-louer-annemasse'];

/** Texte visible d'un fragment : balises de bloc → espace, liens et balises en ligne retirés sans espace (« à <a>L'Appart</a>, »). */
const text = (html) => html
  .replace(/<\/?(?:a|span|strong|em|b)\b[^>]*>/g, '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
  .replace(/[ \t\r\n]+/g, ' ').trim();
const count = (hay, needle) => hay.split(needle).length - 1;
const prefixOf = (lang) => (lang === 'en' ? '/en' : '');

// Les pages, regroupées en un module CommonJS dans un dossier temporaire (React et ses dépendances compris). Chargé une fois par
// état : le magasin des chambres lit l'état embarqué au premier rendu et le garde pour la durée du module.
const dir = mkdtempSync(path.join(tmpdir(), 'lvc-appart-listes-'));
const entry = `
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ChambresDisponiblesPage } from "@/pages/ChambresDisponiblesPage";
import { ColocationGenevePage } from "@/pages/ColocationGenevePage";
import { ChambreLouerGenevePage } from "@/pages/ChambreLouerGenevePage";
import { ChambreLouerAnnemassePage } from "@/pages/ChambreLouerAnnemassePage";
import { OfferHiverPage } from "@/pages/OfferHiverPage";
const PAGES = {
  "/chambres-disponibles": ChambresDisponiblesPage,
  "/colocation-geneve": ColocationGenevePage,
  "/chambre-a-louer-geneve": ChambreLouerGenevePage,
  "/chambre-a-louer-annemasse": ChambreLouerAnnemassePage,
  "/offre-hiver": OfferHiverPage,
};
export function render(route, lang) {
  const Page = PAGES[route];
  const html = renderToStaticMarkup(<MemoryRouter initialEntries={[lang === "en" ? "/en" + route : route]}><LanguageProvider><Page /></LanguageProvider></MemoryRouter>);
  const head = Helmet.renderStatic();
  return { html, title: head.title.toString(), meta: head.meta.toString(), scripts: head.script.toString() };
}
`;
const out = path.join(dir, 'pages.cjs');
await build({
  stdin: { contents: entry, resolveDir: ROOT, loader: 'tsx' },
  bundle: true, outfile: out, format: 'cjs', platform: 'node', target: 'node20', jsx: 'automatic',
  alias: { '@': path.join(ROOT, 'src') }, logLevel: 'silent', loader: { '.css': 'empty', '.svg': 'dataurl', '.png': 'dataurl', '.jpg': 'dataurl', '.webp': 'dataurl' },
  define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env': '{"DEV":false,"PROD":true,"MODE":"production"}' },
});
const require = createRequire(import.meta.url);

/** Rendus d'un état : le module est rechargé (magasin neuf), l'état embarqué = les lignes du relevé, comme dans le HTML prérendu. */
function renderState(state) {
  delete require.cache[require.resolve(out)]; // clé = chemin réel (le dossier temporaire de macOS est un lien symbolique)
  globalThis.window = { __PRERENDER_STATE__: { __rooms_level_data__: JSON.stringify(ROWS[state]) } };
  try {
    const P = require(out);
    const res = {};
    for (const route of [...PAGES, '/offre-hiver']) for (const lang of LANGS) res[`${lang}:${route}`] = P.render(route, lang);
    return res;
  } finally {
    delete globalThis.window;
  }
}
const R = { A: renderState('A'), B: renderState('B') };
rmSync(dir, { recursive: true, force: true });

/** La section L'Appart d'une page rendue, de sa balise d'ouverture à sa balise de fin (aucune section imbriquée dedans) : son
 *  titre, son chapeau ou son repli, ses cartes et ses liens. */
const appartSection = (html) => {
  const i = html.indexOf('data-appart-rooms=');
  if (i === -1) return '';
  const start = html.lastIndexOf('<section', i);
  return html.slice(start, html.indexOf('</section>', i) + '</section>'.length);
};
const appartRowsB = ROWS.B.filter((r) => r.house_slug === KEY).sort((a, b) => a.room_number - b.room_number);
const itemList = (scripts) => [...scripts.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  .map((x) => JSON.parse(x[1])).find((j) => j['@type'] === 'ItemList');

test('relevés : l\'état B = l\'état A + les 4 chambres de L\'Appart, datées (la page n\'a rien d\'autre à attendre de la vue)', () => {
  const maisons = (rows) => JSON.stringify(rows.filter((r) => r.house_slug !== KEY));
  assert.equal(maisons(ROWS.A), maisons(ROWS.B));
  assert.equal(ROWS.A.filter((r) => r.house_slug === KEY).length, 0);
  assert.deepEqual(appartRowsB.map((r) => r.room_number), [...m.APPART.rooms.numbers]);
  for (const r of appartRowsB) assert.ok(r.availability !== 'available' && r.available_from === m.APPART.opensOn, `chambre ${r.room_number}`);
});

test('état A : le repli remplace les cartes sur les 3 listes de la marque ; rien sur Annemasse, qui porte le bloc statique', () => {
  for (const lang of LANGS) {
    const t = m.appartListText(lang);
    for (const route of PAGES) {
      const { html } = R.A[`${lang}:${route}`];
      assert.equal(count(html, 'data-appart-rooms="chambres"'), 0, `${lang} ${route}`);
      assert.equal(count(html, 'data-gamme-badge'), 0, `${lang} ${route} : aucune carte de L'Appart`);
      assert.equal(count(html, `property_interest=${KEY}`), 0, `${lang} ${route} : aucun lien de candidature de L'Appart`);
      if (route === '/chambre-a-louer-annemasse') {
        assert.equal(count(html, 'data-appart-rooms='), 0, `${lang} : pas de repli à Annemasse`);
        continue;
      }
      assert.equal(count(html, 'data-appart-rooms="repli"'), 1, `${lang} ${route}`);
      const sec = appartSection(html), st = text(sec);
      assert.ok(st.includes(t.title), `${lang} ${route} : titre`);
      assert.ok(st.includes(t.fallbackText), `${lang} ${route} : phrase de repli`);
      assert.ok(sec.includes(`href="${prefixOf(lang)}/${KEY}"`) && st.includes(t.fallbackLink), `${lang} ${route} : lien de repli vers /${KEY}`);
      assert.ok(!st.includes(t.lead), `${lang} ${route} : le chapeau de la section est celui de l'état B`);
    }
  }
});

test('état B : /chambres-disponibles — 4 cartes compactes de L\'Appart, « Découvrir L\'Appart » par chambre datée, sa liste d\'attente', () => {
  for (const lang of LANGS) {
    const { html } = R.B[`${lang}:/chambres-disponibles`];
    const sec = appartSection(html), st = text(sec);
    assert.equal(count(html, 'data-appart-rooms="chambres"'), 1, lang);
    assert.ok(st.includes(m.appartListText(lang).title) && st.includes(m.appartListText(lang).lead), `${lang} : titre et chapeau`);
    assert.equal(count(sec, '<article'), m.APPART.rooms.total, `${lang} : une carte par chambre`);
    assert.equal(count(sec, 'data-gamme-badge'), m.APPART.rooms.total, `${lang} : badge de gamme`);
    const badges = [...sec.matchAll(/<p data-gamme-badge[^>]*>([^<]*)<\/p>/g)].map((x) => text(x[1]));
    assert.deepEqual(badges, Array(m.APPART.rooms.total).fill(m.placeGammeBadge(KEY, lang)), `${lang} : texte du badge`);
    for (const r of appartRowsB) assert.ok(st.includes(m.roomLabel(KEY, r.room_number, lang)), `${lang} : ${m.roomLabel(KEY, r.room_number, lang)}`);
    const discover = sec.match(new RegExp(`<a [^>]*href="${prefixOf(lang)}/${KEY}"[^>]*data-house-cta|<a [^>]*data-house-cta[^>]*href="${prefixOf(lang)}/${KEY}"`, 'g')) ?? [];
    assert.equal(discover.length, m.APPART.rooms.total, `${lang} : un bouton « ${m.placeDiscoverLabel(KEY, lang)} » par chambre datée`);
    assert.equal(count(html, `property_interest=${KEY}&amp;room_interest=liste-attente`), 1, `${lang} : liste d'attente de L'Appart`);
    // Hors des cartes : le nom lié du chapeau (E4) et le lien « Voir L'Appart » sous la FAQ A.3, rendue sur cette page
    // (priceJustificationFaq().more, étape E5).
    assert.equal(m.priceJustificationFaq(lang).more?.href, `/${KEY}`, `${lang} : lien de suite de la FAQ A.3`);
    assert.equal(count(html, `href="${prefixOf(lang)}/${KEY}"`), m.APPART.rooms.total + 2, `${lang} : cartes + nom lié du chapeau + lien de la FAQ A.3, rien d'autre vers /${KEY}`);
  }
});

test('état B : pages Genève — 4 cartes standard de L\'Appart (candidature par chambre), badge, « Découvrir L\'Appart », liste d\'attente', () => {
  for (const route of ['/colocation-geneve', '/chambre-a-louer-geneve']) {
    for (const lang of LANGS) {
      const { html } = R.B[`${lang}:${route}`];
      const sec = appartSection(html), st = text(sec);
      assert.equal(count(html, 'data-appart-rooms="chambres"'), 1, `${lang} ${route}`);
      assert.equal(count(sec, 'data-gamme-badge'), m.APPART.rooms.total, `${lang} ${route} : badges`);
      for (const r of appartRowsB) {
        assert.equal(count(sec, `href="${prefixOf(lang)}/candidature?property_interest=${KEY}&amp;room_interest=chambre-${r.room_number}"`), 1, `${lang} ${route} : candidature chambre ${r.room_number}`);
      }
      assert.ok(st.includes(m.placeDiscoverLabel(KEY, lang)) && sec.includes(`href="${prefixOf(lang)}/${KEY}"`), `${lang} ${route} : « ${m.placeDiscoverLabel(KEY, lang)} »`);
      assert.equal(count(sec, `property_interest=${KEY}&amp;room_interest=liste-attente`), 1, `${lang} ${route} : liste d'attente`);
    }
  }
});

test('état B : /chambre-a-louer-annemasse — L\'Appart avant le Lodge, bloc statique et cartes ; état embarqué = Lodge + L\'Appart', () => {
  for (const lang of LANGS) {
    for (const state of ['A', 'B']) {
      const { html } = R[state][`${lang}:/chambre-a-louer-annemasse`];
      assert.equal(count(html, `data-appart-teaser="/chambre-a-louer-annemasse"`), 1, `${lang} ${state} : bloc statique`);
      const z = m.appartTeaser('/chambre-a-louer-annemasse', lang);
      const teaser = text(html.slice(html.indexOf('data-appart-teaser='), html.indexOf('</section>', html.indexOf('data-appart-teaser='))));
      for (const s of [z.title, z.text, z.link]) assert.ok(teaser.includes(s), `${lang} ${state} : « ${s.slice(0, 40)}… »`);
      const embed = JSON.parse(/<script type="application\/json" id="__rooms_level_data__">([\s\S]*?)<\/script>/.exec(html)[1]);
      const want = ROWS[state].filter((r) => r.house_slug === 'lelodge' || r.house_slug === KEY);
      assert.equal(embed.length, want.length, `${lang} ${state} : lignes embarquées`);
    }
    const { html } = R.B[`${lang}:/chambre-a-louer-annemasse`];
    const sec = appartSection(html);
    assert.equal(count(sec, 'data-gamme-badge'), m.APPART.rooms.total, `${lang} : cartes de L'Appart`);
    const lodgeTitle = lang === 'en' ? 'at the Lodge' : 'au Lodge';
    assert.ok(html.indexOf('data-appart-rooms=') < html.indexOf(lodgeTitle, html.indexOf('</h1>')), `${lang} : L'Appart avant l'inventaire du Lodge`);
    assert.equal(count(sec, `property_interest=${KEY}&amp;room_interest=liste-attente`), 1, `${lang} : liste d'attente de L'Appart`);
  }
});

test('état B : aucune carte de L\'Appart ne nomme piscine, sauna ou salle de sport ; jamais le lien « ce que comprend le prix »', () => {
  for (const route of PAGES) {
    for (const lang of LANGS) {
      const sec = appartSection(R.B[`${lang}:${route}`].html);
      const t = m.appartListText(lang);
      // Le chapeau de la section NIE ces équipements (« pas de piscine… ») et ne porte aucun prix : tout le reste — cartes et
      // liens — ne les nomme jamais.
      const rest = text(sec).replace(t.lead, '');
      assert.ok(text(sec).includes(t.lead), `${lang} ${route} : chapeau`);
      assert.doesNotMatch(rest, HOUSE_AMENITY, `${lang} ${route}`);
      const lines = [...sec.matchAll(/data-all-inclusive="([a-z]+)"[^>]*>([^<]*)</g)];
      assert.equal(lines.length, m.APPART.rooms.total, `${lang} ${route} : une ligne « tout compris » par carte`);
      for (const [, gamme, line] of lines) {
        assert.equal(gamme, 'appart', `${lang} ${route}`);
        assert.doesNotMatch(line, HOUSE_AMENITY, `${lang} ${route}`);
      }
      assert.equal(count(sec, 'data-price-why'), 0, `${lang} ${route}`);
    }
  }
});

test('compteurs du haut de page et inventaire des maisons : identiques en A et en B (les 4 chambres de février ne les touchent pas)', () => {
  for (const lang of LANGS) {
    // /chambres-disponibles : tout ce qui précède la section L'Appart (haut de page, filtres, « Libre maintenant »,
    // « Bientôt disponibles ») ne bouge pas.
    const cut = (html) => html.slice(html.indexOf('<main'), html.lastIndexOf('<div', html.indexOf('data-appart-rooms=')));
    assert.equal(cut(R.A[`${lang}:/chambres-disponibles`].html), cut(R.B[`${lang}:/chambres-disponibles`].html), lang);
    // Pages Genève : le titre « N chambres… » de la section des chambres et ses lignes de disponibilité.
    for (const route of ['/colocation-geneve', '/chambre-a-louer-geneve']) {
      const h2 = (html) => /<section id="chambres"[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>/.exec(html)[1];
      assert.equal(h2(R.A[`${lang}:${route}`].html), h2(R.B[`${lang}:${route}`].html), `${lang} ${route}`);
    }
  }
});

test('/offre-hiver : aucune carte ni lien de L\'Appart, en A comme en B (useAllRooms = les maisons)', () => {
  for (const lang of LANGS) {
    for (const state of ['A', 'B']) {
      const { html } = R[state][`${lang}:/offre-hiver`];
      assert.equal(count(html, `property_interest=${KEY}`), 0, `${lang} ${state}`);
      assert.equal(count(html, 'data-gamme-badge'), 0, `${lang} ${state}`);
    }
    // Même rendu dans les deux états, à l'état embarqué près : <RoomsEmbed /> (sans prop) porte toutes les lignes connues, celles
    // de L'Appart comprises en B (aucun texte visible) ; la page n'en montre aucune (useAllRooms = les maisons).
    const embedRe = /<script type="application\/json" id="__rooms_level_data__">([\s\S]*?)<\/script>/;
    const strip = (html) => html.replace(embedRe, '');
    assert.equal(strip(R.A[`${lang}:/offre-hiver`].html), strip(R.B[`${lang}:/offre-hiver`].html), `${lang} : même rendu dans les deux états`);
    assert.equal(JSON.parse(embedRe.exec(R.B[`${lang}:/offre-hiver`].html)[1]).length, ROWS.B.length, `${lang} : état embarqué = toutes les lignes`);
  }
});

test('JSON-LD de /chambres-disponibles : en B, les offres de L\'Appart après celles des maisons, PreOrder datées, CHF et EUR', () => {
  for (const lang of LANGS) {
    const a = itemList(R.A[`${lang}:/chambres-disponibles`].scripts);
    const b = itemList(R.B[`${lang}:/chambres-disponibles`].scripts);
    assert.ok(a && b, lang);
    assert.equal(b.numberOfItems, a.numberOfItems + m.APPART.rooms.total, lang);
    assert.deepEqual(b.itemListElement.slice(0, a.numberOfItems).map((x) => x.item), a.itemListElement.map((x) => x.item), `${lang} : offres des maisons inchangées`);
    const offers = b.itemListElement.slice(a.numberOfItems).map((x) => x.item);
    for (const [i, o] of offers.entries()) {
      const r = appartRowsB[i];
      assert.equal(o.url, `https://www.lavillacoliving.com${prefixOf(lang)}/${KEY}`);
      assert.equal(o.availability, 'https://schema.org/PreOrder');
      assert.equal(o.availabilityStarts, m.APPART.opensOn);
      assert.deepEqual(o.priceSpecification.map((p) => [p.price, p.priceCurrency]), [[r.rent_chf, 'CHF'], [Number(r.rent_eur), 'EUR']]);
      assert.equal(o.itemOffered.containedInPlace['@id'], `https://www.lavillacoliving.com/${KEY}#lodging`);
      assert.doesNotMatch(JSON.stringify(o), HOUSE_AMENITY);
    }
  }
});

test('garde de gamme du prérendu (gammeMixIssues) : 0 constat sur les 4 pages, en A et en B, FR et EN', () => {
  for (const state of ['A', 'B']) {
    for (const route of PAGES) {
      for (const lang of LANGS) {
        const r = R[state][`${lang}:${route}`];
        const page = `<html><head>${r.title}${r.meta}${r.scripts}</head><body>${r.html}</body></html>`;
        const file = `${lang === 'en' ? 'en-' : ''}${route.slice(1)}.html`;
        assert.deepEqual(gammeMixIssues(page, file, m), [], `${state} ${lang} ${route}`);
      }
    }
  }
});

test('textes fixes de l\'état A : titres sans prix ; metas sans équipement, chaque gamme son « dès » là où la source réécrit la meta', () => {
  const metaRewritten = ['/chambres-disponibles', '/colocation-geneve', '/chambre-a-louer-annemasse'];
  for (const lang of LANGS) {
    for (const route of PAGES) {
      const { title, meta } = R.A[`${lang}:${route}`];
      const t = text(title), d = text(/<meta[^>]*name="description"[^>]*content="([^"]*)"/.exec(meta)?.[1] ?? '');
      assert.doesNotMatch(t, /\d\s?CHF|CHF\s?\d|€/, `${lang} ${route} : prix dans le titre`);
      assert.doesNotMatch(d, HOUSE_AMENITY, `${lang} ${route} : équipement dans la meta`);
      assert.ok(d.length > 0 && d.length <= 160, `${lang} ${route} : meta de ${d.length} caractères`);
      if (metaRewritten.includes(route)) assert.ok(d.includes(m.APPART.name), `${lang} ${route} : la meta nomme L'Appart`);
    }
  }
});
