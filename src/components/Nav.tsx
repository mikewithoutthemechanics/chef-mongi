import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { gsap, EASE } from '../lib/gsap';
import { NAV_LINKS } from '../data/gallery';
import { useLenis } from '../lib/scroll-context';

export function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const location = useLocation();

  /* Hide nav on scroll down, reveal on scroll up */
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 220 && y > last && !open);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [open]);

  /* Close menu on route change */
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  /* Lock scroll + animate overlay */
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    if (open) {
      lenis?.stop();
      document.body.style.overflow = 'hidden';
      const ctx = gsap.context(() => {
        gsap
          .timeline()
          .set(overlay, { pointerEvents: 'auto' })
          .fromTo(overlay, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.85, ease: EASE.inOutQuart })
          .fromTo(
            '.nav-overlay__item',
            { yPercent: 115 },
            { yPercent: 0, duration: 0.85, ease: EASE.outExpo, stagger: 0.07 },
            '-=0.45',
          )
          .fromTo(
            '.nav-overlay__foot > *',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: EASE.outExpo },
            '-=0.5',
          );
      }, overlay);
      return () => ctx.revert();
    }

    lenis?.start();
    document.body.style.overflow = '';
    const ctx = gsap.context(() => {
      gsap.to(overlay, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 0.7,
        ease: EASE.inOutQuart,
        onComplete: () => gsap.set(overlay, { pointerEvents: 'none' }),
      });
    }, overlay);
    return () => ctx.revert();
  }, [open, lenis]);

  return (
    <>
      <header className={`nav ${hidden ? 'nav--hidden' : ''} ${scrolled ? 'nav--scrolled' : ''}`}>
        <div className="nav__inner shell">
          <Link to="/" className="nav__brand" aria-label="Mongi Fana — home">
            <span className="nav__brand-mark">MF</span>
            <span className="nav__brand-text">
              <strong>Mongi Fana</strong>
              <em>Private Chef</em>
            </span>
          </Link>

          <nav className="nav__links" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}
              >
                <span>{l.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="nav__actions">
            <Link to="/booking" className="btn btn--solid nav__cta" data-cursor="Book">
              <span>Book a table</span>
            </Link>

            <button
              type="button"
              className={`nav__burger ${open ? 'is-open' : ''}`}
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div
        ref={overlayRef}
        className="nav-overlay"
        style={{ pointerEvents: 'none' }}
        aria-hidden={!open}
      >
        <div ref={panelRef} className="nav-overlay__inner shell">
          <ul className="nav-overlay__list">
            {[...NAV_LINKS, { label: 'Booking', to: '/booking' }].map((l, i) => (
              <li key={l.to} className="nav-overlay__item-wrap">
                <span className="nav-overlay__num">0{i + 1}</span>
                <span className="nav-overlay__mask">
                  <NavLink
                    to={l.to}
                    className="nav-overlay__item"
                    onClick={() => setOpen(false)}
                    tabIndex={open ? 0 : -1}
                  >
                    {l.label}
                  </NavLink>
                </span>
              </li>
            ))}
          </ul>

          <div className="nav-overlay__foot">
            <div>
              <p className="eyebrow">Enquiries</p>
              <a href="mailto:book@mongifana.com" tabIndex={open ? 0 : -1}>
                book@mongifana.com
              </a>
              <a href="tel:+442071234567" tabIndex={open ? 0 : -1}>
                +44 20 7123 4567
              </a>
            </div>
            <div>
              <p className="eyebrow">Studio</p>
              <p>14 Ashwood Row, London E8</p>
              <p>Available UK · EU · Gulf</p>
            </div>
            <div>
              <p className="eyebrow">Follow</p>
              <a href="#" tabIndex={open ? 0 : -1}>Instagram</a>
              <a href="#" tabIndex={open ? 0 : -1}>Journal</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
