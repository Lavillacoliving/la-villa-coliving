import { lazy, Suspense, useState } from 'react';
import { Grid3X3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { responsiveImage } from '@/lib/responsiveImage';
import { albumPicks } from '@/lib/gallery';
import type { LightboxPhoto } from '@/components/PhotoLightbox';

// Visionneuse plein écran partagée avec les photos de chambres (Radix, balayage tactile, clavier) : chargée à l'ouverture seulement.
const PhotoLightbox = lazy(() => import('@/components/PhotoLightbox'));

type GalleryCategory = 'exterior' | 'interior' | 'common' | 'room' | 'amenity';

interface HouseGalleryProps {
  images: {
    src: string;
    alt: string;
    category: GalleryCategory;
  }[];
  houseName: string;
  /** Photos à montrer en vignette, par `src` (celles du carrousel du hero) ; complétées automatiquement s'il en manque. */
  featured?: string[];
}

const categoryLabels: Record<'en' | 'fr', Record<GalleryCategory, string>> = {
  en: {
    exterior: 'Exterior',
    interior: 'Interior',
    common: 'Common areas',
    room: 'Rooms',
    amenity: 'Amenities',
  },
  fr: {
    exterior: 'Extérieur',
    interior: 'Intérieur',
    common: 'Espaces communs',
    room: 'Chambres',
    amenity: 'Équipements',
  },
};

/**
 * (Lot 2 « retenue premium », sous-lot A — cadrage A1, validé par Jérôme le 16/10/2026) Album COMPACT : 6 vignettes et un
 * bouton « Voir les N photos » qui ouvre la visionneuse plein écran sur tout l'album.
 *
 * Pourquoi : à 390 px, les 20 vignettes de l'ancien album (Lot A du 02/09) occupaient encore près de 3 écrans et
 * repoussaient la localisation et la FAQ ; la scrollmap Clarity montrait le décrochage à l'entrée de la galerie.
 * Aucune photo n'est retirée du dépôt ni de la visionneuse. État initial identique au prérendu (aucun état dérivé du
 * navigateur) : pas d'écart d'hydratation.
 */
const COMPACT_VISIBLE = 6;

export function HouseGallery({ images, houseName, featured = [] }: HouseGalleryProps) {
  const { language } = useLanguage();
  const L = language === 'en' ? 'en' : 'fr';
  const [viewer, setViewer] = useState<number | null>(null);

  if (images.length === 0) return null;

  const picks = albumPicks(images, featured, COMPACT_VISIBLE);
  const categories = [...new Set(images.map((img) => img.category))];
  // Légende de la visionneuse dans la langue de la page (les `alt` historiques de l'album sont en anglais).
  const photos: LightboxPhoto[] = images.map((img) => ({
    src: img.src,
    alt: {
      fr: `${houseName} — ${categoryLabels.fr[img.category]}`,
      en: `${houseName} — ${categoryLabels.en[img.category]}`,
    },
  }));

  const open = (index: number, source: 'tile' | 'button') => {
    setViewer(index);
    try {
      // Même nom d'événement que l'ancien « Voir plus de photos » : la série GA4 continue.
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.('event', 'gallery_expand', {
        house: houseName,
        mode: 'viewer',
        source,
        shown: picks.length,
        total: images.length,
        language,
      });
    } catch {
      /* noop — l'analytics ne bloque jamais l'UI */
    }
  };

  const categoryList = categories.map((c) => categoryLabels[L][c].toLowerCase()).join(', ');

  return (
    <section id="galerie" className="py-8 md:py-20 bg-white relative scroll-mt-24">
      <div className="container-custom">
        <h2
          className="text-3xl md:text-4xl mb-2 text-[#1C1917]"
          style={{ fontFamily: '"DM Serif Display", serif' }}
        >
          {L === 'en' ? `Explore ${houseName}` : `Découvre ${houseName}`}
        </h2>
        <p className="text-sm md:text-base text-[#57534E] mb-5 md:mb-8">
          {L === 'en'
            ? `${images.length} photos: ${categoryList}.`
            : `${images.length} photos\u00A0: ${categoryList}.`}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
          {picks.map((index) => {
            const image = images[index];
            return (
              <button
                type="button"
                key={index}
                onClick={() => open(index, 'tile')}
                aria-label={L === 'en'
                  ? `Open the photo: ${categoryLabels.en[image.category]}`
                  : `Agrandir la photo : ${categoryLabels.fr[image.category]}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-[#F5F2ED] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C1917]"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  {...responsiveImage(image.src, '(min-width: 768px) 33vw, 50vw')}
                />
              </button>
            );
          })}
        </div>

        <div className="mt-4 md:mt-8">
          <button
            type="button"
            onClick={() => open(0, 'button')}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-[#1C1917] text-[#1C1917] font-semibold rounded-xl hover:bg-[#1C1917] hover:text-white transition-colors"
          >
            <Grid3X3 className="w-4 h-4" aria-hidden="true" />
            {L === 'en' ? `See all ${images.length} photos` : `Voir les ${images.length} photos`}
          </button>
        </div>
      </div>

      {viewer !== null && (
        <Suspense fallback={null}>
          <PhotoLightbox
            photos={photos}
            index={viewer}
            onIndexChange={setViewer}
            onClose={() => setViewer(null)}
            en={L === 'en'}
            title={houseName}
          />
        </Suspense>
      )}
    </section>
  );
}
