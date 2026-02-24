import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

interface CourrierIRLData {
  tenantFirstName: string;
  tenantLastName: string;
  roomNumber: number;
  propertyName: string;
  propertyAddress: string;
  currentRent: number;
  newRent: number;
  variationPct: string;
  augmentation: number;
  irlReference: string; // ex: "T4 2025"
  irlOldValue: number;
  irlNewValue: number;
  effectiveDate: string; // formatted date
  firstPaymentMonth: string; // ex: "mars 2026"
  signataire: string;
}

const s = StyleSheet.create({
  page: { padding: 50, fontFamily: "Helvetica", fontSize: 11, lineHeight: 1.6, color: "#1a1a2e" },
  logo: { width: 140, marginBottom: 20 },
  header: { marginBottom: 30 },
  expediteur: { fontSize: 10, color: "#555", marginBottom: 4 },
  destinataire: { fontSize: 11, marginTop: 16, marginBottom: 8 },
  date: { fontSize: 10, color: "#888", textAlign: "right" as const, marginBottom: 20 },
  objet: { fontSize: 11, fontWeight: "bold" as const, marginBottom: 16, borderBottom: "1px solid #e0e0e0", paddingBottom: 8 },
  paragraph: { fontSize: 11, marginBottom: 12, textAlign: "justify" as const },
  indiceBlock: { marginBottom: 12, paddingLeft: 16 },
  indiceLine: { fontSize: 11, marginBottom: 2 },
  loyerBlock: { marginBottom: 12, paddingLeft: 16 },
  loyerLine: { fontSize: 11, marginBottom: 2 },
  signature: { marginTop: 30 },
  sigName: { fontWeight: "bold" as const, fontSize: 11 },
  sigEntity: { fontSize: 10, color: "#555" },
  footer: { position: "absolute" as const, bottom: 30, left: 50, right: 50, textAlign: "center" as const, fontSize: 8, color: "#aaa", borderTop: "1px solid #e0e0e0", paddingTop: 8 },
});

// Manual formatter — toLocaleString produces non-breaking spaces that @react-pdf renders as "/"
const fmt = (n: number) => {
  const [intPart, decPart] = Math.abs(n).toFixed(2).split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return (n < 0 ? '-' : '') + grouped + ',' + decPart + ' \u20AC';
};

export default function CourrierIRLPDF({ data }: { data: CourrierIRLData }) {
  const today = new Date();
  const dateStr = today.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Logo */}
        <Image style={s.logo} src="https://www.lavillacoliving.com/logos/logo-full.png" />

        {/* Header */}
        <View style={s.header}>
          <Text style={s.expediteur}>La Villa Coliving</Text>
          <Text style={s.expediteur}>{data.propertyName}</Text>
          <Text style={s.expediteur}>{data.propertyAddress}</Text>

          <Text style={s.destinataire}>
            {data.tenantFirstName} {data.tenantLastName}
          </Text>
          <Text style={s.destinataire}>
            Chambre {data.roomNumber} — {data.propertyName}
          </Text>
        </View>

        <Text style={s.date}>{dateStr}</Text>

        {/* Objet */}
        <Text style={s.objet}>
          Objet : Notification de révision annuelle du loyer (IRL)
        </Text>

        {/* Corps */}
        <Text style={s.paragraph}>
          Bonjour {data.tenantFirstName},
        </Text>

        <Text style={s.paragraph}>
          Nous espérons que vous vous sentez pleinement chez vous au sein de La Villa Coliving et que votre expérience au quotidien continue d'y être agréable !
        </Text>

        <Text style={s.paragraph}>
          Dans le cadre du fonctionnement normal de votre contrat de location, nous souhaitions vous informer de l'actualisation annuelle de votre loyer, conformément aux dispositions prévues dans votre bail et à l'indice de référence des loyers (IRL) publié par l'INSEE.
        </Text>

        <Text style={s.paragraph}>Sur la base de l'indice suivant :</Text>

        <View style={s.indiceBlock}>
          <Text style={s.indiceLine}>• Indice de référence : IRL — {data.irlReference}</Text>
          <Text style={s.indiceLine}>• Ancien indice : {data.irlOldValue.toFixed(2)}</Text>
          <Text style={s.indiceLine}>• Nouvel indice : {data.irlNewValue.toFixed(2)}</Text>
        </View>

        <Text style={s.paragraph}>
          L'augmentation est applicable à partir du {data.effectiveDate} et est redevable à compter du loyer du mois de {data.firstPaymentMonth}.
        </Text>

        <Text style={s.paragraph}>Votre loyer sera ajusté comme suit :</Text>

        <View style={s.loyerBlock}>
          <Text style={s.loyerLine}>• Loyer actuel charges incluses : {fmt(data.currentRent)}</Text>
          <Text style={s.loyerLine}>• Nouveau loyer charges incluses : {fmt(data.newRent)}</Text>
          <Text style={s.loyerLine}>• Évolution mensuelle : +{fmt(data.augmentation)} (+{data.variationPct}%)</Text>
        </View>

        <Text style={s.paragraph}>
          Nous tenons à souligner que cette révision est strictement encadrée par la réglementation et qu'elle reste modérée, afin de préserver l'équilibre entre qualité de vie et accessibilité.
        </Text>

        <Text style={s.paragraph}>
          Nous vous remercions sincèrement pour la confiance que vous nous accordez. Nous restons bien entendu à votre écoute pour toute question ou échange.
        </Text>

        <Text style={s.paragraph}>Bien chaleureusement,</Text>

        {/* Signature */}
        <View style={s.signature}>
          <Text style={s.sigName}>{data.signataire}</Text>
          <Text style={s.sigEntity}>La Villa Coliving</Text>
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Text>La Villa Coliving — lavillacoliving.com — contact@lavillacoliving.com</Text>
        </View>
      </Page>
    </Document>
  );
}
