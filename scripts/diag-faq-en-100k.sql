-- Diagnostic 2 : extraire la section FAQ EN 100k précisément
-- + montrer le code hexa de l'apostrophe utilisée (typographique vs ASCII)

SELECT
  substring(content_en FROM 'What.{0,3}s the real net[^\n]+\n[^\n]+') AS faq_100k_section
FROM blog_posts WHERE slug = 'salaire-suisse-net-frontalier-2026';
