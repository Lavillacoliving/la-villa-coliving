/**
 * Brief « Genève profils » v2 du 30/10/2026 — B2, `budget-colocation-geneve-guide-complet` et ouverture EN de `trouver-colocation-geneve-frontalier`.
 * Titres courts (D-T du 30/10), métas, ancre exacte vers la page argent, « À lire aussi » (A3).
 * FR de trouver-colocation inchangé : son ancre « colocation à Genève côté France » est ta décision du 04/09.
 *   node scripts/build-slots-sql.mjs --edits ./<ce fichier> --name <base> --date 2026-11-02 --write-diff
 */

export const POST_STATE_WATCH = [];

export function sqlDoc() {
  return {
    "lot": "B2 budget colocation : titres, métas, ancres vers la page argent, À lire aussi",
    "sources": "chaînes relevées sur la base vivante le 02/11/2026",
    "apply": "Après validation du diff par Jérôme (D-B0), dans la séance du lot B.",
    "encoding": "Fichier UTF-8 — ne pas normaliser les espaces.",
    "dryRunTitle": "Lot B — B2 budget colocation : aperçu SQL",
    "legend": "Légende : « Avant » = texte en base au 02/11 ; « Après » = texte proposé.",
    "versions": {}
  };
}

const EDITS = [
  {
    "slug": "budget-colocation-geneve-guide-complet",
    "lang": "fr",
    "column": "title_fr",
    "mechanism": "B2",
    "note": "titre FR (version courte validée le 30/10)",
    "find": "Budget colocation Genève 2026 : loyers réels et coût total",
    "replace": "Colocation à Genève : le vrai budget 2026, tout compris"
  },
  {
    "slug": "budget-colocation-geneve-guide-complet",
    "lang": "en",
    "column": "title_en",
    "mechanism": "B2",
    "note": "EN title (short version approved on 30/10)",
    "find": "Shared Housing Budget near Geneva: The Real Cost (2026)",
    "replace": "Flatshare in Geneva: the real 2026 budget, all costs included"
  },
  {
    "slug": "budget-colocation-geneve-guide-complet",
    "lang": "fr",
    "column": "meta_description_fr",
    "mechanism": "B2",
    "note": "méta FR : la fourchette d'abord (côté Genève seulement, voir le rapport pour l'écart des prix côté France)",
    "find": "Combien coûte vraiment une colocation à Genève en 2026 ? Loyers réels par ville, studio vs colocation vs coliving, charges cachées et comment économiser.",
    "replace": "Une chambre en colocation coûte 1 200 à 1 600 CHF à Genève centre, bien moins côté France. Loyer, charges, caution, coût d'entrée : le vrai budget 2026."
  },
  {
    "slug": "budget-colocation-geneve-guide-complet",
    "lang": "en",
    "column": "meta_description_en",
    "mechanism": "B2",
    "note": "EN meta: the range first",
    "find": "What does cross-border housing near Geneva really cost in 2026? Real prices by town, studio vs flatshare vs coliving, hidden costs and savings.",
    "replace": "A flatshare room costs CHF 1,200 to 1,600 in central Geneva, far less on the French side. Rent, bills, deposit, move-in costs: the real 2026 budget."
  },
  {
    "slug": "budget-colocation-geneve-guide-complet",
    "lang": "fr",
    "mechanism": "B2",
    "note": "ouverture : ancre exacte « colocation à Genève » (au lieu de « coloc Genève tout inclus »)",
    "find": "(voir notre [coloc Genève tout inclus](/colocation-geneve), chambres et prix en CHF)",
    "replace": "(voir notre page [colocation à Genève](/colocation-geneve), côté France et tout inclus, avec chambres et prix en CHF)"
  },
  {
    "slug": "budget-colocation-geneve-guide-complet",
    "lang": "en",
    "mechanism": "B2",
    "note": "opening: link with the exact anchor \"flatshare in Geneva\" (none today)",
    "find": "are turning to **shared housing on the French side** as a smart alternative.",
    "replace": "are turning to **shared housing on the French side** as a smart alternative (see our page on [flatshare in Geneva](/en/colocation-geneve), French side and all inclusive, with rooms and prices in CHF)."
  },
  {
    "slug": "budget-colocation-geneve-guide-complet",
    "lang": "fr",
    "mechanism": "B2",
    "note": "« À lire aussi » : A3 (A1 y est depuis le 02/11)",
    "find": "- [Où habiter en France quand on travaille à Genève ?](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)",
    "replace": "- [Où habiter en France quand on travaille à Genève ?](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)\n- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)"
  },
  {
    "slug": "budget-colocation-geneve-guide-complet",
    "lang": "en",
    "mechanism": "B2",
    "note": "\"Read also\": A3 (A1 listed since 02/11)",
    "find": "- [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)",
    "replace": "- [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)\n- [Find housing in France before you arrive in Geneva](/en/blog/trouver-logement-avant-d-arriver-geneve)"
  },
  {
    "slug": "trouver-colocation-geneve-frontalier",
    "lang": "en",
    "mechanism": "B2",
    "note": "trouver une colocation EN : lien d'ouverture vers la page argent (le FR a déjà « colocation à Genève côté France », décision du 04/09)",
    "find": "Finding a colocation near Geneva when you work in Switzerland is a particular journey:",
    "replace": "Finding a [flatshare in Geneva](/en/colocation-geneve), or just across the border, when you work in Switzerland is a particular journey:"
  }
];

export function buildEdits() {
  return EDITS;
}
