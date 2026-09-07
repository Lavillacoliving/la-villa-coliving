-- ============================================================================
-- Coherence des faits dans les articles (Lot S2, brief « Socle entite ») — 2026-09-07
-- Decisions Jerome : D6 (aucune promesse « pas de garant » : dossier = contrat de travail ou promesse
-- d'embauche, garant seulement au cas par cas), relecture C2 du 07/09 (train Annemasse -> Cornavin ~ 20 min,
-- Eaux-Vives 8 min, centre a 20 min porte-a-porte), regle des minutes de la garde CI (une duree non canonique
-- dans une phrase « Geneve » doit etre qualifiee : en voiture, a pied, tram...).
-- APPLIQUE le 07/09/2026 via MCP execute_sql sur GO de Jerome (6 UPDATE sans BEGIN/COMMIT, verification : 0 reste,
-- 6 articles mis a jour). Conserve pour trace : NE PAS REJOUER (les ancres n'existent plus, les UPDATE seraient sans effet).
-- Methode : replace() sur des ancres exactes (relevees le 07/09 par requete), UPDATE gardes par LIKE,
-- updated_at = now() sur chaque ligne modifiee. Verification en fin de script. Pas de DELETE.
-- Conserves volontairement (pas La Villa) : « 3 mois de loyer en Suisse » (colocation-expats, regies suisses,
-- source CAGI), « 9 ou 12 mois minimum » (living-in-france, autres proprietaires), « pas de garant local /
-- Visale / Garantme » (guide-ressources et dossier-location : conseils sur le marche classique).
-- ============================================================================

BEGIN;

-- 1. coliving-transfrontalier-geneve-annemasse-nouvelle-vie
UPDATE public.blog_posts SET
  content_fr = replace(replace(replace(content_fr,
    '- **Zéro paperasse** : pas de garant, meublé, charges incluses.',
    '- **Zéro paperasse** : dossier simple (contrat de travail ou promesse d''embauche), meublé, charges incluses.'),
    'Pas de garant français à trouver, pas de contrats d''électricité et d''internet à ouvrir',
    'Pas de contrats d''électricité et d''internet à ouvrir'),
    'les Alpes à 30-40 minutes (ski',
    'les Alpes à 30-40 minutes en voiture (ski'),
  content_en = replace(replace(content_en,
    '- **Zero paperwork**: no guarantor, furnished, utilities included.',
    '- **Zero paperwork**: a simple file (employment contract or job offer), furnished, utilities included.'),
    'the Alps 30-40 minutes away (skiing',
    'the Alps 30-40 minutes away by car (skiing'),
  updated_at = now()
WHERE slug = 'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  AND (content_fr LIKE '%pas de garant, meublé%' OR content_en LIKE '%no guarantor, furnished%' OR content_en LIKE '%Alps 30-40 minutes away (skiing%');

-- 2. dossier-location-frontalier-suisse-france
UPDATE public.blog_posts SET
  content_fr = replace(replace(content_fr,
    'un processus de candidature simplifié, pas de garant requis (nous évaluons la solvabilité différemment), un bail meublé',
    'un processus de candidature simplifié (contrat de travail ou promesse d''embauche, garant seulement au cas par cas), un bail meublé'),
    'accepte les frontaliers sans garant français — chambre meublée',
    'accepte les frontaliers sur la base de leur contrat de travail — chambre meublée'),
  content_en = replace(content_en,
    'a simplified application process, no guarantor required (we assess solvency differently), an all-inclusive',
    'a simplified application process (employment contract or job offer, a guarantor only case by case), an all-inclusive'),
  updated_at = now()
WHERE slug = 'dossier-location-frontalier-suisse-france'
  AND (content_fr LIKE '%pas de garant requis%' OR content_en LIKE '%no guarantor required%');

-- 3. living-in-france-working-in-geneva
UPDATE public.blog_posts SET
  content_fr = replace(content_fr,
    'Pas de garantie bancaire farfelue, pas de garant français si tu es étranger, pas de 10 justificatifs de revenu.',
    'Pas de garantie bancaire farfelue, pas de 10 justificatifs de revenu : un contrat de travail ou une promesse d''embauche suffit, un garant seulement au cas par cas.'),
  updated_at = now()
WHERE slug = 'living-in-france-working-in-geneva' AND content_fr LIKE '%pas de garant français si tu es étranger%';

-- 4. trouver-colocation-geneve-frontalier
UPDATE public.blog_posts SET
  content_fr = replace(replace(content_fr,
    'Bonne nouvelle : en coliving, le dossier est simplifié — **[pas de garant français exigé](https://www.service-public.fr/particuliers/vosdroits/F34661)**.',
    'Bonne nouvelle : en coliving, le dossier est simplifié — contrat de travail ou promesse d''embauche, garant seulement au cas par cas.'),
    '- En coliving, **pas de garant français** et tout est inclus.',
    '- En coliving, un dossier simple et tout est inclus.'),
  updated_at = now()
WHERE slug = 'trouver-colocation-geneve-frontalier' AND content_fr LIKE '%pas de garant français%';

-- 5. budget-colocation-geneve-guide-complet (EN, chapo)
UPDATE public.blog_posts SET
  content_en = replace(content_en,
    'solutions for living comfortably 15 minutes from Geneva',
    'solutions for living comfortably 20 minutes door-to-door from Geneva'),
  updated_at = now()
WHERE slug = 'budget-colocation-geneve-guide-complet' AND content_en LIKE '%living comfortably 15 minutes from Geneva%';

-- 6. ou-habiter-frontalier-suisse-villes-france-pas-cher (extrait affiche sur /blog)
UPDATE public.blog_posts SET
  excerpt_fr = replace(excerpt_fr, 'trajet Genève en 15 min', 'trajet Genève en 20 min porte-à-porte'),
  updated_at = now()
WHERE slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher' AND excerpt_fr LIKE '%trajet Genève en 15 min%';

COMMIT;

-- Verification (attendu : 0 ligne)
SELECT slug FROM public.blog_posts WHERE is_published AND (
  content_fr LIKE '%pas de garant, meublé%' OR content_en LIKE '%no guarantor, furnished%' OR content_en LIKE '%Alps 30-40 minutes away (skiing%'
  OR content_fr LIKE '%pas de garant requis%' OR content_en LIKE '%no guarantor required%' OR content_fr LIKE '%sans garant français —%'
  OR content_fr LIKE '%pas de garant français si tu es étranger%' OR content_fr LIKE '%pas de garant français exigé%' OR content_fr LIKE '%**pas de garant français**%'
  OR content_en LIKE '%living comfortably 15 minutes from Geneva%' OR excerpt_fr LIKE '%trajet Genève en 15 min%');
