-- ============================================================
-- WS5 — Renfort SEO de l'article « dossier de location frontalier »
-- Date : 2026-06-09   Projet Supabase : tefpynkdxxfiefpkgitz  (⚠️ vérifie le projet)
--
-- CONSTAT (vérifié via l'API Supabase le 09/06) : l'angle « louer sans garant
-- français / avec un contrat suisse » est DÉJÀ traité dans le CORPS de cet
-- article (« garant » ×7, « contrat de travail suisse » ×3, « sans garant » ×1).
-- => PAS besoin de créer un nouvel article (éviter le doublon).
--
-- SEUL VRAI MANQUE : ce mot-clé à forte intention (« sans garant français »)
-- n'apparaît PAS dans le title/meta -> l'article ne se positionne donc pas
-- dessus. On le fait remonter dans le title + la meta (sans toucher au corps).
--
-- Méthode : UPDATE surgical du title/meta FR+EN. Idempotent (ne s'applique que
-- si le title ne contient pas déjà « sans garant » / « No French Guarantor »).
-- Réversible : les valeurs actuelles sont documentées ci-dessous.
--
-- VALEURS ACTUELLES (pour rollback) :
--   title_fr : Dossier de location frontalier : ne pas se faire recaler
--   meta_fr  : Comment monter un dossier de location béton quand on est frontalier suisse. Pièces, conversion CHF/EUR, attestation employeur — le guide complet.
--   title_en : Cross-Border Rental Application: How Not to Get Rejected
--   meta_en  : How to build a solid rental application as a Swiss cross-border worker. Required documents, CHF/EUR conversion, employer certificate — the complete guide.
--
-- Lancer : Supabase → SQL Editor → New query → coller → Run.
-- ============================================================

-- ─── ÉTAPE 1 : APERÇU ───
SELECT slug, title_fr, title_en
FROM blog_posts
WHERE slug = 'dossier-location-frontalier-suisse-france';

-- ─── ÉTAPE 2 : optimiser title + meta (FR + EN) pour « sans garant » ───
UPDATE blog_posts SET
  title_fr = 'Louer en France sans garant français : le dossier du frontalier',
  meta_description_fr = 'Frontalier suisse sans garant français ? Monte un dossier de location béton : pièces, conversion CHF/EUR, contrat de travail suisse. Le guide complet.',
  title_en = 'Renting in France with No French Guarantor: The Cross-Border Guide',
  meta_description_en = 'Swiss cross-border worker with no French guarantor? Build a solid rental application: documents, CHF/EUR conversion, Swiss employment contract.'
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND title_fr NOT LIKE '%sans garant%';

-- ─── ÉTAPE 3 : Contrôle ───
SELECT slug, title_fr, title_en,
       (title_fr LIKE '%sans garant%') AS optimise_fr,
       (title_en LIKE '%No French Guarantor%') AS optimise_en
FROM blog_posts
WHERE slug = 'dossier-location-frontalier-suisse-france';

-- ⚠️ Après exécution : déployer pour régénérer le pré-rendu (title/meta).
--    Puis dans GSC : Inspection d'URL → Demander une indexation sur
--    /blog/dossier-location-frontalier-suisse-france (et la version /en/).
