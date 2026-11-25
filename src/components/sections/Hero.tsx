import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, SplitText, EASE } from '../../lib/gsap';
import { ChefPortrait } from '../art/ChefPortrait';
import { AdinkraMark } from '../art/Patterns';
import { Magnetic } from '../anim/Magnetic';
import { scrollTo, useLenis } from '../../lib/scroll-context';

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scrollCueRef = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const root = rootRef.current;
    const title = titleRef.current;
    if (!root || !title) return;

    const ctx = gsap.context(() => {
      /* ---- Entrance timeline ---- */
      const split = new SplitText(title, {
        type: 'lines',
        linesClass: 'hero__line',
        mask: 'lines',
        autoSplit: true,
      });

      const tl = gsap.timeline({ delay: 0.15 });

      tl.fromTo(
        '.hero__eyebrow',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.9, ease: EASE.outExpo },
      )
        .fromTo(
          split.lines,
          { yPercent: 118 },
          { yPercent: 0, duration: 1.4, stagger: 0.11, ease: EASE.outExpo },
          '-=0.5',
        )
        .fromTo(
          '.hero__sub > *',
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: EASE.outExpo },
          '-=0.85',
        )
        .fromTo(
          '.hero__portrait',
          { opacity: 0, scale: 1.12, clipPath: 'inset(14% 10% 14% 10%)' },
          {
            opacity: 1,
            scale: 1,
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.6,
            ease: EASE.outExpo,
          },
          '-=1.2',
        )
        .fromTo(
          '.hero__float',
          { opacity: 0, scale: 0.6 },
          { opacity: 1, scale: 1, duration: 1.1, stagger: 0.14, ease: EASE.back },
          '-=1.1',
        )
        .fromTo(
          scrollCueRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8, ease: EASE.soft },
          '-=0.6',
        );

      /* ---- Scroll-driven hero exit ---- */
      gsap.to('.hero__portrait', {
        yPercent: 18,
        scale: 0.94,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 1 },
      });

      gsap.to('.hero__content', {
        yPercent: -28,
        opacity: 0.15,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 1 },
      });

      /* ---- Idle float on decorative marks ---- */
      gsap.to('.hero__float--a', {
        y: -22,
        rotate: 8,
        duration: 5.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.hero__float--b', {
        y: 18,
        rotate: -6,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.hero__float--c', {
        y: -14,
        duration: 6.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      /* ---- Scroll cue pulse ---- */
      gsap.to('.hero__cue-line', {
        scaleY: 0.2,
        transformOrigin: 'top',
        duration: 1.1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="hero">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__bg-glow" />
        <div className="hero__bg-grid" />
      </div>
      <div className="hero__inner shell">
        <div className="hero__content">
          <p className="eyebrow hero__eyebrow">Private Chef · Afro-Global</p>

          <h1 ref={titleRef} className="hero__title">
            <span>Flame,</span>
            <span>
              heritage, <em className="display-italic gold-text">horizon.</em>
            </span>
          </h1>

          <div className="hero__sub">
            <p className="lead hero__lede">
              I am Mongi Fana. I cook West African soul with the rigour of the
              world’s great dining rooms — in your home, at your table, on your
              schedule.
            </p>

            <div className="hero__actions">
              <Magnetic strength={0.28}>
                <Link to="/booking" className="btn btn--solid" data-cursor="Book">
                  <span>Reserve a date</span>
                  <span className="btn__arrow">→</span>
                </Link>
              </Magnetic>

              <Magnetic strength={0.24}>
                <Link to="/menu" className="btn btn--ghost" data-cursor="Taste">
                  <span>Explore the menu</span>
                </Link>
              </Magnetic>
            </div>

            <ul className="hero__facts">
              <li>
                <strong>Michelin</strong>
                <span>2018 – 2021</span>
              </li>
              <li>
                <strong>380+</strong>
                <span>Private services</span>
              </li>
              <li>
                <strong>21</strong>
                <span>Countries</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__portrait">
            <ChefPortrait className="hero__portrait-img" />
            <div className="hero__portrait-frame" aria-hidden="true" />
          </div>

          <AdinkraMark className="hero__float hero__float--a" />
          <div className="hero__float hero__float--b hero__badge">
            <span className="hero__badge-star">✦</span>
            <span>
              Tamale
              <em>to the world</em>
            </span>
          </div>
          <div className="hero__float hero__float--c hero__pill">
            <span className="hero__pill-dot" />
            Now booking Spring 2026
          </div>
        </div>
      </div>

      <button
        ref={scrollCueRef}
        type="button"
        className="hero__cue"
        onClick={() => scrollTo(lenis, '#philosophy', { offset: -60 })}
        aria-label="Scroll to philosophy"
      >
        <span className="hero__cue-line" />
        <span className="hero__cue-text">Scroll</span>
      </button>
    </section>
  );
}
