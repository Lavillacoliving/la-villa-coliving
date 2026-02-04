import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';

export function HousesPreview() {
  const { t } = useLanguage();

  const houses = [
    {
      ...t.houses.laVilla,
      path: '/lavilla',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
      available: true,
      badge: null,
      badgeColor: '#10b981',
    },
    {
      ...t.houses.leLoft,
      path: '/leloft',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      available: true,
      badge: null,
      badgeColor: '#f97316',
    },
    {
      ...t.houses.leLodge,
      path: '/lelodge',
      image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80',
      available: false,
      badge: t.houses.leLodge.badge as string,
      badgeColor: '#f43f5e',
    },
  ];

  return (
    <section className="section-padding relative overflow-hidden bg-[#f8fafc]">
      {/* Pop Background */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-[#f97316]/10 blob hidden lg:block" />
      <div className="absolute bottom-10 left-0 w-[400px] h-[400px] bg-[#10b981]/10 blob-reverse hidden lg:block" />
      
      <div className="container-custom relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <span className="inline-flex items-center gap-2 text-[#f97316] text-sm font-extrabold uppercase tracking-wider mb-4">
              <span className="w-10 h-1.5 bg-[#f97316] rounded-full" />
              Our Homes
            </span>
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl text-[#0f172a]"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              {t.houses.title}
            </h2>
            <p className="text-xl text-[#64748b] mt-4 font-medium">{t.houses.subtitle}</p>
          </div>
          
          <Link
            to="/our-houses"
            className="btn-outline whitespace-nowrap"
          >
            {t.houses.viewAll}
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>

        {/* Houses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {houses.map((house, index) => (
            <Link
              key={index}
              to={house.path}
              className="group block rounded-3xl overflow-hidden bg-white shadow-sharp border-2 border-[#e2e8f0] hover:shadow-sharp-lg hover:border-[#10b981]/50 transition-all duration-500"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={house.image}
                  alt={house.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Badge */}
                {house.badge && (
                  <Badge 
                    className="absolute top-4 left-4 font-extrabold"
                    style={{ background: house.badgeColor, color: 'white' }}
                  >
                    {house.badge}
                  </Badge>
                )}
                {house.available && !house.badge && (
                  <Badge 
                    className="absolute top-4 left-4 font-extrabold"
                    style={{ background: house.badgeColor, color: 'white' }}
                  >
                    Available
                  </Badge>
                )}

                {/* House Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 
                    className="text-2xl font-black mb-1"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    {house.name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-white/95 font-bold">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {house.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {house.capacity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-[#64748b] mb-4 line-clamp-2">{house.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#94a3b8]">
                    <span className="text-[#10b981] font-extrabold">Perfect for:</span> {house.perfectFor}
                  </span>
                  <span className="flex items-center gap-1 text-[#10b981] font-extrabold group-hover:gap-2 transition-all">
                    {t.houses.cta}
                    <ArrowRight size={16} />
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
