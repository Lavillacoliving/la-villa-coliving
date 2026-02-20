import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { Clock, Calendar, User, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SEO } from "@/components/SEO";

interface Post {
  id:string; slug:string;
  title_fr:string; title_en:string|null;
  excerpt_fr:string; excerpt_en:string|null;
  content_fr:string; content_en:string|null;
  author:string; category:string;
  image_url:string|null;
  read_time_min:number; published_at:string;
  tags:string[];
}
const CL:Record<string,Record<string,string>>={
  coliving:{en:"Coliving",fr:"Coliving"},lifestyle:{en:"Lifestyle",fr:"Lifestyle"},
  tips:{en:"Tips",fr:"Conseils"},geneva:{en:"Geneva",fr:"Genève"},
  community:{en:"Community",fr:"Communauté"},
};

export function BlogPostPage() {
  const { slug } = useParams<{slug:string}>();
  const { language } = useLanguage();
  const [post, setPost] = useState<Post|null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get("preview") === "lavilla2026";

  useEffect(() => {
    if(slug) loadPost(slug);
  }, [slug]);
  async function loadPost(s:string) {
    try {
      let query = supabase
        .from("blog_posts").select("*")
        .eq("slug", s);
      if (!isPreview) query = query.eq("is_published", true);
      const { data, error } = await query.single();
      if (error) throw error;
      setPost(data);
    } catch(e) { console.error("Blog post load:",e); }
    finally { setLoading(false); }
  }

  if(loading) return (
    <main className="relative pt-20">
      <div className="py-32 text-center text-[#57534E]">
        {language==="en"?"Loading...":"Chargement..."}
      </div>
    </main>
  );
  if(!post) return (
    <main className="relative pt-20">
      <div className="py-32 text-center">
        <p className="text-[#57534E] text-lg mb-4">{language==="en"?"Article not found":"Article introuvable"}</p>
        <Link to="/blog" className="text-[#D4A574] hover:underline">{language==="en"?"Back to blog":"Retour au blog"}</Link>
      </div>
    </main>
  );

  const title = (language==="en"&&post.title_en)?post.title_en:post.title_fr;
  const excerpt = (language==="en"&&post.excerpt_en)?post.excerpt_en:post.excerpt_fr;
  const content = (language==="en"&&post.content_en)?post.content_en:post.content_fr;
  const fmtD = (d:string) => new Date(d).toLocaleDateString(language==="en"?"en-US":"fr-FR",{year:"numeric",month:"long",day:"numeric"});

  // BlogPosting structured data
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    image: post.image_url || "https://www.lavillacoliving.com/images/la villa jardin.webp",
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "La Villa Coliving",
      logo: {
        "@type": "ImageObject",
        url: "https://www.lavillacoliving.com/logos/logo-full.png",
      },
    },
    datePublished: post.published_at,
    dateModified: post.published_at,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.lavillacoliving.com/blog/${post.slug}`,
    },
    keywords: post.tags?.join(", ") || "coliving, genève, colocation",
    wordCount: content.split(/\s+/).length,
    inLanguage: language === "en" ? "en" : "fr",
  };

  return (
    <main className="relative pt-20">
      <SEO
        title={title}
        description={excerpt}
        url={`https://www.lavillacoliving.com/blog/${post.slug}`}
        image={post.image_url || undefined}
        type="article"
        jsonLd={blogPostingSchema}
      />
      <article className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <Link to="/blog" className="inline-flex items-center gap-2 text-[#57534E] hover:text-[#D4A574] mb-8 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {language==="en"?"Back to blog":"Retour au blog"}
          </Link>
          <span className="inline-block text-xs uppercase tracking-widest text-[#D4A574] font-medium mb-4">
            {CL[post.category]?.[language]||post.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-light text-[#1C1917] mb-6" style={{fontFamily:"DM Serif Display, serif"}}>
            {title}
          </h1>
          <div className="flex items-center gap-6 text-sm text-[#78716C] mb-8 pb-8 border-b border-[#E7E5E4]">
            <span className="flex items-center gap-2"><User className="w-4 h-4" />{post.author}</span>
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />{fmtD(post.published_at)}</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{post.read_time_min} min</span>
          </div>
          {post.image_url && (
            <div className="mb-10 overflow-hidden">
              <img src={post.image_url} alt={title} className="w-full h-auto object-cover" loading="lazy" />
            </div>
          )}

          <div className="blog-content max-w-none text-[#44403C]" style={{fontSize:"1.1rem",lineHeight:"1.8"}}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({children}) => (
                  <h2 className="text-2xl md:text-3xl font-semibold text-[#1C1917] mt-12 mb-4" style={{fontFamily:"DM Serif Display, serif"}}>{children}</h2>
                ),
                h3: ({children}) => (
                  <h3 className="text-xl md:text-2xl font-semibold text-[#1C1917] mt-8 mb-3" style={{fontFamily:"DM Serif Display, serif"}}>{children}</h3>
                ),
                p: ({children}) => <p className="mb-6 leading-relaxed">{children}</p>,
                strong: ({children}) => <strong className="font-semibold text-[#1C1917]">{children}</strong>,
                ul: ({children}) => <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>,
                li: ({children}) => <li className="leading-relaxed">{children}</li>,
                a: ({href, children}) => (
                  <a href={href} className="text-[#D4A574] hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>
                ),
                table: ({children}) => (
                  <div className="overflow-x-auto my-8">
                    <table className="w-full border-collapse text-sm">{children}</table>
                  </div>
                ),
                thead: ({children}) => <thead className="bg-[#F5F2ED]">{children}</thead>,
                th: ({children}) => <th className="border border-[#E7E5E4] px-4 py-3 text-left font-semibold text-[#1C1917]">{children}</th>,
                td: ({children}) => <td className="border border-[#E7E5E4] px-4 py-3">{children}</td>,
                blockquote: ({children}) => (
                  <blockquote className="border-l-4 border-[#D4A574] pl-6 italic text-[#57534E] my-6">{children}</blockquote>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>

          {post.tags&&post.tags.length>0&&(
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-[#E7E5E4]">
              {post.tags.map(t=><span key={t} className="text-xs px-3 py-1 bg-[#F5F2ED] text-[#57534E] rounded-full">{t}</span>)}
            </div>
          )}
        </div>
      </article>
    </main>
  );
}
