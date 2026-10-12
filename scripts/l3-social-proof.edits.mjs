/**
 * Lot L3 « Note Google et preuves » (brief « Ingénierie des créneaux », décisions D3 / D4 de Jérôme du 09/10/2026) — liste
 * DÉCLARATIVE des modifications de preuves sociales à appliquer aux articles de blog stockés en base (table blog_posts,
 * colonnes content_fr / content_en). Consommée par scripts/build-slots-sql.mjs :
 *
 *   node scripts/build-slots-sql.mjs --edits ./l3-social-proof.edits.mjs --name l3-social-proof --write-diff
 *
 * Source des phrases à corriger : recon L0.3 (lavilla-docs/RECON_L0_Creneaux_2026-10-09/L0.3_preuves_sociales.md, §1
 * « Note 4,9 »), re-vérifiée sur le contenu VIVANT du 10/10/2026 (REST anon, lecture seule). Cette relecture a révélé une
 * occurrence de plus que le recon : « plus de 150 résidents » vit AUSSI dans l'intro de coliving-communaute (L5 FR/EN),
 * pas seulement dans lodge-annemasse (L13) — les deux sont corrigées ici.
 *
 * Règles de ce fichier (10/10/2026, Lot L3) :
 *  - `find` est copié AU CARACTÈRE PRÈS depuis la base (apostrophes droites, virgule de « 4,9 ») ; le générateur exige
 *    exactement 1 occurrence par colonne, puis simule l'application séquentielle.
 *  - `replace` est une FONCTION de la source unique `m` (scripts/lib/load-entity-facts.mjs → STATS, STATS_DISPLAY,
 *    GOOGLE_REVIEWS, GOOGLE_REVIEWS_LINK_LABEL de src/data/stats.ts) : AUCUNE note, nombre d'avis, nombre de résidents ni
 *    année en dur ici — les seuls littéraux sont les ancres `find` et la prose sans chiffre.
 *  - D4 : la note s'écrit toujours « 4,8/5 sur Google (36 avis) » / « 4.8/5 on Google (36 reviews) »
 *    (STATS_DISPLAY[lang].googleRating), étiquetée « sur Google », et toujours accompagnée du lien « Voir les avis » /
 *    « See the reviews » (GOOGLE_REVIEWS_LINK_LABEL, initiale en minuscule dans la prose après un tiret) vers la fiche Google
 *    (GOOGLE_REVIEWS.url). En markdown, le rendu du blog (src/pages/BlogPostPage.tsx, composant `a`) ouvre tout lien externe
 *    dans un nouvel onglet avec rel="noopener noreferrer" : la décision D4 est respectée sans balise HTML dans l'article.
 *    JAMAIS d'aggregateRating ni de Review : un lien, pas un balisage.
 *  - D3 : « 150 résidents » disparaît ; « plus de 100 résidents » (STATS.totalResidents, soutenu par la vue v_social_proof)
 *    le remplace — « plus de » porte le « + ». « des dizaines d'avis Google » (arnaques-logement-frontalier-geneve-eviter
 *    L135 FR/EN) est VRAI (36 avis) : laissé tel quel, hors de cette liste.
 *  - Les faits voisins qui ne vivent pas dans stats.ts (« d'une quinzaine de nationalités », « (9 mois hors longs séjours) »,
 *    « nos trois maisons ») restent HORS des ancres : ils ne sont ni réécrits ni copiés ici. « Depuis 2021 » reste en base
 *    (= STATS.foundedYear, vérifié par assertSource).
 *  - Sujet de la note : la fiche Google est celle de la marque « La Villa Coliving » (une seule fiche, pas une par maison) —
 *    « nos maisons affichent une note » devient donc « La Villa Coliving affiche une note ».
 *  - FR = tutoiement, EN = « you », parité FR/EN (4 modifications par langue, 2 articles), aucun concurrent nommé, chaînes plates.
 *  - Mécanismes : D4 = note Google (+ lien) · D3 = nombre de résidents.
 *  - Fichier À USAGE UNIQUE : une fois le SQL appliqué, les articles portent la note du relevé courant ; au relevé mensuel suivant
 *    (src/data/README.md), les ancres `find` deviennent les textes posés ici — régénérer une nouvelle liste (ou un token de
 *    contenu, question ouverte de la PR L3) plutôt que relancer celle-ci.
 */

/** Raccourcis lus dans `m` au moment de la résolution (jamais de valeur figée). */
function facts(m) {
  const G = m.GOOGLE_REVIEWS;
  const L = m.GOOGLE_REVIEWS_LINK_LABEL;
  return {
    residents: m.STATS.totalResidents, // 100 → « plus de 100 résidents »
    rating: { fr: m.STATS_DISPLAY.fr.googleRating, en: m.STATS_DISPLAY.en.googleRating }, // « 4,8/5 sur Google (36 avis) »
    url: G.url, // fiche Google (avis lisibles), lien stable par cid
    /** Libellé D4 en prose : initiale en minuscule après un tiret (« — voir les avis »). */
    link: (lang) => `[${L[lang].charAt(0).toLowerCase()}${L[lang].slice(1)}](${G.url})`,
  };
}

// ── La liste ───────────────────────────────────────────────────────────────────────────────────────

const EDITS = [
  // ═══ coliving-communaute-reels-amis-geneve-annemasse ════════════════════════════════════════════
  {
    slug: 'coliving-communaute-reels-amis-geneve-annemasse', lang: 'fr', mechanism: 'D3',
    note: 'intro (L5, absente du recon) : « plus de 150 résidents d\'une quinzaine de nationalités » → « plus de 100 résidents » (STATS.totalResidents ; 150 contredisait le reste du site)',
    find: 'plus de 150 résidents',
    replace: (m) => `plus de ${facts(m).residents} résidents`,
  },
  {
    slug: 'coliving-communaute-reels-amis-geneve-annemasse', lang: 'en', mechanism: 'D3',
    note: 'intro (L5, not in the recon): “more than 150 residents from some fifteen nationalities” → “more than 100 residents” (STATS.totalResidents)',
    find: 'more than 150 residents',
    replace: (m) => `more than ${facts(m).residents} residents`,
  },
  {
    slug: 'coliving-communaute-reels-amis-geneve-annemasse', lang: 'fr', mechanism: 'D4',
    note: 'L75 : « nos maisons affichent une note moyenne de 4,9/5 » → « La Villa Coliving affiche une note de 4,8/5 sur Google (36 avis) » (STATS_DISPLAY.fr.googleRating ; une seule fiche Google, celle de la marque)',
    find: 'nos maisons affichent une note moyenne de 4,9/5',
    replace: (m) => `La Villa Coliving affiche une note de ${facts(m).rating.fr}`,
  },
  {
    slug: 'coliving-communaute-reels-amis-geneve-annemasse', lang: 'fr', mechanism: 'D4',
    note: 'L75, fin de phrase : lien « voir les avis » vers la fiche Google (D4 : la note est toujours accompagnée du lien)',
    find: ': on reste parce qu\'on s\'y sent bien.',
    replace: (m) => `: on reste parce qu'on s'y sent bien — ${facts(m).link('fr')}.`,
  },
  {
    slug: 'coliving-communaute-reels-amis-geneve-annemasse', lang: 'en', mechanism: 'D4',
    note: 'L75: “our houses hold an average rating of 4.9/5 and an average stay of” → “La Villa Coliving is rated 4.8/5 on Google (36 reviews), with an average stay of” (STATS_DISPLAY.en.googleRating ; relecture 10/10 : le verbe « hold » régissait les deux compléments)',
    find: 'our houses hold an average rating of 4.9/5 and an average stay of',
    replace: (m) => `La Villa Coliving is rated ${facts(m).rating.en}, with an average stay of`,
  },
  {
    slug: 'coliving-communaute-reels-amis-geneve-annemasse', lang: 'en', mechanism: 'D4',
    note: 'L75, end of sentence: “see the reviews” link to the Google listing (D4)',
    find: ': people stay because they feel good here.',
    replace: (m) => `: people stay because they feel good here — ${facts(m).link('en')}.`,
  },

  // ═══ lodge-annemasse-coliving-premium-portes-geneve ═════════════════════════════════════════════
  {
    slug: 'lodge-annemasse-coliving-premium-portes-geneve', lang: 'fr', mechanism: 'D3',
    note: 'L13 : « plus de 150 résidents sont passés par nos trois maisons » → « plus de 100 résidents » (STATS.totalResidents)',
    find: 'plus de 150 résidents',
    replace: (m) => `plus de ${facts(m).residents} résidents`,
  },
  {
    slug: 'lodge-annemasse-coliving-premium-portes-geneve', lang: 'fr', mechanism: 'D4',
    note: 'L13 : « avec une note moyenne de 4,9/5. » → « avec une note de 4,8/5 sur Google (36 avis) — voir les avis. » (STATS_DISPLAY.fr.googleRating + lien D4)',
    find: 'avec une note moyenne de 4,9/5.',
    replace: (m) => `avec une note de ${facts(m).rating.fr} — ${facts(m).link('fr')}.`,
  },
  {
    slug: 'lodge-annemasse-coliving-premium-portes-geneve', lang: 'en', mechanism: 'D3',
    note: 'L13: “more than 150 residents have lived in our three houses” → “more than 100 residents” (STATS.totalResidents)',
    find: 'more than 150 residents',
    replace: (m) => `more than ${facts(m).residents} residents`,
  },
  {
    slug: 'lodge-annemasse-coliving-premium-portes-geneve', lang: 'en', mechanism: 'D4',
    note: 'L13: “with an average rating of 4.9/5.” → “rated 4.8/5 on Google (36 reviews) — see the reviews.” (STATS_DISPLAY.en.googleRating + D4 link)',
    find: 'with an average rating of 4.9/5.',
    replace: (m) => `rated ${facts(m).rating.en} — ${facts(m).link('en')}.`,
  },
];

/** Motifs à signaler (avertissement, non bloquant) dans le texte RÉSULTANT des articles touchés : un reste hors du lot. */
export const POST_STATE_WATCH = [
  /(?<![\d,.])4[,.]9[   ]?\/[   ]?5/, /(?<![\d,.])150[   ]?\+?[   ]?r[ée]sidents/i,
  /enquêtes? résidents|resident surveys/i, /note moyenne|average rating/i,
];

/** En-tête, légende et versions propres au lot (lus par scripts/build-slots-sql.mjs). */
export function sqlDoc(m) {
  return {
    lot: 'Lot L3 « Note Google et preuves » (brief « Ingénierie des créneaux », décisions D3 / D4 de Jérôme du 09/10/2026) : note Google et nombre de résidents dans les articles en base',
    sources: 'textes insérés = source unique src/data/stats.ts (GOOGLE_REVIEWS, GOOGLE_REVIEWS_LINK_LABEL, STATS_DISPLAY.googleRating, STATS.totalResidents)',
    apply: 'À appliquer par Jérôme dans le SQL Editor, dans le même créneau que le déploiement du code L3 (le hero et les pages passent à la note Google au même moment) ; relancer le prérendu ensuite. Fichier à usage unique : au prochain relevé mensuel (GOOGLE_REVIEWS.checkedOn), régénérer une nouvelle liste dont les ancres sont les textes posés ici.',
    encoding: 'Fichier UTF-8 : il contient des caractères typographiques (« — ») et des accents — ne pas le faire transiter par un éditeur qui normalise les espaces ou les apostrophes.',
    dryRunTitle: 'Lot L3 — note Google et preuves : aperçu des modifications SQL des articles en base',
    legend: 'Légende : les textes « Avant » sont copiés au caractère près depuis la base (content_fr / content_en), les textes « Après » viennent de la source unique (`src/data/stats.ts` : GOOGLE_REVIEWS, GOOGLE_REVIEWS_LINK_LABEL, STATS_DISPLAY.googleRating, STATS.totalResidents). Mécanismes : D4 note Google « 4,8/5 sur Google (36 avis) » + lien « voir les avis » vers la fiche (jamais d\'aggregateRating) · D3 nombre de résidents (« plus de 100 », jamais 150). « des dizaines d\'avis Google » (article arnaques) est vrai et reste tel quel.',
    versions: { ENTITY_FACTS_VERSION: m.ENTITY_FACTS_VERSION, 'GOOGLE_REVIEWS.checkedOn': m.GOOGLE_REVIEWS.checkedOn, 'GOOGLE_REVIEWS.count': m.GOOGLE_REVIEWS.count },
  };
}

/** Garde-fous sur `m` : les valeurs lues doivent exister et porter la graphie de la source (sinon le lot est aveugle). */
function assertSource(m) {
  if (!m.GOOGLE_REVIEWS || !m.GOOGLE_REVIEWS_LINK_LABEL) throw new Error('l3-social-proof.edits : GOOGLE_REVIEWS / GOOGLE_REVIEWS_LINK_LABEL absents de la source (scripts/lib/load-entity-facts.mjs doit les exporter depuis src/data/stats.ts)');
  const f = facts(m);
  if (!Number.isInteger(f.residents) || f.residents < 1) throw new Error(`l3-social-proof.edits : STATS.totalResidents absent ou invalide (${f.residents})`);
  if (!Number.isInteger(m.STATS.foundedYear)) throw new Error('l3-social-proof.edits : STATS.foundedYear absent (« Depuis 2021 » reste en base et doit rester vrai)');
  if (!/^\d,\d\/5 sur Google \(\d+ avis\)$/.test(f.rating.fr)) throw new Error(`l3-social-proof.edits : STATS_DISPLAY.fr.googleRating n'a pas la forme D4 « 4,8/5 sur Google (36 avis) » — « ${f.rating.fr} »`);
  if (!/^\d\.\d\/5 on Google \(\d+ reviews\)$/.test(f.rating.en)) throw new Error(`l3-social-proof.edits : STATS_DISPLAY.en.googleRating n'a pas la forme D4 « 4.8/5 on Google (36 reviews) » — « ${f.rating.en} »`);
  if (!/^https:\/\/maps\.google\.com\/\?cid=\d+$/.test(f.url)) throw new Error(`l3-social-proof.edits : GOOGLE_REVIEWS.url n'est pas un lien de fiche Google par cid — « ${f.url} »`);
  for (const lang of ['fr', 'en']) if (typeof m.GOOGLE_REVIEWS_LINK_LABEL[lang] !== 'string' || !m.GOOGLE_REVIEWS_LINK_LABEL[lang]) throw new Error(`l3-social-proof.edits : GOOGLE_REVIEWS_LINK_LABEL.${lang} absent`);
}

/** La liste résolue : `replace` devient la chaîne calculée depuis la source unique `m`. */
export function buildEdits(m) {
  assertSource(m);
  return EDITS.map((e, i) => {
    const replace = e.replace(m);
    if (typeof e.find !== 'string' || !e.find) throw new Error(`edit #${i + 1} (${e.slug}/${e.lang}) : find vide`);
    if (typeof replace !== 'string' || !replace) throw new Error(`edit #${i + 1} (${e.slug}/${e.lang}) : replace vide`);
    if (replace === e.find) throw new Error(`edit #${i + 1} (${e.slug}/${e.lang}) : replace identique à find`);
    // D3/D4 : rien de l'ancien monde dans le nouveau texte (note interne, « enquêtes », 150, « note moyenne » non sourcée).
    if (/4[,.]9|enquêtes? résidents|resident surveys|(?<![\d,.])150\b|note moyenne|average rating|aggregateRating/i.test(replace)) throw new Error(`edit #${i + 1} (${e.slug}/${e.lang}) : formulation interdite (D3/D4) dans le nouveau texte — « ${replace.slice(0, 80)} »`);
    // D4 : toute note insérée est étiquetée « sur Google » / « on Google » et accompagnée du lien, dans la même modification ou la suivante du même article.
    if (/\/5\b/.test(replace) && !/sur Google|on Google/.test(replace)) throw new Error(`edit #${i + 1} (${e.slug}/${e.lang}) : note sans étiquette « sur Google » (D4) — « ${replace.slice(0, 80)} »`);
    return { slug: e.slug, lang: e.lang, mechanism: e.mechanism, note: e.note, find: e.find, replace };
  });
}
