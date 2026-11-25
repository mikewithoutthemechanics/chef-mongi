import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { DishArt } from '../art/DishArt';
import { DISHES } from '../../data/dishes';

const FEATURED = ['jollof-risotto', 'suya-tataki', 'okra-tenderloin', 'dawadawa-tart'].map(
  (id) => DISHES.find((d) => d.id === id)!,
);

const VARIANT_BY_ID: Record<string, 'risotto' | 'beef' | 'okra' | 'tart'> = {
  'jollof-risotto': 'risotto',
  'suya-tataki': 'beef',
  'okra-tenderloin': 'okra',
  'dawadawa-tart': 'tart',
};

/**
 * Pinned scroll narrative: the plate stays centred while the courses
 * advance, cross-fading and sliding in turn. A brass progress rail
 * tracks the active index.
 */
export function SignatureDishes() {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('.sig__panel');
      const rail = root.querySelector<HTMLElement>('.sig__rail-fill');
      const total = panels.length;

      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: () => `+=${window.innerHeight * (total - 0.35)}`,
        pin: '.sig__stage',
        pinSpacing: true,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress * (total - 1);
          if (rail) rail.style.transform = `scaleY(${Math.max(0.02, self.progress)})`;

          panels.forEach((panel, i) => {
            const d = i - p;
            // Cards near the active slot sit centre-stage; others recede
            gsap.set(panel, {
              yPercent: d * -34,
              opacity: 1 - Math.min(1, Math.abs(d) * 0.85),
              scale: 1 - Math.min(1, Math.abs(d)) * 0.12,
              filter: `blur(${Math.min(6, Math.abs(d) * 4)}px)`,
              zIndex: 10 - Math.round(Math.abs(d)),
            });
          });
        },
        onToggle: (self) => {
          if (self.isActive) setActive(Math.round(self.progress * (total - 1)));
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="sig" id="signature">
      <div className="sig__stage">
        <div className="shell sig__layout">
          <div className="sig__left">
            <p className="eyebrow sig__eyebrow">Signature dishes</p>

            <div className="sig__stack">
              {FEATURED.map((dish, i) => (
                <article
                  key={dish.id}
                  className={`sig__panel ${i === active ? 'is-active' : ''}`}
                  aria-hidden={i !== active}
                >
                  <span className="sig__index">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="sig__name">{dish.name}</h3>
                  <p className="sig__origin">{dish.origin}</p>
                  <p className="sig__desc">{dish.description}</p>

                  <div className="sig__meta">
                    <span className="tag">{dish.tags[0]}</span>
                    {dish.pairing && <span className="sig__pairing">Pairs · {dish.pairing}</span>}
                    <span className="sig__price">£{dish.price}</span>
                  </div>
                </article>
              ))}
            </div>

            <div className="sig__rail" aria-hidden="true">
              <span className="sig__rail-fill" />
            </div>
          </div>

          <div className="sig__right">
            <div className="sig__plate">
              {FEATURED.map((dish, i) => (
                <div
                  key={dish.id}
                  className={`sig__plate-layer ${i === active ? 'is-active' : ''}`}
                  aria-hidden={i !== active}
                >
                  <DishArt variant={VARIANT_BY_ID[dish.id]} label={dish.name} />
                </div>
              ))}
              <div className="sig__plate-ring" aria-hidden="true" />
            </div>

            <p className="sig__hint">
              <span className="sig__hint-dot" />
              Keep scrolling
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
