/**
 * Shared entity/property constants for consistent filtering across dashboard tabs.
 * Sleep In SCI owns Le Loft + Le Lodge.
 * La Villa LMP owns La Villa.
 * Mont-Blanc is a standalone.
 */

// Maps entity filter keys → array of property slugs belonging to that entity
export const ENTITY_SLUGS: Record<string, string[]> = {
  'la-villa': ['la-villa'],
  'sleep-in': ['le-loft', 'le-lodge'],
  'mont-blanc': ['mont-blanc'],
};

// Display labels for entity filters
export const ENTITY_LABELS: Record<string, string> = {
  'la-villa': 'La Villa (LMP)',
  'sleep-in': 'Sleep In (SCI)',
  'mont-blanc': 'Mont-Blanc',
};

// Property slug → entity filter key
export const PROPERTY_TO_ENTITY: Record<string, string> = {
  'la-villa': 'la-villa',
  'le-loft': 'sleep-in',
  'le-lodge': 'sleep-in',
  'mont-blanc': 'mont-blanc',
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
  { value: 'la-villa', label: 'La Villa' },
  { value: 'le-loft', label: 'Le Loft' },
  { value: 'le-lodge', label: 'Le Lodge' },
];

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
