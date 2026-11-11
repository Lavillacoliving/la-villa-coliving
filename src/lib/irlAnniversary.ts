// Prochain anniversaire d'un bail, pour la révision annuelle du loyer (IRL). Aucun import : ce module
// est testé directement sous Node (tools/test/irl-anniversary.test.mjs).
//
// Règle : le loyer se révise à la date anniversaire de l'entrée, et le premier anniversaire tombe un an
// après l'entrée — le jour de l'entrée n'en est pas un. Avant le 11/11/2026, une fiche active dont
// l'entrée était à venir (bail signé, locataire pas encore arrivé) recevait un rappel « Augmentations
// IRL à prévoir » daté du jour de son entrée, avec un bouton qui aurait modifié son loyer avant qu'il
// n'emménage. Même chose pour une fiche encore active d'un locataire déjà parti : pas de révision à
// préparer pour quelqu'un qui ne sera plus là à l'anniversaire.

/** Date calendaire locale d'une date « AAAA-MM-JJ » (ou d'un objet Date) ; null si illisible. */
function toLocalDay(value: string | Date): Date | null {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Prochaine date anniversaire de l'entrée, à partir d'aujourd'hui.
 * Renvoie null si l'entrée est à venir ou illisible : il n'y a pas encore d'anniversaire à préparer.
 * Pure.
 */
export function nextLeaseAnniversary(moveInDate: string | Date, today: Date): Date | null {
  const moveIn = toLocalDay(moveInDate);
  if (!moveIn) return null;
  const next = new Date(today.getFullYear(), moveIn.getMonth(), moveIn.getDate());
  if (next < today) next.setFullYear(next.getFullYear() + 1);
  // Le premier anniversaire tombe l'année qui suit l'entrée, jamais l'année de l'entrée.
  if (next.getFullYear() <= moveIn.getFullYear()) return null;
  return next;
}

/**
 * Vrai si le locataire ne sera plus là à la date donnée : départ renseigné, ce jour-là ou avant.
 * Sans date de départ (ou date illisible) : faux. Pure.
 */
export function hasLeftBy(moveOutDate: string | Date | null | undefined, date: Date): boolean {
  if (!moveOutDate) return false;
  const out = toLocalDay(moveOutDate);
  return out !== null && out.getTime() <= date.getTime();
}
