import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseCsv, parsePct, parseNum, detectCsvKind, analyzeHeader, choosePeriod, parseMetricsCsv, parseFiltersCsv,
  parseDateLabel, parseUsRange, dateRangeOfChart, normalizePage, langOfPage, normalizeQuery, compileBrandRe,
  segmentOfCountryLabel, segmentOfIso, loadCsvDir, rowsOfJson, inferDims, normalizeJsonRows, loadJsonFiles, findJsonWindow,
} from '../lib/gsc-parse.mjs';

const FIX = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures');

// ─── CSV bas niveau ───
test('parseCsv : RFC 4180 (guillemets, "" échappé, virgule et retour ligne dans un champ, CRLF, BOM, sans saut final)', () => {
  const rows = parseCsv('﻿a,b,c\r\n1,"x, y","dit ""bonjour""\nsur deux lignes"\r\n2,,3');
  assert.deepEqual(rows, [['a', 'b', 'c'], ['1', 'x, y', 'dit "bonjour"\nsur deux lignes'], ['2', '', '3']]);
  assert.deepEqual(parseCsv('Search Appearance,Clicks'), [['Search Appearance', 'Clicks']]); // en-tête seul, sans \n
  assert.deepEqual(parseCsv(''), []);
});

test('parsePct / parseNum', () => {
  assert.equal(parsePct('14.93%'), 0.1493);
  assert.equal(parsePct('50%'), 0.5);
  assert.equal(parsePct('12,5 %'), 0.125);
  assert.equal(parsePct('0.1493'), 0.1493);
  assert.equal(parsePct(''), 0);
  assert.equal(parseNum('9.35'), 9.35);
  assert.equal(parseNum('9,35'), 9.35);
  assert.equal(parseNum('abc'), 0);
});

test('detectCsvKind : EN et FR', () => {
  assert.equal(detectCsvKind(['Top pages', 'Clicks']), 'pages');
  assert.equal(detectCsvKind(['Pages les plus populaires', 'Clics']), 'pages');
  assert.equal(detectCsvKind(['Top queries']), 'queries');
  assert.equal(detectCsvKind(['Requêtes les plus fréquentes']), 'queries');
  assert.equal(detectCsvKind(['Country']), 'countries');
  assert.equal(detectCsvKind(['Pays']), 'countries');
  assert.equal(detectCsvKind(['Date']), 'dates');
  assert.equal(detectCsvKind(['Date Range']), 'dates'); // graphique agrégé par semaine
  assert.equal(detectCsvKind(['Device']), 'devices');
  assert.equal(detectCsvKind(['Appareil']), 'devices');
  assert.equal(detectCsvKind(['Filter', 'Value']), 'filters');
  assert.equal(detectCsvKind(['Filtre', 'Valeur']), 'filters');
  assert.equal(detectCsvKind(['Search Appearance']), 'appearance');
  assert.equal(detectCsvKind(['Apparence dans les résultats de recherche']), 'appearance');
  assert.equal(detectCsvKind(['N importe quoi']), 'unknown');
});

test('analyzeHeader : simple (EN/FR) et comparaison 9 colonnes', () => {
  const s = analyzeHeader(['Top queries', 'Clicks', 'Impressions', 'CTR', 'Position']);
  assert.equal(s.comparison, false);
  assert.deepEqual(s.cols, { clicks: 1, impressions: 2, ctr: 3, position: 4 });
  const f = analyzeHeader(['Requêtes les plus fréquentes', 'Clics', 'Impressions', 'CTR', 'Position']);
  assert.deepEqual(f.cols, { clicks: 1, impressions: 2, ctr: 3, position: 4 });
  const c = analyzeHeader('Top pages,6/1/26 - 6/13/26 Clicks,6/14/26 - 6/21/26 Clicks,6/1/26 - 6/13/26 Impressions,6/14/26 - 6/21/26 Impressions,6/1/26 - 6/13/26 CTR,6/14/26 - 6/21/26 CTR,6/1/26 - 6/13/26 Position,6/14/26 - 6/21/26 Position'.split(','));
  assert.equal(c.comparison, true);
  assert.equal(c.periods.length, 2);
  assert.deepEqual(c.periods[0], { label: '6/1/26 - 6/13/26', start: '2026-06-01', end: '2026-06-13', cols: { clicks: 1, impressions: 3, ctr: 5, position: 7 } });
  assert.deepEqual(c.periods[1], { label: '6/14/26 - 6/21/26', start: '2026-06-14', end: '2026-06-21', cols: { clicks: 2, impressions: 4, ctr: 6, position: 8 } });
  assert.equal(choosePeriod(c.periods, 'latest').label, '6/14/26 - 6/21/26');
  assert.equal(choosePeriod(c.periods, 'previous').label, '6/1/26 - 6/13/26');
  assert.deepEqual(parseUsRange('6/1/26 - 6/13/26'), { label: '6/1/26 - 6/13/26', start: '2026-06-01', end: '2026-06-13' });
});

test('parseMetricsCsv : export simple FR, CTR → ratio, lignes à 0 impression écartées', () => {
  const m = parseMetricsCsv('Requêtes les plus fréquentes,Clics,Impressions,CTR,Position\nla villa coliving,10,23,43.48%,1.43\nvide,0,0,0%,0\n');
  assert.equal(m.kind, 'queries');
  assert.equal(m.comparison, false);
  assert.equal(m.rows.length, 1);
  assert.equal(m.dropped, 1);
  assert.deepEqual(m.rows[0], { key: 'la villa coliving', clicks: 10, impressions: 23, ctr: 0.4348, position: 1.43 });
  assert.throws(() => parseMetricsCsv('Top queries,Foo,Bar\nx,1,2'), /En-tête CSV non reconnu/);
});

test('parseMetricsCsv : comparaison — période latest par défaut, previous sur demande', () => {
  const text = 'Top queries,6/1/26 - 6/13/26 Clicks,6/14/26 - 6/21/26 Clicks,6/1/26 - 6/13/26 Impressions,6/14/26 - 6/21/26 Impressions,6/1/26 - 6/13/26 CTR,6/14/26 - 6/21/26 CTR,6/1/26 - 6/13/26 Position,6/14/26 - 6/21/26 Position\n'
    + 'coliving geneve,4,2,9,3,44.44%,66.67%,1.22,1\nancienne,2,0,15,0,13.33%,0%,6.1,0\n';
  const latest = parseMetricsCsv(text);
  assert.equal(latest.comparison, true);
  assert.equal(latest.chosen.label, '6/14/26 - 6/21/26');
  assert.deepEqual(latest.rows, [{ key: 'coliving geneve', clicks: 2, impressions: 3, ctr: 0.6667, position: 1 }]);
  assert.equal(latest.dropped, 1);
  const prev = parseMetricsCsv(text, { period: 'previous' });
  assert.equal(prev.chosen.label, '6/1/26 - 6/13/26');
  assert.equal(prev.rows.length, 2);
  assert.deepEqual(prev.rows[1], { key: 'ancienne', clicks: 2, impressions: 15, ctr: 0.1333, position: 6.1 });
});

test('parseFiltersCsv : EN et FR, valeur entre guillemets', () => {
  const en = parseFiltersCsv('Filter,Value\nSearch type,Web\nDate,"Jun 1, 2026-Jun 13, 2026"\nCountry,Switzerland\nQuery,colocation geneve');
  assert.equal(en.searchType, 'Web');
  assert.equal(en.dateLabel, 'Jun 1, 2026-Jun 13, 2026');
  assert.equal(en.country, 'Switzerland');
  assert.equal(en.query, 'colocation geneve');
  const fr = parseFiltersCsv('Filtre,Valeur\nType de recherche,Web\nDate,Les 28 derniers jours\nPays,France');
  assert.equal(fr.country, 'France');
  assert.equal(fr.dateLabel, 'Les 28 derniers jours');
  assert.equal(fr.query, null);
  assert.equal(fr.raw.length, 3);
});

test('dates : libellés explicites / relatifs, plage du graphique, fenêtre JSON', () => {
  assert.deepEqual(parseDateLabel('Jun 1, 2026-Jun 13, 2026'), { label: 'Jun 1, 2026-Jun 13, 2026', start: '2026-06-01', end: '2026-06-13', relative: false });
  assert.deepEqual(parseDateLabel('1 juin 2026 - 13 juin 2026'), { label: '1 juin 2026 - 13 juin 2026', start: '2026-06-01', end: '2026-06-13', relative: false });
  assert.deepEqual(parseDateLabel('2026-06-01 - 2026-06-13'), { label: '2026-06-01 - 2026-06-13', start: '2026-06-01', end: '2026-06-13', relative: false });
  assert.equal(parseDateLabel('Last 3 months').relative, true);
  assert.equal(parseDateLabel('Les 28 derniers jours').relative, true);
  assert.equal(parseDateLabel('').start, null);
  assert.deepEqual(dateRangeOfChart([['Date', 'Clicks'], ['2026-03-21', '1'], ['2026-06-20', '2'], ['2026-05-01', '3']]), { start: '2026-03-21', end: '2026-06-20' });
  assert.deepEqual(dateRangeOfChart([['Date'], ['2026-03-21 - 2026-03-27', '0'], ['2026-06-14 - 2026-06-20', '1']]), { start: '2026-03-21', end: '2026-06-20' });
  assert.equal(dateRangeOfChart([['Date']]), null);
  assert.deepEqual(findJsonWindow([{ json: { startDate: '2026-06-01', endDate: '2026-06-28', rows: [] } }]), { start: '2026-06-01', end: '2026-06-28' });
  assert.equal(findJsonWindow({ rows: [] }), null);
});

test('normalisation : page → chemin, langue, requête, marque, segments', () => {
  assert.equal(normalizePage('https://www.lavillacoliving.com/'), '/');
  assert.equal(normalizePage('https://www.lavillacoliving.com/en'), '/en');
  assert.equal(normalizePage('https://www.lavillacoliving.com/colocation-geneve/'), '/colocation-geneve');
  assert.equal(normalizePage('https://lavillacoliving.com/tarifs?x=1#y'), '/tarifs?x=1');
  assert.equal(normalizePage('https://autre-site.example/page'), 'https://autre-site.example/page');
  assert.equal(langOfPage('/en'), 'en');
  assert.equal(langOfPage('/en/blog/x'), 'en');
  assert.equal(langOfPage('/english-school'), 'fr');
  assert.equal(langOfPage('/'), 'fr');
  assert.equal(normalizeQuery('  Coliving   GENÈVE \n'), 'coliving genève');
  const brand = compileBrandRe('/la ?villa|lavilla|villa coliving/i');
  assert.equal(brand.test('la villa coliving'), true);
  assert.equal(brand.test('LaVilla'), true);
  assert.equal(brand.test('coliving geneve'), false);
  assert.equal(compileBrandRe('lodge').flags, 'i');
  assert.equal(compileBrandRe(/x/g).flags, 'i');
  assert.throws(() => compileBrandRe('('), /Regex de marque invalide/);
  assert.equal(segmentOfCountryLabel('France'), 'fr');
  assert.equal(segmentOfCountryLabel('Switzerland'), 'ch');
  assert.equal(segmentOfCountryLabel('Suisse'), 'ch');
  assert.equal(segmentOfCountryLabel(null), 'global');
  assert.equal(segmentOfIso('fra'), 'fr');
  assert.equal(segmentOfIso('CHE'), 'ch');
  assert.equal(segmentOfIso('usa'), 'autres');
});

// ─── Dossiers d'export (fixtures synthétiques) ───
test('loadCsvDir : export EN (France, 3 mois) — segment, fenêtre via Chart, lignes, totaux', async () => {
  const s = await loadCsvDir(path.join(FIX, 'csv-en'));
  assert.equal(s.mode, 'csv');
  assert.equal(s.segment, 'fr');
  assert.equal(s.country, 'France');
  assert.equal(s.queryFilter, null);
  assert.equal(s.comparison, null);
  assert.deepEqual({ start: s.window.start, end: s.window.end, source: s.window.source }, { start: '2026-04-01', end: '2026-06-20', source: 'graphique' });
  assert.equal(s.queryRows.length, 12);
  const multi = s.queryRows.find(q => q.query.startsWith('question, avec virgule'));
  assert.ok(multi, 'requête multi-ligne entre guillemets lue');
  assert.equal(multi.query, 'question, avec virgule et "guillemets" sur deux lignes');
  const cg = s.queryRows.find(q => q.query === 'colocation geneve');
  assert.deepEqual({ c: cg.clicks, i: cg.impressions, ctr: cg.ctr, p: cg.position }, { c: 4, i: 160, ctr: 0.025, p: 14.2 });
  assert.equal(s.pageRows.length, 5);
  const pg = s.pageRows.find(p => p.page === '/colocation-geneve');
  assert.ok(pg, 'slash final retiré');
  assert.equal(pg.lang, 'fr');
  assert.equal(s.pageRows.find(p => p.page === '/en/blog/article-test').lang, 'en');
  assert.deepEqual(s.totals, { clicks: 18, impressions: 400 });
  assert.ok(s.files.some(f => f.kind === 'appearance' && f.ignored));
  assert.ok(s.files.some(f => f.kind === 'devices' && f.ignored));
});

test('loadCsvDir : export FR (Suisse, 28 jours) avec BOM + CRLF', async () => {
  const s = await loadCsvDir(path.join(FIX, 'csv-fr'));
  assert.equal(s.segment, 'ch');
  assert.equal(s.window.start, '2026-05-24');
  assert.equal(s.window.end, '2026-06-20');
  assert.equal(s.window.label, 'Les 28 derniers jours');
  assert.equal(s.queryRows.length, 5);
  assert.equal(s.queryRows[0].query, 'coliving geneve');
  assert.equal(s.queryRows[0].ctr, 0.2);
  assert.equal(s.pageRows.length, 3);
  assert.deepEqual(s.totals, { clicks: 9, impressions: 210 });
});

test('loadCsvDir : export comparé — période latest/previous, fenêtre = période retenue', async () => {
  const latest = await loadCsvDir(path.join(FIX, 'csv-compare'));
  assert.equal(latest.segment, 'ch');
  assert.ok(latest.comparison);
  assert.equal(latest.comparison.chosen.label, '6/14/26 - 6/21/26');
  assert.deepEqual({ s: latest.window.start, e: latest.window.end, src: latest.window.source }, { s: '2026-06-14', e: '2026-06-21', src: 'comparaison' });
  assert.deepEqual(latest.queryRows.map(q => q.query), ['coliving geneve', 'colocation geneve', 'nouvelle requete']);
  assert.equal(latest.pageRows[0].impressions, 39);
  assert.deepEqual(latest.totals, { clicks: 8, impressions: 83 });
  const prev = await loadCsvDir(path.join(FIX, 'csv-compare'), { period: 'previous' });
  assert.equal(prev.window.start, '2026-06-01');
  assert.deepEqual(prev.queryRows.map(q => q.query), ['coliving geneve', 'colocation geneve', 'ancienne requete']);
  assert.deepEqual(prev.totals, { clicks: 12, impressions: 110 });
});

test('loadCsvDir : export filtré sur une requête → queryFilter, plage du graphique hebdo', async () => {
  const s = await loadCsvDir(path.join(FIX, 'csv-queryfilter'));
  assert.equal(s.segment, 'global');
  assert.equal(s.queryFilter, 'colocation geneve');
  assert.equal(s.window.start, '2026-03-21');
  assert.equal(s.window.end, '2026-06-20');
  assert.equal(s.queryRows.length, 1);
  assert.equal(s.pageRows.length, 2);
});

test('loadCsvDir : erreurs claires en français', async () => {
  await assert.rejects(loadCsvDir(path.join(FIX, 'n-existe-pas')), /Dossier introuvable/);
  await assert.rejects(loadCsvDir(FIX), /Aucun fichier \.csv/);
});

// ─── JSON (sonde) ───
const R = (keys, clicks, impressions, position) => ({ keys, clicks, impressions, ctr: impressions ? clicks / impressions : 0, position });
const ROWS = [R(['https://www.lavillacoliving.com/', 'coliving geneve', 'fra'], 2, 10, 3), R(['https://www.lavillacoliving.com/en', 'coliving geneva', 'che'], 1, 5, 4)];

test('rowsOfJson : 4 formes (+ enveloppes json/data)', () => {
  assert.deepEqual(rowsOfJson({ rows: ROWS }), ROWS);
  assert.deepEqual(rowsOfJson([{ rows: [ROWS[0]] }, { rows: [ROWS[1]] }]), ROWS);
  assert.deepEqual(rowsOfJson([{ json: { rows: [ROWS[0]] } }, { json: { rows: [ROWS[1]] } }]), ROWS);
  assert.deepEqual(rowsOfJson(ROWS), ROWS);
  assert.deepEqual(rowsOfJson({ json: { rows: ROWS } }), ROWS);
  assert.deepEqual(rowsOfJson([{ json: ROWS[0] }, { json: ROWS[1] }]), ROWS);
  assert.deepEqual(rowsOfJson({ data: { rows: ROWS } }), ROWS);
  assert.deepEqual(rowsOfJson(null), []);
  assert.deepEqual(rowsOfJson({ foo: 1 }), []);
});

test('inferDims : par valeur, et override --dims', () => {
  assert.deepEqual(inferDims(ROWS), ['page', 'query', 'country']);
  assert.deepEqual(inferDims([R(['fra', 'https://www.lavillacoliving.com/x'], 1, 2, 3)]), ['country', 'page']);
  assert.deepEqual(inferDims([R(['2026-06-01', 'MOBILE', 'une requête'], 1, 2, 3)]), ['date', 'device', 'query']);
  assert.deepEqual(inferDims([R(['abc'], 1, 2, 3)]), ['country']); // 3 lettres minuscules = pays : forcer --dims query si c'est une requête
  assert.deepEqual(inferDims([R(['abc'], 1, 2, 3)], 'query'), ['query']);
  assert.deepEqual(inferDims(ROWS, ['page', 'query', 'country']), ['page', 'query', 'country']);
  assert.throws(() => inferDims(ROWS, 'page,truc'), /--dims : dimension\(s\) inconnue\(s\)/);
});

test('normalizeJsonRows : normalisation page/requête/pays, ctr > 1 ramené en ratio, 0 impression écarté', () => {
  const out = normalizeJsonRows([...ROWS, { keys: ['https://www.lavillacoliving.com/z', 'Q', 'usa'], clicks: 0, impressions: 0, ctr: 0, position: 0 }, { keys: ['https://www.lavillacoliving.com/y/', 'Requête  Majuscule', 'deu'], clicks: 1, impressions: 4, ctr: 25, position: 2 }], ['page', 'query', 'country']);
  assert.equal(out.length, 3);
  assert.deepEqual({ page: out[0].page, lang: out[0].lang, query: out[0].query, country: out[0].country, segment: out[0].segment }, { page: '/', lang: 'fr', query: 'coliving geneve', country: 'fra', segment: 'fr' });
  assert.equal(out[1].segment, 'ch');
  assert.equal(out[1].lang, 'en');
  assert.deepEqual({ page: out[2].page, query: out[2].query, segment: out[2].segment, ctr: out[2].ctr }, { page: '/y', query: 'requête majuscule', segment: 'autres', ctr: 0.25 });
});

test('loadJsonFiles : pagination concaténée, dims inférées, fenêtre startDate/endDate', async () => {
  const one = await loadJsonFiles([path.join(FIX, 'sonde-rows.json')]);
  assert.equal(one.mode, 'sonde');
  assert.deepEqual(one.dims, ['page', 'query', 'country']);
  assert.equal(one.rows.length, 10);
  assert.deepEqual({ s: one.window.start, e: one.window.end }, { s: '2026-06-01', e: '2026-06-28' });
  const paged = await loadJsonFiles([path.join(FIX, 'sonde-array.json'), path.join(FIX, 'sonde-n8n.json')]);
  assert.equal(paged.rows.length, 20);
  assert.equal(paged.files.length, 2);
  const list = await loadJsonFiles([path.join(FIX, 'sonde-list.json')]);
  assert.equal(list.rows.length, 10);
  assert.ok(list.warnings.some(w => /Fenêtre de dates inconnue/.test(w)));
  const q = await loadJsonFiles([path.join(FIX, 'sonde-query-only.json')]);
  assert.deepEqual(q.dims, ['query']);
  assert.equal(q.rows[0].page, undefined);
  await assert.rejects(loadJsonFiles([path.join(FIX, 'absent.json')]), /Fichier JSON introuvable/);
  await assert.rejects(loadJsonFiles([path.join(FIX, 'README.md')]), /JSON invalide/);
});
