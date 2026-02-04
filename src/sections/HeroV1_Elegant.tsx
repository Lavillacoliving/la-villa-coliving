import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * VERSION 1: ÉLÉGANTE & SOPHISTIQUÉE
 * Palette: Bleu nuit profond + Or champagne + Blanc cassé
 * Style: Luxe discret, typographie fine, espaces aérés
 */

export function HeroV1_Elegant() {
  const { language } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a1628]">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0f1d32] to-[#1a2d4a]" />
      
      {/* Elegant gold accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c9a962] to-transparent opacity-60" />
      
      {/* Subtle geometric shapes */}
      <div className="absolute top-20 right-20 w-[500px] h-[500px] border border-[#c9a962]/10 rounded-full hidden lg:block" />
      <div className="absolute bottom-20 left-20 w-[300px] h-[300px] border border-[#c9a962]/5 rounded-full hidden lg:block" />
      
      {/* Soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#c9a962]/5 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 container-custom py-32">
        <div className="max-w-4xl">
          {/* Elegant label */}
          <div className="inline-flex items-center gap-3 mb-8">
            <span className="w-12 h-[1px] bg-[#c9a962]" />
            <span className="text-[#c9a962] text-sm tracking-[0.3em] uppercase font-light">
              {language === 'en' ? 'Premium Coliving' : 'Coliving Premium'}
            </span>
          </div>

          {/* Title - Elegant serif feel with sans */}
          <h1 
            className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-8 leading-[1.1] tracking-tight"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {language === 'en' ? (
              <>
                Live <span className="font-medium text-[#c9a962]">Exceptionally</span>
                <br />
                Near Geneva
              </>
            ) : (
              <>
                Vivez <span className="font-medium text-[#c9a962]">Exceptionnellement</span>
                <br />
                Près de Genève
              </>
            )}
          </h1>

          {/* Refined subtitle */}
          <p className="text-lg md:text-xl text-white/60 mb-12 max-w-xl leading-relaxed font-light">
            {language === 'en' 
              ? 'Curated homes for discerning professionals. All-inclusive living with an extraordinary community.'
              : 'Maisons sélectionnées pour professionnels exigeants. Vie tout inclusive avec une communauté extraordinaire.'}
          </p>

          {/* Elegant CTAs */}
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Link 
              to="/our-houses"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[#c9a962] text-[#0a1628] font-medium rounded-none hover:bg-[#d4b876] transition-all duration-300"
            >
              {language === 'en' ? 'Discover Our Homes' : 'Découvrir Nos Maisons'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              to="/the-coliving"
              className="group inline-flex items-center gap-3 px-8 py-4 border border-white/30 text-white font-light hover:border-[#c9a962] hover:text-[#c9a962] transition-all duration-300"
            >
              <Play className="w-4 h-4" />
              {language === 'en' ? 'Watch Our Story' : 'Voir Notre Histoire'}
            </Link>
          </div>

          {/* Elegant stats row */}
          <div className="flex gap-12 mt-20 pt-10 border-t border-white/10">
            {[
              { value: '50+', label: language === 'en' ? 'Residents' : 'Résidents' },
              { value: '4.9', label: language === 'en' ? 'Rating' : 'Note' },
              { value: '30min', label: language === 'en' ? 'To Geneva' : 'De Genève' },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-light text-[#c9a962] mb-1">{stat.value}</div>
                <div className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side image */}
      <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block">
        <div className="relative w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"
            alt="La Villa"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628] via-[#0a1628]/50 to-transparent" />
        </div>
      </div>
    </section>
  );
}
