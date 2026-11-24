/**
 * Ce que comprend le prix des maisons — source unique des trois listes du bloc 4 de /tarifs, « Tout ce qui est compris dans le
 * prix » (brief « Page /tarifs et encadré « l'essentiel » : le budget réel » du 23/11/2026, annexes A et B, textes validés par
 * Jérôme le 23/11/2026). Les autres pages qui listent les inclus liront ce module (lot 3 du brief) ; une table Supabase
 * l'alimentera plus tard (chantier séparé, chaque ligne validée par Jérôme).
 *
 * Règles : AUCUN compteur (« 24 services » n'existe plus : le nombre d'éléments n'est jamais écrit) ; le ménage des parties
 * communes s'écrit en nombre de passages (`timesPerWeek`, STATS.cleaningPerWeek), jamais en heures ; tutoiement en français,
 * « you » en anglais, parité stricte (mêmes groupes, mêmes éléments, même ordre) ; une chaîne plate par élément (un nœud texte).
 * Maisons seulement : L'Appart a sa propre liste (src/data/appartFacts.ts), jamais celle-ci.
 *
 * Littéraux de l'annexe, sans source dans le dépôt : l'opérateur (« Fibre Orange Pro »), les six services de streaming (leur
 * nombre, lui, se lit dans la liste), le délai de réponse des réparations (« 48 heures ouvrées », distinct de la réponse sous
 * 48 h aux candidatures, STATS.responseHours), le rythme des cours (un de chaque par mois) et de la soirée (chaque mois).
 * Module pur : imports relatifs, zéro React.
 */
import { timesPerWeek } from "./priceFacts";
import { STATS } from "./stats";

export type InclusLang = "fr" | "en";
/** `ailleurs` : ce qu'on paierait à part ailleurs ; `en-plus` : ce qu'une colocation n'offre pas ; `non-compris` : à ta charge. */
export type InclusGroupId = "ailleurs" | "en-plus" | "non-compris";

export interface InclusGroup {
  id: InclusGroupId;
  /** true : compris dans le prix ; false : à la charge du résident. */
  included: boolean;
  title: string;
  items: readonly string[];
}

/** Les six services de l'écran commun, dans l'ordre de l'annexe (le nombre écrit dans la phrase est la longueur de cette liste). */
export const STREAMING_SERVICES = ["Netflix", "Canal+", "Apple TV", "Amazon Prime", "Paramount+", "Max"] as const;

/** Délai de réponse pour une réparation, en heures ouvrées (annexe ; pas la réponse aux candidatures). */
export const REPAIR_REPLY_WORKING_HOURS = 48;

const WORDS: Record<InclusLang, Record<number, string>> = {
  fr: { 2: "deux", 3: "trois", 4: "quatre", 5: "cinq", 6: "six", 7: "sept" },
  en: { 2: "two", 3: "three", 4: "four", 5: "five", 6: "six", 7: "seven" },
};
const inWords = (n: number, lang: InclusLang): string => WORDS[lang][n] ?? String(n);
const capital = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

/** « Netflix, Canal+, Apple TV, Amazon Prime, Paramount+ et Max » / « … Paramount+ and Max ». */
function streamingList(lang: InclusLang): string {
  const all = [...STREAMING_SERVICES];
  const last = all.pop();
  return `${all.join(", ")} ${lang === "en" ? "and" : "et"} ${last}`;
}

/** Les trois listes, dans l'ordre de l'annexe (bloc 4 de /tarifs). */
export function inclusGroups(lang: InclusLang): readonly InclusGroup[] {
  const houses = inWords(STATS.totalHouses, lang);
  const streaming = capital(inWords(STREAMING_SERVICES.length, lang));
  if (lang === "en") {
    return [
      {
        id: "ailleurs",
        included: true,
        title: "What you would pay separately elsewhere",
        items: [
          "Water, electricity and heating, with no year-end adjustment.",
          "Waste collection tax and sewerage charges.",
          "Orange Pro fibre, Wi-Fi throughout the house.",
          "On-site parking (at Le Lodge, no allocated space) and outdoor bike parking.",
          "Furnished room: double bed, mattress, desk, storage.",
          "Bed linen and a towel, lent to you on arrival.",
          "Equipped kitchen, crockery included.",
          "Laundry room: washing machine and tumble dryer free to use, detergent provided.",
          "Essentials basket, delivered each month: toilet paper, kitchen roll, hand soap, laundry detergent, cleaning products, bin bags, cloths, salt, pepper, oil.",
          `${streaming} streaming services on the shared screen: ${streamingList("en")}.`,
          "No move-in fees: no application, agency, booking or inventory fee.",
        ],
      },
      {
        id: "en-plus",
        included: true,
        title: "What a flatshare doesn't offer",
        items: [
          `Cleaning of the shared areas by a company, ${timesPerWeek("en")}.`,
          "A pool, a sauna and a gym in each house.",
          "Home cinema, games and landscaped outdoor areas.",
          `A yoga class and a fitness coaching session each month in each house, open to residents of all ${houses} houses.`,
          "A house get-together every month.",
          `Upkeep of the garden, pool and house; repairs taken care of, with a reply within ${REPAIR_REPLY_WORKING_HOURS} working hours.`,
        ],
      },
      {
        id: "non-compris",
        included: false,
        title: "What is not included",
        items: [
          "Your home insurance.",
          "Cleaning of your room and bathroom.",
          "Washing and replacing linen.",
          "Meals, apart from get-togethers.",
        ],
      },
    ];
  }
  return [
    {
      id: "ailleurs",
      included: true,
      title: "Ce que tu paierais à part ailleurs",
      items: [
        "Eau, électricité et chauffage, sans régularisation en fin d'année.",
        "Taxe d'ordures et assainissement.",
        "Fibre Orange Pro, Wi-Fi dans toute la maison.",
        "Parking sur place (au Lodge, sans place attribuée) et parking à vélos extérieur.",
        "Chambre meublée : lit double, matelas, bureau, rangements.",
        "Linge de lit et serviette, prêtés à ton arrivée.",
        "Cuisine équipée, vaisselle comprise.",
        "Buanderie : lave-linge et sèche-linge en libre accès, lessive fournie.",
        "Panier de base, livré chaque mois : papier toilette, essuie-tout, lave-main, lessive, produits d'entretien, sacs poubelle, chiffons, sel, poivre, huile.",
        `${streaming} services de streaming sur l'écran commun : ${streamingList("fr")}.`,
        "Aucun frais d'entrée : ni dossier, ni agence, ni réservation, ni état des lieux.",
      ],
    },
    {
      id: "en-plus",
      included: true,
      title: "Ce qu'une colocation n'offre pas",
      items: [
        `Ménage des parties communes par une entreprise, ${timesPerWeek("fr")}.`,
        "Piscine, sauna et salle de sport dans chaque maison.",
        "Home cinéma, jeux et extérieurs aménagés.",
        `Un cours de yoga et une séance de coaching sportif par mois dans chaque maison, ouverts aux résidents des ${houses} maisons.`,
        "Une soirée commune chaque mois.",
        `Entretien du jardin, de la piscine et de la maison ; réparations prises en charge, réponse sous ${REPAIR_REPLY_WORKING_HOURS} heures ouvrées.`,
      ],
    },
    {
      id: "non-compris",
      included: false,
      title: "Ce qui n'est pas compris",
      items: [
        "Ton assurance habitation.",
        "Le ménage de ta chambre et de ta salle d'eau.",
        "Le lavage et le renouvellement du linge.",
        "Les repas, hors soirées.",
      ],
    },
  ];
}

/** Incohérences internes (vide = OK) : parité FR/EN, aucun compteur, ménage en passages, nombres écrits en lettres. */
export function inclusIssues(): string[] {
  const out: string[] = [];
  const fr = inclusGroups("fr"), en = inclusGroups("en");
  if (fr.length !== en.length) out.push(`groupes : ${fr.length} en français, ${en.length} en anglais`);
  fr.forEach((g, i) => {
    const e = en[i];
    if (!e || e.id !== g.id || e.included !== g.included) out.push(`groupe ${g.id} : ordre ou statut différent en anglais`);
    else if (e.items.length !== g.items.length) out.push(`groupe ${g.id} : ${g.items.length} éléments en français, ${e.items.length} en anglais`);
  });
  for (const [lang, groups] of [["fr", fr], ["en", en]] as const) {
    for (const s of groups.flatMap((g) => [g.title, ...g.items])) {
      if (/\b24 (?:services|lignes|items)\b/i.test(s)) out.push(`${lang} : compteur « 24 » dans « ${s} »`);
      if (/\b\d+\s?h(?:eures?)?\s+de ménage|\bhours? of cleaning/i.test(s)) out.push(`${lang} : heures de ménage dans « ${s} »`);
      if (/hebdomadaire|chaque semaine|weekly|every week|en option|dîners? communautaires?|community dinners?/i.test(s)) out.push(`${lang} : formule retirée dans « ${s} »`);
      if (/undefined|NaN|\{\{/.test(s)) out.push(`${lang} : valeur manquante dans « ${s} »`);
    }
  }
  if (!WORDS.fr[STATS.totalHouses] || !WORDS.fr[STREAMING_SERVICES.length]) out.push("nombre hors de la table des nombres en lettres");
  return out;
}
