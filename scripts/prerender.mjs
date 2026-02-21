/**
 * Pre-rendering script for La Villa Coliving SPA
 *
 * Renders each public route with Puppeteer and saves the full HTML
 * so crawlers (Google, GPTBot, ClaudeBot) can read the content
 * without executing JavaScript.
 *
 * USAGE:
 *   npm run prerender        (run locally on Mac after vite build)
 *   Automatically called by "npm run build" — skips gracefully if no Chrome
 *
 * Output goes to public/prerendered/ (committed to git).
 * Vercel conditional rewrites serve these files to bots.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, '..', 'dist');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'prerendered');
const PORT = 3456;
const BASE_URL = `http://localhost:${PORT}`;

// Static pages to pre-render (dashboard/portail/blog-posts excluded)
const ROUTES = [
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

/** Serve dist/ with SPA fallback (like Vercel does) */
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

/** Try to get a working browser instance */
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

/** Pre-render a single route and save the HTML */
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

    // Save to public/prerendered/ (committed to git, served by Vercel to bots)
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

async function main() {
  console.log(`\n🚀 Pre-rendering ${ROUTES.length} routes...\n`);

  const browser = await launchBrowser();

  if (!browser) {
    console.log('  ⚠️  No Chrome/Chromium found — skipping pre-rendering.');
    console.log('  💡 Run "npm run prerender" locally on Mac to generate pre-rendered pages.');
    console.log('  ℹ️  The site will work as a normal SPA without pre-rendering.\n');
    process.exit(0); // Exit gracefully — build succeeds
  }

  const server = await startServer();

  for (const route of ROUTES) {
    await renderRoute(browser, route);
  }

  await browser.close();
  server.close();

  console.log(`\n🎉 Pre-rendering complete! All ${ROUTES.length} pages saved to public/prerendered/`);
  console.log(`  💡 Commit these files to git so Vercel serves them to crawlers.\n`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
