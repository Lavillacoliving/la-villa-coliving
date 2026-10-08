/**
 * Garde CI de la fiche de faits canonique (Lot S1.3, brief « Socle entité », 05/09/2026).
 *
 * Compare la SOURCE (src/data/entityFacts.ts, chargée via esbuild) à :
 *   a) la BASE : v_public_rooms (clé anon, lecture seule) — chambres par maison et total, min/max rent_chf
 *      et rent_eur, chambres à salle d'eau partagée, surfaces = Math.round(min/max) (règle du Lot 7) ;
 *   b) le HTML prérendu : le bloc <aside id="entity-facts"> présent EXACTEMENT une fois sur les 14 pages
 *      money + 8 articles (FR et EN), version identique, chaque phrase canonique présente une fois ;
 *      0 bloc ailleurs ; aucune chaîne périmée (1 380 CHF, ménage 2×, 25-35 min, séjour 2 mois, bail 1 à
 *      12 mois, placeholders) dans le texte visible du site ; JSON-LD : ≤ 1 LocalBusiness/LodgingBusiness
 *      d'entité et ≤ 1 FAQPage par page, 0 aggregateRating, numberOfRooms cohérents, aucun Offer/AggregateOffer
 *      de premier niveau contradictoire (jsonLdConflicts, 08/10/2026) ;
 *   c) public/llms.txt et public/en/llms.txt = régénération (scripts/build-llms-txt.mjs).
 *   d) (Lot L2 « Emplacement et transport », 09/10/2026) règles d'emplacement : formulations D6/D7 interdites partout
 *      (« mitoyenne », « TPN », numéros de bus, « tram à 1 min », « 500 m, 5 min à pied », « CHUV », « terminus du
 *      Léman Express »…), « 15 min » en rapport avec Genève même en voiture (D1), et — pages en CODE seulement (hors
 *      blog-*) — toute promesse en voiture ou durée vers l'aéroport. Les deux dernières suivent le régime de la règle
 *      des minutes : échec en --strict, avertissement sinon. Fonctions pures testées dans tools/test/location-rules.test.mjs.
 *   e) (Lot L3 « Note Google et preuves », 09/10/2026, décisions D3/D4 de Jérôme) preuves sociales : « 4,9/5 » / « 4.9/5 »,
 *      « enquêtes résidents » / « resident surveys », « 150 résidents », « 50+ personnes » interdits partout ; « 99 % » à côté
 *      d'« occupation » / « occupancy » / « taux » interdit hors Observatoire (qui garde son « 98-99 % » first-party daté) ;
 *      JSON-LD : 0 aggregateRating et 0 « "@type": "Review" » (la note Google se lit sur la fiche, jamais balisée sur son
 *      propre site). Base : v_social_proof (resident_history ∪ tenants, dédoublonnés) — mode adaptatif : avertissement tant
 *      que la vue n'existe pas (migration scripts/resident-history-2026-10-09.sql à appliquer par Jérôme), échec si elle
 *      existe et que distinct_residents_since_opening < STATS.totalResidents. Fonctions pures : tools/test/social-proof-rules.test.mjs.
 * Options : --no-db (hors ligne) · --strict (règle des minutes, règles L2 et vouvoiement en échec, pas en avertissement)
 * (Lot L4 « Justification du prix », D8, 10/10/2026) FAQ A.3 exactement 1× sur PRICE_FAQ_ROUTES (FR/EN), 0× ailleurs ; phrase-clé A.4
 * 2× sur /tarifs (chapeau + fiche), 1× sur les autres pages de la fiche ; l'ancienne question « pourquoi plus élevés » est interdite.
 *           --json-ld /route (dump des blocs JSON-LD d'une page dans tools/out/) · --tutoiement (rapport)
 * Modèle : scripts/house-pages-check.mjs (collecte, impression, exit 1). Exécuté par prerender.yml après
 * house-pages-check et avant hydration-check. En local : `npm run check:facts` après `npm run build:local`.
 */
import fs from 'fs/promises';
import path from 'path';
import https from 'https';
import { fileURLToPath, pathToFileURL } from 'url';
import { loadEntityFacts, ROOT } from './lib/load-entity-facts.mjs';
import { renderLlms, LLMS_FILES } from './build-llms-txt.mjs';
import { jsonLdContents, jsonLdServedKey } from './lib/prerendered-extract.mjs';

const PRERENDERED = path.join(ROOT, 'public', 'prerendered');
const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i === -1 ? null : (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true); };
const STRICT = args.includes('--strict');

// Même projet / clé anon (lecture seule) que scripts/prerender.mjs et scripts/house-pages-check.mjs.
const SUPABASE_URL = 'https://tefpynkdxxfiefpkgitz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZnB5bmtkeHhmaWVmcGtnaXR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4OTg5NDksImV4cCI6MjA4NjQ3NDk0OX0.X_Z85w6L4i1IkVevMK73hpFRClCpgh0Gh0WMY9pdDtw';

/** Pages money porteuses du bloc (D13, décision Jérôme 05/09) — FR ; l'EN est le miroir /en/… */
export const ENTITY_FACTS_MONEY_ROUTES = ['/', '/le-coliving', '/nos-maisons', '/lavilla', '/leloft', '/lelodge', '/tarifs', '/faq', '/qui-sommes-nous', '/annemasse-colocation', '/chambre-a-louer-annemasse', '/colocation-geneve', '/chambre-a-louer-geneve', '/chambres-disponibles'];
/** Pages où le vouvoiement est légitime (légal, B2B). */
const VOUVOIEMENT_ALLOW = /^(en-)?(mentions-legales|politique-de-confidentialite|investisseurs)\.html$/;

const FORBIDDEN = [
  { re: /1[\u00A0\u202F ]?380 CHF|1,380 CHF|CHF 1,380/, label: 'ancien prix « 1 380 CHF »' },
  { re: /(2|deux) fois par semaine|twice a week|2[x×]\s?\/?\s?(semaine|week)\b/i, label: 'ménage « 2 fois par semaine »' },
  // « 25-35 minutes » n'est interdit que non qualifié (une piste cyclable via Moillesulaz peut prendre 25-35 min).
  { re: /25[\u00A0\u202F ]?(à|-|–|to)[\u00A0\u202F ]?35[\u00A0\u202F ]?min/i, label: '« 25 à 35 minutes » (trajet Genève non qualifié)', unlessQualified: true },
  { re: /minimum stay (?:of|is) two months|séjour minimum (?:de|est de) deux mois|minimum de deux mois/i, label: '« séjour minimum deux mois »' },
  { re: /bail flexible 1 à 12 mois|1 à 12 mois|1 to 12 months/i, label: '« bail 1 à 12 mois »' },
  // Délai d'emménagement La Villa (décision 29/09/2026) : « 72 h dès le premier contact si une chambre est disponible ».
  // Exempté dans une phrase qui parle du marché (studio, colocation classique, régie…) ; les témoignages (« j'ai emménagé 2 semaines après ») ne matchent pas.
  { re: /emménag\w*(?:[\u00A0\u202F ]+[\wÀ-ÿ'’-]+){0,3}?[\u00A0\u202F ]+en[\u00A0\u202F ]+(?:moins d['’]une|une|1|deux|2|1 à 2|2 à 4)[\u00A0\u202F ]+semaines?|emménagement 1 sem\.|(?:1 à 2|2 à 4) semaines entre la candidature|en moyenne 2 à 4 semaines|move[- ]in(?:[\u00A0\u202F ]+\S+){0,3}?[\u00A0\u202F ]+within[\u00A0\u202F ]+(?:a|one|1|2|two|1-2|2 to 4)[\u00A0\u202F ]+weeks?|(?:1-2|2 to 4) weeks from (?:initial )?application|usually 2 to 4 weeks|une semaine suffit quand la chambre|one week is enough when the room|visite peut s['’]organiser sous 2 semaines|visit can be organi[sz]ed within 2 weeks/i, unless: /colocation classique|classic flatshare|studio|appartement|\bflat\b|régie|letting agency|Airbnb|marché|market/i, label: '« emménagement en une/deux semaines » (délai = 72 h dès le premier contact si une chambre est disponible, décision 29/09/2026)' },
  { re: /engagement minimum de|minimum commitment of|(?<![\d,.])(trois|3) mois minimum|(?<![\d,.])(three|3)-month minimum|(notre )?format (d'accueil )?commence à (trois|3) mois|our format starts at (three|3) months|engagement de (trois|3) mois|(three|3)-month commitment/i, label: '« engagement minimum de 3 mois » (retiré le 29/09/2026, D5 révisée)' },
  { re: /\[FAIT À CONFIRMER|\[À VÉRIFIER|\{\{[A-Z_]+\}\}/, label: 'placeholder' },
  // Décision Jérôme 07/09/2026 : train Annemasse → Cornavin ≈ 20 min. Les anciens « Cornavin 15 min » passaient la règle des
  // minutes (Cornavin = qualificatif) : interdits explicitement, dans les deux sens de la phrase.
  // Forme directe seulement (« Cornavin en 15 min », « Cornavin: 15 min ») : la forme inverse « …15 min, à Cornavin en 22 min »
  // (Eaux-Vives puis Cornavin dans la même phrase) est légitime.
  { re: /Cornavin[^.!?,;()]{0,12}\b15 ?min/i, label: '« Cornavin 15 min » (train ≈ 20 min depuis le 07/09)' },
  // ── (Lot L2 « Emplacement et transport », 09/10/2026) formulations d'emplacement interdites, toutes pages sauf légales ──
  // D6 — la frontière de La Villa : le Foron, rivière-frontière, borde la rue (src/data/houseLocation.ts). Singulier
  // seulement (« communes mitoyennes » = les communes entre elles), « adjoins » (pas « adjoining towns »), « border next door ».
  { re: /\bmitoyenne\b|\badjoins\b|border-adjacent|border next door/i, label: 'frontière « mitoyenne » (D6 : le Foron, rivière-frontière, borde la rue)' },
  // « right on the border » est la phrase de quartier A.2 du Loft (Ambilly, D6) : exempté quand la phrase nomme Ambilly.
  { re: /right on the border/i, unless: /Ambilly/i, label: '« right on the border » hors Ambilly (D6)' },
  // D7 — aucun numéro de ligne de bus ; « TPN » = réseau de Nyon ; un arrêt s'écrit « arrêt de bus <nom> à N min à pied ».
  { re: /\bTPN\b/, label: '« TPN » (réseau de Nyon — D7)' },
  // « bus 7 » seul n'est un numéro de ligne que s'il n'est pas suivi d'une unité : « the bus 7 minutes away » est une durée (09/10/2026).
  { re: /\bligne 61\b|\bline 61\b|ligne de bus 7\b|\bbus 7\b(?![   ]?min)|bus line 7\b/i, label: 'numéro de ligne de bus (D7 : arrêt nommé, sans numéro)' },
  { re: /Place de l['’]Étoile à 1 min/i, label: '« Place de l\'Étoile à 1 min » (D7 : Parc Montessuit à 13 min à pied)' },
  { re: /(?<![\d,.\-–])1 min à pied|(?<![\d,.\-–])1-minute walk/i, requires: /\btram/i, label: '« tram à 1 min à pied » (D7)' },
  { re: /au pas de la porte/i, label: '« au pas de la porte » (D7)' },
  { re: /500[   ]?m, 5 min (?:à pied|walk)/i, label: '« 500 m, 5 min à pied » (Loft : frontière à 600 m, 8 min à pied — D6)' },
  { re: /\bCHUV\b/, label: '« CHUV » (l\'hôpital de Genève est le HUG)' },
  { re: /terminus (?:\p{L}+ )?du Léman Express|(?:\p{L}+ )?terminus of the Léman Express|Léman Express terminus/iu, label: '« terminus du Léman Express » (faux : écrire « gare d\'Annemasse »)' },
  // « autoroute A40 » n'est PAS ici : un article peut conseiller d'éviter ses abords (bruit) ; sur une page en code,
  // c'est une promesse routière → règle « promesse en voiture » (carPromiseIssues, A40_RE).
  // ── (Lot L3 « Note Google et preuves », décisions D3/D4 de Jérôme du 09/10/2026) preuves sociales, toutes pages sauf légales ──
  // D4 — la seule note publiée est GOOGLE_REVIEWS (« 4,8/5 sur Google (36 avis) », STATS_DISPLAY.googleRating, src/data/stats.ts) ;
  // l'ancienne note interne « 4,9/5 (enquêtes résidents) » disparaît de toutes les pages (12 pages + 2 articles en base).
  { re: /(?<![\d,.])4[,.]9[   ]?(?:\/[   ]?5\b|(?:sur|out of)[   ]5\b)/i, label: '« 4,9/5 » (ancienne note interne — D4 : la seule note est GOOGLE_REVIEWS, étiquetée « sur Google »)' },
  { re: /enquêtes? résidents?|resident surveys?/i, label: '« enquêtes résidents » / « resident surveys » (D4 : la note est celle de Google, étiquetée « sur Google »)' },
  // D3 — « 100+ résidents » est la seule formule (STATS.totalResidents, soutenue par v_social_proof) : jamais 150, jamais « 50+ par an ».
  // Le nombre n'est pas la fin d'un autre (« 1 150 résidents » du marché : séparateur de milliers normal ou insécable).
  { re: /(?<![\d,.]|\d[   ])150[   ]?\+?[   ]?r[ée]sidents?\b/i, label: '« 150 résidents » (D3 : « 100+ », STATS.totalResidents)' },
  { re: /(?<![\d,.]|\d[   ])50[   ]?\+[   ]?(?:personnes|people|r[ée]sidents?)\b/i, label: '« 50+ personnes par an » (D3 : retiré)' },
  // D3 — « 99 % d'occupation (sur 5 ans) » retiré ; seul l'Observatoire garde son « 98-99 % » (méthodologie first-party datée).
  // Contexte = fenêtre de ±NEAR_WINDOW caractères du texte visible aplati (`near`) : la tuile voisine d'une grille de statistiques
  // (« 99% » dans un bloc, « Taux d'occupation » dans le suivant) compte — une phrase seule ne suffirait pas. Le « 99 » peut
  // suivre un tiret (« 98-99 % ») : hors Observatoire, c'est aussi interdit.
  { re: /(?<![\d,.])99[   ]?%/, near: /occup(?:ation|ancy|é|ied)|\btaux\b|\brate\b/i, skipFile: /^(en-)?observatoire/, label: '« 99 % » d\'occupation (D3 : retiré ; l\'Observatoire seul garde son « 98-99 % » daté)' },
  // ── (Lot L4 « Justification du prix », D8 de Jérôme du 09/10/2026) l'ancienne FAQ « pourquoi plus élevés » (tarifsFaq index 1 et
  // faqData why-higher-prices) est remplacée par la FAQ A.3 de src/data/priceFacts.ts : la question périmée ne doit réapparaître nulle part.
  { re: /Pourquoi les prix sont-ils plus élevés qu['’]une colocation classique|Why are your prices higher than a standard flatshare/i, label: 'ancienne FAQ « pourquoi plus élevés » (D8 : remplacée par la FAQ A.3, src/data/priceFacts.ts)' },
];
/** (Lot L3) Demi-largeur, en caractères, de la fenêtre de contexte des règles `near`. */
export const NEAR_WINDOW = 120;
/** (Lot L3) Première fenêtre de ±span caractères autour d'une occurrence de `re` dans `text` qui porte aussi `near` ; null sinon. */
export function nearWindow(text, re, near, span = NEAR_WINDOW) {
  const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : `${re.flags}g`);
  for (const m of String(text).matchAll(g)) {
    const win = text.slice(Math.max(0, m.index - span), m.index + m[0].length + span);
    if (near.test(win)) return win;
  }
  return null;
}
// (Lot L2, 09/10/2026) + Rive, Champel, Lancy, Puplinge, Foron, Voie Verte, porte-à-porte / door to door : destinations et
// modes nommés par TRANSIT (src/data/stats.ts) — une minute qualifiée par l'un d'eux n'est pas « Genève seul ».
export const MINUTE_QUALIFIER = /(?<![\p{L}\p{N}])(?:à pied|on foot|walk\p{L}*|vélo|bike|cycl\p{L}*|voiture|car|driving|aéroport|airport|bus|tram\p{L}*|Cornavin|Eaux-Vives|Rive|Champel|Lancy|Puplinge|Foron|Voie Verte|porte[ -]à[ -]porte|door[ -]to[ -]door|CERN|Nations|heure de pointe|rush hour|gare|station|Léman Express|CEVA|Moillesulaz|frontière|border|visio|vidéo|video|appel|call|Annemasse[ \-–↔]+Gen[èe]v[ea])(?![\p{L}\p{N}])/iu;

// ── (Lot L2, 09/10/2026) règles d'emplacement — fonctions pures (tools/test/location-rules.test.mjs) ──────────────
// Espaces admis entre un nombre et son unité : normal, insécable U+00A0 (thousands(), « 15 min » prérendu), fine U+202F.
/** Page dont le texte vient du CODE (money, maisons, FAQ…) ; blog-*, en-blog-* et l'index du blog viennent de la base. */
export const isCodePage = (file) => !/^(en-)?blog(-|\.html$)/.test(file);
export const GENEVA_RE = /Gen[èe]v[ea]/i;
/**
 * Formes interdites de D1 : « 15 min », « 15 minutes », « 15-minute », « 15-20 min », « 15 à 20 min », « 15 to 20 minutes »
 * (le 15 n'est pas la fin d'un autre nombre : « 115 min », « 2.15 » passent). Une autre fourchette qui commence par 15
 * (« 15-25 min » d'un tableau de marché sur une colocation À Genève) n'est pas visée : décision à prendre page par page.
 */
export const FIFTEEN_MIN_RE = /(?<![\d,.])15(?:[   ]?(?:[-–]|à|to)[   ]?20)?[   ]?(?:min\b|minutes?\b|-minute\b)/i;
/**
 * Seules exceptions (D1), toutes rattachées AU 15 (pas à la phrase entière, sinon « 15 min en voiture, gare à 5 min à pied »
 * passerait) : marche (« 15 minutes à pied », « a 15-minute walk », « walking 15 minutes »), cadence (« toutes les 15 »,
 * « every 15 »), supplément (« 15 min de plus / plus loin / extra / additional »), temps de lecture (« 15 min de lecture »).
 */
export const FIFTEEN_MIN_EXEMPT = [
  /15(?:[   ]?(?:[-–]|à|to)[   ]?20)?[   ]?(?:min(?:utes?)?['’]?|-minute)[   ]?(?:à pied|on foot|walk|walking|de marche)/i,
  /\b(?:walk|walking|marche|marcher)[^.;!?]{0,12}?(?<![\d,.])15\b/i,
  /\b(?:toutes les|every)[^.;!?]{0,12}?(?<![\d,.])15\b/i,
  /(?<![\d,.])15[^.;!?]{0,20}?\b(?:de plus|plus loin|extra|supplémentaires?|additional)\b|\bextra[^.;!?]{0,8}?(?<![\d,.])15\b/i,
  /(?<![\d,.])15[   ]?min(?:utes?)?[   ]?(?:de lecture|read)\b/i,
];
export const isFifteenExempt = (sentence) => FIFTEEN_MIN_EXEMPT.some((re) => re.test(sentence));
/**
 * Promesse en voiture : une durée (« 15 min », « 10-15 minutes », « 5-minute ») suivie de « en voiture », « by car »,
 * « drive / driving », d'une cellule « | Voiture » / « | Car » ou de « voiture (…) » / « car (…) » ; ou une durée précédée
 * de « voiture : » / « car: » / « driving: ». « car » seul n'est jamais pris (conjonction française).
 */
export const CAR_MINUTES_RE = /(?<![\d,.])\d{1,3}(?:[   ]?(?:[-–]|à|to)[   ]?\d{1,3})?[   ]?(?:min\b|minutes?\b|-minute\b)[^.;!?]{0,30}?(?:\ben voiture\b|\bby car\b|\bdriv(?:e|ing)\b|\|[   ]?(?:voiture|car)\b|\b(?:voiture|car)(?=[   ]?\())|\b(?:voiture|car|driving|drive)[   ]?:[^.;!?]{0,25}?(?<![\d,.])\d{1,3}(?:[   ]?(?:[-–]|à|to)[   ]?\d{1,3})?[   ]?(?:min\b|minutes?\b|-minute\b)/iu;
/** Durée vers l'aéroport, dans un sens ou dans l'autre (« Aéroport de Genève : 25 min », « 30 minutes to the airport », « GVA … 40 min »). */
export const AIRPORT_MINUTES_RE = /(?:a[ée]roport|airport|\bGVA\b)[^.;!?]{0,80}?(?<![\d,.])\d{1,3}[   ]?(?:min\b|minutes?\b|-minute\b)|(?<![\d,.])\d{1,3}[   ]?(?:min\b|minutes?\b|-minute\b)[^.;!?]{0,50}?(?:a[ée]roport|airport|\bGVA\b)/iu;
/** L'autoroute A40 n'est jamais un argument d'accès sur une page en code (D1 : aucune promesse routière). */
export const A40_RE = /\bA40\b/;

export function routeToFile(route, lang) {
  const r = lang === 'en' ? (route === '/' ? '/en' : `/en${route}`) : route;
  return r === '/' ? 'index.html' : `${r.slice(1).replace(/\//g, '-')}.html`;
}
function httpsGet(url, headers) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => (res.statusCode >= 200 && res.statusCode < 300 ? resolve(JSON.parse(data)) : reject(new Error(`HTTP ${res.statusCode}: ${data}`))));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}
function decodeEntities(s) {
  return s
    .replace(/&nbsp;/g, ' ').replace(/&#160;/g, ' ')
    .replace(/&#x27;|&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(parseInt(d, 10)))
    .replace(/&amp;/g, '&');
}
/** Texte visible (sans <head>, <script>, <style>, balises), entités décodées, blancs repliés (U+00A0 conservé). */
export function visibleText(html) {
  const body = html.replace(/^[\s\S]*?<\/head>/, '').replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<!--[\s\S]*?-->/g, ' ');
  return decodeEntities(body.replace(/<[^>]+>/g, ' ')).replace(/[ \t\r\n]+/g, ' ').trim();
}
/** Blocs de texte visibles (un par élément de bloc ou de lien : p, li, h1-h6, td, a, button, div…). */
export function textBlocks(html) {
  const body = html.replace(/^[\s\S]*?<\/head>/, '').replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<!--[\s\S]*?-->/g, ' ');
  return body.split(/<\/(?:p|li|h[1-6]|td|th|dd|dt|figcaption|blockquote|a|button|summary|label|span|div|section|article|aside|header|footer|nav)>/i)
    .map((chunk) => decodeEntities(chunk.replace(/<[^>]+>/g, ' ')).replace(/[ \t\r\n]+/g, ' ').trim())
    .filter(Boolean);
}
/** (Lot L2) Lignes de tableau (<tr>…</tr>) en texte : une durée et sa destination vivent souvent dans deux cellules voisines. */
export function tableRows(html) {
  const body = html.replace(/^[\s\S]*?<\/head>/, '').replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<!--[\s\S]*?-->/g, ' ');
  return [...body.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)]
    .map((m) => decodeEntities(m[1].replace(/<\/t[dh]>/gi, ' | ').replace(/<[^>]+>/g, ' ')).replace(/[ \t\r\n]+/g, ' ').trim())
    .filter(Boolean);
}
/** Phrases du texte visible : blocs découpés à la ponctuation forte, plus les lignes de tableau entières. */
export function sentences(html) {
  return textBlocks(html).flatMap((b) => b.split(/(?<=[.!?;])\s+/)).concat(tableRows(html));
}
const norm = (s) => s.replace(/[ \t\r\n]+/g, ' ').trim();
const count = (hay, needle) => (needle ? hay.split(needle).length - 1 : 0);

/**
 * Chaînes interdites (FORBIDDEN) d'une page : un message par règle touchée, avec la première phrase fautive.
 * `file` (Lot L3, facultatif) = nom du fichier prérendu : une règle `skipFile` ne s'applique pas aux pages qu'il désigne.
 */
export function forbiddenIssues(html, text = visibleText(html), file = '') {
  const out = [];
  let sens = null;
  for (const fb of FORBIDDEN) {
    if (fb.skipFile && fb.skipFile.test(file)) continue;
    if (!fb.re.test(text)) continue;
    if (fb.near) {
      // (Lot L3) Interdit seulement quand le contexte proche (texte visible aplati, tuile voisine comprise) porte aussi `near`.
      const win = nearWindow(text, fb.re, fb.near);
      if (win) out.push(`${fb.label} — « …${win.slice(0, 160)}… »`);
      continue;
    }
    if (fb.unlessQualified || fb.unless || fb.requires) {
      // Interdit seulement dans une phrase sans qualificatif (à pied, vélo, Moillesulaz, aéroport…), hors exception propre
      // à la règle (`unless`), et — pour `requires` — seulement quand la phrase porte aussi ce contexte (ex. « tram »).
      const exempt = fb.unless ?? (fb.unlessQualified ? MINUTE_QUALIFIER : null);
      sens ??= sentences(html);
      const bad = sens.filter((sen) => fb.re.test(sen) && !(exempt && exempt.test(sen)) && (!fb.requires || fb.requires.test(sen)));
      if (bad.length === 0) continue;
      out.push(`${fb.label} — « ${bad[0].slice(0, 120)}… »`);
      continue;
    }
    const i = text.search(fb.re);
    out.push(`${fb.label} dans le texte visible — « …${text.slice(Math.max(0, i - 60), i + 60)}… »`);
  }
  return out;
}

/**
 * Règle des minutes (S2, 07/09/2026) : dans un bloc de texte (p, li, h*, td…) qui nomme Genève, toute valeur « N min »
 * ≠ canonique doit être qualifiée (à pied, tram, Cornavin, aéroport…). Temps de lecture ignorés. Sur les blocs seulement
 * (pas les lignes de tableau entières : comportement inchangé depuis S2, la CI tourne en --strict).
 */
export function minuteIssues(html, genevaMinutes) {
  const out = [];
  for (const sentence of textBlocks(html).flatMap((b) => b.split(/(?<=[.!?;])\s+/))) {
    if (!GENEVA_RE.test(sentence)) continue;
    const ms = [...sentence.matchAll(/(?<![\d,.])(\d{1,2})[   ]?(?:min\b|minutes?\b)(?![   ]?(?:de lecture|read))/gi)].map((x) => Number(x[1]));
    for (const v of ms) if (v !== genevaMinutes && !MINUTE_QUALIFIER.test(sentence)) out.push(`« ${v} min » non canonique ni qualifié — « ${sentence.slice(0, 110)}… »`);
  }
  return out;
}

/** Un message par texte fautif distinct (une cellule et sa ligne de tableau ne comptent qu'une fois). */
function collectMatches(html, rules) {
  const seen = new Set(), out = [];
  for (const s of sentences(html)) {
    for (const r of rules) {
      const m = r.test(s);
      if (!m || seen.has(`${r.label}|${m}`)) continue;
      seen.add(`${r.label}|${m}`);
      out.push(`${r.label} — « ${s.slice(0, 120)}… »`);
    }
  }
  return out;
}

/** (Lot L2, D1) « 15 min » dans une phrase qui nomme Genève — interdit même qualifié par la voiture (exceptions : isFifteenExempt). */
export function geneva15Issues(html) {
  return collectMatches(html, [{
    label: '« 15 min » en rapport avec Genève (D1 : n\'existe plus, même en voiture)',
    test: (s) => (GENEVA_RE.test(s) && !isFifteenExempt(s) ? s.match(FIFTEEN_MIN_RE)?.[0] : null),
  }]);
}

/** (Lot L2, D1) Pages en CODE seulement : promesse en voiture, durée vers l'aéroport ou autoroute A40 = à supprimer, pas à qualifier. */
export function carPromiseIssues(html) {
  return collectMatches(html, [
    { label: 'promesse en voiture (jamais, D1)', test: (s) => s.match(CAR_MINUTES_RE)?.[0] },
    { label: 'durée vers l\'aéroport (jamais, D1)', test: (s) => s.match(AIRPORT_MINUTES_RE)?.[0] },
    { label: '« autoroute A40 » (jamais de promesse routière, D1)', test: (s) => s.match(A40_RE)?.[0] },
  ]);
}
function jsonLdBlocks(html) {
  const out = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try { out.push(JSON.parse(decodeEntities(m[1]))); } catch { out.push({ __invalid: m[1].slice(0, 80) }); }
  }
  return out;
}
function collectTypes(node, acc = []) {
  if (Array.isArray(node)) node.forEach((n) => collectTypes(n, acc));
  else if (node && typeof node === 'object') { if (node['@type']) acc.push(node); for (const v of Object.values(node)) collectTypes(v, acc); }
  return acc;
}
const hasType = (n, t) => (Array.isArray(n['@type']) ? n['@type'].includes(t) : n['@type'] === t);

/**
 * (Lot L3, D4 Jérôme 09/10/2026) Aucune note balisée : ni aggregateRating (interdit depuis S1 — la note 4,9 était un NPS
 * interne ; la note Google ne se balise pas davantage sur son propre site), ni « "@type": "Review" ». La preuve = un lien
 * « Voir les avis » vers la fiche Google (GOOGLE_REVIEWS.url). `nodes` = nœuds JSON-LD déjà collectés (évite une relecture).
 */
export function ratingMarkupIssues(html, nodes = collectTypes(jsonLdBlocks(html))) {
  const out = [];
  if (/aggregateRating/.test(html)) out.push('aggregateRating interdit (D4 : la note Google se lit sur la fiche, jamais balisée sur son propre site)');
  if (nodes.some((n) => hasType(n, 'Review')) || /"@type"\s*:\s*"Review"/.test(html)) out.push('« "@type": "Review" » interdit en JSON-LD (D4 : aucun avis balisé, un lien « Voir les avis » vers la fiche Google)');
  return out;
}

// ── (Lot L3, D3 Jérôme 09/10/2026) « 100+ résidents » soutenu par la base ─────────────────────────────────────────────
export const SOCIAL_PROOF_VIEW = 'v_social_proof';
export const SOCIAL_PROOF_MIGRATION = 'scripts/resident-history-2026-10-09.sql';
/**
 * Verdict pur sur la lecture de v_social_proof. `result` = { rows } (vue lue) ou { error } (message d'erreur REST).
 * Mode adaptatif : vue absente (HTTP 404 / PGRST205 / 42P01, migration pas encore appliquée) → avertissement ; autre erreur
 * réseau → avertissement « injoignable » ; 401/403/42501 (vue présente, GRANT anon perdu) → échec ; vue présente → échec si
 * distinct_residents_since_opening < totalResidents.
 */
export function socialProofVerdict(result, totalResidents) {
  const failures = [], warnings = [];
  if (result.error !== undefined) {
    const msg = String(result.error);
    if (/HTTP 404|PGRST205|42P01/.test(msg)) warnings.push(`${SOCIAL_PROOF_VIEW} absente : migration ${SOCIAL_PROOF_MIGRATION} à appliquer (« ${totalResidents}+ résidents » non vérifié en base)`);
    // (relecture 10/10) 401/403/42501 = la vue existe mais anon ne peut plus la lire : GRANT perdu, pas une panne réseau → échec.
    else if (/HTTP 40[13]|42501|permission denied/i.test(msg)) failures.push(`${SOCIAL_PROOF_VIEW} présente mais non lisible en anon (${msg.slice(0, 80)}) : rejouer le GRANT SELECT de ${SOCIAL_PROOF_MIGRATION}`);
    else warnings.push(`${SOCIAL_PROOF_VIEW} injoignable (${msg.slice(0, 120)}) — comparaison ignorée`);
    return { failures, warnings, info: null };
  }
  const row = Array.isArray(result.rows) ? result.rows[0] : undefined;
  const n = Number(row?.distinct_residents_since_opening);
  if (!row || !Number.isFinite(n)) {
    failures.push(`base : ${SOCIAL_PROOF_VIEW} présente mais sans distinct_residents_since_opening lisible (${JSON.stringify(result.rows).slice(0, 120)})`);
    return { failures, warnings, info: null };
  }
  const info = { distinct: n, since: row.first_move_in ?? null, occupancyPctAll: row.occupancy_pct_all ?? null, computedOn: row.computed_on ?? null };
  if (n < totalResidents) failures.push(`base : ${n} résidents distincts depuis l'ouverture (${SOCIAL_PROOF_VIEW}) < STATS.totalResidents ${totalResidents} — « ${totalResidents}+ résidents » n'est plus soutenu`);
  return { failures, warnings, info };
}

const OFFER_TYPES = new Set(['Offer', 'AggregateOffer']);
/**
 * (08/10/2026) Blocs JSON-LD de PREMIER NIVEAU en conflit. scripts/inject-prerendered.mjs ne sert que le
 * premier bloc de chaque @type (jsonLdServedKey) : deux blocs de même @type au contenu différent = l'un
 * des deux perdu, selon l'ordre du run. Cas d'origine : /colocation-geneve, Offer InStock + Offer PreOrder
 * laissé par une instance react-helmet fantôme (11 prérendus bot sur 13), Google voyait l'un ou l'autre.
 * Échec : Offer/AggregateOffer de premier niveau à disponibilité contradictoire, ou deux blocs Offer
 * (resp. AggregateOffer) différents. Avertissement : deux blocs différents de tout autre @type.
 * Les offres IMBRIQUÉES ne comptent pas : l'ItemList de /chambres-disponibles mêle légitimement des
 * chambres InStock et PreOrder, et l'AggregateOffer du LocalBusiness ne dépend pas de l'inventaire.
 */
export function jsonLdConflicts(html) {
  const byKey = new Map();
  const availabilities = new Set();
  let offers = 0;
  for (const content of jsonLdContents(html)) {
    const key = jsonLdServedKey(content);
    if (!byKey.has(key)) byKey.set(key, new Set());
    byKey.get(key).add(content.replace(/\s+/g, ' '));
    let j;
    try { j = JSON.parse(content); } catch { try { j = JSON.parse(decodeEntities(content)); } catch { continue; } }
    const top = Array.isArray(j) ? j : Array.isArray(j?.['@graph']) ? j['@graph'] : [j];
    for (const n of top) {
      if (!n || !OFFER_TYPES.has(n['@type'])) continue;
      offers++;
      if (n.availability) availabilities.add(String(n.availability).replace(/^https?:\/\/schema\.org\//, ''));
    }
  }
  const failures = [], warnings = [];
  if (availabilities.size > 1) failures.push(`${offers} blocs Offer/AggregateOffer à disponibilité contradictoire (${[...availabilities].join(' / ')}) — l'injection ne sert que le premier de chaque @type`);
  for (const [key, contents] of byKey) {
    if (contents.size < 2) continue;
    const msg = `${contents.size} blocs JSON-LD « ${key} » différents — l'injection ne sert que le premier`;
    if (!OFFER_TYPES.has(key)) warnings.push(msg);
    else if (availabilities.size <= 1) failures.push(msg);
  }
  return { failures, warnings };
}

async function checkDb(m) {
  const failures = [];
  const F = m.ENTITY_FACTS;
  const headers = { apikey: SUPABASE_ANON_KEY, Accept: 'application/json' };
  const rows = await httpsGet(`${SUPABASE_URL}/rest/v1/v_public_rooms?select=house_slug,rent_chf,rent_eur,surface_m2,bathroom_type`, headers);
  if (!Array.isArray(rows) || rows.length === 0) throw new Error('v_public_rooms vide');
  const byHouse = new Map();
  for (const r of rows) { if (!byHouse.has(r.house_slug)) byHouse.set(r.house_slug, []); byHouse.get(r.house_slug).push(r); }
  for (const h of F.houses) {
    const rs = byHouse.get(h.slug) ?? [];
    if (rs.length !== h.rooms) failures.push(`base : ${h.slug} a ${rs.length} chambre(s) dans v_public_rooms, la fiche dit ${h.rooms}`);
    const shared = rs.filter((r) => /shared|partag/i.test(String(r.bathroom_type ?? ''))).length;
    if (shared !== h.sharedBathRooms) failures.push(`base : ${h.slug} a ${shared} chambre(s) à salle d'eau partagée, la fiche dit ${h.sharedBathRooms}`);
  }
  if (rows.length !== F.totalRooms) failures.push(`base : ${rows.length} chambres publiques, la fiche dit ${F.totalRooms}`);
  const chf = rows.map((r) => Number(r.rent_chf)).filter(Number.isFinite);
  const eur = rows.map((r) => Number(r.rent_eur)).filter(Number.isFinite);
  const m2 = rows.map((r) => Number(r.surface_m2)).filter((n) => Number.isFinite(n) && n > 0);
  if (Math.min(...chf) !== F.price.fromChf) failures.push(`base : loyer CHF minimum ${Math.min(...chf)} ≠ prix d'appel ${F.price.fromChf}`);
  if (Math.max(...chf) !== F.price.standardChf) failures.push(`base : loyer CHF maximum ${Math.max(...chf)} ≠ ${F.price.standardChf}`);
  if (eur.length && Math.min(...eur) !== F.price.fromEur) failures.push(`base : loyer € minimum ${Math.min(...eur)} ≠ ${F.price.fromEur}`);
  if (eur.length && Math.max(...eur) !== F.price.standardEur) failures.push(`base : loyer € maximum ${Math.max(...eur)} ≠ ${F.price.standardEur}`);
  if (m2.length) {
    const lo = Math.round(Math.min(...m2)), hi = Math.round(Math.max(...m2));
    if (lo !== F.surfaces.min || hi !== F.surfaces.max) failures.push(`base : surfaces ${lo}-${hi} m² (Math.round de v_public_rooms) ≠ fiche ${F.surfaces.min}-${F.surfaces.max}`);
  }
  // (Lot L3, D3) « 100+ résidents » : v_social_proof (resident_history ∪ tenants, dédoublonnés sur le nom normalisé). La vue
  // n'existe pas tant que Jérôme n'a pas appliqué la migration → socialProofVerdict la traite en avertissement, pas en échec.
  const sp = await httpsGet(`${SUPABASE_URL}/rest/v1/${SOCIAL_PROOF_VIEW}?select=distinct_residents_since_opening,first_move_in,current_residents,occupancy_pct_all,computed_on`, headers)
    .then((r) => ({ rows: r })).catch((e) => ({ error: e.message }));
  const social = socialProofVerdict(sp, m.STATS.totalResidents);
  failures.push(...social.failures);
  return { failures, warnings: social.warnings, rooms: rows.length, social: social.info };
}

/** Slugs des pages de décision versionnées dans content/decision-pages/ (hors gabarit `_TEMPLATE`). */
export async function decisionPageSlugs() {
  try {
    const entries = await fs.readdir(path.join(ROOT, 'content', 'decision-pages'));
    return entries.filter((f) => f.endsWith('.meta.json') && !f.startsWith('_')).map((f) => f.replace(/\.meta\.json$/, '')).sort();
  } catch { return []; }
}

async function checkHtml(m) {
  const failures = [], warnings = [];
  const F = m.ENTITY_FACTS;
  const files = (await fs.readdir(PRERENDERED)).filter((f) => f.endsWith('.html')).sort();
  const inScope = new Map(); // file → lang
  for (const r of ENTITY_FACTS_MONEY_ROUTES) { inScope.set(routeToFile(r, 'fr'), 'fr'); inScope.set(routeToFile(r, 'en'), 'en'); }
  for (const slug of m.ENTITY_FACTS_ARTICLES ?? []) { inScope.set(`blog-${slug}.html`, 'fr'); inScope.set(`en-blog-${slug}.html`, 'en'); }
  // Pages de décision (brief « Conquête IA », C0) : elles posent le marqueur <!-- entity-facts --> dans leur
  // markdown, donc le bloc est rendu ; leur périmètre se déduit de content/decision-pages/<slug>.meta.json.
  // Seules les pages publiées (fichier prérendu présent) entrent dans le périmètre : un brouillon n'a pas de HTML.
  for (const slug of await decisionPageSlugs()) {
    if (files.includes(`blog-${slug}.html`)) { inScope.set(`blog-${slug}.html`, 'fr'); inScope.set(`en-blog-${slug}.html`, 'en'); }
  }
  for (const f of inScope.keys()) if (!files.includes(f)) failures.push(`${f} : page prérendue ABSENTE (périmètre du bloc entité)`);
  const strings = { fr: m.entityFactsStrings('fr').map(norm), en: m.entityFactsStrings('en').map(norm) };
  // (Lot L4, D8) FAQ A.3 : 1× (question + réponse) sur PRICE_FAQ_ROUTES FR/EN, 0× ailleurs ; phrase-clé A.4 : 2× sur /tarifs
  // (chapeau du bloc tarifs + puce de la fiche entité), 1× sur toute autre page de la fiche (comparaison générique ci-dessous).
  const priceScope = new Map();
  for (const r of m.PRICE_FAQ_ROUTES ?? []) { priceScope.set(routeToFile(r, 'fr'), 'fr'); priceScope.set(routeToFile(r, 'en'), 'en'); }
  const priceFaq = m.priceJustificationFaq ? { fr: m.priceJustificationFaq('fr'), en: m.priceJustificationFaq('en') } : null;
  const keySentence = m.PRICE_KEY_SENTENCE ? { fr: norm(m.PRICE_KEY_SENTENCE.fr), en: norm(m.PRICE_KEY_SENTENCE.en) } : null;
  const keyRoute = m.PRICE_KEY_SENTENCE_ROUTE ?? '/tarifs';
  const keyFiles = new Set([routeToFile(keyRoute, 'fr'), routeToFile(keyRoute, 'en')]);
  for (const f of priceScope.keys()) if (!files.includes(f)) failures.push(`${f} : page prérendue ABSENTE (périmètre de la FAQ prix A.3)`);
  let blocks = 0, minuteWarnings = 0, locationIssues = 0, vousPages = 0;
  for (const f of files) {
    const html = await fs.readFile(path.join(PRERENDERED, f), 'utf8');
    const text = visibleText(html);
    const lang = inScope.get(f);
    const nBlocks = count(html, 'id="entity-facts"');
    if (lang) {
      blocks++;
      if (nBlocks !== 1) failures.push(`${f} : ${nBlocks} bloc(s) entité (attendu exactement 1)`);
      if (!html.includes(`data-entity-facts-version="${F.version}"`)) failures.push(`${f} : version du bloc ≠ ${F.version}`);
      for (const s of strings[lang]) {
        const n = count(text, s);
        const expected = keySentence && s === keySentence[lang] && keyFiles.has(f) ? 2 : 1; // A.4 : chapeau + fiche sur /tarifs
        if (n !== expected) failures.push(`${f} : phrase canonique présente ${n} fois (attendu ${expected}) — « ${s.slice(0, 70)}… »`);
      }
    } else if (nBlocks > 0) failures.push(`${f} : bloc entité hors périmètre (${nBlocks})`);
    // (Lot L4, D8) FAQ A.3 — texte identique au caractère près sur les pages du périmètre, absente ailleurs.
    if (priceFaq) {
      const pl = f.startsWith('en-') ? 'en' : 'fr';
      const nQ = count(text, norm(priceFaq[pl].q)), nA = count(text, norm(priceFaq[pl].a));
      if (priceScope.has(f)) {
        if (nQ !== 1 || nA !== 1) failures.push(`${f} : FAQ prix A.3 — question ${nQ}×, réponse ${nA}× (attendu 1 et 1)`);
      } else if (nQ + nA > 0) failures.push(`${f} : FAQ prix A.3 hors périmètre (question ${nQ}×, réponse ${nA}×)`);
      if (keySentence && !lang && count(text, keySentence[pl]) > 0) failures.push(`${f} : phrase-clé A.4 hors fiche entité`);
    }
    const legal = /^(en-)?(mentions-legales|politique-de-confidentialite)\.html$/.test(f);
    // Chaînes périmées ou interdites (texte visible) — dont les formulations D6/D7 du lot L2 et les preuves sociales du lot L3
    // (le nom du fichier porte l'exemption de l'Observatoire pour « 99 % »).
    if (!legal) for (const issue of forbiddenIssues(html, text, f)) failures.push(`${f} : ${issue}`);
    // (Lot L2, 09/10/2026) « 15 min » + Genève (toutes pages) ; promesse en voiture / aéroport (pages en code seulement).
    // Même régime que la règle des minutes : échec en --strict, avertissement sinon.
    if (!legal) {
      const l2 = geneva15Issues(html).concat(isCodePage(f) ? carPromiseIssues(html) : []);
      locationIssues += l2.length;
      for (const issue of l2) (STRICT ? failures : warnings).push(`${f} : ${issue}`);
    }
    // JSON-LD
    const nodes = collectTypes(jsonLdBlocks(html));
    const lb = nodes.filter((n) => n['@type'] === 'LocalBusiness').length;
    const lodgingOrg = nodes.filter((n) => n['@type'] === 'LodgingBusiness' && typeof n['@id'] === 'string' && n['@id'].endsWith('#organization')).length;
    const faq = nodes.filter((n) => n['@type'] === 'FAQPage').length;
    if (lb + lodgingOrg > 1) failures.push(`${f} : ${lb + lodgingOrg} fiches business d'entité (LocalBusiness/LodgingBusiness @organization) — une seule attendue`);
    if (faq > 1) failures.push(`${f} : ${faq} blocs FAQPage (un seul attendu)`);
    // (Lot L3, D4) 0 aggregateRating, 0 Review : la note Google n'est jamais balisée sur son propre site.
    for (const issue of ratingMarkupIssues(html, nodes)) failures.push(`${f} : ${issue}`);
    for (const n of nodes) if (n.numberOfRooms !== undefined) {
      const ok = [F.totalRooms, ...F.houses.map((h) => h.rooms)].includes(Number(n.numberOfRooms));
      if (!ok) failures.push(`${f} : numberOfRooms=${n.numberOfRooms} hors {${[F.totalRooms, ...F.houses.map((h) => h.rooms)].join(',')}}`);
    }
    for (const n of nodes) if (n['@type'] === 'AggregateOffer' && (String(n.lowPrice) !== String(F.price.fromChf) || String(n.highPrice) !== String(F.price.standardChf))) failures.push(`${f} : AggregateOffer ${n.lowPrice}-${n.highPrice} ≠ ${F.price.fromChf}-${F.price.standardChf}`);
    const conflicts = jsonLdConflicts(html);
    failures.push(...conflicts.failures.map((c) => `${f} : ${c}`));
    warnings.push(...conflicts.warnings.map((c) => `${f} : ${c}`));
    // Règle des minutes (S2) — minuteIssues() ; les pages de transport de l'Observatoire et du blog en sont exemptées.
    if (!/^(en-)?(observatoire|blog-(transport|temps-trajet|cout-transport))/.test(f)) {
      for (const issue of minuteIssues(html, F.genevaMinutes)) { minuteWarnings++; (STRICT ? failures : warnings).push(`${f} : ${issue}`); }
    }
    // Tutoiement (S4 — garde anti-régression, FR hors pages légales/B2B)
    if (!f.startsWith('en-') && !VOUVOIEMENT_ALLOW.test(f)) {
      const hits = [...text.matchAll(/(?<!rendez-)\bvous\b|\bvotre\b|\bvos\b/gi)].length;
      if (hits > 0) { vousPages++; warnings.push(`${f} : ${hits} forme(s) de vouvoiement`); } // toujours en avertissement, même en --strict (S4 = garde anti-régression)
    }
  }
  return { failures, warnings, files: files.length, blocks, minuteWarnings, locationIssues, vousPages };
}

async function checkLlms(m) {
  const failures = [];
  for (const lang of ['fr', 'en']) {
    const expected = await renderLlms(lang, m);
    const actual = await fs.readFile(LLMS_FILES[lang], 'utf8').catch(() => '');
    if (expected !== actual) failures.push(`${path.relative(ROOT, LLMS_FILES[lang])} : périmé par rapport à la source — lance « npm run build:llms »`);
  }
  return failures;
}

async function main() {
  console.log('\n🧾 Garde fiche entité — source × v_public_rooms × public/prerendered × llms.txt\n');
  const m = await loadEntityFacts();
  const failures = [];
  const internal = m.entityFactsIssues();
  failures.push(...internal.map((i) => `source : ${i}`));
  console.log(`   version ${m.ENTITY_FACTS.version} · ${m.ENTITY_FACTS.totalRooms} chambres · dès ${m.ENTITY_FACTS.price.fr.fromChf} · ${internal.length} incohérence(s) interne(s)`);
  if (!args.includes('--no-db')) {
    try {
      const db = await checkDb(m); failures.push(...db.failures);
      // (Lot L3) v_social_proof : chiffre affiché quand la vue existe ; sinon l'avertissement « migration à appliquer » suit.
      const social = db.social ? ` · ${db.social.distinct} résidents distincts depuis ${db.social.since ?? '?'} (${SOCIAL_PROOF_VIEW}, ≥ ${m.STATS.totalResidents} attendu)` : '';
      console.log(`${db.failures.length ? '❌' : '✅'} base : ${db.rooms} chambres publiques comparées${social}`);
      for (const w of db.warnings) console.log(`   ⚠️  ${w}`);
    }
    catch (e) { console.log(`⚠️  base injoignable (${e.message}) — comparaison ignorée`); }
  }
  const jsonDump = opt('--json-ld');
  if (typeof jsonDump === 'string') {
    const f = routeToFile(jsonDump.replace(/^\/en(\/|$)/, '/').replace(/\/$/, '') || '/', jsonDump.startsWith('/en') ? 'en' : 'fr');
    const html = await fs.readFile(path.join(PRERENDERED, f), 'utf8');
    const outDir = path.join(ROOT, 'tools', 'out'); await fs.mkdir(outDir, { recursive: true });
    const out = path.join(outDir, `jsonld-${f.replace('.html', '')}.json`);
    await fs.writeFile(out, JSON.stringify(jsonLdBlocks(html), null, 2));
    console.log(`   JSON-LD de ${f} → ${path.relative(ROOT, out)} (à coller dans validator.schema.org)`);
  }
  const h = await checkHtml(m);
  failures.push(...h.failures);
  console.log(`${h.failures.length ? '❌' : '✅'} HTML : ${h.files} fichiers, ${h.blocks} pages en périmètre (bloc attendu), ${h.minuteWarnings} minute(s) non canonique(s), ${h.locationIssues} règle(s) d'emplacement L2 (15 min Genève, voiture, aéroport, A40${STRICT ? ' — bloquantes' : ' — avertissements, --strict pour bloquer'}), ${h.vousPages} page(s) FR avec vouvoiement`);
  for (const w of h.warnings.slice(0, args.includes('--tutoiement') || args.includes('--verbose') ? 500 : 12)) console.log(`   ⚠️  ${w}`);
  if (h.warnings.length > 12 && !args.includes('--verbose') && !args.includes('--tutoiement')) console.log(`   ⚠️  … ${h.warnings.length - 12} avertissement(s) de plus (--verbose)`);
  const l = await checkLlms(m);
  failures.push(...l);
  console.log(`${l.length ? '❌' : '✅'} llms.txt FR/EN = régénération depuis la source`);
  for (const f of failures) console.log(`   • ${f}`);
  if (failures.length > 0) { console.error(`\n❌ ${failures.length} problème(s) — fiche entité NON publiable.`); process.exit(1); }
  console.log('\n🎉 Fiche entité cohérente : source = base = HTML = llms.txt.\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
}
