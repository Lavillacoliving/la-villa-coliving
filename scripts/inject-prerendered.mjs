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
 * 3. Removes the home-hero <link rel="preload"> (inherited from index.html)
 *    from every page that does not render that image eagerly — otherwise all
 *    118 pages preload ~100 KB for nothing ("preloaded but not used" warning)
 * 4. Renames dist/index.html → dist/_spa.html (hero preload stripped too) so
 *    Vercel's static file matching doesn't bypass the "/" rewrite
 */

import { stripAuthoringComments } from './lib/html-comments.mjs';
// (08/10/2026) extractRootContent / extractSeoTags vivent dans scripts/lib/ : l'empreinte de contenu du
// sitemap (scripts/lib/content-fingerprint.mjs) compare exactement ce que cette injection sert.
import { extractRootContent, extractSeoTags } from './lib/prerendered-extract.mjs';
import fs from 'fs/promises';
import path from 'path';
import { HREFLANG_NO_ALTERNATES } from './hreflang-overrides.mjs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, '..', 'dist');
const PRERENDERED_DIR = path.join(DIST_DIR, 'prerendered');
const SITE_URL = 'https://www.lavillacoliving.com';

// Hero image preloaded in index.html's <head> (must match the href there).
// Puppeteer serializes src with the literal space, so this matches as-is.
const HERO_PRELOAD_IMG = '/images/la villa jardin.webp';

/**
 * True if the page renders the hero image eagerly (an <img> with that exact
 * src and no loading="lazy") — only then is the preload actually consumed.
 * Lazy usages don't count: preloading them re-creates the "not used" warning.
 */
function usesHeroImageEagerly(rootContent) {
  const imgPattern = /<img\b[^>]*>/g;
  let m;
  while ((m = imgPattern.exec(rootContent)) !== null) {
    if (m[0].includes(`src="${HERO_PRELOAD_IMG}"`) && !m[0].includes('loading="lazy"')) {
      return true;
    }
  }
  return false;
}

/**
 * Remove the hero preload <link> (and its comment) from a copy of index.html
 */
function stripHeroPreload(html) {
  return html
    .replace(/\s*<!--\s*Preload hero image[\s\S]*?-->/, '')
    .replace(/\s*<link\s+rel="preload"\s+as="image"\s+href="\/images\/la villa jardin\.webp"[^>]*>/, '');
}

/**
 * Build the SEO head tags string from extracted data + route info
 */
function buildSeoHeadTags(seo, route) {
  const tags = [];
  // (28/09/2026) Page noindex (fiches chambres) : ni canonical ni hreflang — mais les balises
  // OG/Twitter restent, c'est elles que WhatsApp et Instagram lisent pour l'aperçu du lien.
  const noindex = /noindex/i.test(seo.metaName?.robots ?? '');

  // Canonical URL (from pre-rendered or computed from route)
  const canonicalUrl = seo.canonical || `${SITE_URL}${route}`;
  if (!noindex) tags.push(`<link rel="canonical" href="${canonicalUrl}" />`);

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

  // Hreflang tags (from pre-rendered or computed from route).
  // Une route sans équivalent dans l'autre langue n'a pas de cluster : on
  // n'émet rien, quelle que soit la source. Voir scripts/hreflang-overrides.mjs.
  if (noindex || HREFLANG_NO_ALTERNATES.has(route)) {
    // rien
  } else if (seo.hreflang && seo.hreflang.length > 0) {
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

/**
 * Minimal head tags for the 404 page: it is served on ANY unknown URL, so it
 * must carry no canonical, no hreflang, no OG/Twitter URL and no JSON-LD —
 * only the meta name tags (robots noindex, author...) extracted from prerender.
 */
function buildSeoHeadTags404(seo) {
  const tags = [];
  for (const [name, content] of Object.entries(seo.metaName || {})) {
    if (name === 'description') continue; // handled via replace
    tags.push(`<meta name="${name}" content="${content}" />`);
  }
  if (!seo.metaName?.robots) {
    tags.push('<meta name="robots" content="noindex, follow" />');
  }
  return tags.join('\n    ');
}

/**
 * Last-resort 404: SPA shell + noindex, used when no prerendered 404 exists.
 * Guarantees a deploy never ships without dist/404.html (real HTTP 404 on Vercel).
 */
async function writeFallback404(indexHtml) {
  let html = indexHtml.replace(/<title[^>]*>.*?<\/title>/, '<title>404 — Page introuvable | La Villa Coliving</title>');
  html = html.replace('</head>', '    <meta name="robots" content="noindex, follow" />\n  </head>');
  await fs.writeFile(path.join(DIST_DIR, '404.html'), stripAuthoringComments(html), 'utf-8');
  console.log('  📄 Wrote fallback dist/404.html (SPA shell + noindex)');
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
    await writeFallback404(indexHtml);
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
    await writeFallback404(indexHtml);
    await fs.rename(indexPath, path.join(DIST_DIR, '_spa.html'));
    console.log('  📦 Renamed dist/index.html → dist/_spa.html');
    process.exit(0);
  }

  let successCount = 0;
  let seoTagCount = 0;
  const skippedFiles = [];
  const heroPreloadKept = [];

  for (const file of htmlFiles) {
    const filePath = path.join(PRERENDERED_DIR, file);
    const prerenderedHtml = await fs.readFile(filePath, 'utf-8');

    // Extract content inside <div id="root">...</div>
    const rootContent = extractRootContent(prerenderedHtml);
    if (!rootContent || rootContent.trim().length < 50) {
      console.log(`  ⚠️  ${file}: No substantial #root content found — skipping`);
      skippedFiles.push(file);
      continue;
    }

    // Extract ALL SEO tags from pre-rendered HTML
    const seo = extractSeoTags(prerenderedHtml);

    // Determine route for this file
    const destFile = `/prerendered/${file}`;
    const route = routeMap.get(destFile) || `/${file.replace('.html', '').replace(/-/g, '/')}`;
    const isEnglish = route.startsWith('/en');
    // 404.html has no rewrite (served by Vercel on any unknown URL): no canonical/hreflang/OG
    const is404 = file === '404.html';

    // Start with a fresh copy of index.html (correct asset references)
    let result = indexHtml;

    // 0. Remove ALL existing JSON-LD scripts from the base template
    //    (they will be replaced by the page-specific ones extracted from pre-rendered HTML)
    result = result.replace(/<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>\s*/g, '');

    // 0bis. Drop the home-hero preload unless this page renders the image
    //       eagerly (home, /lavilla, pages using it as above-the-fold cover)
    if (usesHeroImageEagerly(rootContent)) {
      heroPreloadKept.push(file);
    } else {
      result = stripHeroPreload(result);
    }

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
      const metaTag = `<meta name="description" content="${seo.metaName.description}" />`;
      if (/<meta\s+name="description"\s+content="[^"]*"[^>]*>/.test(result)) {
        result = result.replace(/<meta\s+name="description"\s+content="[^"]*"[^>]*>/, metaTag);
      } else {
        // (Lot 7, 04/09/2026) Plus de meta statique dans index.html (doublon lu par Google) :
        // la description de la page est insérée en tête de <head>.
        result = result.replace('</head>', `    ${metaTag}\n  </head>`);
      }
    }

    // 4. Build and inject all SEO tags (canonical, OG, Twitter, hreflang, JSON-LD)
    const seoHeadTags = is404 ? buildSeoHeadTags404(seo) : buildSeoHeadTags(seo, route);
    result = result.replace('</head>', `    ${seoHeadTags}\n  </head>`);
    const tagCount = (seoHeadTags.match(/<(meta|link|script)/g) || []).length;
    seoTagCount += tagCount;

    // 5. Set html lang attribute for English pages
    if (isEnglish) {
      result = result.replace(/<html\s+lang="[^"]*"/, '<html lang="en"');
    }

    // Overwrite the file with the corrected version
    // (Lot S1.7) Le head d'index.html réinjecte ses commentaires d'auteur : on les retire ici aussi.
    await fs.writeFile(filePath, stripAuthoringComments(result), 'utf-8');

    const textContent = rootContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
    const wordCount = textContent.split(' ').filter(w => w.length > 2).length;
    console.log(`  ✅ ${file} → ${wordCount} words + ${tagCount} SEO tags`);
    successCount++;
  }

  // FAIL-FAST: a skipped file would ship a raw prerendered page referencing the
  // asset hashes of an OLD build (broken CSS/JS). Better to fail the deploy.
  if (skippedFiles.length > 0) {
    console.error(`\n❌ ${skippedFiles.length}/${htmlFiles.length} prerendered files had no substantial #root content: ${skippedFiles.join(', ')}`);
    console.error('   Failing the build — regenerate the prerendered pages (npm run prerender) before deploying.');
    process.exit(1);
  }

  // Serve the prerendered 404 page as Vercel's custom 404 (real HTTP 404 status
  // for any path matching neither a static file nor a rewrite)
  try {
    await fs.copyFile(path.join(PRERENDERED_DIR, '404.html'), path.join(DIST_DIR, '404.html'));
    console.log('\n  📄 Copied prerendered 404.html → dist/404.html (custom 404 page)');
  } catch {
    await writeFallback404(indexHtml);
  }

  // CRITICAL: Rename dist/index.html → dist/_spa.html. The SPA shell serves
  // app routes (dashboard, portail) that never render the hero: strip the
  // preload from it too.
  await fs.writeFile(path.join(DIST_DIR, '_spa.html'), stripAuthoringComments(stripHeroPreload(indexHtml)), 'utf-8');
  await fs.unlink(indexPath);
  console.log(`\n  📦 Renamed dist/index.html → dist/_spa.html (hero preload stripped)`);

  console.log(`  🖼  Hero preload kept on ${heroPreloadKept.length}/${htmlFiles.length} pages: ${heroPreloadKept.join(', ')}`);
  console.log(`\n🎉 Injection complete! ${successCount}/${htmlFiles.length} pages updated, ${seoTagCount} total SEO tags injected.\n`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
