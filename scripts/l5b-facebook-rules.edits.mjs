/**
 * C3 (11/10/2026) — règles du groupe Facebook publiées et épinglées par Jérôme → l'interdit L5.4 est réduit (« modéré » autorisé,
 * « annonces vérifiées » toujours interdit) et la mention canonique A.7 des 4 articles en base est ENRICHIE (option B validée) :
 * « … Il est animé et modéré par l'équipe de La Villa Coliving : règles épinglées, annonces douteuses retirées. » (EN à parité).
 * Liste DÉCLARATIVE consommée par scripts/build-slots-sql.mjs :
 *
 *   node scripts/build-slots-sql.mjs --edits ./l5b-facebook-rules.edits.mjs --name l5b-facebook-rules --write-diff
 *
 * Mécanique : pour budget, ou-habiter et guide-ressources, substitution de l'ancienne mention (markdown L5 du 10/10) par la nouvelle
 * (facebookMentionMarkdown de la source). Pour arnaques, en plus du nouveau texte, la mention est DÉPLACÉE (C2, relecture à 3 angles du
 * 11/10/2026) : retirée de la fin des « règles d'or anti-arnaques » (où elle fermait la liste juste après le téléphone de l'ADIL) et
 * réinsérée en fin de « L'alternative sécurisée : le coliving », juste avant « Au-delà des arnaques » — après le pitch coliving,
 * « pour une colocation classique » devient la branche « sinon », tenue par la même équipe. Deux modifications séquentielles par
 * langue (retrait puis insertion) ; le générateur vérifie 1 occurrence de chaque ancre après la précédente. L'ancre déclarée dans
 * FACEBOOK_MENTION_ARTICLES (source) pointe déjà sur le nouveau titre. ou-habiter : emplacement conservé (3 lectures sur 3).
 * Aucun nombre en dur : l'ancienne mention est reconstruite depuis la nouvelle (même nom, membres, volume) en remplaçant sa
 * dernière phrase — si la source change ailleurs que dans cette phrase, le générateur signale 0 occurrence et s'arrête.
 */

const OLD_TAIL = { fr: "Il est animé par l'équipe de La Villa Coliving.", en: 'It is run by the La Villa Coliving team.' };
const NEW_TAIL = {
  fr: "Il est animé et modéré par l'équipe de La Villa Coliving : règles épinglées, annonces douteuses retirées.",
  en: 'It is run and moderated by the La Villa Coliving team: pinned rules, suspicious listings removed.',
};
/** Déplacement C2 (arnaques) : `from` = titre qui suivait la mention (ancienne ancre L5), `to` = titre qui la suit désormais. */
const MOVE = {
  'arnaques-logement-frontalier-geneve-eviter': {
    fr: { from: "\n## L'alternative sécurisée : le coliving\n", to: "\n## Au-delà des arnaques : les erreurs classiques à éviter\n" },
    en: { from: '\n## The Secure Alternative: Coliving\n', to: '\n## Beyond Scams: The Classic Mistakes to Avoid\n' },
  },
};

/** Motifs à signaler (avertissement) dans le texte RÉSULTANT : promesse interdite ou volume chiffré en dur. */
export const POST_STATE_WATCH = [/annonces v[ée]rifi[ée]es|verified listings/i, /\d{3}[   ]?(publications|posts)\b/i];

export function sqlDoc(m) {
  return {
    lot: "C3 « règles du groupe épinglées » + C2 « emplacement de la mention » (décisions Jérôme du 11/10/2026) : mention A.7 enrichie dans 4 articles, déplacée dans arnaques.",
    sources: 'texte = source unique src/data/answerSlots.ts (facebookMentionMarkdown ← FACEBOOK_GROUP) ; ancienne mention reconstruite (dernière phrase L5 du 10/10) ; ancres = FACEBOOK_MENTION_ARTICLES + MOVE (ce fichier)',
    apply: "À appliquer juste avant le push du code C3 sur main (la garde check:slots exige la mention de la source dans ces 4 articles au prérendu suivant).",
    encoding: "Fichier UTF-8 : guillemets « » et accents — ne pas le faire transiter par un éditeur qui normalise les espaces.",
    dryRunTitle: 'C3/C2 — groupe Facebook : aperçu des substitutions et du déplacement SQL dans les articles en base',
    legend: "Légende : « Avant » = texte copié au caractère près depuis la base ; « Après » = mention A.7 enrichie (option B) à la même place, ou déplacée (arnaques).",
    versions: { FACEBOOK_GROUP_VERSION: m.FACEBOOK_GROUP_VERSION, 'FACEBOOK_GROUP.checkedOn': m.FACEBOOK_GROUP.checkedOn, 'FACEBOOK_GROUP.membersApprox': m.FACEBOOK_GROUP.membersApprox },
  };
}

function assertSource(m) {
  if (typeof m.facebookMentionMarkdown !== 'function') throw new Error('l5b-facebook-rules.edits : facebookMentionMarkdown absent de la source');
  if (!m.FACEBOOK_MENTION_ARTICLES || Object.keys(m.FACEBOOK_MENTION_ARTICLES).length !== 4) throw new Error('l5b-facebook-rules.edits : FACEBOOK_MENTION_ARTICLES doit lister 4 articles');
  for (const lang of ['fr', 'en']) {
    const md = m.facebookMentionMarkdown(lang);
    if (!md.endsWith(NEW_TAIL[lang])) throw new Error(`l5b-facebook-rules.edits : la mention ${lang} ne se termine pas par la phrase attendue (option B) — « ${md.slice(-80)} »`);
    if (/annonces v[ée]rifi[ée]es|verified listings/i.test(md)) throw new Error(`l5b-facebook-rules.edits : « annonces vérifiées » interdit (L5.4) dans la mention ${lang}`);
  }
  for (const [slug, langs] of Object.entries(MOVE)) {
    if (!m.FACEBOOK_MENTION_ARTICLES[slug]) throw new Error(`l5b-facebook-rules.edits : ${slug} absent de FACEBOOK_MENTION_ARTICLES`);
    for (const lang of ['fr', 'en']) if (m.FACEBOOK_MENTION_ARTICLES[slug][lang] !== langs[lang].to) throw new Error(`l5b-facebook-rules.edits : ancre ${lang} de ${slug} ≠ MOVE.to (source et déplacement désaccordés)`);
  }
}

/** La liste résolue : substitution par article et par langue ; retrait + réinsertion pour l'article déplacé. */
export function buildEdits(m) {
  assertSource(m);
  const out = [];
  for (const slug of Object.keys(m.FACEBOOK_MENTION_ARTICLES)) {
    for (const lang of ['fr', 'en']) {
      const neu = m.facebookMentionMarkdown(lang);
      const old = neu.slice(0, -NEW_TAIL[lang].length) + OLD_TAIL[lang];
      const mv = MOVE[slug]?.[lang];
      if (!mv) {
        out.push({ slug, lang, mechanism: 'A7', note: 'mention A.7 enrichie (C3 : animé et modéré, règles épinglées), même emplacement', find: old, replace: neu });
      } else {
        out.push({ slug, lang, mechanism: 'A7', note: `retrait de la mention A.7 en fin de section (avant « ${mv.from.trim().slice(0, 50)} »)`, find: `\n${old}\n${mv.from}`, replace: mv.from });
        out.push({ slug, lang, mechanism: 'A7', note: `mention A.7 enrichie réinsérée avant « ${mv.to.trim().slice(0, 50)} » (C2)`, find: mv.to, replace: `\n${neu}\n${mv.to}` });
      }
    }
  }
  return out;
}
