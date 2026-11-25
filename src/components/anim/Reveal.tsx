import { useEffect, useRef, type ReactNode } from 'react';
import { gsap, EASE } from '../../lib/gsap';

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  start?: string;
  once?: boolean;
  className?: string;
  as?: 'div' | 'span' | 'p' | 'li' | 'section';
};

/** Generic scroll-triggered entrance: fades up into place. */
export function Reveal({
  children,
  delay = 0,
  y = 34,
  duration = 1,
  start = 'top 88%',
  once = true,
  className,
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: EASE.outExpo,
          scrollTrigger: { trigger: el, start, once },
        },
      );
    }, ref);

    return () => ctx.revert();
  }, [delay, y, duration, start, once]);

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}

/** Staggers direct children as they enter the viewport. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  y = 30,
  start = 'top 85%',
  once = true,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
  start?: string;
  once?: boolean;
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
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.95,
          stagger,
          ease: EASE.outExpo,
          scrollTrigger: { trigger: el, start, once },
        },
      );
    }, ref);

    return () => ctx.revert();
  }, [stagger, y, start, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Vertical parallax drift driven by scroll position. */
export function Parallax({
  children,
  speed = 0.18,
  className,
}: {
  children: ReactNode;
  /** Positive = moves down slower than scroll, negative = moves up. */
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -speed * 50 },
        {
          yPercent: speed * 50,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        },
      );
    }, ref);

    return () => ctx.revert();
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
