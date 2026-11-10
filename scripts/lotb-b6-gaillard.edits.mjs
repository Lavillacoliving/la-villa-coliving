/**
 * Brief « Genève profils » v2 du 30/10/2026 — D-B6b (optionnel), `quartiers-annemasse-ou-vivre-selon-profil`.
 * Retire Gaillard des zones « où viser » (profil 2, FAQ vélo), règle « Gaillard jamais parmi les zones où chercher ».
 * À appliquer seulement si tu valides D-B6b.
 *   node scripts/build-slots-sql.mjs --edits ./<ce fichier> --name <base> --date 2026-11-02 --write-diff
 */

export const POST_STATE_WATCH = [];

export function sqlDoc() {
  return {
    "lot": "D-B6b quartiers : Gaillard retiré des zones où viser (optionnel)",
    "sources": "chaînes relevées sur la base vivante le 02/11/2026",
    "apply": "Après validation du diff par Jérôme (D-B0), dans la séance du lot B.",
    "encoding": "Fichier UTF-8 — ne pas normaliser les espaces.",
    "dryRunTitle": "Lot B — D-B6b quartiers : aperçu SQL",
    "legend": "Légende : « Avant » = texte en base au 02/11 ; « Après » = texte proposé.",
    "versions": {}
  };
}

const EDITS = [
  {
    "slug": "quartiers-annemasse-ou-vivre-selon-profil",
    "lang": "fr",
    "mechanism": "D-B6b",
    "note": "profil 2 : Gaillard n'est jamais une zone où chercher",
    "find": "**Où viser :** **Ambilly** et **Gaillard**. Depuis là,",
    "replace": "**Où viser :** **Ambilly**, côté Moillesulaz. Depuis là,"
  },
  {
    "slug": "quartiers-annemasse-ou-vivre-selon-profil",
    "lang": "en",
    "mechanism": "D-B6b",
    "note": "profile 2: Gaillard is never an area to look in",
    "find": "**Where to aim:** **Ambilly** and **Gaillard**. From there,",
    "replace": "**Where to aim:** **Ambilly**, on the Moillesulaz side. From there,"
  },
  {
    "slug": "quartiers-annemasse-ou-vivre-selon-profil",
    "lang": "fr",
    "mechanism": "D-B6b",
    "note": "FAQ vélo",
    "find": "**Ambilly** ou **Gaillard**, près du poste-frontière de Moillesulaz :",
    "replace": "**Ambilly**, près du poste-frontière de Moillesulaz :"
  },
  {
    "slug": "quartiers-annemasse-ou-vivre-selon-profil",
    "lang": "en",
    "mechanism": "D-B6b",
    "note": "bike FAQ",
    "find": "**Ambilly** or **Gaillard**, near the Moillesulaz crossing:",
    "replace": "**Ambilly**, near the Moillesulaz crossing:"
  }
];

export function buildEdits() {
  return EDITS;
}
