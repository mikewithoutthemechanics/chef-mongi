/**
 * Abstract chef portrait — a warm-lit silhouette against a woven backdrop.
 * Deliberately stylised so the brand reads as a designed identity rather
 * than a missing photograph.
 */
export function ChefPortrait({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 500 620"
      role="img"
      aria-label="Portrait of chef Mongi Fana"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="portrait-bg" x1="0%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%" stopColor="#241a12" />
          <stop offset="45%" stopColor="#14100c" />
          <stop offset="100%" stopColor="#0a0908" />
        </linearGradient>

        <linearGradient id="portrait-figure" x1="20%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#e6c962" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#c9a227" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#8a6c14" stopOpacity="0.35" />
        </linearGradient>

        <linearGradient id="portrait-rim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c9a227" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#f3e2a8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#c9a227" stopOpacity="0.05" />
        </linearGradient>

        <radialGradient id="portrait-halo" cx="50%" cy="38%" r="55%">
          <stop offset="0%" stopColor="#c9a227" stopOpacity="0.3" />
          <stop offset="60%" stopColor="#b5522e" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#0a0908" stopOpacity="0" />
        </radialGradient>

        <filter id="portrait-blur">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>

      <rect width="500" height="620" fill="url(#portrait-bg)" />
      <ellipse cx="250" cy="240" rx="230" ry="240" fill="url(#portrait-halo)" />

      {/* Woven backdrop bands */}
      <g opacity="0.16">
        {Array.from({ length: 9 }).map((_, i) => (
          <rect
            key={i}
            x={-40 + i * 66}
            y="-30"
            width="24"
            height="700"
            fill={i % 3 === 0 ? '#b3271d' : i % 3 === 1 ? '#1f5c46' : '#c9a227'}
            transform="skewX(-9)"
          />
        ))}
      </g>

      {/* Warm light bloom behind the head */}
      <circle cx="250" cy="205" r="120" fill="#e6c962" opacity="0.14" filter="url(#portrait-blur)" />

      {/* Halo ring */}
      <circle cx="250" cy="205" r="132" fill="none" stroke="url(#portrait-rim)" strokeWidth="1.2" />
      <circle cx="250" cy="205" r="146" fill="none" stroke="#c9a227" strokeWidth="0.5" opacity="0.35" />

      {/* Figure: head, neck, shoulders */}
      <g fill="url(#portrait-figure)">
        <ellipse cx="250" cy="188" rx="62" ry="72" />
        {/* Chef's toque */}
        <path d="M188 132c-14-4-22-16-18-30 3-11 14-18 26-16 6-14 22-22 38-19 12 2 22 11 25 22 13-2 25 7 27 20 2 12-6 22-19 25z" />
        {/* Neck */}
        <path d="M226 250h48v40h-48z" />
        {/* Shoulders / jacket */}
        <path d="M250 288c72 0 124 44 132 108l8 96H110l8-96c8-64 60-108 132-108z" />
        {/* Collar V */}
        <path d="M206 300l44 62 44-62-16-10-28 42-28-42z" fill="#0a0908" opacity="0.85" />
      </g>

      {/* Jacket lapel highlights */}
      <g stroke="#f3e2a8" strokeWidth="1" opacity="0.4" fill="none">
        <path d="M206 300l44 62" />
        <path d="M294 300l-44 62" />
        <path d="M168 470l-6 62" />
        <path d="M332 470l6 62" />
      </g>

      {/* Buttons */}
      <g fill="#e6c962" opacity="0.75">
        <circle cx="250" cy="400" r="4" />
        <circle cx="250" cy="438" r="4" />
        <circle cx="250" cy="476" r="4" />
      </g>

      {/* Foreground vignette */}
      <rect
        width="500"
        height="620"
        fill="none"
        stroke="url(#portrait-rim)"
        strokeWidth="2"
      />
    </svg>
  );
}
