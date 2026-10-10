// Données structurées (schema.org / JSON-LD) — source unique.
// Règle d'or AEO : le texte d'une réponse balisée doit être IDENTIQUE au texte visible.
// buildFaqPageSchema() construit donc le FAQPage à partir des mêmes paires {q,a} affichées.

import { STATS, STATS_SHARED_BATH, ROOMS_BY_HOUSE, PRICE_FR_NUM, PRICE_EN_NUM, PRICE_SHARED_FR_NUM, PRICE_SHARED_EN_NUM, GENEVA_COMMUTE_FORMULA, GOOGLE_REVIEWS } from "@/data/stats";

const SITE = "https://www.lavillacoliving.com";

/**
 * @id unique de l'entité La Villa Coliving dans le knowledge graph.
 * Porté par : l'Organization de /qui-sommes-nous, le LodgingBusiness de l'accueil
 * et le LocalBusiness générique de SEO.tsx → Google fusionne les trois en une seule fiche.
 */
export const ORG_ID = `${SITE}/#organization`;

/**
 * Profils publics officiels — source unique pour tous les `sameAs` (site, llms.txt, fiche entité).
 * Le lien share.google est la fiche Google Business (une seule fiche, confirmé 04/08).
 * (Lot S1, D10 Jérôme 05/09/2026) Le compte Instagram officiel est `la_villa_coliving_geneva`
 * (l'ancien handle `lavillacoliving` était faux) ; PAS de page Facebook.
 * (07/09/2026, URL validées avec Jérôme) Annuaires au niveau de l'organisation : profil PRO La Carte des Colocs
 * (SIREN 882153810). Les fiches par maison (coliving.com) vivent dans HOUSES[].sameAs. Écartés : welc.ch
 * (Welcome Center UNIGE/HES-SO/HUG — La Villa y est citée dans une liste, c'est une citation, pas une fiche
 * d'identité) et housing.cagi.ch (tableau de bord privé, aucune page publique). bookmycoliving, LinkedIn :
 * aucune page publique trouvée.
 * INSTAGRAM_URL doit rester en tête : scripts/build-llms-txt.mjs lit sameAs[0].
 * (Lot L3, D4, 09/10/2026) Le lien « Voir les avis » affiché sur le site = GOOGLE_REVIEWS.url (src/data/stats.ts, forme
 * stable par cid) — même fiche que le lien share.google ci-dessous, conservé tel quel dans sameAs.
 */
export const INSTAGRAM_URL = "https://www.instagram.com/la_villa_coliving_geneva/";
export const LACARTEDESCOLOCS_PRO_URL = "https://www.lacartedescolocs.com/pro/la_villa_coliving";
/** Profil Roomlala du compte La Villa (public, membre depuis mai 2021, 3 annonces = les 3 maisons). ⚠️ Roomlala ne
 *  doit donc PAS figurer dans la liste COMPETITOR_NAMES : la garde scanne aussi le JSON-LD. */
export const ROOMLALA_PROFILE_URL = "https://www.roomlala.fr/profile/3199661";
/** (Lot L6.3, 10/10/2026) La fiche Google Business par `cid` (forme stable, = GOOGLE_REVIEWS.url) remplace le lien court
 *  share.google — même fiche, une seule URL, celle du lien « Voir les avis ». */
export const GOOGLE_BUSINESS_PROFILE_URL = GOOGLE_REVIEWS.url;
export const LAVILLA_SAME_AS = [
  INSTAGRAM_URL,
  GOOGLE_BUSINESS_PROFILE_URL,
  LACARTEDESCOLOCS_PRO_URL, // le `.com` répond 200, le `.fr` 403 (vérifié le 10/10/2026)
  ROOMLALA_PROFILE_URL,
];

/** (Lot L6.1, D11 Jérôme 09/10/2026) Noms alternatifs de l'entité — portés par CHAQUE fiche d'organisation (toutes pages). */
export const LAVILLA_ALTERNATE_NAMES = ["La Villa Coliving Genève", "La Villa Coliving Annemasse", "LaVilla Coliving"] as const;

/** (Lot L6.1) Noyau d'identité commun aux trois fiches d'organisation (LocalBusiness générique, LodgingBusiness de l'accueil,
 *  Organization de /qui-sommes-nous) : même @id, même nom, mêmes alternateName, même url/logo/sameAs → Google fusionne. */
export const ORG_IDENTITY = {
  "@id": ORG_ID,
  name: "La Villa Coliving",
  alternateName: [...LAVILLA_ALTERNATE_NAMES],
  url: SITE,
  logo: `${SITE}/logos/logo-full.png`,
  sameAs: LAVILLA_SAME_AS,
} as const;

// Coordonnées publiques — confirmées par Jérôme (2026-06-05).
export const LAVILLA_PHONE = "+33664315134";
export const LAVILLA_EMAIL = "contact@lavillacoliving.com";

/** Une question / réponse, déjà résolue dans la langue de la page. */
/** `more` (Lot C2) = lien de suite affiché sous la réponse ; jamais dans le JSON-LD (texte balisé = texte visible). */
export type QAPair = { q: string; a: string; more?: { href: string; label: string } };

/**
 * Adresse postale du siège — source unique.
 * `addressRegion` inclus : le bloc LocalBusiness de SEO.tsx le portait déjà,
 * pas HOUSES[0] ; les deux divergaient.
 */
export const LAVILLA_POSTAL_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "34 rue du Foron",
  addressLocality: "Ville-la-Grand",
  addressRegion: "Haute-Savoie",
  postalCode: "74100",
  addressCountry: "FR",
} as const;

export interface HouseInfo {
  slug: string;
  /** Libellé affiché du schema `department` (historique : « La Villa — Ville-la-Grand »). */
  name: string;
  /** (Lot L6.2) Nom court de la maison et commune — bases du nom et des alternateName du nœud LodgingBusiness. */
  label: string;
  commune: string;
  url: string;
  streetAddress: string;
  addressLocality: string;
  postalCode: string;
  /** Coordonnées rooftop-exactes (Base Adresse Nationale, géocodées le 15/08/2026, score > 0,95). */
  geo: { lat: number; lng: number };
  /** (Lot L6.2) Image principale (chemin site) et équipements de CETTE maison (FR/EN) — même liste que ENTITY_HOUSES.amenities. */
  image: string;
  amenityFeatures: { fr: readonly string[]; en: readonly string[] };
  /** Fiches publiques de CETTE maison sur les annuaires (s'ajoutent à LAVILLA_SAME_AS dans son LodgingBusiness). */
  sameAs?: string[];
}

/** Les 3 maisons — source unique pour le schema (adresses confirmées, geo BAN rooftop). */
export const HOUSES: HouseInfo[] = [
  {
    slug: "lavilla",
    name: "La Villa — Ville-la-Grand",
    label: "La Villa",
    commune: "Ville-la-Grand",
    url: `${SITE}/lavilla`,
    streetAddress: "34 rue du Foron",
    addressLocality: "Ville-la-Grand",
    postalCode: "74100",
    geo: { lat: 46.205146, lng: 6.232634 },
    image: "/images/la villa jardin.webp",
    amenityFeatures: {
      fr: ["Piscine extérieure chauffée", "Sauna", "Salle de sport", `Internet fibre jusqu'à ${STATS.fiberSpeed}`, "Ménage des parties communes inclus"],
      en: ["Heated outdoor pool", "Sauna", "Gym", `Fibre internet up to ${STATS.fiberSpeed}`, "Common areas cleaning included"],
    },
    // Fiches de la maison : coliving.com (« Foron Residence », hôte Fanny — la marque ne peut pas figurer dans le titre public,
    // politique de la plateforme, support du 09/10/2026), bookmycoliving (URL Jérôme 09/10) et annonce Roomlala (07/09).
    sameAs: [
      "https://coliving.com/spaces/ybsq769h",
      "https://bookmycoliving.com/property/la-villa-coliving-la-villa-ville-la-grand-cmq59ryhm0001jv04vieqofcc",
      "https://www.roomlala.fr/listing/une-chambre-se-libere-a-la-villa-coliving-tout-inclus-248638",
    ],
  },
  {
    slug: "leloft",
    name: "Le Loft — Ambilly",
    label: "Le Loft",
    commune: "Ambilly",
    url: `${SITE}/leloft`,
    streetAddress: "1 rue des Marronniers",
    addressLocality: "Ambilly",
    postalCode: "74100",
    geo: { lat: 46.196367, lng: 6.226278 },
    image: "/images/la villa coliving le loft piscine.webp",
    amenityFeatures: {
      fr: ["Piscine intérieure chauffée", "Sauna", "Salle de sport", `Internet fibre jusqu'à ${STATS.fiberSpeed}`, "Ménage des parties communes inclus"],
      en: ["Heated indoor pool", "Sauna", "Gym", `Fibre internet up to ${STATS.fiberSpeed}`, "Common areas cleaning included"],
    },
    // Le slug Roomlala « a-15-min-de-geneve » est celui de la plateforme (titre réécrit le 09/10, slug inchangé côté Roomlala).
    sameAs: [
      "https://bookmycoliving.com/property/la-villa-coliving-le-loft-ambilly-cmq59ryii0005jv04hhoruxqb",
      "https://www.roomlala.fr/listing/chambre-avec-salle-de-bain-privee-coliving-tout-inclus-a-15-min-de-geneve-363910",
    ],
  },
  {
    slug: "lelodge",
    name: "Le Lodge — Annemasse",
    label: "Le Lodge",
    commune: "Annemasse",
    url: `${SITE}/lelodge`,
    streetAddress: "8 rue de Romagny",
    addressLocality: "Annemasse",
    postalCode: "74100",
    geo: { lat: 46.194519, lng: 6.241576 },
    image: "/images/le lodge/exterior/la villa coliving le lodge-14.webp",
    amenityFeatures: {
      fr: ["Piscine", "Sauna", "Chalet fitness", `Internet fibre jusqu'à ${STATS.fiberSpeed}`, "Ménage des parties communes inclus"],
      en: ["Pool", "Sauna", "Fitness chalet", `Fibre internet up to ${STATS.fiberSpeed}`, "Common areas cleaning included"],
    },
    sameAs: [
      "https://bookmycoliving.com/property/la-villa-coliving-le-lodge-annemasse-cmq59ryiz0009jv04z0896pzr",
      "https://www.roomlala.fr/listing/une-chambre-disponible-au-lodge-colocation-coliving-624138",
    ],
  },
];

/**
 * FAQPage construit depuis les paires VISIBLES → garantit JSON-LD == texte affiché
 * (condition #2 du playbook AEO). À passer à <SEO jsonLd> ou via un <Helmet> dédié.
 */
export function buildFaqPageSchema(items: QAPair[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** (Lot L6.2) Maison des chambres à salle d'eau partagée : son priceRange couvre les deux paliers, les autres n'ont que le standard. */
const SHARED_BATH_HOUSE_SLUG = "lavilla";

/** Identifiant stable du nœud LodgingBusiness d'une maison (référencé par @id depuis l'ItemList des chambres). */
export const houseLodgingId = (slug: string): string => `${SITE}/${slug}#lodging`;

/**
 * (Lot L6.2, brief v3.1 A.10 — 10/10/2026) LE nœud LodgingBusiness d'une maison, construit UNE seule fois ici et utilisé par
 * `department[]` des deux fiches d'organisation ET par la page maison (ex-bloc écrit à la main dans HouseDetailPage) — sinon
 * Google fusionne deux nœuds contradictoires. @id `<url>#lodging`, rattachement à l'entité (`parentOrganization`),
 * `numberOfRooms` de ROOMS_BY_HOUSE, `priceRange` par maison, `amenityFeature` par maison, adresse + geo (BAN), `sameAs` de
 * la maison. Jamais d'AggregateOffer par maison (la garde exige 1 370-1 430 sur chaque nœud), jamais de `currenciesAccepted`
 * (le loyer contractuel est en euros, l'affichage en CHF : la propriété induisait en erreur). `opts.context` ajoute @context
 * (bloc autonome de la page maison) ; `opts.description` / `opts.image` remplacent le texte et l'image par défaut.
 */
export function buildHouseLodgingNode(
  h: HouseInfo,
  language: "fr" | "en" = "fr",
  opts: { context?: boolean; description?: string; image?: string } = {},
): Record<string, unknown> {
  const en = language === "en";
  const rooms = ROOMS_BY_HOUSE[h.slug as keyof typeof ROOMS_BY_HOUSE];
  const priceRange = h.slug === SHARED_BATH_HOUSE_SLUG
    ? (en ? `CHF ${PRICE_SHARED_EN_NUM}–${PRICE_EN_NUM}/month` : `${PRICE_SHARED_FR_NUM}–${PRICE_FR_NUM} CHF/mois`)
    : (en ? `CHF ${PRICE_EN_NUM}/month` : `${PRICE_FR_NUM} CHF/mois`);
  return {
    ...(opts.context ? { "@context": "https://schema.org" } : {}),
    "@type": "LodgingBusiness",
    "@id": houseLodgingId(h.slug),
    name: `La Villa Coliving — ${h.label}`,
    alternateName: [h.label, `La Villa Coliving — ${h.commune}`],
    parentOrganization: { "@id": ORG_ID },
    url: h.url,
    image: opts.image ?? `${SITE}${h.image}`,
    ...(opts.description ? { description: opts.description } : {}),
    telephone: LAVILLA_PHONE,
    email: LAVILLA_EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress: h.streetAddress,
      addressLocality: h.addressLocality,
      addressRegion: "Haute-Savoie",
      postalCode: h.postalCode,
      addressCountry: "FR",
    },
    geo: { "@type": "GeoCoordinates", latitude: h.geo.lat, longitude: h.geo.lng },
    numberOfRooms: rooms,
    priceRange,
    amenityFeature: (en ? h.amenityFeatures.en : h.amenityFeatures.fr).map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
    ...(h.sameAs ? { sameAs: h.sameAs } : {}),
  };
}

/** Chambre candidate telle que la sert v_public_rooms (forme minimale : pas d'import de src/lib/availability ici, ce module est
 *  aussi chargé par les scripts Node). */
export interface RoomOfferInput {
  house_slug: string;
  room_number: number;
  rent_chf: number | null;
  availability: string;
  available_from: string | null;
  surface_m2: number | string | null;
}

/**
 * (Lot L6.5) ItemList des chambres libres ou à libérer de /chambres-disponibles — la « plateforme » de La Villa aux yeux des
 * assistants. Une Offer par chambre : prix + UnitPriceSpecification mensuelle, `businessFunction` LeaseOut, `offeredBy` = l'entité,
 * `itemOffered` = Accommodation rattachée à sa maison (`containedInPlace` → @id du nœud LodgingBusiness) avec l'adresse ; `url` =
 * la page maison (les fiches chambres sont en noindex). JAMAIS `numberOfRooms` sur une chambre. `undefined` sans candidate.
 */
export function buildAvailableRoomsItemList(candidates: readonly RoomOfferInput[], language: "fr" | "en"): Record<string, unknown> | undefined {
  if (!candidates.length) return undefined;
  const en = language === "en";
  const prefix = en ? "/en" : "";
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: en ? "Available rooms — La Villa Coliving" : "Chambres disponibles — La Villa Coliving",
    numberOfItems: candidates.length,
    itemListElement: candidates.map((r, i) => {
      const h = HOUSES.find((x) => x.slug === r.house_slug);
      const label = h?.label ?? r.house_slug;
      const roomName = `${en ? "Room" : "Chambre"} ${r.room_number} — ${label}`;
      return {
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Offer",
          name: `${label} — ${en ? "Room" : "Chambre"} ${r.room_number}`,
          url: `${SITE}${prefix}/${r.house_slug}`,
          ...(r.rent_chf !== null
            ? {
                price: r.rent_chf,
                priceCurrency: "CHF",
                priceSpecification: { "@type": "UnitPriceSpecification", price: r.rent_chf, priceCurrency: "CHF", unitCode: "MON", unitText: en ? "per month" : "par mois" },
              }
            : {}),
          availability: r.availability === "available" ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
          ...(r.available_from ? { availabilityStarts: r.available_from } : {}),
          businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
          offeredBy: { "@id": ORG_ID },
          itemOffered: {
            "@type": "Accommodation",
            name: roomName,
            ...(r.surface_m2 ? { floorSize: { "@type": "QuantitativeValue", value: Number(r.surface_m2), unitCode: "MTK" } } : {}),
            ...(h
              ? {
                  containedInPlace: { "@id": houseLodgingId(h.slug) },
                  address: { "@type": "PostalAddress", streetAddress: h.streetAddress, addressLocality: h.addressLocality, postalCode: h.postalCode, addressCountry: "FR" },
                }
              : {}),
          },
        },
      };
    }),
  };
}

/** (Lot L6.6) NAP — nom, adresses, téléphone, URL dans la forme exacte de la fiche Google (une seule fiche pour les trois
 *  maisons, décision Jérôme) ; à reporter tel quel sur bookmycoliving, coliving.com et La Carte des Colocs (src/data/README.md). */
export const LAVILLA_NAP = {
  name: "La Villa Coliving",
  phoneE164: LAVILLA_PHONE,
  phoneDisplay: "+33 6 64 31 51 34",
  email: LAVILLA_EMAIL,
  url: SITE,
  headOffice: `${LAVILLA_POSTAL_ADDRESS.streetAddress}, ${LAVILLA_POSTAL_ADDRESS.postalCode} ${LAVILLA_POSTAL_ADDRESS.addressLocality}, France`,
  houses: HOUSES.map((h) => ({ label: h.label, address: `${h.streetAddress}, ${h.postalCode} ${h.addressLocality}, France` })),
} as const;

/**
 * Entité mère de l'accueil : LodgingBusiness avec les 3 maisons en `department`.
 * PAS d'`aggregateRating` ni de `Review` (D4, 09/10/2026) : la note publiée est celle de la fiche Google (GOOGLE_REVIEWS),
 * et Google n'affiche pas les avis auto-balisés d'un LocalBusiness sur son propre site — garde check-entity-facts.
 * Prix / fibre sourcés depuis STATS pour rester cohérents partout.
 */
export function buildHomeLodgingBusinessSchema(language: "fr" | "en" = "fr"): Record<string, unknown> {
  const en = language === "en";
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": ORG_ID,
    name: "La Villa Coliving",
    alternateName: [...LAVILLA_ALTERNATE_NAMES], // (L6.1, D11)
    // (D1, 09/10/2026) Trajet = formule canonique GENEVA_COMMUTE_FORMULA, jamais « N minutes du centre » sans qualification.
    description: en
      ? `All-inclusive premium coliving near Geneva: ${STATS.totalHouses} houses (${STATS.totalRooms} furnished rooms) on the French side, with pool, sauna and gym in every house. ${GENEVA_COMMUTE_FORMULA.en}.`
      : `Coliving premium tout inclus près de Genève : ${STATS.totalHouses} maisons (${STATS.totalRooms} chambres meublées) côté France, avec piscine, sauna et salle de sport dans chaque maison. ${GENEVA_COMMUTE_FORMULA.fr}.`,
    url: `${SITE}/`,
    logo: `${SITE}/logos/logo-full.png`,
    image: `${SITE}/images/villa_portrait.webp`,
    telephone: LAVILLA_PHONE,
    email: LAVILLA_EMAIL,
    priceRange: en ? `CHF ${PRICE_SHARED_EN_NUM}–${PRICE_EN_NUM}/month` : `${PRICE_SHARED_FR_NUM}–${PRICE_FR_NUM} CHF/mois`,
    // Offre citable par les moteurs et les IA (AI Overviews cite déjà nos prix —
    // autant qu'ils viennent d'une donnée structurée exacte). Prix via STATS :
    // deux niveaux depuis le 01/09/2026 → AggregateOffer 1 370–1 430 (STATS_SHARED_BATH → STATS).
    makesOffer: {
      "@type": "AggregateOffer",
      name: en
        ? "All-inclusive furnished room in coliving near Geneva"
        : "Chambre meublée tout inclus en coliving près de Genève",
      description: en
        ? `Furnished room of ${STATS.roomSizeMin} to ${STATS.roomSizeMax} m², all utilities, fibre internet, cleaning, pool, sauna and gym included. No application fee.`
        : `Chambre meublée de ${STATS.roomSizeMin} à ${STATS.roomSizeMax} m², charges, internet fibre, ménage, piscine, sauna et salle de sport inclus. Sans frais de dossier.`,
      lowPrice: String(STATS_SHARED_BATH.priceChf),
      highPrice: String(STATS.priceChf),
      priceCurrency: "CHF",
      offerCount: STATS.totalRooms,
      availability: "https://schema.org/InStock",
      url: `${SITE}${en ? "/en" : ""}/tarifs`,
      seller: { "@type": "Organization", name: "La Villa Coliving", url: SITE },
    },
    areaServed: ["Genève", "Annemasse", "Ville-la-Grand", "Ambilly", "Grand Genève"],
    knowsLanguage: ["fr", "en"],
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: en ? "Swimming pool" : "Piscine", value: true },
      { "@type": "LocationFeatureSpecification", name: "Sauna", value: true },
      { "@type": "LocationFeatureSpecification", name: en ? "Gym" : "Salle de sport", value: true },
      { "@type": "LocationFeatureSpecification", name: en ? `Fiber internet up to ${STATS.fiberSpeed}` : `Internet fibre jusqu'à ${STATS.fiberSpeed}`, value: true },
      { "@type": "LocationFeatureSpecification", name: en ? "Common areas cleaning included" : "Ménage des parties communes inclus", value: true },
    ],
    sameAs: LAVILLA_SAME_AS,
    numberOfRooms: STATS.totalRooms,
    // E-E-A-T : mêmes champs identité que le LocalBusiness générique (qu'il remplace
    // sur l'accueil depuis le 15/08 — prop omitLocalBusiness de SEO.tsx).
    foundingDate: FOUNDING_DATE,
    founder: [
      buildFounderPersonSchema(FOUNDERS.jerome, language),
      buildFounderPersonSchema(FOUNDERS.fanny, language),
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: LAVILLA_EMAIL,
      telephone: LAVILLA_PHONE,
      contactType: "customer service",
      availableLanguage: ["French", "English"],
    },
    // `address` racine — Google la réclame sur LodgingBusiness (« Rich results
    // validation error » relevé au crawl du 23/07/2026 sur / et /en). Les
    // adresses par maison vivaient déjà dans `department[].address`, mais
    // l'entité mère n'en avait aucune.
    address: LAVILLA_POSTAL_ADDRESS,
    geo: { "@type": "GeoCoordinates", latitude: HOUSES[0].geo.lat, longitude: HOUSES[0].geo.lng },
    department: HOUSES.map((h) => buildHouseLodgingNode(h, language)),
  };
}

/**
 * LocalBusiness générique de TOUTES les pages (émis par SEO.tsx, sauf l'accueil qui porte le
 * LodgingBusiness ci-dessus avec le même @id). (Lot S1, 05/09/2026) Généralisé : les 3 maisons en
 * `department`, l'offre agrégée en `makesOffer`, `numberOfRooms`, `sameAs` — tous lus depuis les
 * sources uniques (STATS, ROOMS_BY_HOUSE, HOUSES, LAVILLA_SAME_AS). PAS d'aggregateRating ni de Review (D4, 09/10/2026).
 */
export function buildLocalBusinessSchema(language: "fr" | "en", description: string): Record<string, unknown> {
  const en = language === "en";
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": ORG_ID,
    name: "La Villa Coliving",
    alternateName: [...LAVILLA_ALTERNATE_NAMES], // (L6.1, D11)
    url: SITE,
    logo: `${SITE}/logos/logo-full.png`,
    image: `${SITE}/images/villa_portrait.webp`,
    description,
    telephone: LAVILLA_PHONE,
    email: LAVILLA_EMAIL,
    priceRange: en ? `CHF ${PRICE_SHARED_EN_NUM}–${PRICE_EN_NUM}/month` : `${PRICE_SHARED_FR_NUM}–${PRICE_FR_NUM} CHF/mois`,
    address: LAVILLA_POSTAL_ADDRESS,
    geo: { "@type": "GeoCoordinates", latitude: HOUSES[0].geo.lat, longitude: HOUSES[0].geo.lng },
    areaServed: ["Genève", "Annemasse", "Ville-la-Grand", "Ambilly", "Grand Genève"],
    numberOfRooms: STATS.totalRooms,
    makesOffer: {
      "@type": "AggregateOffer",
      name: en ? "All-inclusive furnished room in coliving near Geneva" : "Chambre meublée tout inclus en coliving près de Genève",
      lowPrice: String(STATS_SHARED_BATH.priceChf),
      highPrice: String(STATS.priceChf),
      priceCurrency: "CHF",
      offerCount: STATS.totalRooms,
      availability: "https://schema.org/InStock",
      url: `${SITE}${en ? "/en" : ""}/tarifs`,
    },
    department: HOUSES.map((h) => buildHouseLodgingNode(h, language)),
    // E-E-A-T : fondation + fondateurs identifiables (sameAs LinkedIn) sur toutes les pages.
    foundingDate: FOUNDING_DATE,
    founder: [buildFounderPersonSchema(FOUNDERS.jerome, language), buildFounderPersonSchema(FOUNDERS.fanny, language)],
    contactPoint: {
      "@type": "ContactPoint",
      email: LAVILLA_EMAIL,
      telephone: LAVILLA_PHONE,
      contactType: "customer service",
      availableLanguage: ["French", "English"],
    },
    sameAs: LAVILLA_SAME_AS,
  };
}

/**
 * Fondateurs — source unique pour les bylines blog, la page /qui-sommes-nous et les
 * schemas Person. `dbAuthorName` = valeur ASCII du champ blog_posts.author (pipeline
 * SQL ASCII-safe) ; `name` = graphie affichée. sameAs LinkedIn = corroboration
 * d'identité hors site (E-E-A-T), URLs confirmées par Jérôme (2026-07-06).
 */
export interface Founder {
  name: string;
  dbAuthorName: string;
  linkedin: string;
  jobTitle: { fr: string; en: string };
}

export const FOUNDERS: Record<"jerome" | "fanny", Founder> = {
  jerome: {
    name: "Jérôme Austin",
    dbAuthorName: "Jerome Austin",
    linkedin: "https://www.linkedin.com/in/jeromeaustin1/",
    jobTitle: {
      fr: "Cofondateur de La Villa Coliving",
      en: "Co-founder of La Villa Coliving",
    },
  },
  fanny: {
    name: "Fanny Bela",
    dbAuthorName: "Fanny Bela",
    linkedin: "https://www.linkedin.com/in/fanny-bela-24793138/",
    jobTitle: {
      fr: "Cofondatrice de La Villa Coliving",
      en: "Co-founder of La Villa Coliving",
    },
  },
};

/** Mois de commercialisation de la première maison (confirmé Jérôme : octobre 2021). */
export const FOUNDING_DATE = "2021-10";

/**
 * ⚠️ INTERRUPTEUR — `true` depuis le 04/08/2026 : la page /qui-sommes-nous est routée
 * (branche feat/qui-sommes-nous-preview). Bylines et blocs auteur pointent vers la page,
 * et les schemas Person portent son `url`.
 */
export const ABOUT_PAGE_LIVE = true;

/** Retrouve un fondateur depuis le champ `author` d'un article (sinon null → auteur générique). */
export function getFounderByAuthorName(author: string | null | undefined): Founder | null {
  if (!author) return null;
  const a = author.trim().toLowerCase();
  if (a === "jerome austin" || a === "jérôme austin" || a === "jérôme" || a === "jerome") return FOUNDERS.jerome;
  if (a === "fanny bela" || a === "fanny") return FOUNDERS.fanny;
  return null;
}

/** Person schema d'un fondateur — sameAs = LinkedIn ; url = page fondateurs quand elle est en prod. */
export function buildFounderPersonSchema(founder: Founder, language: "fr" | "en" = "fr"): Record<string, unknown> {
  return {
    "@type": "Person",
    name: founder.name,
    jobTitle: founder.jobTitle[language],
    ...(ABOUT_PAGE_LIVE ? { url: `${SITE}/qui-sommes-nous` } : {}),
    sameAs: [founder.linkedin],
    worksFor: { "@type": "Organization", name: "La Villa Coliving", url: SITE },
  };
}

/**
 * Schema de la page « Qui sommes-nous » : Organization complète (foundingDate,
 * founder → 2 Person, legalName) dans un @graph avec la fiche AboutPage.
 * PAS d'aggregateRating ni de Review (D4, 09/10/2026 : la note Google se lit sur la fiche, jamais balisée ici).
 * (Lot L3) « 100+ résidents accueillis » = STATS.totalResidents, soutenu par v_social_proof (STATS_SOURCE).
 */
export function buildAboutPageSchema(language: "fr" | "en" = "fr"): Record<string, unknown> {
  const en = language === "en";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        url: `${SITE}${en ? "/en" : ""}/qui-sommes-nous`,
        name: en ? "Who we are — La Villa Coliving" : "Qui sommes-nous — La Villa Coliving",
        inLanguage: language,
        mainEntity: { "@id": ORG_ID },
      },
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: "La Villa Coliving",
        alternateName: [...LAVILLA_ALTERNATE_NAMES],
        legalName: "SCI Sleep In",
        url: SITE,
        logo: `${SITE}/logos/logo-full.png`,
        image: `${SITE}/images/villa_portrait.webp`,
        foundingDate: FOUNDING_DATE,
        founder: [
          buildFounderPersonSchema(FOUNDERS.jerome, language),
          buildFounderPersonSchema(FOUNDERS.fanny, language),
        ],
        email: LAVILLA_EMAIL,
        telephone: LAVILLA_PHONE,
        areaServed: ["Genève", "Annemasse", "Ville-la-Grand", "Ambilly", "Grand Genève"],
        sameAs: LAVILLA_SAME_AS,
        description: en
          ? `Boutique coliving founded in ${STATS.foundedYear} and personally run by its two founders: ${STATS.totalHouses} houses, ${STATS.totalRooms} rooms near Geneva, ${STATS.totalResidents}+ residents welcomed.`
          : `Coliving boutique fondé en ${STATS.foundedYear} et géré en direct par ses deux fondateurs : ${STATS.totalHouses} maisons, ${STATS.totalRooms} chambres près de Genève, ${STATS.totalResidents}+ résidents accueillis.`,
      },
    ],
  };
}

/**
 * URL interne sans slash final : `vercel.json` déclare `trailingSlash: false`, donc « /en/ » répond 308 → « /en ».
 * La racine garde son « / » (`https://www.lavillacoliving.com/`). Query et fragment conservés ; URL externe intacte
 * (le `sameAs` Instagram finit par « / » et doit le garder).
 * (Audit indexation 07/10/2026 : 45 pages EN déclaraient `"item":"https://www.lavillacoliving.com/en/"`.)
 */
export function withoutTrailingSlash(url: string): string {
  if (!url.startsWith("/") && !url.startsWith(SITE)) return url;
  const m = url.match(/^([^?#]*?)\/+([?#].*)?$/);
  if (!m) return url;
  const base = m[1];
  if (base === "" || base === SITE) return url; // racine
  return base + (m[2] ?? "");
}

/** Accueil localisé, forme canonique : `…/` en français, `…/en` (sans slash final) en anglais. */
export function homeUrl(language: "fr" | "en"): string {
  return language === "en" ? `${SITE}/en` : `${SITE}/`;
}

/**
 * Fil d'ariane (BreadcrumbList) — items {name, url} déjà localisés.
 * Chaque `item` est normalisé sans slash final (hors racine) : un appelant qui fabrique « …/en/ » ne
 * peut plus publier une URL redirigée. Garde CI : étape 6 de scripts/check-redirects.mjs.
 */
export function buildBreadcrumbSchema(items: { name: string; url: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: withoutTrailingSlash(it.url),
    })),
  };
}

/** Offre agrégée « chambres tout inclus » — deux niveaux depuis le 01/09/2026, prix sourcés depuis STATS (single source). */
export function buildRoomsAggregateOfferSchema(opts: { name: string; description: string; url: string }): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "AggregateOffer",
    name: opts.name,
    description: opts.description,
    lowPrice: String(STATS_SHARED_BATH.priceChf),
    highPrice: String(STATS.priceChf),
    priceCurrency: "CHF",
    offerCount: STATS.totalRooms,
    availability: "https://schema.org/InStock",
    url: opts.url,
    seller: { "@type": "Organization", name: "La Villa Coliving", url: SITE },
  };
}

/**
 * Dataset (schema.org) — premier usage Dataset du site, pour l'observatoire.
 * `distribution` pointe le CSV téléchargeable. La Villa = éditrice neutre (creator/publisher),
 * jamais dans les chiffres. Licence CC-BY pour encourager la citation presse.
 */
export function buildDatasetSchema(opts: {
  name: string;
  description: string;
  url: string;
  csvUrls: string[];
  datePublished: string;
  dateModified: string;
  language: "fr" | "en";
  spatial: string[];
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    inLanguage: opts.language,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    creator: { "@type": "Organization", name: "La Villa Coliving", url: SITE },
    publisher: { "@type": "Organization", name: "La Villa Coliving", url: SITE },
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    keywords:
      opts.language === "en"
        ? ["cross-border housing", "Geneva", "rent", "commute time", "Léman Express", "Greater Geneva"]
        : ["logement frontalier", "Genève", "loyer", "temps de trajet", "Léman Express", "Genevois français"],
    spatialCoverage: opts.spatial.map((name) => ({ "@type": "Place", name })),
    distribution: opts.csvUrls.map((contentUrl) => ({
      "@type": "DataDownload",
      encodingFormat: "text/csv",
      contentUrl,
    })),
  };
}
