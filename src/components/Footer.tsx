import { Link } from 'react-router-dom';
import { gsap } from '../lib/gsap';
import { Magnetic } from './anim/Magnetic';
import { scrollTo, useLenis } from '../lib/scroll-context';
import { NAV_LINKS } from '../data/gallery';
import { useEffect, useRef } from 'react';

export function Footer() {
  const lenis = useLenis();
  const markRef = useRef<HTMLDivElement>(null);

  /* Giant wordmark that drifts horizontally as you scroll through the footer */
  useEffect(() => {
    const el = markRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { xPercent: 4 },
        {
          xPercent: -12,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom bottom', scrub: 1.2 },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer__top">
          <div>
            <p className="eyebrow">Reserve a date</p>
            <h2 className="footer__title">
              Let me cook
              <br />
              <em className="display-italic gold-text">for you.</em>
            </h2>
          </div>

          <div className="footer__cta-wrap">
            <Magnetic strength={0.3}>
              <Link to="/booking" className="btn btn--ghost footer__cta" data-cursor="Book">
                <span>Start a booking</span>
                <span className="btn__arrow">→</span>
              </Link>
            </Magnetic>
            <p className="footer__note">
              Prime dates book 4–6 weeks ahead. A 25% deposit secures your evening.
            </p>
          </div>
        </div>

        <hr className="rule" />

        <div className="footer__grid">
          <div className="footer__col">
            <p className="eyebrow">Navigate</p>
            {NAV_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="footer__link">
                {l.label}
              </Link>
            ))}
            <Link to="/booking" className="footer__link">
              Booking
            </Link>
          </div>

          <div className="footer__col">
            <p className="eyebrow">Contact</p>
            <a href="mailto:book@mongifana.com" className="footer__link">
              book@mongifana.com
            </a>
            <a href="tel:+442071234567" className="footer__link">
              +44 20 7123 4567
            </a>
            <p className="footer__muted">14 Ashwood Row, London E8</p>
          </div>

          <div className="footer__col">
            <p className="eyebrow">Follow</p>
            <a href="#" className="footer__link">
              Instagram
            </a>
            <a href="#" className="footer__link">
              Newsletter
            </a>
            <a href="#" className="footer__link">
              Press kit
            </a>
          </div>

          <div className="footer__col">
            <p className="eyebrow">Service areas</p>
            <p className="footer__muted">London · Paris · Lisbon</p>
            <p className="footer__muted">Dubai · Lagos · Amalfi</p>
            <p className="footer__muted">Worldwide on request</p>
          </div>
        </div>
      </div>

      <div className="footer__mark" ref={markRef} aria-hidden="true">
        MONGIFANA
      </div>

      <div className="footer__base shell">
        <span>© {new Date().getFullYear()} Mongi Fana. All rights reserved.</span>
        <span className="footer__base-links">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <button
            type="button"
            className="footer__top-btn"
            onClick={() => scrollTo(lenis, 0, { duration: 1.6 })}
          >
            Back to top ↑
          </button>
        </span>
      </div>
    </footer>
  );
}
