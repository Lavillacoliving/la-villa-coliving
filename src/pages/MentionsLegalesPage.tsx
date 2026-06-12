import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";

// ⚠️ TODO[à fournir par Jérôme] : raison sociale, forme juridique, capital,
// SIREN/SIRET, RCS, adresse du siège, directeur de la publication.
// Cette page ne doit PAS partir en production tant que les placeholders
// « [À COMPLÉTER … ] » sont visibles.

const PLACEHOLDER = {
  raisonSociale: "[À COMPLÉTER : raison sociale]",
  formeJuridique: "[À COMPLÉTER : forme juridique — ex. SAS au capital de X €]",
  siret: "[À COMPLÉTER : SIREN/SIRET]",
  rcs: "[À COMPLÉTER : ville RCS]",
  siege: "[À COMPLÉTER : adresse du siège social]",
  directeur: "[À COMPLÉTER : directeur de la publication]",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2
        className="text-2xl font-bold text-[#1C1917] mb-4"
        style={{ fontFamily: "DM Serif Display, serif" }}
      >
        {title}
      </h2>
      <div className="text-[#57534E] leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export function MentionsLegalesPage() {
  const { language } = useLanguage();
  const isEn = language === "en";

  return (
    <main className="relative pt-16">
      <SEO
        title={isEn ? "Legal Notice" : "Mentions légales"}
        description={
          isEn
            ? "Legal notice of lavillacoliving.com — site publisher, hosting and intellectual property."
            : "Mentions légales de lavillacoliving.com — éditeur du site, hébergement et propriété intellectuelle."
        }
      />
      <div className="bg-white">
        <div className="container-custom max-w-3xl py-20">
          <h1
            className="text-4xl md:text-5xl font-bold text-[#1C1917] mb-12"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {isEn ? "Legal Notice" : "Mentions légales"}
          </h1>

          {isEn ? (
            <>
              <Section title="Site publisher">
                <p>
                  The website lavillacoliving.com is published by {PLACEHOLDER.raisonSociale} (
                  {PLACEHOLDER.formeJuridique}), registered under number {PLACEHOLDER.siret} (
                  {PLACEHOLDER.rcs}), with registered office at {PLACEHOLDER.siege}.
                </p>
                <p>Publication director: {PLACEHOLDER.directeur}.</p>
                <p>
                  Contact:{" "}
                  <a href="mailto:contact@lavillacoliving.com" className="underline underline-offset-4">
                    contact@lavillacoliving.com
                  </a>{" "}
                  · +33 6 64 31 51 34
                </p>
              </Section>
              <Section title="Hosting">
                <p>
                  The site is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723,
                  United States —{" "}
                  <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                    vercel.com
                  </a>
                  .
                </p>
                <p>
                  Application data (blog content, application forms) is hosted by Supabase —{" "}
                  <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                    supabase.com
                  </a>
                  .
                </p>
              </Section>
              <Section title="Intellectual property">
                <p>
                  All content on this site (texts, photographs, graphics, logo) is the property of
                  the publisher unless otherwise stated, and may not be reproduced without prior
                  written consent.
                </p>
              </Section>
              <Section title="Personal data">
                <p>
                  For any question regarding your personal data, please read our{" "}
                  <a href="/en/politique-de-confidentialite" className="underline underline-offset-4">
                    privacy policy
                  </a>
                  .
                </p>
              </Section>
            </>
          ) : (
            <>
              <Section title="Éditeur du site">
                <p>
                  Le site lavillacoliving.com est édité par {PLACEHOLDER.raisonSociale} (
                  {PLACEHOLDER.formeJuridique}), immatriculée sous le numéro {PLACEHOLDER.siret} (
                  {PLACEHOLDER.rcs}), dont le siège social est situé {PLACEHOLDER.siege}.
                </p>
                <p>Directeur de la publication : {PLACEHOLDER.directeur}.</p>
                <p>
                  Contact :{" "}
                  <a href="mailto:contact@lavillacoliving.com" className="underline underline-offset-4">
                    contact@lavillacoliving.com
                  </a>{" "}
                  · +33 6 64 31 51 34
                </p>
              </Section>
              <Section title="Hébergement">
                <p>
                  Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723,
                  États-Unis —{" "}
                  <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                    vercel.com
                  </a>
                  .
                </p>
                <p>
                  Les données applicatives (contenus du blog, formulaires de candidature) sont
                  hébergées par Supabase —{" "}
                  <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                    supabase.com
                  </a>
                  .
                </p>
              </Section>
              <Section title="Propriété intellectuelle">
                <p>
                  L'ensemble des contenus de ce site (textes, photographies, éléments graphiques,
                  logo) est la propriété de l'éditeur sauf mention contraire, et ne peut être
                  reproduit sans autorisation écrite préalable.
                </p>
              </Section>
              <Section title="Données personnelles">
                <p>
                  Pour toute question relative à vos données personnelles, consultez notre{" "}
                  <a href="/politique-de-confidentialite" className="underline underline-offset-4">
                    politique de confidentialité
                  </a>
                  .
                </p>
              </Section>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
