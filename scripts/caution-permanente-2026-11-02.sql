-- Lot « caution en 1, 2 ou 3 fois : règle permanente » — brief v2 du 02/11/2026 (branche feat/caution-permanente).
-- Décisions Jérôme du 02/11/2026 : D1-D3 validées, D3-bis (« selon ton dossier » / « depending on your application ») validée,
-- D6 = (a) (créneaux L1 et tableaux de décision inchangés dans ce lot).
--
-- Deux articles publiés de `blog_posts`, FR et EN :
--   BL1 · coliving-frais-dossier-geneve-annemasse — section « Chez La Villa Coliving » (article sans bloc entité) :
--         la phrase « … et une caution remboursable. C'est tout. » précise le montant et le fractionnement.
--   BL2 · trouver-logement-avant-d-arriver-geneve — la phrase posée par SQL le 30/10 (« la caution peut se régler en deux ou
--         trois fois ») prend la forme D3-bis. ⚠️ Les sources content/decision-pages/trouver-logement-*.md ne portent pas
--         cette phrase : ne pas régénérer cet article depuis le md sans resynchroniser.
--
-- À appliquer via MCP (execute_sql) APRÈS le GO de Jérôme et AVANT le push (le prérendu GitHub Actions capture la base).
-- Chaque UPDATE est idempotent (WHERE … LIKE '%ancien%') ; la requête de contrôle finale doit renvoyer 1 partout.

BEGIN;

-- BL1 — coliving-frais-dossier-geneve-annemasse
UPDATE public.blog_posts
   SET content_fr = replace(content_fr,
         'Tu règles ton premier loyer, tout inclus, et une caution remboursable. C''est tout.',
         'Tu règles ton premier loyer, tout inclus, et une caution remboursable (2 mois de loyer hors charges, payable en 1, 2 ou 3 fois selon ton dossier). C''est tout.'),
       updated_at = now()
 WHERE slug = 'coliving-frais-dossier-geneve-annemasse'
   AND content_fr LIKE '%Tu règles ton premier loyer, tout inclus, et une caution remboursable. C''est tout.%';

UPDATE public.blog_posts
   SET content_en = replace(content_en,
         'You pay your first month''s rent, all inclusive, and a refundable deposit. That''s it.',
         'You pay your first month''s rent, all inclusive, and a refundable deposit (2 months'' rent excluding charges, payable in 1, 2 or 3 instalments depending on your application). That''s it.'),
       updated_at = now()
 WHERE slug = 'coliving-frais-dossier-geneve-annemasse'
   AND content_en LIKE '%You pay your first month''s rent, all inclusive, and a refundable deposit. That''s it.%';

-- BL2 — trouver-logement-avant-d-arriver-geneve (D3-bis)
UPDATE public.blog_posts
   SET content_fr = replace(content_fr,
         'la caution peut se régler en deux ou trois fois',
         'la caution peut se régler en 2 ou 3 fois selon ton dossier'),
       updated_at = now()
 WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
   AND content_fr LIKE '%la caution peut se régler en deux ou trois fois%';

UPDATE public.blog_posts
   SET content_en = replace(content_en,
         'the deposit can be paid in two or three instalments',
         'the deposit can be paid in 2 or 3 instalments depending on your application'),
       updated_at = now()
 WHERE slug = 'trouver-logement-avant-d-arriver-geneve'
   AND content_en LIKE '%the deposit can be paid in two or three instalments%';

COMMIT;

-- Contrôle : 1 occurrence du nouveau texte, 0 de l'ancien, pour chaque colonne.
SELECT slug,
       (length(content_fr) - length(replace(content_fr, 'payable en 1, 2 ou 3 fois selon ton dossier', ''))) / length('payable en 1, 2 ou 3 fois selon ton dossier') AS fr_new,
       (length(content_en) - length(replace(content_en, 'payable in 1, 2 or 3 instalments depending on your application', ''))) / length('payable in 1, 2 or 3 instalments depending on your application') AS en_new,
       (content_fr LIKE '%une caution remboursable. C''est tout.%' OR content_fr LIKE '%en deux ou trois fois%')::int AS fr_old,
       (content_en LIKE '%a refundable deposit. That''s it.%' OR content_en LIKE '%in two or three instalments%')::int AS en_old
  FROM public.blog_posts
 WHERE slug IN ('coliving-frais-dossier-geneve-annemasse', 'trouver-logement-avant-d-arriver-geneve');

-- Retour arrière (même mécanique, remplacements inverses) :
-- UPDATE public.blog_posts SET content_fr = replace(content_fr, ' (2 mois de loyer hors charges, payable en 1, 2 ou 3 fois selon ton dossier). C''est tout.', '. C''est tout.'), updated_at = now() WHERE slug = 'coliving-frais-dossier-geneve-annemasse';
-- UPDATE public.blog_posts SET content_en = replace(content_en, ' (2 months'' rent excluding charges, payable in 1, 2 or 3 instalments depending on your application). That''s it.', '. That''s it.'), updated_at = now() WHERE slug = 'coliving-frais-dossier-geneve-annemasse';
-- UPDATE public.blog_posts SET content_fr = replace(content_fr, 'en 2 ou 3 fois selon ton dossier', 'en deux ou trois fois'), updated_at = now() WHERE slug = 'trouver-logement-avant-d-arriver-geneve';
-- UPDATE public.blog_posts SET content_en = replace(content_en, 'in 2 or 3 instalments depending on your application', 'in two or three instalments'), updated_at = now() WHERE slug = 'trouver-logement-avant-d-arriver-geneve';
