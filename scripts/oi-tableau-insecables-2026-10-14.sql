-- Tableau OI FR : espaces insecables (U+00A0) dans les milliers des lignes "Studio Geneve" et "Colocation Geneve"
-- (decision de Jerome du 14/10/2026 : sur mobile, "2 000-2 800 CHF" se coupait en plein nombre). Texte visible inchange.
-- Article : organisations-internationales-geneve-ou-habiter (content_fr). Etat AVANT : md5 8e3899fab0531df02148e47c257a3840 (sauvegarde 2026-10-14T09:23:28.726Z).
-- Etat APRES attendu : md5 6d5cd29b8a394ad20fa516d8289efe28. Idempotent (gardes strpos). SQL 100 % ASCII (U&'').
begin;
with e(o, n) as (values (U&'| Studio Gen\00E8ve (quartier des Nations) | 2 000-2 800 CHF |', U&'| Studio Gen\00E8ve (quartier des Nations) | 2\00A0000-2\00A0800 CHF |'))
update blog_posts b set content_fr = replace(b.content_fr, e.o, e.n), updated_at = now() from e
where b.slug = 'organisations-internationales-geneve-ou-habiter' and strpos(b.content_fr, e.o) > 0 and strpos(b.content_fr, e.n) = 0;
with e(o, n) as (values (U&'| Colocation Gen\00E8ve | 1 200-1 600 CHF |', U&'| Colocation Gen\00E8ve | 1\00A0200-1\00A0600 CHF |'))
update blog_posts b set content_fr = replace(b.content_fr, e.o, e.n), updated_at = now() from e
where b.slug = 'organisations-internationales-geneve-ou-habiter' and strpos(b.content_fr, e.o) > 0 and strpos(b.content_fr, e.n) = 0;
commit;
select slug, md5(content_fr) as fr from blog_posts where slug = 'organisations-internationales-geneve-ou-habiter';

-- ---------------------------------------------------------------------------
-- RETOUR ARRIERE (ne pas executer avec ce qui precede) : voir scripts/backups/oi-tableau-insecables-2026-10-14.retour-arriere.sql
