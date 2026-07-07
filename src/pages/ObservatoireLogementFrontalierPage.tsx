import { useState, type ReactNode } from "react";
import { Helmet } from "react-helmet";
import { LocalizedLink } from "@/components/LocalizedLink";
import { colocGeneveHref } from "@/lib/siteLinks";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";
import { buildDatasetSchema } from "@/lib/structuredData";
import { BAROMETRE, STUDIO_FULL_COST } from "@/data/barometre";
import { Train, Bus, Bike, Car, Wallet, Download, ArrowRight, MapPin, Info, Home, Users, Check, ChevronDown, ImageDown } from "lucide-react";

// ──────────────────────────────────────────────────────────────────────────
// Observatoire du logement frontalier — Édition 1 : corridor rive gauche → Eaux-Vives.
// DEUX COUCHES : « marché » (sources publiques, La Villa neutre, jamais dans ces chiffres)
//   + « Vu de nos maisons » (données first-party La Villa, ÉTIQUETÉES — src/data/barometre.ts).
// Données France = public/data/observatoire-data-2026.csv ; Genève = observatoire-geneve-2026.csv ;
//   La Villa = observatoire-lavilla-2026.csv.
// Loyer France = STUDIO €/m² d'annonce (Le Figaro, page MAJ 02/06/2026) × 30 m² de référence.
//   3 communes sans studio publié (Bons-en-Chablais, Bonne, Machilly) = loyer 2-pièces (proxy *).
// Genève = marché à DEUX VITESSES : parc en place 35 CHF/m² (OCSTAT 2025) vs annonces ≈ 50 (+44 %).
// Trajets vers Genève-Eaux-Vives, heure de pointe (arrivée ~9h15), relevés Google Maps.
// Cadence = horaire officiel Léman Express 2026.
// ──────────────────────────────────────────────────────────────────────────

type Commune = {
  name: string;
  m2: number; // loyer studio €/m² (Le Figaro 06/2026) ; * si proxy 2-pièces
  mois: number; // = m2 × 30 m² (studio de référence)
  pt: number; // transport public, min (porte-à-porte, pointe)
  velo: number; // vélo, min (voie verte)
  voiture: number; // voiture, min (pointe)
  train: number | null; // Léman Express direct, gare-à-gare (min)
  cadence: number | null; // cadence LEX en pointe (min entre 2 trains vers Genève)
  proxy?: boolean; // studio non publié → loyer 2-pièces
  tram?: boolean; // desservi par le tram (pas de gare LEX)
  expanded?: boolean; // hors corridor immédiat (terminus/élargissement) → exclu des moyennes par palier
};

// Studio de référence : 30 m² (le €/mois isole l'effet du €/m², comme le 37 m² ANIL pour le T1-T2).
const REF_M2 = 30;

const COMMUNES: Commune[] = [
  { name: "Annemasse", m2: 33, mois: 990, pt: 16, velo: 21, voiture: 28, train: 8, cadence: 10 },
  { name: "Ville-la-Grand", m2: 30, mois: 900, pt: 27, velo: 27, voiture: 24, train: 8, cadence: 10 },
  { name: "Ambilly", m2: 34, mois: 1020, pt: 24, velo: 21, voiture: 24, train: 8, cadence: 10 },
  { name: "Gaillard", m2: 33, mois: 990, pt: 37, velo: 21, voiture: 26, train: null, cadence: null, tram: true },
  { name: "Étrembières", m2: 33, mois: 990, pt: 49, velo: 30, voiture: 22, train: null, cadence: null },
  { name: "Vétraz-Monthoux", m2: 32, mois: 960, pt: 68, velo: 32, voiture: 35, train: null, cadence: null },
  { name: "Cranves-Sales", m2: 31, mois: 930, pt: 66, velo: 38, voiture: 35, train: null, cadence: null },
  { name: "Bonne", m2: 23, mois: 690, pt: 52, velo: 49, voiture: 35, train: null, cadence: null, proxy: true },
  { name: "Saint-Cergues", m2: 24, mois: 720, pt: 62, velo: 50, voiture: 30, train: null, cadence: null },
  { name: "Machilly", m2: 23, mois: 690, pt: 30, velo: 50, voiture: 28, train: 22, cadence: 30, proxy: true },
  { name: "Bons-en-Chablais", m2: 21, mois: 630, pt: 35, velo: 63, voiture: 35, train: 28, cadence: 30, proxy: true },
  { name: "Thonon-les-Bains", m2: 24, mois: 720, pt: 50, velo: 112, voiture: 60, train: 43, cadence: 30 },
  { name: "Évian-les-Bains", m2: 30, mois: 900, pt: 59, velo: 148, voiture: 70, train: 52, cadence: 30, expanded: true },
  { name: "Reignier-Ésery", m2: 31, mois: 930, pt: 36, velo: 58, voiture: 30, train: 25, cadence: 30 },
  { name: "La Roche-sur-Foron", m2: 27, mois: 810, pt: 43, velo: 89, voiture: 35, train: 32, cadence: 30 },
  { name: "Bonneville", m2: 21, mois: 630, pt: 54, velo: 99, voiture: 35, train: 48, cadence: 60, expanded: true },
  { name: "Annecy", m2: 29, mois: 870, pt: 88, velo: 171, voiture: 55, train: 63, cadence: 60, expanded: true },
];

const VELO_MAX = 75; // au-delà, le vélo n'est plus un mode du quotidien → « — »
const SITE = "https://www.lavillacoliving.com";
const CSV_URL = "/data/observatoire-data-2026.csv"; // France — corridor (Le Figaro)
const CSV_GENEVA_URL = "/data/observatoire-geneve-2026.csv"; // Genève — deux vitesses (OCSTAT + annonces)
const CSV_LAVILLA_URL = "/data/observatoire-lavilla-2026.csv"; // La Villa — agrégats first-party (couche 2)

const hub = COMMUNES.find((c) => c.name === "Annemasse")!; // 990 € studio, 8 min LEX
// ── Genève, marché à DEUX VITESSES (chiffres FIGÉS — brief §1.1, ne rien recalculer) ──
// Parc en place : OCSTAT 2025, n = 2 294, studios ≤ 37 m², loyer libre, net → médiane 35 CHF/m².
// Annonces (arrivant) : relevé juin 2026, n = 25, Ville de Genève → médiane ≈ 50 CHF/m².
// Écart +44 % (50,4 / 35,0). La médiane arrivant (50,4) ≈ le D9 du stock (51,3).
const GENEVA_STOCK_M2 = 35; // CHF/m², locataire en place (médiane OCSTAT)
const GENEVA_STOCK_CHF = "1 050"; // ≈ 35 × 30 m²
const GENEVA_ANNONCE_M2 = 50; // CHF/m², nouvel arrivant (médiane annonces)
const GENEVA_ANNONCE_CHF = "1 500"; // ≈ 50 × 30 m²
const GENEVA_ECART_PCT = "+44 %"; // figé (50,4 / 35,0)
// Déciles du stock OCSTAT (CHF/m²) : D1 20,6 · Q1 26,3 · médiane 35,0 · Q3 42,9 · D9 51,3 → voir observatoire-geneve-2026.csv.
// Repère transfrontalier « 8 min » : Genève-Eaux-Vives = quartier premium (haut du marché), loyer d'annonce.
const GENEVA_EAUXVIVES_CHF = "1 750"; // CHF/mois, studio Eaux-Vives (relevé Homegate, juin 2026)
// ── Taux de change (brief correction #2, 07/2026) : plus JAMAIS de « parité » €/CHF. ──
// Taux figé de l'édition : 1 € = 0,92 CHF (juillet 2026) — affiché partout où l'on convertit.
// Dérivés (arrondis d'affichage) : 990 € ≈ 910 CHF · 1 750 CHF ≈ 1 900 € · économie 1 750 − 911 ≈ 840 CHF ≈ 910 €
//   · 1 360 CHF ≈ 1 480 € · studio coût complet 1 344 € ≈ 1 236 CHF (≈ 45 €/m² ≈ 41 CHF/m²).
const FX_NOTE_FR = "Conversions au taux 1 € = 0,92 CHF (juillet 2026)";
const FX_NOTE_EN = "Conversions at €1 = CHF 0.92 (July 2026)";
const GENEVA_EAUXVIVES_EUR = "1 900"; // ≈ 1 750 / 0,92
const HUB_CHF = "910"; // ≈ 990 × 0,92
const TRANSFRONT_DELTA_CHF = "840"; // 1 750 − (990 × 0,92 ≈ 911)
const TRANSFRONT_DELTA_EUR = "910"; // ≈ 840 / 0,92
const COLIVING_EUR = "1 480"; // ≈ 1 360 / 0,92
const STUDIO_38M2_EUR = "1 700"; // lecture « à surface équivalente » : 38 m² × 44,8 €/m² (coût complet du studio) ≈ 1 702 €

type ModeKey = "pt" | "velo" | "voiture";
type SortKey = "name" | "mois" | ModeKey;

export function ObservatoireLogementFrontalierPage() {
  const { language } = useLanguage();
  const en = language === "en";

  const [budget, setBudget] = useState(850);
  const [mode, setMode] = useState<ModeKey>("pt");
  const [sortKey, setSortKey] = useState<SortKey>("mois");
  const [sortDir, setSortDir] = useState(1);

  const PAGE_FIRST_PUBLISHED = "2026-06-16";
  const PAGE_LAST_UPDATED = "2026-07-06"; // à caler sur la date réelle de mise en ligne au moment du merge
  const updatedLabel = new Date(PAGE_LAST_UPDATED).toLocaleDateString(en ? "en-US" : "fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  const datasetSchema = buildDatasetSchema({
    name: en
      ? "Cross-border housing observatory — Studio rent × Commute, left-bank Geneva (2026)"
      : "Observatoire du logement frontalier — Loyer studio × Trajet, rive gauche de Genève (2026)",
    description: en
      ? "Advertised studio rent (Observatory survey on Le Figaro Immobilier, June 2026) crossed with commute time to Geneva-Eaux-Vives, for 17 municipalities of the French Genevois along the Léman Express axis, including peak-hour train frequency. Geneva, a two-speed market: sitting tenants 35 CHF/m² (OCSTAT 2025) vs. newcomers ≈ 50 CHF/m² in today's listings (Homegate survey, +44%). Includes first-party aggregates from La Villa Coliving's 3 houses (100+ residents since 2021), clearly labelled. Conversions at €1 = CHF 0.92 (July 2026)."
      : "Loyer d'annonce d'un studio (relevé de l'Observatoire sur Le Figaro Immobilier, juin 2026) croisé au temps de trajet vers Genève-Eaux-Vives, pour 17 communes du Genevois français le long de l'axe Léman Express, avec la cadence des trains en heure de pointe. Genève, marché à deux vitesses : locataire en place 35 CHF/m² (OCSTAT 2025) vs nouvel arrivant ≈ 50 CHF/m² dans les annonces (relevé Homegate, +44 %). Inclut les agrégats first-party des 3 maisons La Villa Coliving (100+ résidents depuis 2021), clairement étiquetés. Conversions au taux 1 € = 0,92 CHF (juillet 2026).",
    url: `${SITE}/observatoire-logement-frontalier-geneve`,
    csvUrls: [`${SITE}${CSV_URL}`, `${SITE}${CSV_GENEVA_URL}`, `${SITE}${CSV_LAVILLA_URL}`],
    datePublished: PAGE_FIRST_PUBLISHED,
    dateModified: PAGE_LAST_UPDATED,
    language: en ? "en" : "fr",
    spatial: COMMUNES.map((c) => c.name),
  });

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: en
      ? "In Geneva, a newcomer pays 44% more per m² than a sitting tenant — cross-border housing observatory"
      : "À Genève, un nouvel arrivant paie +44 % au m² qu'un locataire en place — observatoire du logement frontalier",
    inLanguage: en ? "en" : "fr",
    datePublished: PAGE_FIRST_PUBLISHED,
    dateModified: PAGE_LAST_UPDATED,
    author: { "@type": "Organization", name: "La Villa Coliving", url: SITE },
    publisher: {
      "@type": "Organization",
      name: "La Villa Coliving",
      logo: { "@type": "ImageObject", url: `${SITE}/logos/logo-full.png` },
    },
    mainEntityOfPage: `${SITE}/observatoire-logement-frontalier-geneve`,
  };

  const modeVal = (c: Commune, m: ModeKey): number | null => {
    if (m === "velo") return c.velo > VELO_MAX ? null : c.velo;
    return c[m];
  };

  const sorted = [...COMMUNES].sort((a, b) => {
    if (sortKey === "name") return sortDir * a.name.localeCompare(b.name);
    if (sortKey === "mois") return sortDir * (a.mois - b.mois);
    const va = modeVal(a, sortKey as ModeKey) ?? 9999;
    const vb = modeVal(b, sortKey as ModeKey) ?? 9999;
    return sortDir * (va - vb);
  });
  const inBudget = COMMUNES.filter((c) => c.mois <= budget).length;

  function toggleSort(k: SortKey) {
    if (sortKey === k) setSortDir((d) => -d);
    else {
      setSortKey(k);
      setSortDir(1);
    }
  }

  // Télécharge le graphique signature (SVG inline sérialisé) — bloc presse.
  function downloadScatterSvg() {
    const node = document.getElementById("graphique-loyer-trajet");
    if (!node) return;
    const blob = new Blob([new XMLSerializer().serializeToString(node)], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "observatoire-loyer-trajet-2026.svg";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Renvoi méthodologie : déplie l'accordéon avant que l'ancre ne scrolle dessus.
  function openMethodo() {
    const d = document.getElementById("methodo") as HTMLDetailsElement | null;
    if (d) d.open = true;
  }

  // Légende « source + date » sous CHAQUE tableau/graphique (demande Jérôme 07/07 :
  // les sources sont mélangées → chaque visuel porte la sienne, avec renvoi méthodo).
  const SourceLine = ({ children, center = true }: { children: ReactNode; center?: boolean }) => (
    <p className={`text-[11px] text-[#A8A29E] mt-2 leading-snug ${center ? "text-center" : ""}`}>
      {children}{" "}
      <a href="#methodo" onClick={openMethodo} className="underline underline-offset-2 hover:text-[#A0623C] whitespace-nowrap">
        → {en ? "methodology" : "méthodologie"}
      </a>
    </p>
  );

  // Couleur par palier de loyer studio (sobre, charte La Villa).
  const tier = (mois: number) => (mois <= 750 ? "#6B8E6B" : mois <= 950 ? "#D4A574" : "#A0623C");

  // ── Mini-infographie « Loyer studio × Trajet » (transport public) — l'objet partageable.
  const VW = 800, VH = 470, PADL = 92, PADR = 24, PADT = 80, PADB = 64; // PADT élargi : zone « hors échelle » pour Genève (axe brisé)
  const ptMax = 90, moisMin = 600, moisMax = 1050;
  const sx = (pt: number) => PADL + (Math.min(pt, ptMax) / ptMax) * (VW - PADL - PADR);
  const sy = (mois: number) => PADT + ((moisMax - mois) / (moisMax - moisMin)) * (VH - PADT - PADB);

  // Étiquettes du nuage : TOUTES les communes, placement glouton anti-chevauchement (droite > gauche > haut > bas).
  type LBox = { x1: number; y1: number; x2: number; y2: number };
  const dotPts = COMMUNES.map((c) => ({ name: c.name, x: sx(c.pt), y: sy(c.mois) }));
  const placedBoxes: LBox[] = [];
  const labelPos: Record<string, { lx: number; ly: number; anchor: "start" | "end" | "middle" }> = {};
  [...dotPts]
    .sort((a, b) => a.x - b.x)
    .forEach((d) => {
      const w = d.name.length * 5.6 + 4;
      const cands = [
        { lx: d.x + 9, ly: d.y + 3.5, anchor: "start" as const, box: { x1: d.x + 8, y1: d.y - 5, x2: d.x + 10 + w, y2: d.y + 7 } },
        { lx: d.x - 9, ly: d.y + 3.5, anchor: "end" as const, box: { x1: d.x - 10 - w, y1: d.y - 5, x2: d.x - 8, y2: d.y + 7 } },
        { lx: d.x, ly: d.y - 10, anchor: "middle" as const, box: { x1: d.x - w / 2, y1: d.y - 20, x2: d.x + w / 2, y2: d.y - 8 } },
        { lx: d.x, ly: d.y + 16, anchor: "middle" as const, box: { x1: d.x - w / 2, y1: d.y + 8, x2: d.x + w / 2, y2: d.y + 19 } },
      ];
      const bad = (b: LBox) =>
        placedBoxes.some((p) => !(b.x2 < p.x1 || b.x1 > p.x2 || b.y2 < p.y1 || b.y1 > p.y2)) ||
        dotPts.some((o) => o.name !== d.name && o.x > b.x1 - 1 && o.x < b.x2 + 1 && o.y > b.y1 - 1 && o.y < b.y2 + 1) ||
        b.x1 < PADL - 2 || b.x2 > VW - 4 || b.y1 < PADT - 8 || b.y2 > VH - PADB + 4;
      const chosen = cands.find((c) => !bad(c.box)) ?? cands[0];
      placedBoxes.push(chosen.box);
      labelPos[d.name] = { lx: chosen.lx, ly: chosen.ly, anchor: chosen.anchor };
    });

  const modeBtns: { k: ModeKey; icon: typeof Bus; fr: string; en: string }[] = [
    { k: "pt", icon: Bus, fr: "Transport public", en: "Public transport" },
    { k: "velo", icon: Bike, fr: "Vélo", en: "Bike" },
    { k: "voiture", icon: Car, fr: "Voiture", en: "Car" },
  ];

  return (
    <main className="relative pt-16">
      <SEO
        title={
          en
            ? "Geneva cross-border housing observatory — rents 2026"
            : "Observatoire du logement frontalier Genève — loyers 2026"
        }
        description={
          en
            ? "In Geneva, a newcomer pays 44% more per m² than a sitting tenant. 17 French-Genevois towns ranked by advertised studio rent and commute time. Free open data."
            : "À Genève, un nouvel arrivant paie +44 % au m² qu'un locataire en place. 17 communes du Genevois français classées par loyer et trajet. Données ouvertes."
        }
        image={`${SITE}/images/observatoire-loyer-trajet-2026.png`}
        type="article"
        jsonLd={datasetSchema}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>

      {/* ===== HERO — plein contraste, le chiffre-choc en très grand (brief staging 07/2026) ===== */}
      <section className="bg-[#1C1917] text-white">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-14 lg:pt-24 lg:pb-16 text-center">
          <span className="text-xs text-[#D4A574] uppercase tracking-[0.3em] mb-4 block font-medium">
            {en ? "Cross-border housing observatory · Edition 1" : "Observatoire du logement frontalier · Édition 1"}
          </span>
          <h1
            className="text-4xl md:text-5xl font-light mb-4 leading-tight"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {en ? "Where to live near Geneva " : "Où se loger près de Genève "}
            <span className="text-[#D4A574]">{en ? "without straying far?" : "sans s'éloigner ?"}</span>
          </h1>
          <p className="text-base md:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
            {en
              ? "Rive gauche / Léman Express corridor → Geneva-Eaux-Vives. A studio's advertised rent, mapped against real commute time, across 17 towns on the French side of Geneva."
              : "Corridor rive gauche / Léman Express → Genève-Eaux-Vives. Le loyer d'annonce d'un studio, croisé au temps de trajet réel, pour 17 communes du Genevois français."}
          </p>

          {/* Le chiffre-choc, énorme */}
          <div className="grid sm:grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8 max-w-3xl mx-auto mt-12">
            <div className="text-center sm:text-right">
              <div className="text-5xl md:text-6xl font-light whitespace-nowrap" style={{ fontFamily: "DM Serif Display, serif" }}>
                ≈ {GENEVA_EAUXVIVES_CHF}<span className="text-2xl md:text-3xl ml-2 text-white/70">CHF</span>
              </div>
              <div className="text-sm text-white/60 mt-2">
                {en ? "a studio — Geneva-Eaux-Vives" : "un studio — Genève-Eaux-Vives"}
                <span className="block text-xs text-white/40 mt-0.5">≈ {GENEVA_EAUXVIVES_EUR} €</span>
              </div>
            </div>
            <div className="flex sm:flex-col items-center justify-center gap-1 text-[#D4A574]">
              <Train className="w-6 h-6" />
              <ArrowRight className="w-5 h-5 rotate-90 sm:rotate-0" />
            </div>
            <div className="text-center sm:text-left">
              <div className="text-5xl md:text-6xl font-light whitespace-nowrap" style={{ fontFamily: "DM Serif Display, serif" }}>
                ≈ {hub.mois}<span className="text-2xl md:text-3xl ml-2 text-white/70">€</span>
              </div>
              <div className="text-sm text-white/60 mt-2">
                {en ? "a studio — Annemasse, 8 min away" : "un studio — Annemasse, à 8 min"}
                <span className="block text-xs text-white/40 mt-0.5">≈ {HUB_CHF} CHF</span>
              </div>
            </div>
          </div>
          <p className="mt-9 text-xl md:text-2xl font-semibold text-[#D4A574]">
            {en
              ? `= ≈ CHF ${TRANSFRONT_DELTA_CHF} saved per month (≈ €${TRANSFRONT_DELTA_EUR}), on the French side.`
              : `= ≈ ${TRANSFRONT_DELTA_CHF} CHF d'économie par mois (≈ ${TRANSFRONT_DELTA_EUR} €), côté France.`}
          </p>
          <p className="mt-7 text-xs text-white/40">
            {en
              ? `Updated ${updatedLabel} · Sources: Observatory surveys on Homegate (Geneva) & Le Figaro Immobilier (France), June 2026 · ${FX_NOTE_EN} `
              : `Mis à jour le ${updatedLabel} · Sources : relevés de l'Observatoire sur Homegate (Genève) & Le Figaro Immobilier (France), juin 2026 · ${FX_NOTE_FR} `}
            <a href="#methodo" onClick={openMethodo} className="underline underline-offset-2 hover:text-white/70 whitespace-nowrap">
              → {en ? "methodology" : "méthodologie"}
            </a>
          </p>
        </div>
      </section>

      {/* ===== LES CHIFFRES À RETENIR — 4 stat-cards « lift-and-quote » ===== */}
      <section className="py-10 lg:py-12 bg-white border-b border-[#F0EEE9]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#A0623C] text-center mb-6">
            {en ? "The figures to remember" : "Les chiffres à retenir"}
          </h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              {
                fig: GENEVA_ECART_PCT,
                label: en
                  ? "what a newcomer pays on top of a sitting tenant in Geneva"
                  : "ce qu'un nouvel arrivant paie de plus qu'un locataire installé à Genève",
              },
              {
                fig: `≈ ${TRANSFRONT_DELTA_CHF} CHF/${en ? "mo" : "mois"}`,
                label: en
                  ? `the saving on the French side (≈ €${TRANSFRONT_DELTA_EUR}), 8 min from Geneva by train`
                  : `l'économie côté France (≈ ${TRANSFRONT_DELTA_EUR} €), à 8 min de Genève en train`,
              },
              {
                fig: "970 €",
                label: en
                  ? "average studio under 30 min from Geneva (Léman Express)"
                  : "studio moyen à moins de 30 min de Genève (Léman Express)",
              },
            ].map((s) => (
              <div key={s.fig} className="bg-[#FAF9F6] rounded-xl p-4 sm:p-5 text-center">
                <p className="text-2xl sm:text-3xl font-medium text-[#1C1917] whitespace-nowrap">{s.fig}</p>
                <p className="text-xs text-[#57534E] mt-1.5 leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
          <SourceLine>
            {en
              ? `Sources: OCSTAT 2025 (sitting stock) · Observatory surveys on Homegate & Le Figaro Immobilier, June 2026 · ${FX_NOTE_EN}.`
              : `Sources : OCSTAT 2025 (parc en place) · relevés de l'Observatoire sur Homegate & Le Figaro Immobilier, juin 2026 · ${FX_NOTE_FR}.`}
          </SourceLine>
        </div>
      </section>

      {/* ===== SECTION VEDETTE — Genève, marché à deux vitesses ===== */}
      <section className="py-12 lg:py-16 bg-[#FAF9F6]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white border border-[#E7E5E4] rounded-2xl overflow-hidden shadow-sm">
            <div className="h-1.5 bg-[#D4A574]" />
            <div className="p-6 sm:p-9">
              <span className="text-xs text-[#A0623C] uppercase tracking-[0.2em] font-medium">
                {en ? "Key finding" : "Constat principal"}
              </span>
              <h2
                className="text-2xl md:text-3xl font-light text-[#1C1917] mt-2 mb-5 leading-snug"
                style={{ fontFamily: "DM Serif Display, serif" }}
              >
                {en ? "A two-speed market" : "Un marché à deux vitesses"}
              </h2>
              <div className="space-y-4 text-[#44403C] leading-relaxed">
                <p>
                  {en ? (
                    <>In Geneva, a studio's rent depends heavily on how long the lease has been running. Sitting tenants pay a median of <strong className="text-[#1C1917]">CHF 35/m²</strong>, about <strong className="text-[#1C1917]">CHF {GENEVA_STOCK_CHF} per month</strong> — a level held down by protection on existing leases. Current advertised rents stand at <strong className="text-[#1C1917]">about CHF 50/m²</strong> (<strong className="text-[#1C1917]">~CHF {GENEVA_ANNONCE_CHF} per month</strong>), <strong className="text-[#A0623C]">44% higher</strong>.</>
                  ) : (
                    <>À Genève, le loyer d'un studio dépend fortement de l'ancienneté du bail. Les locataires en place paient une médiane de <strong className="text-[#1C1917]">35 CHF/m²</strong>, soit environ <strong className="text-[#1C1917]">{GENEVA_STOCK_CHF} CHF par mois</strong> — un niveau maintenu bas par la protection des baux en cours. Les loyers d'annonce du jour, eux, s'établissent à <strong className="text-[#1C1917]">environ 50 CHF/m²</strong> (<strong className="text-[#1C1917]">~{GENEVA_ANNONCE_CHF} CHF par mois</strong>), soit <strong className="text-[#A0623C]">44 % de plus</strong>.</>
                  )}
                </p>
              </div>

              {/* Pull-quote OCSTAT — la citation en grand, pas noyée dans un paragraphe */}
              <blockquote className="border-l-4 border-[#D4A574] pl-5 sm:pl-6 my-7">
                <p className="text-lg md:text-xl text-[#44403C] leading-relaxed italic" style={{ fontFamily: "DM Serif Display, serif" }}>
                  {en
                    ? "“Rents on recently concluded leases are generally substantially higher than those paid by people who have occupied the same flat for a long time.”"
                    : "« Les loyers des baux conclus récemment sont en général sensiblement supérieurs à ceux payés par des personnes qui occupent le même appartement depuis longtemps. »"}
                </p>
                <footer className="text-xs text-[#A8A29E] mt-2 not-italic">
                  —{" "}
                  <a
                    href="https://statistique.ge.ch/prestations/calcul_loyer.asp"
                    target="_blank"
                    rel="noopener"
                    className="underline underline-offset-2 hover:text-[#A0623C] transition-colors"
                  >
                    OCSTAT, {en ? "Cantonal Statistical Office (Geneva), rent calculator" : "Office cantonal de la statistique (Genève), calculateur de loyers"}
                  </a>
                </footer>
              </blockquote>

              {/* Mini-graphe : 35 vs 50 CHF/m², repère D9 du parc en place = 51,3 (chiffres figés) */}
              <div className="my-7">
                <svg
                  viewBox="0 0 420 270"
                  className="w-full h-auto"
                  role="img"
                  aria-label={
                    en
                      ? "Two bars: median studio rent per m² in Geneva — sitting tenant 35 CHF/m² versus newcomer about 50 CHF/m², +44%. The newcomer median nearly reaches the 9th decile of sitting leases (51.3)."
                      : "Deux barres : loyer médian d'un studio au m² à Genève — locataire en place 35 CHF/m² contre nouvel arrivant environ 50 CHF/m², +44 %. La médiane arrivant frôle le 9e décile des baux en place (51,3)."
                  }
                >
                  <rect x="0" y="0" width="420" height="270" fill="#FAF9F6" rx="8" />
                  <line x1="60" y1="210" x2="400" y2="210" stroke="#E7E5E4" strokeWidth="1" />
                  {/* D9 du parc en place = 51,3 */}
                  <line x1="60" y1="42" x2="400" y2="42" stroke="#A0623C" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
                  <text x="64" y="37" fontSize="10.5" fill="#A0623C">
                    {en ? "Top 10% of sitting leases (D9) · 51.3 CHF/m²" : "Les 10 % de baux en place les plus chers (D9) · 51,3 CHF/m²"}
                  </text>
                  {/* Barre « en place » = 35 */}
                  <rect x="110" y="96" width="80" height="114" rx="3" fill="#6B8E6B" />
                  <text x="150" y="134" textAnchor="middle" fontSize="19" fontWeight="700" fill="#ffffff">{GENEVA_STOCK_M2}</text>
                  <text x="150" y="228" textAnchor="middle" fontSize="11" fill="#57534E">{en ? "Sitting tenant" : "En place"}</text>
                  <text x="150" y="242" textAnchor="middle" fontSize="9.5" fill="#A8A29E">CHF/m²</text>
                  {/* Barre « annonce » = 50 */}
                  <rect x="270" y="46" width="80" height="164" rx="3" fill="#A0623C" />
                  <text x="310" y="84" textAnchor="middle" fontSize="19" fontWeight="700" fill="#ffffff">≈ {GENEVA_ANNONCE_M2}</text>
                  <text x="310" y="228" textAnchor="middle" fontSize="11" fill="#57534E">{en ? "Newcomer" : "Arrivant"}</text>
                  <text x="310" y="242" textAnchor="middle" fontSize="9.5" fill="#A8A29E">CHF/m²</text>
                  <text x="230" y="150" textAnchor="middle" fontSize="16" fontWeight="700" fill="#A0623C">{GENEVA_ECART_PCT}</text>
                  <text x="210" y="263" textAnchor="middle" fontSize="9.5" fill="#A8A29E">
                    {en ? "Medians — City of Geneva, studios ≤ 37 m²" : "Médianes — Ville de Genève, studios ≤ 37 m²"}
                  </text>
                </svg>
              </div>

              <div className="space-y-4 text-[#44403C] leading-relaxed">
                <p>
                  {en ? (
                    <>A measurable consequence: per square metre, the median advertised rent sits at the <strong className="text-[#1C1917]">9th decile</strong> of the occupied stock — meaning a newcomer pays more than nearly <strong className="text-[#1C1917]">nine in ten sitting tenants</strong>.</>
                  ) : (
                    <>Conséquence mesurable : au mètre carré, un loyer d'annonce médian se situe au niveau du <strong className="text-[#1C1917]">9ᵉ décile</strong> du parc en place — autrement dit, un nouvel arrivant paie davantage que près de <strong className="text-[#1C1917]">neuf locataires installés sur dix</strong>.</>
                  )}
                </p>
              </div>
              {/* Côté France : un marché ouvert — argument STRUCTUREL (pas de claim quantitatif
                  non sourcé sur l'écart annonce/pratiqué) + désamorçage explicite du 33 vs 22,6
                  (les deux sources françaises sont des loyers d'ANNONCE — demande Jérôme 07/07). */}
              <div className="border-l-4 border-[#6B8E6B] bg-[#FAF9F6] rounded-r-xl p-5 sm:p-6 mt-7">
                <h3 className="text-base font-semibold text-[#1C1917] mb-2">
                  {en ? "And on the French side? A gap exists too — not the lock" : "Et côté France ? Un écart existe aussi — pas le verrou"}
                </h3>
                <p className="text-sm text-[#57534E] leading-relaxed">
                  {en
                    ? "A gap between sitting tenants' rents and newcomers' rents exists on the French side too — as on any market where running leases are indexed (IRL) while the market climbs. This observatory does not measure it: there is no public equivalent of OCSTAT for the sitting stock of the French Genevois. The difference with Geneva is one of magnitude and nature: the Geneva gap is measured — the median newcomer pays per m² as much as the top 10% of sitting leases — and it is sustained by a tenancy-protection mechanism with no French equivalent. For a household moving in, the relevant comparison remains, on both sides, advertised rents: ~CHF 1,500 in Geneva versus the French advertised rents on this page."
                    : "Un écart entre les loyers des locataires en place et ceux des arrivants existe aussi côté France — comme sur tout marché où les baux en cours sont indexés (IRL) pendant que le marché monte. Cet observatoire ne le mesure pas : il n'existe pas, pour le Genevois français, d'équivalent public de l'OCSTAT sur le parc en place. La différence avec Genève est d'ampleur et de nature : l'écart genevois, lui, est mesuré — l'arrivant médian y paie au m² autant que les 10 % de baux en place les plus chers — et il est entretenu par un mécanisme de protection des baux sans équivalent côté France. Pour un ménage qui s'installe, la comparaison pertinente reste, des deux côtés, celle des loyers d'annonce : ~1 500 CHF à Genève contre les loyers d'annonce français de cette page."}
                </p>
              </div>
              <div className="mt-5">
                <SourceLine center={false}>
                  {en
                    ? "Sources: sitting-tenant rents — OCSTAT 2025 (2,294 studios); advertised rents — Observatory survey on Homegate, June 2026 (n = 25). Net rents (excl. heating), City of Geneva."
                    : "Sources : loyers du parc en place — OCSTAT 2025 (2 294 studios) ; loyers d'annonce — relevé de l'Observatoire sur Homegate, juin 2026 (n = 25). Loyers nets (hors chauffage), Ville de Genève."}
                </SourceLine>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== LA DESSERTE, PAS LA DISTANCE — graphique signature (insight annoté) + paliers ===== */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-light text-[#1C1917] mb-3 text-center" style={{ fontFamily: "DM Serif Display, serif" }}>
            {en ? "The deciding factor is rail service, not distance" : "Le facteur déterminant : la desserte, pas la distance"}
          </h2>
          <p className="text-sm text-[#57534E] text-center mb-8 max-w-2xl mx-auto leading-relaxed">
            {en
              ? "Rent does not fall linearly with distance. Beyond the first ring around Annemasse, it eases and then levels off: moving further out no longer meaningfully lowers it. The deciding factor is rail service — on the Léman Express, some of the cheapest towns remain within 30 minutes of Geneva by direct train (Bons-en-Chablais: €630, 28 minutes)."
              : "Le loyer ne décroît pas linéairement avec l'éloignement. Passé la première couronne autour d'Annemasse, il se détend puis se stabilise : s'éloigner davantage ne réduit plus sensiblement le niveau. Le facteur déterminant est la desserte ferroviaire — sur le Léman Express, certaines des communes les moins chères restent à moins de 30 minutes de Genève en train direct (Bons-en-Chablais : 630 €, 28 minutes)."}
          </p>
          <svg
            id="graphique-loyer-trajet"
            viewBox={`0 0 ${VW} ${VH}`}
            className="w-full h-auto"
            role="img"
            aria-label={
              en
                ? "Scatter chart: monthly studio rent versus public-transport time to Geneva-Eaux-Vives for 17 municipalities."
                : "Nuage de points : loyer mensuel d'un studio selon le temps en transport public vers Genève-Eaux-Vives pour 17 communes."
            }
          >
            <rect x="0" y="0" width={VW} height={VH} fill="#FAF9F6" rx="8" />
            {/* axes */}
            <line x1={PADL} y1={VH - PADB} x2={VW - PADR} y2={VH - PADB} stroke="#E7E5E4" strokeWidth="1" />
            <line x1={PADL} y1={PADT} x2={PADL} y2={VH - PADB} stroke="#E7E5E4" strokeWidth="1" />
            {[600, 700, 800, 900, 1000].map((m) => (
              <g key={m}>
                <text x={PADL - 10} y={sy(m) + 4} textAnchor="end" fontSize="11" fill="#A8A29E">{m} €</text>
                <line x1={PADL} y1={sy(m)} x2={VW - PADR} y2={sy(m)} stroke="#F0EEE9" strokeWidth="1" />
              </g>
            ))}
            {[15, 30, 45, 60, 75, 90].map((t) => (
              <text key={t} x={sx(t)} y={VH - PADB + 18} textAnchor="middle" fontSize="11" fill="#A8A29E">{t}</text>
            ))}
            <text x={(VW + PADL) / 2} y={VH - 12} textAnchor="middle" fontSize="12" fill="#57534E">
              {en ? "Public-transport time to Eaux-Vives (min) →" : "Temps en transport public vers Eaux-Vives (min) →"}
            </text>
            <text x={20} y={VH / 2} textAnchor="middle" fontSize="12" fill="#57534E" transform={`rotate(-90 20 ${VH / 2})`}>
              {en ? "Monthly studio rent (€)" : "Loyer mensuel d'un studio (€)"}
            </text>
            {/* ── Axe brisé : Genève-Eaux-Vives en CHF, hors de l'échelle €, nettement détaché au-dessus du nuage France ── */}
            <polyline points={`${PADL - 5},80 ${PADL + 5},77 ${PADL - 5},74 ${PADL + 5},71 ${PADL - 5},68`} fill="none" stroke="#A8A29E" strokeWidth="1.5" />
            <g>
              <circle cx={PADL} cy={48} r="6" fill="#1C1917" />
              <text x={PADL + 9} y={44} fontSize="11" fontWeight="600" fill="#1C1917">Genève-Eaux-Vives</text>
              <text x={PADL + 9} y={58} fontSize="10" fill="#A0623C">≈ {GENEVA_EAUXVIVES_CHF} CHF (≈ {GENEVA_EAUXVIVES_EUR} €) · 0 min</text>
            </g>
            {/* points — toutes les communes étiquetées */}
            {COMMUNES.map((c) => {
              const x = sx(c.pt), y = sy(c.mois);
              const lp = labelPos[c.name];
              return (
                <g key={c.name}>
                  <circle cx={x} cy={y} r="6" fill={tier(c.mois)} stroke="#fff" strokeWidth="1.5" />
                  <text x={lp.lx} y={lp.ly} textAnchor={lp.anchor} fontSize="10.5" fill="#44403C">{c.name}</text>
                </g>
              );
            })}
            {/* Insight écrit sur le graphique (brief staging) — bande libre à droite, entre 750 et 850 € */}
            <text x={VW - PADR - 6} y={268} textAnchor="end" fontSize="13" fontStyle="italic" fill="#A0623C">
              {en ? "Moving further out no longer lowers the rent —" : "S'éloigner ne fait plus baisser le loyer —"}
            </text>
            <text x={VW - PADR - 6} y={286} textAnchor="end" fontSize="13" fontStyle="italic" fill="#A0623C">
              {en ? "the rail line matters more than the kilometres." : "la desserte compte plus que les kilomètres."}
            </text>
            {/* logo + url (objet qui circule) */}
            <text x={VW - PADR} y={26} textAnchor="end" fontSize="12" fill="#A8A29E">lavillacoliving.com</text>
          </svg>
          <p className="text-center text-xs text-[#A8A29E] mt-3">
            {en
              ? "Each dot = a French municipality (rent in €). Geneva-Eaux-Vives (in CHF) sits off the € scale, above the axis break. Lower-right = further & cheaper. La Villa Coliving, neutral editor."
              : "Chaque point = une commune française (loyer en €). Genève-Eaux-Vives (en CHF) est hors échelle €, au-dessus de la rupture d'axe. En bas à droite = plus loin et moins cher. La Villa Coliving, éditrice neutre."}
          </p>
          <SourceLine>
            {en
              ? `Sources: French rents = Observatory survey on Le Figaro Immobilier, June 2026 · Geneva benchmark = Observatory survey on Homegate, June 2026 · commutes = online maps & official Léman Express 2026 timetable · ${FX_NOTE_EN}.`
              : `Sources : loyers France = relevé de l'Observatoire sur Le Figaro Immobilier, juin 2026 · repère Genève = relevé de l'Observatoire sur Homegate, juin 2026 · trajets = cartes en ligne & horaire officiel Léman Express 2026 · ${FX_NOTE_FR}.`}
          </SourceLine>

          {/* Moyennes par palier de trajet (élargissement exclu) */}
          <div className="grid sm:grid-cols-3 gap-4 mt-10">
            {[
              { lo: 0, hi: 30, label: en ? "Under 30 min" : "Moins de 30 min" },
              { lo: 30, hi: 45, label: "30–45 min" },
              { lo: 45, hi: 999, label: en ? "45 min and beyond" : "45 min et plus" },
            ].map((band) => {
              // Moyennes par palier : on EXCLUT les communes d'élargissement (hors corridor immédiat).
              const list = COMMUNES.filter((c) => c.pt >= band.lo && c.pt < band.hi && !c.expanded);
              const avg = list.length ? Math.round(list.reduce((s, c) => s + c.mois, 0) / list.length) : 0;
              return (
                <div key={band.label} className="bg-[#FAF9F6] rounded-xl p-5 text-center">
                  <p className="text-xs text-[#A8A29E] uppercase tracking-wider">{band.label}</p>
                  <p className="text-3xl font-medium text-[#1C1917] my-1">{avg} €</p>
                  <p className="text-xs text-[#57534E]">
                    {en ? "avg. studio · " : "studio moyen · "}
                    {list.length} {en ? "towns" : "communes"}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-[#A8A29E] mt-4 text-center">
            {en
              ? "Band averages exclude expansion towns (Annecy, Évian, Bonneville), which sit outside the immediate corridor."
              : "Les moyennes par palier excluent les communes d'élargissement (Annecy, Évian, Bonneville), hors corridor immédiat."}
          </p>
          <SourceLine>
            {en
              ? "Source: Observatory survey on the Le Figaro Immobilier portal, June 2026."
              : "Source : relevé de l'Observatoire sur le portail Le Figaro Immobilier, juin 2026."}
          </SourceLine>
        </div>
      </section>

      {/* ===== TABLEAU INTERACTIF ===== */}
      <section className="py-12 lg:py-16 bg-[#FAF9F6]">
        <div className="max-w-4xl mx-auto px-6">
          {/* Intro de l'outil interactif */}
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A0623C] text-center mb-2">
            {en ? "The exploration tool" : "L'outil d'exploration"}
          </p>
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1917] mb-3 text-center"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {en ? "Find your town in three steps" : "Trouve ta commune en trois gestes"}
          </h2>
          <p className="text-sm text-[#78716C] text-center mb-8 max-w-2xl mx-auto">
            {en
              ? "Set your budget, pick how you commute, and read the table: for every town in the corridor, a studio's rent and the real time to reach Geneva-Eaux-Vives."
              : "Fixe ton budget, choisis ton mode de transport, et lis le tableau : pour chaque commune du corridor, le loyer d'un studio et le temps réel pour rejoindre Genève-Eaux-Vives."}
          </p>

          {/* ÉTAPE 1 — curseur budget */}
          <div className="bg-white border border-[#E7E5E4] rounded-xl p-5 mb-5">
            <p className="text-sm mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#D4A574] mr-2">{en ? "Step 1" : "Étape 1"}</span>
              <span className="font-semibold text-[#44403C]">{en ? "Set your monthly budget with the slider — towns over budget fade out." : "Définis ton budget mensuel avec le curseur — les communes hors budget se grisent."}</span>
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <label htmlFor="budget" className="text-sm text-[#57534E] whitespace-nowrap flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#D4A574]" />
                {en ? "My housing budget" : "Mon budget logement"}
              </label>
              <input
                id="budget"
                type="range"
                min={600}
                max={2000}
                step={50}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="flex-1 min-w-[160px] accent-[#D4A574]"
              />
              <span className="text-base font-medium text-[#1C1917] whitespace-nowrap min-w-[96px] text-right">
                {budget} €/{en ? "mo" : "mois"}
              </span>
            </div>
            <p className="text-sm text-[#57534E] mt-2">
              <span className="font-medium text-[#1C1917]">{inBudget}</span>{" "}
              {en
                ? `of 17 municipalities within budget (studio rent).`
                : `communes sur 17 dans ton budget (loyer d'un studio).`}
              {budget >= 1500 && (
                <span className="text-[#A0623C]">
                  {en
                    ? " — at this budget you'd rent a studio in Geneva itself (median asking rent)."
                    : " — à ce budget, tu paierais un studio à Genève même (médiane des annonces)."}
                </span>
              )}
            </p>
          </div>

          {/* ÉTAPE 2 — filtre mode */}
          <p className="text-sm mb-3 mt-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#D4A574] mr-2">{en ? "Step 2" : "Étape 2"}</span>
            <span className="font-semibold text-[#44403C]">{en ? "Choose how you commute" : "Choisis ton mode de déplacement"}</span>
          </p>
          <div className="flex items-center gap-2 flex-wrap mb-6">
            {modeBtns.map(({ k, icon: Icon, fr, en: enL }) => {
              const active = mode === k;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    setMode(k);
                    setSortKey(k);
                    setSortDir(1);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border transition-colors ${
                    active
                      ? "bg-[#D4A574] text-white border-[#D4A574]"
                      : "bg-white text-[#57534E] border-[#E7E5E4] hover:border-[#D4A574]"
                  }`}
                  aria-pressed={active}
                >
                  <Icon className="w-4 h-4" />
                  {en ? enL : fr}
                </button>
              );
            })}
          </div>

          {/* ÉTAPE 3 — tableau (toutes les colonnes restent dans le DOM = lisible sans JS / crawlable) */}
          <p className="text-sm mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#D4A574] mr-2">{en ? "Step 3" : "Étape 3"}</span>
            <span className="font-semibold text-[#44403C]">{en ? "Find the town that fits you — click a column header to sort." : "Trouve la commune qui te correspond — clique sur un en-tête de colonne pour trier."}</span>
          </p>
          <div className="overflow-x-auto bg-white border border-[#E7E5E4] rounded-xl">
            <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr className="border-b border-[#E7E5E4] text-left">
                  <Th onClick={() => toggleSort("name")}>{en ? "Municipality" : "Commune"}</Th>
                  <Th onClick={() => toggleSort("mois")} right>{en ? "Studio €/mo" : "Studio €/mois"}</Th>
                  <Th onClick={() => toggleSort("pt")} right active={mode === "pt"}>
                    <Bus className="inline w-3.5 h-3.5 mb-0.5" /> <span className="hidden sm:inline">Transports&nbsp;publics</span>
                  </Th>
                  <Th onClick={() => toggleSort("velo")} right active={mode === "velo"}>
                    <Bike className="inline w-3.5 h-3.5 mb-0.5" />
                  </Th>
                  <Th onClick={() => toggleSort("voiture")} right active={mode === "voiture"}>
                    <Car className="inline w-3.5 h-3.5 mb-0.5" />
                  </Th>
                </tr>
              </thead>
              <tbody>
                {/* Repère Genève-Eaux-Vives : 0 trajet, loyer CHF marché (toujours en tête, hors filtre budget) */}
                <tr className="border-b border-[#E7E5E4]" style={{ background: "#F7F1E8" }}>
                  <td className="px-3 py-3 text-[#1C1917] whitespace-nowrap font-medium">
                    Genève-Eaux-Vives
                    <span className="ml-1.5 text-[10px] uppercase tracking-wider text-[#A0623C]">({en ? "reference" : "repère"})</span>
                  </td>
                  <td className="px-3 py-3 text-right font-medium text-[#1C1917] whitespace-nowrap">≈ {GENEVA_EAUXVIVES_CHF}&nbsp;CHF*</td>
                  <td className="px-3 py-3 text-right text-[#78716C]">0 min</td>
                  <td className="px-3 py-3 text-right text-[#78716C]">0 min</td>
                  <td className="px-3 py-3 text-right text-[#78716C]">0 min</td>
                </tr>
                {sorted.map((c) => {
                  const ok = c.mois <= budget;
                  // Contraste budget : vert charte doux (~10 %) + liseré à gauche pour les communes
                  // DANS le budget ; retrait renforcé (opacité 0.45) pour les autres. Le repère
                  // Genève-Eaux-Vives (ligne au-dessus) reste neutre. Mise à jour immédiate au curseur.
                  return (
                    <tr
                      key={c.name}
                      className={`border-b border-[#F0EEE9] last:border-0 border-l-[3px] transition-colors ${
                        ok ? "border-l-[#6B8E6B] bg-[#6B8E6B]/10" : "border-l-transparent"
                      }`}
                      style={{ opacity: ok ? 1 : 0.45 }}
                    >
                      <td className="px-3 py-3 text-[#1C1917] whitespace-nowrap">
                        {ok && <span className="text-[#6B8E6B] mr-1.5">✓</span>}
                        {c.name}
                        {c.proxy && <span className="text-[#A8A29E]">&nbsp;*</span>}
                        {c.expanded && <span className="text-[#A8A29E]">&nbsp;°</span>}
                      </td>
                      <td className="px-3 py-3 text-right font-medium text-[#1C1917] whitespace-nowrap">{c.mois} €</td>
                      <TransportCell c={c} en={en} active={mode === "pt"} />
                      <Td active={mode === "velo"}>{c.velo > VELO_MAX ? "—" : `${c.velo} min`}</Td>
                      <Td active={mode === "voiture"}>{c.voiture} min</Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* légende cadence LEX */}
          <div className="flex items-center gap-4 flex-wrap mt-3 text-xs text-[#78716C]">
            <span className="text-[#A8A29E]">{en ? "Léman Express frequency (peak):" : "Cadence Léman Express (pointe) :"}</span>
            <span className="inline-flex items-center gap-1"><span style={{ color: "#6B8E6B" }}>●</span> ≤ 15 min</span>
            <span className="inline-flex items-center gap-1"><span style={{ color: "#D4A574" }}>●</span> ~30 min</span>
            <span className="inline-flex items-center gap-1"><span style={{ color: "#A0623C" }}>●</span> {en ? "~1/h" : "~1 train/h"}</span>
          </div>

          <p className="text-xs text-[#A8A29E] mt-3 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            {en
              ? "Public transport: when a town is on the Léman Express, we show the direct station-to-station time (with peak frequency, dot) plus the real door-to-door time; otherwise tram/bus door-to-door, at morning peak (arrival ~9:15). “—” bike = too far to cycle daily."
              : "Transports publics : si la commune est sur le Léman Express, on affiche le temps direct gare-à-gare (avec la cadence en pointe, pastille) + le porte-à-porte réel ; sinon tram/bus porte-à-porte, à l'heure de pointe (arrivée ~9h15). « — » vélo = trop loin au quotidien."}
          </p>
          <p className="text-xs text-[#A8A29E] mt-2">
            {en
              ? `* Geneva reference: advertised studio rent in Eaux-Vives — a premium 8-minute neighbourhood — ≈ 1,750 CHF/mo, i.e. ≈ €${GENEVA_EAUXVIVES_EUR} at the July 2026 rate (Observatory survey on Homegate, June 2026, excluding student/furnished lets). City-wide, the median asking rent is lower (≈ 1,500 CHF). “*” next to a French town = studio not published by Le Figaro, 2-room rent shown instead.`
              : `* Repère Genève : loyer d'annonce d'un studio à Eaux-Vives — quartier premium à 8 min — ≈ 1 750 CHF/mois, soit ≈ ${GENEVA_EAUXVIVES_EUR} € au taux de juillet 2026 (relevé de l'Observatoire sur Homegate, juin 2026, hors logements étudiants/meublés). À l'échelle de toute la ville, la médiane des annonces est plus basse (≈ 1 500 CHF). « * » devant une commune française = studio non publié par Le Figaro, loyer 2-pièces affiché.`}
          </p>
          <p className="text-xs text-[#A8A29E] mt-2">
            {en
              ? "° Expansion town (Annecy, Évian, Bonneville): outside the immediate corridor — excluded from the commute-band averages above, but kept in the table."
              : "° Commune d'élargissement (Annecy, Évian, Bonneville) : hors corridor immédiat — exclue des moyennes par palier ci-dessus, mais conservée dans le tableau."}
          </p>
          <SourceLine>
            {en
              ? `Sources: French rents = Observatory survey on Le Figaro Immobilier, June 2026 · Geneva-Eaux-Vives benchmark = Observatory survey on Homegate, June 2026 · commutes = online maps & official Léman Express 2026 timetable · ${FX_NOTE_EN}.`
              : `Sources : loyers France = relevé de l'Observatoire sur Le Figaro Immobilier, juin 2026 · repère Genève-Eaux-Vives = relevé de l'Observatoire sur Homegate, juin 2026 · trajets = cartes en ligne & horaire officiel Léman Express 2026 · ${FX_NOTE_FR}.`}
          </SourceLine>
        </div>
      </section>

      {/* ===== VU DE NOS MAISONS — données first-party La Villa (couche 2, ENCADRÉ dédié
           pour séparer visuellement l'observatoire des données internes — demande Jérôme 07/2026) ===== */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="border border-[#E7E5E4] rounded-2xl overflow-hidden shadow-sm">
            <div className="h-1.5 bg-[#D4A574]" />
            <div className="bg-[#FAF9F6] p-5 sm:p-8">
          <div className="text-center mb-8">
            <span className="text-xs text-[#A0623C] uppercase tracking-[0.2em] font-medium">
              {en ? "First-party data" : "Données first-party"}
            </span>
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1917] mt-2 mb-3"
              style={{ fontFamily: "DM Serif Display, serif" }}
            >
              {en ? "Seen from our houses" : "Vu de nos maisons"}
            </h2>
            <p className="inline-flex items-center gap-2 text-xs text-[#57534E] bg-white border border-[#E7E5E4] rounded-full px-4 py-1.5">
              <Home className="w-3.5 h-3.5 text-[#D4A574]" />
              {en
                ? `La Villa data · ${BAROMETRE.housesCount} houses · ${BAROMETRE.roomsCount} rooms · ${BAROMETRE.residentsCovered} residents since October 2021`
                : `Données La Villa · ${BAROMETRE.housesCount} maisons · ${BAROMETRE.roomsCount} chambres · ${BAROMETRE.residentsCovered} résidents depuis octobre 2021`}
            </p>
            <p className="text-sm text-[#78716C] max-w-2xl mx-auto mt-4 leading-relaxed">
              {en
                ? "Alongside the market data above, the aggregated and anonymised figures from our three houses document one specific segment: the all-inclusive coliving room. They are labelled “La Villa” throughout."
                : "En complément des données de marché ci-dessus, les chiffres agrégés et anonymisés de nos trois maisons documentent un segment précis : la chambre en coliving tout inclus. Ils sont étiquetés « La Villa » partout."}
            </p>
          </div>

          {/* En bref — les chiffres La Villa (synthèse de l'encadré) */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A0623C] text-center mb-4">
              {en ? "At a glance — our 2026 figures" : "En bref — nos chiffres 2026"}
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  fig: en ? `CHF ${BAROMETRE.rentMedianChf}` : `${BAROMETRE.rentMedianChf} CHF`,
                  label: en ? `per month, a room all-inclusive (≈ €${COLIVING_EUR} · 2026 median)` : `par mois, chambre tout compris (≈ ${COLIVING_EUR} € · médiane 2026)`,
                },
                {
                  fig: `≈ ${BAROMETRE.chfPerM2AllIn} CHF/m²`,
                  label: en ? `all-inclusive, ≈ ${BAROMETRE.m2PerResident} m² per resident` : `tout compris, ≈ ${BAROMETRE.m2PerResident} m² par résident`,
                },
                {
                  fig: `${BAROMETRE.tenureAvgMonths} ${en ? "months" : "mois"}`,
                  label: en ? "average length of stay" : "durée moyenne de séjour",
                },
                {
                  fig: "98-99 %",
                  label: en ? "average occupancy since Oct. 2021" : "occupation moyenne depuis oct. 2021",
                },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-[#E7E5E4] rounded-xl p-3 sm:p-4 text-center">
                  <p className="text-lg sm:text-2xl font-medium text-[#1C1917] whitespace-nowrap">{s.fig}</p>
                  <p className="text-xs text-[#57534E] mt-1 leading-snug">{s.label}</p>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[#A8A29E] text-center mt-3">
              {en
                ? "1,360 CHF = median of current rents (leases signed at different dates); today's entry price for a room is 1,380 CHF — detail in the methodology."
                : "1 360 CHF = médiane des loyers en cours (baux signés à des dates différentes) ; le prix d'entrée actuel d'une chambre est de 1 380 CHF — détail en méthodologie."}
            </p>
            <SourceLine>
              {en
                ? "Source: La Villa Coliving internal data — 2026 medians and aggregates (3 houses, 29 rooms)."
                : "Source : données internes La Villa Coliving — médianes et agrégats 2026 (3 maisons, 29 chambres)."}
            </SourceLine>
          </div>

          {/* A — Le m² tout compris (finding) + spectre 4 barres */}
          <div className="bg-white border border-[#E7E5E4] rounded-xl p-6 sm:p-8 mb-6">
            <h3 className="text-xl md:text-2xl font-light text-[#1C1917] mb-4" style={{ fontFamily: "DM Serif Display, serif" }}>
              {en ? "The all-inclusive square metre" : "Le mètre carré tout compris"}
            </h3>
            <p className="text-sm text-[#44403C] leading-relaxed">
              {en ? (
                <>A coliving room rents for a median of <strong className="text-[#1C1917]">CHF {BAROMETRE.rentMedianChf} per month, all-inclusive</strong> (2026 median of current rents in our houses). Relative to the space actually available — a private room of {BAROMETRE.roomSizeMin} to {BAROMETRE.roomSizeMax} m² plus shared living space, i.e. <strong className="text-[#1C1917]">≈ {BAROMETRE.m2PerResident} m² per resident</strong> — that is <strong className="text-[#1C1917]">≈ {BAROMETRE.chfPerM2AllIn} CHF/m² (ALL-INCLUSIVE)</strong>: close to the median of Geneva's sitting-tenant stock ({GENEVA_STOCK_M2} CHF/m² net), a level the listings market no longer offers a newcomer (≈ {GENEVA_ANNONCE_M2} CHF/m² net).</>
              ) : (
                <>Une chambre en coliving se loue en médiane <strong className="text-[#1C1917]">{BAROMETRE.rentMedianChf} CHF par mois, tout compris</strong> (médiane 2026 des loyers en cours dans nos maisons). Rapportée à la surface réellement à disposition — chambre privée de {BAROMETRE.roomSizeMin} à {BAROMETRE.roomSizeMax} m² plus les espaces communs, soit <strong className="text-[#1C1917]">≈ {BAROMETRE.m2PerResident} m² par résident</strong> —, elle revient à <strong className="text-[#1C1917]">≈ {BAROMETRE.chfPerM2AllIn} CHF/m² (TOUT COMPRIS)</strong> : un niveau proche de la médiane du parc genevois en place ({GENEVA_STOCK_M2} CHF/m² net), que le marché des annonces ne propose plus à un arrivant (≈ {GENEVA_ANNONCE_M2} CHF/m² net).</>
              )}
            </p>
            <div className="mt-6">
              <svg
                viewBox="0 0 560 300"
                className="w-full h-auto"
                role="img"
                aria-label={
                  en
                    ? "Four bars comparing rent per square metre: Geneva sitting-tenant stock 35 CHF/m² net; coliving room about 36 CHF/m² all-inclusive; bare studio about 45 €/m² at full cost; Geneva listings about 50 CHF/m² net. Bases differ and are labelled."
                    : "Quatre barres comparant le loyer au mètre carré : parc genevois en place 35 CHF/m² net ; chambre coliving environ 36 CHF/m² tout compris ; studio nu environ 45 €/m² en coût complet ; annonces Genève environ 50 CHF/m² net. Les bases diffèrent et sont étiquetées."
                }
              >
                <rect x="0" y="0" width="560" height="300" fill="#FAF9F6" rx="8" />
                {/* Hachures = barre La Villa (base « tout compris ») visuellement distincte des loyers de marché,
                    même sur une capture isolée sans la note « bases différentes ». */}
                <defs>
                  <pattern id="hachure-lavilla" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">
                    <rect width="7" height="7" fill="#D4A574" />
                    <line x1="0" y1="0" x2="0" y2="7" stroke="#A0623C" strokeWidth="2.5" opacity="0.45" />
                  </pattern>
                </defs>
                <line x1="30" y1="240" x2="530" y2="240" stroke="#E7E5E4" strokeWidth="1" />
                {[
                  { x: 45, v: GENEVA_STOCK_M2, unit: "CHF/m²", c: "#6B8E6B", l1: en ? "Sitting stock" : "Parc en place", l2: en ? "Geneva · net" : "Genève · net" },
                  { x: 172, v: BAROMETRE.chfPerM2AllIn, unit: "CHF/m²", c: "url(#hachure-lavilla)", approx: true, l1: "Coliving", l2: en ? "all-inclusive · La Villa" : "tout compris · La Villa" },
                  { x: 299, v: STUDIO_FULL_COST.perM2Chf, unit: en ? `CHF/m² (≈ ${STUDIO_FULL_COST.perM2Eur} €)` : `CHF/m² (≈ ${STUDIO_FULL_COST.perM2Eur} €)`, c: "#A8A29E", approx: true, l1: en ? "Bare studio" : "Studio nu", l2: en ? "full cost · France" : "coût complet · France" },
                  { x: 426, v: GENEVA_ANNONCE_M2, unit: "CHF/m²", c: "#A0623C", approx: true, l1: en ? "Listings" : "Annonces", l2: en ? "Geneva · net" : "Genève · net" },
                ].map((b) => {
                  const h = (b.v / 50) * 185;
                  return (
                    <g key={b.x}>
                      <rect x={b.x} y={240 - h} width="90" height={h} rx="3" fill={b.c} />
                      <text x={b.x + 45} y={240 - h + 22} textAnchor="middle" fontSize="17" fontWeight="700" fill="#ffffff">
                        {b.approx ? "≈ " : ""}{b.v}
                      </text>
                      <text x={b.x + 45} y={240 - h + 36} textAnchor="middle" fontSize="9" fill="#ffffff" opacity="0.85">{b.unit}</text>
                      <text x={b.x + 45} y={258} textAnchor="middle" fontSize="11" fontWeight="600" fill="#44403C">{b.l1}</text>
                      <text x={b.x + 45} y={271} textAnchor="middle" fontSize="9.5" fill="#78716C">{b.l2}</text>
                    </g>
                  );
                })}
                <text x="280" y="292" textAnchor="middle" fontSize="9.5" fill="#A8A29E">
                  {en ? "Bases differ (net / all-inclusive / full cost) — detail in the methodology." : "Bases différentes (net / tout compris / coût complet) — détail en méthodologie."}
                </text>
              </svg>
            </div>
            <SourceLine>
              {en
                ? `Sources: sitting stock = OCSTAT 2025 · Geneva listings = Observatory survey on Homegate, June 2026 · full-cost studio = Observatory survey on Le Figaro Immobilier, June 2026 + posted assumptions · coliving = La Villa data, 2026 · ${FX_NOTE_EN}.`
                : `Sources : parc en place = OCSTAT 2025 · annonces Genève = relevé de l'Observatoire sur Homegate, juin 2026 · studio coût complet = relevé de l'Observatoire sur Le Figaro Immobilier, juin 2026 + hypothèses affichées · coliving = données La Villa, 2026 · ${FX_NOTE_FR}.`}
            </SourceLine>
          </div>

          {/* B — Le coût complet, ligne à ligne (hypothèses affichées) */}
          <div className="bg-white border border-[#E7E5E4] rounded-xl p-6 sm:p-8 mb-6">
            <h3 className="text-xl md:text-2xl font-light text-[#1C1917] mb-4" style={{ fontFamily: "DM Serif Display, serif" }}>
              {en ? "The full monthly cost, line by line" : "Le coût mensuel complet, ligne à ligne"}
            </h3>
            <p className="text-sm text-[#57534E] leading-relaxed mb-4">
              {en
                ? "An advertised rent is not a total cost. Below, the same calculation on both sides: a bare 30 m² studio in Annemasse (observatory listing rent + posted assumptions) next to an all-inclusive coliving room."
                : "Un loyer d'annonce n'est pas un coût total. Ci-dessous, le même calcul des deux côtés : un studio nu de 30 m² à Annemasse (loyer d'annonce de l'observatoire + hypothèses affichées) face à une chambre en coliving tout inclus."}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr className="border-b border-[#E7E5E4] text-left">
                    <th className="px-3 py-3 font-medium text-[#57534E]">{en ? "Item" : "Poste"}</th>
                    <th className="px-3 py-3 font-medium text-[#57534E] text-right">{en ? "Bare studio 30 m² (Annemasse)" : "Studio nu 30 m² (Annemasse)"}</th>
                    <th className="px-3 py-3 font-medium text-[#57534E] text-right">{en ? "Coliving room (La Villa)" : "Chambre coliving (La Villa)"}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { p: en ? "Advertised rent" : "Loyer d'annonce", s: `${STUDIO_FULL_COST.rentEur} €`, c: en ? `CHF ${BAROMETRE.rentMedianChf} all-inclusive` : `${BAROMETRE.rentMedianChf} CHF tout compris` },
                    { p: en ? "Charges" : "Charges", s: `~${STUDIO_FULL_COST.chargesEur} €`, c: en ? "included" : "incluses" },
                    { p: en ? "Electricity + internet" : "Électricité + internet", s: `~${STUDIO_FULL_COST.energyInternetEur} €`, c: en ? "included" : "inclus" },
                    { p: en ? `Furniture (${STUDIO_FULL_COST.furnitureTotalEur.toLocaleString("en")} € over ${STUDIO_FULL_COST.furnitureMonths} mo)` : `Meubles (${STUDIO_FULL_COST.furnitureTotalEur.toLocaleString("fr-FR")} € amortis sur ${STUDIO_FULL_COST.furnitureMonths} mois)`, s: `~${STUDIO_FULL_COST.furnitureMonthlyEur} €`, c: en ? "included (furnished)" : "inclus (meublé)" },
                    { p: en ? "Agency fees (legal cap, spread)" : "Frais d'agence (plafond légal, amortis)", s: `~${STUDIO_FULL_COST.agencyMonthlyEur} €`, c: en ? "0 (direct rental)" : "0 (location en direct)" },
                  ].map((r) => (
                    <tr key={r.p} className="border-b border-[#F0EEE9]">
                      <td className="px-3 py-3 text-[#44403C]">{r.p}</td>
                      <td className="px-3 py-3 text-right text-[#44403C] whitespace-nowrap">{r.s}</td>
                      <td className="px-3 py-3 text-right text-[#44403C] whitespace-nowrap">{r.c}</td>
                    </tr>
                  ))}
                  <tr className="border-b border-[#E7E5E4] font-medium" style={{ background: "#FAF9F6" }}>
                    <td className="px-3 py-3 text-[#1C1917]">{en ? "Real monthly total" : "Total mensuel réel"}</td>
                    <td className="px-3 py-3 text-right text-[#1C1917] whitespace-nowrap">
                      ≈ {STUDIO_FULL_COST.totalMonthlyEur.toLocaleString(en ? "en" : "fr-FR")} €
                      <span className="block text-[10px] font-normal text-[#78716C]">≈ {STUDIO_FULL_COST.totalMonthlyChf.toLocaleString(en ? "en" : "fr-FR")} CHF</span>
                    </td>
                    <td className="px-3 py-3 text-right text-[#1C1917] whitespace-nowrap">
                      {en ? `CHF ${BAROMETRE.rentMedianChf}` : `${BAROMETRE.rentMedianChf} CHF`}
                      <span className="block text-[10px] font-normal text-[#78716C]">≈ {COLIVING_EUR} €</span>
                    </td>
                  </tr>
                  <tr className="border-b border-[#F0EEE9]">
                    <td className="px-3 py-3 text-[#44403C]">{en ? "Living space" : "Surface à disposition"}</td>
                    <td className="px-3 py-3 text-right text-[#44403C]">{en ? "30 m², bare" : "30 m² nus"}</td>
                    <td className="px-3 py-3 text-right text-[#44403C]">{en ? `≈ ${BAROMETRE.m2PerResident} m²/resident, equipped` : `≈ ${BAROMETRE.m2PerResident} m²/résident, équipés`}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 text-[#44403C]">{en ? "Cash needed before moving in" : "À sortir avant d'emménager"}</td>
                    <td className="px-3 py-3 text-right text-[#44403C] whitespace-nowrap">≈ {STUDIO_FULL_COST.entryCashEur.toLocaleString(en ? "en" : "fr-FR")} €</td>
                    <td className="px-3 py-3 text-right text-[#44403C] whitespace-nowrap">{en ? "2-month deposit (refundable)" : "Caution 2 mois (restituable)"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Verdict + panier — l'encart-clé du tableau (mis en avant, demande Jérôme 07/2026) */}
            <div className="mt-6 bg-[#D4A574]/10 border border-[#D4A574]/40 rounded-xl p-5 sm:p-7 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A0623C] mb-4">
                {en ? "The same table, two readings" : "Le même tableau, deux lectures"}
              </p>
              <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto text-left">
                <div className="bg-white border border-[#E7E5E4] rounded-xl p-4">
                  <p className="text-xs text-[#78716C] uppercase tracking-wider mb-1.5">
                    {en ? "Like-for-like property" : "À bien équivalent"}
                  </p>
                  <p className="text-sm text-[#44403C] leading-relaxed">
                    {en ? (
                      <>A coliving room, all-inclusive, comes to <strong className="text-[#1C1917]">≈ 10% more</strong> than a bare 30 m² studio all-in (≈ €{COLIVING_EUR} vs ≈ €1,344).</>
                    ) : (
                      <>Une chambre en coliving tout inclus revient <strong className="text-[#1C1917]">≈ 10 % plus cher</strong> qu'un studio nu de 30 m² tout compris (≈ {COLIVING_EUR} € contre ≈ 1 344 €).</>
                    )}
                  </p>
                </div>
                <div className="bg-white border border-[#E7E5E4] rounded-xl p-4">
                  <p className="text-xs text-[#78716C] uppercase tracking-wider mb-1.5">
                    {en ? "Like-for-like surface (≈ 38 m²)" : "À surface équivalente (≈ 38 m²)"}
                  </p>
                  <p className="text-sm text-[#44403C] leading-relaxed">
                    {en ? (
                      <>For the ≈ 38 m² a resident actually enjoys, coliving comes to <strong className="text-[#1C1917]">≈ 13% less</strong> than the same surface solo at the studio's full-cost rate (≈ €{COLIVING_EUR} vs ≈ €{STUDIO_38M2_EUR}).</>
                    ) : (
                      <>Pour les ≈ 38 m² dont dispose réellement un résident, le coliving revient <strong className="text-[#1C1917]">≈ 13 % moins cher</strong> que la même surface en solo au coût complet du studio (≈ {COLIVING_EUR} € contre ≈ {STUDIO_38M2_EUR} €).</>
                    )}
                  </p>
                </div>
              </div>
              <p className="text-sm text-[#44403C] leading-relaxed max-w-2xl mx-auto mt-4">
                {en
                  ? "In both readings: a furnished and equipped home, all services and charges included, a selected community, no agency or application fees, and the flexibility of a short lease."
                  : "Dans les deux lectures : un logement meublé et équipé, tous les services et charges compris, une communauté sélectionnée, aucun frais d'agence ni de dossier, et la flexibilité d'un bail court."}
              </p>
              <p className="text-xs uppercase tracking-[0.18em] text-[#A0623C] font-semibold mt-6 mb-3">
                {en ? `What CHF ${BAROMETRE.rentMedianChf}/month covers` : `Ce que couvrent les ${BAROMETRE.rentMedianChf} CHF par mois`}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {(en
                  ? ["rent", "charges", "furnished", "fiber internet", "cleaning", "pool", "sauna", "gym", "home cinema", "garden", "community events"]
                  : ["loyer", "charges", "meublé", "fibre", "ménage", "piscine", "sauna", "salle de sport", "home cinema", "jardin", "événements"]
                ).map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 text-sm bg-white border border-[#D4A574]/50 text-[#44403C] rounded-full px-3 py-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-[#6B8E6B] shrink-0" />
                    {item}
                  </span>
                ))}
              </div>
              <p className="text-sm font-semibold text-[#1C1917] mt-4">
                {en
                  ? "One rent, a single line on the bank statement — no charges, furniture or agency fees."
                  : "Un loyer, une seule ligne sur le relevé bancaire — pas de charges, de meubles ni de frais d'agence."}
              </p>
            </div>
            <p className="text-xs text-[#A8A29E] mt-4">
              {en
                ? `Posted assumptions: charges ${STUDIO_FULL_COST.chargesEur} €, electricity + internet ${STUDIO_FULL_COST.energyInternetEur} €, furniture ${STUDIO_FULL_COST.furnitureTotalEur.toLocaleString("en")} € spread over ${STUDIO_FULL_COST.furnitureMonths} months, agency fees at the legal cap (15 €/m², French Alur law) spread over ${STUDIO_FULL_COST.furnitureMonths} months. Reference studio 30 m², Annemasse listing rent from the observatory above. Entry cash: 1-month deposit + agency fees + furniture. “Like-for-like surface” reading: 38 m² × the studio's full cost per m² (≈ €44.8/m²) ≈ €1,700 — an extrapolation at constant rate per m². ${FX_NOTE_EN}.`
                : `Hypothèses affichées : charges ${STUDIO_FULL_COST.chargesEur} €, électricité + internet ${STUDIO_FULL_COST.energyInternetEur} €, meubles ${STUDIO_FULL_COST.furnitureTotalEur.toLocaleString("fr-FR")} € amortis sur ${STUDIO_FULL_COST.furnitureMonths} mois, frais d'agence au plafond légal (15 €/m², loi Alur) amortis sur ${STUDIO_FULL_COST.furnitureMonths} mois. Studio de référence 30 m², loyer d'annonce Annemasse de l'observatoire ci-dessus. À l'entrée : caution 1 mois + agence + meubles. Lecture « à surface équivalente » : 38 m² × le coût complet au m² du studio (≈ 44,8 €/m²) ≈ 1 700 € — extrapolation à taux constant au m². ${FX_NOTE_FR}.`}
            </p>
            <SourceLine>
              {en
                ? "Sources: bare studio = Observatory survey on the Le Figaro Immobilier portal, June 2026 (+ assumptions above) · coliving room = La Villa Coliving internal data, 2026 median."
                : "Sources : studio nu = relevé de l'Observatoire sur le portail Le Figaro Immobilier, juin 2026 (+ hypothèses ci-dessus) · chambre coliving = données internes La Villa Coliving, médiane 2026."}
            </SourceLine>
          </div>

          {/* C — Le résident-type + la tension */}
          <div className="bg-white border border-[#E7E5E4] rounded-xl p-6 sm:p-8">
            <h3 className="text-xl md:text-2xl font-light text-[#1C1917] mb-4 flex items-center gap-2.5" style={{ fontFamily: "DM Serif Display, serif" }}>
              <Users className="w-6 h-6 text-[#D4A574] shrink-0" />
              {en ? "Who lives in coliving — the typical resident" : "Qui vit en coliving — le résident-type"}
            </h3>
            <p className="text-sm text-[#57534E] leading-relaxed mb-5">
              {en
                ? `Profile of the ${BAROMETRE.residentsCovered} residents hosted in our houses since October 2021 (aggregated, anonymised):`
                : `Le profil des ${BAROMETRE.residentsCovered} résidents passés par nos maisons depuis octobre 2021 (agrégé, anonymisé) :`}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { v: `${BAROMETRE.frontaliersPct} %`, l: en ? "cross-border workers" : "frontaliers" },
                { v: `${BAROMETRE.ageDominant} ${en ? "yrs" : "ans"}`, l: en ? `dominant age group (full range ${BAROMETRE.ageRange})` : `tranche dominante (fourchette ${BAROMETRE.ageRange})` },
                { v: `${BAROMETRE.singlesPct} / ${BAROMETRE.couplesPct}`, l: en ? "% singles / couples" : "% célibataires / couples" },
                { v: `${BAROMETRE.tenureAvgMonths} ${en ? "months" : "mois"}`, l: en ? "average length of stay" : "durée moyenne de séjour" },
                { v: en ? "Health, corporate, int'l org." : "Médical, cadres, org. int.", l: en ? "top employment sectors" : "premiers secteurs d'emploi" },
                { v: en ? "Spanish & Italian" : "Espagnols & Italiens", l: en ? "top nationalities (excl. FR/CH)" : "premières nationalités (hors FR/CH)" },
              ].map((c) => (
                <div key={c.l} className="bg-[#FAF9F6] rounded-lg p-4 text-center">
                  <p className="text-base font-medium text-[#1C1917] leading-snug">{c.v}</p>
                  <p className="text-xs text-[#78716C] mt-1 leading-snug">{c.l}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-[#57534E] leading-relaxed mt-5">
              {en
                ? `On market tension: occupancy runs at 98-99%, applications come in at ${BAROMETRE.applicationsPerMonth} per month, and a vacated room is re-let in under a week.`
                : `Côté tension : le taux d'occupation s'établit à 98-99 %, les candidatures arrivent au rythme de ${BAROMETRE.applicationsPerMonth} par mois, et une chambre libérée se reloue en moins d'une semaine.`}
            </p>
            <SourceLine center={false}>
              {en
                ? "Source: La Villa Coliving internal data, October 2021 → 2026 (aggregated, anonymised)."
                : "Source : données internes La Villa Coliving, octobre 2021 → 2026 (agrégées, anonymisées)."}
            </SourceLine>
          </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MÉTHODO ===== */}
      <section className="py-12 lg:py-16 bg-[#FAF9F6]">
        <div className="max-w-3xl mx-auto px-6">
          <details id="methodo" className="group scroll-mt-24">
            <summary className="flex items-center gap-2 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden text-xl font-medium text-[#1C1917]">
              <Info className="w-5 h-5 text-[#D4A574] shrink-0" />
              {en ? "Method & sources" : "Méthodologie & sources"}
              <ChevronDown className="w-4 h-4 text-[#A8A29E] transition-transform group-open:rotate-180" />
              <span className="text-xs font-normal text-[#A8A29E] ml-auto">{en ? "unfold" : "déplier"}</span>
            </summary>
          <div className="text-sm text-[#57534E] space-y-4 leading-relaxed mt-5">
            <p>
              <strong className="text-[#1C1917]">{en ? "What this observatory measures." : "Ce que mesure cet observatoire."}</strong>{" "}
              {en
                ? "Re-letting rents — the advertised rent a newcomer pays when signing a lease today — not the rents of already-occupied housing. The two differ a lot, and that gap is precisely the point."
                : "Les loyers à la relocation — le loyer d'annonce que paie un nouvel arrivant à la signature d'un bail aujourd'hui — et non les loyers du parc en place. Les deux diffèrent beaucoup, et c'est précisément le sujet."}
            </p>
            <p>
              <strong className="text-[#1C1917]">{en ? "Why not just the official figures?" : "Pourquoi pas seulement les chiffres officiels ?"}</strong>{" "}
              {en
                ? "Because they answer a different question. Stock statistics (like OCSTAT's rental survey in Geneva) measure what all tenants pay, old and new alike — rents pulled down by long-protected leases. OCSTAT states it explicitly: “rents on recently concluded leases are generally appreciably higher than those paid by people who have occupied the same flat for a long time.” For a newcomer, that figure understates reality. So we use it for what it is — the market of established tenants — and set it against the market of listings."
                : "Parce qu'ils répondent à une autre question. Les statistiques de stock (comme l'état locatif d'OCSTAT à Genève) mesurent ce que paie l'ensemble des locataires, anciens comme nouveaux — donc des loyers tirés vers le bas par les baux protégés de longue date. OCSTAT le dit explicitement : « les loyers des baux conclus récemment sont en général sensiblement supérieurs à ceux payés par des personnes qui occupent le même appartement depuis longtemps. » Pour un arrivant, ce chiffre sous-estime la réalité. On l'utilise donc pour ce qu'il est — le marché des installés — et on lui oppose le marché des annonces."}
            </p>
            <div>
              <strong className="text-[#1C1917]">{en ? "Geneva — one solid figure, two readings." : "Genève — un chiffre solide, deux regards."}</strong>
              <ul className="list-disc pl-5 mt-1.5 space-y-1">
                <li>{en ? "Established tenants: OCSTAT 2025, studios ≤ 37 m², free-market rent, tenants — 2,294 observations, median 35 CHF/m²." : "Parc en place (installés) : OCSTAT 2025, studios ≤ 37 m², loyer libre, locataires — 2 294 observations, médiane 35 CHF/m²."}</li>
                <li>{en ? "Listings (newcomers): Observatory survey on the Homegate portal — studios ≤ 37 m² let unfurnished in the City of Geneva, June 2026 — median ≈ 50 CHF/m² (n = 25). Net rents (excl. heating) on both sides, to compare like with like." : "Annonces (arrivants) : relevé de l'Observatoire sur le portail Homegate — studios ≤ 37 m² loués vides en Ville de Genève, juin 2026 — médiane ≈ 50 CHF/m² (n = 25). Loyers nets (hors chauffage) des deux côtés, pour comparer ce qui est comparable."}</li>
                <li>{en ? "Both cover the same area and the same type of home: the +44% gap is a genuine established-vs-newcomer comparison, not an artefact." : "Les deux portent sur le même périmètre et le même type de logement : l'écart de +44 % est donc une vraie comparaison installés / arrivants, pas un artefact."}</li>
                <li>{en ? `“8-min” benchmark: advertised studio rent in Geneva-Eaux-Vives ≈ 1,750 CHF/month (≈ €${GENEVA_EAUXVIVES_EUR} at the July 2026 rate) — a premium neighbourhood, from the same Homegate survey; city-wide the median asking rent is lower (≈ 1,500 CHF).` : `Repère « 8 min » : loyer d'annonce d'un studio à Genève-Eaux-Vives ≈ 1 750 CHF/mois (≈ ${GENEVA_EAUXVIVES_EUR} € au taux de juillet 2026) — quartier premium, issu du même relevé Homegate ; la médiane des annonces de toute la ville est plus basse (≈ 1 500 CHF).`}</li>
              </ul>
            </div>
            <div>
              <strong className="text-[#1C1917]">{en ? "France — an open market, and honesty about sources." : "France — un marché ouvert, et une honnêteté sur les sources."}</strong>
              <ul className="list-disc pl-5 mt-1.5 space-y-1">
                <li>{en ? `The rents displayed on this page (table, commute bands, Annemasse comparison) come from OUR June 2026 survey: advertised studio rents per m² by municipality, collected by us on the Le Figaro Immobilier listings portal, × ${REF_M2} m² reference. Indicative orders of magnitude — few listings in small towns, so read with care. 14 of 17 towns have a published studio rate; the other 3 (marked *) use the 2-room rent.` : `Les loyers affichés sur cette page (tableau, paliers, comparatif Annemasse) proviennent de NOTRE relevé de juin 2026 : les loyers d'annonce d'un studio au m² par commune, relevés par nos soins sur le portail Le Figaro Immobilier, × ${REF_M2} m² de référence. Ordres de grandeur indicatifs — sur les petites communes, peu d'annonces, donc à lire avec prudence. 14 communes sur 17 ont un studio publié ; les 3 autres (marquées *) reprennent le loyer 2-pièces.`}</li>
                <li>{en ? "The ANIL rent map confirms the order of magnitude of the France/Geneva differential, on a smoothed 1–2-room basis (charges included). It is not the source of any figure displayed on this page. (“ANIL estimates, based on data from Groupe SeLoger and leboncoin.”)" : "La Carte des loyers de l'ANIL confirme l'ordre de grandeur du différentiel France/Genève, sur une base lissée T1-T2 (charges comprises). Elle n'est la source d'aucun chiffre affiché sur cette page. (« Estimations ANIL, à partir des données du Groupe SeLoger et de leboncoin. »)"}</li>
                <li>{en ? "The French sitting/newcomer gap is not measured here: a gap exists in France too (indexed running leases), but no public stock statistic equivalent to OCSTAT covers the French Genevois. The only sitting/newcomer gap this observatory quantifies is Geneva's." : "L'écart installés/arrivants côté France n'est pas mesuré ici : un écart existe aussi en France (baux en cours indexés), mais aucune statistique publique de « stock » équivalente à l'OCSTAT ne couvre le Genevois français. Le seul écart installés/arrivants que cet observatoire quantifie est donc celui de Genève."}</li>
              </ul>
            </div>
            <p>
              <strong className="text-[#1C1917]">{en ? "Exchange rate." : "Taux de change."}</strong>{" "}
              {en
                ? `Each market is shown in its native currency (Geneva and coliving in CHF, France in €). Whenever this page compares across currencies or computes a gap, it converts at the July 2026 rate: €1 = CHF 0.92 (CHF 1 = €1.087). Converted equivalents are shown in brackets. No €/CHF “parity” is assumed anywhere.`
                : `Chaque marché est affiché dans sa devise (Genève et coliving en CHF, France en €). Dès que la page compare des devises ou calcule un écart, elle convertit au taux de juillet 2026 : 1 € = 0,92 CHF (1 CHF = 1,087 €). Les équivalents convertis figurent entre parenthèses. Aucune « parité » €/CHF n'est supposée nulle part.`}
            </p>
            <p>
              <strong className="text-[#1C1917]">{en ? "Commute." : "Trajet."}</strong>{" "}
              {en
                ? "Door-to-door to Geneva-Eaux-Vives at morning peak (arrival ~9:15), surveyed on online maps for car and public transport; bike via the greenway. Direct Léman Express times and peak frequency come from the official 2026 timetable."
                : "Porte-à-porte vers Genève-Eaux-Vives à l'heure de pointe (arrivée ~9h15), relevé sur cartes en ligne pour la voiture et les transports publics ; vélo par la voie verte. Les temps Léman Express directs et la cadence en pointe proviennent de l'horaire officiel 2026."}
            </p>
            <div>
              <strong className="text-[#1C1917]">{en ? "La Villa data (“Seen from our houses”)." : "Données La Villa (« Vu de nos maisons »)."}</strong>
              <ul className="list-disc pl-5 mt-1.5 space-y-1">
                <li>{en ? `Anonymised aggregates from our ${BAROMETRE.housesCount} houses (${BAROMETRE.roomsCount} rooms, ${BAROMETRE.residentsCovered} residents since October 2021) — an operator's sample, not a market census.` : `Agrégats anonymisés issus de nos ${BAROMETRE.housesCount} maisons (${BAROMETRE.roomsCount} chambres, ${BAROMETRE.residentsCovered} résidents depuis octobre 2021) — un échantillon d'exploitant, pas un recensement du marché.`}</li>
                <li>{en ? "Rent: 2026 median of current rents, billed in CHF, all-inclusive. Today's entry price for a room (1,380 CHF) sits slightly above this median — the gap comes from older leases still running. Occupancy: average across all houses since October 2021 — 98-99% depending on the year and the house; a recently opened house can temporarily sit below that level during its ramp-up. Length of stay: average over all residents." : "Loyer : médiane 2026 des loyers en cours, facturés en CHF, tout compris. Le prix d'entrée actuel d'une chambre (1 380 CHF) est légèrement au-dessus de cette médiane — l'écart vient des baux plus anciens toujours en cours. Occupation : moyenne toutes maisons confondues depuis octobre 2021 — 98-99 % selon les années et les maisons ; une maison récemment ouverte peut passer temporairement en dessous pendant sa montée en charge. Durée de séjour : moyenne sur l'ensemble des résidents."}</li>
                <li>{en ? `Space per resident: total habitable surface ÷ number of residents — La Villa ${BAROMETRE.m2PerHouse.lavilla} m², Le Lodge ${BAROMETRE.m2PerHouse.lelodge} m², Le Loft ${BAROMETRE.m2PerHouse.leloft} m² (private rooms ${BAROMETRE.roomSizeMin}-${BAROMETRE.roomSizeMax} m²). The “≈ ${BAROMETRE.chfPerM2AllIn} CHF/m² all-inclusive” is therefore not directly comparable to a net rent per m² — the difference in scope is stated and detailed here.` : `Surface par résident : surface habitable totale ÷ nombre de résidents — La Villa ${BAROMETRE.m2PerHouse.lavilla} m², Le Lodge ${BAROMETRE.m2PerHouse.lelodge} m², Le Loft ${BAROMETRE.m2PerHouse.leloft} m² (chambres privées ${BAROMETRE.roomSizeMin}-${BAROMETRE.roomSizeMax} m²). Le « ≈ ${BAROMETRE.chfPerM2AllIn} CHF/m² tout compris » n'est donc pas directement comparable à un loyer net au m² — l'écart de périmètre est assumé et détaillé ici.`}</li>
                <li>{en ? "“Full cost” table: every assumption is posted under the table itself." : "Tableau « coût complet » : toutes les hypothèses sont affichées sous le tableau lui-même."}</li>
              </ul>
            </div>
            <p>
              <strong className="text-[#1C1917]">{en ? "Independence and transparency." : "Indépendance et transparence."}</strong>{" "}
              {en
                ? "The “market” layer of this observatory (Geneva, French corridor) relies exclusively on public sources and listings surveys: La Villa appears in none of those figures. The “Seen from our houses” layer relies on our own data, clearly labelled — the reader always knows who is speaking. All data is freely reusable with attribution (CC-BY) and downloadable above."
                : "La couche « marché » de cet observatoire (Genève, corridor France) repose exclusivement sur des sources publiques et des relevés d'annonces : La Villa n'apparaît dans aucun de ces chiffres. La couche « Vu de nos maisons » repose sur nos propres données, clairement étiquetées — le lecteur sait toujours qui parle. L'ensemble est librement réutilisable avec mention de la source (CC-BY) et téléchargeable ci-dessus."}
            </p>
            <p className="text-xs text-[#A8A29E]">
              {en
                ? `Sources: OCSTAT (cantonal rent statistics, Geneva); Observatory listings surveys, June 2026 — Homegate for Geneva, Le Figaro Immobilier for France; Léman Express 2026 timetable; La Villa Coliving internal data (2021-2026 aggregates). ${FX_NOTE_EN}. Edition 1: left-bank / Léman Express corridor → Geneva-Eaux-Vives.`
                : `Sources : OCSTAT (statistique cantonale des loyers, Genève) ; relevés d'annonces de l'Observatoire, juin 2026 — Homegate pour Genève, Le Figaro Immobilier pour la France ; horaires Léman Express 2026 ; données internes La Villa Coliving (agrégats 2021-2026). ${FX_NOTE_FR}. Édition 1 : corridor rive gauche / Léman Express → Genève-Eaux-Vives.`}
            </p>
          </div>
          </details>
        </div>
      </section>

      {/* ===== PRESSE & TÉLÉCHARGEMENTS + CTA (brief staging §5) ===== */}
      <section className="py-14 lg:py-20 bg-white border-t border-[#E7E5E4]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-light text-[#1C1917] mb-6 text-center" style={{ fontFamily: "DM Serif Display, serif" }}>
            {en ? "Press & downloads" : "Presse & téléchargements"}
          </h2>
          {/* À citer */}
          <div className="bg-[#FAF9F6] border border-[#E7E5E4] rounded-xl p-5 text-center max-w-2xl mx-auto mb-7">
            <p className="text-sm text-[#44403C] leading-relaxed">
              {en ? (
                <><strong className="text-[#1C1917]">To quote:</strong> figures and charts are freely reusable with the attribution <strong className="text-[#1C1917]">“Observatoire La Villa Coliving 2026”</strong> (CC-BY).</>
              ) : (
                <><strong className="text-[#1C1917]">À citer :</strong> chiffres et graphiques librement réutilisables avec la mention <strong className="text-[#1C1917]">« Observatoire La Villa Coliving 2026 »</strong> (CC-BY).</>
              )}
            </p>
          </div>
          {/* Téléchargements */}
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href={CSV_URL}
              download="observatoire-loyer-trajet-geneve-2026.csv"
              className="inline-flex items-center gap-2 bg-[#1C1917] text-white px-5 py-3 text-xs sm:text-sm uppercase tracking-wider hover:bg-[#44403C] transition-colors rounded-md"
            >
              <Download className="w-4 h-4" />
              {en ? "France corridor (CSV)" : "Corridor France (CSV)"}
            </a>
            <a
              href={CSV_GENEVA_URL}
              download="observatoire-geneve-deux-vitesses-2026.csv"
              className="inline-flex items-center gap-2 border border-[#1C1917] text-[#1C1917] px-5 py-3 text-xs sm:text-sm uppercase tracking-wider hover:bg-[#1C1917] hover:text-white transition-colors rounded-md"
            >
              <Download className="w-4 h-4" />
              {en ? "Geneva two-speed (CSV)" : "Genève deux vitesses (CSV)"}
            </a>
            <a
              href={CSV_LAVILLA_URL}
              download="observatoire-lavilla-first-party-2026.csv"
              className="inline-flex items-center gap-2 border border-[#1C1917] text-[#1C1917] px-5 py-3 text-xs sm:text-sm uppercase tracking-wider hover:bg-[#1C1917] hover:text-white transition-colors rounded-md"
            >
              <Download className="w-4 h-4" />
              {en ? "La Villa first-party (CSV)" : "La Villa first-party (CSV)"}
            </a>
            <button
              type="button"
              onClick={downloadScatterSvg}
              className="inline-flex items-center gap-2 border border-[#D4A574] text-[#A0623C] px-5 py-3 text-xs sm:text-sm uppercase tracking-wider hover:bg-[#D4A574] hover:text-white transition-colors rounded-md"
            >
              <ImageDown className="w-4 h-4" />
              {en ? "Rent × commute chart (SVG)" : "Graphique loyer × trajet (SVG)"}
            </button>
            <a
              href="/images/observatoire-loyer-trajet-2026.png"
              download="observatoire-la-villa-coliving-2026.png"
              className="inline-flex items-center gap-2 border border-[#D4A574] text-[#A0623C] px-5 py-3 text-xs sm:text-sm uppercase tracking-wider hover:bg-[#D4A574] hover:text-white transition-colors rounded-md"
            >
              <ImageDown className="w-4 h-4" />
              {en ? "Press visual +44% (PNG)" : "Visuel presse +44 % (PNG)"}
            </a>
          </div>

          {/* Éditeur + CTA discret — FR → article consolidé (07/07), EN → pilier conservé */}
          <div className="text-center mt-12">
            <MapPin className="w-6 h-6 text-[#D4A574] mx-auto mb-3" />
            <p className="text-[#57534E] leading-relaxed mb-6 max-w-2xl mx-auto">
              {en
                ? "This observatory is published by La Villa Coliving, which runs all-inclusive coliving houses on the French side of Geneva. Want a turnkey room without the apartment hunt?"
                : "Cet observatoire est publié par La Villa Coliving, qui gère des maisons de coliving tout inclus côté France. Envie d'une chambre clé en main sans la chasse à l'appartement ?"}
            </p>
            {/* Lien « Qui est derrière cet observatoire → /qui-sommes-nous » à RÉTABLIR quand la page
                fondateurs sera validée et routée (elle vit sur la branche feat/qui-sommes-nous-v2). */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <LocalizedLink
                to={colocGeneveHref(language)}
                className="inline-flex items-center gap-2 border border-[#1C1917] text-[#1C1917] px-6 py-3 text-sm uppercase tracking-wider hover:bg-[#1C1917] hover:text-white transition-colors"
              >
                {en ? "Shared housing in Geneva" : "La colocation à Genève"}
              </LocalizedLink>
              <LocalizedLink
                to="/candidature"
                className="inline-flex items-center gap-2 bg-[#D4A574] text-white px-6 py-3 text-sm uppercase tracking-wider hover:bg-[#44403C] transition-colors"
              >
                {en ? "Apply" : "Candidater"}
                <ArrowRight className="w-4 h-4" />
              </LocalizedLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Th({ children, onClick, right, active }: { children: ReactNode; onClick: () => void; right?: boolean; active?: boolean }) {
  return (
    <th
      onClick={onClick}
      className={`px-3 py-3 cursor-pointer select-none font-medium ${right ? "text-right" : "text-left"} ${active ? "text-[#D4A574]" : "text-[#57534E]"}`}
    >
      {children}
    </th>
  );
}

function Td({ children, active }: { children: ReactNode; active?: boolean }) {
  return (
    <td className={`px-3 py-3 text-right whitespace-nowrap ${active ? "text-[#1C1917] font-medium" : "text-[#78716C]"}`}>
      {children}
    </td>
  );
}

// Colonne « Transports publics » fusionnée : Léman Express en priorité (temps direct gare-à-gare
// + cadence en pointe), avec le porte-à-porte réel juste en dessous ; sinon tram/bus porte-à-porte.
function TransportCell({ c, en, active }: { c: Commune; en: boolean; active?: boolean }) {
  const primary = active ? "text-[#1C1917]" : "text-[#57534E]";
  if (c.train != null) {
    const cad = c.cadence ?? 99;
    const color = cad <= 15 ? "#6B8E6B" : cad <= 30 ? "#D4A574" : "#A0623C";
    const cadFreq = cad >= 60 ? (en ? "every hour" : "toutes les heures") : (en ? `every ${cad} min` : `toutes les ${cad} min`);
    return (
      <td className="px-3 py-3 text-right whitespace-nowrap">
        <div className="leading-tight">
          <div className={`font-medium ${primary}`}>
            {c.train} min <span className="text-[10px] font-normal text-[#78716C]">Léman&nbsp;Express</span>
          </div>
          <div className="text-[11px] mt-0.5">
            <span style={{ color }}>●</span>{" "}
            <span className="font-medium text-[#57534E]">{cadFreq}</span>
          </div>
          <div className="text-[10px] text-[#A8A29E]">{en ? `door-to-door ${c.pt} min` : `porte-à-porte ${c.pt} min`}</div>
        </div>
      </td>
    );
  }
  return (
    <td className="px-3 py-3 text-right whitespace-nowrap">
      <div className="leading-tight">
        <div className={`font-medium ${primary}`}>{c.pt} min</div>
        <div className="text-[10px] text-[#A8A29E]">{c.tram ? "Tram 17" : "Bus / tram"}</div>
      </div>
    </td>
  );
}
