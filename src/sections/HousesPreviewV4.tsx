import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, MapPin, Users } from 'lucide-react';

export function HousesPreviewV4() {
  const { language } = useLanguage();

  const houses = [
    {
      name: 'La Villa',
      location: 'Ville-la-Grand',
      description: language === 'en' 
        ? '400m² of designed living on a 2000m² estate bordering a nature reserve.'
        : '400m² de vie design sur un domaine de 2000m² bordant une réserve naturelle.',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
      capacity: '10',
      available: true,
    },
    {
      name: 'Le Loft',
      location: 'Ambilly',
      description: language === 'en'
        ? 'A charming townhouse with urban sophistication and indoor pool.'
        : 'Une maison de ville charmante avec sophistication urbaine et piscine intérieure.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      capacity: '7',
      available: true,
    },
    {
      name: 'Le Lodge',
      location: 'Annemasse',
      description: language === 'en'
        ? 'Our newest and largest home, opening January 2026.'
        : 'Notre maison la plus récente et la plus grande, ouverture janvier 2026.',
      image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80',
      capacity: '12',
      available: false,
      badge: language === 'en' ? 'Opening Jan 2026' : 'Ouverture Jan 2026',
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div>
            <span className="text-xs text-[#999] uppercase tracking-[0.3em] mb-4 block">
              {language === 'en' ? 'Our Homes' : 'Nos Maisons'}
            </span>
            <h2 
              className="text-4xl md:text-5xl font-light text-[#1a1a1a]"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              {language === 'en' ? 'Three Homes.' : 'Trois Maisons.'}
              <br />
              <span className="font-medium">{language === 'en' ? 'One Community.' : 'Une Communauté.'}</span>
            </h2>
          </div>
          <Link 
            to="/our-houses"
            className="mt-6 md:mt-0 inline-flex items-center gap-2 text-[#1a1a1a] font-medium hover:text-[#c44536] transition-colors"
          >
            {language === 'en' ? 'View all houses' : 'Voir toutes les maisons'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Houses Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {houses.map((house, index) => (
            <Link
              key={index}
              to={`/our-houses/${house.name.toLowerCase().replace(' ', '')}`}
              className="group block"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] mb-6 overflow-hidden bg-[#f5f5f5]">
                <img
                  src={house.image}
                  alt={house.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Badge */}
                {!house.available && house.badge && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-[#1a1a1a] text-white text-xs uppercase tracking-wider">
                    {house.badge}
                  </div>
                )}
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#1a1a1a]/0 group-hover:bg-[#1a1a1a]/10 transition-colors" />
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center gap-4 mb-3 text-sm text-[#666]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {house.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {house.capacity} {language === 'en' ? 'members' : 'membres'}
                  </span>
                </div>
                
                <h3 className="text-xl font-medium text-[#1a1a1a] mb-2 group-hover:text-[#c44536] transition-colors">
                  {house.name}
                </h3>
                <p className="text-[#666] text-sm leading-relaxed">
                  {house.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
