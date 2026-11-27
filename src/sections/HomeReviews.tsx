/**
 * Accueil — section Avis « Ce qu'en disent ceux qui y ont vécu » (brief « Accueil : récit, avis, photos » du 27/11/2026,
 * lot 2a, §0.3 C, §0.4, V2, D5 ; version B, §0.9). Remplace la règle du 24/11/2026 « pas d'extraits d'avis » (V2 du 27/11).
 *
 * - Extraits exacts de la fiche Google (src/data/reviews.ts), prénom seul, contexte déclaré par l'auteur.
 * - Reprend la note Google de l'ancienne section `google_rating` (toujours « sur Google » + lien « Voir les avis », même
 *   événement `cta_click` / `google_rating`) et la ligne « 100+ résidents… » (texte inchangé).
 * - AUCUN balisage Review ni aggregateRating. La photo n° 9 illustre la section : elle n'est attribuée à aucun auteur.
 * - Une phrase = un nœud texte ; le lien est un élément à part (anti-#418).
 */
import { useLanguage } from "@/contexts/LanguageContext";
import { RatingStars } from "@/components/RatingStars";
import { responsiveImage } from "@/lib/responsiveImage";
import { GOOGLE_REVIEWS, GOOGLE_REVIEWS_LINK_LABEL, STATS, STATS_DISPLAY } from "@/data/stats";
import { REVIEWS_SHOWN, reviewText, type ReviewExcerpt } from "@/data/reviews";
import { HOME_PHOTOS } from "@/data/homePhotos";

function track(params: Record<string, unknown>): void {
  try {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "cta_click", params);
  } catch { /* noop */ }
}

const quote = (text: string, lang: "fr" | "en") => (lang === "fr" ? `«\u00a0${text}\u00a0»` : `“${text}”`);
const author = (r: ReviewExcerpt, lang: "fr" | "en") => (r.context[lang] ? `${r.firstName} · ${r.context[lang]}` : r.firstName);

export function HomeReviews() {
  const { language } = useLanguage();
  const L = language === "en" ? "en" : "fr";
  const en = L === "en";
  const [lead, ...rest] = REVIEWS_SHOWN[L];
  const leadText = reviewText(lead, L);
  const photo = HOME_PHOTOS.reviews;
  const translatedLabel = "Translated from French";

  return (
    <section className="bg-lvc-tint py-10 md:py-[72px]" aria-labelledby="home-reviews-title">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <span className="lvc-eyebrow">{en ? "THEY LIVED HERE" : "ILS Y ONT VÉCU"}</span>
        <h2 id="home-reviews-title" className="lvc-display mt-3 text-[30px] leading-[1.12] text-lvc-ink md:text-[42px] md:leading-[1.1]">
          {en ? "What people who lived here say" : "Ce qu'en disent ceux qui y ont vécu"}
        </h2>
        <div className="mt-6 grid gap-8 md:mt-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:items-start lg:gap-14">
          <div>
            <figure className="m-0">
              <blockquote className="m-0">
                <p className="lvc-display text-[24px] italic leading-[1.25] text-lvc-ink md:text-[36px] md:leading-[1.2]">
                  {quote(leadText.text, L)}
                </p>
              </blockquote>
              <figcaption className="mt-3 text-[15px] font-semibold text-lvc-accent">
                {author(lead, L)}
                {leadText.translated ? <span className="block text-[13px] font-normal text-lvc-muted">{translatedLabel}</span> : null}
              </figcaption>
            </figure>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {rest.map((r) => {
                const t = reviewText(r, L);
                return (
                  <figure key={r.order} data-reveal className="m-0 flex flex-col justify-between rounded-[20px] bg-white p-5">
                    <blockquote className="m-0">
                      <p className="text-base leading-relaxed text-lvc-ink">{quote(t.text, L)}</p>
                    </blockquote>
                    <figcaption className="mt-4 text-sm font-semibold text-lvc-accent">
                      {author(r, L)}
                      {t.translated ? <span className="block text-[13px] font-normal text-lvc-muted">{translatedLabel}</span> : null}
                    </figcaption>
                  </figure>
                );
              })}
            </div>
            {/* Note Google : même phrase et même lien que le haut de page (garde check:facts : « 4,9/5 » suivi de la date). */}
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1">
              <RatingStars lang={L} className="w-4 h-4 text-[#D4A574]" emptyClassName="text-[#C9D6CB]" />
              <span className="text-sm text-lvc-ink">{STATS_DISPLAY[L].googleRating}</span>
              <a
                href={GOOGLE_REVIEWS.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track({ cta_position: "google_rating", cta_target: "google_reviews", language: L })}
                className="text-sm text-lvc-ink underline underline-offset-4 hover:text-lvc-accent transition-colors"
              >
                {GOOGLE_REVIEWS_LINK_LABEL[L]}
              </a>
            </div>
            <p className="mt-2 text-sm text-lvc-muted">
              {L === "en"
                ? `${STATS_DISPLAY.en.residents} · ${STATS.averageStayMonths}-month average stay`
                : `${STATS_DISPLAY.fr.residents} · ${STATS.averageStayMonths} mois de séjour en moyenne`}
            </p>
            <p className="mt-1 text-[13px] text-lvc-muted">
              {en ? "Reviews posted on Google, read on 27 November 2026." : "Avis publiés sur Google, relevés le 27 novembre 2026."}
            </p>
          </div>
          <div className="mx-auto w-full max-w-[460px] overflow-hidden rounded-[20px] md:rounded-[28px]">
            <img
              src={photo.src}
              {...responsiveImage(photo.src, "(min-width: 1024px) 460px, calc(100vw - 40px)")}
              alt={photo.alt[L]}
              width={photo.width}
              height={photo.height}
              loading="lazy"
              decoding="async"
              className="aspect-square w-full object-cover"
              style={{ objectPosition: "55% 62%" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
