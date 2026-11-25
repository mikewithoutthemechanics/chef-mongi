import { useId } from 'react';

/**
 * Kente-inspired woven band used as a section divider and accent.
 * Pure SVG so it stays crisp at any size.
 */
export function KenteBand({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, '');
  const stripes = [
    { w: 26, fill: '#b3271d' },
    { w: 10, fill: '#c9a227' },
    { w: 18, fill: '#0b0a08' },
    { w: 8, fill: '#e6c962' },
    { w: 30, fill: '#1f5c46' },
    { w: 12, fill: '#c9a227' },
    { w: 22, fill: '#0b0a08' },
    { w: 8, fill: '#d4483a' },
  ];

  let x = 0;
  const total = stripes.reduce((s, i) => s + i.w, 0);

  return (
    <svg
      className={className}
      viewBox={`0 0 ${total} 24`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id={`kente-${uid}`} width="4" height="4" patternUnits="userSpaceOnUse">
          <path d="M0 0h2v4H0z" fill="#fff" opacity="0.06" />
        </pattern>
      </defs>
      <rect width={total} height="24" fill="#0b0a08" />
      {stripes.map((s, i) => {
        const el = (
          <rect key={i} x={x} y="0" width={s.w} height="24" fill={s.fill} />
        );
        x += s.w;
        return el;
      })}
      <rect width={total} height="24" fill={`url(#kente-${uid})`} />
      <path d={`M0 12h${total}`} stroke="#c9a227" strokeWidth="0.5" opacity="0.5" />
    </svg>
  );
}

/**
 * Large decorative Adinkra-inspired symbol cluster — a nod to
 * Gye Nyame / Dwennimmen. Fades with its container.
 */
export function AdinkraMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
    >
      {/* Concentric rings */}
      <circle cx="100" cy="100" r="92" strokeWidth="0.7" opacity="0.5" />
      <circle cx="100" cy="100" r="74" strokeWidth="0.5" opacity="0.35" />
      <circle cx="100" cy="100" r="56" strokeWidth="0.5" opacity="0.25" />

      {/* Radial ticks */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        const r1 = 78;
        const r2 = 92;
        return (
          <line
            key={i}
            x1={100 + Math.cos(a) * r1}
            y1={100 + Math.sin(a) * r1}
            x2={100 + Math.cos(a) * r2}
            y2={100 + Math.sin(a) * r2}
            strokeWidth="0.6"
            opacity="0.4"
          />
        );
      })}

      {/* Central Gye Nyame-like glyph */}
      <path
        d="M100 42c34 0 58 22 58 52 0 26-20 46-46 46-20 0-34-14-34-32 0-16 12-28 28-28 14 0 24 9 24 21 0 10-8 18-18 18"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Repeating chevron rule — a light tribal-border motif. */
export function ChevronRule({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 12"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {Array.from({ length: 24 }).map((_, i) => (
        <path
          key={i}
          d={`M${i * 5} 10 L${i * 5 + 2.5} 2 L${i * 5 + 5} 10`}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
        />
      ))}
    </svg>
  );
}
