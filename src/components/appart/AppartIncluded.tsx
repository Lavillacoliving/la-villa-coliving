/**
 * Tableau « Ce qui est compris, ce qui ne l'est pas » de L'Appart (page /lappart) — textes : src/data/appartFacts.ts
 * (`appartIncluded`, source des textes du 13/11/2026, « à confirmer »). On dit avant la candidature ce qui n'est pas compris :
 * linge, produits d'entretien, ménage de la chambre, assurance — et qu'il n'y a ni piscine, ni sauna, ni salle de sport.
 *
 * La ligne « Piscine, sauna, salle de sport » est une exception de la garde de mélange des gammes : elle nie ces équipements à
 * L'Appart et renvoie aux maisons (« Tu veux piscine et sauna ? Les maisons, dès 1 290 CHF. », lien vers /nos-maisons sur la
 * phrase entière : le texte de la cellule reste celui de la source, au caractère près).
 *
 * Une cellule = un nœud texte ; même habillage que <HouseCommuteTable/> (bordures #E7E5E4, fond #FAF9F6). Pur (anti-#418).
 */
import { LocalizedLink } from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { appartIncluded } from "@/data/appartFacts";

export interface AppartIncludedProps {
  /** Langue forcée ; sinon celle de l'URL. */
  lang?: "fr" | "en";
  /** Niveau du titre (h2 par défaut). */
  headingLevel?: 2 | 3;
  className?: string;
}

export function AppartIncluded({ lang, headingLevel = 2, className = "" }: AppartIncludedProps) {
  const { language } = useLanguage();
  const L = lang ?? (language === "en" ? "en" : "fr");
  const t = appartIncluded(L);
  const Heading = headingLevel === 3 ? "h3" : "h2";

  return (
    <section data-appart-included aria-labelledby="appart-included-title" className={`not-prose ${className}`}>
      <Heading
        id="appart-included-title"
        className="lvc-display text-2xl md:text-3xl text-[#1C1917] mb-2"
      >
        {t.title}
      </Heading>
      <p className="text-[#57534E] mb-5">{t.intro}</p>
      <div className="overflow-x-auto rounded-lg border border-[#E7E5E4] bg-[#FAF9F6]">
        {/* Disposition automatique (recette du 14/11/2026) : chaque colonne prend au moins la largeur de son mot le plus long
            (« demande », « INCLUDED? »). Avec des largeurs fixées (34 / 18 / 48 %), ces mots débordaient sur la colonne voisine de
            320 à 414 px (« demandecandidature. », « INCLUDEDETAILS ») ; à 320 px, le cadre défile de quelques pixels plutôt que
            de faire chevaucher deux textes. */}
        <table className="w-full table-auto text-sm text-left text-[#44403C]">
          <thead>
            <tr className="border-b border-[#E7E5E4] text-xs uppercase tracking-wider text-[#78716C]">
              {t.header.map((h) => (
                <th key={h} scope="col" className="px-3 sm:px-4 py-2 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E5E4]">
            {t.rows.map((r) => (
              <tr key={r.item} className="align-top">
                <th scope="row" className="px-3 sm:px-4 py-2 font-medium text-[#1C1917]">{r.item}</th>
                <td className="px-3 sm:px-4 py-2">{r.status}</td>
                <td className="px-3 sm:px-4 py-2">
                  {r.detailLink && r.detail.endsWith(r.detailLink.text) ? (
                    <>
                      {r.detail.slice(0, r.detail.length - r.detailLink.text.length)}
                      <LocalizedLink to={r.detailLink.href} className="underline underline-offset-4 text-[#1C1917] hover:text-[#b8860b] transition-colors">
                        {r.detailLink.text}
                      </LocalizedLink>
                    </>
                  ) : (
                    r.detail
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
