import { ROOMS_EMBED_ID, useRoomsSnapshotFor, type HouseKey } from "@/lib/availability";
import { embedJson } from "@/lib/prerenderEmbeddedState";

// (Lot 3) Extrémité ÉCRITURE de l'état chambres : la page maison sérialise SES
// lignes v_public_rooms dans le HTML au prérendu — relues de façon SYNCHRONE à
// l'init du store client (premier rendu identique au snapshot, zéro #418, zéro
// CLS). Une seule instance par page ; rendu null tant qu'aucune donnée n'est
// chargée (même règle qu'AvailabilityEmbed : un tableau vide serait pris pour
// « absent » et déclencherait un fetch au premier rendu).
// ⚠️ ROOMS_EMBED_ID est enregistré dans la liste de capture de src/main.tsx —
// ne pas renommer l'un sans l'autre.
export function RoomsEmbed({ house }: { house: HouseKey }) {
  const rows = useRoomsSnapshotFor(house);
  if (!rows) return null;
  return (
    <script
      type="application/json"
      id={ROOMS_EMBED_ID}
      dangerouslySetInnerHTML={{ __html: embedJson(rows) }}
    />
  );
}
