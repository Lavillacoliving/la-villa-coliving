-- ============================================================================
-- D-B6b quartiers : Gaillard retiré des zones où viser (optionnel)
-- Généré le 2026-11-02T14:08:33.663Z par scripts/build-slots-sql.mjs depuis scripts/lotb-b6-gaillard.edits.mjs
--   · chaînes relevées sur la base vivante le 02/11/2026
--   · ancres vérifiées sur le contenu vivant de blog_posts (REST anon, lecture seule) le 2026-11-02T14:08:33.662Z : exactement 1 occurrence de chaque ancien texte, nouveau texte absent
-- Après validation du diff par Jérôme (D-B0), dans la séance du lot B.
-- Idempotent : chaque UPDATE est gardé par position(ancien) > 0 [AND position(nouveau) = 0 quand le nouveau texte n'est pas un fragment de l'ancien] — relancer le fichier est sans effet.
-- Fichier UTF-8 — ne pas normaliser les espaces.
-- 4 modifications · 1 articles · état en base à la génération (updated_at · longueur fr / en) :
--   quartiers-annemasse-ou-vivre-selon-profil · 2026-11-02T12:54:15.442979+00:00 · 10031 / 8901
-- ============================================================================

BEGIN;

-- [1/4] quartiers-annemasse-ou-vivre-selon-profil (fr) · D-B6b · profil 2 : Gaillard n'est jamais une zone où chercher
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$**Où viser :** **Ambilly** et **Gaillard**. Depuis là,$f$, $r$**Où viser :** **Ambilly**, côté Moillesulaz. Depuis là,$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$**Où viser :** **Ambilly** et **Gaillard**. Depuis là,$f$ IN content_fr) > 0
  AND position($r$**Où viser :** **Ambilly**, côté Moillesulaz. Depuis là,$r$ IN content_fr) = 0;

-- [2/4] quartiers-annemasse-ou-vivre-selon-profil (en) · D-B6b · profile 2: Gaillard is never an area to look in
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Where to aim:** **Ambilly** and **Gaillard**. From there,$f$, $r$**Where to aim:** **Ambilly**, on the Moillesulaz side. From there,$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$**Where to aim:** **Ambilly** and **Gaillard**. From there,$f$ IN content_en) > 0
  AND position($r$**Where to aim:** **Ambilly**, on the Moillesulaz side. From there,$r$ IN content_en) = 0;

-- [3/4] quartiers-annemasse-ou-vivre-selon-profil (fr) · D-B6b · FAQ vélo
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$**Ambilly** ou **Gaillard**, près du poste-frontière de Moillesulaz :$f$, $r$**Ambilly**, près du poste-frontière de Moillesulaz :$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$**Ambilly** ou **Gaillard**, près du poste-frontière de Moillesulaz :$f$ IN content_fr) > 0
  AND position($r$**Ambilly**, près du poste-frontière de Moillesulaz :$r$ IN content_fr) = 0;

-- [4/4] quartiers-annemasse-ou-vivre-selon-profil (en) · D-B6b · bike FAQ
UPDATE blog_posts
SET content_en = replace(content_en, $f$**Ambilly** or **Gaillard**, near the Moillesulaz crossing:$f$, $r$**Ambilly**, near the Moillesulaz crossing:$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$**Ambilly** or **Gaillard**, near the Moillesulaz crossing:$f$ IN content_en) > 0
  AND position($r$**Ambilly**, near the Moillesulaz crossing:$r$ IN content_en) = 0;

-- ── Aperçu des ancrages (ancien → nouveau, première ligne de chaque texte) ──
-- [1] quartiers-annemasse-ou-vivre-selon-profil/fr · D-B6b : « **Où viser :** **Ambilly** et **Gaillard**. Depuis là, » → « **Où viser :** **Ambilly**, côté Moillesulaz. Depuis là, »
-- [2] quartiers-annemasse-ou-vivre-selon-profil/en · D-B6b : « **Where to aim:** **Ambilly** and **Gaillard**. From there, » → « **Where to aim:** **Ambilly**, on the Moillesulaz side. From there, »
-- [3] quartiers-annemasse-ou-vivre-selon-profil/fr · D-B6b : « **Ambilly** ou **Gaillard**, près du poste-frontière de Moillesulaz : » → « **Ambilly**, près du poste-frontière de Moillesulaz : »
-- [4] quartiers-annemasse-ou-vivre-selon-profil/en · D-B6b : « **Ambilly** or **Gaillard**, near the Moillesulaz crossing: » → « **Ambilly**, near the Moillesulaz crossing: »

COMMIT;

-- ── Vérification (lecture seule) : une ligne par article ; fr_ok / en_ok = true quand toutes les modifications de la langue sont en place, NULL = langue non touchée.
SELECT slug,
  CASE slug
    WHEN 'quartiers-annemasse-ou-vivre-selon-profil' THEN (position($f$**Où viser :** **Ambilly** et **Gaillard**. Depuis là,$f$ IN content_fr) = 0
      AND position($f$**Ambilly** ou **Gaillard**, près du poste-frontière de Moillesulaz :$f$ IN content_fr) = 0)
  END AS fr_ok,
  CASE slug
    WHEN 'quartiers-annemasse-ou-vivre-selon-profil' THEN (position($f$**Where to aim:** **Ambilly** and **Gaillard**. From there,$f$ IN content_en) = 0
      AND position($f$**Ambilly** or **Gaillard**, near the Moillesulaz crossing:$f$ IN content_en) = 0)
  END AS en_ok
FROM blog_posts
WHERE slug IN ('quartiers-annemasse-ou-vivre-selon-profil')
ORDER BY slug;

-- ── Retour arrière (inverse exact, mêmes gardes miroir) : retirer les deux lignes /* et */ puis exécuter le bloc.
/*
BEGIN;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Ambilly**, near the Moillesulaz crossing:$r$, $f$**Ambilly** or **Gaillard**, near the Moillesulaz crossing:$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$**Ambilly**, near the Moillesulaz crossing:$r$ IN content_en) > 0
  AND position($f$**Ambilly** or **Gaillard**, near the Moillesulaz crossing:$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$**Ambilly**, près du poste-frontière de Moillesulaz :$r$, $f$**Ambilly** ou **Gaillard**, près du poste-frontière de Moillesulaz :$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$**Ambilly**, près du poste-frontière de Moillesulaz :$r$ IN content_fr) > 0
  AND position($f$**Ambilly** ou **Gaillard**, près du poste-frontière de Moillesulaz :$f$ IN content_fr) = 0;

UPDATE blog_posts
SET content_en = replace(content_en, $r$**Where to aim:** **Ambilly**, on the Moillesulaz side. From there,$r$, $f$**Where to aim:** **Ambilly** and **Gaillard**. From there,$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$**Where to aim:** **Ambilly**, on the Moillesulaz side. From there,$r$ IN content_en) > 0
  AND position($f$**Where to aim:** **Ambilly** and **Gaillard**. From there,$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$**Où viser :** **Ambilly**, côté Moillesulaz. Depuis là,$r$, $f$**Où viser :** **Ambilly** et **Gaillard**. Depuis là,$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$**Où viser :** **Ambilly**, côté Moillesulaz. Depuis là,$r$ IN content_fr) > 0
  AND position($f$**Où viser :** **Ambilly** et **Gaillard**. Depuis là,$f$ IN content_fr) = 0;

COMMIT;
*/
