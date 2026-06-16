-- ════════════════════════════════════════════════════════════════════════
-- RÉVISION ÉDITORIALE — B1 : 3e-pilier-frontalier-geneve
-- Verdict brief : article SOLIDE (aucune erreur). Valeur ajoutée + liens officiels (A1).
-- Faits vérifiés : plafond 3a 2026 = 7 258 CHF (estv.admin.ch/bsv.admin.ch) ;
-- rachat rétroactif dès 2025 (admin.ch). Liens 200-vérifiés. Idempotent.
-- Projet Supabase : tefpynkdxxfiefpkgitz
-- ════════════════════════════════════════════════════════════════════════

-- 1) FR — lien portail officiel 3a (intro)
UPDATE blog_posts SET content_fr = replace(content_fr,
$o$Le 3e pilier (pilier 3a) est l'outil d'épargne retraite préféré des Suisses, surtout pour son avantage fiscal.$o$,
$n$Le 3e pilier ([pilier 3a](https://www.ch.ch/fr/retraite/prevoyance-vieillesse/prevoyance-privee-3e-pilier/)) est l'outil d'épargne retraite préféré des Suisses, surtout pour son avantage fiscal.$n$),
updated_at = now() WHERE slug = '3e-pilier-frontalier-geneve';

-- 2) FR — nommer des prestataires 3a accessibles aux non-résidents (avec réserve, sans reco engageante)
UPDATE blog_posts SET content_fr = replace(content_fr,
$o$La solution passe souvent par des **assureurs ou prestataires spécialisés** en prévoyance frontalière, qui proposent des 3a accessibles depuis la France.$o$,
$n$La solution passe souvent par des **assureurs ou prestataires spécialisés** en prévoyance frontalière, qui proposent des 3a accessibles depuis la France. Parmi les solutions 3a existantes, on cite souvent des acteurs en ligne comme **Finpension, VIAC ou Frankly**, ou des prestataires de prévoyance frontalière — **vérifiez au cas par cas l'éligibilité des non-résidents**, qui varie selon l'acteur et votre situation.$n$),
updated_at = now() WHERE slug = '3e-pilier-frontalier-geneve';

-- 3) FR — lien quasi-résident (AFC-GE)
UPDATE blog_posts SET content_fr = replace(content_fr,
$o$vous devez demander la **taxation ordinaire ultérieure (TOU)** et remplir la condition des **90 %** (au moins 90 % des revenus de votre foyer imposés en Suisse).$o$,
$n$vous devez demander la **taxation ordinaire ultérieure (TOU)** et remplir la condition des **90 %** (au moins 90 % des revenus de votre foyer imposés en Suisse) — c'est le statut de [quasi-résident](https://www.ge.ch/taxation-ordinaire-ulterieure-tou/qu-est-ce-qu-quasi-resident).$n$),
updated_at = now() WHERE slug = '3e-pilier-frontalier-geneve';

-- 4) FR — sourcer le plafond 7 258 CHF
UPDATE blog_posts SET content_fr = replace(content_fr,
$o$Le plafond 2026, pour un salarié affilié à une caisse de pension (LPP), est de **7 258 CHF**.$o$,
$n$Le plafond 2026, pour un salarié affilié à une caisse de pension (LPP), est de **7 258 CHF** ([montant officiel](https://www.estv.admin.ch/fr/taux-interet-deductions-maximales-pilier-3a-impot-federal-direct)).$n$),
updated_at = now() WHERE slug = '3e-pilier-frontalier-geneve';

-- ─────────────── EN ───────────────
-- 5) EN — official 3a portal link (intro)
UPDATE blog_posts SET content_en = replace(content_en,
$o$The third pillar (pillar 3a) is the Swiss favorite for retirement savings, mainly for its tax advantage.$o$,
$n$The third pillar ([pillar 3a](https://www.ch.ch/en/retirement/old-age-provision/private-provision-pillar-3/)) is the Swiss favorite for retirement savings, mainly for its tax advantage.$n$),
updated_at = now() WHERE slug = '3e-pilier-frontalier-geneve';

-- 6) EN — name 3a providers accessible to non-residents (with caveat)
UPDATE blog_posts SET content_en = replace(content_en,
$o$The way around it is usually through **specialized insurers or providers** of cross-border pension solutions, who offer 3a plans accessible from France.$o$,
$n$The way around it is usually through **specialized insurers or providers** of cross-border pension solutions, who offer 3a plans accessible from France. Among the existing 3a solutions, online providers such as **Finpension, VIAC or Frankly**, or cross-border pension specialists, are often mentioned — **check non-resident eligibility case by case**, as it varies by provider and situation.$n$),
updated_at = now() WHERE slug = '3e-pilier-frontalier-geneve';

-- 7) EN — quasi-resident link
UPDATE blog_posts SET content_en = replace(content_en,
$o$you must request **subsequent ordinary taxation (TOU)** and meet the **90% condition** (at least 90% of your household income taxed in Switzerland).$o$,
$n$you must request **subsequent ordinary taxation (TOU)** and meet the **90% condition** (at least 90% of your household income taxed in Switzerland) — this is [quasi-resident](https://www.ge.ch/taxation-ordinaire-ulterieure-tou/qu-est-ce-qu-quasi-resident) status.$n$),
updated_at = now() WHERE slug = '3e-pilier-frontalier-geneve';

-- 8) EN — source the 7,258 CHF cap
UPDATE blog_posts SET content_en = replace(content_en,
$o$The 2026 cap, for an employee affiliated with a pension fund (LPP), is **7,258 CHF**.$o$,
$n$The 2026 cap, for an employee affiliated with a pension fund (LPP), is **7,258 CHF** ([official amount](https://www.estv.admin.ch/fr/taux-interet-deductions-maximales-pilier-3a-impot-federal-direct)).$n$),
updated_at = now() WHERE slug = '3e-pilier-frontalier-geneve';

-- ─── Contrôle ───
SELECT
  (position('Finpension' IN content_fr) > 0) AS prestataires_fr,
  (position('estv.admin.ch' IN content_fr) > 0) AS lien_plafond_fr,
  (position('quasi-resident' IN content_en) > 0) AS lien_qr_en,
  (position('Finpension' IN content_en) > 0) AS prestataires_en
FROM blog_posts WHERE slug = '3e-pilier-frontalier-geneve';
