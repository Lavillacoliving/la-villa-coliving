-- ============================================================================
-- Alignement de C1 et C3 sur les décisions de Jérôme du 29/09/2026 (relecture de C4)
--   · plus d'engagement minimum de 3 mois (D5 révisée : bail de 12 mois, préavis d'un mois à tout moment)
--   · délai La Villa : 72 h dès le premier contact si une chambre est disponible
--   · prix La Villa en CHF suivis du loyer contractuel en euros (tokens {{PRIX_DES_EUR}} / {{PRIX_PRIVATIF_EUR}},
--     résolus par src/lib/contentTokens.ts — branche content/comparatif-profils, À MERGER DANS LA MÊME SÉANCE)
--   · C3 : loyer d'un T2 meublé côté France = 1 200 à 1 500 € charges comprises (annonces, septembre 2026)
--   · générateur n8n : consigne « bail » de blog_editorial_strategy v3 alignée
-- Chaque replace() est ciblé sur une phrase exacte ; le SELECT final doit renvoyer 0 reste.
-- ============================================================================
BEGIN;

-- C1 · S'installer à Genève
UPDATE public.blog_posts SET
  content_fr = replace(replace(replace(replace(content_fr,
    'Côté logement, un bail de trois mois minimum avec un mois de préavis, comme chez La Villa, limite le risque : tu n''es pas engagé sur une année.',
    'Côté logement, un bail avec un mois de préavis, comme chez La Villa, limite le risque : tu n''es pas engagé sur une année.'),
    'Si non, un bail de trois mois minimum, comme le nôtre, te laisse partir avec un mois de préavis sans avoir perdu l''année.',
    'Si non, un bail comme le nôtre te laisse partir avec un mois de préavis sans avoir perdu l''année.'),
    '| dès {{PRIX_DES}} tout inclus, {{PRIX_PRIVATIF}} avec salle d''eau privative | 1 à 2 semaines si une chambre est libre | Contrat de travail ou promesse d''embauche, pièce d''identité, caution {{CAUTION_MOIS}} mois hors charges | 3 mois |',
    '| dès {{PRIX_DES}}/{{PRIX_DES_EUR}} tout inclus, {{PRIX_PRIVATIF}}/{{PRIX_PRIVATIF_EUR}} avec salle d''eau privative | 72 h dès le premier contact si une chambre est disponible | Contrat de travail ou promesse d''embauche, pièce d''identité, caution {{CAUTION_MOIS}} mois hors charges | aucune : bail de 12 mois, préavis d''un mois |'),
    'le délai médian entre la candidature et l''emménagement est de trente jours (données 2026), une semaine suffit quand la chambre est prête.',
    'le délai médian entre la candidature et l''emménagement est de trente jours (données 2026), et 72 h suffisent dès le premier contact quand une chambre est disponible.'),
  content_en = replace(replace(replace(replace(content_en,
    'On the housing side, a lease with a three-month minimum and one month''s notice, like La Villa''s, limits the risk: you are not committed for a year.',
    'On the housing side, a lease with one month''s notice, like La Villa''s, limits the risk: you are not committed for a year.'),
    'If not, a lease with a three-month minimum, like ours, lets you leave with one month''s notice without having lost the year.',
    'If not, a lease like ours lets you leave with one month''s notice without having lost the year.'),
    '| from {{PRIX_DES}} all-inclusive, {{PRIX_PRIVATIF}} with a private shower room | 1 to 2 weeks if a room is free | Employment contract or job offer, ID, deposit of {{CAUTION_MOIS}} months excluding charges | 3 months |',
    '| from {{PRIX_DES}}/{{PRIX_DES_EUR}} all-inclusive, {{PRIX_PRIVATIF}}/{{PRIX_PRIVATIF_EUR}} with a private shower room | 72 h from first contact if a room is available | Employment contract or job offer, ID, deposit of {{CAUTION_MOIS}} months excluding charges | none: 12-month lease, one month''s notice |'),
    'is thirty days (2026 data), and one week is enough when the room is ready.',
    'is thirty days (2026 data), and 72 h from your first contact are enough when a room is available.'),
  updated_at = now()
WHERE slug = 's-installer-a-geneve-expatrie-cote-suisse-ou-cote-france';

-- C3 · Vivre à Annemasse
UPDATE public.blog_posts SET
  content_fr = replace(replace(replace(content_fr,
    '| dès {{PRIX_DES}} tout inclus, {{PRIX_PRIVATIF}} avec salle d''eau privative | 1 à 2 semaines si une chambre est libre | Contrat de travail ou promesse d''embauche, pièce d''identité, caution {{CAUTION_MOIS}} mois hors charges | 3 mois |',
    '| dès {{PRIX_DES}}/{{PRIX_DES_EUR}} tout inclus, {{PRIX_PRIVATIF}}/{{PRIX_PRIVATIF_EUR}} avec salle d''eau privative | 72 h dès le premier contact si une chambre est disponible | Contrat de travail ou promesse d''embauche, pièce d''identité, caution {{CAUTION_MOIS}} mois hors charges | aucune : bail de 12 mois, préavis d''un mois |'),
    'un deux-pièces meublé 900 à 1 150 € (portails et Observatoire, 2026).',
    'un deux-pièces meublé 1 200 à 1 500 € charges comprises (annonces, septembre 2026).'),
    '| Studio ou T2 meublé à Annemasse | 650 à 1 150 € hors charges (ordres de grandeur 2026, portails et Observatoire) |',
    '| Studio ou T2 meublé à Annemasse | 650 à 820 € hors charges pour un studio, 1 200 à 1 500 € charges comprises pour un T2 (annonces, 2026) |'),
  content_en = replace(replace(replace(content_en,
    '| from {{PRIX_DES}} all-inclusive, {{PRIX_PRIVATIF}} with a private shower room | 1 to 2 weeks if a room is free | Employment contract or job offer, ID, deposit of {{CAUTION_MOIS}} months excluding charges | 3 months |',
    '| from {{PRIX_DES}}/{{PRIX_DES_EUR}} all-inclusive, {{PRIX_PRIVATIF}}/{{PRIX_PRIVATIF_EUR}} with a private shower room | 72 h from first contact if a room is available | Employment contract or job offer, ID, deposit of {{CAUTION_MOIS}} months excluding charges | none: 12-month lease, one month''s notice |'),
    'a furnished one-bedroom flat for 900 to 1,150 € (portals and Observatory, 2026).',
    'a furnished one-bedroom flat for 1,200 to 1,500 € including charges (listings, September 2026).'),
    '| Furnished studio or one-bedroom flat in Annemasse | 650 to 1,150 € excluding charges (2026 orders of magnitude, portals and Observatory) |',
    '| Furnished studio or one-bedroom flat in Annemasse | 650 to 820 € excluding charges for a studio, 1,200 to 1,500 € including charges for a one-bedroom flat (listings, 2026) |'),
  updated_at = now()
WHERE slug = 'vivre-a-annemasse-quand-on-travaille-a-geneve';

-- Générateur de blog (n8n) : consigne « bail » de la stratégie éditoriale active
UPDATE public.blog_editorial_strategy SET
  content_md = replace(content_md,
    'bail : « Bail de 12 mois. Engagement minimum de 3 mois, puis 1 mois de préavis. »',
    'bail : « Bail de 12 mois : libre de partir à tout moment avec 1 mois de préavis. » (jamais d''engagement minimum ni de « 3 mois minimum »)')
WHERE is_active;

COMMIT;

-- Vérification : 0 reste attendu partout
SELECT slug,
  (SELECT count(*) FROM regexp_matches(content_fr || content_en, 'trois mois minimum|three-month minimum|engagement minimum|minimum commitment|\| 3 mois \||\| 3 months \||1 à 2 semaines si une chambre est libre|1 to 2 weeks if a room is free|900 à 1 150|900 to 1,150', 'g')) AS restes,
  (SELECT count(*) FROM regexp_matches(content_fr, 'PRIX_DES_EUR', 'g')) AS tokens_eur_fr
FROM blog_posts WHERE slug IN ('s-installer-a-geneve-expatrie-cote-suisse-ou-cote-france','vivre-a-annemasse-quand-on-travaille-a-geneve');
SELECT version, position('Engagement minimum' IN content_md) = 0 AS strategie_ok FROM blog_editorial_strategy WHERE is_active;
