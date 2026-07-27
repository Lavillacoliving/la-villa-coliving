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
--   ALTER DATABASE postgres SET app.settings.bulletin_token = 'REMPLACER_PAR_UN_JETON_LONG';
--   puis reconnecter la session (le paramètre est lu à l'ouverture de connexion).
-- Ne mets PAS ce jeton dans le dépôt : il vivra uniquement dans le credential n8n.

-- ÉTAPE 2 : la fonction.
CREATE OR REPLACE FUNCTION public.bulletin_seo_metrics(p_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $fn$
DECLARE
  v_expected text := current_setting('app.settings.bulletin_token', true);
  v_result   jsonb;
BEGIN
  -- Échec fermé : si le jeton n'est pas configuré, personne ne passe.
  IF v_expected IS NULL OR length(v_expected) < 16 THEN
    RAISE EXCEPTION 'bulletin_seo_metrics: jeton non configure cote base';
  END IF;
  IF p_token IS DISTINCT FROM v_expected THEN
    RAISE EXCEPTION 'bulletin_seo_metrics: jeton invalide';
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
-- 1) Sans jeton configuré  -> doit lever « jeton non configure cote base » :
--      SELECT public.bulletin_seo_metrics('peu-importe');
-- 2) Après l'ALTER DATABASE + reconnexion, avec un mauvais jeton -> « jeton invalide ».
-- 3) Avec le bon jeton -> JSON complet :
--      SELECT jsonb_pretty(public.bulletin_seo_metrics('LE_JETON'));
-- 4) Appel HTTP (celui que fera n8n) :
--      POST https://tefpynkdxxfiefpkgitz.supabase.co/rest/v1/rpc/bulletin_seo_metrics
--      headers: apikey: <ANON_KEY>, Content-Type: application/json
--      body:    {"p_token": "LE_JETON"}
