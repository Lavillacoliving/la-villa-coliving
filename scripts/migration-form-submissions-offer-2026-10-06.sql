-- Offre « Pose tes valises avant l'hiver » (brief Jérôme du 06/10/2026) — Edge send-candidature-email v20.
-- Colonne dédiée pour l'offre commerciale sous laquelle une candidature est envoyée.
--
-- Pourquoi une colonne et pas `utm_content` (piste du brief §1) : `utm_content` porte déjà l'attribution
-- Ads first-touch (utm_content des annonces Facebook/Google) et le `pos` des portes internes du blog ;
-- y écrire `offre-hiver` écraserait ou mélangerait une mesure établie depuis le 22/08/2026, et la valeur
-- n'y serait présente que quand la case est vide — inexploitable. `prospects` n'est pas touché : l'offre
-- y est écrite dans `notes` (ligne « Offre : … », en tête), comme la page d'atterrissage (Q11b).
--
-- ✅ APPLIQUÉE le 12/10/2026 (MCP apply_migration `form_submissions_offer_2026_10_12`, décision Jérôme du 12/10),
-- avant le déploiement de la v20. Conserver ce fichier pour la trace. Rappel du principe d'origine :
-- à appliquer par Jérôme (SQL Editor ou MCP apply_migration), AVANT ou APRÈS le déploiement de la v20 :
-- l'edge joint `offer` à l'insert seulement quand une offre est présente et, si la colonne manque encore,
-- rejoue l'insert sans elle (cascade) — aucune candidature n'est perdue, seule la colonne reste NULL.
-- Les 4 vues dépendantes (v_form_submissions_clean, reporting.v_candidatures_jour/semaine/mois) ne sont
-- pas modifiées : ajouter une colonne ne les casse pas ; l'exposer dans la vue est une décision séparée.
-- Checklist §12 de Schema_Supabase_LaVilla.md : colonne NULL, aucune contrainte, aucune suppression.

alter table public.form_submissions
  add column if not exists offer text;

comment on column public.form_submissions.offer is
  'Offre commerciale sous laquelle la candidature a été envoyée (edge v20+) : ''hiver'' = « Pose tes valises avant l''hiver » (06/10/2026). NULL = aucune offre.';

-- Vérification :
-- select column_name, data_type, is_nullable from information_schema.columns
--  where table_schema = 'public' and table_name = 'form_submissions' and column_name = 'offer';
