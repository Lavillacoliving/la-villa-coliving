/**
 * (Lot 2 « retenue premium », sous-lot A — 11/2026) Vignettes de l'album compact d'une maison.
 *
 * Indices des photos à montrer : une photo par catégorie, dans l'ordre d'apparition des catégories, puis on recommence
 * (extérieur, intérieur, espaces communs, chambre…). Fonction pure et déterministe : même résultat au prérendu et dans le
 * navigateur (aucun écart d'hydratation), testée dans tools/test/gallery.test.mjs.
 */
export function compactIndices(images: { category: string }[], n: number): number[] {
  const queues = new Map<string, number[]>();
  images.forEach((img, i) => {
    const q = queues.get(img.category);
    if (q) q.push(i);
    else queues.set(img.category, [i]);
  });
  const lists = [...queues.values()];
  const out: number[] = [];
  const max = Math.min(n, images.length);
  for (let round = 0; out.length < max; round++) {
    let added = false;
    for (const q of lists) {
      if (q[round] !== undefined && out.length < max) {
        out.push(q[round]);
        added = true;
      }
    }
    if (!added) break;
  }
  return out;
}

/**
 * Vignettes de l'album compact d'une maison.
 *
 * 1. Une photo par catégorie, dans l'ordre d'apparition des catégories (extérieur, intérieur, espaces communs, chambres,
 *    équipements) : la photo mise en avant de cette catégorie si elle existe (`featured` — les photos du carrousel du
 *    hero, choisies à la main pour chaque maison), sinon la première de la catégorie. La piscine, première photo
 *    « équipements » de chaque album, est ainsi toujours montrée.
 * 2. Les places restantes vont aux autres photos mises en avant, en partant de la dernière catégorie (une seconde
 *    chambre plutôt qu'une seconde vue de la piscine).
 * 3. S'il en manque encore : compactIndices sur le reste de l'album.
 * Jamais deux fois la même photo (un album peut contenir un doublon). Pur et déterministe.
 */
export function albumPicks(images: { src: string; category: string }[], featured: string[], n: number): number[] {
  const wanted = new Set(featured);
  const seen = new Set<string>();
  const unique: number[] = [];
  images.forEach((img, i) => {
    if (seen.has(img.src)) return;
    seen.add(img.src);
    unique.push(i);
  });
  const max = Math.min(n, unique.length);
  const categories: string[] = [];
  for (const i of unique) if (!categories.includes(images[i].category)) categories.push(images[i].category);
  const picks: number[] = [];
  const taken = new Set<number>();
  const take = (i: number | undefined) => {
    if (i === undefined || taken.has(i) || picks.length >= max) return;
    taken.add(i);
    picks.push(i);
  };
  // 1. une photo par catégorie
  for (const c of categories) {
    const inCategory = unique.filter((i) => images[i].category === c);
    take(inCategory.find((i) => wanted.has(images[i].src)) ?? inCategory[0]);
  }
  // 2. les autres photos mises en avant, de la dernière catégorie à la première, tour par tour
  const reversed = [...categories].reverse();
  let progressed = true;
  while (picks.length < max && progressed) {
    progressed = false;
    for (const c of reversed) {
      const next = unique.find((i) => images[i].category === c && wanted.has(images[i].src) && !taken.has(i));
      if (next !== undefined && picks.length < max) {
        take(next);
        progressed = true;
      }
    }
  }
  // 3. le reste de l'album
  if (picks.length < max) {
    const rest = unique.filter((i) => !taken.has(i));
    for (const k of compactIndices(rest.map((i) => images[i]), max - picks.length)) take(rest[k]);
  }
  return picks;
}
