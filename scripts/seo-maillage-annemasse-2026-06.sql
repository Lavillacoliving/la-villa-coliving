-- ============================================================
-- VOLET A2 — Maillage vers les money pages locales Annemasse (ORPHELINES)
-- Date : 2026-06-11 (v2, corrigé après revue adversariale)
-- Projet Supabase : tefpynkdxxfiefpkgitz  (⚠️ vérifie le projet)
--
-- ⚠️ ORDRE D'EXÉCUTION IMPORTANT :
--   1. D'ABORD merger/déployer la branche seo/volet-a-conversion (elle contient
--      la localisation /en des liens markdown — sinon les pages EN pré-rendues
--      enverront les lecteurs anglophones vers les pages FR).
--   2. PUIS lancer ce script.
--   3. PUIS re-déclencher l'Action « Pre-render & Deploy ».
--
-- CONSTAT (audit du 11/06 sur les 40 articles publiés) : AUCUN article ne lie
-- /annemasse-colocation ni /chambre-a-louer-annemasse. Or « colocation
-- annemasse » = keyword local #1 (880/mois) et ces 2 pages money plafonnent.
--
-- 2 CAS distincts (la revue a détecté que 4 articles ont DÉJÀ un footer 👉
-- pilier — on FUSIONNE au lieu d'empiler 2 blocs promo) :
--   PARTIE A : APPEND simple sur les 6 articles sans footer existant.
--   PARTIE B : REPLACE du footer pilier existant par un footer FUSIONNÉ
--              (pilier + Annemasse, prix cité une seule fois) sur les 4 autres.
--              Bonus : corrige au passage le footer en vouvoiement de
--              meilleurs-quartiers (seul resté en « Vous cherchez »).
-- Idempotent : re-lançable sans doublon (gardes NOT LIKE + REPLACE non re-matchable).
--
-- Lancer : Supabase → SQL Editor → New query → coller → Run.
-- ============================================================

-- ─── ÉTAPE 1 : APERÇU ───
SELECT slug,
       (content_fr LIKE '%(/annemasse-colocation)%')                                    AS lien_annemasse_deja,
       (content_fr LIKE '%👉 **Tu cherches une [colocation à Genève](/colocation-geneve) ?**%') AS footer_pilier_v2,
       (content_fr LIKE '%👉 **Vous cherchez une [colocation à Genève](/colocation-geneve) ?**%') AS footer_pilier_v1_vous
FROM blog_posts
WHERE is_published = true AND slug IN (
  'temps-trajet-annemasse-geneve-par-quartier',
  'transport-annemasse-geneve-leman-express',
  'espaces-verts-coliving-lodge-annemasse',
  'coliving-frais-dossier-geneve-annemasse',
  'cout-transport-frontalier-geneve-2026',
  'coliving-transfrontalier-geneve-annemasse-nouvelle-vie',
  'chambre-meublee-annemasse-geneve',
  'colocation-annemasse-ville-la-grand-ambilly',
  'coliving-annemasse-geneve-frontaliers-avantages',
  'meilleurs-quartiers-frontaliers-geneve'
)
ORDER BY slug;

-- ─── PARTIE A : APPEND sur les 6 articles SANS footer existant ───
UPDATE blog_posts SET
  content_fr = COALESCE(content_fr, '') ||
    E'\n\n---\n\n👉 **Tu vises Annemasse et ses alentours ?** Découvre la [colocation à Annemasse](/annemasse-colocation) ou nos [chambres à louer à Annemasse](/chambre-a-louer-annemasse) — tout inclus dès 1 380 CHF/mois.',
  content_en = COALESCE(content_en, '') ||
    E'\n\n---\n\n👉 **Thinking of living in Annemasse or nearby?** Check out [shared housing in Annemasse](/annemasse-colocation) or our [rooms for rent in Annemasse](/chambre-a-louer-annemasse) — all-inclusive from CHF 1,380/month.'
WHERE is_published = true
  AND slug IN (
    'temps-trajet-annemasse-geneve-par-quartier',
    'transport-annemasse-geneve-leman-express',
    'espaces-verts-coliving-lodge-annemasse',
    'coliving-frais-dossier-geneve-annemasse',
    'cout-transport-frontalier-geneve-2026',
    'coliving-transfrontalier-geneve-annemasse-nouvelle-vie'
  )
  AND content_fr NOT LIKE '%(/annemasse-colocation)%';

-- ─── PARTIE B1 : FUSION du footer v2 (tutoiement) — 3 articles ───
-- Remplace le footer pilier existant par un footer combiné pilier+Annemasse.
UPDATE blog_posts SET
  content_fr = REPLACE(content_fr,
    E'👉 **Tu cherches une [colocation à Genève](/colocation-geneve) ?** 29 chambres tout inclus dès 1 380 CHF/mois — charges, fibre, ménage comprises. Sans frais de dossier.',
    E'👉 **Tu cherches une [colocation à Genève](/colocation-geneve) ou une [colocation à Annemasse](/annemasse-colocation) ?** 29 chambres tout inclus dès 1 380 CHF/mois — voir aussi nos [chambres à louer à Annemasse](/chambre-a-louer-annemasse). Sans frais de dossier.'),
  content_en = REPLACE(content_en,
    E'👉 **Looking for [shared housing near Geneva](/colocation-geneve)?** 29 all-inclusive rooms from CHF 1,380/month — utilities, fiber and cleaning included. No application fee.',
    E'👉 **Looking for [shared housing near Geneva](/colocation-geneve) or [in Annemasse](/annemasse-colocation)?** 29 all-inclusive rooms from CHF 1,380/month — see also our [rooms for rent in Annemasse](/chambre-a-louer-annemasse). No application fee.')
WHERE is_published = true
  AND slug IN (
    'chambre-meublee-annemasse-geneve',
    'colocation-annemasse-ville-la-grand-ambilly',
    'coliving-annemasse-geneve-frontaliers-avantages'
  )
  AND content_fr NOT LIKE '%(/annemasse-colocation)%';

-- ─── PARTIE B2 : FUSION du footer v1 (vouvoiement) — meilleurs-quartiers ───
-- Remplace l ancien footer « Vous cherchez… Découvrez » (seul resté en vous)
-- par le même footer fusionné en tutoiement que les 3 autres.
UPDATE blog_posts SET
  content_fr = REPLACE(content_fr,
    E'👉 **Vous cherchez une [colocation à Genève](/colocation-geneve) ?** Découvrez nos 3 maisons tout inclus dès 1 380 CHF/mois.',
    E'👉 **Tu cherches une [colocation à Genève](/colocation-geneve) ou une [colocation à Annemasse](/annemasse-colocation) ?** 29 chambres tout inclus dès 1 380 CHF/mois — voir aussi nos [chambres à louer à Annemasse](/chambre-a-louer-annemasse). Sans frais de dossier.'),
  content_en = REPLACE(content_en,
    E'👉 **Looking for [shared housing near Geneva](/colocation-geneve)?** Discover our 3 all-inclusive houses from CHF 1,380/month.',
    E'👉 **Looking for [shared housing near Geneva](/colocation-geneve) or [in Annemasse](/annemasse-colocation)?** 29 all-inclusive rooms from CHF 1,380/month — see also our [rooms for rent in Annemasse](/chambre-a-louer-annemasse). No application fee.')
WHERE is_published = true
  AND slug = 'meilleurs-quartiers-frontaliers-geneve'
  AND content_fr NOT LIKE '%(/annemasse-colocation)%';

-- ─── ÉTAPE 3 : CONTRÔLE — les 10 doivent pointer vers les 2 pages locales,
--                et AUCUN ne doit avoir 2 blocs 👉 empilés ───
SELECT slug,
       (content_fr LIKE '%(/annemasse-colocation)%')          AS lien_annemasse_ok,
       (content_fr LIKE '%(/chambre-a-louer-annemasse)%')     AS lien_chambre_ok,
       (content_en LIKE '%(/annemasse-colocation)%')          AS lien_en_ok,
       (LENGTH(content_fr) - LENGTH(REPLACE(content_fr,'👉',''))) / LENGTH('👉') AS nb_blocs_fr
FROM blog_posts
WHERE is_published = true AND slug IN (
  'temps-trajet-annemasse-geneve-par-quartier',
  'transport-annemasse-geneve-leman-express',
  'espaces-verts-coliving-lodge-annemasse',
  'coliving-frais-dossier-geneve-annemasse',
  'cout-transport-frontalier-geneve-2026',
  'coliving-transfrontalier-geneve-annemasse-nouvelle-vie',
  'chambre-meublee-annemasse-geneve',
  'colocation-annemasse-ville-la-grand-ambilly',
  'coliving-annemasse-geneve-frontaliers-avantages',
  'meilleurs-quartiers-frontaliers-geneve'
)
ORDER BY slug;
-- Attendu : tous lien_annemasse_ok = true, et nb_blocs_fr = 1 partout
-- (sauf si un article a légitimement un autre 👉 dans son corps).
