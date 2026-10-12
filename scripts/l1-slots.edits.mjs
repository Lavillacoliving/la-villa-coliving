/**
 * Lot L1 « Ingénierie des créneaux » (brief v3.1 du 09/10/2026), sous-lot L1.E — liste DÉCLARATIVE des
 * modifications à appliquer aux articles de blog stockés en base (table blog_posts, colonnes content_fr /
 * content_en). Consommée par scripts/build-slots-sql.mjs, qui relit le contenu VIVANT par REST, exige
 * exactement une occurrence de chaque `find` et génère scripts/l1-answer-slots-<date>.sql (idempotent).
 *
 * Règles de ce fichier :
 *  - `find` est copié AU CARACTÈRE PRÈS depuis l'article (dump du 09/10/2026) : espaces insécables U+00A0 des
 *    « 1 370 » écrits `${NB}`, signe moins U+2212 de cout-de-la-vie écrit `${MINUS}`, tirets « — » et « – »
 *    littéraux. Un `find` peut couvrir plusieurs lignes (sections entières retirées pour M1).
 *  - `replace` est une FONCTION de la source unique `m` (src/data/answerSlots.ts, entityFacts.ts, stats.ts chargés
 *    par scripts/lib/load-entity-facts.mjs) : aucun prix, aucune minute, aucun nombre de chambres n'est écrit ici ;
 *    les seuls littéraux sont les ancres `find` et la prose sans chiffre. Les sommes d'exemple du marché
 *    (« ≈ 1 400 EUR ») sont signalées en commentaire : ce ne sont pas des faits La Villa.
 *  - Jamais un concurrent nommé ; les plateformes (La Carte des Colocs, Leboncoin, Roomlala) n'apparaissent que
 *    dans les textes canoniques de `m`, jamais liées. Jamais « 15 min », jamais « sans garant » / « no guarantor »
 *    en promesse, jamais de promesse de trajet en voiture, jamais « Gaillard » dans une liste de zones. FR =
 *    tutoiement, EN = « you », parité FR/EN.
 *  - Mécanismes : M1 = retrait d'une section « Où chercher » (le bloc <OuChercher/> est inséré par le code devant le
 *    H2 d'ancrage) · M2 = phrase de commune (communeSentence) · M3 = ligne de tableau budget / coût de la vie ·
 *    M4 = réponse « sans fiche de salaire suisse » (a6Text) · footer = pied commun des 25 articles (formule D1) ·
 *    fix = correction ponctuelle (chiffre périmé, tutoiement, lien EN).
 *
 * Pages de décision (s-installer…, coliving-colocation-ou-studio…, vivre-a-annemasse…) : traitées par un autre
 * agent via leurs sources git (content/decision-pages) — absentes ici, y compris du pied commun (vérifié : leur
 * pied ne porte pas la phrase « à 20 minutes de Genève en Léman Express ou tram »).
 */

export const NB = ' '; // espace insécable des nombres (« 1 370 »)
export const MINUS = '−'; // signe moins typographique du tableau de cout-de-la-vie

/** Miroir de stats.ts:thousands (le module n'exporte pas la fonction vers Node) ; vérifié contre priceRangeCell() dans buildEdits. */
export const thousands = (n, sep) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep);

/** Les 25 articles qui portent le pied commun « 👉 … à 20 minutes de Genève en Léman Express ou tram. » (FR) / « … 15-20 minutes from Geneva by Léman Express or tram. » (EN) — grep des dumps du 09/10/2026, 1 occurrence par slug et par langue. */
export const FOOTER_SLUGS = [
  'allocations-familiales-frontalier-geneve-2026',
  'arnaques-logement-frontalier-geneve-eviter',
  'assurance-sante-frontalier-lamal-cmu-budget',
  'avenant-fiscal-40-frontalier-geneve',
  'banque-telephone-internet-frontalier-bons-plans',
  'budget-colocation-geneve-guide-complet',
  'choc-culturel-franco-suisse-expatrie-geneve',
  'cout-de-la-vie-suisse-france-frontalier-2026',
  'declaration-impots-frontalier-2026',
  'demenager-geneve-frontalier-checklist',
  'ecole-internationale-geneve-frontalier-ou-habiter',
  'fiscalite-frontalier-geneve-impots-2026',
  'grand-geneve-2026-nouveautes-frontaliers',
  'guide-ressources-frontalier-geneve',
  'living-in-france-working-in-geneva',
  'optimiser-espace-coliving-productivite-bien-etre',
  'organisations-internationales-geneve-ou-habiter',
  'ou-habiter-frontalier-suisse-villes-france-pas-cher',
  'permis-g-frontalier-geneve',
  'quitter-son-logement-guide-pratique',
  'salaire-suisse-net-frontalier-2026',
  'se-faire-reseau-geneve-arriver-seul',
  'teletravail-frontalier-geneve-regles-2026',
  'trouver-colocation-geneve-frontalier',
  'vie-quotidienne-frontalier-courses-sport-sorties',
];

export const FOOTER_FIND = {
  fr: 'sans frais de dossier — à 20 minutes de Genève en Léman Express ou tram.',
  en: 'no application fee — 15-20 minutes from Geneva by Léman Express or tram.',
};

/**
 * Têtes des 25 pieds EN (GO coordinateur, 09/10) : le lien pointe vers l'URL FR `/colocation-geneve` (→ `/en/colocation-geneve`)
 * et, sur 8 articles, l'ancre est cassée (« Looking for [see our rooms on the French side] » → « a room on the French side »,
 * formulation retenue pour cout-de-la-vie). Trois têtes observées dans les dumps du 09/10, une par slug ; même vague
 * « Mis à jour » que le reste du lot.
 */
export const FOOTER_EN_HEAD = {
  brand: {
    find: '**Looking for [La Villa Coliving, French side](/colocation-geneve)?**',
    replace: '**Looking for [La Villa Coliving, French side](/en/colocation-geneve)?**',
    note: 'EN footer 👉: link to the FR URL /colocation-geneve → /en/colocation-geneve',
  },
  shared: {
    find: '**Looking for [shared housing near Geneva](/colocation-geneve)?**',
    replace: '**Looking for [shared housing near Geneva](/en/colocation-geneve)?**',
    note: 'EN footer 👉: link to the FR URL /colocation-geneve → /en/colocation-geneve',
  },
  broken: {
    find: '**Looking for [see our rooms on the French side](/colocation-geneve)?**',
    replace: '**Looking for [a room on the French side](/en/colocation-geneve)?**',
    note: 'EN footer 👉: broken anchor “Looking for [see our rooms on the French side]” (FR URL) → proper sentence and /en/ URL',
  },
};
export const FOOTER_EN_HEAD_BY_SLUG = {
  'allocations-familiales-frontalier-geneve-2026': 'brand',
  'arnaques-logement-frontalier-geneve-eviter': 'brand',
  'assurance-sante-frontalier-lamal-cmu-budget': 'brand',
  'avenant-fiscal-40-frontalier-geneve': 'brand',
  'banque-telephone-internet-frontalier-bons-plans': 'brand',
  'budget-colocation-geneve-guide-complet': 'brand',
  'choc-culturel-franco-suisse-expatrie-geneve': 'brand',
  'cout-de-la-vie-suisse-france-frontalier-2026': 'broken',
  'declaration-impots-frontalier-2026': 'broken',
  'demenager-geneve-frontalier-checklist': 'broken',
  'ecole-internationale-geneve-frontalier-ou-habiter': 'broken',
  'fiscalite-frontalier-geneve-impots-2026': 'broken',
  'grand-geneve-2026-nouveautes-frontaliers': 'broken',
  'guide-ressources-frontalier-geneve': 'broken',
  'living-in-france-working-in-geneva': 'shared',
  'optimiser-espace-coliving-productivite-bien-etre': 'shared',
  'organisations-internationales-geneve-ou-habiter': 'shared',
  'ou-habiter-frontalier-suisse-villes-france-pas-cher': 'shared',
  'permis-g-frontalier-geneve': 'shared',
  'quitter-son-logement-guide-pratique': 'shared',
  'salaire-suisse-net-frontalier-2026': 'broken',
  'se-faire-reseau-geneve-arriver-seul': 'shared',
  'teletravail-frontalier-geneve-regles-2026': 'shared',
  'trouver-colocation-geneve-frontalier': 'shared',
  'vie-quotidienne-frontalier-courses-sport-sorties': 'shared',
};

// ── Dérivations depuis la source unique ────────────────────────────────────────────────────────────

const sepOf = (lang) => (lang === 'en' ? ',' : NB);
/** « 1 430 CHF » / « 1,430 CHF » : le prix standard (salle d'eau privative) dans la graphie des tableaux du blog. */
const standardChfCell = (m, lang) => `${thousands(m.ENTITY_FACTS.price.standardChf, sepOf(lang))} CHF`;
/** « 1 470 à 1 530 € » / « €1,470 to €1,530 » : loyers contractuels en euros (D7). */
const eurRangeText = (m, lang) => {
  const lo = thousands(m.ENTITY_FACTS.price.fromEur, sepOf(lang));
  const hi = thousands(m.ENTITY_FACTS.price.standardEur, sepOf(lang));
  return lang === 'en' ? `€${lo} to €${hi}` : `${lo} à ${hi} €`;
};
/** « 700 à 1 000 € » / « €700 to €1,000 » : chambre entre particuliers (MARKET_ROOM_EUR, D0 amendement c). */
const marketRangeText = (m, lang) => {
  const { min, max } = m.MARKET_ROOM_EUR;
  return lang === 'en' ? `€${min} to €${thousands(max, ',')}` : `${min} à ${thousands(max, NB)} €`;
};
/** « Ville-la-Grand, Ambilly ou Annemasse » dans l'ordre des maisons de la fiche entité. */
const communesText = (m, lang) => {
  const c = m.ENTITY_HOUSES.map((h) => h.commune);
  return `${c.slice(0, -1).join(', ')} ${lang === 'en' ? 'or' : 'ou'} ${c[c.length - 1]}`;
};
/** Phrase de commune du Lodge avec « Le Lodge » porté par le lien existant de l'article. */
const lodgeSentenceLinked = (m, lang) => {
  const s = m.communeSentence('lelodge', lang);
  if (s.split('Le Lodge').length !== 2) throw new Error(`communeSentence(lelodge, ${lang}) : « Le Lodge » attendu une fois`);
  return s.replace('Le Lodge', `[Le Lodge](${lang === 'en' ? '/en/lelodge' : '/lelodge'})`);
};
/** Réponse A.6 avec la question en gras (budget-colocation, § sans titre). */
const a6Bold = (m, lang) => {
  const s = m.a6Text(lang);
  const q = s.match(/^[^?]+\?/);
  if (!q) throw new Error(`a6Text(${lang}) : question introductive attendue`);
  return `**${q[0]}**${s.slice(q[0].length)}`;
};
/** Puce « En résumé » : les canaux du bloc court « Où chercher », dans son ordre, le premier lié au comparatif. */
const NUMBER_WORDS = { 3: { fr: 'trois', en: 'three' }, 4: { fr: 'quatre', en: 'four' }, 5: { fr: 'cinq', en: 'five' } };
const lcFirst = (s) => (/^(Facebook|CAGI|La Villa|Léman)/.test(s) ? s : s[0].toLowerCase() + s.slice(1));
const channelsBullet = (m, lang) => {
  const h3s = m.ouChercherText(lang, 'short').sections.map((s) => lcFirst(s.h3));
  const word = NUMBER_WORDS[h3s.length]?.[lang];
  if (!word) throw new Error(`bloc court « Où chercher » : ${h3s.length} canaux, nombre non prévu dans NUMBER_WORDS`);
  const link = lang === 'en' ? '/en/blog/coliving-colocation-ou-studio-geneve-comparatif' : '/blog/coliving-colocation-ou-studio-geneve-comparatif';
  const items = [`[${h3s[0]}](${link}) ${lang === 'en' ? 'such as' : 'comme'} La Villa Coliving`, ...h3s.slice(1)];
  const list = `${items.slice(0, -1).join(', ')} ${lang === 'en' ? 'and' : 'et'} ${items[items.length - 1]}`;
  return lang === 'en' ? `- Search through ${word} channels: ${list}.` : `- Cherche par ${word} canaux : ${list}.`;
};

// ── La liste ───────────────────────────────────────────────────────────────────────────────────────

const EDITS = [
  // ═══ trouver-colocation-geneve-frontalier ═══════════════════════════════════════════════════════
  {
    slug: 'trouver-colocation-geneve-frontalier', lang: 'fr', mechanism: 'M1',
    note: 'retrait de la section « Où chercher concrètement ? » (titre + chapô + 4 puces) ; le bloc <OuChercher/> est inséré par le code devant « ## Comment éviter les arnaques ? »',
    find: [
      '## Où chercher concrètement ?',
      '',
      'Plusieurs pistes, avec leurs avantages et leurs limites :',
      '- les **groupes Facebook frontaliers** (très actifs, mais premier arrivé premier servi) ;',
      "- les sites d'annonces (leboncoin, etc.) — beaucoup d'offres, mais à filtrer ;",
      '- les **agences immobilières** françaises [(sérieuses, mais frais de dossier et dossier lourd)](https://www.anil.org/) ;',
      '- les **opérateurs de coliving**, [qui gèrent tout de A à Z](/blog/coliving-colocation-ou-studio-geneve-comparatif) (chambre meublée, charges, communauté).',
      '',
      '## Comment éviter les arnaques ?',
    ].join('\n'),
    replace: () => '## Comment éviter les arnaques ?',
  },
  {
    slug: 'trouver-colocation-geneve-frontalier', lang: 'en', mechanism: 'M1',
    note: 'removal of the “Where to actually look?” section (title + lead + 4 bullets); the <OuChercher/> block is inserted by code before “## How to avoid scams?”',
    find: [
      '## Where to actually look?',
      '',
      'Several options, each with pros and cons:',
      '- **cross-border Facebook groups** (very active, but first come first served);',
      '- listings sites (leboncoin, etc.) — many offers, but filter carefully;',
      '- French **real estate agencies** [(serious, but application fees and heavy files)](https://www.anil.org/);',
      '- **coliving operators**, [who handle everything end to end](/en/blog/coliving-colocation-ou-studio-geneve-comparatif) (furnished room, utilities, community).',
      '',
      '## How to avoid scams?',
    ].join('\n'),
    replace: () => '## How to avoid scams?',
  },
  {
    slug: 'trouver-colocation-geneve-frontalier', lang: 'fr', mechanism: 'M4',
    note: '§ « Quel dossier… » : la phrase « Bonne nouvelle : en coliving, le dossier est simplifié… » devient la réponse A.6',
    find: "Bonne nouvelle : en coliving, le dossier est simplifié — contrat de travail ou promesse d'embauche, garant seulement au cas par cas.",
    replace: (m) => m.a6Text('fr'),
  },
  {
    slug: 'trouver-colocation-geneve-frontalier', lang: 'en', mechanism: 'M4',
    note: '§ “What application…”: the absolute promise “no French guarantor required” becomes the A.6 answer',
    find: 'Good news: in coliving, the application is simplified — **[no French guarantor required](https://www.service-public.gouv.fr/particuliers/vosdroits/F34661?lang=en)**.',
    replace: (m) => m.a6Text('en'),
  },
  {
    slug: 'trouver-colocation-geneve-frontalier', lang: 'en', mechanism: 'fix',
    note: '“In short” bullet: second “no French guarantor” promise reworded (the file is your employment contract)',
    find: '- In coliving, **no French guarantor** and everything is included.',
    replace: () => '- In coliving, the file is your employment contract and everything is included.',
  },
  {
    slug: 'trouver-colocation-geneve-frontalier', lang: 'fr', mechanism: 'M1',
    note: 'puce « En résumé » : les quatre canaux du bloc « Où chercher », lien vers le comparatif conservé (la section retirée portait le seul lien)',
    find: '- Cherche sur les groupes frontaliers, les annonces, les agences ou les opérateurs de coliving.',
    replace: (m) => channelsBullet(m, 'fr'),
  },
  {
    slug: 'trouver-colocation-geneve-frontalier', lang: 'en', mechanism: 'M1',
    note: '“In short” bullet: the four channels of the “Where to look” block, link to the comparison article kept',
    find: '- Look on cross-border groups, listings, agencies or coliving operators.',
    replace: (m) => channelsBullet(m, 'en'),
  },
  {
    slug: 'trouver-colocation-geneve-frontalier', lang: 'fr', mechanism: 'fix',
    note: 'fourchette d\'une chambre entre particuliers alignée sur MARKET_ROOM_EUR (« 600 à 900 € » → 700 à 1 000 €)',
    find: 'de 600 à 900 € en location classique',
    replace: (m) => `de ${marketRangeText(m, 'fr')} en location classique`,
  },
  {
    slug: 'trouver-colocation-geneve-frontalier', lang: 'en', mechanism: 'fix',
    note: 'peer-to-peer room range aligned with MARKET_ROOM_EUR (“€600 to €900” → €700 to €1,000)',
    find: 'from €600 to €900 in a classic rental',
    replace: (m) => `from ${marketRangeText(m, 'en')} in a classic rental`,
  },

  // ═══ budget-colocation-geneve-guide-complet ═════════════════════════════════════════════════════
  {
    slug: 'budget-colocation-geneve-guide-complet', lang: 'fr', mechanism: 'M3',
    note: 'tableau du coût réel : ligne « Coliving premium tout inclus | 1 370 CHF » → libellé budgetRowLabel + fourchette priceRangeCell',
    find: `| Coliving premium tout inclus | — | — | 1${NB}370 CHF |`,
    replace: (m) => `| ${m.budgetRowLabel('fr')} | — | — | ${m.priceRangeCell('fr')} |`,
  },
  {
    slug: 'budget-colocation-geneve-guide-complet', lang: 'en', mechanism: 'M3',
    note: 'real-cost table: row “Premium coliving all-inclusive | 1,370 CHF” → budgetRowLabel + priceRangeCell',
    find: '| Premium coliving all-inclusive | — | — | 1,370 CHF |',
    replace: (m) => `| ${m.budgetRowLabel('en')} | — | — | ${m.priceRangeCell('en')} |`,
  },
  {
    slug: 'budget-colocation-geneve-guide-complet', lang: 'fr', mechanism: 'M3',
    note: 'fin du § « Le coût réel d\'un logement à Genève en 2026 » : ajout du paragraphe A.5 « variante budget »',
    find: "Et encore, ces chiffres ne prennent pas en compte les charges (80-150 CHF/mois à Genève), le dépôt de garantie (jusqu'à 3 mois en Suisse vs 2 mois hors charges en France), ni les frais d'agence.",
    replace: (m) => `Et encore, ces chiffres ne prennent pas en compte les charges (80-150 CHF/mois à Genève), le dépôt de garantie (jusqu'à 3 mois en Suisse vs 2 mois hors charges en France), ni les frais d'agence.\n\n${m.budgetVariantText('fr')}`,
  },
  {
    slug: 'budget-colocation-geneve-guide-complet', lang: 'en', mechanism: 'M3',
    note: 'end of “The Real Cost of Housing in Geneva in 2026”: A.5 “budget variant” paragraph appended',
    find: "**The gap is brutal.** A studio in central Geneva costs an average of 1,600 CHF/month — utilities extra. The same space on the French side? 800 €, or about 800 CHF. Do the math: **that's nearly 10,000 CHF saved per year**, just on rent.",
    replace: (m) => `**The gap is brutal.** A studio in central Geneva costs an average of 1,600 CHF/month — utilities extra. The same space on the French side? 800 €, or about 800 CHF. Do the math: **that's nearly 10,000 CHF saved per year**, just on rent.\n\n${m.budgetVariantText('en')}`,
  },
  {
    slug: 'budget-colocation-geneve-guide-complet', lang: 'fr', mechanism: 'fix',
    note: 'tableau « Prix réels par commune » : colonne Coliving de Ville-la-Grand (La Villa) = fourchette 1 370 – 1 430',
    find: `| **Ville-la-Grand** | 700 – 950 € | 900 – 1 200 € | 500 – 700 € | 1${NB}370 CHF |`,
    replace: (m) => `| **Ville-la-Grand** | 700 – 950 € | 900 – 1 200 € | 500 – 700 € | ${m.priceRangeCell('fr')} |`,
  },
  {
    slug: 'budget-colocation-geneve-guide-complet', lang: 'fr', mechanism: 'fix',
    note: 'tableau « Prix réels par commune » : colonne Coliving d\'Ambilly (Le Loft, 100 % privatif) = prix standard',
    find: `| **Ambilly** | 700 – 1 000 € | 900 – 1 250 € | 500 – 750 € | 1${NB}370 CHF |`,
    replace: (m) => `| **Ambilly** | 700 – 1 000 € | 900 – 1 250 € | 500 – 750 € | ${standardChfCell(m, 'fr')} |`,
  },
  {
    slug: 'budget-colocation-geneve-guide-complet', lang: 'fr', mechanism: 'fix',
    note: 'tableau « Prix réels par commune » : colonne Coliving d\'Annemasse gare (Le Lodge, 100 % privatif) = prix standard au lieu de « — » (plan L0 §1.1)',
    find: '| **Annemasse gare (Léman Express)** | 850 – 1 150 € | 1 000 – 1 350 € | 600 – 800 € | — |',
    replace: (m) => `| **Annemasse gare (Léman Express)** | 850 – 1 150 € | 1 000 – 1 350 € | 600 – 800 € | ${standardChfCell(m, 'fr')} |`,
  },
  {
    slug: 'budget-colocation-geneve-guide-complet', lang: 'en', mechanism: 'fix',
    note: '“Real Prices by Town” table: Coliving column for Ville-la-Grand (La Villa) = 1,370 – 1,430 range',
    find: '| **Ville-la-Grand** | 700–950 € | 900–1,200 € | 500–700 € | 1,370 CHF |',
    replace: (m) => `| **Ville-la-Grand** | 700–950 € | 900–1,200 € | 500–700 € | ${m.priceRangeCell('en')} |`,
  },
  {
    slug: 'budget-colocation-geneve-guide-complet', lang: 'en', mechanism: 'fix',
    note: '“Real Prices by Town” table: Coliving column for Ambilly (Le Loft, all private bathrooms) = standard price',
    find: '| **Ambilly** | 700–1,000 € | 900–1,250 € | 500–750 € | 1,370 CHF |',
    replace: (m) => `| **Ambilly** | 700–1,000 € | 900–1,250 € | 500–750 € | ${standardChfCell(m, 'en')} |`,
  },
  {
    slug: 'budget-colocation-geneve-guide-complet', lang: 'en', mechanism: 'fix',
    note: '“Real Prices by Town” table: Coliving column for Annemasse station (Le Lodge) = standard price instead of “—”',
    find: '| **Annemasse station (Léman Express)** | 850–1,150 € | 1,000–1,350 € | 600–800 € | — |',
    replace: (m) => `| **Annemasse station (Léman Express)** | 850–1,150 € | 1,000–1,350 € | 600–800 € | ${standardChfCell(m, 'en')} |`,
  },
  {
    slug: 'budget-colocation-geneve-guide-complet', lang: 'fr', mechanism: 'M4',
    note: '§ « Se loger à moins de 1 500 CHF… » : réponse A.6 (question en gras, sans titre) insérée après la liste des 3 options — le point de coupe du bloc entité (dernier titre des 40 % finaux) ne bouge pas',
    find: "\n\nLe bon réflexe n'est pas de comparer les loyers nus",
    replace: (m) => `\n\n${a6Bold(m, 'fr')}\n\nLe bon réflexe n'est pas de comparer les loyers nus`,
  },
  {
    slug: 'budget-colocation-geneve-guide-complet', lang: 'en', mechanism: 'M4',
    note: '“Living under CHF 1,500…”: A.6 answer (bold question, no heading) inserted after the 3-option list',
    find: '\n\nThe right reflex is not to compare bare rents',
    replace: (m) => `\n\n${a6Bold(m, 'en')}\n\nThe right reflex is not to compare bare rents`,
  },
  {
    slug: 'budget-colocation-geneve-guide-complet', lang: 'fr', mechanism: 'fix',
    note: 'conseil n° 5 : conversion périmée « 1 490 à 1 540 € » → loyers contractuels en euros (fromEur / standardEur), phrase rendue grammaticale',
    find: `un loyer de 1${NB}370 CHF équivaut à de 1${NB}490 à 1${NB}540${NB}€ : c'est le loyer contractuel, libellé en euros`,
    replace: (m) => `un loyer de ${m.priceRangeText('fr')} correspond à un loyer contractuel de ${eurRangeText(m, 'fr')}, libellé en euros`,
  },
  {
    slug: 'budget-colocation-geneve-guide-complet', lang: 'en', mechanism: 'fix',
    note: 'tip 5: outdated conversion “1,480-1,530 € depending on the current rate” → contractual rents in euros (fromEur / standardEur)',
    find: 'a 1,370 CHF rent is worth roughly 1,480-1,530 € depending on the current rate',
    replace: (m) => `a ${m.priceRangeText('en')} rent corresponds to a contractual rent of ${eurRangeText(m, 'en')}, set in euros`,
  },
  {
    slug: 'budget-colocation-geneve-guide-complet', lang: 'fr', mechanism: 'fix',
    note: 'tutoiement : « Faites le calcul » → « Fais le calcul »',
    find: 'Faites le calcul :',
    replace: () => 'Fais le calcul :',
  },

  // ═══ living-in-france-working-in-geneva ═════════════════════════════════════════════════════════
  {
    slug: 'living-in-france-working-in-geneva', lang: 'fr', mechanism: 'M4',
    note: '§ « Pas d\'administration lourde » : première phrase → réponse A.6 ; « Le coliving sait que les frontaliers bougent… » conservée',
    find: "Pas de garantie bancaire farfelue, pas de 10 justificatifs de revenu : un contrat de travail ou une promesse d'embauche suffit, un garant seulement au cas par cas.",
    replace: (m) => m.a6Text('fr'),
  },
  {
    slug: 'living-in-france-working-in-geneva', lang: 'en', mechanism: 'M4',
    note: '“No heavy administration”: first sentence (“no French guarantor if you\'re foreign”) → A.6 answer; “Coliving knows cross-border workers move…” kept',
    find: "No outrageous bank guarantees, no French guarantor if you're foreign, no 10 income proofs.",
    replace: (m) => m.a6Text('en'),
  },
  {
    // Somme d'exemple du marché (1 200 + 100 + 30 + 40 + 10), arrondie : pas un fait La Villa — on évite d'afficher l'ancien prix « 1 380 ».
    slug: 'living-in-france-working-in-geneva', lang: 'fr', mechanism: 'fix',
    note: 'exemple de location traditionnelle : « = 1 380 EUR » (ancien prix La Villa) → « ≈ 1 400 EUR »',
    find: `= 1${NB}380 EUR.`,
    replace: () => `≈ 1${NB}400 EUR.`,
  },
  {
    slug: 'living-in-france-working-in-geneva', lang: 'en', mechanism: 'fix',
    note: 'traditional rental example: “= €1,380” (old La Villa price) → “≈ €1,400”',
    find: '= €1,380.',
    replace: () => '≈ €1,400.',
  },
  {
    slug: 'living-in-france-working-in-geneva', lang: 'fr', mechanism: 'fix',
    note: 'retrait du chiffre « 50+ personnes qui arrivent chaque année » (non sourcé)',
    find: "Voici ce qu'on recommande aux 50+ personnes qui arrivent chaque année chez nous.",
    replace: () => "Voici ce qu'on recommande aux nouveaux résidents qui arrivent chaque année chez nous.",
  },
  {
    slug: 'living-in-france-working-in-geneva', lang: 'en', mechanism: 'fix',
    note: 'removal of the unsourced “50+ people arriving annually” figure',
    find: "Here's our advice for the 50+ people arriving annually.",
    replace: () => "Here's our advice for the new residents who arrive every year.",
  },

  // ═══ ou-habiter-frontalier-suisse-villes-france-pas-cher ════════════════════════════════════════
  {
    slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'fr', mechanism: 'M2',
    note: 'fiche Ville-la-Grand : « C\'est ici qu\'on a installé La Villa Coliving — pour de bonnes raisons. » → phrase de commune (La Villa)',
    find: "C'est ici qu'on a installé La Villa Coliving — pour de bonnes raisons.",
    replace: (m) => m.communeSentence('lavilla', 'fr'),
  },
  {
    slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'en', mechanism: 'M2',
    note: 'Ville-la-Grand card: “This is where we built La Villa Coliving — for good reasons.” → commune sentence (La Villa)',
    find: 'This is where we built La Villa Coliving — for good reasons.',
    replace: (m) => m.communeSentence('lavilla', 'en'),
  },
  {
    slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'fr', mechanism: 'M2',
    note: 'fiche Annemasse : phrase de commune (Le Lodge) insérée avant « Pour qui ? »',
    find: 'Le revers : les prix grimpent vite et le centre est bondé aux heures de pointe.',
    replace: (m) => `Le revers : les prix grimpent vite et le centre est bondé aux heures de pointe.\n\n${m.communeSentence('lelodge', 'fr')}`,
  },
  {
    slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'en', mechanism: 'M2',
    note: 'Annemasse card: commune sentence (Le Lodge) inserted before “For whom?”',
    find: 'Downside: prices climb fast and the center is packed at peak hours.',
    replace: (m) => `Downside: prices climb fast and the center is packed at peak hours.\n\n${m.communeSentence('lelodge', 'en')}`,
  },
  {
    slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'fr', mechanism: 'M2',
    note: 'fiche Ambilly : phrase de commune (Le Loft) ajoutée',
    find: 'Position centrale, juste entre Annemasse et la frontière suisse.',
    replace: (m) => `Position centrale, juste entre Annemasse et la frontière suisse.\n\n${m.communeSentence('leloft', 'fr')}`,
  },
  {
    slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'en', mechanism: 'M2',
    note: 'Ambilly card: commune sentence (Le Loft) appended',
    find: 'Central location, right between Annemasse and the Swiss border.',
    replace: (m) => `Central location, right between Annemasse and the Swiss border.\n\n${m.communeSentence('leloft', 'en')}`,
  },
  {
    slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'fr', mechanism: 'fix',
    note: 'puce « En résumé » : « Sans bail, tout inclus » (faux : bail de 12 mois) → « Tout inclus, sans frais de dossier », les 3 communes',
    find: '- **Sans bail, tout inclus** : coliving à Ville-la-Grand',
    replace: (m) => `- **Tout inclus, sans frais de dossier** : le coliving de La Villa Coliving à ${communesText(m, 'fr')}`,
  },
  {
    slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'en', mechanism: 'fix',
    note: '“TL;DR” bullet: “No lease, all-inclusive” (wrong: 12-month lease) → “All inclusive, no application fee”, the 3 towns',
    find: '- **No lease, all-inclusive**: coliving in Ville-la-Grand',
    replace: (m) => `- **All inclusive, no application fee**: coliving with La Villa Coliving in ${communesText(m, 'en')}`,
  },
  {
    slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'fr', mechanism: 'fix',
    note: 'fiche Ville-la-Grand : « à 15 minutes du bureau » (minute non qualifiée, « 15 » n\'existe plus) → « près de Genève »',
    find: 'frontaliers qui veulent du calme à 15 minutes du bureau.',
    replace: () => 'frontaliers qui veulent du calme près de Genève.',
  },
  {
    slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'en', mechanism: 'fix',
    note: 'Ville-la-Grand card: “15 minutes from the office” (unqualified minute) → “near Geneva”',
    find: 'cross-border workers who want quiet 15 minutes from the office.',
    replace: () => 'cross-border workers who want quiet near Geneva.',
  },

  // ═══ cout-de-la-vie-suisse-france-frontalier-2026 ═══════════════════════════════════════════════
  {
    slug: 'cout-de-la-vie-suisse-france-frontalier-2026', lang: 'fr', mechanism: 'M3',
    note: 'budget mensuel : ligne « − Logement (T2 ou coliving tout inclus) » → libellé coutDeLaVieRowLabel, borne haute = prix standard (U+2212 conservé)',
    find: `| ${MINUS} Logement (T2 ou coliving tout inclus) | ${MINUS}1 100 à ${MINUS}1 400 CHF |`,
    replace: (m) => `| ${m.coutDeLaVieRowLabel('fr')} | ${MINUS}1 100 à ${MINUS}${thousands(m.ENTITY_FACTS.price.standardChf, ' ')} CHF |`,
  },
  {
    slug: 'cout-de-la-vie-suisse-france-frontalier-2026', lang: 'en', mechanism: 'M3',
    note: 'monthly budget: row “− Housing (2-room or all-inclusive coliving)” → coutDeLaVieRowLabel, upper bound = standard price (U+2212 kept)',
    find: `| ${MINUS} Housing (2-room or all-inclusive coliving) | ${MINUS}1,100 to ${MINUS}1,400 CHF |`,
    replace: (m) => `| ${m.coutDeLaVieRowLabel('en')} | ${MINUS}1,100 to ${MINUS}${thousands(m.ENTITY_FACTS.price.standardChf, ',')} CHF |`,
  },
  // (le pied EN de cout-de-la-vie — ancre cassée + URL FR — est traité par la passe « têtes de pied EN » ci-dessous)

  // ═══ demenager-geneve-frontalier-checklist ══════════════════════════════════════════════════════
  {
    slug: 'demenager-geneve-frontalier-checklist', lang: 'fr', mechanism: 'M4',
    note: 'Phase 1 « Garant » : « tu auras besoin d\'un garant » → « un bailleur te demandera souvent un garant » + réponse A.6 en paragraphe suivant',
    find: "**Garant** : Si tu n'as pas un CDI français connu, tu auras besoin d'un garant (parent, ami, quelqu'un avec un CDI et un appart). Prépare sa documentation aussi : CDI, bulletins, domicile.",
    replace: (m) => `**Garant** : Si tu n'as pas un CDI français connu, un bailleur te demandera souvent un garant (parent, ami, quelqu'un avec un CDI et un appart) : prépare sa documentation aussi (CDI, bulletins, domicile).\n\n${m.a6Text('fr')}`,
  },
  {
    slug: 'demenager-geneve-frontalier-checklist', lang: 'en', mechanism: 'M4',
    note: 'Phase 1 “Guarantor”: “you\'ll need a guarantor” → “a landlord will often ask for a guarantor” + A.6 answer as the next paragraph',
    find: "**Guarantor**: If you don't have a known French permanent job, you'll need a guarantor (parent, friend, someone with permanent employment and an apartment). Prepare their documents too.",
    replace: (m) => `**Guarantor**: If you don't have a known French permanent job, a landlord will often ask for a guarantor (parent, friend, someone with permanent employment and an apartment): prepare their documents too.\n\n${m.a6Text('en')}`,
  },
  {
    slug: 'demenager-geneve-frontalier-checklist', lang: 'fr', mechanism: 'fix',
    note: 'puce « Adresse du garant + ses documents » → « …, si on t\'en demande un »',
    find: '- Adresse du garant + ses documents',
    replace: () => "- Adresse du garant + ses documents, si on t'en demande un",
  },
  {
    slug: 'demenager-geneve-frontalier-checklist', lang: 'en', mechanism: 'fix',
    note: 'bullet “Guarantor address + documents” → “…, if one is asked of you”',
    find: '- Guarantor address + documents',
    replace: () => '- Guarantor address + documents, if one is asked of you',
  },

  // ═══ quartiers-annemasse-ou-vivre-selon-profil ══════════════════════════════════════════════════
  {
    slug: 'quartiers-annemasse-ou-vivre-selon-profil', lang: 'fr', mechanism: 'M2',
    note: 'Profil 1 : « en moins de 10 minutes » → « en une dizaine de minutes » ; « C\'est précisément là qu\'est posé notre [Lodge…](/lelodge). » → phrase de commune (Le Lodge, lien conservé)',
    find: "Tu marches à la gare en moins de 10 minutes, tu oublies la voiture et les bouchons de la douane. C'est précisément là qu'est posé notre [Lodge, à Romagny — à 9 minutes à pied de la gare](/lelodge).",
    replace: (m) => `Tu marches à la gare en une dizaine de minutes, tu oublies la voiture et les bouchons de la douane. ${lodgeSentenceLinked(m, 'fr')}`,
  },
  {
    slug: 'quartiers-annemasse-ou-vivre-selon-profil', lang: 'en', mechanism: 'M2',
    note: 'Profile 1: “in under 10 minutes” → “in about ten minutes”; “That\'s exactly where our [Lodge…](/en/lelodge), sits.” → commune sentence (Le Lodge, link kept)',
    find: "You walk to the station in under 10 minutes, forget the car and the customs jams. That's exactly where our [Lodge, in Romagny — 9 minutes' walk from the station](/en/lelodge), sits.",
    replace: (m) => `You walk to the station in about ten minutes, forget the car and the customs jams. ${lodgeSentenceLinked(m, 'en')}`,
  },
  {
    slug: 'quartiers-annemasse-ou-vivre-selon-profil', lang: 'fr', mechanism: 'M2',
    note: 'FAQ « Quel quartier d\'Annemasse est le plus proche de la gare ? » : « en moins de 10 minutes » → « en une dizaine de minutes » + phrase de commune (Le Lodge) en fin de réponse',
    find: 'on rejoint la gare du Léman Express à pied en moins de 10 minutes. Idéal pour un frontalier qui veut vivre sans voiture.',
    replace: (m) => `on rejoint la gare du Léman Express à pied en une dizaine de minutes. Idéal pour un frontalier qui veut vivre sans voiture. ${m.communeSentence('lelodge', 'fr')}`,
  },
  {
    slug: 'quartiers-annemasse-ou-vivre-selon-profil', lang: 'en', mechanism: 'M2',
    note: 'FAQ “Which Annemasse area is closest to the station?”: “under 10 minutes\' walk” → “about ten minutes\' walk” + commune sentence (Le Lodge) at the end of the answer',
    find: "the Léman Express station is under 10 minutes' walk. Ideal for a car-free commuter.",
    replace: (m) => `the Léman Express station is about ten minutes' walk. Ideal for a car-free commuter. ${m.communeSentence('lelodge', 'en')}`,
  },

  // ═══ colocation-annemasse-ville-la-grand-ambilly ════════════════════════════════════════════════
  {
    slug: 'colocation-annemasse-ville-la-grand-ambilly', lang: 'fr', mechanism: 'M1',
    note: 'retrait du H2 « Où chercher : les bons sites » et de ses 4 paragraphes ; le bloc <OuChercher/> est inséré par le code devant « ## Les bonnes zones »',
    find: [
      '## Où chercher : les bons sites',
      '',
      '**Leboncoin** : C\'est le classique français. Beaucoup d\'annonces, mais aussi beaucoup de pollution (arnaqueurs, arnaques). Filtre par localisation (Annemasse, Ville-la-Grand), par prix (900-1300 CHF), par "meublé". Vérifie toujours le numéro de téléphone : si c\'est un numéro fictif ou bizarre, c\'est une arnaque.',
      '',
      '**Airbnb (long-term)** : Oui, sérieusement. Les propriétaires sur Airbnb sont généralement moins arnaqueurs (système d\'avis). Les prix sont un peu plus hauts (10-15%), mais c\'est plus sûr pour le premier mois. Cherche "monthly stays" à moins de 1300 EUR.',
      '',
      '**Anibis** : Suisse/France frontière. Moins connu mais sérieux. Annonces souvent de quality supérieure.',
      '',
      '**Facebook groupes** : Il y a environ 15-20 groupes "Cherche colocataire Genève/Annemasse/Ville-la-Grand". Demande adhésion, puis poste "Je cherche chambre...". Réponses en 24-48h souvent. C\'est très local, très actif, pas mal honnête.',
      '',
      '## Les bonnes zones',
    ].join('\n'),
    replace: () => '## Les bonnes zones',
  },
  {
    slug: 'colocation-annemasse-ville-la-grand-ambilly', lang: 'en', mechanism: 'M1',
    note: 'removal of the H2 “Where to Search: Best Sites” and its 5 paragraphs; the <OuChercher/> block is inserted by code before “## Best Zones”',
    find: [
      '## Where to Search: Best Sites',
      '',
      '**Leboncoin**: France\'s largest classified-ads website, where locals sell everything from sofas to cars and where most private landlords advertise their rooms. You\'ll find the most listings there, but also the most scams. Search by town (Annemasse, Ville-la-Grand), set your budget and tick "meublé" (furnished). Always check the phone number: if it looks fake or odd, walk away.',
      '',
      '**Airbnb (long-term)**: Seriously. Airbnb landlords are usually less crooked (review system). Prices ~10-15% higher, but safer first month. Search "monthly stays" under 1300 EUR.',
      '',
      '**Flatshare platforms**: specialised in shared housing. Less noise than Leboncoin. Bonus: landlord and roommate ratings.',
      '',
      '**Anibis**: Swiss/French border. Less known but serious. Often higher quality listings.',
      '',
      '**Facebook groups**: ~15-20 groups "Looking for roommate Geneva/Annemasse/Ville-la-Grand." Request membership, post "Looking for room..." Responses in 24-48h often. Very local, active, fairly honest.',
      '',
      '## Best Zones',
    ].join('\n'),
    replace: () => '## Best Zones',
  },
  {
    slug: 'colocation-annemasse-ville-la-grand-ambilly', lang: 'fr', mechanism: 'M2',
    note: '« Les bonnes zones » / Annemasse centre (près de la gare) : phrase de commune (Le Lodge, Romagny est au sud-est de la gare) ajoutée',
    find: '**Annemasse centre (près de la gare)** : Prix : 1000-1400 CHF. Vibrant, commerces, bars. Transports au top. Malus : plus cher, plus bruyant.',
    replace: (m) => `**Annemasse centre (près de la gare)** : Prix : 1000-1400 CHF. Vibrant, commerces, bars. Transports au top. Malus : plus cher, plus bruyant. ${m.communeSentence('lelodge', 'fr')}`,
  },
  {
    slug: 'colocation-annemasse-ville-la-grand-ambilly', lang: 'en', mechanism: 'M2',
    note: '“Best Zones” / Annemasse center (near station): commune sentence (Le Lodge) appended',
    find: '**Annemasse center (near station)**: Price: 1000-1400 CHF. Vibrant, shops, bars. Transport top-notch. Downside: pricier, louder.',
    replace: (m) => `**Annemasse center (near station)**: Price: 1000-1400 CHF. Vibrant, shops, bars. Transport top-notch. Downside: pricier, louder. ${m.communeSentence('lelodge', 'en')}`,
  },
  {
    slug: 'colocation-annemasse-ville-la-grand-ambilly', lang: 'fr', mechanism: 'M2',
    note: '« Les bonnes zones » / Ville-la-Grand : « Toujours 10 min à pied de la gare » (faux : 14 min) → phrase de commune (La Villa)',
    find: "Toujours 10 min à pied de la gare, plus d'espaces verts et plus familial.",
    replace: (m) => `Plus d'espaces verts et plus familial. ${m.communeSentence('lavilla', 'fr')}`,
  },
  {
    slug: 'colocation-annemasse-ville-la-grand-ambilly', lang: 'en', mechanism: 'M2',
    note: '“Best Zones” / Ville-la-Grand: “Also 10 min on foot from the station” (wrong: 14 min) → commune sentence (La Villa)',
    find: 'Also 10 min on foot from the station, more green space and more family-friendly.',
    replace: (m) => `More green space and more family-friendly. ${m.communeSentence('lavilla', 'en')}`,
  },
  {
    slug: 'colocation-annemasse-ville-la-grand-ambilly', lang: 'fr', mechanism: 'M2',
    note: '« Les bonnes zones » / Ambilly : phrase de commune (Le Loft) ajoutée',
    find: '**Ambilly** : Prix : 850-1150 CHF. Très résidentiel et assez haut de gamme en fonction des quartiers.',
    replace: (m) => `**Ambilly** : Prix : 850-1150 CHF. Très résidentiel et assez haut de gamme en fonction des quartiers. ${m.communeSentence('leloft', 'fr')}`,
  },
  {
    slug: 'colocation-annemasse-ville-la-grand-ambilly', lang: 'en', mechanism: 'M2',
    note: '“Best Zones” / Ambilly: commune sentence (Le Loft) appended',
    find: '**Ambilly**: Price: 850-1150 CHF. Very residential and fairly upscale depending on the neighbourhood.',
    replace: (m) => `**Ambilly**: Price: 850-1150 CHF. Very residential and fairly upscale depending on the neighbourhood. ${m.communeSentence('leloft', 'en')}`,
  },
  {
    slug: 'colocation-annemasse-ville-la-grand-ambilly', lang: 'fr', mechanism: 'M3',
    note: 'tableau « Le vrai prix d\'une chambre meublée » : « 1 370 CHF/mois » → fourchette priceRangeCell + « /mois »',
    find: `| Coliving premium tout compris | 1${NB}370 CHF/mois |`,
    replace: (m) => `| Coliving premium tout compris | ${m.priceRangeCell('fr')}/mois |`,
  },
  {
    slug: 'colocation-annemasse-ville-la-grand-ambilly', lang: 'en', mechanism: 'M3',
    note: '“Real Prices for a Furnished Room” table: “1,370 CHF/month” → priceRangeCell + “/month”',
    find: '| All-inclusive premium coliving | 1,370 CHF/month |',
    replace: (m) => `| All-inclusive premium coliving | ${m.priceRangeCell('en')}/month |`,
  },

  // ═══ dossier-location-frontalier-suisse-france ══════════════════════════════════════════════════
  {
    slug: 'dossier-location-frontalier-suisse-france', lang: 'fr', mechanism: 'M4',
    note: '§ 7 Garant : « tu auras besoin d\'un garant » → « la plupart des bailleurs te demanderont un garant » (lien ANIL conservé), « Deux options » → « Les options »',
    find: "[tu auras besoin d'un garant](https://www.anil.org/parole-expert-logement-location-pas-garant/). Deux options :",
    replace: () => '[la plupart des bailleurs te demanderont un garant](https://www.anil.org/parole-expert-logement-location-pas-garant/). Les options :',
  },
  {
    slug: 'dossier-location-frontalier-suisse-france', lang: 'en', mechanism: 'M4',
    note: '§ 7 Guarantor: “you\'ll need a guarantor” → “most landlords will ask for a guarantor” (ANIL link kept), “Two options” → “The options”',
    find: "[you'll need a guarantor](https://www.anil.org/parole-expert-logement-location-pas-garant/). Two options:",
    replace: () => '[most landlords will ask for a guarantor](https://www.anil.org/parole-expert-logement-location-pas-garant/). The options:',
  },
  {
    slug: 'dossier-location-frontalier-suisse-france', lang: 'fr', mechanism: 'M4',
    note: '§ 7 Garant : 4e option « **Le coliving** : » + réponse A.6, après Garantme / Cautioneo',
    find: "**Garantme ou Cautioneo** : des services payants (3-4 % du loyer annuel) qui se portent garants pour toi. Particulièrement utile si tu n'as pas de garant en France.",
    replace: (m) => `**Garantme ou Cautioneo** : des services payants (3-4 % du loyer annuel) qui se portent garants pour toi. Particulièrement utile si tu n'as pas de garant en France.\n\n**Le coliving** : ${m.a6Text('fr')}`,
  },
  {
    slug: 'dossier-location-frontalier-suisse-france', lang: 'en', mechanism: 'M4',
    note: '§ 7 Guarantor: 4th option “**Coliving**: ” + A.6 answer, after Garantme / Cautioneo',
    find: "**Garantme or Cautioneo**: paid services (3-4% of annual rent) that act as guarantors for you. Particularly useful if you don't have a guarantor in France.",
    replace: (m) => `**Garantme or Cautioneo**: paid services (3-4% of annual rent) that act as guarantors for you. Particularly useful if you don't have a guarantor in France.\n\n**Coliving**: ${m.a6Text('en')}`,
  },
  {
    slug: 'dossier-location-frontalier-suisse-france', lang: 'en', mechanism: 'fix',
    note: 'footer 👉: “accepts cross-border workers with no French guarantor” → “on the basis of their employment contract” (FR parity)',
    find: 'accepts cross-border workers with no French guarantor — furnished all-inclusive rooms',
    replace: () => 'accepts cross-border workers on the basis of their employment contract — furnished all-inclusive rooms',
  },
  {
    slug: 'dossier-location-frontalier-suisse-france', lang: 'fr', mechanism: 'fix',
    note: 'H2 « L\'alternative coliving : zéro dossier, zéro galère » (faux : il y a un dossier) → « un dossier en trois pièces »',
    find: "## L'alternative coliving : zéro dossier, zéro galère",
    replace: () => "## L'alternative coliving : un dossier en trois pièces",
  },
  {
    slug: 'dossier-location-frontalier-suisse-france', lang: 'en', mechanism: 'fix',
    note: 'H2 “The Coliving Alternative: Zero Hassle” → “A Three-Document File” (FR parity)',
    find: '## The Coliving Alternative: Zero Hassle',
    replace: () => '## The Coliving Alternative: A Three-Document File',
  },

  // ═══ coliving-transfrontalier-geneve-annemasse-nouvelle-vie (ajout coordinateur, garde check:slots) ═════════════
  {
    // Le FR (« Pas de contrats d'électricité et d'internet à ouvrir, pas de meubles… ») ne mentionne déjà plus le garant :
    // l'EN est aligné sur lui (parité) — aucune promesse n'est reformulée, la proposition est retirée.
    slug: 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie', lang: 'en', mechanism: 'M4',
    note: '“Paperwork”: “No French guarantor to find, …” → clause removed, sentence aligned with the FR (which has no guarantor clause)',
    find: 'No French guarantor to find, no electricity and internet contracts to open, no furniture to buy then resell when you leave.',
    replace: () => 'No electricity and internet contracts to open, no furniture to buy then resell when you leave.',
  },

  // ═══ guide-ressources-frontalier-geneve (ajout coordinateur, garde check:slots) ═════════════════════════════════
  {
    // Le paragraphe parle de Visale (garantie d'État), pas de La Villa : on sort du motif « no French guarantor » sans changer le sens.
    // FR « Pas de garant français ? La garantie Visale… » inchangé (hors motif proscrit).
    slug: 'guide-ressources-frontalier-geneve', lang: 'en', mechanism: 'M4',
    note: '“Housing” / Visale paragraph: “No French guarantor? The Visale guarantee…” → “No guarantor in France? …” (same meaning, forbidden pattern removed; FR unchanged)',
    find: 'No French guarantor? The **[Visale](https://www.visale.fr)** guarantee',
    replace: () => 'No guarantor in France? The **[Visale](https://www.visale.fr)** guarantee',
  },

  // ═══ pieds EN hors des 25, porteurs du même motif (GO coordinateur) : les 3 liens FR de la phrase de pied passent en /en/ ═══
  {
    slug: 'coliving-annemasse-geneve-frontaliers-avantages', lang: 'en', mechanism: 'fix',
    note: 'EN footer 👉: links to the FR URLs /colocation-geneve and /annemasse-colocation → /en/…',
    find: '**Looking for [La Villa Coliving, French side](/colocation-geneve) or [in Annemasse](/annemasse-colocation)?**',
    replace: () => '**Looking for [La Villa Coliving, French side](/en/colocation-geneve) or [in Annemasse](/en/annemasse-colocation)?**',
  },
  {
    slug: 'coliving-annemasse-geneve-frontaliers-avantages', lang: 'en', mechanism: 'fix',
    note: 'EN footer 👉: third link of the same sentence, FR URL /chambre-a-louer-annemasse → /en/…',
    find: 'see also our [rooms for rent in Annemasse](/chambre-a-louer-annemasse). No application fee.',
    replace: () => 'see also our [rooms for rent in Annemasse](/en/chambre-a-louer-annemasse). No application fee.',
  },
  {
    slug: 'colocation-annemasse-ville-la-grand-ambilly', lang: 'en', mechanism: 'fix',
    note: 'EN footer 👉: broken anchor “Looking for [see our rooms on the French side]” → “a room on the French side”, FR URLs /colocation-geneve and /annemasse-colocation → /en/…',
    find: '**Looking for [see our rooms on the French side](/colocation-geneve) or [in Annemasse](/annemasse-colocation)?**',
    replace: () => '**Looking for [a room on the French side](/en/colocation-geneve) or [in Annemasse](/en/annemasse-colocation)?**',
  },
  {
    slug: 'colocation-annemasse-ville-la-grand-ambilly', lang: 'en', mechanism: 'fix',
    note: 'EN footer 👉: third link of the same sentence, FR URL /chambre-a-louer-annemasse → /en/…',
    find: 'see also our [rooms for rent in Annemasse](/chambre-a-louer-annemasse). No application fee.',
    replace: () => 'see also our [rooms for rent in Annemasse](/en/chambre-a-louer-annemasse). No application fee.',
  },

  // ═══ têtes des 25 pieds EN : URL /en/ + ancre cassée (GO coordinateur) ══════════════════════════
  ...FOOTER_SLUGS.map((slug) => {
    const head = FOOTER_EN_HEAD[FOOTER_EN_HEAD_BY_SLUG[slug]];
    if (!head) throw new Error(`FOOTER_EN_HEAD_BY_SLUG : tête de pied EN inconnue pour ${slug}`);
    return { slug, lang: 'en', mechanism: 'fix', note: head.note, find: head.find, replace: () => head.replace };
  }),

  // ═══ pied commun des 25 articles (formule D1) ═══════════════════════════════════════════════════
  ...FOOTER_SLUGS.flatMap((slug) => [
    {
      slug, lang: 'fr', mechanism: 'footer',
      note: 'pied commun : « à 20 minutes de Genève en Léman Express ou tram » → formule de trajet D1 (GENEVA_COMMUTE_FORMULA)',
      find: FOOTER_FIND.fr,
      replace: (m) => `sans frais de dossier. ${m.GENEVA_COMMUTE_FORMULA.fr}.`,
    },
    {
      slug, lang: 'en', mechanism: 'footer',
      note: 'common footer: “15-20 minutes from Geneva by Léman Express or tram” → D1 commute formula (GENEVA_COMMUTE_FORMULA)',
      find: FOOTER_FIND.en,
      replace: (m) => `no application fee. ${m.GENEVA_COMMUTE_FORMULA.en}.`,
    },
  ]),
];

/** Garde-fous sur `m` avant de dériver quoi que ce soit : la graphie locale doit être celle de la source. */
function assertSource(m) {
  const P = m.ENTITY_FACTS.price;
  const cellFr = `${thousands(P.fromChf, NB)} – ${thousands(P.standardChf, NB)} CHF`;
  const cellEn = `${thousands(P.fromChf, ',')} – ${thousands(P.standardChf, ',')} CHF`;
  if (cellFr !== m.priceRangeCell('fr') || cellEn !== m.priceRangeCell('en')) throw new Error('l1-slots.edits : thousands() local ≠ graphie de priceRangeCell() — réaligner sur stats.ts');
  if (!m.GENEVA_COMMUTE_FORMULA?.fr || !m.GENEVA_COMMUTE_FORMULA?.en) throw new Error('l1-slots.edits : GENEVA_COMMUTE_FORMULA absente de la source');
  if (/[.!?]$/.test(m.GENEVA_COMMUTE_FORMULA.fr) || /[.!?]$/.test(m.GENEVA_COMMUTE_FORMULA.en)) throw new Error('l1-slots.edits : GENEVA_COMMUTE_FORMULA se termine par une ponctuation (le pied ajoute le point)');
}

/** La liste résolue : `replace` devient la chaîne calculée depuis la source unique `m`. */
export function buildEdits(m) {
  assertSource(m);
  return EDITS.map((e, i) => {
    const replace = e.replace(m);
    if (typeof e.find !== 'string' || !e.find) throw new Error(`edit #${i + 1} (${e.slug}/${e.lang}) : find vide`);
    if (typeof replace !== 'string' || !replace) throw new Error(`edit #${i + 1} (${e.slug}/${e.lang}) : replace vide (une suppression doit garder un contexte, position('') vaut 1)`);
    if (replace === e.find) throw new Error(`edit #${i + 1} (${e.slug}/${e.lang}) : replace identique à find`);
    return { slug: e.slug, lang: e.lang, mechanism: e.mechanism, note: e.note, find: e.find, replace };
  });
}
