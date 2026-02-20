// Features V9 - Stone & Brass
import { Waves, Sofa, BedDouble, Users, CircleCheck, TreePine } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { STATS } from '@/data/stats';

/**
 * VERSION 9: STONE & BRASS
 * Features — icon boxes, clean cards, Inter bold H2
 */

export function FeaturesV7() {
  const { language } = useLanguage();

  const features = [
    {
      icon: Waves,
      title: language === 'en' ? 'Pool, sauna & gym' : 'Piscine, sauna & salle de sport',
      description: language === 'en'
        ? 'In every house: pool (indoor at Le Loft, outdoor at La Villa and Le Lodge), sauna, and fully equipped gym.'
        : 'Dans chaque maison : piscine (intérieure au Loft, extérieure à La Villa et au Lodge), sauna et salle de sport complète.',
    },
    {
      icon: Sofa,
      title: language === 'en' ? 'Fully equipped houses' : 'Maisons ultra-équipées',
      description: language === 'en'
        ? 'Double kitchen, designer furniture, TV & gaming room, foosball, BBQ, outdoor kitchen. At Le Lodge: arcade machine.'
        : 'Double cuisine, mobilier design, salle TV & gaming, babyfoot, BBQ, cuisine extérieure. Au Lodge : jeu d\'arcade.',
    },
    {
      icon: BedDouble,
      title: language === 'en' ? `Spacious rooms from ${STATS.roomSizeMin} to ${STATS.roomSizeMax} m²` : `Chambres spacieuses de ${STATS.roomSizeMin} à ${STATS.roomSizeMax} m²`,
      description: language === 'en'
        ? '50% larger than the coliving average. Emma or Tediber mattress, designer furniture. Most with private bathroom.'
        : '50% plus grandes que la moyenne coliving. Matelas Emma ou Tediber, mobilier design. La plupart avec salle de bain privative.',
    },
    {
      icon: Users,
      title: language === 'en' ? 'Active community life' : 'Vie communautaire active',
      description: language === 'en'
        ? 'Monthly pizza party, meal basket, private yoga and fitness classes, board games, foosball. All included, all optional.'
        : 'Pizza Party mensuelle, panier repas, cours de yoga et fitness privés, jeux de société, babyfoot. Tout inclus, tout optionnel.',
    },
    {
      icon: CircleCheck,
      title: language === 'en' ? 'Truly all inclusive' : 'Vraiment tout inclus',
      description: language === 'en'
        ? `Utilities, ${STATS.wifiBandwidth} fiber, housekeeping 2×/week, parking, streaming, fitness classes, bed linen — ${STATS.includedItems} services in one rent. No add-ons, no hidden fees.`
        : `Charges, fibre ${STATS.wifiBandwidth}, ménage 2×/semaine, parking, streaming, cours de sport, linge de lit — ${STATS.includedItems} services dans un seul loyer. Pas d'options à ajouter, pas de frais cachés.`,
    },
    {
      icon: TreePine,
      title: language === 'en' ? 'Stay as long as you want' : 'Restez le temps que vous voulez',
      description: language === 'en'
        ? 'Our residents stay between 6 months and 3 years. Long enough to build real friendships, free enough to leave when life changes.'
        : 'Nos résidents restent entre 6 mois et 3 ans. Assez longtemps pour créer de vraies amitiés, assez libre pour partir quand votre vie change.',
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-[#FAF9F6]">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-16">
          <span className="text-[#44403C] text-[13px] font-semibold tracking-[0.1em] uppercase">
            {language === 'en' ? `ALL INCLUSIVE — ${STATS.includedItems} SERVICES` : `TOUT INCLUS — ${STATS.includedItems} SERVICES`}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1C1917] mt-4 mb-5" style={{ letterSpacing: '-0.025em' }}>
            {language === 'en' ? 'One payment. Zero surprises.' : 'Un seul paiement. Zéro surprise.'}
          </h2>
          <p className="text-[#78716C] text-base md:text-lg">
            {language === 'en'
              ? `Bring your suitcase. We take care of everything else — ${STATS.includedItems} services covered in a single rent of CHF ${STATS.priceChf.toLocaleString('en')}/month.`
              : `Apportez votre valise. Nous nous occupons de tout le reste — ${STATS.includedItems} services couverts en un seul loyer de ${STATS.priceChf.toLocaleString('fr-FR')} CHF/mois.`}
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 md:p-7 bg-white rounded-2xl border border-[#E7E5E4] hover:border-[#44403C]/20 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:translate-y-[-2px] transition-all duration-300"
            >
              <div className="w-12 h-12 bg-[#F5F2ED] rounded-xl flex items-center justify-center mb-5">
                <feature.icon className="w-5 h-5 text-[#44403C]" />
              </div>
              <h3 className="text-base font-semibold text-[#1C1917] mb-2">{feature.title}</h3>
              <p className="text-[#78716C] text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
