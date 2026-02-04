import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * VERSION 6: CHALEUR + PREMIUM + MODERNITÉ
 * Palette: Terracotta (#c4705a) + Beige (#f5f0e8) + Sable (#e8dfd1) + Anthracite chaud (#3d3632)
 * Animations subtiles, espacement aéré, effets premium
 */

export function HeroV6() {
  const { language } = useLanguage();

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#faf8f5]">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#faf8f5] via-[#f5f0e8]/30 to-[#e8dfd1]/20" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#c4705a]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#e8dfd1]/40 rounded-full blur-3xl" />

      {/* Main content */}
      <div className="flex-1 flex items-center relative">
        <div className="container-custom pt-32 pb-16">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left - Content */}
            <div className="relative z-10">
              {/* Rating badge - premium style */}
              <div className="flex items-center gap-3 mb-10 animate-fade-in">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#d4a574] text-[#d4a574]" />
                  ))}
                </div>
                <span className="text-sm text-[#8a817a]">
                  {language === 'en' ? '4.9/5 from 50+ happy colivers' : '4.9/5 de 50+ colivers heureux'}
                </span>
              </div>

              {/* Small label */}
              <div className="mb-8">
                <span className="inline-block px-4 py-2 bg-[#e8dfd1]/60 text-[#c4705a] text-xs uppercase tracking-[0.25em] font-medium rounded-full">
                  {language === 'en' ? 'Premium Coliving — Grand Genève' : 'Coliving Premium — Grand Genève'}
                </span>
              </div>

              {/* Massive title */}
              <h1 
                className="text-5xl md:text-6xl lg:text-7xl font-light text-[#3d3632] leading-[1.05] tracking-tight mb-10"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                {language === 'en' ? (
                  <>
                    Live
                    <br />
                    <span className="font-medium">Together</span>
                    <span className="text-[#c4705a]">.</span>
                  </>
                ) : (
                  <>
                    Vivez
                    <br />
                    <span className="font-medium">Ensemble</span>
                    <span className="text-[#c4705a]">.</span>
                  </>
                )}
              </h1>

              {/* Clean description */}
              <p className="text-lg text-[#5a524d] max-w-lg leading-relaxed mb-12">
                {language === 'en' 
                  ? 'Fully furnished homes designed for community living. All-inclusive, flexible, just 30 minutes from Geneva.'
                  : 'Maisons entièrement meublées conçues pour la vie communautaire. Tout inclus, flexible, à 30 minutes de Genève.'}
              </p>

              {/* Feature tags - premium pills */}
              <div className="flex flex-wrap gap-3 mb-12">
                {[
                  { text: language === 'en' ? 'All-inclusive' : 'Tout inclus' },
                  { text: language === 'en' ? 'Curated Community' : 'Communauté Sélectionnée' },
                  { text: language === 'en' ? 'No Agency Fees' : 'Sans Frais d\'Agence' },
                ].map((tag, index) => (
                  <span
                    key={index}
                    className="px-5 py-2.5 text-sm font-medium bg-white border border-[#e8dfd1] text-[#5a524d] rounded-full shadow-sm hover:shadow-md hover:border-[#c4705a]/30 transition-all duration-300"
                  >
                    {tag.text}
                  </span>
                ))}
              </div>

              {/* Premium CTAs */}
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link 
                  to="/our-houses"
                  className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#c4705a] text-white font-medium rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(196,112,90,0.35)]"
                >
                  <span className="relative z-10">{language === 'en' ? 'View Our Houses' : 'Voir Nos Maisons'}</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-[#b05d48] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>
                
                <Link 
                  to="/join-us"
                  className="inline-flex items-center gap-3 px-8 py-4 border-2 border-[#3d3632] text-[#3d3632] font-medium rounded-full hover:bg-[#3d3632] hover:text-white transition-all duration-300"
                >
                  {language === 'en' ? 'Apply Now' : 'Candidater'}
                </Link>
              </div>
            </div>

            {/* Right - Image with premium frame */}
            <div className="relative">
              {/* Decorative frame */}
              <div className="absolute -inset-4 border border-[#e8dfd1] rounded-2xl" />
              <div className="absolute -inset-8 border border-[#e8dfd1]/50 rounded-3xl" />
              
              {/* Main image */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(61,54,50,0.15)]">
                <img
                  src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80"
                  alt="La Villa Coliving"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#3d3632]/20 to-transparent" />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 bg-white px-6 py-4 rounded-xl shadow-[0_10px_40px_rgba(61,54,50,0.12)]">
                <span className="text-[#3d3632] text-sm font-medium">
                  {language === 'en' ? 'Next: Winter 2025' : 'Prochain: Hiver 2025'}
                </span>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#c4705a] rounded-full animate-pulse" />
                  <span className="text-xs text-[#8a817a]">{language === 'en' ? 'Limited spots' : 'Places limitées'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom stats bar - premium style */}
      <div className="border-t border-[#e8dfd1]/60 relative">
        <div className="container-custom py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-16 md:gap-20">
              {[
                { value: '50+', label: language === 'en' ? 'Happy Residents' : 'Résidents Heureux' },
                { value: '3', label: language === 'en' ? 'Unique Homes' : 'Maisons Uniques' },
                { value: '4.9', label: language === 'en' ? 'Member Rating' : 'Note Membres' },
              ].map((stat, index) => (
                <div key={index} className="flex flex-col">
                  <span className="text-3xl font-medium text-[#c4705a]">
                    {stat.value}
                  </span>
                  <span className="text-xs text-[#8a817a] uppercase tracking-wider mt-1">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
