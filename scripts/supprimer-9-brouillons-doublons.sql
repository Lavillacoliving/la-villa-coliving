-- ════════════════════════════════════════════════════════════════════════
-- MÉNAGE — Suppression des 9 brouillons DOUBLONS (+ leurs entrées de calendrier)
-- Date : 2026-06-09
-- ⚠️ DELETE IRRÉVERSIBLE. À lancer par Jérôme (Supabase SQL Editor).
--    Sauvegarde = le CSV déjà exporté ("Fetch Unpublished Blog Posts.csv").
--
-- CONTEXTE : blog_calendar (calendrier éditorial) référence blog_posts via une
-- clé étrangère -> impossible de supprimer un post tant qu'une ligne de
-- calendrier pointe dessus. Les 9 entrées concernées sont des sujets DÉJÀ
-- COUVERTS par des articles publiés (doublons) -> on les retire d'abord.
--
-- Garde-fous : on ne touche QU'aux brouillons (is_published=false) listés.
-- On conserve les 2 brouillons à angle unique (#8 et #11, réécrits par ailleurs).
-- ════════════════════════════════════════════════════════════════════════

-- ─── ÉTAPE 1 : APERÇU (brouillons + entrées de calendrier liées) ───
SELECT p.slug, p.title_fr, c.id AS calendar_id, c.week_number, c.scheduled_date
FROM blog_posts p
LEFT JOIN blog_calendar c ON c.blog_post_id = p.id
WHERE p.is_published = false AND p.slug IN (
  '5-erreurs-eviter-recherche-logement-frontalier',
  'coliving-annemasse-geneve-alternative-premium',
  'coliving-geneve-frontalier-guide-complet',
  'coliving-geneve-frontaliers-guide-2024',
  'annemasse-coliving-geneve-frontaliers-guide-complet',
  'coliving-geneve-frontaliers-guide-complet-2024',
  'coliving-vs-colocation-choisir-mode-vie-geneve-frontalier',
  'coliving-geneve-annemasse-solution-logement-jeunes-professionnels',
  'coliving-vs-colocation-differences-avantages-geneve'
);

-- ─── ÉTAPE 2 : retirer les entrées de CALENDRIER des 9 doublons ───
-- (sujets déjà couverts par des articles publiés)
DELETE FROM blog_calendar
WHERE blog_post_id IN (
  SELECT id FROM blog_posts WHERE is_published = false AND slug IN (
    '5-erreurs-eviter-recherche-logement-frontalier',
    'coliving-annemasse-geneve-alternative-premium',
    'coliving-geneve-frontalier-guide-complet',
    'coliving-geneve-frontaliers-guide-2024',
    'annemasse-coliving-geneve-frontaliers-guide-complet',
    'coliving-geneve-frontaliers-guide-complet-2024',
    'coliving-vs-colocation-choisir-mode-vie-geneve-frontalier',
    'coliving-geneve-annemasse-solution-logement-jeunes-professionnels',
    'coliving-vs-colocation-differences-avantages-geneve'
  )
);

-- ─── ÉTAPE 3 : supprimer les 9 BROUILLONS ───
DELETE FROM blog_posts
WHERE is_published = false AND slug IN (
  '5-erreurs-eviter-recherche-logement-frontalier',
  'coliving-annemasse-geneve-alternative-premium',
  'coliving-geneve-frontalier-guide-complet',
  'coliving-geneve-frontaliers-guide-2024',
  'annemasse-coliving-geneve-frontaliers-guide-complet',
  'coliving-geneve-frontaliers-guide-complet-2024',
  'coliving-vs-colocation-choisir-mode-vie-geneve-frontalier',
  'coliving-geneve-annemasse-solution-logement-jeunes-professionnels',
  'coliving-vs-colocation-differences-avantages-geneve'
);

-- ─── ÉTAPE 4 : Vérification (doit rester 2 brouillons : #8 et #11) ───
SELECT slug, title_fr FROM blog_posts WHERE is_published = false ORDER BY slug;

-- ════════════════════════════════════════════════════════════════════════
-- VARIANTE — si tu préfères GARDER les 9 lignes de calendrier comme « plan »
-- (au lieu de les supprimer) : ne lance PAS l'ÉTAPE 2, mais celle-ci à la place
-- (elle délie sans supprimer), puis lance l'ÉTAPE 3 :
--
--   UPDATE blog_calendar SET blog_post_id = NULL, updated_at = NOW()
--   WHERE blog_post_id IN (SELECT id FROM blog_posts
--     WHERE is_published = false AND slug IN ( ...les 9 slugs ci-dessus... ));
--
-- ⚠️ Inconvénient : si ton automatisation (n8n) régénère les entrées de
-- calendrier sans article lié, elle pourrait recréer ces doublons.
-- Supprimer les entrées (ÉTAPE 2) est donc plus sûr contre la régénération.
-- ════════════════════════════════════════════════════════════════════════
