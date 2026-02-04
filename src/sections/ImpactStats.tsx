import { useLanguage } from '@/contexts/LanguageContext';
import { Heart, Users, Home, Globe } from 'lucide-react';

export function ImpactStats() {
  const { language } = useLanguage();

  const stats = [
    {
      icon: Heart,
      value: '7%',
      label: language === 'en' ? 'Feel Lonely' : 'Se Sentent Seuls',
      comparison: language === 'en' ? 'vs 53% nationally' : 'vs 53% au niveau national',
      description: language === 'en' 
        ? 'La Villa residents report significantly lower feelings of loneliness compared to the general population'
        : 'Les résidents de La Villa rapportent des sentiments de solitude significativement plus faibles',
      color: '#f43f5e',
      bgColor: 'bg-[#f43f5e]/10',
    },
    {
      icon: Users,
      value: '85%',
      label: language === 'en' ? 'Stay Connected' : 'Restent Connectés',
      comparison: language === 'en' ? 'after moving out' : 'après avoir déménagé',
      description: language === 'en'
        ? 'Former residents maintain friendships with their housemates long after leaving'
        : 'Les anciens résidents maintiennent des amitiés avec leurs colocataires longtemps après être partis',
      color: '#10b981',
      bgColor: 'bg-[#10b981]/10',
    },
    {
      icon: Home,
      value: '50+',
      label: language === 'en' ? 'Happy Colivers' : 'Colivers Heureux',
      comparison: language === 'en' ? 'and growing' : 'et ça grandit',
      description: language === 'en'
        ? 'Members from over 25 countries have called La Villa home'
        : 'Des membres de plus de 25 pays ont fait de La Villa leur chez-vous',
      color: '#f97316',
      bgColor: 'bg-[#f97316]/10',
    },
    {
      icon: Globe,
      value: '25+',
      label: language === 'en' ? 'Nationalities' : 'Nationalités',
      comparison: language === 'en' ? 'in our community' : 'dans notre communauté',
      description: language === 'en'
        ? 'A diverse international community bringing different perspectives together'
        : 'Une communauté internationale diverse rassemblant différentes perspectives',
      color: '#8b5cf6',
      bgColor: 'bg-[#8b5cf6]/10',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-[#f8fafc] to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-[#10b981]/5 blob rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-[#f43f5e]/5 blob-reverse rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 text-[#f43f5e] text-sm font-extrabold uppercase tracking-wider mb-4">
            <span className="w-8 h-1.5 bg-[#f43f5e] rounded-full" />
            {language === 'en' ? 'Our Impact' : 'Notre Impact'}
            <span className="w-8 h-1.5 bg-[#f43f5e] rounded-full" />
          </span>
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0f172a] mb-6"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {language === 'en' 
              ? 'La Villa Creates Real Connections' 
              : 'La Villa Crée de Vraies Connexions'}
          </h2>
          <p className="text-lg text-gray-600">
            {language === 'en'
              ? 'Numbers that show the difference community living makes'
              : 'Des chiffres qui montrent la différence que fait la vie communautaire'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 overflow-hidden"
            >
              {/* Background gradient on hover */}
              <div 
                className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity ${stat.bgColor}`}
              />

              <div className="flex items-start gap-6">
                {/* Icon */}
                <div 
                  className={`w-16 h-16 rounded-2xl ${stat.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="w-8 h-8" style={{ color: stat.color }} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span 
                      className="text-4xl md:text-5xl font-black"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0f172a] mb-1">
                    {stat.label}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    {stat.comparison}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </div>

              {/* Decorative corner */}
              <div 
                className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 transition-opacity"
                style={{ backgroundColor: stat.color }}
              />
            </div>
          ))}
        </div>

        {/* Bottom Quote */}
        <div className="mt-16 text-center">
          <blockquote className="text-xl md:text-2xl text-[#0f172a] font-medium italic max-w-3xl mx-auto">
            "{language === 'en' 
              ? 'La Villa isn\'t just about sharing a house. It\'s about creating a home where everyone belongs.' 
              : 'La Villa n\'est pas seulement partager une maison. C\'est créer un chez-soi où tout le monde appartient.'}"
          </blockquote>
          <p className="text-gray-500 mt-4">
            — {language === 'en' ? 'The La Villa Team' : 'L\'Équipe La Villa'}
          </p>
        </div>
      </div>
    </section>
  );
}
