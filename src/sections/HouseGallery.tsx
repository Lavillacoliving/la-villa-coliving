import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Grid3X3, Maximize2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface HouseGalleryProps {
  images: {
    src: string;
    alt: string;
    category: 'exterior' | 'interior' | 'common' | 'room' | 'amenity';
  }[];
  houseName: string;
}

const categoryLabels: Record<'en' | 'fr', Record<string, string>> = {
  en: {
    exterior: 'Exterior',
    interior: 'Interior',
    common: 'Common Areas',
    room: 'Rooms',
    amenity: 'Amenities',
  },
  fr: {
    exterior: 'Extérieur',
    interior: 'Intérieur',
    common: 'Espaces Communs',
    room: 'Chambres',
    amenity: 'Équipements',
  },
};

export function HouseGallery({ images, houseName }: HouseGalleryProps) {
  const { language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredImages = activeFilter
    ? images.filter((img) => img.category === activeFilter)
    : images;

  const categories = [...new Set(images.map((img) => img.category))];

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const goToPrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? filteredImages.length - 1 : selectedImage - 1);
    }
  };

  const goToNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === filteredImages.length - 1 ? 0 : selectedImage + 1);
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-[#10b981]/5 blob rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-[#f97316]/5 blob-reverse rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 text-[#f97316] text-sm font-extrabold uppercase tracking-wider mb-4">
            <span className="w-8 h-1.5 bg-[#f97316] rounded-full" />
            {language === 'en' ? 'Photo Gallery' : 'Galerie Photos'}
            <span className="w-8 h-1.5 bg-[#f97316] rounded-full" />
          </span>
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0f172a] mb-4"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {language === 'en' ? `Explore ${houseName}` : `Découvrez ${houseName}`}
          </h2>
          <p className="text-lg text-gray-600">
            {language === 'en' 
              ? 'Take a virtual tour through our spaces' 
              : 'Faites une visite virtuelle de nos espaces'}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => setActiveFilter(null)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all ${
              activeFilter === null
                ? 'bg-[#10b981] text-white shadow-lg shadow-[#10b981]/25'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
            {language === 'en' ? 'All' : 'Tout'}
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-2.5 rounded-full font-bold transition-all ${
                activeFilter === category
                  ? 'bg-[#10b981] text-white shadow-lg shadow-[#10b981]/25'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {categoryLabels[language][category]}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => (
            <div
              key={index}
              onClick={() => openLightbox(index)}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all duration-500"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Category Badge */}
              <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-[#0f172a] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {categoryLabels[language][image.category]}
              </div>
              
              {/* Expand Icon */}
              <div className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Maximize2 className="w-5 h-5 text-[#0f172a]" />
              </div>
            </div>
          ))}
        </div>

        {/* Image Count */}
        <p className="text-center text-gray-500 mt-8">
          {filteredImages.length} {language === 'en' ? 'photos' : 'photos'}
          {activeFilter && ` · ${categoryLabels[language][activeFilter]}`}
        </p>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Navigation */}
          <button
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>

          {/* Image */}
          <div 
            className="max-w-6xl max-h-[85vh] px-20"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredImages[selectedImage].src}
              alt={filteredImages[selectedImage].alt}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            
            {/* Caption */}
            <div className="text-center mt-4">
              <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/80">
                {categoryLabels[language][filteredImages[selectedImage].category]} · {selectedImage + 1} / {filteredImages.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
