import { ROOMS_EMBED_ID, useRoomsSnapshotFor, type HouseKey } from "@/lib/availability";
import type { PlaceKey } from "@/data/places";
import { embedJson } from "@/lib/prerenderEmbeddedState";

// (Lot 3) Extrémité ÉCRITURE de l'état chambres : la page maison sérialise SES
// lignes v_public_rooms dans le HTML au prérendu — relues de façon SYNCHRONE à
// l'init du store client (premier rendu identique au snapshot, zéro #418, zéro
// CLS). Une seule instance par page ; rendu null tant qu'aucune donnée n'est
// chargée (même règle qu'AvailabilityEmbed : un tableau vide serait pris pour
// « absent » et déclencherait un fetch au premier rendu).
// ⚠️ ROOMS_EMBED_ID est enregistré dans la liste de capture de src/main.tsx —
// ne pas renommer l'un sans l'autre.
// Sans prop (Lot 3 SEO funnel — /chambres-disponibles) : toutes les lignes des lieux connus (29 aujourd'hui), ≈ 10 Ko.
// (L'Appart, 12/11/2026) `places` : un lieu ou une liste de lieux (maison et L'Appart). `house` reste pour les pages
// maisons, qui ne changent pas. Les deux props ne se combinent pas.
type RoomsEmbedProps =
  | { house?: HouseKey; places?: never }
  | { places: PlaceKey | readonly PlaceKey[]; house?: never };

export function RoomsEmbed({ house, places }: RoomsEmbedProps) {
  const rows = useRoomsSnapshotFor(places ?? house);
  if (!rows) return null;
  return (
    <script
      type="application/json"
      id={ROOMS_EMBED_ID}
      dangerouslySetInnerHTML={{ __html: embedJson(rows) }}
    />
  );
}
