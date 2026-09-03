-- ============================================================================
-- Attribution des candidatures — page d'atterrissage (Lot 1 du brief SEO funnel,
-- plan validé par Jérôme le 03/09/2026, questions Q5 et Q11).
-- Trace de la migration Supabase à appliquer via MCP `apply_migration`
-- (nom : `attribution_landing_2026_09_03`) APRÈS GO écrit de Jérôme — puis, dans la
-- même migration, recréation de la vue (partie 2). Additive et réversible (partie 4).
--
-- CE QUE ÇA CORRIGE : 0 ligne sur 73 de form_submissions porte l'origine « bloc offre »
-- (les paramètres ?src=bloc_offre&article= n'allaient que dans prospects.notes), et
-- aucune ligne ne dit sur quelle page la session a commencé. Le front (Lot 1) envoie
-- désormais landing_page / referrer / entry_page + des « UTM virtuels » (utm_source =
-- site, utm_medium = bloc_offre | article_cta | bail_classique | room_card | dispo_line |
-- house_cta, utm_campaign = slug de l'article hôte, utm_content = position) dans les
-- colonnes utm_* EXISTANTES — seulement quand la session n'a pas de première touche
-- externe (une touche Ads n'est jamais écrasée). `is_paid` reste
-- (gclid IS NOT NULL OR utm_medium = 'cpc') : une porte interne est organique.
--
-- CHECKLIST §12 (lavilla-docs/Schema_Supabase_LaVilla.md) :
--   1. Vues : `v_form_submissions_clean` recréée (DROP + CREATE, seule vue dépendante de
--      form_submissions — à re-vérifier via pg_depend le jour de l'application) : expose
--      en plus utm_source, utm_medium, landing_page, entry_page ; security_invoker = true
--      conservé ; grant select anon/authenticated/service_role inchangé.
--      RPC `bulletin_seo_metrics` : lit la vue par colonnes nommées → NON modifiée.
--   2. RLS : inchangée — colonnes text NULL ajoutées ; policies existantes intactes
--      (form_submissions : Admins full access — anon sans policy → aucune exposition).
--   2bis. Aucune contrainte CHECK modifiée. `prospects` NON touché (la page d'atterrissage
--      va dans ses notes, écrite par l'Edge — décision Q11b).
--   3. entities.ts / logAudit : non concernés.
--   4. Trace : ce fichier.
--   5. Backup VPS : colonnes exportées avec la table existante (aucune table nouvelle).
--   6. Doc : Schema_Supabase_LaVilla.md (§6.4 + MàJ datée) après application.
--
-- Écriture des colonnes : Edge Function `send-candidature-email` v17 (payload
-- landing_page / referrer / entry_page posé par le front ; trim, 512 car. max, caractères
-- de contrôle retirés ; vide → NULL). referrer = origine + chemin, sans query (Q5).
-- Ordre de déploiement : cette migration → Edge v17 (depuis main, après merge) → front
-- (chaque étape rétrocompatible : sans les champs, corps identiques à la v16 ; colonnes
-- refusées → l'Edge rejoue l'insert sans elles).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- PARTIE 1 — Colonnes : 3 colonnes text NULL sur form_submissions
-- ---------------------------------------------------------------------------
alter table public.form_submissions
  add column if not exists landing_page text,
  add column if not exists referrer     text,
  add column if not exists entry_page   text;

comment on column public.form_submissions.landing_page is 'Premier pathname de la session (write-once côté front, sessionStorage lvc_landing). Edge send-candidature-email v17. Lot 1 attribution 03/09/2026.';
comment on column public.form_submissions.referrer     is 'document.referrer du premier chargement de la session, réduit à origine + chemin (sans query ni fragment). NULL si absent. Edge v17.';
comment on column public.form_submissions.entry_page   is 'pathname de la page où le formulaire a été soumis (/candidature ou /en/candidature). Edge v17.';

-- ---------------------------------------------------------------------------
-- PARTIE 2 — Vue `v_form_submissions_clean` : DROP + CREATE (jamais d'ALTER)
--   Identique à la version du 24/08 + utm_source, utm_medium, landing_page, entry_page.
--   Dédoublonnage 10 min, filtre non-test et is_paid inchangés.
--   KPI du plan : part des lignes avec landing_page renseignée ; lignes utm_medium =
--   'bloc_offre' sur 90 jours.
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
  utm_source,
  utm_medium,
  utm_campaign,
  gclid,
  property_interest,
  room_interest,
  landing_page,
  entry_page,
  (gclid is not null or coalesce(utm_medium, '') = 'cpc') as is_paid
from (
  select
    fs.id,
    fs.created_at,
    fs.form_type,
    fs.source,
    fs.language,
    fs.is_test,
    fs.utm_source,
    fs.utm_medium,
    fs.utm_campaign,
    fs.gclid,
    fs.property_interest,
    fs.room_interest,
    fs.landing_page,
    fs.entry_page,
    lag(fs.created_at) over (partition by fs.form_type order by fs.created_at) as prev_at
  from public.form_submissions fs
  where not fs.is_test
) t
where prev_at is null or (created_at - prev_at) > interval '10 minutes';

comment on view public.v_form_submissions_clean is
  'Soumissions réelles (hors is_test) dédoublonnées à 10 min par form_type. is_paid = gclid présent ou utm_medium = cpc (Google Ads). Le KPI SEO (candidatures nettes) = is_paid = false. property_interest (uuid properties) / room_interest : maison et chambre visées (24/08/2026). utm_source/utm_medium + landing_page/entry_page (03/09/2026) : portes internes (utm_source = site, utm_medium = bloc_offre…) et page d''atterrissage de la session.';

grant select on public.v_form_submissions_clean to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- PARTIE 3 — Vérifications (après application)
-- ---------------------------------------------------------------------------
-- 3.1 — 3 colonnes présentes :
--   select column_name, data_type from information_schema.columns
--    where table_schema = 'public' and table_name = 'form_submissions'
--      and column_name in ('landing_page','referrer','entry_page');          -- attendu : 3 lignes text
-- 3.2 — vue toujours security_invoker, colonnes exposées :
--   select reloptions from pg_class where relname = 'v_form_submissions_clean';  -- {security_invoker=true}
--   select column_name from information_schema.columns where table_name = 'v_form_submissions_clean';
-- 3.3 — RPC intacte : select jsonb_pretty(public.bulletin_seo_metrics('<jeton>')) → mêmes clés qu'avant.
-- 3.4 — Anon ne lit rien : set role anon; select count(*) from v_form_submissions_clean; reset role;  -- 0
-- 3.5 — Après Edge v17 + front, soumission [TEST] depuis /blog/<slug>?test=1 → clic bloc offre :
--   select utm_source, utm_medium, utm_campaign, utm_content, landing_page, referrer, entry_page, is_test
--     from form_submissions order by created_at desc limit 1;
--   attendu : site | bloc_offre | <slug> | end | /blog/<slug> | <origine+chemin ou NULL> | /candidature | true
-- 3.6 — KPI mensuel :
--   select count(*) filter (where landing_page is not null)::float / nullif(count(*),0) as part_landing,
--          count(*) filter (where utm_medium = 'bloc_offre') as bloc_offre_90j
--     from v_form_submissions_clean where created_at >= now() - interval '90 days';

-- ---------------------------------------------------------------------------
-- PARTIE 4 — Rollback (ordre inverse ; réversible sans perte hors ces 3 colonnes)
-- ---------------------------------------------------------------------------
-- 4.1 Vue (définition du 24/08) :
--   drop view if exists public.v_form_submissions_clean;
--   create view public.v_form_submissions_clean with (security_invoker = true) as
--   select id, created_at, form_type, source, language, is_test, utm_campaign, gclid,
--          property_interest, room_interest,
--          (gclid is not null or coalesce(utm_medium, '') = 'cpc') as is_paid
--   from (
--     select fs.id, fs.created_at, fs.form_type, fs.source, fs.language, fs.is_test,
--            fs.utm_campaign, fs.utm_medium, fs.gclid, fs.property_interest, fs.room_interest,
--            lag(fs.created_at) over (partition by fs.form_type order by fs.created_at) as prev_at
--     from public.form_submissions fs where not fs.is_test
--   ) t where prev_at is null or (created_at - prev_at) > interval '10 minutes';
--   grant select on public.v_form_submissions_clean to anon, authenticated, service_role;
-- 4.2 Colonnes (après retour Edge v16, ou en laissant la v17 dont le filet rejoue sans ces champs) :
--   alter table public.form_submissions
--     drop column if exists landing_page, drop column if exists referrer, drop column if exists entry_page;
