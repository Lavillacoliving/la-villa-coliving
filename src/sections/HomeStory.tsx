/**
 * Accueil — section Récit « Tu arrives sans connaître personne. Ça ne dure pas. » (brief « Accueil : récit, avis, photos » du
 * 27/11/2026, lot 2a, §0.3 A, D3 ; mise en page version B « fraîcheur compacte », §0.9). Trois rangées alternées : photo
 * (n° 5, 6, 7 — vraies photos des maisons) et texte. Aucun bouton (§3). Une phrase = un nœud texte.
 */
import { useLanguage } from "@/contexts/LanguageContext";
import { responsiveImage } from "@/lib/responsiveImage";
import { HOME_PHOTOS } from "@/data/homePhotos";

const SIZES = "(min-width: 1280px) 650px, (min-width: 1024px) 53vw, calc(100vw - 40px)";

export function HomeStory() {
  const { language } = useLanguage();
  const en = language === "en";
  const L = en ? "en" : "fr";
  const rows = [
    {
      key: "bags",
      photo: HOME_PHOTOS.storyRoom,
      title: en ? "You drop your bags" : "Tu poses tes valises",
      text: en
        ? "Your room is furnished, the bed linen is waiting, the fibre is on. On your first evening, all that's left is to unpack."
        : "Ta chambre est meublée, le linge de lit t'attend, la fibre fonctionne. Le premier soir, il te reste à défaire tes sacs.",
    },
    {
      key: "nothing-to-argue",
      photo: HOME_PHOTOS.storyKitchen,
      title: en ? "Nothing to argue about" : "Rien ne fâche",
      text: en
        ? "Shared areas are cleaned three times a week, everyday supplies arrive every month, and everything is in one rent. No one negotiates a cleaning rota or a bill to split."
        : "Les parties communes sont nettoyées trois fois par semaine, les produits du quotidien arrivent chaque mois, tout tient dans un seul loyer. Personne ne négocie de planning de ménage ni de facture à partager.",
    },
    {
      key: "house-size",
      photo: HOME_PHOTOS.storyLiving,
      title: en ? "A house of 7 to 12" : "Une maison de 7 à 12",
      text: en
        ? "Enough people that there's always someone to have dinner with, few enough to know everyone. Residents have a say in who joins them."
        : "Assez de monde pour qu'il y ait toujours quelqu'un pour dîner, assez peu pour connaître tout le monde. Les résidents participent au choix de ceux qui les rejoignent.",
    },
  ];

  return (
    <section className="bg-lvc-sand py-10 md:py-[72px]" aria-labelledby="home-story-title">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <span className="lvc-eyebrow">{en ? "LIFE IN THE HOUSES" : "LA VIE DANS LES MAISONS"}</span>
        <h2 id="home-story-title" className="lvc-display mt-3 max-w-[860px] text-[30px] leading-[1.12] text-lvc-ink md:text-[46px] md:leading-[1.08]">
          {en ? "You arrive knowing no one. That doesn't last." : "Tu arrives sans connaître personne. Ça ne dure pas."}
        </h2>
        <p className="mt-4 max-w-[830px] text-base leading-relaxed text-lvc-text md:text-lg">
          {en
            ? "Our houses welcome cross-border workers and expats settling near Geneva. Here is what awaits you."
            : "Nos maisons accueillent des frontaliers et des expats qui s'installent près de Genève. Voici ce qui t'attend."}
        </p>
        <div className="mt-8 flex flex-col gap-10 md:mt-12 lg:gap-11">
          {rows.map((r, i) => (
            <div
              key={r.key}
              data-reveal
              className={`grid items-center gap-5 lg:gap-14 ${i % 2 === 1 ? "lg:grid-cols-[minmax(0,510fr)_minmax(0,650fr)]" : "lg:grid-cols-[minmax(0,650fr)_minmax(0,510fr)]"}`}
            >
              <div className={`overflow-hidden rounded-[20px] md:rounded-[26px] ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                <img
                  src={r.photo.src}
                  {...responsiveImage(r.photo.src, SIZES)}
                  alt={r.photo.alt[L]}
                  width={r.photo.width}
                  height={r.photo.height}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/10] w-full object-cover"
                />
              </div>
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <span className="lvc-display block text-[22px] leading-none text-lvc-accent" aria-hidden="true">{`0${i + 1}`}</span>
                <h3 className="mt-3 text-[22px] font-semibold leading-tight text-lvc-ink md:text-[28px]">{r.title}</h3>
                <p className="mt-3 text-base leading-[1.65] text-lvc-text md:text-[17px]">{r.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
