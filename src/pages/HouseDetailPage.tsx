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
import { Button } from "@/components/ui/button";
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

const housesData: Record<string, HouseData> = {
  lavilla: {
    name: "La Villa",
    location: "Ville-la-Grand, Grand Genève",
    description:
      "A beautiful house 100% designed and fitted for community living. Settled on a 2000sqm property adjoining a nature reserve, La Villa offers the perfect blend of nature and comfort.",
    longDescription:
      "La Villa is our flagship coliving space, designed from the ground up for modern community living. Nestled on a 2000m² estate bordering a nature reserve, this 400m² home offers the perfect balance between privacy and connection. Wake up to birdsong, work from our dedicated coworking spaces, unwind by the heated pool, and build lasting friendships with your housemates. Every detail has been thoughtfully considered to create an environment where you can thrive both personally and professionally.",
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
    capacity: "10 colivers",
    price: "1,380",
    specs: {
      size: "400 m²",
      plot: "2,000 m²",
      dpe: "D",
    },
    features: [
      "12x5m Heated Swimming Pool",
      "5-seat Sauna",
      "Equipped Gym",
      "TV & Video Games Room (PS5, PS4 & Switch)",
      "XXL Barbecue & Multiple Terraces",
      "Volleyball Field",
      "3 Parking Spaces",
      "Laundry & Storage Room",
      "High Speed Fiber Internet",
      "Vegetable Garden",
      "Outdoor Yoga Deck",
    ],
    services: [
      "Weekly private yoga/fitness classes",
      "Monthly basic supplies delivery",
      "Monthly Community Dinner",
      "Regular Community Events & Workshops",
      "WhatsApp Hotline Support",
      "Professional housekeeping",
      "Garden & pool maintenance",
    ],
    rooms: [
      {
        type: "Room with Private Bathroom",
        price: "1,380 CHF",
        description:
          "Your private sanctuary with double EMMA bed, ergonomic desk, spacious closet, and private bathroom. Most rooms offer a private outdoor terrace with garden views.",
        image: "/images/la villa/rooms/La Villa-80.webp",
      },
      {
        type: "Room with Shared Bathroom",
        price: "1,380 CHF",
        description:
          "Comfortable private room with double EMMA bed, workspace, and ample storage. Access to beautifully designed shared bathroom facilities.",
        image: "/images/la villa/rooms/La Villa-92.webp",
      },
    ],
    nearby: [
      "8 min walk to CEVA train station (direct to Geneva)",
      "15 min to Geneva Eaux-Vives by CEVA",
      "Supermarkets within 5 min walk",
      "Nature reserve at your doorstep",
      "Local cafes and restaurants nearby",
      "Bike paths to Geneva",
    ],
    lifestyle: [
      "Morning yoga by the pool",
      "Community BBQ dinners",
      "Weekend volleyball tournaments",
      "Garden-to-table cooking",
      "Movie nights in the TV room",
      "Nature walks",
    ],
    community: [
      "International professionals",
      "Remote workers & digital nomads",
      "Entrepreneurs & creatives",
      "Nature lovers & wellness enthusiasts",
    ],
    available: true,
    badgeColor: "#13a811",
  },
  leloft: {
    name: "Le Loft",
    location: "Ambilly, Grand Genève",
    description:
      "A charming townhouse with urban sophistication. Le Loft features an indoor pool and spacious designer rooms perfect for urban professionals.",
    longDescription:
      "Le Loft brings urban sophistication to coliving. This stunning townhouse in Ambilly offers the perfect retreat for professionals who want city convenience with home comfort. The all-season indoor pool is the centerpiece of this unique property, allowing you to swim year-round regardless of the weather. With its designer interiors, spacious terraces, and prime location, Le Loft is ideal for those who appreciate the finer things in life while valuing genuine community connections.",
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
    capacity: "7 colivers",
    price: "1,380",
    specs: {
      size: "300 m²",
      dpe: "C",
    },
    features: [
      "All-Season Indoor Pool",
      "2-seat Finnish Sauna",
      "Fully Equipped Modern Gym",
      "Large South-Facing Terraces",
      "XXL Professional Barbecue",
      "Dedicated Parking Spaces",
      "In-House Laundry Room",
      "High Speed Fiber Internet",
      "Designer Kitchen",
    ],
    services: [
      "Weekly yoga/Fitness classes",
      "Monthly supplies delivery",
      "Bi-weekly Community Events",
      "WhatsApp Support Channel",
      "Professional cleaning service",
      "Pool & sauna maintenance",
    ],
    rooms: [
      {
        type: "Room with Private Bathroom",
        price: "1,380 CHF",
        description:
          "Elegant designer room with private en-suite bathroom, premium furnishings, workspace, and city views.",
        image: "/images/le loft/rooms/la villa coliving le loft-52.webp",
      },
    ],
    nearby: [
      "5 min walk to tram (direct to Geneva)",
      "20 min to Geneva center",
      "Restaurants within walking distance",
      "Gym & sports center nearby",
      "Easy access to la voie verte",
    ],
    lifestyle: [
      "Morning swims in the indoor pool",
      "Terrace aperitifs at sunset",
      "Urban exploration weekends",
      "Cooking sessions in the designer kitchen",
      "Sauna & relaxation evenings",
      "City nightlife nearby",
    ],
    community: [
      "Urban professionals",
      "Finance & consulting experts",
      "International executives",
      "City lovers & culture enthusiasts",
    ],
    available: true,
    badgeColor: "#13a811",
  },
  lelodge: {
    name: "Le Lodge",
    location: "Annemasse, Grand Genève",
    description:
      "The newest and biggest house from La Villa Coliving. Le Lodge offers the most intense coliving experience with 4 buildings including a dedicated fitness chalet.",
    longDescription:
      "Le Lodge represents the future of coliving at La Villa. This expansive property spans 4 buildings across 1,500m² of gardens, offering our most comprehensive coliving experience yet. The dedicated fitness chalet with sauna, the stunning pool house, and the main residence create a village-like atmosphere where community truly thrives. With space for 12 members, Le Lodge is a vibrant hub of creativity, wellness, and connection.",
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
    capacity: "12 colivers",
    price: "1,380",
    specs: {
      size: "500 m²",
      plot: "1,500 m²",
      dpe: "B",
    },
    features: [
      "12x5m Swimming Pool & Pool House",
      "Dedicated Fitness Chalet with Sauna",
      "State-of-the-Art Gym Equipment",
      "Gaming & Entertainment Room",
      "Beautiful Gardens & Outdoor Spaces",
      "The Pool House (Additional Building)",
      "Multiple Parking Spaces",
      "High Speed Fiber Internet",
      "Outdoor Kitchen & Dining Area",
    ],
    services: [
      "weekly yoga/fitness classes",
      "Monthly supplies & essentials",
      "Monthly Community Dinners",
      "Regular Events",
      "WhatsApp Support",
      "Full property maintenance",
      "Garden & landscape care",
    ],
    rooms: [
      {
        type: "Room with Private Bathroom",
        price: "1,380 CHF",
        description:
          "Premium private space in our newest house. Modern design, private bathroom, and garden access.",
        image: "/images/le lodge/rooms/la villa coliving le lodge-78.webp",
      },
    ],
    nearby: [
      "10 min walk to train station",
      "25 min to Geneva by train",
      "Annemasse city center nearby",
      "Shopping center 5 min away",
      "Restaurants & bars in walking distance",
      "Easy border crossing to Switzerland",
    ],
    lifestyle: [
      "Pool parties in summer",
      "Fitness challenges in the chalet",
      "Garden BBQs & outdoor dining",
      "Creative workshops",
      "Pizza Parties",
    ],
    community: [
      "Large diverse community",
      "Creative professionals",
      "Wellness enthusiasts",
      "Social butterflies & connectors",
    ],
    available: true,
    badgeColor: "#13a811",
  },
};

export function HouseDetailPage() {
  const location = useLocation();
  const id = location.pathname.replace("/", "");
  const { t, language } = useLanguage();

  const house = id ? housesData[id] : null;

  if (!house) {
    return (
      <main className="pt-32 pb-20 bg-white">
        <div className="container-custom text-center">
          <h1 className="text-4xl mb-4 text-[#0f172a]">House not found</h1>
          <Link
            to="/our-houses"
            className="text-[#10b981] hover:underline font-bold"
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
        title={language === "en"
          ? `${house.name} — Premium Coliving ${house.location}, Near Geneva`
          : `${house.name} — Colocation Premium ${house.location}, près de Genève`}
        description={language === "en"
          ? `${house.description} All-inclusive furnished rooms from ${house.price} CHF/month near Geneva.`
          : `${house.description} Chambres meublées tout inclus dès ${house.price} CHF/mois près de Genève.`}
        url={`https://www.lavillacoliving.com/${id}`}
        image={`https://www.lavillacoliving.com${house.image}`}
      />
      {/* Hero Gallery */}
      <section className="relative pt-20">
        <Carousel className="w-full">
          <CarouselContent>
            {[house.image, ...house.gallery].map((img, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[50vh] md:h-[70vh]">
                  <img
                    src={img}
                    alt={`${house.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] via-transparent to-transparent" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 bg-white/90 border-2 border-[#e2e8f0] text-[#0f172a] hover:bg-white shadow-sharp" />
          <CarouselNext className="right-4 bg-white/90 border-2 border-[#e2e8f0] text-[#0f172a] hover:bg-white shadow-sharp" />
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
              <Badge
                variant="outline"
                className="border-2 border-[#0f810d] text-[#00720d] font-bold"
              >
                <Zap size={14} className="mr-1 text-[#20891e]" />
                DPE {house.specs.dpe}
              </Badge>
            </div>
            <h1
              className="text-5xl md:text-7xl mb-4 text-[#0f172a]"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              {house.name}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-[#64748b] font-medium">
              <span className="flex items-center gap-2">
                <MapPin size={18} className="text-[#10b981]" />
                {house.location}
              </span>
              <span className="flex items-center gap-2">
                <Users size={18} className="text-[#f97316]" />
                {house.capacity}
              </span>
              <span className="flex items-center gap-2">
                <Maximize size={18} className="text-[#f43f5e]" />
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
                className="text-3xl md:text-4xl mb-6 text-[#0f172a]"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                {language === "en"
                  ? `About ${house.name}`
                  : `À propos de ${house.name}`}
              </h2>
              <p className="text-lg text-[#475569] leading-relaxed mb-8 font-medium">
                {house.longDescription}
              </p>

              {/* Features */}
              <h3 className="text-2xl font-black mb-6 text-[#0f172a]">
                {t.houseDetail.features}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {house.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check
                      className="text-[#10b981] mt-1 flex-shrink-0"
                      size={18}
                    />
                    <span className="text-[#475569] font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Services */}
              <h3 className="text-2xl font-black mb-6 text-[#0f172a]">
                {t.houseDetail.services}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {house.services.map((service, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check
                      className="text-[#f97316] mt-1 flex-shrink-0"
                      size={18}
                    />
                    <span className="text-[#475569] font-medium">
                      {service}
                    </span>
                  </div>
                ))}
              </div>

              {/* Community */}
              <h3 className="text-2xl font-black mb-6 text-[#0f172a]">
                {t.houseDetail.community}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {house.community.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Star
                      className="text-[#84cc16] mt-1 flex-shrink-0"
                      size={18}
                    />
                    <span className="text-[#475569] font-medium">{item}</span>
                  </div>
                ))}
              </div>

              {/* Lifestyle */}
              <h3 className="text-2xl font-black mb-6 text-[#0f172a]">
                {t.houseDetail.lifestyle}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {house.lifestyle.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Sun
                      className="text-[#f43f5e] mt-1 flex-shrink-0"
                      size={18}
                    />
                    <span className="text-[#475569] font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Pricing Card */}
                <div className="card-ultra p-8">
                  <p className="text-sm text-[#94a3b8] mb-2 font-bold">
                    {t.houseDetail.from}
                  </p>
                  <p className="text-4xl font-black text-[#10b981] mb-2">
                    {house.price} CHF
                  </p>
                  <p className="text-[#94a3b8] mb-6 font-medium">
                    {t.houseDetail.perMonth}
                  </p>

                  <div className="space-y-3">
                    <Link to="/join-us">
                      <Button className="w-full btn-primary">
                        {t.houseDetail.apply}
                        <ArrowRight size={18} className="ml-2" />
                      </Button>
                    </Link>
                    <Link to="/rates">
                      <Button className="w-full btn-outline">
                        {t.houseDetail.checkRates}
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Quick Info Card */}
                <div className="card-ultra p-6">
                  <h4 className="font-bold text-[#0f172a] mb-4">
                    {language === "en" ? "Quick Info" : "Infos Rapides"}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[#475569]">
                      <Clock size={18} className="text-[#10b981]" />
                      <span className="text-sm">{language === "en" ? "20 min to Geneva" : "20 min de Genève"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#475569]">
                      <Wifi size={18} className="text-[#f97316]" />
                      <span className="text-sm">{language === "en" ? "8Gbps Fiber" : "Fibre 8Gbps"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#475569]">
                      <Car size={18} className="text-[#f43f5e]" />
                      <span className="text-sm">{language === "en" ? "Parking Available" : "Parking disponible"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#475569]">
                      <Coffee size={18} className="text-[#84cc16]" />
                      <span className="text-sm">{language === "en" ? "All-inclusive" : "Tout inclus"}</span>
                    </div>
                  </div>
                </div>

                {/* Nearby Card */}
                <div className="card-ultra p-6">
                  <h4 className="font-bold text-[#0f172a] mb-4">
                    {t.houseDetail.nearby}
                  </h4>
                  <div className="space-y-3">
                    {house.nearby.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 text-[#475569]"
                      >
                        <TreePine
                          size={18}
                          className="text-[#10b981] mt-0.5 flex-shrink-0"
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

      {/* Rooms */}
      <section className="section-padding relative bg-[#f8fafc]">
        <div className="container-custom">
          <h2
            className="text-3xl md:text-4xl mb-8 text-[#0f172a]"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
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
                    alt={room.type}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                {/* Room Content */}
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <BedDouble className="text-[#10b981]" size={28} />
                    <h3 className="text-xl font-black text-[#0f172a]">
                      {room.type}
                    </h3>
                  </div>
                  <p className="text-[#64748b] mb-6 font-medium">
                    {room.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-black text-[#10b981]">
                      {room.price}
                    </p>
                    <span className="text-[#94a3b8] font-medium">
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

      {/* CTA Section */}
      <section className="py-20 relative bg-[#10b981] overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/15 blob hidden lg:block" />
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-[#f97316]/40 blob-reverse hidden lg:block" />

        <div className="container-custom relative text-center">
          <h2
            className="text-3xl md:text-4xl mb-4 text-white font-black"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
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
            to="/join-us"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#10b981] font-bold rounded-full hover:bg-gray-100 transition-colors"
          >
            {t.houseDetail.apply}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
