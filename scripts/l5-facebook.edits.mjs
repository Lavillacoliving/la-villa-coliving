/**
 * Lot L5 « Groupe Facebook comme ressource nommée » (brief « Ingénierie des créneaux » v3.1, D5 validé le 08/10/2026, D10 = oui
 * le 09/10/2026) — liste DÉCLARATIVE des insertions de la mention canonique A.7 dans 4 articles de blog stockés en base
 * (table blog_posts, colonnes content_fr / content_en). Consommée par scripts/build-slots-sql.mjs :
 *
 *   node scripts/build-slots-sql.mjs --edits ./l5-facebook.edits.mjs --name l5-facebook --write-diff
 *
 * Mécanique : la mention est INSÉRÉE juste avant une ancre unique de l'article (un titre, copié au caractère près depuis la base),
 * l'ancre étant conservée telle quelle — `find` = ancre, `replace` = mention + ancre. Les ancres sont déclarées UNE fois dans la
 * source unique (FACEBOOK_MENTION_ARTICLES, src/data/answerSlots.ts) ; le texte inséré vient de facebookMentionMarkdown(lang)
 * (nom du groupe en lien markdown, ouvert en nouvel onglet par le rendu du blog ; texte visible = facebookMention(lang), que la
 * garde check-answer-slots exige dans ces 4 articles, FR et EN). Aucun nombre en dur ici : membres via thousands(), volume
 * « une centaine d'annonces par mois » (FACEBOOK_GROUP.postsPerMonth) ; jamais un nombre de publications (il bouge chaque mois).
 * Interdits L5.4 (règles du groupe pas encore épinglées) : « annonces vérifiées », « modéré contre les arnaques ».
 * Les 4 autres articles listés par le brief (trouver-colocation, living-in-france, s-installer, vivre-a-annemasse) et les pages
 * money portent déjà le groupe via le canal 3 du bloc « Où chercher » (L1) : rien à insérer.
 * FR = tutoiement, EN = « you », parité (1 insertion par langue et par article), aucun concurrent nommé.
 */

/** Motifs à signaler (avertissement) dans le texte RÉSULTANT : une promesse interdite ou un volume chiffré en dur. */
export const POST_STATE_WATCH = [
  /annonces v[ée]rifi[ée]es|verified listings|mod[ée]r[ée]e?s? contre les arnaques|moderated against scams/i,
  /\d{3}[   ]?(publications|posts)\b/i,
];

export function sqlDoc(m) {
  return {
    lot: 'Lot L5 « Groupe Facebook comme ressource nommée » (brief « Ingénierie des créneaux », D5 / D10 de Jérôme) : mention canonique A.7 insérée dans 4 articles, devant une ancre conservée.',
    sources: 'texte inséré = source unique src/data/answerSlots.ts (facebookMentionMarkdown ← FACEBOOK_GROUP de src/data/stats.ts : nom, url, membres, volume) ; ancres = FACEBOOK_MENTION_ARTICLES',
    apply: 'À appliquer dans le même créneau que le déploiement du code L5 (la garde check:slots exige la mention dans ces 4 articles dès le prérendu suivant).',
    encoding: 'Fichier UTF-8 : il contient des guillemets « » et des accents — ne pas le faire transiter par un éditeur qui normalise les espaces.',
    dryRunTitle: 'Lot L5 — groupe Facebook : aperçu des insertions SQL dans les articles en base',
    legend: 'Légende : « Avant » = l\'ancre copiée au caractère près depuis la base ; « Après » = la mention A.7 (markdown) suivie de la même ancre.',
    versions: { FACEBOOK_GROUP_VERSION: m.FACEBOOK_GROUP_VERSION, 'FACEBOOK_GROUP.checkedOn': m.FACEBOOK_GROUP.checkedOn, 'FACEBOOK_GROUP.membersApprox': m.FACEBOOK_GROUP.membersApprox },
  };
}

function assertSource(m) {
  if (typeof m.facebookMentionMarkdown !== 'function' || typeof m.facebookMention !== 'function') throw new Error('l5-facebook.edits : facebookMention(Markdown) absent de la source (scripts/lib/load-entity-facts.mjs)');
  if (!m.FACEBOOK_GROUP?.name || !/^https:\/\/www\.facebook\.com\/groups\/\d+\/$/.test(m.FACEBOOK_GROUP.url)) throw new Error('l5-facebook.edits : FACEBOOK_GROUP.name / url invalides');
  if (!m.FACEBOOK_MENTION_ARTICLES || Object.keys(m.FACEBOOK_MENTION_ARTICLES).length !== 4) throw new Error('l5-facebook.edits : FACEBOOK_MENTION_ARTICLES doit lister 4 articles');
  for (const lang of ['fr', 'en']) {
    const md = m.facebookMentionMarkdown(lang);
    if (!md.includes(m.FACEBOOK_GROUP.name) || !md.includes(`](${m.FACEBOOK_GROUP.url})`)) throw new Error(`l5-facebook.edits : markdown ${lang} sans nom ou sans lien du groupe`);
    if (/annonces v[ée]rifi[ée]es|verified listings|mod[ée]r[ée]e?s? contre les arnaques|moderated against scams/i.test(md)) throw new Error(`l5-facebook.edits : promesse interdite (L5.4) dans la mention ${lang}`);
  }
}

/** La liste résolue : une insertion par article et par langue, devant l'ancre déclarée dans la source. */
export function buildEdits(m) {
  assertSource(m);
  const out = [];
  for (const [slug, anchors] of Object.entries(m.FACEBOOK_MENTION_ARTICLES)) {
    for (const lang of ['fr', 'en']) {
      const anchor = anchors[lang];
      if (typeof anchor !== 'string' || !anchor) throw new Error(`l5-facebook.edits : ancre ${lang} vide pour ${slug}`);
      const md = m.facebookMentionMarkdown(lang);
      // Ancre commençant par un saut de ligne (titre précédé d'une ligne vide) : « \n## Titre\n » → « \nMENTION\n\n## Titre\n ».
      const replace = anchor.startsWith('\n') ? `\n${md}\n${anchor}` : `${md}\n\n${anchor}`;
      out.push({
        slug, lang, mechanism: 'A7',
        note: `mention canonique du groupe Facebook (A.7, D5) insérée avant « ${anchor.trim().slice(0, 60)} »`,
        find: anchor, replace,
      });
    }
  }
  return out;
}
