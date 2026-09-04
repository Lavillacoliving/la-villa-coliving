// Configuration partagée des outils SEO (tools/). Brief n°2 — 21/08/2026.
// ⚠️ MONEY_ROUTES duplique volontairement la hiérarchie de STATIC_PAGE_CONFIG
// (scripts/prerender.mjs) : on n'importe pas prerender.mjs (il lance Puppeteer).
// Si une money page est ajoutée/retirée là-bas, la refléter ici.

export const SITE = 'https://www.lavillacoliving.com';

// Pages « money » (transactionnelles + maisons + piliers), FR puis jumelles EN.
// `/colocation-geneve` (FR) n'est dans le sitemap qu'après le revert du 25/08 :
// le graphe ne l'analyse que s'il est présent — rien à changer ici ce jour-là.
export const MONEY_ROUTES = [
  '/', '/annemasse-colocation', '/chambre-a-louer-annemasse', '/chambre-a-louer-geneve', '/colocation-geneve',
  '/tarifs', '/candidature', '/nos-maisons', '/lavilla', '/leloft', '/lelodge', '/le-coliving',
  '/en', '/en/colocation-geneve', '/en/annemasse-colocation', '/en/chambre-a-louer-annemasse', '/en/chambre-a-louer-geneve',
  '/en/tarifs', '/en/candidature', '/en/nos-maisons', '/en/lavilla', '/en/leloft', '/en/lelodge', '/en/le-coliving',
];

// Mots-clés « exact » par cible (texte d'ancre normalisé : minuscules, sans accents).
// Sert à classer les ancres contextuelles (marque / URL nue / générique / exact|partiel).
export const MONEY_KEYWORDS = {
  '/': ['accueil', 'coliving geneve', 'coliving geneva'], // (Lot 4, 04/09/2026) cible DÉFENSE ; la marque est gérée par BRAND_RE
  '/annemasse-colocation': ['colocation annemasse', 'colocation a annemasse', 'coliving annemasse', 'coliving a annemasse'],
  '/chambre-a-louer-annemasse': ['chambre a louer annemasse', 'chambre a louer a annemasse', 'chambre meublee annemasse', 'chambres a louer annemasse'],
  '/colocation-geneve': ['colocation geneve', 'colocation a geneve', 'colocation pres de geneve'],
  '/chambre-a-louer-geneve': ['chambre a louer geneve', 'chambre a louer a geneve', 'chambre a louer pres de geneve', 'chambre meublee geneve', 'chambre meublee pres de geneve'],
  '/tarifs': ['tarifs', 'nos tarifs', 'prix', 'les tarifs'],
  '/candidature': ['candidature', 'candidater', 'postuler', 'je candidate'],
  '/nos-maisons': ['nos maisons', 'nos 3 maisons', 'les 3 maisons', 'voir les 3 maisons', 'voir toutes les maisons'],
  '/lavilla': ['la villa'],
  '/leloft': ['le loft'],
  '/lelodge': ['le lodge'],
  '/le-coliving': ['coliving geneve', 'le coliving', 'coliving a geneve'],
  '/en': ['home'],
  '/en/colocation-geneve': ['shared housing geneva', 'shared housing near geneva', 'flatshare geneva', 'room for rent geneva', 'rooms for rent geneva'],
  '/en/annemasse-colocation': ['shared housing annemasse', 'flatshare annemasse', 'shared housing in annemasse'],
  '/en/chambre-a-louer-annemasse': ['rooms for rent annemasse', 'rooms for rent in annemasse', 'furnished rooms annemasse'],
  '/en/chambre-a-louer-geneve': ['room to rent geneva', 'room to rent near geneva', 'rooms for rent near geneva', 'furnished room geneva', 'furnished room near geneva'],
  '/en/tarifs': ['rates', 'prices', 'our rates'],
  '/en/candidature': ['apply', 'apply now', 'application'],
  '/en/nos-maisons': ['our houses', 'see the 3 houses', 'see all houses'],
  '/en/lavilla': ['la villa'],
  '/en/leloft': ['le loft'],
  '/en/lelodge': ['le lodge'],
  '/en/le-coliving': ['coliving geneva', 'the coliving'],
};

// Ancre « marque » (maisons incluses : leur nom est la marque). Depuis le 04/09/2026 le test marque prime
// sur exact/partiel dans classifyAnchor : « La Villa Coliving près de Genève » = marque, pas partiel.
export const BRAND_RE = /la ?villa( coliving)?|lavillacoliving|villa coliving|le loft|le lodge/i;

// Signature des liens éditoriaux (markdown du blog → <LocalizedLink className=…>,
// voir src/pages/BlogPostPage.tsx mdComponents.a). À mettre à jour si la classe change.
export const EDITORIAL_CLASS = 'text-[#D4A574] hover:underline';

export const THRESHOLDS = {
  underfedContextual: 3,      // money page « sous-alimentée » si < 3 entrants contextuels
  overOptimizedShare: 0.5,    // exact+partiel ≥ 50 % des entrants contextuels (n ≥ 5) → alerte
  overOptimizedMinN: 5,
  sameAnchorShare: 0.6,       // une même chaîne d'ancre ≥ 60 % → alerte
  mentionMin: 2,              // mentions textuelles sans lien ≥ 2 → opportunité
};

// Mentions textuelles (dans <main> des articles) qui devraient mener à une money page.
// Une regex par cible, comptée en occurrences ; FR pour /blog/*, EN pour /en/blog/*.
export const MENTION_PATTERNS = {
  fr: {
    '/annemasse-colocation': /colocation (?:a |à )?annemasse|coloc(?:ation)?s? (?:sur |dans |à |a )?annemasse|annemasse agglo/gi,
    '/chambre-a-louer-annemasse': /chambres? (?:meubl[ée]es? )?(?:à louer |a louer )?(?:à |a |sur )?annemasse/gi,
    '/colocation-geneve': /colocation (?:à |a )?gen[eè]ve/gi,
    '/chambre-a-louer-geneve': /chambres? (?:meubl[ée]es? )?(?:à louer |a louer )?(?:à |a |près de |pres de |sur )?gen[eè]ve/gi,
    '/tarifs': /\b(?:nos tarifs|tarifs?|grille tarifaire|loyer tout inclus)\b/gi,
    '/candidature': /candidat(?:ure|er|e)\b/gi,
    '/lelodge': /\ble lodge\b/gi,
    '/leloft': /\ble loft\b/gi,
    '/lavilla': /\bla villa\b(?! coliving| team)/gi,
    '/nos-maisons': /nos (?:3 |trois )?maisons|les 3 maisons/gi,
    '/observatoire-logement-frontalier-geneve': /observatoire du logement|observatoire frontalier|notre observatoire/gi,
  },
  en: {
    '/en/colocation-geneve': /shared housing|flatshare|rooms? for rent|flat ?share/gi,
    '/en/annemasse-colocation': /(?:in|near|around|to|from) annemasse|annemasse(?: area| side| agglo)|shared housing in annemasse|flatshare(?:s)? in annemasse/gi,
    '/en/tarifs': /\b(?:our rates|rates|pricing|all-inclusive rent)\b/gi,
    '/en/candidature': /\bapply\b|application/gi,
    '/en/lelodge': /\ble lodge\b/gi,
    '/en/leloft': /\ble loft\b/gi,
    '/en/lavilla': /\bla villa\b(?! coliving| team)/gi,
    '/en/nos-maisons': /our (?:3 |three )?houses/gi,
    '/en/observatoire-logement-frontalier-geneve': /observatory/gi,
  },
};
