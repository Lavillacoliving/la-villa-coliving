import { Link } from "react-router-dom";
import { Instagram, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * VERSION 9: BOUTIQUE HOSPITALITY
 * Footer style premium et chaleureux
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
    <footer className="bg-[#1B4332] relative">
      <div className="container-custom py-16 md:py-20 relative">
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
            <p className="text-[#9CA39E] max-w-md mb-6 leading-relaxed">
              {language === "en"
                ? "Premium coliving homes near Geneva. Where comfort meets community."
                : "Maisons de coliving premium près de Genève. Là où confort et communauté se rencontrent."}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/lavillacoliving/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-[#2D6A4F]/20 flex items-center justify-center text-[#9CA39E] hover:bg-[#2D6A4F] hover:text-white transition-all duration-300"
              >
                <Instagram size={18} />
              </a>
              <a
                href="mailto:contact@lavillacoliving.com"
                className="w-11 h-11 rounded-full bg-[#2D6A4F]/20 flex items-center justify-center text-[#9CA39E] hover:bg-[#2D6A4F] hover:text-white transition-all duration-300"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-medium text-[#2D6A4F] mb-6">
              {language === "en" ? "Explore" : "Explorer"}
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-[#9CA39E] hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-medium text-[#2D6A4F] mb-6">
              {language === "en" ? "Say hi" : "Nous contacter"}
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="text-[#B5914A] mt-0.5 flex-shrink-0"
                />
                <span className="text-[#9CA39E] text-sm">
                  Grand Genève, France
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[#B5914A] flex-shrink-0" />
                <a
                  href="mailto:contact@lavillacoliving.com"
                  className="text-[#9CA39E] hover:text-white transition-colors duration-300 text-sm"
                >
                  contact@lavillacoliving.com
                </a>
              </div>
            </div>

            {/* CTA */}
            <Link
              to="/join-us"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-[#2D6A4F] text-white text-sm font-medium rounded-lg hover:bg-[#1B4332] transition-all duration-300"
            >
              {language === "en" ? "Check availability" : "Voir les disponibilités"}
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-[#2D6A4F]/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#6B7370] text-sm">
            &copy; {new Date().getFullYear()} La Villa Coliving.{" "}
            {language === "en"
              ? "Made in Grand Genève"
              : "Fait au Grand Genève"}{" "}
            {language === "en" ? "with love" : "avec amour"}
          </p>
          <p className="text-[#6B7370] text-sm">
            {language === "en"
              ? "Premium coliving near Geneva"
              : "Coliving premium près de Genève."}
          </p>
        </div>
      </div>
    </footer>
  );
}
