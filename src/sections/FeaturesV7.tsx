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
      emoji: '\uD83C\uDFE1',
      title: language === 'en' ? 'Premium Properties' : 'Propri\u00E9t\u00E9s Premium',
      description: language === 'en'
        ? 'Sauna, pool, gym, cinema room, large outdoor areas and more.'
        : 'Sauna, piscine, salle de sport, salle cin\u00E9ma, grands espaces ext\u00E9rieurs et plus encore.',
    },
    {
      emoji: '\uD83D\uDE80',
      title: language === 'en' ? 'Fully Equipped Homes' : 'Maisons Ultra \u00C9quip\u00E9es',
      description: language === 'en'
        ? 'Double kitchen, premium furnishing, gaming console, BBQ, foosball and more.'
        : 'Double cuisine \u00E9quip\u00E9e, mobilier premium, console de jeu, BBQ, babyfoot et plus.',
    },
    {
      emoji: '\u2728',
      title: language === 'en' ? 'Full Comfort & Privacy' : 'Confort Premium & Intimit\u00E9',
      description: language === 'en'
        ? 'Spacious decorated rooms with Emma/Tediber mattress, designer furniture, silk sheets.'
        : 'Chambres spacieuses et d\u00E9cor\u00E9es, matelas Emma/Tediber, mobilier design, draps en soie.',
    },
    {
      emoji: '\uD83C\uDF89',
      title: language === 'en' ? 'Community Vibes' : 'Vibes Communautaires',
      description: language === 'en'
        ? 'Dinners, activities, and spontaneous hangouts.'
        : 'D\u00EEners, activit\u00E9s et moments spontan\u00E9s.',
    },
    {
      emoji: '\uD83C\uDFE1',
      title: language === 'en' ? 'Truly All Inclusive' : 'Vraiment Tout Inclus',
      description: language === 'en'
        ? 'Maintenance, fiber, energy, cleaning, yoga classes, monthly dinner, streaming and more.'
        : 'Entretien, fibre, \u00E9nergie, m\u00E9nage, cours de yoga/fitness, repas communautaire, streaming et plus.',
    },
    {
      emoji: '\uD83D\uDC9A',
      title: language === 'en' ? 'Good Energy' : 'Bonne \u00C9nergie',
      description: language === 'en'
        ? 'Positive people who respect shared spaces.'
        : 'Des gens positifs qui respectent les espaces partag\u00E9s.',
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
