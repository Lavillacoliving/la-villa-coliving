import { Link } from "react-router-dom";
import { Instagram, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * VERSION 7: JEUNE + NOMADE + ZEN + FRAIS
 * Footer style lifestyle et décontracté
 */

export function FooterV7() {
  const { language } = useLanguage();

  const navLinks = [
    { path: "/", label: language === "en" ? "Home" : "Accueil" },
    {
      path: "/the-coliving",
      label: language === "en" ? "The Coliving" : "Le Coliving",
    },
    { path: "/services", label: language === "en" ? "Services" : "Services" },
    {
      path: "/our-houses",
      label: language === "en" ? "Our Houses" : "Nos Maisons",
    },
    { path: "/rates", label: language === "en" ? "Rates" : "Tarifs" },
    { path: "/faq", label: "FAQ" },
    {
      path: "/join-us",
      label: language === "en" ? "Join us" : "Nous rejoindre",
    },
  ];

  return (
    <footer className="bg-[#3d4a38] relative overflow-hidden">
      {/* Organic shapes */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#7c9a6d]/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#d4897a]/10 rounded-full blur-3xl translate-y-1/2" />

      <div className="container-custom py-16 md:py-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img
                src="/logos/NEW Logo La Villa-12.png"
                alt="La Villa Coliving"
                className="h-20 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-[#a8b5a0] max-w-md mb-6 leading-relaxed">
              {language === "en"
                ? "Coliving homes for modern nomads. Community, comfort, and freedom in Grand Genève 🌿"
                : "Maisons de coliving pour nomades modernes. Communauté, confort et liberté au Grand Genève 🌿"}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/lavillacoliving/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-[#7c9a6d]/20 flex items-center justify-center text-[#a8b5a0] hover:bg-[#7c9a6d] hover:text-white transition-all duration-300"
              >
                <Instagram size={18} />
              </a>
              <a
                href="mailto:contact@lavillacoliving.com"
                className="w-11 h-11 rounded-full bg-[#7c9a6d]/20 flex items-center justify-center text-[#a8b5a0] hover:bg-[#7c9a6d] hover:text-white transition-all duration-300"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-medium text-[#7c9a6d] mb-6">
              {language === "en" ? "Explore" : "Explorer"}
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-[#a8b5a0] hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-medium text-[#7c9a6d] mb-6">
              {language === "en" ? "Say hi" : "Dis bonjour"}
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="text-[#d4897a] mt-0.5 flex-shrink-0"
                />
                <span className="text-[#a8b5a0] text-sm">
                  Grand Genève, France 🇫🇷
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[#d4897a] flex-shrink-0" />
                <a
                  href="mailto:contact@lavillacoliving.com"
                  className="text-[#a8b5a0] hover:text-white transition-colors duration-300 text-sm"
                >
                  contact@lavillacoliving.com
                </a>
              </div>
            </div>

            {/* CTA */}
            <Link
              to="/join-us"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-[#7c9a6d] text-white text-sm font-medium rounded-full hover:bg-[#6b8560] transition-all duration-300"
            >
              {language === "en" ? "Apply now" : "Candidater"}
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-[#7c9a6d]/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#7c8a72] text-sm">
            &copy; {new Date().getFullYear()} La Villa Coliving.{" "}
            {language === "en"
              ? "Made in Grand Genève"
              : "Fait au Grand Genève"}{" "}
            {language === "en" ? "with love ❤️" : "avec amour ❤️"}
          </p>
          <p className="text-[#7c8a72] text-sm">
            {language === "en"
              ? "Nomad-friendly coliving"
              : "Coliving pour nomades et frontaliers."}
          </p>
        </div>
      </div>
    </footer>
  );
}
