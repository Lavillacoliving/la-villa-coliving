-- Lot 1a (Brief Conversion V2, 29/08/2026) — idempotence des soumissions de candidature.
-- Le front (livré avec le lot 1b) génère un uuid v4 en sessionStorage au premier clic
-- submit et le réutilise tant que le succès n'est pas reçu ; l'edge v15 l'écrit ici.
-- Un re-POST avec la même clé = violation d'unicité 23505 → no-op côté edge qui
-- re-renvoie le succès SANS ré-envoyer d'emails ni recréer de prospect.
-- NULL autorisé : ancien front sans clé, et tout l'historique.
-- Contexte chiffré : 4 clusters de double-soumission + 2 échecs d'insert en 2 mois
-- (audit du 28/08, revérifié en SQL le 29/08).
alter table public.form_submissions
  add column if not exists submission_key uuid unique;

comment on column public.form_submissions.submission_key is
  'Clé d''idempotence posée par le front (uuid v4, sessionStorage, edge v15+). Unique ; NULL pour les soumissions sans clé (historique, ancien front).';
