// Page de L'Appart et ses fiches chambres (étape E3, 13/11/2026) : LAppartPage et AppartRoomPage rendues (react-dom/server, comme
// un premier rendu) dans les DEUX états de la base — A (la vue n'a pas encore L'Appart) et B (4 lignes datées du 1er février 2027,
// relevé tools/test/fixtures/v_public_rooms.etat-B.json) — puis passées aux gardes du prérendu (fonctions pures de
// scripts/check-entity-facts.mjs, scripts/house-pages-check.mjs, scripts/check-answer-slots.mjs). Plus les textes de
// src/data/appartPage.ts : conditions communes épinglées à la marque, aucune preuve des maisons, aucune phrase de la fiche recopiée.
// Le prérendu réel, les en-têtes HTML et le JSON-LD sont contrôlés par la chaîne complète (banc d'essai), pas ici.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, readFileSync, copyFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
import { loadEntityFacts } from '../../scripts/lib/load-entity-facts.mjs';
import { appartFactsBlockIssues, gammeMixIssues, visibleText } from '../../scripts/check-entity-facts.mjs';
import { checkFaqInHtml, checkHouseLocation, checkHouseNameGrammar } from '../../scripts/house-pages-check.mjs';
import { countFacebookCallout } from '../../scripts/check-answer-slots.mjs';
import { appartPageTextIssues } from '../../scripts/lib/gamme-rules.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const m = await loadEntityFacts();
const load = (f) => { const j = JSON.parse(readFileSync(path.join(ROOT, 'tools/test/fixtures', f), 'utf8')); return Array.isArray(j) ? j : j.rows ?? j.lignes; };
const ROWS_A = load('v_public_rooms.etat-A.json');
const ROWS_B = load('v_public_rooms.etat-B.json');
const LANGS = ['fr', 'en'];
const count = (hay, needle) => hay.split(needle).length - 1;

// ── Rendu : les deux pages, avec leurs vraies briques, dans un module CommonJS temporaire ─────────────────────────────────────
// L'état embarqué (`__rooms_level_data__`) est fourni par un double de src/lib/prerenderEmbeddedState.ts qui lit
// globalThis.__LVC_TEST_EMBED__ : un exemplaire du module par état (le magasin des chambres s'initialise une fois).
const dir = mkdtempSync(path.join(tmpdir(), 'lvc-appart-page-'));
const stub = path.join(dir, 'embedded-stub.ts');
writeFileSync(stub, `
export function readEmbeddedArray(id) { const v = (globalThis.__LVC_TEST_EMBED__ || {})[id]; return Array.isArray(v) && v.length > 0 ? v : null; }
export function readPrerenderFlag() { return null; }
export function embedJson(data) { return JSON.stringify(data).replace(/</g, "\\\\u003c"); }
`);
const entry = `
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LAppartPage } from "@/pages/LAppartPage";
import { AppartRoomPage } from "@/pages/AppartRoomPage";
const at = (url, node) => renderToStaticMarkup(<MemoryRouter initialEntries={[url]}><LanguageProvider>{node}</LanguageProvider></MemoryRouter>);
export const page = (lang) => at(lang === "en" ? "/en/lappart" : "/lappart", <LAppartPage />);
export const room = (lang, n) => at(lang === "en" ? "/en/lappart/chambre-" + n : "/lappart/chambre-" + n, <AppartRoomPage />);
`;
const out = path.join(dir, 'pages.cjs');
await build({
  stdin: { contents: entry, resolveDir: ROOT, loader: 'tsx' },
  bundle: true, outfile: out, format: 'cjs', platform: 'node', target: 'node20', jsx: 'automatic',
  alias: { '@': path.join(ROOT, 'src') }, logLevel: 'silent',
  define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env': '{"DEV":false,"PROD":true,"MODE":"production"}' },
  plugins: [{
    name: 'etat-embarque',
    setup(b) { b.onResolve({ filter: /prerenderEmbeddedState$/ }, () => ({ path: stub })); },
  }],
});
const req = createRequire(import.meta.url);
function stateModule(name, rows) {
  const file = path.join(dir, `${name}.cjs`);
  copyFileSync(out, file);
  globalThis.__LVC_TEST_EMBED__ = { __rooms_level_data__: rows };
  const mod = req(file);
  return mod;
}
// Rendus faits tout de suite (le magasin de chaque exemplaire lit l'état embarqué à son premier rendu).
const A = stateModule('etat-a', ROWS_A);
const R = { A: {}, B: {} };
for (const lang of LANGS) {
  R.A[lang] = { page: A.page(lang), rooms: Object.fromEntries([2, 3, 4, 5].map((n) => [n, A.room(lang, n)])) };
}
const Bm = stateModule('etat-b', ROWS_B);
for (const lang of LANGS) {
  R.B[lang] = { page: Bm.page(lang), rooms: Object.fromEntries([2, 3, 4, 5].map((n) => [n, Bm.room(lang, n)])) };
}
// État « complet » (B+ : après l'ouverture, les 4 chambres occupées sans date), dérivé du relevé B ; les maisons sont inchangées.
const ROWS_FULL = ROWS_B.map((r) => (r.house_slug === 'lappart' ? { ...r, availability: 'occupied', available_from: null } : r));
const Fm = stateModule('etat-complet', ROWS_FULL);
R.full = {};
for (const lang of LANGS) {
  R.full[lang] = { page: Fm.page(lang), rooms: Object.fromEntries([2, 5].map((n) => [n, Fm.room(lang, n)])) };
}
delete globalThis.__LVC_TEST_EMBED__;
rmSync(dir, { recursive: true, force: true });

/** Une page complète comme le prérendu la sert (en-tête et pied de page omis : ils ne sont pas dans <main>). */
const html = (body) => `<!DOCTYPE html><html><head><title>t</title></head><body><header>La Villa Coliving</header>${body}<footer>f</footer></body></html>`;
const appartRows = (rows) => rows.filter((r) => r.house_slug === 'lappart').sort((a, b) => a.room_number - b.room_number);

// ── Textes (src/data/appartPage.ts) ───────────────────────────────────────────────────────────────────────────────────────────

test('textes de la page : conditions communes = celles de la marque (STATS), contrôles internes vides, aucune preuve des maisons, aucune phrase de la fiche recopiée', async () => {
  const P = await bundleData();
  assert.deepEqual(P.appartPageIssues(), []);
  const S = m.STATS;
  assert.deepEqual({ ...P.BRAND_TERMS }, { leaseMonths: S.leaseDurationMonths, noticeMonths: S.noticePeriodMonths, depositMonths: S.depositMonths, responseHours: S.responseHours, applyMinutes: S.applyMinutes });
  for (const lang of LANGS) {
    // La phrase « bail » de la fiche chambre = celle de la marque (LEASE_SENTENCE), au caractère près.
    assert.equal(P.appartRoomLease(lang).lease, m.LEASE_SENTENCE[lang]);
    // La caution des fiches chambres : la forme des fiches des maisons, tirée de la phrase de la fiche (mêmes faits).
    assert.equal(P.appartDepositSentence(lang), lang === 'en'
      ? `Deposit of ${S.depositMonths} months' rent excluding charges, payable in 1, 2 or 3 instalments depending on your application, no application or agency fee.`
      : `Caution de ${S.depositMonths} mois de loyer hors charges, payable en 1, 2 ou 3 fois selon ton dossier, 0 € de frais de dossier et d'agence.`);
    // FAQ : 8 questions, dans l'ordre ; les questions 3 et 4 portent les textes d'exception de la source.
    const faq = P.appartFaq(lang);
    assert.deepEqual(faq.map((x) => x.id), [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `page.faq.${n}`));
    const ex = m.appartGammeExempt(lang);
    assert.equal(faq[2].q, ex['page.faq.3.q']); assert.equal(faq[2].a, ex['page.faq.3.r']); assert.equal(faq[3].a, ex['page.faq.4.r']);
    // Aucun texte propre à la page ne nomme un équipement des maisons, ni une preuve des maisons ; aucun ne recopie une phrase
    // de la fiche « l'essentiel » (la garde les compte une fois par page).
    const own = pageStrings(P, lang);
    for (const s of own) assert.deepEqual(appartPageTextIssues(s, m), [], s);
    const fiche = m.appartFactsStrings(lang);
    for (const s of own) for (const f of fiche) assert.ok(!s.includes(f), `phrase de la fiche recopiée : « ${f.slice(0, 50)}… »`);
  }
});

async function bundleData() {
  const r = await build({
    stdin: { contents: "export * from './src/data/appartPage';", resolveDir: ROOT, loader: 'ts' },
    bundle: true, write: false, format: 'esm', platform: 'neutral', target: 'es2022', alias: { '@': path.join(ROOT, 'src') }, logLevel: 'silent',
  });
  return import(`data:text/javascript;base64,${Buffer.from(r.outputFiles[0].text, 'utf8').toString('base64')}`);
}
function pageStrings(P, lang) {
  const h = P.appartPageHero(lang), lead = P.appartPageLead(lang), r = P.appartRoomsSection(lang);
  const w = P.appartWaitlistText(lang), full = P.appartFullText(lang), liv = P.appartLivingSection(lang), s = P.appartSuiteSection(lang);
  const c = P.appartConditionsSection(lang), fin = P.appartFinalCta(lang);
  return [P.appartPageTitle(lang), P.appartPageDescription(lang), P.appartPageDescriptionAfterOpening(lang), h.eyebrow, h.h1, ...h.markers, h.pricePill,
    lead.lead, lead.price, P.appartPageDpe(lang), ...Object.values(r), ...Object.values(w), full.title, full.text, liv.title, liv.text,
    s.title, s.text, c.title, c.intro, c.profiles, ...P.appartFaqOwn(lang).flatMap((x) => [x.q, x.a]), P.appartHousesLink(lang), fin.title, fin.text,
    ...[2, 5].flatMap((n) => [P.appartRoomTitle(n, lang), P.appartRoomH1(n, lang), P.appartRoomDescription(n, lang), P.appartRoomDescription(n, lang, '1er février'),
      P.appartRoomIntro(n, lang), P.appartRoomUnavailable(n, lang).description, P.appartRoomUnavailable(n, lang).text])];
}

test('en-tête de /candidature arrivé de L\'Appart (src/data/appartCandidature.ts) : textes, « suite » pour le n° 5, module léger', async () => {
  const r = await build({
    stdin: { contents: "export * from './src/data/appartCandidature';", resolveDir: ROOT, loader: 'ts' },
    bundle: true, write: false, format: 'esm', platform: 'neutral', target: 'es2022', alias: { '@': path.join(ROOT, 'src') }, logLevel: 'silent',
  });
  const C = await import(`data:text/javascript;base64,${Buffer.from(r.outputFiles[0].text, 'utf8').toString('base64')}`);
  const h = (lang, o) => { const x = C.appartCandidatureHeader(lang, o); return `${x.lead}${x.subject}`; };
  assert.equal(h('fr', {}), "Ta candidature concerne : L'Appart");
  assert.equal(h('fr', { number: 3 }), "Ta candidature concerne : L'Appart — chambre 3");
  assert.equal(h('en', { number: 5 }), "Your application is for: L'Appart — suite");
  assert.equal(h('fr', { waitlist: true }), "Ta candidature concerne : L'Appart — liste d'attente");
  assert.equal(C.appartCandidaturePriceLine('fr').replace(/\u00a0/g, ' '), `Tout compris dès 730 CHF/mois · ${m.ENTITY_FACTS_CTA.fr.note}`);
  // La page de candidature (page de conversion) ne doit charger ni les textes de la page de L'Appart ni ceux de la fiche.
  const src = readFileSync(path.join(ROOT, 'src/data/appartCandidature.ts'), 'utf8');
  assert.doesNotMatch(src, /from\s+["']\.\/(appartPage|appartFacts|appartLocation|appartPhotos)["']/);
  const join = readFileSync(path.join(ROOT, 'src/pages/JoinPageV4.tsx'), 'utf8');
  assert.doesNotMatch(join, /@\/data\/appartPage["']/);
});

// ── /lappart rendue ───────────────────────────────────────────────────────────────────────────────────────────────────────────

test('/lappart, états A et B : fiche L\'Appart une fois (chaque phrase une fois), emplacement, FAQ, encart Facebook, gammes non fondues', () => {
  for (const state of ['A', 'B']) {
    for (const lang of LANGS) {
      const at = `état ${state}, ${lang}`;
      const page = html(R[state][lang].page);
      assert.deepEqual(appartFactsBlockIssues(page, lang, m), [], at);
      assert.deepEqual(checkHouseLocation(page, 'lappart', lang, m), [], at);
      assert.deepEqual(checkHouseNameGrammar(page, 'lappart.html'), [], at);
      assert.equal(countFacebookCallout(page), 1, at);
      // Gammes : aucune preuve des maisons ; piscine, sauna, salle de sport seulement dans les textes d'exception.
      assert.deepEqual(gammeMixIssues(page, lang === 'en' ? 'en-lappart.html' : 'lappart.html', m), [], at);
      // Aucune fiche de la marque, aucun lien /candidature sans le lieu ; des liens de candidature au nom de L'Appart.
      assert.equal(count(page, 'id="entity-facts"'), 0, at);
      assert.equal(count(page, 'href="/candidature"') + count(page, 'href="/en/candidature"'), 0, at);
      assert.ok(count(page, 'property_interest=lappart') >= 5, `${at} : ${count(page, 'property_interest=lappart')} liens`);
      // Jamais le texte de liste d'attente des maisons (séjour moyen, « nos trois maisons »).
      const t = visibleText(page);
      assert.doesNotMatch(t, /mois en moyenne|months on average|trois maisons, pas|nos trois maisons :/, at);
      // Un seul état embarqué de la liste d'attente (son mois de référence).
      assert.equal(count(page, 'id="__pipeline_ref_month__"'), 1, at);
    }
  }
});

test('/lappart, état A : deux cartes « types » (12 m², suite), boutons sans numéro de chambre, aucune pastille, aucun état embarqué', () => {
  for (const lang of LANGS) {
    const page = R.A[lang].page;
    const t = visibleText(page);
    const [room, suite] = [lang === 'en' ? '12 m² room' : 'Chambre de 12 m²', lang === 'en' ? '22 m² suite' : 'Suite de 22 m²'];
    assert.ok(t.includes(room) && t.includes(suite), lang);
    assert.ok(t.includes(lang === 'en' ? 'Below are the two types of room' : 'Ci-dessous, les deux types de chambres'), lang);
    assert.doesNotMatch(page, /room_interest=chambre-/, lang);
    assert.doesNotMatch(t, /Libre dès|Available from|Libre maintenant|Available now/, lang);
    assert.equal(count(page, 'id="__rooms_level_data__"'), 0, lang);
    assert.equal(count(page, 'data-photo-pending'), 2, lang);
  }
});

test('/lappart, état B : les 4 chambres de la vue (Chambre 2, 3, 4, Suite), pastille datée, boutons à deux paramètres, état embarqué de L\'Appart', () => {
  const rows = appartRows(ROWS_B);
  assert.equal(rows.length, 4);
  for (const lang of LANGS) {
    const page = R.B[lang].page;
    const t = visibleText(page);
    for (const r of rows) {
      assert.ok(t.includes(m.roomLabel('lappart', r.room_number, lang)), `${lang} ${r.room_number}`);
      assert.ok(page.includes(`property_interest=lappart&amp;room_interest=chambre-${r.room_number}`), `${lang} ${r.room_number}`);
    }
    assert.ok(t.includes(lang === 'en' ? 'Available from February 1' : 'Libre dès le 1er février'), lang);
    assert.ok(!t.includes(lang === 'en' ? 'Below are the two types of room' : 'Ci-dessous, les deux types de chambres'), lang);
    const embed = JSON.parse(/<script type="application\/json" id="__rooms_level_data__">([\s\S]*?)<\/script>/.exec(page)[1]);
    assert.deepEqual(embed.map((r) => r.room_number).sort(), [2, 3, 4, 5], lang);
    assert.ok(embed.every((r) => r.house_slug === 'lappart'), lang);
    // Cartes de la page du lieu : ni ligne « tout compris », ni badge de gamme.
    assert.equal(count(page, 'data-all-inclusive'), 0, lang);
    assert.equal(count(page, 'data-gamme-badge'), 0, lang);
  }
});

test('/lappart, état complet (B+) : liste d\'attente en tête, chambres sans bouton, 3 chambres des maisons en cartes compactes sans ligne « tout compris » ; fiches fermées', async () => {
  const P = await bundleData();
  for (const lang of LANGS) {
    const at = `complet, ${lang}`;
    const page = html(R.full[lang].page);
    const t = visibleText(page);
    // Gardes de la page, comme en états A et B : fiche une fois, emplacement, encart, gammes non fondues (les cartes des
    // maisons ne nomment ni piscine ni sauna sur la page de L'Appart).
    assert.deepEqual(appartFactsBlockIssues(page, lang, m), [], at);
    assert.deepEqual(checkHouseLocation(page, 'lappart', lang, m), [], at);
    assert.equal(countFacebookCallout(page), 1, at);
    assert.deepEqual(gammeMixIssues(page, lang === 'en' ? 'en-lappart.html' : 'lappart.html', m), [], at);
    assert.ok(t.includes(P.appartFullText(lang).title), at);
    // Les 4 chambres nommées, « Complet », aucun bouton à leur numéro.
    for (const n of [2, 3, 4, 5]) assert.ok(t.includes(m.roomLabel('lappart', n, lang)), `${at} ${n}`);
    assert.ok(count(t, lang === 'en' ? 'Fully booked' : 'Complet') >= 4, at);
    assert.doesNotMatch(page, /room_interest=chambre-/, at);
    // Une seule liste d'attente, en tête : avant les cartes des maisons.
    assert.equal(count(page, 'id="__pipeline_ref_month__"'), 1, at);
    const houseLinks = (page.match(/<a\b[^>]*data-house-cta="true"[^>]*>/g) ?? []).map((tag) => /href="([^"]+)"/.exec(tag)?.[1]);
    assert.equal(houseLinks.length, 3, `${at} : ${houseLinks.join(' ')}`);
    for (const h of houseLinks) assert.match(h, lang === 'en' ? /^\/en\/(lavilla|leloft|lelodge)$/ : /^\/(lavilla|leloft|lelodge)$/, at);
    assert.ok(page.indexOf('id="__pipeline_ref_month__"') < page.indexOf('data-house-cta="true"'), at);
    assert.equal(count(page, 'data-all-inclusive'), 0, at);
    // État embarqué : les lignes de L'Appart ET celles des maisons (les cartes ci-dessus), relues au premier rendu.
    const embed = JSON.parse(/<script type="application\/json" id="__rooms_level_data__">([\s\S]*?)<\/script>/.exec(page)[1]);
    assert.ok(embed.some((r) => r.house_slug === 'lappart') && embed.some((r) => r.house_slug !== 'lappart'), at);
    // Fiches : fermées (« pas disponible »), sans bouton de candidature, gammes non fondues.
    for (const n of [2, 5]) {
      const rp = html(R.full[lang].rooms[n]);
      assert.ok(visibleText(rp).includes(P.appartRoomUnavailable(n, lang).h1), `${at}, fiche ${n}`);
      assert.doesNotMatch(rp, /room_interest=chambre-/, `${at}, fiche ${n}`);
      assert.deepEqual(gammeMixIssues(rp, `${lang === 'en' ? 'en-' : ''}lappart-chambre-${n}.html`, m), [], `${at}, fiche ${n}`);
    }
  }
});

// ── Fiches chambres rendues ───────────────────────────────────────────────────────────────────────────────────────────────────

test('fiches /lappart/chambre-N (2 à 5), états A et B : page complète, statique en A, datée en B ; gammes non fondues', () => {
  for (const state of ['A', 'B']) {
    for (const lang of LANGS) {
      for (const n of [2, 3, 4, 5]) {
        const at = `état ${state}, ${lang}, n° ${n}`;
        const body = R[state][lang].rooms[n];
        const page = html(body);
        const t = visibleText(page);
        const h1 = n === 5 ? (lang === 'en' ? "The suite at L'Appart" : "La suite de L'Appart") : (lang === 'en' ? `Room ${n} at L'Appart` : `Chambre ${n} à L'Appart`);
        assert.ok(t.includes(h1), at);
        assert.ok(page.includes(`property_interest=lappart&amp;room_interest=chambre-${n}`), at);
        assert.deepEqual(gammeMixIssues(page, `${lang === 'en' ? 'en-' : ''}lappart-chambre-${n}.html`, m), [], at);
        assert.deepEqual(checkHouseNameGrammar(page, `lappart-chambre-${n}.html`), [], at);
        assert.ok(t.includes(lang === 'en' ? 'Pool, sauna, gym: there aren\'t any at L\'Appart' : 'Piscine, sauna, salle de sport : il n\'y en a pas à L\'Appart'), at);
        assert.doesNotMatch(t, /Bed linen and towels provided|Linge de lit et serviettes fournis|3 fois par semaine|three times a week|Visite en visio|Video tour/, at);
        if (state === 'A') {
          assert.ok(t.includes(lang === 'en' ? 'opens for rent on 1 February 2027' : 'ouvre à la location le 1er février 2027'), at);
          assert.doesNotMatch(t, /Libre dès|Available from/, at);
        } else {
          assert.ok(t.includes(lang === 'en' ? 'Available from February 1' : 'Libre dès le 1er février'), at);
          assert.ok(t.includes(lang === 'en' ? "It's available from February 1" : 'Elle est disponible le 1er février'), at);
        }
        if (n === 5) assert.ok(t.includes(lang === 'en' ? 'or €530 each for two' : 'soit 530 € par personne à deux'), at);
      }
    }
  }
});

test('FAQ de /lappart : chaque question du FAQPage est dans le HTML (contrôle de house-pages-check, FAQPage reconstruit)', async () => {
  const P = await bundleData();
  for (const lang of LANGS) {
    const faq = P.appartFaq(lang);
    const ld = `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((x) => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a } })) })}</script>`;
    assert.deepEqual(checkFaqInHtml(html(R.A[lang].page) + ld, 'lappart.html'), [], lang);
  }
});
