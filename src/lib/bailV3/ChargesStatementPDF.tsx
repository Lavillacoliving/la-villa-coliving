/**
 * « État récapitulatif des charges récupérables » d'une maison pour un exercice (lot 2 du bail v3, 10/11/2026) :
 * le document que le bail v3 tient « à la disposition du Locataire » (article du loyer, forfait de charges).
 * Mêmes styles que le bail (BailV3PDF.tsx : Helvetica 10, filets dorés, encadré beige, tableau à en-tête doré).
 * Contenu = ChargesStatement (chargesEntry.ts) : jamais les notes internes de la saisie.
 *
 * Deux présentations selon `st.unit` : « chambre » = forfait du bail v3 (loi de 1989, réparti entre les chambres,
 * arrondi à l'euro) ; « logement » = bien loué en entier, hors générateur (Mont-Blanc) : montant mensuel exact, et
 * aucune mention du forfait légal, les conditions de prise en charge étant celles de son bail.
 */
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type { ChargesStatement } from "./chargesEntry";
import { fEUR, fDate } from "./format";

const gold = "#c9a96e";

// lineHeight porté par chaque style de texte, jamais par la page ni par un View (sinon le pied de page fixe disparaît
// avec react-pdf 4) ; paddingBottom 80 pour que le corps ne recouvre pas ce pied.
const s = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, color: "#333", paddingTop: 36, paddingBottom: 64, paddingHorizontal: 55 },
  headerBlock: { textAlign: "center", marginBottom: 12, borderBottomWidth: 2, borderBottomColor: gold, paddingBottom: 8 },
  logo: { width: 66, marginBottom: 2, alignSelf: "center" },
  title: { fontSize: 14, fontFamily: "Helvetica-Bold", marginTop: 4, marginBottom: 2, lineHeight: 1.3 },
  sub: { fontSize: 10, lineHeight: 1.5, color: "#555" },
  box: { backgroundColor: "#faf8f5", borderLeftWidth: 3, borderLeftColor: gold, padding: 9, marginBottom: 10 },
  boxLabel: { fontSize: 9, lineHeight: 1.6, fontFamily: "Helvetica-Bold", color: gold },
  boxText: { fontSize: 9.5, lineHeight: 1.6 },
  body: { fontSize: 10, lineHeight: 1.6, marginBottom: 8, textAlign: "justify" },
  sectionTitle: { fontSize: 11, lineHeight: 1.6, fontFamily: "Helvetica-Bold", marginTop: 10, marginBottom: 5, borderBottomWidth: 1, borderBottomColor: gold, paddingBottom: 3 },
  row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#e0e0e0" },
  headRow: { flexDirection: "row", borderBottomWidth: 2, borderBottomColor: gold, backgroundColor: "#f9f7f4" },
  totalRow: { flexDirection: "row", borderBottomWidth: 2, borderBottomColor: gold },
  cell: { fontSize: 8.5, lineHeight: 1.45, paddingVertical: 4, paddingHorizontal: 5 },
  cellBold: { fontSize: 8.5, lineHeight: 1.45, paddingVertical: 4, paddingHorizontal: 5, fontFamily: "Helvetica-Bold" },
  small: { fontSize: 8, lineHeight: 1.45, color: "#666", textAlign: "justify", marginTop: 10 },
  pageFooter: { position: "absolute", bottom: 24, left: 55, right: 55, textAlign: "center", fontSize: 8, color: "#999" },
});

const W = { poste: "41%", amount: "15%", pct: "8%", rec: "15%", source: "21%" } as const;
const right = { textAlign: "right" } as const;

function pct(n: number): string {
  return `${String(n).replace(".", ",")}\u00a0%`;
}

function statusSentence(st: ChargesStatement): string {
  if (!st.provisional) return `Charges de l'exercice ${st.fiscal_year}${st.validated_on ? `, validées le ${fDate(st.validated_on)}` : ""}.`;
  if (st.projection) return `Charges provisoires de l'exercice ${st.fiscal_year}, établies par projection des charges récupérables réelles de l'exercice précédent, dans l'attente de la clôture de l'exercice.`;
  return `Charges provisoires de l'exercice ${st.fiscal_year}, dans l'attente de leur validation.`;
}

export function ChargesStatementPDF({ st, logoSrc }: { st: ChargesStatement; logoSrc?: string | null }) {
  const whole = st.unit === "logement";
  return (
    <Document title={`État récapitulatif des charges ${st.fiscal_year} - ${st.house.name}`} author="La Villa Coliving">
      <Page size="A4" style={s.page}>
        <View style={s.headerBlock}>
          {logoSrc ? <Image src={logoSrc} style={s.logo} /> : null}
          <Text style={s.title}>ÉTAT RÉCAPITULATIF DES CHARGES RÉCUPÉRABLES</Text>
          <Text style={s.sub}>{`Exercice ${st.fiscal_year} - ${st.house.name}`}</Text>
        </View>

        <View style={s.box}>
          {st.lessor ? <><Text style={s.boxLabel}>BAILLEUR :</Text><Text style={s.boxText}>{`${st.lessor.name}${st.lessor.address ? ` - ${st.lessor.address}` : ""}`}</Text></> : null}
          <Text style={[s.boxLabel, st.lessor ? { marginTop: 4 } : {}]}>{whole ? "BIEN :" : "MAISON :"}</Text>
          <Text style={s.boxText}>{`${st.house.name} - ${st.house.address}`}</Text>
        </View>

        <Text style={s.body}>{`${statusSentence(st)} ${whole ? "Montant applicable" : "Forfait applicable aux baux signés"} à compter du ${fDate(st.effective_from)}.`}</Text>

        <Text style={s.sectionTitle}>{whole ? "Charges récupérables du bien" : "Charges récupérables de la maison"}</Text>
        <View style={s.headRow}>
          <Text style={[s.cellBold, { width: W.poste }]}>Poste</Text>
          <Text style={[s.cellBold, right, { width: W.amount }]}>Montant annuel</Text>
          <Text style={[s.cellBold, right, { width: W.pct }]}>Part</Text>
          <Text style={[s.cellBold, right, { width: W.rec }]}>Récupérable</Text>
          <Text style={[s.cellBold, { width: W.source }]}>Justificatif</Text>
        </View>
        {st.lines.map((l, i) => (
          <View key={i} style={s.row} wrap={false}>
            <Text style={[s.cell, { width: W.poste }]}>{l.label}</Text>
            <Text style={[s.cell, right, { width: W.amount }]}>{fEUR(l.amount)}</Text>
            <Text style={[s.cell, right, { width: W.pct }]}>{pct(l.pct)}</Text>
            <Text style={[s.cell, right, { width: W.rec }]}>{fEUR(l.recoverable)}</Text>
            <Text style={[s.cell, { width: W.source }]}>{l.source || "-"}</Text>
          </View>
        ))}
        <View style={s.totalRow} wrap={false}>
          <Text style={[s.cellBold, { width: "64%" }]}>TOTAL RÉCUPÉRABLE DE L'EXERCICE</Text>
          <Text style={[s.cellBold, right, { width: W.rec }]}>{fEUR(st.total)}</Text>
          <Text style={[s.cell, { width: W.source }]}> </Text>
        </View>

        {/* Le calcul et sa mention restent sur la même page (jamais une mention seule en page 2). */}
        {whole ? (
          <View wrap={false}>
            <Text style={s.sectionTitle}>Montant mensuel des charges</Text>
            <View style={s.row}><Text style={[s.cell, { width: "70%" }]}>Total récupérable de l'exercice</Text><Text style={[s.cell, right, { width: "30%" }]}>{fEUR(st.total)}</Text></View>
            {st.room_count > 1 ? <View style={s.row}><Text style={[s.cell, { width: "70%" }]}>Nombre de logements (répartition à parts égales)</Text><Text style={[s.cell, right, { width: "30%" }]}>{String(st.room_count)}</Text></View> : null}
            <View style={s.totalRow}><Text style={[s.cellBold, { width: "70%" }]}>{st.room_count > 1 ? `CHARGES PAR LOGEMENT ET PAR MOIS (total ÷ ${st.room_count} logements ÷ 12 mois)` : "CHARGES PAR MOIS (total ÷ 12 mois)"}</Text><Text style={[s.cellBold, right, { width: "30%" }]}>{fEUR(st.per_room_month)}</Text></View>
            <Text style={s.small}>
              État établi d'après les dépenses de l'exercice. Les conditions de prise en charge de ces charges par le locataire sont celles prévues au bail.
            </Text>
          </View>
        ) : (
          <View wrap={false}>
            <Text style={s.sectionTitle}>Calcul du forfait mensuel par chambre</Text>
            <View style={s.row}><Text style={[s.cell, { width: "70%" }]}>Total récupérable de l'exercice</Text><Text style={[s.cell, right, { width: "30%" }]}>{fEUR(st.total)}</Text></View>
            <View style={s.row}><Text style={[s.cell, { width: "70%" }]}>Nombre de chambres de la maison (répartition à parts égales)</Text><Text style={[s.cell, right, { width: "30%" }]}>{String(st.room_count)}</Text></View>
            <View style={s.row}><Text style={[s.cell, { width: "70%" }]}>{`Forfait par chambre et par mois (total ÷ ${st.room_count} chambres ÷ 12 mois)`}</Text><Text style={[s.cell, right, { width: "30%" }]}>{fEUR(st.per_room_month)}</Text></View>
            <View style={s.totalRow}><Text style={[s.cellBold, { width: "70%" }]}>FORFAIT MENSUEL INSCRIT AUX BAUX (arrondi à l'euro)</Text><Text style={[s.cellBold, right, { width: "30%" }]}>{fEUR(st.printed)}</Text></View>
            <Text style={s.small}>
              Forfait de charges de l'article 25-10 de la loi n° 89-462 du 6 juillet 1989 : les charges récupérables de la maison (décret n° 87-713 du 26 août 1987) sont réparties à parts égales entre les chambres et rapportées au mois, sans régularisation ; le forfait est révisé comme le loyer. L'exploitation des équipements de loisirs, l'accès internet et les prestations de services sont compris dans le loyer et n'entrent pas dans ce forfait.
            </Text>
          </View>
        )}

        <Text style={s.pageFooter} fixed>{`La Villa Coliving - lavillacoliving.com\nÉtat établi le ${fDate(st.generated_on)}`}</Text>
      </Page>
    </Document>
  );
}
