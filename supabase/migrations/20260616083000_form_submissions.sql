-- Table de journalisation des soumissions de formulaires (candidature, etc.)
-- Objectif : trace permanente, cote serveur, de chaque soumission reussie.
--   * Alimente le Health Check hebdo n8n ("Check Candidatures 7j").
--   * Independant de GA4 -> corrige la cause racine de la perte de suivi mai->juin 2026.
-- Confidentialite : AUCUNE donnee personnelle (pas de nom / email / telephone).
--   On ne stocke que le type de formulaire, la source (canal) et la langue.

create table if not exists public.form_submissions (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null    default now(),
  form_type   text        not null    default 'candidature',
  source      text,
  language    text
);

comment on table public.form_submissions is
  'Journal serveur des soumissions de formulaires (sans PII). Alimente le Health Check n8n.';

-- Requete du Health Check : created_at >= now()-7j AND form_type = 'candidature'
create index if not exists form_submissions_created_at_idx
  on public.form_submissions (created_at desc);
create index if not exists form_submissions_type_date_idx
  on public.form_submissions (form_type, created_at desc);

-- Securite : RLS active SANS policy publique.
-- => anon / authenticated = aucun acces. Seul le service_role (Edge Function + n8n) accede,
--    car le service_role bypass RLS. Coherent avec la posture "100% des tables protegees".
alter table public.form_submissions enable row level security;
