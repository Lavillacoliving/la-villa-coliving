-- scripts/v-social-proof-v2-2026-10-11.sql — vue v_social_proof v2 (décision Jérôme du 11/10/2026, point A1) : l'occupation
-- publiée exclut la montée en charge de chaque maison — les RAMP_UP_DAYS = 42 premiers jours (6 semaines) suivant l'ouverture
-- (= première entrée de la maison). Les colonnes « depuis l'ouverture » (occupancy_pct_all, by_house) sont CONSERVÉES ;
-- s'ajoutent ramp_up_days, occupancy_pct_all_steady et by_house_steady, que src/data/stats.ts (OCCUPANCY) reprend : 99,1 %
-- au 11/10/2026 (La Villa 99,9 · Loft 97,1 · Lodge 100,0) contre 97,7 % sans exclusion. Aucune donnée nominative.
-- Appliqué via MCP apply_migration le 11/10/2026 (DROP + CREATE : rejouable ; GRANT SELECT seul, REVOKE du reste).
BEGIN;
DROP VIEW IF EXISTS public.v_social_proof;
CREATE VIEW public.v_social_proof AS
WITH params AS (SELECT 42::int AS ramp_up_days),
src AS (
  SELECT house_slug, name_norm, move_in, move_out, status FROM public.resident_history
  UNION ALL
  SELECT p.slug, public.name_norm(t.first_name || t.last_name), t.move_in_date, t.move_out_date,
         CASE WHEN t.move_out_date IS NULL THEN 'current' ELSE 'ended' END
  FROM public.tenants t JOIN public.properties p ON p.id = t.property_id
  WHERE p.slug IN ('lavilla', 'leloft', 'lelodge')
    AND t.lease_status <> 'cancelled'
    AND t.room_number NOT IN (0, 99)
    AND t.move_in_date IS NOT NULL AND t.move_in_date <= current_date
    AND public.name_norm(t.first_name || t.last_name) <> 'jeromeaustin'
),
scope AS (
  SELECT house_slug, name_norm, move_in, move_out, status,
         CASE WHEN status = 'current' THEN current_date WHEN move_out IS NULL THEN move_in ELSE move_out END AS occ_until
  FROM src
),
houses AS (
  SELECT p.slug, p.room_count, (SELECT min(s.move_in) FROM scope s WHERE s.house_slug = p.slug) AS opened_on
  FROM public.properties p WHERE p.slug IN ('lavilla', 'leloft', 'lelodge')
),
days AS (
  SELECT h.slug, h.room_count, d::date AS day, (d::date >= h.opened_on + (SELECT ramp_up_days FROM params)) AS steady
  FROM houses h CROSS JOIN LATERAL generate_series(h.opened_on, current_date, interval '1 day') AS d
),
occ AS (
  SELECT d.slug, d.room_count, d.steady,
         least(d.room_count, (SELECT count(DISTINCT s.name_norm) FROM scope s
                              WHERE s.house_slug = d.slug AND s.move_in <= d.day AND s.occ_until >= d.day)) AS occupied
  FROM days d
),
by_house AS (
  SELECT slug,
         round(100.0 * sum(occupied) / nullif(sum(room_count), 0), 1) AS occupancy_pct,
         count(*) AS days_measured,
         round(100.0 * sum(occupied) FILTER (WHERE steady) / nullif(sum(room_count) FILTER (WHERE steady), 0), 1) AS occupancy_pct_steady,
         count(*) FILTER (WHERE steady) AS days_steady
  FROM occ GROUP BY slug
)
SELECT
  (SELECT count(DISTINCT name_norm) FROM scope)                          AS distinct_residents_since_opening,
  (SELECT min(move_in) FROM scope)                                       AS first_move_in,
  (SELECT count(DISTINCT public.name_norm(t.first_name || t.last_name))
     FROM public.tenants t JOIN public.properties p ON p.id = t.property_id
    WHERE p.slug IN ('lavilla', 'leloft', 'lelodge')
      AND t.lease_status IN ('active', 'signed')
      AND t.room_number NOT IN (0, 99)
      AND t.move_in_date IS NOT NULL AND t.move_in_date <= current_date
      AND (t.move_out_date IS NULL OR t.move_out_date >= current_date)
      AND public.name_norm(t.first_name || t.last_name) <> 'jeromeaustin')  AS current_residents,
  (SELECT json_object_agg(slug, json_build_object('occupancy_pct', occupancy_pct, 'days', days_measured)) FROM by_house) AS by_house,
  round(100.0 * (SELECT sum(occupied) FROM occ) / nullif((SELECT sum(room_count) FROM occ), 0), 1) AS occupancy_pct_all,
  (SELECT ramp_up_days FROM params)                                      AS ramp_up_days,
  (SELECT json_object_agg(slug, json_build_object('occupancy_pct', occupancy_pct_steady, 'days', days_steady)) FROM by_house) AS by_house_steady,
  round(100.0 * (SELECT sum(occupied) FILTER (WHERE steady) FROM occ) / nullif((SELECT sum(room_count) FILTER (WHERE steady) FROM occ), 0), 1) AS occupancy_pct_all_steady,
  current_date                                                           AS computed_on;
COMMENT ON VIEW public.v_social_proof IS 'Preuve sociale agrégée (Lot L3 du 09/10/2026, v2 du 11/10/2026) : résidents distincts depuis l''ouverture (resident_history ∪ tenants hors cancelled / Mont-Blanc / chambres 0-99 / Jérôme Austin / entrées futures), occupants courants, occupation en jours-chambre plafonnés depuis l''ouverture (occupancy_pct_all, by_house) et hors les ramp_up_days premiers jours de chaque maison (occupancy_pct_all_steady, by_house_steady — chiffre publié sur /investisseurs). Aucune donnée nominative. Lue par scripts/check-entity-facts.mjs.';
REVOKE ALL ON public.v_social_proof FROM anon, authenticated;
GRANT SELECT ON public.v_social_proof TO anon, authenticated;
COMMIT;
-- Vérification : SELECT occupancy_pct_all, occupancy_pct_all_steady, ramp_up_days, by_house_steady FROM public.v_social_proof;
--   → 97,7 · 99,1 · 42 · lavilla 99,9 / leloft 97,1 / lelodge 100,0 (11/10/2026)
-- Retour arrière : rejouer scripts/resident-history-2026-10-09.sql (bloc vue) — les colonnes v2 disparaissent, rien d'autre ne change.
