/**
 * Article « Non, La Villa Coliving n'est pas une arnaque » (brief v2 du 15/10/2026) — décision Q1 de Jérôme du 16/10/2026 :
 * la section « arnaques » du nouvel article est courte et renvoie au guide complet ; le guide renvoie à son tour vers
 * l'article de vérification. Liste DÉCLARATIVE consommée par scripts/build-slots-sql.mjs :
 *
 *   node scripts/build-slots-sql.mjs --edits ./cest-reel-lien-retour.edits.mjs --name cest-reel-lien-retour --date 2026-10-16 --write-diff
 *
 * Mécanique : une phrase AJOUTÉE (FR et EN) juste après la phrase de preuves de « L'alternative sécurisée : le coliving »
 * (texte copié depuis la base le 16/10/2026), avec un lien vers l'URL de l'article (jamais vers l'URL courte /cest-reel,
 * qui est une redirection). Le texte existant n'est pas modifié.
 *
 * ⚠️ À appliquer APRÈS le SQL de publication du nouvel article (scripts/nouvel-article-…-arnaque.sql puis --publish), dans la
 * même séance que la fusion du code : sinon le lien pointe vers une page encore en brouillon (404 public).
 */

const SLUG = 'arnaques-logement-frontalier-geneve-eviter';
const TARGET = 'non-la-villa-coliving-nest-pas-une-arnaque';

const ANCHOR = {
  fr: "Nous sommes une entreprise établie depuis 2021, avec des dizaines d'avis Google vérifiables et une adresse physique que tu peux visiter.",
  en: "We're an established company since 2021, with dozens of verifiable Google reviews and a physical address you can visit.",
};
const ADDED = {
  fr: ` Et pour le vérifier par toi-même en trente secondes : [comment vérifier qu'on existe](/blog/${TARGET}).`,
  en: ` And to check it for yourself in thirty seconds: [how to check we're real](/en/blog/${TARGET}).`,
};

export function buildEdits() {
  return ['fr', 'en'].map((lang) => ({
    slug: SLUG,
    lang,
    column: `content_${lang}`,
    mechanism: 'ajout de phrase',
    note: "Q1 (16/10/2026) — lien retour du guide « arnaques » vers l'article « C'est réel ? »",
    find: ANCHOR[lang],
    replace: ANCHOR[lang] + ADDED[lang],
  }));
}

export function sqlDoc() {
  return {
    lot: "Article « C'est réel ? » (brief v2 du 15/10/2026, décision Q1 de Jérôme du 16/10/2026) : lien retour du guide « arnaques » vers l'article de vérification (FR + EN).",
    sources: "ancre = phrase de preuves de « L'alternative sécurisée : le coliving » / « The Secure Alternative: Coliving », copiée depuis la base le 16/10/2026",
    apply: "APRÈS la publication de l'article non-la-villa-coliving-nest-pas-une-arnaque (sinon lien vers un brouillon), dans la même séance que la fusion du code.",
    encoding: 'Fichier UTF-8 (guillemets, accents) — ne pas normaliser.',
    dryRunTitle: "Article « C'est réel ? » — lien retour depuis le guide « arnaques » (aperçu SQL du 16/10/2026)",
    legend: "Légende : « Avant » = texte en base au 16/10/2026 ; « Après » = même phrase + phrase ajoutée avec le lien.",
    versions: {},
  };
}
