/**
 * L'Appart (brief « Points d'entrée prix, L'Appart » du 12/11/2026, V2-16 / CB-6, étape 43 du calendrier) — SQL n° 10 : les
 * phrases d'articles qui décrivent toute la marque nomment aussi L'Appart, et cinq articles (budget, Annemasse) reçoivent une
 * phrase sur L'Appart. Inventaire : 06_INVENTAIRE_PERIMETRE.md § 3 (7 passages « 3 maisons », plus l'alignement anglais) ;
 * insertions : contenu/BLOG.md § 2 (cinq articles). Le créneau « dossier » est passé avant (SQL n° 10a).
 *
 * Règles des deux gammes (CLAUDE.md) :
 *  - chaque gamme a son « dès » ; les prix de L'Appart passent par les jetons {{PRIX_APPART_DES}} / {{PRIX_APPART_DES_EUR}} ;
 *  - jamais un prix de L'Appart dans la phrase de « piscine », « sauna » ou « salle de sport » ;
 *  - le nom avec son descripteur (colocation à Annemasse, quartier de la gare) à la première mention ;
 *  - jamais € et CHF dans une même phrase, sauf la forme compacte « {{PRIX_APPART_DES}}/{{PRIX_APPART_DES_EUR}} » des pages de décision ;
 *  - les minutes viennent de APPART.transit (relevé du 12/11/2026), jamais des agrégats des maisons.
 * Le texte de « Où habiter en France… » (page de décision) vit aussi dans content/decision-pages/ : mêmes phrases, même PR.
 *
 *   node scripts/build-slots-sql.mjs --edits ./lappart-articles.edits.mjs --name lappart-sql10-articles --date AAAA-MM-JJ --write-diff
 *
 * Banc d'essai : --surcouche "<worktree>/scripts/lappart-articles.edits.mjs".
 */

const aOrAn = (n) => (/^(8|11|18|80|8\d)$/.test(String(n)) ? 'an' : 'a');

/** Phrase de commune de L'Appart, depuis la source (APPART.transit) : jamais de minutes tapées à la main. */
function commune(m, lang) {
  const T = m.APPART.transit;
  const n = m.APPART.rooms.total;
  if (lang === 'en') {
    return `[L'Appart](/en/lappart) by La Villa Coliving (${n} rooms in a flatshare, near the station) is ${aOrAn(T.stationWalkMin)} ${T.stationWalkMin}-minute walk from the station and ${aOrAn(T.tramStop.walkMin)} ${T.tramStop.walkMin}-minute walk from tram 17 — Geneva Eaux-Vives in ${T.eauxVivesDoorToDoorMin} minutes door to door.`;
  }
  return `[L'Appart](/lappart) de La Villa Coliving (${n} chambres en colocation, quartier de la gare) est à ${T.stationWalkMin} min à pied de la gare et à ${T.tramStop.walkMin} min du tram 17 — Genève-Eaux-Vives en ${T.eauxVivesDoorToDoorMin} min porte-à-porte.`;
}

export function sqlDoc(m) {
  return {
    lot: "L'Appart (V2-16, étape 43) — SQL n° 10 : les articles qui décrivent toute la marque nomment aussi L'Appart ; une phrase sur L'Appart dans 5 articles (budget, Annemasse).",
    sources: "inventaire 06_INVENTAIRE_PERIMETRE.md § 3 et contenu/BLOG.md § 2 (13/11/2026), recalés sur le texte vivant du 21/11/2026 ; prix de L'Appart en jetons {{PRIX_APPART_DES}} / {{PRIX_APPART_DES_EUR}} ; minutes = APPART.transit",
    apply: "Après la bascule de L'Appart (faite le 20/11/2026) ; sur GO de Jérôme. La page de décision « Où habiter en France… » reçoit la même phrase dans content/decision-pages (même PR).",
    encoding: 'Fichier UTF-8 : guillemets « », tirets — et accents — ne pas normaliser.',
    dryRunTitle: "L'Appart — SQL n° 10, phrases d'articles : aperçu des substitutions",
    legend: "Légende : « Avant » = texte vivant du 21/11/2026 ; « Après » = texte avec L'Appart (jetons de prix résolus par le site à l'affichage).",
    versions: { APPART_LOCATION_VERSION: m.APPART_LOCATION_VERSION },
  };
}

export function buildEdits(m) {
  const n = m.APPART.rooms.total;
  if (n !== 4) throw new Error(`lappart-articles : APPART.rooms.total = ${n}, les textes disent 4 chambres — relire`);
  const E = [];
  const add = (slug, lang, note, find, replace) => E.push({ slug, lang, mechanism: 'phrase', note, find, replace });

  // 1. Encart d'appel des deux articles « Annemasse » (intention Annemasse : L'Appart d'abord).
  for (const slug of ['coliving-annemasse-geneve-frontaliers-avantages', 'colocation-annemasse-ville-la-grand-ambilly']) {
    add(slug, 'fr', "encart d'appel : L'Appart d'abord, puis les 3 maisons de coliving",
      'À **La Villa Coliving**, 29 chambres meublées tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons à Ville-la-Grand, Ambilly et Annemasse',
      "À **La Villa Coliving**, une colocation à Annemasse, quartier de la gare, dès **{{PRIX_APPART_DES}}/mois** ([L'Appart](/lappart), 4 chambres) et 29 chambres meublées tout inclus dès **{{PRIX_DES}}/mois** dans 3 maisons de coliving à Ville-la-Grand, Ambilly et Annemasse");
    add(slug, 'en', "call-out: L'Appart first, then the 3 coliving houses",
      'At **La Villa Coliving**, 29 furnished all-inclusive rooms from **{{PRIX_DES}}/month** across 3 houses in Ville-la-Grand, Ambilly and Annemasse',
      "At **La Villa Coliving**, a flatshare in Annemasse, near the station, from **{{PRIX_APPART_DES}}/month** ([L'Appart](/en/lappart), 4 rooms) and 29 furnished all-inclusive rooms from **{{PRIX_DES}}/month** across 3 coliving houses in Ville-la-Grand, Ambilly and Annemasse");
  }

  // 2. Colocation à Annemasse (BLOG.md § 2.3) : la phrase de commune, après celle du Lodge, dans « Annemasse centre ».
  add('colocation-annemasse-ville-la-grand-ambilly', 'fr', 'phrase de commune de L\'Appart après celle du Lodge (« Annemasse centre »)',
    'À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte.',
    `À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à 8 min à pied de la gare — Genève-Eaux-Vives en 16 min porte-à-porte. Toujours à Annemasse, ${commune(m, 'fr')}`);
  add('colocation-annemasse-ville-la-grand-ambilly', 'en', "L'Appart's local sentence after Le Lodge's (« Annemasse center »)",
    'In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door.',
    `In Annemasse itself, Le Lodge by La Villa Coliving (12 rooms, Romagny district) is an 8-minute walk from the station — Geneva Eaux-Vives in 16 minutes door to door. Also in Annemasse, ${commune(m, 'en')}`);

  // 3. Guide du coliving à Genève : l'offre de la marque (maisons d'abord, puis L'Appart).
  add('coliving-geneve-frontaliers-guide-complet', 'fr', "présentation de l'offre : 3 maisons de coliving, puis L'Appart",
    '— 29 chambres privées meublées dans 3 maisons (Ville-la-Grand, Ambilly, Annemasse), tout inclus dès **{{PRIX_DES}}/mois**, sans frais de dossier.',
    "— 29 chambres privées meublées dans 3 maisons de coliving (Ville-la-Grand, Ambilly, Annemasse), tout inclus dès **{{PRIX_DES}}/mois**, et [L'Appart](/lappart), colocation à Annemasse, quartier de la gare, 4 chambres dès **{{PRIX_APPART_DES}}/mois**, sans frais de dossier.");
  add('coliving-geneve-frontaliers-guide-complet', 'en', "offer: 3 coliving houses, then L'Appart",
    '— 29 private furnished rooms across 3 houses (Ville-la-Grand, Ambilly, Annemasse), all-inclusive from **{{PRIX_DES}}/month**, no application fee.',
    "— 29 private furnished rooms across 3 coliving houses (Ville-la-Grand, Ambilly, Annemasse), all-inclusive from **{{PRIX_DES}}/month**, and [L'Appart](/en/lappart), a flatshare in Annemasse near the station, 4 rooms from **{{PRIX_APPART_DES}}/month**, no application fee.");

  // 4. Vivre en France, travailler à Genève : l'inventaire de la marque reçoit sa 4e adresse (sans prix, sans date).
  add('living-in-france-working-in-geneva', 'fr', "inventaire de la marque : L'Appart après les 3 maisons, sans piscine",
    'les espaces communs (salon, cuisine, piscine, sauna, salle de sport) sont partagés.',
    "les espaces communs (salon, cuisine, piscine, sauna, salle de sport) sont partagés. Et [L'Appart](/lappart), colocation à Annemasse, quartier de la gare : un appartement de 4 chambres, sans piscine, sauna ni salle de sport.");
  add('living-in-france-working-in-geneva', 'en', "brand inventory: L'Appart after the 3 houses, no pool",
    'the shared spaces (living room, kitchen, pool, sauna, gym) are communal.',
    "the shared spaces (living room, kitchen, pool, sauna, gym) are communal. And [L'Appart](/en/lappart), a flatshare in Annemasse, near the station: a 4-room flat, with no pool, sauna or gym.");

  // 5. Temps de trajet par quartier : « 29 chambres » est un fait des maisons.
  add('temps-trajet-annemasse-geneve-par-quartier', 'fr', '29 chambres = les maisons',
    "C'est là que se trouvent 10 des 29 chambres de La Villa Coliving.",
    "C'est là que se trouvent 10 des 29 chambres des maisons de La Villa Coliving.");
  add('temps-trajet-annemasse-geneve-par-quartier', 'en', '29 rooms = the houses',
    "It's home to 10 of La Villa Coliving's 29 rooms.",
    "It's home to 10 of the 29 rooms in La Villa Coliving's houses.");

  // 6. Trouver une colocation (BLOG.md § 2.2 + inventaire n° 7) : L'Appart entre colocation classique et coliving ; « de coliving » pour les maisons.
  add('trouver-colocation-geneve-frontalier', 'fr', "budget : L'Appart entre la location classique et le coliving (prix en jetons, euros à part)",
    'Pour cadrer ton budget précisément selon ton salaire',
    "Entre les deux, [L'Appart](/lappart), la colocation de La Villa Coliving à Annemasse, quartier de la gare, loue ses chambres dès {{PRIX_APPART_DES}} par mois, charges comprises. En euros : dès {{PRIX_APPART_DES_EUR}}. Pour cadrer ton budget précisément selon ton salaire");
  add('trouver-colocation-geneve-frontalier', 'en', "budget: L'Appart between a classic rental and coliving (token prices, euros apart)",
    'To frame your budget precisely by salary',
    "In between, [L'Appart](/en/lappart), La Villa Coliving's flatshare in Annemasse, near the station, lets its rooms from {{PRIX_APPART_DES}} a month, bills included. In euros: from {{PRIX_APPART_DES_EUR}}. To frame your budget precisely by salary");
  add('trouver-colocation-geneve-frontalier', 'fr', 'les maisons sont des maisons de coliving',
    'tout inclus dans trois maisons situées côté France',
    'tout inclus dans trois maisons de coliving situées côté France');
  add('trouver-colocation-geneve-frontalier', 'en', 'the houses are coliving houses',
    'all-inclusive shared rooms in three houses located on the French side',
    'all-inclusive shared rooms in three coliving houses located on the French side');
  add('trouver-colocation-geneve-frontalier', 'fr', "la colocation de la marque : L'Appart, sans prix ici (le prix est plus haut)",
    'À partir de {{PRIX_DES}}/mois.',
    "À partir de {{PRIX_DES}}/mois. Et [L'Appart](/lappart), notre colocation de 4 chambres à Annemasse, quartier de la gare.");
  add('trouver-colocation-geneve-frontalier', 'en', "the brand's flatshare: L'Appart, no price here (given above)",
    'From {{PRIX_DES}}/month.',
    "From {{PRIX_DES}}/month. And [L'Appart](/en/lappart), our 4-room flatshare in Annemasse, near the station.");

  // 7. Choc culturel (anglais seulement, alignement facultatif) : l'offre décrite est celle des maisons.
  add('choc-culturel-franco-suisse-expatrie-geneve', 'en', "alignment: the 29 rooms are the houses' (the French already says so)",
    "That's what La Villa Coliving offers: 29 rooms in three houses on the French side",
    "That's what La Villa Coliving's houses offer: 29 rooms in three houses on the French side");

  // 8. Budget (BLOG.md § 2.1) : un paragraphe entre la liste des 3 options et « Pas encore de fiche de salaire suisse ? ».
  add('budget-colocation-geneve-guide-complet', 'fr', "budget : L'Appart entre la colocation classique et le coliving (euros à part)",
    '**Pas encore de fiche de salaire suisse ?**',
    "Entre la colocation classique et le coliving, il y a aussi [L'Appart](/lappart), la colocation de La Villa Coliving à Annemasse, dans le quartier de la gare : 4 chambres meublées dès {{PRIX_APPART_DES}} par mois, charges, fibre, streaming et ménage des communs compris. En euros : dès {{PRIX_APPART_DES_EUR}}.\n\n**Pas encore de fiche de salaire suisse ?**");
  add('budget-colocation-geneve-guide-complet', 'en', "budget: L'Appart between a standard flatshare and coliving (euros apart)",
    '**No Swiss payslip yet?**',
    "Between a standard flatshare and coliving, there's also [L'Appart](/en/lappart), La Villa Coliving's flatshare in Annemasse, near the station: 4 furnished rooms from {{PRIX_APPART_DES}} a month, with bills, fibre, streaming and cleaning of the shared areas included. In euros: from {{PRIX_APPART_DES_EUR}}.\n\n**No Swiss payslip yet?**");

  // 9. Quartiers d'Annemasse (BLOG.md § 2.4) : la phrase de commune dans « Où viser » du profil 1.
  add('quartiers-annemasse-ou-vivre-selon-profil', 'fr', "profil 1 : la phrase de commune de L'Appart avant « Tu commandes ton train »",
    "Tu commandes ton train, pas l'inverse.",
    `Toujours à Annemasse, ${commune(m, 'fr')} Tu commandes ton train, pas l'inverse.`);
  add('quartiers-annemasse-ou-vivre-selon-profil', 'en', "profile 1: L'Appart's local sentence at the end of « Where to aim »",
    'door to door.\n\n**The real test:** measure the actual walking time',
    `door to door. Also in Annemasse, ${commune(m, 'en')}\n\n**The real test:** measure the actual walking time`);

  // 10. Où habiter en France (page de décision, BLOG.md § 2.5) : profil 4, forme compacte des pages de décision.
  add('ou-habiter-en-france-quand-on-travaille-a-geneve', 'fr', "profil 4 (budget serré) : L'Appart, forme compacte CHF/€ des pages de décision",
    'Pour un premier poste, deux pièges reviennent',
    "Si ton budget est vraiment serré, regarde [L'Appart](/lappart), la colocation de La Villa Coliving à Annemasse, quartier de la gare : des chambres dès {{PRIX_APPART_DES}}/{{PRIX_APPART_DES_EUR}} par mois, charges, fibre, streaming et ménage des communs compris.\n\nPour un premier poste, deux pièges reviennent");
  add('ou-habiter-en-france-quand-on-travaille-a-geneve', 'en', "profile 4 (tight budget): L'Appart, compact CHF/€ form of decision pages",
    'For a first job, two traps come up again and again',
    "If your budget is really tight, have a look at [L'Appart](/en/lappart), La Villa Coliving's flatshare in Annemasse, near the station: rooms from {{PRIX_APPART_DES}}/{{PRIX_APPART_DES_EUR}} a month, with bills, fibre, streaming and cleaning of the shared areas included.\n\nFor a first job, two traps come up again and again");

  // ── Ajout du 21/11/2026 (relecture du texte vivant) : deux phrases « couples » que L'Appart rend fausses pour toute la marque
  //    (la suite se loue à deux) : la règle « une chambre, une personne » redevient celle des maisons. Les phrases « chaque chambre
  //    a un bureau » restent vraies : les chambres de L'Appart ont lit, bureau et penderie (src/data/appartPage.ts).
  add('coliving-colocation-ou-studio-geneve-comparatif', 'fr', "couples : la suite de L'Appart se loue à deux (page de décision)",
    "Un couple qui veut partager une seule chambre, ou une famille, a besoin d'un logement entier : un deux-pièces meublé côté France se loue 1 200 à 1 500 € par mois charges comprises (annonces, septembre 2026). Chez nous, une chambre accueille une seule personne ; un couple peut venir en prenant deux chambres.",
    "Une famille a besoin d'un logement entier : un deux-pièces meublé côté France se loue 1 200 à 1 500 € par mois charges comprises (annonces, septembre 2026). Dans nos maisons, une chambre accueille une seule personne ; un couple peut venir en prenant deux chambres, ou partager la suite de [L'Appart](/lappart), notre colocation à Annemasse, quartier de la gare.");
  add('coliving-colocation-ou-studio-geneve-comparatif', 'en', "couples: L'Appart's suite is let to two people (decision page)",
    'A couple who want to share a single room, or a family, need a whole home: a furnished one-bedroom flat on the French side rents for €1,200 to €1,500 a month including charges (listings, September 2026). With us, each room is let to one person; a couple can come by taking two rooms.',
    "A family needs a whole home: a furnished one-bedroom flat on the French side rents for €1,200 to €1,500 a month including charges (listings, September 2026). In our houses, each room is let to one person; a couple can come by taking two rooms, or share the suite at [L'Appart](/en/lappart), our flatshare in Annemasse, near the station.");
  add('ou-habiter-en-france-quand-on-travaille-a-geneve', 'fr', "couples : la règle « une chambre, une personne » est celle des maisons (page de décision)",
    'chez nous, une chambre accueille une seule personne (un couple peut en prendre deux).',
    "dans nos maisons, une chambre accueille une seule personne (un couple peut en prendre deux), et à L'Appart, seule la suite se loue à deux.");
  add('ou-habiter-en-france-quand-on-travaille-a-geneve', 'en', "couples: « one room, one person » is the houses' rule (decision page)",
    'with us, each room is for one person (a couple can take two).',
    "in our houses, each room is for one person (a couple can take two), and at L'Appart only the suite is let to two people.");
  return E;
}
