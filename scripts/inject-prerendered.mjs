/**
 * Post-build injection script for pre-rendered pages
 *
 * Problem: Pre-rendered HTML files (generated locally by Puppeteer) contain
 * script/link tags referencing asset hashes from the LOCAL build. If Vercel's
 * build produces different hashes, those references break.
 *
 * Solution: After vite build, this script:
 * 1. Reads dist/index.html (has correct asset references for THIS build)
 * 2. For each pre-rendered file in dist/prerendered/:
 *    - Extracts the content inside <div id="root">...</div>
 *    - Extracts page-specific <title> and <meta description>
 *    - Injects both into a fresh copy of dist/index.html
 *    - Overwrites the file with the corrected version
 *
 * This ensures pre-rendered pages ALWAYS have correct asset references,
 * regardless of which machine built them.
 *
 * USAGE: Runs automatically as part of "npm run build"
 *        No Chrome/Puppeteer needed — pure file manipulation.
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
  console.log('\n🔧 Injecting pre-rendered content into dist/index.html shell...\n');

  // Read the built index.html (has correct asset references)
  let indexHtml;
  try {
    indexHtml = await fs.readFile(path.join(DIST_DIR, 'index.html'), 'utf-8');
  } catch {
    console.log('  ⚠️  dist/index.html not found — skipping injection.');
    process.exit(0);
  }

  // Check if prerendered directory exists
  try {
    await fs.access(PRERENDERED_DIR);
  } catch {
    console.log('  ⚠️  No dist/prerendered/ directory — skipping injection.');
    process.exit(0);
  }

  const files = await fs.readdir(PRERENDERED_DIR);
  const htmlFiles = files.filter(f => f.endsWith('.html'));

  if (htmlFiles.length === 0) {
    console.log('  ⚠️  No pre-rendered HTML files found — skipping.');
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

    // Overwrite the file with the corrected version
    await fs.writeFile(filePath, result, 'utf-8');

    const textContent = rootContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
    const wordCount = textContent.split(' ').filter(w => w.length > 2).length;
    console.log(`  ✅ ${file} → ${wordCount} words (assets from current build)`);
    successCount++;
  }

  console.log(`\n🎉 Injection complete! ${successCount}/${htmlFiles.length} pages updated.\n`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
