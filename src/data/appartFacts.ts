/**
 * L'Appart — textes PARTAGÉS, FR et EN (brief « Points d'entrée prix, L'Appart » du 12/11/2026 ; source des textes du 13/11,
 * `textes-lappart.json` de l'agent « contenu », tous « à confirmer » par Jérôme). Figés à l'étape E2 pour que les étapes
 * parallèles (page, listes, faits de la marque) les lisent sans les retaper (critique X13) :
 *   - la fiche « L'Appart — l'essentiel » (<AppartFacts/>, `id="appart-facts"`) — la fiche propre de /lappart (décision n° 13),
 *     jamais la fiche de la marque : ni note Google, ni « 100+ résidents », ni piscine ;
 *   - le tableau « Ce qui est compris, ce qui ne l'est pas » (<AppartIncluded/>) ;
 *   - les textes qui nomment piscine, sauna ou salle de sport pour les NIER ou RENVOYER aux maisons : les seules exceptions de
 *     la garde de mélange des gammes sur les pages de L'Appart (`appartGammeExemptStrings`) ;
 *   - le bloc statique « L'Appart » des 5 pages de la marque (<AppartTeaser/>) : un texte PROPRE À CHAQUE PAGE, jamais une
 *     phrase canonique (ces pages portent déjà la fiche de la marque, qui compte chaque phrase une fois) ;
 *   - la section « L'Appart » des listes, sa phrase de repli, la phrase de commune, la date d'ouverture.
 * Les textes propres à la page /lappart et aux fiches chambres (chapeau, FAQ, sections…) ne sont pas ici : ils vivent avec la page.
 *
 * Aucun nombre tapé : tout vient de APPART (src/data/appart.ts) ; les faits des MAISONS qu'un renvoi cite passent par les
 * constantes nommées de src/data/entityFacts.ts (MAISONS_REFERRAL, MAISONS_CROSS_LINK) — ce module n'importe ni STATS ni une
 * table des maisons (règle de frontière : eslint.config.js et tools/test/appart-boundary.test.mjs).
 *
 * Deux gammes, jamais fondues : jamais un prix de L'Appart dans la même phrase que piscine, sauna ou salle de sport
 * (appartFactsIssues le vérifie sur chaque texte de ce module, nombres bornés : « 530 € » ne se lit pas dans « 1 530 € »).
 * Chaînes plates (un nœud texte chacune), aucune date calculée, zéro React : rendu identique au prérendu et dans le navigateur.
 */
import { APPART } from "./appart";
import { appartCommuteLine } from "./appartLocation";
import {
  APPART_CANONICAL_SENTENCE,
  BRAND_CANONICAL_SENTENCE,
  ENTITY_FACTS_CTA,
  FEES_DEPOSIT_SENTENCE,
  GUARANTOR_SENTENCE,
  LEASE_SENTENCE,
  MAISONS_CROSS_LINK,
  MAISONS_REFERRAL,
} from "./entityFacts";
import { aOrAn } from "./stats";
import { APPART_TEASER_ROUTES, appartTeaser } from "./appartTeaser";
// (14/11/2026, CB-4) Questions 3 et 4 de la FAQ de /lappart, aussi sur /tarifs et /faq : texte unique, module léger.
import { appartHousesFaq } from "./appartHousesFaq";
// (Corrections du 13/11/2026) Nombres en lettres et fréquences : src/data/appartWords.ts, partagés avec le bloc statique.
import {
  APPART_ORDINAL_EN as ORDINAL_EN,
  APPART_ORDINAL_FR as ORDINAL_FR,
  APPART_TIMES_EN as TIMES_EN,
  APPART_TIMES_FR as TIMES_FR,
  APPART_WORD_EN as WORD_EN,
  APPART_WORD_FR as WORD_FR,
  capital,
  cleaningSharedBath,
  timesPerWeek,
  word,
} from "./appartWords";

export type AppartLang = "fr" | "en";

const A = APPART;
const R = MAISONS_REFERRAL;

// ── Prix ───────────────────────────────────────────────────────────────────────────────────────────────────────────────
const P = A.price;

// ── Phrases courtes, réutilisées ─────────────────────────────────────────────────────────────────────────────────────────

/** Ouverture, forme unique des textes fixes (décision n° 17) : vraie même si une chambre est louée avant. Le mois seulement,
 *  jamais le jour (V2-22, 19/11/2026) : « L'Appart ouvre à la location en février 2027. » */
export function appartOpeningSentence(lang: AppartLang): string {
  return lang === "en" ? `${A.name} opens for rent in ${A.opensOnLabel.en}.` : `${A.name} ouvre à la location en ${A.opensOnLabel.fr}.`;
}
/** (21/11/2026, photos de Jérôme : « chambre type de 12 m² », la suite, vrais meubles ; remplace « Photos des chambres à venir. »)
 *  Dit pourquoi trois cartes portent la même photo. */
export function appartRoomPhotosSentence(lang: AppartLang): string {
  const std = A.rooms.standard.surfaceM2;
  return lang === "en"
    ? `The photos show a ${std} m² room (all three are alike) and the suite.`
    : `Les photos montrent une chambre de ${std} m² (les trois se ressemblent) et la suite.`;
}
/** « L'Appart n'a ni piscine, ni sauna, ni salle de sport. » — hors des pages de L'Appart (sur ces pages, seules les exceptions
 *  de appartGammeExemptStrings peuvent nommer ces équipements). */
export function appartNoHouseAmenitiesSentence(lang: AppartLang): string {
  return lang === "en" ? `${A.name} has no pool, sauna or gym.` : `${A.name} n'a ni piscine, ni sauna, ni salle de sport.`;
}

/** Phrase de commune (FAQ d'Annemasse, articles) ; `following` : quand la phrase du Lodge la précède dans le paragraphe. Hors du
 *  bloc « Où chercher » (critique C13) et, au départ, hors de la garde des créneaux (C10). */
export function appartCommuneSentence(lang: AppartLang, opts: { following?: boolean } = {}): string {
  const T = A.transit;
  if (lang === "en") {
    const lead = opts.following ? `Also in ${A.commune}` : `In ${A.commune} itself`;
    return `${lead}, ${A.name} by La Villa Coliving (${A.rooms.total} rooms in a flatshare, near the station) is ${aOrAn(T.stationWalkMin)} ${T.stationWalkMin}-minute walk from the station and ${aOrAn(T.tramStop.walkMin)} ${T.tramStop.walkMin}-minute walk from tram 17 — Geneva Eaux-Vives in ${T.eauxVivesDoorToDoorMin} minutes door to door.`;
  }
  const lead = opts.following ? `Toujours à ${A.commune}` : `À ${A.commune} même`;
  return `${lead}, ${A.name} de La Villa Coliving (${A.rooms.total} chambres en colocation, quartier de la gare) est à ${T.stationWalkMin} min à pied de la gare et à ${T.tramStop.walkMin} min du tram 17 — Genève-Eaux-Vives en ${T.eauxVivesDoorToDoorMin} min porte-à-porte.`;
}

// ── Fiche « L'Appart — l'essentiel » ──────────────────────────────────────────────────────────────────────────────────────

/** Incrémenter à chaque changement de texte : porté par data-appart-facts-version (garde check:facts, étape E2g). 19/11/2026 :
 *  « Compris » dit que le ménage comprend la salle d'eau et le WC partagés (V2-25). */
export const APPART_FACTS_VERSION = "2026-11-20";
/** Pages qui portent la fiche de L'Appart (exactement une fois ; jamais ailleurs). */
export const APPART_FACTS_ROUTES: readonly string[] = ["/lappart"];

/** (24/11/2026, Jérôme) L'Appart ne se visite pas avant son ouverture : sa fiche garde « Candidater » / « Apply », quand les
 *  maisons disent « Programmer une visite » (ENTITY_FACTS_CTA). La microcopie reste celle des fiches (ENTITY_FACTS_CTA.note). */
const APPART_FACTS_CTA = { fr: "Candidater", en: "Apply" } as const;

export interface AppartFactsText {
  title: string;
  paragraph: string;
  bullets: readonly string[];
  /** Bouton « Candidater » et microcopie « Réponse sous 48 h » : comme la fiche de la marque, hors du comptage « 1× par page ». */
  cta: string;
  ctaNote: string;
}

/** La fiche de L'Appart : sa phrase canonique, ses loyers, ce qui est compris, son trajet, le bail, la caution et les frais, le
 *  garant, puis la phrase de la marque. Bail, caution, garant et phrases canoniques : importés de entityFacts.ts, jamais retapés. */
export function appartFactsText(lang: AppartLang): AppartFactsText {
  const std = A.rooms.standard, suite = A.rooms.suite;
  // (19/11/2026, V2-25) « une fois par semaine (salle d'eau et WC partagés compris) ».
  const cleaning = `${timesPerWeek(A.cleaningPerWeek, lang)} ${cleaningSharedBath(lang)}`;
  if (lang === "en") {
    return {
      title: `${A.name} — the essentials`,
      paragraph: APPART_CANONICAL_SENTENCE.en,
      bullets: [
        `Rents: ${P.room.en.chf}/month for a ${std.surfaceM2} m² room (contractual rent in euros: ${P.room.en.eur}), ${P.suite.en.chf}/month for the ${suite.surfaceM2} m² suite, for one or two people (contractual rent in euros: ${P.suite.en.eur}).`,
        `Included: water, electricity, heating, fibre, streaming, cleaning of the shared areas ${cleaning}, and access to the houses' yoga and fitness classes and social evenings. Not included: bed linen and towels, cleaning products, home insurance; parking on request.`,
        `Commute: ${appartCommuteLine("en")}.`,
        LEASE_SENTENCE.en,
        FEES_DEPOSIT_SENTENCE.en,
        `Guarantor: ${GUARANTOR_SENTENCE.en}.`,
        BRAND_CANONICAL_SENTENCE.en,
      ],
      cta: APPART_FACTS_CTA.en,
      ctaNote: ENTITY_FACTS_CTA.en.note,
    };
  }
  return {
    title: `${A.name} — l'essentiel`,
    paragraph: APPART_CANONICAL_SENTENCE.fr,
    bullets: [
      `Loyers : ${P.room.fr.chf}/mois pour une chambre de ${std.surfaceM2} m² (loyer contractuel en euros : ${P.room.fr.eur}), ${P.suite.fr.chf}/mois pour la suite de ${suite.surfaceM2} m², à une ou deux personnes (loyer contractuel en euros : ${P.suite.fr.eur}).`,
      `Compris : eau, électricité, chauffage, fibre, streaming, ménage des parties communes ${cleaning}, accès aux cours de yoga et de sport et aux soirées des maisons. Non compris : linge de lit et serviettes, produits d'entretien, assurance habitation ; parking sur demande.`,
      `Trajet : ${appartCommuteLine("fr")}.`,
      LEASE_SENTENCE.fr,
      FEES_DEPOSIT_SENTENCE.fr,
      `Garant : ${GUARANTOR_SENTENCE.fr}.`,
      BRAND_CANONICAL_SENTENCE.fr,
    ],
    cta: APPART_FACTS_CTA.fr,
    ctaNote: ENTITY_FACTS_CTA.fr.note,
  };
}

/** Chaînes canoniques de la fiche de L'Appart, comptées « exactement une fois » sur /lappart : titre, paragraphe, puces. */
export function appartFactsStrings(lang: AppartLang): string[] {
  const t = appartFactsText(lang);
  return [t.title, t.paragraph, ...t.bullets];
}

// ── Tableau « Ce qui est compris, ce qui ne l'est pas » ───────────────────────────────────────────────────────────────────

export interface AppartIncludedRow {
  item: string;
  status: string;
  detail: string;
  /** Fin de `detail` rendue en lien (renvoi vers les maisons, /nos-maisons) : la phrase entière, le texte reste le même. */
  detailLink?: { text: string; href: string };
}
export interface AppartIncludedTable {
  title: string;
  intro: string;
  header: readonly [string, string, string];
  rows: readonly AppartIncludedRow[];
}

/** Le tableau de L'Appart (15 lignes) : on dit avant la candidature ce qui n'est pas compris. Ligne « Piscine, sauna, salle de
 *  sport » = exception de la garde de gamme (elle nie et renvoie aux maisons, au prix des maisons). */
export function appartIncluded(lang: AppartLang): AppartIncludedTable {
  const en = lang === "en";
  const crossLink = { text: MAISONS_CROSS_LINK[lang], href: "/nos-maisons" };
  const pool = appartGammeExempt(lang)["page.compris.tableau.l13"];
  return {
    title: en ? "What's included, and what isn't" : "Ce qui est compris, ce qui ne l'est pas",
    intro: en ? "We'd rather tell you before you apply." : "On préfère te le dire avant que tu candidates.",
    header: en ? ["Item", "Included?", "Details"] : ["Poste", "Compris ?", "Précision"],
    rows: [
      en ? { item: "Bills: water, electricity, heating", status: "Yes", detail: "In the rent." } : { item: "Charges : eau, électricité, chauffage", status: "Oui", detail: "Dans le loyer." },
      { item: "Fibre", status: en ? "Yes" : "Oui", detail: "" },
      { item: "Streaming", status: en ? "Yes" : "Oui", detail: "" },
      // (19/11/2026, V2-25) « Une fois par semaine (salle d'eau et WC partagés compris). »
      en
        ? { item: "Cleaning of the shared areas", status: "Yes", detail: `${capital(timesPerWeek(A.cleaningPerWeek, "en"))} ${cleaningSharedBath("en")}.` }
        : { item: "Ménage des parties communes", status: "Oui", detail: `${capital(timesPerWeek(A.cleaningPerWeek, "fr"))} ${cleaningSharedBath("fr")}.` },
      en
        ? { item: "Furniture in your room", status: "Yes", detail: `${A.rooms.bedCm} cm double bed, desk, wardrobe.` }
        : { item: "Meubles de ta chambre", status: "Oui", detail: `Lit de ${A.rooms.bedCm}, bureau, penderie.` },
      en
        ? { item: "Yoga and fitness classes", status: "Yes", detail: "You have access to the ones held at La Villa Coliving's houses." }
        : { item: "Cours de yoga et de sport", status: "Oui", detail: "Tu as accès à ceux des maisons de La Villa Coliving." },
      en
        ? { item: "Social evenings", status: "Yes", detail: "You have access to the ones held at the houses." }
        : { item: "Soirées", status: "Oui", detail: "Tu as accès à celles des maisons." },
      en ? { item: "Bike storage", status: "Yes", detail: "" } : { item: "Local à vélos", status: "Oui", detail: "" },
      en ? { item: "Application fee", status: "€0", detail: "" } : { item: "Frais de dossier", status: "0 €", detail: "" },
      en ? { item: "Bed linen and towels", status: "No", detail: "Bring your own." } : { item: "Linge de lit et serviettes", status: "Non", detail: "À apporter." },
      en
        ? { item: "Cleaning products and household supplies", status: "No", detail: "Yours to buy, with your flatmates." }
        : { item: "Produits d'entretien et fournitures", status: "Non", detail: "À ta charge, avec tes colocataires." },
      en ? { item: "Cleaning of your room", status: "No", detail: "That's you." } : { item: "Ménage de ta chambre", status: "Non", detail: "C'est toi." },
      { item: pool[0], status: pool[1], detail: pool[2], detailLink: crossLink },
      en ? { item: "Parking", status: "On request", detail: "Mention it in your application." } : { item: "Parking", status: "Sur demande", detail: "Dis-le dans ta candidature." },
      en ? { item: "Home insurance", status: "No", detail: "Yours to take out, as in the houses." } : { item: "Assurance habitation", status: "Non", detail: "À ta charge, comme dans les maisons." },
    ],
  };
}

// ── Exceptions de la garde de gamme ───────────────────────────────────────────────────────────────────────────────────────

/** Identifiants (source des textes, liste « exceptionsGamme ») des textes de L'Appart qui nomment un équipement des maisons. */
export const APPART_GAMME_EXEMPT_IDS = [
  "chambre.pas-compris.3",
  "page.chapeau.3",
  "page.complet.maisons",
  "page.compris.tableau.l13",
  "page.faq.3.q",
  "page.faq.3.r",
  "page.faq.4.r",
  "page.maisons.h2",
  "page.maisons.texte",
] as const;
export type AppartGammeExemptId = (typeof APPART_GAMME_EXEMPT_IDS)[number];
type ExemptTexts = { [K in AppartGammeExemptId]: K extends "page.compris.tableau.l13" ? readonly [string, string, string] : string };

/**
 * Les 9 textes de L'Appart (page, fiche chambre) qui nomment piscine, sauna ou salle de sport — chacun les NIE à L'Appart ou
 * RENVOIE aux maisons. La page et la fiche chambre les rendent tels quels (étape E3, par leur identifiant) ; la garde de mélange
 * des gammes (étape E2g) n'accepte ces mots, sur les pages de L'Appart, que dans ces textes. Une source, deux usages.
 */
export function appartGammeExempt(lang: AppartLang): ExemptTexts {
  const houses = R.houses.map((h) => (lang === "en" ? `${h.label} in ${h.commune}` : `${h.label} à ${h.commune}`)).join(", ");
  // Questions 3 (piscine) et 4 (différence avec les maisons) de la FAQ : src/data/appartHousesFaq.ts, aussi lu par /tarifs et /faq.
  const [pool, diff] = appartHousesFaq(lang);
  if (lang === "en") {
    return {
      "chambre.pas-compris.3": `Pool, sauna, gym: there aren't any at ${A.name}`,
      "page.chapeau.3": `What ${A.name} is not: a coliving house. No pool, no sauna, no gym here. A simple, well-placed flatshare with bills included.`,
      "page.complet.maisons": "In the meantime, here are the cheapest rooms available in our coliving houses, with pool, sauna and gym.",
      "page.compris.tableau.l13": ["Pool, sauna, gym", "No", `There aren't any at ${A.name}. ${MAISONS_CROSS_LINK.en}`],
      "page.faq.3.q": pool.q,
      "page.faq.3.r": pool.a,
      "page.faq.4.r": diff.a,
      "page.maisons.h2": "Want a pool and a sauna?",
      "page.maisons.texte": `That's our ${word(R.totalHouses, "en")} coliving houses: ${houses}. A pool, a sauna and a gym in each, rooms of ${R.surfaces.min} to ${R.surfaces.max} m², from ${R.from.en} a month.`,
    };
  }
  return {
    "chambre.pas-compris.3": `Piscine, sauna, salle de sport : il n'y en a pas à ${A.name}`,
    "page.chapeau.3": `Ce que ${A.name} n'est pas : une maison de coliving. Ici, ni piscine, ni sauna, ni salle de sport. Une colocation simple, bien placée, charges comprises.`,
    "page.complet.maisons": "En attendant, voici les chambres disponibles les moins chères dans nos maisons de coliving, avec piscine, sauna et salle de sport.",
    "page.compris.tableau.l13": ["Piscine, sauna, salle de sport", "Non", `Il n'y en a pas à ${A.name}. ${MAISONS_CROSS_LINK.fr}`],
    "page.faq.3.q": pool.q,
    "page.faq.3.r": pool.a,
    "page.faq.4.r": diff.a,
    "page.maisons.h2": "Tu veux piscine et sauna ?",
    "page.maisons.texte": `Ce sont nos ${word(R.totalHouses, "fr")} maisons de coliving : ${houses}. Piscine, sauna et salle de sport dans chacune, des chambres de ${R.surfaces.min} à ${R.surfaces.max} m², dès ${R.from.fr} par mois.`,
  };
}

/** Les chaînes des exceptions, à plat (une cellule du tableau qui nomme un équipement compte comme une chaîne) : 10 par langue. */
export function appartGammeExemptStrings(lang: AppartLang): string[] {
  const t = appartGammeExempt(lang);
  return APPART_GAMME_EXEMPT_IDS.flatMap((id) => {
    const v = t[id];
    return typeof v === "string" ? [v] : v.filter((cell) => HOUSE_AMENITY_RE.test(cell));
  });
}

// ── Questions 3 et 4 de la FAQ de /lappart, aussi sur /tarifs et /faq : src/data/appartHousesFaq.ts (14/11/2026), réexporté ici ──
export { appartHousesFaq } from "./appartHousesFaq";
export type { AppartHousesQA } from "./appartHousesFaq";

// ── Bloc statique « L'Appart » des pages de la marque : src/data/appartTeaser.ts (corrections du 13/11/2026), réexporté ici ──
export { APPART_TEASER_ROUTES, appartTeaser } from "./appartTeaser";
export type { AppartTeaserRoute, AppartTeaserText } from "./appartTeaser";

// ── Section « L'Appart » des listes (/chambres-disponibles, /colocation-geneve, /chambre-a-louer-geneve, /chambre-a-louer-annemasse) ──

export interface AppartListText {
  /** Titre de la section (« L'Appart · colocation à Annemasse »). */
  title: string;
  /** Chapeau de la section, état B (cartes de la vue). */
  lead: string;
  /** Repli quand la vue n'a pas encore L'Appart (état A) : phrase et lien vers /lappart, à la place des cartes. */
  fallbackText: string;
  fallbackLink: string;
  /** Lien de la liste d'attente de L'Appart. */
  waitlist: string;
  /** État « complet » (la vue rend L'Appart, aucune chambre libre ni datée) : la ligne posée au-dessus de la liste d'attente.
   *  (Corrections du 13/11/2026) La source n'écrit rien pour les listes dans cet état : c'est le titre de l'état « complet » de
   *  /lappart (`page.complet.titre`, appartFullTitle), repris tel quel — à relire par Jérôme. */
  full: string;
}

/** Titre de l'état « complet » (source : `page.complet.titre`) — /lappart et la section L'Appart des listes. */
export function appartFullTitle(lang: AppartLang): string {
  return lang === "en" ? `${A.name} is full for now` : `${A.name} est complet pour le moment`;
}

export function appartListText(lang: AppartLang): AppartListText {
  if (lang === "en") {
    return {
      title: `${A.name} · flatshare in ${A.commune}`,
      lead: `Our flatshare in the ${A.commune} station district: ${A.rooms.total} furnished rooms, with bills, fibre, streaming and cleaning of the shared areas included. A different range from the houses: no pool, sauna or gym.`,
      fallbackText: `${appartOpeningSentence("en")} Our ${A.descriptor.en}: ${A.rooms.total} furnished rooms from ${P.from.en.chf} a month, with bills, fibre, streaming and cleaning of the shared areas included.`,
      fallbackLink: `Discover ${A.name} and its rooms`,
      waitlist: `Join ${A.name}'s waiting list`,
      full: appartFullTitle("en"),
    };
  }
  return {
    title: `${A.name} · colocation à ${A.commune}`,
    lead: `Notre colocation du quartier de la gare d'${A.commune} : ${A.rooms.total} chambres meublées, charges, fibre, streaming et ménage des communs compris. Une autre gamme que les maisons : pas de piscine, de sauna ni de salle de sport.`,
    fallbackText: `${appartOpeningSentence("fr")} Notre ${A.descriptor.fr} : ${A.rooms.total} chambres meublées dès ${P.from.fr.chf} par mois, charges, fibre, streaming et ménage des communs compris.`,
    fallbackLink: `Découvrir ${A.name} et ses chambres`,
    waitlist: `Rejoins la liste d'attente de ${A.name}`,
    full: appartFullTitle("fr"),
  };
}

// ── Contrôles internes (sans base) ────────────────────────────────────────────────────────────────────────────────────────

/** Équipements des maisons, FR et EN. */
const HOUSE_AMENITY_RE = /piscine|sauna|salle de sport|\bpools?\b|\bgym\b/i;

/** Montant de L'Appart (730, 790, 990, 1 060, 530), BORNÉ : jamais lu dans un autre nombre (« 530 » dans « 1 530 € »,
 *  « 990 » dans « 1 990 »). Séparateurs de milliers acceptés : espace, insécable, fine insécable, virgule, point. */
function amountPattern(n: number): string {
  if (n < 1000) return String(n);
  const s = String(n);
  return `${s.slice(0, -3)}[ \\u00a0\\u202f,.]?${s.slice(-3)}`;
}
const APPART_AMOUNTS = [...new Set([P.room.chf, P.room.eur, P.suite.chf, P.suite.eur, P.suitePerPersonEur])];
const APPART_AMOUNT_RE = new RegExp(`(?<!\\d[ \\u00a0\\u202f,.]?)(?:${APPART_AMOUNTS.map(amountPattern).join("|")})(?![ \\u00a0\\u202f,.]?\\d)`);

/** Les montants de L'Appart lus dans un texte (bornés) — pour la règle « jamais un prix de L'Appart à côté de piscine ». Pure. */
export function appartAmountsIn(text: string): string[] {
  return [...text.matchAll(new RegExp(APPART_AMOUNT_RE.source, "g"))].map((m) => m[0]);
}

/** Phrases d'un texte, coupées à la ponctuation forte (même découpe que les gardes du prérendu). */
const sentencesOf = (text: string): string[] => text.split(/(?<=[.!?;])\s+/).filter(Boolean);

/** Tous les textes de ce module, par langue (contrôles et tests). */
export function appartFactsAllStrings(lang: AppartLang): string[] {
  const table = appartIncluded(lang);
  const list = appartListText(lang);
  return [
    ...appartFactsStrings(lang),
    table.title, table.intro, ...table.header, ...table.rows.flatMap((r) => [r.item, r.status, r.detail]),
    ...APPART_TEASER_ROUTES.flatMap((route) => {
      const t = appartTeaser(route, lang);
      return [...(t.eyebrow ? [t.eyebrow] : []), t.title, t.text, t.link];
    }),
    list.title, list.lead, list.fallbackText, list.fallbackLink, list.waitlist, list.full,
    appartOpeningSentence(lang), appartRoomPhotosSentence(lang), appartNoHouseAmenitiesSentence(lang),
    appartCommuneSentence(lang), appartCommuneSentence(lang, { following: true }),
    ...Object.values(appartGammeExempt(lang)).flatMap((v) => (typeof v === "string" ? [v] : [...v])),
  ];
}

/** Incohérences détectables sans base : règle des deux gammes par phrase, « dès 530 », grammaire, placeholders, blocs
 *  statiques sans phrase canonique, nombres en lettres hors table, parité FR / EN. */
export function appartFactsIssues(): string[] {
  const issues: string[] = [];
  const canon = (lang: AppartLang) => [...appartFactsStrings(lang), APPART_CANONICAL_SENTENCE[lang], BRAND_CANONICAL_SENTENCE[lang]];
  const counts = { fr: appartFactsAllStrings("fr").length, en: appartFactsAllStrings("en").length };
  if (counts.fr !== counts.en) issues.push(`${counts.fr} textes FR ≠ ${counts.en} EN`);
  for (const lang of ["fr", "en"] as const) {
    for (const s of appartFactsAllStrings(lang)) {
      const at = `${lang} : « ${s.slice(0, 70)}… »`;
      for (const sentence of sentencesOf(s)) {
        if (HOUSE_AMENITY_RE.test(sentence) && appartAmountsIn(sentence).length > 0) issues.push(`prix de L'Appart et équipement des maisons dans la même phrase — ${at}`);
      }
      if (/\b(?:dès|from)\s+(?:€\s?)?530\b/i.test(s)) issues.push(`« dès 530 » (P5 : jamais) — ${at}`);
      if (/\b(?:au|du) L'Appart\b/.test(s)) issues.push(`« au / du L'Appart » — ${at}`);
      if (/\{\{|\[FAIT À CONFIRMER|undefined|NaN|\[object/.test(s)) issues.push(`placeholder — ${at}`);
      if (/\d\.\d{3}\b/.test(s)) issues.push(`séparateur de milliers non canonique — ${at}`);
    }
    for (const route of APPART_TEASER_ROUTES) {
      const t = appartTeaser(route, lang);
      for (const c of canon(lang)) if ([t.title, t.text].some((x) => x.includes(c))) issues.push(`${lang} : bloc statique de ${route} avec une phrase canonique`);
    }
  }
  // Valeurs écrites en lettres : hors de la table, le texte s'écrirait en chiffres — à relire.
  for (const n of [R.totalHouses, A.rooms.standard.numbers.length]) if (!WORD_FR[n] || !WORD_EN[n]) issues.push(`nombre ${n} hors de la table des mots`);
  if (!ORDINAL_FR[R.totalHouses + 1] || !ORDINAL_EN[R.totalHouses + 1]) issues.push(`ordinal ${R.totalHouses + 1} hors de la table`);
  for (const n of [A.cleaningPerWeek, R.cleaningPerWeek]) if (!TIMES_FR[n] || !TIMES_EN[n]) issues.push(`fréquence ${n} hors de la table`);
  return issues;
}
