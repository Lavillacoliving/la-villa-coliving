-- ════════════════════════════════════════════════════════════════════════
-- CORRECTIF P0b — Précision « dès le 1er jour » (article télétravail)
-- Date : 2026-06-08
-- Slug : teletravail-frontalier-geneve-regles-2026
-- ────────────────────────────────────────────────────────────────────────
-- POURQUOI : la 1re version disait qu'au-delà de 40 %, seule « la part
-- excédentaire » était imposable en France. La source officielle ge.ch précise
-- l'inverse : « Au-delà de 40 %, la part de salaire liée au télétravail est
-- imposable en France DÈS LE 1er JOUR de télétravail » (pas seulement l'excédent).
-- On corrige les 2 passages concernés (FR + EN). Précision factuelle.
-- ════════════════════════════════════════════════════════════════════════

-- ─── Spot 1 : section « L'impact fiscal du télétravail » ───
UPDATE blog_posts SET
  content_fr = REPLACE(content_fr,
    $o$Au-delà de 40 %, les jours télétravaillés depuis la France redeviennent imposables en France pour la part excédentaire, et la convention fiscale franco-suisse joue alors son mécanisme de crédit d'impôt pour éviter la double imposition.$o$,
    $n$Au-delà de 40 %, la part de votre salaire correspondant aux jours télétravaillés depuis la France devient imposable en France — et ce dès le premier jour télétravaillé, pas seulement pour la fraction au-delà de 40 %. La convention fiscale franco-suisse joue alors son mécanisme de crédit d'impôt pour éviter la double imposition.$n$),
  content_en = REPLACE(content_en,
    $oe$Beyond 40%, the days teleworked from France become taxable again in France for the excess portion, and the Franco-Swiss tax treaty then applies its tax-credit mechanism to avoid double taxation.$oe$,
    $ne$Beyond 40%, the portion of your salary corresponding to teleworked days from France becomes taxable in France — and from the very first teleworked day, not only for the fraction above 40%. The Franco-Swiss tax treaty then applies its tax-credit mechanism to avoid double taxation.$ne$),
  updated_at = NOW()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026';

-- ─── Spot 2 : section « Ce qui nécessite une vigilance » ───
UPDATE blog_posts SET
  content_fr = REPLACE(content_fr,
    $o$Vous dépassez aussi le seuil fiscal de 40 % : les jours travaillés en France au-delà de la limite deviennent imposables en France.$o$,
    $n$Vous dépassez aussi le seuil fiscal de 40 % : la part de salaire liée à vos jours de télétravail devient alors imposable en France, dès le premier jour.$n$),
  content_en = REPLACE(content_en,
    $oe$You also exceed the 40% tax threshold: days worked in France beyond the limit become taxable in France.$oe$,
    $ne$You also exceed the 40% tax threshold: the salary tied to your teleworked days then becomes taxable in France, from the very first day.$ne$),
  updated_at = NOW()
WHERE slug = 'teletravail-frontalier-geneve-regles-2026';

-- ─── Vérification (ancien=false attendu) ───
SELECT
  (content_fr LIKE '%pour la part excédentaire%') AS fr_vieux1,  -- false
  (content_fr LIKE '%au-delà de la limite deviennent%') AS fr_vieux2,  -- false
  (content_fr LIKE '%dès le premier jour%') AS fr_nouveau,  -- true
  (content_en LIKE '%for the excess portion%') AS en_vieux1,  -- false
  (content_en LIKE '%from the very first%') AS en_nouveau  -- true
FROM blog_posts WHERE slug = 'teletravail-frontalier-geneve-regles-2026';
