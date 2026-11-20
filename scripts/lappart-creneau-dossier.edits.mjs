/**
 * L'Appart (Lot 4 du brief « Points d'entrée prix, L'Appart » du 12/11/2026, étape E5) — SQL n° 10a : le créneau « dossier » de
 * l'article dossier-location-frontalier-suisse-france nomme aussi L'Appart (décision n° 23 de la critique du 13/11/2026, à
 * confirmer : seul des six créneaux des articles administratifs, parce que sa parenthèse décrit toute l'offre).
 *
 * C'est la SEULE phrase d'article de L'Appart copiée du code et surveillée par check:slots (L1_TARGETS, « adminSlot:dossier »,
 * texte = adminSlotSentence('dossier') de src/data/answerSlots.ts) : ce SQL part JUSTE AVANT la fusion du code de L'Appart
 * (ordre de séance des données, § 1 : « SQL n° 10a ») — sinon la garde des créneaux bloque le robot. Les autres phrases
 * d'articles de L'Appart (SQL n° 10) attendent la bascule.
 *
 * État de départ attendu : celui du Lot 1 après son SQL 3 bis — la fourchette des maisons y est le jeton {{PRIX_FOURCHETTE}}
 * (scripts/prix-chambres-7-8-fourchettes.edits.mjs). Ancienne phrase = la nouvelle sans L'Appart ; nouvelle = la source, au
 * caractère près (la fourchette reste le jeton, que le site résout en « 1 290 à 1 430 CHF »). Aucun montant n'est tapé ici.
 *
 *   node scripts/build-slots-sql.mjs --edits ./lappart-creneau-dossier.edits.mjs --name lappart-sql10a-creneau-dossier --date AAAA-MM-JJ --write-diff
 *
 * Banc d'essai (simulation du SQL n° 10a, après les quatre modules du Lot 1) : --surcouche "<worktree>/scripts/lappart-creneau-dossier.edits.mjs".
 */
const SLUG = 'dossier-location-frontalier-suisse-france';
const RANGE_TOKEN = '{{PRIX_FOURCHETTE}}';

/** L'ajout de L'Appart dans la parenthèse, et le mot « de coliving » qui distingue désormais les maisons — depuis la source. */
function parts(m, lang) {
  const A = m.APPART;
  return lang === 'en'
    ? { houses: [`${m.numberWord(m.STATS.totalHouses, 'en')} houses in `, `${m.numberWord(m.STATS.totalHouses, 'en')} coliving houses in `], appart: `, and a flatshare in ${A.commune} from ${A.price.from.en.chf} a month` }
    : { houses: [`${m.numberWord(m.STATS.totalHouses, 'fr')} maisons à `, `${m.numberWord(m.STATS.totalHouses, 'fr')} maisons de coliving à `], appart: `, et une colocation à ${A.commune} dès ${A.price.from.fr.chf} par mois` };
}

export function sqlDoc(m) {
  return {
    lot: 'L\'Appart (Lot 4, étape E5) — SQL n° 10a : le créneau « dossier » de dossier-location-frontalier-suisse-france nomme aussi L\'Appart (décision n° 23 de la critique du 13/11/2026, à confirmer).',
    sources: 'texte = source unique src/data/answerSlots.ts (adminSlotSentence(\'dossier\')) ; ancien = la même phrase sans L\'Appart ; fourchette des maisons en jeton {{PRIX_FOURCHETTE}} (état après le SQL 3 bis du Lot 1)',
    apply: 'À appliquer JUSTE AVANT la fusion du code de L\'Appart (la garde check:slots exige la phrase de la source dans l\'article). Les autres phrases d\'articles de L\'Appart (SQL n° 10) partent après la bascule.',
    encoding: 'Fichier UTF-8 : guillemets « » et accents — ne pas normaliser.',
    dryRunTitle: 'L\'Appart — SQL n° 10a, créneau « dossier » : aperçu de la substitution',
    legend: 'Légende : « Avant » = créneau des trois maisons (fourchette en jeton) ; « Après » = créneau des deux gammes (source du 13/11/2026).',
    versions: { OU_CHERCHER_VERSION: m.OU_CHERCHER_VERSION },
  };
}

export function buildEdits(m) {
  const out = [];
  for (const lang of ['fr', 'en']) {
    const now = m.adminSlotSentence('dossier', lang);
    const range = m.priceRangeText(lang);
    const p = parts(m, lang);
    if (!now.includes(p.houses[1]) || !now.includes(p.appart) || !now.includes(range)) {
      throw new Error(`lappart-creneau-dossier : la phrase de la source (${lang}) n'a plus la forme attendue — relire buildEdits`);
    }
    const old = now.replace(p.houses[1], p.houses[0]).replace(p.appart, '');
    out.push({
      slug: SLUG,
      lang,
      mechanism: 'adminSlot',
      note: 'créneau « dossier » (check:slots, adminSlot:dossier) : trois maisons de coliving et L\'Appart',
      find: old.replace(range, RANGE_TOKEN),
      replace: now.replace(range, RANGE_TOKEN),
    });
  }
  return out;
}
