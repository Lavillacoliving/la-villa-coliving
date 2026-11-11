-- Retour arrière du lot 3 du bail v3 (29/10/2026).
drop function if exists public.create_lease_v3(jsonb);
delete from public.services_catalog where active_from = date '2026-10-29' and version = '2026-10';
update public.services_catalog set active_to = null where active_to = date '2026-10-28' and version = '2026-10';
update public.entity_legal set mandate = null where entity_id = 'c882e0ab-306b-490a-88cb-30578f3715fa' and mandate->>'since' = '2026-10-28';
alter table public.properties drop column if exists buildings_fr, drop column if exists buildings_en, drop column if exists buildings_intro_fr, drop column if exists buildings_intro_en;
