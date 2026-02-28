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
  'lavilla': '34 rue du Foron, 74100 Ville-la-Grand',
  'leloft': '2 rue des Marronniers, 74100 Ambilly',
  'lelodge': '8 rue de Romagny, 74100 Annemasse',
};

// ==========================================
// Transaction types & rapprochement statuses
// ==========================================

export const TRANSACTION_TYPES = [
  { value: 'non_classe', label: 'Non classé', color: '#888' },
  { value: 'loyer', label: 'Loyer', color: '#22c55e' },
  { value: 'caution', label: 'Caution', color: '#3b82f6' },
  { value: 'caution_retour', label: 'Retour caution', color: '#8b5cf6' },
  { value: 'depense', label: 'Dépense', color: '#ef4444' },
  { value: 'inter_entite', label: 'Inter-entité', color: '#f59e0b' },
] as const;

export const RAPPROCHEMENT_STATUSES = [
  { value: 'non_rapproche', label: 'Non rapproché', color: '#dc2626', bg: '#fef2f2' },
  { value: 'auto', label: 'Auto', color: '#16a34a', bg: '#f0fdf4' },
  { value: 'manuel', label: 'Manuel', color: '#2563eb', bg: '#eff6ff' },
  { value: 'flag', label: 'À revoir', color: '#d97706', bg: '#fffbeb' },
  { value: 'verified', label: 'Vérifié', color: '#7c3aed', bg: '#faf5ff' },
] as const;

export const INVOICE_CATEGORIES = [
  'Consommable', 'Petit Mobilier', 'Mobilier', 'Travaux', 'Telco Web & Abonnements',
  'Note de Frais', 'Prestation', 'Eau et Energie', 'Assurances', 'Impots', 'Frais Bancaires',
] as const;

export function getTransactionTypeLabel(type: string): string {
  return TRANSACTION_TYPES.find(t => t.value === type)?.label || type;
}

export function getTransactionTypeColor(type: string): string {
  return TRANSACTION_TYPES.find(t => t.value === type)?.color || '#888';
}

export function getRapprochementBadge(status: string): { label: string; color: string; bg: string } {
  return RAPPROCHEMENT_STATUSES.find(s => s.value === status) || { label: status, color: '#888', bg: '#f5f5f5' };
}

// ==========================================
// Invoice storage (Supabase Storage bucket)
// ==========================================

export const INVOICE_STORAGE = {
  bucket: 'compta',
  pathPrefix: 'invoices',
  maxFileSizeMB: 10,
  allowedMimes: ['application/pdf'] as string[],
  entityCodes: {
    'c882e0ab-306b-490a-88cb-30578f3715fa': 'lmp',
    '5ab46544-9e4e-43de-9c8f-58721595c0db': 'sci',
    'c7feadb6-f340-450d-ac67-924e8254eeab': 'mb',
  } as Record<string, string>,
  /** Build storage path: invoices/{entityCode}/{YYYY-MM}/{timestamp}-{filename} */
  buildPath(entityId: string, fileName: string): string {
    const code = this.entityCodes[entityId] || 'unknown';
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const ts = Date.now();
    return `${this.pathPrefix}/${code}/${ym}/${ts}-${fileName}`;
  },
};

// Entity IDs for direct Supabase queries (from entities table)
export const ENTITY_IDS: Record<string, string> = {
  'LMP': 'c882e0ab-306b-490a-88cb-30578f3715fa',
  'SCI': '5ab46544-9e4e-43de-9c8f-58721595c0db',
  'MB': 'c7feadb6-f340-450d-ac67-924e8254eeab',
};

export const ENTITY_CODE_TO_FILTER: Record<string, string> = {
  'LMP': 'la-villa',
  'SCI': 'sleep-in',
  'MB': 'mont-blanc',
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
