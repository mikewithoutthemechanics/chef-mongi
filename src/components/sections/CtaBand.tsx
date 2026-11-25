import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, EASE } from '../../lib/gsap';
import { Magnetic } from '../anim/Magnetic';
import { SplitReveal } from '../anim/SplitReveal';
import { KenteBand, AdinkraMark } from '../art/Patterns';
import { Marquee } from './Marquee';

/** Full-bleed closing call to action. */
export function CtaBand() {
  return (
    <section className="section cta">
      <div className="cta__bg" aria-hidden="true">
        <AdinkraMark className="cta__mark" />
        <div className="cta__glow" />
      </div>

      <KenteBand className="cta__band" />

      <div className="shell cta__inner">
        <p className="eyebrow">Two dates left this month</p>

        <SplitReveal className="cta__title" as="h2">
          Your table is waiting
        </SplitReveal>

        <p className="lead cta__lede">
          Tell me who is coming, where you are, and what the evening is for. I
          will take it from there.
        </p>

        <div className="cta__actions">
          <Magnetic strength={0.3}>
            <Link to="/booking" className="btn btn--solid" data-cursor="Book">
              <span>Reserve a date</span>
              <span className="btn__arrow">→</span>
            </Link>
          </Magnetic>

          <Magnetic strength={0.26}>
            <a href="mailto:book@mongifana.com" className="btn btn--ghost">
              <span>Email me</span>
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}

/** Reusable inner-page header with a staggered entrance. */
export function PageHero({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });

      tl.fromTo(
        '.pagehero__eyebrow',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.8, ease: EASE.outExpo },
      )
        .fromTo(
          '.pagehero__title',
          { opacity: 0, y: 44 },
          { opacity: 1, y: 0, duration: 1.1, ease: EASE.outExpo },
          '-=0.4',
        )
        .fromTo(
          '.pagehero__lede',
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.9, ease: EASE.outExpo },
          '-=0.6',
        )
        .fromTo(
          '.pagehero__extra',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: EASE.outExpo },
          '-=0.5',
        );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="pagehero">
      <div className="pagehero__bg" aria-hidden="true">
        <div className="pagehero__glow" />
        <div className="pagehero__grid" />
      </div>

      <div className="shell pagehero__inner">
        <p className="eyebrow pagehero__eyebrow">{eyebrow}</p>
        <h1 className="pagehero__title">{title}</h1>
        {lede && <p className="lead pagehero__lede">{lede}</p>}
        {children && <div className="pagehero__extra">{children}</div>}
      </div>

      <Marquee
        className="pagehero__marquee"
        items={['Tamale', 'Lagos', 'Marseille', 'London', 'Everywhere']}
        speed={40}
        reverse
        separator="—"
      />
    </section>
  );
}
