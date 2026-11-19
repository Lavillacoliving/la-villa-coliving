-- ============================================================================
-- Prix des chambres 7 et 8 de La Villa — SQL 2 : chambres 7 et 8 de La Villa à 1380 € / 1290 CHF, prix d'appel de La Villa à 1290 CHF
-- À exécuter dans le MÊME CRÉNEAU que la fusion de feat/prix-chambres-7-8, juste avant elle : la garde check:facts compare chaque chambre de v_public_rooms à son palier (base et code divergents = prérendu bloqué, site inchangé).
-- UN SEUL bloc DO (une instruction, donc une transaction implicite) : garde d'entrée, 2 UPDATE, 3 lignes dans audit_log,
-- garde de sortie. Tout ou rien : au moindre écart, l'exception annule tout le bloc.
-- Tables écrites : rooms (2 lignes : rent_eur, rent_chf ; updated_at par le déclencheur rooms_updated_at), properties (1 ligne : price_chf,
-- updated_at), audit_log (3 lignes, convention des écritures faites par Claude Code). Jamais tenants, leases, payments, tenant_ledger.
-- Empreinte = md5 de la liste « maison:numéro:loyer €:loyer CHF » des 30 chambres, et de la liste « maison:prix d'appel » des 4 propriétés.
-- Écrit par un outil de la séance (hors dépôt) ; NON EXÉCUTÉ à la date du fichier.
-- ============================================================================
DO $seance$
DECLARE n integer; etat text;
BEGIN
  etat := (SELECT md5(string_agg(slug || ':' || room_number || ':' || coalesce(rent_eur::numeric(10,2)::text, 'null') || ':' || coalesce(rent_chf::text, 'null'), '|' ORDER BY slug, room_number)) FROM (SELECT p.slug, r.room_number, r.rent_eur, r.rent_chf FROM public.rooms r JOIN public.properties p ON p.id = r.property_id) x);
  IF etat IS DISTINCT FROM '1493fc65a47e4f212fda37e7de655d75' THEN RAISE EXCEPTION 'prix-chambres-7-8 : les loyers des chambres ne sont pas dans l''état attendu avant ce SQL, rien n''est appliqué (empreinte %)', etat; END IF;
  etat := (SELECT md5(string_agg(slug || ':' || coalesce(price_chf::text, 'null'), '|' ORDER BY slug)) FROM public.properties);
  IF etat IS DISTINCT FROM 'b326f28585e9d9eae2c1552abe9c95dc' THEN RAISE EXCEPTION 'prix-chambres-7-8 : les prix d''appel des propriétés ne sont pas dans l''état attendu avant ce SQL, rien n''est appliqué (empreinte %)', etat; END IF;

  UPDATE public.rooms r SET rent_eur = 1380, rent_chf = 1290
  FROM public.properties p WHERE p.id = r.property_id AND p.slug = 'lavilla' AND r.room_number IN (7, 8) AND r.rent_eur = 1470 AND r.rent_chf = 1370;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 2 THEN RAISE EXCEPTION 'prix-chambres-7-8 : % chambre(s) modifiée(s) au lieu de 2, tout est annulé', n; END IF;

  UPDATE public.properties SET price_chf = 1290, updated_at = now() WHERE slug = 'lavilla' AND price_chf = 1370;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'prix-chambres-7-8 : % propriété(s) modifiée(s) au lieu de 1, tout est annulé', n; END IF;

  INSERT INTO public.audit_log (user_email, action, entity_type, entity_id, details)
  SELECT 'claude-code', 'update', 'room', r.id::text, jsonb_build_object('motif', 'décision de Jérôme du 12/11/2026 : chambres 7 et 8 de La Villa à 1380 € par mois, soit 1290 CHF affichés (taux figé) ; site : CONTRACT_EUR.sharedBathSmall, branche feat/prix-chambres-7-8', 'maison', 'lavilla', 'chambre', r.room_number, 'rent_eur', '1470 -> 1380', 'rent_chf', '1370 -> 1290')
  FROM public.rooms r JOIN public.properties p ON p.id = r.property_id WHERE p.slug = 'lavilla' AND r.room_number IN (7, 8);
  INSERT INTO public.audit_log (user_email, action, entity_type, entity_id, details)
  VALUES ('claude-code', 'update', 'property', 'lavilla', jsonb_build_object('motif', 'décision de Jérôme du 12/11/2026 : chambres 7 et 8 de La Villa à 1380 € par mois, soit 1290 CHF affichés (taux figé) ; site : CONTRACT_EUR.sharedBathSmall, branche feat/prix-chambres-7-8', 'maison', 'lavilla', 'price_chf', '1370 -> 1290'));

  etat := (SELECT md5(string_agg(slug || ':' || room_number || ':' || coalesce(rent_eur::numeric(10,2)::text, 'null') || ':' || coalesce(rent_chf::text, 'null'), '|' ORDER BY slug, room_number)) FROM (SELECT p.slug, r.room_number, r.rent_eur, r.rent_chf FROM public.rooms r JOIN public.properties p ON p.id = r.property_id) x);
  IF etat IS DISTINCT FROM 'ae51aa5def33a1ecc6638d9f1c7a0b9d' THEN RAISE EXCEPTION 'prix-chambres-7-8 : l''état obtenu pour les chambres n''est pas l''état attendu, tout est annulé (empreinte %)', etat; END IF;
  etat := (SELECT md5(string_agg(slug || ':' || coalesce(price_chf::text, 'null'), '|' ORDER BY slug)) FROM public.properties);
  IF etat IS DISTINCT FROM '750333cd0d94816d2acad4ce7bfb27b8' THEN RAISE EXCEPTION 'prix-chambres-7-8 : l''état obtenu pour les prix d''appel n''est pas l''état attendu, tout est annulé (empreinte %)', etat; END IF;
END
$seance$;
-- Vérification (lecture seule) — attendu : 2 lignes à 1380.00 / 1290, puis 1290.
-- SELECT r.room_number, r.rent_eur, r.rent_chf, r.updated_at FROM public.rooms r JOIN public.properties p ON p.id = r.property_id WHERE p.slug = 'lavilla' AND r.room_number IN (7, 8) ORDER BY 1;
-- SELECT price_chf FROM public.properties WHERE slug = 'lavilla';
-- SELECT min(rent_chf), max(rent_chf), min(rent_eur), max(rent_eur), count(*) FROM public.v_public_rooms;   -- 1290 · 1430 · 1380.00 · 1530.00 · 29
-- Retour arrière : scripts/backups/prix-chambres-7-8-chambres-2026-11-13.retour-arriere.sql (mêmes gardes, à l'envers).
