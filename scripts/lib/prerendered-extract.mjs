/**
 * Extraction du contenu SERVI d'une page prérendue (lot indexation du 08/10/2026).
 *
 * Déplacé tel quel de scripts/inject-prerendered.mjs, qui l'importe d'ici : en production, une page
 * prérendue n'est pas servie telle quelle. inject-prerendered.mjs n'en garde que le contenu de
 * <div id="root"> et les balises SEO du <head> (title, meta name/property, canonical, hreflang,
 * JSON-LD dédoublonnés par @type), qu'il réinjecte dans l'index.html du build courant.
 * scripts/lib/content-fingerprint.mjs s'en sert pour comparer exactement ce sous-ensemble : un
 * changement d'index.html (script analytics, métas techniques) ne change le contenu d'aucune page.
 *
 * Fonctions PURES : toute modification ici change à la fois ce qui est servi et l'empreinte.
 */

/**
 * Extract innerHTML of <div id="root"> using depth tracking
 */
export function extractRootContent(html) {
  const startTag = '<div id="root">';
  const startIdx = html.indexOf(startTag);
  if (startIdx === -1) return null;

  const contentStart = startIdx + startTag.length;
  let depth = 1;
  let i = contentStart;

  while (i < html.length && depth > 0) {
    if (html.substring(i, i + 4) === '<div') {
      depth++;
      i += 4;
    } else if (html.substring(i, i + 6) === '</div>') {
      depth--;
      if (depth === 0) break;
      i += 6;
    } else {
      i++;
    }
  }

  return html.substring(contentStart, i);
}

/**
 * Extract ALL SEO-relevant tags from pre-rendered <head>
 * Returns an object with all extracted data
 */
export function extractSeoTags(html) {
  const headEnd = html.indexOf('</head>');
  if (headEnd === -1) return {};
  const head = html.substring(0, headEnd);

  const seo = {};

  // Title — take the LAST <title> (React-Helmet's specific one overrides the Vite default)
  // React-Helmet adds data-react-helmet="true" attribute, so we match <title[^>]*>
  const titlePattern = /<title[^>]*>(.*?)<\/title>/g;
  let titleMatch;
  while ((titleMatch = titlePattern.exec(head)) !== null) {
    seo.title = titleMatch[1]; // last one wins (React-Helmet's specific title)
  }

  // Meta name tags (description, keywords, robots, author, language)
  // [^>]* before > handles extra attributes like data-react-helmet="true"
  const metaNamePattern = /<meta\s+name="([^"]+)"\s+content="([^"]*)"[^>]*>/g;
  seo.metaName = {};
  let m;
  while ((m = metaNamePattern.exec(head)) !== null) {
    seo.metaName[m[1]] = m[2];
  }

  // Canonical
  const canonicalMatch = head.match(/<link\s+rel="canonical"\s+href="([^"]*)"/);
  if (canonicalMatch) seo.canonical = canonicalMatch[1];

  // Meta property tags (OG + Twitter)
  // [^>]* before > handles extra attributes like data-react-helmet="true"
  const metaPropPattern = /<meta\s+property="([^"]+)"\s+content="([^"]*)"[^>]*>/g;
  seo.metaProperty = {};
  while ((m = metaPropPattern.exec(head)) !== null) {
    seo.metaProperty[m[1]] = m[2];
  }

  // JSON-LD scripts — collect from entire HTML, deduplicate by @type
  const jsonLdFullPattern = /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  seo.jsonLd = [];
  const seenTypes = new Set();
  while ((m = jsonLdFullPattern.exec(html)) !== null) {
    const content = m[1].trim();
    // Deduplicate by @type to prevent multiple LodgingBusiness/Organization/FAQPage
    const typeMatch = content.match(/"@type"\s*:\s*"([^"]+)"/);
    const type = typeMatch ? typeMatch[1] : content.substring(0, 50);
    if (!seenTypes.has(type)) {
      seenTypes.add(type);
      seo.jsonLd.push(content);
    }
  }

  // Hreflang links
  // [^>]* before > handles extra attributes like data-react-helmet="true"
  //
  // ⚠️ Le flag `i` est INDISPENSABLE : react-helmet écrit `hrefLang` en JSX mais
  // Puppeteer sérialise l'attribut en minuscules (`hreflang`). Sans lui, cette
  // regex ne matchait JAMAIS, `seo.hreflang` restait vide, et la branche de
  // repli plus bas décidait seule des hreflang servis en prod — c'est ce qui a
  // laissé `/en/colocation-geneve` pointer vers une URL en 308 pendant 20 jours.
  // Vérifié le 27/07/2026 avant correction : sur les 111 pages qui portent des
  // hreflang, la sortie helmet et le calcul de repli étaient identiques à
  // l'octet près — réparer la regex est donc sans effet de bord.
  const hreflangPattern = /<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]*)"[^>]*>/gi;
  seo.hreflang = [];
  while ((m = hreflangPattern.exec(head)) !== null) {
    seo.hreflang.push({ lang: m[1], href: m[2] });
  }

  return seo;
}
