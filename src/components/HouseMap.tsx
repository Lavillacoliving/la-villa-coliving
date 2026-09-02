import { useState } from "react";
import { MapPin, Navigation } from "lucide-react";

/**
 * Plan Google Maps de la maison — section Localisation des pages maisons (demande Jérôme,
 * 02/09/2026, Lot A).
 *
 * Chargé UNIQUEMENT au clic (« Afficher la carte ») :
 *  - CNIL : un iframe Google Maps dépose des cookies Google dès son chargement ; le charger
 *    sur action explicite du visiteur, avec la mention, dispense d'un bandeau de consentement ;
 *  - performance : zéro requête tierce et zéro poids au chargement de la page (LCP, CLS) ;
 *  - hydratation : l'état initial (carte non chargée) est identique au prérendu et au premier
 *    rendu client — aucun mismatch #418.
 * Sans clé API : URL d'intégration « output=embed » de Google Maps, coordonnées rooftop de
 * `HOUSES` (src/lib/structuredData.ts, BAN 15/08/2026) — même source que le JSON-LD.
 * Le lien « Itinéraire » ouvre Google Maps sans rien charger dans la page.
 */

interface HouseMapProps {
  name: string;
  address: string;
  lat: number;
  lng: number;
  en: boolean;
}

export function HouseMap({ name, address, lat, lng, en }: HouseMapProps) {
  const [loaded, setLoaded] = useState(false);
  const embedSrc = `https://www.google.com/maps?q=${lat},${lng}&hl=${en ? "en" : "fr"}&z=16&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  const showMap = () => {
    setLoaded(true);
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "map_open", {
        house: name,
        page_path: window.location.pathname,
        language: en ? "en" : "fr",
      });
    } catch {
      /* noop — l'analytics ne bloque jamais l'UI */
    }
  };

  return (
    <div className="mt-10 card-ultra bg-white rounded-2xl border border-[#E7E5E4] overflow-hidden">
      {loaded ? (
        <iframe
          title={en ? `Map — ${name}` : `Carte — ${name}`}
          src={embedSrc}
          className="w-full h-72 md:h-96 border-0 block"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="h-72 md:h-96 bg-[#FAF9F6] flex flex-col items-center justify-center text-center px-6">
          <MapPin className="text-[#D4A574] mb-3" size={32} />
          <p className="font-black text-[#1C1917] mb-1">{name}</p>
          <p className="text-sm text-[#57534E] mb-5">{address}</p>
          <button
            type="button"
            onClick={showMap}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1C1917] text-white font-semibold rounded-full hover:bg-[#D4A574] hover:text-[#1C1917] transition-colors"
          >
            <MapPin size={18} />
            {en ? "Show the map" : "Afficher la carte"}
          </button>
          <p className="mt-4 text-xs text-[#78716C] max-w-sm">
            {en
              ? "The map is loaded from Google Maps only when you ask for it (Google cookies)."
              : "La carte est chargée depuis Google Maps uniquement quand tu le demandes (cookies Google)."}
          </p>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-[#E7E5E4] text-sm">
        <span className="text-[#57534E]">{address}</span>
        <a
          href={directions}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-semibold text-[#1C1917] hover:text-[#D4A574] transition-colors"
        >
          <Navigation size={16} />
          {en ? "Directions in Google Maps" : "Itinéraire dans Google Maps"}
        </a>
      </div>
    </div>
  );
}
