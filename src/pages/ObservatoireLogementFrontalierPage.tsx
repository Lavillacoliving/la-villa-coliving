import { useState, type ReactNode } from "react";
import { Helmet } from "react-helmet";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";
import { buildDatasetSchema } from "@/lib/structuredData";
import { Train, Bus, Bike, Car, Wallet, Download, ArrowRight, MapPin, Info } from "lucide-react";

// ──────────────────────────────────────────────────────────────────────────
// Observatoire du logement frontalier — Édition 1 : corridor rive gauche → Eaux-Vives.
// La Villa = éditrice NEUTRE, jamais dans les chiffres (cf. brief Pan Malin).
// Données France = public/data/observatoire-data-2026.csv ; Genève = observatoire-geneve-2026.csv.
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
const GENEVA_EAUXVIVES_CHF = "1 750"; // CHF/mois, studio Eaux-Vives (annonces juin 2026)
const TRANSFRONT_DELTA_CHF = "760"; // 1 750 − 990 ; € et CHF ≈ parité (jamais convertis)

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
  const PAGE_LAST_UPDATED = "2026-06-26";
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
      ? "Advertised studio rent (Le Figaro, June 2026) crossed with commute time to Geneva-Eaux-Vives, for 17 municipalities of the French Genevois along the Léman Express axis, including peak-hour train frequency. Geneva, a two-speed market: sitting tenants 35 CHF/m² (OCSTAT 2025) vs. newcomers ≈ 50 CHF/m² in today's listings (+44%)."
      : "Loyer d'annonce d'un studio (Le Figaro, juin 2026) croisé au temps de trajet vers Genève-Eaux-Vives, pour 17 communes du Genevois français le long de l'axe Léman Express, avec la cadence des trains en heure de pointe. Genève, marché à deux vitesses : locataire en place 35 CHF/m² (OCSTAT 2025) vs nouvel arrivant ≈ 50 CHF/m² dans les annonces (+44 %).",
    url: `${SITE}/observatoire-logement-frontalier-geneve`,
    csvUrls: [`${SITE}${CSV_URL}`, `${SITE}${CSV_GENEVA_URL}`],
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

      {/* ===== HERO ===== */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-[#FAF9F6]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="text-xs text-[#D4A574] uppercase tracking-[0.3em] mb-4 block font-medium">
            {en ? "Cross-border housing observatory · Edition 1" : "Observatoire du logement frontalier · Édition 1"}
          </span>
          <h1
            className="text-4xl md:text-5xl font-light text-[#1C1917] mb-5 leading-tight"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {en ? "Where to live near Geneva " : "Où se loger près de Genève "}
            <span className="text-[#D4A574]">{en ? "without straying far?" : "sans s'éloigner ?"}</span>
          </h1>
          <p className="text-lg text-[#57534E] max-w-3xl mx-auto mb-9 leading-relaxed">
            {en
              ? "Rive gauche / Léman Express corridor → Geneva-Eaux-Vives. A studio's advertised rent, mapped against real commute time, across 17 towns on the French side of Geneva."
              : "Corridor rive gauche / Léman Express → Genève-Eaux-Vives. Le loyer d'annonce d'un studio, croisé au temps de trajet réel, pour 17 communes du Genevois français."}
          </p>

          {/* Chiffre-choc transfrontalier : loyer d'un studio, à 8 min en Léman Express */}
          <p className="text-xl sm:text-2xl font-medium uppercase tracking-wide text-[#1C1917] mb-5">
            {en ? "A studio's rent, 8 minutes away on the Léman Express" : "Loyer d'un studio, à 8 minutes en Léman Express"}
          </p>
          <div className="inline-block bg-white border border-[#E7E5E4] rounded-xl px-7 py-5">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
              <div className="text-center">
                <div className="text-xs text-[#57534E] mb-1">Genève-Eaux-Vives</div>
                <div className="text-xl sm:text-2xl font-medium text-[#1C1917] whitespace-nowrap">≈ {GENEVA_EAUXVIVES_CHF} CHF</div>
                <div className="text-[10px] text-[#A8A29E] mt-0.5">{en ? "8-min neighbourhood" : "quartier à 8 min"}</div>
              </div>
              <div className="flex items-center text-[#D4A574] shrink-0 my-1 sm:my-0">
                <Train className="w-5 h-5" />
                <ArrowRight className="w-4 h-4 rotate-90 sm:rotate-0" />
              </div>
              <div className="text-center">
                <div className="text-xs text-[#57534E] mb-1">Annemasse (France)</div>
                <div className="text-xl sm:text-2xl font-medium text-[#1C1917] whitespace-nowrap">≈ {hub.mois} €</div>
                <div className="text-[10px] text-[#A8A29E] mt-0.5">{en ? "8 min by train" : "à 8 min en train"}</div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-[#57534E]">
            {en ? (
              <>≈ <span className="font-medium text-[#1C1917]">CHF {TRANSFRONT_DELTA_CHF} less per month</span>, on the French side</>
            ) : (
              <>≈ <span className="font-medium text-[#1C1917]">{TRANSFRONT_DELTA_CHF} CHF de moins par mois</span>, côté France</>
            )}
          </p>
          <p className="mt-5 text-xs text-[#A8A29E]">
            {en ? `Updated ${updatedLabel}` : `Mis à jour le ${updatedLabel}`}
          </p>
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
                <p>
                  {en ? (
                    <>The cantonal statistical office notes that recent leases are “generally substantially higher than those paid by people who have occupied the same flat for a long time.”</>
                  ) : (
                    <>L'office cantonal de la statistique le précise : les baux récents sont « en général sensiblement supérieurs à ceux payés par des personnes qui occupent le même appartement depuis longtemps ».</>
                  )}
                </p>
              </div>

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
              <p className="text-xs text-[#A8A29E] mt-5">
                {en
                  ? "Sources: sitting-tenant rents — OCSTAT 2025 (2,294 studios); advertised rents — June 2026 survey (n = 25). Net rents (excl. heating), City of Geneva."
                  : "Sources : loyers du parc en place — OCSTAT 2025 (2 294 studios) ; loyers d'annonce — relevé juin 2026 (n = 25). Loyers nets (hors chauffage), Ville de Genève."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== INFOGRAPHIE (objet partageable) ===== */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <svg
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
              <text x={PADL + 9} y={58} fontSize="10" fill="#A0623C">≈ {GENEVA_EAUXVIVES_CHF} CHF · 0 min</text>
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
            {/* logo + url (objet qui circule) */}
            <text x={VW - PADR} y={26} textAnchor="end" fontSize="12" fill="#A8A29E">lavillacoliving.com</text>
          </svg>
          <p className="text-center text-xs text-[#A8A29E] mt-3">
            {en
              ? "Each dot = a French municipality (rent in €). Geneva-Eaux-Vives (in CHF) sits off the € scale, above the axis break. Lower-right = further & cheaper. La Villa Coliving, neutral editor."
              : "Chaque point = une commune française (loyer en €). Genève-Eaux-Vives (en CHF) est hors échelle €, au-dessus de la rupture d'axe. En bas à droite = plus loin et moins cher. La Villa Coliving, éditrice neutre."}
          </p>
        </div>
      </section>

      {/* ===== TABLEAU INTERACTIF ===== */}
      <section className="py-12 lg:py-16 bg-[#FAF9F6]">
        <div className="max-w-4xl mx-auto px-6">
          {/* Intro de l'outil interactif */}
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
                  <td className="px-3 py-2.5 text-[#1C1917] whitespace-nowrap font-medium">
                    Genève-Eaux-Vives
                    <span className="ml-1.5 text-[10px] uppercase tracking-wider text-[#A0623C]">({en ? "reference" : "repère"})</span>
                  </td>
                  <td className="px-3 py-2.5 text-right font-medium text-[#1C1917] whitespace-nowrap">≈ {GENEVA_EAUXVIVES_CHF}&nbsp;CHF*</td>
                  <td className="px-3 py-2.5 text-right text-[#78716C]">0 min</td>
                  <td className="px-3 py-2.5 text-right text-[#78716C]">0 min</td>
                  <td className="px-3 py-2.5 text-right text-[#78716C]">0 min</td>
                </tr>
                {sorted.map((c) => {
                  const ok = c.mois <= budget;
                  return (
                    <tr
                      key={c.name}
                      className="border-b border-[#F0EEE9] last:border-0"
                      style={{ opacity: ok ? 1 : 0.4 }}
                    >
                      <td className="px-3 py-2.5 text-[#1C1917] whitespace-nowrap">
                        {ok && <span className="text-[#6B8E6B] mr-1.5">✓</span>}
                        {c.name}
                        {c.proxy && <span className="text-[#A8A29E]">&nbsp;*</span>}
                        {c.expanded && <span className="text-[#A8A29E]">&nbsp;°</span>}
                      </td>
                      <td className="px-3 py-2.5 text-right font-medium text-[#1C1917] whitespace-nowrap">{c.mois} €</td>
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
              ? "* Geneva reference: advertised studio rent in Eaux-Vives — a premium 8-minute neighbourhood — ≈ 1,750 CHF/mo (market listings, June 2026, excluding student/furnished lets). City-wide, the median asking rent is lower (≈ 1,500 CHF). Shown in CHF; € and CHF are near parity. “*” next to a French town = studio not published by Le Figaro, 2-room rent shown instead."
              : "* Repère Genève : loyer d'annonce d'un studio à Eaux-Vives — quartier premium à 8 min — ≈ 1 750 CHF/mois (annonces du marché, juin 2026, hors logements étudiants/meublés). À l'échelle de toute la ville, la médiane des annonces est plus basse (≈ 1 500 CHF). Affiché en CHF ; € et CHF sont proches de la parité. « * » devant une commune française = studio non publié par Le Figaro, loyer 2-pièces affiché."}
          </p>
          <p className="text-xs text-[#A8A29E] mt-2">
            {en
              ? "° Expansion town (Annecy, Évian, Bonneville): outside the immediate corridor — excluded from the commute-band averages below, but kept in the table."
              : "° Commune d'élargissement (Annecy, Évian, Bonneville) : hors corridor immédiat — exclue des moyennes par palier ci-dessous, mais conservée dans le tableau."}
          </p>
        </div>
      </section>

      {/* ===== PALIERS DE TRAJET ===== */}
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
          <div className="grid sm:grid-cols-3 gap-4">
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
        </div>
      </section>

      {/* ===== ENCADRÉ — Et côté France ? Un marché ouvert ===== */}
      <section className="py-10 lg:py-12 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="border-l-4 border-[#6B8E6B] bg-[#FAF9F6] rounded-r-xl p-5 sm:p-6">
            <h3 className="text-base font-semibold text-[#1C1917] mb-2">
              {en ? "On the French side: an open market" : "Côté France : un marché ouvert"}
            </h3>
            <p className="text-sm text-[#57534E] leading-relaxed">
              {en
                ? "On the French side, the gap between advertised and effective rents is small: the market is open, without the protection mechanism that keeps Geneva's affordable stock largely out of reach for new entrants. For a household moving in, the relevant comparison is therefore between Geneva's advertised rent (~CHF 1,500) and the French advertised rent."
                : "Sur le versant français, l'écart entre loyer d'annonce et loyer effectivement pratiqué est faible : le marché y est ouvert, sans le mécanisme de protection qui maintient à Genève un parc abordable peu accessible aux nouveaux entrants. Pour un ménage qui s'installe, la comparaison pertinente oppose donc le loyer d'annonce genevois (~1 500 CHF) au loyer d'annonce français."}
            </p>
          </div>
        </div>
      </section>

      {/* ===== MÉTHODO ===== */}
      <section className="py-12 lg:py-16 bg-[#FAF9F6]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-xl font-medium text-[#1C1917] mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-[#D4A574]" />
            {en ? "Method & sources" : "Méthodologie & sources"}
          </h2>
          <div className="text-sm text-[#57534E] space-y-4 leading-relaxed">
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
                <li>{en ? "Listings (newcomers): survey of studios ≤ 37 m² let unfurnished in the City of Geneva, June 2026 — median ≈ 50 CHF/m² (n = 25). Net rents (excl. heating) on both sides, to compare like with like." : "Annonces (arrivants) : relevé de studios ≤ 37 m² loués vides en Ville de Genève, juin 2026 — médiane ≈ 50 CHF/m² (n = 25). Loyers nets (hors chauffage) des deux côtés, pour comparer ce qui est comparable."}</li>
                <li>{en ? "Both cover the same area and the same type of home: the +44% gap is a genuine established-vs-newcomer comparison, not an artefact." : "Les deux portent sur le même périmètre et le même type de logement : l'écart de +44 % est donc une vraie comparaison installés / arrivants, pas un artefact."}</li>
                <li>{en ? "“8-min” benchmark: advertised studio rent in Geneva-Eaux-Vives ≈ 1,750 CHF/month — a premium neighbourhood; city-wide the median asking rent is lower (≈ 1,500 CHF). Shown in CHF; € and CHF near parity, so the figures read side by side." : "Repère « 8 min » : loyer d'annonce d'un studio à Genève-Eaux-Vives ≈ 1 750 CHF/mois — quartier premium ; la médiane des annonces de toute la ville est plus basse (≈ 1 500 CHF). Affiché en CHF ; € et CHF étant proches de la parité, les chiffres se lisent côte à côte."}</li>
              </ul>
            </div>
            <div>
              <strong className="text-[#1C1917]">{en ? "France — an open market, and honesty about sources." : "France — un marché ouvert, et une honnêteté sur les sources."}</strong>
              <ul className="list-disc pl-5 mt-1.5 space-y-1">
                <li>{en ? `Rents: advertised studio rent per m² by municipality, surveyed in June 2026, × ${REF_M2} m² reference (listings portal in the sources line below). Indicative orders of magnitude — few listings in small towns, so read with care. 14 of 17 towns have a published studio rate; the other 3 (marked *) use the 2-room rent.` : `Loyers : loyers d'annonce d'un studio au m² par commune, relevés en juin 2026, × ${REF_M2} m² de référence (portail des annonces en note de sources ci-dessous). Ordres de grandeur indicatifs — sur les petites communes, peu d'annonces, donc à lire avec prudence. 14 communes sur 17 ont un studio publié ; les 3 autres (marquées *) reprennent le loyer 2-pièces.`}</li>
                <li>{en ? "Official cross-check: we cross-checked the ANIL rent map (1- and 2-room flats, charges included). The ranking between towns is the same, and the French market comes out far below Geneva. For transparency: our studio listing figures sit a little above the ANIL 1–2-room estimate, for two legitimate reasons — a studio (≈ 30 m²) rents higher per m² than a 37 m² reference, and ANIL is a model smoothed over several years while our survey is live. ANIL is a broader, older benchmark: it confirms the order of magnitude, it doesn't contradict it." : "Corroboration officielle : on a recoupé avec la Carte des loyers de l'ANIL (appartements T1-T2, charges comprises). La hiérarchie entre communes est la même, et le marché français ressort très en-dessous de Genève. Pour la transparence : nos chiffres d'annonce studio sont un peu au-dessus de l'estimation ANIL T1-T2, pour deux raisons légitimes — un studio (≈ 30 m²) se loue plus cher au m² qu'un T1-T2 de référence (37 m²), et l'ANIL est une estimation modélisée lissée sur plusieurs années quand notre relevé est live. L'ANIL est un repère plus large et plus ancien : il confirme l'ordre de grandeur, il ne le contredit pas."}</li>
                <li>{en ? "No two-speed market on the French side: unlike Geneva, ANIL isn't a protected “stock” rent — it's already a listings measure. The small gap with our survey is a size and vintage effect, not a locked stock. So we don't put the French gap on the same footing as Geneva's." : "Pas de marché à deux vitesses côté France : contrairement à Genève, l'ANIL n'est pas un loyer de « stock » protégé — c'est déjà une mesure d'annonces. Le petit écart avec nos relevés est un effet de taille et de millésime, pas un parc verrouillé. On ne met donc pas l'écart français sur le même plan que l'écart genevois."}</li>
              </ul>
            </div>
            <p>
              <strong className="text-[#1C1917]">{en ? "Commute." : "Trajet."}</strong>{" "}
              {en
                ? "Door-to-door to Geneva-Eaux-Vives at morning peak (arrival ~9:15), surveyed on online maps for car and public transport; bike via the greenway. Direct Léman Express times and peak frequency come from the official 2026 timetable."
                : "Porte-à-porte vers Genève-Eaux-Vives à l'heure de pointe (arrivée ~9h15), relevé sur cartes en ligne pour la voiture et les transports publics ; vélo par la voie verte. Les temps Léman Express directs et la cadence en pointe proviennent de l'horaire officiel 2026."}
            </p>
            <p>
              <strong className="text-[#1C1917]">{en ? "Independence." : "Indépendance."}</strong>{" "}
              {en
                ? "La Villa Coliving edits this observatory: it appears in none of the figures. The data is freely reusable with attribution (CC-BY) and downloadable above."
                : "La Villa Coliving est l'éditrice de cet observatoire : elle n'apparaît dans aucun chiffre. Les données sont librement réutilisables avec mention de la source (CC-BY) et téléchargeables ci-dessus."}
            </p>
            <p className="text-xs text-[#A8A29E]">
              {en
                ? "Sources: OCSTAT (cantonal rent statistics, Geneva); advertised rents surveyed June 2026 (Le Figaro Immobilier for France); ANIL rent map — “ANIL estimates, based on data from Groupe SeLoger and leboncoin”; Léman Express 2026 timetable. Edition 1: left-bank / Léman Express corridor → Geneva-Eaux-Vives."
                : "Sources : OCSTAT (statistique cantonale des loyers, Genève) ; loyers d'annonce relevés en juin 2026 (Le Figaro Immobilier pour la France) ; Carte des loyers — « Estimations ANIL, à partir des données du Groupe SeLoger et de leboncoin » ; horaires Léman Express 2026. Édition 1 : corridor rive gauche / Léman Express → Genève-Eaux-Vives."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-7">
            <a
              href={CSV_URL}
              download="observatoire-loyer-trajet-geneve-2026.csv"
              className="inline-flex items-center gap-2 bg-[#1C1917] text-white px-6 py-3 text-sm uppercase tracking-wider hover:bg-[#44403C] transition-colors rounded-md"
            >
              <Download className="w-4 h-4" />
              {en ? "France corridor data (CSV)" : "Données corridor France (CSV)"}
            </a>
            <a
              href={CSV_GENEVA_URL}
              download="observatoire-geneve-deux-vitesses-2026.csv"
              className="inline-flex items-center gap-2 border border-[#1C1917] text-[#1C1917] px-6 py-3 text-sm uppercase tracking-wider hover:bg-[#1C1917] hover:text-white transition-colors rounded-md"
            >
              <Download className="w-4 h-4" />
              {en ? "Geneva two-speed data (CSV)" : "Données Genève deux vitesses (CSV)"}
            </a>
          </div>
          <p className="text-xs text-[#A8A29E] mt-2">{en ? "Free to reuse with attribution (CC-BY)." : "Réutilisable librement avec mention de la source (CC-BY)."}</p>
        </div>
      </section>

      {/* ===== PIED — La Villa éditrice (sobre) ===== */}
      <section className="py-14 lg:py-20 bg-white border-t border-[#E7E5E4]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <MapPin className="w-6 h-6 text-[#D4A574] mx-auto mb-3" />
          <p className="text-[#57534E] leading-relaxed mb-6">
            {en
              ? "This observatory is published by La Villa Coliving, which runs all-inclusive coliving houses on the French side of Geneva. Want a turnkey room without the apartment hunt?"
              : "Cet observatoire est publié par La Villa Coliving, qui gère des maisons de coliving tout inclus côté France. Envie d'une chambre clé en main sans la chasse à l'appartement ?"}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <LocalizedLink
              to="/colocation-geneve"
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
      </section>
    </main>
  );
}

function Th({ children, onClick, right, active }: { children: ReactNode; onClick: () => void; right?: boolean; active?: boolean }) {
  return (
    <th
      onClick={onClick}
      className={`px-3 py-2.5 cursor-pointer select-none font-medium ${right ? "text-right" : "text-left"} ${active ? "text-[#D4A574]" : "text-[#57534E]"}`}
    >
      {children}
    </th>
  );
}

function Td({ children, active }: { children: ReactNode; active?: boolean }) {
  return (
    <td className={`px-3 py-2.5 text-right whitespace-nowrap ${active ? "text-[#1C1917] font-medium" : "text-[#78716C]"}`}>
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
      <td className="px-3 py-2.5 text-right whitespace-nowrap">
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
    <td className="px-3 py-2.5 text-right whitespace-nowrap">
      <div className="leading-tight">
        <div className={`font-medium ${primary}`}>{c.pt} min</div>
        <div className="text-[10px] text-[#A8A29E]">{c.tram ? "Tram 17" : "Bus / tram"}</div>
      </div>
    </td>
  );
}
