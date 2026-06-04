-- ============================================================
-- D1 — Cannibalisation : dépublier les 6 articles "perdants"
-- Projet : tefpynkdxxfiefpkgitz  (⚠️ vérifie le bon projet en haut à gauche)
-- Les 301 vers les canoniques sont gérés dans vercel.json (déjà committé).
-- Une fois dépubliés : ils sortent du sitemap + du prérendu, et le 301 prend le relais.
-- Lancer : Supabase → SQL Editor → New query → coller → Run.
-- ⚠️ À lancer AVANT que je relance le build (sinon le prérendu les régénère).
-- ============================================================

UPDATE blog_posts SET is_published = false
WHERE slug IN (
  -- groupe 1 : guides coliving Genève → canonique 'coliving-geneve-frontaliers-guide-complet'
  'coliving-geneve-frontaliers-guide-2024',
  'coliving-geneve-frontalier-guide-complet',
  -- groupe 2 : coliving vs colocation → canonique 'coliving-vs-colocation-differences'
  'coliving-vs-colocation-choisir-mode-vie-geneve-frontalier',
  -- groupe 3 : 5 erreurs → canonique '5-erreurs-logement-frontalier-geneve'
  '5-erreurs-eviter-recherche-logement-frontalier',
  -- groupe 4 : coliving Annemasse → canonique 'coliving-annemasse-geneve-frontaliers-avantages'
  'annemasse-coliving-geneve-frontaliers-guide-complet',
  'coliving-annemasse-geneve-alternative-premium'
);

-- contrôle : les 4 canoniques = true, les 6 perdants = false
SELECT slug, is_published FROM blog_posts
WHERE slug IN (
  'coliving-geneve-frontaliers-guide-complet','coliving-vs-colocation-differences',
  '5-erreurs-logement-frontalier-geneve','coliving-annemasse-geneve-frontaliers-avantages',
  'coliving-geneve-frontaliers-guide-2024','coliving-geneve-frontalier-guide-complet',
  'coliving-vs-colocation-choisir-mode-vie-geneve-frontalier','5-erreurs-eviter-recherche-logement-frontalier',
  'annemasse-coliving-geneve-frontaliers-guide-complet','coliving-annemasse-geneve-alternative-premium'
)
ORDER BY is_published DESC, slug;
