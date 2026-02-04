import { useLanguage } from '@/contexts/LanguageContext';
import { Users, Sparkles, MapPin, BedDouble, CheckCircle2 } from 'lucide-react';

export function FeaturesV4() {
  const { language } = useLanguage();

  const features = [
    {
      icon: Users,
      title: language === 'en' ? 'Curated Community' : 'Communauté Sélectionnée',
      description: language === 'en' 
        ? 'Move in with people who share your lifestyle and values'
        : 'Emménagez avec des personnes qui partagent votre mode de vie',
    },
    {
      icon: Sparkles,
      title: language === 'en' ? 'Premium Amenities' : 'Équipements Premium',
      description: language === 'en'
        ? 'Designer spaces, heated pool, gym, wellness area & expansive common areas'
        : 'Espaces design, piscine chauffée, gym, espace bien-être',
    },
    {
      icon: MapPin,
      title: language === 'en' ? 'Prime Location' : 'Emplacement Privilégié',
      description: language === 'en'
        ? '30 min from Geneva center | 45 min from the Alps'
        : '30 min du centre de Genève | 45 min des Alpes',
    },
    {
      icon: BedDouble,
      title: language === 'en' ? 'Private Comfort' : 'Confort Privé',
      description: language === 'en'
        ? 'Spacious, designed rooms with premium bedding & furnishings'
        : 'Chambres spacieuses et design avec literie premium',
    },
    {
      icon: CheckCircle2,
      title: language === 'en' ? 'Truly All-Inclusive' : 'Vraiment Tout Inclus',
      description: language === 'en'
        ? 'Utilities, fiber internet, cleaning, fitness classes, community events & more'
        : 'Services, fibre, ménage, cours de fitness, événements & plus',
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs text-[#999] uppercase tracking-[0.3em] mb-4 block">
            {language === 'en' ? 'What We Offer' : 'Ce Que Nous Offrons'}
          </span>
          <h2 
            className="text-4xl md:text-5xl font-light text-[#1a1a1a]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {language === 'en' ? 'Everything Included' : 'Tout Est Inclus'}
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 border border-[#e5e5e5] group hover:border-[#c44536] transition-colors"
            >
              <div className="w-12 h-12 border border-[#e5e5e5] flex items-center justify-center mb-6 group-hover:border-[#c44536] group-hover:bg-[#c44536] transition-all">
                <feature.icon className="w-5 h-5 text-[#1a1a1a] group-hover:text-white transition-colors" />
              </div>

              <h3 className="text-lg font-medium text-[#1a1a1a] mb-3">
                {feature.title}
              </h3>
              <p className="text-[#666] text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
