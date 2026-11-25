import { useEffect, useRef, type ReactNode } from 'react';
import { gsap, EASE } from '../../lib/gsap';

/**
 * Counts up to `value` when scrolled into view, with an eased ramp and
 * locale formatting. Used for the stats band.
 */
export function Counter({
  value,
  suffix = '',
  duration = 2.2,
  className,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const state = { n: 0 };
      gsap.to(state, {
        n: value,
        duration,
        ease: EASE.inOutQuart,
        snap: { n: 1 },
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        onUpdate: () => {
          el.textContent = `${Math.round(state.n).toLocaleString()}${suffix}`;
        },
        onComplete: () => {
          el.textContent = `${value.toLocaleString()}${suffix}`;
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [value, suffix, duration]);

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}

/** Character-by-character stagger for a single line of text. */
export function StaggerChars({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((c, i) => (
        <span key={`${c}-${i}`} className="char" aria-hidden="true" style={{ transitionDelay: `${delay + i * 24}ms` }}>
          {c === ' ' ? '\u00A0' : c}
        </span>
      ))}
    </span>
  );
}

/** Wraps children in a scroll-triggered stagger container. */
export function StaggerList({
  children,
  className,
  stagger = 0.06,
  start = 'top 88%',
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  start?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const items = Array.from(el.children) as HTMLElement[];
      if (!items.length) return;
      gsap.fromTo(
        items,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: EASE.outExpo,
          stagger,
          scrollTrigger: { trigger: el, start, once: true },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, [stagger, start]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Fade + rise for an image/media frame with a slight scale settle. */
export function MediaReveal({
  children,
  className,
  start = 'top 85%',
}: {
  children: ReactNode;
  className?: string;
  start?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { clipPath: 'inset(12% 8% 12% 8%)', opacity: 0, scale: 1.08 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: EASE.outExpo,
          scrollTrigger: { trigger: el, start, once: true },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, [start]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
