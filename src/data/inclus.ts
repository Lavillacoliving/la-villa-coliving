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
 * Littéraux de l'annexe, sans source dans le dépôt : les six services de streaming (leur nombre, lui, se lit dans la liste), le
 * délai de réponse des réparations (« 48 heures ouvrées », distinct de la réponse sous 48 h aux candidatures, STATS.responseHours),
 * le rythme des cours (un de chaque par mois) et de la soirée (chaque mois). L'opérateur de la fibre vit dans STATS.fiberOperator
 * (24/11/2026, lot 3), à côté du débit.
 *
 * (24/11/2026, lot 3 du brief) Les autres pages qui disent ce que comprend le prix des maisons (pages maisons, /services, /faq,
 * pages Annemasse et Genève, /qui-sommes-nous…) lisent les mêmes faits ici, en morceaux de phrase (`inclusPhrases`) : les listes
 * du bloc 4 ci-dessous sont construites avec ces morceaux, un seul texte par fait.
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
/** Majuscule initiale (« fibre Orange Pro… » → « Fibre Orange Pro… ») : pour poser un morceau de `inclusPhrases` en tête. */
export const capitalFirst = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

/** « Netflix, Canal+, Apple TV, Amazon Prime, Paramount+ et Max » / « … Paramount+ and Max ». */
function streamingList(lang: InclusLang): string {
  const all = [...STREAMING_SERVICES];
  const last = all.pop();
  return `${all.join(", ")} ${lang === "en" ? "and" : "et"} ${last}`;
}

/** Les faits du bloc 4, en morceaux de phrase : minuscule initiale, sans point final (les `lines` gardent la majuscule). */
export interface InclusPhrases {
  /** Nombre de maisons en lettres : « trois » / « three » (STATS.totalHouses). */
  houses: string;
  /** « fibre Orange Pro » / « Orange Pro fibre » (STATS.fiberOperator). */
  fibre: string;
  /** « fibre Orange Pro jusqu'à 8 Gb/s » / « Orange Pro fibre up to 8 Gb/s » (débit : STATS.fiberSpeed). */
  fibreSpeed: string;
  /** « un cours de yoga et une séance de coaching sportif par mois » / « a yoga class and a fitness coaching session each month ». */
  classes: string;
  /** Les cours, « … par mois dans chaque maison » / « … each month in each house ». */
  classesEachHouse: string;
  /** « ouverts aux résidents des trois maisons » / « open to residents of all three houses ». */
  openToAll: string;
  /** Les cours en entier : « … par mois dans chaque maison, ouverts aux résidents des trois maisons ». */
  classesOpenToAll: string;
  /** « six services de streaming » / « six streaming services » (nombre = longueur de STREAMING_SERVICES). */
  streaming: string;
  /** « six services de streaming sur l'écran commun » / « six streaming services on the shared screen ». */
  streamingOnScreen: string;
  /** « Netflix, Canal+, Apple TV, Amazon Prime, Paramount+ et Max ». */
  streamingList: string;
  /** Le panier de base : « papier toilette, essuie-tout, … huile ». */
  basket: string;
  /** « lave-linge et sèche-linge en libre accès, lessive fournie ». */
  laundry: string;
  /** « ménage des parties communes par une entreprise, trois fois par semaine » (passages, jamais d'heures). */
  cleaning: string;
  /** Dans une phrase : « une soirée commune chaque mois » / « a get-together every month » (annexe B, bloc 1). */
  getTogether: string;
  /** Même fait, forme des listes : « une soirée commune chaque mois » / « a house get-together every month » (annexe B, bloc 4). */
  houseGetTogether: string;
  /** Lignes de liste, majuscule initiale et sans point final : celles du bloc 4 (avec leur point sur /tarifs), plus la fibre
   *  avec son débit (`fibreSpeed`, pages maisons et listes des autres pages). */
  lines: {
    fibre: string;
    fibreSpeed: string;
    parking: string;
    laundry: string;
    basket: string;
    streaming: string;
    cleaning: string;
    classes: string;
    getTogether: string;
  };
}

/** Les faits du bloc 4 en morceaux de phrase, pour les pages autres que /tarifs (lot 3 du brief, 24/11/2026). */
export function inclusPhrases(lang: InclusLang): InclusPhrases {
  const houses = inWords(STATS.totalHouses, lang);
  const streamingCount = inWords(STREAMING_SERVICES.length, lang);
  const en = lang === "en";
  const fibre = en ? `${STATS.fiberOperator} fibre` : `fibre ${STATS.fiberOperator}`;
  const fibreSpeed = en ? `${fibre} up to ${STATS.fiberSpeed}` : `${fibre} jusqu'à ${STATS.fiberSpeed}`;
  const wifi = en ? "Wi-Fi throughout the house" : "Wi-Fi dans toute la maison";
  const classes = en ? "a yoga class and a fitness coaching session each month" : "un cours de yoga et une séance de coaching sportif par mois";
  const classesEachHouse = `${classes} ${en ? "in each house" : "dans chaque maison"}`;
  const openToAll = en ? `open to residents of all ${houses} houses` : `ouverts aux résidents des ${houses} maisons`;
  const streaming = en ? `${streamingCount} streaming services` : `${streamingCount} services de streaming`;
  const streamingOnScreen = `${streaming} ${en ? "on the shared screen" : "sur l'écran commun"}`;
  const basket = en
    ? "toilet paper, kitchen roll, hand soap, laundry detergent, cleaning products, bin bags, cloths, salt, pepper, oil"
    : "papier toilette, essuie-tout, lave-main, lessive, produits d'entretien, sacs poubelle, chiffons, sel, poivre, huile";
  const laundry = en ? "washing machine and tumble dryer free to use, detergent provided" : "lave-linge et sèche-linge en libre accès, lessive fournie";
  const cleaning = en ? `cleaning of the shared areas by a company, ${timesPerWeek("en")}` : `ménage des parties communes par une entreprise, ${timesPerWeek("fr")}`;
  const getTogether = en ? "a get-together every month" : "une soirée commune chaque mois";
  const houseGetTogether = en ? "a house get-together every month" : getTogether;
  const P = {
    houses,
    fibre,
    fibreSpeed,
    classes,
    classesEachHouse,
    openToAll,
    classesOpenToAll: `${classesEachHouse}, ${openToAll}`,
    streaming,
    streamingOnScreen,
    streamingList: streamingList(lang),
    basket,
    laundry,
    cleaning,
    getTogether,
    houseGetTogether,
  };
  return {
    ...P,
    lines: {
      fibre: `${capitalFirst(fibre)}, ${wifi}`,
      fibreSpeed: `${capitalFirst(fibreSpeed)}, ${wifi}`,
      parking: en
        ? "On-site parking (at Le Lodge, no allocated space) and outdoor bike parking"
        : "Parking sur place (au Lodge, sans place attribuée) et parking à vélos extérieur",
      laundry: en ? `Laundry room: ${laundry}` : `Buanderie : ${laundry}`,
      basket: en ? `Essentials basket, delivered each month: ${basket}` : `Panier de base, livré chaque mois : ${basket}`,
      streaming: `${capitalFirst(streamingOnScreen)}${en ? ":" : " :"} ${P.streamingList}`,
      cleaning: capitalFirst(cleaning),
      classes: capitalFirst(P.classesOpenToAll),
      getTogether: capitalFirst(houseGetTogether),
    },
  };
}

/** Les trois listes, dans l'ordre de l'annexe (bloc 4 de /tarifs). Les faits partagés avec les autres pages : `inclusPhrases`. */
export function inclusGroups(lang: InclusLang): readonly InclusGroup[] {
  const P = inclusPhrases(lang).lines;
  if (lang === "en") {
    return [
      {
        id: "ailleurs",
        included: true,
        title: "What you would pay separately elsewhere",
        items: [
          "Water, electricity and heating, with no year-end adjustment.",
          "Waste collection tax and sewerage charges.",
          `${P.fibre}.`,
          `${P.parking}.`,
          "Furnished room: double bed, mattress, desk, storage.",
          "Bed linen and a towel, lent to you on arrival.",
          "Equipped kitchen, crockery included.",
          `${P.laundry}.`,
          `${P.basket}.`,
          `${P.streaming}.`,
          "No move-in fees: no application, agency, booking or inventory fee.",
        ],
      },
      {
        id: "en-plus",
        included: true,
        title: "What a flatshare doesn't offer",
        items: [
          `${P.cleaning}.`,
          "A pool, a sauna and a gym in each house.",
          "Home cinema, games and landscaped outdoor areas.",
          `${P.classes}.`,
          `${P.getTogether}.`,
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
        `${P.fibre}.`,
        `${P.parking}.`,
        "Chambre meublée : lit double, matelas, bureau, rangements.",
        "Linge de lit et serviette, prêtés à ton arrivée.",
        "Cuisine équipée, vaisselle comprise.",
        `${P.laundry}.`,
        `${P.basket}.`,
        `${P.streaming}.`,
        "Aucun frais d'entrée : ni dossier, ni agence, ni réservation, ni état des lieux.",
      ],
    },
    {
      id: "en-plus",
      included: true,
      title: "Ce qu'une colocation n'offre pas",
      items: [
        `${P.cleaning}.`,
        "Piscine, sauna et salle de sport dans chaque maison.",
        "Home cinéma, jeux et extérieurs aménagés.",
        `${P.classes}.`,
        `${P.getTogether}.`,
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
    // (24/11/2026, lot 3) + les morceaux de phrase que lisent les autres pages.
    const { lines, ...phrases } = inclusPhrases(lang);
    for (const s of [...groups.flatMap((g) => [g.title, ...g.items]), ...Object.values(phrases), ...Object.values(lines)]) {
      if (/\b24 (?:services|lignes|items)\b/i.test(s)) out.push(`${lang} : compteur « 24 » dans « ${s} »`);
      if (/\b\d+\s?h(?:eures?)?\s+de ménage|\bhours? of cleaning/i.test(s)) out.push(`${lang} : heures de ménage dans « ${s} »`);
      if (/hebdomadaire|chaque semaine|weekly|every week|en option|dîners? communautaires?|community dinners?/i.test(s)) out.push(`${lang} : formule retirée dans « ${s} »`);
      if (/undefined|NaN|\{\{/.test(s)) out.push(`${lang} : valeur manquante dans « ${s} »`);
    }
  }
  if (!WORDS.fr[STATS.totalHouses] || !WORDS.fr[STREAMING_SERVICES.length]) out.push("nombre hors de la table des nombres en lettres");
  return out;
}
