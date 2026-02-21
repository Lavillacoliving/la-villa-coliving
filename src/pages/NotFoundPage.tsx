import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Home, ArrowLeft } from "lucide-react";
import { SEO } from "@/components/SEO";

export function NotFoundPage() {
  const { language } = useLanguage();

  return (
    <main className="relative pt-20">
      <SEO
        title="404 - Page Not Found"
        description="The page you are looking for does not exist."
        url="https://www.lavillacoliving.com/404"
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
              : "La page que vous cherchez n'existe pas ou a \u00e9t\u00e9 d\u00e9plac\u00e9e."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#44403C] text-white font-medium rounded-lg hover:bg-[#57534E] transition-colors"
            >
              <Home size={18} />
              {language === "en" ? "Back to Home" : "Retour \u00e0 l'accueil"}
            </Link>
            <Link
              to="/nos-maisons"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#E7E5E4] text-[#1C1917] font-medium rounded-lg hover:border-[#44403C] transition-colors"
            >
              <ArrowLeft size={18} />
              {language === "en" ? "View Our Houses" : "Voir Nos Maisons"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
