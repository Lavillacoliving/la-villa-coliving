-- ════════════════════════════════════════════════════════════════════════
-- 08 — MAILLAGE INTERNE : repointer les liens vers les pages redirigées
-- À LANCER APRÈS les fusions (01-07), AVANT la dépublication (09).
-- Ne touche QUE l'URL des liens, garde le texte d'ancrage intact.
-- Projet Supabase : tefpynkdxxfiefpkgitz
-- ════════════════════════════════════════════════════════════════════════

-- ─── SECTION 1 : liens vers les 9 sources fusionnées → leur pilier ───
-- loyer-frontalier-geneve-combien-payer  →  /blog/budget-colocation-geneve-guide-complet   (10 article(s) concerné(s))
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/loyer-frontalier-geneve-combien-payer)', '](/blog/budget-colocation-geneve-guide-complet)'),
  content_en = replace(content_en, '](/en/blog/loyer-frontalier-geneve-combien-payer)', '](/en/blog/budget-colocation-geneve-guide-complet)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/loyer-frontalier-geneve-combien-payer)%' OR content_en LIKE '%](/en/blog/loyer-frontalier-geneve-combien-payer)%';

-- studio-geneve-vs-colocation-france-budget  →  /blog/budget-colocation-geneve-guide-complet   (2 article(s) concerné(s))
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/studio-geneve-vs-colocation-france-budget)', '](/blog/budget-colocation-geneve-guide-complet)'),
  content_en = replace(content_en, '](/en/blog/studio-geneve-vs-colocation-france-budget)', '](/en/blog/budget-colocation-geneve-guide-complet)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/studio-geneve-vs-colocation-france-budget)%' OR content_en LIKE '%](/en/blog/studio-geneve-vs-colocation-france-budget)%';

-- economies-coliving-tout-inclus-geneve  →  /blog/budget-colocation-geneve-guide-complet   (0 article(s) concerné(s))
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/economies-coliving-tout-inclus-geneve)', '](/blog/budget-colocation-geneve-guide-complet)'),
  content_en = replace(content_en, '](/en/blog/economies-coliving-tout-inclus-geneve)', '](/en/blog/budget-colocation-geneve-guide-complet)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/economies-coliving-tout-inclus-geneve)%' OR content_en LIKE '%](/en/blog/economies-coliving-tout-inclus-geneve)%';

-- meilleurs-quartiers-frontaliers-geneve  →  /blog/ou-habiter-frontalier-suisse-villes-france-pas-cher   (11 article(s) concerné(s))
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/meilleurs-quartiers-frontaliers-geneve)', '](/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)'),
  content_en = replace(content_en, '](/en/blog/meilleurs-quartiers-frontaliers-geneve)', '](/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/meilleurs-quartiers-frontaliers-geneve)%' OR content_en LIKE '%](/en/blog/meilleurs-quartiers-frontaliers-geneve)%';

-- chambre-meublee-annemasse-geneve  →  /blog/colocation-annemasse-ville-la-grand-ambilly   (7 article(s) concerné(s))
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/chambre-meublee-annemasse-geneve)', '](/blog/colocation-annemasse-ville-la-grand-ambilly)'),
  content_en = replace(content_en, '](/en/blog/chambre-meublee-annemasse-geneve)', '](/en/blog/colocation-annemasse-ville-la-grand-ambilly)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/chambre-meublee-annemasse-geneve)%' OR content_en LIKE '%](/en/blog/chambre-meublee-annemasse-geneve)%';

-- temps-trajet-annemasse-geneve-par-quartier  →  /blog/transport-annemasse-geneve-leman-express   (2 article(s) concerné(s))
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/temps-trajet-annemasse-geneve-par-quartier)', '](/blog/transport-annemasse-geneve-leman-express)'),
  content_en = replace(content_en, '](/en/blog/temps-trajet-annemasse-geneve-par-quartier)', '](/en/blog/transport-annemasse-geneve-leman-express)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/temps-trajet-annemasse-geneve-par-quartier)%' OR content_en LIKE '%](/en/blog/temps-trajet-annemasse-geneve-par-quartier)%';

-- geneve-sans-voiture-mobilite-douce-frontaliers  →  /blog/transport-annemasse-geneve-leman-express   (4 article(s) concerné(s))
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/geneve-sans-voiture-mobilite-douce-frontaliers)', '](/blog/transport-annemasse-geneve-leman-express)'),
  content_en = replace(content_en, '](/en/blog/geneve-sans-voiture-mobilite-douce-frontaliers)', '](/en/blog/transport-annemasse-geneve-leman-express)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/geneve-sans-voiture-mobilite-douce-frontaliers)%' OR content_en LIKE '%](/en/blog/geneve-sans-voiture-mobilite-douce-frontaliers)%';

-- arriver-seul-geneve-guide-30-jours  →  /blog/demenager-geneve-frontalier-checklist   (6 article(s) concerné(s))
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/arriver-seul-geneve-guide-30-jours)', '](/blog/demenager-geneve-frontalier-checklist)'),
  content_en = replace(content_en, '](/en/blog/arriver-seul-geneve-guide-30-jours)', '](/en/blog/demenager-geneve-frontalier-checklist)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/arriver-seul-geneve-guide-30-jours)%' OR content_en LIKE '%](/en/blog/arriver-seul-geneve-guide-30-jours)%';

-- 5-erreurs-logement-frontalier-geneve  →  /blog/arnaques-logement-frontalier-geneve-eviter   (5 article(s) concerné(s))
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/5-erreurs-logement-frontalier-geneve)', '](/blog/arnaques-logement-frontalier-geneve-eviter)'),
  content_en = replace(content_en, '](/en/blog/5-erreurs-logement-frontalier-geneve)', '](/en/blog/arnaques-logement-frontalier-geneve-eviter)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/5-erreurs-logement-frontalier-geneve)%' OR content_en LIKE '%](/en/blog/5-erreurs-logement-frontalier-geneve)%';

-- ─── SECTION 2 : supprimer les auto-liens créés dans les 5 piliers ───
-- (un pilier qui se retrouverait à pointer vers lui-même → on retire le lien,
--  on garde le texte). regexp_replace dénoue [texte](url) → texte.
UPDATE blog_posts SET
  content_fr = regexp_replace(content_fr, '\[([^\]]*)\]\(/blog/budget-colocation-geneve-guide-complet\)', '\1', 'g'),
  content_en = regexp_replace(content_en, '\[([^\]]*)\]\(/en/blog/budget-colocation-geneve-guide-complet\)', '\1', 'g'),
  updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet';

UPDATE blog_posts SET
  content_fr = regexp_replace(content_fr, '\[([^\]]*)\]\(/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher\)', '\1', 'g'),
  content_en = regexp_replace(content_en, '\[([^\]]*)\]\(/en/blog/ou-habiter-frontalier-suisse-villes-france-pas-cher\)', '\1', 'g'),
  updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher';

UPDATE blog_posts SET
  content_fr = regexp_replace(content_fr, '\[([^\]]*)\]\(/blog/colocation-annemasse-ville-la-grand-ambilly\)', '\1', 'g'),
  content_en = regexp_replace(content_en, '\[([^\]]*)\]\(/en/blog/colocation-annemasse-ville-la-grand-ambilly\)', '\1', 'g'),
  updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly';

UPDATE blog_posts SET
  content_fr = regexp_replace(content_fr, '\[([^\]]*)\]\(/blog/transport-annemasse-geneve-leman-express\)', '\1', 'g'),
  content_en = regexp_replace(content_en, '\[([^\]]*)\]\(/en/blog/transport-annemasse-geneve-leman-express\)', '\1', 'g'),
  updated_at = now()
WHERE slug = 'transport-annemasse-geneve-leman-express';

UPDATE blog_posts SET
  content_fr = regexp_replace(content_fr, '\[([^\]]*)\]\(/blog/arnaques-logement-frontalier-geneve-eviter\)', '\1', 'g'),
  content_en = regexp_replace(content_en, '\[([^\]]*)\]\(/en/blog/arnaques-logement-frontalier-geneve-eviter\)', '\1', 'g'),
  updated_at = now()
WHERE slug = 'arnaques-logement-frontalier-geneve-eviter';

-- ─── SECTION 3 : dette préexistante — liens vers des pages déjà redirigées ───
-- what-is-coliving-and-why-it-matters  →  /le-coliving   (1 article(s) concerné(s))
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/what-is-coliving-and-why-it-matters)', '](/le-coliving)'),
  content_en = replace(content_en, '](/en/blog/what-is-coliving-and-why-it-matters)', '](/en/le-coliving)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/what-is-coliving-and-why-it-matters)%' OR content_en LIKE '%](/en/blog/what-is-coliving-and-why-it-matters)%';

-- coliving-tendance-habitat-jeunes-professionnels-2024  →  /le-coliving   (0 article(s) concerné(s) — aucun live, sécurité)
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/coliving-tendance-habitat-jeunes-professionnels-2024)', '](/le-coliving)'),
  content_en = replace(content_en, '](/en/blog/coliving-tendance-habitat-jeunes-professionnels-2024)', '](/en/le-coliving)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/coliving-tendance-habitat-jeunes-professionnels-2024)%' OR content_en LIKE '%](/en/blog/coliving-tendance-habitat-jeunes-professionnels-2024)%';

-- coliving-pour-qui-profil-ideal  →  /le-coliving   (1 article(s) concerné(s))
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/coliving-pour-qui-profil-ideal)', '](/le-coliving)'),
  content_en = replace(content_en, '](/en/blog/coliving-pour-qui-profil-ideal)', '](/en/le-coliving)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/coliving-pour-qui-profil-ideal)%' OR content_en LIKE '%](/en/blog/coliving-pour-qui-profil-ideal)%';

-- avantages-coliving-jeunes-professionnels  →  /le-coliving   (1 article(s) concerné(s))
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/avantages-coliving-jeunes-professionnels)', '](/le-coliving)'),
  content_en = replace(content_en, '](/en/blog/avantages-coliving-jeunes-professionnels)', '](/en/le-coliving)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/avantages-coliving-jeunes-professionnels)%' OR content_en LIKE '%](/en/blog/avantages-coliving-jeunes-professionnels)%';

-- vie-communautaire-coliving-temoignages  →  /le-coliving   (1 article(s) concerné(s))
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/vie-communautaire-coliving-temoignages)', '](/le-coliving)'),
  content_en = replace(content_en, '](/en/blog/vie-communautaire-coliving-temoignages)', '](/en/le-coliving)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/vie-communautaire-coliving-temoignages)%' OR content_en LIKE '%](/en/blog/vie-communautaire-coliving-temoignages)%';

-- coliving-communaute-reels-amis-geneve-annemasse  →  /le-coliving   (0 article(s) concerné(s) — aucun live, sécurité)
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/coliving-communaute-reels-amis-geneve-annemasse)', '](/le-coliving)'),
  content_en = replace(content_en, '](/en/blog/coliving-communaute-reels-amis-geneve-annemasse)', '](/en/le-coliving)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/coliving-communaute-reels-amis-geneve-annemasse)%' OR content_en LIKE '%](/en/blog/coliving-communaute-reels-amis-geneve-annemasse)%';

-- coliving-geneve-frontaliers-guide-2024  →  /blog/coliving-geneve-frontaliers-guide-complet   (0 article(s) concerné(s) — aucun live, sécurité)
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/coliving-geneve-frontaliers-guide-2024)', '](/blog/coliving-geneve-frontaliers-guide-complet)'),
  content_en = replace(content_en, '](/en/blog/coliving-geneve-frontaliers-guide-2024)', '](/en/blog/coliving-geneve-frontaliers-guide-complet)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/coliving-geneve-frontaliers-guide-2024)%' OR content_en LIKE '%](/en/blog/coliving-geneve-frontaliers-guide-2024)%';

-- coliving-geneve-frontalier-guide-complet  →  /blog/coliving-geneve-frontaliers-guide-complet   (0 article(s) concerné(s) — aucun live, sécurité)
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/coliving-geneve-frontalier-guide-complet)', '](/blog/coliving-geneve-frontaliers-guide-complet)'),
  content_en = replace(content_en, '](/en/blog/coliving-geneve-frontalier-guide-complet)', '](/en/blog/coliving-geneve-frontaliers-guide-complet)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/coliving-geneve-frontalier-guide-complet)%' OR content_en LIKE '%](/en/blog/coliving-geneve-frontalier-guide-complet)%';

-- coliving-vs-colocation-choisir-mode-vie-geneve-frontalier  →  /blog/coliving-vs-colocation-differences   (0 article(s) concerné(s) — aucun live, sécurité)
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/coliving-vs-colocation-choisir-mode-vie-geneve-frontalier)', '](/blog/coliving-vs-colocation-differences)'),
  content_en = replace(content_en, '](/en/blog/coliving-vs-colocation-choisir-mode-vie-geneve-frontalier)', '](/en/blog/coliving-vs-colocation-differences)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/coliving-vs-colocation-choisir-mode-vie-geneve-frontalier)%' OR content_en LIKE '%](/en/blog/coliving-vs-colocation-choisir-mode-vie-geneve-frontalier)%';

-- annemasse-coliving-geneve-frontaliers-guide-complet  →  /blog/coliving-annemasse-geneve-frontaliers-avantages   (0 article(s) concerné(s) — aucun live, sécurité)
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/annemasse-coliving-geneve-frontaliers-guide-complet)', '](/blog/coliving-annemasse-geneve-frontaliers-avantages)'),
  content_en = replace(content_en, '](/en/blog/annemasse-coliving-geneve-frontaliers-guide-complet)', '](/en/blog/coliving-annemasse-geneve-frontaliers-avantages)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/annemasse-coliving-geneve-frontaliers-guide-complet)%' OR content_en LIKE '%](/en/blog/annemasse-coliving-geneve-frontaliers-guide-complet)%';

-- coliving-annemasse-geneve-alternative-premium  →  /blog/coliving-annemasse-geneve-frontaliers-avantages   (0 article(s) concerné(s) — aucun live, sécurité)
UPDATE blog_posts SET
  content_fr = replace(content_fr, '](/blog/coliving-annemasse-geneve-alternative-premium)', '](/blog/coliving-annemasse-geneve-frontaliers-avantages)'),
  content_en = replace(content_en, '](/en/blog/coliving-annemasse-geneve-alternative-premium)', '](/en/blog/coliving-annemasse-geneve-frontaliers-avantages)'),
  updated_at = now()
WHERE content_fr LIKE '%](/blog/coliving-annemasse-geneve-alternative-premium)%' OR content_en LIKE '%](/en/blog/coliving-annemasse-geneve-alternative-premium)%';

-- ─── CONTRÔLE : plus aucun lien interne vers une page redirigée ───
SELECT slug FROM blog_posts
WHERE is_published = true AND (
      content_fr LIKE '%](/blog/loyer-frontalier-geneve-combien-payer)%' OR content_en LIKE '%](/en/blog/loyer-frontalier-geneve-combien-payer)%' OR
      content_fr LIKE '%](/blog/studio-geneve-vs-colocation-france-budget)%' OR content_en LIKE '%](/en/blog/studio-geneve-vs-colocation-france-budget)%' OR
      content_fr LIKE '%](/blog/economies-coliving-tout-inclus-geneve)%' OR content_en LIKE '%](/en/blog/economies-coliving-tout-inclus-geneve)%' OR
      content_fr LIKE '%](/blog/meilleurs-quartiers-frontaliers-geneve)%' OR content_en LIKE '%](/en/blog/meilleurs-quartiers-frontaliers-geneve)%' OR
      content_fr LIKE '%](/blog/chambre-meublee-annemasse-geneve)%' OR content_en LIKE '%](/en/blog/chambre-meublee-annemasse-geneve)%' OR
      content_fr LIKE '%](/blog/temps-trajet-annemasse-geneve-par-quartier)%' OR content_en LIKE '%](/en/blog/temps-trajet-annemasse-geneve-par-quartier)%' OR
      content_fr LIKE '%](/blog/geneve-sans-voiture-mobilite-douce-frontaliers)%' OR content_en LIKE '%](/en/blog/geneve-sans-voiture-mobilite-douce-frontaliers)%' OR
      content_fr LIKE '%](/blog/arriver-seul-geneve-guide-30-jours)%' OR content_en LIKE '%](/en/blog/arriver-seul-geneve-guide-30-jours)%' OR
      content_fr LIKE '%](/blog/5-erreurs-logement-frontalier-geneve)%' OR content_en LIKE '%](/en/blog/5-erreurs-logement-frontalier-geneve)%' OR
      content_fr LIKE '%](/blog/what-is-coliving-and-why-it-matters)%' OR content_en LIKE '%](/en/blog/what-is-coliving-and-why-it-matters)%' OR
      content_fr LIKE '%](/blog/coliving-tendance-habitat-jeunes-professionnels-2024)%' OR content_en LIKE '%](/en/blog/coliving-tendance-habitat-jeunes-professionnels-2024)%' OR
      content_fr LIKE '%](/blog/coliving-pour-qui-profil-ideal)%' OR content_en LIKE '%](/en/blog/coliving-pour-qui-profil-ideal)%' OR
      content_fr LIKE '%](/blog/avantages-coliving-jeunes-professionnels)%' OR content_en LIKE '%](/en/blog/avantages-coliving-jeunes-professionnels)%' OR
      content_fr LIKE '%](/blog/vie-communautaire-coliving-temoignages)%' OR content_en LIKE '%](/en/blog/vie-communautaire-coliving-temoignages)%' OR
      content_fr LIKE '%](/blog/coliving-communaute-reels-amis-geneve-annemasse)%' OR content_en LIKE '%](/en/blog/coliving-communaute-reels-amis-geneve-annemasse)%' OR
      content_fr LIKE '%](/blog/coliving-geneve-frontaliers-guide-2024)%' OR content_en LIKE '%](/en/blog/coliving-geneve-frontaliers-guide-2024)%' OR
      content_fr LIKE '%](/blog/coliving-geneve-frontalier-guide-complet)%' OR content_en LIKE '%](/en/blog/coliving-geneve-frontalier-guide-complet)%' OR
      content_fr LIKE '%](/blog/coliving-vs-colocation-choisir-mode-vie-geneve-frontalier)%' OR content_en LIKE '%](/en/blog/coliving-vs-colocation-choisir-mode-vie-geneve-frontalier)%' OR
      content_fr LIKE '%](/blog/annemasse-coliving-geneve-frontaliers-guide-complet)%' OR content_en LIKE '%](/en/blog/annemasse-coliving-geneve-frontaliers-guide-complet)%' OR
      content_fr LIKE '%](/blog/coliving-annemasse-geneve-alternative-premium)%' OR content_en LIKE '%](/en/blog/coliving-annemasse-geneve-alternative-premium)%'
);  -- doit renvoyer 0 ligne
