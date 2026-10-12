-- scripts/correctifs-faits-blog-complement-2026-10-12.sql — complément du lot « correctifs de faits du blog » (08/10/2026, GO Jérôme
-- 12/10/2026) : ce que le générateur ne couvre pas. (1) 4 substitutions à occurrences MULTIPLES (replace() global, gardé par le
-- comptage exact relevé le 12/10) ; (2) 7 metas vides renseignées (110-160 caractères, garde « meta vide »). Rejouable : 0 effet si déjà appliqué.
-- Les 36 substitutions simples sont dans scripts/correctifs-faits-blog-2026-10-12.sql (générateur, dry-run joint).
BEGIN;
UPDATE public.blog_posts SET content_fr = replace(content_fr, $m$Le coliving à 1 370 CHF $m$, $m$Le coliving, dès 1 370 CHF, $m$), updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND (length(content_fr) - length(replace(content_fr, $m$Le coliving à 1 370 CHF $m$, ''))) / length($m$Le coliving à 1 370 CHF $m$) = 2
  AND position($m$Le coliving, dès 1 370 CHF, $m$ IN content_fr) = 0;
UPDATE public.blog_posts SET content_en = replace(content_en, $m$Coliving at 1,370 CHF $m$, $m$Coliving, from 1,370 CHF, $m$), updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND (length(content_en) - length(replace(content_en, $m$Coliving at 1,370 CHF $m$, ''))) / length($m$Coliving at 1,370 CHF $m$) = 2
  AND position($m$Coliving, from 1,370 CHF, $m$ IN content_en) = 0;
UPDATE public.blog_posts SET content_fr = replace(content_fr, $m$Le coliving à 1 370 CHF $m$, $m$Le coliving, dès 1 370 CHF, $m$), updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND (length(content_fr) - length(replace(content_fr, $m$Le coliving à 1 370 CHF $m$, ''))) / length($m$Le coliving à 1 370 CHF $m$) = 4
  AND position($m$Le coliving, dès 1 370 CHF, $m$ IN content_fr) = 0;
UPDATE public.blog_posts SET content_en = replace(content_en, $m$Coliving at 1,370 CHF $m$, $m$Coliving, from 1,370 CHF, $m$), updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND (length(content_en) - length(replace(content_en, $m$Coliving at 1,370 CHF $m$, ''))) / length($m$Coliving at 1,370 CHF $m$) = 4
  AND position($m$Coliving, from 1,370 CHF, $m$ IN content_en) = 0;

-- G1 · fiscalite-frontalier-geneve-impots-2026 · meta_description_fr : meta vide
UPDATE public.blog_posts SET meta_description_fr = $m$Impôt à la source, déclaration en France, quasi-résident, 3e pilier : du brut au net réel du frontalier à Genève en 2026, calculs concrets à l'appui.$m$, updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026' AND coalesce(meta_description_fr, '') = '';
-- G2 · fiscalite-frontalier-geneve-impots-2026 · meta_description_en : meta vide
UPDATE public.blog_posts SET meta_description_en = $m$Withholding tax, French return, quasi-resident status, 3rd pillar: from gross to real net pay for a Geneva cross-border worker in 2026, with real figures.$m$, updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026' AND coalesce(meta_description_en, '') = '';
-- G3 · organisations-internationales-geneve-ou-habiter · meta_description_fr : meta vide
UPDATE public.blog_posts SET meta_description_fr = $m$ONU, OMS, CICR, CERN : chaque campus est à un endroit différent. Où habiter côté France selon ton organisation : trajet, budget, logement et bail adaptés.$m$, updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter' AND coalesce(meta_description_fr, '') = '';
-- G4 · organisations-internationales-geneve-ou-habiter · meta_description_en : meta vide
UPDATE public.blog_posts SET meta_description_en = $m$UN, WHO, ICRC, CERN: each campus is in a different place. Where to live on the French side depending on your organisation: commute, budget and housing.$m$, updated_at = now()
WHERE slug = 'organisations-internationales-geneve-ou-habiter' AND coalesce(meta_description_en, '') = '';
-- G5 · assurance-sante-frontalier-lamal-cmu-budget · meta_description_fr : meta vide
UPDATE public.blog_posts SET meta_description_fr = $m$LAMal ou CMU-PUMa ? Ce que coûte chaque option selon ton salaire de frontalier à Genève, les pièges à éviter et l'effet sur ton budget logement.$m$, updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget' AND coalesce(meta_description_fr, '') = '';
-- G6 · cout-transport-frontalier-geneve-2026 · meta_description_fr : meta vide
UPDATE public.blog_posts SET meta_description_fr = $m$Voiture, Léman Express, vélo électrique ou covoiturage : ce que coûte vraiment le trajet France-Genève chaque mois en 2026, cinq scénarios comparés.$m$, updated_at = now()
WHERE slug = 'cout-transport-frontalier-geneve-2026' AND coalesce(meta_description_fr, '') = '';
-- G7 · teletravail-frontalier-geneve-regles-2026 · meta_description_fr : meta vide
UPDATE public.blog_posts SET meta_description_fr = $m$Les deux seuils 2026 (40 % fiscal, 49,9 % social) et leur impact réel : tout ce que tu dois savoir sur le télétravail quand tu es frontalier à Genève.$m$, updated_at = now()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026' AND coalesce(meta_description_fr, '') = '';
COMMIT;
-- Vérification : attendu 0 occurrence de l'ancien, N du nouveau
SELECT 'C1' AS id, (length(content_fr) - length(replace(content_fr, $m$Le coliving à 1 370 CHF $m$, ''))) / length($m$Le coliving à 1 370 CHF $m$) AS anciennes, (length(content_fr) - length(replace(content_fr, $m$Le coliving, dès 1 370 CHF, $m$, ''))) / length($m$Le coliving, dès 1 370 CHF, $m$) AS nouvelles FROM public.blog_posts WHERE slug = 'fiscalite-frontalier-geneve-impots-2026';
SELECT 'C2' AS id, (length(content_en) - length(replace(content_en, $m$Coliving at 1,370 CHF $m$, ''))) / length($m$Coliving at 1,370 CHF $m$) AS anciennes, (length(content_en) - length(replace(content_en, $m$Coliving, from 1,370 CHF, $m$, ''))) / length($m$Coliving, from 1,370 CHF, $m$) AS nouvelles FROM public.blog_posts WHERE slug = 'fiscalite-frontalier-geneve-impots-2026';
SELECT 'C3' AS id, (length(content_fr) - length(replace(content_fr, $m$Le coliving à 1 370 CHF $m$, ''))) / length($m$Le coliving à 1 370 CHF $m$) AS anciennes, (length(content_fr) - length(replace(content_fr, $m$Le coliving, dès 1 370 CHF, $m$, ''))) / length($m$Le coliving, dès 1 370 CHF, $m$) AS nouvelles FROM public.blog_posts WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';
SELECT 'C4' AS id, (length(content_en) - length(replace(content_en, $m$Coliving at 1,370 CHF $m$, ''))) / length($m$Coliving at 1,370 CHF $m$) AS anciennes, (length(content_en) - length(replace(content_en, $m$Coliving, from 1,370 CHF, $m$, ''))) / length($m$Coliving, from 1,370 CHF, $m$) AS nouvelles FROM public.blog_posts WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';
-- Vérification des metas (attendu ok = true, longueur ≤ 160)
SELECT 'G1' AS id, length(meta_description_fr) AS longueur, meta_description_fr = $m$Impôt à la source, déclaration en France, quasi-résident, 3e pilier : du brut au net réel du frontalier à Genève en 2026, calculs concrets à l'appui.$m$ AS ok FROM public.blog_posts WHERE slug = 'fiscalite-frontalier-geneve-impots-2026';
SELECT 'G2' AS id, length(meta_description_en) AS longueur, meta_description_en = $m$Withholding tax, French return, quasi-resident status, 3rd pillar: from gross to real net pay for a Geneva cross-border worker in 2026, with real figures.$m$ AS ok FROM public.blog_posts WHERE slug = 'fiscalite-frontalier-geneve-impots-2026';
SELECT 'G3' AS id, length(meta_description_fr) AS longueur, meta_description_fr = $m$ONU, OMS, CICR, CERN : chaque campus est à un endroit différent. Où habiter côté France selon ton organisation : trajet, budget, logement et bail adaptés.$m$ AS ok FROM public.blog_posts WHERE slug = 'organisations-internationales-geneve-ou-habiter';
SELECT 'G4' AS id, length(meta_description_en) AS longueur, meta_description_en = $m$UN, WHO, ICRC, CERN: each campus is in a different place. Where to live on the French side depending on your organisation: commute, budget and housing.$m$ AS ok FROM public.blog_posts WHERE slug = 'organisations-internationales-geneve-ou-habiter';
SELECT 'G5' AS id, length(meta_description_fr) AS longueur, meta_description_fr = $m$LAMal ou CMU-PUMa ? Ce que coûte chaque option selon ton salaire de frontalier à Genève, les pièges à éviter et l'effet sur ton budget logement.$m$ AS ok FROM public.blog_posts WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget';
SELECT 'G6' AS id, length(meta_description_fr) AS longueur, meta_description_fr = $m$Voiture, Léman Express, vélo électrique ou covoiturage : ce que coûte vraiment le trajet France-Genève chaque mois en 2026, cinq scénarios comparés.$m$ AS ok FROM public.blog_posts WHERE slug = 'cout-transport-frontalier-geneve-2026';
SELECT 'G7' AS id, length(meta_description_fr) AS longueur, meta_description_fr = $m$Les deux seuils 2026 (40 % fiscal, 49,9 % social) et leur impact réel : tout ce que tu dois savoir sur le télétravail quand tu es frontalier à Genève.$m$ AS ok FROM public.blog_posts WHERE slug = 'teletravail-frontalier-geneve-regles-2026';

-- Retour arrière (inverse exact, gardé) — décommenter pour l'exécuter
/*
BEGIN;
UPDATE public.blog_posts SET content_fr = replace(content_fr, $m$Le coliving, dès 1 370 CHF, $m$, $m$Le coliving à 1 370 CHF $m$), updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND (length(content_fr) - length(replace(content_fr, $m$Le coliving, dès 1 370 CHF, $m$, ''))) / length($m$Le coliving, dès 1 370 CHF, $m$) = 2
  AND position($m$Le coliving à 1 370 CHF $m$ IN content_fr) = 0;
UPDATE public.blog_posts SET content_en = replace(content_en, $m$Coliving, from 1,370 CHF, $m$, $m$Coliving at 1,370 CHF $m$), updated_at = now()
WHERE slug = 'fiscalite-frontalier-geneve-impots-2026'
  AND (length(content_en) - length(replace(content_en, $m$Coliving, from 1,370 CHF, $m$, ''))) / length($m$Coliving, from 1,370 CHF, $m$) = 2
  AND position($m$Coliving at 1,370 CHF $m$ IN content_en) = 0;
UPDATE public.blog_posts SET content_fr = replace(content_fr, $m$Le coliving, dès 1 370 CHF, $m$, $m$Le coliving à 1 370 CHF $m$), updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND (length(content_fr) - length(replace(content_fr, $m$Le coliving, dès 1 370 CHF, $m$, ''))) / length($m$Le coliving, dès 1 370 CHF, $m$) = 4
  AND position($m$Le coliving à 1 370 CHF $m$ IN content_fr) = 0;
UPDATE public.blog_posts SET content_en = replace(content_en, $m$Coliving, from 1,370 CHF, $m$, $m$Coliving at 1,370 CHF $m$), updated_at = now()
WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget'
  AND (length(content_en) - length(replace(content_en, $m$Coliving, from 1,370 CHF, $m$, ''))) / length($m$Coliving, from 1,370 CHF, $m$) = 4
  AND position($m$Coliving at 1,370 CHF $m$ IN content_en) = 0;
UPDATE public.blog_posts SET meta_description_fr = NULL, updated_at = now() WHERE slug = 'fiscalite-frontalier-geneve-impots-2026' AND meta_description_fr = $m$Impôt à la source, déclaration en France, quasi-résident, 3e pilier : du brut au net réel du frontalier à Genève en 2026, calculs concrets à l'appui.$m$;  -- G1 (les 7 metas étaient NULL avant le lot)
UPDATE public.blog_posts SET meta_description_en = NULL, updated_at = now() WHERE slug = 'fiscalite-frontalier-geneve-impots-2026' AND meta_description_en = $m$Withholding tax, French return, quasi-resident status, 3rd pillar: from gross to real net pay for a Geneva cross-border worker in 2026, with real figures.$m$;  -- G2 (les 7 metas étaient NULL avant le lot)
UPDATE public.blog_posts SET meta_description_fr = NULL, updated_at = now() WHERE slug = 'organisations-internationales-geneve-ou-habiter' AND meta_description_fr = $m$ONU, OMS, CICR, CERN : chaque campus est à un endroit différent. Où habiter côté France selon ton organisation : trajet, budget, logement et bail adaptés.$m$;  -- G3 (les 7 metas étaient NULL avant le lot)
UPDATE public.blog_posts SET meta_description_en = NULL, updated_at = now() WHERE slug = 'organisations-internationales-geneve-ou-habiter' AND meta_description_en = $m$UN, WHO, ICRC, CERN: each campus is in a different place. Where to live on the French side depending on your organisation: commute, budget and housing.$m$;  -- G4 (les 7 metas étaient NULL avant le lot)
UPDATE public.blog_posts SET meta_description_fr = NULL, updated_at = now() WHERE slug = 'assurance-sante-frontalier-lamal-cmu-budget' AND meta_description_fr = $m$LAMal ou CMU-PUMa ? Ce que coûte chaque option selon ton salaire de frontalier à Genève, les pièges à éviter et l'effet sur ton budget logement.$m$;  -- G5 (les 7 metas étaient NULL avant le lot)
UPDATE public.blog_posts SET meta_description_fr = NULL, updated_at = now() WHERE slug = 'cout-transport-frontalier-geneve-2026' AND meta_description_fr = $m$Voiture, Léman Express, vélo électrique ou covoiturage : ce que coûte vraiment le trajet France-Genève chaque mois en 2026, cinq scénarios comparés.$m$;  -- G6 (les 7 metas étaient NULL avant le lot)
UPDATE public.blog_posts SET meta_description_fr = NULL, updated_at = now() WHERE slug = 'teletravail-frontalier-geneve-regles-2026' AND meta_description_fr = $m$Les deux seuils 2026 (40 % fiscal, 49,9 % social) et leur impact réel : tout ce que tu dois savoir sur le télétravail quand tu es frontalier à Genève.$m$;  -- G7 (les 7 metas étaient NULL avant le lot)
COMMIT;
*/
