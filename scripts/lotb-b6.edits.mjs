/**
 * Brief « Genève profils » v2 du 30/10/2026 — B6, section « quartiers à éviter » de `quartiers-annemasse-ou-vivre-selon-profil`.
 * H2 en question, réponse directe, aucune affirmation sur la délinquance, pas de paragraphe Gaillard (recommandation D-B6).
 * A1 est déjà lié depuis le 02/11 (puce FR, phrase EN).
 *   node scripts/build-slots-sql.mjs --edits ./<ce fichier> --name <base> --date 2026-11-02 --write-diff
 */

export const POST_STATE_WATCH = [];

export function sqlDoc() {
  return {
    "lot": "B6 quartiers : section « quartiers à éviter » en question",
    "sources": "chaînes relevées sur la base vivante le 02/11/2026",
    "apply": "Après validation du diff par Jérôme (D-B0), dans la séance du lot B.",
    "encoding": "Fichier UTF-8 — ne pas normaliser les espaces.",
    "dryRunTitle": "Lot B — B6 quartiers : aperçu SQL",
    "legend": "Légende : « Avant » = texte en base au 02/11 ; « Après » = texte proposé.",
    "versions": {}
  };
}

const EDITS = [
  {
    "slug": "quartiers-annemasse-ou-vivre-selon-profil",
    "lang": "fr",
    "mechanism": "B6",
    "note": "le H2 devient la question, réponse directe en tête ; sans Gaillard (garde du 09/10, D-B6)",
    "find": "## Quels quartiers éviter, selon ton profil\n\nPas de « mauvais quartier » à Annemasse — mais des secteurs qui collent mal à certains besoins :",
    "replace": "## Y a-t-il des quartiers à éviter à Annemasse ?\n\nPas au sens d'un quartier à fuir : ce qui change ton quotidien à Annemasse, c'est la distance à une gare ou à un arrêt de tram, et le bruit des grands axes. Voici les secteurs qui collent mal à certains besoins :"
  },
  {
    "slug": "quartiers-annemasse-ou-vivre-selon-profil",
    "lang": "en",
    "mechanism": "B6",
    "note": "the H2 becomes the question, direct answer first; no Gaillard (09/10 guard, D-B6)",
    "find": "## Which areas to avoid, by profile\n\nNo \"bad neighbourhood\" in Annemasse — but areas that fit certain needs poorly:",
    "replace": "## Are there areas to avoid in Annemasse?\n\nNot in the sense of a place to steer clear of: what shapes your daily life in Annemasse is the distance to a station or a tram stop, and the noise of the main roads. These are the areas that fit some needs poorly:"
  }
];

export function buildEdits() {
  return EDITS;
}
