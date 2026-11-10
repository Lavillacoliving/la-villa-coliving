-- Retour arrière de scripts/securite-portail-2026-11-10.sql : remet les règles telles qu'elles étaient le 10/11/2026
-- (définitions relevées dans pg_policies avant application). Rouvre l'exposition décrite dans le script d'origine.
begin;

drop policy if exists tenant_read_own_operations on storage.objects;
create policy admin_read_operations   on storage.objects for select to authenticated using (bucket_id = 'operations');
create policy admin_upload_operations on storage.objects for insert to authenticated with check (bucket_id = 'operations');
create policy admin_update_operations on storage.objects for update to authenticated using (bucket_id = 'operations') with check (bucket_id = 'operations');
create policy admin_delete_operations on storage.objects for delete to authenticated using (bucket_id = 'operations');

drop policy if exists tenant_read_own_property on public.properties;
create policy "Authenticated read properties" on public.properties for select to public using (auth.role() = 'authenticated');

drop policy if exists tenant_read_own_entity on public.entities;
create policy authenticated_read_entities on public.entities for select to public using (auth.role() = 'authenticated');

drop policy if exists rooms_select_admin_or_own_house on public.rooms;
create policy rooms_select_authenticated on public.rooms for select to authenticated using (true);

drop function if exists public.my_tenant_property_ids();

commit;
