import { createContext, useContext } from 'react';
import type Lenis from 'lenis';

export const ScrollContext = createContext<Lenis | null>(null);

/** Access the Lenis instance for scrollTo / stop / start calls. */
export function useLenis(): Lenis | null {
  return useContext(ScrollContext);
}

/** Scroll to a target (element, selector or px offset) with easing. */
export function scrollTo(
  lenis: Lenis | null,
  target: string | number | HTMLElement,
  opts: { offset?: number; duration?: number; immediate?: boolean } = {},
) {
  if (lenis) {
    lenis.scrollTo(target as never, {
      offset: opts.offset ?? -100,
      duration: opts.duration ?? 1.4,
      immediate: opts.immediate,
    });
    return;
  }
  // Fallback for reduced-motion / non-Lenis contexts
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' });
    return;
  }

  const el: HTMLElement | null =
    typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;

  if (el) {
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY + (opts.offset ?? -100),
    });
  }
}
