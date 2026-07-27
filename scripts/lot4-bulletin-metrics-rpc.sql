-- Lot 4 — Fonction RPC d'agrégats pour le bulletin SEO hebdomadaire
-- ============================================================================
-- POURQUOI : `form_submissions` n'a AUCUNE policy RLS — seul `service_role` la lit.
-- La métrique n°1 du nouveau bulletin (candidatures) était donc inaccessible à tout
-- runner autonome sans lui confier la clé maîtresse de la base.
--
-- CETTE FONCTION ne renvoie que des COMPTAGES agrégés — aucune donnée personnelle,
-- aucun email, aucun nom, aucune ligne individuelle.
--
-- ⚠️ ÉCART ASSUMÉ AVEC LE MOTIF EXISTANT : `bot_log_and_context()` et
-- `bot_ticket_update()` sont ouvertes à `anon`, donc appelables par quiconque
-- possède la clé publique (elle est dans le bundle du site). Ce sont des données
-- business : on ne reproduit pas ça. Accès protégé par un jeton stocké en
-- paramètre de base — pas de nouvelle table, pas de secret dans le dépôt,
-- rien à exclure des backups.
--
-- CHECKLIST §12 (lavilla-docs/Schema_Supabase_LaVilla.md) :
--   1. Vues `v_*` : aucune touchée (ajout de fonction, aucune table modifiée).
--   2. Policies RLS : aucune modifiée. La fonction est SECURITY DEFINER et
--      contourne RLS uniquement pour produire des comptages.
--   2bis. Aucune contrainte CHECK modifiée.
--   3. `entities.ts` / `logAudit()` : non concernés (lecture seule, aucune action).
--   4. Trace : ce fichier.
--   5. Backup VPS : aucune nouvelle table.
--   6. Doc à mettre à jour : Schema_Supabase_LaVilla.md (section fonctions RPC).
-- ============================================================================

-- ÉTAPE 1 (à faire UNE FOIS, par Jérôme, avec un jeton de son choix) :
--
--   select vault.create_secret('COLLE_TON_JETON_ICI', 'bulletin_token',
--                              'Jeton du bulletin SEO hebdo (lu par n8n)');
--
-- Le jeton ne doit exister qu'à deux endroits : ce secret, et le credential n8n.
-- Jamais dans le dépôt.
--
-- ⚠️ NE PAS utiliser `ALTER DATABASE postgres SET app.settings.…` : le rôle du
-- SQL Editor Supabase n'en a pas le droit (« permission denied to set parameter »).
-- Vault est le mécanisme prévu pour ça, et il est déjà installé sur le projet
-- (supabase_vault 0.3.1, vérifié le 27/07/2026).
--
-- Pour faire tourner le jeton plus tard :
--   select vault.update_secret(id, 'NOUVEAU_JETON', 'bulletin_token', description)
--   from vault.secrets where name = 'bulletin_token';

-- ÉTAPE 2 : la fonction.
CREATE OR REPLACE FUNCTION public.bulletin_seo_metrics(p_token text default null)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, vault
STABLE
AS $fn$
DECLARE
  v_expected text;
  v_given    text;
  v_result   jsonb;
BEGIN
  -- Le jeton arrive par l'un des deux chemins :
  --   • argument `p_token`            → tests manuels dans le SQL Editor ;
  --   • en-tête HTTP x-bulletin-token → appel n8n.
  -- Le second existe parce que les Variables n8n (`$env`) sont réservées aux
  -- offres supérieures — « access to env vars denied », constaté le 27/07/2026.
  -- Avec l'en-tête, le jeton vit dans un credential Header Auth chiffré par n8n :
  -- il n'apparaît ni dans le JSON du workflow, ni dans ce dépôt.
  -- PostgREST expose les en-têtes via le GUC `request.headers` (vérifié en prod).
  v_given := coalesce(
    p_token,
    (current_setting('request.headers', true))::jsonb ->> 'x-bulletin-token'
  );

  SELECT decrypted_secret INTO v_expected
  FROM vault.decrypted_secrets WHERE name = 'bulletin_token' LIMIT 1;

  -- Échec fermé : sans secret dans le Vault, personne ne passe.
  IF v_expected IS NULL OR length(v_expected) < 16 THEN
    RAISE EXCEPTION 'bulletin_seo_metrics: secret « bulletin_token » absent du Vault (ou trop court)';
  END IF;
  IF v_given IS NULL OR v_given IS DISTINCT FROM v_expected THEN
    RAISE EXCEPTION 'bulletin_seo_metrics: jeton invalide ou absent';
  END IF;

  SELECT jsonb_build_object(
    'genere_le', now(),

    -- Métrique n°1 : candidatures réelles (pas les clics)
    'candidatures', jsonb_build_object(
      's1_7j',       (SELECT count(*) FROM form_submissions
                        WHERE created_at >= now() - interval '7 days'),
      's2_7j',       (SELECT count(*) FROM form_submissions
                        WHERE created_at >= now() - interval '14 days'
                          AND created_at <  now() - interval '7 days'),
      'total_30j',   (SELECT count(*) FROM form_submissions
                        WHERE created_at >= now() - interval '30 days'),
      'dernier_jour',(SELECT max(created_at)::date FROM form_submissions)
    ),

    -- Le vrai indicateur de fuite : les prospects jamais travaillés
    'prospects', jsonb_build_object(
      'bloques_new_plus_14j', (SELECT count(*) FROM prospects
                                 WHERE status = 'new'
                                   AND created_at < now() - interval '14 days'),
      'ouverts',              (SELECT count(*) FROM prospects
                                 WHERE status NOT IN ('signed','lost')),
      'signes_90j',           (SELECT count(*) FROM prospects
                                 WHERE status = 'signed'
                                   AND created_at >= now() - interval '90 days'),
      'site_web_30j',         (SELECT count(*) FROM prospects
                                 WHERE source = 'site_web'
                                   AND created_at >= now() - interval '30 days')
    ),

    -- Vue cohorte : le funnel hebdomadaire n'est pas reconstructible
    -- (aucun historique de statut en base), la cohorte est le meilleur proxy.
    'cohortes', (
      SELECT jsonb_agg(c ORDER BY c->>'mois')
      FROM (
        SELECT jsonb_build_object(
                 'mois',             to_char(created_at, 'YYYY-MM'),
                 'total',            count(*),
                 'reste_new',        count(*) FILTER (WHERE status = 'new'),
                 'en_cours',         count(*) FILTER (WHERE status IN
                                       ('contacted','photos_sent','visit_scheduled',
                                        'visit_done','interested')),
                 'contrat_ou_signe', count(*) FILTER (WHERE status IN
                                       ('contract_sent','signed')),
                 'perdus',           count(*) FILTER (WHERE status = 'lost')
               ) AS c
        FROM prospects
        WHERE created_at >= date_trunc('month', now() - interval '5 months')
        GROUP BY to_char(created_at, 'YYYY-MM')
      ) t
    ),

    -- Dénominateur de « candidatures par chambre libérée »
    'chambres_liberees_30j', (SELECT count(*) FROM tenants
                                WHERE move_out_date BETWEEN current_date - 30
                                                        AND current_date)
  ) INTO v_result;

  RETURN v_result;
END;
$fn$;

-- ÉTAPE 3 : droits. Surtout PAS `anon` par défaut sans jeton — ici le jeton
-- protège, mais on retire quand même l'exécution publique implicite.
REVOKE ALL ON FUNCTION public.bulletin_seo_metrics(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.bulletin_seo_metrics(text) TO anon, authenticated, service_role;

-- ============================================================================
-- VÉRIFICATION
-- ============================================================================
-- 1) Sans secret dans le Vault -> lève « secret bulletin_token absent du Vault ».
-- 2) Avec un mauvais jeton -> « jeton invalide ».
-- 3) Avec le bon jeton -> JSON complet :
--      SELECT jsonb_pretty(public.bulletin_seo_metrics('LE_JETON'));
--
-- Cycle complet testé en production le 27/07/2026 : création du secret, lecture
-- par la fonction, suppression, retour à l'échec fermé.
-- 4) Appel HTTP (celui que fera n8n) :
--      POST https://tefpynkdxxfiefpkgitz.supabase.co/rest/v1/rpc/bulletin_seo_metrics
--      headers: apikey: <ANON_KEY>, Content-Type: application/json
--      body:    {"p_token": "LE_JETON"}
