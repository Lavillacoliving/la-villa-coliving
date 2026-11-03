/**
 * Brief « Genève profils » v2 du 30/10/2026 — lot C, option A de D-C1 (règle du 29/09 : une chambre = une personne, un couple = deux chambres).
 * A1 et A3 disaient « en couple […] notre formule n'est pas la bonne » : on vise le couple qui veut son propre logement,
 * sans contredire la FAQ (`faqData.ts`, coliving-couples) ni le comparatif coliving / colocation / studio.
 *   node scripts/build-slots-sql.mjs --edits ./<ce fichier> --name <base> --date 2026-11-03 --write-diff
 */

export const POST_STATE_WATCH = [];

export function sqlDoc() {
  return {
    "lot": "C, option A de D-C1 : phrases « couple » d'A1 et A3 alignées sur la règle du 29/09",
    "sources": "chaînes relevées sur la base vivante le 03/11/2026 (= content/decision-pages/*.md)",
    "apply": "Après validation de D-C1 (option A) par Jérôme.",
    "encoding": "Fichier UTF-8 — ne pas normaliser les espaces.",
    "dryRunTitle": "Lot C — phrases « couple » d'A1 et A3 : aperçu SQL",
    "legend": "Légende : « Avant » = texte en base au 03/11 ; « Après » = texte proposé.",
    "versions": {}
  };
}

const EDITS = [
  {
    "slug": "ou-habiter-en-france-quand-on-travaille-a-geneve",
    "lang": "fr",
    "mechanism": "C1-A",
    "note": "A1 : le couple qui veut son propre logement, pas le couple en général",
    "find": "Et si tu viens en couple ou en famille, notre formule n'est pas la bonne : nos chambres sont pour une personne. Cherche plutôt un T2 ou un T3, et prévois les délais les plus longs du tableau ci-dessous.",
    "replace": "Et si tu viens en famille, ou en couple qui veut son propre logement, notre formule n'est pas la bonne : chez nous, une chambre accueille une seule personne (un couple peut en prendre deux). Cherche plutôt un T2 ou un T3, et prévois les délais les plus longs du tableau ci-dessous."
  },
  {
    "slug": "ou-habiter-en-france-quand-on-travaille-a-geneve",
    "lang": "en",
    "mechanism": "C1-A",
    "note": "A1: couples who want a place of their own, not couples in general",
    "find": "And if you're coming as a couple or a family, our format isn't the right one: our rooms are for one person. Look for a one- or two-bedroom flat instead, and plan on the longer timelines in the table below.",
    "replace": "And if you're coming as a family, or as a couple who want a place of your own, our format isn't the right one: with us, each room is for one person (a couple can take two). Look for a one- or two-bedroom flat instead, and plan on the longer timelines in the table below."
  },
  {
    "slug": "trouver-logement-avant-d-arriver-geneve",
    "lang": "fr",
    "mechanism": "C1-A",
    "note": "A3 : même nuance",
    "find": "En couple ou en famille, vise un studio ou un appartement, avec le délai haut du tableau.",
    "replace": "En famille, ou en couple qui veut son propre logement, vise un studio ou un appartement, avec le délai haut du tableau."
  },
  {
    "slug": "trouver-logement-avant-d-arriver-geneve",
    "lang": "en",
    "mechanism": "C1-A",
    "note": "A3: same nuance",
    "find": "As a couple or a family, look for a studio or a flat, and plan on the longer timelines in the table.",
    "replace": "As a family, or as a couple who want a place of your own, look for a studio or a flat, and plan on the longer timelines in the table."
  }
];

export function buildEdits() {
  return EDITS;
}
