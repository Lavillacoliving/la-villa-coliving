/**
 * Trajets des maisons (décisions de Jérôme du 12/11/2026) : liste DÉCLARATIVE des modifications de blog_posts, consommée par
 * scripts/build-slots-sql.mjs :
 *
 *   node scripts/build-slots-sql.mjs --edits ./trajets-maisons.edits.mjs --name trajets-maisons --date 2026-11-12 --write-diff
 *
 * Décisions (code : commit « fix(trajets) » de la branche fix/trajets-maisons-2026-11, commentaire de TRANSIT) :
 *  - gare d'Annemasse à pied : La Villa 9 min, Le Loft 9 min, Le Lodge 8 min (valeurs de Jérôme, maintenues après une
 *    vérification sur plan qui donnait des temps de marche plus longs) ; porte-à-porte Eaux-Vives 17 / 17 / 16, Cornavin 33 / 33 / 33 ;
 *    formule D1 « 16 à 17 min porte-à-porte selon la maison » ;
 *  - tram 17 du Lodge : arrêt Barbusse, place de l'Étoile, 2 min (aucun article ne citait l'ancien arrêt du Lodge).
 * Périmètre : les 42 articles publiés, lus le 12/11/2026 (REST anon). Trois familles :
 *  A. pied d'article D1 (GENEVA_COMMUTE_FORMULA) : 23 articles, plus deux fois dans guide-ressources ;
 *  B. phrases de commune (communeSentence, gardées par check:slots) et lignes courtes (houseCommuteLine) ;
 *  C. phrases écrites à la main qui recopient les temps des maisons (9 articles).
 * Hors périmètre, signalé à Jérôme : le prolongement du tram 17 (17/10/2026) encore au futur dans vivre-a-annemasse et
 * ou-habiter-frontalier (« fin 2026 », « aura son terminus », « toutes les six minutes » non vérifié dans l'horaire) ;
 * les itinéraires de gare à gare (Sécheron, Plan-les-Ouates, CERN) ; les temps génériques (« une dizaine de minutes »).
 *
 * Règles : `find` copié au caractère près depuis la base (OLD = sorties de la source unique AVANT le 12/11/2026, identiques à la
 * base) ; `replace` = fonction de la source unique `m` : aucune minute écrite ici en dehors des `find`. Article anglais par
 * m.aOrAn (« an 8-minute walk »). Tutoiement FR, parité FR/EN, rien d'ajouté.
 */

/** Sorties de la source unique avant le 12/11/2026 (= textes en base), calculées depuis origin/main 0cf26809d. */
export const OLD = Object.freeze({
  "formula": {
    "fr": "Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 18 à 24 min porte-à-porte selon la maison, 30 min jusqu'au centre",
    "en": "Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 18 to 24 minutes door to door depending on the house, 30 minutes to the city centre"
  },
  "commune": {
    "lavilla": {
      "fr": "À Ville-la-Grand, La Villa de La Villa Coliving (10 chambres) est à 14 min à pied de la gare d'Annemasse — Genève-Eaux-Vives en 22 min porte-à-porte.",
      "en": "In Ville-la-Grand, La Villa by La Villa Coliving (10 rooms) is a 14-minute walk from Annemasse station — Geneva Eaux-Vives in 22 minutes door to door."
    },
    "leloft": {
      "fr": "À Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.",
      "en": "In Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door."
    },
    "lelodge": {
      "fr": "À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.",
      "en": "In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door."
    }
  },
  "communeLodge2026": {
    "fr": "À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny, ouvert en 2026) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.",
    "en": "In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district, opened in 2026) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door."
  },
  "line": {
    "lavilla": {
      "fr": "gare d'Annemasse à 14 min à pied · Genève-Eaux-Vives en 22 min porte-à-porte",
      "en": "Annemasse station 14 min on foot · Geneva Eaux-Vives in 22 min door-to-door"
    },
    "leloft": {
      "fr": "tram 17 à 8 min à pied, gare d'Annemasse à 18 min · Genève-Eaux-Vives en 24 min porte-à-porte",
      "en": "tram 17 stop 8 min on foot, Annemasse station 18 min · Geneva Eaux-Vives in 24 min door-to-door"
    },
    "lelodge": {
      "fr": "gare d'Annemasse à 10 min à pied · Genève-Eaux-Vives en 18 min porte-à-porte",
      "en": "Annemasse station 10 min on foot · Geneva Eaux-Vives in 18 min door-to-door"
    }
  }
});

const LANGS = ['fr', 'en'];

/** Les 23 articles dont le pied D1 porte la formule une fois (guide-ressources, deux fois, est traité à part). */
export const FOOTER_SLUGS = Object.freeze([
  'allocations-familiales-frontalier-geneve-2026', 'arnaques-logement-frontalier-geneve-eviter', 'assurance-sante-frontalier-lamal-cmu-budget',
  'banque-telephone-internet-frontalier-bons-plans', 'budget-colocation-geneve-guide-complet', 'choc-culturel-franco-suisse-expatrie-geneve',
  'cout-de-la-vie-suisse-france-frontalier-2026', 'declaration-impots-frontalier-2026', 'ecole-internationale-geneve-frontalier-ou-habiter',
  'fiscalite-frontalier-geneve-impots-2026', 'grand-geneve-2026-nouveautes-frontaliers', 'living-in-france-working-in-geneva',
  'optimiser-espace-coliving-productivite-bien-etre', 'organisations-internationales-geneve-ou-habiter', 'ou-habiter-en-france-quand-on-travaille-a-geneve',
  'permis-g-frontalier-geneve', 'quitter-son-logement-guide-pratique', 'salaire-suisse-net-frontalier-2026', 'se-faire-reseau-geneve-arriver-seul',
  'teletravail-frontalier-geneve-regles-2026', 'trouver-colocation-geneve-frontalier', 'trouver-logement-avant-d-arriver-geneve',
  'vie-quotidienne-frontalier-courses-sport-sorties',
]);

/** Articles et maisons dont la phrase de commune est en clair dans le texte (créneaux check:slots et copies). */
const COMMUNE_TARGETS = Object.freeze([
  ['ou-habiter-frontalier-suisse-villes-france-pas-cher', ['lelodge', 'lavilla', 'leloft']],
  ['colocation-annemasse-ville-la-grand-ambilly', ['lelodge', 'lavilla', 'leloft']],
  ['quartiers-annemasse-ou-vivre-selon-profil', ['lelodge']],
  ['vivre-a-annemasse-quand-on-travaille-a-geneve', ['lelodge']],
]);

export function sqlDoc() {
  return {
    lot: "Trajets des maisons (décisions de Jérôme du 12/11/2026) : temps à pied jusqu'à la gare (9 / 9 / 8 min), porte-à-porte recalculés (Eaux-Vives 17 / 17 / 16, Cornavin 33), formule D1 « 16 à 17 min », dans 33 articles publiés (+ extrait et méta du Lodge)",
    sources: 'source unique (stats.ts TRANSIT, houseLocation.ts, answerSlots.ts, entityFacts.ts) de la branche fix/trajets-maisons-2026-11 ; textes « Avant » lus en base le 12/11/2026',
    apply: "À appliquer JUSTE AVANT la fusion de la branche fix/trajets-maisons-2026-11 (check:slots compare les phrases de commune au code : un passage du robot entre les deux échoue et fige la production). Vérifier d'abord qu'aucun prérendu ne tourne (gh run list).",
    encoding: 'Fichier UTF-8 : tirets cadratins (U+2014), points médians (U+00B7), apostrophes droites — ne pas normaliser.',
    dryRunTitle: 'Trajets des maisons — aperçu des substitutions SQL des articles (12/11/2026)',
    legend: 'Légende : « Avant » = texte en base au 12/11/2026 ; « Après » = texte calculé depuis la source unique de la branche.',
    versions: {},
  };
}

export function buildEdits(m) {
  const T = m.TRANSIT, B = T.byHouse, a = m.aOrAn;
  const V = B.lavilla, L = B.leloft, G = B.lelodge;
  const walk = { villa: V.stationWalkMin, loft: L.stationWalkMin, lodge: G.stationWalkMin };
  const minWalk = Math.min(walk.villa, walk.loft, walk.lodge), maxWalk = Math.max(walk.villa, walk.loft, walk.lodge);
  const corn = [V.cornavinDoorToDoorMin, L.cornavinDoorToDoorMin, G.cornavinDoorToDoorMin];
  const cMin = Math.min(...corn), cMax = Math.max(...corn);
  const cornRange = (lang) => (cMin === cMax
    ? (lang === 'en' ? `${cMin} min door to door from each house` : `${cMin} min porte-à-porte depuis chaque maison`)
    : (lang === 'en' ? `${cMin} to ${cMax} min door to door depending on the house` : `${cMin} à ${cMax} min porte-à-porte selon la maison`));
  const E = [];
  const add = (slug, lang, mechanism, note, find, replace, column) => E.push({ slug, lang, mechanism, note, find, replace, ...(column ? { column } : {}) });

  // ── A. Pied d'article D1 ───────────────────────────────────────────────────────────────────────────────────
  for (const slug of FOOTER_SLUGS) for (const lang of LANGS) add(slug, lang, 'formule D1', "pied d'article : porte-à-porte selon la maison", OLD.formula[lang], m.GENEVA_COMMUTE_FORMULA[lang]);
  const GR = 'guide-ressources-frontalier-geneve';
  add(GR, 'fr', 'formule D1', 'paragraphe « propriétaires, pas agence »', `côté France (${OLD.formula.fr}`, `côté France (${m.GENEVA_COMMUTE_FORMULA.fr}`);
  add(GR, 'fr', 'formule D1', "phrase d'appel 👉", `sans frais de dossier. ${OLD.formula.fr}`, `sans frais de dossier. ${m.GENEVA_COMMUTE_FORMULA.fr}`);
  add(GR, 'en', 'formule D1', 'paragraph « owners, not an agency »', `on the French side (${OLD.formula.en}`, `on the French side (${m.GENEVA_COMMUTE_FORMULA.en}`);
  add(GR, 'en', 'formule D1', 'call-to-action line 👉', `no application fee. ${OLD.formula.en}`, `no application fee. ${m.GENEVA_COMMUTE_FORMULA.en}`);
  add(GR, 'fr', 'tableau', 'Cornavin porte-à-porte', '23 min de train, 35 à 40 min porte-à-porte selon la maison', `${T.trainCornavinMin} min de train, ${cornRange('fr')}`);
  add(GR, 'en', 'tableau', 'Cornavin door to door', '23 min by train, 35 to 40 min door to door depending on the house', `${T.trainCornavinMin} min by train, ${cornRange('en')}`);

  // ── B. Phrases de commune et lignes courtes (sorties de la source unique) ─────────────────────────────────────
  for (const [slug, houses] of COMMUNE_TARGETS) for (const h of houses) for (const lang of LANGS)
    add(slug, lang, 'phrase de commune', `communeSentence(${h})`, OLD.commune[h][lang], m.communeSentence(h, lang));
  for (const lang of LANGS) add('vivre-a-annemasse-quand-on-travaille-a-geneve', lang, 'phrase de commune', 'communeSentence(lelodge, ouvert en 2026)', OLD.communeLodge2026[lang], m.communeSentence('lelodge', lang, { openedIn: 2026 }));
  for (const h of ['lavilla', 'leloft', 'lelodge']) for (const lang of LANGS)
    add('quartiers-annemasse-ou-vivre-selon-profil', lang, 'ligne de trajet', `houseCommuteLine(${h})`, OLD.line[h][lang], m.houseCommuteLine(h, lang));
  // Phrase de commune du Lodge avec lien (quartiers-annemasse) : même texte que communeSentence, nom de la maison en lien.
  const linked = (lang) => {
    const s = m.communeSentence('lelodge', lang);
    const out = lang === 'en'
      ? s.replace(/^In Annemasse itself, /, '').replace('Le Lodge by La Villa Coliving', '[Le Lodge](/en/lelodge) by La Villa Coliving')
      : s.replace(/^À Annemasse même, /, '').replace('Le Lodge de La Villa Coliving', '[Le Lodge](/lelodge) de La Villa Coliving');
    if (!out.startsWith('[Le Lodge](')) throw new Error(`trajets-maisons : phrase de commune du Lodge inattendue (${lang}) : ${s}`);
    return out;
  };
  add('quartiers-annemasse-ou-vivre-selon-profil', 'fr', 'phrase de commune', 'communeSentence(lelodge) avec lien', '[Le Lodge](/lelodge) de La Villa Coliving (12 chambres, quartier de Romagny) est à 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte.', linked('fr'));
  add('quartiers-annemasse-ou-vivre-selon-profil', 'en', 'phrase de commune', 'communeSentence(lelodge) with link', '[Le Lodge](/en/lelodge) by La Villa Coliving (12 rooms, Romagny district) is a 10-minute walk from the station — Geneva Eaux-Vives in 18 minutes door to door.', linked('en'));

  // ── C. Phrases écrites à la main ───────────────────────────────────────────────────────────────────────────
  const CC = 'coliving-colocation-ou-studio-geneve-comparatif';
  add(CC, 'fr', 'phrase', 'tableau : gare à pied selon la maison', "gare d'Annemasse à 10 à 18 min à pied selon la maison", `gare d'Annemasse à ${minWalk} à ${maxWalk} min à pied selon la maison`);
  add(CC, 'en', 'phrase', 'table: walk to the station by house', 'Annemasse station a 10 to 18-min walk away depending on the house', `Annemasse station ${a(minWalk)} ${minWalk} to ${maxWalk}-min walk away depending on the house`);
  add(CC, 'fr', 'phrase', 'les trois maisons à pied de la gare', "Les trois maisons sont à 10, 14 et 18 minutes à pied de la gare d'Annemasse", `Les trois maisons sont à ${walk.lodge}, ${walk.villa} et ${walk.loft} minutes à pied de la gare d'Annemasse`);
  add(CC, 'en', 'phrase', 'the three houses from the station', 'The three houses are a 10, 14 and 18-minute walk from Annemasse station', `The three houses are ${a(walk.lodge)} ${walk.lodge}, ${walk.villa} and ${walk.loft}-minute walk from Annemasse station`);

  const CT = 'cout-transport-frontalier-geneve-2026';
  add(CT, 'fr', 'phrase', 'les trois maisons à pied de la gare', "sont à 10, 14 et 18 minutes à pied de la gare d'Annemasse", `sont à ${walk.lodge}, ${walk.villa} et ${walk.loft} minutes à pied de la gare d'Annemasse`);
  add(CT, 'en', 'phrase', 'the three houses from the station', 'are a 10, 14 and 18-minute walk from Annemasse station', `are ${a(walk.lodge)} ${walk.lodge}, ${walk.villa} and ${walk.loft}-minute walk from Annemasse station`);

  const LO = 'lodge-annemasse-coliving-premium-portes-geneve';
  add(LO, 'fr', 'phrase', 'introduction : gare à pied', "notre maison d'Annemasse, à 10 min à pied de la gare d'Annemasse.", `notre maison d'Annemasse, à ${walk.lodge} min à pied de la gare d'Annemasse.`);
  add(LO, 'fr', 'phrase', 'la maison : gare à pied', "La gare d'Annemasse — et son Léman Express — est à 10 minutes à pied.", `La gare d'Annemasse — et son Léman Express — est à ${walk.lodge} minutes à pied.`);
  add(LO, 'fr', 'phrase', 'localisation stratégique', "à 10 minutes à pied de la gare d'Annemasse, Genève-Eaux-Vives en 18 minutes porte-à-porte", `à ${walk.lodge} minutes à pied de la gare d'Annemasse, Genève-Eaux-Vives en ${G.eauxVivesDoorToDoorMin} minutes porte-à-porte`);
  add(LO, 'en', 'phrase', 'introduction: walk to the station', 'our house in Annemasse, a 10-minute walk from Annemasse station.', `our house in Annemasse, ${a(walk.lodge)} ${walk.lodge}-minute walk from Annemasse station.`);
  add(LO, 'en', 'phrase', 'the house: walk to the station', 'is a 10-minute walk away.', `is ${a(walk.lodge)} ${walk.lodge}-minute walk away.`);
  // (relecture du 12/11) Extrait et méta de l'article du Lodge : « 9 minutes de la gare » (valeur d'avant le lot L2) → valeur du 12/11.
  add(LO, 'fr', 'extrait', 'extrait : gare à pied', 'à 9 minutes de la gare', `à ${walk.lodge} minutes de la gare`, 'excerpt_fr');
  add(LO, 'en', 'extrait', 'excerpt: walk to the station', '9 minutes from the station', `${walk.lodge} minutes from the station`, 'excerpt_en');
  add(LO, 'fr', 'méta', 'méta-description : gare à pied', 'à 9 min de la gare', `à ${walk.lodge} min de la gare`, 'meta_description_fr');
  add(LO, 'en', 'méta', 'meta description: walk to the station', '9 min from the station', `${walk.lodge} min from the station`, 'meta_description_en');
  add(LO, 'en', 'phrase', 'strategic location', 'a 10-minute walk from Annemasse station, Geneva Eaux-Vives in 18 minutes door to door', `${a(walk.lodge)} ${walk.lodge}-minute walk from Annemasse station, Geneva Eaux-Vives in ${G.eauxVivesDoorToDoorMin} minutes door to door`);

  const OH = 'ou-habiter-frontalier-suisse-villes-france-pas-cher';
  add(OH, 'fr', 'phrase', 'Ambilly : gare à pied depuis Le Loft', "et la gare d'Annemasse est à 18 min à pied.", `et la gare d'Annemasse est à ${walk.loft} min à pied.`);
  add(OH, 'en', 'phrase', 'Ambilly: walk to the station from Le Loft', 'and Annemasse station is an 18-minute walk.', `and Annemasse station is ${a(walk.loft)} ${walk.loft}-minute walk.`);
  add(OH, 'fr', 'tableau', 'ligne Annemasse (Le Lodge)', '| Genève-Eaux-Vives en 7 min de Léman Express, 18 min porte-à-porte depuis Le Lodge |', `| Genève-Eaux-Vives en ${T.trainEauxVivesMin} min de Léman Express, ${G.eauxVivesDoorToDoorMin} min porte-à-porte depuis Le Lodge |`);
  add(OH, 'fr', 'tableau', 'ligne Ville-la-Grand (La Villa)', '| Genève-Eaux-Vives en 7 min de Léman Express, 22 min porte-à-porte depuis La Villa |', `| Genève-Eaux-Vives en ${T.trainEauxVivesMin} min de Léman Express, ${V.eauxVivesDoorToDoorMin} min porte-à-porte depuis La Villa |`);
  // (relecture du 12/11) Le Loft : les 17 min passent par la gare (Léman Express), pas par le tram 17 cité juste avant.
  add(OH, 'fr', 'tableau', 'ligne Ambilly (Le Loft)', 'Tram 17 : Rive en 23 min ; Genève-Eaux-Vives en 24 min porte-à-porte depuis Le Loft', `Tram 17 : Rive en ${L.tramStop.tramToRiveMin} min ; Léman Express : Genève-Eaux-Vives en ${L.eauxVivesDoorToDoorMin} min porte-à-porte depuis Le Loft`);
  add(OH, 'en', 'tableau', 'Annemasse row (Le Lodge)', '| Geneva Eaux-Vives in 7 min by Léman Express, 18 min door to door from Le Lodge |', `| Geneva Eaux-Vives in ${T.trainEauxVivesMin} min by Léman Express, ${G.eauxVivesDoorToDoorMin} min door to door from Le Lodge |`);
  add(OH, 'en', 'tableau', 'Ville-la-Grand row (La Villa)', '| Geneva Eaux-Vives in 7 min by Léman Express, 22 min door to door from La Villa |', `| Geneva Eaux-Vives in ${T.trainEauxVivesMin} min by Léman Express, ${V.eauxVivesDoorToDoorMin} min door to door from La Villa |`);
  add(OH, 'en', 'tableau', 'Ambilly row (Le Loft)', 'Tram 17: Rive in 23 min; Geneva Eaux-Vives in 24 min door to door from Le Loft', `Tram 17: Rive in ${L.tramStop.tramToRiveMin} min; Léman Express: Geneva Eaux-Vives in ${L.eauxVivesDoorToDoorMin} min door to door from Le Loft`);
  // (relecture du 12/11) Ville-la-Grand, « Pour qui ? » : le quart d'heure collait à l'ancien 14 min de La Villa, cité juste avant.
  add(OH, 'fr', 'phrase', 'Ville-la-Grand : pour qui', "avec le train à un quart d'heure à pied.", "avec le train à moins d'un quart d'heure à pied.");
  add(OH, 'en', 'phrase', 'Ville-la-Grand: for whom', 'with the train a quarter of an hour away on foot.', 'with the train less than a quarter of an hour away on foot.');

  const QA = 'quartiers-annemasse-ou-vivre-selon-profil';
  add(QA, 'fr', 'phrase', 'La Villa : registre résidentiel', "gare d'Annemasse à 14 min à pied, Genève-Eaux-Vives en 22 min porte-à-porte", `gare d'Annemasse à ${walk.villa} min à pied, Genève-Eaux-Vives en ${V.eauxVivesDoorToDoorMin} min porte-à-porte`);
  add(QA, 'en', 'phrase', 'La Villa: residential register', 'Annemasse station is a 14-minute walk, Geneva Eaux-Vives 22 minutes door to door', `Annemasse station is ${a(walk.villa)} ${walk.villa}-minute walk, Geneva Eaux-Vives ${V.eauxVivesDoorToDoorMin} minutes door to door`);

  const TT = 'temps-trajet-annemasse-geneve-par-quartier';
  add(TT, 'fr', 'phrase', 'Léman Express depuis La Villa', '(gare à 14 min à pied de La Villa, à Ville-la-Grand)', `(gare à ${walk.villa} min à pied de La Villa, à Ville-la-Grand)`);
  add(TT, 'en', 'phrase', 'Léman Express from La Villa', '(station a 14-min walk from La Villa, in Ville-la-Grand)', `(station ${a(walk.villa)} ${walk.villa}-min walk from La Villa, in Ville-la-Grand)`);
  add(TT, 'fr', 'phrase', 'Ambilly : gare à pied depuis Le Loft', "La gare d'Annemasse est à 18 minutes à pied du Loft", `La gare d'Annemasse est à ${walk.loft} minutes à pied du Loft`);
  add(TT, 'en', 'phrase', 'Ambilly: walk to the station from Le Loft', 'Annemasse station is an 18-minute walk from Le Loft', `Annemasse station is ${a(walk.loft)} ${walk.loft}-minute walk from Le Loft`);
  add(TT, 'fr', 'phrase', 'Annemasse : gare à pied depuis Le Lodge', 'est à Annemasse, à 10 minutes à pied de la gare.', `est à Annemasse, à ${walk.lodge} minutes à pied de la gare.`);
  add(TT, 'en', 'phrase', 'Annemasse: walk to the station from Le Lodge', 'is in Annemasse, a 10-minute walk from the station.', `is in Annemasse, ${a(walk.lodge)} ${walk.lodge}-minute walk from the station.`);
  add(TT, 'fr', 'phrase', 'les trois maisons', "La Villa à Ville-la-Grand est à 14 minutes à pied de la gare d'Annemasse. Le Loft à Ambilly, à 18 minutes à pied de la gare et à 8 minutes du tram 17. Le Lodge à Annemasse, à 10 minutes à pied.",
    `La Villa à Ville-la-Grand est à ${walk.villa} minutes à pied de la gare d'Annemasse. Le Loft à Ambilly, à ${walk.loft} minutes à pied de la gare et à ${L.tramWalkMin} minutes du tram 17. Le Lodge à Annemasse, à ${walk.lodge} minutes à pied.`);
  add(TT, 'en', 'phrase', 'the three houses', 'La Villa in Ville-la-Grand is a 14-minute walk from Annemasse station. Le Loft in Ambilly, an 18-minute walk from the station and 8 minutes from tram 17. Le Lodge in Annemasse, a 10-minute walk.',
    `La Villa in Ville-la-Grand is ${a(walk.villa)} ${walk.villa}-minute walk from Annemasse station. Le Loft in Ambilly, ${a(walk.loft)} ${walk.loft}-minute walk from the station and ${L.tramWalkMin} minutes from tram 17. Le Lodge in Annemasse, ${a(walk.lodge)} ${walk.lodge}-minute walk.`);
  add(TT, 'fr', 'phrase', 'Plan-les-Ouates : La Villa', 'La Villa (10 chambres) est à 14 min à pied de la gare.', `La Villa (10 chambres) est à ${walk.villa} min à pied de la gare.`);
  add(TT, 'en', 'phrase', 'Plan-les-Ouates: La Villa', 'La Villa (10 rooms) is a 14-min walk from the station', `La Villa (10 rooms) is ${a(walk.villa)} ${walk.villa}-min walk from the station`);

  const TR = 'transport-annemasse-geneve-leman-express';
  add(TR, 'fr', 'phrase', 'depuis nos maisons', 'Depuis nos maisons : 10 min à pied du Lodge (Annemasse), 14 min de La Villa (Ville-la-Grand), 18 min du Loft (Ambilly)', `Depuis nos maisons : ${walk.lodge} min à pied du Lodge (Annemasse), ${walk.villa} min de La Villa (Ville-la-Grand), ${walk.loft} min du Loft (Ambilly)`);
  add(TR, 'en', 'phrase', 'from our houses', 'From our houses: a 10-min walk from Le Lodge (Annemasse), 14 min from La Villa (Ville-la-Grand), 18 min from Le Loft (Ambilly)', `From our houses: ${a(walk.lodge)} ${walk.lodge}-min walk from Le Lodge (Annemasse), ${walk.villa} min from La Villa (Ville-la-Grand), ${walk.loft} min from Le Loft (Ambilly)`);
  add(TR, 'fr', 'tableau', 'Cornavin porte-à-porte depuis La Villa', '23 min de train · 38 min porte-à-porte depuis La Villa', `${T.trainCornavinMin} min de train · ${V.cornavinDoorToDoorMin} min porte-à-porte depuis La Villa`);
  add(TR, 'en', 'tableau', 'Cornavin door to door from La Villa', '23 min by train · 38 min door to door from La Villa', `${T.trainCornavinMin} min by train · ${V.cornavinDoorToDoorMin} min door to door from La Villa`);
  add(TR, 'fr', 'phrase', 'Ville-la-Grand : gare à pied', "La gare d'Annemasse est à 14 min à pied de La Villa, à Ville-la-Grand.", `La gare d'Annemasse est à ${walk.villa} min à pied de La Villa, à Ville-la-Grand.`);
  add(TR, 'en', 'phrase', 'Ville-la-Grand: walk to the station', 'Annemasse station is a 14-min walk from La Villa, in Ville-la-Grand', `Annemasse station is ${a(walk.villa)} ${walk.villa}-min walk from La Villa, in Ville-la-Grand`);
  add(TR, 'fr', 'phrase', 'Ambilly : gare et tram depuis Le Loft', "La gare d'Annemasse est à 18 min à pied du Loft, le tram 17 à 8 min.", `La gare d'Annemasse est à ${walk.loft} min à pied du Loft, le tram 17 à ${L.tramWalkMin} min.`);
  add(TR, 'en', 'phrase', 'Ambilly: station and tram from Le Loft', 'Annemasse station is an 18-min walk from Le Loft, tram 17 an 8-min walk.', `Annemasse station is ${a(walk.loft)} ${walk.loft}-min walk from Le Loft, tram 17 ${a(L.tramWalkMin)} ${L.tramWalkMin}-min walk.`);

  const VA = 'vivre-a-annemasse-quand-on-travaille-a-geneve';
  add(VA, 'fr', 'phrase', 'Ambilly : Le Loft', 'Notre maison Le Loft y est, à 8 minutes à pied du tram et à 18 minutes à pied de la gare.', `Notre maison Le Loft y est, à ${L.tramWalkMin} minutes à pied du tram et à ${walk.loft} minutes à pied de la gare.`);
  add(VA, 'en', 'phrase', 'Ambilly: Le Loft', 'Our house Le Loft is there, an 8-minute walk from the tram and an 18-minute walk from the station.', `Our house Le Loft is there, ${a(L.tramWalkMin)} ${L.tramWalkMin}-minute walk from the tram and ${a(walk.loft)} ${walk.loft}-minute walk from the station.`);
  add(VA, 'fr', 'phrase', 'Ville-la-Grand : La Villa', 'à 14 minutes à pied de la gare depuis notre maison La Villa.', `à ${walk.villa} minutes à pied de la gare depuis notre maison La Villa.`);
  add(VA, 'en', 'phrase', 'Ville-la-Grand: La Villa', 'a 14-minute walk from the station from our house La Villa.', `${a(walk.villa)} ${walk.villa}-minute walk from the station from our house La Villa.`);
  add(VA, 'fr', 'phrase', 'nos trois maisons : Le Lodge', 'Le Lodge à Romagny pour le train (gare à 10 minutes à pied)', `Le Lodge à Romagny pour le train (gare à ${walk.lodge} minutes à pied)`);
  add(VA, 'en', 'phrase', 'our three houses: Le Lodge', 'Le Lodge in Romagny for the train (station a 10-minute walk away)', `Le Lodge in Romagny for the train (station ${a(walk.lodge)} ${walk.lodge}-minute walk away)`);

  return E;
}
