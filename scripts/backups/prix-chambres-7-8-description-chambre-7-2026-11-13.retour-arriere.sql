-- ============================================================================
-- Retour arrière du SQL 7 (décision V1-20) : remet la description d'avant de la chambre 7 de La Villa.
-- Mêmes gardes que le SQL 7 (scripts/prix-chambres-7-8-sql7-description-chambre-7-2026-11-13.sql), à l'envers. UN SEUL bloc DO : tout ou rien.
-- Ne retire pas la ligne d'audit_log du SQL 7 (le journal garde la trace) ; en ajoute une pour le retour.
-- Écrit le 13/11/2026 ; NON EXÉCUTÉ.
-- ============================================================================
DO $retour$
DECLARE n integer; etat text;
BEGIN
  etat := (SELECT md5(string_agg(r.room_number || ':' || coalesce(r.description, 'null'), '|' ORDER BY r.room_number)) FROM public.rooms r JOIN public.properties p ON p.id = r.property_id WHERE p.slug = 'lavilla');
  IF etat IS DISTINCT FROM '837ba2ac885edc344b5bc53d90671b3d' THEN RAISE EXCEPTION 'retour description-chambre-7 : les descriptions de La Villa ne sont pas dans l''état « après SQL 7 », rien n''est appliqué (empreinte %)', etat; END IF;

  UPDATE public.rooms r SET description = 'Chambre meublée incluant salle d''eau privative'
  FROM public.properties p WHERE p.id = r.property_id AND p.slug = 'lavilla' AND r.room_number = 7
    AND r.description = 'Chambre meublée incluant salle d''eau partagée';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'retour description-chambre-7 : % chambre(s) modifiée(s) au lieu de 1, tout est annulé', n; END IF;

  INSERT INTO public.audit_log (user_email, action, entity_type, entity_id, details)
  SELECT 'claude-code', 'update', 'room', r.id::text, jsonb_build_object('motif', 'retour arrière du SQL 7 (décision V1-20) : description d''avant remise', 'maison', 'lavilla', 'chambre', r.room_number, 'description', 'salle d''eau partagée -> salle d''eau privative')
  FROM public.rooms r JOIN public.properties p ON p.id = r.property_id WHERE p.slug = 'lavilla' AND r.room_number = 7;

  etat := (SELECT md5(string_agg(r.room_number || ':' || coalesce(r.description, 'null'), '|' ORDER BY r.room_number)) FROM public.rooms r JOIN public.properties p ON p.id = r.property_id WHERE p.slug = 'lavilla');
  IF etat IS DISTINCT FROM 'c5efcd579f025cd6ab5450c1183b768b' THEN RAISE EXCEPTION 'retour description-chambre-7 : l''état obtenu n''est pas l''état d''avant, tout est annulé (empreinte %)', etat; END IF;
END
$retour$;
