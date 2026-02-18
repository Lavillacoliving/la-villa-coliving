// Features V7 - Lifestyle section
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * VERSION 7: JEUNE + NOMADE + ZEN + FRAIS
 * Features style lifestyle
 */

export function FeaturesV7() {
  const { language } = useLanguage();

  const features = [
    {
      emoji: '🏡',
      title: language === 'en' ? 'Premium Properties' : 'Propriétés Premium',
      description: language === 'en' 
        ? 'Sauna, Swimming Pool, Gym, Cinéma Room, Large Outdoor Areas... and More !'
        : 'Sauna, Piscine, Salle de Sport, Salle Cinéma, Grand Espaces et Encore Plus !',
    },
    {
      emoji: '🚀',
      title: language === 'en' ? 'Highly Equipped Houses' : 'Maisons Ultra Equippées ',
      description: language === 'en'
        ? 'Fully equipped double kitchen, Premium furnishing, Gaming Console, BBQ, Soocer Table ... and More ! '
        : 'Double Cuisine équipée, Meubles Premium, Console de Jeu, BBQ, Babyfoot... et Plus !',
    },
    {
      emoji: '✨',
      title: language === 'en' ? 'Full Confort & Privacy' : 'Confort Premium & Intimité',
      description: language === 'en'
        ? 'Spacious and decorated rooms, with Emma Tediber mattress, Designer furnitures and silk sheets! '
        : 'Chambres spacieuses et décorées, avec matelas Emma ou Tediber, mobilier design et draps en soie ! ',
    },
    {
      emoji: '🎊',
      title: language === 'en' ? 'Community Vibes' : 'Vibes Communautaires',
      description: language === 'en'
        ? 'Dinners, activities, and spontaneous hangouts'
        : 'Dîners, activités et moments spontanés',
    },
    {
      emoji: '🏡',
      title: language === 'en' ? 'Truly All Inclusive' : 'Vraiment Tout inclus',
      description: language === 'en'
        ? 'Maintenance, fiber optics, energy charges, cleaning... but also Yoga/Fitness classes, monthly community meal, home entertainment memberships and more ! '
        : 'Entretien, fibre optique, charges énergétiques, nettoyage... mais aussi Cours de Yoga et de Fitness, repas communautaire mensuel, abonnements  et plus encore !',
    },
    {
      emoji: '💚',
      title: language === 'en' ? 'Good Energy' : 'Bonne Energie',
      description: language === 'en'
        ? 'Positive people who respect shared spaces'
        : 'Des gens positifs qui respectent les espaces partagés',
    },
  ];

  return (
    <section className="py-24 bg-[#f5f2ed] relative overflow-hidden">
      {/* Organic shapes */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#7c9a6d]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#d4897a]/10 rounded-full blur-3xl" />
      
      <div className="container-custom relative">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-white text-[#7c9a6d] text-sm font-medium rounded-full mb-6">
            🎁 {language === 'en' ? "What's included" : 'Ce qui est inclus'}
          </span>
          <h2 className="text-4xl md:text-5xl font-light text-[#3d4a38] mb-6">
            {language === 'en' ? 'Everything you' : 'Tout ce dont tu'}
            <span className="font-medium text-[#7c9a6d]"> {language === 'en' ? 'need' : 'as besoin'}</span> ✨
          </h2>
          <p className="text-[#5a6355] text-lg">
            {language === 'en' 
              ? 'Show up with your suitcase. We\'ve got the rest covered.'
              : 'Amène juste ta valise. On s\'occupe du reste.'}
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-6 rounded-3xl bg-white border border-[#7c9a6d]/10 hover:border-[#7c9a6d]/30 hover:shadow-[0_10px40px_rgba(124,154,109,0.1)] transition-all duration-500"
            >
              <div className="text-4xl mb-4">{feature.emoji}</div>
              <h3 className="text-lg font-medium text-[#3d4a38] mb-2">{feature.title}</h3>
              <p className="text-[#7c8a72] text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
