-- ============================================================================
-- Lot « délais 72 h, caution, bot » — réponses de Jérôme du 29/09/2026 (questions 2, 5, 6)
--   · délai d'emménagement : « 72 h dès le premier contact si une chambre est disponible » (articles publiés, calendrier n8n)
--   · caution restituée « sous 30 jours si aucune dégradation n'est constatée, sinon sous 2 mois » (bot, portail résidents)
--   · bot (knowledge_base) : plus de règle « notre format commence à 3 mois » (8 entrées actives ; 88bd71b1 inactive, non touchée)
--   · portail résidents (property_content, « Préparer ton départ », 3 maisons) : plus de « rupture anticipée au cas par cas »
--   · articles : caution jamais chiffrée (EN « 2,760 CHF » → 2 mois de loyer hors charges), séjour moyen canonique (13 mois),
--     plus de « sans pénalité de bail » (le bail garde des frais de remise en location : ne jamais promettre « sans frais » au départ)
--   · articles : « caution intégralement restituée » / « fully refundable » → remboursable (retenues possibles) ; per diem OI FR = EN
--   · calendrier n8n : délai 72 h, promesse « pas de garant » retirée (D6)
--   · stratégie n8n v5 (v4 désactivée, jamais supprimée)
-- Relu par une revue contradictoire (28 constats, tous corrigés) ; UPDATE du Lodge rendu idempotent.
-- ORDRE : GO Jérôme → ce SQL via MCP (précontrôle du 29/09 : chaque phrase présente exactement 1 fois, 3 pour property_content)
--         → push de la branche fix/delais-72h-caution (la garde « emménagement en une/deux semaines » de check-entity-facts
--         échouerait sur les articles si le push précédait le SQL).
-- ============================================================================
BEGIN;

-- 1. Articles publiés (délai 72 h, caution jamais chiffrée, bail sans « pénalité », durée de séjour canonique)
UPDATE public.blog_posts SET
  content_fr = replace(content_fr,
    'tu emménages en 2 semaines avec juste tes valises.',
    'tu peux emménager en 72 h dès ton premier contact si une chambre est disponible, avec juste tes valises.'),
  content_en = replace(replace(replace(replace(content_en,
    'you move in within 2 weeks with just your suitcases.',
    'you can move in within 72 h of your first contact if a room is available, with just your suitcases.'),
    '| Security deposit | 5,400-6,600 CHF | 1,000-1,400 € | 2,760 CHF |',
    '| Security deposit | 5,400-6,600 CHF | 1,000-1,400 € | 2 months'' rent excluding charges |'),
    '| Initial investment | 10,000-15,000 CHF | 2,000-4,000 € | 2,760 CHF |',
    '| Initial investment | 10,000-15,000 CHF | 2,000-4,000 € | 2 months'' rent excluding charges |'),
    'La Villa coliving, **a 2,760 CHF deposit only**',
    'La Villa coliving, **only the deposit, 2 months'' rent excluding charges**'),
  updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet';
UPDATE public.blog_posts SET
  content_fr = replace(content_fr,
    '- Avantage : emménagement en 2 semaines, communauté instantanée',
    '- Avantage : emménagement en 72 h dès le premier contact si une chambre est disponible, communauté instantanée'),
  content_en = replace(content_en,
    '- Upside: move in within 2 weeks, instant community',
    '- Upside: move in within 72 h of your first contact if a room is available, instant community'),
  updated_at = now()
WHERE slug = 'colocation-annemasse-ville-la-grand-ambilly';
UPDATE public.blog_posts SET
  content_fr = replace(content_fr,
    'tu peux emménager en 2 semaines.',
    'tu peux emménager en 72 h dès ton premier contact si une chambre est disponible.'),
  content_en = replace(content_en,
    'you can move in within 2 weeks.',
    'you can move in within 72 h of your first contact if a room is available.'),
  updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026';
UPDATE public.blog_posts SET
  content_fr = replace(replace(replace(replace(content_fr,
    'Nous réservons des chambres pour les arrivées rapides (moins de 2 semaines).',
    'Si une chambre est disponible, tu peux emménager en 72 h dès ton premier contact.'),
    'il faut pouvoir partir sans pénalité de bail',
    'il faut pouvoir partir vite, avec un préavis court'),
    'couvre parfaitement le dépôt de garantie du coliving (2 mois de loyer hors charges)',
    'couvre une bonne partie du dépôt de garantie du coliving (2 mois de loyer hors charges)'),
    'est pensé pour ces arrivées rapides',
    'est pensé pour les arrivées rapides'),
  content_en = replace(replace(replace(content_en,
    'We reserve rooms for quick arrivals (under 2 weeks).',
    'If a room is available, you can move in within 72 h of your first contact.'),
    'you need to be able to leave without lease penalties',
    'you need to be able to leave quickly, on short notice'),
    'perfectly covers the coliving security deposit (2,760 CHF)',
    'goes a long way towards the coliving security deposit (2 months'' rent excluding charges)'),
  updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter';
UPDATE public.blog_posts SET
  content_fr = replace(replace(content_fr,
    '**Pourquoi uniquement des baux de 12 mois et pas de formules plus courtes ?**',
    '**Pourquoi un bail de 12 mois plutôt que des formules courtes ?**'),
    'et à la cohérence de l''expérience de vie que nous voulons offrir.',
    'et à la cohérence de l''expérience de vie que nous voulons offrir. Et tu restes libre de partir à tout moment, avec un mois de préavis.'),
  content_en = replace(replace(content_en,
    '**Why only 12-month leases and no shorter formulas?**',
    '**Why a 12-month lease rather than short stays?**'),
    'and the coherence of the living experience we want to offer.',
    'and the coherence of the living experience we want to offer. And you remain free to leave at any time with one month''s notice.'),
  updated_at = now()
WHERE slug = 'lodge-annemasse-coliving-premium-portes-geneve'
  AND content_fr NOT LIKE '%Et tu restes libre de partir à tout moment, avec un mois de préavis.%';
UPDATE public.blog_posts SET
  content_fr = replace(replace(content_fr,
    '(nos résidents restent de 6 mois à 3 ans)',
    '(nos résidents restent 13 mois en moyenne, 9 mois hors longs séjours)'),
    'une caution intégralement restituée. C''est tout.',
    'une caution remboursable. C''est tout.'),
  content_en = replace(replace(content_en,
    '(our residents stay from 6 months to 3 years)',
    '(our residents stay 13 months on average, 9 months excluding long stays)'),
    'a fully refundable deposit. That''s it.',
    'a refundable deposit. That''s it.'),
  updated_at = now()
WHERE slug = 'coliving-frais-dossier-geneve-annemasse';
UPDATE public.blog_posts SET
  content_fr = replace(content_fr,
    'une caution intégralement restituée — c''est tout.',
    'une caution remboursable — c''est tout.'),
  content_en = replace(content_en,
    'a fully refundable deposit — that is it.',
    'a refundable deposit — that is it.'),
  updated_at = now()
WHERE slug = 'guide-ressources-frontalier-geneve';

-- 2. Bot (knowledge_base) : plus de règle « 3 mois », délai 72 h, restitution de la caution
UPDATE public.knowledge_base SET answer = 'Oui. Vous signez un bail meublé de 12 mois et vous restez libre de partir à tout moment, avec un mois de préavis. Une maison n''est pas un hôtel : nous accueillons des gens qui s''installent, pas des séjours à la nuit, et c''est ce qui rend le quotidien agréable pour tous.', answer_en = 'Yes. You sign a 12-month furnished lease and you''re free to leave at any time with one month''s notice. A house isn''t a hotel: we welcome people who settle in, not overnight stays, and that''s what makes everyday life pleasant for everyone.', updated_at = now()
WHERE id = '648c5ec0-7b8d-44e2-8fec-1bcbc69beb73' AND answer LIKE '%Notre format commence à 3 mois%';
UPDATE public.knowledge_base SET answer = 'Le bail est un contrat meublé de 12 mois, résiliable à tout moment avec 1 mois de préavis. Une maison n''est pas un hôtel : nous accueillons des gens qui s''installent, pas des séjours à la nuit.', updated_at = now()
WHERE id = '3c9ef2e2-42a2-4f17-968f-e6744b09627f' AND answer LIKE '%format d''accueil commence à 3 mois%';
UPDATE public.knowledge_base SET answer = 'Si une chambre est disponible, l''emménagement peut se faire en 72 h dès le premier contact. Ce délai inclut l''appel vidéo, la visite de la maison (sur place ou en visio), l''examen de la candidature et la signature du bail. Si vous avez une date d''arrivée précise, indiquez-la dès votre premier message.', answer_en = 'If a room is available, you can move in within 72 h of your first contact. That includes the video call, the house visit (on site or by video), the application review and the lease signing. If you have a specific arrival date, mention it in your first message.', updated_at = now()
WHERE id = 'dc45d539-ce43-4125-aa29-d02cedf5128f' AND answer LIKE '%1 à 2 semaines%';
UPDATE public.knowledge_base SET answer = 'Oui : tu signes un bail meublé de 12 mois et tu restes libre de partir à tout moment, avec un mois de préavis. Je préfère te le dire franchement : une maison n''est pas un hôtel, on accueille des gens qui s''installent, pas des séjours à la nuit. Si ça te correspond, je t''explique la suite avec plaisir !', updated_at = now()
WHERE id = 'fa64f2a6-c786-4e6e-abdb-c68bcab41611' AND answer LIKE '%Notre format commence à 3 mois%';
UPDATE public.knowledge_base SET answer = 'Non, pas de durée minimale imposée : vous signez un bail meublé de 12 mois et vous restez libre de partir à tout moment, avec un mois de préavis. Une maison n''est pas un hôtel : nous accueillons des gens qui s''installent, pas des séjours à la nuit, et c''est ce qui permet à chacun de créer de vrais liens.', answer_en = 'No set minimum: you sign a 12-month furnished lease and you''re free to leave at any time with one month''s notice. A house isn''t a hotel: we welcome people who settle in, not overnight stays, and that''s what lets everyone build real connections.', updated_at = now()
WHERE id = 'c0ae1070-9645-454a-8619-3859b1b7af7b' AND answer LIKE '%notre format commence à 3 mois%';
UPDATE public.knowledge_base SET answer = replace(answer, 'pouvoir vous engager sur notre durée de séjour minimum', 'venir pour vous installer plutôt que pour quelques nuits'),
  answer_en = replace(answer_en, 'be able to commit to our minimum stay requirement', 'be looking to settle in rather than stay a few nights'), updated_at = now()
WHERE id = '9b4f4fd4-5e95-4ea1-95ad-2c00f03edef9';
UPDATE public.knowledge_base SET answer = replace(answer, 'si le calendrier ou la durée ne s''alignent pas avec notre format (3 mois minimum)', 'si le calendrier ne s''aligne pas, si le projet relève d''un séjour de quelques nuits plutôt que d''une installation'),
  answer_en = replace(answer_en, 'if the timing or duration doesn''t match our format (3-month minimum)', 'if the timing doesn''t line up, if the plan is a stay of a few nights rather than settling in'), updated_at = now()
WHERE id = 'fd332f65-c42a-423c-88b0-d1f4ddd5c017';
UPDATE public.knowledge_base SET answer = replace(answer, 'et restitué après l''état des lieux de sortie, déduction faite d''éventuels dommages au-delà de l''usure normale.', 'et restitué sous 30 jours après l''état des lieux de sortie si aucune dégradation n''est constatée, sinon sous 2 mois, déduction faite d''éventuels dommages au-delà de l''usure normale.'),
  answer_en = replace(answer_en, 'and returned after the check-out inspection, minus any deductions for damage beyond normal wear.', 'and returned within 30 days of the check-out inspection if there is no damage, otherwise within 2 months, minus any deductions for damage beyond normal wear.'), updated_at = now()
WHERE id = '2d78415a-7939-4355-bcf4-6dba66c9372c';

-- 3. Portail résidents (property_content, section « Préparer ton départ », 3 maisons)
UPDATE public.property_content SET
  content_fr = replace(replace(content_fr,
    'Le bail est de 12 mois — toute rupture anticipée à discuter au cas par cas.',
    'Le bail est de 12 mois, et tu restes libre de partir à tout moment en respectant ce préavis.'),
    'La caution (2 mois de loyer) est restituée sous 2 mois après l''état des lieux de sortie.',
    'La caution (2 mois de loyer) est restituée sous 30 jours après l''état des lieux de sortie si aucune dégradation n''est constatée, sinon sous 2 mois.'),
  content_en = replace(replace(content_en,
    'Lease is 12 months — early termination to be discussed case by case.',
    'The lease is 12 months, and you''re free to leave at any time by giving this notice.'),
    'Deposit (2 months'' rent) returned within 2 months of the move-out inspection.',
    'Deposit (2 months'' rent) returned within 30 days of the move-out inspection if there is no damage, otherwise within 2 months.'),
  updated_at = now(), updated_by = 'Claude Code — décisions Jérôme 29/09/2026'
WHERE id IN ('720abb98-dbe0-47c9-b94e-37a840292bdb', '2322adc9-7507-4fe6-a48f-e9f36bbefe00', '0f8c9945-c122-4c56-a9e8-ad3a06e68939');

-- 4. Calendrier n8n (délai, promesse « pas de garant » retirée, D6)
UPDATE public.blog_calendar SET key_points = replace(key_points::text, 'Option coliving : emménagement en 2 semaines, dossier simplifié', 'Option coliving : emménagement en 72 h dès le premier contact si une chambre est disponible, dossier simplifié')::jsonb, updated_at = now() WHERE id = '27da94d1-47fb-4f76-a447-60a28173e529';
UPDATE public.blog_calendar SET key_points = replace(key_points::text, 'Pas de garant français exigé, pas de frais de dossier', 'Pas de frais de dossier')::jsonb, updated_at = now() WHERE id::text LIKE '4055edab%';

-- 5. Stratégie éditoriale n8n v5 (v4 désactivée, jamais supprimée)
UPDATE public.blog_editorial_strategy SET is_active = false WHERE version = 4;
INSERT INTO public.blog_editorial_strategy (version, is_active, content_md, updated_by)
SELECT 5, true,
  replace(replace(replace(content_md,
    '(v4, 29/09/2026 — bail sans engagement minimum, 72 h, couples, home cinéma ; v3 05/09 fiche entité src/data/entityFacts.ts ; v2 04/08 citabilité IA ; v1 27/07)',
    '(v5, 29/09/2026 — restitution de la caution, jamais « sans frais » au départ ; v4 29/09 bail sans engagement minimum, 72 h, couples, home cinéma ; v3 05/09 fiche entité src/data/entityFacts.ts ; v2 04/08 citabilité IA ; v1 27/07)'),
    '- Caution 2 mois HORS charges · 0 frais',
    '- Caution 2 mois HORS charges, restituée sous 30 jours si aucune dégradation n''est constatée, sinon sous 2 mois · 0 frais'),
    '(jamais d''engagement minimum ni de « 3 mois minimum »)',
    '(jamais d''engagement minimum ni de « 3 mois minimum », jamais « sans frais » à propos du départ)'),
  'Claude Code — décisions Jérôme 29/09/2026 (caution, pas de « sans frais » au départ)'
FROM public.blog_editorial_strategy WHERE version = 4
  AND NOT EXISTS (SELECT 1 FROM public.blog_editorial_strategy WHERE version = 5);

COMMIT;
