/**
 * Texte du bail v3 : une seule source pour le PDF et l'aperçu. Construit un document structuré (articles et blocs)
 * à partir des données du bailleur, de la maison, de la chambre, du locataire et des conditions.
 * Base : note « Bail La Villa v2 » (articles 1-19, annexe A) + brief Bail v3 §5 + décisions Q1-Q17 du 26/10/2026.
 * Les crochets [ … ] signalent une donnée à compléter.
 */
import type { LegalForm, RelocationException, Signatory } from "./types";
import { computePricing, type Pricing } from "./pricing";
import { fEUR, fCHF, fRate, fDate, monthLabel, addMonths, addDays, roman } from "./format";
import { depositSchedule } from "../leaseTerms";

export interface LeaseV3Entity {
  legal_form: LegalForm;
  legal_name: string;          // « Indivision Austin-Piot », « SCI Sleep In »
  trade_name: string;          // « La Villa Coliving »
  registration: string;        // SIRET / RCS
  capital_eur: number | null;
  siege: string;
  vat_mention: string;
  signatories: Signatory[];    // indivision : les deux ; SCI : le signataire choisi
  signatory_index?: number;    // SCI : index du gérant qui signe
  account_holder: string;
  bank: string;
  iban: string;
  bic: string;
  domicile?: string;           // indivision : domicile des indivisaires (élection de domicile)
}
export interface LeaseV3Property {
  name: string; address: string; commune: string;
  building_kind?: string;      // « Maison individuelle » (défaut) ou « Maison de ville » (Le Loft)
  surface_total_m2: number | null; room_count: number; garden_m2: number | null;
  setting_clause_fr: string | null; common_areas: string[]; leisure_equipment: string; dpe_class: string | null;
}
export interface LeaseV3Room {
  name: string; number: number; floor: string; surface_m2: number; volume_m3: number | null;
  bathroom: "private" | "shared"; has_terrace: boolean; has_balcony: boolean; has_parking: boolean;
  location_detail: string | null; description: string | null; bloc_a_text: string | null;
}
export interface LeaseV3Tenant {
  first_name: string; last_name: string; dob: string | null; birthplace: string | null; nationality: string | null;
  previous_address: string | null; email: string | null; phone: string | null; profession: string | null; employer: string | null;
}
export interface LeaseV3Terms {
  start: string;                       // ISO
  total_cc: number; forfait: number;
  forfait_year: number; forfait_method: string;
  prev_hc: number | null; prev_paid_on: string | null; prev_revision: string | null; prev_departure: string | null;
  relocation_exception: RelocationException | null; override: boolean; override_reason?: string | null;
  irl_label: string; irl_value: number; irl_old_value: number;
  eur_chf: number; eur_chf_date: string;
  discount_eur: number | null; deposit_installments: 1 | 2 | 3;
  services_version: string;
  edl_tool: string;                    // « Etadly »
  rgpd_email: string;
  zone_tendue: boolean;
}
export interface ServiceLine { service: string; frequency: string; provider: string; evidence: string; criterion: string }
export interface LeaseV3Input {
  entity: LeaseV3Entity; property: LeaseV3Property; room: LeaseV3Room; tenant: LeaseV3Tenant; terms: LeaseV3Terms;
  services: ServiceLine[]; maquette?: string | null;
}

export type Block =
  | { t: "p"; text: string; bold?: boolean; italic?: boolean; small?: boolean }
  | { t: "sub"; text: string }
  | { t: "bullets"; items: string[]; bold?: boolean }
  | { t: "numbered"; items: string[] }
  | { t: "lines"; items: string[] }
  | { t: "kv"; rows: Array<[string, string]>; totals?: Array<[string, string]>; headers?: [string, string] }
  | { t: "table"; headers: string[]; rows: string[][]; widths: number[] }
  | { t: "box"; label?: string; lines: string[] };
export interface Article { num: string; title: string; blocks: Block[]; first?: boolean; keepTogether?: boolean }
export interface LeaseDoc {
  title: string; subtitle: string; maquette: string | null;
  bailleur: string[]; locataire: string[];
  articles: Article[]; annexes: Article[];
  signature: { city: string; bailleurs: string[]; tenant: string };
  footer: string[];
  pricing: Pricing;
}

const QUALITY = { private: "privative", shared: "partagée avec une autre chambre" };

export function buildLeaseV3(input: LeaseV3Input): LeaseDoc {
  const { entity: e, property: p, room: r, tenant: t, terms: k } = input;
  const indiv = e.legal_form === "indivision";
  const pr = computePricing({
    totalCc: k.total_cc, forfait: k.forfait, prevHc: k.prev_hc, prevDepartureIso: k.prev_departure,
    irlNew: k.irl_value, irlOld: k.irl_old_value, zoneTendue: k.zone_tendue, exception: k.relocation_exception,
    override: k.override, surfaceM2: r.surface_m2, startIso: k.start, eurChf: k.eur_chf,
  });
  const end = addDays(addMonths(k.start, 12), -1);
  const tenantName = `${t.first_name} ${t.last_name.toUpperCase()}`;
  const ph = (v: string | null | undefined, label: string) => (v && v.trim() ? v : `[${label}]`);
  const bailleurShort = indiv ? "M. Jérôme Austin et Mme Fanny Piot" : e.legal_name;
  const signatory = e.signatories[e.signatory_index ?? 0];

  // ---------- en-tête : bailleur et locataire ----------
  const bailleur = indiv
    ? [
        `${e.signatories.map(x => x.name).join(" et ")}, propriétaires indivis`,
        `${e.legal_name} — ${e.registration}`,
        `Enseigne : ${e.trade_name}`,
        `Siège : ${e.siege}`,
        e.vat_mention,
        "Agissant conjointement et solidairement (deux signatures)",
      ]
    : [
        `${e.legal_name}${e.capital_eur ? ` — capital de ${fEUR(e.capital_eur)}` : ""}`,
        e.registration,
        `Siège social : ${e.siege}`,
        `Enseigne : ${e.trade_name}`,
        e.vat_mention,
        `Représentée par : ${signatory.name}, ${signatory.quality}`,
      ];
  const locataire = [
    `${t.last_name.toUpperCase()} ${t.first_name}`,
    `Né(e) le ${t.dob ? fDate(t.dob) : "[date]"} à ${ph(t.birthplace, "lieu de naissance")}`,
    `Nationalité : ${ph(t.nationality, "nationalité")}`,
    `Adresse précédente : ${ph(t.previous_address, "adresse")}`,
    `Email : ${ph(t.email, "email")}`,
    `Tél : ${ph(t.phone, "téléphone")}`,
    `Profession : ${ph(t.profession, "profession")}`,
    `Employeur : ${ph(t.employer, "employeur")}`,
  ];

  const articles: Article[] = [];
  const art = (title: string, blocks: Block[], opts: Partial<Article> = {}) =>
    articles.push({ num: roman(articles.length + 1), title, blocks, ...opts });

  art("PARTIES ET QUALITÉS", [
    { t: "p", text: indiv
      ? "1.1 Le Bailleur agit en qualité de propriétaire indivis et d'exploitant de l'habitat partagé décrit à l'article II. Les deux indivisaires sont tenus solidairement des obligations du Bailleur ; toute notification adressée à l'un d'eux vaut à l'égard des deux."
      : "1.1 Le Bailleur agit en qualité de propriétaire et d'exploitant de l'habitat partagé décrit à l'article II, représenté par son gérant, qui a tous pouvoirs pour signer le présent contrat." },
    { t: "p", text: `1.2 Les loyers, charges et dépôt de garantie sont payés sur le compte ouvert au nom ${indiv ? "des deux indivisaires" : "de la SCI Sleep In"} désigné à l'article V. Aucun tiers n'encaisse pour son propre compte.` },
    { t: "p", text: "1.3 Le présent contrat est un contrat mixte : il porte sur la mise à disposition d'une chambre meublée, la jouissance des parties communes et les prestations de services de l'article IX, qui forment un tout indissociable." },
  ], { keepTogether: true });

  const privBullets = [
    r.location_detail ? `Emplacement : ${r.location_detail}` : null,
    `Description : ${r.description || `chambre meublée avec salle d'eau ${QUALITY[r.bathroom]}`}`,
    `Salle d'eau : ${QUALITY[r.bathroom]}`,
    r.has_terrace ? "Terrasse privative : oui" : null,
    r.has_balcony ? "Balcon privatif : oui" : null,
    r.has_parking ? "Place de parking attribuée : oui" : null,
    r.bloc_a_text ? `Caractéristiques : ${r.bloc_a_text}` : null,
    `Volume : ${r.volume_m3 ? `${r.volume_m3} m³` : "[à relever] m³"} (au moins 9 m² et 20 m³, article 8-1)`,
  ].filter((x): x is string => !!x);
  art("OBJET ET DÉSIGNATION", [
    { t: "p", text: "Bien concerné :", bold: true },
    { t: "bullets", bold: true, items: [`${p.name} - ${p.address}`, `Étage : ${r.floor} - Chambre : ${r.name} - Surface : ${r.surface_m2} m² (salle d'eau comprise)`] },
    { t: "sub", text: "2.1 L'immeuble" },
    { t: "p", text: `${p.building_kind || "Maison individuelle"} à usage d'habitation sise ${p.address}, d'une surface habitable totale de ${p.surface_total_m2 ?? "[…]"} m², comprenant ${p.room_count} chambres louées séparément et des parties communes${p.garden_m2 ? `, sur un terrain arboré d'environ ${fNum(p.garden_m2)} m²` : ""}. ${p.setting_clause_fr || ""} Chaque chambre fait l'objet d'un bail distinct (colocation à baux multiples, article 8-1 de la loi du 6 juillet 1989) ; les locataires ne sont pas solidaires entre eux.${p.dpe_class ? ` Diagnostic de performance énergétique : classe ${p.dpe_class}.` : ""}` },
    { t: "sub", text: "2.2 Le local privatif, fermé à clef, dont le Locataire a la jouissance exclusive" },
    { t: "bullets", items: privBullets },
    { t: "sub", text: "2.3 Accès aux parties communes" },
    { t: "lines", items: p.common_areas },
    { t: "sub", text: "2.4 Mobilier et équipements" },
    { t: "p", text: `L'inventaire et l'état détaillé du mobilier de la chambre sont établis contradictoirement lors de l'état des lieux d'entrée (annexe 2, application ${k.edl_tool}) ; ils comprennent la parure de lit et la serviette mises à disposition (article IX, 9.3).` },
    { t: "sub", text: "2.5 Destination" },
    { t: "p", text: "Résidence principale du Locataire au sens de l'article 2 de la loi du 6 juillet 1989 ; usage exclusif d'habitation ; toute sous-location, cession, location de courte durée ou hébergement prolongé de tiers sans accord écrit est interdite." },
    { t: "sub", text: "2.6 Informations légales (zone tendue)" },
    { t: "box", lines: k.prev_hc != null ? [
      `Dernier loyer acquitté par le précédent locataire de la chambre : ${fEUR(k.prev_hc)} hors charges`,
      `Payé le ${k.prev_paid_on ? fDate(k.prev_paid_on) : "[date]"} — dernière révision : ${k.prev_revision || "aucune"}`,
      `Départ du précédent locataire : ${k.prev_departure ? fDate(k.prev_departure) : "[date]"}`,
      "Travaux réalisés depuis le dernier bail : néant",
    ] : ["Première mise en location de la chambre : aucun loyer antérieur."] },
  ]);

  art("DURÉE, RENOUVELLEMENT, CONGÉS", [
    { t: "p", bold: true, text: `La location prend effet le ${fDate(k.start)} pour une durée de douze (12) mois, soit jusqu'au ${fDate(end)} inclus.` },
    { t: "p", text: "À son terme, le contrat se renouvelle par tacite reconduction pour des périodes successives de douze mois." },
    { t: "p", text: "Conformément à l'article 25-8 de la loi n° 89-462 du 6 juillet 1989, le Locataire peut donner congé à tout moment, avec un préavis d'un mois. Le Bailleur ne peut donner congé que pour le terme du contrat, avec un préavis de trois mois, en justifiant d'une reprise pour habiter, d'une vente ou d'un motif légitime et sérieux." },
    { t: "p", text: "Le congé est notifié par lettre recommandée avec avis de réception, par acte de commissaire de justice ou par remise en main propre contre récépissé ou émargement." },
    { t: "sub", text: "Visites en cas de congé :" },
    { t: "p", text: "En cas de congé donné par l'une ou l'autre des parties, le Locataire autorise le Bailleur à faire visiter le logement en vue de sa relocation. Ces visites se tiennent les jours ouvrables, dans la limite de deux heures par jour, selon des créneaux convenus ensemble et moyennant un préavis de 48 heures. Le Locataire peut demander que ses effets personnels soient rangés ou couverts au préalable." },
  ]);

  art("PRISE D'EFFET ET REMISE DES CLÉS", [
    { t: "p", text: pr.prorataDays
      ? `La location prend effet le ${fDate(k.start)}. Le loyer et le forfait de charges du mois d'entrée sont dus au prorata, calculé en trentièmes (${pr.prorataDays}/30) : loyer **${fEUR(pr.prorataHc)}**, forfait **${fEUR(pr.prorataForfait)}**, soit **${fEUR(pr.prorataTotal)}**. Les échéances suivantes sont mensuelles, du premier au dernier jour de chaque mois.`
      : `La location prend effet le ${fDate(k.start)}, premier jour du mois : aucun prorata n'est dû. Les échéances sont mensuelles, du premier au dernier jour de chaque mois.` },
    { t: "p", text: "Les clés et badges sont remis lors de l'état des lieux d'entrée contradictoire (article XIV)." },
  ], { keepTogether: true });

  const capSentence = !pr.capApplies
    ? (k.prev_hc == null ? "Première mise en location : le loyer est fixé librement." : `Le plafond de relocation ne s'applique pas (${exceptionLabel(k.relocation_exception)}).`)
    : pr.capped
      ? (k.override
        ? `Le dernier loyer du précédent locataire révisé selon l'IRL s'élève à ${fEUR(pr.cap as number)} ; le présent loyer lui est supérieur de ${fEUR(pr.exposedPremium)} par mois en application de la dérogation suivante : ${k.override_reason || "[motif]"}.`
        : `Le loyer hors charges est fixé dans la limite du dernier loyer du précédent locataire révisé selon l'indice de référence des loyers (${fEUR(k.prev_hc as number)} × ${fIrl(k.irl_value)} / ${fIrl(k.irl_old_value)} = ${fEUR(pr.cap as number)}), conformément au décret annuel relatif à l'évolution de certains loyers dans le cadre d'une nouvelle location en zone tendue (article II, 2.6).`)
      : `Le dernier loyer du précédent locataire révisé selon l'indice de référence des loyers (${fEUR(k.prev_hc as number)} × ${fIrl(k.irl_value)} / ${fIrl(k.irl_old_value)} = ${fEUR(pr.cap as number)}) est supérieur au présent loyer : le décret annuel relatif à l'évolution de certains loyers dans le cadre d'une nouvelle location en zone tendue est respecté.`;
  const discount = k.discount_eur && k.discount_eur > 0 ? k.discount_eur : 0;
  const firstFullMonth = Number(k.start.slice(8, 10)) === 1 ? k.start : addMonths(k.start.slice(0, 7) + "-01", 1);
  art("CONDITIONS FINANCIÈRES", [
    { t: "p", bold: true, text: `Loyer mensuel de la chambre, hors charges : ${fEUR(pr.hc)} (${fCHF(pr.chfHc)} au taux BCE du ${k.eur_chf_date} : 1\u00a0€ = ${fRate(k.eur_chf)} CHF — pour indication uniquement), payable d'avance avant le 5 de chaque mois, stipulé et payé en euros.` },
    { t: "p", text: capSentence },
    { t: "p", text: `Le loyer rémunère la mise à disposition de la chambre, la jouissance des parties communes et des équipements de loisirs de la maison (${p.leisure_equipment}), l'accès internet et les prestations de l'article IX. L'exploitation de ces équipements et services est à la charge exclusive du Bailleur et n'entre pas dans le forfait de charges.` },
    { t: "sub", text: "Forfait de charges récupérables :" },
    { t: "p", small: true, text: `Forfait établi d'après les charges récupérables de l'exercice ${k.forfait_year} de la maison (${k.forfait_method}), réparties à parts égales entre les ${p.room_count} chambres et rapportées au mois (article 25-10 de la loi du 6 juillet 1989 ; décret n° 87-713). Il ne donne lieu à aucune régularisation et est révisé dans les mêmes conditions que le loyer ; l'état récapitulatif des charges est tenu à la disposition du Locataire.` },
    { t: "kv", headers: ["Catégorie", "EUR"], rows: [["Loyer hors charges", fEUR(pr.hc)], ["Forfait de charges récupérables", fEUR(k.forfait)]], totals: [["TOTAL MENSUEL", fEUR(pr.total)]] },
    { t: "p", small: true, text: "Le forfait couvre exclusivement : eau froide et chaude, chauffage et production d'eau chaude, fourniture d'énergie, produits et personnel d'entretien des parties communes, entretien courant des espaces verts, consommables des parties communes, entretien courant de la chaudière, désinsectisation, taxe d'enlèvement des ordures ménagères, redevance d'assainissement. Ni l'accès internet, ni l'exploitation de la piscine, ni aucune prestation de services n'y figurent." },
    ...(discount ? [
      { t: "sub", text: "Remise commerciale sur le premier mois complet :" } as Block,
      { t: "p", text: `À titre de geste commercial, le Bailleur consent au Locataire une remise de ${fEUR(discount)} sur le loyer et le forfait du premier mois complet de location, soit ${monthLabel(firstFullMonth)} (montant habituel : ${fEUR(pr.total)}). Le montant à verser pour ce mois est donc de ${fEUR(pr.total - discount)}.${pr.prorataDays ? " Le prorata dû pour le mois d'entrée n'est pas concerné par cette remise." : ""} Cette remise est accordée une seule fois ; elle ne modifie ni le loyer, ni sa révision, ni le dépôt de garantie.` } as Block,
    ] : []),
    { t: "sub", text: `Frais de dossier et d'état des lieux d'entrée : ${fEUR(pr.fees)}, non soumis à la TVA — offerts à partir de 3 mois de présence` },
    { t: "p", text: `Ces frais rémunèrent les prestations assurées par le Bailleur pour la mise en place de la location. Ils sont calculés sur la surface de la chambre louée, soit ${r.surface_m2} m² : frais de dossier (visite du logement, constitution du dossier, rédaction du bail) 10 € par m², soit ${fEUR(pr.feeDossier)} ; prestation d'état des lieux d'entrée 3 € par m², soit ${fEUR(pr.feeEdl)}. Ces frais sont offerts au Locataire dont le séjour atteint trois mois à compter de la date d'entrée ; en cas de départ avant ce délai, ils restent à sa charge et sont réglés au plus tard à la restitution des clés. Aucune autre somme n'est due au titre de la location.` },
    { t: "sub", text: "Révision annuelle (IRL) :" },
    { t: "bullets", items: [`Trimestre de référence : ${k.irl_label}`, `Indice de référence : ${fIrl(k.irl_value)}`, "Le loyer et le forfait de charges sont révisés chaque année à la date anniversaire du contrat selon l'indice de référence des loyers."] },
    { t: "sub", text: "Modalités de paiement :" },
    { t: "bullets", items: ["LE LOYER ET LE FORFAIT DE CHARGES DOIVENT ÊTRE VERSÉS AVANT LE 5 DU MOIS.", `Virement bancaire sur le compte du Bailleur, libellé « loyer ${r.name} [mois] ».`, "Toute somme due et non réglée à son échéance porte intérêts au taux légal à compter de la mise en demeure du Locataire (article 1231-6 du Code civil). Une quittance est délivrée gratuitement sur demande (article 21 de la loi du 6 juillet 1989)."] },
    { t: "sub", text: "Coordonnées bancaires du Bailleur :" },
    { t: "lines", items: [`Banque : ${e.bank}`, `Titulaire : ${e.account_holder}`, `IBAN : ${e.iban}`, `BIC : ${e.bic}`] },
  ]);

  const schedule = depositSchedule(pr.deposit, k.deposit_installments, k.start);
  art("DÉPÔT DE GARANTIE", [
    { t: "p", bold: true, text: `LE LOCATAIRE VERSE UN DÉPÔT DE GARANTIE ÉGAL À DEUX (2) MOIS DE LOYER HORS CHARGES, SOIT ${fEUR(pr.deposit)}, RESTITUÉ DANS LE DÉLAI D'UN (1) MOIS À COMPTER DE LA REMISE DES CLÉS LORSQUE L'ÉTAT DES LIEUX DE SORTIE EST CONFORME À L'ÉTAT DES LIEUX D'ENTRÉE, DE DEUX (2) MOIS DANS LE CAS CONTRAIRE, DÉDUCTION FAITE DES SOMMES DUES ET JUSTIFIÉES.` },
    ...(schedule.length > 1 ? [{ t: "box", label: `Par accord entre les parties, ce dépôt de garantie est versé en ${schedule.length === 2 ? "deux (2)" : "trois (3)"} fois :`, lines: schedule.map((s, i) => `${fEUR(s.amount)} ${i === 0 ? "à la signature du contrat" : `au plus tard le ${s.dueDate ? fDate(s.dueDate) : "[date]"}, avec le loyer du ${i === 1 ? "deuxième" : "troisième"} mois`}`).concat([`Le montant total du dépôt de garantie reste de ${fEUR(pr.deposit)}.`]) } as Block] : []),
    { t: "p", text: "Passé le délai de restitution, le dépôt est majoré de 10 % du loyer mensuel hors charges par mois de retard commencé (article 22). Il ne porte pas intérêt et ne peut être imputé sur les derniers loyers." },
  ], { keepTogether: true });

  art("GARANTIES COMPLÉMENTAIRES", [{ t: "p", text: "Néant." }], { keepTogether: true });

  art("CLAUSE RÉSOLUTOIRE", [
    { t: "p", text: "À défaut de paiement à son terme de tout ou partie du loyer ou du forfait de charges, ou à défaut de versement du dépôt de garantie ou de l'une de ses échéances, le présent contrat sera résilié de plein droit six (6) semaines après la délivrance au Locataire d'un commandement de payer demeuré infructueux, conformément à l'article 24 de la loi n° 89-462 du 6 juillet 1989." },
    { t: "p", text: "Le présent contrat sera également résilié de plein droit à défaut pour le Locataire de justifier d'une assurance contre les risques locatifs, un (1) mois après un commandement demeuré infructueux (article 7 g). La résiliation acquise, le Locataire doit libérer les lieux ; son expulsion peut être ordonnée par le juge des contentieux de la protection." },
  ], { keepTogether: true });

  art("PRESTATIONS DE SERVICES INCLUSES", [
    { t: "sub", text: "9.1 Nature" },
    { t: "p", text: "Le Bailleur exploite l'immeuble en habitat partagé avec services. Il s'engage à fournir au Locataire, pendant toute la durée de l'occupation et sans supplément de prix, les prestations suivantes, détaillées à l'annexe A qui fait partie intégrante du contrat :" },
    { t: "numbered", items: [
      "l'entretien et le nettoyage des parties communes intérieures, trois interventions par semaine par une entreprise de propreté ;",
      "l'entretien des espaces extérieurs et des équipements collectifs : jardin, piscine (entretien hebdomadaire en saison, hivernage), sauna, salle de sport, électroménager ; maintenance corrective ;",
      "la fourniture mensuelle des consommables des parties communes (papier toilette, essuie-tout, lessive, produits d'entretien) ;",
      "la connectivité : accès internet très haut débit dans toute la maison ;",
      "l'animation de la communauté : au moins un événement organisé par mois et une box pour un dîner communautaire mensuel ;",
      "le bien-être : un cours collectif de yoga et une séance de coaching sportif par mois, assurés par des intervenants indépendants contractés par le Bailleur ;",
      "l'assistance : un canal de contact dédié (WhatsApp), une réponse sous 48 heures ouvrées et l'organisation des dépannages ;",
      "la gestion de la communauté : accueil d'intégration par le comité d'accueil des résidents, plateforme numérique (états des lieux, règlement, calendrier), processus participatif de sélection des nouveaux colocataires.",
    ] },
    { t: "sub", text: "9.2 Exécution" },
    { t: "p", text: "Les prestations sont rendues par le Bailleur, directement ou par des prestataires qu'il choisit, contracte et rémunère, de manière continue et régulière. Le Bailleur peut en adapter les modalités (jours, horaires, intervenants) sans en réduire le niveau. Une interruption temporaire inférieure à quinze jours (congés, panne, intempéries) n'ouvre droit à aucune réduction." },
    { t: "sub", text: "9.3 Prestations exclues" },
    { t: "p", text: "Le Bailleur ne fournit pas, et ne propose pas, même à titre optionnel ou payant : le nettoyage de la chambre et de la salle d'eau privatives, qui incombe au Locataire ; le renouvellement ou le blanchissage du linge de lit et de toilette ; le petit déjeuner ni aucun service de restauration. La parure de lit et la serviette mises à disposition à l'entrée sont inventoriées à l'état des lieux (annexe 2), restituées à la sortie, et ne sont ni renouvelées ni blanchies par le Bailleur. Le Bailleur n'assure ni réception ni permanence d'accueil : la remise des clés a lieu lors de l'état des lieux d'entrée, et le canal d'assistance est un service de maintenance et de vie communautaire." },
    { t: "sub", text: "9.4 Suivi et preuve" },
    { t: "p", text: "Le Bailleur tient un registre des prestations (date, nature, prestataire) et met à la disposition du Locataire, par la plateforme numérique, un récapitulatif trimestriel des prestations rendues (modèle en annexe B) ; à défaut d'observation écrite dans les quinze jours, le récapitulatif est réputé accepté. Le Locataire signale toute carence dans les 48 heures. Le Bailleur conserve les contrats et factures des prestataires." },
    { t: "sub", text: "9.5 Caractère indissociable" },
    { t: "p", text: "Les prestations sont une composante de l'objet du contrat ; elles ne peuvent être refusées, modifiées à la demande d'un locataire ni déduites du loyer." },
  ]);

  art("OBLIGATIONS DU LOCATAIRE", [{ t: "p", text: "Le Locataire s'engage à :" }, { t: "numbered", items: [
    "payer le loyer et le forfait de charges aux dates convenues ;",
    "user paisiblement de la chambre et des parties communes, conformément à leur destination et au règlement intérieur (annexe 4) ; respecter le repos des occupants, notamment entre 22 h et 8 h ;",
    "assurer le nettoyage et l'entretien courant de sa chambre et de sa salle d'eau, ainsi que les réparations locatives (décret n° 87-712) ;",
    "ne pas héberger de tiers de manière prolongée sans accord écrit ; répondre des personnes qu'il introduit dans les lieux ;",
    "laisser exécuter les prestations de l'article IX et les travaux de l'article XIII ; permettre l'accès à la chambre pour les réparations nécessaires, avec un préavis de 48 heures sauf urgence ;",
    "déclarer au Bailleur tout incident, sinistre ou dégradation dans les 48 heures ;",
    "s'assurer (article XV) ;",
    "ne pas sous-louer, céder le bail ni changer la destination des lieux ;",
    "restituer la chambre, le mobilier et le kit linge en bon état, usure normale exceptée, et participer aux états des lieux.",
  ] }]);

  art("OBLIGATIONS DU BAILLEUR", [{ t: "p", text: "Le Bailleur s'engage à :" }, { t: "numbered", items: [
    "délivrer un logement décent et en bon état d'usage et de réparation, avec le mobilier inventorié à l'état des lieux d'entrée (annexe 2) ;",
    "assurer la jouissance paisible des lieux et en garantir les vices et défauts ;",
    "entretenir les locaux et y faire les réparations autres que locatives ;",
    "fournir les prestations de l'article IX et en tenir le registre ;",
    "répondre aux demandes d'entretien dans les 48 heures ouvrées ;",
    "respecter la vie privée du Locataire et prévenir 48 heures avant toute visite, sauf urgence ;",
    "délivrer quittances et attestations, remettre les documents de l'article XIX.",
  ] }]);

  art("USAGE DES ÉQUIPEMENTS ET ESPACES COMMUNS", [
    { t: "p", text: "12.1 Les équipements des parties communes (piscine, sauna, salle de sport, cuisines, buanderie, mobilier extérieur, jeux) sont mis à disposition pour un usage normal et conforme à leur destination et au règlement intérieur." },
    { t: "p", text: "12.2 La piscine, le sauna et les installations de bien-être sont à usage privé et non surveillés ; leur utilisation suppose l'aptitude physique et la vigilance de l'utilisateur ; l'accès des mineurs se fait sous la responsabilité exclusive de l'adulte qui les accompagne ; il est déconseillé d'utiliser ces équipements seul, sous l'effet de l'alcool ou de substances, ou en cas de contre-indication médicale." },
    { t: "p", text: "12.3 Le Locataire est responsable de ses invités. Il signale sans délai toute anomalie ou risque constaté sur un équipement commun." },
    { t: "p", text: "12.4 Ces stipulations ne privent pas le Locataire des droits qu'il tient des dispositions d'ordre public ni n'exonèrent le Bailleur de son obligation de sécurité et de délivrance d'un logement décent." },
  ]);

  art("TRAVAUX", [{ t: "p", text: "Le Locataire laisse exécuter les travaux d'amélioration des parties communes ou privatives, les travaux nécessaires au maintien en état et à l'entretien normal des locaux et ceux de performance énergétique (article 7 e). Si ces travaux durent plus de vingt et un jours, le loyer est diminué à proportion du temps et de la partie de la chambre dont il a été privé." }], { keepTogether: true });

  art("ÉTAT DES LIEUX ET INVENTAIRE", [{ t: "p", text: `L'état des lieux d'entrée et de sortie est établi contradictoirement, sur support numérique (application ${k.edl_tool}), conformément au décret n° 2016-382 ; un exemplaire est remis au Locataire. L'inventaire et l'état détaillé du mobilier, y compris la parure de lit et la serviette mises à disposition, y sont joints (annexe 2). Le Locataire peut demander de compléter l'état des lieux d'entrée dans les dix jours (un mois pour le chauffage).` }], { keepTogether: true });

  art("ASSURANCE", [{ t: "p", text: "Le Locataire souscrit et maintient pendant toute la durée du bail une assurance multirisques habitation couvrant les risques locatifs et sa responsabilité civile (article 7 g) ; il en justifie à la remise des clés puis chaque année, à l'échéance de son attestation. Le Bailleur assure l'immeuble en qualité de propriétaire non occupant." }], { keepTogether: true });

  art("RÈGLEMENT INTÉRIEUR", [{ t: "p", text: "Le règlement intérieur « Bible du Coliver » (annexe 4) précise les règles de vie commune, l'usage des parties communes et les modalités pratiques des prestations. Il est opposable au Locataire ; ses mises à jour lui sont notifiées avec un préavis d'un mois et ne peuvent déroger au présent contrat ni à la loi." }], { keepTogether: true });

  art("GESTION PAR MANDATAIRE", [{ t: "p", text: `Sans objet à la date de signature : le Bailleur gère directement l'immeuble et exécute lui-même les prestations de l'article IX. S'il confie ultérieurement tout ou partie de la gestion locative et des prestations à un mandataire professionnel en vertu d'un mandat écrit, ce mandataire agira exclusivement au nom et pour le compte du Bailleur ; il ne sera ni bailleur, ni sous-bailleur, ni partie au présent contrat, ne garantira aucun loyer et n'encaissera aucune somme pour son propre compte, les loyers, charges et dépôt de garantie restant payables sur le compte désigné à l'article V ; les quittances, états des lieux, congés, notifications et récapitulatifs qu'il établira le seront « pour le compte de ${bailleurShort} ». Le Locataire sera informé par écrit de l'identité du mandataire, de l'étendue de son mandat et de tout changement.` }], { keepTogether: true });

  art("DONNÉES PERSONNELLES", [{ t: "p", text: `Les données du Locataire sont traitées par le Bailleur pour la gestion du contrat, la sécurité des lieux et la vie de la communauté, pendant la durée du bail et les délais légaux de conservation ; le Locataire dispose des droits d'accès, de rectification et d'effacement (RGPD) auprès de ${k.rgpd_email}.` }], { keepTogether: true });

  art("DISPOSITIONS DIVERSES ET ANNEXES", [
    { t: "p", text: "19.1 Le contrat est soumis au droit français ; tout litige relève du juge des contentieux de la protection du lieu de situation de l'immeuble, après saisine facultative de la commission départementale de conciliation de la Haute-Savoie." },
    { t: "p", text: `19.2 Les parties élisent domicile : le Bailleur ${indiv ? `à ${e.domicile || e.siege}` : `en son siège, ${e.siege}`}, le Locataire dans les lieux loués.` },
    { t: "p", text: "19.3 Le contrat est signé électroniquement ; la version française fait foi, toute traduction étant de courtoisie. La nullité d'une clause n'affecte pas les autres." },
    { t: "p", text: "19.4 Sont annexés au présent contrat et remis au Locataire :" },
    { t: "bullets", items: [
      "Annexe 1 — Notice d'information relative aux droits et obligations des locataires et des bailleurs (arrêté du 29 mai 2015)",
      `Annexe 2 — État des lieux d'entrée et inventaire du mobilier (application ${k.edl_tool})`,
      `Annexe 3 — Dossier de diagnostic technique${p.dpe_class ? ` (diagnostic de performance énergétique classe ${p.dpe_class}, état des risques et pollutions et autres diagnostics applicables)` : ""}`,
      "Annexe 4 — Règlement intérieur « Bible du Coliver »",
      "Annexe A — Catalogue des prestations",
      "Annexe B — Modèle de récapitulatif trimestriel des prestations",
    ] },
  ]);

  const annexes: Article[] = [
    { num: "A", title: `CATALOGUE DES PRESTATIONS — ${p.name.toUpperCase()} (VERSION ${k.services_version})`, first: true, blocks: [
      { t: "p", small: true, text: "Chaque prestation a une fréquence, un exécutant et une preuve conservée par le Bailleur (article IX, 9.4). Les prestations exclues de l'article IX, 9.3 n'y figurent pas." },
      { t: "table", headers: ["Prestation", "Fréquence et modalités", "Exécutant", "Preuve conservée", "Critère TVA 261 D 4° b"], widths: [28, 22, 15, 17, 18], rows: input.services.map(s => [s.service, s.frequency, s.provider, s.evidence, s.criterion]) },
    ] },
    { num: "B", title: "MODÈLE DE RÉCAPITULATIF TRIMESTRIEL DES PRESTATIONS", keepTogether: true, blocks: [
      { t: "p", italic: true, text: `« Récapitulatif des prestations rendues du [1er …] au [… 20…], chambre ${r.name}, en exécution de l'article IX du contrat du ${fDate(k.start)} : nettoyage des parties communes [39] interventions ; entretien des extérieurs [6] passages ; piscine [13] entretiens ; consommables [3] paniers ; événements [3] (dates) ; yoga [3] cours ; coaching [3] séances ; demandes d'assistance traitées [n], délai moyen [… h]. Sauf observation écrite dans les quinze jours, ce récapitulatif est réputé accepté. Établi par le Bailleur, le [date]. »` },
    ] },
  ];

  return {
    title: "CONTRAT DE LOCATION D'UNE CHAMBRE MEUBLÉE\nEN HABITAT PARTAGÉ AVEC SERVICES (COLIVING)",
    subtitle: "Loi n° 89-462 du 6 juillet 1989 — colocation à baux multiples (art. 8-1) — décret n° 2015-587 du 29 mai 2015",
    maquette: input.maquette ?? null,
    bailleur, locataire, articles, annexes,
    signature: { city: p.commune, bailleurs: indiv ? e.signatories.map(x => x.name) : [`${signatory.name}, ${signatory.quality}\npour la ${e.legal_name}`], tenant: tenantName },
    footer: [`${e.trade_name} - lavillacoliving.com`, "8 rue du Mont-Blanc", "74100 Annemasse"],
    pricing: pr,
  };
}

function fIrl(n: number): string {
  return n.toFixed(2).replace(".", ",");
}
function fNum(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
function exceptionLabel(x: RelocationException | null): string {
  return ({ first_letting: "première mise en location", vacancy_18m: "logement vacant depuis plus de dix-huit mois", works: "travaux d'amélioration d'un montant au moins égal à six mois de loyer", undervalued: "loyer manifestement sous-évalué" } as Record<string, string>)[x || ""] || "exception";
}
