import { Link } from "react-router-dom";
import { ArrowRight, Bath, Calendar, Check, Maximize2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { responsiveImage } from "@/lib/responsiveImage";
import {
  HERO_ALT,
  HERO_H,
  HERO_IMAGE,
  HERO_W,
  PRICE_FROM_CHF,
  ROOMS_SEPTEMBRE,
  formatAvailability,
  formatChf,
} from "@/data/roomsSeptembre";

/**
 * LP payante /chambres-septembre · /en/rooms-september (brief LOT 2, 24/08/2026).
 *
 * Contexte : ~70 clics payants, 21 sessions engagées, `form_start` payant = 0 —
 * les visiteurs lisent le premier écran de la home générique et repartent. Cette
 * page doit vendre dans les DEUX premiers écrans et offrir une prise concrète.
 *
 * Ordre des sections ARBITRÉ par Jérôme, à ne pas réordonner :
 * « la maison vend le rêve, la chambre signe le bail » → les équipements (le
 * différenciateur réel) passent AVANT les chambres (la preuve datée).
 *
 * noindex + hors sitemap + aucun lien interne entrant : page d'acquisition payante,
 * pas un actif SEO. La route est déclarée dans NOINDEX_PRERENDERED_ROUTES
 * (scripts/prerender.mjs) : prérendue et rewritée, jamais indexée ni listée.
 *
 * Tout le contenu chiffré vient de src/data/roomsSeptembre.ts — le titre dérive du
 * NOMBRE RÉEL de chambres, il ne peut pas annoncer autre chose que ce qui est affiché.
 */
/**
 * Cadre d'une photo : son ratio RÉEL, borné à [0,75 ; 1,5].
 * Les photos des deux chambres ont des orientations opposées (Lodge en paysage
 * 3:2, La Villa en portrait). Un cadre fixe unique amputait les portraits de plus
 * de 40 % de leur hauteur — « ça les zoome beaucoup trop » (Jérôme, 24/08).
 * Avec ces bornes : aucune photo du Lodge n'est recadrée, et seul le balcon de la
 * 8 (0,56, très allongé) perd de la hauteur, ce qui reste inévitable en carte.
 */
function frameRatio(w: number, h: number): number {
  return Math.min(1.5, Math.max(0.75, w / h));
}

export function ChambresSeptembrePage() {
  const { language } = useLanguage();
  const en = language === "en";
  const prefix = en ? "/en" : "";
  const count = ROOMS_SEPTEMBRE.length;

  const heroTitle = en
    ? count === 1
      ? "Only one room left for September"
      : `Only ${count} rooms left for September`
    : count === 1
      ? "Il ne reste qu'une chambre pour septembre"
      : `Il ne reste que ${count} chambres pour septembre`;

  const ctaLabel = en
    ? count === 1
      ? "See the room"
      : `See the ${count} rooms`
    : count === 1
      ? "Voir la chambre"
      : `Voir les ${count} chambres`;

  // « dès » obligatoire (CLAUDE.md) : le prix affiché est un point d'entrée, pas un prix unique.
  const heroSubtitle = en
    ? `Your room in a house with a pool, sauna and gym — from CHF ${formatChf(PRICE_FROM_CHF)}/month all-inclusive, 15 minutes from Geneva.`
    : `Ta chambre dans une maison avec piscine, sauna et salle de sport — dès ${formatChf(PRICE_FROM_CHF)} CHF/mois tout inclus, à 15 min de Genève.`;

  const amenities = en
    ? [
        "Pool",
        "Sauna",
        "Gym",
        "Large gardens and terraces",
        "Community events",
        "Shared areas cleaned three times a week",
        "100% all-inclusive, down to the supplies",
      ]
    : [
        "Piscine",
        "Sauna",
        "Salle de sport",
        "Grands jardins et terrasses",
        "Événements communautaires",
        "Ménage des communs 3 fois par semaine",
        "100 % tout inclus, même les fournitures",
      ];

  const reassurance = en
    ? [
        "No agency fee, no application fee",
        "Answer within 48 hours",
        "Video tour available",
        "100+ residents since 2021",
      ]
    : [
        "0 frais d'agence ni de dossier",
        "Réponse sous 48 h",
        "Visite en visio possible",
        "100+ résidents depuis 2021",
      ];

  return (
    <main className="bg-white">
      <SEO
        noindex
        title={en ? `Only ${count} rooms left for September` : `Il ne reste que ${count} chambres pour septembre`}
        description={
          en
            ? `${count} rooms available this September near Geneva. Pool, sauna, gym. From CHF ${formatChf(PRICE_FROM_CHF)}/month all-inclusive, no agency or application fee.`
            : `${count} chambres se libèrent en septembre près de Genève. Piscine, sauna, salle de sport. Dès ${formatChf(PRICE_FROM_CHF)} CHF/mois tout inclus, 0 frais de dossier.`
        }
      />

      {/* ── Écran 1 — HERO : le rêve + la rareté ───────────────────────────────
          Contrainte du brief : H1 + prix + CTA visibles SANS scroll sur mobile.
          D'où min-h-[100svh] (et non 100vh : la barre d'URL mobile rognerait le CTA)
          plafonné à 720 px en hauteur pour ne pas étirer inutilement le desktop. */}
      <section className="relative flex min-h-[100svh] max-h-[860px] items-end overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt={en ? HERO_ALT.en : HERO_ALT.fr}
          {...responsiveImage(HERO_IMAGE, "100vw")}
          width={HERO_W}
          height={HERO_H}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Dégradé plutôt qu'un voile uniforme : garde la piscine lisible en haut
            et garantit le contraste AA du texte en bas. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/25" />

        <div className="container-custom relative z-10 pb-12 pt-28 md:pb-20">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#b8860b] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white">
            {en ? "September availability" : "Disponible en septembre"}
          </span>
          <h1
            className="max-w-3xl text-4xl leading-tight text-white sm:text-5xl md:text-6xl"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {heroTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/90 sm:text-lg">{heroSubtitle}</p>
          <a
            href="#chambres"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 text-base font-semibold text-[#1C1917] shadow-lg transition-transform hover:scale-[1.02]"
          >
            {ctaLabel}
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>

      {/* ── Écran 2 — ÉQUIPEMENTS : le différenciateur, AVANT les chambres ──── */}
      <section className="border-b border-[#E7E5E4] bg-[#FAFAF9] py-14 md:py-20">
        <div className="container-custom">
          <p
            className="mb-8 text-center text-2xl text-[#1C1917] md:text-3xl"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {en
              ? "Three homes designed for living well, not just sleeping."
              : "Trois maisons pensées pour vivre bien, pas juste pour dormir."}
          </p>
          <ul className="mx-auto grid max-w-4xl grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3">
            {amenities.map((item) => (
              <li key={item} className="flex items-center gap-3 text-[#44403C]">
                <Check className="h-5 w-5 shrink-0 text-[#b8860b]" />
                <span className="text-sm md:text-base">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Écran 3 — LES CARTES CHAMBRES : la preuve datée ─────────────────── */}
      <section id="chambres" className="py-16 md:py-24">
        <div className="container-custom">
          <h2
            className="mb-3 text-center text-3xl text-[#1C1917] md:text-4xl"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {en
              ? count === 1
                ? "The room available"
                : `The ${count} rooms available`
              : count === 1
                ? "La chambre disponible"
                : `Les ${count} chambres disponibles`}
          </h2>
          <p className="mb-12 text-center text-[#57534E]">
            {en
              ? "Everything included, no hidden fees. Pick yours and apply in two minutes."
              : "Tout est inclus, sans frais cachés. Choisis la tienne et candidate en deux minutes."}
          </p>

          <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2">
            {ROOMS_SEPTEMBRE.map((room, roomIndex) => (
              <article
                key={room.id}
                className="overflow-hidden rounded-2xl border border-[#E7E5E4] bg-white shadow-sm"
              >
                {/* Photo 1 = l'atout de SA maison (décision produit du brief).
                    Bande de vignettes en dessous : les 2 photos de la chambre. */}
                <div className="relative">
                  <img
                    src={room.photos[0].src}
                    alt={en ? room.photos[0].alt.en : room.photos[0].alt.fr}
                    {...responsiveImage(room.photos[0].src, "(min-width: 768px) 46vw, 100vw")}
                    width={room.photos[0].w}
                    height={room.photos[0].h}
                    loading={roomIndex === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="w-full object-cover"
                    style={{ aspectRatio: String(frameRatio(room.photos[0].w, room.photos[0].h)) }}
                  />
                  <span className="absolute left-4 top-4 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#1C1917] backdrop-blur-sm">
                    {room.houseName}
                  </span>
                </div>
                {/* Largeur PROPORTIONNELLE au ratio (flex-grow = ratio) + aspect-ratio
                    identique : les hauteurs s'égalisent d'elles-mêmes, la ligne se
                    remplit entièrement, et AUCUNE photo n'est recadrée — y compris
                    un paysage 3:2 à côté d'un portrait 3:4. Une hauteur fixe, elle,
                    laissait la chambre 8 (portraits) chétive et le Lodge en débord. */}
                <div className="flex gap-2 bg-white p-2">
                  {room.photos.slice(1).map((photo) => (
                    <img
                      key={photo.src}
                      src={photo.src}
                      alt={en ? photo.alt.en : photo.alt.fr}
                      {...responsiveImage(photo.src, "(min-width: 768px) 23vw, 45vw")}
                      width={photo.w}
                      height={photo.h}
                      loading="lazy"
                      decoding="async"
                      // `min-w-0` et PAS de `w-full` : une largeur 100 % entrerait en
                      // conflit avec la base flex et ferait déborder la ligne.
                      className="min-w-0 rounded-md object-cover"
                      style={{ flex: `${photo.w / photo.h} 1 0%`, aspectRatio: String(photo.w / photo.h) }}
                    />
                  ))}
                </div>

                <div className="p-6">
                  <h3
                    className="text-xl text-[#1C1917]"
                    style={{ fontFamily: "DM Serif Display, serif" }}
                  >
                    {en ? room.landmark.en : room.landmark.fr}
                  </h3>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#57534E]">
                    <span className="inline-flex items-center gap-1.5">
                      <Maximize2 className="h-4 w-4 text-[#78716C]" />
                      {room.surfaceM2} m²
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Bath className="h-4 w-4 text-[#78716C]" />
                      {room.privateBathroom
                        ? en
                          ? "Private shower room"
                          : "Salle d'eau privative"
                        : en
                          ? "Shared shower room"
                          : "Salle d'eau partagée"}
                    </span>
                  </div>

                  <p className="mt-4 text-[#44403C]">{en ? room.pitch.en : room.pitch.fr}</p>

                  <div className="mt-5 border-t border-[#E7E5E4] pt-5">
                    <p className="text-2xl font-semibold text-[#1C1917]">
                      {en
                        ? `CHF ${formatChf(room.priceChf)}/month`
                        : `${formatChf(room.priceChf)} CHF/mois`}
                      <span className="ml-2 text-sm font-normal text-[#57534E]">
                        {en ? "all-inclusive" : "tout inclus"}
                      </span>
                    </p>
                    <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-[#b8860b]">
                      <Calendar className="h-4 w-4" />
                      {en
                        ? `Available from ${formatAvailability(room.availableFrom, true)}`
                        : `Disponible dès le ${formatAvailability(room.availableFrom, false)}`}
                    </p>
                  </div>

                  {/* Pré-remplissage de la candidature (Edge v14 → colonnes dédiées).
                      AUCUN utm_* ici : sur un lien INTERNE, ils redémarreraient
                      l'attribution de session GA4. L'attribution Ads est déjà
                      capturée à l'atterrissage (src/lib/attribution.ts). */}
                  <Link
                    to={`${prefix}/candidature?property_interest=${room.property}&room_interest=${room.id}`}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1C1917] px-6 py-4 text-base font-semibold text-white transition-transform hover:scale-[1.02]"
                  >
                    {en ? "Apply for this room" : "Candidater pour cette chambre"}
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Lien maisons — demandé par Jérôme le 24/08. Placé APRÈS les cartes et
              en secondaire assumé : dans le hero ou le header, il offrirait une
              sortie de tunnel à quelqu'un qui n'a pas encore vu les chambres. Ici,
              il ne capte que le visiteur déjà convaincu qui veut en voir plus. */}
          <p className="mt-12 text-center text-sm text-[#57534E]">
            {en ? "Want to see the houses themselves? " : "Envie de voir les maisons en entier ? "}
            <Link
              to={`${prefix}/nos-maisons`}
              className="font-medium text-[#b8860b] underline underline-offset-4 hover:text-[#1C1917] transition-colors"
            >
              {en ? "Discover our 3 homes" : "Découvrir nos 3 maisons"}
            </Link>
          </p>
        </div>
      </section>

      {/* ── Écran 4 — RÉASSURANCE ───────────────────────────────────────────── */}
      <section className="bg-[#FAFAF9] py-14 md:py-20">
        <div className="container-custom">
          <ul className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reassurance.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl border border-[#E7E5E4] bg-white px-5 py-4"
              >
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#b8860b]" />
                <span className="text-sm text-[#44403C]">{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-center text-[#57534E]">
            {en
              ? "A question before applying? Message us on WhatsApp — we answer fast."
              : "Une question avant de candidater ? Écris-nous sur WhatsApp, on répond vite."}
          </p>
        </div>
      </section>

      {/* WhatsApp flottant sur toute la page : 1 clic WhatsApp payant enregistré
          le 23/08 — le canal compte pour cette cible. */}
      <WhatsAppButton context={en ? "September rooms" : "Chambres septembre"} />
    </main>
  );
}
