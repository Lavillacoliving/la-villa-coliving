-- ============================================================================
-- Intérêt chambre/maison déclaré à l'atterrissage (LP /chambres-septembre)
-- Brief LOT 2 du 24/08/2026 — critère d'acceptation §7.2 : la ligne Supabase doit
-- porter `property_interest` pré-rempli depuis la carte chambre cliquée.
-- Trace de la migration Supabase à appliquer via MCP `apply_migration`
-- (nom : `property_interest_2026_08_24`) APRÈS GO écrit de Jérôme.
--
-- CHECKLIST §12 (lavilla-docs/Schema_Supabase_LaVilla.md) :
--   1. Vues : `v_form_submissions_clean` recréée (DROP + CREATE — seule vue dépendante
--      de form_submissions, cf. migration du 22/08) : expose en plus property_interest
--      et room_interest ; security_invoker = true conservé ; grants identiques.
--      La RPC `bulletin_seo_metrics` lit la vue par colonnes nommées : ajouter des
--      colonnes ne la casse pas — elle n'est PAS modifiée par cette migration.
--   2. RLS : inchangée — 2 colonnes text NULL ; policies existantes intactes
--      (prospects : admin_full_prospects + service_role_prospects ; form_submissions :
--      Admins full access — anon sans policy → aucune exposition client).
--   2bis. AUCUNE contrainte CHECK modifiée. `prospects.source` (déclaratif) n'est pas
--      touché, et `property_interest` est volontairement du TEXTE LIBRE, sans CHECK :
--      un CHECK ici rejouerait le piège 23514 (Edge + dropdowns dashboard à aligner)
--      pour un champ de mesure qui n'a pas besoin d'être contraint.
--   3. entities.ts : valeurs écrites = slugs canoniques SANS tiret (`lavilla`, `leloft`,
--      `lelodge`, `montblanc`), conformes à `properties.slug`. logAudit : non concerné.
--   4. Trace : ce fichier.
--   5. Backup VPS : aucune table nouvelle — colonnes exportées avec les tables existantes.
--   6. Doc : Schema_Supabase_LaVilla.md (§6.1, §6.4, vue) + Infrastructure (Edge v14).
--
-- Écriture : Edge Function `send-candidature-email` v14, depuis le payload du front
-- (query params `?property_interest=…&room_interest=…` posés par les CTA de la LP).
-- Trim + 256 caractères, vide → null. Le canal DÉCLARÉ (`source`) reste intact.
-- Ordre de déploiement : cette migration → Edge v14 → front (chaque étape rétrocompatible).
-- Additif et réversible (rollback en partie 3).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- PARTIE 1 — Colonnes : 2 colonnes text NULL sur prospects ET form_submissions
-- ---------------------------------------------------------------------------
alter table public.prospects
  add column if not exists property_interest text,
  add column if not exists room_interest     text;

alter table public.form_submissions
  add column if not exists property_interest text,
  add column if not exists room_interest     text;

comment on column public.prospects.property_interest is
  'Maison visée, déclarée par le clic sur une carte chambre (LP /chambres-septembre). Slug canonique properties.slug SANS tiret : lavilla | leloft | lelodge | montblanc. Texte libre, aucun CHECK. Écrit par l''Edge send-candidature-email v14. N''écrase jamais `source` (déclaratif).';
comment on column public.prospects.room_interest is
  'Chambre visée si connue (ex. « chambre-4 »). Texte libre, aucun CHECK. Edge v14.';
comment on column public.form_submissions.property_interest is
  'Maison visée déclarée au clic sur une carte chambre (LP /chambres-septembre) — slug properties.slug. Edge v14.';
comment on column public.form_submissions.room_interest is
  'Chambre visée si connue. Edge v14.';

-- ---------------------------------------------------------------------------
-- PARTIE 2 — Vue `v_form_submissions_clean` : DROP + CREATE (jamais d'ALTER).
--   Identique à la version du 22/08, + property_interest et room_interest.
--   Dédoublonnage 10 min et filtre non-test inchangés ; is_paid inchangé.
-- ---------------------------------------------------------------------------
drop view if exists public.v_form_submissions_clean;

create view public.v_form_submissions_clean
with (security_invoker = true) as
select
  id,
  created_at,
  form_type,
  source,
  language,
  is_test,
  utm_campaign,
  gclid,
  property_interest,
  room_interest,
  (gclid is not null or coalesce(utm_medium, '') = 'cpc') as is_paid
from (
  select
    fs.id,
    fs.created_at,
    fs.form_type,
    fs.source,
    fs.language,
    fs.is_test,
    fs.utm_campaign,
    fs.utm_medium,
    fs.gclid,
    fs.property_interest,
    fs.room_interest,
    lag(fs.created_at) over (partition by fs.form_type order by fs.created_at) as prev_at
  from public.form_submissions fs
  where not fs.is_test
) t
where prev_at is null or (created_at - prev_at) > interval '10 minutes';

comment on view public.v_form_submissions_clean is
  'Soumissions réelles (hors is_test) dédoublonnées à 10 min par form_type. is_paid = gclid présent ou utm_medium = cpc (Google Ads). Le KPI SEO (candidatures nettes) = is_paid = false. property_interest/room_interest : maison/chambre visée déclarée au clic sur une carte de la LP (24/08/2026).';

grant select on public.v_form_submissions_clean to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- PARTIE 3 — Rollback (si nécessaire) : recréer la vue SANS les 2 colonnes
--   (copie exacte de la version du 22/08), puis supprimer les colonnes.
--   ⚠️ Ne jamais exécuter en même temps que les parties 1-2.
-- ---------------------------------------------------------------------------
-- drop view if exists public.v_form_submissions_clean;
-- create view public.v_form_submissions_clean with (security_invoker = true) as
-- select id, created_at, form_type, source, language, is_test, utm_campaign, gclid,
--        (gclid is not null or coalesce(utm_medium, '') = 'cpc') as is_paid
-- from (
--   select fs.id, fs.created_at, fs.form_type, fs.source, fs.language, fs.is_test,
--          fs.utm_campaign, fs.utm_medium, fs.gclid,
--          lag(fs.created_at) over (partition by fs.form_type order by fs.created_at) as prev_at
--   from public.form_submissions fs where not fs.is_test
-- ) t where prev_at is null or (created_at - prev_at) > interval '10 minutes';
-- grant select on public.v_form_submissions_clean to anon, authenticated, service_role;
-- alter table public.prospects        drop column if exists property_interest, drop column if exists room_interest;
-- alter table public.form_submissions drop column if exists property_interest, drop column if exists room_interest;
