/**
 * Pre-rendering script for La Villa Coliving SPA
 *
 * FULLY AUTOMATED:
 * 1. Fetches all published blog slugs from Supabase (no hardcoding)
 * 2. Updates vercel.json with the correct blog rewrites
 * 3. Pre-renders all static + blog pages with Puppeteer
 *
 * USAGE:
 *   npm run build:local    (build + prerender + inject — the full pipeline)
 *   npm run prerender       (prerender only, after a vite build)
 *
 * Output goes to public/prerendered/ (committed to git).
 * On Vercel, inject-prerendered.mjs re-wraps content in the current index.html.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import https from 'https';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, '..', 'dist');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'prerendered');
const VERCEL_JSON_PATH = path.join(__dirname, '..', 'vercel.json');
const PORT = 3456;
const BASE_URL = `http://localhost:${PORT}`;

// Supabase config (same as src/lib/supabase.ts — anon key, read-only)
const SUPABASE_URL = 'https://tefpynkdxxfiefpkgitz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZnB5bmtkeHhmaWVmcGtnaXR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4OTg5NDksImV4cCI6MjA4NjQ3NDk0OX0.X_Z85w6L4i1IkVevMK73hpFRClCpgh0Gh0WMY9pdDtw';

// Static pages to pre-render (manually maintained — rarely changes)
const STATIC_ROUTES_FR = [
  '/',
  '/colocation-geneve',
  '/le-coliving',
  '/nos-maisons',
  '/services',
  '/tarifs',
  '/faq',
  '/candidature',
  '/blog',
  '/lavilla',
  '/leloft',
  '/lelodge',
  '/investisseurs',
];

// English versions of all static pages (same paths with /en prefix)
const STATIC_ROUTES_EN = STATIC_ROUTES_FR.map(r => r === '/' ? '/en' : `/en${r}`);

const STATIC_ROUTES = [...STATIC_ROUTES_FR, ...STATIC_ROUTES_EN];

// ─────────────────────────────────────────────
// Supabase: fetch published blog slugs
// ─────────────────────────────────────────────

function httpsGet(url, headers) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

async function fetchBlogSlugs() {
  console.log('  📡 Fetching published blog slugs from Supabase...');
  try {
    const url = `${SUPABASE_URL}/rest/v1/blog_posts?select=slug&is_published=eq.true&order=published_at.desc`;
    const posts = await httpsGet(url, {
      'apikey': SUPABASE_ANON_KEY,
      'Accept': 'application/json',
    });
    const slugsFr = posts.map(p => `/blog/${p.slug}`);
    const slugsEn = posts.map(p => `/en/blog/${p.slug}`);
    const slugs = [...slugsFr, ...slugsEn];
    console.log(`  📝 Found ${slugsFr.length} published articles (× 2 languages = ${slugs.length} routes)\n`);
    return slugs;
  } catch (err) {
    console.error(`  ⚠️  Failed to fetch blog slugs: ${err.message}`);
    console.log('  ℹ️  Continuing with static routes only.\n');
    return [];
  }
}

// ─────────────────────────────────────────────
// Auto-update vercel.json with blog rewrites
// ─────────────────────────────────────────────

async function updateVercelJson(blogRoutes) {
  console.log('  📦 Updating vercel.json with blog + EN rewrites...');
  const config = JSON.parse(await fs.readFile(VERCEL_JSON_PATH, 'utf-8'));

  // Remove all existing dynamic rewrites (blog/* and /en/*) — keep manually-set static FR rewrites + catch-all
  const keepRewrites = config.rewrites.filter(r =>
    !r.source.startsWith('/blog/') &&
    !r.source.startsWith('/en')
  );

  // Find the catch-all position
  const catchAllIndex = keepRewrites.findIndex(r => r.source === '/(.*)');
  if (catchAllIndex === -1) {
    console.error('  ❌ No catch-all rewrite found in vercel.json!');
    return;
  }

  // Generate EN static rewrites
  const enStaticRewrites = STATIC_ROUTES_EN.map(route => ({
    source: route,
    destination: `/prerendered/${route.slice(1).replace(/\//g, '-')}.html`,
  }));

  // Generate blog rewrites (FR + EN)
  const blogRewrites = blogRoutes.map(route => ({
    source: route,
    destination: `/prerendered/${route.slice(1).replace(/\//g, '-')}.html`,
  }));

  // Insert all dynamic rewrites before catch-all
  const allNewRewrites = [...enStaticRewrites, ...blogRewrites];
  keepRewrites.splice(catchAllIndex, 0, ...allNewRewrites);
  config.rewrites = keepRewrites;

  await fs.writeFile(VERCEL_JSON_PATH, JSON.stringify(config, null, 2) + '\n', 'utf-8');
  console.log(`  ✅ vercel.json updated: ${enStaticRewrites.length} EN static + ${blogRewrites.length} blog rewrites\n`);
}

// ─────────────────────────────────────────────
// Local HTTP server (serves dist/ for Puppeteer)
// ─────────────────────────────────────────────

function startServer() {
  return new Promise((resolve) => {
    const MIME = {
      '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
      '.svg': 'image/svg+xml', '.json': 'application/json', '.webp': 'image/webp',
      '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2',
    };

    const server = http.createServer(async (req, res) => {
      let url = req.url.split('?')[0];
      let filePath = path.join(DIST_DIR, url);
      const ext = path.extname(url);

      try {
        let data;
        try {
          const stat = await fs.stat(filePath);
          if (stat.isDirectory()) filePath = path.join(filePath, 'index.html');
          data = await fs.readFile(filePath);
        } catch {
          if (!ext) {
            data = await fs.readFile(path.join(DIST_DIR, 'index.html'));
          } else {
            res.writeHead(404);
            res.end();
            return;
          }
        }
        res.setHeader('Content-Type', MIME[path.extname(filePath)] || MIME[ext] || 'text/html');
        res.writeHead(200);
        res.end(data);
      } catch {
        res.writeHead(404);
        res.end();
      }
    });

    server.listen(PORT, () => resolve(server));
  });
}

// ─────────────────────────────────────────────
// Puppeteer: launch browser
// ─────────────────────────────────────────────

async function launchBrowser() {
  // Strategy 1: puppeteer (full, with bundled Chrome) — works on Mac/dev
  try {
    const puppeteer = await import('puppeteer');
    const mod = puppeteer.default || puppeteer;
    console.log('  Using puppeteer (local Chrome)');
    return await mod.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });
  } catch { /* not installed or no Chrome */ }

  // Strategy 2: puppeteer-core with known Chrome paths
  try {
    const puppeteerCore = await import('puppeteer-core');
    const mod = puppeteerCore.default || puppeteerCore;
    const possiblePaths = [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      '/usr/bin/google-chrome',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
    ];

    for (const execPath of possiblePaths) {
      try {
        await fs.access(execPath);
        console.log(`  Using Chrome at ${execPath}`);
        return await mod.launch({
          executablePath: execPath,
          headless: 'new',
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
        });
      } catch { /* try next */ }
    }
  } catch { /* puppeteer-core not installed */ }

  return null; // No browser available
}

// ─────────────────────────────────────────────
// Pre-render a single route
// ─────────────────────────────────────────────

async function renderRoute(browser, route) {
  const page = await browser.newPage();
  try {
    await page.goto(`${BASE_URL}${route}`, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // Give React + react-helmet a moment to finish
    await new Promise(r => setTimeout(r, 1500));

    const html = await page.content();

    // Save to public/prerendered/ (committed to git, served by Vercel)
    const fileName = route === '/' ? 'index.html' : `${route.slice(1).replace(/\//g, '-')}.html`;
    const outputPath = path.join(OUTPUT_DIR, fileName);

    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    await fs.writeFile(outputPath, html, 'utf-8');

    const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
    const wordCount = textContent.split(' ').filter(w => w.length > 2).length;
    console.log(`  ✅ ${route} → ${wordCount} words`);
  } catch (error) {
    console.error(`  ❌ ${route}: ${error.message}`);
  } finally {
    await page.close();
  }
}

// ─────────────────────────────────────────────
// Clean up old pre-rendered files that are no longer needed
// ─────────────────────────────────────────────

async function cleanupOldFiles(allRoutes) {
  try {
    const existingFiles = await fs.readdir(OUTPUT_DIR);
    const expectedFiles = new Set(
      allRoutes.map(route =>
        route === '/' ? 'index.html' : `${route.slice(1).replace(/\//g, '-')}.html`
      )
    );
    expectedFiles.add('.gitkeep');

    for (const file of existingFiles) {
      if (!expectedFiles.has(file)) {
        await fs.unlink(path.join(OUTPUT_DIR, file));
        console.log(`  🗑️  Removed obsolete: ${file}`);
      }
    }
  } catch { /* OUTPUT_DIR doesn't exist yet, nothing to clean */ }
}


// ─────────────────────────────────────────────
// Auto-generate sitemap.xml with all routes + hreflang
// ─────────────────────────────────────────────

const SITEMAP_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');
const SITE_URL = 'https://www.lavillacoliving.com';

// Priority/frequency config for static pages
const STATIC_PAGE_CONFIG = {
  '/': { priority: '1.0', changefreq: 'weekly' },
  '/colocation-geneve': { priority: '0.9', changefreq: 'weekly' },
  '/le-coliving': { priority: '0.8', changefreq: 'monthly' },
  '/nos-maisons': { priority: '0.8', changefreq: 'weekly' },
  '/lavilla': { priority: '0.8', changefreq: 'weekly' },
  '/leloft': { priority: '0.8', changefreq: 'weekly' },
  '/lelodge': { priority: '0.8', changefreq: 'weekly' },
  '/services': { priority: '0.7', changefreq: 'monthly' },
  '/tarifs': { priority: '0.7', changefreq: 'monthly' },
  '/faq': { priority: '0.7', changefreq: 'monthly' },
  '/candidature': { priority: '0.7', changefreq: 'monthly' },
  '/blog': { priority: '0.7', changefreq: 'weekly' },
  '/investisseurs': { priority: '0.6', changefreq: 'monthly' },
};

async function generateSitemap(blogSlugs) {
  console.log('  🗺️  Generating sitemap.xml...');
  const today = new Date().toISOString().slice(0, 10);

  function sitemapEntry(locPath, frPath, enPath, priority, changefreq, lastmod) {
    return `  <url>
    <loc>${SITE_URL}${locPath}</loc>
    <xhtml:link rel="alternate" hreflang="fr" href="${SITE_URL}${frPath}" />
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}${enPath}" />
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }

  const entries = [];

  // FR static pages
  entries.push('  <!-- ═══ STATIC PAGES — FR ═══ -->');
  for (const route of STATIC_ROUTES_FR) {
    const config = STATIC_PAGE_CONFIG[route] || { priority: '0.5', changefreq: 'monthly' };
    const enRoute = route === '/' ? '/en' : `/en${route}`;
    entries.push(sitemapEntry(route, route, enRoute, config.priority, config.changefreq, today));
  }

  // EN static pages (lower priority than FR equivalents)
  entries.push('\n  <!-- ═══ STATIC PAGES — EN ═══ -->');
  for (const route of STATIC_ROUTES_FR) {
    const config = STATIC_PAGE_CONFIG[route] || { priority: '0.5', changefreq: 'monthly' };
    const enRoute = route === '/' ? '/en' : `/en${route}`;
    const frRoute = route;  // FR path = the original route
    const enPriority = (parseFloat(config.priority) - 0.1).toFixed(1);
    entries.push(sitemapEntry(enRoute, frRoute, enRoute, enPriority, config.changefreq, today));
  }

  // Blog articles (FR + EN) — only FR slugs, we generate both
  const frBlogSlugs = blogSlugs.filter(s => !s.startsWith('/en/'));
  if (frBlogSlugs.length > 0) {
    entries.push('\n  <!-- ═══ BLOG ARTICLES — FR ═══ -->');
    for (const slug of frBlogSlugs) {
      const enSlug = `/en${slug}`;
      entries.push(sitemapEntry(slug, slug, enSlug, '0.6', 'monthly', today));
    }
    entries.push('\n  <!-- ═══ BLOG ARTICLES — EN ═══ -->');
    for (const slug of frBlogSlugs) {
      const enSlug = `/en${slug}`;
      entries.push(sitemapEntry(enSlug, slug, enSlug, '0.5', 'monthly', today));
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;

  await fs.writeFile(SITEMAP_PATH, sitemap, 'utf-8');
  const totalUrls = (sitemap.match(/<url>/g) || []).length;
  console.log(`  ✅ sitemap.xml updated: ${totalUrls} URLs (${STATIC_ROUTES_FR.length} FR static + ${STATIC_ROUTES_FR.length} EN static + ${frBlogSlugs.length * 2} blog)\n`);
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────

async function main() {
  console.log('\n🚀 La Villa Coliving — Pre-rendering pipeline\n');

  // Step 1: Fetch blog slugs from Supabase
  const blogRoutes = await fetchBlogSlugs();
  const allRoutes = [...STATIC_ROUTES, ...blogRoutes];

  // Step 2: Update vercel.json (always run — EN static routes + blog routes)
  await updateVercelJson(blogRoutes);

  // Step 2b: Generate sitemap.xml with all routes + hreflang
  await generateSitemap(blogRoutes);

  // Step 3: Check for browser
  console.log(`  🔍 Preparing to render ${allRoutes.length} pages (${STATIC_ROUTES_FR.length} FR static + ${STATIC_ROUTES_EN.length} EN static + ${blogRoutes.length} blog)...\n`);

  const browser = await launchBrowser();

  if (!browser) {
    console.log('  ⚠️  No Chrome/Chromium found — skipping pre-rendering.');
    console.log('  💡 Run "npm run prerender" locally on Mac to generate pre-rendered pages.');
    console.log('  ℹ️  The site will work as a normal SPA without pre-rendering.\n');
    process.exit(0);
  }

  // Step 4: Clean up obsolete pre-rendered files
  await cleanupOldFiles(allRoutes);

  // Step 5: Pre-render all pages
  const server = await startServer();

  for (const route of allRoutes) {
    await renderRoute(browser, route);
  }

  await browser.close();
  server.close();

  console.log(`\n🎉 Pre-rendering complete! ${allRoutes.length} pages saved to public/prerendered/`);
  console.log('  💡 Commit all changes (including vercel.json) and push to deploy.\n');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
