// Données structurées (schema.org / JSON-LD) — source unique.
// Règle d'or AEO : le texte d'une réponse balisée doit être IDENTIQUE au texte visible.
// buildFaqPageSchema() construit donc le FAQPage à partir des mêmes paires {q,a} affichées.

import { STATS, HOUSES_FROM, ROOMS_BY_HOUSE, PRICE_FR_NUM, PRICE_EN_NUM, PRICE_FROM_FR_NUM, PRICE_FROM_EN_NUM, GENEVA_COMMUTE_FORMULA, GOOGLE_REVIEWS, thousands } from "@/data/stats";
import { APPART_KEY, isPlaceKey, roomLabel, type AppartKey, type MaisonKey, type PlaceKey } from "@/data/places";
import { APPART } from "@/data/appart";

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
 * Adresse postale PUBLIQUE de l'entité (JSON-LD de toutes les pages) — source unique.
 * `addressRegion` inclus : le bloc LocalBusiness de SEO.tsx le portait déjà,
 * pas HOUSES[0] ; les deux divergaient.
 * (12/10/2026, sécurité — cambriolage, décision Jérôme) SANS rue : commune, code postal, région, pays. Les rues des maisons
 * ne sont plus publiées par le site. (13/11/2026, lot « sécurité des adresses ») Elles ne sont plus écrites dans ce dépôt
 * non plus : HOUSES n'a plus de champ `streetAddress`. Le tableau de bord et le portail lisent l'adresse en base
 * (`properties.address`, session connectée) ; la garde `npm run check:locations` refuse toute rue de maison dans le code.
 */
export const LAVILLA_POSTAL_ADDRESS = {
  "@type": "PostalAddress",
  addressLocality: "Ville-la-Grand",
  addressRegion: "Haute-Savoie",
  postalCode: "74100",
  addressCountry: "FR",
} as const;

/**
 * (L'Appart, 13/11/2026) Ce que le site publie d'un LIEU, maison ou L'Appart : commune, code postal, zone, point public, image,
 * équipements, fiches d'annuaires. Jamais de rue ni de coordonnées exactes (L'Appart n'en a pas dans le code).
 */
export interface PlaceInfo {
  slug: PlaceKey;
  /** Libellé affiché du schema `department` (historique : « La Villa — Ville-la-Grand »). */
  name: string;
  /** (Lot L6.2) Nom court de la maison et commune — bases du nom et des alternateName du nœud LodgingBusiness. */
  label: string;
  commune: string;
  url: string;
  // (13/11/2026) Plus de `streetAddress` : aucune rue de maison dans le code (base : properties.address ; garde check:locations).
  addressLocality: string;
  postalCode: string;
  /** (12/10/2026) Zone publiée à la place de l'adresse : commune, code postal et quartier déjà décrit sur la page. */
  zone: { fr: string; en: string };
  /**
   * (12/10/2026) Point PUBLIC de la maison : choisi à la main à 430-530 m de la maison, dans la même commune et en France
   * (vérifié par géocodage inverse OpenStreetMap le 12/10/2026). Un simple arrondi au centième plaçait le centre de la
   * carte de La Villa à Puplinge (Suisse). Seules coordonnées publiées par le site (publicGeo).
   */
  publicPoint: { lat: number; lng: number };
  /** (Lot L6.2) Image principale (chemin site) et équipements de CETTE maison (FR/EN) — même liste que ENTITY_HOUSES.amenities. */
  image: string;
  amenityFeatures: { fr: readonly string[]; en: readonly string[] };
  /** Fiches publiques de CETTE maison sur les annuaires (s'ajoutent à LAVILLA_SAME_AS dans son LodgingBusiness). */
  sameAs?: string[];
}

/** Une des 3 maisons : un lieu, plus ses coordonnées exactes INTERNES. */
export interface HouseInfo extends PlaceInfo {
  /** (L'Appart, 12/11/2026) Une des 3 maisons : le nœud d'une maison (piscine, sauna, salle de sport) ne se construit pas pour un autre lieu. */
  slug: MaisonKey;
  /** INTERNE — coordonnées rooftop-exactes (BAN, 15/08/2026). Le site ne publie que publicGeo(h) (arrondi ≈ 1 km). */
  geo: { lat: number; lng: number };
}

/**
 * (12/10/2026, sécurité — décision Jérôme) Coordonnées PUBLIÉES d'une maison = son point public (HOUSES[].publicPoint, à
 * environ 500 m, même commune). Seule forme de coordonnées que le site affiche ou sérialise (JSON-LD, carte, itinéraires).
 */
export function publicGeo(h: { publicPoint: { lat: number; lng: number } }): { lat: number; lng: number } {
  return { lat: h.publicPoint.lat, lng: h.publicPoint.lng };
}

/** Les 3 maisons — source unique pour le schema (commune, code postal, zone et point public ; aucune rue, geo BAN rooftop). */
export const HOUSES: HouseInfo[] = [
  {
    slug: "lavilla",
    name: "La Villa — Ville-la-Grand",
    label: "La Villa",
    commune: "Ville-la-Grand",
    url: `${SITE}/lavilla`,
    addressLocality: "Ville-la-Grand",
    postalCode: "74100",
    geo: { lat: 46.205146, lng: 6.232634 },
    zone: { fr: "Ville-la-Grand (74100), en bordure du Foron", en: "Ville-la-Grand (74100), beside the Foron" },
    publicPoint: { lat: 46.2015, lng: 6.237 },
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
    addressLocality: "Ambilly",
    postalCode: "74100",
    geo: { lat: 46.196367, lng: 6.226278 },
    zone: { fr: "Centre d'Ambilly (74100)", en: "Central Ambilly (74100)" },
    publicPoint: { lat: 46.1985, lng: 6.231 },
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
    addressLocality: "Annemasse",
    postalCode: "74100",
    geo: { lat: 46.194519, lng: 6.241576 },
    zone: { fr: "Annemasse (74100), quartier de Romagny", en: "Annemasse (74100), Romagny district" },
    publicPoint: { lat: 46.19, lng: 6.24 },
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
 * (L'Appart, 13/11/2026) L'Appart comme LIEU publié (src/data/appart.ts pour les faits) : commune, code postal, zone, point
 * public, image, équipements — sans rue ni coordonnées du logement (aucune dans le code). Point public = la gare d'Annemasse
 * (décision n° 28 de la critique du 13/11, à confirmer) : lieu public, à 5 min à pied, relevé sur OpenStreetMap (nœud
 * « Annemasse », railway=station) ; la carte, le lien « Calculer mon trajet » et le JSON-LD partent de là, et la page le dit.
 * Équipements : ceux de L'Appart (jamais piscine, sauna ni salle de sport : ce sont les maisons).
 */
export const APPART_PLACE: PlaceInfo & { slug: AppartKey } = {
  slug: APPART_KEY,
  name: `${APPART.name} — ${APPART.commune}`,
  label: APPART.name,
  commune: APPART.commune,
  url: `${SITE}/${APPART_KEY}`,
  addressLocality: APPART.commune,
  postalCode: APPART.postalCode,
  zone: { fr: `${APPART.commune} (${APPART.postalCode}), quartier de la gare`, en: `${APPART.commune} (${APPART.postalCode}), station district` },
  publicPoint: { lat: 46.1996, lng: 6.2371 },
  // = LAPPART_HERO.wide.src (src/data/appartPhotos.ts, test appart.test.mjs) : écrit ici pour que le module d'entrée ne charge pas
  // le manifeste des photos de L'Appart (ce module est dans le morceau d'entrée, par SEO.tsx et le pied de page).
  image: "/images/lappart/lappart-cuisine-5.webp",
  amenityFeatures: {
    fr: ["Internet fibre", "Streaming", "Ménage des parties communes inclus", "Balcon", "Ascenseur", "Local à vélos"],
    en: ["Fibre internet", "Streaming", "Common areas cleaning included", "Balcony", "Lift", "Bike storage"],
  },
};

/** Lieu publié d'une clé publique (maison ou L'Appart) ; `undefined` pour une clé inconnue. */
export function placeInfo(place: string): PlaceInfo | undefined {
  if (!isPlaceKey(place)) return undefined;
  return place === APPART_KEY ? APPART_PLACE : HOUSES.find((h) => h.slug === place);
}

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

/** (Lot L6.2) Maison des chambres à salle d'eau partagée : son priceRange va du « dès » des maisons (HOUSES_FROM, le palier
 *  le plus bas — chambres 7 et 8 depuis le 19/11/2026) au prix standard ; les autres maisons n'ont que le standard. */
const SHARED_BATH_HOUSE_SLUG = "lavilla";

/** Identifiant stable du nœud LodgingBusiness d'une maison (référencé par @id depuis l'ItemList des chambres). */
export const houseLodgingId = (slug: string): string => `${SITE}/${slug}#lodging`;
/** (L'Appart, 13/11/2026) Même identifiant, typé : le nœud LodgingBusiness d'un lieu public (maison ou L'Appart). */
export const placeLodgingId = (place: PlaceKey): string => houseLodgingId(place);

/**
 * (Lot L6.2, brief v3.1 A.10 — 10/10/2026) LE nœud LodgingBusiness d'une maison, construit UNE seule fois ici et utilisé par
 * `department[]` des deux fiches d'organisation ET par la page maison (ex-bloc écrit à la main dans HouseDetailPage) — sinon
 * Google fusionne deux nœuds contradictoires. @id `<url>#lodging`, rattachement à l'entité (`parentOrganization`),
 * `numberOfRooms` de ROOMS_BY_HOUSE, `priceRange` par maison, `amenityFeature` par maison, adresse + geo (BAN), `sameAs` de
 * la maison. Jamais d'AggregateOffer par maison (la garde exige « dès » – standard, soit 1 290-1 430, sur chaque nœud), jamais de `currenciesAccepted`
 * (le loyer contractuel est en euros, l'affichage en CHF : la propriété induisait en erreur). `opts.context` ajoute @context
 * (bloc autonome de la page maison) ; `opts.description` / `opts.image` remplacent le texte et l'image par défaut.
 */
export function buildHouseLodgingNode(
  h: HouseInfo,
  language: "fr" | "en" = "fr",
  opts: { context?: boolean; description?: string; image?: string } = {},
): Record<string, unknown> {
  const en = language === "en";
  const rooms = ROOMS_BY_HOUSE[h.slug];
  const priceRange = h.slug === SHARED_BATH_HOUSE_SLUG
    ? (en ? `CHF ${PRICE_FROM_EN_NUM}–${PRICE_EN_NUM}/month` : `${PRICE_FROM_FR_NUM}–${PRICE_FR_NUM} CHF/mois`)
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
    // (12/10/2026) Sans rue ni coordonnées exactes : commune, code postal et point arrondi (publicGeo).
    address: {
      "@type": "PostalAddress",
      addressLocality: h.addressLocality,
      addressRegion: "Haute-Savoie",
      postalCode: h.postalCode,
      addressCountry: "FR",
    },
    geo: { "@type": "GeoCoordinates", latitude: publicGeo(h).lat, longitude: publicGeo(h).lng },
    numberOfRooms: rooms,
    priceRange,
    amenityFeature: (en ? h.amenityFeatures.en : h.amenityFeatures.fr).map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
    ...(h.sameAs ? { sameAs: h.sameAs } : {}),
  };
}

/**
 * (L'Appart, 13/11/2026) LE nœud LodgingBusiness de L'Appart, construit une seule fois ici : bloc autonome de /lappart (étape E3)
 * et entrée de `department[]` des fiches de la marque (étape E5). Même forme que celui d'une maison (@id `<url>#lodging`,
 * `parentOrganization`, adresse sans rue, point public), avec ses faits à lui : `numberOfRooms` 4, `priceRange` 730–990 CHF,
 * ses équipements (fibre, streaming, ménage des communs, balcon, ascenseur, local à vélos) — jamais piscine, sauna ni salle de
 * sport, jamais d'AggregateOffer ni de `currenciesAccepted`. Textes : source des textes de L'Appart du 13/11/2026 (« à confirmer »).
 */
export function buildAppartLodgingNode(language: "fr" | "en" = "fr", opts: { context?: boolean } = {}): Record<string, unknown> {
  const en = language === "en";
  const p = APPART_PLACE;
  const A = APPART;
  const description = en
    ? `${A.name}, La Villa Coliving's flatshare in ${A.commune}, near the station: ${A.rooms.total} furnished rooms of ${A.rooms.surface.min} to ${A.rooms.surface.max} m² in a ${A.flat.surfaceM2} m² flat, with bills, fibre, streaming and cleaning of the shared areas included.`
    : `${A.name}, la colocation de La Villa Coliving à ${A.commune}, quartier de la gare : ${A.rooms.total} chambres meublées de ${A.rooms.surface.min} à ${A.rooms.surface.max} m² dans un appartement de ${A.flat.surfaceM2} m², charges, fibre, streaming et ménage des communs compris.`;
  const low = A.price.from, high = A.price.room.chf >= A.price.suite.chf ? A.price.room : A.price.suite;
  return {
    ...(opts.context ? { "@context": "https://schema.org" } : {}),
    "@type": "LodgingBusiness",
    "@id": placeLodgingId(p.slug),
    name: `La Villa Coliving — ${p.label}`,
    alternateName: [p.label, `La Villa Coliving — ${p.label}, ${p.commune}`],
    parentOrganization: { "@id": ORG_ID },
    url: p.url,
    image: `${SITE}${p.image}`,
    description,
    telephone: LAVILLA_PHONE,
    email: LAVILLA_EMAIL,
    address: {
      "@type": "PostalAddress",
      addressLocality: p.addressLocality,
      addressRegion: "Haute-Savoie",
      postalCode: p.postalCode,
      addressCountry: "FR",
    },
    geo: { "@type": "GeoCoordinates", latitude: publicGeo(p).lat, longitude: publicGeo(p).lng },
    numberOfRooms: A.rooms.total,
    priceRange: en ? `CHF ${low.en.chfNum}–${high.en.chfNum}/month` : `${low.fr.chfNum}–${high.fr.chfNum} CHF/mois`,
    amenityFeature: (en ? p.amenityFeatures.en : p.amenityFeatures.fr).map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
  };
}

/** Chambre candidate telle que la sert v_public_rooms (forme minimale : pas d'import de src/lib/availability ici, ce module est
 *  aussi chargé par les scripts Node). */
export interface RoomOfferInput {
  house_slug: string;
  room_number: number;
  rent_chf: number | null;
  /** (L'Appart, 13/11/2026) Loyer contractuel en euros (numeric PostgREST : nombre ou chaîne) — seconde spécification de prix. */
  rent_eur?: number | string | null;
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
      // (L'Appart, 13/11/2026) Lieu public de la chambre, maison ou L'Appart : libellé (« Suite » pour la n° 5 de L'Appart),
      // rattachement au nœud du lieu, loyer en CHF ET loyer contractuel en euros (deux UnitPriceSpecification).
      const h = placeInfo(r.house_slug);
      const label = h?.label ?? r.house_slug;
      const room = isPlaceKey(r.house_slug) ? roomLabel(r.house_slug, r.room_number, language) : `${en ? "Room" : "Chambre"} ${r.room_number}`;
      const roomName = `${room} — ${label}`;
      const eur = r.rent_eur === null || r.rent_eur === undefined || r.rent_eur === "" ? null : Number(r.rent_eur);
      const monthly = (price: number, priceCurrency: "CHF" | "EUR") =>
        ({ "@type": "UnitPriceSpecification", price, priceCurrency, unitCode: "MON", unitText: en ? "per month" : "par mois" });
      return {
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Offer",
          name: `${label} — ${room}`,
          url: `${SITE}${prefix}/${r.house_slug}`,
          ...(r.rent_chf !== null
            ? {
                price: r.rent_chf,
                priceCurrency: "CHF",
                priceSpecification: [
                  monthly(r.rent_chf, "CHF"),
                  ...(eur !== null && Number.isFinite(eur) ? [monthly(eur, "EUR")] : []),
                ],
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
                  containedInPlace: { "@id": placeLodgingId(h.slug) },
                  address: { "@type": "PostalAddress", addressLocality: h.addressLocality, postalCode: h.postalCode, addressCountry: "FR" },
                }
              : {}),
          },
        },
      };
    }),
  };
}

/** (Lot L6.6) NAP — nom, téléphone, e-mail et URL dans la forme exacte de la fiche Google (une seule fiche pour les trois
 *  maisons, décision Jérôme). (13/11/2026, lot « sécurité des adresses ») Les adresses du NAP (siège, maisons) ne sont plus
 *  dans le code : elles vivent dans la documentation privée, d'où elles se reportent sur les annuaires (src/data/README.md). */
export const LAVILLA_NAP = {
  name: "La Villa Coliving",
  phoneE164: LAVILLA_PHONE,
  phoneDisplay: "+33 6 64 31 51 34",
  email: LAVILLA_EMAIL,
  url: SITE,
} as const;

// ── (L'Appart, Lot 4, étape E5) La marque dans les données structurées : deux gammes, jamais fondues ─────────────────────
// Les deux fiches d'organisation (LodgingBusiness de l'accueil, LocalBusiness de toutes les pages) décrivent la MARQUE : les
// 3 maisons et L'Appart dans `department`, 33 chambres, `priceRange` de la marque (« 730–1 430 CHF/mois »), et UNE OFFRE PAR
// GAMME dans `makesOffer` (décision n° 16 de la critique, à confirmer : une offre unique 730–1 430 mettrait 730 CHF à côté de
// la piscine) ; plus de piscine, de sauna ni de salle de sport dans leur `amenityFeature` (ils restent sur les nœuds des
// maisons, Q17). Valeurs dérivées des sources (STATS, HOUSES_FROM, APPART) ; ce module, chargé par le morceau d'entrée (SEO.tsx),
// n'importe jamais src/data/entityFacts.ts — tools/test/entity-schema.test.mjs égale ces nombres à ENTITY_FACTS.brand.
/** Chambres de la marque : les 29 des maisons + les 4 de L'Appart. */
const BRAND_ROOMS = STATS.totalRooms + APPART.rooms.total;
/** Fourchette de la marque : du « dès » le plus bas des deux gammes au loyer le plus haut. */
const BRAND_LOW = APPART.price.from.chf < HOUSES_FROM.chf ? APPART.price.from : HOUSES_FROM;
const BRAND_HIGH_CHF = Math.max(STATS.priceChf, APPART.price.room.chf, APPART.price.suite.chf);
const brandPriceRange = (en: boolean): string =>
  en ? `CHF ${BRAND_LOW.en.chfNum}–${thousands(BRAND_HIGH_CHF, ",")}/month` : `${BRAND_LOW.fr.chfNum}–${thousands(BRAND_HIGH_CHF, " ")} CHF/mois`;

/** Les deux offres agrégées de la marque, une par gamme (textes du 13/11/2026, « à confirmer ») : maisons 1 290–1 430 CHF
 *  (29 chambres), L'Appart 730–990 CHF (4 chambres, ouverture APPART.opensOn — `availabilityStarts`, aucune disponibilité
 *  affirmée : elle se lit chambre par chambre dans v_public_rooms). Jamais un équipement des maisons dans l'offre de L'Appart. */
function brandOffers(language: "fr" | "en"): Record<string, unknown>[] {
  const en = language === "en";
  const A = APPART;
  const url = `${SITE}${en ? "/en" : ""}/tarifs`;
  const seller = { "@type": "Organization", name: "La Villa Coliving", url: SITE };
  const appartHigh = A.price.room.chf >= A.price.suite.chf ? A.price.room : A.price.suite;
  return [
    {
      "@type": "AggregateOffer",
      name: en ? "Furnished room in a coliving house near Geneva" : "Chambre meublée en maison de coliving près de Genève",
      description: en
        ? `Furnished room of ${STATS.roomSizeMin} to ${STATS.roomSizeMax} m² in a coliving house: all utilities, fibre internet, cleaning of the common areas, pool, sauna and gym included. No application fee.`
        : `Chambre meublée de ${STATS.roomSizeMin} à ${STATS.roomSizeMax} m² dans une maison de coliving : charges, internet fibre, ménage des communs, piscine, sauna et salle de sport inclus. Sans frais de dossier.`,
      lowPrice: String(HOUSES_FROM.chf),
      highPrice: String(STATS.priceChf),
      priceCurrency: "CHF",
      offerCount: STATS.totalRooms,
      availability: "https://schema.org/InStock",
      url,
      seller,
    },
    {
      "@type": "AggregateOffer",
      name: en ? `Furnished room in a flatshare in ${A.commune} (${A.name})` : `Chambre meublée en colocation à ${A.commune} (${A.name})`,
      description: en
        ? `Furnished room of ${A.rooms.surface.min} to ${A.rooms.surface.max} m² at ${A.name}, a ${A.descriptor.en}: bills, fibre, streaming and cleaning of the shared areas included. No application fee.`
        : `Chambre meublée de ${A.rooms.surface.min} à ${A.rooms.surface.max} m² à ${A.name}, ${A.descriptor.fr} : charges, fibre, streaming et ménage des communs inclus. Sans frais de dossier.`,
      lowPrice: String(A.price.from.chf),
      highPrice: String(appartHigh.chf),
      priceCurrency: "CHF",
      offerCount: A.rooms.total,
      availabilityStarts: A.opensOn,
      url,
      seller,
    },
  ];
}

/** Les 4 lieux de la marque dans `department` : les 3 maisons (leurs nœuds) puis L'Appart (le sien). */
const brandDepartments = (language: "fr" | "en"): Record<string, unknown>[] =>
  [...HOUSES.map((h) => buildHouseLodgingNode(h, language)), buildAppartLodgingNode(language)];

/**
 * Entité mère de l'accueil : LodgingBusiness avec les 3 maisons et L'Appart en `department` (étape E5).
 * PAS d'`aggregateRating` ni de `Review` (D4, 09/10/2026) : la note publiée est celle de la fiche Google (GOOGLE_REVIEWS),
 * et Google n'affiche pas les avis auto-balisés d'un LocalBusiness sur son propre site — garde check-entity-facts.
 * Prix / fibre sourcés depuis STATS et APPART pour rester cohérents partout.
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
    // (L'Appart, E5) Les deux gammes nommées, sans prix ; la formule de trajet qui suit reste celle des maisons.
    description: en
      ? `All-inclusive coliving and flatshare near Geneva, on the French side: ${STATS.totalHouses} coliving houses (${STATS.totalRooms} furnished rooms), with pool, sauna and gym in every house, and ${APPART.name}, a ${APPART.rooms.total}-room flatshare in ${APPART.commune}. ${GENEVA_COMMUTE_FORMULA.en}.`
      : `Coliving et colocation tout compris près de Genève, côté France : ${STATS.totalHouses} maisons de coliving (${STATS.totalRooms} chambres meublées), avec piscine, sauna et salle de sport dans chaque maison, et ${APPART.name}, une colocation de ${APPART.rooms.total} chambres à ${APPART.commune}. ${GENEVA_COMMUTE_FORMULA.fr}.`,
    url: `${SITE}/`,
    logo: `${SITE}/logos/logo-full.png`,
    image: `${SITE}/images/villa_portrait.webp`,
    telephone: LAVILLA_PHONE,
    email: LAVILLA_EMAIL,
    priceRange: brandPriceRange(en),
    // Offres citables par les moteurs et les IA (AI Overviews cite déjà nos prix — autant qu'ils viennent d'une donnée
    // structurée exacte) : une par gamme (maisons 1 290–1 430, L'Appart 730–990), jamais une seule qui mêle les deux.
    makesOffer: brandOffers(language),
    areaServed: ["Genève", "Annemasse", "Ville-la-Grand", "Ambilly", "Grand Genève"],
    knowsLanguage: ["fr", "en"],
    // (L'Appart, E5) Équipements COMMUNS aux deux gammes seulement, avec les mots du nœud de L'Appart (APPART_PLACE) : piscine,
    // sauna, salle de sport et le débit de fibre des maisons (STATS.fiberSpeed) vivent sur les nœuds des maisons (department),
    // jamais sur la fiche de la marque, qui porte aussi L'Appart (garde check:facts, brandAmenityIssues).
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: en ? "Fibre internet" : "Internet fibre", value: true },
      { "@type": "LocationFeatureSpecification", name: en ? "Common areas cleaning included" : "Ménage des parties communes inclus", value: true },
    ],
    sameAs: LAVILLA_SAME_AS,
    numberOfRooms: BRAND_ROOMS,
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
    geo: { "@type": "GeoCoordinates", latitude: publicGeo(HOUSES[0]).lat, longitude: publicGeo(HOUSES[0]).lng },
    department: brandDepartments(language),
  };
}

/**
 * LocalBusiness générique de TOUTES les pages (émis par SEO.tsx, sauf l'accueil qui porte le
 * LodgingBusiness ci-dessus avec le même @id). (Lot S1, 05/09/2026) Généralisé : les lieux en
 * `department`, les offres agrégées en `makesOffer`, `numberOfRooms`, `sameAs` — tous lus depuis les
 * sources uniques (STATS, ROOMS_BY_HOUSE, HOUSES, APPART, LAVILLA_SAME_AS). PAS d'aggregateRating ni de Review (D4, 09/10/2026).
 * (L'Appart, E5) La marque : 3 maisons + L'Appart en `department`, 33 chambres, une offre par gamme.
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
    priceRange: brandPriceRange(en),
    address: LAVILLA_POSTAL_ADDRESS,
    geo: { "@type": "GeoCoordinates", latitude: publicGeo(HOUSES[0]).lat, longitude: publicGeo(HOUSES[0]).lng },
    areaServed: ["Genève", "Annemasse", "Ville-la-Grand", "Ambilly", "Grand Genève"],
    numberOfRooms: BRAND_ROOMS,
    makesOffer: brandOffers(language),
    department: brandDepartments(language),
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

/**
 * (Article « C'est réel ? », D9 / Q17 de Jérôme du 16/10/2026) Valeur ASCII de `blog_posts.author` pour un article signé
 * des deux fondateurs : byline « Jérôme et Fanny » (prénoms seuls à l'écran), deux Person (noms complets) en JSON-LD.
 * Miroir : scripts/lib/article-checks.mjs (AUTHOR_DUO).
 */
export const AUTHOR_DUO = "Jerome Austin & Fanny Bela";

/** Fondateurs signataires d'un article : [] (auteur générique), [un fondateur] ou [Jérôme, Fanny] pour AUTHOR_DUO. */
export function getFoundersByAuthorName(author: string | null | undefined): Founder[] {
  if (author && author.trim().toLowerCase() === AUTHOR_DUO.toLowerCase()) return [FOUNDERS.jerome, FOUNDERS.fanny];
  const founder = getFounderByAuthorName(author);
  return founder ? [founder] : [];
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

/** Offre agrégée « chambres tout inclus » — du « dès » des maisons (HOUSES_FROM) au prix standard, sourcés depuis stats.ts (single source). */
export function buildRoomsAggregateOfferSchema(opts: { name: string; description: string; url: string }): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "AggregateOffer",
    name: opts.name,
    description: opts.description,
    lowPrice: String(HOUSES_FROM.chf),
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
