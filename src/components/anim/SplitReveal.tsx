import { useEffect, useRef, type ElementType, type ReactNode } from 'react';
import { gsap, ScrollTrigger, SplitText, EASE } from '../../lib/gsap';

type RevealProps = {
  children: ReactNode;
  /** Seconds to wait after the trigger before starting. */
  delay?: number;
  /** Seconds between each split word/line. */
  stagger?: number;
  as?: ElementType;
  className?: string;
  /** ScrollTrigger start position, e.g. "top 85%". */
  start?: string;
  once?: boolean;
};

/**
 * Splits text into lines, animates them up from behind an overflow mask.
 * Falls back to a simple opacity fade if SplitText is unavailable.
 */
export function SplitReveal({
  children,
  delay = 0,
  stagger = 0.09,
  as: Tag = 'h2',
  className,
  start = 'top 85%',
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const text = el.textContent ?? '';
      const canSplit = text.trim().length > 0 && !text.includes('<');

      if (canSplit) {
        const split = new SplitText(el, {
          type: 'lines',
          linesClass: 'reveal-line',
          mask: 'lines',
          autoSplit: true,
        });

        gsap.set(split.lines, { yPercent: 115 });
        gsap.to(split.lines, {
          yPercent: 0,
          duration: 1.15,
          ease: EASE.outExpo,
          stagger,
          delay,
          scrollTrigger: { trigger: el, start, once },
        });
      } else {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: EASE.outExpo,
            delay,
            scrollTrigger: { trigger: el, start, once },
          },
        );
      }
    }, ref);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [delay, stagger, start, once, children]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
