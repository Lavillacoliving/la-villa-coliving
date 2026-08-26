// Algorithmes du mining Search Console : courbe CTR-par-position du compte, striking distance,
// pages sous la courbe, impressions sans clic, watchlist. Brief n°2 — Chantier 1 (21/08/2026).
// Zéro dépendance. Fonctions pures : elles reçoivent des lignes déjà normalisées
// ({ query?, page?, clicks, impressions, ctr, position }) — voir tools/lib/gsc-parse.mjs.
//
// Règle d'or : une position agrégée est TOUJOURS pondérée par les impressions (jamais de moyenne simple).

export const MAX_BUCKET = 21;

/** Courbe de référence (CTR par position) utilisée quand le compte n'a pas assez de données. */
export const REF_CURVE = (() => {
  const c = [null, 0.28, 0.15, 0.11, 0.08, 0.07, 0.05, 0.04, 0.032, 0.028, 0.025];
  for (let b = 11; b <= 20; b++) c[b] = 0.02 - (0.02 - 0.01) * (b - 11) / 9; // 11 → 0,020 … 20 → 0,010
  c[21] = 0.005; // 21 et au-delà
  return c;
})();

/** Position → bucket entier 1..21 (21 = « 21 et plus »). */
export const bucketOf = pos => Math.min(MAX_BUCKET, Math.max(1, Math.round(Number(pos) || 0)));

/** Source de chaque bucket de la courbe. */
export const SOURCE = { OBSERVED: 'observé', INTERPOLATED: 'interpolé', REFERENCE: 'référence', REFERENCE_SCALED: 'référence recalée' };

const EPS = 1e-4;          // plancher pour l'interpolation log-linéaire (évite log(0))
const RATIO_MIN = 0.1;     // bornes du recalage de la courbe de référence
const RATIO_MAX = 5;

/**
 * Agrège des lignes par clé (position pondérée par impressions).
 * `keep` : champs recopiés depuis la première ligne de chaque groupe.
 * Renvoie une Map clé → { key, clicks, impressions, position, ctr, n, …keep }.
 */
export function aggregate(rows, keyOf, keep = []) {
  const m = new Map();
  for (const r of rows || []) {
    const k = keyOf(r);
    if (k === null || k === undefined) continue;
    let a = m.get(k);
    if (!a) {
      a = { key: k, clicks: 0, impressions: 0, position: 0, ctr: 0, n: 0, _pw: 0 };
      for (const f of keep) a[f] = r[f];
      m.set(k, a);
    }
    const imp = Number(r.impressions) || 0;
    a.clicks += Number(r.clicks) || 0;
    a.impressions += imp;
    a._pw += (Number(r.position) || 0) * imp;
    a.n++;
  }
  for (const a of m.values()) {
    a.position = a.impressions ? a._pw / a.impressions : 0;
    a.ctr = a.impressions ? a.clicks / a.impressions : 0;
    delete a._pw;
  }
  return m;
}

/**
 * Régression isotonique décroissante pondérée (PAV, « pool adjacent violators »).
 * points : [{ bucket, value, weight }] triés par bucket. Renvoie Map bucket → { value, pooled:[start,end]|null }.
 * Deux buckets observés qui se croisent (ex. position 2 à 0,7 % sous position 3 à 21 %) sont mis en commun
 * (CTR pondéré par impressions) au lieu d'écraser toute la suite de la courbe par un simple min().
 */
export function isotonicDecreasing(points) {
  const blocks = [];
  for (const p of points) {
    blocks.push({ start: p.bucket, end: p.bucket, w: p.weight, wv: p.weight * p.value, members: [p.bucket] });
    while (blocks.length > 1) {
      const last = blocks[blocks.length - 1];
      const prev = blocks[blocks.length - 2];
      if (last.wv / last.w <= prev.wv / prev.w + 1e-12) break;
      prev.end = last.end; prev.w += last.w; prev.wv += last.wv; prev.members.push(...last.members);
      blocks.pop();
    }
  }
  const out = new Map();
  for (const b of blocks) {
    const v = b.w ? b.wv / b.w : 0;
    for (const m of b.members) out.set(m, { value: v, pooled: b.members.length > 1 ? [b.start, b.end] : null });
  }
  return out;
}

/**
 * Courbe CTR-par-position DU COMPTE.
 * rows : lignes requête (ou page×requête), déjà filtrées hors marque par l'appelant.
 * Bucket b = min(21, round(position)). Fiable (« observé ») si I ≥ minImpr et n ≥ minRows ; les buckets
 * observés sont rendus monotones par régression isotonique pondérée (PAV) ; les autres sont interpolés
 * log-linéairement entre les deux voisins observés (en dessous et au-dessus) ; sans paire de voisins →
 * courbe de référence recalée par le ratio ctr/ref du bucket observé le plus proche (borné 0,1-5).
 * Filet de sécurité final : ctr[b] = min(ctr[b], ctr[b-1]). Provenance conservée par bucket.
 */
export function buildCtrCurve(rows, { minImpr = 100, minRows = 3 } = {}) {
  const agg = Array.from({ length: MAX_BUCKET + 1 }, (_, b) => ({ bucket: b, impressions: 0, clicks: 0, n: 0 }));
  for (const r of rows || []) {
    const imp = Number(r.impressions) || 0;
    if (imp <= 0) continue;
    const a = agg[bucketOf(r.position)];
    a.impressions += imp;
    a.clicks += Number(r.clicks) || 0;
    a.n++;
  }
  const buckets = [];
  for (let b = 1; b <= MAX_BUCKET; b++) {
    const a = agg[b];
    buckets.push({
      bucket: b,
      impressions: a.impressions,
      clicks: a.clicks,
      n: a.n,
      ctrObs: a.impressions ? a.clicks / a.impressions : null,
      reliable: a.impressions >= minImpr && a.n >= minRows,
      ref: REF_CURVE[b],
      ctr: null,
      source: null,
      monotoneAdjusted: false,
    });
  }
  const reliable = buckets.filter(x => x.reliable);
  // 1. buckets observés → monotones (PAV pondéré par impressions)
  const iso = isotonicDecreasing(reliable.map(x => ({ bucket: x.bucket, value: x.ctrObs, weight: x.impressions })));
  for (const x of reliable) {
    const r = iso.get(x.bucket);
    x.ctr = r.value;
    x.source = SOURCE.OBSERVED;
    x.pooled = r.pooled;
    x.monotoneAdjusted = !!r.pooled && Math.abs(r.value - x.ctrObs) > 1e-12;
  }
  // 2. buckets non observés : interpolation entre voisins observés, sinon référence recalée
  // Ancre du recalage : le bucket observé le plus proche, en évitant « 21+ » (fourre-tout) dès qu'un autre existe.
  const anchors = reliable.some(r => r.bucket < MAX_BUCKET) ? reliable.filter(r => r.bucket < MAX_BUCKET) : reliable;
  const nearest = b => {
    let best = null;
    for (const r of anchors) {
      const d = Math.abs(r.bucket - b);
      if (!best || d < best.d || (d === best.d && r.bucket < best.r.bucket)) best = { r, d };
    }
    return best ? best.r : null;
  };
  const clampRatio = x => Math.min(RATIO_MAX, Math.max(RATIO_MIN, x));
  let scaleRatio = null;
  let scaleBucket = null;
  for (const x of buckets) {
    if (x.reliable) continue;
    const lo = [...reliable].reverse().find(r => r.bucket < x.bucket);
    const hi = reliable.find(r => r.bucket > x.bucket);
    if (lo && hi) {
      const y0 = Math.log(Math.max(lo.ctr, EPS));
      const y1 = Math.log(Math.max(hi.ctr, EPS));
      const t = (x.bucket - lo.bucket) / (hi.bucket - lo.bucket);
      x.ctr = Math.exp(y0 + (y1 - y0) * t);
      if (lo.ctr <= EPS && hi.ctr <= EPS) x.ctr = 0;
      x.source = SOURCE.INTERPOLATED;
      x.from = [lo.bucket, hi.bucket];
      continue;
    }
    const nr = nearest(x.bucket);
    if (nr) {
      const ratio = clampRatio(nr.ctr / REF_CURVE[nr.bucket]);
      x.ctr = REF_CURVE[x.bucket] * ratio;
      x.source = SOURCE.REFERENCE_SCALED;
      x.from = [nr.bucket];
      x.ratio = ratio;
      if (scaleRatio === null) { scaleRatio = ratio; scaleBucket = nr.bucket; }
    } else {
      x.ctr = REF_CURVE[x.bucket];
      x.source = SOURCE.REFERENCE;
    }
  }
  // 3. filet de sécurité : monotonie décroissante stricte (ctr[b] = min(ctr[b], ctr[b-1]))
  for (let i = 1; i < buckets.length; i++) {
    if (buckets[i].ctr > buckets[i - 1].ctr + 1e-12) { buckets[i].ctr = buckets[i - 1].ctr; buckets[i].monotoneAdjusted = true; }
  }
  const values = [null, ...buckets.map(x => x.ctr)];
  return {
    buckets,
    values,                              // values[b] pour b = 1..21
    reliableCount: reliable.length,
    pureReference: reliable.length === 0,
    totalImpressions: buckets.reduce((s, x) => s + x.impressions, 0),
    totalRows: buckets.reduce((s, x) => s + x.n, 0),
    scaleRatio, scaleBucket,
    params: { minImpr, minRows },
  };
}

/** CTR attendu à une position donnée (bucket arrondi). */
export const ctrAt = (curve, pos) => curve.values[bucketOf(pos)];

/** Filtre « hors marque » : la regex est appliquée à la requête normalisée ; sans requête → conservé. */
const notBrand = (r, brandRe) => !(brandRe && r.query && brandRe.test(r.query));

/**
 * Striking distance : requêtes hors marque, posMin ≤ position ≤ posMax, impressions ≥ minImpr.
 * delta = CTR − attendu (négatif = sous la courbe) ; clics perdus = impr × max(0, attendu − CTR) ;
 * potentiel +3 places = impr × (courbe(max(1, round(pos) − 3)) − courbe(pos)) ; score = perdus + potentiel.
 * Tri score décroissant ; `topN` tronque ; `money` = requête ∈ watchlist.
 */
export function strikingDistance(rows, curve, { posMin = 4, posMax = 15, minImpr = 20, brandRe = null, watchlist = [], topN = null } = {}) {
  const wl = new Set(watchlist);
  const out = [];
  for (const r of rows || []) {
    if (!notBrand(r, brandRe)) continue;
    const imp = Number(r.impressions) || 0;
    const pos = Number(r.position) || 0;
    if (imp < minImpr || pos < posMin || pos > posMax) continue;
    const ctr = imp ? (Number(r.clicks) || 0) / imp : 0;
    const expected = ctrAt(curve, pos);
    const delta = ctr - expected;
    const lostClicks = imp * Math.max(0, -delta);
    const b = bucketOf(pos);
    const target = Math.max(1, b - 3);
    const potentialPlus3 = imp * Math.max(0, curve.values[target] - curve.values[b]);
    out.push({ ...r, ctr, expected, delta, lostClicks, potentialPlus3, score: lostClicks + potentialPlus3, money: !!(r.query && wl.has(r.query)) });
  }
  out.sort((a, b) => b.score - a.score || b.impressions - a.impressions || String(a.query).localeCompare(String(b.query)));
  return topN ? out.slice(0, topN) : out;
}

/**
 * Pages sous la courbe.
 * pageRows : lignes page (clicks, impressions, ctr, position). pageQueryRows (sonde) : lignes page×requête →
 * CTR attendu page = Σq impr_q × courbe(pos_q) / Σq impr_q (méthode « requêtes ») ; sinon courbe(position page)
 * (méthode « indicatif »). Sous la courbe si impr ≥ minImpr et CTR < ratio × attendu. Tri clics perdus décroissant.
 */
export function pagesUnderCurve(pageRows, curve, { minImpr = 50, ratio = 0.6, pageQueryRows = null } = {}) {
  const expectedByPage = new Map();
  if (pageQueryRows && pageQueryRows.length) {
    const acc = new Map();
    for (const r of pageQueryRows) {
      if (!r.page) continue;
      const imp = Number(r.impressions) || 0;
      if (imp <= 0) continue;
      const a = acc.get(r.page) || { w: 0, i: 0 };
      a.w += imp * ctrAt(curve, r.position);
      a.i += imp;
      acc.set(r.page, a);
    }
    for (const [p, a] of acc) if (a.i > 0) expectedByPage.set(p, a.w / a.i);
  }
  const out = [];
  for (const p of pageRows || []) {
    const imp = Number(p.impressions) || 0;
    if (imp < minImpr) continue;
    const ctr = imp ? (Number(p.clicks) || 0) / imp : 0;
    const fromQueries = expectedByPage.has(p.page);
    const expected = fromQueries ? expectedByPage.get(p.page) : ctrAt(curve, p.position);
    if (!(ctr < ratio * expected)) continue;
    out.push({ ...p, ctr, expected, ratioToExpected: expected ? ctr / expected : null, lostClicks: imp * Math.max(0, expected - ctr), method: fromQueries ? 'requêtes' : 'indicatif' });
  }
  out.sort((a, b) => b.lostClicks - a.lostClicks || b.impressions - a.impressions);
  return out;
}

/** Requête atypique (très longue, ou écrite dans un alphabet non latin) : probable bruit de scraping / prompts. */
export const isSuspiciousQuery = q => {
  const s = String(q ?? '');
  return s.length > 70 || /[^\p{Script=Latin}\p{N}\p{P}\p{S}\p{Z}\s]/u.test(s);
};

/**
 * Impressions sans clic : clics = 0, impressions ≥ minImpr, hors marque.
 * Diagnostic « snippet/title » si position ≤ 10, sinon « position » ; `suspicious` = requête atypique (bruit probable).
 * Tri impressions décroissantes.
 */
export function noClickImpressions(rows, { minImpr = 30, brandRe = null } = {}) {
  const out = [];
  for (const r of rows || []) {
    if (!notBrand(r, brandRe)) continue;
    const imp = Number(r.impressions) || 0;
    if ((Number(r.clicks) || 0) !== 0 || imp < minImpr) continue;
    out.push({ ...r, diagnostic: (Number(r.position) || 0) <= 10 ? 'snippet/title' : 'position', suspicious: isSuspiciousQuery(r.query) });
  }
  out.sort((a, b) => b.impressions - a.impressions || a.position - b.position);
  return out;
}

/**
 * Watchlist money : pour chaque requête suivie, agrégat (position pondérée) vs CTR attendu.
 * rows : lignes requête ou page×requête d'un segment. Renvoie une ligne par requête de la watchlist,
 * `found:false` si absente des données (anonymisation GSC ou aucune impression).
 */
export function watchlistReport(rows, curve, watchlist, { posMin = 4, posMax = 15, minImpr = 20 } = {}) {
  const byQ = aggregate((rows || []).filter(r => r.query), r => r.query);
  return (watchlist || []).map(q => {
    const a = byQ.get(q);
    if (!a) return { query: q, found: false };
    const expected = ctrAt(curve, a.position);
    const inWindow = a.position >= posMin && a.position <= posMax && a.impressions >= minImpr;
    const statut = inWindow ? 'striking' : a.position < posMin ? 'acquis (top 3)' : a.position > posMax ? 'hors fenêtre (position)' : 'hors fenêtre (impressions)';
    return { query: q, found: true, clicks: a.clicks, impressions: a.impressions, position: a.position, ctr: a.ctr, expected, delta: a.ctr - expected, lostClicks: a.impressions * Math.max(0, expected - a.ctr), inWindow, statut, pages: a.n };
  });
}
