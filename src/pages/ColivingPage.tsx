import { useLanguage } from '@/contexts/LanguageContext';
import { Users, Heart, Coffee, Wifi, Check, ArrowRight, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ColivingConcept } from '@/sections/ColivingConcept';
import { WhoIsItFor } from '@/sections/WhoIsItFor';

export function ColivingPage() {
  const { t } = useLanguage();

  const values = [
    {
      icon: Users,
      title: t.colivingPage.values.value1.title,
      description: t.colivingPage.values.value1.description,
      color: '#10b981',
      bgColor: '#d1fae5',
    },
    {
      icon: Zap,
      title: t.colivingPage.values.value2.title,
      description: t.colivingPage.values.value2.description,
      color: '#f97316',
      bgColor: '#ffedd5',
    },
    {
      icon: Heart,
      title: t.colivingPage.values.value3.title,
      description: t.colivingPage.values.value3.description,
      color: '#f43f5e',
      bgColor: '#ffe4e6',
    },
  ];

  const perks = [
    { icon: Coffee, label: 'Free Coffee', color: '#f43f5e' },
    { icon: Wifi, label: 'Gigabit Fiber', color: '#10b981' },
    { icon: Users, label: 'Community Events', color: '#f97316' },
    { icon: Heart, label: 'Curated Members', color: '#f43f5e' },
  ];

  const benefits = [
    t.colivingPage.benefits.benefit1,
    t.colivingPage.benefits.benefit2,
    t.colivingPage.benefits.benefit3,
    t.colivingPage.benefits.benefit4,
    t.colivingPage.benefits.benefit5,
    t.colivingPage.benefits.benefit6,
    t.colivingPage.benefits.benefit7,
    t.colivingPage.benefits.benefit8,
  ];

  const profiles = [
    t.colivingPage.whoIsItFor.profile1,
    t.colivingPage.whoIsItFor.profile2,
    t.colivingPage.whoIsItFor.profile3,
    t.colivingPage.whoIsItFor.profile4,
    t.colivingPage.whoIsItFor.profile5,
  ];

  return (
    <main className="relative">
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-white">
        {/* Pop Colorful Background */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#10b981]/12 blob hidden lg:block" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#f97316]/10 blob-reverse hidden lg:block" />
        
        <div className="container-custom relative">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 text-[#10b981] text-sm font-extrabold uppercase tracking-wider mb-6">
              <span className="w-8 h-1.5 bg-[#10b981] rounded-full" />
              {t.colivingPage.hero.subtitle}
            </span>
            <h1 
              className="text-5xl md:text-7xl lg:text-8xl mb-8 text-[#0f172a]"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              {t.colivingPage.hero.title}
            </h1>
            
            {/* Perks */}
            <div className="flex flex-wrap gap-3">
              {perks.map((perk, index) => {
                const Icon = perk.icon;
                return (
                  <div 
                    key={index}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white shadow-sharp border-2 border-[#e2e8f0] hover:border-[#10b981]/40 hover:shadow-colored transition-all duration-300"
                  >
                    <Icon size={18} style={{ color: perk.color }} />
                    <span className="text-sm font-extrabold text-[#0f172a]">{perk.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* What is Coliving */}
      <section className="section-padding relative bg-[#f8fafc]">
        {/* Pop Background */}
        <div className="absolute top-20 left-0 w-80 h-80 bg-[#f97316]/10 blob hidden lg:block" />
        
        <div className="container-custom relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-[#10b981] text-sm font-extrabold uppercase tracking-wider mb-4">
                <span className="w-8 h-1.5 bg-[#10b981] rounded-full" />
                The Concept
              </span>
              <h2 
                className="text-4xl md:text-5xl lg:text-6xl mb-6 text-[#0f172a]"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                {t.colivingPage.whatIs.title}
              </h2>
              <p className="text-lg text-[#475569] leading-relaxed font-medium mb-4">
                {t.colivingPage.whatIs.description}
              </p>
              <p className="text-lg text-[#475569] leading-relaxed font-medium">
                {t.colivingPage.whatIs.description2}
              </p>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-sharp-lg">
                <img
                  src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80"
                  alt="Coliving community"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#10b981]/15 blob hidden lg:block" />
              <div className="absolute -inset-4 border-2 border-[#f97316]/30 rounded-[3rem] -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Coliving vs Colocation */}
      <section className="section-padding relative bg-white overflow-hidden">
        {/* Pop Background */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#f43f5e]/8 blob hidden lg:block" />
        
        <div className="container-custom relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-sharp-lg">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
                  alt="Modern living space"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#f43f5e]/15 blob hidden lg:block" />
              <div className="absolute -inset-4 border-2 border-[#10b981]/30 rounded-[3rem] -z-10" />
            </div>
            <div className="order-1 lg:order-2">
              <span className="inline-flex items-center gap-2 text-[#f43f5e] text-sm font-extrabold uppercase tracking-wider mb-4">
                <span className="w-8 h-1.5 bg-[#f43f5e] rounded-full" />
                Understanding the Difference
              </span>
              <h2 
                className="text-4xl md:text-5xl lg:text-6xl mb-6 text-[#0f172a]"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                {t.colivingPage.notColocation.title}
              </h2>
              <p className="text-lg text-[#475569] leading-relaxed font-medium mb-4">
                {t.colivingPage.notColocation.description}
              </p>
              <p className="text-lg text-[#475569] leading-relaxed font-medium">
                {t.colivingPage.notColocation.description2}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* La Villa Difference */}
      <section className="section-padding relative overflow-hidden bg-[#f8fafc]">
        {/* Pop Background */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#84cc16]/8 blob hidden lg:block" />
        
        <div className="container-custom relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 text-[#84cc16] text-sm font-extrabold uppercase tracking-wider mb-4">
              <span className="w-8 h-1.5 bg-[#84cc16] rounded-full" />
              What Makes Us Different
              <span className="w-8 h-1.5 bg-[#84cc16] rounded-full" />
            </span>
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl mb-6 text-[#0f172a]"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              {t.colivingPage.difference.title}
            </h2>
            <p className="text-lg text-[#475569] leading-relaxed mb-4 font-medium">
              {t.colivingPage.difference.description}
            </p>
            <p className="text-xl text-[#10b981] font-extrabold">
              {t.colivingPage.difference.description2}
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="card-ultra text-center group"
                >
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform"
                    style={{ background: value.bgColor }}
                  >
                    <Icon size={32} style={{ color: value.color }} />
                  </div>
                  <h3 className="text-xl font-extrabold mb-3 text-[#0f172a]">{value.title}</h3>
                  <p className="text-[#64748b] font-medium">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding relative bg-white overflow-hidden">
        <div className="absolute top-20 right-0 w-80 h-80 bg-[#10b981]/8 blob hidden lg:block" />
        
        <div className="container-custom relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-[#f97316] text-sm font-extrabold uppercase tracking-wider mb-4">
                <span className="w-8 h-1.5 bg-[#f97316] rounded-full" />
                Why Choose Us
              </span>
              <h2 
                className="text-4xl md:text-5xl lg:text-6xl mb-8 text-[#0f172a]"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                {t.colivingPage.benefits.title}
              </h2>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#10b981]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-[#10b981]" />
                    </div>
                    <span className="text-[#475569] font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/houses"
                className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-[#10b981] text-white font-bold rounded-full hover:bg-[#059669] transition-colors shadow-lg shadow-[#10b981]/25"
              >
                Explore Our Houses
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-sharp-lg">
                <img
                  src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80"
                  alt="La Villa benefits"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#f97316]/15 blob hidden lg:block" />
            </div>
          </div>
        </div>
      </section>

      {/* Who Is It For */}
      <section className="section-padding relative bg-[#f8fafc] overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#f43f5e]/8 blob hidden lg:block" />
        
        <div className="container-custom relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-sharp-lg">
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
                  alt="Community members"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#84cc16]/15 blob hidden lg:block" />
            </div>
            
            <div className="order-1 lg:order-2">
              <span className="inline-flex items-center gap-2 text-[#84cc16] text-sm font-extrabold uppercase tracking-wider mb-4">
                <span className="w-8 h-1.5 bg-[#84cc16] rounded-full" />
                For You?
              </span>
              <h2 
                className="text-4xl md:text-5xl lg:text-6xl mb-6 text-[#0f172a]"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                {t.colivingPage.whoIsItFor.title}
              </h2>
              <p className="text-lg text-[#475569] leading-relaxed font-medium mb-8">
                {t.colivingPage.whoIsItFor.description}
              </p>
              
              <div className="space-y-4">
                {profiles.map((profile, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#10b981] to-[#84cc16] flex items-center justify-center flex-shrink-0">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[#0f172a] font-medium">{profile}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/join"
                className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-[#f43f5e] text-white font-bold rounded-full hover:bg-[#e11d48] transition-colors shadow-lg shadow-[#f43f5e]/25"
              >
                Apply Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Coliving Concept Section */}
      <ColivingConcept />

      {/* Who Is It For Section */}
      <WhoIsItFor />

      {/* Quote Banner */}
      <section className="relative py-24 bg-[#10b981] overflow-hidden">
        {/* Pop Decorative Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/15 blob hidden lg:block" />
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-[#f97316]/40 blob-reverse hidden lg:block" />
        
        <div className="container-custom relative text-center">
          <p className="text-2xl md:text-3xl font-bold max-w-3xl mx-auto leading-relaxed text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            "La Villa isn't just a place to live—it's a <span className="text-[#f97316] font-black">community</span> that becomes <span className="text-[#f97316] font-black">family</span>."
          </p>
        </div>
      </section>
    </main>
  );
}
