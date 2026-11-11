-- Indice IRL : réparation de la fonction upsert_irl — appliqué en production le 11/11/2026
-- (migration `irl_upsert_table_qualifiee_2026_11_11`, version 20261111100449, « GO IRL » de Jérôme).
--
-- Constat : le script mensuel du serveur (/opt/scripts/update_irl.py, cron `0 8 1 * *`) lit l'INSEE,
-- trouve le nouvel indice, puis appelle la RPC upsert_irl. Depuis le 01/05/2026 cet appel renvoyait
-- « HTTP Error 404 » : la fonction a un search_path vide (durcissement de sécurité) mais nommait la table
-- sans son schéma, d'où l'erreur 42P01 « relation "irl_indices" does not exist », que l'API renvoie en 404.
-- Les trois indices de 2026 ont donc été ajoutés à la main (11/05, 11/08, 11/11).
--
-- Correctif : seule la ligne INSERT change (public.irl_indices). Signature, SECURITY DEFINER, search_path
-- et droits (service_role seul) sont inchangés.

create or replace function public.upsert_irl(p_year integer, p_quarter integer, p_value numeric, p_variation_pct numeric)
 returns void
 language plpgsql
 security definer
 set search_path to ''
as $function$
BEGIN
    INSERT INTO public.irl_indices (year, quarter, value, variation_pct, updated_at)
    VALUES (p_year, p_quarter, p_value, p_variation_pct, now())
    ON CONFLICT (year, quarter) DO UPDATE SET
        value = EXCLUDED.value,
        variation_pct = EXCLUDED.variation_pct,
        updated_at = now();
END;
$function$;

-- Contrôle (ne laisse aucune trace) :
--   begin;
--   set local role service_role;
--   select public.upsert_irl(2099, 1, 999.99, 9.99);
--   select count(*) from public.irl_indices where year = 2099;   -- 1
--   rollback;
--   select has_function_privilege('anon', 'public.upsert_irl(integer,integer,numeric,numeric)', 'execute');  -- false
--
-- Retour arrière : la même fonction avec « INSERT INTO irl_indices » (sans « public. »), c'est-à-dire
-- l'état en panne — sans intérêt, noté pour mémoire.
