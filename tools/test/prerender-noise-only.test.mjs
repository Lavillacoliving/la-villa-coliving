// Déploiements inutiles du cron de prérendu (12/11/2026, alerte Vercel « Deployment Storage » : 10 Go atteints) :
// scripts/prerender-noise-only.mjs. Un run dont seuls les identifiants useId/Radix, l'ordre des JSON-LD ou le repère
// data-offer-today ont bougé ne doit pas commiter ; tout vrai changement (disponibilité, texte, fichier ajouté, sitemap,
// vercel.json) doit commiter comme avant.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isNoiseChange, isNoiseOnly } from '../../scripts/prerender-noise-only.mjs';

const SCRIPT = fileURLToPath(new URL('../../scripts/prerender-noise-only.mjs', import.meta.url));

const page = ({ ids = ['_r_4s_', '_r_4t_'], jsonLd = ['A', 'B'], status = '1 chambre disponible', offerToday = '2026-11-08', bail = 'Bail au 1er décembre' } = {}) =>
  `<html><head><title>Offre</title>` +
  jsonLd.map((t) => `<script type="application/ld+json" data-react-helmet="true">{"@type":"${t}"}</script>`).join('') +
  `</head><body><div id="root"><main data-offer-state="active" data-offer-today="${offerToday}" class="pt-16">` +
  `<button aria-controls="radix-${ids[0]}" id="radix-${ids[1]}">Q</button><div id="radix-${ids[0]}" aria-labelledby="radix-${ids[1]}">R</div>` +
  `<p>Le Lodge — ${status}</p><p>${bail}</p></main></div></body></html>`;

const html = 'public/prerendered/offre-hiver.html';

test('bruit : identifiants useId/Radix renumérotés', () => {
  assert.ok(isNoiseChange({ path: html, before: page(), after: page({ ids: ['_r_n_', '_r_m_'] }) }));
});

test('bruit : ordre des blocs JSON-LD', () => {
  assert.ok(isNoiseChange({ path: html, before: page(), after: page({ jsonLd: ['B', 'A'] }) }));
});

test('bruit : repère data-offer-today seul ; mais le texte qui dépend du jour reste un vrai changement', () => {
  assert.ok(isNoiseChange({ path: html, before: page(), after: page({ offerToday: '2026-11-09' }) }));
  assert.ok(!isNoiseChange({ path: html, before: page(), after: page({ offerToday: '2026-11-09', bail: 'Bail au 15 décembre' }) }));
});

test('vrai changement : disponibilité, JSON-LD ajouté ou modifié', () => {
  assert.ok(!isNoiseChange({ path: html, before: page(), after: page({ status: 'Complet' }) }));
  assert.ok(!isNoiseChange({ path: html, before: page(), after: page({ jsonLd: ['A', 'B', 'C'] }) }));
  assert.ok(!isNoiseChange({ path: html, before: page(), after: page({ jsonLd: ['A', 'Z'] }) }));
});

test('vrai changement : page ajoutée ou retirée, fichier hors public/prerendered/', () => {
  assert.ok(!isNoiseChange({ path: html, before: null, after: page() }));
  assert.ok(!isNoiseChange({ path: html, before: page(), after: null }));
  for (const p of ['public/sitemap.xml', 'vercel.json', 'public/prerendered/sub/x.html', 'src/App.tsx'])
    assert.ok(!isNoiseChange({ path: p, before: page(), after: page({ ids: ['_r_n_', '_r_m_'] }) }), p);
});

test('isNoiseOnly : au moins un fichier, et tous du bruit', () => {
  const noise = { path: html, before: page(), after: page({ jsonLd: ['B', 'A'] }) };
  const real = { path: 'public/sitemap.xml', before: '<a/>', after: '<b/>' };
  assert.ok(isNoiseOnly([noise, { ...noise, path: 'public/prerendered/faq.html' }]));
  assert.ok(!isNoiseOnly([noise, real]));
  assert.ok(!isNoiseOnly([]));
  assert.ok(!isNoiseOnly(undefined));
});

test('CLI : index git contre HEAD — sortie 0 si bruit seulement, 1 sinon', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'prerender-noise-'));
  const git = (...a) => execFileSync('git', a, { cwd: dir, encoding: 'utf8' });
  const write = (rel, content) => {
    fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, rel), content);
  };
  const cli = () => spawnSync(process.execPath, [SCRIPT], { cwd: dir, encoding: 'utf8' }).status;
  try {
    git('init', '-q');
    git('config', 'user.email', 'test@example.com');
    git('config', 'user.name', 'test');
    write(html, page());
    write('public/sitemap.xml', '<urlset/>');
    git('add', '-A');
    git('commit', '-q', '-m', 'init');

    write(html, page({ ids: ['_r_n_', '_r_m_'], jsonLd: ['B', 'A'], offerToday: '2026-11-09' }));
    git('add', '-A');
    assert.equal(cli(), 0, 'bruit seulement');

    write(html, page({ status: 'Complet' }));
    git('add', '-A');
    assert.equal(cli(), 1, 'disponibilité changée');

    write(html, page());
    write('public/sitemap.xml', '<urlset><url/></urlset>');
    git('add', '-A');
    assert.equal(cli(), 1, 'sitemap changé');

    git('reset', '-q', '--hard');
    assert.equal(cli(), 1, 'rien de préparé : par prudence, vrai changement');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
