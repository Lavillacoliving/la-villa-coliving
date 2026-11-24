-- ============================================================================
-- SEANCE "visite-bot" (2026-11-24) : lot 3 du plan "Programmer une visite" hors du site (par. 3) -- 5 fiches de la base du bot
-- (table knowledge_base, bot WhatsApp des residents), alignees sur la FAQ du site, au tutoiement. Decision de Jerome du 24/11/2026 :
-- les 5 fiches du plan, textes du plan ; les 9 autres fiches qui disent "candidat / postul / apply" et bot_knowledge ne bougent pas.
-- Un seul appel, 100 % ASCII (litteraux Unicode echappes, forme U&), une transaction (BEGIN, un bloc DO, COMMIT), puis une verification en lecture seule.
-- Gardes : chaque fiche existe une fois et sa ligne ENTIERE a l'empreinte md5(row_to_json) relevee le 24/11/2026 (= releves du plan) ;
-- chaque UPDATE ne pose que les colonnes listees (+ updated_at ; la table n'a pas de declencheur) et touche exactement 1 ligne ;
-- en sortie, le md5 de chaque champ modifie = celui du texte du plan, et la fiche reste active. Au moindre ecart : tout est annule.
-- Sauvegarde : scripts/backups/visite-bot-2026-11-24.avant.json ; retour arriere : scripts/backups/visite-bot-2026-11-24.retour-arriere.sql.
-- (24/11/2026) Phrase "Des visites virtuelles sont egalement disponibles sur notre site web" RETIREE de visit-before-applying (FR et EN) :
-- aucune visite virtuelle sur le site ; la FAQ du site est corrigee dans la meme PR.
-- Ecrit par un outil de la seance (hors depot) depuis les 5 lignes relues par SELECT ; NON EXECUTE a la date du fichier.
-- NE PAS EXECUTER SANS LE GO EXPLICITE DE JEROME ("GO bot").
--   how-to-apply (d982fcfa) : question, answer, question_en, answer_en ; ligne avant md5 4cd6a19e8aff0e49f9a901045f15265b
--     question -> "Comment programmer une visite pour vivre a La Villa ?"
--     answer -> "C'est simple : 1) Remplis le formulaire "Programmer une visite" avec tes coordonnees (2 minutes), ou ecris-nous, 2) On t'appelle sous 48 h pour faire connais..."
--     question_en -> "How do I book a visit to live at La Villa?"
--     answer_en -> "It's simple: 1) Fill in the "Book a visit" form with your details (2 minutes), or message us, 2) We call you within 48 h to get to know each other and set th..."
--   visit-before-applying (e02e0dd7) : question, answer, question_en, answer_en ; ligne avant md5 d7212dde5a20b756532ed9f55e205e92
--     question -> "Puis-je visiter avant de m'engager ?"
--     answer -> "Oui, c'est meme la premiere etape : tu programmes une visite, sur place ou en video, et on t'appelle sous 48 h pour la caler. On fait ainsi connaissance avan..."
--     question_en -> "Can I visit before committing?"
--     answer_en -> "Yes, it's even the first step: you book a visit, on site or by video, and we call you within 48 h to set it. That way we get to know each other before anyone..."
--   application-timeline (dc45d539) : question, answer, question_en, answer_en ; ligne avant md5 cf451cd4a99e847e69774f8671f87b65
--     question -> "Combien de temps entre la demande de visite et l'emmenagement ?"
--     answer -> "Si une chambre est disponible, tu peux emmenager en 72 h des ton premier contact. Ce delai inclut l'appel, la visite de la maison (sur place ou en visio), l'..."
--     question_en -> "How long from the visit request to move-in?"
--     answer_en -> "If a room is available, you can move in within 72 h of your first contact. That includes the call, the house visit (on site or by video), the review of your ..."
--   application-requirements (9b4f4fd4) : question, question_en ; ligne avant md5 49726659026a6bbc2a4f20a54fcd0cd4
--     question -> "Quelles sont les conditions pour vivre a La Villa ?"
--     question_en -> "What are the requirements to live at La Villa?"
--   referral-program (9ccd37c3) : answer, answer_en ; ligne avant md5 a5be739af3be2ab09422c35b601e9d04
--     answer : "la personne candidate sur le site" -> "la personne demande une visite sur le site"
--     answer : "lors de son appel avec le candidat" -> "lors de son appel avec elle"
--     answer_en : "they apply on lavillacoliving.com" -> "they book a visit on lavillacoliving.com"
--     answer_en : "during her call with the candidate" -> "during her call with them"
-- ============================================================================

BEGIN;

DO $bot$
DECLARE
  n integer;
  ecarts text;
BEGIN
  -- 0. fuseau UTC pour la transaction : md5(row_to_json) inclut created_at et updated_at, rendus dans le fuseau de la session
  PERFORM set_config('TimeZone', 'UTC', true);
  -- 1. garde d'entree : 5 fiches, une ligne chacune, ligne entiere = releve du 24/11/2026
  SELECT string_agg(e.slug, ', ' ORDER BY e.slug) INTO ecarts FROM (VALUES
    ('how-to-apply', '4cd6a19e8aff0e49f9a901045f15265b'),
    ('visit-before-applying', 'd7212dde5a20b756532ed9f55e205e92'),
    ('application-timeline', 'cf451cd4a99e847e69774f8671f87b65'),
    ('application-requirements', '49726659026a6bbc2a4f20a54fcd0cd4'),
    ('referral-program', 'a5be739af3be2ab09422c35b601e9d04')
  ) AS e(slug, md5_ligne)
  WHERE (SELECT count(*) FROM public.knowledge_base k WHERE k.slug = e.slug) <> 1
     OR (SELECT md5(row_to_json(k)::text) FROM public.knowledge_base k WHERE k.slug = e.slug) IS DISTINCT FROM e.md5_ligne;
  IF ecarts IS NOT NULL THEN RAISE EXCEPTION 'visite-bot : fiche(s) absente(s) ou modifiee(s) depuis le releve du 24/11/2026, rien n''est ecrit -- %', ecarts; END IF;
  -- 2.1 how-to-apply (d982fcfa) : question, answer, question_en, answer_en
  UPDATE public.knowledge_base k SET question = U&'Comment programmer une visite pour vivre \00e0 La Villa ?', answer = U&'C''est simple : 1) Remplis le formulaire \00ab Programmer une visite \00bb avec tes coordonn\00e9es (2 minutes), ou \00e9cris-nous, 2) On t''appelle sous 48 h pour faire connaissance et caler la visite, 3) Visite la maison, sur place ou en vid\00e9o, et rencontre tes futurs colocataires, 4) Envoie-nous ton dossier, 5) Une fois valid\00e9, signe ton bail en ligne, verse la caution et envoie-nous ton attestation d''assurance : les cl\00e9s te sont remises le jour de l''\00e9tat des lieux.', question_en = U&'How do I book a visit to live at La Villa?', answer_en = U&'It''s simple: 1) Fill in the "Book a visit" form with your details (2 minutes), or message us, 2) We call you within 48 h to get to know each other and set the visit, 3) Visit the house, on site or by video, and meet your future housemates, 4) Send us your file, 5) Once approved, sign your lease online, pay the deposit and send us your home insurance certificate: you get the keys on check-in day.', updated_at = now()
   WHERE k.slug = 'how-to-apply' AND md5(row_to_json(k)::text) = '4cd6a19e8aff0e49f9a901045f15265b';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-bot how-to-apply : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- 2.2 visit-before-applying (e02e0dd7) : question, answer, question_en, answer_en
  UPDATE public.knowledge_base k SET question = U&'Puis-je visiter avant de m''engager ?', answer = U&'Oui, c''est m\00eame la premi\00e8re \00e9tape : tu programmes une visite, sur place ou en vid\00e9o, et on t''appelle sous 48 h pour la caler. On fait ainsi connaissance avant toute d\00e9cision.', question_en = U&'Can I visit before committing?', answer_en = U&'Yes, it''s even the first step: you book a visit, on site or by video, and we call you within 48 h to set it. That way we get to know each other before anyone decides.', updated_at = now()
   WHERE k.slug = 'visit-before-applying' AND md5(row_to_json(k)::text) = 'd7212dde5a20b756532ed9f55e205e92';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-bot visit-before-applying : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- 2.3 application-timeline (dc45d539) : question, answer, question_en, answer_en
  UPDATE public.knowledge_base k SET question = U&'Combien de temps entre la demande de visite et l''emm\00e9nagement ?', answer = U&'Si une chambre est disponible, tu peux emm\00e9nager en 72 h d\00e8s ton premier contact. Ce d\00e9lai inclut l''appel, la visite de la maison (sur place ou en visio), l''examen de ton dossier et la signature du bail. Si tu as une date d''arriv\00e9e pr\00e9cise, indique-la d\00e8s ton premier message.', question_en = U&'How long from the visit request to move-in?', answer_en = U&'If a room is available, you can move in within 72 h of your first contact. That includes the call, the house visit (on site or by video), the review of your file and the lease signing. If you have a specific arrival date, mention it in your first message.', updated_at = now()
   WHERE k.slug = 'application-timeline' AND md5(row_to_json(k)::text) = 'cf451cd4a99e847e69774f8671f87b65';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-bot application-timeline : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- 2.4 application-requirements (9b4f4fd4) : question, question_en
  UPDATE public.knowledge_base k SET question = U&'Quelles sont les conditions pour vivre \00e0 La Villa ?', question_en = U&'What are the requirements to live at La Villa?', updated_at = now()
   WHERE k.slug = 'application-requirements' AND md5(row_to_json(k)::text) = '49726659026a6bbc2a4f20a54fcd0cd4';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-bot application-requirements : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- 2.5 referral-program (9ccd37c3) : answer, answer_en
  UPDATE public.knowledge_base k SET answer = U&'Tu connais quelqu''un qui serait bien chez nous ? Si tu nous pr\00e9sentes un futur colocataire et qu''il signe un bail, tu re\00e7ois 150 \20ac de cr\00e9dit sur ton prochain loyer. Concr\00e8tement : la personne demande une visite sur le site lavillacoliving.com en choisissant \00ab Un r\00e9sident m''a recommand\00e9 \00bb et en indiquant ton pr\00e9nom. Fanny valide le rattachement lors de son appel avec elle, et le cr\00e9dit est appliqu\00e9 sur ton loyer apr\00e8s la signature du bail. \00c7a marche aussi si tu es en pr\00e9avis ! Limite : 3 parrainages par an et par personne, un seul cr\00e9dit par filleul.', answer_en = U&'Know someone who would be a great fit? If you refer a future housemate and they sign a lease, you get a \20ac150 credit on your next rent. How it works: they book a visit on lavillacoliving.com, select "A resident referred me" and mention your first name. Fanny confirms the match during her call with them, and the credit is applied to your rent once the lease is signed. It also works if you are in your notice period! Limit: 3 referrals per year per person, one credit per referred person.', updated_at = now()
   WHERE k.slug = 'referral-program' AND md5(row_to_json(k)::text) = 'a5be739af3be2ab09422c35b601e9d04';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'visite-bot referral-program : % ligne(s) modifiee(s), 1 attendue -- tout est annule', n; END IF;
  -- 3. garde de sortie : md5 de chaque champ modifie = texte du plan (16 champs), fiches toujours actives
  SELECT string_agg(e.slug || '.' || e.champ, ', ' ORDER BY e.slug, e.champ) INTO ecarts FROM (VALUES
    ('how-to-apply', 'question', '6a8047d2994e2296a72e5c21270cb675'),
    ('how-to-apply', 'answer', '073d2294322268693b389423524ec212'),
    ('how-to-apply', 'question_en', '9da6774b2b385e39a4dc208291a2dd81'),
    ('how-to-apply', 'answer_en', '54437d5f44dc530a1ff0c6cf22692610'),
    ('visit-before-applying', 'question', 'efa1704d9b097a5544c72f06059e86ae'),
    ('visit-before-applying', 'answer', 'a2d7ed772326e3c582303334c20bd039'),
    ('visit-before-applying', 'question_en', '950375552c9c0ebb2fbf9ea723383c8f'),
    ('visit-before-applying', 'answer_en', '81b0735c06effaa8cc9215afc7d158a8'),
    ('application-timeline', 'question', '22b35b01827291894fefdd1471e5ab3b'),
    ('application-timeline', 'answer', '988830b734cf18bed48b9e94bb29f280'),
    ('application-timeline', 'question_en', '568dddabbcf39dbd7e30bf2327e1dfcb'),
    ('application-timeline', 'answer_en', 'beb5568d218a937cdf954382b878f355'),
    ('application-requirements', 'question', 'fcf210ab2cf1f269b2971dc8ea9a8f70'),
    ('application-requirements', 'question_en', '52adc7ef15a6ab17671cf4b97169c191'),
    ('referral-program', 'answer', '55a4d09dde9d297d9ab0161f371555a4'),
    ('referral-program', 'answer_en', 'fc1b7b307e1a5b470d01108cab3bee35')
  ) AS e(slug, champ, md5_attendu)
  LEFT JOIN public.knowledge_base k ON k.slug = e.slug
  WHERE k.slug IS NULL OR k.active IS NOT TRUE OR md5(CASE e.champ WHEN 'question' THEN k.question WHEN 'answer' THEN k.answer WHEN 'question_en' THEN k.question_en WHEN 'answer_en' THEN k.answer_en END) IS DISTINCT FROM e.md5_attendu;
  IF ecarts IS NOT NULL THEN RAISE EXCEPTION 'visite-bot : etat obtenu different du texte du plan, tout est annule -- %', ecarts; END IF;
END
$bot$;

COMMIT;

-- Verification (lecture seule, apres COMMIT) : ok = true sur les 16 lignes
SELECT e.slug, e.champ, md5(CASE e.champ WHEN 'question' THEN k.question WHEN 'answer' THEN k.answer WHEN 'question_en' THEN k.question_en WHEN 'answer_en' THEN k.answer_en END) = e.md5_attendu AS ok, k.active, k.updated_at, left(CASE e.champ WHEN 'question' THEN k.question WHEN 'answer' THEN k.answer WHEN 'question_en' THEN k.question_en WHEN 'answer_en' THEN k.answer_en END, 70) AS debut
FROM (VALUES
  ('how-to-apply', 'question', '6a8047d2994e2296a72e5c21270cb675'),
  ('how-to-apply', 'answer', '073d2294322268693b389423524ec212'),
  ('how-to-apply', 'question_en', '9da6774b2b385e39a4dc208291a2dd81'),
  ('how-to-apply', 'answer_en', '54437d5f44dc530a1ff0c6cf22692610'),
  ('visit-before-applying', 'question', 'efa1704d9b097a5544c72f06059e86ae'),
  ('visit-before-applying', 'answer', 'a2d7ed772326e3c582303334c20bd039'),
  ('visit-before-applying', 'question_en', '950375552c9c0ebb2fbf9ea723383c8f'),
  ('visit-before-applying', 'answer_en', '81b0735c06effaa8cc9215afc7d158a8'),
  ('application-timeline', 'question', '22b35b01827291894fefdd1471e5ab3b'),
  ('application-timeline', 'answer', '988830b734cf18bed48b9e94bb29f280'),
  ('application-timeline', 'question_en', '568dddabbcf39dbd7e30bf2327e1dfcb'),
  ('application-timeline', 'answer_en', 'beb5568d218a937cdf954382b878f355'),
  ('application-requirements', 'question', 'fcf210ab2cf1f269b2971dc8ea9a8f70'),
  ('application-requirements', 'question_en', '52adc7ef15a6ab17671cf4b97169c191'),
  ('referral-program', 'answer', '55a4d09dde9d297d9ab0161f371555a4'),
  ('referral-program', 'answer_en', 'fc1b7b307e1a5b470d01108cab3bee35')
) AS e(slug, champ, md5_attendu)
JOIN public.knowledge_base k ON k.slug = e.slug
ORDER BY e.slug, e.champ;
