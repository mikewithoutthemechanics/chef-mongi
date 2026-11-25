import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { DishArt } from '../art/DishArt';
import { GALLERY } from '../../data/gallery';
import { SplitReveal } from '../anim/SplitReveal';

const VARIANTS = ['risotto', 'beef', 'okra', 'wine', 'tart', 'chocolate'] as const;

/**
 * Pinned horizontal gallery: the page scrolls vertically while the strip
 * of plates travels sideways. Falls back to a swipeable row on touch.
 */
export function GalleryRail() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    const ctx = gsap.context(() => {
      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 80);

      gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${getDistance() + window.innerHeight * 0.6}`,
          pin: '.gr__stage',
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Written directly to the DOM to avoid re-rendering on scroll
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="gr">
      <div className="gr__stage">
        <div className="shell gr__head">
          <div>
            <p className="eyebrow">From the pass</p>
            <SplitReveal className="gr__title" as="h2">
              Plates that travel
            </SplitReveal>
          </div>
          <p className="gr__lede lead">
            Every service is different. These are the dishes guests ask about
            most — the ones that usually make the table go quiet for a moment.
          </p>
        </div>

        <div ref={trackRef} className="gr__track">
          {GALLERY.map((g, i) => (
            <figure className={`gr__card gr__card--${g.span}`} key={g.id} data-cursor="Dish">
              <div className="gr__art">
                <DishArt variant={VARIANTS[i % VARIANTS.length]} label={g.caption} />
              </div>
              <figcaption className="gr__caption">
                <span className="gr__tag">{g.tag}</span>
                <span className="gr__text">{g.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="shell gr__foot">
          <div className="gr__progress" aria-hidden="true">
            <span ref={progressRef} className="gr__progress-fill" />
          </div>
          <span className="gr__count">
            {String(GALLERY.length).padStart(2, '0')} plates
          </span>
        </div>
      </div>
    </section>
  );
}
