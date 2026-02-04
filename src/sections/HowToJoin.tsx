import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Home, Rocket } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function HowToJoin() {
  const { t } = useLanguage();

  const steps = [
    { ...t.howToJoin.step1, path: '/the-coliving', icon: Compass, color: '#10b981', bgColor: '#d1fae5' },
    { ...t.howToJoin.step2, path: '/our-houses', icon: Home, color: '#f97316', bgColor: '#ffedd5' },
    { ...t.howToJoin.step3, path: '/join-us', icon: Rocket, color: '#f43f5e', bgColor: '#ffe4e6' },
  ];

  return (
    <section className="section-padding relative overflow-hidden bg-[#f8fafc]">
      {/* Pop Background */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-[#10b981]/10 blob hidden lg:block" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-[#f43f5e]/10 blob-reverse hidden lg:block" />
      
      <div className="container-custom relative">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-[#f43f5e] text-sm font-extrabold uppercase tracking-wider mb-4">
            <span className="w-8 h-1.5 bg-[#f43f5e] rounded-full" />
            Get Started
            <span className="w-8 h-1.5 bg-[#f43f5e] rounded-full" />
          </span>
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl text-[#0f172a]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {t.howToJoin.title}
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-20 left-[60%] w-[80%] h-1 bg-gradient-to-r from-[#e2e8f0] to-transparent rounded-full" />
                )}

                <div 
                  className="card-ultra h-full group"
                  style={{ borderColor: `${step.color}30` }}
                >
                  {/* Step Number */}
                  <span 
                    className="text-8xl font-black mb-4 block opacity-10"
                    style={{ 
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      color: step.color 
                    }}
                  >
                    {step.number}
                  </span>

                  {/* Icon */}
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                    style={{ background: step.bgColor }}
                  >
                    <Icon size={28} style={{ color: step.color }} />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-black mb-4 text-[#0f172a]">{step.title}</h3>
                  <p className="text-[#64748b] mb-6 leading-relaxed font-medium">{step.description}</p>

                  {/* CTA */}
                  <Link
                    to={step.path}
                    className="inline-flex items-center gap-2 font-extrabold transition-all group-hover:gap-3"
                    style={{ color: step.color }}
                  >
                    {step.cta}
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
