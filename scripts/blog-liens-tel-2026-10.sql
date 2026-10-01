-- Lot B du brief « Formulaire, hydratation, mesure » (01/10/2026) — numéros utiles du blog en liens tel:
-- À APPLIQUER SUR GO B, AVANT le push du lot B (le prérendu relit les articles en base).
--
-- Pourquoi : index.html porte désormais <meta name="format-detection" content="telephone=no, …"> —
-- iOS Safari transformait les numéros en clair en liens AVANT l'hydratation (mismatch #418 sur les
-- articles qui citent un numéro). Contrepartie : iOS ne rend plus ces numéros cliquables tout seul ;
-- les numéros utiles deviennent donc des liens tel: explicites (BlogPostPage autorise tel: — urlTransform).
--
-- Recensement du 01/10/2026 (articles publiés, FR et EN) : un seul numéro en clair, celui de l'ADIL 74,
-- « 04 50 45 79 72 », une fois par langue dans 2 articles :
--   arnaques-logement-frontalier-geneve-eviter (FR, EN) · guide-ressources-frontalier-geneve (FR, EN).
--
-- Effet de bord à connaître : le trigger blog_posts_updated_at met updated_at à now() → ces 2 articles
-- afficheront « Mis à jour le <date d'application> ». C'est exact (le texte a changé) ; aucun autre effet.
-- Idempotent : rejouable sans double lien. Aucune suppression.

-- 0. Aperçu (lecture seule) : occurrences en clair restantes.
select slug,
       (length(content_fr) - length(replace(content_fr, '04 50 45 79 72', ''))) / 14 as fr_total,
       (length(content_fr) - length(replace(content_fr, '[04 50 45 79 72](tel:+33450457972)', ''))) / 34 as fr_lies,
       (length(content_en) - length(replace(content_en, '04 50 45 79 72', ''))) / 14 as en_total,
       (length(content_en) - length(replace(content_en, '[04 50 45 79 72](tel:+33450457972)', ''))) / 34 as en_lies
from blog_posts
where content_fr like '%04 50 45 79 72%' or content_en like '%04 50 45 79 72%';

-- 1. Application (transaction) : chaque occurrence en clair devient un lien Markdown tel:.
begin;
update blog_posts
set content_fr = replace(content_fr, '04 50 45 79 72', '[04 50 45 79 72](tel:+33450457972)')
where slug in ('arnaques-logement-frontalier-geneve-eviter', 'guide-ressources-frontalier-geneve')
  and content_fr like '%04 50 45 79 72%'
  and content_fr not like '%](tel:+33450457972)%';
update blog_posts
set content_en = replace(content_en, '04 50 45 79 72', '[04 50 45 79 72](tel:+33450457972)')
where slug in ('arnaques-logement-frontalier-geneve-eviter', 'guide-ressources-frontalier-geneve')
  and content_en like '%04 50 45 79 72%'
  and content_en not like '%](tel:+33450457972)%';
-- Contrôle avant commit : fr_total = fr_lies et en_total = en_lies sur les 2 lignes (requête 0).
commit;

-- 2. Retour arrière (si besoin) :
-- begin;
-- update blog_posts set content_fr = replace(content_fr, '[04 50 45 79 72](tel:+33450457972)', '04 50 45 79 72')
--   where slug in ('arnaques-logement-frontalier-geneve-eviter', 'guide-ressources-frontalier-geneve');
-- update blog_posts set content_en = replace(content_en, '[04 50 45 79 72](tel:+33450457972)', '04 50 45 79 72')
--   where slug in ('arnaques-logement-frontalier-geneve-eviter', 'guide-ressources-frontalier-geneve');
-- commit;
