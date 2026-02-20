import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { STATS } from '@/data/stats';

/**
 * VERSION 9: STONE & BRASS — CONDO PREMIUM
 * CTA section — dark bg, brass accent button, white outline secondary
 */

export function CTASectionV7() {
  const { language } = useLanguage();

  return (
    <section className="py-24 bg-[#1C1917]">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow */}
          <span className="text-[13px] font-semibold tracking-wider uppercase text-[#E0BB8A] mb-5 block">
            {language === 'en' ? 'READY TO JOIN?' : 'PRÊT À NOUS REJOINDRE ?'}
          </span>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6">
            {language === 'en' ? 'Your next home is waiting' : 'Votre prochaine maison vous attend'}
          </h2>

          {/* Subtitle */}
          <p className="text-white/60 text-lg leading-relaxed mb-12 max-w-xl mx-auto">
            {language === 'en'
              ? `Over ${STATS.totalResidents} residents have chosen our houses since ${STATS.foundedYear}. Pool, sauna, gym, private yoga and fitness classes, pizza nights — all included in ${STATS.totalHouses} human-scale houses, ${STATS.genevaCenterMinutes} min from Geneva city center.`
              : `Plus de ${STATS.totalResidents} résidents ont choisi nos maisons depuis ${STATS.foundedYear}. Piscine, sauna, salle de sport, cours de yoga et fitness privés, pizza party — tout inclus dans ${STATS.totalHouses} maisons à taille humaine, à ${STATS.genevaCenterMinutes} min du centre de Genève.`}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/join-us"
              className="group inline-flex items-center gap-3 px-10 py-4 bg-[#D4A574] text-[#1C1917] font-semibold rounded-lg hover:bg-[#E0BB8A] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A574] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1917]"
            >
              {language === 'en' ? 'Apply now' : 'Rejoindre La Villa'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            <Link
              to="/our-houses"
              className="inline-flex items-center gap-3 px-10 py-4 border border-white/30 text-white font-semibold rounded-lg hover:border-white hover:bg-white/5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1917]"
            >
              {language === 'en' ? 'Explore our houses' : 'Découvrir nos maisons'}
            </Link>
          </div>

          {/* Trust text */}
          <p className="mt-10 text-sm text-white/40">
            {language === 'en'
              ? '2-minute application — no commitment'
              : 'Candidature en 2 minutes — sans engagement'}
          </p>

          {/* WhatsApp CTA */}
          <a
            href="https://wa.me/33664315134"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm text-white/40 hover:text-[#E0BB8A] transition-colors duration-300"
          >
            {language === 'en'
              ? 'Or ask us a question directly on WhatsApp →'
              : 'Ou posez-nous directement une question sur WhatsApp →'}
          </a>
        </div>
      </div>
    </section>
  );
}
