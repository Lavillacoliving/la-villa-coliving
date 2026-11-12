/**
 * Le Lodge, borne basse (décisions de Jérôme du 12/11/2026) : liste DÉCLARATIVE des modifications de blog_posts, consommée par
 * scripts/build-slots-sql.mjs :
 *
 *   node scripts/build-slots-sql.mjs --edits ./trajets-lodge-borne-basse.edits.mjs --name trajets-lodge-borne-basse --date 2026-11-12 --write-diff
 *
 * Décisions (code : src/data/stats.ts, commentaire de TRANSIT) :
 *  - relevé en fourchette : on annonce toujours la borne basse, pour toutes les maisons. Le Lodge : porte-à-porte jusqu'à Rive
 *    25 min, jusqu'à Cornavin 32 min (27-28 et 34-35 min mesurés avec 10 min de marche, marche actuelle de 8 min) ;
 *  - conséquence validée (« 25 min partout ») : la formule D1 finit par « 25 min jusqu'au centre » (TRANSIT.centreDoorToDoorMin,
 *    5 supérieur du meilleur porte-à-porte jusqu'à Rive) ; Cornavin : « 32 à 33 min porte-à-porte selon la maison ».
 * Périmètre : les 27 articles publiés qui portent l'ancienne valeur, lus le 12/11/2026 (REST anon). Trois familles :
 *  A. formule D1 (GENEVA_COMMUTE_FORMULA) : pied d'article de 23 articles, plus deux fois dans guide-ressources ;
 *  B. ligne de tableau Cornavin de guide-ressources (« 33 min porte-à-porte depuis chaque maison ») ;
 *  C. phrases écrites à la main qui reprennent « 30 minutes » pour le centre (3 articles) : même phrase à « 25 minutes », sauf
 *     celle qui finit par « en train ou en tram » (fourchette des trois maisons, « entre 25 et 32 minutes … selon la maison »).
 * Hors de ce fichier : les 2 articles dépubliés et redirigés en 308 (avenant-fiscal-40-frontalier-geneve,
 * demenager-geneve-frontalier-checklist), invisibles en REST anon et rendus nulle part — laissés tels quels ;
 * le bot et la consigne du générateur — scripts/trajets-lodge-borne-basse-bot-generateur-2026-11-12.sql.
 *
 * Règles : `find` copié au caractère près depuis la base (OLD = sorties de la source unique AVANT ce lot, identiques à la base) ;
 * `replace` = fonction de la source unique `m` : aucune minute écrite ici en dehors des `find`. Tutoiement FR, parité FR/EN,
 * rien d'ajouté. Ne jamais régénérer après l'application (les ancres sont consommées) : le .sql committé est la trace.
 */
import { FOOTER_SLUGS } from './trajets-maisons.edits.mjs'; // les 23 articles au pied D1 unique (liste vérifiée en base le 12/11/2026)

/** Sorties de la source unique avant ce lot (= textes en base), calculées depuis origin/main c8b080d29. */
export const OLD = Object.freeze({
  centre: 30,
  formula: {
    fr: "Genève-Eaux-Vives en 7 min de Léman Express depuis la gare d'Annemasse — 16 à 17 min porte-à-porte selon la maison, 30 min jusqu'au centre",
    en: 'Geneva Eaux-Vives in 7 minutes by Léman Express from Annemasse station — 16 to 17 minutes door to door depending on the house, 30 minutes to the city centre',
  },
  cornavin: {
    fr: '23 min de train, 33 min porte-à-porte depuis chaque maison',
    en: '23 min by train, 33 min door to door from each house',
  },
});

const LANGS = ['fr', 'en'];

/** Ce qui ne doit plus rester dans les articles touchés (signalé par le générateur après simulation) ; \s couvre les espaces insécables. */
export const POST_STATE_WATCH = [
  /30\s?min(?:utes)?\s+(?:jusqu['’]au|du) centre/i,
  /30\s?min(?:utes)?\s+(?:to|from) the city cent(?:re|er)/i,
  /33\s?min(?:utes)?\s+(?:porte-à-porte depuis chaque maison|door[ -]to[ -]door from each house)/i,
];

export function sqlDoc() {
  return {
    lot: "Le Lodge, borne basse (décisions de Jérôme du 12/11/2026) : formule D1 « 25 min jusqu'au centre » (30 avant), phrases écrites à la main, ligne Cornavin « 32 à 33 min porte-à-porte selon la maison », dans 27 articles publiés",
    sources: 'source unique (stats.ts : TRANSIT, GENEVA_COMMUTE_FORMULA) de la branche fix/trajets-lodge-borne-basse ; textes « Avant » lus en base le 12/11/2026',
    apply: "À appliquer JUSTE AVANT la fusion de la branche fix/trajets-lodge-borne-basse : la garde check:facts de la branche interdit « 30 min jusqu'au centre » et « 33 min porte-à-porte depuis chaque maison » — si la fusion précède ce SQL, le prérendu du robot échoue et la production reste figée. Vérifier d'abord qu'aucun prérendu ne tourne (gh run list --workflow prerender.yml --limit 3), puis fusionner dans la minute. Séance du 12/11/2026 : ces 60 substitutions ont été appliquées sous forme groupée (5 UPDATE dans un seul bloc DO, md5 d'entrée et de sortie, tout ou rien) — scripts/trajets-lodge-borne-basse-2026-11-12.seance.sql.",
    encoding: 'Fichier UTF-8 : tirets cadratins (U+2014), apostrophes droites, aucune espace insécable dans les textes — ne pas normaliser.',
    dryRunTitle: 'Le Lodge, borne basse — aperçu des substitutions SQL des articles (12/11/2026)',
    legend: 'Légende : « Avant » = texte en base au 12/11/2026 ; « Après » = texte calculé depuis la source unique de la branche.',
    versions: {},
  };
}

export function buildEdits(m) {
  const T = m.TRANSIT, B = T.byHouse, NEW = m.GENEVA_COMMUTE_FORMULA;
  const centre = T.centreDoorToDoorMin;
  // Garde : la source doit déjà porter les valeurs du lot, sinon find === replace et le SQL serait vide de sens.
  if (centre === OLD.centre) throw new Error(`trajets-lodge-borne-basse : TRANSIT.centreDoorToDoorMin vaut encore ${OLD.centre} (source non modifiée)`);
  for (const lang of LANGS) if (NEW[lang] === OLD.formula[lang]) throw new Error(`trajets-lodge-borne-basse : GENEVA_COMMUTE_FORMULA.${lang} est encore celle de la base`);

  const corn = [B.lavilla.cornavinDoorToDoorMin, B.leloft.cornavinDoorToDoorMin, B.lelodge.cornavinDoorToDoorMin];
  const cMin = Math.min(...corn), cMax = Math.max(...corn);
  // Même texte que dtdRange (src/pages/AnnemasseColocationPage.tsx) : une valeur quand les trois maisons sont égales, sinon la fourchette.
  const cornRange = (lang) => (cMin === cMax
    ? (lang === 'en' ? `${cMin} min door to door from each house` : `${cMin} min porte-à-porte depuis chaque maison`)
    : (lang === 'en' ? `${cMin} to ${cMax} min door to door depending on the house` : `${cMin} à ${cMax} min porte-à-porte selon la maison`));

  const E = [];
  const add = (slug, lang, mechanism, note, find, replace) => {
    if (find === replace) throw new Error(`trajets-lodge-borne-basse : ${slug} (${lang}) · ${note} : texte inchangé`);
    E.push({ slug, lang, mechanism, note, find, replace });
  };
  /** Phrase écrite à la main : même phrase, seule la valeur du centre change (une seule occurrence de l'ancienne valeur dans l'ancre). */
  const swapCentre = (find) => {
    const old = `${OLD.centre} minutes`;
    if (find.split(old).length !== 2) throw new Error(`trajets-lodge-borne-basse : « ${old} » attendu une fois dans « ${find} »`);
    return find.replace(old, `${centre} minutes`);
  };
  const hand = (slug, lang, note, find) => add(slug, lang, 'phrase', note, find, swapCentre(find));

  // ── A. Formule D1 ──────────────────────────────────────────────────────────────────────────────────────────
  for (const slug of FOOTER_SLUGS) for (const lang of LANGS) add(slug, lang, 'formule D1', "pied d'article : jusqu'au centre", OLD.formula[lang], NEW[lang]);
  const GR = 'guide-ressources-frontalier-geneve';
  add(GR, 'fr', 'formule D1', 'paragraphe « propriétaires, pas agence »', `côté France (${OLD.formula.fr}`, `côté France (${NEW.fr}`);
  add(GR, 'fr', 'formule D1', "phrase d'appel 👉", `sans frais de dossier. ${OLD.formula.fr}`, `sans frais de dossier. ${NEW.fr}`);
  add(GR, 'en', 'formule D1', 'paragraph « owners, not an agency »', `on the French side (${OLD.formula.en}`, `on the French side (${NEW.en}`);
  add(GR, 'en', 'formule D1', 'call-to-action line 👉', `no application fee. ${OLD.formula.en}`, `no application fee. ${NEW.en}`);

  // ── B. Ligne de tableau Cornavin (guide-ressources) ────────────────────────────────────────────────────────
  add(GR, 'fr', 'tableau', 'Cornavin porte-à-porte', OLD.cornavin.fr, `${T.trainCornavinMin} min de train, ${cornRange('fr')}`);
  add(GR, 'en', 'tableau', 'Cornavin door to door', OLD.cornavin.en, `${T.trainCornavinMin} min by train, ${cornRange('en')}`);

  // ── C. Phrases écrites à la main (même phrase, valeur du centre = TRANSIT.centreDoorToDoorMin) ─────────────
  const CC = 'coliving-colocation-ou-studio-geneve-comparatif';
  hand(CC, 'fr', "trajet : jusqu'au centre", "20 minutes jusqu'à Genève-Eaux-Vives et 30 minutes jusqu'au centre");
  hand(CC, 'en', 'commute: to the city centre', '20 minutes to Geneva Eaux-Vives and 30 minutes to the city centre');

  const VA = 'vivre-a-annemasse-quand-on-travaille-a-geneve';
  hand(VA, 'fr', 'transports : phrase du corps', "moins que bien des trajets à l'intérieur de Genève, et 30 minutes jusqu'au centre");
  hand(VA, 'fr', 'FAQ : comment se rendre à Genève', "Porte-à-porte, compte 20 minutes jusqu'à Genève-Eaux-Vives et 30 minutes jusqu'au centre");
  hand(VA, 'en', 'transport: body sentence', 'less than many commutes inside Geneva, and 30 minutes to the city centre');
  hand(VA, 'en', 'FAQ: getting to Geneva', 'Door to door, count 20 minutes to Geneva Eaux-Vives and 30 minutes to the city centre');

  // Phrase posée par le lot L2 depuis TRANSIT.centreDoorToDoorMin (scripts/l2-location.edits.mjs). Elle finit par « en train ou
  // en tram » : 25 min ne vaut que pour le train depuis Le Lodge (en tram depuis Le Loft : 32 min). Elle prend donc la fourchette
  // des trois maisons, comme le tableau d'/annemasse-colocation (« 25 à 32 min porte-à-porte selon la maison ») — relecture du 12/11.
  const CT = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie';
  add(CT, 'fr', 'phrase', 'centre (Rive) : fourchette des trois maisons',
    `et à ${OLD.centre} minutes du centre (Rive)`,
    `et entre ${T.riveDoorToDoorMin} et ${T.riveDoorToDoorMax} minutes du centre (Rive) selon la maison`);
  add(CT, 'en', 'phrase', 'city centre (Rive): range across the three houses',
    `and ${OLD.centre} minutes from the city centre (Rive)`,
    `and between ${T.riveDoorToDoorMin} and ${T.riveDoorToDoorMax} minutes from the city centre (Rive) depending on the house`);

  return E;
}
