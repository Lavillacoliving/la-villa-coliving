import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * VERSION 6: CHALEUR + PREMIUM + MODERNITÉ
 * Houses preview avec design chaud et premium
 */

export function HousesPreviewV6() {
  const { language } = useLanguage();

  const houses = [
    {
      id: 'la-villa',
      name: 'La Villa',
      location: 'Divonne-les-Bains',
      residents: '6-8',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      description: language === 'en' 
        ? 'Our flagship house with garden and pool'
        : 'Notre maison phare avec jardin et piscine',
    },
    {
      id: 'le-loft',
      name: 'Le Loft',
      location: 'Gex',
      residents: '4-6',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      description: language === 'en'
        ? 'Modern loft in the heart of the city'
        : 'Loft moderne au cœur de la ville',
    },
    {
      id: 'le-lodge',
      name: 'Le Lodge',
      location: 'Ferney-Voltaire',
      residents: '5-7',
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      description: language === 'en'
        ? 'Cozy retreat near Geneva airport'
        : 'Refuge confortable près de l\'aéroport de Genève',
    },
  ];

  return (
    <section className="py-24 bg-[#faf8f5] relative overflow-hidden">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div>
            <span className="inline-block px-4 py-2 bg-[#e8dfd1]/60 text-[#c4705a] text-xs uppercase tracking-[0.25em] font-medium rounded-full mb-6">
              {language === 'en' ? 'Our Homes' : 'Nos Maisons'}
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-[#3d3632]">
              {language === 'en' ? 'Choose Your' : 'Choisissez Votre'}
              <span className="font-medium text-[#c4705a]"> {language === 'en' ? 'Space' : 'Espace'}</span>
            </h2>
          </div>
          <Link 
            to="/our-houses"
            className="group mt-6 md:mt-0 inline-flex items-center gap-2 text-[#c4705a] font-medium hover:gap-3 transition-all duration-300"
          >
            {language === 'en' ? 'View All Houses' : 'Voir Toutes les Maisons'}
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
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-6 shadow-[0_10px_40px_rgba(61,54,50,0.1)]">
                <img
                  src={house.image}
                  alt={house.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#3d3632]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Hover content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <span className="inline-flex items-center gap-2 text-white text-sm">
                    {language === 'en' ? 'Discover' : 'Découvrir'}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
              
              {/* Info */}
              <div>
                <h3 className="text-xl font-medium text-[#3d3632] mb-2 group-hover:text-[#c4705a] transition-colors duration-300">
                  {house.name}
                </h3>
                <p className="text-[#8a817a] text-sm mb-3">{house.description}</p>
                <div className="flex items-center gap-4 text-sm text-[#8a817a]">
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
