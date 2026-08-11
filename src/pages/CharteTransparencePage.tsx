import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";

// Contenu fourni par Jérôme (ADDENDUM_3_Services_et_Charte.md, annexes 1 et 2, 2026-08-06).
// ⚠️ TEXTE VERBATIM — ne pas reformuler, ne pas « améliorer », ne pas ajouter de mention.
// ⚠️ Registre : TUTOIEMENT, contrairement aux autres pages éditoriales (mentions légales et
//    politique de confidentialité sont en vouvoiement assumé). C'est voulu : la charte
//    s'adresse aux résidents dans le registre produit du site. À EXCLURE de toute passe
//    d'unification éditoriale qui voudrait la basculer au vouvoiement.
// La version française fait foi ; l'anglais est la traduction fournie par Jérôme.
// Date en dur, à mettre à jour à chaque modification substantielle.
const LAST_UPDATED_FR = "1er septembre 2026";
const LAST_UPDATED_EN = "September 1, 2026";

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

export function CharteTransparencePage() {
  const { language } = useLanguage();
  const isEn = language === "en";

  return (
    <main className="relative pt-16">
      <SEO
        title={isEn ? "Transparency charter" : "Charte de transparence"}
        description={
          isEn
            ? "One all-in price, zero fees, free community services, charges at actual cost: how your rent is built at La Villa, explained line by line."
            : "Un seul prix tout compris, 0 frais, services communautaires gratuits, charges au coût réel : comment ton loyer est construit, expliqué ligne à ligne."
        }
      />
      <div className="bg-white">
        <div className="container-custom max-w-3xl py-20">
          <h1
            className="text-4xl md:text-5xl font-bold text-[#1C1917] mb-4"
            style={{ fontFamily: "DM Serif Display, serif" }}
          >
            {isEn ? "Our transparency charter" : "Notre charte de transparence"}
          </h1>
          <p className="text-lg text-[#78716C] italic mb-12">
            {isEn
              ? "The price you see is the price you pay. Here's how — and why."
              : "Le prix que tu vois est le prix que tu paies. Voici comment — et pourquoi."}
          </p>

          {isEn ? (
            <>
              <Section title="One price, everything included">
                <p>
                  Your monthly payment covers your room, the shared spaces and amenities of the
                  house (depending on the house: pool, sauna, gym, garden), water, energy, internet
                  and the upkeep of common areas. There is nothing else to pay — not before, not
                  during, not after. One single exception, and we'd rather name it: having your own
                  room cleaned, if you want it. The price is given to you upfront, you take it if
                  you like, you stop it whenever you like.
                </p>
              </Section>

              <Section title="Zero fees — that's our model">
                <p>
                  No agency fees, no application fees, no viewing or check-in fees. We don't make
                  money when you sign: we make money when you stay, because you're happy here.
                  That's what keeps our interests aligned with yours.
                </p>
              </Section>

              <Section title="Our community services are free">
                <p>
                  Yoga classes, fitness classes, the monthly community evening, events, WhatsApp
                  hotline: none of it is billed to you, neither as an extra nor as a package. These
                  services are part of the house, not part of your bill.
                </p>
              </Section>

              <Section title="One price — rooms are earned, not bought">
                <p>
                  All our rooms share the same price, in two simple tiers, depending on whether the
                  bathroom is private or shared between two rooms. No premium for the view, no floor
                  upgrade, no yield management. And when a room becomes free, it's offered first to
                  current residents, by seniority: here, the best room doesn't cost more — you earn
                  it by staying.
                </p>
              </Section>

              <Section title="No imposed services">
                <p>
                  No compulsory "package", no hidden options, no service billed on top that would be
                  a condition of your tenancy. The one paid option we do offer — having your own
                  room cleaned — is visible, priced upfront and commitment-free: nobody needs it to
                  live here. The amenities of the house are part of the place: they're included, for
                  everyone, full stop.
                </p>
              </Section>

              <Section title="A fixed charge set at actual cost">
                <p>
                  Your charges are a fixed monthly fee, set house by house in line with actual
                  observed costs, and governed by French law (décret no. 87-713). It covers energy,
                  water, cleaning, upkeep of indoor and outdoor spaces and equipment, and supplies.
                  No year-end surprise adjustment: your budget is known in advance.
                </p>
              </Section>

              <Section title="Prices shown in francs, a lease in euros">
                <p>
                  You earn in Swiss francs, your home is in France: we show our prices in CHF so you
                  can compare with Geneva at a glance. That amount is indicative, converted at a
                  reference rate we display and update regularly — and your lease, like every lease
                  in France, is drawn up in euros. It's that euro amount that is guaranteed, on your
                  contract and on your rent receipts.
                </p>
              </Section>

              <Section title="Your lease tells you everything">
                <p>
                  Your contract is a furnished tenancy under the 1989 French law, with its
                  protections: annual review capped by the INSEE rent index (IRL), disclosure of the
                  last rent paid by the previous occupant of your room, regulated security deposit.
                  An appendix attached to the lease explains, in plain terms, how your monthly
                  payment is built.
                </p>
              </Section>

              <Section title="A question? Ask it.">
                <p>
                  Before signing, during your stay, when you leave: every line can be explained to
                  you. We'd rather answer a question than leave a doubt standing.
                </p>
              </Section>

              <hr className="border-[#E7E5E4] my-10" />

              <p className="text-[#78716C] italic mb-10">
                This charter describes how we operate. It is neither an argument against anyone nor
                a marketing promise: it's the real user manual for our houses.
              </p>

              <p className="text-sm text-[#78716C] italic">Last updated: {LAST_UPDATED_EN}</p>
            </>
          ) : (
            <>
              <Section title="Un seul prix, tout compris">
                <p>
                  Ta mensualité couvre ta chambre, les espaces et équipements de la maison (selon la
                  maison : piscine, sauna, salle de sport, jardin), l'eau, l'énergie, internet et
                  l'entretien des communs. Il n'y a rien d'autre à payer — ni avant, ni pendant, ni
                  après. Une seule exception, et nous préférons te la nommer : le ménage de ta
                  chambre, si tu le souhaites. Son tarif t'est donné à l'avance, tu le prends si tu
                  veux, tu l'arrêtes quand tu veux.
                </p>
              </Section>

              <Section title="0 frais — c'est notre modèle">
                <p>
                  Pas de frais d'agence, pas de frais de dossier, pas de frais de visite ni d'état
                  des lieux. Nous ne gagnons pas d'argent quand tu signes : nous en gagnons quand tu
                  restes, parce que tu es bien. C'est ce qui aligne nos intérêts avec les tiens.
                </p>
              </Section>

              <Section title="Nos services communautaires sont gratuits">
                <p>
                  Cours de yoga, cours de sport, soirée communautaire mensuelle, événements, hotline
                  WhatsApp : rien de tout cela ne t'est facturé, ni en supplément, ni sous forme de
                  forfait. Ces services font partie de la maison, pas de ta facture.
                </p>
              </Section>

              <Section title="Un tarif unique — les chambres s'obtiennent, elles ne s'achètent pas">
                <p>
                  Toutes nos chambres sont au même tarif, décliné en deux niveaux simplement, selon
                  que la salle d'eau est privative ou partagée entre deux chambres. Pas de
                  supplément vue, pas d'option étage, pas de yield management. Et quand une chambre
                  se libère, elle est proposée d'abord aux résidents en place, par ancienneté : chez
                  nous, la meilleure chambre ne se paie pas plus cher — elle se gagne en restant.
                </p>
              </Section>

              <Section title="Aucun service imposé">
                <p>
                  Aucun « pack » obligatoire, aucune option cachée, aucun service facturé en
                  supplément qui conditionnerait ta location. La seule option payante qui existe
                  chez nous — le ménage de ta chambre — est visible, tarifée d'avance et sans
                  engagement : personne n'en a besoin pour vivre ici. Les équipements de la maison,
                  eux, font partie du lieu : ils sont inclus, pour tout le monde, point.
                </p>
              </Section>

              <Section title="Un forfait de charges collé aux coûts réels">
                <p>
                  Tes charges sont un forfait fixe, établi maison par maison en cohérence avec les
                  coûts réellement constatés, et encadré par la loi (décret n° 87-713). Il couvre
                  l'énergie, l'eau, le ménage, l'entretien des espaces intérieurs, extérieurs et des
                  équipements, ainsi que les fournitures. Pas de régularisation surprise en fin
                  d'année : ton budget est connu d'avance.
                </p>
              </Section>

              <Section title="Des prix affichés en francs, un bail en euros">
                <p>
                  Tu vis en francs suisses, ton logement est en France : nos prix s'affichent en CHF
                  pour que tu compares d'un coup d'œil avec Genève. C'est un montant indicatif,
                  converti à un taux de référence que nous affichons et actualisons régulièrement —
                  et ton bail, comme tout bail en France, est établi en euros. C'est ce montant en
                  euros qui est garanti, sur ton contrat comme sur tes quittances.
                </p>
              </Section>

              <Section title="Ton bail te dit tout">
                <p>
                  Ton contrat est un bail meublé loi 1989, avec ses protections : révision annuelle
                  limitée à l'IRL, mention du dernier loyer payé par l'occupant précédent de ta
                  chambre, dépôt de garantie encadré. Une annexe jointe au bail t'explique, noir sur
                  blanc, comment ta mensualité est construite.
                </p>
              </Section>

              <Section title="Une question ? Pose-la.">
                <p>
                  Avant la signature, pendant ton séjour, à ton départ : chaque ligne peut t'être
                  expliquée. Nous préférons une question posée à un doute conservé.
                </p>
              </Section>

              <hr className="border-[#E7E5E4] my-10" />

              <p className="text-[#78716C] italic mb-10">
                Cette charte décrit notre façon de faire. Elle n'est ni un argument contre qui que
                ce soit, ni une promesse marketing : c'est le mode d'emploi réel de nos maisons.
              </p>

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
