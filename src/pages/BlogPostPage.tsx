import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { LocalizedLink } from "@/components/LocalizedLink";
import { localizePath } from "@/lib/localizedPath";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { Clock, Calendar, User, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Helmet } from "react-helmet";
import { SEO } from "@/components/SEO";
import { buildBreadcrumbSchema, buildFaqPageSchema, getFounderByAuthorName, ABOUT_PAGE_LIVE } from "@/lib/structuredData";
import { getIntentBucket } from "@/data/blogIntentBuckets";
import { BlocOffre } from "@/components/BlocOffre";
import { formatPriceChf } from "@/data/stats";
import { YmylNotice, YmylPosture, AuthorBox } from "@/components/YmylNotice";
import { isYmyl } from "@/lib/ymyl";

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

// Les CTA candidature (mi-article + fin d'article) vivent dans BlocOffre
// (photo maison + prix + attribution ?src=bloc_offre — plan blog-conversion
// 07/07/2026) ; l'accroche varie toujours par intent bucket, dans le composant.

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

// Extrait les paires Q/R d'une section FAQ markdown (« # FAQ … », « ## FAQ … » ou
// « ## … questions … ») : questions en gras terminées par « ? », réponse = paragraphe(s)
// qui suivent. Sert au JSON-LD FAQPage — même texte que le visible (règle AEO), markdown aplati.
function extractFaqPairs(md: string): { q: string; a: string }[] {
  // #{1,2} : le titre FAQ peut être de niveau # (gros dossier) ou ## (article standard).
  // Lookahead sur \n#{1,2}\s : la section s'arrête au prochain titre de même niveau ou plus haut.
  // (pas de flag m : avec lui, le $ du lookahead matche chaque fin de ligne et la capture est vide)
  const section = md.match(/(?:^|\n)#{1,2}\s+(?:FAQ[^\n]*|[^\n]*questions?[^\n]*)\n([\s\S]*?)(?=\n#{1,2}\s|\s*$)/i);
  if (!section) return [];
  const pairs: { q: string; a: string }[] = [];
  const re = /\*\*([^*\n]+\?)\*\*\s*\n+([\s\S]*?)(?=\n\s*\*\*[^*\n]+\?\*\*|$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(section[1])) !== null) {
    const q = m[1].trim();
    const a = m[2]
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[*_`>]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (a) pairs.push({ q, a });
  }
  return pairs;
}

// Slug déterministe pour les ancres de chapitre (titre → #slug). Même fonction
// pour l'id du titre rendu ET pour le lien du sommaire → ils correspondent toujours.
function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "") // accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    // Retire un numéro de chapitre en tête (« 1- ») : l'id commence ainsi toujours par une
    // lettre → ancre fiable partout + sélecteur CSS valide (#1-… est rejeté par querySelector).
    .replace(/^\d+-/, "");
}

// Aplati les children React d'un titre en texte brut (pour calculer l'id).
function nodeText(node: React.ReactNode): string {
  if (node === null || node === undefined || node === false) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (typeof node === "object" && "props" in (node as object)) {
    return nodeText((node as { props?: { children?: React.ReactNode } }).props?.children);
  }
  return "";
}

// Sommaire : un item par titre de niveau « # » (chapitre). Les « ## » (sous-sections)
// sont ignorés. Le slug correspond à l'id posé sur le titre rendu.
function extractToc(md: string): { title: string; slug: string }[] {
  const out: { title: string; slug: string }[] = [];
  const re = /^# (?!#)(.+)$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(md)) !== null) {
    const title = m[1].trim();
    out.push({ title, slug: slugify(title) });
  }
  return out;
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
  const faqPairs = extractFaqPairs(content);
  const toc = extractToc(content);
  // Meta description dédiée si renseignée en base (optimisée SEO), sinon excerpt
  const metaDescription = language==="en"
    ? (post.meta_description_en || excerpt)
    : (post.meta_description_fr || excerpt);
  const fmtD = (d:string) => new Date(d).toLocaleDateString(language==="en"?"en-US":"fr-FR",{year:"numeric",month:"long",day:"numeric"});

  const L = language === "en" ? "en" : "fr";
  // Localize language-neutral internal paths for the EN site (/x → /en/x).
  const loc = (p: string) => localizePath(p, language);
  const bucket = getIntentBucket(post.slug, post.category);
  const midSplit = splitForMidCta(content);

  // Markdown renderers — shared by both halves when the article is split for the mid CTA.
  const mdComponents = {
    // B6: a leading "# H1" in article content would create a 2nd <h1> (the page title is already the <h1>).
    // Render markdown H1 as <h2> so each blog page keeps exactly one <h1>.
    // id = slug de chapitre (cible du sommaire) ; scroll-mt-24 pour ne pas passer sous la navbar fixe.
    h1: ({children}: {children?: React.ReactNode}) => (
      <h2 id={slugify(nodeText(children))} className="scroll-mt-24 text-2xl md:text-3xl font-semibold text-[#1C1917] mt-12 mb-4" style={{fontFamily:"DM Serif Display, serif"}}>{children}</h2>
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
      // Ancres internes (#chapitre, ex. depuis le sommaire) : <a> natif même onglet,
      // surtout PAS un Link routeur ni un target=_blank.
      if (href && href.startsWith('#')) {
        return <a href={href} className="text-[#D4A574] hover:underline">{children}</a>;
      }
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

  // Auteur nommé (E-E-A-T) : si le champ author correspond à un fondateur, la byline
  // pointe vers /qui-sommes-nous et le schema Person est corroboré par LinkedIn (sameAs).
  const founder = getFounderByAuthorName(post.author);

  // BlogPosting structured data
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    image: post.image_url || "https://www.lavillacoliving.com/images/la villa jardin.webp",
    author: founder
      ? {
          "@type": "Person",
          name: founder.name,
          jobTitle: founder.jobTitle[L],
          ...(ABOUT_PAGE_LIVE ? { url: "https://www.lavillacoliving.com/qui-sommes-nous" } : {}),
          sameAs: [founder.linkedin],
        }
      : {
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
        {faqPairs.length > 0 && (
          <script type="application/ld+json">{JSON.stringify(buildFaqPageSchema(faqPairs))}</script>
        )}
      </Helmet>
      <article className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6">
          {/* flex w-fit (et non inline-flex) : bloc-niveau largeur-contenu, sinon le
              badge catégorie « inline-block » se colle sur la même ligne (collision). */}
          <LocalizedLink to="/blog" className="flex w-fit items-center gap-2 text-[#57534E] hover:text-[#D4A574] mb-8 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {language==="en"?"Back to blog":"Retour au blog"}
          </LocalizedLink>
          <span className="inline-block text-xs uppercase tracking-widest text-[#D4A574] font-medium mb-4">
            {CL[post.category]?.[language]||post.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-light text-[#1C1917] mb-6" style={{fontFamily:"DM Serif Display, serif"}}>
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#78716C] mb-8 pb-8 border-b border-[#E7E5E4]">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {founder ? (
                <>
                  {ABOUT_PAGE_LIVE ? (
                    <LocalizedLink to="/qui-sommes-nous" className="text-[#44403C] hover:text-[#D4A574] transition-colors">
                      {founder.name}
                    </LocalizedLink>
                  ) : (
                    <span className="text-[#44403C]">{founder.name}</span>
                  )}
                  <span className="hidden sm:inline text-[#A8A29E]">
                    · {founder.jobTitle[L].charAt(0).toLowerCase() + founder.jobTitle[L].slice(1)}
                  </span>
                </>
              ) : (
                post.author
              )}
            </span>
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />{fmtD(post.published_at)}</span>
            {post.updated_at && post.updated_at.slice(0,10) > post.published_at.slice(0,10) && (
              <span className="text-[#A8A29E]">{language === "en" ? `· Updated ${fmtD(post.updated_at)}` : `· Mis à jour le ${fmtD(post.updated_at)}`}</span>
            )}
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{post.read_time_min} min</span>
          </div>
          {/* Encadré « Notre posture » — en tête des articles YMYL, avant l'intro (brief E-E-A-T A.3) */}
          {isYmyl(post.slug) && <YmylPosture slug={post.slug} />}

          {post.image_url && (
            <div className="mb-10 overflow-hidden">
              <img src={post.image_url} alt={title} className="w-full h-auto object-cover" loading="lazy" />
            </div>
          )}

          {/* Sommaire cliquable — articles à chapitres uniquement (≥4 titres « # »).
              Ancres natives (#slug) : fonctionnent sans JS, présentes dans le prérendu. */}
          {toc.length >= 4 && (
            <nav
              aria-label={language === "en" ? "Table of contents" : "Sommaire"}
              className="mb-10 p-6 bg-[#FAF9F6] border border-[#E7E5E4] rounded-lg"
            >
              <p className="text-xs uppercase tracking-widest text-[#D4A574] font-medium mb-4">
                {language === "en" ? "Contents" : "Sommaire"}
              </p>
              <ul className="list-none space-y-2 text-[#44403C]">
                {toc.map((t) => (
                  <li key={t.slug}>
                    <a href={`#${t.slug}`} className="hover:text-[#D4A574] hover:underline transition-colors">
                      {t.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="blog-content max-w-none text-[#44403C]" style={{fontSize:"1.1rem",lineHeight:"1.8"}}>
            {midSplit ? (
              <>
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{midSplit[0]}</ReactMarkdown>
                {/* Bloc offre mi-article — longs formats uniquement (>800 mots), maison + prix + candidature */}
                <BlocOffre variant="mid" slug={post.slug} bucket={bucket} />
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{midSplit[1]}</ReactMarkdown>
              </>
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{content}</ReactMarkdown>
            )}
          </div>

          {isYmyl(post.slug) && <YmylNotice content={content} />}
          <AuthorBox author={post.author} />

          {post.tags&&post.tags.length>0&&(
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-[#E7E5E4]">
              {post.tags.map(t=><span key={t} className="text-xs px-3 py-1 bg-[#F5F2ED] text-[#57534E] rounded-full">{t}</span>)}
            </div>
          )}
        </div>
      </article>

      {/* Bloc offre fin d'article — photo maison + prix + candidature (attribution ?src=bloc_offre) */}
      <BlocOffre variant="end" slug={post.slug} bucket={bucket} />

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
              ? `Three premium coliving houses 20 min from Geneva city center, all-inclusive from ${formatPriceChf("en")}/month.`
              : `Trois maisons de coliving premium à 20 min du centre de Genève, tout inclus dès ${formatPriceChf("fr")}/mois.`}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { slug: "lavilla", labelFr: "La Villa", labelEn: "La Villa", img: "/images/la villa.webp", descFr: "10 chambres · piscine · jardin", descEn: "10 rooms · pool · garden" },
              { slug: "lelodge", labelFr: "Le Lodge", labelEn: "Le Lodge", img: "/images/le lodge.webp", descFr: "12 chambres · sauna · gym", descEn: "12 rooms · sauna · gym" },
              { slug: "leloft", labelFr: "Le Loft", labelEn: "Le Loft", img: "/images/la villa coliving le loft piscine.webp", descFr: "7 chambres · piscine intérieure", descEn: "7 rooms · indoor pool" },
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
