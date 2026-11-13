/**
 * Gardes par gamme (L'Appart, brief « Points d'entrée prix, L'Appart » du 12/11/2026 ; étape E2g) — fonctions PURES.
 *
 * Deux gammes, jamais fondues (V2, Jérôme 12/11/2026) : les 3 maisons de coliving (piscine, sauna, salle de sport) et L'Appart,
 * une colocation à Annemasse. Ce module dit ce qui est faux, sans lire ni fichier ni base : les scripts lui passent des
 * chaînes (texte visible, phrases, lignes de llms.txt), des lignes de v_public_rooms ou des nœuds JSON-LD.
 *   - Base : chaque ligne de la vue appartient à une maison, à L'Appart ou à un lieu INCONNU du site (échec : la vue est en
 *     avance sur le code) ; les lignes de L'Appart sont comparées à APPART (src/data/appart.ts, via ENTITY_FACTS.appart) :
 *     aucune ligne = état A (information), sinon 4 chambres, numéros, loyers, surfaces, salle d'eau, date d'ouverture.
 *   - Pages de L'Appart (règles a et b) : aucune preuve des maisons ; piscine, sauna, salle de sport et surfaces des chambres des
 *     maisons seulement dans les textes de la source qui les NIENT ou RENVOIENT aux maisons (appartGammeExemptStrings,
 *     src/data/appartFacts.ts = liste « exceptionsGamme » de la source des textes).
 *   - Toutes les pages et llms.txt (règle c) : jamais un montant de L'Appart dans la même phrase (ou ligne de tableau) qu'un
 *     équipement des maisons ; montants BORNÉS (appartAmountsIn : « 530 € » ne se lit pas dans « 1 530 € »).
 *   - JSON-LD (règle d) : le nœud de L'Appart sans équipement des maisons, `numberOfRooms` à sa place, chaque AggregateOffer
 *     dans la fourchette d'une gamme (jamais 730–1 430 CHF sur une offre).
 * Utilisé par scripts/check-entity-facts.mjs et scripts/house-pages-check.mjs ; testé dans tools/test/gamme-rules.test.mjs.
 *
 * `m` = le module chargé par scripts/lib/load-entity-facts.mjs (faits, lieux, textes de la source). Aucun nombre ni aucun texte
 * n'est recopié ici : tout se lit dans `m`. Confidentialité : un message ne recopie jamais une clé interne de la base
 * (INTERNAL_ONLY_KEYS, src/lib/placeBridge.ts) : un lieu inconnu qui la porterait est désigné « clé interne ».
 */

/** Blancs repliés (U+00A0 et U+202F conservés : la typographie des prix en dépend), comme les autres gardes du prérendu. */
export const squash = (s) => String(s ?? '').replace(/[ \t\r\n]+/g, ' ').trim();
const escapeRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** Nombre BORNÉ, comme les montants de L'Appart : « 29 » ne se lit ni dans « 129 », ni dans « 1,29 », ni dans « 1 029 » ; « 100 »
 *  ni dans « 1 100 » (séparateurs de milliers : espace, insécable, fine insécable, virgule, point). */
const num = (v) => `(?<!\\d[\\s,.]?)${v}(?![\\s,.]?\\d)`;
/** Fourchette « a à b », « a to b », « a-b », « a–b », bornée de la même façon. */
const range = (a, b) => `(?<!\\d[\\s,.]?)${a}\\s?(?:à|to|-|–)\\s?${b}(?![\\s,.]?\\d)`;
/** « 4,8 » ou « 4.8 » (décimale FR ou EN). */
const decimal = (s) => String(s).replace(/[.,]/g, '[.,]');
/** Extrait autour d'une occurrence, pour un message lisible. */
const around = (text, index, length, span = 60) => text.slice(Math.max(0, index - span), index + length + span);

// ── Lieux ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Clé interne de la base (pont des clés) ? Comparaison sans casse. */
export function isInternalKey(value, m) {
  const v = String(value ?? '').toLowerCase();
  return (m.INTERNAL_ONLY_KEYS ?? []).some((k) => k && v.includes(String(k).toLowerCase()));
}

/** Nom d'un lieu dans un message : la clé publique telle quelle, jamais une clé interne. */
export function placeKeyLabel(value, m) {
  if (value === null || value === undefined || value === '') return '(vide)';
  return isInternalKey(value, m) ? 'clé interne (masquée)' : `« ${value} »`;
}

/** Page prérendue de L'Appart (sa page ou une de ses fiches chambres, FR ou EN) ? D'après le nom du fichier. */
export function isAppartPageFile(file, m) {
  return new RegExp(`^(?:en-)?${escapeRe(m.APPART_KEY)}(?:-chambre-\\d{1,2})?\\.html$`).test(String(file));
}

/**
 * Pages prérendues de L'Appart qui DOIVENT exister : aucune tant que L'Appart n'a pas de page (PLACE_PAGE_KEYS, étape E3) ;
 * ensuite sa page et ses fiches chambres (`roomPages` = src/data/roomPages.json), FR et EN.
 */
export function appartPageFiles(m, roomPages = {}) {
  if (!(m.PLACE_PAGE_KEYS ?? []).includes(m.APPART_KEY)) return [];
  const k = m.APPART_KEY;
  const rooms = Array.isArray(roomPages?.[k]) ? roomPages[k] : [];
  return [`${k}.html`, `en-${k}.html`, ...rooms.flatMap((n) => [`${k}-chambre-${n}.html`, `en-${k}-chambre-${n}.html`])];
}

/**
 * Lignes de v_public_rooms par lieu : `byPlace` (Map clé publique → lignes, dans l'ordre de PLACE_KEYS) et `unknown` (un lieu
 * que le site ne connaît pas : libellé — masqué s'il porte une clé interne — et nombre de lignes).
 */
export function classifyViewRows(rows, m) {
  const byPlace = new Map((m.PLACE_KEYS ?? []).map((k) => [k, []]));
  const unknown = new Map();
  for (const r of rows ?? []) {
    const k = r?.house_slug;
    if (byPlace.has(k)) byPlace.get(k).push(r);
    else {
      const label = placeKeyLabel(k, m);
      unknown.set(label, (unknown.get(label) ?? 0) + 1);
    }
  }
  for (const [k, list] of [...byPlace]) if (list.length === 0) byPlace.delete(k);
  return { byPlace, unknown: [...unknown].map(([label, count]) => ({ label, count })) };
}

/** Message d'un lieu inconnu de la vue (les deux gardes le disent de la même façon). */
export function unknownPlaceMessage({ label, count }) {
  return `lieu inconnu du site dans v_public_rooms : ${label} (${count} ligne(s)) — la vue est en avance sur le code : ajouter le lieu au code (src/data/places.ts) et le mettre en ligne AVANT de rendre ses chambres publiques`;
}

// ── Base : L'Appart contre le code ───────────────────────────────────────────────────────────────────────────────────────────

const isShared = (r) => /shared|partag/i.test(String(r?.bathroom_type ?? ''));
const isoDay = (v) => (v === null || v === undefined || v === '' ? null : String(v).slice(0, 10));

/**
 * Les lignes de L'Appart de v_public_rooms contre le code (ENTITY_FACTS.appart, lu dans APPART) — même doctrine que les maisons :
 * une valeur changée en base sans le code (ou l'inverse) arrête la publication (décision n° 33). `today` = AAAA-MM-JJ.
 *   - 0 ligne : état A (avant la bascule) → information, aucun échec ;
 *   - sinon : 4 lignes, numéros = APPART.rooms.numbers, jamais le n° 1 (il n'est jamais publié), loyer en euros et en
 *     francs, surface (Math.round, règle du Lot 7) et salle d'eau de chaque chambre ;
 *   - avant APPART.opensOn : aucune chambre « libre », et toute date de libération = APPART.opensOn ; à partir de cette date :
 *     plus de contrôle de date, un avertissement (retirer « dès février 2027 » des textes).
 */
export function appartDbIssues(rows, m, { today } = {}) {
  const A = m.ENTITY_FACTS.appart;
  const failures = [], warnings = [], infos = [];
  const list = rows ?? [];
  if (list.length === 0) {
    infos.push(`${A.name} absent de v_public_rooms (état A, avant la bascule) : rien à comparer`);
    return { failures, warnings, infos };
  }
  const name = (n) => `${A.name} ${m.roomLabel(m.APPART_KEY, n, 'fr')}`;
  if (list.length !== A.rooms) failures.push(`base : ${A.name} a ${list.length} chambre(s) dans v_public_rooms, le code en attend ${A.rooms} (APPART.rooms.total)`);
  const numbers = list.map((r) => Number(r.room_number));
  const twice = [...new Set(numbers.filter((n, i) => numbers.indexOf(n) !== i))];
  if (twice.length) failures.push(`base : ${A.name} — numéro(s) en double dans v_public_rooms : ${twice.join(', ')}`);
  for (const n of A.numbers) if (!numbers.includes(n)) failures.push(`base : ${name(n)} (n° ${n}) absente de v_public_rooms`);
  for (const r of list) {
    const n = Number(r.room_number);
    if (n === 1) { failures.push(`base : ${A.name} n° 1 publique — le n° 1 n'est jamais publié : jamais dans la vue`); continue; }
    const tier = A.price.tiers.find((t) => t.rooms.includes(n));
    if (!tier) { failures.push(`base : ${A.name} n° ${r.room_number} n'est pas une chambre de L'Appart dans le code (APPART.rooms.numbers : ${A.numbers.join(', ')})`); continue; }
    const where = name(n);
    const chf = Number(r.rent_chf);
    const eur = r.rent_eur === null || r.rent_eur === undefined || r.rent_eur === '' ? null : Number(r.rent_eur);
    if (chf !== tier.chf || eur !== tier.eur) failures.push(`base : ${where} à ${eur ?? '?'} € / ${Number.isFinite(chf) ? chf : '?'} CHF, le code dit ${tier.eur} € / ${tier.chf} CHF (APPART_CONTRACT_EUR, src/data/appart.ts)`);
    const s = r.surface_m2 === null || r.surface_m2 === undefined || r.surface_m2 === '' ? NaN : Number(r.surface_m2);
    if (!Number.isFinite(s) || Math.round(s) !== tier.surfaceM2) failures.push(`base : ${where} à ${Number.isFinite(s) ? `${s} m²` : 'surface absente'}, le code dit ${tier.surfaceM2} m² (APPART.rooms)`);
    const shared = isShared(r);
    if (shared !== (tier.bathroom === 'shared')) failures.push(`base : ${where} — salle d'eau « ${r.bathroom_type ?? '?'} », le code dit « ${tier.bathroom} »`);
  }
  const day = isoDay(today) ?? new Date().toISOString().slice(0, 10);
  if (day < A.opensOn) {
    for (const r of list) {
      const n = Number(r.room_number);
      if (n === 1 || !A.numbers.includes(n)) continue;
      if (r.availability === 'available') failures.push(`base : ${name(n)} « libre » avant l'ouverture du ${A.opensOn} (APPART.opensOn) — jamais « disponible » avant l'ouverture`);
      const from = isoDay(r.available_from);
      if (from && from !== A.opensOn) failures.push(`base : ${name(n)} libre le ${from}, le code dit ouverture le ${A.opensOn} (APPART.opensOn) — la date change dans le code et en base dans le même créneau`);
    }
  } else {
    warnings.push(`${A.name} : la date d'ouverture (${A.opensOn}) est passée — retirer les mentions « dès février 2027 » (description de la page, FAQ « Quand… », réponses du bot)`);
  }
  return { failures, warnings, infos };
}

/** Surfaces de L'Appart dans la vue (Math.round du min / max de surface_m2) contre APPART.rooms.surface ; rien sans ligne. */
export function appartSurfaceIssues(rows, m) {
  const A = m.ENTITY_FACTS.appart;
  const sizes = (rows ?? []).map((r) => Number(r.surface_m2)).filter((n) => Number.isFinite(n) && n > 0);
  if (sizes.length === 0) return [];
  const min = Math.round(Math.min(...sizes)), max = Math.round(Math.max(...sizes));
  return min === A.surfaces.min && max === A.surfaces.max ? [] : [`${m.APPART_KEY} : APPART.rooms.surface = ${A.surfaces.min}-${A.surfaces.max} m², v_public_rooms = ${min}-${max} m² (Math.round du min/max de surface_m2)`];
}

// ── Textes : équipements, preuves, montants ──────────────────────────────────────────────────────────────────────────────────

/** Équipements des maisons, FR et EN (piscine, sauna, salle de sport, pool, gym ; espaces insécables admises). */
export const HOUSE_AMENITY_RE = /\bpiscines?\b|\bsaunas?\b|\bsalles?\s+de\s+sport\b|\bpools?\b|\bgyms?\b/i;

/**
 * Preuves des MAISONS (règle a) — jamais sur une page de L'Appart, aucune exception : note Google (valeur, lien « Voir les avis »),
 * « 100+ résidents », séjour moyen, occupation, formule de trajet de la marque (« 16 à 17 min … selon la maison », « 25 min
 * jusqu'au centre »), « 20 min de Genève-Eaux-Vives », « 29 chambres », espace de vie par colocataire (« 37 à 42 m² »).
 * Valeurs lues dans la source (STATS, GOOGLE_REVIEWS, OCCUPANCY, TRANSIT) : un relevé mensuel ne demande aucune retouche ici.
 */
export function maisonProofRules(m) {
  const S = m.STATS, T = m.TRANSIT, G = m.GOOGLE_REVIEWS, L = m.GOOGLE_REVIEWS_LINK_LABEL;
  return [
    { label: 'note Google des maisons', re: new RegExp(`${num(decimal(G.ratingEn))}\\s?/\\s?5\\b|${escapeRe(L.fr)}|${escapeRe(L.en)}|avis (?:sur )?Google|Google reviews?`, 'i') },
    { label: `« ${S.totalResidents}+ résidents »`, re: new RegExp(`(?<!\\d[\\s,.]?)${S.totalResidents}\\s?\\+\\s?(?:r[ée]sidents?|residents?)\\b`, 'i') },
    { label: 'séjour moyen des maisons', re: new RegExp(`${num(S.averageStayMonths)}\\s(?:mois en moyenne|months on average)|s[ée]jour moyen|average stay`, 'i') },
    { label: 'occupation des maisons', re: new RegExp(`${num(decimal(m.OCCUPANCY.pct.toFixed(1)))}\\s?%|taux d['’]occupation|occupancy rate|jours-chambre|room-days`, 'i') },
    { label: 'formule de trajet de la marque', re: new RegExp(`${range(T.doorToDoorEauxVivesMin, T.doorToDoorEauxVivesMax)}\\s?min|selon la maison|depending on the house|${num(T.centreDoorToDoorMin)}\\s?min(?:utes)?\\s(?:jusqu['’]au centre|to the city cent(?:re|er))`, 'i') },
    { label: `« ${S.genevaCenterMinutes} min de Genève-Eaux-Vives » (marque)`, re: new RegExp(`${num(S.genevaCenterMinutes)}\\s?min(?:utes)?\\s(?:de|from)\\sGen[eè]v[ea][\\s-]Eaux-Vives`, 'i') },
    { label: `« ${S.totalRooms} chambres » (maisons)`, re: new RegExp(`${num(S.totalRooms)}\\s(?:[\\p{L}-]+\\s){0,2}?(?:chambres|rooms)\\b`, 'iu') },
    { label: 'espace de vie par colocataire (maisons)', re: new RegExp(`${range(S.livingSpacePerResidentMin, S.livingSpacePerResidentMax)}\\s?m²`, 'i') },
  ];
}

/**
 * Faits des MAISONS permis sur une page de L'Appart seulement dans les textes qui les nient ou renvoient aux maisons (règle b) :
 * piscine, sauna, salle de sport ; surfaces des chambres des maisons (« 16 à 24 m² »).
 */
export function maisonOnlyRules(m) {
  const S = m.STATS;
  return [
    { label: 'piscine, sauna ou salle de sport', re: HOUSE_AMENITY_RE },
    { label: `surfaces des chambres des maisons (« ${S.roomSizeMin} à ${S.roomSizeMax} m² »)`, re: new RegExp(`${range(S.roomSizeMin, S.roomSizeMax)}\\s?m²`, 'i') },
  ];
}

/**
 * Textes exemptés (FR et EN) : les chaînes de la source qui nomment un équipement des maisons pour le NIER à L'Appart ou RENVOYER
 * aux maisons (`appartGammeExemptStrings`, liste « exceptionsGamme » de la source des textes). Les plus longues d'abord : une
 * exception contenue dans une autre ne la coupe pas.
 */
export function appartExemptStrings(m) {
  const all = ['fr', 'en'].flatMap((lang) => m.appartGammeExemptStrings(lang)).map(squash).filter(Boolean);
  return [...new Set(all)].sort((a, b) => b.length - a.length);
}

/**
 * Règles a et b sur un texte d'une page de L'Appart (texte visible du <main>, titre, descriptions). `html` (facultatif) : le HTML
 * du <main>, où un lien vers la fiche Google des maisons (GOOGLE_REVIEWS.url) est aussi une preuve des maisons. Pure.
 */
export function appartPageTextIssues(text, m, { html = '' } = {}) {
  const t = squash(text);
  const issues = [];
  for (const r of maisonProofRules(m)) {
    const hit = r.re.exec(t);
    if (hit) issues.push(`preuve des maisons sur une page de L'Appart (${r.label}) — « …${around(t, hit.index, hit[0].length)}… »`);
  }
  if (m.GOOGLE_REVIEWS?.url && String(html).replace(/&amp;/g, '&').includes(m.GOOGLE_REVIEWS.url)) issues.push('preuve des maisons sur une page de L\'Appart (lien vers la fiche Google des maisons)');
  let rest = t;
  for (const e of appartExemptStrings(m)) rest = rest.split(e).join(' ¦ ');
  for (const r of maisonOnlyRules(m)) {
    const g = new RegExp(r.re.source, r.re.flags.includes('g') ? r.re.flags : `${r.re.flags}g`);
    const hits = [...rest.matchAll(g)];
    if (hits.length) issues.push(`${r.label} sur une page de L'Appart hors des textes qui les nient ou renvoient aux maisons (${hits.length} fois) — « …${around(rest, hits[0].index, hits[0][0].length)}… »`);
  }
  return issues;
}

/**
 * Règle c : une phrase ou une ligne de tableau qui porte un montant de L'Appart (730, 790, 990, 1 060, 530 — bornés :
 * `appartAmountsIn`) ET un équipement des maisons. Exception : une phrase qui appartient à un texte exempté. Un message par
 * texte fautif distinct. `units` = phrases et lignes de tableau (scripts/check-entity-facts.mjs, `sentences`). Pure.
 */
export function gammeSentenceIssues(units, m) {
  const exempt = appartExemptStrings(m);
  const seen = new Set();
  const out = [];
  for (const u of units ?? []) {
    const s = squash(u);
    if (!s || seen.has(s) || !HOUSE_AMENITY_RE.test(s)) continue;
    const amounts = m.appartAmountsIn(s);
    if (amounts.length === 0 || exempt.some((e) => e.includes(s))) continue;
    seen.add(s);
    out.push(`prix de L'Appart (${[...new Set(amounts)].join(', ')}) et équipement des maisons dans la même phrase — « ${s.slice(0, 150)}… »`);
  }
  return out;
}

/**
 * Ligne « tout compris » d'une carte de L'Appart (RoomCard, attribut data-all-inclusive="appart", Lot 5 : ALL_INCLUSIVE_LINE.appart)
 * — sur toute page, jamais un équipement des maisons (critère de l'étape E4 : aucune carte de L'Appart ne porte piscine, sauna ou
 * salle de sport). `lines` = textes visibles des éléments qui portent cet attribut. Pure.
 */
export function appartInclusionLineIssues(lines) {
  const out = [];
  for (const t of (lines ?? []).map(squash)) {
    const hit = HOUSE_AMENITY_RE.exec(t);
    if (hit) out.push(`ligne « tout compris » d'une carte de L'Appart qui nomme un équipement des maisons — « …${around(t, hit.index, hit[0].length)}… »`);
  }
  return out;
}

/** Règle c sur llms.txt : chaque ligne (une ligne de tableau markdown entière, sinon phrase par phrase), avec son numéro. Pure. */
export function llmsGammeIssues(text, m) {
  const out = [];
  String(text ?? '').split('\n').forEach((line, i) => {
    const units = line.trim().startsWith('|') ? [line] : line.split(/(?<=[.!?;])\s+/);
    for (const issue of gammeSentenceIssues(units, m)) out.push(`ligne ${i + 1} : ${issue}`);
  });
  return out;
}

// ── JSON-LD ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────

const hasType = (n, t) => (Array.isArray(n?.['@type']) ? n['@type'].includes(t) : n?.['@type'] === t);
const texts = (...values) => values.flat().filter((v) => typeof v === 'string');

/**
 * Règle d et données structurées par gamme, sur les nœuds aplatis d'une page :
 *   - `numberOfRooms` : 33 (la marque) seulement sur la fiche de l'organisation, 4 seulement sur le nœud de L'Appart ; la fiche
 *     de l'organisation = maisons (29) ou marque (33), et la somme des lieux de son `department` ;
 *   - chaque AggregateOffer : la fourchette d'UNE gamme (maisons 1 290–1 430, L'Appart 730–990), `offerCount` de cette gamme ;
 *     jamais une fourchette qui mêle les deux ;
 *   - le nœud de L'Appart, une offre de L'Appart (AggregateOffer de sa fourchette, Offer d'une de ses chambres) : ni piscine, ni
 *     sauna, ni salle de sport (nom, description, équipements).
 * Le reste des nœuds de lieux (@id, parentOrganization, nombre de chambres de chaque lieu) : entityGraphIssues. Pure.
 */
export function jsonLdGammeIssues(nodes, m) {
  const F = m.ENTITY_FACTS, A = F.appart, B = F.brand;
  const appartId = m.placeLodgingId(m.APPART_KEY);
  const allowed = [...new Set([F.totalRooms, B.totalRooms, ...F.houses.map((h) => h.rooms), A.rooms])];
  const ranges = [
    { label: 'maisons', low: F.price.fromChf, high: F.price.standardChf, count: F.totalRooms },
    { label: A.name, low: A.price.fromChf, high: A.price.toChf, count: A.rooms },
  ];
  const issues = [];
  for (const n of nodes ?? []) {
    if (!n || typeof n !== 'object') continue;
    const id = typeof n['@id'] === 'string' ? n['@id'] : '';
    const isOrg = id.endsWith('#organization');
    if (n.numberOfRooms !== undefined) {
      const v = Number(n.numberOfRooms);
      if (!allowed.includes(v)) issues.push(`numberOfRooms=${n.numberOfRooms} hors {${allowed.join(',')}}`);
      else if (isOrg && v !== F.totalRooms && v !== B.totalRooms) issues.push(`fiche de l'organisation : numberOfRooms=${v} (attendu ${F.totalRooms} pour les maisons ou ${B.totalRooms} pour la marque)`);
      else if (!isOrg && v === B.totalRooms && B.totalRooms !== F.totalRooms) issues.push(`numberOfRooms=${v} (chambres de la marque) hors de la fiche de l'organisation`);
      else if (id !== appartId && v === A.rooms && !F.houses.some((h) => h.rooms === v)) issues.push(`numberOfRooms=${v} (chambres de ${A.name}) hors du nœud de ${A.name}`);
      if (isOrg && Array.isArray(n.department) && n.department.length > 0) {
        const sum = n.department.reduce((s, d) => s + Number(d?.numberOfRooms), 0);
        if (Number.isFinite(sum) && sum !== v) issues.push(`fiche de l'organisation : numberOfRooms=${v} ≠ somme de ses lieux (department) ${sum}`);
      }
    }
    if (hasType(n, 'AggregateOffer')) {
      const lo = Number(n.lowPrice), hi = Number(n.highPrice);
      const r = ranges.find((x) => x.low === lo && x.high === hi);
      if (!r) issues.push(`AggregateOffer ${n.lowPrice}-${n.highPrice} hors des fourchettes permises (maisons ${ranges[0].low}-${ranges[0].high}, ${A.name} ${ranges[1].low}-${ranges[1].high}) — jamais une offre qui mêle les deux gammes`);
      else if (n.offerCount !== undefined && Number(n.offerCount) !== r.count) issues.push(`AggregateOffer ${lo}-${hi} (${r.label}) : offerCount=${n.offerCount} ≠ ${r.count}`);
      if (r && r.label === A.name) {
        const bad = texts(n.name, n.description).find((s) => HOUSE_AMENITY_RE.test(s));
        if (bad) issues.push(`offre de ${A.name} (${lo}-${hi}) qui nomme un équipement des maisons — « ${squash(bad).slice(0, 100)} »`);
      }
    }
    if (id === appartId && hasType(n, 'LodgingBusiness')) {
      const amenities = (Array.isArray(n.amenityFeature) ? n.amenityFeature : []).map((a) => a?.name);
      const bad = texts(amenities, n.name, n.description, n.alternateName).filter((s) => HOUSE_AMENITY_RE.test(s));
      for (const s of bad) issues.push(`nœud de ${A.name} : équipement des maisons « ${squash(s).slice(0, 100)} »`);
    }
    if (hasType(n, 'Offer') && n.itemOffered?.containedInPlace?.['@id'] === appartId) {
      const bad = texts(n.name, n.description, n.itemOffered?.name, n.itemOffered?.description).find((s) => HOUSE_AMENITY_RE.test(s));
      if (bad) issues.push(`offre d'une chambre de ${A.name} qui nomme un équipement des maisons — « ${squash(bad).slice(0, 100)} »`);
    }
  }
  return issues;
}

// ── Blocs statiques « L'Appart » ─────────────────────────────────────────────────────────────────────────────────────────────

/**
 * Bloc statique <AppartTeaser/> (data-appart-teaser) : tant que les étapes E4 et E5 ne l'ont pas posé sur ses 5 pages, la garde
 * accepte 0 ou 1 bloc sur chacune (jamais ailleurs, texte = source, FR et EN ensemble). À la réunion des étapes (E6), quand les
 * 5 blocs sont en place : passer à `true` — la garde exige alors exactement un bloc sur chaque page, FR et EN.
 */
export const APPART_TEASER_ALL_REQUIRED = false;

/** Texte visible attendu d'un bloc statique : sur-titre, titre, texte, lien (source : appartTeaser). */
export function appartTeaserExpectedText(route, lang, m) {
  const t = m.appartTeaser(route, lang);
  return squash([t.eyebrow, t.title, t.text, t.link].filter(Boolean).join(' '));
}
