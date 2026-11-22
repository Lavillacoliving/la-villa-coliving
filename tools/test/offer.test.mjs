// Offres datées du site (src/data/offer.ts) : « Pose tes valises avant l'hiver » (brief Jérôme du 06/10/2026, rebrief −50 %
// du 12/10/2026), puis « Ta première année avec nous » (brief du 21/11/2026, bascule automatique le 26/11 à 0 h, D8).
// 1. src/data/offer.ts (sans import, chargé tel quel par Node 24) : fenêtres sans trou, état de la page, offre en cours,
//    normalisation du paramètre (D2), paliers et total, textes verbatim, filtre des chambres, remise de l'hiver, mesure GA4.
// 2. Le script inline #lvc-offer d'index.html (bandeau avant la première peinture) doit rester identique à offer.ts
//    (fenêtres, clés, pages du bandeau, durée de fermeture) ; exécuté dans une VM à heure simulée, avec et sans fermeture.
// 3. src/lib/attribution.ts : `?offre=` mémorisé pour la session (valeur brute connue), valeur inconnue ignorée.
// Toutes les dates sont INJECTÉES : aucun test ne dépend de l'horloge réelle.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import * as O from '../../src/data/offer.ts';
import * as A from '../../src/lib/attribution.ts';
import { TAUX_BCE } from '../../src/data/stats.ts';

const HTML = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
const SCRIPT = /<script id="lvc-offer">([\s\S]*?)<\/script>/.exec(HTML)?.[1];
const DAY = 864e5;
const DURING = Date.parse('2026-10-20T10:00:00+02:00');
// Instants de la bascule, heure de Paris (UTC+1 en novembre-janvier).
const AT = {
  before: Date.parse('2026-10-14T23:59:00+02:00'),
  hiverStart: Date.parse('2026-10-15T00:00:00+02:00'),
  hiverLast: Date.parse('2026-11-25T23:59:00+01:00'),
  hiverLastSecond: Date.parse('2026-11-25T23:59:59+01:00'),
  switch: Date.parse('2026-11-26T00:00:00+01:00'),
  switch1: Date.parse('2026-11-26T00:01:00+01:00'),
  firstYearLast: Date.parse('2026-12-31T23:59:00+01:00'),
  end: Date.parse('2027-01-01T00:00:00+01:00'),
  end1: Date.parse('2027-01-01T00:01:00+01:00'),
};

class MemoryStorage {
  constructor(entries = {}) { this.map = new Map(Object.entries(entries)); }
  getItem(k) { return this.map.has(k) ? this.map.get(k) : null; }
  setItem(k, v) { this.map.set(k, String(v)); }
  removeItem(k) { this.map.delete(k); }
}

/** Exécute #lvc-offer sur une URL à un instant donné ; renvoie true si html.lvc-offer-on a été posée. */
function run(url, { now = DURING, local = new MemoryStorage(), storageThrows = false } = {}) {
  const u = new URL(url, 'https://www.lavillacoliving.com');
  const classes = new Set();
  const window = {};
  if (storageThrows) Object.defineProperty(window, 'localStorage', { get() { throw new Error('SecurityError'); } });
  else window.localStorage = local;
  const RealDate = Date;
  class FakeDate extends RealDate {
    constructor(...args) { if (args.length === 0) super(now); else super(...args); }
    static now() { return now; }
  }
  const context = vm.createContext({
    window,
    document: { documentElement: { classList: { add: (c) => classes.add(c) } } },
    location: { pathname: u.pathname, search: u.search },
    Date: FakeDate,
    Number,
  });
  vm.runInContext(SCRIPT, context);
  return classes.has('lvc-offer-on');
}

test('offer.ts : offre d\'hiver — dates, début (15/10 0 h) et fin (25/11 inclus, heure de Paris), remise de 50 %', () => {
  assert.equal(O.OFFER_ID, 'hiver');
  assert.equal(O.OFFER_START, '2026-10-15');
  assert.equal(O.OFFER_END, '2026-11-25');
  assert.equal('MOVE_IN_DEADLINE' in O, false, 'MOVE_IN_DEADLINE retiré (rebrief du 12/10)');
  assert.equal(O.ALREADY_FREE_START_DAYS, 7);
  assert.equal(O.OFFER_DISCOUNT_PERCENT, 50);
  assert.equal(O.isOfferStarted(AT.before), false);
  assert.equal(O.isOfferStarted(AT.hiverStart), true);
  assert.equal(O.isOfferActive(Date.parse('2026-11-25T23:30:00+01:00')), true);
  assert.equal(O.isOfferActive(AT.switch), false);
  assert.equal(O.isOfferActive(DURING), true);
  // (13/11/2026) Palier des chambres 7 et 8 de La Villa : 1 290 CHF → 645 CHF le premier mois (1 380 € → 690 €).
  assert.equal(O.discountedFirstMonth(1290), 645);
  assert.equal(O.discountedFirstMonth(1380), 690);
  assert.equal(O.discountedFirstMonth(1370), 685);
  assert.equal(O.discountedFirstMonth(1430), 715);
  assert.equal(O.discountedFirstMonth(1470), 735);
  assert.equal(O.discountedFirstMonth(1530), 765);
  assert.equal(O.formatOfferDate('2026-11-25', 'fr'), '25 novembre'); // insécable : la date ne se coupe pas
  assert.equal(O.formatOfferDate('2026-11-25', 'en'), '25 November');
  assert.equal(O.formatOfferDate('2026-12-01', 'fr'), '1ᵉʳ décembre');
});

test('offer.ts : « Ta première année » — fenêtre du 26/11 0 h au 31/12 inclus, sans trou avec l\'hiver, clé de fermeture propre', () => {
  assert.equal(O.FIRST_YEAR_OFFER_ID, 'premiere-annee');
  assert.equal(O.FIRST_YEAR_QUERY, 'offre=premiere-annee');
  assert.equal(O.FIRST_YEAR_START, '2026-11-26');
  assert.equal(O.FIRST_YEAR_END, '2026-12-31');
  assert.equal(O.FIRST_YEAR_START_MS, O.OFFER_END_EXCLUSIVE_MS, 'aucun trou : la fin exclusive de l\'hiver est le début de la nouvelle offre');
  assert.equal(O.FIRST_YEAR_START_MS, AT.switch);
  assert.equal(O.FIRST_YEAR_END_EXCLUSIVE_MS, AT.end);
  assert.equal(O.FIRST_YEAR_BANNER_DISMISS_KEY, 'lvc_offer_premiere_annee_closed');
  assert.notEqual(O.FIRST_YEAR_BANNER_DISMISS_KEY, O.OFFER_BANNER_DISMISS_KEY);
  // Fenêtres dans l'ordre, contiguës, chacune avec sa clé.
  assert.deepEqual(O.OFFER_WINDOWS.map((w) => w.id), ['hiver', 'premiere-annee']);
  for (let i = 1; i < O.OFFER_WINDOWS.length; i++) assert.equal(O.OFFER_WINDOWS[i].startMs, O.OFFER_WINDOWS[i - 1].endExclusiveMs);
  assert.deepEqual(O.OFFER_WINDOWS.map((w) => w.dismissKey), [O.OFFER_BANNER_DISMISS_KEY, O.FIRST_YEAR_BANNER_DISMISS_KEY]);
  assert.deepEqual([...O.KNOWN_OFFER_IDS], ['hiver', 'premiere-annee']);
});

test('offer.ts : paliers 200 / 300 / 400 / 500 € liés aux 1er, 4ᵉ, 7ᵉ et 13ᵉ loyers complets ; total CALCULÉ = 1 400 € ; ≈ 1 300 CHF', () => {
  assert.deepEqual(O.FIRST_YEAR_TIERS.map((t) => [t.rent, t.eur, t.afterMonths, t.payment]), [
    [1, 200, 0, 'deduction'],
    [4, 300, 3, 'transfer'],
    [7, 400, 6, 'transfer'],
    [13, 500, 12, 'transfer'],
  ]);
  assert.equal(O.FIRST_YEAR_TOTAL_EUR, 1400);
  assert.equal(O.FIRST_YEAR_TOTAL_EUR, O.FIRST_YEAR_TIERS.reduce((s, t) => s + t.eur, 0));
  // D4 / décision n° 2 : total × taux figé, arrondi à la centaine inférieure (1 311,24 → 1 300).
  assert.equal(TAUX_BCE.eurChf, 0.9366);
  assert.equal(O.firstYearTotalChf(TAUX_BCE.eurChf), 1300);
  assert.equal(O.firstYearTotalChf(0.95), 1300);
  assert.equal(O.firstYearTotalChf(1), 1400);
  assert.equal(O.formatOfferEur(1400, 'fr'), '1 400 €');
  assert.equal(O.formatOfferEur(200, 'fr'), '200 €');
  assert.equal(O.formatOfferEur(1400, 'en'), '€1,400');
  assert.equal(O.formatOfferChf(1300, 'fr'), '1 300 CHF');
  assert.equal(O.formatOfferChf(1300, 'en'), 'CHF 1,300');
});

test('offer.ts : offre en cours (offerAt) et état de la page (offerPageState) aux instants de la bascule, heure de Paris', () => {
  const id = (t) => O.offerAt(t)?.id ?? null;
  assert.equal(id(AT.before), null, 'avant le 15/10 : aucune offre (le bandeau attend)');
  assert.equal(id(AT.hiverStart), 'hiver');
  assert.equal(id(DURING), 'hiver');
  assert.equal(id(AT.hiverLast), 'hiver', '25/11 à 23 h 59');
  assert.equal(id(AT.hiverLastSecond), 'hiver', '25/11 à 23 h 59 min 59 s');
  assert.equal(id(AT.switch), 'premiere-annee', '26/11 à 0 h 00');
  assert.equal(id(AT.switch1), 'premiere-annee', '26/11 à 0 h 01');
  assert.equal(id(AT.firstYearLast), 'premiere-annee', '31/12 à 23 h 59');
  assert.equal(id(AT.end), null, '01/01/2027 à 0 h 00');
  assert.equal(id(AT.end1), null, '01/01/2027 à 0 h 01');
  // Une offre à chaque minute du 15/10 0 h au 31/12 23 h 59 (pas de 15 min) : aucun trou.
  for (let t = AT.hiverStart; t < AT.end; t += 15 * 60 * 1000) assert.ok(O.offerAt(t), new Date(t).toISOString());
  assert.equal(O.offerAt(AT.switch - 1)?.id, 'hiver');
  assert.equal(O.offerAt(AT.switch)?.id, 'premiere-annee');
  assert.equal(O.offerAt(AT.end - 1)?.id, 'premiere-annee');
  // La page : l'hiver aussi AVANT le 15/10 (relecture des annonces), puis la nouvelle offre, puis « terminée ».
  assert.equal(O.offerPageState(AT.before), 'active');
  assert.equal(O.offerPageState(AT.hiverLast), 'active');
  assert.equal(O.offerPageState(AT.switch), 'premiere-annee');
  assert.equal(O.offerPageState(AT.switch1), 'premiere-annee');
  assert.equal(O.offerPageState(AT.firstYearLast), 'premiere-annee');
  assert.equal(O.offerPageState(AT.end), 'ended');
  assert.equal(O.offerPageState(AT.end1), 'ended');
  for (const s of ['active', 'premiere-annee', 'ended']) assert.equal(O.parseOfferPageState(s), s);
  for (const s of ['', null, undefined, 'hiver', 'Active', 'constructor']) assert.equal(O.parseOfferPageState(s), null, String(s));
});

test('offer.ts : normalizeOffer — une offre connue devient l\'offre EN COURS (D2), rien après le 31/12, valeur inconnue ignorée', () => {
  assert.equal(O.normalizeOffer('hiver', DURING), 'hiver');
  assert.equal(O.normalizeOffer(' Hiver ', DURING), 'hiver');
  assert.equal(O.normalizeOffer('premiere-annee', DURING), 'hiver', 'avant le 26/11 : l\'offre en cours est l\'hiver');
  assert.equal(O.normalizeOffer('hiver', AT.hiverLast), 'hiver');
  assert.equal(O.normalizeOffer('hiver', AT.switch), 'premiere-annee', 'D2 : un lien ?offre=hiver compte pour la nouvelle offre');
  assert.equal(O.normalizeOffer('hiver', AT.switch1), 'premiere-annee');
  assert.equal(O.normalizeOffer('premiere-annee', AT.switch1), 'premiere-annee');
  assert.equal(O.normalizeOffer(' Premiere-Annee ', AT.firstYearLast), 'premiere-annee');
  assert.equal(O.normalizeOffer('premiere-annee', AT.end), '');
  assert.equal(O.normalizeOffer('hiver', AT.end1), '');
  assert.equal(O.normalizeOffer('hiver', AT.before), '');
  for (const t of [DURING, AT.switch1]) {
    for (const v of ['xyz', 'constructor', '', null, undefined, 'hiver2', 'premiere_annee', 'première-année']) assert.equal(O.normalizeOffer(v, t), '', String(v));
  }
});

test('offer.ts : pages du bandeau (les mêmes pour les deux offres)', () => {
  for (const p of ['/', '/en', '/en/', '/tarifs', '/en/tarifs', '/chambres-disponibles/', '/lavilla', '/en/lelodge']) assert.equal(O.isOfferBannerPath(p), true, p);
  for (const p of ['/candidature', '/en/candidature', '/blog', '/blog/x', '/offre-hiver', '/en/winter-offer', '/mentions-legales', '/nos-maisons', '/services', '/faq', '/entarifs']) assert.equal(O.isOfferBannerPath(p), false, p);
});

// Textes des briefs à l'espace près, l'insécable (U+00A0) comptant pour une espace : jour + mois, montants, « % » en FR.
const sp = (s) => s.replace(/ /g, ' ');
test('offer.ts : textes du bandeau et du formulaire de l\'hiver (rebrief §2.1, verbatim)', () => {
  assert.ok(O.OFFER_TEXTS.fr.formLine.includes('−50 %'), 'insécable avant « % »');
  assert.equal(sp(O.OFFER_TEXTS.fr.banner), 'Ton 1er mois à moitié prix si tu signes d\'ici le 25 novembre →');
  assert.equal(sp(O.OFFER_TEXTS.en.banner), 'Half price on your first month if you sign by 25 November →');
  assert.equal(sp(O.OFFER_TEXTS.fr.formLine), 'Offre Pose tes valises : −50 % sur ton premier mois pour tout bail signé d\'ici le 25 novembre.');
  assert.equal(sp(O.OFFER_TEXTS.en.formLine), 'Settle-in offer: 50% off your first month for any lease signed by 25 November.');
  assert.equal(O.OFFER_TEXTS.fr.name, 'Pose tes valises avant l\'hiver');
});

test('offer.ts : textes de « Ta première année » (brief du 21/11 §5, verbatim) ; aucun « −50 % », « moitié », « loyer réduit »', () => {
  const T = O.FIRST_YEAR_TEXTS;
  assert.equal(T.fr.name, 'Ta première année avec nous');
  assert.equal(T.en.name, 'Your first year with us');
  assert.equal(sp(T.fr.banner), 'Ta première année avec nous : jusqu\'à 1 400 € remboursés →');
  assert.equal(sp(T.en.banner), 'Your first year with us: up to €1,400 back →');
  assert.equal(sp(T.fr.formLine), 'Offre Ta première année : jusqu\'à 1 400 € remboursés pour tout bail signé d\'ici le 31 décembre.');
  assert.equal(sp(T.en.formLine), 'First-year offer: up to €1,400 back for any lease signed by 31 December.');
  assert.ok(T.fr.banner.includes('1 400 €'), 'montant insécable dans le bandeau (390 px)');
  assert.equal(T.fr.bannerClose, O.OFFER_TEXTS.fr.bannerClose);
  assert.equal(T.en.bannerClose, O.OFFER_TEXTS.en.bannerClose);
  for (const s of [T.fr.banner, T.fr.formLine, T.en.banner, T.en.formLine]) {
    assert.doesNotMatch(s, /50\s?%|moitié|half|loyer réduit|reduced rent|CHF/i, s);
  }
  assert.equal(O.OFFER_TEXTS_BY_ID.hiver, O.OFFER_TEXTS);
  assert.equal(O.OFFER_TEXTS_BY_ID['premiere-annee'], O.FIRST_YEAR_TEXTS);
});

test('offer.ts : jour de Paris et ligne de démarrage du bail (date à venir, chambre libre, date passée ou du jour)', () => {
  assert.equal(O.parisDateIso(Date.parse('2026-10-14T22:30:00Z')), '2026-10-15'); // 0 h 30 à Paris (UTC+2)
  assert.equal(O.parisDateIso(Date.parse('2026-11-25T22:59:00Z')), '2026-11-25'); // 23 h 59 à Paris (UTC+1)
  assert.equal(O.parisDateIso(AT.switch1), '2026-11-26');
  assert.equal(O.parisDateIso(AT.end1), '2027-01-01');
  const today = '2026-10-15';
  const loft4 = { availability: 'occupied', available_from: '2026-12-16' };
  assert.deepEqual(O.leaseStartOf(loft4, today), { kind: 'date', iso: '2026-12-16' });
  assert.equal(sp(O.leaseStartLabel(O.leaseStartOf(loft4, today), 'fr')), 'Bail au 16 décembre');
  assert.equal(sp(O.leaseStartLabel(O.leaseStartOf(loft4, today), 'en')), 'Lease from 16 December');
  const free = { availability: 'available', available_from: null };
  assert.equal(O.leaseStartLabel(O.leaseStartOf(free, today), 'fr'), 'Bail dans les 7 jours suivant la signature');
  assert.equal(O.leaseStartLabel(O.leaseStartOf(free, today), 'en'), 'Lease within 7 days of signing');
  // Date du jour ou passée (état pas encore mis à jour) : traitée comme une chambre libre (décision du 12/10).
  assert.deepEqual(O.leaseStartOf({ availability: 'occupied', available_from: '2026-10-15' }, today), { kind: 'within' });
  assert.deepEqual(O.leaseStartOf({ availability: 'occupied', available_from: '2026-10-01' }, today), { kind: 'within' });
  assert.deepEqual(O.leaseStartOf({ availability: 'occupied', available_from: '2026-10-16' }, today), { kind: 'date', iso: '2026-10-16' });
  // « Ta première année » (décision n° 4 proposée) : la date comme l'hiver, sinon « Libre maintenant » — jamais « 7 jours ».
  const day = '2026-11-26';
  assert.equal(sp(O.firstYearLeaseStartLabel(O.leaseStartOf(loft4, day), 'fr')), 'Bail au 16 décembre');
  assert.equal(sp(O.firstYearLeaseStartLabel(O.leaseStartOf(loft4, day), 'en')), 'Lease from 16 December');
  assert.equal(O.firstYearLeaseStartLabel(O.leaseStartOf(free, day), 'fr'), 'Libre maintenant');
  assert.equal(O.firstYearLeaseStartLabel(O.leaseStartOf(free, day), 'en'), 'Available now');
  assert.equal(O.firstYearLeaseStartLabel(O.leaseStartOf({ availability: 'occupied', available_from: '2026-11-20' }, day), 'fr'), 'Libre maintenant');
});

test('offer.ts : chambres concernées = libres maintenant ou avec une date de libération connue (ch. 4 du Loft incluse)', () => {
  const rooms = [
    { house_slug: 'lavilla', room_number: 8, availability: 'available', available_from: null },
    { house_slug: 'lelodge', room_number: 7, availability: 'occupied', available_from: '2026-10-30' },
    { house_slug: 'lelodge', room_number: 1, availability: 'occupied', available_from: '2026-11-01' },
    { house_slug: 'lelodge', room_number: 2, availability: 'occupied', available_from: '2026-11-30' },
    { house_slug: 'leloft', room_number: 4, availability: 'occupied', available_from: '2026-12-16' },
    { house_slug: 'leloft', room_number: 5, availability: 'occupied', available_from: null },
  ];
  assert.deepEqual(rooms.filter(O.isOfferRoom).map((r) => `${r.house_slug}:${r.room_number}`), ['lavilla:8', 'lelodge:7', 'lelodge:1', 'lelodge:2', 'leloft:4']);
});

test('offer.ts : mesure GA4 — `offer` = l\'offre EN COURS au moment de l\'événement, « none » hors offre', () => {
  const calls = [];
  const realNow = Date.now;
  globalThis.window = { gtag: (...args) => calls.push(args) };
  try {
    for (const [t, want] of [[AT.hiverLast, 'hiver'], [AT.switch1, 'premiere-annee'], [AT.end1, 'none']]) {
      Date.now = () => t;
      calls.length = 0;
      O.trackOfferCta('landing', { language: 'fr' });
      O.trackOfferSectionView('rooms', { language: 'en' });
      assert.deepEqual(calls[0], ['event', 'offer_cta_click', { offer: want, placement: 'landing', language: 'fr' }]);
      assert.deepEqual(calls[1], ['event', 'offer_section_view', { offer: want, section: 'rooms', language: 'en' }]);
    }
  } finally {
    Date.now = realNow;
    delete globalThis.window;
  }
});

test('index.html #lvc-offer : existe, ES5 sans marqueur de commentaire HTML, synchronisé avec offer.ts (fenêtres, clés, pages)', () => {
  assert.ok(SCRIPT, 'script #lvc-offer introuvable');
  assert.ok(!SCRIPT.includes('<!--') && !SCRIPT.includes('-->'));
  assert.doesNotMatch(SCRIPT, /\b(let|const)\b|=>|`/, 'ES5 seulement');
  const windows = [...SCRIPT.matchAll(/\["([^"]+)", "([^"]+)", "([^"]+)"\]/g)].map((m) => ({ startMs: Date.parse(m[1]), endExclusiveMs: Date.parse(m[2]), dismissKey: m[3] }));
  assert.deepEqual(windows, O.OFFER_WINDOWS.map(({ startMs, endExclusiveMs, dismissKey }) => ({ startMs, endExclusiveMs, dismissKey })));
  const days = Number(/var DAYS = (\d+) \* 864e5/.exec(SCRIPT)?.[1]);
  assert.equal(days * DAY, O.OFFER_BANNER_DISMISS_MS);
  const paths = /\^\\\/\(([a-z|-]+)\)\$/.exec(SCRIPT)?.[1].split('|').sort();
  assert.deepEqual(paths, O.OFFER_BANNER_PATHS.filter((p) => p !== '/').map((p) => p.slice(1)).sort());
});

test('index.html #lvc-offer : classe posée sur les pages du bandeau, FR et EN, pendant chaque offre', () => {
  for (const now of [DURING, AT.switch1]) {
    for (const url of ['/', '/en', '/en/', '/tarifs', '/en/tarifs', '/chambres-disponibles', '/lavilla', '/en/lelodge', '/annemasse-colocation/', '/colocation-geneve?utm_source=facebook']) {
      assert.equal(run(url, { now }), true, `${url} @ ${new Date(now).toISOString()}`);
    }
    for (const url of ['/candidature', '/en/candidature?offre=hiver', '/offre-hiver', '/en/winter-offer', '/blog', '/blog/vivre-a-annemasse', '/nos-maisons', '/services', '/mentions-legales', '/portail', '/entarifs', '/en/tarifs/x']) {
      assert.equal(run(url, { now }), false, `${url} @ ${new Date(now).toISOString()}`);
    }
  }
});

test('index.html #lvc-offer : fermé depuis moins de 7 jours → masqué ; plus de 7 jours → visible ; stockage en panne → visible', () => {
  const key = O.OFFER_BANNER_DISMISS_KEY;
  assert.equal(run('/tarifs', { local: new MemoryStorage({ [key]: String(DURING - 6 * DAY) }) }), false);
  assert.equal(run('/tarifs', { local: new MemoryStorage({ [key]: String(DURING - 8 * DAY) }) }), true);
  assert.equal(run('/tarifs', { local: new MemoryStorage({ [key]: 'abc' }) }), true);
  assert.equal(run('/tarifs', { storageThrows: true }), true);
  assert.equal(run('/tarifs', { now: AT.switch1, storageThrows: true }), true);
});

test('index.html #lvc-offer : bascule à 0 h — 25/11 23 h 59, 26/11 0 h 00 / 0 h 01, 31/12 23 h 59, 01/01/2027 0 h 01, avec et sans fermeture', () => {
  const H = O.OFFER_BANNER_DISMISS_KEY;
  const F = O.FIRST_YEAR_BANNER_DISMISS_KEY;
  const closed = (key, at) => new MemoryStorage({ [key]: String(at) });
  // Sans fermeture : visible pendant chaque offre, jamais avant ni après.
  assert.equal(run('/', { now: AT.before }), false);
  assert.equal(run('/', { now: AT.hiverStart }), true);
  assert.equal(run('/', { now: AT.hiverLast }), true);
  assert.equal(run('/', { now: AT.switch }), true);
  assert.equal(run('/', { now: AT.switch1 }), true);
  assert.equal(run('/', { now: AT.firstYearLast }), true);
  assert.equal(run('/', { now: AT.end }), false);
  assert.equal(run('/', { now: AT.end1 }), false);
  assert.equal(run('/chambres-disponibles', { now: DURING + 95 * DAY }), false); // horloge décalée de la garde d'hydratation
  // Bandeau d'hiver fermé le 25/11 à 22 h : masqué à 23 h 59, mais le NOUVEAU bandeau s'affiche à 0 h 00 / 0 h 01 (autre clé).
  const hiverClosed = closed(H, Date.parse('2026-11-25T22:00:00+01:00'));
  assert.equal(run('/', { now: AT.hiverLast, local: hiverClosed }), false);
  assert.equal(run('/', { now: AT.switch, local: hiverClosed }), true);
  assert.equal(run('/', { now: AT.switch1, local: hiverClosed }), true);
  // La clé de la nouvelle offre ne masque pas l'hiver.
  assert.equal(run('/', { now: AT.hiverLast, local: closed(F, AT.hiverLast - 60_000) }), true);
  // Nouveau bandeau fermé : masqué 7 jours, puis de retour ; plus rien le 01/01/2027.
  assert.equal(run('/', { now: AT.switch1, local: closed(F, AT.switch + 30_000) }), false);
  assert.equal(run('/', { now: AT.firstYearLast, local: closed(F, AT.firstYearLast - 6 * DAY) }), false);
  assert.equal(run('/', { now: AT.firstYearLast, local: closed(F, AT.firstYearLast - 8 * DAY) }), true);
  assert.equal(run('/', { now: AT.end1, local: closed(F, AT.end1 - 8 * DAY) }), false);
  assert.equal(run('/', { now: AT.end1, local: hiverClosed }), false);
  assert.equal(run('/en/tarifs', { now: AT.switch1, local: hiverClosed }), true);
  assert.equal(run('/en/tarifs', { now: AT.end1 }), false);
});

test('attribution.ts : offres connues = celles d\'offer.ts ; `?offre=` mémorisé pour la session (valeur brute), inconnue ignorée', () => {
  assert.deepEqual([...A.KNOWN_OFFERS], [...O.KNOWN_OFFER_IDS]);
  const open = (search) => {
    globalThis.window = { sessionStorage: new MemoryStorage(), localStorage: new MemoryStorage(), location: { search, pathname: '/candidature' } };
    globalThis.document = { referrer: '' };
  };
  open('?offre=hiver&property_interest=lelodge');
  assert.equal(A.captureOffer(), 'hiver');
  assert.equal(A.storedOffer(), 'hiver');
  assert.equal(window.sessionStorage.getItem(A.OFFER_STORAGE_KEY), 'hiver');
  // navigation SPA sans le paramètre : l'offre reste
  assert.equal(A.captureOffer('?property_interest=lavilla'), '');
  assert.equal(A.storedOffer(), 'hiver');
  // la nouvelle offre : mémorisée telle quelle (le formulaire la ramène à l'offre en cours, normalizeOffer)
  open('?offre=premiere-annee');
  assert.equal(A.captureOffer(), 'premiere-annee');
  assert.equal(A.storedOffer(), 'premiere-annee');
  assert.equal(O.normalizeOffer(A.storedOffer(), DURING), 'hiver');
  assert.equal(O.normalizeOffer(A.storedOffer(), AT.switch1), 'premiere-annee');
  open('?offre=xyz');
  assert.equal(A.captureOffer(), '');
  assert.equal(A.storedOffer(), '');
  assert.equal(window.sessionStorage.getItem(A.OFFER_STORAGE_KEY), null);
  open('?offre=constructor');
  assert.equal(A.captureOffer(), '');
  open('');
  assert.equal(A.markOffer('hiver'), 'hiver');
  assert.equal(A.storedOffer(), 'hiver');
  assert.equal(A.markOffer('premiere-annee'), 'premiere-annee');
  assert.equal(A.storedOffer(), 'premiere-annee');
  // valeur corrompue en stockage : ignorée
  window.sessionStorage.setItem(A.OFFER_STORAGE_KEY, 'autre');
  assert.equal(A.storedOffer(), '');
  delete globalThis.window;
  delete globalThis.document;
});
