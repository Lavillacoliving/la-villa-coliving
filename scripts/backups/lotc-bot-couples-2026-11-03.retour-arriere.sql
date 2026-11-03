-- Retour arriere de la fiche "couples" du bot (lot C, 03/11/2026). SQL 100 % ASCII.
BEGIN;
UPDATE knowledge_base k SET answer = r.answer, answer_en = r.answer_en, updated_at = r.updated_at FROM json_populate_record(null::knowledge_base, U&'{"id":"38675d32-2f4f-44ff-8bc4-5fe8bba03072","category":"vie_commune","subcategory":"Community & Lifestyle","property":"all","question":"Les couples peuvent-ils vivre \00E0 La Villa ?","answer":"Nos chambres sont con\00E7ues pour des r\00E9sidents individuels, et notre dynamique communautaire fonctionne mieux avec des occupants seuls. Cependant, nous avons occasionnellement des chambres plus grandes qui peuvent accommoder des couples. Veuillez nous contacter pour discuter de votre situation sp\00E9cifique.","keywords":[],"priority":10,"active":true,"source_url":null,"created_at":"2026-02-19T06:50:02.906856+00:00","updated_at":"2026-02-19T06:50:02.906856+00:00","question_en":"Can couples live at La Villa?","answer_en":"Our rooms are designed for individual residents, and our community dynamic works best with single occupants. However, we occasionally have larger rooms that can accommodate couples. Please contact us to discuss your specific situation.","slug":"coliving-couples"}'::json) r WHERE k.slug = 'coliving-couples';
DO $c$
BEGIN
  IF (SELECT md5(row_to_json(k)::text) FROM knowledge_base k WHERE slug = 'coliving-couples') IS DISTINCT FROM '93286e67cf4fb03f2f2d6fa63551a497' THEN RAISE EXCEPTION 'retour arriere non conforme'; END IF;
END $c$;
COMMIT;
