// Voile dégradé sombre réutilisable — garantit un contraste suffisant (texte blanc/clair)
// par-dessus N'IMPORTE QUELLE photo, y compris les zones très claires (piscine, ciel).
// Pattern unique pour tout « texte sur image » du site (lisibilité WCAG AA).
//
// Usage : dans un conteneur `relative`, poser <Scrim /> ENTRE l'<img> et le bloc de texte.
//   <div className="relative">
//     <img ... />
//     <Scrim />
//     <div className="relative z-10"> …texte blanc… </div>
//   </div>
//
// `className` permet de renforcer le voile sur une photo particulièrement claire
// (ex. <Scrim className="via-[#1C1917]/80" />). À n'utiliser qu'en cas de besoin vérifié.

interface ScrimProps {
  className?: string;
}

export function Scrim({ className = "" }: ScrimProps) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 bg-gradient-to-t from-[#1C1917] via-[#1C1917]/70 to-[#1C1917]/25 ${className}`}
    />
  );
}
