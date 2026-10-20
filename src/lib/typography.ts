// Typographie d'affichage des articles du blog (décisions de Jérôme du 16/10/2026 : milliers, puis « % »).
//
// Les articles écrivent souvent les milliers avec une espace NORMALE (« 2 800 CHF ») : sur mobile, le navigateur
// coupait alors les nombres en deux (« 80 000-100 / 000 CHF ») — 430 nombres dans 23 articles FR au 14/10/2026.
// Règle d'AFFICHAGE, appliquée au markdown de l'article juste avant le rendu (BlogPostPage) : la base n'est pas
// modifiée et les futurs articles sont couverts. Une espace devient une espace insécable (U+00A0, comme la source
// unique : « 1 370 ») : longueur inchangée, les découpes calculées sur le texte (marqueurs, bloc « Où chercher »)
// restent valides. Module sans import : chargé tel quel par Node 24 dans tools/test/typography.test.mjs.

/** Un nombre de 1 à 3 chiffres suivi d'un ou plusieurs groupes « espace + 3 chiffres », ni précédé ni suivi d'un chiffre. */
const THOUSANDS = /(?<![\d.,])(\d{1,3})((?: \d{3})+)(?!\d)/g;

/** Espace normale entre groupes de milliers → espace insécable (« 80 000-100 000 CHF » ne se coupe plus). Le reste est intact. */
export function nbspThousands(text: string): string {
  return text.replace(THOUSANDS, (_m, head: string, groups: string) => head + groups.replace(/ /g, "\u00a0"));
}

/** (16/10/2026, décision de Jérôme) « 20 à 27 % » : l'espace devant « % » devient insécable — le signe ne part plus seul à la ligne. */
export function nbspPercent(text: string): string {
  return text.replace(/(\d) %/g, "$1\u00a0%");
}

/** Règle d'affichage complète des textes d'articles (corps et résumés en cartes) : milliers puis pourcentages. */
export function typoFr(text: string): string {
  return nbspPercent(nbspThousands(text));
}
