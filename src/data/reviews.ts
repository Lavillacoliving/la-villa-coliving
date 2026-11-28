/**
 * Extraits d'avis Google cités sur l'accueil (brief « Accueil : récit, avis, photos » du 27/11/2026, lot 2a, §0.3 C et §0.4 ;
 * décisions V2 et D5 de Jérôme). Source : fiche Google publique de La Villa Coliving, lue le 27/11/2026.
 *
 * Règles (§0.4) :
 * - extrait EXACT, entre guillemets, sans réécriture ; une coupe se signale par « … » ;
 * - prénom seul, sans nom ni photo de profil ; le contexte est celui que l'auteur déclare dans son avis ;
 * - page FR : extraits 1 à 5 ; page EN : extrait 6 en premier, puis 1 à 4 traduits, avec « Translated from French » ;
 * - AUCUN balisage `Review` ni `aggregateRating` (décision du 23/11) ; les extraits sont dans le HTML prérendu ;
 * - la photo de la section n'est attribuée à aucun auteur.
 * La note et son lien restent ceux de GOOGLE_REVIEWS (stats.ts) : ce fichier ne porte aucun chiffre.
 */

export type ReviewExcerpt = {
  /** Ordre du brief (§0.4). */
  order: number;
  firstName: string;
  /** Contexte déclaré par l'auteur (vide s'il n'en donne pas). */
  context: { fr: string; en: string };
  /** Langue d'origine de l'avis. */
  lang: "fr" | "en";
  /** Extrait exact, dans la langue d'origine. */
  text: string;
  /** Traduction (vers l'autre langue). */
  translation: string;
  /** Date de lecture de la fiche Google. */
  readOn: string;
};

export const REVIEWS_READ_ON = "2026-11-27";

export const REVIEW_EXCERPTS: readonly ReviewExcerpt[] = [
  {
    order: 1,
    firstName: "Théodora",
    context: { fr: "presque un an à La Villa", en: "almost a year at La Villa" },
    lang: "fr",
    text: "Les dîners du dimanche, les soirées au bord de la piscine…",
    translation: "Sunday dinners, evenings by the pool…",
    readOn: REVIEWS_READ_ON,
  },
  {
    order: 2,
    firstName: "Sébastien",
    context: { fr: "La Villa", en: "La Villa" },
    lang: "fr",
    text: "la Villa est de loin l'endroit où je me suis senti le mieux",
    translation: "La Villa is by far the place where I felt best",
    readOn: REVIEWS_READ_ON,
  },
  {
    order: 3,
    firstName: "Cassandre",
    context: { fr: "", en: "" },
    lang: "fr",
    text: "pouvoir rapidement intégrer une vraie petite communauté, c'est une valeur ajoutée rare",
    translation: "being able to quickly join a real little community is a rare plus",
    readOn: REVIEWS_READ_ON,
  },
  {
    order: 4,
    firstName: "Marion",
    context: { fr: "", en: "" },
    lang: "fr",
    text: "L'ambiance est conviviale sans être envahissante",
    translation: "The atmosphere is friendly without being intrusive",
    readOn: REVIEWS_READ_ON,
  },
  {
    order: 5,
    firstName: "Livia",
    context: { fr: "La Villa", en: "La Villa" },
    lang: "fr",
    text: "Il n'y a plus qu'à poser ses valises, tout le reste est prêt",
    translation: "All you have to do is drop your bags, everything else is ready",
    readOn: REVIEWS_READ_ON,
  },
  {
    order: 6,
    firstName: "Gary",
    context: { fr: "7 mois au Lodge", en: "7 months at Le Lodge" },
    lang: "en",
    text: "have made new friendships that will last long after leaving Le Lodge",
    translation: "des amitiés qui dureront bien après Le Lodge",
    readOn: REVIEWS_READ_ON,
  },
  {
    // En réserve (§0.4) : non affiché dans ce lot.
    order: 7,
    firstName: "Rémi",
    context: { fr: "4 ans à La Villa", en: "4 years at La Villa" },
    lang: "fr",
    text: "Un lieu de vie propice pour faire de belles rencontres",
    translation: "A place to live that's made for meeting great people",
    readOn: REVIEWS_READ_ON,
  },
];

const byOrder = (n: number): ReviewExcerpt => {
  const r = REVIEW_EXCERPTS.find((x) => x.order === n);
  if (!r) throw new Error(`reviews.ts : extrait ${n} introuvable`);
  return r;
};

/** Extraits affichés, dans l'ordre (§0.4) : FR 1 à 5 ; EN 6 puis 1 à 4. */
export const REVIEWS_SHOWN: Record<"fr" | "en", readonly ReviewExcerpt[]> = {
  fr: [1, 2, 3, 4, 5].map(byOrder),
  en: [6, 1, 2, 3, 4].map(byOrder),
};

/** Texte affiché d'un extrait sur une page : l'original si la langue est la même, sinon la traduction (étiquetée). */
export function reviewText(r: ReviewExcerpt, lang: "fr" | "en"): { text: string; translated: boolean } {
  return r.lang === lang ? { text: r.text, translated: false } : { text: r.translation, translated: true };
}
