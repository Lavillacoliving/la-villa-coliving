import { useLanguage } from '@/contexts/LanguageContext';
import { Laptop, Briefcase, Plane, GraduationCap, Heart, Rocket } from 'lucide-react';

export function WhoIsItFor() {
  const { language } = useLanguage();

  const profiles = [
    {
      icon: Laptop,
      title: language === 'en' ? 'Remote Workers' : 'Travailleurs à Distance',
      description: language === 'en'
        ? 'High-speed internet, dedicated workspaces, and a community that understands the remote lifestyle'
        : 'Internet haut débit, espaces de travail dédiés et une communauté qui comprend le mode de vie à distance',
      image: 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=600&q=80',
      color: '#10b981',
    },
    {
      icon: Briefcase,
      title: language === 'en' ? 'Young Professionals' : 'Jeunes Professionnels',
      description: language === 'en'
        ? 'Start your career in Geneva with an instant network and no housing hassles'
        : 'Commencez votre carrière à Genève avec un réseau instantané et sans tracas de logement',
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80',
      color: '#f97316',
    },
    {
      icon: Plane,
      title: language === 'en' ? 'Expats & Nomads' : 'Expats & Nomades',
      description: language === 'en'
        ? 'A ready-made community in a new country. No furniture, no stress, just arrive and live'
        : 'Une communauté toute prête dans un nouveau pays. Pas de meubles, pas de stress, arrivez et vivez',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80',
      color: '#3b82f6',
    },
    {
      icon: GraduationCap,
      title: language === 'en' ? 'Students & Interns' : 'Étudiants & Stagiaires',
      description: language === 'en'
        ? 'Flexible stays perfect for internships, exchanges, or short-term programs'
        : 'Séjours flexibles parfaits pour les stages, échanges ou programmes à court terme',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80',
      color: '#8b5cf6',
    },
    {
      icon: Heart,
      title: language === 'en' ? 'Wellness Enthusiasts' : 'Passionnés de Bien-être',
      description: language === 'en'
        ? 'Yoga classes, gym access, sauna, and a community that values balance'
        : 'Cours de yoga, accès au gym, sauna et une communauté qui valorise l\'équilibre',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
      color: '#f43f5e',
    },
    {
      icon: Rocket,
      title: language === 'en' ? 'Entrepreneurs' : 'Entrepreneurs',
      description: language === 'en'
        ? 'Network with other ambitious people while maintaining work-life balance'
        : 'Réseautez avec d\'autres personnes ambitieuses tout en maintenant l\'équilibre travail-vie',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80',
      color: '#84cc16',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-[#f8fafc] to-white relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-[#f97316]/5 blob rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-[#10b981]/5 blob-reverse rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 text-[#f43f5e] text-sm font-extrabold uppercase tracking-wider mb-4">
            <span className="w-8 h-1.5 bg-[#f43f5e] rounded-full" />
            {language === 'en' ? 'For You?' : 'Pour Vous ?'}
            <span className="w-8 h-1.5 bg-[#f43f5e] rounded-full" />
          </span>
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0f172a] mb-6"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {language === 'en' 
              ? 'Who is Coliving For?' 
              : 'À Qui S\'adresse le Coliving ?'}
          </h2>
          <p className="text-lg text-gray-600">
            {language === 'en'
              ? 'La Villa is designed for people who value community, convenience, and quality living'
              : 'La Villa est conçu pour les personnes qui valorisent la communauté, la commodité et la qualité de vie'}
          </p>
        </div>

        {/* Profiles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={profile.image}
                  alt={profile.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Icon Badge */}
                <div 
                  className="absolute top-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm"
                  style={{ backgroundColor: profile.color }}
                >
                  <profile.icon className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 
                  className="text-xl font-bold mb-2 group-hover:text-[#10b981] transition-colors"
                  style={{ color: profile.color }}
                >
                  {profile.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {profile.description}
                </p>
              </div>

              {/* Hover accent */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: profile.color }}
              />
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center">
          <p className="text-gray-500">
            {language === 'en' 
              ? 'Not sure if coliving is right for you? ' 
              : 'Pas sûr que le coliving soit fait pour vous ? '}
            <a href="/faq" className="text-[#10b981] font-bold hover:underline">
              {language === 'en' ? 'Check our FAQ' : 'Consultez notre FAQ'}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
