import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { TenantInfo } from '@/hooks/useTenant';
import { usePropertyContent } from '@/hooks/usePropertyContent';
import { BookOpen, LayoutGrid, Wifi, Info, AlertTriangle, Phone, Sparkles, Home, Loader2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface PortailContext {
  tenant: TenantInfo;
  language: 'fr' | 'en';
}

const sectionIcons: Record<string, LucideIcon> = {
  rules: BookOpen,
  spaces: LayoutGrid,
  wifi: Wifi,
  practical: Info,
  emergency: AlertTriangle,
  contacts: Phone,
  cleaning: Sparkles,
};

const sectionLabels: Record<string, { fr: string; en: string }> = {
  rules: { fr: 'Règles de vie', en: 'House Rules' },
  spaces: { fr: 'Règles des espaces', en: 'Spaces & Amenities' },
  wifi: { fr: 'WiFi & Streaming', en: 'WiFi & Streaming' },
  practical: { fr: 'Infos pratiques', en: 'Practical Info' },
  emergency: { fr: 'Urgences', en: 'Emergencies' },
  contacts: { fr: 'Contacts essentiels', en: 'Key Contacts' },
  cleaning: { fr: 'Entretien & ménage', en: 'Cleaning Schedule' },
};

export function MaMaisonPage() {
  const { tenant, language } = useOutletContext<PortailContext>();
  const [openSection, setOpenSection] = useState<string | null>('rules');

  const propertyKey = tenant.property_name.toLowerCase().replace(/\s+/g, '-')
    .replace('la-villa', 'lavilla')
    .replace('le-loft', 'leloft')
    .replace('le-lodge', 'lelodge');

  const { sections, loading } = usePropertyContent(tenant.property_id, propertyKey, language);

  const t = {
    fr: {
      title: 'Ma Maison',
      subtitle: `${tenant.property_name} — ${tenant.property_address}`,
      room: `Chambre ${tenant.room_number}`,
      noContent: 'Contenu en cours de préparation...',
    },
    en: {
      title: 'My Home',
      subtitle: `${tenant.property_name} — ${tenant.property_address}`,
      room: `Room ${tenant.room_number}`,
      noContent: 'Content coming soon...',
    },
  };

  const lang = t[language] || t.fr;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-[#D4A574]" />
      </div>
    );
  }

  // Determine which sections to show: from DB rows or fallback section keys
  const sectionKeys = sections.length > 0
    ? sections.map(s => s.section)
    : Object.keys(sectionLabels);

  return (
    <div>
      {/* Property header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#D4A574]/10 rounded-xl flex items-center justify-center">
            <Home className="w-6 h-6 text-[#D4A574]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{lang.title}</h2>
            <p className="text-sm text-gray-500">{lang.subtitle}</p>
            <p className="text-xs text-[#b8860b] font-medium mt-1">{lang.room}</p>
          </div>
        </div>
      </div>

      {/* Accordion sections */}
      <div className="space-y-2">
        {sectionKeys.map((key) => {
          const isOpen = openSection === key;
          const label = sectionLabels[key]?.[language] || sectionLabels[key]?.fr || key;
          const IconComponent = sectionIcons[key] || Info;
          const content = sections.find(s => s.section === key);

          return (
            <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => setOpenSection(isOpen ? null : key)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="w-5 h-5 text-[#D4A574]" />
                  <span className="font-medium text-gray-900">{label}</span>
                </div>
                <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                </svg>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 border-t border-gray-50">
                  <div className="pt-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {content?.content || lang.noContent}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
