-- ============================================================================
-- Prix des chambres 7 et 8 de La Villa - SQL 3 bis - fourchettes en jetons : FORME D'EXECUTION EN SEANCE.
-- 30 substitutions sur 11 articles publies, regroupees en 11 UPDATE dans UN SEUL bloc DO (une instruction,
-- donc une transaction implicite). Memes ancres et memes textes que scripts/prix-chambres-7-8-sql3bis-fourchettes-2026-11-13.sql (listes de
-- scripts/prix-chambres-7-8.edits.mjs) ; textes en UTF-8 lisible, chaque espace insecable ecrite chr(160) pour que le fichier voyage sans risque.
-- Garde d'entree = md5 de l'etat attendu avant ; garde de sortie = md5 de scripts/backups/prix-chambres-7-8-2026-11-13.attendu-apres.json.
-- Tout ou rien : au moindre ecart, l'exception annule tout le bloc.
-- A executer APRES la mise en ligne du code (le site doit connaitre les jetons de fourchette). Aucun changement visible.
-- Ecrit par un outil de la seance (hors depot) ; NON EXECUTE a la date du fichier.
-- ============================================================================
DO $seance$
DECLARE ecarts text;
BEGIN
  -- garde d'entree : les 11 articles sont publies et dans l'etat attendu avant ce SQL
  SELECT string_agg(e.slug, ', ' ORDER BY e.slug) INTO ecarts FROM (VALUES
    ('budget-colocation-geneve-guide-complet', '28a6c1a686605bc6552aac98632a4ffa', '8bd65f1d95ea0568f9762ef7510e60ca'),
    ('colocation-annemasse-ville-la-grand-ambilly', 'e3ce76481fd540797c13a5b378487043', '55adb58529711053bc2563fb98006ec7'),
    ('cout-de-la-vie-suisse-france-frontalier-2026', '0b93529f83b082fa84439998edd9f921', '534da8a8a2547ebe27c36c4d3a031518'),
    ('dossier-location-frontalier-suisse-france', 'f147b8aca3beb03047f85d5ab9088d06', '5d8bd3803389fbc96b3b6e9d96d6022e'),
    ('fiscalite-frontalier-geneve-impots-2026', '1336874d38afd114a2baf48ff0751768', 'a7d4fb8be31f004f499995c2380c9cec'),
    ('guide-ressources-frontalier-geneve', 'f25f8fb40f376358cb816759a31f338b', 'd02c624f42363d0a5b00e228374e1d6a'),
    ('organisations-internationales-geneve-ou-habiter', '2e19ccf7568ba9b69559efcdd47708f9', '7d18ca6b6b35a1c17d22b321b76ceba3'),
    ('ou-habiter-en-france-quand-on-travaille-a-geneve', 'c71270a8aa651923e88314960024af7f', 'fda4cb660eeb3cbee73db442c499f876'),
    ('salaire-suisse-net-frontalier-2026', '8e2e496dcec584cb96eeff60ef835537', '3b21d2581b4eb9ba6258e251a56668dd'),
    ('trouver-colocation-geneve-frontalier', '09c7833eb7ad14ef5888d9c00a7c909a', '60cb9d017f042782e9e862b2ca008206'),
    ('trouver-logement-avant-d-arriver-geneve', 'b35ff36de2a870581cd8d01bd9f61c79', '89fb7a5326d1f46c38990419ed02fdde')
  ) AS e(slug, c0, c1) LEFT JOIN public.blog_posts b ON b.slug = e.slug
  WHERE b.slug IS NULL OR md5(coalesce(b.content_fr, '')) <> e.c0 OR md5(coalesce(b.content_en, '')) <> e.c1 OR b.is_published IS NOT TRUE;
  IF ecarts IS NOT NULL THEN RAISE EXCEPTION 'prix-chambres-7-8 : la base n''est pas dans l''etat attendu avant ce SQL, rien n''est applique - %', ecarts; END IF;

  -- 1 article(s) - content_fr : 4 - content_en : 4
  UPDATE public.blog_posts
  SET content_fr = replace(replace(replace(replace(content_fr, ('La Villa Coliving | — | — | 1' || chr(160) || '290 – 1' || chr(160) || '430 CHF |'), 'La Villa Coliving | — | — | {{PRIX_FOURCHETTE_TABLEAU}} |'), ('Chambre en coliving côté France : 1' || chr(160) || '290 à 1' || chr(160) || '430 CHF tout inclus chez La Villa Coliving'), 'Chambre en coliving côté France : {{PRIX_FOURCHETTE}} tout inclus chez La Villa Coliving'), ('| 500 – 700 € | 1' || chr(160) || '290 – 1' || chr(160) || '430 CHF |'), '| 500 – 700 € | {{PRIX_FOURCHETTE_TABLEAU}} |'), ('un loyer de 1' || chr(160) || '290 à 1' || chr(160) || '430 CHF correspond à un loyer contractuel de {{PRIX_DES_EUR}} à {{PRIX_PRIVATIF_EUR}}, libellé en euros'), 'un loyer de {{PRIX_FOURCHETTE}} correspond à un loyer contractuel de {{PRIX_DES_EUR}} à {{PRIX_PRIVATIF_EUR}}, libellé en euros'),
      content_en = replace(replace(replace(replace(content_en, 'La Villa Coliving | — | — | 1,290 – 1,430 CHF |', 'La Villa Coliving | — | — | {{PRIX_FOURCHETTE_TABLEAU}} |'), 'Coliving room on the French side: CHF 1,290 to 1,430 all inclusive at La Villa Coliving', 'Coliving room on the French side: {{PRIX_FOURCHETTE}} all inclusive at La Villa Coliving'), '| 500–700 € | 1,290 – 1,430 CHF |', '| 500–700 € | {{PRIX_FOURCHETTE_TABLEAU}} |'), 'a CHF 1,290 to 1,430 rent corresponds to a contractual rent of {{PRIX_DES_EUR}} to {{PRIX_PRIVATIF_EUR}}, set in euros', 'a {{PRIX_FOURCHETTE}} rent corresponds to a contractual rent of {{PRIX_DES_EUR}} to {{PRIX_PRIVATIF_EUR}}, set in euros')
  WHERE slug IN ('budget-colocation-geneve-guide-complet');

  -- 1 article(s) - content_fr : 1 - content_en : 1
  UPDATE public.blog_posts
  SET content_fr = replace(content_fr, ('| Coliving premium tout compris | 1' || chr(160) || '290 – 1' || chr(160) || '430 CHF/mois |'), '| Coliving premium tout compris | {{PRIX_FOURCHETTE_TABLEAU}}/mois |'),
      content_en = replace(content_en, '| All-inclusive premium coliving | 1,290 – 1,430 CHF/month |', '| All-inclusive premium coliving | {{PRIX_FOURCHETTE_TABLEAU}}/month |')
  WHERE slug IN ('colocation-annemasse-ville-la-grand-ambilly');

  -- 1 article(s) - content_fr : 2 - content_en : 2
  UPDATE public.blog_posts
  SET content_fr = replace(replace(content_fr, ('ex. La Villa Coliving : 1' || chr(160) || '290 à 1' || chr(160) || '430 CHF tout inclus, 0 € de frais de dossier'), 'ex. La Villa Coliving : {{PRIX_FOURCHETTE}} tout inclus, 0 € de frais de dossier'), ('côté France, 1' || chr(160) || '290 à 1' || chr(160) || '430 CHF par mois charges, fibre et ménage compris. Total : 2 430 à 3 180 CHF de dépenses par mois.'), 'côté France, {{PRIX_FOURCHETTE}} par mois charges, fibre et ménage compris. Total : 2 430 à 3 180 CHF de dépenses par mois.'),
      content_en = replace(replace(content_en, 'e.g. La Villa Coliving: CHF 1,290 to 1,430 all inclusive, no application fee', 'e.g. La Villa Coliving: {{PRIX_FOURCHETTE}} all inclusive, no application fee'), 'on the French side, CHF 1,290 to 1,430 a month with bills, fibre and cleaning included. That''s CHF 2,430 to 3,180 of spending a month.', 'on the French side, {{PRIX_FOURCHETTE}} a month with bills, fibre and cleaning included. That''s CHF 2,430 to 3,180 of spending a month.')
  WHERE slug IN ('cout-de-la-vie-suisse-france-frontalier-2026');

  -- 1 article(s) - content_fr : 1 - content_en : 1
  UPDATE public.blog_posts
  SET content_fr = replace(content_fr, ('Ambilly et Annemasse, 1' || chr(160) || '290 à 1' || chr(160) || '430 CHF par mois tout inclus), le dossier'), 'Ambilly et Annemasse, {{PRIX_FOURCHETTE}} par mois tout inclus), le dossier'),
      content_en = replace(content_en, 'Ambilly and Annemasse, CHF 1,290 to 1,430 a month all inclusive), the file', 'Ambilly and Annemasse, {{PRIX_FOURCHETTE}} a month all inclusive), the file')
  WHERE slug IN ('dossier-location-frontalier-suisse-france');

  -- 1 article(s) - content_fr : 1 - content_en : 1
  UPDATE public.blog_posts
  SET content_fr = replace(content_fr, ('(chez La Villa Coliving, 1' || chr(160) || '290 à 1' || chr(160) || '430 CHF par mois pour une chambre'), '(chez La Villa Coliving, {{PRIX_FOURCHETTE}} par mois pour une chambre'),
      content_en = replace(content_en, '(at La Villa Coliving, CHF 1,290 to 1,430 a month for a room', '(at La Villa Coliving, {{PRIX_FOURCHETTE}} a month for a room')
  WHERE slug IN ('fiscalite-frontalier-geneve-impots-2026');

  -- 1 article(s) - content_fr : 1 - content_en : 1
  UPDATE public.blog_posts
  SET content_fr = replace(content_fr, ('— coûte de 1' || chr(160) || '290 à 1' || chr(160) || '430 CHF par mois.)*'), '— coûte de {{PRIX_FOURCHETTE}} par mois.)*'),
      content_en = replace(content_en, '— costs CHF 1,290 to 1,430 a month.)*', '— costs {{PRIX_FOURCHETTE}} a month.)*')
  WHERE slug IN ('guide-ressources-frontalier-geneve');

  -- 1 article(s) - content_fr : 1 - content_en : 1
  UPDATE public.blog_posts
  SET content_fr = replace(content_fr, ('(La Villa Coliving) | 1' || chr(160) || '290 – 1' || chr(160) || '430 CHF, tout inclus |'), '(La Villa Coliving) | {{PRIX_FOURCHETTE_TABLEAU}}, tout inclus |'),
      content_en = replace(content_en, '(La Villa Coliving) | 1,290 – 1,430 CHF, all inclusive |', '(La Villa Coliving) | {{PRIX_FOURCHETTE_TABLEAU}}, all inclusive |')
  WHERE slug IN ('organisations-internationales-geneve-ou-habiter');

  -- 1 article(s) - content_fr : 1 - content_en : 1
  UPDATE public.blog_posts
  SET content_fr = replace(content_fr, ('pour une personne à 1' || chr(160) || '290 à 1' || chr(160) || '430 CHF par mois tout inclus'), 'pour une personne à {{PRIX_FOURCHETTE}} par mois tout inclus'),
      content_en = replace(content_en, 'furnished single rooms at CHF 1,290 to 1,430 a month, all inclusive', 'furnished single rooms at {{PRIX_FOURCHETTE}} a month, all inclusive')
  WHERE slug IN ('ou-habiter-en-france-quand-on-travaille-a-geneve');

  -- 1 article(s) - content_fr : 1 - content_en : 1
  UPDATE public.blog_posts
  SET content_fr = replace(content_fr, ('coliving tout inclus (1' || chr(160) || '290 à 1' || chr(160) || '430 CHF par mois)'), 'coliving tout inclus ({{PRIX_FOURCHETTE}} par mois)'),
      content_en = replace(content_en, 'all-inclusive coliving (CHF 1,290 to 1,430 a month)', 'all-inclusive coliving ({{PRIX_FOURCHETTE}} a month)')
  WHERE slug IN ('salaire-suisse-net-frontalier-2026');

  -- 1 article(s) - content_fr : 1 - content_en : 1
  UPDATE public.blog_posts
  SET content_fr = replace(content_fr, ('ou de 1' || chr(160) || '290 à 1' || chr(160) || '430 CHF tout inclus en coliving premium'), 'ou de {{PRIX_FOURCHETTE}} tout inclus en coliving premium'),
      content_en = replace(content_en, 'or CHF 1,290 to 1,430 all-inclusive in premium coliving', 'or {{PRIX_FOURCHETTE}} all-inclusive in premium coliving')
  WHERE slug IN ('trouver-colocation-geneve-frontalier');

  -- 1 article(s) - content_fr : 1 - content_en : 1
  UPDATE public.blog_posts
  SET content_fr = replace(content_fr, ('porte-à-porte, pour 1' || chr(160) || '290 à 1' || chr(160) || '430 CHF par mois tout inclus'), 'porte-à-porte, pour {{PRIX_FOURCHETTE}} par mois tout inclus'),
      content_en = replace(content_en, 'door to door, for CHF 1,290 to 1,430 a month all inclusive', 'door to door, for {{PRIX_FOURCHETTE}} a month all inclusive')
  WHERE slug IN ('trouver-logement-avant-d-arriver-geneve');

  -- garde de sortie : les articles sont dans l'etat attendu, sinon tout est annule
  SELECT string_agg(e.slug, ', ' ORDER BY e.slug) INTO ecarts FROM (VALUES
    ('budget-colocation-geneve-guide-complet', 'e77fdcc13fc98aaf8bbd28413b8fbea6', '5177fade977371178ebb568cab3c487d'),
    ('colocation-annemasse-ville-la-grand-ambilly', '02fcffdee5786dce4764a0e06d3d7dc1', '6e21462cbefb4187f2ac9824367a9892'),
    ('cout-de-la-vie-suisse-france-frontalier-2026', '780f07cf7d7c00a3e2c736cd0047acc3', '9c28b27de2aedf9541ee403e769898eb'),
    ('dossier-location-frontalier-suisse-france', '1c9fd08b65a02f7e4f870fabb8e98c50', '6a162d434367e2ff3500ab821a87ea6a'),
    ('fiscalite-frontalier-geneve-impots-2026', '66e071d1a76a875e1cfd14f2f15f2d48', '97d11ac02770348b1e15e0332667b1c6'),
    ('guide-ressources-frontalier-geneve', 'e0374d23d1d65f565a3d64ecee0efc0f', '1f99bba7865030ecaca3e2132406c5b1'),
    ('organisations-internationales-geneve-ou-habiter', 'aa8c3e47ba6f02e6b75c63acc3bfc403', '0153c8d996c3fcc27f099f0fd17d62f5'),
    ('ou-habiter-en-france-quand-on-travaille-a-geneve', 'fa39c5377ca02f7d6e5102e84e1e9b9e', '5ecaa0538e65e5c345296feed6a53c41'),
    ('salaire-suisse-net-frontalier-2026', '22750bc4eaea6e2353f8a3a5b4108d37', '6b7199efcade88f6f1ee47d1b54ff59f'),
    ('trouver-colocation-geneve-frontalier', 'b3a74ad0ed4b5c3dec6059a92a1f2ea9', '3a163b6681d7bbcb3dc55b9328203d28'),
    ('trouver-logement-avant-d-arriver-geneve', '776c47ed3dd36ffebd406b5e6bae0b70', '16e04c72f98037ba987174508fd3de2e')
  ) AS e(slug, c0, c1) LEFT JOIN public.blog_posts b ON b.slug = e.slug
  WHERE b.slug IS NULL OR md5(coalesce(b.content_fr, '')) <> e.c0 OR md5(coalesce(b.content_en, '')) <> e.c1;
  IF ecarts IS NOT NULL THEN RAISE EXCEPTION 'prix-chambres-7-8 : l''etat obtenu n''est pas l''etat attendu, tout est annule - %', ecarts; END IF;
END
$seance$;
