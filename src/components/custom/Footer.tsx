import { Link } from 'react-router-dom';
import { Instagram, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  const navLinks = [
    { path: '/', label: t.nav.home },
    { path: '/the-coliving', label: t.nav.coliving },
    { path: '/services', label: t.nav.services },
    { path: '/our-houses', label: t.nav.houses },
    { path: '/rates', label: t.nav.rates },
    { path: '/faq', label: t.nav.faq },
    { path: '/join-us', label: t.nav.joinUs },
  ];

  return (
    <footer className="relative bg-[#0f172a]">
      <div className="container-custom py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              <img 
                src="/logos/NEW%20Logo%20La%20Villa-12.png" 
                alt="La Villa Coliving"
                className="h-16 w-auto pixel-logo brightness-0 invert group-hover:scale-105 transition-transform duration-300"
              />
              <div className="flex flex-col">
                <span className="text-xl font-black text-white leading-tight">La Villa</span>
                <span className="text-sm font-bold text-[#10b981] tracking-wider">COLIVING</span>
              </div>
            </Link>
            <p className="text-[#94a3b8] max-w-md mb-6 leading-relaxed font-medium">
              {t.footer.tagline}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/lavillacoliving/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#10b981] hover:text-white transition-all duration-300 text-[#94a3b8]"
              >
                <Instagram size={18} />
              </a>
              <a
                href="mailto:contact@lavillacoliving.com"
                className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#f43f5e] hover:text-white transition-all duration-300 text-[#94a3b8]"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white mb-6">
              Navigation
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-[#94a3b8] hover:text-[#10b981] transition-colors duration-300 flex items-center gap-1 group font-medium"
                  >
                    {link.label}
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white mb-6">
              {t.footer.contact}
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#10b981] mt-1 flex-shrink-0" />
                <span className="text-[#94a3b8] font-medium">
                  Grand Genève - France
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[#f43f5e] flex-shrink-0" />
                <a
                  href="mailto:contact@lavillacoliving.com"
                  className="text-[#94a3b8] hover:text-[#10b981] transition-colors font-medium"
                >
                  contact@lavillacoliving.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#64748b] text-sm font-medium">
            &copy; {new Date().getFullYear()} La Villa Coliving. {t.footer.rights}
          </p>
          <p className="text-[#64748b] text-sm font-medium">
            Made with <span className="text-[#10b981]">💚</span> in Geneva
          </p>
        </div>
      </div>
    </footer>
  );
}
