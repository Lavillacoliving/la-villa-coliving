/**
 * Brief « Genève profils » v2 du 30/10/2026 — B1, `cout-de-la-vie-suisse-france-frontalier-2026`.
 * Titres courts (D-T du 30/10), métas chiffrées, section « quel salaire compense » construite UNIQUEMENT avec les chiffres
 * publiés (ce guide, salaire-suisse-net-frontalier-2026, prix de la fiche entité), « Pour aller plus loin » (A1, B8).
 *   node scripts/build-slots-sql.mjs --edits ./<ce fichier> --name <base> --date 2026-11-02 --write-diff
 */

export const POST_STATE_WATCH = [];

export function sqlDoc() {
  return {
    "lot": "B1 coût de la vie : titres, métas, section « quel salaire compense », Pour aller plus loin",
    "sources": "chaînes relevées sur la base vivante le 02/11/2026",
    "apply": "Après validation du diff par Jérôme (D-B0), dans la séance du lot B.",
    "encoding": "Fichier UTF-8 — ne pas normaliser les espaces.",
    "dryRunTitle": "Lot B — B1 coût de la vie : aperçu SQL",
    "legend": "Légende : « Avant » = texte en base au 02/11 ; « Après » = texte proposé.",
    "versions": {}
  };
}

const EDITS = [
  {
    "slug": "cout-de-la-vie-suisse-france-frontalier-2026",
    "lang": "fr",
    "column": "title_fr",
    "mechanism": "B1",
    "note": "titre FR (version courte validée le 30/10)",
    "find": "Coût de la vie Suisse vs France 2026 : prix réels et vrai bilan",
    "replace": "Coût de la vie Suisse-France 2026 : prix réels et salaire à viser"
  },
  {
    "slug": "cout-de-la-vie-suisse-france-frontalier-2026",
    "lang": "en",
    "column": "title_en",
    "mechanism": "B1",
    "note": "EN title (short version approved on 30/10)",
    "find": "Switzerland vs France cost of living 2026",
    "replace": "Switzerland vs France cost of living 2026: real prices, salary needed"
  },
  {
    "slug": "cout-de-la-vie-suisse-france-frontalier-2026",
    "lang": "fr",
    "column": "meta_description_fr",
    "mechanism": "B1",
    "note": "méta FR : la réponse chiffrée d'abord",
    "find": "Prix de la vie en Suisse vs France en 2026 : loyer ×2-3, courses, restaurants, LAMal vs CMU, transport. Le vrai bilan chiffré d'un frontalier de Genève.",
    "replace": "Logement ×2 à ×3 à Genève, courses de base 30 à 40 % moins chères en France, LAMal ou CMU : le bilan 2026 du frontalier, et le salaire qui compense."
  },
  {
    "slug": "cout-de-la-vie-suisse-france-frontalier-2026",
    "lang": "en",
    "column": "meta_description_en",
    "mechanism": "B1",
    "note": "EN meta: the figures first",
    "find": "Cost of living Switzerland vs France 2026: rent ×2-3, groceries, dining, LAMal vs CMU, transport. The real numbers for a Geneva cross-border worker.",
    "replace": "Housing ×2 to ×3 in Geneva, staples 30-40% cheaper in France, LAMal or CMU: the 2026 frontalier balance, and the salary that makes it worth it."
  },
  {
    "slug": "cout-de-la-vie-suisse-france-frontalier-2026",
    "lang": "fr",
    "mechanism": "B1",
    "note": "nouvelle section « quel salaire compense », avant « Le vrai score »",
    "find": "## Le vrai score : combien te revient ta vie ?",
    "replace": "## Quel salaire genevois compense vraiment le coût de la vie suisse ? Le cas du célibataire logé côté France\n\nLogé côté France, un célibataire vit confortablement à partir d'environ 5 300 CHF net par mois, soit 90 000 CHF brut par an : son logement tout inclus reste sous 30 % de son net, et il lui reste 2 100 à 2 800 CHF une fois les dépenses courantes payées. En dessous, ça tient encore, mais la marge fond vite.\n\nPour le calcul, on a repris les postes de ce guide (courses optimisées côté France, santé, abonnement Léman Express, sorties) et le loyer d'une de nos chambres tout inclus côté France, 1 370 à 1 430 CHF par mois charges, fibre et ménage compris. Total : 2 510 à 3 180 CHF de dépenses par mois. Les salaires nets sont ceux de notre [grille des salaires suisses 2026](/blog/salaire-suisse-net-frontalier-2026), pour une personne seule sans enfant (barème A).\n\n| Salaire brut annuel (médiane du métier) | Net mensuel estimé | Logement tout inclus, en part du net | Reste après dépenses courantes |\n|---|---|---|---|\n| 72 000 CHF (métiers techniques, administratif) | ~4 400 CHF | 31 à 33 % | 1 200 à 1 900 CHF |\n| 90 000 CHF (santé non médicale) | ~5 300 CHF | 26 à 27 % | 2 100 à 2 800 CHF |\n| 102 000 CHF (ingénierie, IT) | ~5 950 CHF | 23 à 24 % | 2 750 à 3 450 CHF |\n\nLe seuil des 30 % est le repère classique : au-delà, le logement commence à rogner sur l'épargne. Avec une chambre tout inclus, tu passes sous ce seuil à partir de 4 600 à 4 800 CHF net par mois. Le même célibataire logé à Genève, dans un studio à 1 600 à 2 400 CHF hors charges, y consacrerait 30 à 45 % d'un net de 5 300 CHF.\n\nCe sont des ordres de grandeur : ton net réel dépend de ta caisse de pension et de ta situation, et ta fiche de paie fait foi.\n\n## Le vrai score : combien te revient ta vie ?"
  },
  {
    "slug": "cout-de-la-vie-suisse-france-frontalier-2026",
    "lang": "en",
    "mechanism": "B1",
    "note": "new \"what salary makes up for it\" section, before \"The real score\"",
    "find": "## The real score: what does your life cost?",
    "replace": "## What Geneva salary really makes up for the Swiss cost of living? A single person living on the French side\n\nLiving on the French side, a single person lives comfortably from about CHF 5,300 net a month, or CHF 90,000 gross a year: all-inclusive housing stays under 30% of net pay, and CHF 2,100 to 2,800 is left once everyday costs are paid. Below that it still works, but the margin shrinks fast.\n\nFor the maths, we took the items in this guide (groceries bought on the French side, healthcare, a Léman Express pass, going out) and the rent of one of our all-inclusive rooms on the French side, CHF 1,370 to 1,430 a month with bills, fibre and cleaning included. That's CHF 2,510 to 3,180 of spending a month. Net salaries come from our [2026 Swiss salary grid](/en/blog/salaire-suisse-net-frontalier-2026), for a single person with no children (tax scale A).\n\n| Gross annual salary (median for the role) | Estimated monthly net | All-inclusive housing, share of net | Left after everyday costs |\n|---|---|---|---|\n| CHF 72,000 (technical, admin) | ~CHF 4,400 | 31 to 33% | CHF 1,200 to 1,900 |\n| CHF 90,000 (healthcare, non-medical) | ~CHF 5,300 | 26 to 27% | CHF 2,100 to 2,800 |\n| CHF 102,000 (engineering, IT) | ~CHF 5,950 | 23 to 24% | CHF 2,750 to 3,450 |\n\nThe 30% line is the usual benchmark: above it, housing starts eating into your savings. With an all-inclusive room, you drop below it from CHF 4,600 to 4,800 net a month. The same person renting a studio in Geneva at CHF 1,600 to 2,400 before bills would spend 30 to 45% of a CHF 5,300 net on it.\n\nThese are ballpark figures: your real net depends on your pension fund and your situation, and your payslip has the final word.\n\n## The real score: what does your life cost?"
  },
  {
    "slug": "cout-de-la-vie-suisse-france-frontalier-2026",
    "lang": "fr",
    "mechanism": "B1",
    "note": "« Pour aller plus loin » : A1 et B8 (budget colocation y est déjà)",
    "find": "- [Quartiers d'Annemasse : où vivre selon ton profil](/blog/quartiers-annemasse-ou-vivre-selon-profil)",
    "replace": "- [Quartiers d'Annemasse : où vivre selon ton profil](/blog/quartiers-annemasse-ou-vivre-selon-profil)\n- [Où habiter en France quand on travaille à Genève ?](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)\n- [Vivre en France, travailler à Genève : le guide du frontalier](/blog/living-in-france-working-in-geneva)"
  },
  {
    "slug": "cout-de-la-vie-suisse-france-frontalier-2026",
    "lang": "en",
    "mechanism": "B1",
    "note": "\"Further reading\": A1 and B8 (flatshare budget already listed)",
    "find": "- [Annemasse neighbourhoods by profile](/en/blog/quartiers-annemasse-ou-vivre-selon-profil)",
    "replace": "- [Annemasse neighbourhoods by profile](/en/blog/quartiers-annemasse-ou-vivre-selon-profil)\n- [Where to live in France when you work in Geneva](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)\n- [Living in France, working in Geneva: the complete guide](/en/blog/living-in-france-working-in-geneva)"
  },
  {
    "slug": "cout-de-la-vie-suisse-france-frontalier-2026",
    "lang": "fr",
    "mechanism": "B1",
    "note": "date de mise à jour (nouvelle section)",
    "find": "*Article mis à jour 2026-06.",
    "replace": "*Article mis à jour 2026-11."
  },
  {
    "slug": "cout-de-la-vie-suisse-france-frontalier-2026",
    "lang": "en",
    "mechanism": "B1",
    "note": "update date (new section)",
    "find": "*Article updated 2026-06.",
    "replace": "*Article updated 2026-11."
  },
  {
    "slug": "cout-de-la-vie-suisse-france-frontalier-2026",
    "lang": "en",
    "mechanism": "CORRECTIF",
    "note": "lien « See available rooms » qui menait à la candidature",
    "find": "[See available rooms](/en/candidature)",
    "replace": "[See available rooms](/en/chambres-disponibles)"
  }
];

export function buildEdits() {
  return EDITS;
}
