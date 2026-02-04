import { useLanguage } from '@/contexts/LanguageContext';
import { Rocket, Wifi, Users, Shield } from 'lucide-react';

export function WhyChooseUs() {
  const { t } = useLanguage();

  const items = [
    {
      icon: Rocket,
      title: t.whyChooseUs.item1.title,
      description: t.whyChooseUs.item1.description,
      color: 'from-[#f97316] to-[#f43f5e]',
      bgColor: 'bg-[#f97316]/10',
      iconColor: 'text-[#f97316]',
    },
    {
      icon: Wifi,
      title: t.whyChooseUs.item2.title,
      description: t.whyChooseUs.item2.description,
      color: 'from-[#10b981] to-[#84cc16]',
      bgColor: 'bg-[#10b981]/10',
      iconColor: 'text-[#10b981]',
    },
    {
      icon: Users,
      title: t.whyChooseUs.item3.title,
      description: t.whyChooseUs.item3.description,
      color: 'from-[#f43f5e] to-[#f97316]',
      bgColor: 'bg-[#f43f5e]/10',
      iconColor: 'text-[#f43f5e]',
    },
    {
      icon: Shield,
      title: t.whyChooseUs.item4.title,
      description: t.whyChooseUs.item4.description,
      color: 'from-[#84cc16] to-[#10b981]',
      bgColor: 'bg-[#84cc16]/10',
      iconColor: 'text-[#84cc16]',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#10b981]/5 blob rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#f97316]/5 blob-reverse rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0f172a] mb-6">
            {t.whyChooseUs.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            {t.whyChooseUs.subtitle}
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl p-8 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-500 overflow-hidden"
            >
              {/* Hover gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl ${item.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className={`w-8 h-8 ${item.iconColor}`} />
              </div>

              {/* Content */}
              <h3 className="text-xl md:text-2xl font-bold text-[#0f172a] mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>

              {/* Decorative corner */}
              <div className={`absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
