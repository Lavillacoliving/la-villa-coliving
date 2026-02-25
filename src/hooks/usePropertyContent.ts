import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getPropertyContent as getStaticContent, type PropertySection } from '@/i18n/portail-translations';

export interface PropertyContentRow {
  id: string;
  property_id: string;
  section: string;
  title_fr: string;
  title_en: string;
  content_fr: string;
  content_en: string;
  icon: string;
  sort_order: number;
  updated_at: string;
  updated_by: string | null;
}

/**
 * Hook to fetch property content from Supabase (property_content table).
 * Falls back to hardcoded portail-translations.ts if no DB rows exist.
 */
export function usePropertyContent(propertyId: string | null, propertyKey: string, language: 'fr' | 'en') {
  const [sections, setSections] = useState<PropertySection[]>([]);
  const [rawRows, setRawRows] = useState<PropertyContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromDb, setFromDb] = useState(false);

  useEffect(() => {
    if (!propertyId) {
      // Fallback to static
      setSections(getStaticContent(propertyKey, language));
      setFromDb(false);
      setLoading(false);
      return;
    }

    async function fetchContent() {
      setLoading(true);
      const { data, error } = await supabase
        .from('property_content')
        .select('*')
        .eq('property_id', propertyId)
        .order('sort_order', { ascending: true });

      if (error || !data || data.length === 0) {
        // Fallback to static content
        setSections(getStaticContent(propertyKey, language));
        setRawRows([]);
        setFromDb(false);
      } else {
        setRawRows(data);
        setSections(data.map((row: PropertyContentRow) => ({
          section: row.section,
          title: language === 'en' ? row.title_en || row.title_fr : row.title_fr,
          content: language === 'en' ? row.content_en || row.content_fr : row.content_fr,
        })));
        setFromDb(true);
      }
      setLoading(false);
    }

    fetchContent();
  }, [propertyId, propertyKey, language]);

  return { sections, rawRows, loading, fromDb };
}

/**
 * Save a single property content row (upsert)
 */
export async function savePropertyContent(row: Partial<PropertyContentRow> & { property_id: string; section: string }) {
  if (row.id) {
    const { error } = await supabase
      .from('property_content')
      .update({
        title_fr: row.title_fr,
        title_en: row.title_en,
        content_fr: row.content_fr,
        content_en: row.content_en,
        icon: row.icon,
        sort_order: row.sort_order,
        updated_at: new Date().toISOString(),
        updated_by: row.updated_by || 'dashboard',
      })
      .eq('id', row.id);
    return { error };
  } else {
    const { error } = await supabase
      .from('property_content')
      .insert({
        property_id: row.property_id,
        section: row.section,
        title_fr: row.title_fr || '',
        title_en: row.title_en || '',
        content_fr: row.content_fr || '',
        content_en: row.content_en || '',
        icon: row.icon || 'info',
        sort_order: row.sort_order || 0,
        updated_at: new Date().toISOString(),
        updated_by: row.updated_by || 'dashboard',
      });
    return { error };
  }
}

/**
 * Seed property_content from hardcoded translations for a given property
 */
export async function seedPropertyContent(propertyId: string, propertyKey: string) {
  const frSections = getStaticContent(propertyKey, 'fr');
  const enSections = getStaticContent(propertyKey, 'en');

  const iconMap: Record<string, string> = {
    rules: 'BookOpen',
    spaces: 'LayoutGrid',
    wifi: 'Wifi',
    practical: 'Info',
    emergency: 'AlertTriangle',
    contacts: 'Phone',
    cleaning: 'Sparkles',
  };

  const titleMap: Record<string, { fr: string; en: string }> = {
    rules: { fr: 'Règles de vie', en: 'House Rules' },
    spaces: { fr: 'Règles des espaces', en: 'Spaces & Amenities' },
    wifi: { fr: 'WiFi & Streaming', en: 'WiFi & Streaming' },
    practical: { fr: 'Infos pratiques', en: 'Practical Info' },
    emergency: { fr: 'Urgences', en: 'Emergencies' },
    contacts: { fr: 'Contacts essentiels', en: 'Key Contacts' },
    cleaning: { fr: 'Entretien & ménage', en: 'Cleaning Schedule' },
  };

  const rows = frSections.map((fr, idx) => {
    const en = enSections.find(e => e.section === fr.section);
    return {
      property_id: propertyId,
      section: fr.section,
      title_fr: titleMap[fr.section]?.fr || fr.section,
      title_en: titleMap[fr.section]?.en || fr.section,
      content_fr: fr.content,
      content_en: en?.content || fr.content,
      icon: iconMap[fr.section] || 'info',
      sort_order: idx,
      updated_by: 'seed',
    };
  });

  const { error } = await supabase.from('property_content').insert(rows);
  return { error, count: rows.length };
}
