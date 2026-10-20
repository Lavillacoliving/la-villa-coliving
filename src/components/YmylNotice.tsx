import { useLanguage } from "@/contexts/LanguageContext";
import { LocalizedLink } from "@/components/LocalizedLink";
import { Linkedin } from "lucide-react";
import { STATS } from "@/data/stats";
import { getFounderByAuthorName, getFoundersByAuthorName, ABOUT_PAGE_LIVE, type Founder } from "@/lib/structuredData";
import { YMYL_ARTICLES, YMYL_NOT_US, extractOfficialSources } from "@/lib/ymyl";

/**
 * Blocs E-E-A-T des articles YMYL (« Your Money or Your Life ») — brief 2026-07-06.
 *
 * Posture éditoriale (décision Jérôme 06/07, remplace l'Option 3 du 17/06) :
 * « praticien qui partage son expérience, sourcée » — pas « conseiller ». Trois blocs :
 *  - <YmylPosture>  en tête d'article : requalification honnête, adaptée au sujet ;
 *  - <YmylNotice>   en bas : sources officielles EXTRAITES des liens du contenu
 *                   (même principe AEO que le FAQPage : dérivé du visible, jamais dupliqué)
 *                   + rappel de non-substitution ;
 *  - <AuthorBox>    en bas : auteur nommé relié à /qui-sommes-nous + LinkedIn.
 */

/** Encadré « Notre posture » — en tête d'article YMYL, avant l'intro. */
export function YmylPosture({ slug }: { slug: string }) {
  const { language } = useLanguage();
  const fr = language !== "en";
  const domain = YMYL_ARTICLES[slug];
  if (!domain) return null;
  const notUs = YMYL_NOT_US[domain][fr ? "fr" : "en"];
  return (
    <aside className="mb-10 p-5 bg-[#FBF7F0] border border-[#E7D9C2] rounded-lg text-sm text-[#57534E]">
      <p className="font-medium text-[#1C1917] mb-1">{fr ? "Notre posture" : "Where we stand"}</p>
      <p>
        {fr ? (
          <>
            Nous ne sommes pas {notUs}. Cet article partage notre retour d'expérience de terrain — plus de{" "}
            {STATS.totalResidents} résidents frontaliers logés et accompagnés depuis {STATS.foundedYear} — et
            s'appuie sur les sources officielles citées et liées dans l'article. Chaque situation étant
            particulière, vérifie toujours la tienne auprès de l'administration concernée ou d'un
            professionnel.
          </>
        ) : (
          <>
            We are not {notUs}. This article shares our field experience — {STATS.totalResidents}+ cross-border
            residents housed and supported since {STATS.foundedYear} — and relies on the official sources cited
            and linked in the article. Every situation is different: always check yours with the relevant
            administration or a professional.
          </>
        )}
      </p>
    </aside>
  );
}

/** Encadré de fin d'article YMYL : sources officielles (liens du contenu) + non-substitution. */
export function YmylNotice({ content }: { content: string }) {
  const { language } = useLanguage();
  const fr = language !== "en";
  const sources = extractOfficialSources(content);
  return (
    <aside className="mt-12 p-5 bg-[#FBF7F0] border border-[#E7D9C2] rounded-lg text-sm text-[#57534E]">
      {sources.length > 0 && (
        <>
          <p className="font-medium text-[#1C1917] mb-2">
            {fr ? "Sources officielles" : "Official sources"}
          </p>
          <ul className="space-y-1 mb-3">
            {sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B08A5C] hover:underline"
                >
                  {s.host}
                </a>
                {" — "}
                {s.label}
              </li>
            ))}
          </ul>
        </>
      )}
      <p className="text-xs text-[#78716C]">
        {fr
          ? "Cet article est fourni à titre informatif et ne remplace pas un conseil personnalisé. Les règles évoluent : pour une décision engageante, vérifie auprès de l'administration concernée ou d'un professionnel (fiduciaire, juriste, conseiller spécialisé)."
          : "This article is provided for information only and does not replace personalised advice. Rules change: for any binding decision, check with the relevant administration or a professional (fiduciary, lawyer, specialised adviser)."}
      </p>
    </aside>
  );
}

/** Bloc auteur de fin d'article — auteur nommé relié à /qui-sommes-nous (page-auteur E-E-A-T). */
export function AuthorBox({ author }: { author: string }) {
  const { language } = useLanguage();
  const fr = language !== "en";
  const founders = getFoundersByAuthorName(author);
  // (D9 / Q17, 16/10/2026) Article signé des deux fondateurs : prénoms seuls, un lien « Qui sommes-nous », deux LinkedIn.
  if (founders.length === 2) return <AuthorBoxDuo fr={fr} founders={founders} />;
  const founder = getFounderByAuthorName(author);
  if (!founder) return null;
  // Tant que /qui-sommes-nous n'est pas routée (ABOUT_PAGE_LIVE=false), le nom
  // s'affiche sans lien interne — aucun lien mort en prod.
  const founderName = ABOUT_PAGE_LIVE ? (
    <LocalizedLink to="/qui-sommes-nous" className="font-medium text-[#1C1917] hover:text-[#D4A574]">
      {founder.name}
    </LocalizedLink>
  ) : (
    <span className="font-medium text-[#1C1917]">{founder.name}</span>
  );
  return (
    <aside className="mt-6 p-5 border border-[#E7E5E4] rounded-lg flex items-start gap-4">
      <div
        aria-hidden="true"
        className="w-12 h-12 rounded-full bg-[#1C1917] text-[#D4A574] flex items-center justify-center text-lg flex-shrink-0"
        style={{ fontFamily: '"DM Serif Display", serif' }}
      >
        {founder.name.charAt(0)}
      </div>
      <div className="text-sm text-[#57534E] leading-relaxed">
        <p>
          {fr ? (
            <>
              Écrit par {founderName}
              , {founder.jobTitle.fr.charAt(0).toLowerCase() + founder.jobTitle.fr.slice(1)}. Depuis{" "}
              {STATS.foundedYear}, nous logeons et accompagnons des frontaliers près de Genève — on connaît ces
              démarches parce qu'on les vit chaque semaine avec nos résidents.
            </>
          ) : (
            <>
              Written by {founderName}
              , {founder.jobTitle.en.charAt(0).toLowerCase() + founder.jobTitle.en.slice(1)}. Since{" "}
              {STATS.foundedYear}, we house and support cross-border workers near Geneva — we know these
              procedures because we live them every week with our residents.
            </>
          )}
        </p>
        <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
          {ABOUT_PAGE_LIVE && (
            <LocalizedLink to="/qui-sommes-nous" className="text-[#D4A574] hover:underline">
              {fr ? "Qui sommes-nous" : "Who we are"}
            </LocalizedLink>
          )}
          <a
            href={founder.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#78716C] hover:text-[#D4A574] transition-colors"
          >
            <Linkedin size={14} />
            LinkedIn
          </a>
        </p>
      </div>
    </aside>
  );
}

/** Bloc auteur d'un article signé « Jérôme et Fanny » (AUTHOR_DUO) — prénoms seuls à l'écran (D9), noms complets en JSON-LD. */
function AuthorBoxDuo({ fr, founders }: { fr: boolean; founders: Founder[] }) {
  const names = founders.map((f) => f.name.split(" ")[0]).join(fr ? " et " : " and ");
  return (
    <aside className="mt-6 p-5 border border-[#E7E5E4] rounded-lg flex items-start gap-4">
      <div aria-hidden="true" className="flex -space-x-3 flex-shrink-0">
        {founders.map((f) => (
          <div
            key={f.name}
            className="w-12 h-12 rounded-full bg-[#1C1917] text-[#D4A574] border-2 border-white flex items-center justify-center text-lg"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            {f.name.charAt(0)}
          </div>
        ))}
      </div>
      <div className="text-sm text-[#57534E] leading-relaxed">
        <p>
          {fr
            ? `Écrit par ${names}, cofondateurs de La Villa Coliving. Depuis ${STATS.foundedYear}, on loge et on accompagne des frontaliers près de Genève, et on gère nos trois maisons nous-mêmes.`
            : `Written by ${names}, co-founders of La Villa Coliving. Since ${STATS.foundedYear}, we've housed and supported cross-border workers near Geneva, and we run our three houses ourselves.`}
        </p>
        <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
          {ABOUT_PAGE_LIVE && (
            <LocalizedLink to="/qui-sommes-nous" className="text-[#D4A574] hover:underline">
              {fr ? "Qui sommes-nous" : "Who we are"}
            </LocalizedLink>
          )}
          {founders.map((f) => (
            <a
              key={f.linkedin}
              href={f.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#78716C] hover:text-[#D4A574] transition-colors"
            >
              <Linkedin size={14} />
              {`LinkedIn · ${f.name.split(" ")[0]}`}
            </a>
          ))}
        </p>
      </div>
    </aside>
  );
}
