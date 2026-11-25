import { useEffect, useRef } from 'react';
import { gsap, EASE } from '../../lib/gsap';
import { Counter } from '../anim/Counter';
import { STATS } from '../../data/gallery';
import { KenteBand } from '../art/Patterns';

/** Numbers band: counters ramp up while a hairline rule draws across. */
export function Stats() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.stats__rule',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.6,
          ease: EASE.outExpo,
          scrollTrigger: { trigger: el, start: 'top 80%', once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="stats">
      <KenteBand className="stats__band" />
      <div className="shell">
        <div className="stats__rule" aria-hidden="true" />
        <ul className="stats__grid">
          {STATS.map((s) => (
            <li className="stats__item" key={s.label}>
              <span className="stats__value">
                <Counter value={s.value} suffix={s.suffix} />
              </span>
              <span className="stats__label">{s.label}</span>
            </li>
          ))}
        </ul>
        <div className="stats__rule" aria-hidden="true" />
      </div>
    </div>
  );
}
