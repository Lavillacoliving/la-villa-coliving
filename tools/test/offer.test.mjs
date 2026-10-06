// Offre « Pose tes valises avant l'hiver » (brief Jérôme du 06/10/2026).
// 1. src/data/offer.ts (sans import, chargé tel quel par Node 24) : dates, filtre des chambres, remise.
// 2. Le script inline #lvc-offer d'index.html (bandeau avant la première peinture) doit rester
//    identique à offer.ts : fin de l'offre, pages du bandeau, clé et durée de fermeture.
// 3. src/lib/attribution.ts : `?offre=hiver` mémorisé pour la session, valeur inconnue ignorée.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import * as O from '../../src/data/offer.ts';
import * as A from '../../src/lib/attribution.ts';

const HTML = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
const SCRIPT = /<script id="lvc-offer">([\s\S]*?)<\/script>/.exec(HTML)?.[1];
const DAY = 864e5;
const DURING = Date.parse('2026-10-20T10:00:00+02:00');

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

test('offer.ts : dates, fin d\'offre (15/11 inclus, heure de Paris), remise', () => {
  assert.equal(O.OFFER_START, '2026-10-07');
  assert.equal(O.OFFER_END, '2026-11-15');
  assert.equal(O.MOVE_IN_DEADLINE, '2026-11-30');
  assert.equal(O.isOfferActive(Date.parse('2026-11-15T23:30:00+01:00')), true);
  assert.equal(O.isOfferActive(Date.parse('2026-11-16T00:00:00+01:00')), false);
  assert.equal(O.isOfferActive(DURING), true);
  assert.equal(O.discountedFirstMonth(1370), 959);
  assert.equal(O.discountedFirstMonth(1430), 1001);
  assert.equal(O.formatOfferDate('2026-11-15', 'fr'), '15 novembre');
  assert.equal(O.formatOfferDate('2026-12-01', 'fr'), '1ᵉʳ décembre');
  assert.equal(O.formatOfferDate('2026-12-01', 'en'), '1 December');
});

test('offer.ts : chambres concernées = libres maintenant ou libérées au plus tard le 30/11 (ch. 4 du Loft exclue)', () => {
  const rooms = [
    { house_slug: 'lavilla', room_number: 8, availability: 'available', available_from: null },
    { house_slug: 'lelodge', room_number: 7, availability: 'occupied', available_from: '2026-10-30' },
    { house_slug: 'lelodge', room_number: 1, availability: 'occupied', available_from: '2026-11-01' },
    { house_slug: 'lelodge', room_number: 2, availability: 'occupied', available_from: '2026-11-30' },
    { house_slug: 'leloft', room_number: 4, availability: 'occupied', available_from: '2026-12-16' },
    { house_slug: 'leloft', room_number: 5, availability: 'occupied', available_from: null },
  ];
  assert.deepEqual(rooms.filter(O.isOfferRoom).map((r) => `${r.house_slug}:${r.room_number}`), ['lavilla:8', 'lelodge:7', 'lelodge:1', 'lelodge:2']);
});

test('offer.ts : normalisation du paramètre et pages du bandeau', () => {
  assert.equal(O.normalizeOffer('hiver'), 'hiver');
  assert.equal(O.normalizeOffer(' Hiver '), 'hiver');
  for (const v of ['xyz', 'constructor', '', null, undefined, 'hiver2']) assert.equal(O.normalizeOffer(v), '', String(v));
  for (const p of ['/', '/en', '/en/', '/tarifs', '/en/tarifs', '/chambres-disponibles/', '/lavilla', '/en/lelodge']) assert.equal(O.isOfferBannerPath(p), true, p);
  for (const p of ['/candidature', '/en/candidature', '/blog', '/blog/x', '/offre-hiver', '/en/winter-offer', '/mentions-legales', '/nos-maisons', '/services', '/faq', '/entarifs']) assert.equal(O.isOfferBannerPath(p), false, p);
});

test('index.html #lvc-offer : existe, ES5 sans marqueur de commentaire HTML, synchronisé avec offer.ts', () => {
  assert.ok(SCRIPT, 'script #lvc-offer introuvable');
  assert.ok(!SCRIPT.includes('<!--') && !SCRIPT.includes('-->'));
  const end = /Date\.parse\("([^"]+)"\)/.exec(SCRIPT)?.[1];
  assert.equal(Date.parse(end), O.OFFER_END_EXCLUSIVE_MS, 'fin de l\'offre différente de OFFER_END_EXCLUSIVE_MS');
  assert.equal(/var KEY = "([^"]+)"/.exec(SCRIPT)?.[1], O.OFFER_BANNER_DISMISS_KEY);
  const days = Number(/var DAYS = (\d+) \* 864e5/.exec(SCRIPT)?.[1]);
  assert.equal(days * DAY, O.OFFER_BANNER_DISMISS_MS);
  const paths = /\^\\\/\(([a-z|-]+)\)\$/.exec(SCRIPT)?.[1].split('|').sort();
  assert.deepEqual(paths, O.OFFER_BANNER_PATHS.filter((p) => p !== '/').map((p) => p.slice(1)).sort());
});

test('index.html #lvc-offer : classe posée sur les pages du bandeau, FR et EN, pendant l\'offre', () => {
  for (const url of ['/', '/en', '/en/', '/tarifs', '/en/tarifs', '/chambres-disponibles', '/lavilla', '/en/lelodge', '/annemasse-colocation/', '/colocation-geneve?utm_source=facebook']) {
    assert.equal(run(url), true, url);
  }
  for (const url of ['/candidature', '/en/candidature?offre=hiver', '/offre-hiver', '/en/winter-offer', '/blog', '/blog/vivre-a-annemasse', '/nos-maisons', '/services', '/mentions-legales', '/portail', '/entarifs', '/en/tarifs/x']) {
    assert.equal(run(url), false, url);
  }
});

test('index.html #lvc-offer : fermé depuis moins de 7 jours → masqué ; plus de 7 jours → visible ; stockage en panne → visible', () => {
  const key = O.OFFER_BANNER_DISMISS_KEY;
  assert.equal(run('/tarifs', { local: new MemoryStorage({ [key]: String(DURING - 6 * DAY) }) }), false);
  assert.equal(run('/tarifs', { local: new MemoryStorage({ [key]: String(DURING - 8 * DAY) }) }), true);
  assert.equal(run('/tarifs', { local: new MemoryStorage({ [key]: 'abc' }) }), true);
  assert.equal(run('/tarifs', { storageThrows: true }), true);
});

test('index.html #lvc-offer : plus jamais après la fin de l\'offre (15/11 inclus)', () => {
  assert.equal(run('/', { now: Date.parse('2026-11-15T23:59:00+01:00') }), true);
  assert.equal(run('/', { now: Date.parse('2026-11-16T00:00:01+01:00') }), false);
  assert.equal(run('/chambres-disponibles', { now: DURING + 95 * DAY }), false); // horloge décalée de la garde d'hydratation
});

test('attribution.ts : ?offre=hiver mémorisé pour la session, valeur inconnue ignorée, jamais écrite', () => {
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
  open('?offre=xyz');
  assert.equal(A.captureOffer(), '');
  assert.equal(A.storedOffer(), '');
  assert.equal(window.sessionStorage.getItem(A.OFFER_STORAGE_KEY), null);
  open('?offre=constructor');
  assert.equal(A.captureOffer(), '');
  open('');
  assert.equal(A.markOffer('hiver'), 'hiver');
  assert.equal(A.storedOffer(), 'hiver');
  // valeur corrompue en stockage : ignorée
  window.sessionStorage.setItem(A.OFFER_STORAGE_KEY, 'autre');
  assert.equal(A.storedOffer(), '');
});
