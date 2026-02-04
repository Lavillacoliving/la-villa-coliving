import { Link } from 'react-router-dom';
import { Instagram, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function FooterV4() {
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
    <footer className="bg-[#1a1a1a]">
      <div className="container-custom py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <span className="text-2xl font-bold tracking-tight text-white">La Villa</span>
              <span className="text-xs text-[#c44536] uppercase tracking-widest">Coliving</span>
            </Link>
            <p className="text-[#666] max-w-md mb-6 leading-relaxed">
              {t.footer.tagline}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/lavillacoliving/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-[#333] flex items-center justify-center text-[#666] hover:border-[#c44536] hover:text-[#c44536] transition-all"
              >
                <Instagram size={18} />
              </a>
              <a
                href="mailto:contact@lavillacoliving.com"
                className="w-10 h-10 border border-[#333] flex items-center justify-center text-[#666] hover:border-[#c44536] hover:text-[#c44536] transition-all"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#999] mb-6">
              Navigation
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-[#666] hover:text-white transition-colors flex items-center gap-1 group"
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
            <h4 className="text-xs uppercase tracking-widest text-[#999] mb-6">
              {t.footer.contact}
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#c44536] mt-1 flex-shrink-0" />
                <span className="text-[#666]">
                  Grand Genève - France
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[#c44536] flex-shrink-0" />
                <a
                  href="mailto:contact@lavillacoliving.com"
                  className="text-[#666] hover:text-white transition-colors"
                >
                  contact@lavillacoliving.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-[#333] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#666] text-sm">
            &copy; {new Date().getFullYear()} La Villa Coliving. {t.footer.rights}
          </p>
          <p className="text-[#666] text-sm">
            {t.footer.followUs}
          </p>
        </div>
      </div>
    </footer>
  );
}
