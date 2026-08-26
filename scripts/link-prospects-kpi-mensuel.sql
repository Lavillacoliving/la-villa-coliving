-- ════════════════════════════════════════════════════════════════════════
-- link_prospects — KPI mensuel pour le bulletin (Brief n°2, Chantier 4c — 21/08/2026)
-- À lancer dans le SQL Editor (ou par n8n via la RPC bulletin si on l'y ajoute plus tard).
-- Fenêtre par défaut = le mois civil précédent ; remplacer :mois si besoin.
-- Cible du plan : 35-50 domaines référents à 6 mois, dont 15-20 dofollow thématiques.
-- ⚠️ « Trafic référent → candidatures » : Supabase ne connaît pas le referrer (le formulaire
--    transmet un canal DÉCLARÉ). Le bloc (b) ci-dessous est un PROXY ; le vrai croisement
--    se fait côté GA4 (sonde n8n) : sessionSource/sessionMedium = referral × form_submit.
-- ════════════════════════════════════════════════════════════════════════

with p as (
  select date_trunc('month', now() - interval '1 month')::date as debut,
         date_trunc('month', now())::date                       as fin
)
select
  -- ── liens obtenus
  (select count(distinct lower(domain)) from public.link_prospects, p
     where status = 'live' and live_at >= p.debut and live_at < p.fin)                                        as rd_nouveaux_mois,
  (select count(distinct lower(domain)) from public.link_prospects, p
     where status = 'live' and live_at >= p.debut and live_at < p.fin
       and coalesce(rel_nofollow,false) = false and thematique)                                                as dofollow_thematiques_mois,
  (select count(distinct lower(domain)) from public.link_prospects where status = 'live')                     as rd_live_cumul,
  (select count(distinct lower(domain)) from public.link_prospects
     where status = 'live' and coalesce(rel_nofollow,false) = false and thematique)                           as dofollow_thematiques_cumul,
  (select count(*) from public.link_prospects where status = 'live' and rel_nofollow)                        as liens_nofollow_cumul,
  -- ── pipeline
  (select count(*) from public.link_prospects where status = 'a_contacter')                                   as a_contacter,
  (select count(*) from public.link_prospects where status in ('envoye','relance'))                           as en_attente_reponse,
  (select count(*) from public.link_prospects where status in ('envoye','relance') and followup_at <= current_date) as relances_dues,
  (select count(*) from public.link_prospects where status = 'en_discussion')                                 as en_discussion,
  (select round(100.0 * count(*) filter (where replied_at is not null)
               / nullif(count(*) filter (where sent_at is not null), 0), 0)
     from public.link_prospects)                                                                              as taux_reponse_pct,
  -- ── hygiène
  (select count(*) from public.link_prospects
     where status = 'live' and (last_checked_at is null or last_checked_at < now() - interval '60 days'))    as live_non_reverifies_60j;

-- Distribution des ancres des liens live vs 40 % marque / 25 % URL nue / 25 % générique / 10 % exact
select coalesce(anchor_class, 'non renseigné') as anchor_class, count(*) as n,
       round(100.0 * count(*) / nullif(sum(count(*)) over (), 0), 0) as pct
from public.link_prospects where status = 'live'
group by 1 order by n desc;

-- Liens live par type (lecture « où vient l'autorité »)
select type, count(*) as live, count(*) filter (where coalesce(rel_nofollow,false) = false) as dofollow
from public.link_prospects where status = 'live' group by 1 order by live desc;

-- (b) PROXY Supabase « acquisition → candidatures » (canal DÉCLARÉ, hors tests) — mois précédent
with p as (select date_trunc('month', now() - interval '1 month') as debut, date_trunc('month', now()) as fin)
select coalesce(source, '∅') as canal_declare, count(*) as candidatures
from public.prospects, p
where not is_test and created_at >= p.debut and created_at < p.fin
group by 1 order by 2 desc;

-- (a) GA4 (sonde n8n UjjxjZ4IiKU5o4P9 — hors SQL) : runReport propriété 523627625,
--     dimensions sessionSource, sessionMedium, eventName ; metrics eventCount ;
--     filtres eventName = 'form_submit' et sessionMedium = 'referral' ; fenêtre = mois précédent.
--     Joindre manuellement sessionSource aux `domain` live de link_prospects.
