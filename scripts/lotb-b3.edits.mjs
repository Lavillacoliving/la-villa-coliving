/**
 * Brief « Genève profils » v2 du 30/10/2026 — B3, fusion de `avenant-fiscal-40-frontalier-geneve` dans `teletravail-frontalier-geneve-regles-2026`.
 * Deux sous-sections reprises de l'avenant (FR/EN), titre FR court (EN inchangé), lien vers la source ge.ch, A1 dans « À lire aussi »,
 * repointage des 8 liens des 4 autres articles. La dépublication de l'avenant et le 308 (vercel.json) sont dans la séance et la PR.
 *   node scripts/build-slots-sql.mjs --edits ./<ce fichier> --name <base> --date 2026-11-02 --write-diff
 */

export const POST_STATE_WATCH = [/\]\((\/en)?\/blog\/avenant-fiscal-40-frontalier-geneve\)/];

export function sqlDoc() {
  return {
    "lot": "B3 fusion avenant → télétravail : sous-sections, titre FR, liens repointés",
    "sources": "chaînes relevées sur la base vivante le 02/11/2026",
    "apply": "Après validation du diff par Jérôme (D-B0), dans la séance du lot B.",
    "encoding": "Fichier UTF-8 — ne pas normaliser les espaces.",
    "dryRunTitle": "Lot B — B3 fusion avenant → télétravail : aperçu SQL",
    "legend": "Légende : « Avant » = texte en base au 02/11 ; « Après » = texte proposé.",
    "versions": {}
  };
}

const EDITS = [
  {
    "slug": "teletravail-frontalier-geneve-regles-2026",
    "lang": "fr",
    "column": "title_fr",
    "mechanism": "B3",
    "note": "titre FR (version courte validée le 30/10) ; titre EN inchangé (position 5,5)",
    "find": "Télétravail frontalier 2026 : règle des 40 %",
    "replace": "Télétravail frontalier 2026 : 40 % fiscal, 49,9 % social"
  },
  {
    "slug": "teletravail-frontalier-geneve-regles-2026",
    "lang": "fr",
    "mechanism": "B3",
    "note": "le lien vers l'avenant (fondu ici) devient la source officielle ge.ch, avec la date de signature",
    "find": "C'est l'effet de l'[avenant à la convention fiscale franco-suisse](/blog/avenant-fiscal-40-frontalier-geneve), en vigueur",
    "replace": "C'est l'effet de l'[avenant à la convention fiscale franco-suisse](https://www.ge.ch/actualite/teletravail-personnes-frontalieres-entree-vigueur-avenant-convention-franco-suisse-29-07-2025), signé le 27 juin 2023, en vigueur"
  },
  {
    "slug": "teletravail-frontalier-geneve-regles-2026",
    "lang": "en",
    "mechanism": "B3",
    "note": "the link to the merged amendment article becomes the official ge.ch source, with the signing date",
    "find": "This comes from the [amendment to the Franco-Swiss tax treaty](/en/blog/avenant-fiscal-40-frontalier-geneve), in force",
    "replace": "This comes from the [amendment to the Franco-Swiss tax treaty](https://www.ge.ch/actualite/teletravail-personnes-frontalieres-entree-vigueur-avenant-convention-franco-suisse-29-07-2025), signed on 27 June 2023, in force"
  },
  {
    "slug": "teletravail-frontalier-geneve-regles-2026",
    "lang": "fr",
    "mechanism": "B3",
    "note": "deux sous-sections reprises de l'avenant, sous « Les deux seuils 2026 » (« fiscal et social » y est déjà : pas de troisième)",
    "find": "## L'impact fiscal du télétravail",
    "replace": "### Que se passe-t-il si je dépasse 40 % ?\n\nTu deviens imposable en France sur la part de salaire qui correspond à tes jours de télétravail, et ce dès le premier jour télétravaillé, pas seulement au-delà du seuil ([détail officiel — ge.ch](https://www.ge.ch/imposition-du-teletravail-personnes-frontalieres/au-dela-40-activite-teletravail)). Pour que tu ne paies pas deux fois, la convention franco-suisse applique un crédit d'impôt (article 25A). Ta déclaration se complique, sans plus. Si ton poste t'oblige à dépasser, fais-toi accompagner par un fiduciaire spécialisé en fiscalité transfrontalière ; les associations de frontaliers tiennent aussi des permanences pour la déclaration d'impôts, et on les liste dans [notre guide des ressources du frontalier](/blog/guide-ressources-frontalier-geneve).\n\n### Qu'est-ce que ça change pour ma déclaration ?\n\nSi tu restes sous 40 %, rien par rapport aux années précédentes : tu déclares tes revenus en France sur le formulaire 2047, et le crédit d'impôt neutralise l'impôt déjà prélevé en Suisse. La nouveauté est côté employeur : depuis le 1er janvier 2026, ton employeur suisse doit suivre tes jours de télétravail et de missions hors de Suisse, puis transmettre ton taux annuel à l'administration fiscale suisse (AFC) début 2027. Pour remplir le 2047 sans erreur, suis [notre pas-à-pas de la déclaration 2026](/blog/declaration-impots-frontalier-2026).\n\n## L'impact fiscal du télétravail"
  },
  {
    "slug": "teletravail-frontalier-geneve-regles-2026",
    "lang": "en",
    "mechanism": "B3",
    "note": "two subsections from the amendment article, under \"The two 2026 thresholds\" (\"tax vs social\" already there)",
    "find": "## The tax impact of remote work",
    "replace": "### What happens if I go over 40%?\n\nYou become taxable in France on the share of your salary that matches your telework days, from the very first teleworked day, not just beyond the threshold ([official detail — ge.ch](https://www.ge.ch/imposition-du-teletravail-personnes-frontalieres/au-dela-40-activite-teletravail)). So that you don't pay twice, the Franco-Swiss treaty applies a tax credit (article 25A). Your tax return gets more involved, nothing worse. If your job means going over, get help from a fiduciary who specialises in cross-border tax; cross-border workers' associations also run advice sessions on tax returns, and we list them in [our cross-border resources guide](/en/blog/guide-ressources-frontalier-geneve).\n\n### What does it change for my tax return?\n\nIf you stay under 40%, nothing compared with previous years: you declare your income in France on form 2047, and the tax credit offsets the tax already withheld in Switzerland. What's new is on the employer's side: since 1 January 2026, your Swiss employer must track your telework days and assignments outside Switzerland, then report your annual rate to the Swiss tax administration (AFC) in early 2027. To fill in form 2047 without mistakes, follow [our 2026 tax return walkthrough](/en/blog/declaration-impots-frontalier-2026).\n\n## The tax impact of remote work"
  },
  {
    "slug": "teletravail-frontalier-geneve-regles-2026",
    "lang": "fr",
    "mechanism": "B3",
    "note": "« À lire aussi » : A1 (profil 3, télétravail)",
    "find": "- [5 erreurs à éviter quand on cherche un logement frontalier](/blog/arnaques-logement-frontalier-geneve-eviter)",
    "replace": "- [5 erreurs à éviter quand on cherche un logement frontalier](/blog/arnaques-logement-frontalier-geneve-eviter)\n- [Où habiter en France quand on télétravaille deux jours par semaine](/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)"
  },
  {
    "slug": "teletravail-frontalier-geneve-regles-2026",
    "lang": "en",
    "mechanism": "B3",
    "note": "\"Also read\": A1 (profile 3, remote work)",
    "find": "- [5 mistakes to avoid when looking for cross-border housing](/en/blog/arnaques-logement-frontalier-geneve-eviter)",
    "replace": "- [5 mistakes to avoid when looking for cross-border housing](/en/blog/arnaques-logement-frontalier-geneve-eviter)\n- [Where to live in France if you work from home two days a week](/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve)"
  },
  {
    "slug": "declaration-impots-frontalier-2026",
    "lang": "fr",
    "mechanism": "B3-LIENS",
    "note": "puce « À lire aussi » repointée vers le télétravail",
    "find": "- [Avenant fiscal 40 % frontalier (2026)](/blog/avenant-fiscal-40-frontalier-geneve)",
    "replace": "- [Télétravail frontalier 2026 : 40 % fiscal, 49,9 % social](/blog/teletravail-frontalier-geneve-regles-2026)"
  },
  {
    "slug": "declaration-impots-frontalier-2026",
    "lang": "en",
    "mechanism": "B3-LIENS",
    "note": "\"Also read\" bullet repointed to remote work",
    "find": "- [The 40% Tax Rule: Cross-Border Work 2026](/en/blog/avenant-fiscal-40-frontalier-geneve)",
    "replace": "- [Remote Work for Cross-Border Workers: Rules & Limits 2026](/en/blog/teletravail-frontalier-geneve-regles-2026)"
  },
  {
    "slug": "fiscalite-frontalier-geneve-impots-2026",
    "lang": "fr",
    "mechanism": "B3-LIENS",
    "note": "lien de la règle des 40 % repointé",
    "find": "[le décryptage La Villa de l'avenant fiscal](/blog/avenant-fiscal-40-frontalier-geneve)",
    "replace": "[notre guide du télétravail frontalier](/blog/teletravail-frontalier-geneve-regles-2026)"
  },
  {
    "slug": "fiscalite-frontalier-geneve-impots-2026",
    "lang": "en",
    "mechanism": "B3-LIENS",
    "note": "40% rule link repointed",
    "find": "[La Villa's breakdown of the tax amendment](/en/blog/avenant-fiscal-40-frontalier-geneve)",
    "replace": "[our cross-border remote work guide](/en/blog/teletravail-frontalier-geneve-regles-2026)"
  },
  {
    "slug": "guide-ressources-frontalier-geneve",
    "lang": "fr",
    "mechanism": "B3-LIENS",
    "note": "deux liens (avenant + télétravail) fondus en un",
    "find": "[la déclaration pas à pas](/blog/declaration-impots-frontalier-2026), [l'avenant fiscal sur le télétravail](/blog/avenant-fiscal-40-frontalier-geneve) et [les règles 2026 du télétravail](/blog/teletravail-frontalier-geneve-regles-2026).",
    "replace": "[la déclaration pas à pas](/blog/declaration-impots-frontalier-2026) et [les règles 2026 du télétravail, avenant fiscal compris](/blog/teletravail-frontalier-geneve-regles-2026)."
  },
  {
    "slug": "guide-ressources-frontalier-geneve",
    "lang": "en",
    "mechanism": "B3-LIENS",
    "note": "two links merged into one; the line also had /blog/ instead of /en/blog/ (fixed)",
    "find": "> **Go further:** [Cross-border taxation in Geneva: 2026 rules](/blog/fiscalite-frontalier-geneve-impots-2026), [the return step by step](/blog/declaration-impots-frontalier-2026), [the remote-work tax addendum](/blog/avenant-fiscal-40-frontalier-geneve) and [the 2026 remote-work rules](/blog/teletravail-frontalier-geneve-regles-2026).",
    "replace": "> **Go further:** [Cross-border taxation in Geneva: 2026 rules](/en/blog/fiscalite-frontalier-geneve-impots-2026), [the return step by step](/en/blog/declaration-impots-frontalier-2026) and [the 2026 remote-work rules, tax amendment included](/en/blog/teletravail-frontalier-geneve-regles-2026)."
  },
  {
    "slug": "permis-g-frontalier-geneve",
    "lang": "fr",
    "mechanism": "B3-LIENS",
    "note": "lien repointé, ancre inchangée",
    "find": "selon [l'avenant franco-suisse](/blog/avenant-fiscal-40-frontalier-geneve)",
    "replace": "selon [l'avenant franco-suisse](/blog/teletravail-frontalier-geneve-regles-2026)"
  },
  {
    "slug": "permis-g-frontalier-geneve",
    "lang": "en",
    "mechanism": "B3-LIENS",
    "note": "link repointed, anchor unchanged",
    "find": "under [the Franco-Swiss amendment](/en/blog/avenant-fiscal-40-frontalier-geneve)",
    "replace": "under [the Franco-Swiss amendment](/en/blog/teletravail-frontalier-geneve-regles-2026)"
  }
];

export function buildEdits() {
  return EDITS;
}
