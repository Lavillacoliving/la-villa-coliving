-- ════════════════════════════════════════════════════════════════════════
-- Title / meta blog — mining GSC mode sonde (Brief n°2, Chantier 1) — GO Jérôme 21/08/2026
-- Source : PROPOSITIONS_TITLE_META_2026-08-21.md (hors repo) ; données Search Console 21/05 → 18/08/2026.
-- title_fr / title_en = <title> ET H1 de l'article (BlogPostPage.tsx) ; meta_description_* = <meta name="description">.
-- Visible par Google au prochain prérendu (GitHub Action prerender.yml, tous les jours 5h UTC) — aucun push main nécessaire.
-- Mesure : bulletin J+14 / J+28 (FR+CH) — CTR « ville frontière suisse pas cher » ≥ 1,4 % sur 28 j = succès page 1.
-- Exécuté via MCP Supabase execute_sql le 21/08/2026. Rollback : bloc en bas (anciennes valeurs exactes).
-- ════════════════════════════════════════════════════════════════════════

-- 1. ou-habiter… (FR) — 2 304 impr FR+CH · CTR 0,8 % vs 1,9 % attendu · « ville frontière suisse pas cher » 867 impr pos 8,5
update public.blog_posts set
  title_fr = 'Ville frontière suisse pas chère : 7 villes côté France (2026)',
  meta_description_fr = 'Où habiter quand on travaille à Genève ? Les 7 villes frontalières suisses les moins chères côté France : loyers réels 600-1 100 €, temps de trajet, impôts (2026).'
where slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher';

-- 1b. ou-habiter… (EN) — 204 impr FR+CH · pos 7,5 · « french cities/towns near geneva »
update public.blog_posts set
  title_en = 'French Towns Near Geneva: 7 Best Places to Live (2026)',
  meta_description_en = 'The 7 closest French towns to Geneva for cross-border workers — real rents, commute times, taxes. Annemasse, Gaillard, Saint-Julien and more (2026).'
where slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher';

-- 2. quartiers-annemasse… (front CONQUÊTE) — « quartier annemasse » 85 impr pos 4,8 · « vivre à annemasse » 67 impr pos 16,6 · 0 clic
update public.blog_posts set
  title_fr = 'Vivre à Annemasse : quel quartier choisir selon ton profil ?'
where slug = 'quartiers-annemasse-ou-vivre-selon-profil';

-- 3. cout-de-la-vie… — « prix de la vie en suisse vs france » 72 impr pos 9,4 · 0 clic
update public.blog_posts set
  title_fr = 'Coût de la vie Suisse vs France 2026 : prix, loyers, salaires'
where slug = 'cout-de-la-vie-suisse-france-frontalier-2026';

-- Contrôle
select slug, title_fr, title_en, meta_description_fr, meta_description_en, updated_at
from public.blog_posts
where slug in ('ou-habiter-frontalier-suisse-villes-france-pas-cher','quartiers-annemasse-ou-vivre-selon-profil','cout-de-la-vie-suisse-france-frontalier-2026')
order by slug;

-- ───────────────────────── ROLLBACK (valeurs lues le 21/08/2026 avant modification) ─────────────────────────
-- update public.blog_posts set title_fr = 'Top 7 villes frontalières suisses 2026', meta_description_fr = null,
--   title_en = 'Where to Live as a Geneva Cross-Border Worker? 7 Towns',
--   meta_description_en = 'Working in Geneva and looking for housing on the French side? 2026 comparison of the 7 cheapest border towns: rents, transport, taxes.'
-- where slug = 'ou-habiter-frontalier-suisse-villes-france-pas-cher';
-- update public.blog_posts set title_fr = 'Quartiers d''Annemasse : où vivre selon ton profil' where slug = 'quartiers-annemasse-ou-vivre-selon-profil';
-- update public.blog_posts set title_fr = 'Coût de la vie Suisse vs France 2026' where slug = 'cout-de-la-vie-suisse-france-frontalier-2026';
