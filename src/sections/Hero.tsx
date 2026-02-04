import { Link } from 'react-router-dom';
import { Check, ChevronDown, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Pop Colorful Blobs */}
      <div className="absolute top-16 right-[5%] w-96 h-96 bg-[#10b981]/18 blob animate-float hidden lg:block" />
      <div className="absolute bottom-20 left-[3%] w-80 h-80 bg-[#f97316]/15 blob-reverse animate-float hidden lg:block" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/3 left-[10%] w-48 h-48 bg-[#f43f5e]/12 blob animate-float hidden lg:block" style={{ animationDelay: '3s' }} />
      <div className="absolute bottom-1/3 right-[8%] w-56 h-56 bg-[#84cc16]/12 blob-reverse animate-float hidden lg:block" style={{ animationDelay: '4.5s' }} />

      {/* Content */}
      <div className="relative z-10 container-custom text-center py-32">
        <div className="max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#10b981]/10 border-2 border-[#10b981]/20 mb-8 animate-bounce-soft">
            <Sparkles size={18} className="text-[#f97316]" />
            <span className="text-sm font-extrabold text-[#10b981]">{t.hero.availability}</span>
          </div>

          {/* Title */}
          <h1 
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-black mb-6 text-[#0f172a] leading-[0.95]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {t.hero.title}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-[#475569] mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            {t.hero.subtitle}
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[t.hero.badge1, t.hero.badge2, t.hero.badge3, t.hero.badge4].map((badge, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white shadow-sharp border-2 border-[#e2e8f0] text-sm font-extrabold text-[#0f172a] hover:border-[#10b981]/40 hover:shadow-colored transition-all duration-300"
              >
                <Check size={16} className="text-[#10b981]" />
                {badge}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/our-houses">
              <Button 
                size="lg"
                className="btn-primary text-base px-10 py-6"
              >
                {t.hero.ctaPrimary}
              </Button>
            </Link>
            <Link to="/join-us">
              <Button 
                size="lg"
                className="btn-secondary text-base px-10 py-6"
              >
                {t.hero.ctaSecondary}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-[#94a3b8] uppercase tracking-wider font-extrabold">Scroll</span>
          <ChevronDown className="text-[#10b981] animate-bounce" size={28} />
        </div>
      </div>
    </section>
  );
}
