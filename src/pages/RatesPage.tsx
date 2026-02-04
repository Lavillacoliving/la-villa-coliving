import { Link } from 'react-router-dom';
import { Check, ArrowRight, Home, Calculator } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export function RatesPage() {
  const { t } = useLanguage();

  const included = t.ratesPage.included.items;

  return (
    <main className="relative">
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-white">
        {/* Pop Colorful Background */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#10b981]/12 blob hidden lg:block" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#f97316]/10 blob-reverse hidden lg:block" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-[#f43f5e]/8 blob hidden lg:block" />
        
        <div className="container-custom relative text-center">
          <h1 
            className="text-5xl md:text-7xl lg:text-8xl mb-6 text-[#0f172a]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {t.ratesPage.hero.title}
          </h1>
          <p className="text-2xl text-[#10b981] font-extrabold mb-4">
            {t.ratesPage.hero.subtitle}
          </p>
          <p className="text-lg text-[#475569] mb-4 max-w-2xl mx-auto font-medium">
            {t.ratesPage.hero.description}
          </p>
          <p className="text-[#94a3b8] max-w-2xl mx-auto font-medium">
            {t.ratesPage.hero.description2}
          </p>
        </div>
      </section>

      {/* What's Included */}
      <section className="section-padding relative bg-[#f8fafc]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left - Title */}
            <div>
              <span className="inline-flex items-center gap-2 text-[#10b981] text-sm font-extrabold uppercase tracking-wider mb-4">
                <span className="w-8 h-1.5 bg-[#10b981] rounded-full" />
                All-Inclusive
              </span>
              <h2 
                className="text-4xl md:text-5xl lg:text-6xl mb-6 text-[#0f172a]"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                {t.ratesPage.included.title}
              </h2>
              <p className="text-lg text-[#475569] leading-relaxed mb-8 font-medium">
                Everything you need for comfortable, connected living—covered by one simple monthly payment.
              </p>
              
              {/* Deposit & Fees */}
              <div className="space-y-4 p-6 card-ultra">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#d1fae5] flex items-center justify-center">
                    <Check className="text-[#10b981]" size={20} />
                  </div>
                  <span className="text-[#0f172a] font-bold">{t.ratesPage.deposit}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ffedd5] flex items-center justify-center">
                    <Check className="text-[#f97316]" size={20} />
                  </div>
                  <span className="text-[#0f172a] font-bold">{t.ratesPage.noFees}</span>
                </div>
              </div>
            </div>

            {/* Right - List */}
            <div className="card-ultra p-8">
              <ul className="space-y-4">
                {included.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="text-[#10b981] mt-1 flex-shrink-0" size={20} />
                    <span className="text-[#475569] font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section-padding relative overflow-hidden bg-white">
        {/* Pop Background */}
        <div className="absolute top-20 left-0 w-80 h-80 bg-[#f97316]/10 blob hidden lg:block" />
        <div className="absolute bottom-20 right-0 w-64 h-64 bg-[#10b981]/10 blob-reverse hidden lg:block" />
        
        <div className="container-custom relative">
          <div className="text-center mb-16">
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl mb-4 text-[#0f172a]"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              Room <span className="text-[#10b981]">Rates</span>
            </h2>
            <p className="text-lg text-[#475569] font-medium">
              Same premium experience, consistent pricing across all houses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Private Bathroom */}
            <div className="card-ultra border-2 border-[#10b981]/40 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#10b981] to-[#059669] text-white px-5 py-1.5 rounded-full text-sm font-extrabold shadow-sharp">
                Most Popular
              </div>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-[#d1fae5] flex items-center justify-center mx-auto mb-4">
                  <Home size={32} className="text-[#10b981]" />
                </div>
                <h3 className="text-2xl font-black mb-2 text-[#0f172a]">Room with Private Bathroom</h3>
                <p className="text-[#64748b] font-medium">Your own sanctuary with en-suite facilities</p>
              </div>
              <div className="text-center mb-8">
                <span className="text-5xl font-black text-[#10b981]">1,380</span>
                <span className="text-[#64748b] font-bold"> CHF/month</span>
              </div>
              <Link to="/join-us">
                <Button className="w-full btn-primary py-5">
                  Apply Now
                  <ArrowRight size={20} className="ml-2" />
                </Button>
              </Link>
            </div>

            {/* Shared Bathroom */}
            <div className="card-ultra">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-[#ffedd5] flex items-center justify-center mx-auto mb-4">
                  <Calculator size={32} className="text-[#f97316]" />
                </div>
                <h3 className="text-2xl font-black mb-2 text-[#0f172a]">Room with Shared Bathroom</h3>
                <p className="text-[#64748b] font-medium">Comfortable private room with shared facilities</p>
              </div>
              <div className="text-center mb-8">
                <span className="text-5xl font-black text-[#f97316]">1,380</span>
                <span className="text-[#64748b] font-bold"> CHF/month</span>
              </div>
              <Link to="/join-us">
                <Button className="w-full btn-mango py-5">
                  Apply Now
                  <ArrowRight size={20} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
