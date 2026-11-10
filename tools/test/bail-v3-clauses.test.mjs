// Texte du bail v3 (src/lib/bailV3/clauses.ts) — décisions de Jérôme du 10/11/2026 (classeur « mise en ligne ») :
// article 2.1 avec surface habitable ET surface totale intérieure pour les trois maisons, parc de La Villa cité une
// seule fois (clause de cadre), « (salle d'eau comprise) » réservé aux salles d'eau privatives, surfaces décimales à la
// française ; dernier bail de la chambre départagé par la date de création quand deux baux ont la même date d'entrée.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const bundle = await build({
  stdin: {
    contents: [
      "export { buildLeaseV3 } from './src/lib/bailV3/clauses';",
      "export { previousLeaseFacts, propertyToLease } from './src/lib/bailV3/buildInput';",
      "export { CASES } from './tools/bail-v3/cases';",
    ].join(' '),
    resolveDir: ROOT,
    loader: 'ts',
  },
  bundle: true, write: false, format: 'esm', platform: 'neutral', target: 'es2022',
  alias: { '@': path.join(ROOT, 'src') }, logLevel: 'silent',
});
const m = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text, 'utf8').toString('base64')}`);
const NB = ' ';

/** Texte de l'article « OBJET ET DÉSIGNATION » (paragraphes et puces, dans l'ordre). */
function objetText(input) {
  const doc = m.buildLeaseV3(input);
  const art = doc.articles.find((a) => a.key === 'objet');
  assert.ok(art, 'article objet introuvable');
  return art.blocks.flatMap((b) => (b.t === 'bullets' ? b.items : b.text != null ? [b.text] : [])).join('\n');
}
/** Seulement la partie 2.1 (entre « 2.1 L'immeuble » et « 2.2 »). */
function immeuble(input) {
  const t = objetText(input);
  return t.slice(t.indexOf("2.1 L'immeuble"), t.indexOf('2.2 Le local privatif'));
}

test('La Villa : surface habitable et surface totale intérieure, parc de 1 948 m² cité une seule fois', () => {
  const t = immeuble(m.CASES.LaVilla_2_indivision);
  assert.match(t, new RegExp(`Maison individuelle à usage d'habitation sise 34 rue du Foron, 74100 Ville-la-Grand, d'une surface habitable totale de 365 m² et d'une surface totale intérieure de 380 m², comprenant 10 chambres louées séparément et des parties communes\\.`));
  assert.equal((t.match(/1[ \u00a0]948/g) || []).length, 1, 'le parc doit apparaître exactement une fois');
  assert.ok(t.includes(`parc arboré de 1${NB}948 m²`), 'milliers en espace insécable');
  assert.ok(!/terrain arboré d'environ/.test(t), 'plus de « terrain arboré d’environ … » généré');
});

test('Le Lodge : tènement de quatre bâtiments, 380 m² habitables et 589 m² intérieurs', () => {
  const t = immeuble(m.CASES.LeLodge_1_SCI);
  assert.ok(t.includes("Tènement immobilier sis 8 rue de Romagny, 74100 Annemasse, d'une surface habitable totale de 380 m² et d'une surface totale intérieure de 589 m², constitué de quatre bâtiments distincts :"), t);
});

test('Le Loft : maison de ville sur deux bâtiments, 249 m² habitables et 309 m² intérieurs, plus de 298 m²', () => {
  const t = immeuble(m.CASES.LeLoft_6_SCI);
  assert.ok(t.includes("Maison de ville à usage d'habitation sise 1 rue des Marronniers, 74100 Ambilly, d'une surface habitable totale de 249 m² et d'une surface totale intérieure de 309 m², répartie sur deux bâtiments :"), t);
  assert.ok(t.includes("le bâtiment principal, d'une surface habitable de 249 m²"));
  assert.ok(!t.includes('298'), 'l’ancienne surface de 298 m² ne doit plus apparaître');
});

test('surface de la chambre : « salle d’eau comprise » seulement si la salle d’eau est privative, décimales à la française', () => {
  const villa = m.CASES.LaVilla_2_indivision;
  assert.ok(objetText(villa).includes('Surface : 16 m² (salle d\'eau comprise)'));
  const shared = { ...villa, room: { ...villa.room, name: 'La Villa 7', number: 7, surface_m2: 15.5, bathroom: 'shared', bathroom_detail: 'douche, lavabo, WC' } };
  const t = objetText(shared);
  assert.ok(t.includes('Chambre : La Villa 7 - Surface : 15,5 m²'), t);
  assert.ok(!t.includes('15,5 m² (salle d\'eau comprise)'));
  assert.ok(!t.includes('15.5'));
});

test('propertyToLease : la surface totale intérieure vient de properties.equipment.interior_total_m2', () => {
  const p = m.propertyToLease({
    id: 'x', slug: 'leloft', name: 'Le Loft', address: '1 rue des Marronniers - 74100 Ambilly - France', city: 'Ambilly', room_count: 7,
    common_areas: [], entity_id: null, is_coliving: true, dpe_class: 'C', surface_total_m2: 249,
    equipment: { pool: 'indoor', sauna: true, gym: true, cinema: true, interior_total_m2: 309 },
    setting_clause_fr: null, zone_tendue: true, relocation_exception_default: null, buildings_fr: ['a', 'b'], buildings_intro_fr: null,
  });
  assert.equal(p.surface_interior_m2, 309);
  assert.equal(p.building_kind, 'Maison de ville');
  assert.equal(p.leisure_equipment, 'piscine intérieure, sauna, salle de sport, home cinéma');
});

test('dernier bail : deux baux de même date d’entrée → le plus récemment créé (bail signé après le brouillon)', () => {
  const draft = { lease_version: 'v2', status: 'draft', start_date: '2026-11-01', end_date: '2027-10-31', created_at: '2026-10-23T12:35:23Z', rent_eur: 1530, rent_hc_eur: null, charges_forfait_eur: null, charges_energy_chf: 110, charges_maintenance_chf: 90, charges_services_chf: 90 };
  const signed = { ...draft, status: 'signed', created_at: '2026-10-26T07:22:49Z', rent_hc_eur: 1220, charges_forfait_eur: 310 };
  for (const order of [[draft, signed], [signed, draft]]) {
    assert.equal(m.previousLeaseFacts(order, '2026-11-10').prev_hc, 1220);
  }
});
