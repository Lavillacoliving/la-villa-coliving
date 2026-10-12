/**
 * C3 bis (12/10/2026) — Jérôme n'épingle pas les règles du groupe (« 1. non ») : le site ne doit pas dire « règles épinglées ».
 * La mention canonique A.7 des 4 articles en base passe de « … : règles épinglées, annonces douteuses retirées. » à
 * « … : règles publiées, annonces douteuses retirées. » (EN « pinned rules » → « published rules »). Même mécanique que
 * scripts/l5b-facebook-rules.edits.mjs : l'ancienne mention est reconstruite depuis la nouvelle (facebookMentionMarkdown de la
 * source) en remplaçant la fin de phrase ; le générateur exige 1 occurrence de l'ancienne et 0 de la nouvelle.
 *
 *   node scripts/build-slots-sql.mjs --edits ./c3b-facebook-wording.edits.mjs --name c3b-facebook-wording --date 2026-10-12 --write-diff
 */
const OLD_TAIL = { fr: 'règles épinglées, annonces douteuses retirées.', en: 'pinned rules, suspicious listings removed.' };
const NEW_TAIL = { fr: 'règles publiées, annonces douteuses retirées.', en: 'published rules, suspicious listings removed.' };

export const POST_STATE_WATCH = [/annonces v[ée]rifi[ée]es|verified listings/i, /épinglées|pinned/i];

export function sqlDoc(m) {
  return {
    lot: 'C3 bis (12/10/2026) : « règles épinglées » → « règles publiées » dans la mention A.7 des 4 articles (les règles sont publiées, pas épinglées).',
    sources: 'texte = source unique src/data/answerSlots.ts (facebookMentionMarkdown) ; ancienne mention = même texte avec la fin de phrase du 11/10',
    apply: 'À appliquer juste avant le push du code sur main (la garde check:slots exige la mention de la source dans les 4 articles).',
    encoding: 'Fichier UTF-8 : guillemets « » et accents — ne pas normaliser.',
    dryRunTitle: 'C3 bis — « règles publiées » : aperçu des substitutions SQL',
    legend: 'Légende : « Avant » = mention du 11/10 ; « Après » = mention du 12/10 (publiées).',
    versions: { FACEBOOK_GROUP_VERSION: m.FACEBOOK_GROUP_VERSION },
  };
}

export function buildEdits(m) {
  const out = [];
  for (const slug of Object.keys(m.FACEBOOK_MENTION_ARTICLES)) {
    for (const lang of ['fr', 'en']) {
      const neu = m.facebookMentionMarkdown(lang);
      if (!neu.endsWith(NEW_TAIL[lang])) throw new Error(`c3b : la mention ${lang} ne se termine pas par « ${NEW_TAIL[lang]} »`);
      const old = neu.slice(0, -NEW_TAIL[lang].length) + OLD_TAIL[lang];
      out.push({ slug, lang, mechanism: 'A7', note: 'mention A.7 : « règles épinglées » → « règles publiées » (C3 bis)', find: old, replace: neu });
    }
  }
  return out;
}
