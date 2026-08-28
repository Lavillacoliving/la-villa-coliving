-- ============================================================================
-- Attribution Google Ads (UTM + gclid) — brief UTM/GCLID du 22/08/2026
-- Prérequis du lancement des campagnes Ads (lundi 25/08/2026).
-- Trace de la migration Supabase à appliquer via MCP `apply_migration`
-- (nom : `utm_attribution_2026_08_22`) APRÈS GO écrit de Jérôme — puis, dans la
-- même migration, recréation de la vue et de la RPC (parties 2 et 3).
--
-- CHECKLIST §12 (lavilla-docs/Schema_Supabase_LaVilla.md) :
--   1. Vues : `v_form_submissions_clean` recréée (DROP + CREATE, seule vue dépendante
--      de form_submissions — vérifié via pg_depend le 22/08) : expose utm_campaign,
--      gclid, is_paid ; security_invoker = true conservé ; grant select anon/auth/service.
--   2. RLS : inchangée — colonnes text NULL ajoutées ; policies existantes intactes
--      (prospects : admin_full_prospects + service_role_prospects ; form_submissions :
--      Admins full access — anon n'a aucune policy → aucune exposition client).
--   2bis. Aucune contrainte CHECK modifiée. `prospects.source` (déclaratif) n'est PAS
--      touché : l'attribution technique vit dans ses colonnes dédiées.
--   3. entities.ts / logAudit : non concernés.
--   4. Trace : ce fichier.
--   5. Backup VPS : colonnes exportées avec les tables existantes (aucune table nouvelle).
--   6. Doc : Schema_Supabase_LaVilla.md (§6.1, §6.4, vue, RPC) + Infrastructure (Edge v13).
--
-- Écriture des colonnes : Edge Function `send-candidature-email` v13 (payload utm_* /
-- gclid posé par le front depuis sessionStorage, first-touch de session). Trim + 256 car.
-- Ordre de déploiement : cette migration → Edge v13 → front (chaque étape rétrocompatible).
-- Additif et réversible (rollback en partie 5).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- PARTIE 1 — Colonnes (LOT C) : 6 colonnes text NULL sur prospects ET form_submissions
-- ---------------------------------------------------------------------------
alter table public.prospects
  add column if not exists utm_source   text,
  add column if not exists utm_medium   text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content  text,
  add column if not exists utm_term     text,
  add column if not exists gclid        text;

alter table public.form_submissions
  add column if not exists utm_source   text,
  add column if not exists utm_medium   text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content  text,
  add column if not exists utm_term     text,
  add column if not exists gclid        text;

comment on column public.prospects.utm_source   is 'Attribution technique (Ads) capturée à l''atterrissage, first-touch de session — jamais le déclaratif (source). Écrit par l''Edge send-candidature-email v13.';
comment on column public.prospects.utm_medium   is 'Attribution technique — cpc pour Google Ads. is_paid = gclid présent OU utm_medium = cpc.';
comment on column public.prospects.utm_campaign is 'Attribution technique — ex. test-sept-fr / test-sept-en.';
comment on column public.prospects.utm_content  is 'Attribution technique (optionnel).';
comment on column public.prospects.utm_term     is 'Attribution technique (optionnel).';
comment on column public.prospects.gclid        is 'Google Click ID capturé à l''atterrissage (first-touch de session).';
comment on column public.form_submissions.utm_source   is 'Attribution technique (Ads), first-touch de session — Edge send-candidature-email v13.';
comment on column public.form_submissions.utm_medium   is 'Attribution technique — cpc pour Google Ads.';
comment on column public.form_submissions.utm_campaign is 'Attribution technique — ex. test-sept-fr / test-sept-en.';
comment on column public.form_submissions.utm_content  is 'Attribution technique (optionnel).';
comment on column public.form_submissions.utm_term     is 'Attribution technique (optionnel).';
comment on column public.form_submissions.gclid        is 'Google Click ID capturé à l''atterrissage (first-touch de session).';

-- ---------------------------------------------------------------------------
-- PARTIE 2 — Vue `v_form_submissions_clean` (LOT D.1) : DROP + CREATE, jamais d'ALTER
--   + utm_campaign, gclid, is_paid = (gclid IS NOT NULL OR utm_medium = 'cpc').
--   ⚠️ coalesce sur utm_medium : sans lui, `false OR NULL` = NULL et is_paid serait NULL
--   (ni true ni false) pour toute ligne organique — le contrôle négatif du LOT F attend false.
--   Dédoublonnage 10 min inchangé, toujours sur les lignes non-test uniquement.
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
    lag(fs.created_at) over (partition by fs.form_type order by fs.created_at) as prev_at
  from public.form_submissions fs
  where not fs.is_test
) t
where prev_at is null or (created_at - prev_at) > interval '10 minutes';

comment on view public.v_form_submissions_clean is
  'Soumissions réelles (hors is_test) dédoublonnées à 10 min par form_type. is_paid = gclid présent ou utm_medium = cpc (Google Ads). Le KPI SEO (candidatures nettes) = is_paid = false.';

grant select on public.v_form_submissions_clean to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- PARTIE 3 — RPC `bulletin_seo_metrics` (LOT D.2) : candidatures nettes en DEUX colonnes
--   • `candidatures`       = ORGANIQUES (is_paid = false) — mêmes clés qu'avant : c'est le
--                            KPI SEO historique (aucune campagne avant le 25/08 → pas de rupture)
--   • `candidatures_payantes` = PAYANTES + détail `par_campagne` (utm_campaign)
--   • `candidats_uniques`  = ORGANIQUES (prospects hors is_test et hors payant)
--   • `candidats_uniques_payants` = PAYANTS
--   Bloc `prospects` (pipeline CRM), `cohortes`, `chambres_liberees_30j` : inchangés (tous
--   les prospects réels, payants compris — ce n'est pas le juge SEO).
--   Jeton Vault `bulletin_token` + en-tête x-bulletin-token : inchangés.
-- ---------------------------------------------------------------------------
create or replace function public.bulletin_seo_metrics(p_token text default null::text)
returns jsonb
language plpgsql
stable security definer
set search_path to 'public', 'vault'
as $function$
declare
  v_expected text;
  v_given    text;
  v_result   jsonb;
begin
  v_given := coalesce(
    p_token,
    (current_setting('request.headers', true))::jsonb ->> 'x-bulletin-token'
  );
  select decrypted_secret into v_expected
  from vault.decrypted_secrets where name = 'bulletin_token' limit 1;
  if v_expected is null or length(v_expected) < 16 then
    raise exception 'bulletin_seo_metrics: secret « bulletin_token » absent du Vault (ou trop court)';
  end if;
  if v_given is null or v_given is distinct from v_expected then
    raise exception 'bulletin_seo_metrics: jeton invalide ou absent';
  end if;

  select jsonb_build_object(
    'genere_le', now(),

    -- Candidatures nettes ORGANIQUES (hors tests, hors payant, dédoublonnées 10 min).
    -- = KPI SEO historique : mêmes clés qu'avant le 22/08/2026, le payant en est retiré.
    'candidatures', jsonb_build_object(
      's1_7j',       (select count(*) from v_form_submissions_clean
                        where not is_paid and created_at >= now() - interval '7 days'),
      's2_7j',       (select count(*) from v_form_submissions_clean
                        where not is_paid and created_at >= now() - interval '14 days'
                          and created_at < now() - interval '7 days'),
      'total_30j',   (select count(*) from v_form_submissions_clean
                        where not is_paid and created_at >= now() - interval '30 days'),
      -- doublons = lignes brutes non-test − lignes nettes (payant compris) : mesure de
      -- qualité de données, indépendante du canal.
      'doublons_30j',(select count(*) from form_submissions
                        where not is_test and created_at >= now() - interval '30 days')
                     - (select count(*) from v_form_submissions_clean
                        where created_at >= now() - interval '30 days'),
      'tests_30j',   (select count(*) from form_submissions
                        where is_test and created_at >= now() - interval '30 days'),
      'dernier_jour',(select max(created_at)::date from v_form_submissions_clean where not is_paid)
    ),

    -- NOUVEAU 22/08/2026 : candidatures nettes PAYANTES (Google Ads : gclid présent ou
    -- utm_medium = cpc), HORS KPI SEO. Détail par utm_campaign (test-sept-fr / test-sept-en).
    'candidatures_payantes', jsonb_build_object(
      's1_7j',     (select count(*) from v_form_submissions_clean
                      where is_paid and created_at >= now() - interval '7 days'),
      's2_7j',     (select count(*) from v_form_submissions_clean
                      where is_paid and created_at >= now() - interval '14 days'
                        and created_at < now() - interval '7 days'),
      'total_30j', (select count(*) from v_form_submissions_clean
                      where is_paid and created_at >= now() - interval '30 days'),
      'par_campagne', coalesce((
        select jsonb_agg(c order by (c->>'total_30j')::int desc, c->>'utm_campaign')
        from (
          select jsonb_build_object(
                   'utm_campaign', coalesce(utm_campaign, '(sans utm_campaign)'),
                   's1_7j',     count(*) filter (where created_at >= now() - interval '7 days'),
                   's2_7j',     count(*) filter (where created_at >= now() - interval '14 days'
                                                   and created_at < now() - interval '7 days'),
                   'total_30j', count(*)
                 ) as c
          from v_form_submissions_clean
          where is_paid and created_at >= now() - interval '30 days'
          group by coalesce(utm_campaign, '(sans utm_campaign)')
        ) t
      ), '[]'::jsonb)
    ),

    -- Candidats UNIQUES ORGANIQUES — une personne = un email (ou un téléphone normalisé
    -- à défaut), quel que soit le nombre d'envois. Métrique n°1 (21/08/2026), hors payant.
    'candidats_uniques', (
      with p as (
        select coalesce(nullif(lower(trim(email)), ''),
                        nullif(regexp_replace(coalesce(phone, ''), '\D', '', 'g'), ''),
                        id::text) as ident,
               created_at
        from prospects
        where not is_test
          and not (gclid is not null or coalesce(utm_medium, '') = 'cpc')
          and created_at >= now() - interval '30 days'
      )
      select jsonb_build_object(
        's1_7j',     (select count(distinct ident) from p where created_at >= now() - interval '7 days'),
        's2_7j',     (select count(distinct ident) from p where created_at >= now() - interval '14 days' and created_at < now() - interval '7 days'),
        'total_30j', (select count(distinct ident) from p),
        'multi_30j', (select count(*) from (select ident from p group by ident having count(*) >= 2) m),
        'lignes_30j',(select count(*) from p)
      )
    ),

    -- NOUVEAU 22/08/2026 : candidats uniques PAYANTS (même définition, côté Ads).
    'candidats_uniques_payants', (
      with p as (
        select coalesce(nullif(lower(trim(email)), ''),
                        nullif(regexp_replace(coalesce(phone, ''), '\D', '', 'g'), ''),
                        id::text) as ident,
               created_at
        from prospects
        where not is_test
          and (gclid is not null or coalesce(utm_medium, '') = 'cpc')
          and created_at >= now() - interval '30 days'
      )
      select jsonb_build_object(
        's1_7j',     (select count(distinct ident) from p where created_at >= now() - interval '7 days'),
        's2_7j',     (select count(distinct ident) from p where created_at >= now() - interval '14 days' and created_at < now() - interval '7 days'),
        'total_30j', (select count(distinct ident) from p),
        'multi_30j', (select count(*) from (select ident from p group by ident having count(*) >= 2) m),
        'lignes_30j',(select count(*) from p)
      )
    ),

    'prospects', jsonb_build_object(
      'bloques_new_plus_14j', (select count(*) from prospects where not is_test and status = 'new' and created_at < now() - interval '14 days'),
      'ouverts',              (select count(*) from prospects where not is_test and status not in ('signed','lost')),
      'signes_90j',           (select count(*) from prospects where not is_test and status = 'signed' and created_at >= now() - interval '90 days'),
      'site_web_30j',         (select count(*) from prospects where not is_test and source = 'site_web' and created_at >= now() - interval '30 days')
    ),
    'cohortes', (
      select jsonb_agg(c order by c->>'mois')
      from (
        select jsonb_build_object(
                 'mois',             to_char(created_at, 'YYYY-MM'),
                 'total',            count(*),
                 'reste_new',        count(*) filter (where status = 'new'),
                 'en_cours',         count(*) filter (where status in ('contacted','photos_sent','visit_scheduled','visit_done','interested')),
                 'contrat_ou_signe', count(*) filter (where status in ('contract_sent','signed')),
                 'perdus',           count(*) filter (where status = 'lost')
               ) as c
        from prospects
        where not is_test and created_at >= date_trunc('month', now() - interval '5 months')
        group by to_char(created_at, 'YYYY-MM')
      ) t
    ),
    'chambres_liberees_30j', (select count(*) from tenants where move_out_date between current_date - 30 and current_date)
  ) into v_result;

  return v_result;
end;
$function$;

-- Droits : inchangés (REVOKE PUBLIC + GRANT anon/authenticated/service_role posés le 27/07).
-- CREATE OR REPLACE conserve les grants existants ; rappel pour une re-création à vide :
-- revoke all on function public.bulletin_seo_metrics(text) from public;
-- grant execute on function public.bulletin_seo_metrics(text) to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- PARTIE 4 — Vérifications (après application)
-- ---------------------------------------------------------------------------
-- 4.1 — 12 colonnes présentes :
--   select table_name, column_name from information_schema.columns
--    where table_schema = 'public' and table_name in ('prospects','form_submissions')
--      and column_name in ('utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid')
--    order by 1, 2;                                            -- attendu : 12 lignes
-- 4.2 — is_paid jamais NULL :
--   select count(*) filter (where is_paid) as payantes, count(*) filter (where not is_paid) as organiques,
--          count(*) filter (where is_paid is null) as nulls from v_form_submissions_clean;  -- nulls = 0
-- 4.3 — continuité du KPI : avant/après, `candidatures.s1_7j/s2_7j/total_30j` identiques
--   (aucune ligne payante avant le 25/08) — comparer avec les mêmes SELECT sans `not is_paid`.
-- 4.4 — vue toujours security_invoker et 1 seule dépendante :
--   select reloptions from pg_class where relname = 'v_form_submissions_clean';  -- {security_invoker=true}
-- 4.5 — RPC : `select jsonb_pretty(public.bulletin_seo_metrics('<jeton>'))` (jeton Vault, côté Jérôme/n8n)
--   → clés `candidatures_payantes` et `candidats_uniques_payants` présentes, à 0 avant le 25/08.
-- 4.6 — Anon ne lit rien :
--   set role anon; select count(*) from v_form_submissions_clean; reset role;  -- 0 (RLS via invoker)

-- ---------------------------------------------------------------------------
-- PARTIE 5 — Rollback (ordre inverse ; réversible sans perte hors colonnes d'attribution)
-- ---------------------------------------------------------------------------
-- 5.1 RPC : redéployer la définition du 21/08 (migration `checkpoint_2026_08_21_is_test_candidats_uniques`
--     dans l'historique Supabase) — identique à ci-dessus sans les filtres is_paid ni les
--     deux clés *_payant(e)s.
-- 5.2 Vue (définition du 21/08) :
--   drop view if exists public.v_form_submissions_clean;
--   create view public.v_form_submissions_clean with (security_invoker = true) as
--   select id, created_at, form_type, source, language, is_test
--   from (select fs.id, fs.created_at, fs.form_type, fs.source, fs.language, fs.is_test,
--                lag(fs.created_at) over (partition by fs.form_type order by fs.created_at) as prev_at
--         from public.form_submissions fs where not fs.is_test) t
--   where prev_at is null or (created_at - prev_at) > interval '10 minutes';
--   grant select on public.v_form_submissions_clean to anon, authenticated, service_role;
-- 5.3 Colonnes (après retour Edge v12, ou en laissant la v13 dont le filet rejoue sans ces champs) :
--   alter table public.prospects        drop column if exists utm_source, drop column if exists utm_medium,
--     drop column if exists utm_campaign, drop column if exists utm_content, drop column if exists utm_term,
--     drop column if exists gclid;
--   alter table public.form_submissions drop column if exists utm_source, drop column if exists utm_medium,
--     drop column if exists utm_campaign, drop column if exists utm_content, drop column if exists utm_term,
--     drop column if exists gclid;
