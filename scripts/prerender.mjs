/**
 * Pre-rendering script for La Villa Coliving SPA
 *
 * Renders each public route with Puppeteer and saves the full HTML
 * so crawlers (Google, GPTBot, ClaudeBot) can read the content
 * without executing JavaScript.
 *
 * Uses @sparticuz/chromium in CI/Vercel (no system Chrome needed)
 * and falls back to regular puppeteer locally.
 *
 * Usage: node scripts/prerender.mjs (called automatically after vite build)
 */

import puppeteerCore from 'puppeteer-core';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, '..', 'dist');
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

/** Get browser instance — @sparticuz/chromium for CI, local Chrome for dev */
async function launchBrowser() {
  try {
    // Try @sparticuz/chromium first (works in Vercel/Lambda/CI)
    const chromium = await import('@sparticuz/chromium');
    const chromiumMod = chromium.default || chromium;
    console.log('  Using @sparticuz/chromium (CI mode)');
    return await puppeteerCore.launch({
      args: chromiumMod.args,
      defaultViewport: chromiumMod.defaultViewport,
      executablePath: await chromiumMod.executablePath(),
      headless: chromiumMod.headless ?? 'new',
    });
  } catch {
    // Fallback: try local Chrome/Chromium
    console.log('  Using local Chrome (dev mode)');
    const possiblePaths = [
      // macOS
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      // Linux
      '/usr/bin/google-chrome',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
    ];

    let execPath = null;
    for (const p of possiblePaths) {
      try {
        await fs.access(p);
        execPath = p;
        break;
      } catch { /* skip */ }
    }

    if (!execPath) {
      // Last resort: try regular puppeteer
      try {
        const puppeteer = await import('puppeteer');
        const puppeteerMod = puppeteer.default || puppeteer;
        return await puppeteerMod.launch({
          headless: 'new',
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
        });
      } catch {
        throw new Error('No Chrome/Chromium found. Install @sparticuz/chromium or puppeteer.');
      }
    }

    return await puppeteerCore.launch({
      executablePath: execPath,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });
  }
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

    const outputPath = route === '/'
      ? path.join(DIST_DIR, 'index.html')
      : path.join(DIST_DIR, route, 'index.html');

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
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

  const server = await startServer();
  const browser = await launchBrowser();

  for (const route of ROUTES) {
    await renderRoute(browser, route);
  }

  await browser.close();
  server.close();

  console.log(`\n🎉 Pre-rendering complete! All ${ROUTES.length} pages saved to dist/\n`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
