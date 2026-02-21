/**
 * Post-build injection script for pre-rendered pages
 *
 * Runs after "vite build" as part of the Vercel deploy pipeline.
 * No Chrome/Puppeteer needed — pure file manipulation.
 *
 * What it does:
 * 1. Reads dist/index.html (has correct asset references for THIS build)
 * 2. For each pre-rendered file in dist/prerendered/:
 *    - Extracts the #root innerHTML
 *    - Extracts ALL SEO tags from the pre-rendered <head> (title, meta,
 *      canonical, hreflang, OG, Twitter, JSON-LD, keywords)
 *    - Injects them into a fresh copy of dist/index.html
 *    - Overwrites the file with the corrected version
 * 3. Renames dist/index.html → dist/_spa.html so Vercel's static file
 *    matching doesn't bypass the "/" rewrite
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, '..', 'dist');
const PRERENDERED_DIR = path.join(DIST_DIR, 'prerendered');
const SITE_URL = 'https://www.lavillacoliving.com';

/**
 * Extract innerHTML of <div id="root"> using depth tracking
 */
function extractRootContent(html) {
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
function extractSeoTags(html) {
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

  // JSON-LD scripts (there can be multiple)
  const jsonLdPattern = /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  seo.jsonLd = [];
  while ((m = jsonLdPattern.exec(head)) !== null) {
    // Also check body for JSON-LD (React-Helmet sometimes puts them there)
    seo.jsonLd.push(m[1].trim());
  }
  // Also check full HTML for JSON-LD (in case they're in body via Helmet)
  const jsonLdBodyPattern = /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  while ((m = jsonLdBodyPattern.exec(html)) !== null) {
    const content = m[1].trim();
    if (!seo.jsonLd.includes(content)) {
      seo.jsonLd.push(content);
    }
  }

  // Hreflang links
  // [^>]* before > handles extra attributes like data-react-helmet="true"
  const hreflangPattern = /<link\s+rel="alternate"\s+hrefLang="([^"]+)"\s+href="([^"]*)"[^>]*>/g;
  seo.hreflang = [];
  while ((m = hreflangPattern.exec(head)) !== null) {
    seo.hreflang.push({ lang: m[1], href: m[2] });
  }

  return seo;
}

/**
 * Build the SEO head tags string from extracted data + route info
 */
function buildSeoHeadTags(seo, route) {
  const tags = [];

  // Canonical URL (from pre-rendered or computed from route)
  const canonicalUrl = seo.canonical || `${SITE_URL}${route}`;
  tags.push(`<link rel="canonical" href="${canonicalUrl}" />`);

  // Meta name tags (keywords, robots, author, language)
  for (const [name, content] of Object.entries(seo.metaName || {})) {
    // Skip description — handled separately via replace
    if (name === 'description') continue;
    tags.push(`<meta name="${name}" content="${content}" />`);
  }

  // OG tags
  const ogDefaults = {
    'og:type': 'website',
    'og:site_name': 'La Villa Coliving',
    'og:locale': route.startsWith('/en') ? 'en_US' : 'fr_FR',
    'og:url': canonicalUrl,
    'og:title': seo.title || 'La Villa Coliving',
    'og:description': seo.metaName?.description || '',
    'og:image': 'https://www.lavillacoliving.com/images/la villa jardin.webp',
  };

  // Merge pre-rendered OG tags over defaults
  const ogTags = { ...ogDefaults, ...Object.fromEntries(
    Object.entries(seo.metaProperty || {}).filter(([k]) => k.startsWith('og:'))
  )};

  for (const [prop, content] of Object.entries(ogTags)) {
    if (content) tags.push(`<meta property="${prop}" content="${content}" />`);
  }

  // Twitter cards
  const twitterDefaults = {
    'twitter:card': 'summary_large_image',
    'twitter:url': canonicalUrl,
    'twitter:title': ogTags['og:title'],
    'twitter:description': ogTags['og:description'],
    'twitter:image': ogTags['og:image'],
  };

  const twitterTags = { ...twitterDefaults, ...Object.fromEntries(
    Object.entries(seo.metaProperty || {}).filter(([k]) => k.startsWith('twitter:'))
  )};

  for (const [prop, content] of Object.entries(twitterTags)) {
    if (content) tags.push(`<meta property="${prop}" content="${content}" />`);
  }

  // Hreflang tags (from pre-rendered or computed from route)
  if (seo.hreflang && seo.hreflang.length > 0) {
    for (const { lang, href } of seo.hreflang) {
      tags.push(`<link rel="alternate" hreflang="${lang}" href="${href}" />`);
    }
  } else {
    // Compute hreflang from route
    const isEn = route.startsWith('/en');
    const frPath = isEn ? (route === '/en' ? '/' : route.replace(/^\/en/, '')) : route;
    const enPath = isEn ? route : (route === '/' ? '/en' : `/en${route}`);
    tags.push(`<link rel="alternate" hreflang="fr" href="${SITE_URL}${frPath}" />`);
    tags.push(`<link rel="alternate" hreflang="en" href="${SITE_URL}${enPath}" />`);
    tags.push(`<link rel="alternate" hreflang="x-default" href="${SITE_URL}${frPath}" />`);
  }

  // JSON-LD scripts
  for (const jsonLd of (seo.jsonLd || [])) {
    if (jsonLd) {
      tags.push(`<script type="application/ld+json">${jsonLd}</script>`);
    }
  }

  return tags.join('\n    ');
}

async function main() {
  console.log('\n🔧 Post-build: injecting pre-rendered content + SEO tags...\n');

  // Read the built index.html (has correct asset references)
  const indexPath = path.join(DIST_DIR, 'index.html');
  let indexHtml;
  try {
    indexHtml = await fs.readFile(indexPath, 'utf-8');
  } catch {
    console.log('  ⚠️  dist/index.html not found — skipping injection.');
    process.exit(0);
  }

  // Check if prerendered directory exists
  try {
    await fs.access(PRERENDERED_DIR);
  } catch {
    console.log('  ⚠️  No dist/prerendered/ directory — skipping injection.');
    await fs.rename(indexPath, path.join(DIST_DIR, '_spa.html'));
    console.log('  📦 Renamed dist/index.html → dist/_spa.html');
    process.exit(0);
  }

  // Build route map from vercel.json (destination file → source route)
  const VERCEL_JSON_PATH = path.join(__dirname, '..', 'vercel.json');
  const routeMap = new Map();
  try {
    const vercelConfig = JSON.parse(await fs.readFile(VERCEL_JSON_PATH, 'utf-8'));
    for (const rewrite of vercelConfig.rewrites || []) {
      if (rewrite.destination && rewrite.destination.startsWith('/prerendered/')) {
        routeMap.set(rewrite.destination, rewrite.source);
      }
    }
    console.log(`  📋 Route map loaded: ${routeMap.size} routes from vercel.json`);
  } catch {
    console.log('  ⚠️  Could not read vercel.json — route detection will be limited');
  }

  const files = await fs.readdir(PRERENDERED_DIR);
  const htmlFiles = files.filter(f => f.endsWith('.html'));

  if (htmlFiles.length === 0) {
    console.log('  ⚠️  No pre-rendered HTML files found — skipping injection.');
    await fs.rename(indexPath, path.join(DIST_DIR, '_spa.html'));
    console.log('  📦 Renamed dist/index.html → dist/_spa.html');
    process.exit(0);
  }

  let successCount = 0;
  let seoTagCount = 0;

  for (const file of htmlFiles) {
    const filePath = path.join(PRERENDERED_DIR, file);
    const prerenderedHtml = await fs.readFile(filePath, 'utf-8');

    // Extract content inside <div id="root">...</div>
    const rootContent = extractRootContent(prerenderedHtml);
    if (!rootContent || rootContent.trim().length < 50) {
      console.log(`  ⚠️  ${file}: No substantial #root content found — skipping`);
      continue;
    }

    // Extract ALL SEO tags from pre-rendered HTML
    const seo = extractSeoTags(prerenderedHtml);

    // Determine route for this file
    const destFile = `/prerendered/${file}`;
    const route = routeMap.get(destFile) || `/${file.replace('.html', '').replace(/-/g, '/')}`;
    const isEnglish = route.startsWith('/en');

    // Start with a fresh copy of index.html (correct asset references)
    let result = indexHtml;

    // 1. Inject pre-rendered content into <div id="root">
    result = result.replace(
      '<div id="root"></div>',
      `<div id="root">${rootContent}</div>`
    );

    // 2. Replace title if page has a specific one
    if (seo.title) {
      result = result.replace(/<title[^>]*>.*?<\/title>/, `<title>${seo.title}</title>`);
    }

    // 3. Replace meta description if page has a specific one
    if (seo.metaName?.description) {
      result = result.replace(
        /<meta\s+name="description"\s+content="[^"]*"[^>]*>/,
        `<meta name="description" content="${seo.metaName.description}" />`
      );
    }

    // 4. Build and inject all SEO tags (canonical, OG, Twitter, hreflang, JSON-LD)
    const seoHeadTags = buildSeoHeadTags(seo, route);
    result = result.replace('</head>', `    ${seoHeadTags}\n  </head>`);
    const tagCount = (seoHeadTags.match(/<(meta|link|script)/g) || []).length;
    seoTagCount += tagCount;

    // 5. Set html lang attribute for English pages
    if (isEnglish) {
      result = result.replace(/<html\s+lang="[^"]*"/, '<html lang="en"');
    }

    // Overwrite the file with the corrected version
    await fs.writeFile(filePath, result, 'utf-8');

    const textContent = rootContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
    const wordCount = textContent.split(' ').filter(w => w.length > 2).length;
    console.log(`  ✅ ${file} → ${wordCount} words + ${tagCount} SEO tags`);
    successCount++;
  }

  // CRITICAL: Rename dist/index.html → dist/_spa.html
  await fs.rename(indexPath, path.join(DIST_DIR, '_spa.html'));
  console.log(`\n  📦 Renamed dist/index.html → dist/_spa.html`);

  console.log(`\n🎉 Injection complete! ${successCount}/${htmlFiles.length} pages updated, ${seoTagCount} total SEO tags injected.\n`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
