-- ============================================================================
-- Prix des chambres 7 et 8 de La Villa — SQL 7 : description publique de la chambre 7 (décision V1-20, oui de Jérôme le 19/11/2026)
-- La chambre 7 de La Villa a bathroom_type = 'shared' et bathroom_detail « Salle d'eau partagée entre 2 chambres… »,
-- mais sa description dit « Chambre meublée incluant salle d'eau privative ». Cette description est publiée
-- (v_public_rooms → /lavilla, /en/lavilla, données de /chambres-disponibles) et reprise par l'ancien générateur de bail (v2).
-- Après le Lot 1, la FAQ des tarifs dit que les chambres 7 et 8 partagent une salle d'eau : la description la contredirait.
-- Nouveau texte = celui des chambres 3, 4 et 8, au caractère près.
-- Indépendant du code et des autres SQL : aucune garde du site ne lit cette colonne (passage possible dès le GO,
-- avant ou pendant le jour J). Le prochain passage du robot de publication reprend la page.
-- UN SEUL bloc DO (une transaction) : garde d'entrée, 1 UPDATE, 1 ligne dans audit_log, garde de sortie. Tout ou rien.
-- Tables écrites : rooms (1 ligne : description ; updated_at par le déclencheur rooms_updated_at), audit_log (1 ligne).
-- Empreinte = md5 de la liste « numéro:description » des 10 chambres de La Villa (les autres maisons ne comptent pas).
-- Dans le dépôt : scripts/prix-chambres-7-8-sql7-description-chambre-7-2026-11-13.sql (ce SQL) et
-- scripts/backups/prix-chambres-7-8-description-chambre-7-2026-11-13.retour-arriere.sql (son retour arrière) ; la répétition en lecture seule reste hors dépôt.
-- Écrit le 13/11/2026 ; NON EXÉCUTÉ à la date du fichier.
-- ============================================================================
DO $seance$
DECLARE n integer; etat text;
BEGIN
  etat := (SELECT md5(string_agg(r.room_number || ':' || coalesce(r.description, 'null'), '|' ORDER BY r.room_number)) FROM public.rooms r JOIN public.properties p ON p.id = r.property_id WHERE p.slug = 'lavilla');
  IF etat IS DISTINCT FROM 'c5efcd579f025cd6ab5450c1183b768b' THEN RAISE EXCEPTION 'description-chambre-7 : les descriptions des chambres de La Villa ne sont pas dans l''état attendu avant ce SQL, rien n''est appliqué (empreinte %)', etat; END IF;

  UPDATE public.rooms r SET description = 'Chambre meublée incluant salle d''eau partagée'
  FROM public.properties p WHERE p.id = r.property_id AND p.slug = 'lavilla' AND r.room_number = 7
    AND r.bathroom_type = 'shared' AND r.description = 'Chambre meublée incluant salle d''eau privative';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'description-chambre-7 : % chambre(s) modifiée(s) au lieu de 1, tout est annulé', n; END IF;

  INSERT INTO public.audit_log (user_email, action, entity_type, entity_id, details)
  SELECT 'claude-code', 'update', 'room', r.id::text, jsonb_build_object('motif', 'description publique alignée sur la salle d''eau réelle (bathroom_type = shared), comme les chambres 3, 4 et 8 ; décision V1-20 du dossier du 13/11/2026, branche feat/prix-chambres-7-8', 'maison', 'lavilla', 'chambre', r.room_number, 'description', 'salle d''eau privative -> salle d''eau partagée')
  FROM public.rooms r JOIN public.properties p ON p.id = r.property_id WHERE p.slug = 'lavilla' AND r.room_number = 7;

  etat := (SELECT md5(string_agg(r.room_number || ':' || coalesce(r.description, 'null'), '|' ORDER BY r.room_number)) FROM public.rooms r JOIN public.properties p ON p.id = r.property_id WHERE p.slug = 'lavilla');
  IF etat IS DISTINCT FROM '837ba2ac885edc344b5bc53d90671b3d' THEN RAISE EXCEPTION 'description-chambre-7 : l''état obtenu n''est pas l''état attendu, tout est annulé (empreinte %)', etat; END IF;
END
$seance$;
-- Vérification (lecture seule) — attendu : 4 lignes, toutes « Chambre meublée incluant salle d'eau partagée », bathroom_type = shared.
-- SELECT r.room_number, r.bathroom_type, r.description, r.updated_at FROM public.rooms r JOIN public.properties p ON p.id = r.property_id WHERE p.slug = 'lavilla' AND r.room_number IN (3, 4, 7, 8) ORDER BY 1;
