import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ArrowRight, Check, Minus } from "lucide-react";
import { EntityFacts } from "@/components/EntityFacts";
import { FaqSection } from "@/components/FaqSection";
import { LocalizedLink } from "@/components/LocalizedLink";
import { SEO } from "@/components/SEO";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useHydrated } from "@/hooks/useHydrated";
import { buildBreadcrumbSchema, buildRoomsAggregateOfferSchema, homeUrl } from "@/lib/structuredData";
import { mirrorPath } from "@/lib/localizedPath";
import { responsiveImage } from "@/lib/responsiveImage";
import { PRICE_CHF_EN, PRICE_CHF_FR, PRICE_FROM_CHF_EN, PRICE_FROM_CHF_FR } from "@/data/stats";
import { PRICE_INCLUDES_ANCHOR } from "@/data/allInclusive";
import { APPART } from "@/data/appart";
import { LAPPART_HERO } from "@/data/appartCovers";
import { offerAt } from "@/data/offer";
import { inclusGroups } from "@/data/inclus";
import { tarifsPageFaq } from "@/data/faq/tarifsFaq";
import {
  BUDGET_GUIDE_PATH,
  TARIFS_ANCHORS,
  TARIFS_FAQ_TITLE,
  appartBlock,
  applyBlock,
  budgetBlock,
  firstYearOfferBlock,
  houseCards,
  includedBlock,
  pricesBlock,
  tarifsDescription,
  tarifsOfferShownNow,
  valueBlock,
  type TarifsLang,
} from "@/data/tarifsTexts";

/**
 * /tarifs et /en/tarifs — la page construite comme une seule histoire (brief « Page /tarifs et encadré « l'essentiel » : le budget
 * réel » du 23/11/2026, lot 1 ; textes des annexes A et B validés par Jérôme le 23/11/2026, décisions D15 à D21, G1 et G2 du
 * 24/11/2026) : le prix → ce qu'un loyer coûte vraiment ailleurs → ce que la différence paie → tout ce qui est compris → les
 * chambres et les conditions. Neuf blocs ; leurs numéros (ceux du brief, repris par les textes et les tests) ne suivent plus
 * l'ordre d'affichage depuis le 25/11/2026 (décision de Jérôme : les prix et l'offre en haut, puis ce que La Villa Coliving offre
 * de plus qu'une colocation, la fiche « l'essentiel » en bas de page). Sous le H1 (inchangé), on lit donc : 5, 6, 3, 2, 4, 7, 8,
 * 1, 9. Les fonds alternent toujours (blanc, beige) : le bloc 3 passe en beige, le bloc 2 en blanc.
 *   1. la fiche « l'essentiel » (EntityFacts, page="tarifs" : son lien « Voir le calcul » y devient une ancre dans la page),
 *      sous la FAQ et repliée au téléphone comme partout ;
 *   2. #calcul — le budget réel : trois paragraphes de réponse, les postes qui s'ajoutent à un loyer, le tableau (vrai <table>) ;
 *   3. #objection-prix — ce que la différence paie : quatre H3 numérotés, le tableau des maisons, les trois cartes (D18) ;
 *   4. #inclus — trois listes (src/data/inclus.ts), sans compteur ;
 *   5. #echelle-prix — trois prix, chambre par chambre, puis les conditions (L'Appart n'est plus dans ce tableau) ;
 *   6. #offre — l'offre « Ta première année avec nous », dans le navigateur seulement, après l'hydratation, pendant l'offre ;
 *   7. #lappart — L'Appart, après l'argument des maisons (D1) ; ses données structurées restent ;
 *   8. #faq — les onze questions du « budget réel » (tarifsPageFaq) et leur FAQPage (la FAQ A.3 n'est plus ici : G1) ;
 *   9. « Prêt à nous rejoindre ? » — sans chiffre (D11), deux boutons.
 * Textes : src/data/tarifsTexts.ts (blocs 2 à 7, 9), src/data/inclus.ts (bloc 4), src/data/faq/tarifsFaq.ts (bloc 8). Ici, aucun
 * texte ni nombre : la mise en page seulement. Une phrase ou un paragraphe = un nœud texte (aucun séparateur du prérendu dans une
 * phrase). Tableaux : à 375 px, chacun défile dans son cadre (première colonne figée), la page ne défile jamais en largeur.
 */

/** Marge de défilement des sections ancrées : barre de 4rem + bandeau de l'offre (--lvc-banner-h, src/index.css). */
const SCROLL_MT = "scroll-mt-[calc(4rem+var(--lvc-banner-h,0px))]";
const H2 = "text-3xl md:text-4xl text-[#1C1917] mb-6";
const H3 = "text-lg font-semibold text-[#1C1917] mb-2";
const LINK = "underline underline-offset-4 text-[#1C1917] hover:text-lvc-accent transition-colors";

/**
 * Arrivée sur /tarifs#objection-prix — lien « Ce que comprend le prix » des cartes chambres (13/11/2026).
 *
 * Sans ceci, la page s'ouvre en haut : ScrollToTop remonte à chaque changement de page et au chargement, avec ou sans
 * ancre. La correction est limitée à cette page (décision Jérôme du 13/11/2026) : ScrollToTop n'est pas modifié et les
 * autres pages défilent comme avant.
 *
 *  - La section se cale sous l'en-tête fixe par sa marge de défilement (classe `scroll-mt-…` de la section, qui suit la
 *    hauteur du bandeau de l'offre). `scrollIntoView` la respecte, le saut natif du navigateur aussi.
 *  - Deux temps. Avant la première image (useLayoutEffect) : la page s'affiche directement sur la section. Puis, après
 *    ScrollToTop (useEffect ; ScrollToTop est monté plus haut dans l'arbre, son effet passe avant) : on recale.
 *  - Ensuite la section est maintenue en place tant que le lecteur n'a pas touché la page : les polices arrivent après
 *    le premier rendu (display=swap) et la déplacent, et au chargement direct le saut animé du navigateur vers l'ancre
 *    (scroll-behavior: smooth) continue quelques images après un défilement instantané.
 *  - Bascule de langue : l'URL miroir garde l'ancre, mais le lecteur reste où il lisait (LanguageContext restaure sa
 *    position). La page qui se démonte note donc l'entrée d'historique de sa page miroir, et l'arrivée ne défile pas.
 */
const USER_INPUT_EVENTS = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
/** Durée pendant laquelle un défilement étranger est attribué au saut animé du navigateur, pas au lecteur. */
const ANCHOR_SETTLE_MS = 1000;

/** Entrée d'historique (chemin + clé) de la page miroir quand la dernière sortie de /tarifs est une bascule de langue. */
let languageSwitchArrival: { pathname: string; key: string } | null = null;

function isLanguageSwitchArrival(pathname: string, key: string): boolean {
  return languageSwitchArrival?.pathname === pathname && languageSwitchArrival.key === key;
}

/** À appeler quand la page se démonte : l'URL du navigateur est alors déjà celle de la page suivante. */
function noteDeparture(pathname: string): void {
  const next = window.location.pathname;
  if (next === pathname) return; // même page (ancre ou paramètres modifiés) : rien à noter
  const state = window.history.state as { key?: unknown } | null;
  const nextKey = state?.key;
  languageSwitchArrival = next === mirrorPath(pathname) && typeof nextKey === "string" ? { pathname: next, key: nextKey } : null;
}

function alignToAnchor(target: Element): void {
  // 'instant' : la page a scroll-behavior: smooth, et un défilement animé serait interrompu par le recalage suivant.
  target.scrollIntoView({ behavior: "instant", block: "start" });
}

/** Cale `target` sous l'en-tête et l'y garde jusqu'au premier geste du lecteur. Renvoie la fonction d'arrêt. */
function holdInView(target: Element): () => void {
  const startedAt = performance.now();
  let expectedY = 0;
  function align() {
    if (!target.isConnected) return; // page en cours de démontage : l'effet arrête tout juste après
    alignToAnchor(target);
    expectedY = window.scrollY;
  }
  // Toute variation de hauteur de la page (polices, contenu tardif) peut déplacer la section.
  const observer = typeof ResizeObserver === "function" ? new ResizeObserver(align) : null;
  function stop() {
    observer?.disconnect();
    for (const name of USER_INPUT_EVENTS) window.removeEventListener(name, stop);
    window.removeEventListener("scroll", onScroll);
  }
  // Défilement qui ne vient pas d'ici. Pendant la première seconde, c'est la fin du saut animé du navigateur : on
  // recale. Ensuite, c'est le lecteur (barre de défilement, qui n'émet aucun des événements ci-dessus) : il a la main.
  function onScroll() {
    if (Math.abs(window.scrollY - expectedY) <= 2) return;
    if (performance.now() - startedAt < ANCHOR_SETTLE_MS) align();
    else stop();
  }
  align();
  observer?.observe(document.body);
  for (const name of USER_INPUT_EVENTS) window.addEventListener(name, stop, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  return stop;
}

function usePriceAnchorArrival(): void {
  const { pathname, hash, key } = useLocation();
  const wanted = hash === `#${PRICE_INCLUDES_ANCHOR}`;
  useLayoutEffect(() => {
    if (wanted && !isLanguageSwitchArrival(pathname, key)) {
      const target = document.getElementById(PRICE_INCLUDES_ANCHOR);
      if (target) alignToAnchor(target);
    }
    // Nettoyage de mise en page : il passe avant les effets de la page suivante, qui lit cette note dès son montage.
    return () => noteDeparture(pathname);
  }, [pathname, wanted, key]);
  useEffect(() => {
    if (!wanted || isLanguageSwitchArrival(pathname, key)) return;
    const target = document.getElementById(PRICE_INCLUDES_ANCHOR);
    return target ? holdInView(target) : undefined;
  }, [pathname, wanted, key]);
}

/**
 * (24/11/2026, brief « budget réel », § 9 : les ancres « répondent ») Même arrivée pour les autres sections de la page — d'abord
 * #calcul, cible du lien « Voir le calcul » de la fiche « l'essentiel » des 9 pages : au chargement complet de /tarifs#calcul,
 * ScrollToTop ramènerait sinon la page en haut. usePriceAnchorArrival reste tel quel (ses tests le figent) et note seul le départ
 * de la page (bascule de langue), que ce hook lit aussi.
 */
const SECTION_ANCHORS: readonly string[] = [TARIFS_ANCHORS.calcul, TARIFS_ANCHORS.inclus, TARIFS_ANCHORS.prices, TARIFS_ANCHORS.lappart, TARIFS_ANCHORS.faq];

function useSectionAnchorArrival(): void {
  const { pathname, hash, key } = useLocation();
  const anchor = SECTION_ANCHORS.find((a) => hash === `#${a}`) ?? null;
  useLayoutEffect(() => {
    if (!anchor || isLanguageSwitchArrival(pathname, key)) return;
    const target = document.getElementById(anchor);
    if (target) alignToAnchor(target);
  }, [pathname, anchor, key]);
  useEffect(() => {
    if (!anchor || isLanguageSwitchArrival(pathname, key)) return;
    const target = document.getElementById(anchor);
    return target ? holdInView(target) : undefined;
  }, [pathname, anchor, key]);
}

// ── Mesure (GA4) : même garde que le reste du site, jamais bloquante ─────────────────────────────────────────────────────────

function gtagEvent(name: string, params: Record<string, string>): void {
  try {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", name, params);
  } catch { /* l'analytics ne bloque jamais l'UI */ }
}

/** `cta_click` (positions existantes : tarifs_climax, tarifs_footer ; nouvelle : tarifs_footer_rooms). */
const trackCta = (position: string, target: string, language: TarifsLang) =>
  gtagEvent("cta_click", { cta_position: position, cta_target: target, language });

/** `offer_cta_click` de l'offre en cours, emplacement « tarifs » (offer.ts n'est pas modifié : son type OfferPlacement ne le
 *  connaît pas, l'événement est donc envoyé ici, avec les mêmes paramètres que trackOfferCta). */
const trackOfferClick = (language: TarifsLang, pagePath: string) =>
  gtagEvent("offer_cta_click", { offer: offerAt()?.id ?? "none", placement: "tarifs", language, page_path: pagePath });

// ── Blocs ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────

const TABLE_FRAME = "overflow-x-auto rounded-2xl border border-[#E7E5E4] bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lvc-ink";
const TH_COL = "px-4 py-3 text-left font-semibold text-[#1C1917] border-b border-[#E7E5E4] align-bottom";
/** En-tête de ligne figé à gauche quand le tableau défile (téléphone). */
const TH_ROW = "sticky left-0 z-[1] px-4 py-3 text-left text-[#1C1917] border-b border-r border-[#E7E5E4] group-last:border-b-0 align-top w-[150px] min-w-[150px] md:w-auto md:min-w-[200px]";
const TD = "px-4 py-3 align-top border-b border-[#E7E5E4] group-last:border-b-0";

/**
 * (24/11/2026, décision de Jérôme : « fiches au téléphone ») Sous md, chaque ligne d'un tableau devient une fiche : en-têtes de
 * colonnes masqués, chaque cellule affiche le nom de sa colonne (attribut data-label) au-dessus de sa valeur. Un seul <table> reste
 * dans la page (Google, assistants IA, gardes, lecteurs d'écran sur ordinateur) ; seule la mise en forme change au téléphone.
 */
const FRAME_CARDS = "max-md:overflow-visible max-md:rounded-none max-md:border-0 max-md:bg-transparent";
const TABLE_CARDS = "max-md:block";
const THEAD_CARDS = "max-md:hidden";
const TBODY_CARDS = "max-md:block max-md:space-y-3";
/** Fiche « ticket » (budget, prix) : une valeur par ligne, le nom de la colonne à gauche, la valeur à droite — la plus compacte. */
const TR_CARD = "max-md:grid max-md:grid-cols-1 max-md:gap-y-1.5 max-md:rounded-xl max-md:border max-md:border-[#E7E5E4] max-md:p-4";
const TD_CARD_ROW = "max-md:flex max-md:items-baseline max-md:justify-between max-md:gap-4 max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:whitespace-normal max-md:text-right max-md:before:text-left max-md:before:text-sm max-md:before:font-normal max-md:before:text-[#78716C] max-md:before:content-[attr(data-label)]";
const TR_CARD_1COL = "max-md:grid max-md:grid-cols-1 max-md:gap-y-3 max-md:rounded-xl max-md:border max-md:border-[#E7E5E4] max-md:bg-white max-md:p-4";
const TH_CARD = "max-md:static max-md:order-first max-md:col-span-full max-md:mb-1 max-md:w-auto max-md:min-w-0 max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:text-base";
const TD_CARD = "max-md:block max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:whitespace-normal max-md:before:block max-md:before:mb-0.5 max-md:before:text-xs max-md:before:font-normal max-md:before:text-[#78716C] max-md:before:content-[attr(data-label)]";

/** Bloc 2 — « Chambre à Genève ou côté France : quel budget prévoir en plus du loyer ? » (#calcul). */
function BudgetSection({ L }: { L: TarifsLang }) {
  const T = budgetBlock(L);
  return (
    <section id={TARIFS_ANCHORS.calcul} aria-labelledby="calcul-title" className={`py-16 lg:py-20 bg-white ${SCROLL_MT}`}>
      <div className="max-w-3xl mx-auto px-6">
        <h2 id="calcul-title" className={H2}>{T.title}</h2>
        {/* Les trois paragraphes de réponse, sans rien entre le titre et eux. */}
        <div className="space-y-4 text-[#44403C] leading-relaxed">
          {T.answers.map((p) => <p key={p}>{p}</p>)}
        </div>
        <h3 className={`${H3} mt-10`}>{T.itemsTitle}</h3>
        <ul className="list-disc pl-6 space-y-1.5 text-[#44403C] leading-relaxed">
          {T.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <h3 id="calcul-tableau-title" className={`${H3} mt-10`}>{T.tableTitle}</h3>
        {/* Légende visible (unité + D20) ; la même, pour les lecteurs d'écran, dans le <caption> : un <caption> visible prendrait
            la largeur du tableau et sortirait de l'écran à 375 px. */}
        <p aria-hidden="true" className="mb-3 text-sm text-[#57534E]">{T.caption}</p>
      </div>
      <div className="max-w-5xl mx-auto px-6">
        <div className={`${TABLE_FRAME} ${FRAME_CARDS}`} role="region" aria-labelledby="calcul-tableau-title" tabIndex={0}>
          <table className={`w-full md:min-w-[640px] border-separate border-spacing-0 text-sm ${TABLE_CARDS}`} data-budget-table="">
            <caption className="sr-only">{T.caption}</caption>
            <thead className={THEAD_CARDS}>
              <tr className="bg-[#FAF9F6]">
                {T.header.map((h, i) => (
                  <th key={h} scope="col" className={i === 0 ? `${TH_COL} sticky left-0 z-[1] bg-[#FAF9F6] border-r` : `${TH_COL} whitespace-nowrap`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={TBODY_CARDS}>
              {T.rows.map((r) => {
                const bg = r.ours ? "bg-[#F8EFE4]" : "bg-white";
                return (
                  <tr key={r.key} className={`group ${TR_CARD} ${r.ours ? "max-md:bg-[#F8EFE4]" : "max-md:bg-white"}`} data-ours={r.ours ? "true" : undefined}>
                    <th scope="row" className={`${TH_ROW} ${bg} ${r.ours ? "font-semibold" : "font-medium"} ${TH_CARD}`}>{r.cells[0]}</th>
                    {r.cells.slice(1).map((c, i) => (
                      // Au téléphone, « Sans voiture » et « Avec voiture » (les deux dernières colonnes) viennent en premier, en gras.
                      <td
                        key={T.header[i + 1]}
                        data-label={T.header[i + 1]}
                        className={`${TD} ${bg} whitespace-nowrap ${r.ours ? "font-semibold text-[#1C1917]" : "text-[#44403C]"} ${TD_CARD_ROW} ${i >= 3 ? "max-md:order-1 max-md:font-semibold max-md:text-[#1C1917]" : "max-md:order-2"}`}
                      >
                        {c}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 mt-6 space-y-4 text-[#44403C] leading-relaxed">
        <p>{T.gaps}</p>
        <p>
          {T.france.before}
          <a href={`#${PRICE_INCLUDES_ANCHOR}`} className={LINK}>{T.france.label}</a>
          {T.france.after}
        </p>
        <p className="text-sm text-[#57534E]">
          {T.method.before}
          <LocalizedLink to={BUDGET_GUIDE_PATH} className={LINK}>{T.method.label}</LocalizedLink>
          {T.method.after}
        </p>
      </div>
    </section>
  );
}

/** Bloc 3 — « Ce que La Villa Coliving offre de plus qu'une colocation » (#objection-prix, cible du lien des cartes chambres). */
function ValueSection({ L }: { L: TarifsLang }) {
  const T = valueBlock(L);
  const cards = houseCards(L);
  const [space, house, nothing, life] = T.points;
  return (
    <section className="py-16 lg:py-20 bg-[#FAF9F6] scroll-mt-[calc(4rem+var(--lvc-banner-h,0px))]" id={PRICE_INCLUDES_ANCHOR}>
      <div className="max-w-3xl mx-auto px-6">
        <h2 className={H2}>{T.title}</h2>
        <p className="text-[#44403C] leading-relaxed">{T.intro}</p>
        <div className="mt-10 space-y-10 text-[#44403C] leading-relaxed">
          <div>
            <h3 className={H3}>{space.title}</h3>
            <p>{space.text}</p>
          </div>
          <div>
            <h3 id="maisons-equipees-title" className={H3}>{house.title}</h3>
            <p>{house.text}</p>
            <div className={`mt-6 ${TABLE_FRAME} ${FRAME_CARDS}`} role="region" aria-labelledby="maisons-equipees-title" tabIndex={0}>
              <table className={`w-full md:min-w-[600px] border-separate border-spacing-0 text-sm ${TABLE_CARDS}`} aria-labelledby="maisons-equipees-title">
                <thead className={THEAD_CARDS}>
                  <tr className="bg-[#FAF9F6]">
                    <td className="sticky left-0 z-[1] bg-[#FAF9F6] border-b border-r border-[#E7E5E4]" />
                    {T.houses.map((h) => (
                      <th key={h.slug} scope="col" className={TH_COL}>
                        <LocalizedLink to={`/${h.slug}`} className={LINK}>{h.name}</LocalizedLink>
                        {`, ${h.commune}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={TBODY_CARDS}>
                  {T.houseRows.map((r) => (
                    <tr key={r.label} className={`group ${TR_CARD_1COL}`}>
                      <th scope="row" className={`${TH_ROW} bg-white font-medium ${TH_CARD}`}>{r.label}</th>
                      {r.cells.map((c, i) => (
                        <td key={T.houses[i].slug} data-label={`${T.houses[i].name}, ${T.houses[i].commune}`} className={`${TD} bg-white text-[#44403C] ${TD_CARD}`}>{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* (D18) Les trois maisons : photo, nom, commune, lien vers la page — ni prix, ni texte. */}
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              {cards.map((c) => (
                <li key={c.slug}>
                  <LocalizedLink to={`/${c.slug}`} className="group block overflow-hidden rounded-2xl border border-[#E7E5E4] bg-white hover:shadow-lg transition-shadow">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={c.image}
                        {...responsiveImage(c.image, "(min-width: 640px) 33vw, 100vw")}
                        alt={c.alt}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="px-4 py-3">
                      <p className="font-semibold text-[#1C1917]">{c.name}</p>
                      <p className="text-sm text-[#57534E]">{c.commune}</p>
                    </div>
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className={H3}>{nothing.title}</h3>
            <p>{nothing.text}</p>
          </div>
          <div>
            <h3 className={H3}>{life.title}</h3>
            <p>{life.text}</p>
          </div>
          <p className="font-semibold text-[#1C1917]">
            {T.visit.before}
            <LocalizedLink to="/candidature" onClick={() => trackCta("tarifs_climax", "/candidature", L)} className={LINK}>{T.visit.label}</LocalizedLink>
            {T.visit.after}
          </p>
        </div>
      </div>
    </section>
  );
}

/** Bloc 4 — « Tout ce qui est compris dans le prix » (#inclus) : trois listes, aucun compteur. */
function IncludedSection({ L }: { L: TarifsLang }) {
  const T = includedBlock(L);
  return (
    <section id={TARIFS_ANCHORS.inclus} aria-labelledby="inclus-title" className={`py-16 lg:py-20 bg-[#FAF9F6] ${SCROLL_MT}`}>
      <div className="max-w-5xl mx-auto px-6">
        <h2 id="inclus-title" className={H2}>{T.title}</h2>
        <p className="text-[#44403C] leading-relaxed max-w-3xl">{T.intro}</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {inclusGroups(L).map((g) => (
            <div key={g.id} className="rounded-2xl border border-[#E7E5E4] bg-white p-6">
              <h3 className={`${H3} mb-4`}>{g.title}</h3>
              <ul className="space-y-2.5 text-sm text-[#44403C] leading-relaxed">
                {g.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    {g.included
                      ? <Check className="w-4 h-4 mt-0.5 shrink-0 text-lvc-accent" aria-hidden="true" />
                      : <Minus className="w-4 h-4 mt-0.5 shrink-0 text-[#78716C]" aria-hidden="true" />}
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Bloc 5 — « Les prix, chambre par chambre » (#echelle-prix ; le titre garde son id historique echelle-prix-title). */
function PricesSection({ L }: { L: TarifsLang }) {
  const T = pricesBlock(L);
  return (
    <section id={TARIFS_ANCHORS.prices} aria-labelledby={TARIFS_ANCHORS.pricesTitle} className={`py-16 lg:py-20 bg-white ${SCROLL_MT}`}>
      <div className="max-w-5xl mx-auto px-6">
        <h2 id={TARIFS_ANCHORS.pricesTitle} className={H2}>{T.title}</h2>
        <p className="text-[#44403C] leading-relaxed max-w-3xl mb-6">{T.intro}</p>
        <div className={`${TABLE_FRAME} ${FRAME_CARDS}`} role="region" aria-labelledby={TARIFS_ANCHORS.pricesTitle} tabIndex={0}>
          <table className={`w-full md:min-w-[640px] border-separate border-spacing-0 text-sm ${TABLE_CARDS}`}>
            <thead className={THEAD_CARDS}>
              <tr className="bg-[#FAF9F6]">
                {T.header.map((h, i) => (
                  <th key={h} scope="col" className={i === 0 ? `${TH_COL} sticky left-0 z-[1] bg-[#FAF9F6] border-r` : TH_COL}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={TBODY_CARDS}>
              {T.rows.map((r) => (
                <tr key={r.key} className={`group ${TR_CARD} max-md:bg-white`}>
                  <th scope="row" className={`${TH_ROW} bg-white font-medium ${TH_CARD}`}>{r.room}</th>
                  <td data-label={T.header[1]} className={`${TD} font-semibold text-[#1C1917] whitespace-nowrap ${TD_CARD_ROW}`}>{r.chf}</td>
                  <td data-label={T.header[2]} className={`${TD} text-[#44403C] whitespace-nowrap ${TD_CARD_ROW}`}>{r.eur}</td>
                  <td data-label={T.header[3]} className={`${TD} text-[#44403C] ${TD_CARD_ROW}`}>{r.count}</td>
                  <td data-label={T.header[4]} className={`${TD} text-[#44403C] ${TD_CARD_ROW}`}>{r.bath}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 max-w-3xl space-y-3 text-[#44403C] leading-relaxed">
          <p>
            {T.rooms.before}
            <LocalizedLink to="/chambres-disponibles" className={LINK}>{T.rooms.label}</LocalizedLink>
            {T.rooms.after}
          </p>
          <p className="text-sm text-[#57534E]">{T.lease}</p>
        </div>
        <h3 className={`${H3} mt-10`}>{T.termsTitle}</h3>
        <ul className="max-w-3xl list-disc pl-6 space-y-2 text-[#44403C] leading-relaxed">
          {T.terms.map((t) => <li key={t}>{t}</li>)}
        </ul>
      </div>
    </section>
  );
}

/**
 * Bloc 6 — l'offre en cours (#offre). Rendu DANS LE NAVIGATEUR SEULEMENT : pendant l'hydratation, useHydrated vaut false (le
 * premier rendu client est le HTML prérendu, sans le bloc : aucun écart d'hydratation), puis le bloc paraît si l'offre « Ta
 * première année avec nous » est en cours (offerAt) et si le navigateur n'est pas automatisé — le prérendu Puppeteer
 * (navigator.webdriver) ne le capture donc jamais. Le 1er janvier 2027 à 0 h (heure de Paris), il disparaît sans déploiement.
 * Ni dans le FAQPage, ni dans les données structurées, ni dans llms.txt.
 */
function OfferSection({ L }: { L: TarifsLang }) {
  const hydrated = useHydrated();
  const { pathname } = useLocation();
  if (!hydrated || !tarifsOfferShownNow()) return null;
  const T = firstYearOfferBlock(L);
  return (
    <section id={TARIFS_ANCHORS.offer} aria-labelledby="offre-title" data-tarifs-offer="" className={`py-12 bg-white ${SCROLL_MT}`}>
      <div className="max-w-3xl mx-auto px-6">
        <div className="rounded-2xl border border-lvc-accent bg-[#FAF9F6] p-6 md:p-8">
          <h2 id="offre-title" className="text-2xl md:text-3xl text-[#1C1917] mb-2">{T.title}</h2>
          <p className="mb-4 text-sm text-[#78716C]">{T.chf}</p>
          <p className="text-[#44403C] leading-relaxed mb-3">{T.subtitle}</p>
          <p className="text-[#44403C] leading-relaxed mb-6">{T.deadline}</p>
          <LocalizedLink
            to={T.path}
            onClick={() => trackOfferClick(L, pathname)}
            className="inline-flex items-center gap-2 min-h-[44px] text-sm font-semibold text-[#1C1917] underline underline-offset-4 hover:text-lvc-accent transition-colors"
          >
            {T.link}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </LocalizedLink>
        </div>
      </div>
    </section>
  );
}

/**
 * Bloc 7 — « Une autre formule : L'Appart, notre colocation » (#lappart). C'est le bloc statique de L'Appart de /tarifs
 * (data-appart-teaser="/tarifs", garde check:facts) : texte de l'annexe (src/data/tarifsTexts.ts, appartBlock), photo et lien comme
 * <AppartTeaser/>, mesure `house_discover_click` inchangée. Aucun prix de L'Appart dans la phrase de la piscine.
 */
function AppartSection({ L }: { L: TarifsLang }) {
  const T = appartBlock(L);
  const img = LAPPART_HERO.wide;
  const track = () => gtagEvent("house_discover_click", { house: APPART.key, cta_position: "appart_teaser", page: "tarifs", language: L });
  return (
    <section id={TARIFS_ANCHORS.lappart} data-appart-teaser="/tarifs" aria-labelledby="lappart-title" className={`py-16 lg:py-20 bg-white border-t border-[#E7E5E4] ${SCROLL_MT}`}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-5 overflow-hidden rounded-2xl border border-[#E7E5E4] bg-white">
          <div className="relative h-52 sm:h-64 md:h-auto md:min-h-[280px] md:col-span-2">
            <img
              src={img.src}
              {...responsiveImage(img.src, "(min-width: 768px) 40vw, 100vw")}
              alt={img.alt[L]}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: img.focal }}
              loading="lazy"
              width={img.w}
              height={img.h}
            />
          </div>
          <div className="p-6 md:p-8 md:col-span-3 flex flex-col">
            <h2 id="lappart-title" className="text-2xl md:text-3xl text-[#1C1917] leading-tight">{T.title}</h2>
            {T.paragraphs.map((p) => <p key={p} className="mt-3 text-[#44403C] leading-relaxed">{p}</p>)}
            <LocalizedLink
              to={`/${APPART.key}`}
              onClick={track}
              className="mt-5 self-start inline-flex items-center gap-2 min-h-[44px] text-sm font-semibold text-[#1C1917] underline underline-offset-4 hover:text-lvc-accent transition-colors"
            >
              {T.link}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </LocalizedLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Bloc 9 — « Prêt à nous rejoindre ? » : sans chiffre d'économie ni « places limitées » (D11), deux boutons. */
function ApplySection({ L }: { L: TarifsLang }) {
  const T = applyBlock(L);
  return (
    <section className="py-20 lg:py-24 bg-[#1C1917]">
      <div className="container-custom text-center">
        <h2 className="text-3xl md:text-4xl text-white mb-4">{T.title}</h2>
        <p className="text-lg text-white/85 max-w-xl mx-auto mb-8">{T.text}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <LocalizedLink
            to="/chambres-disponibles"
            onClick={() => trackCta("tarifs_footer_rooms", "/chambres-disponibles", L)}
            className="lvc-btn-secondary lvc-btn-secondary--on-dark inline-flex items-center justify-center gap-2 px-8 py-4"
          >
            {T.rooms}
          </LocalizedLink>
          <LocalizedLink
            to="/candidature"
            onClick={() => trackCta("tarifs_footer", "/candidature", L)}
            className="lvc-btn-primary inline-flex items-center justify-center gap-2 px-8 py-4"
          >
            {T.apply}
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </LocalizedLink>
        </div>
      </div>
    </section>
  );
}

export function RatesPageV4() {
  const { language } = useLanguage();
  usePriceAnchorArrival();
  useSectionAnchorArrival();
  const L: TarifsLang = language === "en" ? "en" : "fr";
  const en = L === "en";
  const pageUrl = `https://www.lavillacoliving.com${en ? "/en" : ""}/tarifs`;
  const AP = APPART.price;
  const appartHigh = AP.room.chf >= AP.suite.chf ? AP.room : AP.suite;

  return (
    <main className="relative pt-16">
      <SEO
        // Prix retiré du title le 15/08/2026 (doctrine A6/S33) — il reste en meta description. Title et H1 inchangés (brief § 3).
        title={en ? "Rates: one all-inclusive rent near Geneva" : "Tarifs : un loyer tout compris près de Genève"}
        // (D19) La description de la fiche LocalBusiness suit : SEO la reprend (buildLocalBusinessSchema) ; priceRange inchangé (D21).
        description={tarifsDescription(L)}
        url="https://www.lavillacoliving.com/tarifs"
      />
      <Helmet>
        {/* URLs localisées (…/en/tarifs en anglais) — même pattern que HouseDetailPage/BlogPostPage */}
        <script type="application/ld+json">{JSON.stringify(buildBreadcrumbSchema([
          { name: en ? "Home" : "Accueil", url: homeUrl(L) },
          { name: en ? "Rates" : "Tarifs", url: pageUrl },
        ]))}</script>
        {/* Les deux AggregateOffer, inchangées (brief § 3) : les maisons, puis L'Appart imbriquée dans un catalogue (un seul bloc
            AggregateOffer de premier niveau par page : garde jsonLdConflicts). Aucun aggregateRating, aucun Review. */}
        <script type="application/ld+json">{JSON.stringify(buildRoomsAggregateOfferSchema({
          name: en ? "All-inclusive furnished room near Geneva" : "Chambre meublée tout inclus près de Genève",
          description: en
            ? `All-inclusive coliving room from ${PRICE_FROM_CHF_EN} to ${PRICE_CHF_EN}/month near Geneva — utilities, fiber, cleaning, pool, sauna, gym included.`
            : `Chambre de coliving tout inclus de ${PRICE_FROM_CHF_FR} à ${PRICE_CHF_FR}/mois près de Genève — charges, fibre, ménage, piscine, sauna, salle de sport compris.`,
          url: pageUrl,
        }))}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "OfferCatalog",
          name: `${APPART.name}, ${en ? APPART.descriptor.en : APPART.descriptor.fr}`,
          url: `${pageUrl}#${TARIFS_ANCHORS.lappart}`,
          itemListElement: [{
            "@type": "AggregateOffer",
            name: en ? `Furnished room in a flatshare in ${APPART.commune} (${APPART.name})` : `Chambre meublée en colocation à ${APPART.commune} (${APPART.name})`,
            description: en
              ? `Furnished room in a ${APPART.descriptor.en}, from ${AP.from.en.chf} to ${appartHigh.en.chf}/month — bills, fibre, streaming and cleaning of the shared areas included.`
              : `Chambre meublée en ${APPART.descriptor.fr}, de ${AP.from.fr.chf} à ${appartHigh.fr.chf}/mois — charges, fibre, streaming et ménage des communs compris.`,
            lowPrice: String(AP.from.chf),
            highPrice: String(appartHigh.chf),
            priceCurrency: "CHF",
            offerCount: APPART.rooms.total,
            // (19/11/2026, V2-22) Pas d'availabilityStarts : l'ouverture n'est publiée qu'au mois (« février 2027 »).
            url: `${pageUrl}#${TARIFS_ANCHORS.lappart}`,
            seller: { "@type": "Organization", name: "La Villa Coliving", url: "https://www.lavillacoliving.com" },
          }],
        })}</script>
      </Helmet>

      {/* En-tête : le H1 inchangé. */}
      <section className="pt-14 pb-2 lg:pt-20 bg-white">
        <div className="container-custom text-center">
          <span className="lvc-eyebrow mb-4">
            {en ? "Pricing" : "Tarification"}
          </span>
          {/* (Lot 2a, 28/11/2026) Sur mobile, le mot en italique sur sa propre ligne : à 412 px le titre tenait sur une ligne
              avec DM Serif et sur deux avec la police de repli, et la section des prix sautait à l'arrivée des polices (CLS). */}
          <h1
            className="text-5xl md:text-6xl lg:text-7xl text-[#1C1917]"
          >
            {en ? (
              <>
                <em className="lvc-h1-accent block sm:inline">Transparent</em> Pricing
              </>
            ) : (
              <>
                Tarifs <em className="lvc-h1-accent block sm:inline">transparents</em>
              </>
            )}
          </h1>
        </div>
      </section>

      {/* (25/11/2026, décision de Jérôme) Les prix et l'offre d'abord, puis ce que La Villa Coliving offre de plus qu'une colocation. */}
      <PricesSection L={L} />
      <OfferSection L={L} />
      <ValueSection L={L} />
      <BudgetSection L={L} />
      <IncludedSection L={L} />
      <AppartSection L={L} />

      {/* 8. Les onze questions ; le FAQPage est construit à partir du même tableau (mêmes mots, même nombre). */}
      <FaqSection title={TARIFS_FAQ_TITLE[L]} items={tarifsPageFaq[L]} emitSchema className={SCROLL_MT} />

      {/* 1. La fiche « l'essentiel », en bas de page (25/11/2026), repliée au téléphone : son lien « Voir le calcul » mène au bloc 2. */}
      <section className="py-10 md:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6"><EntityFacts page="tarifs" className="!my-0" /></div>
      </section>

      <ApplySection L={L} />
      {/* R3 (checkpoint 21/08) : canal court sur une page d'entrée — pas sur /candidature (71 % de complétion, on ne détourne pas). */}
      <WhatsAppButton context={en ? "Rates" : "Tarifs"} />
    </main>
  );
}
