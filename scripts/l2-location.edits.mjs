/**
 * Lot L2 « Emplacement et transport » (brief « Ingénierie des créneaux » v3.1 du 09/10/2026, règles D1, D6, D7 de
 * Jérôme + mise à jour n° 1 du 09/10 14 h) — liste DÉCLARATIVE des modifications d'emplacement à appliquer aux articles
 * de blog stockés en base (table blog_posts : content_fr / content_en, plus facebook_post_fr / facebook_post_en pour deux
 * articles). Consommée par scripts/build-slots-sql.mjs :
 *
 *   node scripts/build-slots-sql.mjs --edits ./l2-location.edits.mjs --name l2-location --write-diff
 *
 * Source des phrases à corriger : recon L0.2b (lavilla-docs/RECON_L0_Creneaux_2026-10-09/L0.2b_emplacement_articles.md,
 * §1, §3 B, §4), re-vérifiée sur le contenu VIVANT du 09/10/2026 (le lot L1 a déjà modifié 30 articles le même jour :
 * pieds d'article, phrases de commune, « 15 minutes du bureau », option coliving de budget-colocation).
 *
 * Règles de ce fichier (09/10/2026, Lot L2) :
 *  - `find` est copié AU CARACTÈRE PRÈS depuis la base (espaces insécables U+00A0 des « 1 430 » écrits `${NB}`, tirets « — »,
 *    « – » et « · » littéraux) ; le générateur exige exactement 1 occurrence par colonne.
 *  - `replace` est une FONCTION de la source unique `m` (scripts/lib/load-entity-facts.mjs → TRANSIT, STATS, STATS_DISPLAY,
 *    GENEVA_COMMUTE_FORMULA, ENTITY_FACTS, houseCommuteLine) : AUCUNE minute, distance, cadence ni prix en dur ici.
 *  - D1 : la destination est toujours nommée (Genève-Eaux-Vives par défaut, Cornavin / Rive quand on les cite), mode par
 *    défaut Léman Express, tram 17 = ancre du Loft seulement, deux nombres (train fixe + porte-à-porte de la maison), le
 *    « 20 min » de marque = STATS_DISPLAY.distance, jamais « environ / moins de / ~ / 15-20 / 20-25 », « 15 min » n'existe plus.
 *  - Jamais de promesse en voiture ni de temps vers l'aéroport (phrase retirée ou remplacée par un fait mesuré) ; vélo =
 *    valeurs Voie Verte de TRANSIT seulement.
 *  - D6 : jamais « mitoyenne » / « adjoins » / « border-adjacent » / « next door » pour La Villa : le Foron, rivière-frontière,
 *    borde la rue ; Le Loft : frontière (le Foron) à 600 m, 8 min à pied, douane de Moillesulaz à 1,8 km ; Le Lodge : rien.
 *  - D7 : aucun numéro de ligne de bus, jamais « TPN » ; un arrêt se décrit « arrêt de bus <nom> à N min à pied » ; pas de
 *    « terminus du Léman Express » pour la gare d'Annemasse.
 *  - FR = tutoiement, EN = « you », parité FR/EN, aucun concurrent nommé, chaînes plates.
 *  - Mécanismes : D1 = minutes / destination / mode · D6 = frontière · D7 = lignes de bus, tram, « terminus » · fix = autre
 *    (prix d'appel d'un post Facebook, « A40 », cadence).
 *
 * Pages de décision (vivre-a-annemasse…, coliving-colocation-ou-studio…) : corrigées dans leurs sources git
 * (content/decision-pages) et republiées par `npm run article:sql` — absentes ici.
 */

export const NB = ' '; // espace insécable des nombres (« 1 430 »), écrit par son code pour ne pas dépendre de l'éditeur

/** Distance lisible, miroir de src/data/houseLocation.ts:formatDistance (non exporté vers Node) : 600 → « 600 m », 1800 → « 1,8 km » / « 1.8 km ». */
export const formatDistance = (meters, lang) => {
  if (meters < 1000) return `${meters} m`;
  const km = meters / 1000;
  const s = Number.isInteger(km) ? String(km) : km.toFixed(1);
  return `${lang === 'en' ? s : s.replace('.', ',')} km`;
};

/** Raccourcis lus dans `m` au moment de la résolution (jamais de valeur figée). */
function facts(m) {
  const T = m.TRANSIT;
  const B = T.byHouse;
  const corn = Object.values(B).map((h) => h.cornavinDoorToDoorMin);
  const bike = Object.values(B).map((h) => h.bikeToRiveMin);
  return {
    T, B,
    ev: T.trainEauxVivesMin, // 7
    corn: T.trainCornavinMin, // 23
    peak: T.peakHeadwayMin, // 10
    MIN: m.STATS.genevaCenterMinutes, // 20 (marque)
    centre: T.centreDoorToDoorMin, // 30
    dist: { fr: m.STATS_DISPLAY.fr.distance, en: m.STATS_DISPLAY.en.distance }, // « 20 min de Genève-Eaux-Vives en Léman Express, porte-à-porte »
    formula: m.GENEVA_COMMUTE_FORMULA,
    commute: (slug, lang) => m.houseCommuteLine(slug, lang),
    price: m.ENTITY_FACTS.price, // fr.fromChf « 1 370 CHF », en.fromChf « CHF 1,370 »
    cornDtdMin: Math.min(...corn), cornDtdMax: Math.max(...corn), // 35-40
    bikeMin: Math.min(...bike), bikeMax: Math.max(...bike), // 23-29
  };
}

const LEX_FR = 'https://www.lemanexpress.com/';
const LEX_EN = 'https://www.lemanexpress.com/en/';

// ── La liste ───────────────────────────────────────────────────────────────────────────────────────

const EDITS = [
  // ═══ quartiers-annemasse-ou-vivre-selon-profil ══════════════════════════════════════════════════
  {
    slug: 'quartiers-annemasse-ou-vivre-selon-profil', lang: 'fr', mechanism: 'D6',
    note: 'intro : « communes mitoyennes » (les communes entre elles, sens différent de D6) → « communes voisines », pour que le mot « mitoyenne » disparaisse du site',
    find: 'une **agglomération de communes mitoyennes**, collée à la frontière genevoise :',
    replace: () => 'une **agglomération de communes voisines**, collée à la frontière genevoise :',
  },
  {
    slug: 'quartiers-annemasse-ou-vivre-selon-profil', lang: 'en', mechanism: 'D6',
    note: 'intro: “cluster of adjoining towns” (towns adjoining each other) → “neighbouring towns”, so that “adjoin” disappears from the site',
    find: 'a **cluster of adjoining towns**, pressed against the Geneva border:',
    replace: () => 'a **cluster of neighbouring towns**, pressed against the Geneva border:',
  },
  {
    slug: 'quartiers-annemasse-ou-vivre-selon-profil', lang: 'fr', mechanism: 'D6',
    note: 'L11 : « frontière mitoyenne au nord-est » (Ville-la-Grand) → le Foron, rivière-frontière (D6) ; direction non sourcée retirée',
    find: '- **Ville-la-Grand** — résidentiel et familial, frontière mitoyenne au nord-est.',
    replace: () => '- **Ville-la-Grand** — résidentiel et familial, bordé par le Foron, la rivière qui marque la frontière suisse.',
  },
  {
    slug: 'quartiers-annemasse-ou-vivre-selon-profil', lang: 'en', mechanism: 'D6',
    note: 'L10: “border-adjacent to the northeast” (Ville-la-Grand) → the Foron, the border river (D6); unsourced direction removed',
    find: '- **Ville-la-Grand** — residential and family-friendly, border-adjacent to the northeast.',
    replace: () => '- **Ville-la-Grand** — residential and family-friendly, bordered by the Foron, the river that marks the Swiss border.',
  },
  {
    slug: 'quartiers-annemasse-ou-vivre-selon-profil', lang: 'fr', mechanism: 'D7',
    note: 'L14 : « terminus français du Léman Express, Genève en moins de 15 min » → temps de train nommés (Eaux-Vives 7, Cornavin 23), plus de « terminus »',
    find: "la **gare d'Annemasse** (terminus français du Léman Express, Genève en moins de 15 min)",
    replace: (m) => { const f = facts(m); return `la **gare d'Annemasse** (Léman Express : Genève-Eaux-Vives en ${f.ev} min de train, Cornavin en ${f.corn} min)`; },
  },
  {
    slug: 'quartiers-annemasse-ou-vivre-selon-profil', lang: 'en', mechanism: 'D7',
    note: 'L13: “French terminus of the Léman Express, Geneva in under 15 min” → named train times (Eaux-Vives 7, Cornavin 23), no “terminus”',
    find: 'the **Annemasse station** (French terminus of the Léman Express, Geneva in under 15 min)',
    replace: (m) => { const f = facts(m); return `the **Annemasse station** (Léman Express: Geneva Eaux-Vives in ${f.ev} min by train, Cornavin in ${f.corn} min)`; },
  },
  {
    slug: 'quartiers-annemasse-ou-vivre-selon-profil', lang: 'fr', mechanism: 'D1',
    note: 'L18 : « Eaux-Vives en ~15 min, Cornavin en ~22 min, 2 à 4 trains par heure » → 7 / 23 min, cadence de pointe TRANSIT',
    find: 'Le Léman Express te dépose à Genève-Eaux-Vives en ~15 min, à Cornavin en ~22 min, avec une fréquence de 2 à 4 trains par heure selon le moment.',
    replace: (m) => { const f = facts(m); return `Le Léman Express te dépose à Genève-Eaux-Vives en ${f.ev} min, à Cornavin en ${f.corn} min, avec un train toutes les ${f.peak} minutes en heure de pointe.`; },
  },
  {
    slug: 'quartiers-annemasse-ou-vivre-selon-profil', lang: 'en', mechanism: 'D1',
    note: 'L17: “Eaux-Vives in ~15 min, Cornavin in ~22 min, 2 to 4 trains per hour” → 7 / 23 min, TRANSIT peak headway',
    find: 'The Léman Express drops you at Geneva-Eaux-Vives in ~15 min, Cornavin in ~22 min, with 2 to 4 trains per hour depending on the time.',
    replace: (m) => { const f = facts(m); return `The Léman Express drops you at Geneva Eaux-Vives in ${f.ev} min, Cornavin in ${f.corn} min, with a train every ${f.peak} minutes at peak times.`; },
  },
  {
    slug: 'quartiers-annemasse-ou-vivre-selon-profil', lang: 'fr', mechanism: 'D7',
    note: 'L28 : « Genève se rejoint à vélo en quelques minutes » (vélo non mesuré) → Rive par la Voie Verte, 23 min depuis Le Loft ; terminus du tram 17 « à Moillesulaz » (faux) → Annemasse, arrêt Parc Montessuit ; Loft « 5 minutes à pied du Tram 17 — Genève centre en ~20 min » → 8 min, arrêt Croix-d\'Ambilly, Rive en 23 min de tram, 32 min porte-à-porte',
    find: "Depuis là, Genève se rejoint à vélo en quelques minutes par les pistes cyclables transfrontalières, ou en **Tram 17** (terminus côté français à Moillesulaz). Notre [Loft, à Ambilly](/leloft), est à 5 minutes à pied du Tram 17 — Genève centre en ~20 min sans changement, et sa piscine intérieure",
    replace: (m) => {
      const { B } = facts(m); const L = B.leloft;
      return `Depuis là, le centre de Genève (Rive) se rejoint à vélo par la Voie Verte (${L.bikeToRiveMin} min depuis Le Loft), ou en **Tram 17** (terminus côté français aujourd'hui à Annemasse, arrêt ${B.lelodge.tramStop.name}). Notre [Loft, à Ambilly](/leloft), est à ${L.tramWalkMin} min à pied du Tram 17 (arrêt ${L.tramStop.name}) — Rive, au centre de Genève, en ${L.tramStop.tramToRiveMin} min de tram sans changement, ${L.riveDoorToDoorMin} min porte-à-porte, et sa piscine intérieure`;
    },
  },
  {
    slug: 'quartiers-annemasse-ou-vivre-selon-profil', lang: 'en', mechanism: 'D7',
    note: 'L27: “Geneva is a few minutes by bike” (unmeasured bike time) → Rive on the Voie Verte, 23 min from Le Loft; tram 17 terminus “at Moillesulaz” (wrong) → Annemasse, Parc Montessuit stop; Loft “5 minutes\' walk from Tram 17 — central Geneva in ~20 min” → 8 min, Croix-d\'Ambilly stop, Rive in 23 min by tram, 32 min door to door',
    find: "From there, Geneva is a few minutes by bike via the cross-border cycle paths, or by **Tram 17** (French terminus at Moillesulaz). Our [Loft, in Ambilly](/en/leloft), is 5 minutes' walk from Tram 17 — central Geneva in ~20 min with no change, plus an indoor pool",
    replace: (m) => {
      const { B } = facts(m); const L = B.leloft;
      return `From there, central Geneva (Rive) is reached by bike on the Voie Verte (${L.bikeToRiveMin} min from Le Loft), or by **Tram 17** (French terminus today in Annemasse, ${B.lelodge.tramStop.name} stop). Our [Loft, in Ambilly](/en/leloft), is an ${L.tramWalkMin}-minute walk from Tram 17 (${L.tramStop.name} stop) — Rive, in central Geneva, in ${L.tramStop.tramToRiveMin} min by tram with no change, ${L.riveDoorToDoorMin} min door to door, plus an indoor pool`;
    },
  },
  {
    slug: 'quartiers-annemasse-ou-vivre-selon-profil', lang: 'fr', mechanism: 'D6',
    note: 'L36 : « 10-15 min de la gare et de la frontière » (mode non précisé, « 15 ») + « frontière mitoyenne » (La Villa) → gare à 14 min à pied, Eaux-Vives en 22 min porte-à-porte, le Foron longe la rue',
    find: "tout en restant à 10-15 min de la gare et de la frontière. Notre maison [La Villa, à Ville-la-Grand](/lavilla), est dans ce registre résidentiel, frontière mitoyenne.",
    replace: (m) => { const V = facts(m).B.lavilla; return `tout en restant proche de la gare et de la frontière. Notre maison [La Villa, à Ville-la-Grand](/lavilla), est dans ce registre résidentiel : gare d'Annemasse à ${V.stationWalkMin} min à pied, Genève-Eaux-Vives en ${V.eauxVivesDoorToDoorMin} min porte-à-porte, et le Foron, la rivière-frontière, longe la rue.`; },
  },
  {
    slug: 'quartiers-annemasse-ou-vivre-selon-profil', lang: 'en', mechanism: 'D6',
    note: 'L35: “10-15 min from the station and the border” (no mode, “15”) + “border-adjacent” (La Villa) → station a 14-minute walk, Eaux-Vives 22 minutes door to door, the Foron runs along the street',
    find: 'while staying 10-15 min from the station and the border. Our [Villa, in Ville-la-Grand](/en/lavilla), fits this residential register, border-adjacent.',
    replace: (m) => { const V = facts(m).B.lavilla; return `while staying close to the station and the border. Our [Villa, in Ville-la-Grand](/en/lavilla), fits this residential register: Annemasse station is a ${V.stationWalkMin}-minute walk, Geneva Eaux-Vives ${V.eauxVivesDoorToDoorMin} minutes door to door, and the Foron, the border river, runs along the street.`; },
  },
  {
    slug: 'quartiers-annemasse-ou-vivre-selon-profil', lang: 'fr', mechanism: 'fix',
    note: 'L64 : « autoroute A40 » (nuisance sonore, pas un trajet) → « autoroute » : le libellé « A40 » disparaît du site',
    find: "Évite les abords immédiats de l'**autoroute A40** et des grands axes",
    replace: () => "Évite les abords immédiats de l'**autoroute** et des grands axes",
  },
  {
    slug: 'quartiers-annemasse-ou-vivre-selon-profil', lang: 'en', mechanism: 'fix',
    note: 'L64: “A40 motorway” (noise, not a commute) → “motorway”: the “A40” label disappears from the site',
    find: 'Avoid the immediate surroundings of the **A40 motorway** and major roads',
    replace: () => 'Avoid the immediate surroundings of the **motorway** and major roads',
  },
  {
    slug: 'quartiers-annemasse-ou-vivre-selon-profil', lang: 'fr', mechanism: 'D1',
    note: 'L99 : « (Léman Express et Tram 17 à pied) » ×3 (faux pour La Villa et le Lodge) → ligne de trajet courte de chaque maison (houseCommuteLine)',
    find: '[Le Lodge à Annemasse](/lelodge) (Léman Express et Tram 17 à pied), [Le Loft à Ambilly](/leloft) (Léman Express et Tram 17 à pied), [La Villa à Ville-la-Grand](/lavilla) (Léman Express et Tram 17 à pied)',
    replace: (m) => { const f = facts(m); return `[Le Lodge à Annemasse](/lelodge) (${f.commute('lelodge', 'fr')}), [Le Loft à Ambilly](/leloft) (${f.commute('leloft', 'fr')}), [La Villa à Ville-la-Grand](/lavilla) (${f.commute('lavilla', 'fr')})`; },
  },
  {
    slug: 'quartiers-annemasse-ou-vivre-selon-profil', lang: 'en', mechanism: 'D1',
    note: 'L92: “(Léman Express and Tram 17 on foot)” ×3 (wrong for La Villa and Le Lodge) → each house\'s short commute line (houseCommuteLine)',
    find: '[Le Lodge in Annemasse](/en/lelodge) (Léman Express and Tram 17 on foot), [Le Loft in Ambilly](/en/leloft) (Léman Express and Tram 17 on foot), [La Villa in Ville-la-Grand](/en/lavilla) (Léman Express and Tram 17 on foot)',
    replace: (m) => { const f = facts(m); return `[Le Lodge in Annemasse](/en/lelodge) (${f.commute('lelodge', 'en')}), [Le Loft in Ambilly](/en/leloft) (${f.commute('leloft', 'en')}), [La Villa in Ville-la-Grand](/en/lavilla) (${f.commute('lavilla', 'en')})`; },
  },

  // ═══ temps-trajet-annemasse-geneve-par-quartier ═════════════════════════════════════════════════
  {
    slug: 'temps-trajet-annemasse-geneve-par-quartier', lang: 'fr', mechanism: 'D6',
    note: 'L16 : « Ville-la-Grand est la commune la plus proche de la frontière suisse » (affirmation contredite ailleurs) → le Foron, rivière-frontière, borde la commune',
    find: 'Ville-la-Grand est la commune la plus proche de la frontière suisse.',
    replace: () => 'Ville-la-Grand est bordée par le Foron, la rivière qui marque la frontière suisse.',
  },
  {
    slug: 'temps-trajet-annemasse-geneve-par-quartier', lang: 'en', mechanism: 'D6',
    note: 'L15: “Ville-la-Grand is the closest municipality to the Swiss border” (claim contradicted elsewhere) → bordered by the Foron, the border river',
    find: 'Ville-la-Grand is the closest municipality to the Swiss border.',
    replace: () => 'Ville-la-Grand is bordered by the Foron, the river that marks the Swiss border.',
  },
  {
    slug: 'temps-trajet-annemasse-geneve-par-quartier', lang: 'fr', mechanism: 'D1',
    note: 'L20 : « gare à 10 min à pied ou 3 min en vélo de Ville-la-Grand : 20 minutes jusqu\'à Cornavin, trains toutes les 15 minutes » → 14 min à pied de La Villa, Eaux-Vives 7 / Cornavin 23, cadence 10',
    find: "En **Léman Express** depuis Annemasse (gare à 10 min à pied ou 3 min en vélo de Ville-la-Grand) : 20 minutes jusqu'à Cornavin, trains toutes les 15 minutes aux heures de pointe.",
    replace: (m) => { const f = facts(m); return `En **Léman Express** depuis Annemasse (gare à ${f.B.lavilla.stationWalkMin} min à pied de La Villa, à Ville-la-Grand) : ${f.ev} minutes jusqu'à Genève-Eaux-Vives, ${f.corn} minutes jusqu'à Cornavin, un train toutes les ${f.peak} minutes aux heures de pointe.`; },
  },
  {
    slug: 'temps-trajet-annemasse-geneve-par-quartier', lang: 'en', mechanism: 'D1',
    note: 'L19: “station 10 min walk or 3 min bike from Ville-la-Grand: 20 minutes to Cornavin, trains every 15 minutes” → 14-min walk from La Villa, Eaux-Vives 7 / Cornavin 23, 10-min headway',
    find: 'By **Léman Express** from Annemasse (station 10 min walk or 3 min bike from Ville-la-Grand): 20 minutes to Cornavin, trains every 15 minutes during rush hour.',
    replace: (m) => { const f = facts(m); return `By **Léman Express** from Annemasse (station a ${f.B.lavilla.stationWalkMin}-min walk from La Villa, in Ville-la-Grand): ${f.ev} minutes to Geneva Eaux-Vives, ${f.corn} minutes to Cornavin, a train every ${f.peak} minutes during rush hour.`; },
  },
  {
    slug: 'temps-trajet-annemasse-geneve-par-quartier', lang: 'fr', mechanism: 'D7',
    note: 'L22 : « En bus (ligne D ou tpg 61) » → numéros de ligne retirés (D7) ; les temps de voiture de la phrase (conseil de marché) sont conservés',
    find: 'En **bus** (ligne D ou tpg 61) : 35-50 minutes selon la circulation.',
    replace: () => 'En **bus** : 35-50 minutes selon la circulation.',
  },
  {
    slug: 'temps-trajet-annemasse-geneve-par-quartier', lang: 'en', mechanism: 'D7',
    note: 'L21: “By bus (line D or tpg 61)” → line numbers removed (D7); the car times of the sentence (market advice) are kept',
    find: 'By **bus** (line D or tpg 61): 35-50 minutes depending on traffic.',
    replace: () => 'By **bus**: 35-50 minutes depending on traffic.',
  },
  {
    slug: 'temps-trajet-annemasse-geneve-par-quartier', lang: 'fr', mechanism: 'D1',
    note: 'L24 : « Léman Express, sans hésitation. 20 minutes, prévisible » (destination absente) → Eaux-Vives 7 / Cornavin 23',
    find: 'Léman Express, sans hésitation. 20 minutes, prévisible, 80 CHF/mois d\'abonnement.',
    replace: (m) => { const f = facts(m); return `Léman Express, sans hésitation. Genève-Eaux-Vives en ${f.ev} minutes, Cornavin en ${f.corn}, prévisible, 80 CHF/mois d'abonnement.`; },
  },
  {
    slug: 'temps-trajet-annemasse-geneve-par-quartier', lang: 'en', mechanism: 'D1',
    note: 'L23: “Léman Express, without hesitation. 20 minutes, predictable” (no destination) → Eaux-Vives 7 / Cornavin 23',
    find: 'Léman Express, without hesitation. 20 minutes, predictable, 80 CHF/month subscription.',
    replace: (m) => { const f = facts(m); return `Léman Express, without hesitation. Geneva Eaux-Vives in ${f.ev} minutes, Cornavin in ${f.corn}, predictable, 80 CHF/month subscription.`; },
  },
  {
    slug: 'temps-trajet-annemasse-geneve-par-quartier', lang: 'fr', mechanism: 'D1',
    note: 'L36 (CERN) : « Léman Express jusqu\'à Cornavin (20 min) » → 23 min',
    find: "Léman Express jusqu'à Cornavin (20 min) + tram 18",
    replace: (m) => `Léman Express jusqu'à Cornavin (${facts(m).corn} min) + tram 18`,
  },
  {
    slug: 'temps-trajet-annemasse-geneve-par-quartier', lang: 'en', mechanism: 'D1',
    note: 'L35 (CERN): “Léman Express to Cornavin (20 min)” → 23 min',
    find: 'Léman Express to Cornavin (20 min) + tram 18',
    replace: (m) => `Léman Express to Cornavin (${facts(m).corn} min) + tram 18`,
  },
  {
    slug: 'temps-trajet-annemasse-geneve-par-quartier', lang: 'fr', mechanism: 'D1',
    note: 'L50 : « La gare d\'Annemasse est à 5-8 minutes en vélo depuis Ambilly » (vélo non sourcé) → 18 min à pied du Loft, arrêt de bus Olympe de Gouges à 6 min, tram 17 à 8 min',
    find: "La gare d'Annemasse est à 5-8 minutes en vélo depuis Ambilly.",
    replace: (m) => { const L = facts(m).B.leloft; return `La gare d'Annemasse est à ${L.stationWalkMin} minutes à pied du Loft (arrêt de bus ${L.busStop.name} à ${L.busStop.walkMin} min), le tram 17 à ${L.tramWalkMin} minutes.`; },
  },
  {
    slug: 'temps-trajet-annemasse-geneve-par-quartier', lang: 'en', mechanism: 'D1',
    note: 'L49: “Annemasse station is 5-8 minutes by bike from Ambilly” (unsourced bike time) → 18-minute walk from Le Loft, Olympe de Gouges bus stop 6 min, tram 17 8 min',
    find: 'Annemasse station is 5-8 minutes by bike from Ambilly.',
    replace: (m) => { const L = facts(m).B.leloft; return `Annemasse station is an ${L.stationWalkMin}-minute walk from Le Loft (${L.busStop.name} bus stop ${L.busStop.walkMin} min away), tram 17 ${L.tramWalkMin} minutes.`; },
  },
  {
    slug: 'temps-trajet-annemasse-geneve-par-quartier', lang: 'fr', mechanism: 'D1',
    note: 'L54 : Le Lodge « à environ 9 minutes à pied de la gare » → 10 minutes',
    find: "est à Annemasse, à environ 9 minutes à pied de la gare.",
    replace: (m) => `est à Annemasse, à ${facts(m).B.lelodge.stationWalkMin} minutes à pied de la gare.`,
  },
  {
    slug: 'temps-trajet-annemasse-geneve-par-quartier', lang: 'en', mechanism: 'D1',
    note: 'L53: Le Lodge “about a 9-minute walk from the station” → 10 minutes',
    find: 'is in Annemasse, about a 9-minute walk from the station.',
    replace: (m) => `is in Annemasse, a ${facts(m).B.lelodge.stationWalkMin}-minute walk from the station.`,
  },
  {
    slug: 'temps-trajet-annemasse-geneve-par-quartier', lang: 'fr', mechanism: 'D1',
    note: 'L64 tableau des modes : « Léman Express | ~80 CHF | 20 min » (destination absente) → 7 min (Eaux-Vives), 23 min (Cornavin)',
    find: '| Léman Express (abonnement) | ~80 CHF | 20 min |',
    replace: (m) => { const f = facts(m); return `| Léman Express (abonnement) | ~80 CHF | ${f.ev} min (Eaux-Vives), ${f.corn} min (Cornavin) |`; },
  },
  {
    slug: 'temps-trajet-annemasse-geneve-par-quartier', lang: 'en', mechanism: 'D1',
    note: 'L63 modes table: “Léman Express | ~80 CHF | 20 min” (no destination) → 7 min (Eaux-Vives), 23 min (Cornavin)',
    find: '| Léman Express (pass) | ~80 CHF | 20 min |',
    replace: (m) => { const f = facts(m); return `| Léman Express (pass) | ~80 CHF | ${f.ev} min (Eaux-Vives), ${f.corn} min (Cornavin) |`; },
  },
  {
    slug: 'temps-trajet-annemasse-geneve-par-quartier', lang: 'fr', mechanism: 'D1',
    note: 'L80 : « La Villa à moins de 10 minutes à pied de la gare. Le Loft à 8 minutes en vélo. Le Lodge à environ 9 minutes à pied » → 14 min à pied / 18 min à pied + tram 17 à 8 min / 10 min à pied',
    find: "La Villa à Ville-la-Grand est à moins de 10 minutes à pied de la gare d'Annemasse. Le Loft à Ambilly, à 8 minutes en vélo. Le Lodge à Annemasse, à environ 9 minutes à pied.",
    replace: (m) => { const { B } = facts(m); return `La Villa à Ville-la-Grand est à ${B.lavilla.stationWalkMin} minutes à pied de la gare d'Annemasse. Le Loft à Ambilly, à ${B.leloft.stationWalkMin} minutes à pied de la gare et à ${B.leloft.tramWalkMin} minutes du tram 17. Le Lodge à Annemasse, à ${B.lelodge.stationWalkMin} minutes à pied.`; },
  },
  {
    slug: 'temps-trajet-annemasse-geneve-par-quartier', lang: 'en', mechanism: 'D1',
    note: 'L79: “La Villa less than a 10-minute walk from the station. Le Loft 8 minutes by bike. Le Lodge about a 9-minute walk” → 14-minute walk / 18-minute walk + tram 17 8 min / 10-minute walk',
    find: 'La Villa in Ville-la-Grand is less than a 10-minute walk from Annemasse station. Le Loft in Ambilly, 8 minutes by bike. Le Lodge in Annemasse, about a 9-minute walk.',
    replace: (m) => { const { B } = facts(m); return `La Villa in Ville-la-Grand is a ${B.lavilla.stationWalkMin}-minute walk from Annemasse station. Le Loft in Ambilly, an ${B.leloft.stationWalkMin}-minute walk from the station and ${B.leloft.tramWalkMin} minutes from tram 17. Le Lodge in Annemasse, a ${B.lelodge.stationWalkMin}-minute walk.`; },
  },
  {
    slug: 'temps-trajet-annemasse-geneve-par-quartier', lang: 'fr', mechanism: 'D1',
    note: 'L86 : « La Villa (10 chambres) est à 10 min de la gare » (mode non précisé, faux) → 14 min à pied',
    find: 'La Villa (10 chambres) est à 10 min de la gare.',
    replace: (m) => `La Villa (10 chambres) est à ${facts(m).B.lavilla.stationWalkMin} min à pied de la gare.`,
  },
  {
    slug: 'temps-trajet-annemasse-geneve-par-quartier', lang: 'en', mechanism: 'D1',
    note: 'L85: “La Villa (10 rooms) is 10 min from the station” (no mode, wrong) → 14-min walk',
    find: 'La Villa (10 rooms) is 10 min from the station.',
    replace: (m) => `La Villa (10 rooms) is a ${facts(m).B.lavilla.stationWalkMin}-min walk from the station.`,
  },
  {
    slug: 'temps-trajet-annemasse-geneve-par-quartier', lang: 'fr', mechanism: 'D1',
    note: 'L88 : « Léman Express jusqu\'à Genève-Aéroport (30 min, direct) » → temps vers l\'aéroport retiré (règle D1 de Jérôme), le fait « direct » reste',
    find: "Annemasse avec Léman Express jusqu'à Genève-Aéroport (30 min, direct).",
    replace: () => "Annemasse, avec le Léman Express direct jusqu'à Genève-Aéroport.",
  },
  {
    slug: 'temps-trajet-annemasse-geneve-par-quartier', lang: 'en', mechanism: 'D1',
    note: 'L87: “Léman Express to Geneva Airport (30 min, direct)” → airport time removed (Jérôme\'s D1 rule), the “direct” fact stays',
    find: 'Annemasse with Léman Express to Geneva Airport (30 min, direct).',
    replace: () => 'Annemasse, with the direct Léman Express to Geneva Airport.',
  },

  // ═══ transport-annemasse-geneve-leman-express ═══════════════════════════════════════════════════
  {
    slug: 'transport-annemasse-geneve-leman-express', lang: 'fr', mechanism: 'D1',
    note: 'L8 : « Annemasse-Genève-Cornavin = 20 minutes. Aéroport (Cointrin) = 25 minutes » → Eaux-Vives 7 / Cornavin 23 ; aéroport : « Léman Express direct depuis Annemasse », sans minute',
    find: '**Temps** : Annemasse-Genève-Cornavin = 20 minutes. Aéroport (Cointrin) = 25 minutes de Annemasse.',
    replace: (m) => { const f = facts(m); return `**Temps** : Annemasse-Genève-Eaux-Vives = ${f.ev} minutes, Annemasse-Genève-Cornavin = ${f.corn} minutes. Aéroport (Cointrin) : Léman Express direct depuis Annemasse.`; },
  },
  {
    slug: 'transport-annemasse-geneve-leman-express', lang: 'en', mechanism: 'D1',
    note: 'L7: “Annemasse-Geneva-Cornavin = 20 minutes. Airport (Cointrin) = 25 minutes” → Eaux-Vives 7 / Cornavin 23; airport: “direct Léman Express from Annemasse”, no minute',
    find: '**Time**: Annemasse-Geneva-Cornavin = 20 minutes. Airport (Cointrin) = 25 minutes from Annemasse.',
    replace: (m) => { const f = facts(m); return `**Time**: Annemasse-Geneva Eaux-Vives = ${f.ev} minutes, Annemasse-Geneva-Cornavin = ${f.corn} minutes. Airport (Cointrin): direct Léman Express from Annemasse.`; },
  },
  {
    slug: 'transport-annemasse-geneve-leman-express', lang: 'fr', mechanism: 'fix',
    note: 'L14 : cadence « Toutes les 15 min en heures de pointe » → 10 min (TRANSIT.peakHeadwayMin, départs relevés le 08/10)',
    find: `[Toutes les 15 min en heures de pointe](${LEX_FR})`,
    replace: (m) => `[Toutes les ${facts(m).peak} min en heures de pointe](${LEX_FR})`,
  },
  {
    slug: 'transport-annemasse-geneve-leman-express', lang: 'en', mechanism: 'fix',
    note: 'L13: headway “Every 15 min peak hours” → 10 min (TRANSIT.peakHeadwayMin, departures surveyed on 8 Oct.)',
    find: `[Every 15 min peak hours](${LEX_EN})`,
    replace: (m) => `[Every ${facts(m).peak} min at peak hours](${LEX_EN})`,
  },
  {
    slug: 'transport-annemasse-geneve-leman-express', lang: 'fr', mechanism: 'D1',
    note: 'L16 : « À Ville-la-Grand, c\'est 10-15 min à pied. À Ambilly, c\'est loin. » → minutes à pied par maison (10 / 14 / 18, tram 17 à 8 min au Loft)',
    find: "À Ville-la-Grand, c'est 10-15 min à pied. À Ambilly, c'est loin.",
    replace: (m) => { const { B } = facts(m); return `Depuis nos maisons : ${B.lelodge.stationWalkMin} min à pied du Lodge (Annemasse), ${B.lavilla.stationWalkMin} min de La Villa (Ville-la-Grand), ${B.leloft.stationWalkMin} min du Loft (Ambilly), qui a aussi le tram 17 à ${B.leloft.tramWalkMin} min.`; },
  },
  {
    slug: 'transport-annemasse-geneve-leman-express', lang: 'en', mechanism: 'D1',
    note: 'L15: “Ville-la-Grand: 10-15 min walk. Ambilly: far.” → walking minutes per house (10 / 14 / 18, tram 17 an 8-min walk from Le Loft)',
    find: 'Ville-la-Grand: 10-15 min walk. Ambilly: far.',
    replace: (m) => { const { B } = facts(m); return `From our houses: a ${B.lelodge.stationWalkMin}-min walk from Le Lodge (Annemasse), ${B.lavilla.stationWalkMin} min from La Villa (Ville-la-Grand), ${B.leloft.stationWalkMin} min from Le Loft (Ambilly), which also has tram 17 an ${B.leloft.tramWalkMin}-min walk away.`; },
  },
  {
    slug: 'transport-annemasse-geneve-leman-express', lang: 'fr', mechanism: 'D1',
    note: 'L35 (section vélo) : « Annemasse-Genève-centre = 35-40 minutes (piste cyclable) » → valeurs Voie Verte de TRANSIT vers Rive (23 à 29 min selon la maison)',
    find: '**Temps** : Annemasse-Genève-centre = 35-40 minutes (piste cyclable).',
    replace: (m) => { const f = facts(m); return `**Temps** : Annemasse-Genève centre (Rive) = ${f.bikeMin} à ${f.bikeMax} minutes par la Voie Verte selon la maison.`; },
  },
  {
    slug: 'transport-annemasse-geneve-leman-express', lang: 'en', mechanism: 'D1',
    note: 'L35 (bike section): “Annemasse-Geneva-center = 35-40 min (bike path)” → TRANSIT Voie Verte values to Rive (23 to 29 min depending on the house)',
    find: '**Time**: Annemasse-Geneva-center = 35-40 min (bike path).',
    replace: (m) => { const f = facts(m); return `**Time**: Annemasse-Geneva centre (Rive) = ${f.bikeMin} to ${f.bikeMax} min on the Voie Verte depending on the house.`; },
  },
  {
    slug: 'transport-annemasse-geneve-leman-express', lang: 'fr', mechanism: 'D1',
    note: 'L76 tableau final : « Léman Express | 200€ | 20 min » (destination absente) → 7 min (Eaux-Vives), 23 min (Cornavin)',
    find: '| Léman Express | 200€ | 20 min | Bas | 9/10 |',
    replace: (m) => { const f = facts(m); return `| Léman Express | 200€ | ${f.ev} min (Eaux-Vives), ${f.corn} min (Cornavin) | Bas | 9/10 |`; },
  },
  {
    slug: 'transport-annemasse-geneve-leman-express', lang: 'en', mechanism: 'D1',
    note: 'L75 final table: “Léman Express | 200€ | 20 min” (no destination) → 7 min (Eaux-Vives), 23 min (Cornavin)',
    find: '| Léman Express | 200€ | 20 min | Low | 9/10 |',
    replace: (m) => { const f = facts(m); return `| Léman Express | 200€ | ${f.ev} min (Eaux-Vives), ${f.corn} min (Cornavin) | Low | 9/10 |`; },
  },
  {
    slug: 'transport-annemasse-geneve-leman-express', lang: 'fr', mechanism: 'D1',
    note: 'L78 tableau final : « Vélo | 0€ | 35-40 min » → valeurs Voie Verte de TRANSIT (23-29 min)',
    find: '| Vélo | 0€ | 35-40 min | Bas | 5/10 (été) |',
    replace: (m) => { const f = facts(m); return `| Vélo | 0€ | ${f.bikeMin}-${f.bikeMax} min (Voie Verte) | Bas | 5/10 (été) |`; },
  },
  {
    slug: 'transport-annemasse-geneve-leman-express', lang: 'en', mechanism: 'D1',
    note: 'L77 final table: “Bike | 0€ | 35-40 min” → TRANSIT Voie Verte values (23-29 min)',
    find: '| Bike | 0€ | 35-40 min | Low | 5/10 (summer) |',
    replace: (m) => { const f = facts(m); return `| Bike | 0€ | ${f.bikeMin}-${f.bikeMax} min (Voie Verte) | Low | 5/10 (summer) |`; },
  },
  {
    slug: 'transport-annemasse-geneve-leman-express', lang: 'fr', mechanism: 'D1',
    note: 'L104 tableau « Depuis Ville-la-Grand » : « Centre (Cornavin) | 22 min » présenté comme porte-à-porte → 23 min de train, 38 min porte-à-porte depuis La Villa',
    find: '| Centre (Cornavin) | 22 min | 20-25 → 40-55 min | 35-50 min | 30-40 min |',
    replace: (m) => { const f = facts(m); return `| Centre (Cornavin) | ${f.corn} min de train, ${f.B.lavilla.cornavinDoorToDoorMin} min porte-à-porte depuis La Villa | 20-25 → 40-55 min | 35-50 min | 30-40 min |`; },
  },
  {
    slug: 'transport-annemasse-geneve-leman-express', lang: 'en', mechanism: 'D1',
    note: 'L98 “From Ville-la-Grand” table: “Center (Cornavin) | 22 min” presented as door to door → 23 min by train, 38 min door to door from La Villa',
    find: '| Center (Cornavin) | 22 min | 20-25 → 40-55 min | 35-50 min | 30-40 min |',
    replace: (m) => { const f = facts(m); return `| Center (Cornavin) | ${f.corn} min by train, ${f.B.lavilla.cornavinDoorToDoorMin} min door to door from La Villa | 20-25 → 40-55 min | 35-50 min | 30-40 min |`; },
  },
  {
    slug: 'transport-annemasse-geneve-leman-express', lang: 'fr', mechanism: 'D1',
    note: 'L106 tableau : « CERN (Meyrin) … (Cornavin 22 min + tram 18) » → 23 min',
    find: '| CERN (Meyrin) | 50-55 min (Cornavin 22 min + tram 18) |',
    replace: (m) => `| CERN (Meyrin) | 50-55 min (Cornavin ${facts(m).corn} min + tram 18) |`,
  },
  {
    slug: 'transport-annemasse-geneve-leman-express', lang: 'en', mechanism: 'D1',
    note: 'L100 table: “CERN (Meyrin) … (Cornavin 22 min + tram 18)” → 23 min',
    find: '| CERN (Meyrin) | 50-55 min (Cornavin 22 min + tram 18) |',
    replace: (m) => `| CERN (Meyrin) | 50-55 min (Cornavin ${facts(m).corn} min + tram 18) |`,
  },
  {
    slug: 'transport-annemasse-geneve-leman-express', lang: 'fr', mechanism: 'D1',
    note: 'L109 : « La gare d\'Annemasse est à 10 min à pied (ou 3 min en vélo) de Ville-la-Grand » → 14 min à pied de La Villa',
    find: "La gare d'Annemasse est à 10 min à pied (ou 3 min en vélo) de Ville-la-Grand.",
    replace: (m) => `La gare d'Annemasse est à ${facts(m).B.lavilla.stationWalkMin} min à pied de La Villa, à Ville-la-Grand.`,
  },
  {
    slug: 'transport-annemasse-geneve-leman-express', lang: 'en', mechanism: 'D1',
    note: 'L103: “Annemasse station is a 10-min walk (or 3-min bike ride) from Ville-la-Grand” → 14-min walk from La Villa',
    find: 'Annemasse station is a 10-min walk (or 3-min bike ride) from Ville-la-Grand.',
    replace: (m) => `Annemasse station is a ${facts(m).B.lavilla.stationWalkMin}-min walk from La Villa, in Ville-la-Grand.`,
  },
  {
    slug: 'transport-annemasse-geneve-leman-express', lang: 'fr', mechanism: 'D1',
    note: 'L113 (Ambilly) : « La gare d\'Annemasse est à 5-8 min en vélo » (vélo non sourcé) → 18 min à pied du Loft, tram 17 à 8 min',
    find: "La gare d'Annemasse est à 5-8 min en vélo.",
    replace: (m) => { const L = facts(m).B.leloft; return `La gare d'Annemasse est à ${L.stationWalkMin} min à pied du Loft, le tram 17 à ${L.tramWalkMin} min.`; },
  },
  {
    slug: 'transport-annemasse-geneve-leman-express', lang: 'en', mechanism: 'D1',
    note: 'L107 (Ambilly): “Annemasse station is 5-8 min by bike” (unsourced bike time) → 18-min walk from Le Loft, tram 17 an 8-min walk',
    find: 'Annemasse station is 5-8 min by bike.',
    replace: (m) => { const L = facts(m).B.leloft; return `Annemasse station is an ${L.stationWalkMin}-min walk from Le Loft, tram 17 an ${L.tramWalkMin}-min walk.`; },
  },
  {
    slug: 'transport-annemasse-geneve-leman-express', lang: 'fr', mechanism: 'D1',
    note: 'L117 : « Vers l\'aéroport, le Léman Express est direct (30 min) » → minute vers l\'aéroport retirée',
    find: "Vers l'aéroport, le Léman Express est direct (30 min).",
    replace: () => "Vers l'aéroport, le Léman Express est direct.",
  },
  {
    slug: 'transport-annemasse-geneve-leman-express', lang: 'en', mechanism: 'D1',
    note: 'L111: “To the airport, the Léman Express is direct (30 min)” → airport minute removed',
    find: 'To the airport, the Léman Express is direct (30 min).',
    replace: () => 'To the airport, the Léman Express is direct.',
  },
  {
    slug: 'transport-annemasse-geneve-leman-express', lang: 'fr', mechanism: 'D1',
    note: 'L123 : « Léman Express direct jusqu\'à Genève-Aéroport (30 min) » → minute retirée',
    find: "- **Aéroport** : Annemasse, Léman Express direct jusqu'à Genève-Aéroport (30 min).",
    replace: () => "- **Aéroport** : Annemasse, Léman Express direct jusqu'à Genève-Aéroport.",
  },
  {
    slug: 'transport-annemasse-geneve-leman-express', lang: 'en', mechanism: 'D1',
    note: 'L117: “direct Léman Express to Geneva Airport (30 min)” → minute removed',
    find: '- **Airport**: Annemasse, direct Léman Express to Geneva Airport (30 min).',
    replace: () => '- **Airport**: Annemasse, direct Léman Express to Geneva Airport.',
  },

  // ═══ coliving-geneve-frontaliers-guide-complet (corps + post Facebook) ═════════════════════════
  {
    slug: 'coliving-geneve-frontaliers-guide-complet', lang: 'fr', mechanism: 'D1',
    note: 'L26 : « tu restes à quelques minutes de ton lieu de travail » (non qualifié) → 7 minutes de train de Genève-Eaux-Vives',
    find: 'À Annemasse par exemple, tu restes à quelques minutes de ton lieu de travail tout en bénéficiant',
    replace: (m) => `À Annemasse par exemple, tu restes à ${facts(m).ev} minutes de train de Genève-Eaux-Vives (Léman Express depuis la gare d'Annemasse) tout en bénéficiant`,
  },
  {
    slug: 'coliving-geneve-frontaliers-guide-complet', lang: 'en', mechanism: 'D1',
    note: 'L25: “you stay just minutes from your workplace” (unqualified) → 7 minutes by train from Geneva Eaux-Vives',
    find: 'In Annemasse, for example, you stay just minutes from your workplace while benefiting from French cost of living.',
    replace: (m) => `In Annemasse, for example, you stay ${facts(m).ev} minutes by train from Geneva Eaux-Vives (Léman Express from Annemasse station) while benefiting from the French cost of living.`,
  },
  {
    slug: 'coliving-geneve-frontaliers-guide-complet', lang: 'fr', mechanism: 'D1',
    note: 'L62 : « 20 minutes en transport en commun pour rejoindre le centre de Genève » → libellé de marque STATS_DISPLAY.distance',
    find: '**Proximité de Genève** : 20 minutes en transport en commun pour rejoindre le centre de Genève',
    replace: (m) => `**Proximité de Genève** : ${facts(m).dist.fr}`,
  },
  {
    slug: 'coliving-geneve-frontaliers-guide-complet', lang: 'en', mechanism: 'D1',
    note: 'L61: “20 minutes by public transport to reach Geneva center” → brand wording STATS_DISPLAY.distance',
    find: '**Geneva proximity**: 20 minutes by public transport to reach Geneva center',
    replace: (m) => `**Geneva proximity**: ${facts(m).dist.en}`,
  },
  {
    slug: 'coliving-geneve-frontaliers-guide-complet', lang: 'fr', column: 'facebook_post_fr', mechanism: 'D1',
    note: 'post Facebook : « 🚊 15 min de Genève en transports » → STATS_DISPLAY.distance',
    find: '🚊 15 min de Genève en transports',
    replace: (m) => `🚊 ${facts(m).dist.fr}`,
  },
  {
    slug: 'coliving-geneve-frontaliers-guide-complet', lang: 'en', column: 'facebook_post_en', mechanism: 'D1',
    note: 'Facebook post: “🚊 15 min from Geneva by transport” → STATS_DISPLAY.distance',
    find: '🚊 15 min from Geneva by transport',
    replace: (m) => `🚊 ${facts(m).dist.en}`,
  },
  {
    slug: 'coliving-geneve-frontaliers-guide-complet', lang: 'fr', column: 'facebook_post_fr', mechanism: 'fix',
    note: 'post Facebook : « ✨ 1 430 CHF/mois tout inclus » (second palier, interdit hors /tarifs) → prix d\'appel « dès 1 370 CHF/mois »',
    find: `✨ 1${NB}430 CHF/mois tout inclus à Annemasse`,
    replace: (m) => `✨ dès ${facts(m).price.fr.fromChf}/mois tout inclus à Annemasse`,
  },
  {
    slug: 'coliving-geneve-frontaliers-guide-complet', lang: 'en', column: 'facebook_post_en', mechanism: 'fix',
    note: 'Facebook post: “✨ 1,430 CHF/month all-inclusive” (second tier, forbidden outside /tarifs) → entry price “from CHF 1,370/month”',
    find: '✨ 1,430 CHF/month all-inclusive in Annemasse',
    replace: (m) => `✨ from ${facts(m).price.en.fromChf}/month all-inclusive in Annemasse`,
  },

  // ═══ lodge-annemasse-coliving-premium-portes-geneve (corps + post Facebook) ════════════════════
  {
    slug: 'lodge-annemasse-coliving-premium-portes-geneve', lang: 'fr', mechanism: 'D1',
    note: 'L2 : « à quelques minutes seulement de la frontière suisse » (Le Lodge : aucune promesse de frontière) → 10 min à pied de la gare d\'Annemasse',
    find: "notre maison d'Annemasse, à quelques minutes seulement de la frontière suisse.",
    replace: (m) => `notre maison d'Annemasse, à ${facts(m).B.lelodge.stationWalkMin} min à pied de la gare d'Annemasse.`,
  },
  {
    slug: 'lodge-annemasse-coliving-premium-portes-geneve', lang: 'en', mechanism: 'D1',
    note: 'L1: “just minutes from the Swiss border” (Le Lodge: no border promise) → a 10-minute walk from Annemasse station',
    find: 'our house in Annemasse, just minutes from the Swiss border.',
    replace: (m) => `our house in Annemasse, a ${facts(m).B.lelodge.stationWalkMin}-minute walk from Annemasse station.`,
  },
  {
    slug: 'lodge-annemasse-coliving-premium-portes-geneve', lang: 'fr', mechanism: 'D1',
    note: 'L10 : « relie la gare d\'Annemasse à Cornavin en 20 minutes » → Genève-Eaux-Vives en 7 minutes et Cornavin en 23',
    find: "Le Léman Express relie la gare d'Annemasse à Cornavin en 20 minutes, et le tram 17",
    replace: (m) => { const f = facts(m); return `Le Léman Express relie la gare d'Annemasse à Genève-Eaux-Vives en ${f.ev} minutes et à Cornavin en ${f.corn} minutes, et le tram 17`; },
  },
  {
    slug: 'lodge-annemasse-coliving-premium-portes-geneve', lang: 'en', mechanism: 'D1',
    note: 'L9: “connects Annemasse station to Cornavin in 20 minutes” → Geneva Eaux-Vives in 7 minutes and Cornavin in 23',
    find: 'The Léman Express connects Annemasse station to Cornavin in 20 minutes, and tram 17',
    replace: (m) => { const f = facts(m); return `The Léman Express connects Annemasse station to Geneva Eaux-Vives in ${f.ev} minutes and to Cornavin in ${f.corn} minutes, and tram 17`; },
  },
  {
    slug: 'lodge-annemasse-coliving-premium-portes-geneve', lang: 'fr', mechanism: 'D1',
    note: 'L20 : « La gare d\'Annemasse — et son Léman Express — est à environ 9 minutes à pied » → 10 minutes',
    find: "La gare d'Annemasse — et son Léman Express — est à environ 9 minutes à pied.",
    replace: (m) => `La gare d'Annemasse — et son Léman Express — est à ${facts(m).B.lelodge.stationWalkMin} minutes à pied.`,
  },
  {
    slug: 'lodge-annemasse-coliving-premium-portes-geneve', lang: 'en', mechanism: 'D1',
    note: 'L19: “Annemasse station — and its Léman Express — is about a 9-minute walk away” → 10-minute walk',
    find: 'Annemasse station — and its Léman Express — is about a 9-minute walk away.',
    replace: (m) => `Annemasse station — and its Léman Express — is a ${facts(m).B.lelodge.stationWalkMin}-minute walk away.`,
  },
  {
    slug: 'lodge-annemasse-coliving-premium-portes-geneve', lang: 'fr', mechanism: 'D1',
    note: 'L24 : « environ 9 minutes à pied de la gare, soit 20 minutes de Cornavin » → 10 min à pied, Eaux-Vives en 18 min porte-à-porte, Cornavin en 23 min de train',
    find: "à environ 9 minutes à pied de la gare d'Annemasse, soit 20 minutes de Cornavin en Léman Express",
    replace: (m) => { const f = facts(m); const G = f.B.lelodge; return `à ${G.stationWalkMin} minutes à pied de la gare d'Annemasse, Genève-Eaux-Vives en ${G.eauxVivesDoorToDoorMin} minutes porte-à-porte et Cornavin en ${f.corn} minutes de Léman Express`; },
  },
  {
    slug: 'lodge-annemasse-coliving-premium-portes-geneve', lang: 'en', mechanism: 'D1',
    note: 'L23: “about 9 minutes\' walk from the station, i.e. 20 minutes from Cornavin” → 10-minute walk, Eaux-Vives in 18 minutes door to door, Cornavin in 23 minutes by train',
    find: "about 9 minutes' walk from Annemasse station, i.e. 20 minutes from Cornavin by Léman Express",
    replace: (m) => { const f = facts(m); const G = f.B.lelodge; return `a ${G.stationWalkMin}-minute walk from Annemasse station, Geneva Eaux-Vives in ${G.eauxVivesDoorToDoorMin} minutes door to door and Cornavin in ${f.corn} minutes by Léman Express`; },
  },
  {
    slug: 'lodge-annemasse-coliving-premium-portes-geneve', lang: 'fr', column: 'facebook_post_fr', mechanism: 'D1',
    note: 'post Facebook : « tout compris à 1 430 CHF/mois. À 10 minutes de Genève » (second palier + minute fausse non qualifiée) → « dès 1 370 CHF/mois » + STATS_DISPLAY.distance',
    find: `tout compris à 1${NB}430 CHF/mois. À 10 minutes de Genève, à des années-lumière`,
    replace: (m) => { const f = facts(m); return `tout compris dès ${f.price.fr.fromChf}/mois. À ${f.dist.fr}, à des années-lumière`; },
  },
  {
    slug: 'lodge-annemasse-coliving-premium-portes-geneve', lang: 'en', column: 'facebook_post_en', mechanism: 'D1',
    note: 'Facebook post: “all-inclusive at 1,430 CHF/month. 10 minutes from Geneva” (second tier + wrong unqualified minute) → “from CHF 1,370/month” + STATS_DISPLAY.distance',
    find: 'all-inclusive at 1,430 CHF/month. 10 minutes from Geneva, light-years',
    replace: (m) => { const f = facts(m); return `all-inclusive from ${f.price.en.fromChf}/month. ${f.dist.en.charAt(0).toUpperCase()}${f.dist.en.slice(1)}, light-years`; },
  },

  // ═══ ou-habiter-frontalier-suisse-villes-france-pas-cher ════════════════════════════════════════
  {
    slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'fr', mechanism: 'D1',
    note: 'L10 fiche Annemasse : « Temps de trajet : 15-20 min en Léman Express » → Genève-Eaux-Vives en 7 min, Cornavin en 23 (lien conservé)',
    find: `**Temps de trajet** : 15-20 min [en Léman Express](${LEX_FR})`,
    replace: (m) => { const f = facts(m); return `**Temps de trajet** : Genève-Eaux-Vives en ${f.ev} min [en Léman Express](${LEX_FR}), Cornavin en ${f.corn} min`; },
  },
  {
    slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'en', mechanism: 'D1',
    note: 'L11 Annemasse card: “Commute: 15-20 min by Léman Express” → Geneva Eaux-Vives in 7 min, Cornavin in 23 (link kept)',
    find: `**Commute**: [15-20 min by Léman Express](${LEX_FR})`,
    replace: (m) => { const f = facts(m); return `**Commute**: Geneva Eaux-Vives in ${f.ev} min [by Léman Express](${LEX_FR}), Cornavin in ${f.corn} min`; },
  },
  {
    slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'fr', mechanism: 'D1',
    note: 'L12 : « Le Léman Express te dépose à Cornavin en 20 minutes » → Eaux-Vives 7 / Cornavin 23',
    find: 'Le Léman Express te dépose à Cornavin en 20 minutes.',
    replace: (m) => { const f = facts(m); return `Le Léman Express te dépose à Genève-Eaux-Vives en ${f.ev} minutes et à Cornavin en ${f.corn} minutes.`; },
  },
  {
    slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'en', mechanism: 'D1',
    note: 'L13: “The Léman Express drops you at Cornavin in 20 minutes” → Eaux-Vives 7 / Cornavin 23',
    find: 'The Léman Express drops you at Cornavin in 20 minutes.',
    replace: (m) => { const f = facts(m); return `The Léman Express drops you at Geneva Eaux-Vives in ${f.ev} minutes and at Cornavin in ${f.corn} minutes.`; },
  },
  {
    slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'fr', mechanism: 'D1',
    note: 'L20 fiche Ville-la-Grand : « 12 min en voiture, 20 min en bus » (promesse en voiture) → Léman Express 7 min, 22 min porte-à-porte depuis La Villa',
    find: '**Temps de trajet** : 12 min en voiture, 20 min en bus',
    replace: (m) => { const f = facts(m); return `**Temps de trajet** : Genève-Eaux-Vives en ${f.ev} min de Léman Express, ${f.B.lavilla.eauxVivesDoorToDoorMin} min porte-à-porte depuis La Villa`; },
  },
  {
    slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'en', mechanism: 'D1',
    note: 'L23 Ville-la-Grand card: “12 min by car, 20 min by bus” (car promise) → Léman Express 7 min, 22 min door to door from La Villa',
    find: '**Commute**: 12 min by car, 20 min by bus',
    replace: (m) => { const f = facts(m); return `**Commute**: Geneva Eaux-Vives in ${f.ev} min by Léman Express, ${f.B.lavilla.eauxVivesDoorToDoorMin} min door to door from La Villa`; },
  },
  {
    slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'fr', mechanism: 'D7',
    note: 'L22 : « plusieurs lignes TPN qui filent direct sur Genève » (TPN = réseau de Nyon) → le Léman Express depuis la gare d\'Annemasse',
    find: 'plusieurs lignes TPN qui filent direct sur Genève.',
    replace: () => "le Léman Express depuis la gare d'Annemasse.",
  },
  {
    slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'en', mechanism: 'D7',
    note: 'L25: “several TPN bus lines straight to Geneva” (TPN = Nyon network) → the Léman Express from Annemasse station',
    find: 'several TPN bus lines straight to Geneva.',
    replace: () => 'the Léman Express from Annemasse station.',
  },
  {
    slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'fr', mechanism: 'D6',
    note: 'L68 fiche Ambilly : « Frontière à pied : 5 min · 10 min en voiture, 10 min en Tram, 20 min en CEVA » → le Foron à 8 min (600 m du Loft) · Rive en 23 min de tram 17, Eaux-Vives en 7 min de Léman Express',
    find: '**Frontière à pied** : 5 min · **Temps de trajet Genève** : 10 min en voiture, 10 min en Tram, 20 min en CEVA',
    replace: (m) => { const f = facts(m); const L = f.B.leloft; return `**Frontière à pied** : ${L.border.foronWalkMin} min (le Foron, à ${formatDistance(L.border.foronDistanceM, 'fr')} du Loft) · **Temps de trajet Genève** : Rive en ${L.tramStop.tramToRiveMin} min de tram 17, Genève-Eaux-Vives en ${f.ev} min de Léman Express`; },
  },
  {
    slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'en', mechanism: 'D6',
    note: 'L71 Ambilly card: “Walk to border: 5 min · 10 min by car, 10 min by tram, 20 min by CEVA” → the Foron 8 min (600 m from Le Loft) · Rive in 23 min by tram 17, Eaux-Vives in 7 min by Léman Express',
    find: '**Walk to border**: 5 min · **Commute to Geneva**: 10 min by car, 10 min by tram, 20 min by CEVA',
    replace: (m) => { const f = facts(m); const L = f.B.leloft; return `**Walk to border**: ${L.border.foronWalkMin} min (the Foron, ${formatDistance(L.border.foronDistanceM, 'en')} from Le Loft) · **Commute to Geneva**: Rive in ${L.tramStop.tramToRiveMin} min by tram 17, Geneva Eaux-Vives in ${f.ev} min by Léman Express`; },
  },
  {
    slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'fr', mechanism: 'D6',
    note: 'L70 : « la commune française la plus proche de la frontière : compte 5 minutes à pied jusqu\'au poste de douane » → le Foron à 600 m / 8 min du Loft, douane de Moillesulaz à 1,8 km',
    find: 'Ambilly est la commune française la plus proche de la frontière : compte 5 minutes à pied jusqu\'au poste de douane.',
    replace: (m) => { const b = facts(m).B.leloft.border; return `Ambilly est la commune collée à la frontière : depuis Le Loft, le Foron, la rivière-frontière, est à ${formatDistance(b.foronDistanceM, 'fr')}, ${b.foronWalkMin} min à pied, et la douane de Moillesulaz à ${formatDistance(b.moillesulazM, 'fr')}.`; },
  },
  {
    slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'en', mechanism: 'D6',
    note: 'L73: “the closest French town to the border — about a 5-minute walk to the border crossing” → the Foron 600 m / 8 min from Le Loft, Moillesulaz crossing 1.8 km',
    find: 'Ambilly is the closest French town to the border — about a 5-minute walk to the border crossing.',
    replace: (m) => { const b = facts(m).B.leloft.border; return `Ambilly is the town right on the border: from Le Loft, the Foron, the border river, is ${formatDistance(b.foronDistanceM, 'en')} away, an ${b.foronWalkMin}-minute walk, and the Moillesulaz crossing ${formatDistance(b.moillesulazM, 'en')} away.`; },
  },
  {
    slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'fr', mechanism: 'D7',
    note: 'L76 : « Un tram Annemasse-Genève est prévu pour 2027 » (faux) → prolongement du tram 17 dans Annemasse fin 2026 (Annemasse Agglo)',
    find: '- Un **tram Annemasse-Genève** est prévu pour **2027**, en plus du Tram 17 déjà direct sur Genève.',
    replace: () => '- Le **Tram 17**, déjà direct sur Genève, est **prolongé dans Annemasse fin 2026** (trois nouveaux arrêts, Annemasse Agglo).',
  },
  {
    slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'en', mechanism: 'D7',
    note: 'L81: “An Annemasse-Geneva tram is planned for 2027” (wrong) → tram 17 extended into Annemasse at the end of 2026 (Annemasse Agglo)',
    find: '- An **Annemasse-Geneva tram** is planned for **2027**.',
    replace: () => '- **Tram 17**, already direct to Geneva, is **extended into Annemasse at the end of 2026** (three new stops, Annemasse Agglo).',
  },
  {
    slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'fr', mechanism: 'D1',
    note: 'L83 tableau récapitulatif : « Annemasse | 15-20 min » (mode non précisé) → 18 min porte-à-porte jusqu\'à Genève-Eaux-Vives (Léman Express, depuis Le Lodge)',
    find: '| Annemasse | 15-20 min |',
    replace: (m) => `| Annemasse | ${facts(m).B.lelodge.eauxVivesDoorToDoorMin} min porte-à-porte jusqu'à Genève-Eaux-Vives (Léman Express, depuis Le Lodge) |`,
  },
  {
    slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'en', mechanism: 'D1',
    note: 'L88 summary table: “Annemasse | 15-20 min” (no mode) → 18 min door to door to Geneva Eaux-Vives (Léman Express, from Le Lodge)',
    find: '| Annemasse | 15-20 min |',
    replace: (m) => `| Annemasse | ${facts(m).B.lelodge.eauxVivesDoorToDoorMin} min door to door to Geneva Eaux-Vives (Léman Express, from Le Lodge) |`,
  },
  {
    slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'fr', mechanism: 'D1',
    note: 'L84 tableau récapitulatif : « Ville-la-Grand | 12-20 min » → 22 min porte-à-porte jusqu\'à Genève-Eaux-Vives (Léman Express, depuis La Villa)',
    find: '| **Ville-la-Grand** | **12-20 min** |',
    replace: (m) => `| **Ville-la-Grand** | **${facts(m).B.lavilla.eauxVivesDoorToDoorMin} min porte-à-porte jusqu'à Genève-Eaux-Vives (Léman Express, depuis La Villa)** |`,
  },
  {
    slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'en', mechanism: 'D1',
    note: 'L89 summary table: “Ville-la-Grand | 12-20 min” → 22 min door to door to Geneva Eaux-Vives (Léman Express, from La Villa)',
    find: '| **Ville-la-Grand** | **12-20 min** |',
    replace: (m) => `| **Ville-la-Grand** | **${facts(m).B.lavilla.eauxVivesDoorToDoorMin} min door to door to Geneva Eaux-Vives (Léman Express, from La Villa)** |`,
  },
  {
    slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'fr', mechanism: 'D7',
    note: 'L107 : « les bus transfrontaliers TPG/TPN » → TPG (TPN = réseau de Nyon)',
    find: 'les bus transfrontaliers TPG/TPN',
    replace: () => 'les bus transfrontaliers TPG',
  },
  {
    slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'en', mechanism: 'D7',
    note: 'L109: “the cross-border TPG/TPN buses” → TPG (TPN = Nyon network)',
    find: 'the cross-border TPG/TPN buses',
    replace: () => 'the cross-border TPG buses',
  },
  {
    slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'fr', mechanism: 'D1',
    note: 'L109 (absent en EN) : « 3 maisons côté France, à 20 minutes du centre de Genève porte à porte » → STATS_DISPLAY.distance',
    find: '3 maisons côté France, à 20 minutes du centre de Genève porte à porte, chambre meublée',
    replace: (m) => `3 maisons côté France, à ${facts(m).dist.fr}, chambre meublée`,
  },

  // ═══ coliving-annemasse-geneve-frontaliers-avantages ════════════════════════════════════════════
  {
    slug: 'coliving-annemasse-geneve-frontaliers-avantages', lang: 'fr', mechanism: 'D1',
    note: 'L12 : « Située à seulement 20 minutes de Genève en Léman Express » (destination vague) → 7 minutes de Genève-Eaux-Vives depuis sa gare',
    find: `Située à seulement 20 minutes de Genève en [Léman Express](${LEX_FR}), **Annemasse**`,
    replace: (m) => `Située à ${facts(m).ev} minutes de Genève-Eaux-Vives en [Léman Express](${LEX_FR}) depuis sa gare, **Annemasse**`,
  },
  {
    slug: 'coliving-annemasse-geneve-frontaliers-avantages', lang: 'en', mechanism: 'D1',
    note: 'L11: “Located just 20 minutes from Geneva on the Léman Express” (vague destination) → 7 minutes from Geneva Eaux-Vives from its station',
    find: `Located just 20 minutes from Geneva on the [Léman Express](${LEX_FR}), **Annemasse**`,
    replace: (m) => `Located ${facts(m).ev} minutes from Geneva Eaux-Vives by [Léman Express](${LEX_FR}) from its station, **Annemasse**`,
  },
  {
    slug: 'coliving-annemasse-geneve-frontaliers-avantages', lang: 'fr', mechanism: 'D1',
    note: 'L97 : « 20 minutes du centre de Genève en Léman Express » (forme interdite par D1) → libellé de marque',
    find: '- **20 minutes** du centre de Genève en Léman Express',
    replace: (m) => `- **${facts(m).MIN} min** de Genève-Eaux-Vives en Léman Express, porte-à-porte`,
  },
  {
    slug: 'coliving-annemasse-geneve-frontaliers-avantages', lang: 'en', mechanism: 'D1',
    note: 'L96: “20 minutes from Geneva center on the Léman Express” (wording forbidden by D1) → brand wording',
    find: '- **20 minutes** from Geneva center on the Léman Express',
    replace: (m) => `- **${facts(m).MIN} min** from Geneva Eaux-Vives by Léman Express, door to door`,
  },
  {
    slug: 'coliving-annemasse-geneve-frontaliers-avantages', lang: 'fr', mechanism: 'D1',
    note: 'L183 : « Et Genève, à quelques minutes » (non qualifié) → 7 minutes de Léman Express depuis la gare d\'Annemasse',
    find: "Et Genève, à quelques minutes, enrichit encore l'offre",
    replace: (m) => `Et Genève, à ${facts(m).ev} minutes de Léman Express depuis la gare d'Annemasse, enrichit encore l'offre`,
  },
  {
    slug: 'coliving-annemasse-geneve-frontaliers-avantages', lang: 'en', mechanism: 'D1',
    note: 'L182: “And Geneva, just minutes away” (unqualified) → 7 minutes away by Léman Express from Annemasse station',
    find: 'And Geneva, just minutes away, enriches the offering even further',
    replace: (m) => `And Geneva, ${facts(m).ev} minutes away by Léman Express from Annemasse station, enriches the offering even further`,
  },

  // ═══ guide-ressources-frontalier-geneve ═════════════════════════════════════════════════════════
  {
    slug: 'guide-ressources-frontalier-geneve', lang: 'fr', mechanism: 'D1',
    note: 'L392 : « à une vingtaine de minutes de Genève, côté France » (non qualifié) → formule D1 (GENEVA_COMMUTE_FORMULA)',
    find: 'des maisons de chambres meublées tout inclus à une vingtaine de minutes de Genève, côté France, pensées pour',
    replace: (m) => `des maisons de chambres meublées tout inclus côté France (${facts(m).formula.fr}), pensées pour`,
  },
  {
    slug: 'guide-ressources-frontalier-geneve', lang: 'en', mechanism: 'D1',
    note: 'L390: “about twenty minutes from Geneva, on the French side” (unqualified) → D1 formula (GENEVA_COMMUTE_FORMULA)',
    find: 'a set of houses with all-inclusive furnished rooms about twenty minutes from Geneva, on the French side, designed for',
    replace: (m) => `a set of houses with all-inclusive furnished rooms on the French side (${facts(m).formula.en}), designed for`,
  },
  {
    slug: 'guide-ressources-frontalier-geneve', lang: 'fr', mechanism: 'D1',
    note: 'L253 tableau par destination : « Centre (Cornavin) | Léman Express direct | ~22 min » → 23 min de train, 35 à 40 min porte-à-porte selon la maison',
    find: '| Centre (Cornavin) | Léman Express direct | ~22 min |',
    replace: (m) => { const f = facts(m); return `| Centre (Cornavin) | Léman Express direct | ${f.corn} min de train, ${f.cornDtdMin} à ${f.cornDtdMax} min porte-à-porte selon la maison |`; },
  },
  {
    slug: 'guide-ressources-frontalier-geneve', lang: 'en', mechanism: 'D1',
    note: 'L251 destination table: “Centre (Cornavin) | Léman Express direct | ~22 min” → 23 min by train, 35 to 40 min door to door depending on the house',
    find: '| Centre (Cornavin) | Léman Express direct | ~22 min |',
    replace: (m) => { const f = facts(m); return `| Centre (Cornavin) | Léman Express direct | ${f.corn} min by train, ${f.cornDtdMin} to ${f.cornDtdMax} min door to door depending on the house |`; },
  },
  {
    slug: 'guide-ressources-frontalier-geneve', lang: 'fr', mechanism: 'D1',
    note: 'L257 tableau : ligne « Aéroport / Palexpo | … | ~30 min » retirée (temps vers l\'aéroport, règle D1 de Jérôme) ; la ligne CERN sert de contexte',
    find: '| CERN (Meyrin) | Léman Express → Cornavin + tram 18 | 50 à 55 min |\n| Aéroport / Palexpo | Léman Express direct depuis Annemasse | ~30 min |',
    replace: () => '| CERN (Meyrin) | Léman Express → Cornavin + tram 18 | 50 à 55 min |',
  },
  {
    slug: 'guide-ressources-frontalier-geneve', lang: 'en', mechanism: 'D1',
    note: 'L255 table: row “Airport / Palexpo | … | ~30 min” removed (airport time, Jérôme\'s D1 rule); the CERN row is the context',
    find: '| CERN (Meyrin) | Léman Express → Cornavin + tram 18 | 50 to 55 min |\n| Airport / Palexpo | Léman Express direct from Annemasse | ~30 min |',
    replace: () => '| CERN (Meyrin) | Léman Express → Cornavin + tram 18 | 50 to 55 min |',
  },

  // ═══ organisations-internationales-geneve-ou-habiter ════════════════════════════════════════════
  {
    slug: 'organisations-internationales-geneve-ou-habiter', lang: 'fr', mechanism: 'D1',
    note: 'L6 : « côté France, à 20-30 minutes de trajet » (non qualifié) → STATS_DISPLAY.distance',
    find: 'La réponse pragmatique : côté France, à 20-30 minutes de trajet.',
    replace: (m) => `La réponse pragmatique : côté France, à ${facts(m).dist.fr}.`,
  },
  {
    slug: 'organisations-internationales-geneve-ou-habiter', lang: 'en', mechanism: 'D1',
    note: 'L5: “on the French side, 20-30 minutes away” (unqualified) → STATS_DISPLAY.distance',
    find: 'The pragmatic answer: on the French side, 20-30 minutes away.',
    replace: (m) => `The pragmatic answer: on the French side, ${facts(m).dist.en}.`,
  },
  {
    slug: 'organisations-internationales-geneve-ou-habiter', lang: 'fr', mechanism: 'D1',
    note: 'L20 : « la gare de Cornavin (22 min en Léman Express depuis Annemasse) » → 23 min',
    find: 'la gare de Cornavin (22 min en Léman Express depuis Annemasse)',
    replace: (m) => `la gare de Cornavin (${facts(m).corn} min en Léman Express depuis Annemasse)`,
  },
  {
    slug: 'organisations-internationales-geneve-ou-habiter', lang: 'en', mechanism: 'D1',
    note: 'L19: “Cornavin station (22 min by Léman Express from Annemasse)” → 23 min',
    find: 'Cornavin station (22 min by Léman Express from Annemasse)',
    replace: (m) => `Cornavin station (${facts(m).corn} min by Léman Express from Annemasse)`,
  },
  {
    slug: 'organisations-internationales-geneve-ou-habiter', lang: 'fr', mechanism: 'D1',
    note: 'L75 (absent en EN) : « côté France à 20 minutes du centre de Genève porte à porte » → STATS_DISPLAY.distance',
    find: 'côté France à 20 minutes du centre de Genève porte à porte.',
    replace: (m) => `côté France, à ${facts(m).dist.fr}.`,
  },

  // ═══ espaces-verts-coliving-lodge-annemasse ═════════════════════════════════════════════════════
  {
    slug: 'espaces-verts-coliving-lodge-annemasse', lang: 'fr', mechanism: 'D1',
    note: 'L26 : « un vrai jardin à 20 minutes de Genève » (non qualifié) → STATS_DISPLAY.distance',
    find: "un vrai jardin à 20 minutes de Genève —",
    replace: (m) => `un vrai jardin à ${facts(m).dist.fr} —`,
  },
  {
    slug: 'espaces-verts-coliving-lodge-annemasse', lang: 'en', mechanism: 'D1',
    note: 'L25: “a real garden 20 minutes from Geneva” (unqualified) → STATS_DISPLAY.distance',
    find: 'a real garden 20 minutes from Geneva —',
    replace: (m) => `a real garden ${facts(m).dist.en} —`,
  },
  {
    slug: 'espaces-verts-coliving-lodge-annemasse', lang: 'fr', mechanism: 'D1',
    note: 'L32 : « - À 20 minutes de Genève, côté France. » → STATS_DISPLAY.distance',
    find: '- À 20 minutes de Genève, côté France.',
    replace: (m) => `- À ${facts(m).dist.fr}, côté France.`,
  },
  {
    slug: 'espaces-verts-coliving-lodge-annemasse', lang: 'en', mechanism: 'D1',
    note: 'L31: “- 20 minutes from Geneva, on the French side.” → STATS_DISPLAY.distance',
    find: '- 20 minutes from Geneva, on the French side.',
    replace: (m) => `- ${facts(m).dist.en.charAt(0).toUpperCase()}${facts(m).dist.en.slice(1)}, on the French side.`,
  },

  // ═══ budget-colocation-geneve-guide-complet ═════════════════════════════════════════════════════
  {
    slug: 'budget-colocation-geneve-guide-complet', lang: 'fr', mechanism: 'D1',
    note: 'L4 : « vivre confortablement à 20 minutes de Genève » (non qualifié) → STATS_DISPLAY.distance',
    find: 'pour vivre confortablement à 20 minutes de Genève, par exemple',
    replace: (m) => `pour vivre confortablement à ${facts(m).dist.fr}, par exemple`,
  },
  {
    slug: 'budget-colocation-geneve-guide-complet', lang: 'en', mechanism: 'D1',
    note: 'L3: “living comfortably 20 minutes door-to-door from Geneva” (destination vague) → STATS_DISPLAY.distance',
    find: 'for living comfortably 20 minutes door-to-door from Geneva.',
    replace: (m) => `for living comfortably ${facts(m).dist.en}.`,
  },
  {
    slug: 'budget-colocation-geneve-guide-complet', lang: 'fr', mechanism: 'D1',
    note: 'L31 : « Annemasse↔Genève Cornavin en 20 minutes » → Eaux-Vives 7 / Cornavin 23 (lien conservé)',
    find: `[Annemasse↔Genève Cornavin en 20 minutes, directement](${LEX_FR})`,
    replace: (m) => { const f = facts(m); return `[Annemasse↔Genève-Eaux-Vives en ${f.ev} minutes, Cornavin en ${f.corn}, directement](${LEX_FR})`; },
  },
  {
    slug: 'budget-colocation-geneve-guide-complet', lang: 'en', mechanism: 'D1',
    note: 'L24: “Léman Express connecting Annemasse to Geneva Cornavin in 20 minutes” → Eaux-Vives 7 / Cornavin 23 (link kept)',
    find: `[Léman Express connecting Annemasse to Geneva Cornavin in 20 minutes](${LEX_EN})`,
    replace: (m) => { const f = facts(m); return `[Léman Express connecting Annemasse to Geneva Eaux-Vives in ${f.ev} minutes and Cornavin in ${f.corn}](${LEX_EN})`; },
  },
  {
    slug: 'budget-colocation-geneve-guide-complet', lang: 'fr', mechanism: 'D1',
    note: 'L33 (absent en EN) : « On parle de 20 minutes de trajet » (non qualifié) → 20 minutes porte-à-porte jusqu\'à Genève-Eaux-Vives',
    find: 'On parle de 20 minutes de trajet, pas de 2 heures.',
    replace: (m) => `On parle de ${facts(m).MIN} minutes porte-à-porte jusqu'à Genève-Eaux-Vives, pas de 2 heures.`,
  },
  {
    slug: 'budget-colocation-geneve-guide-complet', lang: 'fr', mechanism: 'D1',
    note: 'L131 : « accès direct Genève en 20 min » (destination vague) → Genève-Eaux-Vives en 7 min et Cornavin en 23 min de Léman Express',
    find: 'accès direct Genève en 20 min.',
    replace: (m) => { const f = facts(m); return `Genève-Eaux-Vives en ${f.ev} min et Cornavin en ${f.corn} min de Léman Express.`; },
  },
  {
    slug: 'budget-colocation-geneve-guide-complet', lang: 'en', mechanism: 'D1',
    note: 'L96: “with direct Geneva access in 20 min” (vague destination) → Geneva Eaux-Vives in 7 min and Cornavin in 23 min by Léman Express',
    find: 'with direct Geneva access in 20 min.',
    replace: (m) => { const f = facts(m); return `with Geneva Eaux-Vives in ${f.ev} min and Cornavin in ${f.corn} min by Léman Express.`; },
  },

  // ═══ cout-transport-frontalier-geneve-2026 ══════════════════════════════════════════════════════
  {
    slug: 'cout-transport-frontalier-geneve-2026', lang: 'fr', mechanism: 'D1',
    note: 'L46 : « relie Annemasse à Genève en 20 minutes » (destination vague) → Genève-Eaux-Vives en 7 minutes et Cornavin en 23 ; cadence 10 lue dans TRANSIT',
    find: 'relie Annemasse à Genève en 20 minutes, avec des trains toutes les 10 minutes en pointe',
    replace: (m) => { const f = facts(m); return `relie Annemasse à Genève-Eaux-Vives en ${f.ev} minutes et à Cornavin en ${f.corn}, avec des trains toutes les ${f.peak} minutes en pointe`; },
  },
  {
    slug: 'cout-transport-frontalier-geneve-2026', lang: 'en', mechanism: 'D1',
    note: 'L45: “connects Annemasse to Geneva in 20 minutes” (vague destination) → Geneva Eaux-Vives in 7 minutes and Cornavin in 23; headway 10 read from TRANSIT',
    find: 'connects Annemasse to Geneva in 20 minutes, with trains every 10 minutes during rush hour',
    replace: (m) => { const f = facts(m); return `connects Annemasse to Geneva Eaux-Vives in ${f.ev} minutes and Cornavin in ${f.corn}, with trains every ${f.peak} minutes during rush hour`; },
  },
  {
    slug: 'cout-transport-frontalier-geneve-2026', lang: 'fr', mechanism: 'D1',
    note: 'L100 : « toutes à moins de 10 minutes de la gare d\'Annemasse » (faux pour deux maisons, mode non précisé) → 10, 14 et 18 minutes à pied',
    find: "Les trois maisons de La Villa Coliving sont toutes à moins de 10 minutes de la gare d'Annemasse.",
    replace: (m) => { const { B } = facts(m); return `Les trois maisons de La Villa Coliving sont à ${B.lelodge.stationWalkMin}, ${B.lavilla.stationWalkMin} et ${B.leloft.stationWalkMin} minutes à pied de la gare d'Annemasse (Le Lodge, La Villa, Le Loft).`; },
  },
  {
    slug: 'cout-transport-frontalier-geneve-2026', lang: 'en', mechanism: 'D1',
    note: 'L99: “all within 10 minutes of Annemasse station” (wrong for two houses, no mode) → a 10, 14 and 18-minute walk',
    find: "La Villa Coliving's three houses are all within 10 minutes of Annemasse station.",
    replace: (m) => { const { B } = facts(m); return `La Villa Coliving's three houses are a ${B.lelodge.stationWalkMin}, ${B.lavilla.stationWalkMin} and ${B.leloft.stationWalkMin}-minute walk from Annemasse station (Le Lodge, La Villa, Le Loft).`; },
  },

  // ═══ cout-de-la-vie-suisse-france-frontalier-2026 ═══════════════════════════════════════════════
  {
    slug: 'cout-de-la-vie-suisse-france-frontalier-2026', lang: 'fr', mechanism: 'D1',
    note: 'L12 : « qu\'à Annemasse, à 20 minutes de là » (non qualifié) → 7 minutes de Genève-Eaux-Vives en Léman Express',
    find: "qu'à Annemasse, à 20 minutes de là.",
    replace: (m) => `qu'à Annemasse, à ${facts(m).ev} minutes de Genève-Eaux-Vives en Léman Express.`,
  },
  {
    slug: 'cout-de-la-vie-suisse-france-frontalier-2026', lang: 'en', mechanism: 'D1',
    note: 'L11: “than in Annemasse, 20 minutes away” (unqualified) → 7 minutes from Geneva Eaux-Vives by Léman Express',
    find: 'than in Annemasse, 20 minutes away.',
    replace: (m) => `than in Annemasse, ${facts(m).ev} minutes from Geneva Eaux-Vives by Léman Express.`,
  },
  {
    slug: 'cout-de-la-vie-suisse-france-frontalier-2026', lang: 'fr', mechanism: 'D1',
    note: 'L113 ancre : « colocation tout inclus à 20 min de Genève » → « … à 20 min de Genève-Eaux-Vives »',
    find: '[colocation tout inclus à 20 min de Genève](/blog/trouver-colocation-geneve-frontalier)',
    replace: (m) => `[colocation tout inclus à ${facts(m).MIN} min de Genève-Eaux-Vives](/blog/trouver-colocation-geneve-frontalier)`,
  },
  {
    slug: 'cout-de-la-vie-suisse-france-frontalier-2026', lang: 'en', mechanism: 'D1',
    note: 'L112 anchor: “all-inclusive coliving 20 min from Geneva” → “… 20 min from Geneva Eaux-Vives”',
    find: '[all-inclusive coliving 20 min from Geneva](/en/colocation-geneve)',
    replace: (m) => `[all-inclusive coliving ${facts(m).MIN} min from Geneva Eaux-Vives](/en/colocation-geneve)`,
  },

  // ═══ ancre « coliving tout inclus à 20 min de Genève » (allocations, ecole, quitter, salaire) ═══
  ...['allocations-familiales-frontalier-geneve-2026', 'ecole-internationale-geneve-frontalier-ou-habiter', 'quitter-son-logement-guide-pratique', 'salaire-suisse-net-frontalier-2026'].flatMap((slug) => [
    {
      slug, lang: 'fr', mechanism: 'D1',
      note: 'ancre de lien « coliving tout inclus à 20 min de Genève » → « … à 20 min de Genève-Eaux-Vives » (D1 : destination nommée)',
      find: '[coliving tout inclus à 20 min de Genève](/blog/trouver-colocation-geneve-frontalier)',
      replace: (m) => `[coliving tout inclus à ${facts(m).MIN} min de Genève-Eaux-Vives](/blog/trouver-colocation-geneve-frontalier)`,
    },
    {
      slug, lang: 'en', mechanism: 'D1',
      note: 'link anchor “all-inclusive coliving 20 min from Geneva” → “… 20 min from Geneva Eaux-Vives” (D1: named destination)',
      find: '[all-inclusive coliving 20 min from Geneva](/en/colocation-geneve)',
      replace: (m) => `[all-inclusive coliving ${facts(m).MIN} min from Geneva Eaux-Vives](/en/colocation-geneve)`,
    },
  ]),

  // ═══ permis-g-frontalier-geneve ═════════════════════════════════════════════════════════════════
  {
    slug: 'permis-g-frontalier-geneve', lang: 'fr', mechanism: 'D1',
    note: 'L37 : « une maison à 20 minutes de Genève » (non qualifié) → STATS_DISPLAY.distance',
    find: 'dans une maison à 20 minutes de Genève te donne',
    replace: (m) => `dans une maison à ${facts(m).dist.fr} te donne`,
  },
  {
    slug: 'permis-g-frontalier-geneve', lang: 'en', mechanism: 'D1',
    note: 'L36: “a house 20 minutes from Geneva” (unqualified) → STATS_DISPLAY.distance',
    find: 'in a house 20 minutes from Geneva gives you',
    replace: (m) => `in a house ${facts(m).dist.en} gives you`,
  },

  // ═══ salaire-suisse-net-frontalier-2026 (corps ; l'ancre est traitée plus haut) ═════════════════
  {
    slug: 'salaire-suisse-net-frontalier-2026', lang: 'fr', mechanism: 'D1',
    note: 'L131 : « vivre côté France à 20 minutes de Genève » (non qualifié) → STATS_DISPLAY.distance',
    find: "vivre côté France à 20 minutes de Genève, c'est",
    replace: (m) => `vivre côté France à ${facts(m).dist.fr}, c'est`,
  },
  {
    slug: 'salaire-suisse-net-frontalier-2026', lang: 'en', mechanism: 'D1',
    note: 'L108: “living on the French side at 20 min from Geneva” (unqualified) → STATS_DISPLAY.distance',
    find: 'living on the French side at 20 min from Geneva is',
    replace: (m) => `living on the French side ${facts(m).dist.en} is`,
  },

  // ═══ trouver-colocation-geneve-frontalier ═══════════════════════════════════════════════════════
  {
    slug: 'trouver-colocation-geneve-frontalier', lang: 'fr', mechanism: 'D1',
    note: 'L6 : « à 20 minutes du centre en Léman Express » → STATS_DISPLAY.distance',
    find: '— à 20 minutes du centre en Léman Express, pour des loyers',
    replace: (m) => `— à ${facts(m).dist.fr}, pour des loyers`,
  },
  {
    slug: 'trouver-colocation-geneve-frontalier', lang: 'en', mechanism: 'D1',
    note: 'L5: “20 minutes from the center by Léman Express” → STATS_DISPLAY.distance',
    find: '— 20 minutes from the center by Léman Express, for rents',
    replace: (m) => `— ${facts(m).dist.en}, for rents`,
  },
  {
    slug: 'trouver-colocation-geneve-frontalier', lang: 'fr', mechanism: 'D1',
    note: 'L30 : « à 20 minutes de Genève côté France » (non qualifié) → STATS_DISPLAY.distance',
    find: 'à 20 minutes de Genève côté France. Tu arrives avec ta valise.',
    replace: (m) => `à ${facts(m).dist.fr}, côté France. Tu arrives avec ta valise.`,
  },
  {
    slug: 'trouver-colocation-geneve-frontalier', lang: 'en', mechanism: 'D1',
    note: 'L21: “20 minutes from Geneva on the French side” (unqualified) → STATS_DISPLAY.distance',
    find: '20 minutes from Geneva on the French side. You arrive with your suitcase.',
    replace: (m) => `${facts(m).dist.en}, on the French side. You arrive with your suitcase.`,
  },
  {
    slug: 'trouver-colocation-geneve-frontalier', lang: 'fr', mechanism: 'D1',
    note: 'L36 FAQ : « trois maisons situées à 20 minutes du centre de Genève, côté France » (mode non précisé) → STATS_DISPLAY.distance',
    find: 'trois maisons situées à 20 minutes du centre de Genève, côté France :',
    replace: (m) => `trois maisons situées côté France, à ${facts(m).dist.fr} :`,
  },
  {
    slug: 'trouver-colocation-geneve-frontalier', lang: 'en', mechanism: 'D1',
    note: 'L27 FAQ: “three houses located 20 minutes from Geneva city center, on the French side” (no mode) → STATS_DISPLAY.distance',
    find: 'three houses located 20 minutes from Geneva city center, on the French side:',
    replace: (m) => `three houses located on the French side, ${facts(m).dist.en}:`,
  },
  {
    slug: 'trouver-colocation-geneve-frontalier', lang: 'fr', mechanism: 'D1',
    note: 'L40 FAQ : « tout en restant à 20 minutes en transports » (mode générique) → STATS_DISPLAY.distance',
    find: 'tout en restant à 20 minutes en transports.',
    replace: (m) => `tout en restant à ${facts(m).dist.fr}.`,
  },
  {
    slug: 'trouver-colocation-geneve-frontalier', lang: 'en', mechanism: 'D1',
    note: 'L31 FAQ: “while staying 20 minutes away by public transport” (generic mode) → STATS_DISPLAY.distance',
    find: 'while staying 20 minutes away by public transport.',
    replace: (m) => `while staying ${facts(m).dist.en}.`,
  },
  {
    slug: 'trouver-colocation-geneve-frontalier', lang: 'fr', mechanism: 'D1',
    note: 'L44 FAQ : « à 20 minutes du centre de Genève côté France » (mode non précisé) → STATS_DISPLAY.distance',
    find: 'à 20 minutes du centre de Genève côté France, dès',
    replace: (m) => `côté France, à ${facts(m).dist.fr}, dès`,
  },
  {
    slug: 'trouver-colocation-geneve-frontalier', lang: 'en', mechanism: 'D1',
    note: 'L35 FAQ: “20 minutes from Geneva city center on the French side” (no mode) → STATS_DISPLAY.distance',
    find: '20 minutes from Geneva city center on the French side, from',
    replace: (m) => `on the French side, ${facts(m).dist.en}, from`,
  },
  {
    slug: 'trouver-colocation-geneve-frontalier', lang: 'fr', mechanism: 'D1',
    note: 'L48 « En résumé » : « côté France (20 min, 30-50 % moins cher) » (non qualifié) → STATS_DISPLAY.distance',
    find: '**côté France** (20 min, 30-50 % moins cher)',
    replace: (m) => `**côté France** (${facts(m).dist.fr}, 30-50 % moins cher)`,
  },
  {
    slug: 'trouver-colocation-geneve-frontalier', lang: 'en', mechanism: 'D1',
    note: 'L39 “In short”: “on the French side (20 min, 30-50% cheaper)” (unqualified) → STATS_DISPLAY.distance',
    find: '**on the French side** (20 min, 30-50% cheaper)',
    replace: (m) => `**on the French side** (${facts(m).dist.en}, 30-50% cheaper)`,
  },
  {
    slug: 'trouver-colocation-geneve-frontalier', lang: 'fr', mechanism: 'D1',
    note: 'L53 (absent en EN) : ancre « notre coliving à 20 minutes de Genève » → « … à 20 min de Genève-Eaux-Vives »',
    find: '[notre coliving à 20 minutes de Genève](/)',
    replace: (m) => `[notre coliving à ${facts(m).MIN} min de Genève-Eaux-Vives](/)`,
  },

  // ═══ coliving-transfrontalier-geneve-annemasse-nouvelle-vie ═════════════════════════════════════
  {
    slug: 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie', lang: 'fr', mechanism: 'D1',
    note: 'L4 H2 « Le matin : 20 minutes, porte à porte » (destination absente ; pas un titre d\'ancrage) → jusqu\'à Genève-Eaux-Vives',
    find: '## Le matin : 20 minutes, porte à porte',
    replace: (m) => `## Le matin : ${facts(m).MIN} minutes porte-à-porte jusqu'à Genève-Eaux-Vives`,
  },
  {
    slug: 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie', lang: 'en', mechanism: 'D1',
    note: 'L3 H2 “Mornings: 20 minutes, door to door” (no destination; not an anchoring heading) → to Geneva Eaux-Vives',
    find: '## Mornings: 20 minutes, door to door',
    replace: (m) => `## Mornings: ${facts(m).MIN} minutes door to door to Geneva Eaux-Vives`,
  },
  {
    slug: 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie', lang: 'fr', mechanism: 'D1',
    note: 'L6 : « le centre de Genève est à environ 20 minutes en Léman Express ou en tram » (« environ ») → Eaux-Vives 20 min porte-à-porte, centre (Rive) 30 min',
    find: 'le centre de Genève est à environ 20 minutes en Léman Express ou [en tram](https://www.tpg.ch/).',
    replace: (m) => { const f = facts(m); return `Genève-Eaux-Vives est à ${f.MIN} minutes porte-à-porte en Léman Express, et le centre (Rive) à ${f.centre} minutes, en train ou [en tram](https://www.tpg.ch/).`; },
  },
  {
    slug: 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie', lang: 'en', mechanism: 'D1',
    note: 'L5: “central Geneva is about 20 minutes away by Léman Express or tram” (“about”) → Eaux-Vives 20 min door to door, city centre (Rive) 30 min',
    find: 'central Geneva is about 20 minutes away by Léman Express [or tram](https://www.tpg.ch/).',
    replace: (m) => { const f = facts(m); return `Geneva Eaux-Vives is ${f.MIN} minutes door to door by Léman Express, and the city centre (Rive) ${f.centre} minutes, by train [or tram](https://www.tpg.ch/).`; },
  },
  {
    slug: 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie', lang: 'fr', mechanism: 'D1',
    note: 'L30 : « Trajet : ~20 min vers Genève » → STATS_DISPLAY.distance',
    find: '- **Trajet** : ~20 min vers Genève, sans voiture.',
    replace: (m) => `- **Trajet** : ${facts(m).dist.fr}, sans voiture.`,
  },
  {
    slug: 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie', lang: 'en', mechanism: 'D1',
    note: 'L29: “Commute: ~20 min to Geneva” → STATS_DISPLAY.distance',
    find: '- **Commute**: ~20 min to Geneva, no car.',
    replace: (m) => `- **Commute**: ${facts(m).dist.en}, no car.`,
  },

  // ═══ living-in-france-working-in-geneva ═════════════════════════════════════════════════════════
  {
    slug: 'living-in-france-working-in-geneva', lang: 'fr', mechanism: 'D1',
    note: 'L44 : « Le trajet Annemasse–Genève Cornavin dure environ 20 minutes » → Eaux-Vives 7 / Cornavin 23 (lien conservé ; tiret demi-cadratin de l\'original)',
    find: `[Le trajet Annemasse–Genève Cornavin dure environ 20 minutes](${LEX_FR})`,
    replace: (m) => { const f = facts(m); return `[Le trajet Annemasse–Genève-Eaux-Vives dure ${f.ev} minutes, Annemasse–Cornavin ${f.corn} minutes](${LEX_FR})`; },
  },
  {
    slug: 'living-in-france-working-in-geneva', lang: 'en', mechanism: 'D1',
    note: 'L43: “The Annemasse–Geneva Cornavin journey takes about 20 minutes” → Eaux-Vives 7 / Cornavin 23 (link kept; en dash of the original)',
    find: `[The Annemasse–Geneva Cornavin journey takes about 20 minutes](${LEX_FR})`,
    replace: (m) => { const f = facts(m); return `[The Annemasse–Geneva Eaux-Vives journey takes ${f.ev} minutes, Annemasse–Cornavin ${f.corn} minutes](${LEX_FR})`; },
  },

  // ═══ choc-culturel-franco-suisse-expatrie-geneve ════════════════════════════════════════════════
  {
    slug: 'choc-culturel-franco-suisse-expatrie-geneve', lang: 'fr', mechanism: 'D1',
    note: 'L86 (absent en EN) : « 3 maisons côté France, à 20 minutes du centre de Genève porte à porte » → STATS_DISPLAY.distance',
    find: 'dans 3 maisons côté France, à 20 minutes du centre de Genève porte à porte.',
    replace: (m) => `dans 3 maisons côté France, à ${facts(m).dist.fr}.`,
  },

  // ═══ ecole-internationale-geneve-frontalier-ou-habiter (l'ancre est traitée plus haut) ═════════
  {
    slug: 'ecole-internationale-geneve-frontalier-ou-habiter', lang: 'fr', mechanism: 'D1',
    note: 'L55 : « relie Annemasse au centre de Genève en ~20 min » (« ~ ») → Genève-Eaux-Vives en 7 min et Cornavin en 23 min',
    find: 'relie Annemasse au centre de Genève en ~20 min, ce qui ouvre',
    replace: (m) => { const f = facts(m); return `relie Annemasse à Genève-Eaux-Vives en ${f.ev} min et à Cornavin en ${f.corn} min, ce qui ouvre`; },
  },
  {
    slug: 'ecole-internationale-geneve-frontalier-ou-habiter', lang: 'en', mechanism: 'D1',
    note: 'L54: “links Annemasse to central Geneva in ~20 min” (“~”) → Geneva Eaux-Vives in 7 min and Cornavin in 23 min',
    find: 'links Annemasse to central Geneva in ~20 min, opening up',
    replace: (m) => { const f = facts(m); return `links Annemasse to Geneva Eaux-Vives in ${f.ev} min and Cornavin in ${f.corn} min, opening up`; },
  },
];

/** Motifs à signaler (avertissement, non bloquant) dans le texte RÉSULTANT des articles touchés : un reste hors du lot. */
export const POST_STATE_WATCH = [
  /(?<![\d,.])\b15 ?min/i, /mitoyenne/i, /adjoin/i, /border-adjacent/i, /\bTPN\b/, /ligne 80|line 80/i,
  /9 minutes? (à pied|walk)|9-minute walk/i, /\bCEVA\b/, /terminus (français )?du Léman Express|French terminus of the Léman Express/i,
];

/** En-tête, légende et versions propres au lot (lus par scripts/build-slots-sql.mjs). */
export function sqlDoc(m) {
  return {
    lot: 'Lot L2 « Emplacement et transport » (brief « Ingénierie des créneaux » v3.1 du 09/10/2026, règles D1 / D6 / D7 de Jérôme) : faits d\'emplacement des articles en base',
    sources: 'textes insérés = source unique src/data/stats.ts (TRANSIT, STATS_DISPLAY, GENEVA_COMMUTE_FORMULA) + entityFacts.ts (houseCommuteLine, prix d\'appel)',
    apply: 'À appliquer par Jérôme dans le SQL Editor, indépendant du code (aucun composant à déployer) ; relancer le prérendu ensuite.',
    encoding: 'Fichier UTF-8 : il contient des espaces insécables (U+00A0, « 1 370 ») et des caractères typographiques (« — », « – », « · », « → », « ⭐ », émojis) — ne pas le faire transiter par un éditeur qui normalise les espaces.',
    dryRunTitle: 'Lot L2 — emplacement et transport : aperçu des modifications SQL des articles en base',
    legend: 'Légende : « 1 370 » contient un espace insécable (U+00A0) ; les textes « Avant » sont copiés au caractère près depuis la base (content_fr / content_en, ou facebook_post_fr / facebook_post_en quand la colonne est indiquée), les textes « Après » viennent de la source unique (`src/data/stats.ts` : TRANSIT, STATS_DISPLAY, GENEVA_COMMUTE_FORMULA ; `src/data/entityFacts.ts` : houseCommuteLine, prix d\'appel). Mécanismes : D1 minutes / destination / mode (Léman Express, tram 17 pour Le Loft, vélo Voie Verte, jamais de voiture ni d\'aéroport) · D6 frontière (le Foron, rivière-frontière ; jamais « mitoyenne ») · D7 lignes de bus, tram et « terminus » · fix autre (prix d\'appel d\'un post Facebook, « A40 », cadence).',
    versions: { ENTITY_FACTS_VERSION: m.ENTITY_FACTS_VERSION, 'TRANSIT.measuredOn': m.TRANSIT.measuredOn },
  };
}

/** Garde-fous sur `m` : les valeurs lues doivent exister et porter la graphie de la source (sinon le lot est aveugle). */
function assertSource(m) {
  const f = facts(m);
  for (const [k, v] of Object.entries({ ev: f.ev, corn: f.corn, peak: f.peak, MIN: f.MIN, centre: f.centre })) if (!Number.isInteger(v) || v <= 0) throw new Error(`l2-location.edits : TRANSIT/STATS.${k} absent ou invalide (${v})`);
  for (const slug of ['lavilla', 'leloft', 'lelodge']) for (const k of ['stationWalkMin', 'eauxVivesDoorToDoorMin', 'cornavinDoorToDoorMin', 'bikeToRiveMin']) if (!Number.isInteger(f.B[slug]?.[k])) throw new Error(`l2-location.edits : TRANSIT.byHouse.${slug}.${k} absent`);
  if (!f.B.leloft.tramStop?.name || !f.B.lelodge.tramStop?.name || !f.B.leloft.busStop?.name) throw new Error('l2-location.edits : arrêts nommés (tramStop / busStop) absents de TRANSIT.byHouse');
  if (!f.B.leloft.border?.foronDistanceM || !f.B.leloft.border?.moillesulazM) throw new Error('l2-location.edits : TRANSIT.byHouse.leloft.border incomplet');
  if (!/^\d+ min de Genève-Eaux-Vives en Léman Express, porte-à-porte$/.test(f.dist.fr) || !/^\d+ min from Geneva Eaux-Vives by Léman Express, door to door$/.test(f.dist.en)) throw new Error('l2-location.edits : STATS_DISPLAY.distance n\'a plus la forme D1 attendue');
  if (!f.formula?.fr || !f.formula?.en || /[.!?]$/.test(f.formula.fr)) throw new Error('l2-location.edits : GENEVA_COMMUTE_FORMULA absente ou ponctuée');
  if (!f.price?.fr?.fromChf?.includes(NB) || !/^CHF [\d,]+$/.test(f.price?.en?.fromChf ?? '')) throw new Error('l2-location.edits : ENTITY_FACTS.price.{fr,en}.fromChf n\'a pas la graphie attendue (« 1 370 CHF » / « CHF 1,370 »)');
  if (typeof m.houseCommuteLine !== 'function') throw new Error('l2-location.edits : houseCommuteLine absente de la source');
}

/** La liste résolue : `replace` devient la chaîne calculée depuis la source unique `m`. */
export function buildEdits(m) {
  assertSource(m);
  return EDITS.map((e, i) => {
    const replace = e.replace(m);
    if (typeof e.find !== 'string' || !e.find) throw new Error(`edit #${i + 1} (${e.slug}/${e.lang}) : find vide`);
    if (typeof replace !== 'string' || !replace) throw new Error(`edit #${i + 1} (${e.slug}/${e.lang}) : replace vide (une suppression doit garder un contexte)`);
    if (replace === e.find) throw new Error(`edit #${i + 1} (${e.slug}/${e.lang}) : replace identique à find`);
    if (/\b(en voiture|by car|driving)\b|(?<![\d,.])\b15 ?min|a[ée]roport.*\d+ ?min|airport.*\d+ ?min|mitoyen|adjoin|\bTPN\b|ligne \d|line \d|\bbus \d/i.test(replace)) throw new Error(`edit #${i + 1} (${e.slug}/${e.lang}) : formulation interdite (D1/D6/D7) dans le nouveau texte — « ${replace.slice(0, 80)} »`);
    return { slug: e.slug, lang: e.lang, mechanism: e.mechanism, note: e.note, find: e.find, replace, ...(e.column ? { column: e.column } : {}) };
  });
}
