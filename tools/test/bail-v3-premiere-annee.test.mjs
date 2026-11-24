// Offre « Ta première année avec nous » — lot 2, côté bail (brief de Jérôme du 21/11/2026, § 4 et § 6 ; D5, D10, D12) :
// paliers et mois (src/lib/bailV3/firstYearOffer.ts), clause du bail v3 (src/lib/bailV3/clauses.ts) et migration
// (scripts/migration-offre-premiere-annee-2026-11-21.sql : table offer_rewards, create_lease_v3).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const bundle = await build({
  stdin: {
    contents: [
      "export * from './src/lib/bailV3/firstYearOffer';",
      "export { buildLeaseV3 } from './src/lib/bailV3/clauses';",
      "export { discountMonth } from './src/lib/leaseTerms';",
      "export { CASES } from './tools/bail-v3/cases';",
    ].join(' '),
    resolveDir: ROOT,
    loader: 'ts',
  },
  bundle: true, write: false, format: 'esm', platform: 'neutral', target: 'es2022',
  alias: { '@': path.join(ROOT, 'src') }, logLevel: 'silent',
});
const m = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text, 'utf8').toString('base64')}`);

/** Texte de l'article des conditions financières (paragraphes et puces). */
function financesText(input) {
  const art = m.buildLeaseV3(input).articles.find((a) => a.key === 'finances');
  assert.ok(art, 'article finances introuvable');
  return art.blocks.flatMap((b) => (b.t === 'bullets' ? b.items : b.text != null ? [b.text] : [])).join('\n');
}
const withTerms = (input, terms) => ({ ...input, terms: { ...input.terms, ...terms } });

test('paliers : 200 + 300 + 400 + 500 = 1 400 €, remise de 200 € au premier mois complet', () => {
  assert.equal(m.FIRST_YEAR_TOTAL_EUR, 1400);
  assert.equal(m.FIRST_YEAR_DISCOUNT_EUR, 200);
  assert.deepEqual(m.FIRST_YEAR_TIERS.map((t) => [t.tier, t.monthRank, t.eur, t.kind]), [[1, 1, 200, 'discount'], [2, 4, 300, 'refund'], [3, 7, 400, 'refund'], [4, 13, 500, 'refund']]);
  assert.equal(m.FIRST_YEAR_OFFER_ID, 'premiere-annee');
});

test('premier mois complet = même règle que discountMonth (entrée le 1er : ce mois ; sinon le mois suivant)', () => {
  for (const entry of ['2026-11-29', '2026-12-01', '2026-12-15', '2027-01-01', '2027-01-15', '2026-12-31']) {
    assert.equal(m.firstFullMonth(entry).slice(0, 7), m.discountMonth(entry), entry);
  }
  assert.equal(m.firstFullMonth(''), null);
});

test('calendrier : exemples du brief (§ 4 bis) et de la recon', () => {
  const months = (entry) => m.firstYearSchedule(entry).map((s) => s.referenceMonth);
  assert.deepEqual(months('2026-11-29'), ['2026-12-01', '2027-03-01', '2027-06-01', '2027-12-01']); // Loft ch. 1
  assert.deepEqual(months('2026-12-01'), ['2026-12-01', '2027-03-01', '2027-06-01', '2027-12-01']);
  assert.deepEqual(months('2027-01-15'), ['2027-02-01', '2027-05-01', '2027-08-01', '2028-02-01']);
  const s = m.firstYearSchedule('2026-12-01');
  assert.equal(s[0].remindOn, null, 'le palier 1 est une remise : pas de rappel');
  assert.equal(s[1].remindOn, '2027-02-01', 'premier rappel début février 2027 (brief § 4 bis)');
  assert.deepEqual(s.slice(1).map((x) => x.remindOn), ['2027-02-01', '2027-05-01', '2027-11-01']);
});

test('les 3 lignes offer_rewards envoyées à create_lease_v3', () => {
  assert.deepEqual(m.offerRewardsPayload('2026-11-29'), [
    { offer_id: 'premiere-annee', tier: 2, amount_eur: 300, reference_month: '2027-03-01' },
    { offer_id: 'premiere-annee', tier: 3, amount_eur: 400, reference_month: '2027-06-01' },
    { offer_id: 'premiere-annee', tier: 4, amount_eur: 500, reference_month: '2027-12-01' },
  ]);
  assert.equal(m.offerRewardsPayload(''), null);
});

test('fenêtre de signature : du 24/11 au 31/12/2026 inclus (avancée du 26/11, décision du 24/11/2026)', () => {
  assert.equal(m.isFirstYearSignDate('2026-11-23'), false);
  assert.equal(m.isFirstYearSignDate('2026-11-24'), true);
  assert.equal(m.isFirstYearSignDate('2026-12-31'), true);
  assert.equal(m.isFirstYearSignDate('2027-01-01'), false);
});

test('clause du bail v3 : option cochée → les quatre paliers datés (§ 6) ; décochée → clause de remise inchangée', () => {
  const base = m.CASES[Object.keys(m.CASES)[0]];
  const entry = '2026-11-29';
  const offer = financesText(withTerms(base, { start: entry, discount_eur: 200, first_year_offer: true }));
  assert.match(offer, /Offre « Ta première année » :/);
  assert.match(offer, /À titre de geste commercial, le bailleur consent au locataire les avantages suivants :/);
  for (const re of [/premier mois complet de location, soit le mois de décembre 2026/, /quatrième mois complet, soit le mois de mars 2027/,
    /septième mois complet, soit le mois de juin 2027/, /treizième mois complet, soit le mois de décembre 2027/]) assert.match(offer, re);
  assert.match(offer, /dans les dix jours qui suivent l'encaissement du loyer du mois concerné/);
  assert.match(offer, /Le prorata dû pour le mois d'entrée n'est pas concerné\./, 'entrée le 29 : prorata mentionné');
  assert.doesNotMatch(offer, /accordée une seule fois/, 'la phrase de la remise unique disparaît avec l\'offre');
  assert.doesNotMatch(offer, /Remise commerciale sur le premier mois complet/);
  const first = financesText(withTerms(base, { start: '2026-12-01', discount_eur: 200, first_year_offer: true }));
  assert.doesNotMatch(first, /prorata dû pour le mois d'entrée/, 'entrée le 1er : pas de prorata');
  const plain = financesText(withTerms(base, { start: entry, discount_eur: 200 }));
  assert.match(plain, /Remise commerciale sur le premier mois complet :/);
  assert.match(plain, /Cette remise est accordée une seule fois/);
  assert.doesNotMatch(plain, /Ta première année/);
});

test('migration : table offer_rewards contrainte, RLS administrateur, create_lease_v3 contrôle les mois +3, +6, +12', async () => {
  const sql = await fs.readFile(path.join(ROOT, 'scripts', 'migration-offre-premiere-annee-2026-11-21.sql'), 'utf8');
  assert.match(sql, /create table if not exists public\.offer_rewards/);
  assert.match(sql, /\(tier = 2 and amount_eur = 300\) or \(tier = 3 and amount_eur = 400\) or \(tier = 4 and amount_eur = 500\)/);
  assert.match(sql, /constraint offer_rewards_lease_tier_key unique \(lease_id, tier\)/);
  assert.match(sql, /remind_on\s+date generated always as \(\(reference_month - interval '1 month'\)::date\) stored/);
  assert.match(sql, /enable row level security/);
  assert.match(sql, /revoke all on public\.offer_rewards from anon;/);
  assert.match(sql, /case o\.tier when 2 then 3 when 3 then 6 when 4 then 12 end/);
  assert.match(sql, /'offer_rewards', v_rewards/);
  assert.match(sql, /^begin;$/m);
  assert.match(sql, /^commit;$/m);
  const rb = await fs.readFile(path.join(ROOT, 'scripts', 'migration-offre-premiere-annee-2026-11-21-rollback.sql'), 'utf8');
  assert.match(rb, /drop table if exists public\.offer_rewards;/);
  assert.doesNotMatch(rb, /offer_rewards', v_rewards/, 'le retour arrière remet la fonction d\'avant');
});
