-- ============================================================================
-- B5 colocation Annemasse : lien d'ouverture vers la page argent
-- Généré le 2026-11-02T14:08:32.790Z par scripts/build-slots-sql.mjs depuis scripts/lotb-b5.edits.mjs
--   · chaînes relevées sur la base vivante le 02/11/2026
--   · ancres vérifiées sur le contenu vivant de blog_posts (REST anon, lecture seule) le 2026-11-02T14:08:32.788Z : exactement 1 occurrence de chaque ancien texte, nouveau texte absent
-- Après validation du diff par Jérôme (D-B0), dans la séance du lot B.
-- Idempotent : chaque UPDATE est gardé par position(ancien) > 0 [AND position(nouveau) = 0 quand le nouveau texte n'est pas un fragment de l'ancien] — relancer le fichier est sans effet.
-- Fichier UTF-8 — ne pas normaliser les espaces.
-- 2 modifications · 1 articles · état en base à la génération (updated_at · longueur fr / en) :
--   colocation-annemasse-ville-la-grand-ambilly · 2026-10-13T15:31:18.575275+00:00 · 8658 / 7739
-- ============================================================================

BEGIN;

-- [1/2] colocation-annemasse-ville-la-grand-ambilly (fr) · B5 · ouverture : ancre exacte « colocation à Annemasse » vers la page argent
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$Chercher une colocation près de Genève c'est un jeu de chasse.$f$, $r$Chercher une [colocation à Annemasse](/annemasse-colocation) ou ailleurs près de Genève, c'est un jeu de chasse.$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$Chercher une colocation près de Genève c'est un jeu de chasse.$f$ IN content_fr) > 0
  AND position($r$Chercher une [colocation à Annemasse](/annemasse-colocation) ou ailleurs près de Genève, c'est un jeu de chasse.$r$ IN content_fr) = 0;

-- [2/2] colocation-annemasse-ville-la-grand-ambilly (en) · B5 · opening: link to the money page
UPDATE blog_posts
SET content_en = replace(content_en, $f$Looking for a room in a flatshare in Annemasse, Ville-la-Grand or Ambilly, just across the border from Geneva?$f$, $r$Looking for a room in a [flatshare in Annemasse](/en/annemasse-colocation), Ville-la-Grand or Ambilly, just across the border from Geneva?$r$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($f$Looking for a room in a flatshare in Annemasse, Ville-la-Grand or Ambilly, just across the border from Geneva?$f$ IN content_en) > 0
  AND position($r$Looking for a room in a [flatshare in Annemasse](/en/annemasse-colocation), Ville-la-Grand or Ambilly, just across the border from Geneva?$r$ IN content_en) = 0;

-- ── Aperçu des ancrages (ancien → nouveau, première ligne de chaque texte) ──
-- [1] colocation-annemasse-ville-la-grand-ambilly/fr · B5 : « Chercher une colocation près de Genève c'est un jeu de chasse. » → « Chercher une [colocation à Annemasse](/annemasse-colocation) ou ailleur… »
-- [2] colocation-annemasse-ville-la-grand-ambilly/en · B5 : « Looking for a room in a flatshare in Annemasse, Ville-la-Grand or Ambil… » → « Looking for a room in a [flatshare in Annemasse](/en/annemasse-colocati… »

COMMIT;

-- ── Vérification (lecture seule) : une ligne par article ; fr_ok / en_ok = true quand toutes les modifications de la langue sont en place, NULL = langue non touchée.
SELECT slug,
  CASE slug
    WHEN 'colocation-annemasse-ville-la-grand-ambilly' THEN (position($f$Chercher une colocation près de Genève c'est un jeu de chasse.$f$ IN content_fr) = 0)
  END AS fr_ok,
  CASE slug
    WHEN 'colocation-annemasse-ville-la-grand-ambilly' THEN (position($f$Looking for a room in a flatshare in Annemasse, Ville-la-Grand or Ambilly, just across the border from Geneva?$f$ IN content_en) = 0)
  END AS en_ok
FROM blog_posts
WHERE slug IN ('colocation-annemasse-ville-la-grand-ambilly')
ORDER BY slug;

-- ── Retour arrière (inverse exact, mêmes gardes miroir) : retirer les deux lignes /* et */ puis exécuter le bloc.
/*
BEGIN;

UPDATE blog_posts
SET content_en = replace(content_en, $r$Looking for a room in a [flatshare in Annemasse](/en/annemasse-colocation), Ville-la-Grand or Ambilly, just across the border from Geneva?$r$, $f$Looking for a room in a flatshare in Annemasse, Ville-la-Grand or Ambilly, just across the border from Geneva?$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$Looking for a room in a [flatshare in Annemasse](/en/annemasse-colocation), Ville-la-Grand or Ambilly, just across the border from Geneva?$r$ IN content_en) > 0
  AND position($f$Looking for a room in a flatshare in Annemasse, Ville-la-Grand or Ambilly, just across the border from Geneva?$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$Chercher une [colocation à Annemasse](/annemasse-colocation) ou ailleurs près de Genève, c'est un jeu de chasse.$r$, $f$Chercher une colocation près de Genève c'est un jeu de chasse.$f$),
    updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly'
  AND position($r$Chercher une [colocation à Annemasse](/annemasse-colocation) ou ailleurs près de Genève, c'est un jeu de chasse.$r$ IN content_fr) > 0
  AND position($f$Chercher une colocation près de Genève c'est un jeu de chasse.$f$ IN content_fr) = 0;

COMMIT;
*/
