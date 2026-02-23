import { useOutletContext } from 'react-router-dom';
import type { TenantInfo } from '@/hooks/useTenant';
import { useEvents } from '@/hooks/useEvents';

interface PortailContext {
  tenant: TenantInfo;
  language: 'fr' | 'en';
}

const eventTypeLabels: Record<string, string> = {
  sport: 'Sport',
  yoga: 'Yoga',
  party: 'Party',
  other: 'Event',
};

// WhatsApp group links per property (hardcoded)
const whatsappLinks: Record<string, { label: string; url: string }[]> = {
  lavilla: [
    { label: 'Groupe La Villa', url: '#' },
  ],
  leloft: [
    { label: 'Groupe Le Loft', url: '#' },
  ],
  lelodge: [
    { label: 'Groupe Le Lodge', url: '#' },
  ],
};

const sharedGroups = [
  { label: { fr: 'Sport & Fitness', en: 'Sport & Fitness' }, url: '#' },
  { label: { fr: 'Yoga', en: 'Yoga' }, url: '#' },
  { label: { fr: 'Événements', en: 'Events' }, url: '#' },
];

export function CommunautePage() {
  const { tenant, language } = useOutletContext<PortailContext>();
  const { events, loading: eventsLoading } = useEvents(tenant.property_id);

  const propertyKey = tenant.property_name.toLowerCase().replace(/\s+/g, '-')
    .replace('la-villa', 'lavilla').replace('le-loft', 'leloft').replace('le-lodge', 'lelodge');

  const t = {
    fr: {
      events: 'Événements à venir',
      noEvents: 'Aucun événement prévu pour le moment.',
      date: 'Date',
      time: 'Heure',
      type: 'Type',
      location: 'Lieu',
      whatsapp: 'Groupes WhatsApp',
      whatsappDesc: 'Rejoins les groupes de ta maison et les groupes transversaux.',
      propertyGroup: 'Groupe de ta maison',
      sharedGroups: 'Groupes transversaux',
      join: 'Rejoindre',
      directory: 'Annuaire des colocs',
      directoryDesc: 'Découvre les colocs de ta maison.',
      noVisible: 'Aucun coloc visible pour le moment. Active ton profil dans les paramètres.',
      since: 'Depuis',
    },
    en: {
      events: 'Upcoming Events',
      noEvents: 'No upcoming events at the moment.',
      date: 'Date',
      time: 'Time',
      type: 'Type',
      location: 'Location',
      whatsapp: 'WhatsApp Groups',
      whatsappDesc: 'Join your house group and shared community groups.',
      propertyGroup: 'Your house group',
      sharedGroups: 'Shared groups',
      join: 'Join',
      directory: 'Coliver Directory',
      directoryDesc: 'Discover the colivers in your house.',
      noVisible: 'No visible colivers yet. Enable your profile in settings.',
      since: 'Since',
    },
  };

  const lang = t[language] || t.fr;

  const formatDate = (d: string) => new Date(d).toLocaleDateString(language === 'en' ? 'en-GB' : 'fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div className="space-y-6">
      {/* Events */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
{lang.events}
        </h2>
        {eventsLoading ? (
          <div className="animate-pulse text-sm text-gray-400">...</div>
        ) : events.length === 0 ? (
          <p className="text-sm text-gray-500">{lang.noEvents}</p>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-xs font-semibold text-[#44403C] bg-[#F5F2ED] px-2 py-1 rounded">{eventTypeLabels[event.type] || eventTypeLabels.other}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">
                    {language === 'en' ? (event.title_en || event.title_fr) : event.title_fr}
                  </p>
                  {(language === 'en' ? event.description_en : event.description_fr) && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {language === 'en' ? (event.description_en || event.description_fr) : event.description_fr}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span>{formatDate(event.date)}</span>
                    {event.time && <span>{event.time.substring(0, 5)}</span>}
                    {event.location && <span>{event.location}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* WhatsApp Groups */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
{lang.whatsapp}
        </h2>
        <p className="text-sm text-gray-500 mb-4">{lang.whatsappDesc}</p>

        {/* Property group */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">{lang.propertyGroup}</h3>
          <div className="space-y-2">
            {(whatsappLinks[propertyKey] || []).map((g, i) => (
              <a
                key={i}
                href={g.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-[#F5F2ED] rounded-lg hover:bg-[#E7E5E4] transition-colors"
              >
                <span className="text-sm font-medium text-[#1C1917]">{g.label}</span>
                <span className="text-xs text-[#44403C] font-medium">{lang.join} →</span>
              </a>
            ))}
          </div>
        </div>

        {/* Shared groups */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">{lang.sharedGroups}</h3>
          <div className="space-y-2">
            {sharedGroups.map((g, i) => (
              <a
                key={i}
                href={g.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-[#F5F2ED] rounded-lg hover:bg-[#E7E5E4] transition-colors"
              >
                <span className="text-sm font-medium text-[#1C1917]">{language === 'en' ? g.label.en : g.label.fr}</span>
                <span className="text-xs text-[#44403C] font-medium">{lang.join} →</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Coliver Directory - placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
{lang.directory}
        </h2>
        <p className="text-sm text-gray-500">{lang.directoryDesc}</p>
        <p className="text-sm text-gray-400 mt-2 italic">{lang.noVisible}</p>
      </div>
    </div>
  );
}
