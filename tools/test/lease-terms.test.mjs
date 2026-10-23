// Remise sur le 1er mois et caution en 1, 2 ou 3 fois (src/lib/leaseTerms.ts, demande Jérôme du 22/10/2026).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as L from '../../src/lib/leaseTerms.ts';

const fr = (iso) => iso.split('-').reverse().join('/');

test('caution en une fois : une seule échéance, à la signature', () => {
  assert.deepEqual(L.depositSchedule(2940, 1, '2026-11-01'), [{ index: 1, amount: 2940, dueDate: null }]);
});

test('caution en 3 fois : signature, puis le 5 des deux mois suivant le mois d\'entrée', () => {
  assert.deepEqual(L.depositSchedule(2940, 3, '2026-10-25'), [
    { index: 1, amount: 980, dueDate: null },
    { index: 2, amount: 980, dueDate: '2026-11-05' },
    { index: 3, amount: 980, dueDate: '2026-12-05' },
  ]);
});

test('caution en 2 fois sur un changement d\'année', () => {
  assert.deepEqual(L.depositSchedule(2860, 2, '2026-12-01').map((i) => i.dueDate), [null, '2027-01-05']);
});

test('la dernière échéance absorbe l\'arrondi, le total ne change jamais', () => {
  const s = L.depositSchedule(2941, 3, '2026-11-01');
  assert.deepEqual(s.map((i) => i.amount), [980.33, 980.33, 980.34]);
  assert.equal(Math.round(s.reduce((a, i) => a + i.amount, 0) * 100), 294100);
});

test('valeurs inconnues : 1 fois, dates absentes sans date d\'entrée', () => {
  assert.equal(L.normalizeInstallments(4), 1);
  assert.equal(L.normalizeInstallments('3'), 3);
  assert.deepEqual(L.depositSchedule(1000, 2, '').map((i) => i.dueDate), [null, null]);
});

test('remise : montant libre, jamais négative, plafonnée au 1er versement', () => {
  assert.equal(L.normalizeDiscount(''), 0);
  assert.equal(L.normalizeDiscount(-50), 0);
  assert.equal(L.normalizeDiscount('735.456'), 735.46);
  assert.equal(L.firstPaymentAfterDiscount(1470, 735), 735);
  assert.equal(L.firstPaymentAfterDiscount(332, 735), 0);
  assert.equal(L.discountError(1470, 735), null);
  assert.match(L.discountError(332, 735), /dépasse/);
});

test('mois de la remise : le mois d\'entrée si entrée le 1er, sinon le premier mois complet (règle du 23/10/2026)', () => {
  assert.equal(L.discountMonth('2026-11-01'), '2026-11');
  assert.equal(L.discountMonth('2026-11-25'), '2026-12');
  assert.equal(L.discountMonth('2026-12-15'), '2027-01');
  assert.equal(L.discountMonth(''), null);
  assert.equal(L.entersMidMonth('2026-11-01'), false);
  assert.equal(L.entersMidMonth('2026-11-25'), true);
  assert.equal(L.monthLabelFr('2026-12'), 'décembre 2026');
  assert.equal(L.monthLabelFr(null), '');
});

test('libellés du bail', () => {
  const s = L.depositSchedule(2940, 3, '2026-10-25');
  assert.equal(L.installmentDueLabel(s[0], fr), 'à la signature du bail');
  assert.equal(L.installmentDueLabel(s[1], fr), 'au plus tard le 05/11/2026, avec le loyer du deuxième mois');
  assert.equal(L.installmentsInWords(3), 'trois (3)');
  assert.equal(L.nextInstallment(s, 1)?.index, 2);
  assert.equal(L.nextInstallment(s, 3), null);
});
