import { useEffect, useRef } from 'react';
import { gsap, EASE } from '../../lib/gsap';
import { SplitReveal } from '../anim/SplitReveal';
import { ChevronRule } from '../art/Patterns';

const STEPS = [
  {
    n: '01',
    title: 'The conversation',
    body: 'A call, usually thirty minutes. We talk about the people, the room, the occasion — and the one dish you will still be thinking about next week.',
    meta: '30 min · no charge',
  },
  {
    n: '02',
    title: 'The tasting',
    body: 'We cook three courses together. You taste, push back, change your mind. This is where the menu stops being mine and starts being yours.',
    meta: '3 courses · 2 hrs',
  },
  {
    n: '03',
    title: 'The build',
    body: 'I design the full arc of the evening, source the market, and write a service brief for my brigade. You receive it a week ahead to read over a glass of something good.',
    meta: '1 week before',
  },
  {
    n: '04',
    title: 'The evening',
    body: 'I arrive early, I cook quietly, and the last thing you should notice is that nobody left the table. That is the whole job.',
    meta: 'The main event',
  },
];

/**
 * Vertical process timeline. A brass line draws down the spine as you
 * scroll, and each step's marker lights up as it is reached.
 */
export function Process() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.process__line-fill',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top',
          scrollTrigger: { trigger: '.process__list', start: 'top 70%', end: 'bottom 70%', scrub: 0.6 },
        },
      );

      gsap.utils.toArray<HTMLElement>('.process__step').forEach((step) => {
        gsap.fromTo(
          step,
          { opacity: 0, y: 46 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: EASE.outExpo,
            scrollTrigger: { trigger: step, start: 'top 82%', once: true },
          },
        );

        gsap.fromTo(
          step.querySelector('.process__dot'),
          { scale: 0.2, opacity: 0.3 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.7,
            ease: EASE.back,
            scrollTrigger: { trigger: step, start: 'top 72%', once: true },
          },
        );
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="section process">
      <div className="shell">
        <div className="process__head">
          <p className="eyebrow">How an evening unfolds</p>
          <SplitReveal className="process__title" as="h2">
            From first call to last plate
          </SplitReveal>
        </div>

        <ChevronRule className="process__rule" />

        <div className="process__list">
          <span className="process__line" aria-hidden="true">
            <span className="process__line-fill" />
          </span>

          {STEPS.map((s) => (
            <article className="process__step" key={s.n}>
              <span className="process__marker">
                <span className="process__dot" />
              </span>

              <div className="process__content">
                <span className="process__n">{s.n}</span>
                <h3 className="process__step-title">{s.title}</h3>
                <p className="process__body">{s.body}</p>
                <span className="process__meta">{s.meta}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
