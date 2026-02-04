import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * VERSION 5: MINIMALISTE + ÉNERGIE + MODERNITÉ
 * Palette: Corail vif + Turquoise + Jaune moutarde + Menthe
 * CTA visibles, branding LA VILLA COLIVING fort
 */

export function HeroV5() {
  const { language } = useLanguage();

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-white">


      {/* Main content */}
      <div className="flex-1 flex items-center">
        <div className="container-custom pt-24 pb-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - Content */}
            <div>
              {/* Rating badge avec couleur */}
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#ffe66d] text-[#ffe66d]" />
                  ))}
                </div>
                <span className="text-sm text-[#666]">
                  {language === 'en' ? '4.9/5 from 50+ happy colivers' : '4.9/5 de 50+ colivers heureux'}
                </span>
              </div>

              {/* Small label avec couleur */}
              <div className="mb-6">
                <span className="text-xs text-[#4ecdc4] uppercase tracking-[0.3em] font-bold">
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
                    <span className="text-[#ff6b5b]">.</span>
                  </>
                ) : (
                  <>
                    Vivez
                    <br />
                    <span className="font-medium">Ensemble</span>
                    <span className="text-[#ff6b5b]">.</span>
                  </>
                )}
              </h1>

              {/* Clean description */}
              <p className="text-lg text-[#666] max-w-md leading-relaxed mb-10">
                {language === 'en' 
                  ? 'Fully furnished homes designed for community living. All-inclusive, flexible, just 30 minutes from Geneva.'
                  : 'Maisons entièrement meublées conçues pour la vie communautaire. Tout inclus, flexible, à 30 minutes de Genève.'}
              </p>

              {/* Feature tags avec couleurs */}
              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  { text: language === 'en' ? 'All-inclusive' : 'Tout inclus', color: '#ff6b5b' },
                  { text: language === 'en' ? 'Curated Community' : 'Communauté Sélectionnée', color: '#4ecdc4' },
                  { text: language === 'en' ? 'No Agency Fees' : 'Sans Frais d\'Agence', color: '#ffe66d', textColor: '#1a1a1a' },
                ].map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 text-sm font-medium"
                    style={{ 
                      backgroundColor: tag.color,
                      color: tag.textColor || 'white'
                    }}
                  >
                    {tag.text}
                  </span>
                ))}
              </div>

              {/* Bold CTAs avec couleurs */}
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link 
                  to="/our-houses"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-[#ff6b5b] text-white font-bold hover:bg-[#e85a4a] transition-all duration-300"
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

            {/* Right - Image avec cadre coloré */}
            <div className="relative">
              {/* Thin frame layers avec couleurs */}
              <div className="absolute -inset-3 border-2 border-[#4ecdc4]" />
              <div className="absolute -inset-6 border border-[#a8e6cf]" />
              
              {/* Image */}
              <div className="relative aspect-[4/5] bg-[#f5f5f5]">
                <img
                  src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80"
                  alt="La Villa Coliving"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Badge coloré */}
              <div className="absolute -bottom-4 -right-4 bg-[#ffe66d] px-4 py-2">
                <span className="text-[#1a1a1a] text-xs font-bold uppercase tracking-wider">
                  {language === 'en' ? 'Next: Winter 2025' : 'Prochain: Hiver 2025'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom stats bar avec couleurs */}
      <div className="border-t border-[#e5e5e5]">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-12 md:gap-16">
              {[
                { value: '50+', label: language === 'en' ? 'Residents' : 'Résidents', color: '#ff6b5b' },
                { value: '3', label: language === 'en' ? 'Homes' : 'Maisons', color: '#4ecdc4' },
                { value: '4.9', label: language === 'en' ? 'Rating' : 'Note', color: '#ffe66d', textColor: '#1a1a1a' },
              ].map((stat, index) => (
                <div key={index} className="flex items-baseline gap-2">
                  <span 
                    className="text-2xl font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-xs text-[#999] uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
            

          </div>
        </div>
      </div>
    </section>
  );
}
