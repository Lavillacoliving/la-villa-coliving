import { useLanguage } from "@/contexts/LanguageContext";
import { LocalizedLink } from "@/components/LocalizedLink";
import { Linkedin } from "lucide-react";
import { STATS } from "@/data/stats";
import { getFounderByAuthorName } from "@/lib/structuredData";
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
  const founder = getFounderByAuthorName(author);
  if (!founder) return null;
  return (
    <aside className="mt-6 p-5 border border-[#E7E5E4] rounded-lg flex items-start gap-4">
      <div
        aria-hidden="true"
        className="w-12 h-12 rounded-full bg-[#1C1917] text-[#D4A574] flex items-center justify-center text-lg flex-shrink-0"
        style={{ fontFamily: "DM Serif Display, serif" }}
      >
        {founder.name.charAt(0)}
      </div>
      <div className="text-sm text-[#57534E] leading-relaxed">
        <p>
          {fr ? (
            <>
              Écrit par{" "}
              <LocalizedLink to="/qui-sommes-nous" className="font-medium text-[#1C1917] hover:text-[#D4A574]">
                {founder.name}
              </LocalizedLink>
              , {founder.jobTitle.fr.charAt(0).toLowerCase() + founder.jobTitle.fr.slice(1)}. Depuis{" "}
              {STATS.foundedYear}, nous logeons et accompagnons des frontaliers près de Genève — on connaît ces
              démarches parce qu'on les vit chaque semaine avec nos résidents.
            </>
          ) : (
            <>
              Written by{" "}
              <LocalizedLink to="/qui-sommes-nous" className="font-medium text-[#1C1917] hover:text-[#D4A574]">
                {founder.name}
              </LocalizedLink>
              , {founder.jobTitle.en.charAt(0).toLowerCase() + founder.jobTitle.en.slice(1)}. Since{" "}
              {STATS.foundedYear}, we house and support cross-border workers near Geneva — we know these
              procedures because we live them every week with our residents.
            </>
          )}
        </p>
        <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
          <LocalizedLink to="/qui-sommes-nous" className="text-[#D4A574] hover:underline">
            {fr ? "Qui sommes-nous" : "Who we are"}
          </LocalizedLink>
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
