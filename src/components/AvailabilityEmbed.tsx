import { AVAILABILITY_EMBED_ID, useAvailabilitySnapshot } from "@/lib/availability";
import { embedJson } from "@/lib/prerenderEmbeddedState";

/**
 * Sérialise le résumé de dispo dans le HTML prérendu (3 lignes maison).
 * Monté UNE SEULE FOIS, dans App : sinon plusieurs <script> partageraient le
 * même id et la relecture deviendrait non déterministe.
 *
 * Rien n'est rendu tant qu'aucune donnée n'a été chargée : les pages sans badge
 * de dispo (blog, mentions légales…) ne déclenchent aucun fetch et n'embarquent
 * donc pas de tableau vide, que readEmbeddedArray() traiterait comme « absent ».
 */
export function AvailabilityEmbed() {
  const rows = useAvailabilitySnapshot();
  if (!rows || rows.length === 0) return null;
  return (
    <script
      type="application/json"
      id={AVAILABILITY_EMBED_ID}
      dangerouslySetInnerHTML={{ __html: embedJson(rows) }}
    />
  );
}
