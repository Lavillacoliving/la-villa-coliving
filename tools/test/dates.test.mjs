// Dates longues du blog (Lot B du brief « Formulaire, hydratation, mesure », 01/10/2026) :
// formatLongDate doit rendre EXACTEMENT l'ancien texte (toLocaleDateString fr-FR / en-US, long), mais
// d'après le calendrier de Paris — donc identique entre le prérendu (CI en UTC) et tout appareil.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatLongDate, MONTHS_FR, MONTHS_EN } from '../../src/lib/dates.ts';

test('même texte que l\'ancien toLocaleDateString (fr-FR / en-US, mois long)', () => {
  for (const iso of ['2026-09-12T08:00:00Z', '2026-01-01T12:00:00Z', '2026-08-31T15:30:00Z', '2026-03-09T09:00:00Z']) {
    const d = new Date(iso);
    const fr = d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Europe/Paris' });
    const en = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Europe/Paris' });
    assert.equal(formatLongDate(iso, 'fr'), fr, iso);
    assert.equal(formatLongDate(iso, 'en'), en, iso);
  }
});

test('calendrier de Paris : une mise à jour à 23:30 UTC compte pour le lendemain, partout', () => {
  assert.equal(formatLongDate('2026-09-29T23:30:00Z', 'fr'), '30 septembre 2026');
  assert.equal(formatLongDate('2026-12-31T23:30:00Z', 'en'), 'January 1, 2027');
  assert.equal(formatLongDate('2026-06-15T21:59:00Z', 'fr'), '15 juin 2026');
});

test('entrée illisible : chaîne vide, jamais d\'exception', () => {
  assert.equal(formatLongDate('', 'fr'), '');
  assert.equal(formatLongDate('pas une date', 'en'), '');
});

test('tableaux de mois complets', () => {
  assert.equal(MONTHS_FR.length, 12);
  assert.equal(MONTHS_EN.length, 12);
  assert.equal(MONTHS_FR[9], 'octobre');
  assert.equal(MONTHS_EN[10], 'November');
});
