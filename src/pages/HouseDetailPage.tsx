import { useLocation, Link } from "react-router-dom";
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
      ? "La Villa is our flagship coliving space, designed from the ground up for modern community living. Nestled on a 2,000 m² estate bordering a nature reserve, this 370 m² home offers the perfect balance between privacy and connection. The heated 12×5m pool, 5-seat sauna, and fully equipped gym make it feel like a premium retreat. Wake up to birdsong, work from quiet spaces, unwind by the pool, and build lasting friendships with your housemates. Every detail has been thoughtfully considered to create an environment where you can thrive — personally and professionally."
      : "La Villa est notre maison phare, conçue de A à Z pour la vie communautaire moderne. Nichée sur un domaine de 2 000 m² bordant une réserve naturelle, cette maison de 370 m² offre l'équilibre parfait entre intimité et convivialité. La piscine chauffée de 12×5 m, le sauna 5 places et la salle de sport équipée en font un véritable lieu de villégiature. Réveillez-vous au chant des oiseaux, travaillez dans des espaces calmes, détendez-vous au bord de la piscine et tissez des amitiés durables. Chaque détail a été pensé pour créer un environnement où vous pouvez vous épanouir.",
    image: "/images/la villa jardin.webp",
    gallery: [
      "/images/la villa/amenities/La Villa-109.webp",
      "/images/la villa/amenities/La Villa-42.webp",
      "/images/la villa/amenities/La Villa-37.webp",
      "/images/la villa/amenities/La Villa-38.webp",
      "/images/la villa/amenities/La Villa-11.webp",
      "/images/la villa/amenities/la villa yoga.webp",
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
      "8 Gbps fiber internet",
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
      "Internet fibre 8 Gbps",
      "Potager & terrasse yoga extérieure",
      "Double cuisine équipée",
    ],
    services: isEn ? [
      "Weekly private yoga & fitness classes",
      "Monthly pizza party",
      "Monthly meal basket delivery",
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
      "9 min walk to Annemasse station (Léman Express direct to Geneva)",
      "15 min to Geneva Eaux-Vives by Léman Express",
      "Supermarkets within 5 min walk",
      "Nature reserve at your doorstep",
      "Local cafes and restaurants nearby",
      "Bike paths to Geneva",
    ] : [
      "Gare d'Annemasse à 9 min à pied (Léman Express direct Genève)",
      "15 min de Genève Eaux-Vives en Léman Express",
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
    available: false,
    badge: "Complet",
    badgeColor: "#78716C",
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
      "/images/le loft/exterior/le loft jardin.webp",
      "/images/le loft/interior/Le loft salon.webp",
      "/images/le loft/exterior/le loft glamour.webp",
      "/images/le loft/common areas/la villa coliving le loft-67.webp",
      "/images/le loft/amenities/la villa coliving le loft-2.webp",
      "/images/le loft/amenities/la villa coliving le loft-112.webp",
      "/images/le loft/amenities/la villa coliving le loft-93.webp",
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
      "8 Gbps fiber internet",
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
      "Internet fibre 8 Gbps",
      "Cuisine design",
      "Babyfoot",
    ],
    services: isEn ? [
      "Weekly private yoga & fitness classes",
      "Monthly pizza party",
      "Monthly meal basket delivery",
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
    available: true,
    badge: isEn ? "1 room available" : "1 chambre disponible",
    badgeColor: "#D4A574",
  },
  lelodge: {
    name: "Le Lodge",
    location: "Annemasse, Grand Genève",
    description: isEn
      ? "Our newest and largest home, open since January 2026. 500 m² on 1,500 m², pool house, full fitness chalet with sauna & arcade."
      : "Notre maison la plus récente et la plus grande, ouverte depuis janvier 2026. 500 m² sur 1 500 m², pool house, chalet fitness complet avec sauna et jeu d'arcade.",
    longDescription: isEn
      ? "Le Lodge is our newest coliving in Annemasse, opened January 2026 in the quiet Romagny district. Across 500 m² spread over 4 buildings on 1,500 m² of gardens, 12 residents share a dedicated fitness chalet with Finnish sauna, a pool house with full outdoor kitchen, and a main residence designed for both privacy and community. Each furnished room has its own en-suite bathroom, ergonomic desk, and high-speed fiber. Annemasse station is 5 minutes by car — Léman Express direct to Geneva Cornavin in 15 minutes, no transfer. Ideal for cross-border workers commuting daily, French CDI tax residents seeking the Swiss salary / French cost-of-living arbitrage, and young professionals who value an actual community over a faceless apartment block. All-inclusive rent (utilities, fiber, weekly common cleaning, private fitness classes) starts at CHF 1,475/month. DPE B energy rating, electric bike charging, 130 m² of attic storage, no agency fees, flexible 1-12 month leases."
      : "Le Lodge est notre coliving le plus récent à Annemasse, ouvert en janvier 2026 dans le quartier résidentiel calme de Romagny. Sur 500 m² répartis sur 4 bâtiments au cœur de 1 500 m² de jardins, 12 colocataires partagent un chalet fitness dédié avec sauna finlandais, un pool house avec cuisine d'été complète et une résidence principale conçue pour combiner intimité et vie communautaire. Chaque chambre meublée dispose de sa salle de bain privative, d'un bureau ergonomique et de la fibre. La gare d'Annemasse est à 5 minutes en voiture — Léman Express direct jusqu'à Genève Cornavin en 15 minutes, sans correspondance. Idéal pour les frontaliers qui font le trajet quotidien, les résidents fiscaux français en CDI qui jouent l'arbitrage salaire suisse / coût de la vie en France, et les jeunes pros qui valorisent une vraie communauté plutôt qu'un immeuble anonyme. Loyer tout inclus (charges, fibre, ménage commun hebdomadaire, cours de fitness privés) à partir de 1 475 CHF/mois. DPE B, bornes de recharge vélo électrique, 130 m² de grenier de stockage, sans frais d'agence, baux flexibles 1-12 mois.",
    image: "/images/le lodge/exterior/la villa coliving le lodge-14.webp",
    gallery: [
      "/images/le lodge/exterior/le lodge piscine.webp",
      "/images/le lodge/interior/la villa coliving le lodge-85.webp",
      "/images/le lodge/common areas/la villa coliving le lodge-40.webp",
      "/images/le lodge/common areas/la villa coliving le lodge-23.webp",
      "/images/le lodge/amenities/la villa coliving le lodge-122.webp",
      "/images/le lodge/amenities/la villa coliving le lodge-56.webp",
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
      "State-of-the-art gym equipment",
      "Pool house with full outdoor kitchen, BBQ XXL",
      "Gaming & entertainment room with arcade machine",
      "Shuffleboard & foosball",
      "Beautiful gardens & expansive outdoor spaces",
      "Parking included + 2 electric bike charging stations",
      "8 Gbps fiber internet",
      "130 m² attic storage",
      "DPE B energy rating",
    ] : [
      "Piscine extérieure 12×5 m (mi-avril à fin septembre)",
      "Chalet fitness dédié avec sauna (5 places)",
      "Salle de sport très complète",
      "Pool house avec cuisine d'été complète, BBQ XXL",
      "Salle de jeux & divertissement avec jeu d'arcade",
      "Jeux de palets & babyfoot",
      "Grands jardins & vastes espaces extérieurs",
      "Parking inclus + 2 bornes recharge vélo électrique",
      "Internet fibre 8 Gbps",
      "Grenier de stockage 130 m²",
      "DPE B (performance énergétique)",
    ],
    services: isEn ? [
      "Weekly private yoga & fitness classes",
      "Monthly pizza party",
      "Monthly meal basket delivery",
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
      "8 min walk to Annemasse train station",
      "15-25 min to Geneva center",
      "Annemasse city center at your doorstep",
      "Shopping center 5 min away",
      "Restaurants & bars within walking distance",
    ] : [
      "Tram Place de l'Étoile à 1 min à pied",
      "Gare d'Annemasse à 8 min à pied",
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
    available: false,
    badge: "Complet",
    badgeColor: "#78716C",
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

  if (!house) {
    return (
      <main className="pt-32 pb-20 bg-white">
        <div className="container-custom text-center">
          <h1 className="text-4xl mb-4 text-[#1C1917]">House not found</h1>
          <Link
            to="/nos-maisons"
            className="text-[#D4A574] hover:underline font-bold"
          >
            View all houses
          </Link>
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
            lavilla: { en: "La Villa — 10 rooms in Ville-la-Grand", fr: "La Villa — 10 chambres à Ville-la-Grand" },
            leloft:  { en: "Le Loft — 7 rooms in Ambilly",          fr: "Le Loft — 7 chambres à Ambilly" },
            lelodge: { en: "Le Lodge — 12 rooms in Annemasse",       fr: "Le Lodge — 12 chambres à Annemasse" },
          };
          return titles[id]?.[language === "en" ? "en" : "fr"]
            ?? `${house.name} — ${house.location}`;
        })()}
        description={(() => {
          // Metas ≤ 155c, factuelles, chiffrées. Pas de "${house.description}" qui dépasse 200c.
          const descs: Record<string, { en: string; fr: string }> = {
            lavilla: {
              en: "La Villa: 10 premium rooms in Ville-la-Grand. Heated pool, sauna, gym, fiber. All-inclusive from CHF 1,380/month. 15 min from Geneva.",
              fr: "La Villa : 10 chambres premium à Ville-la-Grand. Piscine chauffée, sauna, gym, fibre. Tout inclus dès 1 380 CHF/mois. À 15 min de Genève.",
            },
            leloft: {
              en: "Le Loft: 7 premium rooms in Ambilly. Indoor pool, urban design, Tram 17 to Geneva. All-inclusive from CHF 1,380/month.",
              fr: "Le Loft : 7 chambres premium à Ambilly. Piscine intérieure, design urbain, Tram 17 vers Genève. Tout inclus dès 1 380 CHF/mois.",
            },
            lelodge: {
              en: "Le Lodge: 12 rooms in Annemasse, opened 2026. Pool, gym, sauna, Léman Express station 5 min. All-inclusive from CHF 1,380/month.",
              fr: "Le Lodge : 12 chambres premium à Annemasse, ouvertes en 2026. Piscine, gym, sauna, gare Léman Express à 5 min. Tout inclus dès 1 380 CHF/mois.",
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
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "47",
          "bestRating": "5"
        },
        "sameAs": [
          "https://www.facebook.com/lavillacoliving",
          "https://www.instagram.com/lavillacoliving"
        ]
      }) }} />
      {/* Hero Gallery */}
      <section className="relative pt-20">
        <Carousel className="w-full">
          <CarouselContent>
            {[house.image, ...house.gallery].map((img, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[50vh] md:h-[70vh]">
                  <img
                    src={img}
                    alt={`${house.name} coliving ${house.location} — ${language === "en" ? "premium colocation near Geneva" : "colocation premium près de Genève"} (${index + 1})`}
                    className="w-full h-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-transparent to-transparent" />
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
              {(() => {
                // DPE badge — couleur officielle ADEME selon la lettre (A vert foncé → G rouge).
                // Filled style (fond coloré + texte) plutôt que outline, pour matcher le diagramme DPE standard.
                const DPE_COLORS: Record<string, { bg: string; text: string }> = {
                  A: { bg: "#319630", text: "white" },     // vert foncé
                  B: { bg: "#33A357", text: "white" },     // vert moyen
                  C: { bg: "#9CCB37", text: "#1C1917" },   // jaune-vert (texte foncé)
                  D: { bg: "#FFEB1B", text: "#1C1917" },   // jaune (texte foncé)
                  E: { bg: "#F39C2A", text: "white" },     // orange clair
                  F: { bg: "#E66A26", text: "white" },     // orange foncé
                  G: { bg: "#D7191C", text: "white" },     // rouge
                };
                const letter = house.specs.dpe?.toUpperCase() ?? "";
                const c = DPE_COLORS[letter] ?? { bg: "#D4A574", text: "white" };
                return (
                  <Badge
                    variant="default"
                    className="font-bold border-0"
                    style={{ backgroundColor: c.bg, color: c.text }}
                  >
                    <Zap size={14} className="mr-1" style={{ color: c.text }} />
                    DPE {house.specs.dpe}
                  </Badge>
                );
              })()}
            </div>
            <h1
              className="text-5xl md:text-7xl mb-4 text-[#1C1917]"
              style={{ fontFamily: "DM Serif Display, serif" }}
            >
              {(() => {
                // SEO H1 par maison : capture le keyword principal de la page
                // (le `house.name` seul = trop maigre pour Google, audit P0-1).
                const h1: Record<string, { en: string; fr: string }> = {
                  lavilla: {
                    en: "La Villa — Coliving 10 rooms in Ville-la-Grand",
                    fr: "La Villa — Coliving 10 chambres à Ville-la-Grand",
                  },
                  leloft: {
                    en: "Le Loft — Coliving 7 rooms in Ambilly",
                    fr: "Le Loft — Coliving 7 chambres à Ambilly",
                  },
                  lelodge: {
                    en: "Le Lodge — Coliving 12 rooms in Annemasse",
                    fr: "Le Lodge — Coliving 12 chambres à Annemasse",
                  },
                };
                return h1[id]?.[language === "en" ? "en" : "fr"] ?? house.name;
              })()}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-[#78716C] font-medium">
              <span className="flex items-center gap-2">
                <MapPin size={18} className="text-[#D4A574]" />
                {house.location}
              </span>
              <span className="flex items-center gap-2">
                <Users size={18} className="text-[#D4A574]" />
                {house.capacity}
              </span>
              <span className="flex items-center gap-2">
                <Maximize size={18} className="text-[#78716C]" />
                {house.specs.size}
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
                  <p className="text-[#78716C] mb-6 font-medium">
                    {t.houseDetail.perMonth}
                  </p>

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
                    <Link
                      to="/candidature"
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1C1917] text-white font-semibold rounded-xl hover:bg-[#D4A574] transition-colors"
                    >
                      {house.available
                        ? t.houseDetail.apply
                        : language === "en" ? "Join waitlist" : "Liste d'attente"}
                      <ArrowRight size={18} />
                    </Link>
                    <Link
                      to="/tarifs"
                      className="w-full text-center text-sm text-[#78716C] hover:text-[#1C1917] hover:underline transition-colors mt-1"
                    >
                      {t.houseDetail.checkRates}
                    </Link>
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
                      <span className="text-sm">{language === "en" ? "8 Gbps Fiber" : "Fibre 8 Gbps"}</span>
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
              intro: "La Villa est située à Ville-la-Grand, commune résidentielle de l'agglomération d'Annemasse, à 6 km du centre de Genève. La frontière suisse est à 2 minutes en voiture.",
              address: "34 rue du Foron, 74100 Ville-la-Grand, Haute-Savoie, France",
              transport: [
                "Genève Cornavin : 25 min en transport (bus + Léman Express depuis Annemasse), 15 min en voiture",
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
              intro: "La Villa is located in Ville-la-Grand, a residential commune within the Annemasse agglomeration, 6 km from central Geneva. The Swiss border is a 2-minute drive.",
              address: "34 rue du Foron, 74100 Ville-la-Grand, Haute-Savoie, France",
              transport: [
                "Geneva Cornavin: 25 min by transit (bus + Léman Express from Annemasse), 15 min by car",
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
              intro: "Le Loft est situé à Ambilly, la commune la plus proche de la frontière suisse dans l'agglomération d'Annemasse. La frontière de Moillesulaz est à 5 minutes à pied.",
              address: "1 rue des Marronniers, 74100 Ambilly, Haute-Savoie, France",
              transport: [
                "Genève Cornavin : 20 min via Léman Express depuis Annemasse Gare (5 min en bus depuis Le Loft)",
                "Tram 17 TPG (Lancy-Pont-Rouge ↔ Annemasse) : terminus à 10 min à pied",
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
              intro: "Le Loft is located in Ambilly, the closest commune to the Swiss border within the Annemasse agglomeration. The Moillesulaz border crossing is a 5-minute walk away.",
              address: "1 rue des Marronniers, 74100 Ambilly, Haute-Savoie, France",
              transport: [
                "Geneva Cornavin: 20 min via Léman Express from Annemasse Gare (5-min bus from Le Loft)",
                "Tram 17 TPG (Lancy-Pont-Rouge ↔ Annemasse): terminus 10 min on foot",
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
              intro: "Le Lodge est situé à Annemasse, dans le quartier résidentiel calme de Romagny. La gare d'Annemasse — terminus du Léman Express vers Genève Cornavin — est à 5 minutes en voiture.",
              address: "8 rue de Romagny, 74100 Annemasse, Haute-Savoie, France",
              transport: [
                "Genève Cornavin : 15 min en Léman Express direct depuis la gare d'Annemasse, sans correspondance",
                "Gare d'Annemasse : 5 min en voiture, 15 min à pied, ligne de bus 7 directe",
                "Tram 17 TPG (Lancy-Pont-Rouge ↔ Annemasse) : 10 min en voiture",
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
              intro: "Le Lodge is located in Annemasse, in the quiet residential Romagny district. Annemasse station — terminus of the Léman Express to Geneva Cornavin — is a 5-minute drive away.",
              address: "8 rue de Romagny, 74100 Annemasse, Haute-Savoie, France",
              transport: [
                "Geneva Cornavin: 15 min direct via Léman Express from Annemasse station, no transfer",
                "Annemasse station: 5 min by car, 15 min on foot, direct bus line 7",
                "Tram 17 TPG (Lancy-Pont-Rouge ↔ Annemasse): 10 min by car",
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
              { q: "Quel est le loyer mensuel à La Villa et que comprend-il ?", a: "Les chambres de La Villa sont à 1 380 CHF par mois tout inclus : charges (eau, électricité, chauffage), internet fibre 8 Gbps, ménage hebdomadaire des espaces communs, abonnements streaming, entretien piscine et jardin, cours de yoga / fitness privés, parure de linge fournie. Aucun supplément." },
              { q: "Comment se rendre à Genève depuis La Villa à Ville-la-Grand ?", a: "Plusieurs options : 15 min en voiture jusqu'au centre de Genève, 25 min en transport en commun via le bus TPN ligne 61 (arrêt à 200 m) puis correspondance Léman Express depuis la gare d'Annemasse. La frontière suisse de Moillesulaz est à 2 km — 5 min à vélo." },
              { q: "Quelle est la durée minimale du bail à La Villa ?", a: "Bail flexible 1 à 12 mois. Le bail par défaut est de 12 mois pour la stabilité de la communauté, mais nous acceptons des séjours plus courts (1, 3, 6 mois) selon disponibilité — utile pour les missions courtes ou les périodes d'essai en CDI." },
              { q: "Y a-t-il une caution et des frais d'agence ?", a: "Caution équivalente à 2 mois de loyer, restituée sous 30 jours après l'état des lieux de sortie. Aucun frais d'agence. Aucun frais de dossier." },
              { q: "Combien de chambres y a-t-il à La Villa et sont-elles meublées ?", a: "10 chambres privatives, toutes meublées (lit, bureau ergonomique, placard, salle de bain). Chaque chambre offre une vue sur le jardin ou la réserve naturelle. Cuisine, salon, salle de sport, sauna et piscine chauffée 12×5 m sont partagés." },
              { q: "Qui peut postuler pour vivre à La Villa ?", a: "Profil cible : frontaliers en CDI, jeunes professionnels, expatriés et résidents fiscaux français travaillant à Genève. Sélection sur dossier (justificatif de revenus, motivation, compatibilité avec la communauté). Pas de critère d'âge strict, mais la majorité des résidents ont entre 25 et 40 ans." },
            ],
            en: [
              { q: "What is the monthly rent at La Villa and what does it include?", a: "Rooms at La Villa are CHF 1,380 per month all-inclusive: utilities (water, electricity, heating), 8 Gbps fiber internet, weekly common-area cleaning, streaming subscriptions, pool & garden upkeep, private yoga/fitness classes, bedding included. No add-on fees." },
              { q: "How do I get to Geneva from La Villa in Ville-la-Grand?", a: "Several options: 15 min by car to central Geneva, 25 min by public transit via TPN bus line 61 (stop 200 m away) plus Léman Express from Annemasse station. The Moillesulaz Swiss border is 2 km away — 5 min by bike." },
              { q: "What is the minimum lease term at La Villa?", a: "Flexible leases from 1 to 12 months. The default is 12 months for community stability, but shorter stays (1, 3, 6 months) are accepted depending on availability — useful for short assignments or CDI trial periods." },
              { q: "Is there a deposit and any agency fees?", a: "Deposit equivalent to 2 months' rent, refunded within 30 days after the move-out inspection. No agency fees. No application fees." },
              { q: "How many rooms are there at La Villa and are they furnished?", a: "10 private rooms, all furnished (bed, ergonomic desk, wardrobe, en-suite bathroom). Each room has a view of the garden or the nature reserve. Kitchen, living room, gym, sauna and 12×5 m heated pool are shared." },
              { q: "Who can apply to live at La Villa?", a: "Target profile: cross-border workers on CDI, young professionals, expatriates and French tax residents working in Geneva. Selection by application (income proof, motivation, fit with the community). No strict age limit, but most residents are 25-40 years old." },
            ],
          },
          leloft: {
            fr: [
              { q: "Quel est le loyer mensuel au Loft et que comprend-il ?", a: "Les chambres du Loft sont à 1 380 CHF par mois tout inclus : charges, internet fibre 8 Gbps, ménage hebdo des communs, abonnements streaming, piscine intérieure, jardin, parure de linge. Pas de supplément caché." },
              { q: "Comment se rendre à Genève depuis Le Loft à Ambilly ?", a: "Le Loft est à 5 min à pied de la frontière de Moillesulaz et à 10 min à pied du terminus du Tram 17 TPG (Lancy-Pont-Rouge ↔ Annemasse). Genève Cornavin est à 20 min via Léman Express depuis la gare d'Annemasse (5 min en bus). Pistes cyclables sécurisées vers Genève centre : 25 min en vélo." },
              { q: "Quelle est la durée minimale du bail au Loft ?", a: "Bail flexible 1 à 12 mois. Le bail par défaut est de 12 mois, mais nous acceptons des séjours plus courts selon disponibilité — pratique pour les frontaliers en mission ou en période d'essai à Genève." },
              { q: "Y a-t-il une caution et des frais d'agence ?", a: "Caution équivalente à 2 mois de loyer, restituée sous 30 jours après l'état des lieux de sortie. Aucun frais d'agence ni de dossier." },
              { q: "Combien de chambres y a-t-il au Loft et sont-elles meublées ?", a: "7 chambres privatives meublées (lit, bureau, placard, certaines avec salle de bain privative). Espaces communs design : cuisine ouverte, salon, terrasse, piscine intérieure chauffée toute l'année." },
              { q: "Qui peut postuler pour vivre au Loft ?", a: "Profil cible : frontaliers en CDI, jeunes professionnels, expatriés. Sélection sur dossier (justificatif de revenus, motivation, compatibilité avec la communauté). La proximité immédiate de la frontière fait du Loft un favori des frontaliers qui vont au bureau à pied ou en vélo." },
            ],
            en: [
              { q: "What is the monthly rent at Le Loft and what does it include?", a: "Rooms at Le Loft are CHF 1,380 per month all-inclusive: utilities, 8 Gbps fiber internet, weekly common-area cleaning, streaming subscriptions, indoor pool, garden, bedding included. No hidden fees." },
              { q: "How do I get to Geneva from Le Loft in Ambilly?", a: "Le Loft is 5 min walk from the Moillesulaz border and 10 min walk from the TPG Tram 17 terminus (Lancy-Pont-Rouge ↔ Annemasse). Geneva Cornavin is 20 min via Léman Express from Annemasse station (5 min bus). Secure bike paths to central Geneva: 25 min by bike." },
              { q: "What is the minimum lease term at Le Loft?", a: "Flexible leases from 1 to 12 months. The default is 12 months, but shorter stays are accepted depending on availability — useful for cross-border workers on assignment or CDI trial periods in Geneva." },
              { q: "Is there a deposit and any agency fees?", a: "Deposit equivalent to 2 months' rent, refunded within 30 days after the move-out inspection. No agency fees, no application fees." },
              { q: "How many rooms are there at Le Loft and are they furnished?", a: "7 private furnished rooms (bed, desk, wardrobe, some with en-suite bathroom). Designer common spaces: open kitchen, living room, terrace, year-round heated indoor pool." },
              { q: "Who can apply to live at Le Loft?", a: "Target profile: cross-border workers on CDI, young professionals, expats. Selection by application (income proof, motivation, fit with community). The immediate proximity to the border makes Le Loft a favorite among cross-border workers who walk or bike to the office." },
            ],
          },
          lelodge: {
            fr: [
              { q: "Quel est le loyer mensuel au Lodge et que comprend-il ?", a: "Les chambres du Lodge sont à partir de 1 475 CHF par mois tout inclus : charges (eau, électricité, chauffage), internet fibre 8 Gbps, ménage 2 fois par semaine des communs, abonnements streaming, entretien piscine et jardin, cours de yoga / fitness privés, parure de linge fournie, panier repas mensuel. Pas de supplément." },
              { q: "Comment se rendre à Genève depuis Le Lodge à Annemasse ?", a: "Le Lodge est à 5 min en voiture (ou 15 min à pied) de la gare d'Annemasse, terminus du Léman Express. Genève Cornavin est à 15 min en Léman Express direct, sans correspondance. La frontière suisse est à 5 min en voiture. Aéroport de Genève : 30 min." },
              { q: "Quelle est la durée minimale du bail au Lodge ?", a: "Bail flexible 1 à 12 mois. Le bail par défaut est de 12 mois pour la stabilité de la communauté, mais nous acceptons des séjours plus courts (1, 3, 6 mois) selon disponibilité." },
              { q: "Y a-t-il une caution et des frais d'agence ?", a: "Caution équivalente à 2 mois de loyer, restituée sous 30 jours après l'état des lieux. Aucun frais d'agence ni de dossier." },
              { q: "Combien de chambres y a-t-il au Lodge et sont-elles meublées ?", a: "12 chambres privatives, toutes meublées (lit, bureau ergonomique, placard sur mesure, salle de bain privative). Surface 17 à 19 m² par chambre. Le Lodge a ouvert en janvier 2026, tout est neuf." },
              { q: "Qu'est-ce qui rend Le Lodge unique parmi vos 3 maisons ?", a: "Le Lodge est notre maison la plus récente (ouverte janvier 2026) et la plus grande (500 m² sur 1 500 m²). Elle dispose de 4 bâtiments : la résidence principale, un chalet fitness dédié avec sauna finlandais, un pool house avec cuisine d'été complète et une zone de rangement de 130 m². DPE B (performance énergétique). C'est aussi la plus proche de la gare d'Annemasse pour le Léman Express." },
            ],
            en: [
              { q: "What is the monthly rent at Le Lodge and what does it include?", a: "Rooms at Le Lodge start at CHF 1,475 per month all-inclusive: utilities (water, electricity, heating), 8 Gbps fiber internet, twice-weekly common-area cleaning, streaming subscriptions, pool & garden upkeep, private yoga/fitness classes, bedding included, monthly meal basket. No add-on fees." },
              { q: "How do I get to Geneva from Le Lodge in Annemasse?", a: "Le Lodge is 5 min by car (or 15 min on foot) from Annemasse station, the Léman Express terminus. Geneva Cornavin is 15 min via direct Léman Express, no transfer. Swiss border: 5 min by car. Geneva Airport: 30 min." },
              { q: "What is the minimum lease term at Le Lodge?", a: "Flexible leases from 1 to 12 months. The default is 12 months for community stability, but shorter stays (1, 3, 6 months) are accepted depending on availability." },
              { q: "Is there a deposit and any agency fees?", a: "Deposit equivalent to 2 months' rent, refunded within 30 days after the move-out inspection. No agency fees, no application fees." },
              { q: "How many rooms are there at Le Lodge and are they furnished?", a: "12 private rooms, all furnished (bed, ergonomic desk, custom wardrobe, en-suite bathroom). 17 to 19 m² per room. Le Lodge opened in January 2026 — everything is new." },
              { q: "What makes Le Lodge unique among your 3 houses?", a: "Le Lodge is our newest (opened January 2026) and largest house (500 m² on 1,500 m²). It has 4 buildings: the main residence, a dedicated fitness chalet with Finnish sauna, a pool house with full outdoor kitchen, and a 130 m² storage area. DPE B energy rating. It's also the closest to Annemasse station for the Léman Express." },
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
              : `Prêt à faire de ${house.name} votre chez-vous ?`}
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto font-bold mb-8">
            {language === "en"
              ? "Join our curated community and experience the best of coliving near Geneva."
              : "Rejoignez notre communauté sélectionnée et vivez le meilleur du coliving près de Genève."}
          </p>
          <Link
            to="/candidature"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1C1917] font-bold rounded-full hover:bg-gray-100 transition-colors"
          >
            {t.houseDetail.apply}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
