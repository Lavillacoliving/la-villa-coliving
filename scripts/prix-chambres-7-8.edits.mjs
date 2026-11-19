/**
 * Prix des chambres 7 et 8 de La Villa (décision de Jérôme du 12/11/2026 : 1 380 € par mois, soit 1 290 CHF affichés) — listes
 * DÉCLARATIVES des modifications de blog_posts, consommées par scripts/build-slots-sql.mjs. Le « dès » des maisons passe de
 * 1 370 à 1 290 CHF (1 470 → 1 380 €) ; la fourchette des maisons de « 1 370 à 1 430 CHF » à « 1 290 à 1 430 CHF ».
 *
 * Quatre listes, une par SQL (chaque fichier ./prix-chambres-7-8-<phase>.edits.mjs réexporte la sienne sous le nom buildEdits) :
 *
 *  1. jetons      (SQL 1, peut partir AVANT le code) — chaque « dès 1 370 CHF » du texte des articles devient le jeton
 *                 {{PRIX_DES}} (30 pieds d'article communs + les mentions isolées). Le site en ligne connaît déjà ce jeton et le
 *                 rend à 1 370 CHF : aucun changement visible en français ; en anglais, quelques « 1,370 CHF » deviennent
 *                 « CHF 1,370 » (graphie du site). Après la mise en ligne du code, le même jeton rend 1 290 CHF.
 *  2. bascule     (SQL 3, MÊME CRÉNEAU que le code) — ce qui change de sens avec le nouveau prix : les fourchettes des maisons
 *                 (9 articles), les chiffres calculés à partir du prix (5 articles : part du salaire, reste à vivre, totaux de
 *                 budget, écart avec un studio) et les libellés qui donnaient 1 370 CHF sans « dès » (3 articles).
 *                 La fourchette y est écrite EN CLAIR (« 1 290 à 1 430 CHF ») : ses deux jetons sont nouveaux, le site en ligne
 *                 ne les connaît pas encore et les afficherait tels quels entre le SQL et la mise en ligne du code.
 *  3. metas       (SQL 4, même créneau) — metas de 2 articles et posts Facebook de 3 articles : prix en clair (les jetons n'y
 *                 sont pas résolus). Le post du Lodge disait « dès 1 370 CHF » : Le Lodge est à prix unique, 1 430 CHF.
 *  4. fourchettes (SQL 3 bis, APRÈS la mise en ligne du code) — les fourchettes écrites en clair par la bascule deviennent les
 *                 jetons {{PRIX_FOURCHETTE}} / {{PRIX_FOURCHETTE_TABLEAU}} : aucun changement visible. Liste DÉRIVÉE de la
 *                 bascule (mêmes passages), jamais écrite à la main.
 *
 *   node scripts/build-slots-sql.mjs --edits ./prix-chambres-7-8-jetons.edits.mjs --name prix-chambres-7-8-sql1-jetons --date 2026-11-13 --write-diff
 *   node scripts/build-slots-sql.mjs --edits ./prix-chambres-7-8-bascule.edits.mjs --name prix-chambres-7-8-sql3-bascule --date 2026-11-13 --write-diff
 *   node scripts/build-slots-sql.mjs --edits ./prix-chambres-7-8-metas.edits.mjs --name prix-chambres-7-8-sql4-metas --date 2026-11-13 --write-diff
 *   (fourchettes : ses ancres n'existent qu'après la bascule — à générer une fois le SQL 3 appliqué, ou hors ligne avec --posts-json)
 *
 * Règles : `find` copié au caractère près depuis la base (relevé du 13/11/2026) et construit avec les ANCIENS montants (OLD) ;
 * `replace` = sorties de la source unique `m` (src/data/stats.ts, answerSlots.ts) ou jetons : aucun nouveau montant n'est tapé
 * ici. Les chiffres dérivés sont RECALCULÉS par les fonctions ci-dessous, qui doivent d'abord redonner les chiffres publiés à
 * partir de l'ancien prix (sinon le générateur s'arrête). Tutoiement FR, parité FR/EN. Hors périmètre : la ligne « Léman
 * Express seul | ~115 CHF | ~1 370 CHF » de cout-transport (coût ANNUEL d'un abonnement, pas un loyer) et les articles
 * dépubliés. Ne jamais régénérer après l'application (les ancres sont consommées) : le .sql committé est la trace.
 */
import { rentShareOfNet, studioPremiumChf } from './admin-slots-cta.edits.mjs';

export const NB = '\u00A0';
/** Montants en base avant ce lot (sorties de la source unique sur origin/main 5a29e796b). */
export const OLD = Object.freeze({ fromChf: 1370, fromEur: 1470, standardChf: 1430, standardEur: 1530 });

const LANGS = ['fr', 'en'];
const group = (n, sep) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
/** Graphies des montants : FR milliers en U+00A0 (source unique) ou en espace ordinaire (prose de certains articles), EN virgule. */
const frNb = (n) => group(n, NB);
const frSp = (n) => group(n, ' ');
const en = (n) => group(n, ',');
const pct = (rent, net) => Math.round((rent / net) * 100);
const round50 = (x) => Math.round(x / 50) * 50;
const round100 = (x) => Math.round(x / 100) * 100;

/** Les 30 articles au pied commun « … une chambre meublée tout inclus coûte à partir de **1 370 CHF/mois** … » (relevé du 13/11/2026). */
export const FOOTER_SLUGS = Object.freeze([
  'allocations-familiales-frontalier-geneve-2026',
  'arnaques-logement-frontalier-geneve-eviter',
  'assurance-sante-frontalier-lamal-cmu-budget',
  'banque-telephone-internet-frontalier-bons-plans',
  'budget-colocation-geneve-guide-complet',
  'choc-culturel-franco-suisse-expatrie-geneve',
  'coliving-frais-dossier-geneve-annemasse',
  'coliving-transfrontalier-geneve-annemasse-nouvelle-vie',
  'cout-de-la-vie-suisse-france-frontalier-2026',
  'cout-transport-frontalier-geneve-2026',
  'declaration-impots-frontalier-2026',
  'ecole-internationale-geneve-frontalier-ou-habiter',
  'espaces-verts-coliving-lodge-annemasse',
  'fiscalite-frontalier-geneve-impots-2026',
  'grand-geneve-2026-nouveautes-frontaliers',
  'guide-ressources-frontalier-geneve',
  'living-in-france-working-in-geneva',
  'optimiser-espace-coliving-productivite-bien-etre',
  'organisations-internationales-geneve-ou-habiter',
  'ou-habiter-en-france-quand-on-travaille-a-geneve',
  'permis-g-frontalier-geneve',
  'quartiers-annemasse-ou-vivre-selon-profil',
  'quitter-son-logement-guide-pratique',
  'salaire-suisse-net-frontalier-2026',
  'se-faire-reseau-geneve-arriver-seul',
  'teletravail-frontalier-geneve-regles-2026',
  'transport-annemasse-geneve-leman-express',
  'trouver-colocation-geneve-frontalier',
  'trouver-logement-avant-d-arriver-geneve',
  'vie-quotidienne-frontalier-courses-sport-sorties',
]);

/**
 * Après les QUATRE listes, plus aucun ancien montant dans les articles publiés (\s couvre l'espace insécable) — sauf le coût annuel
 * de cout-transport. Contrôle d'ensemble (le test du lot et les outils de séance le simulent) : volontairement pas un
 * POST_STATE_WATCH du générateur, qui le lirait liste par liste et signalerait ce que la liste suivante traite.
 */
export const OLD_PRICE_RES = [/1[\s,]370/g, /1[\s,]470/g];
export const ANNUAL_PASS_EXCEPTION = Object.freeze({ slug: 'cout-transport-frontalier-geneve-2026', fr: `~1${NB}370 CHF`, en: '~1,370 CHF' });

/** La source doit déjà porter les prix du lot, sinon les listes n'auraient pas de sens. */
function assertSource(m) {
  const P = m.ENTITY_FACTS.price;
  if (P.fromChf === OLD.fromChf || P.fromEur === OLD.fromEur) throw new Error(`prix-chambres-7-8 : le prix d'appel de la source vaut encore ${OLD.fromChf} CHF / ${OLD.fromEur} € (source non modifiée)`);
  if (P.standardChf !== OLD.standardChf || P.standardEur !== OLD.standardEur) throw new Error('prix-chambres-7-8 : le prix standard a changé — ce lot ne couvre que le prix d\'appel');
  if (m.HOUSES_FROM.chf !== P.fromChf || m.HOUSES_FROM.eur !== P.fromEur) throw new Error('prix-chambres-7-8 : HOUSES_FROM ≠ ENTITY_FACTS.price');
  for (const lang of LANGS) {
    if (!m.priceRangeText(lang).includes(m.HOUSES_FROM[lang].chfNum) || !m.priceRangeCell(lang).includes(m.HOUSES_FROM[lang].chfNum)) throw new Error(`prix-chambres-7-8 : la fourchette (${lang}) ne part pas du « dès » des maisons`);
    for (const t of ['PRIX_DES', 'PRIX_DES_EUR', 'PRIX_PRIVATIF', 'PRIX_PRIVATIF_EUR', 'PRIX_FOURCHETTE', 'PRIX_FOURCHETTE_TABLEAU']) {
      if (/\{\{/.test(m.resolveContentTokens(`{{${t}}}`, lang))) throw new Error(`prix-chambres-7-8 : le jeton {{${t}}} n'est pas résolu par src/lib/contentTokens.ts`);
    }
  }
}

/** Fabrique de liste : refuse un texte inchangé et une ancre répétée dans la même colonne du même article. */
function collector(label) {
  const E = [];
  const seen = new Set();
  const add = (slug, lang, mechanism, note, find, replace, column) => {
    if (find === replace) throw new Error(`${label} : ${slug} (${lang}) · ${note} : texte inchangé`);
    const key = `${slug}\u0000${column ?? `content_${lang}`}\u0000${find}`;
    if (seen.has(key)) throw new Error(`${label} : ${slug} (${lang}) · ${note} : ancre déclarée deux fois`);
    seen.add(key);
    E.push(column ? { slug, lang, mechanism, note, find, replace, column } : { slug, lang, mechanism, note, find, replace });
  };
  return { E, add };
}

// ── 1. Jetons « dès » (SQL 1) ───────────────────────────────────────────────────────────────────────────────────────────

/**
 * Mentions isolées « dès 1 370 CHF » : [slug, ancre FR, ancre EN]. `§` marque le montant AVEC son unité tel qu'il est écrit
 * dans l'article (« 1 370 CHF » en français ; « CHF 1,370 » ou « 1,370 CHF » en anglais, précisé par le 4e élément) : il est
 * remplacé par {{PRIX_DES}}, qui rend « 1 290 CHF » / « CHF 1,290 ». Le reste de l'ancre est du contexte, recopié à l'identique.
 */
const DES_SPOTS = [
  ['assurance-sante-frontalier-lamal-cmu-budget', 'Le coliving, dès §, est serré', 'Coliving, from §, is tight', 'num-first'],
  ['assurance-sante-frontalier-lamal-cmu-budget', 'Le coliving, dès §, est très confortable', 'Coliving, from §, is very comfortable', 'num-first'],
  ['coliving-annemasse-geneve-frontaliers-avantages', 'tout inclus dès **§/mois** dans 3 maisons', 'rooms from **§/month** across 3 houses'],
  ['coliving-communaute-reels-amis-geneve-annemasse', '**Tout inclus dès § par mois**', '**All inclusive from § per month**'],
  ['coliving-geneve-frontaliers-guide-complet', 'tout inclus dès **§/mois**, sans frais de dossier.', 'all-inclusive from **§/month**, no application fee.'],
  ['coliving-transfrontalier-geneve-annemasse-nouvelle-vie', "c'est dès § par mois, tout compris", "it's from § per month, all-inclusive"],
  ['coliving-transfrontalier-geneve-annemasse-nouvelle-vie', '- **Budget** : dès § tout compris', '- **Budget**: from § all-inclusive'],
  ['colocation-annemasse-ville-la-grand-ambilly', '- Prix : dès §/mois tout compris', '- Price: from §/month all-inclusive'],
  ['colocation-annemasse-ville-la-grand-ambilly', 'tout inclus dès **§/mois** dans 3 maisons', 'rooms from **§/month** across 3 houses'],
  ['dossier-location-frontalier-suisse-france', 'tout inclus dès **§/mois**, sans frais de dossier.', 'rooms from **§/month**, no application fee.'],
  ['grand-geneve-2026-nouveautes-frontaliers', '**Dès § par mois, tout inclus**', '**From § per month, all-inclusive**'],
  ['guide-ressources-frontalier-geneve', 'À partir de §/mois. Le prix affiché', 'From §/month. The advertised price', 'num-first'],
  ['living-in-france-working-in-geneva', 'avec des chambres dès § par mois tout inclus', 'with rooms from § a month all inclusive'],
  ['quartiers-annemasse-ou-vivre-selon-profil', '(type le nôtre, dès §/mois)', '(like ours, from §/month)'],
  ['salaire-suisse-net-frontalier-2026', '— dès §/mois, avec une communauté', '— from §/month, with a community'],
  ['temps-trajet-annemasse-geneve-par-quartier', '— tout inclus dès §/mois.', '— all-inclusive from §/month.'],
  ['trouver-colocation-geneve-frontalier', 'déjà installée — dès §/mois, à', 'already settled in — from §/month, 20 min', 'num-first'],
  ['trouver-colocation-geneve-frontalier', "d'une salle de sport. À partir de §/mois.", 'a sauna and a gym. From §/month.'],
  ['trouver-colocation-geneve-frontalier', 'tout inclus dès §/mois, avec piscine', 'room from §/month, with a pool'],
  ['trouver-colocation-geneve-frontalier', 'porte-à-porte, dès §/mois.', 'door to door, from §/month.'],
];

export function editsJetons(m) {
  assertSource(m);
  const { E, add } = collector('prix-chambres-7-8 (jetons)');
  const oldFr = `${frNb(OLD.fromChf)} CHF`;
  const oldEn = { 'unit-first': `CHF ${en(OLD.fromChf)}`, 'num-first': `${en(OLD.fromChf)} CHF` };
  const T = '{{PRIX_DES}}';
  for (const slug of FOOTER_SLUGS) {
    add(slug, 'fr', 'jeton', 'pied commun : « à partir de 1 370 CHF/mois » → jeton du « dès » des maisons', `coûte à partir de **${oldFr}/mois**`, `coûte à partir de **${T}/mois**`);
    add(slug, 'en', 'jeton', 'common footer: "from CHF 1,370/month" → entry-price token', `costs from **${oldEn['unit-first']}/month**`, `costs from **${T}/month**`);
  }
  for (const [slug, fr, enAnchor, enForm = 'unit-first'] of DES_SPOTS) {
    add(slug, 'fr', 'jeton', `« ${fr.replace('§', '1 370 CHF')} »`, fr.replace('§', oldFr), fr.replace('§', T));
    add(slug, 'en', 'jeton', `"${enAnchor.replace('§', oldEn[enForm])}"${enForm === 'num-first' ? ' (graphie : « 1,370 CHF » → « CHF 1,370 », celle du site)' : ''}`, enAnchor.replace('§', oldEn[enForm]), enAnchor.replace('§', T));
  }
  return E;
}

// ── 2. Bascule (SQL 3) ──────────────────────────────────────────────────────────────────────────────────────────────────

/**
 * Chiffres dérivés du prix : chaque fonction redonne d'abord les chiffres PUBLIÉS à partir de l'ancien prix (contrôle), puis
 * calcule les nouveaux avec la même formule. `from` / `std` = prix d'appel et prix standard en CHF.
 */
export function derived(m) {
  const P = m.ENTITY_FACTS.price;
  const check = (label, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) throw new Error(`prix-chambres-7-8 : ${label} — la formule donne ${JSON.stringify(got)} avec l'ancien prix, l'article publie ${JSON.stringify(want)}`); };

  // budget-colocation : « À 4 500 CHF net … 30% ; à 6 000 … 23% ; à 8 000 … 17% » = prix d'appel / net.
  const budgetNets = [4500, 6000, 8000];
  check('budget (part du net)', budgetNets.map((n) => pct(OLD.fromChf, n)), [30, 23, 17]);
  const budget = budgetNets.map((n) => pct(P.fromChf, n));

  // assurance-sante : « environ 33 % de ton net » = prix d'appel / net du profil 1 de l'article (~4 200 CHF).
  check('assurance-santé (profil 1)', pct(OLD.fromChf, 4200), 33);
  const sante1 = pct(P.fromChf, 4200);
  // « 23-27 % de ton net » (60 000 à 80 000 CHF brut) : l'article ne donne pas les nets de cette tranche — règle de trois sur les
  // pourcentages publiés (mêmes nets implicites, nouveau prix).
  const sante2 = [23, 27].map((p) => Math.round((p * P.fromChf) / OLD.fromChf));

  // fiscalite : trois simulations (nets de l'article). Parts = prix d'appel / net ; restes = net − prix d'appel.
  const sims = { s1: [4070, 4340], s2: [5325, 5700], s3: [7258, 7800] };
  check('fiscalité (simulation 2, part du net)', [pct(OLD.fromChf, sims.s2[1]), pct(OLD.fromChf, sims.s2[0])], [24, 26]);
  check('fiscalité (simulation 3, part du net)', [pct(OLD.fromChf, sims.s3[1]), pct(OLD.fromChf, sims.s3[0])], [18, 19]);
  const fiscalite = {
    // Les restes publiés (2 700-2 960 ; 3 950-4 320) dataient du prix d'avant le 01/09/2026 : pas de contrôle possible, calcul direct.
    reste1: sims.s1.map((n) => n - P.fromChf),
    part2: [pct(P.fromChf, sims.s2[1]), pct(P.fromChf, sims.s2[0])],
    reste2: sims.s2.map((n) => n - P.fromChf),
    part3: [pct(P.fromChf, sims.s3[1]), pct(P.fromChf, sims.s3[0])],
    // « Ce loyer représente 20 à 27 % de ce net » : fonction du lot du 13/10/2026 (scripts/admin-slots-cta.edits.mjs).
    part: rentShareOfNet(m),
  };

  // organisations-internationales : « surcoût d'environ 500 à 800 CHF » : même origine.
  const oi = studioPremiumChf(m);

  // cout-de-la-vie : dépenses hors loyer = total publié − loyer (2 510 − 1 370 ; 3 180 − 1 430) ; nets du tableau de l'article.
  const others = [2510 - OLD.fromChf, 3180 - OLD.standardChf];
  const nets = [4400, 5300, 5950];
  const row = (from, std, net) => ({ part: [pct(from, net), pct(std, net)], reste: [round50(net - (others[1] + std)), round50(net - (others[0] + from))] });
  check('coût de la vie (tableau)', nets.map((n) => row(OLD.fromChf, OLD.standardChf, n)), [
    { part: [31, 33], reste: [1200, 1900] }, { part: [26, 27], reste: [2100, 2800] }, { part: [23, 24], reste: [2750, 3450] },
  ]);
  check('coût de la vie (seuil des 30 %)', [round100(OLD.fromChf / 0.3), round100(OLD.standardChf / 0.3)], [4600, 4800]);
  const cout = {
    total: [others[0] + P.fromChf, others[1] + P.standardChf],
    rows: nets.map((n) => row(P.fromChf, P.standardChf, n)),
    seuil: [round100(P.fromChf / 0.3), round100(P.standardChf / 0.3)],
  };
  if (cout.total[1] !== 3180) throw new Error('prix-chambres-7-8 : le total haut de cout-de-la-vie a changé');
  return { budget, sante1, sante2, fiscalite, oi, cout };
}

/**
 * `ranges` : 'clair' (défaut — la fourchette est écrite en clair, « 1 290 à 1 430 CHF ») ou 'jetons' (elle est écrite avec ses
 * deux jetons dès la bascule : à n'utiliser que si le code qui les connaît est DÉJÀ en ligne).
 */
export function editsBascule(m, { ranges = 'clair' } = {}) {
  assertSource(m);
  const { E, add } = collector('prix-chambres-7-8 (bascule)');
  const D = derived(m);
  const T = '{{PRIX_DES}}';
  const R = (lang) => (ranges === 'jetons' ? '{{PRIX_FOURCHETTE}}' : m.priceRangeText(lang));
  const C = (lang) => (ranges === 'jetons' ? '{{PRIX_FOURCHETTE_TABLEAU}}' : m.priceRangeCell(lang));
  // Anciennes fourchettes, telles qu'en base.
  const oldR = { fr: `${frNb(OLD.fromChf)} à ${frNb(OLD.standardChf)} CHF`, en: `CHF ${en(OLD.fromChf)} to ${en(OLD.standardChf)}` };
  const oldC = { fr: `${frNb(OLD.fromChf)} – ${frNb(OLD.standardChf)} CHF`, en: `${en(OLD.fromChf)} – ${en(OLD.standardChf)} CHF` };
  const oldFr = `${frNb(OLD.fromChf)} CHF`;

  // ── Fourchettes (9 articles) : même phrase, seule la fourchette change ────────────────────────────────────────────────
  /**
   * [slug, mécanisme, note, ancre FR, ancre EN, tournure ?] — `¤` = fourchette en prose, `▦` = fourchette en cellule de tableau.
   * 6e élément facultatif, par langue : [nouveau texte, raison] quand la phrase change aussi autour de la fourchette ; sans
   * lui, le nouveau texte est l'ancre elle-même, seule la fourchette change.
   */
  const RANGE_SPOTS = [
    ['budget-colocation-geneve-guide-complet', 'fourchette', 'ligne « coliving » du tableau des loyers', 'La Villa Coliving | — | — | ▦ |', 'La Villa Coliving | — | — | ▦ |'],
    ['budget-colocation-geneve-guide-complet', 'fourchette', 'créneau vérifié par check:slots (budgetVariantText)', 'Chambre en coliving côté France : ¤ tout inclus chez La Villa Coliving', 'Coliving room on the French side: ¤ all inclusive at La Villa Coliving'],
    ['budget-colocation-geneve-guide-complet', 'fourchette', 'ligne Ville-la-Grand du tableau par commune (La Villa : trois paliers)', '| 500 – 700 € | ▦ |', '| 500–700 € | ▦ |'],
    ['colocation-annemasse-ville-la-grand-ambilly', 'fourchette', 'ligne « coliving » du tableau des prix', '| Coliving premium tout compris | ▦/mois |', '| All-inclusive premium coliving | ▦/month |'],
    ['cout-de-la-vie-suisse-france-frontalier-2026', 'fourchette', 'créneau vérifié par check:slots (coutDeLaVieRowLabel)', 'ex. La Villa Coliving : ¤ tout inclus, 0 € de frais de dossier', 'e.g. La Villa Coliving: ¤ all inclusive, no application fee'],
    ['dossier-location-frontalier-suisse-france', 'fourchette', 'créneau vérifié par check:slots (adminSlot:dossier)', 'Ambilly et Annemasse, ¤ par mois tout inclus), le dossier', 'Ambilly and Annemasse, ¤ a month all inclusive), the file'],
    ['fiscalite-frontalier-geneve-impots-2026', 'fourchette', 'créneau vérifié par check:slots (adminSlot:fiscalite)', '(chez La Villa Coliving, ¤ par mois pour une chambre', '(at La Villa Coliving, ¤ a month for a room'],
    ['organisations-internationales-geneve-ou-habiter', 'fourchette', 'ligne « coliving » du tableau des options', '(La Villa Coliving) | ▦, tout inclus |', '(La Villa Coliving) | ▦, all inclusive |'],
    // « pour une personne à 1 370 à 1 430 CHF » : la tournure « à … à … » devient « de … à … » (décision de Jérôme du 19/11/2026) ;
    // l'anglais « at CHF 1,290 to 1,430 » reste tel quel.
    ['ou-habiter-en-france-quand-on-travaille-a-geneve', 'fourchette', 'phrase du guide', 'pour une personne à ¤ par mois tout inclus', 'furnished single rooms at ¤ a month, all inclusive',
      { fr: ['pour une personne de ¤ par mois tout inclus', '« à … à … » devient « de … à … »'] }],
    ['salaire-suisse-net-frontalier-2026', 'fourchette', 'phrase du coliving tout inclus', 'coliving tout inclus (¤ par mois)', 'all-inclusive coliving (¤ a month)'],
    ['trouver-logement-avant-d-arriver-geneve', 'fourchette', 'phrase du guide', 'porte-à-porte, pour ¤ par mois tout inclus', 'door to door, for ¤ a month all inclusive'],
  ];
  for (const [slug, mechanism, note, fr, enAnchor, reworded = {}] of RANGE_SPOTS) {
    for (const [lang, anchor] of [['fr', fr], ['en', enAnchor]]) {
      const [after, why] = reworded[lang] ?? [anchor, null];
      add(slug, lang, mechanism, why ? `${note} ; tournure : ${why}` : note, anchor.replace('¤', oldR[lang]).replace('▦', oldC[lang]), after.replace('¤', R(lang)).replace('▦', C(lang)));
    }
  }
  // budget : « Tiens compte du taux de change » — fourchette en francs, puis loyer contractuel en euros (jetons existants).
  add('budget-colocation-geneve-guide-complet', 'fr', 'fourchette', 'taux de change : fourchette en francs et loyer contractuel en euros',
    `un loyer de ${oldR.fr} correspond à un loyer contractuel de ${frNb(OLD.fromEur)} à ${frNb(OLD.standardEur)} €, libellé en euros`,
    `un loyer de ${R('fr')} correspond à un loyer contractuel de {{PRIX_DES_EUR}} à {{PRIX_PRIVATIF_EUR}}, libellé en euros`);
  add('budget-colocation-geneve-guide-complet', 'en', 'fourchette', 'exchange rate: range in francs and contractual rent in euros',
    `a ${oldR.en} rent corresponds to a contractual rent of €${en(OLD.fromEur)} to €${en(OLD.standardEur)}, set in euros`,
    `a ${R('en')} rent corresponds to a contractual rent of {{PRIX_DES_EUR}} to {{PRIX_PRIVATIF_EUR}}, set in euros`);

  // ── Libellés sans « dès » (3 articles) ──────────────────────────────────────────────────────────────────────────────
  add('budget-colocation-geneve-guide-complet', 'fr', 'libellé', 'titre de section : le prix d\'appel s\'écrit avec « dès »', `### 3. Coliving premium (${oldFr}/mois tout compris)`, `### 3. Coliving premium (dès ${T}/mois tout compris)`);
  add('budget-colocation-geneve-guide-complet', 'en', 'libellé', 'section heading: the entry price is written with "from"', `### 3. Premium coliving (${en(OLD.fromChf)} CHF/month all-inclusive)`, `### 3. Premium coliving (from ${T}/month all-inclusive)`);
  add('budget-colocation-geneve-guide-complet', 'fr', 'libellé', 'puce du résumé : « dès »', `- **Coliving tout inclus (${oldFr}/mois)**`, `- **Coliving tout inclus (dès ${T}/mois)**`);
  add('budget-colocation-geneve-guide-complet', 'en', 'libellé', 'summary bullet: "from"', `- **All-inclusive coliving (CHF ${en(OLD.fromChf)}/month)**`, `- **All-inclusive coliving (from ${T}/month)**`);
  add('budget-colocation-geneve-guide-complet', 'fr', 'libellé', 'tableau comparatif, ligne « Loyer » : « dès »', `| 500-700 € | ${oldFr} |`, `| 500-700 € | dès ${T} |`);
  add('budget-colocation-geneve-guide-complet', 'en', 'libellé', 'comparison table, "Rent" row: "from"', `| 500-700 € | ${en(OLD.fromChf)} CHF |`, `| 500-700 € | from ${T} |`);
  add('budget-colocation-geneve-guide-complet', 'fr', 'libellé', 'tableau comparatif, ligne « TOTAL mensuel » : « dès »', `| **650-950 €** | **${oldFr}** |`, `| **650-950 €** | **dès ${T}** |`);
  add('budget-colocation-geneve-guide-complet', 'en', 'libellé', 'comparison table, "TOTAL monthly" row: "from"', `| **650-950 €** | **${en(OLD.fromChf)} CHF** |`, `| **650-950 €** | **from ${T}** |`);
  add('guide-ressources-frontalier-geneve', 'fr', 'libellé', '« se situe autour de 1 370 CHF » → la fourchette des maisons', `— se situe autour de ${oldFr}/mois.)*`, `— coûte de ${R('fr')} par mois.)*`);
  add('guide-ressources-frontalier-geneve', 'en', 'libellé', '"sits around 1,370 CHF" → the houses\' price range', `— sits around ${en(OLD.fromChf)} CHF/month.)*`, `— costs ${R('en')} a month.)*`);
  add('trouver-colocation-geneve-frontalier', 'fr', 'libellé', '« ou autour de 1 370 CHF » → la fourchette des maisons', `ou autour de ${oldFr} tout inclus en coliving premium`, `ou de ${R('fr')} tout inclus en coliving premium`);
  add('trouver-colocation-geneve-frontalier', 'en', 'libellé', '"or around 1,370 CHF" → the houses\' price range', `or around ${en(OLD.fromChf)} CHF all-inclusive in premium coliving`, `or ${R('en')} all-inclusive in premium coliving`);

  // ── Chiffres calculés à partir du prix (5 articles) ─────────────────────────────────────────────────────────────────
  // budget-colocation : part du salaire.
  add('budget-colocation-geneve-guide-complet', 'fr', 'calcul', 'part du net à 4 500, 6 000 et 8 000 CHF, recalculée avec le prix d\'appel',
    `le coliving à ${oldFr} représente exactement 30% — c'est serré mais tenable, surtout quand on considère qu'il n'y a aucune charge en plus. À 6 000 CHF, c'est 23% — très confortable. À 8 000 CHF, c'est 17% —`,
    `le coliving dès ${T} représente ${D.budget[0]}% — c'est serré mais tenable, surtout quand on considère qu'il n'y a aucune charge en plus. À 6 000 CHF, c'est ${D.budget[1]}% — très confortable. À 8 000 CHF, c'est ${D.budget[2]}% —`);
  add('budget-colocation-geneve-guide-complet', 'en', 'calcul', 'share of net at CHF 6,000, recomputed with the entry price',
    `coliving at ${en(OLD.fromChf)} CHF represents just 23% — very comfortable.`,
    `coliving from ${T} represents just ${D.budget[1]}% — very comfortable.`);

  // assurance-sante : deux parts du net.
  add('assurance-sante-frontalier-lamal-cmu-budget', 'fr', 'calcul', 'part du net du profil junior (~4 200 CHF net)',
    `Le coliving, dès ${oldFr}, représente environ 33 % de ton net`, `Le coliving, dès ${T}, représente environ ${D.sante1} % de ton net`);
  add('assurance-sante-frontalier-lamal-cmu-budget', 'en', 'calcul', 'share of net, junior profile (~CHF 4,200 net)',
    `Coliving, from ${en(OLD.fromChf)} CHF, represents about 33% of your net`, `Coliving, from ${T}, represents about ${D.sante1}% of your net`);
  add('assurance-sante-frontalier-lamal-cmu-budget', 'fr', 'calcul', 'part du net entre 60 000 et 80 000 CHF brut (règle de trois sur les pourcentages publiés)',
    `Le coliving, dès ${oldFr}, représente 23-27 % de ton net`, `Le coliving, dès ${T}, représente ${D.sante2[0]}-${D.sante2[1]} % de ton net`);
  add('assurance-sante-frontalier-lamal-cmu-budget', 'en', 'calcul', 'share of net between CHF 60,000 and 80,000 gross (rule of three on the published percentages)',
    `Coliving, from ${en(OLD.fromChf)} CHF, represents 23-27% of your net`, `Coliving, from ${T}, represents ${D.sante2[0]}-${D.sante2[1]}% of your net`);

  // fiscalite : trois simulations et la part du net du paragraphe final.
  const F = D.fiscalite;
  add('fiscalite-frontalier-geneve-impots-2026', 'fr', 'calcul', 'simulation 1 (net 4 070-4 340 CHF) : reste après le loyer',
    `Avec une chambre en coliving dès ${oldFr}, il te reste environ 2 700-2 960 CHF`, `Avec une chambre en coliving dès ${T}, il te reste environ ${frSp(F.reste1[0])}-${frSp(F.reste1[1])} CHF`);
  add('fiscalite-frontalier-geneve-impots-2026', 'en', 'calcul', 'simulation 1 (net CHF 4,070-4,340): left after rent',
    `With a coliving room from ${en(OLD.fromChf)} CHF, you have about 2,700-2,960 CHF left`, `With a coliving room from ${T}, you have about ${en(F.reste1[0])}-${en(F.reste1[1])} CHF left`);
  add('fiscalite-frontalier-geneve-impots-2026', 'fr', 'calcul', 'simulation 2 (net 5 325-5 700 CHF) : part du net et reste',
    `Le coliving, dès ${oldFr}, représente 24-26 % du net. Il reste 3 950-4 320 CHF`, `Le coliving, dès ${T}, représente ${F.part2[0]}-${F.part2[1]} % du net. Il reste ${frSp(F.reste2[0])}-${frSp(F.reste2[1])} CHF`);
  add('fiscalite-frontalier-geneve-impots-2026', 'en', 'calcul', 'simulation 2 (net CHF 5,325-5,700): share of net and remainder',
    `Coliving, from ${en(OLD.fromChf)} CHF, represents 24-26% of net. That leaves 3,950-4,320 CHF`, `Coliving, from ${T}, represents ${F.part2[0]}-${F.part2[1]}% of net. That leaves ${en(F.reste2[0])}-${en(F.reste2[1])} CHF`);
  add('fiscalite-frontalier-geneve-impots-2026', 'fr', 'calcul', 'simulation 3 (net 7 258-7 800 CHF) : part du net',
    `Le coliving, dès ${oldFr}, ne représente que 18-19 % du net`, `Le coliving, dès ${T}, ne représente que ${F.part3[0]}-${F.part3[1]} % du net`);
  add('fiscalite-frontalier-geneve-impots-2026', 'en', 'calcul', 'simulation 3 (net CHF 7,258-7,800): share of net',
    `Coliving, from ${en(OLD.fromChf)} CHF, represents only 18-19% of net`, `Coliving, from ${T}, represents only ${F.part3[0]}-${F.part3[1]}% of net`);
  add('fiscalite-frontalier-geneve-impots-2026', 'fr', 'calcul', 'part du net pour 5 300 à 7 000 CHF net (rentShareOfNet)',
    'Ce loyer représente 20 à 27 % de ce net', `Ce loyer représente ${F.part.low} à ${F.part.high} % de ce net`);
  add('fiscalite-frontalier-geneve-impots-2026', 'en', 'calcul', 'share of net for CHF 5,300 to 7,000 net (rentShareOfNet)',
    'This rent represents 20 to 27% of this net', `This rent represents ${F.part.low} to ${F.part.high}% of this net`);

  // organisations-internationales : écart avec un studio côté France.
  add('organisations-internationales-geneve-ou-habiter', 'fr', 'calcul', 'écart mensuel avec un studio côté France (studioPremiumChf)',
    "Le surcoût d'environ 500 à 800 CHF par mois", `Le surcoût d'environ ${D.oi.low} à ${D.oi.high} CHF par mois`);
  add('organisations-internationales-geneve-ou-habiter', 'en', 'calcul', 'monthly premium over a French-side studio (studioPremiumChf)',
    'The premium of roughly CHF 500 to 800 a month', `The premium of roughly CHF ${D.oi.low} to ${D.oi.high} a month`);

  // cout-de-la-vie : phrase d'introduction, total, tableau des trois salaires, seuil des 30 %.
  const K = D.cout;
  const [r1, r2, r3] = K.rows;
  add('cout-de-la-vie-suisse-france-frontalier-2026', 'fr', 'calcul', 'reste après dépenses à 5 300 CHF net (phrase d\'introduction)',
    'et il lui reste 2 100 à 2 800 CHF une fois les dépenses courantes payées', `et il lui reste ${frSp(r2.reste[0])} à ${frSp(r2.reste[1])} CHF une fois les dépenses courantes payées`);
  add('cout-de-la-vie-suisse-france-frontalier-2026', 'en', 'calcul', 'left after everyday costs at CHF 5,300 net (opening sentence)',
    'and CHF 2,100 to 2,800 is left once everyday costs are paid', `and CHF ${en(r2.reste[0])} to ${en(r2.reste[1])} is left once everyday costs are paid`);
  add('cout-de-la-vie-suisse-france-frontalier-2026', 'fr', 'calcul', 'loyer pris pour le calcul (fourchette) et total des dépenses',
    `côté France, ${frSp(OLD.fromChf)} à ${frSp(OLD.standardChf)} CHF par mois charges, fibre et ménage compris. Total : 2 510 à 3 180 CHF de dépenses par mois.`,
    `côté France, ${R('fr')} par mois charges, fibre et ménage compris. Total : ${frSp(K.total[0])} à ${frSp(K.total[1])} CHF de dépenses par mois.`);
  add('cout-de-la-vie-suisse-france-frontalier-2026', 'en', 'calcul', 'rent used for the maths (range) and total spending',
    `on the French side, ${oldR.en} a month with bills, fibre and cleaning included. That's CHF 2,510 to 3,180 of spending a month.`,
    `on the French side, ${R('en')} a month with bills, fibre and cleaning included. That's CHF ${en(K.total[0])} to ${en(K.total[1])} of spending a month.`);
  add('cout-de-la-vie-suisse-france-frontalier-2026', 'fr', 'calcul', 'tableau : 72 000 CHF brut (~4 400 CHF net)',
    '| ~4 400 CHF | 31 à 33 % | 1 200 à 1 900 CHF |', `| ~4 400 CHF | ${r1.part[0]} à ${r1.part[1]} % | ${frSp(r1.reste[0])} à ${frSp(r1.reste[1])} CHF |`);
  add('cout-de-la-vie-suisse-france-frontalier-2026', 'en', 'calcul', 'table: CHF 72,000 gross (~CHF 4,400 net)',
    '| ~CHF 4,400 | 31 to 33% | CHF 1,200 to 1,900 |', `| ~CHF 4,400 | ${r1.part[0]} to ${r1.part[1]}% | CHF ${en(r1.reste[0])} to ${en(r1.reste[1])} |`);
  add('cout-de-la-vie-suisse-france-frontalier-2026', 'fr', 'calcul', 'tableau : 90 000 CHF brut (~5 300 CHF net)',
    '| ~5 300 CHF | 26 à 27 % | 2 100 à 2 800 CHF |', `| ~5 300 CHF | ${r2.part[0]} à ${r2.part[1]} % | ${frSp(r2.reste[0])} à ${frSp(r2.reste[1])} CHF |`);
  add('cout-de-la-vie-suisse-france-frontalier-2026', 'en', 'calcul', 'table: CHF 90,000 gross (~CHF 5,300 net)',
    '| ~CHF 5,300 | 26 to 27% | CHF 2,100 to 2,800 |', `| ~CHF 5,300 | ${r2.part[0]} to ${r2.part[1]}% | CHF ${en(r2.reste[0])} to ${en(r2.reste[1])} |`);
  add('cout-de-la-vie-suisse-france-frontalier-2026', 'fr', 'calcul', 'tableau : 102 000 CHF brut (~5 950 CHF net)',
    '| ~5 950 CHF | 23 à 24 % | 2 750 à 3 450 CHF |', `| ~5 950 CHF | ${r3.part[0]} à ${r3.part[1]} % | ${frSp(r3.reste[0])} à ${frSp(r3.reste[1])} CHF |`);
  add('cout-de-la-vie-suisse-france-frontalier-2026', 'en', 'calcul', 'table: CHF 102,000 gross (~CHF 5,950 net)',
    '| ~CHF 5,950 | 23 to 24% | CHF 2,750 to 3,450 |', `| ~CHF 5,950 | ${r3.part[0]} to ${r3.part[1]}% | CHF ${en(r3.reste[0])} to ${en(r3.reste[1])} |`);
  add('cout-de-la-vie-suisse-france-frontalier-2026', 'fr', 'calcul', 'net à partir duquel le logement passe sous 30 %',
    'tu passes sous ce seuil à partir de 4 600 à 4 800 CHF net par mois', `tu passes sous ce seuil à partir de ${frSp(K.seuil[0])} à ${frSp(K.seuil[1])} CHF net par mois`);
  add('cout-de-la-vie-suisse-france-frontalier-2026', 'en', 'calcul', 'net pay from which housing drops below 30%',
    'you drop below it from CHF 4,600 to 4,800 net a month', `you drop below it from CHF ${en(K.seuil[0])} to ${en(K.seuil[1])} net a month`);
  return E;
}

// ── 3. Metas et posts Facebook (SQL 4) : prix en clair ──────────────────────────────────────────────────────────────────

export function editsMetas(m) {
  assertSource(m);
  const { E, add } = collector('prix-chambres-7-8 (metas)');
  const H = m.HOUSES_FROM;
  const oldFr = `${frNb(OLD.fromChf)} CHF`;
  const newFr = H.fr.chf;                       // « 1 290 CHF »
  const oldEnU = `CHF ${en(OLD.fromChf)}`, newEnU = H.en.chf;               // « CHF 1,290 »
  const oldEnN = `${en(OLD.fromChf)} CHF`, newEnN = `${H.en.chfNum} CHF`;   // « 1,290 CHF » (graphie de ces deux metas, conservée)
  const stdFr = `${frNb(m.STATS.priceChf)} CHF`, stdEn = `CHF ${en(m.STATS.priceChf)}`;
  const meta = (slug, lang, note, find, replace) => add(slug, lang, 'meta', note, find, replace, `meta_description_${lang}`);
  const fb = (slug, lang, note, find, replace) => add(slug, lang, 'facebook', note, find, replace, `facebook_post_${lang}`);

  meta('coliving-geneve-frontaliers-guide-complet', 'fr', 'meta : prix d\'appel en clair', `près de Genève dès ${oldFr}/mois.`, `près de Genève dès ${newFr}/mois.`);
  meta('coliving-geneve-frontaliers-guide-complet', 'en', 'meta: entry price in clear', `near Geneva from ${oldEnN}/month.`, `near Geneva from ${newEnN}/month.`);
  fb('coliving-geneve-frontaliers-guide-complet', 'fr', 'post Facebook : prix d\'appel en clair', `✨ dès ${oldFr}/mois tout inclus`, `✨ dès ${newFr}/mois tout inclus`);
  fb('coliving-geneve-frontaliers-guide-complet', 'en', 'Facebook post: entry price in clear', `✨ from ${oldEnU}/month all-inclusive`, `✨ from ${newEnU}/month all-inclusive`);

  meta('coliving-transfrontalier-geneve-annemasse-nouvelle-vie', 'fr', 'meta : prix d\'appel en clair', `trajet 20 min, dès ${oldFr} tout compris`, `trajet 20 min, dès ${newFr} tout compris`);
  meta('coliving-transfrontalier-geneve-annemasse-nouvelle-vie', 'en', 'meta: entry price in clear', `20-min commute, from ${oldEnN} all-inclusive`, `20-min commute, from ${newEnN} all-inclusive`);
  fb('coliving-transfrontalier-geneve-annemasse-nouvelle-vie', 'fr', 'post Facebook : prix d\'appel en clair', `✨ Dès ${oldFr}/mois`, `✨ Dès ${newFr}/mois`);
  fb('coliving-transfrontalier-geneve-annemasse-nouvelle-vie', 'en', 'Facebook post: entry price in clear', `✨ From ${oldEnU}/month`, `✨ From ${newEnU}/month`);

  // Le Lodge : prix unique (toutes ses chambres ont une salle d'eau privative) — « dès 1 370 CHF » y était déjà faux avant ce lot.
  fb('lodge-annemasse-coliving-premium-portes-geneve', 'fr', 'post Facebook du Lodge : prix unique du Lodge, sans « dès »', `tout compris dès ${oldFr}/mois.`, `tout compris à ${stdFr}/mois.`);
  fb('lodge-annemasse-coliving-premium-portes-geneve', 'en', 'Le Lodge Facebook post: the Lodge\'s single price, no "from"', `all-inclusive from ${oldEnU}/month.`, `all-inclusive at ${stdEn}/month.`);
  return E;
}

// ── 4. Fourchettes en jetons (SQL 3 bis) : dérivée de la bascule ─────────────────────────────────────────────────────────

/**
 * Chaque passage où la bascule a écrit la fourchette en clair la reçoit en jeton. Ancre = le texte posé par la bascule (unique
 * par construction) ; nouveau texte = le même, la fourchette en clair remplacée par son jeton. Rendu identique : aucun
 * changement visible (vérifié par le générateur, qui montre le texte rendu, et par le test du lot).
 */
export function editsFourchettes(m) {
  assertSource(m);
  const { E, add } = collector('prix-chambres-7-8 (fourchettes)');
  for (const e of editsBascule(m, { ranges: 'clair' })) {
    const text = m.priceRangeText(e.lang), cell = m.priceRangeCell(e.lang);
    if (!e.replace.includes(text) && !e.replace.includes(cell)) continue;
    const tokenised = e.replace.split(text).join('{{PRIX_FOURCHETTE}}').split(cell).join('{{PRIX_FOURCHETTE_TABLEAU}}');
    // Même rendu avant et après (les autres jetons du passage, déjà posés par la bascule, sont résolus des deux côtés).
    if (m.resolveContentTokens(tokenised, e.lang) !== m.resolveContentTokens(e.replace, e.lang)) throw new Error(`prix-chambres-7-8 (fourchettes) : ${e.slug} (${e.lang}) — le jeton ne rend pas le texte posé par la bascule`);
    // Une tournure changée par la bascule est déjà en place : la note ne la reprend pas.
    add(e.slug, e.lang, 'jeton', `fourchette en clair → jeton (${e.note.split(' ; tournure : ')[0]})`, e.replace, tokenised);
  }
  return E;
}

// ── En-têtes des fichiers SQL ───────────────────────────────────────────────────────────────────────────────────────────

const COMMON_DOC = {
  sources: 'source unique de la branche feat/prix-chambres-7-8 (src/data/stats.ts : CONTRACT_EUR, HOUSES_FROM ; src/data/answerSlots.ts : priceRangeText, priceRangeCell ; src/lib/contentTokens.ts) ; textes « Avant » lus en base le 13/11/2026',
  encoding: 'Fichier UTF-8 : il contient des espaces insécables (U+00A0, « 1 370 ») et des tirets cadratins — ne pas le faire transiter par un éditeur qui normalise les espaces. La forme à exécuter en séance (un seul bloc, littéraux ASCII) est le fichier .seance.sql du même nom.',
  versions: {},
};
export const sqlDocJetons = () => ({
  ...COMMON_DOC,
  lot: 'Prix des chambres 7 et 8 de La Villa (décision de Jérôme du 12/11/2026) — SQL 1 : chaque « dès 1 370 CHF » du texte des articles devient le jeton {{PRIX_DES}} (pieds communs de 30 articles et mentions isolées)',
  apply: 'Peut être appliqué AVANT la mise en ligne du code : le site connaît déjà {{PRIX_DES}} et le rend à 1 370 CHF (aucun changement visible en français ; en anglais, quelques « 1,370 CHF » deviennent « CHF 1,370 »). Après la mise en ligne, le même jeton rend 1 290 CHF.',
  dryRunTitle: 'Prix des chambres 7 et 8 — SQL 1 : jetons « dès » dans le texte des articles (13/11/2026)',
  legend: 'Légende : « Avant » = texte en base au 13/11/2026 (« 1 370 » contient une espace insécable) ; « Après » = le même texte avec le jeton ; « Rendu sur le site » = ce que le lecteur verra une fois le code de la branche en ligne.',
});
export const sqlDocBascule = () => ({
  ...COMMON_DOC,
  lot: 'Prix des chambres 7 et 8 de La Villa (décision de Jérôme du 12/11/2026) — SQL 3 : fourchette des maisons « 1 290 à 1 430 CHF » (9 articles), chiffres calculés à partir du prix (5 articles), libellés sans « dès » (3 articles)',
  apply: 'À appliquer DANS LE MÊME CRÉNEAU que la fusion de la branche feat/prix-chambres-7-8, juste avant elle et après le SQL 1 : la garde check:slots de la branche exige « 1 290 à 1 430 CHF » dans 4 articles. La fourchette est écrite en clair (ses jetons ne sont connus que du nouveau code) ; le SQL 3 bis la convertit en jetons après la mise en ligne.',
  dryRunTitle: 'Prix des chambres 7 et 8 — SQL 3 : fourchettes, chiffres dérivés et libellés (13/11/2026)',
  legend: 'Légende : « Avant » = texte en base au 13/11/2026 ; « Après » = texte calculé depuis la source unique de la branche (les chiffres dérivés sont recalculés par scripts/prix-chambres-7-8.edits.mjs) ; « Rendu sur le site » = jetons résolus par le code de la branche.',
});
export const sqlDocMetas = () => ({
  ...COMMON_DOC,
  lot: 'Prix des chambres 7 et 8 de La Villa (décision de Jérôme du 12/11/2026) — SQL 4 : metas de 2 articles et posts Facebook de 3 articles, prix en clair (les jetons n\'y sont pas résolus)',
  apply: 'À appliquer dans le même créneau que la fusion de la branche feat/prix-chambres-7-8. Sans effet sur les gardes du site. Les posts Facebook ne sont affichés que dans le tableau de bord : un post déjà publié sur Facebook se corrige à la main.',
  dryRunTitle: 'Prix des chambres 7 et 8 — SQL 4 : metas et posts Facebook (13/11/2026)',
  legend: 'Légende : « Avant » = texte en base au 13/11/2026 ; « Après » = prix en clair calculé depuis la source unique de la branche.',
});
export const sqlDocFourchettes = () => ({
  ...COMMON_DOC,
  lot: 'Prix des chambres 7 et 8 de La Villa (décision de Jérôme du 12/11/2026) — SQL 3 bis : les fourchettes écrites en clair par le SQL 3 deviennent les jetons {{PRIX_FOURCHETTE}} et {{PRIX_FOURCHETTE_TABLEAU}}',
  apply: 'À appliquer APRÈS la mise en ligne du code de la branche feat/prix-chambres-7-8 (le site doit connaître les deux jetons), sans urgence : aucun changement visible. Contrôle : le prérendu suivant (check:slots).',
  dryRunTitle: 'Prix des chambres 7 et 8 — SQL 3 bis : fourchettes en jetons (13/11/2026)',
  legend: 'Légende : « Avant » = texte posé par le SQL 3 ; « Après » = le même texte avec le jeton ; « Rendu sur le site » = identique à « Avant ».',
});
