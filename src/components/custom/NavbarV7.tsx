import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * VERSION 9: BOUTIQUE HOSPITALITY
 * Palette: Forest #2D6A4F + Gold #B5914A + Cream #FAF8F3
 * Style: Intimate, premium, warm
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
      path: "/colocation-geneve",
      label: language === "en" ? "Geneva Housing" : "Colocation Genève",
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
    { path: "/blog", label: "Blog" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#FAF8F3]/95 backdrop-blur-md shadow-[0_2px_20px_rgba(45,106,79,0.08)]"
          : "bg-transparent"
      }`}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo - style décontracté */}
          <Link to="/" className="flex items-center group">
            <img
              src="/logos/NEW Logo La Villa-14.png"
              alt="La Villa Coliving — colocation et coliving premium près de Genève"
              className="h-16 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation - style plus léger */}
          <div className="hidden lg:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm transition-all duration-300 ${
                  isActive(link.path)
                    ? "text-[#2D6A4F] font-medium"
                    : "text-[#4A4A4A] hover:text-[#2D6A4F]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="text-sm text-[#4A4A4A] hover:text-[#2D6A4F] transition-colors duration-300"
            >
              {language === "en" ? "FR" : "EN"}
            </button>

            {/* Portail */}
            <Link
              to="/portail"
              className="text-sm text-[#4A4A4A] hover:text-[#2D6A4F] transition-all duration-300"
            >
              {language === "en" ? "Portal" : "Portail"}
            </Link>
            {/* CTA Button - style organique */}
            <Link
              to="/join-us"
              className="px-6 py-2.5 bg-[#2D6A4F] text-white text-sm font-medium rounded-lg hover:bg-[#1B4332] transition-all duration-300 hover:shadow-[0_4px_15px_rgba(45,106,79,0.3)]"
            >
              {language === "en" ? "Join us" : "Nous rejoindre"}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-[#2D6A4F]/10 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="text-[#4A4A4A]" size={24} />
            ) : (
              <Menu className="text-[#4A4A4A]" size={24} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[#FAF8F3] shadow-[0_10px_40px_rgba(45,106,79,0.1)] rounded-b-3xl">
            <div className="py-6 px-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-lg py-3 px-4 rounded-xl transition-all duration-300 ${
                    isActive(link.path)
                      ? "text-[#2D6A4F] font-medium bg-[#2D6A4F]/10"
                      : "text-[#4A4A4A] hover:text-[#2D6A4F] hover:bg-[#2D6A4F]/5"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/portail"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg py-3 px-4 rounded-xl text-[#4A4A4A] hover:text-[#2D6A4F]"
              >
                {language === "en" ? "Portal" : "Portail"}
              </Link>
              <div className="flex items-center gap-4 pt-4 mt-4 border-t border-[#2D6A4F]/20">
                <button
                  onClick={toggleLanguage}
                  className="text-sm text-[#4A4A4A] px-4"
                >
                  {language === "en" ? "FR" : "EN"}
                </button>
                <Link
                  to="/join-us"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 px-6 py-3 bg-[#2D6A4F] text-white text-center font-medium rounded-lg"
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
