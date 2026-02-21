import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * VERSION 9: STONE & BRASS — CONDO PREMIUM
 * Navbar — stone palette, rounded-lg CTA, sticky with blur
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
    {
      path: "/nos-maisons",
      label: language === "en" ? "Our Houses" : "Nos Maisons",
    },
    { path: "/services", label: "Services" },
    { path: "/tarifs", label: language === "en" ? "Rates" : "Tarifs" },
    { path: "/blog", label: "Blog" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-[#E7E5E4]"
          : "bg-transparent"
      }`}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src="/logos/NEW Logo La Villa-14.png"
              alt="La Villa Coliving — colocation et coliving premium près de Genève"
              className="h-16 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm transition-all duration-300 ${
                  isActive(link.path)
                    ? "text-[#44403C] font-medium"
                    : "text-[#1C1917] hover:text-[#44403C]"
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#44403C] rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="text-sm text-[#78716C] hover:text-[#1C1917] transition-colors duration-300"
            >
              {language === "en" ? "FR" : "EN"}
            </button>

            {/* Portail */}
            <Link
              to="/portail"
              className="text-sm text-[#78716C] hover:text-[#1C1917] transition-all duration-300"
            >
              {language === "en" ? "Portal" : "Portail"}
            </Link>
            {/* CTA Button */}
            <Link
              to="/candidature"
              className="px-6 py-2.5 bg-[#44403C] text-white text-sm font-medium rounded-lg hover:bg-[#57534E] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#44403C] focus-visible:ring-offset-2"
            >
              {language === "en" ? "Join us" : "Nous rejoindre"}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-[#44403C]/10 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="text-[#1C1917]" size={24} />
            ) : (
              <Menu className="text-[#1C1917]" size={24} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-[#E7E5E4] shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
            <div className="py-6 px-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-lg py-3 px-4 rounded-lg transition-all duration-300 ${
                    isActive(link.path)
                      ? "text-[#44403C] font-medium bg-[#F5F2ED]"
                      : "text-[#1C1917] hover:text-[#44403C] hover:bg-[#FAF9F6]"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/portail"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg py-3 px-4 rounded-lg text-[#78716C] hover:text-[#1C1917]"
              >
                {language === "en" ? "Portal" : "Portail"}
              </Link>
              <div className="flex items-center gap-4 pt-4 mt-4 border-t border-[#E7E5E4]">
                <button
                  onClick={toggleLanguage}
                  className="text-sm text-[#78716C] px-4"
                >
                  {language === "en" ? "FR" : "EN"}
                </button>
                <Link
                  to="/candidature"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 px-6 py-3 bg-[#44403C] text-white text-center font-medium rounded-lg hover:bg-[#57534E] transition-all duration-300"
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
