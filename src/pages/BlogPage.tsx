import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { blogPosts, blogCategories, categoryKeys } from "@/data/blogData";
import { Search, Clock, Calendar, User } from "lucide-react";

export function BlogPage() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = blogCategories[language];

  // Filter posts based on search and category
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      searchQuery === "" ||
      post.title[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt[language].toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "all" || post.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort posts by date (newest first)
  const sortedPosts = [...filteredPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === "en" ? "en-US" : "fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="relative pt-20">
      {/* Hero */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container-custom text-center">
          <span className="text-xs text-[#999] uppercase tracking-[0.3em] mb-4 block">
            {language === "en" ? "Insights & Stories" : "Articles & Récits"}
          </span>
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-light text-[#1a1a1a] mb-6"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            {language === "en" ? (
              <>
                Our <span className="text-[#c44536]">Blog</span>
              </>
            ) : (
              <>
                Notre <span className="text-[#c44536]">Blog</span>
              </>
            )}
          </h1>
          <p className="text-lg text-[#666] max-w-2xl mx-auto mb-10">
            {language === "en"
              ? "Stories, tips, and insights about coliving, community life, and the Geneva cross-border lifestyle."
              : "Récits, conseils et perspectives sur le coliving, la vie en communauté et le mode de vie transfrontalier genevois."}
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999]" />
            <input
              type="text"
              placeholder={
                language === "en"
                  ? "Search articles..."
                  : "Rechercher des articles..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-[#e5e5e5] focus:border-[#c44536] focus:outline-none transition-colors text-[#1a1a1a]"
            />
          </div>
        </div>
      </section>

      {/* Category Filters + Posts */}
      <section className="py-24 lg:py-32 bg-[#fafafa]">
        <div className="container-custom">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() => setActiveCategory(categoryKeys[index])}
                className={`px-6 py-3 text-sm font-medium transition-all border ${
                  activeCategory === categoryKeys[index]
                    ? "border-[#c44536] bg-[#c44536] text-white"
                    : "border-[#e5e5e5] bg-white text-[#666] hover:border-[#1a1a1a] hover:text-[#1a1a1a]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          {sortedPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#666] text-lg">
                {language === "en"
                  ? "No articles found matching your search."
                  : "Aucun article trouvé correspondant à votre recherche."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedPosts.map((post) => (
                <article
                  key={post.id}
                  className="group bg-white border border-[#e5e5e5] overflow-hidden transition-all duration-300 hover:border-[#c44536]/30 hover:shadow-lg"
                >
                  {/* Image */}
                  <div className="aspect-[16/10] overflow-hidden bg-[#f5f5f5]">
                    <img
                      src={post.image}
                      alt={post.title[language]}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Category Badge */}
                    <span className="inline-block text-xs uppercase tracking-widest text-[#c44536] font-medium mb-3">
                      {categories[categoryKeys.indexOf(post.category)] ||
                        post.category}
                    </span>

                    {/* Title */}
                    <h3
                      className="text-xl font-medium text-[#1a1a1a] mb-3 line-clamp-2 group-hover:text-[#c44536] transition-colors"
                      style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                    >
                      {post.title[language]}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-[#666] text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt[language]}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-[#999] pt-4 border-t border-[#f0f0f0]">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(post.date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime} min
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
