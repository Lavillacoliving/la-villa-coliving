import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";

// Contenu fourni par Jérôme (Pages_Legales_Contenu.md, 2026-06-12).
// Registre : vouvoiement neutre — exception ASSUMÉE à la règle de tutoiement,
// à EXCLURE de la passe d'unification éditoriale (Phase 4b).
// EN = traduction de courtoisie ; la version française fait foi.
// ⚠️ Deux adaptations vs le document source, signalées à Jérôme :
//   1. §2a liste les champs RÉELS du formulaire actuel (pas de date de naissance
//      ni de situation professionnelle — retirés du formulaire lors du CRO 06/2026).
//   2. §2d/§7 : pas de référence à un « bandeau cookies » tant qu'aucun bandeau
//      n'existe sur le site (note cookies du doc source manquante — à trancher).
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

export function PolitiqueConfidentialitePage() {
  const { language } = useLanguage();
  const isEn = language === "en";

  return (
    <main className="relative pt-16">
      <SEO
        title={isEn ? "Privacy Policy" : "Politique de confidentialité"}
        description={
          isEn
            ? "How La Villa Coliving collects and protects your personal data: application form, processors, retention periods and your rights (GDPR)."
            : "Comment La Villa Coliving collecte et protège vos données personnelles : formulaire de candidature, sous-traitants, durées de conservation et vos droits (RGPD)."
        }
      />
      <div className="bg-white">
        <div className="container-custom max-w-3xl py-20">
          <h1
            className="text-4xl md:text-5xl font-bold text-[#1C1917] mb-6"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {isEn ? "Privacy Policy" : "Politique de confidentialité"}
          </h1>
          <p className="text-[#57534E] italic mb-4">
            {isEn
              ? "Protecting your data matters to us. This page explains, in plain terms, what data we collect, why, how long we keep it, and what your rights are."
              : "La protection de vos données nous importe. Cette page explique, simplement, quelles données nous collectons, pourquoi, combien de temps nous les conservons, et quels sont vos droits."}
          </p>
          {isEn ? (
            <p className="text-sm text-[#78716C] italic mb-10">
              This page is a courtesy translation. The French version prevails.
            </p>
          ) : (
            <div className="mb-10" />
          )}

          {isEn ? (
            <>
              <Section title="1. Data controller">
                <p>
                  The controller of the data collected on lavillacoliving.com is{" "}
                  <strong>SCI Sleep In</strong> (trading as La Villa Coliving), 8 rue du Mont
                  Blanc, 74100 Annemasse, France — contact:{" "}
                  <a href="mailto:jerome@lavillacoliving.com" className="underline underline-offset-4">
                    jerome@lavillacoliving.com
                  </a>
                  .
                </p>
              </Section>
              <Section title="2. Data we collect and purposes">
                <p>
                  <strong>a) Application form.</strong> When you apply to join one of our houses,
                  we collect: first name, last name, email address, phone number, planned arrival
                  period, intended length of stay and how you heard about us.
                  <br />
                  <em>Purpose:</em> reviewing your application, contacting you and organising the
                  next steps (exchange, discovery call, visit).{" "}
                  <em>Legal basis:</em> pre-contractual measures taken at your request (art.
                  6(1)(b) GDPR).
                </p>
                <p>
                  <strong>b) Tenancy management.</strong> If your application leads to a tenancy,
                  additional data is collected to establish and perform the rental agreement
                  (supporting documents, billing data).
                  <br />
                  <em>Legal basis:</em> performance of the contract (art. 6(1)(b)) and legal
                  obligations (art. 6(1)(c)).
                </p>
                <p>
                  <strong>c) Direct exchanges.</strong> When you contact us by email or WhatsApp,
                  we process the data you provide on that occasion.
                  <br />
                  <em>Purpose:</em> answering your requests. <em>Legal basis:</em> legitimate
                  interest (art. 6(1)(f)) or pre-contractual measures.
                </p>
                <p>
                  <strong>d) Browsing data and audience measurement.</strong> We use Google
                  Analytics 4 to understand how the Site is used (page views, journeys, traffic
                  sources).
                  <br />
                  <em>Legal basis:</em> your consent (art. 6(1)(a)). You can refuse or block these
                  cookies at any time (see section 7).
                </p>
                <p>
                  We do not collect any "sensitive" data and we make no fully automated decisions
                  producing legal effects.
                </p>
              </Section>
              <Section title="3. Recipients and processors">
                <p>
                  Your data is intended exclusively for the publisher and is{" "}
                  <strong>never sold or rented</strong>. To operate, the Site relies on technical
                  providers (processors within the meaning of the GDPR):
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Supabase</strong> — database hosting (applications); hosting region:{" "}
                    <strong>Frankfurt</strong>
                  </li>
                  <li>
                    <strong>Vercel Inc.</strong> (United States) — Site hosting
                  </li>
                  <li>
                    <strong>Google LLC</strong> (United States) — audience measurement (Google
                    Analytics 4)
                  </li>
                  <li>
                    <strong>Meta Platforms</strong> (WhatsApp) — when you choose to contact us via
                    WhatsApp
                  </li>
                  <li>
                    <strong>Resend</strong> (Resend, Inc., United States — sending operated from
                    the EU region, eu-west-1) — transactional emails (confirmations, login links)
                  </li>
                  <li>
                    Internal automation tools (<strong>n8n Cloud</strong>,{" "}
                    <strong>Hostinger</strong> infrastructure)
                  </li>
                </ul>
                <p>
                  Some of these providers are located outside the European Union (United States).
                  Transfers are governed by the mechanisms provided for by the GDPR (standard
                  contractual clauses of the European Commission and/or the EU–US Data Privacy
                  Framework to which these providers adhere).
                </p>
              </Section>
              <Section title="4. Retention periods">
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Unsuccessful applications</strong>: 2 years from the last contact,
                    then deletion.
                  </li>
                  <li>
                    <strong>Residents' files</strong>: duration of the tenancy, then the
                    applicable statutory retention periods (civil, accounting and tax
                    limitations).
                  </li>
                  <li>
                    <strong>Email/WhatsApp exchanges</strong>: as long as needed to handle the
                    request, then limited archiving.
                  </li>
                  <li>
                    <strong>Audience measurement data</strong>: 14 months maximum (Google
                    Analytics setting).
                  </li>
                </ul>
              </Section>
              <Section title="5. Your rights">
                <p>
                  In accordance with the GDPR and the French Data Protection Act, you have the
                  rights of access, rectification, erasure, restriction, objection and
                  portability of your data, as well as the right to set post-mortem directives.
                </p>
                <p>
                  To exercise them, write to{" "}
                  <a href="mailto:jerome@lavillacoliving.com" className="underline underline-offset-4">
                    jerome@lavillacoliving.com
                  </a>{" "}
                  stating your request. You will receive a reply within one month. You may
                  withdraw your consent at any time for the processing operations that rely on
                  it.
                </p>
                <p>
                  If, after contacting us, you consider that your rights are not respected, you
                  may lodge a complaint with the <strong>CNIL</strong> (cnil.fr).
                </p>
              </Section>
              <Section title="6. Security">
                <p>
                  We implement appropriate technical and organisational measures to protect your
                  data: encrypted exchanges (HTTPS), database access control, access restricted to
                  authorised persons only.
                </p>
              </Section>
              <Section title="7. Cookies">
                <p>The Site uses cookies and trackers:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Strictly necessary cookies</strong> for the operation of the Site
                    (exempt from consent);
                  </li>
                  <li>
                    <strong>Audience measurement cookies</strong> (Google Analytics 4) — you can
                    block them at any time in your browser settings.
                  </li>
                </ul>
              </Section>
              <p className="text-sm text-[#78716C] italic">Last updated: {LAST_UPDATED_EN}</p>
            </>
          ) : (
            <>
              <Section title="1. Responsable du traitement">
                <p>
                  Le responsable du traitement des données collectées sur lavillacoliving.com
                  est : <strong>SCI Sleep In</strong> (nom commercial La Villa Coliving), 8 rue du
                  Mont Blanc, 74100 Annemasse — contact :{" "}
                  <a href="mailto:jerome@lavillacoliving.com" className="underline underline-offset-4">
                    jerome@lavillacoliving.com
                  </a>
                  .
                </p>
              </Section>
              <Section title="2. Données collectées et finalités">
                <p>
                  <strong>a) Formulaire de candidature.</strong> Lorsque vous candidatez pour
                  rejoindre l'une de nos maisons, nous collectons : prénom, nom, adresse email,
                  numéro de téléphone, période d'arrivée souhaitée, durée de séjour envisagée et
                  la manière dont vous nous avez connus.
                  <br />
                  <em>Finalité :</em> étudier votre candidature, vous recontacter et organiser les
                  étapes suivantes (échange, appel découverte, visite).{" "}
                  <em>Base légale :</em> mesures précontractuelles prises à votre demande (art.
                  6.1.b RGPD).
                </p>
                <p>
                  <strong>b) Gestion locative.</strong> Si votre candidature aboutit à une
                  location, des données complémentaires sont collectées pour l'établissement et
                  l'exécution du contrat de location (pièces du dossier, données de facturation).
                  <br />
                  <em>Base légale :</em> exécution du contrat (art. 6.1.b RGPD) et obligations
                  légales (art. 6.1.c).
                </p>
                <p>
                  <strong>c) Échanges directs.</strong> Lorsque vous nous contactez par email ou
                  WhatsApp, nous traitons les données que vous nous transmettez à cette occasion.
                  <br />
                  <em>Finalité :</em> répondre à vos demandes. <em>Base légale :</em> intérêt
                  légitime (art. 6.1.f) ou mesures précontractuelles.
                </p>
                <p>
                  <strong>d) Données de navigation et mesure d'audience.</strong> Nous utilisons
                  Google Analytics 4 pour comprendre l'utilisation du Site (pages vues, parcours,
                  origine du trafic).
                  <br />
                  <em>Base légale :</em> votre consentement (art. 6.1.a). Vous pouvez refuser ou
                  bloquer ces cookies à tout moment (voir section 7).
                </p>
                <p>
                  Nous ne collectons aucune donnée dite « sensible » et ne pratiquons aucune
                  décision entièrement automatisée produisant des effets juridiques.
                </p>
              </Section>
              <Section title="3. Destinataires et sous-traitants">
                <p>
                  Vos données sont destinées exclusivement à l'éditeur et ne sont{" "}
                  <strong>jamais vendues ni louées</strong>. Pour fonctionner, le Site s'appuie
                  sur des prestataires techniques (sous-traitants au sens du RGPD) :
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Supabase</strong> — hébergement de la base de données (candidatures) ;
                    région d'hébergement : <strong>Francfort</strong>
                  </li>
                  <li>
                    <strong>Vercel Inc.</strong> (États-Unis) — hébergement du Site
                  </li>
                  <li>
                    <strong>Google LLC</strong> (États-Unis) — mesure d'audience (Google
                    Analytics 4)
                  </li>
                  <li>
                    <strong>Meta Platforms</strong> (WhatsApp) — lorsque vous choisissez de nous
                    contacter via WhatsApp
                  </li>
                  <li>
                    <strong>Resend</strong> (Resend, Inc., États-Unis — envoi opéré depuis la
                    région UE, eu-west-1) — envoi des emails transactionnels (confirmations, liens
                    de connexion)
                  </li>
                  <li>
                    Outils d'automatisation internes (<strong>n8n Cloud</strong>, infrastructure{" "}
                    <strong>Hostinger</strong>)
                  </li>
                </ul>
                <p>
                  Certains de ces prestataires sont situés hors de l'Union européenne
                  (États-Unis). Les transferts sont encadrés par les mécanismes prévus par le RGPD
                  (clauses contractuelles types de la Commission européenne et/ou cadre
                  UE–États-Unis de protection des données auquel ces prestataires adhèrent).
                </p>
              </Section>
              <Section title="4. Durées de conservation">
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Candidatures n'ayant pas abouti</strong> : 2 ans à compter du dernier
                    contact, puis suppression.
                  </li>
                  <li>
                    <strong>Dossiers des résidents</strong> : durée de la location, puis durées
                    légales de conservation (prescriptions civiles, comptables et fiscales
                    applicables).
                  </li>
                  <li>
                    <strong>Échanges email/WhatsApp</strong> : durée nécessaire au traitement de
                    la demande, puis archivage limité.
                  </li>
                  <li>
                    <strong>Données de mesure d'audience</strong> : 14 mois maximum (paramétrage
                    Google Analytics).
                  </li>
                </ul>
              </Section>
              <Section title="5. Vos droits">
                <p>
                  Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des
                  droits d'accès, de rectification, d'effacement, de limitation, d'opposition et
                  de portabilité de vos données, ainsi que du droit de définir des directives
                  post-mortem.
                </p>
                <p>
                  Pour les exercer : écrivez à{" "}
                  <a href="mailto:jerome@lavillacoliving.com" className="underline underline-offset-4">
                    jerome@lavillacoliving.com
                  </a>{" "}
                  en précisant votre demande. Une réponse vous sera apportée dans un délai d'un
                  mois. Vous pouvez à tout moment retirer votre consentement pour les traitements
                  qui en dépendent.
                </p>
                <p>
                  Si vous estimez, après nous avoir contactés, que vos droits ne sont pas
                  respectés, vous pouvez adresser une réclamation à la <strong>CNIL</strong>{" "}
                  (cnil.fr).
                </p>
              </Section>
              <Section title="6. Sécurité">
                <p>
                  Nous mettons en œuvre des mesures techniques et organisationnelles appropriées
                  pour protéger vos données : chiffrement des échanges (HTTPS), contrôle d'accès à
                  la base de données, limitation des accès aux seules personnes habilitées.
                </p>
              </Section>
              <Section title="7. Cookies">
                <p>Le Site utilise des cookies et traceurs :</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Cookies strictement nécessaires</strong> au fonctionnement du Site
                    (exemptés de consentement) ;
                  </li>
                  <li>
                    <strong>Cookies de mesure d'audience</strong> (Google Analytics 4) — vous
                    pouvez les refuser ou les bloquer à tout moment dans les réglages de votre
                    navigateur.
                  </li>
                </ul>
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
