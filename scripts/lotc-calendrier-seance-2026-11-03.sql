-- Seance du lot C du 03/11/2026 (brief "Geneve profils" v2, section 5) : calendrier editorial blog_calendar.
-- C1 : suppression des deux lignes "Coliving et couple" (19/07/2026 et 15/01/2027), contraires a "une chambre = une personne".
-- C2 : "Mutation a Geneve en janvier" liee a A3 (trouver-logement-avant-d-arriver-geneve), date = publication reelle (30/10/2026).
-- C3 : "Rentree a Geneve" marquee comme remplacee par A3 (note dans key_points, is_generated = true, lien vers A3).
-- SQL 100 % ASCII (U&''). Sauvegarde : scripts/backups/lotc-calendrier-2026-11-03.avant.json ; retour arriere : scripts/backups/lotc-calendrier-2026-11-03.retour-arriere.sql
BEGIN;
DO $c$
DECLARE bad text;
BEGIN
  SELECT string_agg(e.id, ', ') INTO bad FROM (VALUES
    ('64a6d0e7-e04c-442a-a74f-61aaefb634e8','27deb779dec8ada8f9b2118be2506d8a'),
    ('27da94d1-47fb-4f76-a447-60a28173e529','f63310f00e6170971496e4d697273b96'),
    ('01639a79-6bca-4f00-8f01-a7883ab299b9','644391043d44c1c32562821fd91421b0'),
    ('e99838b4-15a9-496a-a2c0-ec5389a02684','2379b452da304a0d4bd281d1dceca2da')) AS e(id, m)
  LEFT JOIN blog_calendar c ON c.id::text = e.id
  WHERE c.id IS NULL OR md5(row_to_json(c)::text) <> e.m;
  IF bad IS NOT NULL THEN RAISE EXCEPTION 'etat avant inattendu, rien n''est ecrit : %', bad; END IF;
  IF (SELECT count(*) FROM blog_calendar) <> 27 THEN RAISE EXCEPTION 'blog_calendar <> 27 lignes'; END IF;
  IF NOT EXISTS (SELECT 1 FROM blog_posts WHERE id = '4d980d67-6d52-435c-8acc-1bc824cb8a40' AND slug = 'trouver-logement-avant-d-arriver-geneve' AND is_published) THEN RAISE EXCEPTION 'A3 introuvable ou non publie'; END IF;
  IF EXISTS (SELECT 1 FROM blog_calendar WHERE blog_post_id = '4d980d67-6d52-435c-8acc-1bc824cb8a40') THEN RAISE EXCEPTION 'A3 deja lie au calendrier'; END IF;
END $c$;
-- C1
DELETE FROM blog_calendar WHERE id IN ('64a6d0e7-e04c-442a-a74f-61aaefb634e8','e99838b4-15a9-496a-a2c0-ec5389a02684');
-- C2
UPDATE blog_calendar SET blog_post_id = '4d980d67-6d52-435c-8acc-1bc824cb8a40', is_generated = true, scheduled_date = '2026-10-30', updated_at = now() WHERE id = '01639a79-6bca-4f00-8f01-a7883ab299b9';
-- C3
UPDATE blog_calendar SET key_points = coalesce(key_points, '[]'::jsonb) || jsonb_build_array(U&'Remplac\00E9e par A3 (/blog/trouver-logement-avant-d-arriver-geneve, publi\00E9 le 30/10/2026) : ne pas g\00E9n\00E9rer. Variante \00AB rentr\00E9e \00BB \00E0 d\00E9cider par J\00E9r\00F4me en ao\00FBt 2027 (lot C du 03/11/2026).'::text), is_generated = true, blog_post_id = '4d980d67-6d52-435c-8acc-1bc824cb8a40', updated_at = now() WHERE id = '27da94d1-47fb-4f76-a447-60a28173e529';
DO $c$
BEGIN
  IF (SELECT count(*) FROM blog_calendar) <> 25 THEN RAISE EXCEPTION 'blog_calendar <> 25 lignes apres'; END IF;
  IF EXISTS (SELECT 1 FROM blog_calendar WHERE title_fr ILIKE '%couple%') THEN RAISE EXCEPTION 'ligne couple restante'; END IF;
  IF NOT EXISTS (SELECT 1 FROM blog_calendar WHERE id = '01639a79-6bca-4f00-8f01-a7883ab299b9' AND blog_post_id = '4d980d67-6d52-435c-8acc-1bc824cb8a40' AND is_generated AND scheduled_date = '2026-10-30') THEN RAISE EXCEPTION 'C2 non conforme'; END IF;
  IF NOT EXISTS (SELECT 1 FROM blog_calendar WHERE id = '27da94d1-47fb-4f76-a447-60a28173e529' AND blog_post_id = '4d980d67-6d52-435c-8acc-1bc824cb8a40' AND is_generated AND scheduled_date = '2026-07-31' AND jsonb_array_length(key_points) = 6 AND key_points->>5 = U&'Remplac\00E9e par A3 (/blog/trouver-logement-avant-d-arriver-geneve, publi\00E9 le 30/10/2026) : ne pas g\00E9n\00E9rer. Variante \00AB rentr\00E9e \00BB \00E0 d\00E9cider par J\00E9r\00F4me en ao\00FBt 2027 (lot C du 03/11/2026).') THEN RAISE EXCEPTION 'C3 non conforme'; END IF;
END $c$;
COMMIT;
