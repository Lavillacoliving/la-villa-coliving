-- ============================================================================
-- Intérêt chambre/maison déclaré à l'atterrissage (LP /chambres-septembre)
-- Brief LOT 2 du 24/08/2026 — critère §7.2 : la ligne Supabase doit porter
-- `property_interest` pré-rempli depuis la carte chambre cliquée.
-- Migration Supabase `property_interest_2026_08_24`, appliquée via MCP après GO.
--
-- ⚠️ CORRECTION DE CONCEPTION (24/08, avant application) : une introspection de la
-- PRODUCTION a montré que `prospects.property_interest` EXISTAIT DÉJÀ — en **uuid**,
-- avec une **clé étrangère vers properties(id)** et 6 lignes renseignées ; et
-- `prospects.room_interest` existait déjà en text (0 ligne). Ces colonnes ne sont
-- pas documentées dans Schema_Supabase_LaVilla.md.
-- Conséquences, toutes intégrées ici :
--   • on NE TOUCHE PAS à `prospects` : ses colonnes sont déjà bonnes ;
--   • seule `form_submissions` reçoit les 2 colonnes, en MIROIR EXACT du typage de
--     `prospects` (uuid + FK, et text) — sinon les deux tables divergeraient ;
--   • la valeur écrite est un **uuid de properties**, PAS un slug. L'Edge v14 traduit
--     le slug reçu du front (`lavilla`, `leloft`, `lelodge`, `montblanc`) en uuid via
--     une table de correspondance figée. Écrire le slug tel quel aurait été rejeté par
--     le type uuid, et le filet de l'Edge aurait silencieusement jeté le champ.
--
-- CHECKLIST §12 (lavilla-docs/Schema_Supabase_LaVilla.md) :
--   1. Vues : `v_form_submissions_clean` recréée (DROP + CREATE — seule vue dépendante
--      de form_submissions) : expose property_interest et room_interest ;
--      security_invoker = true conservé ; grants identiques. La RPC
--      `bulletin_seo_metrics` lit la vue par colonnes nommées : non modifiée.
--   2. RLS : inchangée — colonnes nullables ajoutées ; policies existantes intactes
--      (form_submissions : Admins full access — anon sans policy).
--   2bis. AUCUNE contrainte CHECK modifiée. `prospects.source` n'est pas touché.
--   3. entities.ts : la correspondance slug → uuid vit dans l'Edge, alignée sur
--      properties.slug (sans tiret). logAudit : non concerné.
--   4. Trace : ce fichier.
--   5. Backup VPS : aucune table nouvelle.
--   6. Doc : Schema_Supabase_LaVilla.md (§6.4 + vue) — et signaler les colonnes
--      `prospects.property_interest` / `room_interest` absentes du document.
--
-- Additive et réversible (rollback en partie 3).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- PARTIE 1 — form_submissions : miroir exact du typage de prospects
-- ---------------------------------------------------------------------------
alter table public.form_submissions
  add column if not exists property_interest uuid references public.properties(id),
  add column if not exists room_interest     text;

comment on column public.form_submissions.property_interest is
  'Maison visée, déclarée par le clic sur une carte chambre (LP /chambres-septembre). uuid properties(id) — même typage que prospects.property_interest. L''Edge send-candidature-email v14 traduit le slug reçu du front en uuid.';
comment on column public.form_submissions.room_interest is
  'Chambre visée si connue (ex. « chambre-4 »). Texte libre, aucun CHECK. Edge v14.';

-- ---------------------------------------------------------------------------
-- PARTIE 2 — Vue `v_form_submissions_clean` : DROP + CREATE (jamais d'ALTER).
--   Identique à la version du 22/08, + property_interest et room_interest.
--   Dédoublonnage 10 min, filtre non-test et is_paid inchangés.
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
  'Soumissions réelles (hors is_test) dédoublonnées à 10 min par form_type. is_paid = gclid présent ou utm_medium = cpc (Google Ads). Le KPI SEO (candidatures nettes) = is_paid = false. property_interest (uuid properties) / room_interest : maison et chambre visées, déclarées au clic sur une carte de la LP (24/08/2026).';

grant select on public.v_form_submissions_clean to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- PARTIE 3 — Rollback : recréer la vue SANS les 2 colonnes (version du 22/08),
--   puis supprimer les colonnes de form_submissions.
--   ⚠️ Ne jamais exécuter en même temps que les parties 1-2.
--   ⚠️ Ne JAMAIS supprimer prospects.property_interest / room_interest : elles
--      préexistaient à cette migration et portent des données métier.
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
-- alter table public.form_submissions drop column if exists property_interest, drop column if exists room_interest;
