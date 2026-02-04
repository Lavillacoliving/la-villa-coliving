import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function NavbarV4() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, language, toggleLanguage } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: t.nav.home },
    { path: '/the-coliving', label: t.nav.coliving },
    { path: '/services', label: t.nav.services },
    { path: '/our-houses', label: t.nav.houses },
    { path: '/rates', label: t.nav.rates },
    { path: '/faq', label: t.nav.faq },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/98 backdrop-blur-sm border-b border-[#e5e5e5]'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold tracking-tight text-[#1a1a1a]">La Villa</span>
            <span className="text-xs text-[#c44536] uppercase tracking-widest">Coliving</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm transition-colors ${
                  isActive(link.path) 
                    ? 'text-[#c44536] font-medium' 
                    : 'text-[#666] hover:text-[#1a1a1a]'
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
              className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors"
            >
              {language === 'en' ? 'FR' : 'EN'}
            </button>

            {/* CTA Button */}
            <Link 
              to="/join-us"
              className="px-6 py-3 bg-[#1a1a1a] text-white text-sm font-medium hover:bg-[#c44536] transition-colors"
            >
              {t.nav.joinUs}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="text-[#1a1a1a]" size={24} />
            ) : (
              <Menu className="text-[#1a1a1a]" size={24} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-[#e5e5e5]">
            <div className="py-6 px-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-lg py-2 transition-colors ${
                    isActive(link.path) 
                      ? 'text-[#c44536] font-medium' 
                      : 'text-[#1a1a1a] hover:text-[#c44536]'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-4 pt-4 mt-4 border-t border-[#e5e5e5]">
                <button
                  onClick={toggleLanguage}
                  className="text-sm text-[#666]"
                >
                  {language === 'en' ? 'FR' : 'EN'}
                </button>
                <Link 
                  to="/join-us" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 px-6 py-3 bg-[#1a1a1a] text-white text-center font-medium"
                >
                  {t.nav.joinUs}
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
