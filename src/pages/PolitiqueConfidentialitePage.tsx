import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";

// ⚠️ TODO[à fournir par Jérôme] : identité du responsable de traitement
// (raison sociale + adresse) et durée de conservation des candidatures non
// retenues (proposition par défaut : 2 ans, standard CNIL recrutement/location).
// Cette page ne doit PAS partir en production tant que les placeholders
// « [À COMPLÉTER … ] » sont visibles.

const PLACEHOLDER = {
  responsable: "[À COMPLÉTER : raison sociale]",
  siege: "[À COMPLÉTER : adresse du siège social]",
  dureeCandidatures: "[À VALIDER : 2 ans]",
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

export function PolitiqueConfidentialitePage() {
  const { language } = useLanguage();
  const isEn = language === "en";

  return (
    <main className="relative pt-16">
      <SEO
        title={isEn ? "Privacy Policy" : "Politique de confidentialité"}
        description={
          isEn
            ? "How La Villa Coliving collects and protects your personal data: application form, emails, analytics, your rights (GDPR)."
            : "Comment La Villa Coliving collecte et protège vos données personnelles : formulaire de candidature, emails, mesure d'audience, vos droits (RGPD)."
        }
      />
      <div className="bg-white">
        <div className="container-custom max-w-3xl py-20">
          <h1
            className="text-4xl md:text-5xl font-bold text-[#1C1917] mb-12"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {isEn ? "Privacy Policy" : "Politique de confidentialité"}
          </h1>

          {isEn ? (
            <>
              <Section title="Data controller">
                <p>
                  {PLACEHOLDER.responsable}, {PLACEHOLDER.siege} — contact:{" "}
                  <a href="mailto:contact@lavillacoliving.com" className="underline underline-offset-4">
                    contact@lavillacoliving.com
                  </a>
                  .
                </p>
              </Section>
              <Section title="Data we collect">
                <p>When you submit the application form, we collect:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>first name and last name,</li>
                  <li>email address and phone number,</li>
                  <li>planned arrival period and intended length of stay,</li>
                  <li>how you heard about us (optional).</li>
                </ul>
                <p>
                  We do not collect any sensitive data and we never sell your data to third
                  parties.
                </p>
              </Section>
              <Section title="Purpose and legal basis">
                <p>
                  This data is used solely to review your application, contact you and organise
                  the next steps (discovery call). Legal basis: pre-contractual measures taken at
                  your request (art. 6(1)(b) GDPR).
                </p>
              </Section>
              <Section title="Processors">
                <ul className="list-disc pl-6 space-y-1">
                  <li>Supabase — database hosting (application storage),</li>
                  <li>Resend — sending of confirmation and follow-up emails,</li>
                  <li>Vercel — website hosting,</li>
                  <li>Google Analytics 4 — anonymous audience measurement.</li>
                </ul>
              </Section>
              <Section title="Retention">
                <p>
                  Applications that do not lead to a tenancy are kept for {PLACEHOLDER.dureeCandidatures}{" "}
                  and then deleted. Data of residents is kept for the duration of the tenancy and
                  the applicable legal retention periods.
                </p>
              </Section>
              <Section title="Your rights">
                <p>
                  You can request access, rectification, erasure, restriction, portability of your
                  data or object to its processing by writing to{" "}
                  <a href="mailto:contact@lavillacoliving.com" className="underline underline-offset-4">
                    contact@lavillacoliving.com
                  </a>
                  . You may also lodge a complaint with the CNIL (cnil.fr).
                </p>
              </Section>
              <Section title="Cookies">
                <p>
                  This site uses Google Analytics 4 for audience measurement. You can block these
                  cookies in your browser settings at any time.
                </p>
              </Section>
            </>
          ) : (
            <>
              <Section title="Responsable de traitement">
                <p>
                  {PLACEHOLDER.responsable}, {PLACEHOLDER.siege} — contact :{" "}
                  <a href="mailto:contact@lavillacoliving.com" className="underline underline-offset-4">
                    contact@lavillacoliving.com
                  </a>
                  .
                </p>
              </Section>
              <Section title="Données collectées">
                <p>Lorsque vous envoyez le formulaire de candidature, nous collectons :</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>prénom et nom,</li>
                  <li>adresse email et numéro de téléphone,</li>
                  <li>période d'arrivée envisagée et durée de séjour souhaitée,</li>
                  <li>la façon dont vous nous avez connus (facultatif).</li>
                </ul>
                <p>
                  Nous ne collectons aucune donnée sensible et ne vendons jamais vos données à des
                  tiers.
                </p>
              </Section>
              <Section title="Finalité et base légale">
                <p>
                  Ces données servent uniquement à étudier votre candidature, vous recontacter et
                  organiser la suite (appel découverte). Base légale : mesures précontractuelles
                  prises à votre demande (art. 6.1.b du RGPD).
                </p>
              </Section>
              <Section title="Sous-traitants">
                <ul className="list-disc pl-6 space-y-1">
                  <li>Supabase — hébergement de la base de données (stockage des candidatures),</li>
                  <li>Resend — envoi des emails de confirmation et de suivi,</li>
                  <li>Vercel — hébergement du site,</li>
                  <li>Google Analytics 4 — mesure d'audience anonyme.</li>
                </ul>
              </Section>
              <Section title="Durée de conservation">
                <p>
                  Les candidatures qui n'aboutissent pas à une location sont conservées{" "}
                  {PLACEHOLDER.dureeCandidatures} puis supprimées. Les données des résidents sont
                  conservées pendant la durée du bail et les délais légaux applicables.
                </p>
              </Section>
              <Section title="Vos droits">
                <p>
                  Vous pouvez demander l'accès, la rectification, l'effacement, la limitation, la
                  portabilité de vos données ou vous opposer à leur traitement en écrivant à{" "}
                  <a href="mailto:contact@lavillacoliving.com" className="underline underline-offset-4">
                    contact@lavillacoliving.com
                  </a>
                  . Vous pouvez aussi adresser une réclamation à la CNIL (cnil.fr).
                </p>
              </Section>
              <Section title="Cookies">
                <p>
                  Ce site utilise Google Analytics 4 pour la mesure d'audience. Vous pouvez bloquer
                  ces cookies à tout moment dans les réglages de votre navigateur.
                </p>
              </Section>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
