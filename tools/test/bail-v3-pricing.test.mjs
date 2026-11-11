// Calculs du bail v3 (src/lib/bailV3/pricing.ts) et formats (format.ts) : plafond de relocation, dérogation, dépôt, frais, prorata.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computePricing, monthsBetween } from '../../src/lib/bailV3/pricing.ts';
import { fEUR, fCHF, fDate, addMonths, addDays, roman } from '../../src/lib/bailV3/format.ts';

const base = { totalCc: 1530, forfait: 344, prevHc: 1149, prevDepartureIso: '2026-10-30', irlNew: 148.06, irlOld: 145.77, zoneTendue: true, surfaceM2: 16, startIso: '2026-12-01', eurChf: 0.9227 };

test('La Villa 2 : plafond de relocation inférieur à la cible → loyer plafonné', () => {
  const p = computePricing(base);
  assert.equal(p.hcTarget, 1186);
  assert.equal(p.cap, 1167);            // 1 149 × 148,06 / 145,77
  assert.equal(p.capped, true);
  assert.equal(p.hc, 1167);
  assert.equal(p.total, 1511);
  assert.equal(p.deposit, 2334);        // 2 × HC
  assert.equal(p.fees, 208);            // 16 m² × (10 + 3)
  assert.equal(p.feeDossier, 160);
  assert.equal(p.feeEdl, 48);
  assert.equal(p.prorataDays, null);    // entrée le 1er
  assert.equal(p.exposedPremium, 0);
});

test('Le Lodge 1 : plafond supérieur à la cible → loyer cible, prorata en trentièmes', () => {
  const p = computePricing({ ...base, forfait: 336, prevHc: 1221, startIso: '2026-12-10', surfaceM2: 18 });
  assert.equal(p.cap, 1240);
  assert.equal(p.capped, false);
  assert.equal(p.hc, 1194);
  assert.equal(p.prorataDays, 21);
  assert.equal(p.prorataTotal, 1071);   // (1 194 + 336) × 21 / 30
  assert.equal(p.fees, 234);
});

test('dérogation : loyer cible appliqué, prime exposée calculée', () => {
  const p = computePricing({ ...base, forfait: 356, prevHc: 1052, surfaceM2: 23, override: true, startIso: '2026-12-15' });
  assert.equal(p.cap, 1069);
  assert.equal(p.capped, true);
  assert.equal(p.hc, 1174);
  assert.equal(p.exposedPremium, 105);
  assert.equal(p.total, 1530);
  assert.equal(p.prorataDays, 16);
});

test('exceptions : première location, vacance > 18 mois, exception légale → pas de plafond', () => {
  assert.equal(computePricing({ ...base, prevHc: null }).capApplies, false);
  assert.equal(computePricing({ ...base, prevDepartureIso: '2024-01-15' }).capApplies, false);
  assert.equal(computePricing({ ...base, exception: 'works' }).capApplies, false);
  assert.equal(computePricing({ ...base, zoneTendue: false }).capApplies, false);
  assert.equal(computePricing({ ...base, prevHc: null }).hc, 1186);
});

test('utilitaires de dates et de formats', () => {
  assert.equal(monthsBetween('2025-04-30', '2026-12-01'), 20);
  assert.equal(addDays(addMonths('2026-12-10', 12), -1), '2027-12-09');
  assert.equal(fDate('2026-12-01'), '1er décembre 2026');
  assert.equal(fEUR(1511), '1 511 €');
  assert.equal(fEUR(344.27), '344,27 €');
  assert.equal(fCHF(1076.6), '1 077 CHF');
  assert.equal(roman(14), 'XIV');
  assert.equal(roman(20), 'XX');
});
