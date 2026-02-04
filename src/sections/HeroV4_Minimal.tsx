import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * VERSION 4: MINIMALISTE & ÉPURÉE
 * Palette: Blanc pur + Gris anthracite + Accent rouge brique
 * Style: Swiss design, beaucoup d'espace blanc, typographie soignée
 * CTA visibles inspirés de la V3
 */

export function HeroV4_Minimal() {
  const { language } = useLanguage();

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-white">
      {/* Ultra minimal header */}
      <header className="absolute top-0 left-0 right-0 z-20 py-6">
        <div className="container-custom flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-[#1a1a1a]">La Villa</span>
            <span className="text-xs text-[#c44536] uppercase tracking-widest">Coliving</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {['Houses', 'The Coliving', 'Services', 'FAQ'].map((item) => (
              <Link 
                key={item} 
                to={`/${item.toLowerCase().replace(' ', '-')}`}
                className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center">
        <div className="container-custom pt-24 pb-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - Content */}
            <div>
              {/* Rating badge */}
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#c44536] text-[#c44536]" />
                  ))}
                </div>
                <span className="text-sm text-[#666]">
                  {language === 'en' ? '4.9/5 from 50+ happy colivers' : '4.9/5 de 50+ colivers heureux'}
                </span>
              </div>

              {/* Small label */}
              <div className="mb-6">
                <span className="text-xs text-[#999] uppercase tracking-[0.3em]">
                  {language === 'en' ? 'Premium Coliving — Grand Genève' : 'Coliving Premium — Grand Genève'}
                </span>
              </div>

              {/* Massive title */}
              <h1 
                className="text-5xl md:text-6xl lg:text-7xl font-light text-[#1a1a1a] leading-[0.95] tracking-tight mb-8"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                {language === 'en' ? (
                  <>
                    Live
                    <br />
                    <span className="font-medium">Together</span>
                    <span className="text-[#c44536]">.</span>
                  </>
                ) : (
                  <>
                    Vivez
                    <br />
                    <span className="font-medium">Ensemble</span>
                    <span className="text-[#c44536]">.</span>
                  </>
                )}
              </h1>

              {/* Clean description */}
              <p className="text-lg text-[#666] max-w-md leading-relaxed mb-10">
                {language === 'en' 
                  ? 'Fully furnished homes designed for community living. All-inclusive, flexible, just 30 minutes from Geneva.'
                  : 'Maisons entièrement meublées conçues pour la vie communautaire. Tout inclus, flexible, à 30 minutes de Genève.'}
              </p>

              {/* Feature tags */}
              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  language === 'en' ? 'All-inclusive' : 'Tout inclus',
                  language === 'en' ? 'Curated Community' : 'Communauté Sélectionnée',
                  language === 'en' ? 'No Agency Fees' : 'Sans Frais d\'Agence',
                ].map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-[#f5f5f5] text-[#1a1a1a] text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Bold CTAs - inspirés de la V3 */}
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link 
                  to="/our-houses"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-[#1a1a1a] text-white font-bold hover:bg-[#c44536] transition-all duration-300"
                >
                  {language === 'en' ? 'VIEW OUR HOUSES' : 'VOIR NOS MAISONS'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link 
                  to="/join-us"
                  className="inline-flex items-center gap-3 px-8 py-4 border-2 border-[#1a1a1a] text-[#1a1a1a] font-bold hover:bg-[#1a1a1a] hover:text-white transition-all duration-300"
                >
                  {language === 'en' ? 'APPLY NOW' : 'CANDIDATER'}
                </Link>
              </div>
            </div>

            {/* Right - Image with minimal frame */}
            <div className="relative">
              {/* Thin frame layers */}
              <div className="absolute -inset-3 border border-[#e5e5e5]" />
              <div className="absolute -inset-6 border border-[#f0f0f0]" />
              
              {/* Image */}
              <div className="relative aspect-[4/5] bg-[#f5f5f5]">
                <img
                  src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80"
                  alt="La Villa"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Minimal caption */}
              <div className="absolute -bottom-10 left-0">
                <span className="text-xs text-[#999] uppercase tracking-wider">
                  {language === 'en' ? 'La Villa — Ville-la-Grand' : 'La Villa — Ville-la-Grand'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom stats bar */}
      <div className="border-t border-[#e5e5e5]">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-12 md:gap-16">
              {[
                { value: '50+', label: language === 'en' ? 'Residents' : 'Résidents' },
                { value: '3', label: language === 'en' ? 'Homes' : 'Maisons' },
                { value: '4.9', label: language === 'en' ? 'Rating' : 'Note' },
              ].map((stat, index) => (
                <div key={index} className="flex items-baseline gap-2">
                  <span className="text-2xl font-light text-[#1a1a1a]">{stat.value}</span>
                  <span className="text-xs text-[#999] uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
            
            <div className="hidden md:block">
              <span className="text-xs text-[#c44536] uppercase tracking-widest">
                {language === 'en' ? 'Next availability: Winter 2025' : 'Prochaine dispo: Hiver 2025'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
