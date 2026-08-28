// Extraction et classification des liens <a> d'une page prérendue.
// Brief n°2 — Chantier 7 (21/08/2026). Zéro dépendance. Réutilise les helpers
// exportés par scripts/seo-lint.mjs (decodeEntities, normalizeHref).
import { decodeEntities, normalizeHref } from '../../scripts/seo-lint.mjs';
import { BRAND_RE, EDITORIAL_CLASS, MONEY_KEYWORDS } from './config.mjs';

/** Repères structurels d'une page prérendue (1 <header>, 1 <main>, 1 <footer>). */
export function segmentBody(html) {
  const bodyStart = html.search(/<body[^>]*>/i);
  const idx = (re, from = 0) => { const m = html.slice(from).search(re); return m === -1 ? -1 : m + from; };
  const headerEnd = idx(/<\/header>/i, Math.max(0, bodyStart));
  const mainStart = idx(/<main\b/i, Math.max(0, bodyStart));
  const mainEnd = idx(/<\/main>/i, Math.max(0, mainStart));
  const footerStart = idx(/<footer\b/i, Math.max(0, mainEnd > 0 ? mainEnd : bodyStart));
  const ok = headerEnd > 0 && mainStart > 0 && mainEnd > 0 && footerStart > 0;
  return { bodyStart, headerEnd, mainStart, mainEnd, footerStart, ok };
}

function zoneOf(offset, seg) {
  if (!seg.ok) return 'content'; // page atypique : tout en contenu (signalé par l'appelant)
  if (offset < seg.headerEnd) return 'nav';
  if (offset >= seg.footerStart) return 'footer';
  if (offset >= seg.mainStart && offset < seg.mainEnd) return 'content';
  return 'other';
}

function attr(attrs, name) {
  const m = attrs.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i'));
  return m ? decodeEntities(m[1] ?? m[2] ?? '') : null;
}

function innerText(innerHtml) {
  return decodeEntities(innerHtml.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

/** Sous-type d'un lien de la zone contenu. */
export function subtypeOf({ cls, href, innerHtml }) {
  if (cls.includes(EDITORIAL_CLASS)) return 'editorial';
  const group = /\bgroup\b/.test(cls);
  if (group && /^\/(en\/)?blog\//.test(href)) return 'related';
  if (group) return 'cards';
  if (/bg-\[#(?:D4A574|44403C|1C1917|25D366)\]/i.test(cls) && /rounded|px-|py-/.test(cls)) return 'cta';
  if (/<img\b/i.test(innerHtml)) return 'image';
  return 'content-other';
}

/**
 * Toutes les ancres du <body> avec zone, sous-type, texte, cible interne normalisée.
 * Tolérant à l'ordre des attributs (class avant/après href) et aux entités HTML.
 */
export function extractAnchors(html) {
  const seg = segmentBody(html);
  const bodyStart = Math.max(0, seg.bodyStart);
  const out = [];
  const re = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  re.lastIndex = bodyStart;
  let m;
  while ((m = re.exec(html)) !== null) {
    const attrs = m[1] || '';
    const innerHtml = m[2] || '';
    const href = attr(attrs, 'href');
    if (!href) continue;
    const cls = attr(attrs, 'class') || '';
    const rel = attr(attrs, 'rel') || '';
    const aria = attr(attrs, 'aria-label') || '';
    let text = innerText(innerHtml);
    let isImage = false;
    if (!text) {
      const alt = innerHtml.match(/<img\b[^>]*\balt\s*=\s*"([^"]*)"/i);
      if (alt) { text = decodeEntities(alt[1]).trim(); isImage = true; }
      else if (aria) text = aria;
    }
    const zone = zoneOf(m.index, seg);
    const subtype = zone === 'content' ? subtypeOf({ cls, href, innerHtml }) : zone;
    const norm = normalizeHref(href); // null = externe / mailto / ancre pure
    const external = norm === null && /^https?:\/\//i.test(href);
    out.push({
      href, target: norm ? norm.path : null, issues: norm ? norm.issues : [],
      external, text, isImage, cls, aria,
      nofollow: /\bnofollow\b/i.test(rel), offset: m.index, zone, subtype,
      dataDiscover: /\bdata-discover=/.test(attrs),
    });
  }
  return { anchors: out, segmentation: seg };
}

export function normalizeText(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, "'").replace(/\s+/g, ' ').trim();
}

/**
 * Classe d'une ancre vis-à-vis de sa cible : marque | url_nue | exact | partiel | generique | image.
 * Règle Plan Autorité : 40 % marque · 25 % URL nue · 25 % génériques · 10 % exact.
 */
export function classifyAnchor(text, targetRoute, keywords = MONEY_KEYWORDS, opts = {}) {
  if (opts.isImage) return 'image';
  const t = normalizeText(text);
  if (!t) return 'generique';
  if (/^(https?:\/\/|www\.)/.test(t) || t.startsWith('lavillacoliving.com') || t.startsWith('/')) return 'url_nue';
  const kws = (keywords[targetRoute] || []).map(normalizeText);
  if (kws.includes(t)) return 'exact';
  for (const k of kws) {
    const tokens = k.split(' ').filter(w => w.length > 1);
    if (tokens.length >= 2 && tokens.every(w => t.includes(w))) return 'partiel';
  }
  if (BRAND_RE.test(t)) return 'marque';
  return 'generique';
}

/** Texte brut de <main> (pour détecter les mentions non liées). */
export function mainText(html) {
  const seg = segmentBody(html);
  const slice = seg.ok ? html.slice(seg.mainStart, seg.mainEnd) : html;
  return decodeEntities(
    slice.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' '),
  ).replace(/\s+/g, ' ');
}
