-- ============================================================================
-- RETOUR ARRIERE de la seance "visite-bot" (2026-11-24). SQL 100 % ASCII (litteraux Unicode echappes, forme U&).
-- Restaure les colonnes modifiees (question, answer, question_en, answer_en selon la fiche) et updated_at des 5 fiches, telles que
-- relues le 24/11/2026 (scripts/backups/visite-bot-2026-11-24.avant.json). Une fiche deja dans son etat d'avant est laissee telle quelle ;
-- une fiche qui n'est ni dans l'etat d'apres la seance ni dans celui d'avant arrete tout (rien n'est ecrit).
-- En sortie : la ligne entiere de chaque fiche retrouve son empreinte md5(row_to_json) du 24/11/2026 (la table n'a pas de declencheur).
-- ============================================================================

BEGIN;

DO $retour$
DECLARE
  n integer;
  ecarts text;
BEGIN
  -- 0. fuseau UTC pour la transaction (md5(row_to_json) inclut les dates)
  PERFORM set_config('TimeZone', 'UTC', true);
  -- 1. garde d'entree : chaque fiche est dans l'etat d'apres la seance (md5 des champs modifies) ou deja dans celui d'avant
  SELECT string_agg(DISTINCT e.slug, ', ') INTO ecarts FROM (VALUES
    ('how-to-apply', 'question', '6a8047d2994e2296a72e5c21270cb675', '4cd6a19e8aff0e49f9a901045f15265b'),
    ('how-to-apply', 'answer', '073d2294322268693b389423524ec212', '4cd6a19e8aff0e49f9a901045f15265b'),
    ('how-to-apply', 'question_en', '9da6774b2b385e39a4dc208291a2dd81', '4cd6a19e8aff0e49f9a901045f15265b'),
    ('how-to-apply', 'answer_en', '54437d5f44dc530a1ff0c6cf22692610', '4cd6a19e8aff0e49f9a901045f15265b'),
    ('visit-before-applying', 'question', 'efa1704d9b097a5544c72f06059e86ae', 'd7212dde5a20b756532ed9f55e205e92'),
    ('visit-before-applying', 'answer', 'a2d7ed772326e3c582303334c20bd039', 'd7212dde5a20b756532ed9f55e205e92'),
    ('visit-before-applying', 'question_en', '950375552c9c0ebb2fbf9ea723383c8f', 'd7212dde5a20b756532ed9f55e205e92'),
    ('visit-before-applying', 'answer_en', '81b0735c06effaa8cc9215afc7d158a8', 'd7212dde5a20b756532ed9f55e205e92'),
    ('application-timeline', 'question', '22b35b01827291894fefdd1471e5ab3b', 'cf451cd4a99e847e69774f8671f87b65'),
    ('application-timeline', 'answer', '988830b734cf18bed48b9e94bb29f280', 'cf451cd4a99e847e69774f8671f87b65'),
    ('application-timeline', 'question_en', '568dddabbcf39dbd7e30bf2327e1dfcb', 'cf451cd4a99e847e69774f8671f87b65'),
    ('application-timeline', 'answer_en', 'beb5568d218a937cdf954382b878f355', 'cf451cd4a99e847e69774f8671f87b65'),
    ('application-requirements', 'question', 'fcf210ab2cf1f269b2971dc8ea9a8f70', '49726659026a6bbc2a4f20a54fcd0cd4'),
    ('application-requirements', 'question_en', '52adc7ef15a6ab17671cf4b97169c191', '49726659026a6bbc2a4f20a54fcd0cd4'),
    ('referral-program', 'answer', '55a4d09dde9d297d9ab0161f371555a4', 'a5be739af3be2ab09422c35b601e9d04'),
    ('referral-program', 'answer_en', 'fc1b7b307e1a5b470d01108cab3bee35', 'a5be739af3be2ab09422c35b601e9d04')
  ) AS e(slug, champ, md5_apres, md5_ligne_avant)
  LEFT JOIN public.knowledge_base k ON k.slug = e.slug
  WHERE k.slug IS NULL OR (md5(CASE e.champ WHEN 'question' THEN k.question WHEN 'answer' THEN k.answer WHEN 'question_en' THEN k.question_en WHEN 'answer_en' THEN k.answer_en END) IS DISTINCT FROM e.md5_apres AND md5(row_to_json(k)::text) IS DISTINCT FROM e.md5_ligne_avant);
  IF ecarts IS NOT NULL THEN RAISE EXCEPTION 'visite-bot retour arriere : fiche(s) ni dans l''etat d''apres la seance ni dans celui d''avant, rien n''est ecrit -- %', ecarts; END IF;
  -- 2.1 how-to-apply : question, answer, question_en, answer_en, updated_at <- sauvegarde
  UPDATE public.knowledge_base k SET question = r.question, answer = r.answer, question_en = r.question_en, answer_en = r.answer_en, updated_at = r.updated_at
    FROM json_populate_record(null::public.knowledge_base, U&'{"id":"d982fcfa-79ed-4d02-8492-0ec9f13c6da0","category":"conditions","subcategory":"Application Process","property":"all","question":"Comment puis-je candidater pour vivre \00e0 La Villa ?","answer":"Le processus est simple : 1) Vous nous \00e9crivez ou remplissez le formulaire de candidature, 2) On planifie un appel de 30 minutes pour faire connaissance et comprendre votre projet, 3) Vous visitez la maison (sur place ou en visio) et rencontrez vos futurs colocataires, 4) Vous nous envoyez votre dossier, 5) Une fois valid\00e9, vous signez le bail en ligne, versez le d\00e9p\00f4t de garantie et nous transmettez votre attestation d''assurance \2014 et les cl\00e9s vous sont remises le jour de l''\00e9tat des lieux.","keywords":[],"priority":10,"active":true,"source_url":null,"created_at":"2026-02-19T06:50:02.906856+00:00","updated_at":"2026-09-03T12:36:48.448522+00:00","question_en":"How do I apply to live at La Villa?","answer_en":"The application process is simple: 1) Fill out the online application form with your details, 2) Schedule a video call with us, 3) Have a 20-minute conversation to get to know each other, 4) Visit the house and meet your potential housemates, 5) If approved, sign your lease and move in!","slug":"how-to-apply"}'::json) r
   WHERE k.slug = 'how-to-apply' AND md5(row_to_json(k)::text) IS DISTINCT FROM '4cd6a19e8aff0e49f9a901045f15265b';
  -- 2.2 visit-before-applying : question, answer, question_en, answer_en, updated_at <- sauvegarde
  UPDATE public.knowledge_base k SET question = r.question, answer = r.answer, question_en = r.question_en, answer_en = r.answer_en, updated_at = r.updated_at
    FROM json_populate_record(null::public.knowledge_base, U&'{"id":"e02e0dd7-bb70-437b-98eb-0ee908f847e8","category":"conditions","subcategory":"Application Process","property":"all","question":"Puis-je visiter avant de candidater ?","answer":"Nous planifions g\00e9n\00e9ralement les visites de maison apr\00e8s l''appel vid\00e9o initial dans le cadre du processus de candidature. Cela nous permet de faire votre connaissance d''abord et d''assurer que la visite est productive pour les deux parties. Des visites virtuelles sont \00e9galement disponibles sur notre site web.","keywords":[],"priority":10,"active":true,"source_url":null,"created_at":"2026-02-19T06:50:02.906856+00:00","updated_at":"2026-02-19T06:50:02.906856+00:00","question_en":"Can I visit before applying?","answer_en":"We typically schedule house visits after the initial video call as part of the application process. This allows us to get to know you first and ensures the visit is productive for both parties. Virtual tours are also available on our website.","slug":"visit-before-applying"}'::json) r
   WHERE k.slug = 'visit-before-applying' AND md5(row_to_json(k)::text) IS DISTINCT FROM 'd7212dde5a20b756532ed9f55e205e92';
  -- 2.3 application-timeline : question, answer, question_en, answer_en, updated_at <- sauvegarde
  UPDATE public.knowledge_base k SET question = r.question, answer = r.answer, question_en = r.question_en, answer_en = r.answer_en, updated_at = r.updated_at
    FROM json_populate_record(null::public.knowledge_base, U&'{"id":"dc45d539-ce43-4125-aa29-d02cedf5128f","category":"conditions","subcategory":"Application Process","property":"all","question":"Combien de temps dure le processus de candidature ?","answer":"Si une chambre est disponible, l''emm\00e9nagement peut se faire en 72 h d\00e8s le premier contact. Ce d\00e9lai inclut l''appel vid\00e9o, la visite de la maison (sur place ou en visio), l''examen de la candidature et la signature du bail. Si vous avez une date d''arriv\00e9e pr\00e9cise, indiquez-la d\00e8s votre premier message.","keywords":[],"priority":10,"active":true,"source_url":null,"created_at":"2026-02-19T06:50:02.906856+00:00","updated_at":"2026-09-30T07:43:18.866905+00:00","question_en":"How long does the application process take?","answer_en":"If a room is available, you can move in within 72 h of your first contact. That includes the video call, the house visit (on site or by video), the application review and the lease signing. If you have a specific arrival date, mention it in your first message.","slug":"application-timeline"}'::json) r
   WHERE k.slug = 'application-timeline' AND md5(row_to_json(k)::text) IS DISTINCT FROM 'cf451cd4a99e847e69774f8671f87b65';
  -- 2.4 application-requirements : question, question_en, updated_at <- sauvegarde
  UPDATE public.knowledge_base k SET question = r.question, question_en = r.question_en, updated_at = r.updated_at
    FROM json_populate_record(null::public.knowledge_base, U&'{"id":"9b4f4fd4-5e95-4ea1-95ad-2c00f03edef9","category":"conditions","subcategory":"Application Process","property":"all","question":"Quelles sont les exigences pour candidater ?","answer":"Nous recherchons des personnes ouvertes d''esprit et respectueuses qui partagent nos valeurs communautaires. Vous devriez \00eatre employ\00e9 ou avoir une source de revenus stable, venir pour vous installer plut\00f4t que pour quelques nuits, et \00eatre enthousiaste \00e0 l''id\00e9e de la vie communautaire. Nous accueillons des candidats de tous horizons et nationalit\00e9s.","keywords":[],"priority":10,"active":true,"source_url":null,"created_at":"2026-02-19T06:50:02.906856+00:00","updated_at":"2026-09-30T07:43:18.866905+00:00","question_en":"What are the requirements to apply?","answer_en":"We look for open-minded, respectful individuals who share our community values. You should be employed or have a stable income source, be looking to settle in rather than stay a few nights, and be excited about community living. We welcome applicants from all backgrounds and nationalities.","slug":"application-requirements"}'::json) r
   WHERE k.slug = 'application-requirements' AND md5(row_to_json(k)::text) IS DISTINCT FROM '49726659026a6bbc2a4f20a54fcd0cd4';
  -- 2.5 referral-program : answer, answer_en, updated_at <- sauvegarde
  UPDATE public.knowledge_base k SET answer = r.answer, answer_en = r.answer_en, updated_at = r.updated_at
    FROM json_populate_record(null::public.knowledge_base, U&'{"id":"9ccd37c3-f9be-4e91-baf3-523e3e9dbe0e","category":"vie_commune","subcategory":null,"property":"all","question":"Comment fonctionne le programme de parrainage ?","answer":"Tu connais quelqu''un qui serait bien chez nous ? Si tu nous pr\00e9sentes un futur colocataire et qu''il signe un bail, tu re\00e7ois 150 \20ac de cr\00e9dit sur ton prochain loyer. Concr\00e8tement : la personne candidate sur le site lavillacoliving.com en choisissant \00ab Un r\00e9sident m''a recommand\00e9 \00bb et en indiquant ton pr\00e9nom. Fanny valide le rattachement lors de son appel avec le candidat, et le cr\00e9dit est appliqu\00e9 sur ton loyer apr\00e8s la signature du bail. \00c7a marche aussi si tu es en pr\00e9avis ! Limite : 3 parrainages par an et par personne, un seul cr\00e9dit par filleul.","keywords":["parrainage", "parrainer", "recommander", "recommandation", "filleul", "referral", "refer", "150", "credit", "prime", "ami", "friend", "recommend"],"priority":10,"active":true,"source_url":null,"created_at":"2026-07-28T13:30:18.849935+00:00","updated_at":"2026-07-28T13:30:18.849935+00:00","question_en":"How does the referral program work?","answer_en":"Know someone who would be a great fit? If you refer a future housemate and they sign a lease, you get a \20ac150 credit on your next rent. How it works: they apply on lavillacoliving.com, select \\"A resident referred me\\" and mention your first name. Fanny confirms the match during her call with the candidate, and the credit is applied to your rent once the lease is signed. It also works if you are in your notice period! Limit: 3 referrals per year per person, one credit per referred person.","slug":"referral-program"}'::json) r
   WHERE k.slug = 'referral-program' AND md5(row_to_json(k)::text) IS DISTINCT FROM 'a5be739af3be2ab09422c35b601e9d04';
  -- 3. garde de sortie : la ligne entiere de chaque fiche = releve du 24/11/2026
  SELECT string_agg(e.slug, ', ' ORDER BY e.slug) INTO ecarts FROM (VALUES
    ('how-to-apply', '4cd6a19e8aff0e49f9a901045f15265b'),
    ('visit-before-applying', 'd7212dde5a20b756532ed9f55e205e92'),
    ('application-timeline', 'cf451cd4a99e847e69774f8671f87b65'),
    ('application-requirements', '49726659026a6bbc2a4f20a54fcd0cd4'),
    ('referral-program', 'a5be739af3be2ab09422c35b601e9d04')
  ) AS e(slug, md5_ligne)
  WHERE (SELECT md5(row_to_json(k)::text) FROM public.knowledge_base k WHERE k.slug = e.slug) IS DISTINCT FROM e.md5_ligne;
  IF ecarts IS NOT NULL THEN RAISE EXCEPTION 'visite-bot retour arriere : fiche(s) non conforme(s) apres restauration, tout est annule -- %', ecarts; END IF;
END
$retour$;

COMMIT;

-- Verification (lecture seule, independante du fuseau) : ok = true sur les 16 lignes (texte d'avant et date d'avant)
SELECT e.slug, e.champ, md5(CASE e.champ WHEN 'question' THEN k.question WHEN 'answer' THEN k.answer WHEN 'question_en' THEN k.question_en WHEN 'answer_en' THEN k.answer_en END) = e.md5_avant AND k.updated_at = e.date_avant::timestamptz AS ok, k.updated_at
FROM (VALUES
  ('how-to-apply', 'question', 'd0e4459598eefaace0e5d0a5bc12429d', '2026-09-03T12:36:48.448522+00:00'),
  ('how-to-apply', 'answer', 'ce3b5bb225db5a0a5304350183bbd652', '2026-09-03T12:36:48.448522+00:00'),
  ('how-to-apply', 'question_en', '6ce0a4dcfba132e9567f46ff11ab9272', '2026-09-03T12:36:48.448522+00:00'),
  ('how-to-apply', 'answer_en', '99e7db7bba0103a7d9131b522e45098e', '2026-09-03T12:36:48.448522+00:00'),
  ('visit-before-applying', 'question', '054645fe8e2fa15aa8796ad9a7001417', '2026-02-19T06:50:02.906856+00:00'),
  ('visit-before-applying', 'answer', '9fd4167588165f9d6c7933038f2c0343', '2026-02-19T06:50:02.906856+00:00'),
  ('visit-before-applying', 'question_en', '8322f90c0943821e69fb87cade61dfd3', '2026-02-19T06:50:02.906856+00:00'),
  ('visit-before-applying', 'answer_en', '8a5123bb5e723ac2a1e578a210493e43', '2026-02-19T06:50:02.906856+00:00'),
  ('application-timeline', 'question', '68ffa486d6906042d4df68fc2967d656', '2026-09-30T07:43:18.866905+00:00'),
  ('application-timeline', 'answer', '30f4265c397ad71bb2e1f407fe152d61', '2026-09-30T07:43:18.866905+00:00'),
  ('application-timeline', 'question_en', '562bd36da6d0a33390038cd92c8468a3', '2026-09-30T07:43:18.866905+00:00'),
  ('application-timeline', 'answer_en', '9432bc622c2c5d2c886f38c26917cf16', '2026-09-30T07:43:18.866905+00:00'),
  ('application-requirements', 'question', 'cf4a781f9c4d5a945ce7ddcb31ea27e4', '2026-09-30T07:43:18.866905+00:00'),
  ('application-requirements', 'question_en', '03672cc5b65d8ba7c95597b7e5084ddd', '2026-09-30T07:43:18.866905+00:00'),
  ('referral-program', 'answer', 'ed4980bead697255602e77a5ebad1e06', '2026-07-28T13:30:18.849935+00:00'),
  ('referral-program', 'answer_en', '683cbaa93c65afb5bf87486026a35ac2', '2026-07-28T13:30:18.849935+00:00')
) AS e(slug, champ, md5_avant, date_avant)
JOIN public.knowledge_base k ON k.slug = e.slug
ORDER BY e.slug, e.champ;
