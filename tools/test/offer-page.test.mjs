// Page /offre-hiver · /en/winter-offer à trois états (offre « Ta première année avec nous », brief Jérôme du 21/11/2026 ;
// D1 : mêmes adresses). La page est rendue par react-dom/server comme un PREMIER RENDU client : l'état vient du repère du
// HTML prérendu (`__offer_state__`, capturé par main.tsx), le jour de Paris de `__offer_today__`, les chambres de l'état
// embarqué (relevé v_public_rooms.etat-A). Aucune base, aucun navigateur, aucune horloge réelle.
// Contrôles de l'état « premiere-annee » : textes du brief §5 (verbatim), équivalent CHF dans une phrase à part (D4), FAQ et
// FAQPage (7 questions), noindex + canonical, liens `?offre=premiere-annee`, aucun « −50 % », prix barré ni « loyer réduit »,
// € et CHF jamais dans la même phrase hors cartes chambres, règles de check:facts (interdits, minutes, voiture).
// L'état « active » (hiver) reste celui d'avant ; l'état « ended » porte le nom et la date de fin de la nouvelle offre.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
import { forbiddenIssues, minuteIssues, geneva15Issues, carPromiseIssues, sentences } from '../../scripts/check-entity-facts.mjs';
import { STATS } from '../../src/data/stats.ts';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const ROWS = (() => { const j = JSON.parse(readFileSync(path.join(ROOT, 'tools/test/fixtures/v_public_rooms.etat-A.json'), 'utf8')); return Array.isArray(j) ? j : j.rows; })();
const OFFER_ROOMS = ROWS.filter((r) => r.availability === 'available' || r.available_from);
const TODAY = '2026-11-26';

const dir = mkdtempSync(path.join(tmpdir(), 'lvc-offre-page-'));
const entry = `
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { OfferHiverPage } from "@/pages/OfferHiverPage";
import { OfferBanner } from "@/components/OfferBanner";
export function render(lang) {
  const html = renderToStaticMarkup(<MemoryRouter initialEntries={[lang === "en" ? "/en/winter-offer" : "/offre-hiver"]}><LanguageProvider><OfferHiverPage /></LanguageProvider></MemoryRouter>);
  const head = Helmet.renderStatic();
  return { html, title: head.title.toString(), meta: head.meta.toString(), scripts: head.script.toString(), link: head.link.toString() };
}
export function renderBanner(lang) {
  return renderToStaticMarkup(<MemoryRouter initialEntries={[lang === "en" ? "/en/tarifs" : "/tarifs"]}><LanguageProvider><OfferBanner /></LanguageProvider></MemoryRouter>);
}
`;
const out = path.join(dir, 'offer-page.cjs');
await build({
  stdin: { contents: entry, resolveDir: ROOT, loader: 'tsx' },
  bundle: true, outfile: out, format: 'cjs', platform: 'node', target: 'node20', jsx: 'automatic',
  alias: { '@': path.join(ROOT, 'src') }, logLevel: 'silent', loader: { '.css': 'empty', '.svg': 'dataurl', '.png': 'dataurl', '.jpg': 'dataurl', '.webp': 'dataurl' },
  define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env': '{"DEV":false,"PROD":true,"MODE":"production"}' },
});
const require = createRequire(import.meta.url);
/** Premier rendu (module rechargé : magasin des chambres neuf) avec les repères d'un HTML prérendu. */
function withState(stash, fn) {
  delete require.cache[require.resolve(out)];
  globalThis.window = { __PRERENDER_STATE__: stash };
  try {
    return fn(require(out));
  } finally {
    delete globalThis.window;
  }
}
const R = {};
for (const state of ['active', 'premiere-annee', 'ended']) {
  for (const lang of ['fr', 'en']) {
    R[`${lang}:${state}`] = withState({ __rooms_level_data__: JSON.stringify(ROWS), __offer_state__: state, __offer_today__: TODAY }, (P) => P.render(lang));
  }
}
// Sans repère d'état (rendu serveur sans HTML prérendu) : l'hiver, comme avant le 21/11 — jamais l'horloge réelle.
for (const lang of ['fr', 'en']) R[`${lang}:sans-repere`] = withState({ __rooms_level_data__: JSON.stringify(ROWS) }, (P) => P.render(lang));
const B = {};
for (const flag of ['1', 'hiver', 'premiere-annee', 'xyz']) {
  for (const lang of ['fr', 'en']) B[`${lang}:${flag}`] = withState({ __offer_banner__: flag }, (P) => P.renderBanner(lang));
}
rmSync(dir, { recursive: true, force: true });

const decode = (s) => s.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
/** Texte visible aplati : balises retirées, espaces repliés, insécables et « ᵉ » ramenés à l'écriture du brief (« 4e »). */
const flat = (html) => decode(html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<\/?(?:a|span|strong|em|b)\b[^>]*>/g, '').replace(/<[^>]+>/g, ' '))
  .replace(/ /g, ' ').replace(/ᵉ/g, 'e').replace(/\s+/g, ' ').trim();
const titleOf = (r) => decode(r.title.replace(/<[^>]+>/g, '')).replace(/ /g, ' ');
const metaOf = (r, name) => decode((new RegExp(`<meta[^>]*name="${name}"[^>]*content="([^"]*)"`).exec(r.meta) || [])[1] ?? '').replace(/ /g, ' ');
const faqPage = (r) => [...r.scripts.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1])).find((j) => j['@type'] === 'FAQPage');
const hrefs = (html) => [...html.matchAll(/href="([^"]*)"/g)].map((m) => decode(m[1]));
/** HTML sans la section des chambres (les cartes portent le prix au format « CHF (€) » du site, hors de ce contrôle). */
const withoutRooms = (html) => html.replace(/<section id="chambres-offre"[\s\S]*?<\/section>/, '');

// Brief du 21/11 §5 — textes validés par Jérôme (« 4e » du brief = « 4ᵉ » typographique de la page).
const BRIEF = {
  fr: {
    h1: 'Ta première année avec nous : jusqu\'à 1 400 € remboursés',
    subtitle: 'Plus tu restes, plus on te rembourse : 200 € dès ton premier loyer, 300 € à 3 mois, 400 € à 6 mois, 500 € à 1 an. Ton loyer, lui, ne change pas.',
    deadline: 'Pour tout bail signé d\'ici le 31 décembre, même si tu n\'arrives qu\'en janvier.',
    chf: 'Soit environ 1 300 CHF.',
    conditions: [
      '200 € déduits de ton premier loyer complet.',
      '300 € après 3 mois, 400 € après 6 mois, 500 € après 1 an : remboursés par virement, une fois ton 4e, ton 7e et ton 13e loyer réglés.',
      'Un palier est acquis si ton bail est en cours, sans préavis donné, et tes loyers à jour à l\'échéance du loyer concerné. Ce que tu as déjà reçu te reste acquis.',
      'Ton loyer ne change pas : tu le paies normalement, on te rembourse à part.',
      'Pour tout bail signé du 26 novembre au 31 décembre 2026, à La Villa, au Loft ou au Lodge.',
    ],
    always: ['0 € de frais de dossier', 'caution de 2 mois de loyer hors charges, payable en 1, 2 ou 3 fois (le nombre de versements est décidé par le bailleur selon ton dossier)', 'Visite sur place ou en visio'],
    faq: [
      ['Comment je reçois ces montants ?', 'Les 200 € sont déduits de ton premier loyer complet. Pour les suivants, on te prévient un mois avant, tu nous envoies ton RIB et on te fait un virement.'],
      ['Et si je pars avant un an ?', 'Tu pars quand tu veux, avec un mois de préavis. Tu gardes ce que tu as déjà reçu ; les paliers suivants ne sont pas versés.'],
      ['Je vis déjà à Genève ou dans la région, j\'y ai droit ?', 'Oui. L\'offre vaut pour toute personne qui signe son premier bail chez nous d\'ici le 31 décembre.'],
      ['Ma chambre ne se libère qu\'en janvier ?', 'L\'offre s\'applique : c\'est la date de signature qui compte.'],
      ['Mon loyer change ?', 'Non. Le loyer de ton bail reste le même toute l\'année.'],
      ['Et la caution ?', 'Deux mois de loyer hors charges, payable en 1, 2 ou 3 fois selon ton dossier. C\'est vrai toute l\'année.'],
      ['C\'est cumulable avec le parrainage ?', 'Oui : le résident qui te recommande garde son avantage.'],
    ],
    title: 'Ta première année avec nous : jusqu\'à 1 400 € remboursés',
    eyebrow: 'Offre jusqu\'au 31 décembre',
  },
  en: {
    h1: 'Your first year with us: up to €1,400 back',
    subtitle: 'The longer you stay, the more you get back: €200 off your first rent, then €300 after 3 months, €400 after 6 months and €500 after a year. Your rent stays the same.',
    deadline: 'For any lease signed by 31 December, even if you only move in in January.',
    chf: 'That\'s about CHF 1,300.',
    conditions: [
      '€200 off your first full month\'s rent.',
      '€300 after 3 months, €400 after 6 months, €500 after a year: paid back by bank transfer once your 4th, 7th and 13th rents are paid.',
      'A step is earned if, when that rent is due, your lease is running, no notice has been given and your rent is up to date. What you have already received stays yours.',
      'Your rent stays the same: you pay it as usual, and we pay you back separately.',
      'For any lease signed between 26 November and 31 December 2026, at La Villa, Le Loft or Le Lodge.',
    ],
    always: ['No application fee', 'Visit on site or by video call'],
    faq: [
      ['How do I get the money?', 'The €200 comes off your first full month\'s rent. For the next steps, we let you know a month ahead, you send us your bank details and we make a transfer.'],
    ],
    title: 'Your first year with us: up to €1,400 back | La Villa Coliving',
    eyebrow: 'Offer until 31 December',
  },
};

for (const lang of ['fr', 'en']) {
  const r = () => R[`${lang}:premiere-annee`];
  const W = BRIEF[lang];

  test(`${lang} premiere-annee : <main> marqué, title (proposition), description ≤ 160, noindex, canonical auto-référente`, () => {
    assert.match(r().html, /^<main data-offer-state="premiere-annee" data-offer-id="premiere-annee" data-offer-today="2026-11-26"/);
    assert.equal(titleOf(r()), W.title);
    const desc = metaOf(r(), 'description');
    assert.ok(desc.length > 80 && desc.length <= 160, `description de ${desc.length} caractères : ${desc}`);
    assert.match(desc, lang === 'en' ? /31 December/ : /31 décembre/);
    assert.doesNotMatch(desc, /CHF/);
    assert.match(metaOf(r(), 'robots'), /noindex/);
    const canonical = /<link[^>]*rel="canonical"[^>]*href="([^"]*)"/.exec(r().link)?.[1];
    assert.equal(canonical, lang === 'en' ? 'https://www.lavillacoliving.com/en/winter-offer' : 'https://www.lavillacoliving.com/offre-hiver');
  });

  test(`${lang} premiere-annee : accroche, CHF à part (D4), sous-titre, ligne de situation, échéance — dans cet ordre`, () => {
    const html = r().html;
    const h1 = flat(/<h1[^>]*>([\s\S]*?)<\/h1>/.exec(html)[1]);
    assert.equal(h1, W.h1);
    assert.doesNotMatch(h1, /CHF/, 'jamais de CHF dans l\'accroche');
    const chf = /<p data-offer-chf[^>]*>([\s\S]*?)<\/p>/.exec(html);
    assert.ok(chf, 'ligne CHF à part');
    assert.equal(flat(chf[1]), W.chf);
    assert.doesNotMatch(chf[1], /€/);
    assert.equal(STATS.genevaCenterMinutes, 20);
    const text = flat(html);
    const order = [W.eyebrow, W.h1, W.chf, W.subtitle, lang === 'en' ? 'A furnished room in a coliving house, all-inclusive' : 'Une chambre meublée en coliving, tout inclus', W.deadline];
    let at = -1;
    for (const s of order) {
      const i = text.indexOf(s, at + 1);
      assert.ok(i > at, `« ${s} » absent ou hors d'ordre`);
      at = i;
    }
  });

  test(`${lang} premiere-annee : conditions, « Toujours vrai », « Comment ça marche » et FAQ du brief ; FAQPage = les 7 questions visibles`, () => {
    const text = flat(r().html);
    for (const c of W.conditions) assert.ok(text.includes(c), `condition absente : ${c}`);
    for (const a of W.always) assert.ok(text.toLowerCase().includes(a.toLowerCase()), `« toujours vrai » absent : ${a}`);
    assert.equal((r().html.match(/<li\b/g) ?? []).length > 15, true);
    assert.equal((/<ol data-offer-steps[^>]*>([\s\S]*?)<\/ol>/.exec(r().html)?.[1].match(/<li\b/g) ?? []).length, 4, 'quatre paliers');
    for (const [q, a] of W.faq) {
      assert.ok(text.includes(q), `question absente : ${q}`);
      assert.ok(text.includes(a), `réponse absente : ${a}`);
    }
    const page = faqPage(r());
    assert.ok(page, 'FAQPage absent');
    assert.equal(page.mainEntity.length, 7);
    for (const [q, a] of W.faq) {
      const item = page.mainEntity.find((e) => e.name.replace(/ /g, ' ') === q);
      assert.ok(item, `FAQPage sans « ${q} »`);
      assert.equal(item.acceptedAnswer.text.replace(/ /g, ' '), a);
    }
  });

  test(`${lang} premiere-annee : liens de candidature en ?offre=premiere-annee ; cartes « Libre maintenant » / « Bail au … »`, () => {
    const links = hrefs(r().html).filter((h) => h.includes('/candidature'));
    assert.ok(links.length >= 2 + OFFER_ROOMS.length, `${links.length} liens de candidature`);
    for (const h of links) {
      assert.match(h, /[?&]offre=premiere-annee(&|$)/, h);
      assert.doesNotMatch(h, /offre=hiver/, h);
      if (lang === 'en') assert.match(h, /^\/en\/candidature/, h);
    }
    const starts = [...r().html.matchAll(/<p data-lease-start[^>]*>([^<]*)<\/p>/g)].map((m) => decode(m[1]).replace(/ /g, ' '));
    assert.equal(starts.length, OFFER_ROOMS.length);
    for (const s of starts) assert.match(s, lang === 'en' ? /^(Available now|Lease from \d{1,2} \p{L}+)$/u : /^(Libre maintenant|Bail au \d{1,2}(ᵉʳ)? \p{L}+)$/u, s);
    assert.ok(starts.includes(lang === 'en' ? 'Available now' : 'Libre maintenant'));
    assert.ok(/data-offer-count/.test(r().html), 'compteur du hero');
    assert.ok(r().html.includes('id="__rooms_level_data__"') || /type="application\/json"/.test(r().html), 'état des chambres embarqué');
  });

  test(`${lang} premiere-annee : ni « −50 % », ni moitié, ni « loyer réduit », ni prix barré, ni « 7 jours » ; € et CHF jamais dans la même phrase`, () => {
    const html = r().html;
    const text = flat(html);
    assert.doesNotMatch(text, /50 ?%|moitié|half|loyer réduit|reduced rent|loyer à \d|rent of \d|7 jours suivant|within 7 days|Pose tes valises|Settle in/i);
    assert.doesNotMatch(html, /<(s|del|strike)\b|line-through/);
    for (const s of sentences(withoutRooms(html))) {
      assert.ok(!(/€/.test(s) && /CHF/.test(s)), `€ et CHF dans la même phrase : « ${s} »`);
    }
  });

  test(`${lang} premiere-annee : règles de check:facts (interdits, minutes, « 15 min », voiture) — zéro écart`, () => {
    const html = `<html><head></head><body>${r().html}</body></html>`;
    assert.deepEqual(forbiddenIssues(html, undefined, lang === 'en' ? 'en-offre-hiver.html' : 'offre-hiver.html'), []);
    assert.deepEqual(minuteIssues(html, STATS.genevaCenterMinutes), []);
    assert.deepEqual(geneva15Issues(html), []);
    assert.deepEqual(carPromiseIssues(html), []);
  });

  test(`${lang} active : l'offre d'hiver telle qu'avant (H1, −50 %, liens ?offre=hiver)`, () => {
    const a = R[`${lang}:active`];
    assert.match(a.html, /^<main data-offer-state="active" data-offer-id="hiver" data-offer-today="2026-11-26"/);
    assert.equal(flat(/<h1[^>]*>([\s\S]*?)<\/h1>/.exec(a.html)[1]), lang === 'en' ? 'Half price on your first month' : 'Ton premier mois à moitié prix');
    for (const h of hrefs(a.html).filter((x) => x.includes('/candidature'))) assert.match(h, /[?&]offre=hiver(&|$)/, h);
    assert.doesNotMatch(flat(a.html), /première année|first year/i);
  });

  test(`${lang} sans repère d'état : l'offre d'hiver (rendu déterministe, indépendant de la date réelle)`, () => {
    assert.match(R[`${lang}:sans-repere`].html, /^<main data-offer-state="active" data-offer-id="hiver"/);
  });

  test(`${lang} ended : « terminée » au nom de « Ta première année avec nous », date de fin, plus d'offre ni de chambres`, () => {
    const e = R[`${lang}:ended`];
    assert.match(e.html, /^<main data-offer-state="ended" data-offer-id="premiere-annee"/);
    const text = flat(e.html);
    assert.ok(text.includes(lang === 'en' ? '“Your first year with us” closed on 31 December 2026.' : 'L\'offre « Ta première année avec nous » s\'est terminée le 31 décembre 2026.'), text.slice(0, 300));
    assert.match(titleOf(e), lang === 'en' ? /^This offer has ended/ : /^Cette offre est terminée/);
    assert.doesNotMatch(text, /1 400|1,400|50 ?%|moitié|half/i);
    assert.ok(!hrefs(e.html).some((h) => h.includes('offre=')), 'aucun lien d\'offre');
    assert.match(metaOf(e, 'robots'), /noindex/);
  });

  test(`${lang} bandeau : reproduit l'offre du bandeau prérendu (« 1 » = HTML d'avant le 21/11 = hiver), rien sinon`, () => {
    const t = (h) => decode(h.replace(/<[^>]+>/g, ' ')).replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
    const hiver = lang === 'en' ? 'Half price on your first month if you sign by 25 November →' : 'Ton 1er mois à moitié prix si tu signes d\'ici le 25 novembre →';
    const first = lang === 'en' ? 'Your first year with us: up to €1,400 back →' : 'Ta première année avec nous : jusqu\'à 1 400 € remboursés →';
    assert.equal(t(B[`${lang}:1`]), hiver);
    assert.match(B[`${lang}:1`], /data-offer-id="hiver"/);
    assert.equal(t(B[`${lang}:hiver`]), hiver);
    assert.equal(t(B[`${lang}:premiere-annee`]), first);
    assert.match(B[`${lang}:premiere-annee`], /data-offer-id="premiere-annee"/);
    assert.match(B[`${lang}:premiere-annee`], /href="(\/en\/winter-offer|\/offre-hiver)"/);
    assert.equal(B[`${lang}:xyz`], '');
  });
}
