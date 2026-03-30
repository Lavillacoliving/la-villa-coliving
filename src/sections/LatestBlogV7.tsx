import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { Clock, ArrowRight } from "lucide-react";

interface BlogPost {
  id: string;
  slug: string;
  title_fr: string;
  title_en: string | null;
  excerpt_fr: string;
  excerpt_en: string | null;
  image_url: string | null;
  read_time_min: number;
  category: string;
}

const CL: Record<string, Record<string, string>> = {
  coliving: { en: "Coliving", fr: "Coliving" },
  lifestyle: { en: "Lifestyle", fr: "Lifestyle" },
  tips: { en: "Tips", fr: "Conseils" },
  geneva: { en: "Geneva", fr: "Genève" },
  community: { en: "Community", fr: "Communauté" },
};

export function LatestBlogV7() {
  const { language } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id,slug,title_fr,title_en,excerpt_fr,excerpt_en,image_url,read_time_min,category")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      setPosts(data || []);
    } catch (e) {
      console.error("Latest blog load:", e);
    }
  }

  const gT = (p: BlogPost) => (language === "en" && p.title_en) ? p.title_en : p.title_fr;
  const gE = (p: BlogPost) => (language === "en" && p.excerpt_en) ? p.excerpt_en : p.excerpt_fr;

  if (posts.length === 0) return null;

  return (
    <section className="py-24 lg:py-32 bg-white" data-section="latest-blog">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs text-[#78716C] uppercase tracking-[0.3em] mb-4 block">
            {language === "en" ? "From our blog" : "Notre blog"}
          </span>
          <h2
            className="text-3xl md:text-4xl font-light text-[#1C1917] mb-4"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en" ? "Latest Articles" : "Derniers Articles"}
          </h2>
          <p className="text-[#57534E] max-w-2xl mx-auto">
            {language === "en"
              ? "Tips, guides and insights about coliving near Geneva, cross-border life and our community."
              : "Conseils, guides et perspectives sur le coliving près de Genève, la vie frontalière et notre communauté."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              to={`/blog/${post.slug}`}
              key={post.id}
              className="group bg-[#FAF9F6] border border-[#E7E5E4] overflow-hidden transition-all duration-300 hover:border-[#D4A574]/30 hover:shadow-lg"
            >
              <div className="aspect-[16/10] overflow-hidden bg-[#F5F2ED]">
                {post.image_url ? (
                  <img
                    src={post.image_url}
                    alt={gT(post)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#78716C] text-4xl">
                    Blog
                  </div>
                )}
              </div>
              <div className="p-6">
                <span className="inline-block text-xs uppercase tracking-widest text-[#D4A574] font-medium mb-3">
                  {CL[post.category]?.[language] || post.category}
                </span>
                <h3
                  className="text-lg font-medium text-[#1C1917] mb-2 line-clamp-2 group-hover:text-[#D4A574] transition-colors"
                  style={{ fontFamily: "DM Serif Display, serif" }}
                >
                  {gT(post)}
                </h3>
                <p className="text-[#57534E] text-sm leading-relaxed mb-3 line-clamp-2">
                  {gE(post)}
                </p>
                <span className="flex items-center gap-1.5 text-xs text-[#78716C]">
                  <Clock className="w-3.5 h-3.5" />
                  {post.read_time_min} min
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[#D4A574] font-medium hover:underline"
          >
            {language === "en" ? "View all articles" : "Voir tous les articles"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
