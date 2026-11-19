-- ============================================================================
-- Prix des chambres 7 et 8 de La Villa - SQL 3 - fourchettes, chiffres derives, libelles : FORME D'EXECUTION EN SEANCE.
-- 64 substitutions sur 12 articles publies, regroupees en 12 UPDATE dans UN SEUL bloc DO (une instruction,
-- donc une transaction implicite). Memes ancres et memes textes que scripts/prix-chambres-7-8-sql3-bascule-2026-11-13.sql (listes de
-- scripts/prix-chambres-7-8.edits.mjs) ; textes en UTF-8 lisible, chaque espace insecable ecrite chr(160) pour que le fichier voyage sans risque.
-- Garde d'entree = md5 de l'etat attendu avant ; garde de sortie = md5 de scripts/backups/prix-chambres-7-8-2026-11-13.attendu-apres.json.
-- Tout ou rien : au moindre ecart, l'exception annule tout le bloc.
-- A executer dans le MEME CRENEAU que la fusion de feat/prix-chambres-7-8, apres le SQL 1 et juste avant la fusion.
-- Ecrit par un outil de la seance (hors depot) ; NON EXECUTE a la date du fichier.
-- ============================================================================
DO $seance$
DECLARE ecarts text;
BEGIN
  -- garde d'entree : les 12 articles sont publies et dans l'etat attendu avant ce SQL
  SELECT string_agg(e.slug, ', ' ORDER BY e.slug) INTO ecarts FROM (VALUES
    ('assurance-sante-frontalier-lamal-cmu-budget', 'e7f262ed2811d39d9e9c6826ffba1e2f', 'fbfc33a174d297a34fff75fb1c6fb3c5'),
    ('budget-colocation-geneve-guide-complet', 'c31ed259f60ac5205056b6238ab9d4c8', '9ea22e86d9cdd6afa01b915be33a0e64'),
    ('colocation-annemasse-ville-la-grand-ambilly', 'b2894b6458ef90099f987a9726ea47d0', 'a25b158196586800d46e8eff396a0dad'),
    ('cout-de-la-vie-suisse-france-frontalier-2026', '8dc53f0773ee7555e7f83263a001d5a4', '9c06252cdf4a4d23f5c9932feadaf592'),
    ('dossier-location-frontalier-suisse-france', 'a91414517ae8ccfbd38fac22e2899545', '848f68242e27af5259571bc8d0a47e3f'),
    ('fiscalite-frontalier-geneve-impots-2026', 'e90900b11661bb98b9210a4d21285820', '32c0951a6765365fc2a4c3f589562eae'),
    ('guide-ressources-frontalier-geneve', 'e429ed1caec4b6e9ce9945335c16017f', '47a1551d0adf6ab9137b31ac0b1ec6f5'),
    ('organisations-internationales-geneve-ou-habiter', '45ca18b88584d0ed06ecde70cb112cab', '51e97c16ce7ffa4159a723230339db8d'),
    ('ou-habiter-en-france-quand-on-travaille-a-geneve', '6e52ecfa4e9fc808e97db82908e82d94', 'cac318bb85f9ff5fe26d37a0a2b7f44c'),
    ('salaire-suisse-net-frontalier-2026', 'e9bd14b6195b739e7294f4e0ffa91b39', '907147b3455433c0a7a3132f4d25b4d9'),
    ('trouver-colocation-geneve-frontalier', '773f0c73a15d9720a23c9be16e2c94ff', '71e271481a0af753c2d838449fd63c7f'),
    ('trouver-logement-avant-d-arriver-geneve', '5b8bcd10d38332e821756e60bf83bc83', 'af6641e2c883667ffff8b1103ed7130b')
  ) AS e(slug, c0, c1) LEFT JOIN public.blog_posts b ON b.slug = e.slug
  WHERE b.slug IS NULL OR md5(coalesce(b.content_fr, '')) <> e.c0 OR md5(coalesce(b.content_en, '')) <> e.c1 OR b.is_published IS NOT TRUE;
  IF ecarts IS NOT NULL THEN RAISE EXCEPTION 'prix-chambres-7-8 : la base n''est pas dans l''etat attendu avant ce SQL, rien n''est applique - %', ecarts; END IF;

  -- 1 article(s) - content_fr : 2 - content_en : 2
  UPDATE public.blog_posts
  SET content_fr = replace(replace(content_fr, ('Le coliving, dès 1' || chr(160) || '370 CHF, représente environ 33 % de ton net'), 'Le coliving, dès {{PRIX_DES}}, représente environ 31 % de ton net'), ('Le coliving, dès 1' || chr(160) || '370 CHF, représente 23-27 % de ton net'), 'Le coliving, dès {{PRIX_DES}}, représente 22-25 % de ton net'),
      content_en = replace(replace(content_en, 'Coliving, from 1,370 CHF, represents about 33% of your net', 'Coliving, from {{PRIX_DES}}, represents about 31% of your net'), 'Coliving, from 1,370 CHF, represents 23-27% of your net', 'Coliving, from {{PRIX_DES}}, represents 22-25% of your net')
  WHERE slug IN ('assurance-sante-frontalier-lamal-cmu-budget');

  -- 1 article(s) - content_fr : 9 - content_en : 9
  UPDATE public.blog_posts
  SET content_fr = replace(replace(replace(replace(replace(replace(replace(replace(replace(content_fr, ('La Villa Coliving | — | — | 1' || chr(160) || '370 – 1' || chr(160) || '430 CHF |'), ('La Villa Coliving | — | — | 1' || chr(160) || '290 – 1' || chr(160) || '430 CHF |')), ('Chambre en coliving côté France : 1' || chr(160) || '370 à 1' || chr(160) || '430 CHF tout inclus chez La Villa Coliving'), ('Chambre en coliving côté France : 1' || chr(160) || '290 à 1' || chr(160) || '430 CHF tout inclus chez La Villa Coliving')), ('| 500 – 700 € | 1' || chr(160) || '370 – 1' || chr(160) || '430 CHF |'), ('| 500 – 700 € | 1' || chr(160) || '290 – 1' || chr(160) || '430 CHF |')), ('un loyer de 1' || chr(160) || '370 à 1' || chr(160) || '430 CHF correspond à un loyer contractuel de 1' || chr(160) || '470 à 1' || chr(160) || '530 €, libellé en euros'), ('un loyer de 1' || chr(160) || '290 à 1' || chr(160) || '430 CHF correspond à un loyer contractuel de {{PRIX_DES_EUR}} à {{PRIX_PRIVATIF_EUR}}, libellé en euros')), ('### 3. Coliving premium (1' || chr(160) || '370 CHF/mois tout compris)'), '### 3. Coliving premium (dès {{PRIX_DES}}/mois tout compris)'), ('- **Coliving tout inclus (1' || chr(160) || '370 CHF/mois)**'), '- **Coliving tout inclus (dès {{PRIX_DES}}/mois)**'), ('| 500-700 € | 1' || chr(160) || '370 CHF |'), '| 500-700 € | dès {{PRIX_DES}} |'), ('| **650-950 €** | **1' || chr(160) || '370 CHF** |'), '| **650-950 €** | **dès {{PRIX_DES}}** |'), ('le coliving à 1' || chr(160) || '370 CHF représente exactement 30% — c''est serré mais tenable, surtout quand on considère qu''il n''y a aucune charge en plus. À 6 000 CHF, c''est 23% — très confortable. À 8 000 CHF, c''est 17% —'), 'le coliving dès {{PRIX_DES}} représente 29% — c''est serré mais tenable, surtout quand on considère qu''il n''y a aucune charge en plus. À 6 000 CHF, c''est 22% — très confortable. À 8 000 CHF, c''est 16% —'),
      content_en = replace(replace(replace(replace(replace(replace(replace(replace(replace(content_en, 'La Villa Coliving | — | — | 1,370 – 1,430 CHF |', 'La Villa Coliving | — | — | 1,290 – 1,430 CHF |'), 'Coliving room on the French side: CHF 1,370 to 1,430 all inclusive at La Villa Coliving', 'Coliving room on the French side: CHF 1,290 to 1,430 all inclusive at La Villa Coliving'), '| 500–700 € | 1,370 – 1,430 CHF |', '| 500–700 € | 1,290 – 1,430 CHF |'), 'a CHF 1,370 to 1,430 rent corresponds to a contractual rent of €1,470 to €1,530, set in euros', 'a CHF 1,290 to 1,430 rent corresponds to a contractual rent of {{PRIX_DES_EUR}} to {{PRIX_PRIVATIF_EUR}}, set in euros'), '### 3. Premium coliving (1,370 CHF/month all-inclusive)', '### 3. Premium coliving (from {{PRIX_DES}}/month all-inclusive)'), '- **All-inclusive coliving (CHF 1,370/month)**', '- **All-inclusive coliving (from {{PRIX_DES}}/month)**'), '| 500-700 € | 1,370 CHF |', '| 500-700 € | from {{PRIX_DES}} |'), '| **650-950 €** | **1,370 CHF** |', '| **650-950 €** | **from {{PRIX_DES}}** |'), 'coliving at 1,370 CHF represents just 23% — very comfortable.', 'coliving from {{PRIX_DES}} represents just 22% — very comfortable.')
  WHERE slug IN ('budget-colocation-geneve-guide-complet');

  -- 1 article(s) - content_fr : 1 - content_en : 1
  UPDATE public.blog_posts
  SET content_fr = replace(content_fr, ('| Coliving premium tout compris | 1' || chr(160) || '370 – 1' || chr(160) || '430 CHF/mois |'), ('| Coliving premium tout compris | 1' || chr(160) || '290 – 1' || chr(160) || '430 CHF/mois |')),
      content_en = replace(content_en, '| All-inclusive premium coliving | 1,370 – 1,430 CHF/month |', '| All-inclusive premium coliving | 1,290 – 1,430 CHF/month |')
  WHERE slug IN ('colocation-annemasse-ville-la-grand-ambilly');

  -- 1 article(s) - content_fr : 7 - content_en : 7
  UPDATE public.blog_posts
  SET content_fr = replace(replace(replace(replace(replace(replace(replace(content_fr, ('ex. La Villa Coliving : 1' || chr(160) || '370 à 1' || chr(160) || '430 CHF tout inclus, 0 € de frais de dossier'), ('ex. La Villa Coliving : 1' || chr(160) || '290 à 1' || chr(160) || '430 CHF tout inclus, 0 € de frais de dossier')), 'et il lui reste 2 100 à 2 800 CHF une fois les dépenses courantes payées', 'et il lui reste 2 100 à 2 850 CHF une fois les dépenses courantes payées'), 'côté France, 1 370 à 1 430 CHF par mois charges, fibre et ménage compris. Total : 2 510 à 3 180 CHF de dépenses par mois.', ('côté France, 1' || chr(160) || '290 à 1' || chr(160) || '430 CHF par mois charges, fibre et ménage compris. Total : 2 430 à 3 180 CHF de dépenses par mois.')), '| ~4 400 CHF | 31 à 33 % | 1 200 à 1 900 CHF |', '| ~4 400 CHF | 29 à 33 % | 1 200 à 1 950 CHF |'), '| ~5 300 CHF | 26 à 27 % | 2 100 à 2 800 CHF |', '| ~5 300 CHF | 24 à 27 % | 2 100 à 2 850 CHF |'), '| ~5 950 CHF | 23 à 24 % | 2 750 à 3 450 CHF |', '| ~5 950 CHF | 22 à 24 % | 2 750 à 3 500 CHF |'), 'tu passes sous ce seuil à partir de 4 600 à 4 800 CHF net par mois', 'tu passes sous ce seuil à partir de 4 300 à 4 800 CHF net par mois'),
      content_en = replace(replace(replace(replace(replace(replace(replace(content_en, 'e.g. La Villa Coliving: CHF 1,370 to 1,430 all inclusive, no application fee', 'e.g. La Villa Coliving: CHF 1,290 to 1,430 all inclusive, no application fee'), 'and CHF 2,100 to 2,800 is left once everyday costs are paid', 'and CHF 2,100 to 2,850 is left once everyday costs are paid'), 'on the French side, CHF 1,370 to 1,430 a month with bills, fibre and cleaning included. That''s CHF 2,510 to 3,180 of spending a month.', 'on the French side, CHF 1,290 to 1,430 a month with bills, fibre and cleaning included. That''s CHF 2,430 to 3,180 of spending a month.'), '| ~CHF 4,400 | 31 to 33% | CHF 1,200 to 1,900 |', '| ~CHF 4,400 | 29 to 33% | CHF 1,200 to 1,950 |'), '| ~CHF 5,300 | 26 to 27% | CHF 2,100 to 2,800 |', '| ~CHF 5,300 | 24 to 27% | CHF 2,100 to 2,850 |'), '| ~CHF 5,950 | 23 to 24% | CHF 2,750 to 3,450 |', '| ~CHF 5,950 | 22 to 24% | CHF 2,750 to 3,500 |'), 'you drop below it from CHF 4,600 to 4,800 net a month', 'you drop below it from CHF 4,300 to 4,800 net a month')
  WHERE slug IN ('cout-de-la-vie-suisse-france-frontalier-2026');

  -- 1 article(s) - content_fr : 1 - content_en : 1
  UPDATE public.blog_posts
  SET content_fr = replace(content_fr, ('Ambilly et Annemasse, 1' || chr(160) || '370 à 1' || chr(160) || '430 CHF par mois tout inclus), le dossier'), ('Ambilly et Annemasse, 1' || chr(160) || '290 à 1' || chr(160) || '430 CHF par mois tout inclus), le dossier')),
      content_en = replace(content_en, 'Ambilly and Annemasse, CHF 1,370 to 1,430 a month all inclusive), the file', 'Ambilly and Annemasse, CHF 1,290 to 1,430 a month all inclusive), the file')
  WHERE slug IN ('dossier-location-frontalier-suisse-france');

  -- 1 article(s) - content_fr : 5 - content_en : 5
  UPDATE public.blog_posts
  SET content_fr = replace(replace(replace(replace(replace(content_fr, ('(chez La Villa Coliving, 1' || chr(160) || '370 à 1' || chr(160) || '430 CHF par mois pour une chambre'), ('(chez La Villa Coliving, 1' || chr(160) || '290 à 1' || chr(160) || '430 CHF par mois pour une chambre')), ('Avec une chambre en coliving dès 1' || chr(160) || '370 CHF, il te reste environ 2 700-2 960 CHF'), 'Avec une chambre en coliving dès {{PRIX_DES}}, il te reste environ 2 780-3 050 CHF'), ('Le coliving, dès 1' || chr(160) || '370 CHF, représente 24-26 % du net. Il reste 3 950-4 320 CHF'), 'Le coliving, dès {{PRIX_DES}}, représente 23-24 % du net. Il reste 4 035-4 410 CHF'), ('Le coliving, dès 1' || chr(160) || '370 CHF, ne représente que 18-19 % du net'), 'Le coliving, dès {{PRIX_DES}}, ne représente que 17-18 % du net'), 'Ce loyer représente 20 à 27 % de ce net', 'Ce loyer représente 18 à 27 % de ce net'),
      content_en = replace(replace(replace(replace(replace(content_en, '(at La Villa Coliving, CHF 1,370 to 1,430 a month for a room', '(at La Villa Coliving, CHF 1,290 to 1,430 a month for a room'), 'With a coliving room from 1,370 CHF, you have about 2,700-2,960 CHF left', 'With a coliving room from {{PRIX_DES}}, you have about 2,780-3,050 CHF left'), 'Coliving, from 1,370 CHF, represents 24-26% of net. That leaves 3,950-4,320 CHF', 'Coliving, from {{PRIX_DES}}, represents 23-24% of net. That leaves 4,035-4,410 CHF'), 'Coliving, from 1,370 CHF, represents only 18-19% of net', 'Coliving, from {{PRIX_DES}}, represents only 17-18% of net'), 'This rent represents 20 to 27% of this net', 'This rent represents 18 to 27% of this net')
  WHERE slug IN ('fiscalite-frontalier-geneve-impots-2026');

  -- 1 article(s) - content_fr : 1 - content_en : 1
  UPDATE public.blog_posts
  SET content_fr = replace(content_fr, ('— se situe autour de 1' || chr(160) || '370 CHF/mois.)*'), ('— coûte de 1' || chr(160) || '290 à 1' || chr(160) || '430 CHF par mois.)*')),
      content_en = replace(content_en, '— sits around 1,370 CHF/month.)*', '— costs CHF 1,290 to 1,430 a month.)*')
  WHERE slug IN ('guide-ressources-frontalier-geneve');

  -- 1 article(s) - content_fr : 2 - content_en : 2
  UPDATE public.blog_posts
  SET content_fr = replace(replace(content_fr, ('(La Villa Coliving) | 1' || chr(160) || '370 – 1' || chr(160) || '430 CHF, tout inclus |'), ('(La Villa Coliving) | 1' || chr(160) || '290 – 1' || chr(160) || '430 CHF, tout inclus |')), 'Le surcoût d''environ 500 à 800 CHF par mois', 'Le surcoût d''environ 400 à 800 CHF par mois'),
      content_en = replace(replace(content_en, '(La Villa Coliving) | 1,370 – 1,430 CHF, all inclusive |', '(La Villa Coliving) | 1,290 – 1,430 CHF, all inclusive |'), 'The premium of roughly CHF 500 to 800 a month', 'The premium of roughly CHF 400 to 800 a month')
  WHERE slug IN ('organisations-internationales-geneve-ou-habiter');

  -- 1 article(s) - content_fr : 1 - content_en : 1
  UPDATE public.blog_posts
  SET content_fr = replace(content_fr, ('pour une personne à 1' || chr(160) || '370 à 1' || chr(160) || '430 CHF par mois tout inclus'), ('pour une personne de 1' || chr(160) || '290 à 1' || chr(160) || '430 CHF par mois tout inclus')),
      content_en = replace(content_en, 'furnished single rooms at CHF 1,370 to 1,430 a month, all inclusive', 'furnished single rooms at CHF 1,290 to 1,430 a month, all inclusive')
  WHERE slug IN ('ou-habiter-en-france-quand-on-travaille-a-geneve');

  -- 1 article(s) - content_fr : 1 - content_en : 1
  UPDATE public.blog_posts
  SET content_fr = replace(content_fr, ('coliving tout inclus (1' || chr(160) || '370 à 1' || chr(160) || '430 CHF par mois)'), ('coliving tout inclus (1' || chr(160) || '290 à 1' || chr(160) || '430 CHF par mois)')),
      content_en = replace(content_en, 'all-inclusive coliving (CHF 1,370 to 1,430 a month)', 'all-inclusive coliving (CHF 1,290 to 1,430 a month)')
  WHERE slug IN ('salaire-suisse-net-frontalier-2026');

  -- 1 article(s) - content_fr : 1 - content_en : 1
  UPDATE public.blog_posts
  SET content_fr = replace(content_fr, ('ou autour de 1' || chr(160) || '370 CHF tout inclus en coliving premium'), ('ou de 1' || chr(160) || '290 à 1' || chr(160) || '430 CHF tout inclus en coliving premium')),
      content_en = replace(content_en, 'or around 1,370 CHF all-inclusive in premium coliving', 'or CHF 1,290 to 1,430 all-inclusive in premium coliving')
  WHERE slug IN ('trouver-colocation-geneve-frontalier');

  -- 1 article(s) - content_fr : 1 - content_en : 1
  UPDATE public.blog_posts
  SET content_fr = replace(content_fr, ('porte-à-porte, pour 1' || chr(160) || '370 à 1' || chr(160) || '430 CHF par mois tout inclus'), ('porte-à-porte, pour 1' || chr(160) || '290 à 1' || chr(160) || '430 CHF par mois tout inclus')),
      content_en = replace(content_en, 'door to door, for CHF 1,370 to 1,430 a month all inclusive', 'door to door, for CHF 1,290 to 1,430 a month all inclusive')
  WHERE slug IN ('trouver-logement-avant-d-arriver-geneve');

  -- garde de sortie : les articles sont dans l'etat attendu, sinon tout est annule
  SELECT string_agg(e.slug, ', ' ORDER BY e.slug) INTO ecarts FROM (VALUES
    ('assurance-sante-frontalier-lamal-cmu-budget', '1a4b3fe8451a9e722ac75060d0151544', '09e8e5060862b513b248866d6bc6b298'),
    ('budget-colocation-geneve-guide-complet', '28a6c1a686605bc6552aac98632a4ffa', '8bd65f1d95ea0568f9762ef7510e60ca'),
    ('colocation-annemasse-ville-la-grand-ambilly', 'e3ce76481fd540797c13a5b378487043', '55adb58529711053bc2563fb98006ec7'),
    ('cout-de-la-vie-suisse-france-frontalier-2026', '0b93529f83b082fa84439998edd9f921', '534da8a8a2547ebe27c36c4d3a031518'),
    ('dossier-location-frontalier-suisse-france', 'f147b8aca3beb03047f85d5ab9088d06', '5d8bd3803389fbc96b3b6e9d96d6022e'),
    ('fiscalite-frontalier-geneve-impots-2026', '1336874d38afd114a2baf48ff0751768', 'a7d4fb8be31f004f499995c2380c9cec'),
    ('guide-ressources-frontalier-geneve', 'f25f8fb40f376358cb816759a31f338b', 'd02c624f42363d0a5b00e228374e1d6a'),
    ('organisations-internationales-geneve-ou-habiter', '2e19ccf7568ba9b69559efcdd47708f9', '7d18ca6b6b35a1c17d22b321b76ceba3'),
    ('ou-habiter-en-france-quand-on-travaille-a-geneve', 'e40a8416887c089c81fe6a24a8da4b45', 'fda4cb660eeb3cbee73db442c499f876'),
    ('salaire-suisse-net-frontalier-2026', '8e2e496dcec584cb96eeff60ef835537', '3b21d2581b4eb9ba6258e251a56668dd'),
    ('trouver-colocation-geneve-frontalier', '09c7833eb7ad14ef5888d9c00a7c909a', '60cb9d017f042782e9e862b2ca008206'),
    ('trouver-logement-avant-d-arriver-geneve', 'b35ff36de2a870581cd8d01bd9f61c79', '89fb7a5326d1f46c38990419ed02fdde')
  ) AS e(slug, c0, c1) LEFT JOIN public.blog_posts b ON b.slug = e.slug
  WHERE b.slug IS NULL OR md5(coalesce(b.content_fr, '')) <> e.c0 OR md5(coalesce(b.content_en, '')) <> e.c1;
  IF ecarts IS NOT NULL THEN RAISE EXCEPTION 'prix-chambres-7-8 : l''etat obtenu n''est pas l''etat attendu, tout est annule - %', ecarts; END IF;
END
$seance$;
