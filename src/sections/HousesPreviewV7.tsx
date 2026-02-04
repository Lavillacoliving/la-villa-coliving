import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * VERSION 7: JEUNE + NOMADE + ZEN + FRAIS
 * Houses preview style lifestyle
 */

export function HousesPreviewV7() {
  const { language } = useLanguage();

  const houses = [
    {
      id: 'la-villa',
      name: 'La Villa',
      emoji: '🏡',
      location: 'Ville-la-Grand',
      residents: '10',
      image: '/images/villa_portrait.webp',
      description: language === 'en' 
        ? 'Garden, pool & good vibes'
        : 'Jardin, piscine & bonnes vibes',
    },
    {
      id: 'le-loft',
      name: 'Le Loft',
      emoji: '🏢',
      location: 'Ambilly',
      residents: '7',
      image: '/images/le loft jardin.webp',
      description: language === 'en'
        ? 'Urban style in the city center'
        : 'Style urbain en centre-ville',
    },
    {
      id: 'le-lodge',
      name: 'Le Lodge',
      emoji: '🌲',
      location: 'Annemasse',
      residents: '12',
      image: '/images/le lodge piscine.webp',
      description: language === 'en'
        ? 'Cozy retreat...in the middle of the city !'
        : 'Refuge cosy...en pleine ville !',
    },
  ];

  return (
    <section className="py-24 bg-[#faf9f5] relative overflow-hidden">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div>
            <span className="inline-block px-4 py-2 bg-[#7c9a6d]/15 text-[#7c9a6d] text-sm font-medium rounded-full mb-6">
              🏠 {language === 'en' ? 'Our homes' : 'Nos maisons'}
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-[#3d4a38]">
              {language === 'en' ? 'Pick your' : 'Choisis ton'}
              <span className="font-medium text-[#7c9a6d]"> {language === 'en' ? 'spot' : 'spot'}</span> 🎯
            </h2>
          </div>
          <Link 
            to="/our-houses"
            className="group mt-6 md:mt-0 inline-flex items-center gap-2 text-[#7c9a6d] font-medium hover:gap-3 transition-all duration-300"
          >
            {language === 'en' ? 'See all houses' : 'Voir toutes les maisons'}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Houses grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {houses.map((house, index) => (
            <Link 
              key={index}
              to={`/${house.id}`}
              className="group block"
            >
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 shadow-[0_10px40px_rgba(124,154,109,0.1)]">
                <img
                  src={house.image}
                  alt={house.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#3d4a38]/50 via-transparent to-transparent" />
                
                {/* House emoji badge */}
                <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-2xl shadow-lg">
                  {house.emoji}
                </div>
                
                {/* Hover content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-flex items-center gap-2 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {language === 'en' ? 'Discover' : 'Découvrir'}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
              
              {/* Info */}
              <div>
                <h3 className="text-xl font-medium text-[#3d4a38] mb-2 group-hover:text-[#7c9a6d] transition-colors duration-300">
                  {house.name}
                </h3>
                <p className="text-[#7c8a72] text-sm mb-3">{house.description}</p>
                <div className="flex items-center gap-4 text-sm text-[#7c8a72]">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {house.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    {house.residents}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
