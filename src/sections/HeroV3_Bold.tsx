import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * VERSION 3: AUDACIEUSE & MODERNE
 * Palette: Noir profond + Jaune vif + Blanc pur
 * Style: Contrasté, énergique, startup vibe
 */

export function HeroV3_Bold() {
  const { language } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
      {/* Dynamic diagonal shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-[#1a1a1a] transform skew-x-12 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#ffe500]/5 transform -skew-x-12" />
      </div>
      
      {/* Yellow accent elements */}
      <div className="absolute top-20 left-[10%] w-32 h-1 bg-[#ffe500] hidden lg:block" />
      <div className="absolute top-20 left-[10%] w-1 h-32 bg-[#ffe500] hidden lg:block" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 container-custom py-24">
        <div className="max-w-5xl">
          {/* Top bar */}
          <div className="flex items-center gap-4 mb-12">
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#ffe500] text-[#ffe500]" />
              ))}
            </div>
            <span className="text-white/60 text-sm">
              {language === 'en' ? '4.9/5 from 50+ happy colivers' : '4.9/5 de 50+ colivers heureux'}
            </span>
          </div>

          {/* Big bold title */}
          <h1 
            className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[0.95] tracking-tight uppercase"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {language === 'en' ? (
              <>
                Coliving
                <br />
                <span className="text-[#ffe500]">Reimagined</span>
              </>
            ) : (
              <>
                Coliving
                <br />
                <span className="text-[#ffe500]">Réinventé</span>
              </>
            )}
          </h1>

          {/* Punchy subtitle */}
          <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl leading-relaxed">
            {language === 'en' 
              ? 'Premium homes. Curated community. Zero hassle. Just 30 minutes from Geneva.'
              : 'Maisons premium. Communauté sélectionnée. Zéro tracas. À 30 minutes de Genève.'}
          </p>

          {/* Bold feature list */}
          <div className="flex flex-wrap gap-6 mb-12">
            {[
              { value: '50+', label: language === 'en' ? 'Members' : 'Membres' },
              { value: '3', label: language === 'en' ? 'Houses' : 'Maisons' },
              { value: '30min', label: language === 'en' ? 'To Geneva' : 'De Genève' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-3xl font-black text-[#ffe500]">{item.value}</span>
                <span className="text-white/50 text-sm uppercase tracking-wider">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Bold CTAs */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link 
              to="/our-houses"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-[#ffe500] text-black font-black text-lg hover:bg-white transition-all duration-300"
            >
              {language === 'en' ? 'VIEW OUR HOUSES' : 'VOIR NOS MAISONS'}
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
            
            <Link 
              to="/join-us"
              className="inline-flex items-center gap-3 px-10 py-5 border-2 border-white text-white font-bold text-lg hover:bg-white hover:text-black transition-all duration-300"
            >
              {language === 'en' ? 'APPLY NOW' : 'CANDIDATER'}
            </Link>
          </div>
        </div>
      </div>

      {/* Right side visual */}
      <div className="absolute right-0 top-0 w-[45%] h-full hidden lg:block">
        <div className="relative w-full h-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1000&q=80"
            alt="La Villa"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
          
          {/* Yellow frame accent */}
          <div className="absolute bottom-10 left-10 w-32 h-32 border-4 border-[#ffe500]" />
        </div>
      </div>

      {/* Bottom scrolling text */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#ffe500] py-3 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-black font-bold text-sm mx-8 uppercase tracking-wider">
              {language === 'en' 
                ? '✦ All-Inclusive ✦ Curated Community ✦ No Agency Fees ✦ Flexible Stays ✦ Premium Amenities ✦'
                : '✦ Tout Inclus ✦ Communauté Sélectionnée ✦ Sans Frais d\'Agence ✦ Séjours Flexibles ✦ Équipements Premium ✦'}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
