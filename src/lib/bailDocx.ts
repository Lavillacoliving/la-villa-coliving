// Génération du bail Word à partir du gabarit public/templates/bail-coliving-2026-09.docx.
//
// Le gabarit EST le fichier Word de Jérôme : la mise en forme n'est jamais recréée
// ni convertie, seules les 50 balises {…} sont remplies. Le document contractuel
// des baux 2026-09 sort d'ici ; le rendu @react-pdf reste pour les baux legacy,
// Mont-Blanc et l'aperçu écran.
//
// Réservé aux baux coliving au NOUVEAU format (forfait unique) : le gabarit ne
// connaît ni les 3 postes legacy ni la structure Mont-Blanc.
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

const TEMPLATE_URL = "/templates/bail-coliving-2026-09.docx";
const ANNEXE_URL = "/templates/annexe-loyer-2026-09.docx";
const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

// Coordonnées bancaires par entité — mêmes valeurs que l'aperçu HTML historique.
const BANQUES: Record<string, { titulaire: string; iban: string }> = {
  "La Villa": { titulaire: "Jérôme Austin / Fanny Piot", iban: "FR76 4097 8000 4321 3287 5019 897" },
  "Le Lodge": { titulaire: "SCI Sleep In", iban: "FR76 4097 8000 4321 3287 5921 415" },
  "Le Loft": { titulaire: "SCI Sleep In", iban: "FR76 4097 8000 4321 3287 5921 415" },
};

// Montants au format du gabarit : espaces simples (c'est ce que contient le Word).
const nb = (n: number): string =>
  new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 })
    .format(n)
    .replace(/[\u202f\u00a0]/g, " ");

const surfaceFr = (m2: number | null | undefined): string =>
  m2 == null ? "—" : Number(m2).toLocaleString("fr-FR", { maximumFractionDigits: 1 });

// Date en toutes lettres, "1er" pour le premier du mois. JAMAIS de HTML ici :
// ce texte part dans le contrat Word.
function fDateTexte(d: string | null | undefined): string {
  if (!d) return "[date]";
  const dt = new Date(d + "T00:00:00");
  if (isNaN(dt.getTime())) return "[date invalide]";
  const base = dt.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  return dt.getDate() === 1 ? base.replace(/^1 /, "1er ") : base;
}

const DUREE_LETTRES: Record<number, string> = {
  1: "un", 2: "deux", 3: "trois", 4: "quatre", 5: "cinq", 6: "six",
  7: "sept", 8: "huit", 9: "neuf", 10: "dix", 11: "onze", 12: "douze",
  15: "quinze", 18: "dix-huit", 24: "vingt-quatre", 36: "trente-six",
};
const dureeLettres = (n: number): string => DUREE_LETTRES[n] || String(n);

// "34 rue du Foron - 74100 Ville-la-Grand - France" -> "Ville-la-Grand"
export function villeDepuisAdresse(adresse: string | null | undefined): string {
  const m = (adresse || "").match(/\b\d{5}\s+([^-–]+)/);
  return m ? m[1].trim() : "—";
}

export interface BailDocxInput {
  property: {
    name: string;
    address: string;
    legal_entity_name: string;
    siret: string;
    tva: string;
    siege_social: string;
    manager_name: string | null;
    common_areas: string[];
  };
  room: {
    name: string;
    floor: string;
    surface_m2: number | null;
    location_detail: string | null;
    description: string;
    bathroom_type: string;
    bathroom_detail: string | null;
    has_parking: boolean;
    parking_detail: string | null;
    has_balcony: boolean;
    has_terrace: boolean;
    has_private_entrance: boolean;
  };
  form: {
    locataire_nom: string;
    locataire_prenom: string;
    locataire_dob: string;
    locataire_birthplace: string;
    locataire_nationality: string;
    locataire_previous_address: string;
    locataire_email: string;
    locataire_phone: string;
    locataire_profession: string;
    locataire_employer: string;
    entry_date: string;
    lease_duration_months: number;
    exchange_rate: number;
    exchange_rate_date: string;
    frais_remise_location: number;
    irl_trimestre: string;
    irl_indice: number;
    previous_tenant_rent_eur?: number | null;
    previous_tenant_departure_date?: string | null;
    clauses_particulieres?: string;
    annexe_documents?: string[];
  };
  amounts: { loyerCC: number; charges: number; loyerNu: number; depot: number };
  exitDate: string;
  prorata: { days: number; totalDays: number; eur: number };
}

export function bailDocxData(i: BailDocxInput) {
  const { property, room, form, amounts, prorata } = i;
  const bathroomFr: Record<string, string> = {
    private: "privée",
    shared: "partagée",
    semi_private: "semi-privée",
  };

  const extras: string[] = [];
  if (room.has_parking) extras.push(`Parking : ${room.parking_detail || "Oui"}`);
  if (room.has_balcony) extras.push("Balcon : Oui");
  if (room.has_terrace) extras.push("Terrasse : Oui");
  if (room.has_private_entrance) extras.push("Entrée privée : Oui");

  const communes = property.common_areas || [];
  const g = communes.slice(0, Math.ceil(communes.length / 2));
  const d = communes.slice(Math.ceil(communes.length / 2));

  const banque = BANQUES[property.name] ?? BANQUES["La Villa"];
  const duree = form.lease_duration_months || 12;
  const prorataActif = prorata.days > 0 && prorata.totalDays > 0 && prorata.days < prorata.totalDays;

  // Art. 3 loi 1989 : dernier loyer du précédent occupant, ou mention des 18 mois.
  const dernierLoyer =
    form.previous_tenant_rent_eur && form.previous_tenant_departure_date
      ? `Le dernier loyer acquitté par le précédent occupant de la chambre, qui l'a quittée le ${fDateTexte(form.previous_tenant_departure_date)}, s'élevait à ${nb(Number(form.previous_tenant_rent_eur))} € par mois (loyer hors charges).`
      : "La chambre n'a pas été occupée au cours des dix-huit derniers mois.";

  return {
    bailleur_nom: property.legal_entity_name?.trim() || property.name,
    siret: property.siret,
    tva: property.tva,
    siege_social: property.siege_social,
    loc_nom_complet: `${form.locataire_nom} ${form.locataire_prenom}`.trim(),
    loc_prenom_nom: `${form.locataire_prenom} ${form.locataire_nom}`.trim(),
    loc_naissance: fDateTexte(form.locataire_dob),
    loc_lieu_naissance: form.locataire_birthplace,
    loc_nationalite: form.locataire_nationality,
    loc_adresse_precedente: form.locataire_previous_address,
    loc_email: form.locataire_email,
    loc_tel: form.locataire_phone,
    loc_profession: form.locataire_profession,
    loc_employeur: form.locataire_employer,
    bien_ligne: `${property.name} - ${property.address}`,
    etage: room.floor,
    chambre: room.name,
    surface: surfaceFr(room.surface_m2),
    emplacement: room.location_detail || "—",
    description: room.description,
    sdb: `${bathroomFr[room.bathroom_type] || room.bathroom_type}${room.bathroom_detail ? ` — ${room.bathroom_detail}` : ""}`,
    extras,
    communes_g: g,
    communes_d: d,
    date_effet: fDateTexte(form.entry_date),
    duree_lettres: dureeLettres(duree),
    duree,
    date_fin: fDateTexte(i.exitDate),
    loyer_cc: nb(amounts.loyerCC),
    loyer_nu: nb(amounts.loyerNu),
    forfait: nb(amounts.charges),
    depot: nb(amounts.depot),
    indemnite: nb(form.frais_remise_location),
    prorata: prorataActif,
    prorata_texte: prorataActif
      ? `Prorata du premier mois : du ${fDateTexte(form.entry_date)} au dernier jour du mois (${prorata.days}/${prorata.totalDays} jours), soit ${nb(prorata.eur)} €.`
      : "",
    dernier_loyer_texte: dernierLoyer,
    irl_trimestre: form.irl_trimestre,
    irl_indice: Number(form.irl_indice).toLocaleString("fr-FR", { minimumFractionDigits: 2 }),
    banque: "Banque Palatine",
    titulaire_compte: banque.titulaire,
    iban: banque.iban,
    bic: "BSPFFRPPXXX",
    bailleur_signataires: property.manager_name || "Jérôme Austin / Fanny Piot",
    ville: villeDepuisAdresse(property.address),
    // CHF indicatif (decision Jerome 13/08) : l'euro reste LE prix contractuel,
    // le CHF fait le lien avec le site et parle aux frontaliers payes en francs.
    // Conversion exacte du jour, arrondie a l'entier — PAS l'arrondi commercial
    // du site (dizaine inferieure au taux fige) : quelques francs d'ecart
    // possibles selon le jour, c'est attendu.
    chf_indicatif: `soit ${nb(Math.round(amounts.loyerCC * form.exchange_rate))} CHF au taux BCE du ${form.exchange_rate_date} : ${form.exchange_rate} — pour indication uniquement`,
    // Clauses particulieres : sans elles le Word perdait silencieusement une
    // clause negociee que l'apercu affichait pourtant (constat bloquant n.1).
    has_clauses: !!form.clauses_particulieres?.trim(),
    clauses: form.clauses_particulieres?.trim() || "",
    // Annexes cochees dans le formulaire, ajoutees a la liste de l'article XIV.
    annexes_sup: form.annexe_documents || [],
  };
}

async function remplirGabarit(url: string, data: Record<string, unknown>): Promise<Blob> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Gabarit introuvable (${res.status}) : ${url}`);
  const buf = await res.arrayBuffer();
  const doc = new Docxtemplater(new PizZip(buf), {
    paragraphLoop: true,
    linebreaks: true,
    // Balise sans valeur -> chaine vide, jamais le litteral "undefined".
    nullGetter: () => "",
  });
  doc.render(data);
  return doc.getZip().generate({ type: "blob", mimeType: DOCX_MIME }) as Blob;
}

export function genererBailDocx(input: BailDocxInput): Promise<Blob> {
  return remplirGabarit(TEMPLATE_URL, bailDocxData(input));
}

// Annexe « Comment votre loyer est construit » — listée à l'article XIV du bail.
// Mêmes données que le bail + la maison et la date d'établissement (jour de génération).
export function genererAnnexeDocx(input: BailDocxInput): Promise<Blob> {
  return remplirGabarit(ANNEXE_URL, {
    ...bailDocxData(input),
    maison: input.property.name,
    date_etablie: fDateTexte(new Date().toISOString().slice(0, 10)),
  });
}
