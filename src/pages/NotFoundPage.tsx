import { LocalizedLink } from "@/components/LocalizedLink";
import { COLOC_GENEVE_ARTICLE } from "@/lib/siteLinks";
import { useLanguage } from "@/contexts/LanguageContext";
import { Home, ArrowLeft } from "lucide-react";
import { SEO } from "@/components/SEO";

export function NotFoundPage() {
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
          { to: COLOC_GENEVE_ARTICLE, label: "Colocation Genève" },
          { to: "/tarifs", label: "Tarifs" },
          { to: "/candidature", label: "Candidater" },
          { to: "/blog", label: "Blog" },
        ];

  return (
    <main className="relative pt-16">
      <SEO
        title={language === "en" ? "404 — Page Not Found" : "404 — Page introuvable"}
        description={
          language === "en"
            ? "The page you are looking for does not exist."
            : "La page que vous cherchez n'existe pas."
        }
        noindex
      />
      <section className="min-h-[70vh] flex items-center justify-center bg-white">
        <div className="container-custom text-center">
          <h1
            className="text-8xl md:text-9xl font-black text-[#E7E5E4] mb-4"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            404
          </h1>
          <h2
            className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-4"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {language === "en" ? "Page Not Found" : "Page Introuvable"}
          </h2>
          <p className="text-lg text-[#57534E] max-w-md mx-auto mb-8">
            {language === "en"
              ? "The page you're looking for doesn't exist or has been moved."
              : "La page que vous cherchez n'existe pas ou a été déplacée."}
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
              {language === "en" ? "View Our Houses" : "Voir Nos Maisons"}
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
