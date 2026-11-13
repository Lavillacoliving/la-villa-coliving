/**
 * L'Appart — textes de SA page (/lappart, /en/lappart) et de ses fiches chambres (/lappart/chambre-N) (étape E3 ; source des
 * textes du 13/11/2026, `textes-lappart.json` de l'agent « contenu », identifiants marqués E3, tous « à confirmer » par Jérôme).
 * L'en-tête de /candidature quand on arrive de L'Appart : src/data/appartCandidature.ts (module à part, pour que la page de
 * candidature ne charge pas les textes de la page de L'Appart). Les textes PARTAGÉS avec les listes et la marque
 * (fiche « l'essentiel », tableau compris / pas compris, blocs statiques, exceptions de la garde de gamme) restent dans
 * src/data/appartFacts.ts ; l'emplacement et les trajets dans src/data/appartLocation.ts.
 *
 * Règles :
 *  - aucun nombre tapé pour un fait de L'Appart : gabarits sur APPART (src/data/appart.ts) ; la date d'ouverture s'écrit
 *    « L'Appart ouvre à la location le 1er février 2027 » (décision n° 17), jamais « disponible » sans la date de la vue ;
 *  - les 9 textes qui nomment piscine, sauna ou salle de sport (pour les NIER ou RENVOYER aux maisons) ne sont pas ici : la
 *    page les rend par `appartGammeExempt(lang)[id]` — même source que la garde de mélange des gammes ;
 *  - jamais une preuve des maisons (note Google, « 100+ résidents », séjour moyen, occupation, formule de trajet de la marque) ;
 *  - jamais une phrase canonique de la fiche (bail, caution, garant, phrases de L'Appart et de la marque) recopiée sur la page :
 *    la garde les compte une seule fois, dans la fiche (<AppartFacts/>) ; la FAQ et les fiches chambres disent les mêmes
 *    conditions dans d'autres phrases ;
 *  - les conditions communes aux deux gammes (durée du bail, préavis, caution, délais) : BRAND_TERMS, ci-dessous, épinglé aux
 *    valeurs de la marque par tools/test/appart-page.test.mjs (la règle de frontière interdit à ce module de lire STATS).
 *
 * Module pur : zéro React, chaînes plates (un nœud texte chacune), aucune date calculée — rendu identique au prérendu et dans
 * le navigateur. Les dates d'une chambre viennent de la vue, formatées par l'appelant (formatFreeDate).
 */
import { APPART } from "./appart";
import { appartCommuteLine } from "./appartLocation";
import { appartFullTitle, appartGammeExempt, appartOpeningSentence, appartRoomPhotosSentence } from "./appartFacts";
import { ENTITY_FACTS_CTA, FEES_DEPOSIT_SENTENCE, GUARANTOR_SENTENCE, MAISONS_REFERRAL } from "./entityFacts";
import { ANNEMASSE_TRAIN_MIN, aOrAn, thousands } from "./stats";
import { APPART_SUITE_ROOM_NUMBER, roomCapacityLabel, roomLabel } from "./places";
import { MONTHS_EN, MONTHS_FR } from "../lib/dates";

export type AppartPageLang = "fr" | "en";

const A = APPART;
const P = A.price;
const T = A.transit;
const STD = A.rooms.standard;
const SUITE = A.rooms.suite;
const NBSP = " ";

/**
 * Conditions communes aux deux gammes, telles que la marque les publie (bail, préavis, caution, délai de réponse, durée de la
 * candidature). Valeurs = STATS (src/data/stats.ts), que ce module ne peut pas lire (règle de frontière) : le test
 * tools/test/appart-page.test.mjs les compare à STATS — un changement de la marque fait échouer le test, pas le site.
 */
export const BRAND_TERMS = { leaseMonths: 12, noticeMonths: 1, depositMonths: 2, responseHours: 48, applyMinutes: 2 } as const;

// ── Petits outils de texte ─────────────────────────────────────────────────────────────────────────────────────────────────
const WORD_FR: Record<number, string> = { 1: "un", 2: "deux", 3: "trois", 4: "quatre", 5: "cinq" };
const WORD_EN: Record<number, string> = { 1: "one", 2: "two", 3: "three", 4: "four", 5: "five" };
/** « trois » / « three » ; un nombre hors table s'écrit en chiffres (appartPageIssues le signale). */
const word = (n: number, lang: AppartPageLang): string => (lang === "en" ? WORD_EN : WORD_FR)[n] ?? String(n);
const capital = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
/** « 5e » / « 5th ». */
const ordinal = (n: number, lang: AppartPageLang): string => {
  if (lang === "fr") return n === 1 ? "1er" : `${n}e`;
  const t = n % 100;
  if (t >= 11 && t <= 13) return `${n}th`;
  return `${n}${({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th"}`;
};
/** « une fois par semaine » / « once a week » (la table s'arrête à 3 : appartPageIssues le signale au-delà). */
const timesPerWeek = (n: number, lang: AppartPageLang): string =>
  lang === "en"
    ? `${({ 1: "once", 2: "twice", 3: "three times" } as Record<number, string>)[n] ?? `${n} times`} a week`
    : `${({ 1: "une fois", 2: "deux fois", 3: "trois fois" } as Record<number, string>)[n] ?? `${n} fois`} par semaine`;
const [OPEN_Y, OPEN_M] = A.opensOn.split("-").map(Number);
/** Mois d'ouverture : « février » / « February ». */
const openingMonth = (lang: AppartPageLang): string => (lang === "en" ? MONTHS_EN[OPEN_M - 1] : MONTHS_FR[OPEN_M - 1]);
/** « 530 € » / « €530 » : la suite à deux, par personne — seulement dans la forme P5 (« soit 530 € par personne à deux »). */
const perPerson = (lang: AppartPageLang): string =>
  lang === "en" ? `€${thousands(P.suitePerPersonEur, ",")}` : `${thousands(P.suitePerPersonEur, NBSP)} €`;
/** Étage des chambres, tel que la vue l'écrit (« Étage 5 ») et tel que le site le traduit (« 5th floor », FLOOR_EN). */
const floorText = (lang: AppartPageLang): string => (lang === "en" ? `${ordinal(A.flat.floor, "en")} floor` : `Étage ${A.flat.floor}`);
/** La suite (n° 5) ou une chambre standard ? */
export const isAppartSuite = (roomNumber: number): boolean => roomNumber === APPART_SUITE_ROOM_NUMBER;
/** Date d'une chambre : « {date} » des gabarits, déjà formatée par l'appelant (formatFreeDate : « 1er février » / « February 1 »). */
type MaybeDate = string | null | undefined;

// ── Balises de la page ─────────────────────────────────────────────────────────────────────────────────────────────────

/** Titre de /lappart, sans prix (décision S33) ; le composant SEO ajoute « | La Villa Coliving ». */
export function appartPageTitle(lang: AppartPageLang): string {
  return lang === "en" ? `${A.name}: flatshare in ${A.commune}` : `${A.name} : colocation à ${A.commune}`;
}

/** Description de /lappart, forme compacte des pages de décision (« 730 CHF/790 € »). Jusqu'à l'ouverture : « Dès février 2027 ». */
export function appartPageDescription(lang: AppartPageLang): string {
  return lang === "en"
    ? `Flatshare in ${A.commune} near the station: ${A.rooms.total} furnished rooms from ${P.from.en.chf}/${P.from.en.eur}, bills, fibre and streaming included. Suite for two. From ${openingMonth("en")} ${OPEN_Y}.`
    : `Colocation à ${A.commune} près de la gare : ${A.rooms.total} chambres meublées dès ${P.from.fr.chf}/${P.from.fr.eur}, charges, fibre et streaming compris. Suite pour couple. Dès ${openingMonth("fr")} ${OPEN_Y}.`;
}

/** Description à poser APRÈS l'ouverture (la garde check:facts avertit quand APPART.opensOn est passée) : sans la date. */
export function appartPageDescriptionAfterOpening(lang: AppartPageLang): string {
  return lang === "en"
    ? `Flatshare in ${A.commune} near the station: ${A.rooms.total} furnished rooms from ${P.from.en.chf}/${P.from.en.eur}, bills, fibre, streaming and shared-area cleaning included. Suite for two.`
    : `Colocation à ${A.commune} près de la gare : ${A.rooms.total} chambres meublées dès ${P.from.fr.chf}/${P.from.fr.eur}, charges, fibre, streaming et ménage des communs compris. Suite pour couple.`;
}

/** Fil d'Ariane visible de /lappart (« Accueil › L'Appart ») : sous l'accueil, pas sous « Nos maisons » (décision n° 29). */
export function appartPageBreadcrumb(lang: AppartPageLang): readonly [string, string] {
  return [lang === "en" ? "Home" : "Accueil", A.name];
}

// ── Haut de page et chapeau ─────────────────────────────────────────────────────────────────────────────────────────────

export interface AppartPageHero {
  eyebrow: string;
  h1: string;
  /** Trois repères sous le titre : quartier, chambres, surface. */
  markers: readonly [string, string, string];
  /** Pastille de prix, à côté du bouton « Candidater ». */
  pricePill: string;
  /** Bouton du haut de page (libellé existant). */
  apply: string;
}

export function appartPageHero(lang: AppartPageLang): AppartPageHero {
  if (lang === "en") {
    return {
      eyebrow: `Flatshare · ${A.commune}, near the station`,
      h1: `${A.name}, La Villa Coliving's flatshare in ${A.commune}`,
      markers: [`${A.commune}, near the station`, `${A.rooms.total} rooms`, `${A.flat.surfaceM2} m²`],
      pricePill: `All-inclusive: from ${P.from.en.chf}/month — no application fee`,
      apply: "Apply",
    };
  }
  return {
    eyebrow: `Colocation · ${A.commune}, quartier de la gare`,
    h1: `${A.name}, la colocation de La Villa Coliving à ${A.commune}`,
    markers: [`${A.commune}, quartier de la gare`, `${A.rooms.total} chambres`, `${A.flat.surfaceM2} m²`],
    pricePill: `Tout compris : dès ${P.from.fr.chf}/mois — 0 frais de dossier`,
    apply: "Candidater",
  };
}

/**
 * Chapeau, en deux morceaux comme sur les pages maisons : `lead` (toujours visible, ouvert par la ligne de trajet — la garde
 * house-pages-check la cherche dans les 1 500 premiers caractères après le H1) et `rest` (replié sur mobile sous « Lire la
 * suite »). `rest` = le paragraphe du prix, puis la phrase « Ce que L'Appart n'est pas » (exception de gamme, rendue à part par
 * la page, appartGammeExempt). Un nœud texte par phrase source.
 */
export function appartPageLead(lang: AppartPageLang): { lead: string; price: string } {
  const f = A.flat;
  if (lang === "en") {
    return {
      lead: `First, the commute: ${appartCommuteLine("en")}. Then the flat: ${f.surfaceM2} m² on the ${ordinal(f.floor, "en")} and top floor, with a lift, south-facing, solid oak floors in every room and an open view of the Salève. ${capital(word(A.rooms.total, "en"))} furnished rooms, ${aOrAn(f.livingKitchenM2)} ${f.livingKitchenM2} m² living room and kitchen, and a balcony.`,
      price: `The price: from ${P.from.en.chf} a month, with bills, fibre, streaming and cleaning of the shared areas included. In euros: from ${P.from.en.eur}. ${A.name} opens for rent on ${A.opensOnLabel.en}, and you can apply now.`,
    };
  }
  return {
    lead: `D'abord le trajet : ${appartCommuteLine("fr")}. Ensuite le logement : un appartement de ${f.surfaceM2} m² au ${ordinal(f.floor, "fr")} et dernier étage, avec ascenseur, plein sud, parquet en chêne massif dans toutes les pièces et vue dégagée sur le Salève. ${capital(word(A.rooms.total, "fr"))} chambres meublées, un séjour-cuisine de ${f.livingKitchenM2} m² et un balcon.`,
    price: `Le prix : dès ${P.from.fr.chf} par mois, charges, fibre, streaming et ménage des communs compris. En euros : dès ${P.from.fr.eur}. ${A.name} ouvre à la location le ${A.opensOnLabel.fr}, et tu peux candidater dès maintenant.`,
  };
}

/** Ligne DPE, même forme que sur les pages maisons (sous le chapeau) : classe et surface du diagnostic, jamais sa date. */
export function appartPageDpe(lang: AppartPageLang): string {
  return lang === "en"
    ? `Energy performance (DPE): ${A.dpe.class} · ${A.flat.surfaceM2} m²`
    : `Diagnostic de performance énergétique (DPE) : ${A.dpe.class} · ${A.flat.surfaceM2} m²`;
}

// ── Les 4 chambres ───────────────────────────────────────────────────────────────────────────────────────────────────────

export interface AppartRoomsSection {
  title: string;
  /** Sous le titre, dans les deux états, jusqu'à l'ouverture. */
  beforeOpening: string;
  intro: string;
  /** « 12 m², c'est la taille d'une chambre de colocation classique… » (décision n° 18). */
  frank: string;
  /** État A seulement (la vue n'a pas encore L'Appart) : annonce les deux cartes « types ». */
  stateA: string;
  /** Sous les cartes, dans les deux états. */
  suitePrice: string;
  photos: string;
}

export function appartRoomsSection(lang: AppartPageLang): AppartRoomsSection {
  const n = STD.numbers.length;
  if (lang === "en") {
    return {
      title: `The ${A.rooms.total} rooms`,
      beforeOpening: `${appartOpeningSentence("en")} You can apply now to reserve a room.`,
      intro: `${capital(word(n, "en"))} ${STD.surfaceM2} m² rooms and a ${SUITE.surfaceM2} m² suite. In each: a ${A.rooms.bedCm} cm double bed, a desk and a wardrobe. The ${word(STD.sharedBathBetween, "en")} rooms share a shower room and a toilet. The suite has its own, plus a private balcony and its own door onto the landing: it's let to one or two people.`,
      frank: `${STD.surfaceM2} m² is the size of a room in a standard flatshare. The space is on the other side of the door: ${aOrAn(A.flat.livingKitchenM2)} ${A.flat.livingKitchenM2} m² living room and kitchen.`,
      stateA: `Below are the two types of room: the ${STD.surfaceM2} m² room, of which there are ${word(n, "en")}, and the suite.`,
      suitePrice: `The suite: ${P.suite.en.chf} a month, for one or two people. In euros: ${P.suite.en.eur} a month, or ${perPerson("en")} each for two.`,
      photos: `${appartRoomPhotosSentence("en")} We'd rather wait and show you the rooms as you'll find them in ${openingMonth("en")} than post a picture that doesn't look like them.`,
    };
  }
  return {
    title: `Les ${A.rooms.total} chambres`,
    beforeOpening: `${appartOpeningSentence("fr")} Tu peux candidater dès maintenant pour réserver une chambre.`,
    intro: `${capital(word(n, "fr"))} chambres de ${STD.surfaceM2} m² et une suite de ${SUITE.surfaceM2} m². Dans chacune : un lit de ${A.rooms.bedCm}, un bureau, une penderie. Les ${word(STD.sharedBathBetween, "fr")} chambres partagent une salle d'eau et un WC. La suite a les siens, plus un balcon privatif et sa propre porte sur le palier : elle se loue à une ou deux personnes.`,
    frank: `${STD.surfaceM2} m², c'est la taille d'une chambre de colocation classique. La place est de l'autre côté de la porte : ${A.flat.livingKitchenM2} m² de séjour-cuisine.`,
    stateA: `Ci-dessous, les deux types de chambres : la chambre de ${STD.surfaceM2} m², il y en a ${word(n, "fr")}, et la suite.`,
    suitePrice: `La suite : ${P.suite.fr.chf} par mois, pour une ou deux personnes. En euros : ${P.suite.fr.eur} par mois, soit ${perPerson("fr")} par personne à deux.`,
    photos: `${appartRoomPhotosSentence("fr")} On préfère attendre de te montrer les chambres telles que tu les trouveras en ${openingMonth("fr")} plutôt que de publier une photo qui ne leur ressemble pas.`,
  };
}

/** Carte « type » (état A : la vue n'a pas encore L'Appart) — chambre de 12 m² ou suite. Champs vides = non affichés. */
export interface AppartTypeCard {
  kind: "room" | "suite";
  name: string;
  /** « 3 chambres » (chambre seulement). */
  count: string | null;
  specs: string;
  /** Meubles (chambre) ; la suite les dit dans son intro de section. */
  furniture: string | null;
  /** « Balcon · Entrée privée » (suite seulement ; décision n° 39 à confirmer). */
  extras: string | null;
  /** « 1 ou 2 personnes » (suite seulement). */
  capacity: string | null;
  /** Prix en trois morceaux, comme les cartes des chambres : « 730 CHF » + « (790 €) » + « /mois ». */
  chf: string;
  eur: string;
  perMonth: string;
  cta: string;
}

export function appartTypeCards(lang: AppartPageLang): readonly [AppartTypeCard, AppartTypeCard] {
  const en = lang === "en";
  const L = en ? "en" : "fr";
  return [
    {
      kind: "room",
      name: en ? `${STD.surfaceM2} m² room` : `Chambre de ${STD.surfaceM2} m²`,
      count: en ? `${STD.numbers.length} rooms` : `${STD.numbers.length} chambres`,
      specs: `${STD.surfaceM2} m² · ${floorText(lang)} · ${en ? "shared shower room" : "salle d'eau partagée"}`,
      furniture: en ? `${A.rooms.bedCm} cm double bed, desk, wardrobe` : `Lit de ${A.rooms.bedCm}, bureau, penderie`,
      extras: null,
      capacity: null,
      chf: P.room[L].chf,
      eur: P.room[L].eur,
      perMonth: en ? "/month" : "/mois",
      cta: en ? "Apply for a room" : "Candidater pour une chambre",
    },
    {
      kind: "suite",
      name: en ? `${SUITE.surfaceM2} m² suite` : `Suite de ${SUITE.surfaceM2} m²`,
      count: null,
      specs: `${SUITE.surfaceM2} m² · ${floorText(lang)} · ${en ? "private bathroom" : "SDB privative"}`,
      furniture: null,
      extras: en ? "Balcony · Private entrance" : "Balcon · Entrée privée",
      capacity: roomCapacityLabel(A.key, SUITE.number, lang),
      chf: P.suite[L].chf,
      eur: P.suite[L].eur,
      perMonth: en ? "/month" : "/mois",
      cta: en ? "Apply for the suite" : "Candidater pour la suite",
    },
  ];
}

/** Légende posée sur la photo d'une carte sans photo de chambre (même texte que les cartes de la vue, RoomCard). */
export function appartPhotoPendingLegend(lang: AppartPageLang): string {
  return lang === "en" ? "Room photo coming soon" : "Photo de la chambre à venir";
}

/** Bouton de la section « À deux : la suite » (et de la carte type de la suite). */
export function appartSuiteCta(lang: AppartPageLang): string {
  return lang === "en" ? "Apply for the suite" : "Candidater pour la suite";
}

/** Liste d'attente (RoomPipeline) : le texte des maisons cite le séjour moyen et « nos trois maisons » — jamais sur /lappart. */
export interface AppartWaitlistText {
  title: string;
  text: string;
  note: string;
  done: string;
}

export function appartWaitlistText(lang: AppartPageLang): AppartWaitlistText {
  if (lang === "en") {
    return {
      title: "A room frees up? You're told first.",
      text: `${A.name} only has ${word(A.rooms.total, "en")} rooms. Tell us when you'd like to move in: we'll email you as soon as a room opens up, before it even shows up here.`,
      note: `No application needed: one email when a room opens up at ${A.name} for your month.`,
      done: `Noted! We'll email you as soon as a room opens up at ${A.name}.`,
    };
  }
  return {
    title: "Une chambre se libère ? Tu es prévenu en premier.",
    text: `${A.name} n'a que ${word(A.rooms.total, "fr")} chambres. Dis-nous quand tu veux emménager : on t'écrit dès qu'une chambre se libère, avant même qu'elle n'apparaisse ici.`,
    note: `Sans dossier : un e-mail quand une chambre se libère à ${A.name} pour ton mois.`,
    done: `C'est noté ! On t'écrit dès qu'une chambre se libère à ${A.name}.`,
  };
}

/** État « complet » (les 4 chambres prises sans date de libération, état B+) : le prix reste publié (doctrine du Lot 4). La phrase
 *  qui présente les chambres des maisons (« … avec piscine, sauna et salle de sport ») est une exception de gamme
 *  (appartGammeExempt, « page.complet.maisons »). */
export function appartFullText(lang: AppartPageLang): { title: string; text: string; link: string } {
  if (lang === "en") {
    return {
      title: appartFullTitle("en"),
      text: `All ${word(A.rooms.total, "en")} rooms are let. The prices don't change: ${P.room.en.chf} a month for a room, ${P.suite.en.chf} for the suite. Leave us your move-in month and we'll let you know as soon as a room opens up.`,
      link: "See all available rooms",
    };
  }
  return {
    title: appartFullTitle("fr"),
    text: `Les ${word(A.rooms.total, "fr")} chambres sont louées. Les prix ne changent pas : ${P.room.fr.chf} par mois pour une chambre, ${P.suite.fr.chf} pour la suite. Laisse-nous ton mois d'arrivée, on te prévient dès qu'une chambre se libère.`,
    link: "Voir toutes les chambres disponibles",
  };
}

// ── Séjour-cuisine, suite, conditions ─────────────────────────────────────────────────────────────────────────────────────

/** Section « Le séjour-cuisine de 80 m² et le balcon » ; `album(n)` : bouton de la visionneuse (« Voir les 8 photos »). */
export function appartLivingSection(lang: AppartPageLang): { title: string; text: string; album: (n: number) => string } {
  const f = A.flat;
  const flatmates = (l: AppartPageLang) => `${word(A.rooms.total - 1, l)} ${l === "en" ? "or" : "ou"} ${word(A.rooms.total, l)}`;
  if (lang === "en") {
    return {
      title: `The ${f.livingKitchenM2} m² living room and kitchen, and the balcony`,
      text: `About ${f.commonM2} m² of shared space, including ${aOrAn(f.livingKitchenM2)} ${f.livingKitchenM2} m² open-plan living room and kitchen and ${aOrAn(f.balconyM2)} ${f.balconyM2} m² balcony. The flat faces south, on the ${ordinal(f.floor, "en")} and top floor, with an open view of the Salève. Solid oak floors in every room. You share all this with ${flatmates("en")} flatmates.`,
      album: (n) => `See the ${n} photos`,
    };
  }
  return {
    title: `Le séjour-cuisine de ${f.livingKitchenM2} m² et le balcon`,
    text: `Environ ${f.commonM2} m² à partager, dont un séjour-cuisine ouvert de ${f.livingKitchenM2} m² et un balcon de ${f.balconyM2} m². L'appartement est plein sud, au ${ordinal(f.floor, "fr")} et dernier étage, avec une vue dégagée sur le Salève. Parquet en chêne massif dans toutes les pièces. Tu partages tout ça avec ${flatmates("fr")} colocataires.`,
    album: (n) => `Voir les ${n} photos`,
  };
}

/** Section « À deux : la suite » (P5 : « 1 060 € par mois, soit 530 € par personne à deux », jamais « dès 530 € »). */
export function appartSuiteSection(lang: AppartPageLang): { title: string; text: string } {
  if (lang === "en") {
    return {
      title: "For two: the suite",
      text: `The suite is the only room at La Villa Coliving let to two people. ${SUITE.surfaceM2} m², its own shower room and toilet, a private balcony and its own door onto the landing. The rent: ${P.suite.en.chf} a month, for one or two people. In euros: ${P.suite.en.eur} a month, or ${perPerson("en")} each for two. The bed is ${A.rooms.bedCm} cm wide, as in the other rooms: worth knowing if there are two of you. In the houses, each room is for one person.`,
    };
  }
  return {
    title: "À deux : la suite",
    text: `La suite est la seule chambre de La Villa Coliving qui se loue à deux. ${SUITE.surfaceM2} m², une salle d'eau et un WC privés, un balcon privatif, une porte indépendante sur le palier. Le loyer : ${P.suite.fr.chf} par mois, pour une ou deux personnes. En euros : ${P.suite.fr.eur} par mois, soit ${perPerson("fr")} par personne à deux. Le lit fait ${A.rooms.bedCm} cm, comme dans les autres chambres : à deux, c'est bon à savoir. Dans les maisons, une chambre accueille une seule personne.`,
  };
}

/** Section « Conditions » : bail, caution, frais et garant sont dans la fiche juste en dessous (la garde les compte une fois par
 *  page) ; ici seulement le renvoi et les profils. Ni « pas de chien » (décision n° 37), ni « 72 h » avant l'ouverture. */
export function appartConditionsSection(lang: AppartPageLang): { title: string; intro: string; profiles: string } {
  if (lang === "en") {
    return {
      title: "Terms: the same as in the houses",
      intro: "The lease, the deposit, the fees and the guarantor rule are those of La Villa Coliving's houses. They're set out in black and white in the summary just below.",
      profiles: "Students and apprentices welcome.",
    };
  }
  return {
    title: "Conditions : les mêmes que dans les maisons",
    intro: "Le bail, la caution, les frais et la règle du garant sont ceux des maisons de La Villa Coliving. Ils sont écrits noir sur blanc dans la fiche juste en dessous.",
    profiles: "Étudiants et alternants acceptés.",
  };
}

// ── FAQ (8 questions, un seul FAQPage) ────────────────────────────────────────────────────────────────────────────────────

export interface AppartQA {
  /** Identifiant de la source des textes (« page.faq.3 ») : les questions 3 et 4 portent des exceptions de gamme. */
  id: string;
  q: string;
  a: string;
}

/**
 * Les questions 1, 2, 5 à 8 (textes propres à la page). Les questions 3 (« L'Appart a-t-il une piscine ? ») et 4 (différence avec
 * les maisons) nomment les équipements des maisons : la page les insère depuis appartGammeExempt (même source que la garde).
 * Ordre de la page : 1, 2, 3, 4, 5, 6, 7, 8 — `appartFaqOwn` rend les six autres, dans l'ordre, avec leur identifiant.
 */
export function appartFaqOwn(lang: AppartPageLang): AppartQA[] {
  const B = BRAND_TERMS;
  const TRAIN = ANNEMASSE_TRAIN_MIN;
  // « Caution de 2 mois de loyer hors charges, payable en 1, 2 ou 3 fois selon ton dossier » : la phrase de la fiche des
  // maisons (deuxième phrase de FEES_DEPOSIT_SENTENCE), reformulée en tête de liste comme sur les fiches chambres.
  const deposit = appartDepositSentence(lang);
  if (lang === "en") {
    return [
      { id: "page.faq.1", q: `How much does a room at ${A.name} cost?`, a: `${P.room.en.chf} a month for each of the ${word(STD.numbers.length, "en")} ${STD.surfaceM2} m² rooms, ${P.suite.en.chf} a month for the ${SUITE.surfaceM2} m² suite. In euros, the rent on the lease: ${P.room.en.eur} and ${P.suite.en.eur}. The rent covers bills (water, electricity, heating), fibre, streaming and cleaning of the shared areas ${timesPerWeek(A.cleaningPerWeek, "en")}. No application fee.` },
      { id: "page.faq.2", q: "What does the rent include, and what doesn't it?", a: `Included: bills (water, electricity, heating), fibre, streaming, cleaning of the shared areas ${timesPerWeek(A.cleaningPerWeek, "en")}, and access to the yoga and fitness classes and the social evenings held at the houses. Not included: bed linen and towels, cleaning products and household supplies, parking (on request) and your home insurance.` },
      { id: "page.faq.5", q: "Can two people rent together?", a: `Yes, in the suite: it's the only room at La Villa Coliving let to one or two people. It's ${SUITE.surfaceM2} m², with its own shower room and toilet, a private balcony and its own door onto the landing. The rent is ${P.suite.en.eur} a month, or ${perPerson("en")} each for two. The bed is ${A.rooms.bedCm} cm wide, as in the other rooms. The ${word(STD.numbers.length, "en")} ${STD.surfaceM2} m² rooms are for one person each.` },
      { id: "page.faq.6", q: `When can I move in to ${A.name}?`, a: `${appartOpeningSentence("en")} You can apply now to reserve a room or the suite: the application takes ${B.applyMinutes} minutes and we reply within ${B.responseHours} hours.` },
      { id: "page.faq.7", q: `How long does it take to get to Geneva from ${A.name}?`, a: `${A.commune} station is ${aOrAn(T.stationWalkMin)} ${T.stationWalkMin}-minute walk away. From there the Léman Express reaches Geneva Eaux-Vives in ${TRAIN.eauxVives} minutes and Cornavin in ${TRAIN.cornavin}, with no change. Door to door, allow ${T.eauxVivesDoorToDoorMin} minutes to Geneva Eaux-Vives, ${T.riveDoorToDoorMin} minutes to Rive, in the city centre, and ${T.cornavinDoorToDoorMin} minutes to Cornavin. Tram 17 is ${aOrAn(T.tramStop.walkMin)} ${T.tramStop.walkMin}-minute walk away, at the ${T.tramStop.name} stop.` },
      { id: "page.faq.8", q: `What are the terms for renting at ${A.name}?`, a: `The same as in La Villa Coliving's houses. No set minimum: your lease runs ${B.leaseMonths} months and you can leave whenever you want with ${B.noticeMonths} month's notice. ${deposit} On guarantors, one rule: ${GUARANTOR_SENTENCE.en}. Students and apprentices welcome.` },
    ];
  }
  return [
    { id: "page.faq.1", q: `Combien coûte une chambre à ${A.name} ?`, a: `${P.room.fr.chf} par mois pour chacune des ${word(STD.numbers.length, "fr")} chambres de ${STD.surfaceM2} m², ${P.suite.fr.chf} par mois pour la suite de ${SUITE.surfaceM2} m². En euros, le loyer du bail : ${P.room.fr.eur} et ${P.suite.fr.eur}. Le loyer comprend les charges (eau, électricité, chauffage), la fibre, le streaming et le ménage des parties communes ${timesPerWeek(A.cleaningPerWeek, "fr")}. 0 € de frais de dossier.` },
    { id: "page.faq.2", q: "Qu'est-ce qui est compris dans le loyer, et qu'est-ce qui ne l'est pas ?", a: `Compris : les charges (eau, électricité, chauffage), la fibre, le streaming, le ménage des parties communes ${timesPerWeek(A.cleaningPerWeek, "fr")}, l'accès aux cours de yoga et de sport des maisons et l'accès aux soirées des maisons. Pas compris : le linge de lit et les serviettes, les produits d'entretien et les fournitures, le parking (sur demande) et ton assurance habitation.` },
    { id: "page.faq.5", q: "Peut-on louer à deux ?", a: `Oui, dans la suite : c'est la seule chambre de La Villa Coliving qui se loue à une ou deux personnes. Elle fait ${SUITE.surfaceM2} m², avec sa salle d'eau, son WC, un balcon privatif et une porte indépendante sur le palier. Son loyer est de ${P.suite.fr.eur} par mois, soit ${perPerson("fr")} par personne à deux. Le lit fait ${A.rooms.bedCm} cm, comme dans les autres chambres. Les ${word(STD.numbers.length, "fr")} chambres de ${STD.surfaceM2} m² sont pour une personne.` },
    { id: "page.faq.6", q: `Quand peut-on emménager à ${A.name} ?`, a: `${appartOpeningSentence("fr")} Tu peux candidater dès maintenant pour réserver une chambre ou la suite : la candidature prend ${B.applyMinutes} minutes et on te répond sous ${B.responseHours} h.` },
    { id: "page.faq.7", q: `Combien de temps pour aller à Genève depuis ${A.name} ?`, a: `La gare d'${A.commune} est à ${T.stationWalkMin} min à pied. De là, le Léman Express rejoint Genève-Eaux-Vives en ${TRAIN.eauxVives} min et Cornavin en ${TRAIN.cornavin} min, sans changement. Porte-à-porte, compte ${T.eauxVivesDoorToDoorMin} min jusqu'à Genève-Eaux-Vives, ${T.riveDoorToDoorMin} min jusqu'à Rive, au centre, et ${T.cornavinDoorToDoorMin} min jusqu'à Cornavin. Le tram 17 passe à ${T.tramStop.walkMin} min à pied, à l'arrêt ${T.tramStop.name}.` },
    { id: "page.faq.8", q: `Quelles sont les conditions pour louer à ${A.name} ?`, a: `Les mêmes que dans les maisons de La Villa Coliving. Aucune durée minimale imposée : ton bail est de ${B.leaseMonths} mois et tu peux partir quand tu veux avec ${B.noticeMonths} mois de préavis. ${deposit} Pour le garant, une seule règle : ${GUARANTOR_SENTENCE.fr}. Étudiants et alternants acceptés.` },
  ];
}

/**
 * Les 8 questions de la page, dans l'ordre, pour la liste visible ET le FAQPage (un seul, construit depuis la même liste). Les
 * questions 3 et 4 : textes de appartGammeExempt (piscine, sauna, salle de sport nommés pour les nier ou renvoyer aux maisons),
 * sauf la question 4 elle-même, qui ne nomme aucun équipement.
 */
export function appartFaq(lang: AppartPageLang): AppartQA[] {
  const ex = appartGammeExempt(lang);
  const own = new Map(appartFaqOwn(lang).map((x) => [x.id, x]));
  const pick = (id: string): AppartQA => {
    const qa = own.get(id);
    if (!qa) throw new Error(`appartFaq : question ${id} absente`);
    return qa;
  };
  const q4 = lang === "en"
    ? `What's the difference between ${A.name} and La Villa Coliving's houses?`
    : `Quelle est la différence entre ${A.name} et les maisons de La Villa Coliving ?`;
  return [
    pick("page.faq.1"),
    pick("page.faq.2"),
    { id: "page.faq.3", q: ex["page.faq.3.q"], a: ex["page.faq.3.r"] },
    { id: "page.faq.4", q: q4, a: ex["page.faq.4.r"] },
    pick("page.faq.5"),
    pick("page.faq.6"),
    pick("page.faq.7"),
    pick("page.faq.8"),
  ];
}

/** Titre de la FAQ et libellé du repli (« Voir les 3 autres questions », comme sur les pages maisons). */
export function appartFaqHeading(lang: AppartPageLang): { title: string; more: (n: number) => string } {
  return lang === "en"
    ? { title: "Frequently asked questions", more: (n) => `See the ${n} other questions` }
    : { title: "Questions fréquentes", more: (n) => `Voir les ${n} autres questions` };
}

// ── Fin de page ──────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Bloc « Tu veux piscine et sauna ? » : son titre et son texte sont des exceptions de gamme (appartGammeExempt) ; ici, le lien. */
export function appartHousesLink(lang: AppartPageLang): string {
  return lang === "en" ? `See the ${word(MAISONS_REFERRAL.totalHouses, "en")} houses` : `Voir les ${word(MAISONS_REFERRAL.totalHouses, "fr")} maisons`;
}

/** Appel final : titre, texte, boutons (libellés existants). */
export function appartFinalCta(lang: AppartPageLang): { title: string; text: string; apply: string; whatsapp: string } {
  const B = BRAND_TERMS;
  return lang === "en"
    ? { title: `Tempted by ${A.name}?`, text: `The application takes ${B.applyMinutes} minutes. We reply within ${B.responseHours} hours.`, apply: "Apply", whatsapp: "Ask a question on WhatsApp" }
    : { title: `${A.name} te tente ?`, text: `La candidature prend ${B.applyMinutes} minutes. On te répond sous ${B.responseHours} h.`, apply: "Candidater", whatsapp: "Poser une question sur WhatsApp" };
}

/** Message WhatsApp prérempli depuis /lappart. */
export function appartPageWhatsapp(lang: AppartPageLang): string {
  return lang === "en"
    ? `Hi! I'm interested in ${A.name}, the flatshare in ${A.commune}.`
    : `Bonjour ! ${A.name}, la colocation d'${A.commune}, m'intéresse.`;
}

// ── Fiche d'une chambre (/lappart/chambre-N, non indexée) ────────────────────────────────────────────────────────────────

/** Titre de la fiche : « Chambre 2 — L'Appart, Annemasse » / « Suite — L'Appart, Annemasse ». */
export function appartRoomTitle(roomNumber: number, lang: AppartPageLang): string {
  return `${roomLabel(A.key, roomNumber, lang)} — ${A.name}, ${A.commune}`;
}

/** H1 : « Chambre 2 à L'Appart » / « La suite de L'Appart ». */
export function appartRoomH1(roomNumber: number, lang: AppartPageLang): string {
  if (isAppartSuite(roomNumber)) return lang === "en" ? `The suite at ${A.name}` : `La suite de ${A.name}`;
  return lang === "en" ? `Room ${roomNumber} at ${A.name}` : `Chambre ${roomNumber} à ${A.name}`;
}

/** Fil d'Ariane visible : « Accueil › L'Appart › Chambre 2 » (le JSON-LD est injecté par le prérendu). */
export function appartRoomBreadcrumb(roomNumber: number, lang: AppartPageLang): readonly [string, string, string] {
  return [lang === "en" ? "Home" : "Accueil", A.name, roomLabel(A.key, roomNumber, lang)];
}

/**
 * Description de la fiche (partage : annonces, WhatsApp). `date` = date de la vue déjà formatée (état B), sinon la date
 * d'ouverture fixe, dans sa forme unique (« L'Appart ouvre à la location le 1er février 2027 »).
 * (Corrections du 13/11/2026, relecture technique) `availableNow` = la vue dit la chambre libre (après l'ouverture) : la phrase de
 * la pastille (« Libre maintenant », roomBadge) prend la place de « Libre dès le … », jamais la date d'ouverture passée — variante
 * absente de la source, à relire par Jérôme.
 */
export function appartRoomDescription(roomNumber: number, lang: AppartPageLang, date?: MaybeDate, availableNow = false): string {
  const B = BRAND_TERMS;
  const status = availableNow
    ? (lang === "en" ? "Available now" : "Libre maintenant")
    : date ? (lang === "en" ? `Available from ${date}` : `Libre dès le ${date}`) : null;
  if (isAppartSuite(roomNumber)) {
    if (lang === "en") {
      return status
        ? `The suite at ${A.name} in ${A.commune}: ${SUITE.surfaceM2} m², private shower room and toilet, for one or two people. ${status}. All-inclusive.`
        : `The suite at ${A.name} in ${A.commune}: ${SUITE.surfaceM2} m², private shower room and toilet, for one or two people. ${appartOpeningSentence("en")}`;
    }
    return status
      ? `La suite de ${A.name} à ${A.commune} : ${SUITE.surfaceM2} m², salle d'eau et WC privés, pour une ou deux personnes. ${status}. Tout compris.`
      : `La suite de ${A.name} à ${A.commune} : ${SUITE.surfaceM2} m², salle d'eau et WC privés, pour une ou deux personnes. ${appartOpeningSentence("fr")}`;
  }
  if (lang === "en") {
    return status
      ? `Room ${roomNumber} at ${A.name} in ${A.commune}: ${STD.surfaceM2} m², shared shower room. ${status}. All-inclusive, no application fee, reply within ${B.responseHours} h.`
      : `Room ${roomNumber} at ${A.name} in ${A.commune}: ${STD.surfaceM2} m², shared shower room. ${appartOpeningSentence("en")} All-inclusive, no application fee.`;
  }
  return status
    ? `Chambre ${roomNumber} de ${A.name} à ${A.commune} : ${STD.surfaceM2} m², salle d'eau partagée. ${status}. Tout compris, 0 frais de dossier, réponse sous ${B.responseHours} h.`
    : `Chambre ${roomNumber} de ${A.name} à ${A.commune} : ${STD.surfaceM2} m², salle d'eau partagée. ${appartOpeningSentence("fr")} Tout compris, 0 frais de dossier.`;
}

/** Présentation de la chambre (sous « La chambre »). */
export function appartRoomIntro(roomNumber: number, lang: AppartPageLang): string {
  if (isAppartSuite(roomNumber)) {
    return lang === "en"
      ? `The suite at ${A.name}, La Villa Coliving's flatshare in ${A.commune}: ${SUITE.surfaceM2} m², its own shower room and toilet, a private balcony and its own door onto the landing. ${A.rooms.bedCm} cm double bed, desk, wardrobe. It's let to one or two people.`
      : `La suite de ${A.name}, la colocation de La Villa Coliving à ${A.commune} : ${SUITE.surfaceM2} m², une salle d'eau et un WC privés, un balcon privatif et une porte indépendante sur le palier. Lit de ${A.rooms.bedCm}, bureau, penderie. Elle se loue à une ou deux personnes.`;
  }
  return lang === "en"
    ? `A furnished ${STD.surfaceM2} m² room at ${A.name}, La Villa Coliving's flatshare in ${A.commune}, near the station: ${A.rooms.bedCm} cm double bed, desk, wardrobe. The shower room and toilet are shared between the ${word(STD.sharedBathBetween, "en")} rooms.`
    : `Une chambre meublée de ${STD.surfaceM2} m² à ${A.name}, la colocation de La Villa Coliving à ${A.commune}, dans le quartier de la gare : lit de ${A.rooms.bedCm}, bureau, penderie. La salle d'eau et le WC sont partagés entre les ${word(STD.sharedBathBetween, "fr")} chambres.`;
}

/** Sous la galerie des pièces communes. */
export function appartRoomPhotoNote(lang: AppartPageLang): string {
  return lang === "en"
    ? `Room photo coming soon. The photos above show ${A.name}'s shared spaces.`
    : `Photo de la chambre à venir. Les photos ci-dessus montrent les pièces communes de ${A.name}.`;
}

/** Statut sous le prix : date de la vue (état B) — sinon l'ouverture fixe (état A, fiche statique). `availableNow` (la vue dit
 *  « libre » : après l'ouverture) : la phrase des fiches des maisons, reprise telle quelle. */
export function appartRoomStatus(lang: AppartPageLang, date?: MaybeDate, availableNow = false): string {
  const B = BRAND_TERMS;
  if (availableNow) {
    return lang === "en"
      ? `It's free right now: apply and we reply within ${B.responseHours} h.`
      : `Elle est libre dès maintenant : candidate, on te répond sous ${B.responseHours} h.`;
  }
  if (date) {
    return lang === "en"
      ? `It's available from ${date}: apply today to reserve it — reply within ${B.responseHours} h.`
      : `Elle est disponible le ${date} : candidate dès aujourd'hui pour la réserver, réponse sous ${B.responseHours} h.`;
  }
  return lang === "en"
    ? `${A.name} opens for rent on ${A.opensOnLabel.en}: apply today to reserve this room — reply within ${B.responseHours} h.`
    : `${A.name} ouvre à la location le ${A.opensOnLabel.fr} : candidate dès aujourd'hui pour réserver cette chambre, réponse sous ${B.responseHours} h.`;
}

/** Prix d'une chambre (offre : APPART, jamais la vue) en trois morceaux, et sa note « Tout compris · loyer contractuel … ». */
export function appartRoomPrice(roomNumber: number, lang: AppartPageLang): { chf: string; perMonth: string; note: string; suiteForTwo: string | null } {
  const tier = isAppartSuite(roomNumber) ? P.suite : P.room;
  const en = lang === "en";
  return {
    chf: tier[lang].chf,
    perMonth: en ? " /month" : " /mois",
    note: en ? `All-inclusive · contractual rent ${tier.en.eur}` : `Tout compris · loyer contractuel ${tier.fr.eur}`,
    suiteForTwo: isAppartSuite(roomNumber)
      ? (en ? `For one or two people: ${P.suite.en.eur} a month, or ${perPerson("en")} each for two.` : `Pour une ou deux personnes : ${P.suite.fr.eur} par mois, soit ${perPerson("fr")} par personne à deux.`)
      : null,
  };
}

/** Caractéristiques (libellés existants des fiches chambres : Surface, Étage, Salle d'eau, Meublée). */
export function appartRoomSpecs(roomNumber: number, lang: AppartPageLang): { label: string; value: string; kind: "size" | "floor" | "bath" | "furniture" }[] {
  const en = lang === "en";
  const suite = isAppartSuite(roomNumber);
  return [
    { kind: "size", label: en ? "Size" : "Surface", value: `${suite ? SUITE.surfaceM2 : STD.surfaceM2} m²` },
    { kind: "floor", label: en ? "Floor" : "Étage", value: floorText(lang) },
    {
      kind: "bath",
      label: en ? "Bathroom" : "Salle d'eau",
      value: suite
        ? (en ? "Private shower room and toilet" : "Salle d'eau et WC privés")
        : (en ? `Shower room and toilet shared between the ${STD.sharedBathBetween} rooms` : `Salle d'eau et WC partagés entre les ${STD.sharedBathBetween} chambres`),
    },
    { kind: "furniture", label: en ? "Furnished" : "Meublée", value: en ? `${A.rooms.bedCm} cm double bed, desk, wardrobe` : `Lit de ${A.rooms.bedCm}, bureau, penderie` },
  ];
}

/**
 * Compris / pas compris de la fiche chambre (à la place de « Tout est inclus dans le loyer » des maisons : linge, ménage trois
 * fois, équipements des maisons y seraient faux). La 3e ligne « pas compris » nomme piscine, sauna et salle de sport : la page
 * l'insère depuis appartGammeExempt (« chambre.pas-compris.3 »), à sa place.
 */
export function appartRoomIncluded(lang: AppartPageLang): { title: string; included: string[]; notIncludedBefore: string[]; notIncludedAfter: string[] } {
  const cleaning = timesPerWeek(A.cleaningPerWeek, lang);
  if (lang === "en") {
    return {
      title: "What's included, and what isn't",
      included: ["Bills: water, electricity, heating", "Fibre internet", "Streaming", `Cleaning of the shared areas ${cleaning}`, "Access to the houses' yoga and fitness classes", "Access to the houses' social evenings"],
      notIncludedBefore: ["Bed linen and towels", "Cleaning products and household supplies"],
      notIncludedAfter: ["Parking: on request", "Home insurance: yours to take out"],
    };
  }
  return {
    title: "Ce qui est compris, ce qui ne l'est pas",
    included: ["Charges : eau, électricité, chauffage", "Internet fibre", "Streaming", `Ménage des parties communes ${cleaning}`, "Accès aux cours de yoga et de sport des maisons", "Accès aux soirées des maisons"],
    notIncludedBefore: ["Linge de lit et serviettes", "Produits d'entretien et fournitures"],
    notIncludedAfter: ["Parking : sur demande", "Assurance habitation : à ta charge"],
  };
}

/** Le dépôt de garantie dans la forme des fiches chambres : « Caution de 2 mois de loyer hors charges, payable en 1, 2 ou 3 fois
 *  selon ton dossier, 0 € de frais de dossier et d'agence. » — tirée de FEES_DEPOSIT_SENTENCE (même caution, mêmes versements). */
export function appartDepositSentence(lang: AppartPageLang): string {
  const second = FEES_DEPOSIT_SENTENCE[lang].split(/(?<=\.)\s+/)[1] ?? "";
  const body = second.replace(/\.$/, "");
  return lang === "en"
    ? `${body.replace(/^Deposit: /, "Deposit of ")}, no application or agency fee.`
    : `${body.replace(/^Caution : /, "Caution de ")}, 0 € de frais de dossier et d'agence.`;
}

/** Bail et conditions de la fiche chambre : les deux phrases des fiches des maisons (bail, puis caution et frais). */
export function appartRoomLease(lang: AppartPageLang): { title: string; lease: string; deposit: string } {
  const B = BRAND_TERMS;
  return lang === "en"
    ? { title: "Lease and conditions", lease: `${B.leaseMonths}-month lease: you're free to leave at any time with ${B.noticeMonths} month's notice.`, deposit: appartDepositSentence("en") }
    : { title: "Bail et conditions", lease: `Bail de ${B.leaseMonths} mois : tu es libre de partir à tout moment avec ${B.noticeMonths} mois de préavis.`, deposit: appartDepositSentence("fr") };
}

/** Réassurance sous le bouton de la fiche : frais, caution, délai de réponse (« Visite en visio possible » retirée, question n° 35). */
export function appartRoomReassurance(lang: AppartPageLang): string[] {
  const second = FEES_DEPOSIT_SENTENCE[lang].split(/(?<=\.)\s+/)[1] ?? "";
  return [
    lang === "en" ? "No application or agency fee" : "0 € de frais de dossier et d'agence",
    second.replace(/\.$/, ""),
    ENTITY_FACTS_CTA[lang].note,
  ];
}

/** Bloc du lieu (à la place de « La maison : … ») : titre, texte, bouton, et la ligne de trajet découpée en deux repères. */
export function appartRoomPlace(lang: AppartPageLang): { title: string; text: string; cta: string; commute: string[] } {
  const commute = appartCommuteLine(lang).split(" · ").map(capital);
  return lang === "en"
    ? { title: "The flat", text: `${A.name}, in ${A.commune}, near the station: ${A.rooms.total} rooms, ${aOrAn(A.flat.livingKitchenM2)} ${A.flat.livingKitchenM2} m² living room and kitchen, and a balcony.`, cta: `Discover ${A.name}`, commute }
    : { title: "L'appartement", text: `${A.name}, à ${A.commune}, quartier de la gare : ${A.rooms.total} chambres, un séjour-cuisine de ${A.flat.livingKitchenM2} m² et un balcon.`, cta: `Découvrir ${A.name}`, commute };
}

/** Titre de la liste des autres fiches consultables de L'Appart. */
export function appartRoomOthersTitle(lang: AppartPageLang): string {
  return lang === "en" ? `The other rooms at ${A.name}` : `Les autres chambres de ${A.name}`;
}

/**
 * Chambre occupée sans date (état B+) : la fiche n'est plus consultable (comme celles des maisons) — un message, puis les
 * chambres à réserver. Titre et H1 : formes des fiches des maisons ; fin de la description : « … à L'Appart et dans nos maisons
 * près de Genève » (source) — le début reprend la phrase des maisons (texte composé, à relire).
 */
export function appartRoomUnavailable(roomNumber: number, lang: AppartPageLang): { title: string; description: string; h1: string; text: string; cta: string; all: string } {
  const label = roomLabel(A.key, roomNumber, lang);
  const suite = isAppartSuite(roomNumber);
  if (lang === "en") {
    return {
      title: `${label} — ${A.name}: not available`,
      description: `${suite ? `The suite at ${A.name}` : `${label} at ${A.name}`} isn't available right now. See the rooms you can book at ${A.name} and in our houses near Geneva.`,
      h1: "This room isn't available right now",
      text: suite
        ? `The suite at ${A.name} is occupied. Have a look at the rooms that are free now or soon — you can apply today to reserve one.`
        : `Room ${roomNumber} at ${A.name} is occupied. Have a look at the rooms that are free now or soon — you can apply today to reserve one.`,
      cta: `See the rooms at ${A.name}`,
      all: "Every available room",
    };
  }
  return {
    title: `${label} — ${A.name} : pas disponible`,
    description: `${suite ? `La suite de ${A.name}` : `La chambre ${roomNumber} de ${A.name}`} n'est pas disponible pour le moment. Découvre les chambres à réserver à ${A.name} et dans nos maisons près de Genève.`,
    h1: "Cette chambre n'est pas disponible pour le moment",
    text: suite
      ? `La suite de ${A.name} est occupée. Regarde les chambres libres maintenant ou bientôt : tu peux candidater dès aujourd'hui pour en réserver une.`
      : `La chambre ${roomNumber} de ${A.name} est occupée. Regarde les chambres libres maintenant ou bientôt : tu peux candidater dès aujourd'hui pour en réserver une.`,
    cta: `Voir les chambres de ${A.name}`,
    all: "Toutes les chambres disponibles",
  };
}

/** Message WhatsApp prérempli d'une fiche ; avec la date seulement si la vue la donne. */
export function appartRoomWhatsapp(roomNumber: number, lang: AppartPageLang, date?: MaybeDate): string {
  const suite = isAppartSuite(roomNumber);
  if (lang === "en") {
    const what = suite ? `the suite at ${A.name}` : `room ${roomNumber} at ${A.name}`;
    return date ? `Hi! I'm interested in ${what} (available from ${date}).` : `Hi! I'm interested in ${what}.`;
  }
  const what = suite ? `La suite de ${A.name}` : `La chambre ${roomNumber} de ${A.name}`;
  return date ? `Bonjour ! ${what} m'intéresse (disponible le ${date}).` : `Bonjour ! ${what} m'intéresse.`;
}

/** Bouton de la fiche (libellé existant des fiches chambres) et libellé de la visionneuse. */
export function appartRoomLabels(lang: AppartPageLang): { apply: string; whatsapp: string; theRoom: string; photos: (n: number) => string; reply: string } {
  return lang === "en"
    ? { apply: "Apply for this room", whatsapp: "Ask a question on WhatsApp", theRoom: "The room", photos: (n) => `See the ${n} photos`, reply: ENTITY_FACTS_CTA.en.note }
    : { apply: "Candidater pour cette chambre", whatsapp: "Poser une question sur WhatsApp", theRoom: "La chambre", photos: (n) => `Voir les ${n} photos`, reply: ENTITY_FACTS_CTA.fr.note };
}

// ── Contrôles internes (sans base) ───────────────────────────────────────────────────────────────────────────────────────

/** Incohérences détectables sans base : nombres écrits en lettres hors table, « dès 530 », « au / du L'Appart », placeholders. */
export function appartPageIssues(): string[] {
  const issues: string[] = [];
  for (const n of [A.rooms.total, A.rooms.total - 1, STD.numbers.length, STD.sharedBathBetween, MAISONS_REFERRAL.totalHouses]) {
    if (!WORD_FR[n] || !WORD_EN[n]) issues.push(`nombre ${n} hors de la table des mots`);
  }
  if (A.cleaningPerWeek > 3) issues.push(`fréquence ${A.cleaningPerWeek} hors de la table`);
  if (!MONTHS_FR[OPEN_M - 1] || !MONTHS_EN[OPEN_M - 1] || !OPEN_Y) issues.push("date d'ouverture illisible");
  const all: string[] = [];
  for (const lang of ["fr", "en"] as const) {
    const h = appartPageHero(lang), lead = appartPageLead(lang), r = appartRoomsSection(lang), w = appartWaitlistText(lang);
    const full = appartFullText(lang), liv = appartLivingSection(lang), s = appartSuiteSection(lang), c = appartConditionsSection(lang);
    const fin = appartFinalCta(lang);
    all.push(appartPageTitle(lang), appartPageDescription(lang), appartPageDescriptionAfterOpening(lang), ...appartPageBreadcrumb(lang),
      h.eyebrow, h.h1, ...h.markers, h.pricePill, lead.lead, lead.price, appartPageDpe(lang),
      ...Object.values(r), ...appartTypeCards(lang).flatMap((t) => Object.values(t).filter((v): v is string => typeof v === "string")),
      ...Object.values(w), full.title, full.text, full.link, liv.title, liv.text, liv.album(8), s.title, s.text, c.title, c.intro, c.profiles,
      ...appartFaqOwn(lang).flatMap((x) => [x.q, x.a]), appartHousesLink(lang), fin.title, fin.text, appartPageWhatsapp(lang));
    for (const n of [2, 3, 4, APPART_SUITE_ROOM_NUMBER]) {
      const u = appartRoomUnavailable(n, lang), pr = appartRoomPrice(n, lang);
      all.push(appartRoomTitle(n, lang), appartRoomH1(n, lang), ...appartRoomBreadcrumb(n, lang), appartRoomDescription(n, lang), appartRoomDescription(n, lang, "x"),
        appartRoomDescription(n, lang, null, true),
        appartRoomIntro(n, lang), appartRoomStatus(lang), appartRoomStatus(lang, "x"), pr.chf, pr.note, ...(pr.suiteForTwo ? [pr.suiteForTwo] : []),
        ...appartRoomSpecs(n, lang).map((x) => x.value), u.title, u.description, u.h1, u.text, u.cta, appartRoomWhatsapp(n, lang), appartRoomWhatsapp(n, lang, "x"));
    }
    const inc = appartRoomIncluded(lang), lease = appartRoomLease(lang), place = appartRoomPlace(lang);
    all.push(appartRoomPhotoNote(lang), inc.title, ...inc.included, ...inc.notIncludedBefore, ...inc.notIncludedAfter, lease.lease, lease.deposit,
      ...appartRoomReassurance(lang), place.title, place.text, place.cta, ...place.commute, appartRoomOthersTitle(lang));
  }
  for (const s of all) {
    const at = `« ${s.slice(0, 70)}… »`;
    if (/\b(?:dès|from)\s+(?:€\s?)?530\b/i.test(s)) issues.push(`« dès 530 » (P5 : jamais) — ${at}`);
    if (/\b(?:au|du|le) L'Appart\b/.test(s)) issues.push(`« au / du / le L'Appart » — ${at}`);
    if (/\{\{|\[FAIT À CONFIRMER|undefined|NaN|\[object|…/.test(s)) issues.push(`placeholder — ${at}`);
    if (/piscine|sauna|salle de sport|\bpools?\b|\bgyms?\b/i.test(s)) issues.push(`équipement des maisons hors des exceptions de gamme — ${at}`);
  }
  return issues;
}
