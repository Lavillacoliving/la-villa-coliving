// Saisie manuelle des charges par maison et par exercice (lot 2 du bail v3, 10/11/2026) : règles de
// src/lib/bailV3/charges.ts (forfait en vigueur = règle de la vue v_property_current_charges, rappel du tableau de
// bord) et de src/lib/bailV3/chargesEntry.ts (brouillon, contrôles, données enregistrées, état récapitulatif).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const bundle = await build({
  stdin: {
    contents: "export * from './src/lib/bailV3/charges'; export * from './src/lib/bailV3/chargesEntry'; export { CHARGE_POSTES } from './src/data/chargePostes';",
    resolveDir: ROOT,
    loader: 'ts',
  },
  bundle: true, write: false, format: 'esm', platform: 'neutral', target: 'es2022',
  alias: { '@': path.join(ROOT, 'src') }, logLevel: 'silent',
});
const m = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text, 'utf8').toString('base64')}`);

const VILLA = 'villa';
const seed = { id: 's26', property_id: VILLA, fiscal_year: 2026, method: 'provisional_2025_plus_10', status: 'provisoire', effective_from: '2026-10-26', per_room_month_eur: 344.27 };
const closing = (over = {}) => ({ id: 'c26', property_id: VILLA, fiscal_year: 2026, method: 'manual_closing', status: 'valide', effective_from: '2026-10-26', per_room_month_eur: 352.1, ...over });

// ───────── forfait en vigueur (même règle que la vue SQL) ─────────
test('forfait en vigueur : date d’effet atteinte, le validé prime sur le provisoire, puis le plus récent', () => {
  assert.equal(m.currentExercise([seed], VILLA, '2026-10-25'), null);
  assert.equal(m.currentExercise([seed], VILLA, '2026-11-10').id, 's26');
  const older = closing({ id: 'c25', fiscal_year: 2025, effective_from: '2026-03-01' });
  assert.equal(m.currentExercise([seed, older], VILLA, '2026-11-10').id, 'c25', 'un exercice validé prime sur la projection, même plus ancien');
  const next = closing({ id: 'c27', fiscal_year: 2027, effective_from: '2028-03-01' });
  assert.equal(m.currentExercise([closing(), next], VILLA, '2028-02-28').id, 'c26');
  assert.equal(m.currentExercise([closing(), next], VILLA, '2028-03-01').id, 'c27');
  assert.equal(m.currentExercise([seed], 'autre-maison', '2026-11-10'), null);
});

test('phrase d’état d’une saisie : en vigueur, à venir, à valider, remplacée', () => {
  const next = { ...closing({ id: 'c27', fiscal_year: 2027, effective_from: '2028-03-01' }) };
  assert.deepEqual(m.exerciseStanding([closing(), next], 'c26', '2028-02-10'), { kind: 'current' });
  assert.deepEqual(m.exerciseStanding([closing(), next], 'c27', '2028-02-10'), { kind: 'future', from: '2028-03-01' });
  assert.deepEqual(m.exerciseStanding([closing(), { ...next, status: 'provisoire' }], 'c27', '2028-02-10'), { kind: 'future_needs_validation', from: '2028-03-01', by: 2026 });
  assert.deepEqual(m.exerciseStanding([closing(), { ...next, status: 'provisoire' }], 'c27', '2028-04-01'), { kind: 'needs_validation', by: 2026 });
  assert.deepEqual(m.exerciseStanding([closing(), next], 'c26', '2028-04-01'), { kind: 'superseded', by: 2027 });
});

// ───────── rappel du tableau de bord ─────────
test('rappel : rien en 2026 (les forfaits provisoires reposent sur le réel 2025), rappel dès le 1er février 2027', () => {
  const houses = [{ id: VILLA, name: 'La Villa' }];
  assert.equal(m.expectedChargesYear('2026-11-10'), 2025);
  assert.equal(m.expectedChargesYear('2027-01-31'), 2025);
  assert.equal(m.expectedChargesYear('2027-02-01'), 2026);
  assert.deepEqual(m.housesMissingCharges([seed], houses, '2026-11-10'), []);
  assert.deepEqual(m.housesMissingCharges([seed], houses, '2027-01-31'), []);
  assert.deepEqual(m.housesMissingCharges([seed], houses, '2027-02-01'), houses);
  // une projection validée par erreur ne compte pas comme une clôture
  assert.deepEqual(m.housesMissingCharges([{ ...seed, status: 'valide' }], houses, '2027-02-01'), houses);
  // clôture 2026 saisie mais pas validée : toujours à faire ; validée : à jour jusqu'au 31 janvier 2028
  assert.deepEqual(m.housesMissingCharges([closing({ status: 'provisoire' })], houses, '2027-02-15'), houses);
  assert.deepEqual(m.housesMissingCharges([closing()], houses, '2027-02-15'), []);
  assert.deepEqual(m.housesMissingCharges([closing()], houses, '2028-01-31'), []);
  assert.deepEqual(m.housesMissingCharges([closing()], houses, '2028-02-01'), houses);
  assert.deepEqual(m.housesMissingCharges([], houses, '2026-11-10'), houses, 'une maison sans aucune saisie est signalée');
  // remplacer la projection 2026 par des lignes réelles avant la fin de l'année ne déclenche aucun rappel « 2025 »
  assert.deepEqual(m.housesMissingCharges([closing({ status: 'provisoire' })], houses, '2026-11-10'), []);
});

// ───────── brouillon ─────────
test('montants : virgule, espaces et symbole acceptés ; vide = ligne ignorée ; texte = signalé', () => {
  assert.equal(m.parseAmount('1 234,56'), 1234.56);
  assert.equal(m.parseAmount('4512.3'), 4512.3);
  assert.equal(m.parseAmount('685 €'), 685);
  assert.equal(m.parseAmount(''), 0);
  assert.ok(Number.isNaN(m.parseAmount('environ 4000')));
  assert.ok(Number.isNaN(m.parseAmount('-50')));
  assert.equal(m.amountInput(456.39), '456,39');
  assert.equal(m.amountInput(41312), '41312');
});

test('nouvel exercice : postes récupérables du décret, TEOM de l’avis 2026 préremplie, effet au 1er du mois suivant', () => {
  const d = m.newExerciseDraft({ propertyId: VILLA, houseSlug: 'lavilla', roomCount: 10, fiscalYear: 2026, todayIso: '2027-02-10' });
  assert.equal(d.effective_from, '2027-03-01');
  assert.equal(d.status, 'provisoire');
  const codes = d.lines.map((l) => l.poste_code);
  assert.ok(codes.includes('eau') && codes.includes('energie') && codes.includes('teom') && codes.includes('chaudiere_entretien'));
  assert.ok(!codes.includes('projection_2025_plus_10') && !codes.includes('autre') && !codes.includes('piscine_exploitation') && !codes.includes('internet'));
  const teom = d.lines.find((l) => l.poste_code === 'teom');
  assert.equal(teom.amount, '685');
  assert.equal(teom.source, 'avis de taxe foncière 2026');
  assert.equal(d.lines.find((l) => l.poste_code === 'chaudiere_entretien').pct, '90');
  assert.equal(m.newExerciseDraft({ propertyId: 'x', houseSlug: 'lelodge', roomCount: 12, fiscalYear: 2027, todayIso: '2027-12-05' }).effective_from, '2028-01-01');
  assert.equal(m.newExerciseDraft({ propertyId: 'x', houseSlug: 'lelodge', roomCount: 12, fiscalYear: 2027, todayIso: '2027-12-05' }).lines.find((l) => l.poste_code === 'teom').amount, '');
});

const draft = (lines, over = {}) => ({ id: 's26', property_id: VILLA, fiscal_year: 2026, status: 'provisoire', effective_from: '2026-10-26', notes: '', room_count: 10, lines: lines.map((l, i) => ({ key: `k${i}`, label: '', source: '', pct: '100', ...l })), ...over });

test('totaux : part récupérable par ligne, forfait = total ÷ chambres ÷ 12, arrondi à l’euro dans le bail', () => {
  const d = draft([{ poste_code: 'energie', amount: '18 000' }, { poste_code: 'chaudiere_entretien', amount: '450', pct: '90' }, { poste_code: 'teom', amount: '685' }, { poste_code: 'eau', amount: '' }]);
  const t = m.draftTotals(d);
  assert.deepEqual(t.perLine, [18000, 405, 685, 0]);
  assert.equal(t.total, 19090);
  assert.equal(t.perRoomMonth, 159.08);
  assert.equal(t.printed, 159);
  assert.equal(t.filled, 3);
  // la projection d'origine redonne le forfait provisoire connu
  assert.equal(m.draftTotals(draft([{ poste_code: 'projection_2025_plus_10', amount: '41312' }])).perRoomMonth, 344.27);
});

test('données enregistrées : lignes vides écartées, ordre de l’écran, méthode déduite des lignes', () => {
  const p = m.draftToPayload(draft([{ poste_code: 'eau', amount: '' }, { poste_code: 'energie', amount: '18000,50', source: ' clôture cabinet 2026 ' }, { poste_code: 'autre', label: ' Ramonage ', amount: '120' }], { notes: '  ' }));
  assert.equal(p.id, 's26');
  assert.equal(p.header.method, 'manual_closing');
  assert.equal(p.header.total_recoverable_eur, 18120.5);
  assert.equal(p.header.notes, null);
  assert.deepEqual(p.lines.map((l) => [l.poste_code, l.amount_eur, l.sort_order, l.source]), [['energie', 18000.5, 0, 'clôture cabinet 2026'], ['autre', 120, 1, null]]);
  assert.equal(p.lines[1].label, 'Ramonage');
  assert.ok(p.lines[0].label.startsWith('Énergie'));
  assert.equal(m.draftToPayload(draft([{ poste_code: 'projection_2025_plus_10', amount: '41312' }])).header.method, 'provisional_2025_plus_10');
});

test('contrôles : montant illisible, pourcentage hors bornes, poste en double, « autre » sans nom, aucun montant', () => {
  const ctx = { rows: [seed], todayIso: '2026-11-10' };
  assert.deepEqual(m.draftIssues(draft([{ poste_code: 'energie', amount: '18000' }]), ctx), []);
  assert.match(m.draftIssues(draft([{ poste_code: 'energie', amount: 'dix mille' }]), ctx).join(' | '), /Montant illisible/);
  assert.match(m.draftIssues(draft([{ poste_code: 'energie', amount: '100', pct: '120' }]), ctx).join(' | '), /entre 0 et 100/);
  assert.match(m.draftIssues(draft([{ poste_code: 'energie', amount: '100' }, { poste_code: 'energie', amount: '50' }]), ctx).join(' | '), /figure deux fois/);
  assert.match(m.draftIssues(draft([{ poste_code: 'autre', amount: '100' }]), ctx).join(' | '), /Donne un nom/);
  assert.match(m.draftIssues(draft([{ poste_code: 'energie', amount: '' }]), ctx).join(' | '), /au moins un montant/);
  // deux lignes « autre » nommées sont permises
  assert.deepEqual(m.draftIssues(draft([{ poste_code: 'autre', label: 'Ramonage', amount: '100' }, { poste_code: 'autre', label: 'Dératisation', amount: '80' }]), ctx), []);
});

test('contrôles : un exercice par maison et par année ; jamais de trou dans le forfait en vigueur', () => {
  const ctx = { rows: [seed], todayIso: '2026-11-10' };
  const second = draft([{ poste_code: 'energie', amount: '100' }], { id: null });
  assert.match(m.draftIssues(second, ctx).join(' | '), /existe déjà/);
  // repousser la date d'effet de la seule saisie en vigueur laisserait la maison sans forfait
  const postponed = draft([{ poste_code: 'energie', amount: '18000' }], { effective_from: '2027-03-01' });
  assert.match(m.draftIssues(postponed, ctx).join(' | '), /plus de forfait en vigueur/);
  // un nouvel exercice à date future ne crée pas de trou : l'ancien reste en vigueur jusque-là
  const next = draft([{ poste_code: 'energie', amount: '18000' }], { id: null, fiscal_year: 2027, effective_from: '2027-03-01' });
  assert.deepEqual(m.draftIssues(next, { rows: [seed], todayIso: '2026-12-01' }), []);
  // une maison sans aucun forfait peut recevoir une première saisie à date future
  assert.deepEqual(m.draftIssues(next, { rows: [], todayIso: '2026-12-01' }), []);
  assert.match(m.draftIssues(draft([{ poste_code: 'energie', amount: '1' }], { id: null, fiscal_year: 2031 }), ctx).join(' | '), /entre 2021 et 2027/);
});

test('validation : une projection reste provisoire ; effet annoncé sur le forfait des nouveaux baux', () => {
  assert.equal(m.validationIssues(draft([{ poste_code: 'projection_2025_plus_10', amount: '41312' }])).length, 1);
  assert.deepEqual(m.validationIssues(draft([{ poste_code: 'energie', amount: '18000' }])), []);
  // valider la clôture 2026 dans la saisie existante : le forfait du jour passe de 344 à 352 €
  const d = draft([{ poste_code: 'energie', amount: '42252' }]);
  const ch = m.forfaitChange([seed], d, 'valide', '2027-02-20');
  assert.deepEqual(ch.before, { fiscal_year: 2026, printed: 344 });
  assert.deepEqual(ch.after, { fiscal_year: 2026, printed: 352 });
  assert.equal(ch.changes, true);
  // un nouvel exercice à date future ne change rien aujourd'hui
  const next = draft([{ poste_code: 'energie', amount: '50000' }], { id: null, fiscal_year: 2027, effective_from: '2028-03-01' });
  assert.equal(m.forfaitChange([closing()], next, 'valide', '2028-02-10').changes, false);
  // attention : valider un exercice ancien déjà en vigueur prend la place de la projection
  const old = draft([{ poste_code: 'energie', amount: '37560' }], { id: null, fiscal_year: 2025, effective_from: '2026-03-01' });
  const ch2 = m.forfaitChange([seed], old, 'valide', '2026-11-10');
  assert.deepEqual(ch2.after, { fiscal_year: 2025, printed: 313 });
  assert.equal(ch2.changes, true);
});

test('saisir la clôture : la projection laisse la place aux postes du décret, les lignes déjà saisies restent', () => {
  const d = m.replaceProjection(draft([{ poste_code: 'projection_2025_plus_10', amount: '41312' }, { poste_code: 'teom', amount: '700', source: 'avis' }]), 'lavilla');
  const codes = d.lines.map((l) => l.poste_code);
  assert.ok(!codes.includes('projection_2025_plus_10'));
  assert.equal(codes.filter((c) => c === 'teom').length, 1);
  assert.equal(d.lines.find((l) => l.poste_code === 'teom').amount, '700');
  assert.ok(codes.includes('eau') && codes.includes('energie'));
});

test('état récapitulatif : libellés sans repère interne, total et forfait recalculés, jamais les notes', () => {
  const ex = {
    id: 's26', property_id: VILLA, fiscal_year: 2026, method: 'provisional_2025_plus_10', status: 'provisoire', total_recoverable_eur: 41312, room_count: 10,
    per_room_month_eur: 344.27, effective_from: '2026-10-26', validated_at: null, validated_by: null, notes: 'note interne à ne pas imprimer',
    lines: [{ id: 'l1', property_charges_id: 's26', poste_code: 'projection_2025_plus_10', label: 'Projection : charges récupérables réelles 2025 + 10 % (D12-bis)', amount_eur: 41312, recoverable_pct: 100, recoverable_eur: 41312, source: null, sort_order: 0 }],
  };
  const st = m.statementFromExercise(ex, { name: 'La Villa', address: '34 rue du Foron, 74100 Ville-la-Grand' }, { name: 'Indivision Austin-Piot', address: '34 rue du Foron, 74100 Ville-la-Grand' }, '2026-11-10');
  assert.equal(st.lines[0].label, 'Projection : charges récupérables réelles 2025 + 10 %');
  assert.equal(st.total, 41312);
  assert.equal(st.per_room_month, 344.27);
  assert.equal(st.printed, 344);
  assert.equal(st.provisional, true);
  assert.equal(st.projection, true);
  assert.ok(!JSON.stringify(st).includes('note interne'));
  assert.equal(m.publicLabel('Internet et abonnements (D2 : dans le loyer)'), 'Internet et abonnements');
});

// ───────── bien loué en entier (Mont-Blanc, 10/11/2026) ─────────
test('logement entier : montant par mois, sans chambres ni baux générés ; coliving inchangé', () => {
  const room = m.chargesWording('chambre', 10);
  assert.equal(room.perUnit, 'par chambre et par mois');
  assert.equal(room.divisor, '÷ 10 chambres ÷ 12 mois');
  assert.equal(room.rounded, true);
  assert.match(room.intro, /générateur de bail prend le forfait/);
  const whole = m.chargesWording('logement', 1);
  assert.equal(whole.title, 'Charges du logement');
  assert.equal(whole.perUnit, 'par mois');
  assert.equal(whole.divisor, '÷ 12 mois');
  assert.equal(whole.rounded, false);
  assert.match(whole.intro, /hors du générateur de bail/);
  for (const text of Object.values(whole).filter((v) => typeof v === 'string')) assert.ok(!/chambre/i.test(text), text);
  assert.equal(m.chargesWording('logement', 3).divisor, '÷ 3 logements ÷ 12 mois');
  // même calcul : total ÷ 1 logement ÷ 12
  const d = draft([{ poste_code: 'eau', amount: '1 800' }, { poste_code: 'teom', amount: '612,40' }], { property_id: 'mb', room_count: 1 });
  assert.equal(m.draftTotals(d).perRoomMonth, 201.03);
});

test('logement entier : état récapitulatif marqué « logement », sans bailleur quand il n’a pas d’identité juridique', () => {
  const ex = {
    id: 'mb26', property_id: 'mb', fiscal_year: 2026, method: 'manual_closing', status: 'valide', total_recoverable_eur: 2412.4, room_count: 1,
    per_room_month_eur: 201.03, effective_from: '2027-03-01', validated_at: '2027-02-12T10:00:00Z', validated_by: 'x', notes: null,
    lines: [{ id: 'l1', property_charges_id: 'mb26', poste_code: 'eau', label: 'Eau froide et chaude (résidents et communs)', amount_eur: 2412.4, recoverable_pct: 100, recoverable_eur: 2412.4, source: null, sort_order: 0 }],
  };
  const st = m.statementFromExercise(ex, { name: 'Mont-Blanc', address: '8 rue du Mont-Blanc, 74100 Annemasse' }, null, '2027-02-12', 'logement');
  assert.equal(st.unit, 'logement');
  assert.equal(st.lessor, null);
  assert.equal(st.per_room_month, 201.03);
  // par défaut : la chambre (les trois colivings)
  assert.equal(m.statementFromExercise(ex, { name: 'x', address: 'y' }, null, '2027-02-12').unit, 'chambre');
});

test('rappel : un bien loué en entier n’est suivi qu’à partir de sa première saisie', () => {
  const houses = [{ id: VILLA, name: 'La Villa', is_coliving: true }, { id: 'mb', name: 'Mont-Blanc', is_coliving: false }];
  assert.deepEqual(m.housesFollowedForCharges(houses, [seed]).map((h) => h.name), ['La Villa']);
  // aujourd'hui : Mont-Blanc est vide, aucun rappel pour lui ni en 2026 ni en février 2027
  assert.deepEqual(m.housesMissingCharges([seed], m.housesFollowedForCharges(houses, [seed]), '2027-02-10').map((h) => h.name), ['La Villa']);
  // dès qu'il a une saisie, il entre dans le cycle
  const mb = { id: 'mb26', property_id: 'mb', fiscal_year: 2026, method: 'manual_closing', status: 'valide', effective_from: '2027-03-01' };
  assert.deepEqual(m.housesFollowedForCharges(houses, [seed, mb]).map((h) => h.name), ['La Villa', 'Mont-Blanc']);
  assert.deepEqual(m.housesMissingCharges([seed, mb], m.housesFollowedForCharges(houses, [seed, mb]), '2028-02-10').map((h) => h.name), ['La Villa', 'Mont-Blanc']);
});
