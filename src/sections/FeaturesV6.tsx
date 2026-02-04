import { Wifi, Coffee, Sparkles, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * VERSION 6: CHALEUR + PREMIUM + MODERNITÉ
 * Features avec design chaud et premium
 */

export function FeaturesV6() {
  const { language } = useLanguage();

  const features = [
    {
      icon: Wifi,
      title: language === 'en' ? 'High-Speed WiFi' : 'WiFi Haut Débit',
      description: language === 'en' 
        ? 'Fiber optic internet throughout the house for seamless work and streaming.'
        : 'Internet fibre optique dans toute la maison pour un travail et du streaming fluides.',
    },
    {
      icon: Coffee,
      title: language === 'en' ? 'Fully Equipped Kitchen' : 'Cuisine Entièrement Équipée',
      description: language === 'en'
        ? 'Professional appliances, coffee machine, and everything you need to cook and share meals.'
        : 'Appareils professionnels, machine à café, et tout ce dont vous avez besoin pour cuisiner et partager des repas.',
    },
    {
      icon: Sparkles,
      title: language === 'en' ? 'Weekly Cleaning' : 'Ménage Hebdomadaire',
      description: language === 'en'
        ? 'Professional cleaning of common areas so you can focus on enjoying your stay.'
        : 'Nettoyage professionnel des espaces communs pour que vous puissiez vous concentrer sur votre séjour.',
    },
    {
      icon: Calendar,
      title: language === 'en' ? 'Community Events' : 'Événements Communautaires',
      description: language === 'en'
        ? 'Regular dinners, activities, and gatherings to build meaningful connections.'
        : 'Dîners réguliers, activités et rencontres pour créer des liens significatifs.',
    },
  ];

  return (
    <section className="py-24 bg-[#f5f0e8] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#c4705a]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#e8dfd1]/50 rounded-full blur-3xl" />
      
      <div className="container-custom relative">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-white text-[#c4705a] text-xs uppercase tracking-[0.25em] font-medium rounded-full mb-6">
            {language === 'en' ? 'What\'s Included' : 'Ce Qui Est Inclus'}
          </span>
          <h2 className="text-4xl md:text-5xl font-light text-[#3d3632] mb-6">
            {language === 'en' ? 'Everything You' : 'Tout Ce Dont Vous'}
            <span className="font-medium text-[#c4705a]"> {language === 'en' ? 'Need' : 'Avez Besoin'}</span>
          </h2>
          <p className="text-[#5a524d] text-lg">
            {language === 'en' 
              ? 'All-inclusive living means no surprises. Just show up with your suitcase.'
              : 'La vie tout inclusive signifie pas de surprises. Il suffit d\'arriver avec votre valise.'}
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 rounded-2xl bg-white border border-[#e8dfd1]/50 hover:border-[#c4705a]/20 hover:shadow-[0_10px_40px_rgba(196,112,90,0.08)] transition-all duration-500"
            >
              <div className="w-14 h-14 mb-6 rounded-xl bg-[#f5f0e8] flex items-center justify-center group-hover:bg-[#c4705a] transition-colors duration-300">
                <feature.icon className="w-6 h-6 text-[#c4705a] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-medium text-[#3d3632] mb-3">{feature.title}</h3>
              <p className="text-[#8a817a] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
