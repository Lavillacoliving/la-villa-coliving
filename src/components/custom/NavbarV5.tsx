import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function NavbarV5() {
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/98 backdrop-blur-sm border-b border-[#e5e5e5]'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo LA VILLA COLIVING - logo unique combiné */}
          <Link to="/" className="flex items-center group">
            <img 
              src="/logos/logo-full.png" 
              alt="La Villa Coliving"
              className="h-16 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm transition-colors ${
                  isActive(link.path) 
                    ? 'text-[#ff6b5b] font-bold' 
                    : 'text-[#666] hover:text-[#ff6b5b]'
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
              className="text-sm text-[#666] hover:text-[#4ecdc4] transition-colors font-medium"
            >
              {language === 'en' ? 'FR' : 'EN'}
            </button>

            {/* CTA Button */}
            <Link 
              to="/join-us"
              className="px-6 py-3 bg-[#ff6b5b] text-white text-sm font-bold hover:bg-[#e85a4a] transition-colors"
            >
              {language === 'en' ? 'JOIN US' : 'NOUS REJOINDRE'}
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
                      ? 'text-[#ff6b5b] font-bold' 
                      : 'text-[#1a1a1a] hover:text-[#ff6b5b]'
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
                  className="flex-1 px-6 py-3 bg-[#ff6b5b] text-white text-center font-bold"
                >
                  {language === 'en' ? 'JOIN US' : 'NOUS REJOINDRE'}
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
