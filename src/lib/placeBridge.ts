/**
 * SEUL pont entre la clé PUBLIQUE d'un lieu (`lappart`, URL, `?property_interest=`, v_public_rooms, JSON-LD, GA4) et la clé
 * INTERNE de la base (`properties.slug`) — décision Q9 du 12/11/2026, à confirmer.
 *
 * Deux usages, et seulement deux : le payload envoyé à l'Edge send-candidature-email (JoinPageV4) et l'insertion dans la liste
 * d'attente (RoomPipeline) — l'Edge et le tableau de bord ne connaissent que la clé interne. La valeur n'existe que dans le
 * JavaScript, au moment de l'envoi : JAMAIS dans une URL, un attribut, un `id`, un texte, un JSON-LD, un état embarqué, un nom
 * de fichier ni un message de commit. GA4 garde la clé publique (c'est elle qui segmente).
 *
 * Ce fichier n'est importé par aucun module du bundle d'entrée (test tools/test/places.test.mjs : importateurs permis
 * JoinPageV4.tsx et RoomPipeline.tsx). La garde « aucune clé interne » (étape E2g) cherche INTERNAL_ONLY_KEYS dans tout ce
 * qui est publié (pages prérendues, llms.txt, sitemap, vercel.json, noms de fichiers) : aucune clé n'y est recopiée.
 */
import { isPlaceKey, type PlaceKey } from "@/data/places";

const INTERNAL_PROPERTY_SLUG = {
  lavilla: "lavilla",
  leloft: "leloft",
  lelodge: "lelodge",
  lappart: "montblanc",
} as const satisfies Record<PlaceKey, string>;

/** Clé interne d'un lieu public. Une valeur inconnue passe telle quelle (l'Edge la range en NULL, sans erreur). */
export function toInternalPropertySlug(value: string): string {
  return isPlaceKey(value) ? INTERNAL_PROPERTY_SLUG[value] : value;
}

/** Clés internes qui ne sont PAS des clés publiques : la liste que cherche la garde « aucune clé interne ». */
export const INTERNAL_ONLY_KEYS: readonly string[] = Object.values(INTERNAL_PROPERTY_SLUG).filter((v) => !isPlaceKey(v));
