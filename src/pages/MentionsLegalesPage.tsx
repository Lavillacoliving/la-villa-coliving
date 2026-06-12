import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";

// Contenu fourni par Jérôme (Pages_Legales_Contenu.md, 2026-06-12).
// Registre : vouvoiement neutre — exception ASSUMÉE à la règle de tutoiement,
// à EXCLURE de la passe d'unification éditoriale (Phase 4b).
// EN = traduction de courtoisie ; la version française fait foi.
// Date en dur, à mettre à jour à chaque modification substantielle.
const LAST_UPDATED_FR = "12 juin 2026";
const LAST_UPDATED_EN = "June 12, 2026";

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
            ? "Legal notice of lavillacoliving.com — site publisher (SCI Sleep In / La Villa Coliving), hosting and intellectual property."
            : "Mentions légales de lavillacoliving.com — éditeur du site (SCI Sleep In / La Villa Coliving), hébergement et propriété intellectuelle."
        }
      />
      <div className="bg-white">
        <div className="container-custom max-w-3xl py-20">
          <h1
            className="text-4xl md:text-5xl font-bold text-[#1C1917] mb-6"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {isEn ? "Legal Notice" : "Mentions légales"}
          </h1>
          {isEn && (
            <p className="text-sm text-[#78716C] italic mb-10">
              This page is a courtesy translation. The French version prevails.
            </p>
          )}
          {!isEn && <div className="mb-10" />}

          {isEn ? (
            <>
              <Section title="Site publisher">
                <p>
                  The website <strong>lavillacoliving.com</strong> (the "Site") is published by:
                </p>
                <p>
                  <strong>SLEEP IN</strong>, a French real-estate company (société civile
                  immobilière — SCI) with a capital of €1,000, trading as{" "}
                  <strong>La Villa Coliving</strong>.
                  <br />
                  Activity: rental of furnished accommodation.
                  <br />
                  Registered with the Thonon-les-Bains Trade and Companies Register (RCS) under
                  no. <strong>882 153 810</strong> (registered on 04/03/2020).
                  <br />
                  SIRET (head office): <strong>882 153 810 00016</strong>
                  <br />
                  Head office: <strong>8 rue du Mont Blanc, 74100 Annemasse, France</strong>
                  <br />
                  EU VAT no.: <strong>FR63882153810</strong>
                </p>
                <p>
                  Publication director: <strong>Jérôme Austin</strong>, managing partner.
                  <br />
                  Contact:{" "}
                  <a href="mailto:jerome@lavillacoliving.com" className="underline underline-offset-4">
                    jerome@lavillacoliving.com
                  </a>
                </p>
              </Section>
              <Section title="Hosting">
                <p>
                  The Site is hosted by <strong>Vercel Inc.</strong>, 440 N Barranca Avenue #4133,
                  Covina, CA 91723, United States —{" "}
                  <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                    vercel.com
                  </a>
                  .
                </p>
                <p>
                  Data collected through the Site is hosted on <strong>Supabase</strong>{" "}
                  infrastructure (database) — see the{" "}
                  <a href="/en/politique-de-confidentialite" className="underline underline-offset-4">
                    Privacy Policy
                  </a>
                  .
                </p>
              </Section>
              <Section title="Intellectual property">
                <p>
                  All content on the Site (texts, photographs, illustrations, logos, visual
                  identity, structure) is the exclusive property of the publisher unless otherwise
                  stated. Any reproduction, representation, modification or exploitation, in whole
                  or in part, without prior written authorisation is prohibited and constitutes
                  infringement within the meaning of articles L.335-2 et seq. of the French
                  Intellectual Property Code.
                </p>
                <p>The photographs of the houses are the property of the publisher.</p>
              </Section>
              <Section title="Liability">
                <p>
                  The publisher strives to keep the information published on the Site accurate and
                  up to date but cannot guarantee the absence of errors or omissions. Published
                  information (in particular prices, availability and descriptions of the
                  accommodation) is provided for information purposes and does not constitute a
                  contractual commitment; only the signed rental agreement is binding.
                </p>
                <p>
                  The Site contains links to third-party websites (public bodies, associations,
                  services). The publisher has no control over these sites and accepts no
                  liability for their content.
                </p>
              </Section>
              <Section title="Consumer mediation">
                <p>
                  In accordance with articles L.612-1 et seq. of the French Consumer Code,
                  consumers have the right to free recourse to a consumer mediator with a view to
                  the amicable resolution of a dispute.
                </p>
              </Section>
              <Section title="Governing law">
                <p>
                  The Site and this legal notice are governed by French law. Any dispute relating
                  to their interpretation or performance falls under the jurisdiction of the
                  competent French courts.
                </p>
              </Section>
              <p className="text-sm text-[#78716C] italic">Last updated: {LAST_UPDATED_EN}</p>
            </>
          ) : (
            <>
              <Section title="Éditeur du site">
                <p>
                  Le site <strong>lavillacoliving.com</strong> (ci-après « le Site ») est édité
                  par :
                </p>
                <p>
                  <strong>SLEEP IN</strong>, société civile immobilière (SCI) au capital de
                  1 000 €, exerçant sous le nom commercial <strong>La Villa Coliving</strong>.
                  <br />
                  Activité : location de logements meublés.
                  <br />
                  Immatriculée au RCS de Thonon-les-Bains sous le n°{" "}
                  <strong>882 153 810</strong> (immatriculation du 04/03/2020).
                  <br />
                  SIRET (siège) : <strong>882 153 810 00016</strong>
                  <br />
                  Siège social : <strong>8 rue du Mont Blanc, 74100 Annemasse, France</strong>
                  <br />
                  N° de TVA intracommunautaire : <strong>FR63882153810</strong>
                </p>
                <p>
                  Directeur de la publication : <strong>Jérôme Austin</strong>, gérant.
                  <br />
                  Contact :{" "}
                  <a href="mailto:jerome@lavillacoliving.com" className="underline underline-offset-4">
                    jerome@lavillacoliving.com
                  </a>
                </p>
              </Section>
              <Section title="Hébergement">
                <p>
                  Le Site est hébergé par <strong>Vercel Inc.</strong>, 440 N Barranca Avenue
                  #4133, Covina, CA 91723, États-Unis —{" "}
                  <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                    vercel.com
                  </a>
                  .
                </p>
                <p>
                  Les données collectées via le Site sont hébergées sur l'infrastructure de{" "}
                  <strong>Supabase</strong> (base de données) — voir la{" "}
                  <a href="/politique-de-confidentialite" className="underline underline-offset-4">
                    Politique de confidentialité
                  </a>
                  .
                </p>
              </Section>
              <Section title="Propriété intellectuelle">
                <p>
                  L'ensemble des contenus du Site (textes, photographies, illustrations, logos,
                  identité visuelle, structure) est la propriété exclusive de l'éditeur, sauf
                  mention contraire. Toute reproduction, représentation, modification ou
                  exploitation, totale ou partielle, sans autorisation écrite préalable est
                  interdite et constitue une contrefaçon au sens des articles L.335-2 et suivants
                  du Code de la propriété intellectuelle.
                </p>
                <p>Les photographies des maisons sont la propriété de l'éditeur.</p>
              </Section>
              <Section title="Responsabilité">
                <p>
                  L'éditeur s'efforce d'assurer l'exactitude et la mise à jour des informations
                  diffusées sur le Site, mais ne peut garantir l'absence d'erreurs ou d'omissions.
                  Les informations publiées (notamment les tarifs, disponibilités et descriptions
                  des logements) sont fournies à titre indicatif et ne constituent pas un
                  engagement contractuel ; seul le contrat de location signé fait foi.
                </p>
                <p>
                  Le Site contient des liens vers des sites tiers (organismes publics,
                  associations, services). L'éditeur n'exerce aucun contrôle sur ces sites et
                  décline toute responsabilité quant à leur contenu.
                </p>
              </Section>
              <Section title="Médiation de la consommation">
                <p>
                  Conformément aux articles L.612-1 et suivants du Code de la consommation, le
                  consommateur a le droit de recourir gratuitement à un médiateur de la
                  consommation en vue de la résolution amiable d'un litige.
                </p>
              </Section>
              <Section title="Droit applicable">
                <p>
                  Le Site et ses mentions légales sont régis par le droit français. Tout litige
                  relatif à leur interprétation ou exécution relève des juridictions françaises
                  compétentes.
                </p>
              </Section>
              <p className="text-sm text-[#78716C] italic">
                Dernière mise à jour : {LAST_UPDATED_FR}
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
