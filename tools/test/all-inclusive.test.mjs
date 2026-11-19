// Ligne « tout compris » des cartes chambres (décisions de Jérôme des 12 et 13/11/2026).
// 1. src/data/allInclusive.ts (aucun import à l'exécution, chargé tel quel par Node) : textes validés, parité FR/EN,
//    sélection de la gamme, ce que chaque variante de carte affiche, lien vers /tarifs, événement GA4.
// 2. Deux gammes, jamais fondues : aucune ligne de L'Appart ne parle de piscine, de sauna ni de salle de sport, et
//    aucune carte de L'Appart ne reçoit la ligne des maisons ni le lien. Aucune carte L'Appart n'existe encore sur le
//    site : ces tests sont la preuve du comportement.
// 3. Les consommateurs (RoomCard, pages maisons, page des tarifs) lisent bien la source unique.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import * as AI from '../../src/data/allInclusive.ts';
import { localizePath } from '../../src/lib/localizedPath.ts';
import { forbiddenIssues, visibleText } from '../../scripts/check-entity-facts.mjs';

const read = (rel) => readFileSync(new URL(`../../${rel}`, import.meta.url), 'utf8');
const NBSP = String.fromCharCode(0xa0);
const plain = (s) => s.split(NBSP).join(' ');
const LANGS = ['fr', 'en'];
const GAMMES = ['maisons', 'appart'];
const LENGTHS = ['long', 'short'];
const VARIANTS = ['default', 'featured', 'compact'];
const MAISONS = ['lavilla', 'leloft', 'lelodge'];
/** Équipements propres aux maisons : interdits dans toute ligne de L'Appart. `\s` couvre l'espace insécable. */
const MAISONS_ONLY = /piscine|sauna|salle\s+de\s+sport|chalet\s+fitness|jacuzzi|\bpool\b|\bgym\b/i;
/** Fichiers .ts / .tsx d'un dossier du dépôt, chemins relatifs à la racine. */
function sourceFiles(dir) {
  return readdirSync(new URL(`../../${dir}/`, import.meta.url), { withFileTypes: true }).flatMap((entry) => {
    const rel = `${dir}/${entry.name}`;
    if (entry.isDirectory()) return sourceFiles(rel);
    return /\.tsx?$/.test(entry.name) ? [rel] : [];
  });
}
/** Code sans ses commentaires (les commentaires peuvent nommer ce que le code ne doit pas écrire en dur). */
const stripComments = (src) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

test('textes validés, au caractère près (espaces insécables mises à part)', () => {
  const L = AI.ALL_INCLUSIVE_LINE;
  assert.equal(plain(L.maisons.long.fr), 'Tout compris : charges, fibre, ménage des communs, piscine, sauna et salle de sport. 0 frais de dossier.');
  assert.equal(plain(L.maisons.long.en), 'All-inclusive: bills, fibre, cleaning of the shared areas, pool, sauna and gym. No application fee.');
  assert.equal(plain(L.maisons.short.fr), 'Tout compris · piscine · sauna · salle de sport');
  assert.equal(plain(L.maisons.short.en), 'All-inclusive · pool · sauna · gym');
  assert.equal(plain(L.appart.long.fr), 'Tout compris : charges, fibre, streaming et ménage des communs chaque semaine, accès aux cours de yoga et de sport des maisons. 0 frais de dossier.');
  assert.equal(plain(L.appart.long.en), "All-inclusive: bills, fibre, streaming and weekly cleaning of the shared areas, plus access to the houses' yoga and fitness classes. No application fee.");
  assert.equal(plain(L.appart.short.fr), 'Tout compris · fibre · streaming');
  assert.equal(plain(L.appart.short.en), 'All-inclusive · fibre · streaming');
  assert.deepEqual(AI.PRICE_INCLUDES_LINK.label, { fr: 'Ce que comprend le prix', en: 'What the price includes' });
});

test('parité FR/EN : mêmes gammes, mêmes longueurs, même structure dans les deux langues', () => {
  assert.deepEqual(Object.keys(AI.ALL_INCLUSIVE_LINE).sort(), [...GAMMES].sort());
  for (const gamme of GAMMES) {
    assert.deepEqual(Object.keys(AI.ALL_INCLUSIVE_LINE[gamme]).sort(), [...LENGTHS].sort(), gamme);
    for (const length of LENGTHS) {
      const pair = AI.ALL_INCLUSIVE_LINE[gamme][length];
      assert.deepEqual(Object.keys(pair).sort(), [...LANGS].sort(), `${gamme}.${length}`);
      for (const lang of LANGS) {
        assert.ok(pair[lang].trim().length > 0, `${gamme}.${length}.${lang} : texte vide`);
        assert.equal(pair[lang], pair[lang].trim(), `${gamme}.${length}.${lang} : espace en bord de chaîne`);
        assert.doesNotMatch(pair[lang], /\n|\s{2}/, `${gamme}.${length}.${lang} : une seule ligne, jamais deux blancs de suite`);
      }
      assert.match(plain(pair.fr), /^Tout compris/, `${gamme}.${length}.fr`);
      assert.match(plain(pair.en), /^All-inclusive/, `${gamme}.${length}.en`);
      // Même nombre d'éléments dans les deux langues : points médians de la version courte, virgules de la longue.
      assert.equal(pair.fr.split('·').length, pair.en.split('·').length, `${gamme}.${length} : points médians`);
      assert.equal(pair.fr.split(',').length, pair.en.split(',').length, `${gamme}.${length} : virgules`);
    }
    // La version longue finit par l'absence de frais de dossier, dans les deux langues.
    assert.match(plain(AI.ALL_INCLUSIVE_LINE[gamme].long.fr), /\. 0 frais de dossier\.$/, gamme);
    assert.match(AI.ALL_INCLUSIVE_LINE[gamme].long.en, /\. No application fee\.$/, gamme);
    // « ménage des communs » : jamais « ménage » seul, qui laisserait croire au ménage des chambres.
    assert.match(AI.ALL_INCLUSIVE_LINE[gamme].long.fr, /ménage des communs/, gamme);
    assert.match(AI.ALL_INCLUSIVE_LINE[gamme].long.en, /cleaning of the shared areas/, gamme);
  }
  // Mêmes équipements des deux côtés.
  for (const length of LENGTHS) {
    const { fr, en } = AI.ALL_INCLUSIVE_LINE.maisons[length];
    for (const [f, e] of [[/piscine/, /\bpool\b/], [/sauna/, /sauna/], [/salle de sport/, /\bgym\b/]]) {
      assert.match(plain(fr), f, `maisons.${length}.fr`);
      assert.match(plain(en), e, `maisons.${length}.en`);
    }
    const appart = AI.ALL_INCLUSIVE_LINE.appart[length];
    for (const word of [/fibre/, /streaming/]) {
      assert.match(appart.fr, word, `appart.${length}.fr`);
      assert.match(appart.en, word, `appart.${length}.en`);
    }
  }
});

test('règles du site : ni prix, ni devise, ni minute, ni vouvoiement dans les lignes', () => {
  for (const gamme of GAMMES) for (const length of LENGTHS) for (const lang of LANGS) {
    const s = AI.ALL_INCLUSIVE_LINE[gamme][length][lang];
    assert.doesNotMatch(s, /CHF|€|EUR/, `${gamme}.${length}.${lang} : devise`);
    assert.doesNotMatch(s, /\d{2,}/, `${gamme}.${length}.${lang} : nombre (le seul chiffre admis est « 0 frais de dossier »)`);
    assert.doesNotMatch(s, /\bmin\b|minute/i, `${gamme}.${length}.${lang} : minute`);
    if (lang === 'fr') assert.doesNotMatch(s, /\b(vous|votre|vos)\b/i, `${gamme}.${length}.fr : vouvoiement`);
  }
});

test('garde check:facts : aucune règle interdite ne se déclenche sur les lignes ni sur le libellé du lien', () => {
  // La garde lit le HTML prérendu de toutes les pages : les lignes des cartes y passent comme n'importe quel texte.
  for (const gamme of GAMMES) for (const length of LENGTHS) for (const lang of LANGS) {
    const line = AI.ALL_INCLUSIVE_LINE[gamme][length][lang];
    // Tel que le prérendu l'écrit : l'espace insécable devient l'entité &nbsp;.
    const html = `<main><p>${line.split(NBSP).join('&nbsp;')}</p><p><a href="/tarifs#objection-prix">${AI.PRICE_INCLUDES_LINK.label[lang]}</a></p></main>`;
    assert.deepEqual(forbiddenIssues(html, visibleText(html), lang === 'en' ? 'en-chambres-disponibles.html' : 'chambres-disponibles.html'), [], `${gamme}.${length}.${lang}`);
  }
  // La garde voit bien un texte interdit : le contrôle ci-dessus ne passe pas à vide.
  const bad = '<main><p>Tout compris : ménage 2 fois par semaine.</p></main>';
  assert.ok(forbiddenIssues(bad, visibleText(bad), 'chambres-disponibles.html').length > 0);
});

test('espaces insécables : « 0 frais » en version longue ; en version courte, la ligne ne se coupe qu\'après un point médian', () => {
  for (const gamme of GAMMES) {
    // Lignes longues : une seule espace insécable en français (« 0 frais »), aucune en anglais.
    assert.ok(AI.ALL_INCLUSIVE_LINE[gamme].long.fr.includes(`0${NBSP}frais de dossier`), `${gamme}.long.fr`);
    assert.equal(AI.ALL_INCLUSIVE_LINE[gamme].long.fr.split(NBSP).length - 1, 1, `${gamme}.long.fr`);
    assert.equal(AI.ALL_INCLUSIVE_LINE[gamme].long.en.split(NBSP).length - 1, 0, `${gamme}.long.en`);
    for (const lang of LANGS) {
      const short = AI.ALL_INCLUSIVE_LINE[gamme].short[lang];
      const parts = short.split('·');
      const where = `${gamme}.short.${lang}`;
      assert.ok(parts.length >= 3, `${where} : au moins deux points médians`);
      // Jamais de coupure avant un point médian : une ligne ne commence pas par « · ».
      for (const part of parts.slice(0, -1)) assert.ok(part.endsWith(NBSP), `${where} : « ${plain(part)}· »`);
      // Jamais de coupure à l'intérieur d'un élément (« salle de sport », « Tout compris »).
      for (const part of parts) assert.ok(!part.trim().includes(' '), `${where} : « ${plain(part.trim())} »`);
      // Coupure possible après un point médian…
      for (const part of parts.slice(1, -1)) assert.ok(part.startsWith(' '), `${where} : « ·${plain(part)} »`);
      // … sauf après le dernier quand le dernier élément tient en un mot : il ne reste pas seul sur sa ligne.
      const last = parts.at(-1);
      const oneWord = !/\s/.test(last.trim());
      assert.ok(last.startsWith(oneWord ? NBSP : ' '), `${where} : espace après le dernier point médian`);
    }
  }
});

test("L'Appart : aucune mention de piscine, de sauna ni de salle de sport (pool, gym), dans aucune ligne", () => {
  for (const length of LENGTHS) for (const lang of LANGS) {
    assert.doesNotMatch(AI.ALL_INCLUSIVE_LINE.appart[length][lang], MAISONS_ONLY, `appart.${length}.${lang}`);
  }
  // Le motif attrape bien les lignes des maisons : le test ci-dessus ne passe pas à vide.
  for (const length of LENGTHS) for (const lang of LANGS) {
    assert.match(AI.ALL_INCLUSIVE_LINE.maisons[length][lang], MAISONS_ONLY, `maisons.${length}.${lang}`);
  }
});

test('gamme : les trois maisons, L\'Appart sous son nom public, rien pour un lieu inconnu', () => {
  for (const slug of MAISONS) assert.equal(AI.gammeOf(slug), 'maisons', slug);
  assert.equal(AI.APPART_HOUSE_SLUG, 'lappart');
  assert.equal(AI.gammeOf(AI.APPART_HOUSE_SLUG), 'appart');
  for (const unknown of ['', 'autre-lieu', 'LAPPART', 'lappart ', 'Lavilla', 'toString', 'constructor', '__proto__', 'hasOwnProperty', null, undefined, 4, {}]) {
    assert.equal(AI.gammeOf(unknown), null, String(unknown));
  }
});

test('gamme : chaque lieu du type HouseKey (src/lib/availability.ts) a une gamme', () => {
  const m = /export type HouseKey = ([^;]+);/.exec(read('src/lib/availability.ts'));
  assert.ok(m, 'type HouseKey introuvable');
  const keys = [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
  assert.ok(keys.length >= 3, `HouseKey : ${keys.join(', ')}`);
  for (const key of keys) assert.notEqual(AI.gammeOf(key), null, `« ${key} » n'a pas de gamme`);
  for (const slug of MAISONS) assert.ok(keys.includes(slug), slug);
});

test('cartes des maisons : ligne longue et lien sur featured et default, ligne courte sans lien sur compact', () => {
  for (const house of MAISONS) for (const lang of LANGS) {
    for (const variant of ['default', 'featured']) {
      const c = AI.cardInclusions({ house, roomHouse: house, variant, lang });
      assert.deepEqual(c, {
        gamme: 'maisons',
        line: AI.ALL_INCLUSIVE_LINE.maisons.long[lang],
        link: { to: '/tarifs#objection-prix', label: AI.PRICE_INCLUDES_LINK.label[lang] },
      }, `${house} ${variant} ${lang}`);
    }
    assert.deepEqual(
      AI.cardInclusions({ house, roomHouse: house, variant: 'compact', lang }),
      { gamme: 'maisons', line: AI.ALL_INCLUSIVE_LINE.maisons.short[lang], link: null },
      `${house} compact ${lang}`,
    );
  }
});

test("cartes de L'Appart : sa propre ligne, jamais le lien, quelle que soit la variante", () => {
  const house = AI.APPART_HOUSE_SLUG;
  for (const lang of LANGS) for (const variant of VARIANTS) {
    const c = AI.cardInclusions({ house, roomHouse: house, variant, lang });
    assert.deepEqual(c, {
      gamme: 'appart',
      line: AI.ALL_INCLUSIVE_LINE.appart[variant === 'compact' ? 'short' : 'long'][lang],
      link: null,
    }, `${variant} ${lang}`);
    assert.doesNotMatch(c.line, MAISONS_ONLY, `${variant} ${lang}`);
  }
});

test("jamais la ligne des maisons sur une chambre de L'Appart : toutes les combinaisons carte × chambre", () => {
  const places = [...MAISONS, AI.APPART_HOUSE_SLUG, 'autre-lieu', ''];
  const maisonsLines = new Set(LENGTHS.flatMap((length) => LANGS.map((lang) => AI.ALL_INCLUSIVE_LINE.maisons[length][lang])));
  let shown = 0;
  for (const house of places) for (const roomHouse of places) for (const variant of VARIANTS) for (const lang of LANGS) {
    const c = AI.cardInclusions({ house, roomHouse, variant, lang });
    const label = `carte ${house || '(vide)'} · chambre ${roomHouse || '(vide)'} · ${variant} · ${lang}`;
    const sameGamme = AI.gammeOf(house) !== null && AI.gammeOf(house) === AI.gammeOf(roomHouse);
    // Carte et chambre de gammes différentes, ou lieu inconnu : la carte n'affiche rien.
    if (!sameGamme) { assert.equal(c, null, label); continue; }
    shown += 1;
    assert.equal(c.gamme, AI.gammeOf(roomHouse), label);
    if (house === AI.APPART_HOUSE_SLUG || roomHouse === AI.APPART_HOUSE_SLUG) {
      assert.ok(!maisonsLines.has(c.line), label);
      assert.doesNotMatch(c.line, MAISONS_ONLY, label);
      assert.equal(c.link, null, label);
    }
    if (variant === 'compact') assert.equal(c.link, null, label);
  }
  // 3 × 3 combinaisons entre maisons + L'Appart avec lui-même, × 3 variantes × 2 langues.
  assert.equal(shown, (MAISONS.length * MAISONS.length + 1) * VARIANTS.length * LANGS.length);
});

test('lien : /tarifs#objection-prix en français, /en/tarifs#objection-prix en anglais', () => {
  assert.equal(AI.PRICE_INCLUDES_ANCHOR, 'objection-prix');
  assert.equal(AI.PRICE_INCLUDES_LINK.to, `/tarifs#${AI.PRICE_INCLUDES_ANCHOR}`);
  assert.equal(localizePath(AI.PRICE_INCLUDES_LINK.to, 'fr'), '/tarifs#objection-prix');
  assert.equal(localizePath(AI.PRICE_INCLUDES_LINK.to, 'en'), '/en/tarifs#objection-prix');
});

test('page des tarifs : la section porte l\'ancre de la source unique et sa marge de défilement, la page appelle l\'effet d\'arrivée', () => {
  const src = read('src/pages/RatesPageV4.tsx');
  assert.equal(src.split('id={PRICE_INCLUDES_ANCHOR}').length - 1, 1, 'id de la section');
  assert.doesNotMatch(stripComments(src), /id="objection-prix"/, 'ancre écrite en dur');
  const section = /<section className="([^"]*)" id=\{PRICE_INCLUDES_ANCHOR\}>/.exec(src);
  assert.ok(section, 'balise de la section');
  // La marge suit la hauteur de l'en-tête fixe : barre de 4rem + bandeau de l'offre (--lvc-banner-h, src/index.css).
  assert.match(section[1], /(^| )scroll-mt-\[calc\(4rem\+var\(--lvc-banner-h,0px\)\)\]( |$)/);
  assert.match(read('src/index.css'), /--lvc-banner-h:/);
  // Le composant de la page appelle bien l'effet d'arrivée sur l'ancre.
  assert.match(src, /export function RatesPageV4\(\) \{[\s\S]{0,200}?usePriceAnchorArrival\(\);/);
});

test('le défilement des autres pages ne change pas : ScrollToTop ne connaît ni ancre ni page des tarifs', () => {
  // Décision du 13/11/2026 : la correction de l'ancre vit dans la page des tarifs seulement. Si ScrollToTop apprend un
  // jour à respecter les ancres pour tout le site, retirer en même temps l'effet de RatesPageV4 et mettre ce test à jour.
  const src = read('src/components/ScrollToTop.tsx');
  assert.doesNotMatch(src, /hash|tarifs|allInclusive|scrollIntoView/);
  assert.match(src, /window\.scrollTo\(\{ top: 0, behavior: "instant" \}\)/);
});

test('événement price_why_click : { house, room_id, variant, page } et la langue, conventions des événements voisins', () => {
  assert.equal(AI.PRICE_WHY_EVENT, 'price_why_click');
  const click = { house: 'leloft', roomNumber: 5, variant: 'featured', page: 'chambres_disponibles', language: 'fr' };
  assert.deepEqual(AI.priceWhyClickParams(click), {
    house: 'leloft', room_id: 'chambre-5', variant: 'featured', page: 'chambres_disponibles', language: 'fr',
  });

  const saved = Object.getOwnPropertyDescriptor(globalThis, 'window');
  try {
    // Sans navigateur, ou si gtag échoue : jamais d'exception (la mesure ne bloque pas l'interface).
    delete globalThis.window;
    assert.doesNotThrow(() => AI.trackPriceWhyClick(click));
    globalThis.window = {};
    assert.doesNotThrow(() => AI.trackPriceWhyClick(click));
    globalThis.window = { gtag() { throw new Error('gtag en panne'); } };
    assert.doesNotThrow(() => AI.trackPriceWhyClick(click));
    // gtag présent : un seul appel, au format des autres événements.
    const calls = [];
    globalThis.window = { gtag: (...args) => calls.push(args) };
    AI.trackPriceWhyClick({ ...click, house: 'lelodge', roomNumber: 12, variant: 'default', page: 'offre_hiver', language: 'en' });
    assert.deepEqual(calls, [['event', 'price_why_click', {
      house: 'lelodge', room_id: 'chambre-12', variant: 'default', page: 'offre_hiver', language: 'en',
    }]]);
  } finally {
    if (saved) Object.defineProperty(globalThis, 'window', saved);
    else delete globalThis.window;
  }
});

test('RoomCard : la ligne et le lien viennent de la source unique, aucun équipement écrit en dur', () => {
  const src = read('src/components/RoomCard.tsx');
  const code = stripComments(src);
  assert.match(code, /cardInclusions\(\{ house, roomHouse: room\.house_slug, variant, lang: uiLang \}\)/);
  assert.doesNotMatch(code, MAISONS_ONLY, 'équipement des maisons écrit en dur dans la carte');
  // Sensible à la casse : « data-all-inclusive » est le nom de l'attribut, pas un texte.
  assert.doesNotMatch(code, /[Tt]out compris|All-inclusive|frais de dossier|application fee/, 'texte de la ligne écrit en dur');
  // La ligne : une fois par variante (featured, compact, default). Le lien : featured et default seulement.
  assert.equal(code.split('data-all-inclusive={inclusions.gamme}').length - 1, 3, 'ligne');
  assert.equal(code.split('data-price-why').length - 1, 2, 'lien');
  assert.equal(code.split('to={inclusions.link.to}').length - 1, 2, 'cible du lien');
  // Affichée par défaut ; la page parente peut la retirer.
  assert.match(code, /showInclusions = true/);
  assert.match(code, /const inclusions = showInclusions \? cardInclusions\(/);
});

test('RoomCard : pas de lien sur la carte compact', () => {
  const code = stripComments(read('src/components/RoomCard.tsx'));
  const start = code.indexOf('if (variant === "compact") {');
  assert.ok(start > 0, 'branche compact');
  // La branche compact se termine au `return (` de la carte par défaut, qui la suit.
  const end = code.indexOf('<div className="card-ultra', start);
  assert.ok(end > start, 'fin de la branche compact');
  const compact = code.slice(start, end);
  assert.equal(compact.split('data-all-inclusive').length - 1, 1, 'ligne courte');
  assert.doesNotMatch(compact, /data-price-why|inclusions\.link|onPriceWhyClick/);
});

/** Branches de RoomCard (code sans commentaires) : featured, compact, default — dans cet ordre dans le fichier. */
function roomCardBranches() {
  const code = stripComments(read('src/components/RoomCard.tsx'));
  const f = code.indexOf('if (variant === "featured") {');
  const c = code.indexOf('if (variant === "compact") {');
  const d = code.indexOf('<div className="card-ultra', c);
  assert.ok(f > 0 && c > f && d > c, 'branches featured, compact et default');
  return { code, featured: code.slice(f, c), compact: code.slice(c, d), default: code.slice(d) };
}
const count = (s, needle) => s.split(needle).length - 1;
/** Indice d'un motif, en échouant s'il manque (un ordre ne se vérifie pas sur un motif absent). */
function at(s, needle, label) {
  const i = s.indexOf(needle);
  assert.ok(i >= 0, `${label} : « ${needle} » introuvable`);
  return i;
}

test('RoomCard : chaque lien transmet le clic au parent avec sa propre variante (mesure price_why_click)', () => {
  const b = roomCardBranches();
  for (const variant of ['featured', 'default']) {
    const branch = b[variant];
    // Le clic part du lien lui-même (même balise que data-price-why), avec la variante de la branche, une seule fois.
    const link = new RegExp(`<LocalizedLink to=\\{inclusions\\.link\\.to\\} onClick=\\{\\(\\) => onPriceWhyClick\\?\\.\\(room, "${variant}"\\)\\} data-price-why className=\\{PRICE_WHY_LINK_CLASS\\}>`);
    assert.match(branch, link, `${variant} : lien et clic`);
    assert.equal(count(branch, 'onPriceWhyClick?.('), 1, `${variant} : un seul envoi`);
    assert.equal(count(branch, `onPriceWhyClick?.(room, "${variant}")`), 1, `${variant} : variante envoyée`);
  }
  assert.equal(count(b.compact, 'onPriceWhyClick'), 0, 'compact : rien à mesurer');
});

test('RoomCard : la ligne suit le prix et précède le bouton « Candidater », jamais sans prix', () => {
  const b = roomCardBranches();
  // Featured : ligne et lien dans le bloc du prix (`{chf && (`), avant les boutons.
  {
    const s = b.featured;
    const price = at(s, '{chf && (', 'featured');
    const line = at(s, 'data-all-inclusive={inclusions.gamme}', 'featured');
    const link = at(s, 'data-price-why', 'featured');
    const cta = at(s, 'to={ctaHref}', 'featured');
    assert.ok(price < line && line < link && link < cta, 'featured : prix → ligne → lien → bouton');
    assert.ok(at(s, '<div className="mt-auto', 'featured') > link, 'featured : le lien reste dans le bloc du prix');
  }
  // Compact : ligne courte gardée par le prix, avant le bouton.
  {
    const s = b.compact;
    assert.match(s, /\{chf && inclusions && \(\s*<p data-all-inclusive=\{inclusions\.gamme\}/, 'compact : ligne gardée par le prix');
    assert.ok(at(s, '<strong>{chf}</strong>', 'compact') < at(s, 'data-all-inclusive', 'compact'), 'compact : prix → ligne');
    assert.ok(at(s, 'data-all-inclusive', 'compact') < at(s, '{houseCta ? (', 'compact'), 'compact : ligne → bouton');
  }
  // Default : sous le prix, avant le bouton « Candidater », et gardée par le prix.
  {
    const s = b.default;
    assert.match(s, /\{room\.rent_chf !== null && inclusions && \(\s*<div className="mb-4">\s*<p data-all-inclusive=\{inclusions\.gamme\}/, 'default : ligne gardée par le prix');
    // Sans ligne (pages maisons, showInclusions={false}), le prix garde sa marge `mb-4` : la carte reste celle d'avant.
    // Avec la ligne, `mb-1` sous le prix, et c'est le bloc de la ligne qui porte le `mb-4` avant le bouton.
    assert.match(s, /\{room\.rent_chf !== null && \(\s*<p className=\{`[^`$]*\$\{inclusions \? "mb-1" : "mb-4"\}`\}>/, 'default : marge du prix selon la ligne');
    const price = at(s, '{room.rent_chf !== null && (', 'default');
    const line = at(s, 'data-all-inclusive', 'default');
    const link = at(s, 'data-price-why', 'default');
    const cta = at(s, 'to={`/candidature?', 'default');
    assert.ok(price < line && line < link && link < cta, 'default : prix → ligne → lien → bouton');
  }
});

test('RoomCard : zone de toucher du lien, sans recouvrir la ligne du dessus ni le bouton du dessous', () => {
  const src = read('src/components/RoomCard.tsx');
  const m = /const PRICE_WHY_LINK_CLASS =\s*"([^"]+)";/.exec(src);
  assert.ok(m, 'PRICE_WHY_LINK_CLASS');
  const cls = m[1].split(' ');
  for (const c of ['relative', 'inline-block', 'after:absolute', 'after:inset-x-0', "after:content-['']"]) assert.ok(cls.includes(c), c);
  // Échelle Tailwind : 1 unité = 4 px. Le texte du lien (text-xs) fait 16 px de haut.
  const px = (name) => {
    const hit = cls.find((c) => c.startsWith(`after:-${name}-`));
    assert.ok(hit, `after:-${name}-…`);
    return Number(hit.slice(`after:-${name}-`.length)) * 4;
  };
  const top = px('top');
  const bottom = px('bottom');
  assert.ok(!cls.some((c) => /^after:-?inset-y-/.test(c)), 'débord vertical en deux valeurs (haut ≠ bas)');
  // Au-dessus : moins que l'écart `mt-1` (4 px) avec la ligne « tout compris », pour ne jamais la toucher, même arrondi
  // au pixel (toucher la ligne ne doit pas compter de clic). Au-dessous : la marge `mb-4` (16 px) avant le bouton, dont
  // il reste au moins 4 px.
  assert.ok(top < 4, `débord haut ${top} px ≥ 4 px`);
  assert.ok(bottom <= 12, `débord bas ${bottom} px > 12 px`);
  assert.ok(16 + top + bottom >= 24, `zone de ${16 + top + bottom} px < 24 px (WCAG 2.5.8)`);
  // Les deux liens sont posés à 4 px sous leur ligne.
  const b = roomCardBranches();
  for (const variant of ['featured', 'default']) {
    assert.match(b[variant], /<p className="mt-1 text-xs">\s*<LocalizedLink to=\{inclusions\.link\.to\}/, `${variant} : paragraphe du lien`);
  }
  assert.match(b.default, /<div className="mb-4">/, 'default : marge avant le bouton');
});

test('page des tarifs : arrivée sur l\'ancre — instantanée, maintenue, propre à #objection-prix, jamais sur une bascule de langue', () => {
  const src = stripComments(read('src/pages/RatesPageV4.tsx'));
  // Calage instantané (la page a scroll-behavior: smooth : un calage animé serait interrompu par le suivant).
  assert.match(src, /function alignToAnchor\(target: Element\): void \{\s*target\.scrollIntoView\(\{ behavior: "instant", block: "start" \}\);\s*\}/);
  const hook = /function usePriceAnchorArrival\(\): void \{([\s\S]*?)\n\}/.exec(src);
  assert.ok(hook, 'usePriceAnchorArrival');
  const body = hook[1];
  // Seulement l'ancre du lien des cartes : une autre ancre de la page garde le comportement du site.
  assert.match(body, /const wanted = hash === `#\$\{PRICE_INCLUDES_ANCHOR\}`;/);
  const layout = /useLayoutEffect\(\(\) => \{([\s\S]*?)\}, \[pathname, wanted, key\]\);/.exec(body);
  const effect = /useEffect\(\(\) => \{([\s\S]*?)\}, \[pathname, wanted, key\]\);/.exec(body);
  assert.ok(layout && effect, 'les deux effets');
  // Les deux temps (avant la première image, puis après ScrollToTop) ignorent une bascule de langue.
  assert.match(layout[1], /if \(wanted && !isLanguageSwitchArrival\(pathname, key\)\) \{[\s\S]*?alignToAnchor\(target\)/);
  assert.match(layout[1], /return \(\) => noteDeparture\(pathname\);/);
  assert.match(effect[1], /if \(!wanted \|\| isLanguageSwitchArrival\(pathname, key\)\) return;/);
  // Puis la section est maintenue en place jusqu'au premier geste du lecteur, et relâchée au démontage.
  assert.match(effect[1], /return target \? holdInView\(target\) : undefined;/);
  assert.match(src, /function holdInView\(target: Element\): \(\) => void \{[\s\S]*?for \(const name of USER_INPUT_EVENTS\) window\.addEventListener\(name, stop, \{ passive: true \}\);[\s\S]*?return stop;\s*\}/);
});

test('page des tarifs : maintien de la section — recalée tant que le lecteur n\'a pas la main, relâchée à son premier geste', () => {
  // Comportement vérifié dans un navigateur (chargement direct, navigation interne, polices tardives, page sans ancrage
  // du défilement) : ces assertions le figent, faute de navigateur dans les tests.
  const src = stripComments(read('src/pages/RatesPageV4.tsx'));
  // Tout geste du lecteur rend la main : molette, doigt, clic, clavier (l'ordre de la liste est libre).
  const events = /const USER_INPUT_EVENTS = \[([^\]]*)\] as const;/.exec(src);
  assert.ok(events, 'USER_INPUT_EVENTS');
  assert.deepEqual([...events[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]).sort(), ['keydown', 'pointerdown', 'touchstart', 'wheel']);
  // Fenêtre pendant laquelle un défilement étranger est la fin du saut animé du navigateur, pas le lecteur.
  const settle = /const ANCHOR_SETTLE_MS = (\d+);/.exec(src);
  assert.ok(settle, 'ANCHOR_SETTLE_MS');
  assert.ok(Number(settle[1]) >= 500 && Number(settle[1]) <= 2000, `ANCHOR_SETTLE_MS = ${settle[1]} ms (attendu entre 500 et 2 000)`);
  const hold = /function holdInView\(target: Element\): \(\) => void \{([\s\S]*?)\n\}/.exec(src);
  assert.ok(hold, 'holdInView');
  const h = hold[1];
  // Recalage, sauf sur une page en cours de démontage.
  assert.match(h, /function align\(\) \{\s*if \(!target\.isConnected\) return;[^\n]*\n\s*alignToAnchor\(target\);\s*expectedY = window\.scrollY;\s*\}/, 'align');
  // Toute variation de hauteur de la page (polices, contenu tardif) recale la section.
  assert.match(h, /const observer = typeof ResizeObserver === "function" \? new ResizeObserver\(align\) : null;/, 'ResizeObserver');
  assert.match(h, /\n\s*observer\?\.observe\(document\.body\);/, 'hauteur de la page observée');
  // Défilement étranger : recalé pendant la fenêtre, puis rendu au lecteur (barre de défilement).
  assert.match(h, /function onScroll\(\) \{\s*if \(Math\.abs\(window\.scrollY - expectedY\) <= 2\) return;\s*if \(performance\.now\(\) - startedAt < ANCHOR_SETTLE_MS\) align\(\);\s*else stop\(\);\s*\}/, 'onScroll');
  assert.match(h, /window\.addEventListener\("scroll", onScroll, \{ passive: true \}\);/, 'écoute du défilement');
  // Arrêt complet : observateur, gestes et défilement.
  assert.match(h, /function stop\(\) \{\s*observer\?\.disconnect\(\);\s*for \(const name of USER_INPUT_EVENTS\) window\.removeEventListener\(name, stop\);\s*window\.removeEventListener\("scroll", onScroll\);\s*\}/, 'stop');
  // Bascule de langue : seulement vers la page miroir, reconnue à sa clé d'historique, celle que React Router range dans
  // history.state et rend par useLocation().key (une autre visite de la même page, plus tard, garde l'arrivée sur l'ancre).
  assert.match(src, /function noteDeparture\(pathname: string\): void \{\s*const next = window\.location\.pathname;[\s\S]*?const state = window\.history\.state as \{ key\?: unknown \} \| null;\s*const nextKey = state\?\.key;\s*languageSwitchArrival = next === mirrorPath\(pathname\) && typeof nextKey === "string" \? \{ pathname: next, key: nextKey \} : null;\s*\}/, 'noteDeparture');
  assert.match(src, /function isLanguageSwitchArrival\(pathname: string, key: string\): boolean \{\s*return languageSwitchArrival\?\.pathname === pathname && languageSwitchArrival\.key === key;\s*\}/, 'isLanguageSwitchArrival');
});

test('pages maisons : la carte ne reçoit ni ligne ni lien (showInclusions={false})', () => {
  const src = read('src/pages/HouseDetailPage.tsx');
  const cards = [...src.matchAll(/<RoomCard\b[\s\S]*?\/>/g)].map((m) => m[0]);
  assert.equal(cards.length, 1, 'une seule carte chambre sur les pages maisons');
  assert.match(cards[0], /\bshowInclusions=\{false\}/);
  assert.doesNotMatch(cards[0], /onPriceWhyClick/);
});

test('pages à cartes : le lien est mesuré partout où il s\'affiche, avec un nom de page propre', () => {
  const pages = {
    'src/pages/ChambresDisponiblesPage.tsx': 'chambres_disponibles',
    'src/pages/ColocationGenevePage.tsx': 'colocation_geneve',
    'src/pages/ChambreLouerGenevePage.tsx': 'chambre_a_louer_geneve',
    'src/pages/ChambreLouerAnnemassePage.tsx': 'chambre_a_louer_annemasse',
    'src/pages/OfferHiverPage.tsx': 'offre_hiver',
  };
  for (const [file, page] of Object.entries(pages)) {
    const src = read(file);
    assert.match(src, new RegExp(`trackPriceWhyClick\\(\\{ house: room\\.house_slug, roomNumber: room\\.room_number, variant, page: "${page}", language: L \\}\\)`), file);
    const cards = [...src.matchAll(/<RoomCard\b[\s\S]*?\/>/g)].map((m) => m[0]);
    assert.ok(cards.length >= 1, file);
    for (const card of cards) {
      // La carte compact n'a pas de lien : rien à mesurer.
      if (/variant="compact"/.test(card)) assert.doesNotMatch(card, /onPriceWhyClick/, file);
      else assert.match(card, /onPriceWhyClick=\{\w+\}/, file);
      assert.doesNotMatch(card, /showInclusions/, file);
    }
  }
  // Inventaire : tout fichier qui monte une carte chambre est soit mesuré ci-dessus, soit une page maison (sans ligne).
  // Une nouvelle page à cartes doit choisir : ligne et lien mesurés, ou `showInclusions={false}` — puis s'ajouter ici.
  const known = [...Object.keys(pages), 'src/pages/HouseDetailPage.tsx'].sort();
  const users = sourceFiles('src').filter((file) => /<RoomCard\b/.test(read(file))).sort();
  assert.deepEqual(users, known);
});
