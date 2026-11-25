import { useEffect, useState, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { ScrollContext } from '../lib/scroll-context';

/**
 * Smooth scrolling powered by Lenis, driven from the GSAP ticker so that
 * ScrollTrigger stays perfectly in sync. Disabled when the visitor has
 * asked for reduced motion.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
      return;
    }

    const instance = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.6,
      wheelMultiplier: 0.95,
    });

    const onRaf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);
    instance.on('scroll', ScrollTrigger.update);

    document.documentElement.classList.add('lenis', 'lenis-smooth');
    setLenis(instance);

    return () => {
      gsap.ticker.remove(onRaf);
      instance.destroy();
      setLenis(null);
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
    };
  }, []);

  return <ScrollContext.Provider value={lenis}>{children}</ScrollContext.Provider>;
}
