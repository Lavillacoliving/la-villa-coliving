/**
 * Post-build injection script for pre-rendered pages
 *
 * Runs after "vite build" as part of the Vercel deploy pipeline.
 * No Chrome/Puppeteer needed — pure file manipulation.
 *
 * What it does:
 * 1. Reads dist/index.html (has correct asset references for THIS build)
 * 2. For each pre-rendered file in dist/prerendered/:
 *    - Extracts the #root innerHTML and page-specific meta tags
 *    - Injects them into a fresh copy of dist/index.html
 *    - Overwrites the file with the corrected version
 * 3. Renames dist/index.html → dist/_spa.html so Vercel's static file
 *    matching doesn't bypass the "/" rewrite (which should serve the
 *    pre-rendered homepage, not the empty SPA shell)
 *
 * Why step 3 matters:
 * Vercel serves static files BEFORE processing rewrites. Without renaming,
 * dist/index.html matches "/" directly, bypassing the rewrite to
 * /prerendered/index.html. Renaming to _spa.html forces Vercel to use
 * the rewrite rules for "/" while the catch-all "/(.*)" → "/_spa.html"
 * still serves the SPA shell for non-pre-rendered routes (dashboard, etc.).
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, '..', 'dist');
const PRERENDERED_DIR = path.join(DIST_DIR, 'prerendered');

/**
 * Extract innerHTML of <div id="root"> using depth tracking
 * (handles nested divs correctly)
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

async function main() {
  console.log('\n🔧 Post-build: injecting pre-rendered content...\n');

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
    // Still rename index.html to _spa.html for consistency
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
    console.log('  ⚠️  Could not read vercel.json — hreflang tags will be skipped');
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

  for (const file of htmlFiles) {
    const filePath = path.join(PRERENDERED_DIR, file);
    const prerenderedHtml = await fs.readFile(filePath, 'utf-8');

    // Extract content inside <div id="root">...</div>
    const rootContent = extractRootContent(prerenderedHtml);
    if (!rootContent || rootContent.trim().length < 50) {
      console.log(`  ⚠️  ${file}: No substantial #root content found — skipping`);
      continue;
    }

    // Extract page-specific title
    const titleMatch = prerenderedHtml.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1] : null;

    // Extract page-specific meta description
    const descMatch = prerenderedHtml.match(/<meta\s+name="description"\s+content="([^"]*)"/);
    const description = descMatch ? descMatch[1] : null;

    // Extract page-specific OG tags
    const ogTitleMatch = prerenderedHtml.match(/<meta\s+property="og:title"\s+content="([^"]*)"/);
    const ogDescMatch = prerenderedHtml.match(/<meta\s+property="og:description"\s+content="([^"]*)"/);

    // Start with a fresh copy of index.html (correct asset references)
    let result = indexHtml;

    // Inject pre-rendered content into <div id="root">
    result = result.replace(
      '<div id="root"></div>',
      `<div id="root">${rootContent}</div>`
    );

    // Replace title if page has a specific one
    if (title) {
      result = result.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
    }

    // Replace meta description if page has a specific one
    if (description) {
      result = result.replace(
        /<meta\s+name="description"\s+content="[^"]*"/,
        `<meta name="description" content="${description}"`
      );
    }

    // Replace OG tags if available
    if (ogTitleMatch) {
      result = result.replace(
        /<meta\s+property="og:title"\s+content="[^"]*"/,
        `<meta property="og:title" content="${ogTitleMatch[1]}"`
      );
    }
    if (ogDescMatch) {
      result = result.replace(
        /<meta\s+property="og:description"\s+content="[^"]*"/,
        `<meta property="og:description" content="${ogDescMatch[1]}"`
      );
    }

    // Add hreflang tags for bilingual SEO (using route map from vercel.json)
    const SITE_URL = 'https://www.lavillacoliving.com';
    const destFile = `/prerendered/${file}`;
    const route = routeMap.get(destFile);

    if (route) {
      const isEnglish = route.startsWith('/en');
      let frPath, enPath;

      if (isEnglish) {
        enPath = route;
        frPath = route === '/en' ? '/' : route.replace(/^\/en/, '');
      } else {
        frPath = route;
        enPath = route === '/' ? '/en' : `/en${route}`;
      }

      const hreflangTags = [
        `<link rel="alternate" hreflang="fr" href="${SITE_URL}${frPath}" />`,
        `<link rel="alternate" hreflang="en" href="${SITE_URL}${enPath}" />`,
        `<link rel="alternate" hreflang="x-default" href="${SITE_URL}${frPath}" />`,
      ].join('\n    ');

      result = result.replace('</head>', `    ${hreflangTags}\n  </head>`);

      // Set html lang attribute for English pages
      if (isEnglish) {
        result = result.replace(/<html\s+lang="[^"]*"/, '<html lang="en"');
      }
    }

    // Overwrite the file with the corrected version
    await fs.writeFile(filePath, result, 'utf-8');

    const textContent = rootContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
    const wordCount = textContent.split(' ').filter(w => w.length > 2).length;
    console.log(`  ✅ ${file} → ${wordCount} words injected`);
    successCount++;
  }

  // CRITICAL: Rename dist/index.html → dist/_spa.html
  // This prevents Vercel from serving the empty SPA shell for "/"
  // (Vercel serves static files BEFORE processing rewrites)
  await fs.rename(indexPath, path.join(DIST_DIR, '_spa.html'));
  console.log(`\n  📦 Renamed dist/index.html → dist/_spa.html`);
  console.log(`     (forces Vercel to use rewrite "/" → "/prerendered/index.html")`);

  console.log(`\n🎉 Injection complete! ${successCount}/${htmlFiles.length} pages updated.\n`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
