import { useLocation } from "react-router-dom";
import { LocalizedLink } from "@/components/LocalizedLink";
import { Scrim } from "@/components/Scrim";
import { buildBreadcrumbSchema } from "@/lib/structuredData";
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
import { AVAILABILITY, houseAvailabilityLabel } from "@/data/stats";

import { Badge } from "@/components/ui/badge";
import { HouseGallery } from "@/sections/HouseGallery";
import { SEO } from "@/components/SEO";
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
    description: string;
    image: string;
  }[];
  nearby: string[];
  lifestyle: string[];
  community: string[];
  available: boolean;
  badge?: string;
  badgeColor: string;
}

function getHousesData(lang: string): Record<string, HouseData> {
  const isEn = lang === "en";
  return {
  lavilla: {
    name: "La Villa",
    location: "Ville-la-Grand, Grand Genève",
    description: isEn
      ? "370 m² of designed living on a 2,000 m² estate bordering a nature reserve. Heated pool, sauna, gym, and 10 spacious rooms."
      : "370 m² de vie design sur un domaine de 2 000 m² bordant une réserve naturelle. Piscine chauffée, sauna, salle de sport et 10 chambres spacieuses.",
    longDescription: isEn
      ? "Our flagship house, 10 minutes on foot from Annemasse station — Léman Express to central Geneva in 9 minutes, under 20 minutes door-to-door. 370 m² for 10 housemates on a 2,000 m² estate bordering a nature reserve. Day to day: a heated 12×5 m pool, a 5-seat sauna, a fully equipped gym, quiet workspaces and 8 Gb/s fiber. All rooms are furnished with Emma or Tediber mattresses — 6 with a private en-suite bathroom, 4 with a shared designer bathroom. All-inclusive rent from CHF 1,380/month: utilities, fiber, twice-weekly cleaning of common areas, pool and garden upkeep. No application fee, reply within 48h."
      : "Notre maison amirale, à 10 minutes à pied de la gare d'Annemasse — Léman Express vers le centre de Genève en 9 minutes, moins de 20 minutes porte-à-porte. 370 m² pour 10 colocataires, sur un domaine de 2 000 m² en bordure de réserve naturelle. Au quotidien : piscine chauffée de 12×5 m, sauna 5 places, salle de sport équipée, espaces de travail calmes et fibre 8 Gb/s. Toutes les chambres sont meublées avec matelas Emma ou Tediber — 6 avec salle de bain privative, 4 avec salle de bain partagée design. Loyer tout inclus dès 1 380 CHF/mois : charges, fibre, ménage 2×/semaine des espaces communs, entretien piscine et jardin. 0 frais de dossier, réponse sous 48 h.",
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
        src: "/images/la villa/exterior/la villa yoga.webp",
        alt: "La Villa outdoor space",
        category: "exterior",
      },
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
        src: "/images/la villa/amenities/la villa yoga.webp",
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
    price: "1,380",
    specs: {
      size: "370 m²",
      plot: "2,000 m²",
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
      "Vegetable garden & outdoor yoga deck",
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
      "Potager & terrasse yoga extérieure",
      "Double cuisine équipée",
    ],
    services: isEn ? [
      "Weekly private yoga & fitness classes",
      "Monthly pizza party",
      "Monthly community dinner",
      "Seasonal community events",
      "WhatsApp direct support",
      "Housekeeping twice a week",
      "Pool, sauna & garden maintenance",
      "Streaming subscriptions (Netflix, Canal+, etc.)",
      "Bed linen set & towels provided",
    ] : [
      "Cours de yoga & fitness privés hebdomadaires",
      "Pizza Party mensuelle",
      "Panier repas mensuel livré",
      "Événements communautaires saisonniers",
      "Support WhatsApp direct",
      "Ménage des communs 2 fois par semaine",
      "Entretien piscine, sauna & jardin",
      "Abonnements streaming (Netflix, Canal+, etc.)",
      "Parure de linge de lit et serviettes fournie",
    ],
    rooms: [
      {
        type: isEn ? "Room with private bathroom" : "Chambre avec salle de bain privative",
        price: "1,380 CHF",
        description: isEn
          ? "Your private sanctuary with double Emma bed, ergonomic desk, spacious closet, and private bathroom. Most rooms offer a terrace or balcony with garden views. 17 to 23 m²."
          : "Votre espace privé avec lit double Emma, bureau ergonomique, placard spacieux et salle de bain privative. La plupart des chambres offrent une terrasse ou un balcon avec vue sur le jardin. 17 à 23 m².",
        image: "/images/la villa/rooms/La Villa-80.webp",
      },
      {
        type: isEn ? "Room with shared bathroom" : "Chambre avec salle de bain partagée",
        price: "1,380 CHF",
        description: isEn
          ? "Comfortable private room with double Emma bed, workspace, and ample storage. Access to beautifully designed shared bathroom (rooms CH3, CH4, CH7, CH8). 17 to 20 m²."
          : "Chambre privée confortable avec lit double Emma, espace de travail et rangement. Accès à une salle de bain partagée design (chambres CH3, CH4, CH7, CH8). 17 à 20 m².",
        image: "/images/la villa/rooms/La Villa-92.webp",
      },
    ],
    nearby: isEn ? [
      "Annemasse station 10 min on foot — Léman Express to central Geneva in 9 min",
      "Under 20 min door-to-door to Geneva — 15 min by car, Moillesulaz border 2 km",
      "Supermarkets within 5 min walk",
      "Nature reserve at your doorstep",
      "Local cafes and restaurants nearby",
      "Bike paths to Geneva",
    ] : [
      "Gare d'Annemasse à 10 min à pied — Léman Express vers Genève centre en 9 min",
      "Moins de 20 min porte-à-porte vers Genève — 15 min en voiture, frontière de Moillesulaz à 2 km",
      "Supermarchés à 5 min à pied",
      "Réserve naturelle au pas de la porte",
      "Cafés et restaurants de proximité",
      "Pistes cyclables vers Genève",
    ],
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
    // Dispo dérivée de la source unique (stats.ts) — plus de "1 chambre" codée en dur.
    available: AVAILABILITY.lavilla > 0,
    badge: houseAvailabilityLabel("lavilla", isEn ? "en" : "fr"),
    badgeColor: AVAILABILITY.lavilla > 0 ? "#D4A574" : "#78716C",
  },
  leloft: {
    name: "Le Loft",
    location: "Ambilly, Grand Genève",
    description: isEn
      ? "A 300 m² townhouse with year-round heated indoor pool, Finnish sauna, outdoor kitchen, and 7 spacious designer rooms."
      : "Maison de ville de 300 m² avec piscine intérieure chauffée toute l'année, sauna finlandais, cuisine extérieure et 7 chambres design spacieuses.",
    longDescription: isEn
      ? "Le Loft brings urban sophistication to coliving. This stunning 300 m² townhouse in Ambilly is the most intimate of our three houses, with just 7 residents. Its year-round heated indoor pool — virtually unique in European coliving — is the centerpiece of this exceptional property. The Finnish sauna, fully equipped gym, designer interiors, outdoor kitchen with TV, and spacious terraces make Le Loft ideal for those who appreciate the finer things while valuing genuine community."
      : "Le Loft incarne la sophistication urbaine du coliving. Cette maison de ville de 300 m² à Ambilly est la plus intimiste de nos trois maisons, avec seulement 7 résidents. Sa piscine intérieure chauffée toute l'année — quasi unique en coliving européen — est la pièce maîtresse de ce bien d'exception. Le sauna finlandais, la salle de sport équipée, les intérieurs design, la cuisine extérieure avec TV et les terrasses spacieuses font du Loft un lieu idéal pour ceux qui apprécient le raffinement tout en valorisant la vraie communauté.",
    image: "/images/le loft/exterior/la villa coliving le loft.webp",
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
        src: "/images/le loft/exterior/le loft glamour.webp",
        alt: "Le Loft indoor pool",
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
    price: "1,380",
    specs: {
      size: "300 m²",
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
      "Weekly private yoga & fitness classes",
      "Monthly pizza party",
      "Monthly community dinner",
      "Seasonal community events",
      "WhatsApp direct support",
      "Housekeeping twice a week",
      "Pool & sauna maintenance",
      "Streaming subscriptions (Netflix, Canal+, etc.)",
      "Bed linen set & towels provided",
    ] : [
      "Cours de yoga & fitness privés hebdomadaires",
      "Pizza Party mensuelle",
      "Panier repas mensuel livré",
      "Événements communautaires saisonniers",
      "Support WhatsApp direct",
      "Ménage des communs 2 fois par semaine",
      "Entretien piscine & sauna",
      "Abonnements streaming (Netflix, Canal+, etc.)",
      "Parure de linge de lit et serviettes fournie",
    ],
    rooms: [
      {
        type: isEn ? "Room with private bathroom" : "Chambre avec salle de bain privative",
        price: "1,380 CHF",
        description: isEn
          ? "Elegant designer room (21 m², CH7 = 23 m²) with private en-suite bathroom, premium Emma or Tediber mattress, workspace, and terrace access. All 7 rooms have private bathrooms."
          : "Chambre design élégante (21 m², CH7 = 23 m²) avec salle de bain privative, matelas premium Emma ou Tediber, espace de travail et accès terrasse. Les 7 chambres ont une salle de bain privative.",
        image: "/images/le loft/rooms/la villa coliving le loft-52.webp",
      },
    ],
    nearby: isEn ? [
      "5 min walk to Croix d'Ambilly tram (direct to Geneva)",
      "14 min walk to Annemasse train station",
      "15-20 min to Geneva center",
      "Restaurants within walking distance",
      "Easy access to the Voie Verte bike path",
    ] : [
      "Tram Croix d'Ambilly à 5 min à pied (direct Genève)",
      "Gare d'Annemasse à 14 min à pied",
      "15-20 min du centre de Genève",
      "Restaurants accessibles à pied",
      "Accès facile à la Voie Verte (piste cyclable)",
    ],
    lifestyle: isEn ? [
      "Morning swims in the indoor pool",
      "Terrace aperitifs at sunset",
      "Urban exploration weekends",
      "Cooking sessions in the designer kitchen",
      "Sauna & relaxation evenings",
      "Outdoor dining under the stars",
    ] : [
      "Baignades matinales dans la piscine intérieure",
      "Apéros en terrasse au coucher du soleil",
      "Explorations urbaines le week-end",
      "Sessions cuisine dans la kitchen design",
      "Soirées sauna & relaxation",
      "Dîners en extérieur sous les étoiles",
    ],
    community: isEn ? [
      "Urban professionals",
      "Finance & consulting experts",
      "International executives",
      "City lovers & culture enthusiasts",
    ] : [
      "Professionnels urbains",
      "Experts finance & consulting",
      "Cadres internationaux",
      "Amoureux de la ville & passionnés de culture",
    ],
    // Dispo dérivée de la source unique (stats.ts) — plus de "1 chambre" codée en dur.
    available: AVAILABILITY.leloft > 0,
    badge: houseAvailabilityLabel("leloft", isEn ? "en" : "fr"),
    badgeColor: AVAILABILITY.leloft > 0 ? "#D4A574" : "#78716C",
  },
  lelodge: {
    name: "Le Lodge",
    location: "Annemasse, Grand Genève",
    description: isEn
      ? "Our newest and largest home, open since January 2026. 500 m² on 1,500 m², pool house, full fitness chalet with sauna & arcade."
      : "Notre maison la plus récente et la plus grande, ouverte depuis janvier 2026. 500 m² sur 1 500 m², pool house, chalet fitness complet avec sauna et jeu d'arcade.",
    longDescription: isEn
      ? "Le Lodge is our newest coliving in Annemasse, opened January 2026 in the quiet residential Romagny district. Within 500 m² spread across 4 buildings at the heart of 1,500 m² of gardens, 12 housemates share a dedicated fitness chalet with Finnish sauna, a pool house with full outdoor kitchen, and a main residence designed to combine privacy and community living. Each furnished room has its own en-suite bathroom, ergonomic desk and fiber internet. Annemasse station is a 9-minute walk away — direct Léman Express to Geneva Cornavin in 15 minutes, no transfer. Ideal for cross-border workers commuting daily, and young professionals who value a real community over a faceless apartment block. All-inclusive rent (utilities, fiber, twice-weekly common cleaning, private fitness classes) from CHF 1,380/month. No agency fees."
      : "Le Lodge est notre coliving le plus récent à Annemasse, ouvert en janvier 2026 dans le quartier résidentiel calme de Romagny. Dans 500 m² répartis sur 4 bâtiments au cœur de 1 500 m² de jardins, 12 colocataires partagent un chalet fitness dédié avec sauna finlandais, un pool house avec cuisine d'été complète et une résidence principale conçue pour combiner intimité et vie communautaire. Chaque chambre meublée dispose de sa salle de bain privative, d'un bureau ergonomique et de la fibre. La gare d'Annemasse est à 9 minutes à pied — Léman Express direct jusqu'à Genève Cornavin en 15 minutes, sans correspondance. Idéal pour les frontaliers qui font le trajet quotidien, et les jeunes pros qui valorisent une vraie communauté plutôt qu'un immeuble anonyme. Loyer tout inclus (charges, fibre, ménage commun 2 fois par semaine, cours de fitness privés) à partir de 1 380 CHF/mois. Sans frais d'agence.",
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
    price: "1,380",
    specs: {
      size: "500 m²",
      plot: "1,500 m²",
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
      "130 m² attic storage",
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
      "Grenier de stockage 130 m²",
      "DPE B (performance énergétique)",
    ],
    services: isEn ? [
      "Weekly private yoga & fitness classes",
      "Monthly pizza party",
      "Monthly community dinner",
      "Seasonal community events",
      "WhatsApp direct support",
      "Housekeeping twice a week",
      "Full property, garden & pool maintenance",
      "Streaming subscriptions (Netflix, Canal+, etc.)",
      "Bed linen set & towels provided",
    ] : [
      "Cours de yoga & fitness privés hebdomadaires",
      "Pizza Party mensuelle",
      "Panier repas mensuel livré",
      "Événements communautaires saisonniers",
      "Support WhatsApp direct",
      "Ménage des communs 2 fois par semaine",
      "Entretien complet propriété, jardin & piscine",
      "Abonnements streaming (Netflix, Canal+, etc.)",
      "Parure de linge de lit et serviettes fournie",
    ],
    rooms: [
      {
        type: isEn ? "Room with private bathroom" : "Chambre avec salle de bain privative",
        price: "1,380 CHF",
        description: isEn
          ? "Premium private room (17 to 19 m²) in our newest house. Modern design, private bathroom, quality mattress, and garden access. All 12 rooms have private bathrooms."
          : "Chambre privée premium (17 à 19 m²) dans notre maison la plus récente. Design moderne, salle de bain privative, matelas de qualité et accès jardin. Les 12 chambres ont une salle de bain privative.",
        image: "/images/le lodge/rooms/la villa coliving le lodge-78.webp",
      },
    ],
    nearby: isEn ? [
      "1 min walk to Place de l'Étoile tram stop",
      "9 min walk to Annemasse train station",
      "15-25 min to Geneva center",
      "Annemasse city center at your doorstep",
      "Shopping center 5 min away",
      "Restaurants & bars within walking distance",
    ] : [
      "Tram Place de l'Étoile à 1 min à pied",
      "Gare d'Annemasse à 9 min à pied",
      "15-25 min du centre de Genève",
      "Centre-ville d'Annemasse au pas de la porte",
      "Centre commercial à 5 min",
      "Restaurants & bars accessibles à pied",
    ],
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
    // Dispo dérivée de la source unique (stats.ts) — plus de "1 chambre" codée en dur.
    available: AVAILABILITY.lelodge > 0,
    badge: houseAvailabilityLabel("lelodge", isEn ? "en" : "fr"),
    badgeColor: AVAILABILITY.lelodge > 0 ? "#D4A574" : "#78716C",
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

  // Same guarded gtag pattern as the blog CTAs / candidature form: measure which
  // CTA position converts (GA4 cta_click), never block the UI on analytics.
  const trackCta = (position: string) => {
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "cta_click", {
        cta_position: position, cta_target: "/candidature", house: id, language,
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
            lavilla: { en: "La Villa — 10 rooms in Ville-la-Grand", fr: "Colocation à Ville-la-Grand — coliving" },
            leloft:  { en: "Le Loft — 7 rooms in Ambilly",          fr: "Colocation à Ambilly — coliving tout inclus" },
            lelodge: { en: "Le Lodge — 12 rooms in Annemasse",       fr: "Le Lodge — 12 chambres à Annemasse" },
          };
          return titles[id]?.[language === "en" ? "en" : "fr"]
            ?? `${house.name} — ${house.location}`;
        })()}
        description={(() => {
          // Metas ≤ 155c, factuelles, chiffrées. Pas de "${house.description}" qui dépasse 200c.
          const descs: Record<string, { en: string; fr: string }> = {
            lavilla: {
              en: "La Villa: 10 premium rooms in Ville-la-Grand. Heated pool, sauna, gym, fiber. All-inclusive from CHF 1,380/month. 20 min from Geneva city center.",
              fr: "La Villa : 10 chambres premium à Ville-la-Grand. Piscine chauffée, sauna, gym, fibre. Tout inclus dès 1 380 CHF/mois. À 20 min du centre de Genève.",
            },
            leloft: {
              en: "Le Loft: 7 premium rooms in Ambilly. Indoor pool, urban design, Tram 17 to Geneva. All-inclusive from CHF 1,380/month.",
              fr: "Le Loft : 7 chambres premium à Ambilly. Piscine intérieure, design urbain, Tram 17 vers Genève. Tout inclus dès 1 380 CHF/mois.",
            },
            lelodge: {
              en: "Le Lodge: 12 rooms in Annemasse, opened 2026. Pool, gym, sauna, 9-min walk to Léman Express. All-inclusive from CHF 1,380/month.",
              fr: "Le Lodge : 12 chambres premium à Annemasse, ouvertes en 2026. Piscine, gym, sauna, gare Léman Express à 9 min. Tout inclus dès 1 380 CHF/mois.",
            },
          };
          return descs[id]?.[language === "en" ? "en" : "fr"]
            ?? `${house.description} Tout inclus dès ${house.price} CHF/mois.`;
        })()}
        url={`https://www.lavillacoliving.com/${id}`}
        image={`https://www.lavillacoliving.com${house.image}`}
      />
      {/* LocalBusiness Schema.org */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LodgingBusiness",
        "name": `La Villa Coliving — ${house.name}`,
        "description": house.description,
        "image": `https://www.lavillacoliving.com${house.image}`,
        "url": `https://www.lavillacoliving.com/${id}`,
        "telephone": "+33664315134",
        "email": "contact@lavillacoliving.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": id === "lavilla" ? "Ville-la-Grand" : id === "leloft" ? "Ambilly" : "Annemasse",
          "addressLocality": id === "lavilla" ? "Ville-la-Grand" : id === "leloft" ? "Ambilly" : "Annemasse",
          "postalCode": id === "lavilla" ? "74100" : id === "leloft" ? "74100" : "74100",
          "addressRegion": "Haute-Savoie",
          "addressCountry": "FR"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": id === "lavilla" ? 46.2050 : id === "leloft" ? 46.1960 : 46.1940,
          "longitude": id === "lavilla" ? 6.2280 : id === "leloft" ? 6.2250 : 6.2360
        },
        "priceRange": "1380 CHF/mois",
        "currenciesAccepted": "EUR",
        "amenityFeature": [
          { "@type": "LocationFeatureSpecification", "name": "Swimming Pool", "value": true },
          { "@type": "LocationFeatureSpecification", "name": "Sauna", "value": true },
          { "@type": "LocationFeatureSpecification", "name": "Gym", "value": true },
          { "@type": "LocationFeatureSpecification", "name": "WiFi", "value": true },
          { "@type": "LocationFeatureSpecification", "name": "Parking", "value": true }
        ],
        "numberOfRooms": id === "lavilla" ? 10 : id === "leloft" ? 7 : 12,
        "sameAs": [
          "https://www.facebook.com/lavillacoliving",
          "https://www.instagram.com/lavillacoliving"
        ]
      }) }} />
      {/* BreadcrumbList Schema.org */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema([
        { name: language === "en" ? "Home" : "Accueil", url: `https://www.lavillacoliving.com${language === "en" ? "/en" : ""}/` },
        { name: language === "en" ? "Our houses" : "Nos maisons", url: `https://www.lavillacoliving.com${language === "en" ? "/en" : ""}/nos-maisons` },
        { name: id === "lavilla" ? "La Villa" : id === "leloft" ? "Le Loft" : "Le Lodge", url: `https://www.lavillacoliving.com${language === "en" ? "/en" : ""}/${id}` },
      ])) }} />
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
              {house.badge && (
                <Badge
                  className="font-extrabold"
                  style={{ background: house.badgeColor, color: "white" }}
                >
                  {house.badge}
                </Badge>
              )}
              {house.available && !house.badge && (
                <Badge
                  className="font-extrabold"
                  style={{ background: house.badgeColor, color: "white" }}
                >
                  {language === "en" ? "Available" : "Disponible"}
                </Badge>
              )}
              {/* DPE déplacé hors du hero (décision 2026-06-11) : la mention reste
                  obligatoire sur la page → affichée dans la section « À propos ». */}
            </div>
            <h1
              className="text-4xl md:text-7xl mb-4 text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.55)]"
              style={{ fontFamily: "DM Serif Display, serif" }}
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
                to={language === "en" ? "/en/candidature" : "/candidature"}
                onClick={() => trackCta("house_hero")}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#D4A574] text-[#1C1917] font-bold rounded-full hover:bg-[#E0BB8A] transition-colors shadow-sharp"
              >
                {t.houseDetail.apply}
                <ArrowRight className="w-5 h-5" />
              </LocalizedLink>
              <span className="text-sm font-semibold text-[#1C1917] bg-white/85 backdrop-blur px-4 py-2 rounded-full">
                {language === "en"
                  ? "All-inclusive from CHF 1,380/month — no application fee"
                  : "Tout inclus dès 1 380 CHF/mois — 0 frais de dossier"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="section-padding relative bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2
                className="text-3xl md:text-4xl mb-6 text-[#1C1917]"
                style={{ fontFamily: "DM Serif Display, serif" }}
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
                <div className="card-ultra p-8">
                  <p className="text-sm text-[#78716C] mb-2 font-bold">
                    {t.houseDetail.from}
                  </p>
                  <p className="text-4xl font-black text-[#D4A574] mb-2">
                    {house.price} CHF
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
                  <div className="mb-4">
                    {house.available ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#D4A574]/10 text-[#D4A574] text-sm font-semibold rounded-lg">
                        <span className="w-2 h-2 bg-[#D4A574] rounded-full animate-pulse" />
                        {house.badge || (language === "en" ? "Available" : "Disponible")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#78716C]/10 text-[#78716C] text-sm font-semibold rounded-lg">
                        <span className="w-2 h-2 bg-[#78716C] rounded-full" />
                        {house.badge || "Complet"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    <LocalizedLink
                      to="/candidature"
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1C1917] text-white font-semibold rounded-xl hover:bg-[#D4A574] transition-colors"
                    >
                      {house.available
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
                        : "Ou posez-nous une question sur WhatsApp →"}
                    </a>
                  </div>
                </div>

                {/* Quick Info Card */}
                <div className="card-ultra p-6">
                  <h4 className="font-bold text-[#1C1917] mb-4">
                    {language === "en" ? "Quick Info" : "Infos Rapides"}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[#57534E]">
                      <Clock size={18} className="text-[#D4A574]" />
                      <span className="text-sm">{language === "en" ? "15-25 min to Geneva" : "15-25 min de Genève"}</span>
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
                <div className="card-ultra p-6">
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

      {/* Location — custom section per house (audit P0-1: capture local SEO intent + Léman Express signal) */}
      {(() => {
        const LOCATION_DATA: Record<string, {
          fr: { intro: string; address: string; transport: string[]; nearby: string[] };
          en: { intro: string; address: string; transport: string[]; nearby: string[] };
        }> = {
          lavilla: {
            fr: {
              intro: "La Villa est située à Ville-la-Grand, commune résidentielle de l'agglomération d'Annemasse, à 6 km du centre de Genève. La frontière suisse est mitoyenne à La Villa.",
              address: "34 rue du Foron, 74100 Ville-la-Grand, Haute-Savoie, France",
              transport: [
                "Centre de Genève : moins de 20 min porte-à-porte (gare d'Annemasse à 10 min à pied, puis Léman Express en 9 min), 15 min en voiture",
                "Aéroport de Genève : 25 min en voiture",
                "Frontière suisse de Moillesulaz : 2 km, 5 min à vélo",
                "Bus TPN ligne 61 (arrêt à 200 m), correspondance directe vers Genève",
              ],
              nearby: [
                "Commerces et restaurants du centre de Ville-la-Grand : 600 m à pied",
                "Carrefour Annemasse, Decathlon, Centre commercial Étrembières : 5 min en voiture",
                "Forêt de Salève et pistes de randonnée : 10 min",
                "Réserve naturelle du Foron : à la porte de la maison",
              ],
            },
            en: {
              intro: "La Villa is located in Ville-la-Grand, a residential commune within the Annemasse agglomeration, 6 km from central Geneva. The Swiss border adjoins La Villa.",
              address: "34 rue du Foron, 74100 Ville-la-Grand, Haute-Savoie, France",
              transport: [
                "Central Geneva: under 20 min door-to-door (Annemasse station 10 min on foot, then 9 min by Léman Express), 15 min by car",
                "Geneva Airport: 25 min by car",
                "Moillesulaz border crossing: 2 km, 5 min by bike",
                "TPN bus line 61 (stop 200 m away), direct connection to Geneva",
              ],
              nearby: [
                "Ville-la-Grand town center shops and restaurants: 600 m on foot",
                "Carrefour Annemasse, Decathlon, Étrembières mall: 5 min by car",
                "Salève forest and hiking trails: 10 min",
                "Foron nature reserve: at the doorstep",
              ],
            },
          },
          leloft: {
            fr: {
              intro: "Le Loft est situé à Ambilly, la commune la plus proche de la frontière suisse dans l'agglomération d'Annemasse. Le Tram 17 est situé à 5 minutes à pied.",
              address: "1 rue des Marronniers, 74100 Ambilly, Haute-Savoie, France",
              transport: [
                "Genève Cornavin : 20 min via Léman Express depuis Annemasse Gare (5 min en bus depuis Le Loft)",
                "Tram 17 TPG (Lancy-Pont-Rouge ↔ Annemasse) : 5 min à pied",
                "Aéroport de Genève : 25 min en voiture",
                "Frontière suisse de Moillesulaz : 500 m, 5 min à pied",
                "Pistes cyclables sécurisées vers Genève centre : 25 min en vélo",
              ],
              nearby: [
                "Commerces du centre d'Ambilly : 200 m à pied",
                "Carrefour Annemasse, Decathlon : 10 min en voiture",
                "Parc Montessuit : 5 min à pied",
                "Centre d'Annemasse (cinéma, restaurants, gare) : 10 min en voiture ou en vélo",
              ],
            },
            en: {
              intro: "Le Loft is located in Ambilly, the closest commune to the Swiss border within the Annemasse agglomeration. Tram 17 is a 5-minute walk away.",
              address: "1 rue des Marronniers, 74100 Ambilly, Haute-Savoie, France",
              transport: [
                "Geneva Cornavin: 20 min via Léman Express from Annemasse Gare (5-min bus from Le Loft)",
                "Tram 17 TPG (Lancy-Pont-Rouge ↔ Annemasse): 5 min on foot",
                "Geneva Airport: 25 min by car",
                "Moillesulaz border: 500 m, 5 min walk",
                "Secure bike paths to central Geneva: 25 min by bike",
              ],
              nearby: [
                "Ambilly town center shops: 200 m on foot",
                "Carrefour Annemasse, Decathlon: 10 min by car",
                "Parc Montessuit: 5 min walk",
                "Central Annemasse (cinema, restaurants, train station): 10 min by car or bike",
              ],
            },
          },
          lelodge: {
            fr: {
              intro: "Le Lodge est situé à Annemasse, dans le quartier résidentiel calme de Romagny. La gare d'Annemasse — terminus du Léman Express vers Genève Cornavin — est à 9 minutes à pied.",
              address: "8 rue de Romagny, 74100 Annemasse, Haute-Savoie, France",
              transport: [
                "Genève Cornavin : 15 min en Léman Express direct depuis la gare d'Annemasse, sans correspondance",
                "Gare d'Annemasse : 9 min à pied, ligne de bus 7 directe",
                "Tram 17 TPG (Lancy-Pont-Rouge ↔ Annemasse) : 1 min à pied",
                "Aéroport de Genève : 30 min en voiture",
                "Frontière suisse : 5 min en voiture",
              ],
              nearby: [
                "Centre d'Annemasse (cinéma Ciné Actuel, restaurants, marché du mardi/vendredi) : 5 min en voiture",
                "Carrefour Annemasse, Decathlon, La Poste, banques : à proximité",
                "Pôle universitaire de Pierrevierge : 10 min",
                "Quartier de Vétraz-Monthoux et Salève : 10 min",
              ],
            },
            en: {
              intro: "Le Lodge is located in Annemasse, in the quiet residential Romagny district. Annemasse station — terminus of the Léman Express to Geneva Cornavin — is a 9-minute walk away.",
              address: "8 rue de Romagny, 74100 Annemasse, Haute-Savoie, France",
              transport: [
                "Geneva Cornavin: 15 min direct via Léman Express from Annemasse station, no transfer",
                "Annemasse station: 9 min on foot, direct bus line 7",
                "Tram 17 TPG (Lancy-Pont-Rouge ↔ Annemasse): 1 min on foot",
                "Geneva Airport: 30 min by car",
                "Swiss border: 5 min by car",
              ],
              nearby: [
                "Central Annemasse (Ciné Actuel cinema, restaurants, Tuesday/Friday market): 5 min by car",
                "Carrefour Annemasse, Decathlon, post office, banks: nearby",
                "Pierrevierge university campus: 10 min",
                "Vétraz-Monthoux district and Salève foothills: 10 min",
              ],
            },
          },
        };
        const data = LOCATION_DATA[id]?.[language === "en" ? "en" : "fr"];
        if (!data) return null;
        return (
          <section className="section-padding relative bg-white">
            <div className="container-custom max-w-5xl">
              <h2
                className="text-3xl md:text-4xl mb-6 text-[#1C1917]"
                style={{ fontFamily: "DM Serif Display, serif" }}
              >
                {language === "en"
                  ? `Location: ${house.name} in ${house.location.split(',')[0]}`
                  : `Localisation : ${house.name} à ${house.location.split(',')[0]}`}
              </h2>
              <p className="text-lg text-[#57534E] leading-relaxed mb-8 font-medium">{data.intro}</p>

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
                  <ul className="space-y-2">
                    {data.transport.map((line, i) => (
                      <li key={i} className="flex items-start gap-2 text-[#57534E] font-medium">
                        <Check className="text-[#D4A574] mt-1 flex-shrink-0" size={16} />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
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
            </div>
          </section>
        );
      })()}

      {/* Rooms */}
      <section className="section-padding relative bg-[#FAF9F6]">
        <div className="container-custom">
          <h2
            className="text-3xl md:text-4xl mb-8 text-[#1C1917]"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {t.houseDetail.rooms}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {house.rooms.map((room, index) => (
              <div key={index} className="card-ultra overflow-hidden group">
                {/* Room Image */}
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

                {/* Room Content */}
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
                    </p>
                    <span className="text-[#78716C] font-medium">
                      {t.houseDetail.perMonth}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <HouseGallery images={house.photoGallery} houseName={house.name} />

      {/* FAQ — schema FAQPage rich-snippet (audit P0-1, G4) */}
      {(() => {
        type QA = { q: string; a: string };
        const FAQ_DATA: Record<string, { fr: QA[]; en: QA[] }> = {
          lavilla: {
            fr: [
              { q: "Quel est le loyer mensuel à La Villa et que comprend-il ?", a: "Les chambres de La Villa sont à 1 380 CHF par mois tout inclus : charges (eau, électricité, chauffage), internet fibre jusqu'à 8 Gb/s, ménage 2 fois par semaine des espaces communs, abonnements streaming, entretien piscine et jardin, cours de yoga / fitness privés, parure de linge fournie. Aucun supplément." },
              { q: "Comment se rendre à Genève depuis La Villa à Ville-la-Grand ?", a: "Moins de 20 minutes porte-à-porte : la gare d'Annemasse est à moins de 10 min à pied, puis le Léman Express te dépose au centre de Genève en 9 min. En voiture : 15 min. En alternative, le bus TPN ligne 61 passe à 200 m. La frontière suisse de Moillesulaz est à 2 km — 5 min à vélo." },
              { q: "Quelle est la durée minimale du bail à La Villa ?", a: "Bail flexible 1 à 12 mois. Le bail par défaut est de 12 mois pour la stabilité de la communauté, mais nous acceptons des séjours plus courts (1, 3, 6 mois) selon disponibilité — utile pour les missions courtes ou les périodes d'essai en CDI." },
              { q: "Y a-t-il une caution et des frais d'agence ?", a: "Caution équivalente à 2 mois de loyer hors charges, restituée sous 30 jours après l'état des lieux de sortie. Aucun frais d'agence. Aucun frais de dossier." },
              { q: "Combien de chambres y a-t-il à La Villa et sont-elles meublées ?", a: "10 chambres privatives, toutes meublées (lit, bureau ergonomique, placard) : 6 avec salle de bain privative, 4 avec accès à une salle de bain partagée design. Chaque chambre offre une vue sur le jardin ou la réserve naturelle. Cuisine, salon, salle de sport, sauna et piscine chauffée 12×5 m sont partagés." },
              { q: "Qui peut postuler pour vivre à La Villa ?", a: "Profil cible : frontaliers en CDI, jeunes professionnels, expatriés et résidents fiscaux français travaillant à Genève. Sélection sur dossier (justificatif de revenus, motivation, compatibilité avec la communauté). Pas de critère d'âge strict, mais la majorité des résidents ont entre 25 et 40 ans." },
              { q: "Où se trouve La Villa et à quelle distance de Genève ?", a: "La Villa se situe à Ville-la-Grand, côté France, à moins de 20 minutes porte-à-porte du centre de Genève (Léman Express) et 15 minutes en voiture. C'est l'une des trois maisons de coliving de La Villa Coliving, avec une piscine extérieure chauffée, 2 000 m² de jardin en bordure d'une réserve naturelle." },
              { q: "Combien de résidents vivent à La Villa ?", a: "La Villa accueille 10 résidents dans une maison de coliving à Ville-la-Grand, près de Genève. C'est une maison à taille humaine, pensée pour que les liens se créent naturellement, avec une chambre meublée privée pour chacun et de larges espaces communs." },
              { q: "Quels équipements y a-t-il à La Villa ?", a: "La Villa, à Ville-la-Grand, dispose d'une piscine extérieure chauffée, d'un sauna infrarouge, d'une salle de sport, d'une salle de jeu, d'un espace home cinéma, de 2 000 m² de jardin et d'espaces communs design. Tout est inclus dans le loyer tout compris dès 1 380 CHF/mois, comme dans les trois maisons de La Villa Coliving." },
              { q: "La Villa est-elle bien reliée à Genève ?", a: "Oui. Depuis La Villa, la gare d'Annemasse est à moins de 10 min à pied et le Léman Express rejoint le centre de Genève en 9 min — moins de 20 minutes porte-à-porte. En voiture : 15 min. La maison combine ce bon accès avec un cadre verdoyant — 2 000 m² de jardin et une réserve naturelle — à 2 km de la frontière." },
            ],
            en: [
              { q: "What is the monthly rent at La Villa and what does it include?", a: "Rooms at La Villa are CHF 1,380 per month all-inclusive: utilities (water, electricity, heating), fiber internet up to 8 Gb/s, twice-weekly common-area cleaning, streaming subscriptions, pool & garden upkeep, private yoga/fitness classes, bedding included. No add-on fees." },
              { q: "How do I get to Geneva from La Villa in Ville-la-Grand?", a: "Under 20 minutes door-to-door: Annemasse station is less than a 10-minute walk away, then the Léman Express takes you to central Geneva in 9 minutes. By car: 15 min. Alternatively, TPN bus line 61 stops 200 m away. The Moillesulaz Swiss border is 2 km away — 5 min by bike." },
              { q: "What is the minimum lease term at La Villa?", a: "Flexible leases from 1 to 12 months. The default is 12 months for community stability, but shorter stays (1, 3, 6 months) are accepted depending on availability — useful for short assignments or CDI trial periods." },
              { q: "Is there a deposit and any agency fees?", a: "Deposit equivalent to 2 months' rent excluding charges, refunded within 30 days after the move-out inspection. No agency fees. No application fees." },
              { q: "How many rooms are there at La Villa and are they furnished?", a: "10 private rooms, all furnished (bed, ergonomic desk, wardrobe): 6 with a private en-suite bathroom, 4 with access to a shared designer bathroom. Each room has a view of the garden or the nature reserve. Kitchen, living room, gym, sauna and 12×5 m heated pool are shared." },
              { q: "Who can apply to live at La Villa?", a: "Target profile: cross-border workers on CDI, young professionals, expatriates and French tax residents working in Geneva. Selection by application (income proof, motivation, fit with the community). No strict age limit, but most residents are 25-40 years old." },
              { q: "Where is La Villa and how far from Geneva?", a: "La Villa is in Ville-la-Grand, on the French side, under 20 minutes door-to-door from Geneva city center (Léman Express) and 15 minutes by car. It's one of the three La Villa Coliving houses, with a heated outdoor pool and 2,000 m² of garden bordering a nature reserve." },
              { q: "How many residents live at La Villa?", a: "La Villa hosts 10 residents in a coliving house in Ville-la-Grand, near Geneva. It's a human-scale house, designed so connections form naturally, with a private furnished room for each resident and large common areas." },
              { q: "What amenities are there at La Villa?", a: "La Villa, in Ville-la-Grand, has a heated outdoor pool, an infrared sauna, a gym, a games room, a home cinema space, 2,000 m² of garden and designer common areas. Everything is included in the all-inclusive rent from CHF 1,380/month, as in all three La Villa Coliving houses." },
              { q: "Is La Villa well connected to Geneva?", a: "Yes. From La Villa, Annemasse station is less than a 10-minute walk and the Léman Express reaches central Geneva in 9 minutes — under 20 minutes door-to-door. By car: 15 min. The house combines this good access with green surroundings — 2,000 m² of garden and a nature reserve — 2 km from the border." },
            ],
          },
          leloft: {
            fr: [
              { q: "Quel est le loyer mensuel au Loft et que comprend-il ?", a: "Les chambres du Loft sont à 1 380 CHF par mois tout inclus : charges, internet fibre jusqu'à 8 Gb/s, ménage 2 fois par semaine des communs, abonnements streaming, piscine intérieure, jardin, parure de linge. Pas de supplément caché." },
              { q: "Comment se rendre à Genève depuis Le Loft à Ambilly ?", a: "Le Loft est à 5 min à pied de la frontière de Moillesulaz et à 5 minutes à pied du Tram 17 TPG (Lancy-Pont-Rouge ↔ Annemasse). Genève centre : 20 min via Tram 17. Pistes cyclables sécurisées vers Genève centre : 25 min en vélo." },
              { q: "Quelle est la durée minimale du bail au Loft ?", a: "Bail flexible 1 à 12 mois. Le bail par défaut est de 12 mois, mais nous acceptons des séjours plus courts selon disponibilité — pratique pour les frontaliers en mission ou en période d'essai à Genève." },
              { q: "Y a-t-il une caution et des frais d'agence ?", a: "Caution équivalente à 2 mois de loyer hors charges, restituée sous 30 jours après l'état des lieux de sortie. Aucun frais d'agence ni de dossier." },
              { q: "Combien de chambres y a-t-il au Loft et sont-elles meublées ?", a: "7 chambres privatives meublées (lit, bureau, placard), toutes avec salle de bain privative. Espaces communs design : cuisine ouverte, salon, terrasse, piscine intérieure chauffée toute l'année." },
              { q: "Qui peut postuler pour vivre au Loft ?", a: "Profil cible : frontaliers en CDI, jeunes professionnels, expatriés. Sélection sur dossier (justificatif de revenus, motivation, compatibilité avec la communauté). La proximité immédiate de la frontière fait du Loft un favori des frontaliers qui vont au bureau à pied ou en vélo." },
              { q: "Où se trouve Le Loft et à quelle distance de Genève ?", a: "Le Loft se situe à Ambilly, côté France, à 20 minutes du centre de Genève en tram. C'est l'une des trois maisons de coliving de La Villa Coliving, avec une piscine intérieure chauffée toute l'année et un sauna finlandais." },
              { q: "Combien de résidents vivent au Loft ?", a: "Le Loft accueille 7 résidents, ce qui en fait la plus intime des maisons de La Villa Coliving. Située à Ambilly, près de Genève, elle offre une chambre meublée privée à chacun et une ambiance très conviviale à taille réduite." },
              { q: "Quels équipements y a-t-il au Loft ?", a: "Le Loft, à Ambilly, dispose d'une piscine intérieure chauffée utilisable toute l'année, d'un sauna finlandais, d'une salle de sport, d'un espace home cinéma et de chambres spacieuses de 17 à 23 m². Tout est inclus dans le loyer tout compris dès 1 380 CHF/mois." },
              { q: "Peut-on nager toute l'année au Loft ?", a: "Oui. Le Loft, à Ambilly, est la maison de La Villa Coliving dotée d'une piscine intérieure chauffée, accessible toute l'année quelle que soit la saison, ainsi que d'un sauna finlandais. C'est inclus dans ton loyer, comme l'ensemble des services." },
            ],
            en: [
              { q: "What is the monthly rent at Le Loft and what does it include?", a: "Rooms at Le Loft are CHF 1,380 per month all-inclusive: utilities, fiber internet up to 8 Gb/s, twice-weekly common-area cleaning, streaming subscriptions, indoor pool, garden, bedding included. No hidden fees." },
              { q: "How do I get to Geneva from Le Loft in Ambilly?", a: "Le Loft is 5 min walk from the Moillesulaz border and 5 min walk from TPG Tram 17 (Lancy-Pont-Rouge ↔ Annemasse). Central Geneva: 20 min via Tram 17. Secure bike paths to central Geneva: 25 min by bike." },
              { q: "What is the minimum lease term at Le Loft?", a: "Flexible leases from 1 to 12 months. The default is 12 months, but shorter stays are accepted depending on availability — useful for cross-border workers on assignment or CDI trial periods in Geneva." },
              { q: "Is there a deposit and any agency fees?", a: "Deposit equivalent to 2 months' rent excluding charges, refunded within 30 days after the move-out inspection. No agency fees, no application fees." },
              { q: "How many rooms are there at Le Loft and are they furnished?", a: "7 private furnished rooms (bed, desk, wardrobe), all with a private en-suite bathroom. Designer common spaces: open kitchen, living room, terrace, year-round heated indoor pool." },
              { q: "Who can apply to live at Le Loft?", a: "Target profile: cross-border workers on CDI, young professionals, expats. Selection by application (income proof, motivation, fit with community). The immediate proximity to the border makes Le Loft a favorite among cross-border workers who walk or bike to the office." },
              { q: "Where is Le Loft and how far from Geneva?", a: "Le Loft is in Ambilly, on the French side, 20 minutes from Geneva city center by tram. It's one of the three La Villa Coliving houses, with an indoor pool heated year-round and a Finnish sauna." },
              { q: "How many residents live at Le Loft?", a: "Le Loft hosts 7 residents, making it the most intimate of the La Villa Coliving houses. Located in Ambilly, near Geneva, it offers a private furnished room for each resident and a very convivial small-scale atmosphere." },
              { q: "What amenities are there at Le Loft?", a: "Le Loft, in Ambilly, has an indoor pool heated and usable year-round, a Finnish sauna, a gym, a home cinema space and spacious rooms of 17 to 23 m². Everything is included in the all-inclusive rent from CHF 1,380/month." },
              { q: "Can you swim year-round at Le Loft?", a: "Yes. Le Loft, in Ambilly, is the La Villa Coliving house with an indoor heated pool, accessible year-round whatever the season, plus a Finnish sauna. It's included in your rent, like all services." },
            ],
          },
          lelodge: {
            fr: [
              { q: "Quel est le loyer mensuel au Lodge et que comprend-il ?", a: "Les chambres du Lodge sont à partir de 1 380 CHF par mois tout inclus : charges (eau, électricité, chauffage), internet fibre jusqu'à 8 Gb/s, ménage 2 fois par semaine des communs, abonnements streaming, entretien piscine et jardin, cours de yoga / fitness privés, parure de linge fournie, dîner communautaire mensuel. Pas de supplément." },
              { q: "Comment se rendre à Genève depuis Le Lodge à Annemasse ?", a: "Le Lodge est à 9 min à pied de la gare d'Annemasse, terminus du Léman Express. Genève Cornavin est à 15 min en Léman Express direct, sans correspondance. La frontière suisse est à 5 min en voiture. Aéroport de Genève : 30 min." },
              { q: "Quelle est la durée minimale du bail au Lodge ?", a: "Bail flexible 1 à 12 mois. Le bail par défaut est de 12 mois pour la stabilité de la communauté, mais nous acceptons des séjours plus courts (1, 3, 6 mois) selon disponibilité." },
              { q: "Y a-t-il une caution et des frais d'agence ?", a: "Caution équivalente à 2 mois de loyer hors charges, restituée sous 30 jours après l'état des lieux. Aucun frais d'agence ni de dossier." },
              { q: "Combien de chambres y a-t-il au Lodge et sont-elles meublées ?", a: "12 chambres privatives, toutes meublées (lit, bureau ergonomique, placard sur mesure, salle de bain privative). Surface 17 à 19 m² par chambre. Le Lodge a ouvert en janvier 2026, tout est neuf." },
              { q: "Qu'est-ce qui rend Le Lodge unique parmi vos 3 maisons ?", a: "Le Lodge est notre maison la plus récente (ouverte janvier 2026) et la plus grande (500 m² sur 1 500 m²). Elle dispose de 4 bâtiments : la résidence principale, un chalet fitness dédié avec sauna finlandais, un pool house avec cuisine d'été complète et une zone de rangement de 130 m². DPE B (performance énergétique). C'est aussi la plus proche de la gare d'Annemasse pour le Léman Express." },
              { q: "Où se trouve Le Lodge et à quelle distance de Genève ?", a: "Le Lodge se situe à Annemasse, côté France, à 20 minutes du centre de Genève en train CEVA. C'est la plus grande des trois maisons de coliving de La Villa Coliving, avec une piscine extérieure et un pool house, un chalet fitness complet et un sauna." },
              { q: "Combien de résidents vivent au Lodge ?", a: "Le Lodge accueille 12 résidents, ce qui en fait la plus grande maison de La Villa Coliving. Située à Annemasse, près de Genève, elle conserve une taille humaine tout en offrant les espaces les plus généreux : espace home cinéma, piscine, pool house / salle de jeu, chalet fitness et grands espaces communs." },
              { q: "Quels équipements y a-t-il au Lodge ?", a: "Le Lodge, à Annemasse, dispose d'une piscine avec pool house/salle de jeu, d'un chalet fitness complet avec grand sauna finlandais, d'une salle de sport, d'un jeu d'arcade et de larges espaces communs. Tout est inclus dans le loyer tout compris dès 1 380 CHF/mois, comme dans les trois maisons de La Villa Coliving." },
              { q: "Y a-t-il du coliving à Annemasse ?", a: "Oui. Le Lodge est la maison de coliving de La Villa Coliving à Annemasse : 12 résidents, chambres meublées de 17 à 23 m², pool house, chalet fitness et sauna, le tout à 20 minutes du centre de Genève en CEVA. Tout inclus dès 1 380 CHF/mois." },
            ],
            en: [
              { q: "What is the monthly rent at Le Lodge and what does it include?", a: "Rooms at Le Lodge start at CHF 1,380 per month all-inclusive: utilities (water, electricity, heating), fiber internet up to 8 Gb/s, twice-weekly common-area cleaning, streaming subscriptions, pool & garden upkeep, private yoga/fitness classes, bedding included, monthly community dinner. No add-on fees." },
              { q: "How do I get to Geneva from Le Lodge in Annemasse?", a: "Le Lodge is a 9-minute walk from Annemasse station, the Léman Express terminus. Geneva Cornavin is 15 min via direct Léman Express, no transfer. Swiss border: 5 min by car. Geneva Airport: 30 min." },
              { q: "What is the minimum lease term at Le Lodge?", a: "Flexible leases from 1 to 12 months. The default is 12 months for community stability, but shorter stays (1, 3, 6 months) are accepted depending on availability." },
              { q: "Is there a deposit and any agency fees?", a: "Deposit equivalent to 2 months' rent excluding charges, refunded within 30 days after the move-out inspection. No agency fees, no application fees." },
              { q: "How many rooms are there at Le Lodge and are they furnished?", a: "12 private rooms, all furnished (bed, ergonomic desk, custom wardrobe, en-suite bathroom). 17 to 19 m² per room. Le Lodge opened in January 2026 — everything is new." },
              { q: "What makes Le Lodge unique among your 3 houses?", a: "Le Lodge is our newest (opened January 2026) and largest house (500 m² on 1,500 m²). It has 4 buildings: the main residence, a dedicated fitness chalet with Finnish sauna, a pool house with full outdoor kitchen, and a 130 m² storage area. DPE B energy rating. It's also the closest to Annemasse station for the Léman Express." },
              { q: "Where is Le Lodge and how far from Geneva?", a: "Le Lodge is in Annemasse, on the French side, 20 minutes from Geneva city center by CEVA train. It's the largest of the three La Villa Coliving houses, with an outdoor pool and a pool house, a full fitness chalet and a sauna." },
              { q: "How many residents live at Le Lodge?", a: "Le Lodge hosts 12 residents, making it the largest La Villa Coliving house. Located in Annemasse, near Geneva, it keeps a human scale while offering the most generous spaces: home cinema, pool, pool house / games room, fitness chalet and large common areas." },
              { q: "What amenities are there at Le Lodge?", a: "Le Lodge, in Annemasse, has a pool with a pool house/games room, a full fitness chalet with a large Finnish sauna, a gym, an arcade game and large common areas. Everything is included in the all-inclusive rent from CHF 1,380/month, as in all three La Villa Coliving houses." },
              { q: "Is there coliving in Annemasse?", a: "Yes. Le Lodge is the La Villa Coliving coliving house in Annemasse: 12 residents, furnished rooms of 17 to 23 m², pool house, fitness chalet and sauna, all 20 minutes from Geneva city center by CEVA. All inclusive from CHF 1,380/month." },
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
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <section className="section-padding relative bg-[#FAF9F6]">
              <div className="container-custom max-w-3xl">
                <h2
                  className="text-3xl md:text-4xl mb-8 text-[#1C1917]"
                  style={{ fontFamily: "DM Serif Display, serif" }}
                >
                  {language === "en" ? "Frequently asked questions" : "Questions fréquentes"}
                </h2>
                <dl className="space-y-6">
                  {faqs.map(({ q, a }, i) => (
                    <div key={i} className="card-ultra p-6">
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
      <section className="section-padding relative bg-white">
        <div className="container-custom">
          <h2
            className="text-3xl md:text-4xl mb-8 text-[#1C1917]"
            style={{ fontFamily: "DM Serif Display, serif" }}
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
                          style={{ fontFamily: "DM Serif Display, serif" }}
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
            style={{ fontFamily: "DM Serif Display, serif" }}
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
              to={language === "en" ? "/en/candidature" : "/candidature"}
              onClick={() => trackCta("house_footer")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1C1917] font-bold rounded-full hover:bg-gray-100 transition-colors"
            >
              {t.houseDetail.apply}
              <ArrowRight className="w-5 h-5" />
            </LocalizedLink>
            <LocalizedLink
              to={language === "en" ? "/en/colocation-geneve" : "/colocation-geneve"}
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
          to={language === "en" ? "/en/candidature" : "/candidature"}
          onClick={() => trackCta("sticky_mobile")}
          className="flex items-center justify-center gap-2 w-full bg-[#D4A574] text-[#1C1917] py-3 rounded-lg text-sm font-semibold"
        >
          {language === "en" ? "Apply — reply within 48h" : "Candidater — réponse sous 48h"}
          <ArrowRight className="w-4 h-4" />
        </LocalizedLink>
      </div>
    </main>
  );
}
