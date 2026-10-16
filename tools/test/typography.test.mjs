// Règle d'affichage des milliers du blog (src/lib/typography.ts, décision de Jérôme du 16/10/2026) :
// espace normale entre groupes de milliers → espace insécable, rien d'autre ne bouge.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nbspThousands } from '../../src/lib/typography.ts';

const NB = ' ';

test('milliers : espaces normales → insécables (prix, fourchettes, tableaux)', () => {
  assert.equal(nbspThousands('80 000-100 000 CHF brut/an'), `80${NB}000-100${NB}000 CHF brut/an`);
  assert.equal(nbspThousands('| Studio Genève | 2 000-2 800 CHF |'), `| Studio Genève | 2${NB}000-2${NB}800 CHF |`);
  assert.equal(nbspThousands('soit 148 200 CHF'), `soit 148${NB}200 CHF`);
  assert.equal(nbspThousands('1 234 567 habitants'), `1${NB}234${NB}567 habitants`);
  assert.equal(nbspThousands('dès 1 370 CHF et 3 000 €.'), `dès 1${NB}370 CHF et 3${NB}000 €.`);
});

test('longueur inchangée (les découpes calculées sur le texte restent valides)', () => {
  const s = 'Un loyer de 1 500 CHF sur un net de 5 300 à 7 000 CHF/mois.';
  assert.equal(nbspThousands(s).length, s.length);
});

test('rien à faire : déjà insécable, notation anglaise, années, petits nombres, téléphone', () => {
  for (const s of [
    `dès 1${NB}370 CHF`,
    'CHF 1,370 to 1,430 a month',
    'depuis 2019 et en 2026 000 cas',
    '18 à 24 min, 7 min, 30 min',
    '+33 6 64 31 51 34',
    'version 1.500 et 2,500 kg',
    'les 12 et 13 octobre',
  ]) assert.equal(nbspThousands(s), s, s);
});

test('liens et marqueurs markdown intacts', () => {
  assert.equal(nbspThousands('[le guide](/blog/salaire-suisse-net-frontalier-2026) : 7 000 CHF'), `[le guide](/blog/salaire-suisse-net-frontalier-2026) : 7${NB}000 CHF`);
  assert.equal(nbspThousands('<!-- entity-facts -->'), '<!-- entity-facts -->');
});
