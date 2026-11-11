// Rappels « Augmentations IRL à prévoir » du tableau de bord (correctif du 11/11/2026) :
// une entrée à venir n'est pas un anniversaire — pas de rappel, pas de bouton « Appliquer ».
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextLeaseAnniversary, hasLeftBy } from '../../src/lib/irlAnniversary.ts';

const TODAY = new Date(2026, 10, 11, 10, 30); // 11 novembre 2026, 10 h 30 (heure locale)
const ymd = (d) => d && `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const daysUntil = (d) => Math.ceil((d.getTime() - TODAY.getTime()) / 86400000);

test('entrée à venir l\'an prochain (cas du 11/11/2026) : aucun anniversaire', () => {
  assert.equal(nextLeaseAnniversary('2027-01-01', TODAY), null);
});

test('entrée à venir cette année : aucun anniversaire', () => {
  assert.equal(nextLeaseAnniversary('2026-12-01', TODAY), null);
  assert.equal(nextLeaseAnniversary('2026-11-12', TODAY), null);
});

test('entrée il y a moins d\'un an : premier anniversaire l\'année suivante', () => {
  const next = nextLeaseAnniversary('2026-01-02', TODAY);
  assert.equal(ymd(next), '2027-01-02');
  assert.equal(daysUntil(next), 52);
});

test('entrée ancienne : anniversaire de cette année s\'il est encore à venir, sinon l\'an prochain', () => {
  assert.equal(ymd(nextLeaseAnniversary('2023-12-20', TODAY)), '2026-12-20');
  assert.equal(ymd(nextLeaseAnniversary('2021-10-01', TODAY)), '2027-10-01');
  assert.equal(ymd(nextLeaseAnniversary('2025-11-30', TODAY)), '2026-11-30');
});

test('entrée aujourd\'hui même : le prochain anniversaire est dans un an (comportement d\'origine)', () => {
  assert.equal(ymd(nextLeaseAnniversary('2026-11-11', TODAY)), '2027-11-11');
  assert.equal(ymd(nextLeaseAnniversary('2025-11-11', TODAY)), '2027-11-11');
});

test('un objet Date est accepté, une date illisible ne lève pas d\'exception', () => {
  assert.equal(ymd(nextLeaseAnniversary(new Date(2026, 0, 2), TODAY)), '2027-01-02');
  assert.equal(nextLeaseAnniversary('', TODAY), null);
  assert.equal(nextLeaseAnniversary('pas une date', TODAY), null);
});

test('même résultat que l\'ancien calcul pour toute entrée passée', () => {
  for (const iso of ['2021-10-01', '2022-02-28', '2023-06-15', '2024-12-31', '2025-01-01', '2025-11-10', '2026-01-02', '2026-06-30', '2026-11-10']) {
    const [y, m, d] = iso.split('-').map(Number);
    const moveIn = new Date(y, m - 1, d);
    const old = new Date(TODAY.getFullYear(), moveIn.getMonth(), moveIn.getDate());
    if (old < TODAY) old.setFullYear(old.getFullYear() + 1);
    assert.equal(ymd(nextLeaseAnniversary(iso, TODAY)), ymd(old), iso);
  }
});

test('locataire parti avant l\'anniversaire : plus là, donc pas de révision', () => {
  const next = nextLeaseAnniversary('2026-01-02', TODAY); // 2 janvier 2027
  assert.equal(hasLeftBy('2026-10-30', next), true);   // déjà parti
  assert.equal(hasLeftBy('2026-12-22', next), true);   // départ prévu avant l'anniversaire
  assert.equal(hasLeftBy('2027-01-02', next), true);   // part le jour même
  assert.equal(hasLeftBy('2027-01-03', next), false);  // encore là à l'anniversaire
});

test('sans date de départ, ou date illisible : le locataire est considéré présent', () => {
  const next = nextLeaseAnniversary('2026-01-02', TODAY);
  assert.equal(hasLeftBy(null, next), false);
  assert.equal(hasLeftBy(undefined, next), false);
  assert.equal(hasLeftBy('', next), false);
  assert.equal(hasLeftBy('pas une date', next), false);
});

test('règle complète sur les cas du 11/11/2026 : seul le locataire en place depuis janvier garde son rappel', () => {
  const fiches = [
    { id: 'lodge 5, en place', e: '2026-01-02', s: null, rappel: true },
    { id: 'lodge 7, parti le 30/10', e: '2026-01-02', s: '2026-10-30', rappel: false },
    { id: 'lodge 9, entre le 01/01/2027', e: '2027-01-01', s: null, rappel: false },
    { id: 'villa 8, entre demain', e: '2026-11-12', s: null, rappel: false },
  ];
  for (const f of fiches) {
    const next = nextLeaseAnniversary(f.e, TODAY);
    const days = next ? daysUntil(next) : null;
    const shown = !!next && !hasLeftBy(f.s, next) && days <= 61 && days >= 0;
    assert.equal(shown, f.rappel, f.id);
  }
});
