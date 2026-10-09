import { EntityFacts } from "@/components/EntityFacts";
import { Helmet } from "react-helmet";
import { lazy, Suspense, useState } from "react";
import { useLocation } from "react-router-dom";
import { responsiveImage } from "@/lib/responsiveImage";
import { LocalizedLink } from "@/components/LocalizedLink";
import { colocGeneveHref } from "@/lib/siteLinks";
import { Scrim } from "@/components/Scrim";
import { buildBreadcrumbSchema, homeUrl, HOUSES, LAVILLA_SAME_AS, ORG_ID } from "@/lib/structuredData";
import {
  MapPin,
  Users,
  Maximize,
  Zap,
  ArrowRight,
  Check,
  BedDouble,
  Clock,
  Star,
  Coffee,
  Wifi,
  Car,
  TreePine,
  Sun,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { STATS, STATS_DISPLAY, ROOMS_BY_HOUSE, HOUSE_SURFACES, ROOM_SURFACE_BY_HOUSE, TRANSIT, thousands, PRICE_FR_NUM, PRICE_EN_NUM, PRICE_CHF_FR, PRICE_CHF_EN, PRICE_SHARED_FR_NUM, PRICE_SHARED_EN_NUM, PRICE_SHARED_CHF_FR, PRICE_SHARED_CHF_EN, EUR_STANDARD_FR_NUM, EUR_STANDARD_EN_NUM, EUR_SHARED_FR_NUM, EUR_SHARED_EN_NUM } from "@/data/stats";
// (Lot L2 « Emplacement et transport », 09/10/2026) Source unique des faits d'emplacement : plus aucune minute,
// distance ou surface en dur dans cette page (règle D1/D6/D7 de Jérôme, recon L0.2a).
import { ENTITY_HOUSES } from "@/data/entityFacts";
import {
  HOUSE_LOCATION_VERSION,
  formatDistance,
  houseAddressLine,
  houseBorder,
  houseCommuteLong,
  houseCommuteRows,
  houseNearby,
  houseNeighbourhood,
  type HouseSlug,
} from "@/data/houseLocation";
import { HouseCommuteTable } from "@/components/HouseCommuteTable";
import {
  useRoomAvailability,
  useHouseRooms,
  roomHeroBadge,
  splitRooms,
  bathroomLabel,
  floorLabel,
  roomSpecs,
  roomSurface,
  houseBadgeLabel,
  houseBadgeTone,
  BADGE_CHIP_CLASS,
  BADGE_PANEL_CLASS,
  BADGE_DOT_CLASS,
  type HouseKey,
  type PublicRoom,
} from "@/lib/availability";
import { RoomsEmbed } from "@/components/RoomsEmbed";
import { RoomCard } from "@/components/RoomCard";
import { roomGallery } from "@/data/roomPhotos";

// (Lot 3) Visionneuse photos des chambres — même composant/lazy que la LP.
const PhotoLightbox = lazy(() => import("@/components/PhotoLightbox"));

import { Badge } from "@/components/ui/badge";
import { HouseGallery } from "@/sections/HouseGallery";
import { SEO } from "@/components/SEO";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { HouseMap } from "@/components/HouseMap";
import { RoomPipeline } from "@/components/RoomPipeline";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface GalleryImage {
  src: string;
  alt: string;
  category: "exterior" | "interior" | "common" | "room" | "amenity";
}

interface HouseData {
  name: string;
  location: string;
  description: string;
  longDescription: string;
  image: string;
  gallery: string[];
  photoGallery: GalleryImage[];
  capacity: string;
  price: string;
  specs: {
    size: string;
    plot?: string;
    dpe: string;
  };
  features: string[];
  services: string[];
  rooms: {
    type: string;
    price: string;
    /** Prix contractuel euro, affiche en leger entre parentheses. */
    priceEur?: string;
    description: string;
    image: string;
  }[];
  nearby: string[];
  lifestyle: string[];
  community: string[];
}

// (Lot L2, 09/10/2026) Aides d'emplacement — tout vient de TRANSIT / HOUSE_SURFACES / ROOM_SURFACE_BY_HOUSE
// via src/data/houseLocation.ts et src/data/entityFacts.ts. Chaînes plates (anti-#418), milliers via thousands().
type L2Lang = "fr" | "en";
const NBSP = " ";
/** « 2 000 m² » (FR, espace insécable) / « 2,000 m² » (EN). */
const m2 = (n: number, lang: L2Lang): string => `${thousands(n, lang === "en" ? "," : NBSP)} m²`;
/** Ligne courte A.1 de la maison (ENTITY_HOUSES[].commute) — présente dans les 300 premiers caractères de longDescription. */
const commuteShort = (slug: HouseSlug, lang: L2Lang): string =>
  ENTITY_HOUSES.find((h) => h.slug === slug)?.commute[lang] ?? "";
const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
/** Carte latérale « À Proximité » : ligne courte, vélo Voie Verte mesuré, frontière (quand elle est définie), commerces §1.3. */
function houseNearbyCard(slug: HouseSlug, lang: L2Lang): string[] {
  const border = houseBorder(slug, lang);
  const bike = houseCommuteRows(slug, lang)
    .filter((r) => r.mode.startsWith(lang === "en" ? "Bike" : "Vélo"))
    .map((r) => `${r.mode} — ${r.destination} : ${r.value}`);
  return [capitalize(commuteShort(slug, lang)), ...bike, ...(border ? [border] : []), ...houseNearby(slug, lang)];
}

function getHousesData(lang: string): Record<string, HouseData> {
  const isEn = lang === "en";
  const L: L2Lang = isEn ? "en" : "fr";
  const T = TRANSIT.byHouse;
  return {
  lavilla: {
    name: "La Villa",
    location: "Ville-la-Grand, Grand Genève",
    // (Lot L2, 09/10/2026) Surfaces = HOUSE_SURFACES (D2) ; ligne courte A.1 en tête du corps (D1).
    description: isEn
      ? `${HOUSE_SURFACES.lavilla.livingM2} m² of designed living on a ${m2(HOUSE_SURFACES.lavilla.plotM2, "en")} estate bordering a nature reserve. Heated pool, sauna, gym, and 10 spacious rooms.`
      : `${HOUSE_SURFACES.lavilla.livingM2} m² de vie design sur un domaine de ${m2(HOUSE_SURFACES.lavilla.plotM2, "fr")} bordant une réserve naturelle. Piscine chauffée, sauna, salle de sport et 10 chambres spacieuses.`,
    longDescription: isEn
      ? `Our flagship house, in Ville-la-Grand: ${commuteShort("lavilla", "en")}. ${HOUSE_SURFACES.lavilla.livingM2} m² for 10 housemates on a ${m2(HOUSE_SURFACES.lavilla.plotM2, "en")} estate bordering a nature reserve. Day to day: a heated 12×5 m pool, a 5-seat sauna, a fully equipped gym and 8 Gb/s fiber. All rooms are furnished with Emma or Tediber mattresses — 6 with a private en-suite bathroom at ${PRICE_CHF_EN}/month, 4 with 2 shower rooms each shared between just 2 rooms, at ${PRICE_SHARED_CHF_EN}/month (shower-room cleaning is included in the rent — no hassle!). All-inclusive rent covers utilities, fiber, cleaning of common areas three times a week, pool and garden upkeep. No application fee, reply within 48h.`
      : `Notre maison amirale, à Ville-la-Grand : ${commuteShort("lavilla", "fr")}. ${HOUSE_SURFACES.lavilla.livingM2} m² pour 10 colocataires, sur un domaine de ${m2(HOUSE_SURFACES.lavilla.plotM2, "fr")} en bordure de réserve naturelle. Au quotidien : piscine chauffée de 12×5 m, sauna 5 places, salle de sport équipée et fibre 8 Gb/s. Toutes les chambres sont meublées avec matelas Emma ou Tediber — 6 avec salle de bain privative à ${PRICE_CHF_FR}/mois, 4 avec 2 salles d'eau partagées, chacune entre 2 chambres seulement, à ${PRICE_SHARED_CHF_FR}/mois (leur ménage est inclus dans le loyer : pas de tracas !). Loyer tout inclus : charges, fibre, ménage 3×/semaine des espaces communs, entretien piscine et jardin. 0 frais de dossier, réponse sous 48 h.`,
    image: "/images/la villa jardin.webp",
    gallery: [
      "/images/la villa/rooms/La Villa-92.webp",
      "/images/la villa/rooms/La Villa-111.webp",
      "/images/la villa/interior/La Villa-105.webp",
      "/images/la villa/common areas/La Villa-113.webp",
      "/images/la villa/exterior/La Villa-110.webp",
      "/images/la villa/exterior/villa_portrait.webp",
    ],
    photoGallery: [
      // Exterior
      {
        src: "/images/la villa/exterior/villa_portrait.webp",
        alt: "La Villa outdoor space",
        category: "exterior",
      },
      {
        src: "/images/la villa/exterior/la villa jardin.webp",
        alt: "La Villa outdoor space",
        category: "exterior",
      },
      {
        src: "/images/la villa/exterior/La Villa-43.webp",
        alt: "La Villa outdoor space",
        category: "exterior",
      },
      {
        src: "/images/la villa/exterior/La Villa-145.webp",
        alt: "La Villa exterior view",
        category: "exterior",
      },
      {
        src: "/images/la villa/exterior/La Villa-110.webp",
        alt: "La Villa garden and pool",
        category: "exterior",
      },
      {
        src: "/images/la villa/exterior/La Villa-107.webp",
        alt: "La Villa terrace",
        category: "exterior",
      },
      {
        src: "/images/la villa/exterior/La Villa-101.webp",
        alt: "La Villa outdoor space",
        category: "exterior",
      },
      {
        src: "/images/la villa/exterior/La Villa-100.webp",
        alt: "La Villa outdoor space",
        category: "exterior",
      },
      {
        src: "/images/la villa/exterior/La Villa-99.webp",
        alt: "La Villa outdoor space",
        category: "exterior",
      },
      {
        src: "/images/la villa/exterior/La Villa-69.webp",
        alt: "La Villa outdoor space",
        category: "exterior",
      },
      {
        src: "/images/la villa/exterior/La Villa-53.webp",
        alt: "La Villa outdoor space",
        category: "exterior",
      },
      {
        src: "/images/la villa/exterior/La Villa-45.webp",
        alt: "La Villa outdoor space",
        category: "exterior",
      },
      {
        src: "/images/la villa/exterior/La Villa-15.webp",
        alt: "La Villa outdoor space",
        category: "exterior",
      },
      {
        src: "/images/la villa/exterior/La Villa-43.webp",
        alt: "La Villa outdoor space",
        category: "exterior",
      },
      // Interior
      {
        src: "/images/la villa/interior/La Villa-129.webp",
        alt: "La Villa interior design",
        category: "interior",
      },
      {
        src: "/images/la villa/interior/La Villa-112.webp",
        alt: "La Villa interior design",
        category: "interior",
      },
      {
        src: "/images/la villa/interior/La Villa-105.webp",
        alt: "La Villa interior design",
        category: "interior",
      },
      {
        src: "/images/la villa/interior/La Villa-89.webp",
        alt: "La Villa interior design",
        category: "interior",
      },
      {
        src: "/images/la villa/interior/La Villa-82.webp",
        alt: "La Villa interior design",
        category: "interior",
      },
      {
        src: "/images/la villa/interior/La Villa-56.webp",
        alt: "La Villa interior design",
        category: "interior",
      },
      // Common Areas
      {
        src: "/images/la villa/common areas/La Villa-113.webp",
        alt: "La Villa common area",
        category: "common",
      },
      {
        src: "/images/la villa/common areas/La Villa-85.webp",
        alt: "La Villa shared space",
        category: "common",
      },
      {
        src: "/images/la villa/common areas/La Villa-41.webp",
        alt: "La Villa shared space",
        category: "common",
      },
      {
        src: "/images/la villa/common areas/La Villa-21.webp",
        alt: "La Villa shared space",
        category: "common",
      },
      {
        src: "/images/la villa/common areas/La Villa-9.webp",
        alt: "La Villa shared space",
        category: "common",
      },
      {
        src: "/images/la villa/interior/La Villa-134.webp",
        alt: "La Villa kitchen",
        category: "common",
      },
      {
        src: "/images/la villa/common areas/La Villa-167.webp",
        alt: "La Villa terrace",
        category: "common",
      },
      {
        src: "/images/la villa/common areas/La Villa-168.webp",
        alt: "La Villa terrace",
        category: "common",
      },
      {
        src: "/images/la villa/common areas/La Villa-169.webp",
        alt: "La Villa terrace",
        category: "common",
      },
      // Rooms
      {
        src: "/images/la villa/rooms/La Villa-92.webp",
        alt: "La Villa private room",
        category: "room",
      },
      {
        src: "/images/la villa/rooms/La Villa-80.webp",
        alt: "La Villa bedroom",
        category: "room",
      },
      {
        src: "/images/la villa/rooms/La Villa-46.webp",
        alt: "La Villa room with desk",
        category: "room",
      },
      {
        src: "/images/la villa/rooms/La Villa-138.webp",
        alt: "La Villa cozy room",
        category: "room",
      },
      {
        src: "/images/la villa/rooms/La Villa-111.webp",
        alt: "La Villa cozy room",
        category: "room",
      },
      {
        src: "/images/la villa/rooms/La Villa-88.webp",
        alt: "La Villa cozy room",
        category: "room",
      },
      {
        src: "/images/la villa/rooms/La Villa-51.webp",
        alt: "La Villa cozy room",
        category: "room",
      },
      {
        src: "/images/la villa/rooms/La Villa-29.webp",
        alt: "La Villa cozy room",
        category: "room",
      },
      // Amenities
      {
        src: "/images/la villa/amenities/La Villa-109.webp",
        alt: "La Villa swimming pool",
        category: "amenity",
      },
      {
        src: "/images/la villa/amenities/La Villa-40.webp",
        alt: "La Villa gym",
        category: "amenity",
      },
      {
        src: "/images/la villa/amenities/La Villa-42.webp",
        alt: "La Villa sauna",
        category: "amenity",
      },
      {
        src: "/images/la villa/amenities/La Villa-38.webp",
        alt: "La Villa sauna",
        category: "amenity",
      },
      {
        src: "/images/la villa/amenities/La Villa-37.webp",
        alt: "La Villa sauna",
        category: "amenity",
      },
      {
        src: "/images/la villa/amenities/La Villa-26.webp",
        alt: "La Villa sauna",
        category: "amenity",
      },
      {
        src: "/images/la villa/amenities/La Villa-11.webp",
        alt: "La Villa sauna",
        category: "amenity",
      },
    ],
    capacity: isEn ? "10 residents" : "10 résidents",
    price: isEn ? PRICE_EN_NUM : PRICE_FR_NUM,
    specs: {
      size: `${HOUSE_SURFACES.lavilla.livingM2} m²`,
      plot: m2(HOUSE_SURFACES.lavilla.plotM2, L),
      dpe: "D",
    },
    features: isEn ? [
      "Heated 12×5m swimming pool (mid-April to end of September)",
      "5-seat sauna",
      "Fully equipped gym",
      "TV & gaming room (PS5, PS4 & Switch)",
      "XXL barbecue & multiple terraces",
      "Volleyball court",
      "Parking included",
      "Laundry & storage room",
      "fiber internet up to 8 Gb/s",
      "Vegetable garden & outdoor terraces",
      "Double equipped kitchen",
    ] : [
      "Piscine chauffée 12×5 m (mi-avril à fin septembre)",
      "Sauna 5 places",
      "Salle de sport équipée",
      "Salle TV & gaming (PS5, PS4 & Switch)",
      "BBQ XXL & terrasses multiples",
      "Terrain de volley",
      "Parking inclus",
      "Buanderie & espace rangement",
      "Internet fibre jusqu'à 8 Gb/s",
      "Potager & terrasses extérieures",
      "Double cuisine équipée",
    ],
    services: isEn ? [
      "Housekeeping three times a week",
      "Weekly private yoga & fitness classes",
      "Monthly pizza party",
      "Seasonal community events",
      "WhatsApp direct support",
      "Pool, sauna & garden maintenance",
      "Streaming subscriptions (Netflix, Canal+, etc.)",
      "Bed linen set & towels provided",
    ] : [
      "Ménage des communs 3 fois par semaine",
      "Cours de yoga & fitness privés hebdomadaires",
      "Pizza Party mensuelle",
      "Événements communautaires saisonniers",
      "Support WhatsApp direct",
      "Entretien piscine, sauna & jardin",
      "Abonnements streaming (Netflix, Canal+, etc.)",
      "Parure de linge de lit et serviettes fournie",
    ],
    rooms: [
      {
        type: isEn ? "Room with private bathroom" : "Chambre avec salle de bain privative",
        price: isEn ? `${PRICE_EN_NUM} CHF` : `${PRICE_FR_NUM} CHF`,
        priceEur: isEn ? `€${EUR_STANDARD_EN_NUM}` : `${EUR_STANDARD_FR_NUM} €`,
        // (Lot L2) Surfaces par maison = ROOM_SURFACE_BY_HOUSE (plus de fourchette EN en dur, parité FR/EN).
        description: isEn
          ? `Your private sanctuary with double Emma bed, ergonomic desk, spacious closet, and private bathroom. Most rooms offer a terrace or balcony with garden views. ${ROOM_SURFACE_BY_HOUSE.lavilla.min} to ${ROOM_SURFACE_BY_HOUSE.lavilla.max} m².`
          : `Ton espace privé avec lit double Emma, bureau ergonomique, placard spacieux et salle de bain privative. La plupart des chambres offrent une terrasse ou un balcon avec vue sur le jardin. ${ROOM_SURFACE_BY_HOUSE.lavilla.min} à ${ROOM_SURFACE_BY_HOUSE.lavilla.max} m².`,
        image: "/images/la villa/rooms/La Villa-80.webp",
      },
      {
        type: isEn ? "Room with shared bathroom" : "Chambre avec salle de bain partagée",
        price: isEn ? `${PRICE_SHARED_EN_NUM} CHF` : `${PRICE_SHARED_FR_NUM} CHF`,
        priceEur: isEn ? `€${EUR_SHARED_EN_NUM}` : `${EUR_SHARED_FR_NUM} €`,
        description: isEn
          // (Lot L2) Sous-fourchette des 4 chambres partagées non sourcée (v_public_rooms) → retirée, la fourchette maison suffit.
          ? "Comfortable private room with double Emma bed, workspace, and ample storage. Designer shower room shared with just one other room, cleaned by our housekeeping team."
          : "Chambre privée confortable avec lit double Emma, espace de travail et rangement. Salle d'eau design partagée avec une seule autre chambre, entretenue par notre équipe de ménage.",
        image: "/images/la villa/rooms/La Villa-92.webp",
      },
    ],
    // (Lot L2, 09/10/2026) Carte « À Proximité » lue dans la source (ligne A.1, vélo Voie Verte, frontière D6, commerces §1.3) :
    // plus aucune promesse automobile ni minute ou distance non mesurée (règles D1, D6, D7).
    nearby: houseNearbyCard("lavilla", L),
    lifestyle: isEn ? [
      "Morning yoga by the pool",
      "Community BBQ dinners",
      "Weekend volleyball tournaments",
      "Garden-to-table cooking",
      "Movie nights in the TV room",
      "Nature walks along the reserve",
    ] : [
      "Yoga matinal au bord de la piscine",
      "Dîners BBQ communautaires",
      "Tournois de volley le week-end",
      "Cuisine du potager à l'assiette",
      "Soirées cinéma dans la salle TV",
      "Promenades nature le long de la réserve",
    ],
    community: isEn ? [
      "International professionals",
      "Remote workers & cross-border commuters",
      "Entrepreneurs & creatives",
      "Nature lovers & wellness enthusiasts",
    ] : [
      "Professionnels internationaux",
      "Télétravailleurs & frontaliers",
      "Entrepreneurs & créatifs",
      "Amoureux de la nature & passionnés de bien-être",
    ],
  },
  leloft: {
    name: "Le Loft",
    location: "Ambilly, Grand Genève",
    description: isEn
      ? `A ${HOUSE_SURFACES.leloft.livingM2} m² townhouse with year-round heated indoor pool, Finnish sauna, outdoor kitchen, and 7 spacious designer rooms.`
      : `Maison de ville de ${HOUSE_SURFACES.leloft.livingM2} m² avec piscine intérieure chauffée toute l'année, sauna finlandais, cuisine extérieure et 7 chambres design spacieuses.`,
    longDescription: isEn
      // Lot A (02/09/2026, texte Jérôme) : ouverture « maison la plus intime », clôture salle d'eau privative au prix
      // constant (jamais un montant en dur). Lot L2 (09/10/2026, D6) : frontière = le Foron à 600 m (TRANSIT), plus
      // plus l'ancienne distance non mesurée ; ligne courte A.1 dans les 300 premiers caractères (D1).
      ? `Le Loft is our most intimate house: 7 residents in a ${HOUSE_SURFACES.leloft.livingM2} m² townhouse in the centre of Ambilly, ${formatDistance(T.leloft.border.foronDistanceM, "en")} from the Swiss border (the Foron river) — ${commuteShort("leloft", "en")}. Its year-round heated indoor pool — virtually unique in European coliving — is the centerpiece of this exceptional property. The Finnish sauna, fully equipped gym, designer interiors, outdoor kitchen with TV, and spacious terraces make Le Loft ideal for those who appreciate the finer things while valuing genuine community. It's also a house where every room has its own private shower room, at ${PRICE_CHF_EN} all-inclusive.`
      : `Le Loft, c'est notre maison la plus intime : 7 résidents, une maison de ville de ${HOUSE_SURFACES.leloft.livingM2} m² au centre d'Ambilly, à ${formatDistance(T.leloft.border.foronDistanceM, "fr")} de la frontière suisse (le Foron) — ${commuteShort("leloft", "fr")}. Sa piscine intérieure chauffée toute l'année — quasi unique en coliving européen — est la pièce maîtresse de ce bien d'exception. Le sauna finlandais, la salle de sport équipée, les intérieurs design, la cuisine extérieure avec TV et les terrasses spacieuses font du Loft un lieu idéal pour ceux qui apprécient le raffinement tout en valorisant la vraie communauté. C'est aussi une maison où chaque chambre a sa salle d'eau privative, à ${PRICE_CHF_FR} tout compris.`,
    image: "/images/la villa coliving le loft piscine.webp",
    gallery: [
      "/images/le loft/rooms/la villa coliving le loft-21.webp",
      "/images/le loft/rooms/la villa coliving le loft-24.webp",
      "/images/le loft/interior/Le loft salon.webp",
      "/images/le loft/exterior/le loft glamour.webp",
      "/images/le loft/exterior/le loft jardin.webp",
      "/images/le loft/common areas/la villa coliving le loft-67.webp",
    ],
    photoGallery: [
      // Exterior
      {
        src: "/images/le loft/exterior/la villa coliving le loft-25.webp",
        alt: "Le Loft exterior",
        category: "exterior",
      },
      {
        src: "/images/le loft/exterior/la villa coliving le loft-118.webp",
        alt: "Le Loft facade",
        category: "exterior",
      },
      {
        src: "/images/le loft/exterior/la villa coliving le loft-114.webp",
        alt: "Le Loft facade",
        category: "exterior",
      },
      {
        src: "/images/le loft/exterior/la villa coliving le loft-110.webp",
        alt: "Le Loft facade",
        category: "exterior",
      },
      {
        src: "/images/le loft/exterior/la villa coliving le loft-109.webp",
        alt: "Le Loft facade",
        category: "exterior",
      },
      {
        src: "/images/le loft/exterior/la villa coliving le loft-16.webp",
        alt: "Le Loft facade",
        category: "exterior",
      },
      {
        src: "/images/le loft/exterior/la villa coliving le loft-18.webp",
        alt: "Le Loft facade",
        category: "exterior",
      },
      {
        src: "/images/le loft/exterior/la villa coliving le loft-12.webp",
        alt: "Le Loft facade",
        category: "exterior",
      },
      {
        src: "/images/le loft/exterior/la villa coliving le loft-9.webp",
        alt: "Le Loft facade",
        category: "exterior",
      },
      {
        src: "/images/le loft/exterior/la villa coliving le loft-6.webp",
        alt: "Le Loft facade",
        category: "exterior",
      },
      {
        src: "/images/le loft/exterior/la villa coliving le loft.webp",
        alt: "Le Loft facade",
        category: "exterior",
      },
      {
        src: "/images/le loft/exterior/le loft jardin.webp",
        alt: "Le Loft facade",
        category: "exterior",
      },
      // Interior
      {
        src: "/images/le loft/interior/Le loft salon.webp",
        alt: "Le Loft living area",
        category: "interior",
      },
      {
        src: "/images/le loft/interior/la villa coliving le loft-50.webp",
        alt: "Le Loft living area",
        category: "interior",
      },
      {
        src: "/images/le loft/interior/la villa coliving le loft-60.webp",
        alt: "Le Loft living area",
        category: "interior",
      },
      {
        src: "/images/le loft/interior/la villa coliving le loft-76.webp",
        alt: "Le Loft living area",
        category: "interior",
      },
      {
        src: "/images/le loft/interior/la villa coliving le loft-77.webp",
        alt: "Le Loft living area",
        category: "interior",
      },
      {
        src: "/images/le loft/interior/la villa coliving le loft-96.webp",
        alt: "Le Loft living area",
        category: "interior",
      },
      {
        src: "/images/le loft/interior/la villa coliving le loft-97.webp",
        alt: "Le Loft living area",
        category: "interior",
      },
      {
        src: "/images/le loft/interior/la villa coliving le loft-100.webp",
        alt: "Le Loft living area",
        category: "interior",
      },
      {
        src: "/images/le loft/interior/la villa coliving le loft-103.webp",
        alt: "Le Loft living area",
        category: "interior",
      },
      {
        src: "/images/le loft/interior/la villa coliving le loft-113.webp",
        alt: "Le Loft living area",
        category: "interior",
      },
      {
        src: "/images/le loft/interior/la villa coliving le loft-119.webp",
        alt: "Le Loft living area",
        category: "interior",
      },
      // Common Areas
      {
        // Photo de groupe des résidents (seule preuve sociale visuelle des 3 pages) — l'alt
        // disait « indoor pool » (Lot A, 02/09/2026). Reste aussi en position 5 du hero.
        src: "/images/le loft/exterior/le loft glamour.webp",
        alt: isEn ? "Le Loft residents at a terrace aperitif" : "Résidents du Loft à l'apéro en terrasse",
        category: "common",
      },
      {
        src: "/images/le loft/common areas/la villa coliving le loft-62.webp",
        alt: "Le Loft shared space",
        category: "common",
      },
      {
        src: "/images/le loft/common areas/la villa coliving le loft-63.webp",
        alt: "Le Loft shared space",
        category: "common",
      },
      {
        src: "/images/le loft/common areas/la villa coliving le loft-67.webp",
        alt: "Le Loft shared space",
        category: "common",
      },
      {
        src: "/images/le loft/common areas/la villa coliving le loft-68.webp",
        alt: "Le Loft shared space",
        category: "common",
      },
      {
        src: "/images/le loft/common areas/la villa coliving le loft-70.webp",
        alt: "Le Loft shared space",
        category: "common",
      },
      {
        src: "/images/le loft/common areas/la villa coliving le loft-79.webp",
        alt: "Le Loft shared space",
        category: "common",
      },
      {
        src: "/images/le loft/common areas/la villa coliving le loft-82.webp",
        alt: "Le Loft shared space",
        category: "common",
      },
      // Rooms
      {
        src: "/images/le loft/rooms/la villa coliving le loft-4.webp",
        alt: "Le Loft designer room",
        category: "room",
      },
      {
        src: "/images/le loft/rooms/la villa coliving le loft-21.webp",
        alt: "Le Loft bedroom",
        category: "room",
      },
      {
        src: "/images/le loft/rooms/la villa coliving le loft-24.webp",
        alt: "Le Loft private room",
        category: "room",
      },
      {
        src: "/images/le loft/rooms/la villa coliving le loft-25.webp",
        alt: "Le Loft cozy bedroom",
        category: "room",
      },
      {
        src: "/images/le loft/rooms/la villa coliving le loft-31.webp",
        alt: "Le Loft bedroom",
        category: "room",
      },
      {
        src: "/images/le loft/rooms/la villa coliving le loft-33.webp",
        alt: "Le Loft bedroom",
        category: "room",
      },
      {
        src: "/images/le loft/rooms/la villa coliving le loft-35.webp",
        alt: "Le Loft bedroom",
        category: "room",
      },
      {
        src: "/images/le loft/rooms/la villa coliving le loft-36.webp",
        alt: "Le Loft bedroom",
        category: "room",
      },
      {
        src: "/images/le loft/rooms/la villa coliving le loft-39.webp",
        alt: "Le Loft bedroom",
        category: "room",
      },
      {
        src: "/images/le loft/rooms/la villa coliving le loft-41.webp",
        alt: "Le Loft bedroom",
        category: "room",
      },
      {
        src: "/images/le loft/rooms/la villa coliving le loft-45.webp",
        alt: "Le Loft bedroom",
        category: "room",
      },
      {
        src: "/images/le loft/rooms/la villa coliving le loft-47.webp",
        alt: "Le Loft bedroom",
        category: "room",
      },
      {
        src: "/images/le loft/rooms/la villa coliving le loft-52.webp",
        alt: "Le Loft bedroom",
        category: "room",
      },
      {
        src: "/images/le loft/rooms/la villa coliving le loft-56.webp",
        alt: "Le Loft bedroom",
        category: "room",
      },
      {
        src: "/images/le loft/rooms/la villa coliving le loft-58.webp",
        alt: "Le Loft bedroom",
        category: "room",
      },
      // Amenities
      {
        src: "/images/le loft/amenities/la villa coliving le loft-3.webp",
        alt: "Le Loft indoor pool",
        category: "amenity",
      },
      {
        src: "/images/le loft/amenities/la villa coliving le loft-2.webp",
        alt: "Le Loft gym",
        category: "amenity",
      },
      {
        src: "/images/le loft/amenities/la villa coliving le loft-112.webp",
        alt: "Le Loft sauna",
        category: "amenity",
      },
      {
        src: "/images/le loft/amenities/la villa coliving le loft-99.webp",
        alt: "Le Loft sauna",
        category: "amenity",
      },
      {
        src: "/images/le loft/amenities/la villa coliving le loft-94.webp",
        alt: "Le Loft sauna",
        category: "amenity",
      },
      {
        src: "/images/le loft/amenities/la villa coliving le loft-93.webp",
        alt: "Le Loft sauna",
        category: "amenity",
      },
      {
        src: "/images/le loft/amenities/la villa coliving le loft-90.webp",
        alt: "Le Loft sauna",
        category: "amenity",
      },
      {
        src: "/images/le loft/amenities/la villa coliving le loft-89.webp",
        alt: "Le Loft sauna",
        category: "amenity",
      },
      {
        src: "/images/le loft/amenities/la villa coliving le loft-5.webp",
        alt: "Le Loft sauna",
        category: "amenity",
      },
    ],
    capacity: isEn ? "7 residents" : "7 résidents",
    price: isEn ? PRICE_EN_NUM : PRICE_FR_NUM,
    specs: {
      size: `${HOUSE_SURFACES.leloft.livingM2} m²`,
      dpe: "C",
    },
    features: isEn ? [
      "Year-round heated indoor pool",
      "Finnish sauna (2 seats) in the pool area",
      "Fully equipped modern gym",
      "Large south-facing terraces",
      "XXL outdoor kitchen with TV",
      "Parking included",
      "In-house laundry room",
      "fiber internet up to 8 Gb/s",
      "Designer kitchen",
      "Foosball table",
    ] : [
      "Piscine intérieure chauffée toute l'année",
      "Sauna finlandais (2 places) dans l'espace piscine",
      "Salle de sport moderne équipée",
      "Grandes terrasses plein sud",
      "Cuisine extérieure XXL avec TV",
      "Parking inclus",
      "Buanderie intégrée",
      "Internet fibre jusqu'à 8 Gb/s",
      "Cuisine design",
      "Babyfoot",
    ],
    services: isEn ? [
      "Housekeeping three times a week",
      "Weekly private yoga & fitness classes",
      "Monthly pizza party",
      "Seasonal community events",
      "WhatsApp direct support",
      "Pool & sauna maintenance",
      "Streaming subscriptions (Netflix, Canal+, etc.)",
      "Bed linen set & towels provided",
    ] : [
      "Ménage des communs 3 fois par semaine",
      "Cours de yoga & fitness privés hebdomadaires",
      "Pizza Party mensuelle",
      "Événements communautaires saisonniers",
      "Support WhatsApp direct",
      "Entretien piscine & sauna",
      "Abonnements streaming (Netflix, Canal+, etc.)",
      "Parure de linge de lit et serviettes fournie",
    ],
    rooms: [
      {
        type: isEn ? "Room with private bathroom" : "Chambre avec salle de bain privative",
        price: isEn ? `${PRICE_EN_NUM} CHF` : `${PRICE_FR_NUM} CHF`,
        priceEur: isEn ? `€${EUR_STANDARD_EN_NUM}` : `${EUR_STANDARD_FR_NUM} €`,
        description: isEn
          ? `Elegant designer room (${ROOM_SURFACE_BY_HOUSE.leloft.min} to ${ROOM_SURFACE_BY_HOUSE.leloft.max} m²) with private en-suite shower room, premium Emma or Tediber mattress, workspace, and terrace access. All 7 rooms have a private shower room.`
          : `Chambre design élégante (${ROOM_SURFACE_BY_HOUSE.leloft.min} à ${ROOM_SURFACE_BY_HOUSE.leloft.max} m²) avec salle d'eau privative, matelas premium Emma ou Tediber, espace de travail et accès terrasse. Les 7 chambres ont une salle d'eau privative.`,
        image: "/images/le loft/rooms/la villa coliving le loft-52.webp",
      },
    ],
    // (Lot L2, 09/10/2026) Trajets : une seule vérité = src/data/houseLocation.ts (tram 17 à 8 min, gare à 18 min,
    // Eaux-Vives 24 min porte-à-porte, frontière D6, vélo Voie Verte mesuré). Même source en Localisation et FAQ.
    nearby: houseNearbyCard("leloft", L),
    lifestyle: isEn ? [
      "Morning swims in the indoor pool",
      "Terrace aperitifs at sunset",
      `The office on foot or by bike: the Swiss border (the Foron) is ${formatDistance(T.leloft.border.foronDistanceM, "en")} away`,
      "Shared dinners in the open kitchen",
      "Sauna & relaxation evenings",
      "Outdoor dining under the stars",
    ] : [
      "Baignades matinales dans la piscine intérieure",
      "Apéros en terrasse au coucher du soleil",
      `Le bureau à pied ou à vélo : la frontière suisse (le Foron) est à ${formatDistance(T.leloft.border.foronDistanceM, "fr")}`,
      "Dîners partagés dans la cuisine ouverte",
      "Soirées sauna & relaxation",
      "Dîners en extérieur sous les étoiles",
    ],
    community: isEn ? [
      "Cross-border workers & expats",
      "Young professionals on permanent contracts in Geneva",
      "Remote workers & consultants",
      "Pool lovers, 12 months a year",
    ] : [
      "Frontaliers & expatriés",
      "Jeunes pros en CDI à Genève",
      "Télétravailleurs & consultants",
      "Amateurs de piscine 12 mois sur 12",
    ],
  },
  lelodge: {
    name: "Le Lodge",
    location: "Annemasse, Grand Genève",
    // (Lot L2, 09/10/2026) Surfaces = HOUSE_SURFACES ; ligne courte A.1 dans les 300 premiers caractères (D1) ; temps de
    // train = TRANSIT (Eaux-Vives 7, Champel 10, Cornavin 23) ; plus aucune valeur approximative en dur.
    description: isEn
      ? `Our newest and largest home, open since January 2026. ${HOUSE_SURFACES.lelodge.livingM2} m² on ${m2(HOUSE_SURFACES.lelodge.plotM2, "en")}, pool house, full fitness chalet with sauna & arcade.`
      : `Notre maison la plus récente et la plus grande, ouverte depuis janvier 2026. ${HOUSE_SURFACES.lelodge.livingM2} m² sur ${m2(HOUSE_SURFACES.lelodge.plotM2, "fr")}, pool house, chalet fitness complet avec sauna et jeu d'arcade.`,
    longDescription: isEn
      ? `Le Lodge is our newest coliving in Annemasse, opened January 2026 in the quiet residential Romagny district: ${commuteShort("lelodge", "en")}. Within ${HOUSE_SURFACES.lelodge.livingM2} m² spread across 4 buildings at the heart of ${m2(HOUSE_SURFACES.lelodge.plotM2, "en")} of gardens, 12 housemates share a dedicated fitness chalet with Finnish sauna, a pool house with full outdoor kitchen, and a main residence designed to combine privacy and community living. Each furnished room has its own en-suite bathroom, ergonomic desk and fiber internet. Direct Léman Express from Annemasse station: Geneva Eaux-Vives in ${TRANSIT.trainEauxVivesMin} minutes, Champel in ${TRANSIT.trainChampelMin}, Cornavin in ${TRANSIT.trainCornavinMin}, no transfer — a train every ${TRANSIT.peakHeadwayMin} minutes at peak time. Ideal for cross-border workers commuting daily, and young professionals who value a real community over a faceless apartment block. All-inclusive rent (utilities, fiber, common cleaning three times a week, private fitness classes) at ${PRICE_CHF_EN}/month. No agency fees.`
      : `Le Lodge est notre coliving le plus récent à Annemasse, ouvert en janvier 2026 dans le quartier résidentiel calme de Romagny : ${commuteShort("lelodge", "fr")}. Dans ${HOUSE_SURFACES.lelodge.livingM2} m² répartis sur 4 bâtiments au cœur de ${m2(HOUSE_SURFACES.lelodge.plotM2, "fr")} de jardins, 12 colocataires partagent un chalet fitness dédié avec sauna finlandais, un pool house avec cuisine d'été complète et une résidence principale conçue pour combiner intimité et vie communautaire. Chaque chambre meublée dispose de sa salle de bain privative, d'un bureau ergonomique et de la fibre. Léman Express direct depuis la gare d'Annemasse : Genève-Eaux-Vives en ${TRANSIT.trainEauxVivesMin} min, Champel en ${TRANSIT.trainChampelMin} min, Cornavin en ${TRANSIT.trainCornavinMin} min, sans correspondance — un train toutes les ${TRANSIT.peakHeadwayMin} min en heure de pointe. Idéal pour les frontaliers qui font le trajet quotidien, et les jeunes pros qui valorisent une vraie communauté plutôt qu'un immeuble anonyme. Loyer tout inclus (charges, fibre, ménage commun 3 fois par semaine, cours de fitness privés) : ${PRICE_CHF_FR}/mois. Sans frais d'agence.`,
    image: "/images/le lodge/exterior/la villa coliving le lodge-14.webp",
    gallery: [
      "/images/le lodge/rooms/la villa coliving le lodge-104.webp",
      "/images/le lodge/rooms/la villa coliving le lodge-105.webp",
      "/images/le lodge/exterior/le lodge piscine.webp",
      "/images/le lodge/interior/la villa coliving le lodge-85.webp",
      "/images/le lodge/common areas/la villa coliving le lodge-40.webp",
      "/images/le lodge/common areas/la villa coliving le lodge-23.webp",
    ],
    photoGallery: [
      // Exterior
      {
        src: "/images/le lodge/exterior/la villa coliving le lodge-14.webp",
        alt: "Le Lodge exterior",
        category: "exterior",
      },
      {
        src: "/images/le lodge/exterior/le lodge piscine.webp",
        alt: "Le Lodge main building",
        category: "exterior",
      },
      {
        src: "/images/le lodge/exterior/la villa coliving le lodge-116.webp",
        alt: "Le Lodge estate",
        category: "exterior",
      },
      {
        src: "/images/le lodge/exterior/la villa coliving le lodge-117.webp",
        alt: "Le Lodge gardens",
        category: "exterior",
      },
      {
        src: "/images/le lodge/exterior/la villa coliving le lodge-118.webp",
        alt: "Le Lodge outdoor space",
        category: "exterior",
      },
      {
        src: "/images/le lodge/exterior/la villa coliving le lodge-119.webp",
        alt: "Le Lodge outdoor space",
        category: "exterior",
      },
      {
        src: "/images/le lodge/exterior/la villa coliving le lodge-120.webp",
        alt: "Le Lodge outdoor space",
        category: "exterior",
      },
      {
        src: "/images/le lodge/exterior/la villa coliving le lodge-13.webp",
        alt: "Le Lodge outdoor space",
        category: "exterior",
      },
      // Interior
      {
        src: "/images/le lodge/interior/la villa coliving le lodge-16.webp",
        alt: "Le Lodge living room",
        category: "interior",
      },
      {
        src: "/images/le lodge/interior/la villa coliving le lodge-85.webp",
        alt: "Le Lodge interior",
        category: "interior",
      },
      {
        src: "/images/le lodge/interior/la villa coliving le lodge-87.webp",
        alt: "Le Lodge modern design",
        category: "interior",
      },
      {
        src: "/images/le lodge/interior/la villa coliving le lodge-88.webp",
        alt: "Le Lodge modern design",
        category: "interior",
      },
      {
        src: "/images/le lodge/interior/la villa coliving le lodge-89.webp",
        alt: "Le Lodge modern design",
        category: "interior",
      },
      {
        src: "/images/le lodge/interior/la villa coliving le lodge-90.webp",
        alt: "Le Lodge modern design",
        category: "interior",
      },
      {
        src: "/images/le lodge/interior/la villa coliving le lodge-91.webp",
        alt: "Le Lodge modern design",
        category: "interior",
      },
      {
        src: "/images/le lodge/interior/la villa coliving le lodge-92.webp",
        alt: "Le Lodge modern design",
        category: "interior",
      },
      {
        src: "/images/le lodge/interior/la villa coliving le lodge-93.webp",
        alt: "Le Lodge modern design",
        category: "interior",
      },
      {
        src: "/images/le lodge/interior/la villa coliving le lodge-101.webp",
        alt: "Le Lodge modern design",
        category: "interior",
      },
      // Common Areas
      {
        src: "/images/le lodge/common areas/la villa coliving le lodge-18.webp",
        alt: "Le Loft shared space",
        category: "common",
      },
      {
        src: "/images/le lodge/common areas/la villa coliving le lodge-19.webp",
        alt: "Le Lodge kitchen",
        category: "common",
      },
      {
        src: "/images/le lodge/common areas/la villa coliving le lodge-20.webp",
        alt: "Le Lodge dining",
        category: "common",
      },
      {
        src: "/images/le lodge/common areas/la villa coliving le lodge-21.webp",
        alt: "Le Lodge lounge",
        category: "common",
      },
      {
        src: "/images/le lodge/common areas/la villa coliving le lodge-22.webp",
        alt: "Le Lodge lounge",
        category: "common",
      },
      {
        src: "/images/le lodge/common areas/la villa coliving le lodge-23.webp",
        alt: "Le Lodge lounge",
        category: "common",
      },
      {
        src: "/images/le lodge/common areas/la villa coliving le lodge-24.webp",
        alt: "Le Lodge lounge",
        category: "common",
      },
      {
        src: "/images/le lodge/common areas/la villa coliving le lodge-28.webp",
        alt: "Le Lodge lounge",
        category: "common",
      },
      {
        src: "/images/le lodge/common areas/la villa coliving le lodge-34.webp",
        alt: "Le Lodge lounge",
        category: "common",
      },
      {
        src: "/images/le lodge/common areas/la villa coliving le lodge-35.webp",
        alt: "Le Lodge lounge",
        category: "common",
      },
      {
        src: "/images/le lodge/common areas/la villa coliving le lodge-36.webp",
        alt: "Le Lodge lounge",
        category: "common",
      },
      {
        src: "/images/le lodge/common areas/la villa coliving le lodge-37.webp",
        alt: "Le Lodge lounge",
        category: "common",
      },
      {
        src: "/images/le lodge/common areas/la villa coliving le lodge-38.webp",
        alt: "Le Lodge lounge",
        category: "common",
      },
      {
        src: "/images/le lodge/common areas/la villa coliving le lodge-39.webp",
        alt: "Le Lodge lounge",
        category: "common",
      },
      {
        src: "/images/le lodge/common areas/la villa coliving le lodge-40.webp",
        alt: "Le Lodge lounge",
        category: "common",
      },
      {
        src: "/images/le lodge/common areas/la villa coliving le lodge-41.webp",
        alt: "Le Lodge lounge",
        category: "common",
      },
      {
        src: "/images/le lodge/common areas/la villa coliving le lodge-46.webp",
        alt: "Le Lodge lounge",
        category: "common",
      },
      {
        src: "/images/le lodge/common areas/la villa coliving le lodge-47.webp",
        alt: "Le Lodge lounge",
        category: "common",
      },

      // Rooms
      {
        src: "/images/le lodge/rooms/la villa coliving le lodge-49.webp",
        alt: "Le Lodge premium room",
        category: "room",
      },
      {
        src: "/images/le lodge/rooms/la villa coliving le lodge-50.webp",
        alt: "Le Lodge bedroom",
        category: "room",
      },
      {
        src: "/images/le lodge/rooms/la villa coliving le lodge-58.webp",
        alt: "Le Lodge private room",
        category: "room",
      },
      {
        src: "/images/le lodge/rooms/la villa coliving le lodge-62.webp",
        alt: "Le Lodge cozy room",
        category: "room",
      },
      {
        src: "/images/le lodge/rooms/la villa coliving le lodge-67.webp",
        alt: "Le Lodge cozy room",
        category: "room",
      },
      {
        src: "/images/le lodge/rooms/la villa coliving le lodge-68.webp",
        alt: "Le Lodge cozy room",
        category: "room",
      },
      {
        src: "/images/le lodge/rooms/la villa coliving le lodge-69.webp",
        alt: "Le Lodge cozy room",
        category: "room",
      },
      {
        src: "/images/le lodge/rooms/la villa coliving le lodge-70.webp",
        alt: "Le Lodge cozy room",
        category: "room",
      },
      {
        src: "/images/le lodge/rooms/la villa coliving le lodge-74.webp",
        alt: "Le Lodge cozy room",
        category: "room",
      },
      {
        src: "/images/le lodge/rooms/la villa coliving le lodge-77.webp",
        alt: "Le Lodge cozy room",
        category: "room",
      },
      {
        src: "/images/le lodge/rooms/la villa coliving le lodge-78.webp",
        alt: "Le Lodge cozy room",
        category: "room",
      },
      {
        src: "/images/le lodge/rooms/la villa coliving le lodge-82.webp",
        alt: "Le Lodge cozy room",
        category: "room",
      },
      {
        src: "/images/le lodge/rooms/la villa coliving le lodge-104.webp",
        alt: "Le Lodge cozy room",
        category: "room",
      },
      {
        src: "/images/le lodge/rooms/la villa coliving le lodge-105.webp",
        alt: "Le Lodge cozy room",
        category: "room",
      },
      {
        src: "/images/le lodge/rooms/la villa coliving le lodge-107.webp",
        alt: "Le Lodge cozy room",
        category: "room",
      },
      {
        src: "/images/le lodge/rooms/la villa coliving le lodge-112.webp",
        alt: "Le Lodge cozy room",
        category: "room",
      },
      // Amenities
      {
        src: "/images/le lodge/amenities/la villa coliving le lodge-122.webp",
        alt: "Le Lodge swimming pool",
        category: "amenity",
      },
      {
        src: "/images/le lodge/amenities/la villa coliving le lodge-121.webp",
        alt: "Le Lodge fitness chalet",
        category: "amenity",
      },
      {
        src: "/images/le lodge/amenities/la villa coliving le lodge-115.webp",
        alt: "Le Lodge sauna",
        category: "amenity",
      },
      {
        src: "/images/le lodge/amenities/la villa coliving le lodge-113.webp",
        alt: "Le Lodge pool house",
        category: "amenity",
      },
      {
        src: "/images/le lodge/amenities/la villa coliving le lodge-99.webp",
        alt: "Le Lodge pool house",
        category: "amenity",
      },
      {
        src: "/images/le lodge/amenities/la villa coliving le lodge-98.webp",
        alt: "Le Lodge pool house",
        category: "amenity",
      },
      {
        src: "/images/le lodge/amenities/la villa coliving le lodge-96.webp",
        alt: "Le Lodge pool house",
        category: "amenity",
      },
      {
        src: "/images/le lodge/amenities/la villa coliving le lodge-94.webp",
        alt: "Le Lodge pool house",
        category: "amenity",
      },
      {
        src: "/images/le lodge/amenities/la villa coliving le lodge-86.webp",
        alt: "Le Lodge pool house",
        category: "amenity",
      },
      {
        src: "/images/le lodge/amenities/la villa coliving le lodge-57.webp",
        alt: "Le Lodge pool house",
        category: "amenity",
      },
      {
        src: "/images/le lodge/amenities/la villa coliving le lodge-56.webp",
        alt: "Le Lodge pool house",
        category: "amenity",
      },
      {
        src: "/images/le lodge/amenities/la villa coliving le lodge-55.webp",
        alt: "Le Lodge pool house",
        category: "amenity",
      },
      {
        src: "/images/le lodge/amenities/la villa coliving le lodge-45.webp",
        alt: "Le Lodge pool house",
        category: "amenity",
      },
      {
        src: "/images/le lodge/amenities/la villa coliving le lodge-29.webp",
        alt: "Le Lodge pool house",
        category: "amenity",
      },
    ],
    capacity: isEn ? "12 residents" : "12 résidents",
    price: isEn ? PRICE_EN_NUM : PRICE_FR_NUM,
    specs: {
      size: `${HOUSE_SURFACES.lelodge.livingM2} m²`,
      plot: m2(HOUSE_SURFACES.lelodge.plotM2, L),
      dpe: "B",
    },
    features: isEn ? [
      "12×5m outdoor swimming pool (mid-April to end of September)",
      "Dedicated fitness chalet with sauna (5 seats)",
      "Pool house with full outdoor kitchen, BBQ XXL",
      "Ping pong, arcade machine, pétanque",
      "Shuffleboard & foosball",
      "Beautiful gardens & expansive outdoor spaces",
      "Parking included",
      "fiber internet up to 8 Gb/s",
      `${HOUSE_SURFACES.lelodge.atticM2} m² attic storage`,
      "DPE B energy rating",
    ] : [
      "Piscine extérieure 12×5 m (mi-avril à fin septembre)",
      "Chalet fitness dédié avec sauna (5 places)",
      "Pool house avec cuisine d'été complète, BBQ XXL",
      "Ping pong, jeu d'arcade, pétanque",
      "Jeux de palets & babyfoot",
      "Grands jardins & vastes espaces extérieurs",
      "Parking inclus",
      "Internet fibre jusqu'à 8 Gb/s",
      `Grenier de stockage ${HOUSE_SURFACES.lelodge.atticM2} m²`,
      "DPE B (performance énergétique)",
    ],
    services: isEn ? [
      "Housekeeping three times a week",
      "Weekly private yoga & fitness classes",
      "Monthly pizza party",
      "Seasonal community events",
      "WhatsApp direct support",
      "Full property, garden & pool maintenance",
      "Streaming subscriptions (Netflix, Canal+, etc.)",
      "Bed linen set & towels provided",
    ] : [
      "Ménage des communs 3 fois par semaine",
      "Cours de yoga & fitness privés hebdomadaires",
      "Pizza Party mensuelle",
      "Événements communautaires saisonniers",
      "Support WhatsApp direct",
      "Entretien complet propriété, jardin & piscine",
      "Abonnements streaming (Netflix, Canal+, etc.)",
      "Parure de linge de lit et serviettes fournie",
    ],
    rooms: [
      {
        type: isEn ? "Room with private bathroom" : "Chambre avec salle de bain privative",
        price: isEn ? `${PRICE_EN_NUM} CHF` : `${PRICE_FR_NUM} CHF`,
        priceEur: isEn ? `€${EUR_STANDARD_EN_NUM}` : `${EUR_STANDARD_FR_NUM} €`,
        description: isEn
          // (Lot L2) L'ancienne fourchette en dur était fausse : v_public_rooms donne 17-20 (ROOM_SURFACE_BY_HOUSE.lelodge).
          ? `Premium private room (${ROOM_SURFACE_BY_HOUSE.lelodge.min} to ${ROOM_SURFACE_BY_HOUSE.lelodge.max} m²) in our newest house. Modern design, private bathroom, quality mattress, and garden access. All 12 rooms have private bathrooms.`
          : `Chambre privée premium (${ROOM_SURFACE_BY_HOUSE.lelodge.min} à ${ROOM_SURFACE_BY_HOUSE.lelodge.max} m²) dans notre maison la plus récente. Design moderne, salle de bain privative, matelas de qualité et accès jardin. Les 12 chambres ont une salle de bain privative.`,
        image: "/images/le lodge/rooms/la villa coliving le lodge-78.webp",
      },
    ],
    // (Lot L2, 09/10/2026) Anciennes lignes (tram, gare, centre-ville, centre commercial) fausses ou non mesurées → la carte
    // lit houseLocation.ts (gare 10 min, Eaux-Vives 18 min porte-à-porte, Lidl, Carrefour Market, mairie, centre-ville).
    nearby: houseNearbyCard("lelodge", L),
    lifestyle: isEn ? [
      "Pool parties in summer",
      "Fitness challenges in the chalet",
      "Sauna sessions after a workout",
      "Garden BBQs & outdoor dining",
      "Pizza party nights",
      "Arcade & shuffleboard tournaments",
    ] : [
      "Pool parties en été",
      "Défis fitness dans le chalet",
      "Sessions sauna après le sport",
      "BBQ & dîners au jardin",
      "Soirées pizza party",
      "Tournois arcade & jeux de palets",
    ],
    community: isEn ? [
      "Large diverse community of 12",
      "Creative professionals",
      "Wellness enthusiasts",
      "Cross-border commuters & expats",
    ] : [
      "Grande communauté diversifiée de 12 résidents",
      "Professionnels créatifs",
      "Passionnés de bien-être",
      "Frontaliers & expatriés",
    ],
  },
};
}

export function HouseDetailPage() {
  const location = useLocation();
  // Extract house ID from path: /lavilla → "lavilla", /en/lavilla → "lavilla"
  const id = location.pathname.split('/').filter(Boolean).pop() || "";
  const { t, language } = useLanguage();

  const housesData = getHousesData(language);
  const house = id ? housesData[id] : null;

  // Dispo réelle (v_public_rooms) — remplace les champs available/badge/badgeColor
  // qui étaient figés dans getHousesData depuis la constante manuelle.
  const availability = useRoomAvailability();
  const houseAvail =
    availability.byHouse[id as HouseKey] ?? { available: 0, upcoming: 0, nextFreeDate: null, nextFreeCount: 0 };
  const isAvailable = availability.known && houseAvail.available > 0;
  const availabilityBadge = houseBadgeLabel(houseAvail, availability.known, language === "en" ? "en" : "fr");
  const badgeTone = houseBadgeTone(houseAvail, availability.known);
  // « Candidater » dès qu'il y a une chambre libre OU une libération datée
  // (une maison qui se libère dans 3 semaines n'est pas une liste d'attente) ;
  // dispo inconnue → CTA de candidature aussi, jamais d'impasse.
  const canApplyNow = !availability.known || isAvailable || !!houseAvail.nextFreeDate;

  // Same guarded gtag pattern as the blog CTAs / candidature form: measure which
  // CTA position converts (GA4 cta_click), never block the UI on analytics.
  const trackCta = (position: string) => {
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "cta_click", {
        cta_position: position, cta_target: "/candidature", house: id, language,
      });
    } catch { /* noop */ }
  };

  // (Lot 3) Chambres réelles de la maison + visionneuse photos (patterns LP).
  const houseRooms = useHouseRooms(id as HouseKey);
  const uiLang = language === "en" ? "en" as const : "fr" as const;
  // (Lot A — A4/Q10) Pastille hero IDENTIFIÉE quand une seule chambre est candidate :
  // « Chambre 6 · 23 m² · SDB privative · libre maintenant ». Sinon libellé maison.
  // Données de l'embed chambres (prérendu = premier rendu client) : pas de mismatch.
  const heroBadge = houseRooms.known ? roomHeroBadge(houseRooms.rooms, uiLang) : null;
  const heroBadgeLabel = heroBadge?.label ?? availabilityBadge;
  const heroBadgeTone = heroBadge?.tone ?? badgeTone;
  const [roomViewer, setRoomViewer] = useState<{ key: string; roomNumber: number; index: number } | null>(null);
  const openRoomViewer = (room: PublicRoom, photoIndex: number) => {
    setRoomViewer({ key: `${id}:${room.room_number}`, roomNumber: room.room_number, index: photoIndex });
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "photo_lightbox_open", {
        room_id: `chambre-${room.room_number}`, property_interest: id, photo_index: photoIndex,
      });
    } catch { /* noop */ }
  };
  const trackRoomCta = (room: PublicRoom) => {
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "cta_click", {
        cta_position: "room_card", cta_target: "/candidature", house: id,
        room_id: `chambre-${room.room_number}`, language,
      });
    } catch { /* noop */ }
  };

  if (!house) {
    return (
      <main className="pt-32 pb-20 bg-white">
        <div className="container-custom text-center">
          <h1 className="text-4xl mb-4 text-[#1C1917]">House not found</h1>
          <LocalizedLink
            to="/nos-maisons"
            className="text-[#D4A574] hover:underline font-bold"
          >
            View all houses
          </LocalizedLink>
        </div>
      </main>
    );
  }

  return (
    <main className="relative">
      <SEO
        title={(() => {
          // Titles compacts (≤ 40c) — le suffix " | La Villa Coliving" (~21c) est ajouté par <SEO>.
          // Cibles SEO : /lelodge → "colocation annemasse" (880/mois), /lavilla et /leloft → brand + ville.
          const titles: Record<string, { en: string; fr: string }> = {
            // (Lot 7, 04/09/2026) Variante B : nom de maison en tête, sans prix, ≤ 45 c. pour garder la marque.
            lavilla: { en: "La Villa: coliving in Ville-la-Grand", fr: "La Villa : coliving à Ville-la-Grand" },
            leloft:  { en: "Le Loft: 7 rooms in Ambilly, tram 17",  fr: "Le Loft : 7 chambres à Ambilly, tram 17" },
            lelodge: { en: "Le Lodge: 12 rooms in Annemasse",      fr: "Le Lodge : 12 chambres à Annemasse" },
          };
          return titles[id]?.[language === "en" ? "en" : "fr"]
            ?? `${house.name} — ${house.location}`;
        })()}
        description={(() => {
          // Metas ≤ 155c, factuelles, chiffrées. Pas de "${house.description}" qui dépasse 200c.
          const descs: Record<string, { en: string; fr: string }> = {
            // (Lot L2, 09/10/2026, D1) Destination nommée + mode (Genève-Eaux-Vives, Léman Express), jamais « du centre » seul ; ≤ 155 c.
            lavilla: {
              en: `La Villa: 10 rooms in Ville-la-Grand. Heated pool, sauna, gym. All-inclusive from ${PRICE_SHARED_CHF_EN}/month. ${STATS.genevaCenterMinutes} min from Geneva Eaux-Vives by Léman Express.`,
              fr: `La Villa : 10 chambres à Ville-la-Grand. Piscine chauffée, sauna, gym. Tout inclus dès ${PRICE_SHARED_CHF_FR}/mois. ${STATS.genevaCenterMinutes} min de Genève-Eaux-Vives en Léman Express.`,
            },
            leloft: {
              en: `Le Loft: 7 premium rooms in Ambilly. Indoor pool, urban design, Tram 17 to Geneva. All-inclusive: ${PRICE_CHF_EN}/month.`,
              fr: `Le Loft : 7 chambres premium à Ambilly. Piscine intérieure, design urbain, Tram 17 vers Genève. Tout inclus : ${PRICE_CHF_FR}/mois.`,
            },
            lelodge: {
              en: `Le Lodge: 12 rooms in Annemasse, opened 2026. Pool, gym, sauna, ${TRANSIT.byHouse.lelodge.stationWalkMin}-min walk to the Léman Express. All-inclusive: ${PRICE_CHF_EN}/month.`,
              fr: `Le Lodge : 12 chambres premium à Annemasse, ouvertes en 2026. Piscine, gym, sauna, gare Léman Express à ${TRANSIT.byHouse.lelodge.stationWalkMin} min à pied. Tout inclus : ${PRICE_CHF_FR}/mois.`,
            },
          };
          return descs[id]?.[language === "en" ? "en" : "fr"]
            ?? `${house.description} Tout inclus : ${house.price} CHF/mois.`;
        })()}
        url={`https://www.lavillacoliving.com/${id}`}
        image={`https://www.lavillacoliving.com${house.image}`}
      />
      {/* LocalBusiness Schema.org */}
      {/* (S2, 07/09/2026) JSON-LD via Helmet → dans <head> uniquement (les scripts inline du corps étaient recopiés en tête par inject-prerendered : doublons). */}
      <Helmet>
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LodgingBusiness",
        // (Lot S1) @id propre + rattachement à l'entité mère : les 3 fiches maison ne flottent plus.
        "@id": `https://www.lavillacoliving.com/${id}#lodging`,
        "parentOrganization": { "@id": ORG_ID },
        "name": `La Villa Coliving — ${house.name}`,
        "description": house.description,
        "image": `https://www.lavillacoliving.com${house.image}`,
        "url": `https://www.lavillacoliving.com/${id}`,
        "telephone": "+33664315134",
        "email": "contact@lavillacoliving.com",
        // `streetAddress` contenait le nom de la commune, dupliqué depuis
        // `addressLocality` — les 3 fiches maison annonçaient donc une adresse
        // sans rue. Les vraies rues vivent dans HOUSES (structuredData.ts),
        // source unique déjà utilisée par le schema de l'accueil.
        "address": {
          "@type": "PostalAddress",
          "streetAddress": HOUSES.find(h => h.slug === id)?.streetAddress ?? "",
          "addressLocality": HOUSES.find(h => h.slug === id)?.addressLocality ?? "",
          "postalCode": HOUSES.find(h => h.slug === id)?.postalCode ?? "74100",
          "addressRegion": "Haute-Savoie",
          "addressCountry": "FR"
        },
        // Geo rooftop-exacte depuis HOUSES (source unique, BAN 15/08/2026) — les
        // valeurs codées en dur ici divergeaient de structuredData.ts.
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": HOUSES.find(h => h.slug === id)?.geo.lat,
          "longitude": HOUSES.find(h => h.slug === id)?.geo.lng
        },
        // (Lot S1) priceRange localisé (était en français sur les pages EN).
        "priceRange": language === "en"
          ? (id === "lavilla" ? `CHF ${PRICE_SHARED_EN_NUM}–${PRICE_EN_NUM}/month` : `CHF ${PRICE_EN_NUM}/month`)
          : (id === "lavilla" ? `${PRICE_SHARED_FR_NUM}–${PRICE_FR_NUM} CHF/mois` : `${PRICE_FR_NUM} CHF/mois`),
        "currenciesAccepted": "EUR",
        "amenityFeature": [
          { "@type": "LocationFeatureSpecification", "name": "Swimming Pool", "value": true },
          { "@type": "LocationFeatureSpecification", "name": "Sauna", "value": true },
          { "@type": "LocationFeatureSpecification", "name": "Gym", "value": true },
          { "@type": "LocationFeatureSpecification", "name": "WiFi", "value": true },
          { "@type": "LocationFeatureSpecification", "name": "Parking", "value": true }
        ],
        "numberOfRooms": ROOMS_BY_HOUSE[id as keyof typeof ROOMS_BY_HOUSE] ?? STATS.totalRooms,
        // (07/09/2026) profils de l'organisation + fiche annuaire propre à la maison (HOUSES[].sameAs).
        "sameAs": [...LAVILLA_SAME_AS, ...(HOUSES.find(h => h.slug === id)?.sameAs ?? [])]
      })}</script>
      {/* BreadcrumbList Schema.org */}
      <script type="application/ld+json">{JSON.stringify(buildBreadcrumbSchema([
        { name: language === "en" ? "Home" : "Accueil", url: homeUrl(language) },
        { name: language === "en" ? "Our houses" : "Nos maisons", url: `https://www.lavillacoliving.com${language === "en" ? "/en" : ""}/nos-maisons` },
        { name: id === "lavilla" ? "La Villa" : id === "leloft" ? "Le Loft" : "Le Lodge", url: `https://www.lavillacoliving.com${language === "en" ? "/en" : ""}/${id}` },
      ]))}</script>
      </Helmet>
      {/* Hero Gallery */}
      <section className="relative pt-16">
        <Carousel className="w-full">
          <CarouselContent>
            {[house.image, ...house.gallery].map((img, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[60vh] md:h-[70vh]">
                  <img
                    src={img}
                    alt={`${house.name} coliving ${house.location} — ${language === "en" ? "premium colocation near Geneva" : "colocation premium près de Genève"} (${index + 1})`}
                    className="w-full h-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                    width={1920}
                    height={1080}
                    {...(index === 0 ? { fetchPriority: "high" as const } : {})}
                    {...responsiveImage(img, "100vw")}
                  />
                  <Scrim />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 bg-white/90 border-2 border-[#E7E5E4] text-[#1C1917] hover:bg-white shadow-sharp" />
          <CarouselNext className="right-4 bg-white/90 border-2 border-[#E7E5E4] text-[#1C1917] hover:bg-white shadow-sharp" />
        </Carousel>

        {/* House Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 pb-8 pt-20">
          <div className="container-custom">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {heroBadgeLabel && heroBadgeTone && (
                <Badge className={`font-extrabold backdrop-blur-sm ${BADGE_CHIP_CLASS[heroBadgeTone]}`}>
                  {heroBadgeLabel}
                </Badge>
              )}
              {/* DPE déplacé hors du hero (décision 2026-06-11) : la mention reste
                  obligatoire sur la page → affichée dans la section « À propos ». */}
            </div>
            <h1
              className="text-4xl md:text-7xl mb-4 text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.55)]"
              style={{ fontFamily: '"DM Serif Display", serif' }}
            >
              {(() => {
                // SEO H1 par maison : capture le keyword principal de la page
                // (le `house.name` seul = trop maigre pour Google, audit P0-1).
                const h1: Record<string, { en: string; fr: string }> = {
                  lavilla: {
                    en: "La Villa — Coliving 10 rooms in Ville-la-Grand",
                    fr: "La Villa : la colocation à Ville-la-Grand, version coliving premium",
                  },
                  leloft: {
                    en: "Le Loft — Coliving 7 rooms in Ambilly",
                    fr: "Le Loft : la colocation à Ambilly, version coliving premium",
                  },
                  lelodge: {
                    en: "Le Lodge — Coliving 12 rooms in Annemasse",
                    fr: "Le Lodge — Coliving 12 chambres à Annemasse",
                  },
                };
                return h1[id]?.[language === "en" ? "en" : "fr"] ?? house.name;
              })()}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90 font-medium">
              <span className="flex items-center gap-2">
                <MapPin size={18} className="text-[#D4A574]" />
                {house.location}
              </span>
              <span className="flex items-center gap-2">
                <Users size={18} className="text-[#D4A574]" />
                {house.capacity}
              </span>
              <span className="flex items-center gap-2">
                <Maximize size={18} className="text-white/80" />
                {house.specs.size}
              </span>
            </div>
            {/* Above-fold CTA — GA4 showed candidatures are won on house pages, yet the
                only apply CTA was at the very bottom of this 2000-line template. */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <LocalizedLink
                to={`/candidature?property_interest=${id}`}
                onClick={() => trackCta("house_hero")}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#D4A574] text-[#1C1917] font-bold rounded-full hover:bg-[#E0BB8A] transition-colors shadow-sharp"
              >
                {t.houseDetail.apply}
                <ArrowRight className="w-5 h-5" />
              </LocalizedLink>
              <span className="text-sm font-semibold text-[#1C1917] bg-white/85 backdrop-blur px-4 py-2 rounded-full">
                {/* La Villa : 4 chambres sur 10 à salle d'eau partagée → plancher 1 370 (dérivé, stats.ts) */}
                {id === "lavilla"
                  ? (language === "en"
                      ? `All-inclusive: from ${PRICE_SHARED_CHF_EN}/month — no application fee`
                      : `Tout inclus : dès ${PRICE_SHARED_CHF_FR}/mois — 0 frais de dossier`)
                  : (language === "en"
                      ? `All-inclusive: ${PRICE_CHF_EN}/month — no application fee`
                      : `Tout inclus : ${PRICE_CHF_FR}/mois — 0 frais de dossier`)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="section-padding py-14 md:py-20 relative bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2
                className="text-3xl md:text-4xl mb-6 text-[#1C1917]"
                style={{ fontFamily: '"DM Serif Display", serif' }}
              >
                {language === "en"
                  ? `About ${house.name}`
                  : `À propos de ${house.name}`}
              </h2>
              <p className="text-lg text-[#57534E] leading-relaxed mb-8 font-medium">
                {house.longDescription}
              </p>
              <p className="text-sm text-[#78716C] mb-8 flex items-center gap-2">
                <Zap size={14} className="text-[#78716C]" />
                {language === "en"
                  ? `Energy performance (DPE): ${house.specs.dpe} · ${house.specs.size}`
                  : `Diagnostic de performance énergétique (DPE) : ${house.specs.dpe} · ${house.specs.size}`}
              </p>

              {/* (Lot S1) Fiche de faits canonique — CTA avec property_interest (garde house-pages-check) */}
              <EntityFacts page={id} houseSlug={id as HouseKey}>
                {language === "en"
                  ? `This page is about ${house.name}; the three houses share the same all-inclusive package.`
                  : `Cette page décrit ${house.name} ; les trois maisons partagent le même tout-inclus.`}
              </EntityFacts>

              {/* Features */}
              <h3 className="text-2xl font-black mb-6 text-[#1C1917]">
                {t.houseDetail.features}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {house.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check
                      className="text-[#D4A574] mt-1 flex-shrink-0"
                      size={18}
                    />
                    <span className="text-[#57534E] font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Services */}
              <h3 className="text-2xl font-black mb-6 text-[#1C1917]">
                {t.houseDetail.services}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {house.services.map((service, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check
                      className="text-[#D4A574] mt-1 flex-shrink-0"
                      size={18}
                    />
                    <span className="text-[#57534E] font-medium">
                      {service}
                    </span>
                  </div>
                ))}
              </div>

              {/* Community */}
              <h3 className="text-2xl font-black mb-6 text-[#1C1917]">
                {t.houseDetail.community}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {house.community.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Star
                      className="text-[#D4A574] mt-1 flex-shrink-0"
                      size={18}
                    />
                    <span className="text-[#57534E] font-medium">{item}</span>
                  </div>
                ))}
              </div>

              {/* Lifestyle */}
              <h3 className="text-2xl font-black mb-6 text-[#1C1917]">
                {t.houseDetail.lifestyle}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {house.lifestyle.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Sun
                      className="text-[#78716C] mt-1 flex-shrink-0"
                      size={18}
                    />
                    <span className="text-[#57534E] font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Pricing Card */}
                <div className="card-ultra bg-white rounded-2xl border border-[#E7E5E4] shadow-sm p-8">
                  {/* La Villa : plancher 1 370 (4 ch. sur 10 à salle d'eau partagée). Loft/Lodge : prix unique 1 430. */}
                  <p className="text-sm text-[#78716C] mb-2 font-bold">
                    {id === "lavilla"
                      ? (language === "en" ? "From" : "À partir de")
                      : (language === "en" ? "Monthly rent" : "Loyer mensuel")}
                  </p>
                  <p className="text-4xl font-black text-[#D4A574] mb-2">
                    {id === "lavilla"
                      ? (language === "en" ? PRICE_SHARED_EN_NUM : PRICE_SHARED_FR_NUM)
                      : house.price}{" "}
                    CHF{" "}
                    <span className="text-xl font-light text-[#78716C]">
                      {id === "lavilla"
                        ? (language === "en" ? `(€${EUR_SHARED_EN_NUM})` : `(${EUR_SHARED_FR_NUM} €)`)
                        : (language === "en" ? `(€${EUR_STANDARD_EN_NUM})` : `(${EUR_STANDARD_FR_NUM} €)`)}
                    </span>
                  </p>
                  <p className="text-[#78716C] mb-4 font-medium">
                    {t.houseDetail.perMonth}
                  </p>

                  {/* 0 € move-in fees badge */}
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1C1917] text-white text-sm font-semibold rounded-lg">
                      {language === "en" ? "€0 move-in fees" : "0 € de frais d'entrée"}
                    </span>
                  </div>

                  {/* Availability badge */}
                  {availabilityBadge && badgeTone && (
                    <div className="mb-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg ${BADGE_PANEL_CLASS[badgeTone]}`}>
                        <span className={`w-2 h-2 rounded-full ${BADGE_DOT_CLASS[badgeTone]} ${isAvailable ? "animate-pulse" : ""}`} />
                        {availabilityBadge}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <LocalizedLink
                      to={`/candidature?property_interest=${id}`}
                      onClick={() => trackCta("house_sidebar")}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1C1917] text-white font-semibold rounded-xl hover:bg-[#D4A574] transition-colors"
                    >
                      {canApplyNow
                        ? t.houseDetail.apply
                        : language === "en" ? "Join waitlist" : "Liste d'attente"}
                      <ArrowRight size={18} />
                    </LocalizedLink>
                    <LocalizedLink
                      to="/tarifs"
                      className="w-full text-center text-sm text-[#78716C] hover:text-[#1C1917] hover:underline transition-colors mt-1"
                    >
                      {t.houseDetail.checkRates}
                    </LocalizedLink>
                    <a
                      href="https://wa.me/33664315134"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center text-sm text-[#78716C] hover:text-[#D4A574] transition-colors"
                    >
                      {language === "en"
                        ? "Or ask us on WhatsApp →"
                        : "Ou pose-nous une question sur WhatsApp →"}
                    </a>
                  </div>
                </div>

                {/* Quick Info Card */}
                <div className="card-ultra bg-white rounded-2xl border border-[#E7E5E4] shadow-sm p-6">
                  <h4 className="font-bold text-[#1C1917] mb-4">
                    {language === "en" ? "Quick Info" : "Infos Rapides"}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[#57534E]">
                      <Clock size={18} className="text-[#D4A574]" />
                      {/* (Lot L2, 09/10/2026, D1) Libellé de marque unique, toujours qualifié : STATS_DISPLAY.distance. */}
                      <span className="text-sm">
                        {STATS_DISPLAY[language === "en" ? "en" : "fr"].distance}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[#57534E]">
                      <Wifi size={18} className="text-[#D4A574]" />
                      <span className="text-sm">{language === "en" ? "Fiber up to 8 Gb/s" : "Fibre jusqu'à 8 Gb/s"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#57534E]">
                      <Car size={18} className="text-[#78716C]" />
                      <span className="text-sm">{language === "en" ? "Parking Available" : "Parking disponible"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#57534E]">
                      <Coffee size={18} className="text-[#D4A574]" />
                      <span className="text-sm">{language === "en" ? "All-inclusive" : "Tout inclus"}</span>
                    </div>
                  </div>
                </div>

                {/* Nearby Card */}
                <div className="card-ultra bg-white rounded-2xl border border-[#E7E5E4] shadow-sm p-6">
                  <h4 className="font-bold text-[#1C1917] mb-4">
                    {t.houseDetail.nearby}
                  </h4>
                  <div className="space-y-3">
                    {house.nearby.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 text-[#57534E]"
                      >
                        <TreePine
                          size={18}
                          className="text-[#D4A574] mt-0.5 flex-shrink-0"
                        />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms — (Lot 3) cartes RÉELLES depuis v_public_rooms (source unique de
          dispo et de prix, design arbitré rapport §3.B). Les descriptions de
          types historiques passent en intro ; chaque chambre candidate porte
          photo, m², étage, SDB, prix CHF (€), badge dispo daté et un CTA à deux
          params ; les occupées sont listées en compact (Lot A — Q8, 02/09/2026).
          (Lot A — A5, Q1) Section placée AVANT Localisation sur les 3 maisons :
          90 % des visiteurs atteignent 25 % de la page, la section transactionnelle
          doit y être. Sans données (vue vide, vieux HTML prérendu) : repli sur les
          cartes de types — jamais de section vide. Interdit : cloner le modèle
          fichier-statique de l'ancienne LP (supprimée le 03/09, Lot 3 SEO funnel). */}
      <section className="section-padding py-14 md:py-20 relative bg-[#FAF9F6]">
        <div className="container-custom">
          <h2
            className="text-3xl md:text-4xl mb-6 text-[#1C1917]"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            {t.houseDetail.rooms}
          </h2>

          {/* Intro : les types de chambres (ex-cartes), en texte. */}
          <div className="mb-10 space-y-1.5 max-w-3xl">
            {house.rooms.map((roomType, index) => (
              <p key={index} className="text-[#78716C]">
                <span className="font-semibold text-[#1C1917]">{roomType.type}</span>
                {" — "}
                {roomType.description}
              </p>
            ))}
          </div>

          {houseRooms.known ? (() => {
            // (Lot A — Q8, décision Jérôme 02/09) Option 2 : les chambres CANDIDATES (libres
            // maintenant, puis libérations datées) en carte complète avec photo, prix et CTA ;
            // les occupées sans date en cartes compactes SANS photo ni CTA, et un seul CTA
            // « Rejoindre la liste d'attente » sous la liste. Pourquoi : sans photos attribuées
            // par chambre (mapping reporté aux plans des maisons), 7 cartes portaient la même
            // photo de type et 6 « Complet » — le motif du rollback du 02/09 14:06.
            const { candidates, occupied } = splitRooms(houseRooms.rooms);
            return (
              <>
                {candidates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {candidates.map((room) => (
                      // (Lot 3 SEO funnel) Carte partagée avec /chambres-disponibles — JSX extrait
                      // à l'identique. Repli déterministe sur la photo de TYPE (pureté d'hydratation :
                      // room_number est stable, jamais d'aléatoire au rendu).
                      <RoomCard
                        key={room.room_number}
                        house={id as HouseKey}
                        houseName={house.name}
                        room={room}
                        fallbackImage={house.rooms[(room.room_number - 1) % house.rooms.length].image}
                        onOpenPhotos={openRoomViewer}
                        onCtaClick={trackRoomCta}
                      />
                    ))}
                  </div>
                ) : null}

                {/* Bloc pipeline (Option 2, GO Jérôme 03/09) : la page vend la PROCHAINE
                    libération, pas l'occupation du jour. */}
                <RoomPipeline
                  house={id as HouseKey}
                  houseName={house.name}
                  en={language === "en"}
                  hasCandidates={candidates.length > 0}
                  onApplyClick={(month) => {
                    try {
                      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "cta_click", {
                        cta_position: "pipeline_month", cta_target: "/candidature", house: id, month, language,
                      });
                    } catch { /* noop */ }
                  }}
                />

                {occupied.length > 0 && (
                  <>
                    <h3 className="text-lg font-black text-[#1C1917] mb-4">
                      {language === "en"
                        ? (candidates.length > 0 ? `The other ${occupied.length} rooms at ${house.name}` : `The ${occupied.length} rooms at ${house.name}`)
                        : (candidates.length > 0 ? `Les ${occupied.length} autres chambres du ${house.name.replace(/^Le /, "")}` : `Les ${occupied.length} chambres du ${house.name.replace(/^Le /, "")}`)}
                    </h3>
                    {/* Panneau structuré (retour Jérôme 03/09 : les lignes « flottaient ») : cadre,
                        lignes séparées, en-tête de colonnes à partir de md, CTA rattaché au pied. */}
                    <div className="bg-white border border-[#E7E5E4] rounded-2xl overflow-hidden shadow-sm">
                      <div className="hidden md:grid md:grid-cols-[1.4fr_0.7fr_0.9fr_1.3fr] gap-4 px-5 py-3 bg-[#FAF9F6] border-b border-[#E7E5E4] text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                        <span>{language === "en" ? "Room" : "Chambre"}</span>
                        <span>{language === "en" ? "Size" : "Surface"}</span>
                        <span>{language === "en" ? "Floor" : "Étage"}</span>
                        <span>{language === "en" ? "Bathroom" : "Salle de bain"}</span>
                      </div>
                      <ul className="divide-y divide-[#E7E5E4]">
                        {(() => {
                          // (28/09/2026, demande Jérôme) Miniature par chambre — SEULEMENT si chaque
                          // chambre de la liste a sa propre photo (au Lodge : sa photo principale,
                          // toutes différentes, cf. LODGE_HERO_ORDER). Jamais la photo de TYPE
                          // répétée : c'est le motif du rollback du 02/09 rappelé plus haut.
                          const thumbs = occupied.map((room) => roomGallery(id, room.room_number)?.[0]);
                          const showThumbs = thumbs.every(Boolean);
                          return occupied.map((room, i) => {
                            const surface = roomSurface(room);
                            const floor = floorLabel(room, uiLang);
                            const bath = bathroomLabel(room, uiLang);
                            const specs = roomSpecs(room, uiLang);
                            const thumb = showThumbs ? thumbs[i] : undefined;
                            return (
                              <li
                                key={room.room_number}
                                className="px-5 py-3.5 flex items-center justify-between gap-4 md:grid md:grid-cols-[1.4fr_0.7fr_0.9fr_1.3fr]"
                              >
                                <div className="min-w-0 flex items-center gap-4">
                                  {thumb && (
                                    <img
                                      src={thumb.src}
                                      alt={thumb.alt[uiLang]}
                                      width={thumb.w}
                                      height={thumb.h}
                                      loading="lazy"
                                      decoding="async"
                                      className="w-16 h-12 md:w-20 md:h-14 shrink-0 rounded-lg object-cover bg-[#F5F2ED]"
                                      {...responsiveImage(thumb.src, "80px")}
                                    />
                                  )}
                                  <div className="min-w-0">
                                    <p className="font-black text-[#1C1917]">
                                      {language === "en" ? `Room ${room.room_number}` : `Chambre ${room.room_number}`}
                                    </p>
                                    {specs && <p className="text-sm text-[#78716C] md:hidden">{specs}</p>}
                                    {language !== "en" && room.location_detail && (
                                      <p className="text-xs text-[#78716C]">{room.location_detail.trim()}</p>
                                    )}
                                  </div>
                                </div>
                                <span className="hidden md:block text-sm text-[#57534E]">{surface !== null ? `${surface} m²` : "—"}</span>
                                <span className="hidden md:block text-sm text-[#57534E]">{floor ?? "—"}</span>
                                <span className="hidden md:block text-sm text-[#57534E]">{bath ?? "—"}</span>
                              </li>
                            );
                          });
                        })()}
                      </ul>
                    </div>
                  </>
                )}
              </>
            );
          })() : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {house.rooms.map((room, index) => (
                <div key={index} className="card-ultra bg-white rounded-2xl border border-[#E7E5E4] shadow-sm overflow-hidden group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={room.image}
                      alt={`${room.type} — ${language === "en" ? "furnished room in" : "chambre meublée à"} ${house.name} coliving ${house.location}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      width={800}
                      height={600}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <BedDouble className="text-[#D4A574]" size={28} />
                      <h3 className="text-xl font-black text-[#1C1917]">
                        {room.type}
                      </h3>
                    </div>
                    <p className="text-[#78716C] mb-6 font-medium">
                      {room.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-black text-[#D4A574]">
                        {room.price}
                        {"priceEur" in room && (
                          <span className="text-base font-light text-[#78716C]"> ({(room as { priceEur: string }).priceEur})</span>
                        )}
                      </p>
                      <span className="text-[#78716C] font-medium">
                        {t.houseDetail.perMonth}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* (Lot 3) État chambres embarqué au prérendu — instance unique par page. */}
      <RoomsEmbed house={id as HouseKey} />

      {/* (Lot 3) Visionneuse photos chambre — lazy, montée seulement à l'ouverture. */}
      {roomViewer && roomGallery(id, roomViewer.roomNumber) && (
        <Suspense fallback={null}>
          <PhotoLightbox
            photos={roomGallery(id, roomViewer.roomNumber)!}
            index={roomViewer.index}
            onIndexChange={(i) => setRoomViewer((v) => (v ? { ...v, index: i } : v))}
            onClose={() => setRoomViewer(null)}
            en={language === "en"}
            title={language === "en" ? `Room ${roomViewer.roomNumber}` : `Chambre ${roomViewer.roomNumber}`}
          />
        </Suspense>
      )}

      {/* Location — custom section per house (audit P0-1: capture local SEO intent + Léman Express signal) */}
      {/* (Lot L2 « Emplacement et transport », 09/10/2026) Plus aucun littéral : quartier A.2 + frontière D6 (houseNeighbourhood /
          houseBorder), adresse = HOUSES (houseAddressLine), trajets = <HouseCommuteTable/> (TRANSIT), commerces §1.3 (houseNearby).
          La section porte data-house-location-version (HOUSE_LOCATION_VERSION) pour les gardes. */}
      {(() => {
        const slug = id as HouseSlug;
        const L = language === "en" ? "en" as const : "fr" as const;
        if (!ENTITY_HOUSES.some((h) => h.slug === slug)) return null;
        const data = {
          intro: houseNeighbourhood(slug, L),
          border: houseBorder(slug, L),
          address: houseAddressLine(slug),
          nearby: houseNearby(slug, L),
        };
        return (
          <section className="section-padding py-14 md:py-20 relative bg-white" data-house-location-version={HOUSE_LOCATION_VERSION}>
            <div className="container-custom max-w-5xl">
              <h2
                className="text-3xl md:text-4xl mb-6 text-[#1C1917]"
                style={{ fontFamily: '"DM Serif Display", serif' }}
              >
                {language === "en"
                  ? `Location: ${house.name} in ${house.location.split(',')[0]}`
                  : `Localisation : ${house.name} à ${house.location.split(',')[0]}`}
              </h2>
              {/* Phrase de quartier (A.2) puis, quand elle existe, la seule formulation de la frontière (D6) — un nœud texte par phrase. */}
              <p className="text-lg text-[#57534E] leading-relaxed mb-4 font-medium">{data.intro}</p>
              {data.border ? (
                <p className="text-[#57534E] leading-relaxed mb-4 font-medium">{data.border}</p>
              ) : null}
              {/* Phrase citable produit (extraction IA / AI Overviews) — 1 par page, motif commun aux money pages.
                  (Lot L2, D1) Le « 20 min » de marque s'écrit toujours via STATS_DISPLAY.distance. */}
              <p className="text-sm text-[#78716C] leading-relaxed mb-8">
                {language === "en"
                  ? `${house.name} is one of the 3 La Villa Coliving houses: all-inclusive furnished rooms ${id === "lavilla" ? `from ${PRICE_SHARED_CHF_EN}` : `at ${PRICE_CHF_EN}`}/month — pool, sauna, gym and cleaning included, ${STATS_DISPLAY.en.distance}, no application fee.`
                  : `${house.name} est l'une des 3 maisons La Villa Coliving : chambres meublées tout inclus ${id === "lavilla" ? `dès ${PRICE_SHARED_CHF_FR}` : `à ${PRICE_CHF_FR}`}/mois — piscine, sauna, salle de sport et ménage compris, à ${STATS_DISPLAY.fr.distance}, sans frais de dossier.`}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-black mb-4 text-[#1C1917] flex items-center gap-2">
                    <MapPin size={20} className="text-[#D4A574]" />
                    {language === "en" ? "Address" : "Adresse"}
                  </h3>
                  <p className="text-[#57534E] font-medium mb-6">{data.address}</p>

                  <h3 className="text-xl font-black mb-4 text-[#1C1917] flex items-center gap-2">
                    <Clock size={20} className="text-[#D4A574]" />
                    {language === "en" ? "Transport & travel times" : "Transport & temps de trajet"}
                  </h3>
                  {/* (Lot L2) Tableau commun à pied / Léman Express / tram 17 / vélo + note de méthode + « Calculer mon trajet ». */}
                  <HouseCommuteTable slug={slug} lang={L} />
                  {/* (Lot 4 SEO funnel, 04/09/2026) « Voir aussi » sur les 3 maisons : lien vers la home (URL championne
                      sur « coliving genève ») en tête, ancre variante marque (Q10c : 8 exactes au total, pas plus),
                      puis les pages Annemasse pour Lodge et Loft. */}
                  <p className="mt-5 text-sm text-[#57534E]">
                    {language === "en" ? "See also: " : "Voir aussi : "}
                    <LocalizedLink to="/" className="underline underline-offset-4 hover:text-[#1C1917]">
                      {language === "en" ? "our coliving near Geneva" : "notre coliving près de Genève"}
                    </LocalizedLink>
                    {" · "}
                    {/* (Lot 6 SEO funnel) Page money « chambre à louer près de Genève ». */}
                    <LocalizedLink to="/chambre-a-louer-geneve" className="underline underline-offset-4 hover:text-[#1C1917]">
                      {language === "en" ? "our furnished rooms, French side" : "nos chambres meublées, côté France"}
                    </LocalizedLink>
                    {(id === "lelodge" || id === "leloft") && (
                    <>
                      {" · "}
                      <LocalizedLink to="/annemasse-colocation" className="underline underline-offset-4 hover:text-[#1C1917]">
                        {language === "en" ? "living in Annemasse with Le Lodge" : "vivre à Annemasse avec Le Lodge"}
                      </LocalizedLink>
                      {" · "}
                      <LocalizedLink to="/chambre-a-louer-annemasse" className="underline underline-offset-4 hover:text-[#1C1917]">
                        {language === "en" ? "the Lodge's rooms" : "les chambres du Lodge"}
                      </LocalizedLink>
                    </>
                    )}
                    {/* (Lot 5 SEO funnel, 04/09/2026) Les 3 maisons lient la page money colocation Genève. */}
                    {" · "}
                    <LocalizedLink to={colocGeneveHref(language)} className="underline underline-offset-4 hover:text-[#1C1917]">
                      {language === "en" ? "shared housing in Geneva" : "colocation à Genève"}
                    </LocalizedLink>
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-black mb-4 text-[#1C1917] flex items-center gap-2">
                    <Coffee size={20} className="text-[#D4A574]" />
                    {language === "en" ? "Nearby shops & services" : "Commerces & services à proximité"}
                  </h3>
                  <ul className="space-y-2">
                    {data.nearby.map((line, i) => (
                      <li key={i} className="flex items-start gap-2 text-[#57534E] font-medium">
                        <Check className="text-[#D4A574] mt-1 flex-shrink-0" size={16} />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Plan Google Maps chargé au clic (demande Jérôme 02/09, Lot A) — coordonnées
                  rooftop de HOUSES, même source que le JSON-LD LodgingBusiness ci-dessus. */}
              {(() => {
                const geo = HOUSES.find((h) => h.slug === id);
                return geo ? (
                  <HouseMap
                    name={house.name}
                    address={data.address}
                    lat={geo.geo.lat}
                    lng={geo.geo.lng}
                    en={language === "en"}
                  />
                ) : null;
              })()}
            </div>
          </section>
        );
      })()}

      {/* Photo Gallery */}
      <HouseGallery images={house.photoGallery} houseName={house.name} />

      {/* FAQ — schema FAQPage rich-snippet (audit P0-1, G4) */}
      {(() => {
        type QA = { q: string; a: string };
        // (Lot L2 « Emplacement et transport », 09/10/2026) Réponses d'emplacement lues dans la source unique (TRANSIT via
        // houseLocation.ts, surfaces HOUSE_SURFACES / ROOM_SURFACE_BY_HOUSE) : plus aucune promesse automobile, de ligne de bus
        // numérotée ni de distance de frontière non mesurée (D1, D6, D7). Le JSON-LD FAQPage est construit depuis ces mêmes paires.
        const TB = TRANSIT.byHouse;
        const borderFr = (s: HouseSlug): string => houseBorder(s, "fr") ?? "";
        const borderEn = (s: HouseSlug): string => houseBorder(s, "en") ?? "";
        const FAQ_DATA: Record<string, { fr: QA[]; en: QA[] }> = {
          lavilla: {
            fr: [
              { q: "Quel est le loyer mensuel à La Villa et que comprend-il ?", a: `Les chambres de La Villa sont à ${PRICE_CHF_FR} par mois avec salle de bain privative, et à ${PRICE_SHARED_CHF_FR} pour les 4 chambres qui partagent une salle d'eau entre 2 chambres (son entretien par notre équipe de ménage est inclus). Tout inclus dans les deux cas : charges (eau, électricité, chauffage), internet fibre jusqu'à 8 Gb/s, ménage 3 fois par semaine des espaces communs, abonnements streaming, entretien piscine et jardin, cours de yoga / fitness privés, parure de linge fournie. Aucun supplément.` },
              { q: "Comment se rendre à Genève depuis La Villa à Ville-la-Grand ?", a: `${houseCommuteLong("lavilla", "fr")} En heure de pointe, un Léman Express part toutes les ${TRANSIT.peakHeadwayMin} min ; en alternative, l'arrêt de bus ${TB.lavilla.busStop.name} est à ${TB.lavilla.busStop.walkMin} min à pied. ${borderFr("lavilla")}` },
              { q: "Quelle est la durée minimale du bail à La Villa ?", a: "Aucune durée minimale imposée : ton bail est de 12 mois et tu peux partir quand tu veux avec 1 mois de préavis. Pratique pour une mission de quelques mois ou une période d'essai en CDI à Genève." },
              { q: "Y a-t-il une caution et des frais d'agence ?", a: "Caution équivalente à 2 mois de loyer hors charges, restituée sous 30 jours après l'état des lieux de sortie si aucune dégradation n'est constatée, sinon sous 2 mois. Aucun frais d'agence. Aucun frais de dossier." },
              { q: "Combien de chambres y a-t-il à La Villa et sont-elles meublées ?", a: "10 chambres privatives, toutes meublées (lit, bureau ergonomique, placard) : 6 avec salle de bain privative, 4 avec accès à 2 salles d'eau partagées (ménage inclus dans le loyer). Chaque chambre offre une vue sur le jardin ou la réserve naturelle. Cuisine, salon, salle de sport, sauna et piscine chauffée 12×5 m sont partagés." },
              { q: "Qui peut postuler pour vivre à La Villa ?", a: "Profil cible : frontaliers en CDI, jeunes professionnels, expatriés et résidents fiscaux français travaillant à Genève. Sélection sur dossier (justificatif de revenus, motivation, compatibilité avec la communauté). Pas de critère d'âge strict, mais la majorité des résidents ont entre 25 et 40 ans." },
              { q: "Où se trouve La Villa et à quelle distance de Genève ?", a: `La Villa se situe à Ville-la-Grand, côté France, à ${TB.lavilla.eauxVivesDoorToDoorMin} min porte-à-porte de Genève-Eaux-Vives en Léman Express (gare d'Annemasse à ${TB.lavilla.stationWalkMin} min à pied, puis ${TRANSIT.trainEauxVivesMin} min de train) et à ${TB.lavilla.riveDoorToDoorMin} min du centre de Genève (Rive). C'est l'une des trois maisons de coliving de La Villa Coliving, avec une piscine extérieure chauffée et ${m2(HOUSE_SURFACES.lavilla.plotM2, "fr")} de jardin en bordure du Foron, la rivière-frontière, et de sa zone naturelle.` },
              { q: "Combien de résidents vivent à La Villa ?", a: "La Villa accueille 10 résidents dans une maison de coliving à Ville-la-Grand, près de Genève. C'est une maison à taille humaine, pensée pour que les liens se créent naturellement, avec une chambre meublée privée pour chacun et de larges espaces communs." },
              { q: "Quels équipements y a-t-il à La Villa ?", a: `La Villa, à Ville-la-Grand, dispose d'une piscine extérieure chauffée, d'un sauna infrarouge, d'une salle de sport, d'une salle de jeu, d'un espace home cinéma, de ${m2(HOUSE_SURFACES.lavilla.plotM2, "fr")} de jardin et d'espaces communs design. Tout est inclus dans le loyer tout compris, dès ${PRICE_SHARED_CHF_FR}/mois à La Villa.` },
              { q: "La Villa est-elle bien reliée à Genève ?", a: `Oui. Depuis La Villa, la gare d'Annemasse est à ${TB.lavilla.stationWalkMin} min à pied et le Léman Express direct rejoint Genève-Eaux-Vives en ${TRANSIT.trainEauxVivesMin} min — ${TB.lavilla.eauxVivesDoorToDoorMin} min porte-à-porte, ${TB.lavilla.cornavinDoorToDoorMin} min jusqu'à Cornavin. La maison combine ce bon accès avec un cadre verdoyant — ${m2(HOUSE_SURFACES.lavilla.plotM2, "fr")} de jardin et la zone naturelle du Foron, la rivière-frontière qui longe la rue.` },
            ],
            en: [
              { q: "What is the monthly rent at La Villa and what does it include?", a: `Rooms at La Villa are ${PRICE_CHF_EN} per month with a private en-suite bathroom, and ${PRICE_SHARED_CHF_EN} for the 4 rooms that share a shower room between 2 rooms (cleaned by our housekeeping team, included in the rent). Both are all-inclusive: utilities (water, electricity, heating), fiber internet up to 8 Gb/s, common-area cleaning three times a week, streaming subscriptions, pool & garden upkeep, private yoga/fitness classes, bedding included. No add-on fees.` },
              { q: "How do I get to Geneva from La Villa in Ville-la-Grand?", a: `${houseCommuteLong("lavilla", "en")} At peak time a Léman Express leaves every ${TRANSIT.peakHeadwayMin} minutes; alternatively, the ${TB.lavilla.busStop.name} bus stop is ${TB.lavilla.busStop.walkMin} minutes away on foot. ${borderEn("lavilla")}` },
              { q: "What is the minimum lease term at La Villa?", a: "No set minimum: your lease runs 12 months and you can leave whenever you want with 1 month's notice. Handy for a short assignment or a trial period in Geneva." },
              { q: "Is there a deposit and any agency fees?", a: "Deposit equivalent to 2 months' rent excluding charges, refunded within 30 days after the move-out inspection if there is no damage, otherwise within 2 months. No agency fees. No application fees." },
              { q: "How many rooms are there at La Villa and are they furnished?", a: "10 private rooms, all furnished (bed, ergonomic desk, wardrobe): 6 with a private en-suite bathroom, 4 with access to 2 shared designer shower rooms (cleaning included in the rent). Each room has a view of the garden or the nature reserve. Kitchen, living room, gym, sauna and 12×5 m heated pool are shared." },
              { q: "Who can apply to live at La Villa?", a: "Target profile: cross-border workers on CDI, young professionals, expatriates and French tax residents working in Geneva. Selection by application (income proof, motivation, fit with the community). No strict age limit, but most residents are 25-40 years old." },
              { q: "Where is La Villa and how far from Geneva?", a: `La Villa is in Ville-la-Grand, on the French side, ${TB.lavilla.eauxVivesDoorToDoorMin} minutes door to door from Geneva Eaux-Vives by Léman Express (Annemasse station is a ${TB.lavilla.stationWalkMin}-minute walk, then ${TRANSIT.trainEauxVivesMin} minutes by train) and ${TB.lavilla.riveDoorToDoorMin} minutes from the city centre (Rive). It's one of the three La Villa Coliving houses, with a heated outdoor pool and ${m2(HOUSE_SURFACES.lavilla.plotM2, "en")} of garden beside the Foron, the border river, and its nature area.` },
              { q: "How many residents live at La Villa?", a: "La Villa hosts 10 residents in a coliving house in Ville-la-Grand, near Geneva. It's a human-scale house, designed so connections form naturally, with a private furnished room for each resident and large common areas." },
              { q: "What amenities are there at La Villa?", a: `La Villa, in Ville-la-Grand, has a heated outdoor pool, an infrared sauna, a gym, a games room, a home cinema space, ${m2(HOUSE_SURFACES.lavilla.plotM2, "en")} of garden and designer common areas. Everything is included in the all-inclusive rent, from ${PRICE_SHARED_CHF_EN}/month at La Villa.` },
              { q: "Is La Villa well connected to Geneva?", a: `Yes. From La Villa, Annemasse station is a ${TB.lavilla.stationWalkMin}-minute walk and the direct Léman Express reaches Geneva Eaux-Vives in ${TRANSIT.trainEauxVivesMin} minutes — ${TB.lavilla.eauxVivesDoorToDoorMin} minutes door to door, ${TB.lavilla.cornavinDoorToDoorMin} minutes to Cornavin. The house combines this good access with green surroundings — ${m2(HOUSE_SURFACES.lavilla.plotM2, "en")} of garden and the Foron nature area, the border river running along the street.` },
            ],
          },
          leloft: {
            fr: [
              { q: "Quel est le loyer mensuel au Loft et que comprend-il ?", a: `Les chambres du Loft sont à ${PRICE_CHF_FR} par mois tout inclus : charges, internet fibre jusqu'à 8 Gb/s, ménage 3 fois par semaine des communs, abonnements streaming, piscine intérieure, jardin, parure de linge. Pas de supplément caché.` },
              { q: "Comment se rendre à Genève depuis Le Loft à Ambilly ?", a: `${houseCommuteLong("leloft", "fr")} ${borderFr("leloft")}` },
              { q: "Quelle est la durée minimale du bail au Loft ?", a: "Aucune durée minimale imposée : bail de 12 mois, et 1 mois de préavis pour partir quand tu veux — pratique pour les frontaliers en mission ou en période d'essai à Genève." },
              { q: "Y a-t-il une caution et des frais d'agence ?", a: "Caution équivalente à 2 mois de loyer hors charges, restituée sous 30 jours après l'état des lieux de sortie si aucune dégradation n'est constatée, sinon sous 2 mois. Aucun frais d'agence ni de dossier." },
              { q: "Combien de chambres y a-t-il au Loft et sont-elles meublées ?", a: "7 chambres privatives meublées (lit, bureau, placard), toutes avec salle de bain privative. Espaces communs design : cuisine ouverte, salon, terrasse, piscine intérieure chauffée toute l'année." },
              { q: "Qui peut postuler pour vivre au Loft ?", a: "Profil cible : frontaliers en CDI, jeunes professionnels, expatriés. Sélection sur dossier (justificatif de revenus, motivation, compatibilité avec la communauté). La proximité immédiate de la frontière fait du Loft un favori des frontaliers qui vont au bureau à pied ou en vélo." },
              { q: "Où se trouve Le Loft et à quelle distance de Genève ?", a: `Le Loft se situe au centre d'Ambilly, côté France, à ${TB.leloft.riveDoorToDoorMin} min porte-à-porte du centre de Genève (Rive) par le tram 17 (arrêt ${TB.leloft.tramStop.name} à ${TB.leloft.tramStop.walkMin} min à pied, ${TB.leloft.tramStop.tramToRiveMin} min de tram) et à ${TB.leloft.eauxVivesDoorToDoorMin} min de Genève-Eaux-Vives en Léman Express. C'est l'une des trois maisons de coliving de La Villa Coliving, avec une piscine intérieure chauffée toute l'année et un sauna finlandais.` },
              { q: "Combien de résidents vivent au Loft ?", a: "Le Loft accueille 7 résidents, ce qui en fait la plus intime des maisons de La Villa Coliving. Située à Ambilly, près de Genève, elle offre une chambre meublée privée à chacun et une ambiance très conviviale à taille réduite." },
              { q: "Quels équipements y a-t-il au Loft ?", a: `Le Loft, à Ambilly, dispose d'une piscine intérieure chauffée utilisable toute l'année, d'un sauna finlandais, d'une salle de sport, d'un espace home cinéma et de chambres spacieuses de ${ROOM_SURFACE_BY_HOUSE.leloft.min} à ${ROOM_SURFACE_BY_HOUSE.leloft.max} m². Tout est inclus dans le loyer tout compris de ${PRICE_CHF_FR}/mois.` },
              { q: "Peut-on nager toute l'année au Loft ?", a: "Oui. Le Loft, à Ambilly, est la maison de La Villa Coliving dotée d'une piscine intérieure chauffée, accessible toute l'année quelle que soit la saison, ainsi que d'un sauna finlandais. C'est inclus dans ton loyer, comme l'ensemble des services." },
            ],
            en: [
              { q: "What is the monthly rent at Le Loft and what does it include?", a: `Rooms at Le Loft are ${PRICE_CHF_EN} per month all-inclusive: utilities, fiber internet up to 8 Gb/s, common-area cleaning three times a week, streaming subscriptions, indoor pool, garden, bedding included. No hidden fees.` },
              { q: "How do I get to Geneva from Le Loft in Ambilly?", a: `${houseCommuteLong("leloft", "en")} ${borderEn("leloft")}` },
              { q: "What is the minimum lease term at Le Loft?", a: "No set minimum: a 12-month lease, and 1 month's notice whenever you decide to leave — useful for cross-border workers on assignment or on a trial period in Geneva." },
              { q: "Is there a deposit and any agency fees?", a: "Deposit equivalent to 2 months' rent excluding charges, refunded within 30 days after the move-out inspection if there is no damage, otherwise within 2 months. No agency fees, no application fees." },
              { q: "How many rooms are there at Le Loft and are they furnished?", a: "7 private furnished rooms (bed, desk, wardrobe), all with a private en-suite bathroom. Designer common spaces: open kitchen, living room, terrace, year-round heated indoor pool." },
              { q: "Who can apply to live at Le Loft?", a: "Target profile: cross-border workers on CDI, young professionals, expats. Selection by application (income proof, motivation, fit with community). The immediate proximity to the border makes Le Loft a favorite among cross-border workers who walk or bike to the office." },
              { q: "Where is Le Loft and how far from Geneva?", a: `Le Loft is in the centre of Ambilly, on the French side, ${TB.leloft.riveDoorToDoorMin} minutes door to door from central Geneva (Rive) by tram 17 (${TB.leloft.tramStop.name} stop an ${TB.leloft.tramStop.walkMin}-minute walk away, ${TB.leloft.tramStop.tramToRiveMin} minutes by tram) and ${TB.leloft.eauxVivesDoorToDoorMin} minutes from Geneva Eaux-Vives by Léman Express. It's one of the three La Villa Coliving houses, with an indoor pool heated year-round and a Finnish sauna.` },
              { q: "How many residents live at Le Loft?", a: "Le Loft hosts 7 residents, making it the most intimate of the La Villa Coliving houses. Located in Ambilly, near Geneva, it offers a private furnished room for each resident and a very convivial small-scale atmosphere." },
              { q: "What amenities are there at Le Loft?", a: `Le Loft, in Ambilly, has an indoor pool heated and usable year-round, a Finnish sauna, a gym, a home cinema space and spacious rooms of ${ROOM_SURFACE_BY_HOUSE.leloft.min} to ${ROOM_SURFACE_BY_HOUSE.leloft.max} m². Everything is included in the all-inclusive rent of ${PRICE_CHF_EN}/month.` },
              { q: "Can you swim year-round at Le Loft?", a: "Yes. Le Loft, in Ambilly, is the La Villa Coliving house with an indoor heated pool, accessible year-round whatever the season, plus a Finnish sauna. It's included in your rent, like all services." },
            ],
          },
          lelodge: {
            fr: [
              { q: "Quel est le loyer mensuel au Lodge et que comprend-il ?", a: `Les chambres du Lodge sont à ${PRICE_CHF_FR} par mois tout inclus : charges (eau, électricité, chauffage), internet fibre jusqu'à 8 Gb/s, ménage 3 fois par semaine des communs, abonnements streaming, entretien piscine et jardin, cours de yoga / fitness privés, parure de linge fournie, dîner communautaire mensuel. Pas de supplément.` },
              { q: "Comment se rendre à Genève depuis Le Lodge à Annemasse ?", a: `${houseCommuteLong("lelodge", "fr")} En heure de pointe, un train part toutes les ${TRANSIT.peakHeadwayMin} min, sans correspondance.` },
              { q: "Quelle est la durée minimale du bail au Lodge ?", a: "Aucune durée minimale imposée : ton bail est de 12 mois, et 1 mois de préavis suffit pour partir. Pas de séjour à la semaine : nos maisons accueillent des gens qui s'installent." },
              { q: "Y a-t-il une caution et des frais d'agence ?", a: "Caution équivalente à 2 mois de loyer hors charges, restituée sous 30 jours après l'état des lieux de sortie si aucune dégradation n'est constatée, sinon sous 2 mois. Aucun frais d'agence ni de dossier." },
              { q: "Combien de chambres y a-t-il au Lodge et sont-elles meublées ?", a: `12 chambres privatives, toutes meublées (lit, bureau ergonomique, placard sur mesure, salle de bain privative). Surface de ${ROOM_SURFACE_BY_HOUSE.lelodge.min} à ${ROOM_SURFACE_BY_HOUSE.lelodge.max} m² par chambre. Le Lodge a ouvert en janvier 2026, tout est neuf.` },
              { q: "Qu'est-ce qui rend Le Lodge unique parmi les 3 maisons ?", a: `Le Lodge est notre maison la plus récente (ouverte janvier 2026) et la plus grande (${HOUSE_SURFACES.lelodge.livingM2} m² sur ${m2(HOUSE_SURFACES.lelodge.plotM2, "fr")}). Elle dispose de 4 bâtiments : la résidence principale, un chalet fitness dédié avec sauna finlandais, un pool house avec cuisine d'été complète et une zone de rangement de ${HOUSE_SURFACES.lelodge.atticM2} m². DPE B (performance énergétique). C'est aussi la plus proche de la gare d'Annemasse pour le Léman Express (${TB.lelodge.stationWalkMin} min à pied).` },
              { q: "Où se trouve Le Lodge et à quelle distance de Genève ?", a: `Le Lodge se situe à Annemasse, côté France, dans le quartier de Romagny, à ${TB.lelodge.eauxVivesDoorToDoorMin} min porte-à-porte de Genève-Eaux-Vives en Léman Express (gare d'Annemasse à ${TB.lelodge.stationWalkMin} min à pied, puis ${TRANSIT.trainEauxVivesMin} min de train) et à ${TB.lelodge.riveDoorToDoorMin} min du centre de Genève (Rive). C'est la plus grande des trois maisons de coliving de La Villa Coliving, avec une piscine extérieure et un pool house, un chalet fitness complet et un sauna.` },
              { q: "Combien de résidents vivent au Lodge ?", a: "Le Lodge accueille 12 résidents, ce qui en fait la plus grande maison de La Villa Coliving. Située à Annemasse, près de Genève, elle conserve une taille humaine tout en offrant les espaces les plus généreux : espace home cinéma, piscine, pool house / salle de jeu, chalet fitness et grands espaces communs." },
              { q: "Quels équipements y a-t-il au Lodge ?", a: `Le Lodge, à Annemasse, dispose d'une piscine avec pool house/salle de jeu, d'un chalet fitness complet avec grand sauna finlandais, d'une salle de sport, d'une pièce home cinéma dédiée, d'un jeu d'arcade et de larges espaces communs. Tout est inclus dans le loyer tout compris de ${PRICE_CHF_FR}/mois, comme dans les trois maisons de La Villa Coliving.` },
              { q: "Y a-t-il du coliving à Annemasse ?", a: `Oui. Le Lodge est la maison de coliving de La Villa Coliving à Annemasse : 12 résidents, chambres meublées de ${ROOM_SURFACE_BY_HOUSE.lelodge.min} à ${ROOM_SURFACE_BY_HOUSE.lelodge.max} m², pool house, chalet fitness et sauna, le tout à ${TB.lelodge.eauxVivesDoorToDoorMin} min porte-à-porte de Genève-Eaux-Vives en Léman Express. Tout inclus à ${PRICE_CHF_FR}/mois.` },
            ],
            en: [
              { q: "What is the monthly rent at Le Lodge and what does it include?", a: `Rooms at Le Lodge are ${PRICE_CHF_EN} per month all-inclusive: utilities (water, electricity, heating), fiber internet up to 8 Gb/s, common-area cleaning three times a week, streaming subscriptions, pool & garden upkeep, private yoga/fitness classes, bedding included, monthly community dinner. No add-on fees.` },
              { q: "How do I get to Geneva from Le Lodge in Annemasse?", a: `${houseCommuteLong("lelodge", "en")} At peak time a train leaves every ${TRANSIT.peakHeadwayMin} minutes, no transfer.` },
              { q: "What is the minimum lease term at Le Lodge?", a: "No set minimum: your lease runs 12 months, and 1 month's notice is all it takes to leave. No weekly stays: our houses are for people who settle in." },
              { q: "Is there a deposit and any agency fees?", a: "Deposit equivalent to 2 months' rent excluding charges, refunded within 30 days after the move-out inspection if there is no damage, otherwise within 2 months. No agency fees, no application fees." },
              { q: "How many rooms are there at Le Lodge and are they furnished?", a: `12 private rooms, all furnished (bed, ergonomic desk, custom wardrobe, en-suite bathroom). ${ROOM_SURFACE_BY_HOUSE.lelodge.min} to ${ROOM_SURFACE_BY_HOUSE.lelodge.max} m² per room. Le Lodge opened in January 2026 — everything is new.` },
              { q: "What makes Le Lodge unique among your 3 houses?", a: `Le Lodge is our newest (opened January 2026) and largest house (${HOUSE_SURFACES.lelodge.livingM2} m² on ${m2(HOUSE_SURFACES.lelodge.plotM2, "en")}). It has 4 buildings: the main residence, a dedicated fitness chalet with Finnish sauna, a pool house with full outdoor kitchen, and a ${HOUSE_SURFACES.lelodge.atticM2} m² storage area. DPE B energy rating. It's also the closest to Annemasse station for the Léman Express (a ${TB.lelodge.stationWalkMin}-minute walk).` },
              { q: "Where is Le Lodge and how far from Geneva?", a: `Le Lodge is in Annemasse, on the French side, in the Romagny district, ${TB.lelodge.eauxVivesDoorToDoorMin} minutes door to door from Geneva Eaux-Vives by Léman Express (Annemasse station is a ${TB.lelodge.stationWalkMin}-minute walk, then ${TRANSIT.trainEauxVivesMin} minutes by train) and ${TB.lelodge.riveDoorToDoorMin} minutes from the city centre (Rive). It's the largest of the three La Villa Coliving houses, with an outdoor pool and a pool house, a full fitness chalet and a sauna.` },
              { q: "How many residents live at Le Lodge?", a: "Le Lodge hosts 12 residents, making it the largest La Villa Coliving house. Located in Annemasse, near Geneva, it keeps a human scale while offering the most generous spaces: home cinema, pool, pool house / games room, fitness chalet and large common areas." },
              { q: "What amenities are there at Le Lodge?", a: `Le Lodge, in Annemasse, has a pool with a pool house/games room, a full fitness chalet with a large Finnish sauna, a gym, a dedicated home-cinema room, an arcade game and large common areas. Everything is included in the all-inclusive rent of ${PRICE_CHF_EN}/month, as in all three La Villa Coliving houses.` },
              { q: "Is there coliving in Annemasse?", a: `Yes. Le Lodge is the La Villa Coliving coliving house in Annemasse: 12 residents, furnished rooms of ${ROOM_SURFACE_BY_HOUSE.lelodge.min} to ${ROOM_SURFACE_BY_HOUSE.lelodge.max} m², pool house, fitness chalet and sauna, all ${TB.lelodge.eauxVivesDoorToDoorMin} minutes door to door from Geneva Eaux-Vives by Léman Express. All inclusive at ${PRICE_CHF_EN}/month.` },
            ],
          },
        };
        const faqs = FAQ_DATA[id]?.[language === "en" ? "en" : "fr"];
        if (!faqs || faqs.length === 0) return null;
        const faqJsonLd = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        };
        return (
          <>
            <Helmet><script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script></Helmet>
            <section className="section-padding py-14 md:py-20 relative bg-[#FAF9F6]">
              <div className="container-custom max-w-3xl">
                <h2
                  className="text-3xl md:text-4xl mb-8 text-[#1C1917]"
                  style={{ fontFamily: '"DM Serif Display", serif' }}
                >
                  {language === "en" ? "Frequently asked questions" : "Questions fréquentes"}
                </h2>
                <dl className="space-y-6">
                  {faqs.map(({ q, a }, i) => (
                    <div key={i} className="card-ultra bg-white rounded-2xl border border-[#E7E5E4] shadow-sm p-6">
                      <dt className="text-lg font-black text-[#1C1917] mb-3">{q}</dt>
                      <dd className="text-[#57534E] font-medium leading-relaxed">{a}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>
          </>
        );
      })()}

      {/* Cross-house discovery — GA4 path data shows visitors loop back through
          /nos-maisons to compare; link the siblings directly to shorten the loop. */}
      <section className="section-padding py-14 md:py-20 relative bg-white">
        <div className="container-custom">
          <h2
            className="text-3xl md:text-4xl mb-8 text-[#1C1917]"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            {language === "en" ? "Compare with our other houses" : "Compare avec nos autres maisons"}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {(Object.keys(housesData) as Array<keyof typeof housesData>)
              .filter((hid) => hid !== id)
              .map((hid) => {
                const other = housesData[hid];
                return (
                  <LocalizedLink
                    key={hid}
                    to={language === "en" ? `/en/${hid}` : `/${hid}`}
                    className="group card-ultra overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={other.image}
                        alt={`${other.name} — coliving ${other.location}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6 flex items-center justify-between">
                      <div>
                        <h3
                          className="text-xl text-[#1C1917] mb-1 group-hover:text-[#D4A574] transition-colors"
                          style={{ fontFamily: '"DM Serif Display", serif' }}
                        >
                          {other.name}
                        </h3>
                        <p className="text-sm text-[#57534E] font-medium">
                          {other.location} · {other.capacity}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#D4A574] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </LocalizedLink>
                );
              })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative bg-[#1C1917] overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/15 blob hidden lg:block" />
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-[#D4A574]/40 blob-reverse hidden lg:block" />

        <div className="container-custom relative text-center">
          <h2
            className="text-3xl md:text-4xl mb-4 text-white font-black"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            {language === "en"
              ? `Ready to make ${house.name} your home?`
              : `Prêt à faire de ${house.name} ton chez-toi ?`}
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto font-bold mb-8">
            {language === "en"
              ? "Join our curated community and experience the best of coliving near Geneva."
              : "Rejoins notre communauté sélectionnée et vis le meilleur du coliving près de Genève."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <LocalizedLink
              to={`/candidature?property_interest=${id}`}
              onClick={() => trackCta("house_footer")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1C1917] font-bold rounded-full hover:bg-gray-100 transition-colors"
            >
              {t.houseDetail.apply}
              <ArrowRight className="w-5 h-5" />
            </LocalizedLink>
            <LocalizedLink
              to={colocGeneveHref(language)}
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-colors"
            >
              {language === "en" ? "Shared housing Geneva" : "Colocation Genève"}
              <ArrowRight className="w-5 h-5" />
            </LocalizedLink>
          </div>
        </div>
      </section>

      {/* Funnel P1 — CTA collante MOBILE (cachée en desktop), visible pendant tout le scroll.
          On garde "Candidater" + réassurance 48h (pas de promesse de réservation). */}
      <div className="md:hidden h-16" aria-hidden="true" />
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-[#E7E5E4] px-4 py-3">
        <LocalizedLink
          to={`/candidature?property_interest=${id}`}
          onClick={() => trackCta("sticky_mobile")}
          className="flex items-center justify-center gap-2 w-full bg-[#D4A574] text-[#1C1917] py-3 rounded-lg text-sm font-semibold"
        >
          {language === "en" ? "Apply — reply within 48h" : "Candidater — réponse sous 48h"}
          <ArrowRight className="w-4 h-4" />
        </LocalizedLink>
      </div>
      {/* WhatsApp flottant contextuel (plan A1, 08/2026) — remonté au-dessus de la
          CTA collante mobile (z-40, bottom-0) via bottomClass. */}
      <WhatsAppButton context={house.name} bottomClass="bottom-20 md:bottom-6" />
    </main>
  );
}
