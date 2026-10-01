// Garde analytics d'index.html (Lot C du brief « Formulaire, hydratation, mesure », 01/10/2026).
// Les deux scripts inline (#lvc-analytics puis #lvc-clarity) sont extraits d'index.html et exécutés
// dans un bac à sable node:vm avec un window/document/navigator/location simulés : on vérifie quels
// tags sont injectés (gtag.js, Clarity) et ce que reçoit dataLayer, scénario par scénario.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const HTML = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');

function inlineScript(id) {
  const m = new RegExp(`<script id="${id}"[^>]*>([\\s\\S]*?)</script>`).exec(HTML);
  assert.ok(m, `script #${id} introuvable dans index.html`);
  return m[1];
}
const ANALYTICS = inlineScript('lvc-analytics');
const CLARITY = inlineScript('lvc-clarity');

const BROWSER_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';

class MemoryStorage {
  constructor(entries = {}) { this.map = new Map(Object.entries(entries)); }
  getItem(k) { return this.map.has(k) ? this.map.get(k) : null; }
  setItem(k, v) { this.map.set(k, String(v)); }
  removeItem(k) { this.map.delete(k); }
}

/** Charge une « page » : exécute les deux scripts et renvoie ce qu'ils ont fait. */
function load({
  url = 'https://www.lavillacoliving.com/',
  ua = BROWSER_UA,
  webdriver = false,
  local = new MemoryStorage(),
  session = new MemoryStorage(),
  storageThrows = false,
} = {}) {
  const u = new URL(url);
  const injected = [];
  const fakeScript = () => ({ async: false, src: '' });
  const document = {
    head: { appendChild: (el) => injected.push(el.src) },
    createElement: fakeScript,
    getElementsByTagName: () => [{ parentNode: { insertBefore: (el) => injected.push(el.src) } }],
  };
  const window = {};
  if (storageThrows) {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('SecurityError'); } });
    Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('SecurityError'); } });
  } else {
    window.localStorage = local;
    window.sessionStorage = session;
  }
  window.location = { hostname: u.hostname, pathname: u.pathname, search: u.search };
  window.document = document;
  window.navigator = { userAgent: ua, webdriver };
  const context = vm.createContext({ window, document, navigator: window.navigator, location: window.location, Date });
  vm.runInContext(ANALYTICS, context);
  vm.runInContext(CLARITY, context);
  const configs = (window.dataLayer ?? []).map((args) => Array.from(args)).filter((a) => a[0] === 'config');
  // Les objets créés dans le bac à sable ont leur propre Object.prototype : on les normalise en JSON.
  const plain = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
  return {
    state: plain(window.__lvcAnalytics),
    ga: injected.some((s) => s.includes('googletagmanager.com/gtag/js?id=G-HW98R11W6M')),
    clarity: injected.some((s) => s.includes('clarity.ms/tag/')),
    config: plain(configs[0]?.[2]),
    configCount: configs.length,
    local,
    session,
  };
}

test('aucun marqueur de commentaire HTML dans les scripts (html-comments.mjs nettoie tout le <head>)', () => {
  for (const src of [ANALYTICS, CLARITY]) {
    assert.ok(!src.includes('<!--') && !src.includes('-->'));
  }
});

test('le tag statique gtag.js a disparu : GA4 n\'est chargé que par la garde', () => {
  assert.ok(!/<script[^>]+src="https:\/\/www\.googletagmanager\.com/.test(HTML));
});

test('visiteur humain en production : GA4 + Clarity, config sans paramètre', () => {
  const r = load();
  assert.equal(r.ga, true);
  assert.equal(r.clarity, true);
  assert.equal(r.configCount, 1);
  assert.deepEqual(r.config, {});
  assert.deepEqual(r.state, { ga: true, internal: false, bot: false, debug: false });
});

test('domaine nu : GA4 oui, Clarity non (garde historique www uniquement)', () => {
  const r = load({ url: 'https://lavillacoliving.com/candidature' });
  assert.equal(r.ga, true);
  assert.equal(r.clarity, false);
});

test('navigateur automatisé (navigator.webdriver) : rien, même avec un UA de navigateur', () => {
  const r = load({ webdriver: true });
  assert.equal(r.ga, false);
  assert.equal(r.clarity, false);
  assert.equal(r.configCount, 0);
  assert.equal(r.state.bot, true);
});

test('localhost et previews : rien (ex-« 800×600 / 390×844 / 1440×900 » de GA4)', () => {
  for (const url of ['http://localhost:3456/candidature', 'http://localhost:5173/', 'https://la-villa-coliving-git-x.vercel.app/']) {
    const r = load({ url });
    assert.equal(r.ga, false, url);
    assert.equal(r.clarity, false, url);
  }
});

test('espace résident / équipe : ni GA4 ni Clarity', () => {
  for (const p of ['/dashboard', '/dashboard/prospects', '/portail', '/mon-espace', '/reset-password', '/questionnaire-depart']) {
    const r = load({ url: `https://www.lavillacoliving.com${p}` });
    assert.equal(r.ga, false, p);
    assert.equal(r.clarity, false, p);
  }
});

test('?internal=1 : drapeau persistant, traffic_type internal, pas de Clarity ; ?internal=0 le retire', () => {
  const local = new MemoryStorage();
  let r = load({ url: 'https://www.lavillacoliving.com/?internal=1', local });
  assert.equal(local.getItem('lvc_internal'), '1');
  assert.equal(r.ga, true);
  assert.deepEqual(r.config, { traffic_type: 'internal' });
  assert.equal(r.clarity, false);
  // page suivante, sans paramètre : toujours interne
  r = load({ url: 'https://www.lavillacoliving.com/candidature', local });
  assert.deepEqual(r.config, { traffic_type: 'internal' });
  assert.equal(r.clarity, false);
  // retrait
  r = load({ url: 'https://www.lavillacoliving.com/?internal=0', local });
  assert.equal(local.getItem('lvc_internal'), null);
  assert.deepEqual(r.config, {});
  assert.equal(r.clarity, true);
});

test('drapeau posé par le dashboard (localStorage.lvc_internal) : interne sur le site public', () => {
  const r = load({ local: new MemoryStorage({ lvc_internal: '1' }) });
  assert.deepEqual(r.config, { traffic_type: 'internal' });
  assert.equal(r.clarity, false);
});

test('?test=1 et session de test : internes, sans drapeau persistant', () => {
  const local = new MemoryStorage();
  let r = load({ url: 'https://www.lavillacoliving.com/candidature?test=1', local });
  assert.deepEqual(r.config, { traffic_type: 'internal' });
  assert.equal(r.clarity, false);
  assert.equal(local.getItem('lvc_internal'), null);
  r = load({ session: new MemoryStorage({ lvc_test_session: '1' }) });
  assert.deepEqual(r.config, { traffic_type: 'internal' });
  assert.equal(r.clarity, false);
});

test('?ga_debug=1 : GA4 forcé (même en local ou automatisé), debug_mode + internal, mémorisé dans l\'onglet', () => {
  const session = new MemoryStorage();
  let r = load({ url: 'http://localhost:4173/candidature?ga_debug=1', webdriver: true, session });
  assert.equal(r.ga, true);
  assert.deepEqual(r.config, { traffic_type: 'internal', debug_mode: true });
  assert.equal(r.clarity, false);
  assert.equal(session.getItem('lvc_ga_debug'), '1');
  r = load({ url: 'http://localhost:4173/', webdriver: true, session });
  assert.equal(r.ga, true);
  r = load({ url: 'http://localhost:4173/?ga_debug=0', webdriver: true, session });
  assert.equal(r.ga, false);
  assert.equal(session.getItem('lvc_ga_debug'), null);
});

test('stockage bloqué (cookies refusés) : aucune exception, suivi normal', () => {
  const r = load({ storageThrows: true });
  assert.equal(r.ga, true);
  assert.equal(r.clarity, true);
});

test('?ga_debug=1 fonctionne même sans sessionStorage', () => {
  const r = load({ url: 'https://www.lavillacoliving.com/?ga_debug=1', storageThrows: true });
  assert.deepEqual(r.config, { traffic_type: 'internal', debug_mode: true });
});

const HUMANS = {
  'Safari iOS': BROWSER_UA,
  'Chrome Android': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36',
  'Samsung Internet': 'Mozilla/5.0 (Linux; Android 13; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/23.0 Chrome/115.0.0.0 Mobile Safari/537.36',
  'Firefox': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0',
  'Edge': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0',
  'Safari macOS': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15',
  'In-app Facebook': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/470.0.0.40.92;FBBV/123;FBDV/iPhone14,5;FBMD/iPhone;FBSN/iOS;FBSV/17.5;FBSS/3;FBID/phone;FBLC/fr_FR;FBOP/5]',
  'In-app Instagram': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 345.0.0.32.97 (iPhone14,5; iOS 17_5; fr_FR; fr; scale=3.00; 1170x2532; 123)',
  'Téléphone Cubot': 'Mozilla/5.0 (Linux; Android 10; CUBOT_X30 Build/QP1A.190711.020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  'Téléphone Cubot (2)': 'Mozilla/5.0 (Linux; Android 12; CUBOT P80) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Mobile Safari/537.36',
};

const ROBOTS = {
  Googlebot: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'Googlebot smartphone': 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.6668.100 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'Google-InspectionTool': 'Mozilla/5.0 (compatible; Google-InspectionTool/1.0;)',
  GoogleOther: 'GoogleOther',
  AdsBot: 'AdsBot-Google (+http://www.google.com/adsbot.html)',
  bingbot: 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
  GPTBot: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.1; +https://openai.com/gptbot)',
  'OAI-SearchBot': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot',
  'ChatGPT-User': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot',
  PerplexityBot: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)',
  ClaudeBot: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)',
  AhrefsBot: 'Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)',
  Applebot: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15 (Applebot/0.1; +http://www.apple.com/go/applebot)',
  Bytespider: 'Mozilla/5.0 (Linux; Android 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; Bytespider; spider-feedback@bytedance.com)',
  facebookexternalhit: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
  HeadlessChrome: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/131.0.0.0 Safari/537.36',
  Lighthouse: 'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36 Chrome-Lighthouse',
};

test('vrais navigateurs (dont in-app et téléphones Cubot) : jamais pris pour des robots', () => {
  for (const [name, ua] of Object.entries(HUMANS)) {
    const r = load({ ua });
    assert.equal(r.state.bot, false, name);
    assert.equal(r.ga, true, name);
  }
});

test('robots déclarés (moteurs, assistants IA, outils) : pas d\'analytics — le contenu, lui, reste servi', () => {
  for (const [name, ua] of Object.entries(ROBOTS)) {
    const r = load({ ua });
    assert.equal(r.state.bot, true, name);
    assert.equal(r.ga, false, name);
    assert.equal(r.clarity, false, name);
  }
});
