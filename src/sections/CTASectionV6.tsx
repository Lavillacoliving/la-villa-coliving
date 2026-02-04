import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * VERSION 6: CHALEUR + PREMIUM + MODERNITÉ
 * CTA section avec design chaud et premium
 */

export function CTASectionV6() {
  const { language } = useLanguage();

  return (
    <section className="py-24 bg-[#f5f0e8] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#c4705a]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#e8dfd1]/50 rounded-full blur-3xl" />
      
      <div className="container-custom relative">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block px-4 py-2 bg-white text-[#c4705a] text-xs uppercase tracking-[0.25em] font-medium rounded-full mb-8">
            {language === 'en' ? 'Ready to Join?' : 'Prêt à Nous Rejoindre ?'}
          </span>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#3d3632] mb-8 leading-tight">
            {language === 'en' ? 'Your New Home' : 'Votre Nouvelle'}
            <br />
            <span className="font-medium text-[#c4705a]">{language === 'en' ? 'Awaits' : 'Maison Vous Attend'}</span>
          </h2>
          
          <p className="text-[#5a524d] text-lg leading-relaxed mb-12 max-w-xl mx-auto">
            {language === 'en' 
              ? 'Join our community of professionals and experience coliving designed for modern life. Limited spots available.'
              : 'Rejoignez notre communauté de professionnels et vivez le coliving conçu pour la vie moderne. Places limitées disponibles.'}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/join-us"
              className="group relative inline-flex items-center gap-3 px-10 py-5 bg-[#c4705a] text-white font-medium rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(196,112,90,0.4)]"
            >
              <span className="relative z-10">{language === 'en' ? 'Apply Now' : 'Candidater Maintenant'}</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              <div className="absolute inset-0 bg-[#b05d48] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
            
            <Link 
              to="/our-houses"
              className="inline-flex items-center gap-3 px-10 py-5 border-2 border-[#3d3632] text-[#3d3632] font-medium rounded-full hover:bg-[#3d3632] hover:text-white transition-all duration-300"
            >
              {language === 'en' ? 'Explore Houses' : 'Explorer les Maisons'}
            </Link>
          </div>

          {/* Trust text */}
          <p className="mt-10 text-sm text-[#8a817a]">
            {language === 'en' 
              ? 'No commitment required. Apply to learn more.'
              : 'Aucun engagement requis. Candidatez pour en savoir plus.'}
          </p>
        </div>
      </div>
    </section>
  );
}
