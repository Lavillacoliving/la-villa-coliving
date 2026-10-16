// Typographie d'affichage des articles du blog (décision de Jérôme du 16/10/2026).
//
// Les articles écrivent souvent les milliers avec une espace NORMALE (« 2 800 CHF ») : sur mobile, le navigateur
// coupait alors les nombres en deux (« 80 000-100 / 000 CHF ») — 430 nombres dans 23 articles FR au 14/10/2026.
// Règle d'AFFICHAGE, appliquée au markdown de l'article juste avant le rendu (BlogPostPage) : la base n'est pas
// modifiée et les futurs articles sont couverts. Une espace devient une espace insécable (U+00A0, comme la source
// unique : « 1 370 ») : longueur inchangée, les découpes calculées sur le texte (marqueurs, bloc « Où chercher »)
// restent valides. Module sans import : chargé tel quel par Node 24 dans tools/test/typography.test.mjs.

/** Un nombre de 1 à 3 chiffres suivi d'un ou plusieurs groupes « espace + 3 chiffres », ni précédé ni suivi d'un chiffre. */
const THOUSANDS = /(?<![\d.,])(\d{1,3})((?: \d{3})+)(?!\d)/g;

/** « 80 000-100 000 CHF » → « 80 000-100 000 CHF » (espaces des milliers insécables). Le reste du texte est intact. */
export function nbspThousands(text: string): string {
  return text.replace(THOUSANDS, (_m, head: string, groups: string) => head + groups.replace(/ /g, " "));
}
