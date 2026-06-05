import type { ReactNode } from "react";
import { Helmet } from "react-helmet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buildFaqPageSchema, type QAPair } from "@/lib/structuredData";

interface FaqSectionProps {
  /** Titre localisé (résolu par la page appelante). */
  title: string;
  /** Q&A déjà résolues dans la langue courante. */
  items: QAPair[];
  /**
   * true → émet aussi le JSON-LD FAQPage construit depuis les MÊMES items visibles.
   * Laisser false sur les pages qui émettent déjà leur FAQPage via <SEO jsonLd>.
   */
  emitSchema?: boolean;
  id?: string;
  className?: string;
  intro?: ReactNode;
}

/**
 * Section FAQ réutilisable (orientée AEO).
 * Basée sur l'accordéon Radix (components/ui/accordion) : le texte des réponses
 * reste MONTÉ dans le DOM (masqué en CSS), donc le prérendu Puppeteer le capture
 * sans clic → les réponses sont présentes dans le HTML statique (crawlers + IA).
 * Tokens du site uniquement, pas de nouvelle lib.
 */
export function FaqSection({
  title,
  items,
  emitSchema = false,
  id = "faq",
  className = "",
  intro,
}: FaqSectionProps) {
  if (!items?.length) return null;
  return (
    <section id={id} className={`py-24 lg:py-32 bg-[#FAF9F6] ${className}`}>
      {emitSchema && (
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify(buildFaqPageSchema(items))}
          </script>
        </Helmet>
      )}
      <div className="max-w-3xl mx-auto px-6">
        <h2
          className="text-3xl md:text-4xl font-light text-[#1C1917] mb-6 text-center"
          style={{ fontFamily: "DM Serif Display, serif" }}
        >
          {title}
        </h2>
        {intro && (
          <div className="text-[#57534E] text-center max-w-2xl mx-auto mb-10">
            {intro}
          </div>
        )}
        <Accordion type="single" collapsible className="space-y-4">
          {items.map((item, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-white border border-[#E7E5E4] px-6"
            >
              <AccordionTrigger className="text-left hover:no-underline py-5 text-[#1C1917] font-medium">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-[#57534E] pb-5 leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
