/**
 * Tableau « Trajets depuis <maison> » — Lot L2 « Emplacement et transport » (09/10/2026, brief « Ingénierie des
 * créneaux », question §8.2 : tableau commun à pied / Léman Express / tram 17 / vélo, décision Jérôme).
 *
 * Composant PUR : il ne lit que src/data/houseLocation.ts (source unique, nombres de TRANSIT) — aucune donnée
 * Supabase, aucune date calculée : HTML prérendu = premier rendu client (anti-#418). Chaque cellule est UN nœud
 * texte, donc les gardes peuvent comparer le texte au caractère près (houseLocationStrings).
 * Rendu sobre, cohérent avec <EntityFacts/> : bordures #E7E5E4, fond #FAF9F6, lien or #b8860b.
 * D1.5 (« on laisse vérifier ») : note de méthode sous le tableau + lien « Calculer mon trajet » (Google Maps,
 * transports, depuis le point public de la maison — jamais sa rue, 12/10/2026), nouvel onglet.
 * (L'Appart, 13/11/2026) Le composant sert aussi à L'Appart : sa page lui fournit le contenu (`content`, src/data/appartLocation.ts :
 * lignes en minutes, note du 12/11, lien depuis la gare et la phrase « le calcul part de la gare d'Annemasse »). Une maison rend
 * exactement le même HTML, et les pages des maisons n'embarquent aucun texte de L'Appart (le composant n'importe que houseLocation).
 */
import { useLanguage } from "@/contexts/LanguageContext";
import { PLACE_LABEL, type AppartKey, type MaisonKey } from "@/data/places";
import {
  houseCommuteRows,
  houseCommuteNote,
  houseDirectionsUrl,
  houseDirectionsLabel,
  type CommuteRow,
  type LocLang,
} from "@/data/houseLocation";

/** Contenu du tableau : lignes, note de méthode, lien « Calculer mon trajet » et, quand le calcul ne part pas du lieu lui-même,
 *  la phrase qui le dit. */
export interface CommuteTableContent {
  rows: readonly CommuteRow[];
  note: string;
  directionsUrl: string;
  directionsStart?: string | null;
}

export type HouseCommuteTableProps = {
  /** Langue forcée ; sinon celle du contexte. */
  lang?: LocLang;
  className?: string;
} & (
  | { slug: MaisonKey; content?: undefined }
  | { slug: AppartKey; content: (lang: LocLang) => CommuteTableContent }
);

export function HouseCommuteTable(props: HouseCommuteTableProps) {
  const { lang, className = "" } = props;
  const { language } = useLanguage();
  const L: LocLang = lang ?? (language === "en" ? "en" : "fr");
  const en = L === "en";
  const slug = props.slug;
  const houseName = PLACE_LABEL[slug];
  const c: CommuteTableContent = props.content
    ? props.content(L)
    : { rows: houseCommuteRows(props.slug, L), note: houseCommuteNote(L), directionsUrl: houseDirectionsUrl(props.slug, L) };
  const rows = c.rows;
  // L'Appart : le calcul part de la gare d'Annemasse (point public), et la page le dit ; rien pour une maison.
  const directionsStart = c.directionsStart ?? null;

  return (
    <div className={`not-prose ${className}`} data-house-commute-table={slug}>
      <div className="overflow-x-auto rounded-lg border border-[#E7E5E4] bg-[#FAF9F6]">
        {/* Largeurs fixées (26 / 32 / 42 %) et marges réduites sur mobile : la colonne « Temps » porte deux nombres
            (« 7 min de train · 17 min porte-à-porte ») et doit tenir en 2-3 lignes à 375 px (contrôle visuel du 09/10). */}
        <table className="w-full table-fixed text-sm text-left text-[#44403C]">
          <colgroup>
            <col className="w-[26%]" />
            <col className="w-[32%]" />
            <col className="w-[42%]" />
          </colgroup>
          <caption className="caption-top px-3 sm:px-4 pt-3 pb-2 text-left text-sm font-semibold text-[#1C1917]">
            {en ? `Commute from ${houseName}` : `Trajets depuis ${houseName}`}
          </caption>
          <thead>
            <tr className="border-b border-[#E7E5E4] text-xs uppercase tracking-wider text-[#78716C]">
              <th scope="col" className="px-3 sm:px-4 py-2 font-semibold">{en ? "Mode" : "Mode"}</th>
              <th scope="col" className="px-3 sm:px-4 py-2 font-semibold">{en ? "Destination" : "Destination"}</th>
              <th scope="col" className="px-3 sm:px-4 py-2 font-semibold">{en ? "Time" : "Temps"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E5E4]">
            {rows.map((r, i) => (
              <tr key={i} className="align-top">
                <th scope="row" className="px-3 sm:px-4 py-2 font-medium text-[#1C1917]">{r.mode}</th>
                <td className="px-3 sm:px-4 py-2">{r.destination}</td>
                <td className="px-3 sm:px-4 py-2">{r.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-[#78716C] mt-3">{c.note}</p>
      <a
        href={c.directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center mt-2 text-sm font-semibold text-[#b8860b] underline underline-offset-4 hover:text-[#1C1917] transition-colors"
      >
        {houseDirectionsLabel(L)}
      </a>
      {directionsStart && <p data-directions-start className="text-sm text-[#78716C] mt-1">{directionsStart}</p>}
    </div>
  );
}
