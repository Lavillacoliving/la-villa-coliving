import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";

// (25/11/2026) Page « Partenaires » : regroupe les liens retour demandés par les annuaires où le site
// est inscrit (Plan Autorité, Pilier 2). Seul accès depuis le site : le lien « Partenaires » du bas du
// pied de page, pour que ces liens ne pèsent sur aucune page de vente.
// Quand l'annuaire fournit un code de lien retour, il est repris tel quel (même href, même ancre, sans
// nofollow) : le modérateur le vérifie avant de valider la fiche. Sinon, lien vers notre fiche, ancre de
// marque. Annuaire suivant = une ligne de plus dans PARTNERS.
const PARTNERS: { href: string; anchor: string }[] = [
  {
    href: "https://www.haute-savoie.net/",
    anchor: "ANNUAIRE HAUTE SAVOIE 74, Referencement Gratuit Annecy Chamonix Thonon",
  },
  {
    // (25/11/2026) Notre fiche Hoodspot ; l'adresse redirige (301) vers annuaire.petitesaffiches.fr.
    href: "https://hoodspot.fr/location-biens-immobiliers-terrains/la-villa-coliving-88215381000016/",
    anchor: "La Villa Coliving sur Hoodspot",
  },
];

export function PartenairesPage() {
  const { language } = useLanguage();
  const isEn = language === "en";

  return (
    <main className="relative pt-16">
      <SEO
        title={isEn ? "Partners and directories" : "Partenaires et annuaires"}
        description={
          isEn
            ? "The directories and partners that list La Villa Coliving, boutique coliving near Geneva."
            : "Les annuaires et partenaires qui référencent La Villa Coliving, coliving boutique près de Genève."
        }
      />
      <div className="bg-white">
        <div className="container-custom max-w-3xl py-20">
          <h1
            className="text-4xl md:text-5xl font-bold text-[#1C1917] mb-6"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            {isEn ? "Partners and directories" : "Partenaires et annuaires"}
          </h1>
          <p className="text-[#57534E] leading-relaxed mb-10">
            {isEn
              ? "The directories and partners that list La Villa Coliving."
              : "Les annuaires et partenaires qui référencent La Villa Coliving."}
          </p>
          <ul className="space-y-3 text-[#57534E] leading-relaxed list-disc pl-5">
            {PARTNERS.map((p) => (
              <li key={p.href}>
                <a href={p.href} className="underline underline-offset-4 hover:text-[#1C1917]">
                  {p.anchor}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
