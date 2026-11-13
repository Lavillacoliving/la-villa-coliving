-- ============================================================================
-- Prix des chambres 7 et 8 de La Villa — SQL 5 : les 4 réponses à prix de knowledge_base (décision de Jérôme du 12/11/2026)
-- Pourquoi : knowledge_base répond aux prospects (bot) et sert de source au générateur d'articles. Sans cette mise à jour, le bot
--            annoncerait encore « 1 370 CHF » comme prix d'appel. Prix écrits EN CLAIR : la table est lue hors du site, aucun jeton n'y est résolu.
-- Quand    : dans le MÊME CRÉNEAU que la fusion de feat/prix-chambres-7-8 (sans effet sur les gardes du site).
-- Contenu  : 4 UPDATE par replace() dans UN SEUL bloc DO (transaction implicite) ; garde d'entrée = md5 des réponses lues le 13/11/2026 ;
--            garde de sortie = md5 attendus. Tout ou rien. updated_at = now() (la table n'a pas de déclencheur).
--            Valeurs calculées depuis la source unique de la branche (HOUSES_FROM, SHARED_BATH_TIERS). Aucune adresse dans ces réponses.
--   9e3465b9 · Comment La Villa se compare-t-il à la location à Genève ? — prix d'appel
--      FR : « à partir de 1 370 CHF » → « à partir de 1 290 CHF »
--      EN : « starting from 1,370 CHF » → « starting from 1,290 CHF »
--   bc9c8ce7 · Quel est le prix d'une chambre ? — les 4 chambres à salle d'eau partagée : deux paliers, par numéro de chambre
--      FR : « (La Villa avec salle d'eau partagée : 1 370 CHF / 1 470 €) » → « (La Villa avec salle d'eau partagée : 1 370 CHF / 1 470 € pour les chambres 3 et 4, 1 290 CHF / 1 380 € pour les chambres 7 et 8) »
--      EN : « (La Villa with shared bathroom: CHF 1,370 / €1,470) » → « (La Villa with shared bathroom: CHF 1,370 / €1,470 for rooms 3 and 4, CHF 1,290 / €1,380 for rooms 7 and 8) »
--   bca165a4 · Combien coûte la vie à La Villa ? — fourchette des tarifs : borne basse
--      FR : « Nos tarifs sont de 1 370 CHF (1 470 €) à » → « Nos tarifs sont de 1 290 CHF (1 380 €) à »
--      EN : « range from CHF 1,370 (€1,470) to » → « range from CHF 1,290 (€1,380) to »
--   c04f73b9 · Le coliving est-il cher ? — fourchette des tarifs (FR) et prix d'appel (EN)
--      FR : « vont de 1 370 CHF (1 470 €) à » → « vont de 1 290 CHF (1 380 €) à »
--      EN : « start from 1,370 CHF/month » → « start from 1,290 CHF/month »
-- Textes à valider par Jérôme. Écrit par un outil de la séance ; NON EXÉCUTÉ à la date du fichier.
-- ============================================================================
DO $seance$
BEGIN
  IF (SELECT count(*) FROM public.knowledge_base WHERE (id = '9e3465b9-4c1e-4f02-9fd6-8fe2fe00dd85'::uuid AND md5(answer) = '852a62f9911d76cf8430f0fae1a6b35b' AND md5(coalesce(answer_en, '')) = 'af191493d0a99216f709e0c853fdeb6a' AND active) OR (id = 'bc9c8ce7-bc0b-4234-bb67-739735fc6720'::uuid AND md5(answer) = 'c30d76bafc3f00e94d014e81de482785' AND md5(coalesce(answer_en, '')) = '57e06ed5f7f2e148affd917c1cf0f41a' AND active) OR (id = 'bca165a4-000f-4158-8dd7-d1460b5c53a9'::uuid AND md5(answer) = 'c907ecdb86e776e49ac10f25289193db' AND md5(coalesce(answer_en, '')) = '92a9553b3ed9e40fb13f669c9cd4033f' AND active) OR (id = 'c04f73b9-1aa5-4065-b247-1c8954bcc84b'::uuid AND md5(answer) = '42dbb9dcfcad324e9ca57568e4789508' AND md5(coalesce(answer_en, '')) = '8b73b577d35528e60b35a4f8d6e9c294' AND active)) <> 4
  THEN RAISE EXCEPTION 'prix-chambres-7-8 : les réponses du bot ont changé depuis le 13/11/2026, rien n''est appliqué (relire et régénérer le fichier)';
  END IF;

  -- 9e3465b9 · Comment La Villa se compare-t-il à la location à Genève ?
  UPDATE public.knowledge_base
  SET answer = replace(answer, ('à partir de 1' || chr(160) || '370 CHF'), ('à partir de 1' || chr(160) || '290 CHF')),
      answer_en = replace(answer_en, 'starting from 1,370 CHF', 'starting from 1,290 CHF'),
      updated_at = now()
  WHERE id = '9e3465b9-4c1e-4f02-9fd6-8fe2fe00dd85'::uuid;

  -- bc9c8ce7 · Quel est le prix d'une chambre ?
  UPDATE public.knowledge_base
  SET answer = replace(answer, '(La Villa avec salle d''eau partagée : 1 370 CHF / 1 470 €)', '(La Villa avec salle d''eau partagée : 1 370 CHF / 1 470 € pour les chambres 3 et 4, 1 290 CHF / 1 380 € pour les chambres 7 et 8)'),
      answer_en = replace(answer_en, '(La Villa with shared bathroom: CHF 1,370 / €1,470)', '(La Villa with shared bathroom: CHF 1,370 / €1,470 for rooms 3 and 4, CHF 1,290 / €1,380 for rooms 7 and 8)'),
      updated_at = now()
  WHERE id = 'bc9c8ce7-bc0b-4234-bb67-739735fc6720'::uuid;

  -- bca165a4 · Combien coûte la vie à La Villa ?
  UPDATE public.knowledge_base
  SET answer = replace(answer, 'Nos tarifs sont de 1 370 CHF (1 470 €) à', 'Nos tarifs sont de 1 290 CHF (1 380 €) à'),
      answer_en = replace(answer_en, 'range from CHF 1,370 (€1,470) to', 'range from CHF 1,290 (€1,380) to'),
      updated_at = now()
  WHERE id = 'bca165a4-000f-4158-8dd7-d1460b5c53a9'::uuid;

  -- c04f73b9 · Le coliving est-il cher ?
  UPDATE public.knowledge_base
  SET answer = replace(answer, 'vont de 1 370 CHF (1 470 €) à', 'vont de 1 290 CHF (1 380 €) à'),
      answer_en = replace(answer_en, 'start from 1,370 CHF/month', 'start from 1,290 CHF/month'),
      updated_at = now()
  WHERE id = 'c04f73b9-1aa5-4065-b247-1c8954bcc84b'::uuid;

  IF (SELECT count(*) FROM public.knowledge_base WHERE (id = '9e3465b9-4c1e-4f02-9fd6-8fe2fe00dd85'::uuid AND md5(answer) = 'f2ea5b26cc532983ccddbda0b6d3c566' AND md5(coalesce(answer_en, '')) = '03fe0e87be290ad3e4361bf6accbb8f5') OR (id = 'bc9c8ce7-bc0b-4234-bb67-739735fc6720'::uuid AND md5(answer) = '07d71090f9c7062da51c56c5dd61abad' AND md5(coalesce(answer_en, '')) = '1a3ccbd385123bdcd6a8f06679c0d1b5') OR (id = 'bca165a4-000f-4158-8dd7-d1460b5c53a9'::uuid AND md5(answer) = '22c18eda95792d5119edf7173edecaed' AND md5(coalesce(answer_en, '')) = '1cbec5fa62bb2b0f8fe6b4bb7e929ee2') OR (id = 'c04f73b9-1aa5-4065-b247-1c8954bcc84b'::uuid AND md5(answer) = '24f783a076228bb8b271ace40be94527' AND md5(coalesce(answer_en, '')) = 'b364be18173758b0b24450a9197d21af')) <> 4
  THEN RAISE EXCEPTION 'prix-chambres-7-8 : l''état obtenu pour les réponses du bot n''est pas l''état attendu, tout est annulé';
  END IF;
END
$seance$;
-- Vérification (lecture seule) — attendu : les md5 ci-dessous.
-- SELECT left(id::text, 8) AS id8, md5(answer) AS fr, md5(answer_en) AS en FROM public.knowledge_base WHERE left(id::text, 8) IN ('9e3465b9', 'bc9c8ce7', 'bca165a4', 'c04f73b9') ORDER BY 1;
--   9e3465b9 · f2ea5b26cc532983ccddbda0b6d3c566 · 03fe0e87be290ad3e4361bf6accbb8f5
--   bc9c8ce7 · 07d71090f9c7062da51c56c5dd61abad · 1a3ccbd385123bdcd6a8f06679c0d1b5
--   bca165a4 · 22c18eda95792d5119edf7173edecaed · 1cbec5fa62bb2b0f8fe6b4bb7e929ee2
--   c04f73b9 · 24f783a076228bb8b271ace40be94527 · b364be18173758b0b24450a9197d21af
-- Retour arrière : scripts/backups/prix-chambres-7-8-bot-2026-11-13.retour-arriere.sql (restaure texte et date des 4 réponses).
