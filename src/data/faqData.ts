// FAQ Data for SEO - Extensive question/answer database
// Organized by categories for better SEO structure

export interface FAQItem {
  id: string;
  question: { en: string; fr: string };
  answer: { en: string; fr: string };
  category: string;
}

export const faqCategories = {
  en: [
    'Getting Started',
    'Coliving Concept',
    'Accommodations',
    'Pricing & Payments',
    'Community & Lifestyle',
    'Work & Productivity',
    'Location & Transport',
    'Application Process',
    'Living Experience',
    'Services & Amenities',
  ],
  fr: [
    'Pour Commencer',
    'Concept de Coliving',
    'Hébergements',
    'Tarifs & Paiements',
    'Communauté & Mode de Vie',
    'Travail & Productivité',
    'Localisation & Transport',
    'Processus de Candidature',
    'Expérience de Vie',
    'Services & Équipements',
  ],
};

export const faqData: FAQItem[] = [
  // GETTING STARTED
  {
    id: 'what-is-coliving',
    category: 'Getting Started',
    question: {
      en: 'What is coliving?',
      fr: 'Qu\'est-ce que le coliving ?',
    },
    answer: {
      en: 'Coliving is a modern housing concept where individuals share a fully furnished home with private bedrooms and shared common spaces. It combines the privacy of your own room with the benefits of community living, all in a hassle-free, all-inclusive package. Unlike traditional renting, coliving provides instant community, premium amenities, and flexible terms.',
      fr: 'Le coliving est un concept de logement moderne où les individus partagent une maison entièrement meublée avec des chambres privées et des espaces communs partagés. Il combine l\'intimité de votre propre chambre avec les avantages de la vie communautaire, le tout dans un package tout inclus sans tracas. Contrairement à la location traditionnelle, le coliving offre une communauté instantanée, des équipements premium et des conditions flexibles.',
    },
  },
  {
    id: 'coliving-vs-colocation',
    category: 'Getting Started',
    question: {
      en: 'What is the difference between coliving and colocation?',
      fr: 'Quelle est la différence entre coliving et colocation ?',
    },
    answer: {
      en: 'While both involve shared living, coliving is fundamentally different from colocation. Colocation typically means renting an apartment together and handling everything yourselves—furniture, utilities, cleaning, and finding compatible roommates. Coliving provides a turnkey solution: fully furnished spaces, all utilities included, professional cleaning, curated communities, premium amenities, and a supportive environment designed for modern living. At La Villa, we handle all the logistics so you can focus on living.',
      fr: 'Bien que les deux impliquent le partage de logement, le coliving est fondamentalement différent de la colocation. La colocation signifie généralement louer un appartement ensemble et gérer tout vous-mêmes—meubles, services, ménage et recherche de colocataires compatibles. Le coliving offre une solution clé en main : espaces entièrement meublés, tous les services inclus, ménage professionnel, communautés sélectionnées, équipements premium et un environnement favorable conçu pour la vie moderne. Chez La Villa, nous gérons toute la logistique pour que vous puissiez vous concentrer sur le vivre.',
    },
  },
  {
    id: 'who-is-coliving-for',
    category: 'Getting Started',
    question: {
      en: 'Who is coliving for?',
      fr: 'À qui s\'adresse le coliving ?',
    },
    answer: {
      en: 'Coliving is perfect for professionals, remote workers, digital nomads, entrepreneurs, international students, and anyone seeking a seamless living experience with genuine community connections. It\'s especially popular among people aged 25-40 who value experiences over possessions and want to live in vibrant, like-minded communities.',
      fr: 'Le coliving est parfait pour les professionnels, travailleurs à distance, nomades digitaux, entrepreneurs, étudiants internationaux et tous ceux qui recherchent une expérience de vie fluide avec de véritables connexions communautaires. Il est particulièrement populaire parmi les personnes âgées de 25 à 40 ans qui privilégient les expériences aux possessions et souhaitent vivre dans des communautés dynamiques et partageant les mêmes valeurs.',
    },
  },
  {
    id: 'why-choose-coliving',
    category: 'Getting Started',
    question: {
      en: 'Why should I choose coliving over a traditional apartment?',
      fr: 'Pourquoi choisir le coliving plutôt qu\'un appartement traditionnel ?',
    },
    answer: {
      en: 'Coliving offers numerous advantages: no furniture shopping, no utility setup, no cleaning schedules to coordinate, instant community, access to amenities you couldn\'t afford alone (pools, gyms, saunas), flexible lease terms, and often significant cost savings compared to renting a studio in the same area. Plus, you gain a built-in social network and support system from day one.',
      fr: 'Le coliving offre de nombreux avantages : pas d\'achat de meubles, pas de configuration des services, pas de plannings de ménage à coordonner, communauté instantanée, accès à des équipements que vous ne pourriez pas vous offrir seul (piscines, salles de sport, saunas), conditions de bail flexibles, et souvent des économies significatives comparées à la location d\'un studio dans la même zone. De plus, vous gagnez un réseau social intégré et un système de soutien dès le premier jour.',
    },
  },
  {
    id: 'is-coliving-expensive',
    category: 'Getting Started',
    question: {
      en: 'Is coliving expensive?',
      fr: 'Le coliving est-il cher ?',
    },
    answer: {
      en: 'When you factor in all costs—rent, utilities, internet, furniture, gym membership, cleaning services, and entertainment—coliving is often more economical than traditional renting. At La Villa, our all-inclusive rates start from 1,380 CHF/month, which is competitive with Geneva studio prices while offering significantly more value and amenities.',
      fr: 'Quand vous prenez en compte tous les coûts—loyer, charges, internet, meubles, abonnement de salle de sport, services de ménage et divertissement—le coliving est souvent plus économique que la location traditionnelle. Chez La Villa, nos tarifs tout inclus commencent à 1 380 CHF/mois, ce qui est compétitif avec les prix des studios à Genève tout en offrant beaucoup plus de valeur et d\'équipements.',
    },
  },

  // COLIVING CONCEPT
  {
    id: 'what-makes-lavilla-different',
    category: 'Coliving Concept',
    question: {
      en: 'What makes La Villa Coliving different from other coliving spaces?',
      fr: 'Qu\'est-ce qui différencie La Villa Coliving des autres espaces de coliving ?',
    },
    answer: {
      en: 'La Villa stands out through our curated community approach, exceptional locations just 30 minutes from Geneva, premium amenities including heated pools and wellness areas, and our commitment to creating genuine connections. We\'re not just a place to sleep—we\'re a lifestyle designed for modern professionals who value both productivity and wellbeing. Our homes are designed spaces, not converted apartments, with every detail thoughtfully considered.',
      fr: 'La Villa se démarque par notre approche de communauté sélectionnée, nos emplacements exceptionnels à seulement 30 minutes de Genève, nos équipements premium incluant des piscines chauffées et des espaces bien-être, et notre engagement à créer de véritables connexions. Nous ne sommes pas juste un endroit pour dormir—nous sommes un mode de vie conçu pour les professionnels modernes qui valorisent à la fois la productivité et le bien-être. Nos maisons sont des espaces design, pas des appartements convertis, avec chaque détail soigneusement pensé.',
    },
  },
  {
    id: 'coliving-community-curated',
    category: 'Coliving Concept',
    question: {
      en: 'How is the community curated at La Villa?',
      fr: 'Comment la communauté est-elle sélectionnée chez La Villa ?',
    },
    answer: {
      en: 'We carefully select each member through an application process that includes a video call and in-person meeting. We look for open-minded, respectful individuals who share our values of collaboration and community. Our goal is to create balanced, diverse communities where members can learn from each other and form meaningful connections.',
      fr: 'Nous sélectionnons soigneusement chaque membre à travers un processus de candidature incluant un appel vidéo et une rencontre en personne. Nous recherchons des personnes ouvertes d\'esprit et respectueuses qui partagent nos valeurs de collaboration et de communauté. Notre objectif est de créer des communautés équilibrées et diverses où les membres peuvent apprendre les uns des autres et former des liens significatifs.',
    },
  },
  {
    id: 'coliving-philosophy',
    category: 'Coliving Concept',
    question: {
      en: 'What is the philosophy behind La Villa Coliving?',
      fr: 'Quelle est la philosophie derrière La Villa Coliving ?',
    },
    answer: {
      en: 'Our philosophy is simple: life is better when shared. We believe that modern living should combine privacy with community, productivity with relaxation, and independence with connection. We\'ve created spaces where you can focus on your career while building meaningful relationships, where wellness is integrated into daily life, and where coming home is something to look forward to.',
      fr: 'Notre philosophie est simple : la vie est meilleure quand elle est partagée. Nous croyons que la vie moderne devrait combiner intimité et communauté, productivité et détente, indépendance et connexion. Nous avons créé des espaces où vous pouvez vous concentrer sur votre carrière tout en construisant des relations significatives, où le bien-être est intégré dans la vie quotidienne, et où rentrer chez soi est quelque chose qu\'on attend avec impatience.',
    },
  },
  {
    id: 'coliving-vs-coworking',
    category: 'Coliving Concept',
    question: {
      en: 'What is the difference between coliving and coworking?',
      fr: 'Quelle est la différence entre coliving et coworking ?',
    },
    answer: {
      en: 'Coworking provides shared workspace, while coliving provides shared living space. At La Villa, we combine both—you get a private bedroom and shared living areas, plus dedicated workspaces with high-speed internet. It\'s the perfect solution for remote workers who want to eliminate their commute and live where they work.',
      fr: 'Le coworking fournit un espace de travail partagé, tandis que le coliving fournit un espace de vie partagé. Chez La Villa, nous combinons les deux—vous avez une chambre privée et des espaces de vie partagés, plus des espaces de travail dédiés avec internet haut débit. C\'est la solution parfaite pour les travailleurs à distance qui veulent éliminer les trajets et vivre là où ils travaillent.',
    },
  },
  {
    id: 'coliving-history',
    category: 'Coliving Concept',
    question: {
      en: 'Where did coliving come from?',
      fr: 'D\'où vient le coliving ?',
    },
    answer: {
      en: 'Coliving emerged as a response to rising housing costs, urban isolation, and the changing nature of work. It draws inspiration from traditional communal living while incorporating modern needs for privacy, flexibility, and professional networking. The concept gained popularity in tech hubs like San Francisco and has since spread globally as a solution for modern urban living.',
      fr: 'Le coliving est apparu en réponse à la hausse des coûts du logement, l\'isolement urbain et la nature changeante du travail. Il s\'inspire de la vie communautaire traditionnelle tout en incorporant les besoins modernes d\'intimité, de flexibilité et de réseautage professionnel. Le concept a gagné en popularité dans les pôles technologiques comme San Francisco et s\'est depuis répandu globalement comme solution pour la vie urbaine moderne.',
    },
  },

  // ACCOMMODATIONS
  {
    id: 'private-bedroom',
    category: 'Accommodations',
    question: {
      en: 'Will I have my own private bedroom?',
      fr: 'Aurai-je ma propre chambre privée ?',
    },
    answer: {
      en: 'Yes, absolutely. Every resident at La Villa has their own private, fully furnished bedroom with a comfortable bed, quality bedding, desk, storage, and often an en-suite bathroom. Your bedroom is your personal sanctuary—you can decorate it, work in it, and retreat to it whenever you need privacy.',
      fr: 'Oui, absolument. Chaque résident chez La Villa a sa propre chambre privée entièrement meublée avec un lit confortable, une literie de qualité, un bureau, des rangements, et souvent une salle de bain privative. Votre chambre est votre sanctuaire personnel—vous pouvez la décorer, y travailler et vous y retirer quand vous avez besoin d\'intimité.',
    },
  },
  {
    id: 'room-furnishings',
    category: 'Accommodations',
    question: {
      en: 'What furniture is included in the bedrooms?',
      fr: 'Quels meubles sont inclus dans les chambres ?',
    },
    answer: {
      en: 'All bedrooms come fully furnished with a premium bed and mattress, high-quality bedding, bedside tables, a desk with chair, wardrobe/closet, lamps, and decorative elements. Rooms are designed to be both functional and aesthetically pleasing, providing everything you need from day one.',
      fr: 'Toutes les chambres sont entièrement meublées avec un lit et matelas premium, une literie de haute qualité, des tables de chevet, un bureau avec chaise, une armoire/penderie, des lampes et des éléments décoratifs. Les chambres sont conçues pour être à la fois fonctionnelles et esthétiquement agréables, fournissant tout ce dont vous avez besoin dès le premier jour.',
    },
  },
  {
    id: 'bathroom-options',
    category: 'Accommodations',
    question: {
      en: 'What are the bathroom arrangements?',
      fr: 'Quelles sont les configurations des salles de bain ?',
    },
    answer: {
      en: 'We offer both private en-suite bathrooms and rooms with shared bathrooms, depending on the house and room type. Private bathrooms include a shower, toilet, and sink. Shared bathrooms are modern, well-maintained, and cleaned regularly. All bathrooms are stocked with basic supplies.',
      fr: 'Nous proposons des salles de bain privatives en suite et des chambres avec salles de bain partagées, selon la maison et le type de chambre. Les salles de bain privatives incluent une douche, des toilettes et un lavabo. Les salles de bain partagées sont modernes, bien entretenues et nettoyées régulièrement. Toutes les salles de bain sont équipées de fournitures de base.',
    },
  },
  {
    id: 'common-areas',
    category: 'Accommodations',
    question: {
      en: 'What common areas are available?',
      fr: 'Quels espaces communs sont disponibles ?',
    },
    answer: {
      en: 'Our common areas include fully equipped kitchens, comfortable living rooms, dining spaces, coworking areas, outdoor terraces, gardens, pools, gyms, saunas, and entertainment rooms. Each house is designed to provide both social spaces for gathering and quiet areas for relaxation or focused work.',
      fr: 'Nos espaces communs incluent des cuisines entièrement équipées, des salons confortables, des espaces de restauration, des espaces de coworking, des terrasses extérieures, des jardins, des piscines, des salles de sport, des saunas et des salles de divertissement. Chaque maison est conçue pour fournir à la fois des espaces sociaux pour se rassembler et des zones calmes pour la détente ou le travail concentré.',
    },
  },
  {
    id: 'kitchen-access',
    category: 'Accommodations',
    question: {
      en: 'Can I use the kitchen?',
      fr: 'Puis-je utiliser la cuisine ?',
    },
    answer: {
      en: 'Yes, all residents have full access to our professional-grade kitchens. They\'re fully equipped with appliances, cookware, dishes, and utensils. You can cook your own meals, store food in designated areas, and many residents enjoy cooking together for community dinners.',
      fr: 'Oui, tous les résidents ont un accès complet à nos cuisines de qualité professionnelle. Elles sont entièrement équipées avec des appareils électroménagers, des ustensiles de cuisine, de la vaisselle et des couverts. Vous pouvez cuisiner vos propres repas, stocker de la nourriture dans des zones désignées, et de nombreux résidents aiment cuisiner ensemble pour les dîners communautaires.',
    },
  },
  {
    id: 'storage-space',
    category: 'Accommodations',
    question: {
      en: 'Is there storage space for my belongings?',
      fr: 'Y a-t-il de l\'espace de rangement pour mes affaires ?',
    },
    answer: {
      en: 'Yes, each bedroom includes wardrobe/closet space, and we provide additional storage options depending on the house. Some locations offer basement storage, garage space, or dedicated storage rooms. Please inquire about specific storage needs when applying.',
      fr: 'Oui, chaque chambre inclut un espace armoire/penderie, et nous proposons des options de rangement supplémentaires selon la maison. Certains emplacements offrent un rangement au sous-sol, un espace garage ou des salles de rangement dédiées. Veuillez vous renseigner sur vos besoins spécifiques de rangement lors de votre candidature.',
    },
  },
  {
    id: 'parking-available',
    category: 'Accommodations',
    question: {
      en: 'Is parking available?',
      fr: 'Un parking est-il disponible ?',
    },
    answer: {
      en: 'Yes, all our houses have parking available for residents. La Villa, Le Lodge and Le Loft offer on-site parking. Please let us know your parking needs when applying so we can ensure availability.',
      fr: 'Oui, toutes nos maisons disposent d\'un parking pour les résidents. La Villa, Le Lodge et Le Loft offrent un parking sur place. Veuillez nous informer de vos besoins de parking lors de votre candidature pour que nous puissions assurer la disponibilité.',
    },
  },
  {
    id: 'laundry-facilities',
    category: 'Accommodations',
    question: {
      en: 'Are laundry facilities available?',
      fr: 'Des installations de buanderie sont-elles disponibles ?',
    },
    answer: {
      en: 'Yes, all our houses have laundry facilities with washing machines and dryers available for resident use. Some rooms also have private laundry facilities. Detergent and supplies are typically included in our monthly essentials delivery.',
      fr: 'Oui, toutes nos maisons disposent d\'installations de buanderie avec machines à laver et sèche-linges disponibles pour les résidents. Certaines chambres disposent également d\'installations de buanderie privées. La lessive et les fournitures sont généralement incluses dans notre livraison mensuelle d\'essentiels.',
    },
  },

  // PRICING & PAYMENTS
  {
    id: 'what-is-included',
    category: 'Pricing & Payments',
    question: {
      en: 'What is included in the monthly rent?',
      fr: 'Qu\'est-ce qui est inclus dans le loyer mensuel ?',
    },
    answer: {
      en: 'Your monthly rent includes: private furnished bedroom, all utilities (electricity, water, heating), high-speed fiber internet, weekly housekeeping of common areas, pool and garden maintenance, gym and sauna access, weekly yoga and fitness classes, streaming subscriptions, community events, monthly essentials delivery (cleaning supplies, paper goods), and WhatsApp support. It\'s truly all-inclusive.',
      fr: 'Votre loyer mensuel inclut : chambre privée meublée, tous les services (électricité, eau, chauffage), internet fibre haut débit, ménage hebdomadaire des espaces communs, entretien de la piscine et du jardin, accès à la salle de sport et au sauna, cours de yoga et fitness hebdomadaires, abonnements streaming, événements communautaires, livraison mensuelle d\'essentiels (produits d\'entretien, articles en papier), et support WhatsApp. C\'est vraiment tout inclus.',
    },
  },
  {
    id: 'monthly-cost',
    category: 'Pricing & Payments',
    question: {
      en: 'How much does it cost to live at La Villa?',
      fr: 'Combien coûte la vie à La Villa ?',
    },
    answer: {
      en: 'Our rates start from 1,380 CHF per month and vary depending on the house, room type, and whether you choose a private or shared bathroom. This is an all-inclusive rate with no hidden fees. When compared to renting a studio in Geneva plus utilities and amenities, La Villa offers exceptional value.',
      fr: 'Nos tarifs commencent à 1 380 CHF par mois et varient selon la maison, le type de chambre, et si vous choisissez une salle de bain privée ou partagée. C\'est un tarif tout inclus sans frais cachés. Comparé à la location d\'un studio à Genève plus les charges et équipements, La Villa offre une valeur exceptionnelle.',
    },
  },
  {
    id: 'security-deposit',
    category: 'Pricing & Payments',
    question: {
      en: 'Is there a security deposit?',
      fr: 'Y a-t-il une caution ?',
    },
    answer: {
      en: 'Yes, we require a security deposit equivalent to two months\' rent. This deposit is held for the duration of your stay and returned within 30 days of move-out, minus any deductions for damages beyond normal wear and tear.',
      fr: 'Oui, nous exigeons une caution équivalente à deux mois de loyer. Cette caution est conservée pendant la durée de votre séjour et restituée dans les 30 jours suivant le départ, moins toute déduction pour dommages au-delà de l\'usure normale.',
    },
  },
  {
    id: 'agency-fees',
    category: 'Pricing & Payments',
    question: {
      en: 'Are there any agency fees?',
      fr: 'Y a-t-il des frais d\'agence ?',
    },
    answer: {
      en: 'No, there are absolutely no agency fees at La Villa Coliving. Our pricing is transparent and all-inclusive. You only pay your monthly rent and the security deposit. No hidden costs, no surprise charges.',
      fr: 'Non, il n\'y a absolument aucun frais d\'agence chez La Villa Coliving. Notre tarification est transparente et tout inclusive. Vous ne payez que votre loyer mensuel et la caution. Pas de coûts cachés, pas de frais surprises.',
    },
  },
  {
    id: 'payment-methods',
    category: 'Pricing & Payments',
    question: {
      en: 'What payment methods do you accept?',
      fr: 'Quels modes de paiement acceptez-vous ?',
    },
    answer: {
      en: 'We accept bank transfers and SEPA. Rent is due monthly in advance. We can also accommodate employer-sponsored housing programs and provide invoices for expense reimbursement.',
      fr: 'Nous acceptons les virements bancaires et le prélèvement SEPA. Le loyer est dû mensuellement à l\'avance. Nous pouvons également accommoder les programmes de logement parrainés par les employeurs et fournir des factures pour le remboursement des frais.',
    },
  },
  {
    id: 'minimum-stay',
    category: 'Pricing & Payments',
    question: {
      en: 'Is there a minimum length of stay?',
      fr: 'Y a-t-il une durée de séjour minimum ?',
    },
    answer: {
      en: 'Yes, we require a minimum stay of two months. This helps ensure community stability and allows members to form meaningful connections. If you need to leave earlier, we require one month\'s notice.',
      fr: 'Oui, nous exigeons un séjour minimum de deux mois. Cela permet d\'assurer la stabilité de la communauté et permet aux membres de former des liens significatifs. Si vous devez partir plus tôt, nous avons besoin d\'un préavis d\'un mois.',
    },
  },
  {
    id: 'notice-period',
    category: 'Pricing & Payments',
    question: {
      en: 'What is the notice period if I want to leave?',
      fr: 'Quel est le préavis si je veux partir ?',
    },
    answer: {
      en: 'We require one month\'s notice if you decide to leave. This allows us time to find a suitable replacement and ensure a smooth transition for the community. The notice should be provided in writing.',
      fr: 'Nous exigeons un préavis d\'un mois si vous décidez de partir. Cela nous permet de trouver un remplaçant approprié et d\'assurer une transition en douceur pour la communauté. Le préavis doit être donné par écrit.',
    },
  },
  {
    id: 'price-comparison-geneva',
    category: 'Pricing & Payments',
    question: {
      en: 'How does La Villa compare to renting in Geneva?',
      fr: 'Comment La Villa se compare-t-il à la location à Genève ?',
    },
    answer: {
      en: 'A studio apartment in Geneva typically costs 1,500-2,500 CHF/month, plus utilities (150-250 CHF), internet (50-80 CHF), gym membership (100-150 CHF), and you\'d need to buy furniture. At La Villa, starting from 1,380 CHF, you get a furnished private room, all utilities, internet, gym, pool, sauna, cleaning, and a built-in community. The value is exceptional.',
      fr: 'Un studio à Genève coûte généralement 1 500-2 500 CHF/mois, plus les charges (150-250 CHF), internet (50-80 CHF), abonnement de salle de sport (100-150 CHF), et vous devriez acheter des meubles. Chez La Villa, à partir de 1 380 CHF, vous obtenez une chambre privée meublée, tous les services, internet, salle de sport, piscine, sauna, ménage et une communauté intégrée. La valeur est exceptionnelle.',
    },
  },

  // COMMUNITY & LIFESTYLE
  {
    id: 'community-events',
    category: 'Community & Lifestyle',
    question: {
      en: 'What kind of community events are organized?',
      fr: 'Quel type d\'événements communautaires sont organisés ?',
    },
    answer: {
      en: 'We organize regular community events including monthly dinners, yoga and fitness classes, Pizza parties and seasonal celebrations and networking events. Participation is always optional—we respect your need for both social time and personal space.',
      fr: 'Nous organisons régulièrement des événements communautaires incluant des dîners mensuels, des cours de yoga et fitness, des soirées pizza, des célébrations saisonnières et des événements de networking. La participation est toujours optionnelle—nous respectons votre besoin de temps social et d\'espace personnel.',
    },
  },
  {
    id: 'typical-residents',
    category: 'Community & Lifestyle',
    question: {
      en: 'Who are the typical residents at La Villa?',
      fr: 'Qui sont les résidents typiques de La Villa ?',
    },
    answer: {
      en: 'Our residents are typically professionals, entrepreneurs, and remote workers aged 25-40. They come from diverse backgrounds and countries, united by shared values of openness, respect, and a desire for meaningful community. Many work in tech, finance, consulting, creative industries, or international organizations.',
      fr: 'Nos résidents sont généralement des professionnels, entrepreneurs et travailleurs à distance âgés de 25 à 40 ans. Ils viennent d\'horizons et de pays divers, unis par des valeurs communes d\'ouverture, de respect et de désir de communauté significative. Beaucoup travaillent dans la tech, la finance, le conseil, les industries créatives ou les organisations internationales.',
    },
  },
  {
    id: 'social-pressure',
    category: 'Community & Lifestyle',
    question: {
      en: 'Will I feel pressured to be social all the time?',
      fr: 'Vais-je me sentir obligé d\'être social tout le temps ?',
    },
    answer: {
      en: 'Absolutely not. We believe in balance. While we foster community, we deeply respect personal boundaries and privacy. Your bedroom is your private sanctuary, and participation in community activities is always optional. Many residents enjoy the best of both worlds—socializing when they want and retreating when they need quiet time.',
      fr: 'Absolument pas. Nous croyons en l\'équilibre. Bien que nous favorisions la communauté, nous respectons profondément les limites personnelles et la vie privée. Votre chambre est votre sanctuaire privé, et la participation aux activités communautaires est toujours optionnelle. De nombreux résidents apprécient le meilleur des deux mondes—socialiser quand ils veulent et se retirer quand ils ont besoin de calme.',
    },
  },
  {
    id: 'make-friends',
    category: 'Community & Lifestyle',
    question: {
      en: 'Will I make friends living at La Villa?',
      fr: 'Vais-je me faire des amis en vivant à La Villa ?',
    },
    answer: {
      en: 'Most of our residents form genuine friendships that last well beyond their stay at La Villa. The combination of shared spaces, community events, and curated member selection creates natural opportunities for connection. Many residents describe finding their "tribe" here—people who understand their lifestyle and ambitions.',
      fr: 'La plupart de nos résidents forment des amitiés authentiques qui durent bien au-delà de leur séjour à La Villa. La combinaison d\'espaces partagés, d\'événements communautaires et de sélection des membres crée des opportunités naturelles de connexion. De nombreux résidents décrivent avoir trouvé leur "tribu" ici—des personnes qui comprennent leur mode de vie et leurs ambitions.',
    },
  },
  {
    id: 'guests-policy',
    category: 'Community & Lifestyle',
    question: {
      en: 'Can I have guests over?',
      fr: 'Puis-je recevoir des invités ?',
    },
    answer: {
      en: 'Yes, you can have guests visit during the day. For overnight guests, we have a policy to ensure comfort for all residents—typically limiting stays to a few nights per month with advance notice to housemates. Details vary by house, so please check with us for specific guidelines.',
      fr: 'Oui, vous pouvez recevoir des invités pendant la journée. Pour les invités dormant sur place, nous avons une politique pour assurer le confort de tous les résidents—généralement en limitant les séjours à quelques nuits par mois avec préavis aux colocataires. Les détails varient selon la maison, alors veuillez vérifier avec nous pour les directives spécifiques.',
    },
  },
  {
    id: 'pets-policy',
    category: 'Community & Lifestyle',
    question: {
      en: 'Are pets allowed?',
      fr: 'Les animaux sont-ils acceptés ?',
    },
    answer: {
      en: 'Unfortunately, we cannot accommodate pets at La Villa due to the shared nature of our living spaces and potential allergies among residents. We appreciate your understanding on this matter.',
      fr: 'Malheureusement, nous ne pouvons pas accommoder d\'animaux chez La Villa en raison de la nature partagée de nos espaces de vie et des allergies potentielles parmi les résidents. Nous apprécions votre compréhension sur ce point.',
    },
  },
  {
    id: 'smoking-policy',
    category: 'Community & Lifestyle',
    question: {
      en: 'What is the smoking policy?',
      fr: 'Quelle est la politique concernant le tabac ?',
    },
    answer: {
      en: 'All our houses are non-smoking indoors. Smoking is permitted only in designated outdoor areas. This policy ensures a healthy, comfortable environment for all residents.',
      fr: 'Toutes nos maisons sont non-fumeurs à l\'intérieur. Le tabac est permis uniquement dans les zones extérieures désignées. Cette politique assure un environnement sain et confortable pour tous les résidents.',
    },
  },
  {
    id: 'alcohol-policy',
    category: 'Community & Lifestyle',
    question: {
      en: 'Is alcohol allowed?',
      fr: 'L\'alcool est-il autorisé ?',
    },
    answer: {
      en: 'Yes, responsible alcohol consumption is allowed. Many residents enjoy a glass of wine during community dinners or social gatherings. We simply ask that all consumption be done responsibly and in accordance with house guidelines.',
      fr: 'Oui, la consommation responsable d\'alcool est autorisée. De nombreux résidents apprécient un verre de vin lors des dîners communautaires ou des rassemblements sociaux. Nous demandons simplement que toute consommation se fasse de manière responsable et conformément aux directives de la maison.',
    },
  },

  // WORK & PRODUCTIVITY
  {
    id: 'work-from-home',
    category: 'Work & Productivity',
    question: {
      en: 'Can I work from home at La Villa?',
      fr: 'Puis-je travailler de chez moi à La Villa ?',
    },
    answer: {
      en: 'Absolutely! All our homes are designed with remote work in mind. We provide dedicated workspaces, high-speed fiber internet throughout the house, comfortable seating, and quiet environments. Many residents work from home full-time and appreciate the seamless blend of professional productivity and community living.',
      fr: 'Absolument ! Toutes nos maisons sont conçues avec le travail à distance à l\'esprit. Nous fournissons des espaces de travail dédiés, internet fibre haut débit dans toute la maison, des sièges confortables et des environnements calmes. De nombreux résidents travaillent de chez eux à temps plein et apprécient le mélange harmonieux de productivité professionnelle et de vie communautaire.',
    },
  },
  {
    id: 'internet-speed',
    category: 'Work & Productivity',
    question: {
      en: 'How fast is the internet?',
      fr: 'Quelle est la vitesse de l\'internet ?',
    },
    answer: {
      en: 'We provide professional-grade fiber optic internet with speeds typically ranging from 300 Mbps to 1 Gbps, depending on the house. The connection is reliable, fast, and perfect for video calls, streaming, gaming, and any work requirements. We also have mesh WiFi systems to ensure strong coverage throughout the house.',
      fr: 'Nous fournissons un internet fibre optique de qualité professionnelle avec des vitesses généralement comprises entre 300 Mbps et 1 Gbps, selon la maison. La connexion est fiable, rapide et parfaite pour les appels vidéo, le streaming, le gaming et toutes les exigences de travail. Nous avons également des systèmes WiFi mesh pour assurer une couverture forte dans toute la maison.',
    },
  },
  {
    id: 'coworking-spaces',
    category: 'Work & Productivity',
    question: {
      en: 'Are there dedicated coworking spaces?',
      fr: 'Y a-t-il des espaces de coworking dédiés ?',
    },
    answer: {
      en: 'Yes, each room has its own desk, chair, good lighting, and power outlets to work properly for long hours when needed. There are no dedicated work areas but enough space for you to find a quiet spot.',
      fr: 'Oui, chaque chambre dispose de son propre bureau, chaise, bon éclairage et prises électriques pour travailler confortablement pendant de longues heures si nécessaire. Il n\'y a pas d\'espaces de travail dédiés mais suffisamment d\'espace pour trouver un coin tranquille.',
    },
  },
  {
    id: 'meeting-rooms',
    category: 'Work & Productivity',
    question: {
      en: 'Are there spaces for private calls or meetings?',
      fr: 'Y a-t-il des espaces pour les appels privés ou les réunions ?',
    },
    answer: {
      en: 'Yes, we understand the need for privacy during work calls. Our houses have designated quiet areas and some have private call booths or small meeting rooms. You can also use your private bedroom for calls, as all rooms are well-insulated for sound.',
      fr: 'Oui, nous comprenons le besoin d\'intimité pendant les appels professionnels. Nos maisons disposent de zones calmes désignées et certaines ont des cabines d\'appel privées ou de petites salles de réunion. Vous pouvez également utiliser votre chambre privée pour les appels, car toutes les chambres sont bien insonorisées.',
    },
  },
  {
    id: 'printer-access',
    category: 'Work & Productivity',
    question: {
      en: 'Is there a printer available?',
      fr: 'Une imprimante est-elle disponible ?',
    },
    answer: {
      en: 'Yes, all our houses have printers available for resident use. Basic printing is typically included, though we may charge for excessive use or specialized printing needs.',
      fr: 'Oui, toutes nos maisons disposent d\'imprimantes disponibles pour les résidents. L\'impression de base est généralement incluse, bien que nous puissions facturer une utilisation excessive ou des besoins d\'impression spécialisés.',
    },
  },
  {
    id: 'business-address',
    category: 'Work & Productivity',
    question: {
      en: 'Can I use La Villa as my business address?',
      fr: 'Puis-je utiliser La Villa comme adresse professionnelle ?',
    },
    answer: {
      en: 'This depends on local regulations and the specific house. Please contact us to discuss your needs, and we can advise on the best solution for your situation.',
      fr: 'Cela dépend des réglementations locales et de la maison spécifique. Veuillez nous contacter pour discuter de vos besoins, et nous pourrons vous conseiller sur la meilleure solution pour votre situation.',
    },
  },

  // LOCATION & TRANSPORT
  {
    id: 'location-geneva',
    category: 'Location & Transport',
    question: {
      en: 'Where exactly are the houses located?',
      fr: 'Où sont exactement situées les maisons ?',
    },
    answer: {
      en: 'Our houses are located in the Grand Genève region in France: La Villa in Ville-la-Grand, Le Loft in Ambilly, and Le Lodge in Annemasse. All are within 30 minutes of Geneva city center, with excellent public transport connections.',
      fr: 'Nos maisons sont situées dans la région du Grand Genève en France : La Villa à Ville-la-Grand, Le Loft à Ambilly et Le Lodge à Annemasse. Toutes sont à moins de 30 minutes du centre de Genève, avec d\'excellentes connexions de transport en commun.',
    },
  },
  {
    id: 'commute-time',
    category: 'Location & Transport',
    question: {
      en: 'How long is the commute to Geneva?',
      fr: 'Combien de temps dure le trajet jusqu\'à Genève ?',
    },
    answer: {
      en: 'The total commute time from our houses to downtown Geneva is typically 25-35 minutes door-to-door. This includes an 8-minute walk to the bus/tram stop and a 15-20 minute ride to the city center. Many residents find this comparable to or faster than commuting within Geneva itself.',
      fr: 'Le temps de trajet total de nos maisons au centre de Genève est généralement de 25 à 35 minutes porte à porte. Cela inclut une marche de 8 minutes jusqu\'à l\'arrêt de bus/tramway et un trajet de 15 à 20 minutes jusqu\'au centre-ville. De nombreux résidents trouvent cela comparable ou plus rapide que de se déplacer dans Genève même.',
    },
  },
  {
    id: 'public-transport',
    category: 'Location & Transport',
    question: {
      en: 'Is public transport easily accessible?',
      fr: 'Les transports en commun sont-ils facilement accessibles ?',
    },
    answer: {
      en: 'Yes, all our houses are within 8 minutes walking distance of public transport that connects directly to Geneva. The TPG (Geneva public transport) network serves our area, making it easy to get anywhere in the city. We also provide electric scooters for residents to use locally.',
      fr: 'Oui, toutes nos maisons sont à moins de 8 minutes à pied des transports en commun qui relient directement Genève. Le réseau TPG (transports publics genevois) dessert notre zone, facilitant l\'accès à n\'importe où dans la ville. Nous fournissons également des trottinettes électriques pour que les résidents puissent se déplacer localement.',
    },
  },
  {
    id: 'parking-car',
    category: 'Location & Transport',
    question: {
      en: 'Can I bring my car?',
      fr: 'Puis-je amener ma voiture ?',
    },
    answer: {
      en: 'Yes, all our houses have parking available. La Villa, Le Lodge and Le Loft offer on-site parking. If you plan to bring a car, please let us know when applying so we can ensure a parking spot is available.',
      fr: 'Oui, toutes nos maisons disposent d\'un parking. La Villa, Le Lodge et Le Loft offrent un parking sur place. Si vous prévoyez d\'amener une voiture, veuillez nous en informer lors de votre candidature pour que nous puissions assurer la disponibilité d\'une place.',
    },
  },
  {
    id: 'bike-storage',
    category: 'Location & Transport',
    question: {
      en: 'Is there bike storage?',
      fr: 'Y a-t-il un rangement pour vélos ?',
    },
    answer: {
      en: 'Yes, all our houses have secure bike storage available. The Geneva area is very bike-friendly, and many residents enjoy cycling to work or for leisure. We also provide bike maintenance tools at some locations.',
      fr: 'Oui, toutes nos maisons disposent d\'un rangement sécurisé pour vélos. La région de Genève est très favorable aux vélos, et de nombreux résidents aiment faire du vélo pour aller travailler ou pour le loisir. Nous fournissons également des outils d\'entretien de vélos dans certains emplacements.',
    },
  },
  {
    id: 'airport-access',
    category: 'Location & Transport',
    question: {
      en: 'How far is the airport?',
      fr: 'À quelle distance est l\'aéroport ?',
    },
    answer: {
      en: 'Geneva Airport (GVA) is approximately 30-40 minutes away by public transport or car. This makes La Villa an excellent choice for frequent travelers and international professionals.',
      fr: 'L\'aéroport de Genève (GVA) est à environ 30 à 40 minutes en transport en commun ou en voiture. Cela fait de La Villa un excellent choix pour les voyageurs fréquents et les professionnels internationaux.',
    },
  },
  {
    id: 'nearby-amenities',
    category: 'Location & Transport',
    question: {
      en: 'What amenities are nearby?',
      fr: 'Quels équipements sont à proximité ?',
    },
    answer: {
      en: 'Our houses are located near supermarkets, pharmacies, restaurants, cafes, gyms, and other essential services. Ville-la-Grand, Ambilly, and Annemasse all have vibrant town centers with everything you need for daily life.',
      fr: 'Nos maisons sont situées près de supermarchés, pharmacies, restaurants, cafés, salles de sport et autres services essentiels. Ville-la-Grand, Ambilly et Annemasse ont tous des centres-villes dynamiques avec tout ce dont vous avez besoin pour la vie quotidienne.',
    },
  },

  // APPLICATION PROCESS
  {
    id: 'how-to-apply',
    category: 'Application Process',
    question: {
      en: 'How do I apply to live at La Villa?',
      fr: 'Comment puis-je candidater pour vivre à La Villa ?',
    },
    answer: {
      en: 'The application process is simple: 1) Fill out the online application form with your details, 2) Schedule a video call with us, 3) Have a 20-minute conversation to get to know each other, 4) Visit the house and meet your potential housemates, 5) If approved, sign your lease and move in!',
      fr: 'Le processus de candidature est simple : 1) Remplissez le formulaire de candidature en ligne avec vos coordonnées, 2) Planifiez un appel vidéo avec nous, 3) Ayez une conversation de 20 minutes pour faire connaissance, 4) Visitez la maison et rencontrez vos futurs colocataires, 5) Si approuvé, signez votre bail et emménagez !',
    },
  },
  {
    id: 'application-requirements',
    category: 'Application Process',
    question: {
      en: 'What are the requirements to apply?',
      fr: 'Quelles sont les exigences pour candidater ?',
    },
    answer: {
      en: 'We look for open-minded, respectful individuals who share our community values. You should be employed or have a stable income source, be able to commit to our minimum stay requirement, and be excited about community living. We welcome applicants from all backgrounds and nationalities.',
      fr: 'Nous recherchons des personnes ouvertes d\'esprit et respectueuses qui partagent nos valeurs communautaires. Vous devriez être employé ou avoir une source de revenus stable, pouvoir vous engager sur notre durée de séjour minimum, et être enthousiaste à l\'idée de la vie communautaire. Nous accueillons des candidats de tous horizons et nationalités.',
    },
  },
  {
    id: 'application-timeline',
    category: 'Application Process',
    question: {
      en: 'How long does the application process take?',
      fr: 'Combien de temps dure le processus de candidature ?',
    },
    answer: {
      en: 'The typical timeline is 1-2 weeks from initial application to move-in. This includes the video call, house visit, application review, and lease signing. If you have urgent timing needs, please let us know and we\'ll do our best to accommodate.',
      fr: 'Le délai typique est de 1 à 2 semaines entre la candidature initiale et l\'emménagement. Cela inclut l\'appel vidéo, la visite de la maison, l\'examen de la candidature et la signature du bail. Si vous avez des besoins urgents de calendrier, veuillez nous en informer et nous ferons de notre mieux pour accommoder.',
    },
  },
  {
    id: 'visit-before-applying',
    category: 'Application Process',
    question: {
      en: 'Can I visit before applying?',
      fr: 'Puis-je visiter avant de candidater ?',
    },
    answer: {
      en: 'We typically schedule house visits after the initial video call as part of the application process. This allows us to get to know you first and ensures the visit is productive for both parties. Virtual tours are also available on our website.',
      fr: 'Nous planifions généralement les visites de maison après l\'appel vidéo initial dans le cadre du processus de candidature. Cela nous permet de faire votre connaissance d\'abord et d\'assurer que la visite est productive pour les deux parties. Des visites virtuelles sont également disponibles sur notre site web.',
    },
  },
  {
    id: 'rejection-reasons',
    category: 'Application Process',
    question: {
      en: 'Why might an application be rejected?',
      fr: 'Pourquoi une candidature pourrait-elle être rejetée ?',
    },
    answer: {
      en: 'Applications may be declined if we don\'t have availability, if the timing doesn\'t align, or if we feel the community fit isn\'t optimal. This isn\'t a judgment of character—we\'re simply committed to creating balanced, harmonious communities. We often keep applications on file for future openings.',
      fr: 'Les candidatures peuvent être refusées si nous n\'avons pas de disponibilité, si le calendrier ne s\'aligne pas, ou si nous sentons que l\'adéquation communautaire n\'est pas optimale. Ce n\'est pas un jugement de caractère—nous sommes simplement engagés à créer des communautés équilibrées et harmonieuses. Nous conservons souvent les candidatures pour les ouvertures futures.',
    },
  },
  {
    id: 'waitlist',
    category: 'Application Process',
    question: {
      en: 'Is there a waitlist if there are no current openings?',
      fr: 'Y a-t-il une liste d\'attente s\'il n\'y a pas de places disponibles ?',
    },
    answer: {
      en: 'Yes, we maintain a waitlist for interested applicants when we don\'t have immediate availability. Joining the waitlist is free and puts you first in line when a room becomes available. We\'ll contact you as soon as something opens up.',
      fr: 'Oui, nous maintenons une liste d\'attente pour les candidats intéressés quand nous n\'avons pas de disponibilité immédiate. Rejoindre la liste d\'attente est gratuit et vous met en première ligne quand une chambre devient disponible. Nous vous contacterons dès qu\'une place se libère.',
    },
  },

  // LIVING EXPERIENCE
  {
    id: 'moving-in',
    category: 'Living Experience',
    question: {
      en: 'What do I need to bring when I move in?',
      fr: 'Que dois-je apporter quand j\'emménage ?',
    },
    answer: {
      en: 'Just your personal belongings! All furniture, bedding, kitchenware, and household essentials are provided. We recommend bringing your clothes, personal items, electronics, and any decorative items to make your room feel like home. Everything else is taken care of.',
      fr: 'Juste vos affaires personnelles ! Tous les meubles, la literie, la vaisselle et les essentiels domestiques sont fournis. Nous recommandons d\'apporter vos vêtements, articles personnels, électronique et tout article décoratif pour que votre chambre soit comme chez vous. Tout le reste est pris en charge.',
    },
  },
  {
    id: 'house-rules',
    category: 'Living Experience',
    question: {
      en: 'Are there house rules?',
      fr: 'Y a-t-il des règles de maison ?',
    },
    answer: {
      en: 'Yes, we have basic house rules to ensure everyone has a positive experience. These include respecting quiet hours (typically 10 PM - 7 AM), cleaning up after yourself in common areas, respecting others\' privacy, and following our guest and smoking policies. Full rules are provided upon move-in.',
      fr: 'Oui, nous avons des règles de maison de base pour assurer que tout le monde a une expérience positive. Celles-ci incluent le respect des heures de calme (généralement 22h - 7h), le nettoyage après vous dans les espaces communs, le respect de la vie privée des autres, et le respect de nos politiques d\'invités et de tabac. Les règles complètes sont fournies à l\'emménagement.',
    },
  },
  {
    id: 'cleaning-schedule',
    category: 'Living Experience',
    question: {
      en: 'How often are common areas cleaned?',
      fr: 'À quelle fréquence les espaces communs sont-ils nettoyés ?',
    },
    answer: {
      en: 'Common areas are professionally cleaned weekly. This includes the kitchen, living rooms, bathrooms, and hallways. Residents are expected to clean up after themselves daily (dishes, counters, etc.), but the deep cleaning is handled for you.',
      fr: 'Les espaces communs sont nettoyés professionnellement chaque semaine. Cela inclut la cuisine, les salons, les salles de bain et les couloirs. Les résidents sont censés nettoyer après eux quotidiennement (vaisselle, comptoirs, etc.), mais le nettoyage en profondeur est géré pour vous.',
    },
  },
  {
    id: 'room-cleaning',
    category: 'Living Experience',
    question: {
      en: 'Is my bedroom cleaned too?',
      fr: 'Ma chambre est-elle également nettoyée ?',
    },
    answer: {
      en: 'Bedroom cleaning is typically the resident\'s responsibility, though we can arrange additional cleaning services for an extra fee if desired. Your private space remains private, and you maintain it as you prefer.',
      fr: 'Le nettoyage de la chambre est généralement la responsabilité du résident, bien que nous puissions organiser des services de nettoyage supplémentaires pour un supplément si désiré. Votre espace privé reste privé, et vous l\'entretenez comme vous préférez.',
    },
  },
  {
    id: 'maintenance-requests',
    category: 'Living Experience',
    question: {
      en: 'How do maintenance requests work?',
      fr: 'Comment fonctionnent les demandes de maintenance ?',
    },
    answer: {
      en: 'Simply send us a message via WhatsApp or email, and we\'ll handle it promptly. Our team is responsive and takes care of all maintenance issues, from minor repairs to larger concerns. You don\'t have to deal with landlords or contractors—we handle everything.',
      fr: 'Envoyez-nous simplement un message via WhatsApp ou email, et nous nous en occupons rapidement. Notre équipe est réactive et prend en charge tous les problèmes de maintenance, des petites réparations aux préoccupations plus importantes. Vous n\'avez pas à vous occuper des propriétaires ou des entrepreneurs—nous gérons tout.',
    },
  },
  {
    id: 'conflict-resolution',
    category: 'Living Experience',
    question: {
      en: 'What happens if there are conflicts between residents?',
      fr: 'Que se passe-t-il s\'il y a des conflits entre résidents ?',
    },
    answer: {
      en: 'We take community harmony seriously. If conflicts arise, we\'re available to mediate and help find solutions. Our curated selection process helps prevent many issues, but when they do occur, we work with all parties to resolve them respectfully and fairly.',
      fr: 'Nous prenons l\'harmonie communautaire au sérieux. Si des conflits surviennent, nous sommes disponibles pour médiater et aider à trouver des solutions. Notre processus de sélection sélectionné aide à prévenir de nombreux problèmes, mais quand ils surviennent, nous travaillons avec toutes les parties pour les résoudre respectueusement et équitablement.',
    },
  },
  {
    id: 'mail-packages',
    category: 'Living Experience',
    question: {
      en: 'How does mail and package delivery work?',
      fr: 'Comment fonctionnent la livraison du courrier et des colis ?',
    },
    answer: {
      en: 'Each house has a designated mail area where letters and packages are delivered. You can receive mail and packages at the house address. For valuable items, we recommend being present for delivery or arranging pickup at a nearby delivery point.',
      fr: 'Chaque maison dispose d\'une zone de courrier désignée où les lettres et colis sont livrés. Vous pouvez recevoir du courrier et des colis à l\'adresse de la maison. Pour les articles de valeur, nous recommandons d\'être présent pour la livraison ou d\'organiser un retrait dans un point de livraison proche.',
    },
  },
  {
    id: 'safety-security',
    category: 'Living Experience',
    question: {
      en: 'How safe are the houses?',
      fr: 'Les maisons sont-elles sûres ?',
    },
    answer: {
      en: 'Safety is a top priority. Our houses are in safe residential neighborhoods, equipped with secure entry systems, and each resident has their own room key. We also have safety protocols in place for emergencies. The areas we operate in are known for being safe and family-friendly.',
      fr: 'La sécurité est une priorité absolue. Nos maisons sont dans des quartiers résidentiels sûrs, équipées de systèmes d\'entrée sécurisés, et chaque résident a sa propre clé de chambre. Nous avons également des protocoles de sécurité en place pour les urgences. Les zones où nous opérons sont connues pour être sûres et familiales.',
    },
  },

  // SERVICES & AMENITIES
  {
    id: 'pool-access',
    category: 'Services & Amenities',
    question: {
      en: 'Can I use the pool anytime?',
      fr: 'Puis-je utiliser la piscine à tout moment ?',
    },
    answer: {
      en: 'Pool access is available during reasonable hours (typically 8 AM - 10 PM), respecting quiet hours for neighbors. The pools are heated and maintained year-round. Some houses have indoor pools, others outdoor—check specific house details for more information.',
      fr: 'L\'accès à la piscine est disponible pendant des heures raisonnables (généralement 8h - 22h), respectant les heures de calme pour les voisins. Les piscines sont chauffées et entretenues toute l\'année. Certaines maisons ont des piscines intérieures, d\'autres extérieures—vérifiez les détails spécifiques de la maison pour plus d\'informations.',
    },
  },
  {
    id: 'gym-equipment',
    category: 'Services & Amenities',
    question: {
      en: 'What gym equipment is available?',
      fr: 'Quel équipement de salle de sport est disponible ?',
    },
    answer: {
      en: 'Our gyms are fully equipped with cardio machines (treadmills, bikes), weight training equipment, free weights, yoga mats, and exercise accessories. Each house has a different setup, but all provide everything you need for a complete workout.',
      fr: 'Nos salles de sport sont entièrement équipées avec des machines cardio (tapis de course, vélos), équipement de musculation, haltères, tapis de yoga et accessoires d\'exercice. Chaque maison a une configuration différente, mais toutes fournissent tout ce dont vous avez besoin pour un entraînement complet.',
    },
  },
  {
    id: 'sauna-access',
    category: 'Services & Amenities',
    question: {
      en: 'Is the sauna included?',
      fr: 'Le sauna est-il inclus ?',
    },
    answer: {
      en: 'Yes, sauna access is included in your rent at all houses that have this feature. It\'s a perfect way to relax after work or a workout. Usage guidelines are provided to ensure everyone can enjoy this amenity.',
      fr: 'Oui, l\'accès au sauna est inclus dans votre loyer dans toutes les maisons qui disposent de cette fonctionnalité. C\'est un moyen parfait de se détendre après le travail ou un entraînement. Les directives d\'utilisation sont fournies pour assurer que tout le monde puisse profiter de cet équipement.',
    },
  },
  {
    id: 'yoga-classes',
    category: 'Services & Amenities',
    question: {
      en: 'Are yoga classes really included?',
      fr: 'Les cours de yoga sont-ils vraiment inclus ?',
    },
    answer: {
      en: 'Yes! We offer weekly yoga and fitness classes led by professional instructors. These are included in your rent and are a great way to stay fit and meet fellow residents. Class schedules vary by house and season.',
      fr: 'Oui ! Nous proposons des cours de yoga et fitness hebdomadaires animés par des instructeurs professionnels. Ceux-ci sont inclus dans votre loyer et sont un excellent moyen de rester en forme et de rencontrer d\'autres résidents. Les horaires des cours varient selon la maison et la saison.',
    },
  },
  {
    id: 'streaming-services',
    category: 'Services & Amenities',
    question: {
      en: 'What streaming services are included?',
      fr: 'Quels services de streaming sont inclus ?',
    },
    answer: {
      en: 'We provide subscriptions to major streaming services like Netflix, allowing residents to enjoy movies and shows in our entertainment areas or on their personal devices. Specific services may vary by house.',
      fr: 'Nous fournissons des abonnements aux principaux services de streaming comme Netflix, permettant aux résidents de profiter de films et séries dans nos espaces de divertissement ou sur leurs appareils personnels. Les services spécifiques peuvent varier selon la maison.',
    },
  },
  {
    id: 'gaming-consoles',
    category: 'Services & Amenities',
    question: {
      en: 'Are there gaming consoles available?',
      fr: 'Y a-t-il des consoles de jeu disponibles ?',
    },
    answer: {
      en: 'Yes, our entertainment areas include gaming consoles for resident use. They\'re a great way to unwind and connect with housemates over friendly competition.',
      fr: 'Oui, nos espaces de divertissement incluent des consoles de jeu pour l\'usage des résidents. Ce sont d\'excellents moyens de se détendre et de se connecter avec les colocataires lors de compétitions amicales.',
    },
  },
  {
    id: 'outdoor-spaces',
    category: 'Services & Amenities',
    question: {
      en: 'What outdoor spaces are available?',
      fr: 'Quels espaces extérieurs sont disponibles ?',
    },
    answer: {
      en: 'Our houses feature beautiful outdoor spaces including gardens, terraces, BBQ areas, and of course, pools. These spaces are designed for relaxation, socializing, and enjoying the fresh air. Outdoor furniture is provided for your comfort.',
      fr: 'Nos maisons disposent de magnifiques espaces extérieurs incluant des jardins, terrasses, espaces BBQ et bien sûr des piscines. Ces espaces sont conçus pour la détente, les échanges sociaux et profiter de l\'air frais. Du mobilier extérieur est fourni pour votre confort.',
    },
  },
  {
    id: 'electric-scooters',
    category: 'Services & Amenities',
    question: {
      en: 'Can I use the electric scooters?',
      fr: 'Puis-je utiliser les trottinettes électriques ?',
    },
    answer: {
      en: 'Yes, electric scooters are available for resident use to explore the local area or get to nearby shops and transport. They\'re a fun, eco-friendly way to get around. Safety guidelines and helmet use are required.',
      fr: 'Oui, des trottinettes électriques sont disponibles pour l\'usage des résidents pour explorer le quartier ou se rendre aux magasins et transports proches. Ce sont un moyen amusant et écologique de se déplacer. Les consignes de sécurité et le port du casque sont obligatoires.',
    },
  },
  {
    id: 'monthly-essentials',
    category: 'Services & Amenities',
    question: {
      en: 'What are monthly essentials?',
      fr: 'Que sont les essentiels mensuels ?',
    },
    answer: {
      en: 'Monthly essentials include household supplies like cleaning products, paper towels, toilet paper, trash bags, and other consumables. These are delivered to the house so residents don\'t have to worry about running out of basics.',
      fr: 'Les essentiels mensuels incluent des fournitures ménagères comme des produits d\'entretien, essuie-tout, papier toilette, sacs poubelle et autres consommables. Ceux-ci sont livrés à la maison pour que les résidents n\'aient pas à s\'inquiéter de manquer de produits de base.',
    },
  },
  {
    id: 'support-response-time',
    category: 'Services & Amenities',
    question: {
      en: 'How quickly do you respond to questions or issues?',
      fr: 'À quelle vitesse répondez-vous aux questions ou problèmes ?',
    },
    answer: {
      en: 'We pride ourselves on responsive support. For urgent matters, we typically respond within hours via WhatsApp. Non-urgent questions are usually answered within 24 hours. Our team is dedicated to ensuring your living experience is smooth and enjoyable.',
      fr: 'Nous sommes fiers de notre support réactif. Pour les questions urgentes, nous répondons généralement dans les heures via WhatsApp. Les questions non urgentes sont généralement répondues dans les 24 heures. Notre équipe est dédiée à assurer que votre expérience de vie soit fluide et agréable.',
    },
  },

  // ADDITIONAL SEO QUESTIONS
  {
    id: 'coliving-geneva-area',
    category: 'Getting Started',
    question: {
      en: 'Is there coliving near Geneva?',
      fr: 'Y a-t-il du coliving près de Genève ?',
    },
    answer: {
      en: 'Yes! La Villa Coliving offers premium coliving experiences just 30 minutes from Geneva city center. Our houses in Ville-la-Grand, Ambilly, and Annemasse provide easy access to Geneva while offering more space, better amenities, and better value than city-center options.',
      fr: 'Oui ! La Villa Coliving offre des expériences de coliving premium à seulement 30 minutes du centre de Genève. Nos maisons à Ville-la-Grand, Ambilly et Annemasse offrent un accès facile à Genève tout en proposant plus d\'espace, de meilleurs équipements et un meilleur rapport qualité-prix que les options en centre-ville.',
    },
  },
  {
    id: 'coliving-france-geneva',
    category: 'Getting Started',
    question: {
      en: 'Can I live in France and work in Geneva?',
      fr: 'Puis-je vivre en France et travailler à Genève ?',
    },
    answer: {
      en: 'Absolutely! Many of our residents live in our French locations and work in Geneva. The commute is typically 25-35 minutes door-to-door, making it very manageable. Plus, you benefit from lower living costs in France while earning Swiss salaries.',
      fr: 'Absolument ! Beaucoup de nos résidents vivent dans nos emplacements français et travaillent à Genève. Le trajet est généralement de 25 à 35 minutes porte à porte, ce qui est très gérable. De plus, vous bénéficiez de coûts de vie plus bas en France tout en gagnant des salaires suisses.',
    },
  },
  {
    id: 'coliving-for-expats',
    category: 'Getting Started',
    question: {
      en: 'Is La Villa good for expats?',
      fr: 'La Villa est-elle bien pour les expatriés ?',
    },
    answer: {
      en: 'La Villa is perfect for expats! We provide a ready-made community, fully furnished accommodation, and support navigating life in a new country. Many of our residents are international professionals, so you\'ll find people who understand the expat experience. We can also help with practical matters like setting up bank accounts and understanding local systems.',
      fr: 'La Villa est parfaite pour les expatriés ! Nous fournissons une communauté toute prête, un logement entièrement meublé et un soutien pour naviguer dans la vie dans un nouveau pays. Beaucoup de nos résidents sont des professionnels internationaux, donc vous trouverez des personnes qui comprennent l\'expérience expatriée. Nous pouvons également aider avec des questions pratiques comme l\'ouverture de comptes bancaires et la compréhension des systèmes locaux.',
    },
  },
  {
    id: 'coliving-digital-nomads',
    category: 'Getting Started',
    question: {
      en: 'Do you welcome digital nomads?',
      fr: 'Accueillez-vous les nomades digitaux ?',
    },
    answer: {
      en: 'Yes, digital nomads are very welcome at La Villa! Our high-speed internet, dedicated workspaces, and flexible terms make us an ideal base for remote workers. You\'ll find a community of like-minded professionals and all the amenities you need to be productive while enjoying life in the Geneva area.',
      fr: 'Oui, les nomades digitaux sont les bienvenus chez La Villa ! Notre internet haut débit, nos espaces de travail dédiés et nos conditions flexibles font de nous une base idéale pour les travailleurs à distance. Vous trouverez une communauté de professionnels partageant les mêmes idées et tous les équipements dont vous avez besoin pour être productif tout en profitant de la vie dans la région de Genève.',
    },
  },
  {
    id: 'coliving-short-term',
    category: 'Getting Started',
    question: {
      en: 'Can I stay for just a few months?',
      fr: 'Puis-je rester seulement quelques mois ?',
    },
    answer: {
      en: 'Our minimum stay is two months, which works well for many short-term needs. After that, you can stay as long as you like with just one month\'s notice when you decide to leave. This flexibility makes us a great option for project-based work, internships, or trying out life in the Geneva area.',
      fr: 'Notre séjour minimum est de deux mois, ce qui fonctionne bien pour de nombreux besoins à court terme. Après cela, vous pouvez rester aussi longtemps que vous le souhaitez avec seulement un mois de préavis quand vous décidez de partir. Cette flexibilité fait de nous une excellente option pour le travail basé sur des projets, des stages ou pour essayer la vie dans la région de Genève.',
    },
  },
  {
    id: 'coliving-vs-airbnb',
    category: 'Getting Started',
    question: {
      en: 'How is coliving different from Airbnb?',
      fr: 'En quoi le coliving est-il différent d\'Airbnb ?',
    },
    answer: {
      en: 'Unlike Airbnb, coliving at La Villa provides a stable, long-term community rather than temporary accommodation. You have your own private room in a home with consistent housemates, all-inclusive services, professional management, and amenities designed for daily living. It\'s a home, not a hotel.',
      fr: 'Contrairement à Airbnb, le coliving chez La Villa fournit une communauté stable et à long terme plutôt qu\'un hébergement temporaire. Vous avez votre propre chambre privée dans une maison avec des colocataires constants, des services tout inclus, une gestion professionnelle et des équipements conçus pour la vie quotidienne. C\'est un chez-soi, pas un hôtel.',
    },
  },
  {
    id: 'coliving-for-introverts',
    category: 'Community & Lifestyle',
    question: {
      en: 'Is coliving suitable for introverts?',
      fr: 'Le coliving est-il adapté aux introvertis ?',
    },
    answer: {
      en: 'Absolutely! Many of our residents are introverts who appreciate having their own private space while knowing community is available when they want it. Your bedroom is your private sanctuary, and participation in social activities is always optional. You can have as much or as little social interaction as you prefer.',
      fr: 'Absolument ! Beaucoup de nos résidents sont des introvertis qui apprécient d\'avoir leur propre espace privé tout en sachant que la communauté est disponible quand ils le souhaitent. Votre chambre est votre sanctuaire privé, et la participation aux activités sociales est toujours optionnelle. Vous pouvez avoir autant ou aussi peu d\'interactions sociales que vous préférez.',
    },
  },
  {
    id: 'coliving-couples',
    category: 'Community & Lifestyle',
    question: {
      en: 'Can couples live at La Villa?',
      fr: 'Les couples peuvent-ils vivre à La Villa ?',
    },
    answer: {
      en: 'Our rooms are designed for individual residents, and our community dynamic works best with single occupants. However, we occasionally have larger rooms that can accommodate couples. Please contact us to discuss your specific situation.',
      fr: 'Nos chambres sont conçues pour des résidents individuels, et notre dynamique communautaire fonctionne mieux avec des occupants seuls. Cependant, nous avons occasionnellement des chambres plus grandes qui peuvent accommoder des couples. Veuillez nous contacter pour discuter de votre situation spécifique.',
    },
  },
  {
    id: 'food-included',
    category: 'Services & Amenities',
    question: {
      en: 'Is food included in the rent?',
      fr: 'La nourriture est-elle incluse dans le loyer ?',
    },
    answer: {
      en: 'Food is not included in the rent, but our kitchens are fully equipped for cooking, and we organize monthly community dinners. Many residents enjoy cooking together and sharing meals. There are also supermarkets and restaurants nearby for all your dining needs.',
      fr: 'La nourriture n\'est pas incluse dans le loyer, mais nos cuisines sont entièrement équipées pour cuisiner, et nous organisons des dîners communautaires mensuels. Beaucoup de résidents aiment cuisiner ensemble et partager des repas. Il y a également des supermarchés et restaurants à proximité pour tous vos besoins alimentaires.',
    },
  },
  {
    id: 'wifi-everywhere',
    category: 'Work & Productivity',
    question: {
      en: 'Is there WiFi throughout the house?',
      fr: 'Y a-t-il du WiFi dans toute la maison ?',
    },
    answer: {
      en: 'Yes, we have high-speed WiFi coverage throughout all our houses, including bedrooms, common areas, gardens, and terraces. Our mesh network ensures strong, reliable connectivity wherever you are in the house.',
      fr: 'Oui, nous avons une couverture WiFi haut débit dans toutes nos maisons, incluant les chambres, espaces communs, jardins et terrasses. Notre réseau mesh assure une connectivité forte et fiable où que vous soyez dans la maison.',
    },
  },
];

// Helper function to get FAQ by category
export const getFAQByCategory = (category: string, _language: 'en' | 'fr') => {
  return faqData.filter((item) => item.category === category);
};

// Helper function to search FAQ
export const searchFAQ = (query: string, language: 'en' | 'fr') => {
  const searchTerm = query.toLowerCase();
  return faqData.filter(
    (item) =>
      item.question[language].toLowerCase().includes(searchTerm) ||
      item.answer[language].toLowerCase().includes(searchTerm)
  );
};

export default faqData;
