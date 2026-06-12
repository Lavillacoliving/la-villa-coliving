import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { LocalizedLink } from "@/components/LocalizedLink";
import { localizePath } from "@/lib/localizedPath";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { Clock, Calendar, User, ArrowLeft, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Helmet } from "react-helmet";
import { SEO } from "@/components/SEO";
import { buildBreadcrumbSchema } from "@/lib/structuredData";
import { getIntentBucket, type IntentBucket } from "@/data/blogIntentBuckets";

interface Post {
  id:string; slug:string;
  title_fr:string; title_en:string|null;
  excerpt_fr:string; excerpt_en:string|null;
  content_fr:string; content_en:string|null;
  meta_description_fr:string|null; meta_description_en:string|null;
  author:string; category:string;
  image_url:string|null;
  read_time_min:number; published_at:string;
  updated_at:string|null;
  tags:string[];
}

interface RelatedPost {
  id:string; slug:string;
  title_fr:string; title_en:string|null;
  excerpt_fr:string; excerpt_en:string|null;
  image_url:string|null;
  read_time_min:number; category:string;
}
const CL:Record<string,Record<string,string>>={
  coliving:{en:"Coliving",fr:"Coliving"},lifestyle:{en:"Lifestyle",fr:"Lifestyle"},
  tips:{en:"Tips",fr:"Conseils"},geneva:{en:"Geneva",fr:"Genève"},
  community:{en:"Community",fr:"Communauté"},
};

// CTA copy per intent bucket (see src/data/blogIntentBuckets.ts). Editorial rules:
// tutoiement, loyer en CHF, « 0 frais » = conséquence du modèle, aucun concurrent.
// Paths are language-neutral — localized (/en prefix) at render time.
const CTA_COPY: Record<IntentBucket, {
  headline: { fr: string; en: string };
  primary: { fr: string; en: string; to: string };
  secondary: { fr: string; en: string; to: string };
  mid: { text: { fr: string; en: string }; label: { fr: string; en: string }; to: string };
}> = {
  high: {
    headline: { fr: "Tu cherches une chambre près de Genève ?", en: "Looking for a room near Geneva?" },
    primary: { fr: "Candidater — 2 min, gratuit", en: "Apply — 2 min, free", to: "/candidature" },
    secondary: { fr: "Voir la colocation à Genève", en: "Shared housing in Geneva", to: "/colocation-geneve" },
    mid: {
      text: { fr: "29 chambres tout inclus dès 1 380 CHF/mois, à 15 min de Genève — 0 frais de dossier.", en: "29 all-inclusive rooms from CHF 1,380/month, 15 min from Geneva — no application fee." },
      label: { fr: "Candidater (2 min, gratuit)", en: "Apply (2 min, free)" }, to: "/candidature",
    },
  },
  medium: {
    headline: { fr: "Envie d'un logement tout inclus près de Genève ?", en: "Want all-inclusive housing near Geneva?" },
    primary: { fr: "Candidater — 2 min, gratuit", en: "Apply — 2 min, free", to: "/candidature" },
    secondary: { fr: "Voir la colocation à Genève", en: "Shared housing in Geneva", to: "/colocation-geneve" },
    mid: {
      text: { fr: "Chambres disponibles dès 1 380 CHF/mois tout inclus, à 15 min de Genève — 0 frais de dossier.", en: "Rooms available from CHF 1,380/month all-inclusive, 15 min from Geneva — no application fee." },
      label: { fr: "Voir les chambres disponibles", en: "See available rooms" }, to: "/nos-maisons",
    },
  },
  admin: {
    headline: { fr: "Tu prépares ton installation côté France ?", en: "Planning your move to the French side?" },
    primary: { fr: "Voir les chambres", en: "See the rooms", to: "/colocation-geneve" },
    secondary: { fr: "Candidater", en: "Apply", to: "/candidature" },
    mid: {
      text: { fr: "Tu prépares ton installation côté France ? Chambres disponibles dès 1 380 CHF/mois tout inclus.", en: "Planning your move to the French side? Rooms available from CHF 1,380/month all-inclusive." },
      label: { fr: "Voir les chambres disponibles", en: "See available rooms" }, to: "/nos-maisons",
    },
  },
  life: {
    headline: { fr: "Envie d'habiter à 15 min de Genève, sans la galère ?", en: "Want to live 15 minutes from Geneva, hassle-free?" },
    primary: { fr: "Découvre nos maisons", en: "Discover our houses", to: "/nos-maisons" },
    secondary: { fr: "Candidater", en: "Apply", to: "/candidature" },
    mid: {
      text: { fr: "Envie d'habiter à 15 min de Genève, sans la galère ? Trois maisons tout inclus dès 1 380 CHF/mois.", en: "Want to live 15 minutes from Geneva, hassle-free? Three all-inclusive houses from CHF 1,380/month." },
      label: { fr: "Découvre nos maisons", en: "Discover our houses" }, to: "/nos-maisons",
    },
  },
  coliving: {
    headline: { fr: "Envie de vivre en coliving près de Genève ?", en: "Want to live in coliving near Geneva?" },
    primary: { fr: "Candidater — 2 min, gratuit", en: "Apply — 2 min, free", to: "/candidature" },
    secondary: { fr: "Voir la colocation à Genève", en: "Shared housing in Geneva", to: "/colocation-geneve" },
    mid: {
      text: { fr: "Chambres disponibles dès 1 380 CHF/mois tout inclus, à 15 min de Genève — 0 frais de dossier.", en: "Rooms available from CHF 1,380/month all-inclusive, 15 min from Geneva — no application fee." },
      label: { fr: "Voir les chambres disponibles", en: "See available rooms" }, to: "/nos-maisons",
    },
  },
};

// Mid-article CTA: for substantial reads (>800 words — GA4 path data shows the blog
// converts ~nobody without an in-body block; decision Jérôme 2026-06-11),
// split at the "## " heading closest to the middle so both halves stay substantial.
// Bails out on edge cases (fenced code, <2 headings, off-center split) — then the
// article renders unsplit, exactly as before.
function splitForMidCta(md: string): [string, string] | null {
  if (md.includes("```")) return null;
  if (md.split(/\s+/).length <= 800) return null;
  const headings: number[] = [];
  const re = /^## /gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(md)) !== null) headings.push(m.index);
  if (headings.length < 2) return null;
  const mid = md.length / 2;
  let best = -1;
  for (const idx of headings) {
    if (best === -1 || Math.abs(idx - mid) < Math.abs(best - mid)) best = idx;
  }
  if (best < md.length * 0.25 || best > md.length * 0.75) return null;
  return [md.slice(0, best), md.slice(best)];
}

export function BlogPostPage() {
  const { slug } = useParams<{slug:string}>();
  const { language } = useLanguage();
  const [post, setPost] = useState<Post|null>(null);
  const [related, setRelated] = useState<RelatedPost[]>([]);
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
      // Load related articles (same category or recent)
      if (data) loadRelated(data.id, data.category);
    } catch(e) { console.error("Blog post load:",e); }
    finally { setLoading(false); }
  }

  async function loadRelated(postId:string, category:string) {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id,slug,title_fr,title_en,excerpt_fr,excerpt_en,image_url,read_time_min,category")
        .eq("is_published", true)
        .neq("id", postId)
        .order("published_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      if (!data) return;
      // Prioritize same-category articles, then fill with recent ones
      const sameCategory = data.filter(p => p.category === category);
      const others = data.filter(p => p.category !== category);
      setRelated([...sameCategory, ...others].slice(0, 3));
    } catch(e) { console.error("Related posts load:", e); }
  }

  if(loading) return (
    <main className="relative pt-16">
      <div className="py-32 text-center text-[#57534E]">
        {language==="en"?"Loading...":"Chargement..."}
      </div>
    </main>
  );
  if(!post) return (
    <main className="relative pt-16">
      <div className="py-32 text-center">
        <p className="text-[#57534E] text-lg mb-4">{language==="en"?"Article not found":"Article introuvable"}</p>
        <LocalizedLink to="/blog" className="text-[#D4A574] hover:underline">{language==="en"?"Back to blog":"Retour au blog"}</LocalizedLink>
      </div>
    </main>
  );

  const title = (language==="en"&&post.title_en)?post.title_en:post.title_fr;
  const excerpt = (language==="en"&&post.excerpt_en)?post.excerpt_en:post.excerpt_fr;
  const content = (language==="en"&&post.content_en)?post.content_en:post.content_fr;
  // Meta description dédiée si renseignée en base (optimisée SEO), sinon excerpt
  const metaDescription = language==="en"
    ? (post.meta_description_en || excerpt)
    : (post.meta_description_fr || excerpt);
  const fmtD = (d:string) => new Date(d).toLocaleDateString(language==="en"?"en-US":"fr-FR",{year:"numeric",month:"long",day:"numeric"});

  const L = language === "en" ? "en" : "fr";
  // Localize language-neutral internal paths for the EN site (/x → /en/x).
  const loc = (p: string) => localizePath(p, language);
  const bucket = getIntentBucket(post.slug, post.category);
  const cta = CTA_COPY[bucket];
  const midSplit = splitForMidCta(content);
  // Same guarded gtag pattern as the candidature form (JoinPageV4): measure which
  // CTA position/variant drives applications, never block the UI on analytics.
  const trackCta = (position: "mid" | "end", target: string) => {
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "cta_click", {
        cta_position: position, cta_target: target, article_slug: post.slug, intent: bucket, language,
      });
    } catch { /* noop */ }
  };

  // Markdown renderers — shared by both halves when the article is split for the mid CTA.
  const mdComponents = {
    // B6: a leading "# H1" in article content would create a 2nd <h1> (the page title is already the <h1>).
    // Render markdown H1 as <h2> so each blog page keeps exactly one <h1>.
    h1: ({children}: {children?: React.ReactNode}) => (
      <h2 className="text-2xl md:text-3xl font-semibold text-[#1C1917] mt-12 mb-4" style={{fontFamily:"DM Serif Display, serif"}}>{children}</h2>
    ),
    h2: ({children}: {children?: React.ReactNode}) => (
      <h2 className="text-2xl md:text-3xl font-semibold text-[#1C1917] mt-12 mb-4" style={{fontFamily:"DM Serif Display, serif"}}>{children}</h2>
    ),
    h3: ({children}: {children?: React.ReactNode}) => (
      <h3 className="text-xl md:text-2xl font-semibold text-[#1C1917] mt-8 mb-3" style={{fontFamily:"DM Serif Display, serif"}}>{children}</h3>
    ),
    p: ({children}: {children?: React.ReactNode}) => <p className="mb-6 leading-relaxed">{children}</p>,
    strong: ({children}: {children?: React.ReactNode}) => <strong className="font-semibold text-[#1C1917]">{children}</strong>,
    ul: ({children}: {children?: React.ReactNode}) => <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>,
    ol: ({children}: {children?: React.ReactNode}) => <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>,
    li: ({children}: {children?: React.ReactNode}) => <li className="leading-relaxed">{children}</li>,
    a: ({href, children}: {href?: string; children?: React.ReactNode}) => {
      // Internal links use React Router for SPA navigation + better SEO signal
      if (href && (href.startsWith('/') || href.startsWith('https://www.lavillacoliving.com'))) {
        const internalPath = href.startsWith('https://www.lavillacoliving.com')
          ? href.replace('https://www.lavillacoliving.com', '')
          : href;
        // Content stores language-neutral paths; on the EN site, prefix /en so
        // anglophone readers stay on EN pages (every FR route has an /en twin).
        return <LocalizedLink to={loc(internalPath)} className="text-[#D4A574] hover:underline">{children}</LocalizedLink>;
      }
      // External links open in new tab
      return <a href={href} className="text-[#D4A574] hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>;
    },
    table: ({children}: {children?: React.ReactNode}) => (
      <div className="overflow-x-auto my-8">
        <table className="w-full border-collapse text-sm">{children}</table>
      </div>
    ),
    thead: ({children}: {children?: React.ReactNode}) => <thead className="bg-[#F5F2ED]">{children}</thead>,
    th: ({children}: {children?: React.ReactNode}) => <th className="border border-[#E7E5E4] px-4 py-3 text-left font-semibold text-[#1C1917]">{children}</th>,
    td: ({children}: {children?: React.ReactNode}) => <td className="border border-[#E7E5E4] px-4 py-3">{children}</td>,
    blockquote: ({children}: {children?: React.ReactNode}) => (
      <blockquote className="border-l-4 border-[#D4A574] pl-6 italic text-[#57534E] my-6">{children}</blockquote>
    ),
  };

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
    dateModified: post.updated_at || post.published_at,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.lavillacoliving.com/blog/${post.slug}`,
    },
    keywords: post.tags?.join(", ") || "coliving, genève, colocation",
    wordCount: content.split(/\s+/).length,
    inLanguage: language === "en" ? "en" : "fr",
  };

  return (
    <main className="relative pt-16">
      <SEO
        title={title}
        description={metaDescription}
        url={`https://www.lavillacoliving.com/blog/${post.slug}`}
        image={post.image_url || undefined}
        type="article"
        jsonLd={blogPostingSchema}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(buildBreadcrumbSchema([
          { name: language === "en" ? "Home" : "Accueil", url: `https://www.lavillacoliving.com${language === "en" ? "/en" : ""}/` },
          { name: "Blog", url: `https://www.lavillacoliving.com${language === "en" ? "/en" : ""}/blog` },
          { name: title, url: `https://www.lavillacoliving.com${language === "en" ? "/en" : ""}/blog/${post.slug}` },
        ]))}</script>
      </Helmet>
      <article className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <LocalizedLink to="/blog" className="inline-flex items-center gap-2 text-[#57534E] hover:text-[#D4A574] mb-8 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {language==="en"?"Back to blog":"Retour au blog"}
          </LocalizedLink>
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
            {midSplit ? (
              <>
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{midSplit[0]}</ReactMarkdown>
                {/* Mid-article CTA — long reads only (>1500 words), message variant by intent bucket */}
                <aside className="my-10 px-6 py-5 bg-[#FAF9F6] border border-[#E7E5E4] rounded-lg text-center">
                  <p className="text-[#1C1917] font-medium mb-2">{cta.mid.text[L]}</p>
                  <LocalizedLink
                    to={loc(cta.mid.to)}
                    onClick={() => trackCta("mid", cta.mid.to)}
                    className="inline-flex items-center gap-2 text-[#D4A574] font-semibold hover:underline"
                  >
                    {cta.mid.label[L]}
                    <ArrowRight className="w-4 h-4" />
                  </LocalizedLink>
                </aside>
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{midSplit[1]}</ReactMarkdown>
              </>
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{content}</ReactMarkdown>
            )}
          </div>

          {post.tags&&post.tags.length>0&&(
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-[#E7E5E4]">
              {post.tags.map(t=><span key={t} className="text-xs px-3 py-1 bg-[#F5F2ED] text-[#57534E] rounded-full">{t}</span>)}
            </div>
          )}
        </div>
      </article>

      {/* Colocation Genève CTA — SEO pillar page link from every blog article */}
      <section className="py-12 lg:py-16 bg-[#FAF9F6] border-t border-[#E7E5E4]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2
            className="text-xl md:text-2xl font-light text-[#1C1917] mb-3"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {cta.headline[L]}
          </h2>
          <p className="text-sm text-[#78716C] mb-6 max-w-lg mx-auto">
            {language === "en"
              ? "29 furnished all-inclusive rooms from CHF 1,380/month — utilities, fiber, cleaning, pool, gym, 15 min from Geneva. No application fee, reply within 48h."
              : "29 chambres meublées tout inclus dès 1 380 CHF/mois — charges, fibre, ménage, piscine, gym, à 15 min de Genève. 0 frais de dossier, réponse sous 48 h."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <LocalizedLink
              to={loc(cta.primary.to)}
              onClick={() => trackCta("end", cta.primary.to)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4A574] text-[#1C1917] text-sm font-semibold rounded-lg hover:bg-[#E0BB8A] transition-all duration-300"
            >
              {cta.primary[L]}
              <ArrowRight className="w-4 h-4" />
            </LocalizedLink>
            <LocalizedLink
              to={loc(cta.secondary.to)}
              onClick={() => trackCta("end", cta.secondary.to)}
              className="inline-flex items-center gap-2 px-6 py-3 border border-[#E7E5E4] text-[#44403C] text-sm font-medium rounded-lg hover:border-[#D4A574] transition-all duration-300"
            >
              {cta.secondary[L]}
            </LocalizedLink>
          </div>
        </div>
      </section>

      {/* Discover our houses — internal linking from blog to conversion pages */}
      <section className="py-16 lg:py-20 bg-white border-t border-[#E7E5E4]">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1917] mb-3 text-center"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en" ? "Discover our houses" : "Découvrez nos maisons"}
          </h2>
          <p className="text-sm text-[#78716C] text-center mb-10">
            {language === "en"
              ? "Three premium coliving houses 15 min from Geneva, all-inclusive from CHF 1,380/month."
              : "Trois maisons de coliving premium à 15 min de Genève, tout inclus dès 1 380 CHF/mois."}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { slug: "lavilla", labelFr: "La Villa", labelEn: "La Villa", img: "/images/la villa.webp", descFr: "10 chambres · piscine · jardin", descEn: "10 rooms · pool · garden" },
              { slug: "lelodge", labelFr: "Le Lodge", labelEn: "Le Lodge", img: "/images/le lodge.webp", descFr: "12 chambres · sauna · gym", descEn: "12 rooms · sauna · gym" },
              { slug: "leloft", labelFr: "Le Loft", labelEn: "Le Loft", img: "/images/le loft glamour.webp", descFr: "7 chambres · home cinéma", descEn: "7 rooms · home cinema" },
            ].map((h) => (
              <LocalizedLink
                key={h.slug}
                to={language === "en" ? `/en/${h.slug}` : `/${h.slug}`}
                className="group bg-white border border-[#E7E5E4] overflow-hidden hover:border-[#D4A574]/40 hover:shadow-lg transition-all"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={h.img} alt={`${h.labelFr} — coliving près de Genève`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-medium text-[#1C1917] mb-1 group-hover:text-[#D4A574] transition-colors" style={{ fontFamily: "DM Serif Display, serif" }}>
                    {language === "en" ? h.labelEn : h.labelFr}
                  </h3>
                  <p className="text-sm text-[#57534E]">{language === "en" ? h.descEn : h.descFr}</p>
                </div>
              </LocalizedLink>
            ))}
          </div>
        </div>
      </section>

      {/* Related Articles — improves internal linking for SEO */}
      {related.length > 0 && (
        <section className="py-16 lg:py-24 bg-[#FAF9F6]">
          <div className="max-w-5xl mx-auto px-6">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1917] mb-8 text-center"
              style={{ fontFamily: "DM Serif Display, serif" }}
            >
              {language === "en" ? "Related Articles" : "Articles Connexes"}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r) => {
                const rTitle = (language === "en" && r.title_en) ? r.title_en : r.title_fr;
                const rExcerpt = (language === "en" && r.excerpt_en) ? r.excerpt_en : r.excerpt_fr;
                return (
                  <LocalizedLink
                    to={`/blog/${r.slug}`}
                    key={r.id}
                    className="group bg-white border border-[#E7E5E4] overflow-hidden hover:border-[#D4A574]/30 hover:shadow-lg transition-all"
                  >
                    {r.image_url && (
                      <div className="aspect-[16/10] overflow-hidden">
                        <img src={r.image_url} alt={rTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      </div>
                    )}
                    <div className="p-5">
                      <span className="text-xs uppercase tracking-widest text-[#D4A574] font-medium mb-2 block">
                        {CL[r.category]?.[language] || r.category}
                      </span>
                      <h3 className="text-base font-medium text-[#1C1917] mb-2 line-clamp-2 group-hover:text-[#D4A574] transition-colors" style={{ fontFamily: "DM Serif Display, serif" }}>
                        {rTitle}
                      </h3>
                      <p className="text-sm text-[#57534E] line-clamp-2">{rExcerpt}</p>
                      <span className="flex items-center gap-1 text-xs text-[#78716C] mt-3">
                        <Clock className="w-3 h-3" /> {r.read_time_min} min
                      </span>
                    </div>
                  </LocalizedLink>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
