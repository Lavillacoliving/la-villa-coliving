// Texte du bail v3 (src/lib/bailV3/clauses.ts) — décisions de Jérôme du 10/11/2026 (classeur « mise en ligne ») :
// article 2.1 avec surface habitable ET surface totale intérieure pour les trois maisons, parc de La Villa cité une
// seule fois (clause de cadre), « (salle d'eau comprise) » réservé aux salles d'eau privatives, surfaces décimales à la
// française ; dernier bail de la chambre départagé par la date de création quand deux baux ont la même date d'entrée.
// 10/11/2026 (La Villa 8) : le « précédent locataire » est le dernier bail qui a vraiment couru — ni brouillon, ni bail
// d'une fiche annulée (personne jamais venue), ni bail pas encore commencé ; le départ vient de la fiche du locataire.
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
      "export { previousLeaseFacts, isPastTenancy, propertyToLease } from './src/lib/bailV3/buildInput';",
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

// ---- précédent locataire : seuls comptent les baux qui ont vraiment couru ----
const lease = (o) => ({ lease_version: 'v2', status: 'active', start_date: null, end_date: null, created_at: null, rent_eur: null, rent_hc_eur: null,
  charges_forfait_eur: null, charges_energy_chf: null, charges_maintenance_chf: null, charges_services_chf: null, ...o });

test('précédent locataire : trois brouillons de personnes jamais venues ne passent pas devant la locataire sortante', () => {
  // Chambre libérée le 28/08/2026 ; depuis, trois baux préparés pour des personnes qui ne sont pas venues.
  const sortante = lease({ status: 'active', start_date: '2025-04-25', end_date: '2026-04-25', created_at: '2026-02-24T10:00:00Z', rent_eur: 1417,
    rent_hc_eur: 1072.73, charges_forfait_eur: 344.27, charges_energy_chf: 130, charges_maintenance_chf: 200, charges_services_chf: 500,
    tenants: { lease_status: 'active', move_out_date: '2026-08-28' } });
  const brouillon1 = lease({ status: 'draft', start_date: '2026-10-30', end_date: '2027-10-29', created_at: '2026-10-26T09:10:00Z', rent_eur: 1470, tenants: { lease_status: 'cancelled', move_out_date: null } });
  const brouillon2 = lease({ status: 'draft', start_date: '2026-11-02', end_date: '2027-11-01', created_at: '2026-10-30T13:36:00Z', rent_eur: 1470, tenants: { lease_status: 'cancelled', move_out_date: null } });
  // Annulé depuis le tableau de bord : le bail passe à « terminated », comme un vrai départ.
  const annule = lease({ status: 'terminated', start_date: '2026-11-10', end_date: '2027-11-09', created_at: '2026-11-07T10:37:00Z', rent_eur: 1470, rent_hc_eur: 1110, charges_forfait_eur: 360, tenants: { lease_status: 'cancelled', move_out_date: null } });
  for (const rows of [[annule, brouillon2, brouillon1, sortante], [sortante, brouillon1, brouillon2, annule]]) {
    const f = m.previousLeaseFacts(rows, '2026-11-10');
    assert.equal(f.prev_hc, 1072.73);
    assert.equal(f.prev_departure, '2026-08-28', 'départ réel de la fiche, pas la fin théorique du bail (25/04/2026)');
    assert.equal(f.prev_paid_on, '2026-08-05');
    assert.equal(f.source, 'bail du 25 avril 2025 (v2)');
    assert.equal(f.prev_revision, '[révision à préciser]');
  }
  assert.equal(m.isPastTenancy(annule, '2026-11-10'), false);
  assert.equal(m.isPastTenancy(brouillon1, '2026-11-10'), false);
  assert.equal(m.isPastTenancy(sortante, '2026-11-10'), true);
});

test('précédent locataire : le bail signé d’un futur entrant ne compte pas, l’occupant en place oui', () => {
  const occupante = lease({ status: 'active', start_date: '2026-07-01', end_date: '2027-06-30', rent_eur: 1497, charges_energy_chf: 130, charges_maintenance_chf: 200, charges_services_chf: 90,
    tenants: { lease_status: 'active', move_out_date: '2026-12-22' } });
  const futur = lease({ status: 'signed', start_date: '2027-01-01', end_date: '2027-12-31', rent_eur: 1530, rent_hc_eur: 1220, charges_forfait_eur: 310, tenants: { lease_status: 'signed', move_out_date: null } });
  const f = m.previousLeaseFacts([futur, occupante], '2026-11-10');
  assert.equal(f.prev_hc, 1077, '1 497 − 420 : le bail de l’occupante, pas celui du futur entrant');
  assert.equal(f.prev_departure, '2026-12-22', 'départ prévu de la fiche');
  assert.equal(f.prev_paid_on, '2026-12-05');
  // le jour où ce bail a commencé, il redevient le dernier bail de la chambre
  assert.equal(m.previousLeaseFacts([futur, occupante], '2027-01-01').prev_hc, 1220);
});

test('précédent locataire : aucun bail ayant couru → première location ; sans fiche jointe, la fin de bail passée sert de départ', () => {
  const brouillon = lease({ status: 'draft', start_date: '2026-11-01', rent_eur: 1470 });
  assert.deepEqual(m.previousLeaseFacts([brouillon], '2026-11-10'), { prev_hc: null, prev_paid_on: null, prev_revision: null, prev_departure: null, source: null });
  assert.deepEqual(m.previousLeaseFacts([], '2026-11-10'), { prev_hc: null, prev_paid_on: null, prev_revision: null, prev_departure: null, source: null });
  const ancien = lease({ status: 'ended', start_date: '2025-09-01', end_date: '2026-08-31', rent_eur: 1450, rent_hc_eur: 1030, charges_forfait_eur: 420 });
  const f = m.previousLeaseFacts([ancien], '2026-11-10');
  assert.equal(f.prev_hc, 1030);
  assert.equal(f.prev_departure, '2026-08-31');
  // bail d'un an reconduit tacitement, locataire toujours en place : la fin théorique du bail n'est pas un départ
  const reconduit = lease({ status: 'active', start_date: '2025-05-12', end_date: '2026-05-12', rent_eur: 1440, rent_hc_eur: 1095.73, charges_forfait_eur: 344.27, tenants: { lease_status: 'active', move_out_date: null } });
  const h = m.previousLeaseFacts([reconduit], '2026-11-10');
  assert.equal(h.prev_departure, null);
  assert.equal(h.prev_paid_on, '2026-11-05');
  // bail en cours sans date de sortie : pas de départ proposé, dernier loyer payé = mois courant
  const enCours = lease({ status: 'active', start_date: '2026-03-01', end_date: '2027-02-28', rent_eur: 1460, rent_hc_eur: 1003.61, tenants: { lease_status: 'active', move_out_date: null } });
  const g = m.previousLeaseFacts([enCours], '2026-11-10');
  assert.equal(g.prev_departure, null);
  assert.equal(g.prev_paid_on, '2026-11-05');
  assert.equal(g.prev_revision, 'aucune (bail du 1er mars 2026)');
});
