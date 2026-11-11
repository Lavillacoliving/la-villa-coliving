/**
 * Annexe A du bail v3 — catalogue des prestations incluses, version 2026-10 (relectures de Jérôme des 28 et 29/10/2026 :
 * plus de box dîner, plus de plateforme numérique, preuves = contrats et factures ; pas de colonne « critère TVA »).
 * Source unique pour les maquettes (tools/bail-v3), le générateur (seed de services_catalog) et les tests.
 * Une ligne par prestation : libellé, fréquence et modalités, exécutant, preuve conservée par le Bailleur (article IX, 9.4).
 */
export interface BailService { service: string; frequency: string; provider: string; evidence: string }

export const BAIL_SERVICES_VERSION = "2026-10";

export const BAIL_SERVICES: readonly BailService[] = [
  { service: "Entretien et nettoyage des parties communes intérieures (cuisines, salle à manger, salons, buanderie, sanitaires communs, circulations)", frequency: "3 interventions par semaine, jours fixes", provider: "Entreprise de propreté (contrat annuel)", evidence: "Contrat, factures mensuelles" },
  { service: "Entretien des extérieurs : jardin, piscine, élagage", frequency: "Jardin : passages réguliers en saison, élagage annuel ; piscine : entretien en saison, analyse de l'eau, hivernage", provider: "Jardinier, pisciniste (contrats)", evidence: "Contrats, factures" },
  { service: "Sauna, salle de sport, électroménager, chaudière : maintenance et dépannage", frequency: "Maintenance préventive annuelle, dépannage", provider: "Prestataires spécialisés", evidence: "Contrats, factures" },
  { service: "Consommables des parties communes (papier toilette, essuie-tout, lessive, produits d'entretien)", frequency: "Panier mensuel, réassort à la demande", provider: "Bailleur (achats)", evidence: "Factures, bon de livraison" },
  { service: "Connectivité : fibre très haut débit, Wi-Fi dans toute la maison", frequency: "Continu", provider: "Opérateur", evidence: "Contrat, factures" },
  { service: "Animation communautaire : au moins un événement par mois", frequency: "Mensuel", provider: "Bailleur, fournisseurs", evidence: "Factures" },
  { service: "Cours de yoga", frequency: "Mensuel, sur place", provider: "Intervenant indépendant (contrat de prestation)", evidence: "Contrat, factures" },
  { service: "Coaching sportif (remise en forme)", frequency: "Mensuel", provider: "Intervenant indépendant", evidence: "Contrat, factures" },
  { service: "Assistance et dépannage : canal WhatsApp dédié, réponse sous 48 h ouvrées, organisation des interventions", frequency: "Continu", provider: "Bailleur", evidence: "Journal horodaté des demandes" },
  { service: "Gestion de la communauté : comité d'accueil, plateforme numérique (états des lieux, règlement, calendrier), sélection participative des nouveaux colocataires", frequency: "À chaque départ et en continu", provider: "Bailleur et résidents", evidence: "Comptes rendus, historique de la plateforme" },
  { service: "Kit linge : parure de lit et serviette mises à disposition à l'entrée, restituées à la sortie, jamais renouvelées ni blanchies", frequency: "À l'entrée", provider: "Bailleur", evidence: "État des lieux d'entrée (Etadly)" },
  { service: "Exclus : nettoyage des chambres et salles d'eau privatives (même en option), renouvellement et blanchissage du linge, petit déjeuner et restauration, permanence d'accueil", frequency: "—", provider: "—", evidence: "Liste négative à l'article IX, 9.3" },
];
