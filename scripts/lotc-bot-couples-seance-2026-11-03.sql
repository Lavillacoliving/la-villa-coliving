-- Seance du lot C du 03/11/2026, option A de D-C1 : fiche "couples" du bot WhatsApp (knowledge_base, slug coliving-couples).
-- L'ancienne reponse (fevrier 2026) annonce "des chambres plus grandes qui peuvent accommoder des couples" : contraire a la regle du 29/09
-- (une chambre = une personne, un couple = deux chambres). Registre "vous" de la fiche conserve. SQL 100 % ASCII.
-- Sauvegarde : scripts/backups/lotc-bot-couples-2026-11-03.avant.json ; retour arriere : scripts/backups/lotc-bot-couples-2026-11-03.retour-arriere.sql
BEGIN;
DO $c$
BEGIN
  IF (SELECT md5(row_to_json(k)::text) FROM knowledge_base k WHERE slug = 'coliving-couples') IS DISTINCT FROM '93286e67cf4fb03f2f2d6fa63551a497' THEN RAISE EXCEPTION 'etat avant inattendu, rien n''est ecrit'; END IF;
END $c$;
UPDATE knowledge_base SET answer = U&'Chaque chambre accueille une seule personne : nous n''avons pas de chambre pour deux. Un couple peut en revanche vivre chez nous en prenant deux chambres, dans la m\00EAme maison. Contactez-nous pour savoir lesquelles sont disponibles en m\00EAme temps.', answer_en = U&'Each room is for one person: we don''t have rooms for two. A couple can, however, live with us by taking two rooms in the same house. Contact us to find out which ones are available at the same time.', updated_at = now() WHERE slug = 'coliving-couples';
DO $c$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM knowledge_base WHERE slug = 'coliving-couples' AND active AND answer = U&'Chaque chambre accueille une seule personne : nous n''avons pas de chambre pour deux. Un couple peut en revanche vivre chez nous en prenant deux chambres, dans la m\00EAme maison. Contactez-nous pour savoir lesquelles sont disponibles en m\00EAme temps.' AND answer_en = U&'Each room is for one person: we don''t have rooms for two. A couple can, however, live with us by taking two rooms in the same house. Contact us to find out which ones are available at the same time.') THEN RAISE EXCEPTION 'fiche non conforme apres'; END IF;
  IF EXISTS (SELECT 1 FROM knowledge_base WHERE active AND (answer ILIKE '%accommoder des couples%' OR answer_en ILIKE '%accommodate couples%')) THEN RAISE EXCEPTION 'ancienne reponse encore active'; END IF;
END $c$;
COMMIT;
