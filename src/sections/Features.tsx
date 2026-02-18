import { Users, Home, MapPin, BedDouble, Sparkles, Wifi, Dumbbell, Waves } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const featureIcons = [Users, Home, MapPin, BedDouble, Sparkles];
const featureColors = ['#10b981', '#f97316', '#f43f5e', '#10b981', '#84cc16'];
const featureBgColors = ['#d1fae5', '#ffedd5', '#ffe4e6', '#d1fae5', '#ecfccb'];

export function Features() {
  const { t } = useLanguage();

  const features = [
    t.features.feature1,
    t.features.feature2,
    t.features.feature3,
    t.features.feature4,
    t.features.feature5,
  ];

  const extraFeatures = [
    { icon: Wifi, label: 'Fiber Internet', color: '#10b981', bgColor: '#d1fae5' },
    { icon: Dumbbell, label: 'Gym & Yoga', color: '#f97316', bgColor: '#ffedd5' },
    { icon: Waves, label: 'Heated Pool', color: '#f43f5e', bgColor: '#ffe4e6' },
  ];

  return (
    <section className="section-padding relative bg-white">
      {/* Pop Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-radial from-[#10b981]/10 to-transparent rounded-full blur-3xl" />
      
      <div className="container-custom relative">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-[#f43f5e] text-sm font-extrabold uppercase tracking-wider mb-4">
            <span className="w-10 h-1.5 bg-[#f43f5e] rounded-full" />
            Why La Villa
            <span className="w-10 h-1.5 bg-[#f43f5e] rounded-full" />
          </span>
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl text-[#0f172a]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {t.features.title}
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = featureIcons[index];
            const color = featureColors[index];
            const bgColor = featureBgColors[index];
            return (
              <div
                key={index}
                className="card-ultra group"
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                  style={{ background: bgColor }}
                >
                  <Icon size={28} style={{ color }} />
                </div>
                <h3 className="text-xl font-extrabold mb-3 text-[#0f172a]">{feature.title}</h3>
                <p className="text-[#64748b] leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Extra Features Bar */}
        <div className="flex flex-wrap justify-center gap-4">
          {extraFeatures.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-white shadow-sharp border-2 border-[#e2e8f0] hover:border-[#10b981]/40 hover:shadow-colored transition-all duration-300"
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: item.bgColor }}
                >
                  <Icon size={20} style={{ color: item.color }} />
                </div>
                <span className="text-sm font-extrabold text-[#0f172a]">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
