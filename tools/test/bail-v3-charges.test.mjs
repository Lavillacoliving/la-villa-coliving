// Forfait de charges du bail v3 (src/lib/bailV3/charges.ts) et référentiel des postes (src/data/chargePostes.ts).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { perRoomMonthEur, recoverableEur, totalRecoverableEur } from '../../src/lib/bailV3/charges.ts';
import { CHARGE_POSTES, chargePosteLabel } from '../../src/data/chargePostes.ts';

test('forfait D12-bis : réel 2025 + 10 % divisé par chambres et par 12', () => {
  assert.equal(perRoomMonthEur(41312, 10), 344.27); // La Villa
  assert.equal(perRoomMonthEur(48372, 12), 335.92); // Le Lodge
  assert.equal(perRoomMonthEur(29883, 7), 355.75); // Le Loft
});

test('forfait : entrées invalides → 0', () => {
  assert.equal(perRoomMonthEur(1000, 0), 0);
  assert.equal(perRoomMonthEur(-1, 10), 0);
  assert.equal(perRoomMonthEur(NaN, 10), 0);
});

test('part récupérable : chaudière à 90 %, piscine à 0 %, bornes respectées', () => {
  assert.equal(recoverableEur(450, 90), 405);
  assert.equal(recoverableEur(5000, 0), 0);
  assert.equal(recoverableEur(100, 150), 100);
  assert.equal(totalRecoverableEur([{ amount_eur: 450, recoverable_pct: 90 }, { amount_eur: 685, recoverable_pct: 100 }]), 1090);
});

test('référentiel des postes : codes uniques, pourcentages entre 0 et 100, piscine et internet hors forfait', () => {
  const codes = CHARGE_POSTES.map((p) => p.code);
  assert.equal(new Set(codes).size, codes.length);
  for (const p of CHARGE_POSTES) assert.ok(p.defaultPct >= 0 && p.defaultPct <= 100, p.code);
  assert.equal(CHARGE_POSTES.find((p) => p.code === 'piscine_exploitation').defaultPct, 0);
  assert.equal(CHARGE_POSTES.find((p) => p.code === 'internet').defaultPct, 0);
  assert.equal(CHARGE_POSTES.find((p) => p.code === 'chaudiere_entretien').defaultPct, 90);
  assert.equal(chargePosteLabel('inconnu'), 'inconnu');
});
