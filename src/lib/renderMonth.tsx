import { useEffect, useState } from "react";
import { embedJson, readEmbeddedArray } from "@/lib/prerenderEmbeddedState";

// Mois de référence du rendu (Lot B du brief « Formulaire, hydratation, mesure », 01/10/2026).
// Le HTML est prérendu deux fois par jour (05:00 et 13:00 UTC) : tout texte calculé avec
// `new Date()` au rendu (année du pied de page, « Places limitées pour <mois> » de /tarifs)
// diffère du HTML entre minuit (heure locale) et le prérendu suivant — #418 chaque 1ᵉʳ du mois et
// chaque 1ᵉʳ janvier. Remède, même modèle que RoomPipeline (__pipeline_ref_month__) : le pied de
// page embarque le mois du prérendu (présent sur toutes les pages), le premier rendu client le relit
// (hydratation identique), puis se resynchronise sur le mois réel APRÈS l'hydratation.
// ⚠️ RENDER_MONTH_EMBED_ID est enregistré dans la liste de capture de src/main.tsx.

export const RENDER_MONTH_EMBED_ID = "__render_month__";

/** « AAAA-MM » du mois courant (fuseau du navigateur ; le prérendu tourne en UTC). */
export function currentMonthValue(now: Date = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

/** « AAAA-MM » du mois suivant `month` (« AAAA-MM »). Pur, déterministe. */
export function nextMonthValue(month: string): { year: number; monthIndex: number } {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m, 1); // m est 1-based : new Date(y, m) = 1ᵉʳ du mois suivant
  return { year: d.getFullYear(), monthIndex: d.getMonth() };
}

/** Mois embarqué par le prérendu au premier rendu, puis mois réel après l'hydratation. */
export function useRenderMonth(): string {
  const [month, setMonth] = useState<string>(
    () => readEmbeddedArray<string>(RENDER_MONTH_EMBED_ID)?.[0] ?? currentMonthValue(),
  );
  useEffect(() => {
    const now = currentMonthValue();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- volontaire : resynchronisation post-hydratation, jamais au premier rendu
    if (now !== month) setMonth(now);
  }, [month]);
  return month;
}

/** Embed du mois de référence — rendu une seule fois par page, dans le pied de page. */
export function RenderMonthEmbed({ month }: { month: string }) {
  return <script type="application/json" id={RENDER_MONTH_EMBED_ID} dangerouslySetInnerHTML={{ __html: embedJson([month]) }} />;
}
