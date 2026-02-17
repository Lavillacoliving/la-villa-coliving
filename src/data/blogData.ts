export interface BlogPost {
  id: string;
  slug: string;
  title: { en: string; fr: string };
  excerpt: { en: string; fr: string };
  content: { en: string; fr: string };
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: number;
}

export const blogCategories = {
  en: ["All", "Coliving", "Lifestyle", "Tips", "Geneva"],
  fr: ["Tous", "Coliving", "Lifestyle", "Conseils", "Genève"],
};

// Category mapping for filtering (internal key → display labels)
export const categoryKeys = ["all", "coliving", "lifestyle", "tips", "geneva"];

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "what-is-coliving-and-why-it-matters",
    title: {
      en: "What Is Coliving and Why It Matters in 2025",
      fr: "Qu'est-ce que le coliving et pourquoi c'est important en 2025",
    },
    excerpt: {
      en: "Coliving is more than a housing trend — it's a response to how modern professionals want to live, work, and connect. Discover why coliving is reshaping the way we think about home.",
      fr: "Le coliving est bien plus qu'une tendance immobilière — c'est une réponse à la façon dont les professionnels modernes veulent vivre, travailler et se connecter. Découvrez pourquoi le coliving redéfinit notre conception du chez-soi.",
    },
    content: {
      en: "Full article content here...",
      fr: "Contenu complet de l'article ici...",
    },
    author: "La Villa Team",
    date: "2025-01-15",
    category: "coliving",
    image: "/images/what-is-coliving-and-why-is-it-so-popular-2.webp",
    readTime: 5,
  },
  {
    id: "2",
    slug: "living-in-france-working-in-geneva",
    title: {
      en: "Living in France, Working in Geneva: The Cross-Border Lifestyle",
      fr: "Vivre en France, travailler à Genève : le mode de vie transfrontalier",
    },
    excerpt: {
      en: "Thousands of professionals cross the Franco-Swiss border every day. Here's how coliving near Geneva offers the perfect balance between quality of life and career opportunities.",
      fr: "Des milliers de professionnels traversent la frontière franco-suisse chaque jour. Voici comment le coliving près de Genève offre l'équilibre parfait entre qualité de vie et opportunités professionnelles.",
    },
    content: {
      en: "Full article content here...",
      fr: "Contenu complet de l'article ici...",
    },
    author: "La Villa Team",
    date: "2025-02-01",
    category: "lifestyle",
    image: "/images/la villa event.webp",
    readTime: 7,
  },
];
