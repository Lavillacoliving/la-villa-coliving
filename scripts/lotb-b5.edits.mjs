/**
 * Brief « Genève profils » v2 du 30/10/2026 — B5, ouverture de `colocation-annemasse-ville-la-grand-ambilly`.
 * Lien vers /annemasse-colocation (ancre exacte FR). Le lien retour de la page argent est une ligne de code (PR du lot B).
 *   node scripts/build-slots-sql.mjs --edits ./<ce fichier> --name <base> --date 2026-11-02 --write-diff
 */

export const POST_STATE_WATCH = [];

export function sqlDoc() {
  return {
    "lot": "B5 colocation Annemasse : lien d'ouverture vers la page argent",
    "sources": "chaînes relevées sur la base vivante le 02/11/2026",
    "apply": "Après validation du diff par Jérôme (D-B0), dans la séance du lot B.",
    "encoding": "Fichier UTF-8 — ne pas normaliser les espaces.",
    "dryRunTitle": "Lot B — B5 colocation Annemasse : aperçu SQL",
    "legend": "Légende : « Avant » = texte en base au 02/11 ; « Après » = texte proposé.",
    "versions": {}
  };
}

const EDITS = [
  {
    "slug": "colocation-annemasse-ville-la-grand-ambilly",
    "lang": "fr",
    "mechanism": "B5",
    "note": "ouverture : ancre exacte « colocation à Annemasse » vers la page argent",
    "find": "Chercher une colocation près de Genève c'est un jeu de chasse.",
    "replace": "Chercher une [colocation à Annemasse](/annemasse-colocation) ou ailleurs près de Genève, c'est un jeu de chasse."
  },
  {
    "slug": "colocation-annemasse-ville-la-grand-ambilly",
    "lang": "en",
    "mechanism": "B5",
    "note": "opening: link to the money page",
    "find": "Looking for a room in a flatshare in Annemasse, Ville-la-Grand or Ambilly, just across the border from Geneva?",
    "replace": "Looking for a room in a [flatshare in Annemasse](/en/annemasse-colocation), Ville-la-Grand or Ambilly, just across the border from Geneva?"
  }
];

export function buildEdits() {
  return EDITS;
}
