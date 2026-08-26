import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  REF_CURVE, MAX_BUCKET, bucketOf, SOURCE, aggregate, isotonicDecreasing, buildCtrCurve, ctrAt,
  strikingDistance, pagesUnderCurve, noClickImpressions, watchlistReport,
} from '../lib/ctr-curve.mjs';

const close = (a, b, eps = 1e-6, msg) => assert.ok(Math.abs(a - b) < eps, msg || `${a} ≠ ${b}`);
const BRAND = /la ?villa|lavilla|villa coliving/i;

test('courbe de référence et buckets', () => {
  assert.equal(REF_CURVE[1], 0.28);
  assert.equal(REF_CURVE[10], 0.025);
  close(REF_CURVE[11], 0.02);
  close(REF_CURVE[20], 0.01);
  assert.equal(REF_CURVE[21], 0.005);
  for (let b = 2; b <= MAX_BUCKET; b++) assert.ok(REF_CURVE[b] <= REF_CURVE[b - 1], `référence décroissante en ${b}`);
  assert.equal(bucketOf(0.4), 1);
  assert.equal(bucketOf(9.49), 9);
  assert.equal(bucketOf(9.5), 10);
  assert.equal(bucketOf(57), 21);
});

test('aggregate : position pondérée par impressions, jamais moyenne simple', () => {
  const m = aggregate([
    { query: 'a', page: '/x', clicks: 1, impressions: 100, position: 10 },
    { query: 'a', page: '/y', clicks: 3, impressions: 300, position: 2 },
    { query: 'b', page: '/x', clicks: 0, impressions: 10, position: 5 },
  ], r => r.query, ['query']);
  const a = m.get('a');
  assert.equal(a.impressions, 400);
  assert.equal(a.clicks, 4);
  close(a.position, 4);           // (10×100 + 2×300) / 400 = 4, pas (10+2)/2 = 6
  close(a.ctr, 0.01);
  assert.equal(a.n, 2);
  assert.equal(m.get('b').position, 5);
});

test('buildCtrCurve : sans données → référence pure, monotone', () => {
  const c = buildCtrCurve([]);
  assert.equal(c.pureReference, true);
  assert.equal(c.reliableCount, 0);
  for (let b = 1; b <= MAX_BUCKET; b++) { assert.equal(c.values[b], REF_CURVE[b]); assert.equal(c.buckets[b - 1].source, SOURCE.REFERENCE); }
  assert.equal(ctrAt(c, 3.2), REF_CURVE[3]);
  assert.equal(ctrAt(c, 40), REF_CURVE[21]);
});

test('isotonicDecreasing : PAV pondéré met en commun les buckets qui se croisent', () => {
  const m = isotonicDecreasing([
    { bucket: 1, value: 0.30, weight: 100 },
    { bucket: 2, value: 0.01, weight: 100 },   // anomalie (requêtes parasites à 0 clic)
    { bucket: 3, value: 0.21, weight: 300 },   // > bucket 2 → mis en commun avec lui
    { bucket: 7, value: 0.02, weight: 100 },
  ]);
  close(m.get(1).value, 0.30); assert.equal(m.get(1).pooled, null);
  close(m.get(2).value, (0.01 * 100 + 0.21 * 300) / 400); assert.deepEqual(m.get(2).pooled, [2, 3]);
  close(m.get(3).value, m.get(2).value);
  close(m.get(7).value, 0.02); assert.equal(m.get(7).pooled, null);
});

test('buildCtrCurve : observé (PAV) / interpolé / référence recalée, monotonie et provenance', () => {
  const rows = [];
  const add = (pos, n, impr, ctr) => { for (let i = 0; i < n; i++) rows.push({ query: `q${pos}-${i}`, impressions: impr, clicks: impr * ctr, position: pos }); };
  add(1, 5, 100, 0.30);   // fiable (500 impr, 5 lignes)
  add(2, 1, 50, 0.50);    // non fiable (1 ligne, 50 impr) → interpolé entre 1 et 3
  add(3, 5, 100, 0.10);   // fiable
  add(5, 4, 100, 0.20);   // fiable mais > bucket 3 → mis en commun avec lui (PAV) : (50+80)/900
  const c = buildCtrCurve(rows, { minImpr: 100, minRows: 3 });
  assert.equal(c.pureReference, false);
  assert.equal(c.reliableCount, 3);
  const pooled = (0.10 * 500 + 0.20 * 400) / 900;
  const b = n => c.buckets[n - 1];
  assert.equal(b(1).source, SOURCE.OBSERVED); close(b(1).ctr, 0.30); assert.equal(b(1).monotoneAdjusted, false);
  assert.equal(b(2).source, SOURCE.INTERPOLATED); close(b(2).ctr, Math.sqrt(0.30 * pooled)); assert.deepEqual(b(2).from, [1, 3]);
  assert.equal(b(3).source, SOURCE.OBSERVED); close(b(3).ctr, pooled); assert.deepEqual(b(3).pooled, [3, 5]); assert.equal(b(3).monotoneAdjusted, true); close(b(3).ctrObs, 0.10);
  assert.equal(b(4).source, SOURCE.INTERPOLATED); close(b(4).ctr, pooled); assert.deepEqual(b(4).from, [3, 5]);
  assert.equal(b(5).source, SOURCE.OBSERVED); close(b(5).ctr, pooled); close(b(5).ctrObs, 0.20); assert.equal(b(5).monotoneAdjusted, true);
  for (let n = 6; n <= MAX_BUCKET; n++) {
    assert.equal(b(n).source, SOURCE.REFERENCE_SCALED, `bucket ${n} recalé`);
    assert.deepEqual(b(n).from, [5]);
    close(b(n).ctr, REF_CURVE[n] * pooled / REF_CURVE[5]);
  }
  close(b(6).ratio, pooled / REF_CURVE[5]);
  for (let n = 2; n <= MAX_BUCKET; n++) assert.ok(c.values[n] <= c.values[n - 1] + 1e-12, `monotone en ${n}`);
  assert.equal(c.totalImpressions, 1450);
  assert.equal(c.totalRows, 15);
  close(c.scaleRatio, pooled / REF_CURVE[5]);
  assert.equal(c.scaleBucket, 5);
});

test('buildCtrCurve : un bucket observé à 0 clic n\'écrase pas toute la courbe (cas réel : requêtes parasites)', () => {
  const rows = [];
  const add = (pos, n, impr, ctr) => { for (let i = 0; i < n; i++) rows.push({ query: `q${pos}-${i}`, impressions: impr, clicks: impr * ctr, position: pos }); };
  add(2, 10, 20, 0);      // 200 impr à 0 clic en position 2 (parasites)
  add(3, 5, 80, 0.20);    // 400 impr à 20 %
  add(7, 5, 30, 0);       // 150 impr à 0 clic
  add(8, 5, 30, 0.03);    // 150 impr à 3 %
  const c = buildCtrCurve(rows, { minImpr: 100, minRows: 3 });
  const b = n => c.buckets[n - 1];
  close(b(2).ctr, 80 / 600); close(b(3).ctr, 80 / 600);          // 2↔3 mis en commun
  close(b(7).ctr, 4.5 / 300); close(b(8).ctr, 4.5 / 300);        // 7↔8 mis en commun : 1,5 %, pas 0
  assert.ok(b(5).ctr > b(7).ctr && b(5).ctr < b(3).ctr, 'interpolation 3↔7 strictement entre les deux');
  assert.ok(b(12).ctr > 0, 'au-delà du dernier bucket observé : référence recalée > 0');
});

test('buildCtrCurve : ratio de recalage borné (0,1 – 5) et bucket fiable à 0 clic', () => {
  const rows = [];
  for (let i = 0; i < 5; i++) rows.push({ query: `z${i}`, impressions: 100, clicks: 0, position: 8 });
  const c = buildCtrCurve(rows, { minImpr: 100, minRows: 3 });
  assert.equal(c.buckets[7].source, SOURCE.OBSERVED);
  assert.equal(c.buckets[7].ctr, 0);
  close(c.buckets[0].ctr, REF_CURVE[1] * 0.1); // ratio 0 → borné à 0,1
  for (let n = 9; n <= MAX_BUCKET; n++) assert.equal(c.values[n], 0); // monotonie : rien au-dessus de 0 après le bucket 8
});

// ─── striking distance sur 6 lignes connues (courbe = référence pure) ───
test('strikingDistance : 6 lignes connues → filtres, score, tri, money', () => {
  const curve = buildCtrCurve([]); // référence pure : attendu(5)=0,07, attendu(4)=0,08, attendu(7)=0,04, attendu(12)=0,018889
  const rows = [
    { query: 'q1', impressions: 100, clicks: 2, position: 5 },                  // ctr 0,02 < 0,07 : perdus 5 ; +3 places (5→2) : (0,15−0,07)×100 = 8 ; score 13
    { query: 'q2', impressions: 200, clicks: 20, position: 4 },                 // ctr 0,10 > 0,08 : perdus 0 ; +3 (4→1) : (0,28−0,08)×200 = 40 ; score 40
    { query: 'la villa coliving', impressions: 500, clicks: 5, position: 6 },   // marque → exclue
    { query: 'q4', impressions: 10, clicks: 0, position: 6 },                   // < 20 impressions → exclue
    { query: 'q5', impressions: 80, clicks: 0, position: 16 },                  // position > 15 → exclue
    { query: 'coliving geneve', impressions: 300, clicks: 9, position: 7 },     // ctr 0,03 < 0,04 : perdus 3 ; +3 (7→4) : (0,08−0,04)×300 = 12 ; score 15 ; money
    { query: 'q6', impressions: 50, clicks: 0, position: 12 },                  // ctr 0 : perdus 50×0,018889 = 0,944 ; +3 (12→9) : (0,028−0,018889)×50 = 0,456 ; score 1,4
    { query: 'q7', impressions: 60, clicks: 6, position: 3.4 },                 // position < 4 → exclue
  ];
  const out = strikingDistance(rows, curve, { posMin: 4, posMax: 15, minImpr: 20, brandRe: BRAND, watchlist: ['coliving geneve'] });
  assert.deepEqual(out.map(r => r.query), ['q2', 'coliving geneve', 'q1', 'q6']);
  const by = q => out.find(r => r.query === q);
  close(by('q1').expected, 0.07); close(by('q1').delta, -0.05); close(by('q1').lostClicks, 5); close(by('q1').potentialPlus3, 8); close(by('q1').score, 13);
  close(by('q2').lostClicks, 0); close(by('q2').potentialPlus3, 40); close(by('q2').score, 40); assert.equal(by('q2').money, false);
  close(by('coliving geneve').lostClicks, 3); close(by('coliving geneve').potentialPlus3, 12); close(by('coliving geneve').score, 15); assert.equal(by('coliving geneve').money, true);
  close(by('q6').lostClicks, 50 * REF_CURVE[12]); close(by('q6').potentialPlus3, 50 * (REF_CURVE[9] - REF_CURVE[12]));
  assert.equal(strikingDistance(rows, curve, { brandRe: BRAND, topN: 2 }).length, 2);
  // bornes inclusives : 4 et 15 sont dedans
  const edges = strikingDistance([{ query: 'e4', impressions: 30, clicks: 0, position: 4 }, { query: 'e15', impressions: 30, clicks: 0, position: 15 }], curve, {});
  assert.deepEqual(edges.map(r => r.query).sort(), ['e15', 'e4']);
});

test('pagesUnderCurve : méthode indicatif (position page) et méthode requêtes (page × requête)', () => {
  const curve = buildCtrCurve([]);
  const pages = [
    { page: '/a', lang: 'fr', impressions: 100, clicks: 1, position: 5 },   // ctr 0,01 < 0,6×0,07 → sous la courbe (indicatif), perdus 6
    { page: '/b', lang: 'fr', impressions: 100, clicks: 6, position: 5 },   // ctr 0,06 ≥ 0,042 → ok
    { page: '/c', lang: 'fr', impressions: 40, clicks: 0, position: 3 },    // < 50 impressions → ignorée
  ];
  const ind = pagesUnderCurve(pages, curve, { minImpr: 50, ratio: 0.6 });
  assert.deepEqual(ind.map(p => p.page), ['/a']);
  assert.equal(ind[0].method, 'indicatif');
  close(ind[0].expected, 0.07); close(ind[0].lostClicks, 6); close(ind[0].ratioToExpected, 1 / 7);
  // requêtes : /a = 50 impr en position 1 (0,28) + 50 impr en position 10 (0,025) → attendu 0,1525
  const pq = [
    { page: '/a', query: 'x', impressions: 50, clicks: 1, position: 1 },
    { page: '/a', query: 'y', impressions: 50, clicks: 0, position: 10 },
    { page: '/b', query: 'z', impressions: 100, clicks: 6, position: 5 },
  ];
  const req = pagesUnderCurve(pages, curve, { minImpr: 50, ratio: 0.6, pageQueryRows: pq });
  assert.equal(req[0].page, '/a');
  assert.equal(req[0].method, 'requêtes');
  close(req[0].expected, 0.1525); close(req[0].lostClicks, 100 * (0.1525 - 0.01));
});

test('noClickImpressions : seuils, marque, diagnostic, tri', () => {
  const out = noClickImpressions([
    { query: 'a', impressions: 30, clicks: 0, position: 8 },
    { query: 'b', impressions: 100, clicks: 0, position: 14 },
    { query: 'c', impressions: 29, clicks: 0, position: 2 },
    { query: 'd', impressions: 500, clicks: 1, position: 3 },
    { query: 'la villa coliving', impressions: 80, clicks: 0, position: 1 },
  ], { minImpr: 30, brandRe: BRAND });
  assert.deepEqual(out.map(r => [r.query, r.diagnostic]), [['b', 'position'], ['a', 'snippet/title']]);
});

test('watchlistReport : agrégat pondéré, statuts, requête absente', () => {
  const curve = buildCtrCurve([]);
  const rows = [
    { query: 'colocation geneve', page: '/p', impressions: 400, clicks: 8, position: 20 },
    { query: 'colocation geneve', page: '/q', impressions: 100, clicks: 2, position: 17 },
    { query: 'coliving geneve', page: '/', impressions: 200, clicks: 50, position: 2.5 },
    { query: 'coliving annemasse', page: '/a', impressions: 40, clicks: 1, position: 6 },
    { query: 'room for rent geneva', page: '/en', impressions: 10, clicks: 0, position: 9 },
  ];
  const out = watchlistReport(rows, curve, ['colocation geneve', 'coliving geneve', 'coliving annemasse', 'room for rent geneva', 'inconnue'], { posMin: 4, posMax: 15, minImpr: 20 });
  const by = q => out.find(r => r.query === q);
  assert.equal(by('colocation geneve').impressions, 500);
  close(by('colocation geneve').position, 19.4);       // (20×400 + 17×100) / 500
  assert.equal(by('colocation geneve').statut, 'hors fenêtre (position)');
  assert.equal(by('colocation geneve').inWindow, false);
  assert.equal(by('colocation geneve').pages, 2);
  assert.equal(by('coliving geneve').statut, 'acquis (top 3)');
  assert.equal(by('coliving annemasse').statut, 'striking');
  assert.equal(by('room for rent geneva').statut, 'hors fenêtre (impressions)');
  assert.equal(by('inconnue').found, false);
});
