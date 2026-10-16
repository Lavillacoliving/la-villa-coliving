/**
 * CTA de fin d'article SANS prix (article « C'est réel ? », décision Q13 de Jérôme du 16/10/2026) : rendu par BlogPostPage
 * pour les slugs de NO_OFFER_ARTICLES, à la place du bloc offre (photo + « dès … CHF »). Bouton « Candidater » / « Apply »
 * (casse normale) + microcopie de réassurance de /candidature au mot près (« 2 minutes suffisent — réponse sous 48 h. »,
 * Lot 1d), et bouton secondaire WhatsApp. Mesure inchangée : `blog_cta_click` (position end) et `whatsapp_click`.
 */
import { LocalizedLink } from "@/components/LocalizedLink";
import { WhatsAppTextLink } from "@/components/WhatsAppButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { markInternalRef } from "@/lib/attribution";
import type { IntentBucket } from "@/data/blogIntentBuckets";

export function ArticleContactCta({ slug, bucket, context }: { slug: string; bucket: IntentBucket; context: string }) {
  const { language } = useLanguage();
  const en = language === "en";
  const to = `/candidature?src=article_cta&article=${encodeURIComponent(slug)}&pos=end`;

  const track = () => {
    markInternalRef("article_cta", slug, "end");
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "blog_cta_click", {
        cta_position: "end", cta_target: to, cta_rank: "primary", article_slug: slug, intent: bucket, language,
      });
    } catch { /* noop */ }
  };

  return (
    <section
      aria-label={en ? "Apply or message us" : "Candidater ou nous écrire"}
      className="not-prose my-12 rounded-lg border border-[#E7E5E4] bg-[#FAF9F6] p-6 md:p-8 text-center"
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
        <LocalizedLink
          to={to}
          onClick={track}
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#1C1917] text-white text-sm font-semibold hover:bg-[#44403C] transition-colors"
        >
          {en ? "Apply" : "Candidater"}
        </LocalizedLink>
        <WhatsAppTextLink context={context} />
      </div>
      <p className="mt-3 text-sm text-[#57534E]">
        {en ? "2 minutes is all it takes — reply within 48h." : "2 minutes suffisent — réponse sous 48 h."}
      </p>
    </section>
  );
}
