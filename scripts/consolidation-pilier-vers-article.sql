-- ════════════════════════════════════════════════════════════════════════
-- Consolidation « colocation geneve » — fusion pilier → article élu
-- Plan blog-conversion 07/07/2026 (WP4)
--
-- Google a élu /blog/trouver-colocation-geneve-frontalier (pos 9,3, page 1)
-- contre le pilier FR /colocation-geneve (pos 44,8, 6 impressions). Côté code
-- (branche feat/blog-conversion) : 308 vercel.json + Navigate SPA + maillage
-- interne rerouté. Ce SQL fait la part CONTENU :
--   1. l'article cesse de pointer vers le pilier FR (3 liens → /nos-maisons,
--      sinon ils bouclent sur la redirection) ; les 2 liens EN restent (le
--      pilier EN est conservé) ;
--   2. fusion du contenu utile du pilier : 3 Q/R de sa FAQ (texte identique
--      au composant colocationGeneveFaq.ts) ajoutées en section « Questions
--      fréquentes » → alimente aussi le JSON-LD FAQPage automatiquement.
--      Registre « tu » = celui de l'article existant (cohérence interne).
--
-- Ancrages REPLACE : sous-chaînes 100 % ASCII (pattern éprouvé anti-mojibake).
-- ⚠️ À exécuter au moment du déploiement code (pas avant : les liens
--    /nos-maisons sont corrects dans les deux mondes, mais la FAQ ne doit
--    apparaître qu'une fois — ne PAS exécuter deux fois ce script).
-- ════════════════════════════════════════════════════════════════════════

-- ── 1. FR : les 3 liens vers le pilier deviennent des liens offre ────────
UPDATE blog_posts SET content_fr = REPLACE(
  content_fr,
  '](/colocation-geneve)',
  '](/nos-maisons)'
) WHERE slug = 'trouver-colocation-geneve-frontalier';

-- ── 2. FR : FAQ fusionnée depuis le pilier, insérée avant « En résumé » ──
UPDATE blog_posts SET content_fr = REPLACE(
  content_fr,
  $a$
## En r$a$,
  $b$
## Questions fréquentes sur la colocation à Genève

**Où trouver une colocation près de Genève ?**

La Villa Coliving propose des chambres en colocation tout inclus dans trois maisons situées à 20 minutes du centre de Genève, côté France : à Ville-la-Grand, Ambilly et Annemasse. Chaque maison accueille 7 à 12 résidents et dispose d'une piscine, d'un sauna et d'une salle de sport. À partir de 1 380 CHF/mois.

**Pourquoi habiter côté français plutôt qu'à Genève ?**

Habiter côté français près de Genève, comme à La Villa Coliving, permet un loyer et des frais de vie nettement plus accessibles qu'au centre de Genève, tout en restant à 20 minutes en transports. Tu profites d'une chambre meublée tout inclus dès 1 380 CHF/mois, avec piscine, sauna et salle de sport, dans une maison à taille humaine.

**Proposez-vous des colocations meublées à Genève ?**

Oui. Chez La Villa Coliving, chaque chambre est privée et entièrement meublée (lit, bureau, rangements), et tous les espaces communs le sont aussi. Tu emménages avec ta valise : pas de meubles à acheter, pas d'IKEA à monter. C'est une colocation meublée tout inclus, à 20 minutes du centre de Genève côté France, dès 1 380 CHF/mois.

## En r$b$
) WHERE slug = 'trouver-colocation-geneve-frontalier';

-- ── 3. EN : FAQ équivalente avant « In short » (liens EN → pilier EN conservés) ──
UPDATE blog_posts SET content_en = REPLACE(
  content_en,
  $a$
## In short$a$,
  $b$
## Frequently asked questions

**Where to find shared housing near Geneva?**

La Villa Coliving offers all-inclusive shared rooms in three houses located 20 minutes from Geneva city center, on the French side: in Ville-la-Grand, Ambilly and Annemasse. Each house hosts 7 to 12 residents and has a pool, a sauna and a gym. From CHF 1,380/month.

**Why live on the French side rather than in Geneva?**

Living on the French side near Geneva, like at La Villa Coliving, means significantly more affordable rent and living costs than central Geneva, while staying 20 minutes away by public transport. You enjoy an all-inclusive furnished room from CHF 1,380/month, with a pool, sauna and gym, in a human-scale house.

**Do you offer furnished shared housing in Geneva?**

Yes. At La Villa Coliving, every room is private and fully furnished (bed, desk, storage), and all common areas are too. You move in with your suitcase: no furniture to buy, no IKEA to assemble. It's all-inclusive furnished shared housing, 20 minutes from Geneva city center on the French side, from CHF 1,380/month.

## In short$b$
) WHERE slug = 'trouver-colocation-geneve-frontalier';

UPDATE blog_posts SET updated_at = NOW()
WHERE slug = 'trouver-colocation-geneve-frontalier';

-- ── Vérifications ─────────────────────────────────────────────────────────
SELECT
  (content_fr LIKE '%](/colocation-geneve)%')                          AS fr_lien_pilier_reste_doit_etre_false,
  (content_fr LIKE '%](/nos-maisons)%')                                AS fr_liens_offre_ok,
  (content_fr LIKE '%Questions fr%quentes sur la colocation%')         AS fr_faq_ok,
  (content_en LIKE '%](/en/colocation-geneve)%')                       AS en_pilier_conserve_ok,
  (content_en LIKE '%Frequently asked questions%')                     AS en_faq_ok,
  LENGTH(content_fr) AS chars_fr, LENGTH(content_en) AS chars_en
FROM blog_posts WHERE slug = 'trouver-colocation-geneve-frontalier';
