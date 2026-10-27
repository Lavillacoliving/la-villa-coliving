/**
 * Deux cas de maquette du bail v3 (27/10/2026) : La Villa 2 (indivision Austin-Piot) et Le Lodge 1 (SCI Sleep In).
 * Locataire fictif. Les crochets signalent une donnée à compléter par Jérôme. Données : recon du 26/10/2026.
 */
import type { LeaseV3Input, ServiceLine } from "@/lib/bailV3/clauses";

export const ANNEXE_A: ServiceLine[] = [
  { service: "Entretien et nettoyage des parties communes intérieures (cuisines, salle à manger, salons, buanderie, sanitaires communs, circulations)", frequency: "3 interventions par semaine, jours fixes affichés", provider: "Entreprise de propreté (contrat annuel)", evidence: "Contrat, factures mensuelles, feuilles de passage", criterion: "Parties communes seulement, jamais le local privatif ; si l'administration le comptait : 2e critère au plus" },
  { service: "Entretien des extérieurs : jardin, piscine, élagage", frequency: "Jardin : passages réguliers en saison, élagage annuel ; piscine : entretien hebdomadaire en saison, analyse de l'eau, hivernage", provider: "Jardinier, pisciniste (contrats)", evidence: "Contrats, carnet sanitaire, factures", criterion: "Non" },
  { service: "Sauna, salle de sport, électroménager, chaudière : maintenance et dépannage", frequency: "Maintenance préventive annuelle, dépannage sous 48 h ouvrées", provider: "Prestataires spécialisés", evidence: "Contrats, factures, tickets d'intervention", criterion: "Non" },
  { service: "Consommables des parties communes (papier toilette, essuie-tout, lessive, produits d'entretien)", frequency: "Panier mensuel, réassort à la demande", provider: "Bailleur (achats)", evidence: "Factures, bon de livraison ou photo datée", criterion: "Non" },
  { service: "Connectivité : fibre très haut débit, Wi-Fi dans toute la maison", frequency: "Continu", provider: "Opérateur", evidence: "Contrat, factures", criterion: "Non" },
  { service: "Animation communautaire : au moins un événement par mois ; box pour un dîner communautaire mensuel", frequency: "Mensuel", provider: "Bailleur, fournisseurs", evidence: "Calendrier publié, factures, photos datées, liste des participants", criterion: "Non (ni petit déjeuner, ni restauration)" },
  { service: "Cours de yoga", frequency: "Mensuel, sur place", provider: "Intervenant indépendant (contrat de prestation)", evidence: "Contrat, factures, planning, émargement", criterion: "Non" },
  { service: "Coaching sportif (remise en forme)", frequency: "Mensuel", provider: "Intervenant indépendant", evidence: "Contrat, factures, planning", criterion: "Non" },
  { service: "Assistance et dépannage : canal WhatsApp dédié, réponse sous 48 h ouvrées, organisation des interventions", frequency: "Continu", provider: "Bailleur", evidence: "Journal horodaté des demandes, tickets", criterion: "Réception « même non personnalisée » : comptée comme acquise" },
  { service: "Gestion de la communauté : comité d'accueil, plateforme numérique (états des lieux, règlement, calendrier), sélection participative des nouveaux colocataires", frequency: "À chaque départ et en continu", provider: "Bailleur et résidents", evidence: "Comptes rendus, historique de la plateforme", criterion: "Idem" },
  { service: "Kit linge : parure de lit et serviette mises à disposition à l'entrée, restituées à la sortie, jamais renouvelées ni blanchies", frequency: "À l'entrée", provider: "Bailleur", evidence: "État des lieux d'entrée (Etadly)", criterion: "Linge sans renouvellement : non caractérisé (BOI-TVA-CHAMP-10-10-50-20 § 90)" },
  { service: "Exclus : nettoyage des chambres et salles d'eau privatives (même en option), renouvellement et blanchissage du linge, petit déjeuner et restauration, permanence d'accueil", frequency: "—", provider: "—", evidence: "Liste négative à l'article IX, 9.3", criterion: "Les autres critères restent à zéro" },
];

const VAT = "Loyers et charges non soumis à la TVA (article 261 D 4° du CGI)";
const MAQUETTE = "Maquette du 27 octobre 2026 — locataire fictif, données à confirmer entre crochets — ne pas signer";

const tenant = {
  first_name: "Camille", last_name: "Exemple", dob: "1995-03-14", birthplace: "Lyon (69)", nationality: "française",
  previous_address: "12 rue de la République, 69002 Lyon", email: "camille.exemple@example.com", phone: "+33 6 00 00 00 00",
  profession: "ingénieure", employer: "[employeur à Genève]",
};

export const CASES: Record<string, LeaseV3Input> = {
  LaVilla_2_indivision: {
    maquette: MAQUETTE,
    entity: {
      legal_form: "indivision", legal_name: "Indivision Austin-Piot", trade_name: "La Villa Coliving",
      registration: "SIRET 898 236 518 00012", capital_eur: null, siege: "34 rue du Foron, 74100 Ville-la-Grand", vat_mention: VAT,
      signatories: [{ name: "M. Jérôme AUSTIN", quality: "indivisaire", order: 1 }, { name: "Mme Fanny PIOT", quality: "indivisaire", order: 2 }],
      account_holder: "M. Jérôme Austin et Mme Fanny Piot", bank: "Banque Palatine", iban: "FR76 4097 8000 4321 3287 5019 897", bic: "BSPFFRPPXXX",
      domicile: "[domicile des indivisaires — à confirmer]",
    },
    property: {
      name: "La Villa", address: "34 rue du Foron, 74100 Ville-la-Grand", commune: "Ville-la-Grand",
      surface_total_m2: 365, room_count: 10, garden_m2: 1950, dpe_class: "D",
      setting_clause_fr: "Le logement objet du présent contrat est situé dans une maison individuelle s'inscrivant dans un cadre paysager d'environ 2 000 m² attaché à l'immeuble, comprenant un parc arboré et des espaces extérieurs aménagés. Le locataire a l'usage, dans les conditions prévues au règlement intérieur annexé, des parties communes intérieures et extérieures de la maison.",
      common_areas: ["hall d'entrée", "double cuisine", "salle à manger", "buanderie", "salle de jeux", "salle TV", "salle de sport", "sauna 5 places", "terrain arboré d'environ 1 950 m²", "piscine extérieure chauffée de 12 × 5 m", "terrasses", "potager", "terrain de volley"],
      leisure_equipment: "piscine extérieure chauffée, sauna, salle de sport, salle de jeux",
    },
    room: {
      name: "La Villa 2", number: 2, floor: "rez-de-chaussée", surface_m2: 16, volume_m3: null, bathroom: "private",
      has_terrace: true, has_balcony: false, has_parking: false,
      location_detail: "rez-de-chaussée côté droit, au calme, côté jardin, exposition nord",
      description: "chambre meublée avec salle d'eau privative (douche, lavabo, WC)",
      bloc_a_text: "terrasse privative, vue dégagée, absence de vis-à-vis, calme, isolation phonique renforcée",
    },
    tenant,
    terms: {
      start: "2026-12-01", total_cc: 1530, forfait: 344, forfait_year: 2026, forfait_method: "charges provisoires 2026 : 41 312 € pour la maison",
      prev_hc: 1149, prev_paid_on: "2026-10-05", prev_revision: "aucune (bail du 16 mai 2026)", prev_departure: "2026-10-30",
      relocation_exception: null, override: false,
      irl_label: "3e trimestre 2026", irl_value: 148.06, irl_old_value: 145.77,
      eur_chf: 0.9227, eur_chf_date: "23 octobre 2026",
      discount_eur: 765, deposit_installments: 1, services_version: "2026-10", edl_tool: "Etadly",
      rgpd_email: "hello@lavillacoliving.com", zone_tendue: true,
    },
    services: ANNEXE_A,
  },
  LeLodge_1_SCI: {
    maquette: MAQUETTE,
    entity: {
      legal_form: "sci", legal_name: "SCI Sleep In", trade_name: "La Villa Coliving",
      registration: "RCS Thonon-les-Bains 882 153 810", capital_eur: 1000, siege: "8 rue du Mont-Blanc, 74100 Annemasse", vat_mention: VAT,
      signatories: [{ name: "M. Jérôme AUSTIN", quality: "gérant", order: 1, default: true }], signatory_index: 0,
      account_holder: "SCI Sleep In", bank: "Banque Palatine", iban: "FR76 4097 8000 4321 3287 5921 415", bic: "BSPFFRPPXXX",
    },
    property: {
      name: "Le Lodge", address: "8 rue de Romagny, 74100 Annemasse", commune: "Annemasse",
      surface_total_m2: 458, room_count: 12, garden_m2: 1500, dpe_class: "B",
      setting_clause_fr: "Le logement objet du présent contrat est situé dans une maison individuelle s'inscrivant dans un cadre paysager d'environ 1 500 m² attaché à l'immeuble, comprenant un parc arboré et des espaces extérieurs aménagés. Le locataire a l'usage, dans les conditions prévues au règlement intérieur annexé, des parties communes intérieures et extérieures de la maison.",
      common_areas: ["hall d'entrée", "cuisine et salle à manger", "buanderie", "salon", "salle TV", "chalet fitness (salle de sport et sauna)", "terrain arboré d'environ 1 500 m²", "terrasses", "pool house", "piscine extérieure", "grenier"],
      leisure_equipment: "piscine extérieure, sauna, salle de sport, home cinéma",
    },
    room: {
      name: "Le Lodge 1", number: 1, floor: "premier étage", surface_m2: 18, volume_m3: null, bathroom: "private",
      has_terrace: false, has_balcony: false, has_parking: true,
      location_detail: "premier étage, orientation nord, place de parking attribuée dans la propriété",
      description: "chambre meublée avec salle d'eau privative (douche, lavabo, WC)",
      bloc_a_text: "calme, exposition, place de parking attribuée, isolation phonique renforcée, fibre",
    },
    tenant,
    terms: {
      start: "2026-12-10", total_cc: 1530, forfait: 336, forfait_year: 2026, forfait_method: "charges provisoires 2026 : 48 372 € pour la maison",
      prev_hc: 1221, prev_paid_on: "2026-10-05", prev_revision: "aucune (bail du 1er octobre 2026)", prev_departure: "2026-10-30",
      relocation_exception: null, override: false,
      irl_label: "3e trimestre 2026", irl_value: 148.06, irl_old_value: 145.77,
      eur_chf: 0.9227, eur_chf_date: "23 octobre 2026",
      discount_eur: null, deposit_installments: 2, services_version: "2026-10", edl_tool: "Etadly",
      rgpd_email: "hello@lavillacoliving.com", zone_tendue: true,
    },
    services: ANNEXE_A,
  },
};
