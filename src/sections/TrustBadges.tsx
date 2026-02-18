import { useLanguage } from '@/contexts/LanguageContext';
import { Users, Star, Clock, Home } from 'lucide-react';

export function TrustBadges() {
  const { t } = useLanguage();

  const badges = [
    {
      icon: Users,
      value: '50+',
      label: t.trustBadges.members,
    },
    {
      icon: Star,
      value: '4.9/5',
      label: t.trustBadges.rating,
    },
    {
      icon: Clock,
      value: '30min',
      label: t.trustBadges.commute,
    },
    {
      icon: Home,
      value: '3',
      label: t.trustBadges.houses,
    },
  ];

  return (
    <section className="py-12 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#10b981]/10 to-[#84cc16]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <badge.icon className="w-7 h-7 text-[#10b981]" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-1">
                {badge.value}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {badge.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
