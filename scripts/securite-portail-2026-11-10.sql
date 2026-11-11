-- Sécurité du portail locataire — constat du 10/11/2026 (état des lieux du lot « portail » du bail v3).
--
-- CONSTAT. L'inscription au portail est ouverte : toute personne qui saisit son e-mail reçoit un lien de connexion et
-- obtient un compte « connecté » (4 prospects l'ont fait entre avril et août 2026). Or quatre règles du dossier de
-- fichiers « operations » (admin_read / admin_upload / admin_update / admin_delete) s'appliquent à tout compte
-- connecté, sans vérifier qu'il s'agit d'un administrateur : un tel compte peut lister, télécharger, remplacer et
-- supprimer les 324 fichiers du dossier, dont les 287 fichiers des 73 dossiers de locataires (baux, pièces d'identité,
-- bulletins de salaire, avis d'imposition). De même, tout compte connecté lit les tables properties (adresses des
-- maisons, internes depuis le 12/10/2026), entities (IBAN des bailleurs) et rooms.
-- Aucune trace d'abus n'a été recherchée ni trouvée : les journaux d'accès aux fichiers ne remontent pas à ces dates.
--
-- CORRECTIF. A = fichiers : l'administrateur garde tous les droits (règle admin_all_operations, inchangée) ; un
-- locataire actif lit seulement son propre dossier « tenants/<sa fiche>/ » ; tout autre compte ne voit plus rien.
-- B = tables : un locataire actif lit seulement sa maison, le bailleur de sa maison et les chambres de sa maison.
-- Rien ne change pour le tableau de bord (administrateur avec double authentification), le site public (vues
-- v_public_rooms et v_social_proof), les fonctions Edge et n8n (clé de service).
-- Retour arrière : scripts/securite-portail-2026-11-10.rollback.sql.
--
-- APPLIQUÉ EN PRODUCTION LE 10/11/2026 (« GO sécurité » de Jérôme), migrations securite_portail_2026_11_10 et
-- securite_portail_2026_11_10_revoke_anon. Vérifié après application : compte connecté non locataire = 0 fichier,
-- 0 maison, 0 bailleur, 0 chambre ; locataire = son dossier (14 fichiers pour la fiche testée), 1 maison, 1 bailleur,
-- les chambres de sa maison ; administrateur = 324 fichiers, 4 maisons, 3 bailleurs, 30 chambres ; visiteur = 29
-- chambres publiques, rien d'interne (contrôlé aussi par l'API publique).

begin;

-- ───────────────────────────── A. Fichiers du dossier « operations » ─────────────────────────────
drop policy if exists admin_read_operations   on storage.objects;
drop policy if exists admin_upload_operations on storage.objects;
drop policy if exists admin_update_operations on storage.objects;
drop policy if exists admin_delete_operations on storage.objects;

drop policy if exists tenant_read_own_operations on storage.objects;
create policy tenant_read_own_operations on storage.objects
  for select to authenticated
  using (
    bucket_id = 'operations'
    and (storage.foldername(name))[1] = 'tenants'
    and (storage.foldername(name))[2] in (
      select t.id::text from public.tenants t
      where t.email = (auth.jwt() ->> 'email') and t.is_active = true
    )
  );

-- ───────────────────────────── B. Tables lues par tout compte connecté ─────────────────────────────
-- Maisons du locataire connecté (fiches actives à son e-mail). SECURITY DEFINER : la fonction lit tenants sans
-- dépendre des règles de cette table, et ne renvoie que des identifiants de maisons.
create or replace function public.my_tenant_property_ids()
returns setof uuid
language sql
stable
security definer
set search_path = ''
as $$
  select t.property_id
  from public.tenants t
  where t.email = (auth.jwt() ->> 'email') and t.is_active = true and t.property_id is not null;
$$;
revoke all on function public.my_tenant_property_ids() from public;
-- Supabase ouvre par défaut toute nouvelle fonction au rôle anon : on le retire (signalé par le contrôle de sécurité).
revoke execute on function public.my_tenant_property_ids() from anon;
grant execute on function public.my_tenant_property_ids() to authenticated;

drop policy if exists "Authenticated read properties" on public.properties;
drop policy if exists tenant_read_own_property on public.properties;
create policy tenant_read_own_property on public.properties
  for select to authenticated
  using (id in (select public.my_tenant_property_ids()));

drop policy if exists authenticated_read_entities on public.entities;
drop policy if exists tenant_read_own_entity on public.entities;
create policy tenant_read_own_entity on public.entities
  for select to authenticated
  using (id in (select p.entity_id from public.properties p where p.id in (select public.my_tenant_property_ids())));

drop policy if exists rooms_select_authenticated on public.rooms;
drop policy if exists rooms_select_admin_or_own_house on public.rooms;
create policy rooms_select_admin_or_own_house on public.rooms
  for select to authenticated
  using (public.is_admin() or property_id in (select public.my_tenant_property_ids()));

commit;

-- Contrôles après application (lecture seule) :
--   select policyname, cmd from pg_policies where schemaname = 'storage' and tablename = 'objects' and (coalesce(qual,'') || coalesce(with_check,'')) like '%operations%';
--     → admin_all_operations (ALL), tenant_read_own_operations (SELECT)
--   select tablename, policyname, cmd from pg_policies where schemaname = 'public' and tablename in ('properties','entities','rooms') order by 1, 2;
