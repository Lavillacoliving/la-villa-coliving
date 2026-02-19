import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Property {
  id: string;
  name: string;
  slug: string;
  price_chf: number;
  deposit_months: number;
  location: string;
  address: string;
  city: string;
  room_count: number;
  description_fr: string;
  description_en: string;
  features_fr: string[];
  features_en: string[];
  status: string;
  is_coliving: boolean;
  whatsapp_group_url: string;
  entity_id: string;
}

let cache: Property[] | null = null;
let cacheTs = 0;
const TTL = 5 * 60 * 1000;

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>(cache || []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache && Date.now() - cacheTs < TTL) {
      setProperties(cache);
      setLoading(false);
      return;
    }
    const go = async () => {
      setLoading(true);
      const { data, error: e } = await supabase
        .from('properties').select('*')
        .eq('is_coliving', true).order('name');
      if (e) { setError(e.message); setLoading(false); return; }
      cache = data as Property[];
      cacheTs = Date.now();
      setProperties(cache);
      setLoading(false);
    };
    go();
  }, []);
  const getProperty = (slug: string) => properties.find(p => p.slug === slug);
  const getPricing = () => {
    const p = properties[0];
    return {
      price_chf: p?.price_chf || 1380,
      deposit_months: p?.deposit_months || 2,
      deposit_chf: (p?.price_chf || 1380) * (p?.deposit_months || 2),
    };
  };
  return { properties, loading, error, getProperty, getPricing };
}

export async function fetchPricing() {
  const { data } = await supabase
    .from('properties').select('price_chf, deposit_months')
    .eq('is_coliving', true).limit(1).single();
  return {
    price_chf: data?.price_chf || 1380,
    deposit_months: data?.deposit_months || 2,
    deposit_chf: (data?.price_chf || 1380) * (data?.deposit_months || 2),
  };
}
