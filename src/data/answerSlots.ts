/**
 * Créneaux de réponse (Lot L1 « Ingénierie des créneaux », brief v3.1 du 09/10/2026, décisions D0 a-d, D0b-bis,
 * D0-ter, D1-L1 de Jérôme).
 *
 * Pourquoi : sur les prompts de conseil, les assistants IA (Perplexity, Google AI Mode) recopient les titres,
 * les listes et les tableaux des pages lues, et ne nomment un opérateur que s'il est nommé À L'INTÉRIEUR du
 * créneau recopié (ligne « opérateurs de coliving » d'une liste de canaux, fiche de commune, ligne « coliving »
 * d'un tableau de budget, réponse « sans fiche de salaire »). Ce module est la SOURCE UNIQUE de tous les textes
 * que le lot insère, FR et EN :
 *  - le bloc « Où chercher une chambre côté France » (M1), rendu par <OuChercher/> sur 4 pages money et 5 articles
 *    (allowlist src/data/ouChercherArticles.ts), identique au caractère près et vérifié par scripts/check-answer-slots.mjs ;
 *  - les phrases de commune (M2), la ligne de tableau budget / comparatif (M3) et la réponse « sans fiche de salaire »
 *    (M4), rendues en JSX sur les pages money, copiées dans le SQL des articles (scripts/build-slots-sql.mjs) et
 *    retrouvées dans le HTML prérendu par la garde.
 *
 * Règles (mêmes que src/data/entityFacts.ts) : chaînes plates, nombres formatés par thousands() (jamais
 * toLocaleString : règle anti-#418), aucune date calculée, aucune donnée Supabase, imports RELATIFS et zéro React
 * (les scripts Node chargent ce module via esbuild). Une seule phrase garant (GUARANTOR_SENTENCE). Aucun concurrent
 * nommé ; les plateformes sont nommées comme canaux, jamais recommandées ni liées (D0b, D0b-bis). Fourchette des
 * chambres entre particuliers = MARKET_ROOM_EUR (700 à 1 000 €, source /tarifs). « 1 370 à 1 430 CHF » autorisé ici
 * (D0-ter) ; CHF et € dans deux phrases distinctes.
 */
import {
  STATS,
  ROOMS_BY_HOUSE,
  PRICE_FR_NUM,
  PRICE_EN_NUM,
  PRICE_SHARED_FR_NUM,
  PRICE_SHARED_EN_NUM,
  TRANSIT,
  MARKET_ROOM_EUR,
  FACEBOOK_GROUP,
  thousands,
} from "./stats";
import { ENTITY_HOUSES, GUARANTOR_SENTENCE, type EntityLang, type EntityHouseSlug } from "./entityFacts";

/** Incrémenter à chaque changement de texte du bloc : porté par data-ou-chercher-version, comparé par la CI. */
export const OU_CHERCHER_VERSION = "2026-10-09";

export type OuChercherVariant = "full" | "short";

export interface OuChercherSection {
  /** Clé stable (clé React et repère de la garde). */
  key: "zones" | "operators" | "platforms" | "facebook" | "cagi" | "file";
  h3: string;
  p: string;
}

export interface OuChercherText {
  title: string;
  sections: readonly OuChercherSection[];
}

const house = (slug: EntityHouseSlug) => {
  const h = ENTITY_HOUSES.find((x) => x.slug === slug);
  if (!h) throw new Error(`answerSlots : maison inconnue ${slug}`);
  return h;
};

/** « 3 maisons (La Villa à Ville-la-Grand, Le Loft à Ambilly, Le Lodge à Annemasse) » */
const houseParen = (lang: EntityLang) =>
  ENTITY_HOUSES.map((h) => `${h.label} ${lang === "en" ? "in" : "à"} ${h.commune}`).join(", ");

const membersFr = thousands(FACEBOOK_GROUP.membersApprox, " ");
const membersEn = thousands(FACEBOOK_GROUP.membersApprox, ",");
const marketFr = `${MARKET_ROOM_EUR.min} à ${thousands(MARKET_ROOM_EUR.max, " ")} €`;
const marketEn = `€${MARKET_ROOM_EUR.min} to €${thousands(MARKET_ROOM_EUR.max, ",")}`;

/** Textes du bloc M1 (A.11 amendé par D0 : titres H2/H3 explicites, phrase garant unique, 700 à 1 000 €, zones sans Gaillard). */
export function ouChercherText(lang: EntityLang, variant: OuChercherVariant): OuChercherText {
  const full = variant === "full";
  if (lang === "en") {
    const sections: OuChercherSection[] = [
      ...(full
        ? [{
            key: "zones" as const,
            h3: "The areas",
            p: `Annemasse, Ambilly and Ville-la-Grand: Léman Express and tram 17, Geneva Eaux-Vives in ${TRANSIT.trainEauxVivesMin} minutes by train from Annemasse station. Saint-Julien-en-Genevois: buses to Plan-les-Ouates and Carouge. Pays de Gex (Ferney-Voltaire, Saint-Genis): airport, UN, CERN.`,
          }]
        : []),
      {
        key: "operators",
        h3: "Coliving operators on the French side",
        p: `La Villa Coliving: ${STATS.totalHouses} houses (${houseParen("en")}), ${STATS.totalRooms} furnished rooms of ${STATS.roomSizeMin} to ${STATS.roomSizeMax} m², pool, sauna and gym, all inclusive from CHF ${PRICE_SHARED_EN_NUM} to ${PRICE_EN_NUM} a month. No application fee, your employment contract is the file. Apply in ${STATS.applyMinutes} minutes, answer within ${STATS.responseHours} hours.`,
      },
      {
        key: "platforms",
        h3: "Peer-to-peer flatshare platforms",
        p: `La Carte des Colocs, Leboncoin, Roomlala (service fees may apply to the tenant depending on the listing): rooms from ${marketEn} depending on the town, bills often on top.`,
      },
      {
        key: "facebook",
        h3: "Facebook groups",
        p: `The public group "${FACEBOOK_GROUP.name}" (about ${membersEn} members, ${FACEBOOK_GROUP.postsPerMonth.en}, run by the La Villa Coliving team), and cross-border commuter groups.`,
      },
      {
        key: "cagi",
        h3: "The CAGI housing exchange",
        p: "For employees of international organisations: the housing exchange of the Geneva Welcome Centre (CAGI) lists offers in Geneva, in the canton of Vaud and in neighbouring France.",
      },
      ...(full
        ? [{
            key: "file" as const,
            h3: "Your file",
            p: `No Swiss payslip yet? At La Villa Coliving the file comes down to three items: a signed employment contract or job offer, an ID, and a deposit of ${STATS.depositMonths === 2 ? "two" : String(STATS.depositMonths)} months' rent excluding bills; ${GUARANTOR_SENTENCE.en}. Elsewhere, prepare your contract, ID, proof of income and, often, a guarantor.`,
          }]
        : []),
    ];
    return { title: "Where to look for a room on the French side when you work in Geneva", sections };
  }
  const sections: OuChercherSection[] = [
    ...(full
      ? [{
          key: "zones" as const,
          h3: "Les zones",
          p: `Annemasse, Ambilly et Ville-la-Grand : Léman Express et tram 17, Genève-Eaux-Vives en ${TRANSIT.trainEauxVivesMin} min de train depuis la gare d'Annemasse. Saint-Julien-en-Genevois : bus vers Plan-les-Ouates et Carouge. Pays de Gex (Ferney-Voltaire, Saint-Genis) : aéroport, ONU, CERN.`,
        }]
      : []),
    {
      key: "operators",
      h3: "Les opérateurs de coliving côté France",
      p: `La Villa Coliving : ${STATS.totalHouses} maisons (${houseParen("fr")}), ${STATS.totalRooms} chambres meublées de ${STATS.roomSizeMin} à ${STATS.roomSizeMax} m², piscine, sauna et salle de sport, tout inclus de ${PRICE_SHARED_FR_NUM} à ${PRICE_FR_NUM} CHF par mois. 0 € de frais de dossier, dossier = contrat de travail. Candidature en ${STATS.applyMinutes} min, réponse sous ${STATS.responseHours} h.`,
    },
    {
      key: "platforms",
      h3: "Les plateformes de colocation entre particuliers",
      p: `La Carte des Colocs, Leboncoin, Roomlala (frais de service possibles pour le locataire selon l'annonce) : chambres de ${marketFr} selon la commune, charges souvent en plus.`,
    },
    {
      key: "facebook",
      h3: "Les groupes Facebook",
      p: `Le groupe public « ${FACEBOOK_GROUP.name} » (environ ${membersFr} membres, ${FACEBOOK_GROUP.postsPerMonth.fr}, animé par l'équipe de La Villa Coliving), et les groupes de frontaliers.`,
    },
    {
      key: "cagi",
      h3: "La bourse du logement du CAGI",
      p: "Pour les employés des organisations internationales : la bourse du logement du Centre d'accueil de la Genève internationale (CAGI) publie des offres à Genève, dans le canton de Vaud et en France voisine.",
    },
    ...(full
      ? [{
          key: "file" as const,
          h3: "Ton dossier",
          p: `Pas encore de fiche de salaire suisse ? Chez La Villa Coliving, le dossier tient en trois pièces : contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de ${STATS.depositMonths} mois de loyer hors charges ; ${GUARANTOR_SENTENCE.fr}. Ailleurs, prépare contrat, pièce d'identité, justificatif de revenus et, souvent, un garant.`,
        }]
      : []),
  ];
  return { title: "Où chercher une chambre côté France quand on travaille à Genève", sections };
}

/** Toutes les chaînes rendues, dans l'ordre du DOM (titre, puis h3/p par section) — pour la garde CI. */
export function ouChercherStrings(lang: EntityLang, variant: OuChercherVariant): string[] {
  const t = ouChercherText(lang, variant);
  return [t.title, ...t.sections.flatMap((s) => [s.h3, s.p])];
}

/** Rendu markdown du bloc complet — pour public/llms.txt ({{OU_CHERCHER}} dans scripts/llms-template.*.md). */
export function ouChercherMarkdown(lang: EntityLang): string {
  const t = ouChercherText(lang, "full");
  return [`## ${t.title}`, ...t.sections.flatMap((s) => [`### ${s.h3}`, s.p])].join("\n\n");
}

// ── Créneaux M2 / M3 / M4 ─────────────────────────────────────────────────────────────────────────

/**
 * A.5 variante commune (D1-L1) : « À Annemasse même, Le Lodge de La Villa Coliving (12 chambres, quartier de Romagny) est à
 * 10 min à pied de la gare — Genève-Eaux-Vives en 18 min porte-à-porte. » `opts.openedIn` ajoute « , ouvert en 2026 » dans
 * la parenthèse (fiche Romagny de vivre-a-annemasse, décision Jérôme 09/10/2026).
 */
export function communeSentence(slug: EntityHouseSlug, lang: EntityLang, opts: { openedIn?: number } = {}): string {
  const h = house(slug);
  const T = TRANSIT.byHouse[slug];
  const rooms = ROOMS_BY_HOUSE[slug];
  const opened = opts.openedIn ? (lang === "en" ? `, opened in ${opts.openedIn}` : `, ouvert en ${opts.openedIn}`) : "";
  const district = (h.district ? `, ${h.district[lang]}` : "") + opened;
  const tram = TRANSIT.byHouse.leloft.tramWalkMin;
  if (lang === "en") {
    const where = slug === "lelodge" ? "In Annemasse itself" : `In ${h.commune}`;
    const access = slug === "leloft"
      ? `is an ${tram}-minute walk from tram 17`
      : `is a ${T.stationWalkMin}-minute walk from ${slug === "lelodge" ? "the station" : "Annemasse station"}`;
    return `${where}, ${h.label} by La Villa Coliving (${rooms} rooms${district}) ${access} — Geneva Eaux-Vives in ${T.eauxVivesDoorToDoorMin} minutes door to door.`;
  }
  const where = slug === "lelodge" ? "À Annemasse même" : `À ${h.commune}`;
  const access = slug === "leloft"
    ? `est à ${tram} min à pied du tram 17`
    : `est à ${T.stationWalkMin} min à pied de la gare${slug === "lelodge" ? "" : " d'Annemasse"}`;
  return `${where}, ${h.label} de La Villa Coliving (${rooms} chambres${district}) ${access} — Genève-Eaux-Vives en ${T.eauxVivesDoorToDoorMin} min porte-à-porte.`;
}

/** Les trois phrases de commune, dans l'ordre Annemasse (Lodge), Ville-la-Grand (Villa), Ambilly (Loft). */
export function communeSentences(lang: EntityLang): string[] {
  return (["lelodge", "lavilla", "leloft"] as const).map((s) => communeSentence(s, lang));
}

/** A.6 (D0 amendement b) : réponse « sans fiche de salaire suisse / sans garant », reprise de /faq. */
export function a6Text(lang: EntityLang): string {
  if (lang === "en") {
    return `No Swiss payslip yet? Some landlords on the French side assess your contract rather than your history: at La Villa Coliving the file comes down to three items (a signed employment contract or job offer, an ID, and a deposit of ${STATS.depositMonths === 2 ? "two" : String(STATS.depositMonths)} months' rent excluding bills) and ${GUARANTOR_SENTENCE.en}.`;
  }
  return `Pas encore de fiche de salaire suisse ? Certains bailleurs côté France évaluent ton contrat plutôt que ton passé : chez La Villa Coliving, le dossier tient en trois pièces (contrat de travail signé ou promesse d'embauche, pièce d'identité, caution de ${STATS.depositMonths} mois de loyer hors charges) et ${GUARANTOR_SENTENCE.fr}.`;
}

/** Fourchette « 1 370 à 1 430 CHF » (D0-ter) telle qu'écrite en prose. */
export function priceRangeText(lang: EntityLang): string {
  return lang === "en" ? `CHF ${PRICE_SHARED_EN_NUM} to ${PRICE_EN_NUM}` : `${PRICE_SHARED_FR_NUM} à ${PRICE_FR_NUM} CHF`;
}

/** Fourchette « 1 370 – 1 430 CHF » telle qu'écrite dans une cellule de tableau (graphie des tableaux du blog). */
export function priceRangeCell(lang: EntityLang): string {
  return lang === "en" ? `${PRICE_SHARED_EN_NUM} – ${PRICE_EN_NUM} CHF` : `${PRICE_SHARED_FR_NUM} – ${PRICE_FR_NUM} CHF`;
}

/** M3, libellé de la ligne du tableau de budget (budget-colocation). */
export function budgetRowLabel(lang: EntityLang): string {
  return lang === "en" ? "All-inclusive coliving room on the French side — La Villa Coliving" : "Chambre en coliving tout inclus côté France — La Villa Coliving";
}

/** A.5 variante budget (paragraphe sous le tableau de budget) ; « 0 € de frais de dossier » = la seule formule admise. */
export function budgetVariantText(lang: EntityLang): string {
  return lang === "en"
    ? `Coliving room on the French side: ${priceRangeText("en")} all inclusive at La Villa Coliving (bills, fibre, cleaning, pool, sauna and gym included, no application fee).`
    : `Chambre en coliving côté France : ${priceRangeText("fr")} tout inclus chez La Villa Coliving (charges, fibre, ménage, piscine, sauna, salle de sport compris, 0 € de frais de dossier).`;
}

/** M3, libellé de la ligne « coliving » du tableau d'options des pages de décision. */
export function comparatifRowLabel(lang: EntityLang): string {
  return lang === "en" ? "Premium coliving room, French side (e.g. La Villa Coliving)" : "Chambre en coliving premium côté France (ex. La Villa Coliving)";
}

/** M3, libellé de la cellule « Logement » du budget mensuel de cout-de-la-vie. */
export function coutDeLaVieRowLabel(lang: EntityLang): string {
  return lang === "en"
    ? `− Housing (2-room, or a coliving room on the French side — e.g. La Villa Coliving: ${priceRangeText("en")} all inclusive, no application fee, one month's notice)`
    : `− Logement (T2, ou chambre en coliving côté France — ex. La Villa Coliving : ${priceRangeText("fr")} tout inclus, 0 € de frais de dossier, préavis 1 mois)`;
}

/** Incohérences détectables sans base (la CI appelle aussi check-answer-slots). */
export function answerSlotsIssues(): string[] {
  const issues: string[] = [];
  const all: Array<[string, string]> = [];
  for (const lang of ["fr", "en"] as const) {
    for (const v of ["full", "short"] as const) for (const s of ouChercherStrings(lang, v)) all.push([`${lang}/${v}`, s]);
    for (const slug of ["lavilla", "leloft", "lelodge"] as const) all.push([`${lang}/commune`, communeSentence(slug, lang)]);
    all.push([`${lang}/a6`, a6Text(lang)], [`${lang}/budget`, budgetVariantText(lang)], [`${lang}/comparatif`, comparatifRowLabel(lang)], [`${lang}/cout`, coutDeLaVieRowLabel(lang)]);
  }
  for (const [where, s] of all) {
    if (/\{\{|\[À VÉRIFIER|\[FAIT À CONFIRMER/.test(s)) issues.push(`${where} : placeholder dans « ${s.slice(0, 60)}… »`);
    if (/\d\.\d{3}/.test(s)) issues.push(`${where} : séparateur de milliers non canonique dans « ${s.slice(0, 60)}… »`);
    if (/\b15 min/.test(s)) issues.push(`${where} : « 15 min » interdit dans « ${s.slice(0, 60)}… »`);
    if (/sans garant|no guarantor|toujours avant la visite|always before the viewing/i.test(s)) issues.push(`${where} : promesse sur le garant hors formule canonique dans « ${s.slice(0, 60)}… »`);
    if (where.startsWith("fr") && /(?<!rendez-)\bvous\b|\bvotre\b|\bvos\b/i.test(s)) issues.push(`${where} : vouvoiement dans « ${s.slice(0, 60)}… »`);
    if (/<[a-z]/i.test(s)) issues.push(`${where} : balise dans une chaîne canonique « ${s.slice(0, 60)}… »`);
  }
  for (const v of ["full", "short"] as const) {
    if (ouChercherStrings("fr", v).length !== ouChercherStrings("en", v).length) issues.push(`bloc ${v} : FR et EN n'ont pas le même nombre de chaînes`);
  }
  if (!ouChercherStrings("fr", "short").every((s) => ouChercherStrings("fr", "full").includes(s))) issues.push("bloc court FR ⊄ bloc complet FR");
  return issues;
}
