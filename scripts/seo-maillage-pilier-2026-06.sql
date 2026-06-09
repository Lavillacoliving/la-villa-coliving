-- ============================================================
-- WS3 — Densification du maillage interne → /colocation-geneve (pilier en déclin)
-- Date : 2026-06-09   Projet Supabase : tefpynkdxxfiefpkgitz  (⚠️ vérifie le projet)
--
-- But : renforcer l'autorité interne de la page money /colocation-geneve en
--       ajoutant un lien contextuel ancré « colocation à Genève » dans le CORPS
--       des articles du cluster qualifié (frontalier / colocation / Annemasse).
--       Complète seo-maillage-colocation.sql (qui couvrait déjà 2 articles).
--
-- Méthode : APPEND en bas de contenu (sûr, idempotent — PAS de REPLACE risqué).
--   Garde-fou : on n'ajoute QUE si l'article ne pointe pas DÉJÀ vers le pilier
--   (NOT LIKE '%(/colocation-geneve)%') -> re-lançable sans doublon, et saute
--   automatiquement les 2 articles déjà traités + ceux ayant déjà un lien.
--   Tutoiement (règle éditoriale La Villa).
--
-- Lancer : Supabase → SQL Editor → New query → coller → Run.
-- ============================================================

-- ─── ÉTAPE 1 : APERÇU — quels articles vont recevoir le lien ? ───
SELECT slug, title_fr,
       (content_fr LIKE '%(/colocation-geneve)%') AS a_deja_le_lien
FROM blog_posts
WHERE is_published = true AND slug IN (
  'ou-habiter-frontalier-suisse-villes-france-pas-cher',
  'loyer-frontalier-geneve-combien-payer',
  'fiscalite-frontalier-geneve-impots-2026',
  'coliving-vs-colocation-differences',
  'trouver-colocation-geneve-frontalier',
  'dossier-location-frontalier-suisse-france',
  'chambre-meublee-annemasse-geneve',
  'colocation-expats-geneve-guide',
  '5-erreurs-logement-frontalier-geneve',
  'colocation-annemasse-ville-la-grand-ambilly',
  'coliving-annemasse-geneve-frontaliers-avantages',
  'organisations-internationales-geneve-ou-habiter'
)
ORDER BY slug;

-- ─── ÉTAPE 2 : ajout du lien contextuel (FR + EN, ancre ciblée) ───
UPDATE blog_posts SET
  content_fr = COALESCE(content_fr, '') ||
    E'\n\n---\n\n👉 **Tu cherches une [colocation à Genève](/colocation-geneve) ?** 29 chambres tout inclus dès 1 380 CHF/mois — charges, fibre, ménage comprises. Sans frais de dossier.',
  content_en = COALESCE(content_en, '') ||
    E'\n\n---\n\n👉 **Looking for [shared housing near Geneva](/colocation-geneve)?** 29 all-inclusive rooms from CHF 1,380/month — utilities, fiber and cleaning included. No application fee.'
WHERE is_published = true
  AND slug IN (
    'ou-habiter-frontalier-suisse-villes-france-pas-cher',
    'loyer-frontalier-geneve-combien-payer',
    'fiscalite-frontalier-geneve-impots-2026',
    'coliving-vs-colocation-differences',
    'trouver-colocation-geneve-frontalier',
    'dossier-location-frontalier-suisse-france',
    'chambre-meublee-annemasse-geneve',
    'colocation-expats-geneve-guide',
    '5-erreurs-logement-frontalier-geneve',
    'colocation-annemasse-ville-la-grand-ambilly',
    'coliving-annemasse-geneve-frontaliers-avantages',
    'organisations-internationales-geneve-ou-habiter'
  )
  AND content_fr NOT LIKE '%(/colocation-geneve)%';

-- ─── ÉTAPE 3 : Contrôle — tous doivent désormais pointer vers le pilier ───
SELECT slug,
       (content_fr LIKE '%[colocation à Genève](/colocation-geneve)%') AS lien_fr_ok,
       (content_en LIKE '%(/colocation-geneve)%')                      AS lien_en_ok
FROM blog_posts
WHERE is_published = true AND slug IN (
  'ou-habiter-frontalier-suisse-villes-france-pas-cher',
  'loyer-frontalier-geneve-combien-payer',
  'fiscalite-frontalier-geneve-impots-2026',
  'coliving-vs-colocation-differences',
  'trouver-colocation-geneve-frontalier',
  'dossier-location-frontalier-suisse-france',
  'chambre-meublee-annemasse-geneve',
  'colocation-expats-geneve-guide',
  '5-erreurs-logement-frontalier-geneve',
  'colocation-annemasse-ville-la-grand-ambilly',
  'coliving-annemasse-geneve-frontaliers-avantages',
  'organisations-internationales-geneve-ou-habiter'
)
ORDER BY slug;

-- ⚠️ Après exécution : déclencher un déploiement (Action « Pre-render & Deploy »)
--    pour régénérer le pré-rendu des articles avec le nouveau lien.
