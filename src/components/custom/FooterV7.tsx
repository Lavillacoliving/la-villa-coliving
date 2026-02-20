import { Link } from "react-router-dom";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
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
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-[#D4A574] flex-shrink-0" />
                <a
                  href="tel:+33664315134"
                  className="text-[#78716C] hover:text-[#E0BB8A] transition-colors duration-300 text-sm"
                >
                  +33 6 64 31 51 34
                </a>
              </div>
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-[18px] h-[18px] flex-shrink-0 text-[#D4A574] fill-current">
                  <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.905 15.905 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.336 22.594c-.39 1.1-1.932 2.014-3.182 2.28-.854.18-1.968.324-5.722-1.23-4.806-1.988-7.898-6.868-8.138-7.188-.228-.32-1.918-2.554-1.918-4.872s1.214-3.456 1.644-3.928c.43-.472.94-.59 1.252-.59.312 0 .624.002.898.016.288.014.674-.11.998.762.39 1.05 1.098 3.456 1.176 3.696.078.24.312.766-.078 1.236-.156.236-.39.54-.546.696-.312.312-.234.546.078.94.312.39 1.384 2.282 2.97 3.696 2.042 1.818 3.764 2.38 4.298 2.638.43.208.684.174.936-.104.252-.28 1.084-1.264 1.374-1.698.288-.43.578-.358.976-.214.398.144 2.526 1.192 2.958 1.41.43.214.718.324.824.5.104.18.104 1.028-.286 2.128z" />
                </svg>
                <a
                  href="https://wa.me/33664315134"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#78716C] hover:text-[#E0BB8A] transition-colors duration-300 text-sm"
                >
                  WhatsApp
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
