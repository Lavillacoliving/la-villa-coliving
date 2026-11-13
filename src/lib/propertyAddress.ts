// Adresse postale d'une maison, lue en base à l'exécution (lot « sécurité des adresses », 13/11/2026).
// Aucun import : ce module est testé directement sous Node (tools/test/property-address.test.mjs).
//
// Règle : aucune adresse de maison n'est écrite dans le code. Un écran qui en a besoin (courrier de révision du
// loyer, bail, quittance, état des charges) lit `properties.address` avec la session connectée (RLS : équipe
// en double authentification, ou locataire actif pour sa propre maison). Sans valeur en base, l'écran le dit ;
// il n'invente jamais une adresse de remplacement.

/**
 * `properties.address` (« rue - code postal commune - France », parfois sans pays ou avec des virgules) →
 * ligne d'en-tête « rue, code postal commune ». Renvoie null si l'adresse est absente ou vide.
 * Même découpage que `addressLines` (src/lib/portail/quittance.ts) : seulement sur une virgule ou sur un tiret
 * entouré d'espaces, jamais dans un nom à trait d'union (« Ville-la-Grand »). Pure.
 */
export function propertyAddressLine(address: string | null | undefined): string | null {
  const parts = String(address ?? "")
    .split(/\s+[–—-]\s+|\s*,\s*/)
    .map((part) => part.trim())
    .filter((part) => part && !/^france$/i.test(part));
  return parts.length ? parts.join(", ") : null;
}

/**
 * Pourquoi un courrier ne peut pas être généré faute d'adresse — message pour l'équipe, jamais d'adresse par défaut.
 * `loadFailed` : la lecture des maisons a échoué (réseau, session) ; sinon la fiche de la maison n'a pas d'adresse.
 */
export function missingAddressMessage(propertyName: string | null | undefined, loadFailed: boolean): string {
  if (loadFailed) return "Adresse de la maison indisponible : les maisons n'ont pas pu être lues. Recharger la page, puis réessayer.";
  const name = String(propertyName ?? "").trim();
  return `Adresse absente de la fiche ${name ? `« ${name} »` : "de la maison"} (onglet Maisons) : courrier non généré.`;
}
