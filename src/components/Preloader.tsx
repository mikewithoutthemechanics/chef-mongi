import { useEffect, useRef, useState } from 'react';
import { gsap, EASE } from '../lib/gsap';

/**
 * Branded preloader: a counting line, a filling gold bar and two curtain
 * panels that peel away to reveal the page. Runs once per session.
 */
export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(() => sessionStorage.getItem('mf-intro') === '1');

  useEffect(() => {
    if (done) {
      document.body.classList.remove('is-loading');
      return;
    }

    document.body.classList.add('is-loading');
    const root = rootRef.current;
    const count = countRef.current;
    const bar = barRef.current;
    if (!root || !count || !bar) return;

    // Failsafe: never let a stalled or throwing timeline leave the page
    // locked behind an invisible overlay with body overflow hidden.
    const failsafe = window.setTimeout(() => {
      sessionStorage.setItem('mf-intro', '1');
      document.body.classList.remove('is-loading');
      setDone(true);
    }, 6000);

    const ctx = gsap.context(() => {
      const state = { n: 0 };

      const tl = gsap.timeline({
        onComplete: () => {
          window.clearTimeout(failsafe);
          sessionStorage.setItem('mf-intro', '1');
          document.body.classList.remove('is-loading');
          setDone(true);
        },
      });

      tl.fromTo(
        state,
        { n: 0 },
        {
          n: 100,
          duration: 1.7,
          ease: EASE.inOutQuart,
          onUpdate: () => {
            count.textContent = String(Math.round(state.n)).padStart(3, '0');
          },
        },
      )
        .to(bar, { scaleX: 1, duration: 1.7, ease: EASE.inOutQuart }, 0)
        .to('.preloader__word span', { yPercent: -110, duration: 0.9, stagger: 0.06, ease: EASE.outExpo }, '>-0.15')
        .to(root, { yPercent: -100, duration: 1.1, ease: EASE.inOutQuart }, '>-0.35');

      // Curtain panels
      tl.fromTo(
        '.preloader__panel--l',
        { xPercent: 0 },
        { xPercent: -100, duration: 1.1, ease: EASE.inOutQuart },
        '>-1.05',
      )
        .fromTo(
          '.preloader__panel--r',
          { xPercent: 0 },
          { xPercent: 100, duration: 1.1, ease: EASE.inOutQuart },
          '<',
        )
        .set(root, { display: 'none' });
    }, rootRef);

    return () => {
      window.clearTimeout(failsafe);
      ctx.revert();
    };
  }, [done]);

  if (done) return null;

  return (
    <div ref={rootRef} className="preloader" role="status" aria-label="Loading">
      <div className="preloader__panel preloader__panel--l" />
      <div className="preloader__panel preloader__panel--r" />

      <div className="preloader__inner">
        <div className="preloader__word" aria-hidden="true">
          {'MONGIFANA'.split('').map((c, i) => (
            <span key={i}>{c === ' ' ? '\u00A0' : c}</span>
          ))}
        </div>

        <div className="preloader__meta">
          <span className="preloader__label">Private Chef · Est. 2009</span>
          <span ref={countRef} className="preloader__count">
            000
          </span>
        </div>

        <div className="preloader__bar">
          <div ref={barRef} className="preloader__bar-fill" />
        </div>
      </div>
    </div>
  );
}
