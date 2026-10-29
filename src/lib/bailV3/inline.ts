/**
 * Marqueurs inline du texte des clauses : ** … ** = gras, __ … __ = souligné (combinables).
 * Un seul analyseur pour le PDF (BailV3PDF), l'aperçu HTML (renderHtml) et les tests.
 */
export interface InlineSegment { text: string; bold: boolean; under: boolean }

export function parseInline(text: string): InlineSegment[] {
  if (!text.includes("**") && !text.includes("__")) return [{ text, bold: false, under: false }];
  const out: InlineSegment[] = [];
  let bold = false, under = false, buf = "", i = 0;
  const flush = () => { if (buf) out.push({ text: buf, bold, under }); buf = ""; };
  while (i < text.length) {
    const two = text.slice(i, i + 2);
    if (two === "**") { flush(); bold = !bold; i += 2; }
    else if (two === "__") { flush(); under = !under; i += 2; }
    else { buf += text[i]; i += 1; }
  }
  flush();
  return out;
}

/** Texte brut sans marqueurs (recherche, tests, libellés). */
export function stripInline(text: string): string {
  return text.replace(/\*\*|__/g, "");
}
