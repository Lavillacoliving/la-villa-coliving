/**
 * Rendu PDF du bail v3 — mêmes styles que le bail actuel (src/pages/dashboard/BailPDF.tsx : Helvetica 10,
 * filets dorés, encadrés beiges, tableaux à en-tête doré, bloc de signatures, pied de page numéroté).
 * Le texte vient exclusivement de buildLeaseV3 (clauses.ts) : l'aperçu HTML lira le même document.
 */
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type { LeaseDoc, Block, Article } from "./clauses";

const gold = "#c9a96e";

const s = StyleSheet.create({
  // lineHeight porté par chaque style de texte, jamais par la page ni par un View : hérité par le pied de page fixe,
  // il empêche react-pdf 4 (rendu Node) d'afficher ce pied ; posé sur un View, il est résolu en points puis remultiplié.
  // paddingBottom 80 (50 dans BailPDF.tsx) : le pied de page fixe occupe ~70 pt au-dessus du bord, le corps ne doit pas le recouvrir.
  page: { fontFamily: "Helvetica", fontSize: 10, color: "#333", paddingTop: 50, paddingBottom: 80, paddingHorizontal: 60 },
  text: { fontSize: 10, lineHeight: 1.6 },
  partyText: { fontSize: 9, lineHeight: 1.6 },
  headerBlock: { textAlign: "center", marginBottom: 20, borderBottomWidth: 2, borderBottomColor: gold, paddingBottom: 12 },
  headerTitle: { fontSize: 16, fontFamily: "Helvetica-Bold", marginTop: 6, marginBottom: 4, lineHeight: 1.3 },
  headerSub: { lineHeight: 1.6, fontSize: 9, color: "#666", marginTop: 2 },
  maquette: { lineHeight: 1.6, fontSize: 8, color: "#999", marginTop: 4, fontFamily: "Helvetica-Oblique" },
  partyBox: { backgroundColor: "#faf8f5", borderLeftWidth: 3, borderLeftColor: gold, padding: 10, marginVertical: 8, fontSize: 9 },
  boxCentered: { borderWidth: 1, borderColor: gold, borderLeftWidth: 1, alignItems: "center", textAlign: "center", marginHorizontal: 60, marginTop: 10 },
  partyLabel: { lineHeight: 1.6, fontFamily: "Helvetica-Bold", color: gold, fontSize: 10, marginBottom: 4 },
  articleTitle: { lineHeight: 1.6, fontFamily: "Helvetica-Bold", fontSize: 12, marginTop: 18, marginBottom: 6, borderBottomWidth: 1, borderBottomColor: gold, paddingBottom: 4 },
  body: { fontSize: 10, lineHeight: 1.6, textAlign: "justify", marginBottom: 4 },
  small: { fontSize: 9, color: "#666" },
  subTitle: { lineHeight: 1.6, fontFamily: "Helvetica-Bold", fontSize: 10, marginTop: 10, marginBottom: 4 },
  bullet: { flexDirection: "row", marginBottom: 2, paddingLeft: 10 },
  bulletDot: { lineHeight: 1.6, width: 12, fontSize: 10 },
  bulletText: { lineHeight: 1.6, flex: 1, fontSize: 10 },
  numberedNum: { lineHeight: 1.6, width: 18, fontSize: 10 },
  line: { fontSize: 10, lineHeight: 1.6, paddingLeft: 10, marginBottom: 1 },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#e0e0e0" },
  tableHeader: { flexDirection: "row", borderBottomWidth: 2, borderBottomColor: gold, backgroundColor: "#f9f7f4" },
  tableCell: { lineHeight: 1.6, padding: 6, fontSize: 9 },
  tableCellBold: { lineHeight: 1.6, padding: 6, fontSize: 9, fontFamily: "Helvetica-Bold" },
  gridCell: { padding: 4, fontSize: 7.5, lineHeight: 1.35 },
  gridCellBold: { padding: 4, fontSize: 7.5, fontFamily: "Helvetica-Bold", lineHeight: 1.35 },
  signatureSection: { flexDirection: "row", justifyContent: "space-around", marginTop: 30 },
  signatureBox: { width: "40%", borderTopWidth: 1, borderTopColor: "#333", paddingTop: 15, alignItems: "center" },
  signatureLabel: { lineHeight: 1.6, fontSize: 9, marginTop: 10 },
  signatureName: { lineHeight: 1.6, fontSize: 9, fontFamily: "Helvetica-Oblique", marginTop: 25, textAlign: "center" },
  footer: { marginTop: 30, paddingTop: 15, borderTopWidth: 1, borderTopColor: gold, textAlign: "center", fontSize: 8, color: "#999" },
  pageFooter: { position: "absolute", bottom: 20, left: 60, right: 60, textAlign: "center", fontSize: 8, color: "#999" },
  logo: { width: 120, marginBottom: 6, alignSelf: "center" },
});

/** Gras inline : les segments entre ** … ** sont rendus en Helvetica-Bold ; sans marqueur, la chaîne est rendue telle quelle
 *  (pas de Text imbriqué : react-pdf 4 plante sur un Text imbriqué qui suit un tableau coupé entre deux pages). */
function inline(text: string): React.ReactNode {
  if (!text.includes("**")) return text;
  return text.split("**").map((part, i) => (i % 2 === 1 ? <Text key={i} style={{ fontFamily: "Helvetica-Bold" }}>{part}</Text> : part));
}

function BlockView({ b }: { b: Block }) {
  switch (b.t) {
    case "p":
      return <Text style={[s.body, b.small ? s.small : {}, b.bold ? { fontFamily: "Helvetica-Bold" } : b.italic ? { fontFamily: "Helvetica-Oblique" } : {}]}>{inline(b.text)}</Text>;
    case "sub":
      return <Text style={s.subTitle}>{b.text}</Text>;
    case "bullets":
      return <View>{b.items.map((it, i) => (
        <View key={i} style={s.bullet}><Text style={s.bulletDot}>{"•"}</Text><Text style={[s.bulletText, b.bold ? { fontFamily: "Helvetica-Bold" } : {}]}>{inline(it)}</Text></View>
      ))}</View>;
    case "numbered":
      return <View>{b.items.map((it, i) => (
        <View key={i} style={s.bullet}><Text style={s.numberedNum}>{i + 1}.</Text><Text style={s.bulletText}>{inline(it)}</Text></View>
      ))}</View>;
    case "lines":
      return <View>{b.items.map((it, i) => <Text key={i} style={s.line}>{it}</Text>)}</View>;
    case "kv":
      return <View style={{ marginTop: 4, marginBottom: 8 }} wrap={false}>
        {b.headers && <View style={s.tableHeader}><Text style={[s.tableCellBold, { width: "60%" }]}>{b.headers[0]}</Text><Text style={[s.tableCellBold, { width: "40%", textAlign: "right" }]}>{b.headers[1]}</Text></View>}
        {b.rows.map(([k, v], i) => <View key={i} style={s.tableRow}><Text style={[s.tableCell, { width: "60%" }]}>{k}</Text><Text style={[s.tableCell, { width: "40%", textAlign: "right" }]}>{v}</Text></View>)}
        {(b.totals || []).map(([k, v], i) => <View key={"t" + i} style={s.tableHeader}><Text style={[s.tableCellBold, { width: "60%" }]}>{k}</Text><Text style={[s.tableCellBold, { width: "40%", textAlign: "right" }]}>{v}</Text></View>)}
      </View>;
    case "table":
      return <View style={{ marginTop: 4, marginBottom: 8 }}>
        <View style={s.tableHeader}>{b.headers.map((h, i) => <Text key={i} style={[s.gridCellBold, { width: `${b.widths[i]}%` }]}>{h}</Text>)}</View>
        {b.rows.map((row, ri) => <View key={ri} style={s.tableRow} wrap={false}>{row.map((c, ci) => <Text key={ci} style={[s.gridCell, { width: `${b.widths[ci]}%` }]}>{c}</Text>)}</View>)}
      </View>;
    case "box":
      return <View style={[s.partyBox, { marginTop: 6 }, b.align === "center" ? s.boxCentered : {}]} wrap={false}>
        {b.label && <Text style={[s.partyText, { fontFamily: "Helvetica-Bold", marginBottom: 2 }]}>{b.label}</Text>}
        {b.lines.map((l, i) => <Text key={i} style={s.partyText}>{l}</Text>)}
      </View>;
  }
}

function ArticleView({ a, label, trailer }: { a: Article; label: string; trailer?: React.ReactNode }) {
  const title = <Text style={[s.articleTitle, a.first ? { marginTop: 0 } : {}]}>{`${label} ${a.num} \u2014 ${a.title}`}</Text>;
  const blocks = a.blocks.map((b, i) => <BlockView key={i} b={b} />);
  // Article insécable (court), ou dernier article porté avec le bloc de signatures (comme BailPDF.tsx : jamais seul en dernière page).
  if (a.keepTogether || trailer) return <View wrap={false}>{title}{blocks}{trailer}</View>;
  // Titre + premier bloc insécables : un titre ne reste jamais orphelin en bas de page.
  return (
    <View>
      <View wrap={false}>{title}{blocks[0]}</View>
      {blocks.slice(1)}
    </View>
  );
}

export function BailV3PDF({ doc, logoSrc }: { doc: LeaseDoc; logoSrc: string }) {
  const boxWidth = doc.signature.bailleurs.length > 1 ? "30%" : "40%";
  const pageFooter = (
    <View style={s.pageFooter} fixed>
      {doc.footer.map((l, i) => <Text key={i}>{l}</Text>)}
      <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} />
    </View>
  );
  const signatureBlock = (
    <View>
      <Text style={[s.text, { fontSize: 9, textAlign: "center", marginTop: 30 }]}>{`Fait à ${doc.signature.city}, à la date de la signature électronique, en deux exemplaires originaux.`}</Text>
      <View style={s.signatureSection}>
        {doc.signature.bailleurs.map((name, i) => (
          <View key={i} style={[s.signatureBox, { width: boxWidth }]}><Text style={s.signatureLabel}>Signature du bailleur</Text><Text style={s.signatureName}>{name}</Text></View>
        ))}
        <View style={[s.signatureBox, { width: boxWidth }]}><Text style={s.signatureLabel}>Signature du locataire</Text><Text style={s.signatureName}>{doc.signature.tenant}</Text></View>
      </View>
      <View style={s.footer}><Text style={{ fontSize: 8, lineHeight: 1.6 }}>Lu et approuvé</Text></View>
    </View>
  );
  return (
    <Document title="Contrat de location — La Villa Coliving (bail v3)" author="La Villa Coliving">
      <Page size="A4" style={s.page} wrap>
        <View style={s.headerBlock}>
          <Image style={s.logo} src={logoSrc} />
          <Text style={[s.text, { fontSize: 10, fontFamily: "Helvetica-Bold" }]}>La Villa Coliving</Text>
          <Text style={s.headerTitle}>{doc.title}</Text>
          <Text style={s.headerSub}>{doc.subtitle}</Text>
          {doc.maquette && <Text style={s.maquette}>{doc.maquette}</Text>}
        </View>
        <View style={s.partyBox}><Text style={s.partyLabel}>BAILLEUR :</Text>{doc.bailleur.map((l, i) => <Text key={i} style={s.partyText}>{l}</Text>)}</View>
        <View style={s.partyBox}><Text style={s.partyLabel}>LOCATAIRE :</Text>{doc.locataire.map((l, i) => <Text key={i} style={s.partyText}>{l}</Text>)}</View>
        {doc.articles.map((a, i) => <ArticleView key={i} a={a} label="ARTICLE" trailer={i === doc.articles.length - 1 ? signatureBlock : undefined} />)}
        {pageFooter}
      </Page>
      {/* Annexes sur une seconde page : un `break` suivi d'un tableau coupé entre deux pages fait planter react-pdf 4
          (« unsupported number ») dès qu'un pied de page fixe est présent ; une nouvelle Page évite le saut forcé. */}
      <Page size="A4" style={s.page} wrap>
        {doc.annexes.map((a, i) => <ArticleView key={"x" + i} a={a} label="ANNEXE" />)}
        {pageFooter}
      </Page>
    </Document>
  );
}
