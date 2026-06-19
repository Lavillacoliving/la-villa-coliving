-- MAILLAGE OBSERVATOIRE - 2 articles -> /observatoire-logement-frontalier-geneve (FR + EN)
-- 100% ASCII (anti-mojibake). Lance dans Supabase > SQL Editor (deja fait 18/06).

-- 1) Ego-bait - section carte des loyers
UPDATE blog_posts SET
  content_fr = REPLACE(content_fr, E'## Le pi\u00e8ge du \u00ab loyer attractif \u00bb', E'> **Pour aller plus loin :** [l\u2019observatoire du logement frontalier \u2014 le loyer d\u2019un studio crois\u00e9 au temps de trajet, commune par commune](/observatoire-logement-frontalier-geneve)\n\n## Le pi\u00e8ge du \u00ab loyer attractif \u00bb'),
  content_en = REPLACE(content_en, E'## The "attractive rent" trap', E'> **Go further:** [the cross-border housing observatory \u2014 studio rent crossed with commute time, town by town](/en/observatoire-logement-frontalier-geneve)\n\n## The "attractive rent" trap')
WHERE slug = 'guide-ressources-frontalier-geneve'
  AND content_fr NOT LIKE '%/observatoire-logement-frontalier-geneve%';

-- 2) Cout du transport frontalier - section Leman Express
UPDATE blog_posts SET
  content_fr = REPLACE(content_fr, E'## Le v\u00e9lo \u00e9lectrique : l\'option sous-estim\u00e9e', E'> **Pour aller plus loin :** [o\u00f9 se loger pour r\u00e9duire \u00e0 la fois le loyer et le trajet \u2014 notre observatoire frontalier](/observatoire-logement-frontalier-geneve)\n\n## Le v\u00e9lo \u00e9lectrique : l\'option sous-estim\u00e9e'),
  content_en = REPLACE(content_en, E'## The e-bike: the underestimated option', E'> **Go further:** [where to live to cut both rent and commute \u2014 our cross-border observatory](/en/observatoire-logement-frontalier-geneve)\n\n## The e-bike: the underestimated option')
WHERE slug = 'cout-transport-frontalier-geneve-2026'
  AND content_fr NOT LIKE '%/observatoire-logement-frontalier-geneve%';

-- VERIFICATION (2 lignes a t/t) :
SELECT slug,
  content_fr LIKE '%/observatoire-logement-frontalier-geneve%'    AS lien_fr_ok,
  content_en LIKE '%/en/observatoire-logement-frontalier-geneve%' AS lien_en_ok
FROM blog_posts WHERE slug IN ('guide-ressources-frontalier-geneve','cout-transport-frontalier-geneve-2026') ORDER BY slug;
