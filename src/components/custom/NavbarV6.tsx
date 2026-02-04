import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * VERSION 6: CHALEUR + PREMIUM + MODERNITÉ
 * Palette: Terracotta (#c4705a) + Beige (#f5f0e8) + Sable (#e8dfd1) + Anthracite chaud (#3d3632)
 */

export function NavbarV6() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: language === 'en' ? 'Home' : 'Accueil' },
    { path: '/the-coliving', label: language === 'en' ? 'The Coliving' : 'Le Coliving' },
    { path: '/services', label: language === 'en' ? 'Services' : 'Services' },
    { path: '/our-houses', label: language === 'en' ? 'Our Houses' : 'Nos Maisons' },
    { path: '/rates', label: language === 'en' ? 'Rates' : 'Tarifs' },
    { path: '/faq', label: 'FAQ' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#faf8f5]/95 backdrop-blur-md shadow-[0_2px_20px_rgba(61,54,50,0.06)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-24">
          {/* Logo LA VILLA COLIVING */}
          <Link to="/" className="flex items-center group relative">
            <div className="relative overflow-hidden">
              <img 
                src="/logos/logo-full.png" 
                alt="La Villa Coliving"
                className="h-14 w-auto transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm tracking-wide transition-all duration-300 group ${
                  isActive(link.path) 
                    ? 'text-[#c4705a] font-medium' 
                    : 'text-[#5a524d] hover:text-[#c4705a]'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-[#c4705a] transition-all duration-300 ${
                  isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="text-sm text-[#5a524d] hover:text-[#c4705a] transition-colors duration-300 font-medium tracking-wide"
            >
              {language === 'en' ? 'FR' : 'EN'}
            </button>

            {/* CTA Button - Premium style */}
            <Link 
              to="/join-us"
              className="relative px-8 py-3.5 bg-[#c4705a] text-white text-sm font-medium tracking-wide overflow-hidden group transition-all duration-300 hover:shadow-[0_4px_20px_rgba(196,112,90,0.35)]"
            >
              <span className="relative z-10">{language === 'en' ? 'Join Us' : 'Nous Rejoindre'}</span>
              <div className="absolute inset-0 bg-[#b05d48] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-[#f5f0e8] rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="text-[#3d3632]" size={24} />
            ) : (
              <Menu className="text-[#3d3632]" size={24} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[#faf8f5] shadow-[0_10px_40px_rgba(61,54,50,0.1)]">
            <div className="py-8 px-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-lg py-3 px-4 rounded-lg transition-all duration-300 ${
                    isActive(link.path) 
                      ? 'text-[#c4705a] font-medium bg-[#f5f0e8]' 
                      : 'text-[#3d3632] hover:text-[#c4705a] hover:bg-[#f5f0e8]/50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-4 pt-6 mt-4 border-t border-[#e8dfd1]">
                <button
                  onClick={toggleLanguage}
                  className="text-sm text-[#5a524d] px-4"
                >
                  {language === 'en' ? 'FR' : 'EN'}
                </button>
                <Link 
                  to="/join-us" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 px-6 py-4 bg-[#c4705a] text-white text-center font-medium"
                >
                  {language === 'en' ? 'Join Us' : 'Nous Rejoindre'}
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
