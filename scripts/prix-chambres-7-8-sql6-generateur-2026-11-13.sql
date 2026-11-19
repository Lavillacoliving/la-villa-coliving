-- ============================================================================
-- Prix des chambres 7 et 8 de La Villa — SQL 6 : consigne du générateur d'articles, version 9 (décision de Jérôme du 12/11/2026)
-- Pourquoi : la consigne active (v8) dit encore « dès 1 370 CHF/mois » dans sa liste de contrôle. Le générateur d'articles (n8n, dimanche)
--            la lit : sans cette mise à jour, les prochains articles reprendraient l'ancien prix d'appel. Prix EN CLAIR : aucun jeton n'y est résolu.
-- Quand    : dans le même créneau que la fusion de feat/prix-chambres-7-8, et avant le prochain passage du générateur.
-- Contenu  : v9 = v8 avec 4 replace() (en-tête de version, les deux mentions du prix d'appel, l'endroit où vit le détail des paliers) ; v8 désactivée, JAMAIS supprimée.
--            UN SEUL bloc DO (transaction implicite) : garde d'entrée (v8 active, md5 et longueur relevés le 13/11/2026 ; pas de v9),
--            garde de sortie (md5 et longueur de la v9 calculés en base par SELECT ; une seule version active). Tout ou rien.
--            Le texte de la consigne n'est ni lu ni recopié dans ce dépôt.
--   en-tête de version : « (v8, 12/11/2026 —  » → « (v9, 19/11/2026 — prix d'appel des maisons : dès 1 290 CHF/mois, décision de Jérôme du 12/11/2026 ; v8 12/11/2026 —  »
--   liste de contrôle des faits : prix dans la prose : « dès 1 370 CHF/mois tout inclus » → « dès 1 290 CHF/mois tout inclus »
--   rappel des faits de la fiche entité : « (dès 1 370 CHF,  » → « (dès 1 290 CHF,  »
--   où vit le détail des paliers : « vit sur /tarifs et dans la fiche entité injectée par le site » → « vit sur /tarifs, la page La Villa et llms.txt »
-- La date de l'en-tête (19/11/2026) est celle de la mise en ligne retenue : à redater avec ENTITY_FACTS_VERSION si la séance a lieu un autre jour
-- (régénérer ce fichier, puis refaire la répétition qui donne le md5 attendu).
-- Écrit par un outil de la séance ; NON EXÉCUTÉ à la date du fichier.
-- ============================================================================
DO $seance$
BEGIN
  IF (SELECT count(*) FROM public.blog_editorial_strategy WHERE version = 8 AND is_active AND md5(content_md) = '1b66dc2211f3d775dc8d8648a277b38f' AND length(content_md) = 7982) <> 1
     OR EXISTS (SELECT 1 FROM public.blog_editorial_strategy WHERE version >= 9)
     OR (SELECT count(*) FROM public.blog_editorial_strategy WHERE is_active) <> 1
  THEN RAISE EXCEPTION 'prix-chambres-7-8 : la consigne a changé depuis le 13/11/2026, rien n''est appliqué (relire et régénérer le fichier)';
  END IF;

  INSERT INTO public.blog_editorial_strategy (version, is_active, content_md, updated_by)
  SELECT 9, true, replace(replace(replace(replace(content_md, '(v8, 12/11/2026 — ', '(v9, 19/11/2026 — prix d''appel des maisons : dès 1 290 CHF/mois, décision de Jérôme du 12/11/2026 ; v8 12/11/2026 — '), 'dès 1 370 CHF/mois tout inclus', 'dès 1 290 CHF/mois tout inclus'), '(dès 1 370 CHF, ', '(dès 1 290 CHF, '), 'vit sur /tarifs et dans la fiche entité injectée par le site', 'vit sur /tarifs, la page La Villa et llms.txt'), 'Claude Code — prix des chambres 7 et 8 de La Villa, décision de Jérôme du 12/11/2026'
  FROM public.blog_editorial_strategy WHERE version = 8 AND is_active;
  UPDATE public.blog_editorial_strategy SET is_active = false WHERE version = 8;

  IF (SELECT count(*) FROM public.blog_editorial_strategy WHERE version = 9 AND is_active AND md5(content_md) = 'cafb5553eb692c85c48fdf4973667c08' AND length(content_md) = 8065) <> 1
     OR (SELECT count(*) FROM public.blog_editorial_strategy WHERE is_active) <> 1
     OR (SELECT count(*) FROM public.blog_editorial_strategy WHERE version = 8 AND NOT is_active AND md5(content_md) = '1b66dc2211f3d775dc8d8648a277b38f') <> 1
  THEN RAISE EXCEPTION 'prix-chambres-7-8 : l''état obtenu pour la consigne n''est pas l''état attendu, tout est annulé';
  END IF;
END
$seance$;
-- Vérification (lecture seule) — attendu :
-- SELECT version, is_active, md5(content_md) AS md5, length(content_md) AS longueur FROM public.blog_editorial_strategy WHERE version IN (8, 9) ORDER BY version DESC;
--   9 · true · cafb5553eb692c85c48fdf4973667c08 · 8065
--   8 · false · 1b66dc2211f3d775dc8d8648a277b38f · 7982
-- Retour arrière (une ligne) : UPDATE public.blog_editorial_strategy SET is_active = (version = 8) WHERE version IN (8, 9);
--   La v9 reste alors en base, inactive : ce SQL ne se rejoue plus tel quel (sa garde refuse une v9 existante) ; pour réappliquer,
--   UPDATE public.blog_editorial_strategy SET is_active = (version = 9) WHERE version IN (8, 9);
