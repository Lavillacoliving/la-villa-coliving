-- Lecture « qualité » du Lot A (brief « Formulaire, hydratation, mesure », 30/09/2026) — LECTURE SEULE.
-- Question : les candidatures gagnées en allégeant le formulaire sont-elles de moindre qualité ?
-- Mesure : taux de visite des candidatures d'octobre contre celles de septembre.
--
-- PRÉREQUIS EXPLICITE : les statuts des prospects ne sont pas tenus au fil de l'eau (Fanny travaille
-- depuis ses emails, pas depuis le dashboard ; 11 candidatures de septembre étaient encore « new »
-- au 30/09). AVANT la lecture, Jérôme renseigne « visite oui/non » pour septembre et octobre.
-- Sans cela, la ligne « qualité » de la lecture J+28 est vide.

-- 1. Fiches à mettre à jour : candidatures réelles de septembre et d'octobre dont le statut ne dit
--    pas encore si une visite a eu lieu (ni visite / contrat / signé, ni perdu / ne pas contacter).
select id,
       created_at::date as candidature,
       first_name,
       last_name,
       email,
       status,
       source
from prospects
where created_at >= '2026-09-01' and created_at < '2026-11-01'
  and not is_test
  and not coalesce(tags @> array['doublon_fusionne']::text[], false)
  and status not in ('visit_scheduled', 'visit_done', 'contract_sent', 'signed', 'lost', 'do_not_contact')
order by created_at;

-- 2. Lecture, une fois la liste 1 vide (en_cours ≈ 0 attendu sur les deux mois) :
--    qualifies = visite programmée ou faite, contrat envoyé, signé (cf. reporting.v_prospects_mois).
select mois, prospects, qualifies, taux_qualification_pct, en_cours
from reporting.v_prospects_mois
where mois in ('2026-09', '2026-10')
order by mois;
