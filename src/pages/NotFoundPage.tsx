import { LocalizedLink } from "@/components/LocalizedLink";
import { COLOC_GENEVE_PILLAR_FR } from "@/lib/siteLinks";
import { useLanguage } from "@/contexts/LanguageContext";
import { Home, ArrowLeft } from "lucide-react";
import { SEO } from "@/components/SEO";

// Prérendue en /404 → dist/404.html, que Vercel sert en HTTP 404 pour toute URL sans fichier ni
// rewrite — dont /blog/<slug> sans prérendu depuis le 28/09/2026 (fix soft-404).
// `article` : réutilisée par BlogPostPage pour un article introuvable. Même corps que le 404.html
// (hydratation sans #418 quand Vercel l'a servi), seules les balises de tête changent.
// `data-not-found` : repère lu par main.tsx avant l'hydratation (document servi = ce 404).
export function NotFoundPage({ article = false }: { article?: boolean }) {
  const { language } = useLanguage();

  const keyLinks =
    language === "en"
      ? [
          { to: "/en/colocation-geneve", label: "Shared Housing Geneva" },
          { to: "/en/tarifs", label: "Pricing" },
          { to: "/en/candidature", label: "Apply" },
          { to: "/en/blog", label: "Blog" },
        ]
      : [
          { to: COLOC_GENEVE_PILLAR_FR, label: "Colocation Genève" },
          { to: "/tarifs", label: "Tarifs" },
          { to: "/candidature", label: "Candidater" },
          { to: "/blog", label: "Blog" },
        ];

  return (
    <main className="relative pt-16" data-not-found="">
      {/* noindex ⇒ ni canonical ni hreflang (SEO.tsx) ; omitLocalBusiness : aucun JSON-LD sur une 404. */}
      <SEO
        title={
          article
            ? language === "en" ? "Article not found" : "Article introuvable"
            : language === "en" ? "404 — Page Not Found" : "404 — Page introuvable"
        }
        description={
          article
            ? language === "en"
              ? "This article does not exist or has been moved."
              : "Cet article n'existe pas ou a été déplacé."
            : language === "en"
              ? "The page you are looking for does not exist."
              : "La page que tu cherches n'existe pas."
        }
        noindex
        omitLocalBusiness
      />
      <section className="min-h-[70vh] flex items-center justify-center bg-white">
        <div className="container-custom text-center">
          <h1
            className="text-8xl md:text-9xl font-black text-[#E7E5E4] mb-4"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            404
          </h1>
          <h2
            className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-4"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            {language === "en" ? "Page Not Found" : "Page introuvable"}
          </h2>
          <p className="text-lg text-[#57534E] max-w-md mx-auto mb-8">
            {language === "en"
              ? "The page you're looking for doesn't exist or has been moved."
              : "La page que tu cherches n'existe pas ou a été déplacée."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <LocalizedLink
              to={language === "en" ? "/en" : "/"}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#44403C] text-white font-medium rounded-lg hover:bg-[#57534E] transition-colors"
            >
              <Home size={18} />
              {language === "en" ? "Back to Home" : "Retour à l'accueil"}
            </LocalizedLink>
            <LocalizedLink
              to={language === "en" ? "/en/nos-maisons" : "/nos-maisons"}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#E7E5E4] text-[#1C1917] font-medium rounded-lg hover:border-[#44403C] transition-colors"
            >
              <ArrowLeft size={18} />
              {language === "en" ? "View Our Houses" : "Voir nos maisons"}
            </LocalizedLink>
          </div>
          <nav aria-label={language === "en" ? "Key pages" : "Pages clés"}>
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#57534E]">
              {keyLinks.map((l) => (
                <li key={l.to}>
                  <LocalizedLink to={l.to} className="hover:text-[#1C1917] underline underline-offset-4">
                    {l.label}
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </main>
  );
}
