import type { ReactNode } from "react";

/**
 * (Lot 2a, commit 12, 28/11/2026, brief v8 D13) Signature du H1 : un mot ou groupe de mots en italique, en couleur
 * d'accent sur fond clair, en doré clair (#E0BB8A, déjà celui des hauts de page sombres) sur photo ou fond sombre.
 * Style seulement : le texte du H1 (textContent) ne change pas. Si `accent` est absent du texte, le texte est rendu
 * tel quel (jamais d'erreur sur un titre venu des données).
 */
export function h1Accent(text: string, accent: string, onDark = false): ReactNode {
  const i = text.indexOf(accent);
  if (!accent || i < 0) return text;
  const before = text.slice(0, i);
  const after = text.slice(i + accent.length);
  return (
    <>
      {before || null}
      <em className={onDark ? "lvc-h1-accent lvc-h1-accent--on-photo" : "lvc-h1-accent"}>{accent}</em>
      {after || null}
    </>
  );
}
