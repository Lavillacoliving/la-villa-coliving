/**
 * Aucune requête analytics depuis nos navigateurs automatisés (Lot C, brief « Formulaire,
 * hydratation, mesure », 01/10/2026).
 *
 * Constat : 26 % des événements GA4 depuis juin venaient de nos propres outils (prérendu à 800×600,
 * garde d'hydratation à 390×844 et 1440×900, nom d'hôte localhost). La garde d'index.html ne
 * charge plus GA4 ni Clarity quand navigator.webdriver est vrai ; ce blocage réseau est la seconde
 * ceinture, et la règle permanente pour tout script qui charge des pages (CLAUDE.md §6) :
 *   import { blockAnalytics } from './lib/block-analytics.mjs';
 *   const page = await browser.newPage();
 *   await blockAnalytics(page);
 */

/** Hôtes analytics bloqués (GA4 / gtag et Microsoft Clarity), sous-domaines compris. */
export const ANALYTICS_HOST_RE = /(^|\.)(googletagmanager\.com|google-analytics\.com|analytics\.google\.com|clarity\.ms)$/i;

/** true si l'URL vise un hôte analytics. Pur, testable. */
export function isAnalyticsUrl(url) {
  try {
    return ANALYTICS_HOST_RE.test(new URL(url).hostname);
  } catch {
    return false; // data:, about:… — jamais analytics
  }
}

/**
 * Active l'interception Puppeteer sur `page` : toute requête analytics est annulée, le reste passe.
 * `onBlocked(url)` (optionnel) reçoit chaque URL bloquée — utile pour prouver qu'aucun hit ne part.
 */
export async function blockAnalytics(page, { onBlocked } = {}) {
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (isAnalyticsUrl(req.url())) {
      if (onBlocked) onBlocked(req.url());
      req.abort('blockedbyclient').catch(() => {});
    } else {
      req.continue().catch(() => {});
    }
  });
}
