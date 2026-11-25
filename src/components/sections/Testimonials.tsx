import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap, EASE } from '../../lib/gsap';
import { TESTIMONIALS } from '../../data/content';
import { SplitReveal } from '../anim/SplitReveal';

/** Auto-advancing testimonial rotator with drag and dot navigation. */
export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slideRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef(0);

  const go = useCallback((next: number) => {
    setIndex((next + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  /* Cross-fade the active slide */
  useEffect(() => {
    const el = slideRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.testi__quote',
        { opacity: 0, y: 26, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.85, ease: EASE.outExpo },
      );
      gsap.fromTo(
        '.testi__who > *',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: EASE.outExpo, delay: 0.1 },
      );
    }, el);
    return () => ctx.revert();
  }, [index]);

  /* Autoplay */
  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => go(index + 1), 7000);
    return () => window.clearInterval(id);
  }, [index, paused, go]);

  const t = TESTIMONIALS[index];

  return (
    <section className="section testi">
      <div className="shell testi__inner">
        <div className="testi__mark" aria-hidden="true">
          &ldquo;
        </div>

        <div
          ref={slideRef}
          className="testi__slide"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onPointerDown={(e) => (dragStart.current = e.clientX)}
          onPointerUp={(e) => {
            const dx = e.clientX - dragStart.current;
            if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
          }}
        >
          <blockquote className="testi__quote">{t.quote}</blockquote>

          <div className="testi__who">
            <span className="testi__name">{t.name}</span>
            <span className="testi__detail">{t.detail}</span>
          </div>
        </div>

        <div className="testi__controls">
          <div className="testi__dots" role="tablist" aria-label="Testimonials">
            {TESTIMONIALS.map((item, i) => (
              <button
                key={item.name}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Testimonial ${i + 1}`}
                className={`testi__dot ${i === index ? 'is-active' : ''}`}
                onClick={() => go(i)}
              >
                <span className="testi__dot-fill" />
              </button>
            ))}
          </div>

          <div className="testi__arrows">
            <button type="button" onClick={() => go(index - 1)} aria-label="Previous testimonial">
              ←
            </button>
            <button type="button" onClick={() => go(index + 1)} aria-label="Next testimonial">
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Compact heading used above the quote block. */
export function TestimonialsHeading() {
  return (
    <div className="testi__head">
      <p className="eyebrow">The table speaks</p>
      <SplitReveal className="testi__title" as="h2">
        What guests remember
      </SplitReveal>
    </div>
  );
}
