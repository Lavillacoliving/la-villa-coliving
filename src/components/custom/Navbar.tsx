import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, language, toggleLanguage } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/", label: t.nav.home },
    { path: "/the-coliving", label: t.nav.coliving },
    { path: "/services", label: t.nav.services },
    { path: "/our-houses", label: t.nav.houses },
    { path: "/rates", label: t.nav.rates },
    { path: "/faq", label: t.nav.faq },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/98 backdrop-blur-xl shadow-sharp"
          : "bg-transparent"
      }`}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logos/NEW Logo La Villa-14.png"
              alt="La Villa Coliving"
              className="h-15 w-auto pixel-logo group-hover:scale-105 transition-transform duration-300"
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-lg font-black text-[#0f172a] leading-tight">
                La Villa
              </span>
              <span className="text-xs font-bold text-[#10b981] tracking-wider">
                COLIVING
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${
                  isActive(link.path) ? "!text-[#10b981] !bg-[#10b981]/10" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-lg text-sm font-extrabold text-[#64748b] hover:text-[#10b981] hover:bg-[#10b981]/8 transition-all duration-300"
            >
              {language === "en" ? "FR" : "EN"}
            </button>

            {/* CTA Button */}
            <Link to="/join-us">
              <Button className="bg-gradient-to-r from-[#f43f5e] to-[#e11d48] text-white hover:from-[#e11d48] hover:to-[#be123c] transition-all duration-300 rounded-xl px-6 font-extrabold shadow-coral hover:shadow-coral hover:-translate-y-0.5">
                {t.nav.joinUs}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2.5 rounded-lg hover:bg-[#10b981]/8 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="text-[#0f172a]" size={24} />
            ) : (
              <Menu className="text-[#0f172a]" size={24} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/99 backdrop-blur-xl shadow-sharp-lg rounded-b-2xl mx-4">
            <div className="py-6 px-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-lg font-extrabold py-3 px-4 rounded-xl transition-colors ${
                    isActive(link.path)
                      ? "text-[#10b981] bg-[#10b981]/10"
                      : "text-[#0f172a] hover:text-[#10b981] hover:bg-[#10b981]/5"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-4 pt-4 mt-4 border-t border-[#e2e8f0]">
                <button
                  onClick={toggleLanguage}
                  className="px-3 py-1.5 rounded-lg text-sm font-extrabold text-[#64748b]"
                >
                  {language === "en" ? "FR" : "EN"}
                </button>
                <Link
                  to="/join-us"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1"
                >
                  <Button className="w-full bg-gradient-to-r from-[#f43f5e] to-[#e11d48] text-white hover:from-[#e11d48] hover:to-[#be123c] rounded-xl font-extrabold">
                    {t.nav.joinUs}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
