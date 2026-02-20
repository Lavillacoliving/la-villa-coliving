import { useState } from "react";

/**
 * Floating WhatsApp button — bottom-right, pulse animation, tooltip
 * Stone & Brass design — WhatsApp green icon on clean white circle
 */
export function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip */}
      {showTooltip && (
        <span className="bg-[#1C1917] text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg whitespace-nowrap animate-fade-in">
          Nous écrire
        </span>
      )}

      {/* Button */}
      <a
        href="https://wa.me/33664315134"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter La Villa Coliving sur WhatsApp"
        className="relative w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_28px_rgba(37,211,102,0.5)] hover:scale-105 transition-all duration-300"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />

        {/* WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="w-7 h-7 relative z-10"
          fill="white"
        >
          <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.905 15.905 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.336 22.594c-.39 1.1-1.932 2.014-3.182 2.28-.854.18-1.968.324-5.722-1.23-4.806-1.988-7.898-6.868-8.138-7.188-.228-.32-1.918-2.554-1.918-4.872s1.214-3.456 1.644-3.928c.43-.472.94-.59 1.252-.59.312 0 .624.002.898.016.288.014.674-.11.998.762.39 1.05 1.098 3.456 1.176 3.696.078.24.312.766-.078 1.236-.156.236-.39.54-.546.696-.312.312-.234.546.078.94.312.39 1.384 2.282 2.97 3.696 2.042 1.818 3.764 2.38 4.298 2.638.43.208.684.174.936-.104.252-.28 1.084-1.264 1.374-1.698.288-.43.578-.358.976-.214.398.144 2.526 1.192 2.958 1.41.43.214.718.324.824.5.104.18.104 1.028-.286 2.128z" />
        </svg>
      </a>
    </div>
  );
}
