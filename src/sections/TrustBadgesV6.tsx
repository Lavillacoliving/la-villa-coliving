import { Shield, Users, Home, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * VERSION 6: CHALEUR + PREMIUM + MODERNITÉ
 * Trust badges avec design chaud et premium
 */

export function TrustBadgesV6() {
  const { language } = useLanguage();

  const badges = [
    {
      icon: Shield,
      title: language === 'en' ? 'Verified Homes' : 'Maisons Vérifiées',
      description: language === 'en' ? 'All properties inspected' : 'Toutes les propriétés inspectées',
    },
    {
      icon: Users,
      title: language === 'en' ? 'Curated Community' : 'Communauté Sélectionnée',
      description: language === 'en' ? 'Like-minded professionals' : 'Professionnels partageant les mêmes valeurs',
    },
    {
      icon: Home,
      title: language === 'en' ? 'Fully Furnished' : 'Entièrement Meublé',
      description: language === 'en' ? 'Move in ready' : 'Prêt à emménager',
    },
    {
      icon: Clock,
      title: language === 'en' ? 'Flexible Stays' : 'Séjours Flexibles',
      description: language === 'en' ? 'From 1 month' : 'À partir d\'1 mois',
    },
  ];

  return (
    <section className="py-20 bg-[#faf8f5] relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f5f0e8]/30 to-transparent" />
      
      <div className="container-custom relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map((badge, index) => (
            <div 
              key={index} 
              className="group text-center p-8 rounded-2xl bg-white border border-[#e8dfd1]/50 hover:border-[#c4705a]/30 hover:shadow-[0_10px_40px_rgba(196,112,90,0.08)] transition-all duration-500"
            >
              <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-[#f5f0e8] flex items-center justify-center group-hover:bg-[#c4705a]/10 transition-colors duration-300">
                <badge.icon className="w-6 h-6 text-[#c4705a]" />
              </div>
              <h3 className="text-[#3d3632] font-medium mb-2">{badge.title}</h3>
              <p className="text-sm text-[#8a817a]">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
