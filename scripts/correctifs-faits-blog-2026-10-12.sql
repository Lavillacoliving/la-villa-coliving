-- ============================================================================
-- Correctifs de faits du blog (lot du 08/10/2026, GO Jérôme 12/10/2026) : 36 substitutions sur 13 articles, 5 colonnes de metas/extraits.
-- Généré le 2026-10-12T08:04:44.715Z par scripts/build-slots-sql.mjs depuis scripts/correctifs-faits-blog.edits.mjs
--   · paires reprises du SQL du 08/10 (scripts/correctifs-faits-blog-2026-10-08.sql), reclassées contre la base le 12/10 ; aucune donnée nouvelle ()
--   · ancres vérifiées sur le contenu vivant de blog_posts (REST anon, lecture seule) le 2026-10-12T08:04:44.713Z : exactement 1 occurrence de chaque ancien texte, nouveau texte absent
-- Indépendant du code (textes d'articles seulement) ; republication par le bot au prochain push ou cron.
-- Idempotent : chaque UPDATE est gardé par position(ancien) > 0 [AND position(nouveau) = 0 quand le nouveau texte n'est pas un fragment de l'ancien] — relancer le fichier est sans effet.
-- Fichier UTF-8 avec insécables U+00A0 — ne pas normaliser.
-- 36 modifications · 6 articles · état en base à la génération (updated_at · longueur fr / en) :
--   coliving-transfrontalier-geneve-annemasse-nouvelle-vie · 2026-10-10T08:07:50.44606+00:00 · 3892 / 3759
--   colocation-annemasse-ville-la-grand-ambilly · 2026-10-09T14:33:23.72146+00:00 · 8614 / 7691
--   fiscalite-frontalier-geneve-impots-2026 · 2026-10-09T14:33:23.72146+00:00 · 10583 / 9942
--   lodge-annemasse-coliving-premium-portes-geneve · 2026-10-10T08:36:26.258805+00:00 · 15213 / 13537
--   ou-habiter-frontalier-suisse-villes-france-pas-cher · 2026-10-11T13:28:56.701083+00:00 · 9492 / 8989
--   salaire-suisse-net-frontalier-2026 · 2026-10-10T08:07:50.44606+00:00 · 13504 / 10746
-- ============================================================================

BEGIN;

-- [1/36] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · FAITS · A1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$veulent **éviter les démarches** (dossier de location, garant, caution, ameublement, branchements)$f$, $r$veulent **éviter les démarches** (ameublement, ouverture des compteurs, abonnement internet)$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$veulent **éviter les démarches** (dossier de location, garant, caution, ameublement, branchements)$f$ IN content_fr) > 0
  AND position($r$veulent **éviter les démarches** (ameublement, ouverture des compteurs, abonnement internet)$r$ IN content_fr) = 0;

-- [2/36] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · FAITS · A1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$tu arrives avec ta valise et tu pars quand tu veux : chambre meublée, charges, WiFi fibre, ménage, salle de sport, piscine — **tout est inclus**, dès 1 370 CHF/mois. Idéal pour$f$, $r$tu arrives avec ta valise : chambre meublée, charges, WiFi fibre, ménage, salle de sport, piscine — **tout est inclus**, dès 1 370 CHF/mois. Bail de 12 mois : tu es libre de partir à tout moment avec 1 mois de préavis. Idéal pour$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$tu arrives avec ta valise et tu pars quand tu veux : chambre meublée, charges, WiFi fibre, ménage, salle de sport, piscine — **tout est inclus**, dès 1 370 CHF/mois. Idéal pour$f$ IN content_fr) > 0
  AND position($r$tu arrives avec ta valise : chambre meublée, charges, WiFi fibre, ménage, salle de sport, piscine — **tout est inclus**, dès 1 370 CHF/mois. Bail de 12 mois : tu es libre de partir à tout moment avec 1 mois de préavis. Idéal pour$r$ IN content_fr) = 0;

-- [3/36] ou-habiter-frontalier-suisse-villes-france-pas-cher (fr) · FAITS · A1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$*À lire aussi :*
- Les meilleurs quartiers frontaliers de Genève
$f$, $r$*À lire aussi :*
- [Vivre à Annemasse : quel quartier choisir selon ton profil ?](/blog/quartiers-annemasse-ou-vivre-selon-profil)
$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$*À lire aussi :*
- Les meilleurs quartiers frontaliers de Genève
$f$ IN content_fr) > 0
  AND position($r$*À lire aussi :*
- [Vivre à Annemasse : quel quartier choisir selon ton profil ?](/blog/quartiers-annemasse-ou-vivre-selon-profil)
$r$ IN content_fr) = 0;

-- [4/36] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · FAITS · A2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET content_en = replace(content_en, $f$# Where to live as a Geneva cross-border worker? The guide to 7 French towns

$f$, $r$$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$# Where to live as a Geneva cross-border worker? The guide to 7 French towns

$f$ IN content_en) > 0;

-- [5/36] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · FAITS · A2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET content_en = replace(content_en, $f$want to **skip the paperwork** (rental file, guarantor, deposit, furnishing, utility hookups)$f$, $r$want to **skip the paperwork** (furnishing, utility hookups, internet contract)$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$want to **skip the paperwork** (rental file, guarantor, deposit, furnishing, utility hookups)$f$ IN content_en) > 0
  AND position($r$want to **skip the paperwork** (furnishing, utility hookups, internet contract)$r$ IN content_en) = 0;

-- [6/36] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · FAITS · A2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET content_en = replace(content_en, $f$you arrive with your suitcase and you leave when you want: furnished room, utilities, fiber WiFi, cleaning, gym, pool — **everything included**, from 1,370 CHF/month. Ideal for$f$, $r$you arrive with your suitcase: furnished room, utilities, fiber WiFi, cleaning, gym, pool — **everything included**, from 1,370 CHF/month. 12-month lease: you're free to leave at any time with 1 month's notice. Ideal for$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$you arrive with your suitcase and you leave when you want: furnished room, utilities, fiber WiFi, cleaning, gym, pool — **everything included**, from 1,370 CHF/month. Ideal for$f$ IN content_en) > 0
  AND position($r$you arrive with your suitcase: furnished room, utilities, fiber WiFi, cleaning, gym, pool — **everything included**, from 1,370 CHF/month. 12-month lease: you're free to leave at any time with 1 month's notice. Ideal for$r$ IN content_en) = 0;

-- [7/36] ou-habiter-frontalier-suisse-villes-france-pas-cher (en) · FAITS · A2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET content_en = replace(content_en, $f$*Also read:*
- The best cross-border neighborhoods near Geneva
$f$, $r$*Also read:*
- [Annemasse neighbourhoods: where to live 2026](/en/blog/quartiers-annemasse-ou-vivre-selon-profil)
$r$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($f$*Also read:*
- The best cross-border neighborhoods near Geneva
$f$ IN content_en) > 0
  AND position($r$*Also read:*
- [Annemasse neighbourhoods: where to live 2026](/en/blog/quartiers-annemasse-ou-vivre-selon-profil)
$r$ IN content_en) = 0;

-- [8/36] fiscalite-frontalier-geneve-impots-2026 (fr) · FAITS · C1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Avec un loyer coliving à 1 370 CHF, il te reste$f$, $r$Avec une chambre en coliving dès 1 370 CHF, il te reste$r$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($f$Avec un loyer coliving à 1 370 CHF, il te reste$f$ IN content_fr) > 0
  AND position($r$Avec une chambre en coliving dès 1 370 CHF, il te reste$r$ IN content_fr) = 0;

-- [9/36] fiscalite-frontalier-geneve-impots-2026 (fr) · FAITS · C1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Le loyer du coliving à 1 370 CHF tout inclus est$f$, $r$Le loyer du coliving, dès 1 370 CHF tout inclus, est$r$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($f$Le loyer du coliving à 1 370 CHF tout inclus est$f$ IN content_fr) > 0
  AND position($r$Le loyer du coliving, dès 1 370 CHF tout inclus, est$r$ IN content_fr) = 0;

-- [10/36] fiscalite-frontalier-geneve-impots-2026 (fr) · FAITS · C1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$- [Budget colocation près de Genève : le guide complet](/blog/budget-colocation-geneve-guide-complet)
$f$, $r$- [Salaire suisse net 2026 : guide frontalier](/blog/salaire-suisse-net-frontalier-2026)
$r$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($f$- [Budget colocation près de Genève : le guide complet](/blog/budget-colocation-geneve-guide-complet)
$f$ IN content_fr) > 0
  AND position($r$- [Salaire suisse net 2026 : guide frontalier](/blog/salaire-suisse-net-frontalier-2026)
$r$ IN content_fr) = 0;

-- [11/36] fiscalite-frontalier-geneve-impots-2026 (en) · FAITS · C2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET content_en = replace(content_en, $f$With coliving rent at 1,370 CHF, you have$f$, $r$With a coliving room from 1,370 CHF, you have$r$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($f$With coliving rent at 1,370 CHF, you have$f$ IN content_en) > 0
  AND position($r$With a coliving room from 1,370 CHF, you have$r$ IN content_en) = 0;

-- [12/36] fiscalite-frontalier-geneve-impots-2026 (en) · FAITS · C2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET content_en = replace(content_en, $f$The all-inclusive coliving rent of 1,370 CHF is$f$, $r$The all-inclusive coliving rent, from 1,370 CHF, is$r$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($f$The all-inclusive coliving rent of 1,370 CHF is$f$ IN content_en) > 0
  AND position($r$The all-inclusive coliving rent, from 1,370 CHF, is$r$ IN content_en) = 0;

-- [13/36] fiscalite-frontalier-geneve-impots-2026 (en) · FAITS · C2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET content_en = replace(content_en, $f$- [Shared housing budget near Geneva: the complete guide](/en/blog/budget-colocation-geneve-guide-complet)
$f$, $r$- [Swiss net salary 2026 for frontaliers](/en/blog/salaire-suisse-net-frontalier-2026)
$r$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($f$- [Shared housing budget near Geneva: the complete guide](/en/blog/budget-colocation-geneve-guide-complet)
$f$ IN content_en) > 0
  AND position($r$- [Swiss net salary 2026 for frontaliers](/en/blog/salaire-suisse-net-frontalier-2026)
$r$ IN content_en) = 0;

-- [14/36] salaire-suisse-net-frontalier-2026 (fr) · FAITS · E1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$> **Attention nouvelle règle 2024+** : si tu fais plus de 40 % de télétravail depuis la France, tu bascules sur l'imposition française — beaucoup moins avantageuse. On détaille tout dans$f$, $r$> **Attention à la règle des 40 %** : au-delà de 40 % de télétravail annuel depuis la France, la part de ton salaire liée aux jours télétravaillés devient imposable en France, dès le premier jour. Ce seuil est pérennisé par l'avenant fiscal franco-suisse, applicable depuis le 1er janvier 2026. On détaille tout dans$r$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($f$> **Attention nouvelle règle 2024+** : si tu fais plus de 40 % de télétravail depuis la France, tu bascules sur l'imposition française — beaucoup moins avantageuse. On détaille tout dans$f$ IN content_fr) > 0
  AND position($r$> **Attention à la règle des 40 %** : au-delà de 40 % de télétravail annuel depuis la France, la part de ton salaire liée aux jours télétravaillés devient imposable en France, dès le premier jour. Ce seuil est pérennisé par l'avenant fiscal franco-suisse, applicable depuis le 1er janvier 2026. On détaille tout dans$r$ IN content_fr) = 0;

-- [15/36] salaire-suisse-net-frontalier-2026 (fr) · FAITS · E1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$(jusqu'à 7 056 CHF/an en 2026 pour un salarié)$f$, $r$(jusqu'à 7 258 CHF/an en 2026 pour un salarié)$r$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($f$(jusqu'à 7 056 CHF/an en 2026 pour un salarié)$f$ IN content_fr) > 0
  AND position($r$(jusqu'à 7 258 CHF/an en 2026 pour un salarié)$r$ IN content_fr) = 0;

-- [16/36] salaire-suisse-net-frontalier-2026 (fr) · FAITS · E1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$### 1. Le 3e pilier 3a si tu peux y accéder
Les frontaliers travaillant à Genève ne peuvent généralement pas y souscrire (sauf statut de quasi-résident). Mais si tu y as droit, le plafond 2026$f$, $r$### 1. Le 3e pilier 3a, si tu peux le déduire
Tout frontalier salarié en Suisse cotise à l'AVS : il peut donc ouvrir un 3a, même si beaucoup de banques refusent les non-résidents. La déduction fiscale est en revanche réservée aux quasi-résidents (taxation ordinaire ultérieure, au moins 90 % de tes revenus imposés en Suisse). Si tu remplis cette condition, le plafond 2026$r$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($f$### 1. Le 3e pilier 3a si tu peux y accéder
Les frontaliers travaillant à Genève ne peuvent généralement pas y souscrire (sauf statut de quasi-résident). Mais si tu y as droit, le plafond 2026$f$ IN content_fr) > 0
  AND position($r$### 1. Le 3e pilier 3a, si tu peux le déduire
Tout frontalier salarié en Suisse cotise à l'AVS : il peut donc ouvrir un 3a, même si beaucoup de banques refusent les non-résidents. La déduction fiscale est en revanche réservée aux quasi-résidents (taxation ordinaire ultérieure, au moins 90 % de tes revenus imposés en Suisse). Si tu remplis cette condition, le plafond 2026$r$ IN content_fr) = 0;

-- [17/36] salaire-suisse-net-frontalier-2026 (en) · FAITS · E2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET content_en = replace(content_en, $f$> **Watch out for the 40 % rule (2024+)**: if you remote-work more than 40 % from France, you flip to French taxation — much less favourable. Read$f$, $r$> **Watch out for the 40 % rule**: above 40 % annual remote work from France, the share of your salary tied to your remote-work days becomes taxable in France, from the very first day. The threshold was made permanent by the Franco-Swiss tax amendment, applicable since 1 January 2026. Read$r$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($f$> **Watch out for the 40 % rule (2024+)**: if you remote-work more than 40 % from France, you flip to French taxation — much less favourable. Read$f$ IN content_en) > 0
  AND position($r$> **Watch out for the 40 % rule**: above 40 % annual remote work from France, the share of your salary tied to your remote-work days becomes taxable in France, from the very first day. The threshold was made permanent by the Franco-Swiss tax amendment, applicable since 1 January 2026. Read$r$ IN content_en) = 0;

-- [18/36] salaire-suisse-net-frontalier-2026 (en) · FAITS · E2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET content_en = replace(content_en, $f$### 1. The 3rd pillar 3a if eligible
Most frontaliers can't use it (unless you have quasi-resident status). But if you can, the 2026 cap$f$, $r$### 1. The 3rd pillar 3a, if you can deduct it
Every cross-border worker employed in Switzerland pays into the AVS and can therefore open a 3a, even though many banks turn down non-residents. The tax deduction, however, is reserved for quasi-residents (subsequent ordinary taxation, at least 90 % of your income taxed in Switzerland). If you meet that condition, the 2026 cap$r$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($f$### 1. The 3rd pillar 3a if eligible
Most frontaliers can't use it (unless you have quasi-resident status). But if you can, the 2026 cap$f$ IN content_en) > 0
  AND position($r$### 1. The 3rd pillar 3a, if you can deduct it
Every cross-border worker employed in Switzerland pays into the AVS and can therefore open a 3a, even though many banks turn down non-residents. The tax deduction, however, is reserved for quasi-residents (subsequent ordinary taxation, at least 90 % of your income taxed in Switzerland). If you meet that condition, the 2026 cap$r$ IN content_en) = 0;

-- [19/36] colocation-annemasse-ville-la-grand-ambilly (fr) · FAITS · F1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$**Annemasse centre (près de la gare)** : Prix : 1000-1400 CHF.$f$, $r$**Annemasse centre (près de la gare)** : Prix : 600-800 €/mois.$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$**Annemasse centre (près de la gare)** : Prix : 1000-1400 CHF.$f$ IN content_fr) > 0
  AND position($r$**Annemasse centre (près de la gare)** : Prix : 600-800 €/mois.$r$ IN content_fr) = 0;

-- [20/36] colocation-annemasse-ville-la-grand-ambilly (fr) · FAITS · F1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$**Annemasse Nord** : Prix : 950-1250 CHF.$f$, $r$**Annemasse Nord** : Prix : 550-750 €/mois.$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$**Annemasse Nord** : Prix : 950-1250 CHF.$f$ IN content_fr) > 0
  AND position($r$**Annemasse Nord** : Prix : 550-750 €/mois.$r$ IN content_fr) = 0;

-- [21/36] colocation-annemasse-ville-la-grand-ambilly (fr) · FAITS · F1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$**Ville-la-Grand** : Prix : 900-1250 CHF.$f$, $r$**Ville-la-Grand** : Prix : 500-700 €/mois.$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$**Ville-la-Grand** : Prix : 900-1250 CHF.$f$ IN content_fr) > 0
  AND position($r$**Ville-la-Grand** : Prix : 500-700 €/mois.$r$ IN content_fr) = 0;

-- [22/36] colocation-annemasse-ville-la-grand-ambilly (fr) · FAITS · F1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$**Ambilly** : Prix : 850-1150 CHF.$f$, $r$**Ambilly** : Prix : 500-750 €/mois.$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$**Ambilly** : Prix : 850-1150 CHF.$f$ IN content_fr) > 0
  AND position($r$**Ambilly** : Prix : 500-750 €/mois.$r$ IN content_fr) = 0;

-- [23/36] colocation-annemasse-ville-la-grand-ambilly (fr) · FAITS · F1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Loyer bizarrement bas (moins de 750 CHF une belle chambre)?$f$, $r$Loyer bizarrement bas (bien en dessous de 550 € pour une belle chambre)?$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$Loyer bizarrement bas (moins de 750 CHF une belle chambre)?$f$ IN content_fr) > 0
  AND position($r$Loyer bizarrement bas (bien en dessous de 550 € pour une belle chambre)?$r$ IN content_fr) = 0;

-- [24/36] colocation-annemasse-ville-la-grand-ambilly (fr) · FAITS · F1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Demander 200 CHF de baisse sur un 1000 CHF.$f$, $r$Demander 20 % de baisse sur le loyer.$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$Demander 200 CHF de baisse sur un 1000 CHF.$f$ IN content_fr) > 0
  AND position($r$Demander 20 % de baisse sur le loyer.$r$ IN content_fr) = 0;

-- [25/36] colocation-annemasse-ville-la-grand-ambilly (en) · FAITS · F2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Annemasse center (near station)**: Price: 1000-1400 CHF.$f$, $r$**Annemasse center (near station)**: Price: 600-800 €/month.$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$**Annemasse center (near station)**: Price: 1000-1400 CHF.$f$ IN content_en) > 0
  AND position($r$**Annemasse center (near station)**: Price: 600-800 €/month.$r$ IN content_en) = 0;

-- [26/36] colocation-annemasse-ville-la-grand-ambilly (en) · FAITS · F2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Annemasse North**: Price: 950-1250 CHF.$f$, $r$**Annemasse North**: Price: 550-750 €/month.$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$**Annemasse North**: Price: 950-1250 CHF.$f$ IN content_en) > 0
  AND position($r$**Annemasse North**: Price: 550-750 €/month.$r$ IN content_en) = 0;

-- [27/36] colocation-annemasse-ville-la-grand-ambilly (en) · FAITS · F2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Ville-la-Grand**: Price: 900-1250 CHF.$f$, $r$**Ville-la-Grand**: Price: 500-700 €/month.$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$**Ville-la-Grand**: Price: 900-1250 CHF.$f$ IN content_en) > 0
  AND position($r$**Ville-la-Grand**: Price: 500-700 €/month.$r$ IN content_en) = 0;

-- [28/36] colocation-annemasse-ville-la-grand-ambilly (en) · FAITS · F2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Ambilly**: Price: 850-1150 CHF.$f$, $r$**Ambilly**: Price: 500-750 €/month.$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$**Ambilly**: Price: 850-1150 CHF.$f$ IN content_en) > 0
  AND position($r$**Ambilly**: Price: 500-750 €/month.$r$ IN content_en) = 0;

-- [29/36] colocation-annemasse-ville-la-grand-ambilly (en) · FAITS · F2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET content_en = replace(content_en, $f$Price weirdly low (less than 750 CHF nice room)?$f$, $r$Price weirdly low (well under 550 € for a nice room)?$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$Price weirdly low (less than 750 CHF nice room)?$f$ IN content_en) > 0
  AND position($r$Price weirdly low (well under 550 € for a nice room)?$r$ IN content_en) = 0;

-- [30/36] colocation-annemasse-ville-la-grand-ambilly (en) · FAITS · F2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET content_en = replace(content_en, $f$Ask 200 CHF off a 1000 CHF rent.$f$, $r$Ask for 20% off the rent.$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$Ask 200 CHF off a 1000 CHF rent.$f$ IN content_en) > 0
  AND position($r$Ask for 20% off the rent.$r$ IN content_en) = 0;

-- [31/36] lodge-annemasse-coliving-premium-portes-geneve (fr, excerpt_fr) · FAITS · H1 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET excerpt_fr = replace(excerpt_fr, $f$1 370 CHF/mois tout inclus$f$, $r$1 430 CHF/mois tout inclus$r$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($f$1 370 CHF/mois tout inclus$f$ IN excerpt_fr) > 0
  AND position($r$1 430 CHF/mois tout inclus$r$ IN excerpt_fr) = 0;

-- [32/36] lodge-annemasse-coliving-premium-portes-geneve (en, excerpt_en) · FAITS · H2 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET excerpt_en = replace(excerpt_en, $f$all-inclusive at CHF 1,370/month$f$, $r$all-inclusive at CHF 1,430/month$r$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($f$all-inclusive at CHF 1,370/month$f$ IN excerpt_en) > 0
  AND position($r$all-inclusive at CHF 1,430/month$r$ IN excerpt_en) = 0;

-- [33/36] lodge-annemasse-coliving-premium-portes-geneve (fr, meta_description_fr) · FAITS · H3 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET meta_description_fr = replace(meta_description_fr, $f$1 370 CHF/mois tout inclus$f$, $r$1 430 CHF/mois tout inclus$r$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($f$1 370 CHF/mois tout inclus$f$ IN meta_description_fr) > 0
  AND position($r$1 430 CHF/mois tout inclus$r$ IN meta_description_fr) = 0;

-- [34/36] lodge-annemasse-coliving-premium-portes-geneve (en, meta_description_en) · FAITS · H4 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET meta_description_en = replace(meta_description_en, $f$all-inclusive at CHF 1,370/month$f$, $r$all-inclusive at CHF 1,430/month$r$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($f$all-inclusive at CHF 1,370/month$f$ IN meta_description_en) > 0
  AND position($r$all-inclusive at CHF 1,430/month$r$ IN meta_description_en) = 0;

-- [35/36] coliving-transfrontalier-geneve-annemasse-nouvelle-vie (fr, meta_description_fr) · FAITS · H5 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET meta_description_fr = replace(meta_description_fr, $f$, 1 370 CHF tout compris,$f$, $r$, dès 1 370 CHF tout compris,$r$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($f$, 1 370 CHF tout compris,$f$ IN meta_description_fr) > 0
  AND position($r$, dès 1 370 CHF tout compris,$r$ IN meta_description_fr) = 0;

-- [36/36] coliving-transfrontalier-geneve-annemasse-nouvelle-vie (en, meta_description_en) · FAITS · H6 — correctif de faits (lot du 08/10/2026, rejoué le 12/10 sur l'état courant de la base)
UPDATE blog_posts
SET meta_description_en = replace(meta_description_en, $f$, 1,370 CHF all-inclusive,$f$, $r$, from 1,370 CHF all-inclusive,$r$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($f$, 1,370 CHF all-inclusive,$f$ IN meta_description_en) > 0
  AND position($r$, from 1,370 CHF all-inclusive,$r$ IN meta_description_en) = 0;

-- ── Aperçu des ancrages (ancien → nouveau, première ligne de chaque texte) ──
-- [1] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · FAITS : « veulent **éviter les démarches** (dossier de location, garant, caution,… » → « veulent **éviter les démarches** (ameublement, ouverture des compteurs,… »
-- [2] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · FAITS : « tu arrives avec ta valise et tu pars quand tu veux : chambre meublée, c… » → « tu arrives avec ta valise : chambre meublée, charges, WiFi fibre, ménag… »
-- [3] ou-habiter-frontalier-suisse-villes-france-pas-cher/fr · FAITS : « *À lire aussi :*⏎- Les meilleurs quartiers frontaliers de Genève⏎ » → « *À lire aussi :*⏎- [Vivre à Annemasse : quel quartier choisir selon ton… »
-- [4] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · FAITS : « # Where to live as a Geneva cross-border worker? The guide to 7 French … » → «  »
-- [5] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · FAITS : « want to **skip the paperwork** (rental file, guarantor, deposit, furnis… » → « want to **skip the paperwork** (furnishing, utility hookups, internet c… »
-- [6] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · FAITS : « you arrive with your suitcase and you leave when you want: furnished ro… » → « you arrive with your suitcase: furnished room, utilities, fiber WiFi, c… »
-- [7] ou-habiter-frontalier-suisse-villes-france-pas-cher/en · FAITS : « *Also read:*⏎- The best cross-border neighborhoods near Geneva⏎ » → « *Also read:*⏎- [Annemasse neighbourhoods: where to live 2026](/en/blog/… »
-- [8] fiscalite-frontalier-geneve-impots-2026/fr · FAITS : « Avec un loyer coliving à 1 370 CHF, il te reste » → « Avec une chambre en coliving dès 1 370 CHF, il te reste »
-- [9] fiscalite-frontalier-geneve-impots-2026/fr · FAITS : « Le loyer du coliving à 1 370 CHF tout inclus est » → « Le loyer du coliving, dès 1 370 CHF tout inclus, est »
-- [10] fiscalite-frontalier-geneve-impots-2026/fr · FAITS : « - [Budget colocation près de Genève : le guide complet](/blog/budget-co… » → « - [Salaire suisse net 2026 : guide frontalier](/blog/salaire-suisse-net… »
-- [11] fiscalite-frontalier-geneve-impots-2026/en · FAITS : « With coliving rent at 1,370 CHF, you have » → « With a coliving room from 1,370 CHF, you have »
-- [12] fiscalite-frontalier-geneve-impots-2026/en · FAITS : « The all-inclusive coliving rent of 1,370 CHF is » → « The all-inclusive coliving rent, from 1,370 CHF, is »
-- [13] fiscalite-frontalier-geneve-impots-2026/en · FAITS : « - [Shared housing budget near Geneva: the complete guide](/en/blog/budg… » → « - [Swiss net salary 2026 for frontaliers](/en/blog/salaire-suisse-net-f… »
-- [14] salaire-suisse-net-frontalier-2026/fr · FAITS : « > **Attention nouvelle règle 2024+** : si tu fais plus de 40 % de télét… » → « > **Attention à la règle des 40 %** : au-delà de 40 % de télétravail an… »
-- [15] salaire-suisse-net-frontalier-2026/fr · FAITS : « (jusqu'à 7 056 CHF/an en 2026 pour un salarié) » → « (jusqu'à 7 258 CHF/an en 2026 pour un salarié) »
-- [16] salaire-suisse-net-frontalier-2026/fr · FAITS : « ### 1. Le 3e pilier 3a si tu peux y accéder⏎Les frontaliers travaillant… » → « ### 1. Le 3e pilier 3a, si tu peux le déduire⏎Tout frontalier salarié e… »
-- [17] salaire-suisse-net-frontalier-2026/en · FAITS : « > **Watch out for the 40 % rule (2024+)**: if you remote-work more than… » → « > **Watch out for the 40 % rule**: above 40 % annual remote work from F… »
-- [18] salaire-suisse-net-frontalier-2026/en · FAITS : « ### 1. The 3rd pillar 3a if eligible⏎Most frontaliers can't use it (unl… » → « ### 1. The 3rd pillar 3a, if you can deduct it⏎Every cross-border worke… »
-- [19] colocation-annemasse-ville-la-grand-ambilly/fr · FAITS : « **Annemasse centre (près de la gare)** : Prix : 1000-1400 CHF. » → « **Annemasse centre (près de la gare)** : Prix : 600-800 €/mois. »
-- [20] colocation-annemasse-ville-la-grand-ambilly/fr · FAITS : « **Annemasse Nord** : Prix : 950-1250 CHF. » → « **Annemasse Nord** : Prix : 550-750 €/mois. »
-- [21] colocation-annemasse-ville-la-grand-ambilly/fr · FAITS : « **Ville-la-Grand** : Prix : 900-1250 CHF. » → « **Ville-la-Grand** : Prix : 500-700 €/mois. »
-- [22] colocation-annemasse-ville-la-grand-ambilly/fr · FAITS : « **Ambilly** : Prix : 850-1150 CHF. » → « **Ambilly** : Prix : 500-750 €/mois. »
-- [23] colocation-annemasse-ville-la-grand-ambilly/fr · FAITS : « Loyer bizarrement bas (moins de 750 CHF une belle chambre)? » → « Loyer bizarrement bas (bien en dessous de 550 € pour une belle chambre)? »
-- [24] colocation-annemasse-ville-la-grand-ambilly/fr · FAITS : « Demander 200 CHF de baisse sur un 1000 CHF. » → « Demander 20 % de baisse sur le loyer. »
-- [25] colocation-annemasse-ville-la-grand-ambilly/en · FAITS : « **Annemasse center (near station)**: Price: 1000-1400 CHF. » → « **Annemasse center (near station)**: Price: 600-800 €/month. »
-- [26] colocation-annemasse-ville-la-grand-ambilly/en · FAITS : « **Annemasse North**: Price: 950-1250 CHF. » → « **Annemasse North**: Price: 550-750 €/month. »
-- [27] colocation-annemasse-ville-la-grand-ambilly/en · FAITS : « **Ville-la-Grand**: Price: 900-1250 CHF. » → « **Ville-la-Grand**: Price: 500-700 €/month. »
-- [28] colocation-annemasse-ville-la-grand-ambilly/en · FAITS : « **Ambilly**: Price: 850-1150 CHF. » → « **Ambilly**: Price: 500-750 €/month. »
-- [29] colocation-annemasse-ville-la-grand-ambilly/en · FAITS : « Price weirdly low (less than 750 CHF nice room)? » → « Price weirdly low (well under 550 € for a nice room)? »
-- [30] colocation-annemasse-ville-la-grand-ambilly/en · FAITS : « Ask 200 CHF off a 1000 CHF rent. » → « Ask for 20% off the rent. »
-- [31] lodge-annemasse-coliving-premium-portes-geneve/fr, excerpt_fr · FAITS : « 1 370 CHF/mois tout inclus » → « 1 430 CHF/mois tout inclus »
-- [32] lodge-annemasse-coliving-premium-portes-geneve/en, excerpt_en · FAITS : « all-inclusive at CHF 1,370/month » → « all-inclusive at CHF 1,430/month »
-- [33] lodge-annemasse-coliving-premium-portes-geneve/fr, meta_description_fr · FAITS : « 1 370 CHF/mois tout inclus » → « 1 430 CHF/mois tout inclus »
-- [34] lodge-annemasse-coliving-premium-portes-geneve/en, meta_description_en · FAITS : « all-inclusive at CHF 1,370/month » → « all-inclusive at CHF 1,430/month »
-- [35] coliving-transfrontalier-geneve-annemasse-nouvelle-vie/fr, meta_description_fr · FAITS : « , 1 370 CHF tout compris, » → « , dès 1 370 CHF tout compris, »
-- [36] coliving-transfrontalier-geneve-annemasse-nouvelle-vie/en, meta_description_en · FAITS : « , 1,370 CHF all-inclusive, » → « , from 1,370 CHF all-inclusive, »

COMMIT;

-- ── Vérification (lecture seule) : une ligne par article ; fr_ok / en_ok = true quand toutes les modifications de la langue sont en place, NULL = langue non touchée.
SELECT slug,
  CASE slug
    WHEN 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie' THEN (position($f$, 1 370 CHF tout compris,$f$ IN meta_description_fr) = 0)
    WHEN 'colocation-annemasse-ville-la-grand-ambilly' THEN (position($f$**Annemasse centre (près de la gare)** : Prix : 1000-1400 CHF.$f$ IN content_fr) = 0
      AND position($f$**Annemasse Nord** : Prix : 950-1250 CHF.$f$ IN content_fr) = 0
      AND position($f$**Ville-la-Grand** : Prix : 900-1250 CHF.$f$ IN content_fr) = 0
      AND position($f$**Ambilly** : Prix : 850-1150 CHF.$f$ IN content_fr) = 0
      AND position($f$Loyer bizarrement bas (moins de 750 CHF une belle chambre)?$f$ IN content_fr) = 0
      AND position($f$Demander 200 CHF de baisse sur un 1000 CHF.$f$ IN content_fr) = 0)
    WHEN 'fiscalite-frontalier-geneve-impots-2026' THEN (position($f$Avec un loyer coliving à 1 370 CHF, il te reste$f$ IN content_fr) = 0
      AND position($f$Le loyer du coliving à 1 370 CHF tout inclus est$f$ IN content_fr) = 0
      AND position($f$- [Budget colocation près de Genève : le guide complet](/blog/budget-colocation-geneve-guide-complet)
$f$ IN content_fr) = 0)
    WHEN 'lodge-annemasse-coliving-premium-portes-geneve' THEN (position($f$1 370 CHF/mois tout inclus$f$ IN excerpt_fr) = 0
      AND position($f$1 370 CHF/mois tout inclus$f$ IN meta_description_fr) = 0)
    WHEN 'ou-habiter-frontalier-suisse-villes-france-pas-cher' THEN (position($f$veulent **éviter les démarches** (dossier de location, garant, caution, ameublement, branchements)$f$ IN content_fr) = 0
      AND position($f$tu arrives avec ta valise et tu pars quand tu veux : chambre meublée, charges, WiFi fibre, ménage, salle de sport, piscine — **tout est inclus**, dès 1 370 CHF/mois. Idéal pour$f$ IN content_fr) = 0
      AND position($f$*À lire aussi :*
- Les meilleurs quartiers frontaliers de Genève
$f$ IN content_fr) = 0)
    WHEN 'salaire-suisse-net-frontalier-2026' THEN (position($f$> **Attention nouvelle règle 2024+** : si tu fais plus de 40 % de télétravail depuis la France, tu bascules sur l'imposition française — beaucoup moins avantageuse. On détaille tout dans$f$ IN content_fr) = 0
      AND position($f$(jusqu'à 7 056 CHF/an en 2026 pour un salarié)$f$ IN content_fr) = 0
      AND position($f$### 1. Le 3e pilier 3a si tu peux y accéder
Les frontaliers travaillant à Genève ne peuvent généralement pas y souscrire (sauf statut de quasi-résident). Mais si tu y as droit, le plafond 2026$f$ IN content_fr) = 0)
  END AS fr_ok,
  CASE slug
    WHEN 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie' THEN (position($f$, 1,370 CHF all-inclusive,$f$ IN meta_description_en) = 0)
    WHEN 'colocation-annemasse-ville-la-grand-ambilly' THEN (position($f$**Annemasse center (near station)**: Price: 1000-1400 CHF.$f$ IN content_en) = 0
      AND position($f$**Annemasse North**: Price: 950-1250 CHF.$f$ IN content_en) = 0
      AND position($f$**Ville-la-Grand**: Price: 900-1250 CHF.$f$ IN content_en) = 0
      AND position($f$**Ambilly**: Price: 850-1150 CHF.$f$ IN content_en) = 0
      AND position($f$Price weirdly low (less than 750 CHF nice room)?$f$ IN content_en) = 0
      AND position($f$Ask 200 CHF off a 1000 CHF rent.$f$ IN content_en) = 0)
    WHEN 'fiscalite-frontalier-geneve-impots-2026' THEN (position($f$With coliving rent at 1,370 CHF, you have$f$ IN content_en) = 0
      AND position($f$The all-inclusive coliving rent of 1,370 CHF is$f$ IN content_en) = 0
      AND position($f$- [Shared housing budget near Geneva: the complete guide](/en/blog/budget-colocation-geneve-guide-complet)
$f$ IN content_en) = 0)
    WHEN 'lodge-annemasse-coliving-premium-portes-geneve' THEN (position($f$all-inclusive at CHF 1,370/month$f$ IN excerpt_en) = 0
      AND position($f$all-inclusive at CHF 1,370/month$f$ IN meta_description_en) = 0)
    WHEN 'ou-habiter-frontalier-suisse-villes-france-pas-cher' THEN (position($f$# Where to live as a Geneva cross-border worker? The guide to 7 French towns

$f$ IN content_en) = 0
      AND position($f$want to **skip the paperwork** (rental file, guarantor, deposit, furnishing, utility hookups)$f$ IN content_en) = 0
      AND position($f$you arrive with your suitcase and you leave when you want: furnished room, utilities, fiber WiFi, cleaning, gym, pool — **everything included**, from 1,370 CHF/month. Ideal for$f$ IN content_en) = 0
      AND position($f$*Also read:*
- The best cross-border neighborhoods near Geneva
$f$ IN content_en) = 0)
    WHEN 'salaire-suisse-net-frontalier-2026' THEN (position($f$> **Watch out for the 40 % rule (2024+)**: if you remote-work more than 40 % from France, you flip to French taxation — much less favourable. Read$f$ IN content_en) = 0
      AND position($f$### 1. The 3rd pillar 3a if eligible
Most frontaliers can't use it (unless you have quasi-resident status). But if you can, the 2026 cap$f$ IN content_en) = 0)
  END AS en_ok
FROM blog_posts
WHERE slug IN ('coliving-transfrontalier-geneve-annemasse-nouvelle-vie', 'colocation-annemasse-ville-la-grand-ambilly', 'fiscalite-frontalier-geneve-impots-2026', 'lodge-annemasse-coliving-premium-portes-geneve', 'ou-habiter-frontalier-suisse-villes-france-pas-cher', 'salaire-suisse-net-frontalier-2026')
ORDER BY slug;

-- ── Retour arrière (inverse exact, mêmes gardes miroir) : retirer les deux lignes /* et */ puis exécuter le bloc.
/*
BEGIN;

UPDATE blog_posts
SET meta_description_en = replace(meta_description_en, $r$, from 1,370 CHF all-inclusive,$r$, $f$, 1,370 CHF all-inclusive,$f$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($r$, from 1,370 CHF all-inclusive,$r$ IN meta_description_en) > 0
  AND position($f$, 1,370 CHF all-inclusive,$f$ IN meta_description_en) = 0;

UPDATE blog_posts
SET meta_description_fr = replace(meta_description_fr, $r$, dès 1 370 CHF tout compris,$r$, $f$, 1 370 CHF tout compris,$f$),
    updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND position($r$, dès 1 370 CHF tout compris,$r$ IN meta_description_fr) > 0
  AND position($f$, 1 370 CHF tout compris,$f$ IN meta_description_fr) = 0;

UPDATE blog_posts
SET meta_description_en = replace(meta_description_en, $r$all-inclusive at CHF 1,430/month$r$, $f$all-inclusive at CHF 1,370/month$f$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($r$all-inclusive at CHF 1,430/month$r$ IN meta_description_en) > 0
  AND position($f$all-inclusive at CHF 1,370/month$f$ IN meta_description_en) = 0;

UPDATE blog_posts
SET meta_description_fr = replace(meta_description_fr, $r$1 430 CHF/mois tout inclus$r$, $f$1 370 CHF/mois tout inclus$f$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($r$1 430 CHF/mois tout inclus$r$ IN meta_description_fr) > 0
  AND position($f$1 370 CHF/mois tout inclus$f$ IN meta_description_fr) = 0;

UPDATE blog_posts
SET excerpt_en = replace(excerpt_en, $r$all-inclusive at CHF 1,430/month$r$, $f$all-inclusive at CHF 1,370/month$f$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($r$all-inclusive at CHF 1,430/month$r$ IN excerpt_en) > 0
  AND position($f$all-inclusive at CHF 1,370/month$f$ IN excerpt_en) = 0;

UPDATE blog_posts
SET excerpt_fr = replace(excerpt_fr, $r$1 430 CHF/mois tout inclus$r$, $f$1 370 CHF/mois tout inclus$f$),
    updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND position($r$1 430 CHF/mois tout inclus$r$ IN excerpt_fr) > 0
  AND position($f$1 370 CHF/mois tout inclus$f$ IN excerpt_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Ask for 20% off the rent.$r$, $f$Ask 200 CHF off a 1000 CHF rent.$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$Ask for 20% off the rent.$r$ IN content_en) > 0
  AND position($f$Ask 200 CHF off a 1000 CHF rent.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Price weirdly low (well under 550 € for a nice room)?$r$, $f$Price weirdly low (less than 750 CHF nice room)?$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$Price weirdly low (well under 550 € for a nice room)?$r$ IN content_en) > 0
  AND position($f$Price weirdly low (less than 750 CHF nice room)?$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Ambilly**: Price: 500-750 €/month.$r$, $f$**Ambilly**: Price: 850-1150 CHF.$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$**Ambilly**: Price: 500-750 €/month.$r$ IN content_en) > 0
  AND position($f$**Ambilly**: Price: 850-1150 CHF.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Ville-la-Grand**: Price: 500-700 €/month.$r$, $f$**Ville-la-Grand**: Price: 900-1250 CHF.$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$**Ville-la-Grand**: Price: 500-700 €/month.$r$ IN content_en) > 0
  AND position($f$**Ville-la-Grand**: Price: 900-1250 CHF.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Annemasse North**: Price: 550-750 €/month.$r$, $f$**Annemasse North**: Price: 950-1250 CHF.$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$**Annemasse North**: Price: 550-750 €/month.$r$ IN content_en) > 0
  AND position($f$**Annemasse North**: Price: 950-1250 CHF.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Annemasse center (near station)**: Price: 600-800 €/month.$r$, $f$**Annemasse center (near station)**: Price: 1000-1400 CHF.$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$**Annemasse center (near station)**: Price: 600-800 €/month.$r$ IN content_en) > 0
  AND position($f$**Annemasse center (near station)**: Price: 1000-1400 CHF.$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Demander 20 % de baisse sur le loyer.$r$, $f$Demander 200 CHF de baisse sur un 1000 CHF.$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$Demander 20 % de baisse sur le loyer.$r$ IN content_fr) > 0
  AND position($f$Demander 200 CHF de baisse sur un 1000 CHF.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Loyer bizarrement bas (bien en dessous de 550 € pour une belle chambre)?$r$, $f$Loyer bizarrement bas (moins de 750 CHF une belle chambre)?$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$Loyer bizarrement bas (bien en dessous de 550 € pour une belle chambre)?$r$ IN content_fr) > 0
  AND position($f$Loyer bizarrement bas (moins de 750 CHF une belle chambre)?$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$**Ambilly** : Prix : 500-750 €/mois.$r$, $f$**Ambilly** : Prix : 850-1150 CHF.$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$**Ambilly** : Prix : 500-750 €/mois.$r$ IN content_fr) > 0
  AND position($f$**Ambilly** : Prix : 850-1150 CHF.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$**Ville-la-Grand** : Prix : 500-700 €/mois.$r$, $f$**Ville-la-Grand** : Prix : 900-1250 CHF.$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$**Ville-la-Grand** : Prix : 500-700 €/mois.$r$ IN content_fr) > 0
  AND position($f$**Ville-la-Grand** : Prix : 900-1250 CHF.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$**Annemasse Nord** : Prix : 550-750 €/mois.$r$, $f$**Annemasse Nord** : Prix : 950-1250 CHF.$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$**Annemasse Nord** : Prix : 550-750 €/mois.$r$ IN content_fr) > 0
  AND position($f$**Annemasse Nord** : Prix : 950-1250 CHF.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$**Annemasse centre (près de la gare)** : Prix : 600-800 €/mois.$r$, $f$**Annemasse centre (près de la gare)** : Prix : 1000-1400 CHF.$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$**Annemasse centre (près de la gare)** : Prix : 600-800 €/mois.$r$ IN content_fr) > 0
  AND position($f$**Annemasse centre (près de la gare)** : Prix : 1000-1400 CHF.$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$### 1. The 3rd pillar 3a, if you can deduct it
Every cross-border worker employed in Switzerland pays into the AVS and can therefore open a 3a, even though many banks turn down non-residents. The tax deduction, however, is reserved for quasi-residents (subsequent ordinary taxation, at least 90 % of your income taxed in Switzerland). If you meet that condition, the 2026 cap$r$, $f$### 1. The 3rd pillar 3a if eligible
Most frontaliers can't use it (unless you have quasi-resident status). But if you can, the 2026 cap$f$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($r$### 1. The 3rd pillar 3a, if you can deduct it
Every cross-border worker employed in Switzerland pays into the AVS and can therefore open a 3a, even though many banks turn down non-residents. The tax deduction, however, is reserved for quasi-residents (subsequent ordinary taxation, at least 90 % of your income taxed in Switzerland). If you meet that condition, the 2026 cap$r$ IN content_en) > 0
  AND position($f$### 1. The 3rd pillar 3a if eligible
Most frontaliers can't use it (unless you have quasi-resident status). But if you can, the 2026 cap$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$> **Watch out for the 40 % rule**: above 40 % annual remote work from France, the share of your salary tied to your remote-work days becomes taxable in France, from the very first day. The threshold was made permanent by the Franco-Swiss tax amendment, applicable since 1 January 2026. Read$r$, $f$> **Watch out for the 40 % rule (2024+)**: if you remote-work more than 40 % from France, you flip to French taxation — much less favourable. Read$f$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($r$> **Watch out for the 40 % rule**: above 40 % annual remote work from France, the share of your salary tied to your remote-work days becomes taxable in France, from the very first day. The threshold was made permanent by the Franco-Swiss tax amendment, applicable since 1 January 2026. Read$r$ IN content_en) > 0
  AND position($f$> **Watch out for the 40 % rule (2024+)**: if you remote-work more than 40 % from France, you flip to French taxation — much less favourable. Read$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$### 1. Le 3e pilier 3a, si tu peux le déduire
Tout frontalier salarié en Suisse cotise à l'AVS : il peut donc ouvrir un 3a, même si beaucoup de banques refusent les non-résidents. La déduction fiscale est en revanche réservée aux quasi-résidents (taxation ordinaire ultérieure, au moins 90 % de tes revenus imposés en Suisse). Si tu remplis cette condition, le plafond 2026$r$, $f$### 1. Le 3e pilier 3a si tu peux y accéder
Les frontaliers travaillant à Genève ne peuvent généralement pas y souscrire (sauf statut de quasi-résident). Mais si tu y as droit, le plafond 2026$f$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($r$### 1. Le 3e pilier 3a, si tu peux le déduire
Tout frontalier salarié en Suisse cotise à l'AVS : il peut donc ouvrir un 3a, même si beaucoup de banques refusent les non-résidents. La déduction fiscale est en revanche réservée aux quasi-résidents (taxation ordinaire ultérieure, au moins 90 % de tes revenus imposés en Suisse). Si tu remplis cette condition, le plafond 2026$r$ IN content_fr) > 0
  AND position($f$### 1. Le 3e pilier 3a si tu peux y accéder
Les frontaliers travaillant à Genève ne peuvent généralement pas y souscrire (sauf statut de quasi-résident). Mais si tu y as droit, le plafond 2026$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$(jusqu'à 7 258 CHF/an en 2026 pour un salarié)$r$, $f$(jusqu'à 7 056 CHF/an en 2026 pour un salarié)$f$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($r$(jusqu'à 7 258 CHF/an en 2026 pour un salarié)$r$ IN content_fr) > 0
  AND position($f$(jusqu'à 7 056 CHF/an en 2026 pour un salarié)$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$> **Attention à la règle des 40 %** : au-delà de 40 % de télétravail annuel depuis la France, la part de ton salaire liée aux jours télétravaillés devient imposable en France, dès le premier jour. Ce seuil est pérennisé par l'avenant fiscal franco-suisse, applicable depuis le 1er janvier 2026. On détaille tout dans$r$, $f$> **Attention nouvelle règle 2024+** : si tu fais plus de 40 % de télétravail depuis la France, tu bascules sur l'imposition française — beaucoup moins avantageuse. On détaille tout dans$f$),
    updated_at = now()
WHERE slug = 'salaire-suisse-net-frontalier-2026'
  AND position($r$> **Attention à la règle des 40 %** : au-delà de 40 % de télétravail annuel depuis la France, la part de ton salaire liée aux jours télétravaillés devient imposable en France, dès le premier jour. Ce seuil est pérennisé par l'avenant fiscal franco-suisse, applicable depuis le 1er janvier 2026. On détaille tout dans$r$ IN content_fr) > 0
  AND position($f$> **Attention nouvelle règle 2024+** : si tu fais plus de 40 % de télétravail depuis la France, tu bascules sur l'imposition française — beaucoup moins avantageuse. On détaille tout dans$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$- [Swiss net salary 2026 for frontaliers](/en/blog/salaire-suisse-net-frontalier-2026)
$r$, $f$- [Shared housing budget near Geneva: the complete guide](/en/blog/budget-colocation-geneve-guide-complet)
$f$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($r$- [Swiss net salary 2026 for frontaliers](/en/blog/salaire-suisse-net-frontalier-2026)
$r$ IN content_en) > 0
  AND position($f$- [Shared housing budget near Geneva: the complete guide](/en/blog/budget-colocation-geneve-guide-complet)
$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$The all-inclusive coliving rent, from 1,370 CHF, is$r$, $f$The all-inclusive coliving rent of 1,370 CHF is$f$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($r$The all-inclusive coliving rent, from 1,370 CHF, is$r$ IN content_en) > 0
  AND position($f$The all-inclusive coliving rent of 1,370 CHF is$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$With a coliving room from 1,370 CHF, you have$r$, $f$With coliving rent at 1,370 CHF, you have$f$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($r$With a coliving room from 1,370 CHF, you have$r$ IN content_en) > 0
  AND position($f$With coliving rent at 1,370 CHF, you have$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$- [Salaire suisse net 2026 : guide frontalier](/blog/salaire-suisse-net-frontalier-2026)
$r$, $f$- [Budget colocation près de Genève : le guide complet](/blog/budget-colocation-geneve-guide-complet)
$f$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($r$- [Salaire suisse net 2026 : guide frontalier](/blog/salaire-suisse-net-frontalier-2026)
$r$ IN content_fr) > 0
  AND position($f$- [Budget colocation près de Genève : le guide complet](/blog/budget-colocation-geneve-guide-complet)
$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Le loyer du coliving, dès 1 370 CHF tout inclus, est$r$, $f$Le loyer du coliving à 1 370 CHF tout inclus est$f$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($r$Le loyer du coliving, dès 1 370 CHF tout inclus, est$r$ IN content_fr) > 0
  AND position($f$Le loyer du coliving à 1 370 CHF tout inclus est$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Avec une chambre en coliving dès 1 370 CHF, il te reste$r$, $f$Avec un loyer coliving à 1 370 CHF, il te reste$f$),
    updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND position($r$Avec une chambre en coliving dès 1 370 CHF, il te reste$r$ IN content_fr) > 0
  AND position($f$Avec un loyer coliving à 1 370 CHF, il te reste$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$*Also read:*
- [Annemasse neighbourhoods: where to live 2026](/en/blog/quartiers-annemasse-ou-vivre-selon-profil)
$r$, $f$*Also read:*
- The best cross-border neighborhoods near Geneva
$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$*Also read:*
- [Annemasse neighbourhoods: where to live 2026](/en/blog/quartiers-annemasse-ou-vivre-selon-profil)
$r$ IN content_en) > 0
  AND position($f$*Also read:*
- The best cross-border neighborhoods near Geneva
$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$you arrive with your suitcase: furnished room, utilities, fiber WiFi, cleaning, gym, pool — **everything included**, from 1,370 CHF/month. 12-month lease: you're free to leave at any time with 1 month's notice. Ideal for$r$, $f$you arrive with your suitcase and you leave when you want: furnished room, utilities, fiber WiFi, cleaning, gym, pool — **everything included**, from 1,370 CHF/month. Ideal for$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$you arrive with your suitcase: furnished room, utilities, fiber WiFi, cleaning, gym, pool — **everything included**, from 1,370 CHF/month. 12-month lease: you're free to leave at any time with 1 month's notice. Ideal for$r$ IN content_en) > 0
  AND position($f$you arrive with your suitcase and you leave when you want: furnished room, utilities, fiber WiFi, cleaning, gym, pool — **everything included**, from 1,370 CHF/month. Ideal for$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$want to **skip the paperwork** (furnishing, utility hookups, internet contract)$r$, $f$want to **skip the paperwork** (rental file, guarantor, deposit, furnishing, utility hookups)$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$want to **skip the paperwork** (furnishing, utility hookups, internet contract)$r$ IN content_en) > 0
  AND position($f$want to **skip the paperwork** (rental file, guarantor, deposit, furnishing, utility hookups)$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$$r$, $f$# Where to live as a Geneva cross-border worker? The guide to 7 French towns

$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$$r$ IN content_en) > 0
  AND position($f$# Where to live as a Geneva cross-border worker? The guide to 7 French towns

$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$*À lire aussi :*
- [Vivre à Annemasse : quel quartier choisir selon ton profil ?](/blog/quartiers-annemasse-ou-vivre-selon-profil)
$r$, $f$*À lire aussi :*
- Les meilleurs quartiers frontaliers de Genève
$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$*À lire aussi :*
- [Vivre à Annemasse : quel quartier choisir selon ton profil ?](/blog/quartiers-annemasse-ou-vivre-selon-profil)
$r$ IN content_fr) > 0
  AND position($f$*À lire aussi :*
- Les meilleurs quartiers frontaliers de Genève
$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$tu arrives avec ta valise : chambre meublée, charges, WiFi fibre, ménage, salle de sport, piscine — **tout est inclus**, dès 1 370 CHF/mois. Bail de 12 mois : tu es libre de partir à tout moment avec 1 mois de préavis. Idéal pour$r$, $f$tu arrives avec ta valise et tu pars quand tu veux : chambre meublée, charges, WiFi fibre, ménage, salle de sport, piscine — **tout est inclus**, dès 1 370 CHF/mois. Idéal pour$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$tu arrives avec ta valise : chambre meublée, charges, WiFi fibre, ménage, salle de sport, piscine — **tout est inclus**, dès 1 370 CHF/mois. Bail de 12 mois : tu es libre de partir à tout moment avec 1 mois de préavis. Idéal pour$r$ IN content_fr) > 0
  AND position($f$tu arrives avec ta valise et tu pars quand tu veux : chambre meublée, charges, WiFi fibre, ménage, salle de sport, piscine — **tout est inclus**, dès 1 370 CHF/mois. Idéal pour$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$veulent **éviter les démarches** (ameublement, ouverture des compteurs, abonnement internet)$r$, $f$veulent **éviter les démarches** (dossier de location, garant, caution, ameublement, branchements)$f$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($r$veulent **éviter les démarches** (ameublement, ouverture des compteurs, abonnement internet)$r$ IN content_fr) > 0
  AND position($f$veulent **éviter les démarches** (dossier de location, garant, caution, ameublement, branchements)$f$ IN content_fr) = 0;

COMMIT;
*/
