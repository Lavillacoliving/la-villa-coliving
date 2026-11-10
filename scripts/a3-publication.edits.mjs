/**
 * Brief « Genève profils » v2 du 30/10/2026 — publication d'A3 (`trouver-logement-avant-d-arriver-geneve`) : liste DÉCLARATIVE pour
 * scripts/build-slots-sql.mjs (méthode du 13/10) :
 *   node scripts/build-slots-sql.mjs --edits ./a3-publication.edits.mjs --name a3-publication-liens --date 2026-10-30 --write-diff
 *  - ANCRES (D-A3b, recommandation validée le 30/10) : les 12 ancres « Arriver seul à Genève… » et « la checklist déménagement de
 *    La Villa » vers `demenager-geneve-frontalier-checklist` (fondu dans A3) sont réécrites ET repointées vers A3 ; dans organisations-internationales, les
 *    deux puces vers la checklist deviennent une seule puce vers A3. Les 3 autres liens vers la checklist (living-in-france FR,
 *    quitter-son-logement FR/EN : ancres « checklist », toujours justes) sont repointés par la consolidation du SQL de publication.
 *  - LIENS : liens entrants demandés par le brief (permis G, s'installer, arnaques, guide ressources), une phrase par langue.
 * ORDRE : ce SQL AVANT scripts/maj-article-trouver-logement-avant-d-arriver-geneve-<date>.sql (publication + consolidation), dans la même séance
 * (ses ancres « find » contiennent l'ancienne URL, que la consolidation réécrit).
 */

export const POST_STATE_WATCH = [/Arriv(er|ing) (seul|alone)[^\]]*\]\(\/(en\/)?blog\/trouver-logement-avant-d-arriver-geneve/];

export function sqlDoc() {
  return {
    lot: 'Publication d\'A3 (brief « Genève profils » du 30/10/2026) : ancres D-A3b réécrites vers A3 et liens entrants (permis G, s\'installer, arnaques, guide ressources).',
    sources: 'chaînes relevées sur la base vivante le 30/10',
    apply: 'AVANT le SQL de publication d\'A3 (maj-article-trouver-logement-avant-d-arriver-geneve-<date>.sql), dans la même séance, sur feu vert de Jérôme.',
    encoding: 'Fichier UTF-8 — ne pas normaliser les espaces.',
    dryRunTitle: 'Publication d\'A3 — ancres et liens entrants : aperçu SQL',
    legend: 'Légende : « Avant » = texte en base au 30/10 ; « Après » = texte proposé. ANCRES = D-A3b ; LIENS = liens entrants du brief.',
    versions: {},
  };
}

const EDITS = [
  {
    "slug": "banque-telephone-internet-frontalier-bons-plans",
    "lang": "fr",
    "mechanism": "ANCRES",
    "note": "D-A3b · ancre « Arriver seul… » → titre d'A3 (l'ancienne cible est fondue dans A3)",
    "find": "- [Arriver seul à Genève : le guide 30 jours](/blog/demenager-geneve-frontalier-checklist)",
    "replace": "- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)"
  },
  {
    "slug": "banque-telephone-internet-frontalier-bons-plans",
    "lang": "en",
    "mechanism": "ANCRES",
    "note": "D-A3b · \"Arriving alone…\" anchor → A3 title (the old target is merged into A3)",
    "find": "- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)",
    "replace": "- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)"
  },
  {
    "slug": "choc-culturel-franco-suisse-expatrie-geneve",
    "lang": "fr",
    "mechanism": "ANCRES",
    "note": "D-A3b · ancre « Arriver seul… » → titre d'A3 (l'ancienne cible est fondue dans A3)",
    "find": "- [Arriver seul à Genève : le guide 30 jours](/blog/demenager-geneve-frontalier-checklist)",
    "replace": "- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)"
  },
  {
    "slug": "choc-culturel-franco-suisse-expatrie-geneve",
    "lang": "en",
    "mechanism": "ANCRES",
    "note": "D-A3b · \"Arriving alone…\" anchor → A3 title (the old target is merged into A3)",
    "find": "- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)",
    "replace": "- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)"
  },
  {
    "slug": "dossier-location-frontalier-suisse-france",
    "lang": "fr",
    "mechanism": "ANCRES",
    "note": "D-A3b · ancre « Arriver seul… » → titre d'A3 (l'ancienne cible est fondue dans A3)",
    "find": "- [Arriver seul à Genève : le guide des 30 premiers jours](/blog/demenager-geneve-frontalier-checklist)",
    "replace": "- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)"
  },
  {
    "slug": "dossier-location-frontalier-suisse-france",
    "lang": "en",
    "mechanism": "ANCRES",
    "note": "D-A3b · \"Arriving alone…\" anchor → A3 title (the old target is merged into A3)",
    "find": "- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)",
    "replace": "- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)"
  },
  {
    "slug": "se-faire-reseau-geneve-arriver-seul",
    "lang": "fr",
    "mechanism": "ANCRES",
    "note": "D-A3b · ancre « Arriver seul… » → titre d'A3 (l'ancienne cible est fondue dans A3)",
    "find": "- [Arriver seul à Genève : le guide 30 jours](/blog/demenager-geneve-frontalier-checklist)",
    "replace": "- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)"
  },
  {
    "slug": "se-faire-reseau-geneve-arriver-seul",
    "lang": "en",
    "mechanism": "ANCRES",
    "note": "D-A3b · \"Arriving alone…\" anchor → A3 title (the old target is merged into A3)",
    "find": "- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)",
    "replace": "- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)"
  },
  {
    "slug": "vie-quotidienne-frontalier-courses-sport-sorties",
    "lang": "fr",
    "mechanism": "ANCRES",
    "note": "D-A3b · ancre « Arriver seul… » → titre d'A3 (l'ancienne cible est fondue dans A3)",
    "find": "- [Arriver seul à Genève : le guide 30 jours](/blog/demenager-geneve-frontalier-checklist)",
    "replace": "- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)"
  },
  {
    "slug": "vie-quotidienne-frontalier-courses-sport-sorties",
    "lang": "en",
    "mechanism": "ANCRES",
    "note": "D-A3b · \"Arriving alone…\" anchor → A3 title (the old target is merged into A3)",
    "find": "- [Arriving alone in Geneva: the 30-day guide](/en/blog/demenager-geneve-frontalier-checklist)",
    "replace": "- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)"
  },
  {
    "slug": "organisations-internationales-geneve-ou-habiter",
    "lang": "fr",
    "mechanism": "ANCRES",
    "note": "D-A3b · deux puces vers la checklist (« Arriver seul… », « Déménager… ») → une seule puce vers A3 (sinon doublon après consolidation)",
    "find": "- [Arriver seul à Genève : les 30 premiers jours](/blog/demenager-geneve-frontalier-checklist)\n- [Déménager près de Genève : la checklist complète](/blog/demenager-geneve-frontalier-checklist)",
    "replace": "- [Se loger côté France avant d'arriver à Genève](/blog/trouver-logement-avant-d-arriver-geneve)"
  },
  {
    "slug": "organisations-internationales-geneve-ou-habiter",
    "lang": "en",
    "mechanism": "ANCRES",
    "note": "D-A3b · two bullets to the checklist → one bullet to A3 (otherwise a duplicate after consolidation)",
    "find": "- [Arriving alone in Geneva: the first 30 days](/en/blog/demenager-geneve-frontalier-checklist)\n- [Moving near Geneva: the complete checklist](/en/blog/demenager-geneve-frontalier-checklist)",
    "replace": "- [Moving to Geneva? Find housing in France first](/en/blog/trouver-logement-avant-d-arriver-geneve)"
  },
  {
    "slug": "ou-habiter-frontalier-suisse-villes-france-pas-cher",
    "lang": "fr",
    "mechanism": "ANCRES",
    "note": "D-A3b · « la checklist déménagement de La Villa » → ancre descriptive d'A3",
    "find": "Une fois ta ville choisie, [la checklist déménagement de La Villa](/blog/demenager-geneve-frontalier-checklist) t'évite d'oublier une démarche.",
    "replace": "Une fois ta ville choisie, [le calendrier pour te loger côté France avant d'arriver](/blog/trouver-logement-avant-d-arriver-geneve) t'évite d'oublier une étape."
  },
  {
    "slug": "ou-habiter-frontalier-suisse-villes-france-pas-cher",
    "lang": "en",
    "mechanism": "ANCRES",
    "note": "D-A3b · \"La Villa's moving checklist\" → descriptive anchor to A3",
    "find": "Once you've picked your town, [La Villa's moving checklist](/en/blog/demenager-geneve-frontalier-checklist) makes sure you don't miss a step.",
    "replace": "Once you've picked your town, [our countdown to finding housing in France before you arrive](/en/blog/trouver-logement-avant-d-arriver-geneve) makes sure you don't miss a step."
  },
  {
    "slug": "permis-g-frontalier-geneve",
    "lang": "fr",
    "mechanism": "LIENS",
    "note": "lien entrant vers A3 à la fin de « Permis G et logement »",
    "find": "Découvre [nos maisons](/nos-maisons).\n\n## En résumé",
    "replace": "Découvre [nos maisons](/nos-maisons).\n\nSi tu n'as pas encore de logement et que tu ne peux pas visiter avant d'arriver, [notre calendrier de J-60 au jour J](/blog/trouver-logement-avant-d-arriver-geneve) te dit quoi faire et quand.\n\n## En résumé"
  },
  {
    "slug": "permis-g-frontalier-geneve",
    "lang": "en",
    "mechanism": "LIENS",
    "note": "inbound link to A3 at the end of \"Permis G and housing\"",
    "find": "Discover [our houses](/en/nos-maisons).\n\n## In short",
    "replace": "Discover [our houses](/en/nos-maisons).\n\nIf you don't have a place yet and can't view before you arrive, [our countdown from D-60 to day 0](/en/blog/trouver-logement-avant-d-arriver-geneve) tells you what to do and when.\n\n## In short"
  },
  {
    "slug": "s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france",
    "lang": "fr",
    "mechanism": "LIENS",
    "note": "lien entrant vers A3 dans « Semaine 1, avant même d'arriver »",
    "find": "Si c'est la France voisine, tu envoies deux ou trois candidatures et tu demandes une visite en visio.",
    "replace": "Si c'est la France voisine, tu envoies deux ou trois candidatures et tu demandes une visite en visio. Si tu as deux mois devant toi, [le calendrier pour te loger côté France avant d'arriver](/blog/trouver-logement-avant-d-arriver-geneve) commence à J-60."
  },
  {
    "slug": "s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france",
    "lang": "en",
    "mechanism": "LIENS",
    "note": "inbound link to A3 in \"Week 1, before you even arrive\"",
    "find": "If it is the French side, you send two or three applications and ask for a video visit.",
    "replace": "If it is the French side, you send two or three applications and ask for a video visit. If you have two months ahead of you, [our countdown to finding housing in France before you arrive](/en/blog/trouver-logement-avant-d-arriver-geneve) starts at D-60."
  },
  {
    "slug": "arnaques-logement-frontalier-geneve-eviter",
    "lang": "fr",
    "mechanism": "LIENS",
    "note": "lien entrant vers A3 à la fin de « L'arnaque n°1 : le faux propriétaire à distance »",
    "find": "Un vrai propriétaire comprendra la démarche.\n\n## L'arnaque n°2",
    "replace": "Un vrai propriétaire comprendra la démarche.\n\nSi tu cherches à distance, [notre calendrier pour te loger côté France avant d'arriver](/blog/trouver-logement-avant-d-arriver-geneve) place ces vérifications au bon moment, avant de verser quoi que ce soit.\n\n## L'arnaque n°2"
  },
  {
    "slug": "arnaques-logement-frontalier-geneve-eviter",
    "lang": "en",
    "mechanism": "LIENS",
    "note": "inbound link to A3 at the end of \"Scam #1\"",
    "find": "A real landlord will understand the request.\n\n## Scam #2",
    "replace": "A real landlord will understand the request.\n\nIf you're searching from a distance, [our countdown to finding housing in France before you arrive](/en/blog/trouver-logement-avant-d-arriver-geneve) puts these checks at the right point, before you pay anything.\n\n## Scam #2"
  },
  {
    "slug": "guide-ressources-frontalier-geneve",
    "lang": "fr",
    "mechanism": "LIENS",
    "note": "lien entrant vers A3 dans « Le bon timing, et l'état des lieux » (section logement)",
    "find": "**juin-août** offre plus de choix mais aux prix les plus hauts.",
    "replace": "**juin-août** offre plus de choix mais aux prix les plus hauts. Si tu arrives d'ailleurs, [le calendrier pour te loger côté France avant d'arriver](/blog/trouver-logement-avant-d-arriver-geneve) cale chaque étape de J-60 au jour J."
  },
  {
    "slug": "guide-ressources-frontalier-geneve",
    "lang": "en",
    "mechanism": "LIENS",
    "note": "inbound link to A3 in \"The right timing, and the inventory\" (housing section)",
    "find": "**June-August** offers more choice but at the highest prices.",
    "replace": "**June-August** offers more choice but at the highest prices. If you're moving from elsewhere, [our countdown to finding housing in France before you arrive](/en/blog/trouver-logement-avant-d-arriver-geneve) sets out each step from D-60 to day 0."
  }
];

export function buildEdits() {
  return EDITS.map((e) => ({ ...e }));
}
