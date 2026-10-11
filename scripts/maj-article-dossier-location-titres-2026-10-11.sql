-- scripts/maj-article-dossier-location-titres-2026-10-11.sql — décision Jérôme du 11/10/2026 (point E1 du guide) : le titre et
-- les metas de l'article dossier-location-frontalier-suisse-france promettaient « sans garant français » (promesse absolue,
-- contraire à D6) alors que le corps dit « garant au cas par cas » depuis le lot L1. Slug et H1 du corps inchangés (URL et
-- positions conservées) ; l'extrait (excerpt) ne cite pas le garant et reste tel quel. Idempotent : chaque champ n'est réécrit
-- que s'il porte encore l'ancienne valeur. Dry-run montré à Jérôme avant application (.dry-run.md).
BEGIN;
UPDATE public.blog_posts
SET title_fr = CASE WHEN title_fr = 'Louer en France sans garant français : le dossier du frontalier' THEN 'Dossier de location frontalier : les pièces, le garant au cas par cas' ELSE title_fr END,
    title_en = CASE WHEN title_en = 'Renting in France with No French Guarantor: The Cross-Border Guide' THEN 'Cross-border rental file: the documents, the guarantor case by case' ELSE title_en END,
    meta_description_fr = CASE WHEN meta_description_fr = 'Frontalier suisse sans garant français ? Monte un dossier de location béton : pièces, conversion CHF/EUR, contrat de travail suisse. Le guide complet.' THEN 'Frontalier suisse, dossier de location côté France : pièces à fournir, conversion CHF/EUR, contrat de travail suisse, et garant demandé au cas par cas.' ELSE meta_description_fr END,
    meta_description_en = CASE WHEN meta_description_en = 'Swiss cross-border worker with no French guarantor? Build a solid rental application: documents, CHF/EUR conversion, Swiss employment contract.' THEN 'Swiss cross-border worker renting in France: documents to provide, CHF/EUR conversion, Swiss employment contract, and a guarantor only case by case.' ELSE meta_description_en END,
    updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND (title_fr = 'Louer en France sans garant français : le dossier du frontalier' OR title_en = 'Renting in France with No French Guarantor: The Cross-Border Guide'
       OR meta_description_fr = 'Frontalier suisse sans garant français ? Monte un dossier de location béton : pièces, conversion CHF/EUR, contrat de travail suisse. Le guide complet.' OR meta_description_en = 'Swiss cross-border worker with no French guarantor? Build a solid rental application: documents, CHF/EUR conversion, Swiss employment contract.');
COMMIT;
-- Vérification : SELECT title_fr, title_en, length(meta_description_fr), length(meta_description_en), updated_at FROM public.blog_posts WHERE slug = 'dossier-location-frontalier-suisse-france';
-- Retour arrière : même UPDATE avec les valeurs inversées (anciennes valeurs dans ce fichier).
