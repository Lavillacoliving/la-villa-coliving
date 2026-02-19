// Features V7 - Premium section
import { Waves, Sofa, BedDouble, Users, CheckCircle, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { STATS } from '@/data/stats';

/**
 * VERSION 7: PREMIUM + FACTUEL + USPs
 * Features — icônes lucide-react, textes factuels, vouvoiement
 */

export function FeaturesV7() {
  const { language } = useLanguage();

  const features = [
    {
      icon: Waves,
      title: language === 'en' ? 'Pool, sauna & gym' : 'Piscine, sauna & salle de sport',
      description: language === 'en'
        ? 'In every house: pool (indoor at Le Loft, outdoor at La Villa and Le Lodge), sauna, fully equipped gym. At Le Lodge: jacuzzi included.'
        : 'Dans chaque maison : piscine (intérieure au Loft, extérieure à La Villa et au Lodge), sauna, salle de sport équipée. Au Lodge : jacuzzi en plus.',
    },
    {
      icon: Sofa,
      title: language === 'en' ? 'Fully equipped houses' : 'Maisons ultra-équipées',
      description: language === 'en'
        ? 'Double equipped kitchen, designer furniture, TV & gaming room, foosball, BBQ, outdoor kitchen. At Le Lodge: arcade machine and shuffleboard.'
        : 'Double cuisine équipée, mobilier design, salle TV & gaming, babyfoot, BBQ XXL, cuisine extérieure. Au Lodge : jeu d\'arcade et jeux de palets.',
    },
    {
      icon: BedDouble,
      title: language === 'en' ? `Spacious rooms from ${STATS.roomSizeMin} to ${STATS.roomSizeMax} m²` : `Chambres spacieuses de ${STATS.roomSizeMin} à ${STATS.roomSizeMax} m²`,
      description: language === 'en'
        ? 'Rooms 50% larger than the coliving market average (9-14 m²). Emma or Tediber mattress, designer furniture, premium bedding. Most with private bathroom.'
        : `Des chambres 50% plus grandes que la moyenne du marché coliving (9-14 m²). Matelas Emma ou Tediber, mobilier design, literie premium. La plupart avec salle de bain privative.`,
    },
    {
      icon: Users,
      title: language === 'en' ? 'Active community life' : 'Vie communautaire active',
      description: language === 'en'
        ? 'Monthly pizza party, monthly meal basket delivery, private weekly yoga and fitness classes, board games, foosball. All included, all optional.'
        : 'Pizza Party mensuelle, panier repas livré chaque mois, cours de yoga et fitness privés hebdomadaires, jeux de société, babyfoot. Tout inclus, tout optionnel.',
    },
    {
      icon: CheckCircle,
      title: language === 'en' ? 'Truly all inclusive' : 'Vraiment tout inclus',
      description: language === 'en'
        ? `Utilities, ${STATS.wifiBandwidth} fiber, housekeeping twice a week, parking, streaming, fitness classes, pizza party, bed linen, full maintenance — 20 expense items covered in a single payment.`
        : `Charges, fibre ${STATS.wifiBandwidth}, ménage 2×/semaine, parking, streaming, cours de sport, pizza party, linge de lit, entretien complet — 20 postes de dépenses couverts en un seul paiement.`,
    },
    {
      icon: Shield,
      title: language === 'en' ? 'Curated community' : 'Communauté sélectionnée',
      description: language === 'en'
        ? `${STATS.minResidentsPerHouse} to ${STATS.maxResidentsPerHouse} residents per house, carefully selected. Young professionals, cross-border workers, expats — responsible and sociable profiles.`
        : `${STATS.minResidentsPerHouse} à ${STATS.maxResidentsPerHouse} résidents par maison, soigneusement sélectionnés. Jeunes professionnels CSP+, frontaliers, expatriés — des profils responsables et sociables.`,
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
            {language === 'en' ? "What's included" : 'Ce qui est inclus'}
          </span>
          <h2 className="text-4xl md:text-5xl font-light text-[#3d4a38] mb-6">
            {language === 'en' ? 'Everything you' : 'Tout ce dont vous avez'}
            <span className="font-medium text-[#7c9a6d]"> {language === 'en' ? 'need' : 'besoin'}</span>
          </h2>
          <p className="text-[#5a6355] text-lg">
            {language === 'en'
              ? 'Bring your suitcase. We take care of everything else.'
              : 'Apportez votre valise. Nous nous occupons de tout le reste.'}
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-3xl bg-white border border-[#7c9a6d]/10 hover:border-[#7c9a6d]/30 hover:shadow-[0_10px40px_rgba(124,154,109,0.1)] transition-all duration-500"
            >
              <feature.icon className="w-8 h-8 text-[#7c9a6d] mb-4" />
              <h3 className="text-lg font-medium text-[#3d4a38] mb-2">{feature.title}</h3>
              <p className="text-[#7c8a72] text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
