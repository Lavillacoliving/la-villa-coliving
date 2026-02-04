import { Link } from 'react-router-dom';
import { Instagram, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * VERSION 6: CHALEUR + PREMIUM + MODERNITÉ
 * Palette: Terracotta + Beige + Sable
 */

export function FooterV6() {
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
    <footer className="bg-[#3d3632] relative overflow-hidden">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      
      <div className="container-custom py-20 md:py-24 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
              <img 
                src="/logos/logo-full.png" 
                alt="La Villa Coliving"
                className="h-20 w-auto brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              />
            </Link>
            <p className="text-[#c4bbb3] max-w-md mb-8 leading-relaxed text-[15px]">
              {language === 'en' 
                ? 'Premium coliving homes near Geneva. Fully furnished, all-inclusive, curated community for modern professionals.'
                : 'Maisons de coliving premium près de Genève. Entièrement meublées, tout inclus, communauté sélectionnée pour professionnels modernes.'}
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/lavillacoliving/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 border border-[#5a524d] rounded-full flex items-center justify-center text-[#c4bbb3] hover:border-[#c4705a] hover:text-[#c4705a] hover:bg-[#c4705a]/10 transition-all duration-300"
              >
                <Instagram size={20} />
              </a>
              <a
                href="mailto:contact@lavillacoliving.com"
                className="w-12 h-12 border border-[#5a524d] rounded-full flex items-center justify-center text-[#c4bbb3] hover:border-[#c4705a] hover:text-[#c4705a] hover:bg-[#c4705a]/10 transition-all duration-300"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#c4705a] mb-8 font-medium">
              {language === 'en' ? 'Navigation' : 'Navigation'}
            </h4>
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-[#c4bbb3] hover:text-white transition-colors duration-300 flex items-center gap-2 group text-[15px]"
                  >
                    {link.label}
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#c4705a]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#c4705a] mb-8 font-medium">
              {language === 'en' ? 'Contact' : 'Contact'}
            </h4>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <MapPin size={18} className="text-[#c4705a] mt-1 flex-shrink-0" />
                <span className="text-[#c4bbb3] text-[15px]">
                  Grand Genève - France
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Mail size={18} className="text-[#c4705a] flex-shrink-0" />
                <a
                  href="mailto:contact@lavillacoliving.com"
                  className="text-[#c4bbb3] hover:text-white transition-colors duration-300 text-[15px]"
                >
                  contact@lavillacoliving.com
                </a>
              </div>
            </div>
            
            {/* Mini CTA */}
            <Link 
              to="/join-us"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 border border-[#c4705a] text-[#c4705a] text-sm font-medium hover:bg-[#c4705a] hover:text-white transition-all duration-300"
            >
              {language === 'en' ? 'Apply Now' : 'Candidater'}
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-20 pt-8 border-t border-[#5a524d]/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#8a817a] text-sm">
            &copy; {new Date().getFullYear()} <span className="text-[#c4bbb3]">La Villa Coliving</span>. {language === 'en' ? 'All rights reserved.' : 'Tous droits réservés.'}
          </p>
          <p className="text-[#8a817a] text-sm">
            {language === 'en' ? 'Made with' : 'Fait avec'} <span className="text-[#c4705a]">♥</span> {language === 'en' ? 'in Grand Genève' : 'au Grand Genève'}
          </p>
        </div>
      </div>
    </footer>
  );
}
