/**
 * Shared entity/property constants for consistent filtering across dashboard tabs.
 * Sleep In SCI owns Le Loft + Le Lodge.
 * La Villa LMP owns La Villa.
 * Mont-Blanc is a standalone.
 *
 * IMPORTANT: Property slugs MUST match the Supabase `properties.slug` values:
 *   lavilla, leloft, lelodge, montblanc (NO hyphens)
 */

// Maps entity filter keys → array of property slugs belonging to that entity
export const ENTITY_SLUGS: Record<string, string[]> = {
  'la-villa': ['lavilla'],
  'sleep-in': ['leloft', 'lelodge'],
  'mont-blanc': ['montblanc'],
};

// Display labels for entity filters
export const ENTITY_LABELS: Record<string, string> = {
  'la-villa': 'La Villa (LMP)',
  'sleep-in': 'Sleep In (SCI)',
  'mont-blanc': 'Mont-Blanc',
};

// Property slug → entity filter key
export const PROPERTY_TO_ENTITY: Record<string, string> = {
  'lavilla': 'la-villa',
  'leloft': 'sleep-in',
  'lelodge': 'sleep-in',
  'montblanc': 'mont-blanc',
};

// Standard filter options for entity-based filtering (used in UI buttons)
export const ENTITY_FILTER_OPTIONS = [
  { value: 'all', label: 'Toutes' },
  { value: 'la-villa', label: 'La Villa' },
  { value: 'sleep-in', label: 'Sleep In' },
  { value: 'mont-blanc', label: 'Mont-Blanc' },
];

// Standard filter options for per-property filtering
export const PROPERTY_FILTER_OPTIONS = [
  { value: 'all', label: 'Toutes' },
  { value: 'lavilla', label: 'La Villa' },
  { value: 'leloft', label: 'Le Loft' },
  { value: 'lelodge', label: 'Le Lodge' },
];

// Property slug → full address (for PDF generation, letters, etc.)
export const PROPERTY_ADDRESSES: Record<string, string> = {
  'lavilla': '25 rue de la Paix, 74100 Ville-la-Grand',
  'leloft': '2 rue du Salève, 74100 Ambilly',
  'lelodge': '15 avenue Émile Zola, 74100 Annemasse',
};

/**
 * Helper: filter an array of items by entity slug.
 * Items must have a property_id field; properties lookup provides slug mapping.
 */
export function filterByEntity<T extends { property_id: string }>(
  items: T[],
  entityFilter: string,
  properties: { id: string; slug: string }[]
): T[] {
  if (entityFilter === 'all') return items;
  const allowedSlugs = ENTITY_SLUGS[entityFilter];
  if (allowedSlugs) {
    const allowedPropIds = new Set(properties.filter(p => allowedSlugs.includes(p.slug)).map(p => p.id));
    return items.filter(item => allowedPropIds.has(item.property_id));
  }
  // Fallback: treat as slug
  return items.filter(item => {
    const prop = properties.find(p => p.id === item.property_id);
    return prop?.slug === entityFilter;
  });
}
