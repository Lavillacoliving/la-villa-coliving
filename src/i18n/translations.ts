import { STATS_DISPLAY } from "@/data/stats";

// (Lot L2, 09/10/2026) Faits d'emplacement lus dans la source unique (stats.ts n'importe rien : pas de cycle) :
// « 20 min » toujours qualifié par STATS_DISPLAY.distance (D1).
// (Lot 2 — B4, 16/10/2026) Les 14 sections mortes (nav, hero, trustBadges, whyChooseUs, testimonials, about, features, houses,
// howToJoin, cta, footer, ratesPage, faqPage, joinPage) sont supprimées : les pages V7/V4 portent leurs textes. Restent
// colivingPage (/le-coliving), servicesPage (/services) et houseDetail (pages maisons).

export const translations = {
  en: {

    // The Coliving Page - Enhanced
    colivingPage: {
      hero: {
        // (Lot 4 SEO funnel, 04/09/2026) H1 de /le-coliving — une seule page vise « coliving Genève » : la home.
        h1: "What is coliving?",
        title: "Premium Coliving Houses & Community",
        subtitle: "What is Coliving?",
      },
      whatIs: {
        title: "What is Coliving?",
        description:
          "Coliving is a modern way of living where private comfort meets shared experiences. It's designed for people who value community, flexibility, and quality—without the hassle of traditional renting.",
        description2:
          "Imagine having your own beautifully designed private bedroom while sharing premium amenities like pools, gyms, and coworking spaces with a curated community of like-minded professionals. That's coliving.",
      },
      notColocation: {
        title: "Coliving is Not Just Colocation",
        description:
          "Traditional colocation means finding roommates, buying furniture, setting up utilities, and managing everything yourself. It's work.",
        description2:
          "Coliving is different. We've done all the work for you. Your home is fully furnished, utilities are connected, the community is curated, and everything is managed professionally. You just move in and start living.",
      },
      difference: {
        title: "Our Curated Coliving Community",
        description:
          `We bring together 7 to 12 carefully selected members in thoughtfully designed homes, on the French side, ${STATS_DISPLAY.en.distance}. Every detail—from the furniture to the community events—is intentional.`,
        description2:
          "This isn't just shared housing. It's a lifestyle upgrade designed for modern professionals who refuse to compromise on quality, community, or convenience.",
      },
      values: {
        title: "Our Core Values",
        value1: {
          title: "Curated Community",
          description:
            "Every member is carefully selected to ensure shared values and harmonious living.",
        },
        value2: {
          title: "Effortless Living",
          description:
            "Everything is taken care of so you can focus on what matters most.",
        },
        value3: {
          title: "Meaningful Connections",
          description:
            "We create spaces where genuine relationships naturally flourish.",
        },
      },
      benefits: {
        title: "Benefits of Our Coliving Houses",
        benefit1: "No furniture shopping or moving hassles",
        benefit2: "All utilities included in one payment",
        benefit3: "Instant community of like-minded people",
        benefit4: "Premium amenities you couldn't afford alone",
        benefit5: "Professional cleaning and maintenance",
        benefit6: "Our residents stay from 6 months to 3 years — time to live, not just pass through",
        benefit7: "Work-friendly spaces with high-speed internet",
        benefit8: "Regular community events and activities",
      },
      whoIsItFor: {
        title: "Who is Coliving For?",
        description: "Coliving at La Villa is perfect for:",
        profile1: "Remote workers and digital nomads seeking community",
        profile2: "Young professionals starting their career in Geneva",
        profile3: "Expats looking for an instant social network",
        profile4: "Entrepreneurs who value work-life balance",
        profile5: "Anyone tired of isolated apartment living",
      },
    },

    // Services Page - Enhanced with visual descriptions
    servicesPage: {
      hero: {
        title: "All-Inclusive Living",
        subtitle: "Everything you need. Nothing you don't.",
        description:
          "At La Villa, we've thought of every detail so you can focus on what matters—living fully.",
      },
      services: {
        allInclusive: {
          title: "Truly All-Inclusive",
          description:
            "Rent, utilities, maintenance, and replacements—all covered. One payment. Zero surprises.",
        },
        housekeeping: {
          title: "Effortless Upkeep",
          description:
            "Professional housekeeping of all common areas three times a week, including one deep clean. Your home stays pristine, effortlessly.",
        },
        internet: {
          title: "High-Speed Fiber",
          description:
            "Professional-grade fiber optic internet throughout the house. Work, stream, connect—without limits.",
        },
        pool: {
          title: "Pool & Garden",
          description:
            "Heated swimming pool, BBQ area, garden furniture, and outdoor spaces designed for relaxation and gatherings.",
        },
        wellness: {
          title: "Wellness Included",
          description: "Fully equipped gym (24/7 access) and sauna, because balance matters.",
        },
        entertainment: {
          title: "Entertainment Hub",
          description:
            "Cinema room with streaming subscriptions, gaming consoles, and spaces designed for connection.",
        },
        transport: {
          title: "Private Yoga & Fitness Classes",
          description: "Weekly private yoga and fitness classes included in your rent. Stay active without leaving home.",
        },
        supplies: {
          title: "Monthly Essentials",
          description:
            "Basic supplies delivered monthly—cleaning products, paper goods, and household essentials.",
        },
        community: {
          title: "Community Events",
          description:
            "Monthly pizza parties and seasonal events. Real connections, zero obligations.",
        },
        support: {
          title: "Always Here for You",
          description:
            "Direct WhatsApp support for quick responses. We're just a message away.",
        },
      },
    },

    // House Detail Pages - Enhanced
    houseDetail: {
      features: "Features",
      services: "Included services", // (Retenue premium, lot 1, T12 — 13/10/2026)
      rooms: "Rooms",
      location: "Location",
      community: "The Community",
      lifestyle: "Lifestyle",
      gallery: "Gallery",
      checkRates: "Check Rates",
      apply: "Apply Now",
      from: "From",
      perMonth: "/month",
      roomPrivate: "Room with Private Bathroom",
      roomShared: "Room with Shared Bathroom",
      available: "Available",
      soon: "Opening Soon",
      viewRooms: "View Rooms",
      virtualTour: "Virtual Tour",
      nearby: "What's Nearby",
    },
  },

  fr: {

    // The Coliving Page - Enhanced
    colivingPage: {
      hero: {
        // (Lot 4 SEO funnel, 04/09/2026) H1 de /le-coliving — une seule page vise « coliving Genève » : la home.
        h1: "Le coliving, c'est quoi ?",
        title: "Maisons Coliving Premium & Communauté",
        subtitle: "Qu'est-ce que le Coliving ?",
      },
      whatIs: {
        title: "Qu'est-ce que le Coliving ?",
        description:
          "Le coliving est une façon moderne de vivre où le confort privé rencontre les expériences partagées. C'est conçu pour ceux qui valorisent la communauté, la flexibilité et la qualité — sans les tracas de la location traditionnelle.",
        description2:
          "Imagine avoir ta propre chambre privée magnifiquement designée tout en partageant des équipements premium comme des piscines, des salles de sport et des espaces de coworking avec une communauté sélectionnée de professionnels partageant les mêmes valeurs. C'est le coliving.",
      },
      notColocation: {
        title: "Le coliving n'est pas juste une colocation",
        description:
          "La colocation traditionnelle signifie trouver des colocataires, acheter des meubles, configurer les services et tout gérer soi-même. C'est du travail.",
        description2:
          "Le coliving est différent. Nous avons fait tout le travail pour toi. Ta maison est entièrement meublée, les services sont connectés, la communauté est sélectionnée et tout est géré professionnellement. Tu emménages et commences à vivre.",
      },
      difference: {
        title: "Notre communauté coliving sélectionnée",
        description:
          `Nous réunissons 7 à 12 membres soigneusement sélectionnés dans des maisons pensées dans les moindres détails, à ${STATS_DISPLAY.fr.distance}, côté France. Chaque détail — du mobilier aux événements communautaires — est intentionnel.`,
        description2:
          "Ce n'est pas juste une colocation. C'est une véritable élévation de mode de vie conçue pour les professionnels qui refusent de compromettre sur la qualité, la communauté ou la commodité.",
      },
      values: {
        title: "Nos valeurs fondamentales",
        value1: {
          title: "Communauté sélectionnée",
          description:
            "Chaque membre est soigneusement sélectionné pour assurer des valeurs partagées et une vie harmonieuse.",
        },
        value2: {
          title: "Vie sans effort",
          description:
            "Tout est pris en charge pour que tu puisses te concentrer sur l'essentiel.",
        },
        value3: {
          title: "Connexions significatives",
          description:
            "Nous créons des espaces où les relations authentiques fleurissent naturellement.",
        },
      },
      benefits: {
        title: "Avantages de Nos Maisons Coliving",
        benefit1: "Pas d'achat de meubles ni de tracas de déménagement",
        benefit2: "Tous les services inclus en un seul paiement",
        benefit3:
          "Communauté instantanée de personnes partageant les mêmes valeurs",
        benefit4:
          "Équipements premium que tu ne pourrais pas t'offrir seul",
        benefit5: "Ménage et maintenance professionnels",
        benefit6: "Nos résidents restent de 6 mois à 3 ans — le temps de vivre, pas juste de passer",
        benefit7: "Espaces adaptés au travail avec internet haut débit",
        benefit8: "Événements communautaires et activités régulières",
      },
      whoIsItFor: {
        title: "À Qui S'adresse le Coliving ?",
        description: "Le coliving chez La Villa est parfait pour :",
        profile1:
          "Travailleurs à distance et nomades digitaux cherchant la communauté",
        profile2: "Jeunes professionnels commençant leur carrière à Genève",
        profile3: "Expatriés cherchant un réseau social instantané",
        profile4: "Entrepreneurs qui valorisent l'équilibre travail-vie",
        profile5: "Tous ceux qui en ont assez de la vie isolée en appartement",
      },
    },

    // Services Page - Enhanced
    servicesPage: {
      hero: {
        title: "Vie Tout Inclusive",
        subtitle: "Tout ce dont tu as besoin. Rien de superflu.",
        description:
          "Chez La Villa, nous avons pensé à chaque détail pour que tu puisses te concentrer sur l'essentiel — vivre pleinement.",
      },
      services: {
        allInclusive: {
          title: "Vraiment Tout Inclus",
          description:
            "Loyer, charges, entretien et remplacements — tout est couvert. Un paiement. Zéro surprise.",
        },
        housekeeping: {
          title: "Entretien Sans Effort",
          description:
            "Ménage professionnel des communs 3 fois par semaine, dont un nettoyage approfondi hebdomadaire. Ta maison reste impeccable, sans effort.",
        },
        internet: {
          title: "Fibre Haut Débit",
          description:
            "Internet fibre optique professionnel dans toute la maison. Travaille, streame, connecte-toi — sans limites.",
        },
        pool: {
          title: "Piscine & Jardin",
          description:
            "Piscine chauffée, espace BBQ, mobilier de jardin et espaces extérieurs conçus pour la détente et les rassemblements.",
        },
        wellness: {
          title: "Bien-être Inclus",
          description:
            "Salle de sport équipée (accès 24h/24) et sauna, parce que l'équilibre compte.",
        },
        entertainment: {
          title: "Espace Divertissement",
          description:
            "Salle cinéma avec abonnements streaming, consoles de jeu et espaces conçus pour la connexion.",
        },
        transport: {
          title: "Cours de Yoga & Fitness Privés",
          description:
            "Cours de yoga et de fitness privés chaque semaine, inclus dans ton loyer. Reste en forme sans quitter la maison.",
        },
        supplies: {
          title: "Essentiels Mensuels",
          description:
            "Fournitures de base livrées mensuellement — produits d'entretien, papeterie et essentiels domestiques.",
        },
        community: {
          title: "Événements Communautaires",
          description:
            "Pizza Party mensuelle et événements saisonniers. De vraies connexions, zéro obligation.",
        },
        support: {
          title: "Toujours Là pour Toi",
          description:
            "Support WhatsApp direct pour des réponses rapides. Nous sommes à un message.",
        },
      },
    },

    // House Detail Pages - Enhanced
    houseDetail: {
      features: "Caractéristiques",
      services: "Services inclus", // (Retenue premium, lot 1, T12 — 13/10/2026)
      rooms: "Chambres",
      location: "Localisation",
      community: "La Communauté",
      lifestyle: "Mode de Vie",
      gallery: "Galerie",
      checkRates: "Voir les Tarifs",
      apply: "Candidater",
      from: "À partir de",
      perMonth: "/mois",
      roomPrivate: "Chambre avec Salle de Bain Privée",
      roomShared: "Chambre avec Salle de Bain Partagée",
      available: "Disponible",
      soon: "Ouverture Prochaine",
      viewRooms: "Voir les Chambres",
      virtualTour: "Visite Virtuelle",
      nearby: "À Proximité",
    },
  },
};

export type Language = "en" | "fr";
export type Translations = typeof translations.en;
