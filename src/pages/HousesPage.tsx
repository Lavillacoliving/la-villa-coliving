import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Users, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';

export function HousesPage() {
  const { t } = useLanguage();

  const houses = [
    {
      ...t.houses.laVilla,
      path: '/lavilla',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      ],
      available: true,
      badge: null as string | null,
      price: '1,380 CHF',
      badgeColor: '#10b981',
      specs: {
        size: '400 m²',
        plot: '2,000 m²',
        dpe: 'D',
      },
    },
    {
      ...t.houses.leLoft,
      path: '/leloft',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80',
        'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80',
      ],
      available: true,
      badge: null as string | null,
      price: '1,380 CHF',
      badgeColor: '#f97316',
      specs: {
        size: '300 m²',
        dpe: 'C',
      },
    },
    {
      ...t.houses.leLodge,
      path: '/lelodge',
      image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      ],
      available: false,
      badge: t.houses.leLodge.badge,
      price: '1,380 CHF',
      badgeColor: '#f43f5e',
      specs: {
        size: '500 m²',
        plot: '1,500 m²',
        dpe: 'B',
      },
    },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 bg-white overflow-hidden">
        {/* Pop Background */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#10b981]/10 blob hidden lg:block" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#f97316]/10 blob-reverse hidden lg:block" />
        
        <div className="container-custom relative">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 text-[#f97316] text-sm font-extrabold uppercase tracking-wider mb-4">
              <span className="w-8 h-1.5 bg-[#f97316] rounded-full" />
              Our Homes
            </span>
            <h1 
              className="text-5xl md:text-6xl lg:text-7xl mb-6 text-[#0f172a]"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              {t.houses.title}
            </h1>
            <p className="text-xl text-[#475569] font-medium">
              {t.houses.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Houses List */}
      <section className="section-padding bg-[#f8fafc]">
        <div className="container-custom">
          <div className="space-y-20">
            {houses.map((house, index) => (
              <div
                key={index}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Image */}
                <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <Link to={house.path} className="block relative aspect-[4/3] rounded-[2rem] overflow-hidden group shadow-sharp-lg">
                    <img
                      src={house.image}
                      alt={house.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      {house.badge && (
                        <Badge 
                          className="font-extrabold"
                          style={{ background: house.badgeColor, color: 'white' }}
                        >
                          {house.badge}
                        </Badge>
                      )}
                      {house.available && !house.badge && (
                        <Badge 
                          className="font-extrabold"
                          style={{ background: house.badgeColor, color: 'white' }}
                        >
                          Available
                        </Badge>
                      )}
                    </div>

                    {/* Price */}
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm opacity-80 font-medium">From</p>
                      <p className="text-3xl font-black">{house.price}</p>
                      <p className="text-sm opacity-80 font-medium">/month</p>
                    </div>
                  </Link>
                </div>

                {/* Content */}
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="flex items-center gap-2 text-[#10b981] mb-4">
                    <MapPin size={18} />
                    <span className="text-sm uppercase tracking-wider font-extrabold">{house.location}</span>
                  </div>
                  
                  <h2 
                    className="text-4xl md:text-5xl mb-6 text-[#0f172a]"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    {house.name}
                  </h2>
                  
                  <p className="text-lg text-[#475569] mb-6 leading-relaxed font-medium">
                    {house.description}
                  </p>

                  {/* Specs */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Users size={16} className="text-[#10b981]" />
                      <span className="text-[#0f172a]">{house.capacity}</span>
                    </div>
                    {house.specs.size && (
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Check size={16} className="text-[#f97316]" />
                        <span className="text-[#0f172a]">{house.specs.size}</span>
                      </div>
                    )}
                    {house.specs.plot && (
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Check size={16} className="text-[#f97316]" />
                        <span className="text-[#0f172a]">{house.specs.plot}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Check size={16} className="text-[#f97316]" />
                      <span className="text-[#0f172a]">DPE {house.specs.dpe}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <p className="text-sm text-[#64748b] mb-8 font-medium">
                    <span className="font-extrabold text-[#0f172a]">Features:</span> {house.features}
                  </p>

                  {/* CTA */}
                  <Link
                    to={house.path}
                    className="inline-flex items-center gap-2 btn-primary"
                  >
                    {t.houses.cta}
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
