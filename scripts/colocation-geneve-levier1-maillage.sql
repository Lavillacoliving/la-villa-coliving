-- ════════════════════════════════════════════════════════════════════════
-- LEVIER 1 — Maillage interne ancré vers /colocation-geneve
-- Date : 2026-06-08
-- Objectif : pousser le mot-clé « colocation Genève » en concentrant des liens
-- internes ancrés vers la page cible, depuis 6 articles pertinents qui n'y
-- pointent pas encore. Ancres VARIÉES (anti sur-optimisation), CTA naturel.
-- Guard : on n'ajoute que si l'article ne lie pas déjà /colocation-geneve.
-- ════════════════════════════════════════════════════════════════════════

UPDATE blog_posts SET
  content_fr = content_fr || $$

👉 Pour aller plus loin : découvrez notre [colocation à Genève](/colocation-geneve) tout inclus, chambres meublées dès 1 380 CHF/mois.$$,
  content_en = content_en || $$

👉 Going further: discover our [shared housing in Geneva](/en/colocation-geneve), all-inclusive furnished rooms from 1,380 CHF/month.$$,
  updated_at = NOW()
WHERE slug = 'coliving-vs-colocation-differences' AND content_fr NOT LIKE '%(/colocation-geneve)%';

UPDATE blog_posts SET
  content_fr = content_fr || $$

👉 À voir aussi : notre [colocation tout inclus à Genève](/colocation-geneve), une alternative concrète au studio.$$,
  content_en = content_en || $$

👉 See also: our [all-inclusive shared housing in Geneva](/en/colocation-geneve), a concrete alternative to a studio.$$,
  updated_at = NOW()
WHERE slug = 'studio-geneve-vs-colocation-france-budget' AND content_fr NOT LIKE '%(/colocation-geneve)%';

UPDATE blog_posts SET
  content_fr = content_fr || $$

👉 Envie de concret ? Voir notre [colocation meublée à Genève](/colocation-geneve), tout compris dès 1 380 CHF/mois.$$,
  content_en = content_en || $$

👉 Want something concrete? See our [furnished shared housing in Geneva](/en/colocation-geneve), all-inclusive from 1,380 CHF/month.$$,
  updated_at = NOW()
WHERE slug = 'economies-coliving-tout-inclus-geneve' AND content_fr NOT LIKE '%(/colocation-geneve)%';

UPDATE blog_posts SET
  content_fr = content_fr || $$

👉 Pour comparer en conditions réelles : notre [colocation à Genève](/colocation-geneve), charges, services et fibre incluses.$$,
  content_en = content_en || $$

👉 To compare in real conditions: our [shared housing in Geneva](/en/colocation-geneve), utilities, services and fiber included.$$,
  updated_at = NOW()
WHERE slug = 'loyer-frontalier-geneve-combien-payer' AND content_fr NOT LIKE '%(/colocation-geneve)%';

UPDATE blog_posts SET
  content_fr = content_fr || $$

👉 Découvrez notre [colocation près de Genève](/colocation-geneve) : chambres privées meublées, espaces partagés, tout inclus.$$,
  content_en = content_en || $$

👉 Discover our [coliving near Geneva](/en/colocation-geneve): private furnished rooms, shared spaces, all-inclusive.$$,
  updated_at = NOW()
WHERE slug = 'coliving-geneve-frontaliers-guide-complet' AND content_fr NOT LIKE '%(/colocation-geneve)%';

UPDATE blog_posts SET
  content_fr = content_fr || $$

👉 Besoin d'un dossier simple ? Notre [colocation à Genève](/colocation-geneve) accepte les frontaliers sans garant français.$$,
  content_en = content_en || $$

👉 Need a simple application? Our [shared housing in Geneva](/en/colocation-geneve) accepts cross-border workers with no French guarantor.$$,
  updated_at = NOW()
WHERE slug = 'dossier-location-frontalier-suisse-france' AND content_fr NOT LIKE '%(/colocation-geneve)%';

-- ─── Vérification : ces 6 articles doivent désormais lier /colocation-geneve ───
SELECT slug, (content_fr LIKE '%(/colocation-geneve)%') AS lie_colocation_geneve
FROM blog_posts
WHERE slug IN ('coliving-vs-colocation-differences','studio-geneve-vs-colocation-france-budget',
  'economies-coliving-tout-inclus-geneve','loyer-frontalier-geneve-combien-payer',
  'coliving-geneve-frontaliers-guide-complet','dossier-location-frontalier-suisse-france')
ORDER BY slug;
-- (tous doivent afficher true)
