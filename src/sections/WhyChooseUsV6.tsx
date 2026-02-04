import { Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * VERSION 6: CHALEUR + PREMIUM + MODERNITÉ
 * Why Choose Us avec design chaud et premium
 */

export function WhyChooseUsV6() {
  const { language } = useLanguage();

  const features = [
    language === 'en' ? 'All-inclusive pricing' : 'Prix tout inclus',
    language === 'en' ? 'No hidden fees' : 'Pas de frais cachés',
    language === 'en' ? 'Community events' : 'Événements communautaires',
    language === 'en' ? 'High-speed WiFi' : 'WiFi haut débit',
    language === 'en' ? 'Weekly cleaning' : 'Ménage hebdomadaire',
    language === 'en' ? '24/7 support' : 'Support 24/7',
  ];

  return (
    <section className="py-24 bg-[#faf8f5] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#f5f0e8]/50 to-transparent" />
      
      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(61,54,50,0.12)]">
              <img
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80"
                alt="La Villa Coliving Interior"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-xl shadow-[0_10px_40px_rgba(61,54,50,0.1)]">
              <div className="text-4xl font-medium text-[#c4705a] mb-1">30</div>
              <div className="text-sm text-[#8a817a]">{language === 'en' ? 'min to Geneva' : 'min de Genève'}</div>
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <span className="inline-block px-4 py-2 bg-[#e8dfd1]/60 text-[#c4705a] text-xs uppercase tracking-[0.25em] font-medium rounded-full mb-6">
              {language === 'en' ? 'Why La Villa' : 'Pourquoi La Villa'}
            </span>
            
            <h2 className="text-4xl md:text-5xl font-light text-[#3d3632] mb-6 leading-tight">
              {language === 'en' ? 'Experience Coliving' : 'Vivez le Coliving'}
              <br />
              <span className="font-medium text-[#c4705a]">{language === 'en' ? 'Reimagined' : 'Réinventé'}</span>
            </h2>
            
            <p className="text-[#5a524d] text-lg leading-relaxed mb-10 max-w-lg">
              {language === 'en' 
                ? 'We believe coliving should be effortless. Beautiful spaces, curated community, and everything taken care of so you can focus on what matters.'
                : 'Nous croyons que le coliving devrait être sans effort. Des espaces magnifiques, une communauté sélectionnée, et tout est pris en charge pour que vous puissiez vous concentrer sur l\'essentiel.'}
            </p>

            {/* Features grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-4 rounded-xl bg-white border border-[#e8dfd1]/50 hover:border-[#c4705a]/30 hover:shadow-sm transition-all duration-300"
                >
                  <div className="w-6 h-6 rounded-full bg-[#c4705a]/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#c4705a]" />
                  </div>
                  <span className="text-sm text-[#5a524d]">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
