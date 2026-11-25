import { useId } from 'react';

type Variant = 'risotto' | 'beef' | 'okra' | 'quail' | 'tart' | 'chocolate' | 'wine' | 'amuse';

const PALETTES: Record<Variant, { base: string; accents: string[]; rim: string; glow: string }> = {
  risotto: { base: '#8f2418', accents: ['#e0a24a', '#f2d59a', '#5d120c'], rim: '#c9a227', glow: '#d4483a' },
  beef: { base: '#3a1410', accents: ['#8c3b1c', '#c98a4b', '#e8c07a'], rim: '#c9a227', glow: '#a35a2c' },
  okra: { base: '#1d3a24', accents: ['#3f7a3c', '#a8c46a', '#0e2015'], rim: '#c9a227', glow: '#2f8262' },
  quail: { base: '#7a1f14', accents: ['#d05a2a', '#e8a45c', '#f0c27a'], rim: '#c9a227', glow: '#b5522e' },
  tart: { base: '#d8b23f', accents: ['#f4e2a0', '#8a6c14', '#fff6d8'], rim: '#8a6c14', glow: '#e6c962' },
  chocolate: { base: '#2a1608', accents: ['#6b3a18', '#c98a4b', '#1a0d04'], rim: '#c9a227', glow: '#a35a2c' },
  wine: { base: '#4a0f22', accents: ['#8c1f3c', '#d4483a', '#2a0712'], rim: '#c9a227', glow: '#b3271d' },
  amuse: { base: '#8a5a12', accents: ['#e6c962', '#f6e7bd', '#5d3b06'], rim: '#c9a227', glow: '#c9a227' },
};

/**
 * A stylised plated-dish illustration rendered entirely in SVG.
 * Deterministic per variant so every card feels hand-composed while
 * staying completely dependency- and asset-free.
 */
export function DishArt({
  variant = 'risotto',
  className,
  label,
}: {
  variant?: Variant;
  className?: string;
  label?: string;
}) {
  const uid = useId().replace(/:/g, '');
  const p = PALETTES[variant];

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role="img"
      aria-label={label ?? 'Plated dish illustration'}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id={`plate-${uid}`} cx="38%" cy="32%" r="78%">
          <stop offset="0%" stopColor="#1a1712" />
          <stop offset="62%" stopColor="#100e0b" />
          <stop offset="100%" stopColor="#080706" />
        </radialGradient>

        <radialGradient id={`sauce-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.glow} stopOpacity="0.95" />
          <stop offset="70%" stopColor={p.base} stopOpacity="0.5" />
          <stop offset="100%" stopColor={p.base} stopOpacity="0" />
        </radialGradient>

        <linearGradient id={`rim-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={p.rim} stopOpacity="0.9" />
          <stop offset="45%" stopColor="#f3e2a8" stopOpacity="0.5" />
          <stop offset="100%" stopColor={p.rim} stopOpacity="0.15" />
        </linearGradient>

        <filter id={`soft-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      {/* Backdrop */}
      <rect width="400" height="400" fill={`url(#plate-${uid})`} />

      {/* Ambient warm glow */}
      <circle cx="200" cy="190" r="150" fill={p.glow} opacity="0.1" filter={`url(#soft-${uid})`} />

      {/* Sauce swoosh */}
      <path
        d="M96 232c26-58 84-92 142-84s88 44 76 92c-10 42-62 66-118 58s-118-30-100-66z"
        fill={`url(#sauce-${uid})`}
        opacity="0.85"
      />

      {/* Plated elements */}
      <g>
        <circle cx="176" cy="212" r="34" fill={p.accents[0]} opacity="0.92" />
        <circle cx="222" cy="188" r="22" fill={p.accents[1]} opacity="0.9" />
        <circle cx="234" cy="236" r="15" fill={p.accents[2]} opacity="0.95" />
        <circle cx="150" cy="256" r="11" fill={p.accents[1]} opacity="0.75" />
        <circle cx="262" cy="206" r="8" fill={p.accents[0]} opacity="0.8" />
      </g>

      {/* Herb / garnish specks */}
      <g fill={p.accents[1]}>
        <circle cx="128" cy="186" r="3.4" opacity="0.85" />
        <circle cx="288" cy="252" r="2.6" opacity="0.7" />
        <circle cx="204" cy="284" r="3" opacity="0.6" />
        <circle cx="292" cy="164" r="2.2" opacity="0.55" />
        <circle cx="112" cy="272" r="2.4" opacity="0.5" />
      </g>

      {/* Gold rim */}
      <circle
        cx="200"
        cy="200"
        r="168"
        fill="none"
        stroke={`url(#rim-${uid})`}
        strokeWidth="1.4"
        opacity="0.75"
      />
      <circle
        cx="200"
        cy="200"
        r="158"
        fill="none"
        stroke={p.rim}
        strokeWidth="0.5"
        opacity="0.3"
      />

      {/* Specular highlight */}
      <ellipse cx="146" cy="118" rx="72" ry="34" fill="#fff" opacity="0.045" transform="rotate(-24 146 118)" />
    </svg>
  );
}
