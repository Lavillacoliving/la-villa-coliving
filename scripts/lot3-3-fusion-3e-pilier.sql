-- Lot 3.3 — Fusionner `3e-pilier-frontalier-geneve` dans `fiscalite-frontalier-geneve-impots-2026`
-- ============================================================================
-- POURQUOI : 0 clic en 3 mois, position 28,8, 220 impressions. Article hors du
-- cluster du site (aucune autre page sur la prévoyance), sur une SERP tenue par
-- des courtiers spécialisés. L'article fiscalité, lui, est en page 1 (pos 6,6).
--
-- CONSTAT UTILE : `fiscalite-frontalier-geneve-impots-2026` porte DÉJÀ une section
-- « Le 3e pilier : épargne retraite et optimisation fiscale » qui couvre le
-- plafond 7 258 CHF et le principe de la déduction. Il ne manque que ce que
-- l'article dédié disait de plus :
--   1. l'accès au compte (beaucoup de banques refusent les non-résidents) ;
--   2. la condition quasi-résident, et surtout ce qui se passe SANS ce statut ;
--   3. la nouveauté 2026 du rachat rétroactif ;
--   4. les sources officielles (ch.ch, ge.ch, estv.admin.ch).
-- On absorbe ces 4 points, on ne recopie pas le reste.
--
-- ORDRE D'EXÉCUTION — les 4 étapes, dans cet ordre :
--   1. ce script (enrichissement + dépublication)
--   2. la redirection 308 dans vercel.json (hors SQL)
--   3. la correction des 5 liens internes entrants (étape 3 ci-dessous)
--   4. prérendu + déploiement — la dépublication retire le slug du sitemap,
--      qui est généré depuis les articles publiés de Supabase.
-- ============================================================================

-- ── 1) FR : enrichir la section 3a existante
UPDATE blog_posts
SET content_fr = REPLACE(
      content_fr,
      E'En plus de constituer une épargne retraite.\n\n## Les erreurs fiscales les plus courantes',
      E'En plus de constituer une épargne retraite.\n\n'
      || E'**Attention à la condition d''accès.** La déduction n''est PAS automatique : '
      || E'elle est réservée aux [quasi-résidents](https://www.ge.ch/taxation-ordinaire-ulterieure-tou/qu-est-ce-qu-quasi-resident), '
      || E'c''est-à-dire aux frontaliers qui demandent la taxation ordinaire ultérieure (TOU) '
      || E'et remplissent la condition des 90 % de revenus imposés en Suisse. Sans ce statut, '
      || E'si vous restez uniquement imposé à la source, votre versement 3a ne réduit pas votre '
      || E'impôt suisse — il garde son seul intérêt d''épargne retraite. C''est le premier point '
      || E'à vérifier avant d''ouvrir quoi que ce soit.\n\n'
      || E'**Ouvrir un 3a quand on habite en France.** Tout frontalier salarié en Suisse est '
      || E'affilié à l''AVS, donc éligible au [pilier 3a](https://www.ch.ch/fr/retraite/prevoyance-vieillesse/prevoyance-privee-3e-pilier/). '
      || E'En pratique, beaucoup de banques refusent les non-résidents pour des raisons de '
      || E'conformité : l''accès passe souvent par des assureurs ou des prestataires spécialisés '
      || E'en prévoyance frontalière. L''éligibilité varie d''un acteur à l''autre — à vérifier '
      || E'au cas par cas.\n\n'
      || E'**Nouveauté 2026 : le rachat rétroactif.** Depuis 2026, il est possible de combler '
      || E'les années où vous n''avez pas (ou pas entièrement) cotisé au 3a. Le [plafond annuel '
      || E'officiel](https://www.estv.admin.ch/fr/taux-interet-deductions-maximales-pilier-3a-impot-federal-direct) '
      || E'reste la référence pour calculer ces rattrapages.\n\n'
      || E'## Les erreurs fiscales les plus courantes'
    ),
    updated_at = NOW()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND content_fr LIKE '%En plus de constituer une épargne retraite.%'
  AND content_fr NOT LIKE '%rachat rétroactif%';

-- ── 2) EN : même contenu
UPDATE blog_posts
SET content_en = REPLACE(
      content_en,
      E'In addition to building retirement savings.\n\n## The most common tax mistakes',
      E'In addition to building retirement savings.\n\n'
      || E'**Mind the eligibility condition.** The deduction is NOT automatic: it is reserved for '
      || E'[quasi-residents](https://www.ge.ch/taxation-ordinaire-ulterieure-tou/qu-est-ce-qu-quasi-resident) — '
      || E'cross-border workers who request subsequent ordinary taxation (TOU) and meet the 90 % '
      || E'condition on income taxed in Switzerland. Without that status, if you remain taxed at '
      || E'source only, your 3a contribution does not reduce your Swiss tax; it keeps only its '
      || E'retirement-savings value. Check this first, before opening anything.\n\n'
      || E'**Opening a 3a while living in France.** Every cross-border worker employed in '
      || E'Switzerland is affiliated to the AVS, and therefore eligible for '
      || E'[pillar 3a](https://www.ch.ch/en/retirement/pension-provision/private-pension-provision-pillar-3/). '
      || E'In practice many banks turn down non-residents for compliance reasons: access usually '
      || E'goes through insurers or providers specialised in cross-border pensions. Eligibility '
      || E'varies from one provider to the next — check case by case.\n\n'
      || E'**New in 2026: retroactive buy-back.** Since 2026 you can top up the years when you did '
      || E'not contribute — or did not contribute in full — to your 3a. The [official annual '
      || E'cap](https://www.estv.admin.ch/fr/taux-interet-deductions-maximales-pilier-3a-impot-federal-direct) '
      || E'remains the reference for computing those catch-ups.\n\n'
      || E'## The most common tax mistakes'
    ),
    updated_at = NOW()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND content_en LIKE '%In addition to building retirement savings.%'
  AND content_en NOT LIKE '%retroactive buy-back%';

-- ── 3) Rediriger les 5 liens internes entrants vers la nouvelle cible
--     (sources relevées : declaration-impots-frontalier-2026 et
--      salaire-suisse-net-frontalier-2026, FR + EN)
UPDATE blog_posts
SET content_fr = REPLACE(content_fr, '](/blog/3e-pilier-frontalier-geneve)', '](/blog/fiscalite-frontalier-geneve-impots-2026)'),
    content_en = REPLACE(content_en, '](/en/blog/3e-pilier-frontalier-geneve)', '](/en/blog/fiscalite-frontalier-geneve-impots-2026)'),
    updated_at = NOW()
WHERE content_fr LIKE '%](/blog/3e-pilier-frontalier-geneve)%'
   OR content_en LIKE '%](/en/blog/3e-pilier-frontalier-geneve)%';

-- ── 4) Dépublier l'article fusionné (le retire du sitemap et du prérendu)
UPDATE blog_posts
SET is_published = false, updated_at = NOW()
WHERE slug = '3e-pilier-frontalier-geneve';

-- ============================================================================
-- VÉRIFICATION
-- ============================================================================
-- SELECT slug, is_published,
--        array_length(regexp_split_to_array(content_fr,'\s+'),1) AS mots_fr,
--        (content_fr LIKE '%rachat rétroactif%')  AS fr_enrichi,
--        (content_en LIKE '%retroactive buy-back%') AS en_enrichi
-- FROM blog_posts
-- WHERE slug IN ('fiscalite-frontalier-geneve-impots-2026','3e-pilier-frontalier-geneve');
--
-- SELECT count(*) AS liens_restants FROM blog_posts
-- WHERE content_fr LIKE '%3e-pilier-frontalier-geneve%' OR content_en LIKE '%3e-pilier-frontalier-geneve%';
-- Attendu : 0.
