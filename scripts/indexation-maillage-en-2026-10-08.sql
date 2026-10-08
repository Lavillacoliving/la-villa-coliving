-- ============================================================================
-- Lot D (audit d'indexation GSC du 07/10/2026, actions P2) — maillage contextuel EN/FR + qualité EN
-- Branche content/indexation-maillage-en · préparé, relu et vérifié le 08/10/2026 en lecture seule (MCP, SELECT)
-- AUCUNE écriture faite à la préparation : Jérôme (ou Claude sur son GO) exécute ce fichier.
--
-- CONTENU
--   a. guide-ressources-frontalier-geneve devient un hub : 1 lien in-body vers le guide depuis chacun des
--      8 articles fiscalité / santé / permis (fiscalite, salaire, teletravail, allocations, permis-g, avenant,
--      declaration, assurance-sante), FR et EN ; liens retour du guide vers salaire et allocations (les 6 autres
--      y étaient déjà).
--   b. Cluster fiscal : fiscalite → permis-g, avenant, declaration ; permis-g → avenant, declaration ;
--      avenant → permis-g, declaration ; declaration → permis-g (avenant y était déjà) ; bonus :
--      teletravail → avenant (la phrase nommait l'avenant sans le lier). FR et EN.
--   c. /en/chambre-a-louer-geneve : liens depuis ou-habiter (EN, + FR /chambre-a-louer-geneve) et
--      cout-de-la-vie (EN : rétablit la symétrie, le FR liait déjà la page).
--   d. salaire → cout-transport, ou-habiter → demenager, ecole-internationale → assurance-sante (FR et EN).
--   e. colocation-annemasse-ville-la-grand-ambilly (EN) : intro réécrite en anglais naturel, titre
--      « # Colocation in … » supprimé (h2 en double du h1), « hunt game », « pollution », « weird people »
--      retirés, Leboncoin expliqué ; meta_description_en et excerpt_en sans « colocation ». title_en intact.
--   f. meta_description_en renseignée pour assurance-sante et cout-transport.
--   14 articles, 28 colonnes modifiées. Aucun prix, aucune durée en minutes, aucun concurrent dans
--   les phrases ajoutées ; tutoiement FR, « you » EN ; liens EN en /en/… (convention dominante du contenu EN).
--
-- RÉPARTITION DES 47 NOUVELLES ANCRES (règle 40/25/25/10 ; sur le site, elle sert d'alerte, pas de quota) :
--   classement manuel : marque 20 (43 %) · URL nue 8 (17 %) · générique 15 (32 %) · exact-match 4 (9 %)
--     (« exact » = l'ancre reprend la requête principale de l'article cible, ex. « permis G ») ;
--   selon classifyAnchor (tools/lib/html-links.mjs, celui de npm run link:graph) : marque 20 (43 %) · URL nue 8 (17 %)
--     · générique 19 (40 %) · exact 0 — l'outil n'a de mots-clés que pour les pages money (MONEY_KEYWORDS),
--     toute ancre vers /blog/* qui n'est ni marque ni URL y sort « générique ». Les deux colonnes sont dans le détail ci-dessous.
--   URL nue sous les 25 % : les 4 ancres « lavillacoliving.com/(en/)blog/declaration-impots-frontalier-2026 » prévues
--     au départ ont été remplacées (relecture du 08/10) : leur plus long segment insécable mesure 302 px (FR) et
--     329 px (EN) en Inter 17,6 px, soit un débordement horizontal de la page sur un écran de 320 px et un texte collé
--     au bord à 360 px (.blog-content n'a aucune règle overflow-wrap). Les 8 URL nues gardées mesurent ≤ 290 px :
--     aucun débordement de page dès 320 px.
--   Même ancre vers une même cible : « lavillacoliving.com/(en/)blog/guide-ressources-frontalier-geneve » sert 3 fois
--     par langue (salaire, avenant, declaration), soit 3 des 8 nouveaux entrants du guide (38 % < seuil 60 %
--     sameAnchorShare de link:graph). Aucun autre doublon.
--
-- ORDRE D'EXÉCUTION
--   1. Bloc 0 seul (lecture) : toutes les lignes ok = true. Sinon STOP (le texte a bougé depuis le 08/10).
--   2. Bloc 1 (transaction BEGIN … COMMIT) : garde md5 → UPDATE → contrôle md5 avant COMMIT.
--      Rejouable : un second passage ne change rien (garde md5 + NOT LIKE).
--   3. Bloc 3 (lecture, en fin de fichier) : toutes les lignes ok = true. (Le bloc 2, commenté, sert au retour arrière.)
--   4. Republier le HTML : le prérendu relit les articles en base. Recommandé : attendre le cron du bot (05:00 ou
--      13:00 UTC, parfois avec du retard). Sinon, un push sur main qui touche src/** ou scripts/** (ou index.html,
--      package.json, vite.config.ts, vercel.json : liste « paths » de .github/workflows/prerender.yml ; public/ n'en
--      fait PAS partie) relance le bot, donc le déploiement production. ATTENTION : pousser CE fichier sous scripts/
--      sur main relance le bot ; ne le pousser qu'APRÈS le bloc 1, sinon le bot prérend l'ancien texte (sans danger,
--      mais inutile).
--   5. GSC, après le commit auto-prerender : « Demander l'indexation » pour les URL EN de l'audit (EN-2/EN-4),
--      dans l'ordre : living-in-france, guide-ressources, permis-g, coliving-frais-dossier, assurance-sante,
--      cout-transport, declaration, avenant, colocation-annemasse (quota ~10/jour).
--
-- EFFET ATTENDU
--   Plus de liens contextuels entrants vers les articles EN « Discovered » / « Crawled – not indexed »
--   (guide-ressources passe de 0 à 8 sources in-body par langue ; permis-g, avenant, declaration gagnent
--   chacun 3 sources), une page EN colocation-annemasse lisible par un anglophone. Effet modéré selon
--   l'audit : le nombre de liens n'est pas discriminant seul ; le levier direct reste la demande d'indexation.
--
-- TRIGGER updated_at (vérifié le 08/10/2026) : blog_posts_updated_at, BEFORE UPDATE FOR EACH ROW,
--   update_blog_updated_at() → NEW.updated_at = NOW() à CHAQUE UPDATE, sans condition. Conséquences :
--   · les 14 articles prennent updated_at = date d'application → <lastmod> du sitemap (prerender.mjs,
--     BLOG_LASTMOD par slug, partagé par /blog/<slug> et /en/blog/<slug>) = cette date, en FR comme en EN,
--     même quand une seule langue change (colocation-annemasse : FR inchangé) ;
--   · JSON-LD dateModified et la mention « Mis à jour le … / Updated … » de l'article changent aussi ;
--   · c'est exact pour les pages dont le texte change ; chaque UPDATE est gardé par le md5 de départ : un rejeu ne
--     touche plus aucune ligne, donc ne refait pas bouger updated_at ;
--   · limite acceptée (décision de relecture du 08/10, à confirmer par Jérôme) : 3 URL FR prennent un lastmod sans
--     changement de leur texte, parce que seule la colonne EN de la ligne change : /blog/cout-de-la-vie-suisse-france-
--     frontalier-2026, /blog/colocation-annemasse-ville-la-grand-ambilly et /blog/cout-transport-frontalier-geneve-2026
--     (pour cette dernière, seule la meta description EN change). Le trigger ne peut pas être contourné sans
--     ALTER TABLE … DISABLE TRIGGER (droits de propriétaire, verrou exclusif) : non retenu. Si Jérôme préfère, retirer
--     la meta de cout-transport de ce lot et la livrer avec une vraie mise à jour de l'article.
--
-- HORS PÉRIMÈTRE (vu en relisant, non corrigé ici, à traiter dans un lot correctif séparé, même méthode) :
--   · ou-habiter-frontalier-suisse-villes-france-pas-cher : « Sans bail, tout inclus » / « No lease, all-inclusive »
--     (En résumé / TL;DR) et « tu pars quand tu veux » / « you leave when you want » contredisent D5 (bail de 12 mois,
--     libre de partir à tout moment avec 1 mois de préavis) ;
--   · metas encore vides (la page se replie sur l'extrait) : meta_description_en de fiscalite-frontalier-geneve-
--     impots-2026 et organisations-internationales-geneve-ou-habiter ; meta_description_fr de ces deux articles,
--     d'assurance-sante, de cout-transport et de teletravail-frontalier-geneve-regles-2026 ;
--   · « 15-20 minutes from Geneva » dans 25 articles EN (règle : 20 min porte-à-porte) ; « Coliving at 1,370 CHF »
--     en dur, sans « from » (fiscalite et assurance, EN) ; « À lire aussi » sans lien (ou-habiter) ou en double
--     (fiscalite).
-- ============================================================================
-- Détail des 47 liens ajoutés (article source · colonne · classe · ancre -> cible) :
--   fiscalite-frontalier-geneve-impots-2026              content_fr  marque            le guide des ressources du frontalier de La Villa Coliving  ->  /blog/guide-ressources-frontalier-geneve
--   fiscalite-frontalier-geneve-impots-2026              content_en  marque            La Villa Coliving's cross-border resources guide  ->  /en/blog/guide-ressources-frontalier-geneve
--   salaire-suisse-net-frontalier-2026                   content_fr  url_nue           lavillacoliving.com/blog/guide-ressources-frontalier-geneve  ->  /blog/guide-ressources-frontalier-geneve
--   salaire-suisse-net-frontalier-2026                   content_en  url_nue           lavillacoliving.com/en/blog/guide-ressources-frontalier-geneve  ->  /en/blog/guide-ressources-frontalier-geneve
--   teletravail-frontalier-geneve-regles-2026            content_fr  generique         notre dossier complet  ->  /blog/guide-ressources-frontalier-geneve
--   teletravail-frontalier-geneve-regles-2026            content_en  generique         our all-in-one guide  ->  /en/blog/guide-ressources-frontalier-geneve
--   allocations-familiales-frontalier-geneve-2026        content_fr  exact/generique   le guide des ressources du frontalier à Genève  ->  /blog/guide-ressources-frontalier-geneve
--   allocations-familiales-frontalier-geneve-2026        content_en  exact/generique   Geneva cross-border resources guide  ->  /en/blog/guide-ressources-frontalier-geneve
--   permis-g-frontalier-geneve                           content_fr  marque            le dossier ressources frontalier de La Villa  ->  /blog/guide-ressources-frontalier-geneve
--   permis-g-frontalier-geneve                           content_en  marque            La Villa's resource guide for cross-border workers  ->  /en/blog/guide-ressources-frontalier-geneve
--   avenant-fiscal-40-frontalier-geneve                  content_fr  url_nue           lavillacoliving.com/blog/guide-ressources-frontalier-geneve  ->  /blog/guide-ressources-frontalier-geneve
--   avenant-fiscal-40-frontalier-geneve                  content_en  url_nue           lavillacoliving.com/en/blog/guide-ressources-frontalier-geneve  ->  /en/blog/guide-ressources-frontalier-geneve
--   declaration-impots-frontalier-2026                   content_fr  url_nue           lavillacoliving.com/blog/guide-ressources-frontalier-geneve  ->  /blog/guide-ressources-frontalier-geneve
--   declaration-impots-frontalier-2026                   content_en  url_nue           lavillacoliving.com/en/blog/guide-ressources-frontalier-geneve  ->  /en/blog/guide-ressources-frontalier-geneve
--   assurance-sante-frontalier-lamal-cmu-budget          content_fr  marque            le guide La Villa des ressources du frontalier  ->  /blog/guide-ressources-frontalier-geneve
--   assurance-sante-frontalier-lamal-cmu-budget          content_en  marque            the La Villa guide to cross-border resources  ->  /en/blog/guide-ressources-frontalier-geneve
--   guide-ressources-frontalier-geneve                   content_fr  url_nue           lavillacoliving.com/blog/salaire-suisse-net-frontalier-2026  ->  /blog/salaire-suisse-net-frontalier-2026
--   guide-ressources-frontalier-geneve                   content_en  url_nue           lavillacoliving.com/en/blog/salaire-suisse-net-frontalier-2026  ->  /en/blog/salaire-suisse-net-frontalier-2026
--   guide-ressources-frontalier-geneve                   content_fr  marque            le guide La Villa des allocations familiales  ->  /blog/allocations-familiales-frontalier-geneve-2026
--   guide-ressources-frontalier-geneve                   content_en  marque            La Villa's family allowances guide  ->  /en/blog/allocations-familiales-frontalier-geneve-2026
--   fiscalite-frontalier-geneve-impots-2026              content_fr  exact/generique   permis G  ->  /blog/permis-g-frontalier-geneve
--   fiscalite-frontalier-geneve-impots-2026              content_en  exact/generique   permis G  ->  /en/blog/permis-g-frontalier-geneve
--   fiscalite-frontalier-geneve-impots-2026              content_fr  marque            le décryptage La Villa de l'avenant fiscal  ->  /blog/avenant-fiscal-40-frontalier-geneve
--   fiscalite-frontalier-geneve-impots-2026              content_en  marque            La Villa's breakdown of the tax amendment  ->  /en/blog/avenant-fiscal-40-frontalier-geneve
--   fiscalite-frontalier-geneve-impots-2026              content_fr  generique         le pas-à-pas 2026 de ta déclaration  ->  /blog/declaration-impots-frontalier-2026
--   fiscalite-frontalier-geneve-impots-2026              content_en  generique         the 2026 step-by-step for your French return  ->  /en/blog/declaration-impots-frontalier-2026
--   permis-g-frontalier-geneve                           content_fr  generique         déclaration de tes revenus en France chaque printemps  ->  /blog/declaration-impots-frontalier-2026
--   permis-g-frontalier-geneve                           content_fr  generique         l'avenant franco-suisse  ->  /blog/avenant-fiscal-40-frontalier-geneve
--   permis-g-frontalier-geneve                           content_en  generique         declaring your income in France every spring  ->  /en/blog/declaration-impots-frontalier-2026
--   permis-g-frontalier-geneve                           content_en  generique         the Franco-Swiss amendment  ->  /en/blog/avenant-fiscal-40-frontalier-geneve
--   avenant-fiscal-40-frontalier-geneve                  content_fr  marque            la fiche La Villa sur le permis G  ->  /blog/permis-g-frontalier-geneve
--   avenant-fiscal-40-frontalier-geneve                  content_en  marque            La Villa's permis G explainer  ->  /en/blog/permis-g-frontalier-geneve
--   avenant-fiscal-40-frontalier-geneve                  content_fr  marque            le pas-à-pas La Villa de la déclaration 2026  ->  /blog/declaration-impots-frontalier-2026
--   avenant-fiscal-40-frontalier-geneve                  content_en  marque            La Villa's 2026 tax return walkthrough  ->  /en/blog/declaration-impots-frontalier-2026
--   declaration-impots-frontalier-2026                   content_fr  generique         autorisation frontalière  ->  /blog/permis-g-frontalier-geneve
--   declaration-impots-frontalier-2026                   content_en  generique         commuter permit  ->  /en/blog/permis-g-frontalier-geneve
--   teletravail-frontalier-geneve-regles-2026            content_fr  generique         avenant à la convention fiscale franco-suisse  ->  /blog/avenant-fiscal-40-frontalier-geneve
--   teletravail-frontalier-geneve-regles-2026            content_en  generique         amendment to the Franco-Swiss tax treaty  ->  /en/blog/avenant-fiscal-40-frontalier-geneve
--   ou-habiter-frontalier-suisse-villes-france-pas-cher  content_en  marque            La Villa's page of rooms to rent near Geneva  ->  /en/chambre-a-louer-geneve
--   ou-habiter-frontalier-suisse-villes-france-pas-cher  content_fr  marque            la page des chambres à louer de La Villa près de Genève  ->  /chambre-a-louer-geneve
--   cout-de-la-vie-suisse-france-frontalier-2026         content_en  generique         furnished rooms to rent  ->  /en/chambre-a-louer-geneve
--   salaire-suisse-net-frontalier-2026                   content_fr  generique         trajets quotidiens  ->  /blog/cout-transport-frontalier-geneve-2026
--   salaire-suisse-net-frontalier-2026                   content_en  generique         the daily commute  ->  /en/blog/cout-transport-frontalier-geneve-2026
--   ou-habiter-frontalier-suisse-villes-france-pas-cher  content_fr  marque            la checklist déménagement de La Villa  ->  /blog/demenager-geneve-frontalier-checklist
--   ou-habiter-frontalier-suisse-villes-france-pas-cher  content_en  marque            La Villa's moving checklist  ->  /en/blog/demenager-geneve-frontalier-checklist
--   ecole-internationale-geneve-frontalier-ou-habiter    content_fr  marque            le comparatif santé de La Villa  ->  /blog/assurance-sante-frontalier-lamal-cmu-budget
--   ecole-internationale-geneve-frontalier-ou-habiter    content_en  marque            La Villa's health insurance comparison  ->  /en/blog/assurance-sante-frontalier-lamal-cmu-budget
-- ============================================================================

-- 0. PRÉ-CONTRÔLE (lecture seule, à lancer seul d'abord) : chaque ligne doit sortir ok = true.
--    « fragment présent » = 1 : la phrase d'ancrage existe exactement une fois ; « lien déjà là » = 0.
--    Après application, ce pré-contrôle sort des ok = false (fragments remplacés) : c'est normal, voir le bloc 3.
--    Lancer le fichier entier d'un coup est aussi sûr : la garde 1.a arrête tout si le texte a bougé.
select n, slug, col, controle, valeur, attendu, (valeur = attendu) as ok from (
select 1 as n, 'fiscalite-frontalier-geneve-impots-2026' as slug, 'content_fr' as col, 'fragment présent' as controle, (length(content_fr) - length(replace(content_fr, $q$et c'est souvent pertinent de se faire accompagner par un fiduciaire.$q$, ''))) / length($q$et c'est souvent pertinent de se faire accompagner par un fiduciaire.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'fiscalite-frontalier-geneve-impots-2026'
union all
select 1, 'fiscalite-frontalier-geneve-impots-2026', 'content_fr', 'lien déjà là : /blog/guide-ressources-frontalier-geneve', (length(content_fr) - length(replace(content_fr, $q$](/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/blog/guide-ressources-frontalier-geneve)$q$), 0 from public.blog_posts where slug = 'fiscalite-frontalier-geneve-impots-2026'
union all
select 2 as n, 'fiscalite-frontalier-geneve-impots-2026' as slug, 'content_en' as col, 'fragment présent' as controle, (length(content_en) - length(replace(content_en, $q$and it's often worth getting help from a fiduciary.$q$, ''))) / length($q$and it's often worth getting help from a fiduciary.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'fiscalite-frontalier-geneve-impots-2026'
union all
select 2, 'fiscalite-frontalier-geneve-impots-2026', 'content_en', 'lien déjà là : /en/blog/guide-ressources-frontalier-geneve', (length(content_en) - length(replace(content_en, $q$](/en/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/en/blog/guide-ressources-frontalier-geneve)$q$) + (length(content_en) - length(replace(content_en, $q$](/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/blog/guide-ressources-frontalier-geneve)$q$), 0 from public.blog_posts where slug = 'fiscalite-frontalier-geneve-impots-2026'
union all
select 3 as n, 'salaire-suisse-net-frontalier-2026' as slug, 'content_fr' as col, 'fragment présent' as controle, (length(content_fr) - length(replace(content_fr, $q$À vérifier dans ton cas précis sur le simulateur officiel de l'État de Genève (admin.ge.ch).$q$, ''))) / length($q$À vérifier dans ton cas précis sur le simulateur officiel de l'État de Genève (admin.ge.ch).$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'salaire-suisse-net-frontalier-2026'
union all
select 3, 'salaire-suisse-net-frontalier-2026', 'content_fr', 'lien déjà là : /blog/guide-ressources-frontalier-geneve', (length(content_fr) - length(replace(content_fr, $q$](/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/blog/guide-ressources-frontalier-geneve)$q$), 0 from public.blog_posts where slug = 'salaire-suisse-net-frontalier-2026'
union all
select 4 as n, 'salaire-suisse-net-frontalier-2026' as slug, 'content_en' as col, 'fragment présent' as controle, (length(content_en) - length(replace(content_en, $q$Always cross-check on the official Geneva simulator (admin.ge.ch).$q$, ''))) / length($q$Always cross-check on the official Geneva simulator (admin.ge.ch).$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'salaire-suisse-net-frontalier-2026'
union all
select 4, 'salaire-suisse-net-frontalier-2026', 'content_en', 'lien déjà là : /en/blog/guide-ressources-frontalier-geneve', (length(content_en) - length(replace(content_en, $q$](/en/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/en/blog/guide-ressources-frontalier-geneve)$q$) + (length(content_en) - length(replace(content_en, $q$](/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/blog/guide-ressources-frontalier-geneve)$q$), 0 from public.blog_posts where slug = 'salaire-suisse-net-frontalier-2026'
union all
select 5 as n, 'teletravail-frontalier-geneve-regles-2026' as slug, 'content_fr' as col, 'fragment présent' as controle, (length(content_fr) - length(replace(content_fr, $q$est une bonne ressource à partager.$q$, ''))) / length($q$est une bonne ressource à partager.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'teletravail-frontalier-geneve-regles-2026'
union all
select 5, 'teletravail-frontalier-geneve-regles-2026', 'content_fr', 'lien déjà là : /blog/guide-ressources-frontalier-geneve', (length(content_fr) - length(replace(content_fr, $q$](/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/blog/guide-ressources-frontalier-geneve)$q$), 0 from public.blog_posts where slug = 'teletravail-frontalier-geneve-regles-2026'
union all
select 6 as n, 'teletravail-frontalier-geneve-regles-2026' as slug, 'content_en' as col, 'fragment présent' as controle, (length(content_en) - length(replace(content_en, $q$report is a good resource to share.$q$, ''))) / length($q$report is a good resource to share.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'teletravail-frontalier-geneve-regles-2026'
union all
select 6, 'teletravail-frontalier-geneve-regles-2026', 'content_en', 'lien déjà là : /en/blog/guide-ressources-frontalier-geneve', (length(content_en) - length(replace(content_en, $q$](/en/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/en/blog/guide-ressources-frontalier-geneve)$q$) + (length(content_en) - length(replace(content_en, $q$](/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/blog/guide-ressources-frontalier-geneve)$q$), 0 from public.blog_posts where slug = 'teletravail-frontalier-geneve-regles-2026'
union all
select 7 as n, 'allocations-familiales-frontalier-geneve-2026' as slug, 'content_fr' as col, 'fragment présent' as controle, (length(content_fr) - length(replace(content_fr, $q$la pièce manquante est presque toujours ce qui bloque.$q$, ''))) / length($q$la pièce manquante est presque toujours ce qui bloque.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'allocations-familiales-frontalier-geneve-2026'
union all
select 7, 'allocations-familiales-frontalier-geneve-2026', 'content_fr', 'lien déjà là : /blog/guide-ressources-frontalier-geneve', (length(content_fr) - length(replace(content_fr, $q$](/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/blog/guide-ressources-frontalier-geneve)$q$), 0 from public.blog_posts where slug = 'allocations-familiales-frontalier-geneve-2026'
union all
select 8 as n, 'allocations-familiales-frontalier-geneve-2026' as slug, 'content_en' as col, 'fragment présent' as controle, (length(content_en) - length(replace(content_en, $q$a missing document is almost always what holds a file up.$q$, ''))) / length($q$a missing document is almost always what holds a file up.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'allocations-familiales-frontalier-geneve-2026'
union all
select 8, 'allocations-familiales-frontalier-geneve-2026', 'content_en', 'lien déjà là : /en/blog/guide-ressources-frontalier-geneve', (length(content_en) - length(replace(content_en, $q$](/en/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/en/blog/guide-ressources-frontalier-geneve)$q$) + (length(content_en) - length(replace(content_en, $q$](/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/blog/guide-ressources-frontalier-geneve)$q$), 0 from public.blog_posts where slug = 'allocations-familiales-frontalier-geneve-2026'
union all
select 9 as n, 'permis-g-frontalier-geneve' as slug, 'content_fr' as col, 'fragment présent' as controle, (length(content_fr) - length(replace(content_fr, $q$Voici le mode d'emploi 2026, étape par étape.$q$, ''))) / length($q$Voici le mode d'emploi 2026, étape par étape.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'permis-g-frontalier-geneve'
union all
select 9, 'permis-g-frontalier-geneve', 'content_fr', 'lien déjà là : /blog/guide-ressources-frontalier-geneve', (length(content_fr) - length(replace(content_fr, $q$](/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/blog/guide-ressources-frontalier-geneve)$q$), 0 from public.blog_posts where slug = 'permis-g-frontalier-geneve'
union all
select 10 as n, 'permis-g-frontalier-geneve' as slug, 'content_en' as col, 'fragment présent' as controle, (length(content_en) - length(replace(content_en, $q$Here's the 2026 step-by-step.$q$, ''))) / length($q$Here's the 2026 step-by-step.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'permis-g-frontalier-geneve'
union all
select 10, 'permis-g-frontalier-geneve', 'content_en', 'lien déjà là : /en/blog/guide-ressources-frontalier-geneve', (length(content_en) - length(replace(content_en, $q$](/en/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/en/blog/guide-ressources-frontalier-geneve)$q$) + (length(content_en) - length(replace(content_en, $q$](/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/blog/guide-ressources-frontalier-geneve)$q$), 0 from public.blog_posts where slug = 'permis-g-frontalier-geneve'
union all
select 11 as n, 'avenant-fiscal-40-frontalier-geneve' as slug, 'content_fr' as col, 'fragment présent' as controle, (length(content_fr) - length(replace(content_fr, $q$fais-toi accompagner par un fiduciaire spécialisé en fiscalité transfrontalière.$q$, ''))) / length($q$fais-toi accompagner par un fiduciaire spécialisé en fiscalité transfrontalière.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'avenant-fiscal-40-frontalier-geneve'
union all
select 11, 'avenant-fiscal-40-frontalier-geneve', 'content_fr', 'lien déjà là : /blog/guide-ressources-frontalier-geneve', (length(content_fr) - length(replace(content_fr, $q$](/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/blog/guide-ressources-frontalier-geneve)$q$), 0 from public.blog_posts where slug = 'avenant-fiscal-40-frontalier-geneve'
union all
select 12 as n, 'avenant-fiscal-40-frontalier-geneve' as slug, 'content_en' as col, 'fragment présent' as controle, (length(content_en) - length(replace(content_en, $q$get help from a fiduciary specializing in cross-border taxation.$q$, ''))) / length($q$get help from a fiduciary specializing in cross-border taxation.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'avenant-fiscal-40-frontalier-geneve'
union all
select 12, 'avenant-fiscal-40-frontalier-geneve', 'content_en', 'lien déjà là : /en/blog/guide-ressources-frontalier-geneve', (length(content_en) - length(replace(content_en, $q$](/en/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/en/blog/guide-ressources-frontalier-geneve)$q$) + (length(content_en) - length(replace(content_en, $q$](/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/blog/guide-ressources-frontalier-geneve)$q$), 0 from public.blog_posts where slug = 'avenant-fiscal-40-frontalier-geneve'
union all
select 13 as n, 'declaration-impots-frontalier-2026' as slug, 'content_fr' as col, 'fragment présent' as controle, (length(content_fr) - length(replace(content_fr, $q$voir notre [guide de la fiscalité frontalière](/blog/fiscalite-frontalier-geneve-impots-2026).$q$, ''))) / length($q$voir notre [guide de la fiscalité frontalière](/blog/fiscalite-frontalier-geneve-impots-2026).$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'declaration-impots-frontalier-2026'
union all
select 13, 'declaration-impots-frontalier-2026', 'content_fr', 'lien déjà là : /blog/guide-ressources-frontalier-geneve', (length(content_fr) - length(replace(content_fr, $q$](/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/blog/guide-ressources-frontalier-geneve)$q$), 0 from public.blog_posts where slug = 'declaration-impots-frontalier-2026'
union all
select 14 as n, 'declaration-impots-frontalier-2026' as slug, 'content_en' as col, 'fragment présent' as controle, (length(content_en) - length(replace(content_en, $q$see our [cross-border tax guide](/en/blog/fiscalite-frontalier-geneve-impots-2026).$q$, ''))) / length($q$see our [cross-border tax guide](/en/blog/fiscalite-frontalier-geneve-impots-2026).$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'declaration-impots-frontalier-2026'
union all
select 14, 'declaration-impots-frontalier-2026', 'content_en', 'lien déjà là : /en/blog/guide-ressources-frontalier-geneve', (length(content_en) - length(replace(content_en, $q$](/en/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/en/blog/guide-ressources-frontalier-geneve)$q$) + (length(content_en) - length(replace(content_en, $q$](/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/blog/guide-ressources-frontalier-geneve)$q$), 0 from public.blog_posts where slug = 'declaration-impots-frontalier-2026'
union all
select 15 as n, 'assurance-sante-frontalier-lamal-cmu-budget' as slug, 'content_fr' as col, 'fragment présent' as controle, (length(content_fr) - length(replace(content_fr, $q$C'est gratuit et ça peut te faire économiser des milliers de francs par an.$q$, ''))) / length($q$C'est gratuit et ça peut te faire économiser des milliers de francs par an.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'assurance-sante-frontalier-lamal-cmu-budget'
union all
select 15, 'assurance-sante-frontalier-lamal-cmu-budget', 'content_fr', 'lien déjà là : /blog/guide-ressources-frontalier-geneve', (length(content_fr) - length(replace(content_fr, $q$](/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/blog/guide-ressources-frontalier-geneve)$q$), 0 from public.blog_posts where slug = 'assurance-sante-frontalier-lamal-cmu-budget'
union all
select 16 as n, 'assurance-sante-frontalier-lamal-cmu-budget' as slug, 'content_en' as col, 'fragment présent' as controle, (length(content_en) - length(replace(content_en, $q$It's free and can save you thousands of francs per year.$q$, ''))) / length($q$It's free and can save you thousands of francs per year.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'assurance-sante-frontalier-lamal-cmu-budget'
union all
select 16, 'assurance-sante-frontalier-lamal-cmu-budget', 'content_en', 'lien déjà là : /en/blog/guide-ressources-frontalier-geneve', (length(content_en) - length(replace(content_en, $q$](/en/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/en/blog/guide-ressources-frontalier-geneve)$q$) + (length(content_en) - length(replace(content_en, $q$](/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/blog/guide-ressources-frontalier-geneve)$q$), 0 from public.blog_posts where slug = 'assurance-sante-frontalier-lamal-cmu-budget'
union all
select 17 as n, 'guide-ressources-frontalier-geneve' as slug, 'content_fr' as col, 'fragment présent' as controle, (length(content_fr) - length(replace(content_fr, $q$qu'il faut comparer à tes charges (loyer, assurance, transport) quand tu calcules ton budget.$q$, ''))) / length($q$qu'il faut comparer à tes charges (loyer, assurance, transport) quand tu calcules ton budget.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'guide-ressources-frontalier-geneve'
union all
select 17, 'guide-ressources-frontalier-geneve', 'content_fr', 'lien déjà là : /blog/salaire-suisse-net-frontalier-2026', (length(content_fr) - length(replace(content_fr, $q$](/blog/salaire-suisse-net-frontalier-2026)$q$, ''))) / length($q$](/blog/salaire-suisse-net-frontalier-2026)$q$), 0 from public.blog_posts where slug = 'guide-ressources-frontalier-geneve'
union all
select 18 as n, 'guide-ressources-frontalier-geneve' as slug, 'content_en' as col, 'fragment présent' as controle, (length(content_en) - length(replace(content_en, $q$that you must compare to your costs (rent, insurance, transport) when budgeting.$q$, ''))) / length($q$that you must compare to your costs (rent, insurance, transport) when budgeting.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'guide-ressources-frontalier-geneve'
union all
select 18, 'guide-ressources-frontalier-geneve', 'content_en', 'lien déjà là : /en/blog/salaire-suisse-net-frontalier-2026', (length(content_en) - length(replace(content_en, $q$](/en/blog/salaire-suisse-net-frontalier-2026)$q$, ''))) / length($q$](/en/blog/salaire-suisse-net-frontalier-2026)$q$) + (length(content_en) - length(replace(content_en, $q$](/blog/salaire-suisse-net-frontalier-2026)$q$, ''))) / length($q$](/blog/salaire-suisse-net-frontalier-2026)$q$), 0 from public.blog_posts where slug = 'guide-ressources-frontalier-geneve'
union all
select 19 as n, 'guide-ressources-frontalier-geneve' as slug, 'content_fr' as col, 'fragment présent' as controle, (length(content_fr) - length(replace(content_fr, $q$fais la simulation à l'échelle du foyer, pas seulement individuelle.$q$, ''))) / length($q$fais la simulation à l'échelle du foyer, pas seulement individuelle.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'guide-ressources-frontalier-geneve'
union all
select 19, 'guide-ressources-frontalier-geneve', 'content_fr', 'lien déjà là : /blog/allocations-familiales-frontalier-geneve-2026', (length(content_fr) - length(replace(content_fr, $q$](/blog/allocations-familiales-frontalier-geneve-2026)$q$, ''))) / length($q$](/blog/allocations-familiales-frontalier-geneve-2026)$q$), 0 from public.blog_posts where slug = 'guide-ressources-frontalier-geneve'
union all
select 20 as n, 'guide-ressources-frontalier-geneve' as slug, 'content_en' as col, 'fragment présent' as controle, (length(content_en) - length(replace(content_en, $q$simulate at household level, not just individually.$q$, ''))) / length($q$simulate at household level, not just individually.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'guide-ressources-frontalier-geneve'
union all
select 20, 'guide-ressources-frontalier-geneve', 'content_en', 'lien déjà là : /en/blog/allocations-familiales-frontalier-geneve-2026', (length(content_en) - length(replace(content_en, $q$](/en/blog/allocations-familiales-frontalier-geneve-2026)$q$, ''))) / length($q$](/en/blog/allocations-familiales-frontalier-geneve-2026)$q$) + (length(content_en) - length(replace(content_en, $q$](/blog/allocations-familiales-frontalier-geneve-2026)$q$, ''))) / length($q$](/blog/allocations-familiales-frontalier-geneve-2026)$q$), 0 from public.blog_posts where slug = 'guide-ressources-frontalier-geneve'
union all
select 21 as n, 'fiscalite-frontalier-geneve-impots-2026' as slug, 'content_fr' as col, 'fragment présent' as controle, (length(content_fr) - length(replace(content_fr, $q$En tant que frontalier travaillant dans le canton de Genève, [ton imposition$q$, ''))) / length($q$En tant que frontalier travaillant dans le canton de Genève, [ton imposition$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'fiscalite-frontalier-geneve-impots-2026'
union all
select 21, 'fiscalite-frontalier-geneve-impots-2026', 'content_fr', 'lien déjà là : /blog/permis-g-frontalier-geneve', (length(content_fr) - length(replace(content_fr, $q$](/blog/permis-g-frontalier-geneve)$q$, ''))) / length($q$](/blog/permis-g-frontalier-geneve)$q$), 0 from public.blog_posts where slug = 'fiscalite-frontalier-geneve-impots-2026'
union all
select 22 as n, 'fiscalite-frontalier-geneve-impots-2026' as slug, 'content_en' as col, 'fragment présent' as controle, (length(content_en) - length(replace(content_en, $q$As a cross-border worker in the canton of Geneva, [your taxation$q$, ''))) / length($q$As a cross-border worker in the canton of Geneva, [your taxation$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'fiscalite-frontalier-geneve-impots-2026'
union all
select 22, 'fiscalite-frontalier-geneve-impots-2026', 'content_en', 'lien déjà là : /en/blog/permis-g-frontalier-geneve', (length(content_en) - length(replace(content_en, $q$](/en/blog/permis-g-frontalier-geneve)$q$, ''))) / length($q$](/en/blog/permis-g-frontalier-geneve)$q$) + (length(content_en) - length(replace(content_en, $q$](/blog/permis-g-frontalier-geneve)$q$, ''))) / length($q$](/blog/permis-g-frontalier-geneve)$q$), 0 from public.blog_posts where slug = 'fiscalite-frontalier-geneve-impots-2026'
union all
select 23 as n, 'fiscalite-frontalier-geneve-impots-2026' as slug, 'content_fr' as col, 'fragment présent' as controle, (length(content_fr) - length(replace(content_fr, $q$ton revenu, et d'éventuelles déductions.$q$, ''))) / length($q$ton revenu, et d'éventuelles déductions.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'fiscalite-frontalier-geneve-impots-2026'
union all
select 23, 'fiscalite-frontalier-geneve-impots-2026', 'content_fr', 'lien déjà là : /blog/avenant-fiscal-40-frontalier-geneve', (length(content_fr) - length(replace(content_fr, $q$](/blog/avenant-fiscal-40-frontalier-geneve)$q$, ''))) / length($q$](/blog/avenant-fiscal-40-frontalier-geneve)$q$), 0 from public.blog_posts where slug = 'fiscalite-frontalier-geneve-impots-2026'
union all
select 24 as n, 'fiscalite-frontalier-geneve-impots-2026' as slug, 'content_en' as col, 'fragment présent' as controle, (length(content_en) - length(replace(content_en, $q$your income, and potential deductions.$q$, ''))) / length($q$your income, and potential deductions.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'fiscalite-frontalier-geneve-impots-2026'
union all
select 24, 'fiscalite-frontalier-geneve-impots-2026', 'content_en', 'lien déjà là : /en/blog/avenant-fiscal-40-frontalier-geneve', (length(content_en) - length(replace(content_en, $q$](/en/blog/avenant-fiscal-40-frontalier-geneve)$q$, ''))) / length($q$](/en/blog/avenant-fiscal-40-frontalier-geneve)$q$) + (length(content_en) - length(replace(content_en, $q$](/blog/avenant-fiscal-40-frontalier-geneve)$q$, ''))) / length($q$](/blog/avenant-fiscal-40-frontalier-geneve)$q$), 0 from public.blog_posts where slug = 'fiscalite-frontalier-geneve-impots-2026'
union all
select 25 as n, 'fiscalite-frontalier-geneve-impots-2026' as slug, 'content_fr' as col, 'fragment présent' as controle, (length(content_fr) - length(replace(content_fr, $q$La France calcule un impôt théorique sur l'ensemble de tes revenus.$q$, ''))) / length($q$La France calcule un impôt théorique sur l'ensemble de tes revenus.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'fiscalite-frontalier-geneve-impots-2026'
union all
select 25, 'fiscalite-frontalier-geneve-impots-2026', 'content_fr', 'lien déjà là : /blog/declaration-impots-frontalier-2026', (length(content_fr) - length(replace(content_fr, $q$](/blog/declaration-impots-frontalier-2026)$q$, ''))) / length($q$](/blog/declaration-impots-frontalier-2026)$q$), 0 from public.blog_posts where slug = 'fiscalite-frontalier-geneve-impots-2026'
union all
select 26 as n, 'fiscalite-frontalier-geneve-impots-2026' as slug, 'content_en' as col, 'fragment présent' as controle, (length(content_en) - length(replace(content_en, $q$France calculates a theoretical tax on all your income.$q$, ''))) / length($q$France calculates a theoretical tax on all your income.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'fiscalite-frontalier-geneve-impots-2026'
union all
select 26, 'fiscalite-frontalier-geneve-impots-2026', 'content_en', 'lien déjà là : /en/blog/declaration-impots-frontalier-2026', (length(content_en) - length(replace(content_en, $q$](/en/blog/declaration-impots-frontalier-2026)$q$, ''))) / length($q$](/en/blog/declaration-impots-frontalier-2026)$q$) + (length(content_en) - length(replace(content_en, $q$](/blog/declaration-impots-frontalier-2026)$q$, ''))) / length($q$](/blog/declaration-impots-frontalier-2026)$q$), 0 from public.blog_posts where slug = 'fiscalite-frontalier-geneve-impots-2026'
union all
select 27 as n, 'permis-g-frontalier-geneve' as slug, 'content_fr' as col, 'fragment présent' as controle, (length(content_fr) - length(replace(content_fr, $q$le permis G encadre cette situation.$q$, ''))) / length($q$le permis G encadre cette situation.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'permis-g-frontalier-geneve'
union all
select 27, 'permis-g-frontalier-geneve', 'content_fr', 'lien déjà là : /blog/declaration-impots-frontalier-2026', (length(content_fr) - length(replace(content_fr, $q$](/blog/declaration-impots-frontalier-2026)$q$, ''))) / length($q$](/blog/declaration-impots-frontalier-2026)$q$), 0 from public.blog_posts where slug = 'permis-g-frontalier-geneve'
union all
select 27, 'permis-g-frontalier-geneve', 'content_fr', 'lien déjà là : /blog/avenant-fiscal-40-frontalier-geneve', (length(content_fr) - length(replace(content_fr, $q$](/blog/avenant-fiscal-40-frontalier-geneve)$q$, ''))) / length($q$](/blog/avenant-fiscal-40-frontalier-geneve)$q$), 0 from public.blog_posts where slug = 'permis-g-frontalier-geneve'
union all
select 28 as n, 'permis-g-frontalier-geneve' as slug, 'content_en' as col, 'fragment présent' as controle, (length(content_en) - length(replace(content_en, $q$the permis G frames that setup.$q$, ''))) / length($q$the permis G frames that setup.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'permis-g-frontalier-geneve'
union all
select 28, 'permis-g-frontalier-geneve', 'content_en', 'lien déjà là : /en/blog/declaration-impots-frontalier-2026', (length(content_en) - length(replace(content_en, $q$](/en/blog/declaration-impots-frontalier-2026)$q$, ''))) / length($q$](/en/blog/declaration-impots-frontalier-2026)$q$) + (length(content_en) - length(replace(content_en, $q$](/blog/declaration-impots-frontalier-2026)$q$, ''))) / length($q$](/blog/declaration-impots-frontalier-2026)$q$), 0 from public.blog_posts where slug = 'permis-g-frontalier-geneve'
union all
select 28, 'permis-g-frontalier-geneve', 'content_en', 'lien déjà là : /en/blog/avenant-fiscal-40-frontalier-geneve', (length(content_en) - length(replace(content_en, $q$](/en/blog/avenant-fiscal-40-frontalier-geneve)$q$, ''))) / length($q$](/en/blog/avenant-fiscal-40-frontalier-geneve)$q$) + (length(content_en) - length(replace(content_en, $q$](/blog/avenant-fiscal-40-frontalier-geneve)$q$, ''))) / length($q$](/blog/avenant-fiscal-40-frontalier-geneve)$q$), 0 from public.blog_posts where slug = 'permis-g-frontalier-geneve'
union all
select 29 as n, 'avenant-fiscal-40-frontalier-geneve' as slug, 'content_fr' as col, 'fragment présent' as controle, (length(content_fr) - length(replace(content_fr, $q$Voici ce qui change concrètement pour ton imposition, expliqué sans jargon.$q$, ''))) / length($q$Voici ce qui change concrètement pour ton imposition, expliqué sans jargon.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'avenant-fiscal-40-frontalier-geneve'
union all
select 29, 'avenant-fiscal-40-frontalier-geneve', 'content_fr', 'lien déjà là : /blog/permis-g-frontalier-geneve', (length(content_fr) - length(replace(content_fr, $q$](/blog/permis-g-frontalier-geneve)$q$, ''))) / length($q$](/blog/permis-g-frontalier-geneve)$q$), 0 from public.blog_posts where slug = 'avenant-fiscal-40-frontalier-geneve'
union all
select 30 as n, 'avenant-fiscal-40-frontalier-geneve' as slug, 'content_en' as col, 'fragment présent' as controle, (length(content_en) - length(replace(content_en, $q$Here's what actually changes for your taxation, in plain language.$q$, ''))) / length($q$Here's what actually changes for your taxation, in plain language.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'avenant-fiscal-40-frontalier-geneve'
union all
select 30, 'avenant-fiscal-40-frontalier-geneve', 'content_en', 'lien déjà là : /en/blog/permis-g-frontalier-geneve', (length(content_en) - length(replace(content_en, $q$](/en/blog/permis-g-frontalier-geneve)$q$, ''))) / length($q$](/en/blog/permis-g-frontalier-geneve)$q$) + (length(content_en) - length(replace(content_en, $q$](/blog/permis-g-frontalier-geneve)$q$, ''))) / length($q$](/blog/permis-g-frontalier-geneve)$q$), 0 from public.blog_posts where slug = 'avenant-fiscal-40-frontalier-geneve'
union all
select 31 as n, 'avenant-fiscal-40-frontalier-geneve' as slug, 'content_fr' as col, 'fragment présent' as controle, (length(content_fr) - length(replace(content_fr, $q$rien ne change par rapport aux années précédentes.$q$, ''))) / length($q$rien ne change par rapport aux années précédentes.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'avenant-fiscal-40-frontalier-geneve'
union all
select 31, 'avenant-fiscal-40-frontalier-geneve', 'content_fr', 'lien déjà là : /blog/declaration-impots-frontalier-2026', (length(content_fr) - length(replace(content_fr, $q$](/blog/declaration-impots-frontalier-2026)$q$, ''))) / length($q$](/blog/declaration-impots-frontalier-2026)$q$), 0 from public.blog_posts where slug = 'avenant-fiscal-40-frontalier-geneve'
union all
select 32 as n, 'avenant-fiscal-40-frontalier-geneve' as slug, 'content_en' as col, 'fragment présent' as controle, (length(content_en) - length(replace(content_en, $q$nothing changes versus previous years.$q$, ''))) / length($q$nothing changes versus previous years.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'avenant-fiscal-40-frontalier-geneve'
union all
select 32, 'avenant-fiscal-40-frontalier-geneve', 'content_en', 'lien déjà là : /en/blog/declaration-impots-frontalier-2026', (length(content_en) - length(replace(content_en, $q$](/en/blog/declaration-impots-frontalier-2026)$q$, ''))) / length($q$](/en/blog/declaration-impots-frontalier-2026)$q$) + (length(content_en) - length(replace(content_en, $q$](/blog/declaration-impots-frontalier-2026)$q$, ''))) / length($q$](/blog/declaration-impots-frontalier-2026)$q$), 0 from public.blog_posts where slug = 'avenant-fiscal-40-frontalier-geneve'
union all
select 33 as n, 'declaration-impots-frontalier-2026' as slug, 'content_fr' as col, 'fragment présent' as controle, (length(content_fr) - length(replace(content_fr, $q$Tu es frontalier à Genève : ton salaire est imposé à la source en Suisse.$q$, ''))) / length($q$Tu es frontalier à Genève : ton salaire est imposé à la source en Suisse.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'declaration-impots-frontalier-2026'
union all
select 33, 'declaration-impots-frontalier-2026', 'content_fr', 'lien déjà là : /blog/permis-g-frontalier-geneve', (length(content_fr) - length(replace(content_fr, $q$](/blog/permis-g-frontalier-geneve)$q$, ''))) / length($q$](/blog/permis-g-frontalier-geneve)$q$), 0 from public.blog_posts where slug = 'declaration-impots-frontalier-2026'
union all
select 34 as n, 'declaration-impots-frontalier-2026' as slug, 'content_en' as col, 'fragment présent' as controle, (length(content_en) - length(replace(content_en, $q$You're a Geneva cross-border worker: your salary is taxed at source in Switzerland.$q$, ''))) / length($q$You're a Geneva cross-border worker: your salary is taxed at source in Switzerland.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'declaration-impots-frontalier-2026'
union all
select 34, 'declaration-impots-frontalier-2026', 'content_en', 'lien déjà là : /en/blog/permis-g-frontalier-geneve', (length(content_en) - length(replace(content_en, $q$](/en/blog/permis-g-frontalier-geneve)$q$, ''))) / length($q$](/en/blog/permis-g-frontalier-geneve)$q$) + (length(content_en) - length(replace(content_en, $q$](/blog/permis-g-frontalier-geneve)$q$, ''))) / length($q$](/blog/permis-g-frontalier-geneve)$q$), 0 from public.blog_posts where slug = 'declaration-impots-frontalier-2026'
union all
select 35 as n, 'teletravail-frontalier-geneve-regles-2026' as slug, 'content_fr' as col, 'fragment présent' as controle, (length(content_fr) - length(replace(content_fr, $q$C'est l'effet de l'avenant à la convention fiscale franco-suisse, en vigueur$q$, ''))) / length($q$C'est l'effet de l'avenant à la convention fiscale franco-suisse, en vigueur$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'teletravail-frontalier-geneve-regles-2026'
union all
select 35, 'teletravail-frontalier-geneve-regles-2026', 'content_fr', 'lien déjà là : /blog/avenant-fiscal-40-frontalier-geneve', (length(content_fr) - length(replace(content_fr, $q$](/blog/avenant-fiscal-40-frontalier-geneve)$q$, ''))) / length($q$](/blog/avenant-fiscal-40-frontalier-geneve)$q$), 0 from public.blog_posts where slug = 'teletravail-frontalier-geneve-regles-2026'
union all
select 36 as n, 'teletravail-frontalier-geneve-regles-2026' as slug, 'content_en' as col, 'fragment présent' as controle, (length(content_en) - length(replace(content_en, $q$This comes from the amendment to the Franco-Swiss tax treaty, in force$q$, ''))) / length($q$This comes from the amendment to the Franco-Swiss tax treaty, in force$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'teletravail-frontalier-geneve-regles-2026'
union all
select 36, 'teletravail-frontalier-geneve-regles-2026', 'content_en', 'lien déjà là : /en/blog/avenant-fiscal-40-frontalier-geneve', (length(content_en) - length(replace(content_en, $q$](/en/blog/avenant-fiscal-40-frontalier-geneve)$q$, ''))) / length($q$](/en/blog/avenant-fiscal-40-frontalier-geneve)$q$) + (length(content_en) - length(replace(content_en, $q$](/blog/avenant-fiscal-40-frontalier-geneve)$q$, ''))) / length($q$](/blog/avenant-fiscal-40-frontalier-geneve)$q$), 0 from public.blog_posts where slug = 'teletravail-frontalier-geneve-regles-2026'
union all
select 37 as n, 'ou-habiter-frontalier-suisse-villes-france-pas-cher' as slug, 'content_en' as col, 'fragment présent' as controle, (length(content_en) - length(replace(content_en, $q$Ideal for the first 6-24 months as a cross-border worker.$q$, ''))) / length($q$Ideal for the first 6-24 months as a cross-border worker.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
union all
select 37, 'ou-habiter-frontalier-suisse-villes-france-pas-cher', 'content_en', 'lien déjà là : /en/chambre-a-louer-geneve', (length(content_en) - length(replace(content_en, $q$](/en/chambre-a-louer-geneve)$q$, ''))) / length($q$](/en/chambre-a-louer-geneve)$q$) + (length(content_en) - length(replace(content_en, $q$](/chambre-a-louer-geneve)$q$, ''))) / length($q$](/chambre-a-louer-geneve)$q$), 0 from public.blog_posts where slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
union all
select 38 as n, 'ou-habiter-frontalier-suisse-villes-france-pas-cher' as slug, 'content_fr' as col, 'fragment présent' as controle, (length(content_fr) - length(replace(content_fr, $q$Idéal pour les 6-24 premiers mois en tant que frontalier.$q$, ''))) / length($q$Idéal pour les 6-24 premiers mois en tant que frontalier.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
union all
select 38, 'ou-habiter-frontalier-suisse-villes-france-pas-cher', 'content_fr', 'lien déjà là : /chambre-a-louer-geneve', (length(content_fr) - length(replace(content_fr, $q$](/chambre-a-louer-geneve)$q$, ''))) / length($q$](/chambre-a-louer-geneve)$q$), 0 from public.blog_posts where slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
union all
select 39 as n, 'cout-de-la-vie-suisse-france-frontalier-2026' as slug, 'content_en' as col, 'fragment présent' as controle, (length(content_en) - length(replace(content_en, $q$and how much actually stays in your pocket.$q$, ''))) / length($q$and how much actually stays in your pocket.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
union all
select 39, 'cout-de-la-vie-suisse-france-frontalier-2026', 'content_en', 'lien déjà là : /en/chambre-a-louer-geneve', (length(content_en) - length(replace(content_en, $q$](/en/chambre-a-louer-geneve)$q$, ''))) / length($q$](/en/chambre-a-louer-geneve)$q$) + (length(content_en) - length(replace(content_en, $q$](/chambre-a-louer-geneve)$q$, ''))) / length($q$](/chambre-a-louer-geneve)$q$), 0 from public.blog_posts where slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
union all
select 40 as n, 'salaire-suisse-net-frontalier-2026' as slug, 'content_fr' as col, 'fragment présent' as controle, (length(content_fr) - length(replace(content_fr, $q$une fois loyer, courses et déplacements pris en compte$q$, ''))) / length($q$une fois loyer, courses et déplacements pris en compte$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'salaire-suisse-net-frontalier-2026'
union all
select 40, 'salaire-suisse-net-frontalier-2026', 'content_fr', 'lien déjà là : /blog/cout-transport-frontalier-geneve-2026', (length(content_fr) - length(replace(content_fr, $q$](/blog/cout-transport-frontalier-geneve-2026)$q$, ''))) / length($q$](/blog/cout-transport-frontalier-geneve-2026)$q$), 0 from public.blog_posts where slug = 'salaire-suisse-net-frontalier-2026'
union all
select 41 as n, 'salaire-suisse-net-frontalier-2026' as slug, 'content_en' as col, 'fragment présent' as controle, (length(content_en) - length(replace(content_en, $q$once rent, groceries, and commute are factored in$q$, ''))) / length($q$once rent, groceries, and commute are factored in$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'salaire-suisse-net-frontalier-2026'
union all
select 41, 'salaire-suisse-net-frontalier-2026', 'content_en', 'lien déjà là : /en/blog/cout-transport-frontalier-geneve-2026', (length(content_en) - length(replace(content_en, $q$](/en/blog/cout-transport-frontalier-geneve-2026)$q$, ''))) / length($q$](/en/blog/cout-transport-frontalier-geneve-2026)$q$) + (length(content_en) - length(replace(content_en, $q$](/blog/cout-transport-frontalier-geneve-2026)$q$, ''))) / length($q$](/blog/cout-transport-frontalier-geneve-2026)$q$), 0 from public.blog_posts where slug = 'salaire-suisse-net-frontalier-2026'
union all
select 42 as n, 'ou-habiter-frontalier-suisse-villes-france-pas-cher' as slug, 'content_fr' as col, 'fragment présent' as controle, (length(content_fr) - length(replace(content_fr, $q$beaucoup plus simple qu'il y a 5 ans. À toi de jouer.$q$, ''))) / length($q$beaucoup plus simple qu'il y a 5 ans. À toi de jouer.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
union all
select 42, 'ou-habiter-frontalier-suisse-villes-france-pas-cher', 'content_fr', 'lien déjà là : /blog/demenager-geneve-frontalier-checklist', (length(content_fr) - length(replace(content_fr, $q$](/blog/demenager-geneve-frontalier-checklist)$q$, ''))) / length($q$](/blog/demenager-geneve-frontalier-checklist)$q$), 0 from public.blog_posts where slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
union all
select 43 as n, 'ou-habiter-frontalier-suisse-villes-france-pas-cher' as slug, 'content_en' as col, 'fragment présent' as controle, (length(content_en) - length(replace(content_en, $q$much easier than it was 5 years ago. Over to you.$q$, ''))) / length($q$much easier than it was 5 years ago. Over to you.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
union all
select 43, 'ou-habiter-frontalier-suisse-villes-france-pas-cher', 'content_en', 'lien déjà là : /en/blog/demenager-geneve-frontalier-checklist', (length(content_en) - length(replace(content_en, $q$](/en/blog/demenager-geneve-frontalier-checklist)$q$, ''))) / length($q$](/en/blog/demenager-geneve-frontalier-checklist)$q$) + (length(content_en) - length(replace(content_en, $q$](/blog/demenager-geneve-frontalier-checklist)$q$, ''))) / length($q$](/blog/demenager-geneve-frontalier-checklist)$q$), 0 from public.blog_posts where slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
union all
select 44 as n, 'ecole-internationale-geneve-frontalier-ou-habiter' as slug, 'content_fr' as col, 'fragment présent' as controle, (length(content_fr) - length(replace(content_fr, $q$et notre [comparatif où habiter côté France](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).$q$, ''))) / length($q$et notre [comparatif où habiter côté France](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
union all
select 44, 'ecole-internationale-geneve-frontalier-ou-habiter', 'content_fr', 'lien déjà là : /blog/assurance-sante-frontalier-lamal-cmu-budget', (length(content_fr) - length(replace(content_fr, $q$](/blog/assurance-sante-frontalier-lamal-cmu-budget)$q$, ''))) / length($q$](/blog/assurance-sante-frontalier-lamal-cmu-budget)$q$), 0 from public.blog_posts where slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
union all
select 45 as n, 'ecole-internationale-geneve-frontalier-ou-habiter' as slug, 'content_en' as col, 'fragment présent' as controle, (length(content_en) - length(replace(content_en, $q$and our [frontalier family allowances guide](/en/blog/allocations-familiales-frontalier-geneve-2026).$q$, ''))) / length($q$and our [frontalier family allowances guide](/en/blog/allocations-familiales-frontalier-geneve-2026).$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
union all
select 45, 'ecole-internationale-geneve-frontalier-ou-habiter', 'content_en', 'lien déjà là : /en/blog/assurance-sante-frontalier-lamal-cmu-budget', (length(content_en) - length(replace(content_en, $q$](/en/blog/assurance-sante-frontalier-lamal-cmu-budget)$q$, ''))) / length($q$](/en/blog/assurance-sante-frontalier-lamal-cmu-budget)$q$) + (length(content_en) - length(replace(content_en, $q$](/blog/assurance-sante-frontalier-lamal-cmu-budget)$q$, ''))) / length($q$](/blog/assurance-sante-frontalier-lamal-cmu-budget)$q$), 0 from public.blog_posts where slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
union all
select 46 as n, 'colocation-annemasse-ville-la-grand-ambilly' as slug, 'content_en' as col, 'fragment présent' as controle, (length(content_en) - length(replace(content_en, $q$# Colocation in Annemasse, Ville-la-Grand & Ambilly: Where & How to Find?

Finding colocation near Geneva is a hunt game. There are deals, traps, weird people, and a few gems. Here's the real guide based on what cross-border workers and young professionals actually do.
$q$, ''))) / length($q$# Colocation in Annemasse, Ville-la-Grand & Ambilly: Where & How to Find?

Finding colocation near Geneva is a hunt game. There are deals, traps, weird people, and a few gems. Here's the real guide based on what cross-border workers and young professionals actually do.
$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'colocation-annemasse-ville-la-grand-ambilly'
union all
select 47 as n, 'colocation-annemasse-ville-la-grand-ambilly' as slug, 'content_en' as col, 'fragment présent' as controle, (length(content_en) - length(replace(content_en, $q$**Leboncoin**: French classic. Many listings, but also pollution (scammers). Filter by location (Annemasse, Ville-la-Grand), price (900-1300 CHF), "furnished." Always check phone number: fake or weird number? Scam.$q$, ''))) / length($q$**Leboncoin**: French classic. Many listings, but also pollution (scammers). Filter by location (Annemasse, Ville-la-Grand), price (900-1300 CHF), "furnished." Always check phone number: fake or weird number? Scam.$q$) as valeur, 1 as attendu from public.blog_posts where slug = 'colocation-annemasse-ville-la-grand-ambilly'
union all
select 48 as n, 'colocation-annemasse-ville-la-grand-ambilly' as slug, 'meta_description_en' as col, 'valeur actuelle attendue' as controle, (coalesce(meta_description_en, 'NULL') = coalesce($q$Colocation Annemasse/Ville-la-Grand/Ambilly: best sites, zones, negotiation, costs, pitfalls to avoid.$q$, 'NULL'))::int as valeur, 1 as attendu from public.blog_posts where slug = 'colocation-annemasse-ville-la-grand-ambilly'
union all
select 49 as n, 'colocation-annemasse-ville-la-grand-ambilly' as slug, 'excerpt_en' as col, 'valeur actuelle attendue' as controle, (coalesce(excerpt_en, 'NULL') = coalesce($q$Looking for colocation near Geneva? Guide to best zones, where to find, how to negotiate, and real costs.$q$, 'NULL'))::int as valeur, 1 as attendu from public.blog_posts where slug = 'colocation-annemasse-ville-la-grand-ambilly'
union all
select 50 as n, 'assurance-sante-frontalier-lamal-cmu-budget' as slug, 'meta_description_en' as col, 'valeur actuelle attendue' as controle, (coalesce(meta_description_en, 'NULL') = coalesce(NULL, 'NULL'))::int as valeur, 1 as attendu from public.blog_posts where slug = 'assurance-sante-frontalier-lamal-cmu-budget'
union all
select 51 as n, 'cout-transport-frontalier-geneve-2026' as slug, 'meta_description_en' as col, 'valeur actuelle attendue' as controle, (coalesce(meta_description_en, 'NULL') = coalesce(NULL, 'NULL'))::int as valeur, 1 as attendu from public.blog_posts where slug = 'cout-transport-frontalier-geneve-2026'
) t order by n, controle;

-- 1. APPLICATION (une seule transaction ; toute anomalie annule l'ensemble)
BEGIN;

-- 1.a Garde md5 : chaque colonne doit être soit dans l'état relu le 08/10/2026 (on applique),
--     soit déjà dans l'état final attendu (rejeu : rien à faire). Tout autre état = arrêt.
DO $garde$
DECLARE r record; n int;
BEGIN
  FOR r IN SELECT * FROM (VALUES
    ('fiscalite-frontalier-geneve-impots-2026', 'content_fr', '4ccbe0affa7012d9df25cf234832feb3', '9c123c59a564d9c4cfea05ffe8027f08'),
    ('fiscalite-frontalier-geneve-impots-2026', 'content_en', '1a97441e3ea04715c9c719e4ddb7f364', '194bbd99bd146bc6464c96fc5cd9c644'),
    ('salaire-suisse-net-frontalier-2026', 'content_fr', '69141b90dd3f35437b5f47ee79438980', '17a5f6aa32df7f2ed803a31e9262b50f'),
    ('salaire-suisse-net-frontalier-2026', 'content_en', '6462beef4fa184b339bc8d6c42ee957b', 'ed5fc08fbfc0f6fa56befd809a49dadd'),
    ('teletravail-frontalier-geneve-regles-2026', 'content_fr', 'd809fb8bedf744b976cf5ab73d48fe19', '67546ecbf8af21f51e433f399ed75b1b'),
    ('teletravail-frontalier-geneve-regles-2026', 'content_en', '04a76609041ecab06a59ef4ffccf2256', '5946a52da4be1aab4f5d674f1c3febdd'),
    ('allocations-familiales-frontalier-geneve-2026', 'content_fr', 'c4425dae922b1505b71a9bf90eb67574', '5f9c63784b84b40fc91f5776c4a73d66'),
    ('allocations-familiales-frontalier-geneve-2026', 'content_en', '29dbb7a8f09d68b6d429a34885e6588a', '444fcf85bc785df766246394ef8b5b98'),
    ('permis-g-frontalier-geneve', 'content_fr', '72d686ce7ea811f5f1eca997e74c21e6', '0807a8cb4332ab86655458134c8b50ab'),
    ('permis-g-frontalier-geneve', 'content_en', 'ea898f4edeb91da762dc5613a7fd7964', '78c0bf9832bb85608926621522e60581'),
    ('avenant-fiscal-40-frontalier-geneve', 'content_fr', 'e806d060e25b6ab264ee0ee6c55e1bed', 'b23406bf525eb793dc8d934d6fc1cd65'),
    ('avenant-fiscal-40-frontalier-geneve', 'content_en', 'ea56709eff1a8f9a71fe2c633e2970ab', '4e4ae9e6365a90b787b2725c30f33e06'),
    ('declaration-impots-frontalier-2026', 'content_fr', '41ac71d695a434f53c3ed985b4aab4d1', '2330d67a207ec46a0ee58b0a62927d50'),
    ('declaration-impots-frontalier-2026', 'content_en', '39967a3a8730dce4ce817ceb67dbe669', 'b8a34a2c2056a6d44af5dcf56d33c1d5'),
    ('assurance-sante-frontalier-lamal-cmu-budget', 'content_fr', 'a05b4e358fc3b59f750e5326bba044e4', 'd08defea3e31ac8881544af9ee37c5da'),
    ('assurance-sante-frontalier-lamal-cmu-budget', 'content_en', '023f78e03be172a47575ec91e5cc42cb', '66d6b4da5f20bb60ee95e80e1002db78'),
    ('guide-ressources-frontalier-geneve', 'content_fr', '56efc4dd0807e6cac3b8d3a616da8e28', '49813a43e3ecb9967781a57d54a9ee89'),
    ('guide-ressources-frontalier-geneve', 'content_en', '14d815ffe5ae6c1e7c32317f5582caf7', '516f4c781412be2221d5b17b8c9e20f0'),
    ('ou-habiter-frontalier-suisse-villes-france-pas-cher', 'content_en', '7bd297b56cdb8934432bbc33137b20dc', 'ff3fc154bba80c44eaadb69a480f31fc'),
    ('ou-habiter-frontalier-suisse-villes-france-pas-cher', 'content_fr', '664d27c85892aac7696c64dd8b07afe4', 'e48068f1b054c1796cf38bee4f50bff2'),
    ('cout-de-la-vie-suisse-france-frontalier-2026', 'content_en', '0f61a7c05ad8a8c3d657c43a1dcf3afa', '829768a210d3ee4014e799c2701d2d13'),
    ('ecole-internationale-geneve-frontalier-ou-habiter', 'content_fr', '2ca2d144703012c1dbb92d9fc1d26819', '47d18950f216fa10e4ab6ab5ac563709'),
    ('ecole-internationale-geneve-frontalier-ou-habiter', 'content_en', 'f03e67a28450661bbf4f74ef9aea7fb9', 'fc30a43171bdd0d1cec7f8e73677ee80'),
    ('colocation-annemasse-ville-la-grand-ambilly', 'content_en', '36a49c9aaae0850e12346f712353ed4c', '280601f578cf888b09d5ebbfcb193a74'),
    ('colocation-annemasse-ville-la-grand-ambilly', 'meta_description_en', 'd1d6e0fb7a0c81e5ded371d99d71cb35', '0b3de3b9ed8c21a6eb8af7e424752e90'),
    ('colocation-annemasse-ville-la-grand-ambilly', 'excerpt_en', 'fb035a2c4eed7514a8fbec2f89ea0c12', '5f5c2e7dd1c07c05551bc860b748e2ab'),
    ('assurance-sante-frontalier-lamal-cmu-budget', 'meta_description_en', 'NULL', 'f12a2576d5e6d08d29895d15ae74e654'),
    ('cout-transport-frontalier-geneve-2026', 'meta_description_en', 'NULL', '6cd5004fefd633b6308c428b4b3d9d7f')
  ) AS v(slug, col, depart, attendu) LOOP
    IF NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = r.slug) THEN
      RAISE EXCEPTION 'Lot D : article introuvable %', r.slug;
    END IF;
    -- (EXECUTE ne positionne pas FOUND : on compte explicitement)
    EXECUTE format('SELECT count(*) FROM public.blog_posts WHERE slug = %L AND coalesce(md5(%I), ''NULL'') IN (%L, %L)', r.slug, r.col, r.depart, r.attendu) INTO n;
    IF n <> 1 THEN
      RAISE EXCEPTION 'Lot D : % / % a changé depuis la préparation du 08/10/2026 — ne rien forcer, relire et régénérer le SQL', r.slug, r.col;
    END IF;
  END LOOP;
END
$garde$;

-- 1.b Modifications : replace() ciblés (le reste du texte, espaces insécables comprises, n'est pas réécrit).
--     Chaque UPDATE ne part que de l'état relu (md5 de départ) : rejouable sans double insertion.
-- fiscalite-frontalier-geneve-impots-2026 · content_fr : lien /blog/guide-ressources-frontalier-geneve; lien /blog/permis-g-frontalier-geneve; lien /blog/avenant-fiscal-40-frontalier-geneve; lien /blog/declaration-impots-frontalier-2026
UPDATE public.blog_posts SET content_fr = replace(replace(replace(replace(content_fr, $q$et c'est souvent pertinent de se faire accompagner par un fiduciaire.$q$, $q$et c'est souvent pertinent de se faire accompagner par un fiduciaire. Les associations de frontaliers tiennent aussi des permanences : leurs coordonnées sont dans [le guide des ressources du frontalier de La Villa Coliving](/blog/guide-ressources-frontalier-geneve).$q$), $q$En tant que frontalier travaillant dans le canton de Genève, [ton imposition$q$, $q$En tant que frontalier travaillant dans le canton de Genève sous [permis G](/blog/permis-g-frontalier-geneve), [ton imposition$q$), $q$ton revenu, et d'éventuelles déductions.$q$, $q$ton revenu, et d'éventuelles déductions. Cet impôt à la source porte sur tout ton salaire tant que ton télétravail depuis la France ne dépasse pas 40 % de ton temps de travail annuel : la règle est détaillée dans [le décryptage La Villa de l'avenant fiscal](/blog/avenant-fiscal-40-frontalier-geneve).$q$), $q$La France calcule un impôt théorique sur l'ensemble de tes revenus.$q$, $q$La France calcule un impôt théorique sur l'ensemble de tes revenus. Formulaires, taux de change, dates limites : suis [le pas-à-pas 2026 de ta déclaration](/blog/declaration-impots-frontalier-2026).$q$)
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND coalesce(md5(content_fr), 'NULL') = '4ccbe0affa7012d9df25cf234832feb3'
  AND content_fr NOT LIKE $q$%](/blog/guide-ressources-frontalier-geneve)%$q$;

-- fiscalite-frontalier-geneve-impots-2026 · content_en : lien /en/blog/guide-ressources-frontalier-geneve; lien /en/blog/permis-g-frontalier-geneve; lien /en/blog/avenant-fiscal-40-frontalier-geneve; lien /en/blog/declaration-impots-frontalier-2026
UPDATE public.blog_posts SET content_en = replace(replace(replace(replace(content_en, $q$and it's often worth getting help from a fiduciary.$q$, $q$and it's often worth getting help from a fiduciary. Cross-border workers' associations also hold advice sessions; you'll find their details in [La Villa Coliving's cross-border resources guide](/en/blog/guide-ressources-frontalier-geneve).$q$), $q$As a cross-border worker in the canton of Geneva, [your taxation$q$, $q$As a cross-border worker in the canton of Geneva holding a [permis G](/en/blog/permis-g-frontalier-geneve), [your taxation$q$), $q$your income, and potential deductions.$q$, $q$your income, and potential deductions. This withholding covers your whole salary as long as your telework from France stays within 40% of your annual working time: the rule is explained in [La Villa's breakdown of the tax amendment](/en/blog/avenant-fiscal-40-frontalier-geneve).$q$), $q$France calculates a theoretical tax on all your income.$q$, $q$France calculates a theoretical tax on all your income. Forms, exchange rate, deadlines: follow [the 2026 step-by-step for your French return](/en/blog/declaration-impots-frontalier-2026).$q$)
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND coalesce(md5(content_en), 'NULL') = '1a97441e3ea04715c9c719e4ddb7f364'
  AND content_en NOT LIKE $q$%](/en/blog/guide-ressources-frontalier-geneve)%$q$;

-- salaire-suisse-net-frontalier-2026 · content_fr : lien /blog/guide-ressources-frontalier-geneve; lien /blog/cout-transport-frontalier-geneve-2026
UPDATE public.blog_posts SET content_fr = replace(replace(content_fr, $q$À vérifier dans ton cas précis sur le simulateur officiel de l'État de Genève (admin.ge.ch).$q$, $q$À vérifier dans ton cas précis sur le simulateur officiel de l'État de Genève (admin.ge.ch). Les associations de frontaliers font aussi des simulations personnalisées : on les a recensées sur [lavillacoliving.com/blog/guide-ressources-frontalier-geneve](/blog/guide-ressources-frontalier-geneve).$q$), $q$une fois loyer, courses et déplacements pris en compte$q$, $q$une fois loyer, courses et [trajets quotidiens](/blog/cout-transport-frontalier-geneve-2026) pris en compte$q$)
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND coalesce(md5(content_fr), 'NULL') = '69141b90dd3f35437b5f47ee79438980'
  AND content_fr NOT LIKE $q$%](/blog/guide-ressources-frontalier-geneve)%$q$;

-- salaire-suisse-net-frontalier-2026 · content_en : lien /en/blog/guide-ressources-frontalier-geneve; lien /en/blog/cout-transport-frontalier-geneve-2026
UPDATE public.blog_posts SET content_en = replace(replace(content_en, $q$Always cross-check on the official Geneva simulator (admin.ge.ch).$q$, $q$Always cross-check on the official Geneva simulator (admin.ge.ch). Cross-border workers' associations also run personalised simulations; we list them at [lavillacoliving.com/en/blog/guide-ressources-frontalier-geneve](/en/blog/guide-ressources-frontalier-geneve).$q$), $q$once rent, groceries, and commute are factored in$q$, $q$once rent, groceries, and [the daily commute](/en/blog/cout-transport-frontalier-geneve-2026) are factored in$q$)
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND coalesce(md5(content_en), 'NULL') = '6462beef4fa184b339bc8d6c42ee957b'
  AND content_en NOT LIKE $q$%](/en/blog/guide-ressources-frontalier-geneve)%$q$;

-- teletravail-frontalier-geneve-regles-2026 · content_fr : lien /blog/guide-ressources-frontalier-geneve; lien /blog/avenant-fiscal-40-frontalier-geneve
UPDATE public.blog_posts SET content_fr = replace(replace(content_fr, $q$est une bonne ressource à partager.$q$, $q$est une bonne ressource à partager. Pour le reste de tes démarches de frontalier (permis G, assurance maladie, impôts, chômage), garde sous la main [notre dossier complet](/blog/guide-ressources-frontalier-geneve).$q$), $q$C'est l'effet de l'avenant à la convention fiscale franco-suisse, en vigueur$q$, $q$C'est l'effet de l'[avenant à la convention fiscale franco-suisse](/blog/avenant-fiscal-40-frontalier-geneve), en vigueur$q$)
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND coalesce(md5(content_fr), 'NULL') = 'd809fb8bedf744b976cf5ab73d48fe19'
  AND content_fr NOT LIKE $q$%](/blog/guide-ressources-frontalier-geneve)%$q$;

-- teletravail-frontalier-geneve-regles-2026 · content_en : lien /en/blog/guide-ressources-frontalier-geneve; lien /en/blog/avenant-fiscal-40-frontalier-geneve
UPDATE public.blog_posts SET content_en = replace(replace(content_en, $q$report is a good resource to share.$q$, $q$report is a good resource to share. For the rest of your cross-border paperwork (permis G, health insurance, tax, unemployment), keep [our all-in-one guide](/en/blog/guide-ressources-frontalier-geneve) at hand.$q$), $q$This comes from the amendment to the Franco-Swiss tax treaty, in force$q$, $q$This comes from the [amendment to the Franco-Swiss tax treaty](/en/blog/avenant-fiscal-40-frontalier-geneve), in force$q$)
WHERE slug = 'teletravail-frontalier-geneve-regles-2026'
  AND coalesce(md5(content_en), 'NULL') = '04a76609041ecab06a59ef4ffccf2256'
  AND content_en NOT LIKE $q$%](/en/blog/guide-ressources-frontalier-geneve)%$q$;

-- allocations-familiales-frontalier-geneve-2026 · content_fr : lien /blog/guide-ressources-frontalier-geneve
UPDATE public.blog_posts SET content_fr = replace(content_fr, $q$la pièce manquante est presque toujours ce qui bloque.$q$, $q$la pièce manquante est presque toujours ce qui bloque. Pour les autres démarches de ton installation (permis G, assurance maladie, impôts), tout est réuni dans [le guide des ressources du frontalier à Genève](/blog/guide-ressources-frontalier-geneve).$q$)
WHERE slug = 'allocations-familiales-frontalier-geneve-2026'
  AND coalesce(md5(content_fr), 'NULL') = 'c4425dae922b1505b71a9bf90eb67574'
  AND content_fr NOT LIKE $q$%](/blog/guide-ressources-frontalier-geneve)%$q$;

-- allocations-familiales-frontalier-geneve-2026 · content_en : lien /en/blog/guide-ressources-frontalier-geneve
UPDATE public.blog_posts SET content_en = replace(content_en, $q$a missing document is almost always what holds a file up.$q$, $q$a missing document is almost always what holds a file up. For the rest of your move (permis G, health insurance, tax), everything is gathered in our [Geneva cross-border resources guide](/en/blog/guide-ressources-frontalier-geneve).$q$)
WHERE slug = 'allocations-familiales-frontalier-geneve-2026'
  AND coalesce(md5(content_en), 'NULL') = '29dbb7a8f09d68b6d429a34885e6588a'
  AND content_en NOT LIKE $q$%](/en/blog/guide-ressources-frontalier-geneve)%$q$;

-- permis-g-frontalier-geneve · content_fr : lien /blog/guide-ressources-frontalier-geneve; lien /blog/declaration-impots-frontalier-2026 + /blog/avenant-fiscal-40-frontalier-geneve
UPDATE public.blog_posts SET content_fr = replace(replace(content_fr, $q$Voici le mode d'emploi 2026, étape par étape.$q$, $q$Voici le mode d'emploi 2026, étape par étape. Pour les démarches qui vont avec (assurance maladie, impôts, transport, chômage), vois [le dossier ressources frontalier de La Villa](/blog/guide-ressources-frontalier-geneve).$q$), $q$le permis G encadre cette situation.$q$, $q$le permis G encadre cette situation. Côté impôts, ce statut veut dire impôt à la source à Genève, [déclaration de tes revenus en France chaque printemps](/blog/declaration-impots-frontalier-2026), et télétravail imposé en Suisse tant qu'il ne dépasse pas 40 % de ton temps de travail, selon [l'avenant franco-suisse](/blog/avenant-fiscal-40-frontalier-geneve).$q$)
WHERE slug = 'permis-g-frontalier-geneve'
  AND coalesce(md5(content_fr), 'NULL') = '72d686ce7ea811f5f1eca997e74c21e6'
  AND content_fr NOT LIKE $q$%](/blog/guide-ressources-frontalier-geneve)%$q$;

-- permis-g-frontalier-geneve · content_en : lien /en/blog/guide-ressources-frontalier-geneve; lien /en/blog/declaration-impots-frontalier-2026 + /en/blog/avenant-fiscal-40-frontalier-geneve
UPDATE public.blog_posts SET content_en = replace(replace(content_en, $q$Here's the 2026 step-by-step.$q$, $q$Here's the 2026 step-by-step. For the formalities that come with it (health insurance, tax, transport, unemployment), see [La Villa's resource guide for cross-border workers](/en/blog/guide-ressources-frontalier-geneve).$q$), $q$the permis G frames that setup.$q$, $q$the permis G frames that setup. On the tax side, that status means tax at source in Geneva, [declaring your income in France every spring](/en/blog/declaration-impots-frontalier-2026), and telework that stays taxed in Switzerland up to 40% of your working time, under [the Franco-Swiss amendment](/en/blog/avenant-fiscal-40-frontalier-geneve).$q$)
WHERE slug = 'permis-g-frontalier-geneve'
  AND coalesce(md5(content_en), 'NULL') = 'ea898f4edeb91da762dc5613a7fd7964'
  AND content_en NOT LIKE $q$%](/en/blog/guide-ressources-frontalier-geneve)%$q$;

-- avenant-fiscal-40-frontalier-geneve · content_fr : lien /blog/guide-ressources-frontalier-geneve; lien /blog/permis-g-frontalier-geneve; lien /blog/declaration-impots-frontalier-2026
UPDATE public.blog_posts SET content_fr = replace(replace(replace(content_fr, $q$fais-toi accompagner par un fiduciaire spécialisé en fiscalité transfrontalière.$q$, $q$fais-toi accompagner par un fiduciaire spécialisé en fiscalité transfrontalière. Les associations de frontaliers tiennent aussi des permanences, notamment pour la déclaration d'impôts : elles sont listées sur [lavillacoliving.com/blog/guide-ressources-frontalier-geneve](/blog/guide-ressources-frontalier-geneve).$q$), $q$Voici ce qui change concrètement pour ton imposition, expliqué sans jargon.$q$, $q$Voici ce qui change concrètement pour ton imposition, expliqué sans jargon. Si tu découvres le sujet, commence par [la fiche La Villa sur le permis G](/blog/permis-g-frontalier-geneve), le statut sur lequel tout repose.$q$), $q$rien ne change par rapport aux années précédentes.$q$, $q$rien ne change par rapport aux années précédentes. Pour remplir le 2047 sans erreur, suis [le pas-à-pas La Villa de la déclaration 2026](/blog/declaration-impots-frontalier-2026).$q$)
WHERE slug = 'avenant-fiscal-40-frontalier-geneve'
  AND coalesce(md5(content_fr), 'NULL') = 'e806d060e25b6ab264ee0ee6c55e1bed'
  AND content_fr NOT LIKE $q$%](/blog/guide-ressources-frontalier-geneve)%$q$;

-- avenant-fiscal-40-frontalier-geneve · content_en : lien /en/blog/guide-ressources-frontalier-geneve; lien /en/blog/permis-g-frontalier-geneve; lien /en/blog/declaration-impots-frontalier-2026
UPDATE public.blog_posts SET content_en = replace(replace(replace(content_en, $q$get help from a fiduciary specializing in cross-border taxation.$q$, $q$get help from a fiduciary specializing in cross-border taxation. Cross-border workers' associations also hold advice sessions, notably on tax returns; they are listed at [lavillacoliving.com/en/blog/guide-ressources-frontalier-geneve](/en/blog/guide-ressources-frontalier-geneve).$q$), $q$Here's what actually changes for your taxation, in plain language.$q$, $q$Here's what actually changes for your taxation, in plain language. New to the topic? Start with [La Villa's permis G explainer](/en/blog/permis-g-frontalier-geneve), the status everything else rests on.$q$), $q$nothing changes versus previous years.$q$, $q$nothing changes versus previous years. To fill in form 2047 without mistakes, follow [La Villa's 2026 tax return walkthrough](/en/blog/declaration-impots-frontalier-2026).$q$)
WHERE slug = 'avenant-fiscal-40-frontalier-geneve'
  AND coalesce(md5(content_en), 'NULL') = 'ea56709eff1a8f9a71fe2c633e2970ab'
  AND content_en NOT LIKE $q$%](/en/blog/guide-ressources-frontalier-geneve)%$q$;

-- declaration-impots-frontalier-2026 · content_fr : lien /blog/guide-ressources-frontalier-geneve; lien /blog/permis-g-frontalier-geneve
UPDATE public.blog_posts SET content_fr = replace(replace(content_fr, $q$voir notre [guide de la fiscalité frontalière](/blog/fiscalite-frontalier-geneve-impots-2026).$q$, $q$voir notre [guide de la fiscalité frontalière](/blog/fiscalite-frontalier-geneve-impots-2026). Et pour te faire aider, les permanences des associations de frontaliers sont recensées sur [lavillacoliving.com/blog/guide-ressources-frontalier-geneve](/blog/guide-ressources-frontalier-geneve).$q$), $q$Tu es frontalier à Genève : ton salaire est imposé à la source en Suisse.$q$, $q$Tu es frontalier à Genève, avec ton [autorisation frontalière](/blog/permis-g-frontalier-geneve) (le permis G) : ton salaire est imposé à la source en Suisse.$q$)
WHERE slug = 'declaration-impots-frontalier-2026'
  AND coalesce(md5(content_fr), 'NULL') = '41ac71d695a434f53c3ed985b4aab4d1'
  AND content_fr NOT LIKE $q$%](/blog/guide-ressources-frontalier-geneve)%$q$;

-- declaration-impots-frontalier-2026 · content_en : lien /en/blog/guide-ressources-frontalier-geneve; lien /en/blog/permis-g-frontalier-geneve
UPDATE public.blog_posts SET content_en = replace(replace(content_en, $q$see our [cross-border tax guide](/en/blog/fiscalite-frontalier-geneve-impots-2026).$q$, $q$see our [cross-border tax guide](/en/blog/fiscalite-frontalier-geneve-impots-2026). If you want help, the advice sessions run by cross-border workers' associations are listed at [lavillacoliving.com/en/blog/guide-ressources-frontalier-geneve](/en/blog/guide-ressources-frontalier-geneve).$q$), $q$You're a Geneva cross-border worker: your salary is taxed at source in Switzerland.$q$, $q$You're a Geneva cross-border worker holding a [commuter permit](/en/blog/permis-g-frontalier-geneve) (permis G): your salary is taxed at source in Switzerland.$q$)
WHERE slug = 'declaration-impots-frontalier-2026'
  AND coalesce(md5(content_en), 'NULL') = '39967a3a8730dce4ce817ceb67dbe669'
  AND content_en NOT LIKE $q$%](/en/blog/guide-ressources-frontalier-geneve)%$q$;

-- assurance-sante-frontalier-lamal-cmu-budget · content_fr : lien /blog/guide-ressources-frontalier-geneve
UPDATE public.blog_posts SET content_fr = replace(content_fr, $q$C'est gratuit et ça peut te faire économiser des milliers de francs par an.$q$, $q$C'est gratuit et ça peut te faire économiser des milliers de francs par an. Les associations de frontaliers en proposent aussi : retrouve-les dans [le guide La Villa des ressources du frontalier](/blog/guide-ressources-frontalier-geneve).$q$)
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND coalesce(md5(content_fr), 'NULL') = 'a05b4e358fc3b59f750e5326bba044e4'
  AND content_fr NOT LIKE $q$%](/blog/guide-ressources-frontalier-geneve)%$q$;

-- assurance-sante-frontalier-lamal-cmu-budget · content_en : lien /en/blog/guide-ressources-frontalier-geneve
UPDATE public.blog_posts SET content_en = replace(content_en, $q$It's free and can save you thousands of francs per year.$q$, $q$It's free and can save you thousands of francs per year. Cross-border workers' associations also run such simulations; find them in [the La Villa guide to cross-border resources](/en/blog/guide-ressources-frontalier-geneve).$q$)
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND coalesce(md5(content_en), 'NULL') = '023f78e03be172a47575ec91e5cc42cb'
  AND content_en NOT LIKE $q$%](/en/blog/guide-ressources-frontalier-geneve)%$q$;

-- guide-ressources-frontalier-geneve · content_fr : lien /blog/salaire-suisse-net-frontalier-2026; lien /blog/allocations-familiales-frontalier-geneve-2026
UPDATE public.blog_posts SET content_fr = replace(replace(content_fr, $q$qu'il faut comparer à tes charges (loyer, assurance, transport) quand tu calcules ton budget.$q$, $q$qu'il faut comparer à tes charges (loyer, assurance, transport) quand tu calcules ton budget. Les nets par niveau de salaire et par métier sont détaillés sur [lavillacoliving.com/blog/salaire-suisse-net-frontalier-2026](/blog/salaire-suisse-net-frontalier-2026).$q$), $q$fais la simulation à l'échelle du foyer, pas seulement individuelle.$q$, $q$fais la simulation à l'échelle du foyer, pas seulement individuelle. Avec des enfants, regarde aussi [le guide La Villa des allocations familiales](/blog/allocations-familiales-frontalier-geneve-2026).$q$)
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND coalesce(md5(content_fr), 'NULL') = '56efc4dd0807e6cac3b8d3a616da8e28'
  AND content_fr NOT LIKE $q$%](/blog/salaire-suisse-net-frontalier-2026)%$q$;

-- guide-ressources-frontalier-geneve · content_en : lien /en/blog/salaire-suisse-net-frontalier-2026; lien /en/blog/allocations-familiales-frontalier-geneve-2026
UPDATE public.blog_posts SET content_en = replace(replace(content_en, $q$that you must compare to your costs (rent, insurance, transport) when budgeting.$q$, $q$that you must compare to your costs (rent, insurance, transport) when budgeting. Net figures by salary level and job family are on [lavillacoliving.com/en/blog/salaire-suisse-net-frontalier-2026](/en/blog/salaire-suisse-net-frontalier-2026).$q$), $q$simulate at household level, not just individually.$q$, $q$simulate at household level, not just individually. With children, also see [La Villa's family allowances guide](/en/blog/allocations-familiales-frontalier-geneve-2026).$q$)
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND coalesce(md5(content_en), 'NULL') = '14d815ffe5ae6c1e7c32317f5582caf7'
  AND content_en NOT LIKE $q$%](/en/blog/salaire-suisse-net-frontalier-2026)%$q$;

-- ou-habiter-frontalier-suisse-villes-france-pas-cher · content_en : lien /en/chambre-a-louer-geneve; lien /en/blog/demenager-geneve-frontalier-checklist
UPDATE public.blog_posts SET content_en = replace(replace(content_en, $q$Ideal for the first 6-24 months as a cross-border worker.$q$, $q$Ideal for the first 6-24 months as a cross-border worker. Prices, conditions and our three houses are all on [La Villa's page of rooms to rent near Geneva](/en/chambre-a-louer-geneve).$q$), $q$much easier than it was 5 years ago. Over to you.$q$, $q$much easier than it was 5 years ago. Over to you. Once you've picked your town, [La Villa's moving checklist](/en/blog/demenager-geneve-frontalier-checklist) makes sure you don't miss a step.$q$)
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND coalesce(md5(content_en), 'NULL') = '7bd297b56cdb8934432bbc33137b20dc'
  AND content_en NOT LIKE $q$%](/en/chambre-a-louer-geneve)%$q$;

-- ou-habiter-frontalier-suisse-villes-france-pas-cher · content_fr : lien /chambre-a-louer-geneve; lien /blog/demenager-geneve-frontalier-checklist
UPDATE public.blog_posts SET content_fr = replace(replace(content_fr, $q$Idéal pour les 6-24 premiers mois en tant que frontalier.$q$, $q$Idéal pour les 6-24 premiers mois en tant que frontalier. Prix, conditions et maisons : tout est résumé sur [la page des chambres à louer de La Villa près de Genève](/chambre-a-louer-geneve).$q$), $q$beaucoup plus simple qu'il y a 5 ans. À toi de jouer.$q$, $q$beaucoup plus simple qu'il y a 5 ans. À toi de jouer. Une fois ta ville choisie, [la checklist déménagement de La Villa](/blog/demenager-geneve-frontalier-checklist) t'évite d'oublier une démarche.$q$)
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND coalesce(md5(content_fr), 'NULL') = '664d27c85892aac7696c64dd8b07afe4'
  AND content_fr NOT LIKE $q$%](/chambre-a-louer-geneve)%$q$;

-- cout-de-la-vie-suisse-france-frontalier-2026 · content_en : lien /en/chambre-a-louer-geneve
UPDATE public.blog_posts SET content_en = replace(content_en, $q$and how much actually stays in your pocket.$q$, $q$and how much actually stays in your pocket. On housing, the simplest way to capture that gap is our [furnished rooms to rent](/en/chambre-a-louer-geneve) on the French side, all inclusive, priced in CHF.$q$)
WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
  AND coalesce(md5(content_en), 'NULL') = '0f61a7c05ad8a8c3d657c43a1dcf3afa'
  AND content_en NOT LIKE $q$%](/en/chambre-a-louer-geneve)%$q$;

-- ecole-internationale-geneve-frontalier-ou-habiter · content_fr : lien /blog/assurance-sante-frontalier-lamal-cmu-budget
UPDATE public.blog_posts SET content_fr = replace(content_fr, $q$et notre [comparatif où habiter côté France](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).$q$, $q$et notre [comparatif où habiter côté France](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher). Pense aussi à l'assurance maladie, qui se calcule par personne en LAMal et sur les revenus du foyer en CMU : [le comparatif santé de La Villa](/blog/assurance-sante-frontalier-lamal-cmu-budget) chiffre l'écart selon ton salaire.$q$)
WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
  AND coalesce(md5(content_fr), 'NULL') = '2ca2d144703012c1dbb92d9fc1d26819'
  AND content_fr NOT LIKE $q$%](/blog/assurance-sante-frontalier-lamal-cmu-budget)%$q$;

-- ecole-internationale-geneve-frontalier-ou-habiter · content_en : lien /en/blog/assurance-sante-frontalier-lamal-cmu-budget
UPDATE public.blog_posts SET content_en = replace(content_en, $q$and our [frontalier family allowances guide](/en/blog/allocations-familiales-frontalier-geneve-2026).$q$, $q$and our [frontalier family allowances guide](/en/blog/allocations-familiales-frontalier-geneve-2026). Also factor in health insurance, billed per person under LAMal and on household income under CMU: [La Villa's health insurance comparison](/en/blog/assurance-sante-frontalier-lamal-cmu-budget) puts figures on the gap by salary.$q$)
WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
  AND coalesce(md5(content_en), 'NULL') = 'f03e67a28450661bbf4f74ef9aea7fb9'
  AND content_en NOT LIKE $q$%](/en/blog/assurance-sante-frontalier-lamal-cmu-budget)%$q$;

-- colocation-annemasse-ville-la-grand-ambilly · content_en : réécriture; réécriture
UPDATE public.blog_posts SET content_en = replace(replace(content_en, $q$# Colocation in Annemasse, Ville-la-Grand & Ambilly: Where & How to Find?

Finding colocation near Geneva is a hunt game. There are deals, traps, weird people, and a few gems. Here's the real guide based on what cross-border workers and young professionals actually do.
$q$, $q$Looking for a room in a flatshare in Annemasse, Ville-la-Grand or Ambilly, just across the border from Geneva? Good rooms go within days, scams are common, and most listings are in French. This guide sums up what cross-border workers and young professionals actually do to find shared housing here: where to search, which areas to target, how to negotiate and what a room really costs on top of the rent.
$q$), $q$**Leboncoin**: French classic. Many listings, but also pollution (scammers). Filter by location (Annemasse, Ville-la-Grand), price (900-1300 CHF), "furnished." Always check phone number: fake or weird number? Scam.$q$, $q$**Leboncoin**: France's largest classified-ads website, where locals sell everything from sofas to cars and where most private landlords advertise their rooms. You'll find the most listings there, but also the most scams. Search by town (Annemasse, Ville-la-Grand), set your budget and tick "meublé" (furnished). Always check the phone number: if it looks fake or odd, walk away.$q$)
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND coalesce(md5(content_en), 'NULL') = '36a49c9aaae0850e12346f712353ed4c'
  AND position($q$# Colocation in Annemasse, Ville-la-Grand & Ambilly: Where & How to Find?

Finding colocation near Geneva is a hunt game. There are deals, traps, weird people, and a few gems. Here's the real guide based on what cross-border workers and young professionals actually do.
$q$ in content_en) > 0;

-- colocation-annemasse-ville-la-grand-ambilly · meta_description_en : valeur complète
UPDATE public.blog_posts SET meta_description_en = $q$How to find a room in a flatshare in Annemasse, Ville-la-Grand or Ambilly: where to search, best areas, negotiation tips, real costs and scams to avoid.$q$
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND coalesce(md5(meta_description_en), 'NULL') = 'd1d6e0fb7a0c81e5ded371d99d71cb35'
  AND meta_description_en IS DISTINCT FROM $q$How to find a room in a flatshare in Annemasse, Ville-la-Grand or Ambilly: where to search, best areas, negotiation tips, real costs and scams to avoid.$q$;

-- colocation-annemasse-ville-la-grand-ambilly · excerpt_en : valeur complète
UPDATE public.blog_posts SET excerpt_en = $q$Looking for shared housing near Geneva, on the French side? The best areas, where to search, how to negotiate and what a room really costs.$q$
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND coalesce(md5(excerpt_en), 'NULL') = 'fb035a2c4eed7514a8fbec2f89ea0c12'
  AND excerpt_en IS DISTINCT FROM $q$Looking for shared housing near Geneva, on the French side? The best areas, where to search, how to negotiate and what a room really costs.$q$;

-- assurance-sante-frontalier-lamal-cmu-budget · meta_description_en : valeur complète
UPDATE public.blog_posts SET meta_description_en = $q$LAMal or CMU-PUMa? What each costs a Geneva cross-border worker by salary, the traps to avoid, and how your choice changes your housing budget.$q$
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND coalesce(md5(meta_description_en), 'NULL') = 'NULL'
  AND meta_description_en IS DISTINCT FROM $q$LAMal or CMU-PUMa? What each costs a Geneva cross-border worker by salary, the traps to avoid, and how your choice changes your housing budget.$q$;

-- cout-transport-frontalier-geneve-2026 · meta_description_en : valeur complète
UPDATE public.blog_posts SET meta_description_en = $q$Car, Léman Express, e-bike or carpooling: what commuting from France to Geneva really costs each month in 2026, with five scenarios compared over a year.$q$
WHERE slug = 'cout-transport-frontalier-geneve-2026'
  AND coalesce(md5(meta_description_en), 'NULL') = 'NULL'
  AND meta_description_en IS DISTINCT FROM $q$Car, Léman Express, e-bike or carpooling: what commuting from France to Geneva really costs each month in 2026, with five scenarios compared over a year.$q$;

-- 1.c Contrôle avant COMMIT : chaque colonne doit avoir exactement le md5 attendu, sinon tout est annulé.
DO $controle$
DECLARE r record; n int;
BEGIN
  FOR r IN SELECT * FROM (VALUES
    ('fiscalite-frontalier-geneve-impots-2026', 'content_fr', '9c123c59a564d9c4cfea05ffe8027f08'),
    ('fiscalite-frontalier-geneve-impots-2026', 'content_en', '194bbd99bd146bc6464c96fc5cd9c644'),
    ('salaire-suisse-net-frontalier-2026', 'content_fr', '17a5f6aa32df7f2ed803a31e9262b50f'),
    ('salaire-suisse-net-frontalier-2026', 'content_en', 'ed5fc08fbfc0f6fa56befd809a49dadd'),
    ('teletravail-frontalier-geneve-regles-2026', 'content_fr', '67546ecbf8af21f51e433f399ed75b1b'),
    ('teletravail-frontalier-geneve-regles-2026', 'content_en', '5946a52da4be1aab4f5d674f1c3febdd'),
    ('allocations-familiales-frontalier-geneve-2026', 'content_fr', '5f9c63784b84b40fc91f5776c4a73d66'),
    ('allocations-familiales-frontalier-geneve-2026', 'content_en', '444fcf85bc785df766246394ef8b5b98'),
    ('permis-g-frontalier-geneve', 'content_fr', '0807a8cb4332ab86655458134c8b50ab'),
    ('permis-g-frontalier-geneve', 'content_en', '78c0bf9832bb85608926621522e60581'),
    ('avenant-fiscal-40-frontalier-geneve', 'content_fr', 'b23406bf525eb793dc8d934d6fc1cd65'),
    ('avenant-fiscal-40-frontalier-geneve', 'content_en', '4e4ae9e6365a90b787b2725c30f33e06'),
    ('declaration-impots-frontalier-2026', 'content_fr', '2330d67a207ec46a0ee58b0a62927d50'),
    ('declaration-impots-frontalier-2026', 'content_en', 'b8a34a2c2056a6d44af5dcf56d33c1d5'),
    ('assurance-sante-frontalier-lamal-cmu-budget', 'content_fr', 'd08defea3e31ac8881544af9ee37c5da'),
    ('assurance-sante-frontalier-lamal-cmu-budget', 'content_en', '66d6b4da5f20bb60ee95e80e1002db78'),
    ('guide-ressources-frontalier-geneve', 'content_fr', '49813a43e3ecb9967781a57d54a9ee89'),
    ('guide-ressources-frontalier-geneve', 'content_en', '516f4c781412be2221d5b17b8c9e20f0'),
    ('ou-habiter-frontalier-suisse-villes-france-pas-cher', 'content_en', 'ff3fc154bba80c44eaadb69a480f31fc'),
    ('ou-habiter-frontalier-suisse-villes-france-pas-cher', 'content_fr', 'e48068f1b054c1796cf38bee4f50bff2'),
    ('cout-de-la-vie-suisse-france-frontalier-2026', 'content_en', '829768a210d3ee4014e799c2701d2d13'),
    ('ecole-internationale-geneve-frontalier-ou-habiter', 'content_fr', '47d18950f216fa10e4ab6ab5ac563709'),
    ('ecole-internationale-geneve-frontalier-ou-habiter', 'content_en', 'fc30a43171bdd0d1cec7f8e73677ee80'),
    ('colocation-annemasse-ville-la-grand-ambilly', 'content_en', '280601f578cf888b09d5ebbfcb193a74'),
    ('colocation-annemasse-ville-la-grand-ambilly', 'meta_description_en', '0b3de3b9ed8c21a6eb8af7e424752e90'),
    ('colocation-annemasse-ville-la-grand-ambilly', 'excerpt_en', '5f5c2e7dd1c07c05551bc860b748e2ab'),
    ('assurance-sante-frontalier-lamal-cmu-budget', 'meta_description_en', 'f12a2576d5e6d08d29895d15ae74e654'),
    ('cout-transport-frontalier-geneve-2026', 'meta_description_en', '6cd5004fefd633b6308c428b4b3d9d7f')
  ) AS v(slug, col, attendu) LOOP
    EXECUTE format('SELECT count(*) FROM public.blog_posts WHERE slug = %L AND coalesce(md5(%I), ''NULL'') = %L', r.slug, r.col, r.attendu) INTO n;
    IF n <> 1 THEN
      RAISE EXCEPTION 'Lot D : % / % n''a pas le contenu attendu après application — transaction annulée', r.slug, r.col;
    END IF;
  END LOOP;
END
$controle$;

COMMIT;

-- 2. RETOUR ARRIÈRE (commenté) (si besoin, sur GO de Jérôme) : rejoue les remplacements à l'envers, seulement si
--    la colonne est encore exactement dans l'état produit par ce script (md5 attendu).
--    Pour décommenter : retirer exactement « -- » ET l'espace qui suit en tête de chaque ligne. Les lignes vides
--    du texte d'origine (colocation-annemasse) sont écrites « -- » + espace : ne pas supprimer cet espace final.
-- BEGIN;
-- UPDATE public.blog_posts SET content_fr = replace(replace(replace(replace(content_fr, $q$La France calcule un impôt théorique sur l'ensemble de tes revenus. Formulaires, taux de change, dates limites : suis [le pas-à-pas 2026 de ta déclaration](/blog/declaration-impots-frontalier-2026).$q$, $q$La France calcule un impôt théorique sur l'ensemble de tes revenus.$q$), $q$ton revenu, et d'éventuelles déductions. Cet impôt à la source porte sur tout ton salaire tant que ton télétravail depuis la France ne dépasse pas 40 % de ton temps de travail annuel : la règle est détaillée dans [le décryptage La Villa de l'avenant fiscal](/blog/avenant-fiscal-40-frontalier-geneve).$q$, $q$ton revenu, et d'éventuelles déductions.$q$), $q$En tant que frontalier travaillant dans le canton de Genève sous [permis G](/blog/permis-g-frontalier-geneve), [ton imposition$q$, $q$En tant que frontalier travaillant dans le canton de Genève, [ton imposition$q$), $q$et c'est souvent pertinent de se faire accompagner par un fiduciaire. Les associations de frontaliers tiennent aussi des permanences : leurs coordonnées sont dans [le guide des ressources du frontalier de La Villa Coliving](/blog/guide-ressources-frontalier-geneve).$q$, $q$et c'est souvent pertinent de se faire accompagner par un fiduciaire.$q$) WHERE slug = 'fiscalite-frontalier-geneve-impots-2026' AND coalesce(md5(content_fr), 'NULL') = '9c123c59a564d9c4cfea05ffe8027f08';
-- UPDATE public.blog_posts SET content_en = replace(replace(replace(replace(content_en, $q$France calculates a theoretical tax on all your income. Forms, exchange rate, deadlines: follow [the 2026 step-by-step for your French return](/en/blog/declaration-impots-frontalier-2026).$q$, $q$France calculates a theoretical tax on all your income.$q$), $q$your income, and potential deductions. This withholding covers your whole salary as long as your telework from France stays within 40% of your annual working time: the rule is explained in [La Villa's breakdown of the tax amendment](/en/blog/avenant-fiscal-40-frontalier-geneve).$q$, $q$your income, and potential deductions.$q$), $q$As a cross-border worker in the canton of Geneva holding a [permis G](/en/blog/permis-g-frontalier-geneve), [your taxation$q$, $q$As a cross-border worker in the canton of Geneva, [your taxation$q$), $q$and it's often worth getting help from a fiduciary. Cross-border workers' associations also hold advice sessions; you'll find their details in [La Villa Coliving's cross-border resources guide](/en/blog/guide-ressources-frontalier-geneve).$q$, $q$and it's often worth getting help from a fiduciary.$q$) WHERE slug = 'fiscalite-frontalier-geneve-impots-2026' AND coalesce(md5(content_en), 'NULL') = '194bbd99bd146bc6464c96fc5cd9c644';
-- UPDATE public.blog_posts SET content_fr = replace(replace(content_fr, $q$une fois loyer, courses et [trajets quotidiens](/blog/cout-transport-frontalier-geneve-2026) pris en compte$q$, $q$une fois loyer, courses et déplacements pris en compte$q$), $q$À vérifier dans ton cas précis sur le simulateur officiel de l'État de Genève (admin.ge.ch). Les associations de frontaliers font aussi des simulations personnalisées : on les a recensées sur [lavillacoliving.com/blog/guide-ressources-frontalier-geneve](/blog/guide-ressources-frontalier-geneve).$q$, $q$À vérifier dans ton cas précis sur le simulateur officiel de l'État de Genève (admin.ge.ch).$q$) WHERE slug = 'salaire-suisse-net-frontalier-2026' AND coalesce(md5(content_fr), 'NULL') = '17a5f6aa32df7f2ed803a31e9262b50f';
-- UPDATE public.blog_posts SET content_en = replace(replace(content_en, $q$once rent, groceries, and [the daily commute](/en/blog/cout-transport-frontalier-geneve-2026) are factored in$q$, $q$once rent, groceries, and commute are factored in$q$), $q$Always cross-check on the official Geneva simulator (admin.ge.ch). Cross-border workers' associations also run personalised simulations; we list them at [lavillacoliving.com/en/blog/guide-ressources-frontalier-geneve](/en/blog/guide-ressources-frontalier-geneve).$q$, $q$Always cross-check on the official Geneva simulator (admin.ge.ch).$q$) WHERE slug = 'salaire-suisse-net-frontalier-2026' AND coalesce(md5(content_en), 'NULL') = 'ed5fc08fbfc0f6fa56befd809a49dadd';
-- UPDATE public.blog_posts SET content_fr = replace(replace(content_fr, $q$C'est l'effet de l'[avenant à la convention fiscale franco-suisse](/blog/avenant-fiscal-40-frontalier-geneve), en vigueur$q$, $q$C'est l'effet de l'avenant à la convention fiscale franco-suisse, en vigueur$q$), $q$est une bonne ressource à partager. Pour le reste de tes démarches de frontalier (permis G, assurance maladie, impôts, chômage), garde sous la main [notre dossier complet](/blog/guide-ressources-frontalier-geneve).$q$, $q$est une bonne ressource à partager.$q$) WHERE slug = 'teletravail-frontalier-geneve-regles-2026' AND coalesce(md5(content_fr), 'NULL') = '67546ecbf8af21f51e433f399ed75b1b';
-- UPDATE public.blog_posts SET content_en = replace(replace(content_en, $q$This comes from the [amendment to the Franco-Swiss tax treaty](/en/blog/avenant-fiscal-40-frontalier-geneve), in force$q$, $q$This comes from the amendment to the Franco-Swiss tax treaty, in force$q$), $q$report is a good resource to share. For the rest of your cross-border paperwork (permis G, health insurance, tax, unemployment), keep [our all-in-one guide](/en/blog/guide-ressources-frontalier-geneve) at hand.$q$, $q$report is a good resource to share.$q$) WHERE slug = 'teletravail-frontalier-geneve-regles-2026' AND coalesce(md5(content_en), 'NULL') = '5946a52da4be1aab4f5d674f1c3febdd';
-- UPDATE public.blog_posts SET content_fr = replace(content_fr, $q$la pièce manquante est presque toujours ce qui bloque. Pour les autres démarches de ton installation (permis G, assurance maladie, impôts), tout est réuni dans [le guide des ressources du frontalier à Genève](/blog/guide-ressources-frontalier-geneve).$q$, $q$la pièce manquante est presque toujours ce qui bloque.$q$) WHERE slug = 'allocations-familiales-frontalier-geneve-2026' AND coalesce(md5(content_fr), 'NULL') = '5f9c63784b84b40fc91f5776c4a73d66';
-- UPDATE public.blog_posts SET content_en = replace(content_en, $q$a missing document is almost always what holds a file up. For the rest of your move (permis G, health insurance, tax), everything is gathered in our [Geneva cross-border resources guide](/en/blog/guide-ressources-frontalier-geneve).$q$, $q$a missing document is almost always what holds a file up.$q$) WHERE slug = 'allocations-familiales-frontalier-geneve-2026' AND coalesce(md5(content_en), 'NULL') = '444fcf85bc785df766246394ef8b5b98';
-- UPDATE public.blog_posts SET content_fr = replace(replace(content_fr, $q$le permis G encadre cette situation. Côté impôts, ce statut veut dire impôt à la source à Genève, [déclaration de tes revenus en France chaque printemps](/blog/declaration-impots-frontalier-2026), et télétravail imposé en Suisse tant qu'il ne dépasse pas 40 % de ton temps de travail, selon [l'avenant franco-suisse](/blog/avenant-fiscal-40-frontalier-geneve).$q$, $q$le permis G encadre cette situation.$q$), $q$Voici le mode d'emploi 2026, étape par étape. Pour les démarches qui vont avec (assurance maladie, impôts, transport, chômage), vois [le dossier ressources frontalier de La Villa](/blog/guide-ressources-frontalier-geneve).$q$, $q$Voici le mode d'emploi 2026, étape par étape.$q$) WHERE slug = 'permis-g-frontalier-geneve' AND coalesce(md5(content_fr), 'NULL') = '0807a8cb4332ab86655458134c8b50ab';
-- UPDATE public.blog_posts SET content_en = replace(replace(content_en, $q$the permis G frames that setup. On the tax side, that status means tax at source in Geneva, [declaring your income in France every spring](/en/blog/declaration-impots-frontalier-2026), and telework that stays taxed in Switzerland up to 40% of your working time, under [the Franco-Swiss amendment](/en/blog/avenant-fiscal-40-frontalier-geneve).$q$, $q$the permis G frames that setup.$q$), $q$Here's the 2026 step-by-step. For the formalities that come with it (health insurance, tax, transport, unemployment), see [La Villa's resource guide for cross-border workers](/en/blog/guide-ressources-frontalier-geneve).$q$, $q$Here's the 2026 step-by-step.$q$) WHERE slug = 'permis-g-frontalier-geneve' AND coalesce(md5(content_en), 'NULL') = '78c0bf9832bb85608926621522e60581';
-- UPDATE public.blog_posts SET content_fr = replace(replace(replace(content_fr, $q$rien ne change par rapport aux années précédentes. Pour remplir le 2047 sans erreur, suis [le pas-à-pas La Villa de la déclaration 2026](/blog/declaration-impots-frontalier-2026).$q$, $q$rien ne change par rapport aux années précédentes.$q$), $q$Voici ce qui change concrètement pour ton imposition, expliqué sans jargon. Si tu découvres le sujet, commence par [la fiche La Villa sur le permis G](/blog/permis-g-frontalier-geneve), le statut sur lequel tout repose.$q$, $q$Voici ce qui change concrètement pour ton imposition, expliqué sans jargon.$q$), $q$fais-toi accompagner par un fiduciaire spécialisé en fiscalité transfrontalière. Les associations de frontaliers tiennent aussi des permanences, notamment pour la déclaration d'impôts : elles sont listées sur [lavillacoliving.com/blog/guide-ressources-frontalier-geneve](/blog/guide-ressources-frontalier-geneve).$q$, $q$fais-toi accompagner par un fiduciaire spécialisé en fiscalité transfrontalière.$q$) WHERE slug = 'avenant-fiscal-40-frontalier-geneve' AND coalesce(md5(content_fr), 'NULL') = 'b23406bf525eb793dc8d934d6fc1cd65';
-- UPDATE public.blog_posts SET content_en = replace(replace(replace(content_en, $q$nothing changes versus previous years. To fill in form 2047 without mistakes, follow [La Villa's 2026 tax return walkthrough](/en/blog/declaration-impots-frontalier-2026).$q$, $q$nothing changes versus previous years.$q$), $q$Here's what actually changes for your taxation, in plain language. New to the topic? Start with [La Villa's permis G explainer](/en/blog/permis-g-frontalier-geneve), the status everything else rests on.$q$, $q$Here's what actually changes for your taxation, in plain language.$q$), $q$get help from a fiduciary specializing in cross-border taxation. Cross-border workers' associations also hold advice sessions, notably on tax returns; they are listed at [lavillacoliving.com/en/blog/guide-ressources-frontalier-geneve](/en/blog/guide-ressources-frontalier-geneve).$q$, $q$get help from a fiduciary specializing in cross-border taxation.$q$) WHERE slug = 'avenant-fiscal-40-frontalier-geneve' AND coalesce(md5(content_en), 'NULL') = '4e4ae9e6365a90b787b2725c30f33e06';
-- UPDATE public.blog_posts SET content_fr = replace(replace(content_fr, $q$Tu es frontalier à Genève, avec ton [autorisation frontalière](/blog/permis-g-frontalier-geneve) (le permis G) : ton salaire est imposé à la source en Suisse.$q$, $q$Tu es frontalier à Genève : ton salaire est imposé à la source en Suisse.$q$), $q$voir notre [guide de la fiscalité frontalière](/blog/fiscalite-frontalier-geneve-impots-2026). Et pour te faire aider, les permanences des associations de frontaliers sont recensées sur [lavillacoliving.com/blog/guide-ressources-frontalier-geneve](/blog/guide-ressources-frontalier-geneve).$q$, $q$voir notre [guide de la fiscalité frontalière](/blog/fiscalite-frontalier-geneve-impots-2026).$q$) WHERE slug = 'declaration-impots-frontalier-2026' AND coalesce(md5(content_fr), 'NULL') = '2330d67a207ec46a0ee58b0a62927d50';
-- UPDATE public.blog_posts SET content_en = replace(replace(content_en, $q$You're a Geneva cross-border worker holding a [commuter permit](/en/blog/permis-g-frontalier-geneve) (permis G): your salary is taxed at source in Switzerland.$q$, $q$You're a Geneva cross-border worker: your salary is taxed at source in Switzerland.$q$), $q$see our [cross-border tax guide](/en/blog/fiscalite-frontalier-geneve-impots-2026). If you want help, the advice sessions run by cross-border workers' associations are listed at [lavillacoliving.com/en/blog/guide-ressources-frontalier-geneve](/en/blog/guide-ressources-frontalier-geneve).$q$, $q$see our [cross-border tax guide](/en/blog/fiscalite-frontalier-geneve-impots-2026).$q$) WHERE slug = 'declaration-impots-frontalier-2026' AND coalesce(md5(content_en), 'NULL') = 'b8a34a2c2056a6d44af5dcf56d33c1d5';
-- UPDATE public.blog_posts SET content_fr = replace(content_fr, $q$C'est gratuit et ça peut te faire économiser des milliers de francs par an. Les associations de frontaliers en proposent aussi : retrouve-les dans [le guide La Villa des ressources du frontalier](/blog/guide-ressources-frontalier-geneve).$q$, $q$C'est gratuit et ça peut te faire économiser des milliers de francs par an.$q$) WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget' AND coalesce(md5(content_fr), 'NULL') = 'd08defea3e31ac8881544af9ee37c5da';
-- UPDATE public.blog_posts SET content_en = replace(content_en, $q$It's free and can save you thousands of francs per year. Cross-border workers' associations also run such simulations; find them in [the La Villa guide to cross-border resources](/en/blog/guide-ressources-frontalier-geneve).$q$, $q$It's free and can save you thousands of francs per year.$q$) WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget' AND coalesce(md5(content_en), 'NULL') = '66d6b4da5f20bb60ee95e80e1002db78';
-- UPDATE public.blog_posts SET content_fr = replace(replace(content_fr, $q$fais la simulation à l'échelle du foyer, pas seulement individuelle. Avec des enfants, regarde aussi [le guide La Villa des allocations familiales](/blog/allocations-familiales-frontalier-geneve-2026).$q$, $q$fais la simulation à l'échelle du foyer, pas seulement individuelle.$q$), $q$qu'il faut comparer à tes charges (loyer, assurance, transport) quand tu calcules ton budget. Les nets par niveau de salaire et par métier sont détaillés sur [lavillacoliving.com/blog/salaire-suisse-net-frontalier-2026](/blog/salaire-suisse-net-frontalier-2026).$q$, $q$qu'il faut comparer à tes charges (loyer, assurance, transport) quand tu calcules ton budget.$q$) WHERE slug = 'guide-ressources-frontalier-geneve' AND coalesce(md5(content_fr), 'NULL') = '49813a43e3ecb9967781a57d54a9ee89';
-- UPDATE public.blog_posts SET content_en = replace(replace(content_en, $q$simulate at household level, not just individually. With children, also see [La Villa's family allowances guide](/en/blog/allocations-familiales-frontalier-geneve-2026).$q$, $q$simulate at household level, not just individually.$q$), $q$that you must compare to your costs (rent, insurance, transport) when budgeting. Net figures by salary level and job family are on [lavillacoliving.com/en/blog/salaire-suisse-net-frontalier-2026](/en/blog/salaire-suisse-net-frontalier-2026).$q$, $q$that you must compare to your costs (rent, insurance, transport) when budgeting.$q$) WHERE slug = 'guide-ressources-frontalier-geneve' AND coalesce(md5(content_en), 'NULL') = '516f4c781412be2221d5b17b8c9e20f0';
-- UPDATE public.blog_posts SET content_en = replace(replace(content_en, $q$much easier than it was 5 years ago. Over to you. Once you've picked your town, [La Villa's moving checklist](/en/blog/demenager-geneve-frontalier-checklist) makes sure you don't miss a step.$q$, $q$much easier than it was 5 years ago. Over to you.$q$), $q$Ideal for the first 6-24 months as a cross-border worker. Prices, conditions and our three houses are all on [La Villa's page of rooms to rent near Geneva](/en/chambre-a-louer-geneve).$q$, $q$Ideal for the first 6-24 months as a cross-border worker.$q$) WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher' AND coalesce(md5(content_en), 'NULL') = 'ff3fc154bba80c44eaadb69a480f31fc';
-- UPDATE public.blog_posts SET content_fr = replace(replace(content_fr, $q$beaucoup plus simple qu'il y a 5 ans. À toi de jouer. Une fois ta ville choisie, [la checklist déménagement de La Villa](/blog/demenager-geneve-frontalier-checklist) t'évite d'oublier une démarche.$q$, $q$beaucoup plus simple qu'il y a 5 ans. À toi de jouer.$q$), $q$Idéal pour les 6-24 premiers mois en tant que frontalier. Prix, conditions et maisons : tout est résumé sur [la page des chambres à louer de La Villa près de Genève](/chambre-a-louer-geneve).$q$, $q$Idéal pour les 6-24 premiers mois en tant que frontalier.$q$) WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher' AND coalesce(md5(content_fr), 'NULL') = 'e48068f1b054c1796cf38bee4f50bff2';
-- UPDATE public.blog_posts SET content_en = replace(content_en, $q$and how much actually stays in your pocket. On housing, the simplest way to capture that gap is our [furnished rooms to rent](/en/chambre-a-louer-geneve) on the French side, all inclusive, priced in CHF.$q$, $q$and how much actually stays in your pocket.$q$) WHERE slug = 'cout-de-la-vie-suisse-france-frontalier-2026' AND coalesce(md5(content_en), 'NULL') = '829768a210d3ee4014e799c2701d2d13';
-- UPDATE public.blog_posts SET content_fr = replace(content_fr, $q$et notre [comparatif où habiter côté France](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher). Pense aussi à l'assurance maladie, qui se calcule par personne en LAMal et sur les revenus du foyer en CMU : [le comparatif santé de La Villa](/blog/assurance-sante-frontalier-lamal-cmu-budget) chiffre l'écart selon ton salaire.$q$, $q$et notre [comparatif où habiter côté France](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher).$q$) WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter' AND coalesce(md5(content_fr), 'NULL') = '47d18950f216fa10e4ab6ab5ac563709';
-- UPDATE public.blog_posts SET content_en = replace(content_en, $q$and our [frontalier family allowances guide](/en/blog/allocations-familiales-frontalier-geneve-2026). Also factor in health insurance, billed per person under LAMal and on household income under CMU: [La Villa's health insurance comparison](/en/blog/assurance-sante-frontalier-lamal-cmu-budget) puts figures on the gap by salary.$q$, $q$and our [frontalier family allowances guide](/en/blog/allocations-familiales-frontalier-geneve-2026).$q$) WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter' AND coalesce(md5(content_en), 'NULL') = 'fc30a43171bdd0d1cec7f8e73677ee80';
-- UPDATE public.blog_posts SET content_en = replace(replace(content_en, $q$**Leboncoin**: France's largest classified-ads website, where locals sell everything from sofas to cars and where most private landlords advertise their rooms. You'll find the most listings there, but also the most scams. Search by town (Annemasse, Ville-la-Grand), set your budget and tick "meublé" (furnished). Always check the phone number: if it looks fake or odd, walk away.$q$, $q$**Leboncoin**: French classic. Many listings, but also pollution (scammers). Filter by location (Annemasse, Ville-la-Grand), price (900-1300 CHF), "furnished." Always check phone number: fake or weird number? Scam.$q$), $q$Looking for a room in a flatshare in Annemasse, Ville-la-Grand or Ambilly, just across the border from Geneva? Good rooms go within days, scams are common, and most listings are in French. This guide sums up what cross-border workers and young professionals actually do to find shared housing here: where to search, which areas to target, how to negotiate and what a room really costs on top of the rent.
-- $q$, $q$# Colocation in Annemasse, Ville-la-Grand & Ambilly: Where & How to Find?
-- 
-- Finding colocation near Geneva is a hunt game. There are deals, traps, weird people, and a few gems. Here's the real guide based on what cross-border workers and young professionals actually do.
-- $q$) WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly' AND coalesce(md5(content_en), 'NULL') = '280601f578cf888b09d5ebbfcb193a74';
-- UPDATE public.blog_posts SET meta_description_en = $q$Colocation Annemasse/Ville-la-Grand/Ambilly: best sites, zones, negotiation, costs, pitfalls to avoid.$q$ WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly' AND coalesce(md5(meta_description_en), 'NULL') = '0b3de3b9ed8c21a6eb8af7e424752e90';
-- UPDATE public.blog_posts SET excerpt_en = $q$Looking for colocation near Geneva? Guide to best zones, where to find, how to negotiate, and real costs.$q$ WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly' AND coalesce(md5(excerpt_en), 'NULL') = '5f5c2e7dd1c07c05551bc860b748e2ab';
-- UPDATE public.blog_posts SET meta_description_en = NULL WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget' AND coalesce(md5(meta_description_en), 'NULL') = 'f12a2576d5e6d08d29895d15ae74e654';
-- UPDATE public.blog_posts SET meta_description_en = NULL WHERE slug = 'cout-transport-frontalier-geneve-2026' AND coalesce(md5(meta_description_en), 'NULL') = '6cd5004fefd633b6308c428b4b3d9d7f';
-- COMMIT;

-- 3. VÉRIFICATION FINALE (lecture seule, après COMMIT) : toutes les lignes doivent sortir ok = true.
select slug, col, controle, ok from (
select 'fiscalite-frontalier-geneve-impots-2026' as slug, 'content_fr' as col, 'md5 attendu' as controle, (coalesce(md5(content_fr), 'NULL') = '9c123c59a564d9c4cfea05ffe8027f08') as ok from public.blog_posts where slug = 'fiscalite-frontalier-geneve-impots-2026'
union all
select 'fiscalite-frontalier-geneve-impots-2026', 'content_fr', 'espaces insécables = 5', (length(content_fr) - length(replace(content_fr, chr(160), '')) = 5) from public.blog_posts where slug = 'fiscalite-frontalier-geneve-impots-2026'
union all
select 'fiscalite-frontalier-geneve-impots-2026' as slug, 'content_en' as col, 'md5 attendu' as controle, (coalesce(md5(content_en), 'NULL') = '194bbd99bd146bc6464c96fc5cd9c644') as ok from public.blog_posts where slug = 'fiscalite-frontalier-geneve-impots-2026'
union all
select 'fiscalite-frontalier-geneve-impots-2026', 'content_en', 'espaces insécables = 0', (length(content_en) - length(replace(content_en, chr(160), '')) = 0) from public.blog_posts where slug = 'fiscalite-frontalier-geneve-impots-2026'
union all
select 'salaire-suisse-net-frontalier-2026' as slug, 'content_fr' as col, 'md5 attendu' as controle, (coalesce(md5(content_fr), 'NULL') = '17a5f6aa32df7f2ed803a31e9262b50f') as ok from public.blog_posts where slug = 'salaire-suisse-net-frontalier-2026'
union all
select 'salaire-suisse-net-frontalier-2026', 'content_fr', 'espaces insécables = 2', (length(content_fr) - length(replace(content_fr, chr(160), '')) = 2) from public.blog_posts where slug = 'salaire-suisse-net-frontalier-2026'
union all
select 'salaire-suisse-net-frontalier-2026' as slug, 'content_en' as col, 'md5 attendu' as controle, (coalesce(md5(content_en), 'NULL') = 'ed5fc08fbfc0f6fa56befd809a49dadd') as ok from public.blog_posts where slug = 'salaire-suisse-net-frontalier-2026'
union all
select 'salaire-suisse-net-frontalier-2026', 'content_en', 'espaces insécables = 0', (length(content_en) - length(replace(content_en, chr(160), '')) = 0) from public.blog_posts where slug = 'salaire-suisse-net-frontalier-2026'
union all
select 'teletravail-frontalier-geneve-regles-2026' as slug, 'content_fr' as col, 'md5 attendu' as controle, (coalesce(md5(content_fr), 'NULL') = '67546ecbf8af21f51e433f399ed75b1b') as ok from public.blog_posts where slug = 'teletravail-frontalier-geneve-regles-2026'
union all
select 'teletravail-frontalier-geneve-regles-2026', 'content_fr', 'espaces insécables = 1', (length(content_fr) - length(replace(content_fr, chr(160), '')) = 1) from public.blog_posts where slug = 'teletravail-frontalier-geneve-regles-2026'
union all
select 'teletravail-frontalier-geneve-regles-2026' as slug, 'content_en' as col, 'md5 attendu' as controle, (coalesce(md5(content_en), 'NULL') = '5946a52da4be1aab4f5d674f1c3febdd') as ok from public.blog_posts where slug = 'teletravail-frontalier-geneve-regles-2026'
union all
select 'teletravail-frontalier-geneve-regles-2026', 'content_en', 'espaces insécables = 0', (length(content_en) - length(replace(content_en, chr(160), '')) = 0) from public.blog_posts where slug = 'teletravail-frontalier-geneve-regles-2026'
union all
select 'allocations-familiales-frontalier-geneve-2026' as slug, 'content_fr' as col, 'md5 attendu' as controle, (coalesce(md5(content_fr), 'NULL') = '5f9c63784b84b40fc91f5776c4a73d66') as ok from public.blog_posts where slug = 'allocations-familiales-frontalier-geneve-2026'
union all
select 'allocations-familiales-frontalier-geneve-2026', 'content_fr', 'espaces insécables = 1', (length(content_fr) - length(replace(content_fr, chr(160), '')) = 1) from public.blog_posts where slug = 'allocations-familiales-frontalier-geneve-2026'
union all
select 'allocations-familiales-frontalier-geneve-2026' as slug, 'content_en' as col, 'md5 attendu' as controle, (coalesce(md5(content_en), 'NULL') = '444fcf85bc785df766246394ef8b5b98') as ok from public.blog_posts where slug = 'allocations-familiales-frontalier-geneve-2026'
union all
select 'allocations-familiales-frontalier-geneve-2026', 'content_en', 'espaces insécables = 0', (length(content_en) - length(replace(content_en, chr(160), '')) = 0) from public.blog_posts where slug = 'allocations-familiales-frontalier-geneve-2026'
union all
select 'permis-g-frontalier-geneve' as slug, 'content_fr' as col, 'md5 attendu' as controle, (coalesce(md5(content_fr), 'NULL') = '0807a8cb4332ab86655458134c8b50ab') as ok from public.blog_posts where slug = 'permis-g-frontalier-geneve'
union all
select 'permis-g-frontalier-geneve', 'content_fr', 'espaces insécables = 1', (length(content_fr) - length(replace(content_fr, chr(160), '')) = 1) from public.blog_posts where slug = 'permis-g-frontalier-geneve'
union all
select 'permis-g-frontalier-geneve' as slug, 'content_en' as col, 'md5 attendu' as controle, (coalesce(md5(content_en), 'NULL') = '78c0bf9832bb85608926621522e60581') as ok from public.blog_posts where slug = 'permis-g-frontalier-geneve'
union all
select 'permis-g-frontalier-geneve', 'content_en', 'espaces insécables = 0', (length(content_en) - length(replace(content_en, chr(160), '')) = 0) from public.blog_posts where slug = 'permis-g-frontalier-geneve'
union all
select 'avenant-fiscal-40-frontalier-geneve' as slug, 'content_fr' as col, 'md5 attendu' as controle, (coalesce(md5(content_fr), 'NULL') = 'b23406bf525eb793dc8d934d6fc1cd65') as ok from public.blog_posts where slug = 'avenant-fiscal-40-frontalier-geneve'
union all
select 'avenant-fiscal-40-frontalier-geneve', 'content_fr', 'espaces insécables = 1', (length(content_fr) - length(replace(content_fr, chr(160), '')) = 1) from public.blog_posts where slug = 'avenant-fiscal-40-frontalier-geneve'
union all
select 'avenant-fiscal-40-frontalier-geneve' as slug, 'content_en' as col, 'md5 attendu' as controle, (coalesce(md5(content_en), 'NULL') = '4e4ae9e6365a90b787b2725c30f33e06') as ok from public.blog_posts where slug = 'avenant-fiscal-40-frontalier-geneve'
union all
select 'avenant-fiscal-40-frontalier-geneve', 'content_en', 'espaces insécables = 0', (length(content_en) - length(replace(content_en, chr(160), '')) = 0) from public.blog_posts where slug = 'avenant-fiscal-40-frontalier-geneve'
union all
select 'declaration-impots-frontalier-2026' as slug, 'content_fr' as col, 'md5 attendu' as controle, (coalesce(md5(content_fr), 'NULL') = '2330d67a207ec46a0ee58b0a62927d50') as ok from public.blog_posts where slug = 'declaration-impots-frontalier-2026'
union all
select 'declaration-impots-frontalier-2026', 'content_fr', 'espaces insécables = 1', (length(content_fr) - length(replace(content_fr, chr(160), '')) = 1) from public.blog_posts where slug = 'declaration-impots-frontalier-2026'
union all
select 'declaration-impots-frontalier-2026' as slug, 'content_en' as col, 'md5 attendu' as controle, (coalesce(md5(content_en), 'NULL') = 'b8a34a2c2056a6d44af5dcf56d33c1d5') as ok from public.blog_posts where slug = 'declaration-impots-frontalier-2026'
union all
select 'declaration-impots-frontalier-2026', 'content_en', 'espaces insécables = 0', (length(content_en) - length(replace(content_en, chr(160), '')) = 0) from public.blog_posts where slug = 'declaration-impots-frontalier-2026'
union all
select 'assurance-sante-frontalier-lamal-cmu-budget' as slug, 'content_fr' as col, 'md5 attendu' as controle, (coalesce(md5(content_fr), 'NULL') = 'd08defea3e31ac8881544af9ee37c5da') as ok from public.blog_posts where slug = 'assurance-sante-frontalier-lamal-cmu-budget'
union all
select 'assurance-sante-frontalier-lamal-cmu-budget', 'content_fr', 'espaces insécables = 5', (length(content_fr) - length(replace(content_fr, chr(160), '')) = 5) from public.blog_posts where slug = 'assurance-sante-frontalier-lamal-cmu-budget'
union all
select 'assurance-sante-frontalier-lamal-cmu-budget' as slug, 'content_en' as col, 'md5 attendu' as controle, (coalesce(md5(content_en), 'NULL') = '66d6b4da5f20bb60ee95e80e1002db78') as ok from public.blog_posts where slug = 'assurance-sante-frontalier-lamal-cmu-budget'
union all
select 'assurance-sante-frontalier-lamal-cmu-budget', 'content_en', 'espaces insécables = 0', (length(content_en) - length(replace(content_en, chr(160), '')) = 0) from public.blog_posts where slug = 'assurance-sante-frontalier-lamal-cmu-budget'
union all
select 'guide-ressources-frontalier-geneve' as slug, 'content_fr' as col, 'md5 attendu' as controle, (coalesce(md5(content_fr), 'NULL') = '49813a43e3ecb9967781a57d54a9ee89') as ok from public.blog_posts where slug = 'guide-ressources-frontalier-geneve'
union all
select 'guide-ressources-frontalier-geneve', 'content_fr', 'espaces insécables = 3', (length(content_fr) - length(replace(content_fr, chr(160), '')) = 3) from public.blog_posts where slug = 'guide-ressources-frontalier-geneve'
union all
select 'guide-ressources-frontalier-geneve' as slug, 'content_en' as col, 'md5 attendu' as controle, (coalesce(md5(content_en), 'NULL') = '516f4c781412be2221d5b17b8c9e20f0') as ok from public.blog_posts where slug = 'guide-ressources-frontalier-geneve'
union all
select 'guide-ressources-frontalier-geneve', 'content_en', 'espaces insécables = 0', (length(content_en) - length(replace(content_en, chr(160), '')) = 0) from public.blog_posts where slug = 'guide-ressources-frontalier-geneve'
union all
select 'ou-habiter-frontalier-suisse-villes-france-pas-cher' as slug, 'content_en' as col, 'md5 attendu' as controle, (coalesce(md5(content_en), 'NULL') = 'ff3fc154bba80c44eaadb69a480f31fc') as ok from public.blog_posts where slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
union all
select 'ou-habiter-frontalier-suisse-villes-france-pas-cher', 'content_en', 'espaces insécables = 0', (length(content_en) - length(replace(content_en, chr(160), '')) = 0) from public.blog_posts where slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
union all
select 'ou-habiter-frontalier-suisse-villes-france-pas-cher' as slug, 'content_fr' as col, 'md5 attendu' as controle, (coalesce(md5(content_fr), 'NULL') = 'e48068f1b054c1796cf38bee4f50bff2') as ok from public.blog_posts where slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
union all
select 'ou-habiter-frontalier-suisse-villes-france-pas-cher', 'content_fr', 'espaces insécables = 2', (length(content_fr) - length(replace(content_fr, chr(160), '')) = 2) from public.blog_posts where slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
union all
select 'cout-de-la-vie-suisse-france-frontalier-2026' as slug, 'content_en' as col, 'md5 attendu' as controle, (coalesce(md5(content_en), 'NULL') = '829768a210d3ee4014e799c2701d2d13') as ok from public.blog_posts where slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
union all
select 'cout-de-la-vie-suisse-france-frontalier-2026', 'content_en', 'espaces insécables = 0', (length(content_en) - length(replace(content_en, chr(160), '')) = 0) from public.blog_posts where slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
union all
select 'ecole-internationale-geneve-frontalier-ou-habiter' as slug, 'content_fr' as col, 'md5 attendu' as controle, (coalesce(md5(content_fr), 'NULL') = '47d18950f216fa10e4ab6ab5ac563709') as ok from public.blog_posts where slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
union all
select 'ecole-internationale-geneve-frontalier-ou-habiter', 'content_fr', 'espaces insécables = 1', (length(content_fr) - length(replace(content_fr, chr(160), '')) = 1) from public.blog_posts where slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
union all
select 'ecole-internationale-geneve-frontalier-ou-habiter' as slug, 'content_en' as col, 'md5 attendu' as controle, (coalesce(md5(content_en), 'NULL') = 'fc30a43171bdd0d1cec7f8e73677ee80') as ok from public.blog_posts where slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
union all
select 'ecole-internationale-geneve-frontalier-ou-habiter', 'content_en', 'espaces insécables = 0', (length(content_en) - length(replace(content_en, chr(160), '')) = 0) from public.blog_posts where slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
union all
select 'colocation-annemasse-ville-la-grand-ambilly' as slug, 'content_en' as col, 'md5 attendu' as controle, (coalesce(md5(content_en), 'NULL') = '280601f578cf888b09d5ebbfcb193a74') as ok from public.blog_posts where slug = 'colocation-annemasse-ville-la-grand-ambilly'
union all
select 'colocation-annemasse-ville-la-grand-ambilly', 'content_en', 'espaces insécables = 0', (length(content_en) - length(replace(content_en, chr(160), '')) = 0) from public.blog_posts where slug = 'colocation-annemasse-ville-la-grand-ambilly'
union all
select 'colocation-annemasse-ville-la-grand-ambilly' as slug, 'meta_description_en' as col, 'md5 attendu' as controle, (coalesce(md5(meta_description_en), 'NULL') = '0b3de3b9ed8c21a6eb8af7e424752e90') as ok from public.blog_posts where slug = 'colocation-annemasse-ville-la-grand-ambilly'
union all
select 'colocation-annemasse-ville-la-grand-ambilly' as slug, 'excerpt_en' as col, 'md5 attendu' as controle, (coalesce(md5(excerpt_en), 'NULL') = '5f5c2e7dd1c07c05551bc860b748e2ab') as ok from public.blog_posts where slug = 'colocation-annemasse-ville-la-grand-ambilly'
union all
select 'assurance-sante-frontalier-lamal-cmu-budget' as slug, 'meta_description_en' as col, 'md5 attendu' as controle, (coalesce(md5(meta_description_en), 'NULL') = 'f12a2576d5e6d08d29895d15ae74e654') as ok from public.blog_posts where slug = 'assurance-sante-frontalier-lamal-cmu-budget'
union all
select 'cout-transport-frontalier-geneve-2026' as slug, 'meta_description_en' as col, 'md5 attendu' as controle, (coalesce(md5(meta_description_en), 'NULL') = '6cd5004fefd633b6308c428b4b3d9d7f') as ok from public.blog_posts where slug = 'cout-transport-frontalier-geneve-2026'
union all
select 'fiscalite-frontalier-geneve-impots-2026', 'content_fr', 'lien présent 1 fois : /blog/guide-ressources-frontalier-geneve', ((length(content_fr) - length(replace(content_fr, $q$](/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/blog/guide-ressources-frontalier-geneve)$q$) = 1) from public.blog_posts where slug = 'fiscalite-frontalier-geneve-impots-2026'
union all
select 'fiscalite-frontalier-geneve-impots-2026', 'content_en', 'lien présent 1 fois : /en/blog/guide-ressources-frontalier-geneve', ((length(content_en) - length(replace(content_en, $q$](/en/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/en/blog/guide-ressources-frontalier-geneve)$q$) = 1) from public.blog_posts where slug = 'fiscalite-frontalier-geneve-impots-2026'
union all
select 'salaire-suisse-net-frontalier-2026', 'content_fr', 'lien présent 1 fois : /blog/guide-ressources-frontalier-geneve', ((length(content_fr) - length(replace(content_fr, $q$](/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/blog/guide-ressources-frontalier-geneve)$q$) = 1) from public.blog_posts where slug = 'salaire-suisse-net-frontalier-2026'
union all
select 'salaire-suisse-net-frontalier-2026', 'content_en', 'lien présent 1 fois : /en/blog/guide-ressources-frontalier-geneve', ((length(content_en) - length(replace(content_en, $q$](/en/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/en/blog/guide-ressources-frontalier-geneve)$q$) = 1) from public.blog_posts where slug = 'salaire-suisse-net-frontalier-2026'
union all
select 'teletravail-frontalier-geneve-regles-2026', 'content_fr', 'lien présent 1 fois : /blog/guide-ressources-frontalier-geneve', ((length(content_fr) - length(replace(content_fr, $q$](/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/blog/guide-ressources-frontalier-geneve)$q$) = 1) from public.blog_posts where slug = 'teletravail-frontalier-geneve-regles-2026'
union all
select 'teletravail-frontalier-geneve-regles-2026', 'content_en', 'lien présent 1 fois : /en/blog/guide-ressources-frontalier-geneve', ((length(content_en) - length(replace(content_en, $q$](/en/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/en/blog/guide-ressources-frontalier-geneve)$q$) = 1) from public.blog_posts where slug = 'teletravail-frontalier-geneve-regles-2026'
union all
select 'allocations-familiales-frontalier-geneve-2026', 'content_fr', 'lien présent 1 fois : /blog/guide-ressources-frontalier-geneve', ((length(content_fr) - length(replace(content_fr, $q$](/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/blog/guide-ressources-frontalier-geneve)$q$) = 1) from public.blog_posts where slug = 'allocations-familiales-frontalier-geneve-2026'
union all
select 'allocations-familiales-frontalier-geneve-2026', 'content_en', 'lien présent 1 fois : /en/blog/guide-ressources-frontalier-geneve', ((length(content_en) - length(replace(content_en, $q$](/en/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/en/blog/guide-ressources-frontalier-geneve)$q$) = 1) from public.blog_posts where slug = 'allocations-familiales-frontalier-geneve-2026'
union all
select 'permis-g-frontalier-geneve', 'content_fr', 'lien présent 1 fois : /blog/guide-ressources-frontalier-geneve', ((length(content_fr) - length(replace(content_fr, $q$](/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/blog/guide-ressources-frontalier-geneve)$q$) = 1) from public.blog_posts where slug = 'permis-g-frontalier-geneve'
union all
select 'permis-g-frontalier-geneve', 'content_en', 'lien présent 1 fois : /en/blog/guide-ressources-frontalier-geneve', ((length(content_en) - length(replace(content_en, $q$](/en/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/en/blog/guide-ressources-frontalier-geneve)$q$) = 1) from public.blog_posts where slug = 'permis-g-frontalier-geneve'
union all
select 'avenant-fiscal-40-frontalier-geneve', 'content_fr', 'lien présent 1 fois : /blog/guide-ressources-frontalier-geneve', ((length(content_fr) - length(replace(content_fr, $q$](/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/blog/guide-ressources-frontalier-geneve)$q$) = 1) from public.blog_posts where slug = 'avenant-fiscal-40-frontalier-geneve'
union all
select 'avenant-fiscal-40-frontalier-geneve', 'content_en', 'lien présent 1 fois : /en/blog/guide-ressources-frontalier-geneve', ((length(content_en) - length(replace(content_en, $q$](/en/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/en/blog/guide-ressources-frontalier-geneve)$q$) = 1) from public.blog_posts where slug = 'avenant-fiscal-40-frontalier-geneve'
union all
select 'declaration-impots-frontalier-2026', 'content_fr', 'lien présent 1 fois : /blog/guide-ressources-frontalier-geneve', ((length(content_fr) - length(replace(content_fr, $q$](/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/blog/guide-ressources-frontalier-geneve)$q$) = 1) from public.blog_posts where slug = 'declaration-impots-frontalier-2026'
union all
select 'declaration-impots-frontalier-2026', 'content_en', 'lien présent 1 fois : /en/blog/guide-ressources-frontalier-geneve', ((length(content_en) - length(replace(content_en, $q$](/en/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/en/blog/guide-ressources-frontalier-geneve)$q$) = 1) from public.blog_posts where slug = 'declaration-impots-frontalier-2026'
union all
select 'assurance-sante-frontalier-lamal-cmu-budget', 'content_fr', 'lien présent 1 fois : /blog/guide-ressources-frontalier-geneve', ((length(content_fr) - length(replace(content_fr, $q$](/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/blog/guide-ressources-frontalier-geneve)$q$) = 1) from public.blog_posts where slug = 'assurance-sante-frontalier-lamal-cmu-budget'
union all
select 'assurance-sante-frontalier-lamal-cmu-budget', 'content_en', 'lien présent 1 fois : /en/blog/guide-ressources-frontalier-geneve', ((length(content_en) - length(replace(content_en, $q$](/en/blog/guide-ressources-frontalier-geneve)$q$, ''))) / length($q$](/en/blog/guide-ressources-frontalier-geneve)$q$) = 1) from public.blog_posts where slug = 'assurance-sante-frontalier-lamal-cmu-budget'
union all
select 'guide-ressources-frontalier-geneve', 'content_fr', 'lien présent 1 fois : /blog/salaire-suisse-net-frontalier-2026', ((length(content_fr) - length(replace(content_fr, $q$](/blog/salaire-suisse-net-frontalier-2026)$q$, ''))) / length($q$](/blog/salaire-suisse-net-frontalier-2026)$q$) = 1) from public.blog_posts where slug = 'guide-ressources-frontalier-geneve'
union all
select 'guide-ressources-frontalier-geneve', 'content_en', 'lien présent 1 fois : /en/blog/salaire-suisse-net-frontalier-2026', ((length(content_en) - length(replace(content_en, $q$](/en/blog/salaire-suisse-net-frontalier-2026)$q$, ''))) / length($q$](/en/blog/salaire-suisse-net-frontalier-2026)$q$) = 1) from public.blog_posts where slug = 'guide-ressources-frontalier-geneve'
union all
select 'guide-ressources-frontalier-geneve', 'content_fr', 'lien présent 1 fois : /blog/allocations-familiales-frontalier-geneve-2026', ((length(content_fr) - length(replace(content_fr, $q$](/blog/allocations-familiales-frontalier-geneve-2026)$q$, ''))) / length($q$](/blog/allocations-familiales-frontalier-geneve-2026)$q$) = 1) from public.blog_posts where slug = 'guide-ressources-frontalier-geneve'
union all
select 'guide-ressources-frontalier-geneve', 'content_en', 'lien présent 1 fois : /en/blog/allocations-familiales-frontalier-geneve-2026', ((length(content_en) - length(replace(content_en, $q$](/en/blog/allocations-familiales-frontalier-geneve-2026)$q$, ''))) / length($q$](/en/blog/allocations-familiales-frontalier-geneve-2026)$q$) = 1) from public.blog_posts where slug = 'guide-ressources-frontalier-geneve'
union all
select 'fiscalite-frontalier-geneve-impots-2026', 'content_fr', 'lien présent 1 fois : /blog/permis-g-frontalier-geneve', ((length(content_fr) - length(replace(content_fr, $q$](/blog/permis-g-frontalier-geneve)$q$, ''))) / length($q$](/blog/permis-g-frontalier-geneve)$q$) = 1) from public.blog_posts where slug = 'fiscalite-frontalier-geneve-impots-2026'
union all
select 'fiscalite-frontalier-geneve-impots-2026', 'content_en', 'lien présent 1 fois : /en/blog/permis-g-frontalier-geneve', ((length(content_en) - length(replace(content_en, $q$](/en/blog/permis-g-frontalier-geneve)$q$, ''))) / length($q$](/en/blog/permis-g-frontalier-geneve)$q$) = 1) from public.blog_posts where slug = 'fiscalite-frontalier-geneve-impots-2026'
union all
select 'fiscalite-frontalier-geneve-impots-2026', 'content_fr', 'lien présent 1 fois : /blog/avenant-fiscal-40-frontalier-geneve', ((length(content_fr) - length(replace(content_fr, $q$](/blog/avenant-fiscal-40-frontalier-geneve)$q$, ''))) / length($q$](/blog/avenant-fiscal-40-frontalier-geneve)$q$) = 1) from public.blog_posts where slug = 'fiscalite-frontalier-geneve-impots-2026'
union all
select 'fiscalite-frontalier-geneve-impots-2026', 'content_en', 'lien présent 1 fois : /en/blog/avenant-fiscal-40-frontalier-geneve', ((length(content_en) - length(replace(content_en, $q$](/en/blog/avenant-fiscal-40-frontalier-geneve)$q$, ''))) / length($q$](/en/blog/avenant-fiscal-40-frontalier-geneve)$q$) = 1) from public.blog_posts where slug = 'fiscalite-frontalier-geneve-impots-2026'
union all
select 'fiscalite-frontalier-geneve-impots-2026', 'content_fr', 'lien présent 1 fois : /blog/declaration-impots-frontalier-2026', ((length(content_fr) - length(replace(content_fr, $q$](/blog/declaration-impots-frontalier-2026)$q$, ''))) / length($q$](/blog/declaration-impots-frontalier-2026)$q$) = 1) from public.blog_posts where slug = 'fiscalite-frontalier-geneve-impots-2026'
union all
select 'fiscalite-frontalier-geneve-impots-2026', 'content_en', 'lien présent 1 fois : /en/blog/declaration-impots-frontalier-2026', ((length(content_en) - length(replace(content_en, $q$](/en/blog/declaration-impots-frontalier-2026)$q$, ''))) / length($q$](/en/blog/declaration-impots-frontalier-2026)$q$) = 1) from public.blog_posts where slug = 'fiscalite-frontalier-geneve-impots-2026'
union all
select 'permis-g-frontalier-geneve', 'content_fr', 'lien présent 1 fois : /blog/declaration-impots-frontalier-2026', ((length(content_fr) - length(replace(content_fr, $q$](/blog/declaration-impots-frontalier-2026)$q$, ''))) / length($q$](/blog/declaration-impots-frontalier-2026)$q$) = 1) from public.blog_posts where slug = 'permis-g-frontalier-geneve'
union all
select 'permis-g-frontalier-geneve', 'content_fr', 'lien présent 1 fois : /blog/avenant-fiscal-40-frontalier-geneve', ((length(content_fr) - length(replace(content_fr, $q$](/blog/avenant-fiscal-40-frontalier-geneve)$q$, ''))) / length($q$](/blog/avenant-fiscal-40-frontalier-geneve)$q$) = 1) from public.blog_posts where slug = 'permis-g-frontalier-geneve'
union all
select 'permis-g-frontalier-geneve', 'content_en', 'lien présent 1 fois : /en/blog/declaration-impots-frontalier-2026', ((length(content_en) - length(replace(content_en, $q$](/en/blog/declaration-impots-frontalier-2026)$q$, ''))) / length($q$](/en/blog/declaration-impots-frontalier-2026)$q$) = 1) from public.blog_posts where slug = 'permis-g-frontalier-geneve'
union all
select 'permis-g-frontalier-geneve', 'content_en', 'lien présent 1 fois : /en/blog/avenant-fiscal-40-frontalier-geneve', ((length(content_en) - length(replace(content_en, $q$](/en/blog/avenant-fiscal-40-frontalier-geneve)$q$, ''))) / length($q$](/en/blog/avenant-fiscal-40-frontalier-geneve)$q$) = 1) from public.blog_posts where slug = 'permis-g-frontalier-geneve'
union all
select 'avenant-fiscal-40-frontalier-geneve', 'content_fr', 'lien présent 1 fois : /blog/permis-g-frontalier-geneve', ((length(content_fr) - length(replace(content_fr, $q$](/blog/permis-g-frontalier-geneve)$q$, ''))) / length($q$](/blog/permis-g-frontalier-geneve)$q$) = 1) from public.blog_posts where slug = 'avenant-fiscal-40-frontalier-geneve'
union all
select 'avenant-fiscal-40-frontalier-geneve', 'content_en', 'lien présent 1 fois : /en/blog/permis-g-frontalier-geneve', ((length(content_en) - length(replace(content_en, $q$](/en/blog/permis-g-frontalier-geneve)$q$, ''))) / length($q$](/en/blog/permis-g-frontalier-geneve)$q$) = 1) from public.blog_posts where slug = 'avenant-fiscal-40-frontalier-geneve'
union all
select 'avenant-fiscal-40-frontalier-geneve', 'content_fr', 'lien présent 1 fois : /blog/declaration-impots-frontalier-2026', ((length(content_fr) - length(replace(content_fr, $q$](/blog/declaration-impots-frontalier-2026)$q$, ''))) / length($q$](/blog/declaration-impots-frontalier-2026)$q$) = 1) from public.blog_posts where slug = 'avenant-fiscal-40-frontalier-geneve'
union all
select 'avenant-fiscal-40-frontalier-geneve', 'content_en', 'lien présent 1 fois : /en/blog/declaration-impots-frontalier-2026', ((length(content_en) - length(replace(content_en, $q$](/en/blog/declaration-impots-frontalier-2026)$q$, ''))) / length($q$](/en/blog/declaration-impots-frontalier-2026)$q$) = 1) from public.blog_posts where slug = 'avenant-fiscal-40-frontalier-geneve'
union all
select 'declaration-impots-frontalier-2026', 'content_fr', 'lien présent 1 fois : /blog/permis-g-frontalier-geneve', ((length(content_fr) - length(replace(content_fr, $q$](/blog/permis-g-frontalier-geneve)$q$, ''))) / length($q$](/blog/permis-g-frontalier-geneve)$q$) = 1) from public.blog_posts where slug = 'declaration-impots-frontalier-2026'
union all
select 'declaration-impots-frontalier-2026', 'content_en', 'lien présent 1 fois : /en/blog/permis-g-frontalier-geneve', ((length(content_en) - length(replace(content_en, $q$](/en/blog/permis-g-frontalier-geneve)$q$, ''))) / length($q$](/en/blog/permis-g-frontalier-geneve)$q$) = 1) from public.blog_posts where slug = 'declaration-impots-frontalier-2026'
union all
select 'teletravail-frontalier-geneve-regles-2026', 'content_fr', 'lien présent 1 fois : /blog/avenant-fiscal-40-frontalier-geneve', ((length(content_fr) - length(replace(content_fr, $q$](/blog/avenant-fiscal-40-frontalier-geneve)$q$, ''))) / length($q$](/blog/avenant-fiscal-40-frontalier-geneve)$q$) = 1) from public.blog_posts where slug = 'teletravail-frontalier-geneve-regles-2026'
union all
select 'teletravail-frontalier-geneve-regles-2026', 'content_en', 'lien présent 1 fois : /en/blog/avenant-fiscal-40-frontalier-geneve', ((length(content_en) - length(replace(content_en, $q$](/en/blog/avenant-fiscal-40-frontalier-geneve)$q$, ''))) / length($q$](/en/blog/avenant-fiscal-40-frontalier-geneve)$q$) = 1) from public.blog_posts where slug = 'teletravail-frontalier-geneve-regles-2026'
union all
select 'ou-habiter-frontalier-suisse-villes-france-pas-cher', 'content_en', 'lien présent 1 fois : /en/chambre-a-louer-geneve', ((length(content_en) - length(replace(content_en, $q$](/en/chambre-a-louer-geneve)$q$, ''))) / length($q$](/en/chambre-a-louer-geneve)$q$) = 1) from public.blog_posts where slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
union all
select 'ou-habiter-frontalier-suisse-villes-france-pas-cher', 'content_fr', 'lien présent 1 fois : /chambre-a-louer-geneve', ((length(content_fr) - length(replace(content_fr, $q$](/chambre-a-louer-geneve)$q$, ''))) / length($q$](/chambre-a-louer-geneve)$q$) = 1) from public.blog_posts where slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
union all
select 'cout-de-la-vie-suisse-france-frontalier-2026', 'content_en', 'lien présent 1 fois : /en/chambre-a-louer-geneve', ((length(content_en) - length(replace(content_en, $q$](/en/chambre-a-louer-geneve)$q$, ''))) / length($q$](/en/chambre-a-louer-geneve)$q$) = 1) from public.blog_posts where slug = 'cout-de-la-vie-suisse-france-frontalier-2026'
union all
select 'salaire-suisse-net-frontalier-2026', 'content_fr', 'lien présent 1 fois : /blog/cout-transport-frontalier-geneve-2026', ((length(content_fr) - length(replace(content_fr, $q$](/blog/cout-transport-frontalier-geneve-2026)$q$, ''))) / length($q$](/blog/cout-transport-frontalier-geneve-2026)$q$) = 1) from public.blog_posts where slug = 'salaire-suisse-net-frontalier-2026'
union all
select 'salaire-suisse-net-frontalier-2026', 'content_en', 'lien présent 1 fois : /en/blog/cout-transport-frontalier-geneve-2026', ((length(content_en) - length(replace(content_en, $q$](/en/blog/cout-transport-frontalier-geneve-2026)$q$, ''))) / length($q$](/en/blog/cout-transport-frontalier-geneve-2026)$q$) = 1) from public.blog_posts where slug = 'salaire-suisse-net-frontalier-2026'
union all
select 'ou-habiter-frontalier-suisse-villes-france-pas-cher', 'content_fr', 'lien présent 1 fois : /blog/demenager-geneve-frontalier-checklist', ((length(content_fr) - length(replace(content_fr, $q$](/blog/demenager-geneve-frontalier-checklist)$q$, ''))) / length($q$](/blog/demenager-geneve-frontalier-checklist)$q$) = 1) from public.blog_posts where slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
union all
select 'ou-habiter-frontalier-suisse-villes-france-pas-cher', 'content_en', 'lien présent 1 fois : /en/blog/demenager-geneve-frontalier-checklist', ((length(content_en) - length(replace(content_en, $q$](/en/blog/demenager-geneve-frontalier-checklist)$q$, ''))) / length($q$](/en/blog/demenager-geneve-frontalier-checklist)$q$) = 1) from public.blog_posts where slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
union all
select 'ecole-internationale-geneve-frontalier-ou-habiter', 'content_fr', 'lien présent 1 fois : /blog/assurance-sante-frontalier-lamal-cmu-budget', ((length(content_fr) - length(replace(content_fr, $q$](/blog/assurance-sante-frontalier-lamal-cmu-budget)$q$, ''))) / length($q$](/blog/assurance-sante-frontalier-lamal-cmu-budget)$q$) = 1) from public.blog_posts where slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
union all
select 'ecole-internationale-geneve-frontalier-ou-habiter', 'content_en', 'lien présent 1 fois : /en/blog/assurance-sante-frontalier-lamal-cmu-budget', ((length(content_en) - length(replace(content_en, $q$](/en/blog/assurance-sante-frontalier-lamal-cmu-budget)$q$, ''))) / length($q$](/en/blog/assurance-sante-frontalier-lamal-cmu-budget)$q$) = 1) from public.blog_posts where slug = 'ecole-internationale-geneve-frontalier-ou-habiter'
union all
select 'colocation-annemasse-ville-la-grand-ambilly', 'content_en', 'plus de titre « # Colocation in » en tête', (content_en not like $q$# %$q$) from public.blog_posts where slug = 'colocation-annemasse-ville-la-grand-ambilly'
union all
select 'colocation-annemasse-ville-la-grand-ambilly', 'content_en', 'plus de « hunt game »', (content_en not ilike $q$%hunt game%$q$) from public.blog_posts where slug = 'colocation-annemasse-ville-la-grand-ambilly'
union all
select 'colocation-annemasse-ville-la-grand-ambilly', 'content_en', 'plus de « pollution »', (content_en not ilike $q$%pollution%$q$) from public.blog_posts where slug = 'colocation-annemasse-ville-la-grand-ambilly'
union all
select 'colocation-annemasse-ville-la-grand-ambilly', 'content_en', 'plus de « weird people »', (content_en not ilike $q$%weird people%$q$) from public.blog_posts where slug = 'colocation-annemasse-ville-la-grand-ambilly'
union all
select 'colocation-annemasse-ville-la-grand-ambilly', 'content_en', '« colocation » seulement dans des URL', (content_en !~* $q$[^/-]colocation$q$) from public.blog_posts where slug = 'colocation-annemasse-ville-la-grand-ambilly'
union all
select 'colocation-annemasse-ville-la-grand-ambilly', 'excerpt_en+meta', 'plus de « colocation »', (excerpt_en !~* 'colocation' and meta_description_en !~* 'colocation') from public.blog_posts where slug = 'colocation-annemasse-ville-la-grand-ambilly'
union all
select 'colocation-annemasse-ville-la-grand-ambilly', 'meta_description_en', 'renseignée, ≤ 155 car.', (meta_description_en is not null and char_length(meta_description_en) <= 155) from public.blog_posts where slug = 'colocation-annemasse-ville-la-grand-ambilly'
union all
select 'assurance-sante-frontalier-lamal-cmu-budget', 'meta_description_en', 'renseignée, ≤ 155 car.', (meta_description_en is not null and char_length(meta_description_en) <= 155) from public.blog_posts where slug = 'assurance-sante-frontalier-lamal-cmu-budget'
union all
select 'cout-transport-frontalier-geneve-2026', 'meta_description_en', 'renseignée, ≤ 155 car.', (meta_description_en is not null and char_length(meta_description_en) <= 155) from public.blog_posts where slug = 'cout-transport-frontalier-geneve-2026'
) t order by ok, slug, col, controle;
