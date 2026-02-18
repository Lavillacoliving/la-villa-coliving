import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface Event {
  id: string;
  property_id: string | null;
  type: string;
  title_fr: string;
  title_en: string | null;
  date: string;
  time: string | null;
  location: string | null;
  description_fr: string | null;
  description_en: string | null;
  created_at: string;
}

export function useEvents(propertyId: string | undefined) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!propertyId) {
      setLoading(false);
      return;
    }

    async function fetchEvents() {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];

      const { data } = await supabase
        .from('events')
        .select('*')
        .or(`property_id.eq.${propertyId},property_id.is.null`)
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(20);

      if (data) setEvents(data as Event[]);
      setLoading(false);
    }

    fetchEvents();
  }, [propertyId]);

  return { events, loading };
}
