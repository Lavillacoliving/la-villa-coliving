-- ============================================================
-- B2 — Raccourcissement des titres blog > 60 caractères
-- Projet : tefpynkdxxfiefpkgitz · Validé par Jérôme le 2026-06-04
-- Réf. propositions : SEO/B2-titres-avant-apres.md
-- Lancer : Supabase → SQL Editor → New query → coller TOUT → Run.
-- Puis régénérer le prérendu (prochain déploiement) pour que Google voie les nouveaux titres.
-- 43 articles. Le SELECT final de contrôle liste ce qui dépasse encore 60.
-- ============================================================

-- Tier 1 — money / Annemasse / Genève / comparatifs
UPDATE blog_posts SET title_fr='Colocation pour expats à Genève : s''installer en 2026', title_en='Shared Housing for Expats in Geneva (2026 Guide)' WHERE slug='colocation-expats-geneve-guide';
UPDATE blog_posts SET title_fr='Colocation Annemasse, Ville-la-Grand & Ambilly : où trouver', title_en='Shared Housing in Annemasse & Ville-la-Grand: Where to Find' WHERE slug='colocation-annemasse-ville-la-grand-ambilly';
UPDATE blog_posts SET title_fr='Studio Genève vs colocation France : le vrai budget 2026', title_en='Geneva Studio vs French Flatshare: The Real Budget (2026)' WHERE slug='studio-geneve-vs-colocation-france-budget';
UPDATE blog_posts SET title_fr='Coliving à Annemasse : l''alternative premium près de Genève', title_en='Coliving in Annemasse: the Premium Alternative near Geneva' WHERE slug='coliving-annemasse-geneve-alternative-premium';
UPDATE blog_posts SET title_fr='Coliving à Annemasse : la solution premium des frontaliers', title_en='Coliving in Annemasse: the Premium Cross-Border Choice' WHERE slug='coliving-annemasse-geneve-frontaliers-avantages';
UPDATE blog_posts SET title_fr='Coliving à Annemasse : le guide complet des frontaliers', title_en='Annemasse Coliving: the Complete Cross-Border Guide' WHERE slug='annemasse-coliving-geneve-frontaliers-guide-complet';
UPDATE blog_posts SET title_fr='Chambre meublée à Annemasse près de Genève (guide 2026)', title_en='Furnished Room in Annemasse near Geneva (2026 Guide)' WHERE slug='chambre-meublee-annemasse-geneve';
UPDATE blog_posts SET title_fr='Colocation sans frais de dossier près de Genève (2026)', title_en='Shared Housing with No Application Fee near Geneva' WHERE slug='coliving-frais-dossier-geneve-annemasse';
UPDATE blog_posts SET title_fr='Coliving ou colocation à Genève : comment choisir ?', title_en='Coliving vs Flatshare near Geneva: How to Choose' WHERE slug='coliving-vs-colocation-choisir-mode-vie-geneve-frontalier';
UPDATE blog_posts SET title_en='How Much Rent for Cross-Border Workers in Geneva? (2026)' WHERE slug='loyer-frontalier-geneve-combien-payer';
UPDATE blog_posts SET title_fr='Grand Genève 2026 : ce qui change pour les frontaliers', title_en='Greater Geneva 2026: What Changes for Cross-Border Workers' WHERE slug='grand-geneve-2026-nouveautes-frontaliers';
UPDATE blog_posts SET title_fr='Transport frontalier Genève : le vrai coût (2026)', title_en='Cross-Border Transport Costs near Geneva (2026)' WHERE slug='cout-transport-frontalier-geneve-2026';
UPDATE blog_posts SET title_fr='Télétravail frontalier Genève : règles et limites 2026', title_en='Remote Work for Cross-Border Workers: Rules & Limits 2026' WHERE slug='teletravail-frontalier-geneve-regles-2026';

-- Tier 2 — guides & lifestyle
UPDATE blog_posts SET title_fr='Assurance santé frontalier : LAMal ou CMU ? (budget)', title_en='Cross-Border Health Insurance: LAMal or CMU? (Budget)' WHERE slug='assurance-sante-frontalier-lamal-cmu-budget';
UPDATE blog_posts SET title_fr='Travailler aux OI à Genève : où habiter côté France ?', title_en='Working at Geneva''s International Orgs: Where to Live' WHERE slug='organisations-internationales-geneve-ou-habiter';
UPDATE blog_posts SET title_fr='Temps de trajet Annemasse ↔ Genève selon ton quartier', title_en='Annemasse ↔ Geneva: Real Travel Times by District' WHERE slug='temps-trajet-annemasse-geneve-par-quartier';
UPDATE blog_posts SET title_fr='Vie quotidienne frontalier Genève : le guide pratique', title_en='Daily Life as a Geneva Cross-Border Worker: A Guide' WHERE slug='vie-quotidienne-frontalier-courses-sport-sorties';
UPDATE blog_posts SET title_fr='Choc culturel franco-suisse : guide de survie du frontalier', title_en='Franco-Swiss Culture Shock: A Cross-Border Survival Guide' WHERE slug='choc-culturel-franco-suisse-expatrie-geneve';
UPDATE blog_posts SET title_fr='Coliving transfrontalier : vivre entre Genève et Annemasse', title_en='Cross-Border Coliving: Life Between Geneva & Annemasse' WHERE slug='coliving-transfrontalier-geneve-annemasse-nouvelle-vie';
UPDATE blog_posts SET title_fr='Déménager près de Genève en frontalier : la checklist', title_en='Moving near Geneva as a Cross-Border Worker: Checklist' WHERE slug='demenager-geneve-frontalier-checklist';
UPDATE blog_posts SET title_fr='Se faire un réseau à Genève quand on arrive seul', title_en='Building a Network in Geneva When You Arrive Alone' WHERE slug='se-faire-reseau-geneve-arriver-seul';
UPDATE blog_posts SET title_fr='Arnaques logement frontalier Genève : éviter les pièges', title_en='Housing Scams near Geneva: How to Spot and Avoid Them' WHERE slug='arnaques-logement-frontalier-geneve-eviter';
UPDATE blog_posts SET title_fr='5 erreurs à éviter pour son logement frontalier', title_en='5 Costly Mistakes to Avoid in Cross-Border Housing' WHERE slug='5-erreurs-eviter-recherche-logement-frontalier';
UPDATE blog_posts SET title_fr='5 erreurs à éviter en cherchant un logement frontalier', title_en='5 Mistakes to Avoid When Searching Cross-Border Housing' WHERE slug='5-erreurs-logement-frontalier-geneve';
UPDATE blog_posts SET title_fr='Les avantages du coliving pour jeunes pros près de Genève' WHERE slug='avantages-coliving-jeunes-professionnels';
UPDATE blog_posts SET title_fr='Le coliving, nouvelle tendance des jeunes professionnels', title_en='Coliving: The New Housing Trend for Young Professionals' WHERE slug='coliving-tendance-habitat-jeunes-professionnels-2024';
UPDATE blog_posts SET title_fr='Arriver seul à Genève : le guide de vos 30 premiers jours' WHERE slug='arriver-seul-geneve-guide-30-jours';
UPDATE blog_posts SET title_fr='Coliving : se faire de vrais amis, pas que des colocataires' WHERE slug='coliving-communaute-reels-amis-geneve-annemasse';
UPDATE blog_posts SET title_fr='Genève sans voiture : guide mobilité douce frontalier', title_en='Geneva Without a Car: Soft Mobility for Cross-Border Workers' WHERE slug='geneve-sans-voiture-mobilite-douce-frontaliers';
UPDATE blog_posts SET title_fr='Coliving tout inclus : combien tu économises (le tableau)', title_en='All-Inclusive Coliving: How Much You Really Save' WHERE slug='economies-coliving-tout-inclus-geneve';
UPDATE blog_posts SET title_fr='Banque, téléphone, internet : bons plans frontaliers', title_en='Banking, Phone, Internet: Best Cross-Border Deals' WHERE slug='banque-telephone-internet-frontalier-bons-plans';
UPDATE blog_posts SET title_fr='Dossier de location frontalier : ne pas se faire recaler' WHERE slug='dossier-location-frontalier-suisse-france';
UPDATE blog_posts SET title_en='Geneva Cross-Border Tax: What Changes for Your Net Pay 2026' WHERE slug='fiscalite-frontalier-geneve-impots-2026';
UPDATE blog_posts SET title_en='Living in France, Working in Geneva: The Complete Guide' WHERE slug='living-in-france-working-in-geneva';
UPDATE blog_posts SET title_en='Shared Housing Budget near Geneva (2026 Guide)' WHERE slug='budget-colocation-geneve-guide-complet';
UPDATE blog_posts SET title_en='Where to Live as a Geneva Cross-Border Worker? 7 Towns' WHERE slug='ou-habiter-frontalier-suisse-villes-france-pas-cher';
UPDATE blog_posts SET title_fr='Transport Annemasse-Genève : Léman Express, bus, vélo', title_en='Annemasse-Geneva Transport: Léman Express, Bus, Bike' WHERE slug='transport-annemasse-geneve-leman-express';
UPDATE blog_posts SET title_fr='Vivre en coliving : témoignages à La Villa' WHERE slug='vie-communautaire-coliving-temoignages';
UPDATE blog_posts SET title_fr='Coliving vs colocation : quelles différences ?' WHERE slug='coliving-vs-colocation-differences';
UPDATE blog_posts SET title_fr='Qu''est-ce que le coliving et pourquoi ça compte ?' WHERE slug='what-is-coliving-and-why-it-matters';

-- Trio de guides "coliving Genève" — titres différenciés (cannibalisation D1 traitée à part)
UPDATE blog_posts SET title_fr='Coliving à Genève : le guide complet des frontaliers', title_en='Coliving in Geneva: the Complete Cross-Border Guide' WHERE slug='coliving-geneve-frontaliers-guide-complet';
UPDATE blog_posts SET title_fr='Coliving à Genève : le guide frontalier (édition 2026)', title_en='Coliving in Geneva: the Cross-Border Guide (2026)' WHERE slug='coliving-geneve-frontaliers-guide-2024';
UPDATE blog_posts SET title_en='Coliving in Geneva for Cross-Border Workers: 2026 Guide' WHERE slug='coliving-geneve-frontalier-guide-complet';

-- contrôle : titres restant > 60 caractères (idéalement vide ou quasi)
SELECT slug,
       (CASE WHEN length(title_fr) > 60 THEN length(title_fr) END) AS fr_len,
       (CASE WHEN length(title_en) > 60 THEN length(title_en) END) AS en_len
FROM blog_posts
WHERE length(title_fr) > 60 OR length(title_en) > 60
ORDER BY slug;
