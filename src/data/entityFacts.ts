/**
 * Fiche de faits canonique de l'entité La Villa Coliving (Lot S1, brief « Socle entité », 05/09/2026).
 *
 * Pourquoi : les assistants IA lisaient des pages différentes du site et en tiraient des prix,
 * des minutes, des durées et des cautions différents (baseline 03/09 : 11 recommandations exactes
 * sur 58). Cette fiche est rendue à l'identique — au caractère près, FR et EN — par
 * <EntityFacts/> sur 14 pages money et 8 articles (D13), asserte par scripts/check-entity-facts.mjs
 * (base ↔ source ↔ HTML prérendu ↔ llms.txt) et réutilisée par scripts/build-llms-txt.mjs.
 *
 * Règles :
 *  - `src/data/stats.ts` reste le MAÎTRE numérique (prix dérivés du contrat en €, taux BCE figé,
 *    chambres par maison, surfaces, ménage, caution, bail) ; ce fichier assemble et rédige.
 *  - Textes = chaînes plates (pas de JSX), nombres formatés par `thousands()` (jamais toLocaleString :
 *    règle anti-#418), aucune date calculée, aucune donnée Supabase : fonction pure, rendu identique
 *    au build (Puppeteer) et au client.
 *  - Imports RELATIFS uniquement et zéro React : les scripts Node (esbuild) chargent ce module.
 *  - Une valeur non arbitrée porte le préfixe ENTITY_FACTS_PLACEHOLDER : visible en preview,
 *    refusée au build par check-entity-facts.mjs.
 *
 * Décisions Jérôme du 04-05/09/2026 (plan §2 bis) : D1-D3 trajets par maison · D4 20 min partout ·
 * D5 « Bail de 12 mois : tu es libre de partir à tout moment avec 1 mois de préavis. » (révisée le 29/09/2026, plus d'engagement minimum) ·
 * D6 aucune promesse sur le garant, seule la caution (2 mois hors charges) · D7 loyer contractuel en € ·
 * D9 16-24 m² (bornes de v_public_rooms) · D10 Instagram la_villa_coliving_geneva, pas de Facebook ·
 * D12 le bloc ne cite que le prix d'appel des maisons, « dès 1 290 CHF » depuis le 19/11/2026 (HOUSES_FROM, src/data/stats.ts ;
 * « dès 1 370 CHF » du 01/09 au 18/11/2026) — jamais 1 430, jamais le détail des paliers.
 * (Lot L3, D4 Jérôme 09/10/2026) Puce « Avis : 4,8/5 sur Google (36 avis). » = GOOGLE_REVIEWS via STATS_DISPLAY.googleRating ;
 * jamais d'aggregateRating. Le lien « Voir les avis » vit dans les pages (hero, /candidature…), pas dans la fiche (chaînes plates).
 * (L'Appart, Lot 4 du brief du 12/11/2026, textes du 13/11 « à confirmer ») La fiche porte les TROIS phrases canoniques : la marque
 * (paragraphe, « dès » de la marque = celui de L'Appart), les maisons (puce 1, leur « dès » D12) et L'Appart (puce 4) ; chaque
 * prix n'y est écrit qu'une fois, jamais un prix de L'Appart dans la phrase d'un équipement des maisons (règle V2, par phrase).
 * `/lappart` ne porte pas cette fiche mais la sienne (src/data/appartFacts.ts, décision n° 13).
 */
import {
  STATS,
  STATS_DISPLAY,
  GOOGLE_REVIEWS,
  STATS_SHARED_BATH,
  HOUSES_FROM,
  CONTRACT_EUR,
  ROOMS_BY_HOUSE,
  TRANSIT,
  GENEVA_COMMUTE_FORMULA,
  GOOGLE_REVIEWS_LINK_LABEL,
} from "./stats";
import { FOUNDERS, FOUNDING_DATE, LAVILLA_SAME_AS } from "../lib/structuredData";
import { PRICE_KEY_SENTENCE, PREMIUM_SENTENCE } from "./priceFacts";
import type { MaisonKey } from "./places";
import { APPART } from "./appart";
import { appartCommuteLine } from "./appartLocation";

export type EntityLang = "fr" | "en";
/** Une des 3 maisons — alias de `MaisonKey` (src/data/places.ts) : ENTITY_HOUSES et la fiche ne décrivent que les maisons. */
export type EntityHouseSlug = MaisonKey;

/** Incrémenter à chaque changement de texte : porté par data-entity-facts-version, comparé par la CI. */
// (Lot L1 « ingénierie des créneaux », 09/10/2026) Trajets réalignés sur TRANSIT (D1-L1), paragraphe sur la formule D1.
// (Lot L3, relecture adverse du 10/10/2026) La puce « Avis » expose son lien (reviewsLink) : la fiche ne publie jamais la note sans « Voir les avis ».
// (Lot L4 « justification du prix », D8, 10/10/2026) Puce « phrase-clé » A.4 (PRICE_KEY_SENTENCE, src/data/priceFacts.ts) après le loyer ;
// la même phrase ouvre le bloc tarifs de /tarifs — la garde l'attend donc 2× sur /tarifs, 1× ailleurs.
// (Lot L3, 10/10/2026) Puce « Avis : 4,8/5 sur Google (36 avis). » ajoutée (D4) — à incrémenter à chaque relevé mensuel
// (la date sert aussi de « Dernière mise à jour » dans llms.txt : garder une vraie date AAAA-MM-JJ, suffixe b, c… si besoin).
// (02/11/2026, brief « caution permanente ») Puce caution : « payable en 1, 2 ou 3 fois selon ton dossier » (règle permanente, D3-bis).
// (12/11/2026, décision Jérôme) Trajets : gare à pied 9 / 9 / 8 min, porte-à-porte Eaux-Vives 17 / 17 / 16, formule « 16 à 17 min ».
// (12/11/2026, décision Jérôme, lot « borne basse », suffixe « b ») Formule : « 25 min jusqu'au centre » (30 avant) — Le Lodge à 25 min de Rive.
// (13/11/2026, décision Jérôme du 12/11) Prix d'appel des maisons : « dès 1 290 CHF/mois (loyer contractuel en euros : dès 1 380 €) » —
// chambres 7 et 8 de La Villa (1 370 CHF / 1 470 € avant). Mise en ligne retenue : le 19/11/2026 ; si la séance glisse, redater ENTITY_FACTS_VERSION, OU_CHERCHER_VERSION et PRICE_FACTS_VERSION, puis npm run build:llms.
// (L'Appart, Lot 4) Fiche recomposée : trois phrases canoniques (marque, maisons, L'Appart), neuf puces, L'Appart dans les
// trajets, « 100+ résidents accueillis dans les maisons ». Version du jour de la mise en ligne de L'Appart : si elle glisse,
// redater ENTITY_FACTS_VERSION, OU_CHERCHER_VERSION, PRICE_FACTS_VERSION, APPART_FACTS_VERSION et APPART_LOCATION_VERSION,
// puis npm run build:llms.
export const ENTITY_FACTS_VERSION = "2026-11-21"; // 21/11/2026 : puce « premium » (PREMIUM_SENTENCE), « 38 à 49 m² » par personne

/**
 * Phrase garant canonique (D0 amendement b, Jérôme 09/10/2026) — la SEULE formulation admise sur le site :
 * jamais « sans garant », jamais « toujours avant la visite ». Reprise par le bloc « Où chercher » (Ton dossier),
 * la réponse A.6 des articles (src/data/answerSlots.ts) et la FAQ « Il faut un garant ? » (situationsFaq).
 */
export const GUARANTOR_SENTENCE = {
  fr: "un garant n'est demandé qu'au cas par cas, quand le contrat ne couvre pas le loyer — on t'en parle avant de te répondre, jamais après la visite",
  en: "a guarantor is only asked for case by case, when the contract does not cover the rent — we tell you before we reply, never after the visit",
} as const;

/*
 * (L'Appart, 13/11/2026) Phrases de la fiche COMMUNES aux deux gammes — mêmes bail, caution, frais et réponse à L'Appart que
 * dans les maisons. Exportées par leur nom pour la fiche de L'Appart (src/data/appartFacts.ts, `appartFactsText`), qui les
 * reprend au caractère près ; la fiche de la marque les lit ici aussi : son texte ne change pas d'un caractère.
 */
/** Puce « bail » des deux fiches (D5 révisée le 29/09/2026). */
export const LEASE_SENTENCE = {
  fr: `Bail de ${STATS.leaseDurationMonths} mois : tu es libre de partir à tout moment avec ${STATS.noticePeriodMonths} mois de préavis.`,
  en: `${STATS.leaseDurationMonths}-month lease: you're free to leave at any time with ${STATS.noticePeriodMonths} month's notice.`,
} as const;
/** Puce « frais et caution » des deux fiches (caution jamais chiffrée ; versements : règle permanente du 02/11/2026). */
export const FEES_DEPOSIT_SENTENCE = {
  fr: `0 € de frais de dossier, 0 € de frais d'agence. Caution : ${STATS.depositMonths} mois de loyer hors charges, payable en 1, 2 ou 3 fois selon ton dossier.`,
  en: `No application fee, no agency fee. Deposit: ${STATS.depositMonths} months' rent excluding charges, payable in 1, 2 or 3 instalments depending on your application.`,
} as const;
/** Bouton des deux fiches et sa microcopie (T13 du 13/10/2026 : hors du comptage « 1× par page », vérifiés dans le bloc). */
export const ENTITY_FACTS_CTA = {
  fr: { cta: "Candidater", note: `Réponse sous ${STATS.responseHours} h` },
  en: { cta: "Apply", note: `Reply within ${STATS.responseHours} h` },
} as const;

/**
 * Entité juridique PUBLIÉE (article « Non, La Villa Coliving n'est pas une arnaque », décision Q3 de Jérôme du 16/10/2026) —
 * source unique du bloc de vérification (<VerifyBlock/>) et des mentions légales. Seule la SCI Sleep In est citée : elle
 * porte le site et la marque ; la structure de détention de chaque maison n'est pas publiée (ne pas ajouter d'autre entité
 * sans décision). Valeurs relevées sur l'annuaire officiel le 16/10/2026 (`registryUrl`, forme canonique de la fiche).
 */
export const LEGAL_ENTITY = {
  name: "SCI Sleep In",
  registeredName: "SLEEP IN",
  capitalEur: "1 000",
  siren: "882 153 810",
  siretHq: "882 153 810 00016",
  rcsCity: "Thonon-les-Bains",
  registeredOn: "04/03/2020",
  headOffice: "8 rue du Mont Blanc, 74100 Annemasse, France",
  vat: "FR63882153810",
  registryUrl: "https://annuaire-entreprises.data.gouv.fr/entreprise/sleep-in-882153810",
  checkedOn: "2026-10-16",
} as const;

/** Ligne courte de trajet d'une maison (A.1, D1-L1) : deux segments « a · b » (RoomDetailPage les affiche séparément). */
export function houseCommuteLine(slug: EntityHouseSlug, lang: EntityLang): string {
  const T = TRANSIT.byHouse[slug];
  const ev = T.eauxVivesDoorToDoorMin;
  if (slug === "leloft") {
    const tram = TRANSIT.byHouse.leloft.tramWalkMin;
    return lang === "en"
      ? `tram 17 stop ${tram} min on foot, Annemasse station ${T.stationWalkMin} min · Geneva Eaux-Vives in ${ev} min door-to-door`
      : `tram 17 à ${tram} min à pied, gare d'Annemasse à ${T.stationWalkMin} min · Genève-Eaux-Vives en ${ev} min porte-à-porte`;
  }
  return lang === "en"
    ? `Annemasse station ${T.stationWalkMin} min on foot · Geneva Eaux-Vives in ${ev} min door-to-door`
    : `gare d'Annemasse à ${T.stationWalkMin} min à pied · Genève-Eaux-Vives en ${ev} min porte-à-porte`;
}
/** Préfixe d'une valeur non encore arbitrée (bloquant au build). */
export const ENTITY_FACTS_PLACEHOLDER = "[FAIT À CONFIRMER";

export interface EntityHouse {
  slug: EntityHouseSlug;
  label: string;
  commune: string;
  rooms: number;
  /** Chambres à salle d'eau partagée entre 2 chambres — 4 à La Villa (deux paliers de prix : chambres 3 et 4, chambres 7 et 8,
   *  STATS_SHARED_BATH.tiers), 0 ailleurs. */
  sharedBathRooms: number;
  /** Équipements distinctifs, forme courte (cartes, houses.ts). */
  amenities: Record<EntityLang, string>;
  /** Trajet canonique (D1-L1, 09/10/2026) : ligne courte A.1 dérivée de TRANSIT, une phrase par maison. */
  commute: Record<EntityLang, string>;
  /** Quartier, quand la commune ne suffit pas (Le Lodge : Romagny) — phrases de commune du lot L1. */
  district?: Record<EntityLang, string>;
}

const MIN = STATS.genevaCenterMinutes;

export const ENTITY_HOUSES: readonly EntityHouse[] = [
  {
    slug: "lavilla",
    label: "La Villa",
    commune: "Ville-la-Grand",
    rooms: ROOMS_BY_HOUSE.lavilla,
    sharedBathRooms: STATS_SHARED_BATH.rooms,
    amenities: { fr: "piscine extérieure chauffée · sauna · salle de sport", en: "heated outdoor pool · sauna · gym" },
    commute: { fr: houseCommuteLine("lavilla", "fr"), en: houseCommuteLine("lavilla", "en") },
  },
  {
    slug: "leloft",
    label: "Le Loft",
    commune: "Ambilly",
    rooms: ROOMS_BY_HOUSE.leloft,
    sharedBathRooms: 0,
    amenities: { fr: "piscine intérieure chauffée · sauna · salle de sport", en: "heated indoor pool · sauna · gym" },
    commute: { fr: houseCommuteLine("leloft", "fr"), en: houseCommuteLine("leloft", "en") },
  },
  {
    slug: "lelodge",
    label: "Le Lodge",
    commune: "Annemasse",
    rooms: ROOMS_BY_HOUSE.lelodge,
    sharedBathRooms: 0,
    amenities: { fr: "piscine · sauna · chalet fitness", en: "pool · sauna · fitness chalet" },
    commute: { fr: houseCommuteLine("lelodge", "fr"), en: houseCommuteLine("lelodge", "en") },
    district: { fr: "quartier de Romagny", en: "Romagny district" },
  },
];

/**
 * (L'Appart, 13/11/2026) Les faits des MAISONS que les textes de L'Appart citent quand ils y RENVOIENT (« Tu veux piscine et
 * sauna ? Les maisons, dès 1 290 CHF. », FAQ « la différence avec les maisons », bloc « Tu veux piscine et sauna ? ») : seule
 * porte des faits des maisons vers src/data/appartFacts.ts, qui n'importe ni STATS ni les tables des maisons (règle de
 * frontière, eslint.config.js et tools/test/appart-boundary.test.mjs). Ces textes sont les exceptions de la garde de gamme.
 */
export const MAISONS_REFERRAL = {
  totalHouses: STATS.totalHouses,
  houses: ENTITY_HOUSES.map((h) => ({ label: h.label, commune: h.commune })),
  surfaces: { min: STATS.roomSizeMin, max: STATS.roomSizeMax },
  residents: { min: STATS.minResidentsPerHouse, max: STATS.maxResidentsPerHouse },
  cleaningPerWeek: STATS.cleaningPerWeek,
  /** Nombre de services de la grille de /tarifs (celle des maisons : « la liste des 24 services […] est celle des maisons »). */
  includedItems: STATS.includedItems,
  from: { fr: HOUSES_FROM.fr.chf, en: HOUSES_FROM.en.chf },
} as const;

/** Renvoi de L'Appart vers les maisons (« dès » des maisons = HOUSES_FROM) : dernière cellule de la ligne « Piscine, sauna,
 *  salle de sport » du tableau de L'Appart, lien vers /nos-maisons. */
export const MAISONS_CROSS_LINK = {
  fr: `Tu veux piscine et sauna ? Les maisons, dès ${HOUSES_FROM.fr.chf}.`,
  en: `Want a pool and a sauna? The houses, from ${HOUSES_FROM.en.chf}.`,
} as const;

/** « Dès » de la marque : le plus bas des deux gammes (L'Appart, 730 CHF / 790 €). */
const BRAND_FROM = APPART.price.from.eur < HOUSES_FROM.eur ? APPART.price.from : HOUSES_FROM;

/**
 * (L'Appart, 13/11/2026) Phrases canoniques de L'Appart et de la marque (Lot 4, textes du 13/11 « à confirmer ») : la fiche de
 * L'Appart (/lappart) les porte telles quelles (paragraphe et dernière puce) ; la fiche de la marque aussi (paragraphe et puce 4,
 * étape E5), avec la phrase des maisons (MAISONS_CANONICAL_SENTENCE, puce 1). La garde les compte exactement une fois par page
 * porteuse : jamais dans un bloc statique « L'Appart », jamais dans le pied de page. llms.txt les répète au caractère près.
 */
export const APPART_CANONICAL_SENTENCE = {
  fr: `${APPART.name}, ${APPART.descriptor.fr} : ${APPART.rooms.total} chambres meublées de ${APPART.rooms.surface.min} à ${APPART.rooms.surface.max} m² dans un appartement de ${APPART.flat.surfaceM2} m², charges, fibre, streaming et ménage des communs compris, dès ${APPART.price.from.fr.chf}/mois (loyer contractuel en euros : dès ${APPART.price.from.fr.eur}). La suite accueille une ou deux personnes.`,
  en: `${APPART.name}, a ${APPART.descriptor.en}: ${APPART.rooms.total} furnished rooms of ${APPART.rooms.surface.min} to ${APPART.rooms.surface.max} m² in a ${APPART.flat.surfaceM2} m² flat, bills, fibre, streaming and cleaning of the shared areas included, from ${APPART.price.from.en.chf}/month (contractual rent in euros: from ${APPART.price.from.en.eur}). The suite is for one or two people.`,
} as const;
export const BRAND_CANONICAL_SENTENCE = {
  fr: `La Villa Coliving : ${STATS.totalHouses + 1} adresses côté France, à la frontière de Genève — ${STATS.totalHouses} maisons de coliving et un appartement en colocation, ${STATS.totalRooms + APPART.rooms.total} chambres, tout compris dès ${BRAND_FROM.fr.chf}/mois (loyer contractuel en euros : dès ${BRAND_FROM.fr.eur}).`,
  en: `La Villa Coliving: ${STATS.totalHouses + 1} locations on the Geneva border, French side — ${STATS.totalHouses} coliving houses and one shared flat, ${STATS.totalRooms + APPART.rooms.total} rooms, all inclusive from ${BRAND_FROM.en.chf}/month (contractual rent in euros: from ${BRAND_FROM.en.eur}).`,
} as const;
/** (L'Appart, 13/11/2026, étape E5) Phrase canonique des MAISONS : les 3 maisons, leurs 29 chambres, leurs équipements, leur
 *  « dès » (HOUSES_FROM, D12) — puce 1 de la fiche de la marque et ligne de llms.txt. Jamais un prix de L'Appart dedans. */
export const MAISONS_CANONICAL_SENTENCE = {
  fr: `${STATS.totalHouses} maisons de coliving (${ENTITY_HOUSES.map((h) => `${h.label} · ${h.commune}`).join(", ")}) : ${STATS.totalRooms} chambres meublées de ${STATS.roomSizeMin} à ${STATS.roomSizeMax} m², piscine, sauna et salle de sport, tout compris dès ${HOUSES_FROM.fr.chf}/mois (loyer contractuel en euros : dès ${HOUSES_FROM.fr.eur}).`,
  en: `${STATS.totalHouses} coliving houses (${ENTITY_HOUSES.map((h) => `${h.label} · ${h.commune}`).join(", ")}): ${STATS.totalRooms} furnished rooms of ${STATS.roomSizeMin} to ${STATS.roomSizeMax} m², pool, sauna and gym, all inclusive from ${HOUSES_FROM.en.chf}/month (contractual rent in euros: from ${HOUSES_FROM.en.eur}).`,
} as const;

export const ENTITY_FACTS = {
  version: ENTITY_FACTS_VERSION,
  name: "La Villa Coliving",
  houses: ENTITY_HOUSES,
  totalHouses: STATS.totalHouses,
  totalRooms: STATS.totalRooms,
  surfaces: { min: STATS.roomSizeMin, max: STATS.roomSizeMax },
  price: {
    // « Dès » des maisons = palier le plus bas (HOUSES_FROM : chambres 7 et 8 de La Villa depuis le 19/11/2026).
    fromChf: HOUSES_FROM.chf,
    fromEur: HOUSES_FROM.eur,
    standardChf: STATS.priceChf,
    standardEur: CONTRACT_EUR.standard,
    fr: { fromChf: HOUSES_FROM.fr.chf, fromEur: HOUSES_FROM.fr.eur },
    en: { fromChf: HOUSES_FROM.en.chf, fromEur: HOUSES_FROM.en.eur },
    /** Paliers des chambres à salle d'eau partagée de La Villa, chambre par chambre (numéros = rooms.room_number) : la garde
     *  check-entity-facts compare CHAQUE chambre de v_public_rooms à son palier (les 25 autres = standard) ; llms.txt les détaille.
     *  `approxM2` (null si le palier n'en cite pas) = surface de la FAQ des tarifs, gardée aussi (tierSurfaceIssues). */
    sharedBathTiers: STATS_SHARED_BATH.tiers.map((t) => ({ house: "lavilla" as const, rooms: t.rooms, eur: t.eur, chf: t.chf, approxM2: t.approxM2 ?? null, fr: t.fr, en: t.en })),
  },
  cleaningPerWeek: STATS.cleaningPerWeek,
  fiberSpeed: STATS.fiberSpeed,
  depositMonths: STATS.depositMonths,
  lease: { months: STATS.leaseDurationMonths, noticeMonths: STATS.noticePeriodMonths },
  genevaMinutes: MIN,
  transit: TRANSIT,
  commuteFormula: GENEVA_COMMUTE_FORMULA,
  guarantor: GUARANTOR_SENTENCE,
  founders: [FOUNDERS.jerome.name, FOUNDERS.fanny.name] as readonly string[],
  foundingDate: FOUNDING_DATE,
  foundingLabel: { fr: "octobre 2021", en: "October 2021" },
  totalResidents: STATS.totalResidents,
  responseHours: STATS.responseHours,
  sameAs: LAVILLA_SAME_AS,
  // (Lot L3, D4, 09/10/2026) Note Google — phrases prêtes (STATS_DISPLAY.googleRating) + url de la fiche pour llms.txt.
  googleReviews: {
    rating: GOOGLE_REVIEWS.rating,
    ratingEn: GOOGLE_REVIEWS.ratingEn,
    count: GOOGLE_REVIEWS.count,
    url: GOOGLE_REVIEWS.url,
    checkedOn: GOOGLE_REVIEWS.checkedOn,
    fr: STATS_DISPLAY.fr.googleRating,
    en: STATS_DISPLAY.en.googleRating,
  },
  // (L'Appart, 13/11/2026) Les clés ci-dessus gardent leur sens « maisons » (3 maisons, 29 chambres, 16-24 m², « dès 1 290 CHF ») :
  // aucune garde ni gabarit existant ne change. L'Appart et la marque ont leurs propres blocs, lus par les gardes par gamme.
  /** L'Appart (APPART, src/data/appart.ts) : ce que v_public_rooms doit rendre pour lui après la bascule (garde check:facts). */
  appart: {
    name: APPART.name,
    rooms: APPART.rooms.total,
    numbers: APPART.rooms.numbers,
    suite: APPART.rooms.suite.number,
    sharedBathRooms: APPART.rooms.standard.numbers.length,
    surfaces: { min: APPART.rooms.surface.min, max: APPART.rooms.surface.max },
    price: {
      fromChf: APPART.price.from.chf,
      fromEur: APPART.price.from.eur,
      toChf: Math.max(APPART.price.room.chf, APPART.price.suite.chf),
      toEur: Math.max(APPART.price.room.eur, APPART.price.suite.eur),
      /** Chambre par chambre (numéros = rooms.room_number) : loyer, surface, salle d'eau. */
      tiers: [
        { rooms: APPART.rooms.standard.numbers, eur: APPART.price.room.eur, chf: APPART.price.room.chf, surfaceM2: APPART.rooms.standard.surfaceM2, bathroom: "shared" as const },
        { rooms: [APPART.rooms.suite.number] as readonly number[], eur: APPART.price.suite.eur, chf: APPART.price.suite.chf, surfaceM2: APPART.rooms.suite.surfaceM2, bathroom: "private" as const },
      ],
    },
    opensOn: APPART.opensOn,
  },
  /** La marque (les deux gammes) : 4 adresses, 33 chambres, de 730 à 1 430 CHF — jamais une valeur « maisons » ci-dessus. */
  brand: {
    places: STATS.totalHouses + 1,
    totalRooms: STATS.totalRooms + APPART.rooms.total,
    price: {
      fromChf: BRAND_FROM.chf,
      fromEur: BRAND_FROM.eur,
      toChf: Math.max(STATS.priceChf, APPART.price.suite.chf, APPART.price.room.chf),
      toEur: Math.max(CONTRACT_EUR.standard, APPART.price.suite.eur, APPART.price.room.eur),
    },
  },
} as const;

export interface EntityFactsText {
  title: string;
  paragraph: string;
  bullets: readonly string[];
  /** (Retenue premium, lot 1, T13 — Jérôme 13/10/2026) Bouton secondaire en casse normale, sans promesse dans le libellé ;
   *  la réassurance va en microcopie dessous (`ctaNote`). Ni l'un ni l'autre n'entre dans entityFactsStrings : « Candidater »
   *  et « Réponse sous 48 h » existent ailleurs sur les pages (barre fixée, cartes, réassurance) ; la garde les vérifie DANS
   *  le bloc (entityFactsCtaIssues, scripts/check-entity-facts.mjs). */
  cta: string;
  ctaNote: string;
  /** (Lot L3, D4) La puce « Avis : … » est TOUJOURS suivie du lien « Voir les avis » vers la fiche Google : le composant rend
   *  la phrase (un nœud texte) puis un <a> séparé — le libellé du lien n'entre pas dans entityFactsStrings (il vit aussi dans le hero). */
  reviewsLink: { bullet: string; label: string; href: string };
}

/**
 * Le texte canonique — identique sur toutes les pages, langue par langue. (L'Appart, étape E5, textes du 13/11 « à confirmer »)
 * Paragraphe = phrase de la marque + formule de trajet des maisons ; puces : maisons (phrase canonique), ce que leur loyer comprend
 * en plus (sans prix), phrase-clé A.4, L'Appart (phrase canonique), frais et caution, bail, trajets (les 3 maisons puis L'Appart,
 * APPART.transit — jamais dans la formule de la marque), note Google, « pour qui » (100+ résidents accueillis DANS LES MAISONS).
 */
export function entityFactsText(lang: EntityLang): EntityFactsText {
  const F = ENTITY_FACTS;
  // Séparateur des trajets : « ; » précédé d'une espace en français, collé au mot en anglais (« door-to-door; Le Loft »).
  const commutes = [...ENTITY_HOUSES.map((h) => `${h.label} — ${h.commute[lang]}`), `${APPART.name} — ${appartCommuteLine(lang)}`].join(lang === "en" ? "; " : " ; ");
  const reviewsBullet = { fr: `Avis : ${F.googleReviews.fr}.`, en: `Reviews: ${F.googleReviews.en}.` };
  if (lang === "en") {
    return {
      title: "La Villa Coliving — the essentials",
      paragraph: `${BRAND_CANONICAL_SENTENCE.en} ${F.commuteFormula.en}.`,
      bullets: [
        MAISONS_CANONICAL_SENTENCE.en,
        // (21/11/2026) La phrase « premium » de Jérôme remplace « In the houses, the rent also covers… » (même contenu, plus l'espace).
        PREMIUM_SENTENCE.en,
        PRICE_KEY_SENTENCE.en,
        APPART_CANONICAL_SENTENCE.en,
        FEES_DEPOSIT_SENTENCE.en,
        LEASE_SENTENCE.en,
        `Commute: ${commutes}.`,
        reviewsBullet.en,
        `Who it's for: cross-border workers, expats and young professionals working in Geneva. Founded in ${F.foundingLabel.en} by ${F.founders.join(" and ")} and run directly by them — ${F.totalResidents}+ residents welcomed in the houses.`,
      ],
      cta: ENTITY_FACTS_CTA.en.cta,
      ctaNote: ENTITY_FACTS_CTA.en.note,
      reviewsLink: { bullet: reviewsBullet.en, label: GOOGLE_REVIEWS_LINK_LABEL.en, href: F.googleReviews.url },
    };
  }
  return {
    title: "La Villa Coliving — l'essentiel",
    paragraph: `${BRAND_CANONICAL_SENTENCE.fr} ${F.commuteFormula.fr}.`,
    bullets: [
      MAISONS_CANONICAL_SENTENCE.fr,
      // (21/11/2026) La phrase « premium » de Jérôme remplace « Dans les maisons, le loyer comprend aussi… » (même contenu, plus l'espace).
      PREMIUM_SENTENCE.fr,
      PRICE_KEY_SENTENCE.fr,
      APPART_CANONICAL_SENTENCE.fr,
      FEES_DEPOSIT_SENTENCE.fr,
      LEASE_SENTENCE.fr,
      `Trajets : ${commutes}.`,
      reviewsBullet.fr,
      `Pour qui : frontaliers, expats et jeunes professionnels qui travaillent à Genève. Fondée en ${F.foundingLabel.fr} par ${F.founders.join(" et ")}, gérée en direct — ${F.totalResidents}+ résidents accueillis dans les maisons.`,
    ],
    cta: ENTITY_FACTS_CTA.fr.cta,
    ctaNote: ENTITY_FACTS_CTA.fr.note,
    reviewsLink: { bullet: reviewsBullet.fr, label: GOOGLE_REVIEWS_LINK_LABEL.fr, href: F.googleReviews.url },
  };
}

/**
 * Chaînes canoniques comptées « exactement une fois par page » par les gardes : titre, paragraphe, puces.
 * Le bouton et sa microcopie (T13, 13/10/2026) en sont exclus — vérifiés une fois DANS le bloc (entityFactsCtaIssues).
 */
export function entityFactsStrings(lang: EntityLang): string[] {
  const t = entityFactsText(lang);
  return [t.title, t.paragraph, ...t.bullets];
}

/** Incohérences internes détectables sans base (la CI ajoute la comparaison avec v_public_rooms). */
export function entityFactsIssues(): string[] {
  const issues: string[] = [];
  const sum = ENTITY_HOUSES.reduce((n, h) => n + h.rooms, 0);
  if (sum !== ENTITY_FACTS.totalRooms) issues.push(`somme des chambres par maison (${sum}) ≠ totalRooms (${ENTITY_FACTS.totalRooms})`);
  if (ENTITY_HOUSES.length !== ENTITY_FACTS.totalHouses) issues.push(`nombre de maisons (${ENTITY_HOUSES.length}) ≠ totalHouses (${ENTITY_FACTS.totalHouses})`);
  // (L'Appart, 13/11/2026) La marque = les maisons + L'Appart, jamais une saisie : 4 adresses, 33 chambres, fourchette des deux gammes.
  const A = ENTITY_FACTS.appart, B = ENTITY_FACTS.brand, P = ENTITY_FACTS.price;
  if (B.places !== ENTITY_FACTS.totalHouses + 1) issues.push(`adresses de la marque (${B.places}) ≠ maisons (${ENTITY_FACTS.totalHouses}) + L'Appart`);
  if (B.totalRooms !== ENTITY_FACTS.totalRooms + A.rooms) issues.push(`chambres de la marque (${B.totalRooms}) ≠ ${ENTITY_FACTS.totalRooms} + ${A.rooms}`);
  if (B.price.fromChf !== Math.min(P.fromChf, A.price.fromChf) || B.price.fromEur !== Math.min(P.fromEur, A.price.fromEur)) issues.push("« dès » de la marque ≠ le plus bas des deux gammes");
  if (B.price.toChf !== Math.max(P.standardChf, A.price.toChf) || B.price.toEur !== Math.max(P.standardEur, A.price.toEur)) issues.push("haut de fourchette de la marque ≠ le plus haut des deux gammes");
  const tierRooms = A.price.tiers.flatMap((t) => [...t.rooms]).sort((a, b) => a - b);
  if (tierRooms.join() !== [...A.numbers].sort((a, b) => a - b).join()) issues.push(`L'Appart : chambres des paliers (${tierRooms.join(", ")}) ≠ numéros (${A.numbers.join(", ")})`);
  if (A.price.fromChf >= P.fromChf) issues.push("L'Appart : son « dès » n'est plus sous celui des maisons — revoir la doctrine des deux gammes");
  const shared = [LEASE_SENTENCE, FEES_DEPOSIT_SENTENCE, APPART_CANONICAL_SENTENCE, BRAND_CANONICAL_SENTENCE, MAISONS_CANONICAL_SENTENCE, MAISONS_CROSS_LINK];
  for (const lang of ["fr", "en"] as const) {
    // (L'Appart, E5) La fiche de la marque porte les trois phrases canoniques, chacune exactement une fois (paragraphe, puces 1 et 4).
    const fiche = entityFactsStrings(lang).join("\n");
    for (const [label, c] of [["marque", BRAND_CANONICAL_SENTENCE], ["maisons", MAISONS_CANONICAL_SENTENCE], ["L'Appart", APPART_CANONICAL_SENTENCE]] as const) {
      const n = fiche.split(c[lang]).length - 1;
      if (n !== 1) issues.push(`${lang} : phrase canonique « ${label} » ${n} fois dans la fiche de la marque (attendu 1)`);
    }
    for (const s of [...entityFactsStrings(lang), ...shared.map((x) => x[lang])]) {
      if (s.includes(ENTITY_FACTS_PLACEHOLDER) || /\{\{|\[À VÉRIFIER|undefined|NaN/.test(s)) issues.push(`${lang} : placeholder dans « ${s.slice(0, 60)}… »`);
      if (/\d\.\d{3}/.test(s)) issues.push(`${lang} : séparateur de milliers non canonique dans « ${s.slice(0, 60)}… »`);
    }
  }
  return issues;
}

export function entityFactsHasPlaceholders(): boolean {
  return entityFactsIssues().some((i) => i.includes("placeholder"));
}
