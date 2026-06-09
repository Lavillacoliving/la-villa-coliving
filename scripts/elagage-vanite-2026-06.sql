-- ════════════════════════════════════════════════════════════════════════
-- WS4 — Élagage des articles « vanité » coliving morts (RÉVERSIBLE)
-- Date : 2026-06-09   Projet Supabase : tefpynkdxxfiefpkgitz  (⚠️ vérifie le projet)
--
-- POURQUOI : 6 articles à 0-1 clic / <21 impressions sur 3 mois, sujets qui se
-- chevauchent (« le coliving c'est bien »). Ils diluent l'autorité du cluster et
-- alimentent le bucket « crawled - not indexed ». On les RETIRE de l'index en les
-- DÉPUBLIANT (is_published=false) — RÉVERSIBLE (pas de DELETE).
--
-- CONSERVÉS (ne PAS toucher) : coliving-annemasse-geneve-frontaliers-avantages
-- (4 clics/127 impr), hub coliving-geneve-frontaliers-guide-complet, et
-- optimiser-espace… / espaces-verts… (publiés le 09/06, trop récents pour juger).
--
-- Comme on DÉPUBLIE (et non DELETE), aucune contrainte FK blog_calendar à gérer :
-- les lignes de calendrier peuvent rester liées (rollback = repasser à true).
--
-- Lancer : Supabase → SQL Editor → New query → coller → Run.
-- Sauvegarde conseillée : exporter d'abord un CSV de ces 6 lignes.
-- ════════════════════════════════════════════════════════════════════════

-- ─── ÉTAPE 1 : APERÇU (état actuel des 6 articles ciblés) ───
SELECT slug, title_fr, is_published, published_at
FROM blog_posts
WHERE slug IN (
  'what-is-coliving-and-why-it-matters',
  'coliving-tendance-habitat-jeunes-professionnels-2024',
  'coliving-pour-qui-profil-ideal',
  'avantages-coliving-jeunes-professionnels',
  'vie-communautaire-coliving-temoignages',
  'coliving-communaute-reels-amis-geneve-annemasse'
)
ORDER BY slug;

-- ─── ÉTAPE 2 : DÉPUBLIER (réversible) ───
UPDATE blog_posts SET is_published = false
WHERE slug IN (
  'what-is-coliving-and-why-it-matters',
  'coliving-tendance-habitat-jeunes-professionnels-2024',
  'coliving-pour-qui-profil-ideal',
  'avantages-coliving-jeunes-professionnels',
  'vie-communautaire-coliving-temoignages',
  'coliving-communaute-reels-amis-geneve-annemasse'
);

-- ─── ÉTAPE 3 : Contrôle — les 6 doivent être is_published=false ───
SELECT slug, is_published
FROM blog_posts
WHERE slug IN (
  'what-is-coliving-and-why-it-matters',
  'coliving-tendance-habitat-jeunes-professionnels-2024',
  'coliving-pour-qui-profil-ideal',
  'avantages-coliving-jeunes-professionnels',
  'vie-communautaire-coliving-temoignages',
  'coliving-communaute-reels-amis-geneve-annemasse'
)
ORDER BY slug;

-- ─── ROLLBACK (si besoin) : repasser à true ───
-- UPDATE blog_posts SET is_published = true WHERE slug IN ( ...les 6 slugs... );

-- ════════════════════════════════════════════════════════════════════════
-- APRÈS EXÉCUTION (ordre important) :
--   1) Lancer ce SQL (les 6 passent à is_published=false).
--   2) Déployer (Action « Pre-render & Deploy ») : le prerender retire
--      automatiquement leurs rewrites + fichiers + entrées sitemap (il ne
--      pré-rend que les articles is_published=true). Les URLs tombent alors
--      sur le catch-all (soft-404).
--   3) Pour un retrait PROPRE (301 plutôt que soft-404), ajouter ces blocs à
--      vercel.json (section "redirects") AU MÊME DÉPLOIEMENT — à NE PAS ajouter
--      avant l'étape 1, sinon on redirige des articles encore publiés :
--
--   { "source": "/blog/what-is-coliving-and-why-it-matters", "destination": "/le-coliving", "permanent": true },
--   { "source": "/en/blog/what-is-coliving-and-why-it-matters", "destination": "/en/le-coliving", "permanent": true },
--   { "source": "/blog/coliving-tendance-habitat-jeunes-professionnels-2024", "destination": "/le-coliving", "permanent": true },
--   { "source": "/en/blog/coliving-tendance-habitat-jeunes-professionnels-2024", "destination": "/en/le-coliving", "permanent": true },
--   { "source": "/blog/coliving-pour-qui-profil-ideal", "destination": "/le-coliving", "permanent": true },
--   { "source": "/en/blog/coliving-pour-qui-profil-ideal", "destination": "/en/le-coliving", "permanent": true },
--   { "source": "/blog/avantages-coliving-jeunes-professionnels", "destination": "/le-coliving", "permanent": true },
--   { "source": "/en/blog/avantages-coliving-jeunes-professionnels", "destination": "/en/le-coliving", "permanent": true },
--   { "source": "/blog/vie-communautaire-coliving-temoignages", "destination": "/le-coliving", "permanent": true },
--   { "source": "/en/blog/vie-communautaire-coliving-temoignages", "destination": "/en/le-coliving", "permanent": true },
--   { "source": "/blog/coliving-communaute-reels-amis-geneve-annemasse", "destination": "/le-coliving", "permanent": true },
--   { "source": "/en/blog/coliving-communaute-reels-amis-geneve-annemasse", "destination": "/en/le-coliving", "permanent": true }
-- ════════════════════════════════════════════════════════════════════════
