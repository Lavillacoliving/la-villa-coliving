/**
 * Aperçu HTML du bail v3 : rend le MÊME document structuré que BailV3PDF (clauses.ts), avec la même charte
 * (Helvetica 10 pt, filets dorés, encadrés beiges). Tout est rendu avec des <div> stylés en ligne : l'aperçu vit dans le
 * dashboard, dont la feuille globale (Tailwind preflight, titres Cormorant) redéfinit h1-h6, p, ul/ol et table.
 * Feuille A4 à l'écran ; sauts de page respectés à l'impression.
 */
import React from "react";
import type { LeaseDoc, Block, Article } from "./clauses";
import { parseInline } from "./inline";
import type { NoticeSection } from "@/data/noticeInformation2023";

const gold = "#c9a96e";
const font = "Helvetica, Arial, sans-serif";
const css: Record<string, React.CSSProperties> = {
  page: { fontFamily: font, fontSize: "10pt", lineHeight: 1.6, color: "#333", background: "white", width: "210mm", minHeight: "297mm", boxSizing: "border-box", padding: "18mm 21mm 24mm", margin: "0 auto", textAlign: "left" },
  header: { textAlign: "center", borderBottom: `2px solid ${gold}`, paddingBottom: 12, marginBottom: 20 },
  logo: { width: 120, height: "auto", display: "block", margin: "0 auto 6px" },
  title: { fontFamily: font, fontSize: "16pt", fontWeight: 700, margin: "6px 0 4px", lineHeight: 1.3, whiteSpace: "pre-line", color: "#333", letterSpacing: 0, textTransform: "none" },
  sub: { fontSize: "9pt", color: "#666", marginTop: 10 },
  maquette: { fontSize: "8pt", color: "#999", fontStyle: "italic", marginTop: 4 },
  box: { background: "#faf8f5", borderLeft: `3px solid ${gold}`, padding: 10, margin: "8px 0", fontSize: "9pt" },
  boxCentered: { background: "#faf8f5", border: `1px solid ${gold}`, padding: 10, margin: "12px 60px", fontSize: "9pt", textAlign: "center" },
  boxLabel: { fontWeight: 700, color: gold, fontSize: "10pt", marginBottom: 4 },
  h2: { fontFamily: font, fontSize: "12pt", fontWeight: 700, margin: "18px 0 6px", borderBottom: `1px solid ${gold}`, paddingBottom: 4, color: "#333", letterSpacing: 0, textTransform: "none", lineHeight: 1.4 },
  h3: { fontFamily: font, fontSize: "10pt", fontWeight: 700, margin: "16px 0 4px", color: "#333", lineHeight: 1.6 },
  p: { textAlign: "justify", margin: "0 0 4px" },
  small: { fontSize: "9pt", color: "#666" },
  list: { margin: "0 0 8px" },
  item: { display: "flex", paddingLeft: 10, marginBottom: 2 },
  marker: { flex: "0 0 14px" },
  num: { flex: "0 0 20px" },
  itemText: { flex: 1, textAlign: "justify" },
  line: { paddingLeft: 10, marginBottom: 1 },
  table: { width: "100%", borderCollapse: "collapse", margin: "4px 0 8px", fontFamily: font },
  th: { textAlign: "left", padding: 6, fontSize: "9pt", fontWeight: 700, background: "#f9f7f4", borderBottom: `2px solid ${gold}`, color: "#333" },
  td: { padding: 6, fontSize: "9pt", borderBottom: "1px solid #e0e0e0", verticalAlign: "top", color: "#333" },
  gridTh: { textAlign: "left", padding: 4, fontSize: "7.5pt", fontWeight: 700, background: "#f9f7f4", borderBottom: `2px solid ${gold}`, verticalAlign: "top", color: "#333" },
  gridTd: { padding: 4, fontSize: "7.5pt", lineHeight: 1.35, borderBottom: "1px solid #e0e0e0", verticalAlign: "top", color: "#333" },
  signRow: { display: "flex", justifyContent: "space-around", marginTop: 30 },
  signBox: { width: "40%", borderTop: "1px solid #333", paddingTop: 15, textAlign: "center", fontSize: "9pt" },
  signName: { fontStyle: "italic", marginTop: 25, whiteSpace: "pre-line" },
  luApprouve: { marginTop: 30, paddingTop: 15, borderTop: `1px solid ${gold}`, textAlign: "center", fontSize: "8pt", color: "#999" },
};

function Inline({ text }: { text: string }) {
  const segs = parseInline(text);
  return <>{segs.map((sg, i) => (sg.bold || sg.under
    ? <span key={i} style={{ fontWeight: sg.bold ? 700 : undefined, textDecoration: sg.under ? "underline" : undefined }}>{sg.text}</span>
    : <React.Fragment key={i}>{sg.text}</React.Fragment>))}</>;
}

function BlockHtml({ b }: { b: Block }) {
  switch (b.t) {
    case "p":
      return <div style={{ ...css.p, ...(b.small ? css.small : {}), fontWeight: b.bold ? 700 : undefined, fontStyle: b.italic ? "italic" : undefined, marginTop: b.spaceBefore ? 14 : undefined }}><Inline text={b.text} /></div>;
    case "sub":
      return <div style={css.h3}>{b.text}</div>;
    case "bullets":
      return <div style={css.list}>{b.items.map((it, i) => (
        <div key={i} style={{ ...css.item, fontWeight: b.bold ? 700 : undefined }}><span style={css.marker}>•</span><span style={css.itemText}><Inline text={it} /></span></div>
      ))}</div>;
    case "numbered":
      return <div style={css.list}>{b.items.map((it, i) => (
        <div key={i} style={css.item}><span style={css.num}>{i + 1}.</span><span style={css.itemText}><Inline text={it} /></span></div>
      ))}</div>;
    case "lines":
      return <div>{b.items.map((it, i) => <div key={i} style={css.line}>{it}</div>)}</div>;
    case "kv":
      return <table style={css.table}><tbody>
        {b.headers && <tr><th style={css.th}>{b.headers[0]}</th><th style={{ ...css.th, textAlign: "right" }}>{b.headers[1]}</th></tr>}
        {b.rows.map(([k, v], i) => <tr key={i}><td style={css.td}>{k}</td><td style={{ ...css.td, textAlign: "right" }}>{v}</td></tr>)}
        {(b.totals || []).map(([k, v], i) => <tr key={"t" + i}><td style={{ ...css.th, borderTop: `2px solid ${gold}` }}>{k}</td><td style={{ ...css.th, textAlign: "right", borderTop: `2px solid ${gold}` }}>{v}</td></tr>)}
      </tbody></table>;
    case "table":
      return <table style={css.table}><thead><tr>{b.headers.map((h, i) => <th key={i} style={{ ...css.gridTh, width: `${b.widths[i]}%` }}>{h}</th>)}</tr></thead>
        <tbody>{b.rows.map((r, ri) => <tr key={ri}>{r.map((c, ci) => <td key={ci} style={css.gridTd}>{c}</td>)}</tr>)}</tbody></table>;
    case "box":
      return <div style={b.align === "center" ? css.boxCentered : css.box}>
        {b.label && <div style={{ fontWeight: 700, marginBottom: 2 }}>{b.label}</div>}
        {b.lines.map((l, i) => <div key={i}>{l}</div>)}
      </div>;
  }
}

function ArticleHtml({ a, label }: { a: Article; label: string }) {
  const breaks = a.pageBreakBefore || a.first;
  return (
    <section style={{ pageBreakBefore: breaks ? "always" : undefined, breakBefore: breaks ? "page" : undefined }}>
      <div style={{ ...css.h2, marginTop: a.first ? 0 : undefined }}>{`${label} ${a.num} — ${a.title}`}</div>
      {a.blocks.map((b, i) => <BlockHtml key={i} b={b} />)}
    </section>
  );
}

export function LeaseDocHtml({ doc, logoSrc, notice }: { doc: LeaseDoc; logoSrc: string; notice?: { title: string; source: string; sections: readonly NoticeSection[] } | null }) {
  const boxWidth = doc.signature.bailleurs.length > 1 ? "30%" : "40%";
  return (
    <div className="bail-v3-preview" style={css.page}>
      <div style={css.header}>
        <img src={logoSrc} alt="La Villa Coliving" style={css.logo} />
        <div style={css.title}>{doc.title}</div>
        <div style={css.sub}>{doc.subtitle}</div>
        {doc.maquette && <div style={css.maquette}>{doc.maquette}</div>}
      </div>
      <div style={css.box}><div style={css.boxLabel}>BAILLEUR :</div>{doc.bailleur.map((l, i) => <div key={i}>{l}</div>)}</div>
      <div style={css.box}><div style={css.boxLabel}>LOCATAIRE :</div>{doc.locataire.map((l, i) => <div key={i}>{l}</div>)}</div>
      {doc.articles.map((a) => <ArticleHtml key={a.key} a={a} label="ARTICLE" />)}
      <div style={{ pageBreakInside: "avoid" }}>
        <div style={{ fontSize: "9pt", textAlign: "center", marginTop: 30 }}>{`Fait à ${doc.signature.city}, à la date de la signature électronique, en deux exemplaires originaux.`}</div>
        <div style={css.signRow}>
          {doc.signature.bailleurs.map((n, i) => <div key={i} style={{ ...css.signBox, width: boxWidth }}><div>Signature du bailleur</div><div style={css.signName}>{n}</div></div>)}
          <div style={{ ...css.signBox, width: boxWidth }}><div>Signature du locataire</div><div style={css.signName}>{doc.signature.tenant}</div></div>
        </div>
        <div style={css.luApprouve}>Lu et approuvé</div>
      </div>
      {doc.annexes.map((a) => <ArticleHtml key={a.key} a={a} label="ANNEXE" />)}
      {notice && (
        <section style={{ pageBreakBefore: "always", breakBefore: "page" }}>
          <div style={{ ...css.h2, marginTop: 0 }}>ANNEXE 1 — NOTICE D'INFORMATION RELATIVE AUX DROITS ET OBLIGATIONS DES LOCATAIRES ET DES BAILLEURS</div>
          <div style={{ ...css.small, fontSize: "8pt" }}>{notice.source}</div>
          <div style={{ fontSize: "9pt", fontWeight: 700, margin: "8px 0" }}>{notice.title}</div>
          {notice.sections.map((sec, i) => (
            <div key={i}>
              <div style={{ fontSize: "8.5pt", fontWeight: 700, marginTop: 8, marginBottom: 2 }}>{sec.heading}</div>
              {sec.paragraphs.map((para, j) => <div key={j} style={{ fontSize: "8pt", lineHeight: 1.4, textAlign: "justify", margin: "0 0 3px" }}>{para}</div>)}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
