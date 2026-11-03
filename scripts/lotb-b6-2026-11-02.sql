-- ============================================================================
-- B6 quartiers : section « quartiers à éviter » en question
-- Généré le 2026-11-02T14:08:51.330Z par scripts/build-slots-sql.mjs depuis scripts/lotb-b6.edits.mjs
--   · chaînes relevées sur la base vivante le 02/11/2026
--   · ancres vérifiées sur le contenu vivant de blog_posts (REST anon, lecture seule) le 2026-11-02T14:08:51.329Z : exactement 1 occurrence de chaque ancien texte, nouveau texte absent
-- Après validation du diff par Jérôme (D-B0), dans la séance du lot B.
-- Idempotent : chaque UPDATE est gardé par position(ancien) > 0 [AND position(nouveau) = 0 quand le nouveau texte n'est pas un fragment de l'ancien] — relancer le fichier est sans effet.
-- Fichier UTF-8 — ne pas normaliser les espaces.
-- 2 modifications · 1 articles · état en base à la génération (updated_at · longueur fr / en) :
--   quartiers-annemasse-ou-vivre-selon-profil · 2026-11-02T12:54:15.442979+00:00 · 10031 / 8901
-- ============================================================================

BEGIN;

-- [1/2] quartiers-annemasse-ou-vivre-selon-profil (fr) · B6 · le H2 devient la question, réponse directe en tête ; sans Gaillard (garde du 09/10, D-B6)
UPDATE blog_posts
SET content_fr = replace(content_fr, $f$## Quels quartiers éviter, selon ton profil

Pas de « mauvais quartier » à Annemasse — mais des secteurs qui collent mal à certains besoins :$f$, $r$## Y a-t-il des quartiers à éviter à Annemasse ?

Pas au sens d'un quartier à fuir : ce qui change ton quotidien à Annemasse, c'est la distance à une gare ou à un arrêt de tram, et le bruit des grands axes. Voici les secteurs qui collent mal à certains besoins :$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$## Quels quartiers éviter, selon ton profil

Pas de « mauvais quartier » à Annemasse — mais des secteurs qui collent mal à certains besoins :$f$ IN content_fr) > 0
  AND position($r$## Y a-t-il des quartiers à éviter à Annemasse ?

Pas au sens d'un quartier à fuir : ce qui change ton quotidien à Annemasse, c'est la distance à une gare ou à un arrêt de tram, et le bruit des grands axes. Voici les secteurs qui collent mal à certains besoins :$r$ IN content_fr) = 0;

-- [2/2] quartiers-annemasse-ou-vivre-selon-profil (en) · B6 · the H2 becomes the question, direct answer first; no Gaillard (09/10 guard, D-B6)
UPDATE blog_posts
SET content_en = replace(content_en, $f$## Which areas to avoid, by profile

No "bad neighbourhood" in Annemasse — but areas that fit certain needs poorly:$f$, $r$## Are there areas to avoid in Annemasse?

Not in the sense of a place to steer clear of: what shapes your daily life in Annemasse is the distance to a station or a tram stop, and the noise of the main roads. These are the areas that fit some needs poorly:$r$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($f$## Which areas to avoid, by profile

No "bad neighbourhood" in Annemasse — but areas that fit certain needs poorly:$f$ IN content_en) > 0
  AND position($r$## Are there areas to avoid in Annemasse?

Not in the sense of a place to steer clear of: what shapes your daily life in Annemasse is the distance to a station or a tram stop, and the noise of the main roads. These are the areas that fit some needs poorly:$r$ IN content_en) = 0;

-- ── Aperçu des ancrages (ancien → nouveau, première ligne de chaque texte) ──
-- [1] quartiers-annemasse-ou-vivre-selon-profil/fr · B6 : « ## Quels quartiers éviter, selon ton profil⏎⏎Pas de « mauvais quartier … » → « ## Y a-t-il des quartiers à éviter à Annemasse ?⏎⏎Pas au sens d'un quar… »
-- [2] quartiers-annemasse-ou-vivre-selon-profil/en · B6 : « ## Which areas to avoid, by profile⏎⏎No "bad neighbourhood" in Annemass… » → « ## Are there areas to avoid in Annemasse?⏎⏎Not in the sense of a place … »

COMMIT;

-- ── Vérification (lecture seule) : une ligne par article ; fr_ok / en_ok = true quand toutes les modifications de la langue sont en place, NULL = langue non touchée.
SELECT slug,
  CASE slug
    WHEN 'quartiers-annemasse-ou-vivre-selon-profil' THEN (position($f$## Quels quartiers éviter, selon ton profil

Pas de « mauvais quartier » à Annemasse — mais des secteurs qui collent mal à certains besoins :$f$ IN content_fr) = 0)
  END AS fr_ok,
  CASE slug
    WHEN 'quartiers-annemasse-ou-vivre-selon-profil' THEN (position($f$## Which areas to avoid, by profile

No "bad neighbourhood" in Annemasse — but areas that fit certain needs poorly:$f$ IN content_en) = 0)
  END AS en_ok
FROM blog_posts
WHERE slug IN ('quartiers-annemasse-ou-vivre-selon-profil')
ORDER BY slug;

-- ── Retour arrière (inverse exact, mêmes gardes miroir) : retirer les deux lignes /* et */ puis exécuter le bloc.
/*
BEGIN;

UPDATE blog_posts
SET content_en = replace(content_en, $r$## Are there areas to avoid in Annemasse?

Not in the sense of a place to steer clear of: what shapes your daily life in Annemasse is the distance to a station or a tram stop, and the noise of the main roads. These are the areas that fit some needs poorly:$r$, $f$## Which areas to avoid, by profile

No "bad neighbourhood" in Annemasse — but areas that fit certain needs poorly:$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$## Are there areas to avoid in Annemasse?

Not in the sense of a place to steer clear of: what shapes your daily life in Annemasse is the distance to a station or a tram stop, and the noise of the main roads. These are the areas that fit some needs poorly:$r$ IN content_en) > 0
  AND position($f$## Which areas to avoid, by profile

No "bad neighbourhood" in Annemasse — but areas that fit certain needs poorly:$f$ IN content_en) = 0;

UPDATE blog_posts
SET content_fr = replace(content_fr, $r$## Y a-t-il des quartiers à éviter à Annemasse ?

Pas au sens d'un quartier à fuir : ce qui change ton quotidien à Annemasse, c'est la distance à une gare ou à un arrêt de tram, et le bruit des grands axes. Voici les secteurs qui collent mal à certains besoins :$r$, $f$## Quels quartiers éviter, selon ton profil

Pas de « mauvais quartier » à Annemasse — mais des secteurs qui collent mal à certains besoins :$f$),
    updated_at = now()
WHERE slug = 'quartiers-annemasse-ou-vivre-selon-profil'
  AND position($r$## Y a-t-il des quartiers à éviter à Annemasse ?

Pas au sens d'un quartier à fuir : ce qui change ton quotidien à Annemasse, c'est la distance à une gare ou à un arrêt de tram, et le bruit des grands axes. Voici les secteurs qui collent mal à certains besoins :$r$ IN content_fr) > 0
  AND position($f$## Quels quartiers éviter, selon ton profil

Pas de « mauvais quartier » à Annemasse — mais des secteurs qui collent mal à certains besoins :$f$ IN content_fr) = 0;

COMMIT;
*/
