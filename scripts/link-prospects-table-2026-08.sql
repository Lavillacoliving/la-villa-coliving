-- ════════════════════════════════════════════════════════════════════════
-- link_prospects — machine de netlinking (Brief n°2, Chantier 4a — 21/08/2026)
--
-- Prospects de liens / citations du Plan Autorité (lavilla-docs/Plan_Autorite_Linkbuilding.md) :
-- cible · contact · envoi · relance · résultat · lien obtenu. L'ENVOI reste humain
-- (Jérôme / Cowork) — la table ne fait que tracer. Remplace le « simple tableur »
-- prescrit par le plan (jamais créé).
--
-- Checklist §12 (lavilla-docs/Schema_Supabase_LaVilla.md) :
--   1. Vues : aucune touchée.  2. RLS : admin-only (is_admin()) + service_role ; pas d'anon.
--   2bis. Aucune contrainte CHECK existante modifiée.  3. entities.ts / logAudit : non concernés.
--   4. Trace : ce fichier (+ seed scripts/link-prospects-seed-2026-08.sql, KPI scripts/link-prospects-kpi-mensuel.sql).
--   5. Backup VPS : ajouter `link_prospects` à /opt/scripts/backup-supabase.sh (colonne id triable présente).
--   6. Doc : Schema_Supabase_LaVilla.md — section « Prospects & acquisition » (MàJ 21/08/2026).
-- Idempotent (IF NOT EXISTS / DROP POLICY IF EXISTS). Appliqué via MCP Supabase apply_migration
-- le 21/08/2026 après validation du plan par Jérôme.
-- ════════════════════════════════════════════════════════════════════════

create table if not exists public.link_prospects (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  name             text not null,                       -- « CAGI », « GTE — frontalier.org »
  domain           text not null,                       -- hôte nu, minuscule : 'cagi.ch'
  url_cible        text,                                -- page où l'on veut figurer
  type             text not null check (type in ('institutionnel','presse','media_frontalier','communaute_expat',
                     'partenaire_relocation','annuaire','ecole','collectivite','association','blog','autre')),
  pilier           smallint check (pilier between 1 and 4),    -- Plan Autorité §2 : 1 GBP/avis · 2 citations · 3 éditorial · 4 partenariats
  tier             smallint check (tier between 1 and 4),      -- Plan_Backlinks_LaVilla
  dr               numeric(5,1),                               -- DR observé (UI Ahrefs), indicatif
  dofollow_attendu boolean,
  thematique       boolean not null default true,              -- lien thématique/local (KPI « dofollow thématiques »)
  contact_nom      text, contact_email text, contact_tel text, contact_url text,   -- PII pro → RLS admin-only
  template         text,                                       -- 'A'..'E', 'kit_presse_1'…
  angle            text,
  status           text not null default 'a_contacter' check (status in
                     ('a_contacter','envoye','relance','en_discussion','accepte','live','sans_reponse','refuse','abandonne','exclu')),
  sent_at          date, followup_at date, replied_at date, live_at date,
  live_url         text,                                       -- URL de la page qui nous lie
  target_path      text,                                       -- notre page visée : '/candidature', '/en/colocation-geneve'…
  anchor_text      text,
  anchor_class     text check (anchor_class in ('marque','url_nue','generique','exact')),  -- mix cible off-site 40/25/25/10
  rel_nofollow     boolean,                                    -- constaté une fois live
  last_checked_at  timestamptz,                                -- dernier contrôle « toujours live »
  source_doc       text,                                       -- 'PLAN_AUTORITE_CIBLES_LOCALES_2026-06.md zone A'
  notes            text,
  constraint link_prospects_live_coherence check (status <> 'live' or (live_at is not null and live_url is not null))
);

create unique index if not exists link_prospects_domain_url_uidx on public.link_prospects (lower(domain), coalesce(url_cible, ''));
create index if not exists link_prospects_status_idx   on public.link_prospects (status);
create index if not exists link_prospects_live_at_idx  on public.link_prospects (live_at) where live_at is not null;
create index if not exists link_prospects_followup_idx on public.link_prospects (followup_at) where status in ('envoye','relance');

-- updated_at automatique — fonction générique existante (déjà utilisée par payments, tenants)
drop trigger if exists trg_link_prospects_updated on public.link_prospects;
create trigger trg_link_prospects_updated before update on public.link_prospects
  for each row execute function public.update_timestamp();

alter table public.link_prospects enable row level security;
drop policy if exists "admin_full_link_prospects" on public.link_prospects;
create policy "admin_full_link_prospects" on public.link_prospects
  for all to public using (is_admin()) with check (is_admin());
drop policy if exists "service_role_link_prospects" on public.link_prospects;
create policy "service_role_link_prospects" on public.link_prospects
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

comment on table  public.link_prospects is 'Prospects de liens / citations (Plan Autorité 2026, Brief n°2 21/08/2026). Cible · contact · envoi · relance · résultat. Admin-only (contacts pro). Envoi humain. Mix d''ancres cible off-site 40 % marque / 25 % URL nue / 25 % générique / 10 % exact.';
comment on column public.link_prospects.status is 'a_contacter → envoye → relance → en_discussion → accepte → live | sans_reponse | refuse | abandonne | exclu (plateformes à commission/frais locataire, jamais à recontacter)';
comment on column public.link_prospects.anchor_class is 'marque | url_nue | generique | exact — pour tenir la règle 40/25/25/10 sur les liens obtenus';
comment on column public.link_prospects.thematique is 'true si le domaine est thématique/local (frontalier, Genève, Annemasse, logement) — compte dans le KPI « dofollow thématiques »';
comment on column public.link_prospects.live_at is 'Date à laquelle le lien a été constaté en ligne (obligatoire si status = live)';
