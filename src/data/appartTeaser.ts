/**
 * Bloc statique « L'Appart » des 5 pages de la marque (<AppartTeaser/> : accueil, /nos-maisons, /tarifs, /annemasse-colocation,
 * /chambre-a-louer-annemasse) — un texte PROPRE À CHAQUE PAGE, jamais une phrase canonique (critique A1/X2). Source des textes du
 * 13/11/2026 (table du bloc statique), au caractère près.
 *
 * (Corrections du 13/11/2026, relecture technique) Sorti d'appartFacts.ts, qui le réexporte (gardes, tests, outils : mêmes noms) :
 * l'accueil, « Nos maisons » et /tarifs ne chargent plus la fiche, le tableau, les listes et les exceptions de L'Appart pour le
 * seul texte de leur bloc (≈ 5 Ko compressés de moins par page). Aucun texte ne change.
 *
 * Aucun nombre tapé : tout vient de APPART ; les faits des maisons cités passent par MAISONS_REFERRAL (règle de frontière :
 * eslint.config.js et tools/test/appart-boundary.test.mjs). Module pur, zéro React.
 */
import { APPART } from "./appart";
import { MAISONS_REFERRAL } from "./entityFacts";
import { aOrAn, thousands } from "./stats";
import { capital, ordinal, timesPerWeek, word } from "./appartWords";

type AppartLang = "fr" | "en";

// Aucun calcul au chargement du module (ni appel ni lecture de propriété) : une page qui charge appartFacts.ts sans montrer de
// bloc statique (listes, /lappart) ne garde pas ce module dans ses morceaux (Rollup le retire, faute d'effet de bord).
const A = APPART;
const R = MAISONS_REFERRAL;

// ── Bloc statique « L'Appart » des pages de la marque (<AppartTeaser/>) ───────────────────────────────────────────────────

/** Les 5 pages qui portent le bloc (exactement une fois ; jamais ailleurs). */
export const APPART_TEASER_ROUTES = ["/", "/nos-maisons", "/tarifs", "/annemasse-colocation", "/chambre-a-louer-annemasse"] as const;
export type AppartTeaserRoute = (typeof APPART_TEASER_ROUTES)[number];

export interface AppartTeaserText {
  /** Sur-titre (accueil et « Nos maisons ») ; null ailleurs. */
  eyebrow: string | null;
  title: string;
  text: string;
  link: string;
}

/** Le texte du bloc, propre à chaque page (jamais une phrase canonique : critique A1/X2). */
export function appartTeaser(route: AppartTeaserRoute, lang: AppartLang): AppartTeaserText {
  const en = lang === "en";
  const P = A.price;
  /** « 530 € » / « €530 » : la suite à deux, par personne — seulement dans la forme P5 (« soit 530 € par personne à deux »). */
  const perPerson = { fr: `${thousands(P.suitePerPersonEur, "\u00a0")} €`, en: `€${thousands(P.suitePerPersonEur, ",")}` };
  const T = A.transit, std = A.rooms.standard, suite = A.rooms.suite;
  const discover = en ? `Discover ${A.name}` : `Découvrir ${A.name}`;
  const also = en ? "Also at La Villa Coliving" : "Aussi chez La Villa Coliving";
  const ours = en ? `${A.name}, our flatshare in ${A.commune}` : `${A.name}, notre colocation à ${A.commune}`;
  const walk = en ? `${aOrAn(T.stationWalkMin)} ${T.stationWalkMin}-minute walk from ${A.commune} station` : `à ${T.stationWalkMin} min à pied de la gare d'${A.commune}`;
  const included = en ? "with bills, fibre, streaming and cleaning of the shared areas included" : "charges, fibre, streaming et ménage des communs compris";
  switch (route) {
    case "/":
      return {
        eyebrow: also,
        title: ours,
        text: en
          ? `${A.rooms.total} rooms in a ${A.flat.surfaceM2} m² flat, ${walk}. A simple flatshare, bills included, from ${P.from.en.chf} a month. No pool or sauna here: that's the houses.`
          : `${A.rooms.total} chambres dans un appartement de ${A.flat.surfaceM2} m², ${walk}. Une colocation simple, charges comprises, dès ${P.from.fr.chf} par mois. Ici, ni piscine ni sauna : ça, ce sont les maisons.`,
        link: discover,
      };
    case "/nos-maisons":
      return {
        eyebrow: also,
        title: ours,
        text: en
          ? `${A.name} isn't a ${ordinal(R.totalHouses + 1, "en")} house: it's a shared flat in ${A.commune}, near the station. ${A.rooms.total} furnished rooms of ${A.rooms.surface.min} to ${A.rooms.surface.max} m², ${aOrAn(A.flat.livingKitchenM2)} ${A.flat.livingKitchenM2} m² living room and kitchen, a balcony. From ${P.from.en.chf} a month, ${included}. No pool, sauna or gym on site: for that, see the ${word(R.totalHouses, "en")} houses above.`
          : `${A.name} n'est pas une ${ordinal(R.totalHouses + 1, "fr")} maison : c'est un appartement en colocation, à ${A.commune}, dans le quartier de la gare. ${A.rooms.total} chambres meublées de ${A.rooms.surface.min} à ${A.rooms.surface.max} m², un séjour-cuisine de ${A.flat.livingKitchenM2} m², un balcon. Dès ${P.from.fr.chf} par mois, ${included}. Pas de piscine, de sauna ni de salle de sport sur place : pour ça, ce sont les ${word(R.totalHouses, "fr")} maisons ci-dessus.`,
        link: discover,
      };
    case "/tarifs":
      return {
        eyebrow: null,
        title: en ? `${A.name}: the flatshare, from ${P.from.en.chf} a month` : `${A.name} : la colocation, dès ${P.from.fr.chf} par mois`,
        text: en
          ? `${A.name} is our flatshare in ${A.commune}, near the station: ${A.rooms.total} rooms in a ${A.flat.surfaceM2} m² flat. ${capital(word(std.numbers.length, "en"))} ${std.surfaceM2} m² rooms at ${P.room.en.chf} a month (${P.room.en.eur}) and a ${suite.surfaceM2} m² suite, for one or two people, at ${P.suite.en.chf} a month (${P.suite.en.eur}, or ${perPerson.en} each for two). The rent covers bills, fibre, streaming and cleaning of the shared areas ${timesPerWeek(A.cleaningPerWeek, "en")}. It doesn't cover bed linen, towels or cleaning products. ${A.name} has no pool, sauna or gym: the list of ${R.includedItems} services further down is the houses'.`
          : `${A.name} est notre colocation à ${A.commune}, dans le quartier de la gare : ${A.rooms.total} chambres dans un appartement de ${A.flat.surfaceM2} m². ${capital(word(std.numbers.length, "fr"))} chambres de ${std.surfaceM2} m² à ${P.room.fr.chf} par mois (${P.room.fr.eur}) et une suite de ${suite.surfaceM2} m², pour une ou deux personnes, à ${P.suite.fr.chf} par mois (${P.suite.fr.eur}, soit ${perPerson.fr} par personne à deux). Le loyer comprend les charges, la fibre, le streaming et le ménage des parties communes ${timesPerWeek(A.cleaningPerWeek, "fr")}. Il ne comprend pas le linge de lit, les serviettes ni les produits d'entretien. ${A.name} n'a ni piscine, ni sauna, ni salle de sport : la liste des ${R.includedItems} services, plus bas, est celle des maisons.`,
        link: en ? `See ${A.name} and its ${A.rooms.total} rooms` : `Voir ${A.name} et ses ${A.rooms.total} chambres`,
      };
    case "/annemasse-colocation":
      return {
        eyebrow: null,
        title: en ? `${A.name}: the flatshare near ${A.commune} station` : `${A.name} : la colocation du quartier de la gare d'${A.commune}`,
        text: en
          ? `${capital(aOrAn(T.stationWalkMin))} ${T.stationWalkMin}-minute walk from ${A.commune} station and ${aOrAn(T.tramStop.walkMin)} ${T.tramStop.walkMin}-minute walk from tram 17: ${A.rooms.total} furnished rooms in a ${A.flat.surfaceM2} m² flat, with ${aOrAn(A.flat.livingKitchenM2)} ${A.flat.livingKitchenM2} m² living room and kitchen and a balcony. From ${P.from.en.chf} a month, ${included}. In euros: from ${P.from.en.eur}. Geneva Eaux-Vives is ${T.eauxVivesDoorToDoorMin} minutes door to door.`
          : `À ${T.stationWalkMin} min à pied de la gare d'${A.commune} et à ${T.tramStop.walkMin} min du tram 17 : ${A.rooms.total} chambres meublées dans un appartement de ${A.flat.surfaceM2} m², avec un séjour-cuisine de ${A.flat.livingKitchenM2} m² et un balcon. Dès ${P.from.fr.chf} par mois, ${included}. En euros : dès ${P.from.fr.eur}. Genève-Eaux-Vives est à ${T.eauxVivesDoorToDoorMin} min porte-à-porte.`,
        link: en ? `${A.name}, our flatshare near the station` : `${A.name}, notre colocation du quartier de la gare`,
      };
    case "/chambre-a-louer-annemasse":
      return {
        eyebrow: null,
        title: en ? `${A.name}, the flatshare near the station` : `${A.name}, la colocation du quartier de la gare`,
        text: en
          ? `${A.rooms.total} furnished rooms ${walk}, from ${P.from.en.chf} a month, ${included}. Bed linen and cleaning products are not included.`
          : `${A.rooms.total} chambres meublées ${walk}, dès ${P.from.fr.chf} par mois, ${included}. Le linge de lit et les produits d'entretien ne sont pas compris.`,
        link: discover,
      };
    default: {
      const never: never = route;
      throw new Error(`appartTeaser : page inconnue (${String(never)})`);
    }
  }
}
