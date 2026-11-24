/**
 * « Programmer une visite » hors du site — lot 2 du plan du 24/11/2026 (« Programmer une visite » hors du site : l'e-mail, les
 * articles, le bot et n8n, § 2 et annexe A ; dossier refonte-pages-vente-2026-11-24/visite-hors-site) — liste DÉCLARATIVE des
 * appels à l'action des articles de blog (table blog_posts, colonnes content_fr / content_en) qui disent encore « candidate »,
 * « postule » ou « apply » alors que le site dit « Programmer une visite » depuis le 24/11/2026 (PR #67).
 * Consommée par scripts/build-slots-sql.mjs (SQL de référence + diff) et scripts/build-seance-sql.mjs (variante « séance »
 * 100 % ASCII, sauvegarde, retour arrière, gardes du site rejouées) :
 *
 *   node scripts/build-slots-sql.mjs --edits ./visite-articles.edits.mjs --name visite-articles --date 2026-11-24 --write-diff
 *   node scripts/build-seance-sql.mjs --edits ./visite-articles.edits.mjs --name visite-articles --date 2026-11-24 --expect-published 43
 *
 * Décisions de Jérôme (24/11/2026) :
 *  - RÈGLE A SEULEMENT : les appels à agir vers notre formulaire (« candidate ici », « Postule en 2 minutes », « Envoie ta
 *    candidature via notre formulaire », « apply here », « Apply in 2 minutes »…). La règle B (phrases qui décrivent notre
 *    parcours : « Notre processus de candidature… », « Si tu candidates : … », « Puis-je visiter Le Lodge avant de candidater ? »,
 *    « Candidater chez La Villa est entièrement gratuit… », « le délai médian entre la candidature et l'emménagement »…) et la
 *    règle C (sélection, marché, personnes : « chaque candidature est étudiée avec attention », « un candidat nous a écrit
 *    ceci », « application fee », le dossier, le permis G…) restent telles quelles. Conséquence : l'article
 *    s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france (B seulement) n'est pas touché — 33 articles, pas 34.
 *  - Mots du site : FR « programme une visite », « demande ta visite (en 2 minutes) », « la demande de visite prend deux
 *    minutes » ; EN « Book a visit », « Request your visit » (Q3 du plan, validés).
 *  - L'ADRESSE DES LIENS NE CHANGE JAMAIS (mesure GA4 des clics venus des articles) : seul le texte du lien change. buildEdits
 *    le vérifie (mêmes URL, dans le même ordre, dans `find` et `replace`).
 *  - Titres, extraits, metas, posts Facebook : rien (seules les colonnes content_fr / content_en sont visées). Articles non
 *    publiés : rien (la lecture anon ne les voit pas, et le SQL ne vise que des slugs publiés).
 *  - L'Appart garde « Candidater » (docs/claude/lappart.md) : aucune de ces phrases ne mène à son formulaire (buildEdits refuse
 *    une URL qui nomme lappart). L'ancre exacte « colocation à Genève côté France » (CLAUDE.md § 2) est gardée au caractère près.
 *
 * Règles de ce fichier :
 *  - `find` est copié AU CARACTÈRE PRÈS depuis le contenu vivant (REST anon, lecture seule, 24/11/2026 vers 18 h, après le lot 4
 *    « budget réel ») : apostrophes droites, tirets cadratins (—), flèche (→) ; aucune espace insécable dans ces phrases. Le
 *    générateur exige exactement 1 occurrence par colonne, puis simule l'application séquentielle.
 *  - Aucun chiffre, prix, minute ni délai nouveau : « 2 minutes », « deux minutes », « 48 h » et « 72 h » sont repris des
 *    phrases d'origine (et du formulaire : « Demande ta visite (2 min) »). Seule nouveauté factuelle, annexe A n° 20 (Le Lodge) :
 *    « prénom, nom, email et téléphone » = les quatre champs obligatoires du formulaire (src/pages/JoinPageV4.tsx), qui ne
 *    demande plus le profil depuis le 01/10/2026.
 *  - Pages de décision (PD) : les mêmes phrases vivent dans content/decision-pages/<slug>.<lang>.md, modifiées dans la même PR
 *    (sinon une republication ramènerait l'ancien texte) ; scripts/build-seance-sql.mjs vérifie que chaque source porte le
 *    nouveau texte et plus l'ancien.
 *  - Mécanisme : « A » (règle A du plan). La note cite le numéro de l'annexe A.
 */

/** Pages de décision touchées par ce lot (sources versionnées dans content/decision-pages/). */
export const DECISION_PAGE_SLUGS = Object.freeze([
  'coliving-colocation-ou-studio-geneve-comparatif',
  'ia-solitude-lien-social-coliving',
  'non-la-villa-coliving-nest-pas-une-arnaque',
  'ou-habiter-en-france-quand-on-travaille-a-geneve',
  'ou-habiter-frontalier-suisse-villes-france-pas-cher',
  'trouver-logement-avant-d-arriver-geneve',
  'vivre-a-annemasse-quand-on-travaille-a-geneve',
]);

/** Volume attendu (plan § 2, « 40 en français, 35 en anglais ») : un écart arrête tout. */
export const EXPECTED = Object.freeze({ fr: 40, en: 35, articles: 33 });

// ── La liste (ordre alphabétique des slugs, comme l'annexe A) ───────────────────────────────────────

const EDITS = [
  // 1 · arnaques-logement-frontalier-geneve-eviter
  { slug: 'arnaques-logement-frontalier-geneve-eviter', lang: 'fr', note: 'annexe A n° 1 · encadré final : « Candidate chez La Villa Coliving » → « Programme une visite chez La Villa Coliving », sur place ou en vidéo',
    find: '[Candidate chez La Villa Coliving](/candidature) — visite sur place, bail légal, zéro mauvaise surprise.',
    replace: '[Programme une visite chez La Villa Coliving](/candidature) — sur place ou en vidéo, bail légal, zéro mauvaise surprise.' },
  { slug: 'arnaques-logement-frontalier-geneve-eviter', lang: 'en', note: 'appendix A no. 1 · closing box: “Apply to La Villa Coliving” → “Book a visit at La Villa Coliving”, on site or by video',
    find: '[Apply to La Villa Coliving](/en/candidature) — on-site visits, legal lease, zero nasty surprises.',
    replace: '[Book a visit at La Villa Coliving](/en/candidature) — on site or by video, legal lease, zero nasty surprises.' },

  // 2 · assurance-sante-frontalier-lamal-cmu-budget
  { slug: 'assurance-sante-frontalier-lamal-cmu-budget', lang: 'fr', note: 'annexe A n° 2 · lien final « postule directement » → « programme une visite »',
    find: '[postule directement](/candidature)', replace: '[programme une visite](/candidature)' },
  { slug: 'assurance-sante-frontalier-lamal-cmu-budget', lang: 'en', note: 'appendix A no. 2 · closing link “apply directly” → “book a visit”',
    find: '[apply directly](/en/candidature)', replace: '[book a visit](/en/candidature)' },

  // 3 · banque-telephone-internet-frontalier-bons-plans
  { slug: 'banque-telephone-internet-frontalier-bons-plans', lang: 'fr', note: 'annexe A n° 3 · lien final « candidate ici » → « programme une visite »',
    find: '[candidate ici](/candidature)', replace: '[programme une visite](/candidature)' },
  { slug: 'banque-telephone-internet-frontalier-bons-plans', lang: 'en', note: 'appendix A no. 3 · closing link “apply here” → “book a visit”',
    find: '[apply here](/en/candidature)', replace: '[book a visit](/en/candidature)' },

  // 4 · budget-colocation-geneve-guide-complet (état d'après le lot 4 « budget réel », appliqué le 24/11/2026)
  { slug: 'budget-colocation-geneve-guide-complet', lang: 'fr', note: 'annexe A n° 4 · « candidater dès maintenant pour figurer sur la liste d\'attente » → « te manifester dès maintenant… »',
    find: 'la meilleure stratégie est de candidater dès maintenant pour figurer sur la liste d\'attente',
    replace: 'la meilleure stratégie est de te manifester dès maintenant pour figurer sur la liste d\'attente' },
  { slug: 'budget-colocation-geneve-guide-complet', lang: 'fr', note: 'annexe A n° 4 · « dépose ta [candidature en 2 minutes] » → « [demande ta visite en 2 minutes] »',
    find: 'ou dépose ta [candidature en 2 minutes](https://www.lavillacoliving.com/candidature)',
    replace: 'ou [demande ta visite en 2 minutes](https://www.lavillacoliving.com/candidature)' },
  { slug: 'budget-colocation-geneve-guide-complet', lang: 'en', note: 'appendix A no. 4 · “apply now to get on the waiting list” → “get in touch now…”',
    find: 'the best strategy is to apply now to get on the waiting list',
    replace: 'the best strategy is to get in touch now to get on the waiting list' },
  { slug: 'budget-colocation-geneve-guide-complet', lang: 'en', note: 'appendix A no. 4 · “submit your [application in 2 minutes]” → “[request your visit in 2 minutes]”',
    find: 'or submit your [application in 2 minutes](https://www.lavillacoliving.com/en/candidature)',
    replace: 'or [request your visit in 2 minutes](https://www.lavillacoliving.com/en/candidature)' },

  // 5 · choc-culturel-franco-suisse-expatrie-geneve
  { slug: 'choc-culturel-franco-suisse-expatrie-geneve', lang: 'fr', note: 'annexe A n° 5 · lien final « candidate ici » → « programme une visite »',
    find: '[candidate ici](/candidature)', replace: '[programme une visite](/candidature)' },
  { slug: 'choc-culturel-franco-suisse-expatrie-geneve', lang: 'en', note: 'appendix A no. 5 · closing link “apply here” → “book a visit”',
    find: '[apply here](/en/candidature)', replace: '[book a visit](/en/candidature)' },

  // 6 · coliving-annemasse-geneve-frontaliers-avantages
  { slug: 'coliving-annemasse-geneve-frontaliers-avantages', lang: 'fr', note: 'annexe A n° 6 · « Postule en 2 minutes » → « Demande ta visite en 2 minutes »',
    find: '[Postule en 2 minutes](/candidature)', replace: '[Demande ta visite en 2 minutes](/candidature)' },
  { slug: 'coliving-annemasse-geneve-frontaliers-avantages', lang: 'en', note: 'appendix A no. 6 · “Apply in 2 minutes” → “Request your visit in 2 minutes”',
    find: '[Apply in 2 minutes](/en/candidature)', replace: '[Request your visit in 2 minutes](/en/candidature)' },

  // 7 · coliving-colocation-ou-studio-geneve-comparatif (PD) — trois fois la même suite, ancrée par son contexte
  { slug: 'coliving-colocation-ou-studio-geneve-comparatif', lang: 'fr', note: 'annexe A n° 7 (1/3) · verdict « nouveau job » : « candidature en deux minutes » → « demande en deux minutes »',
    find: 'pas dans un magasin de meubles : candidature en deux minutes, réponse sous 48 h',
    replace: 'pas dans un magasin de meubles : demande en deux minutes, réponse sous 48 h' },
  { slug: 'coliving-colocation-ou-studio-geneve-comparatif', lang: 'fr', note: 'annexe A n° 7 (2/3) · lien « candidature en deux minutes » → « demande en deux minutes »',
    find: '[candidature en deux minutes](/candidature)', replace: '[demande en deux minutes](/candidature)' },
  { slug: 'coliving-colocation-ou-studio-geneve-comparatif', lang: 'fr', note: 'annexe A n° 7 (3/3) · FAQ « 72 h » : « candidature en deux minutes » → « demande en deux minutes »',
    find: 'si une chambre est disponible : candidature en deux minutes, réponse sous 48 h',
    replace: 'si une chambre est disponible : demande en deux minutes, réponse sous 48 h' },
  { slug: 'coliving-colocation-ou-studio-geneve-comparatif', lang: 'en', note: 'appendix A no. 7 (1/3) · “new job” verdict: “a two-minute application” → “a two-minute request”',
    find: 'not in a furniture store: a two-minute application, a reply within 48 h',
    replace: 'not in a furniture store: a two-minute request, a reply within 48 h' },
  { slug: 'coliving-colocation-ou-studio-geneve-comparatif', lang: 'en', note: 'appendix A no. 7 (2/3) · link “a two-minute application” → “a two-minute request”',
    find: '[a two-minute application](/en/candidature)', replace: '[a two-minute request](/en/candidature)' },
  { slug: 'coliving-colocation-ou-studio-geneve-comparatif', lang: 'en', note: 'appendix A no. 7 (3/3) · “72 h” FAQ: “a two-minute application” → “a two-minute request”',
    find: 'if a room is available: a two-minute application, a reply within 48 h',
    replace: 'if a room is available: a two-minute request, a reply within 48 h' },

  // 8 · coliving-communaute-reels-amis-geneve-annemasse
  { slug: 'coliving-communaute-reels-amis-geneve-annemasse', lang: 'fr', note: 'annexe A n° 8 · « Candidate dès maintenant » → « Programme une visite dès maintenant »',
    find: '[Candidate dès maintenant](/candidature)', replace: '[Programme une visite dès maintenant](/candidature)' },
  { slug: 'coliving-communaute-reels-amis-geneve-annemasse', lang: 'en', note: 'appendix A no. 8 · “Apply now” → “Book a visit now”',
    find: '[Apply now](/en/candidature)', replace: '[Book a visit now](/en/candidature)' },

  // 9 · coliving-frais-dossier-geneve-annemasse (la FAQ « Candidater chez La Villa est entièrement gratuit » = règle B, gardée)
  { slug: 'coliving-frais-dossier-geneve-annemasse', lang: 'fr', note: 'annexe A n° 9 · « candidate en 2 minutes, gratuitement » → « demande ta visite en 2 minutes, gratuitement »',
    find: '[candidate en 2 minutes, gratuitement](/candidature)', replace: '[demande ta visite en 2 minutes, gratuitement](/candidature)' },
  { slug: 'coliving-frais-dossier-geneve-annemasse', lang: 'en', note: 'appendix A no. 9 · “apply in 2 minutes, for free” → “request your visit in 2 minutes, for free”',
    find: '[apply in 2 minutes, for free](/en/candidature)', replace: '[request your visit in 2 minutes, for free](/en/candidature)' },

  // 10 · coliving-transfrontalier-geneve-annemasse-nouvelle-vie
  { slug: 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie', lang: 'fr', note: 'annexe A n° 10 · « Postule en 2 minutes » → « Demande ta visite en 2 minutes »',
    find: '[Postule en 2 minutes](/candidature)', replace: '[Demande ta visite en 2 minutes](/candidature)' },
  { slug: 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie', lang: 'en', note: 'appendix A no. 10 · “Apply in 2 minutes” → “Request your visit in 2 minutes”',
    find: '[Apply in 2 minutes](/en/candidature)', replace: '[Request your visit in 2 minutes](/en/candidature)' },

  // 11 · colocation-annemasse-ville-la-grand-ambilly (français seulement : l'anglais n'a pas de lien vers le formulaire)
  { slug: 'colocation-annemasse-ville-la-grand-ambilly', lang: 'fr', note: 'annexe A n° 11 · « Candidate en 2 minutes → » → « Demande ta visite en 2 minutes → »',
    find: '[Candidate en 2 minutes →](/candidature)', replace: '[Demande ta visite en 2 minutes →](/candidature)' },

  // 12 · cout-transport-frontalier-geneve-2026
  { slug: 'cout-transport-frontalier-geneve-2026', lang: 'fr', note: 'annexe A n° 12 · « postule en 2 minutes » → « demande ta visite en 2 minutes »',
    find: '[postule en 2 minutes](/candidature)', replace: '[demande ta visite en 2 minutes](/candidature)' },
  { slug: 'cout-transport-frontalier-geneve-2026', lang: 'en', note: 'appendix A no. 12 · “apply in 2 minutes” → “request your visit in 2 minutes”',
    find: '[apply in 2 minutes](/en/candidature)', replace: '[request your visit in 2 minutes](/en/candidature)' },

  // 13 · dossier-location-frontalier-suisse-france (le vocabulaire du dossier = règle C, gardé)
  { slug: 'dossier-location-frontalier-suisse-france', lang: 'fr', note: 'annexe A n° 13 · « Candidate chez La Villa Coliving » → « Programme une visite chez La Villa Coliving »',
    find: '[Candidate chez La Villa Coliving](/candidature)', replace: '[Programme une visite chez La Villa Coliving](/candidature)' },
  { slug: 'dossier-location-frontalier-suisse-france', lang: 'en', note: 'appendix A no. 13 · “Apply to La Villa Coliving” → “Book a visit at La Villa Coliving”',
    find: '[Apply to La Villa Coliving](/en/candidature)', replace: '[Book a visit at La Villa Coliving](/en/candidature)' },

  // 14 · espaces-verts-coliving-lodge-annemasse
  { slug: 'espaces-verts-coliving-lodge-annemasse', lang: 'fr', note: 'annexe A n° 14 · « postule en 2 minutes » → « demande ta visite en 2 minutes »',
    find: '[postule en 2 minutes](/candidature)', replace: '[demande ta visite en 2 minutes](/candidature)' },
  { slug: 'espaces-verts-coliving-lodge-annemasse', lang: 'en', note: 'appendix A no. 14 · “apply in 2 minutes” → “request your visit in 2 minutes”',
    find: '[apply in 2 minutes](/en/candidature)', replace: '[request your visit in 2 minutes](/en/candidature)' },

  // 15 · fiscalite-frontalier-geneve-impots-2026
  { slug: 'fiscalite-frontalier-geneve-impots-2026', lang: 'fr', note: 'annexe A n° 15 · « dépose ta [candidature] » → « [programme une visite] »',
    find: 'ou dépose ta [candidature](/candidature)', replace: 'ou [programme une visite](/candidature)' },
  { slug: 'fiscalite-frontalier-geneve-impots-2026', lang: 'en', note: 'appendix A no. 15 · “submit your [application]” → “[book a visit]”',
    find: 'or submit your [application](/en/candidature)', replace: 'or [book a visit](/en/candidature)' },

  // 16 · grand-geneve-2026-nouveautes-frontaliers (français seulement)
  { slug: 'grand-geneve-2026-nouveautes-frontaliers', lang: 'fr', note: 'annexe A n° 16 · « Candidate en 2 minutes → » → « Demande ta visite en 2 minutes → »',
    find: '[Candidate en 2 minutes →](/candidature)', replace: '[Demande ta visite en 2 minutes →](/candidature)' },

  // 17 · guide-ressources-frontalier-geneve (le lien anglais mène à la page française : constat hors sujet, adresse inchangée)
  { slug: 'guide-ressources-frontalier-geneve', lang: 'fr', note: 'annexe A n° 17 · « candidate en quelques minutes, gratuitement » → « demande ta visite en quelques minutes, gratuitement »',
    find: '[candidate en quelques minutes, gratuitement](/candidature)', replace: '[demande ta visite en quelques minutes, gratuitement](/candidature)' },
  { slug: 'guide-ressources-frontalier-geneve', lang: 'en', note: 'appendix A no. 17 · “apply in a few minutes, for free” → “request your visit in a few minutes, for free” (URL unchanged)',
    find: '[apply in a few minutes, for free](/candidature)', replace: '[request your visit in a few minutes, for free](/candidature)' },

  // 18 · ia-solitude-lien-social-coliving (PD)
  { slug: 'ia-solitude-lien-social-coliving', lang: 'fr', note: 'annexe A n° 18 · « candidate en ligne » → « demande une visite en ligne »',
    find: '[candidate en ligne](/candidature)', replace: '[demande une visite en ligne](/candidature)' },
  { slug: 'ia-solitude-lien-social-coliving', lang: 'en', note: 'appendix A no. 18 · “apply online” → “book a visit online”',
    find: '[apply online](/en/candidature)', replace: '[book a visit online](/en/candidature)' },

  // 19 · living-in-france-working-in-geneva (français seulement)
  { slug: 'living-in-france-working-in-geneva', lang: 'fr', note: 'annexe A n° 19 · « Candidate en 2 minutes → » → « Demande ta visite en 2 minutes → »',
    find: '[Candidate en 2 minutes →](/candidature)', replace: '[Demande ta visite en 2 minutes →](/candidature)' },

  // 20 · lodge-annemasse-coliving-premium-portes-geneve (« Notre processus de candidature », « candidater plusieurs semaines
  //      avant », la question de FAQ « avant de candidater ? » = règle B, gardées ; la sélection = règle C, gardée)
  { slug: 'lodge-annemasse-coliving-premium-portes-geneve', lang: 'fr', note: 'annexe A n° 20 · étape 1 : « Tu remplis le [formulaire de candidature]… ton profil… » → « Tu [demandes ta visite en ligne] : prénom, nom, email et téléphone, deux minutes. » (champs obligatoires du formulaire)',
    find: 'Tu remplis le [formulaire de candidature](/candidature) en ligne en présentant ton profil, ta situation professionnelle et tes attentes vis-à-vis de la vie en coliving.',
    replace: 'Tu [demandes ta visite en ligne](/candidature) : prénom, nom, email et téléphone, deux minutes.' },
  { slug: 'lodge-annemasse-coliving-premium-portes-geneve', lang: 'fr', note: 'annexe A n° 20 · conclusion : « [candidate directement] pour vérifier la disponibilité » → « [programme une visite] : on vérifie avec toi les chambres disponibles »',
    find: 'ou [candidate directement](/candidature) pour vérifier la disponibilité des chambres.',
    replace: 'ou [programme une visite](/candidature) : on vérifie avec toi les chambres disponibles.' },
  { slug: 'lodge-annemasse-coliving-premium-portes-geneve', lang: 'en', note: 'appendix A no. 20 · step 1: “You fill in the online [application form] presenting your profile…” → “You [book your visit online]: first name, last name, email and phone, two minutes.”',
    find: 'You fill in the online [application form](/en/candidature) presenting your profile, your professional situation, and what you expect from coliving life.',
    replace: 'You [book your visit online](/en/candidature): first name, last name, email and phone, two minutes.' },
  { slug: 'lodge-annemasse-coliving-premium-portes-geneve', lang: 'en', note: 'appendix A no. 20 · conclusion: “[apply directly] to check room availability” → “[book a visit]: we\'ll check room availability with you”',
    find: 'or [apply directly](/en/candidature) to check room availability.',
    replace: 'or [book a visit](/en/candidature): we\'ll check room availability with you.' },

  // 21 · non-la-villa-coliving-nest-pas-une-arnaque (PD ; « Si tu candidates : réponse sous 48 h… » = règle B, gardée ;
  //      « un candidat nous a écrit ceci », « 4. On valide ton dossier » = règle C, gardées)
  { slug: 'non-la-villa-coliving-nest-pas-une-arnaque', lang: 'fr', note: 'annexe A n° 21 · étape 1 : « Tu [candidates en ligne] » → « Tu [demandes une visite en ligne] »',
    find: '1. Tu [candidates en ligne](/candidature), ou tu nous écris.', replace: '1. Tu [demandes une visite en ligne](/candidature), ou tu nous écris.' },
  { slug: 'non-la-villa-coliving-nest-pas-une-arnaque', lang: 'fr', note: 'annexe A n° 21 · « Avant de candidater, trois lectures utiles » → « Avant ta visite, trois lectures utiles »',
    find: 'Avant de candidater, trois lectures utiles', replace: 'Avant ta visite, trois lectures utiles' },
  { slug: 'non-la-villa-coliving-nest-pas-une-arnaque', lang: 'en', note: 'appendix A no. 21 · step 1: “You [apply online]” → “You [book a visit online]”',
    find: '1. You [apply online](/en/candidature), or you message us.', replace: '1. You [book a visit online](/en/candidature), or you message us.' },
  { slug: 'non-la-villa-coliving-nest-pas-une-arnaque', lang: 'en', note: 'appendix A no. 21 · “Before you apply, three useful reads” → “Before your visit, three useful reads”',
    find: 'Before you apply, three useful reads', replace: 'Before your visit, three useful reads' },

  // 22 · organisations-internationales-geneve-ou-habiter (le titre de section change, donc son ancre : aucun lien n'y mène)
  { slug: 'organisations-internationales-geneve-ou-habiter', lang: 'fr', note: 'annexe A n° 22 · titre « Comment candidater si tu es en poste OI » → « Comment demander une visite si tu es en poste OI »',
    find: '## Comment candidater si tu es en poste OI', replace: '## Comment demander une visite si tu es en poste OI' },
  { slug: 'organisations-internationales-geneve-ou-habiter', lang: 'fr', note: 'annexe A n° 22 · « Envoie ta candidature via notre [formulaire en ligne] » → « Demande ta visite via notre [formulaire en ligne] »',
    find: 'Envoie ta candidature via notre [formulaire en ligne](/candidature).', replace: 'Demande ta visite via notre [formulaire en ligne](/candidature).' },
  { slug: 'organisations-internationales-geneve-ou-habiter', lang: 'en', note: 'appendix A no. 22 · heading “How to apply if you\'re in an IO position” → “How to book a visit if you\'re in an IO position”',
    find: '## How to apply if you\'re in an IO position', replace: '## How to book a visit if you\'re in an IO position' },
  { slug: 'organisations-internationales-geneve-ou-habiter', lang: 'en', note: 'appendix A no. 22 · “Submit your application via our [online form]” → “Request your visit via our [online form]”',
    find: 'Submit your application via our [online form](/en/candidature).', replace: 'Request your visit via our [online form](/en/candidature).' },

  // 23 · ou-habiter-en-france-quand-on-travaille-a-geneve (PD)
  { slug: 'ou-habiter-en-france-quand-on-travaille-a-geneve', lang: 'fr', note: 'annexe A n° 23 · « [la candidature se fait à distance] » → « [la visite peut se faire en vidéo] »',
    find: 'et [la candidature se fait à distance](/candidature).', replace: 'et [la visite peut se faire en vidéo](/candidature).' },
  { slug: 'ou-habiter-en-france-quand-on-travaille-a-geneve', lang: 'en', note: 'appendix A no. 23 · “[you can apply remotely]” → “[you can visit by video]”',
    find: 'and [you can apply remotely](/en/candidature).', replace: 'and [you can visit by video](/en/candidature).' },

  // 24 · ou-habiter-frontalier-suisse-villes-france-pas-cher (PD)
  { slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'fr', note: 'annexe A n° 24 · « la [candidature prend deux minutes] » → « la [demande de visite prend deux minutes] » (comme /tarifs)',
    find: 'la [candidature prend deux minutes](/candidature)', replace: 'la [demande de visite prend deux minutes](/candidature)' },
  { slug: 'ou-habiter-frontalier-suisse-villes-france-pas-cher', lang: 'en', note: 'appendix A no. 24 · “the [application takes two minutes]” → “the [visit request takes two minutes]”',
    find: 'the [application takes two minutes](/en/candidature)', replace: 'the [visit request takes two minutes](/en/candidature)' },

  // 25 · s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france (PD) : règle B seulement → NON TOUCHÉ (décision du 24/11/2026)

  // 26 · salaire-suisse-net-frontalier-2026
  { slug: 'salaire-suisse-net-frontalier-2026', lang: 'fr', note: 'annexe A n° 26 · « Postule en 2 min » → « Demande ta visite en 2 min »',
    find: '[Postule en 2 min](/candidature)', replace: '[Demande ta visite en 2 min](/candidature)' },
  { slug: 'salaire-suisse-net-frontalier-2026', lang: 'en', note: 'appendix A no. 26 · “Apply in 2 min” → “Request your visit in 2 min”',
    find: '[Apply in 2 min](/en/candidature)', replace: '[Request your visit in 2 min](/en/candidature)' },

  // 27 · se-faire-reseau-geneve-arriver-seul
  { slug: 'se-faire-reseau-geneve-arriver-seul', lang: 'fr', note: 'annexe A n° 27 · lien final « candidate ici » → « programme une visite »',
    find: '[candidate ici](/candidature)', replace: '[programme une visite](/candidature)' },
  { slug: 'se-faire-reseau-geneve-arriver-seul', lang: 'en', note: 'appendix A no. 27 · closing link “apply here” → “book a visit”',
    find: '[apply here](/en/candidature)', replace: '[book a visit](/en/candidature)' },

  // 28 · teletravail-frontalier-geneve-regles-2026
  { slug: 'teletravail-frontalier-geneve-regles-2026', lang: 'fr', note: 'annexe A n° 28 · lien final « postule » → « programme une visite »',
    find: '[postule](/candidature)', replace: '[programme une visite](/candidature)' },
  { slug: 'teletravail-frontalier-geneve-regles-2026', lang: 'en', note: 'appendix A no. 28 · closing link “apply” → “book a visit”',
    find: '[apply](/en/candidature)', replace: '[book a visit](/en/candidature)' },

  // 29 · temps-trajet-annemasse-geneve-par-quartier
  { slug: 'temps-trajet-annemasse-geneve-par-quartier', lang: 'fr', note: 'annexe A n° 29 · lien final « postule directement » → « programme une visite »',
    find: '[postule directement](/candidature)', replace: '[programme une visite](/candidature)' },
  { slug: 'temps-trajet-annemasse-geneve-par-quartier', lang: 'en', note: 'appendix A no. 29 · closing link “apply directly” → “book a visit”',
    find: '[apply directly](/en/candidature)', replace: '[book a visit](/en/candidature)' },

  // 30 · transport-annemasse-geneve-leman-express (français seulement)
  { slug: 'transport-annemasse-geneve-leman-express', lang: 'fr', note: 'annexe A n° 30 · « Candidate en 2 minutes → » → « Demande ta visite en 2 minutes → »',
    find: '[Candidate en 2 minutes →](/candidature)', replace: '[Demande ta visite en 2 minutes →](/candidature)' },

  // 31 · trouver-colocation-geneve-frontalier (ancre exacte « colocation à Genève côté France » inchangée, CLAUDE.md § 2)
  { slug: 'trouver-colocation-geneve-frontalier', lang: 'fr', note: 'annexe A n° 31 · intro : « voir les chambres libres et candidater » → « … et programmer une visite » (ancre exacte du lien inchangée)',
    find: 'voir les chambres libres et candidater, va sur notre page [colocation à Genève côté France](/colocation-geneve)',
    replace: 'voir les chambres libres et programmer une visite, va sur notre page [colocation à Genève côté France](/colocation-geneve)' },
  { slug: 'trouver-colocation-geneve-frontalier', lang: 'fr', note: 'annexe A n° 31 · « postule en 2 minutes » → « demande ta visite en 2 minutes » (adresse ?src=bloc_offre inchangée)',
    find: '[postule en 2 minutes](/candidature?src=bloc_offre&article=trouver-colocation-geneve-frontalier)',
    replace: '[demande ta visite en 2 minutes](/candidature?src=bloc_offre&article=trouver-colocation-geneve-frontalier)' },
  { slug: 'trouver-colocation-geneve-frontalier', lang: 'en', note: 'appendix A no. 31 · “Apply in 2 minutes” → “Request your visit in 2 minutes”',
    find: '[Apply in 2 minutes](/en/candidature)', replace: '[Request your visit in 2 minutes](/en/candidature)' },

  // 32 · trouver-logement-avant-d-arriver-geneve (PD ; « moins de candidats » = règle C, gardée)
  { slug: 'trouver-logement-avant-d-arriver-geneve', lang: 'fr', note: 'annexe A n° 32 · « [la candidature se remplit à distance], avant même la première visite » → « [la visite peut se faire en vidéo], avant même ton arrivée »',
    find: 'et [la candidature se remplit à distance](/candidature), avant même la première visite.',
    replace: 'et [la visite peut se faire en vidéo](/candidature), avant même ton arrivée.' },
  { slug: 'trouver-logement-avant-d-arriver-geneve', lang: 'en', note: 'appendix A no. 32 · “[the application can be done remotely], before you\'ve even had a viewing” → “[the visit can be done by video], before you even arrive”',
    find: 'and [the application can be done remotely](/en/candidature), before you\'ve even had a viewing.',
    replace: 'and [the visit can be done by video](/en/candidature), before you even arrive.' },

  // 33 · vie-quotidienne-frontalier-courses-sport-sorties
  { slug: 'vie-quotidienne-frontalier-courses-sport-sorties', lang: 'fr', note: 'annexe A n° 33 · lien final « candidate ici » → « programme une visite »',
    find: '[candidate ici](/candidature)', replace: '[programme une visite](/candidature)' },
  { slug: 'vie-quotidienne-frontalier-courses-sport-sorties', lang: 'en', note: 'appendix A no. 33 · closing link “apply here” → “book a visit”',
    find: '[apply here](/en/candidature)', replace: '[book a visit](/en/candidature)' },

  // 34 · vivre-a-annemasse-quand-on-travaille-a-geneve (PD)
  { slug: 'vivre-a-annemasse-quand-on-travaille-a-geneve', lang: 'fr', note: 'annexe A n° 34 · « la [candidature prend deux minutes] » → « la [demande de visite prend deux minutes] »',
    find: 'la [candidature prend deux minutes](/candidature)', replace: 'la [demande de visite prend deux minutes](/candidature)' },
  { slug: 'vivre-a-annemasse-quand-on-travaille-a-geneve', lang: 'en', note: 'appendix A no. 34 · “the [application takes two minutes]” → “the [visit request takes two minutes]”',
    find: 'the [application takes two minutes](/en/candidature)', replace: 'the [visit request takes two minutes](/en/candidature)' },
];

/** Motifs à signaler (avertissement) dans le texte RÉSULTANT des articles touchés : un lien vers le formulaire qui dirait encore « candidate », « postule » ou « apply ». */
export const POST_STATE_WATCH = [
  /\[[^\]]*(?:candidat|postul)[^\]]*\]\((?:https:\/\/www\.lavillacoliving\.com)?(?:\/en)?\/candidature/i,
  /\[[^\]]*\b(?:apply|applying|application)\b[^\]]*\]\((?:https:\/\/www\.lavillacoliving\.com)?(?:\/en)?\/candidature/i,
];

/** En-tête, légende et versions propres au lot (lus par scripts/build-slots-sql.mjs). */
export function sqlDoc() {
  return {
    lot: '« Programmer une visite » hors du site — lot 2 (articles du blog, plan du 24/11/2026, § 2 et annexe A) : appels à agir vers le formulaire, RÈGLE A SEULEMENT (décision de Jérôme du 24/11/2026)',
    sources: 'textes insérés = mots du site (« Programmer une visite », « Demande ta visite (2 min) », « la demande de visite prend… » ; EN « Book a visit », « Request your visit ») ; adresses des liens inchangées',
    apply: 'À appliquer sur GO de Jérôme, dans la séance SQL des lots 2 et 3 (articles puis bot), AVANT le push de la PR (pages de décision : mêmes phrases dans content/decision-pages), hors passage du robot du prérendu. Forme de séance (un seul appel, 100 % ASCII, gardes md5) : scripts/visite-articles-2026-11-24.seance.sql.',
    encoding: 'Fichier UTF-8 : il contient des tirets cadratins (« — »), des flèches (« → ») et des accents — ne pas le faire transiter par un éditeur qui normalise les caractères. Aucune espace insécable dans ces phrases.',
    dryRunTitle: '« Programmer une visite » — articles du blog (règle A) : aperçu des modifications SQL',
    legend: 'Légende : les textes « Avant » sont copiés au caractère près depuis la base (content_fr / content_en, lecture REST anon du 24/11/2026) ; les textes « Après » reprennent les mots du site. Seul le texte des liens change, jamais leur adresse. Mécanisme : A = appel à agir vers notre formulaire (règle A du plan, annexe A). Les phrases de la règle B (notre parcours : « Notre processus de candidature », « Si tu candidates », « avant de candidater ? », « Candidater chez La Villa est entièrement gratuit », « le délai médian entre la candidature et l\'emménagement ») et de la règle C (sélection, marché, dossier, permis G, « application fee ») ne sont PAS modifiées (décision du 24/11/2026) ; l\'article s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france (B seulement) n\'est pas touché.',
    versions: { plan: 'PLAN_visite_email-articles-bot-n8n_2026-11-24.md § 2 et annexe A', 'règle': 'A seulement' },
  };
}

/** URL des liens markdown d'un texte, dans l'ordre. */
const urlsOf = (s) => [...String(s).matchAll(/\]\(([^)\s]+)\)/g)].map((x) => x[1]);
/** Texte sans les URL des liens (« /candidature » n'est pas un mot du texte). */
const withoutUrls = (s) => String(s).replace(/\]\([^)]*\)/g, ']()');
const OLD_WORDS = { fr: /candidat|postul/i, en: /\b(?:apply|applying|application)\b/i };
const EXACT_ANCHOR = '[colocation à Genève côté France](/colocation-geneve)';

/** La liste résolue, avec ses garde-fous (un seul échec arrête tout). */
export function buildEdits() {
  const out = EDITS.map((e, i) => {
    const where = `edit #${i + 1} (${e.slug}/${e.lang})`;
    if (!['fr', 'en'].includes(e.lang)) throw new Error(`${where} : langue inconnue`);
    if (typeof e.find !== 'string' || !e.find || typeof e.replace !== 'string' || !e.replace) throw new Error(`${where} : find ou replace vide`);
    if (e.find === e.replace) throw new Error(`${where} : replace identique à find`);
    // Les adresses des liens ne changent jamais (mesure GA4) : mêmes URL, même ordre.
    if (JSON.stringify(urlsOf(e.find)) !== JSON.stringify(urlsOf(e.replace))) throw new Error(`${where} : les adresses des liens diffèrent entre find et replace`);
    // Toujours vers le formulaire des maisons ; jamais celui de L'Appart (qui garde « Candidater »).
    if (urlsOf(e.find).some((u) => /lappart/i.test(u))) throw new Error(`${where} : lien vers L'Appart (il garde « Candidater ») — hors du lot`);
    // Règle A : l'ancien texte porte le mot de l'ancien monde ; le nouveau ne le porte plus.
    if (!OLD_WORDS[e.lang].test(withoutUrls(e.find))) throw new Error(`${where} : find sans « candidat / postul / apply » — hors de la règle A`);
    if (OLD_WORDS.fr.test(withoutUrls(e.replace)) || OLD_WORDS.en.test(withoutUrls(e.replace))) throw new Error(`${where} : le nouveau texte dit encore « candidat / postul / apply »`);
    // Ancre exacte du pilier (CLAUDE.md § 2) : si elle est dans l'ancre de la modification, elle reste au caractère près.
    if (e.find.includes(EXACT_ANCHOR) && !e.replace.includes(EXACT_ANCHOR)) throw new Error(`${where} : l'ancre exacte « colocation à Genève côté France » doit rester`);
    // Aucun chiffre nouveau : les nombres du nouveau texte sont ceux de l'ancien.
    const nums = (s) => (withoutUrls(s).match(/\d+/g) ?? []).sort().join(',');
    if (nums(e.replace) !== nums(e.find)) throw new Error(`${where} : chiffres différents entre find et replace (${nums(e.find)} → ${nums(e.replace)})`);
    return { slug: e.slug, lang: e.lang, mechanism: 'A', note: e.note, find: e.find, replace: e.replace };
  });
  const fr = out.filter((e) => e.lang === 'fr').length;
  const en = out.filter((e) => e.lang === 'en').length;
  const articles = new Set(out.map((e) => e.slug)).size;
  if (fr !== EXPECTED.fr || en !== EXPECTED.en || articles !== EXPECTED.articles) {
    throw new Error(`visite-articles.edits : ${fr} FR / ${en} EN / ${articles} articles au lieu de ${EXPECTED.fr} / ${EXPECTED.en} / ${EXPECTED.articles}`);
  }
  return out;
}
