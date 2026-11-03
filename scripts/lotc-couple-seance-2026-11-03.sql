-- Seance du lot C du 03/11/2026, option A de D-C1 (regle du 29/09 : une chambre = une personne, un couple = deux chambres) :
-- phrases "couple" d'A1 et A3, FR et EN (scripts/lotc-couple.edits.mjs). SQL 100 % ASCII (U&''), md5 controles avant et apres.
-- Sauvegarde : scripts/backups/lotc-couple-2026-11-03.avant.json ; retour arriere : scripts/backups/lotc-couple-2026-11-03.retour-arriere.sql
BEGIN;
DO $c$
DECLARE bad text;
BEGIN
  SELECT string_agg(e.slug, ', ') INTO bad FROM (VALUES
    ('ou-habiter-en-france-quand-on-travaille-a-geneve','a760dd16475d48c19ef8b09869c5d780','06c15f82c14411e2f8e9b69ecf2c5115','b52e0f446be50dec205cd42e65d387c7'),
    ('trouver-logement-avant-d-arriver-geneve','bacad1b12cffab57679e8f252bd6e4a2','de592cb4d27f2071420974ed6fb1e82e','3396ba5ff8792e56fdae98ba58a570ea')) AS e(slug, f, en, m)
  LEFT JOIN blog_posts b ON b.slug = e.slug
  WHERE b.slug IS NULL OR md5(b.content_fr) <> e.f OR md5(b.content_en) <> e.en OR md5(coalesce(b.title_fr,'') || chr(31) || coalesce(b.title_en,'') || chr(31) || coalesce(b.meta_description_fr,'') || chr(31) || coalesce(b.meta_description_en,'')) <> e.m;
  IF bad IS NOT NULL THEN RAISE EXCEPTION 'etat avant inattendu, rien n''est ecrit : %', bad; END IF;
  IF (SELECT count(*) FROM blog_posts WHERE is_published) <> 42 THEN RAISE EXCEPTION 'nombre d''articles publies <> 42'; END IF;
END $c$;
UPDATE blog_posts SET content_fr = replace(content_fr, U&'Et si tu viens en couple ou en famille, notre formule n''est pas la bonne : nos chambres sont pour une personne. Cherche plut\00F4t un T2 ou un T3, et pr\00E9vois les d\00E9lais les plus longs du tableau ci-dessous.', U&'Et si tu viens en famille, ou en couple qui veut son propre logement, notre formule n''est pas la bonne : chez nous, une chambre accueille une seule personne (un couple peut en prendre deux). Cherche plut\00F4t un T2 ou un T3, et pr\00E9vois les d\00E9lais les plus longs du tableau ci-dessous.'), updated_at = now() WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve';
UPDATE blog_posts SET content_en = replace(content_en, U&'And if you''re coming as a couple or a family, our format isn''t the right one: our rooms are for one person. Look for a one- or two-bedroom flat instead, and plan on the longer timelines in the table below.', U&'And if you''re coming as a family, or as a couple who want a place of your own, our format isn''t the right one: with us, each room is for one person (a couple can take two). Look for a one- or two-bedroom flat instead, and plan on the longer timelines in the table below.'), updated_at = now() WHERE slug = 'ou-habiter-en-france-quand-on-travaille-a-geneve';
UPDATE blog_posts SET content_fr = replace(content_fr, U&'En couple ou en famille, vise un studio ou un appartement, avec le d\00E9lai haut du tableau.', U&'En famille, ou en couple qui veut son propre logement, vise un studio ou un appartement, avec le d\00E9lai haut du tableau.'), updated_at = now() WHERE slug = 'trouver-logement-avant-d-arriver-geneve';
UPDATE blog_posts SET content_en = replace(content_en, U&'As a couple or a family, look for a studio or a flat, and plan on the longer timelines in the table.', U&'As a family, or as a couple who want a place of your own, look for a studio or a flat, and plan on the longer timelines in the table.'), updated_at = now() WHERE slug = 'trouver-logement-avant-d-arriver-geneve';
DO $c$
DECLARE bad text;
BEGIN
  SELECT string_agg(e.slug, ', ') INTO bad FROM (VALUES
    ('ou-habiter-en-france-quand-on-travaille-a-geneve','910e176dc71ada2449fbd4efb68f38d5','24c80a2081dfbdf2f81eafa5e5262fe7','b52e0f446be50dec205cd42e65d387c7'),
    ('trouver-logement-avant-d-arriver-geneve','02af10bacd61d27488a0bbda5a4dd294','4ff54ac8ab648e99b2912ab5576215e8','3396ba5ff8792e56fdae98ba58a570ea')) AS e(slug, f, en, m)
  LEFT JOIN blog_posts b ON b.slug = e.slug
  WHERE b.slug IS NULL OR md5(b.content_fr) <> e.f OR md5(b.content_en) <> e.en OR md5(coalesce(b.title_fr,'') || chr(31) || coalesce(b.title_en,'') || chr(31) || coalesce(b.meta_description_fr,'') || chr(31) || coalesce(b.meta_description_en,'')) <> e.m;
  IF bad IS NOT NULL THEN RAISE EXCEPTION 'md5 inattendu apres, rien n''est ecrit : %', bad; END IF;
  IF (SELECT count(*) FROM blog_posts WHERE is_published) <> 42 THEN RAISE EXCEPTION 'nombre d''articles publies <> 42'; END IF;
END $c$;
COMMIT;
