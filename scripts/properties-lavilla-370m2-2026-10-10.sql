-- properties.description_fr / description_en de La Villa — D2 (brief « Ingénierie des créneaux », Jérôme 09/10/2026) : 370 m²
-- (valeur du titre / DPE, HOUSE_SURFACES.lavilla.livingM2 dans src/data/stats.ts). Champ du dashboard, jamais rendu sur le site
-- public ; aligné le 10/10/2026 sur GO global. Idempotent (garde position()).
BEGIN;
UPDATE public.properties
SET description_fr = replace(description_fr, 'Villa de 400m² sur un domaine de 2000m²', 'Villa de 370 m² sur un domaine de 2 000 m²')
WHERE slug = 'lavilla' AND position('Villa de 400m² sur un domaine de 2000m²' IN description_fr) > 0;
UPDATE public.properties
SET description_en = replace(description_en, '400m² villa on a 2,000m² estate', '370 m² villa on a 2,000 m² estate')
WHERE slug = 'lavilla' AND position('400m² villa on a 2,000m² estate' IN description_en) > 0;
COMMIT;
-- Vérification : SELECT slug, left(description_fr, 60), left(description_en, 50) FROM public.properties WHERE slug = 'lavilla';
