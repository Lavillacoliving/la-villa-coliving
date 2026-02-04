import { useLanguage } from '@/contexts/LanguageContext';
import { Users, Star, Clock, Home } from 'lucide-react';

export function TrustBadgesV4() {
  const { language } = useLanguage();

  const badges = [
    {
      icon: Users,
      value: '50+',
      label: language === 'en' ? 'Happy Members' : 'Membres Heureux',
    },
    {
      icon: Star,
      value: '4.9/5',
      label: language === 'en' ? 'Member Rating' : 'Note des Membres',
    },
    {
      icon: Clock,
      value: '30min',
      label: language === 'en' ? 'To Geneva' : 'De Genève',
    },
    {
      icon: Home,
      value: '3',
      label: language === 'en' ? 'Unique Homes' : 'Maisons Uniques',
    },
  ];

  return (
    <section className="py-16 bg-white border-y border-[#e5e5e5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 border border-[#e5e5e5] flex items-center justify-center mb-4">
                <badge.icon className="w-5 h-5 text-[#c44536]" />
              </div>
              <div className="text-3xl md:text-4xl font-light text-[#1a1a1a] mb-1">
                {badge.value}
              </div>
              <div className="text-xs text-[#999] uppercase tracking-wider">
                {badge.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
