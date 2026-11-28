/**
 * Accueil — bande « Ce qui ne se vit qu'ici » puis rangée de vie (brief « Accueil : récit, avis, photos » du 27/11/2026,
 * lot 2a, §0.2, §0.3 B, D4, D20, V13, V14 ; version B, §0.9). Photo n° 8 en pleine largeur, carte blanche qui la chevauche,
 * puis six vignettes légendées (vraies photos des maisons et de leur vie). Pas de carrousel : tout est visible sans
 * interaction. Aucun concurrent nommé, aucun bouton. Une phrase = un nœud texte.
 */
import { useLanguage } from "@/contexts/LanguageContext";
import { responsiveImage } from "@/lib/responsiveImage";
import { HOME_PHOTOS, LIFE_ROW } from "@/data/homePhotos";

export function HomeLifeBand() {
  const { language } = useLanguage();
  const en = language === "en";
  const L = en ? "en" : "fr";
  const band = HOME_PHOTOS.band;
  return (
    <section className="bg-lvc-page py-10 md:py-[72px]" aria-labelledby="home-life-title">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <div className="overflow-hidden rounded-[20px] md:rounded-[28px]">
          <img
            src={band.src}
            {...responsiveImage(band.src, "(min-width: 1280px) 1216px, calc(100vw - 40px)")}
            alt={band.alt[L]}
            width={band.width}
            height={band.height}
            loading="lazy"
            decoding="async"
            className="h-[210px] w-full object-cover md:h-[440px]"
          />
        </div>
        <div
          data-reveal
          className="relative mx-3 -mt-10 max-w-[600px] rounded-[20px] bg-white p-5 shadow-[0_24px_60px_rgba(28,25,23,0.10)] md:mx-0 md:ml-12 md:-mt-[130px] md:rounded-[26px] md:p-9"
        >
          <h2 id="home-life-title" className="lvc-display text-[30px] leading-[1.12] text-lvc-ink md:text-[42px] md:leading-[1.1]">
            {en ? "What you only get here" : "Ce qui ne se vit qu'ici"}
          </h2>
          <p className="mt-3 text-base leading-[1.65] text-lvc-text md:mt-4 md:text-lg">
            {en
              ? "A tartiflette for the whole house on a winter evening. Dinner by the pool as the light fades. The living room dressed up for Halloween. The sauna when you get home."
              : "Une tartiflette pour toute la maison un soir d'hiver. Un dîner au bord de la piscine quand le jour tombe. Le salon décoré pour Halloween. Le sauna en rentrant."}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-lvc-muted">
            {en
              ? "To our knowledge, no other coliving house in Greater Geneva has a pool, a sauna and a gym on site (survey of November 2026)."
              : "À notre connaissance, aucune autre maison de coliving du Grand Genève ne réunit piscine, sauna et salle de sport (relevé de novembre 2026)."}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-4 md:mt-10 lg:grid-cols-3 lg:gap-x-7 lg:gap-y-6">
          {LIFE_ROW.map((p) => (
            <figure key={p.src} data-reveal className="m-0">
              <div className="lvc-zoom overflow-hidden rounded-[14px] md:rounded-[20px]">
                <img
                  src={p.src}
                  {...responsiveImage(p.src, "(min-width: 1280px) 387px, (min-width: 1024px) 30vw, calc(50vw - 26px)")}
                  alt={p.alt[L]}
                  width={p.width}
                  height={p.height}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[3/2] w-full object-cover"
                />
              </div>
              <figcaption className="mt-2 text-[13px] font-semibold leading-snug text-lvc-ink md:mt-2.5 md:text-[15px]">
                {p.caption?.[L]}
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-6 text-[13px] text-lvc-muted md:mt-8">{en ? "Photos taken in the houses." : "Photos prises dans les maisons."}</p>
      </div>
    </section>
  );
}
