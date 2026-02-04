import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export function CTASection() {
  const { t } = useLanguage();

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&q=80)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/95 via-[#059669]/90 to-[#0f172a]/95" />
      </div>

      {/* Pop Decorative Elements */}
      <div className="absolute top-10 right-10 w-48 h-48 bg-white/15 blob hidden lg:block animate-float" />
      <div className="absolute bottom-10 left-10 w-36 h-36 bg-[#f97316]/40 blob-reverse hidden lg:block animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-1/4 w-28 h-28 bg-[#f43f5e]/30 blob hidden lg:block animate-float" style={{ animationDelay: '4s' }} />

      {/* Content */}
      <div className="relative z-10 container-custom text-center text-white">
        <div className="max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/25 mb-8">
            <Sparkles size={18} className="text-[#f97316]" />
            <span className="text-sm font-extrabold">Join the Community</span>
          </div>

          <h2 
            className="text-4xl md:text-5xl lg:text-6xl mb-6 font-black"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {t.cta.title}
          </h2>
          
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            {t.cta.subtitle}
          </p>
          
          <Link to="/join-us">
            <Button 
              size="lg"
              className="bg-white text-[#10b981] hover:bg-white/95 rounded-2xl px-12 py-6 text-lg font-extrabold shadow-sharp-lg hover:shadow-sharp transition-all duration-300 hover:-translate-y-1"
            >
              {t.cta.button}
              <ArrowRight size={22} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
