-- scripts/maj-article-ou-habiter-bail-2026-10-12.sql — correctif du run CI 38225424276 (12/10/2026, 08:57 UTC) :
-- la substitution [2/28] du lot « correctifs de faits du blog » avait inséré dans le CORPS de ou-habiter (FR/EN) la phrase
-- canonique du bail (« Bail de 12 mois : tu es libre de partir à tout moment avec 1 mois de préavis »), déjà portée par la
-- fiche entité de la page → garde check-entity-facts : « phrase canonique présente 2 fois (attendu 1) ». Le corps reprend une
-- reformulation (même fait, pas la phrase canonique), comme les tableaux des pages de décision. APPLIQUÉ le 12/10 à 08:59 UTC.
BEGIN;
UPDATE blog_posts
SET content_fr = replace(content_fr, $q$dès 1 370 CHF/mois. Bail de 12 mois : tu es libre de partir à tout moment avec 1 mois de préavis. Idéal pour$q$, $q$dès 1 370 CHF/mois, avec un bail de 12 mois et la liberté de partir quand tu veux moyennant un mois de préavis. Idéal pour$q$),
    content_en = replace(content_en, $q$from 1,370 CHF/month. 12-month lease: you're free to leave at any time with 1 month's notice. Ideal for$q$, $q$from 1,370 CHF/month, on a 12-month lease that leaves you free to move out whenever you want with one month's notice. Ideal for$q$),
    updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher'
  AND position($q$dès 1 370 CHF/mois. Bail de 12 mois : tu es libre de partir à tout moment avec 1 mois de préavis. Idéal pour$q$ IN content_fr) > 0
  AND position($q$from 1,370 CHF/month. 12-month lease: you're free to leave at any time with 1 month's notice. Ideal for$q$ IN content_en) > 0;
COMMIT;
-- Vérification : la phrase canonique n'apparaît plus dans le corps (0), la reformulation est présente
SELECT slug,
  (length(content_fr) - length(replace(content_fr, $q$Bail de 12 mois : tu es libre de partir à tout moment avec 1 mois de préavis$q$, ''))) / length($q$Bail de 12 mois : tu es libre de partir à tout moment avec 1 mois de préavis$q$) AS fr_canonique_corps,
  position($q$la liberté de partir quand tu veux moyennant un mois de préavis$q$ IN content_fr) > 0 AS fr_ok,
  position($q$free to move out whenever you want with one month's notice$q$ IN content_en) > 0 AS en_ok
FROM blog_posts WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher';
-- Retour arrière (gardé) : replace inverse des deux phrases.
