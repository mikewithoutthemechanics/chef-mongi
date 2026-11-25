import { useEffect, useRef } from 'react';
import { gsap, SplitText } from '../../lib/gsap';
import { Reveal } from '../anim/Reveal';
import { AdinkraMark } from '../art/Patterns';

const STATEMENT =
  'I was not taught to cook European food and then add African spices. I was taught that fire is a language, and that a dish must carry the name of the person who taught it to you.';

/**
 * Scroll-scrubbed statement: each word lifts from muted to brass as it
 * crosses the reading position, so the paragraph "writes itself" as you scroll.
 */
export function Philosophy() {
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const split = new SplitText(el, { type: 'words', wordsClass: 'philo__word' });

      gsap.fromTo(
        split.words,
        { color: 'rgba(231,224,209,0.16)' },
        {
          color: 'rgba(244,240,230,1)',
          ease: 'none',
          stagger: 0.35,
          scrollTrigger: {
            trigger: el,
            start: 'top 78%',
            end: 'bottom 55%',
            scrub: 0.8,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section id="philosophy" className="section philo">
      <div className="shell philo__inner">
        <div className="philo__head">
          <p className="eyebrow" data-anim="fade-up">
            The philosophy
          </p>
          <AdinkraMark className="philo__mark" aria-hidden="true" />
        </div>

        <p ref={textRef} className="philo__text">
          {STATEMENT}
        </p>

        <div className="philo__foot">
          <Reveal className="philo__sign">
            <span className="philo__sign-name">Mongi Fana</span>
            <span className="philo__sign-role">Chef & Founder</span>
          </Reveal>

          <Reveal className="philo__meta" delay={0.15}>
            <p>
              Trained in Provence, starred in London, rooted in Tamale. The
              technique is European; the instinct is not negotiable.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="philo__glow" aria-hidden="true" />
    </section>
  );
}
