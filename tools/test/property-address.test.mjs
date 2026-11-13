// Adresse d'une maison lue en base à l'exécution (lot « sécurité des adresses », 13/11/2026) : src/lib/propertyAddress.ts
// et son usage par le courrier de révision du loyer (tableau de bord, onglet Loyers). Adresses FICTIVES.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { propertyAddressLine, missingAddressMessage } from '../../src/lib/propertyAddress.ts';
import { leaseAddress } from '../../src/lib/bailV3/buildInput.ts';
import { addressLines } from '../../src/lib/portail/quittance.ts';
import * as entities from '../../src/lib/entities.ts';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const EN_DASH = String.fromCharCode(0x2013);

test('propertyAddressLine : « rue - code postal commune - France » de la base → « rue, code postal commune »', () => {
  assert.equal(propertyAddressLine('1 rue des Exemples - 74100 Ville-la-Grand - France'), '1 rue des Exemples, 74100 Ville-la-Grand');
  assert.equal(propertyAddressLine('4 rue du Faux-Exemple - 74100 Annemasse'), '4 rue du Faux-Exemple, 74100 Annemasse', 'sans pays ; le trait d\'union d\'un nom de voie est conservé');
  assert.equal(propertyAddressLine(`2 rue des Exemples ${EN_DASH} 74100 Ambilly ${EN_DASH} FRANCE`), '2 rue des Exemples, 74100 Ambilly');
  assert.equal(propertyAddressLine('3 rue des Exemples, 74100 Annemasse, France'), '3 rue des Exemples, 74100 Annemasse');
  assert.equal(propertyAddressLine('  3 rue des Exemples  -  74100 Annemasse  '), '3 rue des Exemples, 74100 Annemasse');
});

test('propertyAddressLine : adresse absente → null, jamais une valeur de remplacement', () => {
  for (const empty of [null, undefined, '', '   ', 'France', ' - ', ', ,']) assert.equal(propertyAddressLine(empty), null, JSON.stringify(empty));
});

test('même résultat que les écrans qui lisaient déjà l\'adresse en base (bail v3, quittance du portail)', () => {
  for (const raw of ['1 rue des Exemples - 74100 Ville-la-Grand - France', '4 rue du Faux-Exemple - 74100 Annemasse', '2 rue des Exemples - 74100 Ambilly - France']) {
    assert.equal(propertyAddressLine(raw), leaseAddress(raw), raw);
    assert.equal(propertyAddressLine(raw), addressLines(raw).join(', '), raw);
  }
});

test('missingAddressMessage : dit pourquoi le courrier n\'est pas généré, sans adresse par défaut', () => {
  assert.equal(missingAddressMessage('Le Lodge', false), 'Adresse absente de la fiche « Le Lodge » (onglet Maisons) : courrier non généré.');
  assert.equal(missingAddressMessage('', false), 'Adresse absente de la fiche de la maison (onglet Maisons) : courrier non généré.');
  assert.equal(missingAddressMessage(null, false), 'Adresse absente de la fiche de la maison (onglet Maisons) : courrier non généré.');
  assert.match(missingAddressMessage('Le Lodge', true), /^Adresse de la maison indisponible : les maisons n'ont pas pu être lues\./);
  for (const m of [missingAddressMessage('Le Lodge', false), missingAddressMessage('Le Lodge', true)]) assert.doesNotMatch(m, /\d{5}|\brue\b/i, 'aucune adresse dans le message');
});

test('plus aucune adresse de maison dans les constantes du code', () => {
  assert.equal(entities.PROPERTY_ADDRESSES, undefined);
  assert.ok(entities.ENTITY_SLUGS, 'le reste de entities.ts est intact');
});

test('courrier de révision du loyer : l\'adresse d\'expéditeur vient de properties.address, et son absence bloque le courrier', async () => {
  const page = await fs.readFile(path.join(ROOT, 'src/pages/dashboard/DashboardLoyersPage.tsx'), 'utf8');
  assert.match(page, /from\('properties'\)\.select\('id,name,slug,entity_id,address'\)/, 'la page lit address en base');
  assert.match(page, /propertyAddress:\s*propertyAddressLine\(prop\?\.address\)/, 'le rappel porte l\'adresse de la maison du locataire');
  assert.match(page, /if \(!propertyAddress\) \{ toast\.error\(missingAddressMessage\(r\.property, propertiesLoadFailed\)\); return; \}/, 'sans adresse : message, pas de courrier');
  assert.match(page, /setPropertiesLoadFailed\(!!prRes\.error\)/, 'un échec de lecture des maisons est mémorisé');
  assert.doesNotMatch(page, /PROPERTY_ADDRESSES/);
  const letter = await fs.readFile(path.join(ROOT, 'src/pages/dashboard/CourrierIRLPDF.tsx'), 'utf8');
  assert.match(letter, /\{data\.propertyAddress\}/, 'le courrier imprime l\'adresse reçue');
});
