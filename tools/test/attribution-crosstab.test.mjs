// Première touche entre onglets (Lot C.4 du brief « Formulaire, hydratation, mesure », GO Jérôme
// du 30/09/2026). On importe directement src/lib/attribution.ts (Node 24 retire les types) et on
// simule des onglets : chaque onglet a son sessionStorage, tous partagent le même localStorage.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as A from '../../src/lib/attribution.ts';

class MemoryStorage {
  constructor() { this.map = new Map(); }
  getItem(k) { return this.map.has(k) ? this.map.get(k) : null; }
  setItem(k, v) { this.map.set(k, String(v)); }
  removeItem(k) { this.map.delete(k); }
}

const MIN = 60 * 1000;
const T0 = Date.parse('2026-10-01T08:00:00Z');

/** Ouvre un onglet (sessionStorage neuf) sur `url`, avec le localStorage partagé `local`. */
function openTab(url, { local, referrer = '' }) {
  const u = new URL(url, 'https://www.lavillacoliving.com');
  globalThis.window = { sessionStorage: new MemoryStorage(), localStorage: local, location: { search: u.search, pathname: u.pathname } };
  globalThis.document = { referrer };
  return globalThis.window;
}

/** Ce que fait main.tsx au chargement, dans cet ordre. */
function boot(now) {
  A.seedFromMirror(window.location.search, now);
  A.captureAttribution();
  A.captureTestFlag();
  A.captureLanding();
  A.captureInternalRef();
  A.touchMirror(now);
}

test('onglet unique : comportement inchangé (Ads + page d\'atterrissage)', () => {
  const local = new MemoryStorage();
  openTab('/blog/guide?utm_source=google&utm_medium=cpc&gclid=abc', { local, referrer: 'https://www.google.com/search?q=x' });
  boot(T0);
  assert.deepEqual(A.attributionPayload(), { utm_source: 'google', utm_medium: 'cpc', gclid: 'abc' });
  assert.deepEqual(A.landingPayload(), { landing_page: '/blog/guide', referrer: 'https://www.google.com/search' });
});

test('nouvel onglet dans les 30 min : reprend la page d\'atterrissage et la première touche', () => {
  const local = new MemoryStorage();
  openTab('/en/blog/guide?gclid=abc', { local, referrer: 'https://www.google.com/' });
  boot(T0);
  openTab('/en/candidature', { local });
  boot(T0 + 10 * MIN);
  assert.deepEqual(A.landingPayload(), { landing_page: '/en/blog/guide', referrer: 'https://www.google.com/' });
  assert.equal(A.attributionPayload().gclid, 'abc');
});

test('nouvel onglet après 30 min d\'inactivité : nouvelle visite, rien n\'est repris', () => {
  const local = new MemoryStorage();
  openTab('/blog/guide?gclid=abc', { local });
  boot(T0);
  openTab('/candidature', { local });
  boot(T0 + 31 * MIN);
  assert.deepEqual(A.landingPayload(), { landing_page: '/candidature' });
  assert.deepEqual(A.attributionPayload(), {});
});

test('expiration glissante : une navigation SPA repousse l\'échéance', () => {
  const local = new MemoryStorage();
  openTab('/blog/guide', { local });
  boot(T0);
  A.touchMirror(T0 + 25 * MIN); // navigation interne (InternalRefCapture)
  openTab('/candidature', { local });
  boot(T0 + 50 * MIN);
  assert.equal(A.landingPayload().landing_page, '/blog/guide');
});

test('revenant J+3 : compté comme une nouvelle visite (biais conservateur conservé)', () => {
  const local = new MemoryStorage();
  openTab('/?gclid=abc', { local });
  boot(T0);
  openTab('/candidature', { local });
  boot(T0 + 3 * 24 * 60 * MIN);
  assert.deepEqual(A.attributionPayload(), {});
});

test('nouvel onglet arrivé avec son propre gclid / utm : jamais amorcé', () => {
  const local = new MemoryStorage();
  openTab('/blog/guide?gclid=A', { local });
  boot(T0);
  openTab('/candidature?gclid=B', { local });
  boot(T0 + 5 * MIN);
  assert.equal(A.attributionPayload().gclid, 'B');
  assert.equal(A.landingPayload().landing_page, '/candidature');
});

test('porte interne dans le nouvel onglet : même règle que dans un onglet (première touche prioritaire)', () => {
  // visite organique (aucune attribution) → la porte interne écrit ses UTM virtuels
  let local = new MemoryStorage();
  openTab('/blog/guide', { local });
  boot(T0);
  openTab('/candidature?src=bloc_offre&article=guide&pos=end', { local });
  boot(T0 + 2 * MIN);
  assert.deepEqual(A.attributionPayload(), { utm_source: 'site', utm_medium: 'bloc_offre', utm_campaign: 'guide', utm_content: 'end' });
  assert.equal(A.landingPayload().landing_page, '/blog/guide');
  // visite Ads → la touche Ads reste prioritaire, comme dans un onglet unique
  local = new MemoryStorage();
  openTab('/?gclid=abc', { local });
  boot(T0);
  openTab('/candidature?src=bloc_offre&article=guide', { local });
  boot(T0 + 2 * MIN);
  assert.equal(A.attributionPayload().gclid, 'abc');
  assert.equal(A.attributionPayload().utm_medium, undefined);
});

test('le marqueur de test n\'est jamais transmis à un autre onglet', () => {
  const local = new MemoryStorage();
  openTab('/candidature?test=1', { local });
  boot(T0);
  assert.equal(A.isTestSession(), true);
  openTab('/candidature', { local });
  boot(T0 + MIN);
  assert.equal(A.isTestSession(), false);
});

test('onglet déjà amorcé (rechargement) : la copie ne réécrit rien', () => {
  const local = new MemoryStorage();
  openTab('/blog/a', { local });
  boot(T0);
  const tabB = openTab('/blog/b', { local });
  boot(T0 + MIN);
  // tabB est amorcé avec /blog/a ; un rechargement ne change rien
  tabB.location = { search: '', pathname: '/candidature' };
  boot(T0 + 2 * MIN);
  assert.equal(A.landingPayload().landing_page, '/blog/a');
});

test('stockages indisponibles : aucune exception, aucune reprise', () => {
  const throwing = {};
  Object.defineProperty(throwing, 'localStorage', { get() { throw new Error('SecurityError'); } });
  Object.defineProperty(throwing, 'sessionStorage', { get() { throw new Error('SecurityError'); } });
  throwing.location = { search: '', pathname: '/candidature' };
  globalThis.window = throwing;
  globalThis.document = { referrer: '' };
  assert.doesNotThrow(() => boot(T0));
  assert.equal(A.seedFromMirror('', T0), false);
  assert.deepEqual(A.landingPayload(), {});
});

test('copie datée dans le futur (horloge incohérente) : ignorée', () => {
  const local = new MemoryStorage();
  openTab('/blog/guide', { local });
  boot(T0 + 60 * MIN); // copie écrite « dans une heure »
  openTab('/candidature', { local });
  boot(T0);
  assert.equal(A.landingPayload().landing_page, '/candidature');
});
