import { useLanguage } from '@/contexts/LanguageContext';
import { 
  CheckCircle2, 
  Sparkles, 
  Wifi, 
  Waves, 
  Dumbbell, 
  Tv, 
  Scooter, 
  Package, 
  UtensilsCrossed, 
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function ServicesPage() {
  const { t, language } = useLanguage();

  const services = [
    { 
      key: 'allInclusive', 
      icon: CheckCircle2, 
      color: '#10b981', 
      bgColor: '#d1fae5',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80'
    },
    { 
      key: 'housekeeping', 
      icon: Sparkles, 
      color: '#f97316', 
      bgColor: '#ffedd5',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80'
    },
    { 
      key: 'internet', 
      icon: Wifi, 
      color: '#f43f5e', 
      bgColor: '#ffe4e6',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80'
    },
    { 
      key: 'pool', 
      icon: Waves, 
      color: '#10b981', 
      bgColor: '#d1fae5',
      image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&q=80'
    },
    { 
      key: 'wellness', 
      icon: Dumbbell, 
      color: '#f97316', 
      bgColor: '#ffedd5',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80'
    },
    { 
      key: 'entertainment', 
      icon: Tv, 
      color: '#f43f5e', 
      bgColor: '#ffe4e6',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80'
    },
    { 
      key: 'transport', 
      icon: Scooter, 
      color: '#10b981', 
      bgColor: '#d1fae5',
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80'
    },
    { 
      key: 'supplies', 
      icon: Package, 
      color: '#f97316', 
      bgColor: '#ffedd5',
      image: 'https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=600&q=80'
    },
    { 
      key: 'community', 
      icon: UtensilsCrossed, 
      color: '#f43f5e', 
      bgColor: '#ffe4e6',
      image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&q=80'
    },
    { 
      key: 'support', 
      icon: MessageCircle, 
      color: '#10b981', 
      bgColor: '#d1fae5',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80'
    },
  ];

  const serviceData = t.servicesPage.services;

  return (
    <main className="relative">
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-white">
        {/* Pop Colorful Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-radial from-[#10b981]/12 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#f97316]/10 blob hidden lg:block" />
        <div className="absolute top-20 right-0 w-[300px] h-[300px] bg-[#f43f5e]/8 blob-reverse hidden lg:block" />
        
        <div className="container-custom relative text-center">
          <h1 
            className="text-5xl md:text-7xl lg:text-8xl mb-6 text-[#0f172a]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {t.servicesPage.hero.title}
          </h1>
          <p className="text-2xl text-[#10b981] font-extrabold mb-4">
            {t.servicesPage.hero.subtitle}
          </p>
          <p className="text-lg text-[#475569] max-w-2xl mx-auto font-medium">
            {t.servicesPage.hero.description}
          </p>
        </div>
      </section>

      {/* Services Grid with Images */}
      <section className="section-padding relative bg-[#f8fafc]">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              const data = serviceData[service.key as keyof typeof serviceData];
              return (
                <div
                  key={index}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sharp hover:shadow-sharp-lg transition-all duration-500 border border-gray-100"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={data.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    {/* Icon Badge */}
                    <div 
                      className="absolute bottom-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: service.bgColor }}
                    >
                      <Icon size={24} style={{ color: service.color }} />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-extrabold mb-3 text-[#0f172a]">{data.title}</h3>
                    <p className="text-[#64748b] leading-relaxed font-medium">
                      {data.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Services Highlight */}
      <section className="section-padding relative bg-white overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#10b981]/8 blob hidden lg:block" />
        
        <div className="container-custom relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-[#f97316] text-sm font-extrabold uppercase tracking-wider mb-4">
                <span className="w-8 h-1.5 bg-[#f97316] rounded-full" />
                {language === 'en' ? 'Premium Amenities' : 'Équipements Premium'}
              </span>
              <h2 
                className="text-4xl md:text-5xl lg:text-6xl mb-6 text-[#0f172a]"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                {language === 'en' 
                  ? 'Everything You Need to Live Well' 
                  : 'Tout ce dont vous avez besoin pour bien vivre'}
              </h2>
              <p className="text-lg text-[#475569] leading-relaxed font-medium mb-8">
                {language === 'en'
                  ? 'From heated pools to professional gyms, from high-speed fiber to weekly yoga classes—we\'ve thought of everything so you don\'t have to. Our amenities are designed to support your wellbeing, productivity, and social life.'
                  : 'Des piscines chauffées aux salles de sport professionnelles, de la fibre haut débit aux cours de yoga hebdomadaires—nous avons pensé à tout pour que vous n\'ayez pas à le faire. Nos équipements sont conçus pour soutenir votre bien-être, votre productivité et votre vie sociale.'}
              </p>
              
              <Link
                to="/houses"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#10b981] text-white font-bold rounded-full hover:bg-[#059669] transition-colors shadow-lg shadow-[#10b981]/25"
              >
                {language === 'en' ? 'Explore Our Houses' : 'Découvrir Nos Maisons'}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-sharp-lg">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
                  alt="Premium amenities"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#f97316]/15 blob hidden lg:block" />
              <div className="absolute -inset-4 border-2 border-[#10b981]/30 rounded-[3rem] -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 relative bg-[#f97316] overflow-hidden">
        {/* Pop Decorative Elements */}
        <div className="absolute top-5 left-10 w-20 h-20 bg-white/25 blob hidden lg:block" />
        <div className="absolute bottom-5 right-10 w-16 h-16 bg-[#10b981]/25 blob-reverse hidden lg:block" />
        
        <div className="container-custom text-center relative">
          <h2 
            className="text-3xl md:text-4xl mb-4 text-white font-black"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {language === 'en' 
              ? 'One Price. Everything Included.' 
              : 'Un Prix. Tout Inclus.'}
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto font-bold mb-8">
            {language === 'en'
              ? 'No hidden costs. No surprise bills. Just one simple monthly payment that covers everything you need to live comfortably and connect meaningfully.'
              : 'Pas de coûts cachés. Pas de factures surprises. Juste un paiement mensuel simple qui couvre tout ce dont vous avez besoin pour vivre confortablement et vous connecter de manière significative.'}
          </p>
          <Link
            to="/rates"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#f97316] font-bold rounded-full hover:bg-gray-100 transition-colors"
          >
            {language === 'en' ? 'View Our Rates' : 'Voir Nos Tarifs'}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
