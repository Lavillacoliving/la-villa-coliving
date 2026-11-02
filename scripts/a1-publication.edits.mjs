/**
 * Brief « Genève profils » v2 du 30/10/2026 — publication d'A1 (`ou-habiter-en-france-quand-on-travaille-a-geneve`) : liste DÉCLARATIVE pour
 * scripts/build-slots-sql.mjs (méthode du 13/10) :
 *   node scripts/build-slots-sql.mjs --edits ./a1-publication.edits.mjs --name a1-publication-liens --date 2026-11-02 --write-diff
 *  - D-S6 (retour) : A3 retrouve ses deux liens par langue vers A1 (phrase du J-60, puce de « Pour aller plus loin »), retirés le 30/10
 *    parce qu'A1 n'était pas publié.
 *  - LIENS : liens entrants demandés par le brief (§3 A1) : quartiers Annemasse, vivre à Annemasse, temps de trajet, s'installer, budget colocation, trouver une colocation, guide ressources
 *    (section logement), B8. Ancres variées (règle du Plan Autorité) : deux seulement reprennent le titre exact d'A1.
 *    « villes » retirée le 02/11 : l'article a été réécrit par une autre session le jour même ; son lien vers A1 passera par ses fichiers.
 * ORDRE : ce SQL APRÈS le SQL de publication d'A1 (maj-article-ou-habiter-en-france-quand-on-travaille-a-geneve-<date>.sql), dans la même
 * séance : aucun lien ne doit viser A1 tant qu'il n'est pas publié.
 */

export const POST_STATE_WATCH = [/\]\(\/blog\/ou-habiter-en-france-quand-on-travaille-a-geneve\)[^\n]*\]\(\/blog\/ou-habiter-en-france-quand-on-travaille-a-geneve\)/];

export function sqlDoc() {
  return {
    lot: 'Publication d\'A1 (brief « Genève profils » du 30/10/2026) : liens entrants vers A1 (quartiers, vivre à Annemasse, temps de trajet, s\'installer, budget, trouver une colocation, guide ressources, B8) et retour des liens d\'A3 (D-S6).',
    sources: 'chaînes relevées sur la base vivante le 02/11',
    apply: 'APRÈS le SQL de publication d\'A1 (maj-article-ou-habiter-en-france-quand-on-travaille-a-geneve-<date>.sql), dans la même séance, sur feu vert de Jérôme.',
    encoding: 'Fichier UTF-8 — ne pas normaliser les espaces.',
    dryRunTitle: 'Publication d\'A1 — liens entrants : aperçu SQL',
    legend: 'Légende : « Avant » = texte en base au 02/11 ; « Après » = texte proposé. D-S6 = retour des liens d\'A3 ; LIENS = liens entrants du brief.',
    versions: {},
  };
}

const A1_FR = '/blog/ou-habiter-en-france-quand-on-travaille-a-geneve';
const A1_EN = '/en/blog/ou-habiter-en-france-quand-on-travaille-a-geneve';

const EDITS = [
  // ── A3 : retour des liens (D-S6) ─────────────────────────────────────────────────────────────
  {
    slug: 'trouver-logement-avant-d-arriver-geneve',
    lang: 'fr',
    mechanism: 'D-S6',
    note: 'A3 · phrase du J-60 : le lien vers A1 revient à côté de « villes »',
    find: "[Les villes côté France, comparées](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) donnent la liste commune par commune, avec les trajets et les loyers.",
    replace: `Notre guide [où habiter côté France, profil par profil](${A1_FR}) part de là, et [les villes côté France, comparées](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) donnent la liste commune par commune, avec les trajets et les loyers.`,
  },
  {
    slug: 'trouver-logement-avant-d-arriver-geneve',
    lang: 'en',
    mechanism: 'D-S6',
    note: 'A3 · D-60 sentence: the link to A1 comes back next to "towns"',
    find: "[The French towns near Geneva, compared](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) give you the list town by town, with commutes and rents.",
    replace: `Our guide to [where to live in France, profile by profile](${A1_EN}) starts from there, and [the French towns near Geneva, compared](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher) give you the list town by town, with commutes and rents.`,
  },
  {
    slug: 'trouver-logement-avant-d-arriver-geneve',
    lang: 'fr',
    mechanism: 'D-S6',
    note: 'A3 · « Pour aller plus loin » : la puce A1 revient en tête',
    find: "- [Les villes côté France pour les frontaliers](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)",
    replace: `- [Où habiter en France quand on travaille à Genève ?](${A1_FR})\n- [Les villes côté France pour les frontaliers](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)`,
  },
  {
    slug: 'trouver-logement-avant-d-arriver-geneve',
    lang: 'en',
    mechanism: 'D-S6',
    note: 'A3 · "Further reading": the A1 bullet comes back first',
    find: "- [French towns near Geneva for cross-border workers](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)",
    replace: `- [Where to live in France when you work in Geneva](${A1_EN})\n- [French towns near Geneva for cross-border workers](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)`,
  },
  // ── Villes : aucun lien ici (02/11). « villes » a été réécrite le 02/11 par une autre session (branche
  //    content/ou-habiter-villes-frontalieres) : son lien vers A1 entre par ses fichiers source, pas par cette liste.
  // ── Quartiers Annemasse ─────────────────────────────────────────────────────────────────────
  {
    slug: 'quartiers-annemasse-ou-vivre-selon-profil',
    lang: 'fr',
    mechanism: 'LIENS',
    note: 'quartiers · puce A1 dans « Pour aller plus loin »',
    find: "- [Où habiter en frontalier : villes françaises abordables](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)",
    replace: `- [Où habiter en frontalier : villes françaises abordables](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)\n- [Où habiter côté France selon ton profil](${A1_FR})`,
  },
  {
    slug: 'quartiers-annemasse-ou-vivre-selon-profil',
    lang: 'en',
    mechanism: 'LIENS',
    note: 'neighbourhoods · no "Further reading" in EN: one sentence at the end of the first "In short" paragraph',
    find: "In Annemasse, you don't pick a neighbourhood in the abstract but **by profile**: align your home with your real daily commute, and the agglo becomes an asset rather than a constraint.",
    replace: `In Annemasse, you don't pick a neighbourhood in the abstract but **by profile**: align your home with your real daily commute, and the agglo becomes an asset rather than a constraint. Still deciding between Annemasse, Ferney-Voltaire and Saint-Julien? [Where to live in France when you work in Geneva](${A1_EN}) goes through it profile by profile.`,
  },
  // ── Vivre à Annemasse ───────────────────────────────────────────────────────────────────────
  {
    slug: 'vivre-a-annemasse-quand-on-travaille-a-geneve',
    lang: 'fr',
    mechanism: 'LIENS',
    note: 'vivre à Annemasse · « Quand ce n\'est pas le bon choix » : le cas Nations / CERN renvoie à A1',
    find: "Pour élargir le rayon, lis [où habiter côté France quand on travaille en Suisse](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).",
    replace: `Si tu travailles aux Nations ou au CERN, Annemasse est de l'autre côté de Genève : [notre guide pour choisir où habiter selon ton lieu de travail](${A1_FR}) t'oriente plutôt vers Ferney-Voltaire et le Pays de Gex. Pour élargir le rayon, lis [où habiter côté France quand on travaille en Suisse](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).`,
  },
  {
    slug: 'vivre-a-annemasse-quand-on-travaille-a-geneve',
    lang: 'en',
    mechanism: 'LIENS',
    note: 'living in Annemasse · "When it is not the right choice": the UN / CERN case points to A1',
    find: "To widen the radius, read [where to live on the French side when you work in Switzerland](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).",
    replace: `If you work in the UN district or at CERN, Annemasse is on the other side of Geneva: [our guide to choosing where to live by workplace](${A1_EN}) points you to Ferney-Voltaire and the Pays de Gex instead. To widen the radius, read [where to live on the French side when you work in Switzerland](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).`,
  },
  // ── Temps de trajet ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'temps-trajet-annemasse-geneve-par-quartier',
    lang: 'fr',
    mechanism: 'LIENS',
    note: 'temps de trajet · « Quel logement choisir selon ton lieu de travail ? » : renvoi vers A1 avant l\'Observatoire',
    find: "Avant de choisir ton quartier, jette un œil à l'[Observatoire du logement frontalier](/observatoire-logement-frontalier-geneve)",
    replace: `Si ton poste est aux Nations, à l'aéroport ou au CERN, regarde aussi de l'autre côté de Genève : [notre guide pour choisir ta commune selon ton poste](${A1_FR}) compare Ferney-Voltaire et le Pays de Gex au corridor d'Annemasse, profil par profil.\n\nAvant de choisir ton quartier, jette un œil à l'[Observatoire du logement frontalier](/observatoire-logement-frontalier-geneve)`,
  },
  {
    slug: 'temps-trajet-annemasse-geneve-par-quartier',
    lang: 'en',
    mechanism: 'LIENS',
    note: 'commuting times · "Which housing to choose based on your workplace?": pointer to A1 before the Observatory',
    find: "Before picking your neighborhood, check the [Cross-border Housing Observatory](/en/observatoire-logement-frontalier-geneve)",
    replace: `If your job is in the UN district, at the airport or at CERN, look at the other side of Geneva too: [our guide to choosing your town by workplace](${A1_EN}) compares Ferney-Voltaire and the Pays de Gex with the Annemasse corridor, profile by profile.\n\nBefore picking your neighborhood, check the [Cross-border Housing Observatory](/en/observatoire-logement-frontalier-geneve)`,
  },
  // ── S'installer côté Suisse ou côté France ──────────────────────────────────────────────────
  {
    slug: 's-installer-a-geneve-expatrie-cote-suisse-ou-cote-france',
    lang: 'fr',
    mechanism: 'LIENS',
    note: 's\'installer · après le tableau Suisse / France : la colonne « France » mène à A1',
    find: "Lecture rapide : citoyen de l'UE, célibataire, délai court, la colonne de droite marche dès la première semaine ; arrivée de l'extérieur de l'Europe ou famille, la colonne de gauche est ton point de départ.",
    replace: `Lecture rapide : citoyen de l'UE, célibataire, délai court, la colonne de droite marche dès la première semaine ; arrivée de l'extérieur de l'Europe ou famille, la colonne de gauche est ton point de départ. Si c'est la colonne de droite, [le choix de la commune côté France, profil par profil](${A1_FR}) est l'étape suivante.`,
  },
  {
    slug: 's-installer-a-geneve-expatrie-cote-suisse-ou-cote-france',
    lang: 'en',
    mechanism: 'LIENS',
    note: 'moving to Geneva · after the Switzerland / France table: the "France" column leads to A1',
    find: "Quick read: EU citizen, single, short timeline, the right-hand column works from the first week; arriving from outside Europe or as a family, the left-hand column is your starting point.",
    replace: `Quick read: EU citizen, single, short timeline, the right-hand column works from the first week; arriving from outside Europe or as a family, the left-hand column is your starting point. If it's the right-hand column, [choosing your French town, profile by profile](${A1_EN}) is the next step.`,
  },
  // ── Budget colocation (B2 ajoutera A3) ──────────────────────────────────────────────────────
  {
    slug: 'budget-colocation-geneve-guide-complet',
    lang: 'fr',
    mechanism: 'LIENS',
    note: 'budget · puce A1 dans « À lire aussi »',
    find: "- [Coliving vs colocation : quelles différences ?](/blog/coliving-colocation-ou-studio-geneve-comparatif)",
    replace: `- [Coliving vs colocation : quelles différences ?](/blog/coliving-colocation-ou-studio-geneve-comparatif)\n- [Où habiter en France quand on travaille à Genève ?](${A1_FR})`,
  },
  {
    slug: 'budget-colocation-geneve-guide-complet',
    lang: 'en',
    mechanism: 'LIENS',
    note: 'budget · A1 bullet in "Also read"',
    find: "- [Coliving vs flatshare: what's the difference?](/en/blog/coliving-colocation-ou-studio-geneve-comparatif)",
    replace: `- [Coliving vs flatshare: what's the difference?](/en/blog/coliving-colocation-ou-studio-geneve-comparatif)\n- [Where to live in France when you work in Geneva](${A1_EN})`,
  },
  // ── Trouver une colocation ──────────────────────────────────────────────────────────────────
  {
    slug: 'trouver-colocation-geneve-frontalier',
    lang: 'fr',
    mechanism: 'LIENS',
    note: 'trouver une colocation · puce A1 dans « À lire aussi », après « villes »',
    find: "- [Les meilleurs quartiers frontaliers de Genève](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)",
    replace: `- [Les meilleurs quartiers frontaliers de Genève](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)\n- [Où habiter selon ton lieu de travail à Genève](${A1_FR})`,
  },
  {
    slug: 'trouver-colocation-geneve-frontalier',
    lang: 'en',
    mechanism: 'LIENS',
    note: 'finding a flatshare · A1 bullet in "Also read", after "towns"',
    find: "- [The best cross-border neighborhoods near Geneva](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)",
    replace: `- [The best cross-border neighborhoods near Geneva](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)\n- [Where to live depending on where you work in Geneva](${A1_EN})`,
  },
  // ── Guide ressources (section logement) ─────────────────────────────────────────────────────
  {
    slug: 'guide-ressources-frontalier-geneve',
    lang: 'fr',
    mechanism: 'LIENS',
    note: 'guide ressources · « La carte des loyers, commune par commune » (chapitre logement)',
    find: "— un arbitrage souvent gagnant.",
    replace: `— un arbitrage souvent gagnant. Pour choisir la commune elle-même selon ton lieu de travail, ta voiture et ta durée de séjour, [le guide par profil pour choisir ta commune](${A1_FR}) prend le relais.`,
  },
  {
    slug: 'guide-ressources-frontalier-geneve',
    lang: 'en',
    mechanism: 'LIENS',
    note: 'resource guide · "The rent map, municipality by municipality" (housing chapter)',
    find: "— an arbitrage that often pays off.",
    replace: `— an arbitrage that often pays off. To choose the town itself based on where you work, whether you drive and how long you're staying, [our profile-by-profile guide to choosing your town](${A1_EN}) takes it from there.`,
  },
  // ── B8, page pilier ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'living-in-france-working-in-geneva',
    lang: 'fr',
    mechanism: 'LIENS',
    note: 'B8 · « Où vivre ? » : la recommandation renvoie à A1 pour les autres profils',
    find: "vise Annemasse, Ambilly ou Ville-la-Grand, près d'une gare ou d'un arrêt de tram.",
    replace: `vise Annemasse, Ambilly ou Ville-la-Grand, près d'une gare ou d'un arrêt de tram. Pour un poste aux Nations, à l'aéroport ou au CERN, ou si tu as une voiture, [où habiter selon ton profil](${A1_FR}) détaille les autres options.`,
  },
  {
    slug: 'living-in-france-working-in-geneva',
    lang: 'en',
    mechanism: 'LIENS',
    note: 'B8 · "Where to live?": the recommendation points to A1 for the other profiles',
    find: "aim for Annemasse, Ambilly or Ville-la-Grand, close to a station or a tram stop.",
    replace: `aim for Annemasse, Ambilly or Ville-la-Grand, close to a station or a tram stop. For a job in the UN district, at the airport or at CERN, or if you drive, [where to live by profile](${A1_EN}) covers the other options.`,
  },
];

export function buildEdits() {
  return EDITS.map((e) => ({ ...e }));
}
