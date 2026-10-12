/**
 * Lot « correctifs de faits du blog » (préparé le 08/10/2026, GO de Jérôme le 12/10/2026) — liste DÉCLARATIVE rejouée sur l'état
 * courant de la base : les 70 paires find/replace du SQL du 08/10 (scripts/correctifs-faits-blog-2026-10-08.sql, branche
 * content/correctifs-faits-blog, jamais appliqué) ont été reclassées contre la base vivante le 12/10 : 36 applicables (ici),
 * 4 à occurrences multiples + 7 metas vides (scripts/correctifs-faits-blog-complement-2026-10-12.sql : replace() global gardé par comptage, metas gardées « vide »),
 * 25 caduques (pied EN « 15-20 minutes from Geneva » déjà réécrit par L2), 5 caduques (puce « Sans bail » et filtre Leboncoin
 * réécrits par L1, « 15-20 minutes » de budget-colocation réécrit par L2). Consommée par scripts/build-slots-sql.mjs :
 *
 *   node scripts/build-slots-sql.mjs --edits ./correctifs-faits-blog.edits.mjs --name correctifs-faits-blog --date 2026-10-12 --write-diff
 *
 * Contenu : A ou-habiter (bail 12 mois / 1 mois de préavis, garant et caution hors « démarches évitées », « À lire aussi » lié,
 * h1 EN en double retiré) ; C fiscalite / assurance (« dès 1 370 CHF ») ; D fiscalite (2e « À lire aussi ») ; E salaire (règle des 40 %,
 * 3a, plafond 7 258 CHF) ; F colocation-annemasse (loyers côté France en €, seuil d'arnaque sans CHF) ; G 7 metas vides ;
 * H Lodge 1 430 CHF dans extrait/meta, coliving-transfrontalier « dès 1 370 CHF ». Espaces insécables conservées (U+00A0 dans les chaînes).
 */

export const POST_STATE_WATCH = [/15-20 min/i, /sans bail/i];

export function sqlDoc() {
  return {
    lot: 'Correctifs de faits du blog (lot du 08/10/2026, GO Jérôme 12/10/2026) : 36 substitutions sur 13 articles, 5 colonnes de metas/extraits.',
    sources: 'paires reprises du SQL du 08/10 (scripts/correctifs-faits-blog-2026-10-08.sql), reclassées contre la base le 12/10 ; aucune donnée nouvelle',
    apply: 'Indépendant du code (textes d\'articles seulement) ; republication par le bot au prochain push ou cron.',
    encoding: 'Fichier UTF-8 avec insécables U+00A0 — ne pas normaliser.',
    dryRunTitle: 'Correctifs de faits du blog — aperçu des substitutions SQL (12/10/2026)',
    legend: 'Légende : « Avant » = texte en base au 12/10 ; « Après » = texte corrigé.',
    versions: {},
  };
}

const EDITS = [
  {
    "slug": "ou-habiter-frontalier-suisse-villes-france-pas-cher",
    "lang": "fr",
    "column": "content_fr",
    "mechanism": "FAITS",
    "note": "A1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "veulent **éviter les démarches** (dossier de location, garant, caution, ameublement, branchements)",
    "replace": "veulent **éviter les démarches** (ameublement, ouverture des compteurs, abonnement internet)"
  },
  {
    "slug": "ou-habiter-frontalier-suisse-villes-france-pas-cher",
    "lang": "fr",
    "column": "content_fr",
    "mechanism": "FAITS",
    "note": "A1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "tu arrives avec ta valise et tu pars quand tu veux : chambre meublée, charges, WiFi fibre, ménage, salle de sport, piscine — **tout est inclus**, dès 1 370 CHF/mois. Idéal pour",
    "replace": "tu arrives avec ta valise : chambre meublée, charges, WiFi fibre, ménage, salle de sport, piscine — **tout est inclus**, dès 1 370 CHF/mois. Bail de 12 mois : tu es libre de partir à tout moment avec 1 mois de préavis. Idéal pour"
  },
  {
    "slug": "ou-habiter-frontalier-suisse-villes-france-pas-cher",
    "lang": "fr",
    "column": "content_fr",
    "mechanism": "FAITS",
    "note": "A1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "*À lire aussi :*\n- Les meilleurs quartiers frontaliers de Genève\n",
    "replace": "*À lire aussi :*\n- [Vivre à Annemasse : quel quartier choisir selon ton profil ?](/blog/quartiers-annemasse-ou-vivre-selon-profil)\n"
  },
  {
    "slug": "ou-habiter-frontalier-suisse-villes-france-pas-cher",
    "lang": "en",
    "column": "content_en",
    "mechanism": "FAITS",
    "note": "A2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "# Where to live as a Geneva cross-border worker? The guide to 7 French towns\n\n",
    "replace": ""
  },
  {
    "slug": "ou-habiter-frontalier-suisse-villes-france-pas-cher",
    "lang": "en",
    "column": "content_en",
    "mechanism": "FAITS",
    "note": "A2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "want to **skip the paperwork** (rental file, guarantor, deposit, furnishing, utility hookups)",
    "replace": "want to **skip the paperwork** (furnishing, utility hookups, internet contract)"
  },
  {
    "slug": "ou-habiter-frontalier-suisse-villes-france-pas-cher",
    "lang": "en",
    "column": "content_en",
    "mechanism": "FAITS",
    "note": "A2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "you arrive with your suitcase and you leave when you want: furnished room, utilities, fiber WiFi, cleaning, gym, pool — **everything included**, from 1,370 CHF/month. Ideal for",
    "replace": "you arrive with your suitcase: furnished room, utilities, fiber WiFi, cleaning, gym, pool — **everything included**, from 1,370 CHF/month. 12-month lease: you're free to leave at any time with 1 month's notice. Ideal for"
  },
  {
    "slug": "ou-habiter-frontalier-suisse-villes-france-pas-cher",
    "lang": "en",
    "column": "content_en",
    "mechanism": "FAITS",
    "note": "A2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "*Also read:*\n- The best cross-border neighborhoods near Geneva\n",
    "replace": "*Also read:*\n- [Annemasse neighbourhoods: where to live 2026](/en/blog/quartiers-annemasse-ou-vivre-selon-profil)\n"
  },
  {
    "slug": "fiscalite-frontalier-geneve-impots-2026",
    "lang": "fr",
    "column": "content_fr",
    "mechanism": "FAITS",
    "note": "C1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "Avec un loyer coliving à 1 370 CHF, il te reste",
    "replace": "Avec une chambre en coliving dès 1 370 CHF, il te reste"
  },
  {
    "slug": "fiscalite-frontalier-geneve-impots-2026",
    "lang": "fr",
    "column": "content_fr",
    "mechanism": "FAITS",
    "note": "C1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "Le loyer du coliving à 1 370 CHF tout inclus est",
    "replace": "Le loyer du coliving, dès 1 370 CHF tout inclus, est"
  },
  {
    "slug": "fiscalite-frontalier-geneve-impots-2026",
    "lang": "fr",
    "column": "content_fr",
    "mechanism": "FAITS",
    "note": "C1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "- [Budget colocation près de Genève : le guide complet](/blog/budget-colocation-geneve-guide-complet)\n",
    "replace": "- [Salaire suisse net 2026 : guide frontalier](/blog/salaire-suisse-net-frontalier-2026)\n"
  },
  {
    "slug": "fiscalite-frontalier-geneve-impots-2026",
    "lang": "en",
    "column": "content_en",
    "mechanism": "FAITS",
    "note": "C2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "With coliving rent at 1,370 CHF, you have",
    "replace": "With a coliving room from 1,370 CHF, you have"
  },
  {
    "slug": "fiscalite-frontalier-geneve-impots-2026",
    "lang": "en",
    "column": "content_en",
    "mechanism": "FAITS",
    "note": "C2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "The all-inclusive coliving rent of 1,370 CHF is",
    "replace": "The all-inclusive coliving rent, from 1,370 CHF, is"
  },
  {
    "slug": "fiscalite-frontalier-geneve-impots-2026",
    "lang": "en",
    "column": "content_en",
    "mechanism": "FAITS",
    "note": "C2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "- [Shared housing budget near Geneva: the complete guide](/en/blog/budget-colocation-geneve-guide-complet)\n",
    "replace": "- [Swiss net salary 2026 for frontaliers](/en/blog/salaire-suisse-net-frontalier-2026)\n"
  },
  {
    "slug": "salaire-suisse-net-frontalier-2026",
    "lang": "fr",
    "column": "content_fr",
    "mechanism": "FAITS",
    "note": "E1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "> **Attention nouvelle règle 2024+** : si tu fais plus de 40 % de télétravail depuis la France, tu bascules sur l'imposition française — beaucoup moins avantageuse. On détaille tout dans",
    "replace": "> **Attention à la règle des 40 %** : au-delà de 40 % de télétravail annuel depuis la France, la part de ton salaire liée aux jours télétravaillés devient imposable en France, dès le premier jour. Ce seuil est pérennisé par l'avenant fiscal franco-suisse, applicable depuis le 1er janvier 2026. On détaille tout dans"
  },
  {
    "slug": "salaire-suisse-net-frontalier-2026",
    "lang": "fr",
    "column": "content_fr",
    "mechanism": "FAITS",
    "note": "E1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "(jusqu'à 7 056 CHF/an en 2026 pour un salarié)",
    "replace": "(jusqu'à 7 258 CHF/an en 2026 pour un salarié)"
  },
  {
    "slug": "salaire-suisse-net-frontalier-2026",
    "lang": "fr",
    "column": "content_fr",
    "mechanism": "FAITS",
    "note": "E1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "### 1. Le 3e pilier 3a si tu peux y accéder\nLes frontaliers travaillant à Genève ne peuvent généralement pas y souscrire (sauf statut de quasi-résident). Mais si tu y as droit, le plafond 2026",
    "replace": "### 1. Le 3e pilier 3a, si tu peux le déduire\nTout frontalier salarié en Suisse cotise à l'AVS : il peut donc ouvrir un 3a, même si beaucoup de banques refusent les non-résidents. La déduction fiscale est en revanche réservée aux quasi-résidents (taxation ordinaire ultérieure, au moins 90 % de tes revenus imposés en Suisse). Si tu remplis cette condition, le plafond 2026"
  },
  {
    "slug": "salaire-suisse-net-frontalier-2026",
    "lang": "en",
    "column": "content_en",
    "mechanism": "FAITS",
    "note": "E2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "> **Watch out for the 40 % rule (2024+)**: if you remote-work more than 40 % from France, you flip to French taxation — much less favourable. Read",
    "replace": "> **Watch out for the 40 % rule**: above 40 % annual remote work from France, the share of your salary tied to your remote-work days becomes taxable in France, from the very first day. The threshold was made permanent by the Franco-Swiss tax amendment, applicable since 1 January 2026. Read"
  },
  {
    "slug": "salaire-suisse-net-frontalier-2026",
    "lang": "en",
    "column": "content_en",
    "mechanism": "FAITS",
    "note": "E2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "### 1. The 3rd pillar 3a if eligible\nMost frontaliers can't use it (unless you have quasi-resident status). But if you can, the 2026 cap",
    "replace": "### 1. The 3rd pillar 3a, if you can deduct it\nEvery cross-border worker employed in Switzerland pays into the AVS and can therefore open a 3a, even though many banks turn down non-residents. The tax deduction, however, is reserved for quasi-residents (subsequent ordinary taxation, at least 90 % of your income taxed in Switzerland). If you meet that condition, the 2026 cap"
  },
  {
    "slug": "colocation-annemasse-ville-la-grand-ambilly",
    "lang": "fr",
    "column": "content_fr",
    "mechanism": "FAITS",
    "note": "F1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "**Annemasse centre (près de la gare)** : Prix : 1000-1400 CHF.",
    "replace": "**Annemasse centre (près de la gare)** : Prix : 600-800 €/mois."
  },
  {
    "slug": "colocation-annemasse-ville-la-grand-ambilly",
    "lang": "fr",
    "column": "content_fr",
    "mechanism": "FAITS",
    "note": "F1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "**Annemasse Nord** : Prix : 950-1250 CHF.",
    "replace": "**Annemasse Nord** : Prix : 550-750 €/mois."
  },
  {
    "slug": "colocation-annemasse-ville-la-grand-ambilly",
    "lang": "fr",
    "column": "content_fr",
    "mechanism": "FAITS",
    "note": "F1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "**Ville-la-Grand** : Prix : 900-1250 CHF.",
    "replace": "**Ville-la-Grand** : Prix : 500-700 €/mois."
  },
  {
    "slug": "colocation-annemasse-ville-la-grand-ambilly",
    "lang": "fr",
    "column": "content_fr",
    "mechanism": "FAITS",
    "note": "F1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "**Ambilly** : Prix : 850-1150 CHF.",
    "replace": "**Ambilly** : Prix : 500-750 €/mois."
  },
  {
    "slug": "colocation-annemasse-ville-la-grand-ambilly",
    "lang": "fr",
    "column": "content_fr",
    "mechanism": "FAITS",
    "note": "F1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "Loyer bizarrement bas (moins de 750 CHF une belle chambre)?",
    "replace": "Loyer bizarrement bas (bien en dessous de 550 € pour une belle chambre)?"
  },
  {
    "slug": "colocation-annemasse-ville-la-grand-ambilly",
    "lang": "fr",
    "column": "content_fr",
    "mechanism": "FAITS",
    "note": "F1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "Demander 200 CHF de baisse sur un 1000 CHF.",
    "replace": "Demander 20 % de baisse sur le loyer."
  },
  {
    "slug": "colocation-annemasse-ville-la-grand-ambilly",
    "lang": "en",
    "column": "content_en",
    "mechanism": "FAITS",
    "note": "F2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "**Annemasse center (near station)**: Price: 1000-1400 CHF.",
    "replace": "**Annemasse center (near station)**: Price: 600-800 €/month."
  },
  {
    "slug": "colocation-annemasse-ville-la-grand-ambilly",
    "lang": "en",
    "column": "content_en",
    "mechanism": "FAITS",
    "note": "F2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "**Annemasse North**: Price: 950-1250 CHF.",
    "replace": "**Annemasse North**: Price: 550-750 €/month."
  },
  {
    "slug": "colocation-annemasse-ville-la-grand-ambilly",
    "lang": "en",
    "column": "content_en",
    "mechanism": "FAITS",
    "note": "F2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "**Ville-la-Grand**: Price: 900-1250 CHF.",
    "replace": "**Ville-la-Grand**: Price: 500-700 €/month."
  },
  {
    "slug": "colocation-annemasse-ville-la-grand-ambilly",
    "lang": "en",
    "column": "content_en",
    "mechanism": "FAITS",
    "note": "F2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "**Ambilly**: Price: 850-1150 CHF.",
    "replace": "**Ambilly**: Price: 500-750 €/month."
  },
  {
    "slug": "colocation-annemasse-ville-la-grand-ambilly",
    "lang": "en",
    "column": "content_en",
    "mechanism": "FAITS",
    "note": "F2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "Price weirdly low (less than 750 CHF nice room)?",
    "replace": "Price weirdly low (well under 550 € for a nice room)?"
  },
  {
    "slug": "colocation-annemasse-ville-la-grand-ambilly",
    "lang": "en",
    "column": "content_en",
    "mechanism": "FAITS",
    "note": "F2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "Ask 200 CHF off a 1000 CHF rent.",
    "replace": "Ask for 20% off the rent."
  },
  {
    "slug": "lodge-annemasse-coliving-premium-portes-geneve",
    "lang": "fr",
    "column": "excerpt_fr",
    "mechanism": "FAITS",
    "note": "H1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "1 370 CHF/mois tout inclus",
    "replace": "1 430 CHF/mois tout inclus"
  },
  {
    "slug": "lodge-annemasse-coliving-premium-portes-geneve",
    "lang": "en",
    "column": "excerpt_en",
    "mechanism": "FAITS",
    "note": "H2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "all-inclusive at CHF 1,370/month",
    "replace": "all-inclusive at CHF 1,430/month"
  },
  {
    "slug": "lodge-annemasse-coliving-premium-portes-geneve",
    "lang": "fr",
    "column": "meta_description_fr",
    "mechanism": "FAITS",
    "note": "H3 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "1 370 CHF/mois tout inclus",
    "replace": "1 430 CHF/mois tout inclus"
  },
  {
    "slug": "lodge-annemasse-coliving-premium-portes-geneve",
    "lang": "en",
    "column": "meta_description_en",
    "mechanism": "FAITS",
    "note": "H4 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": "all-inclusive at CHF 1,370/month",
    "replace": "all-inclusive at CHF 1,430/month"
  },
  {
    "slug": "coliving-transfrontalier-geneve-annemasse-nouvelle-vie",
    "lang": "fr",
    "column": "meta_description_fr",
    "mechanism": "FAITS",
    "note": "H5 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": ", 1 370 CHF tout compris,",
    "replace": ", dès 1 370 CHF tout compris,"
  },
  {
    "slug": "coliving-transfrontalier-geneve-annemasse-nouvelle-vie",
    "lang": "en",
    "column": "meta_description_en",
    "mechanism": "FAITS",
    "note": "H6 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)",
    "find": ", 1,370 CHF all-inclusive,",
    "replace": ", from 1,370 CHF all-inclusive,"
  }
];

export function buildEdits() {
  return EDITS.map((e) => ({ ...e }));
}
