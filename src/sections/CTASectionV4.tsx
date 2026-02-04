import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';

export function CTASectionV4() {
  const { language } = useLanguage();

  return (
    <section className="py-24 lg:py-32 bg-[#c44536]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 
          className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        >
          {language === 'en' ? (
            <>
              Ready to <span className="font-medium">Live Together</span>?
            </>
          ) : (
            <>
              Prêt à <span className="font-medium">Vivre Ensemble</span> ?
            </>
          )}
        </h2>
        
        <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
          {language === 'en'
            ? 'Your new home is waiting. Apply now and join our curated community.'
            : 'Votre nouveau chez-vous vous attend. Candidaturez maintenant et rejoignez notre communauté.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/join-us"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-[#c44536] font-bold hover:bg-[#1a1a1a] hover:text-white transition-all duration-300"
          >
            {language === 'en' ? 'APPLY NOW' : 'CANDIDATER'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            to="/our-houses"
            className="inline-flex items-center gap-3 px-8 py-4 border-2 border-white text-white font-bold hover:bg-white hover:text-[#c44536] transition-all duration-300"
          >
            {language === 'en' ? 'VIEW HOUSES' : 'VOIR LES MAISONS'}
          </Link>
        </div>
      </div>
    </section>
  );
}
