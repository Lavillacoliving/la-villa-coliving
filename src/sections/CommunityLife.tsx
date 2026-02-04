import { useLanguage } from '@/contexts/LanguageContext';
import { Utensils, Dumbbell, Waves, Users, Wine, Sun } from 'lucide-react';

export function CommunityLife() {
  const { language } = useLanguage();

  const activities = [
    {
      icon: Utensils,
      title: language === 'en' ? 'Community Dinners' : 'Dîners Communautaires',
      description: language === 'en' 
        ? 'Monthly themed dinners where everyone contributes and shares stories around the table'
        : 'Dîners thématiques mensuels où chacun contribue et partage des histoires autour de la table',
      image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&q=80',
      color: '#f97316',
    },
    {
      icon: Dumbbell,
      title: language === 'en' ? 'Yoga & Fitness' : 'Yoga & Fitness',
      description: language === 'en'
        ? 'Weekly group sessions to stay fit and centered together'
        : 'Séances de groupe hebdomadaires pour rester en forme et centrés ensemble',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
      color: '#10b981',
    },
    {
      icon: Waves,
      title: language === 'en' ? 'Pool Time' : 'Temps de Piscine',
      description: language === 'en'
        ? 'Relax by the heated pool, summer BBQs, and sunny afternoons'
        : 'Détente au bord de la piscine chauffée, BBQs d\'été et après-midis ensoleillés',
      image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&q=80',
      color: '#3b82f6',
    },
    {
      icon: Users,
      title: language === 'en' ? 'Workshops & Events' : 'Ateliers & Événements',
      description: language === 'en'
        ? 'From cooking classes to movie nights, there\'s always something happening'
        : 'Des cours de cuisine aux soirées cinéma, il se passe toujours quelque chose',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
      color: '#f43f5e',
    },
    {
      icon: Wine,
      title: language === 'en' ? 'Aperitivo Hours' : 'Heures de l\'Apéro',
      description: language === 'en'
        ? 'Friday evening drinks on the terrace to celebrate the weekend'
        : 'Boissons du vendredi soir sur la terrasse pour célébrer le week-end',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80',
      color: '#8b5cf6',
    },
    {
      icon: Sun,
      title: language === 'en' ? 'Weekend Getaways' : 'Escapades de Week-end',
      description: language === 'en'
        ? 'Group trips to the Alps, lake days, and outdoor adventures'
        : 'Sorties de groupe dans les Alpes, journées au lac et aventures en plein air',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
      color: '#84cc16',
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
          <span className="inline-flex items-center gap-2 text-[#10b981] text-sm font-extrabold uppercase tracking-wider mb-4">
            <span className="w-8 h-1.5 bg-[#10b981] rounded-full" />
            {language === 'en' ? 'Life at La Villa' : 'La Vie à La Villa'}
            <span className="w-8 h-1.5 bg-[#10b981] rounded-full" />
          </span>
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0f172a] mb-6"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {language === 'en' 
              ? 'More Than a Home: A Community' 
              : 'Plus Qu\'un Chez-Soi : Une Communauté'}
          </h2>
          <p className="text-lg text-gray-600">
            {language === 'en'
              ? 'Discover the experiences that make La Villa special. Every day brings new connections and memories.'
              : 'Découvrez les expériences qui rendent La Villa spéciale. Chaque jour apporte de nouvelles connexions et souvenirs.'}
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Icon Badge */}
                <div 
                  className="absolute top-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: activity.color }}
                >
                  <activity.icon className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#0f172a] mb-2 group-hover:text-[#10b981] transition-colors">
                  {activity.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {activity.description}
                </p>
              </div>

              {/* Hover accent */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: activity.color }}
              />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-500 mb-4">
            {language === 'en' 
              ? 'And many more moments to discover...' 
              : 'Et bien d\'autres moments à découvrir...'}
          </p>
        </div>
      </div>
    </section>
  );
}
