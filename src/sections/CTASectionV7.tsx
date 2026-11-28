import { LocalizedLink } from "@/components/LocalizedLink";
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { STATS } from '@/data/stats';

/**
 * VERSION 9: STONE & BRASS — CONDO PREMIUM
 * CTA section — dark bg, brass accent button.
 *
 * (Lot 2 de la refonte des pages de vente, maquette validée par Jérôme le 24/11/2026) Dernier appel : « Programmer une
 * visite » (rapport § 4.7) et WhatsApp. Le second bouton « Découvrir La Villa, Le Loft, Le Lodge » est retiré : les maisons
 * sont présentées plus haut, avec « Compare-les ».
 */
export function CTASectionV7() {
  const { language } = useLanguage();
  // Même garde que les autres boutons : la mesure (GA4 `cta_click`) ne bloque jamais l'interface.
  const track = () => {
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "cta_click", {
        cta_position: "cta_final", cta_target: "/candidature", language,
      });
    } catch { /* noop */ }
  };

  return (
    <section className="py-16 md:py-24 bg-[#1C1917]">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          {/* Heading */}
          <h2 className="lvc-display text-[30px] md:text-[42px] lg:text-5xl leading-[1.1] text-white mb-5">
            {language === 'en' ? 'Your next home is waiting' : 'Ta prochaine maison t\'attend'}
          </h2>

          {/* Subtitle */}
          <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            {/* (Retenue premium, lot 1, T9 — 13/10/2026) Une seule phrase : les équipements et le trajet sont dits plus haut. */}
            {language === 'en'
              ? `Over ${STATS.totalResidents} residents have chosen our houses since ${STATS.foundedYear}.`
              : `Plus de ${STATS.totalResidents} résidents ont choisi nos maisons depuis ${STATS.foundedYear}.`}
          </p>

          {/* CTA */}
          <LocalizedLink
            to="/candidature"
            onClick={track}
            className="group lvc-btn-primary gap-3 px-10 py-4 text-base"
          >
            {language === 'en' ? 'Book a visit' : 'Programmer une visite'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </LocalizedLink>

          {/* WhatsApp CTA */}
          <div className="mt-6">
            <a
              href="https://wa.me/33664315134"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-white/60 hover:text-[#E0BB8A] transition-colors duration-300"
            >
              {language === 'en'
                ? 'Or ask us a question directly on WhatsApp →'
                : 'Ou pose-nous directement une question sur WhatsApp →'}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
