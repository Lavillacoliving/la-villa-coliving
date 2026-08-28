import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bath, Calendar, Check, Maximize2, ZoomIn } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { responsiveImage } from "@/lib/responsiveImage";
import { STATS } from "@/data/stats";
import type { RoomSeptembre } from "@/data/roomsSeptembre";
import {
  AVAILABLE_COUNT,
  AVAILABLE_ROOMS,
  HERO_ALT,
  HERO_H,
  HERO_IMAGE,
  HERO_W,
  LP_HOUSES,
  LP_MONTH,
  PRICE_FROM_CHF,
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
 *
 * ── TROIS ÉTATS, UN SEUL COMPTEUR (LOT 4, 28/08/2026) ────────────────────────
 * Le composant ne décide de rien : `AVAILABLE_COUNT` (chambres au statut
 * "disponible") le met dans l'un des trois états, et le mois vient de `LP_MONTH`.
 *
 *   n ≥ 2 → « Il ne reste que N chambres pour {mois} »   · CTA vers les cartes
 *   n = 1 → « Dernière chambre disponible pour {mois} »  · CTA vers la carte
 *   n = 0 → « Complet pour {mois} »                      · CTA vers /candidature,
 *           qui sert de liste d'attente ; les cartes cèdent la place au bloc des
 *           3 maisons. Rien n'est supprimé : rouvrir une chambre dans le fichier
 *           de données ramène la page entière, lightbox du LOT 3 comprise.
 *
 * Pourquoi cette mécanique : les campagnes s'allument par « blast » de quelques
 * jours à chaque libération. Entre deux blasts la page reste en ligne (lien
 * partagé, onglet rouvert, accès direct) — elle doit donc pouvoir dire « complet »
 * toute seule. Une page qui ment abîme la crédibilité que la rareté a construite.
 */
/**
 * La visionneuse n'est chargée qu'au premier geste (et préchargée à l'idle, voir
 * plus bas) : elle ne pèse rien sur le chunk initial de la LP, et la haute
 * résolution n'entre jamais dans le flux de chargement de la page (brief C4).
 */
const PhotoLightbox = lazy(() => import("@/components/PhotoLightbox"));

/** Nombre de vignettes visibles en carte ; le reste vit dans la lightbox. */
const CARD_PHOTOS = 3;

/** Le CTA du hero change de destination selon l'état, jamais d'allure. */
const HERO_CTA_CLASS =
  "mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 text-base font-semibold text-[#1C1917] shadow-lg transition-transform hover:scale-[1.02]";

/**
 * Mesure directe de l'efficacité du lot : Clarity montrait des clics morts sur les
 * photos, cet événement compte les ouvertures réelles. Même motif gardé que les
 * autres CTA du site — l'analytics ne doit jamais casser l'UI (adblock, gtag absent).
 */
function trackLightboxOpen(room: RoomSeptembre, photoIndex: number) {
  try {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "photo_lightbox_open", {
      room_id: room.id,
      property_interest: room.property,
      photo_index: photoIndex,
    });
  } catch {
    /* noop */
  }
}

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
  /**
   * Le compteur — dérivé des chambres OUVERTES (src/data/roomsSeptembre.ts), jamais
   * saisi. Il gouverne à lui seul les trois états de la page ; `isFull` n'est pas un
   * mode à part, c'est son cas n = 0.
   */
  const count = AVAILABLE_COUNT;
  const isFull = count === 0;
  /** « septembre » / « September » — variable, pour que la bascule de mois soit une
   *  seule valeur à changer et non une chasse aux chaînes dans le composant. */
  const month = en ? LP_MONTH.en : LP_MONTH.fr;

  // Une seule lightbox à la fois : quelle chambre, quelle photo.
  const [viewer, setViewer] = useState<{ room: number; photo: number } | null>(null);
  /** Le bouton qui a ouvert la visionneuse — on lui rend le focus à la fermeture. */
  const triggerRef = useRef<HTMLElement | null>(null);

  const openViewer = useCallback(
    (roomIndex: number, photoIndex: number, trigger?: HTMLElement | null) => {
      // Radix rend le focus à l'élément focalisé À L'OUVERTURE. Or Safari — 1er
      // navigateur de la LP (29,5 % des sessions) — ne focalise pas un <button> au
      // clic : sans ce `focus()`, le focus retombait sur <body> à la fermeture et
      // l'utilisateur au clavier repartait du haut de la page.
      trigger?.focus();
      triggerRef.current = trigger ?? null;
      setViewer({ room: roomIndex, photo: photoIndex });
      trackLightboxOpen(AVAILABLE_ROOMS[roomIndex], photoIndex);
    },
    [],
  );

  /**
   * Fermeture + restitution EXPLICITE du focus. Radix a bien un mécanisme de
   * restitution, mais au moment où il s'exécute le déclencheur est encore dans le
   * sous-arbre masqué par la modale : le `focus()` y est sans effet et le focus
   * retombe sur <body>. On le refait au tour de boucle suivant, overlay démonté.
   *
   * `setTimeout` et non `requestAnimationFrame` : rAF est SUSPENDU dans un onglet
   * en arrière-plan — la restitution n'aurait jamais lieu pour qui change d'onglet
   * pendant la visite.
   */
  const closeViewer = useCallback(() => {
    setViewer(null);
    const trigger = triggerRef.current;
    if (trigger) window.setTimeout(() => trigger.focus(), 0);
  }, []);

  // Précharge le chunk de la visionneuse quand le navigateur n'a plus rien à faire :
  // l'ouverture est alors instantanée, sans avoir rien coûté au premier rendu.
  useEffect(() => {
    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const load = () => { void import("@/components/PhotoLightbox"); };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(load);
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(load, 2500);
    return () => window.clearTimeout(id);
  }, []);

  const heroBadge = isFull
    ? en
      ? "Next availabilities"
      : "Prochaines disponibilités"
    : en
      ? `${month} availability`
      : `Disponible en ${month}`;

  const heroTitle = isFull
    ? en
      ? `Fully booked for ${month}`
      : `Complet pour ${month}`
    : count === 1
      ? en
        ? `Last room available for ${month}`
        : `Dernière chambre disponible pour ${month}`
      : en
        ? `Only ${count} rooms left for ${month}`
        : `Il ne reste que ${count} chambres pour ${month}`;

  const ctaLabel = isFull
    ? en
      ? "Be the first to know"
      : "Être prévenu·e en premier"
    : count === 1
      ? en
        ? "See the room"
        : "Voir la chambre"
      : en
        ? `See the ${count} rooms`
        : `Voir les ${count} chambres`;

  /**
   * Complet → le CTA quitte le tunnel photo : il n'y a plus de carte à faire
   * défiler, et /candidature EST la liste d'attente (le formulaire existant, avec
   * son Edge d'envoi — rien de nouveau à brancher).
   */
  const ctaHref = isFull ? `${prefix}/candidature` : "#chambres";

  // « dès » obligatoire (CLAUDE.md) : le prix affiché est un point d'entrée, pas un prix unique.
  const heroSubtitle = isFull
    ? en
      ? `All our ${month} rooms are taken. New rooms open up regularly — leave us your details and we'll let you know first.`
      : `Toutes nos chambres de ${month} sont réservées. Les prochaines libérations arrivent — laisse-nous tes coordonnées, on te prévient en premier.`
    : en
      ? `Your room in a house with a pool, sauna and gym — from CHF ${formatChf(PRICE_FROM_CHF, true)}/month all-inclusive, 15 minutes from Geneva.`
      : `Ta chambre dans une maison avec piscine, sauna et salle de sport — dès ${formatChf(PRICE_FROM_CHF, false)} CHF/mois tout inclus, à 15 min de Genève.`;

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
        /* Le title suit le H1 : la page partagée en lien ne doit jamais promettre
           des chambres qu'elle n'affiche plus. Jamais de prix ici (décision S33). */
        title={heroTitle}
        description={
          isFull
            ? en
              ? `All our ${month} rooms are taken. ${STATS.totalHouses} homes, ${STATS.totalRooms} rooms near Geneva — leave us your details and we'll let you know as soon as one opens up.`
              : `Toutes nos chambres de ${month} sont réservées. ${STATS.totalHouses} maisons, ${STATS.totalRooms} chambres près de Genève : laisse-nous tes coordonnées, on te prévient dès la prochaine libération.`
            : en
              ? `${count} rooms available this ${month} near Geneva. Pool, sauna, gym. From CHF ${formatChf(PRICE_FROM_CHF, true)}/month all-inclusive, no agency or application fee.`
              : `${count} chambres se libèrent en ${month} près de Genève. Piscine, sauna, salle de sport. Dès ${formatChf(PRICE_FROM_CHF, false)} CHF/mois tout inclus, 0 frais de dossier.`
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
            {heroBadge}
          </span>
          <h1
            className="max-w-3xl text-4xl leading-tight text-white sm:text-5xl md:text-6xl"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {heroTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/90 sm:text-lg">{heroSubtitle}</p>
          {/* Complet → <Link> (navigation SPA vers /candidature) ; sinon <a> vers
              l'ancre des cartes, qu'un Link transformerait en changement de route. */}
          {isFull ? (
            <Link to={ctaHref} className={HERO_CTA_CLASS}>
              {ctaLabel}
              <ArrowRight className="h-5 w-5" />
            </Link>
          ) : (
            <a href={ctaHref} className={HERO_CTA_CLASS}>
              {ctaLabel}
              <ArrowRight className="h-5 w-5" />
            </a>
          )}
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

      {/* ── Écran 3 — LES CARTES CHAMBRES : la preuve datée ───────────────────
          MASQUÉES, JAMAIS SUPPRIMÉES quand il n'y a plus rien à louer : la
          lightbox, les galeries et les affordances du LOT 3 restent en place et
          reviennent d'elles-mêmes dès qu'une chambre repasse à "disponible". */}
      {!isFull && (
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
            {AVAILABLE_ROOMS.map((room, roomIndex) => (
              <article
                key={room.id}
                className="overflow-hidden rounded-2xl border border-[#E7E5E4] bg-white shadow-sm"
              >
                {/* Photo 1 = l'atout de SA maison (décision produit du brief).
                    Bande de vignettes en dessous : les 2 photos de la chambre.
                    Les deux ouvrent la visionneuse : Clarity classait ces images n°2, 3, 4,
                    6, 8 et 9 des éléments cliqués — des clics morts jusqu'au 26/08. */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => openViewer(roomIndex, 0, e.currentTarget)}
                    aria-label={
                      en
                        ? `Open the photos of ${room.landmark.en} (${room.photos.length} photos)`
                        : `Ouvrir les photos de ${room.landmark.fr} (${room.photos.length} photos)`
                    }
                    className="group block w-full cursor-pointer transition-[filter] active:brightness-90"
                  >
                    <img
                      src={room.photos[0].src}
                      alt={en ? room.photos[0].alt.en : room.photos[0].alt.fr}
                      {...responsiveImage(room.photos[0].src, "(min-width: 768px) 46vw, 100vw")}
                      width={room.photos[0].w}
                      height={room.photos[0].h}
                      // Sous la ligne de flottaison (le hero occupe 100svh) : rien à
                      // charger d'avance, ces octets concurrençaient le premier rendu.
                      loading="lazy"
                      decoding="async"
                      className="w-full object-cover"
                      style={{ aspectRatio: String(frameRatio(room.photos[0].w, room.photos[0].h)) }}
                    />
                    {/* Affordance : au survol en desktop, PERMANENTE en mobile — là où
                        il n'y a pas de survol pour révéler quoi que ce soit. */}
                    <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                      <ZoomIn className="h-5 w-5" />
                    </span>
                  </button>
                  {/* `pointer-events-none` : la pastille ne doit pas percer un trou
                      dans la zone cliquable de la photo. */}
                  <span className="pointer-events-none absolute left-4 top-4 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#1C1917] backdrop-blur-sm">
                    {room.houseName}
                  </span>
                </div>
                {/* Largeur PROPORTIONNELLE au ratio (flex-grow = ratio) + aspect-ratio
                    identique : les hauteurs s'égalisent d'elles-mêmes, la ligne se
                    remplit entièrement, et AUCUNE photo n'est recadrée — y compris
                    un paysage 3:2 à côté d'un portrait 3:4. Une hauteur fixe, elle,
                    laissait la chambre 8 (portraits) chétive et le Lodge en débord. */}
                <div className="flex gap-2 bg-white p-2">
                  {room.photos.slice(1, CARD_PHOTOS).map((photo, i) => {
                    const photoIndex = i + 1;
                    const isLastThumb = photoIndex === CARD_PHOTOS - 1;
                    const remaining = room.photos.length - CARD_PHOTOS;
                    return (
                      <button
                        key={photo.src}
                        type="button"
                        onClick={(e) => openViewer(roomIndex, photoIndex, e.currentTarget)}
                        aria-label={
                          isLastThumb && remaining > 0
                            ? en
                              ? `See all ${room.photos.length} photos`
                              : `Voir les ${room.photos.length} photos`
                            : en
                              ? photo.alt.en
                              : photo.alt.fr
                        }
                        // `min-w-0` et PAS de `w-full` : une largeur 100 % entrerait en
                        // conflit avec la base flex et ferait déborder la ligne.
                        className="relative min-w-0 cursor-pointer overflow-hidden rounded-md transition-transform active:scale-[0.97]"
                        style={{ flex: `${photo.w / photo.h} 1 0%`, aspectRatio: String(photo.w / photo.h) }}
                      >
                        <img
                          src={photo.src}
                          alt={en ? photo.alt.en : photo.alt.fr}
                          {...responsiveImage(photo.src, "(min-width: 768px) 23vw, 45vw")}
                          width={photo.w}
                          height={photo.h}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                        {/* Le reste de la galerie, annoncé SANS interaction préalable :
                            le visiteur doit savoir qu'il y a plus à voir avant de cliquer. */}
                        {isLastThumb && remaining > 0 && (
                          <span
                            aria-hidden
                            className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 text-white backdrop-blur-[1px]"
                          >
                            <span className="text-lg font-semibold leading-none">+{remaining}</span>
                            <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.15em]">
                              photos
                            </span>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="p-6">
                  {/* Le titre recevait des clics (n°10 de la heatmap) : il était perçu
                      comme un lien. Il en devient un — vers la visionneuse. */}
                  <h3
                    className="text-xl text-[#1C1917]"
                    style={{ fontFamily: "DM Serif Display, serif" }}
                  >
                    <button
                      type="button"
                      onClick={(e) => openViewer(roomIndex, 0, e.currentTarget)}
                      className="cursor-pointer text-left underline-offset-4 transition-colors hover:text-[#b8860b] hover:underline focus-visible:underline active:text-[#b8860b]"
                    >
                      {en ? room.landmark.en : room.landmark.fr}
                    </button>
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
                        ? `CHF ${formatChf(room.priceChf, true)}/month`
                        : `${formatChf(room.priceChf, false)} CHF/mois`}
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
      )}

      {/* ── Écran 3 bis — MODE COMPLET : plus de chambre à montrer, alors on
          montre OÙ elles se libèrent. Remplace les cartes, ne les efface pas. ── */}
      {isFull && (
        <section className="py-16 md:py-24">
          <div className="container-custom">
            <h2
              className="mb-3 text-center text-3xl text-[#1C1917] md:text-4xl"
              style={{ fontFamily: "DM Serif Display, serif" }}
            >
              {en ? `Our ${STATS.totalHouses} homes` : `Nos ${STATS.totalHouses} maisons`}
            </h2>
            <p className="mb-12 text-center text-[#57534E]">
              {en
                ? `${STATS.totalRooms} rooms, with rooms opening up all year round.`
                : `${STATS.totalRooms} chambres, des libérations toute l'année.`}
            </p>

            <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
              {LP_HOUSES.map((house) => (
                <Link
                  key={house.slug}
                  to={`${prefix}/${house.slug}`}
                  className="group overflow-hidden rounded-2xl border border-[#E7E5E4] bg-white shadow-sm transition-transform hover:scale-[1.02]"
                >
                  {/* Cadre 4/3 commun : les 3 photos n'ont pas le même format, seul
                      un cadre imposé aligne les cartes. `width`/`height` réels pour
                      que la place soit réservée avant le chargement (pas de CLS). */}
                  <img
                    src={house.src}
                    alt={en ? house.alt.en : house.alt.fr}
                    {...responsiveImage(house.src, "(min-width: 640px) 30vw, 100vw")}
                    width={house.w}
                    height={house.h}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="flex items-center justify-between gap-3 px-5 py-4">
                    <span>
                      <span
                        className="block text-lg text-[#1C1917]"
                        style={{ fontFamily: "DM Serif Display, serif" }}
                      >
                        {house.name}
                      </span>
                      <span className="mt-0.5 block text-sm text-[#57534E]">{house.city}</span>
                    </span>
                    <ArrowRight className="h-5 w-5 shrink-0 text-[#b8860b] transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Lien maisons — demandé par Jérôme le 24/08, conservé ici : il mène à
                la page d'ensemble, pas à une maison en particulier. */}
            <p className="mt-12 text-center text-sm text-[#57534E]">
              {en ? "Want to see the houses themselves? " : "Envie de voir les maisons en entier ? "}
              <Link
                to={`${prefix}/nos-maisons`}
                className="font-medium text-[#b8860b] underline underline-offset-4 hover:text-[#1C1917] transition-colors"
              >
                {en ? `Discover our ${STATS.totalHouses} homes` : `Découvrir nos ${STATS.totalHouses} maisons`}
              </Link>
            </p>
          </div>
        </section>
      )}

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

      {/* Montée uniquement après un geste : tant que `viewer` est nul, ni le chunk
          ni la moindre photo haute résolution n'est demandé. Pas de `fallback` :
          le chunk est déjà préchargé à l'idle, et un voile d'attente sur un overlay
          plein écran serait plus perturbant que son absence. */}
      {viewer !== null && (
        <Suspense fallback={null}>
          <PhotoLightbox
            photos={AVAILABLE_ROOMS[viewer.room].photos}
            index={viewer.photo}
            onIndexChange={(photo) => setViewer((v) => (v ? { ...v, photo } : v))}
            onClose={closeViewer}
            en={en}
            title={
              en
                ? AVAILABLE_ROOMS[viewer.room].landmark.en
                : AVAILABLE_ROOMS[viewer.room].landmark.fr
            }
          />
        </Suspense>
      )}
    </main>
  );
}
