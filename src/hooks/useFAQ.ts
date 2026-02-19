import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface FAQItem {
  id: string;
  category: string;
  subcategory: string | null;
  question: string;
  answer: string;
  keywords: string[];
  priority: number;
  active: boolean;
}

let faqCache: FAQItem[] | null = null;
let faqCacheTs = 0;
const TTL = 10 * 60 * 1000;

export function useFAQ() {
  const [faqItems, setFaqItems] = useState<FAQItem[]>(faqCache || []);
  const [loading, setLoading] = useState(!faqCache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (faqCache && Date.now() - faqCacheTs < TTL) {
      setFaqItems(faqCache);
      setLoading(false);
      return;
    }
    const go = async () => {
      setLoading(true);
      const { data, error: e } = await supabase
        .from('knowledge_base').select('*')
        .eq('active', true).order('category').order('priority');
      if (e) { setError(e.message); setLoading(false); return; }
      faqCache = data as FAQItem[];
      faqCacheTs = Date.now();
      setFaqItems(faqCache);
      setLoading(false);
    };
    go();
  }, []);
  const getByCat = (c: string) => faqItems.filter(f => f.category === c);
  const cats = [...new Set(faqItems.map(f => f.category))];
  return { faqItems, loading, error, getByCategory: getByCat, categories: cats };
}
