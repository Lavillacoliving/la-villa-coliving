import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { Clock, Calendar, User, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";

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

  useEffect(() => {
    if(slug) loadPost(slug);
  }, [slug]);
  async function loadPost(s:string) {
    try {
      const { data, error } = await supabase
        .from("blog_posts").select("*")
        .eq("slug", s).eq("is_published", true).single();
      if (error) throw error;
      setPost(data);
    } catch(e) { console.error("Blog post load:",e); }
    finally { setLoading(false); }
  }

  if(loading) return (
    <main className="relative pt-20">
      <div className="py-32 text-center text-[#666]">
        {language==="en"?"Loading...":"Chargement..."}
      </div>
    </main>
  );
  if(!post) return (
    <main className="relative pt-20">
      <div className="py-32 text-center">
        <p className="text-[#666] text-lg mb-4">{language==="en"?"Article not found":"Article introuvable"}</p>
        <Link to="/blog" className="text-[#c44536] hover:underline">{language==="en"?"Back to blog":"Retour au blog"}</Link>
      </div>
    </main>
  );

  const title = (language==="en"&&post.title_en)?post.title_en:post.title_fr;
  const content = (language==="en"&&post.content_en)?post.content_en:post.content_fr;
  const fmtD = (d:string) => new Date(d).toLocaleDateString(language==="en"?"en-US":"fr-FR",{year:"numeric",month:"long",day:"numeric"});

  return (
    <main className="relative pt-20">
      <article className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <Link to="/blog" className="inline-flex items-center gap-2 text-[#666] hover:text-[#c44536] mb-8 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {language==="en"?"Back to blog":"Retour au blog"}
          </Link>
          <span className="inline-block text-xs uppercase tracking-widest text-[#c44536] font-medium mb-4">
            {CL[post.category]?.[language]||post.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-light text-[#1a1a1a] mb-6" style={{fontFamily:"Plus Jakarta Sans, sans-serif"}}>
            {title}
          </h1>
          <div className="flex items-center gap-6 text-sm text-[#999] mb-8 pb-8 border-b border-[#e5e5e5]">
            <span className="flex items-center gap-2"><User className="w-4 h-4" />{post.author}</span>
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />{fmtD(post.published_at)}</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{post.read_time_min} min</span>
          </div>
          {post.image_url && (
            <div className="mb-10 overflow-hidden">
              <img src={post.image_url} alt={title} className="w-full h-auto object-cover" />
            </div>
          )}

          <div className="blog-content max-w-none text-[#333]" style={{fontSize:"1.1rem",lineHeight:"1.8"}}>
            <ReactMarkdown
              components={{
                h2: ({children}) => (
                  <h2 className="text-2xl md:text-3xl font-semibold text-[#1a1a1a] mt-12 mb-4" style={{fontFamily:"Plus Jakarta Sans, sans-serif"}}>{children}</h2>
                ),
                h3: ({children}) => (
                  <h3 className="text-xl md:text-2xl font-semibold text-[#1a1a1a] mt-8 mb-3" style={{fontFamily:"Plus Jakarta Sans, sans-serif"}}>{children}</h3>
                ),
                p: ({children}) => <p className="mb-6 leading-relaxed">{children}</p>,
                strong: ({children}) => <strong className="font-semibold text-[#1a1a1a]">{children}</strong>,
                ul: ({children}) => <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>,
                li: ({children}) => <li className="leading-relaxed">{children}</li>,
                a: ({href, children}) => (
                  <a href={href} className="text-[#c44536] hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>
                ),
                table: ({children}) => (
                  <div className="overflow-x-auto my-8">
                    <table className="w-full border-collapse text-sm">{children}</table>
                  </div>
                ),
                thead: ({children}) => <thead className="bg-[#f5f5f5]">{children}</thead>,
                th: ({children}) => <th className="border border-[#e5e5e5] px-4 py-3 text-left font-semibold text-[#1a1a1a]">{children}</th>,
                td: ({children}) => <td className="border border-[#e5e5e5] px-4 py-3">{children}</td>,
                blockquote: ({children}) => (
                  <blockquote className="border-l-4 border-[#c44536] pl-6 italic text-[#666] my-6">{children}</blockquote>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>

          {post.tags&&post.tags.length>0&&(
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-[#e5e5e5]">
              {post.tags.map(t=><span key={t} className="text-xs px-3 py-1 bg-[#f0f0f0] text-[#666] rounded-full">{t}</span>)}
            </div>
          )}
        </div>
      </article>
    </main>
  );
}
