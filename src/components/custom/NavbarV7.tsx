import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * VERSION 7: JEUNE + NOMADE + ZEN + FRAIS
 * Palette: Sauge (#7c9a6d) + Terracotta doux (#d4897a) + Crème frais (#faf9f5) + Bleu ciel (#a8c5d9)
 * Style: Lifestyle, décontracté, organique
 */

export function NavbarV7() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    
    { path: "/blog", label: "Blog" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#faf9f5]/95 backdrop-blur-md shadow-[0_2px_20px_rgba(124,154,109,0.08)]"
          : "bg-transparent"
      }`}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo - style décontracté */}
          <Link to="/" className="flex items-center group">
            <img
              src="/logos/NEW Logo La Villa-14.png"
              alt="La Villa Coliving"
              className="h-16 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation - style plus léger */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm transition-all duration-300 ${
                  isActive(link.path)
                    ? "text-[#7c9a6d] font-medium"
                    : "text-[#5a6355] hover:text-[#7c9a6d]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="text-sm text-[#5a6355] hover:text-[#7c9a6d] transition-colors duration-300"
            >
              {language === "en" ? "FR" : "EN"}
            </button>

            {/* CTA Button - style organique */}
            <Link
              to="/join-us"
              className="px-6 py-2.5 bg-[#7c9a6d] text-white text-sm font-medium rounded-full hover:bg-[#6b8560] transition-all duration-300 hover:shadow-[0_4px15px_rgba(124,154,109,0.3)]"
            >
              {language === "en" ? "Join us" : "Nous rejoindre"}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-[#7c9a6d]/10 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="text-[#5a6355]" size={24} />
            ) : (
              <Menu className="text-[#5a6355]" size={24} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[#faf9f5] shadow-[0_10px_40px_rgba(124,154,109,0.1)] rounded-b-3xl">
            <div className="py-6 px-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-lg py-3 px-4 rounded-xl transition-all duration-300 ${
                    isActive(link.path)
                      ? "text-[#7c9a6d] font-medium bg-[#7c9a6d]/10"
                      : "text-[#5a6355] hover:text-[#7c9a6d] hover:bg-[#7c9a6d]/5"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-4 pt-4 mt-4 border-t border-[#7c9a6d]/20">
                <button
                  onClick={toggleLanguage}
                  className="text-sm text-[#5a6355] px-4"
                >
                  {language === "en" ? "FR" : "EN"}
                </button>
                <Link
                  to="/join-us"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 px-6 py-3 bg-[#7c9a6d] text-white text-center font-medium rounded-full"
                >
                  {language === "en" ? "Join us" : "Nous rejoindre"}
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
