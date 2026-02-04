import { Link } from 'react-router-dom';
import { Instagram, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function FooterV5() {
  const { language } = useLanguage();

  const navLinks = [
    { path: '/', label: language === 'en' ? 'Home' : 'Accueil' },
    { path: '/the-coliving', label: language === 'en' ? 'The Coliving' : 'Le Coliving' },
    { path: '/services', label: language === 'en' ? 'Services' : 'Services' },
    { path: '/our-houses', label: language === 'en' ? 'Our Houses' : 'Nos Maisons' },
    { path: '/rates', label: language === 'en' ? 'Rates' : 'Tarifs' },
    { path: '/faq', label: 'FAQ' },
    { path: '/join-us', label: language === 'en' ? 'Join Us' : 'Nous Rejoindre' },
  ];

  return (
    <footer className="bg-[#1a1a1a]">
      <div className="container-custom py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand - Logo LA VILLA COLIVING */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-4 mb-8">
              {/* Logo icon (AGRANDI) */}
              <img 
                src="/logos/logo-icon.png" 
                alt="La Villa Coliving"
                className="h-24 w-auto"
              />
              {/* Logo text (AGRANDI) */}
              <img 
                src="/logos/logo-text-only.png" 
                alt="La Villa Coliving"
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-[#999] max-w-md mb-6 leading-relaxed">
              {language === 'en' 
                ? 'Premium coliving homes near Geneva. Fully furnished, all-inclusive, curated community.'
                : 'Maisons de coliving premium près de Genève. Entièrement meublées, tout inclus, communauté sélectionnée.'}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/lavillacoliving/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-[#333] flex items-center justify-center text-[#999] hover:border-[#ff6b5b] hover:text-[#ff6b5b] hover:bg-[#ff6b5b]/10 transition-all"
              >
                <Instagram size={18} />
              </a>
              <a
                href="mailto:contact@lavillacoliving.com"
                className="w-10 h-10 border border-[#333] flex items-center justify-center text-[#999] hover:border-[#4ecdc4] hover:text-[#4ecdc4] hover:bg-[#4ecdc4]/10 transition-all"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#ff6b5b] mb-6 font-bold">
              {language === 'en' ? 'Navigation' : 'Navigation'}
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-[#999] hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#4ecdc4]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#4ecdc4] mb-6 font-bold">
              {language === 'en' ? 'Contact' : 'Contact'}
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#ff6b5b] mt-1 flex-shrink-0" />
                <span className="text-[#999]">
                  Grand Genève - France
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[#4ecdc4] flex-shrink-0" />
                <a
                  href="mailto:contact@lavillacoliving.com"
                  className="text-[#999] hover:text-white transition-colors"
                >
                  contact@lavillacoliving.com
                </a>
              </div>
            </div>
            
            {/* Mini CTA */}
            <Link 
              to="/join-us"
              className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-[#ff6b5b] text-white text-sm font-bold hover:bg-[#e85a4a] transition-colors"
            >
              {language === 'en' ? 'Apply Now' : 'Candidater'}
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-[#333] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="/logos/logo-icon.png" 
              alt="La Villa Coliving"
              className="h-6 w-auto"
            />
            <p className="text-[#666] text-sm">
              &copy; {new Date().getFullYear()} <span className="text-white font-medium">La Villa Coliving</span>. {language === 'en' ? 'All rights reserved.' : 'Tous droits réservés.'}
            </p>
          </div>
          <p className="text-[#666] text-sm">
            {language === 'en' ? 'Made with' : 'Fait avec'} <span className="text-[#ff6b5b]">♥</span> {language === 'en' ? 'in Grand Genève' : 'au Grand Genève'}
          </p>
        </div>
      </div>
    </footer>
  );
}
