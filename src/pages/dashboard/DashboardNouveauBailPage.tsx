import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Property {
  id: string;
  name: string;
  legal_entity_name: string;
  siret: string;
  tva: string;
  siege_social: string;
  id_fiscal: string;
  common_areas: string[];
  contract_building_desc: string;
}

interface Room {
  id: string;
  property_id: string;
  name: string;
  surface_m2: number;
  floor: number;
  description: string;
  bathroom_type: string;
  has_parking: boolean;
  parking_detail: string | null;
  rent_chf: number;
  specifics: string | null;
  furniture_inventory: string | null;
}

interface FormData {
  property_id: string;
  room_id: string;
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
  loyer_chf: number;
  exchange_rate: number;
  charges_energy: number;
  charges_maintenance: number;
  charges_services: number;
  frais_dossier: number;
  irl_trimestre: string;
  irl_indice: number;
  clauses_particulieres: string;
}

interface ContractData {
  property: Property;
  room: Room;
  form: FormData;
  exit_date: string;
  loyer_eur: number;
  depot_eur: number;
}

function ph(val: string | undefined | null, placeholder: string): string {
  return val?.trim() ? val : `<span style="color:#c0392b;font-style:italic">[${placeholder}]</span>`;
}

function fDate(d: string | undefined | null): string {
  if (!d) return `<span style="color:#c0392b;font-style:italic">[date]</span>`;
  try {
    return new Date(d + 'T00:00:00').toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return `<span style="color:#c0392b;font-style:italic">[date invalide]</span>`;
  }
}

function fEUR(n: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);
}

function fCHF(n: number): string {
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
    maximumFractionDigits: 0,
  }).format(n);
}

function generateContractHTML(data: ContractData): string {
  const {
    property,
    room,
    form,
    exit_date,
    loyer_eur,
    depot_eur,
  } = data;

  const commonAreasList = (property.common_areas || [])
    .map(area => `<li>${area}</li>`)
    .join('');

  const chargesTable = `
    <table style="width:100%;border-collapse:collapse;margin:10px 0;">
      <tr style="border-bottom:1px solid #e0e0e0;">
        <td style="padding:8px;font-weight:600;width:50%;">Catégorie</td>
        <td style="padding:8px;font-weight:600;text-align:right;width:25%;">Montant EUR</td>
        <td style="padding:8px;font-weight:600;text-align:right;width:25%;">Montant CHF</td>
      </tr>
      <tr style="border-bottom:1px solid #f0f0f0;">
        <td style="padding:8px;">Énergie (eau, chauffage, électricité)</td>
        <td style="padding:8px;text-align:right;">${fEUR(form.charges_energy / 0.9400)}</td>
        <td style="padding:8px;text-align:right;">${fCHF(form.charges_energy)}</td>
      </tr>
      <tr style="border-bottom:1px solid #f0f0f0;">
        <td style="padding:8px;">Maintenance & Entretien</td>
        <td style="padding:8px;text-align:right;">${fEUR(form.charges_maintenance / 0.9400)}</td>
        <td style="padding:8px;text-align:right;">${fCHF(form.charges_maintenance)}</td>
      </tr>
      <tr style="border-bottom:1px solid #f0f0f0;">
        <td style="padding:8px;">Services (ménage, yoga, support)</td>
        <td style="padding:8px;text-align:right;">${fEUR(form.charges_services / 0.9400)}</td>
        <td style="padding:8px;text-align:right;">${fCHF(form.charges_services)}</td>
      </tr>
      <tr style="background:#f9f7f4;font-weight:600;border-bottom:2px solid #c9a96e;">
        <td style="padding:8px;">TOTAL CHARGES MENSUELLES</td>
        <td style="padding:8px;text-align:right;">${fEUR((form.charges_energy + form.charges_maintenance + form.charges_services) / 0.9400)}</td>
        <td style="padding:8px;text-align:right;">${fCHF(form.charges_energy + form.charges_maintenance + form.charges_services)}</td>
      </tr>
    </table>
  `;

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <style>
        body {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 11px;
          line-height: 1.7;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .contract-container {
          max-width: 210mm;
          height: 297mm;
          margin: 0 auto;
          padding: 20mm 14mm;
          background: white;
        }
        .contract-header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #c9a96e;
          padding-bottom: 15px;
        }
        .contract-header img {
          max-height: 50px;
          margin-bottom: 10px;
        }
        .contract-header h1 {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 18px;
          font-weight: 700;
          margin: 10px 0;
          color: #333;
        }
        .contract-header p {
          margin: 5px 0;
          font-size: 10px;
          color: #666;
        }
        .party-box {
          background: #faf8f5;
          border-left: 3px solid #c9a96e;
          padding: 10px;
          margin: 15px 0;
          font-size: 10px;
        }
        .party-box strong {
          color: #c9a96e;
          font-weight: 600;
        }
        h2 {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 14px;
          font-weight: 700;
          margin: 20px 0 10px 0;
          color: #333;
          border-bottom: 1px solid #c9a96e;
          padding-bottom: 5px;
        }
        h3 {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 12px;
          font-weight: 600;
          margin: 12px 0 8px 0;
          color: #333;
        }
        .article {
          margin: 15px 0;
          text-align: justify;
        }
        .article-title {
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }
        ul, ol {
          margin: 8px 0;
          padding-left: 20px;
        }
        li {
          margin: 4px 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 10px 0;
        }
        td, th {
          padding: 8px;
          border: 1px solid #e0e0e0;
        }
        th {
          background: #f0f0f0;
          font-weight: 600;
        }
        .signature-section {
          margin-top: 40px;
          display: flex;
          justify-content: space-around;
          font-size: 10px;
        }
        .signature-box {
          width: 40%;
          border-top: 1px solid #333;
          text-align: center;
          padding-top: 20px;
        }
        .page-break {
          page-break-before: always;
          margin-top: 40px;
        }
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .contract-container {
            max-width: 100%;
            height: auto;
            padding: 20mm 14mm;
            page-break-after: always;
          }
        }
      </style>
    </head>
    <body>
      <div class="contract-container">
        <div class="contract-header">
          <img src="https://www.lavillacoliving.com/logos/logo-full.png" alt="La Villa Coliving" />
          <p style="font-weight:600;">${property.legal_entity_name}</p>
          <h1>CONTRAT DE LOCATION<br/>DE LOGEMENT MEUBLÉ</h1>
        </div>

        <div class="party-box">
          <strong>BAILLEUR :</strong><br/>
          ${ph(property.legal_entity_name, 'Entité juridique')}<br/>
          SIRET : ${ph(property.siret, 'SIRET')}<br/>
          TVA : ${ph(property.tva, 'TVA')}<br/>
          Siège social : ${ph(property.siege_social, 'Siège social')}<br/>
          Représenté par : Jérôme AUSTIN, Gérant
        </div>

        <div class="party-box">
          <strong>LOCATAIRE :</strong><br/>
          ${ph(form.locataire_nom, 'Nom')} ${ph(form.locataire_prenom, 'Prénom')}<br/>
          Né(e) le ${fDate(form.locataire_dob)} à ${ph(form.locataire_birthplace, 'Lieu de naissance')}<br/>
          Nationalité : ${ph(form.locataire_nationality, 'Nationalité')}<br/>
          Adresse précédente : ${ph(form.locataire_previous_address, 'Adresse')}<br/>
          Email : ${ph(form.locataire_email, 'Email')}<br/>
          Téléphone : ${ph(form.locataire_phone, 'Téléphone')}<br/>
          Profession : ${ph(form.locataire_profession, 'Profession')}<br/>
          Employeur : ${ph(form.locataire_employer, 'Employeur')}
        </div>

        <h2>ARTICLE I — DÉSIGNATION DES PARTIES</h2>
        <div class="article">
          Entre les parties ci-dessus désignées, il est convenu ce qui suit.
        </div>

        <h2>ARTICLE II — OBJET DU CONTRAT</h2>
        <div class="article">
          Le bailleur loue au locataire un logement meublé comprenant :
          <ul>
            <li><strong>Chambre :</strong> ${ph(room.name, 'Chambre')}</li>
            <li><strong>Surface :</strong> ${room.surface_m2} m²</li>
            <li><strong>Étage :</strong> ${room.floor}</li>
            <li><strong>Description :</strong> ${ph(room.description, 'Description')}</li>
            <li><strong>Salle de bain :</strong> ${ph(room.bathroom_type, 'Type')}</li>
            ${room.has_parking ? `<li><strong>Parking :</strong> ${room.parking_detail || 'Oui'}</li>` : ''}
          </ul>
          <p><strong>Accès aux parties communes :</strong></p>
          <ul>
            ${commonAreasList}
          </ul>
          <p><strong>Services inclus au loyer :</strong></p>
          <ul>
            <li>Électricité, eau froide et chaude, chauffage</li>
            <li>Linge de lit (fourniture et entretien)</li>
            <li>Ménage 2 fois par semaine des parties communes</li>
            <li>Entretien des espaces extérieurs</li>
            <li>Piscine (accès et entretien)</li>
            <li>Événements communautaires</li>
            <li>Support WhatsApp/Email <48h</li>
            <li>Cours de yoga et coaching sportif</li>
            <li>Internet très haut débit</li>
            <li>Accès streaming (Netflix, Spotify, etc.)</li>
            <li>Fournitures de base mensuelles</li>
            <li>Ordures ménagères, balayage, assainissement</li>
          </ul>
        </div>

        <h2>ARTICLE III — DATE DE PRISE D'EFFET ET DURÉE</h2>
        <div class="article">
          La location prend effet le <strong>${fDate(form.entry_date)}</strong> pour une durée de <strong>douze (12) mois</strong>, soit jusqu'au <strong>${fDate(exit_date)}</strong>.
          <br/><br/>
          À l'expiration de cette période, le contrat se renouvelle par reconduction tacite pour des périodes successives de douze mois, sauf dénonciation notifiée au moins un mois avant l'expiration du contrat par le locataire, ou trois mois par le bailleur.
        </div>

        <div class="page-break"></div>

        <h2>ARTICLE IV — CONDITIONS FINANCIÈRES</h2>
        <div class="article">
          <h3>Loyer mensuel :</h3>
          <ul>
            <li><strong>En CHF :</strong> ${fCHF(form.loyer_chf)} (au taux de ${form.exchange_rate})</li>
            <li><strong>En EUR :</strong> ${fEUR(loyer_eur)}</li>
          </ul>
          <p><strong>Prorata :</strong> En cas d'entrée en cours de mois, le loyer du premier mois sera calculé au prorata des jours.</p>
          <h3>Charges forfaitaires mensuelles :</h3>
          ${chargesTable}
          <h3>Révision annuelle (IRL) :</h3>
          <ul>
            <li>Trimestre de référence : ${ph(form.irl_trimestre, '3ème trimestre 2025')}</li>
            <li>Indice de référence : ${form.irl_indice}</li>
            <li>La révision s'effectue chaque année à la date anniversaire du contrat.</li>
          </ul>
          <h3>Frais de dossier :</h3>
          <ul>
            <li><strong>Montant :</strong> ${fEUR(form.frais_dossier / form.exchange_rate)} (${fCHF(form.frais_dossier)})</li>
            <li><strong>Statut :</strong> OFFERTS par le bailleur</li>
          </ul>
          <h3>Modalités de paiement :</h3>
          <ul>
            <li>Le loyer et les charges doivent être versés avant le 5 du mois.</li>
            <li>Virement bancaire sur le compte du bailleur.</li>
          </ul>
        </div>

        <h2>ARTICLE V — GARANTIES</h2>
        <div class="article">
          Le locataire versera un dépôt de garantie égal à deux (2) mois de loyer, soit <strong>${fEUR(depot_eur)} (${fCHF(depot_eur * form.exchange_rate)})</strong>, restitué dans les deux (2) mois suivant la fin du contrat, selon l'état des lieux.
        </div>

        <h2>ARTICLE VI — CLAUSE RÉSOLUTOIRE</h2>
        <div class="article">
          Le bailleur se réserve le droit de résilier le contrat en cas de non-paiement du loyer ou des charges, sans préjudice du droit de poursuivre le recouvrement des sommes dues.
        </div>

        <div class="page-break"></div>

        <h2>ARTICLE VII — OBLIGATIONS DU LOCATAIRE</h2>
        <div class="article">
          Le locataire s'engage à :
          <ol>
            <li>Payer le loyer et les charges aux dates et lieux convenus;</li>
            <li>Maintenir le logement en bon état de propreté et d'entretien;</li>
            <li>Respecter le silence et bonnes mœurs, notamment entre 22h et 8h;</li>
            <li>Ne point inviter d'hôtes de manière prolongée sans accord préalable;</li>
            <li>Utiliser les parties communes avec responsabilité et courtoisie;</li>
            <li>Respecter le Règlement Intérieur La Villa (annexe au présent contrat);</li>
            <li>Déclarer tout incident ou dommage auprès du bailleur dans les 48h;</li>
            <li>Rendre le logement en bon état à la fin du contrat (usure normale exceptée);</li>
            <li>Participer aux états des lieux d'entrée et de sortie.</li>
          </ol>
        </div>

        <h2>ARTICLE VIII — OBLIGATIONS DU BAILLEUR</h2>
        <div class="article">
          Le bailleur s'engage à :
          <ol>
            <li>Assurer la jouissance paisible du logement;</li>
            <li>Maintenir les lieux en bon état de réparation et de viabilité;</li>
            <li>Fournir les services décrits à l'article II;</li>
            <li>Répondre aux demandes d'entretien dans un délai raisonnable (max 48h);</li>
            <li>Respecter la vie privée du locataire et donner un préavis de 48h avant visite.</li>
          </ol>
        </div>

        <h2>ARTICLE IX — ÉTAT DES LIEUX</h2>
        <div class="article">
          L'état des lieux d'entrée et de sortie sera établi par la société <strong>Nockee</strong>, prestataire mandaté par le bailleur. Le locataire reçoit un exemplaire.
        </div>

        <h2>ARTICLE X — INVENTAIRE DU MOBILIER</h2>
        <div class="article">
          L'inventaire détaillé du mobilier et des équipements fournis est joint en annexe au présent contrat. Le locataire s'engage à en prendre soin et à le restituer en bon état.
        </div>

        <h2>ARTICLE XI — DIAGNOSTICS TECHNIQUES</h2>
        <div class="article">
          Conformément à la réglementation française, le bailleur fournit au locataire :
          <ul>
            <li>Diagnostic de Performance Énergétique (DPE)</li>
            <li>État du Risque et Pollution (ERP)</li>
            <li>Constat de Risque d'Exposition au Plomb (CREP)</li>
            <li>Diagnostic Amiante (CREP)</li>
            <li>Diagnostic Bruit</li>
          </ul>
        </div>

        <h2>ARTICLE XII — RÈGLEMENT INTÉRIEUR</h2>
        <div class="article">
          Le locataire accepte le Règlement Intérieur La Villa Coliving (la "Bible du Coliver"), joint en annexe, qui précise les règles de vie commune, l'usage des parties communes et les procédures de gestion interne.
        </div>

        <h2>ARTICLE XIII — ANNEXES</h2>
        <div class="article">
          Sont annexées au présent contrat :
          <ul>
            <li>Inventaire du mobilier et équipements</li>
            <li>Règlement Intérieur La Villa Coliving</li>
            <li>Diagnostics techniques</li>
            <li>Photos d'état des lieux d'entrée</li>
          </ul>
        </div>

        <div class="signature-section">
          <div class="signature-box">
            <div>Fait à ${ph(property.siege_social?.split(',')[0] || '', 'Ville')}</div>
            <div style="font-size:9px;margin-top:15px;">Signature du bailleur</div>
            <div style="font-size:9px;margin-top:30px;font-style:italic;">Jérôme AUSTIN</div>
          </div>
          <div class="signature-box">
            <div>Le ${fDate(form.entry_date)}</div>
            <div style="font-size:9px;margin-top:15px;">Signature du locataire</div>
            <div style="font-size:9px;margin-top:30px;font-style:italic;">${ph(form.locataire_prenom, 'Prénom')} ${ph(form.locataire_nom, 'Nom')}</div>
          </div>
        </div>

        <div style="margin-top:40px;padding-top:20px;border-top:1px solid #c9a96e;text-align:center;font-size:9px;color:#999;">
          Lu et approuvé
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
}

async function fetchExchangeRate(): Promise<number> {
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=EUR&to=CHF');
    if (res.ok) {
      const data = await res.json();
      return data.rates?.CHF || 0.9400;
    }
  } catch {
    // Fallback to ECB SDMX API
    try {
      const res = await fetch(
        'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml'
      );
      if (res.ok) {
        const xml = await res.text();
        const match = xml.match(
          /currency="CHF"[^>]*rate="([0-9.]+)"/
        );
        if (match) return parseFloat(match[1]);
      }
    } catch {
      // Fallback
    }
  }
  return 0.9400;
}

function generatePDF(contractHTML: string): void {
  const css = [
    "@page{size:A4;margin:20mm 15mm 25mm 15mm}",
    "*{margin:0;padding:0;box-sizing:border-box}",
    "body{font-family:Georgia,serif;font-size:11pt;line-height:1.5;color:#1a1a1a;background:#fff}",
    "h1{font-size:18pt;text-align:center;margin:20px 0 10px}",
    "h2{font-size:13pt;margin:18px 0 6px;border-bottom:1px solid #c9a96e;padding-bottom:4px}",
    "p{margin:6px 0;text-align:justify}",
    "table{width:100%;border-collapse:collapse;margin:8px 0}",
    "td,th{padding:6px 8px;border-bottom:1px solid #e0e0e0;font-size:10pt}",
    "ul,ol{margin:6px 0 6px 20px}li{margin:3px 0}",
    ".page-break{page-break-before:always}",
    "@media print{.no-print{display:none!important}}",
    ".bar{position:fixed;top:0;left:0;right:0;background:#c9a96e;color:#fff;padding:12px 24px;display:flex;align-items:center;gap:16px;z-index:9999;font-family:Arial,sans-serif}",
    ".bar button{background:#fff;color:#333;border:none;padding:8px 20px;border-radius:4px;font-weight:600;cursor:pointer}",
    ".wrap{padding-top:60px;max-width:210mm;margin:0 auto;padding-left:15mm;padding-right:15mm}",
  ].join("
");
  const html = [
    "<!DOCTYPE html><html lang=fr><head><meta charset=UTF-8>",
    "<title>Bail Meublé - La Villa Coliving</title>",
    "<style>" + css + "</style></head><body>",
    "<div class=bar><span>Bail La Villa Coliving</span>",
    '<button class=no-print onclick="window.print()">Enregistrer PDF</button>',
    '<button class=no-print onclick="window.close()">Fermer</button></div>',
    "<div class=wrap>" + contractHTML + "</div>",
    "</body></html>",
  ].join("
");
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
}



export default function DashboardNouveauBailPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [exchangeRate, setExchangeRate] = useState(0.9400);

  const [form, setForm] = useState<FormData>({
    property_id: '',
    room_id: '',
    locataire_nom: '',
    locataire_prenom: '',
    locataire_dob: '',
    locataire_birthplace: '',
    locataire_nationality: '',
    locataire_previous_address: '',
    locataire_email: '',
    locataire_phone: '',
    locataire_profession: '',
    locataire_employer: '',
    entry_date: '',
    loyer_chf: 0,
    exchange_rate: exchangeRate,
    charges_energy: 130,
    charges_maintenance: 200,
    charges_services: 90,
    frais_dossier: 380,
    irl_trimestre: '3ème trimestre 2025',
    irl_indice: 145.77,
    clauses_particulieres: '',
  });

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Load fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Source+Serif+4:wght@400;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  // Load properties and exchange rate
  useEffect(() => {
    const loadData = async () => {
      const [propsRes, roomsRes] = await Promise.all([
        supabase.from('properties').select('*'),
        supabase.from('rooms').select('*'),
      ]);

      if (propsRes.data) setProperties(propsRes.data);
      if (roomsRes.data) setRooms(roomsRes.data);

      const rate = await fetchExchangeRate();
      setExchangeRate(rate);
      setForm((prev) => ({ ...prev, exchange_rate: rate }));
    };

    loadData();
  }, []);

  // Handle property change
  const handlePropertyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pid = e.target.value;
    setForm((prev) => ({ ...prev, property_id: pid, room_id: '' }));

    const prop = properties.find((p) => p.id === pid);
    setSelectedProperty(prop || null);

    const propRooms = rooms.filter((r) => r.property_id === pid);
    setFilteredRooms(propRooms);
    setSelectedRoom(null);
  };

  // Handle room change
  const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rid = e.target.value;
    setForm((prev) => ({ ...prev, room_id: rid }));

    const room = rooms.find((r) => r.id === rid);
    setSelectedRoom(room || null);
    if (room) {
      setForm((prev) => ({
        ...prev,
        loyer_chf: room.rent_chf,
      }));
    }
  };

  // Calculate exit date
  const exitDate = form.entry_date
    ? new Date(new Date(form.entry_date).setFullYear(new Date(form.entry_date).getFullYear() + 1))
        .toISOString()
        .split('T')[0]
    : '';

  // Calculate loyer EUR
  const loyerEUR = Math.round(form.loyer_chf / form.exchange_rate);
  const depotEUR = loyerEUR * 2;

  // Generate contract data
  const contractData: ContractData | null =
    selectedProperty && selectedRoom
      ? {
          property: selectedProperty,
          room: selectedRoom,
          form,
          exit_date: exitDate,
          loyer_eur: loyerEUR,
          depot_eur: depotEUR,
        }
      : null;

  const contractHTML = contractData ? generateContractHTML(contractData) : '';

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#fafafa' }}>
      {/* LEFT PANEL — FORM */}
      <div
        style={{
          flex: '0 0 520px',
          overflowY: 'auto',
          background: 'white',
          padding: '30px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        }}
      >
        <h1 style={{ color: '#333', marginBottom: '30px', fontFamily: 'Georgia, serif' }}>
          Nouveau Bail
        </h1>

        <div style={{ marginBottom: '25px' }}>
          <label
            style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#333',
            }}
          >
            Propriété
          </label>
          <select
            value={form.property_id}
            onChange={handlePropertyChange}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '14px',
            }}
          >
            <option value="">-- Sélectionner une propriété --</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {selectedProperty && (
          <>
            <div style={{ marginBottom: '25px' }}>
              <label
                style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#333',
                }}
              >
                Chambre
              </label>
              <select
                value={form.room_id}
                onChange={handleRoomChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                }}
              >
                <option value="">-- Sélectionner une chambre --</option>
                {filteredRooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedRoom && (
              <>
                <div
                  style={{
                    background: '#faf8f5',
                    padding: '15px',
                    borderRadius: '4px',
                    marginBottom: '25px',
                    fontSize: '13px',
                    color: '#666',
                  }}
                >
                  <p>
                    <strong>Surface :</strong> {selectedRoom.surface_m2} m²
                  </p>
                  <p>
                    <strong>Étage :</strong> {selectedRoom.floor}
                  </p>
                  <p>
                    <strong>SdB :</strong> {selectedRoom.bathroom_type}
                  </p>
                  {selectedRoom.has_parking && (
                    <p>
                      <strong>Parking :</strong> {selectedRoom.parking_detail || 'Oui'}
                    </p>
                  )}
                </div>
              </>
            )}
          </>
        )}

        <h3 style={{ color: '#333', marginBottom: '15px', marginTop: '30px' }}>Locataire</h3>

        <input
          type="text"
          placeholder="Nom"
          value={form.locataire_nom}
          onChange={(e) => setForm((prev) => ({ ...prev, locataire_nom: e.target.value }))}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px',
          }}
        />

        <input
          type="text"
          placeholder="Prénom"
          value={form.locataire_prenom}
          onChange={(e) => setForm((prev) => ({ ...prev, locataire_prenom: e.target.value }))}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px',
          }}
        />

        <input
          type="date"
          placeholder="Date de naissance"
          value={form.locataire_dob}
          onChange={(e) => setForm((prev) => ({ ...prev, locataire_dob: e.target.value }))}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px',
          }}
        />

        <input
          type="text"
          placeholder="Lieu de naissance"
          value={form.locataire_birthplace}
          onChange={(e) => setForm((prev) => ({ ...prev, locataire_birthplace: e.target.value }))}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px',
          }}
        />

        <input
          type="text"
          placeholder="Nationalité"
          value={form.locataire_nationality}
          onChange={(e) => setForm((prev) => ({ ...prev, locataire_nationality: e.target.value }))}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px',
          }}
        />

        <input
          type="text"
          placeholder="Adresse précédente"
          value={form.locataire_previous_address}
          onChange={(e) => setForm((prev) => ({ ...prev, locataire_previous_address: e.target.value }))}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px',
          }}
        />

        <input
          type="email"
          placeholder="Email"
          value={form.locataire_email}
          onChange={(e) => setForm((prev) => ({ ...prev, locataire_email: e.target.value }))}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px',
          }}
        />

        <input
          type="tel"
          placeholder="Téléphone"
          value={form.locataire_phone}
          onChange={(e) => setForm((prev) => ({ ...prev, locataire_phone: e.target.value }))}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px',
          }}
        />

        <input
          type="text"
          placeholder="Profession"
          value={form.locataire_profession}
          onChange={(e) => setForm((prev) => ({ ...prev, locataire_profession: e.target.value }))}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px',
          }}
        />

        <input
          type="text"
          placeholder="Employeur"
          value={form.locataire_employer}
          onChange={(e) => setForm((prev) => ({ ...prev, locataire_employer: e.target.value }))}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '20px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px',
          }}
        />

        <h3 style={{ color: '#333', marginBottom: '15px' }}>Conditions du bail</h3>

        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#666' }}>
          Date d'entrée
        </label>
        <input
          type="date"
          value={form.entry_date}
          onChange={(e) => setForm((prev) => ({ ...prev, entry_date: e.target.value }))}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '15px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px',
          }}
        />

        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#666' }}>
          Taux de change (1 EUR = X CHF)
        </label>
        <input
          type="number"
          step="0.0001"
          value={form.exchange_rate}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, exchange_rate: parseFloat(e.target.value) || 0.9400 }))
          }
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '15px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px',
          }}
        />

        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#666' }}>
          Charges mensuelles — Énergie (EUR)
        </label>
        <input
          type="number"
          step="1"
          value={form.charges_energy}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, charges_energy: parseInt(e.target.value) || 0 }))
          }
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px',
          }}
        />

        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#666' }}>
          Charges mensuelles — Maintenance (EUR)
        </label>
        <input
          type="number"
          step="1"
          value={form.charges_maintenance}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, charges_maintenance: parseInt(e.target.value) || 0 }))
          }
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px',
          }}
        />

        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#666' }}>
          Charges mensuelles — Services (EUR)
        </label>
        <input
          type="number"
          step="1"
          value={form.charges_services}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, charges_services: parseInt(e.target.value) || 0 }))
          }
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px',
          }}
        />

        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#666' }}>
          Frais de dossier (EUR) — Offerts
        </label>
        <input
          type="number"
          step="1"
          value={form.frais_dossier}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, frais_dossier: parseInt(e.target.value) || 0 }))
          }
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px',
          }}
        />

        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#666' }}>
          IRL Trimestre de référence
        </label>
        <input
          type="text"
          value={form.irl_trimestre}
          onChange={(e) => setForm((prev) => ({ ...prev, irl_trimestre: e.target.value }))}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px',
          }}
        />

        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#666' }}>
          IRL Indice
        </label>
        <input
          type="number"
          step="0.01"
          value={form.irl_indice}
          onChange={(e) => setForm((prev) => ({ ...prev, irl_indice: parseFloat(e.target.value) || 0 }))
          }
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '20px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px',
          }}
        />

        <h3 style={{ color: '#333', marginBottom: '15px' }}>Clauses particulières</h3>
        <textarea
          placeholder="Ajouter des clauses spécifiques..."
          value={form.clauses_particulieres}
          onChange={(e) => setForm((prev) => ({ ...prev, clauses_particulieres: e.target.value }))}
          style={{
            width: '100%',
            padding: '10px',
            minHeight: '100px',
            marginBottom: '20px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px',
            fontFamily: 'monospace',
          }}
        />

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => contractHTML && generatePDF(contractHTML)}
            disabled={!contractHTML}
            style={{
              flex: 1,
              padding: '12px',
              background: '#c9a96e',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontWeight: '600',
              cursor: contractHTML ? 'pointer' : 'not-allowed',
              fontSize: '14px',
            }}
          >
            Générer le PDF
          </button>
          <button
            onClick={() => window.print()}
            disabled={!contractHTML}
            style={{
              flex: 1,
              padding: '12px',
              background: '#999',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontWeight: '600',
              cursor: contractHTML ? 'pointer' : 'not-allowed',
              fontSize: '14px',
            }}
          >
            ⎙ Imprimer
          </button>
        </div>
      </div>

      {/* RIGHT PANEL — PREVIEW */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          background: '#f5f5f5',
          padding: '30px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {contractHTML ? (
          <div
            id="contract-preview"
            style={{
              background: 'white',
              width: '210mm',
              boxShadow: '0 0 20px rgba(0,0,0,0.15)',
              borderRadius: '4px',
            }}
            dangerouslySetInnerHTML={{ __html: contractHTML }}
          />
        ) : (
          <div
            style={{
              textAlign: 'center',
              color: '#999',
              paddingTop: '100px',
              fontSize: '16px',
            }}
          >
            Sélectionnez une propriété et une chambre pour voir l'aperçu du contrat
          </div>
        )}
      </div>

      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          div[style*="flex: 0 0 520px"] {
            display: none;
          }
          div[style*="flex: 1"] {
            flex: 1 !important;
            padding: 0 !important;
            background: white !important;
          }
          #contract-preview {
            width: 100% !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
