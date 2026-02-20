import { Link } from "react-router-dom";
import { Instagram, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * VERSION 9: STONE & BRASS — CONDO PREMIUM
 * Footer — stone-deep bg, brass CTA, zero emoji
 */

export function FooterV7() {
  const { language } = useLanguage();

  const navLinks = [
    { path: "/", label: language === "en" ? "Home" : "Accueil" },
    {
      path: "/colocation-geneve",
      label: language === "en" ? "Shared Housing Geneva" : "Colocation Genève",
    },
    {
      path: "/the-coliving",
      label: language === "en" ? "The Coliving" : "Le Coliving",
    },
    {
      path: "/our-houses",
      label: language === "en" ? "Our Houses" : "Nos Maisons",
    },
    { path: "/services", label: language === "en" ? "Services" : "Services" },
    { path: "/rates", label: language === "en" ? "Rates" : "Tarifs" },
    { path: "/faq", label: "FAQ" },
    {
      path: "/join-us",
      label: language === "en" ? "Join us" : "Nous rejoindre",
    },
    { path: "/blog", label: "Blog" },
  ];

  return (
    <footer className="bg-[#1C1917]">
      <div className="container-custom py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img
                src="/logos/NEW Logo La Villa-12.png"
                alt="La Villa Coliving — colocation et coliving premium près de Genève"
                className="h-20 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-[#78716C] max-w-md mb-6 leading-relaxed">
              {language === "en"
                ? "Boutique coliving in Greater Geneva. 3 houses, 29 rooms, pool, sauna and gym in every house. All inclusive."
                : "Coliving boutique au Grand Genève. 3 maisons, 29 chambres, piscine, sauna et salle de sport dans chaque maison. Tout inclus."}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/lavillacoliving/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-lg bg-white/[0.06] flex items-center justify-center text-[#78716C] hover:text-[#E0BB8A] hover:bg-white/[0.1] transition-all duration-300"
              >
                <Instagram size={18} />
              </a>
              <a
                href="mailto:contact@lavillacoliving.com"
                className="w-11 h-11 rounded-lg bg-white/[0.06] flex items-center justify-center text-[#78716C] hover:text-[#E0BB8A] hover:bg-white/[0.1] transition-all duration-300"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-[#FAF9F6] mb-6">
              {language === "en" ? "Explore" : "Explorer"}
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-[#78716C] hover:text-[#E0BB8A] transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-[#FAF9F6] mb-6">
              Contact
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="text-[#D4A574] mt-0.5 flex-shrink-0"
                />
                <span className="text-[#78716C] text-sm">
                  Grand Genève, France
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[#D4A574] flex-shrink-0" />
                <a
                  href="mailto:contact@lavillacoliving.com"
                  className="text-[#78716C] hover:text-[#E0BB8A] transition-colors duration-300 text-sm"
                >
                  contact@lavillacoliving.com
                </a>
              </div>
            </div>

            {/* CTA */}
            <Link
              to="/join-us"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-[#D4A574] text-[#1C1917] text-sm font-semibold rounded-lg hover:bg-[#E0BB8A] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A574] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1917]"
            >
              {language === "en" ? "Apply now" : "Candidater"}
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#78716C] text-sm">
            &copy; {new Date().getFullYear()} La Villa Coliving.{" "}
            {language === "en"
              ? "Made in Grand Genève."
              : "Fait au Grand Genève."}
          </p>
          <p className="text-[#78716C] text-sm">
            {language === "en"
              ? "Boutique coliving near Geneva."
              : "Coliving boutique près de Genève."}
          </p>
        </div>
      </div>
    </footer>
  );
}
