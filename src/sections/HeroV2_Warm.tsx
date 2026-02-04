import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * VERSION 2: CHALEUREUSE & ACCUEILLANTE
 * Palette: Terracotta + Sable + Vert sauge + Blanc chaud
 * Style: Naturel, organique, convivial
 */

export function HeroV2_Warm() {
  const { language } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#faf7f2]">
      {/* Organic shapes */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#e8ddd4] rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#d4e4dc] rounded-full blur-3xl opacity-50 translate-y-1/3 -translate-x-1/4" />
      
      {/* Subtle pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 container-custom py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            {/* Warm badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-8">
              <MapPin className="w-4 h-4 text-[#c17f59]" />
              <span className="text-sm text-[#5a4a42]">
                {language === 'en' ? 'Grand Genève, France' : 'Grand Genève, France'}
              </span>
            </div>

            {/* Title */}
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#3d322b] mb-6 leading-[1.15]"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              {language === 'en' ? (
                <>
                  Your <span className="text-[#c17f59]">Home</span> Away
                  <br />
                  From Home
                </>
              ) : (
                <>
                  Votre <span className="text-[#c17f59]">Chez-Vous</span>
                  <br />
                  Loin de Chez Vous
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-[#7a6b62] mb-8 max-w-md leading-relaxed">
              {language === 'en' 
                ? 'Join a warm community of like-minded people. Fully furnished homes, all-inclusive living, just 30 minutes from Geneva.'
                : 'Rejoignez une communauté chaleureuse de personnes partageant les mêmes valeurs. Maisons entièrement meublées, vie tout inclusive, à 30 minutes de Genève.'}
            </p>

            {/* Feature tags */}
            <div className="flex flex-wrap gap-3 mb-10">
              {[
                language === 'en' ? 'All-inclusive' : 'Tout inclus',
                language === 'en' ? 'Curated Community' : 'Communauté Sélectionnée',
                language === 'en' ? 'No Agency Fees' : 'Sans Frais d\'Agence',
              ].map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-[#f5f0ea] text-[#5a4a42] text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link 
                to="/our-houses"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-[#6b9080] text-white font-medium rounded-full hover:bg-[#5a7d6e] transition-all duration-300 shadow-lg shadow-[#6b9080]/25"
              >
                {language === 'en' ? 'Explore Our Houses' : 'Explorer Nos Maisons'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                to="/join-us"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#c17f59] text-[#c17f59] font-medium rounded-full hover:bg-[#c17f59] hover:text-white transition-all duration-300"
              >
                {language === 'en' ? 'Apply Now' : 'Candidater'}
              </Link>
            </div>
          </div>

          {/* Right - Image collage */}
          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square">
              {/* Main image */}
              <div className="absolute top-0 right-0 w-[80%] h-[70%] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
                  alt="La Villa living"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Secondary image */}
              <div className="absolute bottom-0 left-0 w-[60%] h-[50%] rounded-3xl overflow-hidden shadow-xl border-4 border-[#faf7f2]">
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80"
                  alt="Community"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Decorative element */}
              <div className="absolute top-[20%] left-[10%] w-20 h-20 bg-[#c17f59]/20 rounded-full" />
              <div className="absolute bottom-[15%] right-[5%] w-16 h-16 bg-[#6b9080]/20 rounded-full" />
              
              {/* Stats card */}
              <div className="absolute bottom-[10%] right-[10%] bg-white rounded-2xl p-5 shadow-xl">
                <div className="text-3xl font-bold text-[#c17f59]">4.9</div>
                <div className="text-sm text-[#7a6b62]">{language === 'en' ? 'Member Rating' : 'Note des Membres'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
