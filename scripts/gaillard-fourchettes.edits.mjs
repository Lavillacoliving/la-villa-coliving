/**
 * Lot du 12/10/2026 (2e réponse de Jérôme) — deux corrections d'articles en base, liste DÉCLARATIVE pour scripts/build-slots-sql.mjs :
 *   node scripts/build-slots-sql.mjs --edits ./gaillard-fourchettes.edits.mjs --name gaillard-fourchettes --date 2026-10-12 --write-diff
 * 1. ou-habiter (« Top 7 des villes ») : Gaillard retiré du corps (« on retire ») — la section 3 devient Ambilly (déplacée depuis sa section
 *    non numérotée, texte inchangé, phrase de commune L1 du Loft conservée), « À noter pour Gaillard » → « À noter » (puce tram 17 seule),
 *    ligne du tableau et puce « En résumé » → Ambilly, extrait EN avec la liste exacte des 7 villes. Toujours 7 villes : titre et metas inchangés.
 * 2. colocation-annemasse : « on garde 700 à 1 000 € » — les prix CHF par zone (1000-1400 CHF…) sont retirés au profit d'une phrase
 *    unique en tête de « Les bonnes zones » reprenant la fourchette canonique (MARKET_ROOM_EUR, bloc « Où chercher » juste au-dessus),
 *    et la ligne « Chambre en colocation classique » du tableau des prix passe de 550-800 à 700-1 000 €.
 * Chaînes relevées le 12/10/2026 sur la base vivante (find = 1 occurrence) ; aucune donnée chiffrée nouvelle hors MARKET_ROOM_EUR.
 */

export const POST_STATE_WATCH = [/Gaillard/, /\d{3,4}-\d{3,4} CHF/];

export function sqlDoc() {
  return {
    lot: 'Lot du 12/10/2026 (2e réponse) : Gaillard retiré du corps de ou-habiter (Ambilly en 3), fourchettes de colocation-annemasse alignées sur 700 à 1 000 €.',
    sources: 'chaînes relevées sur la base vivante le 12/10 ; fourchette = MARKET_ROOM_EUR (src/data/stats.ts)',
    apply: 'Indépendant du code ; republication par le bot au prochain push ou cron.',
    encoding: 'Fichier UTF-8 — ne pas normaliser les espaces.',
    dryRunTitle: 'Gaillard (corps de ou-habiter) et fourchettes (colocation-annemasse) — aperçu SQL',
    legend: 'Légende : « Avant » = texte en base au 12/10 ; « Après » = texte corrigé.',
    versions: {},
  };
}

const EDITS = [
  {
    "slug": "ou-habiter-frontalier-suisse-villes-france-pas-cher",
    "lang": "fr",
    "mechanism": "FAITS",
    "note": "Gaillard retiré : la section 3 devient Ambilly (déplacée depuis sa section non numérotée)",
    "find": "## 3. Gaillard — La frontière à pied\n\n**Distance Genève** : 3 km · **Temps de trajet** : 10 min en bus, 25 min à vélo · **Loyer T2** : 800-1 050 €/mois\n\nGaillard touche littéralement la frontière. Tu peux traverser à pied vers le quartier des Eaux-Vives ou Champel. Cher mais pratique.\n\n**Pour qui ?** Frontaliers sans voiture qui travaillent dans le centre de Genève.\n\n",
    "replace": "## 3. Ambilly — Le charme urbain collé à la frontière\n\n**Frontière à pied** : 8 min (le Foron, à 600 m du Loft) · **Temps de trajet Genève** : Rive en 23 min de tram 17 (32 min porte-à-porte depuis Le Loft), Genève-Eaux-Vives en 7 min de Léman Express (24 min porte-à-porte) · **Loyer studio** : 700-900 €/mois\n\nAmbilly est la commune collée à la frontière : depuis Le Loft, le Foron, la rivière-frontière, est à 600 m, 8 min à pied, et la douane de Moillesulaz à 1,8 km. Ambiance urbaine, dynamique et multiculturelle, avec restaurants, commerces et marchés sur place. Côté transports, les bus TPG et le Tram 17 filent direct sur Genève. Position centrale, juste entre Annemasse et la frontière suisse.\n\nÀ Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.\n\n**Pour qui ?** Jeunes professionnels, frontaliers sans voiture, amoureux de la vie urbaine.\n\n"
  },
  {
    "slug": "ou-habiter-frontalier-suisse-villes-france-pas-cher",
    "lang": "fr",
    "mechanism": "FAITS",
    "note": "ancienne section Ambilly retirée (déplacée en 3) ; « À noter pour Gaillard » → « À noter », puce Gaillard retirée",
    "find": "## Ambilly — Le charme urbain collé à la frontière\n\n**Frontière à pied** : 8 min (le Foron, à 600 m du Loft) · **Temps de trajet Genève** : Rive en 23 min de tram 17 (32 min porte-à-porte depuis Le Loft), Genève-Eaux-Vives en 7 min de Léman Express (24 min porte-à-porte) · **Loyer studio** : 700-900 €/mois\n\nAmbilly est la commune collée à la frontière : depuis Le Loft, le Foron, la rivière-frontière, est à 600 m, 8 min à pied, et la douane de Moillesulaz à 1,8 km. Ambiance urbaine, dynamique et multiculturelle, avec restaurants, commerces et marchés sur place. Côté transports, les bus TPG et le Tram 17 filent direct sur Genève. Position centrale, juste entre Annemasse et la frontière suisse.\n\nÀ Ambilly, Le Loft de La Villa Coliving (7 chambres) est à 8 min à pied du tram 17 — Genève-Eaux-Vives en 24 min porte-à-porte.\n\n**Pour qui ?** Jeunes professionnels, frontaliers sans voiture, amoureux de la vie urbaine.\n\n## À noter pour Gaillard\n\n- Le **Tram 17**, déjà direct sur Genève, est **prolongé dans Annemasse fin 2026** (trois nouveaux arrêts, Annemasse Agglo).\n- Gaillard est à **5 min de la douane de Moillesulaz**.\n\n",
    "replace": "## À noter\n\n- Le **Tram 17**, déjà direct sur Genève, est **prolongé dans Annemasse fin 2026** (trois nouveaux arrêts, Annemasse Agglo).\n\n"
  },
  {
    "slug": "ou-habiter-frontalier-suisse-villes-france-pas-cher",
    "lang": "fr",
    "mechanism": "FAITS",
    "note": "tableau récapitulatif : ligne Gaillard → Ambilly (loyer studio, faute de T2 mesuré)",
    "find": "| Gaillard | 10-25 min | 800-1 050 € | Frontière à pied |",
    "replace": "| Ambilly | Genève-Eaux-Vives en 7 min de Léman Express, 24 min porte-à-porte depuis Le Loft | 700-900 € (studio) | Tram 17, frontière à pied |"
  },
  {
    "slug": "ou-habiter-frontalier-suisse-villes-france-pas-cher",
    "lang": "fr",
    "mechanism": "FAITS",
    "note": "En résumé : Gaillard → Ambilly",
    "find": "- **Sans voiture, centre Genève** : Gaillard ou Annemasse",
    "replace": "- **Sans voiture, centre Genève** : Ambilly ou Annemasse"
  },
  {
    "slug": "ou-habiter-frontalier-suisse-villes-france-pas-cher",
    "lang": "en",
    "mechanism": "FAITS",
    "note": "Gaillard removed: section 3 becomes Ambilly (moved from its unnumbered section)",
    "find": "## 3. Gaillard — The walk-across border\n\n**Distance to Geneva**: 3 km · **Commute**: 10 min by bus, 25 min by bike · **2-room rent**: €800-1,050/month\n\nGaillard literally touches the border. You can walk across to Eaux-Vives or Champel. Pricey but practical.\n\n**For whom?** Car-free workers commuting to central Geneva.\n\n",
    "replace": "## 3. Ambilly — Urban charm right on the border\n\n**Walk to border**: 8 min (the Foron, 600 m from Le Loft) · **Commute to Geneva**: Rive in 23 min by tram 17 (32 min door to door from Le Loft), Geneva Eaux-Vives in 7 min by Léman Express (24 min door to door) · **Studio rent**: €700-900/month\n\nAmbilly is the town right on the border: from Le Loft, the Foron, the border river, is 600 m away, an 8-minute walk, and the Moillesulaz crossing 1.8 km away. The vibe is urban, dynamic and multicultural, with restaurants, shops and markets on the spot. For transport, TPG buses run straight to Geneva. Central location, right between Annemasse and the Swiss border.\n\nIn Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door.\n\n**For whom?** Young professionals, car-free workers, urban lifestyle lovers.\n\n"
  },
  {
    "slug": "ou-habiter-frontalier-suisse-villes-france-pas-cher",
    "lang": "en",
    "mechanism": "FAITS",
    "note": "old Ambilly section removed (moved to 3); « Worth noting for Gaillard » → « Worth noting », Gaillard bullet removed",
    "find": "## Ambilly — Urban charm right on the border\n\n**Walk to border**: 8 min (the Foron, 600 m from Le Loft) · **Commute to Geneva**: Rive in 23 min by tram 17 (32 min door to door from Le Loft), Geneva Eaux-Vives in 7 min by Léman Express (24 min door to door) · **Studio rent**: €700-900/month\n\nAmbilly is the town right on the border: from Le Loft, the Foron, the border river, is 600 m away, an 8-minute walk, and the Moillesulaz crossing 1.8 km away. The vibe is urban, dynamic and multicultural, with restaurants, shops and markets on the spot. For transport, TPG buses run straight to Geneva. Central location, right between Annemasse and the Swiss border.\n\nIn Ambilly, Le Loft by La Villa Coliving (7 rooms) is an 8-minute walk from tram 17 — Geneva Eaux-Vives in 24 minutes door to door.\n\n**For whom?** Young professionals, car-free workers, urban lifestyle lovers.\n\n## Worth noting for Gaillard\n\n- **Tram 17**, already direct to Geneva, is **extended into Annemasse at the end of 2026** (three new stops, Annemasse Agglo).\n- Gaillard is **5 min from the Moillesulaz border crossing**.\n\n",
    "replace": "## Worth noting\n\n- **Tram 17**, already direct to Geneva, is **extended into Annemasse at the end of 2026** (three new stops, Annemasse Agglo).\n\n"
  },
  {
    "slug": "ou-habiter-frontalier-suisse-villes-france-pas-cher",
    "lang": "en",
    "mechanism": "FAITS",
    "note": "quick comparison: Gaillard row → Ambilly (studio rent, no measured 2-room figure)",
    "find": "| Gaillard | 10-25 min | €800-1,050 | Walk across the border |",
    "replace": "| Ambilly | Geneva Eaux-Vives in 7 min by Léman Express, 24 min door to door from Le Loft | €700-900 (studio) | Tram 17, walk to the border |"
  },
  {
    "slug": "ou-habiter-frontalier-suisse-villes-france-pas-cher",
    "lang": "en",
    "mechanism": "FAITS",
    "note": "TL;DR: Gaillard → Ambilly",
    "find": "- **Car-free, central Geneva**: Gaillard or Annemasse",
    "replace": "- **Car-free, central Geneva**: Ambilly or Annemasse"
  },
  {
    "slug": "ou-habiter-frontalier-suisse-villes-france-pas-cher",
    "lang": "en",
    "mechanism": "FAITS",
    "note": "extrait EN : liste exacte des 7 villes (Ambilly remplace Gaillard)",
    "find": "Annemasse, Ville-la-Grand, Saint-Julien, Ferney-Voltaire, Thonon, Divonne and more",
    "replace": "Annemasse, Ville-la-Grand, Ambilly, Saint-Julien, Ferney-Voltaire, Thonon, Divonne",
    "column": "excerpt_en"
  },
  {
    "slug": "colocation-annemasse-ville-la-grand-ambilly",
    "lang": "fr",
    "mechanism": "FAITS",
    "note": "zones : fourchette canonique (700 à 1 000 €, décision Jérôme 12/10) en tête de section, prix CHF par zone retirés",
    "find": "## Les bonnes zones\n\n**Annemasse centre (près de la gare)** : Prix : 1000-1400 CHF. Vibrant,",
    "replace": "## Les bonnes zones\n\nDans ces quatre zones, compte 700 à 1 000 € par mois pour une chambre en colocation, selon l'annonce.\n\n**Annemasse centre (près de la gare)** : Vibrant,"
  },
  {
    "slug": "colocation-annemasse-ville-la-grand-ambilly",
    "lang": "fr",
    "mechanism": "FAITS",
    "note": "zones : prix CHF retiré (Annemasse Nord)",
    "find": "**Annemasse Nord** : Prix : 950-1250 CHF. 10",
    "replace": "**Annemasse Nord** : 10"
  },
  {
    "slug": "colocation-annemasse-ville-la-grand-ambilly",
    "lang": "fr",
    "mechanism": "FAITS",
    "note": "zones : prix CHF retiré (Ville-la-Grand)",
    "find": "**Ville-la-Grand** : Prix : 900-1250 CHF. Plus",
    "replace": "**Ville-la-Grand** : Plus"
  },
  {
    "slug": "colocation-annemasse-ville-la-grand-ambilly",
    "lang": "fr",
    "mechanism": "FAITS",
    "note": "zones : prix CHF retiré (Ambilly)",
    "find": "**Ambilly** : Prix : 850-1150 CHF. Très",
    "replace": "**Ambilly** : Très"
  },
  {
    "slug": "colocation-annemasse-ville-la-grand-ambilly",
    "lang": "fr",
    "mechanism": "FAITS",
    "note": "tableau des prix : chambre en colocation alignée sur 700-1 000 €",
    "find": "| Chambre en colocation classique | 550-800 €/mois (charges parfois en sus) |",
    "replace": "| Chambre en colocation classique | 700-1 000 €/mois (charges parfois en sus) |"
  },
  {
    "slug": "colocation-annemasse-ville-la-grand-ambilly",
    "lang": "en",
    "mechanism": "FAITS",
    "note": "zones: canonical range (€700 to €1,000) at the top, per-zone CHF prices removed",
    "find": "## Best Zones\n\n**Annemasse center (near station)**: Price: 1000-1400 CHF. Vibrant,",
    "replace": "## Best Zones\n\nIn these four areas, expect €700 to €1,000 a month for a room in a flatshare, depending on the listing.\n\n**Annemasse center (near station)**: Vibrant,"
  },
  {
    "slug": "colocation-annemasse-ville-la-grand-ambilly",
    "lang": "en",
    "mechanism": "FAITS",
    "note": "zones: CHF price removed (Annemasse North)",
    "find": "**Annemasse North**: Price: 950-1250 CHF. 10",
    "replace": "**Annemasse North**: 10"
  },
  {
    "slug": "colocation-annemasse-ville-la-grand-ambilly",
    "lang": "en",
    "mechanism": "FAITS",
    "note": "zones: CHF price removed (Ville-la-Grand)",
    "find": "**Ville-la-Grand**: Price: 900-1250 CHF. More",
    "replace": "**Ville-la-Grand**: More"
  },
  {
    "slug": "colocation-annemasse-ville-la-grand-ambilly",
    "lang": "en",
    "mechanism": "FAITS",
    "note": "zones: CHF price removed (Ambilly)",
    "find": "**Ambilly**: Price: 850-1150 CHF. Very",
    "replace": "**Ambilly**: Very"
  },
  {
    "slug": "colocation-annemasse-ville-la-grand-ambilly",
    "lang": "en",
    "mechanism": "FAITS",
    "note": "price table: flatshare room aligned on 700-1,000 €",
    "find": "| Room in a traditional flatshare | 550-800 €/month (charges sometimes extra) |",
    "replace": "| Room in a traditional flatshare | 700-1,000 €/month (charges sometimes extra) |"
  }
];

export function buildEdits() {
  return EDITS.map((e) => ({ ...e }));
}
