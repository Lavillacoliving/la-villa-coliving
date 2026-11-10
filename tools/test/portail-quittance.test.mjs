// Portail locataire (lot « portail » du bail v3, 10/11/2026) : règles de src/lib/portail/quittance.ts —
// répartition loyer / charges de la quittance, bailleur imprimé, bail ouvert par « Voir mon bail », doublons de fiches.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isV3Fiche, quittanceSplit, quittanceLessor, findLeaseDocument, documentLocation, filesNotInDocuments, pickTenantFiche, addressLines } from '../../src/lib/portail/quittance.ts';

const v3 = { rent_eur: 1186, charges_forfait_eur: 344, move_in_date: '2026-12-10' };
const old = { rent_eur: null, charges_forfait_eur: null, move_in_date: '2026-03-01' };

test('fiche v3 : loyer hors charges et forfait renseignés ; sinon bail antérieur', () => {
  assert.equal(isV3Fiche(v3), true);
  assert.equal(isV3Fiche(old), false);
  assert.equal(isV3Fiche({ rent_eur: 1186, charges_forfait_eur: null, move_in_date: null }), false);
  assert.equal(isV3Fiche({ rent_eur: 0, charges_forfait_eur: 344, move_in_date: null }), false);
});

test('bail v3, mois complet : la quittance reprend le loyer hors charges et le forfait du bail', () => {
  assert.deepEqual(quittanceSplit({ received: 1530, month: '2027-01', fiche: v3, propertyCharges: 360 }), { rent: 1186, charges: 344, basis: 'bail_v3' });
});

test('bail v3, mois d’entrée : le prorata en trentièmes du bail, au centime', () => {
  // entrée le 10 : 21/30 → loyer 830,20 + forfait 240,80 = 1 071,00
  assert.deepEqual(quittanceSplit({ received: 1071, month: '2026-12', fiche: v3, propertyCharges: 360 }), { rent: 830.2, charges: 240.8, basis: 'bail_v3' });
  // entrée le 15 d'une chambre à 1 194 + 336 : 16/30 → 636,80 + 179,20
  const lodge = { rent_eur: 1194, charges_forfait_eur: 336, move_in_date: '2026-12-15' };
  assert.deepEqual(quittanceSplit({ received: 816, month: '2026-12', fiche: lodge, propertyCharges: 420 }), { rent: 636.8, charges: 179.2, basis: 'bail_v3' });
});

test('bail v3, remise du premier mois et mois révisés : mêmes proportions que le bail', () => {
  // remise de 765 € sur le loyer et le forfait du premier mois complet
  const s = quittanceSplit({ received: 765, month: '2027-01', fiche: v3, propertyCharges: 360 });
  assert.equal(s.charges, 172);
  assert.equal(s.rent, 593);
  // après une révision de 1,5 % du loyer et du forfait (1 552,95 € versés) : la part de charges suit
  const r = quittanceSplit({ received: 1552.95, month: '2028-01', fiche: v3, propertyCharges: 360 });
  assert.equal(r.charges, 349.16);
  assert.equal(r.rent, 1203.79);
  assert.equal(Math.round((r.rent + r.charges) * 100) / 100, 1552.95);
});

test('bail antérieur : calcul d’origine inchangé (charges de la fiche maison, loyer jamais négatif)', () => {
  assert.deepEqual(quittanceSplit({ received: 1460, month: '2026-10', fiche: old, propertyCharges: 360 }), { rent: 1100, charges: 360, basis: 'fiche_maison' });
  assert.deepEqual(quittanceSplit({ received: 300, month: '2026-10', fiche: old, propertyCharges: 360 }), { rent: 0, charges: 360, basis: 'fiche_maison' });
});

const lodgeProperty = { is_coliving: true, legal_entity_name: 'Sleep In', siege_social: '8 rue du Mont-Blanc – 74100 Annemasse – France', siret: '882 153 810 00016', property_address: '8 rue de Romagny - 74100 Annemasse',
  entity: { legal_name: 'SCI Sleep In', legal_form: 'sci', trade_name: 'La Villa Coliving', registration: 'RCS Thonon-les-Bains 882 153 810 — SIRET 882 153 810 00016', siege: '8 rue du Mont-Blanc, 74100 Annemasse' } };

test('bailleur d’un bail v3 : l’entité juridique de la maison, avec son immatriculation', () => {
  const l = quittanceLessor(lodgeProperty, true);
  assert.equal(l.name, 'SCI Sleep In');
  assert.equal(l.designation, 'la SCI Sleep In');
  assert.equal(l.address, '8 rue du Mont-Blanc, 74100 Annemasse');
  assert.equal(l.registration, 'RCS Thonon-les-Bains 882 153 810 — SIRET 882 153 810 00016');
  assert.equal(l.siret, '');
  assert.equal(l.brand, 'La Villa Coliving');
  const villa = quittanceLessor({ ...lodgeProperty, legal_entity_name: 'LA VILLA', entity: { legal_name: 'Indivision Austin-Piot', legal_form: 'indivision', trade_name: 'La Villa Coliving', registration: 'SIRET 898 236 518 00012', siege: '34 rue du Foron, 74100 Ville-la-Grand' } }, true);
  assert.equal(villa.designation, "l'Indivision Austin-Piot");
});

test('bailleur d’un bail antérieur : libellé d’origine inchangé', () => {
  const l = quittanceLessor(lodgeProperty, false);
  assert.equal(l.name, 'La Villa Coliving');
  assert.equal(l.address, 'Sleep In SCI — 8 rue du Mont-Blanc – 74100 Annemasse – France');
  assert.equal(l.siret, '882 153 810 00016');
  assert.equal(l.registration, null);
  assert.equal(l.brand, 'La Villa Coliving');
  // bien non coliving (Mont-Blanc) : nom propre de la fiche maison ; entité sans identité juridique → jamais utilisée
  const mb = quittanceLessor({ is_coliving: false, legal_entity_name: 'LA VILLA', siege_social: '34 rue du Foron – 74100 Ville-la-Grand – France', siret: '898 236 518 00012', property_address: 'x', entity: { legal_name: null, legal_form: 'autre', trade_name: null, registration: null, siege: null } }, true);
  assert.equal(mb.name, 'LA VILLA');
  assert.equal(mb.registration, null);
});

test('« Voir mon bail » : le document « bail » le plus récent, sinon le fichier Bail… du dossier', () => {
  const docs = [
    { type: 'quittance', label: 'Quittance', file_url: 'tenant-files/x/quittances/2026-09.pdf', uploaded_at: '2026-09-27' },
    { type: 'bail', label: 'Bail v3 A', file_url: 'tenants/t1/Bail_v3_A.pdf', uploaded_at: '2026-11-12T10:00:00Z' },
    { type: 'bail', label: 'Bail v3 B', file_url: 'tenants/t1/Bail_v3_B.pdf', uploaded_at: '2026-12-01T10:00:00Z' },
  ];
  assert.deepEqual(findLeaseDocument('t1', docs, []), { path: 'tenants/t1/Bail_v3_B.pdf', label: 'Bail v3 B' });
  const files = [{ name: 'Passeport.pdf', updated_at: '2026-10-01' }, { name: 'Bail_Dupont_2026-03-01.pdf', updated_at: '2026-03-01' }, { name: 'bail_avenant.pdf', updated_at: '2026-06-01' }];
  assert.deepEqual(findLeaseDocument('t1', [docs[0]], files), { path: 'tenants/t1/bail_avenant.pdf', label: 'bail_avenant.pdf' });
  assert.equal(findLeaseDocument('t1', [docs[0]], [files[0]]), null);
});

test('documents : bon dossier de fichiers, et pas de bail affiché deux fois', () => {
  assert.deepEqual(documentLocation('tenants/t1/Bail.pdf'), { bucket: 'operations', path: 'tenants/t1/Bail.pdf' });
  assert.deepEqual(documentLocation('tenant-files/t1/quittances/2026-09.pdf'), { bucket: 'tenant-files', path: 't1/quittances/2026-09.pdf' });
  const docs = [{ type: 'bail', label: 'Bail', file_url: 'tenants/t1/Bail_v3.pdf', uploaded_at: null }];
  assert.deepEqual(filesNotInDocuments('t1', docs, [{ name: 'Bail_v3.pdf', updated_at: null }, { name: 'Attestation.pdf', updated_at: null }]).map((f) => f.name), ['Attestation.pdf']);
});

test('fiches en double au même e-mail : la vraie chambre la plus récente (jamais la « chambre 0 »)', () => {
  const rows = [{ id: 'a', room_number: 0, move_in_date: '2026-11-01' }, { id: 'b', room_number: 2, move_in_date: '2026-11-01' }];
  assert.equal(pickTenantFiche(rows).id, 'b');
  assert.equal(pickTenantFiche([{ id: 'c', room_number: '7', move_in_date: '2026-01-02' }, { id: 'd', room_number: '1', move_in_date: '2026-10-01' }]).id, 'd');
  assert.equal(pickTenantFiche([{ id: 'e', room_number: 0, move_in_date: null }]).id, 'e');
  assert.equal(pickTenantFiche([]), null);
});

test('adresses : une ligne par élément, jamais de coupure dans « Ville-la-Grand » ni « Mont-Blanc », pays retiré', () => {
  assert.deepEqual(addressLines('34 rue du Foron – 74100 Ville-la-Grand – France'), ['34 rue du Foron', '74100 Ville-la-Grand']);
  assert.deepEqual(addressLines('34 rue du Foron - 74100 Ville-la-Grand - France'), ['34 rue du Foron', '74100 Ville-la-Grand']);
  assert.deepEqual(addressLines('8 rue du Mont-Blanc, 74100 Annemasse'), ['8 rue du Mont-Blanc', '74100 Annemasse']);
  assert.deepEqual(addressLines('Sleep In SCI \u2014 8 rue du Mont-Blanc – 74100 Annemasse – France'), ['Sleep In SCI', '8 rue du Mont-Blanc', '74100 Annemasse']);
  assert.deepEqual(addressLines('8 rue de Romagny - 74100 Annemasse, 74100 Annemasse – France'), ['8 rue de Romagny', '74100 Annemasse', '74100 Annemasse']);
  assert.deepEqual(addressLines(null), []);
});
