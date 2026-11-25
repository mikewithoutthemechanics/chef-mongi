import { useEffect, useRef } from 'react';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { Link } from 'react-router-dom';
import { gsap, EASE } from '../lib/gsap';
import { Magnetic } from '../components/anim/Magnetic';
import { AdinkraMark } from '../components/art/Patterns';
import { NAV_LINKS } from '../data/gallery';

export default function NotFound() {
  useDocumentMeta({
    title: 'Not found',
    description: 'That page is not on the menu. Return to the kitchen.',
    path: '/404',
  });

  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });

      tl.fromTo(
        '.nf__code span',
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.08, ease: EASE.outExpo },
      )
        .fromTo(
          '.nf__title',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9, ease: EASE.outExpo },
          '-=0.6',
        )
        .fromTo(
          '.nf__links > *',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: EASE.outExpo },
          '-=0.4',
        );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section nf">
      <AdinkraMark className="nf__mark" aria-hidden="true" />

      <div className="shell nf__inner">
        <p className="nf__code" aria-hidden="true">
          {'404'.split('').map((c, i) => (
            <span key={i}>
              {c}
            </span>
          ))}
        </p>

        <h1 className="nf__title">
          This course is <em className="display-italic gold-text">not on the menu</em>
        </h1>

        <p className="lead nf__lede">
          The page you were looking for has been plated differently. Let me point
          you back to something edible.
        </p>

        <Magnetic strength={0.26}>
          <Link to="/" className="btn btn--solid" data-cursor="Home">
            <span>Back to the kitchen</span>
            <span className="btn__arrow">→</span>
          </Link>
        </Magnetic>

        <nav className="nf__links" aria-label="Suggested pages">
          {NAV_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="nf__link">
              {l.label}
            </Link>
          ))}
          <Link to="/booking" className="nf__link">
            Booking
          </Link>
        </nav>
      </div>
    </section>
  );
}
