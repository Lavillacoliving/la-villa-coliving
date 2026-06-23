-- Fix : meta_description_fr trop longue (173c → ~150c) pour éviter troncature SERP
UPDATE blog_posts SET meta_description_fr =
  'Écoles internationales de Genève : frais réels 2026, carte des campus rive droite/gauche et les 4 communes françaises où habiter en frontalier.'
WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter';

SELECT slug, meta_description_fr, LENGTH(meta_description_fr) AS meta_fr_len
FROM blog_posts WHERE slug = 'ecole-internationale-geneve-frontalier-ou-habiter';
