import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { Search, Clock, Calendar, User } from "lucide-react";
import { SEO } from "@/components/SEO";

interface BlogPost {
  id: string; slug: string;
  title_fr: string; title_en: string | null;
  excerpt_fr: string; excerpt_en: string | null;
  author: string; category: string;
  image_url: string | null;
  read_time_min: number;
  published_at: string; tags: string[];
}
const CL:Record<string,Record<string,string>>={
  all:{en:"All",fr:"Tous"},coliving:{en:"Coliving",fr:"Coliving"},
  lifestyle:{en:"Lifestyle",fr:"Lifestyle"},tips:{en:"Tips",fr:"Conseils"},
  geneva:{en:"Geneva",fr:"Gen\u00e8ve"},community:{en:"Community",fr:"Communaut\u00e9"},
};

export function BlogPage() {
  const { language } = useLanguage();
  const [sq, setSq] = useState("");
  const [ac, setAc] = useState("all");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadPosts(); }, []);
  async function loadPosts() {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id,slug,title_fr,title_en,excerpt_fr,excerpt_en,author,category,image_url,read_time_min,published_at,tags")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      setPosts(data || []);
    } catch (e) { console.error("Blog load:", e); }
    finally { setLoading(false); }
  }
  const gT = (p:BlogPost) => (language==="en"&&p.title_en)?p.title_en:p.title_fr;
  const gE = (p:BlogPost) => (language==="en"&&p.excerpt_en)?p.excerpt_en:p.excerpt_fr;

  const fp = posts.filter((p) => {
    const ms = sq===""||gT(p).toLowerCase().includes(sq.toLowerCase())||gE(p).toLowerCase().includes(sq.toLowerCase());
    const mc = ac==="all"||p.category===ac;
    return ms&&mc;
  });
  const fmtD = (d:string) => new Date(d).toLocaleDateString(language==="en"?"en-US":"fr-FR",{year:"numeric",month:"long",day:"numeric"});
  const cats = Object.keys(CL);

  return (
    <main className="relative pt-20">
      <SEO
        title={language === "en" ? "Blog — Tips on Shared Housing & Life in Geneva" : "Blog — Conseils Colocation & Vie à Genève"}
        description={language === "en"
          ? "Articles and guides about shared housing in Geneva, coliving, cross-border life and the best neighborhoods."
          : "Articles et guides sur la colocation à Genève, le coliving, la vie frontalière et les meilleurs quartiers."}
        url="https://www.lavillacoliving.com/blog"
      />
      <section className="py-24 lg:py-32 bg-white">
        <div className="container-custom text-center">
          <span className="text-xs text-[#78716C] uppercase tracking-[0.3em] mb-4 block">
            {language==="en"?"Insights & Stories":"Articles & R\u00e9cits"}
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-[#1C1917] mb-6" style={{fontFamily:"DM Serif Display, serif"}}>
            {language==="en"?<>Our <span className="text-[#D4A574]">Blog</span></>:<>Notre <span className="text-[#D4A574]">Blog</span></>}
          </h1>
          <p className="text-lg text-[#57534E] max-w-2xl mx-auto mb-10">
            {language==="en"
              ?"Stories, tips, and insights about coliving, community life, and the Geneva cross-border lifestyle."
              :"R\u00e9cits, conseils et perspectives sur le coliving, la vie en communaut\u00e9 et le mode de vie transfrontalier genevois."}
          </p>
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#78716C]" />
            <input type="text" placeholder={language==="en"?"Search articles...":"Rechercher des articles..."} value={sq} onChange={(e)=>setSq(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-[#E7E5E4] focus:border-[#D4A574] focus:outline-none transition-colors text-[#1C1917]" />
          </div>
        </div>
      </section>
      <section className="py-24 lg:py-32 bg-[#FAF9F6]">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {cats.map((k)=>(
              <button key={k} onClick={()=>setAc(k)}
                className={`px-6 py-3 text-sm font-medium transition-all border ${ac===k?"border-[#D4A574] bg-[#D4A574] text-white":"border-[#E7E5E4] bg-white text-[#57534E] hover:border-[#1C1917] hover:text-[#1C1917]"}`}>
                {CL[k][language]||k}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="text-center py-16"><p className="text-[#57534E] text-lg">{language==="en"?"Loading...":"Chargement..."}</p></div>
          ) : fp.length===0 ? (
            <div className="text-center py-16"><p className="text-[#57534E] text-lg">{language==="en"?"No articles found.":"Aucun article trouv\u00e9."}</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {fp.map((post)=>(
                <Link to={`/blog/${post.slug}`} key={post.id} className="group bg-white border border-[#E7E5E4] overflow-hidden transition-all duration-300 hover:border-[#D4A574]/30 hover:shadow-lg">
                  <div className="aspect-[16/10] overflow-hidden bg-[#F5F2ED]">
                    {post.image_url ? (
                      <img src={post.image_url} alt={gT(post)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#78716C] text-4xl">Blog</div>
                    )}
                  </div>
                  <div className="p-6">
                    <span className="inline-block text-xs uppercase tracking-widest text-[#D4A574] font-medium mb-3">
                      {CL[post.category]?.[language]||post.category}
                    </span>
                    <h3 className="text-xl font-medium text-[#1C1917] mb-3 line-clamp-2 group-hover:text-[#D4A574] transition-colors" style={{fontFamily:"DM Serif Display, serif"}}>
                      {gT(post)}
                    </h3>
                    <p className="text-[#57534E] text-sm leading-relaxed mb-4 line-clamp-3">{gE(post)}</p>
                    {post.tags&&post.tags.length>0&&(
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {post.tags.slice(0,3).map((t)=><span key={t} className="text-xs px-2 py-0.5 bg-[#F5F2ED] text-[#57534E] rounded">{t}</span>)}
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-xs text-[#78716C] pt-4 border-t border-[#F5F2ED]">
                      <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{post.author}</span>
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{fmtD(post.published_at)}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{post.read_time_min} min</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
